"""
Job Portal API endpoints.
"""

from typing import Any, List, Optional
from uuid import UUID, uuid4
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from sqlalchemy.orm import selectinload
from slugify import slugify

from app.db.session import get_db
from app.models.job import Job, JobApplication, SavedJob, JobStatus, ApplicationStatus
from app.models.user import User
from app.schemas.job import (
    JobCreate, JobUpdate, JobResponse,
    JobApplicationCreate, JobApplicationResponse,
    SavedJobCreate, ApplicantInfo, JobApplicationWithApplicant
)
from app.core.security import get_current_user, get_current_admin_user

router = APIRouter()


@router.get("/", response_model=List[JobResponse])
async def list_jobs(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    job_type: Optional[str] = Query(None),
    experience_level: Optional[str] = Query(None),
    is_remote: Optional[bool] = Query(None),
    location: Optional[str] = Query(None),
    company_id: Optional[UUID] = Query(None),
) -> Any:
    """List published jobs."""
    
    query = select(Job).where(Job.status == JobStatus.PUBLISHED)
    
    if search:
        query = query.where(
            or_(
                Job.title.ilike(f"%{search}%"),
                Job.description.ilike(f"%{search}%"),
                Job.company_name.ilike(f"%{search}%"),
            )
        )
    
    if job_type:
        query = query.where(Job.job_type == job_type)
    
    if experience_level:
        query = query.where(Job.experience_level == experience_level)
    
    if is_remote is not None:
        query = query.where(Job.is_remote == is_remote)
    
    if location:
        query = query.where(Job.location.ilike(f"%{location}%"))
    
    if company_id:
        query = query.where(Job.company_id == company_id)
    
    query = query.order_by(Job.is_featured.desc(), Job.published_at.desc())
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    job_in: JobCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create a new job posting."""
    
    # Generate slug
    slug = f"{slugify(job_in.title)}-{uuid4().hex[:8]}"
    
    # Get the data and handle status
    job_data = job_in.model_dump()
    
    # Convert status string to enum
    status_str = job_data.pop('status', 'published')
    job_status = JobStatus.PUBLISHED if status_str == 'published' else JobStatus.DRAFT
    
    job = Job(
        **job_data,
        slug=slug,
        posted_by_id=current_user.id,
        status=job_status,
        published_at=datetime.utcnow() if job_status == JobStatus.PUBLISHED else None,
    )
    
    db.add(job)
    await db.commit()
    await db.refresh(job)
    
    return job


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get job by ID."""
    
    result = await db.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Increment view count
    job.views_count += 1
    await db.commit()
    
    return job


@router.put("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: UUID,
    job_in: JobUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update job posting."""
    
    result = await db.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check ownership
    if job.posted_by_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this job"
        )
    
    update_data = job_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)
    
    await db.commit()
    await db.refresh(job)
    
    return job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Delete job posting."""
    
    result = await db.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    if job.posted_by_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this job"
        )
    
    await db.delete(job)
    await db.commit()


@router.post("/{job_id}/publish")
async def publish_job(
    job_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Publish a job."""
    
    result = await db.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    if job.posted_by_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    job.status = JobStatus.PUBLISHED
    job.published_at = datetime.utcnow()
    
    await db.commit()
    
    return {"message": "Job published successfully"}


# ============= Applications =============

@router.post("/{job_id}/apply", response_model=JobApplicationResponse, status_code=status.HTTP_201_CREATED)
async def apply_to_job(
    job_id: UUID,
    application_in: JobApplicationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Apply to a job."""
    
    # Check job exists
    result = await db.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    
    if not job or job.status != JobStatus.PUBLISHED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or not accepting applications"
        )
    
    # Check if already applied
    result = await db.execute(
        select(JobApplication).where(
            JobApplication.job_id == job_id,
            JobApplication.applicant_id == current_user.id
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this job"
        )
    
    application = JobApplication(
        job_id=job_id,
        applicant_id=current_user.id,
        cover_letter=application_in.cover_letter,
        resume_url=application_in.resume_url,
        answers=application_in.answers,
        expected_salary=application_in.expected_salary,
        available_from=application_in.available_from,
        referral_source=application_in.referral_source,
    )
    
    db.add(application)
    
    # Update job application count
    job.applications_count += 1
    
    await db.commit()
    await db.refresh(application)
    
    return application


@router.get("/my/applications")
async def get_my_applications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status_filter: Optional[str] = Query(None),
) -> Any:
    """Get my job applications with job details."""
    from sqlalchemy.orm import selectinload
    
    query = select(JobApplication).options(
        selectinload(JobApplication.job)
    ).where(
        JobApplication.applicant_id == current_user.id
    )
    
    if status_filter:
        query = query.where(JobApplication.status == status_filter)
    
    query = query.order_by(JobApplication.submitted_at.desc())
    
    result = await db.execute(query)
    applications = result.scalars().all()
    
    # Build response with job details
    response = []
    for app in applications:
        app_dict = {
            "id": app.id,
            "job_id": app.job_id,
            "applicant_id": app.applicant_id,
            "status": app.status.value if hasattr(app.status, 'value') else str(app.status),
            "cover_letter": app.cover_letter,
            "resume_url": app.resume_url,
            "submitted_at": app.submitted_at,
            "reviewed_at": app.reviewed_at,
        }
        
        # Include job details
        if app.job:
            app_dict["job"] = {
                "id": app.job.id,
                "title": app.job.title,
                "company_name": app.job.company_name,
                "location": app.job.location,
                "job_type": app.job.job_type,
                "salary_min": app.job.salary_min,
                "salary_max": app.job.salary_max,
                "is_remote": app.job.is_remote,
            }
        
        response.append(app_dict)
    
    return response


@router.get("/{job_id}/applications", response_model=List[JobApplicationWithApplicant])
async def get_job_applications(
    job_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status_filter: Optional[str] = Query(None),
) -> Any:
    """Get applications for a job with full applicant details (job owner only)."""
    
    # Check job ownership
    result = await db.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    if job.posted_by_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    # Use selectinload to eagerly load applicant data
    query = select(JobApplication).options(
        selectinload(JobApplication.applicant)
    ).where(JobApplication.job_id == job_id)
    
    if status_filter:
        query = query.where(JobApplication.status == status_filter)
    
    query = query.order_by(JobApplication.submitted_at.desc())
    
    result = await db.execute(query)
    applications = result.scalars().all()
    
    # Build response with applicant info
    response = []
    for app in applications:
        applicant_info = None
        if app.applicant:
            # Get skills from user profile if available
            user_skills = []
            if hasattr(app.applicant, 'skills') and app.applicant.skills:
                user_skills = app.applicant.skills if isinstance(app.applicant.skills, list) else []
            
            applicant_info = ApplicantInfo(
                id=app.applicant.id,
                first_name=app.applicant.first_name,
                last_name=app.applicant.last_name,
                email=app.applicant.email,
                phone=getattr(app.applicant, 'phone', None),
                mobile_number=getattr(app.applicant, 'mobile_number', None),
                title=getattr(app.applicant, 'title', None) or getattr(app.applicant, 'headline', None),
                headline=getattr(app.applicant, 'headline', None),
                skills=user_skills,
                experience_years=getattr(app.applicant, 'experience_years', None),
                location=getattr(app.applicant, 'address', None) or getattr(app.applicant, 'country', None),
                address=getattr(app.applicant, 'address', None),
                avatar_url=getattr(app.applicant, 'avatar_url', None) or getattr(app.applicant, 'profile_image', None),
            )
        
        app_with_applicant = JobApplicationWithApplicant(
            id=app.id,
            job_id=app.job_id,
            applicant_id=app.applicant_id,
            status=app.status.value if hasattr(app.status, 'value') else str(app.status),
            cover_letter=app.cover_letter,
            resume_url=app.resume_url,
            answers=app.answers,
            expected_salary=app.expected_salary,
            submitted_at=app.submitted_at,
            reviewed_at=app.reviewed_at,
            rating=app.rating,
            reviewer_notes=app.reviewer_notes,
            applicant=applicant_info
        )
        response.append(app_with_applicant)
    
    return response


@router.put("/applications/{app_id}/status")
async def update_application_status(
    app_id: UUID,
    new_status: str,
    notes: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update application status (job owner only)."""
    
    result = await db.execute(
        select(JobApplication).where(JobApplication.id == app_id)
    )
    application = result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check job ownership
    result = await db.execute(
        select(Job).where(Job.id == application.job_id)
    )
    job = result.scalar_one()
    
    if job.posted_by_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    application.status = ApplicationStatus(new_status)
    application.reviewed_by_id = current_user.id
    application.reviewed_at = datetime.utcnow()
    if notes:
        application.reviewer_notes = notes
    
    await db.commit()
    
    return {"message": "Application status updated"}


# ============= Saved Jobs =============

@router.post("/saved", status_code=status.HTTP_201_CREATED)
async def save_job(
    saved_in: SavedJobCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Save a job."""
    
    # Check if already saved
    result = await db.execute(
        select(SavedJob).where(
            SavedJob.job_id == saved_in.job_id,
            SavedJob.user_id == current_user.id
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job already saved"
        )
    
    saved = SavedJob(
        user_id=current_user.id,
        job_id=saved_in.job_id,
        notes=saved_in.notes
    )
    db.add(saved)
    await db.commit()
    
    return {"message": "Job saved successfully"}


@router.get("/saved", response_model=List[JobResponse])
async def get_saved_jobs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get my saved jobs."""
    
    result = await db.execute(
        select(SavedJob).where(SavedJob.user_id == current_user.id)
    )
    saved_jobs = result.scalars().all()
    
    job_ids = [s.job_id for s in saved_jobs]
    
    if not job_ids:
        return []
    
    result = await db.execute(
        select(Job).where(Job.id.in_(job_ids))
    )
    return result.scalars().all()


@router.delete("/saved/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_job(
    job_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Remove job from saved."""
    
    result = await db.execute(
        select(SavedJob).where(
            SavedJob.job_id == job_id,
            SavedJob.user_id == current_user.id
        )
    )
    saved = result.scalar_one_or_none()
    
    if saved:
        await db.delete(saved)
        await db.commit()

