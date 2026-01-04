import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const PostJob: React.FC = () => {
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
            Post a Job
          </Typography>
          <Typography variant="body1" paragraph>
            Create a new job posting to attract top talent.
          </Typography>
          {/* Add job posting form here */}
        </Paper>
      </Container>
    </Box>
  );
};

export default PostJob; 