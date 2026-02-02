"""Add github_username field for OAuth username storage

Revision ID: 010_github_username
Revises: 009_remove_old_github
Create Date: 2026-01-31

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '010_github_username'
down_revision: Union[str, None] = '009_remove_old_github'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('user_profile', sa.Column('github_username', sa.String(length=255), nullable=True))


def downgrade() -> None:
    op.drop_column('user_profile', 'github_username')
