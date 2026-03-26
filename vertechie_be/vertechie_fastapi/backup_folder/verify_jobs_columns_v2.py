
import asyncio
from sqlalchemy import text
from app.db.session import engine

async def check_jobs_table():
    async with engine.begin() as conn:
        result = await conn.execute(text("""
            SELECT column_name, data_type, table_schema
            FROM information_schema.columns 
            WHERE table_name = 'jobs'
            AND column_name IN ('coding_questions', 'screening_questions', 'title')
        """))
        rows = result.fetchall()
        print(f"Found {len(rows)} matching columns")
        for row in rows:
            print(f"Schema: {row[2]}, Column: {row[0]}, Type: {row[1]}")

if __name__ == "__main__":
    asyncio.run(check_jobs_table())
