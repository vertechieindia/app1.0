"""
Authentication schemas.
"""

from typing import Optional, List, Any, Dict

from app.core.face_verification_normalize import normalize_stored_face_verification
from datetime import date
from pydantic import BaseModel, EmailStr, Field, field_validator
import json
import re


class UserRegister(BaseModel):
    """User registration schema."""
    
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    middle_name: Optional[str] = Field(None, max_length=150)
    profile_name: Optional[str] = Field(None, max_length=150)
    
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
    gov_id_last_four: Optional[str] = None  # Last 4 of PAN (India) or SSN (USA) for VerTechie ID
    
    # Work authorization
    work_authorization: Optional[str] = None
    
    # Organization fields (for HR, Company, School roles)
    company_name: Optional[str] = None
    company_email: Optional[str] = None
    company_website: Optional[str] = None
    about: Optional[str] = None
    school_name: Optional[str] = None
    est_year: Optional[str] = None
    
    # Techie-specific complex fields (reuse admin schemas)
    experiences: Optional[List[Any]] = None
    educations: Optional[List[Any]] = None
    face_verification: Optional[List[str]] = None
    # Captured ID images for admin review (cleared when profile is approved)
    document_verification: Optional[Dict[str, str]] = None
    
    # Additional organization fields
    ein: Optional[str] = None
    cin: Optional[str] = None
    
    # Verification flags from frontend
    email_verified: bool = False
    mobile_verified: bool = False
    phone_verified: Optional[bool] = None
    
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

    @field_validator('face_verification', mode='before')
    @classmethod
    def normalize_face_verification(cls, v):
        """Normalize to list[str]: single data URL, JSON array string, or list."""
        if v is None or v == "":
            return None
        if isinstance(v, str):
            s = v.strip()
            if not s or s.lower() == "null":
                return None
            if s.startswith("["):
                try:
                    v = json.loads(s)
                except json.JSONDecodeError as exc:
                    raise ValueError("face_verification must be a valid JSON list of strings") from exc
            else:
                return [v]
        if not isinstance(v, list):
            raise ValueError("face_verification must be a list of strings")
        if not all(isinstance(item, str) for item in v):
            raise ValueError("face_verification must be a list of strings")
        return normalize_stored_face_verification(v)

    @field_validator("document_verification", mode="before")
    @classmethod
    def normalize_document_verification(cls, v: Any) -> Optional[Dict[str, str]]:
        if v is None or v == "" or v == {}:
            return None
        if isinstance(v, str):
            try:
                v = json.loads(v)
            except json.JSONDecodeError:
                return None
        if not isinstance(v, dict):
            raise ValueError("document_verification must be an object with string values")
        out: Dict[str, str] = {}
        for key, val in v.items():
            if isinstance(key, str) and isinstance(val, str) and val.strip():
                out[key] = val
        return out or None


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

