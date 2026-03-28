
import asyncio
from sqlalchemy import text
from app.db.session import engine

async def check_jobs_table():
    async with engine.begin() as conn:
        result = await conn.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'jobs'
        """))
        for row in result.fetchall():
            print(f"Column: {row[0]}, Type: {row[1]}")

if __name__ == "__main__":
    asyncio.run(check_jobs_table())
