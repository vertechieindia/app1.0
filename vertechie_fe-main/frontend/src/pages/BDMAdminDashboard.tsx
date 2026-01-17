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
  Tooltip,
  Divider,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search,
  Refresh,
  Business,
  Email,
  Phone,
  Language,
  Person,
  LocationOn,
  CheckCircle,
  Schedule,
  Send,
  Edit,
  Visibility,
  CallMade,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

interface CompanyInvite {
  id: string;
  company_name: string;
  address: string;
  emails: string[];
  phone_numbers: string[];
  website: string;
  contact_person_name: string;
  contact_person_role: string;
  status: string;
  invitation_sent_at: string;
  created_at: string;
  invited_by_name: string;
  invited_by_email: string;
  bdm_notes: string;
  follow_up_date: string;
}

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #ede9fe 100%)',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

const GlassCard = styled(Card)(() => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
}));

const StyledTableContainer = styled(TableContainer)<{ component?: React.ElementType }>(() => ({
  '& .MuiTableHead-root': {
    backgroundColor: '#f8fafc',
  },
  '& .MuiTableCell-head': {
    fontWeight: 600,
    color: '#475569',
  },
}));

const BDMAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [invites, setInvites] = useState<CompanyInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, sent: 0, contacted: 0, accepted: 0, declined: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Detail dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<CompanyInvite | null>(null);
  
  // Update status dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [bdmNotes, setBdmNotes] = useState('');

  // Fetch invites
  const fetchInvites = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const url = statusFilter 
        ? `${getApiUrl(API_ENDPOINTS.COMPANY_INVITES)}?status=${statusFilter}`
        : getApiUrl(API_ENDPOINTS.COMPANY_INVITES);
        
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInvites(Array.isArray(data) ? data : data.results || []);
      } else if (response.status === 403) {
        setSnackbar({ open: true, message: 'You do not have permission to access this dashboard', severity: 'error' });
      }

      // Fetch stats
      const statsResponse = await fetch(`${getApiUrl(API_ENDPOINTS.COMPANY_INVITES)}stats/`, {
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
      console.error('Error fetching invites:', error);
      setSnackbar({ open: true, message: 'Error loading data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, navigate]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!selectedInvite || !newStatus) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${getApiUrl(API_ENDPOINTS.COMPANY_INVITES)}${selectedInvite.id}/update_status/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status: newStatus,
          bdm_notes: bdmNotes,
        }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Status updated successfully', severity: 'success' });
        setStatusDialogOpen(false);
        setNewStatus('');
        setBdmNotes('');
        fetchInvites();
      } else {
        const error = await response.json();
        setSnackbar({ open: true, message: error.error || 'Failed to update status', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error updating status', severity: 'error' });
    }
  };

  // Handle resend invite
  const handleResendInvite = async (inviteId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${getApiUrl(API_ENDPOINTS.COMPANY_INVITES)}${inviteId}/send_invite/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Invitation resent successfully', severity: 'success' });
        fetchInvites();
      } else {
        const error = await response.json();
        setSnackbar({ open: true, message: error.error || 'Failed to resend invitation', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error resending invitation', severity: 'error' });
    }
  };

  // Filter invites
  const filteredInvites = invites.filter((invite) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      invite.company_name?.toLowerCase().includes(query) ||
      invite.contact_person_name?.toLowerCase().includes(query) ||
      invite.emails?.some(e => e.toLowerCase().includes(query))
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'sent': return 'info';
      case 'contacted': return 'primary';
      case 'in_progress': return 'secondary';
      case 'accepted': return 'success';
      case 'declined': return 'error';
      default: return 'default';
    }
  };

  return (
    <PageContainer>
      <Container maxWidth="xl">
        <GlassCard>
          {/* Header */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#7c3aed', width: 56, height: 56 }}>
                <Business sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  BDM Admin Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage company invitations and outreach activities
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} md={2}>
                <Card sx={{ p: 2, borderRadius: '12px', textAlign: 'center', bgcolor: '#f0f9ff' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#0ea5e9' }}>{stats.total}</Typography>
                  <Typography variant="body2" color="text.secondary">Total</Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={2}>
                <Card sx={{ p: 2, borderRadius: '12px', textAlign: 'center', bgcolor: '#fffbeb' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>{stats.pending}</Typography>
                  <Typography variant="body2" color="text.secondary">Pending</Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={2}>
                <Card sx={{ p: 2, borderRadius: '12px', textAlign: 'center', bgcolor: '#e0f2fe' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#0284c7' }}>{stats.sent}</Typography>
                  <Typography variant="body2" color="text.secondary">Sent</Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={2}>
                <Card sx={{ p: 2, borderRadius: '12px', textAlign: 'center', bgcolor: '#ede9fe' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#7c3aed' }}>{stats.contacted || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Contacted</Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={2}>
                <Card sx={{ p: 2, borderRadius: '12px', textAlign: 'center', bgcolor: '#f0fdf4' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#22c55e' }}>{stats.accepted}</Typography>
                  <Typography variant="body2" color="text.secondary">Accepted</Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={2}>
                <Card sx={{ p: 2, borderRadius: '12px', textAlign: 'center', bgcolor: '#fef2f2' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626' }}>{stats.declined}</Typography>
                  <Typography variant="body2" color="text.secondary">Declined</Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search by company, contact, or email..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ flex: 1, minWidth: 250 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="sent">Sent</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="declined">Declined</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchInvites}
              >
                Refresh
              </Button>
            </Box>

            {/* Table */}
            {loading ? (
              <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <LinearProgress sx={{ width: '60%', maxWidth: 300, height: 6, borderRadius: 3 }} />
                <Typography align="center" sx={{ mt: 2 }} color="text.secondary">
                  Loading invitations...
                </Typography>
              </Box>
            ) : filteredInvites.length === 0 ? (
              <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#ede9fe' }}>
                  <Business sx={{ fontSize: 40, color: '#7c3aed' }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>No Invitations Found</Typography>
                <Typography variant="body2" color="text.secondary">
                  {statusFilter ? `No ${statusFilter} invitations.` : 'No company invitations yet.'}
                </Typography>
              </Paper>
            ) : (
              <StyledTableContainer sx={{ borderRadius: '12px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Company</TableCell>
                      <TableCell>Contact Person</TableCell>
                      <TableCell>Contact Info</TableCell>
                      <TableCell>Referred By</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredInvites.map((invite) => (
                      <TableRow key={invite.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: '#ede9fe' }}>
                              <Business sx={{ color: '#7c3aed' }} />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {invite.company_name}
                              </Typography>
                              {invite.website && (
                                <Link 
                                  href={invite.website.startsWith('http') ? invite.website : `https://${invite.website}`} 
                                  target="_blank" 
                                  rel="noopener" 
                                  sx={{ fontSize: '0.75rem' }}
                                >
                                  {invite.website}
                                </Link>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {invite.contact_person_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {invite.contact_person_role}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {invite.emails?.[0] && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Email sx={{ fontSize: 14, color: '#64748b' }} />
                                <Typography variant="caption">{invite.emails[0]}</Typography>
                              </Box>
                            )}
                            {invite.phone_numbers?.[0] && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Phone sx={{ fontSize: 14, color: '#64748b' }} />
                                <Typography variant="caption">{invite.phone_numbers[0]}</Typography>
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{invite.invited_by_name}</Typography>
                          <Typography variant="caption" color="text.secondary">{invite.invited_by_email}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={invite.status}
                            size="small"
                            color={getStatusColor(invite.status) as any}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {new Date(invite.created_at).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small"
                                onClick={() => {
                                  setSelectedInvite(invite);
                                  setDetailDialogOpen(true);
                                }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Resend Email">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleResendInvite(invite.id)}
                              >
                                <Send />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Update Status">
                              <IconButton 
                                size="small"
                                color="secondary"
                                onClick={() => {
                                  setSelectedInvite(invite);
                                  setNewStatus(invite.status);
                                  setBdmNotes(invite.bdm_notes || '');
                                  setStatusDialogOpen(true);
                                }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            )}
          </Box>
        </GlassCard>
      </Container>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Business sx={{ color: '#7c3aed' }} />
          Company Invitation Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedInvite && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, borderRadius: '12px', bgcolor: '#f8fafc', height: '100%' }}>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 700 }}>
                    Company Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Business sx={{ color: '#64748b' }} />
                      <Typography><strong>{selectedInvite.company_name}</strong></Typography>
                    </Box>
                    {selectedInvite.address && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationOn sx={{ color: '#64748b' }} />
                        <Typography variant="body2">{selectedInvite.address}</Typography>
                      </Box>
                    )}
                    {selectedInvite.website && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Language sx={{ color: '#64748b' }} />
                        <Link href={selectedInvite.website.startsWith('http') ? selectedInvite.website : `https://${selectedInvite.website}`} target="_blank">
                          {selectedInvite.website}
                        </Link>
                      </Box>
                    )}
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, borderRadius: '12px', bgcolor: '#f8fafc', height: '100%' }}>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 700 }}>
                    Contact Person
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ color: '#64748b' }} />
                      <Typography><strong>{selectedInvite.contact_person_name}</strong></Typography>
                      {selectedInvite.contact_person_role && (
                        <Chip label={selectedInvite.contact_person_role} size="small" />
                      )}
                    </Box>
                    {selectedInvite.emails?.map((email, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email sx={{ color: '#64748b' }} />
                        <Link href={`mailto:${email}`}>{email}</Link>
                      </Box>
                    ))}
                    {selectedInvite.phone_numbers?.map((phone, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone sx={{ color: '#64748b' }} />
                        <Link href={`tel:${phone}`}>{phone}</Link>
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Referred By:</Typography>
                    <Typography variant="body2">{selectedInvite.invited_by_name} ({selectedInvite.invited_by_email})</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Status:</Typography>
                    <Chip label={selectedInvite.status} color={getStatusColor(selectedInvite.status) as any} sx={{ textTransform: 'capitalize' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Created:</Typography>
                    <Typography variant="body2">{new Date(selectedInvite.created_at).toLocaleString()}</Typography>
                  </Box>
                </Box>
              </Grid>
              {selectedInvite.bdm_notes && (
                <Grid item xs={12}>
                  <Card sx={{ p: 2, borderRadius: '12px', bgcolor: '#fffbeb' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>BDM Notes:</Typography>
                    <Typography variant="body2">{selectedInvite.bdm_notes}</Typography>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            startIcon={<CallMade />}
            onClick={() => {
              setDetailDialogOpen(false);
              setNewStatus(selectedInvite?.status || '');
              setBdmNotes(selectedInvite?.bdm_notes || '');
              setStatusDialogOpen(true);
            }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Update Invitation Status
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Updating status for: <strong>{selectedInvite?.company_name}</strong>
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="sent">Sent</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
              <MenuItem value="declined">Declined</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={bdmNotes}
            onChange={(e) => setBdmNotes(e.target.value)}
            placeholder="Add notes about your outreach..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleUpdateStatus}
            disabled={!newStatus}
          >
            Update
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

export default BDMAdminDashboard;


