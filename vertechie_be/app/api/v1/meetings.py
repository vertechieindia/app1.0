"""
Meetings API - Video Conferencing Platform Endpoints
Handles room management, scheduling, participants, and recordings
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, update, delete, func
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
import uuid
import secrets

from app.db.session import get_db
from app.core.security import get_current_user

router = APIRouter()


# ============ Pydantic Schemas ============

class MeetingRoomCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    meeting_type: str = Field(default="meeting")  # meeting, interview, screening, webinar
    scheduled_at: Optional[datetime] = None
    duration_minutes: int = Field(default=60, ge=15, le=480)
    description: Optional[str] = None
    is_instant: bool = False
    settings: Optional[dict] = Field(default_factory=dict)

class MeetingRoomResponse(BaseModel):
    id: str
    room_id: str
    title: str
    meeting_type: str
    host_id: str
    host_name: str
    scheduled_at: Optional[datetime]
    duration_minutes: int
    description: Optional[str]
    join_url: str
    status: str
    is_recording: bool
    participant_count: int
    created_at: datetime
    settings: dict

class ParticipantAdd(BaseModel):
    email: str
    name: str
    role: str = "participant"  # host, co-host, participant, observer

class ParticipantResponse(BaseModel):
    id: str
    user_id: Optional[str]
    email: str
    name: str
    role: str
    status: str  # invited, joined, left, removed
    joined_at: Optional[datetime]
    left_at: Optional[datetime]

class ScheduleInterviewRequest(BaseModel):
    title: str
    interview_type: str  # screening, technical, behavioral, hr, final, panel
    scheduled_at: datetime
    duration_minutes: int = 60
    candidate_ids: List[str]
    interviewer_ids: List[str]
    description: Optional[str] = None
    send_invitations: bool = True
    add_to_calendar: bool = True
    record_meeting: bool = False

class RecordingResponse(BaseModel):
    id: str
    meeting_id: str
    file_url: str
    file_size_mb: float
    duration_seconds: int
    created_at: datetime
    status: str

class MeetingNoteCreate(BaseModel):
    content: str
    category: str = "general"  # technical, behavioral, general
    candidate_rating: Optional[int] = Field(None, ge=1, le=5)

class MeetingNoteResponse(BaseModel):
    id: str
    meeting_id: str
    author_id: str
    author_name: str
    content: str
    category: str
    candidate_rating: Optional[int]
    created_at: datetime


# ============ In-Memory Storage (Replace with DB in production) ============

# For demo purposes - in production use proper database models
meeting_rooms = {}
participants = {}
recordings = {}
meeting_notes = {}


# ============ Room Management Endpoints ============

@router.post("/rooms", response_model=MeetingRoomResponse)
async def create_meeting_room(
    data: MeetingRoomCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Create a new meeting room"""
    room_id = f"room-{secrets.token_urlsafe(8)}"
    meeting_id = str(uuid.uuid4())
    
    base_url = "http://localhost:5173"  # Configure from env
    join_url = f"{base_url}/techie/lobby/{room_id}?type={data.meeting_type}"
    
    room = {
        "id": meeting_id,
        "room_id": room_id,
        "title": data.title,
        "meeting_type": data.meeting_type,
        "host_id": current_user.get("id", "user-1"),
        "host_name": current_user.get("full_name", "Host"),
        "scheduled_at": data.scheduled_at,
        "duration_minutes": data.duration_minutes,
        "description": data.description,
        "join_url": join_url,
        "status": "scheduled" if data.scheduled_at else "active",
        "is_recording": False,
        "participant_count": 0,
        "created_at": datetime.utcnow(),
        "settings": data.settings or {
            "allow_screen_share": True,
            "allow_chat": True,
            "allow_recording": True,
            "waiting_room": False,
            "mute_on_entry": False,
        }
    }
    
    meeting_rooms[meeting_id] = room
    return MeetingRoomResponse(**room)


@router.get("/rooms", response_model=List[MeetingRoomResponse])
async def list_meeting_rooms(
    status: Optional[str] = None,
    meeting_type: Optional[str] = None,
    limit: int = Query(default=20, le=100),
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """List all meeting rooms for the current user"""
    user_id = current_user.get("id", "user-1")
    
    rooms = list(meeting_rooms.values())
    
    # Filter by status
    if status:
        rooms = [r for r in rooms if r["status"] == status]
    
    # Filter by type
    if meeting_type:
        rooms = [r for r in rooms if r["meeting_type"] == meeting_type]
    
    # Paginate
    rooms = rooms[offset:offset + limit]
    
    return [MeetingRoomResponse(**r) for r in rooms]


@router.get("/rooms/{room_id}", response_model=MeetingRoomResponse)
async def get_meeting_room(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get meeting room details"""
    room = None
    for r in meeting_rooms.values():
        if r["room_id"] == room_id:
            room = r
            break
    
    if not room:
        raise HTTPException(status_code=404, detail="Meeting room not found")
    
    return MeetingRoomResponse(**room)


@router.patch("/rooms/{room_id}")
async def update_meeting_room(
    room_id: str,
    title: Optional[str] = None,
    description: Optional[str] = None,
    scheduled_at: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update meeting room details"""
    room = None
    for r in meeting_rooms.values():
        if r["room_id"] == room_id:
            room = r
            break
    
    if not room:
        raise HTTPException(status_code=404, detail="Meeting room not found")
    
    if title:
        room["title"] = title
    if description:
        room["description"] = description
    if scheduled_at:
        room["scheduled_at"] = scheduled_at
    
    return {"message": "Meeting room updated", "room": room}


@router.delete("/rooms/{room_id}")
async def delete_meeting_room(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Delete a meeting room"""
    room_to_delete = None
    for meeting_id, r in meeting_rooms.items():
        if r["room_id"] == room_id:
            room_to_delete = meeting_id
            break
    
    if not room_to_delete:
        raise HTTPException(status_code=404, detail="Meeting room not found")
    
    del meeting_rooms[room_to_delete]
    return {"message": "Meeting room deleted"}


# ============ Meeting Actions ============

@router.post("/rooms/{room_id}/start")
async def start_meeting(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Start a scheduled meeting"""
    for r in meeting_rooms.values():
        if r["room_id"] == room_id:
            r["status"] = "active"
            return {"message": "Meeting started", "join_url": r["join_url"]}
    
    raise HTTPException(status_code=404, detail="Meeting room not found")


@router.post("/rooms/{room_id}/end")
async def end_meeting(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """End an active meeting"""
    for r in meeting_rooms.values():
        if r["room_id"] == room_id:
            r["status"] = "ended"
            return {"message": "Meeting ended"}
    
    raise HTTPException(status_code=404, detail="Meeting room not found")


@router.post("/rooms/{room_id}/record/start")
async def start_recording(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Start recording a meeting"""
    for r in meeting_rooms.values():
        if r["room_id"] == room_id:
            r["is_recording"] = True
            return {"message": "Recording started"}
    
    raise HTTPException(status_code=404, detail="Meeting room not found")


@router.post("/rooms/{room_id}/record/stop")
async def stop_recording(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Stop recording a meeting"""
    for r in meeting_rooms.values():
        if r["room_id"] == room_id:
            r["is_recording"] = False
            
            # Create a recording entry
            recording_id = str(uuid.uuid4())
            recording = {
                "id": recording_id,
                "meeting_id": r["id"],
                "file_url": f"/recordings/{recording_id}.mp4",
                "file_size_mb": 125.5,  # Mock
                "duration_seconds": r["duration_minutes"] * 60,
                "created_at": datetime.utcnow(),
                "status": "processing"
            }
            recordings[recording_id] = recording
            
            return {"message": "Recording stopped", "recording_id": recording_id}
    
    raise HTTPException(status_code=404, detail="Meeting room not found")


# ============ Participants ============

@router.post("/rooms/{room_id}/participants")
async def add_participant(
    room_id: str,
    data: ParticipantAdd,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Add a participant to a meeting"""
    room = None
    for r in meeting_rooms.values():
        if r["room_id"] == room_id:
            room = r
            break
    
    if not room:
        raise HTTPException(status_code=404, detail="Meeting room not found")
    
    participant_id = str(uuid.uuid4())
    participant = {
        "id": participant_id,
        "meeting_id": room["id"],
        "user_id": None,
        "email": data.email,
        "name": data.name,
        "role": data.role,
        "status": "invited",
        "joined_at": None,
        "left_at": None
    }
    
    if room_id not in participants:
        participants[room_id] = []
    participants[room_id].append(participant)
    
    # TODO: Send invitation email
    
    return {"message": "Participant invited", "participant": participant}


@router.get("/rooms/{room_id}/participants", response_model=List[ParticipantResponse])
async def list_participants(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """List all participants in a meeting"""
    return [ParticipantResponse(**p) for p in participants.get(room_id, [])]


@router.post("/rooms/{room_id}/join")
async def join_meeting(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Join a meeting room"""
    room = None
    for r in meeting_rooms.values():
        if r["room_id"] == room_id:
            room = r
            break
    
    if not room:
        raise HTTPException(status_code=404, detail="Meeting room not found")
    
    room["participant_count"] += 1
    
    # Return connection details for WebRTC
    return {
        "message": "Joined meeting",
        "room": room,
        "signaling_server": "wss://signaling.vertechie.com",  # WebRTC signaling
        "ice_servers": [
            {"urls": "stun:stun.l.google.com:19302"},
            {"urls": "stun:stun1.l.google.com:19302"},
        ],
        "token": secrets.token_urlsafe(32)  # For authentication
    }


@router.post("/rooms/{room_id}/leave")
async def leave_meeting(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Leave a meeting room"""
    for r in meeting_rooms.values():
        if r["room_id"] == room_id:
            r["participant_count"] = max(0, r["participant_count"] - 1)
            return {"message": "Left meeting"}
    
    raise HTTPException(status_code=404, detail="Meeting room not found")


# ============ Interview Scheduling ============

@router.post("/schedule-interview", response_model=MeetingRoomResponse)
async def schedule_interview(
    data: ScheduleInterviewRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Schedule a new interview meeting"""
    # Create the meeting room
    room_id = f"interview-{secrets.token_urlsafe(8)}"
    meeting_id = str(uuid.uuid4())
    
    base_url = "http://localhost:5173"
    join_url = f"{base_url}/techie/lobby/{room_id}?type=interview"
    
    room = {
        "id": meeting_id,
        "room_id": room_id,
        "title": data.title,
        "meeting_type": data.interview_type,
        "host_id": current_user.get("id", "user-1"),
        "host_name": current_user.get("full_name", "Host"),
        "scheduled_at": data.scheduled_at,
        "duration_minutes": data.duration_minutes,
        "description": data.description,
        "join_url": join_url,
        "status": "scheduled",
        "is_recording": data.record_meeting,
        "participant_count": 0,
        "created_at": datetime.utcnow(),
        "settings": {
            "allow_screen_share": True,
            "allow_chat": True,
            "allow_recording": data.record_meeting,
            "waiting_room": True,
            "mute_on_entry": True,
            "interview_mode": True,
        }
    }
    
    meeting_rooms[meeting_id] = room
    
    # Add participants
    participants[room_id] = []
    
    for candidate_id in data.candidate_ids:
        participants[room_id].append({
            "id": str(uuid.uuid4()),
            "meeting_id": meeting_id,
            "user_id": candidate_id,
            "email": f"candidate-{candidate_id}@email.com",
            "name": f"Candidate {candidate_id}",
            "role": "candidate",
            "status": "invited",
            "joined_at": None,
            "left_at": None
        })
    
    for interviewer_id in data.interviewer_ids:
        participants[room_id].append({
            "id": str(uuid.uuid4()),
            "meeting_id": meeting_id,
            "user_id": interviewer_id,
            "email": f"interviewer-{interviewer_id}@company.com",
            "name": f"Interviewer {interviewer_id}",
            "role": "interviewer",
            "status": "invited",
            "joined_at": None,
            "left_at": None
        })
    
    # TODO: Send invitations if data.send_invitations
    # TODO: Add to calendar if data.add_to_calendar
    
    return MeetingRoomResponse(**room)


# ============ Interview Notes ============

@router.post("/rooms/{room_id}/notes")
async def add_meeting_note(
    room_id: str,
    data: MeetingNoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Add a note to a meeting (for interviews)"""
    room = None
    for r in meeting_rooms.values():
        if r["room_id"] == room_id:
            room = r
            break
    
    if not room:
        raise HTTPException(status_code=404, detail="Meeting room not found")
    
    note_id = str(uuid.uuid4())
    note = {
        "id": note_id,
        "meeting_id": room["id"],
        "author_id": current_user.get("id", "user-1"),
        "author_name": current_user.get("full_name", "Interviewer"),
        "content": data.content,
        "category": data.category,
        "candidate_rating": data.candidate_rating,
        "created_at": datetime.utcnow()
    }
    
    if room_id not in meeting_notes:
        meeting_notes[room_id] = []
    meeting_notes[room_id].append(note)
    
    return MeetingNoteResponse(**note)


@router.get("/rooms/{room_id}/notes", response_model=List[MeetingNoteResponse])
async def get_meeting_notes(
    room_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get all notes for a meeting"""
    return [MeetingNoteResponse(**n) for n in meeting_notes.get(room_id, [])]


# ============ Recordings ============

@router.get("/recordings", response_model=List[RecordingResponse])
async def list_recordings(
    meeting_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """List all recordings"""
    recs = list(recordings.values())
    
    if meeting_id:
        recs = [r for r in recs if r["meeting_id"] == meeting_id]
    
    return [RecordingResponse(**r) for r in recs]


@router.get("/recordings/{recording_id}", response_model=RecordingResponse)
async def get_recording(
    recording_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get recording details"""
    recording = recordings.get(recording_id)
    if not recording:
        raise HTTPException(status_code=404, detail="Recording not found")
    
    return RecordingResponse(**recording)


@router.delete("/recordings/{recording_id}")
async def delete_recording(
    recording_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Delete a recording"""
    if recording_id not in recordings:
        raise HTTPException(status_code=404, detail="Recording not found")
    
    del recordings[recording_id]
    return {"message": "Recording deleted"}


# ============ Upcoming Interviews ============

@router.get("/upcoming-interviews")
async def get_upcoming_interviews(
    limit: int = Query(default=10, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get upcoming interview meetings"""
    now = datetime.utcnow()
    
    upcoming = []
    for room in meeting_rooms.values():
        if room["meeting_type"] in ["interview", "screening", "technical", "behavioral", "hr", "final", "panel"]:
            if room["scheduled_at"] and room["scheduled_at"] > now:
                upcoming.append(room)
    
    # Sort by scheduled time
    upcoming.sort(key=lambda x: x["scheduled_at"])
    
    return upcoming[:limit]


# ============ Meeting Stats ============

@router.get("/stats")
async def get_meeting_stats(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get meeting statistics"""
    total_meetings = len(meeting_rooms)
    active_meetings = len([r for r in meeting_rooms.values() if r["status"] == "active"])
    scheduled_meetings = len([r for r in meeting_rooms.values() if r["status"] == "scheduled"])
    total_recordings = len(recordings)
    
    # Interview stats
    interview_types = {}
    for room in meeting_rooms.values():
        mt = room["meeting_type"]
        interview_types[mt] = interview_types.get(mt, 0) + 1
    
    return {
        "total_meetings": total_meetings,
        "active_meetings": active_meetings,
        "scheduled_meetings": scheduled_meetings,
        "total_recordings": total_recordings,
        "interview_breakdown": interview_types
    }

