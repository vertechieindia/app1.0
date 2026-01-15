/**
 * InterviewsPage - Manage Interview Schedules
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Avatar, Chip, IconButton, Button, Grid,
  Tabs, Tab, List, ListItem, ListItemAvatar, ListItemText, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl,
  InputLabel, Select, MenuItem, Snackbar, Alert, Menu, Tooltip,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import VideocamIcon from '@mui/icons-material/Videocam';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ComputerIcon from '@mui/icons-material/Computer';
import GroupsIcon from '@mui/icons-material/Groups';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import ATSLayout from './ATSLayout';

// Styled Components
const InterviewCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.2s ease',
  borderRadius: 12,
  border: `1px solid ${alpha('#0d47a1', 0.08)}`,
  '&:hover': {
    boxShadow: '0 4px 20px rgba(13, 71, 161, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

const PlatformChip = styled(Chip)<{ platform: string }>(({ platform }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    'VerTechie Meet': { bg: alpha('#0d47a1', 0.15), text: '#0d47a1' },
    'Zoom': { bg: alpha('#2D8CFF', 0.1), text: '#2D8CFF' },
    'Google Meet': { bg: alpha('#34A853', 0.1), text: '#34A853' },
    'Microsoft Teams': { bg: alpha('#6264A7', 0.1), text: '#6264A7' },
    'Webex': { bg: alpha('#00BCF2', 0.1), text: '#00BCF2' },
    'Phone Call': { bg: alpha('#FF9500', 0.1), text: '#FF9500' },
    'In-Person': { bg: alpha('#FF3B30', 0.1), text: '#FF3B30' },
  };
  const { bg, text } = colors[platform] || { bg: alpha('#999', 0.1), text: '#999' };
  return {
    backgroundColor: bg,
    color: text,
    fontWeight: 600,
    '& .MuiChip-icon': { color: text },
  };
});

const TypeChip = styled(Chip)<{ interviewtype: string }>(({ interviewtype }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    'Technical': { bg: alpha('#0d47a1', 0.1), text: '#0d47a1' },
    'HR Round': { bg: alpha('#9C27B0', 0.1), text: '#9C27B0' },
    'Portfolio Review': { bg: alpha('#FF6B6B', 0.1), text: '#FF6B6B' },
    'System Design': { bg: alpha('#00BCD4', 0.1), text: '#00BCD4' },
    'Coding Challenge': { bg: alpha('#4CAF50', 0.1), text: '#4CAF50' },
    'Cultural Fit': { bg: alpha('#FF9800', 0.1), text: '#FF9800' },
    'Panel Interview': { bg: alpha('#607D8B', 0.1), text: '#607D8B' },
    'Final Round': { bg: alpha('#E91E63', 0.1), text: '#E91E63' },
    'Behavioral': { bg: alpha('#795548', 0.1), text: '#795548' },
    'Case Study': { bg: alpha('#3F51B5', 0.1), text: '#3F51B5' },
  };
  const { bg, text } = colors[interviewtype] || { bg: alpha('#999', 0.1), text: '#999' };
  return {
    backgroundColor: bg,
    color: text,
    fontWeight: 500,
  };
});

// Interview Types
const interviewTypes = [
  'Technical',
  'HR Round',
  'Portfolio Review',
  'System Design',
  'Coding Challenge',
  'Cultural Fit',
  'Panel Interview',
  'Final Round',
  'Behavioral',
  'Case Study',
];

// Meeting Platforms
const meetingPlatforms = [
  { id: 'vertechie-meet', name: 'VerTechie Meet', icon: <GroupsIcon /> },
  { id: 'zoom', name: 'Zoom', icon: <VideocamIcon /> },
  { id: 'google-meet', name: 'Google Meet', icon: <VideocamIcon /> },
  { id: 'teams', name: 'Microsoft Teams', icon: <ComputerIcon /> },
  { id: 'webex', name: 'Webex', icon: <VideocamIcon /> },
  { id: 'phone', name: 'Phone Call', icon: <PhoneIcon /> },
  { id: 'in-person', name: 'In-Person', icon: <LocationOnIcon /> },
];

// Duration Options
const durationOptions = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

// Mock Data
const interviews = {
  today: [
    { 
      id: 1, 
      candidate: 'Sarah Johnson', 
      role: 'Senior React Developer', 
      time: '10:00 AM - 11:00 AM', 
      date: 'Today',
      type: 'Technical', 
      interviewers: ['John Doe', 'Jane Smith'], 
      status: 'upcoming', 
      platform: 'VerTechie Meet',
      meetingLink: '/techie/lobby/interview-1768496035853?type=interview&title=Technical%20Interview%20-%20Sarah%20Johnson',
      duration: 60,
    },
    { 
      id: 2, 
      candidate: 'Mike Chen', 
      role: 'Senior React Developer', 
      time: '2:00 PM - 2:45 PM', 
      date: 'Today',
      type: 'HR Round', 
      interviewers: ['HR Team'], 
      status: 'upcoming', 
      platform: 'VerTechie Meet',
      meetingLink: '/techie/lobby/interview-1768496035854?type=interview&title=HR%20Round%20-%20Mike%20Chen',
      duration: 45,
    },
    { 
      id: 9, 
      candidate: 'Lisa Wang', 
      role: 'Product Designer', 
      time: '4:00 PM - 5:00 PM', 
      date: 'Today',
      type: 'Portfolio Review', 
      interviewers: ['Design Lead', 'UX Manager'], 
      status: 'upcoming', 
      platform: 'VerTechie Meet',
      meetingLink: '/techie/lobby/interview-1768496035855?type=interview&title=Portfolio%20Review%20-%20Lisa%20Wang',
      duration: 60,
    },
  ],
  upcoming: [
    { 
      id: 3, 
      candidate: 'Emily Davis', 
      role: 'UX Designer', 
      time: '10:00 AM', 
      date: 'Dec 30, 2025',
      type: 'Portfolio Review', 
      interviewers: ['Design Lead'], 
      status: 'scheduled', 
      platform: 'Zoom',
      duration: 60,
    },
    { 
      id: 4, 
      candidate: 'Alex Rivera', 
      role: 'Product Manager', 
      time: '3:00 PM', 
      date: 'Dec 30, 2025',
      type: 'Final Round', 
      interviewers: ['CEO', 'VP Product'], 
      status: 'scheduled', 
      platform: 'In-Person',
      location: 'Conference Room A, 5th Floor',
      duration: 90,
    },
    { 
      id: 5, 
      candidate: 'Jordan Lee', 
      role: 'DevOps Engineer', 
      time: '11:00 AM', 
      date: 'Jan 2, 2026',
      type: 'System Design', 
      interviewers: ['Engineering Lead', 'CTO'], 
      status: 'scheduled', 
      platform: 'Zoom',
      duration: 60,
    },
    { 
      id: 10, 
      candidate: 'Robert Kim', 
      role: 'Backend Developer', 
      time: '9:00 AM', 
      date: 'Jan 3, 2026',
      type: 'Coding Challenge', 
      interviewers: ['Tech Lead'], 
      status: 'scheduled', 
      platform: 'Phone Call',
      duration: 45,
    },
    { 
      id: 11, 
      candidate: 'Amanda Scott', 
      role: 'Engineering Manager', 
      time: '2:00 PM', 
      date: 'Jan 5, 2026',
      type: 'Panel Interview', 
      interviewers: ['VP Engineering', 'HR Director', 'CTO'], 
      status: 'scheduled', 
      platform: 'Webex',
      duration: 120,
    },
  ],
  completed: [
    { id: 6, candidate: 'Taylor Smith', role: 'UX Designer', time: 'Dec 25, 2:00 PM', type: 'Technical', result: 'passed', feedback: 'Strong design skills and excellent problem-solving approach.' },
    { id: 7, candidate: 'Chris Brown', role: 'DevOps Engineer', time: 'Dec 24, 11:00 AM', type: 'Cultural Fit', result: 'passed', feedback: 'Great culture fit, aligns with company values.' },
    { id: 8, candidate: 'Morgan Williams', role: 'Senior React Developer', time: 'Dec 23, 3:00 PM', type: 'Technical', result: 'failed', feedback: 'Needs more experience with state management and testing.' },
    { id: 12, candidate: 'David Park', role: 'Data Scientist', time: 'Dec 22, 10:00 AM', type: 'Case Study', result: 'passed', feedback: 'Excellent analytical skills and clear presentation.' },
  ],
};

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'Zoom':
    case 'Google Meet':
    case 'Webex':
      return <VideocamIcon />;
    case 'Microsoft Teams':
      return <ComputerIcon />;
    case 'Phone Call':
      return <PhoneIcon />;
    case 'In-Person':
      return <LocationOnIcon />;
    default:
      return <VideocamIcon />;
  }
};

const InterviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false, message: '', severity: 'info'
  });
  
  // Schedule form state
  const [scheduleForm, setScheduleForm] = useState({
    candidate: '',
    role: '',
    date: '',
    time: '',
    duration: 60,
    type: 'Technical',
    platform: 'VerTechie Meet',
    interviewers: '',
    meetingLink: '',
    location: '',
    notes: '',
  });

  const handleScheduleSubmit = () => {
    // Generate VerTechie Meet link if platform is VerTechie Meet
    let meetingLink = scheduleForm.meetingLink;
    if (scheduleForm.platform === 'VerTechie Meet' && !meetingLink) {
      const meetingId = Date.now();
      const title = encodeURIComponent(`${scheduleForm.type} - ${scheduleForm.candidate}`);
      meetingLink = `/techie/lobby/interview-${meetingId}?type=interview&title=${title}`;
    }
    
    setSnackbar({ open: true, message: 'Interview scheduled successfully!', severity: 'success' });
    setScheduleDialogOpen(false);
    setScheduleForm({
      candidate: '',
      role: '',
      date: '',
      time: '',
      duration: 60,
      type: 'Technical',
      platform: 'VerTechie Meet',
      interviewers: '',
      meetingLink: '',
      location: '',
      notes: '',
    });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, interview: any) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedInterview(interview);
  };

  const handleCopyLink = () => {
    if (selectedInterview?.meetingLink) {
      navigator.clipboard.writeText(selectedInterview.meetingLink);
      setSnackbar({ open: true, message: 'Meeting link copied!', severity: 'success' });
    }
    setMenuAnchor(null);
  };

  const handleSendReminder = () => {
    setSnackbar({ open: true, message: 'Reminder sent to all participants!', severity: 'success' });
    setMenuAnchor(null);
  };

  return (
    <ATSLayout>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>Interview Schedule</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setScheduleDialogOpen(true)}
          sx={{ bgcolor: '#0d47a1', borderRadius: 2 }}
        >
          Schedule Interview
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onChange={(_, v) => setActiveTab(v)} 
        sx={{ 
          mb: 3,
          '& .MuiTab-root': { fontWeight: 600 },
        }}
      >
        <Tab label={`Today (${interviews.today.length})`} />
        <Tab label={`Upcoming (${interviews.upcoming.length})`} />
        <Tab label={`Completed (${interviews.completed.length})`} />
      </Tabs>

      {/* Today's Interviews */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {interviews.today.map((interview) => (
            <Grid item xs={12} md={6} lg={4} key={interview.id}>
              <InterviewCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: alpha('#0d47a1', 0.1), 
                        color: '#0d47a1', 
                        width: 52, 
                        height: 52,
                        fontSize: '1.2rem',
                        fontWeight: 600,
                      }}>
                        {interview.candidate.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>{interview.candidate}</Typography>
                        <Typography variant="body2" color="text.secondary">{interview.role}</Typography>
                      </Box>
                    </Box>
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, interview)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      icon={<AccessTimeIcon />} 
                      label={interview.time} 
                      size="small" 
                      sx={{ fontWeight: 500 }}
                    />
                    <TypeChip interviewtype={interview.type} label={interview.type} size="small" />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <PlatformChip 
                      platform={interview.platform}
                      icon={getPlatformIcon(interview.platform)} 
                      label={interview.platform} 
                      size="small" 
                    />
                    <Chip 
                      label={`${interview.duration} min`} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupsIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Tooltip title={interview.interviewers.join(', ')}>
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          maxWidth: 120, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {interview.interviewers.join(', ')}
                        </Typography>
                      </Tooltip>
                    </Box>
                    <Button 
                      size="small" 
                      variant="contained" 
                      startIcon={getPlatformIcon(interview.platform)}
                      sx={{ 
                        bgcolor: interview.platform === 'VerTechie Meet' ? '#0d47a1' : '#0d47a1',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                      onClick={() => {
                        if (interview.meetingLink) {
                          // Use navigate for internal VerTechie Meet links
                          if (interview.meetingLink.startsWith('/')) {
                            navigate(interview.meetingLink);
                          } else {
                            window.open(interview.meetingLink, '_blank');
                          }
                        } else {
                          setSnackbar({ open: true, message: 'No meeting link available', severity: 'info' });
                        }
                      }}
                    >
                      {interview.platform === 'VerTechie Meet' ? 'Join Meeting' : 'Join Call'}
                    </Button>
                  </Box>
                </CardContent>
              </InterviewCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upcoming Interviews */}
      {activeTab === 1 && (
        <Grid container spacing={2}>
          {interviews.upcoming.map((interview) => (
            <Grid item xs={12} key={interview.id}>
              <InterviewCard sx={{ mb: 0 }}>
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: alpha('#5856D6', 0.1), color: '#5856D6' }}>
                        {interview.candidate.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>{interview.candidate}</Typography>
                        <Typography variant="body2" color="text.secondary">{interview.role}</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        icon={<CalendarTodayIcon />} 
                        label={`${interview.date} • ${interview.time}`} 
                        size="small" 
                        sx={{ fontWeight: 500 }}
                      />
                      <TypeChip interviewtype={interview.type} label={interview.type} size="small" />
                      <PlatformChip 
                        platform={interview.platform}
                        icon={getPlatformIcon(interview.platform)} 
                        label={interview.platform} 
                        size="small" 
                      />
                      <Chip 
                        label={`${interview.duration} min`} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupsIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {interview.interviewers.length} interviewer{interview.interviewers.length > 1 ? 's' : ''}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined" sx={{ borderRadius: 2 }}>
                        Reschedule
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        sx={{ bgcolor: '#0d47a1', borderRadius: 2 }}
                      >
                        Details
                      </Button>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, interview)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  {interview.platform === 'In-Person' && interview.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, ml: 7 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {interview.location}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </InterviewCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Completed Interviews */}
      {activeTab === 2 && (
        <Grid container spacing={2}>
          {interviews.completed.map((interview) => (
            <Grid item xs={12} md={6} key={interview.id}>
              <InterviewCard sx={{ mb: 0 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: alpha(interview.result === 'passed' ? '#34C759' : '#FF3B30', 0.1), 
                        color: interview.result === 'passed' ? '#34C759' : '#FF3B30' 
                      }}>
                        {interview.result === 'passed' ? <CheckCircleIcon /> : <CancelIcon />}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>{interview.candidate}</Typography>
                        <Typography variant="body2" color="text.secondary">{interview.role}</Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={interview.result === 'passed' ? 'Passed' : 'Failed'}
                      size="small"
                      sx={{
                        bgcolor: alpha(interview.result === 'passed' ? '#34C759' : '#FF3B30', 0.1),
                        color: interview.result === 'passed' ? '#34C759' : '#FF3B30',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      icon={<CalendarTodayIcon />} 
                      label={interview.time} 
                      size="small" 
                    />
                    <TypeChip interviewtype={interview.type} label={interview.type} size="small" />
                  </Box>
                  
                  <Box sx={{ 
                    bgcolor: alpha('#0d47a1', 0.04), 
                    p: 1.5, 
                    borderRadius: 2,
                    borderLeft: `3px solid ${interview.result === 'passed' ? '#34C759' : '#FF3B30'}`,
                  }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      "{interview.feedback}"
                    </Typography>
                  </Box>
                </CardContent>
              </InterviewCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Schedule Interview Dialog */}
      <Dialog 
        open={scheduleDialogOpen} 
        onClose={() => setScheduleDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Schedule Interview</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Candidate Name"
                value={scheduleForm.candidate}
                onChange={(e) => setScheduleForm({ ...scheduleForm, candidate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Position/Role"
                value={scheduleForm.role}
                onChange={(e) => setScheduleForm({ ...scheduleForm, role: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={scheduleForm.date}
                onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                value={scheduleForm.time}
                onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={scheduleForm.duration}
                  label="Duration"
                  onChange={(e) => setScheduleForm({ ...scheduleForm, duration: Number(e.target.value) })}
                >
                  {durationOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Interview Type</InputLabel>
                <Select
                  value={scheduleForm.type}
                  label="Interview Type"
                  onChange={(e) => setScheduleForm({ ...scheduleForm, type: e.target.value })}
                >
                  {interviewTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Meeting Platform</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {meetingPlatforms.map((platform) => (
                  <Chip
                    key={platform.id}
                    icon={platform.icon}
                    label={platform.name}
                    clickable
                    variant={scheduleForm.platform === platform.name ? 'filled' : 'outlined'}
                    color={scheduleForm.platform === platform.name ? 'primary' : 'default'}
                    onClick={() => setScheduleForm({ ...scheduleForm, platform: platform.name })}
                    sx={{ 
                      fontWeight: scheduleForm.platform === platform.name ? 600 : 400,
                    }}
                  />
                ))}
              </Box>
            </Grid>
            {scheduleForm.platform !== 'In-Person' && scheduleForm.platform !== 'Phone Call' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meeting Link"
                  placeholder="https://..."
                  value={scheduleForm.meetingLink}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })}
                />
              </Grid>
            )}
            {scheduleForm.platform === 'In-Person' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  placeholder="e.g., Conference Room A, 5th Floor"
                  value={scheduleForm.location}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Interviewers"
                placeholder="e.g., John Doe, Jane Smith"
                value={scheduleForm.interviewers}
                onChange={(e) => setScheduleForm({ ...scheduleForm, interviewers: e.target.value })}
                helperText="Separate multiple names with commas"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                placeholder="Any additional notes or instructions..."
                value={scheduleForm.notes}
                onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleScheduleSubmit}
            sx={{ bgcolor: '#0d47a1' }}
          >
            Schedule Interview
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => { setMenuAnchor(null); setSnackbar({ open: true, message: 'Edit feature coming soon!', severity: 'info' }); }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Interview
        </MenuItem>
        <MenuItem onClick={handleCopyLink}>
          <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
          Copy Meeting Link
        </MenuItem>
        <MenuItem onClick={handleSendReminder}>
          <SendIcon fontSize="small" sx={{ mr: 1 }} />
          Send Reminder
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { setMenuAnchor(null); setSnackbar({ open: true, message: 'Interview cancelled!', severity: 'info' }); }} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Cancel Interview
        </MenuItem>
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ATSLayout>
  );
};

export default InterviewsPage;
