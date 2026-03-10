/**
 * ScheduleInterviewModal - Unified interview scheduling dialog
 * Used from: Pipeline, Candidate Profile, View Applicants, ATS Scheduling page
 * Single shared component + POST /hiring/interviews API
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material';
import { getApiUrl } from '../../config/api';
import { API_ENDPOINTS } from '../../config/api';
import { interviewService } from '../../services/interviewService';

const convertLocalDateTimeToUTC = (dateStr: string, timeStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return localDate.toISOString();
};

/** Parse backend scheduled_at (UTC) to local date and time strings for form inputs */
const scheduledAtToFormValues = (scheduledAt: string): { date: string; time: string } => {
  let s = String(scheduledAt || '').trim();
  if (!s.includes('Z') && !s.includes('+') && !/[-+]\d{2}:?\d{2}$/.test(s)) {
    s = s.replace(' ', 'T');
    if (!s.endsWith('Z')) s += 'Z';
  }
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return { date: '', time: '' };
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return { date: `${y}-${m}-${day}`, time: `${h}:${min}` };
};

export interface ScheduleInterviewContext {
  applicationId?: string;
  candidateId?: string;
  candidateName?: string;
  candidateEmail?: string;
  jobId?: string;
  jobTitle?: string;
}

interface ApplicationOption {
  applicationId: string;
  candidateName: string;
  candidateEmail?: string;
  jobId: string;
  jobTitle: string;
}

export interface ScheduleInterviewModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  context?: ScheduleInterviewContext | null;
  /** When true, show candidate/application dropdown (for ATS Scheduling page) */
  allowSelectApplication?: boolean;
}

const defaultForm = {
  date: '',
  time: '',
  duration: 60,
  type: 'technical',
  notes: '',
};

interface ExistingInterview {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  interview_type: string;
  notes?: string;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  open,
  onClose,
  onSuccess,
  onError,
  context,
  allowSelectApplication = false,
}) => {
  const [form, setForm] = useState(defaultForm);
  const [scheduling, setScheduling] = useState(false);
  const [applicationOptions, setApplicationOptions] = useState<ApplicationOption[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>('');
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [existingInterview, setExistingInterview] = useState<ExistingInterview | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(false);

  const hasContext = context?.applicationId && context?.candidateName;
  const effectiveApplicationId = hasContext ? context.applicationId! : selectedApplicationId;
  const effectiveCandidateName = hasContext ? context.candidateName! : applicationOptions.find(a => a.applicationId === selectedApplicationId)?.candidateName ?? '';
  const isRescheduleMode = Boolean(existingInterview);

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setSelectedApplicationId('');
      setExistingInterview(null);
      return;
    }
    if (hasContext && context?.applicationId) {
      setCheckingExisting(true);
      interviewService.getMyInterviewsAsInterviewer(true)
        .then((list: any[]) => {
          const appId = String(context.applicationId);
          const found = (list || []).find((i: any) => String(i.application_id) === appId);
          if (found) {
            setExistingInterview({
              id: found.id,
              scheduled_at: found.scheduled_at,
              duration_minutes: found.duration_minutes ?? 60,
              interview_type: found.interview_type || 'technical',
              notes: found.notes,
            });
            const { date, time } = scheduledAtToFormValues(found.scheduled_at);
            setForm({
              date,
              time,
              duration: found.duration_minutes ?? 60,
              type: found.interview_type || 'technical',
              notes: found.notes || '',
            });
          } else {
            setExistingInterview(null);
          }
        })
        .catch(() => setExistingInterview(null))
        .finally(() => setCheckingExisting(false));
    } else {
      setExistingInterview(null);
    }
    if (allowSelectApplication && !hasContext) {
      setLoadingOptions(true);
      const token = localStorage.getItem('authToken');
      fetch(getApiUrl(API_ENDPOINTS.HIRING.PIPELINE_CANDIDATES), {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
        .then(res => res.ok ? res.json() : [])
        .then((data: any[]) => {
          const options: ApplicationOption[] = (data || []).map((c: any) => ({
            applicationId: c.application_id || c.id,
            candidateName: c.name || c.email?.split('@')?.[0] || 'Unknown',
            candidateEmail: c.email,
            jobId: c.job_id || '',
            jobTitle: c.job_title || c.role || 'Job',
          }));
          setApplicationOptions(options);
          if (options.length > 0) setSelectedApplicationId(options[0].applicationId);
        })
        .catch(() => setApplicationOptions([]))
        .finally(() => setLoadingOptions(false));
    }
  }, [open, allowSelectApplication, hasContext, context?.applicationId]);

  const handleSubmit = async () => {
    if (!form.date || !form.time) return;

    const token = localStorage.getItem('authToken');
    const scheduledAt = convertLocalDateTimeToUTC(form.date, form.time);

    if (existingInterview) {
      setScheduling(true);
      try {
        await interviewService.rescheduleInterview(existingInterview.id, {
          scheduled_at: scheduledAt,
          duration_minutes: form.duration,
          notes: form.notes || undefined,
        });
        onSuccess?.();
        onClose();
        setForm(defaultForm);
        setExistingInterview(null);
      } catch (e: any) {
        onError?.(e.message || 'Failed to reschedule. Please try again.');
      } finally {
        setScheduling(false);
      }
      return;
    }

    if (!effectiveApplicationId) return;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(effectiveApplicationId)) return;

    setScheduling(true);
    try {
      const meetingId = `interview-${Date.now()}`;
      const meetingLink = `${window.location.origin}/techie/lobby/${meetingId}?type=interview`;

      const response = await fetch(getApiUrl('/hiring/interviews'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application_id: effectiveApplicationId,
          interview_type: form.type,
          scheduled_at: scheduledAt,
          duration_minutes: form.duration,
          meeting_link: meetingLink,
          notes: form.notes || undefined,
        }),
      });

      if (response.ok) {
        onSuccess?.();
        onClose();
        setForm(defaultForm);
      } else {
        const err = await response.json().catch(() => ({}));
        let msg = `Failed to schedule (${response.status})`;
        if (response.status === 409) {
          const d = typeof err.detail === 'object' && err.detail?.message ? err.detail.message : err.detail;
          msg = d || 'This candidate already has an upcoming interview. Please reschedule the existing interview instead.';
        } else if (err.detail) {
          msg = typeof err.detail === 'string' ? err.detail : (err.detail?.message || msg);
        }
        onError?.(msg);
      }
    } catch (e: any) {
      console.error(e);
      onError?.(e.message || 'Network error. Please try again.');
    } finally {
      setScheduling(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {isRescheduleMode
          ? `Reschedule Interview – ${effectiveCandidateName}`
          : hasContext
          ? `Schedule Interview with ${context!.candidateName}`
          : allowSelectApplication
          ? 'Schedule Interview'
          : 'Schedule Interview'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {isRescheduleMode && (
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 1 }}>
                This candidate already has an upcoming interview. Reschedule it below.
              </Alert>
            </Grid>
          )}
          {checkingExisting && hasContext && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Checking for existing interview…</Typography>
            </Grid>
          )}
          {allowSelectApplication && !hasContext && (
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Candidate / Application</InputLabel>
                <Select
                  value={selectedApplicationId}
                  label="Candidate / Application"
                  onChange={(e) => setSelectedApplicationId(e.target.value)}
                  disabled={loadingOptions}
                >
                  {applicationOptions.map((opt) => (
                    <MenuItem key={opt.applicationId} value={opt.applicationId}>
                      {opt.candidateName} – {opt.jobTitle}
                    </MenuItem>
                  ))}
                </Select>
                {loadingOptions && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    Loading applications…
                  </Typography>
                )}
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Time"
              type="time"
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Duration</InputLabel>
              <Select
                value={form.duration}
                label="Duration"
                onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) }))}
              >
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={45}>45 minutes</MenuItem>
                <MenuItem value={60}>1 hour</MenuItem>
                <MenuItem value={90}>1.5 hours</MenuItem>
                <MenuItem value={120}>2 hours</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Interview Type</InputLabel>
              <Select
                value={form.type}
                label="Interview Type"
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              >
                <MenuItem value="phone">Phone Screening</MenuItem>
                <MenuItem value="video">Video Interview</MenuItem>
                <MenuItem value="technical">Technical Interview</MenuItem>
                <MenuItem value="behavioral">Behavioral Interview</MenuItem>
                <MenuItem value="panel">Panel Interview</MenuItem>
                <MenuItem value="onsite">Onsite Interview</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Add any notes or instructions for the interview..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            scheduling ||
            checkingExisting ||
            !form.date ||
            !form.time ||
            (!existingInterview && !effectiveApplicationId && !loadingOptions)
          }
          sx={{ bgcolor: '#0d47a1' }}
        >
          {scheduling ? <CircularProgress size={20} /> : isRescheduleMode ? 'Reschedule Interview' : 'Schedule Interview'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleInterviewModal;
