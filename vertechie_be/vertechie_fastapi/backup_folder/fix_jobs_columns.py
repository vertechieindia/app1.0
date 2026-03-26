
import asyncio
from sqlalchemy import text
from app.db.session import engine

async def fix_jobs_table():
    async with engine.begin() as conn:
        print("Adding coding_questions...")
        try:
            await conn.execute(text("ALTER TABLE jobs ADD COLUMN coding_questions JSON DEFAULT '[]'"))
            print("Successfully added coding_questions")
        except Exception as e:
            print(f"Error adding coding_questions: {e}")
            
        print("Adding screening_questions...")
        try:
            await conn.execute(text("ALTER TABLE jobs ADD COLUMN screening_questions JSON DEFAULT '[]'"))
            print("Successfully added screening_questions")
        except Exception as e:
            print(f"Error adding screening_questions: {e}")

if __name__ == "__main__":
    asyncio.run(fix_jobs_table())
