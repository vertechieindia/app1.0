import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SearchIcon from '@mui/icons-material/Search';
import GroupsIcon from '@mui/icons-material/Groups';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CompanyFeatureModal, { FeatureContent } from '../components/companies/CompanyFeatureModal';
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
  alignItems: 'center',
  padding: theme.spacing(4),
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
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

const TestimonialCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 0),
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: 'rgba(0, 119, 181, 0.1)',
  color: '#0077B5',
  fontWeight: 500,
}));

const features: FeatureContent[] = [
  {
    title: 'Verified Professionals',
    description: [
      'Every VerTechie candidate undergoes a strict multi-layer verification process:',
      '• Education and employment history checks',
      '• Real-time video verification (optional for advanced tiers)',
      '• Manual profile review by VerTechie admin',
      'No fake profiles — ever.'
    ],
    tagline: 'Your trust, our responsibility.',
    icon: VerifiedUserIcon
  },
  {
    title: 'Advanced Search',
    description: [
      'Use our powerful filters to:',
      '• Search by experience level, skills, availability',
      '• Filter by preferred locations, visa status, timezone',
      '• Match job roles to exact candidate strengths'
    ],
    tagline: 'Find your perfect fit faster with zero noise.',
    icon: SearchIcon
  },
  {
    title: 'Team Building',
    description: [
      'Whether you\'re scaling fast or filling gaps, VerTechie helps you:',
      '• Build complementary tech teams',
      '• Match based on hard & soft skills',
      '• Ensure team chemistry with collaborative assessments'
    ],
    tagline: 'Scale the smart way.',
    icon: GroupsIcon
  },
  {
    title: 'Project-Based Hiring',
    description: [
      'Need talent for short-term projects or flexible roles?',
      '• Hire verified experts on-demand',
      '• Choose between fixed-price, contract, or full-time',
      '• Reduce ramp-up time with pre-screened candidates'
    ],
    tagline: 'Adapt your workforce to real needs.',
    icon: AssignmentIcon
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    position: 'CTO at TechGrowth',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    content: 'VerTechie has transformed our hiring process. The verification system ensures we only interview qualified candidates, saving us countless hours in the screening process.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    position: 'Head of Engineering at DevScale',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    content: 'We needed to scale our development team quickly without compromising on quality. VerTechie delivered exceptional candidates who were ready to contribute from day one.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    position: 'HR Director at CloudSecure',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    content: 'The quality of cybersecurity professionals we\'ve hired through VerTechie is outstanding. Their verification process is rigorous and ensures candidates have the skills they claim.',
    rating: 4,
  },
];

const Companies = () => {
  const theme = useTheme();
  const [selectedFeature, setSelectedFeature] = useState<FeatureContent | null>(null);
  const navigate = useNavigate();

  const handleCardClick = (feature: FeatureContent) => {
    setSelectedFeature(feature);
  };

  const handleCloseModal = () => {
    setSelectedFeature(null);
  };

  const handleLearnMoreClick = () => {
    navigate('/verification');
  };

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
                Hire Verified IT Talent With Confidence
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 400,
                  mb: 4,
                  opacity: 0.9
                }}
              >
                Connect with pre-verified technology professionals who have proven their skills and experience. VerTechie removes the guesswork from tech hiring.
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
                  Post a Job
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
                  Browse Candidates
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
                  <Typography variant="h6" sx={{ fontWeight: 700, mr: 1 }}>10,000+</Typography>
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
                  <Typography variant="body2">Hiring Companies</Typography>
                </Box>
                <Box sx={{
                  px: 3,
                  py: 1,
                  borderRadius: '50px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mr: 1 }}>98%</Typography>
                  <Typography variant="body2">Hiring Success Rate</Typography>
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
                  src="/images/hiring-illustration.svg"
                  alt="Hiring process with verified profiles"
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
              Why Hire Through VerTechie?
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
              Our platform offers unique advantages for companies looking to hire verified IT professionals
            </Typography>
          </AnimatedBox>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Box
                  key={index}
                  sx={{
                    width: { xs: '100%', sm: '50%', md: '25%' },
                    p: 2
                  }}
                >
                  <FeatureCard onClick={() => handleCardClick(feature)}>
                    <IconWrapper>
                      <Icon fontSize="inherit" />
                    </IconWrapper>
                    <CardContent>
                      <Typography
                        variant="h5"
                        component="h2"
                        align="center"
                        gutterBottom
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                      >
                        {feature.tagline}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </Box>
              );
            })}
          </Box>
        </Container>
      </PageSection>
      
      {/* Verification Process Section */}
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
                  src="/images/verification-process.svg"
                  alt="VerTechie verification process"
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
                  Our Verification Process
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ 
                    mb: 4, 
                    color: 'text.secondary',
                  }}
                >
                  We verify every professional through a rigorous multi-step process
                </Typography>
                
                <Divider sx={{ mb: 4 }} />
                
                <List disablePadding>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Identity Verification" 
                      secondary="Government ID and professional profile validation to confirm identity."
                    />
                  </StyledListItem>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Employment History" 
                      secondary="Past employment verification through references and documentation."
                    />
                  </StyledListItem>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Skills Assessment" 
                      secondary="Technical skills evaluation through standardized tests and practical challenges."
                    />
                  </StyledListItem>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Education Verification" 
                      secondary="Degrees and certifications validated with issuing institutions."
                    />
                  </StyledListItem>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Professional References" 
                      secondary="In-depth conversations with past colleagues and managers."
                    />
                  </StyledListItem>
                </List>
                
                <Button
                  onClick={handleLearnMoreClick}
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
                  Learn More About Verification
                </Button>
              </AnimatedBox>
            </Box>
          </Box>
        </Container>
      </PageSection>
      
      {/* Talent Pool Section */}
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
              Our Talent Pool
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
              Access a diverse range of technology professionals with verified skills
            </Typography>
          </AnimatedBox>
          
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}>
            <AnimatedBox delay={0.2} sx={{ flex: 1 }}>
              <Card sx={{ 
                p: 4, 
                borderRadius: 4,
                height: '100%',
                background: 'linear-gradient(135deg, #f5f9ff 0%, #ebf5ff 100%)',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#0077B5', mr: 2 }}>
                    <BusinessIcon />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600}>Tech Roles</Typography>
                </Box>
                <List disablePadding>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Software Engineers" />
                  </StyledListItem>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Data Scientists & Analysts" />
                  </StyledListItem>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="DevOps Engineers" />
                  </StyledListItem>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="UX/UI Designers" />
                  </StyledListItem>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Cybersecurity Experts" />
                  </StyledListItem>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Product Managers" />
                  </StyledListItem>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Cloud Architects" />
                  </StyledListItem>
                </List>
              </Card>
            </AnimatedBox>
            
            <AnimatedBox delay={0.3} sx={{ flex: 1 }}>
              <Card sx={{ 
                p: 4, 
                borderRadius: 4,
                height: '100%',
                background: 'linear-gradient(135deg, #f5f9ff 0%, #ebf5ff 100%)',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#0077B5', mr: 2 }}>
                    <WorkIcon />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600}>In-Demand Skills</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  <StyledChip label="React" />
                  <StyledChip label="Python" />
                  <StyledChip label="AWS" />
                  <StyledChip label="DevOps" />
                  <StyledChip label="Machine Learning" />
                  <StyledChip label="Node.js" />
                  <StyledChip label="Kubernetes" />
                  <StyledChip label="Docker" />
                  <StyledChip label="TypeScript" />
                  <StyledChip label="Data Engineering" />
                  <StyledChip label="Cybersecurity" />
                  <StyledChip label="UI/UX" />
                  <StyledChip label="Java" />
                  <StyledChip label="Golang" />
                  <StyledChip label="SQL" />
                  <StyledChip label="NoSQL" />
                  <StyledChip label="Azure" />
                  <StyledChip label="GCP" />
                  <StyledChip label="Agile" />
                  <StyledChip label="CI/CD" />
                  <StyledChip label="Blockchain" />
                  <StyledChip label="AI" />
                  <StyledChip label="Angular" />
                  <StyledChip label="Vue.js" />
                  <StyledChip label="Mobile Development" />
                </Box>
              </Card>
            </AnimatedBox>
          </Box>
        </Container>
      </PageSection>
      
      {/* Testimonials Section */}
      <PageSection sx={{ bgcolor: 'rgba(0, 119, 181, 0.05)' }}>
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
              What Companies Say
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
              Hear from companies that have hired through VerTechie
            </Typography>
          </AnimatedBox>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            {testimonials.map((testimonial, index) => (
              <Box key={index} sx={{ width: { xs: '100%', md: '33.33%' }, p: 2 }}>
                <AnimatedBox delay={0.2 + (index * 0.1)}>
                  <TestimonialCard>
                    <Box sx={{ mb: 3, display: 'flex' }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          sx={{ 
                            color: i < testimonial.rating ? '#FFD700' : '#E0E0E0',
                            mr: 0.5 
                          }} 
                        />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ mb: 3, flex: 1 }}>
                      "{testimonial.content}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.position}
                        </Typography>
                      </Box>
                    </Box>
                  </TestimonialCard>
                </AnimatedBox>
              </Box>
            ))}
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
                  Ready to hire verified IT professionals?
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
                  Join hundreds of companies that trust VerTechie for their technology hiring needs
                </Typography>
                
                <Button 
                  onClick={handleCreateProfileClick}
                  variant="contained" 
                  size="large" 
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

      {selectedFeature && (
        <CompanyFeatureModal
          open={true}
          onClose={handleCloseModal}
          feature={selectedFeature}
        />
      )}
    </>
  );
};

export default Companies; 