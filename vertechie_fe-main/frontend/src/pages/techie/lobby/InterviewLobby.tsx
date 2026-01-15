/**
 * InterviewLobby - Custom Video Meeting App for Interviews
 * Features: Video/Audio, Screen Share, Chat, Recording, Waiting Room
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, IconButton, Avatar, Paper, TextField, Badge,
  Tooltip, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemAvatar, ListItemText, Divider, Switch,
  FormControlLabel, Snackbar, Alert, Menu, MenuItem, Grid,
} from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';

// Icons
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import CallEndIcon from '@mui/icons-material/CallEnd';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import PanToolIcon from '@mui/icons-material/PanTool';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

const breathe = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.4); }
  50% { box-shadow: 0 0 0 20px rgba(52, 199, 89, 0); }
`;

// Styled Components
const MeetingContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  display: 'flex',
  flexDirection: 'column',
});

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 3),
  background: alpha('#000', 0.3),
  backdropFilter: 'blur(10px)',
  borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
}));

const VideoGrid = styled(Box)({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  gap: 16,
  flexWrap: 'wrap',
});

const VideoCard = styled(Paper)<{ isActive?: boolean; isMain?: boolean }>(({ isActive, isMain }) => ({
  position: 'relative',
  borderRadius: 16,
  overflow: 'hidden',
  background: '#2a2a3e',
  aspectRatio: '16/9',
  width: isMain ? '100%' : 'calc(50% - 8px)',
  maxWidth: isMain ? 800 : 400,
  minHeight: isMain ? 400 : 200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: isActive ? '3px solid #34C759' : '1px solid rgba(255,255,255,0.1)',
  boxShadow: isActive ? '0 0 30px rgba(52, 199, 89, 0.3)' : 'none',
  transition: 'all 0.3s ease',
}));

const ControlBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  background: alpha('#000', 0.5),
  backdropFilter: 'blur(20px)',
}));

const ControlButton = styled(IconButton)<{ isActive?: boolean; isEnd?: boolean }>(({ isActive, isEnd }) => ({
  width: 56,
  height: 56,
  backgroundColor: isEnd ? '#FF3B30' : isActive ? alpha('#fff', 0.2) : alpha('#fff', 0.1),
  color: '#fff',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: isEnd ? '#FF6B6B' : alpha('#fff', 0.3),
    transform: 'scale(1.1)',
  },
}));

const SidePanel = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  right: 0,
  top: 0,
  bottom: 0,
  width: 360,
  background: alpha('#1a1a2e', 0.95),
  backdropFilter: 'blur(20px)',
  borderLeft: `1px solid ${alpha('#fff', 0.1)}`,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1000,
}));

const ChatMessage = styled(Box)<{ isOwn?: boolean }>(({ isOwn }) => ({
  display: 'flex',
  flexDirection: isOwn ? 'row-reverse' : 'row',
  alignItems: 'flex-start',
  gap: 8,
  marginBottom: 12,
}));

const MessageBubble = styled(Box)<{ isOwn?: boolean }>(({ isOwn }) => ({
  maxWidth: '80%',
  padding: '10px 14px',
  borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
  background: isOwn ? '#0d47a1' : alpha('#fff', 0.1),
  color: '#fff',
}));

const RecordingIndicator = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 12px',
  borderRadius: 20,
  background: alpha('#FF3B30', 0.2),
  color: '#FF3B30',
  '& svg': {
    animation: `${pulse} 1s ease-in-out infinite`,
  },
});

const LobbyContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
});

const LobbyCard = styled(Paper)(({ theme }) => ({
  maxWidth: 500,
  width: '100%',
  padding: theme.spacing(4),
  borderRadius: 24,
  textAlign: 'center',
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(20px)',
}));

const PreviewVideo = styled(Box)({
  width: '100%',
  aspectRatio: '16/9',
  borderRadius: 16,
  background: '#1a1a2e',
  marginBottom: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
});

// Mock participants
const mockParticipants = [
  { id: '1', name: 'You', role: 'Candidate', avatar: '', isMuted: false, isVideoOn: true },
  { id: '2', name: 'John Smith', role: 'Technical Lead', avatar: '', isMuted: true, isVideoOn: true },
  { id: '3', name: 'Sarah Johnson', role: 'HR Manager', avatar: '', isMuted: false, isVideoOn: false },
];

// Mock chat messages
const initialMessages = [
  { id: '1', sender: 'John Smith', message: 'Welcome to the interview!', time: '10:00 AM', isOwn: false },
  { id: '2', sender: 'Sarah Johnson', message: 'We will start in a moment.', time: '10:01 AM', isOwn: false },
];

const InterviewLobby: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const meetingType = searchParams.get('type') || 'interview';
  const meetingTitle = searchParams.get('title') || 'Interview Session';

  // State
  const [isInLobby, setIsInLobby] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState(mockParticipants);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false, message: '', severity: 'info'
  });
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'speaker' | 'grid'>('speaker');
  const [meetingDuration, setMeetingDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Timer for meeting duration
  useEffect(() => {
    if (!isInLobby) {
      const timer = setInterval(() => {
        setMeetingDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isInLobby]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handlers
  const handleJoinMeeting = () => {
    setIsInLobby(false);
    setSnackbar({ open: true, message: 'You have joined the meeting', severity: 'success' });
  };

  const handleLeaveMeeting = () => {
    navigate(-1);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          sender: 'You',
          message: newMessage,
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          isOwn: true,
        },
      ]);
      setNewMessage('');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbar({ open: true, message: 'Meeting link copied to clipboard!', severity: 'success' });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(!isRecording);
    setSnackbar({ 
      open: true, 
      message: isRecording ? 'Recording stopped' : 'Recording started', 
      severity: 'info' 
    });
  };

  // Lobby View
  if (isInLobby) {
    return (
      <LobbyContainer>
        <LobbyCard elevation={24}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <HandshakeIcon sx={{ fontSize: 32, color: '#0d47a1' }} />
              <Typography variant="h5" fontWeight={700} color="primary">
                VerTechie Meet
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {meetingTitle}
            </Typography>
            <Chip 
              icon={<AccessTimeIcon />} 
              label={`Meeting ID: ${meetingId}`} 
              variant="outlined" 
              size="small"
            />
          </Box>

          <PreviewVideo>
            {isVideoOn ? (
              <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Avatar sx={{ width: 120, height: 120, fontSize: '3rem', bgcolor: '#0d47a1' }}>
                  Y
                </Avatar>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', color: '#fff' }}>
                <VideocamOffIcon sx={{ fontSize: 64, opacity: 0.5 }} />
                <Typography variant="body2" sx={{ opacity: 0.7 }}>Camera is off</Typography>
              </Box>
            )}
            <Box sx={{ 
              position: 'absolute', 
              bottom: 16, 
              left: '50%', 
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
            }}>
              <IconButton 
                onClick={() => setIsMuted(!isMuted)}
                sx={{ 
                  bgcolor: isMuted ? '#FF3B30' : alpha('#000', 0.5),
                  color: '#fff',
                  '&:hover': { bgcolor: isMuted ? '#FF6B6B' : alpha('#000', 0.7) },
                }}
              >
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
              <IconButton 
                onClick={() => setIsVideoOn(!isVideoOn)}
                sx={{ 
                  bgcolor: !isVideoOn ? '#FF3B30' : alpha('#000', 0.5),
                  color: '#fff',
                  '&:hover': { bgcolor: !isVideoOn ? '#FF6B6B' : alpha('#000', 0.7) },
                }}
              >
                {isVideoOn ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>
            </Box>
          </PreviewVideo>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Ready to join?
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <SecurityIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="success.main">
                End-to-end encrypted
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ borderRadius: 3 }}
            >
              Go Back
            </Button>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleJoinMeeting}
              sx={{ 
                px: 4, 
                py: 1.5, 
                borderRadius: 3,
                bgcolor: '#0d47a1',
                animation: `${breathe} 2s ease-in-out infinite`,
              }}
            >
              Join Now
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              size="small" 
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyLink}
            >
              Copy Invite Link
            </Button>
            <Button 
              size="small" 
              startIcon={<PersonAddIcon />}
              onClick={() => setSnackbar({ open: true, message: 'Invite sent!', severity: 'success' })}
            >
              Invite Others
            </Button>
          </Box>
        </LobbyCard>
      </LobbyContainer>
    );
  }

  // Meeting View
  return (
    <MeetingContainer>
      {/* Header */}
      <Header>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <HandshakeIcon sx={{ color: '#fff', fontSize: 28 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
              {meetingTitle}
            </Typography>
            <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
              {meetingId}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isRecording && (
            <RecordingIndicator>
              <FiberManualRecordIcon sx={{ fontSize: 12 }} />
              <Typography variant="caption" fontWeight={600}>REC</Typography>
            </RecordingIndicator>
          )}
          <Chip 
            icon={<AccessTimeIcon sx={{ color: '#fff !important' }} />}
            label={formatDuration(meetingDuration)}
            sx={{ 
              bgcolor: alpha('#fff', 0.1), 
              color: '#fff',
              fontWeight: 600,
            }}
          />
          <Chip 
            icon={<PeopleIcon sx={{ color: '#fff !important' }} />}
            label={participants.length}
            sx={{ 
              bgcolor: alpha('#fff', 0.1), 
              color: '#fff',
            }}
          />
          <Tooltip title="Copy invite link">
            <IconButton onClick={handleCopyLink} sx={{ color: '#fff' }}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            <IconButton onClick={toggleFullscreen} sx={{ color: '#fff' }}>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
          <IconButton 
            onClick={(e) => setMenuAnchor(e.currentTarget)} 
            sx={{ color: '#fff' }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Header>

      {/* Video Grid */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <VideoGrid sx={{ flex: 1, pr: (showChat || showParticipants) ? '376px' : 0 }}>
          {viewMode === 'speaker' ? (
            <>
              {/* Main Video */}
              <VideoCard isMain isActive>
                <Avatar sx={{ width: 120, height: 120, fontSize: '3rem', bgcolor: '#5856D6' }}>
                  J
                </Avatar>
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 16, 
                  left: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: alpha('#000', 0.6),
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                }}>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    John Smith (Host)
                  </Typography>
                  {participants[1]?.isMuted && <MicOffIcon sx={{ fontSize: 16, color: '#FF3B30' }} />}
                </Box>
              </VideoCard>
              
              {/* Self View (Picture-in-Picture) */}
              <Box sx={{ 
                position: 'fixed', 
                bottom: 100, 
                right: (showChat || showParticipants) ? 376 : 16,
                transition: 'right 0.3s ease',
              }}>
                <VideoCard sx={{ width: 200, minHeight: 120 }}>
                  <Avatar sx={{ width: 60, height: 60, fontSize: '1.5rem', bgcolor: '#0d47a1' }}>
                    Y
                  </Avatar>
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: 8, 
                    left: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    bgcolor: alpha('#000', 0.6),
                    px: 1.5,
                    py: 0.25,
                    borderRadius: 1,
                  }}>
                    <Typography variant="caption" sx={{ color: '#fff' }}>You</Typography>
                    {isMuted && <MicOffIcon sx={{ fontSize: 12, color: '#FF3B30' }} />}
                  </Box>
                </VideoCard>
              </Box>
            </>
          ) : (
            /* Grid View */
            <Grid container spacing={2} sx={{ maxWidth: 1200 }}>
              {participants.map((participant, index) => (
                <Grid item xs={12} sm={6} md={4} key={participant.id}>
                  <VideoCard isActive={index === 0}>
                    <Avatar 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        fontSize: '2rem', 
                        bgcolor: index === 0 ? '#0d47a1' : index === 1 ? '#5856D6' : '#FF9500',
                      }}
                    >
                      {participant.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 12, 
                      left: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      bgcolor: alpha('#000', 0.6),
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                    }}>
                      <Typography variant="caption" sx={{ color: '#fff' }}>
                        {participant.name}
                      </Typography>
                      {participant.isMuted && <MicOffIcon sx={{ fontSize: 14, color: '#FF3B30' }} />}
                    </Box>
                  </VideoCard>
                </Grid>
              ))}
            </Grid>
          )}
        </VideoGrid>

        {/* Side Panel - Chat */}
        {showChat && (
          <SidePanel>
            <Box sx={{ p: 2, borderBottom: `1px solid ${alpha('#fff', 0.1)}` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  In-call Messages
                </Typography>
                <IconButton onClick={() => setShowChat(false)} sx={{ color: '#fff' }}>
                  ×
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} isOwn={msg.isOwn}>
                  {!msg.isOwn && (
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                      {msg.sender.charAt(0)}
                    </Avatar>
                  )}
                  <Box>
                    {!msg.isOwn && (
                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.7), mb: 0.5, display: 'block' }}>
                        {msg.sender}
                      </Typography>
                    )}
                    <MessageBubble isOwn={msg.isOwn}>
                      <Typography variant="body2">{msg.message}</Typography>
                    </MessageBubble>
                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.5), mt: 0.5, display: 'block' }}>
                      {msg.time}
                    </Typography>
                  </Box>
                </ChatMessage>
              ))}
              <div ref={chatEndRef} />
            </Box>
            <Box sx={{ p: 2, borderTop: `1px solid ${alpha('#fff', 0.1)}` }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Send a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: alpha('#fff', 0.1),
                      color: '#fff',
                      borderRadius: 3,
                      '& fieldset': { borderColor: alpha('#fff', 0.2) },
                      '&:hover fieldset': { borderColor: alpha('#fff', 0.3) },
                    },
                    '& input::placeholder': { color: alpha('#fff', 0.5) },
                  }}
                />
                <IconButton 
                  onClick={handleSendMessage}
                  sx={{ bgcolor: '#0d47a1', color: '#fff', '&:hover': { bgcolor: '#1565c0' } }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </SidePanel>
        )}

        {/* Side Panel - Participants */}
        {showParticipants && (
          <SidePanel>
            <Box sx={{ p: 2, borderBottom: `1px solid ${alpha('#fff', 0.1)}` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  Participants ({participants.length})
                </Typography>
                <IconButton onClick={() => setShowParticipants(false)} sx={{ color: '#fff' }}>
                  ×
                </IconButton>
              </Box>
            </Box>
            <List sx={{ flex: 1, overflow: 'auto' }}>
              {participants.map((participant, index) => (
                <ListItem 
                  key={participant.id}
                  sx={{ 
                    borderBottom: `1px solid ${alpha('#fff', 0.05)}`,
                    '&:hover': { bgcolor: alpha('#fff', 0.05) },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: '#34C759',
                          border: '2px solid #1a1a2e',
                        }} />
                      }
                    >
                      <Avatar sx={{ 
                        bgcolor: index === 0 ? '#0d47a1' : index === 1 ? '#5856D6' : '#FF9500',
                      }}>
                        {participant.name.charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: '#fff', fontWeight: index === 0 ? 600 : 400 }}>
                        {participant.name} {index === 0 && '(You)'}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                        {participant.role}
                      </Typography>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {participant.isMuted ? (
                      <MicOffIcon sx={{ fontSize: 18, color: '#FF3B30' }} />
                    ) : (
                      <MicIcon sx={{ fontSize: 18, color: '#34C759' }} />
                    )}
                    {participant.isVideoOn ? (
                      <VideocamIcon sx={{ fontSize: 18, color: '#34C759' }} />
                    ) : (
                      <VideocamOffIcon sx={{ fontSize: 18, color: '#FF3B30' }} />
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
            <Box sx={{ p: 2, borderTop: `1px solid ${alpha('#fff', 0.1)}` }}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<PersonAddIcon />}
                sx={{ 
                  color: '#fff', 
                  borderColor: alpha('#fff', 0.3),
                  '&:hover': { borderColor: '#fff', bgcolor: alpha('#fff', 0.1) },
                }}
              >
                Invite Participant
              </Button>
            </Box>
          </SidePanel>
        )}
      </Box>

      {/* Control Bar */}
      <ControlBar>
        <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
          <ControlButton isActive={isMuted} onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <MicOffIcon /> : <MicIcon />}
          </ControlButton>
        </Tooltip>
        
        <Tooltip title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}>
          <ControlButton isActive={!isVideoOn} onClick={() => setIsVideoOn(!isVideoOn)}>
            {isVideoOn ? <VideocamIcon /> : <VideocamOffIcon />}
          </ControlButton>
        </Tooltip>
        
        <Tooltip title={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
          <ControlButton 
            isActive={isScreenSharing} 
            onClick={() => {
              setIsScreenSharing(!isScreenSharing);
              setSnackbar({ 
                open: true, 
                message: isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started', 
                severity: 'info' 
              });
            }}
          >
            {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
          </ControlButton>
        </Tooltip>

        <Tooltip title={handRaised ? 'Lower hand' : 'Raise hand'}>
          <ControlButton 
            isActive={handRaised} 
            onClick={() => {
              setHandRaised(!handRaised);
              setSnackbar({ 
                open: true, 
                message: handRaised ? 'Hand lowered' : 'Hand raised', 
                severity: 'info' 
              });
            }}
            sx={{ bgcolor: handRaised ? '#FF9500' : undefined }}
          >
            <PanToolIcon />
          </ControlButton>
        </Tooltip>

        <Tooltip title="Reactions">
          <ControlButton>
            <EmojiEmotionsIcon />
          </ControlButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ bgcolor: alpha('#fff', 0.2), mx: 1 }} />

        <Tooltip title="Chat">
          <ControlButton 
            isActive={showChat}
            onClick={() => { setShowChat(!showChat); setShowParticipants(false); }}
          >
            <Badge badgeContent={messages.length} color="error">
              <ChatIcon />
            </Badge>
          </ControlButton>
        </Tooltip>

        <Tooltip title="Participants">
          <ControlButton 
            isActive={showParticipants}
            onClick={() => { setShowParticipants(!showParticipants); setShowChat(false); }}
          >
            <Badge badgeContent={participants.length} color="primary">
              <PeopleIcon />
            </Badge>
          </ControlButton>
        </Tooltip>

        <Tooltip title={viewMode === 'speaker' ? 'Grid view' : 'Speaker view'}>
          <ControlButton onClick={() => setViewMode(viewMode === 'speaker' ? 'grid' : 'speaker')}>
            {viewMode === 'speaker' ? <GridViewIcon /> : <ViewSidebarIcon />}
          </ControlButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ bgcolor: alpha('#fff', 0.2), mx: 1 }} />

        <Tooltip title={isRecording ? 'Stop recording' : 'Start recording'}>
          <ControlButton 
            isActive={isRecording}
            onClick={handleStartRecording}
            sx={{ bgcolor: isRecording ? '#FF3B30' : undefined }}
          >
            <FiberManualRecordIcon />
          </ControlButton>
        </Tooltip>

        <Tooltip title="Settings">
          <ControlButton onClick={() => setSettingsOpen(true)}>
            <SettingsIcon />
          </ControlButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ bgcolor: alpha('#fff', 0.2), mx: 1 }} />

        <Tooltip title="Leave meeting">
          <ControlButton isEnd onClick={handleLeaveMeeting}>
            <CallEndIcon />
          </ControlButton>
        </Tooltip>
      </ControlBar>

      {/* More Options Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{
          sx: { bgcolor: '#2a2a3e', color: '#fff' }
        }}
      >
        <MenuItem onClick={() => { handleStartRecording(); setMenuAnchor(null); }}>
          <FiberManualRecordIcon sx={{ mr: 1, color: isRecording ? '#FF3B30' : undefined }} />
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </MenuItem>
        <MenuItem onClick={() => { setSettingsOpen(true); setMenuAnchor(null); }}>
          <SettingsIcon sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <Divider sx={{ bgcolor: alpha('#fff', 0.1) }} />
        <MenuItem onClick={handleLeaveMeeting} sx={{ color: '#FF3B30' }}>
          <CallEndIcon sx={{ mr: 1 }} />
          Leave Meeting
        </MenuItem>
      </Menu>

      {/* Settings Dialog */}
      <Dialog 
        open={settingsOpen} 
        onClose={() => setSettingsOpen(false)}
        PaperProps={{ sx: { bgcolor: '#2a2a3e', color: '#fff', minWidth: 400 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Meeting Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Virtual background"
              sx={{ mb: 2, display: 'block' }}
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Noise suppression"
              sx={{ mb: 2, display: 'block' }}
            />
            <FormControlLabel
              control={<Switch />}
              label="Low data mode"
              sx={{ mb: 2, display: 'block' }}
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Mirror my video"
              sx={{ display: 'block' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)} sx={{ color: '#fff' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MeetingContainer>
  );
};

export default InterviewLobby;
