"""Remove old GitHub username field, keep only OAuth fields

Revision ID: 009_remove_old_github
Revises: 008_github_oauth
Create Date: 2026-01-31

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '009_remove_old_github'
down_revision: Union[str, None] = '008_github_oauth'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('user_profile', 'activity_github_username')


def downgrade() -> None:
    op.add_column('user_profile', sa.Column('activity_github_username', sa.String(length=255), nullable=True))
