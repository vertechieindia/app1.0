"""
Calendar and Scheduling routes.
"""

from typing import Any, List
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.db import get_db
from app.models.calendar import (
    CalendarConnection, AvailabilitySchedule, MeetingType,
    Booking, SchedulingLink, BookingStatus
)
from app.models.user import User
from app.api.v1.auth import get_current_user

router = APIRouter()


# Meeting Types
@router.get("/meeting-types", response_model=List[dict])
async def list_meeting_types(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """List user's meeting types."""
    query = select(MeetingType).where(MeetingType.user_id == current_user.id)
    result = await db.execute(query)
    meeting_types = result.scalars().all()
    
    return [
        {
            "id": str(mt.id),
            "name": mt.name,
            "slug": mt.slug,
            "description": mt.description,
            "duration_minutes": mt.duration_minutes,
            "location_type": mt.location_type,
            "color": mt.color,
            "is_active": mt.is_active,
        }
        for mt in meeting_types
    ]


@router.post("/meeting-types", status_code=status.HTTP_201_CREATED)
async def create_meeting_type(
    meeting_type_in: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Create a new meeting type."""
    meeting_type = MeetingType(
        user_id=current_user.id,
        name=meeting_type_in.get("name"),
        slug=meeting_type_in.get("slug", str(uuid.uuid4())[:8]),
        description=meeting_type_in.get("description"),
        duration_minutes=meeting_type_in.get("duration_minutes", 30),
        location_type=meeting_type_in.get("location_type", "video"),
        color=meeting_type_in.get("color", "#0d47a1"),
    )
    db.add(meeting_type)
    await db.commit()
    await db.refresh(meeting_type)
    
    return {"id": str(meeting_type.id), "message": "Meeting type created"}


# Scheduling Links
@router.get("/scheduling-links", response_model=List[dict])
async def list_scheduling_links(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """List user's scheduling links."""
    query = select(SchedulingLink).where(SchedulingLink.user_id == current_user.id)
    result = await db.execute(query)
    links = result.scalars().all()
    
    return [
        {
            "id": str(link.id),
            "token": link.token,
            "title": link.title,
            "duration_minutes": link.duration_minutes,
            "start_date": link.start_date.isoformat() if link.start_date else None,
            "end_date": link.end_date.isoformat() if link.end_date else None,
            "max_bookings": link.max_bookings,
            "current_bookings": link.current_bookings,
            "is_active": link.is_active,
            "created_at": link.created_at.isoformat(),
        }
        for link in links
    ]


@router.post("/scheduling-links", status_code=status.HTTP_201_CREATED)
async def create_scheduling_link(
    link_in: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Create a new scheduling link."""
    token = str(uuid.uuid4())[:16]
    
    link = SchedulingLink(
        user_id=current_user.id,
        token=token,
        title=link_in.get("title"),
        duration_minutes=link_in.get("duration_minutes", 30),
        start_date=link_in.get("start_date"),
        end_date=link_in.get("end_date"),
        start_time=link_in.get("start_time"),
        end_time=link_in.get("end_time"),
        available_days=link_in.get("available_days", [0, 1, 2, 3, 4]),
        buffer_before=link_in.get("buffer_before", 0),
        buffer_after=link_in.get("buffer_after", 0),
        max_bookings=link_in.get("max_bookings"),
        requires_approval=link_in.get("requires_approval", False),
    )
    db.add(link)
    await db.commit()
    
    return {"token": token, "message": "Scheduling link created"}


# Bookings
@router.get("/bookings", response_model=List[dict])
async def list_bookings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status: str = Query(None),
    from_date: datetime = Query(None),
    to_date: datetime = Query(None),
) -> Any:
    """List user's bookings."""
    query = select(Booking).where(Booking.host_id == current_user.id)
    
    if status:
        query = query.where(Booking.status == status)
    
    if from_date:
        query = query.where(Booking.start_time >= from_date)
    
    if to_date:
        query = query.where(Booking.start_time <= to_date)
    
    query = query.order_by(Booking.start_time.desc())
    
    result = await db.execute(query)
    bookings = result.scalars().all()
    
    return [
        {
            "id": str(b.id),
            "invitee_name": b.invitee_name,
            "invitee_email": b.invitee_email,
            "start_time": b.start_time.isoformat(),
            "end_time": b.end_time.isoformat(),
            "status": b.status.value,
            "meeting_link": b.meeting_link,
            "notes": b.notes,
            "created_at": b.created_at.isoformat(),
        }
        for b in bookings
    ]


@router.post("/bookings/{booking_id}/confirm")
async def confirm_booking(
    booking_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Confirm a pending booking."""
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if str(booking.host_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    booking.status = BookingStatus.CONFIRMED
    await db.commit()
    
    return {"message": "Booking confirmed"}


@router.post("/bookings/{booking_id}/cancel")
async def cancel_booking(
    booking_id: str,
    reason: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Cancel a booking."""
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if str(booking.host_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    booking.status = BookingStatus.CANCELLED
    booking.cancelled_at = datetime.utcnow()
    booking.cancellation_reason = reason
    
    await db.commit()
    
    return {"message": "Booking cancelled"}


# Public scheduling endpoint
@router.get("/public/{token}")
async def get_public_scheduling(
    token: str,
    db: AsyncSession = Depends(get_db)
) -> dict:
    """Get public scheduling page info."""
    result = await db.execute(
        select(SchedulingLink).where(
            (SchedulingLink.token == token) &
            (SchedulingLink.is_active == True)
        )
    )
    link = result.scalar_one_or_none()
    
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheduling link not found or inactive"
        )
    
    # Check expiry
    if link.expires_at and link.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="Scheduling link has expired"
        )
    
    # Get user info
    user_result = await db.execute(select(User).where(User.id == link.user_id))
    user = user_result.scalar_one()
    
    return {
        "host": {
            "name": user.full_name,
            "email": user.email,
        },
        "title": link.title,
        "duration_minutes": link.duration_minutes,
        "available_days": link.available_days,
        "constraints": {
            "start_date": link.start_date.isoformat() if link.start_date else None,
            "end_date": link.end_date.isoformat() if link.end_date else None,
            "start_time": str(link.start_time) if link.start_time else None,
            "end_time": str(link.end_time) if link.end_time else None,
            "max_bookings": link.max_bookings,
            "remaining_bookings": (link.max_bookings - link.current_bookings) if link.max_bookings else None,
        }
    }


@router.post("/public/{token}/book")
async def book_public(
    token: str,
    booking_in: dict,
    db: AsyncSession = Depends(get_db)
) -> dict:
    """Book a meeting via public scheduling link."""
    result = await db.execute(
        select(SchedulingLink).where(
            (SchedulingLink.token == token) &
            (SchedulingLink.is_active == True)
        )
    )
    link = result.scalar_one_or_none()
    
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheduling link not found"
        )
    
    # Check max bookings
    if link.max_bookings and link.current_bookings >= link.max_bookings:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum bookings reached"
        )
    
    # Parse times
    start_time = datetime.fromisoformat(booking_in.get("start_time"))
    end_time = start_time + timedelta(minutes=link.duration_minutes)
    
    # Create booking
    booking = Booking(
        meeting_type_id=link.meeting_type_id,
        host_id=link.user_id,
        invitee_email=booking_in.get("email"),
        invitee_name=booking_in.get("name"),
        start_time=start_time,
        end_time=end_time,
        timezone=booking_in.get("timezone", "UTC"),
        notes=booking_in.get("notes"),
        status=BookingStatus.PENDING if link.requires_approval else BookingStatus.CONFIRMED,
    )
    db.add(booking)
    
    # Update link booking count
    link.current_bookings += 1
    
    await db.commit()
    
    return {
        "booking_id": str(booking.id),
        "status": booking.status.value,
        "message": "Booking created successfully"
    }

