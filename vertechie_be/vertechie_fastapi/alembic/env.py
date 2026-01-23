"""
Alembic environment configuration for VerTechie FastAPI.
Uses psycopg2 (sync) for migrations, while the app uses asyncpg.
"""

from logging.config import fileConfig

from sqlalchemy import create_engine, pool

from alembic import context

# Import your models and settings
import sys
sys.path.insert(0, '.')

from app.core.config import settings
from app.db.base import Base

# Import all models to ensure they're registered with Base.metadata
# This is required for autogenerate to detect all tables
from app.models import user, job, company, school, blog, calendar, chat
from app.models import community, course, hiring, ide, learn, network
from app.models import notification, practice, quiz, lesson


# this is the Alembic Config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Convert async URL to sync URL for Alembic
# postgresql+asyncpg://... -> postgresql://...
sync_database_url = settings.DATABASE_URL.replace("+asyncpg", "")

# Add your model's MetaData object for 'autogenerate' support
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.
    """
    context.configure(
        url=sync_database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.
    """
    connectable = create_engine(
        sync_database_url,
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,  # Detect column type changes
            compare_server_default=True,  # Detect default value changes
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
