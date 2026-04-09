/**
 * MeetingLobby - Pre-meeting setup and device testing
 * 
 * Features:
 * - Camera/microphone preview
 * - Device selection
 * - Audio/video testing
 * - Virtual background selection
 * - Join meeting controls
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import type { ImageSegmenter } from '@mediapipe/tasks-vision';
import {
  createLobbyImageSegmenter,
  paintLobbyVirtualBackground,
} from '../../utils/lobbySelfieBackground';
import { api } from '../../services/apiClient';
import {
  VIRTUAL_BACKGROUNDS,
  VBG_SESSION_CUSTOM_KEY,
  VBG_SESSION_ID_KEY,
  LOBBY_MEDIA_INTENT_KEY,
  resetLobbyVbgConsumptionCache,
  resetLobbyMediaIntentCache,
} from '../../constants/virtualBackgrounds';
import {
  Box,
  Typography,
  Button,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import SettingsIcon from '@mui/icons-material/Settings';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SecurityIcon from '@mui/icons-material/Security';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

// Styled Components
const LobbyContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
});

const PreviewCard = styled(Paper)({
  borderRadius: 24,
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
});

const VideoPreview = styled(Box)({
  position: 'relative',
  width: '100%',
  aspectRatio: '16/9',
  borderRadius: 16,
  overflow: 'hidden',
  background: '#3c4043',
});

/** Meet-style: gray when device on, red when muted / camera off */
const MeetLobbyToggle = styled(IconButton, {
  shouldForwardProp: (p) => p !== '$deviceOn',
})<{ $deviceOn: boolean }>(({ $deviceOn }) => ({
  width: 56,
  height: 56,
  padding: 0,
  borderRadius: '50%',
  backgroundColor: $deviceOn ? '#3c4043' : '#ea4335',
  color: '#fff',
  transition: 'background-color 0.2s ease, transform 0.15s ease',
  '&:hover': {
    backgroundColor: $deviceOn ? '#5f6368' : '#d93025',
    transform: 'scale(1.04)',
  },
}));

const DeviceSelect = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    borderRadius: 12,
    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&.Mui-focused fieldset': { borderColor: '#0d47a1' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' },
});

const BackgroundOption = styled(Box)<{ selected?: boolean }>(({ selected }) => ({
  width: 60,
  height: 40,
  borderRadius: 8,
  cursor: 'pointer',
  border: selected ? '2px solid #0d47a1' : '2px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: 'rgba(13, 71, 161, 0.5)',
  },
}));

const JoinButton = styled(Button)({
  height: 56,
  borderRadius: 16,
  fontSize: '1.1rem',
  fontWeight: 700,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
  boxShadow: '0 8px 32px rgba(13, 71, 161, 0.4)',
  '&:hover': {
    background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(13, 71, 161, 0.5)',
  },
});

const MeetingLobby: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const segmenterRef = useRef<ImageSegmenter | null>(null);
  const vbgRafRef = useRef<number>(0);
  const vbgPaintRef = useRef({
    previewBlur: false,
    previewBgImageUrl: null as string | null,
  });

  // State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [speakerDevices, setSpeakerDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('none');
  /** Data URL from user upload — used when selectedBackground === 'custom' */
  const [customBackgroundDataUrl, setCustomBackgroundDataUrl] = useState<string | null>(null);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<'system' | 'user' | 'unknown' | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);
  const [userName, setUserName] = useState('John Doe');

  // Meeting info from URL params (fallbacks until API loads)
  const meetingType = searchParams.get('type') || 'meeting';
  const titleFromUrl = searchParams.get('title') ? decodeURIComponent(searchParams.get('title')!) : '';
  const [meetingTitle, setMeetingTitle] = useState(titleFromUrl || 'Meeting');
  const [meetingTime, setMeetingTime] = useState(searchParams.get('time') || '');
  const [candidateName, setCandidateName] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [interviewTypeLabel, setInterviewTypeLabel] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState<number | null>(null);

  const interviewId = searchParams.get('interviewId') || roomId || '';
  const isUuidInterviewId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(interviewId);

  // Set title from URL on mount (API may override)
  useEffect(() => {
    if (titleFromUrl) setMeetingTitle(titleFromUrl);
  }, [titleFromUrl]);

  // Load current user display name from localStorage so lobby shows real name
  useEffect(() => {
    try {
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        const user = JSON.parse(userDataStr);
        const first = user.first_name || '';
        const last = user.last_name || '';
        const name = `${first} ${last}`.trim() || user.email?.split('@')[0] || 'You';
        setUserName(name);
      }
    } catch {
      // keep default
    }
  }, []);

  // Fetch real interview details when joining from ATS (uses api client so 401 triggers refresh-token and retry, not immediate redirect to login)
  useEffect(() => {
    if (!interviewId || !isUuidInterviewId || meetingType !== 'interview') return;
    const fetchInterview = async () => {
      try {
        const data = await api.get<{
          candidate_name?: string;
          job_title?: string | null;
          interview_type?: string;
          scheduled_at?: string;
          interviewers?: string[];
        }>(`/hiring/interviews/${interviewId}`);
        const candidate = data.candidate_name || 'Candidate';
        const job = data.job_title || null;
        const typeVal = data.interview_type;
        const label = typeVal ? String(typeVal).replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : null;
        setMeetingTitle(`${label || 'Interview'} - ${candidate}`);
        setCandidateName(candidate);
        setJobTitle(job);
        setInterviewTypeLabel(label);
        // Real participant count: 1 candidate + number of interviewers
        const interviewerCount = Array.isArray(data.interviewers) ? data.interviewers.length : 1;
        setParticipantCount(1 + interviewerCount);
        if (data.scheduled_at) {
          try {
            let dateStr = data.scheduled_at;
            if (typeof dateStr === 'string' && !dateStr.includes('Z') && !dateStr.includes('+')) {
              dateStr = dateStr.replace(' ', 'T').replace(/\.000000$/, '') + 'Z';
            }
            const d = new Date(dateStr);
            if (!Number.isNaN(d.getTime())) {
              setMeetingTime(d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
            }
          } catch {
            setMeetingTime('');
          }
        }
      } catch (err) {
        console.error('Error fetching interview details:', err);
        if (titleFromUrl) setMeetingTitle(titleFromUrl);
      }
    };
    fetchInterview();
  }, [interviewId, isUuidInterviewId, meetingType, titleFromUrl]);

  // Initialize media devices
  useEffect(() => {
    const initDevices = async () => {
      try {
        // Try to get both video and audio first
        let mediaStream: MediaStream;
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } catch (initialErr: any) {
          console.warn('Full media access failed, trying partial or handling error:', initialErr);

          if (initialErr.name === 'NotAllowedError' || initialErr.name === 'PermissionDeniedError') {
            // Check if it's a system-level block (common on modern OS/browsers)
            if (initialErr.message?.includes('system') || initialErr.message?.includes('OS')) {
              setPermissionError('system');
            } else {
              setPermissionError('user');
            }

            // Try to get at least one if possible (sometimes one is blocked and the other isn't)
            try {
              mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
              setIsVideoOff(true);
              setError('Camera access denied. Joining with audio only.');
            } catch (audioErr) {
              try {
                mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                setIsMuted(true);
                setError('Microphone access denied. Joining with video only.');
              } catch (videoErr) {
                throw initialErr; // Both failed, throw the original error
              }
            }
          } else if (initialErr.name === 'NotFoundError' || initialErr.name === 'DevicesNotFoundError') {
            setError('No camera or microphone found on this device.');
            throw initialErr;
          } else {
            throw initialErr;
          }
        }

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        // Get available devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        setAudioDevices(devices.filter(d => d.kind === 'audioinput'));
        setVideoDevices(devices.filter(d => d.kind === 'videoinput'));
        setSpeakerDevices(devices.filter(d => d.kind === 'audiooutput'));

        // Set defaults
        const defaultAudio = devices.find(d => d.kind === 'audioinput' && d.deviceId === 'default') || devices.find(d => d.kind === 'audioinput');
        const defaultVideo = devices.find(d => d.kind === 'videoinput');
        if (defaultAudio) setSelectedAudioDevice(defaultAudio.deviceId);
        if (defaultVideo) setSelectedVideoDevice(defaultVideo.deviceId);

      } catch (err: any) {
        console.error('Error accessing media devices:', err);
        if (err.name === 'NotAllowedError') {
          setError('Camera/Microphone permission denied. You can still join the meeting but others won\'t see or hear you.');
        } else {
          setError('Could not access camera or microphone. Please check your connection.');
        }
      }
    };

    initDevices();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !nextMuted;
      });
    }
    setIsMuted(nextMuted);
  };

  const toggleVideo = () => {
    const nextVideoOff = !isVideoOff;
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !nextVideoOff;
      });
    }
    setIsVideoOff(nextVideoOff);
  };

  // When camera is turned back on, the <video> element is re-mounted and needs the stream reattached
  useEffect(() => {
    if (!isVideoOff && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isVideoOff, stream]);

  const activeVbg = VIRTUAL_BACKGROUNDS.find((b) => b.id === selectedBackground);
  const previewBgImageUrl =
    selectedBackground === 'custom' && customBackgroundDataUrl
      ? customBackgroundDataUrl
      : activeVbg?.type === 'image' && activeVbg.url
        ? activeVbg.url
        : null;
  const previewBlur = selectedBackground === 'blur';
  const previewNeedsVbg = Boolean(
    stream && !isVideoOff && (previewBgImageUrl || previewBlur),
  );

  useEffect(() => {
    vbgPaintRef.current = { previewBlur, previewBgImageUrl };
  }, [previewBlur, previewBgImageUrl]);

  useEffect(() => {
    if (!previewBgImageUrl) {
      bgImageRef.current = null;
      return;
    }
    const img = new Image();
    if (!previewBgImageUrl.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      bgImageRef.current = img;
    };
    img.onerror = () => {
      bgImageRef.current = null;
    };
    img.src = previewBgImageUrl;
  }, [previewBgImageUrl]);

  const [vbgEngineReady, setVbgEngineReady] = useState(false);

  useEffect(() => {
    if (!previewNeedsVbg) {
      setVbgEngineReady(false);
      if (vbgRafRef.current) {
        cancelAnimationFrame(vbgRafRef.current);
        vbgRafRef.current = 0;
      }
      segmenterRef.current?.close();
      segmenterRef.current = null;
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
        segmenterRef.current = seg;
        setVbgEngineReady(true);

        const loop = (t: number) => {
          if (cancelled) return;
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const { previewBlur: pb } = vbgPaintRef.current;
          if (seg && video && canvas && video.readyState >= 2) {
            paintLobbyVirtualBackground({
              segmenter: seg,
              video,
              out: canvas,
              mode: pb ? 'blur' : 'image',
              bgImage: bgImageRef.current,
              timestamp: t,
            });
          }
          raf = requestAnimationFrame(loop);
          vbgRafRef.current = raf;
        };
        raf = requestAnimationFrame(loop);
        vbgRafRef.current = raf;
      } catch {
        if (!cancelled) setVbgEngineReady(false);
      }
    })();

    return () => {
      cancelled = true;
      if (vbgRafRef.current) {
        cancelAnimationFrame(vbgRafRef.current);
        vbgRafRef.current = 0;
      }
      segmenterRef.current?.close();
      segmenterRef.current = null;
      setVbgEngineReady(false);
    };
  }, [previewNeedsVbg]);

  const testAudio = () => {
    setIsTestingAudio(true);
    const audio = new Audio('/test-audio.mp3');
    audio.play().catch(() => {
      // Fallback - just show testing indicator
    });
    setTimeout(() => setIsTestingAudio(false), 2000);
  };

  const joinMeeting = () => {
    setJoining(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', meetingType);
    if (!params.has('interviewId') && roomId) {
      params.set('interviewId', roomId);
    }
    if (meetingTitle && !params.has('title')) {
      params.set('title', encodeURIComponent(meetingTitle));
    }
    try {
      resetLobbyVbgConsumptionCache();
      resetLobbyMediaIntentCache();
      sessionStorage.setItem(VBG_SESSION_ID_KEY, selectedBackground);
      if (selectedBackground === 'custom' && customBackgroundDataUrl) {
        sessionStorage.setItem(VBG_SESSION_CUSTOM_KEY, customBackgroundDataUrl);
      } else {
        sessionStorage.removeItem(VBG_SESSION_CUSTOM_KEY);
      }
      sessionStorage.setItem(
        LOBBY_MEDIA_INTENT_KEY,
        JSON.stringify({ muted: isMuted, videoOff: isVideoOff }),
      );
    } catch {
      // ignore
    }
    // Keep tracks alive until navigate so "Camera/Mic ready" stay green during "Joining…"
    setTimeout(() => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      navigate(`/techie/meet/${roomId}?${params.toString()}`);
    }, 1000);
  };

  const showCanvasVbg = previewNeedsVbg && vbgEngineReady;

  return (
    <LobbyContainer>
      <Grid container spacing={4} maxWidth={1200}>
        {/* Video Preview */}
        <Grid item xs={12} md={7}>
          <PreviewCard sx={{ p: 3 }}>
            <VideoPreview>
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 0,
                  overflow: 'hidden',
                  borderRadius: 'inherit',
                }}
              >
                {isVideoOff ? (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...(previewBgImageUrl
                        ? {
                            backgroundImage: `url(${previewBgImageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }
                        : { bgcolor: '#3c4043' }),
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'rgba(255,255,255,0.95)',
                        fontWeight: 400,
                        textShadow: '0 1px 10px rgba(0,0,0,0.85)',
                      }}
                    >
                      Camera is off
                    </Typography>
                  </Box>
                ) : showCanvasVbg ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0,
                        pointerEvents: 'none',
                        zIndex: 0,
                      }}
                    />
                    <canvas
                      ref={canvasRef}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scaleX(-1)',
                        zIndex: 1,
                      }}
                    />
                  </>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      transform: 'scaleX(-1)',
                      zIndex: 1,
                      display: 'block',
                    }}
                  />
                )}
              </Box>

              {/* Transparent layer so taps open background dialog (above video) */}
              {!permissionError && (
                <Box
                  onClick={() => setShowBackgroundDialog(true)}
                  aria-hidden
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    cursor: 'pointer',
                    borderRadius: 'inherit',
                  }}
                />
              )}

              {/* Top: name + overflow menu */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  p: 1.5,
                  zIndex: 5,
                  pointerEvents: 'none',
                  '& > *': { pointerEvents: 'auto' },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.95)',
                    fontWeight: 500,
                    textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                    maxWidth: '70%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {userName}
                </Typography>
                <Tooltip title="More options">
                  <IconButton
                    size="small"
                    onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                    sx={{
                      color: 'rgba(255,255,255,0.95)',
                      bgcolor: 'rgba(0,0,0,0.35)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Menu
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={() => setMenuAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  sx: {
                    bgcolor: '#2d2d2d',
                    color: 'rgba(255,255,255,0.95)',
                    borderRadius: 2,
                    minWidth: 200,
                    border: '1px solid rgba(255,255,255,0.12)',
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    setMenuAnchorEl(null);
                    setShowSettingsDialog(true);
                  }}
                >
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.85)' }} />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setMenuAnchorEl(null);
                    setShowBackgroundDialog(true);
                  }}
                >
                  <ListItemIcon>
                    <WallpaperIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.85)' }} />
                  </ListItemIcon>
                  <ListItemText>Background</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setMenuAnchorEl(null);
                    setShowHelpDialog(true);
                  }}
                >
                  <ListItemIcon>
                    <HelpOutlineIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.85)' }} />
                  </ListItemIcon>
                  <ListItemText>Help</ListItemText>
                </MenuItem>
              </Menu>

              {/* Error overlay if permissions failed */}
              {permissionError && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    textAlign: 'center',
                    zIndex: 6,
                  }}
                >
                  <ErrorIcon sx={{ color: '#ff4444', fontSize: 48, mb: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                    {permissionError === 'system' ? 'System Permission Denied' : 'Permission Denied'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                    {permissionError === 'system'
                      ? 'Your operating system or browser is blocking access to the camera/microphone.'
                      : 'You have blocked access to the camera or microphone in your browser.'}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => setShowPermissionDialog(true)}
                    sx={{ borderRadius: 2 }}
                  >
                    How to fix this?
                  </Button>
                </Box>
              )}

              {/* Mic / camera — bottom center inside preview */}
              {!permissionError && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 2,
                    zIndex: 4,
                  }}
                >
                  <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                    <MeetLobbyToggle
                      disableRipple
                      $deviceOn={!isMuted}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <MicOffIcon /> : <MicIcon />}
                    </MeetLobbyToggle>
                  </Tooltip>
                  <Tooltip title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}>
                    <MeetLobbyToggle
                      disableRipple
                      $deviceOn={!isVideoOff}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVideo();
                      }}
                      aria-label={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
                    >
                      {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
                    </MeetLobbyToggle>
                  </Tooltip>
                </Box>
              )}

              {/* Backgrounds & effects — bottom right (above tap layer; stopPropagation avoids double-toggle with parent) */}
              {!permissionError && (
                <IconButton
                  type="button"
                  title="Backgrounds and effects"
                  disableRipple
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBackgroundDialog(true);
                  }}
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    zIndex: 5,
                    width: 44,
                    height: 44,
                    bgcolor: 'rgba(0,0,0,0.55)',
                    color: 'rgba(255,255,255,0.95)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                  aria-label="Backgrounds and effects"
                >
                  <AutoAwesomeIcon sx={{ fontSize: 22 }} />
                </IconButton>
              )}
            </VideoPreview>

            {/* Device selection — Meet order: mic, speaker, camera */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <DeviceSelect fullWidth size="small">
                  <InputLabel>Microphone</InputLabel>
                  <Select
                    value={selectedAudioDevice}
                    onChange={(e) => setSelectedAudioDevice(e.target.value)}
                    label="Microphone"
                  >
                    {audioDevices.map((device) => (
                      <MenuItem key={device.deviceId} value={device.deviceId}>
                        {device.label || 'Microphone'}
                      </MenuItem>
                    ))}
                  </Select>
                </DeviceSelect>
              </Grid>
              <Grid item xs={12} md={4}>
                <DeviceSelect fullWidth size="small">
                  <InputLabel>Speaker</InputLabel>
                  <Select
                    value={selectedSpeaker}
                    onChange={(e) => setSelectedSpeaker(e.target.value)}
                    label="Speaker"
                  >
                    {speakerDevices.map((device) => (
                      <MenuItem key={device.deviceId} value={device.deviceId}>
                        {device.label || 'Speaker'}
                      </MenuItem>
                    ))}
                  </Select>
                </DeviceSelect>
              </Grid>
              <Grid item xs={12} md={4}>
                <DeviceSelect fullWidth size="small">
                  <InputLabel>Camera</InputLabel>
                  <Select
                    value={selectedVideoDevice}
                    onChange={(e) => setSelectedVideoDevice(e.target.value)}
                    label="Camera"
                  >
                    {videoDevices.map((device) => (
                      <MenuItem key={device.deviceId} value={device.deviceId}>
                        {device.label || 'Camera'}
                      </MenuItem>
                    ))}
                  </Select>
                </DeviceSelect>
              </Grid>
            </Grid>
          </PreviewCard>
        </Grid>

        {/* Meeting Info & Join */}
        <Grid item xs={12} md={5}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Meeting Info Card */}
            <Card sx={{ bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                  {meetingTitle}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {meetingTime && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <EventIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Today at {meetingTime}
                      </Typography>
                    </Box>
                  )}
                  {candidateName && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PersonIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Candidate: {candidateName}
                      </Typography>
                    </Box>
                  )}
                  {jobTitle && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <GroupsIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Role: {jobTitle}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <GroupsIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {participantCount != null ? `${participantCount} participants expected` : '2 participants expected'}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<SecurityIcon />}
                    label="Encrypted"
                    size="small"
                    sx={{ bgcolor: 'rgba(0, 255, 136, 0.1)', color: '#00ff88' }}
                  />
                  {(meetingType === 'interview' || interviewTypeLabel) && (
                    <Chip
                      label={interviewTypeLabel || 'Interview Mode'}
                      size="small"
                      sx={{ bgcolor: 'rgba(255, 193, 7, 0.2)', color: '#ffc107' }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Pre-check Status */}
            <Card sx={{ bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                  Ready to Join?
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {stream?.getVideoTracks().some(t => t.readyState === 'live') ? (
                      <CheckCircleIcon sx={{ color: '#00ff88' }} />
                    ) : (
                      <ErrorIcon sx={{ color: '#ff4444' }} />
                    )}
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Camera ready</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {stream?.getAudioTracks().some(t => t.readyState === 'live') ? (
                      <CheckCircleIcon sx={{ color: '#00ff88' }} />
                    ) : (
                      <ErrorIcon sx={{ color: '#ff4444' }} />
                    )}
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Microphone ready</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircleIcon sx={{ color: '#00ff88' }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Network stable</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Join Button */}
            <JoinButton
              fullWidth
              variant="contained"
              size="large"
              onClick={joinMeeting}
              disabled={joining}
              startIcon={joining ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {joining ? 'Joining...' : 'Join Meeting'}
            </JoinButton>

            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
              By joining, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Permission Help Dialog */}
      <Dialog
        open={showPermissionDialog}
        onClose={() => setShowPermissionDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: '#1a1a2e',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
            maxWidth: 500
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon color="primary" />
          Fixing Device Permissions
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            {permissionError === 'system' ? 'Step 1: System Settings' : 'Step 1: Browser Settings'}
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {permissionError === 'system'
              ? (window.navigator.userAgent.includes('Windows')
                ? 'Go to Windows Settings > Privacy > Camera/Microphone and ensure "Allow apps to access your camera/microphone" is ON.'
                : 'Go to System Settings > Privacy & Security > Camera/Microphone and ensure your browser is allowed.')
              : 'Click the camera/lock icon in your browser address bar and select "Allow" for Camera and Microphone.'}
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Step 2: Refresh Page
          </Typography>
          <Typography variant="body2" paragraph sx={{ color: 'rgba(255,255,255,0.7)' }}>
            After changing the settings, refresh this page to try again.
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Can\'t fix it now?
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            You can still join the meeting. You will be able to see and hear others, but they won\'t see or hear you until permissions are granted.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowPermissionDialog(false)} sx={{ color: 'white' }}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ borderRadius: 2 }}
          >
            Refresh Page
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog - device selection and permission help */}
      <Dialog
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: '#1a1a2e',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
            minWidth: 360
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon color="primary" />
          Settings
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
            Camera, microphone & speaker
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DeviceSelect fullWidth size="small">
                <InputLabel>Microphone</InputLabel>
                <Select
                  value={selectedAudioDevice}
                  onChange={(e) => setSelectedAudioDevice(e.target.value)}
                  label="Microphone"
                >
                  {audioDevices.map((device) => (
                    <MenuItem key={device.deviceId} value={device.deviceId}>
                      {device.label || 'Microphone'}
                    </MenuItem>
                  ))}
                </Select>
              </DeviceSelect>
            </Grid>
            <Grid item xs={12}>
              <DeviceSelect fullWidth size="small">
                <InputLabel>Speaker</InputLabel>
                <Select
                  value={selectedSpeaker}
                  onChange={(e) => setSelectedSpeaker(e.target.value)}
                  label="Speaker"
                >
                  {speakerDevices.map((device) => (
                    <MenuItem key={device.deviceId} value={device.deviceId}>
                      {device.label || 'Speaker'}
                    </MenuItem>
                  ))}
                </Select>
              </DeviceSelect>
            </Grid>
            <Grid item xs={12}>
              <DeviceSelect fullWidth size="small">
                <InputLabel>Camera</InputLabel>
                <Select
                  value={selectedVideoDevice}
                  onChange={(e) => setSelectedVideoDevice(e.target.value)}
                  label="Camera"
                >
                  {videoDevices.map((device) => (
                    <MenuItem key={device.deviceId} value={device.deviceId}>
                      {device.label || 'Camera'}
                    </MenuItem>
                  ))}
                </Select>
              </DeviceSelect>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<VolumeUpIcon />}
              onClick={testAudio}
              disabled={isTestingAudio}
              sx={{ color: 'rgba(255,255,255,0.9)', borderColor: 'rgba(255,255,255,0.3)', alignSelf: 'flex-start' }}
            >
              {isTestingAudio ? 'Playing test sound…' : 'Test speaker'}
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<SecurityIcon />}
              onClick={() => {
                setShowSettingsDialog(false);
                setShowPermissionDialog(true);
              }}
              sx={{ color: 'rgba(255,255,255,0.9)', borderColor: 'rgba(255,255,255,0.3)', alignSelf: 'flex-start' }}
            >
              Troubleshoot camera / microphone
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowSettingsDialog(false)} sx={{ color: 'white' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Background — same options as sparkle button */}
      <Dialog
        open={showBackgroundDialog}
        onClose={() => setShowBackgroundDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: '#1a1a2e',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
            minWidth: 360,
            maxWidth: 480,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon color="primary" />
          Backgrounds and effects
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {selectedBackground !== 'none' && (
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', mb: 2, display: 'block' }}>
              Selected:{' '}
              {selectedBackground === 'custom'
                ? 'Custom image'
                : VIRTUAL_BACKGROUNDS.find((b) => b.id === selectedBackground)?.label ?? selectedBackground}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {VIRTUAL_BACKGROUNDS.map((bg) => (
              <Tooltip key={bg.id} title={bg.label}>
                <BackgroundOption
                  selected={selectedBackground === bg.id}
                  onClick={() => {
                    setSelectedBackground(bg.id);
                    setCustomBackgroundDataUrl(null);
                  }}
                  sx={{
                    background:
                      bg.type === 'none'
                        ? 'transparent'
                        : bg.type === 'blur'
                          ? 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))'
                          : `url(${bg.url}) center/cover`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: bg.type === 'none' ? '2px dashed rgba(255,255,255,0.3)' : undefined,
                  }}
                >
                  {bg.type === 'blur' && <BlurOnIcon sx={{ color: 'white' }} />}
                  {bg.type === 'none' && (
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      Off
                    </Typography>
                  )}
                </BackgroundOption>
              </Tooltip>
            ))}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              component="label"
              size="small"
              startIcon={<AddPhotoAlternateIcon />}
              sx={{ alignSelf: 'flex-start', color: 'white', borderColor: 'rgba(255,255,255,0.35)' }}
            >
              Upload custom image
              <input
                type="file"
                hidden
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f.size > 4 * 1024 * 1024) {
                    setError('Please choose an image under 4 MB');
                    e.target.value = '';
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => {
                    setCustomBackgroundDataUrl(reader.result as string);
                    setSelectedBackground('custom');
                    setError(null);
                  };
                  reader.readAsDataURL(f);
                  e.target.value = '';
                }}
              />
            </Button>
            {customBackgroundDataUrl && (
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                Custom image will apply in the meeting after you join.
              </Typography>
            )}
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', mt: 2, display: 'block' }}>
            Close this dialog to see the live preview. The lobby uses on-device person segmentation (MediaPipe)
            so only you stay sharp over the chosen background. First load may take a few seconds.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowBackgroundDialog(false)} sx={{ color: 'white' }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: '#1a1a2e',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
            maxWidth: 440,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <HelpOutlineIcon color="primary" />
          Help
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
            Use the microphone and camera buttons in the preview to mute or turn your camera off before you join.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
            Open <strong>Settings</strong> from the menu to pick your mic, speaker, and camera, or test your speaker.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Use <strong>Background</strong> or the effects icon to choose a virtual background for the meeting.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowHelpDialog(false)} sx={{ color: 'white' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </LobbyContainer>
  );
};

export default MeetingLobby;

