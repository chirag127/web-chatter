import google.generativeai as genai
import asyncio
import re
from typing import List, Dict, Any, Optional

class GeminiClient:
    """Client for interacting with Google's Gemini API"""

    def __init__(self, api_key: str):
        """Initialize the Gemini client with API key"""
        self.api_key = api_key
        genai.configure(api_key=api_key)

        # Available models
        self.default_model = "gemini-2.5-flash-preview-0417"
        self.fallback_model = "gemini-2.0-flash-lite"

        # Token estimation constants
        self.char_per_token_ratio = 4  # Approximate ratio for estimation
        self.token_limit = 200000  # Switch to fallback model if exceeding this

    def estimate_tokens(self, text: str) -> int:
        """Estimate the number of tokens in the text

        This is a simple approximation. For more accurate counting,
        a proper tokenizer should be used.
        """
        if not text:
            return 0
        return len(text) // self.char_per_token_ratio

    def select_model(self, content_length: int) -> str:
        """Select appropriate model based on content length"""
        estimated_tokens = self.estimate_tokens(content_length)

        if estimated_tokens > self.token_limit:
            return self.fallback_model
        return self.default_model

    def construct_prompt(self, query: str, url: str, title: str,
                         meta_tags: Dict[str, str], content: str,
                         conversation: List[Dict[str, str]]) -> str:
        """Construct a prompt for Gemini based on page content and query"""
        # Create a structured prompt with page context
        prompt = f"""You are Web Chatter, a helpful AI assistant that answers questions about web pages.

Current webpage information:
URL: {url}
Title: {title}
"""

        # Add meta tags if available
        if meta_tags:
            prompt += "\nMeta Tags:\n"
            for key, value in meta_tags.items():
                prompt += f"- {key}: {value}\n"

        # Add page content
        prompt += f"\nPage Content:\n{content}\n\n"

        # Add conversation history if available
        if conversation and len(conversation) > 0:
            prompt += "Previous conversation:\n"
            for message in conversation[:-1]:  # Exclude the latest user query which we'll add separately
                role = message.get('role', '')
                content = message.get('content', '')
                prompt += f"{role.capitalize()}: {content}\n"

        # Add the current query
        prompt += f"\nUser's question: {query}\n\n"
        prompt += "Please provide a helpful, accurate, and concise response based on the webpage content."

        return prompt

    async def generate_response(self, query: str, url: str, title: str,
                              meta_tags: Dict[str, str], content: str,
                              conversation: List[Dict[str, str]] = []) -> str:
        """Generate a response using Gemini API"""
        try:
            # Construct the prompt
            prompt = self.construct_prompt(
                query=query,
                url=url,
                title=title,
                meta_tags=meta_tags,
                content=content,
                conversation=conversation
            )

            # Select appropriate model based on content length
            model_name = self.select_model(len(prompt))
            print(f"Using model: {model_name} for content of estimated token length: {self.estimate_tokens(prompt)}")

            # Get the model
            model = genai.GenerativeModel(model_name)

            # Generate content asynchronously
            response = await model.generate_content_async(prompt)

            # Extract and return the text response
            if response and response.text:
                return response.text
            else:
                return "I couldn't generate a response based on the provided content. Please try rephrasing your question."

        except Exception as e:
            # Log the error and return a user-friendly message
            error_message = str(e)
            print(f"Error generating response: {error_message}")

            # Provide more specific error messages
            if "API key not valid" in error_message:
                return "Error: Invalid API key. Please check your API key in the settings."
            elif "quota exceeded" in error_message.lower():
                return "Error: API quota exceeded. Please try again later."
            elif "content filtered" in error_message.lower():
                return "Error: The content was filtered by Gemini's safety settings. Please try a different query."
            else:
                return f"Error: An issue occurred while processing your request. Please try again later."