"""
Admin Dashboard API endpoints.
Provides endpoints for admin panel functionality.
"""

import logging
import traceback
from datetime import datetime, timedelta
from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import select, func, and_, or_, cast, String, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User, UserRole, RoleType, VerificationStatus, UserProfile, Experience, Education
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
    verification_status: str
    created_at: Optional[datetime] = None
    # Fields expected by frontend
    user_type: str = "techie"
    user_full_name: Optional[str] = None
    user_email: Optional[str] = None
    status: str = "pending"


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
        
        # Get permissions from the role's JSON field or use empty list
        role_permissions = []
        if role.permissions:
            # If permissions are stored as list of codenames/ids, map them to PermissionResponse
            for i, perm in enumerate(role.permissions):
                if isinstance(perm, str):
                    role_permissions.append(PermissionResponse(
                        id=str(i + 1),
                        name=perm.replace('_', ' ').title(),
                        codename=perm,
                        description=None
                    ))
                elif isinstance(perm, dict):
                    role_permissions.append(PermissionResponse(
                        id=str(perm.get('id', i + 1)),
                        name=perm.get('name', ''),
                        codename=perm.get('codename', ''),
                        description=perm.get('description')
                    ))
        
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


@router.get("/permissions/", response_model=List[PermissionResponse])
async def list_permissions(
    current_admin: User = Depends(get_current_admin_user)
) -> Any:
    """List all available permissions."""
    
    # Static permissions list based on admin roles
    permissions = [
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
    
    return permissions


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


@router.get("/pending-approvals/", response_model=List[PendingApprovalResponse])
async def list_pending_approvals(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    user_type: Optional[str] = Query(None),
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
        logger.info(f"[PENDING_APPROVALS] Starting request - user_type={user_type}, status={status}, status_filter={status_filter}, skip={skip}, limit={limit}")
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
        
        # Filter by status: "all" or empty = no filter (return all statuses); otherwise filter by that status
        if filter_status and filter_status != "all":
            if filter_status in status_map:
                status_enum = status_map[filter_status]
                query = query.where(User.verification_status == status_enum.value)
                logger.info(f"[PENDING_APPROVALS] Filtering by status: {filter_status}")
            else:
                # Invalid status, show all
                logger.info(f"[PENDING_APPROVALS] Invalid status '{filter_status}', showing all statuses")
        else:
            logger.info(f"[PENDING_APPROVALS] Showing all statuses (all/empty)")
        
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
                result_list.append(
                    PendingApprovalResponse(
                        id=user.id,
                        email=str(user.email) if user.email else "",
                        first_name=user.first_name,
                        last_name=user.last_name,
                        country=user.country,
                        verification_status=verification_status_str,
                        created_at=user.created_at,
                        # Frontend expected fields
                        user_type=role_to_user_type_map.get(user_role_type, "techie"),
                        user_full_name=f"{user.first_name or ''} {user.last_name or ''}".strip() or (user.email or ""),
                        user_email=user.email or "",
                        status=verification_status_str.lower()
                    )
                )
            except Exception as e:
                logger.error(f"[PENDING_APPROVALS] Error creating response for user {user.id}: {e}")
                logger.error(f"[PENDING_APPROVALS] Traceback: {traceback.format_exc()}")
                continue
        
        logger.info(f"[PENDING_APPROVALS] Returning {len(result_list)} approvals")
        return result_list
        
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
    
    # Update verification status
    user.verification_status = VerificationStatus.APPROVED
    user.is_verified = True
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
    
    # Status
    is_active: bool = True
    is_verified: bool = False
    is_superuser: bool = False
    email_verified: bool = False
    mobile_verified: bool = False
    face_verification: Optional[bool] = None
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
    experiences: List[ExperienceDetail] = []
    educations: List[EducationDetail] = []
    roles: List[str] = []


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
            activities=edu.activities,
            description=edu.description,
            is_verified=edu.is_verified or False
        ))
    
    # Build roles list
    roles = [role.role_type.value for role in (user.roles or [])]
    
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
        gov_id=user.gov_id,
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
        experiences=experiences,
        educations=educations,
        roles=roles
    )


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
                is_staff=True,  # All admins are staff
                is_superuser=user.is_superuser,
                date_joined=user.created_at.isoformat() if user.created_at else None,
                last_login=user.last_login.isoformat() if user.last_login else None,
                created_at=user.created_at.isoformat() if user.created_at else None,
            ))
    
    return admin_users
