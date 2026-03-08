"""
Internal location autocomplete API.
No external APIs - uses seeded places table (USA, India, UK, Canada).
"""

from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from pydantic import BaseModel

from app.db.session import get_db
from app.models.place import Place


router = APIRouter(prefix="/places", tags=["Places"])


class PlaceSuggestion(BaseModel):
    id: str
    display_name: str
    name: str
    admin1: Optional[str] = None
    country_code: str


@router.get("/autocomplete", response_model=List[PlaceSuggestion])
async def autocomplete(
    q: str = Query(..., min_length=1),
    country: str = Query(..., description="Country code: US, IN, GB, CA"),
    limit: int = Query(10, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
) -> List[PlaceSuggestion]:
    """
    Search places by name or display_name. Returns matching cities/towns/villages.
    Country filter: US (USA), IN (India), GB (UK), CA (Canada).
    """
    country_upper = country.strip().upper()
    if country_upper not in ("US", "IN", "GB", "CA"):
        return []
    search = f"%{q.strip()}%"
    stmt = (
        select(Place)
        .where(Place.country_code == country_upper)
        .where(
            or_(
                Place.name.ilike(search),
                Place.display_name.ilike(search),
                Place.admin1.ilike(search),
            )
        )
        .order_by(Place.display_name)
        .limit(limit)
    )
    result = await db.execute(stmt)
    rows = result.scalars().all()
    return [
        PlaceSuggestion(
            id=p.id,
            display_name=p.display_name,
            name=p.name,
            admin1=p.admin1,
            country_code=p.country_code,
        )
        for p in rows
    ]
