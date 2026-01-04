"""
Rate limiting middleware.
"""

from collections import defaultdict
from datetime import datetime, timedelta
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from app.core.config import settings


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Simple in-memory rate limiting middleware."""
    
    def __init__(self, app, calls: int = None, period: int = 60):
        super().__init__(app)
        self.calls = calls or settings.RATE_LIMIT_PER_MINUTE
        self.period = period
        self.cache = defaultdict(list)
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Get client identifier
        client_ip = request.client.host if request.client else "unknown"
        
        # Get current time
        now = datetime.utcnow()
        
        # Clean old entries
        cutoff = now - timedelta(seconds=self.period)
        self.cache[client_ip] = [
            ts for ts in self.cache[client_ip]
            if ts > cutoff
        ]
        
        # Check rate limit
        if len(self.cache[client_ip]) >= self.calls:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Too many requests",
                    "detail": f"Rate limit: {self.calls} requests per {self.period} seconds"
                }
            )
        
        # Record request
        self.cache[client_ip].append(now)
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers
        response.headers["X-RateLimit-Limit"] = str(self.calls)
        response.headers["X-RateLimit-Remaining"] = str(
            max(0, self.calls - len(self.cache[client_ip]))
        )
        
        return response

