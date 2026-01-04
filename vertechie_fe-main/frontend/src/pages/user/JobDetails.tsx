/**
 * Job Details Page
 * Display full job information with apply functionality
 * Theme: Vine (#00bf8f → #001510)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  keyframes,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { formatDistanceToNow, format } from 'date-fns';
import { Job, JOB_TYPES, EXPERIENCE_LEVELS, DIFFICULTY_LABELS } from '../../types/jobPortal';
import { jobService, applicationService, getUserInfo } from '../../services/jobPortalService';

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

const HeaderCard = styled(Paper)(({ theme }) => ({
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
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -40,
    left: '20%',
    width: 150,
    height: 150,
    background: 'rgba(255, 255, 255, 0.04)',
    borderRadius: '50%',
  },
}));

const ContentCard = styled(Card)(({ theme }) => ({
  background: colors.surface,
  borderRadius: 24,
  boxShadow: `0 10px 40px ${colors.primary}10`,
  border: `1px solid ${colors.accent}40`,
  animation: `${fadeInUp} 0.6s ease-out`,
}));

const ApplyButton = styled(Button)(({ theme }) => ({
  borderRadius: 14,
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1.1rem',
  padding: '16px 48px',
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
  color: 'white',
  boxShadow: `0 10px 30px ${colors.primary}50`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondary} 100%)`,
    boxShadow: `0 15px 40px ${colors.primary}60`,
    transform: 'translateY(-2px)',
    color: 'white',
  },
  '&:disabled': {
    background: `${colors.accent}`,
    boxShadow: 'none',
    color: colors.textLight,
  },
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  borderRadius: 10,
  fontWeight: 600,
  fontSize: '0.875rem',
  padding: '8px 4px',
  background: `${colors.accent}60`,
  color: colors.secondary,
  border: `1px solid ${colors.accent}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: colors.primary,
    color: 'white',
  },
}));

const CodingQuestionCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(3),
  background: `${colors.accent}20`,
  border: `1px solid ${colors.accent}60`,
  marginBottom: theme.spacing(2),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background: `linear-gradient(180deg, ${colors.primary}, ${colors.accent})`,
    borderRadius: '4px 0 0 4px',
  },
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  borderRadius: 12,
  background: `${colors.accent}30`,
  border: `1px solid ${colors.accent}50`,
}));

const JobDetails: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);

  useEffect(() => {
    if (jobId) {
      loadJob();
      checkApplicationStatus();
    }
  }, [jobId]);

  const loadJob = async () => {
    if (!jobId) return;

    try {
      setLoading(true);
      const jobData = await jobService.getJobById(jobId);
      setJob(jobData);
    } catch (err) {
      setError('Failed to load job details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    if (!jobId) return;
    
    try {
      const user = getUserInfo();
      if (user) {
        const applied = await applicationService.hasUserApplied(jobId, user.id);
        setHasApplied(applied);
      }
    } catch (err) {
      console.error('Failed to check application status:', err);
    } finally {
      setCheckingApplication(false);
    }
  };

  const handleApply = () => {
    if (!job) return;

    if (job.codingQuestions.length > 0) {
      // Redirect to coding test page
      navigate(`/techie/jobs/${job.id}/apply`);
    } else {
      // Apply directly without coding test
      navigate(`/techie/jobs/${job.id}/apply`);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Skeleton
            variant="rounded"
            height={250}
            sx={{ mb: 4, borderRadius: 6, bgcolor: `${colors.accent}40` }}
          />
          <Skeleton
            variant="rounded"
            height={500}
            sx={{ borderRadius: 5, bgcolor: `${colors.accent}40` }}
          />
        </Container>
      </PageContainer>
    );
  }

  if (!job) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ borderRadius: 3, border: `1px solid ${alpha(colors.error, 0.3)}` }}>
            Job not found
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/techie/jobs')}
            sx={{ 
              mt: 2, 
              color: colors.primary,
              fontWeight: 600,
              '&:hover': { background: `${colors.accent}30` },
            }}
          >
            Back to Jobs
          </Button>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="xl">
        {/* Header Card */}
        <HeaderCard elevation={0}>
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: 3 }}>
            {/* Back Arrow Inside Card */}
            <IconButton
              onClick={() => navigate('/techie/jobs')}
              sx={{
                color: 'white',
                p: 0.5,
                mt: 0.5,
                '&:hover': { 
                  background: 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 28 }} />
            </IconButton>

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                <Chip
                  label={JOB_TYPES[job.jobType]}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={job.status === 'active' ? 'Accepting Applications' : 'Closed'}
                  sx={{
                    bgcolor: job.status === 'active' ? 'rgba(0, 212, 170, 0.3)' : 'rgba(255, 77, 106, 0.3)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Box>

              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                {job.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <BusinessIcon />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {job.companyName}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
                  <LocationIcon />
                  <Typography>{job.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
                  <TrendingUpIcon />
                  <Typography>{EXPERIENCE_LEVELS[job.experienceLevel]}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
                  <TimeIcon />
                  <Typography>Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </HeaderCard>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <ContentCard>
              <CardContent sx={{ p: 4 }}>
                {/* Description */}
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  About This Role
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.8,
                    mb: 4,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {job.description}
                </Typography>

                <Divider sx={{ my: 4 }} />

                {/* Required Skills */}
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Required Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4 }}>
                  {job.requiredSkills.map((skill, index) => (
                    <SkillChip key={index} label={skill} />
                  ))}
                </Box>

                {/* Coding Questions */}
                {job.codingQuestions.length > 0 && (
                  <>
                    <Divider sx={{ my: 4 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <CodeIcon color="primary" sx={{ fontSize: 28 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Coding Assessment
                      </Typography>
                    </Box>
                    <Alert
                      severity="info"
                      sx={{ mb: 3, borderRadius: 2 }}
                      icon={<StarIcon />}
                    >
                      This application requires completing {job.codingQuestions.length} coding challenge
                      {job.codingQuestions.length > 1 ? 's' : ''}. Make sure you have time to complete them before applying.
                    </Alert>

                    {job.codingQuestions.map((question, index) => (
                      <CodingQuestionCard key={question.id} elevation={0}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primaryLight} 100%)`,
                              color: 'white',
                              fontWeight: 700,
                              boxShadow: `0 4px 12px ${colors.primary}40`,
                            }}
                          >
                            {index + 1}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.secondary }}>
                              {question.question}
                            </Typography>
                          </Box>
                          <Chip
                            label={DIFFICULTY_LABELS[question.difficulty]}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              borderRadius: 2,
                              bgcolor:
                                question.difficulty === 'easy'
                                  ? alpha(colors.success, 0.15)
                                  : question.difficulty === 'medium'
                                  ? alpha(colors.warning, 0.15)
                                  : alpha(colors.error, 0.15),
                              color:
                                question.difficulty === 'easy'
                                  ? colors.primaryDark
                                  : question.difficulty === 'medium'
                                  ? '#d39e00'
                                  : colors.error,
                              border: `1px solid ${
                                question.difficulty === 'easy'
                                  ? alpha(colors.success, 0.3)
                                  : question.difficulty === 'medium'
                                  ? alpha(colors.warning, 0.3)
                                  : alpha(colors.error, 0.3)
                              }`,
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: colors.textLight, pl: 1 }}>
                          {question.description}
                        </Typography>
                      </CodingQuestionCard>
                    ))}
                  </>
                )}
              </CardContent>
            </ContentCard>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Apply Card */}
            <ContentCard sx={{ mb: 3, position: 'sticky', top: 100 }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                {hasApplied ? (
                  <>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${colors.accent}60`,
                        margin: '0 auto 20px',
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 48, color: colors.primary }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: colors.secondary }}>
                      Already Applied
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textLight, mb: 3 }}>
                      You've already submitted your application for this position. Check your applications to see the status.
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate('/techie/my-applications')}
                      sx={{ 
                        borderRadius: 3, 
                        py: 1.5, 
                        textTransform: 'none', 
                        fontWeight: 600,
                        borderColor: colors.primary,
                        color: colors.primary,
                        borderWidth: 2,
                        '&:hover': {
                          background: colors.primary,
                          color: 'white',
                          borderColor: colors.primary,
                        },
                      }}
                    >
                      View My Applications
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      Ready to Apply?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Answer a few questions and your profile will be matched to this role automatically.
                    </Typography>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: `${colors.accent}20`, 
                      border: `1px solid ${colors.accent}40`,
                      mb: 3,
                    }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        ✓ No resume upload required
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        ✓ Profile auto-matched with job requirements
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        ✓ Quick screening questions
                      </Typography>
                    </Box>
                    <ApplyButton
                      fullWidth
                      startIcon={<SendIcon />}
                      onClick={handleApply}
                      disabled={job.status !== 'active' || checkingApplication}
                    >
                      {job.status !== 'active' ? 'Position Closed' : 'Apply Now'}
                    </ApplyButton>
                  </>
                )}
              </CardContent>
            </ContentCard>

            {/* Job Summary Card */}
            <ContentCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Job Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InfoBox>
                      <WorkIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Job Type
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {JOB_TYPES[job.jobType]}
                        </Typography>
                      </Box>
                    </InfoBox>
                  </Grid>
                  <Grid item xs={12}>
                    <InfoBox>
                      <LocationIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {job.location}
                        </Typography>
                      </Box>
                    </InfoBox>
                  </Grid>
                  <Grid item xs={12}>
                    <InfoBox>
                      <TrendingUpIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Experience Level
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {EXPERIENCE_LEVELS[job.experienceLevel]}
                        </Typography>
                      </Box>
                    </InfoBox>
                  </Grid>
                  <Grid item xs={12}>
                    <InfoBox>
                      <TimeIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Posted On
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {format(new Date(job.createdAt), 'MMMM d, yyyy')}
                        </Typography>
                      </Box>
                    </InfoBox>
                  </Grid>
                </Grid>
              </CardContent>
            </ContentCard>
          </Grid>
        </Grid>
      </Container>
    </PageContainer>
  );
};

export default JobDetails;


