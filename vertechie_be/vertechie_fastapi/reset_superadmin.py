#!/usr/bin/env python3
"""Reset super admin password and ensure account flags are login-ready."""

from __future__ import annotations

import argparse
import asyncio
import os
import sys

from sqlalchemy import select

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.security import get_password_hash, verify_password
from app.db.session import AsyncSessionLocal
from app.models.user import User

DEFAULT_EMAIL = "superadmin@vertechie.com"
DEFAULT_PASSWORD = "superadmin@123!"


async def reset_superadmin(email: str, password: str) -> bool:
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email.ilike(email)))
        user = result.scalar_one_or_none()

        if not user:
            print(f"User not found: {email}")
            result = await db.execute(select(User).where(User.is_superuser.is_(True)))
            superusers = result.scalars().all()
            if superusers:
                print("Existing superusers:")
                for su in superusers:
                    print(f"  - {su.email} (active={su.is_active}, blocked={su.is_blocked})")
            return False

        user.hashed_password = get_password_hash(password)
        user.is_active = True
        user.is_blocked = False
        user.is_superuser = True
        if not user.admin_roles:
            user.admin_roles = ["superadmin", "admin", "learnadmin"]

        await db.commit()
        await db.refresh(user)

        ok = verify_password(password, user.hashed_password)
        print(f"Reset OK: {user.email}")
        print(f"  is_active={user.is_active}, is_superuser={user.is_superuser}")
        print(f"  password verifies: {ok}")
        return ok


def main() -> None:
    parser = argparse.ArgumentParser(description="Reset super admin password")
    parser.add_argument("--email", default=DEFAULT_EMAIL)
    parser.add_argument("--password", default=DEFAULT_PASSWORD)
    args = parser.parse_args()

    success = asyncio.run(reset_superadmin(args.email, args.password))
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
