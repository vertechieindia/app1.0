"""
User and Authentication schemas.
"""

from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
import re

from app.schemas.common import BaseSchema, TimestampSchema


class UserCreate(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        if v and not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username can only contain letters, numbers, and underscores')
        return v


class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    phone: Optional[str] = Field(None, max_length=20)


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(TimestampSchema):
    """User response schema."""
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: bool
    is_verified: bool
    roles: List[str] = []
    
    class Config:
        from_attributes = True


class UserProfileResponse(TimestampSchema):
    """Extended user profile response."""
    id: str
    user_id: str
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    avatar_url: Optional[str] = None
    cover_url: Optional[str] = None
    skills: List[str] = []
    experience_years: int = 0
    current_position: Optional[str] = None
    current_company: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    open_to_work: bool = False
    connections_count: int = 0
    followers_count: int = 0
    karma_points: int = 0


class Token(BaseModel):
    """Token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenPayload(BaseModel):
    """Token payload for decoding."""
    sub: str
    exp: datetime
    type: str
    iat: datetime

