import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const TalentSearch: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 8,
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Paper
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Talent Search
          </Typography>
          <Typography variant="body1" paragraph>
            Search and connect with top talent in your industry.
          </Typography>
          {/* Add talent search functionality here */}
        </Paper>
      </Container>
    </Box>
  );
};

export default TalentSearch; 