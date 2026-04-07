"""
Canonical job titles for autocomplete (seeded) + live distinct titles from `jobs`.
"""

from sqlalchemy import Column, String

from app.db.base import Base


class JobTitleCatalog(Base):
    """Seeded reference titles for GET /jobs/title-autocomplete."""

    __tablename__ = "job_title_catalog"

    title = Column(String(200), primary_key=True)
