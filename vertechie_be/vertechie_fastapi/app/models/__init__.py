"""
SQLAlchemy Models for VerTechie.
All models are imported here to ensure they're registered with Base.
Fully migrated from Django backend.
"""

# Auth Models
from app.models.user import (
    User, UserRole, UserProfile, 
    Experience, Education, OTP, BlockedProfileHistory,
    RoleType, AdminRole, EmploymentType
)

# Company Models
from app.models.company import (
    Company, CompanyProfile, CompanyLocation, CompanyBenefit, 
    CompanyPhoto, CompanyTeamMember, CompanyAdmin,
    CompanySize, CompanyStatus, BenefitCategory, PhotoType
)

# School Models
from app.models.school import (
    School, Department, Program, StudentBatch,
    SchoolMember, SchoolAdmin, Placement,
    SchoolType, SchoolStatus, ProgramType, MemberType, AdminRole as SchoolAdminRole
)

# Jobs Models
from app.models.job import Job, JobApplication, SavedJob

# Practice/Coding Models
from app.models.practice import (
    ProblemCategory, Problem, TestCase, ProblemHint, ProblemSolution,
    Submission, SubmissionTestResult, 
    Contest, ContestRegistration, UserProgress,
    Difficulty, ProblemStatus, SubmissionStatus, TestResultStatus,
    ContestType, ContestStatus
)

# Hiring/ATS Models
from app.models.hiring import (
    HiringPipeline, PipelineStage, CandidateInPipeline,
    Assessment, AssessmentQuestion, CandidateAssessment, AssessmentResult,
    Interview, InterviewScorecard, JobOffer,
    StageType, AssessmentType, QuestionType, CandidateAssessmentStatus,
    InterviewType, InterviewStatus, OfferStatus
)

# Blog Models
from app.models.blog import (
    ArticleCategory, ArticleTag, ArticleSeries, Article,
    ArticleComment, ArticleReaction, ArticleBookmark,
    Newsletter, NewsletterSubscriber,
    ArticleStatus, ContentType, ReactionType, NewsletterStatus
)

# IDE Models
from app.models.ide import (
    Project, ProjectFolder, ProjectFile, FileVersion,
    ProjectCollaborator, CodeExecution, Workspace, DebugSession,
    ProjectType, Framework, Visibility, FileType,
    CollaboratorRole, ExecutionStatus
)

# Learn Models (Legacy)
from app.models.course import Course, CourseCategory, CourseEnrollment
from app.models.lesson import Module, Lesson, LessonProgress
from app.models.quiz import Quiz, Question, QuestionOption, QuizAttempt

# Learn Models (New - Enterprise Hierarchy - SQLite Compatible)
from app.models.learn import (
    TutorialCategory, Tutorial, TutorialSection, TutorialLesson,
    ContentBlock, MediaAsset, CodeSnippet, TutorialEnrollment,
    LessonProgress as TutorialLessonProgress,
    DifficultyLevel, ContentStatus, LessonType, BlockType, MediaType
)

# Calendar Models
from app.models.calendar import (
    CalendarConnection, AvailabilitySchedule, 
    MeetingType, Booking, SchedulingLink
)

# Chat Models
from app.models.chat import Conversation, Message, ChatMember

# Network Models
from app.models.network import Connection, ConnectionRequest

# Community Models
from app.models.community import Group, GroupMember, Post, Comment

__all__ = [
    # Auth
    "User", "UserRole", "UserProfile", 
    "Experience", "Education", "OTP", "BlockedProfileHistory",
    "RoleType", "AdminRole", "EmploymentType",
    
    # Company
    "Company", "CompanyProfile", "CompanyLocation", "CompanyBenefit",
    "CompanyPhoto", "CompanyTeamMember", "CompanyAdmin",
    "CompanySize", "CompanyStatus", "BenefitCategory", "PhotoType",
    
    # School
    "School", "Department", "Program", "StudentBatch",
    "SchoolMember", "SchoolAdmin", "Placement",
    "SchoolType", "SchoolStatus", "ProgramType", "MemberType", "SchoolAdminRole",
    
    # Jobs
    "Job", "JobApplication", "SavedJob",
    
    # Practice
    "ProblemCategory", "Problem", "TestCase", "ProblemHint", "ProblemSolution",
    "Submission", "SubmissionTestResult",
    "Contest", "ContestRegistration", "UserProgress",
    "Difficulty", "ProblemStatus", "SubmissionStatus", "TestResultStatus",
    "ContestType", "ContestStatus",
    
    # Hiring/ATS
    "HiringPipeline", "PipelineStage", "CandidateInPipeline",
    "Assessment", "AssessmentQuestion", "CandidateAssessment", "AssessmentResult",
    "Interview", "InterviewScorecard", "JobOffer",
    "StageType", "AssessmentType", "QuestionType", "CandidateAssessmentStatus",
    "InterviewType", "InterviewStatus", "OfferStatus",
    
    # Blog
    "ArticleCategory", "ArticleTag", "ArticleSeries", "Article",
    "ArticleComment", "ArticleReaction", "ArticleBookmark",
    "Newsletter", "NewsletterSubscriber",
    "ArticleStatus", "ContentType", "ReactionType", "NewsletterStatus",
    
    # IDE
    "Project", "ProjectFolder", "ProjectFile", "FileVersion",
    "ProjectCollaborator", "CodeExecution", "Workspace", "DebugSession",
    "ProjectType", "Framework", "Visibility", "FileType",
    "CollaboratorRole", "ExecutionStatus",
    
    # Learn (Legacy)
    "Course", "CourseCategory", "CourseEnrollment",
    "Module", "Lesson", "LessonProgress",
    "Quiz", "Question", "QuestionOption", "QuizAttempt",
    
    # Learn (New - Enterprise)
    "TutorialCategory", "Tutorial", "TutorialSection", "TutorialLesson",
    "ContentBlock", "MediaAsset", "CodeSnippet", "TutorialEnrollment",
    "DifficultyLevel", "ContentStatus", "LessonType", "BlockType", "MediaType",
    
    # Calendar
    "CalendarConnection", "AvailabilitySchedule",
    "MeetingType", "Booking", "SchedulingLink",
    
    # Chat
    "Conversation", "Message", "ChatMember",
    
    # Network
    "Connection", "ConnectionRequest",
    
    # Community
    "Group", "GroupMember", "Post", "Comment",
]
