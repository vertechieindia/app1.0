/**
 * MyInterviews - Page for Techies to view their scheduled interviews
 * 
 * Features:
 * - View upcoming interviews
 * - See interview details (date, time, type, company)
 * - Join interview via meeting link
 * - View past interviews
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

// Icons
import WorkIcon from '@mui/icons-material/Work';
import VideocamIcon from '@mui/icons-material/Videocam';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HistoryIcon from '@mui/icons-material/History';

import { useMyInterviews } from '../../contexts/MyInterviewsContext';

import {
  interviewService,
  Interview,
  formatInterviewType,
  formatInterviewStatus,
  formatInterviewDate,
  formatInterviewTime,
  parseBackendDateTime,
} from '../../services/interviewService';

// Styled Components
const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
  padding: 24,
});

const InterviewCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  marginBottom: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  },
}));

const StatusChip = styled(Chip)<{ statuscolor?: string }>(({ statuscolor }) => ({
  backgroundColor: statuscolor || '#2196F3',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem',
}));

const MyInterviews: React.FC = () => {
  const navigate = useNavigate();
  const { activeTab, setStats, registerRefresh } = useMyInterviews();
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [pastInterviews, setPastInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Detail dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const upcoming = await interviewService.getMyInterviewsAsCandidate(true);
      setUpcomingInterviews(upcoming);

      const past = await interviewService.getMyInterviewsAsCandidate(false);
      const pastOnly = past.filter(
        (interview) => parseBackendDateTime(interview.scheduled_at) < new Date()
      );
      setPastInterviews(pastOnly);

      const count = await interviewService.getInterviewCount();
      setStats({
        upcoming: count.upcoming,
        past: pastOnly.length,
        total: count.total,
      });
    } catch (err: any) {
      console.error('Failed to fetch interviews:', err);
      setError(err.message || 'Failed to load interviews');
    } finally {
      setLoading(false);
    }
  }, [setStats]);

  useEffect(() => {
    registerRefresh(fetchInterviews);
  }, [registerRefresh, fetchInterviews]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const resolveInternalMeetingPath = (rawLink: string): string | null => {
    const link = String(rawLink || '').trim();
    if (!link) return null;
    const normalizePath = (path: string) => {
      if (path.startsWith('/techie/lobby/') || path.startsWith('/techie/meet/')) return path;
      if (path.startsWith('/lobby/') || path.startsWith('/meet/')) return `/techie${path}`;
      return '';
    };
    try {
      const url = new URL(link, window.location.origin);
      const normalizedPath = normalizePath(url.pathname);
      if (!normalizedPath) return null;
      return `${normalizedPath}${url.search}${url.hash}`;
    } catch {
      const normalizedPath = normalizePath(link);
      if (normalizedPath) return normalizedPath;
      return null;
    }
  };

  const handleJoinInterview = (interview: Interview, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const link = String(interview.meeting_link || '').trim();
    if (link) {
      const internalPath = resolveInternalMeetingPath(link);
      if (internalPath) {
        navigate(internalPath);
        return;
      }
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleViewDetails = (interview: Interview) => {
    setSelectedInterview(interview);
    setDetailDialogOpen(true);
  };

  const renderInterviewCard = (interview: Interview) => {
    const status = formatInterviewStatus(interview.status);
    const now = new Date();
    const scheduledTime = parseBackendDateTime(interview.scheduled_at);
    const timeDiffMinutes = (scheduledTime.getTime() - now.getTime()) / (1000 * 60);
    const isUpcoming = scheduledTime > now;
    
    // Can join if:
    // - Has meeting link
    // - Not cancelled or completed
    // - Within 15 minutes before the scheduled time OR after the scheduled time (up to duration + 30 min buffer)
    const durationMinutes = interview.duration_minutes || 60;
    const canJoinWindow = timeDiffMinutes <= 15 && timeDiffMinutes >= -(durationMinutes + 30);
    const canJoin = interview.meeting_link && 
                   interview.status !== 'cancelled' && 
                   interview.status !== 'completed' &&
                   (canJoinWindow || isUpcoming);

    return (
      <InterviewCard 
        key={interview.id}
        onClick={() => handleViewDetails(interview)}
        sx={{ cursor: 'pointer' }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: '#0d47a1',
                  width: 56,
                  height: 56,
                }}
              >
                <VideocamIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} color="#0d47a1">
                  {formatInterviewType(interview.interview_type)}
                </Typography>
                {interview.job_title && (
                  <Typography variant="body2" color="text.secondary">
                    <WorkIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                    {interview.job_title}
                  </Typography>
                )}
                {interview.company_name && (
                  <Typography variant="body2" color="text.secondary">
                    <BusinessIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                    {interview.company_name}
                  </Typography>
                )}
              </Box>
            </Box>
            <StatusChip label={status.label} statuscolor={status.color} size="small" />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon sx={{ color: '#666', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                {formatInterviewDate(interview.scheduled_at)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon sx={{ color: '#666', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                {formatInterviewTime(interview.scheduled_at)} ({interview.duration_minutes} mins)
              </Typography>
            </Box>
          </Box>

          {interview.notes && (
            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                📝 {interview.notes}
              </Typography>
            </Box>
          )}

          {canJoin && (
            <Button
              variant="contained"
              startIcon={<VideocamIcon />}
              onClick={(e) => handleJoinInterview(interview, e)}
              sx={{
                bgcolor: canJoinWindow ? '#4CAF50' : '#2196F3',
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                animation: canJoinWindow ? 'pulse 1.5s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)' },
                  '70%': { boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)' },
                  '100%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' },
                },
                '&:hover': { bgcolor: canJoinWindow ? '#388E3C' : '#1976D2' },
              }}
            >
              {canJoinWindow ? '🔴 Join Now' : 'Join Interview'}
            </Button>
          )}
        </CardContent>
      </InterviewCard>
    );
  };

  const renderEmptyState = (message: string, icon: React.ReactNode) => (
    <Paper
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: 4,
        bgcolor: 'white',
      }}
    >
      <Box sx={{ color: '#ccc', mb: 2 }}>{icon}</Box>
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        When you apply for jobs and get interview invitations, they will appear here.
      </Typography>
    </Paper>
  );

  return (
    <PageContainer>
      <Box maxWidth={800} mx="auto">
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={200}
                sx={{ borderRadius: 4, mb: 2 }}
              />
            ))}
          </Box>
        ) : activeTab === 'upcoming' ? (
          upcomingInterviews.length > 0
            ? upcomingInterviews.map(renderInterviewCard)
            : renderEmptyState(
                'No upcoming interviews',
                <EventAvailableIcon sx={{ fontSize: 64 }} />
              )
        ) : pastInterviews.length > 0
          ? pastInterviews.map(renderInterviewCard)
          : renderEmptyState(
              'No past interviews',
              <HistoryIcon sx={{ fontSize: 64 }} />
            )}

        {/* Interview Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Interview Details
            {selectedInterview && (
              <Chip
                label={formatInterviewStatus(selectedInterview.status).label}
                sx={{
                  bgcolor: formatInterviewStatus(selectedInterview.status).color,
                  color: 'white',
                }}
                size="small"
              />
            )}
          </DialogTitle>
          <DialogContent>
            {selectedInterview && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {/* Job Info */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: alpha('#0d47a1', 0.03) }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#0d47a1', width: 48, height: 48 }}>
                        <VideocamIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {formatInterviewType(selectedInterview.interview_type)}
                        </Typography>
                        {selectedInterview.job_title && (
                          <Typography variant="body2" color="text.secondary">
                            <WorkIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                            {selectedInterview.job_title}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                {/* Date & Time */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatInterviewDate(selectedInterview.scheduled_at)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Time</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatInterviewTime(selectedInterview.scheduled_at)}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedInterview.duration_minutes} minutes
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Company</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedInterview.company_name || 'N/A'}
                  </Typography>
                </Grid>

                {selectedInterview.location && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                    <Typography variant="body1">{selectedInterview.location}</Typography>
                  </Grid>
                )}

                {selectedInterview.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                    <Paper sx={{ p: 2, bgcolor: '#f5f5f5', mt: 0.5 }}>
                      <Typography variant="body2">{selectedInterview.notes}</Typography>
                    </Paper>
                  </Grid>
                )}

                {/* Status Info */}
                {selectedInterview.status === 'cancelled' && (
                  <Grid item xs={12}>
                    <Alert severity="error">
                      This interview has been cancelled. Please check your notifications for updates.
                    </Alert>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5, gap: 1 }}>
            {selectedInterview && 
             selectedInterview.status !== 'cancelled' && 
             selectedInterview.meeting_link && 
             parseBackendDateTime(selectedInterview.scheduled_at) > new Date() && (
              <Button
                variant="contained"
                startIcon={<VideocamIcon />}
                onClick={() => handleJoinInterview(selectedInterview)}
                sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' } }}
              >
                Join Interview
              </Button>
            )}
            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default MyInterviews;
