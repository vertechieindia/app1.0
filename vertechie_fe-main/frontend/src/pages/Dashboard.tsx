import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
// Authentication removed

const Dashboard: React.FC = () => {
  // Authentication removed - no user authentication

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Your Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body1">
                No recent activity to display.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Typography variant="body1">
                No quick actions available.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 