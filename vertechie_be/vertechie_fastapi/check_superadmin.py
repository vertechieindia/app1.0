#!/usr/bin/env python3
"""
Check if superadmin@vertechie.com exists and password superadmin@123 verifies.
Optionally fix: create or update the user so login works.
"""
import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.core.security import verify_password, get_password_hash


TARGET_EMAIL = "superadmin@vertechie.com"
TARGET_PASSWORD = "superadmin@123"


async def check_and_fix():
    async with AsyncSessionLocal() as db:
        # Find by email (case-insensitive)
        result = await db.execute(
            select(User).where(User.email.ilike(TARGET_EMAIL))
        )
        user = result.scalar_one_or_none()

        if not user:
            print(f"User '{TARGET_EMAIL}' NOT FOUND in database.")
            # List any superusers
            r2 = await db.execute(select(User).where(User.is_superuser == True))
            su = r2.scalar_one_or_none()
            if su:
                print(f"Existing superuser in DB: email={su.email!r}, is_active={su.is_active}")
                ok = verify_password(TARGET_PASSWORD, su.hashed_password)
                print(f"  Password 'superadmin@123' matches stored hash: {ok}")
            else:
                print("No superuser in DB. Run app once so init_db() creates default superuser.")
            return

        print(f"User found: id={user.id}, email={user.email!r}, is_active={user.is_active}, is_superuser={user.is_superuser}")
        ok = verify_password(TARGET_PASSWORD, user.hashed_password)
        print(f"Password '{TARGET_PASSWORD}' verifies: {ok}")

        if not ok:
            print("Updating password to 'superadmin@123'...")
            user.hashed_password = get_password_hash(TARGET_PASSWORD)
            await db.commit()
            print("Done. Try logging in again with superadmin@vertechie.com / superadmin@123")
        else:
            print("Credentials OK. If login still fails, check is_active and is_blocked.")


if __name__ == "__main__":
    asyncio.run(check_and_fix())
