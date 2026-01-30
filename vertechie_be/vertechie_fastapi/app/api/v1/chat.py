"""
Chat and Messaging API endpoints.
"""

from typing import Any, List, Optional
from uuid import UUID
from datetime import datetime
import logging
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status, Query, Request, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError

logger = logging.getLogger(__name__)


def _upload_dir() -> Path:
    """Get upload directory for chat files."""
    root = Path(__file__).resolve().parent.parent.parent.parent
    d = root / "uploads" / "chat"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _ext(filename: str) -> str:
    """Get file extension."""
    if "." in filename:
        return "." + filename.rsplit(".", 1)[-1].lower()
    return ".bin"

from app.db.session import get_db
from app.models.chat import Conversation, Message, ChatMember, ConversationType, MessageType, MemberRole
from app.models.user import User
from app.schemas.chat import (
    ConversationCreate, ConversationResponse,
    MessageCreate, MessageResponse,
    ChatMemberResponse, MessageReaction, MessageEdit
)
from app.core.security import get_current_user
from app.api.v1.chat_ws import broadcast_new_message, broadcast_message_edit, broadcast_message_delete

router = APIRouter()


# ============= Conversations =============

@router.get("/conversations", response_model=List[ConversationResponse])
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """List user's conversations."""
    
    # Get conversations with member info (including unread_count)
    result = await db.execute(
        select(Conversation, ChatMember)
        .join(ChatMember, Conversation.id == ChatMember.conversation_id)
        .where(
            ChatMember.user_id == current_user.id,
            ChatMember.is_active == True
        )
        .order_by(
            Conversation.last_message_at.is_(None).desc(),
            Conversation.last_message_at.desc()
        )
    )
    rows = result.all()
    
    if not rows:
        return []
    
    # Build response with unread_count from ChatMember
    conversations_with_unread = []
    for conv, member in rows:
        # Fetch members for this conversation (include basic user info)
        member_rows = await db.execute(
            select(ChatMember, User)
            .join(User, ChatMember.user_id == User.id)
            .where(
                ChatMember.conversation_id == conv.id,
                ChatMember.is_active == True
            )
        )
        members = []
        for cm, u in member_rows:
            members.append({
                "id": u.id,
                "first_name": getattr(u, 'first_name', None),
                "last_name": getattr(u, 'last_name', None),
                "name": (f"{getattr(u, 'first_name', '')} {getattr(u, 'last_name', '')}".strip()) or None,
                "username": getattr(u, 'username', None),
                "email": getattr(u, 'email', None),
                "is_active": cm.is_active,
                "role": cm.role.name if hasattr(cm.role, 'name') else str(cm.role),
                "unread_count": cm.unread_count or 0,
            })

        # Determine display name for direct conversations if name is not set
        conv_type = conv.conversation_type.value if hasattr(conv.conversation_type, 'value') else str(conv.conversation_type)
        display_name = conv.name
        if not display_name and conv_type == 'direct':
            for m in members:
                if m['id'] != current_user.id:
                    display_name = m.get('name') or m.get('username') or m.get('email')
                    break

        conv_dict = {
            "id": conv.id,
            "type": conv_type,
            "conversation_type": conv_type,
            "name": display_name,
            "description": conv.description,
            "avatar_url": conv.avatar_url,
            "message_count": conv.message_count,
            "member_count": conv.member_count,
            "last_message_at": conv.last_message_at,
            "last_message_preview": conv.last_message_preview,
            "unread_count": member.unread_count or 0,
            "created_at": conv.created_at,
            "members": members,
            "is_group": conv_type in ('group', 'channel'),
        }
        conversations_with_unread.append(conv_dict)

    return conversations_with_unread


@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    conv_in: ConversationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create a new conversation."""
    
    # Pydantic validator should have already converted strings to UUIDs
    # But ensure they're UUIDs for database operations
    member_ids = [UUID(str(mid)) if not isinstance(mid, UUID) else mid for mid in conv_in.member_ids]
    
    # For direct messages, check if conversation already exists
    if conv_in.conversation_type == "direct" and len(member_ids) == 1:
        other_user_id = member_ids[0]
        
        # Find existing DM
        result = await db.execute(
            select(ChatMember.conversation_id).where(
                ChatMember.user_id == current_user.id
            )
        )
        my_convs = [r[0] for r in result.all()]
        
        if my_convs:
            result = await db.execute(
                select(ChatMember.conversation_id).where(
                    ChatMember.conversation_id.in_(my_convs),
                    ChatMember.user_id == other_user_id
                )
            )
            existing = result.scalars().first()
            
            if existing:
                result = await db.execute(
                    select(Conversation).where(
                        Conversation.id == existing,
                        Conversation.conversation_type == ConversationType.DIRECT
                    )
                )
                conv = result.scalar_one_or_none()
                if conv:
                    # Get unread_count for current user
                    result = await db.execute(
                        select(ChatMember).where(
                            ChatMember.conversation_id == conv.id,
                            ChatMember.user_id == current_user.id
                        )
                    )
                    member = result.scalar_one_or_none()
                    unread_count = member.unread_count if member else 0
                    
                    # Return ConversationResponse object (Pydantic handles UUID/datetime serialization)
                    return ConversationResponse(
                        id=conv.id,
                        conversation_type=conv.conversation_type.value if hasattr(conv.conversation_type, 'value') else str(conv.conversation_type),
                        name=conv.name,
                        description=conv.description,
                        avatar_url=conv.avatar_url,
                        message_count=conv.message_count,
                        member_count=conv.member_count,
                        last_message_at=conv.last_message_at,
                        last_message_preview=conv.last_message_preview,
                        unread_count=unread_count,
                        created_at=conv.created_at,
                    )
    
    # Create new conversation
    conversation = Conversation(
        conversation_type=ConversationType(conv_in.conversation_type),
        name=conv_in.name,
        description=conv_in.description,
    )
    db.add(conversation)
    await db.flush()
    
    # Add creator as owner
    member = ChatMember(
        conversation_id=conversation.id,
        user_id=current_user.id,
        role=MemberRole.OWNER,
    )
    db.add(member)
    
    # Add other members
    for user_id in member_ids:
        if user_id != current_user.id:
            member = ChatMember(
                conversation_id=conversation.id,
                user_id=user_id,
                role=MemberRole.MEMBER,
            )
            db.add(member)
    
    conversation.member_count = len(member_ids) + 1
    
    await db.commit()
    await db.refresh(conversation)
    
    # Get unread_count for current user (should be 0 for new conversation)
    result = await db.execute(
        select(ChatMember).where(
            ChatMember.conversation_id == conversation.id,
            ChatMember.user_id == current_user.id
        )
    )
    member = result.scalar_one_or_none()
    unread_count = member.unread_count if member else 0
    
    # Return conversation object (Pydantic will serialize it according to ConversationResponse)
    # We need to add unread_count, so we'll create a dict that matches the schema
    await db.refresh(conversation)
    
    # Return ConversationResponse object (Pydantic handles UUID/datetime serialization)
    return ConversationResponse(
        id=conversation.id,
        conversation_type=conversation.conversation_type.value if hasattr(conversation.conversation_type, 'value') else str(conversation.conversation_type),
        name=conversation.name,
        description=conversation.description,
        avatar_url=conversation.avatar_url,
        message_count=conversation.message_count,
        member_count=conversation.member_count,
        last_message_at=conversation.last_message_at,
        last_message_preview=conversation.last_message_preview,
        unread_count=unread_count,
        created_at=conversation.created_at,
    )


# Unread count must be defined before /conversations/{conv_id} so "unread-count" is not matched as conv_id
@router.get("/conversations/unread-count")
async def get_unread_count(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get total unread message count across all conversations."""
    result = await db.execute(
        select(func.coalesce(func.sum(ChatMember.unread_count), 0)).where(
            ChatMember.user_id == current_user.id,
            ChatMember.is_active == True
        )
    )
    total_unread = result.scalar() or 0
    return {"unread_count": total_unread}


@router.get("/conversations/{conv_id}", response_model=ConversationResponse)
async def get_conversation(
    conv_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get conversation details."""
    
    # Verify membership
    result = await db.execute(
        select(ChatMember).where(
            ChatMember.conversation_id == conv_id,
            ChatMember.user_id == current_user.id,
            ChatMember.is_active == True
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this conversation"
        )
    
    result = await db.execute(
        select(Conversation).where(Conversation.id == conv_id)
    )
    conv = result.scalar_one_or_none()
    
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    return conv


# ============= Messages =============

@router.get("/conversations/{conv_id}/messages", response_model=List[MessageResponse])
async def list_messages(
    conv_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
) -> Any:
    """List messages in a conversation."""
    
    # Verify membership
    result = await db.execute(
        select(ChatMember).where(
            ChatMember.conversation_id == conv_id,
            ChatMember.user_id == current_user.id,
            ChatMember.is_active == True
        )
    )
    member = result.scalar_one_or_none()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this conversation"
        )
    
    result = await db.execute(
        select(Message)
        .where(
            Message.conversation_id == conv_id,
            Message.is_deleted == False
        )
        .order_by(Message.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    messages = result.scalars().all()
    
    # Update last read
    member.last_read_at = datetime.utcnow()
    if messages:
        member.last_read_message_id = messages[0].id
    member.unread_count = 0
    
    await db.commit()
    
    return messages


@router.post("/conversations/{conv_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    conv_id: UUID,
    message_in: MessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Send a message."""
    
    # Verify membership
    result = await db.execute(
        select(ChatMember).where(
            ChatMember.conversation_id == conv_id,
            ChatMember.user_id == current_user.id,
            ChatMember.is_active == True
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this conversation"
        )
    
    # Normalize message_type: frontend may send "document", backend uses "file"
    message_type_str = (message_in.message_type or "text").strip().lower()
    if message_type_str == "document":
        message_type_str = "file"
    try:
        message_type = MessageType(message_type_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid message_type: {message_in.message_type}. Allowed: text, image, file, video, audio, gif, poll, link, system"
        )
    
    message = Message(
        conversation_id=conv_id,
        sender_id=current_user.id,
        message_type=message_type,
        content=message_in.content,
        media_url=message_in.media_url,
        media_type=message_in.media_type,
        media_name=message_in.media_name,
        reply_to_id=message_in.reply_to_id,
        poll_data=message_in.poll_data,
        mentions=message_in.mentions,
    )
    
    db.add(message)
    
    # Update conversation
    result = await db.execute(
        select(Conversation).where(Conversation.id == conv_id)
    )
    conv = result.scalar_one()
    conv.message_count += 1
    conv.last_message_at = datetime.utcnow()
    conv.last_message_preview = message_in.content[:200] if message_in.content else f"[{message_in.message_type}]"
    
    # Update unread counts for other members
    result = await db.execute(
        select(ChatMember).where(
            ChatMember.conversation_id == conv_id,
            ChatMember.user_id != current_user.id,
            ChatMember.is_active == True
        )
    )
    members = result.scalars().all()
    for member in members:
        member.unread_count += 1
    
    try:
        await db.commit()
        await db.refresh(message)
    except IntegrityError as e:
        await db.rollback()
        # If DB enum doesn't have LINK yet (migration not run), store link as TEXT so it still works
        if message_type == MessageType.LINK:
            message.message_type = MessageType.TEXT
            db.add(message)
            result = await db.execute(select(Conversation).where(Conversation.id == conv_id))
            conv = result.scalar_one()
            conv.message_count += 1
            conv.last_message_at = datetime.utcnow()
            conv.last_message_preview = (message_in.content or "")[:200]
            result = await db.execute(
                select(ChatMember).where(
                    ChatMember.conversation_id == conv_id,
                    ChatMember.user_id != current_user.id,
                    ChatMember.is_active == True
                )
            )
            for member in result.scalars().all():
                member.unread_count += 1
            try:
                await db.commit()
                await db.refresh(message)
            except Exception:
                logger.exception("Database error saving message")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to save message. Run: alembic upgrade head"
                ) from e
        else:
            logger.exception("Database error saving message")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save message. Run: alembic upgrade head"
            ) from e
    
    # Broadcast via WebSocket
    try:
        await broadcast_new_message(message, conv_id, current_user.id, db)
    except Exception as e:
        logger.error(f"Error broadcasting message via WebSocket: {e}")
        # Don't fail the request if WebSocket broadcast fails
    
    return message


@router.put("/messages/{message_id}", response_model=MessageResponse)
async def edit_message(
    message_id: UUID,
    edit_in: MessageEdit,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Edit a message."""
    
    result = await db.execute(
        select(Message).where(
            Message.id == message_id,
            Message.sender_id == current_user.id
        )
    )
    message = result.scalar_one_or_none()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    if not message.original_content:
        message.original_content = message.content
    
    message.content = edit_in.content
    message.is_edited = True
    message.edited_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(message)
    
    # Broadcast via WebSocket
    try:
        await broadcast_message_edit(message, message.conversation_id)
    except Exception as e:
        logger.error(f"Error broadcasting message edit via WebSocket: {e}")
        # Don't fail the request if WebSocket broadcast fails
    
    return message


@router.delete("/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(
    message_id: UUID,
    for_everyone: bool = Query(False),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Delete a message."""
    
    result = await db.execute(
        select(Message).where(Message.id == message_id)
    )
    message = result.scalar_one_or_none()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    if message.sender_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only delete your own messages"
        )
    
    message.is_deleted = True
    message.deleted_at = datetime.utcnow()
    message.deleted_for_everyone = for_everyone
    
    await db.commit()
    
    # Broadcast via WebSocket
    try:
        await broadcast_message_delete(message.id, message.conversation_id, for_everyone)
    except Exception as e:
        logger.error(f"Error broadcasting message delete via WebSocket: {e}")
        # Don't fail the request if WebSocket broadcast fails


@router.post("/messages/{message_id}/react")
async def add_reaction(
    message_id: UUID,
    reaction_in: MessageReaction,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Add reaction to message."""
    
    result = await db.execute(
        select(Message).where(Message.id == message_id)
    )
    message = result.scalar_one_or_none()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    # Verify membership
    result = await db.execute(
        select(ChatMember).where(
            ChatMember.conversation_id == message.conversation_id,
            ChatMember.user_id == current_user.id,
            ChatMember.is_active == True
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this conversation"
        )
    
    # Update reactions
    reactions = message.reactions or {}
    reaction_type = reaction_in.reaction_type
    user_id_str = str(current_user.id)
    
    if reaction_type not in reactions:
        reactions[reaction_type] = []
    
    if user_id_str in reactions[reaction_type]:
        reactions[reaction_type].remove(user_id_str)
    else:
        reactions[reaction_type].append(user_id_str)
    
    # Clean up empty reactions
    reactions = {k: v for k, v in reactions.items() if v}
    
    message.reactions = reactions
    await db.commit()
    
    return {"reactions": reactions}


# ============= File Upload =============

@router.post("/upload")
async def upload_chat_file(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Upload a file for chat (image, document, etc.). Returns { url, name, size, type }."""
    # Determine file type
    content_type = file.content_type or "application/octet-stream"
    is_image = content_type.startswith("image/")
    is_video = content_type.startswith("video/")
    is_audio = content_type.startswith("audio/")
    
    # Read file content
    content = await file.read()
    file_size = len(content)
    
    # Generate filename
    ext = _ext(file.filename or "file.bin")
    name = f"{uuid4().hex}{ext}"
    dest = _upload_dir() / name
    
    # Write file
    dest.write_bytes(content)
    
    # Generate URL
    base = str(request.base_url).rstrip("/")
    url = f"{base}/uploads/chat/{name}"
    
    return {
        "url": url,
        "name": file.filename or name,
        "size": file_size,
        "type": content_type,
        "media_type": "image" if is_image else "video" if is_video else "audio" if is_audio else "file"
    }


# ============= Mark read (unread-count route is above, before {conv_id}) =============

@router.put("/conversations/{conv_id}/mark-read", status_code=status.HTTP_204_NO_CONTENT)
async def mark_conversation_read(
    conv_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Mark a conversation as read (reset unread count)."""
    
    # Verify membership
    result = await db.execute(
        select(ChatMember).where(
            ChatMember.conversation_id == conv_id,
            ChatMember.user_id == current_user.id,
            ChatMember.is_active == True
        )
    )
    member = result.scalar_one_or_none()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this conversation"
        )
    
    # Update read status
    member.last_read_at = datetime.utcnow()
    
    # Get the latest message ID
    result = await db.execute(
        select(Message.id)
        .where(Message.conversation_id == conv_id)
        .order_by(Message.created_at.desc())
        .limit(1)
    )
    latest_message = result.scalar_one_or_none()
    if latest_message:
        member.last_read_message_id = latest_message[0]
    
    member.unread_count = 0
    
    await db.commit()

