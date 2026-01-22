"""
Hiring/ATS API Routes
Pipeline, Assessments, Interviews, and Offers
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

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
from datetime import datetime
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

class InterviewResponse(InterviewCreate):
    id: UUID
    status: InterviewStatus
    created_at: datetime
    
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
        submitted_time = app.submitted_at or app.created_at if hasattr(app, 'created_at') else datetime.utcnow()
        time_diff = datetime.utcnow() - submitted_time
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
            name=name,
            email=applicant.email,
            role=getattr(applicant, 'title', None) or getattr(applicant, 'headline', None) or job.title if job else None,
            stage=stage,
            stage_id=None,  # Will be set if using actual pipeline stages
            skills=skills[:10],  # Limit to 10 skills
            rating=app.rating if app.rating else None,
            time=time_str,
            score=app.rating * 20 if app.rating else 75,
            matchScore=match_score,
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
    from datetime import timedelta
    
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
    """List interviews (as interviewer)."""
    from sqlalchemy import cast, String
    
    query = select(Interview).where(
        Interview.interviewers.contains([str(current_user.id)])
    )
    
    if upcoming:
        query = query.where(Interview.scheduled_at >= datetime.utcnow())
    
    query = query.order_by(Interview.scheduled_at).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/interviews", response_model=InterviewResponse)
async def schedule_interview(
    interview: InterviewCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Schedule an interview with notifications to candidate."""
    
    # Create interview record
    db_interview = Interview(**interview.model_dump())
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
    
    return db_interview


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
    db_offer = JobOffer(**offer.model_dump())
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
        query = query.where(Interview.scheduled_at >= datetime.utcnow())
    
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
    upcoming_result = await db.execute(
        select(func.count(Interview.id))
        .where(Interview.application_id.in_(application_ids))
        .where(Interview.scheduled_at >= datetime.utcnow())
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

