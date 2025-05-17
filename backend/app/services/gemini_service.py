import logging
import google.generativeai as genai
from typing import AsyncGenerator, Dict, Any, Optional
from fastapi import HTTPException

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Gemini model names
PRIMARY_MODEL = "gemini-2.5-flash-preview-04-17"
FALLBACK_MODEL = "gemini-2.0-flash-lite"


class GeminiService:
    """
    Service for interacting with the Google Gemini API.
    """

    @staticmethod
    def _initialize_client(api_key: str) -> None:
        """
        Initialize the Gemini client with the user's API key.
        
        Args:
            api_key: User's Gemini API key
        """
        genai.configure(api_key=api_key)

    @staticmethod
    def _create_prompt(
        page_content: str,
        page_url: str,
        page_title: str,
        page_meta_description: Optional[str],
        user_query: str
    ) -> str:
        """
        Create a prompt for the Gemini API based on the webpage content and user query.
        
        Args:
            page_content: Extracted text content from the webpage
            page_url: URL of the webpage
            page_title: Title of the webpage
            page_meta_description: Meta description of the webpage (optional)
            user_query: User's question about the webpage
            
        Returns:
            Formatted prompt string
        """
        # Build context information
        context = f"URL: {page_url}\nTitle: {page_title}\n"
        
        if page_meta_description:
            context += f"Description: {page_meta_description}\n"
            
        context += f"\nContent:\n{page_content}\n\n"
        
        # Create the full prompt
        prompt = (
            f"You are WebPage Chatter, a helpful AI assistant that answers questions about webpage content. "
            f"Below is information about a webpage including its URL, title, and main content. "
            f"Please answer the user's question based ONLY on the information provided. "
            f"If the answer cannot be determined from the given content, say so clearly. "
            f"Do not make up information or use external knowledge not present in the provided content.\n\n"
            f"--- WEBPAGE INFORMATION ---\n{context}\n"
            f"--- USER QUESTION ---\n{user_query}\n\n"
            f"--- YOUR ANSWER ---"
        )
        
        return prompt

    @staticmethod
    async def generate_response(
        api_key: str,
        page_content: str,
        page_url: str,
        page_title: str,
        page_meta_description: Optional[str],
        user_query: str
    ) -> AsyncGenerator[str, None]:
        """
        Generate a response from Gemini API based on webpage content and user query.
        
        Args:
            api_key: User's Gemini API key
            page_content: Extracted text content from the webpage
            page_url: URL of the webpage
            page_title: Title of the webpage
            page_meta_description: Meta description of the webpage (optional)
            user_query: User's question about the webpage
            
        Yields:
            Chunks of the generated response
            
        Raises:
            HTTPException: If there's an error with the Gemini API
        """
        try:
            # Initialize the Gemini client with the user's API key
            GeminiService._initialize_client(api_key)
            
            # Create the prompt
            prompt = GeminiService._create_prompt(
                page_content, page_url, page_title, page_meta_description, user_query
            )
            
            # Try with primary model first
            try:
                logger.info(f"Attempting to use primary model: {PRIMARY_MODEL}")
                model = genai.GenerativeModel(PRIMARY_MODEL)
                response = model.generate_content(prompt, stream=True)
                
                for chunk in response:
                    if hasattr(chunk, 'text'):
                        yield chunk.text
                    
            except Exception as primary_error:
                logger.warning(f"Error with primary model: {str(primary_error)}")
                
                # Check if it's a token limit error
                if "exceeds the maximum token limit" in str(primary_error):
                    logger.info(f"Falling back to secondary model: {FALLBACK_MODEL}")
                    
                    # Try with fallback model
                    model = genai.GenerativeModel(FALLBACK_MODEL)
                    response = model.generate_content(prompt, stream=True)
                    
                    for chunk in response:
                        if hasattr(chunk, 'text'):
                            yield chunk.text
                else:
                    # Re-raise if it's not a token limit error
                    raise primary_error
                
        except Exception as e:
            error_message = str(e)
            logger.error(f"Gemini API error: {error_message}")
            
            # Map common Gemini API errors to appropriate HTTP status codes
            if "API key not valid" in error_message or "invalid API key" in error_message:
                raise HTTPException(status_code=401, detail="Invalid Gemini API key")
            elif "quota exceeded" in error_message or "rate limit" in error_message:
                raise HTTPException(status_code=429, detail="Gemini API quota exceeded or rate limited")
            else:
                raise HTTPException(status_code=500, detail=f"Gemini API error: {error_message}")
