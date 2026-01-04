import React from 'react';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const SuccessContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
}));

const SuccessPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  textAlign: 'center',
}));

const SignupSuccess = () => {
  const navigate = useNavigate();

  return (
    <SuccessContainer maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <SuccessPaper elevation={3}>
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
            Thank You for Your Interest!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Your profile is under review. Our team will verify your information and get back to you shortly.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Please note that this process may take 1-2 business days. We appreciate your patience as we ensure the quality and authenticity of our platform.
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
        </SuccessPaper>
      </Box>
    </SuccessContainer>
  );
};

export default SignupSuccess; 