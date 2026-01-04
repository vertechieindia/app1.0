/**
 * View Applicants Page
 * Display list of candidates who applied for a job with shortlist/reject actions
 * Theme: Poncho (#403a3e → #be5869)
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
  Avatar,
  IconButton,
  Skeleton,
  Alert,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
  Tooltip,
  TextField,
  InputAdornment,
  keyframes,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Code as CodeIcon,
  Search as SearchIcon,
  Assessment as AssessmentIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Job, Application, ApplicationStatus, APPLICATION_STATUS_LABELS } from '../../types/jobPortal';
import { jobService, applicationService } from '../../services/jobPortalService';

// Theme Colors - Poncho Palette
const colors = {
  primary: '#be5869',
  primaryDark: '#a04857',
  primaryLight: '#d4899b',
  secondary: '#403a3e',
  secondaryLight: '#5a5358',
  accent: '#e8b4bc',
  background: '#fafafa',
  surface: '#ffffff',
  text: '#403a3e',
  textLight: '#6b6369',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  purple: '#9c27b0',
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

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
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
    height: '350px',
    background: `linear-gradient(135deg, ${colors.primary}08 0%, ${colors.accent}15 100%)`,
    zIndex: 0,
  },
}));

const HeaderCard = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
  borderRadius: 24,
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
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    animation: `${float} 6s ease-in-out infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -40,
    left: '30%',
    width: 150,
    height: 150,
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
  },
}));

const ApplicantCard = styled(Card)(({ theme }) => ({
  background: colors.surface,
  borderRadius: 20,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${colors.accent}30`,
  boxShadow: `0 4px 20px ${colors.primary}08`,
  animation: `${fadeInUp} 0.6s ease-out`,
  position: 'relative',
  overflow: 'hidden',
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
  fontSize: '0.75rem',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  ...(status === 'applied' && {
    background: `linear-gradient(135deg, ${alpha(colors.info, 0.15)} 0%, ${alpha(colors.info, 0.1)} 100%)`,
    color: colors.info,
    border: `1px solid ${alpha(colors.info, 0.3)}`,
  }),
  ...(status === 'shortlisted' && {
    background: `linear-gradient(135deg, ${alpha(colors.success, 0.15)} 0%, ${alpha(colors.success, 0.1)} 100%)`,
    color: colors.success,
    border: `1px solid ${alpha(colors.success, 0.3)}`,
  }),
  ...(status === 'rejected' && {
    background: `linear-gradient(135deg, ${alpha(colors.error, 0.15)} 0%, ${alpha(colors.error, 0.1)} 100%)`,
    color: colors.error,
    border: `1px solid ${alpha(colors.error, 0.3)}`,
  }),
  ...(status === 'hired' && {
    background: `linear-gradient(135deg, ${alpha(colors.purple, 0.15)} 0%, ${alpha(colors.purple, 0.1)} 100%)`,
    color: colors.purple,
    border: `1px solid ${alpha(colors.purple, 0.3)}`,
  }),
}));

const ScoreChip = styled(Chip)<{ score: number }>(({ score }) => ({
  fontWeight: 700,
  borderRadius: 10,
  ...(score >= 80 && {
    background: `linear-gradient(135deg, ${alpha(colors.success, 0.15)} 0%, ${alpha(colors.success, 0.1)} 100%)`,
    color: colors.success,
    border: `1px solid ${alpha(colors.success, 0.3)}`,
  }),
  ...(score >= 60 && score < 80 && {
    background: `linear-gradient(135deg, ${alpha(colors.warning, 0.15)} 0%, ${alpha(colors.warning, 0.1)} 100%)`,
    color: colors.warning,
    border: `1px solid ${alpha(colors.warning, 0.3)}`,
  }),
  ...(score < 60 && {
    background: `linear-gradient(135deg, ${alpha(colors.error, 0.15)} 0%, ${alpha(colors.error, 0.1)} 100%)`,
    color: colors.error,
    border: `1px solid ${alpha(colors.error, 0.3)}`,
  }),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 24px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const BackButton = styled(Button)(({ theme }) => ({
  color: colors.secondary,
  fontWeight: 600,
  borderRadius: 12,
  padding: '10px 20px',
  background: colors.surface,
  border: `2px solid ${colors.accent}`,
  boxShadow: `0 4px 15px ${colors.primary}10`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: colors.primary,
    borderColor: colors.primary,
    color: 'white',
    transform: 'translateX(-4px)',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    minHeight: 56,
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
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    background: `${colors.accent}15`,
    transition: 'all 0.3s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary,
      },
    },
    '&.Mui-focused': {
      background: colors.surface,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary,
        borderWidth: 2,
      },
    },
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ py: 3 }}>
    {value === index && children}
  </Box>
);

const ViewApplicants: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadData();
    }
  }, [jobId]);

  useEffect(() => {
    filterApplicants();
  }, [applicants, tabValue, searchQuery]);

  const loadData = async () => {
    if (!jobId) return;

    try {
      setLoading(true);
      const [jobData, applicantsData] = await Promise.all([
        jobService.getJobById(jobId),
        applicationService.getApplicationsByJob(jobId),
      ]);
      setJob(jobData);
      setApplicants(applicantsData);
    } catch (err) {
      setError('Failed to load applicants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterApplicants = () => {
    let filtered = [...applicants];

    // Filter by tab (status)
    if (tabValue === 1) {
      filtered = filtered.filter((a) => a.status === 'shortlisted');
    } else if (tabValue === 2) {
      filtered = filtered.filter((a) => a.status === 'rejected');
    } else if (tabValue === 3) {
      filtered = filtered.filter((a) => a.status === 'applied');
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.candidateName.toLowerCase().includes(query) ||
          a.candidateEmail.toLowerCase().includes(query)
      );
    }

    setFilteredApplicants(filtered);
  };

  const handleUpdateStatus = async (applicationId: string, status: ApplicationStatus) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, status);
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status } : a))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleViewCode = (applicant: Application) => {
    setSelectedApplicant(applicant);
    setCodeDialogOpen(true);
  };

  const getStatusCounts = () => ({
    all: applicants.length,
    shortlisted: applicants.filter((a) => a.status === 'shortlisted').length,
    rejected: applicants.filter((a) => a.status === 'rejected').length,
    pending: applicants.filter((a) => a.status === 'applied').length,
  });

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <PageContainer>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Skeleton 
            variant="rounded" 
            height={200} 
            sx={{ 
              mb: 4, 
              borderRadius: 6, 
              bgcolor: `${colors.accent}30`,
              animation: `${shimmer} 2s ease-in-out infinite`,
              backgroundSize: '200% 100%',
              backgroundImage: `linear-gradient(90deg, ${colors.accent}20 0%, ${colors.accent}40 50%, ${colors.accent}20 100%)`,
            }} 
          />
          {[1, 2, 3].map((i) => (
            <Skeleton 
              key={i} 
              variant="rounded" 
              height={150} 
              sx={{ 
                mb: 2, 
                borderRadius: 5, 
                bgcolor: `${colors.accent}30`,
              }} 
            />
          ))}
        </Container>
      </PageContainer>
    );
  }

  if (!job) {
    return (
      <PageContainer>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 3,
              border: `1px solid ${alpha(colors.error, 0.3)}`,
            }}
          >
            Job not found
          </Alert>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Card */}
        <HeaderCard elevation={0}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {/* Back Arrow inside card */}
              <IconButton
                onClick={() => navigate('/hr/dashboard')}
                sx={{
                  width: 44,
                  height: 44,
                  // background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  // border: '2px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  // '&:hover': {
                  //   background: 'rgba(255, 255, 255, 0.3)',
                  //   transform: 'translateX(-4px)',
                  // },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GroupsIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.5px' }}>
                  {job.title}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {job.companyName} • {job.location}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mt: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                background: 'rgba(255, 255, 255, 0.15)',
                px: 2,
                py: 1,
                borderRadius: 2,
              }}>
                <PersonIcon />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {applicants.length} Applicants
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                background: 'rgba(255, 255, 255, 0.1)',
                px: 2,
                py: 1,
                borderRadius: 2,
              }}>
                <CheckCircleIcon />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {statusCounts.shortlisted} Shortlisted
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                background: 'rgba(255, 255, 255, 0.1)',
                px: 2,
                py: 1,
                borderRadius: 2,
              }}>
                <CodeIcon />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {job.codingQuestions.length} Coding Questions
                </Typography>
              </Box>
            </Box>
          </Box>
        </HeaderCard>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 3,
              border: `1px solid ${alpha(colors.error, 0.3)}`,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Filter Section */}
        <Paper sx={{ 
          borderRadius: 5, 
          mb: 4, 
          bgcolor: colors.surface,
          border: `1px solid ${colors.accent}40`,
          boxShadow: `0 4px 20px ${colors.primary}08`,
          overflow: 'hidden',
        }}>
          <Box sx={{ borderBottom: `2px solid ${colors.accent}30` }}>
            <StyledTabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              sx={{ px: 2 }}
            >
              <Tab label={`All (${statusCounts.all})`} />
              <Tab label={`Shortlisted (${statusCounts.shortlisted})`} />
              <Tab label={`Rejected (${statusCounts.rejected})`} />
              <Tab label={`Pending (${statusCounts.pending})`} />
            </StyledTabs>
          </Box>

          <Box sx={{ p: 2.5 }}>
            <SearchField
              fullWidth
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.primary }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Paper>

        {/* Applicants List */}
        {filteredApplicants.length === 0 ? (
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
              <PersonIcon sx={{ fontSize: 48, color: colors.primary }} />
            </Box>
            <Typography variant="h5" sx={{ color: colors.secondary, mb: 1, fontWeight: 700 }}>
              No applicants found
            </Typography>
            <Typography variant="body1" sx={{ color: colors.textLight, maxWidth: 400, mx: 'auto' }}>
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'No candidates have applied for this position yet'}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredApplicants.map((applicant, index) => (
              <Grid item xs={12} key={applicant.id}>
                <ApplicantCard sx={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent sx={{ p: 3.5, pl: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', gap: 2.5, flex: 1 }}>
                        <Avatar
                          sx={{
                            width: 60,
                            height: 60,
                            background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            boxShadow: `0 6px 20px ${colors.primary}30`,
                          }}
                        >
                          {applicant.candidateName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: colors.secondary }}>
                              {applicant.candidateName}
                            </Typography>
                            <StatusChip
                              label={APPLICATION_STATUS_LABELS[applicant.status]}
                              status={applicant.status}
                              size="small"
                            />
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, color: colors.textLight }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <EmailIcon fontSize="small" sx={{ color: colors.primary }} />
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>{applicant.candidateEmail}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <CalendarIcon fontSize="small" sx={{ color: colors.primary }} />
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Applied {format(new Date(applicant.appliedAt), 'MMM d, yyyy')}
                              </Typography>
                            </Box>
                            {applicant.codingScore !== undefined && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <AssessmentIcon fontSize="small" sx={{ color: colors.primary }} />
                                <ScoreChip
                                  label={`Score: ${applicant.codingScore}%`}
                                  size="small"
                                  score={applicant.codingScore}
                                />
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        {applicant.codingAnswers.length > 0 && (
                          <Tooltip title="View Code Submissions">
                            <IconButton
                              onClick={() => handleViewCode(applicant)}
                              sx={{
                                bgcolor: `${colors.accent}50`,
                                border: `2px solid ${colors.accent}`,
                                color: colors.primary,
                                '&:hover': { 
                                  bgcolor: colors.primary,
                                  borderColor: colors.primary,
                                  color: 'white',
                                },
                                transition: 'all 0.3s ease',
                              }}
                            >
                              <CodeIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {applicant.status === 'applied' && (
                          <>
                            <ActionButton
                              variant="contained"
                              startIcon={<ThumbUpIcon />}
                              onClick={() => handleUpdateStatus(applicant.id, 'shortlisted')}
                              sx={{
                                background: `linear-gradient(135deg, ${colors.success} 0%, #388e3c 100%)`,
                                boxShadow: `0 6px 20px ${alpha(colors.success, 0.4)}`,
                                '&:hover': {
                                  boxShadow: `0 8px 25px ${alpha(colors.success, 0.5)}`,
                                },
                              }}
                            >
                              Shortlist
                            </ActionButton>
                            <ActionButton
                              variant="outlined"
                              startIcon={<ThumbDownIcon />}
                              onClick={() => handleUpdateStatus(applicant.id, 'rejected')}
                              sx={{
                                borderColor: colors.error,
                                color: colors.error,
                                borderWidth: 2,
                                '&:hover': {
                                  background: colors.error,
                                  color: 'white',
                                  borderColor: colors.error,
                                },
                              }}
                            >
                              Reject
                            </ActionButton>
                          </>
                        )}

                        {applicant.status === 'shortlisted' && (
                          <>
                            <ActionButton
                              variant="contained"
                              startIcon={<StarIcon />}
                              onClick={() => handleUpdateStatus(applicant.id, 'hired')}
                              sx={{
                                background: `linear-gradient(135deg, ${colors.purple} 0%, #7b1fa2 100%)`,
                                boxShadow: `0 6px 20px ${alpha(colors.purple, 0.4)}`,
                                '&:hover': {
                                  boxShadow: `0 8px 25px ${alpha(colors.purple, 0.5)}`,
                                },
                              }}
                            >
                              Hire
                            </ActionButton>
                            <ActionButton
                              variant="outlined"
                              startIcon={<ThumbDownIcon />}
                              onClick={() => handleUpdateStatus(applicant.id, 'rejected')}
                              sx={{
                                borderColor: colors.error,
                                color: colors.error,
                                borderWidth: 2,
                                '&:hover': {
                                  background: colors.error,
                                  color: 'white',
                                  borderColor: colors.error,
                                },
                              }}
                            >
                              Reject
                            </ActionButton>
                          </>
                        )}

                        {applicant.status === 'rejected' && (
                          <ActionButton
                            variant="outlined"
                            startIcon={<ThumbUpIcon />}
                            onClick={() => handleUpdateStatus(applicant.id, 'shortlisted')}
                            sx={{
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
                            Reconsider
                          </ActionButton>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </ApplicantCard>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Code Submission Dialog */}
        <Dialog
          open={codeDialogOpen}
          onClose={() => setCodeDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ 
            sx: { 
              borderRadius: 5,
              border: `1px solid ${colors.accent}40`,
              overflow: 'hidden',
            } 
          }}
        >
          <DialogTitle 
            sx={{ 
              background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
              color: 'white', 
              fontWeight: 700,
              py: 2.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CodeIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Code Submissions - {selectedApplicant?.candidateName}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {selectedApplicant?.codingAnswers.map((answer, index) => {
              const question = job?.codingQuestions.find((q) => q.id === answer.questionId);
              return (
                <Box key={answer.questionId} sx={{ borderBottom: `1px solid ${colors.accent}40` }}>
                  <Box sx={{ p: 3, bgcolor: `${colors.accent}20` }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: colors.secondary }}>
                      Question {index + 1}: {question?.question || 'Question'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textLight }}>
                      {question?.description}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                      <Chip 
                        label={`Language: ${answer.language}`} 
                        size="small"
                        sx={{
                          background: `${colors.accent}50`,
                          color: colors.secondary,
                          fontWeight: 600,
                          border: `1px solid ${colors.accent}`,
                        }}
                      />
                      <Typography variant="caption" sx={{ color: colors.textLight }}>
                        Submitted: {format(new Date(answer.submittedAt), 'MMM d, yyyy h:mm a')}
                      </Typography>
                    </Box>
                    <Paper
                      sx={{
                        p: 2.5,
                        bgcolor: colors.secondary,
                        borderRadius: 3,
                        maxHeight: 300,
                        overflow: 'auto',
                        border: `1px solid ${colors.secondaryLight}`,
                      }}
                    >
                      <pre
                        style={{
                          margin: 0,
                          fontFamily: '"Fira Code", Monaco, Consolas, monospace',
                          fontSize: '0.875rem',
                          color: '#e8b4bc',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          lineHeight: 1.6,
                        }}
                      >
                        {answer.code || '// No code submitted'}
                      </pre>
                    </Paper>
                  </Box>
                </Box>
              );
            })}
            {(!selectedApplicant?.codingAnswers || selectedApplicant.codingAnswers.length === 0) && (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography sx={{ color: colors.textLight }}>No code submissions available</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${colors.accent}40` }}>
            <Button 
              onClick={() => setCodeDialogOpen(false)} 
              sx={{ 
                borderRadius: 3,
                px: 4,
                fontWeight: 600,
                color: colors.secondary,
                border: `2px solid ${colors.accent}`,
                '&:hover': {
                  background: colors.primary,
                  color: 'white',
                  borderColor: colors.primary,
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </PageContainer>
  );
};

export default ViewApplicants;


