"""
Quiz and Assessment models.
"""

from datetime import datetime
from typing import Optional
import uuid
import enum

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum,
    Text, JSON, ForeignKey, Integer, Float
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class QuestionType(str, enum.Enum):
    SINGLE_CHOICE = "single_choice"
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"
    LONG_ANSWER = "long_answer"
    CODE = "code"
    FILL_BLANK = "fill_blank"
    MATCHING = "matching"
    ORDERING = "ordering"


class Quiz(Base, UUIDMixin, TimestampMixin):
    """Quiz model."""
    
    __tablename__ = "quizzes"
    
    # References
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id"), nullable=True)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=True)
    
    # Basic Info
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    
    # Settings
    time_limit_minutes = Column(Integer, nullable=True)
    passing_score = Column(Float, default=70)  # Percentage
    max_attempts = Column(Integer, default=3)
    shuffle_questions = Column(Boolean, default=True)
    shuffle_options = Column(Boolean, default=True)
    show_correct_answers = Column(Boolean, default=True)
    
    # Status
    is_published = Column(Boolean, default=True)
    is_required = Column(Boolean, default=False)  # Required to complete course
    
    # Stats
    total_questions = Column(Integer, default=0)
    total_points = Column(Integer, default=0)
    
    # Relationships
    questions = relationship("Question", back_populates="quiz", order_by="Question.order")
    attempts = relationship("QuizAttempt", back_populates="quiz")


class Question(Base, UUIDMixin, TimestampMixin):
    """Quiz question model."""
    
    __tablename__ = "questions"
    
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quizzes.id"), nullable=False)
    
    # Question
    question_text = Column(Text, nullable=False)
    question_html = Column(Text, nullable=True)
    question_type = Column(Enum(QuestionType), default=QuestionType.SINGLE_CHOICE)
    order = Column(Integer, default=0)
    
    # Media
    image_url = Column(String(500), nullable=True)
    code_snippet = Column(Text, nullable=True)
    code_language = Column(String(50), nullable=True)
    
    # For code questions
    test_cases = Column(JSON, default=list)  # [{input, expected_output}]
    
    # Scoring
    points = Column(Integer, default=1)
    
    # Explanation
    explanation = Column(Text, nullable=True)
    
    # Status
    is_required = Column(Boolean, default=False)
    
    # Relationships
    quiz = relationship("Quiz", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", order_by="QuestionOption.order")


class QuestionOption(Base, UUIDMixin):
    """Question option for multiple choice."""
    
    __tablename__ = "question_options"
    
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id"), nullable=False)
    
    text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    
    # For matching questions
    match_with = Column(String(200), nullable=True)
    
    # Relationships
    question = relationship("Question", back_populates="options")


class QuizAttempt(Base, UUIDMixin, TimestampMixin):
    """User's quiz attempt."""
    
    __tablename__ = "quiz_attempts"
    
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quizzes.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Results
    score = Column(Float, default=0)
    percentage = Column(Float, default=0)
    passed = Column(Boolean, default=False)
    
    # Questions
    total_questions = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    wrong_answers = Column(Integer, default=0)
    skipped_answers = Column(Integer, default=0)
    
    # Time
    time_taken_seconds = Column(Integer, default=0)
    
    # Answers
    answers = Column(JSON, default=dict)  # {question_id: {answer, is_correct}}
    
    # Status
    is_completed = Column(Boolean, default=False)
    
    # Timestamps
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    quiz = relationship("Quiz", back_populates="attempts")
    user = relationship("User", backref="quiz_attempts")

