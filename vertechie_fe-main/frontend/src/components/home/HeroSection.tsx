import React from 'react';
import { Box, Typography, Container, Button, Grid, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
// import { motion } from 'framer-motion';

// Temporary motion implementation until framer-motion is installed
const motion = {
  div: styled('div')({})
};

// Motion variants
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100vh',
  maxHeight: 900,
  minHeight: 680,
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, rgba(0,119,181,0.05) 0%, rgba(0,119,181,0.1) 100%)',
}));

const BackgroundGraphic = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 0,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-10%',
    right: '-10%',
    width: '80%',
    height: '80%',
    background: 'radial-gradient(circle, rgba(0,119,181,0.1) 0%, rgba(0,119,181,0) 70%)',
    borderRadius: '50%',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10%',
    left: '-10%',
    width: '70%',
    height: '70%',
    background: 'radial-gradient(circle, rgba(144,202,249,0.15) 0%, rgba(144,202,249,0) 70%)',
    borderRadius: '50%',
  },
}));

const DotPattern = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 0,
  opacity: 0.3,
  backgroundImage: `radial-gradient(#0077B5 1px, transparent 1px)`,
  backgroundSize: '30px 30px',
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(5),
  },
}));

const HeroTitle = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const HeroSubtitle = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  maxWidth: 600,
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

const CircleHighlight = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(144,202,249,0.2)',
  filter: 'blur(40px)',
}));

const HeroImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const HeroImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
}));

const BoxGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: theme.spacing(-2),
  alignItems: 'center',
}));

// Update BoxGridItem to handle props properly
interface BoxGridItemProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

const BoxGridItem = styled(Box, {
  shouldForwardProp: (prop) => !['xs', 'sm', 'md', 'lg'].includes(prop as string),
})<BoxGridItemProps>(({ xs = 12, sm, md, lg, theme }) => {
  const getWidth = (cols: number) => `${(cols / 12) * 100}%`;
  
  return {
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    width: '100%',
    
    [theme.breakpoints.up('xs')]: {
      width: getWidth(xs),
    },
    ...(sm && {
      [theme.breakpoints.up('sm')]: {
        width: getWidth(sm),
      },
    }),
    ...(md && {
      [theme.breakpoints.up('md')]: {
        width: getWidth(md),
      },
    }),
    ...(lg && {
      [theme.breakpoints.up('lg')]: {
        width: getWidth(lg),
      },
    }),
  };
});

// Add feature card component
const FeatureCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(8px)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  }
}));

const FeatureIconContainer = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

const VideoBg = styled('video')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0,
  opacity: 0.85,
}));

const VideoOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,20,40,0.85) 100%)',
  zIndex: 1,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at center, rgba(0,119,181,0.2) 0%, rgba(0,0,0,0) 70%)',
  }
}));

const HeroSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <HeroContainer>
      {/* Video background */}
      <VideoBg 
        autoPlay 
        muted 
        loop 
        playsInline 
        poster="/images/hero-bg.jpg"
      >
        <source src="/videos/vertechie-security.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        Your browser does not support the video tag.
      </VideoBg>
      
      {/* Add a static gradient background as fallback in case video doesn't load */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)',
          zIndex: 0,
        }}
      />
      
      <VideoOverlay />
      
      {/* Keep existing BackgroundGraphic but with reduced opacity */}
      <BackgroundGraphic sx={{ opacity: 0.5 }} />
      <DotPattern sx={{ opacity: 0.15 }} />
      
      <CircleHighlight 
        sx={{ 
          top: '10%', 
          right: '5%', 
          width: 300, 
          height: 300,
          opacity: 0.4
        }} 
      />
      <CircleHighlight 
        sx={{ 
          bottom: '10%', 
          left: '5%', 
          width: 200, 
          height: 200,
          opacity: 0.4
        }} 
      />
      
      <ContentWrapper maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
        {/* Add a small badge to emphasize the security focus */}
        <Box 
          sx={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            mb: 4, 
            px: 2, 
            py: 1, 
            borderRadius: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box 
            sx={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #FF2D55 0%, #FF9500 100%)'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M19,11c0,4.52-2.98,8.69-7,9.93 c-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11l7,3.11V11z M7.41,11.59L6,13l4,4l8-8l-1.41-1.42L10,14.17L7.41,11.59z"/>
            </svg>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'white',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            Fighting Fake Profiles
          </Typography>
        </Box>

        <BoxGrid sx={{ margin: theme.spacing(-2), alignItems: 'center' }}>
          <BoxGridItem xs={12} md={6}>
            <HeroTitle>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #5AC8FA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                VerTechie
              </Typography>
              <Typography variant="h3" fontWeight={600} color="white">
                Protecting Genuine IT Talent
              </Typography>
            </HeroTitle>
            
            <HeroSubtitle>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                We eliminate fake profiles through advanced verification, connecting real tech professionals with perfect roles.
              </Typography>
            </HeroSubtitle>
            
            <ButtonContainer>
              <Box>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    py: 1.5, 
                    px: 3,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(90deg, #0077B5 0%, #5AC8FA 100%)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #006199 0%, #4BB8EA 100%)',
                    }
                  }}
                >
                  Get Started
                </Button>
              </Box>
              
              <Box>
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    py: 1.5, 
                    px: 3,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderColor: '#0077B5',
                    color: '#0077B5',
                    '&:hover': {
                      borderColor: '#006199',
                      backgroundColor: 'rgba(0, 119, 181, 0.05)',
                    }
                  }}
                >
                  Explore Courses
                </Button>
              </Box>
            </ButtonContainer>
            
            <Box sx={{ mt: 4 }}>
              <FeatureCard>
                <FeatureIconContainer sx={{ background: 'linear-gradient(135deg, #0077B5 0%, #00A0DC 100%)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M16,7a2,2,0,1,0-2-2A2,2,0,0,0,16,7ZM8,7A2,2,0,1,0,6,5,2,2,0,0,0,8,7Zm0,2c-2.33,0-7,1.17-7,3.5V15H15V12.5C15,10.17,10.33,9,8,9Zm8,0c-.29,0-.62,0-1,.05A4.68,4.68,0,0,1,17,12.5V15h6V12.5C23,10.17,18.33,9,16,9Z"/>
                  </svg>
                </FeatureIconContainer>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                    Connect with Top Talent
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Network with verified IT professionals
                  </Typography>
                </Box>
              </FeatureCard>
              
              <FeatureCard>
                <FeatureIconContainer sx={{ background: 'linear-gradient(135deg, #5AC8FA 0%, #1CB5E0 100%)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
                  </svg>
                </FeatureIconContainer>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                    Upskill with VerTechie Courses
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Industry-relevant training and certifications
                  </Typography>
                </Box>
              </FeatureCard>
              
              <FeatureCard>
                <FeatureIconContainer sx={{ background: 'linear-gradient(135deg, #34C759 0%, #1E9D37 100%)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M20,6H16V4A2,2,0,0,0,14,2H10A2,2,0,0,0,8,4V6H4A2,2,0,0,0,2,8V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V8A2,2,0,0,0,20,6ZM10,4h4V6H10ZM19,19a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V11H8v1a1,1,0,0,0,2,0V11h4v1a1,1,0,0,0,2,0V11h3Z"/>
                  </svg>
                </FeatureIconContainer>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                    Find Premium Job Opportunities
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Access exclusive IT positions
                  </Typography>
                </Box>
              </FeatureCard>
            </Box>
          </BoxGridItem>
          
          <BoxGridItem xs={12} md={6}>
            <HeroImageWrapper>
              <HeroImage 
                src="/images/hero-illustration.png" 
                alt="VerTechie Career Platform"
              />
            </HeroImageWrapper>
          </BoxGridItem>
        </BoxGrid>
      </ContentWrapper>
    </HeroContainer>
  );
};

export default HeroSection; 