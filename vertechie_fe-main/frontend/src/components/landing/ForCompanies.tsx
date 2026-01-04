import React from 'react';
import { Box, Container, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Paper, Divider, useTheme, useMediaQuery } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SchoolIcon from '@mui/icons-material/School';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Animations
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

// Styled components
const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  position: 'relative',
  overflow: 'hidden',
}));

const CircleDecoration = styled(Box)({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(25, 118, 210, 0.05)',
  zIndex: 0,
});

const ServiceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  background: 'rgba(25, 118, 210, 0.1)',
}));

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
  zIndex: 2,
}));

// Services data
const services = [
  {
    id: 1,
    title: "Talent Acquisition",
    description: "Find pre-verified IT professionals with validated skills and experience for your team.",
    icon: <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    benefits: [
      "Access to verified tech talent",
      "Reduced hiring time by 40%",
      "Quality candidate matches",
      "Detailed skill profiles"
    ]
  },
  {
    id: 2,
    title: "Verification Services",
    description: "Our rigorous verification process ensures you only interact with validated professionals.",
    icon: <VerifiedUserIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    benefits: [
      "Comprehensive background checks",
      "Technical skill validation",
      "Project history verification",
      "Reference validation"
    ]
  },
  {
    id: 3,
    title: "Learning & Development",
    description: "Custom training programs to upskill your team with the latest tech knowledge and tools.",
    icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    benefits: [
      "Customized learning paths",
      "Enterprise-grade courses",
      "Team progress tracking",
      "Industry expert instruction"
    ]
  },
  {
    id: 4,
    title: "Enterprise Solutions",
    description: "Tailored solutions for large businesses looking to optimize their IT workforce management.",
    icon: <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    benefits: [
      "Dedicated account management",
      "Bulk hiring capabilities",
      "Custom integration options",
      "Workforce analytics"
    ]
  }
];

const ForCompanies = () => {
  const theme = useTheme();

  return (
    <SectionContainer>
      {/* Decorative circles */}
      <CircleDecoration sx={{ width: '400px', height: '400px', top: '-200px', left: '-200px' }} />
      <CircleDecoration sx={{ width: '300px', height: '300px', bottom: '-150px', right: '-150px' }} />
      
      <Container>
        <AnimatedBox delay={0.1}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: '#0A1929',
              }}
            >
              Powerful Solutions for Companies
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              Streamline your IT workforce management with our enterprise-grade tools and services
            </Typography>
          </Box>
        </AnimatedBox>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          },
          gap: 3,
          mb: 6
        }}>
          {services.map((service, index) => (
            <AnimatedBox key={service.id} delay={0.2 + (index * 0.1)}>
              <ServiceCard elevation={2}>
                <IconContainer>
                  {service.icon}
                </IconContainer>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  sx={{ fontWeight: 600, mb: 1.5 }}
                >
                  {service.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 3, flexGrow: 1 }}
                >
                  {service.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <List disablePadding>
                  {service.benefits.map((benefit, idx) => (
                    <ListItem key={idx} disablePadding sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleOutlineIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={benefit} 
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          fontWeight: 500
                        }} 
                      />
                    </ListItem>
                  ))}
                </List>
              </ServiceCard>
            </AnimatedBox>
          ))}
        </Box>
        
        <AnimatedBox delay={0.6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: theme.shape.borderRadius * 2,
              background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                height: '100%', 
                width: { xs: '0%', md: '30%' },
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 10%, transparent 70%)',
                backgroundSize: '20px 20px'
              }} 
            />
            
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
                <Box sx={{ flex: 1, pr: { xs: 0, md: 4 }, mb: { xs: 4, md: 0 } }}>
                  <Typography 
                    variant="h4" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2,
                      color: 'white'
                    }}
                  >
                    Ready to transform your IT hiring and management?
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      mb: 3
                    }}
                  >
                    Join thousands of companies that trust VerTechie to find verified talent, streamline operations, and develop their workforce.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ 
                        px: 3, 
                        py: 1.2,
                        borderRadius: '50px',
                        background: 'white',
                        color: 'primary.main',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.9)',
                        }
                      }}
                      aria-label="Schedule a demo"
                    >
                      Schedule a Demo
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{ 
                        px: 3, 
                        py: 1.2,
                        borderRadius: '50px',
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          background: 'rgba(255,255,255,0.1)',
                        }
                      }}
                      aria-label="Learn more about enterprise solutions"
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
                
                <Box 
                  sx={{ 
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: { md: '40%' }
                  }}
                >
                  <Box 
                    component="img"
                    src="/images/circuit-pattern.svg"
                    alt=""
                    sx={{ 
                      width: '100%',
                      maxWidth: 300,
                      opacity: 0.2,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </AnimatedBox>
      </Container>
    </SectionContainer>
  );
};

export default ForCompanies; 