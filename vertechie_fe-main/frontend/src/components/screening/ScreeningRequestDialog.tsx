/**
 * HM dialog: submit JD/requirement for Requirements Team + Screener flow.
 */
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Chip, Box, Typography,
} from '@mui/material';
import screeningService, { ScreeningCriteria } from '../../services/screeningService';

interface Props {
  open: boolean;
  onClose: () => void;
  jobId?: string;
  jobTitle?: string;
  jobDescription?: string;
  onSuccess?: () => void;
}

const CHECK_OPTIONS = ['location', 'visa', 'tech'];

const ScreeningRequestDialog: React.FC<Props> = ({
  open, onClose, jobId, jobTitle, jobDescription, onSuccess,
}) => {
  const [title, setTitle] = useState(jobTitle || '');
  const [jdText, setJdText] = useState(jobDescription || '');
  const [notes, setNotes] = useState('');
  const [headcount, setHeadcount] = useState('');
  const [checks, setChecks] = useState<string[]>(['location', 'visa', 'tech']);
  const [techMandatory, setTechMandatory] = useState('');
  const [techOptional, setTechOptional] = useState('');
  const [locationNotes, setLocationNotes] = useState('');
  const [visaNotes, setVisaNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (open) {
      setTitle(jobTitle || '');
      setJdText(jobDescription || '');
    }
  }, [open, jobTitle, jobDescription]);

  const toggleCheck = (c: string) => {
    setChecks((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const criteria: ScreeningCriteria = {
        checks,
        location_notes: locationNotes || undefined,
        visa_notes: visaNotes || undefined,
        tech_mandatory: techMandatory.split(',').map((s) => s.trim()).filter(Boolean),
        tech_optional: techOptional.split(',').map((s) => s.trim()).filter(Boolean),
      };
      await screeningService.createSourcingRequest({
        title: title.trim(),
        job_id: jobId,
        jd_text: jdText,
        screening_criteria: criteria,
        notes: notes || undefined,
        headcount: headcount ? parseInt(headcount, 10) : undefined,
      });
      onSuccess?.();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Request Sourcing &amp; Screening</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Send this role to your company recruiter to source candidates, coordinate screening, and return
          vetted profiles to you.
        </Typography>
        {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
        <TextField fullWidth label="Role title" margin="dense" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField fullWidth multiline rows={4} label="Job description / requirements" margin="dense"
          value={jdText} onChange={(e) => setJdText(e.target.value)} />
        <TextField fullWidth label="Headcount" type="number" margin="dense" value={headcount} onChange={(e) => setHeadcount(e.target.value)} />
        <TextField fullWidth label="Notes for Requirements Team" margin="dense" value={notes} onChange={(e) => setNotes(e.target.value)} />

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Screening checks</Typography>
        <Box sx={{ mb: 1 }}>
          {CHECK_OPTIONS.map((c) => (
            <Chip key={c} label={c} clickable color={checks.includes(c) ? 'primary' : 'default'}
              onClick={() => toggleCheck(c)} sx={{ mr: 0.5 }} />
          ))}
        </Box>
        <TextField fullWidth label="Location requirements" margin="dense" value={locationNotes} onChange={(e) => setLocationNotes(e.target.value)} />
        <TextField fullWidth label="Visa / work authorization" margin="dense" value={visaNotes} onChange={(e) => setVisaNotes(e.target.value)} />
        <TextField fullWidth label="Tech mandatory (comma-separated)" margin="dense" value={techMandatory} onChange={(e) => setTechMandatory(e.target.value)} />
        <TextField fullWidth label="Tech optional (comma-separated)" margin="dense" value={techOptional} onChange={(e) => setTechOptional(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting || !title.trim()}>
          Submit Requirement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScreeningRequestDialog;
