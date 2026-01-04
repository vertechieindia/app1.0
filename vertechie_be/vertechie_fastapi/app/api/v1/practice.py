"""
Practice/Coding API Routes
Problems, Contests, and Submissions
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.practice import (
    ProblemCategory, Problem, TestCase, ProblemHint, ProblemSolution,
    Submission, SubmissionTestResult,
    Contest, ContestRegistration, UserProgress,
    Difficulty, ProblemStatus, SubmissionStatus, ContestStatus
)
from app.models.user import User
from app.core.security import get_current_user, get_current_admin_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/practice", tags=["Practice"])


# ============= Pydantic Schemas =============

class CategoryResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    color: str
    is_active: bool
    
    class Config:
        from_attributes = True

class ProblemBase(BaseModel):
    title: str
    slug: str
    description: str
    difficulty: Difficulty
    examples: List[dict] = []
    constraints: Optional[str] = None
    time_limit_ms: int = 2000
    memory_limit_mb: int = 256
    supported_languages: List[str] = []

class ProblemCreate(ProblemBase):
    category_ids: List[UUID] = []
    tags: List[str] = []
    companies: List[str] = []
    starter_code: dict = {}

class ProblemResponse(ProblemBase):
    id: UUID
    problem_number: int
    status: ProblemStatus
    is_premium: bool
    is_featured: bool
    submission_count: int
    accepted_count: int
    likes: int
    dislikes: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProblemListResponse(BaseModel):
    id: UUID
    problem_number: int
    title: str
    slug: str
    difficulty: Difficulty
    acceptance_rate: float
    is_premium: bool
    tags: List[str] = []
    
    class Config:
        from_attributes = True

class SubmissionCreate(BaseModel):
    problem_id: UUID
    language: str
    code: str
    is_submission: bool = True  # False for "Run"

class SubmissionResponse(BaseModel):
    id: UUID
    problem_id: UUID
    language: str
    status: SubmissionStatus
    runtime_ms: Optional[int] = None
    memory_kb: Optional[int] = None
    test_cases_passed: int
    test_cases_total: int
    error_message: Optional[str] = None
    submitted_at: datetime
    
    class Config:
        from_attributes = True

class ContestResponse(BaseModel):
    id: UUID
    title: str
    slug: str
    description: Optional[str] = None
    contest_type: str
    start_time: datetime
    end_time: datetime
    duration_minutes: Optional[int] = None
    status: ContestStatus
    is_rated: bool
    registrations_count: int
    
    class Config:
        from_attributes = True

class UserProgressResponse(BaseModel):
    easy_solved: int
    medium_solved: int
    hard_solved: int
    total_solved: int
    total_submissions: int
    accepted_submissions: int
    current_streak: int
    max_streak: int
    rating: int
    badges: List[str] = []
    
    class Config:
        from_attributes = True


# ============= Categories =============

@router.get("/categories", response_model=List[CategoryResponse])
async def list_categories(
    db: AsyncSession = Depends(get_db)
):
    """List all problem categories."""
    result = await db.execute(
        select(ProblemCategory).where(ProblemCategory.is_active == True)
    )
    return result.scalars().all()


# ============= Problems =============

@router.get("/problems", response_model=List[ProblemListResponse])
async def list_problems(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    difficulty: Optional[Difficulty] = None,
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List problems with filters."""
    query = select(Problem).where(Problem.status == ProblemStatus.PUBLISHED)
    
    if difficulty:
        query = query.where(Problem.difficulty == difficulty)
    if search:
        query = query.where(Problem.title.ilike(f"%{search}%"))
    if tag:
        query = query.where(Problem.tags.contains([tag]))
    
    query = query.order_by(Problem.problem_number).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/problems/{problem_id}", response_model=ProblemResponse)
async def get_problem(
    problem_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get problem details."""
    result = await db.execute(
        select(Problem)
        .options(
            selectinload(Problem.categories),
            selectinload(Problem.hints)
        )
        .where(Problem.id == problem_id)
    )
    problem = result.scalar_one_or_none()
    
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    return problem


@router.get("/problems/slug/{slug}", response_model=ProblemResponse)
async def get_problem_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    """Get problem by slug."""
    result = await db.execute(
        select(Problem).where(Problem.slug == slug)
    )
    problem = result.scalar_one_or_none()
    
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    return problem


@router.get("/problems/{problem_id}/hints")
async def get_problem_hints(
    problem_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get problem hints (may require points)."""
    result = await db.execute(
        select(ProblemHint).where(ProblemHint.problem_id == problem_id)
    )
    hints = result.scalars().all()
    return [{"id": h.id, "order": h.order, "unlock_cost": h.unlock_cost} for h in hints]


# ============= Submissions =============

@router.post("/submit", response_model=SubmissionResponse)
async def submit_code(
    submission: SubmissionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit code for a problem."""
    # Verify problem exists
    problem_result = await db.execute(
        select(Problem).where(Problem.id == submission.problem_id)
    )
    problem = problem_result.scalar_one_or_none()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    # Create submission
    db_submission = Submission(
        problem_id=submission.problem_id,
        user_id=current_user.id,
        language=submission.language,
        code=submission.code,
        is_submission=submission.is_submission,
        status=SubmissionStatus.PENDING
    )
    db.add(db_submission)
    await db.commit()
    await db.refresh(db_submission)
    
    # TODO: Queue for execution
    # For now, return pending status
    
    return db_submission


@router.get("/submissions", response_model=List[SubmissionResponse])
async def list_my_submissions(
    problem_id: Optional[UUID] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List my submissions."""
    query = select(Submission).where(Submission.user_id == current_user.id)
    
    if problem_id:
        query = query.where(Submission.problem_id == problem_id)
    
    query = query.order_by(Submission.submitted_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/submissions/{submission_id}", response_model=SubmissionResponse)
async def get_submission(
    submission_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get submission details."""
    result = await db.execute(
        select(Submission)
        .options(selectinload(Submission.test_results))
        .where(
            Submission.id == submission_id,
            Submission.user_id == current_user.id
        )
    )
    submission = result.scalar_one_or_none()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return submission


# ============= Contests =============

@router.get("/contests", response_model=List[ContestResponse])
async def list_contests(
    status: Optional[ContestStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """List contests."""
    query = select(Contest)
    
    if status:
        query = query.where(Contest.status == status)
    
    query = query.order_by(Contest.start_time.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/contests/{contest_id}", response_model=ContestResponse)
async def get_contest(
    contest_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get contest details."""
    result = await db.execute(
        select(Contest).where(Contest.id == contest_id)
    )
    contest = result.scalar_one_or_none()
    
    if not contest:
        raise HTTPException(status_code=404, detail="Contest not found")
    
    return contest


@router.post("/contests/{contest_id}/register")
async def register_for_contest(
    contest_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Register for a contest."""
    # Check if already registered
    existing = await db.execute(
        select(ContestRegistration).where(
            ContestRegistration.contest_id == contest_id,
            ContestRegistration.user_id == current_user.id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already registered")
    
    registration = ContestRegistration(
        contest_id=contest_id,
        user_id=current_user.id
    )
    db.add(registration)
    
    # Update contest registration count
    contest_result = await db.execute(
        select(Contest).where(Contest.id == contest_id)
    )
    contest = contest_result.scalar_one_or_none()
    if contest:
        contest.registrations_count += 1
    
    await db.commit()
    return {"status": "registered"}


# ============= Progress =============

@router.get("/progress", response_model=UserProgressResponse)
async def get_my_progress(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get my coding progress."""
    result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == current_user.id)
    )
    progress = result.scalar_one_or_none()
    
    if not progress:
        # Create default progress
        progress = UserProgress(user_id=current_user.id)
        db.add(progress)
        await db.commit()
        await db.refresh(progress)
    
    return progress


# ============= Admin Endpoints =============

admin_router = APIRouter(prefix="/admin/practice", tags=["Admin - Practice"])


@admin_router.post("/problems", response_model=ProblemResponse)
async def create_problem(
    problem: ProblemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Create a new problem."""
    # Get next problem number
    max_result = await db.execute(
        select(func.max(Problem.problem_number))
    )
    max_num = max_result.scalar() or 0
    
    db_problem = Problem(
        problem_number=max_num + 1,
        author_id=current_user.id,
        status=ProblemStatus.DRAFT,
        **problem.model_dump(exclude={'category_ids'})
    )
    db.add(db_problem)
    await db.commit()
    await db.refresh(db_problem)
    
    return db_problem


@admin_router.put("/problems/{problem_id}/publish")
async def publish_problem(
    problem_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Publish a problem."""
    result = await db.execute(
        select(Problem).where(Problem.id == problem_id)
    )
    problem = result.scalar_one_or_none()
    
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    problem.status = ProblemStatus.PUBLISHED
    await db.commit()
    
    return {"status": "published"}


@admin_router.post("/contests", response_model=ContestResponse)
async def create_contest(
    title: str,
    start_time: datetime,
    end_time: datetime,
    description: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Create a contest."""
    contest = Contest(
        title=title,
        slug=title.lower().replace(" ", "-"),
        description=description,
        start_time=start_time,
        end_time=end_time,
        duration_minutes=int((end_time - start_time).total_seconds() / 60)
    )
    db.add(contest)
    await db.commit()
    await db.refresh(contest)
    
    return contest

