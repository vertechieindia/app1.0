"""
Script to remove user data from the database.
Options:
  - Delete only Techies (keep HMs and admins)
  - Delete both Techies and HMs (keep only admins)

Run: python cleanup_users.py
"""

import asyncio
from sqlalchemy import select, delete, text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, selectinload

from app.models.user import User, UserProfile, Experience, Education, user_roles, UserRole
from app.models.job import Job, JobApplication
from app.models.notification import Notification
from app.models.hiring import Interview
from app.core.config import settings


async def cleanup_users():
    """Remove users based on selection."""
    
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as db:
        # Disable autoflush to prevent cascade issues
        db.autoflush = False
        
        # Get all users with their roles
        result = await db.execute(
            select(User).options(selectinload(User.roles))
        )
        users = result.scalars().all()
        
        # Store user info before any deletions
        user_info = []
        for user in users:
            # Get role names
            role_names = [role.name.lower() if hasattr(role, 'name') else str(role).lower() for role in (user.roles or [])]
            
            user_info.append({
                'id': user.id,
                'email': user.email,
                'is_superuser': user.is_superuser,
                'admin_roles': user.admin_roles,
                'role_names': role_names,
            })
        
        print(f"\n{'='*60}")
        print(f"Found {len(user_info)} total users")
        print(f"{'='*60}\n")
        
        # Categorize users
        admin_users = []
        hm_users = []
        techie_users = []
        
        for user in user_info:
            is_admin = (
                user['is_superuser'] or 
                (user['admin_roles'] and len(user['admin_roles']) > 0) or
                'admin' in user['email'].lower() or
                'superadmin' in user['email'].lower()
            )
            
            is_hm = (
                'hiring_manager' in user['role_names'] or
                'hr' in user['role_names'] or
                'hm' in user['email'].lower()
            )
            
            if is_admin:
                admin_users.append(user)
                print(f"✓ ADMIN: {user['email']}")
            elif is_hm:
                hm_users.append(user)
                print(f"◆ HM: {user['email']}")
            else:
                techie_users.append(user)
                print(f"○ TECHIE: {user['email']}")
        
        print(f"\n{'='*60}")
        print(f"Summary:")
        print(f"  - Admin users: {len(admin_users)}")
        print(f"  - HM users: {len(hm_users)}")
        print(f"  - Techie users: {len(techie_users)}")
        print(f"{'='*60}\n")
        
        # Ask what to delete
        print("What would you like to delete?")
        print("  1. Delete ONLY Techies (keep HMs and Admins)")
        print("  2. Delete Techies AND HMs (keep only Admins)")
        print("  3. Cancel")
        
        choice = input("\nEnter your choice (1/2/3): ").strip()
        
        if choice == '1':
            users_to_delete = techie_users
            print(f"\nWill delete {len(users_to_delete)} techie users")
        elif choice == '2':
            users_to_delete = techie_users + hm_users
            print(f"\nWill delete {len(users_to_delete)} users (techies + HMs)")
        else:
            print("Deletion cancelled.")
            return
        
        if not users_to_delete:
            print("No users to delete. Database is clean.")
            return
        
        # Confirm deletion
        confirm = input("\nType 'DELETE' to confirm: ")
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
                # Delete interviews via applications
                try:
                    apps_result = await db.execute(select(JobApplication.id).where(JobApplication.applicant_id == user_id))
                    app_ids = [row[0] for row in apps_result.fetchall()]
                    if app_ids:
                        await db.execute(delete(Interview).where(Interview.application_id.in_(app_ids)))
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


async def cleanup_users_auto(delete_hm: bool = False):
    """Non-interactive cleanup - delete techies (and optionally HMs)."""
    
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as db:
        db.autoflush = False
        
        # Get all users with their roles
        result = await db.execute(
            select(User).options(selectinload(User.roles))
        )
        users = result.scalars().all()
        
        # Categorize users
        admin_users = []
        hm_users = []
        techie_users = []
        
        for user in users:
            role_names = [role.name.lower() if hasattr(role, 'name') else str(role).lower() for role in (user.roles or [])]
            
            is_admin = (
                user.is_superuser or 
                (user.admin_roles and len(user.admin_roles) > 0) or
                'admin' in user.email.lower() or
                'superadmin' in user.email.lower()
            )
            
            is_hm = (
                'hiring_manager' in role_names or
                'hr' in role_names or
                'hm' in user.email.lower()
            )
            
            if is_admin:
                admin_users.append({'id': user.id, 'email': user.email})
            elif is_hm:
                hm_users.append({'id': user.id, 'email': user.email})
            else:
                techie_users.append({'id': user.id, 'email': user.email})
        
        print(f"\nFound: {len(admin_users)} admins, {len(hm_users)} HMs, {len(techie_users)} techies")
        
        # Determine users to delete
        if delete_hm:
            users_to_delete = techie_users + hm_users
        else:
            users_to_delete = techie_users
        
        if not users_to_delete:
            print("No users to delete.")
            return
        
        print(f"\nDeleting {len(users_to_delete)} users...")
        
        # Delete users
        for user in users_to_delete:
            user_id = user['id']
            user_email = user['email']
            
            try:
                # Get application IDs for this user to delete related interviews
                apps_result = await db.execute(select(JobApplication.id).where(JobApplication.applicant_id == user_id))
                app_ids = [row[0] for row in apps_result.fetchall()]
                if app_ids:
                    await db.execute(delete(Interview).where(Interview.application_id.in_(app_ids)))
                await db.execute(delete(Notification).where(Notification.user_id == user_id))
                await db.execute(delete(JobApplication).where(JobApplication.applicant_id == user_id))
                await db.execute(delete(Job).where(Job.posted_by_id == user_id))
                await db.execute(delete(Experience).where(Experience.user_id == user_id))
                await db.execute(delete(Education).where(Education.user_id == user_id))
                await db.execute(delete(UserProfile).where(UserProfile.user_id == user_id))
                await db.execute(delete(user_roles).where(user_roles.c.user_id == user_id))
                await db.execute(text(f"DELETE FROM users WHERE id = '{user_id}'"))
                print(f"  ✓ Deleted: {user_email}")
            except Exception as e:
                print(f"  ✗ Error deleting {user_email}: {e}")
                await db.rollback()
                continue
        
        await db.commit()
        print(f"\n✓ Cleanup complete! Deleted {len(users_to_delete)} users.")


if __name__ == "__main__":
    import sys
    
    # Check for command line arguments
    if len(sys.argv) > 1:
        arg = sys.argv[1].lower()
        if arg == '--techies-only' or arg == '-t':
            print("Running in non-interactive mode: Delete ONLY Techies")
            asyncio.run(cleanup_users_auto(delete_hm=False))
        elif arg == '--all' or arg == '-a':
            print("Running in non-interactive mode: Delete Techies AND HMs")
            asyncio.run(cleanup_users_auto(delete_hm=True))
        elif arg == '--help' or arg == '-h':
            print("Usage: python cleanup_users.py [OPTIONS]")
            print("\nOptions:")
            print("  -t, --techies-only  Delete only techie users (keep HMs and Admins)")
            print("  -a, --all           Delete techies AND HMs (keep only Admins)")
            print("  -h, --help          Show this help message")
            print("\nWithout options, runs in interactive mode.")
        else:
            print(f"Unknown option: {arg}")
            print("Use --help for usage information")
    else:
        asyncio.run(cleanup_users())
