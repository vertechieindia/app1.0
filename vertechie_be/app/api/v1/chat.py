"""
Chat and Messaging routes.
"""

from typing import Any, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_

from app.db import get_db
from app.models.chat import Conversation, ChatMember, Message, ConversationType, MessageType
from app.models.user import User
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.get("/conversations", response_model=List[dict])
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """List user's conversations."""
    # Get conversation IDs where user is a member
    member_query = select(ChatMember.conversation_id).where(
        ChatMember.user_id == current_user.id
    )
    member_result = await db.execute(member_query)
    conversation_ids = [row[0] for row in member_result.fetchall()]
    
    if not conversation_ids:
        return []
    
    # Get conversations
    query = select(Conversation).where(Conversation.id.in_(conversation_ids))
    query = query.order_by(Conversation.last_message_at.desc().nullslast())
    
    result = await db.execute(query)
    conversations = result.scalars().all()
    
    enriched = []
    for conv in conversations:
        # Get members
        members_query = select(ChatMember).where(ChatMember.conversation_id == conv.id)
        members_result = await db.execute(members_query)
        members = members_result.scalars().all()
        
        # Get unread count for current user
        current_member = next((m for m in members if str(m.user_id) == str(current_user.id)), None)
        unread_count = current_member.unread_count if current_member else 0
        
        enriched.append({
            "id": str(conv.id),
            "type": conv.conversation_type.value,
            "name": conv.name,
            "avatar_url": conv.avatar_url,
            "member_count": conv.member_count,
            "last_message_at": conv.last_message_at.isoformat() if conv.last_message_at else None,
            "last_message_preview": conv.last_message_preview,
            "unread_count": unread_count,
        })
    
    return enriched


@router.post("/conversations", status_code=status.HTTP_201_CREATED)
async def create_conversation(
    conversation_in: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Create a new conversation."""
    conversation_type = conversation_in.get("type", "direct")
    member_ids = conversation_in.get("member_ids", [])
    
    # For direct messages, check if conversation already exists
    if conversation_type == "direct" and len(member_ids) == 1:
        other_user_id = member_ids[0]
        
        # Find existing DM
        my_convs = select(ChatMember.conversation_id).where(
            ChatMember.user_id == current_user.id
        )
        other_convs = select(ChatMember.conversation_id).where(
            ChatMember.user_id == other_user_id
        )
        
        existing_query = select(Conversation).where(
            and_(
                Conversation.id.in_(my_convs),
                Conversation.id.in_(other_convs),
                Conversation.conversation_type == ConversationType.DIRECT
            )
        )
        existing_result = await db.execute(existing_query)
        existing = existing_result.scalar_one_or_none()
        
        if existing:
            return {"id": str(existing.id), "message": "Conversation already exists"}
    
    # Create conversation
    conversation = Conversation(
        conversation_type=ConversationType(conversation_type),
        name=conversation_in.get("name"),
        description=conversation_in.get("description"),
        created_by_id=current_user.id,
        member_count=len(member_ids) + 1,
    )
    db.add(conversation)
    await db.flush()
    
    # Add creator as member
    creator_member = ChatMember(
        conversation_id=conversation.id,
        user_id=current_user.id,
        role="admin" if conversation_type != "direct" else "member",
    )
    db.add(creator_member)
    
    # Add other members
    for member_id in member_ids:
        member = ChatMember(
            conversation_id=conversation.id,
            user_id=member_id,
            invited_by_id=current_user.id,
        )
        db.add(member)
    
    await db.commit()
    
    return {"id": str(conversation.id), "message": "Conversation created"}


@router.get("/conversations/{conversation_id}/messages", response_model=List[dict])
async def get_messages(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
) -> Any:
    """Get messages in a conversation."""
    # Verify membership
    member_query = select(ChatMember).where(
        and_(
            ChatMember.conversation_id == conversation_id,
            ChatMember.user_id == current_user.id
        )
    )
    member_result = await db.execute(member_query)
    member = member_result.scalar_one_or_none()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this conversation"
        )
    
    # Get messages
    query = select(Message).where(
        and_(
            Message.conversation_id == conversation_id,
            Message.is_deleted == False
        )
    )
    query = query.order_by(Message.created_at.desc())
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    messages = result.scalars().all()
    
    # Mark as read
    member.last_read_at = datetime.utcnow()
    member.unread_count = 0
    await db.commit()
    
    return [
        {
            "id": str(msg.id),
            "sender_id": str(msg.sender_id),
            "type": msg.message_type.value,
            "content": msg.content,
            "media_url": msg.media_url,
            "reactions": msg.reactions,
            "is_edited": msg.is_edited,
            "created_at": msg.created_at.isoformat(),
        }
        for msg in reversed(messages)
    ]


@router.post("/conversations/{conversation_id}/messages", status_code=status.HTTP_201_CREATED)
async def send_message(
    conversation_id: str,
    message_in: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Send a message."""
    # Verify membership
    member_query = select(ChatMember).where(
        and_(
            ChatMember.conversation_id == conversation_id,
            ChatMember.user_id == current_user.id
        )
    )
    member_result = await db.execute(member_query)
    if not member_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this conversation"
        )
    
    # Create message
    message = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        message_type=MessageType(message_in.get("type", "text")),
        content=message_in.get("content"),
        media_url=message_in.get("media_url"),
        poll_data=message_in.get("poll_data"),
        reply_to_id=message_in.get("reply_to_id"),
    )
    db.add(message)
    
    # Update conversation
    conv_result = await db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    )
    conversation = conv_result.scalar_one()
    conversation.last_message_at = datetime.utcnow()
    conversation.last_message_preview = message.content[:200] if message.content else "[Media]"
    conversation.message_count += 1
    
    # Increment unread count for other members
    other_members_query = select(ChatMember).where(
        and_(
            ChatMember.conversation_id == conversation_id,
            ChatMember.user_id != current_user.id
        )
    )
    other_members_result = await db.execute(other_members_query)
    for member in other_members_result.scalars():
        member.unread_count += 1
    
    await db.commit()
    await db.refresh(message)
    
    return {
        "id": str(message.id),
        "created_at": message.created_at.isoformat(),
    }


@router.post("/messages/{message_id}/react")
async def react_to_message(
    message_id: str,
    reaction: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Add/remove reaction to message."""
    result = await db.execute(select(Message).where(Message.id == message_id))
    message = result.scalar_one_or_none()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    reactions = message.reactions or {}
    user_id = str(current_user.id)
    
    if reaction in reactions:
        if user_id in reactions[reaction]:
            reactions[reaction].remove(user_id)
            if not reactions[reaction]:
                del reactions[reaction]
        else:
            reactions[reaction].append(user_id)
    else:
        reactions[reaction] = [user_id]
    
    message.reactions = reactions
    await db.commit()
    
    return {"reactions": reactions}

