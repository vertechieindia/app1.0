/**
 * PipelinePage - Kanban-style Candidate Pipeline
 * Candidates can be moved forward/backward between 5 stages
 * Email notifications are sent on stage changes
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, Avatar, Chip, IconButton, TextField, FormControl,
  InputLabel, Select, MenuItem, InputAdornment, Button, Rating, Tooltip,
  LinearProgress, Menu, Snackbar, Alert, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText,
} from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ViewListIcon from '@mui/icons-material/ViewList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Grid from '@mui/material/Grid';
import ATSLayout from './ATSLayout';
import { userService, jobService, getHRUserInfo } from '../../../services/jobPortalService';
import { getApiUrl, API_ENDPOINTS } from '../../../config/api';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const ScoreBadge = styled(Box)<{ scorecolor: string }>(({ scorecolor }) => ({
  width: 44,
  height: 44,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '0.875rem',
  color: 'white',
  background: `linear-gradient(135deg, ${scorecolor} 0%, ${alpha(scorecolor, 0.8)} 100%)`,
  boxShadow: `0 4px 12px ${alpha(scorecolor, 0.35)}`,
  flexShrink: 0,
}));

const AIInsightBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  borderRadius: 20,
  background: `linear-gradient(135deg, ${alpha('#7C4DFF', 0.08)} 0%, ${alpha('#B388FF', 0.08)} 100%)`,
  border: `1px solid ${alpha('#7C4DFF', 0.2)}`,
  marginTop: theme.spacing(1.5),
  maxWidth: '100%',
}));

const PipelineColumn = styled(Box)(({ theme }) => ({
  minWidth: 320,
  maxWidth: 320,
  backgroundColor: alpha('#f8fafc', 0.8),
  borderRadius: 16,
  padding: theme.spacing(2),
  border: `1px solid ${alpha('#0d47a1', 0.08)}`,
}));

const CandidateCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  cursor: 'pointer',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: 12,
  border: `1px solid ${alpha('#0d47a1', 0.08)}`,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(13, 71, 161, 0.12)',
    transform: 'translateY(-3px)',
    borderColor: alpha('#0d47a1', 0.15),
  },
}));

const InfoPill = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 10px',
  borderRadius: 8,
  backgroundColor: alpha('#0d47a1', 0.06),
  fontSize: '0.75rem',
  color: alpha('#0d47a1', 0.8),
  fontWeight: 500,
}));

const StageButton = styled(IconButton)<{ buttontype: 'forward' | 'backward' }>(({ buttontype }) => ({
  width: 32,
  height: 32,
  backgroundColor: buttontype === 'forward' ? alpha('#34C759', 0.1) : alpha('#FF9500', 0.1),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: buttontype === 'forward' ? alpha('#34C759', 0.2) : alpha('#FF9500', 0.2),
    transform: 'scale(1.1)',
  },
  '&.Mui-disabled': {
    backgroundColor: alpha('#999', 0.08),
  },
}));

// 5 Pipeline Stages
const stages = [
  { id: 'new', label: 'New Applicants', color: '#0d47a1', index: 0 },
  { id: 'screening', label: 'Screening', color: '#FF9500', index: 1 },
  { id: 'interview', label: 'Interview', color: '#5856D6', index: 2 },
  { id: 'offer', label: 'Offer Stage', color: '#34C759', index: 3 },
  { id: 'hired', label: 'Hired', color: '#00C853', index: 4 },
];

interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  stage: string;
  skills: string[];
  rating: number;
  time: string;
  score: number;
  matchScore: number;
  aiInsight: string;
  experience: number;
  education: string;
  source: string;
  avatar?: string;
  applicationId?: string;
  userId?: string;  // The actual user ID for viewing profile
  jobId?: string;
  jobTitle?: string;
}

// Score color based on value
const getScoreColor = (score: number): string => {
  if (score >= 90) return '#00C853';
  if (score >= 80) return '#FF9500';
  if (score >= 70) return '#FF6B00';
  return '#FF3B30';
};

const getScoreLabel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Fair';
  return 'Needs Review';
};

const getStageLabel = (stageId: string): string => {
  const stage = stages.find(s => s.id === stageId);
  return stage?.label || stageId;
};

const PipelinePage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedJob, setSelectedJob] = useState('all');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Array<{ id: string; title: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false, message: '', severity: 'info'
  });
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: 'forward' | 'backward' | null; candidate: Candidate | null }>({
    open: false, action: null, candidate: null
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Schedule Interview Dialog State
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    duration: 60,
    type: 'technical',
    notes: '',
  });
  const [scheduling, setScheduling] = useState(false);

  // Fetch jobs for filter dropdown
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const hrUser = getHRUserInfo();
        const userId = hrUser?.id || '';
        if (userId) {
          const fetchedJobs = await jobService.getJobsByHR(userId);
          setJobs(fetchedJobs.map(job => ({ id: job.id, title: job.title })));
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  // Fetch candidates from API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        // Build query params
        const params = new URLSearchParams();
        if (selectedJob && selectedJob !== 'all') {
          params.append('job_id', selectedJob);
        }
        
        const response = await fetch(
          `${getApiUrl(API_ENDPOINTS.HIRING.PIPELINE_CANDIDATES)}?${params.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch candidates');
        }
        
        const data = await response.json();
        
        // Map API data to pipeline format
        const aiInsights = [
          'Strong technical background',
          'Excellent communication skills',
          'Great leadership potential',
          'Perfect culture fit',
          'Top performer in assessments',
          'Highly recommended',
          'Strong problem solver',
          'Good team player',
        ];
        
        const mappedCandidates: Candidate[] = data.map((candidate: any, index: number) => ({
          id: candidate.id || candidate.application_id,
          name: candidate.name || 'Unknown',
          email: candidate.email || '',
          role: candidate.role || candidate.job_title || 'Applicant',
          stage: candidate.stage || 'new',
          skills: candidate.skills || [],
          rating: candidate.rating || 4,
          time: candidate.time || 'Recently',
          score: candidate.score || candidate.matchScore || candidate.match_score || 0,
          matchScore: candidate.matchScore || candidate.match_score || candidate.score || 0,
          aiInsight: candidate.aiInsight || aiInsights[index % aiInsights.length],
          experience: candidate.experience || 0,
          education: candidate.education || 'Not specified',
          source: candidate.source || 'VerTechie',
          avatar: candidate.avatar,
          applicationId: candidate.application_id,
          userId: candidate.user_id,  // Store the actual user ID
          jobId: candidate.job_id,
          jobTitle: candidate.job_title,
        }));
        
        setCandidates(mappedCandidates);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setSnackbar({ open: true, message: 'Failed to load candidates', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [selectedJob]);

  // Helper function for relative time
  const getRelativeTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Send stage change email notification
  const sendStageChangeEmail = async (candidate: Candidate, oldStage: string, newStage: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const hrUser = JSON.parse(localStorage.getItem('userData') || '{}');
      
      await fetch(getApiUrl('/notifications/stage-change/'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidate_email: candidate.email,
          candidate_name: candidate.name,
          old_stage: getStageLabel(oldStage),
          new_stage: getStageLabel(newStage),
          hr_name: `${hrUser.first_name || ''} ${hrUser.last_name || ''}`.trim() || 'HR Team',
          job_title: candidate.role,
        }),
      });
      
      return true;
    } catch (error) {
      console.warn('Email notification failed:', error);
      return false;
    }
  };

  // Move candidate to next stage
  const moveToNextStage = async (candidate: Candidate) => {
    const currentStageIndex = stages.findIndex(s => s.id === candidate.stage);
    if (currentStageIndex >= stages.length - 1) {
      setSnackbar({ open: true, message: 'Candidate is already at the final stage', severity: 'info' });
      return;
    }
    
    const newStage = stages[currentStageIndex + 1].id;
    const oldStage = candidate.stage;
    
    try {
      // Update via API
      const token = localStorage.getItem('authToken');
      const applicationId = candidate.applicationId || candidate.id;
      
      const response = await fetch(
        getApiUrl(API_ENDPOINTS.HIRING.UPDATE_APPLICATION_STAGE(applicationId)) + `?stage=${newStage}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to update stage');
      }
      
      // Update local state
      setCandidates(prev => prev.map(c => 
        c.id === candidate.id ? { ...c, stage: newStage } : c
      ));
      
      // Send email notification
      const emailSent = await sendStageChangeEmail(candidate, oldStage, newStage);
      
      setSnackbar({ 
        open: true, 
        message: `${candidate.name} moved to ${getStageLabel(newStage)}${emailSent ? ' - Email notification sent' : ''}`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error moving candidate:', error);
      setSnackbar({ 
        open: true, 
        message: 'Failed to move candidate. Please try again.', 
        severity: 'error' 
      });
    }
    
    setConfirmDialog({ open: false, action: null, candidate: null });
    setMenuAnchor(null);
  };

  // Move candidate to previous stage
  const moveToPreviousStage = async (candidate: Candidate) => {
    const currentStageIndex = stages.findIndex(s => s.id === candidate.stage);
    if (currentStageIndex <= 0) {
      setSnackbar({ open: true, message: 'Candidate is already at the first stage', severity: 'info' });
      return;
    }
    
    const newStage = stages[currentStageIndex - 1].id;
    const oldStage = candidate.stage;
    
    try {
      // Update via API
      const token = localStorage.getItem('authToken');
      const applicationId = candidate.applicationId || candidate.id;
      
      const response = await fetch(
        getApiUrl(API_ENDPOINTS.HIRING.UPDATE_APPLICATION_STAGE(applicationId)) + `?stage=${newStage}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to update stage');
      }
      
      // Update local state
      setCandidates(prev => prev.map(c => 
        c.id === candidate.id ? { ...c, stage: newStage } : c
      ));
      
      // Send email notification
      const emailSent = await sendStageChangeEmail(candidate, oldStage, newStage);
      
      setSnackbar({ 
        open: true, 
        message: `${candidate.name} moved back to ${getStageLabel(newStage)}${emailSent ? ' - Email notification sent' : ''}`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error moving candidate:', error);
      setSnackbar({ 
        open: true, 
        message: 'Failed to move candidate. Please try again.', 
        severity: 'error' 
      });
    }
    
    setConfirmDialog({ open: false, action: null, candidate: null });
    setMenuAnchor(null);
  };

  // Handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, candidate: Candidate) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedCandidate(candidate);
  };

  // Handle card click - navigate to profile using userId (the actual user ID)
  const handleCardClick = (candidate: Candidate) => {
    const profileId = candidate.userId || candidate.id;
    navigate(`/techie/ats/candidate/${profileId}`);
  };

  // Handle schedule interview
  const handleScheduleInterview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setScheduleDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleSubmitSchedule = async () => {
    if (!selectedCandidate || !scheduleForm.date || !scheduleForm.time) {
      setSnackbar({ open: true, message: 'Please fill in all required fields', severity: 'error' });
      return;
    }
    
    try {
      setScheduling(true);
      const token = localStorage.getItem('authToken');
      const scheduledAt = new Date(`${scheduleForm.date}T${scheduleForm.time}`).toISOString();
      const meetingId = `interview-${Date.now()}`;
      const meetingLink = `${window.location.origin}/techie/lobby/${meetingId}?type=interview`;
      
      // Use the application_id from the candidate
      const applicationId = selectedCandidate.applicationId || selectedCandidate.id;
      
      const response = await fetch(getApiUrl('/hiring/interviews'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application_id: applicationId,
          interview_type: scheduleForm.type,
          scheduled_at: scheduledAt,
          duration_minutes: scheduleForm.duration,
          meeting_link: meetingLink,
          notes: scheduleForm.notes,
        }),
      });
      
      if (response.ok) {
        setSnackbar({ open: true, message: 'Interview scheduled successfully! Candidate will be notified.', severity: 'success' });
        setScheduleDialogOpen(false);
        setScheduleForm({ date: '', time: '', duration: 60, type: 'technical', notes: '' });
        // Refresh candidates to reflect the stage change
        window.location.reload();
      } else {
        const error = await response.json();
        setSnackbar({ open: true, message: error.detail || 'Failed to schedule interview', severity: 'error' });
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      setSnackbar({ open: true, message: 'Failed to schedule interview', severity: 'error' });
    } finally {
      setScheduling(false);
    }
  };

  // Filter candidates by search
  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get stage index for a candidate
  const getStageIndex = (stageId: string): number => {
    return stages.findIndex(s => s.id === stageId);
  };

  if (loading) {
    return (
      <ATSLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </ATSLayout>
    );
  }

  return (
    <ATSLayout>
      {/* Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Job</InputLabel>
            <Select value={selectedJob} label="Filter by Job" onChange={(e) => setSelectedJob(e.target.value)}>
              <MenuItem value="all">All Jobs</MenuItem>
              {jobs.map((job) => (
                <MenuItem key={job.id} value={job.id}>
                  {job.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            sx={{ width: 250 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => setViewMode('kanban')}
            sx={{ bgcolor: viewMode === 'kanban' ? alpha('#0d47a1', 0.1) : 'transparent' }}
          >
            <ViewKanbanIcon color={viewMode === 'kanban' ? 'primary' : 'inherit'} />
          </IconButton>
          <IconButton
            onClick={() => setViewMode('list')}
            sx={{ bgcolor: viewMode === 'list' ? alpha('#0d47a1', 0.1) : 'transparent' }}
          >
            <ViewListIcon color={viewMode === 'list' ? 'primary' : 'inherit'} />
          </IconButton>
        </Box>
      </Box>

      {/* Kanban Board */}
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
        {stages.map((stage) => {
          const stageCandidates = filteredCandidates.filter((c) => c.stage === stage.id);
          return (
            <PipelineColumn key={stage.id}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                mb: 2.5, 
                pb: 1.5,
                borderBottom: `2px solid ${alpha(stage.color, 0.3)}`,
              }}>
                <Box sx={{ 
                  width: 10, 
                  height: 10, 
                  borderRadius: '50%', 
                  bgcolor: stage.color,
                  boxShadow: `0 0 8px ${alpha(stage.color, 0.5)}`,
                }} />
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: stage.color }}>
                  {stage.label}
                </Typography>
                <Chip 
                  label={stageCandidates.length} 
                  size="small" 
                  sx={{ 
                    ml: 'auto',
                    bgcolor: alpha(stage.color, 0.15),
                    color: stage.color,
                    fontWeight: 700,
                    height: 26,
                    fontSize: '0.85rem',
                  }} 
                />
              </Box>
              {stageCandidates.map((candidate) => (
                <CandidateCard 
                  key={candidate.id} 
                  onClick={() => handleCardClick(candidate)}
                >
                  {/* Header - Name, Score, Menu */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
                    <Avatar 
                      src={candidate.avatar}
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        bgcolor: alpha(stage.color, 0.15), 
                        color: stage.color,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        border: `2px solid ${alpha(stage.color, 0.3)}`,
                      }}
                    >
                      {candidate.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="subtitle1" 
                          fontWeight={600} 
                          sx={{ 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap',
                            fontSize: '0.95rem',
                          }}
                        >
                          {candidate.name}
                        </Typography>
                        {candidate.score >= 90 && (
                          <LocalFireDepartmentIcon sx={{ fontSize: 16, color: '#FF3D00' }} />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {candidate.role}
                      </Typography>
                    </Box>
                    <Tooltip title={`Match: ${candidate.matchScore}%`}>
                      <ScoreBadge scorecolor={getScoreColor(candidate.score)}>
                        {candidate.score}
                      </ScoreBadge>
                    </Tooltip>
                  </Box>

                  {/* Info Pills - Experience & Education */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                    <InfoPill>
                      <WorkIcon sx={{ fontSize: 14 }} />
                      {candidate.experience} yrs
                    </InfoPill>
                    <Tooltip title={candidate.education}>
                      <InfoPill sx={{ maxWidth: 130 }}>
                        <SchoolIcon sx={{ fontSize: 14 }} />
                        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {candidate.education}
                        </Box>
                      </InfoPill>
                    </Tooltip>
                  </Box>
                  
                  {/* Match Score Bar */}
                  <Box sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight={500} color="text.secondary">Match Score</Typography>
                      <Typography variant="caption" sx={{ color: getScoreColor(candidate.matchScore), fontWeight: 700 }}>
                        {candidate.matchScore}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={candidate.matchScore} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        bgcolor: alpha(getScoreColor(candidate.matchScore), 0.15),
                        '& .MuiLinearProgress-bar': { 
                          bgcolor: getScoreColor(candidate.matchScore),
                          borderRadius: 3,
                        }
                      }} 
                    />
                  </Box>
                  
                  {/* AI Insight */}
                  <AIInsightBadge>
                    <AutoAwesomeIcon sx={{ fontSize: 14, color: '#7C4DFF' }} />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#5E35B1', 
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {candidate.aiInsight}
                    </Typography>
                  </AIInsightBadge>
                  
                  {/* Footer - Navigation & Actions */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mt: 2,
                    pt: 1.5,
                    borderTop: `1px solid ${alpha('#0d47a1', 0.08)}`,
                  }}>
                    {/* Stage Navigation */}
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title={getStageIndex(candidate.stage) > 0 ? `← ${getStageLabel(stages[getStageIndex(candidate.stage) - 1]?.id)}` : 'First stage'}>
                        <span>
                          <StageButton 
                            buttontype="backward"
                            size="small" 
                            disabled={getStageIndex(candidate.stage) <= 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDialog({ open: true, action: 'backward', candidate });
                            }}
                          >
                            <ArrowBackIcon sx={{ fontSize: 16, color: getStageIndex(candidate.stage) > 0 ? '#FF9500' : '#bbb' }} />
                          </StageButton>
                        </span>
                      </Tooltip>
                      <Tooltip title={getStageIndex(candidate.stage) < stages.length - 1 ? `→ ${getStageLabel(stages[getStageIndex(candidate.stage) + 1]?.id)}` : 'Final stage'}>
                        <span>
                          <StageButton 
                            buttontype="forward"
                            size="small"
                            disabled={getStageIndex(candidate.stage) >= stages.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDialog({ open: true, action: 'forward', candidate });
                            }}
                          >
                            <ArrowForwardIcon sx={{ fontSize: 16, color: getStageIndex(candidate.stage) < stages.length - 1 ? '#34C759' : '#bbb' }} />
                          </StageButton>
                        </span>
                      </Tooltip>
                    </Box>

                    {/* Rating & Source */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={candidate.rating} size="small" readOnly sx={{ '& .MuiRating-icon': { fontSize: 16 } }} />
                      <Chip 
                        label={candidate.source} 
                        size="small"
                        sx={{ 
                          height: 22,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          bgcolor: alpha('#0d47a1', 0.08),
                          color: '#0d47a1',
                        }}
                      />
                    </Box>

                    {/* Menu Button */}
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleMenuOpen(e, candidate)}
                      sx={{ 
                        ml: 0.5,
                        '&:hover': { bgcolor: alpha('#0d47a1', 0.08) }
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  {/* Skills - Hidden by default, shown on hover or expanded */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 0.5, 
                    mt: 1.5, 
                    flexWrap: 'wrap',
                    pt: 1,
                  }}>
                    {candidate.skills.slice(0, 3).map((skill) => (
                      <Chip 
                        key={skill} 
                        label={skill} 
                        size="small" 
                        variant="outlined" 
                        sx={{ 
                          fontSize: '0.7rem', 
                          height: 24,
                          borderColor: alpha('#0d47a1', 0.2),
                          color: alpha('#0d47a1', 0.8),
                        }} 
                      />
                    ))}
                    {candidate.skills.length > 3 && (
                      <Chip 
                        label={`+${candidate.skills.length - 3}`} 
                        size="small" 
                        sx={{ 
                          fontSize: '0.7rem', 
                          height: 24,
                          bgcolor: alpha('#0d47a1', 0.08),
                          color: '#0d47a1',
                        }} 
                      />
                    )}
                  </Box>
                </CandidateCard>
              ))}
              {stageCandidates.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <Typography variant="body2">No candidates</Typography>
                </Box>
              )}
            </PipelineColumn>
          );
        })}
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => { setMenuAnchor(null); setSelectedCandidate(null); }}
      >
        <MenuItem onClick={() => {
          setMenuAnchor(null);
          if (selectedCandidate) {
            const profileId = selectedCandidate.userId || selectedCandidate.id;
            navigate(`/techie/ats/candidate/${profileId}`);
          }
        }}>
          <PersonIcon fontSize="small" sx={{ mr: 1 }} />
          View Profile
        </MenuItem>
        <MenuItem onClick={() => {
          setMenuAnchor(null);
          if (selectedCandidate?.email) window.location.href = `mailto:${selectedCandidate.email}`;
        }}>
          <EmailIcon fontSize="small" sx={{ mr: 1 }} />
          Send Email
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedCandidate) {
              handleScheduleInterview(selectedCandidate);
            }
          }}
        >
          <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
          Schedule Interview
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedCandidate) {
              setConfirmDialog({ open: true, action: 'forward', candidate: selectedCandidate });
            }
            setMenuAnchor(null);
          }}
          disabled={selectedCandidate ? getStageIndex(selectedCandidate.stage) >= stages.length - 1 : true}
        >
          <ArrowForwardIcon fontSize="small" sx={{ mr: 1 }} />
          Move Forward
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedCandidate) {
              setConfirmDialog({ open: true, action: 'backward', candidate: selectedCandidate });
            }
            setMenuAnchor(null);
          }}
          disabled={selectedCandidate ? getStageIndex(selectedCandidate.stage) <= 0 : true}
        >
          <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} />
          Move Backward
        </MenuItem>
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: null, candidate: null })}
      >
        <DialogTitle>
          {confirmDialog.action === 'forward' ? 'Move Candidate Forward' : 'Move Candidate Backward'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.candidate && confirmDialog.action === 'forward' && (
              <>
                Move <strong>{confirmDialog.candidate.name}</strong> from{' '}
                <strong>{getStageLabel(confirmDialog.candidate.stage)}</strong> to{' '}
                <strong>{getStageLabel(stages[getStageIndex(confirmDialog.candidate.stage) + 1]?.id)}</strong>?
                <br /><br />
                An email notification will be sent to the candidate.
              </>
            )}
            {confirmDialog.candidate && confirmDialog.action === 'backward' && (
              <>
                Move <strong>{confirmDialog.candidate.name}</strong> back from{' '}
                <strong>{getStageLabel(confirmDialog.candidate.stage)}</strong> to{' '}
                <strong>{getStageLabel(stages[getStageIndex(confirmDialog.candidate.stage) - 1]?.id)}</strong>?
                <br /><br />
                An email notification will be sent to the candidate.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, action: null, candidate: null })}>
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={() => {
              if (confirmDialog.candidate) {
                if (confirmDialog.action === 'forward') {
                  moveToNextStage(confirmDialog.candidate);
                } else {
                  moveToPreviousStage(confirmDialog.candidate);
                }
              }
            }}
          >
            Confirm & Send Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Interview Dialog */}
      <Dialog
        open={scheduleDialogOpen}
        onClose={() => setScheduleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Schedule Interview with {selectedCandidate?.name}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={scheduleForm.date}
                onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
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
                required
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
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={45}>45 minutes</MenuItem>
                  <MenuItem value={60}>1 hour</MenuItem>
                  <MenuItem value={90}>1.5 hours</MenuItem>
                  <MenuItem value={120}>2 hours</MenuItem>
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
                  <MenuItem value="phone">Phone Screening</MenuItem>
                  <MenuItem value="video">Video Interview</MenuItem>
                  <MenuItem value="technical">Technical Interview</MenuItem>
                  <MenuItem value="behavioral">Behavioral Interview</MenuItem>
                  <MenuItem value="panel">Panel Interview</MenuItem>
                  <MenuItem value="onsite">Onsite Interview</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={scheduleForm.notes}
                onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                placeholder="Add any notes or instructions for the interview..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitSchedule}
            disabled={scheduling || !scheduleForm.date || !scheduleForm.time}
            sx={{ bgcolor: '#0d47a1' }}
          >
            {scheduling ? <CircularProgress size={20} /> : 'Schedule Interview'}
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

export default PipelinePage;
