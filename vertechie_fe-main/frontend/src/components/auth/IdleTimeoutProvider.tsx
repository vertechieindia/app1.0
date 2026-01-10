/**
 * Idle Timeout Provider
 * Wraps the app to provide auto-logout functionality after idle period
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
  IconButton,
} from '@mui/material';
import { Warning as WarningIcon, Timer as TimerIcon } from '@mui/icons-material';
import { useIdleTimeout } from '../../hooks/useIdleTimeout';
import { isAuthenticated, clearTokens } from '../../services/apiClient';

// Configuration
const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
const WARNING_TIME = 60 * 1000; // 1 minute warning before logout

interface IdleTimeoutContextType {
  isWarning: boolean;
  remainingTime: number;
  resetTimer: () => void;
}

const IdleTimeoutContext = createContext<IdleTimeoutContextType | undefined>(undefined);

interface IdleTimeoutProviderProps {
  children: React.ReactNode;
}

export const IdleTimeoutProvider: React.FC<IdleTimeoutProviderProps> = ({ children }) => {
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const handleLogout = useCallback(() => {
    setShowWarningDialog(false);
    clearTokens();
    // Redirect to login with a message
    window.location.href = '/login?reason=idle';
  }, []);

  const handleStayActive = useCallback(() => {
    setShowWarningDialog(false);
    resetTimer();
  }, []);

  const handleWarning = useCallback((remainingSeconds: number) => {
    setCountdown(remainingSeconds);
    setShowWarningDialog(true);
  }, []);

  const { isWarning, remainingTime, resetTimer } = useIdleTimeout({
    timeout: IDLE_TIMEOUT,
    warningTime: WARNING_TIME,
    enabled: isAuthenticated(),
    onIdle: handleLogout,
    onWarning: handleWarning,
    onActive: () => setShowWarningDialog(false),
  });

  // Update countdown display
  useEffect(() => {
    if (isWarning) {
      setCountdown(remainingTime);
    }
  }, [isWarning, remainingTime]);

  // Check authentication status on mount and when it changes
  useEffect(() => {
    if (!isAuthenticated()) {
      setShowWarningDialog(false);
    }
  }, []);

  const contextValue: IdleTimeoutContextType = {
    isWarning,
    remainingTime,
    resetTimer,
  };

  // Calculate progress percentage
  const progressPercent = (countdown / 60) * 100;

  return (
    <IdleTimeoutContext.Provider value={contextValue}>
      {children}
      
      {/* Idle Warning Dialog */}
      <Dialog
        open={showWarningDialog && isAuthenticated()}
        onClose={handleStayActive}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: 'white',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          pb: 1,
          borderBottom: '1px solid rgba(255, 193, 7, 0.2)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <WarningIcon sx={{ color: '#ffc107', fontSize: 32 }} />
            <Typography variant="h5" component="span" fontWeight="bold">
              Session Timeout Warning
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            {/* Countdown Timer Circle */}
            <Box
              sx={{
                position: 'relative',
                width: 120,
                height: 120,
                margin: '0 auto 24px',
                borderRadius: '50%',
                background: 'rgba(255, 193, 7, 0.1)',
                border: '3px solid rgba(255, 193, 7, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -3,
                  left: -3,
                  right: -3,
                  bottom: -3,
                  borderRadius: '50%',
                  border: '3px solid transparent',
                  borderTopColor: '#ffc107',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              <Box sx={{ textAlign: 'center' }}>
                <TimerIcon sx={{ color: '#ffc107', fontSize: 24, mb: 0.5 }} />
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{
                    color: countdown <= 10 ? '#ff5252' : '#ffc107',
                    lineHeight: 1,
                  }}
                >
                  {countdown}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  seconds
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.9)' }}>
              You've been inactive for a while
            </Typography>
            
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
              For your security, you'll be automatically logged out in{' '}
              <Box component="span" sx={{ color: '#ffc107', fontWeight: 'bold' }}>
                {countdown} seconds
              </Box>
              . Click below to stay logged in.
            </Typography>

            {/* Progress Bar */}
            <Box sx={{ px: 4, mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: countdown <= 10 ? '#ff5252' : '#ffc107',
                    transition: 'width 1s linear',
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          pt: 0, 
          gap: 2, 
          justifyContent: 'center',
          borderTop: '1px solid rgba(255, 193, 7, 0.2)',
        }}>
          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Logout Now
          </Button>
          <Button
            variant="contained"
            onClick={handleStayActive}
            autoFocus
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
              color: '#1a1a2e',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(135deg, #ffca28 0%, #ffa726 100%)',
              },
            }}
          >
            Stay Logged In
          </Button>
        </DialogActions>
      </Dialog>
    </IdleTimeoutContext.Provider>
  );
};

export const useIdleTimeoutContext = (): IdleTimeoutContextType => {
  const context = useContext(IdleTimeoutContext);
  if (context === undefined) {
    throw new Error('useIdleTimeoutContext must be used within an IdleTimeoutProvider');
  }
  return context;
};

export default IdleTimeoutProvider;
