import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const HiringManagerSignup: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 2 }}>
            Hiring Manager Registration
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
            Access verified tech talent and streamline your hiring process
          </Typography>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The Hiring Manager signup form is currently under development. 
            Please check back soon or contact us for early access.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default HiringManagerSignup;

