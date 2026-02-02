"""Add activity_github_username and activity_gitlab_username for explicit activity linking

Revision ID: 006_activity_linked
Revises: 005_add_link_uppercase
Create Date: 2026-01-31

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '006_activity_linked'
down_revision: Union[str, None] = '005_add_link_uppercase'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('user_profile', sa.Column('activity_github_username', sa.String(length=255), nullable=True))
    op.add_column('user_profile', sa.Column('activity_gitlab_username', sa.String(length=255), nullable=True))


def downgrade() -> None:
    op.drop_column('user_profile', 'activity_github_username')
    op.drop_column('user_profile', 'activity_gitlab_username')
