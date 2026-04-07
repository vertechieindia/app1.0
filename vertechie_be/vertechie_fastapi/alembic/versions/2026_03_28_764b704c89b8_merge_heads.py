"""merge heads

Revision ID: 764b704c89b8
Revises: merge_6d20_jhire_0322, 2026_03_23_chat_poll_votes
Create Date: 2026-03-28 12:35:53.569508+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "764b704c89b8"
down_revision: Union[str, None] = (
    "merge_6d20_jhire_0322",
    "2026_03_23_chat_poll_votes",
)
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
