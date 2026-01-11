import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { getApiUrl, API_ENDPOINTS } from '../config/api';
import Logger from '../utils/logger';

interface TokenResponse {
  refresh: string;
  access: string;
  user_data: {
    id: number;
    is_superuser: boolean;
    username: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    email: string;
    middle_name: string | null;
    dob: string | null;
    vertechie_id: string | null;
    country: string;
    gov_id: string | null;
    mobile_number: string;
    address: string | null;
    is_verified: boolean;
    email_verified: boolean;
    mobile_verified: boolean;
    groups: any[];
    user_permissions: any[];
  };
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [idleLogoutMessage, setIdleLogoutMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if user was logged out due to inactivity or session expiry
  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'idle') {
      setIdleLogoutMessage('You were logged out due to inactivity. Please login again.');
      // Clear the URL parameter
      window.history.replaceState({}, '', '/login');
    }
    
    // Check for session expired flag (set by API interceptor on 401)
    const sessionExpired = localStorage.getItem('sessionExpired');
    if (sessionExpired === 'true') {
      setIdleLogoutMessage('Your session has expired. Please login again.');
      localStorage.removeItem('sessionExpired');
    }
  }, [searchParams]);

  // Forgot Password states
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginApiUrl = getApiUrl(API_ENDPOINTS.AUTH.LOGIN);
      const response = await fetch(loginApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data: any = await response.json();

      if (!response.ok) {
        const errorMessage = 
          data.detail || 
          data.message || 
          data.error || 
          (typeof data === 'string' ? data : 'Login failed. Please check your credentials.');
        Logger.apiError('TOKEN', response.status, data, 'Login');
        setError(errorMessage);
        setLoading(false);
        return;
      }

      if (!data.access || !data.refresh || !data.user_data) {
        setError('Invalid response from server. Please try again.');
        setLoading(false);
        return;
      }

      localStorage.setItem('authToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('userData', JSON.stringify(data.user_data));
      Logger.info('Login successful', { userId: data.user_data.id, email: data.user_data.email }, 'Login');

      let userData = data.user_data;
      try {
        const usersApiUrl = getApiUrl(API_ENDPOINTS.USERS);
        const userResponse = await fetch(`${usersApiUrl}${userData.id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.access}`,
          },
        });

        if (userResponse.ok) {
          const userApiData = await userResponse.json();
          // Preserve groups/roles from login response when merging user data
          userData = {
            ...userApiData,
            groups: userApiData.groups || data.user_data.groups || [],
            roles: userApiData.roles || data.user_data.roles || [],
            admin_roles: userApiData.admin_roles || data.user_data.admin_roles || [],
          };
          localStorage.setItem('userData', JSON.stringify(userData));
        }
        
        // Also fetch user profile to get company info
        const profileUrl = getApiUrl('/users/me/profile');
        const profileResponse = await fetch(profileUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.access}`,
          },
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          // Add profile data (including company) to userData
          userData = {
            ...userData,
            current_company: profileData.current_company,
            current_position: profileData.current_position,
            profile: profileData,
          };
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      } catch (fetchError) {
        console.warn('Could not fetch user data from API, using token response data:', fetchError);
      }

      // Check user role and redirect accordingly
      const isHR = userData.groups?.some((g: any) => 
        g.name?.toLowerCase() === 'hr' || g.name?.toLowerCase() === 'hiring_manager'
      );
      
      if (userData.is_superuser) {
        navigate('/super-admin');
      } else if (userData.is_staff) {
        navigate('/admin');
      } else if (isHR) {
        // Redirect HR users to HR Dashboard
        navigate('/hr/dashboard');
      } else if (userData.is_active && !userData.is_verified) {
        navigate('/status/processing');
      } else if (userData.is_active && userData.is_verified) {
        // Redirect verified techie users to the home feed
        navigate('/techie/home/feed');
      } else if (!userData.is_active && !userData.is_verified) {
        navigate('/status/rejected');
      } else {
        navigate('/techie/home/feed');
      }
    } catch (err: any) {
      Logger.error('Login failed', { error: err.message, email }, 'Login');
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login. Please try again.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotError('Please enter your email address');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    try {
      // Call forgot password API endpoint
      const response = await fetch(getApiUrl(API_ENDPOINTS.FORGOT_PASSWORD), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        Logger.info('Password reset email sent', { email: forgotEmail }, 'Login');
        setForgotSuccess('Password reset link has been sent to your email address.');
        setForgotEmail('');
      } else {
        Logger.apiError('FORGOT_PASSWORD', response.status, data, 'Login');
        setForgotError(data.detail || data.message || 'Failed to send reset link. Please try again.');
      }
    } catch (err) {
      Logger.error('Forgot password failed', { email: forgotEmail }, 'Login');
      setForgotError('An error occurred. Please try again later.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
    setForgotEmail('');
    setForgotError('');
    setForgotSuccess('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(94, 234, 212, 0.1) 0%, transparent 50%)',
          animation: 'pulse 15s ease-in-out infinite',
        },
        '@keyframes pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      }}
    >
      {/* Animated Grid Lines */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(94, 234, 212, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(94, 234, 212, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 20s linear infinite',
          '@keyframes gridMove': {
            '0%': { transform: 'translate(0, 0)' },
            '100%': { transform: 'translate(60px, 60px)' },
          },
        }}
      />

      {/* Glowing Orb - Top Left */}
      <Box
        sx={{
          position: 'absolute',
          top: '8%',
          left: '8%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(94, 234, 212, 0.4) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'glow 4s ease-in-out infinite',
          '@keyframes glow': {
            '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
            '50%': { opacity: 0.8, transform: 'scale(1.2)' },
          },
        }}
      />

      {/* Glowing Orb - Bottom Right */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 114, 182, 0.3) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'glow 5s ease-in-out infinite reverse',
        }}
      />

      {/* Floating Cube */}
      <Box
        sx={{
          position: 'absolute',
          top: '55%',
          right: '8%',
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 100%)',
          borderRadius: '8px',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          animation: 'floatRotate 8s ease-in-out infinite',
          '@keyframes floatRotate': {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '50%': { transform: 'translateY(-30px) rotate(180deg)' },
          },
        }}
      />

      {/* Diamond Shape */}
      <Box
        sx={{
          position: 'absolute',
          top: '75%',
          left: '20%',
          width: '30px',
          height: '30px',
          background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.4) 0%, rgba(236, 72, 153, 0.2) 100%)',
          transform: 'rotate(45deg)',
          animation: 'floatRotate 6s ease-in-out infinite',
        }}
      />

      {/* Hexagon */}
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '50px',
          height: '28px',
          background: 'rgba(94, 234, 212, 0.15)',
          animation: 'float 7s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-14px',
            left: 0,
            width: 0,
            height: 0,
            borderLeft: '25px solid transparent',
            borderRight: '25px solid transparent',
            borderBottom: '14px solid rgba(94, 234, 212, 0.15)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-14px',
            left: 0,
            width: 0,
            height: 0,
            borderLeft: '25px solid transparent',
            borderRight: '25px solid transparent',
            borderTop: '14px solid rgba(94, 234, 212, 0.15)',
          },
        }}
      />

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top: `${10 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
            borderRadius: '50%',
            background: ['#5eead4', '#f472b6', '#fbbf24', '#8b5cf6'][i % 4],
            opacity: 0.4 + Math.random() * 0.3,
            animation: `particle${i % 3} ${5 + Math.random() * 5}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
            '@keyframes particle0': {
              '0%, 100%': { transform: 'translate(0, 0)' },
              '25%': { transform: 'translate(20px, -20px)' },
              '50%': { transform: 'translate(0, -40px)' },
              '75%': { transform: 'translate(-20px, -20px)' },
            },
            '@keyframes particle1': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '50%': { transform: 'translate(-30px, 20px) scale(1.5)' },
            },
            '@keyframes particle2': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-50px)' },
            },
          }}
        />
      ))}

      {/* Shooting Star - 1 */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '60%',
          width: '80px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #5eead4, transparent)',
          borderRadius: '50%',
          animation: 'shoot 4s linear infinite',
          animationDelay: '0s',
          '@keyframes shoot': {
            '0%': { transform: 'translateX(-200px) translateY(0)', opacity: 0 },
            '10%': { opacity: 1 },
            '90%': { opacity: 1 },
            '100%': { transform: 'translateX(400px) translateY(200px)', opacity: 0 },
          },
        }}
      />

      {/* Shooting Star - 2 */}
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '80%',
          width: '60px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #f472b6, transparent)',
          borderRadius: '50%',
          animation: 'shoot 5s linear infinite',
          animationDelay: '2s',
        }}
      />

      {/* Pulsing Circle */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '30%',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'transparent',
          border: '2px solid rgba(94, 234, 212, 0.5)',
          animation: 'pulse2 3s ease-in-out infinite',
          '@keyframes pulse2': {
            '0%': { transform: 'scale(1)', opacity: 1 },
            '100%': { transform: 'scale(3)', opacity: 0 },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#5eead4',
          },
        }}
      />

      {/* Cross/Plus Shape */}
      <Box
        sx={{
          position: 'absolute',
          top: '70%',
          right: '25%',
          width: '20px',
          height: '20px',
          animation: 'spinSlow 12s linear infinite',
          '@keyframes spinSlow': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '0',
            width: '100%',
            height: '3px',
            background: 'rgba(251, 191, 36, 0.4)',
            transform: 'translateY(-50%)',
            borderRadius: '2px',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '50%',
            width: '3px',
            height: '100%',
            background: 'rgba(251, 191, 36, 0.4)',
            transform: 'translateX(-50%)',
            borderRadius: '2px',
          },
        }}
      />

      {/* Triangle */}
      <Box
        sx={{
          position: 'absolute',
          top: '45%',
          left: '5%',
          width: 0,
          height: 0,
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderBottom: '26px solid rgba(139, 92, 246, 0.25)',
          animation: 'float 5s ease-in-out infinite',
        }}
      />

      <Container maxWidth="sm" sx={{mt: -1, position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'slideUp 0.6s ease-out',
            '@keyframes slideUp': {
              '0%': { opacity: 0, transform: 'translateY(30px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          {/* Logo/Brand Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {/* <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '-20px auto 20px',
                boxShadow: '0 10px 30px rgba(15, 52, 96, 0.3)',
              }}
            >
              <LoginIcon sx={{ fontSize: 25, color: '#5eead4' }} />
            </Box> */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Sign in to continue to your account
        </Typography>
          </Box>

        {idleLogoutMessage && (
            <Alert
              severity="warning"
              onClose={() => setIdleLogoutMessage('')}
              sx={{
                mb: 3,
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                '& .MuiAlert-icon': {
                  color: '#ffc107',
                },
              }}
            >
            {idleLogoutMessage}
          </Alert>
        )}

        {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '12px',
                animation: 'shake 0.5s ease-in-out',
                '@keyframes shake': {
                  '0%, 100%': { transform: 'translateX(0)' },
                  '25%': { transform: 'translateX(-5px)' },
                  '75%': { transform: 'translateX(5px)' },
                },
              }}
            >
            {error}
          </Alert>
        )}

          <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <TextField
            fullWidth
              label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
              autoComplete="off"
              inputProps={{
                autoComplete: 'new-email',
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  backgroundColor: '#f8fafc',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#fff',
                    boxShadow: '0 0 0 4px rgba(94, 234, 212, 0.2)',
                  },
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#14b8a6',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#14b8a6',
                },
              }}
            />

          <TextField
            fullWidth
            label="Password"
              type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
              autoComplete="new-password"
              inputProps={{
                autoComplete: 'new-password',
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#94a3b8' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  backgroundColor: '#f8fafc',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#fff',
                    boxShadow: '0 0 0 4px rgba(94, 234, 212, 0.2)',
                  },
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#14b8a6',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#14b8a6',
                },
              }}
            />

            {/* Forgot Password Link */}
            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Button
                onClick={() => setForgotPasswordOpen(true)}
                sx={{
                  textTransform: 'none',
                  color: '#0f3460',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#0d9488',
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot Password?
              </Button>
            </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
              sx={{
                py: 1.8,
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)',
                boxShadow: '0 10px 30px rgba(15, 52, 96, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)',
                  boxShadow: '0 15px 40px rgba(15, 52, 96, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&:disabled': {
                  background: '#cbd5e1',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={26} sx={{ color: '#fff' }} />
              ) : (
                'Sign In'
              )}
          </Button>
        </Box>

          <Divider sx={{ my: 4 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#94a3b8',
                px: 2,
                backgroundColor: 'transparent',
              }}
            >
              New here?
          </Typography>
          </Divider>

          <Button
            component={Link}
            to="/signup"
            fullWidth
            variant="outlined"
            size="large"
            sx={{
              py: 1.6,
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderColor: '#e2e8f0',
              borderWidth: '2px',
              color: '#0f3460',
              '&:hover': {
                borderWidth: '2px',
                borderColor: '#14b8a6',
                backgroundColor: 'rgba(20, 184, 166, 0.05)',
              },
            }}
          >
            Create an Account
          </Button>
      </Paper>

        {/* Footer */}
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            mt: 4,
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          © 2025 Vertechie. All rights reserved.
        </Typography>
    </Container>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={handleCloseForgotPassword}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f3460' }}>
              Forgot Password
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              Enter your email to receive a password reset link
            </Typography>
          </Box>
          <IconButton onClick={handleCloseForgotPassword} sx={{ color: '#94a3b8' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {forgotSuccess && (
            <Alert
              severity="success"
              sx={{ mb: 3, borderRadius: '12px' }}
            >
              {forgotSuccess}
            </Alert>
          )}

          {forgotError && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: '12px' }}
            >
              {forgotError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                backgroundColor: '#f8fafc',
                '&.Mui-focused': {
                  backgroundColor: '#fff',
                  boxShadow: '0 0 0 4px rgba(94, 234, 212, 0.2)',
                },
                '& fieldset': {
                  borderColor: '#e2e8f0',
                  borderWidth: '2px',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#14b8a6',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#14b8a6',
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseForgotPassword}
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: '12px',
              textTransform: 'none',
              color: '#64748b',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleForgotPassword}
            variant="contained"
            disabled={forgotLoading}
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)',
              },
            }}
          >
            {forgotLoading ? (
              <CircularProgress size={22} sx={{ color: '#fff' }} />
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login; 
