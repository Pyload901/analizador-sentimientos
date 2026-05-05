from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_uri: str = "mongodb://mongodb:27017/analizador_sentimientos"
    ia_service_url: str = "http://llm_service:8001/api/analyze"
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
