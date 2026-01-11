/**
 * Job Listings Page
 * Display all active job posts for users to browse and apply
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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Alert,
  Paper,
  alpha,
  keyframes,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Code as CodeIcon,
  ArrowForward as ArrowForwardIcon,
  FilterList as FilterIcon,
  AccessTime as TimeIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
  NewReleases as NewIcon,
  AttachMoney as SalaryIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  Group as ApplicantsIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { Job, JOB_TYPES, EXPERIENCE_LEVELS, JobFilters } from '../../types/jobPortal';
import { jobService, interestService } from '../../services/jobPortalService';
import { Snackbar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

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
  padding: theme.spacing(6),
  color: 'white',
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeInUp} 0.6s ease-out`,
  boxShadow: `0 20px 60px ${colors.primary}40`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
    animation: `${float} 6s ease-in-out infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -50,
    left: '30%',
    width: 200,
    height: 200,
    background: 'rgba(255, 255, 255, 0.04)',
    borderRadius: '50%',
    animation: `${float} 8s ease-in-out infinite reverse`,
  },
}));

const SearchCard = styled(Paper)(({ theme }) => ({
  background: colors.surface,
  borderRadius: 20,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  boxShadow: `0 10px 40px ${colors.primary}10`,
  border: `1px solid ${colors.accent}50`,
  animation: `${fadeInUp} 0.6s ease-out 0.1s both`,
}));

const JobCard = styled(Card)(({ theme }) => ({
  background: colors.surface,
  borderRadius: 20,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${colors.accent}40`,
  cursor: 'pointer',
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
    transform: 'translateY(-8px)',
    boxShadow: `0 25px 60px ${colors.primary}20`,
    borderColor: colors.primary,
    '& .apply-btn': {
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
      color: 'white',
      borderColor: 'transparent',
    },
  },
}));

const ApplyButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 24px',
  transition: 'all 0.3s ease',
  background: 'transparent',
  border: `2px solid ${colors.primary}`,
  color: colors.primary,
  '&:hover': {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    color: 'white',
    borderColor: 'transparent',
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${colors.primary}40`,
  },
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  borderRadius: 8,
  fontWeight: 500,
  fontSize: '0.75rem',
  background: `${colors.accent}50`,
  color: colors.secondary,
  border: `1px solid ${colors.accent}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: colors.primary,
    color: 'white',
  },
}));

const JobTypeChip = styled(Chip)<{ jobtype: string }>(({ jobtype }) => ({
  fontWeight: 600,
  borderRadius: 10,
  fontSize: '0.75rem',
  ...(jobtype === 'full-time' && {
    background: `${alpha(colors.primary, 0.15)}`,
    color: colors.primaryDark,
    border: `1px solid ${alpha(colors.primary, 0.3)}`,
  }),
  ...(jobtype === 'internship' && {
    background: alpha('#ff9800', 0.12),
    color: '#e65100',
    border: `1px solid ${alpha('#ff9800', 0.3)}`,
  }),
  ...(jobtype === 'part-time' && {
    background: alpha('#2196f3', 0.12),
    color: '#1565c0',
    border: `1px solid ${alpha('#2196f3', 0.3)}`,
  }),
  ...(jobtype === 'contract' && {
    background: alpha('#9c27b0', 0.12),
    color: '#7b1fa2',
    border: `1px solid ${alpha('#9c27b0', 0.3)}`,
  }),
}));

// Featured Job Badge
const FeaturedBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  display: 'flex',
  gap: 6,
  zIndex: 2,
}));

const Badge = styled(Box)<{ variant: 'new' | 'featured' }>(({ variant }) => ({
  padding: '4px 10px',
  borderRadius: 20,
  fontSize: '0.65rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  ...(variant === 'new' && {
    background: 'linear-gradient(135deg, #00C853 0%, #00E676 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0, 200, 83, 0.4)',
  }),
  ...(variant === 'featured' && {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
    color: '#5D4037',
    boxShadow: '0 4px 12px rgba(255, 160, 0, 0.4)',
  }),
}));

const SalaryBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha('#00C853', 0.1)} 0%, ${alpha('#00E676', 0.05)} 100%)`,
  border: `1px solid ${alpha('#00C853', 0.3)}`,
  borderRadius: 12,
  padding: '8px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
}));

const CompanyLogo = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 700,
  fontSize: '1.2rem',
  boxShadow: `0 4px 12px ${alpha(colors.primary, 0.3)}`,
}));

const JobListings: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    jobType: '',
    experienceLevel: '',
    location: '',
  });
  const [interestedJobs, setInterestedJobs] = useState<Set<string>>(new Set());
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Get current user data
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  // Load user's existing interests
  const loadUserInterests = async () => {
    const user = getUserData();
    if (!user?.id) return;
    
    try {
      const interests = await interestService.getInterestsByUser(user.id.toString());
      setInterestedJobs(new Set(interests.map(i => i.jobId)));
    } catch (err) {
      console.error('Failed to load interests:', err);
    }
  };

  // Handle express interest
  const handleExpressInterest = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    
    const user = getUserData();
    if (!user) {
      setSnackbar({ open: true, message: 'Please login to express interest', severity: 'error' });
      return;
    }
    
    if (interestedJobs.has(jobId)) {
      setSnackbar({ open: true, message: 'You have already expressed interest in this job', severity: 'info' });
      return;
    }
    
    try {
      await interestService.expressInterest(
        jobId,
        user.id.toString(),
        `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
        user.email
      );
      
      setInterestedJobs(prev => new Set([...prev, jobId]));
      setSnackbar({ open: true, message: 'Interest sent to Hiring Manager!', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Failed to express interest', severity: 'error' });
    }
  };

  // Generate random salary for demo
  const getSalary = (jobType: string, experienceLevel: string): string => {
    const salaries: Record<string, Record<string, string>> = {
      'full-time': { entry: '$60K - $85K', mid: '$85K - $120K', senior: '$120K - $180K', lead: '$150K - $220K' },
      'internship': { entry: '$25/hr - $40/hr', mid: '$30/hr - $50/hr', senior: '$40/hr - $60/hr', lead: '$50/hr - $70/hr' },
      'contract': { entry: '$50/hr - $80/hr', mid: '$80/hr - $120/hr', senior: '$120/hr - $180/hr', lead: '$150/hr - $200/hr' },
      'part-time': { entry: '$30/hr - $45/hr', mid: '$45/hr - $65/hr', senior: '$65/hr - $90/hr', lead: '$80/hr - $110/hr' },
    };
    return salaries[jobType]?.[experienceLevel] || '$70K - $100K';
  };

  // Check if job is new (within 3 days)
  const isNewJob = (createdAt: string): boolean => {
    const daysDiff = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 3;
  };

  // Toggle save job
  const toggleSaveJob = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    loadJobs();
    loadUserInterests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const activeJobs = await jobService.getAllActiveJobs();
      setJobs(activeJobs);
    } catch (err) {
      setError('Failed to load jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.companyName.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.requiredSkills.some((skill) => skill.toLowerCase().includes(query))
      );
    }

    if (filters.jobType) {
      filtered = filtered.filter((job) => job.jobType === filters.jobType);
    }

    if (filters.experienceLevel) {
      filtered = filtered.filter((job) => job.experienceLevel === filters.experienceLevel);
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(loc));
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (field: keyof JobFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/techie/jobs/${jobId}`);
  };

  const handleApplyClick = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    navigate(`/techie/jobs/${jobId}`);
  };

  return (
    <PageContainer>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <HeroSection elevation={0}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, mb: 2, maxWidth: 600 }}
            >
              Find Your Dream Tech Job
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, maxWidth: 500, fontWeight: 400 }}>
              Browse through hundreds of verified tech opportunities from top companies
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<WorkIcon sx={{ color: 'inherit !important' }} />}
                label={`${jobs.length} Active Jobs`}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
              <Chip
                icon={<BusinessIcon sx={{ color: 'inherit !important' }} />}
                label="Verified Companies"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
              <Chip
                icon={<CodeIcon sx={{ color: 'inherit !important' }} />}
                label="Coding Assessments"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
            </Box>
          </Box>
        </HeroSection>

        {/* Search & Filters */}
        <SearchCard elevation={0}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search jobs, skills, companies..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'grey.50',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={filters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  label="Job Type"
                  sx={{ borderRadius: 3, bgcolor: 'grey.50' }}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {Object.entries(JOB_TYPES).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Experience</InputLabel>
                <Select
                  value={filters.experienceLevel}
                  onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                  label="Experience"
                  sx={{ borderRadius: 3, bgcolor: 'grey.50' }}
                >
                  <MenuItem value="">All Levels</MenuItem>
                  {Object.entries(EXPERIENCE_LEVELS).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label.split(' ')[0]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'grey.50',
                  },
                }}
              />
            </Grid>
          </Grid>
          
          {/* Results Count */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </Typography>
            {(filters.search || filters.jobType || filters.experienceLevel || filters.location) && (
              <Button
                size="small"
                onClick={() => setFilters({ search: '', jobType: '', experienceLevel: '', location: '' })}
                sx={{ textTransform: 'none' }}
              >
                Clear filters
              </Button>
            )}
          </Box>
        </SearchCard>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Job List */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} md={6} key={i}>
                <Skeleton
                  variant="rounded"
                  height={280}
                  sx={{ borderRadius: 5, bgcolor: `${colors.accent}40` }}
                />
              </Grid>
            ))}
          </Grid>
        ) : filteredJobs.length === 0 ? (
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
              No jobs found
            </Typography>
            <Typography variant="body1" sx={{ color: colors.textLight, mb: 3, maxWidth: 400, mx: 'auto' }}>
              {filters.search || filters.jobType || filters.experienceLevel || filters.location
                ? 'Try adjusting your filters to find more opportunities'
                : 'Check back later for new job postings'}
            </Typography>
            {(filters.search || filters.jobType || filters.experienceLevel || filters.location) && (
              <Button
                variant="outlined"
                onClick={() => setFilters({ search: '', jobType: '', experienceLevel: '', location: '' })}
                sx={{
                  color: colors.primary,
                  borderColor: colors.primary,
                  borderWidth: 2,
                  fontWeight: 600,
                  borderRadius: 3,
                  '&:hover': { 
                    borderColor: colors.primary, 
                    bgcolor: colors.primary,
                    color: 'white',
                  },
                }}
              >
                Clear All Filters
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredJobs.map((job, index) => (
              <Grid item xs={12} md={6} key={job.id}>
                <JobCard onClick={() => handleJobClick(job.id)}>
                  {/* Featured Badges */}
                  <FeaturedBadge>
                    {isNewJob(job.createdAt) && (
                      <Badge variant="new">
                        <NewIcon sx={{ fontSize: 12 }} /> New
                      </Badge>
                    )}
                  </FeaturedBadge>

                  <CardContent sx={{ p: 3 }}>
                    {/* Header with Company Logo */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <CompanyLogo>
                        {job.companyName.charAt(0)}
                      </CompanyLogo>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {job.title}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {job.companyName}
                          </Typography>
                          <VerifiedIcon sx={{ fontSize: 16, color: colors.primary }} />
                          <JobTypeChip label={JOB_TYPES[job.jobType]} jobtype={job.jobType} size="small" />
                        </Box>
                      </Box>
                      {/* Save Button */}
                      <Box 
                        onClick={(e) => toggleSaveJob(e, job.id)}
                        sx={{ 
                          cursor: 'pointer',
                          color: savedJobs.has(job.id) ? colors.primary : 'text.secondary',
                          transition: 'all 0.3s',
                          '&:hover': { transform: 'scale(1.2)' }
                        }}
                      >
                        {savedJobs.has(job.id) ? <BookmarkFilledIcon /> : <BookmarkIcon />}
                      </Box>
                    </Box>

                    {/* Salary Range */}
                    <SalaryBox sx={{ mb: 2 }}>
                      <SalaryIcon sx={{ fontSize: 18, color: '#00C853' }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#00C853' }}>
                        {getSalary(job.jobType, job.experienceLevel)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                        /year
                      </Typography>
                    </SalaryBox>

                    {/* Info Row */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        <LocationIcon fontSize="small" />
                        <Typography variant="body2">{job.location}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        <TimeIcon fontSize="small" />
                        <Typography variant="body2">
                          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        <ApplicantsIcon fontSize="small" />
                        <Typography variant="body2">
                          {Math.floor(Math.random() * 50) + 10} applicants
                        </Typography>
                      </Box>
                    </Box>

                    {/* Coding Tests Badge */}
                    {job.codingQuestions.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          icon={<CodeIcon sx={{ fontSize: '14px !important', color: `${colors.secondary} !important` }} />}
                          label={`${job.codingQuestions.length} Coding Test${job.codingQuestions.length > 1 ? 's' : ''} Required`}
                          size="small"
                          sx={{
                            bgcolor: `${colors.accent}60`,
                            color: colors.secondary,
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            border: `1px solid ${colors.accent}`,
                          }}
                        />
                      </Box>
                    )}

                    {/* Skills */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3 }}>
                      {job.requiredSkills.slice(0, 4).map((skill, idx) => (
                        <SkillChip key={idx} label={skill} size="small" />
                      ))}
                      {job.requiredSkills.length > 4 && (
                        <Chip
                          label={`+${job.requiredSkills.length - 4}`}
                          size="small"
                          sx={{ bgcolor: 'grey.100', fontWeight: 500, fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {EXPERIENCE_LEVELS[job.experienceLevel]?.split(' ')[0]} Level
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#FFB400' }}>
                          <StarIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {(4 + Math.random()).toFixed(1)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant={interestedJobs.has(job.id) ? "contained" : "outlined"}
                          size="small"
                          startIcon={interestedJobs.has(job.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                          onClick={(e) => handleExpressInterest(e, job.id)}
                          sx={{
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            color: interestedJobs.has(job.id) ? 'white' : '#e91e63',
                            bgcolor: interestedJobs.has(job.id) ? '#e91e63' : 'transparent',
                            borderColor: '#e91e63',
                            '&:hover': {
                              bgcolor: interestedJobs.has(job.id) ? '#c2185b' : 'rgba(233, 30, 99, 0.1)',
                              borderColor: '#c2185b',
                            },
                          }}
                        >
                          {interestedJobs.has(job.id) ? 'Interested' : 'Show Interest'}
                        </Button>
                        <ApplyButton
                          className="apply-btn"
                          endIcon={<ArrowForwardIcon />}
                          onClick={(e) => handleApplyClick(e, job.id)}
                        >
                          Apply Now
                        </ApplyButton>
                      </Box>
                    </Box>
                  </CardContent>
                </JobCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default JobListings;



