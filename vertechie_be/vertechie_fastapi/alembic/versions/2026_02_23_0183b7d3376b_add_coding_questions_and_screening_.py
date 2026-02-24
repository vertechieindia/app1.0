"""add coding_questions and screening_questions to jobs

Revision ID: 0183b7d3376b
Revises: 4824_user_activity_type_text
Create Date: 2026-02-23 14:48:00.584462+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0183b7d3376b"
down_revision: Union[str, None] = "4824_user_activity_type_text"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS coding_questions JSON DEFAULT '[]'::json")
    op.execute("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS screening_questions JSON DEFAULT '[]'::json")

    op.execute("UPDATE jobs SET coding_questions = COALESCE(coding_questions, '[]'::json)")
    op.execute("UPDATE jobs SET screening_questions = COALESCE(screening_questions, '[]'::json)")


def downgrade() -> None:
    op.execute("ALTER TABLE jobs DROP COLUMN IF EXISTS screening_questions")
    op.execute("ALTER TABLE jobs DROP COLUMN IF EXISTS coding_questions")
