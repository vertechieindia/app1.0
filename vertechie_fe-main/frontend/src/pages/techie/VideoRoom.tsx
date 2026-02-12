/**
 * VideoRoom - Enterprise Video Conferencing Platform
 * 
 * Features:
 * - WebRTC-based video/audio calls
 * - Screen sharing
 * - Participant grid layout
 * - Chat sidebar
 * - Recording indicator
 * - Virtual backgrounds
 * - Meeting controls
 * - Participant management
 * - Interview-specific features (notes, ratings)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Avatar,
  Paper,
  Tooltip,
  Badge,
  Drawer,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Slider,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Fade,
  Zoom,
} from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';

// Icons
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import HandIcon from '@mui/icons-material/PanTool';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SecurityIcon from '@mui/icons-material/Security';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InfoIcon from '@mui/icons-material/Info';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import PushPinIcon from '@mui/icons-material/PushPin';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import NoteIcon from '@mui/icons-material/Note';
import StarIcon from '@mui/icons-material/Star';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinkIcon from '@mui/icons-material/Link';

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

const recordingPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const waveform = keyframes`
  0%, 100% { height: 4px; }
  50% { height: 20px; }
`;

// Styled Components
const VideoContainer = styled(Box)({
  height: '100vh',
  width: '100vw',
  background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
});

const VideoGrid = styled(Box)<{ participants: number }>(({ participants }) => ({
  flex: 1,
  display: 'grid',
  gap: 8,
  padding: 16,
  gridTemplateColumns: participants <= 1 ? '1fr' :
    participants <= 2 ? 'repeat(2, 1fr)' :
      participants <= 4 ? 'repeat(2, 1fr)' :
        participants <= 9 ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
  gridTemplateRows: participants <= 2 ? '1fr' :
    participants <= 4 ? 'repeat(2, 1fr)' :
      participants <= 9 ? 'repeat(3, 1fr)' : 'auto',
}));

const VideoTile = styled(Paper)<{ isActive?: boolean; isPinned?: boolean }>(({ isActive, isPinned }) => ({
  position: 'relative',
  borderRadius: 16,
  overflow: 'hidden',
  background: '#1e1e2d',
  border: isActive ? '3px solid #00ff88' : isPinned ? '3px solid #ffd700' : '1px solid rgba(255,255,255,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.01)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
}));

const ControlBar = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '16px 24px',
  background: 'rgba(0,0,0,0.8)',
  backdropFilter: 'blur(20px)',
  gap: 8,
});

const ControlButton = styled(IconButton)<{ active?: boolean; danger?: boolean }>(({ active, danger }) => ({
  width: 56,
  height: 56,
  borderRadius: 16,
  background: danger ? '#ff4444' : active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)',
  color: active ? '#00ff88' : 'white',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: danger ? '#ff6666' : 'rgba(255,255,255,0.25)',
    transform: 'scale(1.1)',
  },
}));

const TopBar = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 24px',
  background: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(10px)',
});

const ParticipantName = styled(Box)({
  position: 'absolute',
  bottom: 12,
  left: 12,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 12px',
  borderRadius: 8,
  background: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(10px)',
});

const SpeakingIndicator = styled(Box)({
  display: 'flex',
  gap: 2,
  alignItems: 'flex-end',
  height: 20,
  '& span': {
    width: 3,
    background: '#00ff88',
    borderRadius: 2,
    animation: `${waveform} 0.5s ease-in-out infinite`,
    '&:nth-of-type(1)': { animationDelay: '0s' },
    '&:nth-of-type(2)': { animationDelay: '0.1s' },
    '&:nth-of-type(3)': { animationDelay: '0.2s' },
    '&:nth-of-type(4)': { animationDelay: '0.3s' },
  },
});

const ChatDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    width: 360,
    background: 'rgba(26, 26, 46, 0.98)',
    backdropFilter: 'blur(20px)',
    borderLeft: '1px solid rgba(255,255,255,0.1)',
  },
});

const MessageBubble = styled(Box)<{ isMine?: boolean }>(({ isMine }) => ({
  maxWidth: '80%',
  padding: '10px 14px',
  borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
  background: isMine ? 'linear-gradient(135deg, #0d47a1, #1565c0)' : 'rgba(255,255,255,0.1)',
  color: 'white',
  alignSelf: isMine ? 'flex-end' : 'flex-start',
}));

// Interfaces
interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isSpeaking: boolean;
  isHost: boolean;
  handRaised: boolean;
  role?: 'interviewer' | 'candidate' | 'observer';
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
}

interface InterviewNote {
  id: string;
  content: string;
  timestamp: Date;
  category: 'technical' | 'behavioral' | 'general';
}

// Mock Data
const mockParticipants: Participant[] = [
  { id: '1', name: 'You', isMuted: false, isVideoOff: false, isScreenSharing: false, isSpeaking: false, isHost: true, handRaised: false, role: 'interviewer' },
  { id: '2', name: 'John Smith', avatar: '', isMuted: false, isVideoOff: false, isScreenSharing: false, isSpeaking: true, isHost: false, handRaised: false, role: 'candidate' },
];

const VideoRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // State
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [pinnedParticipant, setPinnedParticipant] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'speaker'>('grid');
  const [handRaised, setHandRaised] = useState(false);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', senderId: '2', senderName: 'John Smith', content: 'Hello! I\'m ready for the interview.', timestamp: new Date(), type: 'text' },
    { id: '2', senderId: 'system', senderName: 'System', content: 'Recording started', timestamp: new Date(), type: 'system' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [interviewNotes, setInterviewNotes] = useState<InterviewNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [candidateRating, setCandidateRating] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);
  const [reactionMenuAnchor, setReactionMenuAnchor] = useState<null | HTMLElement>(null);

  // Meeting timer
  useEffect(() => {
    const timer = setInterval(() => {
      setMeetingDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize local video
  useEffect(() => {
    const initMedia = async () => {
      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
        } catch (initialErr: any) {
          console.warn('Initial media access failed, trying partial:', initialErr);

          if (initialErr.name === 'NotAllowedError' || initialErr.name === 'PermissionDeniedError') {
            try {
              stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              setIsVideoOff(true);
              setSnackbar({ open: true, message: 'Camera permission denied. Joining with audio only.' });
            } catch (audioErr) {
              try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setIsMuted(true);
                setSnackbar({ open: true, message: 'Microphone permission denied. Joining with video only.' });
              } catch (videoErr) {
                // Return an empty stream or handle no media case
                console.error('All media access denied');
                setSnackbar({ open: true, message: 'Camera and microphone access denied.' });
                return;
              }
            }
          } else {
            setSnackbar({ open: true, message: 'Could not access camera/microphone.' });
            return;
          }
        }

        if (localVideoRef.current && stream) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setSnackbar({ open: true, message: 'Error accessing media devices.' });
      }
    };
    initMedia();
  }, []);

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsScreenSharing(true);
        setSnackbar({ open: true, message: 'Screen sharing started' });
      } catch (err) {
        console.error('Screen share error:', err);
      }
    } else {
      setIsScreenSharing(false);
      setSnackbar({ open: true, message: 'Screen sharing stopped' });
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    setSnackbar({ open: true, message: isRecording ? 'Recording stopped' : 'Recording started' });
  };

  const endCall = () => {
    navigate('/techie/ats/scheduling');
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbar({ open: true, message: 'Meeting link copied!' });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      senderId: '1',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
    }]);
    setNewMessage('');
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    setInterviewNotes(prev => [...prev, {
      id: Date.now().toString(),
      content: newNote,
      timestamp: new Date(),
      category: 'general',
    }]);
    setNewNote('');
  };

  const sendReaction = (emoji: string) => {
    setSnackbar({ open: true, message: `Reaction sent: ${emoji}` });
    setReactionMenuAnchor(null);
  };

  const meetingType = searchParams.get('type') || 'interview';
  const isInterview = meetingType === 'interview';

  return (
    <VideoContainer>
      {/* Top Bar */}
      <TopBar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isRecording && (
            <Chip
              icon={<FiberManualRecordIcon sx={{ color: '#ff4444 !important', animation: `${recordingPulse} 1s infinite` }} />}
              label="Recording"
              size="small"
              sx={{ bgcolor: 'rgba(255, 68, 68, 0.2)', color: '#ff4444', fontWeight: 600 }}
            />
          )}
          <Chip
            icon={<SecurityIcon />}
            label="End-to-End Encrypted"
            size="small"
            sx={{ bgcolor: 'rgba(0, 255, 136, 0.1)', color: '#00ff88' }}
          />
          {isInterview && (
            <Chip
              label="Technical Interview"
              size="small"
              sx={{ bgcolor: 'rgba(255, 193, 7, 0.2)', color: '#ffc107' }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
            <TimerIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
              {formatDuration(meetingDuration)}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Room: {roomId || 'interview-123'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Copy meeting link">
            <IconButton onClick={copyMeetingLink} sx={{ color: 'white' }}>
              <LinkIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Invite participants">
            <IconButton onClick={() => setShowInvite(true)} sx={{ color: 'white' }}>
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
          {isInterview && (
            <Tooltip title="Interview Notes">
              <IconButton onClick={() => setShowNotes(true)} sx={{ color: 'white' }}>
                <Badge badgeContent={interviewNotes.length} color="primary">
                  <NoteIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Meeting info">
            <IconButton sx={{ color: 'white' }}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </TopBar>

      {/* Video Grid */}
      <VideoGrid participants={pinnedParticipant ? 1 : participants.length}>
        {(pinnedParticipant ? participants.filter(p => p.id === pinnedParticipant) : participants).map((participant, index) => (
          <VideoTile
            key={participant.id}
            isActive={participant.isSpeaking}
            isPinned={participant.id === pinnedParticipant}
          >
            {/* Video Element */}
            {participant.id === '1' ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: isVideoOff ? 'none' : 'block',
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #1e1e2d 0%, #2d2d44 100%)',
                }}
              >
                {participant.isVideoOff ? (
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: 48,
                      bgcolor: '#0d47a1',
                    }}
                  >
                    {participant.name.charAt(0)}
                  </Avatar>
                ) : (
                  <Box
                    component="img"
                    src={`https://picsum.photos/seed/${participant.id}/800/600`}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </Box>
            )}

            {/* Video Off Overlay */}
            {((participant.id === '1' && isVideoOff) || participant.isVideoOff) && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #1e1e2d 0%, #2d2d44 100%)',
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: 40,
                    bgcolor: participant.role === 'candidate' ? '#ff9800' : '#0d47a1',
                  }}
                >
                  {participant.name.charAt(0)}
                </Avatar>
              </Box>
            )}

            {/* Participant Info */}
            <ParticipantName>
              {participant.isSpeaking && (
                <SpeakingIndicator>
                  <span /><span /><span /><span />
                </SpeakingIndicator>
              )}
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                {participant.name} {participant.isHost && '(Host)'}
              </Typography>
              {(participant.id === '1' ? isMuted : participant.isMuted) && (
                <MicOffIcon sx={{ fontSize: 16, color: '#ff4444' }} />
              )}
              {participant.handRaised && (
                <HandIcon sx={{ fontSize: 16, color: '#ffd700' }} />
              )}
            </ParticipantName>

            {/* Role Badge */}
            {participant.role && (
              <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                <Chip
                  label={participant.role.charAt(0).toUpperCase() + participant.role.slice(1)}
                  size="small"
                  sx={{
                    bgcolor: participant.role === 'candidate' ? 'rgba(255, 152, 0, 0.2)' :
                      participant.role === 'interviewer' ? 'rgba(13, 71, 161, 0.2)' : 'rgba(255,255,255,0.1)',
                    color: participant.role === 'candidate' ? '#ff9800' :
                      participant.role === 'interviewer' ? '#42a5f5' : 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
            )}

            {/* Pin/Actions */}
            <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
              <Tooltip title={pinnedParticipant === participant.id ? 'Unpin' : 'Pin'}>
                <IconButton
                  size="small"
                  onClick={() => setPinnedParticipant(pinnedParticipant === participant.id ? null : participant.id)}
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: pinnedParticipant === participant.id ? '#ffd700' : 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <PushPinIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Screen Sharing Indicator */}
            {participant.isScreenSharing && (
              <Box sx={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)' }}>
                <Chip
                  icon={<ScreenShareIcon />}
                  label="Sharing Screen"
                  size="small"
                  sx={{ bgcolor: 'rgba(0, 255, 136, 0.2)', color: '#00ff88' }}
                />
              </Box>
            )}
          </VideoTile>
        ))}
      </VideoGrid>

      {/* Control Bar */}
      <ControlBar>
        {/* Left Controls */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
            <ControlButton onClick={toggleMute} active={!isMuted}>
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </ControlButton>
          </Tooltip>
          <Tooltip title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}>
            <ControlButton onClick={toggleVideo} active={!isVideoOff}>
              {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
            </ControlButton>
          </Tooltip>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />

        {/* Center Controls */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
            <ControlButton onClick={toggleScreenShare} active={isScreenSharing}>
              {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
            </ControlButton>
          </Tooltip>
          <Tooltip title={isRecording ? 'Stop recording' : 'Start recording'}>
            <ControlButton onClick={toggleRecording} active={isRecording}>
              <FiberManualRecordIcon sx={{ color: isRecording ? '#ff4444' : 'inherit' }} />
            </ControlButton>
          </Tooltip>
          <Tooltip title={handRaised ? 'Lower hand' : 'Raise hand'}>
            <ControlButton onClick={() => setHandRaised(!handRaised)} active={handRaised}>
              <HandIcon />
            </ControlButton>
          </Tooltip>
          <Tooltip title="Reactions">
            <ControlButton onClick={(e) => setReactionMenuAnchor(e.currentTarget)}>
              <EmojiEmotionsIcon />
            </ControlButton>
          </Tooltip>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />

        {/* Right Controls */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Chat">
            <ControlButton onClick={() => setShowChat(true)}>
              <Badge badgeContent={0} color="error">
                <ChatIcon />
              </Badge>
            </ControlButton>
          </Tooltip>
          <Tooltip title="Participants">
            <ControlButton onClick={() => setShowParticipants(true)}>
              <Badge badgeContent={participants.length} color="primary">
                <PeopleIcon />
              </Badge>
            </ControlButton>
          </Tooltip>
          <Tooltip title="View mode">
            <ControlButton onClick={() => setViewMode(viewMode === 'grid' ? 'speaker' : 'grid')}>
              {viewMode === 'grid' ? <ViewSidebarIcon /> : <GridViewIcon />}
            </ControlButton>
          </Tooltip>
          <Tooltip title="More options">
            <ControlButton onClick={(e) => setMoreMenuAnchor(e.currentTarget)}>
              <MoreVertIcon />
            </ControlButton>
          </Tooltip>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />

        {/* End Call */}
        <Tooltip title="Leave meeting">
          <ControlButton danger onClick={endCall}>
            <CallEndIcon />
          </ControlButton>
        </Tooltip>
      </ControlBar>

      {/* Chat Drawer */}
      <ChatDrawer anchor="right" open={showChat} onClose={() => setShowChat(false)}>
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>Chat</Typography>
          <IconButton onClick={() => setShowChat(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {chatMessages.map((msg) => (
            <Box key={msg.id}>
              {msg.type === 'system' ? (
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', display: 'block' }}>
                  {msg.content}
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {msg.senderId !== '1' && (
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5 }}>
                      {msg.senderName}
                    </Typography>
                  )}
                  <MessageBubble isMine={msg.senderId === '1'}>
                    <Typography variant="body2">{msg.content}</Typography>
                  </MessageBubble>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', mt: 0.5, alignSelf: msg.senderId === '1' ? 'flex-end' : 'flex-start' }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: 3,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
              },
            }}
          />
          <IconButton onClick={sendMessage} sx={{ color: '#0d47a1' }}>
            <SendIcon />
          </IconButton>
        </Box>
      </ChatDrawer>

      {/* Participants Drawer */}
      <ChatDrawer anchor="right" open={showParticipants} onClose={() => setShowParticipants(false)}>
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>Participants ({participants.length})</Typography>
          <IconButton onClick={() => setShowParticipants(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ flex: 1, p: 1 }}>
          {participants.map((p) => (
            <ListItem key={p.id} sx={{ borderRadius: 2, mb: 1, bgcolor: 'rgba(255,255,255,0.03)' }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: p.role === 'candidate' ? '#ff9800' : '#0d47a1' }}>
                  {p.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ color: 'white', fontWeight: 500 }}>{p.name} {p.isHost && '(Host)'}</Typography>}
                secondary={<Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{p.role}</Typography>}
              />
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {p.isMuted && <MicOffIcon sx={{ fontSize: 18, color: '#ff4444' }} />}
                {p.isVideoOff && <VideocamOffIcon sx={{ fontSize: 18, color: '#ff4444' }} />}
              </Box>
            </ListItem>
          ))}
        </List>
      </ChatDrawer>

      {/* Interview Notes Dialog */}
      <Dialog open={showNotes} onClose={() => setShowNotes(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#1a1a2e', color: 'white' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>Interview Notes</Typography>
          <IconButton onClick={() => setShowNotes(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Candidate Rating */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Candidate Rating</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <IconButton key={star} onClick={() => setCandidateRating(star)} sx={{ color: star <= candidateRating ? '#ffc107' : 'rgba(255,255,255,0.3)' }}>
                  <StarIcon />
                </IconButton>
              ))}
            </Box>
          </Box>

          {/* Notes List */}
          <Box sx={{ mb: 2, maxHeight: 300, overflowY: 'auto' }}>
            {interviewNotes.map((note) => (
              <Box key={note.id} sx={{ p: 2, mb: 1, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2 }}>
                <Typography variant="body2">{note.content}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  {note.timestamp.toLocaleTimeString()}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Add Note */}
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Add a note about the candidate..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.05)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowNotes(false)} sx={{ color: 'white' }}>Close</Button>
          <Button variant="contained" onClick={addNote} startIcon={<CheckCircleIcon />}>Save Note</Button>
        </DialogActions>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={showInvite} onClose={() => setShowInvite(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Participants</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Share this link with participants to join the meeting:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ flex: 1, wordBreak: 'break-all' }}>
              {window.location.href}
            </Typography>
            <Button size="small" startIcon={<ContentCopyIcon />} onClick={copyMeetingLink}>
              Copy
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInvite(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Reactions Menu */}
      <Menu anchorEl={reactionMenuAnchor} open={Boolean(reactionMenuAnchor)} onClose={() => setReactionMenuAnchor(null)}>
        <Box sx={{ display: 'flex', gap: 1, p: 1 }}>
          {['👍', '👏', '❤️', '😂', '😮', '🎉', '🤔', '👋'].map((emoji) => (
            <IconButton key={emoji} onClick={() => sendReaction(emoji)} sx={{ fontSize: 24 }}>
              {emoji}
            </IconButton>
          ))}
        </Box>
      </Menu>

      {/* More Options Menu */}
      <Menu anchorEl={moreMenuAnchor} open={Boolean(moreMenuAnchor)} onClose={() => setMoreMenuAnchor(null)}>
        <MenuItem onClick={() => { setShowSettings(true); setMoreMenuAnchor(null); }}>
          <SettingsIcon sx={{ mr: 1 }} /> Settings
        </MenuItem>
        <MenuItem>
          <BlurOnIcon sx={{ mr: 1 }} /> Virtual Background
        </MenuItem>
        <MenuItem>
          <SubtitlesIcon sx={{ mr: 1 }} /> Enable Captions
        </MenuItem>
        <MenuItem onClick={() => setIsFullscreen(!isFullscreen)}>
          {isFullscreen ? <FullscreenExitIcon sx={{ mr: 1 }} /> : <FullscreenIcon sx={{ mr: 1 }} />}
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </MenuItem>
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </VideoContainer>
  );
};

export default VideoRoom;

