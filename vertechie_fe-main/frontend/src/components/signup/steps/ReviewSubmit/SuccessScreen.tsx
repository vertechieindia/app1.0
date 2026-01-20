import React, { useEffect } from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

interface SuccessScreenProps {
  role?: string;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ role }) => {
  const navigate = useNavigate();

  // Auto-redirect to pending status page after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      // Clear any stale auth state that might cause issues
      // Navigate to pending verification page
      navigate('/status/processing', { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  const handleViewStatus = () => {
    navigate('/status/processing', { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={12}
          sx={{
            borderRadius: 4,
            p: 6,
            textAlign: 'center',
            background: 'white',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Success Icon */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: '#4caf50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 4,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 60, color: 'white' }} />
          </Box>

          {/* Success Message */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#4caf50',
              mb: 2,
              fontSize: { xs: '1.8rem', md: '2rem' },
            }}
          >
            Registration Successful!
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#666',
              mb: 2,
              fontSize: { xs: '0.95rem', md: '1rem' },
              lineHeight: 1.6,
            }}
          >
            Thank you for registering with VerTechie. Your account is being verified and you will receive a confirmation email shortly.
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#999',
              mb: 4,
              fontSize: '0.85rem',
            }}
          >
            You will be redirected to your status page in 5 seconds...
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={handleViewStatus}
              sx={{
                bgcolor: '#4caf50',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: 3,
                '&:hover': {
                  bgcolor: '#388e3c',
                  boxShadow: 4,
                },
              }}
            >
              Check Status
            </Button>
            <Button
              variant="outlined"
              onClick={handleBackToHome}
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#1565c0',
                  bgcolor: 'rgba(25, 118, 210, 0.04)',
                },
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SuccessScreen;

