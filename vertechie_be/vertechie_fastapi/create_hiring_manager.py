"""
Script to create 1 Hiring Manager user for testing.
"""

import asyncio
import uuid
from datetime import datetime, date
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# Import models
import sys
sys.path.insert(0, '/Users/thenianandraj/Downloads/app_1.0/app1.0/vertechie_be/vertechie_fastapi')

from app.models.user import User, UserRole, UserProfile, RoleType, VerificationStatus
from app.core.security import get_password_hash
from app.core.config import settings

# Hiring Manager data
HIRING_MANAGER = {
    "first_name": "Anand",
    "last_name": "Hiring",
    "email": "hm@vertechie.com",
    "phone": "+91 98765 00001",
    "country": "India",
    "dob": date(1990, 1, 15),
    "address": "TM Innovations, Theni, Tamil Nadu",
    "company_name": "TM Innovations",
    "job_title": "HR Manager"
}


async def create_hiring_manager():
    """Create 1 Hiring Manager user."""
    
    # Create async engine and session
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as db:
        # Get or create the Hiring Manager role
        result = await db.execute(
            select(UserRole).where(UserRole.role_type == RoleType.HIRING_MANAGER)
        )
        hm_role = result.scalar_one_or_none()
        
        if not hm_role:
            hm_role = UserRole(
                id=uuid.uuid4(),
                name="Hiring Manager",
                role_type=RoleType.HIRING_MANAGER,
                description="Hiring Manager - can post jobs and access talent pool",
                is_active=True
            )
            db.add(hm_role)
            await db.flush()
            print("Created Hiring Manager role")
        
        # Check if user already exists
        result = await db.execute(
            select(User).where(User.email == HIRING_MANAGER["email"])
        )
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            print(f"User {HIRING_MANAGER['email']} already exists!")
            print(f"Email: {HIRING_MANAGER['email']}")
            print(f"Password: HiringManager@123")
            return
        
        # Generate unique IDs
        user_id = uuid.uuid4()
        vertechie_id = f"VT{str(uuid.uuid4())[:8].upper()}"
        
        # Create user
        user = User(
            id=user_id,
            email=HIRING_MANAGER["email"],
            hashed_password=get_password_hash("HiringManager@123"),
            first_name=HIRING_MANAGER["first_name"],
            last_name=HIRING_MANAGER["last_name"],
            phone=HIRING_MANAGER["phone"],
            mobile_number=HIRING_MANAGER["phone"],
            country=HIRING_MANAGER["country"],
            dob=HIRING_MANAGER["dob"],
            address=HIRING_MANAGER["address"],
            username=f"{HIRING_MANAGER['first_name'].lower()}.{HIRING_MANAGER['last_name'].lower()}",
            vertechie_id=vertechie_id,
            is_active=True,
            is_verified=True,  # Already verified
            email_verified=True,
            mobile_verified=True,
            face_verification=True,
            verification_status=VerificationStatus.APPROVED,  # Already approved
        )
        db.add(user)
        
        # Add role to user
        user.roles.append(hm_role)
        
        # Create user profile with company info
        profile = UserProfile(
            id=uuid.uuid4(),
            user_id=user_id,
            headline=f"{HIRING_MANAGER['job_title']} at {HIRING_MANAGER['company_name']}",
            bio=f"Hiring Manager at {HIRING_MANAGER['company_name']}. Looking for talented tech professionals.",
            location="Theni, Tamil Nadu, India",
            open_to_work=False,
            skills=["Recruitment", "HR Management", "Talent Acquisition"],
            current_company=HIRING_MANAGER['company_name'],
            current_position=HIRING_MANAGER['job_title'],
        )
        db.add(profile)
        
        await db.commit()
        
        print("✅ Created Hiring Manager user:")
        print(f"   Email: {HIRING_MANAGER['email']}")
        print(f"   Password: HiringManager@123")
        print(f"   Name: {HIRING_MANAGER['first_name']} {HIRING_MANAGER['last_name']}")
        print(f"   Status: APPROVED (can login immediately)")


if __name__ == "__main__":
    asyncio.run(create_hiring_manager())
