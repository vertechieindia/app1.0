/**
 * BDM queue: `invite_flow=registration` only — company page requests from `/techie/create-company` (after user is approved by Techie/HM admin).
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
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
  Link,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search,
  Refresh,
  Business,
  Email,
  Phone,
  CheckCircle,
  Cancel,
  FileDownload as FileDownloadIcon,
  VerifiedUser,
  Visibility,
  Block,
  Person,
  RestartAlt as RestartAltIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../config/api';
import { fetchWithAuth } from '../utils/apiInterceptor';

/** Parse FastAPI { detail: string | array } for snackbars */
async function parseFastApiDetail(res: Response): Promise<string> {
  try {
    const j = await res.json();
    const d = j.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x: { msg?: string }) => x.msg || JSON.stringify(x)).join(', ');
    if (d) return JSON.stringify(d);
    if (j.message) return String(j.message);
    return `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

interface BranchAddressRow {
  label?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

interface FounderRow {
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
}

interface CompanyInvite {
  id: string;
  company_name: string;
  legal_name?: string;
  headquarters_address?: string;
  address?: string;
  branch_addresses?: BranchAddressRow[];
  emails: string[];
  phone_numbers: string[];
  website?: string;
  domain?: string;
  industry?: string;
  gst_number?: string;
  about?: string;
  tagline?: string;
  logo_url?: string;
  banner_image_url?: string;
  founder_details?: FounderRow[];
  contact_person_name?: string;
  contact_person_role?: string;
  status: string;
  provisioned_company_id?: string | null;
  admin_notes?: string;
  created_at: string;
  sent_at?: string;
  invited_by_name?: string;
  invited_by_email?: string;
  invite_flow?: string;
  requested_by_id?: string | null;
  /** API: who submitted the registration (Techie / HR / etc.) */
  requested_by_name?: string | null;
  requested_by_email?: string | null;
  requested_by_primary_role?: string | null;
}

function submitterAccountLabel(role?: string | null): string {
  if (!role) return '';
  const r = role.toLowerCase();
  if (r === 'techie') return 'Tech Professional';
  if (r === 'hiring_manager') return 'Hiring Manager';
  if (r === 'company_admin') return 'Company admin';
  if (r === 'school_admin') return 'School admin';
  return r.replace(/_/g, ' ');
}

function hasText(v?: string | null): boolean {
  if (v == null) return false;
  return String(v).trim().length > 0;
}

function formatBranchAddress(b: BranchAddressRow): string {
  const line = [b.address_line1, b.address_line2].filter((x) => hasText(x)).join(', ');
  const cityLine = [b.city, b.state, b.postal_code].filter((x) => hasText(x)).join(', ');
  const parts = [b.label, line, cityLine, b.country].filter((p) => hasText(p));
  return parts.join(' · ');
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

export interface BDMCompanyRegistrationQueueProps {
  /** When true, render without full-page shell (for embedding under VerTechie Admin → User Management). */
  embedded?: boolean;
}

export const BDMCompanyRegistrationQueue: React.FC<BDMCompanyRegistrationQueueProps> = ({
  embedded = false,
}) => {
  const navigate = useNavigate();
  
  // State
  const [invites, setInvites] = useState<CompanyInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, sent: 0, accepted: 0, declined: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Detail dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<CompanyInvite | null>(null);
  
  // Update status dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [bdmNotes, setBdmNotes] = useState('');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  /** After successful POST /users/{id}/block — hide repeat block for that submitter */
  const [blockedSubmitterIds, setBlockedSubmitterIds] = useState<string[]>([]);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockDialogInvite, setBlockDialogInvite] = useState<CompanyInvite | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);

  // Fetch invites
  const fetchInvites = useCallback(async () => {
    setLoading(true);
    try {
      if (!localStorage.getItem('authToken')) {
        navigate('/login');
        return;
      }

      // BDM only: company profile registration queue (not signup "outreach" invites).
      const base = getApiUrl(API_ENDPOINTS.COMPANY_INVITES);
      const listParams = new URLSearchParams();
      listParams.set('invite_flow', 'registration');
      if (statusFilter) listParams.set('status', statusFilter);
      const listUrl = `${base}?${listParams.toString()}`;

      const response = await fetchWithAuth(listUrl);

      if (response.ok) {
        const data = await response.json();
        setInvites(Array.isArray(data) ? data : data.results || []);
      } else {
        const msg = await parseFastApiDetail(response);
        setInvites([]);
        setSnackbar({
          open: true,
          message:
            response.status === 403
              ? `${msg} (BDM users need "bdm_admin" in admin_roles.)`
              : msg,
          severity: 'error',
        });
      }

      const statsResponse = await fetchWithAuth(`${base}/stats/?invite_flow=registration`);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching invites:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Error loading data',
        severity: 'error',
      });
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
      const response = await fetchWithAuth(
        `${getApiUrl(API_ENDPOINTS.COMPANY_INVITES)}/${selectedInvite.id}/update_status/`,
        {
          method: 'POST',
          body: JSON.stringify({
            new_status: newStatus,
            notes: bdmNotes,
          }),
        },
      );

      if (response.ok) {
        setSnackbar({ open: true, message: 'Status updated successfully', severity: 'success' });
        setStatusDialogOpen(false);
        setNewStatus('');
        setBdmNotes('');
        fetchInvites();
      } else {
        const msg = await parseFastApiDetail(response);
        setSnackbar({ open: true, message: msg, severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error updating status', severity: 'error' });
    }
  };

  // Filter invites
  const filteredInvites = invites.filter((invite) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      invite.company_name?.toLowerCase().includes(query) ||
      invite.contact_person_name?.toLowerCase().includes(query) ||
      invite.emails?.some(e => e.toLowerCase().includes(query)) ||
      invite.requested_by_name?.toLowerCase().includes(query) ||
      invite.requested_by_email?.toLowerCase().includes(query) ||
      submitterAccountLabel(invite.requested_by_primary_role).toLowerCase().includes(query)
    );
  });

  const sortedFilteredInvites = useMemo(() => {
    return [...filteredInvites].sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tb - ta;
    });
  }, [filteredInvites]);

  const pagedInvites = useMemo(
    () => sortedFilteredInvites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedFilteredInvites, page, rowsPerPage],
  );

  useEffect(() => {
    setPage(0);
  }, [searchQuery, statusFilter]);

  const resetBdmFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('');
    setPage(0);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'sent': return 'info';
      case 'expired': return 'default';
      case 'in_progress': return 'secondary';
      case 'accepted': return 'success';
      case 'declined': return 'error';
      default: return 'default';
    }
  };

  const handleExportCSV = useCallback(() => {
    const headers = ['Company', 'Legal name', 'Email', 'Status', 'Submitted', 'GST'];
    const rows = sortedFilteredInvites.map((inv) => [
      inv.company_name ?? '',
      inv.legal_name ?? '',
      inv.emails?.[0] ?? '',
      inv.status ?? '',
      inv.created_at ? new Date(inv.created_at).toLocaleDateString('en-GB') : '',
      inv.gst_number ?? '',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bdm-company-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    setSnackbar({ open: true, message: 'Export downloaded', severity: 'success' });
  }, [sortedFilteredInvites]);

  const handleQuickApprove = async (inviteId: string, opts?: { closeDetail?: boolean }) => {
    setApprovingId(inviteId);
    try {
      const response = await fetchWithAuth(
        `${getApiUrl(API_ENDPOINTS.COMPANY_INVITES)}/${inviteId}/update_status/`,
        {
          method: 'POST',
          body: JSON.stringify({ new_status: 'accepted', notes: '' }),
        },
      );
      if (response.ok) {
        setSnackbar({ open: true, message: 'Approved — company profile will be created.', severity: 'success' });
        if (opts?.closeDetail) setDetailDialogOpen(false);
        fetchInvites();
      } else {
        const msg = await parseFastApiDetail(response);
        setSnackbar({ open: true, message: msg, severity: 'error' });
      }
    } catch {
      setSnackbar({ open: true, message: 'Failed to approve', severity: 'error' });
    } finally {
      setApprovingId(null);
    }
  };

  const openRejectFromRow = (invite: CompanyInvite, closeDetail?: boolean) => {
    setSelectedInvite(invite);
    setNewStatus('declined');
    setBdmNotes(invite.admin_notes || '');
    if (closeDetail) setDetailDialogOpen(false);
    setStatusDialogOpen(true);
  };

  const handleBlockSubmitter = async () => {
    const uid = blockDialogInvite?.requested_by_id ? String(blockDialogInvite.requested_by_id) : '';
    if (!uid || blockReason.trim().length < 10) return;
    setBlockingUserId(uid);
    try {
      const res = await fetchWithAuth(
        `${getApiUrl(`/users/${uid}/block`)}?reason=${encodeURIComponent(blockReason.trim())}`,
        { method: 'POST' },
      );
      if (res.ok) {
        setBlockedSubmitterIds((prev) => (prev.includes(uid) ? prev : [...prev, uid]));
        setSnackbar({ open: true, message: 'Submitter account blocked.', severity: 'success' });
        setBlockDialogOpen(false);
        setBlockDialogInvite(null);
        setBlockReason('');
      } else {
        setSnackbar({ open: true, message: await parseFastApiDetail(res), severity: 'error' });
      }
    } catch {
      setSnackbar({ open: true, message: 'Error blocking account', severity: 'error' });
    } finally {
      setBlockingUserId(null);
    }
  };

  const queueBody = (
    <>
        <GlassCard sx={{ overflow: 'visible' }}>
          <Box sx={{ p: 3 }}>
            {/* Toolbar — aligned with Techie Admin (RoleAdminDashboard): title + actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {embedded ? (
                  <VerifiedUser sx={{ color: '#22c55e', fontSize: 28 }} />
                ) : (
                  <>
                    <Business sx={{ color: '#ea580c', fontSize: 32 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        BDM Admin Dashboard
                      </Typography>
                      
                    </Box>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button variant="outlined" startIcon={<Refresh />} onClick={fetchInvites} size="medium">
                  Refresh
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleExportCSV}
                  size="medium"
                  disabled={sortedFilteredInvites.length === 0}
                >
                  Export
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={4} md={2}>
                <SummaryCard sx={{ bgcolor: '#f0f9ff' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#0ea5e9' }}>{stats.total}</Typography>
                  <Typography variant="body2" color="text.secondary">Total</Typography>
                </SummaryCard>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <SummaryCard sx={{ bgcolor: '#fffbeb' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b' }}>{stats.pending}</Typography>
                  <Typography variant="body2" color="text.secondary">Pending</Typography>
                </SummaryCard>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <SummaryCard sx={{ bgcolor: '#e0f2fe' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#0284c7' }}>{stats.sent}</Typography>
                  <Typography variant="body2" color="text.secondary">Sent</Typography>
                </SummaryCard>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <SummaryCard sx={{ bgcolor: '#f0fdf4' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#22c55e' }}>{stats.accepted}</Typography>
                  <Typography variant="body2" color="text.secondary">Accepted</Typography>
                </SummaryCard>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <SummaryCard sx={{ bgcolor: '#fef2f2' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#dc2626' }}>{stats.declined}</Typography>
                  <Typography variant="body2" color="text.secondary">Declined</Typography>
                </SummaryCard>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
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
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                  <MenuItem value="declined">Declined</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RestartAltIcon />}
                onClick={resetBdmFilters}
                sx={{ alignSelf: 'center', flexShrink: 0 }}
              >
                Reset filters
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
            ) : sortedFilteredInvites.length === 0 ? (
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
              <>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  border: '1px solid #e2e8f0',
                  borderBottom: 'none',
                  overflowX: 'auto',
                }}
              >
                <Table sx={{ minWidth: 720 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Contact info</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Submitted by (account)</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Submitted</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pagedInvites.map((invite) => (
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
                          <Typography variant="body2">
                            {invite.requested_by_name || invite.invited_by_name || '—'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {invite.requested_by_email || invite.invited_by_email || ''}
                          </Typography>
                          {invite.requested_by_primary_role ? (
                            <Chip
                              size="small"
                              label={submitterAccountLabel(invite.requested_by_primary_role)}
                              sx={{ mt: 0.5, height: 22, fontSize: '0.7rem', bgcolor: '#ecfeff', color: '#0e7490' }}
                            />
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              invite.status === 'accepted'
                                ? 'Accepted'
                                : invite.status === 'declined'
                                  ? 'Declined'
                                  : String(invite.status || '').charAt(0).toUpperCase() + String(invite.status || '').slice(1).toLowerCase()
                            }
                            size="small"
                            sx={{
                              bgcolor:
                                invite.status === 'pending'
                                  ? '#fffbeb'
                                  : invite.status === 'accepted'
                                    ? '#f0fdf4'
                                    : invite.status === 'declined'
                                      ? '#fef2f2'
                                      : '#f0f9ff',
                              color:
                                invite.status === 'pending'
                                  ? '#d97706'
                                  : invite.status === 'accepted'
                                    ? '#16a34a'
                                    : invite.status === 'declined'
                                      ? '#dc2626'
                                      : '#0284c7',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(invite.created_at).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                            {invite.status === 'pending' && (
                              <Tooltip title="Approve">
                                <IconButton
                                  size="small"
                                  onClick={() => handleQuickApprove(invite.id)}
                                  disabled={approvingId !== null}
                                  sx={{
                                    color: '#16a34a',
                                    '&:hover': { bgcolor: 'rgba(22, 163, 74, 0.1)', transform: 'scale(1.08)' },
                                  }}
                                >
                                  {approvingId === invite.id ? (
                                    <CircularProgress size={16} color="inherit" />
                                  ) : (
                                    <CheckCircle fontSize="small" />
                                  )}
                                </IconButton>
                              </Tooltip>
                            )}
                            {invite.status === 'pending' && (
                              <Tooltip title="Reject">
                                <IconButton
                                  size="small"
                                  onClick={() => openRejectFromRow(invite)}
                                  sx={{
                                    color: '#b91c1c',
                                    '&:hover': { bgcolor: 'rgba(185, 28, 28, 0.1)', transform: 'scale(1.08)' },
                                  }}
                                >
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {invite.status === 'accepted' && (
                              <Tooltip title="Approved — company provisioned">
                                <Box
                                  component="span"
                                  sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 34,
                                    height: 34,
                                    color: '#16a34a',
                                  }}
                                  aria-hidden
                                >
                                  <CheckCircle sx={{ fontSize: 22 }} />
                                </Box>
                              </Tooltip>
                            )}
                            {invite.status === 'accepted' && invite.requested_by_id && (
                              <Tooltip
                                title={
                                  blockedSubmitterIds.includes(String(invite.requested_by_id))
                                    ? 'Submitter account already blocked'
                                    : 'Block submitter account'
                                }
                              >
                                <span>
                                  <IconButton
                                    size="small"
                                    disabled={
                                      blockedSubmitterIds.includes(String(invite.requested_by_id)) ||
                                      blockingUserId === String(invite.requested_by_id)
                                    }
                                    onClick={() => {
                                      setBlockDialogInvite(invite);
                                      setBlockReason('');
                                      setBlockDialogOpen(true);
                                    }}
                                    sx={{
                                      color: blockedSubmitterIds.includes(String(invite.requested_by_id))
                                        ? '#9ca3af'
                                        : '#b91c1c',
                                      '&:hover': {
                                        bgcolor: blockedSubmitterIds.includes(String(invite.requested_by_id))
                                          ? undefined
                                          : 'rgba(185, 28, 28, 0.1)',
                                        transform: blockedSubmitterIds.includes(String(invite.requested_by_id))
                                          ? undefined
                                          : 'scale(1.08)',
                                      },
                                    }}
                                  >
                                    {blockingUserId === String(invite.requested_by_id) ? (
                                      <CircularProgress size={16} color="inherit" />
                                    ) : (
                                      <Block fontSize="small" />
                                    )}
                                  </IconButton>
                                </span>
                              </Tooltip>
                            )}
                            <Tooltip title="View company registration">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedInvite(invite);
                                  setDetailDialogOpen(true);
                                }}
                                sx={{
                                  color: '#0f766e',
                                  '&:hover': { bgcolor: 'rgba(15, 118, 110, 0.1)', transform: 'scale(1.08)' },
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                sx={{
                  overflowX: 'auto',
                  width: '100%',
                  border: '1px solid #e2e8f0',
                  borderTop: '1px solid #e2e8f0',
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  bgcolor: 'background.paper',
                }}
              >
                <TablePagination
                  component="div"
                  count={sortedFilteredInvites.length}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count !== -1 ? count : to}`}
                  labelRowsPerPage="Rows:"
                  sx={{ borderTop: 'none' }}
                />
              </Box>
              </>
            )}
          </Box>
        </GlassCard>

      {/* View: exactly what the user submitted on Business → Create Company */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, maxHeight: '90vh' } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
            color: '#fff',
            pb: selectedInvite ? 1.5 : 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Visibility />
              Company registration
            </Box>
            {selectedInvite && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.95)', textTransform: 'capitalize' }}>
                  {selectedInvite.status}
                </Typography>
                {selectedInvite.status === 'accepted' && (
                  <Tooltip title="Approved — company provisioned">
                    <CheckCircle sx={{ fontSize: 22, color: '#bbf7d0' }} />
                  </Tooltip>
                )}
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.88)' }}>
                  · Submitted{' '}
                  {new Date(selectedInvite.created_at).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Typography>
              </Box>
            )}
          </Box>
          {selectedInvite && hasText(selectedInvite.provisioned_company_id ?? undefined) && (
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'rgba(255,255,255,0.85)', fontFamily: 'monospace' }}>
              Company ID: {selectedInvite.provisioned_company_id}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers sx={{ overflow: 'auto', maxHeight: 'calc(90vh - 140px)' }}>
          {selectedInvite && (() => {
            const emailsFilled = (selectedInvite.emails || []).filter((e) => hasText(e));
            const phonesFilled = (selectedInvite.phone_numbers || []).filter((p) => hasText(p));
            const branchLines = (selectedInvite.branch_addresses || [])
              .map((br) => formatBranchAddress(br))
              .filter((line) => hasText(line));
            const hasLocations =
              hasText(selectedInvite.headquarters_address) ||
              hasText(selectedInvite.address) ||
              branchLines.length > 0;
            const foundersFilled = (selectedInvite.founder_details || []).filter(
              (f) => hasText(f.name) || hasText(f.role) || hasText(f.email) || hasText(f.phone),
            );
            const showContact =
              hasText(selectedInvite.contact_person_name) ||
              hasText(selectedInvite.contact_person_role) ||
              emailsFilled.length > 0 ||
              phonesFilled.length > 0;
            const showIdentity =
              hasText(selectedInvite.company_name) ||
              hasText(selectedInvite.legal_name) ||
              hasText(selectedInvite.industry) ||
              hasText(selectedInvite.gst_number) ||
              hasText(selectedInvite.domain) ||
              hasText(selectedInvite.website) ||
              hasText(selectedInvite.tagline);

            return (
              <Grid container spacing={2}>
                {(hasText(selectedInvite.requested_by_name) ||
                  hasText(selectedInvite.requested_by_email) ||
                  selectedInvite.requested_by_primary_role) && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#ecfeff', borderColor: '#a5f3fc' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Person sx={{ color: '#0e7490' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f766e' }}>
                          Submitted by (VerTechie account)
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        {hasText(selectedInvite.requested_by_name) && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Name</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {selectedInvite.requested_by_name}
                            </Typography>
                          </Grid>
                        )}
                        {hasText(selectedInvite.requested_by_email) && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Email</Typography>
                            <Typography variant="body2">{selectedInvite.requested_by_email}</Typography>
                          </Grid>
                        )}
                        {selectedInvite.requested_by_primary_role && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Account type</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {submitterAccountLabel(selectedInvite.requested_by_primary_role)}
                            </Typography>
                          </Grid>
                        )}
                        {hasText(selectedInvite.requested_by_id ?? undefined) && (
                          <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">User ID</Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                              {selectedInvite.requested_by_id}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Card>
                  </Grid>
                )}
                {showIdentity && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0f766e' }}>
                      Company identity
                    </Typography>
                    <Grid container spacing={2}>
                      {hasText(selectedInvite.company_name) && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">Display name</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedInvite.company_name}</Typography>
                        </Grid>
                      )}
                      {hasText(selectedInvite.legal_name) && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">Legal name</Typography>
                          <Typography variant="body2">{selectedInvite.legal_name}</Typography>
                        </Grid>
                      )}
                      {hasText(selectedInvite.industry) && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">Industry</Typography>
                          <Typography variant="body2">{selectedInvite.industry}</Typography>
                        </Grid>
                      )}
                      {hasText(selectedInvite.gst_number) && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">GST number</Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{selectedInvite.gst_number}</Typography>
                        </Grid>
                      )}
                      {hasText(selectedInvite.domain) && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">Domain</Typography>
                          <Typography variant="body2">{selectedInvite.domain}</Typography>
                        </Grid>
                      )}
                      {hasText(selectedInvite.website) && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary">Website</Typography>
                          <Link
                            href={selectedInvite.website!.startsWith('http') ? selectedInvite.website! : `https://${selectedInvite.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {selectedInvite.website}
                          </Link>
                        </Grid>
                      )}
                      {hasText(selectedInvite.tagline) && (
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Tagline</Typography>
                          <Typography variant="body2">{selectedInvite.tagline}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Card>
                </Grid>
                )}

                {hasText(selectedInvite.about) && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0f766e' }}>
                        About
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{selectedInvite.about}</Typography>
                    </Card>
                  </Grid>
                )}

                {(hasText(selectedInvite.logo_url) || hasText(selectedInvite.banner_image_url)) && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0f766e' }}>
                        Brand images
                      </Typography>
                      {hasText(selectedInvite.logo_url) && (
                        <Typography variant="body2" sx={{ mb: hasText(selectedInvite.banner_image_url) ? 1 : 0 }}>
                          <strong>Logo:</strong>{' '}
                          <Link href={selectedInvite.logo_url} target="_blank" rel="noopener noreferrer">{selectedInvite.logo_url}</Link>
                        </Typography>
                      )}
                      {hasText(selectedInvite.banner_image_url) && (
                        <Typography variant="body2">
                          <strong>Banner:</strong>{' '}
                          <Link href={selectedInvite.banner_image_url} target="_blank" rel="noopener noreferrer">{selectedInvite.banner_image_url}</Link>
                        </Typography>
                      )}
                    </Card>
                  </Grid>
                )}

                {hasLocations && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0f766e' }}>
                        Locations
                      </Typography>
                      {hasText(selectedInvite.headquarters_address) && (
                        <Box sx={{ mb: hasText(selectedInvite.address) || branchLines.length > 0 ? 1.5 : 0 }}>
                          <Typography variant="caption" color="text.secondary">Headquarters</Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{selectedInvite.headquarters_address}</Typography>
                        </Box>
                      )}
                      {hasText(selectedInvite.address) && (
                        <Box sx={{ mb: branchLines.length > 0 ? 1.5 : 0 }}>
                          <Typography variant="caption" color="text.secondary">Registered / primary address</Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{selectedInvite.address}</Typography>
                        </Box>
                      )}
                      {branchLines.length > 0 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Branches / other offices</Typography>
                          {branchLines.map((line, i) => (
                            <Typography key={i} variant="body2" sx={{ mt: 0.5 }}>
                              {line}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Card>
                  </Grid>
                )}

                {foundersFilled.length > 0 && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0f766e' }}>
                        Founders / leadership
                      </Typography>
                      {foundersFilled.map((f, i) => (
                        <Box key={i} sx={{ mb: i < foundersFilled.length - 1 ? 2 : 0 }}>
                          {hasText(f.name) && <Typography variant="body2" sx={{ fontWeight: 600 }}>{f.name}</Typography>}
                          {hasText(f.role) && <Typography variant="body2" color="text.secondary">{f.role}</Typography>}
                          {hasText(f.email) && <Typography variant="body2">{f.email}</Typography>}
                          {hasText(f.phone) && <Typography variant="body2">{f.phone}</Typography>}
                        </Box>
                      ))}
                    </Card>
                  </Grid>
                )}

                {showContact && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0f766e' }}>
                        Contact
                      </Typography>
                      <Grid container spacing={2}>
                        {hasText(selectedInvite.contact_person_name) && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Contact person</Typography>
                            <Typography variant="body2">{selectedInvite.contact_person_name}</Typography>
                          </Grid>
                        )}
                        {hasText(selectedInvite.contact_person_role) && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Role</Typography>
                            <Typography variant="body2">{selectedInvite.contact_person_role}</Typography>
                          </Grid>
                        )}
                        {emailsFilled.length > 0 && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Emails</Typography>
                            {emailsFilled.map((email, idx) => (
                              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Link href={`mailto:${email}`}>{email}</Link>
                              </Box>
                            ))}
                          </Grid>
                        )}
                        {phonesFilled.length > 0 && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary">Phone numbers</Typography>
                            {phonesFilled.map((phone, idx) => (
                              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Link href={`tel:${phone}`}>{phone}</Link>
                              </Box>
                            ))}
                          </Grid>
                        )}
                      </Grid>
                    </Card>
                  </Grid>
                )}
              </Grid>
            );
          })()}
        </DialogContent>
        {selectedInvite && hasText(selectedInvite.admin_notes) && (
          <Box sx={{ px: 3, py: 2, bgcolor: '#fffbeb', borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              BDM notes (internal)
            </Typography>
            <Typography variant="body2">{selectedInvite.admin_notes}</Typography>
          </Box>
        )}
        <DialogActions sx={{ p: 2, flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          {selectedInvite?.status === 'pending' && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={() => selectedInvite && openRejectFromRow(selectedInvite, true)}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={approvingId === selectedInvite?.id ? <CircularProgress size={16} color="inherit" /> : <CheckCircle />}
                disabled={approvingId !== null}
                onClick={() => selectedInvite && handleQuickApprove(selectedInvite.id, { closeDetail: true })}
              >
                Approve
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>

      {/* Block submitter account (approved registrations only) */}
      <Dialog
        open={blockDialogOpen}
        onClose={() => {
          if (!blockingUserId) {
            setBlockDialogOpen(false);
            setBlockDialogInvite(null);
            setBlockReason('');
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#b91c1c' }}>Block submitter account</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            This blocks the user who submitted this company registration from signing in. Company:{' '}
            <strong>{blockDialogInvite?.company_name}</strong>
          </Typography>
          <TextField
            fullWidth
            label="Reason for blocking (required, min 10 characters)"
            multiline
            rows={3}
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            placeholder="Explain why this account is being blocked..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              if (!blockingUserId) {
                setBlockDialogOpen(false);
                setBlockDialogInvite(null);
                setBlockReason('');
              }
            }}
            disabled={!!blockingUserId}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleBlockSubmitter}
            disabled={blockReason.trim().length < 10 || !!blockingUserId}
            startIcon={blockingUserId ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {blockingUserId ? 'Blocking...' : 'Block account'}
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
              <MenuItem value="accepted">Accepted (create company)</MenuItem>
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
    </>
  );

  if (embedded) {
    return <Box sx={{ width: '100%' }}>{queueBody}</Box>;
  }

  return (
    <PageContainer>
      <Container maxWidth="xl">{queueBody}</Container>
    </PageContainer>
  );
};

/** Standalone route (redirects to `/vertechie/admin?bdm=1`); prefer embedded queue under Admin. */
const BDMAdminDashboard: React.FC = () => <BDMCompanyRegistrationQueue embedded={false} />;

export default BDMAdminDashboard;


