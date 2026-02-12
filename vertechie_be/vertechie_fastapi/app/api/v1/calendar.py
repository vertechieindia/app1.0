"""
Calendar and Scheduling API endpoints.
"""

from typing import Any, List, Optional
from uuid import UUID, uuid4
from datetime import datetime, date, time, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from slugify import slugify

from app.db.session import get_db
from app.models.calendar import (
    CalendarConnection, AvailabilitySchedule, MeetingType, 
    Booking, SchedulingLink, BookingStatus
)
from app.models.user import User
from app.schemas.calendar import (
    MeetingTypeCreate, MeetingTypeResponse,
    BookingCreate, BookingResponse,
    SchedulingLinkCreate, SchedulingLinkResponse,
    AvailableTimesResponse, AvailabilitySlot
)
from app.core.security import get_current_user

router = APIRouter()


# ============= Meeting Types =============

@router.get("/meeting-types", response_model=List[MeetingTypeResponse])
async def list_meeting_types(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """List user's meeting types."""
    
    result = await db.execute(
        select(MeetingType)
        .where(MeetingType.user_id == current_user.id)
        .order_by(MeetingType.created_at.desc())
    )
    return result.scalars().all()


@router.post("/meeting-types", response_model=MeetingTypeResponse, status_code=status.HTTP_201_CREATED)
async def create_meeting_type(
    meeting_in: MeetingTypeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create a new meeting type."""
    
    slug = f"{slugify(meeting_in.name)}-{uuid4().hex[:6]}"
    
    meeting_type = MeetingType(
        **meeting_in.model_dump(),
        user_id=current_user.id,
        slug=slug,
    )
    
    db.add(meeting_type)
    await db.commit()
    await db.refresh(meeting_type)
    
    return meeting_type


@router.get("/meeting-types/{meeting_id}", response_model=MeetingTypeResponse)
async def get_meeting_type(
    meeting_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get meeting type by ID."""
    
    result = await db.execute(
        select(MeetingType).where(MeetingType.id == meeting_id)
    )
    meeting_type = result.scalar_one_or_none()
    
    if not meeting_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting type not found"
        )
    
    return meeting_type


@router.delete("/meeting-types/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_meeting_type(
    meeting_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Delete meeting type."""
    
    result = await db.execute(
        select(MeetingType).where(
            MeetingType.id == meeting_id,
            MeetingType.user_id == current_user.id
        )
    )
    meeting_type = result.scalar_one_or_none()
    
    if not meeting_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting type not found"
        )
    
    await db.delete(meeting_type)
    await db.commit()


# ============= Bookings =============

@router.get("/bookings", response_model=List[BookingResponse])
async def list_bookings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status_filter: Optional[str] = Query(None),
    upcoming_only: bool = Query(False),
) -> Any:
    """List user's bookings."""
    
    query = select(Booking).where(Booking.host_id == current_user.id)
    
    if status_filter:
        query = query.where(Booking.status == status_filter)
    
    if upcoming_only:
        now = datetime.utcnow()
        query = query.where(Booking.start_time >= now)
    
    query = query.order_by(Booking.start_time.desc())
    
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_in: BookingCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Create a new booking (public endpoint)."""
    
    # Get meeting type
    result = await db.execute(
        select(MeetingType).where(MeetingType.id == booking_in.meeting_type_id)
    )
    meeting_type = result.scalar_one_or_none()
    
    if not meeting_type or not meeting_type.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting type not found or inactive"
        )
    
    # Convert to naive UTC if aware
    start_time = booking_in.start_time
    if start_time.tzinfo:
        start_time = start_time.astimezone(timezone.utc).replace(tzinfo=None)
    
    # Calculate end time
    end_time = start_time + timedelta(minutes=meeting_type.duration_minutes)
    
    # Check for conflicts
    result = await db.execute(
        select(Booking).where(
            Booking.host_id == meeting_type.user_id,
            Booking.status.in_([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
            Booking.start_time < end_time,
            Booking.end_time > booking_in.start_time
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Time slot not available"
        )
    
    booking = Booking(
        meeting_type_id=meeting_type.id,
        host_id=meeting_type.user_id,
        invitee_name=booking_in.invitee_name,
        invitee_email=booking_in.invitee_email,
        invitee_phone=booking_in.invitee_phone,
        invitee_timezone=booking_in.invitee_timezone,
        start_time=start_time,
        end_time=end_time,
        answers=booking_in.answers,
        invitee_notes=booking_in.invitee_notes,
        location=meeting_type.location_details,
        video_link=meeting_type.video_link,
    )
    
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    
    return booking


@router.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get booking details."""
    
    result = await db.execute(
        select(Booking).where(Booking.id == booking_id)
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check access
    if booking.host_id != current_user.id and booking.invitee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    return booking


@router.post("/bookings/{booking_id}/confirm")
async def confirm_booking(
    booking_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Confirm a booking."""
    
    result = await db.execute(
        select(Booking).where(
            Booking.id == booking_id,
            Booking.host_id == current_user.id
        )
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    booking.status = BookingStatus.CONFIRMED
    await db.commit()
    
    return {"message": "Booking confirmed"}


@router.post("/bookings/{booking_id}/cancel")
async def cancel_booking(
    booking_id: UUID,
    reason: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Cancel a booking."""
    
    result = await db.execute(
        select(Booking).where(Booking.id == booking_id)
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if booking.host_id != current_user.id and booking.invitee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    booking.status = BookingStatus.CANCELLED
    booking.cancelled_at = datetime.utcnow()
    booking.cancelled_by = "host" if booking.host_id == current_user.id else "invitee"
    booking.cancellation_reason = reason
    
    await db.commit()
    
    return {"message": "Booking cancelled"}


# ============= Scheduling Links =============

@router.get("/scheduling-links", response_model=List[SchedulingLinkResponse])
async def list_scheduling_links(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """List user's scheduling links."""
    
    result = await db.execute(
        select(SchedulingLink)
        .where(SchedulingLink.user_id == current_user.id)
        .order_by(SchedulingLink.created_at.desc())
    )
    return result.scalars().all()


@router.post("/scheduling-links", response_model=SchedulingLinkResponse, status_code=status.HTTP_201_CREATED)
async def create_scheduling_link(
    link_in: SchedulingLinkCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create a new scheduling link."""
    
    token = uuid4().hex
    
    link = SchedulingLink(
        **link_in.model_dump(),
        user_id=current_user.id,
        token=token,
    )
    
    db.add(link)
    await db.commit()
    await db.refresh(link)
    
    return link


@router.get("/scheduling-links/{token}")
async def get_scheduling_link_by_token(
    token: str,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get scheduling link by token (public)."""
    
    result = await db.execute(
        select(SchedulingLink).where(SchedulingLink.token == token)
    )
    link = result.scalar_one_or_none()
    
    if not link or not link.is_active:
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
    
    # Check booking limit
    if link.max_bookings and link.bookings_count >= link.max_bookings:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="Maximum bookings reached"
        )
    
    return {
        "token": link.token,
        "name": link.name,
        "duration_minutes": link.duration_minutes,
        "available_days": link.available_days,
        "start_date": link.start_date,
        "end_date": link.end_date,
        "start_time": str(link.start_time) if link.start_time else None,
        "end_time": str(link.end_time) if link.end_time else None,
        "max_bookings": link.max_bookings,
        "bookings_count": link.bookings_count,
        "requires_approval": link.requires_approval,
    }


@router.delete("/scheduling-links/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_scheduling_link(
    link_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Delete scheduling link."""
    
    result = await db.execute(
        select(SchedulingLink).where(
            SchedulingLink.id == link_id,
            SchedulingLink.user_id == current_user.id
        )
    )
    link = result.scalar_one_or_none()
    
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheduling link not found"
        )
    
    await db.delete(link)
    await db.commit()


# ============= Public Scheduling =============

@router.get("/schedule/{username}/available-times")
async def get_available_times(
    username: str,
    selected_date: date,
    meeting_type_slug: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get available time slots for a date (public)."""
    
    # Get user
    result = await db.execute(
        select(User).where(User.username == username)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get meeting type
    query = select(MeetingType).where(
        MeetingType.user_id == user.id,
        MeetingType.is_active == True,
        MeetingType.is_public == True
    )
    
    if meeting_type_slug:
        query = query.where(MeetingType.slug == meeting_type_slug)
    
    result = await db.execute(query)
    meeting_type = result.scalars().first()
    
    if not meeting_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No available meeting types"
        )
    
    # Generate available slots (simplified - would check calendar in production)
    slots = []
    start_hour = 9
    end_hour = 17
    duration = meeting_type.duration_minutes
    
    current_time = datetime.combine(selected_date, time(start_hour, 0))
    end_datetime = datetime.combine(selected_date, time(end_hour, 0))
    
    while current_time + timedelta(minutes=duration) <= end_datetime:
        # Check for conflicts
        slot_end = current_time + timedelta(minutes=duration)
        
        result = await db.execute(
            select(Booking).where(
                Booking.host_id == user.id,
                Booking.status.in_([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
                Booking.start_time < slot_end,
                Booking.end_time > current_time
            )
        )
        
        if not result.scalar_one_or_none():
            slots.append(AvailabilitySlot(
                start=current_time,
                end=slot_end
            ))
        
        current_time += timedelta(minutes=30)
    
    return AvailableTimesResponse(
        date=selected_date,
        slots=slots
    )

