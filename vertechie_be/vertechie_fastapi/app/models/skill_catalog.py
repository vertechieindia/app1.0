"""
Canonical skill names for autocomplete (seeded) + distinct values from `jobs.skills_required`.
"""

from sqlalchemy import Column, String

from app.db.base import Base


class SkillCatalog(Base):
    """Seeded reference skills for GET /skills/autocomplete."""

    __tablename__ = "skill_catalog"

    name = Column(String(150), primary_key=True)
