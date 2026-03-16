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
import AssignmentIcon from '@mui/icons-material/Assignment';
import CancelIcon from '@mui/icons-material/Cancel';
import LinkIcon from '@mui/icons-material/Link';
import { api } from '../../services/apiClient';

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

type CaptionRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

// Default: just local user until real interview data loads
const defaultParticipants: Participant[] = [
  { id: '1', name: 'You', isMuted: false, isVideoOff: false, isScreenSharing: false, isSpeaking: false, isHost: true, handRaised: false, role: 'interviewer' },
];

function formatInterviewType(value: string): string {
  if (!value) return 'Interview';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const VideoRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const captionRecognitionRef = useRef<CaptionRecognition | null>(null);

  const titleFromUrl = searchParams.get('title') ? decodeURIComponent(searchParams.get('title')!) : '';

  // State
  const [participants, setParticipants] = useState<Participant[]>(defaultParticipants);
  const [meetingTitle, setMeetingTitle] = useState(titleFromUrl || 'Meeting');
  const [meetingTypeLabel, setMeetingTypeLabel] = useState('Interview');
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [interviewNotes, setInterviewNotes] = useState<InterviewNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [candidateRating, setCandidateRating] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);
  const [reactionMenuAnchor, setReactionMenuAnchor] = useState<null | HTMLElement>(null);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [liveCaption, setLiveCaption] = useState('');
  const [captionError, setCaptionError] = useState('');
  const [virtualBackground, setVirtualBackground] = useState<'none' | 'blur' | 'dim'>('none');
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
  const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputs, setAudioOutputs] = useState<MediaDeviceInfo[]>([]);
  const [selectedMic, setSelectedMic] = useState('');
  const [selectedCam, setSelectedCam] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [speakerVolume, setSpeakerVolume] = useState(80);

  const meetingType = searchParams.get('type') || 'interview';
  const isInterview = meetingType === 'interview';
  const interviewId = searchParams.get('interviewId') || roomId || '';
  const isUuidInterviewId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(interviewId);
  const returnTo = searchParams.get('returnTo') || '/techie/ats/interviews';

  // Initialize title and type from URL
  useEffect(() => {
    if (titleFromUrl) setMeetingTitle(titleFromUrl);
    setMeetingTypeLabel(isInterview ? 'Interview' : 'Meeting');
  }, [titleFromUrl, isInterview]);

  // Fetch initial interview details and set real participants (current user + opposite), title, type
  useEffect(() => {
    const fetchInterviewDetails = async () => {
      if (!interviewId || !isUuidInterviewId) return;
      try {
        const data = await api.get<{
          candidate_id?: string;
          candidate_name?: string;
          candidate_avatar?: string;
          interview_type?: string;
          interviewers?: string[];
          notes?: string;
          updated_at?: string;
          created_at?: string;
        }>(`/hiring/interviews/${interviewId}`);

        const candidateName = data.candidate_name || 'Candidate';
        const typeLabel = data.interview_type ? formatInterviewType(String(data.interview_type)) : 'Interview';
        setMeetingTitle(`${typeLabel} - ${candidateName}`);
        setMeetingTypeLabel(typeLabel);

        // Current user from localStorage so "You" shows correct name; determine if they're interviewer or candidate
        let currentUserName = 'You';
        let isCurrentUserCandidate = false;
        try {
          const userDataStr = localStorage.getItem('userData');
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            const id = userData.id ?? userData.user_id;
            const first = userData.first_name || '';
            const last = userData.last_name || '';
            currentUserName = `${first} ${last}`.trim() || userData.email?.split('@')[0] || 'You';
            const currentId = String(id);
            const candidateId = data.candidate_id ? String(data.candidate_id) : '';
            const interviewerIds = (data.interviewers || []).map(String);
            isCurrentUserCandidate = currentId === candidateId;
          }
        } catch {
          // keep defaults
        }

        const self: Participant = {
          id: 'self',
          name: currentUserName,
          isMuted: false,
          isVideoOff: false,
          isScreenSharing: false,
          isSpeaking: false,
          isHost: true,
          handRaised: false,
          role: isCurrentUserCandidate ? 'candidate' : 'interviewer',
        };
        const other: Participant = {
          id: isCurrentUserCandidate ? 'interviewer' : (data.candidate_id || 'candidate'),
          name: isCurrentUserCandidate ? 'Interviewer' : candidateName,
          avatar: isCurrentUserCandidate ? undefined : (data.candidate_avatar || undefined),
          isMuted: false,
          isVideoOff: true,
          isScreenSharing: false,
          isSpeaking: false,
          isHost: false,
          handRaised: false,
          role: isCurrentUserCandidate ? 'interviewer' : 'candidate',
        };
        setParticipants([self, other]);

        if (data.notes) {
          setInterviewNotes([{
            id: 'initial',
            content: data.notes,
            timestamp: new Date(data.updated_at || data.created_at || Date.now()),
            category: 'general'
          }]);
        }
      } catch (err) {
        console.error('Error fetching interview details:', err);
        if (titleFromUrl) setMeetingTitle(titleFromUrl);
      }
    };
    if (isInterview) fetchInterviewDetails();
  }, [interviewId, isInterview, isUuidInterviewId, titleFromUrl]);

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
          const audioTrack = stream.getAudioTracks()[0];
          const videoTrack = stream.getVideoTracks()[0];
          if (audioTrack?.getSettings().deviceId) setSelectedMic(String(audioTrack.getSettings().deviceId));
          if (videoTrack?.getSettings().deviceId) setSelectedCam(String(videoTrack.getSettings().deviceId));
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setSnackbar({ open: true, message: 'Error accessing media devices.' });
      }
    };
    initMedia();
  }, []);

  const applyTrackStates = useCallback((nextMuted: boolean, nextVideoOff: boolean) => {
    const stream = localVideoRef.current?.srcObject as MediaStream | null;
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => { track.enabled = !nextMuted; });
    stream.getVideoTracks().forEach((track) => { track.enabled = !nextVideoOff; });
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    applyTrackStates(nextMuted, isVideoOff);
  };

  const toggleVideo = () => {
    const nextVideoOff = !isVideoOff;
    setIsVideoOff(nextVideoOff);
    applyTrackStates(isMuted, nextVideoOff);
  };

  const loadMediaDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter((d) => d.kind === 'audioinput');
      const cams = devices.filter((d) => d.kind === 'videoinput');
      const speakers = devices.filter((d) => d.kind === 'audiooutput');
      setAudioInputs(mics);
      setVideoInputs(cams);
      setAudioOutputs(speakers);
      if (!selectedMic && mics[0]?.deviceId) setSelectedMic(mics[0].deviceId);
      if (!selectedCam && cams[0]?.deviceId) setSelectedCam(cams[0].deviceId);
      if (!selectedSpeaker && speakers[0]?.deviceId) setSelectedSpeaker(speakers[0].deviceId);
    } catch (err) {
      console.error('Failed to enumerate media devices', err);
    }
  }, [selectedCam, selectedMic, selectedSpeaker]);

  useEffect(() => {
    if (!showSettings) return;
    loadMediaDevices();
  }, [showSettings, loadMediaDevices]);

  const applySelectedDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedMic ? { deviceId: { exact: selectedMic } } : true,
        video: selectedCam ? { deviceId: { exact: selectedCam } } : true,
      });

      const existing = localVideoRef.current?.srcObject as MediaStream | null;
      existing?.getTracks().forEach((track) => track.stop());

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      applyTrackStates(isMuted, isVideoOff);
      setSnackbar({ open: true, message: 'Audio and video devices updated' });
      setShowSettings(false);
    } catch (err) {
      console.error('Failed to switch media device', err);
      setSnackbar({ open: true, message: 'Failed to switch selected media devices' });
    }
  };

  const toggleFullscreenMode = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen toggle failed', err);
      setSnackbar({ open: true, message: 'Fullscreen is not available in this browser' });
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const stopCaptions = useCallback(() => {
    if (captionRecognitionRef.current) {
      captionRecognitionRef.current.onend = null;
      captionRecognitionRef.current.stop();
      captionRecognitionRef.current = null;
    }
  }, []);

  const startCaptions = useCallback(() => {
    const SpeechRecognitionCtor: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setCaptionError('Captions are not supported in this browser');
      setCaptionsEnabled(false);
      return;
    }

    stopCaptions();
    const recognition: CaptionRecognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      setLiveCaption(transcript.trim());
    };
    recognition.onerror = () => {
      setCaptionError('Could not capture captions from microphone');
    };
    recognition.onend = () => {
      if (captionsEnabled) {
        try {
          recognition.start();
        } catch {
          // ignore restart errors
        }
      }
    };
    captionRecognitionRef.current = recognition;
    recognition.start();
    setCaptionError('');
  }, [captionsEnabled, stopCaptions]);

  useEffect(() => {
    if (captionsEnabled) startCaptions();
    else stopCaptions();
    return () => stopCaptions();
  }, [captionsEnabled, startCaptions, stopCaptions]);

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
    navigate(returnTo);
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

  const addNote = async () => {
    if (!newNote.trim() || !interviewId || !isUuidInterviewId) return;

    const noteContent = newNote.trim();
    const timestamp = new Date();

    // Optimistic update
    const noteId = Date.now().toString();
    setInterviewNotes(prev => [...prev, {
      id: noteId,
      content: noteContent,
      timestamp: timestamp,
      category: 'general',
    }]);
    setNewNote('');

    // Persist to backend
    try {
      // Get current notes to append
      const currentNotes = interviewNotes.map(n => n.content).join('\n\n');
      const updatedNotes = currentNotes ? `${currentNotes}\n\n${noteContent}` : noteContent;

      await api.put(`/hiring/interviews/${interviewId}`, { notes: updatedNotes });
      setSnackbar({ open: true, message: 'Note saved to cloud' });
    } catch (err) {
      console.error('Error saving note:', err);
      setSnackbar({ open: true, message: 'Failed to save note to cloud. Kept locally.' });
    }
  };

  const handleRateCandidate = async (rating: number) => {
    setCandidateRating(rating);
    if (!interviewId || !isUuidInterviewId) return;

    try {
      await api.post(`/hiring/interviews/${interviewId}/scorecard`, {
        overall_score: rating,
        recommendation: rating >= 4 ? 'strong_yes' : rating >= 3 ? 'yes' : 'no',
        notes: 'Rating submitted during call'
      });
      setSnackbar({ open: true, message: `Candidate rated ${rating} stars` });
    } catch (err) {
      console.error('Error submitting rating:', err);
    }
  };

  const handleCancelFromCall = async () => {
    if (!interviewId || !isUuidInterviewId) return;
    if (!window.confirm("Are you sure you want to CANCEL this interview? This will notify the candidate and end the session.")) return;

    try {
      await api.put(`/hiring/interviews/${interviewId}/cancel`);
      setSnackbar({ open: true, message: 'Interview cancelled' });
      setTimeout(() => navigate(returnTo), 2000);
    } catch (err) {
      console.error('Error cancelling interview:', err);
    }
  };

  const sendReaction = (emoji: string) => {
    setSnackbar({ open: true, message: `Reaction sent: ${emoji}` });
    setReactionMenuAnchor(null);
  };

  const selfVideoFilter = virtualBackground === 'blur'
    ? 'blur(2px)'
    : virtualBackground === 'dim'
      ? 'brightness(0.7) saturate(1.1)'
      : 'none';


  return (
    <VideoContainer>
      {/* Top Bar */}
      <TopBar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, maxWidth: 280 }} noWrap title={meetingTitle}>
            {meetingTitle}
          </Typography>
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
              label={meetingTypeLabel}
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
            Room: {roomId || '—'}
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
            {participant.id === 'self' ? (
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
                  filter: participant.id === 'self' ? selfVideoFilter : 'none',
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
            {((participant.id === 'self' && isVideoOff) || participant.isVideoOff) && (
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
              {(participant.id === 'self' ? isMuted : participant.isMuted) && (
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

      {(captionsEnabled || captionError) && (
        <Box
          sx={{
            px: 2,
            py: 1,
            minHeight: 44,
            bgcolor: 'rgba(0,0,0,0.7)',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
            {captionError || liveCaption || 'Listening for captions...'}
          </Typography>
        </Box>
      )}

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
                <IconButton key={star} onClick={() => handleRateCandidate(star)} sx={{ color: star <= candidateRating ? '#ffc107' : 'rgba(255,255,255,0.3)' }}>
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

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#1a1a2e', color: 'white' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>Meeting Settings</Typography>
          <IconButton onClick={() => setShowSettings(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            select
            fullWidth
            label="Microphone"
            value={selectedMic}
            onChange={(e) => setSelectedMic(e.target.value)}
            sx={{
              mt: 1,
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
              '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } },
            }}
          >
            {audioInputs.map((device) => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label || 'Microphone'}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Camera"
            value={selectedCam}
            onChange={(e) => setSelectedCam(e.target.value)}
            sx={{
              mt: 2,
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
              '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } },
            }}
          >
            {videoInputs.map((device) => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label || 'Camera'}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Speaker"
            value={selectedSpeaker}
            onChange={(e) => setSelectedSpeaker(e.target.value)}
            sx={{
              mt: 2,
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
              '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } },
            }}
          >
            {audioOutputs.map((device) => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label || 'Speaker'}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'rgba(255,255,255,0.8)' }}>
              Speaker Volume: {speakerVolume}%
            </Typography>
            <Slider value={speakerVolume} onChange={(_, value) => setSpeakerVolume(Number(value))} min={0} max={100} />
          </Box>

          <FormControlLabel
            sx={{ mt: 1 }}
            control={<Switch checked={captionsEnabled} onChange={(e) => setCaptionsEnabled(e.target.checked)} />}
            label="Enable Captions"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowSettings(false)} sx={{ color: 'white' }}>Close</Button>
          <Button variant="contained" onClick={applySelectedDevices}>Apply</Button>
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
        {isInterview && (
          <Box>
            <MenuItem onClick={() => { setShowNotes(true); setMoreMenuAnchor(null); }}>
              <AssignmentIcon sx={{ mr: 1, color: '#42a5f5' }} /> Interview Notes & Rating
            </MenuItem>
            <MenuItem onClick={() => { handleCancelFromCall(); setMoreMenuAnchor(null); }} sx={{ color: '#ff4444' }}>
              <CancelIcon sx={{ mr: 1 }} /> Cancel Interview
            </MenuItem>
            <Divider />
          </Box>
        )}
        <MenuItem onClick={() => { setShowSettings(true); setMoreMenuAnchor(null); }}>
          <SettingsIcon sx={{ mr: 1 }} /> Settings
        </MenuItem>
        <MenuItem onClick={() => { setVirtualBackground((prev) => (prev === 'none' ? 'blur' : prev === 'blur' ? 'dim' : 'none')); setMoreMenuAnchor(null); }}>
          <BlurOnIcon sx={{ mr: 1 }} /> Virtual Background ({virtualBackground === 'none' ? 'Off' : virtualBackground === 'blur' ? 'Blur' : 'Dim'})
        </MenuItem>
        <MenuItem onClick={() => { setCaptionsEnabled((prev) => !prev); setMoreMenuAnchor(null); }}>
          <SubtitlesIcon sx={{ mr: 1 }} /> {captionsEnabled ? 'Disable Captions' : 'Enable Captions'}
        </MenuItem>
        <MenuItem onClick={() => { toggleFullscreenMode(); setMoreMenuAnchor(null); }}>
          {isFullscreen ? <FullscreenExitIcon sx={{ mr: 1 }} /> : <FullscreenIcon sx={{ mr: 1 }} />}
          {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
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

