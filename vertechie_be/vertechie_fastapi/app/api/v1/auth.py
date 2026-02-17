"""
Authentication API endpoints.
"""

import logging
from datetime import datetime, timedelta
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, func
from slugify import slugify

from app.db.session import get_db
from app.models.user import User, UserRole, UserProfile, Experience, Education, RoleType, VerificationStatus, user_roles
from app.models.company import Company, CompanyAdmin, CompanyStatus
from app.models.school import School, SchoolAdmin, SchoolStatus, SchoolType
from app.schemas.auth import (
    UserRegister, UserLogin, Token, TokenRefresh,
    PasswordReset, PasswordResetConfirm, PasswordChange,
    OTPRequest, OTPVerify
)
from app.schemas.user import UserResponse, AdminUserCreate
from app.core.security import (
    get_password_hash, verify_password,
    create_access_token, create_refresh_token, verify_token,
    get_current_user, get_current_admin_user
)

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserRegister,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Register a new user."""
    
    # Check if email exists
    result = await db.execute(
        select(User).where(User.email == user_in.email)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Generate vertechie_id
    vertechie_id = f"VT{uuid4().hex[:8].upper()}"
    
    # Generate username
    base_username = slugify(f"{user_in.first_name}-{user_in.last_name}")
    username = f"{base_username}-{uuid4().hex[:4]}"
    
    # Create user
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        middle_name=user_in.middle_name,
        phone=user_in.phone,
        mobile_number=user_in.mobile_number,
        dob=user_in.dob,
        country=user_in.country,
        address=user_in.address,
        gov_id=user_in.gov_id,
        username=username,
        vertechie_id=vertechie_id,
        email_verified=user_in.email_verified,
        mobile_verified=user_in.mobile_verified,
        face_verification=user_in.face_verification,
    )
    
    db.add(user)
    await db.flush()
    
    # Create profile
    profile = UserProfile(
        user_id=user.id,
        bio=user_in.about if user_in.about else None,
        current_company=user_in.company_name if user_in.company_name else None,
    )
    db.add(profile)
    
    # Determine role type based on frontend role field
    role_mapping = {
        "techie": RoleType.TECHIE,
        "hr": RoleType.HIRING_MANAGER,
        "hiring_manager": RoleType.HIRING_MANAGER,
        "company": RoleType.COMPANY_ADMIN,
        "school": RoleType.SCHOOL_ADMIN,
    }
    
    requested_role = (user_in.role or "techie").lower()
    role_type = role_mapping.get(requested_role, RoleType.TECHIE)
    
    # Get or create the appropriate role
    result = await db.execute(select(UserRole).where(UserRole.role_type == role_type))
    role = result.scalar_one_or_none()
    
    if not role:
        role_names = {
            RoleType.TECHIE: "Techie",
            RoleType.HIRING_MANAGER: "Hiring Manager",
            RoleType.COMPANY_ADMIN: "Company Admin",
            RoleType.SCHOOL_ADMIN: "School Admin",
        }
        role = UserRole(
            name=role_names.get(role_type, "User"),
            role_type=role_type,
            description=f"{role_type.value} user role"
        )
        db.add(role)
        await db.flush()
    
    await db.execute(insert(user_roles).values(user_id=user.id, role_id=role.id))
    
    # Handle techie-specific data (Experience & Education)
    if user_in.experiences:
        for exp_data in user_in.experiences:
            start_date = None
            end_date = None
            try:
                from datetime import datetime as dt
                if hasattr(exp_data, 'from_date') or (isinstance(exp_data, dict) and exp_data.get('from_date')):
                    fd = exp_data.get('from_date') if isinstance(exp_data, dict) else exp_data.from_date
                    start_date = dt.strptime(fd, "%Y-%m-%d").date() if fd else None
                if hasattr(exp_data, 'to_date') or (isinstance(exp_data, dict) and exp_data.get('to_date')):
                    td = exp_data.get('to_date') if isinstance(exp_data, dict) else exp_data.to_date
                    end_date = dt.strptime(td, "%Y-%m-%d").date() if td else None
            except (ValueError, TypeError):
                pass
            
            experience = Experience(
                user_id=user.id,
                title=(exp_data.get('job_title') if isinstance(exp_data, dict) else getattr(exp_data, 'job_title', '')) or "Position",
                company_name=(exp_data.get('client_name') if isinstance(exp_data, dict) else getattr(exp_data, 'client_name', '')) or "Company",
                location=exp_data.get('work_location') if isinstance(exp_data, dict) else getattr(exp_data, 'work_location', None),
                start_date=start_date or datetime.utcnow().date(),
                end_date=end_date,
                is_current=not end_date,
                description=exp_data.get('job_description') if isinstance(exp_data, dict) else getattr(exp_data, 'job_description', None),
                skills=exp_data.get('skills') if isinstance(exp_data, dict) else getattr(exp_data, 'skills', []),
            )
            db.add(experience)

    if user_in.educations:
        for edu_data in user_in.educations:
            start_year = None
            end_year = None
            try:
                fd = edu_data.get('from_date') if isinstance(edu_data, dict) else edu_data.from_date
                td = edu_data.get('to_date') if isinstance(edu_data, dict) else edu_data.to_date
                if fd: start_year = int(fd[:4])
                if td: end_year = int(td[:4])
            except (ValueError, TypeError, IndexError):
                pass
            
            education = Education(
                user_id=user.id,
                school_name=(edu_data.get('institution_name') if isinstance(edu_data, dict) else getattr(edu_data, 'institution_name', '')) or "Institution",
                degree=edu_data.get('level_of_education') if isinstance(edu_data, dict) else getattr(edu_data, 'level_of_education', None),
                field_of_study=edu_data.get('field_of_study') if isinstance(edu_data, dict) else getattr(edu_data, 'field_of_study', None),
                start_year=start_year,
                end_year=end_year,
                grade=edu_data.get('score_value') or edu_data.get('gpa_score') if isinstance(edu_data, dict) else None,
            )
            db.add(education)

    # Handle organization linking for HR/Company/School
    if role_type in [RoleType.HIRING_MANAGER, RoleType.COMPANY_ADMIN] and user_in.company_name:
        company_name = user_in.company_name
        company_slug = slugify(company_name)
        result = await db.execute(select(Company).where((func.lower(Company.name) == func.lower(company_name)) | (Company.slug == company_slug)))
        company = result.scalar_one_or_none()
        if not company:
            company = Company(
                name=company_name,
                slug=company_slug,
                email=user_in.company_email or user_in.email,
                website=user_in.company_website,
                description=user_in.about,
                status=CompanyStatus.ACTIVE,
                is_verified=True
            )
            db.add(company)
            await db.flush()
        
        link_role = "hr" if role_type == RoleType.HIRING_MANAGER else "owner"
        admin_result = await db.execute(select(CompanyAdmin).where(CompanyAdmin.company_id == company.id, CompanyAdmin.user_id == user.id))
        if not admin_result.scalar_one_or_none():
            db.add(CompanyAdmin(
                company_id=company.id, user_id=user.id, role=link_role,
                can_manage_jobs=True, can_manage_candidates=True,
                can_manage_team=(link_role == "owner"), can_manage_admins=(link_role == "owner")
            ))

    elif role_type == RoleType.SCHOOL_ADMIN and user_in.school_name:
        school_name = user_in.school_name
        school_slug = slugify(school_name)
        result = await db.execute(select(School).where((func.lower(School.name) == func.lower(school_name)) | (School.slug == school_slug)))
        school = result.scalar_one_or_none()
        if not school:
            school = School(
                name=school_name, slug=school_slug, email=user_in.email,
                school_type=SchoolType.UNIVERSITY, status=SchoolStatus.ACTIVE, is_verified=True
            )
            db.add(school)
            await db.flush()
        
        admin_result = await db.execute(select(SchoolAdmin).where(SchoolAdmin.school_id == school.id, SchoolAdmin.user_id == user.id))
        if not admin_result.scalar_one_or_none():
            db.add(SchoolAdmin(
                school_id=school.id, user_id=user.id, role="owner",
                can_manage_students=True, can_manage_programs=True,
                can_manage_placements=True, can_manage_admins=True
            ))

    await db.commit()
    await db.refresh(user)
    
    return {
        "id": str(user.id),
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "middle_name": user.middle_name,
        "username": user.username,
        "vertechie_id": user.vertechie_id,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "email_verified": user.email_verified,
        "mobile_verified": user.mobile_verified,
        "face_verification": user.face_verification,
        "country": user.country,
        "dob": str(user.dob) if user.dob else None,
        "address": user.address,
        "created_at": str(user.created_at) if user.created_at else None,
        "role": role_type.value,
        "role_type": role_type.value,
    }


@router.post("/login")
async def login(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Login and get access token with user data."""
    
    # Find user
    result = await db.execute(
        select(User).where(func.lower(User.email) == func.lower(login_data.email))
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    if user.is_blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is blocked"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()
    
    # Fetch user roles using SQL to avoid lazy loading issues
    roles_result = await db.execute(
        select(UserRole).join(user_roles).where(user_roles.c.user_id == user.id)
    )
    user_role_list = roles_result.scalars().all()
    role_values = [r.role_type.value for r in user_role_list] if user_role_list else []
    
    # Create tokens
    access_token = create_access_token(
        subject=str(user.id),
        additional_claims={
            "email": user.email,
            "roles": role_values
        }
    )
    refresh_token_value = create_refresh_token(subject=str(user.id))
    
    # Build user data for frontend compatibility
    user_data = {
        "id": str(user.id),
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "middle_name": user.middle_name,
        "username": user.username,
        "vertechie_id": user.vertechie_id,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "is_superuser": user.is_superuser,
        "is_staff": user.is_superuser or (user.admin_roles and len(user.admin_roles) > 0),
        "country": user.country,
        "mobile_number": user.mobile_number,
        "dob": str(user.dob) if user.dob else None,
        "address": user.address,
        "email_verified": user.email_verified,
        "mobile_verified": user.mobile_verified,
        "admin_roles": user.admin_roles or [],
        "groups": [{"name": r.role_type.value} for r in user_role_list] if user_role_list else [],
        "user_permissions": [],
        "verification_status": user.verification_status.value if user.verification_status else "PENDING",
        "role": user_role_list[0].role_type.value if user_role_list else "techie",
    }
    
    return {
        "access": access_token,
        "refresh": refresh_token_value,
        "user_data": user_data
    }


@router.post("/token", response_model=Token)
async def token_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """OAuth2 compatible token login (form data)."""
    
    # Find user
    result = await db.execute(
        select(User).where(func.lower(User.email) == func.lower(form_data.username))
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    if user.is_blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is blocked"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()
    
    # Create tokens
    access_token = create_access_token(
        subject=str(user.id),
        additional_claims={
            "email": user.email,
            "roles": [r.role_type.value for r in user.roles] if user.roles else []
        }
    )
    refresh_token_value = create_refresh_token(subject=str(user.id))
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token_value
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(
    token_in: TokenRefresh,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Refresh access token."""
    
    user_id = verify_token(token_in.refresh_token, token_type="refresh")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Get user
    from uuid import UUID
    result = await db.execute(
        select(User).where(User.id == UUID(user_id))
    )
    user = result.scalar_one_or_none()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Create new tokens
    access_token = create_access_token(
        subject=str(user.id),
        additional_claims={
            "email": user.email,
            "roles": [r.role_type.value for r in user.roles] if user.roles else []
        }
    )
    new_refresh_token = create_refresh_token(subject=str(user.id))
    
    return Token(
        access_token=access_token,
        refresh_token=new_refresh_token
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get current user info."""
    return current_user


@router.post("/password/change")
async def change_password(
    password_in: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Change current user's password."""
    
    if not verify_password(password_in.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    current_user.hashed_password = get_password_hash(password_in.new_password)
    await db.commit()
    
    return {"message": "Password changed successfully"}


@router.post("/password/reset")
async def request_password_reset(
    reset_in: PasswordReset,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Request password reset email."""
    
    result = await db.execute(
        select(User).where(User.email == reset_in.email)
    )
    user = result.scalar_one_or_none()
    
    if user:
        # Generate reset token
        reset_token = create_access_token(
            subject=str(user.id),
            expires_delta=timedelta(hours=1),
            additional_claims={"type": "password_reset"}
        )
        
        # TODO: Send email in background
        # background_tasks.add_task(send_password_reset_email, user.email, reset_token)
    
    # Always return success (security)
    return {"message": "If an account exists, a password reset email will be sent"}


@router.post("/password/reset/confirm")
async def confirm_password_reset(
    reset_in: PasswordResetConfirm,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Reset password with token."""
    
    from app.core.security import decode_token
    
    payload = decode_token(reset_in.token)
    if not payload or payload.get("type") != "password_reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    from uuid import UUID
    result = await db.execute(
        select(User).where(User.id == UUID(payload.get("sub")))
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.hashed_password = get_password_hash(reset_in.new_password)
    await db.commit()
    
    return {"message": "Password reset successfully"}


# ============= Admin Endpoints =============

@router.post("/admin/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def admin_create_user(
    user_in: AdminUserCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
) -> Any:
    """Admin: Create a new user with full details.
    
    Handles all user types: techie, hr, company, school, admin
    """
    try:
        # Check if email exists
        result = await db.execute(
            select(User).where(User.email == user_in.email)
        )
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Generate vertechie_id
        vertechie_id = f"VT{uuid4().hex[:8].upper()}"
        
        # Generate username - use email prefix if names not provided (for admin users)
        if user_in.first_name and user_in.last_name:
            base_username = slugify(f"{user_in.first_name}-{user_in.last_name}")
            username = f"{base_username}-{uuid4().hex[:4]}"
        else:
            # For admin users created with only email/password, use email prefix
            email_prefix = user_in.email.split('@')[0]
            username = f"{slugify(email_prefix)}-{uuid4().hex[:4]}"
        
        # Parse DOB if provided as string
        dob = None
        if user_in.dob:
            try:
                from datetime import datetime as dt
                dob = dt.strptime(user_in.dob, "%Y-%m-%d").date()
            except (ValueError, TypeError):
                pass
        
        # Determine role type based on role field
        role_mapping = {
            "techie": RoleType.TECHIE,
            "hr": RoleType.HIRING_MANAGER,
            "company": RoleType.COMPANY_ADMIN,
            "school": RoleType.SCHOOL_ADMIN,
            "admin": RoleType.SUPER_ADMIN,
        }
        role_type = role_mapping.get(user_in.role, RoleType.TECHIE)
        
        # Set admin_roles - prefer frontend-provided roles, fallback to mapping
        # Frontend sends specific admin_roles like ["hm_admin", "company_admin"]
        if user_in.admin_roles and len(user_in.admin_roles) > 0:
            # Use frontend-provided admin_roles
            admin_roles = user_in.admin_roles
        else:
            # Fallback to mapping based on role type
            admin_roles_mapping = {
                "admin": ["superadmin", "admin"],
                "hr": ["hm_admin"],  # Hiring Manager Admin
                "company": ["company_admin"],
                "school": ["school_admin"],
            }
            admin_roles = admin_roles_mapping.get(user_in.role, [])
        
        # Ensure admin_roles is always a list (not None)
        if admin_roles is None:
            admin_roles = []
        
        # Determine if user is superuser - only if admin_roles includes "superadmin"
        # HM Admin, Company Admin, etc. should NOT be superusers
        is_superuser = "superadmin" in admin_roles if admin_roles else False
        
        # Create user
        # Admin-created users should be APPROVED (not PENDING) since admin is creating them
        user = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            middle_name=user_in.middle_name,
            mobile_number=user_in.mobile_number,
            dob=dob,
            country=user_in.country,
            gov_id=user_in.gov_id,
            address=user_in.address,
            username=username,
            vertechie_id=vertechie_id,
            email_verified=True,  # Admin-created users are pre-verified
            mobile_verified=True,
            is_verified=True,
            is_superuser=is_superuser,
            admin_roles=admin_roles,  # Set admin roles for panel visibility
            verification_status=VerificationStatus.APPROVED,  # Admin-created users are pre-approved
        )
        
        db.add(user)
        await db.flush()
        
        # Create profile (only if any profile data is provided, or always create empty profile)
        profile = UserProfile(
            user_id=user.id,
            bio=user_in.profile if user_in.profile else None,
            current_company=user_in.company_name if user_in.company_name else None,
        )
        db.add(profile)
        
        # Get or create role
        result = await db.execute(
            select(UserRole).where(UserRole.role_type == role_type)
        )
        role = result.scalar_one_or_none()
        
        if not role:
            role = UserRole(
                name=role_type.value.replace("_", " ").title(),
                role_type=role_type,
            )
            db.add(role)
            await db.flush()
        
        # Add role association using SQL to avoid lazy loading issues
        await db.execute(
            insert(user_roles).values(user_id=user.id, role_id=role.id)
        )
        
        # Add experiences for techie users
        if user_in.experiences:
            for exp_data in user_in.experiences:
                # Parse dates
                start_date = None
                end_date = None
                try:
                    from datetime import datetime as dt
                    if exp_data.from_date:
                        start_date = dt.strptime(exp_data.from_date, "%Y-%m-%d").date()
                    if exp_data.to_date:
                        end_date = dt.strptime(exp_data.to_date, "%Y-%m-%d").date()
                except (ValueError, TypeError):
                    pass
                
                experience = Experience(
                    user_id=user.id,
                    title=exp_data.job_title or "Position",
                    company_name=exp_data.client_name or "Company",
                    location=exp_data.work_location,
                    start_date=start_date or datetime.utcnow().date(),
                    end_date=end_date,
                    is_current=not exp_data.to_date,
                    description=exp_data.job_description,
                    skills=exp_data.skills or [],
                )
                db.add(experience)
        
        # Add educations for techie users
        if user_in.educations:
            for edu_data in user_in.educations:
                # Parse years from dates
                start_year = None
                end_year = None
                try:
                    if edu_data.from_date:
                        start_year = int(edu_data.from_date[:4])
                    if edu_data.to_date:
                        end_year = int(edu_data.to_date[:4])
                except (ValueError, TypeError):
                    pass
                
                raw_score_value = (edu_data.score_value or edu_data.gpa_score or "").strip()
                inferred_score_type = None
                if edu_data.score_type:
                    inferred_score_type = edu_data.score_type.lower()
                elif raw_score_value:
                    try:
                        numeric_score = float(raw_score_value)
                        inferred_score_type = "cgpa" if numeric_score <= 10 else ("percentage" if numeric_score <= 100 else "grade")
                    except ValueError:
                        inferred_score_type = "grade"

                education = Education(
                    user_id=user.id,
                    school_name=edu_data.institution_name or "Institution",
                    degree=edu_data.level_of_education,
                    field_of_study=edu_data.field_of_study,
                    start_year=start_year,
                    end_year=end_year,
                    grade=edu_data.score_value or edu_data.gpa_score,
                    score_type=inferred_score_type,
                    score_value=raw_score_value or None,
                )
                db.add(education)
        
        await db.commit()
        await db.refresh(user)
        
        # Determine organization association based on role
        if user_in.role in ["hr", "company"] and user_in.company_name:
            # Handle Company association
            company_name = user_in.company_name
            company_slug = slugify(company_name)
            
            # Find or create company
            result = await db.execute(
                select(Company).where(
                    (func.lower(Company.name) == func.lower(company_name)) |
                    (Company.slug == company_slug)
                )
            )
            company = result.scalar_one_or_none()
            
            if not company:
                # Create new company
                company = Company(
                    name=company_name,
                    slug=company_slug,
                    email=user_in.company_email or user_in.email,
                    website=user_in.company_website,
                    description=user_in.about,
                    status=CompanyStatus.ACTIVE,
                    is_verified=True
                )
                db.add(company)
                await db.flush()
            
            # Create CompanyAdmin link
            # role="hr" -> recruiter/hr role in company
            # role="company" -> owner role in company
            link_role = "hr" if user_in.role == "hr" else "owner"
            
            # Check if association already exists
            admin_result = await db.execute(
                select(CompanyAdmin).where(
                    CompanyAdmin.company_id == company.id,
                    CompanyAdmin.user_id == user.id
                )
            )
            if not admin_result.scalar_one_or_none():
                company_admin = CompanyAdmin(
                    company_id=company.id,
                    user_id=user.id,
                    role=link_role,
                    can_manage_jobs=True,
                    can_manage_candidates=True,
                    can_manage_team=(link_role == "owner"),
                    can_manage_admins=(link_role == "owner")
                )
                db.add(company_admin)
        
        elif user_in.role == "school" and user_in.school_name:
            # Handle School association
            school_name = user_in.school_name
            school_slug = slugify(school_name)
            
            # Find or create school
            result = await db.execute(
                select(School).where(
                    (func.lower(School.name) == func.lower(school_name)) |
                    (School.slug == school_slug)
                )
            )
            school = result.scalar_one_or_none()
            
            if not school:
                # Create new school
                school = School(
                    name=school_name,
                    slug=school_slug,
                    email=user_in.email,
                    school_type=SchoolType.UNIVERSITY, # Default
                    status=SchoolStatus.ACTIVE,
                    is_verified=True
                )
                db.add(school)
                await db.flush()
            
            # Create SchoolAdmin link
            admin_result = await db.execute(
                select(SchoolAdmin).where(
                    SchoolAdmin.school_id == school.id,
                    SchoolAdmin.user_id == user.id
                )
            )
            if not admin_result.scalar_one_or_none():
                school_admin = SchoolAdmin(
                    school_id=school.id,
                    user_id=user.id,
                    role="owner",
                    can_manage_students=True,
                    can_manage_programs=True,
                    can_manage_placements=True,
                    can_manage_admins=True
                )
                db.add(school_admin)
        
        await db.commit()
        await db.refresh(user)
        
        return user
        
    except HTTPException:
        # Re-raise HTTP exceptions (400, 403, etc.)
        raise
    except Exception as e:
        await db.rollback()
        logger.exception(f"Error creating admin user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )


@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user)
) -> Any:
    """Logout current user."""
    # In a stateless JWT setup, logout is handled client-side
    # For token blacklisting, you'd add the token to a blacklist here
    return {"message": "Successfully logged out"}


# ============= Forgot Password Endpoints (Frontend Compatible) =============

@router.post("/forgot-password")
async def forgot_password(
    reset_in: PasswordReset,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Request password reset email (frontend compatible endpoint)."""
    from app.core.email import send_password_reset_email
    import logging
    logger = logging.getLogger(__name__)
    
    result = await db.execute(
        select(User).where(User.email == reset_in.email)
    )
    user = result.scalar_one_or_none()
    
    if user:
        # Generate reset token
        reset_token = create_access_token(
            subject=str(user.id),
            expires_delta=timedelta(hours=1),
            additional_claims={"type": "password_reset"}
        )
        
        # Get user's name for personalization
        user_name = user.first_name or user.username or "User"
        
        # Log the token for development/testing
        logger.info(f"Password reset requested for {user.email}")
        
        # Send email in background task
        background_tasks.add_task(
            send_password_reset_email,
            user.email,
            reset_token,
            user_name
        )
    
    # Always return success (security - don't reveal if email exists)
    return {"message": "If an account exists with this email, a password reset link will be sent."}


@router.post("/reset-password")
async def reset_password(
    reset_in: PasswordResetConfirm,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Reset password with token (frontend compatible endpoint)."""
    
    from app.core.security import decode_token
    
    payload = decode_token(reset_in.token)
    if not payload or payload.get("type") != "password_reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    from uuid import UUID
    result = await db.execute(
        select(User).where(User.id == UUID(payload.get("sub")))
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.hashed_password = get_password_hash(reset_in.new_password)
    await db.commit()
    
    return {"message": "Password reset successfully"}

