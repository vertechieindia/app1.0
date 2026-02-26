import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Alert,
  Button,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { StepComponentProps } from '../../types';
import { useOTPVerification } from '../../shared/hooks/useOTPVerification';
import { getPrimaryColor, getLightColor } from '../../utils/colors';
import { formatDateToDDMMYYYY } from '../../utils/formatters';
import AddressAutocomplete from '../../../ui/AddressAutocomplete';

const IndiaPersonalInformation: React.FC<StepComponentProps> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
  role,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneSkipped, setPhoneSkipped] = useState(false);

  // All types use same colors: US = light thick blue, India = peacock green
  const roleType = role === 'hr' ? 'hr' : (role || 'techie');
  const primaryColor = getPrimaryColor(roleType as 'techie' | 'hr' | 'company' | 'school', 'IN');
  const lightColor = getLightColor(roleType as 'techie' | 'hr' | 'company' | 'school', 'IN');
  const borderColor = primaryColor;

  // OTP Verification Hook
  const otpHook = useOTPVerification();

  // Update formData when OTP verification completes
  useEffect(() => {
    if (otpHook.emailVerified) {
      updateFormData({ emailVerified: true });
    }
  }, [otpHook.emailVerified, updateFormData]);

  useEffect(() => {
    if (otpHook.phoneVerified) {
      // Preserve both email and phone fields when updating phoneVerified status
      // Store current values before updating to prevent loss
      const currentEmail = formData.email;
      const currentPhone = formData.phone;

      // Only update phoneVerified status, don't overwrite other fields
      updateFormData({ phoneVerified: true });

      // Immediately restore email if it was lost (shouldn't happen, but safeguard)
      if (currentEmail && currentEmail.trim() && currentEmail !== 'abc@gmail.com') {
        // Use setTimeout to ensure updateFormData has processed
        setTimeout(() => {
          if (!formData.email || formData.email === 'abc@gmail.com' || formData.email.trim() === '') {
            updateFormData({ email: currentEmail });
          }
        }, 0);
      }

      // Preserve phone number - ensure it's not overwritten with email
      if (currentPhone && currentPhone.trim() && !currentPhone.includes('@')) {
        // Use setTimeout to ensure updateFormData has processed
        setTimeout(() => {
          // Check if phone was overwritten with email or invalid value
          if (!formData.phone || formData.phone.includes('@') || formData.phone === 'abc@gmail.com') {
            updateFormData({ phone: currentPhone });
          }
        }, 0);
      }
    }
  }, [otpHook.phoneVerified, updateFormData, formData.email, formData.phone]);

  // Auto-verify email OTP when 6 digits entered
  useEffect(() => {
    if (
      otpHook.emailOTP.length === 6 &&
      otpHook.showEmailOTPDialog &&
      !otpHook.emailVerifying
    ) {
      otpHook.verifyEmailOTP(otpHook.emailOTP, formData.email || '');
    }
  }, [
    otpHook.emailOTP,
    otpHook.showEmailOTPDialog,
    otpHook.emailVerifying,
    formData.email,
  ]);

  // Track if we've already triggered verification for this OTP to prevent duplicate calls
  const verificationTriggeredRef = React.useRef(false);
  const lastVerifiedOTPRef = React.useRef<string>('');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Prevent phone field from being set to email value
    if (field === 'phone') {
      if (newValue.includes('@') || newValue === 'abc@gmail.com' || newValue === formData.email) {
        console.warn('Attempted to set phone field to email value, preventing update');
        return;
      }
      // Only allow digits for phone
      const digitsOnly = newValue.replace(/\D/g, '');
      updateFormData({ [field]: digitsOnly });
      return;
    }

    updateFormData({ [field]: newValue });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    // Validate password match
    if (field === 'password' || field === 'confirmPassword') {
      // Use the new value from the event and the current formData value
      const password = field === 'password' ? newValue : formData.password;
      const confirmPassword = field === 'confirmPassword' ? newValue : formData.confirmPassword;

      if (password && confirmPassword) {
        if (password.trim() !== confirmPassword.trim()) {
          setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
        } else {
          const { confirmPassword: _, ...rest } = errors;
          setErrors(rest);
        }
      } else if (!password || !confirmPassword) {
        // Clear error if either field is empty
        const { confirmPassword: _, ...rest } = errors;
        setErrors(rest);
      }
    }
  };

  const handleEmailVerify = useCallback(async () => {
    const success = await otpHook.sendEmailOTP(formData.email || '');
    if (!success && otpHook.errors.email) {
      setErrors({ ...errors, email: otpHook.errors.email });
    }
  }, [formData.email, otpHook, errors, setErrors]);

  const handlePhoneVerify = useCallback(async () => {
    // Combine fixed dial code with digits
    const fullPhone = `+91${formData.phone || ''}`;
    const success = await otpHook.sendPhoneOTP(fullPhone);
    if (!success && otpHook.errors.phone) {
      setErrors({ ...errors, phone: otpHook.errors.phone });
    }
  }, [formData.phone, otpHook, errors, setErrors]);

  // Track last verified email OTP to prevent duplicate calls
  const lastVerifiedEmailOTPRef = React.useRef<string>('');
  const emailVerificationTriggeredRef = React.useRef(false);

  const handleEmailOTPChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
      otpHook.setEmailOTP(value);

      // Reset verification trigger when OTP changes to less than 6 digits
      if (value.length < 6) {
        emailVerificationTriggeredRef.current = false;
        lastVerifiedEmailOTPRef.current = ''; // Reset when user deletes OTP
      }

      // Clear error when user starts typing a different OTP
      if (errors.email && value !== lastVerifiedEmailOTPRef.current && value.length < 6) {
        setErrors({ ...errors, email: '' });
      }

      // Auto-verify when 6 digits are entered (only once per unique OTP value)
      // The hook itself will prevent duplicate calls for the same OTP
      if (
        value.length === 6 &&
        !otpHook.emailVerifying &&
        !emailVerificationTriggeredRef.current &&
        value !== lastVerifiedEmailOTPRef.current
      ) {
        emailVerificationTriggeredRef.current = true;
        lastVerifiedEmailOTPRef.current = value;
        otpHook.verifyEmailOTP(value, formData.email || '').then((success) => {
          // Reset trigger ref after verification completes
          emailVerificationTriggeredRef.current = false;
          // If verification failed, keep lastVerifiedEmailOTPRef to prevent retry of same wrong OTP
          // If successful, it's already handled in the hook
        }).catch(() => {
          // Reset trigger ref on error
          emailVerificationTriggeredRef.current = false;
        });
      }
    },
    [otpHook, errors, setErrors, formData.email]
  );

  const handlePhoneOTPChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
      otpHook.setPhoneOTP(value);

      // Reset verification trigger when OTP changes to less than 6 digits
      if (value.length < 6) {
        verificationTriggeredRef.current = false;
        lastVerifiedOTPRef.current = ''; // Reset when user deletes OTP
      }

      // Clear error when user starts typing a different OTP
      if (errors.phone && value !== lastVerifiedOTPRef.current && value.length < 6) {
        setErrors({ ...errors, phone: '' });
      }

      // Auto-verify when 6 digits are entered (only once per unique OTP value)
      // The hook itself will prevent duplicate calls for the same OTP
      if (
        value.length === 6 &&
        !otpHook.phoneVerifying &&
        !verificationTriggeredRef.current &&
        value !== lastVerifiedOTPRef.current &&
        (otpHook as any).phoneConfirmationResult
      ) {
        verificationTriggeredRef.current = true;
        lastVerifiedOTPRef.current = value;
        otpHook.verifyPhoneOTP(value, formData.email || '').then((success) => {
          // Reset trigger ref after verification completes
          verificationTriggeredRef.current = false;
          // If verification failed, keep lastVerifiedOTPRef to prevent retry of same wrong OTP
          // If successful, it's already handled in the hook
        }).catch(() => {
          // Reset trigger ref on error
          verificationTriggeredRef.current = false;
        });
      }
    },
    [otpHook, errors, setErrors, formData.email]
  );

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Personal Information
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Row 1: First Name and Middle Name */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={(role === 'company' || role === 'school') ? "Admin First Name *" : "First Name *"}
            value={formData.firstName || ''}
            onChange={handleChange('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName || (formData.firstName ? '✓ Auto-filled from document verification' : '')}
            required
            InputProps={{
              readOnly: !!formData.firstName,
            }}
            sx={{
              '& .MuiInputBase-root.Mui-readOnly': {
                backgroundColor: lightColor,
                '& fieldset': {
                  borderColor: borderColor,
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={(role === 'company' || role === 'school') ? "Admin Middle Name" : "Middle Name"}
            value={formData.middleName || ''}
            onChange={handleChange('middleName')}
          />
        </Grid>

        {/* Row 2: Last Name and Date of Birth */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={(role === 'company' || role === 'school') ? "Admin Last Name *" : "Last Name *"}
            value={formData.lastName || ''}
            onChange={handleChange('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName || (formData.lastName ? '✓ Auto-filled from document verification' : '')}
            required
            InputProps={{
              readOnly: !!formData.lastName,
            }}
            sx={{
              '& .MuiInputBase-root.Mui-readOnly': {
                backgroundColor: lightColor,
                '& fieldset': {
                  borderColor: borderColor,
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Birth *"
            type="text"
            placeholder="DD/MM/YYYY"
            value={
              formData.dateOfBirth
                ? formatDateToDDMMYYYY(formData.dateOfBirth)
                : ''
            }
            disabled={!!formData.dateOfBirth}
            onChange={(e) => {
              // Allow input in DD/MM/YYYY format
              let inputValue = e.target.value.replace(/\D/g, '');
              if (inputValue.length <= 8) {
                // Format as DD/MM/YYYY while typing
                let formattedValue = inputValue;
                if (inputValue.length > 2) {
                  formattedValue =
                    inputValue.slice(0, 2) + '/' + inputValue.slice(2);
                }
                if (inputValue.length > 4) {
                  formattedValue =
                    inputValue.slice(0, 2) +
                    '/' +
                    inputValue.slice(2, 4) +
                    '/' +
                    inputValue.slice(4);
                }

                // Convert to YYYY-MM-DD when complete (8 digits)
                if (inputValue.length === 8) {
                  const day = inputValue.slice(0, 2);
                  const month = inputValue.slice(2, 4);
                  const year = inputValue.slice(4, 8);
                  const dateValue = `${year}-${month}-${day}`;
                  updateFormData({ dateOfBirth: dateValue });
                } else {
                  // Store partial input temporarily
                  updateFormData({ dateOfBirth: formattedValue });
                }
              }
            }}
            onBlur={(e) => {
              // On blur, ensure we have a valid date format stored
              const currentValue = e.target.value;
              if (
                currentValue &&
                currentValue.length === 10 &&
                currentValue.includes('/')
              ) {
                const [day, month, year] = currentValue.split('/');
                if (
                  day &&
                  month &&
                  year &&
                  day.length === 2 &&
                  month.length === 2 &&
                  year.length === 4
                ) {
                  const dateValue = `${year}-${month}-${day}`;
                  updateFormData({ dateOfBirth: dateValue });
                }
              }
            }}
            InputLabelProps={{ shrink: true }}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth || (formData.dateOfBirth ? '✓ Auto-filled from document verification' : 'Format: DD/MM/YYYY')}
            required
            sx={{
              '& .MuiInputBase-root.Mui-disabled': {
                backgroundColor: lightColor,
                '& fieldset': {
                  borderColor: borderColor,
                },
              },
            }}
            InputProps={{
              readOnly: !!formData.dateOfBirth,
              endAdornment: !formData.dateOfBirth ? (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    disabled={!!formData.dateOfBirth}
                    onClick={(e) => {
                      // Find the TextField input element
                      const buttonElement = e.currentTarget;
                      const textFieldElement = buttonElement.closest('.MuiTextField-root') as HTMLElement;
                      const inputElement = textFieldElement?.querySelector('input') as HTMLInputElement;

                      if (inputElement) {
                        // Get the position of the input field
                        const rect = inputElement.getBoundingClientRect();

                        // Create a temporary date input
                        const tempInput = document.createElement('input');
                        tempInput.type = 'date';
                        tempInput.style.position = 'fixed';
                        tempInput.style.left = `${rect.left}px`;
                        tempInput.style.top = `${rect.bottom + 5}px`;
                        tempInput.style.width = `${rect.width}px`;
                        tempInput.style.opacity = '0';
                        tempInput.style.pointerEvents = 'none';

                        // Set current value if exists
                        if (formData.dateOfBirth && formData.dateOfBirth.includes('-') && formData.dateOfBirth.length === 10) {
                          tempInput.value = formData.dateOfBirth;
                        }

                        tempInput.max = new Date().toISOString().split('T')[0];

                        // Handle date selection
                        const handleDateChange = (event: any) => {
                          const selectedDate = event.target.value;
                          if (selectedDate) {
                            updateFormData({ dateOfBirth: selectedDate });
                          }
                          // Clean up
                          setTimeout(() => {
                            tempInput.removeEventListener('change', handleDateChange);
                            if (tempInput.parentNode) {
                              tempInput.parentNode.removeChild(tempInput);
                            }
                          }, 100);
                        };

                        tempInput.addEventListener('change', handleDateChange);
                        document.body.appendChild(tempInput);

                        // Trigger date picker
                        setTimeout(() => {
                          tempInput.focus();
                          if (tempInput.showPicker && typeof tempInput.showPicker === 'function') {
                            try {
                              (tempInput.showPicker as () => Promise<void>)().catch(() => {
                                tempInput.click();
                              });
                            } catch {
                              tempInput.click();
                            }
                          } else {
                            tempInput.click();
                          }
                        }, 10);
                      }
                    }}
                    sx={{ color: 'action.active' }}
                  >
                    <CalendarTodayIcon />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            }}
          />
        </Grid>

        {/* Row 3: Email and Phone */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={(role === 'company' || role === 'school') ? "Admin Email Address *" : "Email Address *"}
            type="email"
            value={formData.email || ''}
            onChange={handleChange('email')}
            error={!!errors.email || !!otpHook.errors.email}
            helperText={errors.email || otpHook.errors.email}
            required
            disabled={otpHook.emailVerified}
            sx={{
              '& .MuiInputBase-root.Mui-disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
            InputProps={{
              readOnly: otpHook.emailVerified,
              endAdornment: (
                <InputAdornment position="end">
                  {otpHook.emailVerified ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: primaryColor,
                        fontWeight: 600,
                        cursor: 'default',
                      }}
                    >
                      Verified
                    </Typography>
                  ) : (
                    <Button
                      size="small"
                      onClick={handleEmailVerify}
                      disabled={
                        otpHook.emailVerifying || !formData.email
                      }
                      sx={{
                        color: primaryColor,
                        fontWeight: 700,
                        fontSize: { xs: '0.72rem', sm: '0.875rem' },
                        textTransform: 'none',
                        minWidth: 'auto',
                        px: { xs: 0.75, sm: 1.5 },
                        py: 0.5,
                        whiteSpace: 'nowrap',
                        borderRadius: 1,
                        border: `1.5px solid ${borderColor}`,
                        backgroundColor: lightColor,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 77, 64, 0.15)', // Peacock green hover for India
                          border: `1.5px solid ${borderColor}`,
                        },
                        '&:disabled': {
                          color: 'rgba(0, 77, 64, 0.5)', // Peacock green disabled for India
                          border: '1.5px solid rgba(0, 77, 64, 0.3)', // Peacock green border for India
                          backgroundColor: 'rgba(0, 77, 64, 0.05)', // Peacock green background for India
                        },
                      }}
                    >
                      {otpHook.emailVerifying ? (isMobile ? '...' : 'Sending...') : 'Verify'}
                    </Button>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={phoneSkipped ? "Phone Number (Optional)" : "Phone Number"}
            type="tel"
            value={formData.phone || ''}
            onChange={handleChange('phone')}
            error={!!errors.phone || !!otpHook.errors.phone}
            helperText={errors.phone || otpHook.errors.phone || (phoneSkipped ? 'Skipped for now - you can verify later' : '')}
            placeholder="98765 43210"
            required={!phoneSkipped}
            disabled={!otpHook.emailVerified || otpHook.phoneVerified || phoneSkipped}
            sx={{
              '& .MuiInputBase-root.Mui-disabled': {
                backgroundColor: phoneSkipped ? 'rgba(255, 193, 7, 0.1)' : 'rgba(0, 0, 0, 0.04)',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ display: 'flex', alignItems: 'center', pr: 1, borderRight: '1px solid rgba(0,0,0,0.12)', mr: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>+91</Typography>
                  </Box>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {otpHook.phoneVerified ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#138808',
                        fontWeight: 700,
                        cursor: 'default',
                      }}
                    >
                      Verified
                    </Typography>
                  ) : phoneSkipped ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#f57c00',
                        fontWeight: 600,
                        cursor: 'default',
                      }}
                    >
                      Skipped
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Button
                        size="small"
                        onClick={() => {
                          setPhoneSkipped(true);
                          updateFormData({ phoneVerified: false, phoneSkipped: true });
                        }}
                        disabled={!otpHook.emailVerified}
                        sx={{
                          color: '#f57c00',
                          fontWeight: 600,
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          textTransform: 'none',
                          minWidth: 'auto',
                          px: { xs: 0.75, sm: 1 },
                          py: 0.5,
                          whiteSpace: 'nowrap',
                          display: { xs: 'none', sm: 'inline-flex' },
                          borderRadius: 1,
                          border: '1px solid #f57c00',
                          backgroundColor: 'rgba(255, 152, 0, 0.08)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 152, 0, 0.15)',
                          },
                          '&:disabled': {
                            color: 'rgba(245, 124, 0, 0.5)',
                            border: '1px solid rgba(245, 124, 0, 0.3)',
                          },
                        }}
                      >
                        Skip
                      </Button>
                      <Button
                        size="small"
                        onClick={handlePhoneVerify}
                        disabled={
                          otpHook.phoneVerifying ||
                          !formData.phone ||
                          !otpHook.emailVerified
                        }
                        sx={{
                          color: primaryColor,
                          fontWeight: 700,
                          fontSize: { xs: '0.72rem', sm: '0.875rem' },
                          textTransform: 'none',
                          minWidth: 'auto',
                          px: { xs: 0.75, sm: 1.5 },
                          py: 0.5,
                          whiteSpace: 'nowrap',
                          borderRadius: 1,
                          border: `1.5px solid ${borderColor}`,
                          backgroundColor: lightColor,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 77, 64, 0.15)',
                            border: `1.5px solid ${borderColor}`,
                          },
                          '&:disabled': {
                            color: 'rgba(0, 77, 64, 0.5)',
                            border: '1.5px solid rgba(0, 77, 64, 0.3)',
                            backgroundColor: 'rgba(0, 77, 64, 0.05)',
                          },
                        }}
                      >
                        {otpHook.phoneVerifying ? (isMobile ? '...' : 'Sending...') : 'Verify'}
                      </Button>
                    </Box>
                  )}
                </InputAdornment>
              ),
            }}
          />
          {!otpHook.phoneVerified && !phoneSkipped && isMobile && (
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="small"
                onClick={() => {
                  setPhoneSkipped(true);
                  updateFormData({ phoneVerified: false, phoneSkipped: true });
                }}
                disabled={!otpHook.emailVerified}
                sx={{
                  color: '#f57c00',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: 1,
                  py: 0.4,
                  borderRadius: 1,
                  border: '1px solid #f57c00',
                  backgroundColor: 'rgba(255, 152, 0, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 152, 0, 0.15)',
                  },
                }}
              >
                Skip
              </Button>
            </Box>
          )}
        </Grid>

        {/* Row 4: Password and Confirm Password (show after phone verified or skipped) */}
        {(otpHook.phoneVerified || formData.phoneVerified || phoneSkipped) && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={(role === 'company' || role === 'school') ? "Admin Password *" : "Password *"}
                type={showPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={handleChange('password')}
                error={!!errors.password}
                helperText={errors.password}
                required
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={(role === 'company' || role === 'school') ? "Admin Confirm Password *" : "Confirm Password *"}
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword || ''}
                onChange={handleChange('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </>
        )}

        {/* Row 5: Full Address */}
        <Grid item xs={12}>
          <AddressAutocomplete
            value={formData.fullAddress || ''}
            onChange={(address) => updateFormData({ fullAddress: address })}
            label="Full Address *"
            placeholder="Start typing your address..."
            required
            error={!!errors.fullAddress}
            helperText={errors.fullAddress || (formData.fullAddress ? '✓ Address selected' : '')}
          />
        </Grid>
      </Grid>

      {/* Error Messages */}
      {(errors.submit || otpHook.errors.email || otpHook.errors.phone) && (
        <Box sx={{ mt: 2 }}>
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {errors.submit}
            </Alert>
          )}
          {otpHook.errors.email && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {otpHook.errors.email}
            </Alert>
          )}
          {otpHook.errors.phone && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {otpHook.errors.phone}
            </Alert>
          )}
        </Box>
      )}

      {/* Email OTP Dialog */}
      <Dialog
        open={otpHook.showEmailOTPDialog}
        onClose={() =>
          !otpHook.emailVerifying && otpHook.setShowEmailOTPDialog(false)
        }
      >
        <DialogTitle>Verify Email Address</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter the 6-digit OTP sent to {formData.email}
          </Typography>
          <TextField
            fullWidth
            label="OTP"
            value={otpHook.emailOTP}
            onChange={handleEmailOTPChange}
            inputProps={{ maxLength: 6 }}
            disabled={otpHook.emailVerifying}
            sx={{ mb: 2 }}
            error={!!errors.email || !!otpHook.errors.email}
            helperText={errors.email || otpHook.errors.email}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              otpHook.setShowEmailOTPDialog(false);
              otpHook.setEmailOTP('');
            }}
            disabled={otpHook.emailVerifying}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!otpHook.emailVerifying && otpHook.emailOTP.length === 6) {
                otpHook.verifyEmailOTP(otpHook.emailOTP, formData.email || '');
              }
            }}
            variant="contained"
            disabled={
              otpHook.emailOTP.length !== 6 ||
              otpHook.emailVerifying ||
              (otpHook.emailOTP === lastVerifiedEmailOTPRef.current && lastVerifiedEmailOTPRef.current !== '')
            }
            startIcon={
              otpHook.emailVerifying ? <CircularProgress size={20} /> : null
            }
            sx={{
              backgroundColor: primaryColor,
              '&:hover': {
                backgroundColor: role === 'hr' ? '#1B5E20' : '#0f6b06',
              },
            }}
          >
            {otpHook.emailVerifying ? 'Verifying...' : 'Verify'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Phone OTP Dialog */}
      <Dialog
        open={otpHook.showPhoneOTPDialog}
        onClose={() =>
          !otpHook.phoneVerifying && otpHook.setShowPhoneOTPDialog(false)
        }
      >
        <DialogTitle>Verify Phone Number</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter the 6-digit OTP sent to {formData.phone}
          </Typography>
          <TextField
            fullWidth
            label="OTP"
            value={otpHook.phoneOTP}
            onChange={handlePhoneOTPChange}
            inputProps={{ maxLength: 6 }}
            disabled={otpHook.phoneVerifying}
            sx={{ mb: 2 }}
            error={!!errors.phone || !!otpHook.errors.phone}
            helperText={errors.phone || otpHook.errors.phone}
          />
          {/* Hidden reCAPTCHA container */}
          <div id="recaptcha-container" style={{ display: 'none' }} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              otpHook.setShowPhoneOTPDialog(false);
              otpHook.setPhoneOTP('');
              otpHook.cleanup();
            }}
            disabled={otpHook.phoneVerifying}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!otpHook.phoneVerifying && otpHook.phoneOTP.length === 6) {
                otpHook.verifyPhoneOTP(otpHook.phoneOTP, formData.email || '');
              }
            }}
            variant="contained"
            disabled={
              otpHook.phoneOTP.length !== 6 ||
              otpHook.phoneVerifying ||
              (otpHook.phoneOTP === lastVerifiedOTPRef.current && lastVerifiedOTPRef.current !== '')
            }
            startIcon={
              otpHook.phoneVerifying ? <CircularProgress size={20} /> : null
            }
            sx={{
              backgroundColor: primaryColor,
              '&:hover': {
                backgroundColor: role === 'hr' ? '#1B5E20' : '#0f6b06',
              },
            }}
          >
            {otpHook.phoneVerifying ? 'Verifying...' : 'Verify'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IndiaPersonalInformation;
