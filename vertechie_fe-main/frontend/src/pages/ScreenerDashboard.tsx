/**
 * Screener Dashboard — Jira-style task board with claim workflow.
 * Pending / Selected / Rejected groupings by job title.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, Container, Typography, Card, Grid, Chip, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert, Tabs, Tab, IconButton, Tooltip, Paper,
  List, ListItem, ListItemText, ListItemSecondaryAction,
} from '@mui/material';
import { Refresh, PlayArrow, Undo, CheckCircle, Cancel, Assignment } from '@mui/icons-material';
import screeningService, { ScreeningCriteria, ScreeningTask } from '../services/screeningService';
import ScreeningCriteriaPanel from '../components/screening/ScreeningCriteriaPanel';
import ScreeningReviewForm from '../components/screening/ScreeningReviewForm';
import {
  ScreeningReviewState,
  buildDetailedResults,
  initReviewState,
  reviewStateFromTask,
} from '../components/screening/screeningReviewUtils';

type Pool = 'pending' | 'selected' | 'rejected';

const ScreenerDashboard: React.FC = () => {
  const [pool, setPool] = useState<Pool>('pending');
  const [groups, setGroups] = useState<Array<{
    job_title: string;
    job_id?: string;
    sourcing_request_id?: string;
    screening_criteria?: ScreeningCriteria;
    jd_text?: string;
    task_count: number;
    tasks: ScreeningTask[];
  }>>([]);
  const [openTasks, setOpenTasks] = useState<ScreeningTask[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof groups[0] | null>(null);
  const [activeTask, setActiveTask] = useState<ScreeningTask | null>(null);
  const [activeCriteria, setActiveCriteria] = useState<ScreeningCriteria | undefined>();
  const [reviewState, setReviewState] = useState<ScreeningReviewState>(() => initReviewState());
  const [reviewReadOnly, setReviewReadOnly] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [grouped, openPool, statData] = await Promise.all([
        screeningService.getTasksGroupedByJob(pool),
        pool === 'pending' ? screeningService.listTasks({ pool: 'open' }) : Promise.resolve({ items: [], total: 0 }),
        screeningService.getStats(),
      ]);
      setGroups(grouped.groups || []);
      setOpenTasks(openPool.items || []);
      setStats(statData);
    } catch (e: unknown) {
      setSnack({ open: true, message: e instanceof Error ? e.message : 'Failed to load', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [pool]);

  useEffect(() => { load(); }, [load]);

  const handleClaim = async (taskId: string) => {
    try {
      await screeningService.claimTask(taskId);
      setSnack({ open: true, message: 'Task claimed — you are now working on it', severity: 'success' });
      load();
    } catch (e: unknown) {
      setSnack({ open: true, message: e instanceof Error ? e.message : 'Claim failed', severity: 'error' });
    }
  };

  const handleRelease = async (taskId: string) => {
    try {
      await screeningService.releaseTask(taskId);
      setSnack({ open: true, message: 'Task released back to pool', severity: 'success' });
      load();
    } catch (e: unknown) {
      setSnack({ open: true, message: e instanceof Error ? e.message : 'Release failed', severity: 'error' });
    }
  };

  const openReview = async (task: ScreeningTask, criteria?: ScreeningCriteria, readOnly = false) => {
    try {
      const full = await screeningService.getTask(task.id);
      const c = full.screening_criteria || criteria;
      setActiveTask(full);
      setActiveCriteria(c);
      setReviewState(reviewStateFromTask(c, full));
      setReviewReadOnly(readOnly || full.status === 'selected' || full.status === 'rejected');
      setCompleteOpen(true);
    } catch (e: unknown) {
      setSnack({ open: true, message: e instanceof Error ? e.message : 'Failed to load profile', severity: 'error' });
    }
  };

  const handleComplete = async () => {
    if (!activeTask) return;
    try {
      await screeningService.completeTask(activeTask.id, {
        outcome: reviewState.outcome,
        screener_comments: reviewState.comments,
        rejection_reason: reviewState.outcome === 'rejected' ? reviewState.rejectionReason : undefined,
        rejection_notes: reviewState.outcome === 'rejected' ? reviewState.rejectionNotes : undefined,
        checks_completed: reviewState.checks,
        detailed_results: buildDetailedResults(reviewState),
      });
      setSnack({
        open: true,
        message: reviewState.outcome === 'selected'
          ? 'Selected — awaiting recruiter submit to HM'
          : 'Rejected — recorded with reason',
        severity: 'success',
      });
      setCompleteOpen(false);
      setActiveTask(null);
      load();
    } catch (e: unknown) {
      setSnack({ open: true, message: e instanceof Error ? e.message : 'Failed', severity: 'error' });
    }
  };

  const patchReview = (patch: Partial<ScreeningReviewState>) => {
    setReviewState((prev) => ({ ...prev, ...patch }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Screener Portal</Typography>
          <Typography color="text.secondary">Claim tasks, screen profiles, select or reject</Typography>
        </Box>
        <Tooltip title="Refresh"><IconButton onClick={load} disabled={loading}><Refresh /></IconButton></Tooltip>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Pending', value: stats.pending_screenings ?? 0, color: '#FF9500' },
          { label: 'Selected', value: stats.selected ?? 0, color: '#00C853' },
          { label: 'Rejected', value: stats.rejected ?? 0, color: '#FF3B30' },
        ].map((s) => (
          <Grid item xs={12} sm={4} key={s.label}>
            <Card sx={{ p: 2, textAlign: 'center', borderTop: `4px solid ${s.color}` }}>
              <Typography variant="h4" fontWeight={700}>{s.value}</Typography>
              <Typography color="text.secondary">{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Tabs value={pool} onChange={(_, v) => setPool(v)} sx={{ mb: 2 }}>
        <Tab value="pending" label="Pending Screening" />
        <Tab value="selected" label="Selected Screening" />
        <Tab value="rejected" label="Rejected Screening" />
      </Tabs>

      {pool === 'pending' && openTasks.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            <Assignment sx={{ verticalAlign: 'middle', mr: 1 }} />
            Open Task Pool (claim to work)
          </Typography>
          <List dense>
            {openTasks.map((t) => (
              <ListItem key={t.id} divider>
                <ListItemText
                  primary={`${t.candidate_name || 'Candidate'} — ${t.job_title || 'Role'}`}
                  secondary={t.claimed_by_name ? `Claimed by ${t.claimed_by_name}` : 'Unclaimed'}
                />
                <ListItemSecondaryAction>
                  {t.status === 'open' ? (
                    <Button size="small" startIcon={<PlayArrow />} variant="contained" onClick={() => handleClaim(t.id)}>Claim</Button>
                  ) : t.status === 'claimed' ? (
                    <>
                      <Button size="small" startIcon={<Undo />} onClick={() => handleRelease(t.id)} sx={{ mr: 1 }}>Release</Button>
                      <Button size="small" variant="contained" onClick={() => openReview(t)}>Review</Button>
                    </>
                  ) : null}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Grid container spacing={2}>
        {groups.map((g) => (
          <Grid item xs={12} sm={6} md={4} key={`${g.job_id}-${g.sourcing_request_id}-${g.job_title}`}>
            <Card
              sx={{ p: 2, cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
              onClick={() => setSelectedJob(g)}
            >
              <Typography variant="h6" fontWeight={600}>{g.job_title}</Typography>
              <Chip size="small" label={`${g.task_count} profile(s)`} sx={{ mt: 1 }} />
              <ScreeningCriteriaPanel criteria={g.screening_criteria} compact />
            </Card>
          </Grid>
        ))}
        {groups.length === 0 && (
          <Grid item xs={12}><Typography align="center" color="text.secondary">No tasks in this bucket</Typography></Grid>
        )}
      </Grid>

      <Dialog open={!!selectedJob} onClose={() => setSelectedJob(null)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedJob?.job_title} — Requirements</DialogTitle>
        <DialogContent>
          {selectedJob?.jd_text && (
            <>
              <Typography variant="subtitle2">Job Description</Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>{selectedJob.jd_text}</Typography>
            </>
          )}
          <ScreeningCriteriaPanel criteria={selectedJob?.screening_criteria} />
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Profiles</Typography>
          <List dense>
            {(selectedJob?.tasks || []).map((t) => (
              <ListItem key={t.id} divider>
                <ListItemText
                  primary={t.candidate_name || t.candidate_email || 'Candidate'}
                  secondary={[t.candidate_email, t.candidate_source, t.claimed_by_name].filter(Boolean).join(' · ')}
                />
                {pool === 'pending' && t.status === 'open' && (
                  <Button size="small" onClick={() => handleClaim(t.id)}>Claim</Button>
                )}
                {pool === 'pending' && t.status === 'claimed' && (
                  <Button size="small" variant="contained" onClick={() => { openReview(t, selectedJob?.screening_criteria); setSelectedJob(null); }}>
                    Screen
                  </Button>
                )}
                {pool !== 'pending' && (
                  <Button size="small" onClick={() => openReview(t, selectedJob?.screening_criteria, true)}>View</Button>
                )}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions><Button onClick={() => setSelectedJob(null)}>Close</Button></DialogActions>
      </Dialog>

      <Dialog open={completeOpen} onClose={() => setCompleteOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Screen Candidate — {activeTask?.candidate_name || activeTask?.candidate_email}</DialogTitle>
        <DialogContent>
          {activeTask && (
            <ScreeningReviewForm
              task={activeTask}
              criteria={activeCriteria}
              state={reviewState}
              onChange={patchReview}
              readOnly={reviewReadOnly}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteOpen(false)}>Cancel</Button>
          {pool === 'pending' && !reviewReadOnly && (
            <Button
              variant="contained"
              color={reviewState.outcome === 'selected' ? 'success' : 'error'}
              startIcon={reviewState.outcome === 'selected' ? <CheckCircle /> : <Cancel />}
              onClick={handleComplete}
            >
              Confirm {reviewState.outcome === 'selected' ? 'Selected' : 'Rejected'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ScreenerDashboard;
