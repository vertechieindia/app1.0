import React from 'react';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

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

const StatusProcessing = () => {
  const navigate = useNavigate();

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
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            This process typically takes 1-2 business days. We appreciate your patience as we ensure the quality and authenticity of our platform.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              borderRadius: '50px',
              px: 4,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            Return to Home
          </Button>
        </StatusPaper>
      </Box>
    </StatusContainer>
  );
};

export default StatusProcessing;

