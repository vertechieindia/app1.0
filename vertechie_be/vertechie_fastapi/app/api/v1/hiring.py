"""
Hiring/ATS API Routes
Pipeline, Assessments, Interviews, and Offers
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, cast
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import JSONB

from app.db.session import get_db
from app.models.hiring import (
    HiringPipeline, PipelineStage, CandidateInPipeline,
    Assessment, AssessmentQuestion, CandidateAssessment, AssessmentResult,
    Interview, InterviewScorecard, JobOffer,
    StageType, AssessmentType, CandidateAssessmentStatus,
    InterviewType, InterviewStatus, OfferStatus
)
from app.models.job import Job, JobApplication, ApplicationStatus
from app.models.company import Company, CompanyAdmin
from app.models.user import User
from app.models.notification import Notification, NotificationType
from app.core.security import get_current_user, get_current_admin_user
from app.core.config import settings
from pydantic import BaseModel
from datetime import datetime, timezone, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

router = APIRouter(tags=["Hiring/ATS"])
logger = logging.getLogger(__name__)


# ============= Pydantic Schemas =============

class PipelineStageCreate(BaseModel):
    name: str
    stage_type: StageType
    description: Optional[str] = None
    color: str = "#3498db"
    order: int = 0
    email_on_enter: Optional[str] = None
    email_on_reject: Optional[str] = None

class PipelineStageResponse(PipelineStageCreate):
    id: UUID
    pipeline_id: UUID
    
    class Config:
        from_attributes = True

class PipelineCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_default: bool = False

class PipelineResponse(PipelineCreate):
    id: UUID
    company_id: UUID
    is_template: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class CandidateMove(BaseModel):
    stage_id: UUID
    notes: Optional[str] = None

class AssessmentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    assessment_type: AssessmentType
    time_limit_minutes: Optional[int] = None
    passing_score: int = 70
    is_proctored: bool = False
    allow_retake: bool = False

class AssessmentResponse(AssessmentCreate):
    id: UUID
    company_id: UUID
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class InterviewCreate(BaseModel):
    application_id: UUID
    interview_type: InterviewType
    scheduled_at: datetime
    duration_minutes: int = 60
    location: Optional[str] = None
    meeting_link: Optional[str] = None
    interviewers: List[UUID] = []
    notes: Optional[str] = None

class InterviewResponse(BaseModel):
    id: UUID
    application_id: UUID
    interview_type: InterviewType
    scheduled_at: datetime
    duration_minutes: int = 60
    location: Optional[str] = None
    meeting_link: Optional[str] = None
    interviewers: List[UUID] = []
    notes: Optional[str] = None
    status: InterviewStatus
    created_at: datetime
    # Additional fields for HM dashboard
    candidate_name: Optional[str] = None
    job_title: Optional[str] = None
    
    class Config:
        from_attributes = True

class ScorecardCreate(BaseModel):
    overall_score: int  # 1-5
    scores: dict = {}
    strengths: Optional[str] = None
    weaknesses: Optional[str] = None
    notes: Optional[str] = None
    recommendation: str  # strong_yes, yes, no, strong_no

class OfferCreate(BaseModel):
    application_id: UUID
    base_salary: float
    currency: str = "USD"
    salary_period: str = "annual"
    equity_type: Optional[str] = None
    equity_amount: Optional[float] = None
    signing_bonus: Optional[float] = None
    annual_bonus: Optional[float] = None
    job_title: str
    start_date: datetime
    employment_type: str = "full_time"
    expires_at: Optional[datetime] = None
    benefits: List[str] = []

class OfferResponse(OfferCreate):
    id: UUID
    status: OfferStatus
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============= Helper Functions =============

async def verify_company_admin(
    company_id: UUID,
    user_id: UUID,
    db: AsyncSession
) -> bool:
    """Verify user is company admin."""
    result = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == user_id
        )
    )
    return result.scalar_one_or_none() is not None


# ============= Pipelines =============

@router.get("/companies/{company_id}/pipelines", response_model=List[PipelineResponse])
async def list_pipelines(
    company_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List company hiring pipelines."""
    if not await verify_company_admin(company_id, current_user.id, db):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.execute(
        select(HiringPipeline)
        .options(selectinload(HiringPipeline.stages))
        .where(HiringPipeline.company_id == company_id)
    )
    return result.scalars().all()


@router.post("/companies/{company_id}/pipelines", response_model=PipelineResponse)
async def create_pipeline(
    company_id: UUID,
    pipeline: PipelineCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a hiring pipeline."""
    if not await verify_company_admin(company_id, current_user.id, db):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_pipeline = HiringPipeline(company_id=company_id, **pipeline.model_dump())
    db.add(db_pipeline)
    await db.commit()
    await db.refresh(db_pipeline)
    
    # Add default stages
    default_stages = [
        {"name": "Applied", "stage_type": StageType.APPLIED, "order": 0},
        {"name": "Screening", "stage_type": StageType.SCREENING, "order": 1},
        {"name": "Interview", "stage_type": StageType.INTERVIEW, "order": 2},
        {"name": "Offer", "stage_type": StageType.OFFER, "order": 3},
        {"name": "Hired", "stage_type": StageType.HIRED, "order": 4},
    ]
    for stage_data in default_stages:
        stage = PipelineStage(pipeline_id=db_pipeline.id, **stage_data)
        db.add(stage)
    
    await db.commit()
    return db_pipeline


@router.post("/pipelines/{pipeline_id}/stages", response_model=PipelineStageResponse)
async def add_pipeline_stage(
    pipeline_id: UUID,
    stage: PipelineStageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a stage to pipeline."""
    # Get pipeline and verify access
    pipeline_result = await db.execute(
        select(HiringPipeline).where(HiringPipeline.id == pipeline_id)
    )
    pipeline = pipeline_result.scalar_one_or_none()
    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    
    if not await verify_company_admin(pipeline.company_id, current_user.id, db):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_stage = PipelineStage(pipeline_id=pipeline_id, **stage.model_dump())
    db.add(db_stage)
    await db.commit()
    await db.refresh(db_stage)
    return db_stage


class PipelineCandidateResponse(BaseModel):
    """Response model for pipeline candidates."""
    id: str
    application_id: UUID
    user_id: UUID  # The actual user/applicant ID for viewing profile
    name: str
    email: str
    role: Optional[str] = None
    stage: str
    stage_id: Optional[UUID] = None
    skills: List[str] = []
    rating: Optional[int] = None
    time: str
    score: Optional[int] = None
    matchScore: Optional[int] = None
    aiInsight: Optional[str] = None
    experience: Optional[int] = None
    education: Optional[str] = None
    source: str = "VerTechie"
    avatar: Optional[str] = None
    job_id: UUID
    job_title: Optional[str] = None
    
    class Config:
        from_attributes = True


@router.get("/pipeline/candidates", response_model=List[PipelineCandidateResponse])
async def get_pipeline_candidates(
    job_id: Optional[UUID] = Query(None, description="Filter by job ID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all pipeline candidates for jobs posted by the current user (hiring manager).
    Returns applications organized by pipeline stage.
    """
    # Get all jobs posted by the current user
    jobs_query = select(Job).where(Job.posted_by_id == current_user.id)
    if job_id:
        jobs_query = jobs_query.where(Job.id == job_id)
    
    jobs_result = await db.execute(jobs_query)
    jobs = jobs_result.scalars().all()
    
    if not jobs:
        return []
    
    job_ids = [job.id for job in jobs]
    
    # Get all applications for these jobs with applicant details
    applications_query = select(JobApplication).options(
        selectinload(JobApplication.applicant),
        selectinload(JobApplication.job)
    ).where(JobApplication.job_id.in_(job_ids))
    
    apps_result = await db.execute(applications_query)
    applications = apps_result.scalars().all()
    
    # Get default pipeline stages (or create mapping)
    # Map application status to pipeline stages
    status_to_stage = {
        ApplicationStatus.SUBMITTED.value: 'new',
        ApplicationStatus.UNDER_REVIEW.value: 'screening',
        ApplicationStatus.SHORTLISTED.value: 'screening',
        ApplicationStatus.INTERVIEW.value: 'interview',
        ApplicationStatus.OFFERED.value: 'offer',
        ApplicationStatus.HIRED.value: 'hired',
        ApplicationStatus.REJECTED.value: 'rejected',
    }
    
    candidates = []
    for app in applications:
        applicant = app.applicant
        job = app.job
        
        if not applicant:
            continue
        
        # Map application status to pipeline stage
        app_status = app.status.value if hasattr(app.status, 'value') else str(app.status)
        stage = status_to_stage.get(app_status, 'new')
        
        # Calculate match score (simplified - can be enhanced)
        match_score = app.rating * 20 if app.rating else 75
        
        # Get skills
        skills = []
        if hasattr(applicant, 'skills') and applicant.skills:
            if isinstance(applicant.skills, list):
                skills = applicant.skills
            elif isinstance(applicant.skills, str):
                skills = [s.strip() for s in applicant.skills.split(',')]
        
        # Calculate experience
        experience_years = None
        if hasattr(applicant, 'experience_years'):
            experience_years = applicant.experience_years
        elif hasattr(applicant, 'total_experience'):
            try:
                experience_years = int(applicant.total_experience)
            except:
                pass
        
        # Get education
        education = None
        if hasattr(applicant, 'education'):
            education = applicant.education
        
        # Format name
        first_name = applicant.first_name or ''
        last_name = applicant.last_name or ''
        name = f"{first_name} {last_name}".strip() or applicant.email.split('@')[0]
        
        # Get relative time
        now = datetime.utcnow()
        submitted_time = app.submitted_at or app.created_at if hasattr(app, 'created_at') else now
        
        # Ensure both are naive for subtraction
        if submitted_time.tzinfo:
            submitted_time = submitted_time.astimezone(timezone.utc).replace(tzinfo=None)
            
        time_diff = now - submitted_time
        if time_diff.days == 0:
            hours = time_diff.seconds // 3600
            if hours < 1:
                time_str = "Just now"
            else:
                time_str = f"{hours} hours ago"
        elif time_diff.days < 7:
            time_str = f"{time_diff.days} days ago"
        elif time_diff.days < 30:
            time_str = f"{time_diff.days // 7} weeks ago"
        else:
            time_str = f"{time_diff.days // 30} months ago"
        
        candidate = PipelineCandidateResponse(
            id=str(app.id),  # Use application ID as candidate ID
            application_id=app.id,
            user_id=applicant.id,  # The actual user ID for profile viewing
            name=name,
            email=applicant.email,
            role=getattr(applicant, 'title', None) or getattr(applicant, 'headline', None) or job.title if job else None,
            stage=stage,
            stage_id=None,  # Will be set if using actual pipeline stages
            skills=skills[:10],  # Limit to 10 skills
            rating=app.rating if app.rating else None,
            time=time_str,
            score=app.rating * 20 if app.rating else 75,
            matchScore=app.match_score if app.match_score else match_score,  # Use stored match_score
            aiInsight=None,  # Can be enhanced with AI insights
            experience=experience_years,
            education=education,
            source="VerTechie",
            avatar=getattr(applicant, 'avatar_url', None) or getattr(applicant, 'profile_image', None),
            job_id=app.job_id,
            job_title=job.title if job else None,
        )
        candidates.append(candidate)
    
    return candidates


@router.put("/candidates/{candidate_id}/move", response_model=dict)
async def move_candidate(
    candidate_id: UUID,
    move_data: CandidateMove,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Move candidate to a different stage."""
    result = await db.execute(
        select(CandidateInPipeline)
        .options(selectinload(CandidateInPipeline.pipeline))
        .where(CandidateInPipeline.id == candidate_id)
    )
    candidate = result.scalar_one_or_none()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    if not await verify_company_admin(candidate.pipeline.company_id, current_user.id, db):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Update stage history
    candidate.stage_history.append({
        "stage_id": str(candidate.current_stage_id),
        "left_at": datetime.utcnow().isoformat()
    })
    
    candidate.current_stage_id = move_data.stage_id
    candidate.entered_stage_at = datetime.utcnow()
    
    await db.commit()
    return {"status": "moved"}


@router.put("/applications/{application_id}/stage")
async def update_application_stage(
    application_id: UUID,
    stage: str = Query(..., description="Pipeline stage: new, screening, interview, offer, hired"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update application stage (simplified pipeline management).
    Maps to application status.
    """
    # Get application
    app_result = await db.execute(
        select(JobApplication)
        .options(selectinload(JobApplication.job))
        .where(JobApplication.id == application_id)
    )
    application = app_result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Verify user owns the job
    if application.job.posted_by_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Map stage to ApplicationStatus enum
    stage_to_status = {
        'new': ApplicationStatus.SUBMITTED,
        'screening': ApplicationStatus.SHORTLISTED,
        'interview': ApplicationStatus.INTERVIEW,
        'offer': ApplicationStatus.OFFERED,
        'hired': ApplicationStatus.HIRED,
        'rejected': ApplicationStatus.REJECTED,
    }
    
    new_status = stage_to_status.get(stage.lower(), ApplicationStatus.SUBMITTED)
    application.status = new_status
    
    application.reviewed_at = datetime.utcnow()
    await db.commit()
    
    return {"status": "updated", "stage": stage, "application_status": new_status.value}


# ============= Assessments =============

@router.get("/companies/{company_id}/assessments", response_model=List[AssessmentResponse])
async def list_assessments(
    company_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List company assessments."""
    if not await verify_company_admin(company_id, current_user.id, db):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.execute(
        select(Assessment).where(Assessment.company_id == company_id)
    )
    return result.scalars().all()


@router.post("/companies/{company_id}/assessments", response_model=AssessmentResponse)
async def create_assessment(
    company_id: UUID,
    assessment: AssessmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create an assessment."""
    if not await verify_company_admin(company_id, current_user.id, db):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_assessment = Assessment(company_id=company_id, **assessment.model_dump())
    db.add(db_assessment)
    await db.commit()
    await db.refresh(db_assessment)
    return db_assessment


@router.post("/assessments/{assessment_id}/send")
async def send_assessment(
    assessment_id: UUID,
    candidate_id: UUID,
    application_id: Optional[UUID] = None,
    expires_in_days: int = 7,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send assessment to a candidate."""
    
    assessment_result = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = assessment_result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    if not await verify_company_admin(assessment.company_id, current_user.id, db):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    candidate_assessment = CandidateAssessment(
        assessment_id=assessment_id,
        candidate_id=candidate_id,
        application_id=application_id,
        expires_at=datetime.utcnow() + timedelta(days=expires_in_days)
    )
    db.add(candidate_assessment)
    await db.commit()
    
    # TODO: Send email notification
    
    return {"status": "sent"}


# ============= Interviews =============

@router.get("/interviews", response_model=List[InterviewResponse])
async def list_my_interviews(
    upcoming: bool = True,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List interviews for HM - includes interviews for their jobs or where they are interviewer."""
    from sqlalchemy import String
    
    # Get all job IDs posted by this HM
    jobs_result = await db.execute(
        select(Job.id).where(Job.posted_by_id == current_user.id)
    )
    hm_job_ids = [row[0] for row in jobs_result.fetchall()]
    
    # Get all application IDs for HM's jobs
    hm_application_ids = []
    if hm_job_ids:
        apps_result = await db.execute(
            select(JobApplication.id).where(JobApplication.job_id.in_(hm_job_ids))
        )
        hm_application_ids = [row[0] for row in apps_result.fetchall()]
    
    # Query interviews where:
    # 1. Current user is in interviewers list, OR
    # 2. Interview is for an application to HM's job
    if hm_application_ids:
        query = select(Interview).where(
            or_(
                cast(Interview.interviewers, JSONB).contains([str(current_user.id)]),
                Interview.application_id.in_(hm_application_ids)
            )
        )
    else:
        query = select(Interview).where(
            cast(Interview.interviewers, JSONB).contains([str(current_user.id)])
        )
    
    if upcoming:
        now = datetime.utcnow()
        query = query.where(Interview.scheduled_at >= now)
        query = query.order_by(Interview.scheduled_at.asc())  # Upcoming: earliest first
    else:
        query = query.order_by(Interview.scheduled_at.desc())  # All: most recent first
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    interviews = result.scalars().all()
    
    # Enrich interviews with candidate and job details
    enriched_interviews = []
    for interview in interviews:
        # Get the application to find candidate and job
        app_result = await db.execute(
            select(JobApplication).where(JobApplication.id == interview.application_id)
        )
        application = app_result.scalar_one_or_none()
        
        candidate_name = None
        job_title = None
        
        if application:
            # Get the applicant's name
            user_result = await db.execute(
                select(User).where(User.id == application.applicant_id)
            )
            applicant = user_result.scalar_one_or_none()
            if applicant:
                candidate_name = f"{applicant.first_name or ''} {applicant.last_name or ''}".strip() or applicant.email
            
            # Get the job title
            job_result = await db.execute(
                select(Job).where(Job.id == application.job_id)
            )
            job = job_result.scalar_one_or_none()
            if job:
                job_title = job.title
        
        enriched_interviews.append(InterviewResponse(
            id=interview.id,
            application_id=interview.application_id,
            interview_type=interview.interview_type,
            scheduled_at=interview.scheduled_at,
            duration_minutes=interview.duration_minutes,
            location=interview.location,
            meeting_link=interview.meeting_link,
            interviewers=interview.interviewers or [],
            notes=interview.notes,
            status=interview.status,
            created_at=interview.created_at,
            candidate_name=candidate_name,
            job_title=job_title,
        ))
    
    return enriched_interviews


@router.post("/interviews", response_model=InterviewResponse)
async def schedule_interview(
    interview: InterviewCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Schedule an interview with notifications to candidate."""
    
    # Create interview record
    interview_data = interview.model_dump()
    if interview_data.get('scheduled_at') and interview_data['scheduled_at'].tzinfo:
        interview_data['scheduled_at'] = interview_data['scheduled_at'].astimezone(timezone.utc).replace(tzinfo=None)
    
    db_interview = Interview(**interview_data)
    db_interview.status = InterviewStatus.SCHEDULED
    db.add(db_interview)
    await db.flush()  # Get the ID
    
    # Get the job application to find the candidate
    application = None
    candidate = None
    job = None
    
    if interview.application_id:
        app_result = await db.execute(
            select(JobApplication)
            .options(selectinload(JobApplication.applicant))
            .options(selectinload(JobApplication.job))
            .where(JobApplication.id == interview.application_id)
        )
        application = app_result.scalar_one_or_none()
        
        if application:
            candidate = application.applicant
            job = application.job
            
            # *** AUTO-UPDATE PIPELINE: Move application to Interview stage ***
            application.status = ApplicationStatus.INTERVIEW
            application.reviewed_at = datetime.utcnow()
            logger.info(f"Application {application.id} moved to INTERVIEW stage")
    
    await db.commit()
    await db.refresh(db_interview)
    
    # Send email notification to candidate
    if candidate and candidate.email:
        interview_date = interview.scheduled_at.strftime("%B %d, %Y")
        interview_time = interview.scheduled_at.strftime("%I:%M %p")
        job_title = job.title if job else "the position"
        
        email_subject = f"📅 Interview Scheduled: {job_title}"
        email_body = f"""
Hello {candidate.first_name or 'Candidate'},

Great news! Your interview for {job_title} has been scheduled.

📅 Date: {interview_date}
⏰ Time: {interview_time}
⏱️ Duration: {interview.duration_minutes} minutes
📍 Type: {interview.interview_type.value.replace('_', ' ').title()}

{f"📎 Meeting Link: {interview.meeting_link}" if interview.meeting_link else "Meeting link will be shared soon."}

Please make sure to:
✓ Test your camera and microphone beforehand
✓ Be ready 5 minutes before the scheduled time
✓ Have a quiet, well-lit environment

If you need to reschedule, please contact us as soon as possible.

Best of luck!

The VerTechie Team
        """
        
        # Send email in background
        background_tasks.add_task(
            send_interview_email,
            candidate.email,
            email_subject,
            email_body
        )
        
        # Create in-app notification for candidate
        notification = Notification(
            user_id=candidate.id,
            title=f"Interview Scheduled: {job_title}",
            message=f"Your interview is scheduled for {interview_date} at {interview_time}",
            notification_type=NotificationType.INTERVIEW_SCHEDULED,
            link="/techie/my-interviews",
            reference_id=db_interview.id,
            reference_type="interview"
        )
        db.add(notification)
        await db.commit()
        
        logger.info(f"Interview scheduled and notification sent to {candidate.email}")
    
    # Return enriched response with candidate and job details
    candidate_name = None
    job_title_str = None
    if candidate:
        candidate_name = f"{candidate.first_name or ''} {candidate.last_name or ''}".strip() or candidate.email
    if job:
        job_title_str = job.title
    
    return InterviewResponse(
        id=db_interview.id,
        application_id=db_interview.application_id,
        interview_type=db_interview.interview_type,
        scheduled_at=db_interview.scheduled_at,
        duration_minutes=db_interview.duration_minutes,
        location=db_interview.location,
        meeting_link=db_interview.meeting_link,
        interviewers=db_interview.interviewers or [],
        notes=db_interview.notes,
        status=db_interview.status,
        created_at=db_interview.created_at,
        candidate_name=candidate_name,
        job_title=job_title_str,
    )


def send_interview_email(to: str, subject: str, body: str):
    """Send interview notification email via SMTP."""
    try:
        smtp_host = getattr(settings, 'SMTP_HOST', 'smtp.gmail.com')
        smtp_port = getattr(settings, 'SMTP_PORT', 587)
        smtp_user = getattr(settings, 'SMTP_USER', '')
        smtp_password = getattr(settings, 'SMTP_PASSWORD', '')
        from_email = getattr(settings, 'EMAILS_FROM_EMAIL', 'noreply@vertechie.com')
        
        if not smtp_user or not smtp_password:
            logger.warning("SMTP not configured, email not sent")
            return False
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f"VerTechie <{from_email}>"
        msg['To'] = to
        
        # HTML version
        html_body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .header {{ background: linear-gradient(135deg, #0d47a1 0%, #1a237e 100%); padding: 20px; text-align: center; }}
                .header h1 {{ color: white; margin: 0; }}
                .content {{ padding: 30px; background: #f9f9f9; }}
                .footer {{ padding: 20px; text-align: center; font-size: 12px; color: #666; }}
                pre {{ white-space: pre-wrap; font-family: inherit; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📅 Interview Scheduled</h1>
            </div>
            <div class="content">
                <pre>{body}</pre>
            </div>
            <div class="footer">
                <p>&copy; 2024 VerTechie. All rights reserved.</p>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))
        
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(from_email, to, msg.as_string())
        
        logger.info(f"Interview email sent to {to}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send interview email: {str(e)}")
        return False


class InterviewStatusUpdate(BaseModel):
    """Request body for interview status update."""
    status: str


@router.put("/interviews/{interview_id}/status")
async def update_interview_status(
    interview_id: UUID,
    status_update: InterviewStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update interview status."""
    result = await db.execute(
        select(Interview).where(Interview.id == interview_id)
    )
    interview = result.scalar_one_or_none()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Map status string to enum
    try:
        new_status = InterviewStatus(status_update.status)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid status: {status_update.status}")
    
    interview.status = new_status
    await db.commit()
    
    return {"status": "updated"}


# ============= Interview Details & Management Endpoints =============

class InterviewDetailResponse(BaseModel):
    """Detailed interview response with full candidate info."""
    id: UUID
    application_id: UUID
    interview_type: InterviewType
    scheduled_at: datetime
    duration_minutes: int
    location: Optional[str] = None
    meeting_link: Optional[str] = None
    interviewers: List[UUID] = []
    notes: Optional[str] = None
    status: InterviewStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    # Candidate details
    candidate_id: Optional[UUID] = None
    candidate_name: Optional[str] = None
    candidate_email: Optional[str] = None
    candidate_avatar: Optional[str] = None
    candidate_skills: List[str] = []
    candidate_experience: Optional[str] = None
    match_score: Optional[int] = None
    # Job details
    job_id: Optional[UUID] = None
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    # Application decision
    application_status: Optional[str] = None
    
    class Config:
        from_attributes = True


class RescheduleRequest(BaseModel):
    scheduled_at: datetime
    duration_minutes: Optional[int] = None
    location: Optional[str] = None
    meeting_link: Optional[str] = None
    notes: Optional[str] = None


class DecisionRequest(BaseModel):
    decision: str  # selected, rejected, on_hold
    notes: Optional[str] = None


@router.get("/interviews/{interview_id}", response_model=InterviewDetailResponse)
async def get_interview_details(
    interview_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get full interview details with candidate information."""
    from app.models.user import UserProfile
    
    result = await db.execute(
        select(Interview).where(Interview.id == interview_id)
    )
    interview = result.scalar_one_or_none()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Get application details
    app_result = await db.execute(
        select(JobApplication).where(JobApplication.id == interview.application_id)
    )
    application = app_result.scalar_one_or_none()
    
    candidate_id = None
    candidate_name = None
    candidate_email = None
    candidate_avatar = None
    candidate_skills = []
    candidate_experience = None
    job_id = None
    job_title = None
    company_name = None
    application_status = None
    match_score = None
    
    if application:
        application_status = application.status.value if application.status else None
        match_score = application.match_score
        
        # Get candidate details
        user_result = await db.execute(
            select(User).where(User.id == application.applicant_id)
        )
        candidate = user_result.scalar_one_or_none()
        if candidate:
            candidate_id = candidate.id
            candidate_name = f"{candidate.first_name or ''} {candidate.last_name or ''}".strip() or candidate.email
            candidate_email = candidate.email
            candidate_avatar = candidate.avatar_url if hasattr(candidate, 'avatar_url') else None
            
            # Get profile for skills
            profile_result = await db.execute(
                select(UserProfile).where(UserProfile.user_id == candidate.id)
            )
            profile = profile_result.scalar_one_or_none()
            if profile:
                candidate_skills = profile.skills or []
                candidate_experience = profile.headline
        
        # Get job details
        job_result = await db.execute(
            select(Job).where(Job.id == application.job_id)
        )
        job = job_result.scalar_one_or_none()
        if job:
            job_id = job.id
            job_title = job.title
            company_name = job.company_name
    
    return InterviewDetailResponse(
        id=interview.id,
        application_id=interview.application_id,
        interview_type=interview.interview_type,
        scheduled_at=interview.scheduled_at,
        duration_minutes=interview.duration_minutes,
        location=interview.location,
        meeting_link=interview.meeting_link,
        interviewers=interview.interviewers or [],
        notes=interview.notes,
        status=interview.status,
        created_at=interview.created_at,
        updated_at=interview.updated_at,
        candidate_id=candidate_id,
        candidate_name=candidate_name,
        candidate_email=candidate_email,
        candidate_avatar=candidate_avatar,
        candidate_skills=candidate_skills,
        candidate_experience=candidate_experience,
        match_score=match_score,
        job_id=job_id,
        job_title=job_title,
        company_name=company_name,
        application_status=application_status,
    )


@router.put("/interviews/{interview_id}/reschedule")
async def reschedule_interview(
    interview_id: UUID,
    reschedule: RescheduleRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Reschedule an interview and notify the candidate."""
    result = await db.execute(
        select(Interview).where(Interview.id == interview_id)
    )
    interview = result.scalar_one_or_none()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    old_date = interview.scheduled_at
    
    # Update interview
    if reschedule.scheduled_at and reschedule.scheduled_at.tzinfo:
        interview.scheduled_at = reschedule.scheduled_at.astimezone(timezone.utc).replace(tzinfo=None)
    else:
        interview.scheduled_at = reschedule.scheduled_at
        
    if reschedule.duration_minutes:
        interview.duration_minutes = reschedule.duration_minutes
    if reschedule.location:
        interview.location = reschedule.location
    if reschedule.meeting_link:
        interview.meeting_link = reschedule.meeting_link
    if reschedule.notes:
        interview.notes = reschedule.notes
    interview.status = InterviewStatus.SCHEDULED
    
    # Get candidate for notification
    app_result = await db.execute(
        select(JobApplication).where(JobApplication.id == interview.application_id)
    )
    application = app_result.scalar_one_or_none()
    
    if application:
        user_result = await db.execute(
            select(User).where(User.id == application.applicant_id)
        )
        candidate = user_result.scalar_one_or_none()
        
        job_result = await db.execute(
            select(Job).where(Job.id == application.job_id)
        )
        job = job_result.scalar_one_or_none()
        
        if candidate:
            # Create notification
            notification = Notification(
                user_id=candidate.id,
                title="Interview Rescheduled",
                message=f"Your interview for {job.title if job else 'the position'} has been rescheduled to {reschedule.scheduled_at.strftime('%B %d, %Y at %I:%M %p')}",
                notification_type=NotificationType.INTERVIEW_SCHEDULED,
                link="/techie/my-interviews",
                reference_id=interview.id,
                reference_type="interview"
            )
            db.add(notification)
    
    await db.commit()
    
    return {"status": "rescheduled", "new_date": reschedule.scheduled_at}


@router.put("/interviews/{interview_id}/cancel")
async def cancel_interview(
    interview_id: UUID,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cancel an interview and notify the candidate."""
    result = await db.execute(
        select(Interview).where(Interview.id == interview_id)
    )
    interview = result.scalar_one_or_none()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview.status = InterviewStatus.CANCELLED
    
    # Get candidate for notification
    app_result = await db.execute(
        select(JobApplication).where(JobApplication.id == interview.application_id)
    )
    application = app_result.scalar_one_or_none()
    
    if application:
        user_result = await db.execute(
            select(User).where(User.id == application.applicant_id)
        )
        candidate = user_result.scalar_one_or_none()
        
        job_result = await db.execute(
            select(Job).where(Job.id == application.job_id)
        )
        job = job_result.scalar_one_or_none()
        
        if candidate:
            notification = Notification(
                user_id=candidate.id,
                title="Interview Cancelled",
                message=f"Your interview for {job.title if job else 'the position'} has been cancelled.",
                notification_type=NotificationType.INTERVIEW_SCHEDULED,
                link="/techie/my-interviews",
                reference_id=interview.id,
                reference_type="interview"
            )
            db.add(notification)
    
    await db.commit()
    
    return {"status": "cancelled"}


@router.put("/interviews/{interview_id}/decision")
async def update_interview_decision(
    interview_id: UUID,
    decision: DecisionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update the final decision after interview (Selected/Rejected/On Hold)."""
    result = await db.execute(
        select(Interview).where(Interview.id == interview_id)
    )
    interview = result.scalar_one_or_none()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Get application
    app_result = await db.execute(
        select(JobApplication).where(JobApplication.id == interview.application_id)
    )
    application = app_result.scalar_one_or_none()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Update application status based on decision
    decision_map = {
        'selected': ApplicationStatus.OFFERED,
        'rejected': ApplicationStatus.REJECTED,
        'on_hold': ApplicationStatus.SHORTLISTED,
    }
    
    new_status = decision_map.get(decision.decision.lower())
    if not new_status:
        raise HTTPException(status_code=400, detail="Invalid decision. Use: selected, rejected, or on_hold")
    
    application.status = new_status
    application.notes = decision.notes if decision.notes else application.notes
    interview.status = InterviewStatus.COMPLETED
    
    # Get candidate for notification
    user_result = await db.execute(
        select(User).where(User.id == application.applicant_id)
    )
    candidate = user_result.scalar_one_or_none()
    
    job_result = await db.execute(
        select(Job).where(Job.id == application.job_id)
    )
    job = job_result.scalar_one_or_none()
    
    if candidate:
        if decision.decision.lower() == 'selected':
            notification = Notification(
                user_id=candidate.id,
                title="Congratulations! You've been selected!",
                message=f"Great news! You have been selected for {job.title if job else 'the position'}. We will contact you with next steps.",
                notification_type=NotificationType.APPLICATION_SELECTED,
                link="/techie/my-applications",
                reference_id=application.id,
                reference_type="application"
            )
        elif decision.decision.lower() == 'rejected':
            notification = Notification(
                user_id=candidate.id,
                title="Application Update",
                message=f"Thank you for interviewing for {job.title if job else 'the position'}. Unfortunately, we have decided to move forward with other candidates.",
                notification_type=NotificationType.APPLICATION_REJECTED,
                link="/techie/my-applications",
                reference_id=application.id,
                reference_type="application"
            )
        else:
            notification = Notification(
                user_id=candidate.id,
                title="Application Status Update",
                message=f"Your application for {job.title if job else 'the position'} is on hold. We will update you soon.",
                notification_type=NotificationType.APPLICATION_UPDATE,
                link="/techie/my-applications",
                reference_id=application.id,
                reference_type="application"
            )
        db.add(notification)
    
    await db.commit()
    
    return {"status": "updated", "decision": decision.decision, "application_status": new_status.value}


@router.post("/interviews/{interview_id}/scorecard")
async def submit_scorecard(
    interview_id: UUID,
    scorecard: ScorecardCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit interview scorecard."""
    result = await db.execute(
        select(Interview).where(Interview.id == interview_id)
    )
    interview = result.scalar_one_or_none()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Verify interviewer
    if str(current_user.id) not in [str(i) for i in interview.interviewers]:
        raise HTTPException(status_code=403, detail="Not an interviewer")
    
    db_scorecard = InterviewScorecard(
        interview_id=interview_id,
        interviewer_id=current_user.id,
        **scorecard.model_dump()
    )
    db.add(db_scorecard)
    await db.commit()
    
    return {"status": "submitted"}


# ============= Offers =============

@router.post("/offers", response_model=OfferResponse)
async def create_offer(
    offer: OfferCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a job offer."""
    offer_data = offer.model_dump()
    for field in ['start_date', 'expires_at']:
        if offer_data.get(field) and offer_data[field].tzinfo:
            offer_data[field] = offer_data[field].astimezone(timezone.utc).replace(tzinfo=None)
            
    db_offer = JobOffer(**offer_data)
    db.add(db_offer)
    await db.commit()
    await db.refresh(db_offer)
    return db_offer


@router.put("/offers/{offer_id}/send")
async def send_offer(
    offer_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send offer to candidate."""
    result = await db.execute(
        select(JobOffer).where(JobOffer.id == offer_id)
    )
    offer = result.scalar_one_or_none()
    
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    offer.status = OfferStatus.SENT
    await db.commit()
    
    # TODO: Send offer email
    
    return {"status": "sent"}


@router.put("/offers/{offer_id}/respond")
async def respond_to_offer(
    offer_id: UUID,
    accept: bool,
    notes: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Candidate responds to offer."""
    result = await db.execute(
        select(JobOffer).where(JobOffer.id == offer_id)
    )
    offer = result.scalar_one_or_none()
    
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    offer.status = OfferStatus.ACCEPTED if accept else OfferStatus.DECLINED
    offer.responded_at = datetime.utcnow()
    offer.response_notes = notes
    await db.commit()
    
    return {"status": "accepted" if accept else "declined"}


# ============= Admin Endpoints =============

admin_router = APIRouter(prefix="/admin/hiring", tags=["Admin - Hiring"])


@admin_router.get("/analytics")
async def get_hiring_analytics(
    company_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Get hiring analytics."""
    from sqlalchemy import func
    
    # Total candidates
    candidates_query = select(func.count(CandidateInPipeline.id))
    if company_id:
        candidates_query = candidates_query.join(HiringPipeline).where(
            HiringPipeline.company_id == company_id
        )
    candidates_result = await db.execute(candidates_query)
    total_candidates = candidates_result.scalar()
    
    # Total interviews
    interviews_result = await db.execute(select(func.count(Interview.id)))
    total_interviews = interviews_result.scalar()
    
    # Total offers
    offers_result = await db.execute(select(func.count(JobOffer.id)))
    total_offers = offers_result.scalar()
    
    return {
        "total_candidates": total_candidates,
        "total_interviews": total_interviews,
        "total_offers": total_offers
    }


# ============= Candidate/Techie Interview Endpoints =============

class MyInterviewResponse(BaseModel):
    """Interview response for candidates."""
    id: UUID
    interview_type: InterviewType
    status: InterviewStatus
    scheduled_at: datetime
    duration_minutes: int
    meeting_link: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


@router.get("/my-interviews", response_model=List[MyInterviewResponse])
async def get_my_interviews(
    upcoming: bool = True,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get interviews scheduled for the current user (as a candidate/Techie).
    
    This endpoint returns all interviews where the current user is the applicant.
    """
    
    # Get all job applications by the current user
    apps_result = await db.execute(
        select(JobApplication.id).where(JobApplication.applicant_id == current_user.id)
    )
    application_ids = [app_id for (app_id,) in apps_result.fetchall()]
    
    if not application_ids:
        return []
    
    # Get interviews for these applications
    query = select(Interview).where(Interview.application_id.in_(application_ids))
    
    if upcoming:
        now = datetime.utcnow()
        query = query.where(Interview.scheduled_at >= now)
    
    query = query.order_by(Interview.scheduled_at.asc())
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    interviews = result.scalars().all()
    
    # Enrich with job details
    enriched_interviews = []
    for interview in interviews:
        # Get the application and job details
        app_result = await db.execute(
            select(JobApplication)
            .options(selectinload(JobApplication.job))
            .where(JobApplication.id == interview.application_id)
        )
        application = app_result.scalar_one_or_none()
        
        job_title = None
        company_name = None
        if application and application.job:
            job_title = application.job.title
            company_name = application.job.company_name
        
        enriched_interviews.append(MyInterviewResponse(
            id=interview.id,
            interview_type=interview.interview_type,
            status=interview.status,
            scheduled_at=interview.scheduled_at,
            duration_minutes=interview.duration_minutes,
            meeting_link=interview.meeting_link,
            location=interview.location,
            notes=interview.notes,
            job_title=job_title,
            company_name=company_name,
            created_at=interview.created_at
        ))
    
    return enriched_interviews


@router.get("/my-interviews/count")
async def get_my_interviews_count(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get count of upcoming interviews for the current user."""
    
    # Get all job applications by the current user
    apps_result = await db.execute(
        select(JobApplication.id).where(JobApplication.applicant_id == current_user.id)
    )
    application_ids = [app_id for (app_id,) in apps_result.fetchall()]
    
    if not application_ids:
        return {"upcoming": 0, "total": 0}
    
    # Count upcoming interviews
    now = datetime.utcnow()
    upcoming_result = await db.execute(
        select(func.count(Interview.id))
        .where(Interview.application_id.in_(application_ids))
        .where(Interview.scheduled_at >= now)
    )
    upcoming_count = upcoming_result.scalar() or 0
    
    # Count total interviews
    total_result = await db.execute(
        select(func.count(Interview.id))
        .where(Interview.application_id.in_(application_ids))
    )
    total_count = total_result.scalar() or 0
    
    return {"upcoming": upcoming_count, "total": total_count}


# ============= In-App Notifications Endpoints =============

class NotificationResponse(BaseModel):
    """Notification response schema."""
    id: UUID
    title: str
    message: str
    notification_type: str
    link: Optional[str] = None
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


@router.get("/notifications", response_model=List[NotificationResponse])
async def get_my_notifications(
    unread_only: bool = False,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get notifications for the current user."""
    
    query = select(Notification).where(Notification.user_id == current_user.id)
    
    if unread_only:
        query = query.where(Notification.is_read == False)
    
    query = query.order_by(Notification.created_at.desc())
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    notifications = result.scalars().all()
    
    return [
        NotificationResponse(
            id=n.id,
            title=n.title,
            message=n.message,
            notification_type=n.notification_type.value if n.notification_type else "system",
            link=n.link,
            is_read=n.is_read,
            created_at=n.created_at
        )
        for n in notifications
    ]


@router.get("/notifications/unread-count")
async def get_unread_notifications_count(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get count of unread notifications."""
    
    result = await db.execute(
        select(func.count(Notification.id))
        .where(Notification.user_id == current_user.id)
        .where(Notification.is_read == False)
    )
    count = result.scalar() or 0
    
    return {"unread_count": count}


@router.put("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark a notification as read."""
    
    result = await db.execute(
        select(Notification)
        .where(Notification.id == notification_id)
        .where(Notification.user_id == current_user.id)
    )
    notification = result.scalar_one_or_none()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    notification.read_at = datetime.utcnow()
    await db.commit()
    
    return {"status": "read"}


@router.put("/notifications/mark-all-read")
async def mark_all_notifications_read(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark all notifications as read for the current user."""
    
    from sqlalchemy import update
    
    await db.execute(
        update(Notification)
        .where(Notification.user_id == current_user.id)
        .where(Notification.is_read == False)
        .values(is_read=True, read_at=datetime.utcnow())
    )
    await db.commit()
    
    return {"status": "all_read"}


# ============= Analytics Endpoint =============

class AnalyticsResponse(BaseModel):
    """Analytics data for HM dashboard."""
    total_applicants: int = 0
    interviews_scheduled: int = 0
    offers_made: int = 0
    active_jobs: int = 0
    pipeline_metrics: List[dict] = []
    job_performance: List[dict] = []
    source_metrics: List[dict] = []


@router.get("/analytics", response_model=AnalyticsResponse)
async def get_hiring_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get hiring analytics for the current HM's jobs."""
    jobs_result = await db.execute(
        select(Job).where(Job.posted_by_id == current_user.id)
    )
    hm_jobs = jobs_result.scalars().all()
    job_ids = [job.id for job in hm_jobs]
    
    if not job_ids:
        return AnalyticsResponse()
    
    # Get all applications for HM's jobs
    apps_result = await db.execute(
        select(JobApplication).where(JobApplication.job_id.in_(job_ids))
    )
    applications = apps_result.scalars().all()
    
    # Count by status
    status_counts = {
        'submitted': 0,
        'under_review': 0,
        'shortlisted': 0,
        'interview': 0,
        'offered': 0,
        'hired': 0,
        'rejected': 0,
    }
    
    for app in applications:
        status = app.status.value.lower() if app.status else 'submitted'
        if status in status_counts:
            status_counts[status] += 1
    
    total = len(applications) or 1
    
    # Pipeline metrics
    pipeline_metrics = [
        {'stage': 'New Applicants', 'count': status_counts['submitted'], 'percentage': 100},
        {'stage': 'Screening', 'count': status_counts['under_review'] + status_counts['shortlisted'], 'percentage': round((status_counts['under_review'] + status_counts['shortlisted']) / total * 100)},
        {'stage': 'Interview', 'count': status_counts['interview'], 'percentage': round(status_counts['interview'] / total * 100)},
        {'stage': 'Offer', 'count': status_counts['offered'], 'percentage': round(status_counts['offered'] / total * 100)},
        {'stage': 'Hired', 'count': status_counts['hired'], 'percentage': round(status_counts['hired'] / total * 100)},
    ]
    
    # Job performance
    job_performance = []
    for job in hm_jobs:
        job_apps = [a for a in applications if a.job_id == job.id]
        job_performance.append({
            'title': job.title,
            'applicants': len(job_apps),
            'interviews': len([a for a in job_apps if a.status and a.status.value.lower() == 'interview']),
            'offers': len([a for a in job_apps if a.status and a.status.value.lower() in ['offered', 'hired']]),
            'status': 'active' if job.status == 'published' else job.status,
        })
    
    # Count interviews
    interviews_result = await db.execute(
        select(func.count(Interview.id)).where(
            cast(Interview.interviewers, JSONB).contains([str(current_user.id)])
        )
    )
    interviews_count = interviews_result.scalar() or 0
    
    # Source metrics (all from VerTechie for now)
    source_metrics = [
        {
            'source': 'VerTechie',
            'applicants': len(applications),
            'hires': status_counts['hired'],
            'conversionRate': round(status_counts['hired'] / total * 100) if total else 0
        },
    ]
    
    return AnalyticsResponse(
        total_applicants=len(applications),
        interviews_scheduled=status_counts['interview'],
        offers_made=status_counts['offered'] + status_counts['hired'],
        active_jobs=len([j for j in hm_jobs if j.status == 'published']),
        pipeline_metrics=pipeline_metrics,
        job_performance=job_performance,
        source_metrics=source_metrics,
    )

