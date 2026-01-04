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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

interface RoleAdminDashboardProps {
  userType: 'techie' | 'hr' | 'company' | 'school';
  title: string;
  icon: React.ReactNode;
}

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

const GlassCard = styled(Card)(() => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
}));

const RoleAdminDashboard: React.FC<RoleAdminDashboardProps> = ({ userType, title, icon }) => {
  const navigate = useNavigate();
  
  // State
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Reject dialog
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

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
        setPendingApprovals(Array.isArray(data) ? data : data.results || []);
      } else if (response.status === 403) {
        setSnackbar({ open: true, message: 'You do not have permission to access this dashboard', severity: 'error' });
      }

      // Fetch stats
      const statsResponse = await fetch(`${getApiUrl(API_ENDPOINTS.PENDING_APPROVALS)}stats/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching approvals:', error);
      setSnackbar({ open: true, message: 'Error loading data', severity: 'error' });
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
        body: JSON.stringify({ rejection_reason: rejectReason }),
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

  // Filter approvals
  const filteredApprovals = pendingApprovals.filter((approval) => {
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

  return (
    <PageContainer>
      <Container maxWidth="xl">
        <GlassCard>
          {/* Header */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#e0e7ff', width: 56, height: 56 }}>
                {icon}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage {getUserTypeLabel()} registrations and approvals
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} md={3}>
                <Card sx={{ p: 2, borderRadius: '12px', textAlign: 'center', bgcolor: '#fffbeb' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>{stats.pending}</Typography>
                  <Typography variant="body2" color="text.secondary">Pending</Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ p: 2, borderRadius: '12px', textAlign: 'center', bgcolor: '#f0fdf4' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#22c55e' }}>{stats.approved}</Typography>
                  <Typography variant="body2" color="text.secondary">Approved</Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ p: 2, borderRadius: '12px', textAlign: 'center', bgcolor: '#fef2f2' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626' }}>{stats.rejected}</Typography>
                  <Typography variant="body2" color="text.secondary">Rejected</Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ p: 2, borderRadius: '12px', textAlign: 'center', bgcolor: '#f0f9ff' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#0ea5e9' }}>{stats.total}</Typography>
                  <Typography variant="body2" color="text.secondary">Total</Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
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
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="">All</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchApprovals}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => {
                  // TODO: Navigate to create user page for this type
                }}
              >
                Create {getUserTypeLabel()}
              </Button>
            </Box>

            {/* Table */}
            {loading ? (
              <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <LinearProgress sx={{ width: '60%', maxWidth: 300, height: 6, borderRadius: 3 }} />
                <Typography align="center" sx={{ mt: 2 }} color="text.secondary">
                  Loading...
                </Typography>
              </Box>
            ) : filteredApprovals.length === 0 ? (
              <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#f0fdf4' }}>
                  <CheckCircle sx={{ fontSize: 40, color: '#22c55e' }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>No Requests Found</Typography>
                <Typography variant="body2" color="text.secondary">
                  {statusFilter === 'pending' 
                    ? 'No pending approvals at this time.' 
                    : `No ${statusFilter} requests found.`}
                </Typography>
              </Paper>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '12px' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
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
                          {new Date(approval.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={approval.status}
                            size="small"
                            color={
                              approval.status === 'pending' ? 'warning' :
                              approval.status === 'approved' ? 'success' : 'error'
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          {approval.status === 'pending' && (
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircle />}
                                onClick={() => handleApprove(approval.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<Cancel />}
                                onClick={() => {
                                  setSelectedApproval(approval);
                                  setRejectDialogOpen(true);
                                }}
                              >
                                Reject
                              </Button>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </GlassCard>
      </Container>

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

export default RoleAdminDashboard;


