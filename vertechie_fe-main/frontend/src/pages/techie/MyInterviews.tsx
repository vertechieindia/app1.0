/**
 * MyInterviews - Page for Techies to view their scheduled interviews
 * 
 * Features:
 * - View upcoming interviews
 * - See interview details (date, time, type, company)
 * - Join interview via meeting link
 * - View past interviews
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Skeleton,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import VideocamIcon from '@mui/icons-material/Videocam';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HistoryIcon from '@mui/icons-material/History';

import {
  interviewService,
  Interview,
  formatInterviewType,
  formatInterviewStatus,
  formatInterviewDate,
  formatInterviewTime,
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const MyInterviews: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [pastInterviews, setPastInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interviewCount, setInterviewCount] = useState({ upcoming: 0, total: 0 });

  const fetchInterviews = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch upcoming interviews
      const upcoming = await interviewService.getMyInterviewsAsCandidate(true);
      setUpcomingInterviews(upcoming);

      // Fetch past interviews
      const past = await interviewService.getMyInterviewsAsCandidate(false);
      // Filter out upcoming ones from past
      const pastOnly = past.filter(
        (interview) => new Date(interview.scheduled_at) < new Date()
      );
      setPastInterviews(pastOnly);

      // Fetch count
      const count = await interviewService.getInterviewCount();
      setInterviewCount(count);
    } catch (err: any) {
      console.error('Failed to fetch interviews:', err);
      setError(err.message || 'Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleJoinInterview = (interview: Interview) => {
    if (interview.meeting_link) {
      // Extract room ID from meeting link and navigate to lobby
      if (interview.meeting_link.includes('/techie/lobby/')) {
        window.location.href = interview.meeting_link;
      } else {
        window.open(interview.meeting_link, '_blank');
      }
    }
  };

  const renderInterviewCard = (interview: Interview) => {
    const status = formatInterviewStatus(interview.status);
    const isUpcoming = new Date(interview.scheduled_at) > new Date();
    const canJoin = isUpcoming && interview.meeting_link && interview.status !== 'cancelled';

    return (
      <InterviewCard key={interview.id}>
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
              onClick={() => handleJoinInterview(interview)}
              sx={{
                bgcolor: '#4CAF50',
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: '#388E3C' },
              }}
            >
              Join Interview
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
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'white' }}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight={700} color="#0d47a1">
                My Interviews
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {interviewCount.upcoming} upcoming • {interviewCount.total} total
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={fetchInterviews} sx={{ bgcolor: 'white' }}>
            <RefreshIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Paper sx={{ borderRadius: 4, mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
              },
            }}
          >
            <Tab
              icon={<EventAvailableIcon />}
              iconPosition="start"
              label={`Upcoming (${upcomingInterviews.length})`}
            />
            <Tab
              icon={<HistoryIcon />}
              iconPosition="start"
              label={`Past (${pastInterviews.length})`}
            />
          </Tabs>
        </Paper>

        {/* Content */}
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
        ) : (
          <>
            <TabPanel value={activeTab} index={0}>
              {upcomingInterviews.length > 0
                ? upcomingInterviews.map(renderInterviewCard)
                : renderEmptyState(
                    'No upcoming interviews',
                    <EventAvailableIcon sx={{ fontSize: 64 }} />
                  )}
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {pastInterviews.length > 0
                ? pastInterviews.map(renderInterviewCard)
                : renderEmptyState(
                    'No past interviews',
                    <HistoryIcon sx={{ fontSize: 64 }} />
                  )}
            </TabPanel>
          </>
        )}
      </Box>
    </PageContainer>
  );
};

export default MyInterviews;
