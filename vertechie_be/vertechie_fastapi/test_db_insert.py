
import asyncio
from uuid import uuid4
from datetime import datetime
from sqlalchemy import text
from app.db.session import engine

async def test_insert_job():
    async with engine.begin() as conn:
        slug = f"test-job-{uuid4().hex[:8]}"
        try:
            await conn.execute(text(f"""
                INSERT INTO jobs (
                    id, title, slug, description, posted_by_id, 
                    job_type, experience_level, status, 
                    coding_questions, screening_questions,
                    created_at, updated_at
                ) VALUES (
                    '{uuid4()}', 'Test Job', '{slug}', 'Test Description', '9052f73d-b021-496c-915c-ca8d5c06ad23',
                    'FULL_TIME', 'MID', 'PUBLISHED', 
                    '[]', '[]',
                    NOW(), NOW()
                )
            """))
            print("Successfully inserted test job")
            await conn.execute(text(f"DELETE FROM jobs WHERE slug = '{slug}'"))
            print("Successfully cleaned up test job")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_insert_job())
