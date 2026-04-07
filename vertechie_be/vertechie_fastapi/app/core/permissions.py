"""
Resolve effective permission codes for a user and check fine-grained access.

Legacy manage_* codes imply the corresponding granular CRUD set.
"""

from __future__ import annotations

from typing import Set

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.permissions_catalog import (
    LEGACY_MANAGE_EXPANSION,
    all_codenames,
    expand_legacy_in_set,
)
from app.models.user import RoleType, User


def user_has_permission(effective_codes: Set[str], required: str) -> bool:
    """True if required is granted directly or via legacy manage_*."""
    if required in effective_codes:
        return True
    for legacy, children in LEGACY_MANAGE_EXPANSION.items():
        if legacy in effective_codes and required in children:
            return True
    return False


def user_has_any_permission(effective_codes: Set[str], required: Set[str]) -> bool:
    return any(user_has_permission(effective_codes, r) for r in required)


def _admin_role_codes_to_role_type(admin_code: str) -> RoleType | None:
    m = {
        "superadmin": RoleType.SUPER_ADMIN,
        "company_admin": RoleType.COMPANY_ADMIN,
        "school_admin": RoleType.SCHOOL_ADMIN,
        "hm_admin": RoleType.HIRING_MANAGER,
        "techie_admin": RoleType.TECHIE,
        "bdm_admin": RoleType.BDM_ADMIN,
        "learn_admin": RoleType.LEARN_ADMIN,
    }
    return m.get((admin_code or "").lower().strip())


async def collect_effective_permission_codes(db: AsyncSession, user: User) -> Set[str]:
    """
    Union of permission strings from all UserRoles assigned to the user.
    Superusers get the full catalog. Legacy manage_* codes are expanded for UI.
    """
    if user.is_superuser:
        return set(all_codenames())

    result = await db.execute(
        select(User).where(User.id == user.id).options(selectinload(User.roles))
    )
    u = result.scalar_one_or_none()
    if not u:
        return set()

    codes: Set[str] = set()
    for role in u.roles or []:
        if role.permissions:
            for raw in role.permissions:
                if raw:
                    codes.add(str(raw).strip())

    # Fallback: staff with admin_roles but empty UserRole.permissions (older data)
    if not codes and u.admin_roles:
        from app.core.role_mapping import default_permissions_for_role_type

        ac = u.admin_roles[0] if isinstance(u.admin_roles, list) and u.admin_roles else None
        rt = _admin_role_codes_to_role_type(str(ac)) if ac else None
        if rt is not None:
            codes = set(default_permissions_for_role_type(rt))

    return expand_legacy_in_set(codes)
