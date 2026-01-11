"""
Script to update existing Hiring Manager's profile with company info.
"""

import asyncio
import uuid
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

import sys
sys.path.insert(0, '/Users/thenianandraj/Downloads/app_1.0/app1.0/vertechie_be/vertechie_fastapi')

from app.models.user import User, UserProfile
from app.core.config import settings

COMPANY_NAME = "TM Innovations"
JOB_TITLE = "HR Manager"
HM_EMAIL = "hm@vertechie.com"


async def update_hm_company():
    """Update HM's profile with company info."""
    
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as db:
        # Find the HM user
        result = await db.execute(
            select(User).where(User.email == HM_EMAIL)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            print(f"User {HM_EMAIL} not found!")
            return
        
        # Find or create their profile
        result = await db.execute(
            select(UserProfile).where(UserProfile.user_id == user.id)
        )
        profile = result.scalar_one_or_none()
        
        if profile:
            # Update existing profile
            profile.current_company = COMPANY_NAME
            profile.current_position = JOB_TITLE
            profile.headline = f"{JOB_TITLE} at {COMPANY_NAME}"
            await db.commit()
            print(f"✅ Updated profile for {HM_EMAIL}")
            print(f"   Company: {COMPANY_NAME}")
            print(f"   Position: {JOB_TITLE}")
        else:
            # Create new profile
            new_profile = UserProfile(
                id=uuid.uuid4(),
                user_id=user.id,
                current_company=COMPANY_NAME,
                current_position=JOB_TITLE,
                headline=f"{JOB_TITLE} at {COMPANY_NAME}",
                bio=f"Hiring Manager at {COMPANY_NAME}. Looking for talented tech professionals.",
                location="Theni, Tamil Nadu, India",
                open_to_work=False,
                skills=["Recruitment", "HR Management", "Talent Acquisition"],
            )
            db.add(new_profile)
            await db.commit()
            print(f"✅ Created profile for {HM_EMAIL}")
            print(f"   Company: {COMPANY_NAME}")
            print(f"   Position: {JOB_TITLE}")


if __name__ == "__main__":
    asyncio.run(update_hm_company())
