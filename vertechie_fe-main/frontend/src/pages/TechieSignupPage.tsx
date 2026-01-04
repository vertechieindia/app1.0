import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import TechieSignup from '../components/auth/TechieSignup';

const TechieSignupPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 2 }}>
            Tech Professional Registration
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
            Join VerTechie's verified tech professional network and connect with top companies
          </Typography>
        </Paper>
        <TechieSignup />
      </Container>
    </Box>
  );
};

export default TechieSignupPage;

