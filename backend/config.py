from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    posthog_api_key: str = ""
    posthog_project_id: str = ""
    posthog_host: str = "https://us.i.posthog.com"
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
