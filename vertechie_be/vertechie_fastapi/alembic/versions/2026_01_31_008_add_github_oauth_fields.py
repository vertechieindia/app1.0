"""Add GitHub OAuth fields for proper authentication

Revision ID: 008_github_oauth
Revises: 007_merge_heads
Create Date: 2026-01-31

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '008_github_oauth'
down_revision: Union[str, None] = '007_merge_heads'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('user_profile', sa.Column('github_access_token', sa.String(length=500), nullable=True))
    op.add_column('user_profile', sa.Column('github_user_id', sa.String(length=50), nullable=True))
    op.add_column('user_profile', sa.Column('github_connected_at', sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column('user_profile', 'github_access_token')
    op.drop_column('user_profile', 'github_user_id')
    op.drop_column('user_profile', 'github_connected_at')
