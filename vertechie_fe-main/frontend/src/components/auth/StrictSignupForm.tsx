import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const WarningSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.warning.light,
  border: `1px solid ${theme.palette.warning.main}`,
  borderRadius: theme.shape.borderRadius,
}));

const OTPField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.dark,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

interface StrictSignupFormProps {
  role: string;
  onSubmit: (data: any) => Promise<void>;
}

const StrictSignupForm: React.FC<StrictSignupFormProps> = ({ role, onSubmit }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOTP = async (type: 'email' | 'phone') => {
    try {
      setLoading(true);
      setError('');
      // TODO: Implement OTP sending logic
      // This would call your backend API to send OTP
      setSuccess(`OTP sent to your ${type}`);
    } catch (err) {
      setError(`Failed to send OTP to ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (type: 'email' | 'phone') => {
    try {
      setLoading(true);
      setError('');
      // TODO: Implement OTP verification logic
      // This would call your backend API to verify OTP
      if (type === 'email') {
        setIsEmailVerified(true);
      } else {
        setIsPhoneVerified(true);
      }
      setSuccess(`${type} verified successfully`);
    } catch (err) {
      setError(`Failed to verify ${type} OTP`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isEmailVerified || !isPhoneVerified) {
      setError('Please verify both email and phone number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await onSubmit({
        ...formData,
        role,
      });
      
      setSuccess('Signup request submitted successfully');
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to submit signup request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <WarningSection>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          <Typography variant="h6" color="warning.main">
            STRICT WARNING BEFORE YOU SIGN UP
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This is your only warning. DO NOT provide any fake or misleading information.
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          VerTechie follows a zero-tolerance policy for false data. Your details — including skills, experience, education, visa, and employment — will be thoroughly verified through our strict background check process.
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          🚫 If any part of your profile is found to be fake:
        </Typography>
        <ul>
          <li>Your account will be permanently banned</li>
          <li>Your data will be blacklisted forever</li>
          <li>You will be barred from any future access to VerTechie</li>
        </ul>
        <Typography variant="body2">
          This platform is built to protect genuine talent.
          If you're here with honesty — you're welcome.
          If not — this is not the place for you.
        </Typography>
      </WarningSection>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
        sx={{ mb: 3 }}
      />

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isEmailVerified}
          sx={{ mb: 1 }}
        />
        {!isEmailVerified && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <OTPField
              fullWidth
              label="Email OTP"
              value={emailOTP}
              onChange={(e) => setEmailOTP(e.target.value)}
              disabled={loading}
            />
            <Button
              variant="outlined"
              onClick={() => handleSendOTP('email')}
              disabled={loading || !formData.email}
            >
              Send OTP
            </Button>
            <Button
              variant="contained"
              onClick={() => handleVerifyOTP('email')}
              disabled={loading || !emailOTP}
            >
              Verify
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
          disabled={isPhoneVerified}
          sx={{ mb: 1 }}
        />
        {!isPhoneVerified && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <OTPField
              fullWidth
              label="Phone OTP"
              value={phoneOTP}
              onChange={(e) => setPhoneOTP(e.target.value)}
              disabled={loading}
            />
            <Button
              variant="outlined"
              onClick={() => handleSendOTP('phone')}
              disabled={loading || !formData.phone}
            >
              Send OTP
            </Button>
            <Button
              variant="contained"
              onClick={() => handleVerifyOTP('phone')}
              disabled={loading || !phoneOTP}
            >
              Verify
            </Button>
          </Box>
        )}
      </Box>

      <TextField
        fullWidth
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        required
        sx={{ mb: 3 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        name="confirmPassword"
        type={showPassword ? 'text' : 'password'}
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        sx={{ mb: 3 }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={loading || !isEmailVerified || !isPhoneVerified}
        sx={{ mb: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Submit for Verification'}
      </Button>
    </Box>
  );
};

export default StrictSignupForm; 