/**
 * HM email signature for screening invite emails.
 */
import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Alert,
} from '@mui/material';
import screeningService from '../../services/screeningService';

interface Props {
  open: boolean;
  onClose: () => void;
}

const HmEmailSignatureSettings: React.FC<Props> = ({ open, onClose }) => {
  const [senderName, setSenderName] = useState('');
  const [senderTitle, setSenderTitle] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [signatureHtml, setSignatureHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setMessage(null);
    screeningService.getEmailSignature()
      .then((sig) => {
        setSenderName(sig.sender_name || '');
        setSenderTitle(sig.sender_title || '');
        setSenderPhone(sig.sender_phone || '');
        setSignatureHtml(sig.signature_html || '');
      })
      .catch((e: Error) => setMessage({ type: 'error', text: e.message }))
      .finally(() => setLoading(false));
  }, [open]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await screeningService.updateEmailSignature({
        sender_name: senderName,
        sender_title: senderTitle,
        sender_phone: senderPhone,
        signature_html: signatureHtml,
      });
      setMessage({ type: 'success', text: 'Signature saved' });
    } catch (e: unknown) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Email Signature</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Appended to screening invite emails sent to candidates.
        </Typography>
        {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}
        <TextField fullWidth label="Your name" margin="dense" value={senderName} onChange={(e) => setSenderName(e.target.value)} disabled={loading} />
        <TextField fullWidth label="Title" margin="dense" value={senderTitle} onChange={(e) => setSenderTitle(e.target.value)} disabled={loading} />
        <TextField fullWidth label="Phone" margin="dense" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} disabled={loading} />
        <TextField fullWidth multiline rows={4} label="Signature (HTML allowed)" margin="dense"
          value={signatureHtml} onChange={(e) => setSignatureHtml(e.target.value)} disabled={loading} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving || loading}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HmEmailSignatureSettings;
