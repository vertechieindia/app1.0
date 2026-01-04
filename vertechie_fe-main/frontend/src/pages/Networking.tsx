import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  useTheme,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CodeIcon from '@mui/icons-material/Code';
import PublicIcon from '@mui/icons-material/Public';
import WorkIcon from '@mui/icons-material/Work';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 119, 181, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(0, 119, 181, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 119, 181, 0); }
`;

// Styled components
const PageSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  position: 'relative',
  overflow: 'hidden',
}));

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(135deg, #0A1929 0%, #0077B5 100%)',
  color: 'white',
  padding: theme.spacing(15, 0, 10),
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 10%, transparent 70%)',
    backgroundSize: '20px 20px',
    opacity: 0.3,
  }
}));

const PatternBackground = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 2px, transparent 2px)',
  backgroundSize: '30px 30px',
  zIndex: 0,
  opacity: 0.5,
});

const CircleDecoration = styled(Box)({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.05)',
  zIndex: 0,
});

interface AnimatedBoxProps {
  delay?: number;
  children: React.ReactNode;
}

const AnimatedBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'delay',
})<AnimatedBoxProps>(({ delay = 0 }) => ({
  animation: `${fadeIn} 1s ease forwards ${delay}s`,
  opacity: 0,
  position: 'relative',
  zIndex: 1,
}));

const FloatingImage = styled(Box)({
  animation: `${float} 6s ease-in-out infinite`,
  position: 'relative',
  zIndex: 1,
});

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
  },
}));

const IconBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 80,
  height: 80,
  borderRadius: '20px',
  backgroundColor: 'rgba(0, 119, 181, 0.1)',
  marginBottom: 16,
  animation: `${pulse} 3s infinite`,
});

const BenefitItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const BenefitIconBox = styled(Avatar)(({ theme }) => ({
  backgroundColor: '#0077B5',
  width: 50,
  height: 50,
  marginRight: theme.spacing(2),
}));

const networkingFeatures = [
  {
    icon: <PeopleIcon fontSize="large" sx={{ color: '#0077B5' }} />,
    title: 'Send Connection Requests',
    description: 'Connect with verified professionals in your field to expand your network. All connections are verified to ensure authenticity.',
  },
  {
    icon: <GroupsIcon fontSize="large" sx={{ color: '#0077B5' }} />,
    title: 'Join Groups',
    description: 'Engage in discussions and projects with like-minded professionals. Groups are organized by industry, technology, and specialty.',
  },
  {
    icon: <EventNoteIcon fontSize="large" sx={{ color: '#0077B5' }} />,
    title: 'Live Events',
    description: 'Attend virtual networking sessions, webinars, and workshops led by industry experts. Network with participants in real-time.',
  },
  {
    icon: <CodeIcon fontSize="large" sx={{ color: '#0077B5' }} />,
    title: 'Collaborate',
    description: 'Work on real-world projects with other professionals. Build your portfolio while expanding your professional network.',
  },
];

const benefits = [
  {
    icon: <SecurityIcon />,
    title: 'Authentic Connections',
    description: 'Every professional is verified through our multi-step process, ensuring genuine connections.',
  },
  {
    icon: <WorkIcon />,
    title: 'Career Opportunities',
    description: 'Discover new job opportunities through your connections and company relationships.',
  },
  {
    icon: <PublicIcon />,
    title: 'Global Reach',
    description: 'Connect with professionals from over 150 countries and expand your international network.',
  },
];

const Networking = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleCreateProfileClick = () => {
    navigate('/signup');
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <PatternBackground />
        <CircleDecoration sx={{ width: '400px', height: '400px', top: '-200px', left: '-200px' }} />
        <CircleDecoration sx={{ width: '300px', height: '300px', bottom: '-150px', right: '-150px' }} />
        
        <Container>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 2
          }}>
            <AnimatedBox delay={0.1} sx={{ 
              maxWidth: { xs: '100%', md: '55%' },
              mb: { xs: 5, md: 0 }
            }}>
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontWeight: 800, 
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                  mb: 3,
                }}
              >
                Connect with Top Talent on VerTechie
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 400,
                  mb: 4,
                  opacity: 0.9
                }}
              >
                Build your network with verified professionals and collaborate on projects. Every connection is verified to ensure quality.
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  sx={{ 
                    borderRadius: '50px',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    backgroundColor: 'white',
                    color: '#0077B5',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  Explore Profiles
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  sx={{ 
                    borderRadius: '50px',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Join Groups
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 5 }}>
                <Box sx={{
                  px: 3,
                  py: 1,
                  borderRadius: '50px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mr: 1 }}>15,000+</Typography>
                  <Typography variant="body2">Verified Professionals</Typography>
                </Box>
                <Box sx={{
                  px: 3,
                  py: 1,
                  borderRadius: '50px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mr: 1 }}>500+</Typography>
                  <Typography variant="body2">Active Groups</Typography>
                </Box>
                <Box sx={{
                  px: 3,
                  py: 1,
                  borderRadius: '50px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mr: 1 }}>50+</Typography>
                  <Typography variant="body2">Countries</Typography>
                </Box>
              </Box>
            </AnimatedBox>
            
            <AnimatedBox delay={0.3} sx={{ 
              display: { xs: 'none', md: 'block' },
              maxWidth: '40%'
            }}>
              <FloatingImage>
                <Box 
                  component="img"
                  src="/images/global-network.svg"
                  alt="Global network with interconnected nodes"
                  sx={{ 
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              </FloatingImage>
            </AnimatedBox>
          </Box>
        </Container>
      </HeroSection>
      
      {/* Features Section */}
      <PageSection>
        <Container>
          <AnimatedBox delay={0.1}>
            <Typography
              variant="h2"
              component="h2"
              align="center"
              sx={{ 
                fontWeight: 700, 
                mb: 1,
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: '#0A1929',
              }}
            >
              Networking Made Authentic
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{ 
                mb: 6, 
                maxWidth: 800, 
                mx: 'auto',
                color: 'text.secondary',
              }}
            >
              Experience a platform where every connection is verified, every group is curated, and every interaction is meaningful
            </Typography>
          </AnimatedBox>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            {networkingFeatures.map((feature, index) => (
              <Box key={index} sx={{ width: { xs: '100%', sm: '50%' }, p: 2 }}>
                <AnimatedBox delay={0.2 + (index * 0.1)}>
                  <FeatureCard elevation={1}>
                    <CardContent sx={{ p: 4 }}>
                      <IconBox>
                        {feature.icon}
                      </IconBox>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </AnimatedBox>
              </Box>
            ))}
          </Box>
        </Container>
      </PageSection>
      
      {/* Benefits Section */}
      <PageSection sx={{ bgcolor: 'rgba(0, 119, 181, 0.05)' }}>
        <Container>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 6
          }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              <AnimatedBox delay={0.1}>
                <Box 
                  component="img"
                  src="/images/networking-benefits-illustration.svg"
                  alt="Professionals networking"
                  sx={{ 
                    width: '100%',
                    maxWidth: '500px',
                    height: 'auto',
                    display: 'block',
                    mx: 'auto'
                  }}
                />
              </AnimatedBox>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              <AnimatedBox delay={0.3}>
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    color: '#0A1929',
                  }}
                >
                  Why Network on VerTechie?
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ 
                    mb: 4, 
                    color: 'text.secondary',
                  }}
                >
                  Our platform offers unique advantages for IT professionals looking to build their network
                </Typography>
                
                <Divider sx={{ mb: 4 }} />
                
                {benefits.map((benefit, index) => (
                  <BenefitItem key={index}>
                    <BenefitIconBox>
                      {benefit.icon}
                    </BenefitIconBox>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {benefit.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {benefit.description}
                      </Typography>
                    </Box>
                  </BenefitItem>
                ))}
                
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    mt: 4,
                    borderRadius: '50px',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    bgcolor: '#0077B5',
                    '&:hover': {
                      bgcolor: '#005b8a',
                      boxShadow: '0 8px 16px rgba(0, 119, 181, 0.2)',
                    }
                  }}
                >
                  Start Networking
                </Button>
              </AnimatedBox>
            </Box>
          </Box>
        </Container>
      </PageSection>
      
      {/* CTA Section */}
      <PageSection>
        <Container>
          <AnimatedBox delay={0.1}>
            <Box sx={{
              borderRadius: theme.shape.borderRadius * 3,
              overflow: 'hidden',
              position: 'relative',
              bgcolor: '#0077B5',
              color: 'white',
              p: { xs: 4, md: 6 },
              textAlign: 'center',
            }}>
              <PatternBackground />
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    maxWidth: 800,
                    mx: 'auto',
                  }}
                >
                  Ready to expand your professional network?
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ 
                    mb: 4, 
                    maxWidth: 700,
                    mx: 'auto',
                    opacity: 0.9,
                  }}
                >
                  Join thousands of IT professionals connecting, collaborating, and growing together on VerTechie
                </Typography>
                
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleCreateProfileClick}
                  sx={{ 
                    borderRadius: '50px',
                    px: 5,
                    py: 1.5,
                    fontWeight: 600,
                    backgroundColor: 'white',
                    color: '#0077B5',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  Create Your Profile
                </Button>
              </Box>
            </Box>
          </AnimatedBox>
        </Container>
      </PageSection>
    </>
  );
};

export default Networking; 