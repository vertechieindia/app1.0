"""Merge multiple heads - articles_cover_text and activity_linked branches

Revision ID: 007_merge_heads
Revises: 004_articles_cover_text, 006_activity_linked
Create Date: 2026-01-31

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '007_merge_heads'
down_revision: Union[str, None] = ('004_articles_cover_text', '006_activity_linked')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
