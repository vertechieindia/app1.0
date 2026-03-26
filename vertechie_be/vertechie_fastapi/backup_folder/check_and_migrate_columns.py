"""
Comprehensive script to check all model columns against database
and add any missing columns.
"""

import asyncio
import sys
sys.path.insert(0, '.')

from sqlalchemy import text, inspect
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.db.session import engine
from app.db.base import Base

# Import all models to register them
from app.models import user, job, company, school, blog, calendar, chat
from app.models import community, course, hiring, ide, learn, network
from app.models import notification, practice, quiz, lesson


def get_sqlalchemy_type(column):
    """Convert SQLAlchemy column type to PostgreSQL SQL type."""
    col_type = type(column.type).__name__
    
    # Handle common types
    if 'String' in col_type:
        length = getattr(column.type, 'length', None)
        if length:
            return f'VARCHAR({length})'
        return 'VARCHAR(255)'
    elif 'Text' in col_type:
        return 'TEXT'
    elif 'Integer' in col_type:
        return 'INTEGER'
    elif 'Boolean' in col_type:
        return 'BOOLEAN'
    elif 'DateTime' in col_type:
        return 'TIMESTAMP'
    elif 'Date' in col_type:
        return 'DATE'
    elif 'Float' in col_type or 'Numeric' in col_type:
        return 'FLOAT'
    elif 'JSON' in col_type:
        return 'JSON'
    elif 'UUID' in col_type or 'GUID' in col_type:
        return 'UUID'
    elif 'Enum' in col_type:
        # For enums, use VARCHAR
        return 'VARCHAR(50)'
    else:
        # Try to get from string representation
        type_str = str(column.type)
        if 'VARCHAR' in type_str:
            return 'VARCHAR(255)'
        return 'TEXT'  # Default fallback


async def check_and_add_columns():
    """Check all models and add missing columns."""
    
    all_tables = Base.metadata.sorted_tables
    print(f"Checking {len(all_tables)} tables...\n")
    
    async with engine.begin() as conn:
        for table in all_tables:
            table_name = table.name
            print(f"📋 Table: {table_name}")
            
            # Get existing columns in database
            result = await conn.execute(text(f"""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = '{table_name}'
                ORDER BY ordinal_position
            """))
            db_columns = {row[0]: row[1] for row in result.fetchall()}
            
            # Get model columns
            model_columns = {}
            for column in table.columns:
                model_columns[column.name] = column
            
            # Find missing columns
            missing = []
            for col_name, col in model_columns.items():
                if col_name not in db_columns:
                    missing.append((col_name, col))
            
            if missing:
                print(f"   ⚠️  Missing {len(missing)} columns:")
                for col_name, col in missing:
                    sql_type = get_sqlalchemy_type(col)
                    nullable = "NULL" if col.nullable else "NOT NULL"
                    default = ""
                    
                    # Handle default values
                    if col.default is not None:
                        if hasattr(col.default, 'arg'):
                            default_val = col.default.arg
                            if isinstance(default_val, bool):
                                default = f" DEFAULT {str(default_val).upper()}"
                            elif isinstance(default_val, (int, float)):
                                default = f" DEFAULT {default_val}"
                            elif isinstance(default_val, str):
                                default = f" DEFAULT '{default_val}'"
                    
                    # Add column
                    try:
                        alter_sql = f"ALTER TABLE {table_name} ADD COLUMN {col_name} {sql_type} {nullable}{default}"
                        await conn.execute(text(alter_sql))
                        print(f"      ✅ Added: {col_name} ({sql_type})")
                    except Exception as e:
                        print(f"      ❌ Failed to add {col_name}: {str(e)}")
            else:
                print(f"   ✅ All columns exist")
            
            print()
    
    print("✅ Column migration complete!")


if __name__ == "__main__":
    asyncio.run(check_and_add_columns())
