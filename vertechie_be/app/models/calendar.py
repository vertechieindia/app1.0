"""
Calendar and Scheduling models.
"""

from datetime import datetime, time
import enum

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum, 
    Text, JSON, ForeignKey, Integer, Time
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class CalendarProvider(str, enum.Enum):
    GOOGLE = "google"
    MICROSOFT = "microsoft"
    APPLE = "apple"
    ZOOM = "zoom"


class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"
    NO_SHOW = "no_show"


class CalendarConnection(Base, UUIDMixin, TimestampMixin):
    """Connected calendar accounts."""
    
    __tablename__ = "calendarconnection"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    
    provider = Column(Enum(CalendarProvider), nullable=False)
    account_email = Column(String(255), nullable=True)
    
    # OAuth tokens (encrypted in production)
    access_token = Column(Text, nullable=True)
    refresh_token = Column(Text, nullable=True)
    token_expires_at = Column(DateTime, nullable=True)
    
    # Settings
    is_primary = Column(Boolean, default=False)
    sync_enabled = Column(Boolean, default=True)
    check_conflicts = Column(Boolean, default=True)
    
    last_synced_at = Column(DateTime, nullable=True)


class AvailabilitySchedule(Base, UUIDMixin, TimestampMixin):
    """Weekly availability schedule."""
    
    __tablename__ = "availabilityschedule"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    
    name = Column(String(100), nullable=False)
    is_default = Column(Boolean, default=False)
    timezone = Column(String(50), default="UTC")
    
    # Weekly slots as JSON
    # Format: {"monday": [{"start": "09:00", "end": "17:00"}], ...}
    weekly_hours = Column(JSON, default=dict)
    
    # Date overrides
    date_overrides = Column(JSON, default=dict)


class MeetingType(Base, UUIDMixin, TimestampMixin):
    """Meeting types for scheduling."""
    
    __tablename__ = "meetingtype"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    
    name = Column(String(100), nullable=False)
    slug = Column(String(120), index=True)
    description = Column(Text, nullable=True)
    
    duration_minutes = Column(Integer, default=30)
    buffer_before = Column(Integer, default=0)
    buffer_after = Column(Integer, default=0)
    
    # Location
    location_type = Column(String(50), default="video")  # video, phone, in_person
    location_details = Column(JSON, default=dict)
    
    # Settings
    is_active = Column(Boolean, default=True)
    requires_confirmation = Column(Boolean, default=False)
    max_bookings_per_day = Column(Integer, nullable=True)
    
    # Appearance
    color = Column(String(7), default="#0d47a1")
    
    # Relationships
    bookings = relationship("Booking", back_populates="meeting_type")


class Booking(Base, UUIDMixin, TimestampMixin):
    """Meeting bookings."""
    
    __tablename__ = "booking"
    
    meeting_type_id = Column(UUID(as_uuid=True), ForeignKey("meetingtype.id"), nullable=False)
    host_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    
    # Invitee (can be guest or user)
    invitee_email = Column(String(255), nullable=False)
    invitee_name = Column(String(200), nullable=False)
    invitee_user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=True)
    
    # Schedule
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    timezone = Column(String(50), default="UTC")
    
    # Status
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING)
    
    # Meeting details
    meeting_link = Column(String(500), nullable=True)
    location = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Cancellation
    cancelled_at = Column(DateTime, nullable=True)
    cancellation_reason = Column(Text, nullable=True)
    
    # Relationships
    meeting_type = relationship("MeetingType", back_populates="bookings")


class SchedulingLink(Base, UUIDMixin, TimestampMixin):
    """Custom scheduling links with constraints."""
    
    __tablename__ = "schedulinglink"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    meeting_type_id = Column(UUID(as_uuid=True), ForeignKey("meetingtype.id"), nullable=True)
    
    # Link
    token = Column(String(100), unique=True, index=True)
    title = Column(String(200), nullable=True)
    
    # Constraints
    duration_minutes = Column(Integer, default=30)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
    available_days = Column(ARRAY(Integer), default=list)  # 0-6 for Mon-Sun
    
    # Buffers
    buffer_before = Column(Integer, default=0)
    buffer_after = Column(Integer, default=0)
    
    # Limits
    max_bookings = Column(Integer, nullable=True)
    current_bookings = Column(Integer, default=0)
    requires_approval = Column(Boolean, default=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime, nullable=True)

