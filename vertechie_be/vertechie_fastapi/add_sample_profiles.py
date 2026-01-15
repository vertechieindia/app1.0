"""
Script to add sample profile data (education, experience, skills) to existing users.
"""

import asyncio
import uuid
from datetime import date
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.models.user import User, UserProfile, Experience, Education
from app.core.config import settings


async def add_sample_profiles():
    """Add sample profile data to existing users."""
    
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as db:
        # Get all users
        result = await db.execute(select(User))
        users = result.scalars().all()
        
        print(f"Found {len(users)} users")
        
        for user in users:
            print(f"\nProcessing user: {user.email}")
            
            # Check if profile exists
            profile_result = await db.execute(
                select(UserProfile).where(UserProfile.user_id == user.id)
            )
            profile = profile_result.scalar_one_or_none()
            
            if not profile:
                # Create profile with sample data
                if "admin" in user.email.lower():
                    profile = UserProfile(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        headline="Platform Administrator",
                        bio="Experienced administrator managing the VerTechie platform. Passionate about connecting talent with opportunities.",
                        skills=["Python", "FastAPI", "React", "PostgreSQL", "Docker", "AWS"],
                        location="Bangalore, India",
                        experience_years=8,
                        current_company="VerTechie",
                        current_position="Platform Administrator",
                    )
                elif "hm" in user.email.lower() or "hiring" in user.first_name.lower() if user.first_name else False:
                    profile = UserProfile(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        headline="HR Manager at TM Innovations",
                        bio="Passionate HR professional with 7+ years of experience in talent acquisition. Specialized in tech hiring and building diverse teams.",
                        skills=["Talent Acquisition", "HR Management", "Recruitment", "People Management", "Team Building"],
                        location="Theni, Tamil Nadu, India",
                        experience_years=7,
                        current_company="TM Innovations",
                        current_position="HR Manager",
                    )
                else:
                    profile = UserProfile(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        headline="Full Stack Developer",
                        bio="Passionate full-stack developer with expertise in React, Node.js, and Python. Love building scalable applications and solving complex problems.",
                        skills=["React", "TypeScript", "Node.js", "Python", "MongoDB", "AWS", "Docker"],
                        location="Chennai, India",
                        experience_years=5,
                        current_company="Tech Solutions Inc",
                        current_position="Senior Software Engineer",
                    )
                db.add(profile)
                print(f"  ✅ Created profile")
            else:
                # Update existing profile with skills if empty
                if not profile.skills:
                    profile.skills = ["React", "TypeScript", "Python", "AWS"]
                    print(f"  ✅ Updated skills")
            
            # Check if education exists
            edu_result = await db.execute(
                select(Education).where(Education.user_id == user.id)
            )
            educations = edu_result.scalars().all()
            
            if not educations:
                # Add sample education (using school_name instead of institution)
                if "admin" in user.email.lower():
                    edu1 = Education(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        school_name="Indian Institute of Technology, Delhi",
                        degree="Master of Technology",
                        field_of_study="Computer Science",
                        start_year=2012,
                        end_year=2014,
                        description="Specialized in Machine Learning and Distributed Systems"
                    )
                    edu2 = Education(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        school_name="Anna University",
                        degree="Bachelor of Engineering",
                        field_of_study="Computer Science and Engineering",
                        start_year=2008,
                        end_year=2012,
                        description="First class with distinction"
                    )
                    db.add_all([edu1, edu2])
                elif "hm" in user.email.lower():
                    edu1 = Education(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        school_name="XLRI Jamshedpur",
                        degree="MBA",
                        field_of_study="Human Resource Management",
                        start_year=2015,
                        end_year=2017,
                        description="Specialized in Strategic HR and Talent Management"
                    )
                    edu2 = Education(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        school_name="Madurai Kamaraj University",
                        degree="Bachelor of Commerce",
                        field_of_study="Business Administration",
                        start_year=2011,
                        end_year=2014,
                        description="Graduated with honors"
                    )
                    db.add_all([edu1, edu2])
                else:
                    edu1 = Education(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        school_name="VIT University",
                        degree="Bachelor of Technology",
                        field_of_study="Computer Science and Engineering",
                        start_year=2015,
                        end_year=2019,
                        description="CGPA: 8.5/10. Participated in multiple hackathons."
                    )
                    db.add(edu1)
                print(f"  ✅ Added education")
            
            # Check if experience exists
            exp_result = await db.execute(
                select(Experience).where(Experience.user_id == user.id)
            )
            experiences = exp_result.scalars().all()
            
            if not experiences:
                # Add sample experience (using company_name instead of company)
                if "admin" in user.email.lower():
                    exp1 = Experience(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        title="Platform Administrator",
                        company_name="VerTechie",
                        location="Bangalore, India",
                        start_date=date(2022, 1, 1),
                        end_date=None,
                        is_current=True,
                        description="Managing the VerTechie platform, overseeing user management, and ensuring platform stability."
                    )
                    exp2 = Experience(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        title="Senior Software Engineer",
                        company_name="Infosys",
                        location="Bangalore, India",
                        start_date=date(2018, 6, 1),
                        end_date=date(2021, 12, 31),
                        is_current=False,
                        description="Led a team of 5 developers building enterprise solutions using Python and React."
                    )
                    db.add_all([exp1, exp2])
                elif "hm" in user.email.lower():
                    exp1 = Experience(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        title="HR Manager",
                        company_name="TM Innovations",
                        location="Theni, Tamil Nadu, India",
                        start_date=date(2020, 1, 1),
                        end_date=None,
                        is_current=True,
                        description="Leading talent acquisition for tech roles. Hired 50+ engineers in the past 2 years."
                    )
                    exp2 = Experience(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        title="HR Executive",
                        company_name="TCS",
                        location="Chennai, India",
                        start_date=date(2017, 7, 1),
                        end_date=date(2019, 12, 31),
                        is_current=False,
                        description="Managed campus recruitment and onboarding for 200+ freshers annually."
                    )
                    db.add_all([exp1, exp2])
                else:
                    exp1 = Experience(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        title="Senior Software Engineer",
                        company_name="Tech Solutions Inc",
                        location="Chennai, India",
                        start_date=date(2021, 6, 1),
                        end_date=None,
                        is_current=True,
                        description="Building scalable microservices using Python and FastAPI. Leading frontend development with React."
                    )
                    exp2 = Experience(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        title="Software Developer",
                        company_name="Zoho Corporation",
                        location="Chennai, India",
                        start_date=date(2019, 7, 1),
                        end_date=date(2021, 5, 31),
                        is_current=False,
                        description="Developed CRM modules using Java and JavaScript. Worked on performance optimization."
                    )
                    db.add_all([exp1, exp2])
                print(f"  ✅ Added experience")
        
        await db.commit()
        print("\n✅ All sample data added successfully!")


if __name__ == "__main__":
    asyncio.run(add_sample_profiles())
