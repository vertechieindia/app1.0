import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LockResetIcon from '@mui/icons-material/LockReset';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockIcon from '@mui/icons-material/Lock';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

const PageContainer = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  padding: '20px',
});

const ResetCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: '20px',
  maxWidth: '450px',
  width: '100%',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
}));

// BroadcastChannel for cross-tab communication
const PASSWORD_RESET_CHANNEL = 'password-reset-channel';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const hasShownLinkSuccessRef = useRef(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [linkSuccessSnackbar, setLinkSuccessSnackbar] = useState(false);

  // Initialize BroadcastChannel
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      broadcastChannelRef.current = new BroadcastChannel(PASSWORD_RESET_CHANNEL);
    }
    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    } else if (token && !hasShownLinkSuccessRef.current) {
      // Show success popup when reset link is clicked (token detected)
      hasShownLinkSuccessRef.current = true;
      setLinkSuccessSnackbar(true);
    }
  }, [token]);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(pwd)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(pwd)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(pwd)) errors.push('One number');
    if (!/[!@#$%^&*]/.test(pwd)) errors.push('One special character (!@#$%^&*)');
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    const pwdErrors = validatePassword(password);
    if (pwdErrors.length > 0) {
      setError(`Password must contain: ${pwdErrors.join(', ')}`);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.RESET_PASSWORD), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          new_password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        
        // Broadcast password reset completion to other tabs
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({
            type: 'PASSWORD_RESET_COMPLETED',
            timestamp: Date.now(),
          });
        }
        
        // Also store in localStorage as fallback for older browsers
        localStorage.setItem('passwordResetCompleted', Date.now().toString());
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.detail || 'Failed to reset password. The link may have expired.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageContainer>
        <ResetCard elevation={0}>
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircleOutlineIcon
              sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
            />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f3460', mb: 2 }}>
              Password Reset Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your password has been changed successfully. You will be redirected to the login page in a few seconds.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)',
              }}
            >
              Go to Login
            </Button>
          </Box>
        </ResetCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ResetCard elevation={0}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <LockResetIcon sx={{ fontSize: 35, color: '#fff' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f3460' }}>
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Enter your new password below
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Password requirements hint */}
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: '8px' }}>
            <Typography variant="caption" color="text.secondary">
              Password must contain:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2, mt: 0.5 }}>
              <Typography component="li" variant="caption" color="text.secondary">
                At least 8 characters
              </Typography>
              <Typography component="li" variant="caption" color="text.secondary">
                One uppercase and lowercase letter
              </Typography>
              <Typography component="li" variant="caption" color="text.secondary">
                One number and one special character
              </Typography>
            </Box>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !token}
            sx={{
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : (
              'Reset Password'
            )}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none', color: '#64748b' }}
            >
              Back to Login
            </Button>
          </Box>
        </form>
      </ResetCard>
      
      {/* Success popup when reset link is clicked */}
      <Snackbar
        open={linkSuccessSnackbar}
        autoHideDuration={4000}
        onClose={() => setLinkSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setLinkSuccessSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Password reset link opened successfully! Please enter your new password below.
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ResetPassword;
