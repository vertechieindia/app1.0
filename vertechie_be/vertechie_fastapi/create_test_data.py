"""
Create test data for super admin testing.
Adds sample users, jobs, companies, etc.
"""

import asyncio
import sys
sys.path.insert(0, '.')

from uuid import uuid4
from sqlalchemy import select, text
from app.db.session import AsyncSessionLocal
from app.models.user import User, UserProfile, VerificationStatus
from app.models.company import Company
from app.models.job import Job, JobType, ExperienceLevel, JobStatus
from app.core.security import get_password_hash


async def create_test_data():
    """Create comprehensive test data."""
    
    async with AsyncSessionLocal() as db:
        print("🔄 Creating test data for super admin...\n")
        
        # 1. Ensure super admin exists
        result = await db.execute(
            select(User).where(User.email == "superadmin@vertechie.com")
        )
        superadmin = result.scalar_one_or_none()
        
        if not superadmin:
            print("❌ Super admin not found. Please create it first.")
            return
        
        print(f"✅ Super admin found: {superadmin.email}\n")
        
        # 2. Create a test company
        company_result = await db.execute(
            select(Company).where(Company.name == "TechCorp Inc")
        )
        company = company_result.scalar_one_or_none()
        
        if not company:
            company = Company(
                id=uuid4(),
                name="TechCorp Inc",
                slug="techcorp-inc",
                industry="Technology",
                company_size="LARGE",
                description="Leading technology company",
                website="https://techcorp.com",
                is_verified=True,
                is_featured=True,
            )
            db.add(company)
            await db.flush()
            print("✅ Created test company: TechCorp Inc")
        else:
            print("✅ Company already exists: TechCorp Inc")
        
        # 3. Create test jobs
        job_titles = [
            "Senior Software Engineer",
            "Full Stack Developer",
            "DevOps Engineer",
            "Data Scientist",
            "Product Manager"
        ]
        
        created_jobs = 0
        for title in job_titles:
            # Check if exists using raw SQL
            check_result = await db.execute(text('''
                SELECT id FROM jobs 
                WHERE title = :title AND company_id = :company_id
            '''), {'title': title, 'company_id': company.id})
            if check_result.fetchone():
                continue
            
            # Use raw SQL to insert with correct enum value
            job_id = uuid4()
            slug = f"{title.lower().replace(' ', '-')}-{uuid4().hex[:6]}"
            await db.execute(text('''
                INSERT INTO jobs (
                    id, title, slug, description, short_description,
                    company_id, posted_by_id, job_type, experience_level,
                    location, salary_min, salary_max, skills_required, 
                    skills_preferred, status, created_at, updated_at
                ) VALUES (
                    :id, :title, :slug, :description, :short_description,
                    :company_id, :posted_by_id, :job_type::jobtype, :experience_level::experiencelevel,
                    :location, :salary_min, :salary_max, :skills_required::json,
                    :skills_preferred::json, :status::jobstatus, NOW(), NOW()
                )
            '''), {
                'id': job_id,
                'title': title,
                'slug': slug,
                'description': f"Join our team as a {title}. Great opportunity!",
                'short_description': f"Exciting role for {title}",
                'company_id': company.id,
                'posted_by_id': superadmin.id,
                'job_type': 'FULL_TIME',
                'experience_level': 'SENIOR',
                'location': 'San Francisco, CA',
                'salary_min': 100000,
                'salary_max': 150000,
                'skills_required': '["Python", "React", "Node.js"]',
                'skills_preferred': '["AWS", "Docker"]',
                'status': 'ACTIVE'
            })
            created_jobs += 1
        
        if created_jobs > 0:
            await db.flush()
            print(f"✅ Created {created_jobs} test jobs")
        else:
            print("✅ Test jobs already exist")
        
        # 4. Create test techie users (if they don't exist)
        test_techies = [
            {
                "email": "john.doe@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "skills": ["Python", "React", "Node.js"],
                "headline": "Full Stack Developer"
            },
            {
                "email": "jane.smith@example.com",
                "first_name": "Jane",
                "last_name": "Smith",
                "skills": ["Java", "Spring Boot", "AWS"],
                "headline": "Backend Engineer"
            },
        ]
        
        created_techies = 0
        for techie_data in test_techies:
            user_result = await db.execute(
                select(User).where(User.email == techie_data["email"])
            )
            if not user_result.scalar_one_or_none():
                user = User(
                    id=uuid4(),
                    email=techie_data["email"],
                    hashed_password=get_password_hash("TestPass@123"),
                    first_name=techie_data["first_name"],
                    last_name=techie_data["last_name"],
                    username=f"{techie_data['first_name'].lower()}.{techie_data['last_name'].lower()}",
                    vertechie_id=f"VT{uuid4().hex[:8].upper()}",
                    is_active=True,
                    is_verified=True,
                    email_verified=True,
                    mobile_verified=True,
                    verification_status=VerificationStatus.APPROVED.value,
                )
                db.add(user)
                await db.flush()
                
                # Create profile
                profile = UserProfile(
                    user_id=user.id,
                    headline=techie_data["headline"],
                    skills=techie_data["skills"],
                    open_to_work=True,
                )
                db.add(profile)
                created_techies += 1
        
        if created_techies > 0:
            await db.flush()
            print(f"✅ Created {created_techies} test techie users")
        else:
            print("✅ Test techies already exist")
        
        await db.commit()
        
        print("\n✅ Test data creation complete!")
        print("\n📊 Summary:")
        print(f"   - Super Admin: {superadmin.email}")
        print(f"   - Company: TechCorp Inc")
        print(f"   - Jobs: {len(job_titles)} positions")
        print(f"   - Test Techies: {len(test_techies)} users")
        print("\n🔑 Test User Credentials:")
        print("   Email: john.doe@example.com")
        print("   Password: TestPass@123")
        print("   Email: jane.smith@example.com")
        print("   Password: TestPass@123")


if __name__ == "__main__":
    asyncio.run(create_test_data())
