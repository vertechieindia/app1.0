import { Box, Container, Typography, Button, useTheme, Divider, Paper } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Hero from '../components/landing/Hero';
import Mission from '../components/landing/Mission';
import ShieldIcon from '@mui/icons-material/Shield';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GppGoodIcon from '@mui/icons-material/GppGood';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import JobsSection from '../components/home/JobsSection';
import { resolveAssetPath, resolveImagePath } from '../utils/assetResolver';

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

// Styled components
const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  position: 'relative',
  overflow: 'hidden',
}));

const BackgroundGradient = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, #f5f9ff 0%, #ebf5ff 100%)',
  zIndex: -1,
}));

const PatternBackground = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: 'radial-gradient(rgba(25, 118, 210, 0.1) 2px, transparent 2px)',
  backgroundSize: '30px 30px',
  zIndex: -1,
  opacity: 0.5,
});

const CircleDecoration = styled(Box)({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(0, 119, 181, 0.05)',
  zIndex: -1,
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
}));

const FloatingImage = styled(Box)({
  animation: `${float} 6s ease-in-out infinite`,
  position: 'relative',
});

// Main component
const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Redirect authenticated users to their respective panels
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userDataString = localStorage.getItem('userData');

    if (authToken && userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        const adminRoles = userData.admin_roles || [];
        
        // Route based on admin_roles first
        if (userData.is_superuser || adminRoles.includes('superadmin')) {
          navigate('/super-admin', { replace: true });
        } else if (adminRoles.includes('hm_admin')) {
          navigate('/vertechie/hmadmin', { replace: true });
        } else if (adminRoles.includes('company_admin')) {
          navigate('/vertechie/companyadmin', { replace: true });
        } else if (adminRoles.includes('school_admin')) {
          navigate('/vertechie/schooladmin', { replace: true });
        } else if (adminRoles.includes('techie_admin')) {
          navigate('/vertechie/techieadmin', { replace: true });
        } else if (adminRoles.includes('bdm_admin')) {
          navigate('/vertechie/bdmadmin', { replace: true });
        } else if (adminRoles.includes('learnadmin') || adminRoles.includes('learn_admin')) {
          navigate('/vertechie/learnadmin', { replace: true });
        } else if (userData.is_staff) {
          navigate('/admin', { replace: true });
        } else if (userData.verification_status === 'rejected' || 
                   userData.verification_status === 'REJECTED' ||
                   userData.verification_status?.toLowerCase() === 'rejected') {
          // FIRST: Check if user is REJECTED (using verification_status field)
          navigate('/status/rejected', { replace: true });
        } else if (!userData.is_active && !userData.is_verified) {
          // SECOND: Fallback check for rejected (not active AND not verified)
          navigate('/status/rejected', { replace: true });
        } else if (userData.is_active && !userData.is_verified) {
          // THIRD: Check if user is pending verification (active but not verified)
          // This applies to ALL user types including HR, Techie, etc.
          navigate('/status/processing', { replace: true });
        } else if (userData.is_active && userData.is_verified) {
          // FOURTH: Redirect VERIFIED users to appropriate dashboard based on role
          const userRole = userData.role || userData.user_type || 'techie';
          if (userRole === 'hr' || userRole === 'hiring_manager' || userRole === 'HIRING_MANAGER') {
            navigate('/techie/home/feed', { replace: true });
          } else {
            navigate('/techie/dashboard', { replace: true });
          }
        }
      } catch {
        // Invalid user data, let them stay on home
      }
    }
  }, [navigate]);

  return (
    <>
      <Hero />
      <Mission />

      {/* Verification Standards Section */}
      <SectionContainer sx={{ py: 8 }}>
        <BackgroundGradient sx={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)' }} />
        <PatternBackground />
        <CircleDecoration sx={{ width: '300px', height: '300px', top: '-150px', right: '-150px' }} />
        <CircleDecoration sx={{ width: '200px', height: '200px', bottom: '-100px', left: '-100px' }} />
        
        <Container>
          <AnimatedBox delay={0.1}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h2" 
                component="h2" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: '#0A1929',
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 80,
                    height: 4,
                    backgroundColor: '#0077B5',
                    borderRadius: 2,
                  }
                }}
              >
                Our Verification Standards
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.secondary',
                  maxWidth: 800,
                  mx: 'auto',
                  fontWeight: 400,
                }}
              >
                We're committed to building a trusted platform with 100% genuine professionals and zero tolerance for fake profiles
              </Typography>
            </Box>
          </AnimatedBox>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            <Box sx={{ width: { xs: '100%', md: '50%' }, px: 2, mb: { xs: 4, md: 0 } }}>
              <AnimatedBox delay={0.2}>
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 3,
                      color: '#0A1929',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <ShieldIcon sx={{ mr: 1, color: '#0077B5', fontSize: 28 }} />
                    Zero-Trust Verification Approach
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                    We've developed a rigorous multi-layered verification process that leaves no stone unturned. Every professional on VerTechie undergoes mandatory verification before gaining access to opportunities.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ color: '#0077B5', mr: 1.5 }} />
                    <Typography variant="body1" fontWeight={500}>Document verification with government-issued IDs</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ color: '#0077B5', mr: 1.5 }} />
                    <Typography variant="body1" fontWeight={500}>Educational credential authentication directly with institutions</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ color: '#0077B5', mr: 1.5 }} />
                    <Typography variant="body1" fontWeight={500}>Previous employment verification through reference checks</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ color: '#0077B5', mr: 1.5 }} />
                    <Typography variant="body1" fontWeight={500}>Project portfolio assessment by industry experts</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center'}}>
                    <CheckCircleIcon sx={{ color: '#0077B5', mr: 1.5 }} />
                    <Typography variant="body1" fontWeight={500}>Real-time video interviews for identity confirmation</Typography>
                  </Box>
                </Box>
              </AnimatedBox>
              
              <AnimatedBox delay={0.3}>
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 3,
                      color: '#0A1929',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <VerifiedUserIcon sx={{ mr: 1, color: '#0077B5', fontSize: 28 }} />
                    Skill Assessment Framework
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                    We go beyond basic verification with practical skill assessments to ensure professionals have the expertise they claim, tailored to their specific domains.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                    <Box sx={{ width: { xs: '100%', sm: '50%' }, p: 1 }}>
                      <Paper elevation={0} sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        border: '1px solid rgba(0, 119, 181, 0.2)',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(0, 119, 181, 0.05) 0%, rgba(255, 255, 255, 0.8) 100%)',
                      }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Tech Assessments</Typography>
                        <Typography variant="body2">
                          Hands-on coding tests, system design challenges, and algorithm implementations verified by senior engineers
                        </Typography>
                      </Paper>
                    </Box>
                    <Box sx={{ width: { xs: '100%', sm: '50%' }, p: 1 }}>
                      <Paper elevation={0} sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        border: '1px solid rgba(0, 119, 181, 0.2)',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(0, 119, 181, 0.05) 0%, rgba(255, 255, 255, 0.8) 100%)',
                      }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Domain Expertise</Typography>
                        <Typography variant="body2">
                          Industry-specific challenges reviewed by subject matter experts to validate specialized knowledge
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                </Box>
              </AnimatedBox>
            </Box>
            
            <Box sx={{ width: { xs: '100%', md: '50%' }, px: 2 }}>
              <AnimatedBox delay={0.4}>
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 3,
                      color: '#0A1929',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <SecurityIcon sx={{ mr: 1, color: '#0077B5', fontSize: 28 }} />
                    Fake Profile Detection & Prevention
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                    Our AI-powered system combined with human review creates multiple barriers against fake profiles, ensuring only genuine talent makes it to our platform.
                  </Typography>
                  
                  <Box sx={{ 
                    border: '1px solid rgba(0, 119, 181, 0.2)',
                    borderRadius: 2,
                    overflow: 'hidden',
                    mb: 3,
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      borderBottom: '1px solid rgba(0, 119, 181, 0.2)',
                      bgcolor: 'rgba(0, 119, 181, 0.05)',
                    }}>
                      <Box sx={{ width: '50%', p: 2, fontWeight: 600, borderRight: '1px solid rgba(0, 119, 181, 0.2)' }}>
                        What We Detect
                      </Box>
                      <Box sx={{ width: '50%', p: 2, fontWeight: 600 }}>
                        How We Prevent It
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(0, 119, 181, 0.1)' }}>
                      <Box sx={{ width: '50%', p: 2, display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(0, 119, 181, 0.2)' }}>
                        <CancelIcon fontSize="small" sx={{ color: '#f44336', mr: 1 }} />
                        Stolen Identity Credentials
                      </Box>
                      <Box sx={{ width: '50%', p: 2 }}>
                        Biometric verification & video identity confirmation
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(0, 119, 181, 0.1)' }}>
                      <Box sx={{ width: '50%', p: 2, display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(0, 119, 181, 0.2)' }}>
                        <CancelIcon fontSize="small" sx={{ color: '#f44336', mr: 1 }} />
                        Falsified Work Experience
                      </Box>
                      <Box sx={{ width: '50%', p: 2 }}>
                        Direct employer contact & reference verification
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(0, 119, 181, 0.1)' }}>
                      <Box sx={{ width: '50%', p: 2, display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(0, 119, 181, 0.2)' }}>
                        <CancelIcon fontSize="small" sx={{ color: '#f44336', mr: 1 }} />
                        Fake Educational Credentials
                      </Box>
                      <Box sx={{ width: '50%', p: 2 }}>
                        Direct institutional verification with schools
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex' }}>
                      <Box sx={{ width: '50%', p: 2, display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(0, 119, 181, 0.2)' }}>
                        <CancelIcon fontSize="small" sx={{ color: '#f44336', mr: 1 }} />
                        Skill Misrepresentation
                      </Box>
                      <Box sx={{ width: '50%', p: 2 }}>
                        Practical skill tests designed by industry experts
                      </Box>
                    </Box>
                  </Box>
                  
                  <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
                    We achieve our high standards through a combination of:
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                    <Box sx={{ width: '50%', p: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ color: '#0077B5', mr: 1, fontSize: '1rem' }} />
                        <Typography variant="body2">AI-powered document analysis</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ width: '50%', p: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ color: '#0077B5', mr: 1, fontSize: '1rem' }} />
                        <Typography variant="body2">Human expert verification</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ width: '50%', p: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ color: '#0077B5', mr: 1, fontSize: '1rem' }} />
                        <Typography variant="body2">Behavioral analysis</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ width: '50%', p: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ color: '#0077B5', mr: 1, fontSize: '1rem' }} />
                        <Typography variant="body2">Real-time monitoring</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </AnimatedBox>
              
              <AnimatedBox delay={0.5}>
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 3,
                      color: '#0A1929',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <GppGoodIcon sx={{ mr: 1, color: '#0077B5', fontSize: 28 }} />
                    Our Verification Commitment
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                    Our dedication to verification isn't just a feature—it's the foundation of our platform. We're committed to ensuring that genuine talent receives the recognition and opportunities they deserve.
                  </Typography>
                  
                  <Box sx={{ 
                    bgcolor: 'rgba(0, 119, 181, 0.05)', 
                    p: 3, 
                    borderRadius: 2,
                    border: '1px solid rgba(0, 119, 181, 0.2)',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600}>Average Verification Time</Typography>
                      <Typography variant="h6" fontWeight={700} color="primary">48 Hours</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600}>Verification Success Rate</Typography>
                      <Typography variant="h6" fontWeight={700} color="primary">97%</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600}>Fake Profile Detection Rate</Typography>
                      <Typography variant="h6" fontWeight={700} color="primary">99.8%</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" fontWeight={600}>Verified Employers</Typography>
                      <Typography variant="h6" fontWeight={700} color="primary">100%</Typography>
                    </Box>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large" 
                    component={RouterLink}
                    to="/companies"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                      mt: 3,
                      px: 4, 
                      py: 1.5, 
                      borderRadius: '50px',
                      fontWeight: 600,
                      bgcolor: '#0077B5',
                      '&:hover': {
                        bgcolor: '#005885',
                        boxShadow: '0 12px 25px rgba(0, 119, 181, 0.3)',
                      }
                    }}
                  >
                    Learn About Our Verification Process
                  </Button>
                </Box>
              </AnimatedBox>
            </Box>
          </Box>
        </Container>
      </SectionContainer>

      <JobsSection />
    </>
  );
};

export default Home; 