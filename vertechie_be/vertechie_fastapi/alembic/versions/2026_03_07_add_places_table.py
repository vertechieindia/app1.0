"""add places table for internal location autocomplete

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-03-07

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = "b2c3d4e5f6a7"
down_revision: Union[str, None] = "a1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    from sqlalchemy import inspect
    conn = op.get_bind()
    if inspect(conn).has_table("places"):
        return  # Table already exists (e.g. from init_db)
    op.create_table(
        "places",
        sa.Column("id", sa.String(length=120), primary_key=True),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("admin1", sa.String(length=100), nullable=True),
        sa.Column("admin2", sa.String(length=100), nullable=True),
        sa.Column("country_code", sa.String(length=2), nullable=False),
        sa.Column("display_name", sa.String(length=350), nullable=False),
    )
    op.create_index("ix_places_name", "places", ["name"])
    op.create_index("ix_places_admin1", "places", ["admin1"])
    op.create_index("ix_places_country_code", "places", ["country_code"])
    op.create_index("ix_places_country_name", "places", ["country_code", "name"])
    op.create_index("ix_places_display_search", "places", ["country_code", "display_name"])


def downgrade() -> None:
    op.drop_index("ix_places_display_search", table_name="places")
    op.drop_index("ix_places_country_name", table_name="places")
    op.drop_index("ix_places_country_code", table_name="places")
    op.drop_index("ix_places_admin1", table_name="places")
    op.drop_index("ix_places_name", table_name="places")
    op.drop_table("places")
