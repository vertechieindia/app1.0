import React from 'react';
import { Box, Container, Typography, Paper, List, ListItem } from '@mui/material';

const Accessibility: React.FC = () => {
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
          Accessibility Statement
        </Typography>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Our Commitment
          </Typography>
          <Typography variant="body1" paragraph>
            We are committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </Typography>

          <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
            Conformance Status
          </Typography>
          <Typography variant="body1" paragraph>
            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. We aim to conform to WCAG 2.1 Level AA standards.
          </Typography>

          <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
            Accessibility Features
          </Typography>
          <List>
            <ListItem>
              <Typography variant="body1">
                • Keyboard navigation support
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                • Screen reader compatibility
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                • High contrast mode
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                • Resizable text
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                • Alternative text for images
              </Typography>
            </ListItem>
          </List>

          <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
            Feedback
          </Typography>
          <Typography variant="body1" paragraph>
            We welcome your feedback on the accessibility of our website. Please let us know if you encounter accessibility barriers:
          </Typography>
          <List>
            <ListItem>
              <Typography variant="body1">
                • Email: accessibility@example.com
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                • Phone: (555) 123-4567
              </Typography>
            </ListItem>
          </List>
        </Paper>
      </Container>
    </Box>
  );
};

export default Accessibility; 