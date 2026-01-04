"""
IDE/Workspace API Routes
Projects, Files, and Execution
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.ide import (
    Project, ProjectFolder, ProjectFile, FileVersion,
    ProjectCollaborator, CodeExecution, Workspace, DebugSession,
    ProjectType, Framework, Visibility, FileType,
    CollaboratorRole, ExecutionStatus
)
from app.models.user import User
from app.core.security import get_current_user, get_current_admin_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/ide", tags=["IDE"])


# ============= Pydantic Schemas =============

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    project_type: ProjectType = ProjectType.WEB
    framework: Framework = Framework.NONE
    visibility: Visibility = Visibility.PRIVATE
    default_language: str = "javascript"
    entry_file: str = "index.js"
    build_command: Optional[str] = None
    run_command: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    visibility: Optional[Visibility] = None
    build_command: Optional[str] = None
    run_command: Optional[str] = None

class ProjectResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    owner_id: UUID
    project_type: ProjectType
    framework: Framework
    visibility: Visibility
    default_language: str
    entry_file: str
    git_connected: bool
    total_files: int
    total_size_bytes: int
    created_at: datetime
    updated_at: datetime
    last_opened_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class FolderCreate(BaseModel):
    name: str
    parent_id: Optional[UUID] = None

class FolderResponse(BaseModel):
    id: UUID
    project_id: UUID
    name: str
    path: str
    parent_id: Optional[UUID] = None
    
    class Config:
        from_attributes = True

class FileCreate(BaseModel):
    name: str
    folder_id: Optional[UUID] = None
    content: str = ""
    language: Optional[str] = None

class FileUpdate(BaseModel):
    content: str

class FileResponse(BaseModel):
    id: UUID
    project_id: UUID
    folder_id: Optional[UUID] = None
    name: str
    path: str
    extension: Optional[str] = None
    language: Optional[str] = None
    file_type: FileType
    size_bytes: int
    line_count: int
    version: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class FileContentResponse(FileResponse):
    content: Optional[str] = None

class CollaboratorAdd(BaseModel):
    user_id: UUID
    role: CollaboratorRole = CollaboratorRole.VIEWER

class CollaboratorResponse(BaseModel):
    id: UUID
    project_id: UUID
    user_id: UUID
    role: CollaboratorRole
    can_edit: bool
    can_execute: bool
    can_manage_files: bool
    can_invite: bool
    last_active_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ExecuteCode(BaseModel):
    language: str
    code: str
    entry_file: Optional[str] = None
    input_data: Optional[str] = None

class ExecutionResponse(BaseModel):
    id: UUID
    project_id: Optional[UUID] = None
    language: str
    status: ExecutionStatus
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    exit_code: Optional[int] = None
    runtime_ms: Optional[int] = None
    memory_kb: Optional[int] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class WorkspaceSettings(BaseModel):
    theme: str = "dark"
    font_size: int = 14
    font_family: str = "Fira Code"
    tab_size: int = 4
    auto_save: bool = True
    word_wrap: bool = True
    line_numbers: bool = True
    minimap: bool = True
    keybindings: str = "default"


# ============= Helper Functions =============

async def verify_project_access(
    project_id: UUID,
    user_id: UUID,
    db: AsyncSession,
    require_edit: bool = False
) -> Project:
    """Verify user has access to project."""
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Owner has full access
    if project.owner_id == user_id:
        return project
    
    # Check collaborator access
    collab_result = await db.execute(
        select(ProjectCollaborator).where(
            ProjectCollaborator.project_id == project_id,
            ProjectCollaborator.user_id == user_id
        )
    )
    collaborator = collab_result.scalar_one_or_none()
    
    if not collaborator:
        if project.visibility == Visibility.PUBLIC:
            if require_edit:
                raise HTTPException(status_code=403, detail="Edit access required")
            return project
        raise HTTPException(status_code=403, detail="Access denied")
    
    if require_edit and not collaborator.can_edit:
        raise HTTPException(status_code=403, detail="Edit access required")
    
    return project


# ============= Projects =============

@router.get("/projects", response_model=List[ProjectResponse])
async def list_my_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List my projects."""
    result = await db.execute(
        select(Project)
        .where(Project.owner_id == current_user.id)
        .order_by(Project.updated_at.desc())
        .offset(skip).limit(limit)
    )
    return result.scalars().all()


@router.get("/projects/shared", response_model=List[ProjectResponse])
async def list_shared_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List projects shared with me."""
    result = await db.execute(
        select(Project)
        .join(ProjectCollaborator)
        .where(ProjectCollaborator.user_id == current_user.id)
        .order_by(Project.updated_at.desc())
        .offset(skip).limit(limit)
    )
    return result.scalars().all()


@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get project details."""
    project = await verify_project_access(project_id, current_user.id, db)
    
    # Mark as opened
    project.last_opened_at = datetime.utcnow()
    await db.commit()
    
    return project


@router.post("/projects", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new project."""
    db_project = Project(owner_id=current_user.id, **project.model_dump())
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    return db_project


@router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    project_update: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a project."""
    project = await verify_project_access(project_id, current_user.id, db, require_edit=True)
    
    update_data = project_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)
    
    await db.commit()
    await db.refresh(project)
    return project


@router.delete("/projects/{project_id}")
async def delete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a project (owner only)."""
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.owner_id == current_user.id
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or not owner")
    
    await db.delete(project)
    await db.commit()
    return {"status": "deleted"}


# ============= Folders =============

@router.get("/projects/{project_id}/folders", response_model=List[FolderResponse])
async def list_folders(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List project folders."""
    await verify_project_access(project_id, current_user.id, db)
    
    result = await db.execute(
        select(ProjectFolder).where(ProjectFolder.project_id == project_id)
    )
    return result.scalars().all()


@router.post("/projects/{project_id}/folders", response_model=FolderResponse)
async def create_folder(
    project_id: UUID,
    folder: FolderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a folder in project."""
    await verify_project_access(project_id, current_user.id, db, require_edit=True)
    
    # Build path
    path = folder.name
    if folder.parent_id:
        parent_result = await db.execute(
            select(ProjectFolder).where(ProjectFolder.id == folder.parent_id)
        )
        parent = parent_result.scalar_one_or_none()
        if parent:
            path = f"{parent.path}/{folder.name}"
    
    db_folder = ProjectFolder(
        project_id=project_id,
        path=path,
        **folder.model_dump()
    )
    db.add(db_folder)
    await db.commit()
    await db.refresh(db_folder)
    return db_folder


# ============= Files =============

@router.get("/projects/{project_id}/files", response_model=List[FileResponse])
async def list_files(
    project_id: UUID,
    folder_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List project files."""
    await verify_project_access(project_id, current_user.id, db)
    
    query = select(ProjectFile).where(ProjectFile.project_id == project_id)
    if folder_id:
        query = query.where(ProjectFile.folder_id == folder_id)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/files/{file_id}", response_model=FileContentResponse)
async def get_file(
    file_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get file with content."""
    result = await db.execute(
        select(ProjectFile).where(ProjectFile.id == file_id)
    )
    file = result.scalar_one_or_none()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    await verify_project_access(file.project_id, current_user.id, db)
    
    return file


@router.post("/projects/{project_id}/files", response_model=FileResponse)
async def create_file(
    project_id: UUID,
    file: FileCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a file in project."""
    project = await verify_project_access(project_id, current_user.id, db, require_edit=True)
    
    # Build path
    path = file.name
    if file.folder_id:
        folder_result = await db.execute(
            select(ProjectFolder).where(ProjectFolder.id == file.folder_id)
        )
        folder = folder_result.scalar_one_or_none()
        if folder:
            path = f"{folder.path}/{file.name}"
    
    # Detect language from extension
    extension = file.name.rsplit('.', 1)[-1] if '.' in file.name else ''
    
    db_file = ProjectFile(
        project_id=project_id,
        path=path,
        extension=extension,
        size_bytes=len(file.content.encode('utf-8')),
        line_count=file.content.count('\n') + 1,
        last_edited_by_id=current_user.id,
        **file.model_dump()
    )
    db.add(db_file)
    
    # Update project stats
    project.total_files += 1
    project.total_size_bytes += db_file.size_bytes
    
    await db.commit()
    await db.refresh(db_file)
    return db_file


@router.put("/files/{file_id}", response_model=FileResponse)
async def update_file(
    file_id: UUID,
    file_update: FileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update file content."""
    result = await db.execute(
        select(ProjectFile).where(ProjectFile.id == file_id)
    )
    file = result.scalar_one_or_none()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    project = await verify_project_access(file.project_id, current_user.id, db, require_edit=True)
    
    # Save version
    version = FileVersion(
        file_id=file.id,
        version=file.version,
        content=file.content,
        checksum=file.checksum,
        created_by_id=current_user.id
    )
    db.add(version)
    
    # Update file
    old_size = file.size_bytes
    file.content = file_update.content
    file.size_bytes = len(file_update.content.encode('utf-8'))
    file.line_count = file_update.content.count('\n') + 1
    file.version += 1
    file.last_edited_by_id = current_user.id
    
    # Update project size
    project.total_size_bytes += (file.size_bytes - old_size)
    
    await db.commit()
    await db.refresh(file)
    return file


@router.delete("/files/{file_id}")
async def delete_file(
    file_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a file."""
    result = await db.execute(
        select(ProjectFile).where(ProjectFile.id == file_id)
    )
    file = result.scalar_one_or_none()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    project = await verify_project_access(file.project_id, current_user.id, db, require_edit=True)
    
    # Update project stats
    project.total_files -= 1
    project.total_size_bytes -= file.size_bytes
    
    await db.delete(file)
    await db.commit()
    return {"status": "deleted"}


# ============= Collaborators =============

@router.get("/projects/{project_id}/collaborators", response_model=List[CollaboratorResponse])
async def list_collaborators(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List project collaborators."""
    await verify_project_access(project_id, current_user.id, db)
    
    result = await db.execute(
        select(ProjectCollaborator).where(ProjectCollaborator.project_id == project_id)
    )
    return result.scalars().all()


@router.post("/projects/{project_id}/collaborators", response_model=CollaboratorResponse)
async def add_collaborator(
    project_id: UUID,
    collaborator: CollaboratorAdd,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a collaborator to project."""
    # Verify owner
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.owner_id == current_user.id
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=403, detail="Only owner can add collaborators")
    
    # Check if already added
    existing = await db.execute(
        select(ProjectCollaborator).where(
            ProjectCollaborator.project_id == project_id,
            ProjectCollaborator.user_id == collaborator.user_id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already a collaborator")
    
    db_collab = ProjectCollaborator(
        project_id=project_id,
        **collaborator.model_dump()
    )
    db.add(db_collab)
    await db.commit()
    await db.refresh(db_collab)
    return db_collab


# ============= Code Execution =============

@router.post("/execute", response_model=ExecutionResponse)
async def execute_code(
    execution: ExecuteCode,
    project_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Execute code."""
    db_execution = CodeExecution(
        project_id=project_id,
        user_id=current_user.id,
        status=ExecutionStatus.QUEUED,
        **execution.model_dump()
    )
    db.add(db_execution)
    await db.commit()
    await db.refresh(db_execution)
    
    # TODO: Queue for execution
    # For now, return queued status
    
    return db_execution


@router.get("/executions/{execution_id}", response_model=ExecutionResponse)
async def get_execution(
    execution_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get execution status and result."""
    result = await db.execute(
        select(CodeExecution).where(
            CodeExecution.id == execution_id,
            CodeExecution.user_id == current_user.id
        )
    )
    execution = result.scalar_one_or_none()
    
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    return execution


# ============= Workspace Settings =============

@router.get("/workspace", response_model=WorkspaceSettings)
async def get_workspace_settings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get my workspace settings."""
    result = await db.execute(
        select(Workspace).where(Workspace.user_id == current_user.id)
    )
    workspace = result.scalar_one_or_none()
    
    if not workspace:
        # Return defaults
        return WorkspaceSettings()
    
    return WorkspaceSettings(
        theme=workspace.theme,
        font_size=workspace.font_size,
        font_family=workspace.font_family,
        tab_size=workspace.tab_size,
        auto_save=workspace.auto_save,
        word_wrap=workspace.word_wrap,
        line_numbers=workspace.line_numbers,
        minimap=workspace.minimap,
        keybindings=workspace.keybindings
    )


@router.put("/workspace", response_model=WorkspaceSettings)
async def update_workspace_settings(
    settings: WorkspaceSettings,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update my workspace settings."""
    result = await db.execute(
        select(Workspace).where(Workspace.user_id == current_user.id)
    )
    workspace = result.scalar_one_or_none()
    
    if not workspace:
        workspace = Workspace(user_id=current_user.id)
        db.add(workspace)
    
    for key, value in settings.model_dump().items():
        setattr(workspace, key, value)
    
    await db.commit()
    await db.refresh(workspace)
    
    return settings

