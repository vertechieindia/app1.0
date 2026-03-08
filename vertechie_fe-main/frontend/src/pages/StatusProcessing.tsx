import React, { useEffect, useCallback, useRef } from 'react';
import { Container, Box, Typography, Paper, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { getApiUrl } from '../config/api';
import { getRedirectPathForUser, isUserVerified } from '../utils/authRedirect';

const StatusContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
}));

const StatusPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  textAlign: 'center',
}));

const POLL_INTERVAL_MS = 15000;

const StatusProcessing = () => {
  const navigate = useNavigate();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkApprovalStatus = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    try {
      const response = await fetch(getApiUrl('/users/me'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) return false;
      const userData = await response.json();
      if (!isUserVerified(userData)) return false;
      localStorage.setItem('userData', JSON.stringify(userData));
      const path = getRedirectPathForUser(userData);
      if (path) {
        navigate(path, { replace: true });
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }, [navigate]);

  useEffect(() => {
    checkApprovalStatus();

    pollingRef.current = setInterval(() => {
      checkApprovalStatus();
    }, POLL_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkApprovalStatus();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [checkApprovalStatus]);

  const handleLogout = () => {
    localStorage.removeItem('vertechie_access_token');
    localStorage.removeItem('vertechie_refresh_token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <StatusContainer maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <StatusPaper elevation={3}>
          <HourglassEmptyIcon
            sx={{
              fontSize: 64,
              color: 'warning.main',
              mb: 3,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 1,
                },
                '50%': {
                  opacity: 0.5,
                },
              },
            }}
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 3, fontWeight: 700 }}
          >
            Your Account is Being Processed
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Your account is currently under review. Our team is verifying your information and will get back to you shortly.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This process typically takes 1-2 business days. We appreciate your patience as we ensure the quality and authenticity of our platform.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              borderRadius: '50px',
              px: 4,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            Logout
          </Button>
        </StatusPaper>
      </Box>
    </StatusContainer>
  );
};

export default StatusProcessing;

