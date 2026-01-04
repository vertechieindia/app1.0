"""
Logging middleware.
"""

import time
import uuid
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import structlog

logger = structlog.get_logger()


class LoggingMiddleware(BaseHTTPMiddleware):
    """Request/response logging middleware."""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = str(uuid.uuid4())[:8]
        
        # Log request
        logger.info(
            "request_started",
            request_id=request_id,
            method=request.method,
            path=request.url.path,
            client=request.client.host if request.client else None,
        )
        
        start_time = time.time()
        
        try:
            response = await call_next(request)
        except Exception as e:
            logger.error(
                "request_error",
                request_id=request_id,
                error=str(e),
            )
            raise
        
        duration = time.time() - start_time
        
        # Log response
        logger.info(
            "request_completed",
            request_id=request_id,
            status_code=response.status_code,
            duration_ms=round(duration * 1000, 2),
        )
        
        # Add request ID header
        response.headers["X-Request-ID"] = request_id
        
        return response

