"""
Common schemas used across the API.
"""

from typing import Any, Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field
from datetime import datetime

T = TypeVar('T')


class MessageResponse(BaseModel):
    """Simple message response."""
    message: str
    success: bool = True


class ErrorResponse(BaseModel):
    """Error response."""
    error: str
    detail: Optional[str] = None
    code: Optional[str] = None


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response wrapper."""
    items: List[T]
    total: int
    page: int
    page_size: int
    pages: int
    has_next: bool
    has_prev: bool


class BaseSchema(BaseModel):
    """Base schema with common configuration."""
    
    class Config:
        from_attributes = True
        populate_by_name = True


class TimestampSchema(BaseSchema):
    """Schema with timestamps."""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class IDSchema(BaseSchema):
    """Schema with ID."""
    id: str = Field(..., description="Unique identifier")

