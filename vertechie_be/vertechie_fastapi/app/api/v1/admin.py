"""
Admin Dashboard API endpoints.
Provides endpoints for admin panel functionality.
"""

import logging
import json
import traceback
from datetime import datetime, timedelta
from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, field_validator
from sqlalchemy import select, func, and_, or_, cast, String, text, exists
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User, UserRole, RoleType, VerificationStatus, UserProfile, Experience, Education, user_roles
from app.models.company import Company, CompanyAdmin
from app.models.school import School, SchoolAdmin, InstitutionInviteRequest
from app.core.security import get_current_admin_user
from app.core.config import get_settings
from sqlalchemy.orm import selectinload

import aiosmtplib
import ssl
from email.message import EmailMessage
from email.utils import formataddr

# Set up logger
logger = logging.getLogger(__name__)

router = APIRouter()


def get_approval_email_html(user_name: str) -> str:
    """Generate beautiful HTML email for profile approval."""
    return f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f7fa; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden;">
                    <!-- Header with gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #004d40 0%, #00796b 50%, #009688 100%); padding: 40px 40px; text-align: center;">
                            <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 40px;">✓</span>
                            </div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                Welcome to VerTechie!
                            </h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
                                Your profile has been approved
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="color: #333; font-size: 18px; margin: 0 0 20px; line-height: 1.6;">
                                Dear <strong>{user_name}</strong>,
                            </p>
                            <p style="color: #555; font-size: 16px; margin: 0 0 25px; line-height: 1.7;">
                                Congratulations! 🎉 Your VerTechie profile has been verified and approved by our team. You're now part of an exclusive community of verified tech professionals.
                            </p>
                            
                            <!-- Features Box -->
                            <div style="background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%); border-radius: 12px; padding: 25px; margin: 25px 0;">
                                <p style="color: #2e7d32; font-weight: 600; margin: 0 0 15px; font-size: 15px;">
                                    🚀 What you can do now:
                                </p>
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td style="padding: 8px 0; color: #444; font-size: 14px;">
                                            <span style="color: #4caf50; margin-right: 10px;">✓</span> Browse and apply for premium tech opportunities
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #444; font-size: 14px;">
                                            <span style="color: #4caf50; margin-right: 10px;">✓</span> Connect with top companies seeking verified talent
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #444; font-size: 14px;">
                                            <span style="color: #4caf50; margin-right: 10px;">✓</span> Showcase your skills with a verified badge
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #444; font-size: 14px;">
                                            <span style="color: #4caf50; margin-right: 10px;">✓</span> Access exclusive learning resources and courses
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://vertechie.com/login" style="display: inline-block; background: linear-gradient(135deg, #004d40 0%, #00796b 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 30px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(0,77,64,0.3);">
                                    Login to Your Account →
                                </a>
                            </div>
                            
                            <p style="color: #777; font-size: 14px; margin: 30px 0 0; line-height: 1.6; text-align: center;">
                                Need help? Contact us at <a href="mailto:support@vertechie.com" style="color: #00796b;">support@vertechie.com</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafb; padding: 25px 40px; border-top: 1px solid #e8eef3;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="text-align: center;">
                                        <p style="color: #004d40; font-weight: 700; font-size: 18px; margin: 0 0 5px;">VerTechie</p>
                                        <p style="color: #888; font-size: 12px; margin: 0;">
                                            Connecting Verified Tech Talent with Opportunities
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
                <!-- Footer text -->
                <p style="color: #999; font-size: 11px; margin-top: 20px; text-align: center;">
                    © 2026 VerTechie. All rights reserved.<br>
                    This email was sent to you because you registered on VerTechie.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
'''


def get_rejection_email_html(user_name: str, reason: str = "") -> str:
    """Generate beautiful HTML email for profile rejection."""
    reason_html = f'''
                            <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <p style="color: #e65100; font-weight: 600; margin: 0 0 10px; font-size: 14px;">
                                    📋 Reason for this decision:
                                </p>
                                <p style="color: #555; font-size: 14px; margin: 0; line-height: 1.6;">
                                    {reason}
                                </p>
                            </div>
    ''' if reason else ''
    
    return f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f7fa; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #455a64 0%, #607d8b 100%); padding: 40px 40px; text-align: center;">
                            <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px;">
                                <span style="font-size: 40px; line-height: 80px;">📝</span>
                            </div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700;">
                                Profile Review Update
                            </h1>
                            <p style="color: rgba(255,255,255,0.85); margin: 10px 0 0; font-size: 15px;">
                                Additional information needed
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="color: #333; font-size: 18px; margin: 0 0 20px; line-height: 1.6;">
                                Dear <strong>{user_name}</strong>,
                            </p>
                            <p style="color: #555; font-size: 16px; margin: 0 0 20px; line-height: 1.7;">
                                Thank you for your interest in joining VerTechie. After reviewing your profile, we need some additional information before we can approve your application.
                            </p>
                            
                            {reason_html}
                            
                            <!-- Steps Box -->
                            <div style="background: linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%); border-radius: 12px; padding: 25px; margin: 25px 0;">
                                <p style="color: #1565c0; font-weight: 600; margin: 0 0 15px; font-size: 15px;">
                                    📌 Next steps to get approved:
                                </p>
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td style="padding: 10px 0; color: #444; font-size: 14px;">
                                            <span style="display: inline-block; width: 24px; height: 24px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 12px; font-size: 12px;">1</span>
                                            Log in to your VerTechie account
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #444; font-size: 14px;">
                                            <span style="display: inline-block; width: 24px; height: 24px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 12px; font-size: 12px;">2</span>
                                            Update your profile with accurate information
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #444; font-size: 14px;">
                                            <span style="display: inline-block; width: 24px; height: 24px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 12px; font-size: 12px;">3</span>
                                            Ensure all documents are clear and valid
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #444; font-size: 14px;">
                                            <span style="display: inline-block; width: 24px; height: 24px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 12px; font-size: 12px;">4</span>
                                            Resubmit your application for review
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://vertechie.com/login" style="display: inline-block; background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 30px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(21,101,192,0.3);">
                                    Update Your Profile →
                                </a>
                            </div>
                            
                            <p style="color: #666; font-size: 14px; margin: 25px 0 0; line-height: 1.6; text-align: center; background-color: #f5f5f5; padding: 15px; border-radius: 8px;">
                                💬 Have questions? We're here to help!<br>
                                <a href="mailto:support@vertechie.com" style="color: #1565c0; font-weight: 600;">support@vertechie.com</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafb; padding: 25px 40px; border-top: 1px solid #e8eef3;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="text-align: center;">
                                        <p style="color: #455a64; font-weight: 700; font-size: 18px; margin: 0 0 5px;">VerTechie</p>
                                        <p style="color: #888; font-size: 12px; margin: 0;">
                                            Connecting Verified Tech Talent with Opportunities
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
                <!-- Footer text -->
                <p style="color: #999; font-size: 11px; margin-top: 20px; text-align: center;">
                    © 2026 VerTechie. All rights reserved.<br>
                    This email was sent to you because you registered on VerTechie.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
'''


async def send_profile_status_email(
    user_email: str,
    user_name: str,
    status: str,
    reason: str = ""
) -> bool:
    """Send email notification when profile is approved or rejected."""
    settings = get_settings()
    
    print(f"[EMAIL] Attempting to send {status} email to {user_email}")
    print(f"[EMAIL] SMTP_USER: {settings.SMTP_USER}, SMTP_HOST: {settings.SMTP_HOST}")
    
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print(f"[EMAIL] SMTP not configured. Would send {status} email to: {user_email}")
        return False
    
    msg = EmailMessage()
    
    if status == "approved":
        msg["Subject"] = "🎉 Welcome to VerTechie - Your Profile is Approved!"
        html_body = get_approval_email_html(user_name)
        plain_body = f"Dear {user_name}, Congratulations! Your VerTechie profile has been approved. Login at https://vertechie.com/login"
    else:  # rejected
        msg["Subject"] = "VerTechie Profile Review - Action Required"
        html_body = get_rejection_email_html(user_name, reason)
        plain_body = f"Dear {user_name}, Your profile needs updates. Please login and update your profile at https://vertechie.com/login"
    
    msg["From"] = formataddr((settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL))
    msg["To"] = user_email
    msg.set_content(plain_body)
    msg.add_alternative(html_body, subtype='html')
    
    try:
        # Create SSL context that doesn't verify certificates (for macOS development)
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        
        use_ssl = settings.SMTP_PORT == 465
        
        print(f"[EMAIL] Connecting to {settings.SMTP_HOST}:{settings.SMTP_PORT} (use_ssl={use_ssl})")
        
        async with aiosmtplib.SMTP(
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            use_tls=use_ssl,
            start_tls=not use_ssl and settings.SMTP_USE_TLS,
            tls_context=context,
        ) as smtp:
            print(f"[EMAIL] Logging in as {settings.SMTP_USER}")
            await smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            print(f"[EMAIL] Sending message...")
            await smtp.send_message(msg)
        print(f"[EMAIL] Profile {status} email sent successfully to {user_email}")
        return True
    except Exception as e:
        print(f"[EMAIL] Failed to send profile {status} email to {user_email}: {e}")
        import traceback
        traceback.print_exc()
        return False


# ============= Schemas =============

class PermissionResponse(BaseModel):
    """Permission response."""
    id: str
    name: str
    codename: str
    description: Optional[str] = None


class GroupResponse(BaseModel):
    """User role/group response."""
    id: UUID
    name: str
    role_type: str
    description: Optional[str] = None
    is_active: bool = True
    user_count: int = 0
    permissions: List[PermissionResponse] = []  # Add permissions field
    
    class Config:
        from_attributes = True


class BlockedProfileResponse(BaseModel):
    """Blocked user profile response."""
    id: UUID
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    blocked_at: Optional[datetime] = None
    blocked_reason: Optional[str] = None
    blocked_by_email: Optional[str] = None


class PendingApprovalResponse(BaseModel):
    """Pending approval response."""
    id: UUID
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    country: Optional[str] = None
    vertechie_id: Optional[str] = None
    verification_status: str
    created_at: Optional[datetime] = None
    # Fields expected by frontend
    user_type: str = "techie"
    user_full_name: Optional[str] = None
    user_email: Optional[str] = None
    status: str = "pending"


class PendingApprovalListResponse(BaseModel):
    """Paginated list of pending approvals with total count."""
    results: List[PendingApprovalResponse] = []
    total: int = 0


class ApprovalStatsResponse(BaseModel):
    """Stats for pending approvals."""
    pending: int = 0
    approved: int = 0
    rejected: int = 0
    total: int = 0


class AdminStatsResponse(BaseModel):
    """Admin dashboard statistics."""
    total_users: int = 0
    active_users: int = 0
    pending_approvals: int = 0
    blocked_users: int = 0
    total_techies: int = 0
    total_companies: int = 0
    new_users_today: int = 0
    new_users_this_week: int = 0


# ============= Endpoints =============

def _available_permissions() -> List[PermissionResponse]:
    """Static permissions list used by role-management endpoints."""
    return [
        PermissionResponse(id="1", name="View Users", codename="view_users", description="Can view all users"),
        PermissionResponse(id="2", name="Edit Users", codename="edit_users", description="Can edit user details"),
        PermissionResponse(id="3", name="Delete Users", codename="delete_users", description="Can delete users"),
        PermissionResponse(id="4", name="Block Users", codename="block_users", description="Can block/unblock users"),
        PermissionResponse(id="5", name="Verify Profiles", codename="verify_profiles", description="Can approve/reject profiles"),
        PermissionResponse(id="6", name="Manage Companies", codename="manage_companies", description="Can manage companies"),
        PermissionResponse(id="7", name="Manage Schools", codename="manage_schools", description="Can manage schools"),
        PermissionResponse(id="8", name="Manage Jobs", codename="manage_jobs", description="Can manage job postings"),
        PermissionResponse(id="9", name="View Reports", codename="view_reports", description="Can view analytics"),
        PermissionResponse(id="10", name="System Settings", codename="system_settings", description="Can change system settings"),
    ]


def _normalize_permission_codes(permission_ids: List[Any]) -> List[str]:
    """Accept permission ids/codenames and store normalized codenames."""
    if not permission_ids:
        return []
    catalog = _available_permissions()
    id_to_code = {str(p.id): p.codename for p in catalog}
    valid_codes = {p.codename for p in catalog}
    normalized: List[str] = []
    seen = set()
    for raw in permission_ids:
        token = str(raw).strip()
        if not token:
            continue
        code = id_to_code.get(token, token)
        if code not in valid_codes:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid permission: {raw}"
            )
        if code not in seen:
            normalized.append(code)
            seen.add(code)
    return normalized


def _infer_role_type_from_name(name: str) -> Optional[RoleType]:
    """Infer RoleType from common admin role names used in UI."""
    key = (name or "").strip().lower().replace("-", "_").replace(" ", "_")
    mapping = {
        "superadmin": RoleType.SUPER_ADMIN,
        "super_admin": RoleType.SUPER_ADMIN,
        "company_admin": RoleType.COMPANY_ADMIN,
        "hm_admin": RoleType.HIRING_MANAGER,
        "hiring_manager_admin": RoleType.HIRING_MANAGER,
        "techie_admin": RoleType.TECHIE,
        "school_admin": RoleType.SCHOOL_ADMIN,
        "bdm_admin": RoleType.BDM_ADMIN,
    }
    return mapping.get(key)


class GroupCreateRequest(BaseModel):
    name: str
    role_type: Optional[str] = None
    description: Optional[str] = None
    permission_ids: List[Any] = []


class GroupUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    permission_ids: Optional[List[Any]] = None


def _serialize_permissions(codes: Optional[List[Any]]) -> List[PermissionResponse]:
    catalog = _available_permissions()
    by_code = {p.codename: p for p in catalog}
    out: List[PermissionResponse] = []
    for i, raw in enumerate(codes or []):
        code = str(raw)
        perm = by_code.get(code)
        if perm:
            out.append(perm)
        else:
            out.append(PermissionResponse(
                id=str(i + 1),
                name=code.replace("_", " ").title(),
                codename=code,
                description=None,
            ))
    return out

@router.get("/groups/", response_model=List[GroupResponse])
async def list_groups(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """List all user groups/roles."""
    
    result = await db.execute(select(UserRole))
    roles = result.scalars().all()
    
    groups = []
    for role in roles:
        # Count users in this role
        count_result = await db.execute(
            select(func.count(User.id))
            .join(User.roles)
            .where(UserRole.id == role.id)
        )
        user_count = count_result.scalar() or 0
        
        role_permissions = _serialize_permissions(role.permissions)
        
        groups.append(GroupResponse(
            id=role.id,
            name=role.name,
            role_type=role.role_type.value if role.role_type else "unknown",
            description=role.description,
            is_active=role.is_active,
            user_count=user_count,
            permissions=role_permissions  # Include permissions
        ))
    
    return groups


@router.post("/groups/", response_model=GroupResponse, status_code=status.HTTP_201_CREATED)
async def create_group(
    body: GroupCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
) -> Any:
    """Create a role/group used in Access Roles tab."""
    name = (body.name or "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Role name is required")

    normalized_permissions = _normalize_permission_codes(body.permission_ids or [])
    role_type: Optional[RoleType] = None
    if body.role_type:
        try:
            role_type = RoleType(str(body.role_type).strip().lower())
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid role_type")
    if role_type is None:
        role_type = _infer_role_type_from_name(name)
    if role_type is None:
        raise HTTPException(
            status_code=400,
            detail="Role type not recognized. Use a standard admin role name (superadmin, company_admin, hm_admin, techie_admin, school_admin, bdm_admin).",
        )

    exists = await db.execute(select(UserRole).where(func.lower(UserRole.name) == name.lower()))
    if exists.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Role already exists")

    role = UserRole(
        name=name,
        role_type=role_type,
        description=body.description,
        permissions=normalized_permissions,
        is_active=True,
    )
    db.add(role)
    await db.commit()
    await db.refresh(role)

    return GroupResponse(
        id=role.id,
        name=role.name,
        role_type=role.role_type.value if role.role_type else "unknown",
        description=role.description,
        is_active=role.is_active,
        user_count=0,
        permissions=_serialize_permissions(role.permissions),
    )


@router.put("/groups/{group_id}/", response_model=GroupResponse)
async def update_group(
    group_id: UUID,
    body: GroupUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
) -> Any:
    """Update role metadata/permissions used in Access Roles tab."""
    result = await db.execute(select(UserRole).where(UserRole.id == group_id))
    role = result.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    if body.name is not None:
        new_name = body.name.strip()
        if not new_name:
            raise HTTPException(status_code=400, detail="Role name cannot be empty")
        role.name = new_name
    if body.description is not None:
        role.description = body.description
    if body.is_active is not None:
        role.is_active = body.is_active
    if body.permission_ids is not None:
        role.permissions = _normalize_permission_codes(body.permission_ids)

    await db.commit()
    await db.refresh(role)

    count_result = await db.execute(
        select(func.count(user_roles.c.user_id)).where(user_roles.c.role_id == role.id)
    )
    user_count = count_result.scalar() or 0

    return GroupResponse(
        id=role.id,
        name=role.name,
        role_type=role.role_type.value if role.role_type else "unknown",
        description=role.description,
        is_active=role.is_active,
        user_count=user_count,
        permissions=_serialize_permissions(role.permissions),
    )


@router.delete("/groups/{group_id}/", status_code=status.HTTP_200_OK)
async def delete_group(
    group_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
) -> Any:
    """Delete a role if it is not assigned to any users."""
    result = await db.execute(select(UserRole).where(UserRole.id == group_id))
    role = result.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    count_result = await db.execute(
        select(func.count(user_roles.c.user_id)).where(user_roles.c.role_id == role.id)
    )
    assigned_count = count_result.scalar() or 0
    if assigned_count > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete role that is assigned to users",
        )

    await db.delete(role)
    await db.commit()
    return {"success": True, "message": "Role deleted"}


@router.get("/permissions/", response_model=List[PermissionResponse])
async def list_permissions(
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """List all available permissions."""
    
    return _available_permissions()


@router.get("/blocked-profiles/", response_model=List[BlockedProfileResponse])
async def list_blocked_profiles(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """List all blocked user profiles."""
    
    result = await db.execute(
        select(User)
        .where(User.is_blocked == True)
        .order_by(User.blocked_at.desc())
        .offset(skip)
        .limit(limit)
    )
    blocked_users = result.scalars().all()
    
    response = []
    for user in blocked_users:
        # Get who blocked this user
        blocked_by_email = None
        if user.blocked_by_id:
            blocker_result = await db.execute(
                select(User.email).where(User.id == user.blocked_by_id)
            )
            blocked_by_email = blocker_result.scalar()
        
        response.append(BlockedProfileResponse(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            blocked_at=user.blocked_at,
            blocked_reason=user.blocked_reason,
            blocked_by_email=blocked_by_email
        ))
    
    return response


@router.post("/blocked-profiles/{user_id}/unblock/")
async def unblock_blocked_profile(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """
    Unblock a user from the blocked profiles list.
    
    This matches the Super Admin panel call to:
    POST /blocked-profiles/{id}/unblock/
    """
    # Find the user
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.verification_status not in [VerificationStatus.PENDING, VerificationStatus.RESUBMITTED]:
        raise HTTPException(
            status_code=400,
            detail="Only pending users can be approved. Use block/unblock for already approved users."
        )
    
    # If user is already unblocked, just return success
    if not user.is_blocked:
        return {
            "success": True,
            "message": "User is already unblocked",
            "user_id": str(user.id),
        }
    
    # Unblock user (mirror logic from users.unblock_user)
    user.is_blocked = False
    user.blocked_at = None
    user.blocked_reason = None
    user.blocked_by_id = None
    
    await db.commit()
    
    return {
        "success": True,
        "message": f"User {user.email} has been unblocked",
        "user_id": str(user.id),
    }


@router.get("/pending-approvals/", response_model=PendingApprovalListResponse)
async def list_pending_approvals(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    user_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None, description="Search by name, email, or vertechie_id"),
    education_verification: Optional[str] = Query(None, description="Filter by education verification: all, pending, verified"),
    experience_verification: Optional[str] = Query(None, description="Filter by experience verification: all, pending, verified"),
    company_verification: Optional[str] = Query(None, description="Filter by company verification (HR/School): all, pending, verified"),
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """List users pending approval.
    
    Role-based filtering:
    - Super Admin: sees all users
    - HM Admin: sees only hiring_manager users
    - Techie Admin: sees only techie users
    - Company Admin: sees only company_admin users
    - School Admin: sees only school_admin users
    """
    try:
        logger.info(f"[PENDING_APPROVALS] Starting request - user_type={user_type}, status={status}, status_filter={status_filter}, search={search!r}, education_verification={education_verification}, experience_verification={experience_verification}, company_verification={company_verification}, skip={skip}, limit={limit}")
        logger.info(f"[PENDING_APPROVALS] Current admin: {current_admin.email}, admin_roles={current_admin.admin_roles}, is_superuser={current_admin.is_superuser}")
        
        from sqlalchemy.orm import selectinload
        
        # Determine what role types this admin can manage
        admin_roles = current_admin.admin_roles or []
        is_superadmin = current_admin.is_superuser or "superadmin" in admin_roles
        logger.info(f"[PENDING_APPROVALS] Admin roles: {admin_roles}, is_superadmin: {is_superadmin}")
        
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
        
        # If user_type is provided in query, use that for additional filtering
        user_type_to_role_map = {
            "techie": RoleType.TECHIE,
            "hr": RoleType.HIRING_MANAGER,
            "hiring_manager": RoleType.HIRING_MANAGER,
            "company": RoleType.COMPANY_ADMIN,
            "school": RoleType.SCHOOL_ADMIN,
            "bdm": RoleType.BDM_ADMIN,
        }
        
        query_role_type = None
        if user_type:
            query_role_type = user_type_to_role_map.get(user_type.lower())
        
        # Use status or status_filter (frontend sends "" for "All")
        filter_status = status if status is not None else status_filter
        if filter_status is not None and filter_status.strip() == "":
            filter_status = "all"
        elif filter_status is not None:
            filter_status = filter_status.strip().lower() or "all"
        
        # Map status string to enum (not .value, use enum directly for PostgreSQL ENUM)
        status_map = {
            "pending": VerificationStatus.PENDING,
            "approved": VerificationStatus.APPROVED,
            "rejected": VerificationStatus.REJECTED,
            "under_review": VerificationStatus.UNDER_REVIEW,
            "resubmitted": VerificationStatus.RESUBMITTED,
        }
        
        # Build base query with role loading
        query = select(User).options(selectinload(User.roles))
        
        # Filter by status: "all" or empty = no filter; "suspended" = blocked users; else verification_status
        if filter_status and filter_status != "all":
            if filter_status == "suspended":
                query = query.where(User.is_blocked == True)
                logger.info(f"[PENDING_APPROVALS] Filtering by suspended (blocked) users")
            elif filter_status in status_map:
                status_enum = status_map[filter_status]
                query = query.where(User.verification_status == status_enum.value)
                logger.info(f"[PENDING_APPROVALS] Filtering by status: {filter_status}")
            else:
                logger.info(f"[PENDING_APPROVALS] Invalid status '{filter_status}', showing all statuses")
        else:
            logger.info(f"[PENDING_APPROVALS] Showing all statuses (all/empty)")
        
        # Search by name, email, or vertechie_id
        if search and search.strip():
            search_pattern = f"%{search.strip()}%"
            query = query.where(
                or_(
                    User.first_name.ilike(search_pattern),
                    User.last_name.ilike(search_pattern),
                    User.email.ilike(search_pattern),
                    User.vertechie_id.ilike(search_pattern),
                )
            )
            logger.info(f"[PENDING_APPROVALS] Search filter: {search.strip()!r}")
        
        # Education verification filter: pending = has at least one unverified; verified = has at least one and all verified
        edu_verif = (education_verification or "").strip().lower() if education_verification else ""
        if edu_verif == "pending":
            query = query.where(
                exists(select(1).select_from(Education).where(Education.user_id == User.id, Education.is_verified == False))
            )
            logger.info("[PENDING_APPROVALS] Filtering by education verification: pending")
        elif edu_verif == "verified":
            has_edu = exists(select(1).select_from(Education).where(Education.user_id == User.id))
            no_pending = ~exists(select(1).select_from(Education).where(Education.user_id == User.id, Education.is_verified == False))
            query = query.where(has_edu, no_pending)
            logger.info("[PENDING_APPROVALS] Filtering by education verification: verified")
        
        # Experience verification filter
        exp_verif = (experience_verification or "").strip().lower() if experience_verification else ""
        if exp_verif == "pending":
            query = query.where(
                exists(select(1).select_from(Experience).where(Experience.user_id == User.id, Experience.is_verified == False))
            )
            logger.info("[PENDING_APPROVALS] Filtering by experience verification: pending")
        elif exp_verif == "verified":
            has_exp = exists(select(1).select_from(Experience).where(Experience.user_id == User.id))
            no_pending_exp = ~exists(select(1).select_from(Experience).where(Experience.user_id == User.id, Experience.is_verified == False))
            query = query.where(has_exp, no_pending_exp)
            logger.info("[PENDING_APPROVALS] Filtering by experience verification: verified")
        
        query = query.order_by(User.created_at.asc())
        logger.info(f"[PENDING_APPROVALS] Query built, executing...")
        
        result = await db.execute(query)
        all_users = result.scalars().all()
        logger.info(f"[PENDING_APPROVALS] Fetched {len(all_users)} users from database")
        
        # When filtering by user_type (hr, company, school), include users with that role even if
        # they have admin_roles (e.g. hm_admin), so the HR/Company/School tabs show all users of that type.
        # When not filtering by user_type (or when showing techies), we still include everyone and
        # filter by role below; no need to exclude admins here so role-specific tabs see their users.
        users = list(all_users)
        logger.info(f"[PENDING_APPROVALS] Using all {len(users)} users for role filtering")
        
        # Normalize role type for comparison (DB enum may be uppercase 'HIRING_MANAGER', Python uses .value 'hiring_manager')
        def _role_key(rt):
            if rt is None:
                return None
            if hasattr(rt, "value"):
                return (rt.value or "").lower()
            return (str(rt) or "").lower().replace(" ", "_")

        # Filter users based on admin's allowed role types and user_type query param
        filtered_users = []
        query_role_key = _role_key(query_role_type) if query_role_type else None
        for user in users:
            try:
                # Determine user's role type
                user_role_type = None
                
                # Access roles (should be loaded via selectinload)
                if hasattr(user, 'roles') and user.roles:
                    for role in user.roles:
                        if hasattr(role, 'role_type'):
                            user_role_type = role.role_type
                            break  # Take first role
                
                logger.debug(f"[PENDING_APPROVALS] User {user.email}: role_type={user_role_type}")
                
                # For techie_admin: Only show users who explicitly have TECHIE role
                # Don't default to TECHIE for users without roles - they might be HR/Company/School
                if not user_role_type:
                    # Only default to TECHIE if this is a superadmin viewing all, or if explicitly querying for techies
                    if is_superadmin and (not query_role_type or _role_key(query_role_type) == "techie"):
                        user_role_type = RoleType.TECHIE
                    else:
                        # For role-specific admins, skip users without explicit roles
                        continue
                
                user_key = _role_key(user_role_type)
                # Check if superadmin or if admin can manage this user type
                if is_superadmin:
                    # Superadmin can see all, but still filter by user_type if provided
                    if query_role_key and user_key != query_role_key:
                        continue
                    filtered_users.append((user, user_role_type))
                elif allowed_role_types:
                    # Non-superadmin: only show users they can manage (compare by normalized key)
                    if any(_role_key(ar) == user_key for ar in allowed_role_types):
                        if query_role_key and user_key != query_role_key:
                            continue
                        filtered_users.append((user, user_role_type))
                else:
                    # Admin has no specific role mapping, show nothing
                    pass
            except Exception as e:
                logger.error(f"[PENDING_APPROVALS] Error processing user {user.id if hasattr(user, 'id') else 'unknown'}: {e}")
                logger.error(f"[PENDING_APPROVALS] Traceback: {traceback.format_exc()}")
                continue
        
        # Company verification filter (HR/Company/School only): filter by hr_company_verified_at
        company_verif = (company_verification or "").strip().lower() if company_verification else ""
        hr_school_roles = {RoleType.HIRING_MANAGER, RoleType.COMPANY_ADMIN, RoleType.SCHOOL_ADMIN}
        if company_verif and query_role_type in hr_school_roles:
            if company_verif == "pending":
                filtered_users = [(u, rt) for u, rt in filtered_users if getattr(u, "hr_company_verified_at", None) is None]
                logger.info(f"[PENDING_APPROVALS] After company verification pending filter: {len(filtered_users)} users")
            elif company_verif == "verified":
                filtered_users = [(u, rt) for u, rt in filtered_users if getattr(u, "hr_company_verified_at", None) is not None]
                logger.info(f"[PENDING_APPROVALS] After company verification verified filter: {len(filtered_users)} users")
        
        logger.info(f"[PENDING_APPROVALS] After role filtering: {len(filtered_users)} users")
        
        # Apply pagination after filtering
        paginated_users = filtered_users[skip:skip + limit]
        logger.info(f"[PENDING_APPROVALS] After pagination: {len(paginated_users)} users")
        
        # Map role type to user type string for frontend
        role_to_user_type_map = {
            RoleType.TECHIE: "techie",
            RoleType.HIRING_MANAGER: "hr",
            RoleType.COMPANY_ADMIN: "company",
            RoleType.SCHOOL_ADMIN: "school",
            RoleType.BDM_ADMIN: "bdm",
            RoleType.SUPER_ADMIN: "admin",
        }
        
        result_list = []
        for user, user_role_type in paginated_users:
            try:
                # Handle verification_status - convert enum to string value
                verification_status_str = "PENDING"
                if user.verification_status is not None:
                    verification_status_str = getattr(
                        user.verification_status, "value", user.verification_status
                    )
                    if not isinstance(verification_status_str, str):
                        verification_status_str = str(verification_status_str)
                # When user is blocked, show status as suspended for frontend
                display_status = "suspended" if getattr(user, "is_blocked", False) else verification_status_str.lower()
                result_list.append(
                    PendingApprovalResponse(
                        id=user.id,
                        email=str(user.email) if user.email else "",
                        first_name=user.first_name,
                        last_name=user.last_name,
                        country=user.country,
                        vertechie_id=getattr(user, "vertechie_id", None),
                        verification_status=verification_status_str,
                        created_at=user.created_at,
                        # Frontend expected fields
                        user_type=role_to_user_type_map.get(user_role_type, "techie"),
                        user_full_name=f"{user.first_name or ''} {user.last_name or ''}".strip() or (user.email or ""),
                        user_email=user.email or "",
                        status=display_status
                    )
                )
            except Exception as e:
                logger.error(f"[PENDING_APPROVALS] Error creating response for user {user.id}: {e}")
                logger.error(f"[PENDING_APPROVALS] Traceback: {traceback.format_exc()}")
                continue
        
        total_count = len(filtered_users)
        logger.info(f"[PENDING_APPROVALS] Returning {len(result_list)} approvals (total={total_count})")
        return PendingApprovalListResponse(results=result_list, total=total_count)
        
    except Exception as e:
        logger.error(f"[PENDING_APPROVALS] ERROR: {str(e)}")
        logger.error(f"[PENDING_APPROVALS] Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching pending approvals: {str(e)}"
        )


@router.get("/pending-approvals/stats/", response_model=ApprovalStatsResponse)
async def get_pending_approvals_stats(
    user_type: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """Get stats for pending approvals.
    
    Role-based filtering:
    - Super Admin: counts all users
    - HM Admin: counts only hiring_manager users
    - Techie Admin: counts only techie users
    - etc.
    """
    from sqlalchemy.orm import selectinload
    
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
    
    # If user_type is provided in query, use that for additional filtering
    user_type_to_role_map = {
        "techie": RoleType.TECHIE,
        "hr": RoleType.HIRING_MANAGER,
        "hiring_manager": RoleType.HIRING_MANAGER,
        "company": RoleType.COMPANY_ADMIN,
        "school": RoleType.SCHOOL_ADMIN,
        "bdm": RoleType.BDM_ADMIN,
    }
    
    query_role_type = user_type_to_role_map.get(user_type.lower()) if user_type else None
    
    # Fetch all users with their roles
    query = select(User).options(selectinload(User.roles))
    
    result = await db.execute(query)
    all_users = result.scalars().all()
    
    # Include all users for stats (including those with admin_roles) so role-specific tabs
    # (e.g. HR) show correct counts for users of that type.
    
    def _role_key(rt):
        if rt is None:
            return None
        if hasattr(rt, "value"):
            return (rt.value or "").lower()
        return (str(rt) or "").lower().replace(" ", "_")
    
    query_role_key = _role_key(query_role_type) if query_role_type else None
    allowed_keys = {_role_key(ar) for ar in allowed_role_types} if allowed_role_types else set()
    
    # Filter users based on admin's allowed role types
    pending = 0
    approved = 0
    rejected = 0
    
    for user in all_users:
        # Determine user's role type
        user_role_type = None
        if user.roles:
            for role in user.roles:
                user_role_type = role.role_type
                break
        
        # Default to TECHIE if no role assigned
        if not user_role_type:
            user_role_type = RoleType.TECHIE
        
        user_key = _role_key(user_role_type)
        # Check if this admin can manage this user type (compare by normalized key for DB enum compatibility)
        can_manage = False
        if is_superadmin:
            if query_role_key:
                can_manage = (user_key == query_role_key)
            else:
                can_manage = True
        elif allowed_keys:
            if user_key in allowed_keys:
                if query_role_key:
                    can_manage = (user_key == query_role_key)
                else:
                    can_manage = True
        
        if can_manage:
            status = user.verification_status
            # Normalize to string (DB may return enum or string)
            status_str = getattr(status, "value", status) if status is not None else None
            if status_str in (VerificationStatus.PENDING.value, VerificationStatus.RESUBMITTED.value):
                pending += 1
            elif status_str == VerificationStatus.APPROVED.value:
                approved += 1
            elif status_str == VerificationStatus.REJECTED.value:
                rejected += 1
    
    total = pending + approved + rejected
    
    return ApprovalStatsResponse(
        pending=pending,
        approved=approved,
        rejected=rejected,
        total=total
    )


class RejectRequest(BaseModel):
    """Request body for rejection."""
    # Backend originally expected `reason`.
    # SuperAdmin frontend currently sends `rejection_reason`.
    # Support both for backwards compatibility.
    reason: str = ""
    rejection_reason: Optional[str] = None


async def _get_profile_finalize_block_reason(db: AsyncSession, user: User) -> Optional[str]:
    """Return a blocking reason when profile cannot be approved/rejected yet."""
    role_result = await db.execute(
        select(UserRole.role_type).where(UserRole.user_id == user.id)
    )
    role_values = {
        (getattr(row[0], "value", row[0]) or "").lower()
        for row in role_result.all()
        if row and row[0] is not None
    }

    # Treat users without explicit roles as techies for safety.
    is_techie = not role_values or RoleType.TECHIE.value in role_values
    if is_techie:
        unverified_edu_result = await db.execute(
            select(func.count(Education.id)).where(
                Education.user_id == user.id,
                Education.is_verified.is_not(True)
            )
        )
        unverified_exp_result = await db.execute(
            select(func.count(Experience.id)).where(
                Experience.user_id == user.id,
                Experience.is_verified.is_not(True)
            )
        )
        unverified_edu = int(unverified_edu_result.scalar() or 0)
        unverified_exp = int(unverified_exp_result.scalar() or 0)
        if unverified_edu > 0 or unverified_exp > 0:
            return "Verify all Education and Work Experience entries before Approve/Reject."

    needs_org_verification = any(
        role in role_values
        for role in [
            RoleType.HIRING_MANAGER.value,
            RoleType.COMPANY_ADMIN.value,
            RoleType.SCHOOL_ADMIN.value,
        ]
    )
    if needs_org_verification and user.hr_company_verified_at is None:
        return "Verify Company/Organization details before Approve/Reject."

    return None


@router.post("/pending-approvals/{user_id}/approve/")
async def approve_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """Approve a user's registration."""
    
    # Find the user
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.verification_status not in [VerificationStatus.PENDING, VerificationStatus.RESUBMITTED]:
        raise HTTPException(
            status_code=400,
            detail="Only pending users can be approved. Use block/unblock for already approved users."
        )

    block_reason = await _get_profile_finalize_block_reason(db, user)
    if block_reason:
        raise HTTPException(status_code=400, detail=block_reason)
    
    # Update verification status
    user.verification_status = VerificationStatus.APPROVED
    user.is_verified = True
    user.email_verified = True
    user.reviewed_by_id = current_admin.id
    user.reviewed_at = datetime.utcnow()
    
    await db.commit()
    
    # Send approval email notification
    user_name = f"{user.first_name or ''} {user.last_name or ''}".strip() or user.email
    email_sent = await send_profile_status_email(user.email, user_name, "approved")
    
    return {
        "success": True,
        "message": f"User {user.email} has been approved",
        "user_id": str(user.id),
        "email_sent": email_sent
    }


@router.post("/pending-approvals/{user_id}/reject/")
async def reject_user(
    user_id: UUID,
    reject_data: RejectRequest,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """Reject a user's registration."""
    
    # Find the user
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.verification_status not in [VerificationStatus.PENDING, VerificationStatus.RESUBMITTED]:
        raise HTTPException(
            status_code=400,
            detail="Only pending users can be rejected. Use block/unblock for already approved users."
        )

    block_reason = await _get_profile_finalize_block_reason(db, user)
    if block_reason:
        raise HTTPException(status_code=400, detail=block_reason)
    
    # Determine final rejection reason (support both `reason` and `rejection_reason`)
    final_reason = reject_data.reason or (reject_data.rejection_reason or "")
    
    # Update verification status
    user.verification_status = VerificationStatus.REJECTED
    user.is_verified = False
    user.reviewed_by_id = current_admin.id
    user.reviewed_at = datetime.utcnow()
    user.rejection_reason = final_reason
    
    await db.commit()
    
    # Send rejection email notification
    user_name = f"{user.first_name or ''} {user.last_name or ''}".strip() or user.email
    email_sent = await send_profile_status_email(user.email, user_name, "rejected", final_reason)
    
    return {
        "success": True,
        "message": f"User {user.email} has been rejected",
        "user_id": str(user.id),
        "reason": final_reason,
        "email_sent": email_sent
    }


@router.get("/stats/", response_model=AdminStatsResponse)
async def get_admin_stats(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """Get admin dashboard statistics."""
    
    # Total users
    total_result = await db.execute(select(func.count(User.id)))
    total_users = total_result.scalar() or 0
    
    # Active users
    active_result = await db.execute(
        select(func.count(User.id)).where(User.is_active == True)
    )
    active_users = active_result.scalar() or 0
    
    # Pending approvals
    pending_result = await db.execute(
        select(func.count(User.id)).where(
            or_(
                User.verification_status == VerificationStatus.PENDING,
                User.verification_status == VerificationStatus.RESUBMITTED
            )
        )
    )
    pending_approvals = pending_result.scalar() or 0
    
    # Blocked users
    blocked_result = await db.execute(
        select(func.count(User.id)).where(User.is_blocked == True)
    )
    blocked_users = blocked_result.scalar() or 0
    
    # Total techies (users with techie role)
    techie_result = await db.execute(
        select(func.count(User.id))
        .join(User.roles)
        .where(UserRole.role_type == RoleType.TECHIE)
    )
    total_techies = techie_result.scalar() or 0
    
    # Total companies (from companies table)
    try:
        from app.models.company import Company
        company_result = await db.execute(select(func.count(Company.id)))
        total_companies = company_result.scalar() or 0
    except Exception:
        total_companies = 0
    
    # New users today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    new_today_result = await db.execute(
        select(func.count(User.id)).where(User.created_at >= today_start)
    )
    new_users_today = new_today_result.scalar() or 0
    
    # New users this week
    week_start = today_start - timedelta(days=today_start.weekday())
    new_week_result = await db.execute(
        select(func.count(User.id)).where(User.created_at >= week_start)
    )
    new_users_this_week = new_week_result.scalar() or 0
    
    return AdminStatsResponse(
        total_users=total_users,
        active_users=active_users,
        pending_approvals=pending_approvals,
        blocked_users=blocked_users,
        total_techies=total_techies,
        total_companies=total_companies,
        new_users_today=new_users_today,
        new_users_this_week=new_users_this_week
    )


# ============= Full User Profile for Admin Review =============

class ExperienceDetail(BaseModel):
    """Experience details for admin review."""
    id: str
    title: str
    company_name: str
    client_name: Optional[str] = None
    company_website: Optional[str] = None
    manager_name: Optional[str] = None
    manager_email: Optional[str] = None
    manager_phone: Optional[str] = None
    manager_linkedin: Optional[str] = None
    employment_type: Optional[str] = None
    location: Optional[str] = None
    is_remote: bool = False
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    description: Optional[str] = None
    skills: Optional[List[str]] = []
    is_verified: bool = False


class EducationDetail(BaseModel):
    """Education details for admin review."""
    id: str
    school_name: str
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    grade: Optional[str] = None
    score_type: Optional[str] = None
    score_value: Optional[str] = None
    activities: Optional[str] = None
    description: Optional[str] = None
    is_verified: bool = False


class ProfileDetail(BaseModel):
    """User profile details for admin review."""
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    avatar_url: Optional[str] = None
    cover_url: Optional[str] = None
    skills: Optional[List[str]] = []
    experience_years: Optional[int] = 0
    current_position: Optional[str] = None
    current_company: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    open_to_work: bool = False


class InstitutionInviteRequestDetail(BaseModel):
    """Institution invite request for admin review."""
    id: str
    institution_name: str
    status: str
    created_at: Optional[str] = None


class UserFullProfile(BaseModel):
    """Complete user profile for admin review."""
    # Basic Info
    id: str
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
    gov_id_last_four: Optional[str] = None  # Last 4 of PAN (India) or SSN (USA) — safe to show in UI
    
    # Status
    is_active: bool = True
    is_verified: bool = False
    is_superuser: bool = False
    email_verified: bool = False
    mobile_verified: bool = False
    face_verification: Optional[List[str]] = None
    verification_status: Optional[str] = None
    
    # Review Info
    reviewed_at: Optional[str] = None
    reviewed_by: Optional[str] = None
    rejection_reason: Optional[str] = None
    admin_notes: Optional[str] = None
    
    # Timestamps
    created_at: Optional[str] = None
    last_login: Optional[str] = None
    
    # Related Data
    profile: Optional[ProfileDetail] = None
    organization: Optional[dict] = None
    experiences: List[ExperienceDetail] = []
    educations: List[EducationDetail] = []
    institution_invite_requests: List[InstitutionInviteRequestDetail] = []
    roles: List[str] = []

    @field_validator("face_verification", mode="before")
    @classmethod
    def normalize_face_verification(cls, value: Any) -> Optional[List[str]]:
        """Normalize legacy face_verification JSON-string data to list[str]."""
        if value is None:
            return None
        if isinstance(value, str):
            try:
                value = json.loads(value)
            except json.JSONDecodeError:
                return None
        if isinstance(value, list):
            return [item for item in value if isinstance(item, str)]
        return None


@router.get("/users/{user_id}/full-profile")
async def get_user_full_profile(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> UserFullProfile:
    """Get complete user profile for admin review including all details."""
    
    # Fetch user with all related data
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
    
    # Get reviewer info if exists
    reviewed_by_name = None
    if user.reviewed_by_id:
        reviewer_result = await db.execute(
            select(User.first_name, User.last_name, User.email)
            .where(User.id == user.reviewed_by_id)
        )
        reviewer = reviewer_result.first()
        if reviewer:
            reviewed_by_name = f"{reviewer.first_name or ''} {reviewer.last_name or ''}".strip() or reviewer.email
    
    # Build profile details
    profile_detail = None
    if user.profile:
        profile_detail = ProfileDetail(
            headline=user.profile.headline,
            bio=user.profile.bio,
            location=user.profile.location,
            website=user.profile.website,
            avatar_url=user.profile.avatar_url,
            cover_url=user.profile.cover_url,
            skills=user.profile.skills or [],
            experience_years=user.profile.experience_years or 0,
            current_position=user.profile.current_position,
            current_company=user.profile.current_company,
            linkedin_url=user.profile.linkedin_url,
            github_url=user.profile.github_url,
            twitter_url=user.profile.twitter_url,
            portfolio_url=user.profile.portfolio_url,
            open_to_work=user.profile.open_to_work or False
        )
    
    # Build experience list
    experiences = []
    for exp in (user.experiences or []):
        experiences.append(ExperienceDetail(
            id=str(exp.id),
            title=exp.title,
            company_name=exp.company_name,
            client_name=exp.client_name,
            company_website=exp.company_website,
            manager_name=exp.manager_name,
            manager_email=exp.manager_email,
            manager_phone=exp.manager_phone,
            manager_linkedin=exp.manager_linkedin,
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
    
    # Build education list
    educations = []
    for edu in (user.educations or []):
        educations.append(EducationDetail(
            id=str(edu.id),
            school_name=edu.school_name,
            degree=edu.degree,
            field_of_study=edu.field_of_study,
            start_year=edu.start_year,
            end_year=edu.end_year,
            grade=edu.grade,
            score_type=edu.score_type,
            score_value=edu.score_value,
            activities=edu.activities,
            description=edu.description,
            is_verified=edu.is_verified or False
        ))
    
    # Build roles list
    roles = [role.role_type.value for role in (user.roles or [])]

    # Build institution invite requests (invites requested by this user)
    institution_invites = []
    inv_result = await db.execute(
        select(InstitutionInviteRequest)
        .where(InstitutionInviteRequest.requested_by_id == user.id)
        .order_by(InstitutionInviteRequest.created_at.desc())
    )
    for inv in inv_result.scalars().all():
        status_str = getattr(inv.status, "value", inv.status) if inv.status else "pending"
        institution_invites.append(InstitutionInviteRequestDetail(
            id=str(inv.id),
            institution_name=inv.institution_name or "",
            status=status_str,
            created_at=str(inv.created_at) if inv.created_at else None,
        ))

    # For India: do not expose full PAN; only last 4 is returned in gov_id_last_four
    gov_id_value = user.gov_id
    if user.country and str(user.country).lower() in ("india", "in"):
        gov_id_value = None  # Never send full PAN to frontend

    # Ensure last 4 is available for display: use gov_id_last_four, or derive from gov_id if stored
    effective_last_four = user.gov_id_last_four
    if not effective_last_four and user.gov_id:
        raw = (user.gov_id or "").strip()
        effective_last_four = raw[-4:].upper() if len(raw) >= 4 else (raw.upper().ljust(4, "0") if raw else None)

    # Build organization details for HR/Company/School accounts
    organization = None
    role_set = set(roles)
    if RoleType.HIRING_MANAGER.value in role_set or RoleType.COMPANY_ADMIN.value in role_set:
        company_result = await db.execute(
            select(CompanyAdmin, Company)
            .join(Company, Company.id == CompanyAdmin.company_id)
            .where(CompanyAdmin.user_id == user.id)
            .order_by(CompanyAdmin.added_at.desc())
            .limit(1)
        )
        company_link = company_result.first()
        if company_link:
            company_admin, company = company_link
            organization = {
                "type": "company",
                "name": company.name,
                "email": company.email,
                "website": company.website,
                "role": company_admin.role,
                "description": company.description,
                "verified": user.hr_company_verified_at is not None,
            }
    elif RoleType.SCHOOL_ADMIN.value in role_set:
        school_result = await db.execute(
            select(SchoolAdmin, School)
            .join(School, School.id == SchoolAdmin.school_id)
            .where(SchoolAdmin.user_id == user.id)
            .order_by(SchoolAdmin.added_at.desc())
            .limit(1)
        )
        school_link = school_result.first()
        if school_link:
            school_admin, school = school_link
            organization = {
                "type": "school",
                "name": school.name,
                "email": school.email,
                "website": school.website,
                "role": school_admin.role.value if hasattr(school_admin.role, "value") else str(school_admin.role),
                "description": school.description,
                "verified": user.hr_company_verified_at is not None,
            }
    
    return UserFullProfile(
        id=str(user.id),
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
        gov_id=gov_id_value,
        gov_id_last_four=effective_last_four or user.gov_id_last_four,
        is_active=user.is_active,
        is_verified=user.is_verified,
        is_superuser=user.is_superuser,
        email_verified=user.email_verified,
        mobile_verified=user.mobile_verified or False,
        face_verification=user.face_verification,
        verification_status=user.verification_status or None,
        reviewed_at=str(user.reviewed_at) if user.reviewed_at else None,
        reviewed_by=reviewed_by_name,
        rejection_reason=user.rejection_reason,
        admin_notes=user.admin_notes,
        created_at=str(user.created_at) if user.created_at else None,
        last_login=str(user.last_login) if user.last_login else None,
        profile=profile_detail,
        organization=organization,
        experiences=experiences,
        educations=educations,
        institution_invite_requests=institution_invites,
        roles=roles
    )


class EducationVerifyRequest(BaseModel):
    """Request body for updating education verification status."""
    is_verified: bool = True


@router.patch("/users/{user_id}/educations/{education_id}/verify")
async def update_education_verify(
    user_id: UUID,
    education_id: UUID,
    body: EducationVerifyRequest,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """Update education verification status (admin only)."""
    edu_result = await db.execute(
        select(Education).where(
            Education.id == education_id,
            Education.user_id == user_id
        )
    )
    education = edu_result.scalar_one_or_none()
    if not education:
        raise HTTPException(status_code=404, detail="Education record not found")
    education.is_verified = body.is_verified
    if body.is_verified:
        education.verified_by_id = current_admin.id
        education.verified_at = datetime.utcnow()
    else:
        education.verified_by_id = None
        education.verified_at = None
    await db.commit()
    return {"success": True, "message": "Education verification updated", "is_verified": education.is_verified}


class ExperienceVerifyRequest(BaseModel):
    """Request body for updating experience verification status."""
    is_verified: bool = True


@router.patch("/users/{user_id}/experiences/{experience_id}/verify")
async def update_experience_verify(
    user_id: UUID,
    experience_id: UUID,
    body: ExperienceVerifyRequest,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """Update work experience verification status (admin only)."""
    exp_result = await db.execute(
        select(Experience).where(
            Experience.id == experience_id,
            Experience.user_id == user_id
        )
    )
    experience = exp_result.scalar_one_or_none()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience record not found")
    experience.is_verified = body.is_verified
    if body.is_verified:
        experience.verified_by_id = current_admin.id
        experience.verified_at = datetime.utcnow()
    else:
        experience.verified_by_id = None
        experience.verified_at = None
    await db.commit()
    return {"success": True, "message": "Experience verification updated", "is_verified": experience.is_verified}


class VerifyOrganizationRequest(BaseModel):
    """Request body for marking HR/company as verified by admin."""
    verified: bool = True


@router.patch("/users/{user_id}/verify-organization")
async def update_verify_organization(
    user_id: UUID,
    body: VerifyOrganizationRequest,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """Set or clear HR company verified flag (admin only). Once set, admin can Approve/Reject the profile."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if body.verified:
        user.hr_company_verified_at = datetime.utcnow()
    else:
        user.hr_company_verified_at = None
    await db.commit()
    return {"success": True, "message": "Organization verification updated", "verified": body.verified}


@router.patch("/users/{user_id}/admin-notes")
async def update_admin_notes(
    user_id: UUID,
    notes_data: dict,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """Update admin notes for a user."""
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.admin_notes = notes_data.get("notes", "")
    await db.commit()
    
    return {"success": True, "message": "Admin notes updated"}


class UpdateAdminRolesRequest(BaseModel):
    """Request body for updating a user's admin roles."""
    admin_roles: List[str] = []


@router.patch("/users/{user_id}/update-admin-roles/", status_code=status.HTTP_200_OK)
@router.post("/users/{user_id}/update-admin-roles/", status_code=status.HTTP_200_OK)
async def update_admin_roles(
    user_id: UUID,
    body: UpdateAdminRolesRequest,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """Update admin roles for a user. Super admin only or self."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    roles = body.admin_roles or []
    if len(roles) > 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Only one admin role can be assigned per user"
        )
    user.admin_roles = roles
    user.is_superuser = "superadmin" in [r.lower() for r in roles if r]
    await db.commit()
    return {"success": True, "message": "Admin roles updated", "admin_roles": user.admin_roles}


# ============= Admin Users Listing =============

class AdminUserResponse(BaseModel):
    """Response schema for admin user listing."""
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    full_name: str
    admin_roles: List[str] = []
    is_active: bool = True
    is_blocked: bool = False
    is_staff: bool = True
    is_superuser: bool = False
    date_joined: Optional[str] = None
    last_login: Optional[str] = None
    created_at: Optional[str] = None


@router.get("/admins/", response_model=List[AdminUserResponse])
async def list_admin_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """List all admin users (users with admin_roles or is_superuser=True)."""
    
    # Query users who have non-empty admin_roles OR are superusers
    result = await db.execute(
        select(User)
        .where(
            or_(
                User.is_superuser == True,
                User.admin_roles != None,
            )
        )
        .order_by(User.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    users = result.scalars().all()
    
    # Filter out users with empty admin_roles if not superuser
    admin_users = []
    for user in users:
        if user.is_superuser or (user.admin_roles and len(user.admin_roles) > 0):
            full_name = f"{user.first_name or ''} {user.last_name or ''}".strip() or user.email
            admin_users.append(AdminUserResponse(
                id=str(user.id),
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                full_name=full_name,
                admin_roles=user.admin_roles or [],
                is_active=user.is_active,
                is_blocked=user.is_blocked or False,
                is_staff=True,  # All admins are staff
                is_superuser=user.is_superuser,
                date_joined=user.created_at.isoformat() if user.created_at else None,
                last_login=user.last_login.isoformat() if user.last_login else None,
                created_at=user.created_at.isoformat() if user.created_at else None,
            ))
    
    return admin_users
