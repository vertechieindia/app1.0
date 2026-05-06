"""
Company API Routes
User and Admin endpoints for company management
"""

import logging
from typing import Any, Dict, List, Literal, Optional
from uuid import UUID
import uuid as uuid_lib

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.company import (
    Company, CompanyProfile, CompanyLocation, CompanyBenefit,
    CompanyPhoto, CompanyTeamMember, CompanyAdmin, CompanyStatus,
    CompanyInvite, InviteStatus, CompanySize, CompanyInviteFlow,
)
from app.models.user import User, UserProfile, Experience
from app.models.notification import Notification, NotificationType
from app.services.company_matching import (
    link_experiences_to_company_by_normalized_name,
    normalize_company_name,
)
from app.core.security import get_current_user, get_current_admin_user, get_optional_user
from pydantic import BaseModel, Field, EmailStr, field_validator, ValidationInfo
from datetime import datetime
import aiosmtplib
from email.message import EmailMessage
from email.utils import formataddr
import re
from app.core.config import get_settings
from app.utils.gstin import is_valid_gstin
from app.utils.ein import is_valid_ein_nine_digits

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Companies"])

def _coerce_tax_country(country: Any) -> Optional[Literal["IN", "US"]]:
    if country is None:
        return None
    if not isinstance(country, str):
        return None
    u = country.strip().upper()
    if u in ("IN", "IND", "INDIA"):
        return "IN"
    if u in ("US", "USA") or u.startswith("UNITED STATES"):
        return "US"
    return None


def _normalize_ein_digits(digits: str) -> str:
    if not is_valid_ein_nine_digits(digits):
        raise ValueError(
            "Invalid US EIN: use 9 digits with a valid IRS-assigned prefix (see IRS valid EIN prefixes), e.g. 12-3456789."
        )
    return f"{digits[:2]}-{digits[2:]}"


def _normalize_company_tax_id_value(v: Any, country: Any = None) -> Optional[str]:
    """Normalize `gst_number`: strict GSTIN and/or EIN. `country` IN/US restricts which form is accepted."""
    if v is None:
        return None
    if not isinstance(v, str):
        v = str(v)
    t = v.strip()
    if not t:
        return None
    hint = _coerce_tax_country(country)
    compact = re.sub(r"\s+", "", t).upper()
    digits = re.sub(r"\D", "", t)

    if hint == "IN":
        if is_valid_gstin(compact):
            return compact
        if len(digits) == 9 and digits.isdigit():
            raise ValueError(
                "For India, enter a valid 15-character GSTIN (US EIN is not accepted when country is India)."
            )
        raise ValueError("Invalid Indian GSTIN (state + PAN + Z + check digit).")

    if hint == "US":
        if len(digits) == 9 and digits.isdigit():
            return _normalize_ein_digits(digits)
        if len(compact) == 15:
            raise ValueError(
                "For the United States, enter a valid 9-digit EIN (GSTIN is not accepted when country is United States)."
            )
        raise ValueError("Invalid US EIN: 9 digits required (e.g. 12-3456789).")

    if is_valid_gstin(compact):
        return compact
    if len(digits) == 9 and digits.isdigit():
        return _normalize_ein_digits(digits)
    raise ValueError(
        "Invalid tax identifier: use a valid Indian GSTIN or a valid US EIN (e.g. 12-3456789)."
    )


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
    gst_number: Optional[str] = None
    domain: Optional[str] = None

    class Config:
        extra = "ignore"  # Ignore extra fields from frontend

class CompanyCreate(CompanyBase):
    """Company creation schema - accepts both backend and frontend field names."""

    @field_validator("gst_number", mode="before")
    @classmethod
    def _validate_create_gst_number(cls, v: Any, info: ValidationInfo) -> Optional[str]:
        if v is None:
            return None
        if isinstance(v, str) and not v.strip():
            return None
        country = info.data.get("country") if info.data else None
        return _normalize_company_tax_id_value(v, country)

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    legal_name: Optional[str] = None
    description: Optional[str] = None
    tagline: Optional[str] = None
    website: Optional[str] = None
    domain: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    headquarters: Optional[str] = None
    address: Optional[str] = None
    industry: Optional[str] = None
    country: Optional[str] = None
    gst_number: Optional[str] = None
    employees_count: Optional[int] = None
    # Branding fields so logo and banner can be updated from CMS
    logo_url: Optional[str] = None
    cover_image_url: Optional[str] = None

    @field_validator("gst_number", mode="before")
    @classmethod
    def _validate_update_gst_number(cls, v: Any, info: ValidationInfo) -> Optional[str]:
        if v is None:
            return None
        if isinstance(v, str) and not v.strip():
            return None
        country = info.data.get("country") if info.data else None
        return _normalize_company_tax_id_value(v, country)

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


class AffiliatedUserRow(BaseModel):
    """User linked to a company via admin role, profile.company_id, or experience.company_id."""

    user_id: UUID
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    association_sources: List[str] = Field(
        default_factory=list,
        description="company_admin | profile | experience",
    )

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


# ============= Company Invite Endpoints =============

class BranchAddressIn(BaseModel):
    label: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None


class FounderDetailIn(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


class CompanyInviteCreate(BaseModel):
    company_name: str
    address: Optional[str] = None
    headquarters_address: Optional[str] = None
    branch_addresses: List[BranchAddressIn] = Field(default_factory=list)
    website: Optional[str] = None
    domain: Optional[str] = None
    legal_name: Optional[str] = None
    tax_country: Optional[Literal["IN", "US"]] = None
    gst_number: Optional[str] = None
    industry: Optional[str] = None
    logo_url: Optional[str] = None
    banner_image_url: Optional[str] = None
    about: Optional[str] = None
    tagline: Optional[str] = None
    founder_details: List[FounderDetailIn] = Field(default_factory=list)
    contact_person_name: Optional[str] = None
    contact_person_role: Optional[str] = None
    emails: List[str] = Field(default_factory=list)
    phone_numbers: List[str] = Field(default_factory=list)
    # outreach = signup/profile invite to external companies; registration = Business form → BDM company profile queue
    invite_flow: Literal["outreach", "registration"] = "outreach"
    # Legacy: send outreach emails and may set status to SENT. Registration flow uses False to await admin approval.
    send_notification_emails: bool = True

    @field_validator("branch_addresses", "founder_details", "emails", "phone_numbers", mode="before")
    @classmethod
    def _none_to_empty_list_create(cls, v: Any) -> Any:
        return [] if v is None else v

    @field_validator("gst_number", mode="before")
    @classmethod
    def _validate_invite_gst_number(cls, v: Any, info: ValidationInfo) -> Optional[str]:
        if v is None:
            return None
        if isinstance(v, str) and not v.strip():
            return None
        tax_c = info.data.get("tax_country") if info.data else None
        return _normalize_company_tax_id_value(v, tax_c)


class CompanyInviteResponse(BaseModel):
    id: UUID
    company_name: str
    legal_name: Optional[str] = None
    address: Optional[str] = None
    headquarters_address: Optional[str] = None
    branch_addresses: List[Any] = Field(default_factory=list)
    website: Optional[str] = None
    domain: Optional[str] = None
    gst_number: Optional[str] = None
    industry: Optional[str] = None
    logo_url: Optional[str] = None
    banner_image_url: Optional[str] = None
    about: Optional[str] = None
    tagline: Optional[str] = None
    founder_details: List[Any] = Field(default_factory=list)
    contact_person_name: Optional[str] = None
    contact_person_role: Optional[str] = None
    emails: List[str] = Field(default_factory=list)
    phone_numbers: List[str] = Field(default_factory=list)
    status: InviteStatus
    requested_by_id: Optional[UUID] = None
    provisioned_company_id: Optional[UUID] = None
    admin_notes: Optional[str] = None
    created_at: datetime
    sent_at: Optional[datetime] = None
    invite_flow: str = "outreach"
    # Enriched when requested_by is loaded (BDM queue / detail)
    requested_by_name: Optional[str] = None
    requested_by_email: Optional[str] = None
    requested_by_primary_role: Optional[str] = None

    @field_validator("branch_addresses", "founder_details", "emails", "phone_numbers", mode="before")
    @classmethod
    def _none_to_empty_list_response(cls, v: Any) -> Any:
        """DB JSON columns can be NULL; API always exposes lists."""
        return [] if v is None else v

    @field_validator("invite_flow", mode="before")
    @classmethod
    def _default_invite_flow_response(cls, v: Any) -> Any:
        return v if v is not None and v != "" else CompanyInviteFlow.OUTREACH.value

    class Config:
        from_attributes = True


def _primary_role_value(user: Optional[User]) -> Optional[str]:
    """First assigned role for display (matches /users/me primary_role pattern)."""
    if not user:
        return None
    roles = getattr(user, "roles", None) or []
    if roles:
        try:
            return roles[0].role_type.value
        except Exception:
            return None
    return "techie"


def _invite_to_response(invite: CompanyInvite) -> CompanyInviteResponse:
    base = CompanyInviteResponse.model_validate(invite)
    u = getattr(invite, "requested_by", None)
    if not u:
        return base
    name = ""
    try:
        name = (u.full_name or "").strip()
    except Exception:
        name = ""
    if not name:
        name = f"{u.first_name or ''} {u.last_name or ''}".strip()
    role = _primary_role_value(u)
    return base.model_copy(
        update={
            "requested_by_name": name or None,
            "requested_by_email": u.email,
            "requested_by_primary_role": role,
        }
    )


class CompanyInviteStatusBody(BaseModel):
    new_status: Optional[InviteStatus] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    bdm_notes: Optional[str] = None


def _normalize_invite_phones(phone_numbers: Optional[List[str]]) -> List[str]:
    out: List[str] = []
    for raw_phone in phone_numbers or []:
        cleaned_phone = (raw_phone or "").strip()
        if not cleaned_phone:
            continue
        phone_digits = re.sub(r"\D", "", cleaned_phone)
        if len(phone_digits) < 7 or len(phone_digits) > 15:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Each phone number must contain between 7 and 15 digits",
            )
        out.append(phone_digits)
    return out


async def provision_company_from_invite(db: AsyncSession, invite: CompanyInvite) -> Company:
    """Create Company, profile, locations, and owner admin from an approved invite. Caller commits."""
    if invite.provisioned_company_id:
        result = await db.execute(select(Company).where(Company.id == invite.provisioned_company_id))
        existing = result.scalar_one_or_none()
        if existing:
            return existing

    base_name = (invite.company_name or "").strip() or "Company"
    legal = (invite.legal_name or base_name).strip()
    slug = re.sub(r"[^a-z0-9]+", "-", base_name.lower()).strip("-") or "company"
    existing_slug = await db.execute(select(Company).where(Company.slug == slug))
    if existing_slug.scalar_one_or_none():
        slug = f"{slug}-{uuid_lib.uuid4().hex[:8]}"

    hq_text = (invite.headquarters_address or invite.address or "").strip()
    primary_email = None
    if invite.emails:
        primary_email = next((e.strip() for e in invite.emails if e and str(e).strip()), None)
    primary_phone = None
    if invite.phone_numbers:
        primary_phone = str(invite.phone_numbers[0])

    db_company = Company(
        name=base_name,
        legal_name=legal,
        slug=slug,
        industry=invite.industry,
        description=invite.about,
        tagline=invite.tagline,
        headquarters=(hq_text[:200] if hq_text else None),
        address=hq_text or None,
        website=invite.website,
        domain=invite.domain,
        gst_number=invite.gst_number,
        email=primary_email,
        phone=primary_phone,
        logo_url=invite.logo_url,
        cover_image_url=invite.banner_image_url,
        status=CompanyStatus.ACTIVE,
        is_verified=True,  # BDM approved this registration before provisioning
        company_size=CompanySize.STARTUP,
    )
    db.add(db_company)
    await db.flush()

    founders_payload = invite.founder_details if invite.founder_details else []
    custom_sections: List[Dict[str, Any]] = []
    if founders_payload:
        custom_sections.append({"type": "founders", "items": founders_payload})

    profile = CompanyProfile(
        company_id=db_company.id,
        about=invite.about,
        tagline=invite.tagline,
        banner_image=invite.banner_image_url,
        custom_sections=custom_sections,
    )
    db.add(profile)

    if hq_text:
        db.add(
            CompanyLocation(
                company_id=db_company.id,
                name="Headquarters",
                address_line1=hq_text[:200],
                city="-",
                country="-",
                is_headquarters=True,
            )
        )

    branches = invite.branch_addresses or []
    if isinstance(branches, list):
        for i, br in enumerate(branches):
            if not isinstance(br, dict):
                continue
            line1 = (br.get("address_line1") or br.get("address") or "").strip() or "—"
            db.add(
                CompanyLocation(
                    company_id=db_company.id,
                    name=(br.get("label") or f"Branch {i + 1}")[:100],
                    address_line1=line1[:200],
                    address_line2=br.get("address_line2"),
                    city=(br.get("city") or "-")[:100],
                    state=br.get("state"),
                    country=(br.get("country") or "-")[:100],
                    postal_code=br.get("postal_code"),
                    is_headquarters=False,
                )
            )

    if invite.requested_by_id:
        db.add(
            CompanyAdmin(
                company_id=db_company.id,
                user_id=invite.requested_by_id,
                role="owner",
                can_manage_jobs=True,
                can_manage_candidates=True,
                can_manage_team=True,
                can_manage_billing=True,
                can_manage_admins=True,
            )
        )
        prof_row = await db.execute(
            select(UserProfile).where(UserProfile.user_id == invite.requested_by_id)
        )
        prof = prof_row.scalar_one_or_none()
        if prof is not None:
            prof.company_id = db_company.id

    invite.provisioned_company_id = db_company.id
    invite.status = InviteStatus.ACCEPTED
    await db.flush()
    # Match prior signup work-experience rows that only had company_name text
    linked = await link_experiences_to_company_by_normalized_name(
        db, db_company.id, base_name
    )
    if linked:
        logger.info(
            "Linked %s experience rows to company %s by normalized name",
            linked,
            db_company.id,
        )
    await db.flush()
    await db.refresh(db_company)
    return db_company


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


async def send_company_registration_decision_email(
    to_email: str,
    recipient_name: str,
    company_name: str,
    accepted: bool,
    notes: Optional[str] = None,
    primary_role: Optional[str] = None,
) -> bool:
    """Notify submitter that BDM approved or declined company profile registration."""
    settings = get_settings()
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning("[EMAIL] SMTP not configured; skipping registration decision email to %s", to_email)
        return False

    safe_name = recipient_name.strip() or "there"
    if accepted:
        subject = f"Your company page is live — {company_name}"
        role_hint = ""
        pr = (primary_role or "").strip().lower()
        if pr == "techie":
            role_hint = """
Your Tech Professional account now has company access: open CMS to manage your company page and ATS to post jobs and track candidates (use the bottom navigation after you sign in or refresh).
"""
        elif pr == "hiring_manager":
            role_hint = """
Open CMS from the app to manage your company page and employer branding.
"""
        elif pr == "company_admin":
            role_hint = """
You can manage your company page under CMS in the app.
"""
        body = f"""Dear {safe_name},

Good news: your company registration for "{company_name}" has been approved on VerTechie.{role_hint}
Sign in at https://vertechie.com/login to continue.

If you did not request this, please contact support@vertechie.com.

Best regards,
The VerTechie Team
"""
    else:
        subject = f"Update on your company registration — {company_name}"
        note_line = ""
        if notes and str(notes).strip():
            note_line = f"\nNote from our team:\n{notes.strip()}\n"
        body = f"""Dear {safe_name},

Thank you for your interest in VerTechie.

Your company registration request for "{company_name}" was not approved at this time.{note_line}
If you have questions, reply to this email or contact support@vertechie.com.

Best regards,
The VerTechie Team
"""

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = formataddr((settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL))
    msg["To"] = to_email
    msg.set_content(body)

    try:
        import ssl

        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
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
        logger.info("[EMAIL] Registration decision (%s) sent to %s", "accepted" if accepted else "declined", to_email)
        return True
    except Exception as e:
        logger.warning("[EMAIL] Failed to send registration decision to %s: %s", to_email, e)
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
    current_user: Optional[User] = Depends(get_optional_user),
) -> Any:
    """Create a company invite / registration request (optional auth for owner linkage)."""
    user_id = current_user.id if current_user else None
    normalized_phone_numbers = _normalize_invite_phones(invite.phone_numbers)
    branch_json = [b.model_dump(exclude_none=True) for b in (invite.branch_addresses or [])]
    founder_json = [f.model_dump(exclude_none=True) for f in (invite.founder_details or [])]

    flow_str = invite.invite_flow
    if flow_str not in ("outreach", "registration"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="invite_flow must be 'outreach' or 'registration'",
        )
    if flow_str == "registration":
        gn = invite.gst_number
        if gn is None or not str(gn).strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Tax identifier (Indian GSTIN or US EIN) is required for company registration.",
            )

    db_invite = CompanyInvite(
        company_name=invite.company_name,
        legal_name=invite.legal_name,
        address=invite.address,
        headquarters_address=invite.headquarters_address,
        branch_addresses=branch_json,
        website=invite.website,
        domain=invite.domain,
        gst_number=invite.gst_number,
        industry=invite.industry,
        logo_url=invite.logo_url,
        banner_image_url=invite.banner_image_url,
        about=invite.about,
        tagline=invite.tagline,
        founder_details=founder_json,
        contact_person_name=invite.contact_person_name,
        contact_person_role=invite.contact_person_role,
        emails=list(invite.emails or []),
        phone_numbers=normalized_phone_numbers,
        requested_by_id=user_id,
        status=InviteStatus.PENDING,
        invite_flow=flow_str,
    )

    db.add(db_invite)
    await db.commit()
    await db.refresh(db_invite)

    if not invite.send_notification_emails:
        loaded = await db.execute(
            select(CompanyInvite)
            .options(selectinload(CompanyInvite.requested_by).selectinload(User.roles))
            .where(CompanyInvite.id == db_invite.id)
        )
        return _invite_to_response(loaded.scalar_one())

    emails_sent = 0
    contact_name = invite.contact_person_name or "Contact"
    for email in invite.emails or []:
        if email and email.strip():
            success = await send_company_invite_email(
                company_name=invite.company_name,
                contact_name=contact_name,
                email=email.strip(),
                invite_id=str(db_invite.id),
            )
            if success:
                emails_sent += 1

    if emails_sent > 0:
        db_invite.status = InviteStatus.SENT
        db_invite.sent_at = datetime.utcnow()
        await db.commit()
        await db.refresh(db_invite)

    loaded = await db.execute(
        select(CompanyInvite)
        .options(selectinload(CompanyInvite.requested_by).selectinload(User.roles))
        .where(CompanyInvite.id == db_invite.id)
    )
    return _invite_to_response(loaded.scalar_one())


@router.get("/invites/mine", response_model=List[CompanyInviteResponse])
async def list_my_company_invites(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List company invite requests created by the current user (for profile review / dashboard)."""
    query = (
        select(CompanyInvite)
        .options(selectinload(CompanyInvite.requested_by).selectinload(User.roles))
        .where(CompanyInvite.requested_by_id == current_user.id)
        .order_by(CompanyInvite.created_at.desc())
    )
    result = await db.execute(query)
    rows = result.scalars().all()
    return [_invite_to_response(inv) for inv in rows]


@router.get("/invites", response_model=List[CompanyInviteResponse])
@router.get("/invites/", response_model=List[CompanyInviteResponse])
async def list_company_invites(
    status: Optional[InviteStatus] = None,
    invite_flow: Optional[Literal["outreach", "registration"]] = Query(
        None,
        description="Filter: outreach (signup/email) vs registration (BDM company profile requests). Omit for all.",
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """List all company invites (admin only). Both /invites and /invites/ avoid 307 redirects that drop Authorization."""
    query = select(CompanyInvite).options(
        selectinload(CompanyInvite.requested_by).selectinload(User.roles)
    )

    if status:
        query = query.where(CompanyInvite.status == status)
    if invite_flow in ("outreach", "registration"):
        query = query.where(CompanyInvite.invite_flow == invite_flow)

    query = query.order_by(CompanyInvite.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    rows = result.scalars().all()
    return [_invite_to_response(inv) for inv in rows]


@router.get("/invites/stats/")
async def get_invite_stats(
    invite_flow: Optional[Literal["outreach", "registration"]] = Query(
        None,
        description="Restrict counts to this flow (BDM dashboard uses registration).",
    ),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get invite statistics (admin only)."""
    flow_filter = []
    if invite_flow in ("outreach", "registration"):
        flow_filter.append(CompanyInvite.invite_flow == invite_flow)

    def _count(where_status: InviteStatus):
        cond = [CompanyInvite.status == where_status] + flow_filter
        return select(func.count(CompanyInvite.id)).where(*cond)

    pending_count = await db.execute(_count(InviteStatus.PENDING))
    sent_count = await db.execute(_count(InviteStatus.SENT))
    accepted_count = await db.execute(_count(InviteStatus.ACCEPTED))
    declined_count = await db.execute(_count(InviteStatus.DECLINED))

    p, s, a, d = (
        pending_count.scalar() or 0,
        sent_count.scalar() or 0,
        accepted_count.scalar() or 0,
        declined_count.scalar() or 0,
    )
    return {
        "pending": p,
        "sent": s,
        "accepted": a,
        "declined": d,
        "total": p + s + a + d,
    }


@router.get("/invites/{invite_id}", response_model=CompanyInviteResponse)
async def get_company_invite(
    invite_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific company invite."""
    result = await db.execute(
        select(CompanyInvite)
        .options(selectinload(CompanyInvite.requested_by).selectinload(User.roles))
        .where(CompanyInvite.id == invite_id)
    )
    invite = result.scalar_one_or_none()

    if not invite:
        raise HTTPException(status_code=404, detail="Invite not found")

    return _invite_to_response(invite)


async def _apply_invite_status_change(
    db: AsyncSession,
    invite: CompanyInvite,
    new_status: InviteStatus,
    notes: Optional[str],
) -> dict:
    """Set invite status; on ACCEPTED + registration flow, provision company when not already done."""
    old_status = invite.status

    if notes:
        invite.admin_notes = notes

    flow = getattr(invite, "invite_flow", None) or "outreach"
    is_registration = flow == CompanyInviteFlow.REGISTRATION.value

    if new_status == InviteStatus.ACCEPTED:
        if is_registration:
            if not invite.provisioned_company_id:
                await provision_company_from_invite(db, invite)
            else:
                invite.status = InviteStatus.ACCEPTED
        else:
            # Outreach: acknowledge only — do not create a Company row
            invite.status = InviteStatus.ACCEPTED
    elif new_status == InviteStatus.DECLINED:
        invite.status = InviteStatus.DECLINED
    else:
        invite.status = new_status

    # In-app notification when registration is newly approved (CMS / ATS access)
    if (
        is_registration
        and invite.status == InviteStatus.ACCEPTED
        and old_status != InviteStatus.ACCEPTED
        and invite.requested_by_id
        and invite.provisioned_company_id
    ):
        cn = (invite.company_name or "Your company").strip()
        db.add(
            Notification(
                user_id=invite.requested_by_id,
                title="Company page approved",
                message=f'"{cn}" is live. Open CMS for your company page; use ATS to post jobs and manage candidates.',
                notification_type=NotificationType.SYSTEM,
                link="/techie/cms",
                reference_id=invite.provisioned_company_id,
                reference_type="company",
            )
        )

    await db.commit()
    await db.refresh(invite)

    # Email submitter once when BDM approves or declines (registration queue only)
    if (
        is_registration
        and old_status != invite.status
        and invite.status in (InviteStatus.ACCEPTED, InviteStatus.DECLINED)
    ):
        to_email = None
        recipient_name = ""
        primary_role: Optional[str] = None
        if invite.requested_by_id:
            ures = await db.execute(
                select(User).options(selectinload(User.roles)).where(User.id == invite.requested_by_id)
            )
            u = ures.scalar_one_or_none()
            if u:
                to_email = u.email
                recipient_name = f"{u.first_name or ''} {u.last_name or ''}".strip()
                primary_role = _primary_role_value(u)
        if not to_email and invite.emails:
            to_email = next((e.strip() for e in invite.emails if e and str(e).strip()), None)
        if not recipient_name:
            recipient_name = (invite.contact_person_name or "").strip() or "there"
        if to_email:
            try:
                await send_company_registration_decision_email(
                    to_email=to_email,
                    recipient_name=recipient_name,
                    company_name=invite.company_name or "your company",
                    accepted=invite.status == InviteStatus.ACCEPTED,
                    notes=notes if invite.status == InviteStatus.DECLINED else None,
                    primary_role=primary_role,
                )
            except Exception as e:
                logger.warning("Registration decision email failed: %s", e)

    return {
        "status": "updated",
        "new_status": invite.status.value,
        "provisioned_company_id": str(invite.provisioned_company_id)
        if invite.provisioned_company_id
        else None,
    }


@router.post("/invites/{invite_id}/update_status/")
async def post_invite_status(
    invite_id: UUID,
    body: CompanyInviteStatusBody,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """Update invite status with JSON body (admin only). Accepts new_status or legacy status string."""
    result = await db.execute(select(CompanyInvite).where(CompanyInvite.id == invite_id))
    invite = result.scalar_one_or_none()
    if not invite:
        raise HTTPException(status_code=404, detail="Invite not found")

    raw = body.new_status
    if raw is None and body.status:
        try:
            raw = InviteStatus(body.status.lower().strip())
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status value",
            )
    if raw is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide new_status or status",
        )
    notes = body.notes or body.bdm_notes
    return await _apply_invite_status_change(db, invite, raw, notes)


@router.put("/invites/{invite_id}/update_status/")
async def update_invite_status(
    invite_id: UUID,
    new_status: InviteStatus,
    notes: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """Update invite status (admin only) — query params."""
    result = await db.execute(select(CompanyInvite).where(CompanyInvite.id == invite_id))
    invite = result.scalar_one_or_none()
    if not invite:
        raise HTTPException(status_code=404, detail="Invite not found")
    return await _apply_invite_status_change(db, invite, new_status, notes)


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


@router.get("/{company_id}/affiliated-users", response_model=List[AffiliatedUserRow])
async def list_company_affiliated_users(
    company_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Company admins only: users tied via CompanyAdmin, profile.company_id, or experience.company_id."""
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id,
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")

    co = await db.execute(select(Company).where(Company.id == company_id))
    company = co.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    sources: Dict[UUID, set] = {}

    for uid in (
        await db.execute(
            select(CompanyAdmin.user_id).where(CompanyAdmin.company_id == company_id)
        )
    ).scalars().all():
        sources.setdefault(uid, set()).add("company_admin")

    for uid in (
        await db.execute(
            select(UserProfile.user_id).where(UserProfile.company_id == company_id)
        )
    ).scalars().all():
        sources.setdefault(uid, set()).add("profile")

    for uid in (
        await db.execute(
            select(Experience.user_id)
            .where(Experience.company_id == company_id)
            .distinct()
        )
    ).scalars().all():
        sources.setdefault(uid, set()).add("experience")

    # Experiences saved as free-text only (company_id null) but name matches this company
    name_target = normalize_company_name(company.name)
    if name_target:
        for row in (
            await db.execute(
                select(Experience.user_id, Experience.company_name).where(
                    Experience.company_id.is_(None)
                )
            )
        ).all():
            uid, cname = row[0], row[1]
            if normalize_company_name(cname) == name_target:
                sources.setdefault(uid, set()).add("experience")

    if not sources:
        return []

    order = ("company_admin", "profile", "experience")
    user_rows = await db.execute(
        select(User.id, User.email, User.first_name, User.last_name).where(
            User.id.in_(list(sources.keys()))
        )
    )
    by_id = {row[0]: row for row in user_rows.all()}
    out: List[AffiliatedUserRow] = []
    for uid, srcs in sources.items():
        row = by_id.get(uid)
        sorted_src = [s for s in order if s in srcs]
        out.append(
            AffiliatedUserRow(
                user_id=uid,
                email=row[1] if row else None,
                first_name=row[2] if row else None,
                last_name=row[3] if row else None,
                association_sources=sorted_src,
            )
        )
    out.sort(key=lambda r: (r.email or "", str(r.user_id)))
    return out


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

    prof_res = await db.execute(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    )
    prof = prof_res.scalar_one_or_none()
    if not prof:
        prof = UserProfile(user_id=current_user.id, company_id=db_company.id)
        db.add(prof)
    else:
        prof.company_id = db_company.id

    await db.commit()
    await db.refresh(db_company)

    return db_company


@router.put("/{company_id}", response_model=CompanyResponse)
@router.patch("/{company_id}", response_model=CompanyResponse)
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


# ============= CMS Endpoints (Company Management) =============

class CompanyTeamMemberCreate(BaseModel):
    name: str
    title: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    is_leadership: bool = False
    order: int = 0


class CompanyTeamMemberInvite(BaseModel):
    """Invite a team member by email to join a specific company."""
    email: EmailStr
    role: str = "member"


class CompanyTeamMemberResponse(CompanyTeamMemberCreate):
    id: UUID
    company_id: UUID
    
    class Config:
        from_attributes = True

class CompanyAdminCreate(BaseModel):
    user_id: Optional[UUID] = None
    email: Optional[EmailStr] = None  # Accept email for convenience
    role: str = "admin"  # owner, admin, hr, recruiter
    can_manage_jobs: bool = True
    can_manage_candidates: bool = True
    can_manage_team: bool = False
    can_manage_billing: bool = False
    can_manage_admins: bool = False

class CompanyAdminResponse(BaseModel):
    id: UUID
    company_id: UUID
    user_id: UUID
    role: str
    can_manage_jobs: bool
    can_manage_candidates: bool
    can_manage_team: bool
    can_manage_billing: bool
    can_manage_admins: bool
    added_at: datetime
    user_email: Optional[str] = None
    user_name: Optional[str] = None
    
    class Config:
        from_attributes = True


@router.get("/{company_id}/team-members", response_model=List[CompanyTeamMemberResponse])
async def get_company_team_members(
    company_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get company team members (admin only)."""
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.execute(
        select(CompanyTeamMember)
        .where(CompanyTeamMember.company_id == company_id)
        .order_by(CompanyTeamMember.order, CompanyTeamMember.name)
    )
    return result.scalars().all()


@router.post("/{company_id}/team-members", response_model=CompanyTeamMemberResponse)
async def add_company_team_member(
    company_id: UUID,
    member: CompanyTeamMemberCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a team member (admin only)."""
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
        )
    )
    admin = admin_check.scalar_one_or_none()
    if not admin or not admin.can_manage_team:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_member = CompanyTeamMember(company_id=company_id, **member.model_dump())
    db.add(db_member)
    await db.commit()
    await db.refresh(db_member)
    return db_member


@router.post("/{company_id}/team-members/invite", response_model=CompanyTeamMemberResponse)
async def invite_company_team_member(
    company_id: UUID,
    invite: CompanyTeamMemberInvite,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Invite a team member to join the company's CMS (admin only).
    
    Creates a team member record immediately so they appear in the team members list.
    If a user with this email exists, uses their name; otherwise extracts name from email.
    """
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
        )
    )
    admin = admin_check.scalar_one_or_none()
    if not admin or not admin.can_manage_team:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Check if user with this email exists
    user_result = await db.execute(
        select(User).where(User.email == invite.email)
    )
    existing_user = user_result.scalar_one_or_none()
    
    # Extract name: use user's name if exists, otherwise extract from email
    if existing_user:
        member_name = f"{existing_user.first_name} {existing_user.last_name}".strip()
        if not member_name:
            member_name = existing_user.email.split('@')[0].replace('.', ' ').title()
        member_title = None  # Could be set from user profile if available
    else:
        # Extract name from email: "john.doe@company.com" -> "John Doe"
        email_prefix = invite.email.split('@')[0]
        member_name = email_prefix.replace('.', ' ').replace('_', ' ').title()
        member_title = None
    
    # Check if team member already exists (by name + company)
    existing_member = await db.execute(
        select(CompanyTeamMember).where(
            CompanyTeamMember.company_id == company_id,
            CompanyTeamMember.name == member_name
        )
    )
    if existing_member.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Team member '{member_name}' already exists"
        )
    
    # Create team member record
    db_member = CompanyTeamMember(
        company_id=company_id,
        name=member_name,
        title=member_title,
        bio=None,
        photo_url=None,
        linkedin_url=None,
        twitter_url=None,
        is_leadership=False,
        order=0
    )
    db.add(db_member)
    await db.commit()
    await db.refresh(db_member)
    
    # TODO: Send actual email invite to invite.email
    # For now, the team member is created and will appear in the list
    
    return db_member


@router.delete("/{company_id}/team-members/{member_id}")
async def delete_company_team_member(
    company_id: UUID,
    member_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a team member (admin only)."""
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
        )
    )
    admin = admin_check.scalar_one_or_none()
    if not admin or not admin.can_manage_team:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.execute(
        select(CompanyTeamMember).where(
            CompanyTeamMember.id == member_id,
            CompanyTeamMember.company_id == company_id
        )
    )
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    await db.delete(member)
    await db.commit()
    return {"status": "deleted"}


@router.get("/{company_id}/admins", response_model=List[CompanyAdminResponse])
async def get_company_admins(
    company_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get company admins (admin only)."""
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
        )
    )
    admin = admin_check.scalar_one_or_none()
    if not admin or not admin.can_manage_admins:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.execute(
        select(CompanyAdmin)
        .options(selectinload(CompanyAdmin.user))
        .where(CompanyAdmin.company_id == company_id)
        .order_by(CompanyAdmin.added_at.desc())
    )
    admins = result.scalars().all()
    
    return [
        CompanyAdminResponse(
            id=a.id,
            company_id=a.company_id,
            user_id=a.user_id,
            role=a.role,
            can_manage_jobs=a.can_manage_jobs,
            can_manage_candidates=a.can_manage_candidates,
            can_manage_team=a.can_manage_team,
            can_manage_billing=a.can_manage_billing,
            can_manage_admins=a.can_manage_admins,
            added_at=a.added_at,
            user_email=a.user.email if a.user else None,
            user_name=f"{a.user.first_name} {a.user.last_name}".strip() if a.user else None,
        )
        for a in admins
    ]


@router.post("/{company_id}/admins", response_model=CompanyAdminResponse)
async def add_company_admin(
    company_id: UUID,
    admin_data: CompanyAdminCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a company admin (admin only). Accepts either user_id or email."""
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
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
                detail=f"User with email '{admin_data.email}' not found. They must have a VerTechie account."
            )
        target_user_id = target_user.id
    elif not target_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either 'user_id' or 'email' is required"
        )
    
    # Check if already an admin
    existing = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == target_user_id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User is already an admin")
    
    # Set permissions based on role
    role_permissions = {
        "owner": {
            "can_manage_jobs": True,
            "can_manage_candidates": True,
            "can_manage_team": True,
            "can_manage_billing": True,
            "can_manage_admins": True,
        },
        "admin": {
            "can_manage_jobs": True,
            "can_manage_candidates": True,
            "can_manage_team": True,
            "can_manage_billing": False,
            "can_manage_admins": False,
        },
        "hr": {
            "can_manage_jobs": False,
            "can_manage_candidates": True,
            "can_manage_team": True,
            "can_manage_billing": False,
            "can_manage_admins": False,
        },
        "recruiter": {
            "can_manage_jobs": True,
            "can_manage_candidates": True,
            "can_manage_team": False,
            "can_manage_billing": False,
            "can_manage_admins": False,
        },
    }
    
    permissions = role_permissions.get(admin_data.role, role_permissions["admin"])
    
    # Use provided permissions or defaults from role
    db_admin = CompanyAdmin(
        company_id=company_id,
        user_id=target_user_id,
        role=admin_data.role,
        can_manage_jobs=admin_data.can_manage_jobs if admin_data.can_manage_jobs is not None else permissions["can_manage_jobs"],
        can_manage_candidates=admin_data.can_manage_candidates if admin_data.can_manage_candidates is not None else permissions["can_manage_candidates"],
        can_manage_team=admin_data.can_manage_team if admin_data.can_manage_team is not None else permissions["can_manage_team"],
        can_manage_billing=admin_data.can_manage_billing if admin_data.can_manage_billing is not None else permissions["can_manage_billing"],
        can_manage_admins=admin_data.can_manage_admins if admin_data.can_manage_admins is not None else permissions["can_manage_admins"],
    )
    db.add(db_admin)
    await db.commit()
    await db.refresh(db_admin)
    
    # Load user for response
    await db.refresh(db_admin, ["user"])
    return CompanyAdminResponse(
        id=db_admin.id,
        company_id=db_admin.company_id,
        user_id=db_admin.user_id,
        role=db_admin.role,
        can_manage_jobs=db_admin.can_manage_jobs,
        can_manage_candidates=db_admin.can_manage_candidates,
        can_manage_team=db_admin.can_manage_team,
        can_manage_billing=db_admin.can_manage_billing,
        can_manage_admins=db_admin.can_manage_admins,
        added_at=db_admin.added_at,
        user_email=db_admin.user.email if db_admin.user else None,
        user_name=f"{db_admin.user.first_name} {db_admin.user.last_name}".strip() if db_admin.user else None,
    )


@router.delete("/{company_id}/admins/{admin_id}")
async def remove_company_admin(
    company_id: UUID,
    admin_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a company admin (admin only, cannot remove yourself)."""
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
        )
    )
    admin = admin_check.scalar_one_or_none()
    if not admin or not admin.can_manage_admins:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.id == admin_id,
            CompanyAdmin.company_id == company_id
        )
    )
    target_admin = result.scalar_one_or_none()
    if not target_admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    # Prevent removing yourself
    if target_admin.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot remove yourself")
    
    await db.delete(target_admin)
    await db.commit()
    return {"status": "deleted"}


@router.get("/{company_id}/stats")
async def get_company_stats(
    company_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get company statistics (admin only)."""
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Get company
    company_result = await db.execute(
        select(Company).where(Company.id == company_id)
    )
    company = company_result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Import Job model
    from app.models.job import Job, JobStatus
    
    # Count jobs
    jobs_count = await db.execute(
        select(func.count(Job.id)).where(Job.company_id == company_id)
    )
    
    # Count active jobs
    active_jobs_count = await db.execute(
        select(func.count(Job.id)).where(
            Job.company_id == company_id,
            Job.status == JobStatus.PUBLISHED
        )
    )
    
    # Count team members
    team_count = await db.execute(
        select(func.count(CompanyTeamMember.id)).where(
            CompanyTeamMember.company_id == company_id
        )
    )
    
    # Count admins
    admins_count = await db.execute(
        select(func.count(CompanyAdmin.id)).where(
            CompanyAdmin.company_id == company_id
        )
    )
    
    return {
        "company_id": str(company_id),
        "company_name": company.name,
        "total_jobs": jobs_count.scalar() or 0,
        "active_jobs": active_jobs_count.scalar() or 0,
        "team_members": team_count.scalar() or 0,
        "admins": admins_count.scalar() or 0,
        "followers": 0,  # TODO: Implement followers
        "page_views": 0,  # TODO: Implement page views tracking
    }


@router.get("/{company_id}/jobs")
async def list_company_jobs(
    company_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """List jobs for a specific company."""
    from app.models.job import Job
    result = await db.execute(
        select(Job).where(Job.company_id == company_id).order_by(Job.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{company_id}/posts", include_in_schema=True)
@router.get("/{company_id}/posts/", include_in_schema=False)
async def get_company_posts(
    company_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get company posts (admin only). For now returns posts by company admins."""
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Get admin user IDs
    admins_result = await db.execute(
        select(CompanyAdmin.user_id).where(CompanyAdmin.company_id == company_id)
    )
    admin_user_ids = [row[0] for row in admins_result.all()]
    
    if not admin_user_ids:
        return []
    
    # Get posts by company admins (for now - TODO: add company_id to Post model)
    from app.models.community import Post
    posts_result = await db.execute(
        select(Post)
        .where(Post.author_id.in_(admin_user_ids))
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    posts = posts_result.scalars().all()
    
    # Format response
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


class CompanyPostCreate(BaseModel):
    content: Optional[str] = ""
    media: Optional[List[str]] = None

@router.post("/{company_id}/posts", include_in_schema=True)
@router.post("/{company_id}/posts/", include_in_schema=False)
async def create_company_post(
    company_id: UUID,
    post_data: CompanyPostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a company post (admin only)."""
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Validate: must have content or media
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


# ============= Employee Verification =============

@router.get("/{company_id}/unverified-employees")
async def get_unverified_employees(
    company_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get techies who have added this company to their experience but are not verified."""
    # Check if admin
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")

    from app.models.user import Experience, User
    result = await db.execute(
        select(Experience, User)
        .join(User, Experience.user_id == User.id)
        .where(
            Experience.company_id == company_id,
            Experience.is_verified == False
        )
    )
    rows = result.all()
    
    return [
        {
            "experience_id": str(exp.id),
            "user_id": str(user.id),
            "full_name": f"{user.first_name} {user.last_name}",
            "email": user.email,
            "title": exp.title,
            "employment_type": exp.employment_type.value if hasattr(exp.employment_type, 'value') else str(exp.employment_type),
            "start_date": exp.start_date.isoformat() if exp.start_date else None,
            "end_date": exp.end_date.isoformat() if exp.end_date else None,
            "is_current": exp.is_current,
        }
        for exp, user in rows
    ]


@router.post("/{company_id}/verify-experience/{experience_id}")
async def verify_experience(
    company_id: UUID,
    experience_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Verify a techie's work experience at this company."""
    # Check if admin
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id
        )
    )
    if not admin_check.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Not authorized")

    from app.models.user import Experience
    result = await db.execute(
        select(Experience).where(
            Experience.id == experience_id,
            Experience.company_id == company_id
        )
    )
    exp = result.scalar_one_or_none()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience record not found")
    
    exp.is_verified = True
    exp.verified_by_id = current_user.id
    exp.verified_at = datetime.utcnow()
    
    await db.commit()
    return {"message": "Success", "experience_id": str(exp.id)}
