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
    SchoolMember, SchoolAdmin, Placement,
    SchoolType, SchoolStatus, ProgramType, MemberType
)
from app.models.user import User
from app.core.security import get_current_user, get_current_admin_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/schools", tags=["Schools"])


# ============= Pydantic Schemas =============

class SchoolBase(BaseModel):
    name: str
    slug: str
    short_name: Optional[str] = None
    school_type: SchoolType
    description: Optional[str] = None
    tagline: Optional[str] = None
    city: str
    state: Optional[str] = None
    country: str
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
    phone: Optional[str] = None

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

class SchoolMemberCreate(BaseModel):
    member_type: MemberType
    student_id: Optional[str] = None
    department_id: Optional[UUID] = None
    graduation_year: Optional[int] = None

class SchoolMemberResponse(SchoolMemberCreate):
    id: UUID
    school_id: UUID
    user_id: UUID
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

