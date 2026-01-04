import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const CookiePolicy: React.FC = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Cookie Policy
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            1. What Are Cookies
          </Typography>
          <Typography paragraph>
            Cookies are small text files that are placed on your device when you visit our website.
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. How We Use Cookies
          </Typography>
          <Typography paragraph>
            We use cookies to enhance your browsing experience, understand site usage, and improve our services.
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. Types of Cookies We Use
          </Typography>
          <Typography paragraph>
            We use essential cookies for site functionality, analytics cookies to understand usage, and preference cookies to remember your settings.
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. Managing Cookies
          </Typography>
          <Typography paragraph>
            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your device and set most browsers to prevent them from being placed.
          </Typography>

          <Typography variant="h6" gutterBottom>
            5. Third-Party Cookies
          </Typography>
          <Typography paragraph>
            Some of our pages may contain content from other sites, which may set their own cookies. These sites are governed by their own cookie policies.
          </Typography>

          <Typography variant="h6" gutterBottom>
            6. Updates to This Policy
          </Typography>
          <Typography paragraph>
            We may update this cookie policy from time to time. Please check this page regularly for any changes.
          </Typography>

          <Typography variant="h6" gutterBottom>
            7. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about our use of cookies, please contact us.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default CookiePolicy; 