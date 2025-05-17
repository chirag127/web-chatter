import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Logger
logger = logging.getLogger(__name__)

class Settings:
    """
    Application settings and configuration.
    """
    # API Configuration
    API_V1_STR: str = "/api/v1"
    
    # Gemini API Configuration
    PRIMARY_GEMINI_MODEL: str = os.getenv(
        "PRIMARY_GEMINI_MODEL", 
        "gemini-1.5-flash-latest"  # Default model name, may need to be updated
    )
    FALLBACK_GEMINI_MODEL: str = os.getenv(
        "FALLBACK_GEMINI_MODEL", 
        "gemini-pro"  # Default fallback model, may need to be updated
    )
    TOKEN_THRESHOLD_FOR_FALLBACK: int = int(os.getenv("TOKEN_THRESHOLD_FOR_FALLBACK", "200000"))
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    def __init__(self):
        """
        Initialize settings and validate configuration.
        """
        # Log configuration information
        logger.info(f"Using PRIMARY_GEMINI_MODEL: {self.PRIMARY_GEMINI_MODEL}")
        logger.info(f"Using FALLBACK_GEMINI_MODEL: {self.FALLBACK_GEMINI_MODEL}")
        logger.info(f"Token threshold for fallback model: {self.TOKEN_THRESHOLD_FOR_FALLBACK}")

# Create settings instance
settings = Settings()
