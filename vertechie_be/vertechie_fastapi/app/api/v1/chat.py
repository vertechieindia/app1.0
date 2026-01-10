"""
Chat and Messaging API endpoints.
"""

from typing import Any, List, Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.db.session import get_db
from app.models.chat import Conversation, Message, ChatMember, ConversationType, MessageType, MemberRole
from app.models.user import User
from app.schemas.chat import (
    ConversationCreate, ConversationResponse,
    MessageCreate, MessageResponse,
    ChatMemberResponse, MessageReaction, MessageEdit
)
from app.core.security import get_current_user

router = APIRouter()


# ============= Conversations =============

@router.get("/conversations", response_model=List[ConversationResponse])
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """List user's conversations."""
    
    # Get conversations where user is a member
    result = await db.execute(
        select(ChatMember.conversation_id).where(
            ChatMember.user_id == current_user.id,
            ChatMember.is_active == True
        )
    )
    conversation_ids = [r[0] for r in result.all()]
    
    if not conversation_ids:
        return []
    
    result = await db.execute(
        select(Conversation)
        .where(Conversation.id.in_(conversation_ids))
        .order_by(
            # MySQL/MariaDB doesn't support NULLS FIRST
            Conversation.last_message_at.is_(None).desc(),
            Conversation.last_message_at.desc()
        )
    )
    return result.scalars().all()


@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    conv_in: ConversationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create a new conversation."""
    
    # For direct messages, check if conversation already exists
    if conv_in.conversation_type == "direct" and len(conv_in.member_ids) == 1:
        other_user_id = conv_in.member_ids[0]
        
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
                    return conv
    
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
    for user_id in conv_in.member_ids:
        if user_id != current_user.id:
            member = ChatMember(
                conversation_id=conversation.id,
                user_id=user_id,
                role=MemberRole.MEMBER,
            )
            db.add(member)
    
    conversation.member_count = len(conv_in.member_ids) + 1
    
    await db.commit()
    await db.refresh(conversation)
    
    return conversation


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
    
    message = Message(
        conversation_id=conv_id,
        sender_id=current_user.id,
        message_type=MessageType(message_in.message_type),
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
    
    await db.commit()
    await db.refresh(message)
    
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

