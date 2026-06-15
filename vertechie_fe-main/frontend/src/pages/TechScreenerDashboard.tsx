/**
 * Tech Screener — Enterprise Verification Dashboard for HM-invited external candidates.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, Container, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert, Tabs, Tab, IconButton, Tooltip, Paper,
  List, ListItem, ListItemText, ListItemSecondaryAction, Grid, Card, Chip,
} from '@mui/material';
import { Refresh, PlayArrow, Undo, CheckCircle, Cancel, VerifiedUser } from '@mui/icons-material';
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

function groupByRole(tasks: ScreeningTask[]) {
  const groups: Record<string, { job_title: string; tasks: ScreeningTask[]; criteria?: ScreeningCriteria; jd_text?: string }> = {};
  tasks.forEach((t) => {
    const title = t.job_title || 'Unknown Role';
    const key = `${t.sourcing_request_id || t.job_id || title}`;
    if (!groups[key]) {
      groups[key] = { job_title: title, tasks: [], criteria: t.screening_criteria, jd_text: t.jd_text };
    }
    groups[key].tasks.push(t);
  });
  return Object.values(groups);
}

const TechScreenerDashboard: React.FC = () => {
  const [pool, setPool] = useState<Pool>('pending');
  const [tasks, setTasks] = useState<ScreeningTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ReturnType<typeof groupByRole>[0] | null>(null);
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
      const data = await screeningService.listEnterpriseTasks(pool);
      setTasks(data.items || []);
    } catch (e: unknown) {
      setSnack({ open: true, message: e instanceof Error ? e.message : 'Failed to load', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [pool]);

  useEffect(() => { load(); }, [load]);

  const groups = groupByRole(tasks);

  const handleClaim = async (taskId: string) => {
    try {
      await screeningService.claimTask(taskId);
      setSnack({ open: true, message: 'Task claimed', severity: 'success' });
      load();
    } catch (e: unknown) {
      setSnack({ open: true, message: e instanceof Error ? e.message : 'Claim failed', severity: 'error' });
    }
  };

  const handleRelease = async (taskId: string) => {
    try {
      await screeningService.releaseTask(taskId);
      load();
    } catch (e: unknown) {
      setSnack({ open: true, message: e instanceof Error ? e.message : 'Release failed', severity: 'error' });
    }
  };

  const openReview = async (task: ScreeningTask, readOnly = false) => {
    try {
      const full = await screeningService.getTask(task.id);
      setActiveTask(full);
      setActiveCriteria(full.screening_criteria);
      setReviewState(reviewStateFromTask(full.screening_criteria, full));
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
      setCompleteOpen(false);
      setActiveTask(null);
      setSnack({ open: true, message: 'Verification saved', severity: 'success' });
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
          <Typography variant="h4" fontWeight={700}>
            <VerifiedUser sx={{ verticalAlign: 'middle', mr: 1 }} />
            Enterprise Verification
          </Typography>
          <Typography color="text.secondary">Verify HM-invited external candidates</Typography>
        </Box>
        <Tooltip title="Refresh"><IconButton onClick={load} disabled={loading}><Refresh /></IconButton></Tooltip>
      </Box>

      <Tabs value={pool} onChange={(_, v) => setPool(v)} sx={{ mb: 2 }}>
        <Tab value="pending" label="Pending Screening" />
        <Tab value="selected" label="Selected Screening" />
        <Tab value="rejected" label="Rejected Screening" />
      </Tabs>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {groups.map((g) => (
          <Grid item xs={12} sm={6} md={4} key={g.job_title + g.tasks[0]?.id}>
            <Card sx={{ p: 2, cursor: 'pointer', '&:hover': { boxShadow: 4 } }} onClick={() => setSelectedGroup(g)}>
              <Typography variant="h6" fontWeight={600}>{g.job_title}</Typography>
              <Chip size="small" label={`${g.tasks.length} profile(s)`} sx={{ mt: 1 }} />
              <ScreeningCriteriaPanel criteria={g.criteria} compact />
            </Card>
          </Grid>
        ))}
        {groups.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 4 }}>
              <Typography align="center" color="text.secondary">No tasks in this bucket</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Dialog open={!!selectedGroup} onClose={() => setSelectedGroup(null)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedGroup?.job_title} — Profiles</DialogTitle>
        <DialogContent>
          {selectedGroup?.jd_text && (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>{selectedGroup.jd_text}</Typography>
          )}
          <ScreeningCriteriaPanel criteria={selectedGroup?.criteria} />
          <List dense>
            {(selectedGroup?.tasks || []).map((t) => (
              <ListItem key={t.id} divider>
                <ListItemText
                  primary={t.candidate_name || t.candidate_email || 'Candidate'}
                  secondary={[t.candidate_email, t.claimed_by_name].filter(Boolean).join(' · ')}
                />
                <ListItemSecondaryAction>
                  {pool === 'pending' && t.status === 'open' && (
                    <Button size="small" startIcon={<PlayArrow />} variant="contained" onClick={() => handleClaim(t.id)}>Claim</Button>
                  )}
                  {pool === 'pending' && t.status === 'claimed' && (
                    <>
                      <Button size="small" startIcon={<Undo />} onClick={() => handleRelease(t.id)} sx={{ mr: 1 }}>Release</Button>
                      <Button size="small" variant="contained" onClick={() => { openReview(t); setSelectedGroup(null); }}>Verify</Button>
                    </>
                  )}
                  {pool !== 'pending' && (
                    <Button size="small" onClick={() => openReview(t, true)}>View</Button>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions><Button onClick={() => setSelectedGroup(null)}>Close</Button></DialogActions>
      </Dialog>

      <Dialog open={completeOpen} onClose={() => setCompleteOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Enterprise Verification — {activeTask?.candidate_name || activeTask?.candidate_email}</DialogTitle>
        <DialogContent>
          {activeTask && (
            <ScreeningReviewForm
              task={activeTask}
              criteria={activeCriteria}
              state={reviewState}
              onChange={patchReview}
              commentsLabel="Comments (visible to HM who invited)"
              selectedLabel="Verified / Selected"
              readOnly={reviewReadOnly}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteOpen(false)}>Cancel</Button>
          {pool === 'pending' && !reviewReadOnly && (
            <Button variant="contained" color={reviewState.outcome === 'selected' ? 'success' : 'error'}
              startIcon={reviewState.outcome === 'selected' ? <CheckCircle /> : <Cancel />} onClick={handleComplete}>
              Confirm
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

export default TechScreenerDashboard;
