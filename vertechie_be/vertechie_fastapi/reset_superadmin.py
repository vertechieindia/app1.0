"""
Script to reset the superadmin password.
Run this if you can't login to the superadmin account.
"""

import asyncio
import sys
sys.path.insert(0, '.')

from sqlalchemy import select, update
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.core.security import get_password_hash


async def reset_superadmin_password():
    """Reset the superadmin password to 'admin123'."""
    
    new_password = "admin123"
    email = "superadmin@vertechie.com"
    
    async with AsyncSessionLocal() as session:
        # Find the superadmin
        result = await session.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            print(f"❌ No user found with email: {email}")
            return False
        
        # Update password
        user.hashed_password = get_password_hash(new_password)
        await session.commit()
        
        print(f"✅ Password reset successful!")
        print(f"   Email: {email}")
        print(f"   New Password: {new_password}")
        print(f"\n⚠️  Change this password in production!")
        return True


if __name__ == "__main__":
    print("🔄 Resetting superadmin password...")
    asyncio.run(reset_superadmin_password())
