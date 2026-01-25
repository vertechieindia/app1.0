#!/usr/bin/env python3
"""
Production Super Admin Creation Script

Creates a super admin user for production deployment.
Can be run manually or via deployment pipeline.

Usage:
    python create_production_superadmin.py --email admin@example.com --password "SecurePass123!"
    
    Or with environment variables:
    export SUPERADMIN_EMAIL=admin@example.com
    export SUPERADMIN_PASSWORD="SecurePass123!"
    python create_production_superadmin.py
"""

import asyncio
import sys
import os
import argparse
import re
from uuid import uuid4
from sqlalchemy import select, insert
from sqlalchemy.orm import selectinload

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.session import AsyncSessionLocal
from app.models.user import User, UserProfile, UserRole, RoleType, VerificationStatus, user_roles
from app.core.security import get_password_hash


def validate_password(password: str) -> tuple[bool, str]:
    """
    Validate password strength.
    Returns (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one digit"
    
    if not re.search(r'[@$!%*?&]', password):
        return False, "Password must contain at least one special character (@$!%*?&)"
    
    # Check for common weak passwords
    weak_passwords = ['password', 'admin', '12345678', 'qwerty', 'letmein']
    if password.lower() in weak_passwords:
        return False, "Password is too common. Please choose a stronger password"
    
    return True, ""


def validate_email(email: str) -> bool:
    """Validate email format."""
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_pattern, email) is not None


async def create_superadmin(email: str, password: str, first_name: str = None, last_name: str = None) -> bool:
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
    # Validate email
    if not validate_email(email):
        print(f"❌ Invalid email format: {email}")
        return False
    
    # Validate password
    is_valid, error_msg = validate_password(password)
    if not is_valid:
        print(f"❌ Password validation failed: {error_msg}")
        return False
    
    async with AsyncSessionLocal() as db:
        try:
            # Check if superuser already exists
            result = await db.execute(
                select(User).where(User.is_superuser == True)
            )
            existing_superuser = result.scalar_one_or_none()
            
            if existing_superuser:
                print(f"⚠️  Superuser already exists: {existing_superuser.email}")
                print(f"   If you want to create another superuser, please use a different email.")
                return False
            
            # Check if email already exists
            result = await db.execute(
                select(User).where(User.email == email)
            )
            if result.scalar_one_or_none():
                print(f"❌ User with email {email} already exists")
                return False
            
            # Generate username from email
            email_prefix = email.split('@')[0]
            username = f"{email_prefix}_{uuid4().hex[:6]}"
            
            # Create superuser (verification_status=APPROVED since superadmin is pre-verified)
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
            
            # Create profile
            profile = UserProfile(
                user_id=superuser.id,
            )
            db.add(profile)
            await db.flush()
            
            # Get or create SUPER_ADMIN role
            result = await db.execute(
                select(UserRole).where(UserRole.role_type == RoleType.SUPER_ADMIN)
            )
            role = result.scalar_one_or_none()
            
            if not role:
                role = UserRole(
                    name="Super Admin",
                    role_type=RoleType.SUPER_ADMIN,
                    description="Full system access super administrator",
                )
                db.add(role)
                await db.flush()
            
            # Add role association
            await db.execute(
                insert(user_roles).values(user_id=superuser.id, role_id=role.id)
            )
            
            await db.commit()
            
            print("\n✅ Super Admin created successfully!")
            print(f"\n📧 Email: {email}")
            print(f"👤 Username: {username}")
            print(f"🆔 VerTechie ID: {superuser.vertechie_id}")
            print(f"🔑 Admin Roles: {superuser.admin_roles}")
            print(f"\n⚠️  IMPORTANT: Save these credentials securely!")
            print(f"⚠️  Change the password after first login in production!")
            
            return True
            
        except Exception as e:
            await db.rollback()
            print(f"❌ Error creating super admin: {str(e)}")
            import traceback
            traceback.print_exc()
            return False


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Create a super admin user for production",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Using command-line arguments
  python create_production_superadmin.py --email admin@example.com --password "SecurePass123!"
  
  # Using environment variables
  export SUPERADMIN_EMAIL=admin@example.com
  export SUPERADMIN_PASSWORD="SecurePass123!"
  python create_production_superadmin.py
  
  # With custom name
  python create_production_superadmin.py --email admin@example.com --password "SecurePass123!" --first-name "John" --last-name "Doe"
        """
    )
    
    parser.add_argument(
        '--email',
        type=str,
        help='Super admin email address',
        default=os.getenv('SUPERADMIN_EMAIL')
    )
    
    parser.add_argument(
        '--password',
        type=str,
        help='Super admin password (min 8 chars, uppercase, lowercase, digit, special char)',
        default=os.getenv('SUPERADMIN_PASSWORD')
    )
    
    parser.add_argument(
        '--first-name',
        type=str,
        help='First name (optional, defaults to "Super")',
        default=None
    )
    
    parser.add_argument(
        '--last-name',
        type=str,
        help='Last name (optional, defaults to "Admin")',
        default=None
    )
    
    args = parser.parse_args()
    
    # Validate required arguments
    if not args.email:
        print("❌ Error: Email is required")
        print("   Use --email argument or set SUPERADMIN_EMAIL environment variable")
        parser.print_help()
        sys.exit(1)
    
    if not args.password:
        print("❌ Error: Password is required")
        print("   Use --password argument or set SUPERADMIN_PASSWORD environment variable")
        parser.print_help()
        sys.exit(1)
    
    # Run async function
    success = asyncio.run(create_superadmin(
        email=args.email,
        password=args.password,
        first_name=args.first_name,
        last_name=args.last_name
    ))
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
