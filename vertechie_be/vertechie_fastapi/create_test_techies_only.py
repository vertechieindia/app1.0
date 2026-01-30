"""
Create only the basic test techie users needed for login.

This avoids the failing raw SQL job insertion in create_test_data.py
and just ensures there are a couple of verified techies with known
credentials you can use to log into the app.

Usage (from vertechie_be/vertechie_fastapi):

    # On Windows PowerShell
    $env:PYTHONIOENCODING = "utf-8"
    python create_test_techies_only.py
"""

import asyncio
from uuid import uuid4

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.user import User, UserProfile, VerificationStatus, UserRole, RoleType, user_roles
from app.core.security import get_password_hash
from sqlalchemy import insert


TEST_TECHIES = [
    {
        "email": "john.doe@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "skills": ["Python", "React", "Node.js"],
        "headline": "Full Stack Developer",
    },
    {
        "email": "jane.smith@example.com",
        "first_name": "Jane",
        "last_name": "Smith",
        "skills": ["Java", "Spring Boot", "AWS"],
        "headline": "Backend Engineer",
    },
]

DEFAULT_PASSWORD = "TestPass@123"


async def create_test_techies() -> None:
    """Create only the test techie users with a known password."""
    async with AsyncSessionLocal() as db:
        print("Creating test techie users...\n")

        # 1. Ensure the Techie role exists
        result = await db.execute(
            select(UserRole).where(UserRole.role_type == RoleType.TECHIE)
        )
        techie_role = result.scalar_one_or_none()
        
        if not techie_role:
            print("Creating Techie role...")
            techie_role = UserRole(
                id=uuid4(),
                name="Techie",
                role_type=RoleType.TECHIE,
                description="Verified techie user role"
            )
            db.add(techie_role)
            await db.flush()
        else:
            print("Techie role already exists.")

        created_techies = 0

        for techie_data in TEST_TECHIES:
            # Check if user already exists
            result = await db.execute(
                select(User).where(User.email == techie_data["email"])
            )
            user = result.scalar_one_or_none()

            if user:
                print(f"Techie already exists: {techie_data['email']}")
                # Check if they have the role
                role_check = await db.execute(
                    select(user_roles).where(
                        user_roles.c.user_id == user.id,
                        user_roles.c.role_id == techie_role.id
                    )
                )
                if not role_check.first():
                    print(f"Assigning techie role to existing user: {techie_data['email']}")
                    await db.execute(
                        insert(user_roles).values(user_id=user.id, role_id=techie_role.id)
                    )
                    created_techies += 1 # Count as updated
                continue

            user = User(
                id=uuid4(),
                email=techie_data["email"],
                hashed_password=get_password_hash(DEFAULT_PASSWORD),
                first_name=techie_data["first_name"],
                last_name=techie_data["last_name"],
                username=f"{techie_data['first_name'].lower()}.{techie_data['last_name'].lower()}",
                vertechie_id=f"VT{uuid4().hex[:8].upper()}",
                is_active=True,
                is_verified=True,
                email_verified=True,
                mobile_verified=True,
                verification_status=VerificationStatus.APPROVED.value,
            )
            db.add(user)
            await db.flush()

            # Assign role
            await db.execute(
                insert(user_roles).values(user_id=user.id, role_id=techie_role.id)
            )

            profile = UserProfile(
                user_id=user.id,
                headline=techie_data["headline"],
                skills=techie_data["skills"],
                open_to_work=True,
            )
            db.add(profile)

            created_techies += 1
            print(f"Created techie: {techie_data['email']}")

        if created_techies:
            await db.commit()
            print(f"\nSuccessfully committed {created_techies} changes.")
        else:
            await db.rollback()
            print("\nNo changes to commit.")

        print("\nSummary:")
        print(f"   - Created/Updated techies: {created_techies}")
        print("\nTest Techie Credentials:")
        for techie in TEST_TECHIES:
            print(f"   Email: {techie['email']}")
            print(f"   Password: {DEFAULT_PASSWORD}")


if __name__ == "__main__":
    asyncio.run(create_test_techies())

