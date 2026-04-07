import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Avatar,
  Divider,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  AdminPanelSettings,
  Work,
  People,
  TrendingUp,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Refresh,
  Download,
  FilterList,
  Search,
  Close,
  School,
  Business,
  Engineering,
  Email,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { BDMCompanyRegistrationQueue } from './BDMAdminDashboard';

/** BDM admins only need the company registration queue — same idea as `/vertechie/techieadmin` (single focused dashboard). */
function isBdmAdminFromStorage(): boolean {
  try {
    const raw = localStorage.getItem('userData');
    if (!raw) return false;
    const u = JSON.parse(raw);
    const roles = Array.isArray(u.admin_roles) ? u.admin_roles.map((r: string) => String(r).toLowerCase()) : [];
    return roles.includes('bdm_admin');
  } catch {
    return false;
  }
}

// Keyframe Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#ffffff',
  padding: theme.spacing(4, 0),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: 'linear-gradient(180deg, rgba(25, 118, 210, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
    pointerEvents: 'none',
  },
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
  color: 'white',
  borderRadius: theme.shape.borderRadius * 2,
  animation: `${fadeInUp} 0.6s ease-out`,
}));

const StatCard = styled(Card)<{ delay?: number }>(({ theme, delay = 0 }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: '12px',
  background: '#ffffff',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${fadeInUp} 0.5s ease-out`,
  animationDelay: `${delay}ms`,
  animationFillMode: 'both',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)',
    backgroundSize: '200% 100%',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.12)',
    border: '1px solid rgba(25, 118, 210, 0.15)',
    '&::before': {
      opacity: 1,
      animation: `${shimmer} 2s linear infinite`,
    },
  },
}));

const AnimatedIconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '52px',
  height: '52px',
  borderRadius: '14px',
  marginRight: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    animation: `${float} 2s ease-in-out infinite`,
  },
}));

const AnimatedTab = styled(Tab)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.95rem',
  textTransform: 'none',
  minHeight: '56px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
  },
  '&.Mui-selected': {
    color: '#1976d2',
  },
}));

const AnimatedTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
    transform: 'scale(1.005)',
  },
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
  },
}));

const AnimatedCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
  animation: `${fadeIn} 0.5s ease-out`,
  overflow: 'hidden',
  background: '#ffffff',
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salaryRange: string;
  status: 'active' | 'draft' | 'closed';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  applications: number;
}

interface HRUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'hr_manager' | 'hr_specialist' | 'recruiter';
  status: 'active' | 'inactive';
  lastLogin: string;
  jobPostingsCreated: number;
}

const SuperAdmin: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchParams] = useSearchParams();

  const [bdmAdminOnly] = useState(() => isBdmAdminFromStorage());

  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });

  // Email Template States
  const [selectedTemplateType, setSelectedTemplateType] = useState<'approval' | 'rejection' | 'welcome'>('approval');
  const [emailTemplates, setEmailTemplates] = useState({
    approval: {
      subject: '🎉 Congratulations {{user_name}}! Your Account is Approved',
      body: `Dear {{user_name}},

We're thrilled to inform you that your account has been verified and approved! 🎉

Here are your details:
• Email: {{email}}
• User ID: {{vertechie_id}}
• Account Type: {{user_type}}

You can now login and access all features:
{{login_url}}

Best regards,
The Vertechie Team`,
    },
    rejection: {
      subject: 'Account Application Update - {{user_name}}',
      body: `Dear {{user_name}},

Thank you for your interest in joining Vertechie.

After careful review of your application, we regret to inform you that we are unable to approve your account at this time.

This could be due to:
• Incomplete or unclear documentation
• Information verification issues
• Not meeting our current requirements

If you believe this is an error or would like to reapply, please contact our support team.

Best regards,
The Vertechie Team`,
    },
    welcome: {
      subject: 'Welcome to Vertechie, {{user_name}}! 🚀',
      body: `Dear {{user_name}},

Welcome to Vertechie! We're excited to have you on board.

Your account has been created successfully:
• Email: {{email}}
• Account Type: {{user_type}}

Get started by completing your profile and exploring our platform.

Need help? Our support team is always here for you.

Best regards,
The Vertechie Team`,
    },
  });
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false);
  const [templateSaveSuccess, setTemplateSaveSuccess] = useState(false);

  // Mock data - in real app, this would come from API
  const [jobPostings] = useState<JobPosting[]>([
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Join our engineering team to build and scale our verification platform.',
      requirements: ['5+ years experience', 'React, Node.js, TypeScript', 'Cloud platforms'],
      salaryRange: '$80,000 - $120,000',
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      createdBy: 'Sarah Johnson',
      applications: 24
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead product development and strategy for our verification platform.',
      requirements: ['3+ years PM experience', 'Analytical thinking', 'Agile methodologies'],
      salaryRange: '$70,000 - $100,000',
      status: 'draft',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
      createdBy: 'Mike Chen',
      applications: 0
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create intuitive and engaging user experiences for our platform.',
      requirements: ['3+ years design experience', 'Figma expertise', 'Portfolio required'],
      salaryRange: '$60,000 - $90,000',
      status: 'closed',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-25',
      createdBy: 'Sarah Johnson',
      applications: 18
    }
  ]);

  const [hrUsers] = useState<HRUser[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@vertechie.com',
      department: 'Human Resources',
      role: 'hr_manager',
      status: 'active',
      lastLogin: '2024-01-25',
      jobPostingsCreated: 12
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@vertechie.com',
      department: 'Human Resources',
      role: 'hr_specialist',
      status: 'active',
      lastLogin: '2024-01-24',
      jobPostingsCreated: 8
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@vertechie.com',
      department: 'Human Resources',
      role: 'recruiter',
      status: 'inactive',
      lastLogin: '2024-01-20',
      jobPostingsCreated: 5
    }
  ]);

  useEffect(() => {
    if (searchParams.get('bdm') === '1') {
      setActiveTab(1);
    }
  }, [searchParams]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'closed': return 'error';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'draft': return 'Draft';
      case 'closed': return 'Closed';
      case 'inactive': return 'Inactive';
      default: return status;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'hr_manager': return 'HR Manager';
      case 'hr_specialist': return 'HR Specialist';
      case 'recruiter': return 'Recruiter';
      default: return role;
    }
  };

  const totalJobs = jobPostings.length;
  const activeJobs = jobPostings.filter(job => job.status === 'active').length;
  const totalApplications = jobPostings.reduce((sum, job) => sum + job.applications, 0);
  const activeHRUsers = hrUsers.filter(user => user.status === 'active').length;

  const TabPanel = ({ children, value, index, ...other }: any) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  if (bdmAdminOnly) {
    return <BDMCompanyRegistrationQueue embedded={false} />;
  }

  return (
    <PageContainer>
      <Container maxWidth="xl">
        {/* Header */}
        {/* <HeaderCard>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AdminPanelSettings sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                  Super Admin Dashboard
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Oversee HR operations and job posting management
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </HeaderCard> */}

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard delay={0}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AnimatedIconWrapper sx={{ 
                  background: 'linear-gradient(135deg, rgba(0, 119, 181, 0.1) 0%, rgba(0, 119, 181, 0.05) 100%)',
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  mr: 1,
                }}>
                  <Work sx={{ fontSize: 18, color: '#0077B5' }} />
                </AnimatedIconWrapper>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', fontSize: '1rem' }}>
                  Total Jobs
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#0077B5', mb: 0.25 }}>
                {totalJobs}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
                {activeJobs} active
              </Typography>
            </StatCard>
          </Grid>
          
          <Grid item xs={6} sm={6} md={3}>
            <StatCard delay={100}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AnimatedIconWrapper sx={{ 
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  mr: 1,
                }}>
                  <TrendingUp sx={{ fontSize: 18, color: '#4caf50' }} />
                </AnimatedIconWrapper>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', fontSize: '1rem' }}>
                  Applications
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#4caf50', mb: 0.25 }}>
                {totalApplications}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Total received
              </Typography>
            </StatCard>
          </Grid>
          
          <Grid item xs={6} sm={6} md={3}>
            <StatCard delay={200}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AnimatedIconWrapper sx={{ 
                  background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)',
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  mr: 1,
                }}>
                  <People sx={{ fontSize: 18, color: '#ff9800' }} />
                </AnimatedIconWrapper>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', fontSize: '1rem' }}>
                  HR Team
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#ff9800', mb: 0.25 }}>
                {activeHRUsers}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Active members
              </Typography>
            </StatCard>
          </Grid>
          
          <Grid item xs={6} sm={6} md={3}>
            <StatCard delay={300}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AnimatedIconWrapper sx={{ 
                  background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(156, 39, 176, 0.05) 100%)',
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  mr: 1,
                }}>
                  <CheckCircle sx={{ fontSize: 18, color: '#9c27b0' }} />
                </AnimatedIconWrapper>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', fontSize: '1rem' }}>
                  Success Rate
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#9c27b0', mb: 0.25 }}>
                85%
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Job fill rate
              </Typography>
            </StatCard>
          </Grid>
        </Grid>

        {/* Tabs */}
        <AnimatedCard sx={{ mb: 4 }}>
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'rgba(0, 0, 0, 0.08)',
            background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
          }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTabs-indicator': {
                  height: '3px',
                  borderRadius: '3px 3px 0 0',
                  background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                },
              }}
            >
              <AnimatedTab label="Job Postings Overview" />
              <AnimatedTab label="Company Profiles" />
              <AnimatedTab label="HR Team Management" />
              <AnimatedTab label="Analytics & Reports" />
              <AnimatedTab label="Email Templates" />
            </Tabs>
          </Box>

          {/* Job Postings Tab */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                All Job Postings
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <AnimatedButton startIcon={<Refresh />} variant="outlined" size="small" sx={{ borderColor: 'rgba(25, 118, 210, 0.3)' }}>
                  Refresh
                </AnimatedButton>
                <AnimatedButton startIcon={<Download />} variant="outlined" size="small" sx={{ borderColor: 'rgba(25, 118, 210, 0.3)' }}>
                  Export
                </AnimatedButton>
              </Box>
            </Box>

            <TableContainer component={Paper} sx={{ 
              borderRadius: '12px', 
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              overflow: 'hidden',
            }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Job Title</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Created By</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Applications</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobPostings.map((job, index) => (
                    <AnimatedTableRow 
                      key={job.id}
                      sx={{ 
                        animation: `${fadeIn} 0.4s ease-out`,
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: 'both',
                      }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          {job.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {job.salaryRange}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={job.department} 
                          size="small" 
                          sx={{ 
                            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
                            color: '#1976d2',
                            fontWeight: 500,
                            border: 'none',
                          }} 
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#475569' }}>{job.location}</TableCell>
                      <TableCell sx={{ color: '#475569' }}>{job.type}</TableCell>
                      <TableCell>
                        <StatusChip 
                          label={getStatusLabel(job.status)} 
                          color={getStatusColor(job.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#475569' }}>{job.createdBy}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1, fontWeight: 600, color: '#1e293b' }}>
                            {job.applications}
                          </Typography>
                          {job.applications > 0 && (
                            <LinearProgress 
                              variant="determinate" 
                              value={Math.min((job.applications / 30) * 100, 100)} 
                              sx={{ 
                                width: 50, 
                                height: 6, 
                                borderRadius: 3,
                                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 3,
                                  background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                                },
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton 
                            size="small" 
                            sx={{ 
                              color: '#1976d2',
                              transition: 'all 0.3s ease',
                              '&:hover': { 
                                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            sx={{ 
                              color: '#f59e0b',
                              transition: 'all 0.3s ease',
                              '&:hover': { 
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            sx={{ 
                              color: '#ef4444',
                              transition: 'all 0.3s ease',
                              '&:hover': { 
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </AnimatedTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* HR Team Tab */}
          <TabPanel value={activeTab} index={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                HR Team Members
              </Typography>
              <AnimatedButton 
                variant="contained" 
                startIcon={<People />}
                sx={{ 
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                }}
              >
                Add HR Member
              </AnimatedButton>
            </Box>

            <Grid container spacing={3}>
              {hrUsers.map((user, index) => (
                <Grid item xs={12} md={6} lg={4} key={user.id}>
                  <Card sx={{ 
                    height: '100%',
                    borderRadius: '16px',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `${fadeInUp} 0.5s ease-out`,
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(25, 118, 210, 0.15)',
                    },
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                        <Avatar sx={{ 
                          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
                          mr: 2,
                          width: 48,
                          height: 48,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        }}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            {user.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            {getRoleLabel(user.role)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 1, color: '#475569' }}>
                        {user.email}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                        Department: {user.department}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#475569' }}>
                          Job Postings: <span style={{ fontWeight: 600, color: '#1976d2' }}>{user.jobPostingsCreated}</span>
                        </Typography>
                        <StatusChip 
                          label={getStatusLabel(user.status)} 
                          color={getStatusColor(user.status) as any}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        Last Login: {user.lastLogin}
                      </Typography>
                      
                      <Divider sx={{ my: 2, borderColor: 'rgba(0, 0, 0, 0.06)' }} />
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <AnimatedButton size="small" startIcon={<Edit />} sx={{ color: '#f59e0b' }}>
                          Edit
                        </AnimatedButton>
                        <AnimatedButton size="small" startIcon={<Delete />} sx={{ color: '#ef4444' }}>
                          Remove
                        </AnimatedButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
              Analytics & Reports
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                  animation: `${fadeInUp} 0.5s ease-out`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
                      Job Posting Trends
                    </Typography>
                    <Box sx={{ 
                      height: 200, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.03) 100%)',
                      borderRadius: '12px',
                    }}>
                      <Typography sx={{ color: '#94a3b8' }}>
                        Chart visualization would go here
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                  animation: `${fadeInUp} 0.5s ease-out`,
                  animationDelay: '100ms',
                  animationFillMode: 'both',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
                      Application Sources
                    </Typography>
                    <Box sx={{ 
                      height: 200, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.03) 100%)',
                      borderRadius: '12px',
                    }}>
                      <Typography sx={{ color: '#94a3b8' }}>
                        Pie chart would go here
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* User Management — BDM company registration queue only (profile verification uses role-specific admin dashboards) */}
          <TabPanel value={activeTab} index={1}>
            
            <BDMCompanyRegistrationQueue embedded />
          </TabPanel>

          {/* Email Templates Tab */}
          <TabPanel value={activeTab} index={4}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                Email Templates
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Customize email notifications sent to users
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {/* Template Type Selector */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  {[
                    { key: 'approval', label: 'Approval Email', icon: <CheckCircle />, color: '#10b981' },
                    { key: 'rejection', label: 'Rejection Email', icon: <Cancel />, color: '#ef4444' },
                    { key: 'welcome', label: 'Welcome Email', icon: <Email />, color: '#3b82f6' },
                  ].map((template) => (
                    <Card
                      key={template.key}
                      onClick={() => setSelectedTemplateType(template.key as 'approval' | 'rejection' | 'welcome')}
                      sx={{
                        flex: 1,
                        cursor: 'pointer',
                        borderRadius: '16px',
                        border: selectedTemplateType === template.key 
                          ? `2px solid ${template.color}` 
                          : '2px solid transparent',
                        boxShadow: selectedTemplateType === template.key 
                          ? `0 8px 24px ${template.color}20` 
                          : '0 4px 12px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.3s ease',
                        background: selectedTemplateType === template.key 
                          ? `linear-gradient(135deg, ${template.color}10 0%, ${template.color}05 100%)` 
                          : '#ffffff',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 12px 32px ${template.color}25`,
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 3 }}>
                        <Box sx={{ 
                          color: template.color, 
                          mb: 1,
                          '& svg': { fontSize: 32 },
                        }}>
                          {template.icon}
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          {template.label}
                        </Typography>
                        {selectedTemplateType === template.key && (
                          <Chip 
                            label="Selected" 
                            size="small" 
                            sx={{ 
                              mt: 1, 
                              backgroundColor: template.color, 
                              color: 'white',
                              fontWeight: 600,
                            }} 
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Grid>

              {/* Template Editor */}
              <Grid item xs={12} md={8}>
                <Card sx={{
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                }}>
                  <CardContent sx={{ p: 3 }}>
                    {/* Subject Line */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', mb: 1 }}>
                        Subject Line
                      </Typography>
                      <TextField
                        fullWidth
                        value={emailTemplates[selectedTemplateType].subject}
                        onChange={(e) => setEmailTemplates(prev => ({
                          ...prev,
                          [selectedTemplateType]: {
                            ...prev[selectedTemplateType],
                            subject: e.target.value,
                          },
                        }))}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: '#f8fafc',
                            '&:hover fieldset': { borderColor: '#1976d2' },
                            '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                          },
                        }}
                      />
                    </Box>

                    {/* Email Body */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', mb: 1 }}>
                        Email Body
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={12}
                        value={emailTemplates[selectedTemplateType].body}
                        onChange={(e) => setEmailTemplates(prev => ({
                          ...prev,
                          [selectedTemplateType]: {
                            ...prev[selectedTemplateType],
                            body: e.target.value,
                          },
                        }))}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: '#f8fafc',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            '&:hover fieldset': { borderColor: '#1976d2' },
                            '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                          },
                        }}
                      />
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => setEmailPreviewOpen(true)}
                        startIcon={<Visibility />}
                        sx={{
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 3,
                        }}
                      >
                        Preview Email
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          // Reset to default templates
                          setEmailTemplates({
                            approval: {
                              subject: '🎉 Congratulations {{user_name}}! Your Account is Approved',
                              body: `Dear {{user_name}},\n\nWe're thrilled to inform you that your account has been verified and approved! 🎉\n\nHere are your details:\n• Email: {{email}}\n• User ID: {{vertechie_id}}\n• Account Type: {{user_type}}\n\nYou can now login and access all features:\n{{login_url}}\n\nBest regards,\nThe Vertechie Team`,
                            },
                            rejection: {
                              subject: 'Account Application Update - {{user_name}}',
                              body: `Dear {{user_name}},\n\nThank you for your interest in joining Vertechie.\n\nAfter careful review of your application, we regret to inform you that we are unable to approve your account at this time.\n\nThis could be due to:\n• Incomplete or unclear documentation\n• Information verification issues\n• Not meeting our current requirements\n\nIf you believe this is an error or would like to reapply, please contact our support team.\n\nBest regards,\nThe Vertechie Team`,
                            },
                            welcome: {
                              subject: 'Welcome to Vertechie, {{user_name}}! 🚀',
                              body: `Dear {{user_name}},\n\nWelcome to Vertechie! We're excited to have you on board.\n\nYour account has been created successfully:\n• Email: {{email}}\n• Account Type: {{user_type}}\n\nGet started by completing your profile and exploring our platform.\n\nNeed help? Our support team is always here for you.\n\nBest regards,\nThe Vertechie Team`,
                            },
                          });
                          setSnackbar({
                            open: true,
                            message: 'Templates reset to default',
                            severity: 'info',
                          });
                        }}
                        startIcon={<Refresh />}
                        sx={{
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 3,
                          borderColor: '#94a3b8',
                          color: '#64748b',
                        }}
                      >
                        Reset to Default
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          // Save template (will connect to backend later)
                          setTemplateSaveSuccess(true);
                          setSnackbar({
                            open: true,
                            message: 'Template saved successfully! (Will sync to backend later)',
                            severity: 'success',
                          });
                          setTimeout(() => setTemplateSaveSuccess(false), 2000);
                        }}
                        startIcon={<CheckCircle />}
                        sx={{
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 3,
                          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                          boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                            boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                          },
                        }}
                      >
                        Save Template
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Variables Panel */}
              <Grid item xs={12} md={4}>
                <Card sx={{
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                  position: 'sticky',
                  top: 20,
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
                      Available Variables
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                      Click to copy variable to clipboard
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {[
                        { var: '{{user_name}}', desc: 'Full name of the user' },
                        { var: '{{email}}', desc: 'User email address' },
                        { var: '{{user_type}}', desc: 'Account type (Techie/HR/Company)' },
                        { var: '{{vertechie_id}}', desc: 'Unique Vertechie ID' },
                        { var: '{{login_url}}', desc: 'Login page URL' },
                        { var: '{{date}}', desc: 'Current date' },
                      ].map((item) => (
                        <Box
                          key={item.var}
                          onClick={() => {
                            navigator.clipboard.writeText(item.var);
                            setSnackbar({
                              open: true,
                              message: `Copied ${item.var} to clipboard`,
                              severity: 'info',
                            });
                          }}
                          sx={{
                            p: 1.5,
                            borderRadius: '10px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: '#e0f2fe',
                              borderColor: '#1976d2',
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2', fontFamily: 'monospace' }}>
                            {item.var}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {item.desc}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                      Tips
                    </Typography>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: '10px', 
                      backgroundColor: '#fef3c7',
                      border: '1px solid #fbbf24',
                    }}>
                      <Typography variant="caption" sx={{ color: '#92400e' }}>
                        💡 Variables will be automatically replaced with actual user data when sending emails.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </AnimatedCard>

        {/* Email Preview Dialog */}
        <Dialog
          open={emailPreviewOpen}
          onClose={() => setEmailPreviewOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '20px',
              overflow: 'hidden',
            },
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            py: 2,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                📧 Email Preview
              </Typography>
              <IconButton onClick={() => setEmailPreviewOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {/* Email Header */}
            <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748b', width: 60 }}>From:</Typography>
                <Typography variant="body2" sx={{ color: '#1e293b' }}>noreply@vertechie.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748b', width: 60 }}>To:</Typography>
                <Typography variant="body2" sx={{ color: '#1e293b' }}>john.doe@example.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b', width: 60 }}>Subject:</Typography>
                <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600 }}>
                  {emailTemplates[selectedTemplateType].subject
                    .replace('{{user_name}}', 'John Doe')
                    .replace('{{email}}', 'john.doe@example.com')
                  }
                </Typography>
              </Box>
            </Box>
            
            {/* Email Body */}
            <Box sx={{ p: 4 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                }}
              >
                {/* Logo Area */}
                <Box sx={{ textAlign: 'center', mb: 4, pb: 3, borderBottom: '2px solid #1976d2' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1976d2' }}>
                    VERTECHIE
                  </Typography>
                </Box>
                
                {/* Email Content */}
                <Typography 
                  component="pre" 
                  sx={{ 
                    fontFamily: 'inherit',
                    whiteSpace: 'pre-wrap',
                    color: '#334155',
                    lineHeight: 1.8,
                    fontSize: '0.95rem',
                  }}
                >
                  {emailTemplates[selectedTemplateType].body
                    .replace(/\{\{user_name\}\}/g, 'John Doe')
                    .replace(/\{\{email\}\}/g, 'john.doe@example.com')
                    .replace(/\{\{vertechie_id\}\}/g, 'VT-2024-001234')
                    .replace(/\{\{user_type\}\}/g, 'Techie')
                    .replace(/\{\{login_url\}\}/g, 'https://vertechie.com/login')
                    .replace(/\{\{date\}\}/g, new Date().toLocaleDateString())
                  }
                </Typography>
              </Paper>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, backgroundColor: '#f8fafc' }}>
            <Button 
              onClick={() => setEmailPreviewOpen(false)}
              variant="contained"
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
              }}
            >
              Close Preview
            </Button>
          </DialogActions>
        </Dialog>


        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </PageContainer>
  );
};

export default SuperAdmin;
 