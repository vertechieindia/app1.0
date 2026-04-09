"""
Application configuration using Pydantic Settings.
"""

from typing import List, Optional, Any
from pydantic_settings import BaseSettings
from pydantic import field_validator
from functools import lru_cache
from pathlib import Path


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "VerTechie API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4
    
    # Database - PostgreSQL (default, can be overridden via .env)
    # Format: postgresql+asyncpg://user:password@host:port/database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/vertechie"
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 10
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-in-production-please"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours for development
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]

    # Frontend base URL (for emails, meeting links, redirects). Must set FRONTEND_URL in .env in production (e.g. https://vertechie.com) so forgot-password and other email links use the correct domain.
    FRONTEND_URL: str = "http://localhost:5173"

    
    # Email - SMTP settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USE_TLS: bool = True
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = "tminnovations.manager@gmail.com"
    EMAILS_FROM_NAME: str = "VerTechie"
    FROM_EMAIL: str = "noreply@vertechie.com"
    
    # AWS S3
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_S3_BUCKET: Optional[str] = None
    AWS_S3_REGION: str = "us-east-1"
    
    # OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_CALENDAR_REDIRECT_URI: Optional[str] = None  # e.g. http://localhost:5173/calendar/callback/google
    MICROSOFT_CLIENT_ID: Optional[str] = None
    MICROSOFT_CLIENT_SECRET: Optional[str] = None
    MICROSOFT_CALENDAR_REDIRECT_URI: Optional[str] = None  # e.g. http://localhost:5173/calendar/callback/microsoft
    LINKEDIN_CLIENT_ID: Optional[str] = None
    LINKEDIN_CLIENT_SECRET: Optional[str] = None
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None
    # Optional explicit GitHub OAuth callback URL (e.g., http://localhost:5173/github/callback)
    GITHUB_CALLBACK_URL: Optional[str] = None
    GITLAB_CLIENT_ID: Optional[str] = None
    GITLAB_CLIENT_SECRET: Optional[str] = None
    # Optional explicit GitLab OAuth callback URL (e.g., http://localhost:5173/gitlab/callback)
    GITLAB_CALLBACK_URL: Optional[str] = None
    
    # External APIs
    GIPHY_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # Azure Document Intelligence (OCR) - Set in .env file
    AZURE_DOC_ENDPOINT: str = ""
    AZURE_DOC_KEY: str = ""
    
    # Azure Face API (Liveness) - Set in .env file
    AZURE_FACE_ENDPOINT: str = ""
    AZURE_FACE_KEY: str = ""

    # Optional remote judge base URL (HTTP POST {url}/execute). Unset = embedded judge in main API (port 8000).
    JUDGE_SERVICE_URL: Optional[str] = None

    def resolved_judge_service_url(self) -> Optional[str]:
        """
        Remote judge only: e.g. http://judge:8001 if you run a separate runner.
        If unset, code execution uses the embedded judge (no extra process).
        """
        raw = self.JUDGE_SERVICE_URL
        if raw is not None and str(raw).strip():
            return str(raw).strip().rstrip("/")
        return None
    
    # Always resolve .env relative to backend project root, not process CWD.
    _ENV_FILE_PATH = Path(__file__).resolve().parents[2] / ".env"

    model_config = {
        "env_file": str(_ENV_FILE_PATH),
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore"
    }

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug_flag(cls, value: Any) -> bool:
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"1", "true", "yes", "on", "debug", "dev", "development"}:
                return True
            if normalized in {"0", "false", "no", "off", "release", "prod", "production"}:
                return False
        return bool(value)


def get_settings() -> Settings:
    """Get settings instance (reload each time to pick up env changes)."""
    return Settings()


settings = get_settings()
