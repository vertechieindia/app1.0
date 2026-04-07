"""
Skill name autocomplete: seeded catalog + distinct skills from job postings.
"""

from typing import List, Optional, Set

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, case, literal, func, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.job import Job
from app.models.skill_catalog import SkillCatalog

router = APIRouter(prefix="/skills", tags=["Skills"])

_LIVE_SKILLS_SQL = text(
    """
    SELECT DISTINCT skill
    FROM (
        SELECT elem AS skill
        FROM jobs,
        LATERAL jsonb_array_elements_text(COALESCE(skills_required::jsonb, '[]'::jsonb)) AS elem
        UNION
        SELECT elem AS skill
        FROM jobs,
        LATERAL jsonb_array_elements_text(COALESCE(skills_preferred::jsonb, '[]'::jsonb)) AS elem
    ) t
    WHERE skill ILIKE :search
    ORDER BY skill
    LIMIT :lim
    """
)


def _is_acceptable_live_skill(raw: Optional[str]) -> bool:
    s = (raw or "").strip()
    if len(s) < 2 or len(s) > 120:
        return False
    lower = s.lower()
    junk = {"test", "n/a", "na", "none", "tbd", "todo", "asdf", "xxx", "skill", "skills"}
    if lower in junk:
        return False
    return True


async def _live_skills_from_jobs(
    db: AsyncSession, q_stripped: str, limit: int
) -> List[str]:
    search = f"%{q_stripped}%"
    bind = db.get_bind()
    dialect = getattr(bind, "dialect", None)
    name = getattr(dialect, "name", "") if dialect else ""

    if name == "postgresql":
        result = await db.execute(_LIVE_SKILLS_SQL, {"search": search, "lim": limit})
        rows = result.all()
        return [row[0] for row in rows if row[0] and _is_acceptable_live_skill(row[0])]

    stmt = select(Job.skills_required, Job.skills_preferred)
    result = await db.execute(stmt)
    seen: Set[str] = set()
    out: List[str] = []
    qlow = q_stripped.lower()
    for row in result.all():
        for col in (row[0], row[1]):
            if not col:
                continue
            for item in col:
                if not isinstance(item, str):
                    continue
                s = item.strip()
                if not _is_acceptable_live_skill(s):
                    continue
                if qlow not in s.lower():
                    continue
                key = s.lower()
                if key in seen:
                    continue
                seen.add(key)
                out.append(s)
                if len(out) >= limit:
                    return sorted(out)[:limit]
    return sorted(out)[:limit]


@router.get("/autocomplete", response_model=List[str])
async def skill_autocomplete(
    q: str = Query(..., min_length=1),
    limit: int = Query(24, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
) -> List[str]:
    """
    Skill suggestions: seeded catalog (relevance-ranked) + distinct skills from jobs.
    Public; no auth required (same pattern as /jobs/title-autocomplete).
    """
    q_stripped = q.strip()
    if not q_stripped:
        return []
    search = f"%{q_stripped}%"
    match_rank = case(
        (func.lower(SkillCatalog.name) == func.lower(literal(q_stripped)), literal(0)),
        (SkillCatalog.name.ilike(f"{q_stripped}%"), literal(1)),
        else_=literal(2),
    )
    cat_stmt = (
        select(SkillCatalog.name)
        .where(SkillCatalog.name.ilike(search))
        .order_by(match_rank, SkillCatalog.name)
        .limit(limit)
    )
    cat_result = await db.execute(cat_stmt)
    catalog_skills = [row[0] for row in cat_result.all() if row[0]]

    job_skills = await _live_skills_from_jobs(db, q_stripped, limit)

    seen: set[str] = set()
    out: List[str] = []
    for skill in catalog_skills + job_skills:
        key = skill.strip().lower()
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(skill.strip())
        if len(out) >= limit:
            break
    return out
