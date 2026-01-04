import React from 'react';
import { Box, Container, Typography, Paper, Grid, Button } from '@mui/material';

const Enterprise: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 8,
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            textAlign: 'center',
            mb: 6,
            color: 'primary.main',
          }}
        >
          Enterprise Solutions
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h4" component="h2" gutterBottom>
                Enterprise Features
              </Typography>
              <Typography variant="body1" paragraph>
                Comprehensive solutions for large organizations:
              </Typography>
              <ul>
                <li>Custom Learning Paths</li>
                <li>Advanced Analytics</li>
                <li>Dedicated Support</li>
                <li>API Integration</li>
                <li>SSO Implementation</li>
              </ul>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 'auto' }}
              >
                Schedule Demo
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h4" component="h2" gutterBottom>
                Why Enterprise?
              </Typography>
              <Typography variant="body1" paragraph>
                Benefits of our enterprise solution:
              </Typography>
              <ul>
                <li>Scalable Infrastructure</li>
                <li>Enhanced Security</li>
                <li>Custom Reporting</li>
                <li>24/7 Priority Support</li>
                <li>Dedicated Account Manager</li>
              </ul>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Enterprise; 