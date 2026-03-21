"""
Central catalog of platform admin permissions (fine-grained RBAC).

IDs 1–10 are preserved for backward compatibility with older clients:
6/7/8 remain legacy manage_* (coarse). Granular company/school/job permissions use 11+.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, FrozenSet, List, Set


@dataclass(frozen=True)
class PermissionDef:
    id: str
    name: str
    codename: str
    description: str
    deprecated: bool = False


PERMISSION_DEFINITIONS: List[PermissionDef] = [
    # 1–5 Users (unchanged)
    PermissionDef("1", "View Users", "view_users", "View user directory and profiles"),
    PermissionDef("2", "Edit Users", "edit_users", "Edit user account and profile fields"),
    PermissionDef("3", "Delete Users", "delete_users", "Permanently delete user accounts"),
    PermissionDef("4", "Block Users", "block_users", "Block or unblock users"),
    PermissionDef("5", "Verify Profiles", "verify_profiles", "Approve or reject profile verification"),
    # 6–8 Legacy coarse (deprecated — implies full CRUD for domain)
    PermissionDef(
        "6",
        "Manage Companies (legacy)",
        "manage_companies",
        "Legacy: all company actions — prefer granular permissions below",
        deprecated=True,
    ),
    PermissionDef(
        "7",
        "Manage Schools (legacy)",
        "manage_schools",
        "Legacy: all school actions — prefer granular permissions below",
        deprecated=True,
    ),
    PermissionDef(
        "8",
        "Manage Jobs (legacy)",
        "manage_jobs",
        "Legacy: all job actions — prefer granular permissions below",
        deprecated=True,
    ),
    PermissionDef("9", "View Reports", "view_reports", "View analytics and dashboards"),
    PermissionDef("10", "System Settings", "system_settings", "Change platform-wide settings"),
    # 11+ Fine-grained Companies
    PermissionDef("11", "View Companies", "view_companies", "View company records and listings"),
    PermissionDef("12", "Create Companies", "create_companies", "Create new company accounts"),
    PermissionDef("13", "Edit Companies", "edit_companies", "Edit company details and settings"),
    PermissionDef("14", "Delete Companies", "delete_companies", "Remove or deactivate companies"),
    # Schools
    PermissionDef("15", "View Schools", "view_schools", "View school / institution records"),
    PermissionDef("16", "Create Schools", "create_schools", "Create new school accounts"),
    PermissionDef("17", "Edit Schools", "edit_schools", "Edit school details"),
    PermissionDef("18", "Delete Schools", "delete_schools", "Remove or deactivate schools"),
    # Jobs
    PermissionDef("19", "View Jobs", "view_jobs", "View job postings (admin scope)"),
    PermissionDef("20", "Create Jobs", "create_jobs", "Create job postings on behalf of companies"),
    PermissionDef("21", "Edit Jobs", "edit_jobs", "Edit job postings"),
    PermissionDef("22", "Delete Jobs", "delete_jobs", "Delete or close job postings"),
]


def all_codenames() -> List[str]:
    return [p.codename for p in PERMISSION_DEFINITIONS]


def non_deprecated_codenames() -> List[str]:
    return [p.codename for p in PERMISSION_DEFINITIONS if not p.deprecated]


def codename_to_id() -> Dict[str, str]:
    return {p.codename: p.id for p in PERMISSION_DEFINITIONS}


def id_to_codename() -> Dict[str, str]:
    return {p.id: p.codename for p in PERMISSION_DEFINITIONS}


LEGACY_MANAGE_EXPANSION: Dict[str, FrozenSet[str]] = {
    "manage_companies": frozenset(
        {"view_companies", "create_companies", "edit_companies", "delete_companies"}
    ),
    "manage_schools": frozenset(
        {"view_schools", "create_schools", "edit_schools", "delete_schools"}
    ),
    "manage_jobs": frozenset(
        {"view_jobs", "create_jobs", "edit_jobs", "delete_jobs"}
    ),
}


def expand_legacy_in_set(codes: Set[str]) -> Set[str]:
    out = set(codes)
    for legacy, children in LEGACY_MANAGE_EXPANSION.items():
        if legacy in out:
            out |= children
    return out
