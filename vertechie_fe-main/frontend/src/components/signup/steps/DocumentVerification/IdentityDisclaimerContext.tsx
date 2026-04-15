import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
  Alert,
} from '@mui/material';
import type { FormData } from '../../types';

type UpdateFormData = (updates: Partial<FormData>) => void;

interface IdentityDisclaimerContextValue {
  /** Resolves true if already accepted or user completes modal; false if cancelled */
  ensureAccepted: () => Promise<boolean>;
}

const IdentityDisclaimerContext = createContext<IdentityDisclaimerContextValue | null>(null);

export function IdentityDisclaimerProvider({
  children,
  formData,
  updateFormData,
}: {
  children: React.ReactNode;
  formData: FormData;
  updateFormData: UpdateFormData;
}) {
  const [open, setOpen] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const resolveRef = useRef<((v: boolean) => void) | null>(null);

  const ensureAccepted = useCallback(async () => {
    if (formData.identityCaptureDisclaimerAccepted) {
      return true;
    }
    setCheckbox(false);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, [formData.identityCaptureDisclaimerAccepted]);

  const handleCancel = useCallback(() => {
    setOpen(false);
    resolveRef.current?.(false);
    resolveRef.current = null;
  }, []);

  const handleContinue = useCallback(() => {
    if (!checkbox) return;
    updateFormData({ identityCaptureDisclaimerAccepted: true });
    setOpen(false);
    resolveRef.current?.(true);
    resolveRef.current = null;
  }, [checkbox, updateFormData]);

  const value = useMemo(() => ({ ensureAccepted }), [ensureAccepted]);

  return (
    <IdentityDisclaimerContext.Provider value={value}>
      {children}
      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth scroll="paper">
        <DialogTitle sx={{ pr: 6 }}>Identity verification</DialogTitle>
        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.75 }}>
              How your photos are used
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              Liveness captures and ID document photos you submit are stored securely and shown to VerTechie
              administrators only to verify your identity. This media is removed from storage after your profile is
              approved.
            </Typography>
          </Alert>
          <FormControlLabel
            control={
              <Checkbox
                checked={checkbox}
                onChange={(_, c) => setCheckbox(c)}
                color="primary"
              />
            }
            sx={{ alignItems: 'flex-start', ml: 0 }}
            label={
              <Typography variant="body2" sx={{ pt: 0.25 }}>
                I understand that my capture(s) may be reviewed by administrators for identity verification.
              </Typography>
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCancel} color="inherit">
            Cancel
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" onClick={handleContinue} disabled={!checkbox}>
            Continue to camera
          </Button>
        </DialogActions>
      </Dialog>
    </IdentityDisclaimerContext.Provider>
  );
}

export function useIdentityDisclaimerGate(): () => Promise<boolean> {
  const ctx = useContext(IdentityDisclaimerContext);
  if (!ctx) {
    throw new Error('useIdentityDisclaimerGate must be used within IdentityDisclaimerProvider');
  }
  return ctx.ensureAccepted;
}
