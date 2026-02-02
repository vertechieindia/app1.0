"""
Application configuration using Pydantic Settings.
"""

from typing import List, Optional
from pydantic_settings import BaseSettings
from functools import lru_cache


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
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    # Email - Gmail SMTP settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USE_TLS: bool = True
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: str = "tminnovations.manager@gmail.com"
    EMAILS_FROM_NAME: str = "VerTechie"
    
    # AWS S3
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_S3_BUCKET: Optional[str] = None
    AWS_S3_REGION: str = "us-east-1"
    
    # OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    LINKEDIN_CLIENT_ID: Optional[str] = None
    LINKEDIN_CLIENT_SECRET: Optional[str] = None
    # Environment: "development" or "production" – chooses which OAuth credentials to use
    ENVIRONMENT: str = "development"
    # GitHub – development (local)
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None
    GITHUB_CALLBACK_URL: Optional[str] = None  # e.g. http://localhost:5173/github/callback
    # GitHub – production (set when ENVIRONMENT=production)
    GITHUB_CLIENT_ID_PRODUCTION: Optional[str] = None
    GITHUB_CLIENT_SECRET_PRODUCTION: Optional[str] = None
    GITHUB_CALLBACK_URL_PRODUCTION: Optional[str] = None  # e.g. https://yourdomain.com/github/callback
    # GitLab – development
    GITLAB_CLIENT_ID: Optional[str] = None
    GITLAB_CLIENT_SECRET: Optional[str] = None
    GITLAB_CALLBACK_URL: Optional[str] = None
    # GitLab – production
    GITLAB_CLIENT_ID_PRODUCTION: Optional[str] = None
    GITLAB_CLIENT_SECRET_PRODUCTION: Optional[str] = None
    GITLAB_CALLBACK_URL_PRODUCTION: Optional[str] = None
    
    # External APIs
    GIPHY_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # Azure Document Intelligence (OCR) - Set in .env file
    AZURE_DOC_ENDPOINT: str = ""
    AZURE_DOC_KEY: str = ""
    
    # Azure Face API (Liveness) - Set in .env file
    AZURE_FACE_ENDPOINT: str = ""
    AZURE_FACE_KEY: str = ""
    
    # SMTP Email Settings - Set in .env file
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    FROM_EMAIL: str = "noreply@vertechie.com"
    
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore"
    }


def get_settings() -> Settings:
    """Get settings instance (reload each time to pick up env changes)."""
    return Settings(_env_file=".env")


settings = get_settings()

