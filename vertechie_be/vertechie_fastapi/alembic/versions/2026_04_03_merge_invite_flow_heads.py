"""merge company_invite_reg and invite_flow branches

Revision ID: merge_2026_04_03_invite_heads
Revises: 2026_04_01_company_invite_reg, 2026_04_03_invite_flow
Create Date: 2026-04-03

"""
from typing import Sequence, Union

from alembic import op


revision: str = "merge_2026_04_03_invite_heads"
down_revision: Union[str, tuple, None] = (
    "2026_04_01_company_invite_reg",
    "2026_04_03_invite_flow",
)
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
