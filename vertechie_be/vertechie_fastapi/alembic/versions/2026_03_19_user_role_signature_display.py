"""user_role permission_signature display_label unique type+sig

Revision ID: 2026_03_19_sig
Revises: 756387dee64f
Create Date: 2026-03-19

"""
from __future__ import annotations

import json
from collections import defaultdict
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision: str = "2026_03_19_sig"
down_revision: Union[str, None] = "756387dee64f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _parse_perms(raw) -> list:
    if raw is None:
        return []
    if isinstance(raw, list):
        return raw
    if isinstance(raw, str):
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return []
    return []


def upgrade() -> None:
    from app.core.access_role_utils import compute_permission_signature

    conn = op.get_bind()

    # Widen name if still at legacy length (idempotent)
    len_row = conn.execute(
        text(
            """
            SELECT character_maximum_length FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'user_role' AND column_name = 'name'
            """
        )
    ).fetchone()
    if len_row and (len_row[0] is None or int(len_row[0]) < 64):
        op.alter_column(
            "user_role",
            "name",
            existing_type=sa.String(length=50),
            type_=sa.String(length=64),
            existing_nullable=False,
        )

    # Idempotent: safe if migration was partially applied before
    op.execute(
        text(
            "ALTER TABLE user_role ADD COLUMN IF NOT EXISTS permission_signature VARCHAR(64)"
        )
    )
    op.execute(
        text(
            "ALTER TABLE user_role ADD COLUMN IF NOT EXISTS display_label VARCHAR(255)"
        )
    )

    rows = conn.execute(
        text("SELECT id, role_type::text, permissions, name FROM user_role")
    ).fetchall()

    for row in rows:
        rid, rt_raw, perms, name = row
        codes = _parse_perms(perms)
        sig = compute_permission_signature(codes)
        label = (name or "Access role")[:255]
        conn.execute(
            text(
                "UPDATE user_role SET permission_signature = :sig, display_label = :dl WHERE id = :rid"
            ),
            {"sig": sig, "dl": label, "rid": rid},
        )

    # Merge duplicate (role_type, permission_signature)
    rows2 = conn.execute(
        text("SELECT id, role_type::text, permission_signature FROM user_role")
    ).fetchall()
    groups: dict[tuple[str, str], list] = defaultdict(list)
    for rid, rt_raw, sig in rows2:
        key = (str(rt_raw), str(sig))
        groups[key].append(rid)

    for _key, ids in groups.items():
        if len(ids) <= 1:
            continue
        keeper = sorted(ids, key=lambda x: str(x))[0]
        for dupe in ids:
            if dupe == keeper:
                continue
            # Avoid duplicate (user_id, role_id) when merging roles
            conn.execute(
                text(
                    """
                    DELETE FROM user_roles ur1
                    WHERE ur1.role_id = :dupe
                    AND EXISTS (
                        SELECT 1 FROM user_roles ur2
                        WHERE ur2.user_id = ur1.user_id AND ur2.role_id = :keeper
                    )
                    """
                ),
                {"dupe": dupe, "keeper": keeper},
            )
            conn.execute(
                text("UPDATE user_roles SET role_id = :k WHERE role_id = :d"),
                {"k": keeper, "d": dupe},
            )
            conn.execute(
                text("DELETE FROM user_role WHERE id = :d"),
                {"d": dupe},
            )

    # Set NOT NULL only when still nullable
    for col in ("permission_signature", "display_label"):
        row = conn.execute(
            text(
                """
                SELECT is_nullable FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = 'user_role' AND column_name = :c
                """
            ),
            {"c": col},
        ).fetchone()
        if row and row[0] == "YES":
            op.alter_column("user_role", col, nullable=False)

    exists = conn.execute(
        text(
            "SELECT 1 FROM pg_constraint WHERE conname = 'uq_user_role_type_perm_sig'"
        )
    ).scalar()
    if not exists:
        op.create_unique_constraint(
            "uq_user_role_type_perm_sig",
            "user_role",
            ["role_type", "permission_signature"],
        )


def downgrade() -> None:
    conn = op.get_bind()
    if conn.execute(
        text("SELECT 1 FROM pg_constraint WHERE conname = 'uq_user_role_type_perm_sig'")
    ).scalar():
        op.drop_constraint("uq_user_role_type_perm_sig", "user_role", type_="unique")
    op.execute(text("ALTER TABLE user_role DROP COLUMN IF EXISTS display_label"))
    op.execute(text("ALTER TABLE user_role DROP COLUMN IF EXISTS permission_signature"))
    op.alter_column(
        "user_role",
        "name",
        existing_type=sa.String(length=64),
        type_=sa.String(length=50),
        existing_nullable=False,
    )
