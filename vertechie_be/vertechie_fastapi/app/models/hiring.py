"""
Hiring/ATS Models for FastAPI
Migrated from Django v_hiring
"""

from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, DateTime, 
    ForeignKey, JSON, Enum as SQLEnum, Table
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.db.base import Base


# Association table for assessment coding problems
assessment_problems = Table(
    'assessment_problems',
    Base.metadata,
    Column('assessment_id', UUID(as_uuid=True), ForeignKey('assessments.id')),
    Column('problem_id', UUID(as_uuid=True), ForeignKey('problems.id'))
)


class HiringPipeline(Base):
    """Hiring pipeline/workflow."""
    __tablename__ = "hiring_pipelines"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"))
    
    name = Column(String(100), nullable=False)
    description = Column(Text)
    
    is_default = Column(Boolean, default=False)
    is_template = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    stages = relationship("PipelineStage", back_populates="pipeline", order_by="PipelineStage.order")
    candidates = relationship("CandidateInPipeline", back_populates="pipeline")


class StageType(str, enum.Enum):
    APPLIED = "applied"
    SCREENING = "screening"
    PHONE_SCREEN = "phone_screen"
    ASSESSMENT = "assessment"
    INTERVIEW = "interview"
    ONSITE = "onsite"
    OFFER = "offer"
    HIRED = "hired"
    REJECTED = "rejected"


class PipelineStage(Base):
    """Stage in a hiring pipeline."""
    __tablename__ = "pipeline_stages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    pipeline_id = Column(UUID(as_uuid=True), ForeignKey("hiring_pipelines.id"))
    
    name = Column(String(100), nullable=False)
    stage_type = Column(SQLEnum(StageType))
    description = Column(Text)
    
    color = Column(String(7), default="#3498db")
    order = Column(Integer, default=0)
    
    # Automation
    auto_advance_days = Column(Integer)
    auto_reject_days = Column(Integer)
    
    # Email templates
    email_on_enter = Column(Text)
    email_on_reject = Column(Text)
    
    # Relationships
    pipeline = relationship("HiringPipeline", back_populates="stages")


class CandidateInPipeline(Base):
    """Candidate's position in a pipeline."""
    __tablename__ = "candidates_in_pipeline"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    application_id = Column(UUID(as_uuid=True), ForeignKey("job_applications.id"))
    pipeline_id = Column(UUID(as_uuid=True), ForeignKey("hiring_pipelines.id"))
    current_stage_id = Column(UUID(as_uuid=True), ForeignKey("pipeline_stages.id"))
    
    # Assigned recruiter
    assigned_to_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    # Stage history
    stage_history = Column(JSON, default=list)  # [{stage, entered_at, left_at}]
    
    # Priority
    priority = Column(Integer, default=0)
    is_starred = Column(Boolean, default=False)
    
    entered_stage_at = Column(DateTime, default=datetime.utcnow)
    
    rejection_reason = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    pipeline = relationship("HiringPipeline", back_populates="candidates")
    application = relationship("JobApplication")


class AssessmentType(str, enum.Enum):
    CODING = "coding"
    MCQ = "mcq"
    SKILLS = "skills"
    PERSONALITY = "personality"
    COGNITIVE = "cognitive"
    CUSTOM = "custom"


class Assessment(Base):
    """Pre-hire assessment/test."""
    __tablename__ = "assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"))
    
    title = Column(String(200), nullable=False)
    description = Column(Text)
    instructions = Column(Text)
    
    assessment_type = Column(SQLEnum(AssessmentType))
    
    # Timing
    time_limit_minutes = Column(Integer)
    
    # Scoring
    passing_score = Column(Integer, default=70)
    max_score = Column(Integer, default=100)
    
    # Settings
    is_proctored = Column(Boolean, default=False)
    allow_retake = Column(Boolean, default=False)
    randomize_questions = Column(Boolean, default=True)
    
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    questions = relationship("AssessmentQuestion", back_populates="assessment")
    attempts = relationship("CandidateAssessment", back_populates="assessment")


class QuestionType(str, enum.Enum):
    MCQ = "mcq"
    MULTI_SELECT = "multi_select"
    SHORT_ANSWER = "short_answer"
    LONG_ANSWER = "long_answer"
    CODE = "code"
    FILE_UPLOAD = "file_upload"


class AssessmentQuestion(Base):
    """Question in an assessment."""
    __tablename__ = "assessment_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"))
    
    question_type = Column(SQLEnum(QuestionType))
    question_text = Column(Text, nullable=False)
    
    # For MCQ/Multi-select
    options = Column(JSON, default=list)
    correct_answers = Column(JSON, default=list)
    
    # For code questions
    code_language = Column(String(50))
    starter_code = Column(Text)
    test_cases = Column(JSON, default=list)
    
    points = Column(Integer, default=1)
    order = Column(Integer, default=0)
    
    explanation = Column(Text)
    
    # Relationships
    assessment = relationship("Assessment", back_populates="questions")


class CandidateAssessmentStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    GRADING = "grading"
    COMPLETED = "completed"
    EXPIRED = "expired"


class CandidateAssessment(Base):
    """Candidate's assessment attempt."""
    __tablename__ = "candidate_assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"))
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    application_id = Column(UUID(as_uuid=True), ForeignKey("job_applications.id"))
    
    status = Column(SQLEnum(CandidateAssessmentStatus), default=CandidateAssessmentStatus.NOT_STARTED)
    
    answers = Column(JSON, default=dict)
    
    score = Column(Float)
    passed = Column(Boolean)
    
    started_at = Column(DateTime)
    submitted_at = Column(DateTime)
    time_taken_seconds = Column(Integer)
    
    invited_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)
    
    # Relationships
    assessment = relationship("Assessment", back_populates="attempts")
    results = relationship("AssessmentResult", back_populates="attempt")


class AssessmentResult(Base):
    """Detailed result for each question."""
    __tablename__ = "assessment_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    attempt_id = Column(UUID(as_uuid=True), ForeignKey("candidate_assessments.id"))
    question_id = Column(UUID(as_uuid=True), ForeignKey("assessment_questions.id"))
    
    answer = Column(JSON, default=dict)
    is_correct = Column(Boolean)
    points_earned = Column(Float, default=0)
    
    grader_notes = Column(Text)
    graded_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    # Relationships
    attempt = relationship("CandidateAssessment", back_populates="results")


class InterviewType(str, enum.Enum):
    PHONE = "phone"
    VIDEO = "video"
    ONSITE = "onsite"
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"
    PANEL = "panel"


class InterviewStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class Interview(Base):
    """Interview schedule."""
    __tablename__ = "interviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    application_id = Column(UUID(as_uuid=True), ForeignKey("job_applications.id"))
    
    interview_type = Column(SQLEnum(InterviewType))
    
    # Scheduling
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Integer, default=60)
    timezone = Column(String(50), default="UTC")
    
    # Location/Link
    location = Column(String(200))
    meeting_link = Column(String(500))
    
    # Interviewers
    interviewers = Column(JSONB, default=list)  # List of user IDs
    
    status = Column(SQLEnum(InterviewStatus), default=InterviewStatus.SCHEDULED)
    
    # Notes
    notes = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    scorecards = relationship("InterviewScorecard", back_populates="interview")


class InterviewScorecard(Base):
    """Interview scorecard/feedback."""
    __tablename__ = "interview_scorecards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    interview_id = Column(UUID(as_uuid=True), ForeignKey("interviews.id"))
    interviewer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    # Scores
    overall_score = Column(Integer)  # 1-5
    scores = Column(JSON, default=dict)  # {category: score}
    
    # Feedback
    strengths = Column(Text)
    weaknesses = Column(Text)
    notes = Column(Text)
    
    # Decision
    recommendation = Column(String(50))  # strong_yes, yes, no, strong_no
    
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    interview = relationship("Interview", back_populates="scorecards")


class OfferStatus(str, enum.Enum):
    DRAFT = "draft"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    SENT = "sent"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    EXPIRED = "expired"
    WITHDRAWN = "withdrawn"


class JobOffer(Base):
    """Job offer."""
    __tablename__ = "job_offers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    application_id = Column(UUID(as_uuid=True), ForeignKey("job_applications.id"))
    
    # Compensation
    base_salary = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    salary_period = Column(String(20), default="annual")  # annual, monthly, hourly
    
    # Equity
    equity_type = Column(String(50))  # stock_options, rsu, etc.
    equity_amount = Column(Float)
    vesting_period = Column(String(50))
    
    # Bonus
    signing_bonus = Column(Float)
    annual_bonus = Column(Float)
    
    # Benefits
    benefits = Column(JSON, default=list)
    
    # Job Details
    job_title = Column(String(200))
    start_date = Column(DateTime)
    employment_type = Column(String(50))  # full_time, part_time, contract
    
    # Status
    status = Column(SQLEnum(OfferStatus), default=OfferStatus.DRAFT)
    
    # Expiry
    expires_at = Column(DateTime)
    
    # Response
    responded_at = Column(DateTime)
    response_notes = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

