from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str = ""
    # URL base para soporte multi-proveedor (Deepseek, Ollama, etc.)
    openai_base_url: str = "https://api.openai.com/v1"
    ai_model: str = "gpt-3.5-turbo"

    class Config:
        env_file = ".env"

settings = Settings()
