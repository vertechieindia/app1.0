import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, useTheme, useMediaQuery, Button } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ShieldIcon from '@mui/icons-material/Shield';
import HttpsIcon from '@mui/icons-material/Https';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shield = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 0.9; }
  50% { transform: translateY(-8px) scale(1.05); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 0.9; }
`;

const TrustSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  background: 'linear-gradient(135deg, #f5f5f5 0%, #e8eaf6 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/shield-pattern.svg")',
    opacity: 0.05,
    pointerEvents: 'none',
  }
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

const ShieldIconWrapper = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
  animation: `${shield} 3s ease-in-out infinite`,
  '& svg': {
    fontSize: 48,
  }
}));

const TrustCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    '& .icon-container': {
      transform: 'scale(1.1)',
      boxShadow: '0 10px 25px rgba(25, 118, 210, 0.4)',
    }
  }
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  boxShadow: '0 5px 15px rgba(25, 118, 210, 0.2)',
  '& svg': {
    fontSize: 30,
  }
}));

const VerificationStep = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(5px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
  }
}));

const StepNumber = styled(Box)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  marginRight: theme.spacing(2),
  flexShrink: 0,
}));

const CheckItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
  '& svg': {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1),
  }
}));

const trustFeatures = [
  {
    id: 1,
    title: 'Verified Professionals',
    description: 'Every tech professional on our platform undergoes a rigorous verification process to confirm their identity, skills, and experience.',
    icon: <VerifiedUserIcon fontSize="large" />,
  },
  {
    id: 2,
    title: 'Secure Data Handling',
    description: 'We implement bank-level security measures to protect your personal information and ensure your data is never shared without consent.',
    icon: <HttpsIcon fontSize="large" />,
  },
  {
    id: 3,
    title: 'Privacy Controls',
    description: 'Take full control of your privacy with granular settings that let you decide what information is visible to others on the platform.',
    icon: <PrivacyTipIcon fontSize="large" />,
  },
  {
    id: 4,
    title: 'Company Verification',
    description: 'Companies undergo verification to ensure legitimacy, protecting professionals from fraudulent job offers and opportunities.',
    icon: <DomainVerificationIcon fontSize="large" />,
  },
];

const verificationSteps = [
  {
    id: 1,
    title: 'Identity Verification',
    description: 'We verify government-issued IDs and use facial recognition to confirm the identity of all users.'
  },
  {
    id: 2,
    title: 'Skills Assessment',
    description: 'Professionals complete skill verifications and coding challenges to demonstrate their technical abilities.'
  },
  {
    id: 3,
    title: 'Work Experience Validation',
    description: 'We cross-reference employment history with external data sources to confirm past work experience.'
  },
  {
    id: 4,
    title: 'Credential Checking',
    description: 'Degrees, certifications, and professional credentials are verified with issuing institutions.'
  },
];

const securityMeasures = [
  'End-to-end encryption for all communications',
  'Regular security audits and penetration testing',
  'Two-factor authentication for all accounts',
  'SOC 2 Type II compliance',
  'GDPR and CCPA compliant data handling',
  'Monitored access to sensitive information',
];

const TrustSafety = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <TrustSection>
      <Container
        maxWidth={false}
        sx={{
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, md: 6, lg: 8 }
        }}
      >
        <AnimatedBox delay={0.1}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <ShieldIconWrapper>
              <ShieldIcon fontSize="large" />
            </ShieldIconWrapper>
            
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
              Trust & Security by Design
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 4,
                maxWidth: 800,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.6
              }}
            >
              At VerTechie, we've built trust and security into every aspect of our platform.
              From rigorous verification processes to advanced data protection, we ensure a safe environment for professionals and companies.
            </Typography>
          </Box>
        </AnimatedBox>

        {/* Trust Features */}
        <AnimatedBox delay={0.3}>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 4,
              mb: 8,
              opacity: isLoading ? 0.7 : 1,
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            {trustFeatures.map((feature, index) => (
              <AnimatedBox key={feature.id} delay={0.4 + (index * 0.1)}>
                <TrustCard>
                  <IconContainer className="icon-container">
                    {feature.icon}
                  </IconContainer>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </TrustCard>
              </AnimatedBox>
            ))}
          </Box>
        </AnimatedBox>

        {/* Verification Process */}
        <Box sx={{ mb: 8 }}>
          <AnimatedBox delay={0.6}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 4,
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              Our Verification Process
            </Typography>

            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 4,
              }}
            >
              <Box>
                {verificationSteps.map((step, index) => (
                  <AnimatedBox key={step.id} delay={0.7 + (index * 0.1)}>
                    <VerificationStep>
                      <StepNumber>{step.id}</StepNumber>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          {step.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {step.description}
                        </Typography>
                      </Box>
                    </VerificationStep>
                  </AnimatedBox>
                ))}
              </Box>

              <AnimatedBox delay={0.8}>
                <TrustCard sx={{ height: '100%' }}>
                  <Box sx={{ mb: 3 }}>
                    <IconContainer className="icon-container">
                      <SecurityIcon fontSize="large" />
                    </IconContainer>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Security Measures
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      We implement industry-leading security measures to protect our users and their data:
                    </Typography>
                  </Box>

                  <Box>
                    {securityMeasures.map((measure, idx) => (
                      <CheckItem key={idx}>
                        <CheckCircleIcon fontSize="small" />
                        <Typography variant="body2">
                          {measure}
                        </Typography>
                      </CheckItem>
                    ))}
                  </Box>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    aria-label="View security details"
                    sx={{ 
                      mt: 'auto', 
                      borderRadius: '50px',
                      px: 3,
                      py: 1,
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    Security Details
                  </Button>
                </TrustCard>
              </AnimatedBox>
            </Box>
          </AnimatedBox>
        </Box>

        {/* Call to action */}
        <AnimatedBox delay={0.9}>
          <Box 
            sx={{ 
              p: { xs: 3, md: 6 },
              borderRadius: theme.shape.borderRadius * 2,
              background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Your Security is Our Priority
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                opacity: 0.9, 
                maxWidth: 800, 
                mx: 'auto', 
                mb: 4 
              }}
            >
              VerTechie is committed to maintaining the highest standards of security and trust.
              Join our community of verified professionals and companies today.
            </Typography>
            <Button
              variant="contained"
              size="large"
              aria-label="Learn more about VerTechie security"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                borderRadius: '50px',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Learn More About Security
            </Button>
          </Box>
        </AnimatedBox>
      </Container>
    </TrustSection>
  );
};

export default TrustSafety; 