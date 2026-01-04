/**
 * My Applications Page
 * Display all jobs applied by the user with application status
 * Theme: Vine (#00bf8f → #001510)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Skeleton,
  Alert,
  Paper,
  Tabs,
  Tab,
  alpha,
  keyframes,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as PendingIcon,
  Star as StarIcon,
  OpenInNew as OpenInNewIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { Application, ApplicationStatus, APPLICATION_STATUS_LABELS, JOB_TYPES } from '../../types/jobPortal';
import { applicationService, getUserInfo } from '../../services/jobPortalService';

// Theme Colors - Vine Palette (Dark Version)
// Theme Colors - VerTechie Blue Palette (Matching App Theme)
const colors = {
  primary: '#0d47a1',
  primaryDark: '#1a237e',
  primaryLight: '#5AC8FA',
  secondary: '#0077B5',
  secondaryLight: '#42A5F5',
  headerDark: '#1a237e',
  headerMid: '#0d47a1',
  accent: '#5AC8FA',
  accentDark: '#0077B5',
  background: '#f5f7fa',
  surface: '#ffffff',
  text: '#1a237e',
  textLight: '#4B5563',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  purple: '#1a237e',
};

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100%',
  background: `linear-gradient(160deg, #e8eef7 0%, #f0f4fa 30%, #f5f7fa 60%, #fafbfd 100%)`,
}));

const HeroSection = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 50%, ${colors.primaryLight} 100%)`,
  borderRadius: 28,
  padding: theme.spacing(5),
  color: 'white',
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeInUp} 0.6s ease-out`,
  boxShadow: `0 20px 60px ${colors.primary}40`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -80,
    right: -80,
    width: 250,
    height: 250,
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
    animation: `${float} 6s ease-in-out infinite`,
  },
}));

const ApplicationCard = styled(Card)(({ theme }) => ({
  background: colors.surface,
  borderRadius: 20,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${colors.accent}40`,
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeInUp} 0.6s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background: `linear-gradient(180deg, ${colors.primary}, ${colors.accent})`,
  },
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: `0 20px 50px ${colors.primary}15`,
    borderColor: colors.primary,
  },
}));

const StatusChip = styled(Chip)<{ status: ApplicationStatus }>(({ status }) => ({
  fontWeight: 700,
  borderRadius: 10,
  padding: '4px 8px',
  ...(status === 'applied' && {
    background: alpha(colors.info, 0.12),
    color: '#1565c0',
    border: `1px solid ${alpha(colors.info, 0.3)}`,
  }),
  ...(status === 'shortlisted' && {
    background: alpha(colors.success, 0.12),
    color: colors.primaryDark,
    border: `1px solid ${alpha(colors.success, 0.3)}`,
  }),
  ...(status === 'rejected' && {
    background: alpha(colors.error, 0.12),
    color: colors.error,
    border: `1px solid ${alpha(colors.error, 0.3)}`,
  }),
  ...(status === 'hired' && {
    background: alpha(colors.purple, 0.12),
    color: '#7b1fa2',
    border: `1px solid ${alpha(colors.purple, 0.3)}`,
  }),
}));

const StatCard = styled(Paper)(({ theme }) => ({
  background: colors.surface,
  border: `1px solid ${colors.accent}40`,
  borderRadius: 20,
  padding: theme.spacing(3),
  color: colors.text,
  textAlign: 'center',
  transition: 'all 0.3s ease',
  animation: `${fadeInUp} 0.6s ease-out`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 15px 40px ${colors.primary}15`,
    borderColor: colors.primary,
  },
}));

const getStatusIcon = (status: ApplicationStatus) => {
  switch (status) {
    case 'applied':
      return <PendingIcon sx={{ color: colors.info }} />;
    case 'shortlisted':
      return <CheckCircleIcon sx={{ color: colors.primary }} />;
    case 'rejected':
      return <CancelIcon sx={{ color: colors.error }} />;
    case 'hired':
      return <StarIcon sx={{ color: colors.purple }} />;
    default:
      return <PendingIcon />;
  }
};

const MyApplications: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const user = getUserInfo();

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, tabValue]);

  const loadApplications = async () => {
    if (!user) {
      setError('Please login to view your applications');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const apps = await applicationService.getApplicationsByUser(user.id);
      setApplications(apps);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    switch (tabValue) {
      case 1:
        filtered = filtered.filter((a) => a.status === 'applied');
        break;
      case 2:
        filtered = filtered.filter((a) => a.status === 'shortlisted');
        break;
      case 3:
        filtered = filtered.filter((a) => a.status === 'rejected');
        break;
      case 4:
        filtered = filtered.filter((a) => a.status === 'hired');
        break;
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

    setFilteredApplications(filtered);
  };

  const getStats = () => ({
    total: applications.length,
    applied: applications.filter((a) => a.status === 'applied').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    hired: applications.filter((a) => a.status === 'hired').length,
  });

  const stats = getStats();

  return (
    <PageContainer>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/techie/jobs')}
          sx={{
            color: colors.secondary,
            fontWeight: 600,
            mb: 3,
            background: colors.surface,
            border: `2px solid ${colors.accent}`,
            borderRadius: 3,
            px: 3,
            '&:hover': { 
              background: colors.primary,
              color: 'white',
              borderColor: colors.primary,
            },
          }}
        >
          Browse Jobs
        </Button>

        {/* Hero Section */}
        <HeroSection elevation={0}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              My Applications
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
              Track the status of all your job applications
            </Typography>
          </Box>
        </HeroSection>

        {/* Stats Section */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={2.4}>
            <StatCard elevation={0}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.secondary }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textLight }}>
                Total
              </Typography>
            </StatCard>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <StatCard elevation={0}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.info }}>
                {stats.applied}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textLight }}>
                Pending
              </Typography>
            </StatCard>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <StatCard elevation={0}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.primary }}>
                {stats.shortlisted}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textLight }}>
                Shortlisted
              </Typography>
            </StatCard>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <StatCard elevation={0}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.error }}>
                {stats.rejected}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textLight }}>
                Rejected
              </Typography>
            </StatCard>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <StatCard elevation={0}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.purple }}>
                {stats.hired}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textLight }}>
                Hired
              </Typography>
            </StatCard>
          </Grid>
        </Grid>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Paper sx={{ 
          borderRadius: 5, 
          mb: 4, 
          bgcolor: colors.surface,
          border: `1px solid ${colors.accent}40`,
          overflow: 'hidden',
        }}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 56,
                fontSize: '0.95rem',
                color: colors.textLight,
                '&.Mui-selected': {
                  color: colors.primary,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: colors.primary,
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab label={`All (${stats.total})`} />
            <Tab label={`Pending (${stats.applied})`} />
            <Tab label={`Shortlisted (${stats.shortlisted})`} />
            <Tab label={`Rejected (${stats.rejected})`} />
            <Tab label={`Hired (${stats.hired})`} />
          </Tabs>
        </Paper>

        {/* Applications List */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} key={i}>
                <Skeleton
                  variant="rounded"
                  height={180}
                  sx={{ borderRadius: 5, bgcolor: `${colors.accent}40` }}
                />
              </Grid>
            ))}
          </Grid>
        ) : filteredApplications.length === 0 ? (
          <Paper
            sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: 5,
              background: colors.surface,
              border: `2px dashed ${colors.accent}`,
              boxShadow: `0 10px 40px ${colors.primary}10`,
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primaryLight} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 3,
              }}
            >
              <AssignmentIcon sx={{ fontSize: 48, color: colors.primary }} />
            </Box>
            <Typography variant="h5" sx={{ color: colors.secondary, mb: 1, fontWeight: 700 }}>
              {applications.length === 0
                ? 'No applications yet'
                : 'No applications in this category'}
            </Typography>
            <Typography variant="body1" sx={{ color: colors.textLight, mb: 3, maxWidth: 400, mx: 'auto' }}>
              {applications.length === 0
                ? 'Start applying for jobs to see your applications here'
                : 'Try viewing a different category'}
            </Typography>
            {applications.length === 0 && (
              <Button
                variant="contained"
                onClick={() => navigate('/techie/jobs')}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: `0 8px 25px ${colors.primary}40`,
                  '&:hover': {
                    boxShadow: `0 12px 35px ${colors.primary}50`,
                  },
                }}
              >
                Browse Jobs
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredApplications.map((application) => (
              <Grid item xs={12} key={application.id}>
                <ApplicationCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        {/* Job Title & Company */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: 3,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primaryLight} 100%)`,
                              color: 'white',
                              boxShadow: `0 6px 20px ${colors.primary}40`,
                            }}
                          >
                            <WorkIcon sx={{ fontSize: 28 }} />
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                              {application.job?.title || 'Job Title'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                              <BusinessIcon fontSize="small" />
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {application.job?.companyName || 'Company'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Job Info */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, ml: 9 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <LocationIcon fontSize="small" />
                            <Typography variant="body2">
                              {application.job?.location || 'Location'}
                            </Typography>
                          </Box>
                          <Chip
                            label={application.job ? JOB_TYPES[application.job.jobType] : 'Full-time'}
                            size="small"
                            sx={{ fontWeight: 500, bgcolor: 'grey.100' }}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <CalendarIcon fontSize="small" />
                            <Typography variant="body2">
                              Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Coding Score */}
                        {application.codingScore !== undefined && (
                          <Box sx={{ ml: 9, mb: 1 }}>
                            <Chip
                              label={`Coding Score: ${application.codingScore}%`}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                bgcolor:
                                  application.codingScore >= 80
                                    ? alpha('#00d4aa', 0.12)
                                    : application.codingScore >= 60
                                    ? alpha('#ffc107', 0.12)
                                    : alpha('#ff4d6a', 0.12),
                                color:
                                  application.codingScore >= 80
                                    ? '#00a085'
                                    : application.codingScore >= 60
                                    ? '#d39e00'
                                    : '#ff4d6a',
                              }}
                            />
                          </Box>
                        )}
                      </Box>

                      {/* Status & Actions */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(application.status)}
                          <StatusChip
                            label={APPLICATION_STATUS_LABELS[application.status]}
                            status={application.status}
                          />
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          endIcon={<OpenInNewIcon fontSize="small" />}
                          onClick={() => navigate(`/techie/jobs/${application.jobId}`)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          View Job
                        </Button>
                      </Box>
                    </Box>

                    {/* Status Message */}
                    {application.status === 'shortlisted' && (
                      <Alert
                        severity="success"
                        icon={<CheckCircleIcon />}
                        sx={{ mt: 2, borderRadius: 2, ml: 9 }}
                      >
                        Congratulations! You've been shortlisted for this position. The hiring team will contact you soon.
                      </Alert>
                    )}
                    {application.status === 'rejected' && (
                      <Alert
                        severity="error"
                        icon={<CancelIcon />}
                        sx={{ mt: 2, borderRadius: 2, ml: 9 }}
                      >
                        Unfortunately, your application was not selected. Keep applying to other opportunities!
                      </Alert>
                    )}
                    {application.status === 'hired' && (
                      <Alert
                        severity="info"
                        icon={<StarIcon />}
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          ml: 9,
                          bgcolor: alpha('#9c27b0', 0.1),
                          color: '#7b1fa2',
                          '& .MuiAlert-icon': { color: '#9c27b0' },
                        }}
                      >
                        🎉 Congratulations! You've been hired for this position!
                      </Alert>
                    )}
                  </CardContent>
                </ApplicationCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </PageContainer>
  );
};

export default MyApplications;


