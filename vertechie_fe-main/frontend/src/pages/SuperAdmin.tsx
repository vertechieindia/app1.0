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
  InputAdornment,
  Tooltip,
  Collapse,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  AdminPanelSettings,
  PersonAdd,
  People,
  Visibility,
  VisibilityOff,
  Edit,
  Block,
  CheckCircle,
  Cancel,
  Refresh,
  Search,
  Close,
  LockReset,
  ExpandMore,
  ExpandLess,
  SupervisorAccount,
  Groups,
  Business,
  School,
  Engineering,
  Security,
  Add,
  Delete,
  VpnKey,
  Settings,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../config/api';
import AdminCreateUserWizard from '../components/admin/AdminCreateUserWizard';

// Route to tab mapping
const ROUTE_TAB_MAP: Record<string, number> = {
  '/super-admin': 0,
  '/super-admin/admins': 0,
  '/super-admin/roles': 1,
  '/super-admin/users': 2,
  '/super-admin/blocked': 3,
  '/super-admin/approvals': 4,
};

const TAB_ROUTE_MAP: Record<number, string> = {
  0: '/super-admin/admins',
  1: '/super-admin/roles',
  2: '/super-admin/users',
  3: '/super-admin/blocked',
  4: '/super-admin/approvals',
};

// Keyframe Animations
const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const rotateReverse = keyframes`
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
`;


const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Animated dots keyframes
const dotPulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.5); }
`;

const dotWave = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const dotFloat = keyframes`
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(5px, -5px); }
  50% { transform: translate(0, -10px); }
  75% { transform: translate(-5px, -5px); }
`;

// Styled Components - Animated Dots Background (White with Black Dots)
const AnimatedDotsContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 0,
  pointerEvents: 'none',
  background: `
    linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)
  `,
  borderRadius: '16px',
});

const DotGrid = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: `
    radial-gradient(circle at center, rgba(0, 0, 0, 0.12) 1.5px, transparent 1.5px)
  `,
  backgroundSize: '28px 28px',
  animation: `${pulse} 4s ease-in-out infinite`,
});

const AnimatedDot = styled(Box)<{ 
  top: string; 
  left: string; 
  delay: number; 
  size: number;
  animationType: 'pulse' | 'wave' | 'float';
}>(({ top, left, delay, size, animationType }) => ({
  position: 'absolute',
  top,
  left,
  width: size,
  height: size,
  borderRadius: '50%',
  background: 'rgba(0, 0, 0, 0.5)',
  boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
  animation: `${
    animationType === 'pulse' ? dotPulse : 
    animationType === 'wave' ? dotWave : dotFloat
  } ${3 + delay}s ease-in-out infinite`,
  animationDelay: `${delay * 0.5}s`,
}));

const GlowingDot = styled(Box)<{ top: string; left: string; color: string; delay: number }>(
  ({ top, left, color, delay }) => ({
    position: 'absolute',
    top,
    left,
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 12px ${color}, 0 0 24px ${color}`,
    animation: `${dotPulse} ${4 + delay}s ease-in-out infinite`,
    animationDelay: `${delay * 0.7}s`,
  })
);

const MovingDotsLayer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '200%',
  height: '200%',
  backgroundImage: `
    radial-gradient(circle at center, rgba(0, 0, 0, 0.15) 1.5px, transparent 1.5px),
    radial-gradient(circle at center, rgba(30, 30, 30, 0.1) 1px, transparent 1px)
  `,
  backgroundSize: '50px 50px, 35px 35px',
  backgroundPosition: '0 0, 18px 18px',
  animation: `${rotate} 120s linear infinite`,
});

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100%',
  background: 'transparent',
  padding: theme.spacing(1),
  position: 'relative',
  overflow: 'visible',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2),
  },
}));


const ContentWrapper = styled(Box)({
  position: 'relative',
  zIndex: 1,
});

const StatCard = styled(Card)<{ gradient?: string; delay?: number }>(({ theme, gradient, delay = 0 }) => ({
  padding: theme.spacing(2.5),
  borderRadius: '20px',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  background: gradient || 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  animation: `${slideInUp} 0.6s ease-out forwards`,
  animationDelay: `${delay}ms`,
  opacity: 0,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '200%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
    '&::before': {
      left: '100%',
    },
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: '16px',
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  animation: `${fadeIn} 0.8s ease-out`,
  '& .MuiTableHead-root': {
    '& .MuiTableCell-head': {
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      fontWeight: 700,
      color: '#1e293b',
      borderBottom: '2px solid #e2e8f0',
      fontSize: { xs: '0.75rem', md: '0.875rem' },
      padding: { xs: theme.spacing(1.5), md: theme.spacing(2) },
    },
  },
  '& .MuiTableRow-root': {
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(99, 102, 241, 0.04)',
      transform: 'scale(1.005)',
    },
  },
  '& .MuiTableCell-root': {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      fontSize: '0.75rem',
    },
  },
}));

const RoleCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(226, 232, 240, 0.6)',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  animation: `${slideInUp} 0.6s ease-out forwards`,
  '&:hover': {
    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)',
    borderColor: '#6366f1',
    transform: 'translateY(-5px)',
  },
}));

const GlassCard = styled(Card)(({ theme }) => ({
  borderRadius: '24px',
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  animation: `${slideInUp} 0.8s ease-out`,
  [theme.breakpoints.down('sm')]: {
    borderRadius: '16px',
  },
}));


const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(90deg, rgb(70, 73, 198), rgb(183, 55, 119))',
  backgroundSize: '200% 200%',
  animation: `${gradientShift} 5s ease infinite`,
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(70, 73, 198, 0.3)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(183, 55, 119, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '8px 16px',
    fontSize: '0.8rem',
  },
}));

const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.1)',
    },
    '&.Mui-focused': {
      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)',
    },
  },
}));

const AnimatedChip = styled(Chip)(({ theme }) => ({
  transition: 'all 0.3s ease',
  fontWeight: 600,
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

interface Admin {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login?: string;
  admin_roles?: string[];
  name?: string;
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
}

interface UserTypeDetails {
  education: Education[];
  experience: Experience[];
  hrDetails: HRDetails | null;
  companyDetails: CompanyDetails | null;
  schoolDetails: SchoolDetails | null;
}

interface Permission {
  id: number;
  name: string;
  codename: string;
  content_type: number;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

const SuperAdmin: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  // Tab state - derived from route
  const getTabFromRoute = () => ROUTE_TAB_MAP[location.pathname] ?? 0;
  const [activeTab, setActiveTab] = useState(getTabFromRoute);

  // Sync tab with route changes
  React.useEffect(() => {
    const newTab = getTabFromRoute();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.pathname]);

  // Handle tab change - update route
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    const newRoute = TAB_ROUTE_MAP[newValue];
    if (newRoute && location.pathname !== newRoute) {
      navigate(newRoute);
    }
  };

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });

  // Admin Management States
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [createAdminDialog, setCreateAdminDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    admin_roles: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  // User Management States
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [viewUserDialog, setViewUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [deleteAdminDialog, setDeleteAdminDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState(false);
  
  // Blocked Profiles States
  const [blockedProfiles, setBlockedProfiles] = useState<any[]>([]);
  const [loadingBlocked, setLoadingBlocked] = useState(false);
  const [selectedBlockedUser, setSelectedBlockedUser] = useState<any>(null);
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
  const [unblockReason, setUnblockReason] = useState('');
  
  // Pending Approvals States
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loadingApprovals, setLoadingApprovals] = useState(false);
  const [approvalTypeFilter, setApprovalTypeFilter] = useState('');
  const [approvalStats, setApprovalStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  // Review Profile Dialog States
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewingProfile, setReviewingProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  // Edit Admin Roles States
  const [editRolesDialogOpen, setEditRolesDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [editingAdminRoles, setEditingAdminRoles] = useState<string[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  
  // Create User Dialog State
  const [createUserDialog, setCreateUserDialog] = useState(false);
  
  // User Type Specific Details States
  const [userTypeDetails, setUserTypeDetails] = useState<UserTypeDetails>({
    education: [],
    experience: [],
    hrDetails: null,
    companyDetails: null,
    schoolDetails: null,
  });
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  // Role Management States
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [createRoleDialog, setCreateRoleDialog] = useState(false);
  const [editRoleDialog, setEditRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleForm, setRoleForm] = useState({
    name: '',
    selectedPermissions: [] as number[],
  });
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [expandedRoleId, setExpandedRoleId] = useState<number | null>(null);
  const [permissionSearchQuery, setPermissionSearchQuery] = useState('');

  // Fetch Admins
  const fetchAdmins = useCallback(async () => {
    setLoadingAdmins(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setSnackbar({ open: true, message: 'Authentication required', severity: 'error' });
        return;
      }

      const response = await fetch(getApiUrl(API_ENDPOINTS.USERS), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const usersArray = Array.isArray(data) ? data : data.results || [];
        
        const adminUsers = usersArray
          .filter((user: any) => user.is_staff || (user.admin_roles && user.admin_roles.length > 0))
          .map((user: any) => ({
            id: String(user.id),
            email: user.email,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            is_active: user.is_active,
            is_staff: user.is_staff,
            date_joined: user.date_joined,
            last_login: user.last_login,
            admin_roles: user.admin_roles || [],
          }));
        
        setAdmins(adminUsers);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      setSnackbar({ open: true, message: 'Failed to fetch admins', severity: 'error' });
    } finally {
      setLoadingAdmins(false);
    }
  }, []);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(getApiUrl(API_ENDPOINTS.USERS), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const usersArray = Array.isArray(data) ? data : data.results || [];
        
        const applicants = usersArray
          .filter((user: any) => !user.is_staff && !user.is_superuser)
          .map((user: any) => ({
            id: String(user.id),
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || user.email,
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
            user_type: user.groups?.[0]?.name || 'Techie',
          }));
        
        setUsers(applicants);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Fetch Blocked Profiles
  const fetchBlockedProfiles = useCallback(async () => {
    setLoadingBlocked(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(getApiUrl(API_ENDPOINTS.BLOCKED_PROFILES), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBlockedProfiles(Array.isArray(data) ? data : data.results || []);
      }
    } catch (error) {
      console.error('Error fetching blocked profiles:', error);
    } finally {
      setLoadingBlocked(false);
    }
  }, []);

  // Fetch Pending Approvals
  const fetchPendingApprovals = useCallback(async () => {
    setLoadingApprovals(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const url = approvalTypeFilter 
        ? `${getApiUrl(API_ENDPOINTS.PENDING_APPROVALS)}?status=pending&user_type=${approvalTypeFilter}`
        : `${getApiUrl(API_ENDPOINTS.PENDING_APPROVALS)}?status=pending`;

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPendingApprovals(Array.isArray(data) ? data : data.results || []);
      }

      // Fetch stats
      const statsResponse = await fetch(`${getApiUrl(API_ENDPOINTS.PENDING_APPROVALS)}stats/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setApprovalStats(stats);
      }
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    } finally {
      setLoadingApprovals(false);
    }
  }, [approvalTypeFilter]);

  // Handle Unblock User
  const handleUnblockUser = async () => {
    if (!selectedBlockedUser || unblockReason.length < 10) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${getApiUrl(API_ENDPOINTS.BLOCKED_PROFILES)}${selectedBlockedUser.id}/unblock/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: unblockReason }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'User unblocked successfully', severity: 'success' });
        setUnblockDialogOpen(false);
        setUnblockReason('');
        setSelectedBlockedUser(null);
        fetchBlockedProfiles();
      } else {
        const error = await response.json();
        setSnackbar({ open: true, message: error.error || 'Failed to unblock user', severity: 'error' });
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      setSnackbar({ open: true, message: 'Error unblocking user', severity: 'error' });
    }
  };

  // Fetch Full Profile for Review
  const fetchFullProfile = async (userId: string) => {
    setLoadingProfile(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${getApiUrl(API_ENDPOINTS.USERS)}${userId}/full-profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReviewingProfile(data);
        setReviewDialogOpen(true);
      } else {
        setSnackbar({ open: true, message: 'Failed to load profile', severity: 'error' });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setSnackbar({ open: true, message: 'Error loading profile', severity: 'error' });
    } finally {
      setLoadingProfile(false);
    }
  };

  // Handle Approve User
  const handleApproveUser = async (approvalId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${getApiUrl(API_ENDPOINTS.PENDING_APPROVALS)}${approvalId}/approve/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: 'Approved by admin' }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'User approved successfully', severity: 'success' });
        fetchPendingApprovals();
      } else {
        const error = await response.json();
        setSnackbar({ open: true, message: error.error || 'Failed to approve user', severity: 'error' });
      }
    } catch (error) {
      console.error('Error approving user:', error);
      setSnackbar({ open: true, message: 'Error approving user', severity: 'error' });
    }
  };

  // Handle Reject User
  const handleRejectUser = async () => {
    if (!selectedApproval || rejectReason.length < 10) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${getApiUrl(API_ENDPOINTS.PENDING_APPROVALS)}${selectedApproval.id}/reject/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rejection_reason: rejectReason }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'User registration rejected', severity: 'success' });
        setRejectDialogOpen(false);
        setRejectReason('');
        setSelectedApproval(null);
        fetchPendingApprovals();
      } else {
        const error = await response.json();
        setSnackbar({ open: true, message: error.error || 'Failed to reject user', severity: 'error' });
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      setSnackbar({ open: true, message: 'Error rejecting user', severity: 'error' });
    }
  };

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

  // Fetch Roles (Groups)
  const fetchRoles = useCallback(async () => {
    setLoadingRoles(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(getApiUrl(API_ENDPOINTS.GROUPS), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const rolesArray = Array.isArray(data) ? data : data.results || [];
        setRoles(rolesArray);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setSnackbar({ open: true, message: 'Failed to fetch roles', severity: 'error' });
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  // Fetch Permissions - Handle Pagination to get ALL permissions
  const fetchPermissions = useCallback(async () => {
    setLoadingPermissions(true);  
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      let allPermissions: Permission[] = [];
      let nextUrl: string | null = getApiUrl(API_ENDPOINTS.PERMISSIONS);

      // Loop through all pages to fetch all permissions
      while (nextUrl !== null) {
        const currentUrl = nextUrl;
        const res: Response = await fetch(currentUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data: any = await res.json();
          
          if (Array.isArray(data)) {
            // Non-paginated response
            allPermissions = data as Permission[];
            nextUrl = null;
          } else if (data.results) {
            // Paginated response
            allPermissions = [...allPermissions, ...(data.results as Permission[])];
            nextUrl = data.next as string | null;
          } else {
            nextUrl = null;
          }
        } else {
          nextUrl = null;
        }
      }

      setPermissions(allPermissions);
      console.log(`Fetched ${allPermissions.length} total permissions`);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoadingPermissions(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
    fetchUsers();
    fetchRoles();
    fetchPermissions();
    fetchBlockedProfiles();
    fetchPendingApprovals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch pending approvals when filter changes
  useEffect(() => {
    if (activeTab === 4) {
      fetchPendingApprovals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvalTypeFilter]);

  // Create Admin
  const handleCreateAdmin = async () => {
    if (!adminForm.email || !adminForm.password || adminForm.admin_roles.length === 0) {
      setSnackbar({ open: true, message: 'Email, password, and at least one admin role are required', severity: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(API_ENDPOINTS.CREATE_ADMIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: adminForm.first_name,
          last_name: adminForm.last_name,
          email: adminForm.email,
          password: adminForm.password,
          admin_roles: adminForm.admin_roles,
          role: 'admin',
        }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Admin created successfully', severity: 'success' });
        setCreateAdminDialog(false);
        setAdminForm({ email: '', password: '', confirmPassword: '', first_name: '', last_name: '', admin_roles: [] });
        fetchAdmins();
      } else {
        const data = await response.json();
        setSnackbar({ open: true, message: data.detail || 'Failed to create admin', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error creating admin', severity: 'error' });
    }
  };

  // Update Admin Roles
  const handleUpdateAdminRoles = async () => {
    if (!editingAdmin) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(`${API_ENDPOINTS.USERS}${editingAdmin.id}/update-admin-roles/`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          admin_roles: editingAdminRoles,
        }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Admin roles updated successfully', severity: 'success' });
        setEditRolesDialogOpen(false);
        setEditingAdmin(null);
        setEditingAdminRoles([]);
        fetchAdmins();
      } else {
        const error = await response.json();
        setSnackbar({ open: true, message: error.error || 'Failed to update roles', severity: 'error' });
      }
    } catch (error) {
      console.error('Error updating admin roles:', error);
      setSnackbar({ open: true, message: 'Error updating admin roles', severity: 'error' });
    }
  };

  // Toggle Admin Status
  const handleToggleAdminStatus = async (admin: Admin) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(`${API_ENDPOINTS.USERS}${admin.id}/`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_active: !admin.is_active,
        }),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: `Admin ${admin.is_active ? 'deactivated' : 'activated'} successfully`,
          severity: 'success',
        });
        fetchAdmins();
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error updating admin status', severity: 'error' });
    }
  };

  // Delete User completely
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    const userName = userToDelete.name;
    setDeletingUser(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(`${API_ENDPOINTS.USERS}${userToDelete.id}/`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok || response.status === 204) {
        // Close dialog and clear state first
        setDeleteUserDialog(false);
        setUserToDelete(null);
        setDeletingUser(false);
        
        // Show success message
        setSnackbar({
          open: true,
          message: `User "${userName}" has been permanently deleted`,
          severity: 'success',
        });
        
        // Remove user from local state immediately to prevent blank screen
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
        
        // Then refresh from server
        setTimeout(() => {
          fetchUsers();
        }, 500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to delete user');
      }
    } catch (error: any) {
      setDeletingUser(false);
      setSnackbar({ 
        open: true, 
        message: error.message || 'Error deleting user', 
        severity: 'error' 
      });
    }
  };

  // Delete Admin completely
  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    
    const adminName = `${adminToDelete.first_name} ${adminToDelete.last_name}`;
    const adminId = adminToDelete.id;
    setDeletingAdmin(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(`${API_ENDPOINTS.USERS}${adminId}/`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok || response.status === 204) {
        // Close dialog and clear state first
        setDeleteAdminDialog(false);
        setAdminToDelete(null);
        setDeletingAdmin(false);
        
        // Show success message
        setSnackbar({
          open: true,
          message: `Admin "${adminName}" has been permanently deleted`,
          severity: 'success',
        });
        
        // Remove admin from local state immediately to prevent blank screen
        setAdmins(prevAdmins => prevAdmins.filter(a => a.id !== adminId));
        
        // Then refresh from server
        setTimeout(() => {
          fetchAdmins();
        }, 500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to delete admin');
      }
    } catch (error: any) {
      setDeletingAdmin(false);
      setSnackbar({ 
        open: true, 
        message: error.message || 'Error deleting admin', 
        severity: 'error' 
      });
    }
  };

  // Create Role
  const handleCreateRole = async () => {
    if (!roleForm.name) {
      setSnackbar({ open: true, message: 'Role name is required', severity: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(API_ENDPOINTS.GROUPS), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: roleForm.name,
          permission_ids: roleForm.selectedPermissions,
        }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Role created successfully', severity: 'success' });
        setCreateRoleDialog(false);
        setRoleForm({ name: '', selectedPermissions: [] });
        fetchRoles();
      } else {
        const data = await response.json();
        setSnackbar({ open: true, message: data.detail || data.name?.[0] || 'Failed to create role', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error creating role', severity: 'error' });
    }
  };

  // Update Role
  const handleUpdateRole = async () => {
    if (!selectedRole || !roleForm.name) {
      setSnackbar({ open: true, message: 'Role name is required', severity: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(`${API_ENDPOINTS.GROUPS}${selectedRole.id}/`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: roleForm.name,
          permission_ids: roleForm.selectedPermissions,
        }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Role updated successfully', severity: 'success' });
        setEditRoleDialog(false);
        setSelectedRole(null);
        setRoleForm({ name: '', selectedPermissions: [] });
        fetchRoles();
      } else {
        const data = await response.json();
        setSnackbar({ open: true, message: data.detail || 'Failed to update role', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error updating role', severity: 'error' });
    }
  };

  // Delete Role
  const handleDeleteRole = async (roleId: number) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(`${API_ENDPOINTS.GROUPS}${roleId}/`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Role deleted successfully', severity: 'success' });
        fetchRoles();
      } else {
        setSnackbar({ open: true, message: 'Failed to delete role', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error deleting role', severity: 'error' });
    }
  };

  // Open Edit Role Dialog
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setRoleForm({
      name: role.name,
      selectedPermissions: role.permissions.map(p => p.id),
    });
    setEditRoleDialog(true);
  };

  // Toggle Permission Selection
  const handleTogglePermission = (permissionId: number) => {
    setRoleForm(prev => ({
      ...prev,
      selectedPermissions: prev.selectedPermissions.includes(permissionId)
        ? prev.selectedPermissions.filter(id => id !== permissionId)
        : [...prev.selectedPermissions, permissionId],
    }));
  };

  // Group permissions by model name (user, education, experience, etc.)
  const groupedPermissions = permissions.reduce((acc, perm) => {
    // Extract model name from codename like "view_user" -> "user"
    const parts = perm.codename.split('_');
    const model = parts.length > 1 ? parts.slice(1).join('_') : 'other';
    const modelName = model.charAt(0).toUpperCase() + model.slice(1).replace(/_/g, ' ');
    
    if (!acc[modelName]) acc[modelName] = [];
    acc[modelName].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Filter permissions based on search
  const filteredGroupedPermissions = Object.entries(groupedPermissions)
    .reduce((acc, [group, perms]) => {
      const filtered = perms.filter(p => 
        p.name.toLowerCase().includes(permissionSearchQuery.toLowerCase()) ||
        p.codename.toLowerCase().includes(permissionSearchQuery.toLowerCase()) ||
        group.toLowerCase().includes(permissionSearchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[group] = filtered;
      }
      return acc;
    }, {} as Record<string, Permission[]>);

  // Select all permissions in a group
  const handleSelectAllInGroup = (groupPerms: Permission[]) => {
    const groupIds = groupPerms.map(p => p.id);
    setRoleForm(prev => ({
      ...prev,
      selectedPermissions: [...new Set([...prev.selectedPermissions, ...groupIds])],
    }));
  };

  // Deselect all permissions in a group
  const handleDeselectAllInGroup = (groupPerms: Permission[]) => {
    const groupIds = groupPerms.map(p => p.id);
    setRoleForm(prev => ({
      ...prev,
      selectedPermissions: prev.selectedPermissions.filter(id => !groupIds.includes(id)),
    }));
  };

  // Check if all permissions in a group are selected
  const isGroupFullySelected = (groupPerms: Permission[]) => {
    return groupPerms.every(p => roleForm.selectedPermissions.includes(p.id));
  };

  // Check if some permissions in a group are selected
  const isGroupPartiallySelected = (groupPerms: Permission[]) => {
    const selectedCount = groupPerms.filter(p => roleForm.selectedPermissions.includes(p.id)).length;
    return selectedCount > 0 && selectedCount < groupPerms.length;
  };

  // Permission templates
  const applyPermissionTemplate = (template: 'viewOnly' | 'fullAccess' | 'clear') => {
    if (template === 'viewOnly') {
      const viewPerms = permissions.filter(p => p.codename.startsWith('view_')).map(p => p.id);
      setRoleForm(prev => ({ ...prev, selectedPermissions: viewPerms }));
    } else if (template === 'fullAccess') {
      setRoleForm(prev => ({ ...prev, selectedPermissions: permissions.map(p => p.id) }));
    } else {
      setRoleForm(prev => ({ ...prev, selectedPermissions: [] }));
    }
  };

  // Filter admins
  const filteredAdmins = admins.filter(admin => 
    admin.email.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    admin.first_name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    admin.last_name.toLowerCase().includes(adminSearchQuery.toLowerCase())
  );

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    
    const matchesType = !userTypeFilter || user.user_type?.toLowerCase() === userTypeFilter.toLowerCase();
    
    const matchesStatus = !userStatusFilter || 
      (userStatusFilter === 'verified' && user.is_verified) ||
      (userStatusFilter === 'pending' && user.is_active && !user.is_verified) ||
      (userStatusFilter === 'rejected' && !user.is_active && !user.is_verified);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Filter roles
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(roleSearchQuery.toLowerCase())
  );

  // Stats
  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(a => a.is_active).length;
  const totalUsers = users.length;
  const pendingUsers = users.filter(u => u.is_active && !u.is_verified).length;
  const totalRoles = roles.length;

  const getUserTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'techie': return <Engineering sx={{ color: '#3b82f6' }} />;
      case 'hr': return <SupervisorAccount sx={{ color: '#8b5cf6' }} />;
      case 'company': return <Business sx={{ color: '#10b981' }} />;
      case 'school': return <School sx={{ color: '#f59e0b' }} />;
      default: return <People sx={{ color: '#6b7280' }} />;
    }
  };

  const getStatusChip = (user: User) => {
    if (user.is_verified) {
      return <Chip label="Verified" size="small" sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600 }} />;
    } else if (user.is_active && !user.is_verified) {
      return <Chip label="Pending" size="small" sx={{ bgcolor: '#fef3c7', color: '#d97706', fontWeight: 600 }} />;
    } else {
      return <Chip label="Rejected" size="small" sx={{ bgcolor: '#fee2e2', color: '#dc2626', fontWeight: 600 }} />;
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'hr': return { bg: '#f3e8ff', color: '#7c3aed', icon: <SupervisorAccount /> };
      case 'techie': return { bg: '#dbeafe', color: '#2563eb', icon: <Engineering /> };
      case 'company': return { bg: '#dcfce7', color: '#16a34a', icon: <Business /> };
      case 'school': return { bg: '#fef3c7', color: '#d97706', icon: <School /> };
      default: return { bg: '#f1f5f9', color: '#475569', icon: <Security /> };
    }
  };

  return (
    <PageContainer>
      {/* Animated Black Dotted Background */}
      <AnimatedDotsContainer>
        {/* Base dot grid pattern */}
        <DotGrid />
        
        {/* Moving dots layer with rotation */}
        <MovingDotsLayer />
        
        {/* Individual animated dots scattered across the screen */}
        <AnimatedDot top="10%" left="15%" delay={0} size={4} animationType="pulse" />
        <AnimatedDot top="20%" left="45%" delay={1} size={3} animationType="wave" />
        <AnimatedDot top="15%" left="75%" delay={2} size={5} animationType="float" />
        <AnimatedDot top="35%" left="25%" delay={0.5} size={3} animationType="pulse" />
        <AnimatedDot top="45%" left="55%" delay={1.5} size={4} animationType="wave" />
        <AnimatedDot top="30%" left="85%" delay={2.5} size={3} animationType="float" />
        <AnimatedDot top="55%" left="10%" delay={0.8} size={5} animationType="pulse" />
        <AnimatedDot top="65%" left="40%" delay={1.8} size={3} animationType="wave" />
        <AnimatedDot top="50%" left="70%" delay={2.8} size={4} animationType="float" />
        <AnimatedDot top="75%" left="20%" delay={0.3} size={3} animationType="pulse" />
        <AnimatedDot top="85%" left="50%" delay={1.3} size={5} animationType="wave" />
        <AnimatedDot top="70%" left="80%" delay={2.3} size={3} animationType="float" />
        <AnimatedDot top="90%" left="30%" delay={0.6} size={4} animationType="pulse" />
        <AnimatedDot top="80%" left="65%" delay={1.6} size={3} animationType="wave" />
        <AnimatedDot top="95%" left="90%" delay={2.6} size={5} animationType="float" />
        
        {/* Glowing colored dots for accent - darker shades for white bg */}
        <GlowingDot top="8%" left="20%" color="rgba(79, 70, 229, 0.7)" delay={0} />
        <GlowingDot top="25%" left="80%" color="rgba(219, 39, 119, 0.7)" delay={1} />
        <GlowingDot top="45%" left="5%" color="rgba(5, 150, 105, 0.7)" delay={2} />
        <GlowingDot top="60%" left="90%" color="rgba(217, 119, 6, 0.7)" delay={0.5} />
        <GlowingDot top="80%" left="15%" color="rgba(109, 40, 217, 0.7)" delay={1.5} />
        <GlowingDot top="35%" left="50%" color="rgba(37, 99, 235, 0.7)" delay={2.5} />
        <GlowingDot top="70%" left="60%" color="rgba(0, 0, 0, 0.6)" delay={0.8} />
        <GlowingDot top="15%" left="35%" color="rgba(0, 0, 0, 0.5)" delay={1.8} />
        <GlowingDot top="92%" left="70%" color="rgba(30, 30, 30, 0.6)" delay={2.8} />
        <GlowingDot top="55%" left="25%" color="rgba(0, 0, 0, 0.5)" delay={0.3} />
      </AnimatedDotsContainer>

      <ContentWrapper>
        <Container maxWidth="xl">
          
          {/* Stats Cards */}
          <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ mb: { xs: 2, md: 3 }, mt: { xs: 1, md: 2 } }}>
            <Grid item xs={6} sm={6} md={2.4}>
              <StatCard delay={0}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
                  <AnimatedAvatar 
                    sx={{ 
                      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', 
                      width: { xs: 40, md: 50 }, 
                      height: { xs: 40, md: 50 },
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                    }}
                  >
                    <SupervisorAccount sx={{ color: '#3b82f6', fontSize: { xs: 20, md: 24 } }} />
                  </AnimatedAvatar>
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 800, 
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.25rem', md: '1.5rem' }
                      }}
                    >
                      {totalAdmins}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', md: '0.875rem' },
  color: 'grey.700',      // normal grey
  fontWeight: 600   }}>
                      Total Admins
                    </Typography>
                  </Box>
                </Box>
              </StatCard>
            </Grid>

            <Grid item xs={6} sm={6} md={2.4}>
              <StatCard delay={100}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
                  <AnimatedAvatar 
                    sx={{ 
                      background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', 
                      width: { xs: 40, md: 50 }, 
                      height: { xs: 40, md: 50 },
                      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)'
                    }}
                  >
                    <CheckCircle sx={{ color: '#16a34a', fontSize: { xs: 20, md: 24 } }} />
                  </AnimatedAvatar>
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 800, 
                        background: 'linear-gradient(135deg, #16a34a, #10b981)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.25rem', md: '1.5rem' }
                      }}
                    >
                      {activeAdmins}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', md: '0.875rem' },
  color: 'grey.700',      // normal grey
  fontWeight: 600   }}>
                      Active Admins
                    </Typography>
                  </Box>
                </Box>
              </StatCard>
            </Grid>

            <Grid item xs={6} sm={6} md={2.4}>
              <StatCard delay={200}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
                  <AnimatedAvatar 
                    sx={{ 
                      background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', 
                      width: { xs: 40, md: 50 }, 
                      height: { xs: 40, md: 50 },
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
                    }}
                  >
                    <Groups sx={{ color: '#8b5cf6', fontSize: { xs: 20, md: 24 } }} />
                  </AnimatedAvatar>
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 800, 
                        background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.25rem', md: '1.5rem' }
                      }}
                    >
                      {totalUsers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', md: '0.875rem' },
  color: 'grey.700',      // normal grey
  fontWeight: 600   }}>
                      Total Users
                    </Typography>
                  </Box>
                </Box>
              </StatCard>
            </Grid>

            <Grid item xs={6} sm={6} md={2.4}>
              <StatCard delay={300}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
                  <AnimatedAvatar 
                    sx={{ 
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
                      width: { xs: 40, md: 50 }, 
                      height: { xs: 40, md: 50 },
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                    }}
                  >
                    <People sx={{ color: '#d97706', fontSize: { xs: 20, md: 24 } }} />
                  </AnimatedAvatar>
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 800, 
                        background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.25rem', md: '1.5rem' }
                      }}
                    >
                      {pendingUsers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', md: '0.875rem' },
  color: 'grey.700',      // normal grey
  fontWeight: 600   }}>
                      Pending
                    </Typography>
                  </Box>
                </Box>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={12} md={2.4}>
              <StatCard delay={400}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 }, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <AnimatedAvatar 
                    sx={{ 
                      background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', 
                      width: { xs: 40, md: 50 }, 
                      height: { xs: 40, md: 50 },
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
                    }}
                  >
                    <Security sx={{ color: '#dc2626', fontSize: { xs: 20, md: 24 } }} />
                  </AnimatedAvatar>
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 800, 
                        background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.25rem', md: '1.5rem' }
                      }}
                    >
                      {totalRoles}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', md: '0.875rem' },
  color: 'grey.700',      // normal grey
  fontWeight: 600   }}>
                      Roles
                    </Typography>
                  </Box>
                </Box>
              </StatCard>
            </Grid>
          </Grid>

          {/* Tabs */}
          <GlassCard>
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'rgba(226, 232, 240, 0.5)', 
              background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.9) 100%)'
            }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant={isMobile ? 'scrollable' : 'standard'}
                scrollButtons="auto"
                TabIndicatorProps={{
                  sx: {
                    background: 'linear-gradient(90deg,rgb(70, 73, 198),rgb(183, 55, 119))',
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  }
                }}
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: { xs: '0.75rem', md: '0.95rem' },
                    py: { xs: 1.5, md: 2 },
                    px: { xs: 1, md: 2 },
                    minWidth: { xs: 90, md: 160 },
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(99, 102, 241, 0.05)',
                    },
                    '&.Mui-selected': {
                      color: '#6366f1',
                    },
                  },
                }}
              >
                <Tab 
                  icon={<SupervisorAccount sx={{ fontSize: { xs: 18, md: 22 } }} />} 
                  iconPosition="start" 
                  label={isMobile ? "Admins" : "Admin Workspace"} 
                />
                <Tab 
                  icon={<Security sx={{ fontSize: { xs: 18, md: 22 } }} />} 
                  iconPosition="start" 
                  label={isMobile ? "Roles" : "Access Roles"} 
                />
                <Tab 
                  icon={<Groups sx={{ fontSize: { xs: 18, md: 22 } }} />} 
                  iconPosition="start" 
                  label={isMobile ? "Users" : "User Directory"} 
                />
                <Tab 
                  icon={<Block sx={{ fontSize: { xs: 18, md: 22 }, color: '#dc2626' }} />} 
                  iconPosition="start" 
                  label={isMobile ? "Blocked" : "Blocked Profiles"} 
                />
                <Tab 
                  icon={<CheckCircle sx={{ fontSize: { xs: 18, md: 22 }, color: '#059669' }} />} 
                  iconPosition="start" 
                  label={isMobile ? "Approvals" : "Pending Approvals"} 
                />
              </Tabs>
            </Box>

          {/* Admin Management Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: { xs: 2, md: 3 }, animation: `${fadeIn} 0.5s ease-out` }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2, 
                mb: 3,
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
              }}>
                <SearchField
                  placeholder="Search admins..."
                  size="small"
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  sx={{ 
                    width: { xs: '100%', sm: 300 },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                 
                  <AnimatedButton
                    startIcon={<PersonAdd />}
                    onClick={() => setCreateAdminDialog(true)}
                    variant="contained"
                  >
                    {isMobile ? 'Add' : 'Create Admin'}
                  </AnimatedButton>
                </Box>
              </Box>

              {loadingAdmins ? (
                <Box sx={{ 
                  py: 6, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  animation: `${fadeIn} 0.5s ease-out`,
                }}>
                  <Box sx={{ width: '60%', maxWidth: 300 }}>
                    <LinearProgress 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                          borderRadius: 3,
                        }
                      }} 
                    />
                  </Box>
                  <Typography align="center" sx={{ mt: 2, fontWeight: 500 }} color="text.secondary">
                    Loading admins...
                  </Typography>
                </Box>
              ) : (
                <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <StyledTableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Admin</TableCell>
                          {!isMobile && <TableCell>Email</TableCell>}
                          {!isMobile && <TableCell>Roles</TableCell>}
                          <TableCell>Status</TableCell>
                          {!isMobile && <TableCell>Joined</TableCell>}
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredAdmins.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                              <Box sx={{ animation: `${fadeIn} 0.5s ease-out` }}>
                                <AnimatedAvatar sx={{ 
                                  width: 80, 
                                  height: 80, 
                                  mx: 'auto', 
                                  mb: 2,
                                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))'
                                }}>
                                  <SupervisorAccount sx={{ fontSize: 40, color: '#94a3b8' }} />
                                </AnimatedAvatar>
                                <Typography color="text.secondary" sx={{ fontWeight: 500 }}>No admins found</Typography>
                                <Typography variant="caption" color="text.secondary">Try adjusting your search</Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAdmins.map((admin, index) => (
                            <TableRow 
                              key={admin.id}
                              sx={{ 
                                animation: `${slideInUp} 0.4s ease-out forwards`,
                                animationDelay: `${index * 50}ms`,
                                opacity: 0,
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Avatar sx={{ bgcolor: '#3b82f6', width: 36, height: 36 }}>
                                    {admin.first_name?.[0] || admin.email[0].toUpperCase()}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {admin.first_name} {admin.last_name}
                                    </Typography>
                                    {isMobile && (
                                      <Typography variant="caption" color="text.secondary">
                                        {admin.email}
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              </TableCell>
                              {!isMobile && <TableCell>{admin.email}</TableCell>}
                              {!isMobile && (
                                <TableCell>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {admin.admin_roles && admin.admin_roles.length > 0 ? (
                                      admin.admin_roles.map((role) => (
                                        <Chip
                                          key={role}
                                          label={role.replace('_admin', '').replace('_', ' ')}
                                          size="small"
                                          sx={{ 
                                            fontSize: '0.7rem',
                                            textTransform: 'capitalize',
                                            bgcolor: role === 'superadmin' ? '#ede9fe' : 
                                                     role === 'bdm_admin' ? '#fae8ff' :
                                                     role === 'company_admin' ? '#d1fae5' :
                                                     role === 'hm_admin' ? '#e0f2fe' :
                                                     role === 'techie_admin' ? '#fef3c7' : '#fee2e2',
                                            color: role === 'superadmin' ? '#7c3aed' : 
                                                   role === 'bdm_admin' ? '#c026d3' :
                                                   role === 'company_admin' ? '#059669' :
                                                   role === 'hm_admin' ? '#0284c7' :
                                                   role === 'techie_admin' ? '#d97706' : '#dc2626',
                                          }}
                                        />
                                      ))
                                    ) : (
                                      <Typography variant="caption" color="text.secondary">No roles</Typography>
                                    )}
                                  </Box>
                                </TableCell>
                              )}
                              <TableCell>
                                <AnimatedChip
                                  label={admin.is_active ? 'Active' : 'Blocked'}
                                  size="small"
                                  sx={{
                                    bgcolor: admin.is_active ? '#dcfce7' : '#fee2e2',
                                    color: admin.is_active ? '#16a34a' : '#dc2626',
                                  }}
                                />
                              </TableCell>
                              {!isMobile && (
                                <TableCell>{new Date(admin.date_joined).toLocaleDateString()}</TableCell>
                              )}
                              <TableCell>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                  <Tooltip title={admin.is_active ? 'Click to Block' : 'Click to Activate'}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleToggleAdminStatus(admin)}
                                      sx={{
                                        color: admin.is_active ? '#16a34a' : '#dc2626',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                          bgcolor: admin.is_active ? '#dcfce7' : '#fee2e2',
                                          transform: 'scale(1.15)',
                                        },
                                      }}
                                    >
                                      {admin.is_active ? <CheckCircle fontSize="small" /> : <Block fontSize="small" />}
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Manage Roles">
                                    <IconButton 
                                      size="small" 
                                      onClick={() => {
                                        setEditingAdmin(admin);
                                        setEditingAdminRoles((admin as any).admin_roles || []);
                                        setEditRolesDialogOpen(true);
                                      }}
                                      sx={{ 
                                        color: '#7c3aed',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                          bgcolor: 'rgba(124, 58, 237, 0.1)',
                                          transform: 'scale(1.15)',
                                        },
                                      }}
                                    >
                                      <Settings fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Reset Password">
                                    <IconButton 
                                      size="small" 
                                      sx={{ 
                                        color: '#6b7280',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                          bgcolor: 'rgba(99, 102, 241, 0.1)',
                                          color: '#6366f1',
                                          transform: 'scale(1.15)',
                                        },
                                      }}
                                    >
                                      <LockReset fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Admin Permanently">
                                    <IconButton 
                                      size="small" 
                                      onClick={() => {
                                        setAdminToDelete(admin);
                                        setDeleteAdminDialog(true);
                                      }}
                                      sx={{ 
                                        color: '#dc2626',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                          bgcolor: 'rgba(220, 38, 38, 0.1)',
                                          transform: 'scale(1.15)',
                                        },
                                      }}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </StyledTableContainer>
                </Paper>
              )}
            </Box>
          )}

          {/* Role Management Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: { xs: 2, md: 3 }, animation: `${fadeIn} 0.5s ease-out` }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2, 
                mb: 3,
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
              }}>
                <SearchField
                  placeholder="Search roles..."
                  size="small"
                  value={roleSearchQuery}
                  onChange={(e) => setRoleSearchQuery(e.target.value)}
                  sx={{ 
                    width: { xs: '100%', sm: 300 },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                 
                  <AnimatedButton
                    startIcon={<Add />}
                    onClick={() => {
                      setRoleForm({ name: '', selectedPermissions: [] });
                      setCreateRoleDialog(true);
                    }}
                    variant="contained"
                    sx={{ color: '#ffffff' }}
                  >
                    {isMobile ? 'Add' : 'Create Role'}
                  </AnimatedButton>
                </Box>
              </Box>

              {loadingRoles ? (
                <Box sx={{ 
                  py: 6, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  animation: `${fadeIn} 0.5s ease-out`,
                }}>
                  <Box sx={{ width: '60%', maxWidth: 300 }}>
                    <LinearProgress 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                          borderRadius: 3,
                        }
                      }} 
                    />
                  </Box>
                  <Typography align="center" sx={{ mt: 2, fontWeight: 500 }} color="text.secondary">
                    Loading roles...
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {filteredRoles.length === 0 ? (
                    <Grid item xs={12}>
                      <Box sx={{ textAlign: 'center', py: 8, animation: `${fadeIn} 0.5s ease-out` }}>
                        <AnimatedAvatar sx={{ 
                          width: 80, 
                          height: 80, 
                          mx: 'auto', 
                          mb: 2,
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))'
                        }}>
                          <Security sx={{ fontSize: 40, color: '#94a3b8' }} />
                        </AnimatedAvatar>
                        <Typography color="text.secondary" sx={{ fontWeight: 500 }}>No roles found</Typography>
                        <Typography variant="caption" color="text.secondary">Create a new role to get started</Typography>
                      </Box>
                    </Grid>
                  ) : (
                    filteredRoles.map((role, index) => {
                      const roleStyle = getRoleColor(role.name);
                      return (
                        <Grid item xs={12} sm={6} lg={4} key={role.id}>
                          <RoleCard sx={{ animationDelay: `${index * 100}ms`, opacity: 0 }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Avatar sx={{ bgcolor: roleStyle.bg, color: roleStyle.color }}>
                                    {roleStyle.icon}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                      {role.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {role.permissions.length} permissions
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  <Tooltip title="Edit Role">
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleEditRole(role)}
                                      sx={{ 
                                        color: '#6366f1',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                          bgcolor: 'rgba(99, 102, 241, 0.1)',
                                          transform: 'scale(1.15) rotate(15deg)',
                                        },
                                      }}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Role">
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleDeleteRole(role.id)}
                                      sx={{ 
                                        color: '#dc2626',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                          bgcolor: '#fee2e2',
                                          transform: 'scale(1.15)',
                                        },
                                      }}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>

                              <Divider sx={{ my: 1.5 }} />

                              <Box 
                                sx={{ 
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                                onClick={() => setExpandedRoleId(expandedRoleId === role.id ? null : role.id)}
                              >
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                                  View Permissions
                                </Typography>
                                {expandedRoleId === role.id ? <ExpandLess /> : <ExpandMore />}
                              </Box>

                              <Collapse in={expandedRoleId === role.id}>
                                <Box sx={{ mt: 1.5, maxHeight: 200, overflow: 'auto' }}>
                                  {role.permissions.length === 0 ? (
                                    <Typography variant="caption" color="text.secondary">
                                      No permissions assigned
                                    </Typography>
                                  ) : (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {role.permissions.map((perm) => (
                                        <Chip
                                          key={perm.id}
                                          label={perm.name}
                                          size="small"
                                          variant="outlined"
                                          sx={{ 
                                            fontSize: '0.7rem',
                                            height: 24,
                                            borderColor: '#e2e8f0',
                                          }}
                                        />
                                      ))}
                                    </Box>
                                  )}
                                </Box>
                              </Collapse>
                            </CardContent>
                          </RoleCard>
                        </Grid>
                      );
                    })
                  )}
                </Grid>
              )}
            </Box>
          )}

          {/* User Management Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: { xs: 2, md: 3 }, animation: `${fadeIn} 0.5s ease-out` }}>
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                mb: 3,
                alignItems: { xs: 'stretch', md: 'center' },
              }}>
                <SearchField
                  placeholder="Search users..."
                  size="small"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  sx={{
                    flex: 1,
                    maxWidth: { md: 300 },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, flexWrap: 'wrap' }}>
                  <FormControl size="small" sx={{ minWidth: { xs: 120, md: 140 } }}>
                    <InputLabel>User Type</InputLabel>
                    <Select
                      value={userTypeFilter}
                      label="User Type"
                      onChange={(e) => setUserTypeFilter(e.target.value)}
                      sx={{ 
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="techie">Techie</MenuItem>
                      <MenuItem value="hr">HR</MenuItem>
                      <MenuItem value="company">Company</MenuItem>
                      <MenuItem value="school">School</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: { xs: 120, md: 140 } }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={userStatusFilter}
                      label="Status"
                      onChange={(e) => setUserStatusFilter(e.target.value)}
                      sx={{ 
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value="verified">Verified</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>

                  <AnimatedButton
                    onClick={() => setCreateUserDialog(true)}
                    sx={{ 
                      color: '#ffffff',
                      minWidth: { xs: 'auto', md: 160 },
                      px: { xs: 2, md: 3 },
                    }}
                  >
                    <PersonAdd sx={{ mr: { xs: 0, md: 1 } }} />
                    {!isMobile && 'Create User'}
                  </AnimatedButton>

                </Box>
              </Box>

              {loadingUsers ? (
                <Box sx={{ 
                  py: 6, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  animation: `${fadeIn} 0.5s ease-out`,
                }}>
                  <Box sx={{ width: '60%', maxWidth: 300 }}>
                    <LinearProgress 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                          borderRadius: 3,
                        }
                      }} 
                    />
                  </Box>
                  <Typography align="center" sx={{ mt: 2, fontWeight: 500 }} color="text.secondary">
                    Loading users...
                  </Typography>
                </Box>
              ) : (
                <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <StyledTableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>User</TableCell>
                          {!isMobile && <TableCell>Type</TableCell>}
                          <TableCell>Status</TableCell>
                          {!isTablet && <TableCell>Country</TableCell>}
                          {!isTablet && <TableCell>Joined</TableCell>}
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                              <Box sx={{ animation: `${fadeIn} 0.5s ease-out` }}>
                                <AnimatedAvatar sx={{ 
                                  width: 80, 
                                  height: 80, 
                                  mx: 'auto', 
                                  mb: 2,
                                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))'
                                }}>
                                  <Groups sx={{ fontSize: 40, color: '#94a3b8' }} />
                                </AnimatedAvatar>
                                <Typography color="text.secondary" sx={{ fontWeight: 500 }}>No users found</Typography>
                                <Typography variant="caption" color="text.secondary">Try adjusting your filters</Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user, index) => (
                            <React.Fragment key={user.id}>
                              <TableRow
                                sx={{ 
                                  cursor: 'pointer',
                                  animation: `${slideInUp} 0.4s ease-out forwards`,
                                  animationDelay: `${index * 50}ms`,
                                  opacity: 0,
                                }}
                                onClick={() => {
                                  if (isMobile) {
                                    setExpandedUserId(expandedUserId === user.id ? null : user.id);
                                  }
                                }}
                              >
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar sx={{ bgcolor: '#e0e7ff', width: 36, height: 36 }}>
                                      {getUserTypeIcon(user.user_type || 'techie')}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {user.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {user.email}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                                {!isMobile && (
                                  <TableCell>
                                    <Chip label={user.user_type || 'Techie'} size="small" sx={{ textTransform: 'capitalize' }} />
                                  </TableCell>
                                )}
                                <TableCell>{getStatusChip(user)}</TableCell>
                                {!isTablet && <TableCell>{user.country || 'N/A'}</TableCell>}
                                {!isTablet && <TableCell>{new Date(user.date_joined).toLocaleDateString()}</TableCell>}
                                <TableCell align="center">
                                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                    <Tooltip title="View Details">
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedUser(user);
                                          setViewUserDialog(true);
                                          fetchUserTypeDetails(user.id, user.user_type || 'techie');
                                        }}
                                        sx={{ 
                                          color: '#6366f1',
                                          transition: 'all 0.3s ease',
                                          '&:hover': { 
                                            bgcolor: 'rgba(99, 102, 241, 0.1)',
                                            transform: 'scale(1.2)',
                                          },
                                        }}
                                      >
                                        <Visibility fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete User Permanently">
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setUserToDelete(user);
                                          setDeleteUserDialog(true);
                                        }}
                                        sx={{ 
                                          color: '#dc2626',
                                          transition: 'all 0.3s ease',
                                          '&:hover': { 
                                            bgcolor: 'rgba(220, 38, 38, 0.1)',
                                            transform: 'scale(1.2)',
                                          },
                                        }}
                                      >
                                        <Delete fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </TableRow>
                              {isMobile && (
                                <TableRow>
                                  <TableCell colSpan={6} sx={{ py: 0, border: 0 }}>
                                    <Collapse in={expandedUserId === user.id}>
                                      <Box sx={{ py: 2, pl: 6 }}>
                                        <Grid container spacing={1}>
                                          <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">Type</Typography>
                                            <Typography variant="body2">{user.user_type || 'Techie'}</Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">Country</Typography>
                                            <Typography variant="body2">{user.country || 'N/A'}</Typography>
                                          </Grid>
                                        </Grid>
                                      </Box>
                                    </Collapse>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </StyledTableContainer>
                </Paper>
              )}
            </Box>
          )}

          {/* Blocked Profiles Tab */}
          {activeTab === 3 && (
            <Box sx={{ p: { xs: 2, md: 3 }, animation: `${fadeIn} 0.5s ease-out` }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'stretch', sm: 'center' }, 
                gap: 2, 
                mb: 3 
              }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Block sx={{ color: '#dc2626' }} />
                    Blocked Profiles
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage blocked users and view blocking history
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchBlockedProfiles}
                  sx={{ borderRadius: '12px' }}
                >
                  Refresh
                </Button>
              </Box>

              {loadingBlocked ? (
                <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <LinearProgress sx={{ width: '60%', maxWidth: 300, height: 6, borderRadius: 3 }} />
                  <Typography align="center" sx={{ mt: 2 }} color="text.secondary">
                    Loading blocked profiles...
                  </Typography>
                </Box>
              ) : blockedProfiles.length === 0 ? (
                <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#f0fdf4' }}>
                    <CheckCircle sx={{ fontSize: 40, color: '#22c55e' }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>No Blocked Profiles</Typography>
                  <Typography variant="body2" color="text.secondary">
                    There are currently no blocked users in the system.
                  </Typography>
                </Paper>
              ) : (
                <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <StyledTableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>User</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Blocked Date</TableCell>
                          <TableCell>Reason</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {blockedProfiles.map((profile: any) => (
                          <TableRow key={profile.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ bgcolor: '#fee2e2', width: 40, height: 40 }}>
                                  <Block sx={{ color: '#dc2626' }} />
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {profile.full_name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {profile.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip label={profile.user_type} size="small" />
                            </TableCell>
                            <TableCell>
                              {profile.blocked_at ? new Date(profile.blocked_at).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Tooltip title={profile.blocked_reason || 'No reason provided'}>
                                <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {profile.blocked_reason || 'No reason provided'}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircle />}
                                onClick={() => {
                                  setSelectedBlockedUser(profile);
                                  setUnblockDialogOpen(true);
                                }}
                                sx={{ borderRadius: '8px', textTransform: 'none' }}
                              >
                                Unblock
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </StyledTableContainer>
                </Paper>
              )}
            </Box>
          )}

          {/* Pending Approvals Tab */}
          {activeTab === 4 && (
            <Box sx={{ p: { xs: 2, md: 3 }, animation: `${fadeIn} 0.5s ease-out` }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'stretch', sm: 'center' }, 
                gap: 2, 
                mb: 3 
              }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: '#059669' }} />
                    Pending Approvals
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Review and approve pending user registrations
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>User Type</InputLabel>
                    <Select
                      value={approvalTypeFilter}
                      label="User Type"
                      onChange={(e) => setApprovalTypeFilter(e.target.value)}
                      sx={{ borderRadius: '12px' }}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="techie">Techie</MenuItem>
                      <MenuItem value="hr">Hiring Manager</MenuItem>
                      <MenuItem value="company">Company</MenuItem>
                      <MenuItem value="school">School</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchPendingApprovals}
                    sx={{ borderRadius: '12px' }}
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>

              {/* Approval Stats */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                  <Card sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>{approvalStats.pending}</Typography>
                    <Typography variant="body2" color="text.secondary">Pending</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#22c55e' }}>{approvalStats.approved}</Typography>
                    <Typography variant="body2" color="text.secondary">Approved</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626' }}>{approvalStats.rejected}</Typography>
                    <Typography variant="body2" color="text.secondary">Rejected</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#6366f1' }}>{approvalStats.total}</Typography>
                    <Typography variant="body2" color="text.secondary">Total</Typography>
                  </Card>
                </Grid>
              </Grid>

              {loadingApprovals ? (
                <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <LinearProgress sx={{ width: '60%', maxWidth: 300, height: 6, borderRadius: 3 }} />
                  <Typography align="center" sx={{ mt: 2 }} color="text.secondary">
                    Loading pending approvals...
                  </Typography>
                </Box>
              ) : pendingApprovals.length === 0 ? (
                <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#f0fdf4' }}>
                    <CheckCircle sx={{ fontSize: 40, color: '#22c55e' }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>No Pending Approvals</Typography>
                  <Typography variant="body2" color="text.secondary">
                    All user registrations have been reviewed.
                  </Typography>
                </Paper>
              ) : (
                <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <StyledTableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>User</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Submitted</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pendingApprovals.map((approval: any) => (
                          <TableRow key={approval.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ bgcolor: '#e0e7ff', width: 40, height: 40 }}>
                                  {approval.user_type === 'techie' && <Engineering sx={{ color: '#6366f1' }} />}
                                  {approval.user_type === 'hr' && <SupervisorAccount sx={{ color: '#6366f1' }} />}
                                  {approval.user_type === 'company' && <Business sx={{ color: '#6366f1' }} />}
                                  {approval.user_type === 'school' && <School sx={{ color: '#6366f1' }} />}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {approval.user_full_name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {approval.user_email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip label={approval.user_type} size="small" sx={{ textTransform: 'capitalize' }} />
                            </TableCell>
                            <TableCell>
                              {new Date(approval.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={approval.status} 
                                size="small"
                                color={approval.status === 'pending' ? 'warning' : approval.status === 'approved' ? 'success' : 'error'}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => fetchFullProfile(approval.id)}
                                  disabled={loadingProfile}
                                  sx={{ borderRadius: '8px', textTransform: 'none' }}
                                  startIcon={<Visibility />}
                                >
                                  Review
                                </Button>
                                {approval.status === 'pending' && (
                                  <>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      color="success"
                                      onClick={() => handleApproveUser(approval.id)}
                                      sx={{ borderRadius: '8px', textTransform: 'none' }}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="error"
                                      onClick={() => {
                                        setSelectedApproval(approval);
                                        setRejectDialogOpen(true);
                                      }}
                                      sx={{ borderRadius: '8px', textTransform: 'none' }}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </StyledTableContainer>
                </Paper>
              )}
            </Box>
          )}
        </GlassCard>
        </Container>
      </ContentWrapper>

      {/* Unblock User Dialog */}
      <Dialog open={unblockDialogOpen} onClose={() => setUnblockDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Unblock User
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to unblock <strong>{selectedBlockedUser?.full_name}</strong>?
          </Typography>
          <TextField
            fullWidth
            label="Reason for Unblocking *"
            multiline
            rows={3}
            value={unblockReason}
            onChange={(e) => setUnblockReason(e.target.value)}
            placeholder="Please provide a reason for unblocking this user..."
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setUnblockDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={handleUnblockUser}
            disabled={unblockReason.length < 10}
          >
            Unblock User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject User Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#dc2626' }}>
          Reject User Registration
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to reject <strong>{selectedApproval?.user_full_name}</strong>'s registration?
          </Typography>
          <TextField
            fullWidth
            label="Rejection Reason *"
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleRejectUser}
            disabled={rejectReason.length < 10}
          >
            Reject Registration
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Profile Dialog */}
      <Dialog 
        open={reviewDialogOpen} 
        onClose={() => setReviewDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', maxHeight: '90vh' } }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          background: 'linear-gradient(135deg, #004d40 0%, #00796b 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Visibility />
            Profile Review
          </Box>
          <IconButton onClick={() => setReviewDialogOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {loadingProfile ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 6 }}>
              <CircularProgress />
            </Box>
          ) : reviewingProfile && (
            <Box>
              {/* Personal Information Section */}
              <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', bgcolor: '#f8fafb' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#004d40', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <People fontSize="small" /> Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Full Name</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {reviewingProfile.first_name} {reviewingProfile.middle_name || ''} {reviewingProfile.last_name}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{reviewingProfile.email}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Phone</Typography>
                      <Typography variant="body1">{reviewingProfile.phone || reviewingProfile.mobile_number || 'Not provided'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                      <Typography variant="body1">{reviewingProfile.dob || 'Not provided'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Country</Typography>
                      <Typography variant="body1">{reviewingProfile.country || 'Not provided'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Address</Typography>
                      <Typography variant="body1">{reviewingProfile.address || 'Not provided'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Government ID</Typography>
                      <Typography variant="body1">{reviewingProfile.gov_id || 'Not provided'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">VerTechie ID</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#004d40' }}>{reviewingProfile.vertechie_id}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Verification Status Section */}
              <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#004d40', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security fontSize="small" /> Verification Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label={reviewingProfile.email_verified ? 'Email Verified' : 'Email Not Verified'}
                    color={reviewingProfile.email_verified ? 'success' : 'default'}
                    size="small"
                    icon={reviewingProfile.email_verified ? <CheckCircle /> : <Cancel />}
                  />
                  <Chip 
                    label={reviewingProfile.mobile_verified ? 'Mobile Verified' : 'Mobile Not Verified'}
                    color={reviewingProfile.mobile_verified ? 'success' : 'default'}
                    size="small"
                    icon={reviewingProfile.mobile_verified ? <CheckCircle /> : <Cancel />}
                  />
                  <Chip 
                    label={reviewingProfile.face_verification ? 'Face Verified' : 'Face Not Verified'}
                    color={reviewingProfile.face_verification ? 'success' : 'default'}
                    size="small"
                    icon={reviewingProfile.face_verification ? <CheckCircle /> : <Cancel />}
                  />
                  <Chip 
                    label={`Status: ${reviewingProfile.verification_status || 'pending'}`}
                    color={reviewingProfile.verification_status === 'approved' ? 'success' : reviewingProfile.verification_status === 'rejected' ? 'error' : 'warning'}
                    size="small"
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">Registered: {new Date(reviewingProfile.created_at).toLocaleString()}</Typography>
                  {reviewingProfile.reviewed_by && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                      Reviewed by: {reviewingProfile.reviewed_by} on {new Date(reviewingProfile.reviewed_at).toLocaleString()}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Profile Section */}
              {reviewingProfile.profile && (
                <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', bgcolor: '#f8fafb' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#004d40', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Engineering fontSize="small" /> Professional Profile
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Headline</Typography>
                      <Typography variant="body1">{reviewingProfile.profile.headline || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Bio</Typography>
                      <Typography variant="body2">{reviewingProfile.profile.bio || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">Current Position</Typography>
                      <Typography variant="body1">{reviewingProfile.profile.current_position || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">Current Company</Typography>
                      <Typography variant="body1">{reviewingProfile.profile.current_company || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Skills</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                        {reviewingProfile.profile.skills?.length > 0 ? (
                          reviewingProfile.profile.skills.map((skill: string, idx: number) => (
                            <Chip key={idx} label={skill} size="small" variant="outlined" />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">No skills listed</Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Work Experience Section */}
              <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#004d40', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business fontSize="small" /> Work Experience ({reviewingProfile.experiences?.length || 0})
                </Typography>
                {reviewingProfile.experiences?.length > 0 ? (
                  reviewingProfile.experiences.map((exp: any, idx: number) => (
                    <Paper key={idx} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5', borderRadius: '12px' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{exp.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{exp.company_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date} | {exp.employment_type} | {exp.location}
                      </Typography>
                      {exp.description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>{exp.description}</Typography>
                      )}
                      {exp.skills?.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                          {exp.skills.map((skill: string, sidx: number) => (
                            <Chip key={sidx} label={skill} size="small" variant="outlined" sx={{ fontSize: '10px' }} />
                          ))}
                        </Box>
                      )}
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No work experience added</Typography>
                )}
              </Box>

              {/* Education Section */}
              <Box sx={{ p: 3, bgcolor: '#f8fafb' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#004d40', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School fontSize="small" /> Education ({reviewingProfile.educations?.length || 0})
                </Typography>
                {reviewingProfile.educations?.length > 0 ? (
                  reviewingProfile.educations.map((edu: any, idx: number) => (
                    <Paper key={idx} sx={{ p: 2, mb: 2, bgcolor: 'white', borderRadius: '12px' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{edu.degree} in {edu.field_of_study}</Typography>
                      <Typography variant="body2" color="text.secondary">{edu.school_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {edu.start_year} - {edu.end_year} {edu.grade && `| Grade: ${edu.grade}`}
                      </Typography>
                      {edu.description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>{edu.description}</Typography>
                      )}
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No education records added</Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0', justifyContent: 'space-between' }}>
          <Button onClick={() => setReviewDialogOpen(false)} variant="outlined">
            Close
          </Button>
          {reviewingProfile?.verification_status === 'pending' && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => {
                  setSelectedApproval(reviewingProfile);
                  setRejectDialogOpen(true);
                  setReviewDialogOpen(false);
                }}
              >
                Reject
              </Button>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => {
                  handleApproveUser(reviewingProfile.id);
                  setReviewDialogOpen(false);
                }}
              >
                Approve
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>

      {/* Create Admin Dialog */}
      <Dialog
        open={createAdminDialog}
        onClose={() => setCreateAdminDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          } 
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AnimatedAvatar sx={{ 
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              width: 44,
              height: 44,
            }}>
              <PersonAdd sx={{ color: '#fff' }} />
            </AnimatedAvatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Create New Admin</Typography>
              <Typography variant="caption" color="text.secondary">Add a new administrator to the system</Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                label="First Name"
                fullWidth
                value={adminForm.first_name}
                onChange={(e) => setAdminForm({ ...adminForm, first_name: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
              <TextField
                label="Last Name"
                fullWidth
                value={adminForm.last_name}
                onChange={(e) => setAdminForm({ ...adminForm, last_name: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Box>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              value={adminForm.email}
              onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <FormControl fullWidth required>
              <InputLabel>Admin Roles *</InputLabel>
              <Select
                multiple
                value={adminForm.admin_roles}
                label="Admin Roles *"
                onChange={(e) => setAdminForm({ ...adminForm, admin_roles: e.target.value as string[] })}
                sx={{ borderRadius: '12px' }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value.replace('_', ' ').toUpperCase()} size="small" />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="superadmin">
                  <Checkbox checked={adminForm.admin_roles.includes('superadmin')} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SupervisorAccount sx={{ color: '#6366f1' }} />
                    Super Admin - Full system access
                  </Box>
                </MenuItem>
                <MenuItem value="company_admin">
                  <Checkbox checked={adminForm.admin_roles.includes('company_admin')} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business sx={{ color: '#059669' }} />
                    Company Admin - Manage company registrations
                  </Box>
                </MenuItem>
                <MenuItem value="hm_admin">
                  <Checkbox checked={adminForm.admin_roles.includes('hm_admin')} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <People sx={{ color: '#0ea5e9' }} />
                    Hiring Manager Admin - Manage HR registrations
                  </Box>
                </MenuItem>
                <MenuItem value="techie_admin">
                  <Checkbox checked={adminForm.admin_roles.includes('techie_admin')} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Engineering sx={{ color: '#f59e0b' }} />
                    Techie Admin - Manage tech professional registrations
                  </Box>
                </MenuItem>
                <MenuItem value="school_admin">
                  <Checkbox checked={adminForm.admin_roles.includes('school_admin')} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <School sx={{ color: '#dc2626' }} />
                    School Admin - Manage educational institution registrations
                  </Box>
                </MenuItem>
                <MenuItem value="bdm_admin">
                  <Checkbox checked={adminForm.admin_roles.includes('bdm_admin')} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business sx={{ color: '#7c3aed' }} />
                    BDM Admin - Manage company invitations and outreach
                  </Box>
                </MenuItem>
                <MenuItem value="learn_admin">
                  <Checkbox checked={adminForm.admin_roles.includes('learn_admin')} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <School sx={{ color: '#0891b2' }} />
                    Learn Admin - Manage courses, tutorials, and learning content
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            {adminForm.admin_roles.length > 0 && (
              <Alert severity="info" sx={{ borderRadius: '12px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Selected Permissions:</Typography>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  {adminForm.admin_roles.includes('superadmin') && <li>Super Admin: Full access to all system features</li>}
                  {adminForm.admin_roles.includes('company_admin') && <li>Company Admin: Approve company registrations, create company accounts</li>}
                  {adminForm.admin_roles.includes('hm_admin') && <li>HM Admin: Approve hiring manager registrations, create HM accounts</li>}
                  {adminForm.admin_roles.includes('techie_admin') && <li>Techie Admin: Approve techie registrations, create techie accounts</li>}
                  {adminForm.admin_roles.includes('school_admin') && <li>School Admin: Approve school registrations, create school accounts</li>}
                  {adminForm.admin_roles.includes('bdm_admin') && <li>BDM Admin: View company invitations, manage outreach</li>}
                  {adminForm.admin_roles.includes('learn_admin') && <li>Learn Admin: Manage courses, tutorials, sections, lessons, and learning content</li>}
                </Box>
              </Alert>
            )}
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              value={adminForm.password}
              onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
          <Button 
            onClick={() => setCreateAdminDialog(false)} 
            sx={{ 
              borderRadius: '12px',
              px: 3,
              color: '#64748b',
              '&:hover': { backgroundColor: 'rgba(100, 116, 139, 0.08)' }
            }}
          >
            Cancel
          </Button>
          <AnimatedButton onClick={handleCreateAdmin} sx={{ color: '#ffffff' }}>
            Create Admin
          </AnimatedButton>
        </DialogActions>
      </Dialog>

      {/* Edit Admin Roles Dialog */}
      <Dialog
        open={editRolesDialogOpen}
        onClose={() => setEditRolesDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
          } 
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AnimatedAvatar sx={{ 
              background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
              width: 44,
              height: 44,
            }}>
              <Settings sx={{ color: '#fff' }} />
            </AnimatedAvatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Manage Admin Roles</Typography>
              <Typography variant="caption" color="text.secondary">
                {editingAdmin?.name} ({editingAdmin?.email})
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>
            Select the roles you want to assign to this admin. You can assign multiple roles.
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Admin Roles</InputLabel>
            <Select
              multiple
              value={editingAdminRoles}
              label="Admin Roles"
              onChange={(e) => setEditingAdminRoles(e.target.value as string[])}
              sx={{ borderRadius: '12px' }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value.replace('_', ' ').toUpperCase()} size="small" color="primary" />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="superadmin">
                <Checkbox checked={editingAdminRoles.includes('superadmin')} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SupervisorAccount sx={{ color: '#6366f1' }} />
                  Super Admin
                </Box>
              </MenuItem>
              <MenuItem value="company_admin">
                <Checkbox checked={editingAdminRoles.includes('company_admin')} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business sx={{ color: '#059669' }} />
                  Company Admin
                </Box>
              </MenuItem>
              <MenuItem value="hm_admin">
                <Checkbox checked={editingAdminRoles.includes('hm_admin')} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <People sx={{ color: '#0ea5e9' }} />
                  Hiring Manager Admin
                </Box>
              </MenuItem>
              <MenuItem value="techie_admin">
                <Checkbox checked={editingAdminRoles.includes('techie_admin')} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Engineering sx={{ color: '#f59e0b' }} />
                  Techie Admin
                </Box>
              </MenuItem>
              <MenuItem value="school_admin">
                <Checkbox checked={editingAdminRoles.includes('school_admin')} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School sx={{ color: '#dc2626' }} />
                  School Admin
                </Box>
              </MenuItem>
              <MenuItem value="bdm_admin">
                <Checkbox checked={editingAdminRoles.includes('bdm_admin')} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business sx={{ color: '#7c3aed' }} />
                  BDM Admin
                </Box>
              </MenuItem>
              <MenuItem value="learn_admin">
                <Checkbox checked={editingAdminRoles.includes('learn_admin')} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School sx={{ color: '#0891b2' }} />
                  Learn Admin
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          
          {editingAdminRoles.length > 0 && (
            <Alert severity="info" sx={{ mt: 2, borderRadius: '12px' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>Selected Permissions:</Typography>
              <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '0.85rem' }}>
                {editingAdminRoles.includes('superadmin') && <li>Full system access</li>}
                {editingAdminRoles.includes('company_admin') && <li>Manage company registrations</li>}
                {editingAdminRoles.includes('hm_admin') && <li>Manage hiring manager registrations</li>}
                {editingAdminRoles.includes('techie_admin') && <li>Manage techie registrations</li>}
                {editingAdminRoles.includes('school_admin') && <li>Manage school registrations</li>}
                {editingAdminRoles.includes('bdm_admin') && <li>Manage company invitations & outreach</li>}
                {editingAdminRoles.includes('learn_admin') && <li>Manage courses, tutorials & learning content</li>}
              </Box>
            </Alert>
          )}
          
          {editingAdminRoles.length === 0 && (
            <Alert severity="warning" sx={{ mt: 2, borderRadius: '12px' }}>
              Removing all roles will revoke admin access for this user.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
          <Button 
            onClick={() => setEditRolesDialogOpen(false)} 
            sx={{ borderRadius: '12px', px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleUpdateAdminRoles}
            sx={{ 
              borderRadius: '12px', 
              px: 3,
              background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            }}
          >
            Update Roles
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Wizard */}
      <AdminCreateUserWizard
        open={createUserDialog}
        onClose={() => setCreateUserDialog(false)}
        onSuccess={() => {
          setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
          fetchUsers();
        }}
        onError={(message) => setSnackbar({ open: true, message, severity: 'error' })}
      />

      {/* Create/Edit Role Dialog */}
      <Dialog
        open={createRoleDialog || editRoleDialog}
        onClose={() => {
          setCreateRoleDialog(false);
          setEditRoleDialog(false);
          setSelectedRole(null);
          setRoleForm({ name: '', selectedPermissions: [] });
          setPermissionSearchQuery('');
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '24px', 
            maxHeight: '90vh',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          } 
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AnimatedAvatar sx={{ 
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              width: 44,
              height: 44,
            }}>
              <Security sx={{ color: '#fff' }} />
            </AnimatedAvatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {editRoleDialog ? 'Edit Role' : 'Create New Role'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {editRoleDialog ? 'Modify role permissions' : 'Define a new role with permissions'}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Role Name"
              fullWidth
              required
              value={roleForm.name}
              onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Assign Permissions ({permissions.length} total)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="View Only"
                  size="small"
                  onClick={() => applyPermissionTemplate('viewOnly')}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: '#dbeafe',
                    color: '#2563eb',
                    '&:hover': { bgcolor: '#bfdbfe' },
                  }}
                />
                <Chip
                  label="Full Access"
                  size="small"
                  onClick={() => applyPermissionTemplate('fullAccess')}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: '#dcfce7',
                    color: '#16a34a',
                    '&:hover': { bgcolor: '#bbf7d0' },
                  }}
                />
                <Chip
                  label="Clear All"
                  size="small"
                  onClick={() => applyPermissionTemplate('clear')}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: '#fee2e2',
                    color: '#dc2626',
                    '&:hover': { bgcolor: '#fecaca' },
                  }}
                />
              </Box>
            </Box>

            {/* Search Permissions */}
            <TextField
              placeholder="Search permissions..."
              size="small"
              fullWidth
              value={permissionSearchQuery}
              onChange={(e) => setPermissionSearchQuery(e.target.value)}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': { borderRadius: '10px' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
            />

            {loadingPermissions ? (
              <Box sx={{ 
                py: 6, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
              }}>
                <Box sx={{ width: '60%', maxWidth: 300 }}>
                  <LinearProgress 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                        borderRadius: 3,
                      }
                    }} 
                  />
                </Box>
                <Typography align="center" sx={{ mt: 2, fontWeight: 500 }} color="text.secondary">
                  Loading all permissions...
                </Typography>
              </Box>
            ) : (
              <Box sx={{ maxHeight: 350, overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                {Object.keys(filteredGroupedPermissions).length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">No permissions found</Typography>
                  </Box>
                ) : (
                  Object.entries(filteredGroupedPermissions)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([group, perms]) => {
                      const selectedInGroup = perms.filter(p => roleForm.selectedPermissions.includes(p.id)).length;
                      return (
                        <Accordion key={group} elevation={0} sx={{ '&:before': { display: 'none' } }}>
                          <AccordionSummary 
                            expandIcon={<ExpandMore />}
                            sx={{ 
                              bgcolor: '#f8fafc',
                              '&:hover': { bgcolor: '#f1f5f9' },
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                              <Checkbox
                                checked={isGroupFullySelected(perms)}
                                indeterminate={isGroupPartiallySelected(perms)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (isGroupFullySelected(perms)) {
                                    handleDeselectAllInGroup(perms);
                                  } else {
                                    handleSelectAllInGroup(perms);
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                                sx={{ '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: '#8b5cf6' } }}
                              />
                              <VpnKey sx={{ color: '#8b5cf6', fontSize: 18 }} />
                              <Typography sx={{ fontWeight: 600, flex: 1 }}>{group}</Typography>
                              <Chip 
                                label={`${selectedInGroup}/${perms.length}`}
                                size="small" 
                                sx={{ 
                                  bgcolor: selectedInGroup > 0 ? '#f3e8ff' : '#f1f5f9',
                                  color: selectedInGroup > 0 ? '#8b5cf6' : '#64748b',
                                  fontWeight: 600,
                                }} 
                              />
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ bgcolor: '#fff', pt: 1 }}>
                            <Grid container>
                              {perms.map((perm) => (
                                <Grid item xs={12} sm={6} key={perm.id}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={roleForm.selectedPermissions.includes(perm.id)}
                                        onChange={() => handleTogglePermission(perm.id)}
                                        size="small"
                                        sx={{ '&.Mui-checked': { color: '#8b5cf6' } }}
                                      />
                                    }
                                    label={
                                      <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                          {perm.name}
                                        </Typography>
                                        {/* <Typography variant="caption" color="text.secondary">
                                          {perm.codename}
                                        </Typography> */}
                                      </Box>
                                    }
                                    sx={{ 
                                      m: 0, 
                                      py: 0.5,
                                      width: '100%',
                                      '&:hover': { bgcolor: '#f8fafc' },
                                      borderRadius: '8px',
                                    }}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })
                )}
              </Box>
            )}

            <Box sx={{ mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Selected:</strong> {roleForm.selectedPermissions.length} of {permissions.length} permissions
              </Typography>
              {roleForm.selectedPermissions.length > 0 && (
                <Button 
                  size="small" 
                  color="error" 
                  onClick={() => setRoleForm(prev => ({ ...prev, selectedPermissions: [] }))}
                >
                  Clear Selection
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
          <Button 
            onClick={() => {
              setCreateRoleDialog(false);
              setEditRoleDialog(false);
              setSelectedRole(null);
              setRoleForm({ name: '', selectedPermissions: [] });
              setPermissionSearchQuery('');
            }} 
            sx={{ 
              borderRadius: '12px',
              px: 3,
              color: '#64748b',
              '&:hover': { backgroundColor: 'rgba(100, 116, 139, 0.08)' }
            }}
          >
            Cancel
          </Button>
          <AnimatedButton
            onClick={() => {
              if (editRoleDialog) {
                handleUpdateRole();
              } else {
                handleCreateRole();
              }
              setPermissionSearchQuery('');
            }}
            disabled={!roleForm.name}
            sx={{ color: '#ffffff' }}
          >
            {editRoleDialog ? 'Update Role' : 'Create Role'}
          </AnimatedButton>
        </DialogActions>
      </Dialog>

      {/* View User Dialog */}
      <Dialog
        open={viewUserDialog}
        onClose={() => setViewUserDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          } 
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AnimatedAvatar sx={{ 
                background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                width: 44,
                height: 44,
                '& svg': { color: '#ffffff !important' },
              }}>
                {getUserTypeIcon(selectedUser?.user_type || 'techie')}
              </AnimatedAvatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>User Details</Typography>
                <Typography variant="caption" color="text.secondary">Complete user information</Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={() => setViewUserDialog(false)}
              sx={{ 
                color: '#64748b',
                '&:hover': { 
                  backgroundColor: 'rgba(100, 116, 139, 0.08)',
                  transform: 'rotate(90deg)',
                  transition: 'transform 0.3s ease',
                }
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
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Full Name</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedUser.first_name} {selectedUser.middle_name} {selectedUser.last_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedUser.email}</Typography>
                    {selectedUser.email_verified && <CheckCircle sx={{ color: '#16a34a', fontSize: 18 }} />}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Mobile Number</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedUser.mobile_number || 'N/A'}</Typography>
                    {selectedUser.mobile_verified && <CheckCircle sx={{ color: '#16a34a', fontSize: 18 }} />}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">User Type</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {selectedUser.user_type || 'Techie'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Country</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedUser.country || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Government ID</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedUser.gov_id || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Vertechie ID</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedUser.vertechie_id || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Address</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedUser.address || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Registered Date</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {new Date(selectedUser.date_joined).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Verification Status</Typography>
                  <Box sx={{ mt: 0.5 }}>{getStatusChip(selectedUser)}</Box>
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
       
      </Dialog>

      {/* Snackbar */}
      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={deleteUserDialog}
        onClose={() => setDeleteUserDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1,
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#dc2626' }}>
          <Delete />
          Delete User Permanently
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <strong>Warning:</strong> This action cannot be undone!
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to permanently delete this user?
          </Typography>
          {userToDelete && (
            <Box sx={{ bgcolor: '#fef2f2', p: 2, borderRadius: '12px', border: '1px solid #fecaca' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {userToDelete.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userToDelete.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Type: {userToDelete.user_type || 'Techie'} | Status: {userToDelete.status || 'Unknown'}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This will delete:
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2, color: 'text.secondary' }}>
            <li>User account and credentials</li>
            <li>All profile information</li>
            <li>Work experience records</li>
            <li>Education records and projects</li>
            <li>All associated data</li>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setDeleteUserDialog(false)}
            disabled={deletingUser}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteUser}
            disabled={deletingUser}
            startIcon={deletingUser ? <CircularProgress size={16} color="inherit" /> : <Delete />}
          >
            {deletingUser ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Admin Confirmation Dialog */}
      <Dialog
        open={deleteAdminDialog}
        onClose={() => setDeleteAdminDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1,
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#dc2626' }}>
          <Delete />
          Delete Admin Permanently
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <strong>Warning:</strong> This action cannot be undone!
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to permanently delete this admin?
          </Typography>
          {adminToDelete && (
            <Box sx={{ bgcolor: '#fef2f2', p: 2, borderRadius: '12px', border: '1px solid #fecaca' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {adminToDelete.first_name} {adminToDelete.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {adminToDelete.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Roles: {(adminToDelete as any).admin_roles?.join(', ') || 'No roles'}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This will permanently remove:
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2, color: 'text.secondary' }}>
            <li>Admin account and access</li>
            <li>All admin role assignments</li>
            <li>Activity logs and history</li>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setDeleteAdminDialog(false)}
            disabled={deletingAdmin}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteAdmin}
            disabled={deletingAdmin}
            startIcon={deletingAdmin ? <CircularProgress size={16} color="inherit" /> : <Delete />}
          >
            {deletingAdmin ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ 
            borderRadius: '14px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)',
            fontWeight: 500,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default SuperAdmin;

