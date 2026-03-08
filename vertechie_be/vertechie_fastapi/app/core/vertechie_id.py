"""
VerTechie ID generation.

Format: VT + first 3 letters of first name (uppercase) + MMDD (month, day of birth) + last 4 digits.
- India: last 4 = PAN last 4.
- USA: last 4 = SSN last 4.
"""

from datetime import date
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


def _normalize_last_four(value: Optional[str]) -> str:
    """
    Use last 4 characters (alphanumeric) for VerTechie ID.
    - India PAN: last 4 can be alphanumeric (e.g. 089J).
    - USA SSN: last 4 digits.
    Returns '0000' if missing or invalid.
    """
    if not value or not isinstance(value, str):
        return "0000"
    s = value.strip()
    if not s:
        return "0000"
    if len(s) >= 4:
        return s[-4:].upper()
    return s.upper().ljust(4, "0")


def generate_vertechie_id_base(
    first_name: Optional[str],
    dob: Optional[date],
    gov_id_last_four: Optional[str] = None,
) -> Optional[str]:
    """
    Generate base VerTechie ID: VT + first3(first_name) + MMDD(dob) + last4.
    Returns None if first_name or dob is missing.
    """
    if not first_name or not first_name.strip():
        return None
    first = first_name.strip()[:3].upper()
    if len(first_name.strip()) < 3:
        first = (first_name.strip().upper() + "XX")[:3]
    mmdd = "0000"
    if dob:
        mmdd = f"{dob.month:02d}{dob.day:02d}"
    last4 = _normalize_last_four(gov_id_last_four)
    return f"VT{first}{mmdd}{last4}"


async def ensure_unique_vertechie_id(db: AsyncSession, base_id: str) -> str:
    """
    If base_id is taken, append suffix A, B, C, ... until unique.
    """
    candidate = base_id
    suffix = ""
    while True:
        result = await db.execute(select(User.id).where(User.vertechie_id == candidate))
        if result.scalar_one_or_none() is None:
            return candidate
        if not suffix:
            suffix = "A"
        elif len(suffix) == 1:
            if suffix == "Z":
                suffix = "A1"
            else:
                suffix = chr(ord(suffix) + 1)
        else:
            num = int(suffix[1:]) + 1
            suffix = f"A{num}"
        candidate = f"{base_id}{suffix}"


async def generate_vertechie_id(
    db: AsyncSession,
    first_name: Optional[str],
    dob: Optional[date],
    gov_id_last_four: Optional[str] = None,
) -> Optional[str]:
    """
    Generate a unique VerTechie ID. Uses format VT+first3+MMDD+last4.
    If base ID exists, appends A, B, C, ... for uniqueness.
    Returns None if first_name or dob is missing.
    """
    base = generate_vertechie_id_base(first_name, dob, gov_id_last_four)
    if base is None:
        return None
    return await ensure_unique_vertechie_id(db, base)
