"""
Seed job_title_catalog from the canonical list (kept in sync with frontend fallback).
Run from project root: python -m scripts.seed_job_title_catalog
"""

import asyncio

from sqlalchemy import delete
from sqlalchemy.dialects.postgresql import insert

from app.db.session import AsyncSessionLocal, init_db
from app.models.job_title_catalog import JobTitleCatalog

# Same set as vertechie_fe-main/frontend/src/utils/jobTitleSuggestions.ts (extend either side together).
# Deduped, professional titles only — no draft/test-style phrases.
CATALOG_TITLES = sorted(
    {
        # —— Software & platform ——
        ".NET Developer",
        "AI Engineer",
        "Android Developer",
        "Angular Developer",
        "Automation Test Engineer",
        "Backend Developer",
        "Blockchain Developer",
        "Cloud Architect",
        "Cloud Engineer",
        "C# Developer",
        "Data Analyst",
        "Data Engineer",
        "Data Scientist",
        "Database Administrator",
        "DevOps Engineer",
        "Embedded Software Engineer",
        "Engineering Manager",
        "Frontend Developer",
        "Full Stack Developer",
        "Go Developer",
        "iOS Developer",
        "Java Architect",
        "Java Developer",
        "Java Technical Lead",
        "Kotlin Developer",
        "Machine Learning Engineer",
        "Mobile App Developer",
        "Node.js Developer",
        "PHP Developer",
        "Platform Engineer",
        "Principal Software Engineer",
        "Python Developer",
        "QA Engineer",
        "React Developer",
        "React Native Developer",
        "Ruby on Rails Developer",
        "Rust Developer",
        "Salesforce Developer",
        "Security Engineer",
        "Senior Java Developer",
        "Senior Software Engineer",
        "Site Reliability Engineer",
        "Software Architect",
        "Software Engineer",
        "Solutions Architect",
        "Spring Boot Developer",
        "Staff Software Engineer",
        "Swift Developer",
        "Systems Engineer",
        "Technical Lead",
        "TypeScript Developer",
        "Vue.js Developer",
        "Web Developer",
        # —— Product, design, delivery ——
        "Agile Coach",
        "Business Analyst",
        "Delivery Manager",
        "Product Designer",
        "Product Manager",
        "Product Owner",
        "Program Manager",
        "Project Manager",
        "Scrum Master",
        "Technical Program Manager",
        "UI UX Designer",
        "UX Researcher",
        "Visual Designer",
        # —— Data & research ——
        "BI Developer",
        "Business Intelligence Analyst",
        "Data Architect",
        "ETL Developer",
        "Research Scientist",
        # —— Infrastructure & IT ——
        "IT Administrator",
        "Network Administrator",
        "Network Engineer",
        "System Administrator",
        "Technical Support Engineer",
        # —— Sales, marketing, growth ——
        "Account Executive",
        "Account Manager",
        "Brand Manager",
        "Business Development Manager",
        "Content Marketing Manager",
        "Content Strategist",
        "Digital Marketing Manager",
        "Growth Marketing Manager",
        "Marketing Manager",
        "Marketing Specialist",
        "Product Marketing Manager",
        "Sales Development Representative",
        "Sales Engineer",
        "Sales Manager",
        "SEO Specialist",
        "Social Media Manager",
        # —— Customer & operations ——
        "Business Operations Manager",
        "Chief Operating Officer",
        "Customer Success Manager",
        "Customer Support Specialist",
        "Operations Analyst",
        "Operations Manager",
        "Program Coordinator",
        "Supply Chain Analyst",
        "Supply Chain Manager",
        # —— People & HR ——
        "HR Business Partner",
        "HR Generalist",
        "HR Manager",
        "Learning and Development Specialist",
        "People Operations Manager",
        "Recruiter",
        "Talent Acquisition Specialist",
        # —— Finance & accounting ——
        "Accountant",
        "Accounts Payable Specialist",
        "Chief Financial Officer",
        "Controller",
        "Financial Analyst",
        "Financial Controller",
        "Payroll Specialist",
        # —— Legal & compliance ——
        "Compliance Officer",
        "Contract Manager",
        "Legal Counsel",
        "Paralegal",
        "Privacy Officer",
        "Risk Analyst",
        # —— Content & creative ——
        "Copywriter",
        "Graphic Designer",
        "Motion Designer",
        "Photographer",
        "Technical Writer",
        "Video Editor",
        # —— Healthcare (common hiring titles) ——
        "Clinical Research Associate",
        "Medical Coder",
        "Nurse Practitioner",
        "Occupational Therapist",
        "Pharmacist",
        "Physical Therapist",
        "Physician",
        "Physician Assistant",
        "Registered Nurse",
        "Respiratory Therapist",
        # —— Education ——
        "Academic Advisor",
        "Curriculum Developer",
        "Instructional Designer",
        "Professor",
        "School Administrator",
        "Teacher",
        "Training Manager",
        # —— Field & skilled trades ——
        "Civil Engineer",
        "Electrician",
        "Field Service Engineer",
        "HVAC Technician",
        "Mechanical Engineer",
        "Plumber",
        "Project Engineer",
        "Quality Assurance Manager",
        "Warehouse Manager",
    }
)


async def main() -> None:
    await init_db()
    count = 0
    async with AsyncSessionLocal() as session:
        for title in CATALOG_TITLES:
            t = title.strip()
            if not t:
                continue
            stmt = insert(JobTitleCatalog).values(title=t).on_conflict_do_update(
                index_elements=["title"],
                set_={"title": t},
            )
            await session.execute(stmt)
            count += 1
        # Drop titles removed from the canonical list (keeps DB aligned with code).
        catalog_list = list(CATALOG_TITLES)
        await session.execute(delete(JobTitleCatalog).where(~JobTitleCatalog.title.in_(catalog_list)))
        await session.commit()
    print(f"Seeded {count} job title catalog rows.")


if __name__ == "__main__":
    asyncio.run(main())
