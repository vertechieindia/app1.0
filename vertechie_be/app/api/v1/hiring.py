"""
Hiring/ATS API Routes
Pipeline, Assessments, Interviews, and Offers
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.hiring import (
    HiringPipeline, PipelineStage, CandidateInPipeline,
    Assessment, AssessmentQuestion, CandidateAssessment, AssessmentResult,
    Interview, InterviewScorecard, JobOffer,
    StageType, AssessmentType, CandidateAssessmentStatus,
    InterviewType, InterviewStatus, OfferStatus
)
from app.models.company import Company, CompanyAdmin
from app.models.user import User
from app.core.security import get_current_user, get_current_admin_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/hiring", tags=["Hiring/ATS"])


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
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Schedule an interview."""
    db_interview = Interview(**interview.model_dump())
    db.add(db_interview)
    await db.commit()
    await db.refresh(db_interview)
    
    # TODO: Send calendar invites
    
    return db_interview


@router.put("/interviews/{interview_id}/status")
async def update_interview_status(
    interview_id: UUID,
    status: InterviewStatus,
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
    
    interview.status = status
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

