"""
Script to remove all techie and HM user data from the database.
Keeps admin/superadmin users intact.

Run: python cleanup_users.py
"""

import asyncio
from sqlalchemy import select, delete, text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.models.user import User, UserProfile, Experience, Education, user_roles
from app.models.job import Job, JobApplication
from app.models.notification import Notification
from app.models.hiring import Interview
from app.core.config import settings


async def cleanup_users():
    """Remove all non-admin users and their data."""
    
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as db:
        # Disable autoflush to prevent cascade issues
        db.autoflush = False
        
        # Get all users
        result = await db.execute(select(User))
        users = result.scalars().all()
        
        # Store user info before any deletions
        user_info = []
        for user in users:
            user_info.append({
                'id': user.id,
                'email': user.email,
                'is_superuser': user.is_superuser,
                'admin_roles': user.admin_roles,
            })
        
        print(f"\n{'='*60}")
        print(f"Found {len(user_info)} total users")
        print(f"{'='*60}\n")
        
        # Separate admin and non-admin users
        admin_users = []
        users_to_delete = []
        
        for user in user_info:
            is_admin = (
                user['is_superuser'] or 
                (user['admin_roles'] and len(user['admin_roles']) > 0) or
                'admin' in user['email'].lower() or
                'superadmin' in user['email'].lower()
            )
            
            if is_admin:
                admin_users.append(user)
                print(f"✓ KEEPING (Admin): {user['email']}")
            else:
                users_to_delete.append(user)
                print(f"✗ DELETING: {user['email']} (Techie/HM)")
        
        print(f"\n{'='*60}")
        print(f"Summary:")
        print(f"  - Admin users to keep: {len(admin_users)}")
        print(f"  - Techie/HM users to delete: {len(users_to_delete)}")
        print(f"{'='*60}\n")
        
        if not users_to_delete:
            print("No users to delete. Database is clean.")
            return
        
        # Confirm deletion
        confirm = input("Type 'DELETE' to confirm deletion of all techie/HM users: ")
        if confirm != 'DELETE':
            print("Deletion cancelled.")
            return
        
        print("\nDeleting users and their data...")
        
        # Delete in order of dependencies (most dependent first)
        for user in users_to_delete:
            user_id = user['id']
            user_email = user['email']
            print(f"\nProcessing: {user_email}")
            
            try:
                # Delete interviews
                try:
                    await db.execute(delete(Interview).where(Interview.candidate_id == user_id))
                    print(f"  - Deleted interviews")
                except Exception as e:
                    pass
                
                # Delete notifications
                try:
                    await db.execute(delete(Notification).where(Notification.user_id == user_id))
                    print(f"  - Deleted notifications")
                except Exception as e:
                    pass
                
                # Delete job applications (as applicant)
                try:
                    await db.execute(delete(JobApplication).where(JobApplication.applicant_id == user_id))
                    print(f"  - Deleted job applications")
                except Exception as e:
                    pass
                
                # Delete jobs posted by this user (HM)
                try:
                    await db.execute(delete(Job).where(Job.posted_by_id == user_id))
                    print(f"  - Deleted jobs posted")
                except Exception as e:
                    pass
                
                # Delete experiences
                try:
                    await db.execute(delete(Experience).where(Experience.user_id == user_id))
                    print(f"  - Deleted experiences")
                except Exception as e:
                    pass
                
                # Delete educations
                try:
                    await db.execute(delete(Education).where(Education.user_id == user_id))
                    print(f"  - Deleted educations")
                except Exception as e:
                    pass
                
                # Delete profile
                try:
                    await db.execute(delete(UserProfile).where(UserProfile.user_id == user_id))
                    print(f"  - Deleted profile")
                except Exception as e:
                    pass
                
                # Delete user role associations
                try:
                    await db.execute(delete(user_roles).where(user_roles.c.user_id == user_id))
                    print(f"  - Deleted role associations")
                except Exception as e:
                    pass
                
                # Delete the user using raw SQL to avoid cascade issues
                await db.execute(text(f"DELETE FROM users WHERE id = '{user_id}'"))
                print(f"  ✓ Deleted user: {user_email}")
                
            except Exception as e:
                print(f"  ✗ Error: {e}")
                await db.rollback()
                continue
        
        # Commit all deletions
        await db.commit()
        
        print(f"\n{'='*60}")
        print(f"Cleanup Complete!")
        print(f"  - Deleted {len(users_to_delete)} users and their data")
        print(f"  - {len(admin_users)} admin users remain")
        print(f"{'='*60}")


if __name__ == "__main__":
    asyncio.run(cleanup_users())
