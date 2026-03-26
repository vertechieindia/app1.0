
import asyncio
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.user import UserRole, RoleType

async def check_roles():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(UserRole))
        roles = result.scalars().all()
        print(f"Total roles found: {len(roles)}")
        for role in roles:
            print(f"Name: {role.name}, Type: {role.role_type}")

if __name__ == "__main__":
    asyncio.run(check_roles())
