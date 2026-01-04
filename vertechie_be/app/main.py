"""
VerTechie FastAPI Application
Main entry point for the API server.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.api.v1 import api_router
from app.middleware.cors import setup_cors
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.logging import LoggingMiddleware
from app.core.security_enhanced import SecurityHeadersMiddleware
from app.db.session import engine
from app.db.base import Base


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """
    Lifespan context manager for startup and shutdown events.
    """
    # Startup
    print("🚀 Starting VerTechie API...")
    
    # Create database tables (in production, use Alembic migrations)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    print("✅ Database tables created")
    print(f"📚 API docs available at: http://localhost:{settings.PORT}{settings.DOCS_URL}")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down VerTechie API...")
    await engine.dispose()


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    """
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="""
        ## VerTechie API
        
        The backend API for VerTechie - a comprehensive platform for tech professionals.
        
        ### Features
        - 🔐 Authentication & Authorization
        - 👤 User Profiles & Networking
        - 💼 Job Postings & Applications
        - 📚 Learning & Courses
        - 📅 Calendar & Scheduling
        - 💬 Chat & Messaging
        - 👥 Community & Groups
        
        ### Documentation
        - [Swagger UI](/docs)
        - [ReDoc](/redoc)
        """,
        docs_url=settings.DOCS_URL,
        redoc_url=settings.REDOC_URL,
        openapi_url=settings.OPENAPI_URL,
        lifespan=lifespan,
    )
    
    # Setup CORS
    setup_cors(app)
    
    # Add middleware
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(RateLimitMiddleware)
    
    # Security headers (OWASP recommended)
    # Note: Apply in production via ASGI wrapper
    # app = SecurityHeadersMiddleware(app)
    
    # Include API routes
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)
    
    # Exception handlers
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.detail},
        )
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={
                "error": "Validation error",
                "detail": exc.errors(),
            },
        )
    
    # Health check endpoint
    @app.get("/health", tags=["Health"])
    async def health_check():
        return {
            "status": "healthy",
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
        }
    
    # Root endpoint
    @app.get("/", tags=["Root"])
    async def root():
        return {
            "message": "Welcome to VerTechie API",
            "version": settings.APP_VERSION,
            "docs": settings.DOCS_URL,
        }
    
    return app


# Create app instance
app = create_app()


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        workers=settings.WORKERS if not settings.DEBUG else 1,
    )

