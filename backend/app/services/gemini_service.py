import google.generativeai as genai
from app.core.config import settings
from typing import Tuple

class GeminiService:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)

    def generate_content(self, prompt_parts: list, use_fallback_model: bool = False) -> Tuple[str, str]:
        model_name = settings.GEMINI_FALLBACK_MODEL if use_fallback_model else settings.GEMINI_PRIMARY_MODEL

        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt_parts)

            if not response.text:
                raise ValueError("Empty response from Gemini API")

            return response.text, model_name

        except Exception as e:
            if not use_fallback_model:
                # If using primary model and it fails, try fallback
                return self.generate_content(prompt_parts, use_fallback_model=True)
            # If already using fallback model, or other error, re-raise
            raise
