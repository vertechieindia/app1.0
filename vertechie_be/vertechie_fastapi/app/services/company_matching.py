"""
Normalized company name matching for affiliations (signup, experience, listings).
"""
from __future__ import annotations

import re
from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.company import Company
from app.models.user import Experience


def normalize_company_name(name: Optional[str]) -> str:
    """Trim, collapse internal whitespace, lowercase — for exact equality checks."""
    if not name:
        return ""
    s = str(name).strip()
    s = re.sub(r"\s+", " ", s)
    return s.lower()


async def link_experiences_to_company_by_normalized_name(
    db: AsyncSession, company_id: UUID, company_name: Optional[str]
) -> int:
    """
    After a Company row is created (e.g. BDM provisioning), attach past experiences
    that only had free-text company_name matching this company's name.
    """
    target = normalize_company_name(company_name)
    if not target:
        return 0

    result = await db.execute(
        select(Experience).where(Experience.company_id.is_(None))
    )
    n = 0
    for exp in result.scalars().all():
        if normalize_company_name(exp.company_name) == target:
            exp.company_id = company_id
            n += 1
    return n


async def find_company_id_by_normalized_name(
    db: AsyncSession, raw_name: Optional[str]
) -> Optional[UUID]:
    """
    Match an existing company row by normalized name (case-insensitive, trimmed, spaces collapsed).
    Loads company id + name and compares in Python for consistency with stored strings.
    """
    target = normalize_company_name(raw_name)
    if not target:
        return None

    result = await db.execute(select(Company.id, Company.name))
    for cid, cname in result.all():
        if normalize_company_name(cname) == target:
            return cid
    return None
