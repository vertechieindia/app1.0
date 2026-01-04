import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Grid as MuiGrid, useTheme, useMediaQuery } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import resolveAssetPath from '../../utils/assetResolver';

// Keyframe animations
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
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  color: 'white',
  padding: theme.spacing(15, 0, 10),
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100vw',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url("${resolveAssetPath('grid.svg')}")`,
    opacity: 0.1,
    animation: 'parallax 20s infinite linear',
    backgroundSize: '200%',
  },
  '@keyframes parallax': {
    '0%': { backgroundPosition: '0% 0%' },
    '100%': { backgroundPosition: '200% 100%' },
  },
}));

const StatBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(5px)',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2),
  width: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
}));

const VideoBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.9) 0%, rgba(13, 71, 161, 0.9) 100%)',
  },
  '& video': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

// Define the prop types for AnimatedBox
interface AnimatedBoxProps {
  delay?: number;
  children: React.ReactNode;
}

// Create the AnimatedBox component with proper typing
const AnimatedBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'delay',
})<AnimatedBoxProps>(({ delay = 0 }) => ({
  animation: `${fadeIn} 1s ease forwards ${delay}s`,
  opacity: 0,
  willChange: 'opacity, transform'
}));

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    // Simulate video loading
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 1000);
    
    // Add IntersectionObserver for lazy loading animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const stats = [
    {
      value: "10,000+",
      label: "Verified Professionals",
      icon: <VerifiedUserIcon sx={{ fontSize: 30, color: theme.palette.primary.light }} />
    },
    {
      value: "5,000+",
      label: "Genuine Opportunities",
      icon: <BusinessCenterIcon sx={{ fontSize: 30, color: theme.palette.primary.light }} />
    }
  ];

  return (
    <HeroSection>
      {/* Video Background - could be enabled with actual video source */}
      {/* 
      <VideoBackground>
        {isVideoLoaded && (
          <video autoPlay muted loop playsInline>
            <source src="/video/tech-background.mp4" type="video/mp4" />
          </video>
        )}
      </VideoBackground>
      */}
      
      <Container 
        maxWidth={false} 
        sx={{ 
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, md: 6, lg: 8 } 
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center',
          mx: -2
        }}>
          <Box sx={{ 
            width: { xs: '100%', md: '50%' },
            px: 2,
            mb: { xs: 4, md: 0 }
          }}>
            <AnimatedBox delay={0.1}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Revolutionize IT Hiring with VerTechie
              </Typography>
            </AnimatedBox>
            
            <AnimatedBox delay={0.3}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.6,
                  fontWeight: 400
                }}
              >
                Trustworthy connections with verified professionals and companies. Join a platform that ensures authenticity through strict verification, skill evaluations, and direct opportunities.
              </Typography>
            </AnimatedBox>
            
            <AnimatedBox delay={0.5}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5 }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  aria-label="Join VerTechie now"
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: '0 8px 20px rgba(33, 150, 243, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976d2 30%, #1cb5e0 90%)',
                      boxShadow: '0 12px 25px rgba(33, 150, 243, 0.4)',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Join Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/services"
                  endIcon={<ArrowForwardIcon />}
                  aria-label="Explore VerTechie services"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.7)',
                    borderWidth: 2,
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Explore Services
                </Button>
              </Box>
            </AnimatedBox>
            
            {/* Stats Bar */}
            <AnimatedBox delay={0.7}>
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { 
                    xs: 'repeat(1, 1fr)', 
                    sm: 'repeat(3, 1fr)' 
                  },
                  gap: { xs: 2, md: 3 }
                }}
              >
                {stats.map((stat, index) => (
                  <StatBox key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {stat.icon}
                    </Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 0.5,
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' } 
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {stat.label}
                    </Typography>
                  </StatBox>
                ))}
              </Box>
            </AnimatedBox>
          </Box>
          
          <Box sx={{ 
            width: { xs: '100%', md: '50%' },
            px: 2,
            textAlign: 'center',
            position: 'relative',
          }}>
            <AnimatedBox delay={0.3}>
              <Box
                component="img"
                src={resolveAssetPath('hero-illustration.svg')}
                alt="Professional networking illustration"
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setIsImageLoaded(true)}
                sx={{
                  width: '100%',
                  maxWidth: 550,
                  display: 'block',
                  margin: '0 auto',
                  animation: isImageLoaded ? `${float} 6s ease-in-out infinite` : 'none',
                  filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.2))',
                  bgcolor: !isImageLoaded ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  borderRadius: !isImageLoaded ? '16px' : 0,
                  height: !isImageLoaded ? 300 : 'auto',
                }}
              />
              
              {/* Decorative circles */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  width: 150, 
                  height: 150, 
                  borderRadius: '50%', 
                  border: '2px dashed rgba(255,255,255,0.2)',
                  top: -20,
                  right: isMobile ? 30 : 80,
                  animation: 'spin 15s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                  display: { xs: 'none', sm: 'block' }
                }} 
              />
              
              <Box 
                sx={{ 
                  position: 'absolute', 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  border: '2px dashed rgba(255,255,255,0.2)',
                  bottom: 50,
                  left: isMobile ? 20 : 50,
                  animation: 'spin 10s linear infinite reverse',
                  display: { xs: 'none', sm: 'block' }
                }} 
              />
            </AnimatedBox>
          </Box>
        </Box>
      </Container>
      
      {/* Wave bottom shape */}
      <Box 
        component="svg" 
        preserveAspectRatio="none" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1440 74"
        sx={{
          position: 'absolute',
          bottom: -1,
          left: 0,
          width: '100%',
          height: { xs: 40, sm: 50, md: 74 },
          display: 'block',
        }}
      >
        <path 
          fill="#f8f9fa" 
          fillOpacity="1" 
          d="M0,37L60,43.2C120,49,240,62,360,64.2C480,66,600,58,720,49.7C840,41,960,33,1080,34.8C1200,37,1320,49,1380,55.5L1440,62L1440,74L1380,74C1320,74,1200,74,1080,74C960,74,840,74,720,74C600,74,480,74,360,74C240,74,120,74,60,74L0,74Z"
        ></path>
      </Box>
    </HeroSection>
  );
};

export default Hero; 