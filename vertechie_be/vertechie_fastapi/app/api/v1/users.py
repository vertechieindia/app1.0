"""
User management API endpoints.
"""

from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func

from app.db.session import get_db
from app.models.user import User, UserProfile, Experience, Education
from app.schemas.user import (
    UserResponse, UserUpdate, UserProfileUpdate, UserProfileResponse,
    ExperienceCreate, ExperienceResponse,
    EducationCreate, EducationResponse
)
from app.core.security import get_current_user, get_current_admin_user

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
async def list_users(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
) -> Any:
    """List users (admin only)."""
    
    query = select(User)
    
    if search:
        query = query.where(
            or_(
                User.email.ilike(f"%{search}%"),
                User.first_name.ilike(f"%{search}%"),
                User.last_name.ilike(f"%{search}%"),
                User.username.ilike(f"%{search}%"),
            )
        )
    
    if is_active is not None:
        query = query.where(User.is_active == is_active)
    
    query = query.order_by(User.created_at.desc())
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get current user."""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Update current user."""
    
    update_data = user_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    await db.commit()
    await db.refresh(current_user)
    
    return current_user


@router.get("/me/profile", response_model=UserProfileResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get current user's profile."""
    
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        # Create profile if doesn't exist
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    
    return profile


@router.put("/me/profile", response_model=UserProfileResponse)
async def update_my_profile(
    profile_in: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Update current user's profile."""
    
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        await db.flush()
    
    update_data = profile_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    
    await db.commit()
    await db.refresh(profile)
    
    return profile


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get user by ID."""
    
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Return dict with is_staff derived from is_superuser (for frontend compatibility)
    return {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "middle_name": user.middle_name,
        "phone": user.phone,
        "mobile_number": user.mobile_number,
        "dob": user.dob,
        "country": user.country,
        "address": user.address,
        "username": user.username,
        "vertechie_id": user.vertechie_id,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "is_superuser": user.is_superuser,
        "is_staff": user.is_superuser,  # Map is_superuser to is_staff for frontend
        "email_verified": user.email_verified,
        "mobile_verified": user.mobile_verified,
        "created_at": user.created_at,
    }


@router.get("/{user_id}/profile", response_model=UserProfileResponse)
async def get_user_profile(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get user's public profile."""
    
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == user_id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return profile


# ============= Experience Endpoints =============

@router.get("/{user_id}/experiences", response_model=List[ExperienceResponse])
async def get_user_experiences(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get user's experiences by user ID."""
    
    result = await db.execute(
        select(Experience)
        .where(Experience.user_id == user_id)
        .order_by(Experience.start_date.desc())
    )
    return result.scalars().all()


@router.get("/{user_id}/educations", response_model=List[EducationResponse])
async def get_user_educations(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get user's educations by user ID."""
    
    result = await db.execute(
        select(Education)
        .where(Education.user_id == user_id)
        .order_by(
            Education.end_year.is_(None).desc(),
            Education.end_year.desc()
        )
    )
    return result.scalars().all()


@router.get("/me/experiences", response_model=List[ExperienceResponse])
async def get_my_experiences(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get current user's experiences."""
    
    result = await db.execute(
        select(Experience)
        .where(Experience.user_id == current_user.id)
        .order_by(Experience.start_date.desc())
    )
    return result.scalars().all()


@router.post("/me/experiences", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
async def add_experience(
    exp_in: ExperienceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Add experience to current user."""
    
    experience = Experience(
        user_id=current_user.id,
        **exp_in.model_dump()
    )
    db.add(experience)
    await db.commit()
    await db.refresh(experience)
    
    return experience


@router.put("/me/experiences/{exp_id}", response_model=ExperienceResponse)
async def update_experience(
    exp_id: UUID,
    exp_in: ExperienceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Update experience."""
    
    result = await db.execute(
        select(Experience).where(
            Experience.id == exp_id,
            Experience.user_id == current_user.id
        )
    )
    experience = result.scalar_one_or_none()
    
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found"
        )
    
    update_data = exp_in.model_dump()
    for field, value in update_data.items():
        setattr(experience, field, value)
    
    await db.commit()
    await db.refresh(experience)
    
    return experience


@router.delete("/me/experiences/{exp_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_experience(
    exp_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> None:
    """Delete experience."""
    
    result = await db.execute(
        select(Experience).where(
            Experience.id == exp_id,
            Experience.user_id == current_user.id
        )
    )
    experience = result.scalar_one_or_none()
    
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found"
        )
    
    await db.delete(experience)
    await db.commit()


# ============= Education Endpoints =============

@router.get("/me/educations", response_model=List[EducationResponse])
async def get_my_educations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get current user's educations."""
    
    # MySQL/MariaDB doesn't support NULLS FIRST, use CASE to handle NULL values
    result = await db.execute(
        select(Education)
        .where(Education.user_id == current_user.id)
        .order_by(
            # Put NULL values first by checking if end_year is NULL
            Education.end_year.is_(None).desc(),
            Education.end_year.desc()
        )
    )
    return result.scalars().all()


@router.post("/me/educations", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
async def add_education(
    edu_in: EducationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Add education to current user."""
    
    education = Education(
        user_id=current_user.id,
        **edu_in.model_dump()
    )
    db.add(education)
    await db.commit()
    await db.refresh(education)
    
    return education


@router.put("/me/educations/{edu_id}", response_model=EducationResponse)
async def update_education(
    edu_id: UUID,
    edu_in: EducationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Update education."""
    
    result = await db.execute(
        select(Education).where(
            Education.id == edu_id,
            Education.user_id == current_user.id
        )
    )
    education = result.scalar_one_or_none()
    
    if not education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education not found"
        )
    
    update_data = edu_in.model_dump()
    for field, value in update_data.items():
        setattr(education, field, value)
    
    await db.commit()
    await db.refresh(education)
    
    return education


@router.delete("/me/educations/{edu_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_education(
    edu_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> None:
    """Delete education."""
    
    result = await db.execute(
        select(Education).where(
            Education.id == edu_id,
            Education.user_id == current_user.id
        )
    )
    education = result.scalar_one_or_none()
    
    if not education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education not found"
        )
    
    await db.delete(education)
    await db.commit()


# ============= Admin Endpoints =============

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
) -> None:
    """Admin: Delete a user."""
    
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    await db.delete(user)
    await db.commit()


@router.post("/{user_id}/block")
async def block_user(
    user_id: UUID,
    reason: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
) -> Any:
    """Admin: Block a user."""
    
    from datetime import datetime
    
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_blocked = True
    user.blocked_at = datetime.utcnow()
    user.blocked_reason = reason
    user.blocked_by_id = admin_user.id
    
    await db.commit()
    
    return {"message": "User blocked successfully"}


@router.post("/{user_id}/unblock")
async def unblock_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
) -> Any:
    """Admin: Unblock a user."""
    
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_blocked = False
    user.blocked_at = None
    user.blocked_reason = None
    user.blocked_by_id = None
    
    await db.commit()
    
    return {"message": "User unblocked successfully"}

