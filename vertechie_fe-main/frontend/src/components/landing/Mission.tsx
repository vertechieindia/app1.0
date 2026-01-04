import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
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

const MissionSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  background: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url("${resolveAssetPath('dots-pattern.svg')}")`,
    opacity: 0.05,
    pointerEvents: 'none',
  }
}));

const MissionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 100%)',
    zIndex: 0,
  }
}));

const ValueCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 8,
    height: '100%',
    background: 'linear-gradient(to bottom, #1a237e, #0d47a1)',
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  color: 'white',
  boxShadow: '0 8px 20px rgba(26, 35, 126, 0.3)',
  transform: 'translateZ(0)', // Force GPU acceleration
}));

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

const values = [
  {
    title: 'Authentic Verification',
    description: 'We verify every professional one by one, ensuring no fake profiles make it to our platform. Our multi-stage verification process includes work history checks and visa status validation.',
    icon: <VerifiedUserIcon sx={{ fontSize: 30 }} />
  },
  {
    title: 'Rigorous Skill Assessment',
    description: 'Our evaluations test technical and soft skills in real-time, ensuring only well-qualified professionals join our platform. From coding challenges to communication tests, we assess it all.',
    icon: <AssessmentIcon sx={{ fontSize: 30 }} />
  },
  {
    title: 'Trusted Ecosystem',
    description: 'Companies and schools must pass our strict validation process to gain visibility. Admins approve professionals, ensuring authenticity at every level of our ecosystem.',
    icon: <SecurityIcon sx={{ fontSize: 30 }} />
  }
];

const Mission = () => {
  return (
    <MissionSection>
      <Container
        maxWidth={false}
        sx={{
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, md: 6, lg: 8 }
        }}
      >
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <AnimatedBox delay={0.1}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Our Mission: Build Trust in IT Hiring
            </Typography>
          </AnimatedBox>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6, mb: 8, alignItems: 'stretch' }}>
          <Box sx={{ flexBasis: { xs: '100%', md: '55%' } }}>
            <AnimatedBox delay={0.3}>
              <MissionCard elevation={0}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    position: 'relative', 
                    zIndex: 1, 
                    lineHeight: 1.8,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    color: 'text.primary'
                  }}
                >
                  <Typography 
                    component="span" 
                    sx={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 600, 
                      color: 'primary.main',
                      display: 'block',
                      mb: 2
                    }}
                  >
                    In a market flooded with fake profiles, VerTechie stands out by verifying every professional one by one.
                  </Typography>
                  
                  We evaluate skills through rigorous assessments, ensuring only the best talent joins our platform. Our goal is to connect genuine candidates with real opportunities, eliminating the clutter of irrelevant applications.
                  <br /><br />
                  Unlike other platforms, we believe in quality over quantity. Each professional undergoes a thorough verification process, including skill evaluations, work history checks, and credential validation. This ensures that companies get access to pre-vetted talent that meets their specific requirements.
                  <br /><br />
                  We also verify companies and schools before they gain visibility on our platform—admins approve their requests after validation. Professionals associated with these entities must also be approved by their respective admins, ensuring a closed loop of trust.
                  <br /><br />
                  <Typography 
                    component="span" 
                    sx={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 600, 
                      color: 'primary.main',
                      display: 'block',
                      mb: 1.5
                    }}
                  >
                    Our Multi-Layered Verification Process
                  </Typography>
                  
                  Our verification system operates on multiple levels to ensure complete authenticity. First, we conduct comprehensive background checks that include employment history verification, educational credential validation, and professional reference checks. We also implement real-time skill assessments that test both technical competencies and soft skills through practical challenges and scenario-based evaluations.
                  <br /><br />
                  For international professionals, we verify visa status and work authorization through official channels. Our team of expert reviewers manually examines each profile, looking for inconsistencies or red flags that automated systems might miss. This human touch ensures that only genuinely qualified professionals make it through our screening process.
                  <br /><br />
                  <Typography 
                    component="span" 
                    sx={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 600, 
                      color: 'primary.main',
                      display: 'block',
                      mb: 1.5
                    }}
                  >
                    Building a Trusted Ecosystem
                  </Typography>
                  
                  Trust is the foundation of everything we do. We've created a comprehensive ecosystem where every participant—from individual professionals to large corporations—is thoroughly vetted before gaining access to our platform. This creates a safe, reliable environment where genuine connections can flourish.
                  <br /><br />
                  Our platform also includes advanced matching algorithms that consider not just technical skills, but also cultural fit, communication style, and work preferences. This holistic approach ensures that both professionals and companies find the perfect match, leading to more successful and lasting partnerships.
                  <br /><br />
                  Whether you're a professional seeking your next role, a company looking for reliable IT services, or someone eager to upskill, VerTechie is the platform you can trust.
                </Typography>
              </MissionCard>
            </AnimatedBox>
          </Box>
          
          <Box sx={{ flexBasis: { xs: '100%', md: '40%' }, display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'stretch' }}>
            {values.map((value, index) => (
              <AnimatedBox key={index} delay={0.3 + (index * 0.2)} sx={{ flex: 1, display: 'flex' }}>
                <ValueCard elevation={0} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <IconWrapper>
                    {value.icon}
                  </IconWrapper>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                    {value.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.6, flex: 1 }}>
                    {value.description}
                  </Typography>
                </ValueCard>
              </AnimatedBox>
            ))}
          </Box>
        </Box>

        {/* Statistics in columns */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: { xs: 3, md: 0 }, 
            justifyContent: 'space-around',
            textAlign: 'center',
            mt: 4,
            mb: 2
          }}
        >
          <AnimatedBox delay={0.7}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                100%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Verification Rate
              </Typography>
            </Box>
          </AnimatedBox>
          
          <AnimatedBox delay={0.8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                95%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Hiring Success Rate
              </Typography>
            </Box>
          </AnimatedBox>
          
          <AnimatedBox delay={0.9}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                48hrs
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Average Verification Time
              </Typography>
            </Box>
          </AnimatedBox>
        </Box>
      </Container>
    </MissionSection>
  );
};

export default Mission; 