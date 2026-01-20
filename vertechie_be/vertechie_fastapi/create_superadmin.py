"""
Script to create a new superadmin account.
"""

import asyncio
import sys
sys.path.insert(0, '.')

from uuid import uuid4
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.core.security import get_password_hash


async def create_superadmin():
    """Create a new superadmin account."""
    
    # Set your credentials here
    email = "superadmin@vertechie.com"
    password = "superadmin@123!"
    first_name = "Super"
    last_name = "Admin"
    
    async with AsyncSessionLocal() as session:
        # Check if user already exists
        result = await session.execute(
            select(User).where(User.email == email)
        )
        existing = result.scalar_one_or_none()
        
        if existing:
            print(f"❌ User already exists: {email}")
            print("   Use reset_superadmin.py to reset the password.")
            return False
        
        # Create superadmin
        user = User(
            id=uuid4(),
            email=email,
            hashed_password=get_password_hash(password),
            first_name=first_name,
            last_name=last_name,
            vertechie_id=f"VT{uuid4().hex[:8].upper()}",
            username=f"superadmin_{uuid4().hex[:6]}",
            is_active=True,
            is_verified=True,
            is_superuser=True,
            admin_roles=["superadmin", "admin", "learnadmin"],
        )
        
        session.add(user)
        await session.commit()
        
        print(f"✅ Superadmin created successfully!")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"\n⚠️  Change this password in production!")
        return True


if __name__ == "__main__":
    print("🔄 Creating superadmin...")
    asyncio.run(create_superadmin())
