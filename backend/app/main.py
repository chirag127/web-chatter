from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import logging
import os
from typing import Optional

from app.models.chat_models import ChatRequest, ErrorResponse
from app.services.gemini_service import GeminiService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="WebPage Chatter API",
    description="Backend API for the WebPage Chatter browser extension",
    version="1.0.0",
)

# Add CORS middleware to allow requests from the browser extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for browser extension
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """
    Root endpoint for health check.
    """
    return {"status": "ok", "message": "WebPage Chatter API is running"}


@app.post("/api/chat", response_model=None)
async def chat(request: ChatRequest):
    """
    Process a chat request from the extension and stream the response from Gemini API.
    
    Args:
        request: Chat request containing API key, page content, and user query
        
    Returns:
        StreamingResponse: Streamed response from Gemini API
    """
    logger.info(f"Received chat request for URL: {request.pageUrl}")
    
    # Validate request
    if not request.apiKey:
        raise HTTPException(status_code=400, detail="Gemini API key is required")
    
    if not request.userQuery:
        raise HTTPException(status_code=400, detail="User query is required")
    
    if not request.pageContent:
        logger.warning("Page content is empty or minimal")
    
    # Create async generator for streaming response
    async def response_generator():
        async for text_chunk in GeminiService.generate_response(
            api_key=request.apiKey,
            page_content=request.pageContent,
            page_url=request.pageUrl,
            page_title=request.pageTitle,
            page_meta_description=request.pageMetaDescription,
            user_query=request.userQuery
        ):
            yield f"data: {text_chunk}\n\n"
    
    # Return streaming response
    return StreamingResponse(
        response_generator(),
        media_type="text/event-stream",
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Handle HTTP exceptions and return structured error responses.
    """
    logger.error(f"HTTP error: {exc.status_code} - {exc.detail}")
    return ErrorResponse(error=str(exc.detail))


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    Handle general exceptions and return structured error responses.
    """
    logger.error(f"Unhandled exception: {str(exc)}")
    return ErrorResponse(error="Internal server error", details=str(exc))


if __name__ == "__main__":
    import uvicorn
    
    # Get host and port from environment variables or use defaults
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8080"))
    
    # Run the FastAPI app with uvicorn
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
