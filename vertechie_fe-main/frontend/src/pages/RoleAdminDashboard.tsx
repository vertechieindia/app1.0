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
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  LinearProgress,
  InputAdornment,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search,
  Refresh,
  CheckCircle,
  Cancel,
  Business,
  People,
  Engineering,
  School,
  PersonAdd,
  Delete as DeleteIcon,
  Visibility,
  Security,
  Close,
  VerifiedUser,
  Settings,
  LockReset,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../config/api';
import AdminCreateUserWizard from '../components/admin/AdminCreateUserWizard';

interface RoleAdminDashboardProps {
  userType: 'techie' | 'hr' | 'company' | 'school';
  title: string;
  icon: React.ReactNode;
  /** When true, omit outer PageContainer/Container/GlassCard (for use inside MultiRoleAdminDashboard tabs) */
  embedded?: boolean;
}

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(6),
}));

const GlassCard = styled(Card)(() => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
}));

const SummaryCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(2),
  textAlign: 'center',
  minHeight: 88,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));


const RoleAdminDashboard: React.FC<RoleAdminDashboardProps> = ({ userType, title, icon, embedded }) => {
  const navigate = useNavigate();
  
  // State
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '' = All (show all statuses by default)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Reject dialog
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Create user wizard (for "Create Tech Professional" etc.)
  const [createWizardOpen, setCreateWizardOpen] = useState(false);

  // Remove/delete user dialog
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<any>(null);
  const [removing, setRemoving] = useState(false);

  // Profile Review modal (shows techie details in modal format)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewUserId, setReviewUserId] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<any>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Reset password (send reset email to user)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState<{ user_full_name?: string; user_email?: string } | null>(null);
  const [resettingPassword, setResettingPassword] = useState(false);

  // Top summary stats (for reference UI: Total Admins, Active Admins, Total Users, Pending, Roles)
  const [topStats, setTopStats] = useState({
    totalAdmins: 0,
    activeAdmins: 0,
    totalUsers: 0,
    pendingUsers: 0,
    roles: 2,
  });
  // Fetch pending approvals
  const fetchApprovals = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const url = `${getApiUrl(API_ENDPOINTS.PENDING_APPROVALS)}?user_type=${userType}&status=${statusFilter}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const approvals = Array.isArray(data) ? data : (data.results ?? []);
        
        // Additional client-side filtering for techie_admin to ensure only techies are shown
        if (userType === 'techie') {
          const filtered = (approvals as any[]).filter((approval: any) => {
            const isTechie = !approval.user_type || 
                           String(approval.user_type).toLowerCase() === 'techie' ||
                           String(approval.user_type).toLowerCase() === 'tech professional';
            const hasAdminRoles = approval.admin_roles && approval.admin_roles.length > 0;
            return isTechie && !hasAdminRoles;
          });
          setPendingApprovals(filtered);
        } else {
          setPendingApprovals(approvals);
        }
      } else {
        setPendingApprovals([]);
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        if (response.status === 403) {
          setSnackbar({ open: true, message: 'You do not have permission to access this dashboard', severity: 'error' });
        } else {
          const errBody = await response.json().catch(() => ({}));
          const msg = Array.isArray(errBody.detail) ? errBody.detail.map((e: any) => e.msg || e).join(', ') : (errBody.detail || response.statusText || 'Failed to load list');
          setSnackbar({ open: true, message: msg, severity: 'error' });
        }
      }

      // Fetch stats (with user_type for role-based filtering)
      const statsUrl = `${getApiUrl(API_ENDPOINTS.PENDING_APPROVALS)}stats/?user_type=${userType}`;
      const statsResponse = await fetch(statsUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      let statsData: { pending?: number; approved?: number; rejected?: number } | null = null;
      if (statsResponse.ok) {
        statsData = await statsResponse.json();
        setStats(statsData);
        const total = (statsData.pending ?? 0) + (statsData.approved ?? 0) + (statsData.rejected ?? 0);
        setTopStats((prev) => ({ ...prev, totalUsers: total, pendingUsers: statsData!.pending ?? 0 }));
      } else if (statsResponse.status !== 401) {
        const errBody = await statsResponse.json().catch(() => ({}));
        const msg = Array.isArray(errBody.detail) ? errBody.detail.map((e: any) => e.msg || e).join(', ') : (errBody.detail || 'Failed to load stats');
        setSnackbar((prev) => ({ ...prev, open: true, message: prev.open ? prev.message : msg, severity: 'error' }));
      }

      // Fetch top summary stats (admin stats) for reference UI
      const fallbackTotal = statsData ? ((statsData.pending ?? 0) + (statsData.approved ?? 0) + (statsData.rejected ?? 0)) : 0;
      const fallbackPending = statsData?.pending ?? 0;
      try {
        const adminStatsRes = await fetch(getApiUrl('/stats/'), {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (adminStatsRes.ok) {
          const adminStats = await adminStatsRes.json();
          setTopStats({
            totalAdmins: 0,
            activeAdmins: 0,
            totalUsers: adminStats.total_users ?? fallbackTotal,
            pendingUsers: adminStats.pending_approvals ?? fallbackPending,
            roles: 2,
          });
        } else {
          setTopStats((prev) => ({ ...prev, totalUsers: fallbackTotal, pendingUsers: fallbackPending }));
        }
      } catch {
        setTopStats((prev) => ({ ...prev, totalUsers: fallbackTotal, pendingUsers: fallbackPending }));
      }
    } catch (error) {
      console.error('Error fetching approvals:', error);
      setPendingApprovals([]);
      setSnackbar({ open: true, message: 'Error loading data. Check console and that the API is running.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [userType, statusFilter, navigate]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  // Handle approve
  const handleApprove = async (approvalId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${getApiUrl(API_ENDPOINTS.PENDING_APPROVALS)}${approvalId}/approve/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: 'Approved' }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'User approved successfully', severity: 'success' });
        fetchApprovals();
      } else {
        const error = await response.json();
        setSnackbar({ open: true, message: error.error || 'Failed to approve', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error approving user', severity: 'error' });
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!selectedApproval || rejectReason.length < 10) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${getApiUrl(API_ENDPOINTS.PENDING_APPROVALS)}${selectedApproval.id}/reject/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'User rejected', severity: 'success' });
        setRejectDialogOpen(false);
        setRejectReason('');
        setSelectedApproval(null);
        fetchApprovals();
      } else {
        const error = await response.json();
        setSnackbar({ open: true, message: error.error || 'Failed to reject', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error rejecting user', severity: 'error' });
    }
  };

  // Open Profile Review modal and fetch full profile
  const handleOpenReview = useCallback(async (userId: string) => {
    setReviewUserId(userId);
    setReviewModalOpen(true);
    setReviewData(null);
    setReviewLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const url = getApiUrl(`/users/${userId}/full-profile`);
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReviewData(data);
      } else {
        setSnackbar({ open: true, message: 'Failed to load profile for review', severity: 'error' });
        setReviewModalOpen(false);
      }
    } catch (e) {
      setSnackbar({ open: true, message: 'Error loading profile', severity: 'error' });
      setReviewModalOpen(false);
    } finally {
      setReviewLoading(false);
    }
  }, []);

  const handleCloseReview = useCallback(() => {
    setReviewModalOpen(false);
    setReviewUserId(null);
    setReviewData(null);
  }, []);

  // Handle send password reset email (admin triggers reset for a user)
  const handleSendResetPassword = async () => {
    if (!userToResetPassword?.user_email) return;
    setResettingPassword(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl('/auth/password/reset'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email: userToResetPassword.user_email }),
      });
      if (response.ok) {
        setSnackbar({ open: true, message: 'Password reset email sent', severity: 'success' });
        setResetPasswordDialogOpen(false);
        setUserToResetPassword(null);
      } else {
        const err = await response.json().catch(() => ({}));
        setSnackbar({ open: true, message: err.detail || 'Failed to send reset email', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error sending reset email', severity: 'error' });
    } finally {
      setResettingPassword(false);
    }
  };

  // Handle remove (delete) user — calls DELETE /users/{id}
  const handleRemoveUser = async () => {
    if (!userToRemove?.id) return;
    setRemoving(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(`${API_ENDPOINTS.USERS.LIST.replace(/\/$/, '')}/${userToRemove.id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok || response.status === 204) {
        setSnackbar({ open: true, message: 'User removed successfully', severity: 'success' });
        setRemoveDialogOpen(false);
        setUserToRemove(null);
        fetchApprovals();
      } else {
        const err = await response.json().catch(() => ({}));
        setSnackbar({ open: true, message: err.detail || 'Failed to remove user', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error removing user', severity: 'error' });
    } finally {
      setRemoving(false);
    }
  };

  // Filter approvals
  const filteredApprovals = pendingApprovals.filter((approval) => {
    // For techie admin, ensure we only show techies
    if (userType === 'techie') {
      const isTechie = !approval.user_type || 
                      approval.user_type.toLowerCase() === 'techie' ||
                      approval.user_type.toLowerCase() === 'tech professional';
      const hasAdminRoles = approval.admin_roles && approval.admin_roles.length > 0;
      
      if (!isTechie || hasAdminRoles) {
        return false;
      }
    }
    
    // Apply search filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      approval.user_full_name?.toLowerCase().includes(query) ||
      approval.user_email?.toLowerCase().includes(query)
    );
  });

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'techie': return 'Tech Professional';
      case 'hr': return 'Hiring Manager';
      case 'company': return 'Company';
      case 'school': return 'Educational Institution';
      default: return userType;
    }
  };

  const innerContent = (
    <>
      {/* Top summary cards (reference UI) */}
      <Grid container spacing={2} sx={{ p: 2.5, pb: 0 }}>
            <Grid item xs={6} sm={4} md={2.4}>
              <SummaryCard sx={{ bgcolor: '#eff6ff' }}>
                <People sx={{ fontSize: 28, color: '#3b82f6', mx: 'auto', mb: 0.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1d4ed8' }}>{topStats.totalAdmins}</Typography>
                <Typography variant="caption" color="text.secondary">Total Admins</Typography>
              </SummaryCard>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <SummaryCard sx={{ bgcolor: '#f0fdf4' }}>
                <CheckCircle sx={{ fontSize: 28, color: '#22c55e', mx: 'auto', mb: 0.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#16a34a' }}>{topStats.activeAdmins}</Typography>
                <Typography variant="caption" color="text.secondary">Active Admins</Typography>
              </SummaryCard>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <SummaryCard sx={{ bgcolor: '#faf5ff' }}>
                <People sx={{ fontSize: 28, color: '#9333ea', mx: 'auto', mb: 0.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#7c3aed' }}>{topStats.totalUsers}</Typography>
                <Typography variant="caption" color="text.secondary">Total Users</Typography>
              </SummaryCard>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <SummaryCard sx={{ bgcolor: '#fffbeb' }}>
                <People sx={{ fontSize: 28, color: '#f59e0b', mx: 'auto', mb: 0.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#d97706' }}>{topStats.pendingUsers}</Typography>
                <Typography variant="caption" color="text.secondary">Pending (Users)</Typography>
              </SummaryCard>
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <SummaryCard sx={{ bgcolor: '#fef2f2' }}>
                <Security sx={{ fontSize: 28, color: '#dc2626', mx: 'auto', mb: 0.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#b91c1c' }}>{topStats.roles}</Typography>
                <Typography variant="caption" color="text.secondary">Roles</Typography>
              </SummaryCard>
            </Grid>
          </Grid>

          {/* Pending Approvals content */}
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircle sx={{ color: '#22c55e', fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Pending Approvals</Typography>
                  <Typography variant="body2" color="text.secondary">Review and approve pending user registrations</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>User Type</InputLabel>
                  <Select value={userType} label="User Type" disabled>
                    <MenuItem value="techie">Tech Professional</MenuItem>
                    <MenuItem value="hr">Hiring Manager</MenuItem>
                    <MenuItem value="company">Company</MenuItem>
                    <MenuItem value="school">Educational Institution</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="outlined" startIcon={<Refresh />} onClick={fetchApprovals} size="medium">
                  Refresh
                </Button>
                <Button variant="contained" startIcon={<PersonAdd />} onClick={() => setCreateWizardOpen(true)} size="medium">
                  Create {getUserTypeLabel()}
                </Button>
              </Box>
            </Box>

            {/* Approval stats row */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} md={3}>
                <SummaryCard sx={{ bgcolor: '#fffbeb' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b' }}>{stats.pending}</Typography>
                  <Typography variant="body2" color="text.secondary">Pending</Typography>
                </SummaryCard>
              </Grid>
              <Grid item xs={6} md={3}>
                <SummaryCard sx={{ bgcolor: '#f0fdf4' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#22c55e' }}>{stats.approved}</Typography>
                  <Typography variant="body2" color="text.secondary">Approved</Typography>
                </SummaryCard>
              </Grid>
              <Grid item xs={6} md={3}>
                <SummaryCard sx={{ bgcolor: '#fef2f2' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#dc2626' }}>{stats.rejected}</Typography>
                  <Typography variant="body2" color="text.secondary">Rejected</Typography>
                </SummaryCard>
              </Grid>
              <Grid item xs={6} md={3}>
                <SummaryCard sx={{ bgcolor: '#f0f9ff' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#0ea5e9' }}>{stats.total}</Typography>
                  <Typography variant="body2" color="text.secondary">Total</Typography>
                </SummaryCard>
              </Grid>
            </Grid>

            {/* Search + Status filter */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search by name or email..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ flex: 1, minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Table */}
            {loading ? (
              <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <LinearProgress sx={{ width: '60%', maxWidth: 300, height: 6, borderRadius: 3 }} />
                <Typography align="center" sx={{ mt: 2 }} color="text.secondary">Loading...</Typography>
              </Box>
            ) : filteredApprovals.length === 0 ? (
              <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#f0fdf4' }}>
                  <CheckCircle sx={{ fontSize: 40, color: '#22c55e' }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {userType === 'techie' ? 'No Tech Professional Requests' : userType === 'hr' ? 'No Hiring Managers Yet' : userType === 'company' ? 'No Company Accounts Yet' : userType === 'school' ? 'No School Accounts Yet' : 'No Requests Found'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 360, mx: 'auto' }}>
                  {userType === 'techie'
                    ? (!statusFilter ? 'No Tech Professional requests found.' : statusFilter === 'pending' ? 'No pending Tech Professional approvals at this time.' : `No ${statusFilter} Tech Professional requests found.`)
                    : userType === 'hr'
                    ? (!statusFilter ? "No hiring managers in the list yet. Click \"Create Hiring Manager\" above to add one." : statusFilter === 'pending' ? 'No pending Hiring Manager approvals.' : `No ${statusFilter} Hiring Manager requests found.`)
                    : (!statusFilter ? `No ${getUserTypeLabel().toLowerCase()}s yet. Use "Create ${getUserTypeLabel()}" above to add one.` : statusFilter === 'pending' ? `No pending ${getUserTypeLabel()} approvals.` : `No ${statusFilter} requests found.`)}
                </Typography>
              </Paper>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Submitted</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredApprovals.map((approval) => (
                      <TableRow key={approval.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: '#e0e7ff' }}>
                              {userType === 'techie' && <Engineering sx={{ color: '#6366f1' }} />}
                              {userType === 'hr' && <People sx={{ color: '#6366f1' }} />}
                              {userType === 'company' && <Business sx={{ color: '#6366f1' }} />}
                              {userType === 'school' && <School sx={{ color: '#6366f1' }} />}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{approval.user_full_name}</Typography>
                              <Typography variant="caption" color="text.secondary">{approval.user_email}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={getUserTypeLabel()} size="small" sx={{ bgcolor: '#f3e8ff', color: '#7c3aed', fontWeight: 600 }} />
                        </TableCell>
                        <TableCell>{new Date(approval.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                        <TableCell>
                          <Chip
                            label={String(approval.status).toLowerCase()}
                            size="small"
                            sx={{
                              bgcolor: approval.status === 'pending' ? '#fffbeb' : approval.status === 'approved' ? '#f0fdf4' : '#fef2f2',
                              color: approval.status === 'pending' ? '#d97706' : approval.status === 'approved' ? '#16a34a' : '#dc2626',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {approval.status === 'pending' && (
                              <Tooltip title="Approve">
                                <IconButton
                                  size="small"
                                  onClick={() => handleApprove(approval.id)}
                                  sx={{
                                    color: '#16a34a',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { bgcolor: 'rgba(22, 163, 74, 0.1)', transform: 'scale(1.15)' },
                                  }}
                                >
                                  <CheckCircle fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Review profile">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenReview(approval.id)}
                                sx={{
                                  color: '#7c3aed',
                                  transition: 'all 0.3s ease',
                                  '&:hover': { bgcolor: 'rgba(124, 58, 237, 0.1)', transform: 'scale(1.15)' },
                                }}
                              >
                                <Settings fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reset password">
                              <IconButton
                                size="small"
                                onClick={() => { setUserToResetPassword(approval); setResetPasswordDialogOpen(true); }}
                                sx={{
                                  color: '#6b7280',
                                  transition: 'all 0.3s ease',
                                  '&:hover': { bgcolor: 'rgba(107, 114, 128, 0.1)', color: '#4b5563', transform: 'scale(1.15)' },
                                }}
                              >
                                <LockReset fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove user">
                              <IconButton
                                size="small"
                                onClick={() => { setUserToRemove(approval); setRemoveDialogOpen(true); }}
                                sx={{
                                  color: '#dc2626',
                                  transition: 'all 0.3s ease',
                                  '&:hover': { bgcolor: 'rgba(220, 38, 38, 0.1)', transform: 'scale(1.15)' },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {approval.status === 'pending' && (
                              <Tooltip title="Reject">
                                <IconButton
                                  size="small"
                                  onClick={() => { setSelectedApproval(approval); setRejectDialogOpen(true); }}
                                  sx={{
                                    color: '#b91c1c',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { bgcolor: 'rgba(185, 28, 28, 0.1)', transform: 'scale(1.15)' },
                                  }}
                                >
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
    </>
  );
  const rest = (
    <>
      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#dc2626' }}>
          Reject Registration
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please provide a reason for rejecting <strong>{selectedApproval?.user_full_name}</strong>'s registration.
          </Typography>
          <TextField
            fullWidth
            label="Rejection Reason *"
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            helperText="Minimum 10 characters required"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleReject}
            disabled={rejectReason.length < 10}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Wizard (Create Tech Professional / HR / Company / School) */}
      <AdminCreateUserWizard
        open={createWizardOpen}
        onClose={() => setCreateWizardOpen(false)}
        onSuccess={() => {
          setCreateWizardOpen(false);
          fetchApprovals();
          setSnackbar({ open: true, message: `${getUserTypeLabel()} created successfully`, severity: 'success' });
        }}
        onError={(message) => setSnackbar({ open: true, message, severity: 'error' })}
        initialRole={userType}
      />

      {/* Remove User Confirmation Dialog */}
      <Dialog open={removeDialogOpen} onClose={() => !removing && setRemoveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#dc2626' }}>
          Remove {getUserTypeLabel()}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Permanently remove <strong>{userToRemove?.user_full_name}</strong> ({userToRemove?.user_email})? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => !removing && setRemoveDialogOpen(false)} disabled={removing}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleRemoveUser} disabled={removing}>
            {removing ? 'Removing...' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog — send reset email to user */}
      <Dialog open={resetPasswordDialogOpen} onClose={() => !resettingPassword && (setResetPasswordDialogOpen(false), setUserToResetPassword(null))} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockReset sx={{ color: '#6b7280' }} /> Reset Password
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Send a password reset email to <strong>{userToResetPassword?.user_full_name}</strong> ({userToResetPassword?.user_email})?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => !resettingPassword && (setResetPasswordDialogOpen(false), setUserToResetPassword(null))} disabled={resettingPassword}>Cancel</Button>
          <Button variant="contained" onClick={handleSendResetPassword} disabled={resettingPassword}>
            {resettingPassword ? 'Sending...' : 'Send reset email'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profile Review Modal */}
      <Dialog
        open={reviewModalOpen}
        onClose={handleCloseReview}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #004d40 0%, #00695c 100%)',
            color: '#fff',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1.5,
            px: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Visibility sx={{ fontSize: 24 }} />
            <span>Profile Review</span>
          </Box>
          <IconButton size="small" onClick={handleCloseReview} sx={{ color: '#fff' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {reviewLoading ? (
            <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
              <LinearProgress sx={{ width: '60%', borderRadius: 2 }} />
            </Box>
          ) : reviewData ? (
            <>
              <Box sx={{ px: 2.5, pt: 2.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                  <People sx={{ fontSize: 18 }} /> Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Full Name</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e40af' }}>
                      {[reviewData.first_name, reviewData.middle_name, reviewData.last_name].filter(Boolean).join(' ') || '—'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.email || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.mobile_number || reviewData.phone || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.dob || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Country</Typography>
                    <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.country || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Address</Typography>
                    <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.address || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Government ID</Typography>
                    <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.gov_id || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">VerTechie ID</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#15803d' }}>{reviewData.vertechie_id || '—'}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ px: 2.5, pb: 2.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                  <VerifiedUser sx={{ fontSize: 18 }} /> Verification Status
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    size="small"
                    label="Email Verified"
                    icon={reviewData.email_verified ? <CheckCircle sx={{ fontSize: 16, color: '#16a34a' }} /> : <Cancel sx={{ fontSize: 16, color: '#dc2626' }} />}
                    sx={{ bgcolor: reviewData.email_verified ? '#f0fdf4' : '#fef2f2', color: reviewData.email_verified ? '#16a34a' : '#dc2626', fontWeight: 600 }}
                  />
                  <Chip
                    size="small"
                    label="Mobile Verified"
                    icon={reviewData.mobile_verified ? <CheckCircle sx={{ fontSize: 16, color: '#16a34a' }} /> : <Cancel sx={{ fontSize: 16, color: '#dc2626' }} />}
                    sx={{ bgcolor: reviewData.mobile_verified ? '#f0fdf4' : '#fef2f2', color: reviewData.mobile_verified ? '#16a34a' : '#dc2626', fontWeight: 600 }}
                  />
                  <Chip
                    size="small"
                    label={reviewData.face_verification ? 'Face Verified' : 'Face Not Verified'}
                    icon={reviewData.face_verification ? <CheckCircle sx={{ fontSize: 16, color: '#16a34a' }} /> : <Cancel sx={{ fontSize: 16, color: '#9ca3af' }} />}
                    sx={{ bgcolor: reviewData.face_verification ? '#f0fdf4' : '#fef2f2', color: reviewData.face_verification ? '#16a34a' : '#dc2626', fontWeight: 600 }}
                  />
                  <Chip
                    size="small"
                    label={`Status: ${(reviewData.verification_status || 'PENDING').toUpperCase()}`}
                    sx={{
                      bgcolor: (reviewData.verification_status || '').toLowerCase() === 'approved' ? '#f0fdf4' : (reviewData.verification_status || '').toLowerCase() === 'rejected' ? '#fef2f2' : '#fffbeb',
                      color: (reviewData.verification_status || '').toLowerCase() === 'approved' ? '#16a34a' : (reviewData.verification_status || '').toLowerCase() === 'rejected' ? '#dc2626' : '#d97706',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>
            </>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2, pt: 0 }}>
          <Button variant="outlined" color="primary" onClick={handleCloseReview} sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
  if (embedded) {
    return (
      <Box>
        <GlassCard sx={{ overflow: 'hidden' }}>{innerContent}</GlassCard>
        {rest}
      </Box>
    );
  }
  return (
    <PageContainer>
      <Container maxWidth="xl">
        <GlassCard sx={{ overflow: 'hidden' }}>{innerContent}</GlassCard>
      </Container>
      {rest}
    </PageContainer>
  );
};

// Export specific dashboard components
export const TechieAdminDashboard: React.FC = () => (
  <RoleAdminDashboard 
    userType="techie" 
    title="Techie Admin Dashboard" 
    icon={<Engineering sx={{ color: '#f59e0b', fontSize: 32 }} />}
  />
);

export const HMAdminDashboard: React.FC = () => (
  <RoleAdminDashboard 
    userType="hr" 
    title="Hiring Manager Admin Dashboard" 
    icon={<People sx={{ color: '#0ea5e9', fontSize: 32 }} />}
  />
);

export const CompanyAdminDashboard: React.FC = () => (
  <RoleAdminDashboard 
    userType="company" 
    title="Company Admin Dashboard" 
    icon={<Business sx={{ color: '#059669', fontSize: 32 }} />}
  />
);

export const SchoolAdminDashboard: React.FC = () => (
  <RoleAdminDashboard 
    userType="school" 
    title="School Admin Dashboard" 
    icon={<School sx={{ color: '#dc2626', fontSize: 32 }} />}
  />
);

// Map admin_role string to RoleAdminDashboard userType and labels
const ADMIN_ROLE_TO_USER_TYPE: Record<string, { userType: 'techie' | 'hr' | 'company' | 'school'; label: string; icon: React.ReactNode }> = {
  techie_admin: { userType: 'techie', label: 'Tech Professional', icon: <Engineering sx={{ color: '#f59e0b', fontSize: 20 }} /> },
  hm_admin: { userType: 'hr', label: 'Hiring Manager', icon: <People sx={{ color: '#0ea5e9', fontSize: 20 }} /> },
  company_admin: { userType: 'company', label: 'Company', icon: <Business sx={{ color: '#059669', fontSize: 20 }} /> },
  school_admin: { userType: 'school', label: 'Educational Institution', icon: <School sx={{ color: '#dc2626', fontSize: 20 }} /> },
};

/**
 * Multi-role admin dashboard: shows one tab per admin role (techie_admin, hm_admin, etc.)
 * so the same user can manage Tech Professional, HR, Company, and School approvals from one screen.
 */
export const MultiRoleAdminDashboard: React.FC = () => {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [tabs, setTabs] = React.useState<Array<{ userType: 'techie' | 'hr' | 'company' | 'school'; label: string; icon: React.ReactNode }>>([]);

  React.useEffect(() => {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) return;
      const user = JSON.parse(userData);
      const adminRoles: string[] = user.admin_roles || [];
      const roleTabs = adminRoles
        .filter((role) => ADMIN_ROLE_TO_USER_TYPE[role])
        .map((role) => ({
          userType: ADMIN_ROLE_TO_USER_TYPE[role].userType,
          label: ADMIN_ROLE_TO_USER_TYPE[role].label,
          icon: ADMIN_ROLE_TO_USER_TYPE[role].icon,
        }));
      // Dedupe by userType (in case of duplicate roles)
      const seen = new Set<string>();
      const unique = roleTabs.filter((t) => {
        if (seen.has(t.userType)) return false;
        seen.add(t.userType);
        return true;
      });
      setTabs(unique);
      if (unique.length > 0 && tabIndex >= unique.length) setTabIndex(0);
    } catch {
      setTabs([]);
    }
  }, []);

  if (tabs.length === 0) {
    return (
      <PageContainer>
        <Container maxWidth="md">
          <GlassCard sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No admin roles found. You need at least one of: Techie Admin, HM Admin, Company Admin, School Admin.</Typography>
          </GlassCard>
        </Container>
      </PageContainer>
    );
  }

  if (tabs.length === 1) {
    return (
      <RoleAdminDashboard
        userType={tabs[0].userType}
        title={`${tabs[0].label} Admin`}
        icon={tabs[0].icon}
      />
    );
  }

  const current = tabs[tabIndex];
  return (
    <PageContainer>
      <Container maxWidth="xl">
        <GlassCard sx={{ overflow: 'hidden' }}>
          <Tabs
            value={tabIndex}
            onChange={(_, v) => setTabIndex(v)}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}
          >
            {tabs.map((t, i) => (
              <Tab key={t.userType} label={t.label} icon={t.icon} iconPosition="start" />
            ))}
          </Tabs>
          <Box sx={{ pt: 0 }}>
            <RoleAdminDashboard
              userType={current.userType}
              title={`${current.label} Admin`}
              icon={current.icon}
              embedded
            />
          </Box>
        </GlassCard>
      </Container>
    </PageContainer>
  );
};

export default RoleAdminDashboard;


