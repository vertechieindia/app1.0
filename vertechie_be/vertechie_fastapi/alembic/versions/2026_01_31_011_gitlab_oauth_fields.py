"""Add GitLab OAuth fields, remove old username-based GitLab field

Revision ID: 011_gitlab_oauth
Revises: 010_github_username
Create Date: 2026-01-31

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '011_gitlab_oauth'
down_revision: Union[str, None] = '010_github_username'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('user_profile', sa.Column('gitlab_access_token', sa.String(length=500), nullable=True))
    op.add_column('user_profile', sa.Column('gitlab_username', sa.String(length=255), nullable=True))
    op.add_column('user_profile', sa.Column('gitlab_user_id', sa.String(length=50), nullable=True))
    op.add_column('user_profile', sa.Column('gitlab_connected_at', sa.DateTime(), nullable=True))
    op.drop_column('user_profile', 'activity_gitlab_username')


def downgrade() -> None:
    op.add_column('user_profile', sa.Column('activity_gitlab_username', sa.String(length=255), nullable=True))
    op.drop_column('user_profile', 'gitlab_connected_at')
    op.drop_column('user_profile', 'gitlab_user_id')
    op.drop_column('user_profile', 'gitlab_username')
    op.drop_column('user_profile', 'gitlab_access_token')
