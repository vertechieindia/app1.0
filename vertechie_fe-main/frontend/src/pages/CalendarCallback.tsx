/**
 * OAuth callback for Google/Microsoft calendar connect.
 * URL: /calendar/callback/google or /calendar/callback/microsoft
 * Reads code & state from query, POSTs to backend, then redirects to ATS calendar.
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { calendarSyncService } from '../services/calendarSyncService';

const CalendarCallback: React.FC<{ provider: 'google' | 'microsoft' }> = ({ provider }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    if (!code || !state) {
      setStatus('error');
      setMessage('Missing code or state from redirect.');
      return;
    }
    const post = provider === 'google'
      ? calendarSyncService.postCallbackGoogle(code, state)
      : calendarSyncService.postCallbackMicrosoft(code, state);
    post
      .then(() => {
        setStatus('success');
        setMessage(provider === 'google' ? 'Google Calendar connected.' : 'Microsoft Calendar connected.');
        setTimeout(() => navigate('/techie/ats/calendar', { replace: true }), 1500);
      })
      .catch((err: any) => {
        setStatus('error');
        setMessage(err?.message || 'Failed to connect calendar.');
      });
  }, [provider, searchParams, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', p: 3 }}>
      {status === 'loading' && (
        <>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography>Connecting {provider === 'google' ? 'Google' : 'Microsoft'} Calendar...</Typography>
        </>
      )}
      {status === 'success' && (
        <>
          <Typography color="primary" fontWeight={600}>{message}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Redirecting to calendar...</Typography>
        </>
      )}
      {status === 'error' && (
        <>
          <Alert severity="error" sx={{ maxWidth: 400 }}>{message}</Alert>
          <Typography variant="body2" sx={{ mt: 2, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/techie/ats/calendar')}>
            Back to Calendar
          </Typography>
        </>
      )}
    </Box>
  );
};

export default CalendarCallback;
