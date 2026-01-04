import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
} from '@mui/material';

const Terms = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Terms of Service
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Last Updated: {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            1. Introduction
          </Typography>
          <Typography paragraph>
            Welcome to VerTechie. By accessing and using our platform, you agree to comply with these Terms of Service. Please read them carefully.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            2. Acceptance of Terms
          </Typography>
          <Typography paragraph>
            Your use of VerTechie signifies your agreement to these Terms. If you disagree with any part, you must refrain from using the platform.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            3. Account Registration and Security
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="User Information"
                secondary="Users must provide accurate, complete, and updated registration information."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Account Security"
                secondary="You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            4. Use of Platform
          </Typography>
          <Typography paragraph>
            You agree to use VerTechie only for lawful purposes, including professional networking, job searching, and accessing tech services. You agree not to misuse our services.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            5. User Conduct
          </Typography>
          <Typography paragraph>
            You must not:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="False Information"
                secondary="Submit false, misleading, or fraudulent information."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Harassment"
                secondary="Engage in harassment, abusive behavior, or discrimination."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Malware"
                secondary="Distribute malware or spam."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Unauthorized Access"
                secondary="Attempt unauthorized access or interference with our platform."
              />
            </ListItem>
          </List>
          <Typography paragraph>
            Providing false, misleading, or fraudulent information may result in legal action in accordance with the honorable court of law, including financial penalties ranging from $100,000 to $1,000,000.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            6. Intellectual Property Rights
          </Typography>
          <Typography paragraph>
            VerTechie owns all rights to its platform content and services. Users retain ownership of their content but grant VerTechie a license to use, display, and distribute submitted content for platform operation purposes.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            7. Privacy
          </Typography>
          <Typography paragraph>
            Your use of the VerTechie platform is governed by our Privacy Policy, outlining data collection, use, and protection practices.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            8. Limitation of Liability
          </Typography>
          <Typography paragraph>
            VerTechie is not liable for indirect, incidental, or consequential damages resulting from your use or inability to use the platform.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            9. Disclaimers
          </Typography>
          <Typography paragraph>
            VerTechie provides its services on an "as is" basis without warranties of any kind, either express or implied.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            10. Termination
          </Typography>
          <Typography paragraph>
            We reserve the right to terminate or suspend access to our platform at our discretion, without prior notice, for any violation of these Terms.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            11. Modifications
          </Typography>
          <Typography paragraph>
            We may update these Terms periodically. Users will be notified of significant changes via email or notifications on the platform. Continued use after modifications constitutes acceptance of the new Terms.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            12. Governing Law
          </Typography>
          <Typography paragraph>
            These Terms are governed by the laws of the jurisdiction in which VerTechie operates, without regard to conflict of law principles.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            13. Contact Information
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Email"
                secondary={<Link href="mailto:support@vertechie.com">support@vertechie.com</Link>}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Mailing Address"
                secondary="1111 Oak Hollow Ct, Hampton, GA 30228"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Phone"
                secondary="+1 (307) 254-9378"
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} VerTechie. All rights reserved.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Terms; 