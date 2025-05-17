from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict
from app.services.gemini_client import GeminiClient
from app.core.config import settings

router = APIRouter()

def get_gemini_client() -> GeminiClient:
    """Dependency to get Gemini client instance"""
    return GeminiClient(api_key=settings.GEMINI_API_KEY)

@router.post("/chat")
async def chat_with_gemini(
    query: str,
    url: str,
    title: str,
    meta_tags: Dict[str, str],
    content: str,
    conversation: List[Dict[str, str]] = [],
    gemini_client: GeminiClient = Depends(get_gemini_client)
):
    """
    Endpoint to handle chat requests with Gemini API

    Args:
        query: User's question
        url: Current webpage URL
        title: Page title
        meta_tags: Page meta tags
        content: Page content
        conversation: Conversation history

    Returns:
        Gemini's response
    """
    try:
        response = await gemini_client.generate_response(
            query=query,
            url=url,
            title=title,
            meta_tags=meta_tags,
            content=content,
            conversation=conversation
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )