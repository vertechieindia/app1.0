"""
Place model for internal location autocomplete (cities, towns, villages).
No external APIs - data seeded per country (USA, India, UK, Canada).
"""

from sqlalchemy import Column, String, Index
from app.db.base import Base


class Place(Base):
    """
    Internal places table for location autocomplete.
    Stores cities, towns, villages per country. Display format: "Name, Admin1, Country".
    """
    __tablename__ = "places"

    # Natural key: country_code|name|admin1 for uniqueness and idempotent seed
    id = Column(String(120), primary_key=True)  # e.g. "US|New York|New York"
    name = Column(String(200), nullable=False, index=True)
    admin1 = Column(String(100), nullable=True, index=True)   # State / Province / Region
    admin2 = Column(String(100), nullable=True)              # County / District (optional)
    country_code = Column(String(2), nullable=False, index=True)  # US, IN, GB, CA
    display_name = Column(String(350), nullable=False)        # "City, State, Country"

    __table_args__ = (
        Index("ix_places_country_name", "country_code", "name"),
        Index("ix_places_display_search", "country_code", "display_name"),
    )
