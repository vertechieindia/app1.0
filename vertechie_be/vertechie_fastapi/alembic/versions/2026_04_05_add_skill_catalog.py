"""add skill_catalog for skill autocomplete

Revision ID: 2026_04_05_skill_cat
Revises: 2026_04_04_job_title_cat
Create Date: 2026-04-05

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "2026_04_05_skill_cat"
down_revision: Union[str, None] = "2026_04_04_job_title_cat"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    from sqlalchemy import inspect

    conn = op.get_bind()
    if inspect(conn).has_table("skill_catalog"):
        return
    op.create_table(
        "skill_catalog",
        sa.Column("name", sa.String(length=150), primary_key=True),
    )


def downgrade() -> None:
    op.drop_table("skill_catalog")
