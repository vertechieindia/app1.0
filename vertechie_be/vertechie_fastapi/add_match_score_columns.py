"""
Migration script to add match_score, matched_skills, and missing_skills columns
to the job_applications table.

Run this script once to update the database schema:
    cd vertechie_be/vertechie_fastapi
    python add_match_score_columns.py
"""

import asyncio
from sqlalchemy import text
from app.db.session import engine


async def migrate():
    """Add match_score columns to job_applications table."""
    
    print("Starting migration: Adding match_score columns to job_applications...")
    
    async with engine.begin() as conn:
        # SQLite uses PRAGMA to check table info
        result = await conn.execute(text("PRAGMA table_info(job_applications)"))
        columns = [row[1] for row in result.fetchall()]
        
        print(f"Existing columns: {columns}")
        
        # Add match_score column if not exists
        if 'match_score' not in columns:
            print("Adding column: match_score")
            try:
                await conn.execute(text(
                    "ALTER TABLE job_applications ADD COLUMN match_score INTEGER"
                ))
                print("  ✓ match_score column added")
            except Exception as e:
                print(f"  ! Warning: {e}")
        else:
            print("  - match_score column already exists")
        
        # Add matched_skills column if not exists
        if 'matched_skills' not in columns:
            print("Adding column: matched_skills")
            try:
                await conn.execute(text(
                    "ALTER TABLE job_applications ADD COLUMN matched_skills TEXT DEFAULT '[]'"
                ))
                print("  ✓ matched_skills column added")
            except Exception as e:
                print(f"  ! Warning: {e}")
        else:
            print("  - matched_skills column already exists")
        
        # Add missing_skills column if not exists
        if 'missing_skills' not in columns:
            print("Adding column: missing_skills")
            try:
                await conn.execute(text(
                    "ALTER TABLE job_applications ADD COLUMN missing_skills TEXT DEFAULT '[]'"
                ))
                print("  ✓ missing_skills column added")
            except Exception as e:
                print(f"  ! Warning: {e}")
        else:
            print("  - missing_skills column already exists")
    
    print("\n✅ Migration completed successfully!")
    print("\nNote: The match_score will be calculated automatically when")
    print("      a Techie applies for a job, based on their profile skills")
    print("      compared to the job's required skills.")


if __name__ == "__main__":
    asyncio.run(migrate())
