import asyncio
from sqlalchemy import text
from app.db.session import SessionLocal

async def check_table():
    db = SessionLocal()
    try:
        # Check events table
        result = await db.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'events'"))
        columns = [row[0] for row in result.all()]
        print(f"Events table columns: {columns}")
        
        # Check if table exists
        result = await db.execute(text("SELECT count(*) FROM events"))
        print(f"Events count: {result.scalar()}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await db.close()

if __name__ == "__main__":
    asyncio.run(check_table())
