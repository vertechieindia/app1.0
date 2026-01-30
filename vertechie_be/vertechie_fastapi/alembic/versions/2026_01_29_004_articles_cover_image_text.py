"""articles cover_image and thumbnail to TEXT

Revision ID: 004_articles_cover_text
Revises: 003_add_events_combinator
Create Date: 2026-01-29

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '004_articles_cover_text'
down_revision: Union[str, None] = '003_add_events_combinator'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        'articles',
        'cover_image',
        existing_type=sa.String(500),
        type_=sa.Text(),
        existing_nullable=True,
    )
    op.alter_column(
        'articles',
        'thumbnail',
        existing_type=sa.String(500),
        type_=sa.Text(),
        existing_nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        'articles',
        'cover_image',
        existing_type=sa.Text(),
        type_=sa.String(500),
        existing_nullable=True,
    )
    op.alter_column(
        'articles',
        'thumbnail',
        existing_type=sa.Text(),
        type_=sa.String(500),
        existing_nullable=True,
    )
