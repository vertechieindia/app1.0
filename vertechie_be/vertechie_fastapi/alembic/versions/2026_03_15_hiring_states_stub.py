"""Stub for missing revision 2026_03_15_hiring_states (DB already at this revision).

Revision ID: 2026_03_15_hiring_states
Revises: 2026_03_12_invite_details
Create Date: 2026-03-15

"""
from typing import Sequence, Union
from alembic import op

revision: str = "2026_03_15_hiring_states"
down_revision: Union[str, None] = "2026_03_12_invite_details"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
