"""add job_title_catalog for job title autocomplete

Revision ID: 2026_04_04_job_title_cat
Revises: 2026_04_03_usr_prof_cid
Create Date: 2026-04-04

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "2026_04_04_job_title_cat"
down_revision: Union[str, None] = "2026_04_03_usr_prof_cid"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    from sqlalchemy import inspect

    conn = op.get_bind()
    if inspect(conn).has_table("job_title_catalog"):
        return
    op.create_table(
        "job_title_catalog",
        sa.Column("title", sa.String(length=200), primary_key=True),
    )


def downgrade() -> None:
    op.drop_table("job_title_catalog")
