"""
Quiz and Assessment models.
"""

from datetime import datetime
import enum

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum, 
    Text, JSON, ForeignKey, Integer, Numeric
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class QuizType(str, enum.Enum):
    LESSON_QUIZ = "lesson_quiz"
    MODULE_QUIZ = "module_quiz"
    FINAL_EXAM = "final_exam"
    CERTIFICATION = "certification"
    PRACTICE = "practice"


class QuestionType(str, enum.Enum):
    SINGLE_CHOICE = "single_choice"
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    TEXT_SHORT = "text_short"
    TEXT_LONG = "text_long"
    NUMBER = "number"
    CODE = "code"
    FILL_BLANK = "fill_blank"


class AttemptStatus(str, enum.Enum):
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    GRADED = "graded"
    EXPIRED = "expired"


class Quiz(Base, UUIDMixin, TimestampMixin):
    """Quiz model."""
    
    __tablename__ = "quiz"
    
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lesson.id"), nullable=True)
    course_id = Column(UUID(as_uuid=True), ForeignKey("course.id"), nullable=True)
    
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    quiz_type = Column(Enum(QuizType), default=QuizType.LESSON_QUIZ)
    
    # Settings
    passing_score = Column(Integer, default=70)
    time_limit_minutes = Column(Integer, nullable=True)
    max_attempts = Column(Integer, default=3)
    shuffle_questions = Column(Boolean, default=True)
    shuffle_options = Column(Boolean, default=True)
    show_correct_answers = Column(Boolean, default=True)
    show_score_immediately = Column(Boolean, default=True)
    
    # Question pool
    use_question_pool = Column(Boolean, default=False)
    pool_size = Column(Integer, nullable=True)
    
    # Relationships
    questions = relationship("Question", back_populates="quiz", order_by="Question.order")
    attempts = relationship("QuizAttempt", back_populates="quiz")


class Question(Base, UUIDMixin, TimestampMixin):
    """Question model."""
    
    __tablename__ = "question"
    
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quiz.id"), nullable=False)
    
    question_type = Column(Enum(QuestionType), default=QuestionType.SINGLE_CHOICE)
    question_text = Column(Text, nullable=False)
    question_html = Column(Text, nullable=True)
    
    # Code question
    code_language = Column(String(50), nullable=True)
    starter_code = Column(Text, nullable=True)
    solution_code = Column(Text, nullable=True)
    test_code = Column(Text, nullable=True)
    
    # Media
    image_url = Column(String(500), nullable=True)
    
    # Scoring
    points = Column(Integer, default=1)
    partial_credit = Column(Boolean, default=False)
    
    # Explanation
    explanation = Column(Text, nullable=True)
    
    # Settings
    order = Column(Integer, default=0)
    is_required = Column(Boolean, default=True)
    
    # For text/number answers
    correct_answers = Column(ARRAY(String), default=list)
    correct_number = Column(Numeric(20, 10), nullable=True)
    tolerance = Column(Numeric(10, 5), nullable=True)
    case_sensitive = Column(Boolean, default=False)
    
    # Relationships
    quiz = relationship("Quiz", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", order_by="QuestionOption.order")


class QuestionOption(Base, UUIDMixin, TimestampMixin):
    """Answer options for questions."""
    
    __tablename__ = "questionoption"
    
    question_id = Column(UUID(as_uuid=True), ForeignKey("question.id"), nullable=False)
    
    option_text = Column(Text, nullable=False)
    option_html = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    
    is_correct = Column(Boolean, default=False)
    partial_credit_value = Column(Numeric(5, 2), default=0)
    
    feedback = Column(Text, nullable=True)
    order = Column(Integer, default=0)
    
    # Relationships
    question = relationship("Question", back_populates="options")


class QuizAttempt(Base, UUIDMixin, TimestampMixin):
    """User quiz attempt."""
    
    __tablename__ = "quizattempt"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quiz.id"), nullable=False)
    
    attempt_number = Column(Integer, default=1)
    status = Column(Enum(AttemptStatus), default=AttemptStatus.IN_PROGRESS)
    
    # Questions shown
    questions_shown = Column(ARRAY(String), default=list)
    
    # Scoring
    score = Column(Numeric(5, 2), default=0)
    max_score = Column(Numeric(5, 2), default=0)
    percentage = Column(Numeric(5, 2), default=0)
    passed = Column(Boolean, default=False)
    
    # Timing
    started_at = Column(DateTime, default=datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)
    time_spent_seconds = Column(Integer, default=0)
    
    # Relationships
    quiz = relationship("Quiz", back_populates="attempts")

