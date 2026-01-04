import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const PrivacyPolicy: React.FC = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Privacy Policy
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            1. Information We Collect
          </Typography>
          <Typography paragraph>
            We collect information you provide directly to us, including name, email, and other details necessary for using our services.
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. How We Use Your Information
          </Typography>
          <Typography paragraph>
            We use the information we collect to provide, maintain, and improve our services, communicate with you, and protect our users.
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. Information Sharing
          </Typography>
          <Typography paragraph>
            We do not share your personal information with third parties except as described in this privacy policy.
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. Data Security
          </Typography>
          <Typography paragraph>
            We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.
          </Typography>

          <Typography variant="h6" gutterBottom>
            5. Your Rights
          </Typography>
          <Typography paragraph>
            You have the right to access, update, or delete your personal information. Contact us to exercise these rights.
          </Typography>

          <Typography variant="h6" gutterBottom>
            6. Changes to This Policy
          </Typography>
          <Typography paragraph>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </Typography>

          <Typography variant="h6" gutterBottom>
            7. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about this privacy policy, please contact us.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy; 