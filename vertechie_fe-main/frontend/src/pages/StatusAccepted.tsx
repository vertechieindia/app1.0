import React from 'react';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

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

const StatusAccepted = () => {
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
          <CheckCircleOutlineIcon
            sx={{
              fontSize: 64,
              color: 'success.main',
              mb: 3,
            }}
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 3, fontWeight: 700 }}
          >
            Account Accepted!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Congratulations! Your account has been verified and accepted. You can now access all features of the platform.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Welcome to our platform! We're excited to have you on board.
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
            Go to Dashboard
          </Button>
        </StatusPaper>
      </Box>
    </StatusContainer>
  );
};

export default StatusAccepted;

