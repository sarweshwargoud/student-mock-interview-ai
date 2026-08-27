import os
from pydantic_settings import BaseSettings

_env_file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")

class Settings(BaseSettings):
    DATABASE_URL: str
    GEMINI_API_KEY: str
    PORT: int = 8000

    class Config:
        env_file = (_env_file_path, ".env")
        extra = "ignore"

settings = Settings()