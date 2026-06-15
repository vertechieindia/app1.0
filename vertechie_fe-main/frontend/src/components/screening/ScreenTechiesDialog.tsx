/**
 * HM: bulk email invites for "Screen the Techies" flow.
 */
import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Chip, Box, Typography, FormControlLabel, Checkbox, Link,
} from '@mui/material';
import screeningService, { ScreeningCriteria } from '../../services/screeningService';
import HmEmailSignatureSettings from './HmEmailSignatureSettings';

interface Props {
  open: boolean;
  onClose: () => void;
  companyId?: string;
  defaultTitle?: string;
  defaultJd?: string;
  onSuccess?: (result: { emails_sent: number }) => void;
}

const CHECK_OPTIONS = ['location', 'visa', 'tech'];

const ScreenTechiesDialog: React.FC<Props> = ({
  open, onClose, companyId, defaultTitle, defaultJd, onSuccess,
}) => {
  const [title, setTitle] = useState(defaultTitle || '');
  const [jdText, setJdText] = useState(defaultJd || '');
  const [emails, setEmails] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [enterpriseVerification, setEnterpriseVerification] = useState(true);
  const [checks, setChecks] = useState<string[]>(['location', 'visa', 'tech']);
  const [techMandatory, setTechMandatory] = useState('');
  const [techOptional, setTechOptional] = useState('');
  const [locationNotes, setLocationNotes] = useState('');
  const [visaNotes, setVisaNotes] = useState('');
  const [signatureOpen, setSignatureOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(defaultTitle || '');
      setJdText(defaultJd || '');
    }
  }, [open, defaultTitle, defaultJd]);

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
      const emailList = emails.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
      const result = await screeningService.screenTechies({
        title: title.trim(),
        jd_text: jdText || undefined,
        company_id: companyId,
        emails: emailList,
        screening_criteria: criteria,
        email_subject: emailSubject || undefined,
        email_body: emailBody || undefined,
        enterprise_verification: enterpriseVerification,
      });
      onSuccess?.({ emails_sent: result.emails_sent });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send invites');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Screen the Techies</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Invite external candidates by email. They sign up on VerTechie, get verified, then enter the
            screener or enterprise verification queue. Use the checkbox below to route profiles to Tech Screeners.
            {' '}<Link component="button" type="button" onClick={() => setSignatureOpen(true)}>Email signature settings</Link>
          </Typography>
          {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
          <TextField fullWidth label="Role / job title" margin="dense" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField fullWidth multiline rows={3} label="Requirements / JD" margin="dense"
            value={jdText} onChange={(e) => setJdText(e.target.value)} />
          <TextField fullWidth multiline rows={4} label="Candidate emails (one per line or comma-separated)" margin="dense" required
            value={emails} onChange={(e) => setEmails(e.target.value)} placeholder="candidate1@email.com&#10;candidate2@email.com" />
          <TextField fullWidth label="Email subject (optional)" margin="dense" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
          <TextField fullWidth multiline rows={4} label="Custom email body (optional — signup link appended automatically)" margin="dense"
            value={emailBody} onChange={(e) => setEmailBody(e.target.value)} />
          <FormControlLabel
            control={<Checkbox checked={enterpriseVerification} onChange={(e) => setEnterpriseVerification(e.target.checked)} />}
            label="Enterprise verification (Tech Screener dashboard)"
          />

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Screening criteria</Typography>
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
          <Button variant="contained" onClick={handleSubmit} disabled={submitting || !title.trim() || !emails.trim()}>
            Send Invites
          </Button>
        </DialogActions>
      </Dialog>
      <HmEmailSignatureSettings open={signatureOpen} onClose={() => setSignatureOpen(false)} />
    </>
  );
};

export default ScreenTechiesDialog;
