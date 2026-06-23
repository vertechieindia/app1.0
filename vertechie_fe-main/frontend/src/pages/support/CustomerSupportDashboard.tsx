/**
 * Customer Support Dashboard — ticket queue, responses, FAQ management.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import {
  FAQItem,
  SupportDashboardStats,
  TicketDetail,
  TicketListItem,
  TICKET_STATUS_COLORS,
  TICKET_STATUS_LABELS,
  TICKET_TYPE_LABELS,
  TicketStatus,
  TicketType,
  supportService,
} from '../../services/supportService';

const Hero = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, #00695c 0%, #004d40 100%)`,
  color: '#fff',
  borderRadius: 16,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  height: '100%',
}));

const CustomerSupportDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams<{ ticketId?: string }>();

  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState<SupportDashboardStats | null>(null);
  const [tickets, setTickets] = useState<TicketListItem[]>([]);
  const [ticketDetail, setTicketDetail] = useState<TicketDetail | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [internalNote, setInternalNote] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<TicketStatus | ''>('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadStats = useCallback(async () => {
    try {
      setStats(await supportService.getDashboardStats());
    } catch {
      /* ignore */
    }
  }, []);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await supportService.listAllTickets({
        q: search || undefined,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        unassigned_only: unassignedOnly || undefined,
      });
      setTickets(data);
    } catch {
      setSnackbar({ open: true, message: 'Failed to load tickets', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, typeFilter, unassignedOnly]);

  const loadTicket = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await supportService.getTicket(id);
      setTicketDetail(data);
      setStatusUpdate(data.status);
    } catch {
      setSnackbar({ open: true, message: 'Ticket not found', severity: 'error' });
      navigate('/vertechie/support');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const loadFaqs = useCallback(async () => {
    try {
      setFaqs(await supportService.adminListFaqs({ q: search || undefined }));
    } catch {
      /* ignore */
    }
  }, [search]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (ticketId) {
      loadTicket(ticketId);
    } else {
      setTicketDetail(null);
      if (tab === 0) loadTickets();
      if (tab === 1) loadFaqs();
    }
  }, [ticketId, tab, loadTickets, loadFaqs, loadTicket]);

  const handleReply = async () => {
    if (!ticketDetail || !replyText.trim()) return;
    try {
      await supportService.staffReply(ticketDetail.id, replyText.trim(), internalNote);
      setReplyText('');
      setInternalNote(false);
      loadTicket(ticketDetail.id);
      setSnackbar({ open: true, message: 'Reply sent', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to send reply', severity: 'error' });
    }
  };

  const handleStatusUpdate = async () => {
    if (!ticketDetail || !statusUpdate) return;
    try {
      await supportService.updateTicket(ticketDetail.id, { status: statusUpdate });
      loadTicket(ticketDetail.id);
      loadStats();
      setSnackbar({ open: true, message: 'Status updated', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
    }
  };

  const assignToMe = async () => {
    if (!ticketDetail) return;
    try {
      const raw = localStorage.getItem('userData');
      const userId = raw ? JSON.parse(raw).id : null;
      if (!userId) return;
      await supportService.updateTicket(ticketDetail.id, { assigned_to_id: userId });
      loadTicket(ticketDetail.id);
      setSnackbar({ open: true, message: 'Ticket assigned to you', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to assign ticket', severity: 'error' });
    }
  };

  if (ticketDetail) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, pb: 12 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/vertechie/support')} sx={{ mb: 2 }}>
          Back to queue
        </Button>
        <Hero>
          <Typography variant="h5" fontWeight={700}>
            {ticketDetail.ticket_number}
          </Typography>
          <Typography variant="h6">{ticketDetail.subject}</Typography>
          <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={TICKET_STATUS_LABELS[ticketDetail.status]} color={TICKET_STATUS_COLORS[ticketDetail.status]} size="small" sx={{ color: '#fff' }} />
            <Chip label={TICKET_TYPE_LABELS[ticketDetail.ticket_type]} size="small" variant="outlined" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }} />
          </Box>
        </Hero>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 2, mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Requester</Typography>
                <Typography>{ticketDetail.user_name} ({ticketDetail.user_email})</Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Description</Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{ticketDetail.description}</Typography>
              </CardContent>
            </Card>

            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Messages</Typography>
            {ticketDetail.messages.map((m) => (
              <Card
                key={m.id}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  bgcolor: m.is_internal ? 'action.hover' : m.is_staff_reply ? alpha('#00695c', 0.06) : 'background.paper',
                }}
              >
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {m.author_name} · {new Date(m.created_at).toLocaleString()}
                    {m.is_internal ? ' · Internal note' : m.is_staff_reply ? ' · Staff' : ' · User'}
                  </Typography>
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>{m.body}</Typography>
                </CardContent>
              </Card>
            ))}

            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                placeholder="Reply to customer or add internal note..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, flexWrap: 'wrap', gap: 1 }}>
                <FormControlLabel
                  control={<Checkbox checked={internalNote} onChange={(e) => setInternalNote(e.target.checked)} />}
                  label="Internal note (not visible to user)"
                />
                <Button variant="contained" endIcon={<SendIcon />} onClick={handleReply}>
                  Send
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Actions</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value as TicketStatus)}
                >
                  {Object.entries(TICKET_STATUS_LABELS).map(([k, v]) => (
                    <MenuItem key={k} value={k}>{v}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button fullWidth variant="contained" onClick={handleStatusUpdate} sx={{ mb: 1 }}>
                Update Status
              </Button>
              <Button fullWidth variant="outlined" onClick={assignToMe}>
                Assign to Me
              </Button>
              {ticketDetail.assigned_to_name && (
                <Typography variant="caption" display="block" sx={{ mt: 2 }} color="text.secondary">
                  Assigned: {ticketDetail.assigned_to_name}
                </Typography>
              )}
            </Card>
          </Grid>
        </Grid>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3, pb: 12 }}>
      <Hero>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SupportAgentIcon sx={{ fontSize: 36 }} />
          <Box>
            <Typography variant="h5" fontWeight={700}>Customer Support Dashboard</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>Manage tickets, respond to users, and maintain FAQs</Typography>
          </Box>
        </Box>
      </Hero>

      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Open', value: stats.open_tickets, color: '#1565c0' },
            { label: 'In Progress', value: stats.in_progress_tickets, color: '#f57c00' },
            { label: 'Waiting', value: stats.waiting_for_user_tickets, color: '#0288d1' },
            { label: 'Unassigned', value: stats.unassigned_tickets, color: '#c62828' },
            { label: 'Feedback', value: stats.feedback_tickets, color: '#6a1b9a' },
            { label: 'Complaints', value: stats.complaint_tickets, color: '#d84315' },
          ].map((s) => (
            <Grid item xs={6} sm={4} md={2} key={s.label}>
              <StatCard>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" fontWeight={700} sx={{ color: s.color }}>{s.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                </CardContent>
              </StatCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Ticket Queue" />
        <Tab label="FAQ Management" />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  {Object.entries(TICKET_STATUS_LABELS).map(([k, v]) => (
                    <MenuItem key={k} value={k}>{v}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  {Object.entries(TICKET_TYPE_LABELS).map(([k, v]) => (
                    <MenuItem key={k} value={k}>{v}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant="contained" onClick={loadTickets} sx={{ height: 56 }}>
                Search
              </Button>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={unassignedOnly} onChange={(e) => setUnassignedOnly(e.target.checked)} />}
                label="Unassigned only"
              />
            </Grid>
          </Grid>

          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Ticket</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((t) => (
                  <TableRow
                    key={t.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/vertechie/support/tickets/${t.id}`)}
                  >
                    <TableCell>{t.ticket_number}</TableCell>
                    <TableCell>{t.subject}</TableCell>
                    <TableCell>{t.user_name}</TableCell>
                    <TableCell>{TICKET_TYPE_LABELS[t.ticket_type]}</TableCell>
                    <TableCell>
                      <Chip label={TICKET_STATUS_LABELS[t.status]} color={TICKET_STATUS_COLORS[t.status]} size="small" />
                    </TableCell>
                    <TableCell>{t.assigned_to_name || '—'}</TableCell>
                    <TableCell>{new Date(t.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {tickets.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No tickets found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Alert severity="info" sx={{ mb: 2 }}>
            FAQ articles are seeded by default. Use the API or extend this panel to add/edit FAQs.
          </Alert>
          {faqs.map((f) => (
            <Card key={f.id} sx={{ mb: 1, borderRadius: 2 }}>
              <CardContent>
                <Chip label={f.category_name} size="small" sx={{ mb: 0.5 }} />
                <Typography fontWeight={600}>{f.question}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {f.helpful_count} helpful · {f.view_count} views
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default CustomerSupportDashboard;
