"""
Practice/Coding Models for FastAPI
Migrated from Django v_practice and v_techie/coding
"""

from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, DateTime, 
    ForeignKey, JSON, Enum as SQLEnum, Table
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.db.base import Base


# Association table for problem-category many-to-many
problem_category_association = Table(
    'problem_category_association',
    Base.metadata,
    Column('problem_id', UUID(as_uuid=True), ForeignKey('problems.id')),
    Column('category_id', UUID(as_uuid=True), ForeignKey('problem_categories.id'))
)

# Association table for similar problems
similar_problems_association = Table(
    'similar_problems_association',
    Base.metadata,
    Column('problem_id', UUID(as_uuid=True), ForeignKey('problems.id')),
    Column('similar_problem_id', UUID(as_uuid=True), ForeignKey('problems.id'))
)


class ProblemCategory(Base):
    """Problem categories/topics."""
    __tablename__ = "problem_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    icon = Column(String(50))
    color = Column(String(7), default="#3498db")
    
    parent_id = Column(UUID(as_uuid=True), ForeignKey("problem_categories.id"))
    
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    subcategories = relationship("ProblemCategory", backref="parent", remote_side=[id])
    problems = relationship("Problem", secondary=problem_category_association, back_populates="categories")


class Difficulty(str, enum.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class ProblemStatus(str, enum.Enum):
    DRAFT = "draft"
    REVIEW = "review"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class Problem(Base):
    """Coding problem definition."""
    __tablename__ = "problems"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Basic Info
    problem_number = Column(Integer, unique=True, nullable=False)
    title = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, nullable=False)
    
    # Content
    description = Column(Text, nullable=False)  # Markdown supported
    examples = Column(JSON, default=list)  # [{input, output, explanation}]
    constraints = Column(Text)
    follow_up = Column(Text)
    
    # Classification
    difficulty = Column(SQLEnum(Difficulty), nullable=False)
    tags = Column(JSON, default=list)
    companies = Column(JSON, default=list)  # Companies that ask this
    
    # Code Templates
    starter_code = Column(JSON, default=dict)  # Language -> code template
    solution_code = Column(JSON, default=dict)  # Official solutions
    
    # Execution Limits
    time_limit_ms = Column(Integer, default=2000)
    memory_limit_mb = Column(Integer, default=256)
    
    # Supported Languages
    supported_languages = Column(JSON, default=list)
    
    # Author & Status
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    status = Column(SQLEnum(ProblemStatus), default=ProblemStatus.DRAFT)
    is_premium = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    
    # Stats
    submission_count = Column(Integer, default=0)
    accepted_count = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    dislikes = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    categories = relationship("ProblemCategory", secondary=problem_category_association, back_populates="problems")
    test_cases = relationship("TestCase", back_populates="problem")
    hints = relationship("ProblemHint", back_populates="problem")
    solutions = relationship("ProblemSolution", back_populates="problem")
    submissions = relationship("Submission", back_populates="problem")
    
    @property
    def acceptance_rate(self):
        if self.submission_count == 0:
            return 0
        return round((self.accepted_count / self.submission_count) * 100, 1)


class TestCase(Base):
    """Test cases for a problem."""
    __tablename__ = "test_cases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    problem_id = Column(UUID(as_uuid=True), ForeignKey("problems.id"))
    
    input_data = Column(Text, nullable=False)
    expected_output = Column(Text, nullable=False)
    explanation = Column(Text)
    
    is_sample = Column(Boolean, default=False)  # Visible to users
    is_hidden = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    weight = Column(Integer, default=1)  # For partial scoring
    
    # Relationships
    problem = relationship("Problem", back_populates="test_cases")


class ProblemHint(Base):
    """Hints for problems."""
    __tablename__ = "problem_hints"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    problem_id = Column(UUID(as_uuid=True), ForeignKey("problems.id"))
    
    content = Column(Text, nullable=False)
    order = Column(Integer, default=0)
    unlock_cost = Column(Integer, default=0)  # Points to unlock
    
    # Relationships
    problem = relationship("Problem", back_populates="hints")


class ProblemSolution(Base):
    """Community and official solutions."""
    __tablename__ = "problem_solutions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    problem_id = Column(UUID(as_uuid=True), ForeignKey("problems.id"))
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)  # Markdown with code blocks
    language = Column(String(50))
    time_complexity = Column(String(50))
    space_complexity = Column(String(50))
    
    is_official = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=False)
    
    votes = Column(Integer, default=0)
    views = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    problem = relationship("Problem", back_populates="solutions")


class SubmissionStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    ACCEPTED = "accepted"
    WRONG_ANSWER = "wrong_answer"
    TIME_LIMIT = "time_limit"
    MEMORY_LIMIT = "memory_limit"
    RUNTIME_ERROR = "runtime_error"
    COMPILE_ERROR = "compile_error"
    INTERNAL_ERROR = "internal_error"


class Submission(Base):
    """Code submission for a problem."""
    __tablename__ = "submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    problem_id = Column(UUID(as_uuid=True), ForeignKey("problems.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    # Code
    language = Column(String(50), nullable=False)
    code = Column(Text, nullable=False)
    
    # Results
    status = Column(SQLEnum(SubmissionStatus), default=SubmissionStatus.PENDING)
    runtime_ms = Column(Integer)
    memory_kb = Column(Integer)
    
    # Test Results
    test_cases_passed = Column(Integer, default=0)
    test_cases_total = Column(Integer, default=0)
    
    # Error Info
    error_message = Column(Text)
    failed_test_case = Column(Integer)
    
    # Scores
    score = Column(Integer, default=0)
    
    # Metadata
    is_submission = Column(Boolean, default=True)  # False for "Run"
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    problem = relationship("Problem", back_populates="submissions")
    test_results = relationship("SubmissionTestResult", back_populates="submission")


class TestResultStatus(str, enum.Enum):
    PASSED = "passed"
    FAILED = "failed"
    ERROR = "error"
    TIMEOUT = "timeout"
    SKIPPED = "skipped"


class SubmissionTestResult(Base):
    """Individual test case results for a submission."""
    __tablename__ = "submission_test_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    submission_id = Column(UUID(as_uuid=True), ForeignKey("submissions.id"))
    
    test_case_number = Column(Integer, nullable=False)
    status = Column(SQLEnum(TestResultStatus))
    
    input_data = Column(Text)  # Only for sample tests
    expected_output = Column(Text)  # Only for sample tests
    actual_output = Column(Text)
    
    runtime_ms = Column(Integer)
    memory_kb = Column(Integer)
    stderr = Column(Text)
    
    # Relationships
    submission = relationship("Submission", back_populates="test_results")


class ContestType(str, enum.Enum):
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    SPECIAL = "special"
    COMPANY = "company"


class ContestStatus(str, enum.Enum):
    UPCOMING = "upcoming"
    RUNNING = "running"
    ENDED = "ended"


class Contest(Base):
    """Coding contests."""
    __tablename__ = "contests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    title = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, nullable=False)
    description = Column(Text)
    
    contest_type = Column(SQLEnum(ContestType))
    
    # Timing
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer)
    
    # Rules
    rules = Column(Text)
    prizes = Column(JSON, default=list)
    
    # Problems
    problems = Column(JSON, default=list)  # List of problem IDs with points
    
    # Status
    status = Column(SQLEnum(ContestStatus), default=ContestStatus.UPCOMING)
    is_rated = Column(Boolean, default=True)
    is_public = Column(Boolean, default=True)
    
    # Stats
    registrations_count = Column(Integer, default=0)
    participants_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    registrations = relationship("ContestRegistration", back_populates="contest")


class ContestRegistration(Base):
    """Contest registrations."""
    __tablename__ = "contest_registrations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contest_id = Column(UUID(as_uuid=True), ForeignKey("contests.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    # Performance
    rank = Column(Integer)
    score = Column(Integer, default=0)
    finish_time = Column(DateTime)
    
    # Rating change
    old_rating = Column(Integer)
    new_rating = Column(Integer)
    rating_change = Column(Integer)
    
    registered_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    contest = relationship("Contest", back_populates="registrations")


class UserProgress(Base):
    """User's overall coding progress."""
    __tablename__ = "user_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    
    # Problems solved
    easy_solved = Column(Integer, default=0)
    medium_solved = Column(Integer, default=0)
    hard_solved = Column(Integer, default=0)
    total_solved = Column(Integer, default=0)
    
    # Submissions
    total_submissions = Column(Integer, default=0)
    accepted_submissions = Column(Integer, default=0)
    
    # Streaks
    current_streak = Column(Integer, default=0)
    max_streak = Column(Integer, default=0)
    last_submission_date = Column(DateTime)
    
    # Rating
    rating = Column(Integer, default=1500)
    max_rating = Column(Integer, default=1500)
    
    # Badges earned
    badges = Column(JSON, default=list)
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

