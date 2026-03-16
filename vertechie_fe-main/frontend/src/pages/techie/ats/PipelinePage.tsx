/**
 * PipelinePage - Kanban-style Candidate Pipeline
 * Stages: New Applicants → Shortlisted for Screening → Interview → Offer Stage → Hired | Rejected
 * Proceed/Reject from New; move forward/backward; email notifications on stage changes
 */

import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, Avatar, Chip, IconButton, TextField, FormControl,
  InputLabel, Select, MenuItem, InputAdornment, Button, Tooltip,
  LinearProgress, Menu, Snackbar, Alert, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText,
} from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ViewListIcon from '@mui/icons-material/ViewList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CancelIcon from '@mui/icons-material/Cancel';
import Grid from '@mui/material/Grid';
import ATSLayout from './ATSLayout';
import ScheduleInterviewModal from '../../../components/ats/ScheduleInterviewModal';
import { userService, jobService, getHRUserInfo } from '../../../services/jobPortalService';
import { interviewService } from '../../../services/interviewService';
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

// 7 Pipeline Stages (including Rejected)
const stages = [
  { id: 'new', label: 'New Applicants', color: '#0d47a1', index: 0 },
  { id: 'screening', label: 'Shortlisted for Screening', color: '#FF9500', index: 1 },
  { id: 'interview', label: 'Interview', color: '#5856D6', index: 2 },
  { id: 'offer', label: 'Offer Stage', color: '#34C759', index: 3 },
  { id: 'onboarding', label: 'Onboarding', color: '#00BCD4', index: 4 },
  { id: 'hired', label: 'Hired', color: '#00C853', index: 5 },
  { id: 'rejected', label: 'Rejected', color: '#FF3B30', index: 6 },
];

interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  stage: string;
  skills: string[];
  time?: string;
  score: number | null;
  matchScore: number | null;
  experience?: number | null;
  education?: string | null;
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

const parseNumberOrNull = (...values: unknown[]): number | null => {
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
};

const parseSkills = (...values: unknown[]): string[] => {
  const skillSet = new Set<string>();
  for (const value of values) {
    if (!value) continue;
    if (Array.isArray(value)) {
      value.forEach((skill) => {
        const normalized = String(skill || '').trim();
        if (normalized) skillSet.add(normalized);
      });
      continue;
    }
    if (typeof value === 'string') {
      value.split(',').forEach((skill) => {
        const normalized = skill.trim();
        if (normalized) skillSet.add(normalized);
      });
    }
  }
  return Array.from(skillSet);
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
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: 'forward' | 'backward' | 'reject' | null; candidate: Candidate | null }>({
    open: false, action: null, candidate: null
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Schedule Interview (unified modal)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduledInterviewApplicationIds, setScheduledInterviewApplicationIds] = useState<Set<string>>(new Set());

  // Fetch HM's interviews to show Reschedule vs Schedule Interview
  useEffect(() => {
    let cancelled = false;
    interviewService.getMyInterviewsAsInterviewer(true)
      .then((interviews: any[]) => {
        if (cancelled) return;
        const ids = new Set((interviews || []).map((i: any) => String(i.application_id)).filter(Boolean));
        setScheduledInterviewApplicationIds(ids);
      })
      .catch(() => { if (!cancelled) setScheduledInterviewApplicationIds(new Set()); });
    return () => { cancelled = true; };
  }, [scheduleDialogOpen]); // refetch when modal closes so after scheduling we show Reschedule

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
        
        // Map API data to pipeline format (no mock fallback values)
        const mappedCandidates: Candidate[] = data.map((candidate: any) => {
          // Ensure application_id is always set (use id as fallback since id is the application_id)
          const applicationId = candidate.application_id || candidate.id;
          const matchScore = parseNumberOrNull(candidate.matchScore, candidate.match_score, candidate.score);
          
          return {
            id: candidate.id || candidate.application_id,
            name: candidate.name || candidate.email?.split('@')?.[0] || 'Unknown',
            email: candidate.email || '',
            role: candidate.role || candidate.job_title || '',
            stage: candidate.stage || 'new',
            skills: parseSkills(candidate.skills, candidate.profile?.skills, candidate.applicant_skills),
            time: typeof candidate.time === 'string' ? candidate.time : '',
            score: matchScore,
            matchScore,
            experience: parseNumberOrNull(candidate.experience),
            education: candidate.education || null,
            avatar: candidate.avatar,
            applicationId: applicationId, // Always set with fallback
            userId: candidate.user_id,  // Store the actual user ID
            jobId: candidate.job_id,
            jobTitle: candidate.job_title,
          };
        });
        
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
          job_title: candidate.jobTitle || candidate.role,
        }),
      });
      
      return true;
    } catch (error) {
      console.warn('Email notification failed:', error);
      return false;
    }
  };

  // Forward path: new -> screening -> interview -> offer -> onboarding -> hired (rejected is separate)
  const getNextStageId = (stage: string): string | null => {
    const path = ['new', 'screening', 'interview', 'offer', 'onboarding', 'hired'];
    const idx = path.indexOf(stage);
    if (idx < 0 || idx >= path.length - 1) return null;
    return path[idx + 1];
  };

  // Move candidate to next stage (Proceed: New -> Screening -> Interview -> Offer -> Onboarding -> Hired)
  const moveToNextStage = async (candidate: Candidate) => {
    const newStage = getNextStageId(candidate.stage);
    if (!newStage) {
      setSnackbar({ open: true, message: 'Candidate is already at the final stage', severity: 'info' });
      return;
    }
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

  // Move candidate to previous stage (from Rejected: Restore to New)
  const moveToPreviousStage = async (candidate: Candidate) => {
    if (candidate.stage === 'new') {
      setSnackbar({ open: true, message: 'Candidate is already at the first stage', severity: 'info' });
      return;
    }
    const newStage = candidate.stage === 'rejected' ? 'new' : stages[getStageIndex(candidate.stage) - 1].id;
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

  // Reject applicant (move to Rejected stage and send email)
  const rejectCandidate = async (candidate: Candidate) => {
    const oldStage = candidate.stage;
    try {
      const token = localStorage.getItem('authToken');
      const applicationId = candidate.applicationId || candidate.id;
      const response = await fetch(
        getApiUrl(API_ENDPOINTS.HIRING.UPDATE_APPLICATION_STAGE(applicationId)) + '?stage=rejected',
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Failed to reject');
      setCandidates(prev => prev.map(c =>
        c.id === candidate.id ? { ...c, stage: 'rejected' } : c
      ));
      const emailSent = await sendStageChangeEmail(candidate, oldStage, 'rejected');
      setSnackbar({
        open: true,
        message: `${candidate.name} has been rejected${emailSent ? ' - Email notification sent' : ''}`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error rejecting candidate:', error);
      setSnackbar({ open: true, message: 'Failed to reject candidate. Please try again.', severity: 'error' });
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
    navigate(`/techie/ats/candidate/${profileId}`, {
      state: {
        pipelineCandidate: {
          matchScore: candidate.matchScore,
          stage: candidate.stage,
          time: candidate.time,
          jobId: candidate.jobId,
          jobTitle: candidate.jobTitle,
          role: candidate.role,
          applicationId: candidate.applicationId,
        },
      },
    });
  };

  // Handle schedule interview
  const handleScheduleInterview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setScheduleDialogOpen(true);
    setMenuAnchor(null);
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
                        {candidate.matchScore !== null && candidate.matchScore >= 90 && (
                          <LocalFireDepartmentIcon sx={{ fontSize: 16, color: '#FF3D00' }} />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {candidate.role}
                      </Typography>
                    </Box>
                    <Tooltip title={candidate.matchScore !== null ? `Match: ${candidate.matchScore}%` : 'Match score not available'}>
                      <ScoreBadge scorecolor={candidate.matchScore !== null ? getScoreColor(candidate.matchScore) : '#9e9e9e'}>
                        {candidate.matchScore !== null ? candidate.matchScore : '--'}
                      </ScoreBadge>
                    </Tooltip>
                  </Box>

                  {/* Info Pills - Experience & Education */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                    <InfoPill>
                      <WorkIcon sx={{ fontSize: 14 }} />
                      {candidate.experience ?? 0} yrs
                    </InfoPill>
                    <Tooltip title={candidate.education || 'Not provided'}>
                      <InfoPill sx={{ maxWidth: 130 }}>
                        <SchoolIcon sx={{ fontSize: 14 }} />
                        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {candidate.education || 'Not provided'}
                        </Box>
                      </InfoPill>
                    </Tooltip>
                    {candidate.time && (
                      <InfoPill>
                        <ScheduleIcon sx={{ fontSize: 14 }} />
                        {candidate.time}
                      </InfoPill>
                    )}
                  </Box>
                  
                  {/* Match Score Bar */}
                  <Box sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight={500} color="text.secondary">Match Score</Typography>
                      <Typography variant="caption" sx={{ color: candidate.matchScore !== null ? getScoreColor(candidate.matchScore) : '#777', fontWeight: 700 }}>
                        {candidate.matchScore !== null ? `${candidate.matchScore}%` : 'N/A'}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={candidate.matchScore ?? 0} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        bgcolor: alpha(getScoreColor(candidate.matchScore ?? 0), 0.15),
                        '& .MuiLinearProgress-bar': { 
                          bgcolor: getScoreColor(candidate.matchScore ?? 0),
                          borderRadius: 3,
                        }
                      }} 
                    />
                  </Box>
                  
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
                      <Tooltip title={candidate.stage === 'new' ? 'First stage' : candidate.stage === 'rejected' ? 'Restore to New Applicants' : `← ${getStageLabel(stages[getStageIndex(candidate.stage) - 1]?.id)}`}>
                        <span>
                          <StageButton 
                            buttontype="backward"
                            size="small" 
                            disabled={candidate.stage === 'new'}
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDialog({ open: true, action: 'backward', candidate });
                            }}
                          >
                            <ArrowBackIcon sx={{ fontSize: 16, color: candidate.stage !== 'new' ? '#FF9500' : '#bbb' }} />
                          </StageButton>
                        </span>
                      </Tooltip>
                      <Tooltip title={getNextStageId(candidate.stage) ? `Proceed → ${getStageLabel(getNextStageId(candidate.stage)!)}` : 'Final stage'}>
                        <span>
                          <StageButton 
                            buttontype="forward"
                            size="small"
                            disabled={!getNextStageId(candidate.stage)}
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDialog({ open: true, action: 'forward', candidate });
                            }}
                          >
                            <ArrowForwardIcon sx={{ fontSize: 16, color: getNextStageId(candidate.stage) ? '#34C759' : '#bbb' }} />
                          </StageButton>
                        </span>
                      </Tooltip>
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
            navigate(`/techie/ats/candidate/${profileId}`, {
              state: {
                pipelineCandidate: {
                  matchScore: selectedCandidate.matchScore,
                  stage: selectedCandidate.stage,
                  time: selectedCandidate.time,
                  jobId: selectedCandidate.jobId,
                  jobTitle: selectedCandidate.jobTitle,
                  role: selectedCandidate.role,
                  applicationId: selectedCandidate.applicationId,
                },
              },
            });
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
          {selectedCandidate && scheduledInterviewApplicationIds.has(String(selectedCandidate.applicationId || selectedCandidate.id)) ? 'Reschedule' : 'Schedule Interview'}
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedCandidate) {
              setConfirmDialog({ open: true, action: 'forward', candidate: selectedCandidate });
            }
            setMenuAnchor(null);
          }}
          disabled={selectedCandidate ? !getNextStageId(selectedCandidate.stage) : true}
        >
          <ArrowForwardIcon fontSize="small" sx={{ mr: 1 }} />
          Proceed to next stage
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedCandidate) {
              setConfirmDialog({ open: true, action: 'backward', candidate: selectedCandidate });
            }
            setMenuAnchor(null);
          }}
          disabled={selectedCandidate ? selectedCandidate.stage === 'new' : true}
        >
          <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} />
          Move Backward
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedCandidate) {
              setConfirmDialog({ open: true, action: 'reject', candidate: selectedCandidate });
            }
            setMenuAnchor(null);
          }}
          disabled={selectedCandidate ? selectedCandidate.stage === 'rejected' || selectedCandidate.stage === 'hired' : true}
          sx={{ color: 'error.main' }}
        >
          <CancelIcon fontSize="small" sx={{ mr: 1 }} />
          Reject
        </MenuItem>
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: null, candidate: null })}
      >
        <DialogTitle>
          {confirmDialog.action === 'reject'
            ? 'Reject Applicant'
            : confirmDialog.action === 'forward'
              ? 'Proceed to next stage'
              : 'Move Candidate Backward'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.candidate && confirmDialog.action === 'forward' && (
              <>
                Move <strong>{confirmDialog.candidate.name}</strong> from{' '}
                <strong>{getStageLabel(confirmDialog.candidate.stage)}</strong> to{' '}
                <strong>{getNextStageId(confirmDialog.candidate.stage) && getStageLabel(getNextStageId(confirmDialog.candidate.stage)!)}</strong>?
                <br /><br />
                An email notification will be sent to the candidate.
              </>
            )}
            {confirmDialog.candidate && confirmDialog.action === 'backward' && (
              <>
                {confirmDialog.candidate.stage === 'rejected' ? (
                  <>
                Restore <strong>{confirmDialog.candidate.name}</strong> to <strong>New Applicants</strong>?
                <br /><br />
                An email notification will be sent to the candidate.
                  </>
                ) : (
                  <>
                Move <strong>{confirmDialog.candidate.name}</strong> back from{' '}
                <strong>{getStageLabel(confirmDialog.candidate.stage)}</strong> to{' '}
                <strong>{getStageLabel(stages[getStageIndex(confirmDialog.candidate.stage) - 1]?.id)}</strong>?
                <br /><br />
                An email notification will be sent to the candidate.
                  </>
                )}
              </>
            )}
            {confirmDialog.candidate && confirmDialog.action === 'reject' && (
              <>
                Reject <strong>{confirmDialog.candidate.name}</strong>? They will be moved to <strong>Rejected</strong> and
                an email notification will be sent.
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
            color={confirmDialog.action === 'reject' ? 'error' : 'primary'}
            onClick={() => {
              if (confirmDialog.candidate) {
                if (confirmDialog.action === 'forward') {
                  moveToNextStage(confirmDialog.candidate);
                } else if (confirmDialog.action === 'backward') {
                  moveToPreviousStage(confirmDialog.candidate);
                } else if (confirmDialog.action === 'reject') {
                  rejectCandidate(confirmDialog.candidate);
                }
              }
            }}
          >
            {confirmDialog.action === 'reject' ? 'Reject & Send Email' : 'Confirm & Send Email'}
          </Button>
        </DialogActions>
      </Dialog>

      <ScheduleInterviewModal
        open={scheduleDialogOpen}
        onClose={() => setScheduleDialogOpen(false)}
        onSuccess={() => {
          setSnackbar({ open: true, message: 'Interview scheduled successfully! Candidate will be notified.', severity: 'success' });
          window.location.reload();
        }}
        onError={(msg) => setSnackbar({ open: true, message: msg, severity: 'error' })}
        context={selectedCandidate ? {
          applicationId: selectedCandidate.applicationId || selectedCandidate.id,
          candidateId: selectedCandidate.userId,
          candidateName: selectedCandidate.name,
          candidateEmail: selectedCandidate.email,
          jobId: selectedCandidate.jobId,
          jobTitle: selectedCandidate.jobTitle,
        } : null}
      />

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
