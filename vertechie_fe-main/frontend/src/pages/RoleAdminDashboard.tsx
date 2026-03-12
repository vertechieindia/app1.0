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
  CircularProgress,
  TablePagination,
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
  Block as BlockIcon,
  FileDownload as FileDownloadIcon,
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
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '' = All (show all statuses by default)
  const [educationVerificationFilter, setEducationVerificationFilter] = useState(''); // '' | 'pending' | 'verified'
  const [experienceVerificationFilter, setExperienceVerificationFilter] = useState(''); // '' | 'pending' | 'verified'
  const [companyVerificationFilter, setCompanyVerificationFilter] = useState(''); // '' | 'pending' | 'verified'
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [suspendingId, setSuspendingId] = useState<string | null>(null);

  // Reject dialog
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Block/Unblock dialogs - reason required
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [approvalToBlock, setApprovalToBlock] = useState<any>(null);
  const [blockingInProgress, setBlockingInProgress] = useState(false);
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
  const [unblockReason, setUnblockReason] = useState('');
  const [approvalToUnblock, setApprovalToUnblock] = useState<any>(null);
  const [unblockingInProgress, setUnblockingInProgress] = useState(false);

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
  // Loading for Verify actions (only after button click): 'org' | `exp-${id}` | `edu-${id}`
  const [reviewVerifyLoading, setReviewVerifyLoading] = useState<string | null>(null);

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

      const apiStatus = ['pending', 'approved', 'rejected', 'suspended'].includes(statusFilter) ? statusFilter : '';
      const skip = page * rowsPerPage;
      const params = new URLSearchParams({
        user_type: userType,
        status: apiStatus,
        skip: String(skip),
        limit: String(rowsPerPage),
      });
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (userType === 'techie') {
        if (educationVerificationFilter && educationVerificationFilter !== 'all') params.set('education_verification', educationVerificationFilter);
        if (experienceVerificationFilter && experienceVerificationFilter !== 'all') params.set('experience_verification', experienceVerificationFilter);
      }
      if (['hr', 'company', 'school'].includes(userType) && companyVerificationFilter && companyVerificationFilter !== 'all') {
        params.set('company_verification', companyVerificationFilter);
      }
      const url = `${getApiUrl(API_ENDPOINTS.PENDING_APPROVALS)}?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const approvals = Array.isArray(data) ? data : (data.results ?? []);
        const total = typeof data?.total === 'number' ? data.total : approvals.length;
        setTotalCount(total);
        if (total > 0 && skip >= total) setPage(0);

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
        const rawStats = await statsResponse.json();
        const safeStats = {
          pending: rawStats.pending ?? 0,
          approved: rawStats.approved ?? 0,
          rejected: rawStats.rejected ?? 0,
          total: (rawStats.pending ?? 0) + (rawStats.approved ?? 0) + (rawStats.rejected ?? 0)
        };
        statsData = safeStats;
        setStats(safeStats);
        setTopStats((prev) => ({ ...prev, totalUsers: safeStats.total, pendingUsers: safeStats.pending }));
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
  }, [userType, statusFilter, educationVerificationFilter, experienceVerificationFilter, companyVerificationFilter, page, rowsPerPage, searchQuery, navigate]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  // Debounce search: update searchQuery 400ms after user stops typing
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset to first page when status or verification filters change
  useEffect(() => {
    setPage(0);
  }, [statusFilter, educationVerificationFilter, experienceVerificationFilter, companyVerificationFilter]);

  // Reset verification filters when switching user type so the right tab shows "All"
  useEffect(() => {
    setEducationVerificationFilter('');
    setExperienceVerificationFilter('');
    setCompanyVerificationFilter('');
  }, [userType]);

  // Handle approve
  const handleApprove = async (approvalId: string) => {
    setApprovingId(approvalId);
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
        await fetchApprovals();
      } else {
        const error = await response.json();
        setSnackbar({ open: true, message: error.detail || error.error || 'Failed to approve', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error approving user', severity: 'error' });
    } finally {
      setApprovingId(null);
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!selectedApproval || rejectReason.length < 10) return;

    setRejecting(true);
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
        setSnackbar({ open: true, message: 'User rejected successfully', severity: 'success' });
        setRejectDialogOpen(false);
        setRejectReason('');
        setSelectedApproval(null);
        await fetchApprovals();
      } else {
        const error = await response.json();
        setSnackbar({ open: true, message: error.detail || error.error || 'Failed to reject', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error rejecting user', severity: 'error' });
    } finally {
      setRejecting(false);
    }
  };

  // Open block or unblock dialog (reason required before action)
  const handleToggleSuspend = (approval: any) => {
    if (!approval?.id) return;
    const isSuspended = String(approval.status || '').toLowerCase() === 'suspended';
    if (isSuspended) {
      setApprovalToUnblock(approval);
      setUnblockReason('');
      setUnblockDialogOpen(true);
    } else {
      setApprovalToBlock(approval);
      setBlockReason('');
      setBlockDialogOpen(true);
    }
  };

  const handleBlockWithReason = async () => {
    if (!approvalToBlock || blockReason.trim().length < 10) return;
    setBlockingInProgress(true);
    try {
      const token = localStorage.getItem('authToken');
      const url = `${getApiUrl(`${API_ENDPOINTS.USERS}${approvalToBlock.id}/block`)}?reason=${encodeURIComponent(blockReason.trim())}`;
      const response = await fetch(url, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) {
        setPendingApprovals((prev) => prev.map((item) =>
          String(item.id) === String(approvalToBlock.id) ? { ...item, status: 'suspended' } : item
        ));
        setSnackbar({ open: true, message: 'User blocked successfully', severity: 'success' });
        setBlockDialogOpen(false);
        setApprovalToBlock(null);
        setBlockReason('');
      } else {
        const err = await response.json().catch(() => ({}));
        setSnackbar({ open: true, message: err.detail || err.error || 'Failed to block user', severity: 'error' });
      }
    } catch {
      setSnackbar({ open: true, message: 'Error blocking user', severity: 'error' });
    } finally {
      setBlockingInProgress(false);
    }
  };

  const handleUnblockWithReason = async () => {
    if (!approvalToUnblock || unblockReason.trim().length < 10) return;
    setUnblockingInProgress(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(`${API_ENDPOINTS.USERS}${approvalToUnblock.id}/unblock`), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setPendingApprovals((prev) => prev.map((item) =>
          String(item.id) === String(approvalToUnblock.id) ? { ...item, status: 'approved' } : item
        ));
        setSnackbar({ open: true, message: 'User unblocked successfully', severity: 'success' });
        setUnblockDialogOpen(false);
        setApprovalToUnblock(null);
        setUnblockReason('');
      } else {
        const err = await response.json().catch(() => ({}));
        setSnackbar({ open: true, message: err.detail || err.error || 'Failed to unblock user', severity: 'error' });
      }
    } catch {
      setSnackbar({ open: true, message: 'Error unblocking user', severity: 'error' });
    } finally {
      setUnblockingInProgress(false);
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
      // Use the same forgot-password flow as the login screen
      const response = await fetch(getApiUrl(API_ENDPOINTS.FORGOT_PASSWORD), {
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

  // Client-side filter: only for techie admin to exclude non-techies (server already filters by search/status)
  const filteredApprovals = pendingApprovals.filter((approval) => {
    if (userType === 'techie') {
      const isTechie = !approval.user_type ||
        String(approval.user_type).toLowerCase() === 'techie' ||
        String(approval.user_type).toLowerCase() === 'tech professional';
      const hasAdminRoles = approval.admin_roles && approval.admin_roles.length > 0;
      if (!isTechie || hasAdminRoles) return false;
    }
    return true;
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

  // Export filtered list to CSV
  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'VID', 'Country', 'Type', 'Submitted', 'Status'];
    const rows = filteredApprovals.map((a: any) => [
      a.user_full_name ?? '',
      a.user_email ?? '',
      a.vertechie_id ?? '',
      a.country ?? '',
      getUserTypeLabel(),
      a.created_at ? new Date(a.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '',
      (a.status ?? '').charAt(0).toUpperCase() + (a.status ?? '').slice(1).toLowerCase(),
    ]);
    const csvContent = [headers.join(','), ...rows.map((r: string[]) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `techie-admin-export-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    setSnackbar({ open: true, message: 'Export downloaded', severity: 'success' });
  };

  const innerContent = (
    <>
      {/* Pending Approvals content */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CheckCircle sx={{ color: '#22c55e', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>User Directory</Typography>
              <Typography variant="body2" color="text.secondary">Review and approve pending user registrations</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchApprovals} size="medium">
              Refresh
            </Button>
            <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExportCSV} size="medium" disabled={filteredApprovals.length === 0}>
              Export
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
            placeholder="Search by name, email or VID..."
            size="small"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
              <MenuItem value="suspended">Suspended</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          {userType === 'techie' && (
            <>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Education</InputLabel>
                <Select value={educationVerificationFilter || 'all'} label="Education" onChange={(e) => setEducationVerificationFilter(e.target.value === 'all' ? '' : e.target.value)}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="pending">Pending verification</MenuItem>
                  <MenuItem value="verified">Verified</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Experience</InputLabel>
                <Select value={experienceVerificationFilter || 'all'} label="Experience" onChange={(e) => setExperienceVerificationFilter(e.target.value === 'all' ? '' : e.target.value)}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="pending">Pending verification</MenuItem>
                  <MenuItem value="verified">Verified</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          {['hr', 'company', 'school'].includes(userType) && (
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Company details</InputLabel>
              <Select value={companyVerificationFilter || 'all'} label="Company details" onChange={(e) => setCompanyVerificationFilter(e.target.value === 'all' ? '' : e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending verification</MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
              </Select>
            </FormControl>
          )}
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
          <>
          <TableContainer component={Paper} elevation={0} sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12, border: '1px solid #e2e8f0', borderBottom: 'none', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>VID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Country</TableCell>
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
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#15803d', fontWeight: 600 }}>
                        {approval.vertechie_id || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{approval.country || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={getUserTypeLabel()} size="small" sx={{ bgcolor: '#f3e8ff', color: '#7c3aed', fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>{new Date(approval.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          approval.status === 'approved' ? 'Accepted' :
                            approval.status === 'rejected' ? 'Rejected' :
                              String(approval.status).charAt(0).toUpperCase() + String(approval.status).slice(1).toLowerCase()
                        }
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
                              disabled={approvingId !== null}
                              sx={{
                                color: '#16a34a',
                                transition: 'all 0.3s ease',
                                '&:hover': { bgcolor: 'rgba(22, 163, 74, 0.1)', transform: 'scale(1.15)' },
                                '&.Mui-disabled': { color: '#16a34a', opacity: 0.7 }
                              }}
                            >
                              {approvingId === approval.id ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : (
                                <CheckCircle fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}
                        {(approval.status === 'approved' || approval.status === 'suspended') && (
                          <Tooltip title={approval.status === 'suspended' ? 'Unblock user' : 'Block user'}>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleSuspend(approval)}
                              sx={{
                                color: approval.status === 'suspended' ? '#2563eb' : '#b91c1c',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  bgcolor: approval.status === 'suspended' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(185, 28, 28, 0.1)',
                                  transform: 'scale(1.15)'
                                },
                              }}
                            >
                              {approval.status === 'suspended' ? <LockReset fontSize="small" /> : <BlockIcon fontSize="small" />}
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
          <Box sx={{ overflowX: 'auto', width: '100%', border: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, bgcolor: 'background.paper' }}>
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={[10, 20, 50, 100]}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count !== -1 ? count : to}`}
              labelRowsPerPage="Rows:"
              sx={{ borderTop: 'none' }}
            />
          </Box>
          </>
        )}
      </Box>
    </>
  );
  const rest = (
    <>
      {/* Block User Dialog - reason required */}
      <Dialog open={blockDialogOpen} onClose={() => !blockingInProgress && (setBlockDialogOpen(false), setApprovalToBlock(null), setBlockReason(''))} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#dc2626' }}>Block User</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            You are about to block <strong>{approvalToBlock?.user_full_name}</strong>. Please provide a reason (required).
          </Typography>
          <TextField
            fullWidth
            label="Reason for blocking *"
            multiline
            rows={3}
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            helperText="Minimum 10 characters required"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => { setBlockDialogOpen(false); setApprovalToBlock(null); setBlockReason(''); }} disabled={blockingInProgress}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleBlockWithReason} disabled={blockReason.trim().length < 10 || blockingInProgress} startIcon={blockingInProgress ? <CircularProgress size={16} color="inherit" /> : null}>
            {blockingInProgress ? 'Blocking...' : 'Block User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unblock User Dialog - reason required */}
      <Dialog open={unblockDialogOpen} onClose={() => setUnblockDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Unblock User</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            You are about to unblock <strong>{approvalToUnblock?.user_full_name}</strong>. Please provide a reason (required).
          </Typography>
          <TextField
            fullWidth
            label="Reason for unblocking *"
            multiline
            rows={3}
            value={unblockReason}
            onChange={(e) => setUnblockReason(e.target.value)}
            helperText="Minimum 10 characters required"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => { setUnblockDialogOpen(false); setApprovalToUnblock(null); setUnblockReason(''); }} disabled={unblockingInProgress}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleUnblockWithReason} disabled={unblockReason.trim().length < 10 || unblockingInProgress} startIcon={unblockingInProgress ? <CircularProgress size={16} color="inherit" /> : null}>
            {unblockingInProgress ? 'Unblocking...' : 'Unblock User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#dc2626' }}>
          Reject User
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please provide a reason for rejecting <strong>{selectedApproval?.user_full_name}</strong>.
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
            disabled={rejectReason.length < 10 || rejecting}
            startIcon={rejecting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {rejecting ? 'Rejecting...' : 'Reject'}
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
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, maxHeight: '90vh' } }}
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
        <DialogContent sx={{ p: 0, overflow: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
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
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Full Name</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e40af' }}>
                      {[reviewData.first_name, reviewData.middle_name, reviewData.last_name].filter(Boolean).join(' ') || '—'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.email || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.mobile_number || reviewData.phone || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.dob || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Country</Typography>
                    <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.country || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Address</Typography>
                    <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.address || '—'}</Typography>
                  </Grid>
                  {/* India: show only PAN (Last 4); others: show Government ID (last 4) or gov_id */}
                  {String(reviewData.country || '').toLowerCase() === 'india' ? (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="text.secondary">PAN (Last 4)</Typography>
                      <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.gov_id_last_four || reviewData.gov_id || '—'}</Typography>
                    </Grid>
                  ) : (
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="caption" color="text.secondary">Government ID (Last 4)</Typography>
                      <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.gov_id_last_four || reviewData.gov_id || '—'}</Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">VerTechie ID</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#15803d' }}>{reviewData.vertechie_id || '—'}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Divider sx={{ my: 2 }} />
              {reviewData.organization && (
                <>
                  <Box sx={{ px: 2.5, pb: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                      <Business sx={{ fontSize: 18 }} /> Organization Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">Type</Typography>
                        <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.organization.type || '—'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">Role</Typography>
                        <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.organization.role || '—'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">Organization Name</Typography>
                        <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.organization.name || '—'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">Organization Email</Typography>
                        <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.organization.email || '—'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Website</Typography>
                        <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.organization.website || '—'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">About</Typography>
                        <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.organization.description || '—'}</Typography>
                      </Grid>
                      {(userType === 'hr' || userType === 'company' || userType === 'school') && (
                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            size="small"
                            label={reviewData.organization.verified ? 'Company verified' : 'Company not verified'}
                            icon={reviewData.organization.verified ? <CheckCircle sx={{ fontSize: 14, color: '#16a34a' }} /> : <Cancel sx={{ fontSize: 14, color: '#d97706' }} />}
                            sx={{
                              bgcolor: reviewData.organization.verified ? '#f0fdf4' : '#fffbeb',
                              color: reviewData.organization.verified ? '#16a34a' : '#d97706',
                              fontWeight: 600,
                            }}
                          />
                          {reviewUserId && !reviewData.organization.verified && (
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              disabled={reviewVerifyLoading !== null}
                              startIcon={reviewVerifyLoading === 'org' ? <CircularProgress size={14} color="inherit" /> : null}
                              onClick={async () => {
                                const token = localStorage.getItem('authToken');
                                if (!token) return;
                                setReviewVerifyLoading('org');
                                try {
                                  const res = await fetch(
                                    getApiUrl(`/users/${reviewUserId}/verify-organization`),
                                    {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                      body: JSON.stringify({ verified: true }),
                                    }
                                  );
                                  if (res.ok) {
                                    const data = await fetch(getApiUrl(`/users/${reviewUserId}/full-profile`), {
                                      headers: { 'Authorization': `Bearer ${token}` },
                                    }).then((r) => r.ok ? r.json() : null);
                                    if (data) setReviewData(data);
                                    setSnackbar({ open: true, message: 'Company verified. You can now Approve or Reject the profile.', severity: 'success' });
                                  } else {
                                    setSnackbar({ open: true, message: 'Failed to verify company', severity: 'error' });
                                  }
                                } catch {
                                  setSnackbar({ open: true, message: 'Error verifying company', severity: 'error' });
                                } finally {
                                  setReviewVerifyLoading(null);
                                }
                              }}
                            >
                              {reviewVerifyLoading === 'org' ? 'Verifying...' : 'Verify Company'}
                            </Button>
                          )}
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </>
              )}
              <Box sx={{ px: 2.5, pb: 2.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                  <Business sx={{ fontSize: 18 }} /> Work Experience ({reviewData.experiences?.length || 0})
                </Typography>
                {reviewData.experiences?.length > 0 ? (
                  reviewData.experiences.map((exp: any, idx: number) => (
                    <Paper key={exp.id || idx} sx={{ p: 1.5, mb: 1.5, bgcolor: '#f8fafc', borderRadius: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                          {exp.title || 'Position'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {exp.company_name || exp.client_name || 'Company'} | {exp.start_date || 'N/A'} - {exp.is_current ? 'Present' : (exp.end_date || 'N/A')}
                        </Typography>
                        {(exp.manager_name || exp.manager_email || exp.manager_phone || exp.manager_linkedin) && (
                          <Box sx={{ mt: 1 }}>
                            {exp.manager_name && <Typography variant="body2"><strong>Manager:</strong> {exp.manager_name}</Typography>}
                            {exp.manager_email && <Typography variant="body2"><strong>Manager Email:</strong> {exp.manager_email}</Typography>}
                            {exp.manager_phone && <Typography variant="body2"><strong>Manager Phone:</strong> {exp.manager_phone}</Typography>}
                            {exp.manager_linkedin && <Typography variant="body2"><strong>Manager LinkedIn:</strong> {exp.manager_linkedin}</Typography>}
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          size="small"
                          label={exp.is_verified ? 'Verified' : 'Pending'}
                          icon={exp.is_verified ? <CheckCircle sx={{ fontSize: 14, color: '#16a34a' }} /> : <Cancel sx={{ fontSize: 14, color: '#d97706' }} />}
                          sx={{
                            bgcolor: exp.is_verified ? '#f0fdf4' : '#fffbeb',
                            color: exp.is_verified ? '#16a34a' : '#d97706',
                            fontWeight: 600,
                          }}
                        />
                        {reviewUserId && exp.id && (
                          <Button
                            size="small"
                            variant={exp.is_verified ? 'outlined' : 'contained'}
                            color={exp.is_verified ? 'secondary' : 'primary'}
                            disabled={reviewVerifyLoading !== null}
                            startIcon={reviewVerifyLoading === `exp-${exp.id}` ? <CircularProgress size={14} color="inherit" /> : null}
                            onClick={async () => {
                              const token = localStorage.getItem('authToken');
                              if (!token) return;
                              setReviewVerifyLoading(`exp-${exp.id}`);
                              try {
                                const res = await fetch(
                                  getApiUrl(`/users/${reviewUserId}/experiences/${exp.id}/verify`),
                                  {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                    body: JSON.stringify({ is_verified: !exp.is_verified }),
                                  }
                                );
                                if (res.ok) {
                                  const data = await fetch(getApiUrl(`/users/${reviewUserId}/full-profile`), {
                                    headers: { 'Authorization': `Bearer ${token}` },
                                  }).then((r) => r.ok ? r.json() : null);
                                  if (data) setReviewData(data);
                                  setSnackbar({ open: true, message: exp.is_verified ? 'Work experience marked as pending' : 'Work experience verified', severity: 'success' });
                                } else {
                                  setSnackbar({ open: true, message: 'Failed to update work experience status', severity: 'error' });
                                }
                              } catch {
                                setSnackbar({ open: true, message: 'Error updating work experience status', severity: 'error' });
                              } finally {
                                setReviewVerifyLoading(null);
                              }
                            }}
                          >
                            {reviewVerifyLoading === `exp-${exp.id}` ? 'Updating...' : (exp.is_verified ? 'Unverify' : 'Verify')}
                          </Button>
                        )}
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No work experience added</Typography>
                )}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ px: 2.5, pb: 2.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                  <School sx={{ fontSize: 18 }} /> Education ({reviewData.educations?.length || 0})
                </Typography>
                {reviewData.educations?.length > 0 ? (
                  reviewData.educations.map((edu: any, idx: number) => (
                    <Paper key={edu.id || idx} sx={{ p: 1.5, mb: 1.5, bgcolor: '#f8fafc', borderRadius: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                          {edu.school_name || 'Institution'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {[edu.degree, edu.field_of_study].filter(Boolean).join(' · ')}
                          {edu.start_year || edu.end_year ? ` · ${edu.start_year || '—'} - ${edu.end_year || '—'}` : ''}
                        </Typography>
                        {(edu.grade || edu.score_value) && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {edu.score_type ? `${edu.score_type}: ` : ''}{edu.grade || edu.score_value}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          size="small"
                          label={edu.is_verified ? 'Verified' : 'Pending'}
                          icon={edu.is_verified ? <CheckCircle sx={{ fontSize: 14, color: '#16a34a' }} /> : <Cancel sx={{ fontSize: 14, color: '#d97706' }} />}
                          sx={{
                            bgcolor: edu.is_verified ? '#f0fdf4' : '#fffbeb',
                            color: edu.is_verified ? '#16a34a' : '#d97706',
                            fontWeight: 600,
                          }}
                        />
                        {reviewUserId && edu.id && (
                          <Button
                            size="small"
                            variant={edu.is_verified ? 'outlined' : 'contained'}
                            color={edu.is_verified ? 'secondary' : 'primary'}
                            disabled={reviewVerifyLoading !== null}
                            startIcon={reviewVerifyLoading === `edu-${edu.id}` ? <CircularProgress size={14} color="inherit" /> : null}
                            onClick={async () => {
                              const token = localStorage.getItem('authToken');
                              if (!token) return;
                              setReviewVerifyLoading(`edu-${edu.id}`);
                              try {
                                const res = await fetch(
                                  getApiUrl(`/users/${reviewUserId}/educations/${edu.id}/verify`),
                                  {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                    body: JSON.stringify({ is_verified: !edu.is_verified }),
                                  }
                                );
                                if (res.ok) {
                                  const data = await fetch(getApiUrl(`/users/${reviewUserId}/full-profile`), {
                                    headers: { 'Authorization': `Bearer ${token}` },
                                  }).then((r) => r.ok ? r.json() : null);
                                  if (data) setReviewData(data);
                                  setSnackbar({ open: true, message: edu.is_verified ? 'Education marked as pending' : 'Education verified', severity: 'success' });
                                } else {
                                  setSnackbar({ open: true, message: 'Failed to update education status', severity: 'error' });
                                }
                              } catch {
                                setSnackbar({ open: true, message: 'Error updating education status', severity: 'error' });
                              } finally {
                                setReviewVerifyLoading(null);
                              }
                            }}
                          >
                            {reviewVerifyLoading === `edu-${edu.id}` ? 'Updating...' : (edu.is_verified ? 'Unverify' : 'Verify')}
                          </Button>
                        )}
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No education added</Typography>
                )}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ px: 2.5, pb: 2.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                  <VerifiedUser sx={{ fontSize: 18 }} /> Verification Status
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    size="small"
                    label={reviewData.email_verified ? "Email Verified" : "Email Not Verified"}
                    icon={reviewData.email_verified ? <CheckCircle sx={{ fontSize: 16, color: '#16a34a' }} /> : <Cancel sx={{ fontSize: 16, color: '#dc2626' }} />}
                    sx={{ bgcolor: reviewData.email_verified ? '#f0fdf4' : '#fef2f2', color: reviewData.email_verified ? '#16a34a' : '#dc2626', fontWeight: 600 }}
                  />
                  <Chip
                    size="small"
                    label={reviewData.mobile_verified ? "Mobile Verified" : "Mobile Not Verified"}
                    icon={reviewData.mobile_verified ? <CheckCircle sx={{ fontSize: 16, color: '#16a34a' }} /> : <Cancel sx={{ fontSize: 16, color: '#dc2626' }} />}
                    sx={{ bgcolor: reviewData.mobile_verified ? '#f0fdf4' : '#fef2f2', color: reviewData.mobile_verified ? '#16a34a' : '#dc2626', fontWeight: 600 }}
                  />
                  <Chip
                    size="small"
                    label={Array.isArray(reviewData.face_verification) && reviewData.face_verification.length > 0 ? 'Face Verified' : 'Face Not Verified'}
                    icon={Array.isArray(reviewData.face_verification) && reviewData.face_verification.length > 0 ? <CheckCircle sx={{ fontSize: 16, color: '#16a34a' }} /> : <Cancel sx={{ fontSize: 16, color: '#9ca3af' }} />}
                    sx={{ bgcolor: Array.isArray(reviewData.face_verification) && reviewData.face_verification.length > 0 ? '#f0fdf4' : '#fef2f2', color: Array.isArray(reviewData.face_verification) && reviewData.face_verification.length > 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}
                  />
                  <Chip
                    size="small"
                    label={`Status: ${(reviewData.verification_status || '').toLowerCase() === 'approved' ? 'ACCEPTED' :
                      (reviewData.verification_status || 'PENDING').toUpperCase()
                      }`}
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
          <Box sx={{ flex: 1 }} />
          {reviewData && reviewUserId && ['pending', 'resubmitted'].includes(String(reviewData.verification_status || '').toLowerCase()) && (() => {
            const educations = reviewData.educations || [];
            const experiences = reviewData.experiences || [];
            const allEducationVerified = educations.length === 0 || educations.every((e: any) => e.is_verified);
            const allExperienceVerified = experiences.length === 0 || experiences.every((e: any) => e.is_verified);
            const isTechie = userType === 'techie';
            const isHR = userType === 'hr' || userType === 'company';
            const techieCanApproveReject = isTechie && allEducationVerified && allExperienceVerified;
            const hrCanApproveReject = isHR && !!reviewData.organization && reviewData.organization.verified === true;
            const canApproveReject = techieCanApproveReject || hrCanApproveReject || (userType === 'school' && !!reviewData.organization && reviewData.organization.verified === true);
            if (!canApproveReject) {
              return (
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2, alignSelf: 'center' }}>
                  {isTechie && (!allEducationVerified || !allExperienceVerified) &&
                    'Verify all Education entries and all Work Experience entries (if any) before you can Approve or Reject.'}
                  {(isHR || userType === 'school') && (!reviewData.organization || reviewData.organization.verified !== true) &&
                    'Verify the Company/Organization above before you can Approve or Reject.'}
                </Typography>
              );
            }
            return (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    const fullName = [reviewData.first_name, reviewData.middle_name, reviewData.last_name].filter(Boolean).join(' ') || reviewData.email || '';
                    setSelectedApproval({ id: reviewUserId, user_full_name: fullName });
                    setReviewModalOpen(false);
                    setRejectDialogOpen(true);
                  }}
                  sx={{ borderRadius: 2 }}
                  startIcon={<Cancel />}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={async () => {
                    await handleApprove(reviewUserId);
                    setReviewModalOpen(false);
                    setReviewUserId(null);
                    setReviewData(null);
                  }}
                  disabled={approvingId !== null}
                  sx={{ borderRadius: 2 }}
                  startIcon={approvingId === reviewUserId ? <CircularProgress size={16} color="inherit" /> : <CheckCircle />}
                >
                  {approvingId === reviewUserId ? 'Approving...' : 'Approve'}
                </Button>
              </>
            );
          })()}
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
              <Tab key={t.userType} label={t.label} icon={t.icon as any} iconPosition="start" />
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
