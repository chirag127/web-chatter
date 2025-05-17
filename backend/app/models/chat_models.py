from pydantic import BaseModel, HttpUrl
from typing import Optional

class MetaData(BaseModel):
    description: Optional[str] = None
    keywords: Optional[str] = None

class ChatRequest(BaseModel):
    page_content: str
    page_url: HttpUrl
    page_title: str
    meta_data: MetaData
    user_query: str
    api_key: str

class ChatResponse(BaseModel):
    ai_response: str
    model_used: str
