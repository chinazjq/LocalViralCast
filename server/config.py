from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "LocalViralCast"
    api_prefix: str = "/api"
    host: str = "0.0.0.0"
    port: int = 8000

    database_url: str = "sqlite:///./server/data/lvc.sqlite"

    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.1"
    ollama_timeout_seconds: float = 120.0

    data_dir: Path = Field(default=Path("server/data"))
    output_dir: Path = Field(default=Path("server/data/outputs"))

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="LVC_",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
