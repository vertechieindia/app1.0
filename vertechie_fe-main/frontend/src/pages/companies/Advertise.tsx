import React from 'react';
import { Box, Container, Typography, Paper, Grid, Button } from '@mui/material';

const Advertise: React.FC = () => {
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
          Advertise With Us
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
                Why Advertise?
              </Typography>
              <Typography variant="body1" paragraph>
                Reach millions of tech professionals and decision-makers.
                Our platform provides targeted advertising solutions to help you:
              </Typography>
              <ul>
                <li>Increase brand visibility</li>
                <li>Generate quality leads</li>
                <li>Engage with tech community</li>
                <li>Drive conversions</li>
              </ul>
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
                Advertising Options
              </Typography>
              <Typography variant="body1" paragraph>
                Choose from our flexible advertising solutions:
              </Typography>
              <ul>
                <li>Display Advertising</li>
                <li>Sponsored Content</li>
                <li>Email Campaigns</li>
                <li>Custom Solutions</li>
              </ul>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 'auto' }}
              >
                Get Started
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Advertise; 