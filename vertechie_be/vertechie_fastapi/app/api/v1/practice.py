"""
Practice/Coding API Routes
Problems, Contests, and Submissions
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import JSONB

from app.db.session import get_db
from app.models.practice import (
    ProblemCategory, Problem, TestCase, ProblemHint, ProblemSolution,
    Submission, SubmissionTestResult,
    Contest, ContestRegistration, UserProgress, ProblemBookmark,
    Difficulty, ProblemStatus, SubmissionStatus, ContestStatus
)
from app.models.user import User, UserProfile
from app.core.security import get_current_user, get_current_admin_user, get_optional_user
from pydantic import BaseModel, field_validator
from datetime import datetime, date, timedelta

# Note: Prefix for this router is added in app.api.v1.__init__ as `/practice`.
# Defining the prefix here as well would result in double prefixing
# (i.e. `/practice/practice/...`) and 404s for routes like `/practice/problems`.
router = APIRouter(tags=["Practice"])


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

class TestCaseResponse(BaseModel):
    id: UUID
    input_data: str
    expected_output: str
    explanation: Optional[str] = None
    is_sample: bool
    
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
    acceptance_rate: float = 0.0  # (accepted_count / submission_count) * 100 when submission_count > 0
    likes: int
    dislikes: int
    created_at: datetime
    
    class Config:
        from_attributes = True

    # Extra fields not in key ProblemBase but needed for UI
    companies: List[str] = []
    categories: List[CategoryResponse] = []
    hints: List[str] = []
    sample_test_cases: List[TestCaseResponse] = []
    starter_code: dict = {}  # Language -> code template for IDE
    is_solved: bool = False  # True if current user has an accepted submission

    @field_validator('hints', mode='before')
    @classmethod
    def extract_hints(cls, v):
        if v is None or not isinstance(v, (list, tuple)):
            return []
        if len(v) == 0:
            return []
        # If it's a list of strings, return as is
        first = v[0]
        if isinstance(first, str):
            return list(v)
        # List of ProblemHint-like objects: extract content safely
        try:
            return [getattr(h, 'content', str(h)) for h in v]
        except Exception:
            return []

    @field_validator('sample_test_cases', mode='before')
    @classmethod
    def extract_sample_test_cases(cls, v, info):
        if v is None or not isinstance(v, (list, tuple)):
            return []
        return list(v)


class ProblemListResponse(BaseModel):
    id: UUID
    problem_number: int
    title: str
    slug: str
    difficulty: Difficulty
    acceptance_rate: float
    is_premium: bool
    tags: List[str] = []
    is_solved: bool = False  # True if current user has an accepted submission for this problem
    
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


class LeaderboardEntryResponse(BaseModel):
    rank: int
    user_id: UUID
    name: str
    avatar_url: Optional[str] = None
    points: int
    streak: int
    lessons_completed: int

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
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    """List problems with filters. is_solved is set for current user when authenticated."""
    query = select(Problem).where(Problem.status == ProblemStatus.PUBLISHED)
    
    if difficulty:
        query = query.where(Problem.difficulty == difficulty)
    if search:
        query = query.where(Problem.title.ilike(f"%{search}%"))
    if tag:
        query = query.where(cast(Problem.tags, JSONB).contains([tag]))
    if category:
        # Filter by category slug or name
        category_query = select(ProblemCategory).where(
            (ProblemCategory.slug == category) | (ProblemCategory.name.ilike(f"%{category}%"))
        )
        category_result = await db.execute(category_query)
        category_obj = category_result.scalar_one_or_none()
        if category_obj:
            # Join with problem_category_association table
            from app.models.practice import problem_category_association
            query = query.join(
                problem_category_association,
                Problem.id == problem_category_association.c.problem_id
            ).where(problem_category_association.c.category_id == category_obj.id)
    
    query = query.order_by(Problem.problem_number).offset(skip).limit(limit)
    result = await db.execute(query)
    problems = result.scalars().all()
    
    # Set is_solved for current user: problems where user has at least one accepted submission
    solved_ids = set()
    if current_user and problems:
        solved_result = await db.execute(
            select(Submission.problem_id).where(
                Submission.user_id == current_user.id,
                Submission.status == SubmissionStatus.ACCEPTED,
                Submission.problem_id.in_([p.id for p in problems]),
            ).distinct()
        )
        solved_ids = {row[0] for row in solved_result.fetchall()}
    
    return [
        ProblemListResponse(
            id=p.id,
            problem_number=p.problem_number,
            title=p.title,
            slug=p.slug,
            difficulty=p.difficulty,
            acceptance_rate=p.acceptance_rate,
            is_premium=p.is_premium,
            tags=p.tags or [],
            is_solved=p.id in solved_ids,
        )
        for p in problems
    ]


@router.get("/problems/{problem_id}", response_model=ProblemResponse)
async def get_problem(
    problem_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    """Get problem details."""
    result = await db.execute(
        select(Problem)
        .options(
            selectinload(Problem.categories),
            selectinload(Problem.hints),
            selectinload(Problem.test_cases)
        )
        .where(Problem.id == problem_id)
    )
    problem = result.scalar_one_or_none()
    
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    # Post-process for Pydantic
    # Filter sample test cases
    problem.sample_test_cases = [tc for tc in problem.test_cases if tc.is_sample]
    
    # Set is_solved if current user has an accepted submission for this problem
    is_solved = False
    if current_user:
        solved_check = await db.execute(
            select(Submission.id).where(
                Submission.user_id == current_user.id,
                Submission.problem_id == problem.id,
                Submission.status == SubmissionStatus.ACCEPTED,
            ).limit(1)
        )
        is_solved = solved_check.first() is not None
    setattr(problem, 'is_solved', is_solved)
    
    return problem


@router.get("/problems/slug/{slug}", response_model=ProblemResponse)
async def get_problem_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    """Get problem by slug."""
    result = await db.execute(
        select(Problem)
        .options(
            selectinload(Problem.categories),
            selectinload(Problem.hints),
            selectinload(Problem.test_cases)
        )
        .where(Problem.slug == slug)
    )
    problem = result.scalar_one_or_none()
    
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    # Post-process for Pydantic
    # Filter sample test cases
    problem.sample_test_cases = [tc for tc in problem.test_cases if tc.is_sample]

    # Set is_solved if current user has an accepted submission for this problem
    is_solved = False
    if current_user:
        solved_check = await db.execute(
            select(Submission.id).where(
                Submission.user_id == current_user.id,
                Submission.problem_id == problem.id,
                Submission.status == SubmissionStatus.ACCEPTED,
            ).limit(1)
        )
        is_solved = solved_check.first() is not None
    setattr(problem, 'is_solved', is_solved)

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


@router.post("/problems/{problem_id}/like")
async def like_problem(
    problem_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Like a problem."""
    result = await db.execute(
        select(Problem).where(Problem.id == problem_id)
    )
    problem = result.scalar_one_or_none()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    problem.likes += 1
    await db.commit()
    
    return {"likes": problem.likes, "dislikes": problem.dislikes}


@router.post("/problems/{problem_id}/dislike")
async def dislike_problem(
    problem_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Dislike a problem."""
    result = await db.execute(
        select(Problem).where(Problem.id == problem_id)
    )
    problem = result.scalar_one_or_none()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    problem.dislikes += 1
    await db.commit()
    
    return {"likes": problem.likes, "dislikes": problem.dislikes}


@router.post("/problems/{problem_id}/bookmark")
async def bookmark_problem(
    problem_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Bookmark a problem."""
    # Check if already bookmarked
    existing = await db.execute(
        select(ProblemBookmark).where(
            ProblemBookmark.problem_id == problem_id,
            ProblemBookmark.user_id == current_user.id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already bookmarked")
    
    bookmark = ProblemBookmark(
        problem_id=problem_id,
        user_id=current_user.id
    )
    db.add(bookmark)
    await db.commit()
    
    return {"status": "bookmarked"}


@router.delete("/problems/{problem_id}/bookmark")
async def remove_bookmark(
    problem_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove bookmark from a problem."""
    result = await db.execute(
        select(ProblemBookmark).where(
            ProblemBookmark.problem_id == problem_id,
            ProblemBookmark.user_id == current_user.id
        )
    )
    bookmark = result.scalar_one_or_none()
    
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    
    await db.delete(bookmark)
    await db.commit()
    
    return {"status": "removed"}


@router.get("/problems/{problem_id}/bookmark")
async def check_bookmark(
    problem_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Check if a problem is bookmarked."""
    result = await db.execute(
        select(ProblemBookmark).where(
            ProblemBookmark.problem_id == problem_id,
            ProblemBookmark.user_id == current_user.id
        )
    )
    bookmark = result.scalar_one_or_none()
    
    return {"is_bookmarked": bookmark is not None}


@router.get("/bookmarks", response_model=List[ProblemListResponse])
async def list_my_bookmarks(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List my bookmarked problems."""
    result = await db.execute(
        select(Problem)
        .join(ProblemBookmark, Problem.id == ProblemBookmark.problem_id)
        .where(ProblemBookmark.user_id == current_user.id)
        .order_by(ProblemBookmark.created_at.desc())
        .offset(skip).limit(limit)
    )
    return result.scalars().all()


class SolutionResponse(BaseModel):
    id: UUID
    title: str
    content: str
    language: Optional[str] = None
    author_id: UUID
    author_name: Optional[str] = None
    upvotes: int
    downvotes: int
    is_official: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


@router.get("/problems/{problem_id}/solutions", response_model=List[SolutionResponse])
async def get_problem_solutions(
    problem_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Get solutions for a problem."""
    query = select(ProblemSolution).where(
        ProblemSolution.problem_id == problem_id
    ).order_by(
        ProblemSolution.is_official.desc(),
        ProblemSolution.upvotes.desc()
    ).offset(skip).limit(limit)
    
    result = await db.execute(query)
    solutions = result.scalars().all()
    
    # Get author names
    solution_list = []
    for solution in solutions:
        author_result = await db.execute(
            select(User).where(User.id == solution.author_id)
        )
        author = author_result.scalar_one_or_none()
        author_name = f"{author.first_name} {author.last_name}".strip() if author else "Unknown"
        
        solution_list.append({
            **solution.__dict__,
            "author_name": author_name
        })
    
    return solution_list


@router.post("/problems/{problem_id}/solutions")
async def create_solution(
    problem_id: UUID,
    title: str,
    content: str,
    language: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a solution for a problem."""
    # Verify problem exists
    problem_result = await db.execute(
        select(Problem).where(Problem.id == problem_id)
    )
    problem = problem_result.scalar_one_or_none()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    solution = ProblemSolution(
        problem_id=problem_id,
        author_id=current_user.id,
        title=title,
        content=content,
        language=language,
        is_official=False
    )
    db.add(solution)
    await db.commit()
    await db.refresh(solution)
    
    return solution


@router.get("/problems/random/", response_model=ProblemResponse)
async def get_random_problem(
    difficulty: Optional[Difficulty] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get a random problem (optionally filtered by difficulty)."""
    query = select(Problem).where(Problem.status == ProblemStatus.PUBLISHED)
    
    if difficulty:
        query = query.where(Problem.difficulty == difficulty)
    
    # Get count first
    count_result = await db.execute(
        select(func.count(Problem.id)).select_from(query.subquery())
    )
    total = count_result.scalar() or 0
    
    if total == 0:
        raise HTTPException(status_code=404, detail="No problems found")
    
    # Get random offset
    import random
    random_offset = random.randint(0, total - 1)
    
    query = query.offset(random_offset).limit(1)
    result = await db.execute(query)
    problem = result.scalar_one_or_none()
    
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    return problem


@router.get("/problems/daily/", response_model=ProblemResponse)
async def get_daily_problem(
    db: AsyncSession = Depends(get_db)
):
    """Get today's daily problem (same problem for all users on a given day)."""
    from datetime import date
    
    # Use date as seed for consistent daily problem
    today = date.today()
    seed = int(today.strftime("%Y%m%d"))
    
    # Get total published problems
    count_result = await db.execute(
        select(func.count(Problem.id)).where(Problem.status == ProblemStatus.PUBLISHED)
    )
    total = count_result.scalar() or 0
    
    if total == 0:
        raise HTTPException(status_code=404, detail="No problems available")
    
    # Use seed to pick consistent problem for the day
    import random
    random.seed(seed)
    daily_index = random.randint(0, total - 1)
    
    query = select(Problem).where(Problem.status == ProblemStatus.PUBLISHED)
    query = query.order_by(Problem.problem_number).offset(daily_index).limit(1)
    result = await db.execute(query)
    problem = result.scalar_one_or_none()
    
    if not problem:
        raise HTTPException(status_code=404, detail="Daily problem not found")
    
    return problem


@router.get("/streaks/")
async def get_streaks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's coding streak information."""
    progress_result = await db.execute(
        select(UserProgress).where(UserProgress.user_id == current_user.id)
    )
    progress = progress_result.scalar_one_or_none()
    
    if not progress:
        # Create default progress
        progress = UserProgress(user_id=current_user.id)
        db.add(progress)
        await db.commit()
        await db.refresh(progress)
    
    # Calculate today's solved count
    from datetime import date, timedelta
    today = date.today()
    today_start = datetime.combine(today, datetime.min.time())
    
    today_submissions = await db.execute(
        select(func.count(Submission.id)).where(
            Submission.user_id == current_user.id,
            Submission.status == SubmissionStatus.ACCEPTED,
            Submission.submitted_at >= today_start
        )
    )
    today_solved = today_submissions.scalar() or 0
    
    # Calculate this week's solved count
    week_start = today_start - timedelta(days=today.weekday())
    week_submissions = await db.execute(
        select(func.count(Submission.id)).where(
            Submission.user_id == current_user.id,
            Submission.status == SubmissionStatus.ACCEPTED,
            Submission.submitted_at >= week_start
        )
    )
    week_solved = week_submissions.scalar() or 0
    
    return {
        "current_streak": progress.current_streak,
        "max_streak": progress.max_streak,
        "today_solved": today_solved,
        "week_solved": week_solved,
        "last_submission_date": progress.last_submission_date.isoformat() if progress.last_submission_date else None,
    }


# ============= Submissions =============

async def execute_submission(
    submission_id: UUID,
    problem_id: UUID,
    db: AsyncSession,
    use_sample_only: bool = False
):
    """Execute submission code against problem test cases.
    
    Args:
        submission_id: The submission ID
        problem_id: The problem ID
        db: Database session
        use_sample_only: If True, only run against sample test cases (for "run" mode)
                         If False, run against all test cases (for "submit" mode)
    """
    # Refresh submission and problem from database
    submission_result = await db.execute(
        select(Submission).where(Submission.id == submission_id)
    )
    submission = submission_result.scalar_one_or_none()
    if not submission:
        return
    
    problem_result = await db.execute(
        select(Problem).where(Problem.id == problem_id)
    )
    problem = problem_result.scalar_one_or_none()
    if not problem:
        return
    
    # Get test cases for the problem
    # For "run" mode, only use sample test cases
    # For "submit" mode, use all test cases
    if use_sample_only:
        test_cases_result = await db.execute(
            select(TestCase).where(
                TestCase.problem_id == problem.id,
                TestCase.is_sample == True
            ).order_by(TestCase.order)
        )
    else:
        test_cases_result = await db.execute(
            select(TestCase).where(
                TestCase.problem_id == problem.id
            ).order_by(TestCase.order)
        )
    test_cases = test_cases_result.scalars().all()
    
    if not test_cases:
        # No test cases - mark as internal error
        submission.status = SubmissionStatus.INTERNAL_ERROR
        submission.error_message = "No test cases available for this problem"
        submission.test_cases_total = 0
        submission.test_cases_passed = 0
        await db.commit()
        return
    
    submission.status = SubmissionStatus.RUNNING
    submission.test_cases_total = len(test_cases)
    submission.test_cases_passed = 0
    await db.commit()
    
    # Try to call judge service if available
    # In production, this should be queued to a background worker (Celery, etc.)
    try:
        import httpx
        
        # Try calling judge service (if available at localhost:8001 or configured URL)
        judge_url = "http://localhost:8001/execute"
        
        try:
            # Use shorter timeout for "run" mode (sample test cases only)
            # Use longer timeout for "submit" mode (all test cases)
            timeout_seconds = 10.0 if use_sample_only else 30.0
            
            async with httpx.AsyncClient(timeout=timeout_seconds) as client:
                response = await client.post(
                    judge_url,
                    json={
                        "language": submission.language,
                        "code": submission.code,
                        "problem_id": str(problem.id),
                        "test_cases": [
                            {
                                "input": tc.input_data,
                                "expected_output": tc.expected_output,
                            }
                            for tc in test_cases
                        ],
                        "time_limit_ms": 2000 if use_sample_only else 5000,  # Shorter timeout for run mode
                    },
                )
                
                if response.status_code == 200:
                    result = response.json()
                    # Update submission based on judge response
                    if result.get("status") == "ACCEPTED":
                        submission.status = SubmissionStatus.ACCEPTED
                        submission.test_cases_passed = submission.test_cases_total
                        # Update problem accepted count
                        problem.accepted_count += 1
                        # Get or create user progress (for both first-solve counts and streak)
                        progress_result = await db.execute(
                            select(UserProgress).where(UserProgress.user_id == submission.user_id)
                        )
                        progress = progress_result.scalar_one_or_none()
                        if not progress:
                            progress = UserProgress(user_id=submission.user_id)
                            db.add(progress)
                            await db.flush()
                        # First time solving this problem? Update solved counts
                        prev_count_result = await db.execute(
                            select(func.count(Submission.id)).where(
                                Submission.user_id == submission.user_id,
                                Submission.problem_id == problem.id,
                                Submission.status == SubmissionStatus.ACCEPTED,
                                Submission.id != submission.id,
                            )
                        )
                        if (prev_count_result.scalar() or 0) == 0:
                            progress.total_solved = (progress.total_solved or 0) + 1
                            if problem.difficulty == Difficulty.EASY:
                                progress.easy_solved = (progress.easy_solved or 0) + 1
                            elif problem.difficulty == Difficulty.MEDIUM:
                                progress.medium_solved = (progress.medium_solved or 0) + 1
                            else:
                                progress.hard_solved = (progress.hard_solved or 0) + 1
                        # Update streak and last submission date for every accepted
                        sub_date = submission.submitted_at.date() if submission.submitted_at else date.today()
                        last_date = progress.last_submission_date.date() if progress.last_submission_date else None
                        if last_date is None:
                            progress.current_streak = 1
                            progress.max_streak = max(progress.max_streak or 0, 1)
                        elif sub_date == last_date:
                            pass  # same day, streak unchanged
                        elif sub_date == last_date + timedelta(days=1):
                            progress.current_streak = (progress.current_streak or 0) + 1
                            progress.max_streak = max(progress.max_streak or 0, progress.current_streak)
                        else:
                            progress.current_streak = 1
                            progress.max_streak = max(progress.max_streak or 0, 1)
                        progress.last_submission_date = submission.submitted_at or datetime.utcnow()
                    elif result.get("status") == "WRONG_ANSWER":
                        submission.status = SubmissionStatus.WRONG_ANSWER
                        submission.test_cases_passed = result.get("passed", 0)
                    elif result.get("status") == "RUNTIME_ERROR":
                        submission.status = SubmissionStatus.RUNTIME_ERROR
                        submission.error_message = result.get("stderr") or "Runtime error (No details provided)"
                    elif result.get("status") == "TIME_LIMIT":
                        submission.status = SubmissionStatus.TIME_LIMIT
                        submission.error_message = "Time Limit Exceeded"
                    elif result.get("status") == "COMPILE_ERROR":
                        submission.status = SubmissionStatus.COMPILE_ERROR
                        submission.error_message = result.get("stderr") or "Compile error (No details provided)"
                    else:
                        submission.status = SubmissionStatus.INTERNAL_ERROR
                    
                    submission.runtime_ms = result.get("runtime_ms")
                    submission.memory_kb = result.get("memory_kb")
                    
                    # Save test results
                    if result.get("test_results"):
                        for idx, test_result in enumerate(result["test_results"]):
                            test_result_obj = SubmissionTestResult(
                                submission_id=submission.id,
                                test_case_number=idx + 1,
                                status="passed" if test_result.get("passed") else "failed",
                                input_data=test_cases[idx].input_data if idx < len(test_cases) else None,
                                expected_output=test_cases[idx].expected_output if idx < len(test_cases) else None,
                                actual_output=test_result.get("actual"),
                                runtime_ms=test_result.get("runtime_ms"),
                            )
                            db.add(test_result_obj)
                    
                    await db.commit()
                    return
                else:
                    # Judge service returned non-200 status
                    print(f"Judge service returned status {response.status_code}: {response.text}")
                    submission.status = SubmissionStatus.INTERNAL_ERROR
                    submission.error_message = f"Judge service error: {response.status_code}"
                    await db.commit()
                    return
        except httpx.ConnectError as connect_error:
            # Judge service not running
            print(f"Judge service unavailable (connection error): {connect_error}")
            submission.status = SubmissionStatus.PENDING
            submission.error_message = "Execution service temporarily unavailable. Please ensure the judge service is running on localhost:8001"
            await db.commit()
            return
        except httpx.TimeoutException as timeout_error:
            # Judge service timeout
            print(f"Judge service timeout: {timeout_error}")
            submission.status = SubmissionStatus.TIME_LIMIT
            submission.error_message = "Execution timed out"
            await db.commit()
            return
        except Exception as judge_error:
            # Other judge service errors
            print(f"Judge service error: {type(judge_error).__name__}: {judge_error}")
            submission.status = SubmissionStatus.INTERNAL_ERROR
            submission.error_message = f"Execution failed: {str(judge_error)}"
            await db.commit()
            return
            
    except Exception as e:
        # Fallback: mark as internal error
        submission.status = SubmissionStatus.INTERNAL_ERROR
        submission.error_message = f"Execution failed: {str(e)}"
        await db.commit()


@router.post("/submit", response_model=SubmissionResponse)
async def submit_code(
    submission: SubmissionCreate,
    background_tasks: BackgroundTasks,
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
    
    # Update problem stats
    problem.submission_count += 1
    await db.commit()
    
    # Execute submission
    # For "run" mode (is_submission=False): execute immediately against sample test cases only
    # For "submit" mode (is_submission=True): execute asynchronously against all test cases
    if submission.is_submission:
        # Add background task for execution (all test cases)
        # Create a new database session for the background task
        from app.db.session import AsyncSessionLocal
        async def run_execution():
            async with AsyncSessionLocal() as bg_db:
                try:
                    await execute_submission(db_submission.id, problem.id, bg_db, use_sample_only=False)
                except Exception as e:
                    print(f"Error executing submission: {e}")
                finally:
                    await bg_db.close()
        background_tasks.add_task(run_execution)
    else:
        # For "run" mode: execute immediately against sample test cases only
        # This provides quick feedback to the user
        try:
            await execute_submission(db_submission.id, problem.id, db, use_sample_only=True)
        except Exception as e:
            print(f"Error executing run: {e}")
            # Don't fail the request, just log the error
    
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


@router.get("/leaderboard", response_model=List[LeaderboardEntryResponse])
async def get_leaderboard(
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get top learners leaderboard from real user_progress data."""
    result = await db.execute(
        select(UserProgress, User, UserProfile)
        .join(User, User.id == UserProgress.user_id)
        .outerjoin(UserProfile, UserProfile.user_id == User.id)
        .order_by(
            UserProgress.total_solved.desc(),
            UserProgress.current_streak.desc(),
            UserProgress.rating.desc(),
            UserProgress.updated_at.desc(),
        )
        .limit(limit)
    )

    rows = result.all()
    leaderboard: List[LeaderboardEntryResponse] = []

    for idx, row in enumerate(rows, start=1):
        progress, user, profile = row
        display_name = user.full_name or user.email.split("@")[0]
        leaderboard.append(
            LeaderboardEntryResponse(
                rank=idx,
                user_id=user.id,
                name=display_name,
                avatar_url=profile.avatar_url if profile else None,
                points=int(progress.rating or 0),
                streak=int(progress.current_streak or 0),
                lessons_completed=int(progress.total_solved or 0),
            )
        )

    return leaderboard


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

