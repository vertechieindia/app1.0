"""
User routes.
"""

from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.db import get_db
from app.models.user import User, UserProfile
from app.schemas.user import UserResponse, UserUpdate, UserProfileResponse
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
async def list_users(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
) -> Any:
    """List users with optional search."""
    query = select(User).where(User.is_active == True)
    
    if search:
        query = query.where(
            (User.first_name.ilike(f"%{search}%")) |
            (User.last_name.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%"))
        )
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get user by ID."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.put("/me", response_model=UserResponse)
async def update_me(
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update current user."""
    for field, value in user_in.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.get("/{user_id}/profile", response_model=UserProfileResponse)
async def get_user_profile(
    user_id: str,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get user profile."""
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


@router.put("/me/profile", response_model=UserProfileResponse)
async def update_my_profile(
    profile_in: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update current user's profile."""
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
    
    for field, value in profile_in.items():
        if hasattr(profile, field):
            setattr(profile, field, value)
    
    await db.commit()
    await db.refresh(profile)
    return profile

