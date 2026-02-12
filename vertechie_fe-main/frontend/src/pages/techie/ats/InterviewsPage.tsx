/**
 * InterviewsPage - Manage Interview Schedules
 * Fetches real interview data from backend
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../../config/api';
import {
  Box, Typography, Card, CardContent, Avatar, Chip, IconButton, Button, Grid,
  Tabs, Tab, List, ListItem, ListItemAvatar, ListItemText, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl,
  InputLabel, Select, MenuItem, Snackbar, Alert, Menu, Tooltip, CircularProgress, Paper,
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
  const [loading, setLoading] = useState(true);
  
  // Real interview data state
  const [realInterviews, setRealInterviews] = useState<{
    today: any[];
    upcoming: any[];
    completed: any[];
  }>({
    today: [],
    upcoming: [],
    completed: [],
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

  // Interview detail dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedInterviewDetail, setSelectedInterviewDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [decisionDialogOpen, setDecisionDialogOpen] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({
    date: '',
    time: '',
    duration: 60,
    notes: '',
  });
  const [selectedDecision, setSelectedDecision] = useState<'selected' | 'rejected' | 'on_hold' | ''>('');
  const [decisionNotes, setDecisionNotes] = useState('');

  // Fetch real interviews from backend
  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch ALL interviews for this HM (including past ones for Today/History tabs)
      const response = await fetch(getApiUrl('/hiring/interviews?upcoming=false&limit=50'), { headers });
      
      if (response.ok) {
        const data = await response.json();
        const now = new Date();
        const todayStr = now.toDateString();
        
        const today: any[] = [];
        const upcoming: any[] = [];
        const completed: any[] = [];
        
        data.forEach((interview: any) => {
          // Parse backend date (convert UTC to local)
          let dateStr = interview.scheduled_at;
          if (dateStr && !dateStr.includes('Z') && !dateStr.includes('+')) {
            dateStr = dateStr.replace(' ', 'T').replace(/\.000000$/, '') + 'Z';
          }
          const interviewDate = new Date(dateStr);
          const formattedInterview = {
            id: interview.id,
            candidate: interview.candidate_name || 'Candidate',
            role: interview.job_title || 'Position',
            time: interviewDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            date: interviewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            type: interview.interview_type || 'Technical',
            interviewers: interview.interviewers || [],
            status: interview.status,
            platform: 'VerTechie Meet',
            meetingLink: interview.meeting_link || `/techie/lobby/interview-${interview.id}?type=interview`,
            duration: interview.duration_minutes || 60,
            location: interview.location,
            notes: interview.notes,
          };
          
          if (interview.status === 'completed') {
            completed.push(formattedInterview);
          } else if (interviewDate.toDateString() === todayStr) {
            today.push(formattedInterview);
          } else if (interviewDate > now) {
            upcoming.push(formattedInterview);
          } else {
            completed.push(formattedInterview);
          }
        });
        
        setRealInterviews({ today, upcoming, completed });
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Open interview detail dialog
  const handleViewDetails = async (interview: any) => {
    try {
      setLoadingDetail(true);
      setDetailDialogOpen(true);
      
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(`/hiring/interviews/${interview.id}`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const detail = await response.json();
        setSelectedInterviewDetail(detail);
      } else {
        setSnackbar({ open: true, message: 'Failed to load interview details', severity: 'error' });
      }
    } catch (error) {
      console.error('Error fetching interview details:', error);
      setSnackbar({ open: true, message: 'Failed to load interview details', severity: 'error' });
    } finally {
      setLoadingDetail(false);
    }
  };

  // Join meeting
  const handleJoinMeeting = (interview: any) => {
    const meetingLink = interview.meetingLink || interview.meeting_link;
    if (meetingLink) {
      if (meetingLink.startsWith('/')) {
        navigate(meetingLink);
      } else {
        window.open(meetingLink, '_blank');
      }
    }
  };

  // Cancel interview
  const handleCancelInterview = async () => {
    if (!selectedInterviewDetail) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(`/hiring/interviews/${selectedInterviewDetail.id}/cancel`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setSnackbar({ open: true, message: 'Interview cancelled successfully', severity: 'success' });
        setDetailDialogOpen(false);
        fetchInterviews();
      } else {
        setSnackbar({ open: true, message: 'Failed to cancel interview', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to cancel interview', severity: 'error' });
    }
  };

  // Reschedule interview
  const handleRescheduleSubmit = async () => {
    if (!selectedInterviewDetail || !rescheduleForm.date || !rescheduleForm.time) return;
    
    try {
      const token = localStorage.getItem('authToken');
      // Convert local date/time to UTC properly to avoid timezone mismatch
      const [year, month, day] = rescheduleForm.date.split('-').map(Number);
      const [hours, minutes] = rescheduleForm.time.split(':').map(Number);
      const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
      const scheduledAt = localDate.toISOString();
      
      const response = await fetch(getApiUrl(`/hiring/interviews/${selectedInterviewDetail.id}/reschedule`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduled_at: scheduledAt,
          duration_minutes: rescheduleForm.duration,
          notes: rescheduleForm.notes,
        }),
      });
      
      if (response.ok) {
        setSnackbar({ open: true, message: 'Interview rescheduled successfully', severity: 'success' });
        setRescheduleDialogOpen(false);
        setDetailDialogOpen(false);
        fetchInterviews();
      } else {
        setSnackbar({ open: true, message: 'Failed to reschedule interview', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to reschedule interview', severity: 'error' });
    }
  };

  // Update decision (Selected/Rejected/On Hold)
  const handleDecisionSubmit = async () => {
    if (!selectedInterviewDetail || !selectedDecision) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(`/hiring/interviews/${selectedInterviewDetail.id}/decision`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decision: selectedDecision,
          notes: decisionNotes,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setSnackbar({ 
          open: true, 
          message: `Candidate marked as ${selectedDecision.replace('_', ' ')}`, 
          severity: 'success' 
        });
        setDecisionDialogOpen(false);
        setDetailDialogOpen(false);
        fetchInterviews();
      } else {
        setSnackbar({ open: true, message: 'Failed to update decision', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update decision', severity: 'error' });
    }
  };

  // Update interview status
  const handleUpdateStatus = async (status: string) => {
    if (!selectedInterviewDetail) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(`/hiring/interviews/${selectedInterviewDetail.id}/status`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        setSnackbar({ open: true, message: `Status updated to ${status}`, severity: 'success' });
        fetchInterviews();
        // Refresh details
        handleViewDetails({ id: selectedInterviewDetail.id });
      } else {
        setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
    }
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
        <Tab label={`Today (${realInterviews.today.length})`} />
        <Tab label={`Upcoming (${realInterviews.upcoming.length})`} />
        <Tab label={`Completed (${realInterviews.completed.length})`} />
      </Tabs>

      {/* Today's Interviews */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            </Grid>
          ) : realInterviews.today.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">No interviews scheduled for today</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Schedule interviews from the Pipeline or Job Postings page
                </Typography>
              </Paper>
            </Grid>
          ) : null}
          {realInterviews.today.map((interview) => (
            <Grid item xs={12} md={6} lg={4} key={interview.id}>
              <InterviewCard 
                onClick={() => handleViewDetails(interview)}
                sx={{ cursor: 'pointer' }}
              >
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
          {loading ? (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            </Grid>
          ) : realInterviews.upcoming.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">No upcoming interviews</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Schedule interviews from the Pipeline or Job Postings page
                </Typography>
              </Paper>
            </Grid>
          ) : null}
          {realInterviews.upcoming.map((interview) => (
            <Grid item xs={12} key={interview.id}>
              <InterviewCard 
                onClick={() => handleViewDetails(interview)}
                sx={{ mb: 0, cursor: 'pointer' }}
              >
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
          {loading ? (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            </Grid>
          ) : realInterviews.completed.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">No completed interviews</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Completed interviews will appear here after they're done
                </Typography>
              </Paper>
            </Grid>
          ) : null}
          {realInterviews.completed.map((interview) => (
            <Grid item xs={12} md={6} key={interview.id}>
              <InterviewCard 
                onClick={() => handleViewDetails(interview)}
                sx={{ mb: 0, cursor: 'pointer' }}
              >
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

      {/* Interview Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Interview Details
          {selectedInterviewDetail && (
            <Chip
              label={selectedInterviewDetail.status?.replace('_', ' ').toUpperCase() || 'SCHEDULED'}
              color={
                selectedInterviewDetail.status === 'completed' ? 'success' :
                selectedInterviewDetail.status === 'cancelled' ? 'error' :
                selectedInterviewDetail.status === 'in_progress' ? 'warning' : 'primary'
              }
              size="small"
            />
          )}
        </DialogTitle>
        <DialogContent>
          {loadingDetail ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : selectedInterviewDetail ? (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Candidate Info */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: alpha('#0d47a1', 0.03) }}>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>Candidate Information</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 60, height: 60, bgcolor: '#0d47a1' }}>
                      {selectedInterviewDetail.candidate_name?.charAt(0) || 'C'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{selectedInterviewDetail.candidate_name || 'Candidate'}</Typography>
                      <Typography variant="body2" color="text.secondary">{selectedInterviewDetail.candidate_email}</Typography>
                      {selectedInterviewDetail.candidate_experience && (
                        <Typography variant="body2" color="text.secondary">{selectedInterviewDetail.candidate_experience}</Typography>
                      )}
                    </Box>
                    {selectedInterviewDetail.match_score && (
                      <Chip
                        label={`${selectedInterviewDetail.match_score}% Match`}
                        sx={{
                          ml: 'auto',
                          bgcolor: selectedInterviewDetail.match_score >= 70 ? alpha('#34C759', 0.15) : alpha('#FF9500', 0.15),
                          color: selectedInterviewDetail.match_score >= 70 ? '#34C759' : '#FF9500',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                  {selectedInterviewDetail.candidate_skills?.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedInterviewDetail.candidate_skills.slice(0, 8).map((skill: string, idx: number) => (
                        <Chip key={idx} label={skill} size="small" variant="outlined" />
                      ))}
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Job Info */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Position</Typography>
                <Typography variant="body1" fontWeight={500}>{selectedInterviewDetail.job_title || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Company</Typography>
                <Typography variant="body1" fontWeight={500}>{selectedInterviewDetail.company_name || 'N/A'}</Typography>
              </Grid>

              {/* Interview Details */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Date & Time</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {(() => {
                    let ds = selectedInterviewDetail.scheduled_at;
                    if (ds && !ds.includes('Z') && !ds.includes('+')) {
                      ds = ds.replace(' ', 'T').replace(/\.000000$/, '') + 'Z';
                    }
                    return new Date(ds).toLocaleDateString('en-US', { 
                      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
                    });
                  })()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(() => {
                    let ds = selectedInterviewDetail.scheduled_at;
                    if (ds && !ds.includes('Z') && !ds.includes('+')) {
                      ds = ds.replace(' ', 'T').replace(/\.000000$/, '') + 'Z';
                    }
                    return new Date(ds).toLocaleTimeString('en-US', { 
                      hour: '2-digit', minute: '2-digit' 
                    });
                  })()} ({selectedInterviewDetail.duration_minutes} min)
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Interview Type</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedInterviewDetail.interview_type?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </Typography>
              </Grid>

              {selectedInterviewDetail.notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                  <Typography variant="body2">{selectedInterviewDetail.notes}</Typography>
                </Grid>
              )}

              {/* Application Status */}
              {selectedInterviewDetail.application_status && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Application Status</Typography>
                  <Chip
                    label={selectedInterviewDetail.application_status.replace('_', ' ').toUpperCase()}
                    color={
                      selectedInterviewDetail.application_status === 'offered' ? 'success' :
                      selectedInterviewDetail.application_status === 'rejected' ? 'error' : 'default'
                    }
                    size="small"
                  />
                </Grid>
              )}
            </Grid>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1, flexWrap: 'wrap' }}>
          {selectedInterviewDetail?.status !== 'completed' && selectedInterviewDetail?.status !== 'cancelled' && (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<VideocamIcon />}
                onClick={() => handleJoinMeeting(selectedInterviewDetail)}
              >
                Join Meeting
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  // Parse UTC datetime from backend and convert to local for display
                  const utcDate = new Date(selectedInterviewDetail.scheduled_at);
                  // Get local date components
                  const localYear = utcDate.getFullYear();
                  const localMonth = String(utcDate.getMonth() + 1).padStart(2, '0');
                  const localDay = String(utcDate.getDate()).padStart(2, '0');
                  const localHours = String(utcDate.getHours()).padStart(2, '0');
                  const localMinutes = String(utcDate.getMinutes()).padStart(2, '0');
                  
                  setRescheduleForm({
                    date: `${localYear}-${localMonth}-${localDay}`,
                    time: `${localHours}:${localMinutes}`,
                    duration: selectedInterviewDetail.duration_minutes,
                    notes: selectedInterviewDetail.notes || '',
                  });
                  setRescheduleDialogOpen(true);
                }}
              >
                Reschedule
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleUpdateStatus('in_progress')}
              >
                Start Interview
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancelInterview}
              >
                Cancel
              </Button>
            </>
          )}
          {(selectedInterviewDetail?.status === 'completed' || selectedInterviewDetail?.status === 'in_progress') && (
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                setSelectedDecision('');
                setDecisionNotes('');
                setDecisionDialogOpen(true);
              }}
            >
              Update Decision
            </Button>
          )}
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog
        open={rescheduleDialogOpen}
        onClose={() => setRescheduleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Reschedule Interview</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="New Date"
                type="date"
                value={rescheduleForm.date}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="New Time"
                type="time"
                value={rescheduleForm.time}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={rescheduleForm.duration}
                  label="Duration"
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, duration: Number(e.target.value) })}
                >
                  {durationOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                placeholder="Reason for rescheduling..."
                value={rescheduleForm.notes}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setRescheduleDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRescheduleSubmit} sx={{ bgcolor: '#0d47a1' }}>
            Reschedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Decision Dialog */}
      <Dialog
        open={decisionDialogOpen}
        onClose={() => setDecisionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Update Interview Decision</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select the final decision for this candidate after the interview.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant={selectedDecision === 'selected' ? 'contained' : 'outlined'}
                  color="success"
                  onClick={() => setSelectedDecision('selected')}
                  sx={{ flex: 1 }}
                >
                  Selected
                </Button>
                <Button
                  variant={selectedDecision === 'on_hold' ? 'contained' : 'outlined'}
                  color="warning"
                  onClick={() => setSelectedDecision('on_hold')}
                  sx={{ flex: 1 }}
                >
                  On Hold
                </Button>
                <Button
                  variant={selectedDecision === 'rejected' ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => setSelectedDecision('rejected')}
                  sx={{ flex: 1 }}
                >
                  Rejected
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                placeholder="Add feedback or notes about this decision..."
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDecisionDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleDecisionSubmit}
            disabled={!selectedDecision}
            sx={{ bgcolor: '#0d47a1' }}
          >
            Submit Decision
          </Button>
        </DialogActions>
      </Dialog>

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
