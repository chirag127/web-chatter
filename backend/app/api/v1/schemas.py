from pydantic import BaseModel, HttpUrl, Field
from typing import Optional

class PageContext(BaseModel):
    """
    Model representing the context of a webpage.
    """
    url: HttpUrl
    title: str
    metaDescription: Optional[str] = None
    metaKeywords: Optional[str] = None
    pageText: str = Field(..., description="The main text content of the webpage")

class ChatRequest(BaseModel):
    """
    Model representing a chat request from the extension.
    """
    apiKey: str = Field(..., description="User's Gemini API key")
    query: str = Field(..., description="User's question about the webpage")
    context: PageContext

class ChatResponse(BaseModel):
    """
    Model representing a chat response from the API.
    """
    answer: str = Field(..., description="AI's response to the user's query")

class ErrorResponse(BaseModel):
    """
    Model representing an error response.
    """
    detail: str = Field(..., description="Error message")
