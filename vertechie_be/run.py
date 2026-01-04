#!/usr/bin/env python3
"""
Run script for VerTechie FastAPI application.
"""

import uvicorn
from app.core.config import settings


def main():
    """Run the FastAPI application."""
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        workers=1 if settings.DEBUG else settings.WORKERS,
        log_level="debug" if settings.DEBUG else "info",
    )


if __name__ == "__main__":
    main()

