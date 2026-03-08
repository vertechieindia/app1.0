"""
Shared helpers for seeding places (internal location autocomplete).
Used by seed_places_usa, seed_places_india, seed_places_uk, seed_places_canada.
"""

import re
from pathlib import Path
from typing import List, Tuple

from sqlalchemy.dialects.postgresql import insert

from app.db.session import AsyncSessionLocal
from app.models.place import Place


def make_place_id(country_code: str, name: str, admin1: str) -> str:
    """Build unique id: country_code|name|admin1 (pipes in name/admin1 replaced)."""
    safe = lambda s: re.sub(r"[|]", "-", (s or "").strip())[:100]
    return f"{country_code}|{safe(name)}|{safe(admin1)}"


def build_display_name(name: str, admin1: str, country_code: str) -> str:
    """Build display string: Name, State, Country."""
    country_names = {
        "US": "United States",
        "IN": "India",
        "GB": "United Kingdom",
        "CA": "Canada",
    }
    country_name = country_names.get(country_code, country_code)
    parts = [p for p in [name, admin1, country_name] if p]
    return ", ".join(parts)


async def seed_from_list(
    country_code: str,
    country_display_name: str,
    places: List[Tuple[str, str]],
) -> int:
    """
    Seed places from a list of (name, admin1) tuples.
    Returns number of rows upserted.
    """
    await _ensure_db()
    count = 0
    async with AsyncSessionLocal() as session:
        for name, admin1 in places:
            place_id = make_place_id(country_code, name, admin1)
            display = build_display_name(name, admin1, country_code)
            stmt = insert(Place).values(
                id=place_id,
                name=name,
                admin1=admin1 or None,
                admin2=None,
                country_code=country_code,
                display_name=display,
            ).on_conflict_do_update(
                index_elements=["id"],
                set_={"name": name, "admin1": admin1 or None, "display_name": display},
            )
            await session.execute(stmt)
            count += 1
        await session.commit()
    return count


async def seed_from_json(
    country_code: str,
    json_path: Path,
) -> int:
    """
    Seed places from a JSON file: array of {"name": "...", "admin1": "..."} or {"name": "...", "state": "..."}.
    Returns number of rows upserted, or 0 if file missing.
    """
    import json
    if not json_path.is_file():
        return 0
    await _ensure_db()
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        data = data.get("places", data.get("items", []))
    count = 0
    async with AsyncSessionLocal() as session:
        for item in data:
            name = (item.get("name") or item.get("city") or "").strip()
            admin1 = (item.get("admin1") or item.get("state") or item.get("region") or "").strip()
            if not name:
                continue
            place_id = make_place_id(country_code, name, admin1)
            display = build_display_name(name, admin1, country_code)
            stmt = insert(Place).values(
                id=place_id,
                name=name,
                admin1=admin1 or None,
                admin2=item.get("admin2"),
                country_code=country_code,
                display_name=display,
            ).on_conflict_do_update(
                index_elements=["id"],
                set_={"name": name, "admin1": admin1 or None, "display_name": display},
            )
            await session.execute(stmt)
            count += 1
        await session.commit()
    return count


async def _ensure_db():
    from app.db.session import init_db
    await init_db()
