"""
Job Portal API endpoints.
"""

from typing import Any, List, Literal, Optional
from uuid import UUID, uuid4
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status, Query, Request, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func, case, literal
from sqlalchemy.orm import selectinload
from slugify import slugify

from app.db.session import get_db
from app.models.job import Job, JobApplication, SavedJob, JobView, JobStatus, ApplicationStatus
from app.models.job_title_catalog import JobTitleCatalog
from app.models.user import User
from app.schemas.job import (
    JobCreate, JobUpdate, JobResponse,
    JobApplicationCreate, JobApplicationResponse,
    SavedJobCreate, ApplicantInfo, JobApplicationWithApplicant
)
from app.core.security import get_current_user, get_optional_user, get_current_admin_user
from app.core.config import get_settings
from app.services.job_coding_eval import evaluate_job_coding_submissions, run_assessment_preview
from pydantic import BaseModel

router = APIRouter()


class CodingAssessmentRunRequest(BaseModel):
    question_id: str
    code: str
    language: str
    mode: Literal["run", "test"] = "run"


def _find_coding_question_dict(job: Job, question_id: str) -> Optional[dict]:
    raw = getattr(job, "coding_questions", None) or []
    if not isinstance(raw, list):
        return None
    for q in raw:
        if isinstance(q, dict) and str(q.get("id")) == str(question_id):
            return q
    return None

_MAX_SCREENING_VIDEO_BYTES = 80 * 1024 * 1024
_SCREENING_VIDEO_EXTS = {".webm", ".mp4", ".mov", ".mkv"}

# Map user-facing country names to codes used in hiring_countries
_COUNTRY_TO_CODE = {
    "us": "US", "usa": "US", "united states": "US", "united states of america": "US",
    "in": "IN", "india": "IN",
    "gb": "GB", "uk": "GB", "united kingdom": "GB", "great britain": "GB",
    "ca": "CA", "canada": "CA",
}


def _user_country_code(country: Optional[str]) -> Optional[str]:
    if not country or not str(country).strip():
        return None
    key = str(country).strip().lower()
    return _COUNTRY_TO_CODE.get(key) or (key.upper() if len(key) == 2 else None)


def _job_visible_to_user(job: Job, user_country_code: Optional[str], user_work_auth: Optional[str]) -> bool:
    """True if job's hiring_countries/work_authorizations allow this user to see it."""
    hc = getattr(job, "hiring_countries", None) or []
    if not hc or not isinstance(hc, list):
        return True  # no restriction
    codes = []
    for c in hc:
        s = str(c).strip()
        codes.append(s.upper() if len(s) == 2 else _COUNTRY_TO_CODE.get(s.lower()))
    codes = [c for c in codes if c]
    if not codes:
        return True
    if user_country_code and user_country_code not in codes:
        return False
    wa = getattr(job, "work_authorizations", None) or []
    if "US" in codes and wa and isinstance(wa, list):
        if not user_work_auth or user_work_auth.strip() not in [str(x).strip() for x in wa]:
            return False
    return True


def _allowed_application_status_transition(current_status: ApplicationStatus, requested_status: ApplicationStatus) -> bool:
    if requested_status == current_status:
        return True

    allowed: dict[ApplicationStatus, set[ApplicationStatus]] = {
        ApplicationStatus.SUBMITTED: {ApplicationStatus.UNDER_REVIEW, ApplicationStatus.SHORTLISTED, ApplicationStatus.REJECTED},
        ApplicationStatus.UNDER_REVIEW: {ApplicationStatus.SHORTLISTED, ApplicationStatus.REJECTED},
        ApplicationStatus.SHORTLISTED: {ApplicationStatus.INTERVIEW, ApplicationStatus.REJECTED},
        ApplicationStatus.INTERVIEW: {ApplicationStatus.OFFERED, ApplicationStatus.REJECTED},
        ApplicationStatus.OFFERED: {ApplicationStatus.ONBOARDING, ApplicationStatus.REJECTED},
        ApplicationStatus.ONBOARDING: {ApplicationStatus.HIRED, ApplicationStatus.REJECTED},
        ApplicationStatus.REJECTED: {ApplicationStatus.SHORTLISTED},
        ApplicationStatus.HIRED: set(),
        ApplicationStatus.WITHDRAWN: set(),
    }
    return requested_status in allowed.get(current_status, set())


def _normalize_json_list(value: Any) -> list:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, dict):
        return []
    return [value]


def _serialize_job_for_response(job: Job) -> dict[str, Any]:
    return {
        "id": job.id,
        "title": job.title,
        "slug": job.slug,
        "description": job.description,
        "short_description": job.short_description,
        "company_id": job.company_id,
        "company_name": job.company_name,
        "posted_by_id": job.posted_by_id,
        "job_type": job.job_type.value if hasattr(job.job_type, "value") else job.job_type,
        "experience_level": job.experience_level.value if hasattr(job.experience_level, "value") else job.experience_level,
        "location": job.location,
        "is_remote": bool(job.is_remote),
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "salary_currency": job.salary_currency or "USD",
        "show_salary": bool(job.show_salary),
        "skills_required": _normalize_json_list(job.skills_required),
        "benefits": _normalize_json_list(job.benefits),
        "coding_questions": _normalize_json_list(job.coding_questions),
        "screening_questions": _normalize_json_list(job.screening_questions),
        "department": job.department,
        "hiring_countries": _normalize_json_list(job.hiring_countries),
        "hiring_states": _normalize_json_list(job.hiring_states),
        "work_authorizations": _normalize_json_list(job.work_authorizations),
        "open_for_sponsorship": job.open_for_sponsorship,
        "collect_applicant_location": bool(job.collect_applicant_location),
        "status": job.status.value if hasattr(job.status, "value") else job.status,
        "is_featured": bool(job.is_featured),
        "views_count": job.views_count or 0,
        "applications_count": job.applications_count or 0,
        "published_at": job.published_at,
        "created_at": job.created_at,
    }


def _is_acceptable_live_job_title(raw: Optional[str]) -> bool:
    """Filter junk titles from distinct `jobs.title` (e.g. drafts, '* Update')."""
    t = (raw or "").strip()
    if len(t) < 2:
        return False
    lower = t.lower()
    if lower in ("test", "draft", "update", "tbd", "n/a", "none", "placeholder", "temp", "temporary"):
        return False
    if lower.endswith(" update"):
        return False
    if lower.startswith("draft ") or lower.startswith("test "):
        return False
    return True


@router.get("/title-autocomplete", response_model=List[str])
async def title_autocomplete(
    q: str = Query(..., min_length=1),
    limit: int = Query(24, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
) -> List[str]:
    """
    Job title suggestions: seeded catalog (relevance-ranked) + distinct titles from existing jobs.
    Public; no auth required (same pattern as /places/autocomplete).
    """
    q_stripped = q.strip()
    if not q_stripped:
        return []
    search = f"%{q_stripped}%"
    match_rank = case(
        (func.lower(JobTitleCatalog.title) == func.lower(literal(q_stripped)), literal(0)),
        (JobTitleCatalog.title.ilike(f"{q_stripped}%"), literal(1)),
        else_=literal(2),
    )
    cat_stmt = (
        select(JobTitleCatalog.title)
        .where(JobTitleCatalog.title.ilike(search))
        .order_by(match_rank, JobTitleCatalog.title)
        .limit(limit)
    )
    cat_result = await db.execute(cat_stmt)
    catalog_titles = [row[0] for row in cat_result.all() if row[0]]

    jobs_stmt = (
        select(Job.title)
        .where(Job.title.ilike(search))
        .distinct()
        .order_by(Job.title)
        .limit(limit)
    )
    jobs_result = await db.execute(jobs_stmt)
    job_titles = [row[0] for row in jobs_result.all() if row[0] and _is_acceptable_live_job_title(row[0])]

    seen: set[str] = set()
    out: List[str] = []
    for title in catalog_titles + job_titles:
        key = title.strip().lower()
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(title.strip())
        if len(out) >= limit:
            break
    return out


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
    posted_by: Optional[UUID] = Query(None),
    current_user: Optional[User] = Depends(get_optional_user),
) -> Any:
    """List published jobs. When user is authenticated, filters by hiring_countries and work_authorizations (USA)."""
    
    if posted_by:
        query = select(Job).where(Job.posted_by_id == posted_by)
    else:
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

    if current_user is not None and not posted_by:
        # Fetch more to allow filtering by hiring_countries/work_authorizations, then paginate
        query = query.offset(0).limit(500)
        result = await db.execute(query)
        rows = list(result.scalars().all())
        user_country_code = _user_country_code(getattr(current_user, "country", None))
        user_work_auth = (getattr(current_user, "work_authorization", None) or "").strip() or None
        filtered = [job for job in rows if _job_visible_to_user(job, user_country_code, user_work_auth)]
        return [_serialize_job_for_response(job) for job in filtered[skip : skip + limit]]
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return [_serialize_job_for_response(job) for job in result.scalars().all()]


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
    
    return _serialize_job_for_response(job)


@router.post("/upload/screening-video")
async def upload_screening_video(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Authenticated upload for candidate screening video answers (stored under /uploads)."""
    root = Path(__file__).resolve().parents[3] / "uploads" / "job_screening"
    root.mkdir(parents=True, exist_ok=True)
    orig = Path(file.filename or "video.webm")
    ext = orig.suffix.lower() if orig.suffix else ".webm"
    if ext not in _SCREENING_VIDEO_EXTS:
        ext = ".webm"
    name = f"{current_user.id}_{uuid4().hex}{ext}"
    dest = root / name
    content = await file.read()
    if len(content) > _MAX_SCREENING_VIDEO_BYTES:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Video file too large")
    dest.write_bytes(content)
    return {"url": f"/uploads/job_screening/{name}", "filename": name}


@router.post("/{job_id}/apply", response_model=JobApplicationResponse, status_code=status.HTTP_201_CREATED)
async def apply_to_job(
    job_id: UUID,
    application_in: JobApplicationCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Apply to a job with skill matching calculation."""
    from app.models.user import UserProfile, Experience
    
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

    # ============= MERGE CODING AUTO-EVALUATION INTO ANSWERS =============
    merged_answers: Any = application_in.answers
    if isinstance(application_in.answers, dict):
        merged_answers = dict(application_in.answers)
        raw_coding = merged_answers.get("coding_answers")
        cq = job.coding_questions
        if raw_coding and isinstance(raw_coding, list) and cq:
            settings_eval = get_settings()
            eval_block = await evaluate_job_coding_submissions(
                cq if isinstance(cq, list) else [],
                raw_coding,
                settings_eval.resolved_judge_service_url(),
            )
            if eval_block:
                merged_answers.update(eval_block)
    
    # ============= SKILL MATCHING CALCULATION =============
    def _normalize_skills(values: Any) -> List[str]:
        if not values:
            return []
        raw_skills: List[str] = []
        if isinstance(values, list):
            raw_skills = [str(s).strip() for s in values if str(s).strip()]
        elif isinstance(values, str):
            raw_skills = [s.strip() for s in values.split(',') if s.strip()]
        else:
            raw_skills = [str(values).strip()] if str(values).strip() else []
        # lowercase + dedupe while preserving order
        seen = set()
        normalized: List[str] = []
        for skill in raw_skills:
            key = skill.lower()
            if key in seen:
                continue
            seen.add(key)
            normalized.append(key)
        return normalized

    # Get applicant profile
    profile_result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    )
    user_profile = profile_result.scalar_one_or_none()

    # Get applicant experiences and merge all skills
    exp_result = await db.execute(
        select(Experience).where(Experience.user_id == current_user.id)
    )
    experiences = exp_result.scalars().all()

    user_skills: List[str] = []
    user_skills.extend(_normalize_skills(user_profile.skills if user_profile else []))
    for exp in experiences:
        user_skills.extend(_normalize_skills(getattr(exp, "skills", [])))
    # de-duplicate again after merge
    user_skills = list(dict.fromkeys(user_skills))
    
    # Get required skills from job (normalize to lowercase)
    required_skills = _normalize_skills(job.skills_required or [])
    
    # Calculate matched and missing skills
    matched_skills = []
    missing_skills = []
    
    for req_skill in required_skills:
        # Check if any user skill matches (partial match allowed)
        skill_matched = False
        for user_skill in user_skills:
            if req_skill in user_skill or user_skill in req_skill:
                matched_skills.append(req_skill)
                skill_matched = True
                break
        if not skill_matched:
            missing_skills.append(req_skill)
    
    # Calculate match score (percentage)
    match_score = 0
    if required_skills:
        match_score = int((len(matched_skills) / len(required_skills)) * 100)
    else:
        # No required skills specified - default to 100%
        match_score = 100
    
    # ============= CREATE APPLICATION =============
    applicant_location_lat = None
    applicant_location_lng = None
    applicant_location_ip_snapshot = None
    applicant_location_consent_at = None
    if job.collect_applicant_location:
        lat = application_in.applicant_location_lat
        lng = application_in.applicant_location_lng
        location_context = application_in.applicant_location_context or {}
        if lat is not None and lng is not None:
            applicant_location_lat = lat
            applicant_location_lng = lng
            applicant_location_consent_at = datetime.utcnow()
            applicant_location_ip_snapshot = {
                "ip": request.client.host if request.client else None,
                "captured_at": applicant_location_consent_at.isoformat(),
                **(location_context if isinstance(location_context, dict) else {}),
            }

    application = JobApplication(
        job_id=job_id,
        applicant_id=current_user.id,
        cover_letter=application_in.cover_letter,
        resume_url=application_in.resume_url,
        answers=merged_answers,
        expected_salary=application_in.expected_salary,
        available_from=application_in.available_from,
        referral_source=application_in.referral_source,
        # Skill matching fields
        match_score=match_score,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        applicant_location_lat=applicant_location_lat,
        applicant_location_lng=applicant_location_lng,
        applicant_location_ip_snapshot=applicant_location_ip_snapshot,
        applicant_location_consent_at=applicant_location_consent_at,
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
    
    # Build response with job details and match score
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
            # Include skill matching data
            "match_score": app.match_score,
            "matched_skills": app.matched_skills or [],
            "missing_skills": app.missing_skills or [],
        }
        if isinstance(app.answers, dict):
            if app.answers.get("coding_test_score") is not None:
                app_dict["coding_test_score"] = app.answers.get("coding_test_score")
            if app.answers.get("coding_evaluation") is not None:
                app_dict["coding_evaluation"] = app.answers.get("coding_evaluation")
        
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
                "skills_required": app.job.skills_required or [],
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
            # Include skill matching data
            match_score=app.match_score,
            matched_skills=app.matched_skills or [],
            missing_skills=app.missing_skills or [],
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
    
    try:
        requested_status = ApplicationStatus(new_status)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid application status: {new_status}"
        )

    current_status = application.status or ApplicationStatus.SUBMITTED
    if not _allowed_application_status_transition(current_status, requested_status):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status transition: {current_status.value} -> {requested_status.value}"
        )

    application.status = requested_status
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
    return [_serialize_job_for_response(job) for job in result.scalars().all()]


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


@router.post("/{job_id}/coding-assessment/run")
async def run_coding_assessment_preview(
    job_id: UUID,
    body: CodingAssessmentRunRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Preview run / test for a coding question during application (uses optional judge service).
    Does not affect application scoring until submit.
    """
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    if not job or job.status != JobStatus.PUBLISHED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found or not accepting applications")

    q = _find_coding_question_dict(job, body.question_id)
    if not q:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coding question not found for this job")

    settings = get_settings()
    judge_url = settings.resolved_judge_service_url()

    return await run_assessment_preview(
        q,
        body.code,
        body.language,
        body.mode,
        judge_url,
    )


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
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
    
    # Count only the first authenticated view per user for this job.
    if current_user:
        existing_view = await db.execute(
            select(JobView).where(
                JobView.job_id == job.id,
                JobView.user_id == current_user.id,
            )
        )
        if existing_view.scalar_one_or_none() is None:
            db.add(JobView(job_id=job.id, user_id=current_user.id))
            job.views_count = (job.views_count or 0) + 1
            await db.commit()
    
    return _serialize_job_for_response(job)


@router.put("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: UUID,
    job_in: JobUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update job posting. Allows if user posted it OR is company admin with can_manage_jobs."""
    
    result = await db.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check ownership OR company admin permission
    is_owner = job.posted_by_id == current_user.id
    is_company_admin = False
    
    if job.company_id and not is_owner:
        from app.models.company import CompanyAdmin
        admin_check = await db.execute(
            select(CompanyAdmin).where(
                CompanyAdmin.company_id == job.company_id,
                CompanyAdmin.user_id == current_user.id,
                CompanyAdmin.can_manage_jobs == True
            )
        )
        is_company_admin = admin_check.scalar_one_or_none() is not None
    
    if not (is_owner or is_company_admin or current_user.is_superuser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this job"
        )
    
    update_data = job_in.model_dump(exclude_unset=True)
    
    # Convert status string to enum if provided
    if 'status' in update_data:
        status_str = update_data.pop('status')
        if status_str:
            try:
                job.status = JobStatus(status_str)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid status: {status_str}. Must be one of: draft, published, paused, closed, archived"
                )
    
    # Update other fields
    for field, value in update_data.items():
        if value is not None:  # Only update non-None values
            setattr(job, field, value)
    
    await db.commit()
    await db.refresh(job)
    
    return _serialize_job_for_response(job)


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Delete job posting. Allows if user posted it OR is company admin with can_manage_jobs."""
    
    result = await db.execute(
        select(Job).where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check ownership OR company admin permission
    is_owner = job.posted_by_id == current_user.id
    is_company_admin = False
    
    if job.company_id and not is_owner:
        from app.models.company import CompanyAdmin
        admin_check = await db.execute(
            select(CompanyAdmin).where(
                CompanyAdmin.company_id == job.company_id,
                CompanyAdmin.user_id == current_user.id,
                CompanyAdmin.can_manage_jobs == True
            )
        )
        is_company_admin = admin_check.scalar_one_or_none() is not None
    
    if not (is_owner or is_company_admin or current_user.is_superuser):
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
