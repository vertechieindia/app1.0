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

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import NoteIcon from '@mui/icons-material/Note';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CancelIcon from '@mui/icons-material/Cancel';
import LinkIcon from '@mui/icons-material/Link';
import type { ImageSegmenter } from '@mediapipe/tasks-vision';
import { api } from '../../services/apiClient';
import {
  createLobbyImageSegmenter,
  paintLobbyVirtualBackground,
} from '../../utils/lobbySelfieBackground';
import {
  resolveMeetingVbg,
  VBG_MORE_MENU_CYCLE_IDS,
  consumeLobbyVbgForMeeting,
  consumeLobbyMediaIntent,
} from '../../constants/virtualBackgrounds';

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

const recordingPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

// Styled Components
/** Fills AuthenticatedLayout <main> (not raw 100vh) so bottom controls stay visible */
const VideoContainer = styled(Box)({
  flex: '1 1 0%',
  minHeight: 0,
  width: '100%',
  maxWidth: '100%',
  background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
});

const VideoGrid = styled(Box)<{ participants: number }>(({ participants }) => ({
  flex: '1 1 0%',
  minHeight: 0,
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

const TopBar = styled(Box)({
  flexShrink: 0,
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

// Default: just local user until real interview data loads
const defaultParticipants: Participant[] = [
  { id: 'self', name: 'You', isMuted: false, isVideoOff: false, isScreenSharing: false, isSpeaking: false, isHost: true, handRaised: false, role: 'interviewer' },
];

function formatInterviewType(value: string): string {
  if (!value) return 'Interview';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatMeetCode(rid: string | undefined): string {
  if (!rid) return '—';
  const cleaned = rid.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'meet';
  const pad = (cleaned + 'xxxxxxxxxx').slice(0, 9);
  return `${pad.slice(0, 3)}-${pad.slice(3, 6)}-${pad.slice(6, 9)}`;
}

const VideoRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const meetingVbgCanvasRef = useRef<HTMLCanvasElement>(null);
  const meetingBgImageRef = useRef<HTMLImageElement | null>(null);
  const meetingSegmenterRef = useRef<ImageSegmenter | null>(null);
  const meetingVbgRafRef = useRef(0);
  const meetingVbgPaintRef = useRef({ previewBlur: false, previewBgImageUrl: null as string | null });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

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
  /** Meet-style: one right rail at a time — video stays full width until a rail opens */
  const [rightPanel, setRightPanel] = useState<'none' | 'chat' | 'people'>('none');
  const [showSettings, setShowSettings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showMeetingInfo, setShowMeetingInfo] = useState(false);
  const [nowTick, setNowTick] = useState(() => Date.now());
  const [showNotes, setShowNotes] = useState(false);
  const [pinnedParticipant, setPinnedParticipant] = useState<string | null>(null);
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
  /** From lobby via {@link consumeLobbyVbgForMeeting} (survives Strict Mode); then ⋮ menu edits */
  const [vbgSelectedId, setVbgSelectedId] = useState(() => consumeLobbyVbgForMeeting().id);
  const [vbgCustomUrl, setVbgCustomUrl] = useState<string | null>(() => consumeLobbyVbgForMeeting().custom);
  const [vbgEngineReady, setVbgEngineReady] = useState(false);
  const [hasLocalStream, setHasLocalStream] = useState(false);
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

  const resolvedMeetingVbg = useMemo(
    () => resolveMeetingVbg(vbgSelectedId, vbgCustomUrl),
    [vbgSelectedId, vbgCustomUrl],
  );

  const previewNeedsMeetingVbg =
    hasLocalStream &&
    !isVideoOff &&
    (resolvedMeetingVbg.mode === 'blur' ||
      (resolvedMeetingVbg.mode === 'image' && Boolean(resolvedMeetingVbg.imageUrl)));

  const showMeetingCanvasVbg = previewNeedsMeetingVbg && vbgEngineReady;

  useEffect(() => {
    meetingVbgPaintRef.current = {
      previewBlur: resolvedMeetingVbg.mode === 'blur',
      previewBgImageUrl:
        resolvedMeetingVbg.mode === 'image' ? resolvedMeetingVbg.imageUrl : null,
    };
  }, [resolvedMeetingVbg.mode, resolvedMeetingVbg.imageUrl]);

  useEffect(() => {
    const url = resolvedMeetingVbg.mode === 'image' ? resolvedMeetingVbg.imageUrl : null;
    if (!url) {
      meetingBgImageRef.current = null;
      return;
    }
    const img = new Image();
    if (!url.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      meetingBgImageRef.current = img;
    };
    img.onerror = () => {
      meetingBgImageRef.current = null;
    };
    img.src = url;
  }, [resolvedMeetingVbg.mode, resolvedMeetingVbg.imageUrl]);

  useEffect(() => {
    if (!previewNeedsMeetingVbg) {
      setVbgEngineReady(false);
      if (meetingVbgRafRef.current) {
        cancelAnimationFrame(meetingVbgRafRef.current);
        meetingVbgRafRef.current = 0;
      }
      meetingSegmenterRef.current?.close();
      meetingSegmenterRef.current = null;
      return;
    }

    let cancelled = false;
    let raf = 0;

    (async () => {
      try {
        const seg = await createLobbyImageSegmenter();
        if (cancelled) {
          seg.close();
          return;
        }
        meetingSegmenterRef.current = seg;
        setVbgEngineReady(true);

        const loop = (t: number) => {
          if (cancelled) return;
          const video = localVideoRef.current;
          const canvas = meetingVbgCanvasRef.current;
          const { previewBlur: pb } = meetingVbgPaintRef.current;
          if (seg && video && canvas && video.readyState >= 2) {
            paintLobbyVirtualBackground({
              segmenter: seg,
              video,
              out: canvas,
              mode: pb ? 'blur' : 'image',
              bgImage: meetingBgImageRef.current,
              timestamp: t,
            });
          }
          raf = requestAnimationFrame(loop);
          meetingVbgRafRef.current = raf;
        };
        raf = requestAnimationFrame(loop);
        meetingVbgRafRef.current = raf;
      } catch {
        if (!cancelled) setVbgEngineReady(false);
      }
    })();

    return () => {
      cancelled = true;
      if (meetingVbgRafRef.current) {
        cancelAnimationFrame(meetingVbgRafRef.current);
        meetingVbgRafRef.current = 0;
      }
      meetingSegmenterRef.current?.close();
      meetingSegmenterRef.current = null;
      setVbgEngineReady(false);
    };
  }, [previewNeedsMeetingVbg]);

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

        setParticipants((prev) => {
          const prevSelf = prev.find((p) => p.id === 'self');
          const self: Participant = {
            id: 'self',
            name: currentUserName,
            isMuted: prevSelf?.isMuted ?? false,
            isVideoOff: prevSelf?.isVideoOff ?? false,
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
          return [self, other];
        });

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

  useEffect(() => {
    const t = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(t);
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

          const lobbyIntent = consumeLobbyMediaIntent();
          if (lobbyIntent) {
            stream.getAudioTracks().forEach((t) => {
              t.enabled = !lobbyIntent.muted;
            });
            stream.getVideoTracks().forEach((t) => {
              t.enabled = !lobbyIntent.videoOff;
            });
            setIsMuted(lobbyIntent.muted);
            setIsVideoOff(lobbyIntent.videoOff);
            setParticipants((prev) =>
              prev.map((p) =>
                p.id === 'self'
                  ? { ...p, isMuted: lobbyIntent.muted, isVideoOff: lobbyIntent.videoOff }
                  : p,
              ),
            );
          } else {
            const liveA = stream.getAudioTracks().find((t) => t.readyState === 'live');
            const liveV = stream.getVideoTracks().find((t) => t.readyState === 'live');
            setIsMuted(!liveA || !liveA.enabled);
            setIsVideoOff(!liveV || !liveV.enabled);
          }
          setHasLocalStream(true);
          void localVideoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setSnackbar({ open: true, message: 'Error accessing media devices.' });
      }
    };
    initMedia();
  }, []);

  const getLocalStream = useCallback((): MediaStream | null => {
    return (localVideoRef.current?.srcObject as MediaStream | null) ?? null;
  }, []);

  const applyTrackStates = useCallback((nextMuted: boolean, nextVideoOff: boolean) => {
    const stream = getLocalStream();
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => { track.enabled = !nextMuted; });
    stream.getVideoTracks().forEach((track) => { track.enabled = !nextVideoOff; });
  }, [getLocalStream]);

  const syncSelfMediaFlags = useCallback((muted: boolean, videoOff: boolean) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === 'self' ? { ...p, isMuted: muted, isVideoOff: videoOff } : p))
    );
  }, []);

  const toggleMute = async () => {
    const nextMuted = !isMuted;
    let stream = getLocalStream();
    if (!stream) {
      setSnackbar({ open: true, message: 'No media yet. Allow camera/microphone and try again.' });
      return;
    }
    try {
      if (!nextMuted) {
        const hasLiveAudio = stream.getAudioTracks().some((t) => t.readyState === 'live');
        if (!hasLiveAudio) {
          const audioOnly = await navigator.mediaDevices.getUserMedia({
            audio: selectedMic ? { deviceId: { exact: selectedMic } } : true,
          });
          audioOnly.getAudioTracks().forEach((track) => stream!.addTrack(track));
          stream = getLocalStream();
        }
      }
      if (stream) {
        stream.getAudioTracks().forEach((track) => {
          track.enabled = !nextMuted;
        });
      }
      setIsMuted(nextMuted);
      syncSelfMediaFlags(nextMuted, isVideoOff);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Could not change microphone.' });
    }
  };

  const toggleVideo = async () => {
    const nextVideoOff = !isVideoOff;
    let stream = getLocalStream();
    if (!stream) {
      setSnackbar({ open: true, message: 'No media yet. Allow camera/microphone and try again.' });
      return;
    }
    try {
      if (!nextVideoOff) {
        const hasLiveVideo = stream.getVideoTracks().some((t) => t.readyState === 'live');
        if (!hasLiveVideo) {
          const vid = await navigator.mediaDevices.getUserMedia({
            video: selectedCam ? { deviceId: { exact: selectedCam } } : true,
          });
          vid.getVideoTracks().forEach((track) => stream!.addTrack(track));
          stream = getLocalStream();
          if (localVideoRef.current && stream) {
            localVideoRef.current.srcObject = stream;
            setHasLocalStream(true);
            void localVideoRef.current.play().catch(() => {});
          }
        }
      }
      if (stream) {
        stream.getVideoTracks().forEach((track) => {
          track.enabled = !nextVideoOff;
        });
      }
      setIsVideoOff(nextVideoOff);
      syncSelfMediaFlags(isMuted, nextVideoOff);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Could not change camera.' });
    }
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
        setHasLocalStream(true);
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

  const pickRecorderMimeType = useCallback((): string => {
    const candidates = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];
    for (const t of candidates) {
      if (MediaRecorder.isTypeSupported(t)) return t;
    }
    return '';
  }, []);

  const stopRecordingInternal = useCallback(() => {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== 'inactive') {
      rec.stop();
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecordingInternal();
      return;
    }

    const stream = getLocalStream();
    if (!stream || !stream.getTracks().some((t) => t.readyState === 'live')) {
      setSnackbar({ open: true, message: 'Turn on camera or mic and allow access before recording.' });
      return;
    }

    recordedChunksRef.current = [];
    const mimeType = pickRecorderMimeType();
    try {
      const rec = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = rec;
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      rec.onerror = (ev) => {
        console.error('MediaRecorder error', ev);
        setIsRecording(false);
        mediaRecorderRef.current = null;
        setSnackbar({ open: true, message: 'Recording error. Try again.' });
      };
      rec.onstop = () => {
        const chunks = recordedChunksRef.current;
        recordedChunksRef.current = [];
        mediaRecorderRef.current = null;
        setIsRecording(false);
        if (chunks.length === 0) {
          setSnackbar({ open: true, message: 'No recording data captured.' });
          return;
        }
        const blob = new Blob(chunks, { type: rec.mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const safeRoom = (roomId || 'meeting').replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 48);
        a.href = url;
        a.download = `vertechie-${safeRoom}-${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setSnackbar({ open: true, message: 'Recording saved — check your Downloads folder.' });
      };
      rec.start(1000);
      setIsRecording(true);
      setSnackbar({ open: true, message: 'Recording… Stop from the menu when done.' });
    } catch (err) {
      console.error('Recording start failed', err);
      setSnackbar({ open: true, message: 'Could not start recording in this browser.' });
    }
  }, [getLocalStream, isRecording, pickRecorderMimeType, stopRecordingInternal, roomId]);

  useEffect(() => {
    return () => {
      const rec = mediaRecorderRef.current;
      if (rec && rec.state !== 'inactive') {
        rec.stop();
      }
    };
  }, []);

  const endCall = () => {
    stopRecordingInternal();
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
      senderId: 'self',
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

  /** CSS fallback when MediaPipe canvas is not ready yet */
  const selfVideoFilter =
    showMeetingCanvasVbg || resolvedMeetingVbg.mode === 'none'
      ? 'none'
      : resolvedMeetingVbg.mode === 'blur'
        ? 'blur(2px)'
        : 'brightness(0.75) saturate(1.12)';

  const localTimeStr = new Date(nowTick).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  const meetRoundBtnSx = {
    width: 48,
    height: 48,
    bgcolor: 'rgba(255,255,255,0.1)',
    color: 'white',
    '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' },
  } as const;

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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
          <Tooltip title="Meeting details">
            <IconButton onClick={() => setShowMeetingInfo(true)} sx={{ color: 'white' }}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </TopBar>

      {/* Main stage + right rail (chat / people): full-width video; rail opens beside — Google Meet–style */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden',
          gap: { xs: 0, md: rightPanel !== 'none' ? 2 : 0 },
          px: { md: rightPanel !== 'none' ? 1 : 0 },
          py: { md: rightPanel !== 'none' ? 1 : 0 },
          transition: 'padding 0.2s ease, gap 0.2s ease',
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: {
              xs: rightPanel !== 'none' ? 2 : 0,
              md: rightPanel !== 'none' ? '12px 0 0 12px' : 0,
            },
            transition: 'border-radius 0.2s ease',
            boxSizing: 'border-box',
          }}
        >
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
              <>
                {/*
                  Single persistent <video> for stream + MediaPipe (custom / image / blur VBG).
                  Swapping two video nodes moved localVideoRef to an unprimed element → blank canvas.
                */}
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)',
                    display: isVideoOff ? 'none' : 'block',
                    opacity: !isVideoOff && showMeetingCanvasVbg ? 0 : 1,
                    filter: !isVideoOff && showMeetingCanvasVbg ? 'none' : selfVideoFilter,
                    zIndex: 0,
                  }}
                />
                {!isVideoOff && showMeetingCanvasVbg && (
                  <Box
                    component="canvas"
                    ref={meetingVbgCanvasRef}
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scaleX(-1)',
                      zIndex: 1,
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </>
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  p: 2,
                  background: 'linear-gradient(135deg, #1e1e2d 0%, #2d2d44 100%)',
                }}
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: 48,
                    bgcolor: participant.role === 'candidate' ? '#ff9800' : '#0d47a1',
                  }}
                >
                  {participant.name.charAt(0)}
                </Avatar>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 220 }}>
                  {participant.isVideoOff ? 'Camera off' : 'Waiting to connect'}
                </Typography>
              </Box>
            )}

            {/* Video off: show same static / blur BG as lobby so it never looks blank */}
            {participant.id === 'self' && isVideoOff && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  p: 2,
                  ...(resolvedMeetingVbg.mode === 'image' && resolvedMeetingVbg.imageUrl
                    ? {
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url(${resolvedMeetingVbg.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : resolvedMeetingVbg.mode === 'blur'
                      ? {
                          background: 'linear-gradient(135deg, #2d2d3d 0%, #1a1a28 100%)',
                          backdropFilter: 'blur(8px)',
                        }
                      : {
                          background: 'linear-gradient(135deg, #1e1e2d 0%, #2d2d44 100%)',
                        }),
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
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.95)',
                    fontWeight: 600,
                    textShadow: '0 1px 6px rgba(0,0,0,0.85)',
                  }}
                >
                  Camera is off
                </Typography>
              </Box>
            )}

            {/* Participant Info */}
            <ParticipantName>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                {participant.name}
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
        </Box>

        {rightPanel !== 'none' && (
          <Box
            component="aside"
            aria-label={rightPanel === 'chat' ? 'In-call messages' : 'Participants'}
            sx={{
              flex: { xs: '0 0 auto', md: '0 0 min(400px, 32vw)' },
              width: { xs: '100%', md: 'min(400px, 32vw)' },
              minWidth: { md: 280 },
              maxHeight: { xs: 'min(50vh, 440px)', md: 'none' },
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#2d2e30',
              backdropFilter: 'blur(12px)',
              borderTop: { xs: '1px solid rgba(255,255,255,0.1)', md: 'none' },
              borderRadius: {
                xs: 2,
                md: '0 12px 12px 0',
              },
              boxShadow: { md: '0 2px 12px rgba(0,0,0,0.45)' },
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                {rightPanel === 'chat' ? 'In-call messages' : `People (${participants.length})`}
              </Typography>
              <IconButton
                onClick={() => setRightPanel('none')}
                sx={{ color: 'rgba(255,255,255,0.85)' }}
                aria-label="Close panel"
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {rightPanel === 'chat' && (
              <>
                <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}>
                  {chatMessages.map((msg) => (
                    <Box key={msg.id}>
                      {msg.type === 'system' ? (
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', display: 'block' }}>
                          {msg.content}
                        </Typography>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          {msg.senderId !== 'self' && (
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5 }}>
                              {msg.senderName}
                            </Typography>
                          )}
                          <MessageBubble isMine={msg.senderId === 'self'}>
                            <Typography variant="body2">{msg.content}</Typography>
                          </MessageBubble>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'rgba(255,255,255,0.3)',
                              mt: 0.5,
                              alignSelf: msg.senderId === 'self' ? 'flex-end' : 'flex-start',
                            }}
                          >
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
                <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 1, flexShrink: 0 }}>
                  <TextField
                    fullWidth
                    placeholder="Send a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.06)',
                        borderRadius: 3,
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                      },
                    }}
                  />
                  <IconButton onClick={sendMessage} sx={{ color: '#8ab4f8' }}>
                    <SendIcon />
                  </IconButton>
                </Box>
              </>
            )}

            {rightPanel === 'people' && (
              <List sx={{ flex: 1, p: 1, overflowY: 'auto', minHeight: 0 }}>
                {participants.map((p) => (
                  <ListItem key={p.id} sx={{ borderRadius: 2, mb: 1, bgcolor: 'rgba(255,255,255,0.04)' }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: p.role === 'candidate' ? '#ff9800' : '#0d47a1' }}>
                        {p.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ color: 'white', fontWeight: 500 }}>{p.name}</Typography>}
                      secondary={<Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{p.role}</Typography>}
                    />
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {p.isMuted && <MicOffIcon sx={{ fontSize: 18, color: '#ff4444' }} />}
                      {p.isVideoOff && <VideocamOffIcon sx={{ fontSize: 18, color: '#ff4444' }} />}
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </Box>

      {/* Meet-style bottom bar: time + code | controls | tools */}
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          py: 1.25,
          px: { xs: 1, sm: 2 },
          bgcolor: '#202124',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          zIndex: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>
            {localTimeStr}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontSize: '0.8rem' }}
            noWrap
          >
            {formatMeetCode(roomId)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            flex: '1 1 280px',
            flexWrap: 'wrap',
          }}
        >
          <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
            <IconButton onClick={toggleMute} sx={{ ...meetRoundBtnSx, bgcolor: !isMuted ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.1)' }}>
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}>
            <IconButton
              onClick={toggleVideo}
              sx={{
                ...meetRoundBtnSx,
                bgcolor: isVideoOff ? '#ea4335' : 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: isVideoOff ? '#d93025' : 'rgba(255,255,255,0.18)' },
              }}
            >
              {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Reactions">
            <IconButton onClick={(e) => setReactionMenuAnchor(e.currentTarget)} sx={meetRoundBtnSx}>
              <EmojiEmotionsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={isScreenSharing ? 'Stop presenting' : 'Present now'}>
            <IconButton
              onClick={toggleScreenShare}
              sx={{
                ...meetRoundBtnSx,
                bgcolor: isScreenSharing ? 'rgba(26, 115, 232, 0.35)' : 'rgba(255,255,255,0.1)',
              }}
            >
              {isScreenSharing ? <StopScreenShareIcon /> : <PresentToAllIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={handRaised ? 'Lower hand' : 'Raise hand'}>
            <IconButton
              onClick={() => setHandRaised(!handRaised)}
              sx={{
                ...meetRoundBtnSx,
                bgcolor: handRaised ? 'rgba(255, 193, 7, 0.25)' : 'rgba(255,255,255,0.1)',
              }}
            >
              <HandIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="More options">
            <IconButton onClick={(e) => setMoreMenuAnchor(e.currentTarget)} sx={meetRoundBtnSx}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="error"
            onClick={endCall}
            startIcon={<CallEndIcon />}
            sx={{
              borderRadius: 999,
              px: 2.5,
              py: 1,
              ml: 0.5,
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: '#ea4335',
              '&:hover': { bgcolor: '#d93025' },
            }}
          >
            Leave
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          <Tooltip title="Meeting details">
            <IconButton onClick={() => setShowMeetingInfo(true)} sx={{ color: 'rgba(255,255,255,0.85)' }}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={rightPanel === 'people' ? 'Hide people' : 'Show people'}>
            <IconButton
              onClick={() => setRightPanel((p) => (p === 'people' ? 'none' : 'people'))}
              sx={{ color: rightPanel === 'people' ? '#8ab4f8' : 'rgba(255,255,255,0.85)' }}
            >
              <Badge badgeContent={participants.length} color="primary" max={99}>
                <PeopleIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title={rightPanel === 'chat' ? 'Hide chat' : 'Open chat'}>
            <IconButton
              onClick={() => setRightPanel((p) => (p === 'chat' ? 'none' : 'chat'))}
              sx={{ color: rightPanel === 'chat' ? '#8ab4f8' : 'rgba(255,255,255,0.85)' }}
            >
              <ChatIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

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

      {/* Meeting info (Meet-style) */}
      <Dialog
        open={showMeetingInfo}
        onClose={() => setShowMeetingInfo(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#2d2d2d', color: 'white', borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Meeting details</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mb: 1 }}>
            Title
          </Typography>
          <Typography sx={{ mb: 2 }}>{meetingTitle}</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mb: 1 }}>
            Meeting code
          </Typography>
          <Typography sx={{ fontFamily: 'monospace', mb: 2 }}>{formatMeetCode(roomId)}</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mb: 1 }}>
            Call duration
          </Typography>
          <Typography sx={{ mb: 2, fontFamily: 'monospace' }}>{formatDuration(meetingDuration)}</Typography>
          <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={copyMeetingLink} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.35)' }}>
            Copy joining link
          </Button>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowMeetingInfo(false)} sx={{ color: 'white' }}>
            Close
          </Button>
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
        <MenuItem onClick={() => { toggleRecording(); setMoreMenuAnchor(null); }}>
          <FiberManualRecordIcon sx={{ mr: 1, color: isRecording ? '#ff4444' : 'inherit' }} />
          {isRecording ? 'Stop recording' : 'Start recording'}
        </MenuItem>
        {isInterview && (
          <Box>
            <Divider />
            <MenuItem onClick={() => { setShowNotes(true); setMoreMenuAnchor(null); }}>
              <AssignmentIcon sx={{ mr: 1, color: '#42a5f5' }} /> Interview Notes & Rating
            </MenuItem>
            <MenuItem onClick={() => { handleCancelFromCall(); setMoreMenuAnchor(null); }} sx={{ color: '#ff4444' }}>
              <CancelIcon sx={{ mr: 1 }} /> Cancel Interview
            </MenuItem>
          </Box>
        )}
        <Divider />
        <MenuItem onClick={() => { setShowSettings(true); setMoreMenuAnchor(null); }}>
          <SettingsIcon sx={{ mr: 1 }} /> Settings
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
