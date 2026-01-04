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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { StepComponentProps } from '../../types';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useOTPVerification } from '../../shared/hooks/useOTPVerification';
import { formatDateToMMDDYYYY } from '../../utils/formatters';
import { getPrimaryColor, getLightColor } from '../../utils/colors';
import AddressAutocomplete from '../../../ui/AddressAutocomplete';

const USPersonalInformation: React.FC<StepComponentProps> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
  role,
  location,
}) => {
  // All types use same colors: US = light thick blue, India = peacock green
  const roleType = role === 'hr' ? 'hr' : (role || 'techie');
  const primaryColor = getPrimaryColor(roleType as 'techie' | 'hr' | 'company' | 'school', 'US');
  const lightColor = getLightColor(roleType as 'techie' | 'hr' | 'company' | 'school', 'US');
  const borderColor = primaryColor;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Verification Hook
  const otpHook = useOTPVerification();

  // Sync email/phone verified state with formData
  useEffect(() => {
    if (formData.emailVerified && !otpHook.emailVerified) {
      // If formData says email is verified, we can't directly set hook state
      // This is handled by the verification process
    }
  }, [formData.emailVerified, otpHook.emailVerified]);

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

  // Auto-verify phone OTP when 6 digits entered
  // Note: Removed to prevent duplicate calls - handled in handlePhoneOTPChange instead

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      
      // Prevent phone field from being set to email value
      if (name === 'phone' && (value.includes('@') || value === 'abc@gmail.com' || value === formData.email)) {
        console.warn('Attempted to set phone field to email value, preventing update');
        return; // Don't update if trying to set phone to email
      }
      
      updateFormData({ [name]: value });
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
      // Validate password match
      if (name === 'password' || name === 'confirmPassword') {
        const password = name === 'password' ? value : formData.password;
        const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
        if (password && confirmPassword) {
          // Trim whitespace before comparison
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
    },
    [updateFormData, errors, setErrors, formData.password, formData.confirmPassword]
  );

  const handleSelectChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      const { name, value } = e.target;
      updateFormData({ [name as string]: value });
      setErrors({ ...errors, [name as string]: '' });
    },
    [updateFormData, errors, setErrors]
  );

  const handleEmailVerify = useCallback(async () => {
    const success = await otpHook.sendEmailOTP(formData.email || '');
    if (!success && otpHook.errors.email) {
      setErrors({ ...errors, email: otpHook.errors.email });
    }
  }, [formData.email, otpHook, errors, setErrors]);

  const handlePhoneVerify = useCallback(async () => {
    const success = await otpHook.sendPhoneOTP(formData.phone || '');
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

  // Track if we've already triggered verification for this OTP to prevent duplicate calls
  const verificationTriggeredRef = React.useRef(false);
  const lastVerifiedOTPRef = React.useRef<string>('');

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
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 4,
          color: '#333',
          fontSize: { xs: '1.3rem', md: '1.5rem' },
        }}
      >
        Personal Information
      </Typography>

      <Grid container spacing={3}>
        {/* Row 1: First Name and Middle Name */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={(role === 'company' || role === 'school') ? "Admin First Name **" : "First Name **"}
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleChange}
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
            name="middleName"
            value={formData.middleName || ''}
            onChange={handleChange}
          />
        </Grid>

        {/* Row 2: Last Name and Date of Birth */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={(role === 'company' || role === 'school') ? "Admin Last Name **" : "Last Name **"}
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleChange}
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
            label="Date of Birth **"
            name="dateOfBirth"
            type="text"
            placeholder="MM/DD/YYYY"
            value={
              formData.dateOfBirth
                ? formatDateToMMDDYYYY(formData.dateOfBirth)
                : ''
            }
            disabled={!!formData.dateOfBirth}
            onChange={(e) => {
              // Allow input in MM/DD/YYYY format
              let inputValue = e.target.value.replace(/\D/g, '');
              if (inputValue.length <= 8) {
                // Format as MM/DD/YYYY while typing
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
                  const month = inputValue.slice(0, 2);
                  const day = inputValue.slice(2, 4);
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
                const [month, day, year] = currentValue.split('/');
                if (
                  month &&
                  day &&
                  year &&
                  month.length === 2 &&
                  day.length === 2 &&
                  year.length === 4
                ) {
                  const dateValue = `${year}-${month}-${day}`;
                  updateFormData({ dateOfBirth: dateValue });
                }
              }
            }}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth || (formData.dateOfBirth ? '✓ Auto-filled from document verification' : '')}
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
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    disabled={!!formData.dateOfBirth}
                    onClick={(e) => {
                      // Find the TextField input element
                      const buttonElement = e.currentTarget;
                      const textFieldElement =
                        buttonElement.closest(
                          '.MuiTextField-root'
                        ) as HTMLElement;
                      const inputElement =
                        textFieldElement?.querySelector(
                          'input'
                        ) as HTMLInputElement;

                      if (inputElement) {
                        // Get the position of the input field
                        const rect = inputElement.getBoundingClientRect();

                        // Create a date input positioned right below the field
                        const dateInput = document.createElement('input');
                        dateInput.type = 'date';
                        dateInput.max = new Date().toISOString().split('T')[0];
                        if (
                          formData.dateOfBirth &&
                          formData.dateOfBirth.includes('-') &&
                          formData.dateOfBirth.length === 10
                        ) {
                          dateInput.value = formData.dateOfBirth;
                        }

                        // Position the input element directly below the field
                        dateInput.style.position = 'fixed';
                        dateInput.style.left = `${rect.left}px`;
                        dateInput.style.top = `${rect.bottom + 2}px`;
                        dateInput.style.width = `${rect.width}px`;
                        dateInput.style.height = '1px';
                        dateInput.style.opacity = '0';
                        dateInput.style.pointerEvents = 'none';
                        dateInput.style.zIndex = '9999';

                        document.body.appendChild(dateInput);

                        // Trigger date picker
                        setTimeout(() => {
                          dateInput.focus();
                          if (dateInput.showPicker && typeof dateInput.showPicker === 'function') {
                            try {
                              // showPicker() may return a Promise, but TypeScript types it as void
                              const pickerResult = (dateInput.showPicker as () => Promise<void> | void)();
                              if (pickerResult && typeof (pickerResult as Promise<void>).catch === 'function') {
                                (pickerResult as Promise<void>).catch(() => {
                                  dateInput.click();
                                });
                              } else {
                                dateInput.click();
                              }
                            } catch {
                              dateInput.click();
                            }
                          } else {
                            dateInput.click();
                          }
                        }, 10);

                        // Handle date selection
                        const handleChange = (event: any) => {
                          const selectedDate = event.target.value;
                          if (selectedDate) {
                            updateFormData({ dateOfBirth: selectedDate });
                          }
                          // Clean up
                          setTimeout(() => {
                            dateInput.removeEventListener('change', handleChange);
                            if (dateInput.parentNode) {
                              dateInput.parentNode.removeChild(dateInput);
                            }
                          }, 100);
                        };

                        dateInput.addEventListener('change', handleChange);
                      }
                    }}
                    sx={{ color: primaryColor }}
                  >
                    <CalendarTodayIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Row 3: Email and Phone Number with Verification */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={(role === 'company' || role === 'school') ? "Admin Email Address **" : "Email Address **"}
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            error={!!errors.email || !!otpHook.errors.email}
            helperText={errors.email || otpHook.errors.email}
            required
            disabled={otpHook.emailVerified}
            InputProps={{
              readOnly: otpHook.emailVerified,
              endAdornment: (
                <InputAdornment position="end">
                  {otpHook.emailVerified ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: borderColor,
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
                        color: borderColor,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        minWidth: 'auto',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        border: `1.5px solid ${borderColor}`,
                        backgroundColor: lightColor,
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.15)', // Light thick blue hover for US
                          border: `1.5px solid ${borderColor}`,
                        },
                        '&:disabled': {
                          color: 'rgba(25, 118, 210, 0.5)', // Light thick blue disabled for US
                          border: `1.5px solid rgba(25, 118, 210, 0.3)`, // Light thick blue border for US
                          backgroundColor: 'rgba(25, 118, 210, 0.05)', // Light thick blue background for US
                        },
                      }}
                    >
                      {otpHook.emailVerifying ? 'Sending...' : 'Verify'}
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
            label="Phone Number **"
            name="phone"
            type="tel"
            value={formData.phone || ''}
            onChange={handleChange}
            error={!!errors.phone || !!otpHook.errors.phone}
            helperText={errors.phone || otpHook.errors.phone}
            required
            disabled={!otpHook.emailVerified || otpHook.phoneVerified}
            sx={{
              '& .MuiInputBase-root.Mui-disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {otpHook.phoneVerified ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: borderColor,
                        fontWeight: 700,
                        cursor: 'default',
                      }}
                    >
                      Verified
                    </Typography>
                  ) : (
                    <Button
                      size="small"
                      onClick={handlePhoneVerify}
                      disabled={
                        otpHook.phoneVerifying ||
                        !formData.phone ||
                        !otpHook.emailVerified
                      }
                      sx={{
                        color: borderColor,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        minWidth: 'auto',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        border: `1.5px solid ${borderColor}`,
                        backgroundColor: lightColor,
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.15)', // Light thick blue hover for US
                          border: `1.5px solid ${borderColor}`,
                        },
                        '&:disabled': {
                          color: 'rgba(25, 118, 210, 0.5)', // Light thick blue disabled for US
                          border: `1.5px solid rgba(25, 118, 210, 0.3)`, // Light thick blue border for US
                          backgroundColor: 'rgba(25, 118, 210, 0.05)', // Light thick blue background for US
                        },
                      }}
                    >
                      {otpHook.phoneVerifying ? 'Sending...' : 'Verify'}
                    </Button>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Row 4: Password and Confirm Password (only show after phone verified) */}
        {otpHook.phoneVerified && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={(role === 'company' || role === 'school') ? "Admin Password **" : "Password **"}
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={handleChange}
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
                label={(role === 'company' || role === 'school') ? "Admin Confirm Password **" : "Confirm Password **"}
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword || ''}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
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
            label="Full Address **"
            placeholder="Start typing your address..."
            required
            error={!!errors.fullAddress}
            helperText={errors.fullAddress || (formData.fullAddress ? '✓ Address selected' : '')}
          />
        </Grid>

        {/* Row 6: Work Authorization (US only) */}
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.visaStatus}>
            <InputLabel>Work Authorization **</InputLabel>
            <Select
              name="visaStatus"
              value={formData.visaStatus || ''}
              onChange={handleSelectChange}
              label="Work Authorization **"
            >
              <MenuItem value="us_citizen">US Citizen</MenuItem>
              <MenuItem value="green_card">Green Card</MenuItem>
              <MenuItem value="gc_ead">GC EAD (Green Card EAD)</MenuItem>
              <MenuItem value="h1b">H1B</MenuItem>
              <MenuItem value="h4_ead">H4 EAD</MenuItem>
              <MenuItem value="l1">L1</MenuItem>
              <MenuItem value="l2_ead">L2 EAD</MenuItem>
              <MenuItem value="j1">J1 (Exchange Visitor)</MenuItem>
              <MenuItem value="j2_ead">J2 EAD</MenuItem>
              <MenuItem value="o1">O1 (Extraordinary Ability)</MenuItem>
              <MenuItem value="e1">E1 (Treaty Trader)</MenuItem>
              <MenuItem value="e2">E2 (Treaty Investor)</MenuItem>
              <MenuItem value="e3">E3 (Australian Specialty)</MenuItem>
              <MenuItem value="tn">TN (NAFTA)</MenuItem>
              <MenuItem value="opt_ead">OPT EAD</MenuItem>
              <MenuItem value="stem_opt_ead">STEM OPT EAD</MenuItem>
              <MenuItem value="cpt">CPT</MenuItem>
              <MenuItem value="f1">F1 (Student)</MenuItem>
              <MenuItem value="eb_pending">EB-1/2/3 (Green Card Pending)</MenuItem>
              <MenuItem value="asylum_ead">Asylum EAD</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Error Messages */}
      {(errors.submit || otpHook.errors.email || otpHook.errors.phone) && (
        <Box sx={{ mt: 2 }}>
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
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {errors.submit}
            </Alert>
          )}
        </Box>
      )}

      {/* Email OTP Dialog */}
      <Dialog
        open={otpHook.showEmailOTPDialog}
        onClose={() =>
          !otpHook.emailVerifying &&
          otpHook.setShowEmailOTPDialog(false)
        }
      >
        <DialogTitle>Verify Email</DialogTitle>
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
          >
            {otpHook.phoneVerifying ? 'Verifying...' : 'Verify'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default USPersonalInformation;

