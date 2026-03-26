#!/usr/bin/env python3
"""
Production Super Admin Creation Script

Creates a super admin user for production deployment.
Run from the vertechie_fastapi directory (same folder as this file).

Usage:
    python create_production_superadmin.py --email admin@example.com --password "SecurePass123!"

    Or with environment variables:
    export SUPERADMIN_EMAIL=admin@example.com
    export SUPERADMIN_PASSWORD="SecurePass123!"
    python create_production_superadmin.py

    Or run with no args — you will be prompted for email and password.
    BOOTSTRAP_SUPERUSER_EMAIL / BOOTSTRAP_SUPERUSER_PASSWORD in .env are also accepted.
"""

from __future__ import annotations

import argparse
import asyncio
import getpass
import os
import re
import sys
from pathlib import Path
from uuid import uuid4

from sqlalchemy import insert, select

# Project root = directory containing this script (vertechie_fastapi)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.access_role_utils import (
    build_display_label,
    compute_permission_signature,
    generate_internal_name,
    sorted_unique_permission_codes,
)
from app.core.role_mapping import default_permissions_for_role_type
from app.core.security import get_password_hash
from app.db.session import AsyncSessionLocal
from app.models.user import (
    RoleType,
    User,
    UserProfile,
    UserRole,
    VerificationStatus,
    user_roles,
)


def validate_password(password: str) -> tuple[bool, str]:
    """
    Validate password strength.
    Returns (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"

    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"

    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"

    if not re.search(r"\d", password):
        return False, "Password must contain at least one digit"

    if not re.search(r"[@$!%*?&]", password):
        return False, "Password must contain at least one special character (@$!%*?&)"

    weak_passwords = ["password", "admin", "12345678", "qwerty", "letmein"]
    if password.lower() in weak_passwords:
        return False, "Password is too common. Please choose a stronger password"

    return True, ""


def validate_email(email: str) -> bool:
    """Validate email format."""
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(email_pattern, email) is not None


async def create_superadmin(
    email: str, password: str, first_name: str | None = None, last_name: str | None = None
) -> bool:
    """
    Create a super admin user.

    Args:
        email: Super admin email address
        password: Super admin password (will be validated)
        first_name: Optional first name (defaults to "Super")
        last_name: Optional last name (defaults to "Admin")

    Returns:
        True if created successfully, False otherwise
    """
    if not validate_email(email):
        print(f"❌ Invalid email format: {email}")
        return False

    is_valid, error_msg = validate_password(password)
    if not is_valid:
        print(f"❌ Password validation failed: {error_msg}")
        return False

    async with AsyncSessionLocal() as db:
        try:
            result = await db.execute(select(User).where(User.is_superuser == True))
            existing_superuser = result.scalar_one_or_none()

            if existing_superuser:
                print(f"⚠️  Superuser already exists: {existing_superuser.email}")
                print("   Only one superuser is allowed by this script.")
                return False

            result = await db.execute(select(User).where(User.email == email))
            if result.scalar_one_or_none():
                print(f"❌ User with email {email} already exists")
                return False

            email_prefix = email.split("@")[0]
            username = f"{email_prefix}_{uuid4().hex[:6]}"

            superuser = User(
                id=uuid4(),
                email=email,
                hashed_password=get_password_hash(password),
                first_name=first_name or "Super",
                last_name=last_name or "Admin",
                username=username,
                vertechie_id=f"VT{uuid4().hex[:8].upper()}",
                is_active=True,
                is_verified=True,
                email_verified=True,
                mobile_verified=True,
                is_superuser=True,
                verification_status=VerificationStatus.APPROVED,
                admin_roles=["superadmin", "admin", "learnadmin"],
            )

            db.add(superuser)
            await db.flush()

            profile = UserProfile(
                user_id=superuser.id,
            )
            db.add(profile)
            await db.flush()

            perms = sorted_unique_permission_codes(
                default_permissions_for_role_type(RoleType.SUPER_ADMIN)
            )
            sig = compute_permission_signature(perms)
            result = await db.execute(
                select(UserRole).where(
                    UserRole.role_type == RoleType.SUPER_ADMIN,
                    UserRole.permission_signature == sig,
                )
            )
            role = result.scalar_one_or_none()

            if not role:
                role = UserRole(
                    name=generate_internal_name(),
                    role_type=RoleType.SUPER_ADMIN,
                    description="Full system access super administrator",
                    permissions=perms,
                    permission_signature=sig,
                    display_label=build_display_label(RoleType.SUPER_ADMIN, perms),
                    is_active=True,
                )
                db.add(role)
                await db.flush()

            await db.execute(
                insert(user_roles).values(user_id=superuser.id, role_id=role.id)
            )

            await db.commit()

            print("\n✅ Super Admin created successfully!")
            print(f"\n📧 Email: {email}")
            print(f"👤 Username: {username}")
            print(f"🆔 VerTechie ID: {superuser.vertechie_id}")
            print(f"🔑 Admin Roles: {superuser.admin_roles}")
            print("\n⚠️  IMPORTANT: Save these credentials securely!")
            print("⚠️  Change the password after first login in production!")

            return True

        except Exception as e:
            await db.rollback()
            print(f"❌ Error creating super admin: {str(e)}")
            import traceback

            traceback.print_exc()
            return False


def _load_dotenv_for_cli() -> None:
    """Populate os.environ from .env so SUPERADMIN_* / BOOTSTRAP_SUPERUSER_* work without export."""
    try:
        from dotenv import load_dotenv
    except ImportError:
        return
    load_dotenv(Path(__file__).resolve().parent / ".env", override=False)


def main() -> None:
    _load_dotenv_for_cli()

    parser = argparse.ArgumentParser(
        description="Create a super admin user for production",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python create_production_superadmin.py --email admin@example.com --password "SecurePass123!"
  SUPERADMIN_EMAIL=a@b.com SUPERADMIN_PASSWORD='...' python create_production_superadmin.py
  python create_production_superadmin.py
  (no args: prompts for email/password if SUPERADMIN_* / BOOTSTRAP_SUPERUSER_* unset)
        """,
    )

    parser.add_argument(
        "--email",
        type=str,
        help="Super admin email (default: $SUPERADMIN_EMAIL or $BOOTSTRAP_SUPERUSER_EMAIL)",
        default=os.getenv("SUPERADMIN_EMAIL") or os.getenv("BOOTSTRAP_SUPERUSER_EMAIL"),
    )

    parser.add_argument(
        "--password",
        type=str,
        help="Super admin password (default: $SUPERADMIN_PASSWORD or $BOOTSTRAP_SUPERUSER_PASSWORD)",
        default=os.getenv("SUPERADMIN_PASSWORD") or os.getenv("BOOTSTRAP_SUPERUSER_PASSWORD"),
    )

    parser.add_argument(
        "--first-name",
        type=str,
        help='First name (optional, defaults to "Super")',
        default=None,
    )

    parser.add_argument(
        "--last-name",
        type=str,
        help='Last name (optional, defaults to "Admin")',
        default=None,
    )

    args = parser.parse_args()

    email = (args.email or "").strip() or None
    password = (args.password or "").strip() or None

    if not email:
        email = input("Super admin email: ").strip()
    if not password:
        password = getpass.getpass("Super admin password: ")

    if not email:
        print("❌ Email is required.")
        sys.exit(1)
    if not password:
        print("❌ Password is required.")
        sys.exit(1)

    success = asyncio.run(
        create_superadmin(
            email=email,
            password=password,
            first_name=args.first_name,
            last_name=args.last_name,
        )
    )

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
