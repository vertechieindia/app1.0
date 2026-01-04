import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Alert, Paper } from '@mui/material';
import { StepComponentProps } from '../../types';
import ReviewContent from './ReviewContent';

const ReviewSubmit: React.FC<StepComponentProps> = ({
  formData,
  updateFormData,
  errors,
  location,
  goToStep,
}) => {
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ termsAccepted: e.target.checked });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Review & Submit
      </Typography>

      <ReviewContent formData={formData} location={location} goToStep={goToStep} updateFormData={updateFormData} />

      <Paper sx={{ p: 3, mt: 4, bgcolor: '#f5f5f5' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.termsAccepted || false}
              onChange={handleTermsChange}
              required
            />
          }
          label={
            <Typography variant="body2">
              I have read and agree to the{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </Typography>
          }
        />
      </Paper>

      {errors.submit && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.submit}
        </Alert>
      )}
    </Box>
  );
};

export default ReviewSubmit;

