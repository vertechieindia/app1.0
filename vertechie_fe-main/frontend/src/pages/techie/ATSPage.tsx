/**
 * ATSPage - Applicant Tracking System for Hiring Managers
 * 
 * User-side ATS for managing job postings, tracking candidates, and hiring pipeline
 * Similar to LinkedIn Recruiter, Workday, Greenhouse
 * 
 * Features:
 * - Dashboard overview with key metrics
 * - Job postings management
 * - Candidate pipeline (Kanban-style)
 * - Interview scheduling
 * - Analytics & reports
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  IconButton,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Badge,
  LinearProgress,
  Menu,
  MenuItem,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AvatarGroup,
  Tooltip,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import WorkIcon from '@mui/icons-material/Work';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ArchiveIcon from '@mui/icons-material/Archive';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ScheduleIcon from '@mui/icons-material/Schedule';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ViewListIcon from '@mui/icons-material/ViewList';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

// Styled Components
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: '1px solid rgba(13, 71, 161, 0.1)',
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: '#0d47a1',
    minHeight: 56,
  },
  '& .Mui-selected': {
    color: '#0d47a1',
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#0d47a1',
    height: 3,
  },
}));

const MetricCard = styled(Card)<{ trend?: 'up' | 'down' | 'neutral' }>(({ theme, trend }) => ({
  position: 'relative',
  overflow: 'visible',
  background: 'linear-gradient(135deg, rgba(13, 71, 161, 0.03) 0%, rgba(90, 200, 250, 0.08) 100%)',
  border: '1px solid rgba(13, 71, 161, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(13, 71, 161, 0.12)',
  },
}));

const JobCard = styled(Card)(({ theme }) => ({
  border: '1px solid rgba(13, 71, 161, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#0d47a1',
    boxShadow: '0 4px 16px rgba(13, 71, 161, 0.1)',
  },
}));

const CandidateCard = styled(Card)(({ theme }) => ({
  border: '1px solid rgba(13, 71, 161, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#5AC8FA',
    boxShadow: '0 4px 16px rgba(90, 200, 250, 0.2)',
  },
}));

const PipelineColumn = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  minHeight: 500,
  backgroundColor: alpha('#f5f7fa', 0.8),
  borderRadius: 12,
}));

const StatusChip = styled(Chip)<{ status: string }>(({ status }) => {
  const colors: Record<string, { bg: string; color: string }> = {
    active: { bg: alpha('#34C759', 0.1), color: '#34C759' },
    paused: { bg: alpha('#FF9500', 0.1), color: '#FF9500' },
    closed: { bg: alpha('#8E8E93', 0.1), color: '#8E8E93' },
    draft: { bg: alpha('#007AFF', 0.1), color: '#007AFF' },
  };
  const { bg, color } = colors[status] || colors.active;
  return {
    backgroundColor: bg,
    color: color,
    fontWeight: 600,
  };
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ATSPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedJob, setSelectedJob] = useState<string | null>('all');
  const [jobMenuAnchor, setJobMenuAnchor] = useState<null | HTMLElement>(null);
  const [candidateMenuAnchor, setCandidateMenuAnchor] = useState<null | HTMLElement>(null);
  
  // Post New Job Dialog
  const [openJobDialog, setOpenJobDialog] = useState(false);
  
  // Scheduling Link Settings
  const [showLinkSettings, setShowLinkSettings] = useState(false);
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);
  const [linkSettings, setLinkSettings] = useState({
    duration: '30',
    customDuration: '',
    validityDays: '7',
    customValidity: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    maxBookings: '',
    requireApproval: false,
    allowReschedule: true,
    bufferBefore: '0',
    bufferAfter: '15',
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  const generateUniqueLink = () => {
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const duration = linkSettings.duration === 'custom' ? linkSettings.customDuration : linkSettings.duration;
    const link = `vertechie.com/book/${uniqueId}?d=${duration}m`;
    setGeneratedLink(link);
    return link;
  };

  const handleCopyGeneratedLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(`https://${generatedLink}`);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  // Mock metrics
  const metrics = {
    totalJobs: 8,
    activeJobs: 5,
    totalCandidates: 247,
    newThisWeek: 42,
    interviewsScheduled: 12,
    offersExtended: 3,
    avgTimeToHire: 18,
    conversionRate: 12.4,
  };

  // Mock jobs data
  const jobs = [
    {
      id: '1',
      title: 'Senior React Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$150K - $180K',
      status: 'active',
      applicants: 48,
      newApplicants: 8,
      posted: '2 weeks ago',
      views: 1250,
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$140K - $170K',
      status: 'active',
      applicants: 35,
      newApplicants: 5,
      posted: '1 week ago',
      views: 890,
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      location: 'Hybrid',
      type: 'Full-time',
      salary: '$120K - $150K',
      status: 'active',
      applicants: 62,
      newApplicants: 12,
      posted: '3 days ago',
      views: 2100,
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$160K - $190K',
      status: 'paused',
      applicants: 28,
      newApplicants: 0,
      posted: '1 month ago',
      views: 750,
    },
  ];

  // Mock pipeline data
  const pipelineStages = [
    { 
      id: 'new', 
      title: 'New Applicants', 
      color: '#007AFF',
      candidates: [
        { id: '1', name: 'Sarah Johnson', role: 'Senior React Developer', avatar: '', rating: 4, appliedDate: '2 hours ago', skills: ['React', 'TypeScript', 'Node.js'] },
        { id: '2', name: 'Mike Chen', role: 'Senior React Developer', avatar: '', rating: 5, appliedDate: '5 hours ago', skills: ['React', 'Redux', 'GraphQL'] },
        { id: '3', name: 'Emily Davis', role: 'UX Designer', avatar: '', rating: 3, appliedDate: '1 day ago', skills: ['Figma', 'UI/UX', 'Prototyping'] },
      ]
    },
    { 
      id: 'screening', 
      title: 'Screening', 
      color: '#FF9500',
      candidates: [
        { id: '4', name: 'Alex Rivera', role: 'Product Manager', avatar: '', rating: 4, appliedDate: '3 days ago', skills: ['Agile', 'Roadmapping', 'Analytics'] },
        { id: '5', name: 'Jordan Lee', role: 'Senior React Developer', avatar: '', rating: 5, appliedDate: '4 days ago', skills: ['React', 'Next.js', 'AWS'] },
      ]
    },
    { 
      id: 'interview', 
      title: 'Interview', 
      color: '#5856D6',
      candidates: [
        { id: '6', name: 'Taylor Smith', role: 'UX Designer', avatar: '', rating: 5, appliedDate: '1 week ago', skills: ['Design Systems', 'User Research', 'Figma'], interviewDate: 'Tomorrow, 2:00 PM' },
        { id: '7', name: 'Chris Brown', role: 'DevOps Engineer', avatar: '', rating: 4, appliedDate: '1 week ago', skills: ['Kubernetes', 'Docker', 'CI/CD'], interviewDate: 'Jan 2, 10:00 AM' },
      ]
    },
    { 
      id: 'offer', 
      title: 'Offer Stage', 
      color: '#34C759',
      candidates: [
        { id: '8', name: 'Morgan Williams', role: 'Senior React Developer', avatar: '', rating: 5, appliedDate: '2 weeks ago', skills: ['React', 'System Design', 'Leadership'] },
      ]
    },
    { 
      id: 'hired', 
      title: 'Hired', 
      color: '#00C7BE',
      candidates: [
        { id: '9', name: 'Jamie Wilson', role: 'Product Manager', avatar: '', rating: 5, appliedDate: '3 weeks ago', skills: ['Strategy', 'Data Analysis', 'Team Lead'], startDate: 'Jan 15, 2025' },
      ]
    },
  ];

  // Mock interviews
  const upcomingInterviews = [
    { id: '1', candidate: 'Taylor Smith', role: 'UX Designer', type: 'Technical', date: 'Tomorrow', time: '2:00 PM', interviewers: ['John D.', 'Sarah M.'] },
    { id: '2', candidate: 'Chris Brown', role: 'DevOps Engineer', type: 'Cultural Fit', date: 'Jan 2', time: '10:00 AM', interviewers: ['Mike R.'] },
    { id: '3', candidate: 'Alex Rivera', role: 'Product Manager', type: 'Final Round', date: 'Jan 3', time: '3:00 PM', interviewers: ['CEO', 'VP Product'] },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => window.history.back()}
            sx={{ 
              bgcolor: alpha('#0d47a1', 0.1), 
              '&:hover': { bgcolor: alpha('#0d47a1', 0.2) } 
            }}
          >
            <ArrowBackIcon sx={{ color: '#0d47a1' }} />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={700} color="#1a237e" sx={{ mb: 0.5 }}>
              Applicant Tracking System
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your job postings and track candidates through the hiring pipeline
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />}>
            Sync Data
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            sx={{ bgcolor: '#0d47a1' }}
            onClick={() => setOpenJobDialog(true)}
          >
            Post New Job
          </Button>
        </Box>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3} lg={1.5}>
          <MetricCard>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="#0d47a1">{metrics.activeJobs}</Typography>
              <Typography variant="caption" color="text.secondary">Active Jobs</Typography>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid item xs={6} sm={3} lg={1.5}>
          <MetricCard>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="#0d47a1">{metrics.totalCandidates}</Typography>
              <Typography variant="caption" color="text.secondary">Candidates</Typography>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid item xs={6} sm={3} lg={1.5}>
          <MetricCard>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Badge badgeContent={`+${metrics.newThisWeek}`} color="success" sx={{ '& .MuiBadge-badge': { right: -10, top: 5 } }}>
                <Typography variant="h4" fontWeight={700} color="#0d47a1">{metrics.newThisWeek}</Typography>
              </Badge>
              <Typography variant="caption" color="text.secondary">New This Week</Typography>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid item xs={6} sm={3} lg={1.5}>
          <MetricCard>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="#5856D6">{metrics.interviewsScheduled}</Typography>
              <Typography variant="caption" color="text.secondary">Interviews</Typography>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid item xs={6} sm={3} lg={1.5}>
          <MetricCard>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="#34C759">{metrics.offersExtended}</Typography>
              <Typography variant="caption" color="text.secondary">Offers Extended</Typography>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid item xs={6} sm={3} lg={1.5}>
          <MetricCard>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight={700} color="#FF9500">{metrics.avgTimeToHire}d</Typography>
              <Typography variant="caption" color="text.secondary">Avg Time to Hire</Typography>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid item xs={6} sm={3} lg={1.5}>
          <MetricCard>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                <Typography variant="h4" fontWeight={700} color="#0d47a1">{metrics.conversionRate}%</Typography>
                <TrendingUpIcon sx={{ color: '#34C759', fontSize: 20 }} />
              </Box>
              <Typography variant="caption" color="text.secondary">Conversion Rate</Typography>
            </CardContent>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <StyledTabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab icon={<ViewKanbanIcon />} iconPosition="start" label="Pipeline" />
          <Tab icon={<WorkIcon />} iconPosition="start" label="Job Postings" />
          <Tab icon={<PersonIcon />} iconPosition="start" label="All Candidates" />
          <Tab icon={<CalendarTodayIcon />} iconPosition="start" label="Interviews" />
          <Tab icon={<ScheduleIcon />} iconPosition="start" label="Scheduling" />
          <Tab icon={<TrendingUpIcon />} iconPosition="start" label="Analytics" />
        </StyledTabs>

        {/* Pipeline Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ px: 3 }}>
            {/* Pipeline Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Filter by Job</InputLabel>
                  <Select
                    value={selectedJob}
                    label="Filter by Job"
                    onChange={(e) => setSelectedJob(e.target.value)}
                  >
                    <MenuItem value="all">All Jobs</MenuItem>
                    {jobs.map((job) => (
                      <MenuItem key={job.id} value={job.id}>{job.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  placeholder="Search candidates..."
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                  }}
                  sx={{ width: 250 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  onClick={() => setViewMode('kanban')} 
                  sx={{ bgcolor: viewMode === 'kanban' ? alpha('#0d47a1', 0.1) : 'transparent' }}
                >
                  <ViewKanbanIcon color={viewMode === 'kanban' ? 'primary' : 'action'} />
                </IconButton>
                <IconButton 
                  onClick={() => setViewMode('list')} 
                  sx={{ bgcolor: viewMode === 'list' ? alpha('#0d47a1', 0.1) : 'transparent' }}
                >
                  <ViewListIcon color={viewMode === 'list' ? 'primary' : 'action'} />
                </IconButton>
              </Box>
            </Box>

            {/* Kanban Pipeline */}
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
              {pipelineStages.map((stage) => (
                <PipelineColumn key={stage.id} sx={{ minWidth: 280, maxWidth: 280 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: stage.color }} />
                      <Typography fontWeight={600}>{stage.title}</Typography>
                      <Chip label={stage.candidates.length} size="small" sx={{ height: 20, fontSize: '0.75rem' }} />
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {stage.candidates.map((candidate) => (
                      <CandidateCard key={candidate.id} elevation={0}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                              <Avatar sx={{ width: 36, height: 36, bgcolor: stage.color }}>
                                {candidate.name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600}>{candidate.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{candidate.role}</Typography>
                              </Box>
                            </Box>
                            <IconButton size="small" onClick={(e) => setCandidateMenuAnchor(e.currentTarget)}>
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                            {candidate.skills.slice(0, 2).map((skill) => (
                              <Chip key={skill} label={skill} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                            ))}
                            {candidate.skills.length > 2 && (
                              <Chip label={`+${candidate.skills.length - 2}`} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                            )}
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                star <= candidate.rating 
                                  ? <StarIcon key={star} sx={{ fontSize: 14, color: '#FFD700' }} />
                                  : <StarBorderIcon key={star} sx={{ fontSize: 14, color: '#E0E0E0' }} />
                              ))}
                            </Box>
                            <Typography variant="caption" color="text.secondary">{candidate.appliedDate}</Typography>
                          </Box>
                          
                          {(candidate as any).interviewDate && (
                            <Box sx={{ mt: 1.5, p: 1, bgcolor: alpha('#5856D6', 0.1), borderRadius: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <VideoCallIcon sx={{ fontSize: 14, color: '#5856D6' }} />
                                <Typography variant="caption" color="#5856D6" fontWeight={600}>
                                  {(candidate as any).interviewDate}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          
                          {(candidate as any).startDate && (
                            <Box sx={{ mt: 1.5, p: 1, bgcolor: alpha('#34C759', 0.1), borderRadius: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CheckCircleIcon sx={{ fontSize: 14, color: '#34C759' }} />
                                <Typography variant="caption" color="#34C759" fontWeight={600}>
                                  Starts: {(candidate as any).startDate}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </CardContent>
                      </CandidateCard>
                    ))}
                  </Box>
                </PipelineColumn>
              ))}
            </Box>
          </Box>
        </TabPanel>

        {/* Job Postings Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ px: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <TextField
                size="small"
                placeholder="Search jobs..."
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                }}
                sx={{ width: 300 }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" startIcon={<FilterListIcon />}>Filter</Button>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#0d47a1' }}>
                  Create Job
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2}>
              {jobs.map((job) => (
                <Grid item xs={12} md={6} key={job.id}>
                  <JobCard>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="h6" fontWeight={600}>{job.title}</Typography>
                            <StatusChip label={job.status.toUpperCase()} status={job.status} size="small" />
                          </Box>
                          <Typography variant="body2" color="text.secondary">{job.department}</Typography>
                        </Box>
                        <IconButton onClick={(e) => setJobMenuAnchor(e.currentTarget)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2">{job.location}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2">{job.type}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AttachMoneyIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2">{job.salary}</Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PersonIcon sx={{ fontSize: 18, color: '#0d47a1' }} />
                            <Typography variant="body2" fontWeight={600}>{job.applicants} applicants</Typography>
                            {job.newApplicants > 0 && (
                              <Chip label={`+${job.newApplicants} new`} size="small" color="success" sx={{ height: 20, fontSize: '0.7rem' }} />
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <VisibilityIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2">{job.views} views</Typography>
                          </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary">Posted {job.posted}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button variant="contained" size="small" sx={{ bgcolor: '#0d47a1', flex: 1 }}>
                          View Applicants
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<EditIcon />}>
                          Edit
                        </Button>
                      </Box>
                    </CardContent>
                  </JobCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>

        {/* All Candidates Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ px: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>All Candidates ({metrics.totalCandidates})</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  size="small"
                  placeholder="Search by name, email, or skills..."
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                  }}
                  sx={{ width: 350 }}
                />
                <Button variant="outlined" startIcon={<DownloadIcon />}>Export</Button>
              </Box>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
              Candidate list view with advanced filtering, sorting, and bulk actions coming soon...
            </Typography>
          </Box>
        </TabPanel>

        {/* Interviews Tab */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ px: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>Upcoming Interviews</Typography>
              <Button variant="contained" startIcon={<ScheduleIcon />} sx={{ bgcolor: '#0d47a1' }}>
                Schedule Interview
              </Button>
            </Box>
            
            <List>
              {upcomingInterviews.map((interview, idx) => (
                <React.Fragment key={interview.id}>
                  <ListItem sx={{ py: 2, px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#5856D6' }}>{interview.candidate.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography fontWeight={600}>{interview.candidate}</Typography>
                          <Chip label={interview.type} size="small" sx={{ bgcolor: alpha('#5856D6', 0.1), color: '#5856D6' }} />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">{interview.role}</Typography>
                          <Typography variant="body2" color="text.secondary">•</Typography>
                          <Typography variant="body2" color="#5856D6" fontWeight={600}>
                            {interview.date} at {interview.time}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <AvatarGroup max={3}>
                        {interview.interviewers.map((name, i) => (
                          <Tooltip key={i} title={name}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#0d47a1', fontSize: 12 }}>
                              {name.charAt(0)}
                            </Avatar>
                          </Tooltip>
                        ))}
                      </AvatarGroup>
                      <Button variant="outlined" size="small" startIcon={<VideoCallIcon />}>
                        Join
                      </Button>
                      <IconButton size="small"><MoreVertIcon /></IconButton>
                    </Box>
                  </ListItem>
                  {idx < upcomingInterviews.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </TabPanel>

        {/* Scheduling Tab - Full Inline Dashboard */}
        <TabPanel value={activeTab} index={4}>
          <Box sx={{ px: 3 }}>
            {/* Header with Scheduling Link */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h5" fontWeight={700} color="#1a237e" sx={{ mb: 0.5 }}>
                  Calendar & Scheduling
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your availability, meeting types, and booking links
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<CalendarTodayIcon />}
                  onClick={() => window.location.href = '/techie/calendar'}
                >
                  View Calendar
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  sx={{ bgcolor: '#0d47a1' }}
                  onClick={() => setShowCreateMeeting(true)}
                >
                  Create Meeting Type
                </Button>
              </Box>
            </Box>

            {/* Scheduling Link */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: alpha('#0d47a1', 0.03), border: '1px solid rgba(13, 71, 161, 0.1)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LinkIcon sx={{ color: '#0d47a1' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Your Scheduling Link</Typography>
                    <Typography variant="body1" fontWeight={600} color="#0d47a1">
                      vertechie.com/schedule/johndoe
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Tooltip title="Customize Link Settings">
                    <IconButton 
                      onClick={() => setShowLinkSettings(true)}
                      sx={{ 
                        bgcolor: alpha('#0d47a1', 0.1),
                        '&:hover': { bgcolor: alpha('#0d47a1', 0.2) }
                      }}
                    >
                      <SettingsIcon sx={{ color: '#0d47a1' }} />
                    </IconButton>
                  </Tooltip>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => navigator.clipboard.writeText('https://vertechie.com/schedule/johndoe')}
                  >
                    Copy Link
                  </Button>
                  <Button size="small" variant="outlined">Share</Button>
                </Box>
              </Box>
            </Paper>
            
            {/* Quick Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} md={3}>
                <Card sx={{ p: 2, textAlign: 'center', border: '1px solid rgba(13, 71, 161, 0.1)' }}>
                  <Typography variant="h4" color="#0d47a1" fontWeight={700}>4</Typography>
                  <Typography variant="body2" color="text.secondary">Active Meeting Types</Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ p: 2, textAlign: 'center', border: '1px solid rgba(13, 71, 161, 0.1)' }}>
                  <Typography variant="h4" color="#34C759" fontWeight={700}>2</Typography>
                  <Typography variant="body2" color="text.secondary">Calendars Connected</Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ p: 2, textAlign: 'center', border: '1px solid rgba(13, 71, 161, 0.1)' }}>
                  <Typography variant="h4" color="#5856D6" fontWeight={700}>12</Typography>
                  <Typography variant="body2" color="text.secondary">Upcoming Bookings</Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ p: 2, textAlign: 'center', border: '1px solid rgba(13, 71, 161, 0.1)' }}>
                  <Typography variant="h4" color="#FF9500" fontWeight={700}>85</Typography>
                  <Typography variant="body2" color="text.secondary">Total Bookings (30d)</Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Meeting Types Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Meeting Types</Typography>
                <Button size="small" startIcon={<AddIcon />}>Add New</Button>
              </Box>
              <Grid container spacing={2}>
                {[
                  { name: '30 Minute Meeting', duration: 30, color: '#0d47a1', location: 'Zoom', type: 'One-on-one', visibility: 'Public', bookings: 45, active: true },
                  { name: '60 Minute Meeting', duration: 60, color: '#34C759', location: 'Google Meet', type: 'One-on-one', visibility: 'Public', bookings: 23, active: true },
                  { name: 'Technical Interview', duration: 45, color: '#FF9500', location: 'Zoom', type: 'One-on-one', visibility: 'Private', bookings: 12, active: true },
                  { name: 'Team Round Robin', duration: 30, color: '#8E8E93', location: 'Teams', type: 'Round Robin', visibility: 'Private', bookings: 8, active: false },
                ].map((meeting, idx) => (
                  <Grid item xs={12} sm={6} md={3} key={idx}>
                    <Card sx={{ 
                      p: 2, 
                      borderTop: `4px solid ${meeting.color}`,
                      opacity: meeting.active ? 1 : 0.6,
                      border: '1px solid rgba(13, 71, 161, 0.1)',
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ 
                          width: 10, 
                          height: 10, 
                          borderRadius: '50%', 
                          bgcolor: meeting.color,
                          mt: 0.5
                        }} />
                        <Chip 
                          label={meeting.active ? 'Active' : 'Inactive'} 
                          size="small" 
                          sx={{ 
                            fontSize: '0.7rem',
                            bgcolor: meeting.active ? alpha('#34C759', 0.1) : alpha('#8E8E93', 0.1),
                            color: meeting.active ? '#34C759' : '#8E8E93',
                          }} 
                        />
                      </Box>
                      <Typography fontWeight={600} sx={{ mb: 1 }}>{meeting.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          ⏱ {meeting.duration} min
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          📍 {meeting.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip label={meeting.type} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                        <Chip label={meeting.visibility} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {meeting.bookings} bookings
                        </Typography>
                        <Box>
                          <IconButton size="small"><ContentCopyIcon fontSize="small" /></IconButton>
                          <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                          <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Two Column Layout for Availability & Calendar */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Availability Section */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, border: '1px solid rgba(13, 71, 161, 0.1)', height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>Availability</Typography>
                    <Button size="small" startIcon={<EditIcon />}>Edit</Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[
                      { day: 'Monday', hours: '9:00 AM - 5:00 PM', active: true },
                      { day: 'Tuesday', hours: '9:00 AM - 5:00 PM', active: true },
                      { day: 'Wednesday', hours: '9:00 AM - 5:00 PM', active: true },
                      { day: 'Thursday', hours: '9:00 AM - 5:00 PM', active: true },
                      { day: 'Friday', hours: '9:00 AM - 3:00 PM', active: true },
                      { day: 'Saturday', hours: 'Unavailable', active: false },
                      { day: 'Sunday', hours: 'Unavailable', active: false },
                    ].map((day, idx) => (
                      <Box 
                        key={idx} 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          py: 0.5,
                          px: 1,
                          borderRadius: 1,
                          bgcolor: day.active ? alpha('#0d47a1', 0.03) : 'transparent',
                        }}
                      >
                        <Typography variant="body2" fontWeight={day.active ? 500 : 400} color={day.active ? 'text.primary' : 'text.secondary'}>
                          {day.day}
                        </Typography>
                        <Typography variant="body2" color={day.active ? '#0d47a1' : 'text.secondary'}>
                          {day.hours}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>

              {/* Connected Calendars */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, border: '1px solid rgba(13, 71, 161, 0.1)', height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>Connected Calendars</Typography>
                    <Button size="small" startIcon={<AddIcon />}>Connect</Button>
                  </Box>
                  <List disablePadding>
                    {[
                      { name: 'Google Calendar', email: 'john.doe@gmail.com', icon: '📅', color: '#4285F4', synced: true },
                      { name: 'Microsoft Outlook', email: 'john.doe@company.com', icon: '📆', color: '#00a4ef', synced: true },
                    ].map((cal, idx) => (
                      <ListItem key={idx} sx={{ px: 1, py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(cal.color, 0.1), width: 36, height: 36 }}>
                            <Typography>{cal.icon}</Typography>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={cal.name} 
                          secondary={cal.email}
                          primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                          secondaryTypographyProps={{ fontSize: '0.75rem' }}
                        />
                        <Chip 
                          label="Connected" 
                          size="small" 
                          sx={{ bgcolor: alpha('#34C759', 0.1), color: '#34C759', fontSize: '0.7rem' }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" fullWidth>+ Google</Button>
                    <Button size="small" variant="outlined" fullWidth>+ Microsoft</Button>
                    <Button size="small" variant="outlined" fullWidth>+ Apple</Button>
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Upcoming Bookings */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Upcoming Bookings</Typography>
                <Button size="small">View All</Button>
              </Box>
              <Card sx={{ border: '1px solid rgba(13, 71, 161, 0.1)' }}>
                <List disablePadding>
                  {[
                    { name: 'Sarah Chen', email: 'sarah.chen@email.com', type: '30 Minute Meeting', date: 'Tomorrow', time: '10:00 AM - 10:30 AM', color: '#0d47a1' },
                    { name: 'Mike Johnson', email: 'mike.j@company.com', type: 'Technical Interview', date: 'Jan 2, 2025', time: '2:00 PM - 2:45 PM', color: '#FF9500' },
                    { name: 'Alex Rivera', email: 'alex.r@startup.io', type: '60 Minute Meeting', date: 'Jan 3, 2025', time: '11:00 AM - 12:00 PM', color: '#34C759' },
                  ].map((booking, idx) => (
                    <React.Fragment key={idx}>
                      <ListItem sx={{ py: 2 }}>
                        <Box sx={{ width: 4, height: 40, bgcolor: booking.color, borderRadius: 2, mr: 2 }} />
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(booking.color, 0.1), color: booking.color }}>
                            {booking.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography fontWeight={600}>{booking.name}</Typography>
                              <Chip label={booking.type} size="small" sx={{ fontSize: '0.65rem' }} />
                            </Box>
                          }
                          secondary={booking.email}
                        />
                        <Box sx={{ textAlign: 'right', mr: 2 }}>
                          <Typography variant="body2" fontWeight={600}>{booking.date}</Typography>
                          <Typography variant="caption" color="text.secondary">{booking.time}</Typography>
                        </Box>
                        <Box>
                          <Button size="small" variant="outlined" sx={{ mr: 1 }}>Reschedule</Button>
                          <Button size="small" color="error">Cancel</Button>
                        </Box>
                      </ListItem>
                      {idx < 2 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Card>
            </Box>
          </Box>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={activeTab} index={5}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Hiring Analytics</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Pipeline Conversion</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {[
                        { stage: 'Applied → Screening', rate: 45 },
                        { stage: 'Screening → Interview', rate: 32 },
                        { stage: 'Interview → Offer', rate: 18 },
                        { stage: 'Offer → Hired', rate: 85 },
                      ].map((item) => (
                        <Box key={item.stage}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2">{item.stage}</Typography>
                            <Typography variant="body2" fontWeight={600}>{item.rate}%</Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={item.rate} 
                            sx={{ 
                              height: 6, 
                              borderRadius: 3,
                              bgcolor: alpha('#0d47a1', 0.1),
                              '& .MuiLinearProgress-bar': { bgcolor: '#0d47a1' }
                            }} 
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Top Sources</Typography>
                    <List dense>
                      {[
                        { source: 'LinkedIn', candidates: 89, percent: 36 },
                        { source: 'VerTechie', candidates: 65, percent: 26 },
                        { source: 'Referrals', candidates: 48, percent: 19 },
                        { source: 'Indeed', candidates: 28, percent: 11 },
                        { source: 'Direct', candidates: 17, percent: 7 },
                      ].map((item) => (
                        <ListItem key={item.source} sx={{ px: 0 }}>
                          <ListItemText 
                            primary={item.source} 
                            secondary={`${item.candidates} candidates`}
                          />
                          <Chip label={`${item.percent}%`} size="small" />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Time to Hire by Role</Typography>
                    <List dense>
                      {[
                        { role: 'Engineering', days: 21, color: '#0d47a1' },
                        { role: 'Product', days: 25, color: '#5856D6' },
                        { role: 'Design', days: 18, color: '#FF9500' },
                        { role: 'Sales', days: 14, color: '#34C759' },
                        { role: 'Marketing', days: 16, color: '#FF2D55' },
                      ].map((item) => (
                        <ListItem key={item.role} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(item.color, 0.1) }}>
                              <AccessTimeIcon sx={{ fontSize: 16, color: item.color }} />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={item.role} />
                          <Typography variant="body2" fontWeight={600}>{item.days} days</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>

      {/* Context Menus */}
      <Menu anchorEl={jobMenuAnchor} open={Boolean(jobMenuAnchor)} onClose={() => setJobMenuAnchor(null)}>
        <MenuItem onClick={() => setJobMenuAnchor(null)}><EditIcon sx={{ mr: 1, fontSize: 18 }} /> Edit Job</MenuItem>
        <MenuItem onClick={() => setJobMenuAnchor(null)}><VisibilityIcon sx={{ mr: 1, fontSize: 18 }} /> View Applicants</MenuItem>
        <MenuItem onClick={() => setJobMenuAnchor(null)}><ArchiveIcon sx={{ mr: 1, fontSize: 18 }} /> Pause Job</MenuItem>
        <Divider />
        <MenuItem onClick={() => setJobMenuAnchor(null)} sx={{ color: 'error.main' }}><DeleteIcon sx={{ mr: 1, fontSize: 18 }} /> Delete</MenuItem>
      </Menu>

      <Menu anchorEl={candidateMenuAnchor} open={Boolean(candidateMenuAnchor)} onClose={() => setCandidateMenuAnchor(null)}>
        <MenuItem onClick={() => setCandidateMenuAnchor(null)}><PersonIcon sx={{ mr: 1, fontSize: 18 }} /> View Profile</MenuItem>
        <MenuItem onClick={() => setCandidateMenuAnchor(null)}><EmailIcon sx={{ mr: 1, fontSize: 18 }} /> Send Email</MenuItem>
        <MenuItem onClick={() => setCandidateMenuAnchor(null)}><ScheduleIcon sx={{ mr: 1, fontSize: 18 }} /> Schedule Interview</MenuItem>
        <MenuItem onClick={() => setCandidateMenuAnchor(null)}><AssignmentIcon sx={{ mr: 1, fontSize: 18 }} /> Send Assessment</MenuItem>
        <Divider />
        <MenuItem onClick={() => setCandidateMenuAnchor(null)}><ThumbUpIcon sx={{ mr: 1, fontSize: 18, color: '#34C759' }} /> Move to Next Stage</MenuItem>
        <MenuItem onClick={() => setCandidateMenuAnchor(null)} sx={{ color: 'error.main' }}><ThumbDownIcon sx={{ mr: 1, fontSize: 18 }} /> Reject</MenuItem>
      </Menu>

      {/* Scheduling Link Settings Dialog */}
      <Dialog open={showLinkSettings} onClose={() => setShowLinkSettings(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid rgba(13, 71, 161, 0.1)', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SettingsIcon sx={{ color: '#0d47a1' }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>Customize Scheduling Link</Typography>
              <Typography variant="body2" color="text.secondary">Create a unique booking link with specific constraints</Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {/* Meeting Duration */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon sx={{ fontSize: 18, color: '#0d47a1' }} /> Meeting Duration
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['15', '30', '45', '60', '90', 'custom'].map((dur) => (
                  <Chip key={dur} label={dur === 'custom' ? 'Custom' : `${dur} min`}
                    onClick={() => setLinkSettings({ ...linkSettings, duration: dur })}
                    variant={linkSettings.duration === dur ? 'filled' : 'outlined'}
                    sx={{ bgcolor: linkSettings.duration === dur ? '#0d47a1' : 'transparent', color: linkSettings.duration === dur ? '#fff' : 'inherit' }}
                  />
                ))}
              </Box>
              {linkSettings.duration === 'custom' && (
                <TextField size="small" type="number" placeholder="Enter minutes" value={linkSettings.customDuration}
                  onChange={(e) => setLinkSettings({ ...linkSettings, customDuration: e.target.value })}
                  sx={{ mt: 1.5, width: 150 }} InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }}
                />
              )}
            </Grid>

            {/* Link Validity */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 18, color: '#0d47a1' }} /> Link Validity
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                {['1', '3', '7', '14', '30', 'custom'].map((days) => (
                  <Chip key={days} label={days === 'custom' ? 'Custom' : days === '1' ? '1 day' : `${days} days`}
                    onClick={() => setLinkSettings({ ...linkSettings, validityDays: days })}
                    variant={linkSettings.validityDays === days ? 'filled' : 'outlined'} size="small"
                    sx={{ bgcolor: linkSettings.validityDays === days ? '#34C759' : 'transparent', color: linkSettings.validityDays === days ? '#fff' : 'inherit' }}
                  />
                ))}
              </Box>
              {linkSettings.validityDays === 'custom' && (
                <TextField size="small" type="number" placeholder="Days" value={linkSettings.customValidity}
                  onChange={(e) => setLinkSettings({ ...linkSettings, customValidity: e.target.value })}
                  sx={{ width: 120 }} InputProps={{ endAdornment: <InputAdornment position="end">days</InputAdornment> }}
                />
              )}
            </Grid>

            {/* Max Bookings */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Maximum Bookings (Optional)</Typography>
              <TextField size="small" type="number" placeholder="Unlimited" value={linkSettings.maxBookings}
                onChange={(e) => setLinkSettings({ ...linkSettings, maxBookings: e.target.value })}
                fullWidth helperText="Leave empty for unlimited bookings"
              />
            </Grid>

            {/* Date Range */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <DateRangeIcon sx={{ fontSize: 18, color: '#0d47a1' }} /> Available Date Range
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <TextField size="small" type="date" label="Start Date" value={linkSettings.startDate}
                    onChange={(e) => setLinkSettings({ ...linkSettings, startDate: e.target.value })}
                    fullWidth InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField size="small" type="date" label="End Date" value={linkSettings.endDate}
                    onChange={(e) => setLinkSettings({ ...linkSettings, endDate: e.target.value })}
                    fullWidth InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField size="small" type="time" label="Start Time" value={linkSettings.startTime}
                    onChange={(e) => setLinkSettings({ ...linkSettings, startTime: e.target.value })}
                    fullWidth InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField size="small" type="time" label="End Time" value={linkSettings.endTime}
                    onChange={(e) => setLinkSettings({ ...linkSettings, endTime: e.target.value })}
                    fullWidth InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Buffer Times */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Buffer Before Meeting</Typography>
              <FormControl size="small" fullWidth>
                <Select value={linkSettings.bufferBefore} onChange={(e) => setLinkSettings({ ...linkSettings, bufferBefore: e.target.value })}>
                  <MenuItem value="0">No buffer</MenuItem>
                  <MenuItem value="5">5 minutes</MenuItem>
                  <MenuItem value="10">10 minutes</MenuItem>
                  <MenuItem value="15">15 minutes</MenuItem>
                  <MenuItem value="30">30 minutes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Buffer After Meeting</Typography>
              <FormControl size="small" fullWidth>
                <Select value={linkSettings.bufferAfter} onChange={(e) => setLinkSettings({ ...linkSettings, bufferAfter: e.target.value })}>
                  <MenuItem value="0">No buffer</MenuItem>
                  <MenuItem value="5">5 minutes</MenuItem>
                  <MenuItem value="10">10 minutes</MenuItem>
                  <MenuItem value="15">15 minutes</MenuItem>
                  <MenuItem value="30">30 minutes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Additional Options */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Additional Options</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5 }}>
                  <Typography variant="body2">Require approval before confirming</Typography>
                  <Chip label={linkSettings.requireApproval ? 'Yes' : 'No'} size="small"
                    onClick={() => setLinkSettings({ ...linkSettings, requireApproval: !linkSettings.requireApproval })}
                    sx={{ bgcolor: linkSettings.requireApproval ? alpha('#0d47a1', 0.1) : 'transparent', cursor: 'pointer' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5 }}>
                  <Typography variant="body2">Allow rescheduling</Typography>
                  <Chip label={linkSettings.allowReschedule ? 'Yes' : 'No'} size="small"
                    onClick={() => setLinkSettings({ ...linkSettings, allowReschedule: !linkSettings.allowReschedule })}
                    sx={{ bgcolor: linkSettings.allowReschedule ? alpha('#34C759', 0.1) : 'transparent', cursor: 'pointer' }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Generated Link Preview */}
            {generatedLink && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: alpha('#34C759', 0.05), border: '1px solid', borderColor: alpha('#34C759', 0.3) }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircleIcon sx={{ color: '#34C759' }} />
                    <Typography variant="subtitle2" fontWeight={600} color="#34C759">Your Unique Link is Ready!</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#fff', p: 1.5, borderRadius: 1 }}>
                    <Typography variant="body1" fontWeight={600} sx={{ flex: 1, wordBreak: 'break-all' }}>https://{generatedLink}</Typography>
                    <Button variant="contained" size="small" startIcon={linkCopied ? <CheckCircleIcon /> : <ContentCopyOutlinedIcon />}
                      onClick={handleCopyGeneratedLink} sx={{ bgcolor: linkCopied ? '#34C759' : '#0d47a1', minWidth: 100 }}>
                      {linkCopied ? 'Copied!' : 'Copy'}
                    </Button>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Valid for {linkSettings.validityDays === 'custom' ? linkSettings.customValidity : linkSettings.validityDays} days • 
                    {linkSettings.duration === 'custom' ? linkSettings.customDuration : linkSettings.duration} min meetings
                    {linkSettings.maxBookings && ` • Max ${linkSettings.maxBookings} bookings`}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(13, 71, 161, 0.1)' }}>
          <Button onClick={() => { setShowLinkSettings(false); setGeneratedLink(''); }}>Cancel</Button>
          <Button variant="contained" onClick={generateUniqueLink} sx={{ bgcolor: '#0d47a1' }}>Generate Unique Link</Button>
        </DialogActions>
      </Dialog>

      {/* Post New Job Dialog */}
      <Dialog open={openJobDialog} onClose={() => setOpenJobDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee' }}>
          Post New Job
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Job Title *" placeholder="e.g., Senior Software Engineer" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Department *</InputLabel>
                <Select label="Department *" defaultValue="">
                  <MenuItem value="engineering">Engineering</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="hr">Human Resources</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Location" placeholder="e.g., New York, NY or Remote" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Employment Type</InputLabel>
                <Select label="Employment Type" defaultValue="">
                  <MenuItem value="fulltime">Full-time</MenuItem>
                  <MenuItem value="parttime">Part-time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Experience Level</InputLabel>
                <Select label="Experience Level" defaultValue="">
                  <MenuItem value="entry">Entry Level</MenuItem>
                  <MenuItem value="mid">Mid Level</MenuItem>
                  <MenuItem value="senior">Senior Level</MenuItem>
                  <MenuItem value="lead">Lead/Principal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Job Description" placeholder="Describe the role, responsibilities, and requirements..." />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setOpenJobDialog(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#0d47a1' }} onClick={() => setOpenJobDialog(false)}>
            Post Job
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Meeting Type Dialog */}
      <Dialog open={showCreateMeeting} onClose={() => setShowCreateMeeting(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create Meeting Type</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField 
              fullWidth 
              label="Meeting Name" 
              placeholder="e.g., 30 Minute Consultation" 
              sx={{ mb: 3 }} 
            />
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="Duration (minutes)" 
                  type="number" 
                  defaultValue={30}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Platform</InputLabel>
                  <Select label="Platform" defaultValue="zoom">
                    <MenuItem value="zoom">Zoom</MenuItem>
                    <MenuItem value="meet">Google Meet</MenuItem>
                    <MenuItem value="teams">Microsoft Teams</MenuItem>
                    <MenuItem value="phone">Phone Call</MenuItem>
                    <MenuItem value="inperson">In-Person</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField 
              fullWidth 
              label="Description" 
              multiline 
              rows={3} 
              placeholder="Add a description for this meeting type..."
              sx={{ mb: 3 }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Meeting Type</InputLabel>
                  <Select label="Meeting Type" defaultValue="one-on-one">
                    <MenuItem value="one-on-one">One-on-One</MenuItem>
                    <MenuItem value="group">Group Meeting</MenuItem>
                    <MenuItem value="round-robin">Round Robin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Visibility</InputLabel>
                  <Select label="Visibility" defaultValue="public">
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="private">Private (Link Only)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setShowCreateMeeting(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => setShowCreateMeeting(false)}
            sx={{ bgcolor: '#0d47a1' }}
          >
            Create Meeting Type
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ATSPage;

