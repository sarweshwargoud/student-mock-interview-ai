import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    GEMINI_API_KEY: str
    PORT: int = 8000

    class Config:
        env_file = ".env"

settings = Settings()
