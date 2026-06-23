"""access role unique name + admin_role_code

Revision ID: 2026_06_22_role_name
Revises: 2026_06_13_co_staff
"""
from __future__ import annotations

import json
from collections import defaultdict
from typing import Sequence, Union

from alembic import op
from sqlalchemy import text

revision: str = "2026_06_22_role_name"
down_revision: Union[str, None] = "2026_06_13_co_staff"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

SEED_LABELS: dict[str, str] = {
    "SUPER_ADMIN": "Super Admin",
    "TECHIE": "Techie Admin",
    "HIRING_MANAGER": "HM Admin",
    "COMPANY_ADMIN": "Company Admin",
    "SCHOOL_ADMIN": "School Admin",
    "BDM_ADMIN": "BDM Admin",
    "LEARN_ADMIN": "Learn Admin",
    "REQUIREMENTS_TEAM": "Requirements Admin",
    "SCREENER": "Screener Admin",
    "TECH_SCREENER": "Tech Screener Admin",
}


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
    from app.core.access_role_utils import (
        compute_permission_signature,
        normalize_role_name,
        admin_role_code_for_role_name,
        infer_role_type_from_role_name,
    )

    conn = op.get_bind()

    op.execute(
        text(
            """
            DO $$ BEGIN
              ALTER TYPE roletype ADD VALUE IF NOT EXISTS 'STAFF_ADMIN';
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;
            """
        )
    )

    op.execute(
        text(
            "ALTER TABLE user_role ADD COLUMN IF NOT EXISTS admin_role_code VARCHAR(64)"
        )
    )

    if conn.execute(
        text("SELECT 1 FROM pg_constraint WHERE conname = 'uq_user_role_type_perm_sig'")
    ).scalar():
        op.drop_constraint("uq_user_role_type_perm_sig", "user_role", type_="unique")

    rows = conn.execute(
        text(
            "SELECT id, role_type::text, permissions, display_label FROM user_role"
        )
    ).fetchall()

    for rid, rt_raw, perms_raw, dl in rows:
        codes = _parse_perms(perms_raw)
        sig = compute_permission_signature(codes)
        label = (dl or "").strip()
        if not label or "·" in label:
            seed_label = SEED_LABELS.get(str(rt_raw))
            if seed_label and len(codes) > 0:
                label = seed_label
            elif label:
                label = label.split("·")[0].strip()
            else:
                label = seed_label or str(rt_raw).replace("_", " ").title()
        label = normalize_role_name(label)[:255]
        rt_enum = infer_role_type_from_role_name(label)
        code = admin_role_code_for_role_name(label, rt_enum)
        conn.execute(
            text(
                """
                UPDATE user_role
                SET display_label = :dl,
                    permission_signature = :sig,
                    admin_role_code = :code
                WHERE id = :rid
                """
            ),
            {"dl": label, "sig": sig, "rid": rid, "code": code},
        )

    rows2 = conn.execute(
        text("SELECT id, lower(trim(display_label)) AS nl FROM user_role")
    ).fetchall()
    groups: dict[str, list] = defaultdict(list)
    for rid, nl in rows2:
        if nl:
            groups[nl].append(rid)

    for _nl, ids in groups.items():
        if len(ids) <= 1:
            continue
        keeper = sorted(ids, key=lambda x: str(x))[0]
        for dupe in ids:
            if dupe == keeper:
                continue
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
            conn.execute(text("DELETE FROM user_role WHERE id = :d"), {"d": dupe})

    exists = conn.execute(
        text(
            "SELECT 1 FROM pg_indexes WHERE indexname = 'uq_user_role_display_label_lower'"
        )
    ).scalar()
    if not exists:
        op.execute(
            text(
                """
                CREATE UNIQUE INDEX uq_user_role_display_label_lower
                ON user_role (lower(trim(display_label)))
                """
            )
        )


def downgrade() -> None:
    conn = op.get_bind()
    if conn.execute(
        text(
            "SELECT 1 FROM pg_indexes WHERE indexname = 'uq_user_role_display_label_lower'"
        )
    ).scalar():
        op.execute(text("DROP INDEX IF EXISTS uq_user_role_display_label_lower"))
    op.execute(text("ALTER TABLE user_role DROP COLUMN IF EXISTS admin_role_code"))
    exists = conn.execute(
        text("SELECT 1 FROM pg_constraint WHERE conname = 'uq_user_role_type_perm_sig'")
    ).scalar()
    if not exists:
        op.create_unique_constraint(
            "uq_user_role_type_perm_sig",
            "user_role",
            ["role_type", "permission_signature"],
        )
