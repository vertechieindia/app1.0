import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button, TextField } from '@mui/material';

const Support: React.FC = () => {
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
          Support Center
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Contact Support
              </Typography>
              <Typography variant="body1" paragraph>
                Our support team is here to help you with any questions or issues you may have.
              </Typography>
              <form>
                <TextField
                  fullWidth
                  label="Name"
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Subject"
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Send Message
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Frequently Asked Questions
              </Typography>
              <Typography variant="h6" gutterBottom>
                How do I reset my password?
              </Typography>
              <Typography variant="body1" paragraph>
                You can reset your password by clicking on the "Forgot Password" link on the login page.
              </Typography>
              <Typography variant="h6" gutterBottom>
                How do I update my profile?
              </Typography>
              <Typography variant="body1" paragraph>
                You can update your profile by going to your account settings and clicking on "Edit Profile".
              </Typography>
              <Typography variant="h6" gutterBottom>
                What payment methods do you accept?
              </Typography>
              <Typography variant="body1" paragraph>
                We accept all major credit cards, PayPal, and bank transfers.
              </Typography>
              <Typography variant="h6" gutterBottom>
                How do I cancel my subscription?
              </Typography>
              <Typography variant="body1" paragraph>
                You can cancel your subscription at any time by going to your account settings and clicking on "Subscription".
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Support; 