"""
IDE/Workspace Models for FastAPI
Migrated from Django v_ide
"""

from sqlalchemy import (
    Column, String, Text, Boolean, Integer, BigInteger, DateTime, 
    ForeignKey, JSON, Enum as SQLEnum, LargeBinary
)
from app.db.types import GUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.db.base import Base


class ProjectType(str, enum.Enum):
    WEB = "web"
    MOBILE = "mobile"
    BACKEND = "backend"
    FULLSTACK = "fullstack"
    LIBRARY = "library"
    SCRIPT = "script"
    DATA_SCIENCE = "data_science"
    MACHINE_LEARNING = "machine_learning"
    GAME = "game"
    OTHER = "other"


class Framework(str, enum.Enum):
    # Web Frontend
    REACT = "react"
    VUE = "vue"
    ANGULAR = "angular"
    NEXTJS = "nextjs"
    NUXTJS = "nuxtjs"
    SVELTE = "svelte"
    VANILLA_JS = "vanilla_js"
    # Mobile
    REACT_NATIVE = "react_native"
    FLUTTER = "flutter"
    IONIC = "ionic"
    SWIFT = "swift"
    KOTLIN = "kotlin"
    # Backend
    DJANGO = "django"
    FASTAPI = "fastapi"
    FLASK = "flask"
    EXPRESS = "express"
    NESTJS = "nestjs"
    SPRING = "spring"
    DOTNET = "dotnet"
    RAILS = "rails"
    GO = "go"
    RUST = "rust"
    # Other
    JUPYTER = "jupyter"
    NONE = "none"


class Visibility(str, enum.Enum):
    PRIVATE = "private"
    TEAM = "team"
    PUBLIC = "public"


class Project(Base):
    """Code project that can contain multiple files and folders."""
    __tablename__ = "projects"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    
    name = Column(String(255), nullable=False)
    description = Column(Text)
    owner_id = Column(GUID(), ForeignKey("users.id"))
    
    project_type = Column(SQLEnum(ProjectType), default=ProjectType.WEB)
    framework = Column(SQLEnum(Framework), default=Framework.NONE)
    visibility = Column(SQLEnum(Visibility), default=Visibility.PRIVATE)
    
    # Git integration
    git_url = Column(String(500))
    git_branch = Column(String(100), default="main")
    git_connected = Column(Boolean, default=False)
    
    # Workspace settings
    default_language = Column(String(50), default="javascript")
    entry_file = Column(String(500), default="index.js")
    build_command = Column(String(500))
    run_command = Column(String(500))
    
    # Container settings
    docker_image = Column(String(255))
    environment_variables = Column(JSON, default=dict)
    ports = Column(JSON, default=list)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_opened_at = Column(DateTime)
    
    # Statistics
    total_files = Column(Integer, default=0)
    total_size_bytes = Column(BigInteger, default=0)
    
    # Relationships
    folders = relationship("ProjectFolder", back_populates="project")
    files = relationship("ProjectFile", back_populates="project")
    collaborators = relationship("ProjectCollaborator", back_populates="project")
    executions = relationship("CodeExecution", back_populates="project")


class ProjectFolder(Base):
    """Folder structure within a project."""
    __tablename__ = "project_folders"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    project_id = Column(GUID(), ForeignKey("projects.id"))
    parent_id = Column(GUID(), ForeignKey("project_folders.id"))
    
    name = Column(String(255), nullable=False)
    path = Column(String(1000), nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="folders")
    subfolders = relationship("ProjectFolder", backref="parent", remote_side=[id])
    files = relationship("ProjectFile", back_populates="folder")


class FileType(str, enum.Enum):
    CODE = "code"
    CONFIG = "config"
    DATA = "data"
    ASSET = "asset"
    DOCUMENT = "document"
    OTHER = "other"


class ProjectFile(Base):
    """Individual file within a project."""
    __tablename__ = "project_files"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    project_id = Column(GUID(), ForeignKey("projects.id"))
    folder_id = Column(GUID(), ForeignKey("project_folders.id"))
    
    name = Column(String(255), nullable=False)
    path = Column(String(1000), nullable=False)
    extension = Column(String(50))
    language = Column(String(50))
    file_type = Column(SQLEnum(FileType), default=FileType.CODE)
    
    # Content
    content = Column(Text)
    content_binary = Column(LargeBinary)
    is_binary = Column(Boolean, default=False)
    size_bytes = Column(Integer, default=0)
    
    # Metadata
    encoding = Column(String(50), default="utf-8")
    line_count = Column(Integer, default=0)
    
    # Version control
    version = Column(Integer, default=1)
    checksum = Column(String(64))
    
    # Collaboration
    locked_by_id = Column(GUID(), ForeignKey("users.id"))
    locked_at = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_edited_by_id = Column(GUID(), ForeignKey("users.id"))
    
    # Relationships
    project = relationship("Project", back_populates="files")
    folder = relationship("ProjectFolder", back_populates="files")
    versions = relationship("FileVersion", back_populates="file")


class FileVersion(Base):
    """File version history."""
    __tablename__ = "file_versions"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    file_id = Column(GUID(), ForeignKey("project_files.id"))
    
    version = Column(Integer, nullable=False)
    content = Column(Text)
    checksum = Column(String(64))
    
    created_by_id = Column(GUID(), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    file = relationship("ProjectFile", back_populates="versions")


class CollaboratorRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    EDITOR = "editor"
    VIEWER = "viewer"


class ProjectCollaborator(Base):
    """Collaborators on a project."""
    __tablename__ = "project_collaborators"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    project_id = Column(GUID(), ForeignKey("projects.id"))
    user_id = Column(GUID(), ForeignKey("users.id"))
    
    role = Column(SQLEnum(CollaboratorRole), default=CollaboratorRole.VIEWER)
    
    # Permissions
    can_edit = Column(Boolean, default=False)
    can_execute = Column(Boolean, default=True)
    can_manage_files = Column(Boolean, default=False)
    can_invite = Column(Boolean, default=False)
    
    # Activity tracking
    last_active_at = Column(DateTime)
    cursor_position = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="collaborators")


class ExecutionStatus(str, enum.Enum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    ERROR = "error"
    TIMEOUT = "timeout"
    CANCELLED = "cancelled"


class CodeExecution(Base):
    """Code execution records."""
    __tablename__ = "code_executions"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    project_id = Column(GUID(), ForeignKey("projects.id"))
    user_id = Column(GUID(), ForeignKey("users.id"))
    
    # Code
    language = Column(String(50), nullable=False)
    code = Column(Text, nullable=False)
    
    # Configuration
    entry_file = Column(String(500))
    input_data = Column(Text)
    
    # Results
    status = Column(SQLEnum(ExecutionStatus), default=ExecutionStatus.QUEUED)
    stdout = Column(Text)
    stderr = Column(Text)
    exit_code = Column(Integer)
    
    # Performance
    runtime_ms = Column(Integer)
    memory_kb = Column(Integer)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    
    # Relationships
    project = relationship("Project", back_populates="executions")


class Workspace(Base):
    """User workspace configuration."""
    __tablename__ = "workspaces"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id"), unique=True)
    
    # Settings
    theme = Column(String(50), default="dark")
    font_size = Column(Integer, default=14)
    font_family = Column(String(100), default="Fira Code")
    tab_size = Column(Integer, default=4)
    
    # Editor preferences
    auto_save = Column(Boolean, default=True)
    word_wrap = Column(Boolean, default=True)
    line_numbers = Column(Boolean, default=True)
    minimap = Column(Boolean, default=True)
    
    # Keybindings
    keybindings = Column(String(50), default="default")  # default, vim, emacs
    
    # Custom settings
    custom_settings = Column(JSON, default=dict)
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DebugSession(Base):
    """Debug session for IDE."""
    __tablename__ = "debug_sessions"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    project_id = Column(GUID(), ForeignKey("projects.id"))
    user_id = Column(GUID(), ForeignKey("users.id"))
    
    # Session info
    language = Column(String(50))
    entry_file = Column(String(500))
    
    # Breakpoints
    breakpoints = Column(JSON, default=list)
    
    # State
    is_active = Column(Boolean, default=True)
    current_file = Column(String(500))
    current_line = Column(Integer)
    
    # Variables
    variables = Column(JSON, default=dict)
    call_stack = Column(JSON, default=list)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

