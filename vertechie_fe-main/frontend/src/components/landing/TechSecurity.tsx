import { Box, Container, Typography, Button, Paper, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
// Learning Icons
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AssessmentIcon from '@mui/icons-material/Assessment';
// Security Icons
import ShieldIcon from '@mui/icons-material/Shield';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';

const TechSecuritySection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #000B22 0%, #0A1929 100%)',
  color: 'white',
  padding: theme.spacing(12, 0),
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
    pointerEvents: 'none',
  }
}));

const ServiceBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderLeft: '3px solid #1976d2',
  transition: 'transform 0.3s, background 0.3s',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    background: 'rgba(255, 255, 255, 0.08)',
  }
}));

const FeatureCircle = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.1)',
  }
}));

const StyledTab = styled(Tab)({
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: 'white',
  },
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
});

// Learning technology data
const learningTech = [
  {
    icon: <VideoLibraryIcon sx={{ fontSize: 32 }} />,
    title: 'Interactive Learning',
    description: 'Engage with dynamic video courses, interactive exercises, and hands-on projects designed for maximum knowledge retention.'
  },
  {
    icon: <LightbulbIcon sx={{ fontSize: 32 }} />,
    title: 'AI-Powered Recommendations',
    description: 'Our smart learning system recommends personalized content based on your career goals, skills, and learning patterns.'
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: 32 }} />,
    title: 'Skills Assessment',
    description: 'Track your progress with comprehensive skill assessments and earn industry-recognized credentials.'
  }
];

// Security features data
const securityFeatures = [
  {
    icon: <ShieldIcon sx={{ fontSize: 32 }} />,
    title: 'Data Protection',
    description: 'Advanced encryption and security protocols ensure your personal and professional information remains private and secure.'
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 32 }} />,
    title: 'Identity Verification',
    description: 'Our robust verification system ensures all professionals and companies on the platform are legitimate and trustworthy.'
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 32 }} />,
    title: 'Secure Transactions',
    description: 'All financial transactions, from course purchases to job applications, are protected with enterprise-grade security measures.'
  }
];

// Platform principles
const platformPrinciples = [
  {
    icon: <LightbulbIcon sx={{ fontSize: 40 }} />,
    title: 'Continuous Learning',
    description: 'We believe in lifelong learning to stay relevant in today\'s fast-evolving professional landscape.'
  },
  {
    icon: <ShieldIcon sx={{ fontSize: 40 }} />,
    title: 'Trust & Security',
    description: 'Building a secure environment where professionals and companies can connect with confidence.'
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
    title: 'Professional Growth',
    description: 'Empowering career advancement through verified skills, networking, and job opportunities.'
  }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`platform-tabpanel-${index}`}
      aria-labelledby={`platform-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 4 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const LearningSecuritySection = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <TechSecuritySection>
      <Container 
        maxWidth={false}
        sx={{ 
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, md: 6, lg: 8 } 
        }}
      >
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Learning & Security
          </Typography>
          <Typography 
            variant="h6" 
            align="center"
            sx={{ mb: 3, maxWidth: 800, mx: 'auto', opacity: 0.9 }}
          >
            Cutting-edge learning technology in a secure, trusted environment
          </Typography>
        </Box>

        {/* Core Principles Section */}
        <Box 
          sx={{ 
            p: 5, 
            mb: 8, 
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(13, 71, 161, 0.6) 0%, rgba(25, 118, 210, 0.4) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
            Our Platform Principles
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
            {platformPrinciples.map((principle, index) => (
              <Box 
                key={index}
                sx={{ 
                  width: { xs: '100%', md: '33.333%' },
                  px: 2,
                  mb: { xs: 4, md: 0 }
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <FeatureCircle>
                    {principle.icon}
                  </FeatureCircle>
                  <Typography variant="h5" gutterBottom>
                    {principle.title}
                  </Typography>
                  <Typography sx={{ opacity: 0.9 }}>
                    {principle.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Tabs for Learning and Security */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth" 
              textColor="inherit"
              TabIndicatorProps={{
                style: {
                  background: '#1976d2'
                }
              }}
            >
              <StyledTab label="Learning Technology" />
              <StyledTab label="Platform Security" />
            </Tabs>
          </Box>
          
          {/* Learning Technology Tab Panel */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" sx={{ mb: 4, textAlign: 'center' }}>
              Advanced Learning Platform
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
              {learningTech.map((tech, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    width: { xs: '100%', sm: '50%', lg: '33.333%' },
                    px: 2,
                    mb: 4
                  }}
                >
                  <ServiceBox>
                    <Box sx={{ color: '#1976d2', mb: 2 }}>
                      {tech.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {tech.title}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                      {tech.description}
                    </Typography>
                  </ServiceBox>
                </Box>
              ))}
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  '&:hover': {
                    borderColor: '#1976d2',
                    background: 'rgba(25, 118, 210, 0.1)',
                  }
                }}
              >
                Browse Courses
              </Button>
            </Box>
          </TabPanel>
          
          {/* Security Tab Panel */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" sx={{ mb: 4, textAlign: 'center' }}>
              Your Security Is Our Priority
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
              {securityFeatures.map((feature, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    width: { xs: '100%', sm: '50%', lg: '33.333%' },
                    px: 2,
                    mb: 4
                  }}
                >
                  <ServiceBox>
                    <Box sx={{ color: '#1976d2', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                      {feature.description}
                    </Typography>
                  </ServiceBox>
                </Box>
              ))}
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                sx={{
                  background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                  px: 4,
                  py: 1.5
                }}
              >
                Learn About Privacy
              </Button>
            </Box>
          </TabPanel>
        </Box>
        
        {/* Bottom call-to-action */}
        <Box 
          sx={{ 
            mt: 6, 
            p: 4, 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: 2,
            background: 'rgba(0, 0, 0, 0.2)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" gutterBottom>
            Join Thousands of Growing Professionals
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 900, mx: 'auto', mb: 3 }}>
            Our platform combines state-of-the-art learning technology with enterprise-grade security 
            to provide the most effective and trusted professional development experience.
          </Typography>
          <Button 
            variant="outlined" 
            color="primary"
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: '#1976d2',
                background: 'rgba(25, 118, 210, 0.1)',
              }
            }}
          >
            Start Your Journey Today
          </Button>
        </Box>
      </Container>
    </TechSecuritySection>
  );
};

export default LearningSecuritySection; 