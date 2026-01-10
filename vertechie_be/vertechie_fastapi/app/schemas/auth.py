"""
Authentication schemas.
"""

from typing import Optional, List
from datetime import date
from pydantic import BaseModel, EmailStr, Field, field_validator
import re


class UserRegister(BaseModel):
    """User registration schema."""
    
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    middle_name: Optional[str] = Field(None, max_length=150)
    
    # Optional fields
    phone: Optional[str] = None
    mobile_number: Optional[str] = None
    dob: Optional[date] = None
    country: Optional[str] = None
    address: Optional[str] = None
    
    # Additional fields from frontend
    username: Optional[str] = None
    confirm_password: Optional[str] = None
    role: Optional[str] = None
    gov_id: Optional[str] = None
    
    # Work authorization
    work_authorization: Optional[str] = None
    
    class Config:
        extra = "ignore"  # Ignore extra fields from frontend
    
    @field_validator('password')
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserLogin(BaseModel):
    """User login schema."""
    
    email: EmailStr
    password: str


class Token(BaseModel):
    """Token response schema."""
    
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    """Token refresh request."""
    
    refresh_token: str


class PasswordReset(BaseModel):
    """Password reset request."""
    
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation."""
    
    token: str
    new_password: str = Field(..., min_length=8)
    
    @field_validator('new_password')
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v


class PasswordChange(BaseModel):
    """Password change request."""
    
    current_password: str
    new_password: str = Field(..., min_length=8)


class OTPRequest(BaseModel):
    """OTP request."""
    
    target: str  # email or phone
    target_type: str = "email"  # email or mobile


class OTPVerify(BaseModel):
    """OTP verification."""
    
    target: str
    target_type: str = "email"
    otp: str = Field(..., min_length=6, max_length=6)

