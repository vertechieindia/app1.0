import React from 'react';
import { Box, Container, Typography, Button, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  background: theme.palette.background.gradient,
  padding: theme.spacing(8, 0),
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.background.paper,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const Landing: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h1"
                sx={{
                  mb: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Connect Genuine Talent with Verified Opportunities
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                VerTechie eliminates fake profiles and brings together top talent and top opportunities through our strict verification process.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{ mr: 2 }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </Box>
            <Box sx={{ flex: 1 }}>
              {/* Add hero image or illustration here */}
            </Box>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" align="center" sx={{ mb: 6 }}>
          Why Choose VerTechie?
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <FeatureCard>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Zero Trust Verification
              </Typography>
              <Typography color="text.secondary">
                Every profile and credential goes through our strict verification process, ensuring authenticity and trust.
              </Typography>
            </FeatureCard>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FeatureCard>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Comprehensive Platform
              </Typography>
              <Typography color="text.secondary">
                Access networking, IT services, and career opportunities all in one place.
              </Typography>
            </FeatureCard>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FeatureCard>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Community Focused
              </Typography>
              <Typography color="text.secondary">
                Join a community of verified professionals, companies, and educational institutions.
              </Typography>
            </FeatureCard>
          </Box>
        </Box>
      </Container>

      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" sx={{ mb: 6 }}>
            Who Can Join?
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <FeatureCard>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Techies
                </Typography>
                <Typography color="text.secondary">
                  Verified professionals seeking opportunities and growth.
                </Typography>
              </FeatureCard>
            </Box>
            <Box sx={{ flex: 1 }}>
              <FeatureCard>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Companies
                </Typography>
                <Typography color="text.secondary">
                  Verified organizations looking for top talent and offering services.
                </Typography>
              </FeatureCard>
            </Box>
            <Box sx={{ flex: 1 }}>
              <FeatureCard>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Educational Institutions
                </Typography>
                <Typography color="text.secondary">
                  Schools and universities managing their alumni network.
                </Typography>
              </FeatureCard>
            </Box>
            <Box sx={{ flex: 1 }}>
              <FeatureCard>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Hiring Partners
                </Typography>
                <Typography color="text.secondary">
                  Verified recruiters connecting with genuine talent.
                </Typography>
              </FeatureCard>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing; 