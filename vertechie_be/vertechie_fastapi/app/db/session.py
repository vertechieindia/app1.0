"""
Database session management with async SQLAlchemy.
"""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.core.config import settings

# Create async engine
# IMPORTANT:
# - For PostgreSQL (asyncpg) we enable pooling and server_settings.
# - For SQLite or other drivers we avoid pool_size / max_overflow / PG-only connect_args,
#   because those cause the "Invalid argument(s) 'pool_size','max_overflow' sent to create_engine"
#   error you are seeing in the logs.
if "postgresql" in settings.DATABASE_URL:
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=settings.DEBUG,
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        pool_pre_ping=True,  # Verify connections before using (reconnect if stale)
        pool_recycle=3600,  # Recycle connections after 1 hour
        future=True,
        connect_args={
            "server_settings": {
                "application_name": "vertechie_api",
            },
            "command_timeout": 30,  # 30 second query timeout
            "timeout": 10,  # 10 second connection timeout
        },
    )
else:
    # SQLite or other engines: keep config minimal and portable
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=settings.DEBUG,
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
    session = None
    try:
        session = AsyncSessionLocal()
        yield session
        await session.commit()
    except Exception as e:
        if session:
            await session.rollback()
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Database session error: {e}", exc_info=True)
        raise
    finally:
        if session:
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

            default_email = "superadmin@vertechie.com"
            default_password = "superadmin@123"

            if existing_superuser:
                # Migrate old default superuser to new credentials if present
                if existing_superuser.email == "admin@vertechie.com":
                    existing_superuser.email = default_email
                    existing_superuser.hashed_password = get_password_hash(default_password)
                    await session.commit()
                    logger.info(f"✅ Superuser migrated to {default_email}")
                else:
                    logger.info(f"Superuser already exists: {existing_superuser.email}")
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
                admin_roles=["superadmin", "admin", "learnadmin"],
            )

            session.add(superuser)
            await session.commit()

            logger.info(f"✅ Default superuser created: {default_email}")
            
        except Exception as e:
            logger.error(f"Error creating default superuser: {e}")
            await session.rollback()


async def close_db() -> None:
    """Close database connections."""
    await engine.dispose()

