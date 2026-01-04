"""
Company API Routes
User and Admin endpoints for company management
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.company import (
    Company, CompanyProfile, CompanyLocation, CompanyBenefit, 
    CompanyPhoto, CompanyTeamMember, CompanyAdmin, CompanyStatus
)
from app.models.user import User
from app.core.security import get_current_user, get_current_admin_user
from pydantic import BaseModel, Field
from datetime import datetime

router = APIRouter(prefix="/companies", tags=["Companies"])


# ============= Pydantic Schemas =============

class CompanyBase(BaseModel):
    name: str
    slug: str
    legal_name: Optional[str] = None
    company_type: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    tagline: Optional[str] = None
    headquarters: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    founded_year: Optional[int] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    tagline: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    industry: Optional[str] = None
    employees_count: Optional[int] = None

class CompanyResponse(CompanyBase):
    id: UUID
    logo_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    employees_count: int = 0
    status: CompanyStatus
    is_verified: bool
    is_featured: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class CompanyLocationCreate(BaseModel):
    name: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: Optional[str] = None
    country: str
    postal_code: Optional[str] = None
    is_headquarters: bool = False

class CompanyLocationResponse(CompanyLocationCreate):
    id: UUID
    company_id: UUID
    
    class Config:
        from_attributes = True

class CompanyBenefitCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    icon: Optional[str] = None
    is_featured: bool = False

class CompanyBenefitResponse(CompanyBenefitCreate):
    id: UUID
    company_id: UUID
    
    class Config:
        from_attributes = True


# ============= User Endpoints =============

@router.get("/", response_model=List[CompanyResponse])
async def list_companies(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    industry: Optional[str] = None,
    city: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List all companies with filters."""
    query = select(Company).where(Company.status == CompanyStatus.ACTIVE)
    
    if industry:
        query = query.where(Company.industry == industry)
    if city:
        query = query.where(Company.city.ilike(f"%{city}%"))
    if search:
        query = query.where(
            Company.name.ilike(f"%{search}%") | 
            Company.description.ilike(f"%{search}%")
        )
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get company details."""
    result = await db.execute(
        select(Company)
        .options(
            selectinload(Company.locations),
            selectinload(Company.benefits),
            selectinload(Company.photos),
            selectinload(Company.team_members)
        )
        .where(Company.id == company_id)
    )
    company = result.scalar_one_or_none()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    return company


@router.get("/slug/{slug}", response_model=CompanyResponse)
async def get_company_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    """Get company by slug."""
    result = await db.execute(
        select(Company).where(Company.slug == slug)
    )
    company = result.scalar_one_or_none()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    return company


@router.get("/{company_id}/locations", response_model=List[CompanyLocationResponse])
async def get_company_locations(
    company_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get company locations."""
    result = await db.execute(
        select(CompanyLocation).where(CompanyLocation.company_id == company_id)
    )
    return result.scalars().all()


@router.get("/{company_id}/benefits", response_model=List[CompanyBenefitResponse])
async def get_company_benefits(
    company_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get company benefits."""
    result = await db.execute(
        select(CompanyBenefit).where(CompanyBenefit.company_id == company_id)
    )
    return result.scalars().all()


# ============= Company Admin Endpoints =============

@router.post("/", response_model=CompanyResponse)
async def create_company(
    company: CompanyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new company (becomes admin)."""
    # Check if slug is unique
    existing = await db.execute(
        select(Company).where(Company.slug == company.slug)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    db_company = Company(**company.model_dump())
    db.add(db_company)
    await db.commit()
    await db.refresh(db_company)
    
    # Add creator as admin
    admin = CompanyAdmin(
        company_id=db_company.id,
        user_id=current_user.id,
        role="owner",
        can_manage_jobs=True,
        can_manage_candidates=True,
        can_manage_team=True,
        can_manage_billing=True,
        can_manage_admins=True
    )
    db.add(admin)
    await db.commit()
    
    return db_company


@router.put("/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: UUID,
    company_update: CompanyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update company (admin only)."""
    # Verify admin access
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.execute(
        select(Company).where(Company.id == company_id)
    )
    company = result.scalar_one_or_none()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    update_data = company_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(company, key, value)
    
    await db.commit()
    await db.refresh(company)
    return company


@router.post("/{company_id}/locations", response_model=CompanyLocationResponse)
async def add_company_location(
    company_id: UUID,
    location: CompanyLocationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a company location."""
    # Verify admin access
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_location = CompanyLocation(company_id=company_id, **location.model_dump())
    db.add(db_location)
    await db.commit()
    await db.refresh(db_location)
    return db_location


@router.post("/{company_id}/benefits", response_model=CompanyBenefitResponse)
async def add_company_benefit(
    company_id: UUID,
    benefit: CompanyBenefitCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a company benefit."""
    # Verify admin access
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_benefit = CompanyBenefit(company_id=company_id, **benefit.model_dump())
    db.add(db_benefit)
    await db.commit()
    await db.refresh(db_benefit)
    return db_benefit


@router.delete("/{company_id}/locations/{location_id}")
async def delete_company_location(
    company_id: UUID,
    location_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a company location."""
    # Verify admin access
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.execute(
        select(CompanyLocation).where(
            CompanyLocation.id == location_id,
            CompanyLocation.company_id == company_id
        )
    )
    location = result.scalar_one_or_none()
    
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    await db.delete(location)
    await db.commit()
    return {"status": "deleted"}


# ============= Super Admin Endpoints =============

admin_router = APIRouter(prefix="/admin/companies", tags=["Admin - Companies"])


@admin_router.get("/", response_model=List[CompanyResponse])
async def admin_list_companies(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    status: Optional[CompanyStatus] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: List all companies."""
    query = select(Company)
    
    if status:
        query = query.where(Company.status == status)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@admin_router.put("/{company_id}/verify")
async def admin_verify_company(
    company_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Verify a company."""
    result = await db.execute(
        select(Company).where(Company.id == company_id)
    )
    company = result.scalar_one_or_none()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    company.is_verified = True
    company.status = CompanyStatus.ACTIVE
    await db.commit()
    
    return {"status": "verified"}


@admin_router.put("/{company_id}/suspend")
async def admin_suspend_company(
    company_id: UUID,
    reason: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Suspend a company."""
    result = await db.execute(
        select(Company).where(Company.id == company_id)
    )
    company = result.scalar_one_or_none()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    company.status = CompanyStatus.SUSPENDED
    await db.commit()
    
    return {"status": "suspended"}


@admin_router.delete("/{company_id}")
async def admin_delete_company(
    company_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Delete a company."""
    result = await db.execute(
        select(Company).where(Company.id == company_id)
    )
    company = result.scalar_one_or_none()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    await db.delete(company)
    await db.commit()
    
    return {"status": "deleted"}

