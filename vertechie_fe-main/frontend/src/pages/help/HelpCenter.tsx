/**
 * Help Center — FAQs, tickets, feedback & complaints (all authenticated users).
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import {
  FAQCategory,
  FAQItem,
  TicketDetail,
  TicketListItem,
  TICKET_STATUS_COLORS,
  TICKET_STATUS_LABELS,
  TICKET_TYPE_LABELS,
  supportService,
} from '../../services/supportService';

const Hero = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #0d47a1 100%)`,
  color: '#fff',
  borderRadius: 16,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
}));

const GlassCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  boxShadow: '0 4px 24px rgba(26, 35, 126, 0.06)',
}));

type TabKey = 'faq' | 'tickets' | 'raise' | 'feedback' | 'complaint';

const TAB_INDEX: Record<TabKey, number> = { faq: 0, tickets: 1, raise: 2, feedback: 3, complaint: 4 };
const INDEX_TAB: TabKey[] = ['faq', 'tickets', 'raise', 'feedback', 'complaint'];

const HelpCenter: React.FC = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams<{ ticketId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tab, setTab] = useState<TabKey>(() => {
    const t = searchParams.get('tab') as TabKey | null;
    return t && INDEX_TAB.includes(t) ? t : 'faq';
  });
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [faqSearch, setFaqSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedFaq, setSelectedFaq] = useState<FAQItem | null>(null);
  const [myTickets, setMyTickets] = useState<TicketListItem[]>([]);
  const [ticketDetail, setTicketDetail] = useState<TicketDetail | null>(null);
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('');
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [form, setForm] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium' as const,
  });

  const loadCategories = useCallback(async () => {
    try {
      const data = await supportService.listCategories();
      setCategories(data);
    } catch {
      /* ignore */
    }
  }, []);

  const loadFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await supportService.listFaqs({
        q: faqSearch || undefined,
        category_id: categoryFilter || undefined,
      });
      setFaqs(data);
    } catch {
      setSnackbar({ open: true, message: 'Failed to load FAQs', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [faqSearch, categoryFilter]);

  const loadMyTickets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await supportService.listMyTickets({
        q: ticketSearch || undefined,
        status: (ticketStatusFilter || undefined) as never,
      });
      setMyTickets(data);
    } catch {
      setSnackbar({ open: true, message: 'Failed to load tickets', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [ticketSearch, ticketStatusFilter]);

  const loadTicketDetail = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await supportService.getMyTicket(id);
      setTicketDetail(data);
    } catch {
      setSnackbar({ open: true, message: 'Ticket not found', severity: 'error' });
      navigate('/help?tab=tickets');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (tab === 'faq') loadFaqs();
    if (tab === 'tickets' && !ticketId) loadMyTickets();
  }, [tab, loadFaqs, loadMyTickets, ticketId]);

  useEffect(() => {
    if (ticketId) {
      setTab('tickets');
      loadTicketDetail(ticketId);
    } else {
      setTicketDetail(null);
    }
  }, [ticketId, loadTicketDetail]);

  const handleTabChange = (_: React.SyntheticEvent, index: number) => {
    const key = INDEX_TAB[index];
    setTab(key);
    setSearchParams({ tab: key });
    if (ticketId) navigate(`/help?tab=${key}`);
  };

  const handleFaqFeedback = async (faq: FAQItem, is_helpful: boolean) => {
    try {
      await supportService.submitFaqFeedback(faq.id, is_helpful);
      setFaqs((prev) =>
        prev.map((f) => (f.id === faq.id ? { ...f, user_feedback: is_helpful } : f)),
      );
      if (selectedFaq?.id === faq.id) {
        setSelectedFaq({ ...selectedFaq, user_feedback: is_helpful });
      }
    } catch {
      setSnackbar({ open: true, message: 'Could not save feedback', severity: 'error' });
    }
  };

  const submitTicket = async (ticket_type: 'support' | 'feedback' | 'suggestion' | 'complaint') => {
    if (!form.subject.trim() || !form.description.trim()) {
      setSnackbar({ open: true, message: 'Subject and description are required', severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      const ticket = await supportService.createTicket({
        subject: form.subject.trim(),
        description: form.description.trim(),
        ticket_type,
        priority: form.priority,
        category: form.category || undefined,
      });
      setSnackbar({
        open: true,
        message: `Ticket ${ticket.ticket_number} created successfully`,
        severity: 'success',
      });
      setForm({ subject: '', description: '', category: '', priority: 'medium' });
      navigate(`/help/tickets/${ticket.id}`);
    } catch {
      setSnackbar({ open: true, message: 'Failed to create ticket', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async () => {
    if (!ticketDetail || !replyText.trim()) return;
    try {
      await supportService.replyToTicket(ticketDetail.id, replyText.trim());
      setReplyText('');
      loadTicketDetail(ticketDetail.id);
    } catch {
      setSnackbar({ open: true, message: 'Failed to send reply', severity: 'error' });
    }
  };

  const ticketFormFields = useMemo(
    () => (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Category (optional)</InputLabel>
            <Select
              label="Category (optional)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as 'medium' })}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            placeholder="Describe your issue, feedback, or complaint in detail..."
          />
        </Grid>
      </Grid>
    ),
    [form, categories],
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3, pb: 12 }}>
      <Hero>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <HelpOutlineIcon sx={{ fontSize: 40 }} />
          <Typography variant="h4" fontWeight={700}>
            Help Center
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Search our knowledge base, track support tickets, or contact Customer Support.
        </Typography>
      </Hero>

      <Tabs
        value={TAB_INDEX[tab]}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab icon={<SearchIcon />} iconPosition="start" label="FAQs" />
        <Tab icon={<ConfirmationNumberIcon />} iconPosition="start" label="My Tickets" />
        <Tab icon={<HelpOutlineIcon />} iconPosition="start" label="Raise Ticket" />
        <Tab icon={<LightbulbIcon />} iconPosition="start" label="Feedback" />
        <Tab icon={<ReportProblemIcon />} iconPosition="start" label="Complaint" />
      </Tabs>

      {/* FAQ Tab */}
      {tab === 'faq' && (
        <Box>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search FAQs by keyword..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadFaqs()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="">All categories</MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name} ({c.faq_count})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={loadFaqs} disabled={loading}>
                Search
              </Button>
            </Grid>
          </Grid>

          {faqs.length === 0 && !loading && (
            <Alert severity="info">No FAQs match your search. Try different keywords or raise a support ticket.</Alert>
          )}

          {faqs.map((faq) => (
            <Accordion key={faq.id} sx={{ mb: 1, borderRadius: '12px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box>
                  {faq.category_name && (
                    <Chip label={faq.category_name} size="small" sx={{ mb: 0.5, mr: 1 }} />
                  )}
                  <Typography fontWeight={600}>{faq.question}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                  {faq.answer}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="caption" color="text.secondary">
                    Was this helpful?
                  </Typography>
                  <IconButton
                    size="small"
                    color={faq.user_feedback === true ? 'primary' : 'default'}
                    onClick={() => handleFaqFeedback(faq, true)}
                  >
                    <ThumbUpIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color={faq.user_feedback === false ? 'error' : 'default'}
                    onClick={() => handleFaqFeedback(faq, false)}
                  >
                    <ThumbDownIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {faq.helpful_count} helpful · {faq.not_helpful_count} not helpful
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  <Button size="small" onClick={() => { setTab('raise'); setSearchParams({ tab: 'raise' }); }}>
                    Still need help?
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* My Tickets */}
      {tab === 'tickets' && !ticketDetail && (
        <Box>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search tickets..."
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={ticketStatusFilter} onChange={(e) => setTicketStatusFilter(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  {Object.entries(TICKET_STATUS_LABELS).map(([k, v]) => (
                    <MenuItem key={k} value={k}>{v}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant="outlined" onClick={loadMyTickets} sx={{ height: '56px' }}>
                Filter
              </Button>
            </Grid>
          </Grid>

          {myTickets.length === 0 && !loading && (
            <Alert severity="info">You have no support tickets yet.</Alert>
          )}

          {myTickets.map((t) => (
            <GlassCard key={t.id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate(`/help/tickets/${t.id}`)}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{t.ticket_number}</Typography>
                    <Typography fontWeight={600}>{t.subject}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {TICKET_TYPE_LABELS[t.ticket_type]} · {new Date(t.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                  <Chip label={TICKET_STATUS_LABELS[t.status]} color={TICKET_STATUS_COLORS[t.status]} size="small" />
                </Box>
              </CardContent>
            </GlassCard>
          ))}
        </Box>
      )}

      {tab === 'tickets' && ticketDetail && (
        <Box>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/help?tab=tickets')} sx={{ mb: 2 }}>
            Back to tickets
          </Button>
          <GlassCard sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">{ticketDetail.ticket_number}</Typography>
                  <Typography variant="h6">{ticketDetail.subject}</Typography>
                </Box>
                <Chip label={TICKET_STATUS_LABELS[ticketDetail.status]} color={TICKET_STATUS_COLORS[ticketDetail.status]} />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {TICKET_TYPE_LABELS[ticketDetail.ticket_type]}
                {ticketDetail.assigned_to_name ? ` · Assigned to ${ticketDetail.assigned_to_name}` : ''}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{ticketDetail.description}</Typography>
            </CardContent>
          </GlassCard>

          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Conversation
          </Typography>
          {ticketDetail.messages.map((m) => (
            <GlassCard key={m.id} sx={{ mb: 1, ml: m.is_staff_reply ? 0 : 2 }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="caption" color="text.secondary">
                  {m.author_name} · {new Date(m.created_at).toLocaleString()}
                  {m.is_staff_reply ? ' · Support' : ''}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{m.body}</Typography>
              </CardContent>
            </GlassCard>
          ))}

          {!['closed', 'resolved'].includes(ticketDetail.status) && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button variant="contained" endIcon={<SendIcon />} onClick={sendReply} sx={{ alignSelf: 'flex-end' }}>
                Send
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Raise Ticket */}
      {tab === 'raise' && (
        <GlassCard>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Raise a Support Ticket
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Could not find an answer in FAQs? Submit a ticket and our Customer Support team will assist you.
            </Typography>
            {ticketFormFields}
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              disabled={loading}
              onClick={() => submitTicket('support')}
            >
              Submit Ticket
            </Button>
          </CardContent>
        </GlassCard>
      )}

      {/* Feedback */}
      {tab === 'feedback' && (
        <GlassCard>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <FeedbackIcon color="primary" />
              <Typography variant="h6">Submit Feedback</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Share product suggestions, user experience feedback, or improvement recommendations.
            </Typography>
            {ticketFormFields}
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="contained" disabled={loading} onClick={() => submitTicket('feedback')}>
                Submit as Feedback
              </Button>
              <Button variant="outlined" disabled={loading} onClick={() => submitTicket('suggestion')}>
                Submit as Suggestion
              </Button>
            </Box>
          </CardContent>
        </GlassCard>
      )}

      {/* Complaint */}
      {tab === 'complaint' && (
        <GlassCard>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ReportProblemIcon color="error" />
              <Typography variant="h6">Submit a Complaint</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Report platform issues, service complaints, user concerns, or operational issues.
            </Typography>
            {ticketFormFields}
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 2 }}
              disabled={loading}
              onClick={() => submitTicket('complaint')}
            >
              Submit Complaint
            </Button>
          </CardContent>
        </GlassCard>
      )}

      <Dialog open={!!selectedFaq} onClose={() => setSelectedFaq(null)} maxWidth="md" fullWidth>
        {selectedFaq && (
          <>
            <DialogTitle>{selectedFaq.question}</DialogTitle>
            <DialogContent>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{selectedFaq.answer}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedFaq(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HelpCenter;
