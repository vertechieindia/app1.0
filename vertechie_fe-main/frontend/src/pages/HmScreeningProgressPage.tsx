/**
 * HM dashboard: Screen-the-Techies invites + Get Help to Source / sourcing outcomes.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, Container, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Tooltip, Paper, Snackbar, Alert, Tabs, Tab,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import screeningService, { ScreeningInviteProgress, ScreeningTask, SourcingRequest } from '../services/screeningService';
import { formatDetailedResults } from '../components/screening/screeningReviewUtils';

const INVITE_STATUS: Record<string, { label: string; color: 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info' }> = {
  invite_sent: { label: 'Invite Sent', color: 'info' },
  signup_started: { label: 'Signup Started', color: 'primary' },
  signup_submitted: { label: 'Submitted for Review', color: 'warning' },
  approved: { label: 'Profile Approved', color: 'success' },
  denied: { label: 'Profile Denied', color: 'error' },
  screening_pending: { label: 'Screening Pending', color: 'warning' },
  screening_selected: { label: 'Selected', color: 'success' },
  screening_rejected: { label: 'Rejected', color: 'error' },
};

const TASK_STATUS: Record<string, 'default' | 'success' | 'error' | 'warning' | 'info'> = {
  pending_req_team: 'warning',
  open: 'info',
  claimed: 'info',
  selected: 'success',
  rejected: 'error',
};

const HmScreeningProgressPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [invites, setInvites] = useState<ScreeningInviteProgress[]>([]);
  const [requests, setRequests] = useState<SourcingRequest[]>([]);
  const [tasks, setTasks] = useState<ScreeningTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 0) {
        const data = await screeningService.listInvites();
        setInvites(data.items || []);
      } else {
        const data = await screeningService.listHmSourcingResults();
        setRequests(data.requests || []);
        setTasks(data.tasks || []);
      }
    } catch (e: unknown) {
      setSnack({ open: true, message: e instanceof Error ? e.message : 'Failed to load', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  const fmt = (d?: string) => (d ? new Date(d).toLocaleString() : '—');

  const taskTitle = (t: ScreeningTask) => {
    const sr = requests.find((r) => r.id === t.sourcing_request_id);
    return t.job_title || sr?.title || '—';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Screening Progress</Typography>
          <Typography color="text.secondary">
            Track Screen the Techies invites and Get Help to Source / sourcing outcomes
          </Typography>
        </Box>
        <Tooltip title="Refresh"><IconButton onClick={load} disabled={loading}><Refresh /></IconButton></Tooltip>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Screen the Techies" />
        <Tab label="Get Help to Source" />
      </Tabs>

      {tab === 0 && (
        <Card>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Invite Sent</TableCell>
                  <TableCell>Signup</TableCell>
                  <TableCell>Reviewed</TableCell>
                  <TableCell>Screening Results</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invites.map((inv) => {
                  const meta = INVITE_STATUS[inv.status] || { label: inv.status, color: 'default' as const };
                  return (
                    <TableRow key={inv.id} hover>
                      <TableCell>{inv.candidate_email}</TableCell>
                      <TableCell>{inv.job_title || '—'}</TableCell>
                      <TableCell><Chip size="small" label={meta.label} color={meta.color} /></TableCell>
                      <TableCell>{fmt(inv.invite_sent_at)}</TableCell>
                      <TableCell>{fmt(inv.signup_submitted_at || inv.signup_started_at)}</TableCell>
                      <TableCell>{fmt(inv.reviewed_at)}</TableCell>
                      <TableCell>
                        {(() => {
                          const lines = formatDetailedResults(inv.detailed_results);
                          if (lines.length === 0) return '—';
                          return (
                            <Typography variant="caption" component="div">
                              {lines.map((line) => <span key={line}>{line}<br /></span>)}
                            </Typography>
                          );
                        })()}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {invites.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No screening invites yet. Use &quot;Screen the Techies&quot; from Job Postings.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {tab === 1 && (
        <>
          <Alert severity="info" sx={{ mb: 2 }}>
            Selected profiles appear here after your company screener completes screening and the recruiter clicks
            &quot;Submit to HM&quot;. Candidates tied to a job application also move to{' '}
            <strong>Pipeline → Shortlisted for Screening</strong>.
          </Alert>
          <Card sx={{ mb: 2 }}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Request</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Task counts</TableCell>
                    <TableCell>Submitted to HM</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell>
                        <Typography fontWeight={600}>{r.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{fmt(r.created_at)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={r.status} color={r.status === 'submitted_to_hm' ? 'success' : 'warning'} />
                      </TableCell>
                      <TableCell>
                        {Object.entries(r.task_counts || {}).map(([k, v]) => (
                          <Chip key={k} size="small" label={`${k}: ${v}`} sx={{ mr: 0.5, mb: 0.5 }} />
                        ))}
                      </TableCell>
                      <TableCell>{fmt(r.submitted_to_hm_at)}</TableCell>
                    </TableRow>
                  ))}
                  {requests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No sourcing requests yet. Use &quot;Get Help to Source&quot; from Job Postings.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>Candidate profiles</Typography>
          <Card>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Candidate</TableCell>
                    <TableCell>Role / Request</TableCell>
                    <TableCell>Screening status</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Screening results</TableCell>
                    <TableCell>Screener notes</TableCell>
                    <TableCell>In job ATS?</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((t) => (
                    <TableRow key={t.id} hover>
                      <TableCell>
                        <Typography fontWeight={500}>{t.candidate_name || '—'}</Typography>
                        <Typography variant="caption" color="text.secondary">{t.candidate_email}</Typography>
                      </TableCell>
                      <TableCell>{taskTitle(t)}</TableCell>
                      <TableCell>
                        <Chip size="small" label={t.status} color={TASK_STATUS[t.status] || 'default'} />
                      </TableCell>
                      <TableCell>{t.candidate_source || '—'}</TableCell>
                      <TableCell>
                        {(() => {
                          const lines = formatDetailedResults(t.detailed_results);
                          if (lines.length === 0) return '—';
                          return (
                            <Typography variant="caption" component="div">
                              {lines.map((line) => <span key={line}>{line}<br /></span>)}
                            </Typography>
                          );
                        })()}
                      </TableCell>
                      <TableCell>{t.screener_comments || '—'}</TableCell>
                      <TableCell>
                        {t.application_id ? (
                          <Chip size="small" color="success" label="Pipeline (shortlisted)" />
                        ) : (
                          <Typography variant="caption" color="text.secondary">Sourced profile only</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {tasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No candidates yet. Your company recruiter must add profiles, then send to screener.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}

      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default HmScreeningProgressPage;
