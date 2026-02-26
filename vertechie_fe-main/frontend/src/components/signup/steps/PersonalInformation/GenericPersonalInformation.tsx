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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { StepComponentProps } from '../../types';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useOTPVerification } from '../../shared/hooks/useOTPVerification';
import { getPrimaryColor, getLightColor, SignupLocation } from '../../utils/colors';
import AddressAutocomplete from '../../../ui/AddressAutocomplete';

// Country-specific configurations
const countryConfig: Record<string, {
  name: string;
  dialCode: string;
  dateFormat: string;
  dateFormatExample: string;
  workAuthLabel: string;
  workAuthOptions: Array<{ value: string; label: string }>;
}> = {
  UK: {
    name: 'United Kingdom',
    dialCode: '+44',
    dateFormat: 'DD/MM/YYYY',
    dateFormatExample: 'DD/MM/YYYY',
    workAuthLabel: 'Right to Work Status',
    workAuthOptions: [
      { value: 'british_citizen', label: 'British Citizen' },
      { value: 'settled_status', label: 'Settled Status (EU)' },
      { value: 'pre_settled_status', label: 'Pre-Settled Status' },
      { value: 'tier2_visa', label: 'Skilled Worker Visa (Tier 2)' },
      { value: 'tier5_visa', label: 'Temporary Worker Visa (Tier 5)' },
      { value: 'global_talent', label: 'Global Talent Visa' },
      { value: 'graduate_visa', label: 'Graduate Visa' },
      { value: 'student_visa', label: 'Student Visa' },
      { value: 'spouse_visa', label: 'Spouse/Partner Visa' },
      { value: 'other', label: 'Other' },
    ],
  },
  CA: {
    name: 'Canada',
    dialCode: '+1',
    dateFormat: 'DD/MM/YYYY',
    dateFormatExample: 'DD/MM/YYYY',
    workAuthLabel: 'Work Authorization',
    workAuthOptions: [
      { value: 'canadian_citizen', label: 'Canadian Citizen' },
      { value: 'permanent_resident', label: 'Permanent Resident' },
      { value: 'open_work_permit', label: 'Open Work Permit' },
      { value: 'closed_work_permit', label: 'Employer-Specific Work Permit' },
      { value: 'pgwp', label: 'Post-Graduation Work Permit (PGWP)' },
      { value: 'iec', label: 'International Experience Canada (IEC)' },
      { value: 'student_permit', label: 'Study Permit with Work Authorization' },
      { value: 'bridging_permit', label: 'Bridging Open Work Permit' },
      { value: 'other', label: 'Other' },
    ],
  },
  DE: {
    name: 'Germany',
    dialCode: '+49',
    dateFormat: 'DD.MM.YYYY',
    dateFormatExample: 'DD.MM.YYYY',
    workAuthLabel: 'Arbeitserlaubnis',
    workAuthOptions: [
      { value: 'german_citizen', label: 'German Citizen (Deutscher Staatsbürger)' },
      { value: 'eu_citizen', label: 'EU/EEA Citizen' },
      { value: 'blue_card', label: 'EU Blue Card (Blaue Karte EU)' },
      { value: 'work_permit', label: 'Work Permit (Arbeitserlaubnis)' },
      { value: 'residence_permit', label: 'Residence Permit (Aufenthaltserlaubnis)' },
      { value: 'job_seeker_visa', label: 'Job Seeker Visa' },
      { value: 'student_visa', label: 'Student Visa with Work Rights' },
      { value: 'freelance_visa', label: 'Freelance Visa' },
      { value: 'other', label: 'Other' },
    ],
  },
  CH: {
    name: 'Switzerland',
    dialCode: '+41',
    dateFormat: 'DD.MM.YYYY',
    dateFormatExample: 'DD.MM.YYYY',
    workAuthLabel: 'Arbeitsbewilligung',
    workAuthOptions: [
      { value: 'swiss_citizen', label: 'Swiss Citizen' },
      { value: 'permit_c', label: 'Permit C (Settlement)' },
      { value: 'permit_b', label: 'Permit B (Residence)' },
      { value: 'permit_l', label: 'Permit L (Short-term)' },
      { value: 'permit_g', label: 'Permit G (Cross-border)' },
      { value: 'eu_efta', label: 'EU/EFTA Citizen' },
      { value: 'other', label: 'Other' },
    ],
  },
  CN: {
    name: 'China',
    dialCode: '+86',
    dateFormat: 'YYYY-MM-DD',
    dateFormatExample: 'YYYY-MM-DD',
    workAuthLabel: '工作许可 / Work Authorization',
    workAuthOptions: [
      { value: 'chinese_citizen', label: 'Chinese Citizen (中国公民)' },
      { value: 'z_visa', label: 'Z Visa (Work Visa / 工作签证)' },
      { value: 'r_visa', label: 'R Visa (Talent Visa / 人才签证)' },
      { value: 'work_permit', label: 'Work Permit (外国人工作许可证)' },
      { value: 'residence_permit', label: 'Residence Permit (居留许可)' },
      { value: 'other', label: 'Other' },
    ],
  },
  US: {
    name: 'USA',
    dialCode: '+1',
    dateFormat: 'MM/DD/YYYY',
    dateFormatExample: 'MM/DD/YYYY',
    workAuthLabel: 'Work Authorization',
    workAuthOptions: [
      { value: 'us_citizen', label: 'US Citizen' },
      { value: 'permanent_resident', label: 'Permanent Resident (Green Card)' },
      { value: 'h1b', label: 'H-1B Visa' },
      { value: 'l1', label: 'L-1 Visa' },
      { value: 'opt', label: 'F-1 (OPT)' },
      { value: 'other', label: 'Other' },
    ],
  },
};

// Update existing configs logic removed as it is now integrated into the main object
const updateConfigs = () => {
  // No-op as dialysis codes are now in the initial definition
};

const GenericPersonalInformation: React.FC<StepComponentProps> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
  role,
  location,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const config = countryConfig[location as string] || countryConfig.UK;
  const roleType = role === 'hr' ? 'hr' : (role || 'techie');
  const primaryColor = getPrimaryColor(roleType as 'techie' | 'hr' | 'company' | 'school', location as SignupLocation);
  const lightColor = getLightColor(roleType as 'techie' | 'hr' | 'company' | 'school', location as SignupLocation);
  const borderColor = primaryColor;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const otpHook = useOTPVerification();

  useEffect(() => {
    if (otpHook.emailVerified) {
      updateFormData({ emailVerified: true });
    }
  }, [otpHook.emailVerified, updateFormData]);

  useEffect(() => {
    if (otpHook.phoneVerified) {
      updateFormData({ phoneVerified: true });
    }
  }, [otpHook.phoneVerified, updateFormData]);

  useEffect(() => {
    if (
      otpHook.emailOTP.length === 6 &&
      otpHook.showEmailOTPDialog &&
      !otpHook.emailVerifying
    ) {
      otpHook.verifyEmailOTP(otpHook.emailOTP, formData.email || '');
    }
  }, [otpHook.emailOTP, otpHook.showEmailOTPDialog, otpHook.emailVerifying, formData.email]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (name === 'phone') {
        if (value.includes('@') || value === formData.email) return;
        // Only allow digits
        const digitsOnly = value.replace(/\D/g, '');
        updateFormData({ [name]: digitsOnly });
        return;
      }
      updateFormData({ [name]: value });
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
      if (name === 'password' || name === 'confirmPassword') {
        const password = name === 'password' ? value : formData.password;
        const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
        if (password && confirmPassword && password.trim() !== confirmPassword.trim()) {
          setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
        } else {
          const { confirmPassword: _, ...rest } = errors;
          setErrors(rest);
        }
      }
    },
    [updateFormData, errors, setErrors, formData.password, formData.confirmPassword, formData.email]
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
    const dialCode = (countryConfig[location as string] || countryConfig.UK).dialCode;
    const fullPhone = `${dialCode}${formData.phone || ''}`;
    const success = await otpHook.sendPhoneOTP(fullPhone);
    if (!success && otpHook.errors.phone) {
      setErrors({ ...errors, phone: otpHook.errors.phone });
    }
  }, [formData.phone, otpHook, errors, setErrors, location]);

  const lastVerifiedEmailOTPRef = React.useRef<string>('');
  const emailVerificationTriggeredRef = React.useRef(false);

  const handleEmailOTPChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
      otpHook.setEmailOTP(value);

      if (value.length < 6) {
        emailVerificationTriggeredRef.current = false;
        lastVerifiedEmailOTPRef.current = '';
      }

      if (
        value.length === 6 &&
        !otpHook.emailVerifying &&
        !emailVerificationTriggeredRef.current &&
        value !== lastVerifiedEmailOTPRef.current
      ) {
        emailVerificationTriggeredRef.current = true;
        lastVerifiedEmailOTPRef.current = value;
        otpHook.verifyEmailOTP(value, formData.email || '').finally(() => {
          emailVerificationTriggeredRef.current = false;
        });
      }
    },
    [otpHook, formData.email]
  );

  const verificationTriggeredRef = React.useRef(false);
  const lastVerifiedOTPRef = React.useRef<string>('');

  const handlePhoneOTPChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
      otpHook.setPhoneOTP(value);

      if (value.length < 6) {
        verificationTriggeredRef.current = false;
        lastVerifiedOTPRef.current = '';
      }

      if (
        value.length === 6 &&
        !otpHook.phoneVerifying &&
        !verificationTriggeredRef.current &&
        value !== lastVerifiedOTPRef.current &&
        (otpHook as any).phoneConfirmationResult
      ) {
        verificationTriggeredRef.current = true;
        lastVerifiedOTPRef.current = value;
        otpHook.verifyPhoneOTP(value, formData.email || '').finally(() => {
          verificationTriggeredRef.current = false;
        });
      }
    },
    [otpHook, formData.email]
  );

  // Format date based on country
  const formatDateForDisplay = (date: string) => {
    if (!date) return '';
    if (!date.includes('-')) return date;

    const [year, month, day] = date.split('-');
    if (location === 'CN') {
      return `${year}-${month}-${day}`; // YYYY-MM-DD
    } else if (location === 'DE' || location === 'CH') {
      return `${day}.${month}.${year}`; // DD.MM.YYYY
    } else {
      return `${day}/${month}/${year}`; // DD/MM/YYYY
    }
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#333' }}>
        Personal Information
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
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
            InputProps={{ readOnly: !!formData.firstName }}
            sx={{
              '& .MuiInputBase-root.Mui-readOnly': {
                backgroundColor: lightColor,
                '& fieldset': { borderColor: borderColor },
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
            InputProps={{ readOnly: !!formData.lastName }}
            sx={{
              '& .MuiInputBase-root.Mui-readOnly': {
                backgroundColor: lightColor,
                '& fieldset': { borderColor: borderColor },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={`Date of Birth ** (${config.dateFormatExample})`}
            name="dateOfBirth"
            type="text"
            placeholder={config.dateFormatExample}
            value={formData.dateOfBirth ? formatDateForDisplay(formData.dateOfBirth) : ''}
            disabled={!!formData.dateOfBirth}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth || (formData.dateOfBirth ? '✓ Auto-filled from document verification' : '')}
            required
            sx={{
              '& .MuiInputBase-root.Mui-disabled': {
                backgroundColor: lightColor,
                '& fieldset': { borderColor: borderColor },
              },
            }}
            InputProps={{
              readOnly: !!formData.dateOfBirth,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" disabled={!!formData.dateOfBirth} sx={{ color: primaryColor }}>
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
                    <Typography variant="body2" sx={{ color: borderColor, fontWeight: 600 }}>Verified</Typography>
                  ) : (
                    <Button
                      size="small"
                      onClick={handleEmailVerify}
                      disabled={otpHook.emailVerifying || !formData.email}
                      sx={{
                        color: borderColor,
                        fontWeight: 700,
                        fontSize: { xs: '0.72rem', sm: '0.875rem' },
                        textTransform: 'none',
                        minWidth: 'auto',
                        px: { xs: 0.75, sm: 1.5 },
                        py: 0.5,
                        whiteSpace: 'nowrap',
                        border: `1.5px solid ${borderColor}`,
                        backgroundColor: lightColor,
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
            label="Phone Number **"
            name="phone"
            type="tel"
            value={formData.phone || ''}
            onChange={handleChange}
            error={!!errors.phone || !!otpHook.errors.phone}
            helperText={errors.phone || otpHook.errors.phone}
            required
            disabled={!otpHook.emailVerified || otpHook.phoneVerified}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ display: 'flex', alignItems: 'center', pr: 1, borderRight: '1px solid rgba(0,0,0,0.12)', mr: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>{(countryConfig[location as string] || countryConfig.UK).dialCode}</Typography>
                  </Box>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {otpHook.phoneVerified ? (
                    <Typography variant="body2" sx={{ color: borderColor, fontWeight: 700 }}>Verified</Typography>
                  ) : (
                    <Button
                      size="small"
                      onClick={handlePhoneVerify}
                      disabled={otpHook.phoneVerifying || !formData.phone || !otpHook.emailVerified}
                      sx={{
                        color: borderColor,
                        fontWeight: 700,
                        fontSize: { xs: '0.72rem', sm: '0.875rem' },
                        textTransform: 'none',
                        minWidth: 'auto',
                        px: { xs: 0.75, sm: 1.5 },
                        py: 0.5,
                        whiteSpace: 'nowrap',
                        border: `1.5px solid ${borderColor}`,
                        backgroundColor: lightColor,
                      }}
                    >
                      {otpHook.phoneVerifying ? (isMobile ? '...' : 'Sending...') : 'Verify'}
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
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
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
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
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
            label="Full Address **"
            placeholder="Start typing your address..."
            required
            error={!!errors.fullAddress}
            helperText={errors.fullAddress || (formData.fullAddress ? '✓ Address selected' : '')}
          />
        </Grid>

        {/* Row 6: Work Authorization (country-specific) */}
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.visaStatus}>
            <InputLabel>{config.workAuthLabel} **</InputLabel>
            <Select
              name="visaStatus"
              value={formData.visaStatus || ''}
              onChange={handleSelectChange}
              label={`${config.workAuthLabel} **`}
            >
              {config.workAuthOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Error Messages */}
      {(errors.submit || otpHook.errors.email || otpHook.errors.phone) && (
        <Box sx={{ mt: 2 }}>
          {otpHook.errors.email && <Alert severity="error" sx={{ mb: 1 }}>{otpHook.errors.email}</Alert>}
          {otpHook.errors.phone && <Alert severity="error" sx={{ mb: 1 }}>{otpHook.errors.phone}</Alert>}
          {errors.submit && <Alert severity="error" sx={{ mb: 1 }}>{errors.submit}</Alert>}
        </Box>
      )}

      {/* Email OTP Dialog */}
      <Dialog open={otpHook.showEmailOTPDialog} onClose={() => !otpHook.emailVerifying && otpHook.setShowEmailOTPDialog(false)}>
        <DialogTitle>Verify Email</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>Enter the 6-digit OTP sent to {formData.email}</Typography>
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
          <Button onClick={() => { otpHook.setShowEmailOTPDialog(false); otpHook.setEmailOTP(''); }} disabled={otpHook.emailVerifying}>Cancel</Button>
          <Button
            onClick={() => { if (!otpHook.emailVerifying && otpHook.emailOTP.length === 6) { otpHook.verifyEmailOTP(otpHook.emailOTP, formData.email || ''); } }}
            variant="contained"
            disabled={otpHook.emailOTP.length !== 6 || otpHook.emailVerifying}
            startIcon={otpHook.emailVerifying ? <CircularProgress size={20} /> : null}
          >
            {otpHook.emailVerifying ? 'Verifying...' : 'Verify'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Phone OTP Dialog */}
      <Dialog open={otpHook.showPhoneOTPDialog} onClose={() => !otpHook.phoneVerifying && otpHook.setShowPhoneOTPDialog(false)}>
        <DialogTitle>Verify Phone Number</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>Enter the 6-digit OTP sent to {formData.phone}</Typography>
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
          <div id="recaptcha-container" style={{ display: 'none' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { otpHook.setShowPhoneOTPDialog(false); otpHook.setPhoneOTP(''); otpHook.cleanup(); }} disabled={otpHook.phoneVerifying}>Cancel</Button>
          <Button
            onClick={() => { if (!otpHook.phoneVerifying && otpHook.phoneOTP.length === 6) { otpHook.verifyPhoneOTP(otpHook.phoneOTP, formData.email || ''); } }}
            variant="contained"
            disabled={otpHook.phoneOTP.length !== 6 || otpHook.phoneVerifying}
            startIcon={otpHook.phoneVerifying ? <CircularProgress size={20} /> : null}
          >
            {otpHook.phoneVerifying ? 'Verifying...' : 'Verify'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GenericPersonalInformation;

