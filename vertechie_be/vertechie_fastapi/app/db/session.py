"""
Database session management with async SQLAlchemy.
"""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool

from app.core.config import settings
import os

# Create async engine with proper connection pooling
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=10,  # Maximum number of connections in the pool
    max_overflow=20,  # Maximum overflow connections
    pool_timeout=30,  # Timeout for getting a connection from the pool
    pool_recycle=3600,  # Recycle connections after 1 hour
    pool_pre_ping=True,  # Verify connections before using them
    future=True,
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that provides a database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize the database (create tables)."""
    from app.db.base import Base
    # Import all models to register them with Base
    import app.models  # noqa - This imports all models
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create default superuser if it doesn't exist
    await create_default_superuser()


async def create_default_superuser() -> None:
    """Create a default superuser if one doesn't exist."""
    from sqlalchemy import select
    from app.models.user import User
    from app.core.security import get_password_hash
    from uuid import uuid4
    import logging
    
    logger = logging.getLogger(__name__)
    
    async with AsyncSessionLocal() as session:
        try:
            # Check if any superuser exists
            result = await session.execute(
                select(User).where(User.is_superuser == True)
            )
            existing_superuser = result.scalar_one_or_none()
            
            if existing_superuser:
                logger.info(f"Superuser already exists: {existing_superuser.email}")
                return
            
            # Create default superuser only when explicit credentials are provided.
            default_email = os.getenv("BOOTSTRAP_SUPERUSER_EMAIL", "").strip()
            default_password = os.getenv("BOOTSTRAP_SUPERUSER_PASSWORD", "").strip()

            if not default_email or not default_password:
                logger.info("Bootstrap superuser skipped: BOOTSTRAP_SUPERUSER_EMAIL/PASSWORD not set")
                return
            
            # Check if this specific email already exists
            result = await session.execute(
                select(User).where(User.email == default_email)
            )
            if result.scalar_one_or_none():
                logger.info(f"User with email {default_email} already exists")
                return
            
            superuser = User(
                id=uuid4(),
                email=default_email,
                hashed_password=get_password_hash(default_password),
                first_name="Super",
                last_name="Admin",
                vertechie_id=f"VT{uuid4().hex[:8].upper()}",
                username=f"superadmin_{uuid4().hex[:6]}",
                is_active=True,
                is_verified=True,
                is_superuser=True,
                is_staff=True,
                admin_roles=["superadmin", "admin", "learnadmin"],
            )
            
            session.add(superuser)
            await session.commit()
            
            logger.info(f"Bootstrap superuser created: {default_email}")
            
        except Exception as e:
            logger.error(f"Error creating default superuser: {e}")
            await session.rollback()


async def close_db() -> None:
    """Close database connections."""
    await engine.dispose()

