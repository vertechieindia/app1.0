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

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 4,
          bgcolor: '#f8fafc',
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: '#f1f5f9',
            borderColor: '#6366f1'
          }
        }}
      >
        <FormControlLabel
          sx={{
            m: 0,
            alignItems: 'flex-start',
            '& .MuiFormControlLabel-label': {
              mt: 0.5,
              ml: 1,
              color: '#475569',
              lineHeight: 1.6
            }
          }}
          control={
            <Checkbox
              checked={formData.termsAccepted || false}
              onChange={handleTermsChange}
              sx={{
                p: 0,
                color: '#cbd5e1',
                '&.Mui-checked': { color: '#6366f1' },
              }}
            />
          }
          label={
            <Typography variant="body2" component="div">
              I have read and agree to the{' '}
              <Box
                component="a"
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#6366f1',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Terms and Conditions
              </Box>
              {' '}and{' '}
              <Box
                component="a"
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#6366f1',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Privacy Policy
              </Box>
              <Box component="span" sx={{ color: '#ef4444', ml: 0.5, fontWeight: 'bold' }}>*</Box>
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

