from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.gemini_client import GeminiClient
from app.api.endpoints import gemini
from app.core.config import settings

# Create FastAPI app
app = FastAPI(
    title="Web Chatter API",
    description="Backend API for Web Chatter Chrome Extension",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your extension's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(gemini.router, prefix="/api/gemini", tags=["gemini"])

# Define request model
class ChatRequest(BaseModel):
    query: str
    url: str
    title: str
    metaTags: Dict[str, str] = {}
    content: str
    conversation: List[Dict[str, str]] = []
    apiKey: str

# Define response model
class ChatResponse(BaseModel):
    answer: str

# Chat endpoint
@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Initialize Gemini client with API key
        gemini_client = GeminiClient(request.apiKey)

        # Process the request and get response
        response = await gemini_client.generate_response(
            query=request.query,
            url=request.url,
            title=request.title,
            meta_tags=request.metaTags,
            content=request.content,
            conversation=request.conversation
        )

        return ChatResponse(answer=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}