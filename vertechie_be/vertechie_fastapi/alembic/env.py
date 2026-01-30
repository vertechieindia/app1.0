"""
Alembic environment configuration for VerTechie FastAPI.

This file configures Alembic to work with async SQLAlchemy and PostgreSQL.
It reads the DATABASE_URL from app settings and imports all models.

Note: Alembic uses sync SQLAlchemy operations, so we convert the async URL
to a sync URL and use a sync engine.
"""

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from sqlalchemy.engine import Connection
from alembic import context

# Import app configuration
import sys
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.config import settings
from app.db.base import Base

# Import all models to ensure they're registered with Base.metadata
# This is required for autogenerate to work
import app.models  # noqa: F401

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def get_url():
    """
    Get database URL from app settings.
    Convert async URL (postgresql+asyncpg://) to sync URL (postgresql+psycopg2://) for Alembic.
    
    Alembic requires sync operations, so we need to use psycopg2 (sync driver)
    instead of asyncpg (async driver).
    """
    database_url = settings.DATABASE_URL
    
    # Convert asyncpg URL to psycopg2 URL for Alembic (which uses sync operations)
    if database_url.startswith("postgresql+asyncpg://"):
        # Replace asyncpg with psycopg2 for sync operations
        database_url = database_url.replace("postgresql+asyncpg://", "postgresql+psycopg2://")
    elif database_url.startswith("postgresql://"):
        # If no driver specified, add psycopg2
        database_url = database_url.replace("postgresql://", "postgresql+psycopg2://")
    else:
        # For other async drivers, try to convert
        if "+asyncpg" in database_url:
            database_url = database_url.replace("+asyncpg", "+psycopg2")
        elif "+aiomysql" in database_url:
            # If using MySQL async, convert to sync
            database_url = database_url.replace("+aiomysql", "+pymysql")
    
    return database_url


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.
    """
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    """
    Run migrations with the given connection.
    """
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.
    
    Alembic uses sync SQLAlchemy, so we use a sync engine with psycopg2.
    """
    # Get the database URL and convert to sync format
    url = get_url()
    
    # Create engine configuration
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = url
    
    # Create sync engine (Alembic requires sync operations)
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        do_run_migrations(connection)

    connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
