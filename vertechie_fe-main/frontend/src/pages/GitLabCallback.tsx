/**
 * GitLab OAuth Callback Page
 * Handles the redirect from GitLab after user authorization.
 * Exchanges the authorization code for access token via backend.
 * Shows loading until the API responds; only then shows success or error.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { api } from '../services/apiClient';
import { API_ENDPOINTS } from '../config/api';

const GitLabIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
  </svg>
);

const GitLabCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting GitLab...');
  const [username, setUsername] = useState<string | null>(null);
  const callbackDone = useRef(false);

  useEffect(() => {
    if (callbackDone.current) return;
    callbackDone.current = true;

    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        setStatus('error');
        setMessage(errorDescription || `GitLab authorization failed: ${error}`);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Missing authorization code or state. Please try connecting again.');
        return;
      }

      const storedState = sessionStorage.getItem('gitlab_oauth_state');
      if (storedState !== state) {
        setStatus('error');
        setMessage('Invalid OAuth state. Please try connecting again.');
        sessionStorage.removeItem('gitlab_oauth_state');
        return;
      }

      sessionStorage.removeItem('gitlab_oauth_state');

      // Keep loading state; only switch to success/error after API responds
      setMessage('Connecting your account...');

      try {
        const response = await api.post<{ status: string; username: string; user_id: string }>(
          API_ENDPOINTS.GITHUB_GITLAB.GITLAB_CALLBACK,
          { code, state }
        );

        if (response.status === 'connected') {
          setStatus('success');
          setUsername(response.username);
          setMessage(`Successfully connected as ${response.username}!`);
          setTimeout(() => navigate('/techie/profile', { replace: true }), 2000);
        } else {
          setStatus('error');
          setMessage('Unexpected response from server. Please try again.');
        }
      } catch (err: unknown) {
        setStatus('error');
        const errorMsg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
          || (err as Error)?.message
          || 'Failed to complete GitLab authorization';
        setMessage(errorMsg);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        p: 3,
      }}
    >
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 3,
          p: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        {status === 'loading' && (
          <>
            <CircularProgress size={48} sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              Connecting GitLab
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {message}
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
              Please wait, this may take a moment.
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <Box sx={{ mb: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 64, color: '#fc6d26' }} />
            </Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#fc6d26' }}>
              GitLab Connected!
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <GitLabIcon />
              <Typography variant="body1" fontWeight={600}>
                {username}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Redirecting to your profile...
            </Typography>
          </>
        )}

        {status === 'error' && (
          <>
            <Box sx={{ mb: 3 }}>
              <ErrorOutlineIcon sx={{ fontSize: 64, color: '#d32f2f' }} />
            </Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#d32f2f' }}>
              Connection Failed
            </Typography>
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              {message}
            </Alert>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/techie/profile', { replace: true })}
              >
                Go to Profile
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/techie/profile', { replace: true })}
                sx={{ bgcolor: '#fc6d26', '&:hover': { bgcolor: '#e24329' } }}
              >
                Try Again
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default GitLabCallback;
