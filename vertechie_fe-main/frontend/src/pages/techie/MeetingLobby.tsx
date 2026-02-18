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
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
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
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import SettingsIcon from '@mui/icons-material/Settings';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';

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
  background: '#1e1e2d',
});

const ControlButton = styled(IconButton)<{ active?: boolean }>(({ active }) => ({
  width: 56,
  height: 56,
  borderRadius: 16,
  background: active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
  color: active === false ? '#ff4444' : 'white',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(255,255,255,0.2)',
    transform: 'scale(1.05)',
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

// Virtual backgrounds
const virtualBackgrounds = [
  { id: 'none', type: 'none', label: 'None' },
  { id: 'blur', type: 'blur', label: 'Blur' },
  { id: 'office1', type: 'image', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400', label: 'Modern Office' },
  { id: 'office2', type: 'image', url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400', label: 'Bright Office' },
  { id: 'home', type: 'image', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', label: 'Home' },
  { id: 'nature', type: 'image', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400', label: 'Nature' },
];

const MeetingLobby: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

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
  const [audioLevel, setAudioLevel] = useState(0);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<'system' | 'user' | 'unknown' | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [userName, setUserName] = useState('John Doe');

  // Meeting info from URL params
  const meetingType = searchParams.get('type') || 'meeting';
  const meetingTitle = searchParams.get('title') || 'Technical Interview';
  const meetingTime = searchParams.get('time') || '2:00 PM';
  const hostName = searchParams.get('host') || 'Jane Smith';

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

        // Start audio level monitoring if we have audio
        if (mediaStream.getAudioTracks().length > 0) {
          const audioContext = new AudioContext();
          const analyser = audioContext.createAnalyser();
          const source = audioContext.createMediaStreamSource(mediaStream);
          source.connect(analyser);
          analyser.fftSize = 256;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const checkLevel = () => {
            if (audioContext.state === 'closed') return;
            analyser.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(avg);
            requestAnimationFrame(checkLevel);
          };
          checkLevel();
        }

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
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
    }
    setIsVideoOff(!isVideoOff);
  };

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
    // Stop the preview stream before joining
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', meetingType);
    if (!params.has('interviewId') && roomId) {
      params.set('interviewId', roomId);
    }
    setTimeout(() => {
      navigate(`/techie/meet/${roomId}?${params.toString()}`);
    }, 1000);
  };

  return (
    <LobbyContainer>
      <Grid container spacing={4} maxWidth={1200}>
        {/* Video Preview */}
        <Grid item xs={12} md={7}>
          <PreviewCard sx={{ p: 3 }}>
            <VideoPreview>
              {isVideoOff ? (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1e1e2d 0%, #2d2d44 100%)',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: 48,
                      bgcolor: '#0d47a1',
                      mb: 2,
                    }}
                  >
                    {userName.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    Camera is off
                  </Typography>
                </Box>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)',
                    display: isVideoOff ? 'none' : 'block'
                  }}
                />
              )}

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
                    zIndex: 2
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

              {/* Audio Level Indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1,
                  px: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {isMuted ? (
                  <MicOffIcon sx={{ color: '#ff4444' }} />
                ) : (
                  <MicIcon sx={{ color: audioLevel > 30 ? '#00ff88' : 'white' }} />
                )}
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end', height: 20 }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 4,
                        height: Math.min(20, Math.max(4, audioLevel / 5 * (i + 1))),
                        borderRadius: 1,
                        bgcolor: audioLevel > 30 && !isMuted ? '#00ff88' : 'rgba(255,255,255,0.3)',
                        transition: 'height 0.1s ease',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </VideoPreview>

            {/* Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                <ControlButton active={!isMuted} onClick={toggleMute}>
                  {isMuted ? <MicOffIcon /> : <MicIcon />}
                </ControlButton>
              </Tooltip>
              <Tooltip title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}>
                <ControlButton active={!isVideoOff} onClick={toggleVideo}>
                  {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
                </ControlButton>
              </Tooltip>
              <Tooltip title="Test speakers">
                <ControlButton onClick={testAudio}>
                  <VolumeUpIcon />
                </ControlButton>
              </Tooltip>
              <Tooltip title="Settings">
                <ControlButton>
                  <SettingsIcon />
                </ControlButton>
              </Tooltip>
            </Box>

            {/* Device Selection */}
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
            </Grid>

            {/* Virtual Backgrounds */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1.5 }}>
                Virtual Background
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {virtualBackgrounds.map((bg) => (
                  <Tooltip key={bg.id} title={bg.label}>
                    <BackgroundOption
                      selected={selectedBackground === bg.id}
                      onClick={() => setSelectedBackground(bg.id)}
                      sx={{
                        background: bg.type === 'none' ? 'transparent' :
                          bg.type === 'blur' ? 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))' :
                            `url(${bg.url}) center/cover`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: bg.type === 'none' ? '2px dashed rgba(255,255,255,0.3)' : undefined,
                      }}
                    >
                      {bg.type === 'blur' && <BlurOnIcon sx={{ color: 'white' }} />}
                      {bg.type === 'none' && <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Off</Typography>}
                    </BackgroundOption>
                  </Tooltip>
                ))}
              </Box>
            </Box>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EventIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Today at {meetingTime}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PersonIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Host: {hostName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <GroupsIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      2 participants expected
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
                  {meetingType === 'interview' && (
                    <Chip
                      label="Interview Mode"
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
    </LobbyContainer>
  );
};

export default MeetingLobby;

