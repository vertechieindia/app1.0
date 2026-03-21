"""
Access roles (UserRole): stable permission signatures, display labels, internal names.

Used by admin /groups API, signup get-or-create, and migrations.
"""

from __future__ import annotations

import hashlib
import json
import uuid
from typing import Any, List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.permissions_catalog import PERMISSION_DEFINITIONS
from app.models.user import RoleType, UserRole

# Short labels for display (Admin Type in UI)
ROLE_TYPE_SHORT_LABEL: dict[RoleType, str] = {
    RoleType.SUPER_ADMIN: "Super Admin",
    RoleType.COMPANY_ADMIN: "Company Admin",
    RoleType.SCHOOL_ADMIN: "School Admin",
    RoleType.HIRING_MANAGER: "Hiring Manager",
    RoleType.TECHIE: "Techie",
    RoleType.BDM_ADMIN: "BDM",
}


def sorted_unique_permission_codes(codes: Optional[List[Any]]) -> List[str]:
    """Dedupe and sort for canonical storage and hashing."""
    if not codes:
        return []
    out: List[str] = []
    seen = set()
    for raw in codes:
        c = str(raw).strip()
        if not c or c in seen:
            continue
        seen.add(c)
        out.append(c)
    out.sort()
    return out


def compute_permission_signature(codes: Optional[List[Any]]) -> str:
    """SHA-256 of canonical JSON array of sorted unique permission codenames."""
    canonical = json.dumps(sorted_unique_permission_codes(codes), separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def build_display_label(role_type: RoleType, codes: Optional[List[Any]]) -> str:
    """
    Short title for admin type only (no per-count 'Custom' wording — details go to permission_summary).
    """
    base = ROLE_TYPE_SHORT_LABEL.get(
        role_type, role_type.value.replace("_", " ").title()
    )
    sc = sorted_unique_permission_codes(codes)
    n = len(sc)
    if n == 0:
        return f"{base} · Default"
    # Heuristic: full catalog size is ~22 non-deprecated; treat large sets as full
    if n >= 18:
        return f"{base} · Full access"
    return base


# Granular CRUD bundles → one short UI label (avoid listing View/Edit/Delete/… separately)
_USER_CRUD: frozenset[str] = frozenset(
    {"view_users", "edit_users", "delete_users", "block_users"}
)
_COMPANY_CRUD: frozenset[str] = frozenset(
    {"view_companies", "create_companies", "edit_companies", "delete_companies"}
)
_SCHOOL_CRUD: frozenset[str] = frozenset(
    {"view_schools", "create_schools", "edit_schools", "delete_schools"}
)
_JOB_CRUD: frozenset[str] = frozenset(
    {"view_jobs", "create_jobs", "edit_jobs", "delete_jobs"}
)

# Display order for collapsed bundle labels (then remaining names follow sorted)
_BUNDLE_ORDER: List[str] = [
    "Manage Users",
    "Manage Companies",
    "Manage Schools",
    "Manage Jobs",
]


def _collapse_permission_codes_for_summary(codes: List[str]) -> List[str]:
    """
    Replace granular CRUD groups with 'Manage Users' / 'Manage Companies' / etc.
    Legacy manage_* implies the matching bundle and is shown as the same short label.
    """
    remaining: set[str] = set(codes)
    collapsed: List[str] = []

    def take_bundle(crud: frozenset[str], label: str) -> None:
        nonlocal remaining
        if remaining & crud:
            remaining -= crud
            if label not in collapsed:
                collapsed.append(label)

    # Legacy coarse codes: treat as full domain bundle for display
    if "manage_companies" in remaining:
        remaining.discard("manage_companies")
        if "Manage Companies" not in collapsed:
            collapsed.append("Manage Companies")
        remaining -= _COMPANY_CRUD
    if "manage_schools" in remaining:
        remaining.discard("manage_schools")
        if "Manage Schools" not in collapsed:
            collapsed.append("Manage Schools")
        remaining -= _SCHOOL_CRUD
    if "manage_jobs" in remaining:
        remaining.discard("manage_jobs")
        if "Manage Jobs" not in collapsed:
            collapsed.append("Manage Jobs")
        remaining -= _JOB_CRUD

    take_bundle(_USER_CRUD, "Manage Users")
    take_bundle(_COMPANY_CRUD, "Manage Companies")
    take_bundle(_SCHOOL_CRUD, "Manage Schools")
    take_bundle(_JOB_CRUD, "Manage Jobs")

    by_code = {p.codename: p.name for p in PERMISSION_DEFINITIONS}
    rest_names: List[str] = []
    for c in sorted(remaining):
        rest_names.append(by_code.get(c, c.replace("_", " ").title()))

    # Order: bundles in fixed order, then remaining alphabetically by display name
    ordered_bundles = [b for b in _BUNDLE_ORDER if b in collapsed]
    return ordered_bundles + rest_names


def build_permission_summary(
    codes: Optional[List[Any]],
    *,
    max_labels: int = 12,
    max_chars: int = 320,
) -> str:
    """
    Human-readable subtitle: collapsed domain bundles + other permission names.
    Unknown codes fall back to title-cased codename.
    """
    sc = sorted_unique_permission_codes(codes)
    if not sc:
        return "No permissions assigned"

    labels = _collapse_permission_codes_for_summary(sc)

    shown = labels[:max_labels]
    rest = len(labels) - len(shown)
    text = " · ".join(shown)
    if rest > 0:
        text = f"{text} (+{rest} more)"
    if len(text) > max_chars:
        text = text[: max_chars - 1].rstrip() + "…"
    return text


def generate_internal_name() -> str:
    """Opaque unique slug for UserRole.name (DB uniqueness). Max length 40."""
    return f"ur_{uuid.uuid4().hex}"


async def get_or_create_empty_permission_role(
    db: AsyncSession,
    role_type: RoleType,
    description: Optional[str] = None,
) -> UserRole:
    """
    Default platform role for signup / legacy admin flows: one row per role_type
    with empty permissions (distinct from Access Roles with fine-grained perms).
    """
    sig = compute_permission_signature([])
    result = await db.execute(
        select(UserRole).where(
            UserRole.role_type == role_type,
            UserRole.permission_signature == sig,
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        return existing

    role = UserRole(
        name=generate_internal_name(),
        role_type=role_type,
        description=description or f"{role_type.value} user role",
        permissions=[],
        display_label=build_display_label(role_type, []),
        permission_signature=sig,
        is_active=True,
    )
    db.add(role)
    await db.flush()
    return role
