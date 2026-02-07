"""
User management API endpoints.
"""

from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func

from app.db.session import get_db
from app.models.user import User, UserProfile, Experience, Education, RoleType, VerificationStatus
from app.models.company import Company, CompanyAdmin
from app.models.school import School, SchoolAdmin
from app.schemas.user import (
    UserResponse, UserUpdate, UserProfileUpdate, UserProfileResponse,
    ExperienceCreate, ExperienceResponse,
    EducationCreate, EducationResponse
)
from app.core.security import get_current_user, get_current_admin_user
from sqlalchemy.orm import selectinload
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
async def list_users(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    current_admin: User = Depends(get_current_admin_user),
) -> Any:
    """List users (admin only).
    
    Role-based filtering:
    - Super Admin: sees all users
    - Techie Admin: sees only techies (verified, non-verified, resubmitted)
    - HM Admin: sees only hiring_manager users
    - Company Admin: sees only company_admin users
    - School Admin: sees only school_admin users
    """
    try:
        logger.info(f"[LIST_USERS] Starting request - search={search}, is_active={is_active}, skip={skip}, limit={limit}")
        logger.info(f"[LIST_USERS] Current admin: {current_admin.email if current_admin else 'None'}, admin_roles={current_admin.admin_roles if current_admin else []}, is_superuser={current_admin.is_superuser if current_admin else False}")
        
        # Determine what role types this admin can manage
        admin_roles = current_admin.admin_roles or []
        is_superadmin = current_admin.is_superuser or "superadmin" in admin_roles
        
        # Map admin roles to the user role types they can manage
        admin_to_user_role_map = {
            "superadmin": None,  # Can see all
            "hm_admin": RoleType.HIRING_MANAGER,
            "techie_admin": RoleType.TECHIE,
            "company_admin": RoleType.COMPANY_ADMIN,
            "school_admin": RoleType.SCHOOL_ADMIN,
            "bdm_admin": RoleType.BDM_ADMIN,
        }
        
        # Determine allowed role types for this admin
        allowed_role_types = set()
        for admin_role in admin_roles:
            role_type = admin_to_user_role_map.get(admin_role)
            if role_type:
                allowed_role_types.add(role_type)
        
        logger.info(f"[LIST_USERS] Admin roles: {admin_roles}, is_superadmin: {is_superadmin}, allowed_role_types: {allowed_role_types}")
        
        # Build query with role loading
        query = select(User).options(selectinload(User.roles))
        
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
        
        result = await db.execute(query)
        all_users = result.scalars().all()
        logger.info(f"[LIST_USERS] Fetched {len(all_users)} users from database")
        
        # Filter users based on admin's allowed role types
        filtered_users = []
        for user in all_users:
            try:
                # Skip super admins - they shouldn't appear in regular user list
                is_user_superadmin = user.is_superuser or (user.admin_roles and any(r.lower() == 'superadmin' for r in user.admin_roles))
                if is_user_superadmin:
                    continue
                
                # Determine user's role type
                user_role_type = None
                if hasattr(user, 'roles') and user.roles:
                    for role in user.roles:
                        if hasattr(role, 'role_type'):
                            user_role_type = role.role_type
                            break  # Take first role
                
                # For techie_admin: Only show users who explicitly have TECHIE role
                # Don't default to TECHIE for users without roles
                if not user_role_type:
                    # Only default to TECHIE if this is a superadmin viewing all
                    if is_superadmin:
                        user_role_type = RoleType.TECHIE
                    else:
                        # For role-specific admins, skip users without explicit roles
                        continue
                
                # Check if superadmin or if admin can manage this user type
                if is_superadmin:
                    # Superadmin can see all
                    filtered_users.append(user)
                elif allowed_role_types:
                    # Non-superadmin: only show users they can manage
                    if user_role_type in allowed_role_types:
                        filtered_users.append(user)
                else:
                    # Admin has no specific role mapping, show nothing
                    pass
            except Exception as e:
                logger.warning(f"[LIST_USERS] Error processing user {user.id if hasattr(user, 'id') else 'unknown'}: {e}")
                continue
        
        logger.info(f"[LIST_USERS] After role filtering: {len(filtered_users)} users")
        
        # Apply pagination after filtering
        paginated_users = filtered_users[skip:skip + limit]
        logger.info(f"[LIST_USERS] After pagination: {len(paginated_users)} users")
        
        # Transform to include all necessary fields for frontend
        user_list = []
        for user in paginated_users:
            # Determine user_type string for frontend compatibility
            u_type = "techie"
            if hasattr(user, 'roles') and user.roles:
                rt = user.roles[0].role_type
                if rt == RoleType.HIRING_MANAGER:
                    u_type = "hr"
                elif rt == RoleType.COMPANY_ADMIN:
                    u_type = "company"
                elif rt == RoleType.SCHOOL_ADMIN:
                    u_type = "school"
                else:
                    u_type = rt.value

            user_list.append({
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
                "is_staff": user.is_superuser or bool(user.admin_roles),  # Staff if superuser or has admin_roles
                "email_verified": user.email_verified,
                "mobile_verified": user.mobile_verified,
                "created_at": user.created_at,
                "admin_roles": user.admin_roles or [],  # Include admin_roles for frontend filtering
                "date_joined": user.created_at,  # Alias for frontend compatibility
                "last_login": user.last_login,
                "verification_status": user.verification_status or "PENDING",
                "groups": [{"name": r.role_type.value} for r in user.roles] if hasattr(user, 'roles') and user.roles else [],
                "user_type": u_type,
            })
        return user_list
    except Exception as e:
        logger.error(f"[LIST_USERS] ERROR: {str(e)}")
        import traceback
        logger.error(f"[LIST_USERS] Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching users: {str(e)}"
        )


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
    
    # Return dict with is_staff derived from is_superuser or admin_roles (for frontend compatibility)
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
        "is_staff": user.is_superuser or bool(user.admin_roles),  # Staff if superuser or has admin_roles
        "email_verified": user.email_verified,
        "mobile_verified": user.mobile_verified,
        "created_at": user.created_at,
        "admin_roles": user.admin_roles or [],  # Include admin_roles for frontend
        "date_joined": user.created_at,  # Alias for frontend compatibility
        "last_login": user.last_login,
        "verification_status": (user.verification_status or "PENDING").lower(),
    }


@router.get("/{user_id}/profile", response_model=UserProfileResponse)
@router.get("/{user_id}/profile/", response_model=UserProfileResponse, include_in_schema=False)
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
        # Return empty profile if not found (user may not have created one yet)
        # Create a temporary profile object with default values
        profile = UserProfile(user_id=user_id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    
    return profile


# ============= Experience Endpoints =============
# IMPORTANT: /me/ routes MUST come BEFORE /{user_id}/ routes to avoid UUID parsing errors

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


@router.get("/{user_id}/experiences", response_model=List[ExperienceResponse])
@router.get("/{user_id}/experiences/", response_model=List[ExperienceResponse], include_in_schema=False)
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
# IMPORTANT: /me/ routes MUST come BEFORE /{user_id}/ routes to avoid UUID parsing errors

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


@router.get("/{user_id}/educations", response_model=List[EducationResponse])
@router.get("/{user_id}/educations/", response_model=List[EducationResponse], include_in_schema=False)
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
    """Admin: Delete a user. Techie admin can only delete techies; superadmin can delete any user."""
    
    result = await db.execute(
        select(User).options(selectinload(User.roles)).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Role-scoped admins (e.g. techie_admin) may only delete users of their managed type
    admin_roles = admin_user.admin_roles or []
    is_superadmin = admin_user.is_superuser or "superadmin" in admin_roles
    if not is_superadmin:
        admin_to_role = {
            "techie_admin": RoleType.TECHIE,
            "hm_admin": RoleType.HIRING_MANAGER,
            "company_admin": RoleType.COMPANY_ADMIN,
            "school_admin": RoleType.SCHOOL_ADMIN,
        }
        target_role = None
        if user.roles:
            for r in user.roles:
                if hasattr(r, "role_type"):
                    target_role = r.role_type
                    break
        allowed = False
        for ar in admin_roles:
            allowed_role = admin_to_role.get(ar)
            if allowed_role and target_role == allowed_role:
                allowed = True
                break
        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only remove users of the type you manage (e.g. Tech Professionals)."
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


@router.post("/{user_id}/reject")
async def reject_user(
    user_id: UUID,
    reason: Optional[str] = None,
    permanent_delete: bool = True,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Admin: Reject a user during verification.
    
    If permanent_delete=True (default), the user and ALL their data 
    (profile, experiences, educations, applications, notifications) 
    are permanently deleted, freeing up the email for reuse.
    
    If permanent_delete=False, user is marked as REJECTED but data is kept.
    """
    from datetime import datetime
    from app.models.user import VerificationStatus
    from app.models.job import JobApplication
    from app.models.notification import Notification
    
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_email = user.email  # Store for response message
    
    if permanent_delete:
        # Delete all related data explicitly (in case cascade doesn't work)
        # Delete job applications
        await db.execute(
            select(JobApplication).where(JobApplication.applicant_id == user_id)
        )
        app_result = await db.execute(
            select(JobApplication).where(JobApplication.applicant_id == user_id)
        )
        for app in app_result.scalars().all():
            await db.delete(app)
        
        # Delete notifications
        try:
            notif_result = await db.execute(
                select(Notification).where(Notification.user_id == user_id)
            )
            for notif in notif_result.scalars().all():
                await db.delete(notif)
        except Exception as e:
            print(f"Could not delete notifications: {e}")
        
        # Delete user (cascade will delete profile, experiences, educations)
        await db.delete(user)
        await db.commit()
        
        return {
            "message": f"User {user_email} rejected and permanently deleted",
            "email_freed": True,
            "permanent_delete": True
        }
    else:
        # Just mark as rejected, keep data
        user.verification_status = VerificationStatus.REJECTED
        user.reviewed_by_id = admin_user.id
        user.reviewed_at = datetime.utcnow()
        user.rejection_reason = reason
        user.is_active = False
        
        await db.commit()
        
        return {
            "message": f"User {user_email} marked as rejected",
            "email_freed": False,
            "permanent_delete": False
        }


# ============= Company Endpoints for HR Users =============

@router.get("/me/company")
async def get_my_company(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get current user's company details (for HR users)."""
    
    # Find company where user is an admin
    result = await db.execute(
        select(Company)
        .join(CompanyAdmin, Company.id == CompanyAdmin.company_id)
        .where(CompanyAdmin.user_id == current_user.id)
    )
    company = result.scalar_one_or_none()
    
    if not company:
        return None
    
    return {
        "id": str(company.id),
        "name": company.name,
        "website": company.website,
        "email": company.email,
        "description": company.description,
        "industry": company.industry,
        "headquarters": company.headquarters,
        "logo_url": company.logo_url,
        "cover_image_url": company.cover_image_url,
        "company_size": company.company_size,
        "founded_year": company.founded_year,
    }


def _school_to_response(school) -> dict:
    """Build school response dict."""
    return {
        "id": str(school.id),
        "name": school.name,
        "slug": school.slug,
        "short_name": school.short_name,
        "description": school.description,
        "tagline": school.tagline,
        "website": school.website,
        "email": school.email,
        "phone": school.phone,
        "city": school.city,
        "state": school.state,
        "country": school.country,
        "logo_url": getattr(school, "logo_url", None),
        "cover_image_url": getattr(school, "cover_image_url", None),
    }


@router.get("/me/school")
async def get_my_school(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get current user's school details (for school admins).
    First tries SchoolAdmin link; if user has school_admin role but no school, creates a default school and links them.
    """
    # 1) School from SchoolAdmin (user is admin of a school)
    result = await db.execute(
        select(School)
        .join(SchoolAdmin, School.id == SchoolAdmin.school_id)
        .where(SchoolAdmin.user_id == current_user.id)
    )
    school = result.scalar_one_or_none()
    if school:
        return _school_to_response(school)

    # 2) User has school_admin role but no SchoolAdmin row (e.g. created without school_name) -> create default school and link
    from app.models.school import SchoolStatus, SchoolType
    from slugify import slugify
    admin_roles = current_user.admin_roles or []
    has_school_role = "school_admin" in (admin_roles if isinstance(admin_roles, list) else [])
    if has_school_role:
        name = f"School of {current_user.first_name or ''} {current_user.last_name or ''}".strip() or f"School ({current_user.email})"
        slug_base = slugify(name)
        slug = slug_base
        n = 0
        while True:
            existing = await db.execute(select(School).where(School.slug == slug))
            if existing.scalar_one_or_none() is None:
                break
            n += 1
            slug = f"{slug_base}-{n}"
        school = School(
            name=name,
            slug=slug,
            email=current_user.email,
            school_type=SchoolType.UNIVERSITY,
            status=SchoolStatus.ACTIVE,
            is_verified=False,
            city="",
            country="",
        )
        db.add(school)
        await db.flush()
        school_admin = SchoolAdmin(
            school_id=school.id,
            user_id=current_user.id,
            role="owner",
            can_manage_students=True,
            can_manage_programs=True,
            can_manage_placements=True,
            can_manage_admins=True,
        )
        db.add(school_admin)
        await db.commit()
        await db.refresh(school)
        return _school_to_response(school)

    return None

