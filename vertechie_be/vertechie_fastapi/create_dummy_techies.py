"""
Script to create 12 dummy techie users with pending approval status.
6 users will have education and work experience filled in.
"""

import asyncio
import uuid
from datetime import datetime, date
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# Import models
import sys
sys.path.insert(0, '/Users/thenianandraj/Downloads/app_1.0/app1.0/vertechie_be/vertechie_fastapi')

from app.models.user import User, UserRole, UserProfile, Experience, Education, RoleType, VerificationStatus, EmploymentType
from app.core.security import get_password_hash
from app.core.config import settings

# Dummy data for techies
DUMMY_TECHIES = [
    # Users WITH education and experience (1-6)
    {
        "first_name": "Rahul",
        "last_name": "Sharma",
        "email": "rahul.sharma@example.com",
        "phone": "+91 98765 43210",
        "country": "India",
        "dob": date(1995, 3, 15),
        "address": "123 MG Road, Bangalore, Karnataka",
        "has_details": True,
        "experience": {
            "title": "Senior Software Engineer",
            "company_name": "TCS",
            "employment_type": EmploymentType.FULL_TIME,
            "location": "Bangalore",
            "start_date": date(2020, 1, 1),
            "is_current": True,
            "description": "Working on enterprise Java applications",
            "skills": ["Java", "Spring Boot", "Microservices", "AWS"]
        },
        "education": {
            "school_name": "IIT Bombay",
            "degree": "B.Tech",
            "field_of_study": "Computer Science",
            "start_year": 2013,
            "end_year": 2017,
            "grade": "8.5 CGPA"
        }
    },
    {
        "first_name": "Priya",
        "last_name": "Patel",
        "email": "priya.patel@example.com",
        "phone": "+91 98765 43211",
        "country": "India",
        "dob": date(1993, 7, 22),
        "address": "456 Anna Nagar, Chennai, Tamil Nadu",
        "has_details": True,
        "experience": {
            "title": "Full Stack Developer",
            "company_name": "Infosys",
            "employment_type": EmploymentType.FULL_TIME,
            "location": "Chennai",
            "start_date": date(2018, 6, 1),
            "is_current": True,
            "description": "Building React and Node.js applications",
            "skills": ["React", "Node.js", "MongoDB", "TypeScript"]
        },
        "education": {
            "school_name": "Anna University",
            "degree": "M.Tech",
            "field_of_study": "Information Technology",
            "start_year": 2015,
            "end_year": 2017,
            "grade": "9.0 CGPA"
        }
    },
    {
        "first_name": "Amit",
        "last_name": "Kumar",
        "email": "amit.kumar@example.com",
        "phone": "+91 98765 43212",
        "country": "India",
        "dob": date(1990, 11, 5),
        "address": "789 Sector 62, Noida, Uttar Pradesh",
        "has_details": True,
        "experience": {
            "title": "DevOps Engineer",
            "company_name": "Wipro",
            "employment_type": EmploymentType.FULL_TIME,
            "location": "Noida",
            "start_date": date(2017, 3, 1),
            "is_current": True,
            "description": "Managing CI/CD pipelines and cloud infrastructure",
            "skills": ["Docker", "Kubernetes", "Jenkins", "Terraform", "Azure"]
        },
        "education": {
            "school_name": "BITS Pilani",
            "degree": "B.E.",
            "field_of_study": "Electronics and Communication",
            "start_year": 2008,
            "end_year": 2012,
            "grade": "7.8 CGPA"
        }
    },
    {
        "first_name": "Sneha",
        "last_name": "Reddy",
        "email": "sneha.reddy@example.com",
        "phone": "+91 98765 43213",
        "country": "India",
        "dob": date(1997, 2, 28),
        "address": "101 Banjara Hills, Hyderabad, Telangana",
        "has_details": True,
        "experience": {
            "title": "Data Scientist",
            "company_name": "Amazon",
            "employment_type": EmploymentType.FULL_TIME,
            "location": "Hyderabad",
            "start_date": date(2021, 8, 1),
            "is_current": True,
            "description": "Building ML models for recommendation systems",
            "skills": ["Python", "TensorFlow", "PyTorch", "SQL", "Spark"]
        },
        "education": {
            "school_name": "IIT Delhi",
            "degree": "M.Tech",
            "field_of_study": "Data Science",
            "start_year": 2019,
            "end_year": 2021,
            "grade": "9.2 CGPA"
        }
    },
    {
        "first_name": "Vikram",
        "last_name": "Singh",
        "email": "vikram.singh@example.com",
        "phone": "+91 98765 43214",
        "country": "India",
        "dob": date(1992, 8, 10),
        "address": "202 Connaught Place, New Delhi",
        "has_details": True,
        "experience": {
            "title": "iOS Developer",
            "company_name": "Flipkart",
            "employment_type": EmploymentType.FULL_TIME,
            "location": "Bangalore",
            "start_date": date(2019, 4, 1),
            "is_current": True,
            "description": "Developing iOS apps using Swift",
            "skills": ["Swift", "iOS", "Xcode", "Core Data", "SwiftUI"]
        },
        "education": {
            "school_name": "NIT Trichy",
            "degree": "B.Tech",
            "field_of_study": "Computer Science",
            "start_year": 2010,
            "end_year": 2014,
            "grade": "8.2 CGPA"
        }
    },
    {
        "first_name": "Ananya",
        "last_name": "Gupta",
        "email": "ananya.gupta@example.com",
        "phone": "+91 98765 43215",
        "country": "India",
        "dob": date(1996, 5, 18),
        "address": "303 Salt Lake, Kolkata, West Bengal",
        "has_details": True,
        "experience": {
            "title": "Frontend Developer",
            "company_name": "Zoho",
            "employment_type": EmploymentType.FULL_TIME,
            "location": "Chennai",
            "start_date": date(2020, 7, 1),
            "is_current": True,
            "description": "Building responsive web applications",
            "skills": ["JavaScript", "Vue.js", "CSS", "HTML5", "Tailwind"]
        },
        "education": {
            "school_name": "Jadavpur University",
            "degree": "B.Tech",
            "field_of_study": "Information Technology",
            "start_year": 2014,
            "end_year": 2018,
            "grade": "8.7 CGPA"
        }
    },
    # Users WITHOUT education and experience (7-12)
    {
        "first_name": "Karthik",
        "last_name": "Menon",
        "email": "karthik.menon@example.com",
        "phone": "+91 98765 43216",
        "country": "India",
        "dob": date(1994, 9, 12),
        "address": "404 Marine Drive, Mumbai, Maharashtra",
        "has_details": False
    },
    {
        "first_name": "Divya",
        "last_name": "Nair",
        "email": "divya.nair@example.com",
        "phone": "+91 98765 43217",
        "country": "India",
        "dob": date(1998, 1, 25),
        "address": "505 MG Road, Kochi, Kerala",
        "has_details": False
    },
    {
        "first_name": "Arjun",
        "last_name": "Iyer",
        "email": "arjun.iyer@example.com",
        "phone": "+91 98765 43218",
        "country": "India",
        "dob": date(1991, 6, 30),
        "address": "606 Residency Road, Bangalore, Karnataka",
        "has_details": False
    },
    {
        "first_name": "Meera",
        "last_name": "Krishnan",
        "email": "meera.krishnan@example.com",
        "phone": "+91 98765 43219",
        "country": "India",
        "dob": date(1995, 12, 8),
        "address": "707 T Nagar, Chennai, Tamil Nadu",
        "has_details": False
    },
    {
        "first_name": "Rohan",
        "last_name": "Desai",
        "email": "rohan.desai@example.com",
        "phone": "+91 98765 43220",
        "country": "India",
        "dob": date(1993, 4, 3),
        "address": "808 FC Road, Pune, Maharashtra",
        "has_details": False
    },
    {
        "first_name": "Pooja",
        "last_name": "Joshi",
        "email": "pooja.joshi@example.com",
        "phone": "+91 98765 43221",
        "country": "India",
        "dob": date(1997, 10, 17),
        "address": "909 Civil Lines, Jaipur, Rajasthan",
        "has_details": False
    },
]


async def create_dummy_techies():
    """Create 12 dummy techie users."""
    
    # Create async engine and session
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as db:
        # Get or create the Techie role
        result = await db.execute(
            select(UserRole).where(UserRole.role_type == RoleType.TECHIE)
        )
        techie_role = result.scalar_one_or_none()
        
        if not techie_role:
            techie_role = UserRole(
                id=uuid.uuid4(),
                name="Techie",
                role_type=RoleType.TECHIE,
                description="Tech professional",
                is_active=True
            )
            db.add(techie_role)
            await db.flush()
            print("Created Techie role")
        
        created_count = 0
        for i, techie_data in enumerate(DUMMY_TECHIES, 1):
            # Check if user already exists
            result = await db.execute(
                select(User).where(User.email == techie_data["email"])
            )
            existing_user = result.scalar_one_or_none()
            
            if existing_user:
                print(f"User {techie_data['email']} already exists, skipping...")
                continue
            
            # Generate unique IDs
            user_id = uuid.uuid4()
            vertechie_id = f"VT{str(uuid.uuid4())[:8].upper()}"
            
            # Create user
            user = User(
                id=user_id,
                email=techie_data["email"],
                hashed_password=get_password_hash("TechiePass@123"),
                first_name=techie_data["first_name"],
                last_name=techie_data["last_name"],
                phone=techie_data["phone"],
                mobile_number=techie_data["phone"],
                country=techie_data["country"],
                dob=techie_data["dob"],
                address=techie_data["address"],
                username=f"{techie_data['first_name'].lower()}.{techie_data['last_name'].lower()}",
                vertechie_id=vertechie_id,
                is_active=True,
                is_verified=False,
                email_verified=True,
                mobile_verified=True,
                face_verification=True,
                verification_status=VerificationStatus.PENDING,
            )
            db.add(user)
            
            # Add role to user
            user.roles.append(techie_role)
            
            # Create user profile
            profile = UserProfile(
                id=uuid.uuid4(),
                user_id=user_id,
                headline=f"{techie_data['first_name']} - Tech Professional",
                bio=f"Passionate software developer from {techie_data['country']}",
                location=techie_data["address"].split(",")[-1].strip() if "," in techie_data["address"] else techie_data["country"],
                open_to_work=True,
                skills=[] if not techie_data.get("has_details") else techie_data.get("experience", {}).get("skills", []),
            )
            db.add(profile)
            
            # Add experience and education for first 6 users
            if techie_data.get("has_details"):
                exp_data = techie_data["experience"]
                experience = Experience(
                    id=uuid.uuid4(),
                    user_id=user_id,
                    title=exp_data["title"],
                    company_name=exp_data["company_name"],
                    employment_type=exp_data["employment_type"],
                    location=exp_data["location"],
                    start_date=exp_data["start_date"],
                    is_current=exp_data["is_current"],
                    description=exp_data["description"],
                    skills=exp_data["skills"],
                    is_verified=False
                )
                db.add(experience)
                
                edu_data = techie_data["education"]
                education = Education(
                    id=uuid.uuid4(),
                    user_id=user_id,
                    school_name=edu_data["school_name"],
                    degree=edu_data["degree"],
                    field_of_study=edu_data["field_of_study"],
                    start_year=edu_data["start_year"],
                    end_year=edu_data["end_year"],
                    grade=edu_data["grade"],
                    is_verified=False
                )
                db.add(education)
                
                print(f"✅ Created user {i}/12: {techie_data['first_name']} {techie_data['last_name']} (WITH experience & education)")
            else:
                print(f"✅ Created user {i}/12: {techie_data['first_name']} {techie_data['last_name']} (WITHOUT experience & education)")
            
            created_count += 1
        
        await db.commit()
        print(f"\n🎉 Successfully created {created_count} dummy techie users with PENDING approval status!")
        print("Password for all users: TechiePass@123")


if __name__ == "__main__":
    asyncio.run(create_dummy_techies())
