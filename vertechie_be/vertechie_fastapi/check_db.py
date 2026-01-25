"""
Check if the database is reachable using the app's DATABASE_URL.
Run from project root: python check_db.py
"""
import asyncio
import sys


async def check_db():
    from sqlalchemy import text
    from app.core.config import settings
    from app.db.session import engine

    url = settings.DATABASE_URL
    # Mask password in output
    if "@" in url and ":" in url:
        try:
            pre, rest = url.split("@", 1)
            if "://" in pre:
                scheme, rest2 = pre.split("://", 1)
                if ":" in rest2:
                    user, _ = rest2.split(":", 1)
                    masked = f"{scheme}://{user}:****@{rest}"
                else:
                    masked = f"{scheme}://****@{rest}"
            else:
                masked = "****@..." + rest[-20:]
        except Exception:
            masked = url[:50] + "..."
    else:
        masked = url[:60] + "..." if len(url) > 60 else url

    print(f"DATABASE_URL: {masked}")
    print("Connecting...")

    try:
        async with engine.connect() as conn:
            # MySQL: SELECT 1; PostgreSQL: SELECT 1;
            await conn.execute(text("SELECT 1"))
        print("OK: Database is connected.")
        return 0
    except Exception as e:
        print(f"ERROR: Database connection failed: {e}")
        return 1
    finally:
        await engine.dispose()


if __name__ == "__main__":
    sys.exit(asyncio.run(check_db()))
