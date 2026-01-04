"""
Job routes.
"""

from typing import Any, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from slugify import slugify
import uuid

from app.db import get_db
from app.models.job import Job, JobApplication, SavedJob, JobStatus, ApplicationStatus
from app.models.user import User
from app.schemas.job import (
    JobCreate, JobUpdate, JobResponse, JobListResponse,
    JobApplicationCreate, JobApplicationResponse
)
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[JobListResponse])
async def list_jobs(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    job_type: str = Query(None),
    experience_level: str = Query(None),
    is_remote: bool = Query(None),
    location: str = Query(None),
) -> Any:
    """List active job postings."""
    query = select(Job).where(Job.status == JobStatus.ACTIVE)
    
    if search:
        query = query.where(
            (Job.title.ilike(f"%{search}%")) |
            (Job.company_name.ilike(f"%{search}%"))
        )
    
    if job_type:
        query = query.where(Job.job_type == job_type)
    
    if experience_level:
        query = query.where(Job.experience_level == experience_level)
    
    if is_remote is not None:
        query = query.where(Job.is_remote == is_remote)
    
    if location:
        query = query.where(Job.location.ilike(f"%{location}%"))
    
    query = query.order_by(Job.is_featured.desc(), Job.created_at.desc())
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
    # Generate unique slug
    base_slug = slugify(job_in.title)
    slug = f"{base_slug}-{str(uuid.uuid4())[:8]}"
    
    job = Job(
        **job_in.model_dump(),
        slug=slug,
        posted_by_id=current_user.id,
        status=JobStatus.DRAFT,
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: str,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get job by ID."""
    result = await db.execute(select(Job).where(Job.id == job_id))
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
    job_id: str,
    job_in: JobUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update a job posting."""
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    if str(job.posted_by_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this job"
        )
    
    for field, value in job_in.model_dump(exclude_unset=True).items():
        setattr(job, field, value)
    
    await db.commit()
    await db.refresh(job)
    return job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Delete a job posting."""
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    if str(job.posted_by_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this job"
        )
    
    await db.delete(job)
    await db.commit()


@router.post("/{job_id}/apply", response_model=JobApplicationResponse, status_code=status.HTTP_201_CREATED)
async def apply_to_job(
    job_id: str,
    application_in: JobApplicationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Apply to a job."""
    # Check if job exists and is active
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    if job.status != JobStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job is not accepting applications"
        )
    
    # Check if already applied
    result = await db.execute(
        select(JobApplication).where(
            (JobApplication.job_id == job_id) &
            (JobApplication.applicant_id == current_user.id)
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already applied to this job"
        )
    
    application = JobApplication(
        job_id=job_id,
        applicant_id=current_user.id,
        **application_in.model_dump(),
    )
    db.add(application)
    
    # Update job application count
    job.applications_count += 1
    
    await db.commit()
    await db.refresh(application)
    return application


@router.get("/{job_id}/applications", response_model=List[JobApplicationResponse])
async def get_job_applications(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
) -> Any:
    """Get applications for a job (for job poster only)."""
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    if str(job.posted_by_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view applications"
        )
    
    query = select(JobApplication).where(JobApplication.job_id == job_id)
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/{job_id}/save", status_code=status.HTTP_201_CREATED)
async def save_job(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Save/bookmark a job."""
    # Check if already saved
    result = await db.execute(
        select(SavedJob).where(
            (SavedJob.job_id == job_id) &
            (SavedJob.user_id == current_user.id)
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job already saved"
        )
    
    saved = SavedJob(job_id=job_id, user_id=current_user.id)
    db.add(saved)
    await db.commit()
    
    return {"message": "Job saved successfully"}


@router.delete("/{job_id}/save", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_job(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Remove saved job."""
    result = await db.execute(
        select(SavedJob).where(
            (SavedJob.job_id == job_id) &
            (SavedJob.user_id == current_user.id)
        )
    )
    saved = result.scalar_one_or_none()
    
    if not saved:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved job not found"
        )
    
    await db.delete(saved)
    await db.commit()

