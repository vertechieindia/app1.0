#!/usr/bin/env python3
"""
Merge exact duplicate user_role rows and remove orphan empty admin-type roles.

Safe cleanup:
- Merges rows with the same (role_type, permission_signature)
- Deletes empty-permission assignable admin roles only when no users are linked
  (signup TECHIE shells with users are kept)
"""

from __future__ import annotations

import asyncio
import os
import sys
from collections import defaultdict

from sqlalchemy import delete, func, insert, select, text

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.access_role_utils import (
    compute_permission_signature,
    sorted_unique_permission_codes,
)
from app.core.role_mapping import ASSIGNABLE_ADMIN_ROLE_TYPES
from app.db.session import AsyncSessionLocal
from app.models.user import UserRole, user_roles


async def merge_exact_duplicates(db) -> int:
    rows = (
        await db.execute(
            select(UserRole.id, UserRole.role_type, UserRole.permission_signature)
        )
    ).all()
    groups: dict[tuple, list] = defaultdict(list)
    for rid, rt, sig in rows:
        groups[(str(rt), str(sig))].append(rid)

    merged = 0
    for _key, ids in groups.items():
        if len(ids) <= 1:
            continue
        keeper = sorted(ids, key=lambda x: str(x))[0]
        for dupe in ids:
            if dupe == keeper:
                continue
            await db.execute(
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
            await db.execute(
                text("UPDATE user_roles SET role_id = :k WHERE role_id = :d"),
                {"k": keeper, "d": dupe},
            )
            await db.execute(delete(UserRole).where(UserRole.id == dupe))
            merged += 1
            print(f"  merged duplicate role {dupe} -> {keeper}")
    return merged


async def remove_orphan_empty_admin_roles(db) -> int:
    removed = 0
    empty_sig = compute_permission_signature([])
    for rt in ASSIGNABLE_ADMIN_ROLE_TYPES:
        result = await db.execute(
            select(UserRole).where(
                UserRole.role_type == rt,
                UserRole.permission_signature == empty_sig,
            )
        )
        for role in result.scalars().all():
            count = (
                await db.execute(
                    select(func.count()).select_from(user_roles).where(
                        user_roles.c.role_id == role.id
                    )
                )
            ).scalar_one()
            if count == 0:
                await db.delete(role)
                removed += 1
                print(f"  removed orphan empty role {role.id} ({rt.value})")
    return removed


async def main() -> None:
    async with AsyncSessionLocal() as db:
        print("Merging exact (role_type, permission_signature) duplicates...")
        merged = await merge_exact_duplicates(db)
        print(f"Merged {merged} duplicate row(s).")

        print("Removing orphan empty admin-type roles (0 users)...")
        removed = await remove_orphan_empty_admin_roles(db)
        print(f"Removed {removed} orphan empty role(s).")

        await db.commit()
        print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
