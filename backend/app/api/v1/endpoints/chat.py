from fastapi import APIRouter, HTTPException, Depends
from app.api.v1.schemas import ChatRequest, ChatResponse
from app.core.gemini_client import GeminiClient
from app.services.content_processor import ContentProcessor
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/chat", response_model=ChatResponse)
async def process_chat(request: ChatRequest):
    """
    Process a chat request from the extension.
    
    Args:
        request: The chat request containing API key, query, and webpage context
        
    Returns:
        ChatResponse with the AI's answer
        
    Raises:
        HTTPException: If there's an error processing the request
    """
    try:
        logger.info(f"Received chat request for URL: {request.context.url}")
        
        # Process and potentially truncate content
        processed_context = ContentProcessor.truncate_content_if_needed(request.context)
        
        # Construct prompt
        prompt = ContentProcessor.construct_prompt(processed_context, request.query)
        
        # Initialize Gemini client with user's API key
        gemini_client = GeminiClient(api_key=request.apiKey)
        
        # Generate response
        answer = gemini_client.generate_response(prompt)
        
        logger.info("Successfully generated response from Gemini API")
        return ChatResponse(answer=answer)
        
    except Exception as e:
        error_msg = f"Error processing chat request: {str(e)}"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)
