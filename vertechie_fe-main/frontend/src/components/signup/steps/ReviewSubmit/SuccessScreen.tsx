import React from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

interface SuccessScreenProps {
  role?: string;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ role }) => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
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
              mb: 4,
              fontSize: { xs: '0.95rem', md: '1rem' },
              lineHeight: 1.6,
            }}
          >
            Thank you for registering with VerTechie. Your account is being verified and you will receive a confirmation email shortly.
          </Typography>

          {/* Back to Home Button */}
          <Button
            variant="contained"
            onClick={handleBackToHome}
            sx={{
              bgcolor: '#1976d2',
              color: 'white',
              px: 5,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: 3,
              '&:hover': {
                bgcolor: '#1565c0',
                boxShadow: 4,
              },
            }}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default SuccessScreen;

