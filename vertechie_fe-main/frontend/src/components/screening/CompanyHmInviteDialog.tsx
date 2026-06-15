/**
 * Company admin: bulk invite employees as Hiring Managers.
 */
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Alert,
} from '@mui/material';
import screeningService from '../../services/screeningService';

interface Props {
  open: boolean;
  onClose: () => void;
  companyId: string;
  companyName?: string;
  onSuccess?: (count: number) => void;
}

const CompanyHmInviteDialog: React.FC<Props> = ({ open, onClose, companyId, companyName, onSuccess }) => {
  const [emails, setEmails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    setError('');
    setResult('');
    setSubmitting(true);
    try {
      const emailList = emails.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
      const res = await screeningService.inviteCompanyHms(companyId, emailList);
      setResult(`Invited ${res.invited} — ${res.emails_sent} email(s) sent`);
      onSuccess?.(res.emails_sent);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send invites');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Invite Hiring Managers{companyName ? ` — ${companyName}` : ''}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Send signup invites to employees who will act as Hiring Managers for this company.
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {result && <Alert severity="success" sx={{ mb: 2 }}>{result}</Alert>}
        <TextField fullWidth multiline rows={5} label="Email addresses" margin="dense" required
          value={emails} onChange={(e) => setEmails(e.target.value)}
          placeholder="hm1@company.com&#10;hm2@company.com" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting || !emails.trim()}>
          Send Invites
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyHmInviteDialog;
