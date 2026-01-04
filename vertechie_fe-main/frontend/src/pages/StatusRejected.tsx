import React from 'react';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';

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

const StatusRejected = () => {
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
          <CancelIcon
            sx={{
              fontSize: 64,
              color: 'error.main',
              mb: 3,
            }}
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 3, fontWeight: 700 }}
          >
            Account Not Approved
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Unfortunately, your account application was not approved at this time. This could be due to incomplete information or verification issues.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            If you believe this is an error, please contact our support team for assistance.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/contact')}
              sx={{
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              Contact Support
            </Button>
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
          </Box>
        </StatusPaper>
      </Box>
    </StatusContainer>
  );
};

export default StatusRejected;

