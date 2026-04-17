"""
Firebase Cloud Messaging — chat push after messages are committed.
"""

from __future__ import annotations

import asyncio
from pathlib import Path
from typing import List
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.logger import get_logger
from app.models.chat import ChatMember, Message
from app.models.fcm_token import UserFcmToken
from app.models.user import RoleType, User

logger = get_logger("app.services.fcm_push")

_firebase_initialized = False


def _ensure_firebase_app() -> bool:
    global _firebase_initialized
    if _firebase_initialized:
        logger.info("FCM: firebase_admin already initialized")
        return True
    raw = settings.FIREBASE_SERVICE_ACCOUNT_PATH
    if not raw or not str(raw).strip():
        logger.info("FCM: firebase_admin not initialized - FIREBASE_SERVICE_ACCOUNT_PATH missing")
        return False
    p = Path(str(raw).strip())
    if not p.is_file():
        logger.warning("FIREBASE_SERVICE_ACCOUNT_PATH is not a file: %s", raw)
        return False
    try:
        import firebase_admin
        from firebase_admin import credentials

        if not firebase_admin._apps:
            cred = credentials.Certificate(str(p.resolve()))
            firebase_admin.initialize_app(cred)
            logger.info("FCM: firebase_admin initialized successfully")
        else:
            logger.info("FCM: firebase_admin app already present")
        _firebase_initialized = True
        return True
    except Exception:
        logger.exception("Firebase Admin init failed")
        return False


def chat_base_path_for_user(user: User) -> str:
    for r in getattr(user, "roles", None) or []:
        if getattr(r, "role_type", None) == RoleType.HIRING_MANAGER:
            return "/hr/chat"
    return "/techie/chat"


def _preview_body(message: Message) -> str:
    mt = message.message_type
    mt_val = mt.value if hasattr(mt, "value") else str(mt)
    if mt_val and mt_val.lower() != "text":
        if message.content and str(message.content).strip():
            return _truncate(str(message.content).strip(), 120)
        return f"[{mt_val}]"
    if message.content and str(message.content).strip():
        return _truncate(str(message.content).strip(), 120)
    return "New message"


def _truncate(s: str, max_len: int) -> str:
    if len(s) <= max_len:
        return s
    return s[: max_len - 1] + "…"


async def send_chat_message_fcm_notifications(
    db: AsyncSession,
    conversation_id: UUID,
    sender: User,
    message: Message,
) -> None:
    """
    Notify recipients via FCM when they are not connected to the conversation over WebSocket.
    Call only after the message row is committed.
    """
    if not _ensure_firebase_app():
        logger.info(
            "FCM: skipping push for conversation=%s message=%s because firebase_admin is unavailable",
            conversation_id,
            message.id,
        )
        return

    from firebase_admin import messaging

    from app.api.v1.chat_ws import user_is_connected_to_conversation

    sender_name = sender.full_name

    res = await db.execute(
        select(ChatMember.user_id).where(
            ChatMember.conversation_id == conversation_id,
            ChatMember.user_id != sender.id,
            ChatMember.is_active == True,  # noqa: E712
        )
    )
    recipient_ids: List[UUID] = [row[0] for row in res.all()]
    if not recipient_ids:
        logger.info(
            "FCM: no recipients for conversation=%s message=%s",
            conversation_id,
            message.id,
        )
        return

    res_users = await db.execute(
        select(User).options(selectinload(User.roles)).where(User.id.in_(recipient_ids))
    )
    users_by_id = {u.id: u for u in res_users.unique().scalars().all()}

    res_tokens = await db.execute(
        select(UserFcmToken).where(UserFcmToken.user_id.in_(recipient_ids))
    )
    token_rows: List[UserFcmToken] = list(res_tokens.scalars().all())

    messages_out: List[messaging.Message] = []
    ordered_tokens: List[str] = []
    body = _preview_body(message)

    for row in token_rows:
        if user_is_connected_to_conversation(conversation_id, row.user_id):
            continue
        user = users_by_id.get(row.user_id)
        if not user:
            continue
        base = settings.FRONTEND_URL.rstrip("/")
        path = chat_base_path_for_user(user)
        link = f"{base}{path}?conversationId={conversation_id}"

        msg = messaging.Message(
            token=row.token,
            notification=messaging.Notification(title=sender_name, body=body),
            data={
                "conversation_id": str(conversation_id),
                "message_id": str(message.id),
            },
            webpush=messaging.WebpushConfig(
                notification=messaging.WebpushNotification(title=sender_name, body=body),
                fcm_options=messaging.WebpushFCMOptions(link=link),
            ),
        )
        messages_out.append(msg)
        ordered_tokens.append(row.token)

    if not messages_out:
        logger.info(
            "FCM: no eligible tokens to send for conversation=%s message=%s",
            conversation_id,
            message.id,
        )
        return

    def _send():
        logger.info(
            "FCM: messaging.send_each called for conversation=%s message=%s token_count=%s",
            conversation_id,
            message.id,
            len(messages_out),
        )
        return messaging.send_each(messages_out)

    loop = asyncio.get_running_loop()
    try:
        batch = await loop.run_in_executor(None, _send)
    except Exception:
        logger.exception(
            "FCM: messaging.send_each raised for conversation=%s message=%s",
            conversation_id,
            message.id,
        )
        return

    invalid: List[str] = []
    for i, send_resp in enumerate(batch.responses):
        if send_resp.success:
            logger.info(
                "FCM: success conversation=%s message=%s response_message_id=%s",
                conversation_id,
                message.id,
                send_resp.message_id,
            )
            continue
        ex = send_resp.exception
        logger.error(
            "FCM: error conversation=%s message=%s token_index=%s error=%s",
            conversation_id,
            message.id,
            i,
            ex,
        )
        err_s = str(ex) if ex else ""
        if (
            "registration-token-not-registered" in err_s.lower()
            or "not a valid fcm registration token" in err_s.lower()
            or "Requested entity was not found" in err_s
        ):
            if i < len(ordered_tokens):
                invalid.append(ordered_tokens[i])
        else:
            logger.debug("FCM send failure: %s", ex)

    if invalid:
        try:
            await db.execute(delete(UserFcmToken).where(UserFcmToken.token.in_(invalid)))
            await db.commit()
        except Exception:
            logger.exception("Failed to prune invalid FCM tokens")
