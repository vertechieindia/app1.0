import React from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  loading?: boolean;
  isLastStep?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSkip,
  loading = false,
  isLastStep = false,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Button
        onClick={onBack}
        disabled={currentStep === 0 || loading}
        startIcon={<ArrowBackIcon />}
        variant="outlined"
      >
        Back
      </Button>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {onSkip && (
          <Button onClick={onSkip} variant="text" disabled={loading}>
            Skip
          </Button>
        )}
        <Button
          onClick={onNext}
          variant="contained"
          disabled={loading}
          endIcon={loading ? <CircularProgress size={16} /> : <ArrowForwardIcon />}
        >
          {loading ? 'Processing...' : isLastStep ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default NavigationButtons;

