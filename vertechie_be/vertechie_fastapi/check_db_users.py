
import asyncio
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.user import User

async def check_users():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User))
        users = result.scalars().all()
        print(f"Total users found: {len(users)}")
        for user in users:
            print(f"Email: {user.email}, Hashed Password: {user.hashed_password}, Active: {user.is_active}")

if __name__ == "__main__":
    asyncio.run(check_users())
