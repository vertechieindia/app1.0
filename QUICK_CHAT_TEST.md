# Quick Chat Testing Guide

## 🚀 Quick Start Testing

### Step 1: Setup Test Users

```bash
cd vertechie_be/vertechie_fastapi
python create_test_techies_only.py
```

This creates:
- `john.doe@example.com` / `TestPass@123`
- `jane.smith@example.com` / `TestPass@123`

### Step 2: Start Backend

```bash
cd vertechie_be/vertechie_fastapi
python run.py
```

Backend should be running on `http://localhost:8000`

### Step 3: Start Frontend

```bash
cd vertechie_fe-main/frontend
npm run dev
```

Frontend should be running on `http://localhost:5173`

---

## ✅ 5-Minute Smoke Test

### Test 1: Basic Messaging (2 minutes)

1. **Window 1**: Login as `john.doe@example.com` → Go to `/techie/chat`
2. **Window 2**: Login as `jane.smith@example.com` → Go to `/techie/chat`
3. **Window 1**: Click "New Chat" → Select Jane → Send "Hello!"
4. **Window 2**: Should see message appear **immediately** (no refresh)

✅ **PASS** if: Message appears in real-time in Window 2

---

### Test 2: Unread Badges (1 minute)

1. **Window 1**: Send message to Window 2
2. **Window 2**: **Don't open conversation** → Check bottom nav Chat icon
3. **Window 2**: Should see red badge with "1"
4. **Window 2**: Open conversation → Badge should disappear

✅ **PASS** if: Badge appears and disappears correctly

---

### Test 3: WebSocket Connection (1 minute)

1. Open DevTools → Network tab → Filter: "WS"
2. Open chat conversation
3. Should see WebSocket connection: `ws://localhost:8000/ws/chat/{id}`
4. Status should be "101 Switching Protocols"

✅ **PASS** if: WebSocket connection established

---

### Test 4: File Upload (1 minute)

1. Open chat conversation
2. Click attachment icon → Select "Photo"
3. Choose an image file
4. File should upload and appear in chat

✅ **PASS** if: File uploads and displays correctly

---

## 🔍 Detailed Testing

See `CHAT_TESTING_GUIDE.md` for comprehensive test scenarios.

---

## 🐛 Common Issues

### WebSocket Not Connecting
- Check backend is running
- Check URL: `ws://localhost:8000/ws/chat/{id}?token=...`
- Check token is valid

### Messages Not Appearing
- Check browser console for errors
- Verify WebSocket connection in Network tab
- Check API responses in Network tab

### Unread Counts Wrong
- Check API: `GET /api/v1/chat/conversations/unread-count`
- Verify `ChatMember.unread_count` in database
- Check if `mark-read` is called when opening conversation

---

## 📊 Test Checklist

- [ ] Can create conversation
- [ ] Can send messages
- [ ] Messages appear in real-time
- [ ] Unread badges work
- [ ] File uploads work
- [ ] Typing indicators work
- [ ] Group chats work
- [ ] HR chat works (`/hr/chat`)
- [ ] SuperAdmin chat works (`/super-admin/chat`)

---

## 🧪 Run Backend Tests

```bash
cd vertechie_be/vertechie_fastapi
pytest tests/test_chat.py -v
```

Expected: All tests pass ✅
