import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  Card,
  CardContent,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';

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
  padding: theme.spacing(10, 0),
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

const LocationCard = styled(Card)(({ theme }) => ({
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
  marginBottom: 16,
});

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: 'none',
  '&:before': {
    display: 'none',
  },
  marginBottom: theme.spacing(1.5),
  border: '1px solid rgba(0, 0, 0, 0.1)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 1.5,
  },
}));

// Mock data

const faqItems = [
  {
    question: 'How does VerTechie verify IT professionals?',
    answer: 'VerTechie uses a multi-step verification process that includes identity checks, employment verification, skills assessment, education verification, and professional references. This comprehensive approach ensures that all professionals on our platform have the credentials and experience they claim.',
  },
  {
    question: 'Is there a cost to create a profile on VerTechie?',
    answer: 'Creating a basic profile on VerTechie is free for IT professionals. However, we offer premium membership options with additional features like priority matching with job opportunities, advanced networking tools, and skill verification badges.',
  },
  {
    question: 'How can companies post job openings on the platform?',
    answer: 'Companies can create a business account on VerTechie and gain access to our job posting portal. From there, they can create detailed job listings that will be matched with our pool of verified professionals. We offer various recruitment packages to suit different hiring needs.',
  },
  {
    question: 'How can I get technical support for the platform?',
    answer: 'For technical support, you can contact our support team through the help center on the platform, send an email to support@vertechie.com, or use the live chat feature during business hours. Our team is available to assist with any issues or questions you may have.',
  }
];

// Define BoxGrid component if not already defined
const BoxGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: theme.spacing(-1.5),
  width: 'calc(100% + 24px)'
}));

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
    padding: theme.spacing(1.5),
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

const Contact = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    subscribe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'subscribe' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        subscribe: false,
      });
    }, 1500);
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <HeroSection>
        <PatternBackground />
        <CircleDecoration sx={{ width: '400px', height: '400px', top: '-200px', left: '-200px' }} />
        <CircleDecoration sx={{ width: '300px', height: '300px', bottom: '-150px', right: '-150px' }} />
        
        <Container>
          <Box sx={{ 
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
            maxWidth: 800,
            mx: 'auto',
          }}>
            <AnimatedBox delay={0.1}>
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
                Get in Touch with VerTechie
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 400,
                  mb: 4,
                  opacity: 0.9
                }}
              >
                Have questions, feedback, or want to learn more about our services? We're here to help.
              </Typography>
            </AnimatedBox>
          </Box>
        </Container>
      </HeroSection>
      
      {/* Contact Form Section */}
      <PageSection sx={{ bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 6,
          }}>
            <AnimatedBox delay={0.1} sx={{ flex: { xs: '1 1 100%', md: '1 1 55%' } }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  color: '#0A1929',
                }}
              >
                Send Us a Message
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  mb: 4, 
                  color: 'text.secondary',
                }}
              >
                Fill out the form below and our team will get back to you as soon as possible
              </Typography>
              
              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ 
                  backgroundColor: 'white',
                  borderRadius: theme.shape.borderRadius * 3,
                  p: { xs: 3, md: 5 },
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                }}
              >
                <BoxGrid>
                  <BoxGridItem xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      required
                    />
                  </BoxGridItem>
                  <BoxGridItem xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      type="email"
                      required
                    />
                  </BoxGridItem>
                  <BoxGridItem xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      variant="outlined"
                      required
                    />
                  </BoxGridItem>
                  <BoxGridItem xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={6}
                      required
                    />
                  </BoxGridItem>
                  <BoxGridItem xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          name="subscribe" 
                          checked={formData.subscribe}
                          onChange={handleChange}
                          color="primary" 
                        />
                      }
                      label="Subscribe to our newsletter for technology trends and updates"
                    />
                  </BoxGridItem>
                  <BoxGridItem xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                      sx={{
                        borderRadius: '50px',
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        bgcolor: '#0077B5',
                        '&:hover': {
                          bgcolor: '#005b8a',
                        },
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </BoxGridItem>
                </BoxGrid>
              </Box>
            </AnimatedBox>
            
            <AnimatedBox delay={0.3} sx={{ flex: { xs: '1 1 100%', md: '1 1 45%' } }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  color: '#0A1929',
                }}
              >
                Contact Information
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  mb: 4, 
                  color: 'text.secondary',
                }}
              >
                Get in touch directly using our contact details below
              </Typography>
              
              <Card sx={{ 
                p: 3, 
                borderRadius: theme.shape.borderRadius * 2,
                mb: 4,
                background: 'linear-gradient(135deg, #f5f9ff 0%, #ebf5ff 100%)',
              }}>
                <CardContent>
                  <IconBox>
                    <EmailIcon sx={{ color: '#0077B5', mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>Email</Typography>
                      <Typography variant="body2" color="text.secondary">
                        <a href="mailto:info@vertechie.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                          info@vertechie.com
                        </a>
                      </Typography>
                    </Box>
                  </IconBox>
                  
                  <IconBox>
                    <PhoneIcon sx={{ color: '#0077B5', mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>Phone</Typography>
                      <Typography variant="body2" color="text.secondary">
                        <a href="tel:+13072549378" style={{ color: 'inherit', textDecoration: 'none' }}>
                          +1 (307) 254-9378
                        </a>
                      </Typography>
                    </Box>
                  </IconBox>
                  
                  <IconBox>
                    <AccessTimeIcon sx={{ color: '#0077B5', mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>Support Hours</Typography>
                      <Typography variant="body2" color="text.secondary">Monday - Friday: 9:00 AM - 6:00 PM EST</Typography>
                    </Box>
                  </IconBox>
                </CardContent>
              </Card>
              
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    color: '#0A1929',
                  }}
                >
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    component="a"
                    href="https://www.facebook.com/share/1EudbQPPEp/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined" 
                    sx={{ 
                      minWidth: 'auto', 
                      p: 1.5,
                      borderRadius: '50%',
                      color: '#0077B5',
                      borderColor: '#0077B5',
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                    </svg>
                  </Button>
                  <Button 
                    component="a"
                    href="https://x.com/VerTechie"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined" 
                    sx={{ 
                      minWidth: 'auto', 
                      p: 1.5,
                      borderRadius: '50%',
                      color: '#0077B5',
                      borderColor: '#0077B5',
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </Button>
                  <Button 
                    component="a"
                    href="https://www.linkedin.com/company/vertechie/"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined" 
                    sx={{ 
                      minWidth: 'auto', 
                      p: 1.5,
                      borderRadius: '50%',
                      color: '#0077B5',
                      borderColor: '#0077B5',
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </Button>
                  <Button 
                    component="a"
                    href="https://youtube.com/@vertechie?si=rrH8NwbjiPR6uDr7"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined" 
                    sx={{ 
                      minWidth: 'auto', 
                      p: 1.5,
                      borderRadius: '50%',
                      color: '#0077B5',
                      borderColor: '#0077B5',
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
                    </svg>
                  </Button>
                </Box>
              </Box>
            </AnimatedBox>
          </Box>
        </Container>
      </PageSection>
      
      {/* FAQ Section */}
      <PageSection sx={{ bgcolor: '#f0f7ff' }}>
        <Container maxWidth="lg">
          <AnimatedBox delay={0.1}>
            <Typography
              variant="h4"
              component="h2"
              align="center"
              sx={{ 
                fontWeight: 700, 
                mb: 1,
                color: '#0A1929',
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{ 
                mb: 6, 
                maxWidth: 800, 
                mx: 'auto',
                color: 'text.secondary',
              }}
            >
              Find answers to commonly asked questions about VerTechie
            </Typography>
          </AnimatedBox>
          
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {faqItems.map((item, index) => (
              <AnimatedBox key={index} delay={0.2 + (index * 0.1)}>
                <StyledAccordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" color="text.secondary">
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </StyledAccordion>
              </AnimatedBox>
            ))}
          </Box>
        </Container>
      </PageSection>
      
      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Your message has been sent successfully. We'll get back to you soon!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact; 