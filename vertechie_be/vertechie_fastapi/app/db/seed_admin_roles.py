"""Ensure default UserRole rows exist for Super Admin panel (Option 1)."""

from __future__ import annotations

import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.access_role_utils import (
    build_display_label,
    compute_permission_signature,
    generate_internal_name,
    sorted_unique_permission_codes,
)
from app.core.role_mapping import default_permissions_for_role_type
from app.models.user import RoleType, UserRole

logger = logging.getLogger(__name__)

DEFAULT_ADMIN_ROLE_SEEDS: list[tuple[str, RoleType, str]] = [
    ("Super Admin", RoleType.SUPER_ADMIN, "Full platform access"),
    ("Techie Admin", RoleType.TECHIE, "Manage tech professional registrations and approvals"),
    ("HM Admin", RoleType.HIRING_MANAGER, "Manage hiring manager registrations"),
    ("Company Admin", RoleType.COMPANY_ADMIN, "Manage company registrations"),
    ("School Admin", RoleType.SCHOOL_ADMIN, "Manage school / institution registrations"),
    ("BDM Admin", RoleType.BDM_ADMIN, "Manage company invitations and outreach"),
]


async def ensure_default_admin_roles(db: AsyncSession) -> None:
    """Insert default admin UserRole rows if missing (by role_type + permission signature)."""
    for _legacy_name, role_type, description in DEFAULT_ADMIN_ROLE_SEEDS:
        perms = sorted_unique_permission_codes(default_permissions_for_role_type(role_type))
        sig = compute_permission_signature(perms)
        result = await db.execute(
            select(UserRole.id).where(
                UserRole.role_type == role_type,
                UserRole.permission_signature == sig,
            )
        )
        if result.scalar_one_or_none():
            continue
        row = UserRole(
            name=generate_internal_name(),
            role_type=role_type,
            description=description,
            permissions=perms,
            permission_signature=sig,
            display_label=build_display_label(role_type, perms),
            is_active=True,
        )
        db.add(row)
        logger.info("Seeded default UserRole: %s (%s)", row.display_label, role_type.value)
    await db.commit()
