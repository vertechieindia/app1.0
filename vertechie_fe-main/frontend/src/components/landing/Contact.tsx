import React from 'react';
import { Box, Container, Typography, TextField, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const ContactSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0A1929 0%, #0d47a1 100%)',
  color: 'white',
  padding: theme.spacing(10, 0),
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
    backgroundImage: 'url("https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80")',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    opacity: 0.05,
    pointerEvents: 'none',
  }
}));

const ContactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#90caf9',
    },
    color: 'white',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  marginBottom: '16px',
});

const contactInfo = [
  {
    icon: <EmailIcon fontSize="large" />,
    title: 'Email Us',
    details: 'support@vertechie.com',
    link: 'mailto:support@vertechie.com'
  },
  {
    icon: <SupportAgentIcon fontSize="large" />,
    title: 'Help Center',
    details: 'Browse our knowledge base',
    link: '#'
  },
  {
    icon: <PhoneIcon fontSize="large" />,
    title: 'Call Us',
    details: '+1 (555) 123-4567',
    link: 'tel:+15551234567'
  }
];

// Grid replacement
const GridContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  margin: '-16px', // To counteract the padding of GridItem
});

interface GridItemProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  children: React.ReactNode;
}

const GridItem = styled(Box, {
  shouldForwardProp: (prop) => !['xs', 'sm', 'md', 'lg'].includes(prop as string),
})<GridItemProps>(({ xs = 12, sm, md, lg, theme }) => {
  const getWidth = (cols: number) => `${(cols / 12) * 100}%`;
  
  return {
    padding: '16px',
    flexGrow: 0,
    maxWidth: '100%',
    flexBasis: '100%',
    width: '100%',
    
    [theme.breakpoints.up('sm')]: {
      ...(sm && {
        maxWidth: getWidth(sm),
        flexBasis: getWidth(sm),
      }),
    },
    [theme.breakpoints.up('md')]: {
      ...(md && {
        maxWidth: getWidth(md),
        flexBasis: getWidth(md),
      }),
    },
    [theme.breakpoints.up('lg')]: {
      ...(lg && {
        maxWidth: getWidth(lg),
        flexBasis: getWidth(lg),
      }),
    },
  };
});

const Contact = () => {
  return (
    <ContactSection>
      <Container 
        maxWidth={false}
        sx={{ 
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, md: 6, lg: 8 } 
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Get in Touch
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ maxWidth: 700, mx: 'auto', opacity: 0.9 }}
          >
            Have questions or need assistance? We're here to help you get the most out of VerTechie's platform.
          </Typography>
        </Box>

        <GridContainer sx={{ mx: -2 }}>
          <GridItem xs={12} md={5}>
            <Box sx={{ height: '100%' }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Contact Information
              </Typography>
              
              <GridContainer>
                {contactInfo.map((info, index) => (
                  <GridItem xs={12} key={index}>
                    <ContactCard>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconWrapper>
                          {info.icon}
                        </IconWrapper>
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            {info.title}
                          </Typography>
                          <Typography 
                            component="a" 
                            href={info.link}
                            sx={{ 
                              color: 'inherit', 
                              textDecoration: 'none',
                              '&:hover': {
                                color: '#90caf9',
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            {info.details}
                          </Typography>
                        </Box>
                      </Box>
                    </ContactCard>
                  </GridItem>
                ))}
              </GridContainer>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconWrapper sx={{ width: 40, height: 40, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}>
                    <Typography variant="body1">X</Typography>
                  </IconWrapper>
                  <IconWrapper sx={{ width: 40, height: 40, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}>
                    <Typography variant="body1">in</Typography>
                  </IconWrapper>
                  <IconWrapper sx={{ width: 40, height: 40, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}>
                    <Typography variant="body1">f</Typography>
                  </IconWrapper>
                </Box>
              </Box>
            </Box>
          </GridItem>
          
          <GridItem xs={12} md={7}>
            <ContactCard>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Send us a message
              </Typography>
              <Box component="form">
                <GridContainer>
                  <GridItem xs={12} sm={6}>
                    <StyledTextField
                      label="First Name"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </GridItem>
                  <GridItem xs={12} sm={6}>
                    <StyledTextField
                      label="Last Name"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <StyledTextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      required
                      type="email"
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <StyledTextField
                      label="Subject"
                      variant="outlined"
                      fullWidth
                      required
                      select
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="">Please select</option>
                      <option value="account">Account Help</option>
                      <option value="platform">Platform Questions</option>
                      <option value="billing">Billing Inquiries</option>
                      <option value="feedback">Feedback</option>
                    </StyledTextField>
                  </GridItem>
                  <GridItem xs={12}>
                    <StyledTextField
                      label="Message"
                      variant="outlined"
                      fullWidth
                      required
                      multiline
                      rows={4}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: '8px',
                        fontSize: '1rem',
                        textTransform: 'none',
                        background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                        boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
                          boxShadow: '0 6px 25px rgba(33, 150, 243, 0.4)',
                        }
                      }}
                    >
                      Send Message
                    </Button>
                  </GridItem>
                </GridContainer>
              </Box>
            </ContactCard>
          </GridItem>
        </GridContainer>
      </Container>
    </ContactSection>
  );
};

export default Contact; 