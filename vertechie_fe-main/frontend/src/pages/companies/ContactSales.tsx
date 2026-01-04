import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';

const ContactSales: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    companySize: '',
    message: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement form submission logic
      setSnackbar({
        open: true,
        message: 'Thank you for your interest! We will contact you soon.',
        severity: 'success'
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        jobTitle: '',
        companySize: '',
        message: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Something went wrong. Please try again.',
        severity: 'error'
      });
    }
  };

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
          Contact Sales
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Get in Touch
              </Typography>
              <Typography variant="body1" paragraph>
                Our sales team is ready to help you find the perfect solution for your business.
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Business Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Company Name"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Job Title"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      select
                      label="Company Size"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                    >
                      {companySizes.map((size) => (
                        <MenuItem key={size} value={size}>
                          {size}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      multiline
                      rows={4}
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Why Work With Us?
              </Typography>
              <Typography variant="body1" paragraph>
                Benefits of partnering with our sales team:
              </Typography>
              <ul>
                <li>Dedicated Account Manager</li>
                <li>Customized Solutions</li>
                <li>Competitive Pricing</li>
                <li>Technical Support</li>
                <li>Training and Onboarding</li>
              </ul>
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Contact Information
              </Typography>
              <Typography variant="body1">
                Email: sales@vertechie.com
              </Typography>
              <Typography variant="body1">
                Phone: +1 (555) 123-4567
              </Typography>
              <Typography variant="body1">
                Hours: Monday - Friday, 9:00 AM - 6:00 PM EST
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactSales; 