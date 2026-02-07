"""
School API Routes
User and Admin endpoints for school management
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.school import (
    School, Department, Program, StudentBatch,
    SchoolMember, SchoolAdmin, Placement, SchoolInvite,
    SchoolType, SchoolStatus, ProgramType, MemberType, InviteStatus
)
from app.models.user import User
from app.core.security import get_current_user, get_current_admin_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Schools"])


# ============= Pydantic Schemas =============

class SchoolBase(BaseModel):
    name: str
    slug: str
    short_name: Optional[str] = None
    school_type: SchoolType
    description: Optional[str] = None
    tagline: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    website: Optional[str] = None
    email: str
    phone: Optional[str] = None
    established_year: Optional[int] = None

class SchoolCreate(SchoolBase):
    pass

class SchoolUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    tagline: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    logo_url: Optional[str] = None
    # Allow updating banner image/gradient reference
    cover_image_url: Optional[str] = None

class SchoolResponse(SchoolBase):
    id: UUID
    logo_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    students_count: int = 0
    alumni_count: int = 0
    programs_count: int = 0
    placement_rate: Optional[float] = None
    status: SchoolStatus
    is_verified: bool
    is_featured: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class DepartmentCreate(BaseModel):
    name: str
    short_name: Optional[str] = None
    description: Optional[str] = None

class DepartmentResponse(DepartmentCreate):
    id: UUID
    school_id: UUID
    students_count: int = 0
    
    class Config:
        from_attributes = True

class ProgramCreate(BaseModel):
    name: str
    code: Optional[str] = None
    program_type: ProgramType
    description: Optional[str] = None
    duration_months: Optional[int] = None
    tuition_fee: Optional[float] = None
    currency: str = "USD"
    department_id: Optional[UUID] = None

class ProgramResponse(ProgramCreate):
    id: UUID
    school_id: UUID
    seats_available: Optional[int] = None
    enrolled_count: int = 0
    is_active: bool
    
    class Config:
        from_attributes = True


class ProgramUpdate(BaseModel):
    """Fields allowed when updating a program."""
    name: Optional[str] = None
    code: Optional[str] = None
    program_type: Optional[ProgramType] = None
    description: Optional[str] = None
    duration_months: Optional[int] = None
    tuition_fee: Optional[float] = None
    currency: Optional[str] = None
    department_id: Optional[UUID] = None
    seats_available: Optional[int] = None
    is_active: Optional[bool] = None


class SchoolAdminCreate(BaseModel):
    """Payload for creating a school admin (page admin)."""
    email: Optional[str] = None
    user_id: Optional[UUID] = None
    role: str = "admin"  # owner, admin, placement_head, alumni_coordinator, etc.
    can_manage_students: Optional[bool] = None
    can_manage_programs: Optional[bool] = None
    can_manage_placements: Optional[bool] = None
    can_manage_admins: Optional[bool] = None


class SchoolAdminResponse(BaseModel):
    id: UUID
    school_id: UUID
    user_id: Optional[UUID]
    role: str
    can_manage_students: bool
    can_manage_programs: bool
    can_manage_placements: bool
    can_manage_admins: bool
    added_at: datetime
    user_email: Optional[str] = None
    user_name: Optional[str] = None

    class Config:
        from_attributes = True

class SchoolMemberCreate(BaseModel):
    member_type: MemberType
    student_id: Optional[str] = None
    department_id: Optional[UUID] = None
    graduation_year: Optional[int] = None

class SchoolMemberResponse(SchoolMemberCreate):
    id: UUID
    school_id: UUID
    user_id: Optional[UUID] = None
    email: Optional[str] = None  # Added for invites
    status: Optional[str] = None # Added for invites
    is_verified: bool
    joined_at: datetime
    
    class Config:
        from_attributes = True


# ============= User Endpoints =============

@router.get("/", response_model=List[SchoolResponse])
async def list_schools(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    school_type: Optional[SchoolType] = None,
    city: Optional[str] = None,
    country: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List all schools with filters."""
    query = select(School).where(School.status == SchoolStatus.ACTIVE)
    
    if school_type:
        query = query.where(School.school_type == school_type)
    if city:
        query = query.where(School.city.ilike(f"%{city}%"))
    if country:
        query = query.where(School.country.ilike(f"%{country}%"))
    if search:
        query = query.where(
            School.name.ilike(f"%{search}%") | 
            School.description.ilike(f"%{search}%")
        )
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/slug/{slug}", response_model=SchoolResponse)
async def get_school_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    """Get school by slug."""
    result = await db.execute(
        select(School).where(School.slug == slug)
    )
    school = result.scalar_one_or_none()
    
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    
    return school


# ============= Posts Routes (must be before GET /{school_id} to avoid route conflicts) =============

class SchoolPostCreate(BaseModel):
    content: Optional[str] = ""
    media: Optional[List[str]] = None


@router.get("/{school_id}/posts", include_in_schema=True)
@router.get("/{school_id}/posts/", include_in_schema=False)
async def get_school_posts(
    school_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get school posts (school admin only)."""
    admin_check = await db.execute(
        select(SchoolAdmin).where(
            SchoolAdmin.school_id == school_id,
            SchoolAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")

    admins_result = await db.execute(
        select(SchoolAdmin.user_id).where(SchoolAdmin.school_id == school_id)
    )
    admin_user_ids = [row[0] for row in admins_result.all()]
    if not admin_user_ids:
        return []

    from app.models.community import Post
    posts_result = await db.execute(
        select(Post)
        .where(Post.author_id.in_(admin_user_ids))
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    posts = posts_result.scalars().all()
    return [
        {
            "id": str(p.id),
            "content": p.content,
            "media": p.media or [],
            "author_id": str(p.author_id),
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "likes_count": p.likes_count or 0,
            "comments_count": p.comments_count or 0,
            "shares_count": p.shares_count or 0,
        }
        for p in posts
    ]


@router.post("/{school_id}/posts", include_in_schema=True)
@router.post("/{school_id}/posts/", include_in_schema=False)
async def create_school_post(
    school_id: UUID,
    post_data: SchoolPostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a school post (school admin only)."""
    admin_check = await db.execute(
        select(SchoolAdmin).where(
            SchoolAdmin.school_id == school_id,
            SchoolAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")

    has_content = bool(post_data.content and post_data.content.strip())
    has_media = bool(post_data.media and len(post_data.media) > 0)
    if not has_content and not has_media:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Post content or at least one image is required"
        )

    from app.models.community import Post, PostType
    post = Post(
        author_id=current_user.id,
        content=post_data.content or "",
        media=[{"url": url, "type": "image"} for url in (post_data.media or [])],
        post_type=PostType.TEXT,
        visibility="public",
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return {
        "id": str(post.id),
        "content": post.content,
        "media": post.media or [],
        "author_id": str(post.author_id),
        "created_at": post.created_at.isoformat() if post.created_at else None,
        "likes_count": 0,
        "comments_count": 0,
        "shares_count": 0,
    }


@router.get("/{school_id}/departments", response_model=List[DepartmentResponse])
async def get_school_departments(
    school_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get school departments."""
    result = await db.execute(
        select(Department).where(Department.school_id == school_id)
    )
    return result.scalars().all()


@router.get("/{school_id}/programs", response_model=List[ProgramResponse])
async def get_school_programs(
    school_id: UUID,
    program_type: Optional[ProgramType] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get school programs."""
    query = select(Program).where(Program.school_id == school_id, Program.is_active == True)
    
    if program_type:
        query = query.where(Program.program_type == program_type)
    
    result = await db.execute(query)
    return result.scalars().all()


# ============= Member Endpoints =============

@router.post("/{school_id}/join", response_model=SchoolMemberResponse)
async def join_school(
    school_id: UUID,
    member_data: SchoolMemberCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Join a school as member (requires verification)."""
    # Check if already a member
    existing = await db.execute(
        select(SchoolMember).where(
            SchoolMember.school_id == school_id,
            SchoolMember.user_id == current_user.id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already a member")
    
    member = SchoolMember(
        school_id=school_id,
        user_id=current_user.id,
        **member_data.model_dump()
    )
    db.add(member)
    await db.commit()
    await db.refresh(member)
    return member


# ============= School Admin Endpoints =============

@router.post("/", response_model=SchoolResponse)
async def create_school(
    school: SchoolCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new school (becomes admin)."""
    # Check if slug is unique
    existing = await db.execute(
        select(School).where(School.slug == school.slug)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    db_school = School(**school.model_dump())
    db.add(db_school)
    await db.commit()
    await db.refresh(db_school)
    
    # Add creator as admin
    admin = SchoolAdmin(
        school_id=db_school.id,
        user_id=current_user.id,
        role="owner",
        can_manage_students=True,
        can_manage_programs=True,
        can_manage_placements=True,
        can_manage_admins=True
    )
    db.add(admin)
    await db.commit()
    
    return db_school


@router.post("/{school_id}/departments", response_model=DepartmentResponse)
async def add_department(
    school_id: UUID,
    department: DepartmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a department to school."""
    # Verify admin access
    admin_check = await db.execute(
        select(SchoolAdmin).where(
            SchoolAdmin.school_id == school_id,
            SchoolAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_department = Department(school_id=school_id, **department.model_dump())
    db.add(db_department)
    await db.commit()
    await db.refresh(db_department)
    return db_department


@router.post("/{school_id}/programs", response_model=ProgramResponse)
async def add_program(
    school_id: UUID,
    program: ProgramCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a program to school."""
    # Verify admin access
    admin_check = await db.execute(
        select(SchoolAdmin).where(
            SchoolAdmin.school_id == school_id,
            SchoolAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_program = Program(school_id=school_id, **program.model_dump())
    db.add(db_program)
    await db.commit()
    await db.refresh(db_program)
    return db_program


@router.get("/{school_id}/admins", response_model=List[SchoolAdminResponse])
async def get_school_admins(
    school_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get school page admins (school admins with permissions)."""
    # Caller must be an admin with permission to manage admins
    admin_check = await db.execute(
        select(SchoolAdmin).where(
            SchoolAdmin.school_id == school_id,
            SchoolAdmin.user_id == current_user.id,
        )
    )
    admin = admin_check.scalar_one_or_none()
    if not admin or not admin.can_manage_admins:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await db.execute(
        select(SchoolAdmin)
        .options(selectinload(SchoolAdmin.user))
        .where(SchoolAdmin.school_id == school_id)
        .order_by(SchoolAdmin.added_at.desc())
    )
    admins = result.scalars().all()

    return [
        SchoolAdminResponse(
            id=a.id,
            school_id=a.school_id,
            user_id=a.user_id,
            role=a.role,
            can_manage_students=a.can_manage_students,
            can_manage_programs=a.can_manage_programs,
            can_manage_placements=a.can_manage_placements,
            can_manage_admins=a.can_manage_admins,
            added_at=a.added_at,
            user_email=a.user.email if a.user else None,
            user_name=f"{a.user.first_name} {a.user.last_name}".strip() if a.user else None,
        )
        for a in admins
    ]


@router.post("/{school_id}/admins", response_model=SchoolAdminResponse)
async def add_school_admin(
    school_id: UUID,
    admin_data: SchoolAdminCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a school page admin. Accepts either user_id or email."""
    # Caller must be an admin with permission to manage admins
    admin_check = await db.execute(
        select(SchoolAdmin).where(
            SchoolAdmin.school_id == school_id,
            SchoolAdmin.user_id == current_user.id,
        )
    )
    admin = admin_check.scalar_one_or_none()
    if not admin or not admin.can_manage_admins:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Resolve user_id from email if provided
    target_user_id = admin_data.user_id
    if not target_user_id and admin_data.email:
        user_result = await db.execute(
            select(User).where(User.email == admin_data.email)
        )
        target_user = user_result.scalar_one_or_none()
        if not target_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with email '{admin_data.email}' not found. They must have a VerTechie account.",
            )
        target_user_id = target_user.id
    elif not target_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either 'user_id' or 'email' is required",
        )

    # Check if already an admin
    existing = await db.execute(
        select(SchoolAdmin).where(
            SchoolAdmin.school_id == school_id,
            SchoolAdmin.user_id == target_user_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User is already an admin")

    # Default permissions based on simple role
    role_permissions = {
        "owner": {
            "can_manage_students": True,
            "can_manage_programs": True,
            "can_manage_placements": True,
            "can_manage_admins": True,
        },
        "admin": {
            "can_manage_students": True,
            "can_manage_programs": True,
            "can_manage_placements": True,
            "can_manage_admins": False,
        },
        "placement_head": {
            "can_manage_students": False,
            "can_manage_programs": False,
            "can_manage_placements": True,
            "can_manage_admins": False,
        },
        "alumni_coordinator": {
            "can_manage_students": False,
            "can_manage_programs": False,
            "can_manage_placements": False,
            "can_manage_admins": False,
        },
    }
    permissions = role_permissions.get(admin_data.role, role_permissions["admin"])

    db_admin = SchoolAdmin(
        school_id=school_id,
        user_id=target_user_id,
        role=admin_data.role,
        can_manage_students=(
            admin_data.can_manage_students
            if admin_data.can_manage_students is not None
            else permissions["can_manage_students"]
        ),
        can_manage_programs=(
            admin_data.can_manage_programs
            if admin_data.can_manage_programs is not None
            else permissions["can_manage_programs"]
        ),
        can_manage_placements=(
            admin_data.can_manage_placements
            if admin_data.can_manage_placements is not None
            else permissions["can_manage_placements"]
        ),
        can_manage_admins=(
            admin_data.can_manage_admins
            if admin_data.can_manage_admins is not None
            else permissions["can_manage_admins"]
        ),
    )
    db.add(db_admin)
    await db.commit()
    await db.refresh(db_admin)
    await db.refresh(db_admin, ["user"])

    return SchoolAdminResponse(
        id=db_admin.id,
        school_id=db_admin.school_id,
        user_id=db_admin.user_id,
        role=db_admin.role,
        can_manage_students=db_admin.can_manage_students,
        can_manage_programs=db_admin.can_manage_programs,
        can_manage_placements=db_admin.can_manage_placements,
        can_manage_admins=db_admin.can_manage_admins,
        added_at=db_admin.added_at,
        user_email=db_admin.user.email if db_admin.user else None,
        user_name=(
            f"{db_admin.user.first_name} {db_admin.user.last_name}".strip()
            if db_admin.user
            else None
        ),
    )


@router.delete("/{school_id}/admins/{admin_id}")
async def remove_school_admin(
    school_id: UUID,
    admin_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove a school page admin (cannot remove yourself)."""
    admin_check = await db.execute(
        select(SchoolAdmin).where(
            SchoolAdmin.school_id == school_id,
            SchoolAdmin.user_id == current_user.id,
        )
    )
    admin = admin_check.scalar_one_or_none()
    if not admin or not admin.can_manage_admins:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await db.execute(
        select(SchoolAdmin).where(
            SchoolAdmin.id == admin_id,
            SchoolAdmin.school_id == school_id,
        )
    )
    target_admin = result.scalar_one_or_none()
    if not target_admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    if target_admin.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot remove yourself")

    await db.delete(target_admin)
    await db.commit()
    return {"status": "deleted"}


@router.put("/{school_id}/programs/{program_id}", response_model=ProgramResponse)
async def update_program(
    school_id: UUID,
    program_id: UUID,
    program_update: ProgramUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an existing program for this school."""
    # Verify admin access
    admin_check = await db.execute(
        select(SchoolAdmin).where(
            SchoolAdmin.school_id == school_id,
            SchoolAdmin.user_id == current_user.id,
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")

    # Load program
    program_result = await db.execute(
        select(Program).where(
            Program.id == program_id,
            Program.school_id == school_id,
        )
    )
    db_program = program_result.scalar_one_or_none()
    if not db_program:
        raise HTTPException(status_code=404, detail="Program not found")

    update_data = program_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_program, field, value)

    await db.commit()
    await db.refresh(db_program)
    return db_program


@router.delete(
    "/{school_id}/programs/{program_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_program(
    school_id: UUID,
    program_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a program from this school."""
    # Verify admin access
    admin_check = await db.execute(
        select(SchoolAdmin).where(
            SchoolAdmin.school_id == school_id,
            SchoolAdmin.user_id == current_user.id,
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")

    program_result = await db.execute(
        select(Program).where(
            Program.id == program_id,
            Program.school_id == school_id,
        )
    )
    db_program = program_result.scalar_one_or_none()
    if not db_program:
        raise HTTPException(status_code=404, detail="Program not found")

    await db.delete(db_program)
    await db.commit()
    return None


@router.put("/{school_id}/members/{member_id}/verify")
async def verify_member(
    school_id: UUID,
    member_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Verify a school member."""
    # Verify admin access
    admin_check = await db.execute(
        select(SchoolAdmin).where(
            SchoolAdmin.school_id == school_id,
            SchoolAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.execute(
        select(SchoolMember).where(
            SchoolMember.id == member_id,
            SchoolMember.school_id == school_id
        )
    )
    member = result.scalar_one_or_none()
    
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    member.is_verified = True
    await db.commit()
    
    return {"status": "verified"}


@router.get("/{school_id}/members")
async def list_school_members(
    school_id: UUID,
    verified: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List school members and pending invites. School admin only."""
    admin_check = await db.execute(
        select(SchoolAdmin).where(
            SchoolAdmin.school_id == school_id,
            SchoolAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")

    # Fetch Members
    member_query = (
        select(SchoolMember, User)
        .join(User, SchoolMember.user_id == User.id)
        .where(SchoolMember.school_id == school_id)
    )
    if verified is not None:
        member_query = member_query.where(SchoolMember.is_verified == verified)
    
    # We'll apply pagination after combining, or just paginating members if invites are few.
    # For now, let's fetch all relevant and slice in Python or separate queries.
    # Given typical use case, we fetch page of members + list of pending invites?
    # Or merge them. Let's merge them.
    
    member_result = await db.execute(member_query)
    members_rows = member_result.all()
    
    # Fetch Invites (only if looking for unverified or all)
    invites = []
    if verified is None or verified is False:
        invite_query = select(SchoolInvite).where(
            SchoolInvite.school_id == school_id,
            SchoolInvite.status == InviteStatus.PENDING
        )
        invite_result = await db.execute(invite_query)
        invites = invite_result.scalars().all()

    combined_list = []
    
    # Process Members
    for m, u in members_rows:
        combined_list.append({
            "id": str(m.id),
            "user_id": str(m.user_id),
            "name": f"{u.first_name or ''} {u.last_name or ''}".strip() or u.email,
            "email": u.email,
            "member_type": m.member_type,
            "graduation_year": m.graduation_year,
            "student_id": m.student_id,
            "is_verified": m.is_verified,
            "joined_at": m.joined_at.isoformat() if m.joined_at else None,
            "status": "active" if m.is_verified else "pending_verification"
        })
        
    # Process Invites
    for inv in invites:
        combined_list.append({
            "id": str(inv.id),
            "user_id": None,
            "name": inv.name or inv.email,
            "email": inv.email,
            "member_type": inv.member_type,
            "graduation_year": inv.graduation_year,
            "student_id": inv.student_id,
            "is_verified": False,
            "joined_at": inv.created_at.isoformat() if inv.created_at else None,
            "status": "invited"
        })
        
    # Apply pagination (simplified)
    start = skip
    end = skip + limit
    return combined_list[start:end]


class SchoolMemberInvite(BaseModel):
    """Invite a member/alumni by email."""
    email: str
    member_type: Optional[MemberType] = MemberType.ALUMNI
    graduation_year: Optional[int] = None
    student_id: Optional[str] = None
    name: Optional[str] = None # Added for invite


@router.post("/{school_id}/members/invite", response_model=SchoolMemberResponse)
async def invite_school_member(
    school_id: UUID,
    invite: SchoolMemberInvite,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Invite a school member/alumni. If user exists, adds member. If not, stores invite."""
    admin_check = await db.execute(
        select(SchoolAdmin).where(
            SchoolAdmin.school_id == school_id,
            SchoolAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")

    # Check if user with this email exists
    user_result = await db.execute(
        select(User).where(User.email == invite.email)
    )
    existing_user = user_result.scalar_one_or_none()

    if existing_user:
        # User exists - Check if member already exists
        existing_member = await db.execute(
            select(SchoolMember).where(
                SchoolMember.school_id == school_id,
                SchoolMember.user_id == existing_user.id
            )
        )
        if existing_member.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Member already exists for this school"
            )
            
        # Create SchoolMember
        member = SchoolMember(
            school_id=school_id,
            user_id=existing_user.id,
            member_type=invite.member_type or MemberType.ALUMNI,
            graduation_year=invite.graduation_year,
            student_id=invite.student_id,
            is_verified=False,  # Requires verification
        )
        db.add(member)
        await db.commit()
        await db.refresh(member)
        
        # Helper to match response model
        response_obj = member
        response_obj.email = existing_user.email
        response_obj.status = "pending_verification"
        
        return response_obj

    else:
        # User does NOT exist - Create SchoolInvite
        
        # Check existing invite
        existing_invite = await db.execute(
            select(SchoolInvite).where(
                SchoolInvite.school_id == school_id,
                SchoolInvite.email == invite.email,
                SchoolInvite.status == InviteStatus.PENDING
            )
        )
        if existing_invite.scalar_one_or_none():
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invite already pending for {invite.email}"
            )
            
        invite_obj = SchoolInvite(
            school_id=school_id,
            email=invite.email,
            name=invite.name,
            member_type=invite.member_type or MemberType.ALUMNI,
            graduation_year=invite.graduation_year,
            student_id=invite.student_id,
            status=InviteStatus.PENDING,
            invited_by_id=current_user.id,
            sent_at=datetime.utcnow()
        )
        db.add(invite_obj)
        await db.commit()
        await db.refresh(invite_obj)
        
        # TODO: Send email
        
        # Map to SchoolMemberResponse
        # user_id is None, is_verified is False
        return SchoolMemberResponse(
            id=invite_obj.id,
            school_id=invite_obj.school_id,
            user_id=None,
            email=invite_obj.email,
            member_type=invite_obj.member_type,
            graduation_year=invite_obj.graduation_year,
            student_id=invite_obj.student_id,
            is_verified=False,
            joined_at=invite_obj.created_at,
            status="invited"
        )


# ============= Get School by ID (must be AFTER all /{school_id}/... routes) =============

@router.get("/{school_id}", response_model=SchoolResponse)
async def get_school(
    school_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get school details."""
    result = await db.execute(
        select(School)
        .options(
            selectinload(School.departments),
            selectinload(School.programs)
        )
        .where(School.id == school_id)
    )
    school = result.scalar_one_or_none()
    
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    
    return school


@router.put("/{school_id}", response_model=SchoolResponse)
async def update_school(
    school_id: UUID,
    school_update: SchoolUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update basic school details (for school admins)."""
    # Ensure current user is an admin of this school
    admin_check = await db.execute(
        select(SchoolAdmin).where(
            SchoolAdmin.school_id == school_id,
            SchoolAdmin.user_id == current_user.id,
        )
    )
    admin = admin_check.scalar_one_or_none()
    if not admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await db.execute(
        select(School).where(School.id == school_id)
    )
    school = result.scalar_one_or_none()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")

    update_data = school_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(school, field, value)

    await db.commit()
    await db.refresh(school)
    return school


# ============= Super Admin Endpoints =============

admin_router = APIRouter(prefix="/admin/schools", tags=["Admin - Schools"])


@admin_router.get("/", response_model=List[SchoolResponse])
async def admin_list_schools(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    status: Optional[SchoolStatus] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: List all schools."""
    query = select(School)
    
    if status:
        query = query.where(School.status == status)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@admin_router.put("/{school_id}/verify")
async def admin_verify_school(
    school_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Verify a school."""
    result = await db.execute(
        select(School).where(School.id == school_id)
    )
    school = result.scalar_one_or_none()
    
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    
    school.is_verified = True
    school.status = SchoolStatus.ACTIVE
    await db.commit()
    
    return {"status": "verified"}


@admin_router.put("/{school_id}/suspend")
async def admin_suspend_school(
    school_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Suspend a school."""
    result = await db.execute(
        select(School).where(School.id == school_id)
    )
    school = result.scalar_one_or_none()
    
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    
    school.status = SchoolStatus.SUSPENDED
    await db.commit()
    
    return {"status": "suspended"}

