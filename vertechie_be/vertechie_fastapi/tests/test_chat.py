"""
Chat API Tests

Run with: pytest tests/test_chat.py -v
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import uuid4

from app.main import app
from app.models.user import User
from app.models.chat import Conversation, ChatMember, Message, ConversationType, MessageType
from app.core.security import get_password_hash


@pytest.fixture
async def test_users(db: AsyncSession):
    """Create test users for chat testing."""
    user1 = User(
        id=uuid4(),
        email="test_user1@example.com",
        hashed_password=get_password_hash("TestPass123!"),
        first_name="Test",
        last_name="User1",
        username="testuser1",
        vertechie_id="VT12345678",
        is_active=True,
        is_verified=True,
        email_verified=True,
    )
    user2 = User(
        id=uuid4(),
        email="test_user2@example.com",
        hashed_password=get_password_hash("TestPass123!"),
        first_name="Test",
        last_name="User2",
        username="testuser2",
        vertechie_id="VT87654321",
        is_active=True,
        is_verified=True,
        email_verified=True,
    )
    
    db.add(user1)
    db.add(user2)
    await db.commit()
    await db.refresh(user1)
    await db.refresh(user2)
    
    return user1, user2


@pytest.fixture
async def auth_token_user1(client: AsyncClient, test_users):
    """Get auth token for user1."""
    user1, _ = test_users
    response = await client.post(
        "/api/v1/auth/login",
        data={
            "username": user1.email,
            "password": "TestPass123!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    return data["access_token"]


@pytest.fixture
async def auth_token_user2(client: AsyncClient, test_users):
    """Get auth token for user2."""
    _, user2 = test_users
    response = await client.post(
        "/api/v1/auth/login",
        data={
            "username": user2.email,
            "password": "TestPass123!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    return data["access_token"]


@pytest.mark.asyncio
async def test_create_conversation(client: AsyncClient, auth_token_user1, test_users):
    """Test creating a direct message conversation."""
    user1, user2 = test_users
    
    response = await client.post(
        "/api/v1/chat/conversations",
        headers={"Authorization": f"Bearer {auth_token_user1}"},
        json={
            "conversation_type": "direct",
            "member_ids": [str(user2.id)],
        },
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["conversation_type"] == "direct"
    assert "id" in data


@pytest.mark.asyncio
async def test_list_conversations(client: AsyncClient, auth_token_user1, db: AsyncSession, test_users):
    """Test listing user conversations."""
    user1, user2 = test_users
    
    # Create a conversation
    conv = Conversation(
        id=uuid4(),
        conversation_type=ConversationType.DIRECT,
    )
    db.add(conv)
    await db.flush()
    
    member1 = ChatMember(
        conversation_id=conv.id,
        user_id=user1.id,
        unread_count=0,
    )
    member2 = ChatMember(
        conversation_id=conv.id,
        user_id=user2.id,
        unread_count=5,
    )
    db.add(member1)
    db.add(member2)
    await db.commit()
    
    response = await client.get(
        "/api/v1/chat/conversations",
        headers={"Authorization": f"Bearer {auth_token_user1}"},
    )
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["id"] == str(conv.id)
    assert "unread_count" in data[0]


@pytest.mark.asyncio
async def test_send_message(client: AsyncClient, auth_token_user1, db: AsyncSession, test_users):
    """Test sending a message."""
    user1, user2 = test_users
    
    # Create conversation
    conv = Conversation(
        id=uuid4(),
        conversation_type=ConversationType.DIRECT,
    )
    db.add(conv)
    await db.flush()
    
    member1 = ChatMember(
        conversation_id=conv.id,
        user_id=user1.id,
    )
    member2 = ChatMember(
        conversation_id=conv.id,
        user_id=user2.id,
    )
    db.add(member1)
    db.add(member2)
    await db.commit()
    
    response = await client.post(
        f"/api/v1/chat/conversations/{conv.id}/messages",
        headers={"Authorization": f"Bearer {auth_token_user1}"},
        json={
            "message_type": "text",
            "content": "Test message",
        },
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["content"] == "Test message"
    assert data["sender_id"] == str(user1.id)
    
    # Verify unread count updated for user2
    await db.refresh(member2)
    assert member2.unread_count == 1


@pytest.mark.asyncio
async def test_get_unread_count(client: AsyncClient, auth_token_user1, db: AsyncSession, test_users):
    """Test getting unread message count."""
    user1, user2 = test_users
    
    # Create conversations with unread messages
    conv1 = Conversation(id=uuid4(), conversation_type=ConversationType.DIRECT)
    conv2 = Conversation(id=uuid4(), conversation_type=ConversationType.DIRECT)
    db.add(conv1)
    db.add(conv2)
    await db.flush()
    
    member1_1 = ChatMember(conversation_id=conv1.id, user_id=user1.id, unread_count=3)
    member1_2 = ChatMember(conversation_id=conv2.id, user_id=user1.id, unread_count=2)
    db.add(member1_1)
    db.add(member1_2)
    await db.commit()
    
    response = await client.get(
        "/api/v1/chat/conversations/unread-count",
        headers={"Authorization": f"Bearer {auth_token_user1}"},
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["unread_count"] == 5  # 3 + 2


@pytest.mark.asyncio
async def test_mark_conversation_read(client: AsyncClient, auth_token_user1, db: AsyncSession, test_users):
    """Test marking a conversation as read."""
    user1, user2 = test_users
    
    conv = Conversation(id=uuid4(), conversation_type=ConversationType.DIRECT)
    db.add(conv)
    await db.flush()
    
    member = ChatMember(
        conversation_id=conv.id,
        user_id=user1.id,
        unread_count=5,
    )
    db.add(member)
    await db.commit()
    
    response = await client.put(
        f"/api/v1/chat/conversations/{conv.id}/mark-read",
        headers={"Authorization": f"Bearer {auth_token_user1}"},
    )
    
    assert response.status_code == 204
    
    # Verify unread count reset
    await db.refresh(member)
    assert member.unread_count == 0
    assert member.last_read_at is not None


@pytest.mark.asyncio
async def test_get_messages(client: AsyncClient, auth_token_user1, db: AsyncSession, test_users):
    """Test getting messages from a conversation."""
    user1, user2 = test_users
    
    conv = Conversation(id=uuid4(), conversation_type=ConversationType.DIRECT)
    db.add(conv)
    await db.flush()
    
    member = ChatMember(conversation_id=conv.id, user_id=user1.id)
    db.add(member)
    
    # Create test messages
    msg1 = Message(
        id=uuid4(),
        conversation_id=conv.id,
        sender_id=user1.id,
        message_type=MessageType.TEXT,
        content="Message 1",
    )
    msg2 = Message(
        id=uuid4(),
        conversation_id=conv.id,
        sender_id=user2.id,
        message_type=MessageType.TEXT,
        content="Message 2",
    )
    db.add(msg1)
    db.add(msg2)
    await db.commit()
    
    response = await client.get(
        f"/api/v1/chat/conversations/{conv.id}/messages",
        headers={"Authorization": f"Bearer {auth_token_user1}"},
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["content"] == "Message 2"  # Most recent first
    assert data[1]["content"] == "Message 1"
    
    # Verify read status updated
    await db.refresh(member)
    assert member.unread_count == 0


@pytest.mark.asyncio
async def test_edit_message(client: AsyncClient, auth_token_user1, db: AsyncSession, test_users):
    """Test editing a message."""
    user1, _ = test_users
    
    conv = Conversation(id=uuid4(), conversation_type=ConversationType.DIRECT)
    db.add(conv)
    await db.flush()
    
    member = ChatMember(conversation_id=conv.id, user_id=user1.id)
    db.add(member)
    
    msg = Message(
        id=uuid4(),
        conversation_id=conv.id,
        sender_id=user1.id,
        message_type=MessageType.TEXT,
        content="Original message",
    )
    db.add(msg)
    await db.commit()
    
    response = await client.put(
        f"/api/v1/chat/messages/{msg.id}",
        headers={"Authorization": f"Bearer {auth_token_user1}"},
        json={
            "content": "Edited message",
        },
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "Edited message"
    assert data["is_edited"] is True


@pytest.mark.asyncio
async def test_delete_message(client: AsyncClient, auth_token_user1, db: AsyncSession, test_users):
    """Test deleting a message."""
    user1, _ = test_users
    
    conv = Conversation(id=uuid4(), conversation_type=ConversationType.DIRECT)
    db.add(conv)
    await db.flush()
    
    member = ChatMember(conversation_id=conv.id, user_id=user1.id)
    db.add(member)
    
    msg = Message(
        id=uuid4(),
        conversation_id=conv.id,
        sender_id=user1.id,
        message_type=MessageType.TEXT,
        content="Message to delete",
    )
    db.add(msg)
    await db.commit()
    
    response = await client.delete(
        f"/api/v1/chat/messages/{msg.id}?for_everyone=true",
        headers={"Authorization": f"Bearer {auth_token_user1}"},
    )
    
    assert response.status_code == 204
    
    # Verify message marked as deleted
    await db.refresh(msg)
    assert msg.is_deleted is True
    assert msg.deleted_for_everyone is True


@pytest.mark.asyncio
async def test_unauthorized_access(client: AsyncClient, db: AsyncSession, test_users):
    """Test that users cannot access conversations they're not members of."""
    user1, user2 = test_users
    
    # Create conversation with only user2
    conv = Conversation(id=uuid4(), conversation_type=ConversationType.DIRECT)
    db.add(conv)
    await db.flush()
    
    member = ChatMember(conversation_id=conv.id, user_id=user2.id)
    db.add(member)
    await db.commit()
    
    # Get auth token for user1
    login_response = await client.post(
        "/api/v1/auth/login",
        data={
            "username": user1.email,
            "password": "TestPass123!",
        },
    )
    token = login_response.json()["access_token"]
    
    # Try to access conversation as user1 (should fail)
    response = await client.get(
        f"/api/v1/chat/conversations/{conv.id}/messages",
        headers={"Authorization": f"Bearer {token}"},
    )
    
    assert response.status_code == 403
