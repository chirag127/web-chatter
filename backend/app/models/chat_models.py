from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """
    Model for chat request from the extension.
    """
    apiKey: str = Field(..., description="User's Google Gemini API key")
    pageContent: str = Field(..., description="Extracted text content from the webpage")
    pageUrl: str = Field(..., description="URL of the webpage")
    pageTitle: str = Field(..., description="Title of the webpage")
    pageMetaDescription: str = Field(None, description="Meta description of the page (optional)")
    userQuery: str = Field(..., description="User's question about the webpage")


class ErrorResponse(BaseModel):
    """
    Model for error responses.
    """
    error: str = Field(..., description="Error message")
    details: str = Field(None, description="Additional error details (optional)")
