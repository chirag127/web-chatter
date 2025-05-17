from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_PRIMARY_MODEL: str = "gemini-2.5-flash-preview-04-17"
    GEMINI_FALLBACK_MODEL: str = "gemini-2.0-flash-lite"
    ALLOWED_ORIGINS: List[str] = []  # Will be populated from environment variable

    class Config:
        env_file = ".env"

settings = Settings()
