"""Merge heads: 6d20fc4ce061 + job_hire_loc_20260321

Resolves "Multiple head revisions" so `alembic upgrade head` works.
"""
from typing import Sequence, Tuple, Union

from alembic import op


revision: str = "merge_6d20_jhire_0322"
down_revision: Union[str, Tuple[str, ...], None] = (
    "6d20fc4ce061",
    "job_hire_loc_20260321",
)
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
