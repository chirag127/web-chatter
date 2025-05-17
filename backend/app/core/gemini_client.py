import logging
from google import genai
from app.core.config import settings

logger = logging.getLogger(__name__)

class GeminiClient:
    """
    Client for interacting with Google's Gemini API.
    """
    
    def __init__(self, api_key: str):
        """
        Initialize the Gemini client with the user's API key.
        
        Args:
            api_key: The user's Gemini API key
        """
        self.api_key = api_key
        self.client = genai.Client(api_key=api_key)
        logger.debug("Gemini client initialized")
    
    def estimate_token_count(self, text: str) -> int:
        """
        Estimate the token count for a given text.
        This is a simple approximation - in production, consider using a proper tokenizer.
        
        Args:
            text: The text to estimate token count for
            
        Returns:
            Estimated token count
        """
        # Simple approximation: 1 token ≈ 4 characters
        return len(text) // 4
    
    def select_model(self, token_count: int) -> str:
        """
        Select the appropriate model based on token count.
        
        Args:
            token_count: Estimated token count
            
        Returns:
            Model name to use
        """
        if token_count <= settings.TOKEN_THRESHOLD_FOR_FALLBACK:
            logger.info(f"Using primary model: {settings.PRIMARY_GEMINI_MODEL}")
            return settings.PRIMARY_GEMINI_MODEL
        else:
            logger.info(f"Token count ({token_count}) exceeds threshold, using fallback model: {settings.FALLBACK_GEMINI_MODEL}")
            return settings.FALLBACK_GEMINI_MODEL
    
    def generate_response(self, prompt: str) -> str:
        """
        Generate a response from Gemini based on the prompt.
        
        Args:
            prompt: The structured prompt including context and query
            
        Returns:
            Gemini's response text
            
        Raises:
            Exception: If there's an error with the Gemini API
        """
        try:
            # Estimate token count and select model
            token_count = self.estimate_token_count(prompt)
            model_name = self.select_model(token_count)
            
            # Generate content
            response = self.client.generate_content(
                model=model_name,
                contents=prompt
            )
            
            # Return the response text
            return response.text
            
        except Exception as e:
            logger.error(f"Error generating response from Gemini: {str(e)}")
            raise
