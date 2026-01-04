import React, { useState, useEffect, useCallback } from 'react';
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
  Celebration,
} from '@mui/icons-material';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

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

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
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

const confettiFall = keyframes`
  0% {
    transform: translateY(-100%) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
`;

const scaleIn = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const checkmarkDraw = keyframes`
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

const bounceIn = keyframes`
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  0% {
    transform: translateY(30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
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

interface User {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  date_joined: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string | null;
  username?: string;
  dob?: string | null;
  vertechie_id?: string | null;
  country?: string;
  gov_id?: string | null;
  mobile_number?: string;
  address?: string | null;
  email_verified?: boolean;
  mobile_verified?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  user_type?: string;
}

// Additional interfaces for user type specific details
interface Education {
  id: number;
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  grade?: string;
  description?: string;
  is_verified?: boolean;
}

interface Experience {
  id: number;
  company_name: string;
  job_title: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  is_verified?: boolean;
}

interface HRDetails {
  id: number;
  company_name: string;
  company_email: string;
  company_phone?: string;
  company_address?: string;
  company_website?: string;
  designation?: string;
  department?: string;
  is_verified?: boolean;
}

interface CompanyDetails {
  id: number;
  company_name: string;
  company_email: string;
  company_phone?: string;
  company_address?: string;
  company_website?: string;
  industry?: string;
  company_size?: string;
  description?: string;
  is_verified?: boolean;
}

interface SchoolDetails {
  id: number;
  school_name: string;
  school_email: string;
  school_phone?: string;
  school_address?: string;
  school_website?: string;
  school_type?: string;
  principal_name?: string;
  description?: string;
  is_verified?: boolean;
}

interface UserTypeDetails {
  education: Education[];
  experience: Experience[];
  hrDetails: HRDetails | null;
  companyDetails: CompanyDetails | null;
  schoolDetails: SchoolDetails | null;
}

// Verification Status Badge Component
const VerificationBadge: React.FC<{ isVerified?: boolean }> = ({ isVerified }) => (
  <Chip
    icon={isVerified ? <CheckCircle sx={{ fontSize: 14 }} /> : <Cancel sx={{ fontSize: 14 }} />}
    label={isVerified ? 'Verified' : 'Not Verified'}
    size="small"
    sx={{
      ml: 1,
      fontWeight: 600,
      fontSize: '0.7rem',
      height: '22px',
      backgroundColor: isVerified ? 'rgba(22, 163, 74, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      color: isVerified ? '#16A34A' : '#ef4444',
      border: `1px solid ${isVerified ? 'rgba(22, 163, 74, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
      '& .MuiChip-icon': {
        color: isVerified ? '#16A34A' : '#ef4444',
      },
    }}
  />
);

// Confetti Piece Component
const ConfettiPiece = styled(Box)<{ delay: number; color: string; left: number }>(({ delay, color, left }) => ({
  position: 'absolute',
  width: '10px',
  height: '10px',
  backgroundColor: color,
  left: `${left}%`,
  top: '-20px',
  borderRadius: '2px',
  animation: `${confettiFall} 3s ease-in-out ${delay}s infinite`,
}));

// Animated Checkmark Circle
const CheckmarkCircle = styled(Box)(({ theme }) => ({
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg,rgb(13, 163, 113) 0%,rgb(41, 196, 139) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4)',
  animation: `${scaleIn} 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
}));

// Success Dialog Content Wrapper
const SuccessDialogContent = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
  minHeight: '400px',
}));

// Info Card for success dialog
const InfoCard = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  borderRadius: '12px',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  animation: `${slideUp} 0.5s ease-out 0.3s both`,
}));

// Checklist Item
const ChecklistItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1, 0),
  animation: `${slideUp} 0.4s ease-out both`,
}));

const SuperAdmin: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPendingUser, setIsPendingUser] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Premium Success/Reject Dialog States
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approvedUserInfo, setApprovedUserInfo] = useState<{ name: string; email: string } | null>(null);
  const [rejectedUserInfo, setRejectedUserInfo] = useState<{ name: string; email: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
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
  
  // User Type Specific Details States
  const [userTypeDetails, setUserTypeDetails] = useState<UserTypeDetails>({
    education: [],
    experience: [],
    hrDetails: null,
    companyDetails: null,
    schoolDetails: null,
  });
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<User[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [loadingApproved, setLoadingApproved] = useState(false);
  
  // Filter states for pending users
  const [pendingFilters, setPendingFilters] = useState({
    country: '',
    groups: '',
  });
  
  // Filter states for approved users
  const [approvedFilters, setApprovedFilters] = useState({
    country: '',
    groups: '',
  });

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

  // Function to build query string from filters
  const buildQueryString = (filters: { country?: string; groups?: string }, isPending: boolean) => {
    const params = new URLSearchParams();
    
    // Add status filters
    if (isPending) {
      params.append('is_active', 'true');
      params.append('is_verified', 'false');
    } else {
      params.append('is_active', 'true');
      params.append('is_verified', 'true');
    }
    
    // Add country filter
    if (filters.country) {
      params.append('country', filters.country);
    }
    
    // Add groups filter
    if (filters.groups) {
      params.append('groups__name', filters.groups);
    }
    
    return params.toString();
  };

  // Function to fetch users from API
  const fetchUsers = useCallback(async () => {
    console.log('Fetching all users from API...');
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        setSnackbar({
          open: true,
          message: 'Authentication token not found. Please login again.',
          severity: 'error',
        });
        setLoadingUsers(false);
        return;
      }

      const usersApiUrl = getApiUrl(API_ENDPOINTS.USERS);
      console.log('API URL:', usersApiUrl);
      console.log('Token:', token ? `${token.substring(0, 20)}...` : 'No token');

      const response = await fetch(usersApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const usersData = await response.json();
        console.log('Raw users data received:', usersData);
        
        // Handle paginated response structure: {count, next, previous, results: [...]}
        // Or direct array response
        let usersArray: any[] = [];
        
        if (Array.isArray(usersData)) {
          usersArray = usersData;
        } else if (usersData && usersData.results && Array.isArray(usersData.results)) {
          usersArray = usersData.results;
        } else if (usersData && typeof usersData === 'object') {
          // If it's a single user object, wrap it in an array
          usersArray = [usersData];
        }
        
        console.log('Users array extracted:', usersArray);
        console.log('Number of users:', usersArray.length);
        
        // Transform API data to match User interface
        const transformedUsers: User[] = usersArray.map((user: any) => {
          const transformed = {
            id: String(user.id || user.pk || ''),
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || user.email || 'Unknown',
            email: user.email || '',
            is_active: user.is_active ?? false,
            is_verified: user.is_verified ?? false,
            date_joined: user.date_joined || '',
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            middle_name: user.middle_name || null,
            username: user.username || '',
            dob: user.dob || null,
            vertechie_id: user.vertechie_id || null,
            country: user.country || '',
            gov_id: user.gov_id || null,
            mobile_number: user.mobile_number || '',
            address: user.address || null,
            email_verified: user.email_verified ?? false,
            mobile_verified: user.mobile_verified ?? false,
            is_staff: user.is_staff ?? false,
            is_superuser: user.is_superuser ?? false,
            user_type: user.user_type || 'techie',
          };
          console.log(`User ${transformed.id}: is_active=${transformed.is_active}, is_verified=${transformed.is_verified}`);
          return transformed;
        });

        console.log('Transformed users:', transformedUsers);
        console.log('Total users after transformation:', transformedUsers.length);
        
        setAllUsers(transformedUsers);
        
        // Log filtered counts for debugging
        const pendingCount = transformedUsers.filter(u => u.is_active && !u.is_verified).length;
        const approvedCount = transformedUsers.filter(u => u.is_active && u.is_verified).length;
        console.log(`Pending users count: ${pendingCount}`);
        console.log(`Approved users count: ${approvedCount}`);
        
        if (transformedUsers.length === 0) {
          setSnackbar({
            open: true,
            message: 'No users found in the system.',
            severity: 'warning',
          });
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch users:', response.status, response.statusText, errorText);
        let errorMessage = `Failed to fetch users data: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If errorText is not JSON, use it as is
          if (errorText) {
            errorMessage = errorText;
          }
        }
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({
        open: true,
        message: `Error loading users data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
      });
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Fetch User Type Specific Details
  const fetchUserTypeDetails = useCallback(async (userId: string, userType: string) => {
    setLoadingUserDetails(true);
    setUserTypeDetails({
      education: [],
      experience: [],
      hrDetails: null,
      companyDetails: null,
      schoolDetails: null,
    });

    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const type = userType?.toLowerCase() || 'techie';

      if (type === 'techie') {
        // Fetch education and experience for techies
        const [educationRes, experienceRes] = await Promise.all([
          fetch(getApiUrl(`${API_ENDPOINTS.EDUCATION}?user=${userId}`), { headers }),
          fetch(getApiUrl(`${API_ENDPOINTS.EXPERIENCES}?user=${userId}`), { headers }),
        ]);

        if (educationRes.ok) {
          const eduData = await educationRes.json();
          setUserTypeDetails(prev => ({
            ...prev,
            education: Array.isArray(eduData) ? eduData : eduData.results || [],
          }));
        }

        if (experienceRes.ok) {
          const expData = await experienceRes.json();
          setUserTypeDetails(prev => ({
            ...prev,
            experience: Array.isArray(expData) ? expData : expData.results || [],
          }));
        }
      } else if (type === 'hr') {
        // Fetch HR company details and experience
        const [hrRes, experienceRes] = await Promise.all([
          fetch(getApiUrl(`${API_ENDPOINTS.COMPANY}?user=${userId}`), { headers }),
          fetch(getApiUrl(`${API_ENDPOINTS.EXPERIENCES}?user=${userId}`), { headers }),
        ]);

        if (hrRes.ok) {
          const hrData = await hrRes.json();
          const hrDetails = Array.isArray(hrData) ? hrData[0] : hrData.results?.[0] || hrData;
          setUserTypeDetails(prev => ({
            ...prev,
            hrDetails: hrDetails || null,
          }));
        }

        if (experienceRes.ok) {
          const expData = await experienceRes.json();
          setUserTypeDetails(prev => ({
            ...prev,
            experience: Array.isArray(expData) ? expData : expData.results || [],
          }));
        }
      } else if (type === 'company') {
        // Fetch company details
        const companyRes = await fetch(getApiUrl(`${API_ENDPOINTS.COMPANY_SIGNUP}?user=${userId}`), { headers });

        if (companyRes.ok) {
          const companyData = await companyRes.json();
          const companyDetails = Array.isArray(companyData) ? companyData[0] : companyData.results?.[0] || companyData;
          setUserTypeDetails(prev => ({
            ...prev,
            companyDetails: companyDetails || null,
          }));
        }
      } else if (type === 'school') {
        // Fetch school details
        const schoolRes = await fetch(getApiUrl(`${API_ENDPOINTS.SCHOOL_SIGNUP}?user=${userId}`), { headers });

        if (schoolRes.ok) {
          const schoolData = await schoolRes.json();
          const schoolDetails = Array.isArray(schoolData) ? schoolData[0] : schoolData.results?.[0] || schoolData;
          setUserTypeDetails(prev => ({
            ...prev,
            schoolDetails: schoolDetails || null,
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching user type details:', error);
    } finally {
      setLoadingUserDetails(false);
    }
  }, []);

  // Function to fetch pending users with filters
  const fetchPendingUsers = useCallback(async (filters: { country?: string; groups?: string }) => {
    console.log('Fetching pending users with filters:', filters);
    setLoadingPending(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        setLoadingPending(false);
        return;
      }

      let usersApiUrl = getApiUrl(API_ENDPOINTS.USERS);
      const queryString = buildQueryString(filters, true);
      if (queryString) {
        usersApiUrl = `${usersApiUrl}?${queryString}`;
      }
      
      console.log('Pending users API URL:', usersApiUrl);

      const response = await fetch(usersApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const usersData = await response.json();
        let usersArray: any[] = [];
        
        if (Array.isArray(usersData)) {
          usersArray = usersData;
        } else if (usersData && usersData.results && Array.isArray(usersData.results)) {
          usersArray = usersData.results;
        } else if (usersData && typeof usersData === 'object') {
          usersArray = [usersData];
        }
        
        const transformedUsers: User[] = usersArray.map((user: any) => ({
          id: String(user.id || user.pk || ''),
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || user.email || 'Unknown',
          email: user.email || '',
          is_active: user.is_active ?? false,
          is_verified: user.is_verified ?? false,
          date_joined: user.date_joined || '',
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          middle_name: user.middle_name || null,
          username: user.username || '',
          dob: user.dob || null,
          vertechie_id: user.vertechie_id || null,
          country: user.country || '',
          gov_id: user.gov_id || null,
          mobile_number: user.mobile_number || '',
          address: user.address || null,
          email_verified: user.email_verified ?? false,
          mobile_verified: user.mobile_verified ?? false,
          is_staff: user.is_staff ?? false,
          is_superuser: user.is_superuser ?? false,
          user_type: user.user_type || 'techie',
        }));
        
        setPendingUsers(transformedUsers);
      }
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoadingPending(false);
    }
  }, []);

  // Function to fetch approved users with filters
  const fetchApprovedUsers = useCallback(async (filters: { country?: string; groups?: string }) => {
    console.log('Fetching approved users with filters:', filters);
    setLoadingApproved(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        setLoadingApproved(false);
        return;
      }

      let usersApiUrl = getApiUrl(API_ENDPOINTS.USERS);
      const queryString = buildQueryString(filters, false);
      if (queryString) {
        usersApiUrl = `${usersApiUrl}?${queryString}`;
      }
      
      console.log('Approved users API URL:', usersApiUrl);

      const response = await fetch(usersApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const usersData = await response.json();
        let usersArray: any[] = [];
        
        if (Array.isArray(usersData)) {
          usersArray = usersData;
        } else if (usersData && usersData.results && Array.isArray(usersData.results)) {
          usersArray = usersData.results;
        } else if (usersData && typeof usersData === 'object') {
          usersArray = [usersData];
        }
        
        const transformedUsers: User[] = usersArray.map((user: any) => ({
          id: String(user.id || user.pk || ''),
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || user.email || 'Unknown',
          email: user.email || '',
          is_active: user.is_active ?? false,
          is_verified: user.is_verified ?? false,
          date_joined: user.date_joined || '',
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          middle_name: user.middle_name || null,
          username: user.username || '',
          dob: user.dob || null,
          vertechie_id: user.vertechie_id || null,
          country: user.country || '',
          gov_id: user.gov_id || null,
          mobile_number: user.mobile_number || '',
          address: user.address || null,
          email_verified: user.email_verified ?? false,
          mobile_verified: user.mobile_verified ?? false,
          is_staff: user.is_staff ?? false,
          is_superuser: user.is_superuser ?? false,
          user_type: user.user_type || 'techie',
        }));
        
        // Filter out admin users (is_staff or is_superuser) - show only applicants
        const applicantsOnly = transformedUsers.filter(
          user => !user.is_staff && !user.is_superuser
        );
        
        setApprovedUsers(applicantsOnly);
      }
    } catch (error) {
      console.error('Error fetching approved users:', error);
    } finally {
      setLoadingApproved(false);
    }
  }, []);

  // Fetch users when User Management tab is active
  useEffect(() => {
    if (activeTab === 1) {
      fetchUsers();
      fetchPendingUsers(pendingFilters);
      fetchApprovedUsers(approvedFilters);
    }
  }, [activeTab, fetchUsers, fetchPendingUsers, fetchApprovedUsers]);

  // Fetch filtered users when filters change
  useEffect(() => {
    if (activeTab === 1) {
      fetchPendingUsers(pendingFilters);
    }
  }, [pendingFilters, activeTab, fetchPendingUsers]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchApprovedUsers(approvedFilters);
    }
  }, [approvedFilters, activeTab, fetchApprovedUsers]);

  // Get unique countries and user types from all users for filter options
  const uniqueCountries = Array.from(new Set(allUsers.map(u => u.country).filter(Boolean))).sort();
  const userTypes = ['Techie', 'HR', 'Company', 'School'];

  // Filter change handlers
  const handlePendingFilterChange = (field: 'country' | 'groups', value: string) => {
    setPendingFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApprovedFilterChange = (field: 'country' | 'groups', value: string) => {
    setApprovedFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const handleViewUser = (user: User, isPending: boolean) => {
    setSelectedUser(user);
    setIsPendingUser(isPending);
    setUserDialogOpen(true);
    fetchUserTypeDetails(user.id, user.user_type || 'techie');
  };

  const handleCloseDialog = () => {
    setUserDialogOpen(false);
    setSelectedUser(null);
  };

  const handleAcceptUser = async () => {
    if (selectedUser) {
      setActionLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setSnackbar({
            open: true,
            message: 'Authentication token not found',
            severity: 'error',
          });
          setActionLoading(false);
          return;
        }

        const userApiUrl = getApiUrl(`${API_ENDPOINTS.USERS}${selectedUser.id}/`);
        const response = await fetch(userApiUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            is_verified: true,
            is_active: true, // Ensure user remains active when approved
          }),
        });

        if (response.ok) {
          // Store user info for success dialog
          setApprovedUserInfo({
            name: selectedUser.name,
            email: selectedUser.email,
          });
          handleCloseDialog();
          // Show premium success dialog
          setSuccessDialogOpen(true);
          // Refresh users list
          fetchUsers();
          fetchPendingUsers(pendingFilters);
          fetchApprovedUsers(approvedFilters);
        } else {
          const errorData = await response.json();
          setSnackbar({
            open: true,
            message: `Failed to approve user: ${errorData.message || response.statusText}`,
            severity: 'error',
          });
        }
      } catch (error) {
        console.error('Error accepting user:', error);
        setSnackbar({
          open: true,
          message: `Error approving user: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error',
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleRejectUser = async () => {
    if (selectedUser) {
      setActionLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setSnackbar({
            open: true,
            message: 'Authentication token not found',
            severity: 'error',
          });
          setActionLoading(false);
          return;
        }

        const userApiUrl = getApiUrl(`${API_ENDPOINTS.USERS}${selectedUser.id}/`);
        const response = await fetch(userApiUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            is_active: false,
            is_verified: false,
          }),
        });

        if (response.ok) {
          // Store user info for reject dialog
          setRejectedUserInfo({
            name: selectedUser.name,
            email: selectedUser.email,
          });
          handleCloseDialog();
          // Show rejection dialog
          setRejectDialogOpen(true);
          // Refresh users list
          fetchUsers();
          fetchPendingUsers(pendingFilters);
          fetchApprovedUsers(approvedFilters);
        } else {
          const errorData = await response.json();
          setSnackbar({
            open: true,
            message: `Failed to reject user: ${errorData.message || response.statusText}`,
            severity: 'error',
          });
        }
      } catch (error) {
        console.error('Error rejecting user:', error);
        setSnackbar({
          open: true,
          message: `Error rejecting user: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error',
        });
      } finally {
        setActionLoading(false);
      }
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
              <AnimatedTab label="User Management" />
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

          {/* User Management Tab */}
          <TabPanel value={activeTab} index={1}>
           
            <Grid container spacing={3}>
              {/* Pending Status Column */}
              <Grid item xs={12} md={6}>
                <Card sx={{
                  borderRadius: '16px',
                  border: '1px solid rgba(251, 146, 60, 0.2)',
                  boxShadow: '0 4px 24px rgba(251, 146, 60, 0.08)',
                  animation: `${fadeInUp} 0.5s ease-out`,
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(251, 146, 60, 0.15)',
                  },
                }}>
                  <Box sx={{
                    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.08) 0%, rgba(251, 146, 60, 0.02) 100%)',
                    p: 2.5,
                    borderBottom: '1px solid rgba(251, 146, 60, 0.1)',
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: '#FB923C',
                          animation: `${pulse} 2s ease-in-out infinite`,
                        }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.3rem', color: '#ea580c' }}>
                          Pending Users
                        </Typography>
                      </Box>
                      <Box sx={{
                        background: 'linear-gradient(135deg, #FB923C 0%, #f97316 100%)',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 12px rgba(251, 146, 60, 0.3)',
                      }}>
                        {pendingUsers.length}
                      </Box>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 2.5 }}>
                    {/* Filters for Pending Users */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
                      <FormControl size="small" sx={{ 
                        minWidth: 150,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          '&:hover fieldset': { borderColor: '#FB923C' },
                          '&.Mui-focused fieldset': { borderColor: '#FB923C' },
                        },
                      }}>
                        <InputLabel>Country</InputLabel>
                        <Select
                          value={pendingFilters.country}
                          label="Country"
                          onChange={(e) => handlePendingFilterChange('country', e.target.value)}
                        >
                          <MenuItem value="">All Countries</MenuItem>
                          {uniqueCountries.map((country) => (
                            <MenuItem key={country} value={country}>
                              {country}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ 
                        minWidth: 150,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          '&:hover fieldset': { borderColor: '#FB923C' },
                          '&.Mui-focused fieldset': { borderColor: '#FB923C' },
                        },
                      }}>
                        <InputLabel>User Type</InputLabel>
                        <Select
                          value={pendingFilters.groups}
                          label="User Type"
                          onChange={(e) => handlePendingFilterChange('groups', e.target.value)}
                        >
                          <MenuItem value="">All User Types</MenuItem>
                          {userTypes.map((userType) => (
                            <MenuItem key={userType} value={userType.toLowerCase()}>
                              {userType}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    
                    <TableContainer sx={{ 
                      borderRadius: '10px',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                    }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ background: 'linear-gradient(180deg, #fef3e2 0%, #fff7ed 100%)' }}>
                            <TableCell sx={{ fontWeight: 600, color: '#9a3412' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#9a3412' }}>Mail</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#9a3412' }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loadingPending ? (
                            <TableRow>
                              <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                <LinearProgress sx={{ 
                                  mb: 2, 
                                  borderRadius: 2,
                                  '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(90deg, #FB923C, #f97316)',
                                  },
                                }} />
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                  Loading users...
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : pendingUsers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                  No pending users
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            pendingUsers.map((user, index) => (
                              <AnimatedTableRow 
                                key={user.id}
                                sx={{ 
                                  animation: `${fadeIn} 0.3s ease-out`,
                                  animationDelay: `${index * 50}ms`,
                                  animationFillMode: 'both',
                                }}
                              >
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                    {user.name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    {user.email}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleViewUser(user, true)}
                                      sx={{
                                        color: '#FB923C',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                          backgroundColor: 'rgba(251, 146, 60, 0.1)',
                                          transform: 'scale(1.1)',
                                        },
                                      }}
                                    >
                                      <Visibility fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </TableCell>
                              </AnimatedTableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Approved Status Column */}
              <Grid item xs={12} md={6}>
                <Card sx={{
                  borderRadius: '16px',
                  border: '1px solid rgba(22, 163, 74, 0.2)',
                  boxShadow: '0 4px 24px rgba(22, 163, 74, 0.08)',
                  animation: `${fadeInUp} 0.5s ease-out`,
                  animationDelay: '100ms',
                  animationFillMode: 'both',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(22, 163, 74, 0.15)',
                  },
                }}>
                  <Box sx={{
                    background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.08) 0%, rgba(22, 163, 74, 0.02) 100%)',
                    p: 2.5,
                    borderBottom: '1px solid rgba(22, 163, 74, 0.1)',
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: '#16A34A',
                        }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.3rem', color: '#15803d' }}>
                          Approved Users
                        </Typography>
                      </Box>
                      <Box sx={{
                        background: 'linear-gradient(135deg, #16A34A 0%, #22c55e 100%)',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                      }}>
                        {approvedUsers.length}
                      </Box>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 2.5 }}>
                    {/* Filters for Approved Users */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
                      <FormControl size="small" sx={{ 
                        minWidth: 150,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          '&:hover fieldset': { borderColor: '#16A34A' },
                          '&.Mui-focused fieldset': { borderColor: '#16A34A' },
                        },
                      }}>
                        <InputLabel>Country</InputLabel>
                        <Select
                          value={approvedFilters.country}
                          label="Country"
                          onChange={(e) => handleApprovedFilterChange('country', e.target.value)}
                        >
                          <MenuItem value="">All Countries</MenuItem>
                          {uniqueCountries.map((country) => (
                            <MenuItem key={country} value={country}>
                              {country}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ 
                        minWidth: 150,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          '&:hover fieldset': { borderColor: '#16A34A' },
                          '&.Mui-focused fieldset': { borderColor: '#16A34A' },
                        },
                      }}>
                        <InputLabel>User Type</InputLabel>
                        <Select
                          value={approvedFilters.groups}
                          label="User Type"
                          onChange={(e) => handleApprovedFilterChange('groups', e.target.value)}
                        >
                          <MenuItem value="">All User Types</MenuItem>
                          {userTypes.map((userType) => (
                            <MenuItem key={userType} value={userType.toLowerCase()}>
                              {userType}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    
                    <TableContainer sx={{ 
                      borderRadius: '10px',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                    }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ background: 'linear-gradient(180deg, #dcfce7 0%, #f0fdf4 100%)' }}>
                            <TableCell sx={{ fontWeight: 600, color: '#166534' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#166534' }}>Mail</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#166534' }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loadingApproved ? (
                            <TableRow>
                              <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                <LinearProgress sx={{ 
                                  mb: 2, 
                                  borderRadius: 2,
                                  '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(90deg, #16A34A, #22c55e)',
                                  },
                                }} />
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                  Loading users...
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : approvedUsers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                  No approved users
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            approvedUsers.map((user, index) => (
                              <AnimatedTableRow 
                                key={user.id}
                                sx={{ 
                                  animation: `${fadeIn} 0.3s ease-out`,
                                  animationDelay: `${index * 50}ms`,
                                  animationFillMode: 'both',
                                }}
                              >
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                    {user.name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    {user.email}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleViewUser(user, false)}
                                      sx={{
                                        color: '#16A34A',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                          backgroundColor: 'rgba(22, 163, 74, 0.1)',
                                          transform: 'scale(1.1)',
                                        },
                                      }}
                                    >
                                      <Visibility fontSize="small" />
                                    </IconButton>
                                    <IconButton 
                                      size="small" 
                                      onClick={() => {
                                        // Handle delete action
                                        setSnackbar({ 
                                          open: true, 
                                          message: `${user.name} removed`, 
                                          severity: 'error' 
                                        });
                                      }}
                                      sx={{
                                        color: '#ef4444',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                          transform: 'scale(1.1)',
                                        },
                                      }}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </TableCell>
                              </AnimatedTableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
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

        {/* User Details Dialog */}
        <Dialog 
          open={userDialogOpen} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
              animation: `${fadeInUp} 0.3s ease-out`,
            },
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            py: 2.5,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                User Details
              </Typography>
              <IconButton
                aria-label="close"
                onClick={handleCloseDialog}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Box sx={{ mt: 2 }}>
                {/* Basic Information Section */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Full Name</Typography>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                      {selectedUser.first_name || ''} {selectedUser.middle_name || ''} {selectedUser.last_name || ''} {!selectedUser.first_name && selectedUser.name}
                    </Typography>
                  </Grid>                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedUser.email}
                      </Typography>
                      {selectedUser.email_verified && (
                        <CheckCircle 
                          sx={{ 
                            color: '#2e7d32', 
                            fontSize: 20,
                            fontWeight: 'bold',
                          }} 
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Mobile Number</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {selectedUser.mobile_number || 'N/A'}
                      </Typography>
                      {selectedUser.mobile_verified && (
                        <CheckCircle 
                          sx={{ 
                            color: '#2e7d32', 
                            fontSize: 20,
                            fontWeight: 'bold',
                          }} 
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">User Type</Typography>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500, textTransform: 'capitalize' }}>
                      {selectedUser.user_type || 'Techie'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                      {selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Country</Typography>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                      {selectedUser.country || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Government ID</Typography>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                      {selectedUser.gov_id || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Vertechie ID</Typography>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                      {selectedUser.vertechie_id || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Address</Typography>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                      {selectedUser.address || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Registered Date</Typography>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                      {new Date(selectedUser.date_joined).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={selectedUser.is_verified ? 'Verified' : 'Pending'} 
                        color={selectedUser.is_verified ? 'success' : 'warning'} 
                        size="small"
                        sx={{ mr: 1 }}
                      />                    
                    </Box>
                  </Grid>
                </Grid>

                {/* Loading indicator for user type details */}
                {loadingUserDetails && (
                  <Box sx={{ mt: 3 }}>
                    <LinearProgress sx={{ borderRadius: 1 }} />
                  </Box>
                )}

                {/* Techie: Education Section */}
                {selectedUser.user_type?.toLowerCase() === 'techie' && !loadingUserDetails && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <School sx={{ color: '#6366f1' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Education
                      </Typography>
                      {userTypeDetails.education.length > 0 && (
                        <VerificationBadge isVerified={userTypeDetails.education.every(edu => edu.is_verified)} />
                      )}
                    </Box>
                    {userTypeDetails.education.length > 0 ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {userTypeDetails.education.map((edu, index) => (
                          <Paper key={edu.id || index} elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{edu.degree} in {edu.field_of_study}</Typography>
                            <Typography variant="body2" color="text.secondary">{edu.institution_name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {edu.start_date} - {edu.end_date || 'Present'}
                              {edu.grade && ` • Grade: ${edu.grade}`}
                            </Typography>
                            {edu.description && (
                              <Typography variant="body2" sx={{ mt: 1 }}>{edu.description}</Typography>
                            )}
                          </Paper>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No education details available
                      </Typography>
                    )}

                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Engineering sx={{ color: '#10b981' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Work Experience
                      </Typography>
                      {userTypeDetails.experience.length > 0 && (
                        <VerificationBadge isVerified={userTypeDetails.experience.every(exp => exp.is_verified)} />
                      )}
                    </Box>
                    {userTypeDetails.experience.length > 0 ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {userTypeDetails.experience.map((exp, index) => (
                          <Paper key={exp.id || index} elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{exp.job_title}</Typography>
                            <Typography variant="body2" color="text.secondary">{exp.company_name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                              {exp.location && ` • ${exp.location}`}
                            </Typography>
                            {exp.description && (
                              <Typography variant="body2" sx={{ mt: 1 }}>{exp.description}</Typography>
                            )}
                          </Paper>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No work experience available
                      </Typography>
                    )}
                  </>
                )}

                {/* HR: Company Details and Experience */}
                {selectedUser.user_type?.toLowerCase() === 'hr' && !loadingUserDetails && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Business sx={{ color: '#8b5cf6' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Company Details
                      </Typography>
                      {userTypeDetails.hrDetails && (
                        <VerificationBadge isVerified={userTypeDetails.hrDetails.is_verified} />
                      )}
                    </Box>
                    {userTypeDetails.hrDetails ? (
                      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Company Name</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.hrDetails.company_name || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Company Email</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.hrDetails.company_email || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Company Phone</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.hrDetails.company_phone || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Designation</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.hrDetails.designation || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Department</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.hrDetails.department || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Website</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.hrDetails.company_website || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">Company Address</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.hrDetails.company_address || 'N/A'}</Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No company details available
                      </Typography>
                    )}

                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Engineering sx={{ color: '#10b981' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Work Experience
                      </Typography>
                      {userTypeDetails.experience.length > 0 && (
                        <VerificationBadge isVerified={userTypeDetails.experience.every(exp => exp.is_verified)} />
                      )}
                    </Box>
                    {userTypeDetails.experience.length > 0 ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {userTypeDetails.experience.map((exp, index) => (
                          <Paper key={exp.id || index} elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{exp.job_title}</Typography>
                            <Typography variant="body2" color="text.secondary">{exp.company_name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                              {exp.location && ` • ${exp.location}`}
                            </Typography>
                            {exp.description && (
                              <Typography variant="body2" sx={{ mt: 1 }}>{exp.description}</Typography>
                            )}
                          </Paper>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No work experience available
                      </Typography>
                    )}
                  </>
                )}

                {/* Company: Company Details */}
                {selectedUser.user_type?.toLowerCase() === 'company' && !loadingUserDetails && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Business sx={{ color: '#10b981' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Company Details
                      </Typography>
                      {userTypeDetails.companyDetails && (
                        <VerificationBadge isVerified={userTypeDetails.companyDetails.is_verified} />
                      )}
                    </Box>
                    {userTypeDetails.companyDetails ? (
                      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Company Name</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.companyDetails.company_name || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Company Email</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.companyDetails.company_email || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Company Phone</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.companyDetails.company_phone || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Industry</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.companyDetails.industry || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Company Size</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.companyDetails.company_size || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Website</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.companyDetails.company_website || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">Company Address</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.companyDetails.company_address || 'N/A'}</Typography>
                          </Grid>
                          {userTypeDetails.companyDetails.description && (
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">Description</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.companyDetails.description}</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Paper>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No company details available
                      </Typography>
                    )}
                  </>
                )}

                {/* School: School Details */}
                {selectedUser.user_type?.toLowerCase() === 'school' && !loadingUserDetails && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <School sx={{ color: '#f59e0b' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        School Details
                      </Typography>
                      {userTypeDetails.schoolDetails && (
                        <VerificationBadge isVerified={userTypeDetails.schoolDetails.is_verified} />
                      )}
                    </Box>
                    {userTypeDetails.schoolDetails ? (
                      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">School Name</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.schoolDetails.school_name || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">School Email</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.schoolDetails.school_email || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">School Phone</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.schoolDetails.school_phone || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">School Type</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.schoolDetails.school_type || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Principal Name</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.schoolDetails.principal_name || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Website</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.schoolDetails.school_website || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">School Address</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.schoolDetails.school_address || 'N/A'}</Typography>
                          </Grid>
                          {userTypeDetails.schoolDetails.description && (
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">Description</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>{userTypeDetails.schoolDetails.description}</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Paper>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No school details available
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            {isPendingUser ? (
              <>
                <Button 
                  onClick={handleRejectUser} 
                  variant="contained" 
                  color="error"
                  startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <Cancel />}
                  disabled={actionLoading}
                  sx={{
                    borderRadius: '10px',
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                    },
                  }}
                >
                  {actionLoading ? 'Processing...' : 'Reject'}
                </Button>
                <Button 
                  onClick={handleAcceptUser} 
                  variant="contained" 
                  color="success"
                  startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <CheckCircle />}
                  disabled={actionLoading}
                  sx={{
                    borderRadius: '10px',
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    },
                  }}
                >
                  {actionLoading ? 'Approving...' : 'Accept'}
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleRejectUser} 
                variant="contained" 
                color="error"
                startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <Cancel />}
                disabled={actionLoading}
                sx={{
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                  },
                }}
              >
                {actionLoading ? 'Processing...' : 'Reject'}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Premium Success Dialog */}
        <Dialog
          open={successDialogOpen}
          onClose={() => setSuccessDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 32px 64px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <SuccessDialogContent>
            {/* Confetti Animation */}
            {[...Array(20)].map((_, i) => (
              <ConfettiPiece
                key={i}
                delay={i * 0.1}
                color={['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#fbbf24', '#f59e0b', '#3b82f6', '#8b5cf6'][i % 8]}
                left={Math.random() * 100}
              />
            ))}
            
            {/* Animated Checkmark */}
            <Box sx={{ mb: 3, animation: `${bounceIn} 0.8s ease-out` }}>
              <CheckmarkCircle>
                <CheckCircle sx={{ fontSize: 60, color: 'white' }} />
              </CheckmarkCircle>
            </Box>
            
            {/* Success Title */}
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800, 
                color: '#1e293b', 
                mb: 1,
                animation: `${slideUp} 0.5s ease-out 0.2s both`,
              }}
            >
              Approved! 🎉
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#10b981', 
                fontWeight: 600,
                animation: `${slideUp} 0.5s ease-out 0.3s both`,
              }}
            >
              {approvedUserInfo?.name}
            </Typography>
            
            {/* Email Notification Info */}
            <InfoCard>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Email sx={{ color: 'white', fontSize: 22 }} />
                </Box>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                    Approval email sent to
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {approvedUserInfo?.email}
                  </Typography>
                </Box>
              </Box>
            </InfoCard>
            
            {/* Checklist */}
            <Box sx={{ mt: 3, textAlign: 'left', px: 2 }}>
              <ChecklistItem sx={{ animationDelay: '0.4s' }}>
                <CheckCircle sx={{ color: '#10b981', fontSize: 22 }} />
                <Typography variant="body2" sx={{ color: '#475569' }}>Account verified successfully</Typography>
              </ChecklistItem>
              
              <ChecklistItem sx={{ animationDelay: '0.6s' }}>
                <CheckCircle sx={{ color: '#10b981', fontSize: 22 }} />
                <Typography variant="body2" sx={{ color: '#475569' }}>Welcome email notification sent</Typography>
              </ChecklistItem>
            </Box>
            
            {/* Action Button */}
            <Button
              variant="contained"
              onClick={() => setSuccessDialogOpen(false)}
              sx={{
                mt: 4,
                px: 5,
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                animation: `${slideUp} 0.5s ease-out 0.7s both`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 32px rgba(16, 185, 129, 0.5)',
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                },
              }}
            >
              Continue
            </Button>
          </SuccessDialogContent>
        </Dialog>

        {/* Premium Rejection Dialog */}
        <Dialog
          open={rejectDialogOpen}
          onClose={() => setRejectDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 32px 64px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <Box sx={{
            textAlign: 'center',
            padding: 4,
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #ffffff 0%, #fef2f2 100%)',
            minHeight: '350px',
          }}>
            {/* Animated X Icon */}
            <Box sx={{ mb: 3, animation: `${bounceIn} 0.8s ease-out` }}>
              <Box sx={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 20px 60px rgba(239, 68, 68, 0.4)',
              }}>
                <Cancel sx={{ fontSize: 60, color: 'white' }} />
              </Box>
            </Box>
            
            {/* Rejection Title */}
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800, 
                color: '#1e293b', 
                mb: 1,
                animation: `${slideUp} 0.5s ease-out 0.2s both`,
              }}
            >
              User Rejected
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#ef4444', 
                fontWeight: 600,
                animation: `${slideUp} 0.5s ease-out 0.3s both`,
              }}
            >
              {rejectedUserInfo?.name}
            </Typography>
            
            {/* Email Notification Info */}
            <Box sx={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              padding: 2,
              marginTop: 2,
              animation: `${slideUp} 0.5s ease-out 0.4s both`,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Email sx={{ color: 'white', fontSize: 22 }} />
                </Box>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                    Rejection notification sent to
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {rejectedUserInfo?.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Action Button */}
            <Button
              variant="contained"
              onClick={() => setRejectDialogOpen(false)}
              sx={{
                mt: 4,
                px: 5,
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
                boxShadow: '0 8px 24px rgba(100, 116, 139, 0.4)',
                animation: `${slideUp} 0.5s ease-out 0.5s both`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 32px rgba(100, 116, 139, 0.5)',
                  background: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
                },
              }}
            >
              Close
            </Button>
          </Box>
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
