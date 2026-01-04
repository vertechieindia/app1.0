import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';

const Cookies = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ 
          color: theme.palette.primary.main,
          fontWeight: 700,
          mb: 4
        }}>
          Cookies Policy
        </Typography>

        <Typography variant="body1" paragraph>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Typography variant="body1" paragraph>
          This Cookies Policy explains how VerTechie ("we", "us", or "our") uses cookies and similar tracking technologies on our website. By continuing to browse our site, you agree to our use of cookies as described in this policy.
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            What Are Cookies?
          </Typography>
          <Typography variant="body1" paragraph>
            Cookies are small text files that are stored on your device when you visit a website. They serve various purposes, including helping the website remember your preferences, understanding how you interact with the site, and improving your overall experience.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Types of Cookies We Use
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Essential Cookies"
                secondary="These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You may not opt-out of these cookies."
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Performance Cookies"
                secondary="These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website's functionality."
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Functionality Cookies"
                secondary="These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced features."
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Authentication Cookies"
                secondary="These cookies help us identify users and prevent fraudulent use of user credentials, protecting user data from unauthorized parties."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Specific Cookies We Use
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Session Cookies"
                secondary="Used to maintain your session while using our verification services and navigating through protected areas of the website."
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Security Cookies"
                secondary="Used to enhance the security of our services, including preventing fraudulent use of login credentials and protecting user data from unauthorized access."
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Preference Cookies"
                secondary="Store your preferences such as language selection, theme settings, and other customizable features."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Cookie Management
          </Typography>
          <Typography variant="body1" paragraph>
            Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience and functionality of our website. To learn more about cookies and how to manage them, visit <Box component="span" sx={{ color: theme.palette.primary.main }}>www.aboutcookies.org</Box>.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Third-Party Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            We may use third-party services that use cookies to:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Analytics"
                secondary="We use Google Analytics to understand how visitors interact with our website."
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Security"
                secondary="We use various security services to protect our platform from fraud and abuse."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Updates to This Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this Cookies Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. We encourage you to periodically review this page for the latest information on our cookie practices.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about our use of cookies, please contact us at:
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.primary.main }}>
            Email: privacy@vertechie.com
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.primary.main }}>
            Address: 1111 Oak Hollow Ct, Hampton, GA 30228
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Cookies; 