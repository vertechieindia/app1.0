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
import { jobService, applicationService, getUserInfo } from '../../services/jobPortalService';
import { getAccessToken } from '../../services/apiClient';
import { Snackbar } from '@mui/material';

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

const TECHIE_JOB_TYPE_OPTIONS = [
  { value: 'fulltime', label: 'Full-Time' },
  { value: 'parttime', label: 'Part-Time' },
  { value: 'w2contract', label: 'W2 - Contract' },
  { value: 'corp2corp', label: 'Corp-to-Corp' },
  { value: 'unpaid_internship', label: 'Unpaid Internship' },
  { value: 'paid_internship', label: 'Paid Internship' },
  { value: 'freelance', label: 'Freelance' },
] as const;

const TECHIE_EXPERIENCE_OPTIONS = [
  { value: 'college_fresh', label: 'College fresh grads' },
  { value: '0_2', label: '0 to 2+ years' },
  { value: '2_5', label: '2 to 5+ years' },
  { value: '5_8', label: '5 to 8 years' },
  { value: '8_10', label: '8 to 10 years' },
  { value: '10_12', label: '10 to 12+' },
  { value: '12_leadership', label: '12 to leadership' },
] as const;

const TECHIE_DATE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'last7', label: 'Last 7 Days' },
  { value: 'last30', label: 'Last 30 Days' },
  { value: 'last90', label: 'Last 90 Days' },
] as const;

const normalizeJobTypeForFilter = (value: string): string => {
  const raw = (value || '').toLowerCase();
  const compact = raw.replace(/[^a-z0-9]/g, '');
  if (compact.includes('fulltime')) return 'fulltime';
  if (compact.includes('parttime')) return 'parttime';
  if (compact.includes('w2')) return 'w2contract';
  if (compact.includes('corp2corp') || compact.includes('corptocorp')) return 'corp2corp';
  if (compact.includes('unpaid') && compact.includes('intern')) return 'unpaid_internship';
  if (compact.includes('paid') && compact.includes('intern')) return 'paid_internship';
  if (compact.includes('freelance')) return 'freelance';
  if (compact.includes('contract')) return 'contract';
  if (compact.includes('internship')) return 'internship';
  return compact;
};

const normalizeExperienceForFilter = (value: string): string => {
  const raw = (value || '').toLowerCase();
  const compact = raw.replace(/[^a-z0-9_]/g, '');
  if (compact.includes('college') || compact.includes('fresh')) return 'college_fresh';
  if (compact === 'entry' || compact === '0_2' || compact.includes('02')) return '0_2';
  if (compact === 'mid' || compact === '2_5' || compact.includes('25')) return '2_5';
  if (compact === 'senior' || compact === '5_8' || compact.includes('58')) return '5_8';
  if (compact === '8_10' || compact.includes('810')) return '8_10';
  if (compact === '10_12' || compact.includes('1012')) return '10_12';
  if (compact === 'lead' || compact === '12_leadership' || compact.includes('12lead')) return '12_leadership';
  return compact;
};

const getExperienceDisplay = (value: string): string => {
  const normalized = normalizeExperienceForFilter(value);
  const match = TECHIE_EXPERIENCE_OPTIONS.find((opt) => opt.value === normalized);
  if (match) return match.label;
  return EXPERIENCE_LEVELS[value] || 'Not specified';
};

const getJobTypeDisplay = (value: string): string => {
  const normalized = normalizeJobTypeForFilter(value);
  const match = TECHIE_JOB_TYPE_OPTIONS.find((opt) => opt.value === normalized);
  if (match) return match.label;
  return JOB_TYPES[value] || value || 'Not specified';
};

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
    dateRange: 'all',
  });
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadAppliedJobs = async () => {
    const user = getUserInfo();
    const token = getAccessToken() || localStorage.getItem('accessToken') || localStorage.getItem('authToken');
    if (!user?.id || !token) {
      setAppliedJobIds(new Set());
      return;
    }
    try {
      const apps = await applicationService.getApplicationsByUser(user.id);
      const ids = new Set(
        (Array.isArray(apps) ? apps : [])
          .map((a) => String(a.jobId || ''))
          .filter(Boolean)
      );
      setAppliedJobIds(ids);
    } catch (err) {
      console.error('Failed to load applied jobs:', err);
      setAppliedJobIds(new Set());
    }
  };

  // Format salary – only show when HR entered values; no mock/placeholder ranges
  const getSalary = (job: any): string | null => {
    if (job.salary_min != null && job.salary_max != null && Number(job.salary_min) && Number(job.salary_max)) {
      return `$${Number(job.salary_min).toLocaleString()} - $${Number(job.salary_max).toLocaleString()}`;
    }
    if (job.salary_min != null && Number(job.salary_min)) {
      return `From $${Number(job.salary_min).toLocaleString()}`;
    }
    if (job.salary_max != null && Number(job.salary_max)) {
      return `Up to $${Number(job.salary_max).toLocaleString()}`;
    }
    return null;
  };

  // Check if job is new (within 3 days)
  const isNewJob = (createdAt: string): boolean => {
    const daysDiff = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 3;
  };

  // Load saved job IDs from backend
  const loadSavedJobs = async () => {
    try {
      const saved = await jobService.getSavedJobs();
      setSavedJobs(new Set(saved.map((j: Job) => j.id)));
    } catch (err) {
      console.error('Failed to load saved jobs:', err);
    }
  };

  // Toggle save job (persisted to backend)
  const toggleSaveJob = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    const isCurrentlySaved = savedJobs.has(jobId);
    try {
      if (isCurrentlySaved) {
        await jobService.unsaveJob(jobId);
        setSavedJobs(prev => { const n = new Set(prev); n.delete(jobId); return n; });
        setSnackbar({ open: true, message: 'Removed from saved jobs', severity: 'info' });
      } else {
        await jobService.saveJob(jobId);
        setSavedJobs(prev => new Set(prev).add(jobId));
        setSnackbar({ open: true, message: 'Job saved', severity: 'success' });
      }
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Failed to update saved job', severity: 'error' });
    }
  };

  useEffect(() => {
    loadJobs();
    loadSavedJobs();
    loadAppliedJobs();
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
      filtered = filtered.filter((job) => {
        const normalizedJobType = normalizeJobTypeForFilter(job.jobType);
        if (filters.jobType === 'w2contract' || filters.jobType === 'corp2corp') {
          return normalizedJobType === filters.jobType || normalizedJobType === 'contract';
        }
        if (filters.jobType === 'paid_internship' || filters.jobType === 'unpaid_internship') {
          return normalizedJobType === filters.jobType || normalizedJobType === 'internship';
        }
        return normalizedJobType === filters.jobType;
      });
    }

    if (filters.experienceLevel) {
      filtered = filtered.filter((job) => {
        const normalizedExp = normalizeExperienceForFilter(job.experienceLevel);
        if (filters.experienceLevel === 'college_fresh') {
          return normalizedExp === 'college_fresh' || normalizedExp === '0_2';
        }
        if (filters.experienceLevel === '0_2') {
          return normalizedExp === '0_2' || normalizedExp === 'college_fresh';
        }
        if (filters.experienceLevel === '8_10') {
          return normalizedExp === '8_10' || normalizedExp === '5_8';
        }
        if (filters.experienceLevel === '10_12') {
          return normalizedExp === '10_12' || normalizedExp === '12_leadership';
        }
        return normalizedExp === filters.experienceLevel;
      });
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(loc));
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const dayWindow = filters.dateRange === 'last7' ? 7 : filters.dateRange === 'last30' ? 30 : 90;
      filtered = filtered.filter((job) => {
        const postedTs = new Date(job.createdAt).getTime();
        if (!Number.isFinite(postedTs)) return false;
        const ageInDays = (Date.now() - postedTs) / (1000 * 60 * 60 * 24);
        return ageInDays <= dayWindow;
      });
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
    if (appliedJobIds.has(jobId)) {
      return;
    }
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
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={filters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  label="Job Type"
                  sx={{ borderRadius: 3, bgcolor: 'grey.50' }}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {TECHIE_JOB_TYPE_OPTIONS.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Experience</InputLabel>
                <Select
                  value={filters.experienceLevel}
                  onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                  label="Experience"
                  sx={{ borderRadius: 3, bgcolor: 'grey.50' }}
                >
                  <MenuItem value="">All Levels</MenuItem>
                  {TECHIE_EXPERIENCE_OPTIONS.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Date</InputLabel>
                <Select
                  value={filters.dateRange || 'all'}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  label="Date"
                  sx={{ borderRadius: 3, bgcolor: 'grey.50' }}
                >
                  {TECHIE_DATE_OPTIONS.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
            {(filters.search || filters.jobType || filters.experienceLevel || filters.location || (filters.dateRange && filters.dateRange !== 'all')) && (
              <Button
                size="small"
                onClick={() => setFilters({ search: '', jobType: '', experienceLevel: '', location: '', dateRange: 'all' })}
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
              {filters.search || filters.jobType || filters.experienceLevel || filters.location || (filters.dateRange && filters.dateRange !== 'all')
                ? 'Try adjusting your filters to find more opportunities'
                : 'Check back later for new job postings'}
            </Typography>
            {(filters.search || filters.jobType || filters.experienceLevel || filters.location || (filters.dateRange && filters.dateRange !== 'all')) && (
              <Button
                variant="outlined"
                onClick={() => setFilters({ search: '', jobType: '', experienceLevel: '', location: '', dateRange: 'all' })}
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
                          <JobTypeChip label={getJobTypeDisplay(job.jobType)} jobtype={job.jobType} size="small" />
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

                    {/* Salary – only when HR entered values; no mock ranges */}
                    <SalaryBox sx={{ mb: 2 }}>
                      <SalaryIcon sx={{ fontSize: 18, color: getSalary(job) ? '#00C853' : 'text.secondary' }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: getSalary(job) ? '#00C853' : 'text.secondary' }}>
                        {getSalary(job) ?? 'Not specified'}
                      </Typography>
                      {getSalary(job) && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                          {job.jobType === 'internship' || job.jobType === 'part-time' || job.jobType === 'contract' ? '' : '/year'}
                        </Typography>
                      )}
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
                          {job.applicantCount || 0} applicant{(job.applicantCount || 0) === 1 ? '' : 's'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Coding Tests Badge
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
                    )} */}
 
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
                          {getExperienceDisplay(job.experienceLevel)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#FFB400' }}>
                          <StarIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {typeof job.rating === 'number' ? job.rating.toFixed(1) : 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <ApplyButton
                          className="apply-btn"
                          endIcon={<ArrowForwardIcon />}
                          onClick={(e) => handleApplyClick(e, job.id)}
                          disabled={appliedJobIds.has(job.id)}
                          sx={
                            appliedJobIds.has(job.id)
                              ? {
                                  bgcolor: alpha(colors.success, 0.14),
                                  borderColor: colors.success,
                                  color: colors.success,
                                }
                              : undefined
                          }
                        >
                          {appliedJobIds.has(job.id) ? 'Applied' : 'Apply'}
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



