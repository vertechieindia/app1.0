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
    CompanyPhoto, CompanyTeamMember, CompanyAdmin, CompanyStatus,
    CompanyInvite, InviteStatus
)
from app.models.user import User
from app.core.security import get_current_user, get_current_admin_user
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Any
import aiosmtplib
from email.message import EmailMessage
from email.utils import formataddr
from app.core.config import get_settings

router = APIRouter(tags=["Companies"])


# ============= Pydantic Schemas =============

class CompanyBase(BaseModel):
    # Core fields - made optional to support frontend variations
    name: Optional[str] = None
    slug: Optional[str] = None
    
    # Frontend field names (HR signup sends these)
    company_name: Optional[str] = None
    company_email: Optional[str] = None
    company_website: Optional[str] = None
    
    # Standard fields
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
    
    class Config:
        extra = "ignore"  # Ignore extra fields from frontend

class CompanyCreate(CompanyBase):
    """Company creation schema - accepts both backend and frontend field names."""
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
    """Create a new company (becomes admin).
    
    Accepts both backend and frontend field names:
    - name OR company_name
    - email OR company_email
    - website OR company_website
    """
    import re
    
    # Map frontend field names to backend field names
    actual_name = company.name or company.company_name
    if not actual_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company name is required (provide 'name' or 'company_name')"
        )
    
    # Auto-generate slug from name if not provided
    actual_slug = company.slug
    if not actual_slug:
        actual_slug = re.sub(r'[^a-z0-9]+', '-', actual_name.lower()).strip('-')
    
    # Map email and website from frontend fields if not provided
    actual_email = company.email or company.company_email
    actual_website = company.website or company.company_website
    
    # Check if slug is unique
    existing = await db.execute(
        select(Company).where(Company.slug == actual_slug)
    )
    if existing.scalar_one_or_none():
        # Append a random suffix to make it unique
        import uuid
        actual_slug = f"{actual_slug}-{uuid.uuid4().hex[:6]}"
    
    # Build company data with mapped fields
    company_data = company.model_dump(exclude={'company_name', 'company_email', 'company_website'})
    company_data['name'] = actual_name
    company_data['slug'] = actual_slug
    company_data['email'] = actual_email
    company_data['website'] = actual_website
    
    # Remove None values to avoid overwriting defaults
    company_data = {k: v for k, v in company_data.items() if v is not None}
    
    db_company = Company(**company_data)
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


# ============= Company Invite Endpoints =============

class CompanyInviteCreate(BaseModel):
    company_name: str
    address: Optional[str] = None
    website: Optional[str] = None
    contact_person_name: str
    contact_person_role: Optional[str] = None
    emails: List[str] = []
    phone_numbers: List[str] = []


class CompanyInviteResponse(BaseModel):
    id: UUID
    company_name: str
    address: Optional[str] = None
    website: Optional[str] = None
    contact_person_name: Optional[str] = None
    contact_person_role: Optional[str] = None
    emails: List[str] = []
    phone_numbers: List[str] = []
    status: InviteStatus
    created_at: datetime
    sent_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


async def send_company_invite_email(
    company_name: str,
    contact_name: str,
    email: str,
    invite_id: str
):
    """Send company invite email."""
    settings = get_settings()
    
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print(f"[EMAIL] SMTP not configured. Would send invite to: {email} for company: {company_name}")
        return False
    
    msg = EmailMessage()
    msg["Subject"] = f"Invitation to Join VerTechie - {company_name}"
    msg["From"] = formataddr((settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL))
    msg["To"] = email
    
    body = f"""
Dear {contact_name},

You have been invited to register your company "{company_name}" on VerTechie!

VerTechie is a trusted platform connecting verified tech professionals with companies.

To register your company, please visit:
https://vertechie.com/companies/register?invite={invite_id}

Benefits of joining VerTechie:
• Access to verified tech talent
• Advanced candidate screening
• Streamlined hiring process
• Employer branding opportunities

If you have any questions, please contact us at support@vertechie.com.

Best regards,
The VerTechie Team
    """
    
    msg.set_content(body)
    
    try:
        import ssl
        # Create SSL context for STARTTLS (for development, we skip verification)
        # In production, use proper certificates
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        
        # For Gmail on port 587, use STARTTLS (start_tls=True, use_tls=False)
        # For port 465, use SSL (use_tls=True, start_tls=False)
        use_ssl = settings.SMTP_PORT == 465
        
        async with aiosmtplib.SMTP(
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            use_tls=use_ssl,
            start_tls=not use_ssl and settings.SMTP_USE_TLS,
            tls_context=context,
        ) as smtp:
            await smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            await smtp.send_message(msg)
        print(f"[EMAIL] Company invite sent to {email} for {company_name}")
        return True
    except Exception as e:
        print(f"[EMAIL] Failed to send company invite to {email}: {e}")
        return False


async def get_optional_current_user(
    authorization: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """Get current user if token provided, otherwise return None."""
    from fastapi import Request
    from app.core.security import verify_token
    
    # This is called manually, we'll pass the token from the request
    return None


@router.post("/invites", response_model=CompanyInviteResponse)
async def create_company_invite(
    invite: CompanyInviteCreate,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Create a company invite request (no authentication required)."""
    
    # Try to get user from token if provided (optional)
    user_id = None
    
    # Create the invite record
    db_invite = CompanyInvite(
        company_name=invite.company_name,
        address=invite.address,
        website=invite.website,
        contact_person_name=invite.contact_person_name,
        contact_person_role=invite.contact_person_role,
        emails=invite.emails,
        phone_numbers=invite.phone_numbers,
        requested_by_id=user_id,
        status=InviteStatus.PENDING
    )
    
    db.add(db_invite)
    await db.commit()
    await db.refresh(db_invite)
    
    # Try to send emails to all provided email addresses
    emails_sent = 0
    for email in invite.emails:
        if email and email.strip():
            success = await send_company_invite_email(
                company_name=invite.company_name,
                contact_name=invite.contact_person_name or "Hiring Manager",
                email=email.strip(),
                invite_id=str(db_invite.id)
            )
            if success:
                emails_sent += 1
    
    # Update status if emails were sent
    if emails_sent > 0:
        db_invite.status = InviteStatus.SENT
        db_invite.sent_at = datetime.utcnow()
        await db.commit()
        await db.refresh(db_invite)
    
    return db_invite


@router.get("/invites", response_model=List[CompanyInviteResponse])
async def list_company_invites(
    status: Optional[InviteStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """List all company invites (admin only)."""
    query = select(CompanyInvite)
    
    if status:
        query = query.where(CompanyInvite.status == status)
    
    query = query.order_by(CompanyInvite.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/invites/stats/")
async def get_invite_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get invite statistics (admin only)."""
    # Count by status
    pending_count = await db.execute(
        select(func.count(CompanyInvite.id)).where(CompanyInvite.status == InviteStatus.PENDING)
    )
    sent_count = await db.execute(
        select(func.count(CompanyInvite.id)).where(CompanyInvite.status == InviteStatus.SENT)
    )
    accepted_count = await db.execute(
        select(func.count(CompanyInvite.id)).where(CompanyInvite.status == InviteStatus.ACCEPTED)
    )
    declined_count = await db.execute(
        select(func.count(CompanyInvite.id)).where(CompanyInvite.status == InviteStatus.DECLINED)
    )
    
    return {
        "pending": pending_count.scalar() or 0,
        "sent": sent_count.scalar() or 0,
        "accepted": accepted_count.scalar() or 0,
        "declined": declined_count.scalar() or 0,
        "total": (pending_count.scalar() or 0) + (sent_count.scalar() or 0) + 
                 (accepted_count.scalar() or 0) + (declined_count.scalar() or 0)
    }


@router.get("/invites/{invite_id}", response_model=CompanyInviteResponse)
async def get_company_invite(
    invite_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific company invite."""
    result = await db.execute(
        select(CompanyInvite).where(CompanyInvite.id == invite_id)
    )
    invite = result.scalar_one_or_none()
    
    if not invite:
        raise HTTPException(status_code=404, detail="Invite not found")
    
    return invite


@router.put("/invites/{invite_id}/update_status/")
async def update_invite_status(
    invite_id: UUID,
    new_status: InviteStatus,
    notes: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update invite status (admin only)."""
    result = await db.execute(
        select(CompanyInvite).where(CompanyInvite.id == invite_id)
    )
    invite = result.scalar_one_or_none()
    
    if not invite:
        raise HTTPException(status_code=404, detail="Invite not found")
    
    invite.status = new_status
    if notes:
        invite.admin_notes = notes
    
    await db.commit()
    await db.refresh(invite)
    
    return {"status": "updated", "new_status": new_status.value}


@router.post("/invites/{invite_id}/send_invite/")
async def resend_invite(
    invite_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Resend invite emails (admin only)."""
    result = await db.execute(
        select(CompanyInvite).where(CompanyInvite.id == invite_id)
    )
    invite = result.scalar_one_or_none()
    
    if not invite:
        raise HTTPException(status_code=404, detail="Invite not found")
    
    # Send emails
    emails_sent = 0
    for email in invite.emails:
        if email and email.strip():
            success = await send_company_invite_email(
                company_name=invite.company_name,
                contact_name=invite.contact_person_name or "Hiring Manager",
                email=email.strip(),
                invite_id=str(invite.id)
            )
            if success:
                emails_sent += 1
    
    if emails_sent > 0:
        invite.status = InviteStatus.SENT
        invite.sent_at = datetime.utcnow()
        await db.commit()
    
    return {
        "status": "sent" if emails_sent > 0 else "failed",
        "emails_sent": emails_sent,
        "total_emails": len([e for e in invite.emails if e and e.strip()])
    }


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

