import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const About: React.FC = () => {
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
            fontWeight: 'bold',
          }}
        >
          About Us
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h4" component="h2" gutterBottom color="primary">
                Who We Are
              </Typography>
              <Typography variant="body1" paragraph>
                We are a team of passionate technologists, educators, and industry experts dedicated to bridging the gap between education and employment in the tech industry. Our mission is to empower individuals with the skills and knowledge they need to succeed in today's digital world.
              </Typography>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h4" component="h2" gutterBottom color="primary">
                What We Do
              </Typography>
              <Typography variant="body1" paragraph>
                We provide comprehensive tech services through our platform, offering networking opportunities and career guidance. Our services include:
              </Typography>
              <ul>
                <li>Professional networking and mentorship</li>
                <li>Career development resources</li>
                <li>Company partnerships and job placements</li>
                <li>Skill verification and assessment</li>
              </ul>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h4" component="h2" gutterBottom color="primary">
                How We Started
              </Typography>
              <Typography variant="body1" paragraph>
                Our journey began with a simple observation: the tech industry's rapid growth was creating a significant skills gap. We recognized the need for a platform that could effectively connect aspiring professionals with the right resources and opportunities.
              </Typography>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h4" component="h2" gutterBottom color="primary">
                Our Future Vision
              </Typography>
              <Typography variant="body1" paragraph>
                We envision a future where:
              </Typography>
              <ul>
                <li>Every individual has access to quality tech opportunities</li>
                <li>Companies find the perfect talent match</li>
                <li>The tech industry becomes more diverse and inclusive</li>
                <li>Career growth is seamlessly connected to skill verification</li>
              </ul>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About; 