"""
Admin Review API for Techie Profile Verification
Allows admins to review, approve, or reject techie profiles
"""

from datetime import datetime
from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status, BackgroundTasks
from pydantic import BaseModel, Field
from sqlalchemy import select, func, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.user import (
    User, UserProfile, Experience, Education, 
    VerificationStatus, ProfileReviewHistory, RoleType, UserRole
)
from app.core.security import get_current_admin_user
from app.core.config import get_settings

import aiosmtplib
from email.message import EmailMessage
from email.utils import formataddr

router = APIRouter(prefix="/admin/techies", tags=["Admin - Techie Review"])


# ============= Pydantic Schemas =============

class ExperienceResponse(BaseModel):
    """Experience data for admin review."""
    id: UUID
    title: str
    company_name: str
    employment_type: Optional[str] = None
    location: Optional[str] = None
    is_remote: bool = False
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    description: Optional[str] = None
    skills: List[str] = []
    is_verified: bool = False
    
    class Config:
        from_attributes = True


class EducationResponse(BaseModel):
    """Education data for admin review."""
    id: UUID
    school_name: str
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    grade: Optional[str] = None
    description: Optional[str] = None
    is_verified: bool = False
    
    class Config:
        from_attributes = True


class ProfileResponse(BaseModel):
    """Profile data for admin review."""
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    skills: List[str] = []
    experience_years: int = 0
    current_position: Optional[str] = None
    current_company: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    open_to_work: bool = False
    
    class Config:
        from_attributes = True


class TechieListItem(BaseModel):
    """Techie item for list view."""
    id: UUID
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    vertechie_id: Optional[str] = None
    country: Optional[str] = None
    verification_status: VerificationStatus
    email_verified: bool = False
    mobile_verified: bool = False
    created_at: Optional[datetime] = None
    experience_count: int = 0
    education_count: int = 0
    
    class Config:
        from_attributes = True


class TechieDetailResponse(BaseModel):
    """Full techie details for admin review."""
    id: UUID
    email: str
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    vertechie_id: Optional[str] = None
    phone: Optional[str] = None
    mobile_number: Optional[str] = None
    dob: Optional[str] = None
    country: Optional[str] = None
    address: Optional[str] = None
    gov_id: Optional[str] = None
    
    # Status
    is_active: bool = True
    is_verified: bool = False
    email_verified: bool = False
    mobile_verified: bool = False
    verification_status: VerificationStatus
    
    # Review info
    reviewed_by_id: Optional[UUID] = None
    reviewed_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    admin_notes: Optional[str] = None
    
    # Face verification
    face_verification: Optional[dict] = None
    
    # Timestamps
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    # Related data
    profile: Optional[ProfileResponse] = None
    experiences: List[ExperienceResponse] = []
    educations: List[EducationResponse] = []
    
    class Config:
        from_attributes = True


class ReviewAction(BaseModel):
    """Request body for review actions."""
    action: str = Field(..., description="Action: approve, reject, request_changes")
    reason: Optional[str] = Field(None, description="Required for rejection")
    admin_notes: Optional[str] = Field(None, description="Internal admin notes")
    send_email: bool = Field(True, description="Send email notification to user")


class ReviewHistoryResponse(BaseModel):
    """Review history entry."""
    id: UUID
    previous_status: Optional[VerificationStatus] = None
    new_status: VerificationStatus
    action: str
    reason: Optional[str] = None
    admin_notes: Optional[str] = None
    reviewer_email: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ReviewStatsResponse(BaseModel):
    """Dashboard stats for admin."""
    total_pending: int
    total_under_review: int
    total_approved: int
    total_rejected: int
    total_resubmitted: int
    reviewed_today: int
    reviewed_this_week: int


# ============= Helper Functions =============

async def send_review_email(
    recipient_email: str,
    recipient_name: str,
    status: str,
    reason: Optional[str] = None
):
    """Send email notification for profile review result."""
    settings = get_settings()
    
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print(f"[EMAIL] SMTP not configured. Would notify: {recipient_email} about {status}")
        return
    
    if status == "approved":
        subject = "🎉 Your VerTechie Profile Has Been Approved!"
        body = f"""
Dear {recipient_name},

Congratulations! Your VerTechie profile has been reviewed and approved.

You now have full access to all VerTechie features:
• Browse and apply to job opportunities
• Connect with other verified tech professionals
• Access exclusive learning resources
• Participate in community discussions

Welcome to VerTechie!

Best regards,
The VerTechie Team
        """
    else:
        subject = "VerTechie Profile Review Update"
        body = f"""
Dear {recipient_name},

Thank you for registering on VerTechie.

Unfortunately, we couldn't approve your profile at this time.

Reason: {reason or "Additional information required"}

You can update your profile and resubmit for review. Please ensure:
• Your work experience details are accurate
• Your education information is complete
• Your profile information matches your ID documents

If you have questions, please contact support@vertechie.com.

Best regards,
The VerTechie Team
        """
    
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = formataddr((settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL))
    msg["To"] = recipient_email
    msg.set_content(body)
    
    try:
        async with aiosmtplib.SMTP(
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            use_tls=settings.SMTP_USE_TLS,
        ) as smtp:
            await smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            await smtp.send_message(msg)
        print(f"[EMAIL] Review notification sent to {recipient_email}")
    except Exception as e:
        print(f"[EMAIL] Failed to send review notification: {e}")


# ============= Admin Endpoints =============

@router.get("/stats", response_model=ReviewStatsResponse)
async def get_review_stats(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """Get dashboard statistics for admin review."""
    
    # Get techie role
    role_result = await db.execute(
        select(UserRole).where(UserRole.role_type == RoleType.TECHIE)
    )
    techie_role = role_result.scalar_one_or_none()
    
    if not techie_role:
        return ReviewStatsResponse(
            total_pending=0, total_under_review=0, total_approved=0,
            total_rejected=0, total_resubmitted=0, reviewed_today=0, reviewed_this_week=0
        )
    
    # Count by status
    stats = {}
    for status in VerificationStatus:
        result = await db.execute(
            select(func.count(User.id))
            .join(User.roles)
            .where(
                UserRole.role_type == RoleType.TECHIE,
                User.verification_status == status
            )
        )
        stats[status.value] = result.scalar() or 0
    
    # Reviewed today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    result = await db.execute(
        select(func.count(ProfileReviewHistory.id))
        .where(ProfileReviewHistory.created_at >= today_start)
    )
    reviewed_today = result.scalar() or 0
    
    # Reviewed this week
    from datetime import timedelta
    week_start = today_start - timedelta(days=today_start.weekday())
    result = await db.execute(
        select(func.count(ProfileReviewHistory.id))
        .where(ProfileReviewHistory.created_at >= week_start)
    )
    reviewed_this_week = result.scalar() or 0
    
    return ReviewStatsResponse(
        total_pending=stats.get("pending", 0),
        total_under_review=stats.get("under_review", 0),
        total_approved=stats.get("approved", 0),
        total_rejected=stats.get("rejected", 0),
        total_resubmitted=stats.get("resubmitted", 0),
        reviewed_today=reviewed_today,
        reviewed_this_week=reviewed_this_week
    )


@router.get("/pending", response_model=List[TechieListItem])
async def list_pending_techies(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[VerificationStatus] = Query(None),
    country: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """List techies pending review."""
    
    # Build query - get users with techie role
    query = (
        select(User)
        .join(User.roles)
        .where(UserRole.role_type == RoleType.TECHIE)
        .options(
            selectinload(User.experiences),
            selectinload(User.educations)
        )
    )
    
    # Filter by verification status
    if status_filter:
        query = query.where(User.verification_status == status_filter)
    else:
        # Default: show pending and resubmitted
        query = query.where(
            or_(
                User.verification_status == VerificationStatus.PENDING.value,
                User.verification_status == VerificationStatus.RESUBMITTED.value
            )
        )
    
    # Filter by country
    if country:
        query = query.where(User.country == country)
    
    # Search
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                User.email.ilike(search_pattern),
                User.first_name.ilike(search_pattern),
                User.last_name.ilike(search_pattern),
                User.vertechie_id.ilike(search_pattern)
            )
        )
    
    # Order by created_at (oldest first for FIFO)
    query = query.order_by(User.created_at.asc())
    
    # Pagination
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    users = result.scalars().unique().all()
    
    # Build response
    techies = []
    for user in users:
        techies.append(TechieListItem(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            vertechie_id=user.vertechie_id,
            country=user.country,
            verification_status=user.verification_status or VerificationStatus.PENDING.value,
            email_verified=user.email_verified,
            mobile_verified=user.mobile_verified,
            created_at=user.created_at,
            experience_count=len(user.experiences) if user.experiences else 0,
            education_count=len(user.educations) if user.educations else 0
        ))
    
    return techies


@router.get("/{user_id}", response_model=TechieDetailResponse)
async def get_techie_details(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """Get full techie details for admin review."""
    
    result = await db.execute(
        select(User)
        .options(
            selectinload(User.profile),
            selectinload(User.experiences),
            selectinload(User.educations),
            selectinload(User.roles)
        )
        .where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Build profile response
    profile_data = None
    if user.profile:
        profile_data = ProfileResponse(
            headline=user.profile.headline,
            bio=user.profile.bio,
            location=user.profile.location,
            skills=user.profile.skills or [],
            experience_years=user.profile.experience_years or 0,
            current_position=user.profile.current_position,
            current_company=user.profile.current_company,
            linkedin_url=user.profile.linkedin_url,
            github_url=user.profile.github_url,
            open_to_work=user.profile.open_to_work or False
        )
    
    # Build experiences
    experiences = []
    for exp in user.experiences or []:
        experiences.append(ExperienceResponse(
            id=exp.id,
            title=exp.title,
            company_name=exp.company_name,
            employment_type=exp.employment_type.value if exp.employment_type else None,
            location=exp.location,
            is_remote=exp.is_remote or False,
            start_date=str(exp.start_date) if exp.start_date else None,
            end_date=str(exp.end_date) if exp.end_date else None,
            is_current=exp.is_current or False,
            description=exp.description,
            skills=exp.skills or [],
            is_verified=exp.is_verified or False
        ))
    
    # Build educations
    educations = []
    for edu in user.educations or []:
        educations.append(EducationResponse(
            id=edu.id,
            school_name=edu.school_name,
            degree=edu.degree,
            field_of_study=edu.field_of_study,
            start_year=edu.start_year,
            end_year=edu.end_year,
            grade=edu.grade,
            description=edu.description,
            is_verified=edu.is_verified or False
        ))
    
    return TechieDetailResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        middle_name=user.middle_name,
        last_name=user.last_name,
        username=user.username,
        vertechie_id=user.vertechie_id,
        phone=user.phone,
        mobile_number=user.mobile_number,
        dob=str(user.dob) if user.dob else None,
        country=user.country,
        address=user.address,
        gov_id=user.gov_id,
        is_active=user.is_active,
        is_verified=user.is_verified,
        email_verified=user.email_verified,
        mobile_verified=user.mobile_verified,
        verification_status=user.verification_status or VerificationStatus.PENDING,
        reviewed_by_id=user.reviewed_by_id,
        reviewed_at=user.reviewed_at,
        rejection_reason=user.rejection_reason,
        admin_notes=user.admin_notes,
        face_verification=user.face_verification,
        created_at=user.created_at,
        updated_at=user.updated_at,
        profile=profile_data,
        experiences=experiences,
        educations=educations
    )


@router.post("/{user_id}/review")
async def review_techie(
    user_id: UUID,
    review: ReviewAction,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """
    Review a techie profile.
    Actions: approve, reject, request_changes
    """
    
    # Get the user
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validate action
    valid_actions = ["approve", "reject", "request_changes"]
    if review.action not in valid_actions:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid action. Must be one of: {valid_actions}"
        )
    
    # Rejection requires reason
    if review.action == "reject" and not review.reason:
        raise HTTPException(
            status_code=400,
            detail="Rejection reason is required"
        )
    
    # Store previous status
    previous_status = user.verification_status
    
    # Update user based on action
    if review.action == "approve":
        user.verification_status = VerificationStatus.APPROVED.value
        user.is_verified = True
        user.verified_at = datetime.utcnow()
        user.rejection_reason = None
    elif review.action == "reject":
        user.verification_status = VerificationStatus.REJECTED.value
        user.is_verified = False
        user.rejection_reason = review.reason
    elif review.action == "request_changes":
        user.verification_status = VerificationStatus.REJECTED.value
        user.rejection_reason = review.reason
    
    # Update review info
    user.reviewed_by_id = current_admin.id
    user.reviewed_at = datetime.utcnow()
    if review.admin_notes:
        user.admin_notes = review.admin_notes
    
    # Create review history entry
    history = ProfileReviewHistory(
        user_id=user.id,
        reviewer_id=current_admin.id,
        previous_status=previous_status,
        new_status=user.verification_status,
        action=review.action,
        reason=review.reason,
        admin_notes=review.admin_notes
    )
    db.add(history)
    
    await db.commit()
    
    # Send email notification
    if review.send_email:
        user_name = user.first_name or user.email.split("@")[0]
        background_tasks.add_task(
            send_review_email,
            user.email,
            user_name,
            "approved" if review.action == "approve" else "rejected",
            review.reason
        )
    
    return {
        "status": "success",
        "message": f"Profile {review.action}d successfully",
        "user_id": str(user.id),
        "new_status": user.verification_status.value
    }


@router.get("/{user_id}/history", response_model=List[ReviewHistoryResponse])
async def get_review_history(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """Get review history for a techie."""
    
    result = await db.execute(
        select(ProfileReviewHistory)
        .options(selectinload(ProfileReviewHistory.reviewer))
        .where(ProfileReviewHistory.user_id == user_id)
        .order_by(ProfileReviewHistory.created_at.desc())
    )
    history_entries = result.scalars().all()
    
    response = []
    for entry in history_entries:
        response.append(ReviewHistoryResponse(
            id=entry.id,
            previous_status=entry.previous_status,
            new_status=entry.new_status,
            action=entry.action,
            reason=entry.reason,
            admin_notes=entry.admin_notes,
            reviewer_email=entry.reviewer.email if entry.reviewer else None,
            created_at=entry.created_at
        ))
    
    return response


@router.put("/{user_id}/assign")
async def assign_for_review(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """Assign a techie to current admin for review (mark as under_review)."""
    
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Only allow assigning pending or resubmitted profiles
    if user.verification_status not in [VerificationStatus.PENDING, VerificationStatus.RESUBMITTED]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot assign. Profile status is: {user.verification_status.value}"
        )
    
    user.verification_status = VerificationStatus.UNDER_REVIEW.value
    user.reviewed_by_id = current_admin.id
    
    await db.commit()
    
    return {
        "status": "success",
        "message": "Profile assigned for review",
        "user_id": str(user.id),
        "assigned_to": current_admin.email
    }


@router.put("/{user_id}/unassign")
async def unassign_from_review(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """Unassign a techie from review (back to pending)."""
    
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.verification_status != VerificationStatus.UNDER_REVIEW.value:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot unassign. Profile status is: {user.verification_status}"
        )
    
    user.verification_status = VerificationStatus.PENDING.value
    user.reviewed_by_id = None
    
    await db.commit()
    
    return {
        "status": "success",
        "message": "Profile unassigned from review",
        "user_id": str(user.id)
    }
