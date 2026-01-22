import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  IconButton,
  Card,
  CardContent,
  Container,
  Grid,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { PublicUserRole } from '../types/auth';
import TechieSignupFlow from '../components/signup/flows/TechieSignupFlow';
import HRSignupFlow from '../components/signup/flows/HRSignupFlow';
// NOTE: CompanySignupFlow and SchoolSignupFlow removed - pages created after registration
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getPrimaryColor } from '../components/signup/utils/colors';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

type CountryCode = 'US' | 'IN' | 'UK' | 'CA' | 'DE' | 'CH' | 'CN';

interface SignupState {
  role: PublicUserRole | null;
  country: CountryCode | null;
}

interface SignupErrors {
  role?: string;
  country?: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: Role selection, 1: Country selection (for techie)
  const [state, setState] = useState<SignupState>({
    role: null,
    country: null,
  });
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // Memoize roleOptions to prevent recreation on every render
  // NOTE: Company and School signup removed - users can create these after registration
  const roleOptions = useMemo(() => [
    {
      id: 'techie' as PublicUserRole,
      title: 'Tech Professional',
      description: 'Join as a verified tech professional. Access jobs, practice coding, network with peers, and learn new skills.',
      icon: <WorkIcon sx={{ fontSize: 48 }} />,
      color: '#1976d2',
      features: [
        'Document verification',
        'Work authorization check',
        'Experience verification',
        'Education verification',
        'Create Company/School pages',
      ],
    },
    {
      id: 'hiring_manager' as PublicUserRole,
      title: 'Hiring Manager',
      description: 'Register as a hiring manager. Post jobs, track applicants, and find verified tech talent.',
      icon: <PersonIcon sx={{ fontSize: 48 }} />,
      color: '#2e7d32',
      features: [
        'Company verification',
        'Manager credentials',
        'ATS (Applicant Tracking)',
        'Access to talent pool',
        'Create Company/School pages',
      ],
    },
  ], []);

  const handleRoleSelect = (role: PublicUserRole) => {
    setState((prev) => ({ ...prev, role }));
    setErrors((prev) => ({ ...prev, role: '' }));
    
    // Only techie and hiring_manager roles available for signup
    // Company and School pages can be created after registration
    if (role === 'techie' || role === 'hiring_manager') {
      setStep(1);
    } else {
      setErrors((prev) => ({
        ...prev,
        role: `Please select Tech Professional or Hiring Manager. Company and School pages can be created after registration.`,
      }));
    }
  };

  const handleCountrySelect = (country: CountryCode) => {
    setState((prev) => ({ ...prev, country }));
    setErrors((prev) => ({ ...prev, country: '' }));
  };

  const handleBack = () => {
    if (step === 1) {
      setStep(0);
      setState((prev) => ({ ...prev, country: null }));
    }
  };

  const handleNext = () => {
    if (step === 0) {
      if (!state.role) {
        setErrors((prev) => ({ ...prev, role: 'Please select a role' }));
        return;
      }
      if (state.role === 'techie' || state.role === 'hiring_manager') {
        setStep(1);
      }
    } else if (step === 1) {
      if (!state.country) {
        setErrors((prev) => ({ ...prev, country: 'Please select your country' }));
        return;
      }
      // Country selected, advance to show appropriate signup flow
      setStep(2);
    }
  };

  // Helper function to map country code to backend format
  const mapCountryToBackend = (country: string): string => {
    const countryMap: Record<string, string> = {
      'US': 'USA',
      'IN': 'India',
      'UK': 'UK',
      'CA': 'Canada',
      'DE': 'Germany',
      'CH': 'Switzerland',
      'CN': 'China',
      'Canada': 'Canada',
      'Germany': 'Germany',
      'Switzerland': 'Switzerland',
      'China': 'China',
    };
    return countryMap[country] || country;
  };

  // Helper function to get country-specific government ID
  const getGovId = (data: any): string => {
    return data.ssn || data.panNumber || data.nino || data.sin || 
           data.sozialversicherungsnummer || data.ahvNumber || 
           data.residentIdCard || '';
  };

  // Generic signup submission handler
  const submitSignup = async (data: any, role: string) => {
    setIsSubmitting(true);
    try {
      const requestBody = {
        username: data.email,
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        middle_name: data.middleName || '',
        last_name: data.lastName,
        dob: data.dateOfBirth,
        phone: data.phone,
        full_address: data.fullAddress || '',
        country: mapCountryToBackend(data.country),
        role: role,
        gov_id: getGovId(data),
        face_verification: data.livePhoto || '',
        visa_status: data.visaStatus || '',
        email_verified: data.emailVerified || false,
        phone_verified: data.phoneVerified || false,
        experiences: data.experience || [],
        educations: data.education || [],
        // Company-specific fields
        company_name: data.companyName || '',
        company_website: data.companyWebsite || '',
        ein: data.ein || '',
        cin: data.cin || '',
        // School-specific fields
        school_name: data.schoolName || '',
        established_year: data.establishedYear || '',
        about: data.about || '',
      };

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Registration successful! Redirecting to verification page...',
          severity: 'success',
        });
        // Navigate to pending verification page after successful registration
        setTimeout(() => {
          navigate('/status/processing');
        }, 2000);
      } else {
        const errorMessage = result.detail || result.error || 
          Object.values(result).flat().join(', ') || 'Registration failed';
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSnackbar({
        open: true,
        message: 'Network error. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHRComplete = async (data: any) => {
    console.log('HR signup completed:', data);
    
    // Check if user is already registered (registration happens in SignupFlowContainer during Personal Info step)
    const token = localStorage.getItem('authToken') || data.access_token || data.token || data.access;
    
    if (token) {
      // User already registered successfully in SignupFlowContainer
      // Just show success and redirect - no need to call register API again
      console.log('User already registered, skipping duplicate registration call');
      setSnackbar({
        open: true,
        message: 'Registration successful! Redirecting to verification page...',
        severity: 'success',
      });
      setTimeout(() => {
        navigate('/status/processing');
      }, 2000);
    } else {
      // Fallback: only call register if not already registered
    await submitSignup(data, 'hiring_manager');
    }
  };

  const handleHRCancel = () => {
    setStep(1);
  };

  // NOTE: handleCompanyComplete, handleCompanyCancel, handleSchoolComplete, handleSchoolCancel removed
  // Company and School pages are created after registration via profile menu

  const handleTechieComplete = async (data: any) => {
    console.log('Techie signup completed:', data);
    
    // Check if user is already registered (registration happens in SignupFlowContainer during Personal Info step)
    const token = localStorage.getItem('authToken') || data.access_token || data.token || data.access;
    
    if (token) {
      // User already registered successfully in SignupFlowContainer
      // Just show success and redirect - no need to call register API again
      console.log('User already registered, skipping duplicate registration call');
      setSnackbar({
        open: true,
        message: 'Registration successful! Redirecting to verification page...',
        severity: 'success',
      });
      setTimeout(() => {
        navigate('/status/processing');
      }, 2000);
    } else {
      // Fallback: only call register if not already registered
    await submitSignup(data, 'techie');
    }
  };

  const handleTechieCancel = () => {
    setStep(1);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Render role selection step
  const renderRoleSelection = () => {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={8}
            sx={{
              borderRadius: 4,
              p: 4,
              background: 'white',
              maxWidth: 1200,
              mx: 'auto',
              mt: -5,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#1976d2',
                textAlign: 'center',
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Join VerTechie
            </Typography>

            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                mb: 4,
                color: 'text.secondary',
                fontSize: { xs: '0.9rem', md: '1rem' },
                px: 2,
              }}
            >
              Choose your role to begin the secure registration process. All registrations include comprehensive verification and fraud prevention.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4,
                gap: 1,
              }}
            >
              <SecurityIcon sx={{ color: '#2e7d32', fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#2e7d32',
                  fontSize: { xs: '0.9rem', md: '1.1rem' },
                }}
              >
                Enterprise-grade security and verification
              </Typography>
              <CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 28 }} />
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
              {roleOptions.map((option) => (
                <Grid item xs={12} sm={6} md={4} key={option.id}>
                  <Card
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${option.title} role`}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      border: state.role === option.id ? `3px solid ${option.color}` : '2px solid transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 8,
                        border: `3px solid ${option.color}`,
                      },
                      position: 'relative',
                    }}
                    onClick={() => handleRoleSelect(option.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRoleSelect(option.id);
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mb: 2,
                          color: option.color,
                        }}
                      >
                        {option.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          textAlign: 'center',
                          mb: 1,
                          color: 'text.primary',
                        }}
                      >
                        {option.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: 'center',
                          mb: 3,
                          color: 'text.secondary',
                          minHeight: 40,
                        }}
                      >
                        {option.description}
                      </Typography>
                      <Box sx={{ mt: 'auto' }}>
                        {option.features.map((feature, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: option.color,
                                mr: 1.5,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: '0.85rem',
                                color: option.color,
                                fontWeight: 500,
                              }}
                            >
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        pb: 2,
                        color: option.color,
                      }}
                    >
                      <ArrowForwardIcon />
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                mt: 4,
                p: 1,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: 'grey.700',
                  textAlign: 'center',
                  fontSize: { xs: '0.75rem', md: '0.85rem' },
                }}
              >
                <Box component="span" sx={{ color: 'black', fontWeight: 700 }}>
                  Important:
                </Box>{' '}
                Information will be verified via official documents and trusted partners. False submissions may lead to permanent account suspension.
              </Typography>
            </Box>

            {errors.role && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {errors.role}
              </Alert>
            )}
          </Paper>
        </Container>
      </Box>
    );
  };

  // Country configuration for selection cards
  const countryConfigs: Array<{
    code: CountryCode;
    name: string;
    flag: string;
    color: string;
    bgTint: string;
    features: string[];
    dateFormat: string;
  }> = [
    {
      code: 'US',
      name: 'United States',
      flag: '🇺🇸',
      color: '#1976d2',
      bgTint: 'rgba(25, 118, 210, 0.05)',
      features: ['SSN Document Capture', 'State ID/Passport Verification', 'Work Authorization'],
      dateFormat: 'MM/DD/YYYY',
    },
    {
      code: 'IN',
      name: 'India',
      flag: '🇮🇳',
      color: '#004D40',
      bgTint: 'rgba(0, 77, 64, 0.05)',
      features: ['PAN Card Verification', 'Aadhaar/DL Verification', 'Local Compliance'],
      dateFormat: 'DD/MM/YYYY',
    },
    {
      code: 'UK',
      name: 'United Kingdom',
      flag: '🇬🇧',
      color: '#1565c0',
      bgTint: 'rgba(21, 101, 192, 0.05)',
      features: ['National Insurance (NINO)', 'Passport/Driving Licence', 'Right to Work'],
      dateFormat: 'DD/MM/YYYY',
    },
    {
      code: 'CA',
      name: 'Canada',
      flag: '🇨🇦',
      color: '#c62828',
      bgTint: 'rgba(198, 40, 40, 0.05)',
      features: ['Social Insurance Number (SIN)', 'Provincial ID/Passport', 'Work Permit'],
      dateFormat: 'DD/MM/YYYY',
    },
    {
      code: 'DE',
      name: 'Germany',
      flag: '🇩🇪',
      color: '#212121',
      bgTint: 'rgba(33, 33, 33, 0.05)',
      features: ['Sozialversicherungsnummer', 'Personalausweis/Passport', 'Work Authorization'],
      dateFormat: 'DD.MM.YYYY',
    },
    {
      code: 'CH',
      name: 'Switzerland',
      flag: '🇨🇭',
      color: '#d32f2f',
      bgTint: 'rgba(211, 47, 47, 0.05)',
      features: ['AHV-Nummer', 'ID/Passport Verification', 'Work Permit'],
      dateFormat: 'DD.MM.YYYY',
    },
    {
      code: 'CN',
      name: 'China',
      flag: '🇨🇳',
      color: '#c62828',
      bgTint: 'rgba(198, 40, 40, 0.05)',
      features: ['Resident Identity Card', 'Hukou Verification', 'Employment Authorization'],
      dateFormat: 'YYYY-MM-DD',
    },
  ];

  // Render country selection step (for techie and hiring_manager)
  const renderCountrySelection = () => {
    const getRoleTitle = () => {
      if (state.role === 'hiring_manager') return 'Welcome To Hiring Manager Registration';
      return 'Welcome To Tech Professional Registration';
    };

    const selectedCountry = countryConfigs.find(c => c.code === state.country);
    const primaryColor = selectedCountry?.color || '#1976d2';

    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 4,
          px: 2,
        }}
      >
        <Container maxWidth="xl">
          <Paper
            elevation={12}
            sx={{
              borderRadius: 4,
              p: { xs: 3, md: 5 },
              background: 'white',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Header with back arrow */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center', position: 'relative' }}>
              <IconButton
                onClick={handleBack}
                sx={{ 
                  color: primaryColor, 
                  position: 'absolute', 
                  left: 0 
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: primaryColor,
                  fontSize: { xs: '1.3rem', md: '1.8rem' },
                  lineHeight: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                }}
              >
                {getRoleTitle()}
                <Typography component="span" sx={{ fontSize: '0.9rem', color: '#555', mt: 1 }}>
                  Choose your country to begin the secure registration process
                </Typography>
              </Typography>
            </Box>

            {/* Country Selection Cards - Grid Layout */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {countryConfigs.map((country) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={country.code}>
                  <Paper
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${country.name} as your country`}
                    elevation={state.country === country.code ? 8 : 2}
                    onClick={() => handleCountrySelect(country.code)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCountrySelect(country.code);
                      }
                    }}
                    sx={{
                      p: 2.5,
                      height: '100%',
                      cursor: 'pointer',
                      border: state.country === country.code 
                        ? `3px solid ${country.color}`
                        : '2px solid #e0e0e0',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      backgroundColor: state.country === country.code 
                        ? country.bgTint
                        : 'white',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                        borderColor: country.color,
                      },
                      minHeight: 220,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Flag and Code */}
                    <Box sx={{ textAlign: 'center', mb: 1 }}>
                      <Typography sx={{ fontSize: '2.5rem', lineHeight: 1 }}>
                        {country.flag}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: country.color,
                          mt: 0.5,
                        }}
                      >
                        {country.code}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: country.color,
                          fontSize: '0.85rem',
                        }}
                      >
                        {country.name}
                      </Typography>
                    </Box>

                    {/* Features */}
                    <Box sx={{ mt: 'auto' }}>
                      {country.features.map((feature, idx) => (
                        <Box 
                          key={idx} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontSize: '0.8rem',
                            mb: 0.5,
                          }}
                        >
                          <Box sx={{ 
                            mr: 1, 
                            color: country.color, 
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                          }}>•</Box>
                          <Typography variant="caption" sx={{ color: '#555' }}>
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#888', 
                          fontSize: '0.7rem',
                          display: 'block',
                          mt: 1,
                        }}
                      >
                        Date: {country.dateFormat}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Continue Registration Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!state.country}
                sx={{
                  background: selectedCountry 
                    ? `linear-gradient(90deg, ${selectedCountry.color} 0%, ${selectedCountry.color}dd 100%)`
                    : 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                  color: 'white',
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: selectedCountry 
                      ? `linear-gradient(90deg, ${selectedCountry.color}dd 0%, ${selectedCountry.color} 100%)`
                      : 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
                  },
                  '&:disabled': {
                    bgcolor: '#e0e0e0',
                    color: '#9e9e9e',
                  },
                }}
              >
                Continue Registration
                <ArrowForwardIcon sx={{ ml: 1 }} />
              </Button>
            </Box>

            {/* Important Note */}
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                <strong>Note:</strong> All information provided will be verified through official documents and
                cross-referenced with our verification partners.
              </Typography>
            </Box>

            {errors.country && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.country}
              </Alert>
            )}
          </Paper>
        </Container>
      </Box>
    );
  };

  // Render Snackbar for notifications
  const renderSnackbar = () => (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleCloseSnackbar} 
        severity={snackbar.severity} 
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );

  // Loading overlay
  const renderLoadingOverlay = () => isSubmitting && (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <Box sx={{ textAlign: 'center', color: 'white' }}>
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Submitting your registration...
        </Typography>
      </Box>
    </Box>
  );

  // Render appropriate step or flow
  // Check if we should show signup flow (after country selection)
  if (state.role === 'techie' && state.country && step >= 2) {
    return (
      <>
        {renderLoadingOverlay()}
        <TechieSignupFlow
          location={state.country}
          role={state.role || 'techie'}
          onComplete={handleTechieComplete}
          onCancel={handleTechieCancel}
        />
        {renderSnackbar()}
      </>
    );
  }

  if (state.role === 'hiring_manager' && state.country && step >= 2) {
    return (
      <>
        {renderLoadingOverlay()}
        <HRSignupFlow
          location={state.country}
          role={state.role || 'hiring_manager'}
          onComplete={handleHRComplete}
          onCancel={handleHRCancel}
        />
        {renderSnackbar()}
      </>
    );
  }

  // NOTE: Company and School signup flows removed
  // Users can create Company/School pages after registering as Tech Professional or Hiring Manager

  if (step === 0) {
    return (
      <>
        {renderRoleSelection()}
        {renderSnackbar()}
      </>
    );
  }

  if (step === 1) {
    return (
      <>
        {renderCountrySelection()}
        {renderSnackbar()}
      </>
    );
  }

  // Fallback (should not reach here)
  return (
    <>
      {renderRoleSelection()}
      {renderSnackbar()}
    </>
  );
};

export default Signup;