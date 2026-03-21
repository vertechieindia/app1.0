"""Placeholder for revision 6d20fc4ce061 (mergepoint from production).

Production may already have this revision applied; upgrade is a no-op.
Branched from 2026_03_19_sig in parallel with job_hire_loc_20260321.
"""
from typing import Sequence, Union

from alembic import op


revision: str = "6d20fc4ce061"
down_revision: Union[str, None] = "2026_03_19_sig"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
