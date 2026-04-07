"""add LEARN_ADMIN to roletype enum for UserRole

Revision ID: 2026_04_01_learn_admin_roletype
Revises: 764b704c89b8
Create Date: 2026-04-01

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "2026_04_01_learn_admin_roletype"
down_revision: Union[str, None] = "764b704c89b8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # PostgreSQL: extend native enum used by user_role.role_type (idempotent)
    op.execute(
        sa.text(
            """
            DO $$ BEGIN
                ALTER TYPE roletype ADD VALUE 'LEARN_ADMIN';
            EXCEPTION
                WHEN duplicate_object THEN NULL;
            END $$;
            """
        )
    )


def downgrade() -> None:
    # PostgreSQL does not support removing enum values safely; leave type extended.
    pass
