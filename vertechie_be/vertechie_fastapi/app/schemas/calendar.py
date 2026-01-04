"""
Calendar and Scheduling schemas.
"""

from typing import Optional, List
from datetime import datetime, date, time
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field


class MeetingTypeCreate(BaseModel):
    """Meeting type creation."""
    
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    color: str = "#0077B5"
    
    duration_minutes: int = 30
    
    buffer_before_minutes: int = 0
    buffer_after_minutes: int = 0
    
    min_notice_hours: int = 24
    max_days_ahead: int = 60
    max_bookings_per_day: Optional[int] = None
    
    location_type: str = "video"
    location_details: Optional[str] = None
    video_link: Optional[str] = None
    
    is_paid: bool = False
    price: int = 0
    currency: str = "USD"
    
    custom_questions: List[dict] = []


class MeetingTypeResponse(BaseModel):
    """Meeting type response."""
    
    id: UUID
    user_id: UUID
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    color: str
    duration_minutes: int
    location_type: str
    is_paid: bool
    price: int
    is_active: bool
    is_public: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class BookingCreate(BaseModel):
    """Booking creation."""
    
    meeting_type_id: UUID
    
    invitee_name: str
    invitee_email: EmailStr
    invitee_phone: Optional[str] = None
    invitee_timezone: Optional[str] = None
    
    start_time: datetime
    
    answers: dict = {}
    invitee_notes: Optional[str] = None


class BookingResponse(BaseModel):
    """Booking response."""
    
    id: UUID
    meeting_type_id: UUID
    host_id: UUID
    
    invitee_name: str
    invitee_email: str
    
    start_time: datetime
    end_time: datetime
    
    status: str
    location: Optional[str] = None
    video_link: Optional[str] = None
    
    created_at: datetime
    
    class Config:
        from_attributes = True


class SchedulingLinkCreate(BaseModel):
    """Scheduling link creation."""
    
    meeting_type_id: Optional[UUID] = None
    name: Optional[str] = None
    
    duration_minutes: int = 30
    available_days: List[int] = [0, 1, 2, 3, 4]  # Mon-Fri
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    
    buffer_before: int = 0
    buffer_after: int = 0
    
    max_bookings: Optional[int] = None
    requires_approval: bool = False


class SchedulingLinkResponse(BaseModel):
    """Scheduling link response."""
    
    id: UUID
    user_id: UUID
    token: str
    name: Optional[str] = None
    
    duration_minutes: int
    available_days: List[int]
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    
    max_bookings: Optional[int] = None
    bookings_count: int = 0
    
    is_active: bool
    
    created_at: datetime
    
    class Config:
        from_attributes = True


class AvailabilitySlot(BaseModel):
    """Available time slot."""
    
    start: datetime
    end: datetime


class AvailableTimesResponse(BaseModel):
    """Available times for a date."""
    
    date: date
    slots: List[AvailabilitySlot]

