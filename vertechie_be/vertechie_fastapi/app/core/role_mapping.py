"""
Maps UserRole / RoleType to user.admin_roles strings (Option 1 single source of truth).
"""

from __future__ import annotations

from typing import List, Optional, Set

from app.core.permissions_catalog import non_deprecated_codenames
from app.models.user import RoleType, UserRole

# Staff admin panel: these RoleType values can be assigned via UserRole (Access Roles).
ASSIGNABLE_ADMIN_ROLE_TYPES: Set[RoleType] = {
    RoleType.SUPER_ADMIN,
    RoleType.COMPANY_ADMIN,
    RoleType.SCHOOL_ADMIN,
    RoleType.HIRING_MANAGER,
    RoleType.TECHIE,
    RoleType.BDM_ADMIN,
    RoleType.LEARN_ADMIN,
}


def role_type_to_admin_role_code(role_type: RoleType) -> str:
    """Map DB RoleType to the string stored in users.admin_roles."""
    mapping = {
        RoleType.SUPER_ADMIN: "superadmin",
        RoleType.COMPANY_ADMIN: "company_admin",
        RoleType.SCHOOL_ADMIN: "school_admin",
        RoleType.HIRING_MANAGER: "hm_admin",
        RoleType.TECHIE: "techie_admin",
        RoleType.BDM_ADMIN: "bdm_admin",
        RoleType.LEARN_ADMIN: "learn_admin",
    }
    if role_type not in mapping:
        raise ValueError(f"Unsupported RoleType for admin mapping: {role_type}")
    return mapping[role_type]


def admin_role_code_from_user_role(user_role: UserRole) -> str:
    return role_type_to_admin_role_code(user_role.role_type)


def admin_role_code_to_role_type(code: str) -> Optional[RoleType]:
    """Reverse map: users.admin_roles string → RoleType (staff panel)."""
    if not code:
        return None
    key = str(code).lower().strip()
    mapping = {
        "superadmin": RoleType.SUPER_ADMIN,
        "company_admin": RoleType.COMPANY_ADMIN,
        "school_admin": RoleType.SCHOOL_ADMIN,
        "hm_admin": RoleType.HIRING_MANAGER,
        "techie_admin": RoleType.TECHIE,
        "bdm_admin": RoleType.BDM_ADMIN,
        "learn_admin": RoleType.LEARN_ADMIN,
    }
    return mapping.get(key)


def is_assignable_admin_user_role(user_role: UserRole) -> bool:
    if not user_role.is_active:
        return False
    return user_role.role_type in ASSIGNABLE_ADMIN_ROLE_TYPES


# Full fine-grained set (no legacy manage_*)
ALL_ADMIN_PERMISSIONS: List[str] = list(non_deprecated_codenames())


def default_permissions_for_role_type(role_type: RoleType) -> List[str]:
    """Baseline fine-grained permissions for seeded UserRole rows."""
    if role_type == RoleType.SUPER_ADMIN:
        return list(ALL_ADMIN_PERMISSIONS)

    base = [
        "view_users",
        "edit_users",
        "block_users",
        "verify_profiles",
        "view_reports",
    ]
    if role_type == RoleType.TECHIE:
        return base + ["delete_users"]
    if role_type == RoleType.HIRING_MANAGER:
        return base + ["view_jobs", "create_jobs", "edit_jobs", "delete_jobs"]
    if role_type == RoleType.COMPANY_ADMIN:
        return base + [
            "view_companies",
            "create_companies",
            "edit_companies",
            "delete_companies",
            "view_jobs",
            "create_jobs",
            "edit_jobs",
            "delete_jobs",
        ]
    if role_type == RoleType.SCHOOL_ADMIN:
        return base + [
            "view_schools",
            "create_schools",
            "edit_schools",
            "delete_schools",
        ]
    if role_type == RoleType.BDM_ADMIN:
        return base + [
            "view_companies",
            "create_companies",
            "edit_companies",
            "delete_companies",
        ]
    if role_type == RoleType.LEARN_ADMIN:
        return [
            "manage_learning_content",
            "view_reports",
        ]
    return base
