import logging
from app.api.v1.schemas import PageContext

logger = logging.getLogger(__name__)

class ContentProcessor:
    """
    Service for processing webpage content and constructing prompts.
    """
    
    @staticmethod
    def construct_prompt(context: PageContext, query: str) -> str:
        """
        Construct a structured prompt for the Gemini API.
        
        Args:
            context: The webpage context (URL, title, meta tags, content)
            query: The user's query
            
        Returns:
            A structured prompt string
        """
        # Create a structured prompt with labeled sections
        prompt = f"""
You are a helpful assistant that answers questions about web pages. 
Please provide a concise, accurate, and helpful response to the user's question based on the webpage content provided below.

WEBPAGE INFORMATION:
URL: {context.url}
TITLE: {context.title}
"""
        
        # Add meta description if available
        if context.metaDescription:
            prompt += f"META DESCRIPTION: {context.metaDescription}\n"
            
        # Add meta keywords if available
        if context.metaKeywords:
            prompt += f"META KEYWORDS: {context.metaKeywords}\n"
            
        # Add page content and user query
        prompt += f"""
PAGE CONTENT:
{context.pageText}

USER QUESTION:
{query}

Please answer the question based solely on the information provided in the webpage content. 
If the answer cannot be determined from the provided content, please state that clearly.
Provide your response in a clear, concise manner. Use markdown formatting when appropriate to improve readability.
"""
        
        logger.debug("Constructed prompt for Gemini API")
        return prompt
    
    @staticmethod
    def truncate_content_if_needed(context: PageContext, max_chars: int = 800000) -> PageContext:
        """
        Truncate page content if it exceeds a certain length.
        
        Args:
            context: The webpage context
            max_chars: Maximum number of characters for page content
            
        Returns:
            PageContext with potentially truncated content
        """
        if len(context.pageText) > max_chars:
            logger.info(f"Truncating page content from {len(context.pageText)} to {max_chars} characters")
            truncated_text = context.pageText[:max_chars] + "... [Content truncated due to length]"
            
            # Create a new PageContext with truncated text
            return PageContext(
                url=context.url,
                title=context.title,
                metaDescription=context.metaDescription,
                metaKeywords=context.metaKeywords,
                pageText=truncated_text
            )
        
        return context
