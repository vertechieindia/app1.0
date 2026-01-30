"""
WebSocket endpoints for real-time chat messaging.
"""

import json
import logging
from typing import Dict, Set
from uuid import UUID

from fastapi import WebSocket, WebSocketDisconnect, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.chat import Conversation, Message, ChatMember
from app.models.user import User
from app.core.security import get_current_user_from_token

logger = logging.getLogger(__name__)

# Store active WebSocket connections per conversation
# Format: {conversation_id: {user_id: websocket}}
active_connections: Dict[UUID, Dict[UUID, WebSocket]] = {}


class ConnectionManager:
    """Manages WebSocket connections for chat."""
    
    def __init__(self):
        self.active_connections: Dict[UUID, Dict[UUID, WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, conversation_id: UUID, user_id: UUID):
        """Connect a user to a conversation."""
        await websocket.accept()
        
        if conversation_id not in self.active_connections:
            self.active_connections[conversation_id] = {}
        
        self.active_connections[conversation_id][user_id] = websocket
        logger.info(f"User {user_id} connected to conversation {conversation_id}")
    
    def disconnect(self, conversation_id: UUID, user_id: UUID):
        """Disconnect a user from a conversation."""
        if conversation_id in self.active_connections:
            if user_id in self.active_connections[conversation_id]:
                del self.active_connections[conversation_id][user_id]
                logger.info(f"User {user_id} disconnected from conversation {conversation_id}")
            
            # Clean up empty conversation entries
            if not self.active_connections[conversation_id]:
                del self.active_connections[conversation_id]
    
    async def send_personal_message(self, message: dict, conversation_id: UUID, user_id: UUID):
        """Send a message to a specific user in a conversation."""
        if conversation_id in self.active_connections:
            if user_id in self.active_connections[conversation_id]:
                websocket = self.active_connections[conversation_id][user_id]
                try:
                    await websocket.send_json(message)
                except Exception as e:
                    logger.error(f"Error sending message to user {user_id}: {e}")
                    self.disconnect(conversation_id, user_id)
    
    async def broadcast_to_conversation(self, message: dict, conversation_id: UUID, exclude_user_id: UUID = None):
        """Broadcast a message to all users in a conversation."""
        if conversation_id not in self.active_connections:
            return
        
        disconnected_users = []
        for user_id, websocket in self.active_connections[conversation_id].items():
            if exclude_user_id and user_id == exclude_user_id:
                continue
            
            try:
                await websocket.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to user {user_id}: {e}")
                disconnected_users.append(user_id)
        
        # Clean up disconnected users
        for user_id in disconnected_users:
            self.disconnect(conversation_id, user_id)


manager = ConnectionManager()


async def get_current_user_from_websocket(
    websocket: WebSocket,
    token: str = Query(...)
):
    """Authenticate user from WebSocket token."""
    try:
        user = await get_current_user_from_token(token)
        return user
    except Exception as e:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )


async def verify_conversation_membership(
    conversation_id: UUID,
    user_id: UUID,
    db: AsyncSession
) -> bool:
    """Verify that user is a member of the conversation."""
    result = await db.execute(
        select(ChatMember).where(
            ChatMember.conversation_id == conversation_id,
            ChatMember.user_id == user_id,
            ChatMember.is_active == True
        )
    )
    return result.scalar_one_or_none() is not None


async def websocket_endpoint(
    websocket: WebSocket,
    conversation_id: UUID,
    token: str = Query(...)
):
    """WebSocket endpoint for real-time chat."""
    
    # Authenticate user
    try:
        current_user = await get_current_user_from_websocket(websocket, token)
    except Exception:
        return  # Connection already closed
    
    # Verify conversation membership (create a new session for this check)
    from app.db.session import AsyncSessionLocal
    async with AsyncSessionLocal() as db:
        is_member = await verify_conversation_membership(conversation_id, current_user.id, db)
        if not is_member:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Not a member of this conversation")
            return
    
    # Connect user
    await manager.connect(websocket, conversation_id, current_user.id)
    
    try:
        # Send connection confirmation
        await websocket.send_json({
            "type": "connected",
            "conversation_id": str(conversation_id),
            "user_id": str(current_user.id),
            "message": "Connected to conversation"
        })
        
        # Listen for messages
        while True:
            data = await websocket.receive_json()
            message_type = data.get("type")
            
            if message_type == "ping":
                # Heartbeat
                await websocket.send_json({"type": "pong"})
            
            elif message_type == "typing_start":
                # Broadcast typing indicator
                await manager.broadcast_to_conversation({
                    "type": "typing",
                    "user_id": str(current_user.id),
                    "user_name": f"{current_user.first_name} {current_user.last_name}".strip() or current_user.email,
                    "conversation_id": str(conversation_id),
                    "is_typing": True
                }, conversation_id, exclude_user_id=current_user.id)
            
            elif message_type == "typing_stop":
                # Broadcast typing stop
                await manager.broadcast_to_conversation({
                    "type": "typing",
                    "user_id": str(current_user.id),
                    "conversation_id": str(conversation_id),
                    "is_typing": False
                }, conversation_id, exclude_user_id=current_user.id)
            
            elif message_type == "message":
                # Handle message (should be sent via REST API, but acknowledge via WebSocket)
                # This is mainly for real-time delivery confirmation
                message_id = data.get("message_id")
                if message_id:
                    await manager.broadcast_to_conversation({
                        "type": "message_received",
                        "message_id": message_id,
                        "conversation_id": str(conversation_id),
                        "sender_id": str(current_user.id)
                    }, conversation_id, exclude_user_id=current_user.id)
            
            else:
                logger.warning(f"Unknown message type: {message_type}")
    
    except WebSocketDisconnect:
        manager.disconnect(conversation_id, current_user.id)
        logger.info(f"User {current_user.id} disconnected from conversation {conversation_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}", exc_info=True)
        manager.disconnect(conversation_id, current_user.id)


async def broadcast_new_message(message: Message, conversation_id: UUID, sender_id: UUID, db: AsyncSession):
    """Broadcast a new message to all connected users in the conversation."""
    # Get all members of the conversation
    result = await db.execute(
        select(ChatMember).where(
            ChatMember.conversation_id == conversation_id,
            ChatMember.is_active == True
        )
    )
    members = result.scalars().all()
    
    # Prepare message data
    message_data = {
        "type": "new_message",
        "message": {
            "id": str(message.id),
            "conversation_id": str(message.conversation_id),
            "sender_id": str(message.sender_id),
            "content": message.content,
            "message_type": message.message_type.value if hasattr(message.message_type, 'value') else str(message.message_type),
            "media_url": message.media_url,
            "media_type": message.media_type,
            "media_name": message.media_name,
            "poll_data": message.poll_data,
            "reply_to_id": str(message.reply_to_id) if message.reply_to_id else None,
            "reactions": message.reactions or {},
            "is_edited": message.is_edited,
            "created_at": message.created_at.isoformat() if message.created_at else None,
        },
        "conversation_id": str(conversation_id)
    }
    
    # Broadcast to all connected users (including sender for confirmation)
    await manager.broadcast_to_conversation(message_data, conversation_id)


async def broadcast_message_edit(message: Message, conversation_id: UUID):
    """Broadcast a message edit to all connected users."""
    message_data = {
        "type": "message_edited",
        "message": {
            "id": str(message.id),
            "content": message.content,
            "is_edited": message.is_edited,
            "edited_at": message.edited_at.isoformat() if message.edited_at else None,
        },
        "conversation_id": str(conversation_id)
    }
    
    await manager.broadcast_to_conversation(message_data, conversation_id)


async def broadcast_message_delete(message_id: UUID, conversation_id: UUID, for_everyone: bool):
    """Broadcast a message deletion to all connected users."""
    message_data = {
        "type": "message_deleted",
        "message_id": str(message_id),
        "conversation_id": str(conversation_id),
        "for_everyone": for_everyone
    }
    
    await manager.broadcast_to_conversation(message_data, conversation_id)
