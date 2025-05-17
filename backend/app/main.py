from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models.chat_models import ChatRequest, ChatResponse
from app.services.gemini_service import GeminiService
from app.core.config import settings

app = FastAPI(title="WebPage Chatter API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        service = GeminiService(api_key=request.api_key)

        # Prepare context for Gemini
        context = f"""
        Context from webpage:
        URL: {request.page_url}
        Title: {request.page_title}
        Meta Description: {request.meta_data.description if request.meta_data.description else 'N/A'}
        Meta Keywords: {request.meta_data.keywords if request.meta_data.keywords else 'N/A'}

        Content:
        {request.page_content}

        Question: {request.user_query}
        """

        try:
            response_text, model_used = service.generate_content([context])
            return ChatResponse(ai_response=response_text, model_used=model_used)
        except Exception as e:
            # Try with fallback model if primary fails
            response_text, model_used = service.generate_content([context], use_fallback_model=True)
            return ChatResponse(ai_response=response_text, model_used=model_used)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
