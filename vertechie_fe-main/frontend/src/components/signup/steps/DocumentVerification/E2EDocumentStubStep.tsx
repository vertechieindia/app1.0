import React from 'react';
import { Box, Typography } from '@mui/material';
import type { StepComponentProps } from '../../types';

/** When true, signup uses a lightweight document step (no camera / face APIs). */
export function isE2eStub(): boolean {
  return import.meta.env.VITE_E2E === 'true' || import.meta.env.VITE_E2E === '1';
}

/**
 * Minimal document step for Playwright / local E2E (`VITE_E2E=true`).
 * Keeps the wizard navigable without MediaPipe or device capture.
 */
const E2EDocumentStubStep: React.FC<StepComponentProps> = () => {
  return (
    <Box data-testid="e2e-document-stub">
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
        Document Verification
      </Typography>
      <Typography variant="body2" color="text.secondary">
        E2E stub — set VITE_E2E=true when running signup tests without a real document flow.
      </Typography>
    </Box>
  );
};

export default E2EDocumentStubStep;
