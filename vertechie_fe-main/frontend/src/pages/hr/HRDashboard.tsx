/**
 * HR Dashboard
 * Main dashboard for HR users with welcome section, create job button, and job list
 * Theme: Poncho (#403a3e → #be5869)
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
  IconButton,
  Skeleton,
  Alert,
  Paper,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  alpha,
  keyframes,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add as AddIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  PlayArrow as PlayArrowIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  AutoAwesome as SparkleIcon,
} from '@mui/icons-material';
import { Job, JOB_TYPES, EXPERIENCE_LEVELS } from '../../types/jobPortal';
import { jobService, getHRUserInfo } from '../../services/jobPortalService';

// Theme Colors - Poncho Palette
const colors = {
  primary: '#be5869',      // Poncho Rose
  primaryDark: '#a04857',
  primaryLight: '#d4899b',
  secondary: '#403a3e',    // Dark Gray
  secondaryLight: '#5a5358',
  accent: '#e8b4bc',
  background: '#fafafa',
  surface: '#ffffff',
  text: '#403a3e',
  textLight: '#6b6369',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
};

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Styled Components
const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${colors.background} 0%, #fff5f7 50%, #f8f4f5 100%)`,
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '400px',
    background: `linear-gradient(135deg, ${colors.primary}08 0%, ${colors.accent}15 100%)`,
    zIndex: 0,
  },
}));

const WelcomeCard = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
  borderRadius: 24,
  padding: theme.spacing(5),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: theme.spacing(4),
  animation: `${fadeInUp} 0.6s ease-out`,
  boxShadow: `0 20px 60px ${colors.primary}40`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -80,
    right: -80,
    width: 250,
    height: 250,
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    animation: `${float} 6s ease-in-out infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -60,
    left: '30%',
    width: 200,
    height: 200,
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
    animation: `${float} 8s ease-in-out infinite reverse`,
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  background: colors.surface,
  borderRadius: 20,
  padding: theme.spacing(3),
  color: colors.text,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${colors.accent}40`,
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeInUp} 0.6s ease-out`,
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 25px 50px ${colors.primary}20`,
    borderColor: colors.primary,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary})`,
  },
}));

const JobCard = styled(Card)(({ theme }) => ({
  background: colors.surface,
  borderRadius: 20,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${colors.accent}30`,
  boxShadow: '0 4px 20px rgba(64, 58, 62, 0.08)',
  animation: `${fadeInUp} 0.6s ease-out`,
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: `0 20px 50px ${colors.primary}15`,
    borderColor: colors.primary,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background: `linear-gradient(180deg, ${colors.primary}, ${colors.accent})`,
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
  color: 'white',
  borderRadius: 14,
  padding: '14px 32px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: `0 8px 30px ${colors.primary}50`,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondary} 100%)`,
    boxShadow: `0 12px 40px ${colors.primary}60`,
    transform: 'translateY(-2px)',
    '&::before': {
      left: '100%',
    },
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  background: colors.surface,
  color: colors.primary,
  borderRadius: 12,
  padding: '12px 24px',
  fontSize: '0.95rem',
  fontWeight: 600,
  textTransform: 'none',
  border: `2px solid ${colors.primary}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: colors.primary,
    color: 'white',
    boxShadow: `0 8px 25px ${colors.primary}40`,
    transform: 'translateY(-2px)',
  },
}));

const StatusChip = styled(Chip)<{ status: string }>(({ status }) => ({
  fontWeight: 700,
  borderRadius: 10,
  fontSize: '0.75rem',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  ...(status === 'active' && {
    background: `linear-gradient(135deg, ${alpha(colors.success, 0.15)} 0%, ${alpha(colors.success, 0.1)} 100%)`,
    color: colors.success,
    border: `1px solid ${alpha(colors.success, 0.3)}`,
  }),
  ...(status === 'closed' && {
    background: `linear-gradient(135deg, ${alpha(colors.error, 0.15)} 0%, ${alpha(colors.error, 0.1)} 100%)`,
    color: colors.error,
    border: `1px solid ${alpha(colors.error, 0.3)}`,
  }),
  ...(status === 'draft' && {
    background: `linear-gradient(135deg, ${alpha(colors.warning, 0.15)} 0%, ${alpha(colors.warning, 0.1)} 100%)`,
    color: colors.warning,
    border: `1px solid ${alpha(colors.warning, 0.3)}`,
  }),
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  borderRadius: 10,
  fontWeight: 500,
  background: `linear-gradient(135deg, ${colors.accent}30 0%, ${colors.primaryLight}20 100%)`,
  color: colors.secondary,
  border: `1px solid ${colors.accent}60`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: colors.primary,
    color: 'white',
    transform: 'scale(1.05)',
  },
}));

const IconBox = styled(Box)<{ gradient?: string }>(({ gradient }) => ({
  width: 60,
  height: 60,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: gradient || `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
  boxShadow: `0 8px 20px ${colors.primary}30`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'rotate(5deg) scale(1.1)',
  },
}));

const HRDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const hrUser = getHRUserInfo();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const hrId = hrUser?.id || 'hr-user';
      const fetchedJobs = await jobService.getJobsByHR(hrId);
      // If HR has no jobs yet, show all jobs as demo
      if (fetchedJobs.length === 0) {
        const allJobs = await jobService.getAllActiveJobs();
        setJobs(allJobs);
      } else {
        setJobs(fetchedJobs);
      }
    } catch (err) {
      setError('Failed to load jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, jobId: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedJobId(jobId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJobId(null);
  };

  const handleViewApplicants = () => {
    if (selectedJobId) {
      navigate(`/hr/job/${selectedJobId}/applicants`);
    }
    handleMenuClose();
  };

  const handleEditJob = () => {
    if (selectedJobId) {
      navigate(`/hr/job/${selectedJobId}/edit`);
    }
    handleMenuClose();
  };

  const handleToggleJobStatus = async () => {
    if (!selectedJobId) return;
    
    const job = jobs.find(j => j.id === selectedJobId);
    if (!job) return;

    try {
      if (job.status === 'active') {
        await jobService.closeJob(selectedJobId);
      } else {
        await jobService.reopenJob(selectedJobId);
      }
      await loadJobs();
    } catch (err) {
      console.error('Failed to update job status:', err);
    }
    handleMenuClose();
  };

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'active').length,
    totalApplicants: jobs.reduce((sum, job) => sum + (job.applicantCount || 0), 0),
  };

  return (
    <DashboardContainer>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Welcome Section */}
        <WelcomeCard elevation={0}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Main row - flex with space-between */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Left side - User info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Avatar
                  sx={{
                    width: 66,
                    height: 66,
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
                  }}
                >
                  {hrUser?.name?.charAt(0) || 'H'}
                </Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                    <SparkleIcon sx={{ fontSize: 14, opacity: 0.9 }} />
                    <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500, letterSpacing: 1, fontSize: '0.7rem' }}>
                      WELCOME BACK
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                    {hrUser?.name || 'HR Manager'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, opacity: 0.85, mt: 0.25 }}>
                    <BusinessIcon sx={{ fontSize: 14 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                      {hrUser?.companyName || 'Your Company'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 1.5, maxWidth: 500, lineHeight: 1.6 }}>
                    Manage your job postings, review applications, and discover the perfect talent for your team.
                  </Typography>
                </Box>
              </Box>

              {/* Right side - Button */}
              <PrimaryButton
                startIcon={<AddIcon />}
                onClick={() => navigate('/hr/create-job')}
                sx={{ 
                  background: 'white',
                  color: colors.primary,
                  py: 1.5,
                  px: 3,
                  '&:hover': {
                    background: colors.accent,
                    color: colors.secondary,
                  },
                }}
              >
                Create New Job Post
              </PrimaryButton>
            </Box>
          </Box>
        </WelcomeCard>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={4}>
            <StatCard elevation={0} sx={{ animationDelay: '0.1s' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <IconBox gradient={`linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryLight} 100%)`}>
                  <AssignmentIcon sx={{ fontSize: 28, color: 'white' }} />
                </IconBox>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: colors.secondary, lineHeight: 1 }}>
                    {stats.totalJobs}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textLight, fontWeight: 500, mt: 0.5 }}>
                    Total Job Posts
                  </Typography>
                </Box>
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard elevation={0} sx={{ animationDelay: '0.2s' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <IconBox gradient={`linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`}>
                  <TrendingUpIcon sx={{ fontSize: 28, color: 'white' }} />
                </IconBox>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: colors.secondary, lineHeight: 1 }}>
                    {stats.activeJobs}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textLight, fontWeight: 500, mt: 0.5 }}>
                    Active Listings
                  </Typography>
                </Box>
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard elevation={0} sx={{ animationDelay: '0.3s' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <IconBox gradient={`linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`}>
                  <PeopleIcon sx={{ fontSize: 28, color: 'white' }} />
                </IconBox>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: colors.secondary, lineHeight: 1 }}>
                    {stats.totalApplicants}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textLight, fontWeight: 500, mt: 0.5 }}>
                    Total Applicants
                  </Typography>
                </Box>
              </Box>
            </StatCard>
          </Grid>
        </Grid>

        {/* Jobs Section Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          pb: 2,
          borderBottom: `2px solid ${colors.accent}40`,
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: colors.secondary }}>
              My Job Posts
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textLight, mt: 0.5 }}>
              Manage and track all your job listings
            </Typography>
          </Box>
          <SecondaryButton
            startIcon={<AddIcon />}
            onClick={() => navigate('/hr/create-job')}
          >
            New Job
          </SecondaryButton>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 3,
              border: `1px solid ${colors.error}40`,
              background: `${alpha(colors.error, 0.08)}`,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Jobs List */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} key={i}>
                <Skeleton
                  variant="rounded"
                  height={180}
                  sx={{ 
                    borderRadius: 5, 
                    bgcolor: colors.accent + '30',
                    animation: `${shimmer} 2s ease-in-out infinite`,
                    backgroundSize: '200% 100%',
                    backgroundImage: `linear-gradient(90deg, ${colors.accent}20 0%, ${colors.accent}40 50%, ${colors.accent}20 100%)`,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : jobs.length === 0 ? (
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
              <WorkIcon sx={{ fontSize: 48, color: colors.primary }} />
            </Box>
            <Typography variant="h5" sx={{ color: colors.secondary, mb: 1, fontWeight: 700 }}>
              No job posts yet
            </Typography>
            <Typography variant="body1" sx={{ color: colors.textLight, mb: 4, maxWidth: 400, mx: 'auto' }}>
              Create your first job post to start receiving applications from talented candidates
            </Typography>
            <PrimaryButton startIcon={<AddIcon />} onClick={() => navigate('/hr/create-job')}>
              Create Your First Job
            </PrimaryButton>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {jobs.map((job, index) => (
              <Grid item xs={12} key={job.id}>
                <JobCard sx={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent sx={{ p: 3.5, pl: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: colors.secondary }}>
                            {job.title}
                          </Typography>
                          <StatusChip
                            label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            status={job.status}
                            size="small"
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: colors.textLight }}>
                            <LocationIcon fontSize="small" sx={{ color: colors.primary }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{job.location}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: colors.textLight }}>
                            <WorkIcon fontSize="small" sx={{ color: colors.primary }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{JOB_TYPES[job.jobType] || job.jobType}</Typography>
                          </Box>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.75,
                            background: `linear-gradient(135deg, ${colors.accent}40 0%, ${colors.primaryLight}30 100%)`,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                          }}>
                            <PeopleIcon fontSize="small" sx={{ color: colors.primary }} />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.secondary }}>
                              {job.applicantCount || 0} applicant{(job.applicantCount || 0) !== 1 ? 's' : ''}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {job.requiredSkills.slice(0, 4).map((skill, idx) => (
                            <SkillChip
                              key={idx}
                              label={skill}
                              size="small"
                            />
                          ))}
                          {job.requiredSkills.length > 4 && (
                            <Chip
                              label={`+${job.requiredSkills.length - 4} more`}
                              size="small"
                              sx={{ 
                                borderRadius: 2, 
                                bgcolor: colors.accent,
                                color: colors.secondary,
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <Button
                          variant="contained"
                          size="medium"
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/hr/job/${job.id}/applicants`)}
                          sx={{
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 2.5,
                            background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                            boxShadow: `0 6px 20px ${colors.primary}40`,
                            '&:hover': {
                              boxShadow: `0 8px 25px ${colors.primary}50`,
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          View Applicants
                        </Button>
                        <IconButton
                          size="medium"
                          onClick={(e) => handleMenuClick(e, job.id)}
                          sx={{ 
                            border: `2px solid ${colors.accent}`,
                            color: colors.secondary,
                            '&:hover': {
                              background: colors.primary,
                              borderColor: colors.primary,
                              color: 'white',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </JobCard>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: `0 15px 50px ${colors.secondary}25`,
              border: `1px solid ${colors.accent}40`,
              minWidth: 200,
              mt: 1,
            },
          }}
        >
          <MenuItem 
            onClick={handleViewApplicants}
            sx={{ 
              py: 1.5, 
              '&:hover': { 
                background: `${colors.accent}30`,
              },
            }}
          >
            <ListItemIcon>
              <PeopleIcon fontSize="small" sx={{ color: colors.primary }} />
            </ListItemIcon>
            <ListItemText 
              primary="View Applicants"
              primaryTypographyProps={{ fontWeight: 500, color: colors.secondary }}
            />
          </MenuItem>
          <MenuItem 
            onClick={handleEditJob}
            sx={{ 
              py: 1.5, 
              '&:hover': { 
                background: `${colors.accent}30`,
              },
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" sx={{ color: colors.primary }} />
            </ListItemIcon>
            <ListItemText 
              primary="Edit Job"
              primaryTypographyProps={{ fontWeight: 500, color: colors.secondary }}
            />
          </MenuItem>
          <Divider sx={{ borderColor: colors.accent }} />
          <MenuItem 
            onClick={handleToggleJobStatus}
            sx={{ 
              py: 1.5, 
              '&:hover': { 
                background: jobs.find(j => j.id === selectedJobId)?.status === 'active' 
                  ? `${alpha(colors.error, 0.1)}` 
                  : `${alpha(colors.success, 0.1)}`,
              },
            }}
          >
            <ListItemIcon>
              {jobs.find(j => j.id === selectedJobId)?.status === 'active' ? (
                <BlockIcon fontSize="small" sx={{ color: colors.error }} />
              ) : (
                <PlayArrowIcon fontSize="small" sx={{ color: colors.success }} />
              )}
            </ListItemIcon>
            <ListItemText
              primary={jobs.find(j => j.id === selectedJobId)?.status === 'active' ? 'Close Job' : 'Reopen Job'}
              primaryTypographyProps={{ 
                fontWeight: 500, 
                color: jobs.find(j => j.id === selectedJobId)?.status === 'active' ? colors.error : colors.success,
              }}
            />
          </MenuItem>
        </Menu>
      </Container>
    </DashboardContainer>
  );
};

export default HRDashboard;


