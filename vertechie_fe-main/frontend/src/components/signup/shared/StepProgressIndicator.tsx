import React from 'react';
import { Box, Typography } from '@mui/material';
import { SignupLocation, SignupFlowConfig } from '../types';
import { getPrimaryColor } from '../utils/colors';

interface StepProgressIndicatorProps {
  steps: string[];
  activeStep: number;
  location: SignupLocation;
  config?: SignupFlowConfig;
}

const StepProgressIndicator: React.FC<StepProgressIndicatorProps> = ({
  steps,
  activeStep,
  location,
  config,
}) => {
  // Get color based on signup type and location
  const signupType = config?.type || 'techie';
  const primaryColor = getPrimaryColor(signupType, location);

  return (
    <Box sx={{ mb: 6, px: { xs: 0.5, md: 2 }, overflowX: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', gap: { xs: 0.25, md: 1 } }}>
        {/* Connecting Line - Base */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 16, md: 20 },
            left: '10%',
            right: '10%',
            height: 2,
            bgcolor: '#e0e0e0',
            zIndex: 0,
          }}
        />
        {/* Connecting Line - Progress */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 16, md: 20 },
            left: '10%',
            width: `${(activeStep / (steps.length - 1)) * 80}%`,
            height: 2,
            bgcolor: primaryColor,
            zIndex: 1,
          }}
        />

        {steps.map((step, index) => {
          const isActive = index <= activeStep;
          return (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  width: { xs: 28, md: 40 },
                  height: { xs: 28, md: 40 },
                  borderRadius: '50%',
                  bgcolor: isActive ? primaryColor : '#e0e0e0',
                  color: isActive ? 'white' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', md: '1.1rem' },
                }}
              >
                {index + 1}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  textAlign: 'center',
                  fontSize: { xs: '0.58rem', md: '0.75rem' },
                  lineHeight: 1.2,
                  color: isActive ? primaryColor : '#666',
                  maxWidth: { xs: 54, md: 80 },
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                }}
              >
                {step}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default StepProgressIndicator;
