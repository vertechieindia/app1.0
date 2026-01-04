import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, useTheme, InputAdornment, Chip, FormControlLabel, Checkbox, FormHelperText } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import ShieldIcon from '@mui/icons-material/Shield';

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
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const CTASection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  position: 'relative',
  overflow: 'hidden',
  color: 'white',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/grid-pattern.svg")',
    opacity: 0.1,
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

const FormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 15px 50px rgba(0, 0, 0, 0.2)',
  background: 'white',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 1.5,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    '&.Mui-focused': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }
  }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: '50px',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: '0 8px 20px rgba(26, 35, 126, 0.3)',
  transition: 'all 0.3s ease',
  animation: `${pulse} 2s infinite ease-in-out`,
  animationPlayState: 'paused',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 25px rgba(26, 35, 126, 0.4)',
    animationPlayState: 'running'
  }
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
  '& svg': {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1),
  }
}));

interface AccountTypeButtonProps {
  selected?: boolean;
  theme?: any;
}

const AccountTypeButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'selected'
})<AccountTypeButtonProps>(({ theme, selected = false }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: selected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
  color: theme.palette.text.primary,
  fontWeight: 600,
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.05)',
    borderColor: theme.palette.primary.light,
  }
}));

const features = [
  'Verified professionals & companies',
  'AI-powered job matching',
  'Direct messaging with professionals',
  'Access to learning platform',
  'Industry-specific networking',
  'Secure and private environment'
];

const CallToAction = () => {
  const theme = useTheme();
  const [accountType, setAccountType] = useState('professional');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Add form validation states
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    name: '',
    company: '',
    terms: ''
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Reset errors
    const newErrors = {
      email: '',
      name: '',
      company: '',
      terms: ''
    };
    
    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate name/company
    if (accountType === 'professional' && !name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (accountType === 'company' && !company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    // Validate terms
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms to continue';
    }
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }
    
    // Proceed with form submission
    console.log({ email, name, company, accountType, termsAccepted });
    
    // Here you would typically call an API
    // For now, we'll just simulate success
    alert('Account created successfully!');
  };

  return (
    <CTASection>
      <Container
        maxWidth={false}
        sx={{
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, md: 6, lg: 8 }
        }}
      >
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 6, md: 10 },
            alignItems: 'center'
          }}
        >
          {/* Left side - Value Proposition */}
          <AnimatedBox delay={0.1}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              Join the Future of 
              <Box component="span" sx={{ 
                color: '#ffffff', 
                position: 'relative', 
                display: { xs: 'block', sm: 'inline-block' },
                mt: { xs: 1, sm: 0 }
              }}>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    left: 0,
                    width: '100%',
                    height: '30%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 1,
                    zIndex: -1
                  }}
                />
                {' Tech Networking'}
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mb: 4,
                fontWeight: 400,
                opacity: 0.9,
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              VerTechie connects verified IT professionals with reputable companies. Join today and experience a platform designed specifically for the tech community.
            </Typography>

            <Box sx={{ mb: 5 }}>
              {features.map((feature, index) => (
                <FeatureItem key={index}>
                  <CheckCircleIcon sx={{ color: 'white' }} />
                  <Typography variant="body1">{feature}</Typography>
                </FeatureItem>
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                label="10,000+ Professionals" 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.15)', 
                  color: 'white',
                  fontWeight: 600,
                  py: 2,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }} 
              />
              <Chip 
                label="500+ Companies" 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.15)', 
                  color: 'white',
                  fontWeight: 600,
                  py: 2,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }} 
              />
              <Chip 
                label="200+ Courses" 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.15)', 
                  color: 'white',
                  fontWeight: 600,
                  py: 2,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                }} 
              />
            </Box>
          </AnimatedBox>

          {/* Right side - Sign up Form */}
          <AnimatedBox delay={0.3}>
            <FormCard>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 700, mb: 3, textAlign: 'center', color: 'text.primary' }}
              >
                Create Your Free Account
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                <AccountTypeButton
                  fullWidth
                  selected={accountType === 'professional'}
                  onClick={() => setAccountType('professional')}
                  startIcon={<PersonIcon />}
                  aria-pressed={accountType === 'professional'}
                >
                  Professional
                </AccountTypeButton>
                <AccountTypeButton
                  fullWidth
                  selected={accountType === 'company'}
                  onClick={() => setAccountType('company')}
                  startIcon={<BusinessIcon />}
                  aria-pressed={accountType === 'company'}
                >
                  Company
                </AccountTypeButton>
              </Box>

              <form onSubmit={handleSubmit}>
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label="Email Address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-required="true"
                  error={formSubmitted && !!errors.email}
                  helperText={formSubmitted && errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color={formSubmitted && errors.email ? "error" : "primary"} />
                      </InputAdornment>
                    ),
                  }}
                />
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  label={accountType === 'professional' ? "Full Name" : "Company Name"}
                  required
                  value={accountType === 'professional' ? name : company}
                  onChange={(e) => accountType === 'professional' 
                    ? setName(e.target.value) 
                    : setCompany(e.target.value)
                  }
                  aria-required="true"
                  error={formSubmitted && (accountType === 'professional' ? !!errors.name : !!errors.company)}
                  helperText={formSubmitted && (accountType === 'professional' ? errors.name : errors.company)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {accountType === 'professional' 
                          ? <PersonIcon color={formSubmitted && errors.name ? "error" : "primary"} /> 
                          : <BusinessIcon color={formSubmitted && errors.company ? "error" : "primary"} />
                        }
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={termsAccepted} 
                      onChange={(e) => setTermsAccepted(e.target.checked)} 
                      required
                      color={formSubmitted && errors.terms ? "error" : "primary"}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: formSubmitted && errors.terms ? 'error.main' : 'text.secondary' }}>
                      I agree to the Terms of Service and Privacy Policy
                    </Typography>
                  }
                  sx={{ mb: 1 }}
                />
                {formSubmitted && errors.terms && (
                  <FormHelperText error sx={{ mb: 2, ml: 2 }}>
                    {errors.terms}
                  </FormHelperText>
                )}

                <SubmitButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  disabled={!termsAccepted}
                  aria-label="Sign up for VerTechie account"
                >
                  Sign Up Free
                </SubmitButton>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, justifyContent: 'center' }}>
                  <ShieldIcon fontSize="small" sx={{ color: 'success.main', mr: 1 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Secure, Verified, and Private
                  </Typography>
                </Box>
              </form>
            </FormCard>
          </AnimatedBox>
        </Box>
      </Container>
    </CTASection>
  );
};

export default CallToAction; 