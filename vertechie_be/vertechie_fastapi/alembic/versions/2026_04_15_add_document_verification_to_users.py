"""add document_verification JSON to users for admin ID review

Revision ID: 2026_04_15_document_verification
Revises: 2026_04_05_job_views
Create Date: 2026-04-15

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "2026_04_15_document_verification"
down_revision: Union[str, None] = "2026_04_05_job_views"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    from sqlalchemy import inspect

    conn = op.get_bind()
    cols = [c["name"] for c in inspect(conn).get_columns("users")]
    if "document_verification" not in cols:
        op.add_column(
            "users",
            sa.Column("document_verification", sa.JSON(), nullable=True),
        )


def downgrade() -> None:
    from sqlalchemy import inspect

    conn = op.get_bind()
    cols = [c["name"] for c in inspect(conn).get_columns("users")]
    if "document_verification" in cols:
        op.drop_column("users", "document_verification")
