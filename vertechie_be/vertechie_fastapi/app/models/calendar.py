"""
Calendar and Scheduling models.
"""

from datetime import datetime, time, date
from typing import Optional
import uuid
import enum

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum, Date, Time,
    Text, JSON, ForeignKey, Integer
)
from sqlalchemy.dialects.postgresql import UUID
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
    """External calendar connection."""
    
    __tablename__ = "calendar_connections"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    provider = Column(Enum(CalendarProvider), nullable=False)
    
    # OAuth tokens
    access_token = Column(Text, nullable=True)
    refresh_token = Column(Text, nullable=True)
    token_expires_at = Column(DateTime, nullable=True)
    
    # Calendar info
    calendar_id = Column(String(255), nullable=True)
    calendar_name = Column(String(200), nullable=True)
    
    is_primary = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Sync settings
    sync_enabled = Column(Boolean, default=True)
    last_synced_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", backref="calendar_connections")


class AvailabilitySchedule(Base, UUIDMixin, TimestampMixin):
    """User's availability schedule."""
    
    __tablename__ = "availability_schedules"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    name = Column(String(100), nullable=False)
    timezone = Column(String(50), default="UTC")
    is_default = Column(Boolean, default=False)
    
    # Weekly availability - JSON array for each day
    # Format: {day: [{start: "09:00", end: "17:00"}]}
    weekly_hours = Column(JSON, default=dict)
    
    # Date overrides - specific dates with different hours
    date_overrides = Column(JSON, default=dict)
    
    # Relationships
    user = relationship("User", backref="availability_schedules")


class MeetingType(Base, UUIDMixin, TimestampMixin):
    """Types of meetings user can offer."""
    
    __tablename__ = "meeting_types"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Basic Info
    name = Column(String(100), nullable=False)
    slug = Column(String(120), index=True)
    description = Column(Text, nullable=True)
    color = Column(String(20), default="#0077B5")
    
    # Duration
    duration_minutes = Column(Integer, default=30)
    
    # Availability
    schedule_id = Column(UUID(as_uuid=True), ForeignKey("availability_schedules.id"), nullable=True)
    
    # Buffer times
    buffer_before_minutes = Column(Integer, default=0)
    buffer_after_minutes = Column(Integer, default=0)
    
    # Booking limits
    min_notice_hours = Column(Integer, default=24)
    max_days_ahead = Column(Integer, default=60)
    max_bookings_per_day = Column(Integer, nullable=True)
    
    # Location
    location_type = Column(String(50), default="video")  # video, phone, in_person
    location_details = Column(Text, nullable=True)
    video_link = Column(String(500), nullable=True)
    
    # Payment
    is_paid = Column(Boolean, default=False)
    price = Column(Integer, default=0)
    currency = Column(String(3), default="USD")
    
    # Status
    is_active = Column(Boolean, default=True)
    is_public = Column(Boolean, default=True)
    
    # Questions for invitee
    custom_questions = Column(JSON, default=list)
    
    # Relationships
    user = relationship("User", backref="meeting_types")
    bookings = relationship("Booking", back_populates="meeting_type")


class Booking(Base, UUIDMixin, TimestampMixin):
    """Meeting booking."""
    
    __tablename__ = "bookings"
    
    meeting_type_id = Column(UUID(as_uuid=True), ForeignKey("meeting_types.id"), nullable=False)
    host_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    invitee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    # Invitee (guest) info
    invitee_name = Column(String(200), nullable=False)
    invitee_email = Column(String(255), nullable=False)
    invitee_phone = Column(String(20), nullable=True)
    invitee_timezone = Column(String(50), nullable=True)
    
    # Answers to custom questions
    answers = Column(JSON, default=dict)
    
    # Schedule
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    
    # Status
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING)
    
    # Location
    location = Column(Text, nullable=True)
    video_link = Column(String(500), nullable=True)
    
    # Notes
    host_notes = Column(Text, nullable=True)
    invitee_notes = Column(Text, nullable=True)
    
    # Cancellation
    cancelled_by = Column(String(20), nullable=True)  # host, invitee
    cancellation_reason = Column(Text, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)
    
    # Calendar sync
    host_calendar_event_id = Column(String(255), nullable=True)
    invitee_calendar_event_id = Column(String(255), nullable=True)
    
    # Reminders
    reminder_sent = Column(Boolean, default=False)
    
    # Relationships
    meeting_type = relationship("MeetingType", back_populates="bookings")
    host = relationship("User", foreign_keys=[host_id], backref="hosted_bookings")
    invitee = relationship("User", foreign_keys=[invitee_id], backref="invitee_bookings")


class SchedulingLink(Base, UUIDMixin, TimestampMixin):
    """Custom scheduling links with constraints."""
    
    __tablename__ = "scheduling_links"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    meeting_type_id = Column(UUID(as_uuid=True), ForeignKey("meeting_types.id"), nullable=True)
    
    # Link
    token = Column(String(100), unique=True, index=True)
    name = Column(String(100), nullable=True)
    
    # Constraints
    duration_minutes = Column(Integer, default=30)
    available_days = Column(JSON, default=list)  # 0=Mon, 6=Sun
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
    
    # Buffer
    buffer_before = Column(Integer, default=0)
    buffer_after = Column(Integer, default=0)
    
    # Limits
    max_bookings = Column(Integer, nullable=True)
    bookings_count = Column(Integer, default=0)
    
    # Approval
    requires_approval = Column(Boolean, default=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", backref="scheduling_links")

