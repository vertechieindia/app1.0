/**
 * Requirements Admin Dashboard — source candidates, manage sourcing requests, submit to screener/HM.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, Container, Typography, Card, Chip, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Snackbar, Alert, Tabs, Tab, IconButton, Tooltip,
  FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Stack,
  useMediaQuery, useTheme,
} from '@mui/material';
import { Refresh, Send, CheckCircle, PersonAdd } from '@mui/icons-material';
import screeningService, { SourcingRequest } from '../services/screeningService';

const REQUEST_STATUS: Record<string, { label: string; color: 'default' | 'warning' | 'info' | 'success' | 'error' }> = {
  pending: { label: 'Pending', color: 'warning' },
  in_progress: { label: 'In Progress', color: 'info' },
  screening: { label: 'With Screener', color: 'info' },
  submitted_to_hm: { label: 'Submitted to HM', color: 'success' },
  completed: { label: 'Completed', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'error' },
};

const TASK_STATUS: Record<string, { label: string; color: 'default' | 'warning' | 'info' | 'success' | 'error' }> = {
  pending_req_team: { label: 'Awaiting Recruiter', color: 'warning' },
  open: { label: 'Open Pool', color: 'info' },
  claimed: { label: 'In Screening', color: 'info' },
  selected: { label: 'Selected', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
};

function formatRequestStatus(status: string) {
  return REQUEST_STATUS[status] || { label: status.replace(/_/g, ' '), color: 'default' as const };
}

function formatTaskStatus(key: string) {
  return TASK_STATUS[key] || { label: key.replace(/_/g, ' '), color: 'default' as const };
}

function taskCount(r: SourcingRequest, status: string): number {
  return r.task_counts?.[status] ?? 0;
}

function totalTaskCount(r: SourcingRequest): number {
  return Object.values(r.task_counts || {}).reduce((sum, n) => sum + n, 0);
}

/** Enforce workflow: Add Candidate → To Screener → (screener) → Submit to HM */
function getRecruiterActionState(r: SourcingRequest) {
  const terminal = ['submitted_to_hm', 'completed', 'cancelled'].includes(r.status);
  const pendingReqTeam = taskCount(r, 'pending_req_team');
  const selected = taskCount(r, 'selected');

  const canAddCandidate = !terminal;
  const canSendToScreener = !terminal && pendingReqTeam > 0;
  const canSubmitToHm = !terminal && selected > 0;

  let sendToScreenerHint = 'Send candidates to the company screener pool';
  if (terminal) sendToScreenerHint = 'This request is already closed';
  else if (pendingReqTeam === 0) {
    sendToScreenerHint = totalTaskCount(r) === 0
      ? 'Add at least one candidate first'
      : 'No candidates waiting — send new ones via Add Candidate, or wait for screener';
  }

  let submitToHmHint = 'Return screener-selected profiles to the Hiring Manager';
  if (terminal) submitToHmHint = 'Already submitted to the Hiring Manager';
  else if (selected === 0) submitToHmHint = 'Wait until the screener marks at least one candidate as selected';

  let addCandidateHint = 'Add a sourced candidate to this requirement';
  if (terminal) addCandidateHint = 'This request is closed — no more candidates can be added';

  return {
    canAddCandidate,
    canSendToScreener,
    canSubmitToHm,
    addCandidateHint,
    sendToScreenerHint,
    submitToHmHint,
  };
}

/** Wrap disabled buttons so MUI Tooltip still works */
const ActionButton: React.FC<{
  title: string;
  disabled?: boolean;
  children: React.ReactElement;
}> = ({ title, disabled, children }) => (
  <Tooltip title={title}>
    <span>{disabled ? React.cloneElement(children, { disabled: true }) : children}</span>
  </Tooltip>
);

const RequirementsAdminDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tab, setTab] = useState(0);
  const [requests, setRequests] = useState<SourcingRequest[]>([]);
  const [companyScopeLabel, setCompanyScopeLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });
  const [selected, setSelected] = useState<SourcingRequest | null>(null);
  const [addCandidateOpen, setAddCandidateOpen] = useState(false);
  const [candidateForm, setCandidateForm] = useState({
    candidate_name: '', candidate_email: '', candidate_source: '', candidate_resume_url: '',
    candidate_linkedin_url: '', send_to_screener: false,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await screeningService.listSourcingRequests();
      setRequests(data.items || []);
    } catch (e: unknown) {
      setSnack({ open: true, message: e instanceof Error ? e.message : 'Failed to load', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('userData');
      if (!raw) return;
      const user = JSON.parse(raw);
      const staff = (user.screening_staff || []) as Array<{ staff_role: string; company_name: string }>;
      const recruiter = staff.filter((s) => s.staff_role === 'recruiter');
      if (recruiter.length === 1) {
        setCompanyScopeLabel(recruiter[0].company_name);
      } else if (recruiter.length > 1) {
        setCompanyScopeLabel(`${recruiter.length} companies`);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSendToScreener = async (id: string) => {
    try {
      const r = await screeningService.sendToScreener(id);
      setSnack({ open: true, message: `${r.updated_tasks} task(s) sent to screener pool`, severity: 'success' });
      load();
    } catch (e: unknown) {
      setSnack({ open: true, message: e instanceof Error ? e.message : 'Failed', severity: 'error' });
    }
  };

  const handleSubmitToHm = async (id: string) => {
    try {
      const r = await screeningService.submitToHm(id);
      setSnack({ open: true, message: `Submitted ${r.selected_count} vetted profile(s) to Hiring Manager`, severity: 'success' });
      load();
    } catch (e: unknown) {
      setSnack({ open: true, message: e instanceof Error ? e.message : 'Failed', severity: 'error' });
    }
  };

  const handleAddCandidate = async () => {
    if (!selected) return;
    try {
      await screeningService.createTask({
        sourcing_request_id: selected.id,
        job_id: selected.job_id || undefined,
        ...candidateForm,
      });
      setSnack({ open: true, message: 'Candidate added', severity: 'success' });
      setAddCandidateOpen(false);
      setCandidateForm({
        candidate_name: '', candidate_email: '', candidate_source: '', candidate_resume_url: '',
        candidate_linkedin_url: '', send_to_screener: false,
      });
      load();
    } catch (e: unknown) {
      setSnack({ open: true, message: e instanceof Error ? e.message : 'Failed', severity: 'error' });
    }
  };

  const filtered = requests.filter((r) => {
    if (tab === 0) return ['pending', 'in_progress'].includes(r.status);
    if (tab === 1) return r.status === 'screening';
    if (tab === 2) return ['submitted_to_hm', 'completed'].includes(r.status);
    return true;
  });

  const displayRequests = tab === 3 ? requests : filtered;

  const renderTaskChips = (r: SourcingRequest) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {Object.entries(r.task_counts || {}).map(([k, v]) => {
        const meta = formatTaskStatus(k);
        return (
          <Chip
            key={k}
            size="small"
            label={`${meta.label}: ${v}`}
            color={meta.color}
            sx={{ maxWidth: '100%', '& .MuiChip-label': { whiteSpace: 'normal', lineHeight: 1.2, py: 0.25 } }}
          />
        );
      })}
      {Object.keys(r.task_counts || {}).length === 0 && (
        <Typography variant="caption" color="text.secondary">No tasks yet</Typography>
      )}
    </Box>
  );

  const renderActions = (r: SourcingRequest, stacked = false) => {
    const actions = getRecruiterActionState(r);
    const btnSx = stacked ? { width: '100%', justifyContent: 'flex-start' } : { mr: 1, mb: { xs: 0.5, md: 0 } };
    return (
      <Stack direction={stacked ? 'column' : 'row'} spacing={stacked ? 1 : 0} flexWrap="wrap" useFlexGap justifyContent={stacked ? 'stretch' : 'flex-end'}>
        <ActionButton title={actions.addCandidateHint} disabled={!actions.canAddCandidate}>
          <Button
            size="small"
            startIcon={<PersonAdd />}
            onClick={() => { setSelected(r); setAddCandidateOpen(true); }}
            sx={btnSx}
          >
            Add Candidate
          </Button>
        </ActionButton>
        <ActionButton title={actions.sendToScreenerHint} disabled={!actions.canSendToScreener}>
          <Button
            size="small"
            startIcon={<Send />}
            onClick={() => handleSendToScreener(r.id)}
            sx={btnSx}
          >
            To Screener
          </Button>
        </ActionButton>
        <ActionButton title={actions.submitToHmHint} disabled={!actions.canSubmitToHm}>
          <Button
            size="small"
            variant="contained"
            startIcon={<CheckCircle />}
            onClick={() => handleSubmitToHm(r.id)}
            sx={stacked ? { width: '100%' } : undefined}
          >
            Submit to HM
          </Button>
        </ActionButton>
      </Stack>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3, pb: { xs: 12, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {companyScopeLabel ? `${companyScopeLabel} — Recruiter` : 'Requirements Admin'}
          </Typography>
          <Typography color="text.secondary">
            {companyScopeLabel
              ? 'Source candidates for your company, coordinate screening, submit vetted profiles to HM'
              : 'Source candidates, coordinate screening, submit vetted profiles to HM'}
          </Typography>
        </Box>
        <Tooltip title="Refresh"><IconButton onClick={load} disabled={loading}><Refresh /></IconButton></Tooltip>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2 }}
        variant={isMobile ? 'scrollable' : 'standard'}
        scrollButtons={isMobile ? 'auto' : false}
        allowScrollButtonsMobile
      >
        <Tab label={isMobile ? 'In Progress' : 'Incoming / In Progress'} />
        <Tab label="With Screener" />
        <Tab label={isMobile ? 'Submitted' : 'Submitted to HM'} />
        <Tab label="All" />
      </Tabs>

      {isMobile ? (
        <Stack spacing={2}>
          {displayRequests.map((r) => {
            const statusMeta = formatRequestStatus(r.status);
            return (
              <Card key={r.id} sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography fontWeight={600} sx={{ wordBreak: 'break-word' }}>
                      {r.title || r.job_title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {r.created_at?.slice(0, 10)}
                    </Typography>
                  </Box>
                  <Chip size="small" label={statusMeta.label} color={statusMeta.color} />
                </Box>
                <Box sx={{ mb: 2 }}>{renderTaskChips(r)}</Box>
                {renderActions(r, true)}
              </Card>
            );
          })}
          {displayRequests.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">No sourcing requests</Typography>
            </Paper>
          )}
        </Stack>
      ) : (
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <TableCell>Role / Title</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Status</TableCell>
              <TableCell>Tasks</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayRequests.map((r) => {
              const statusMeta = formatRequestStatus(r.status);
              return (
              <TableRow key={r.id} hover>
                <TableCell sx={{ minWidth: 160 }}>
                  <Typography fontWeight={600}>{r.title || r.job_title}</Typography>
                  <Typography variant="caption" color="text.secondary">{r.created_at?.slice(0, 10)}</Typography>
                </TableCell>
                <TableCell>
                  <Chip size="small" label={statusMeta.label} color={statusMeta.color} />
                </TableCell>
                <TableCell sx={{ minWidth: 180 }}>{renderTaskChips(r)}</TableCell>
                <TableCell align="right" sx={{ minWidth: 320 }}>
                  {renderActions(r, false)}
                </TableCell>
              </TableRow>
            );
            })}
            {displayRequests.length === 0 && (
              <TableRow><TableCell colSpan={4} align="center">No sourcing requests</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      )}

      <Dialog open={addCandidateOpen} onClose={() => setAddCandidateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Candidate — {selected?.title}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" margin="dense" value={candidateForm.candidate_name}
            onChange={(e) => setCandidateForm({ ...candidateForm, candidate_name: e.target.value })} />
          <TextField fullWidth label="Email" margin="dense" value={candidateForm.candidate_email}
            onChange={(e) => setCandidateForm({ ...candidateForm, candidate_email: e.target.value })} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Source</InputLabel>
            <Select label="Source" value={candidateForm.candidate_source}
              onChange={(e) => setCandidateForm({ ...candidateForm, candidate_source: e.target.value })}>
              <MenuItem value="platform">Platform</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
              <MenuItem value="dice">Dice</MenuItem>
              <MenuItem value="monster">Monster</MenuItem>
              <MenuItem value="resume_upload">Resume Upload</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth label="Resume URL" margin="dense" value={candidateForm.candidate_resume_url}
            onChange={(e) => setCandidateForm({ ...candidateForm, candidate_resume_url: e.target.value })} />
          <TextField fullWidth label="LinkedIn URL" margin="dense" value={candidateForm.candidate_linkedin_url}
            onChange={(e) => setCandidateForm({ ...candidateForm, candidate_linkedin_url: e.target.value })} />
          <FormControlLabel control={<Checkbox checked={candidateForm.send_to_screener}
            onChange={(e) => setCandidateForm({ ...candidateForm, send_to_screener: e.target.checked })} />}
            label="Send directly to screener pool" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddCandidateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCandidate}>Add</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default RequirementsAdminDashboard;
