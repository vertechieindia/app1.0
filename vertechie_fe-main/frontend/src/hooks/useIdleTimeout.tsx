/**
 * Idle Timeout Hook
 * Tracks user activity and triggers logout after specified idle time
 */

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseIdleTimeoutOptions {
  timeout: number; // Idle timeout in milliseconds
  warningTime?: number; // Time before timeout to show warning (in milliseconds)
  onIdle: () => void; // Callback when user becomes idle
  onActive?: () => void; // Callback when user becomes active
  onWarning?: (remainingTime: number) => void; // Callback when warning period starts
  enabled?: boolean; // Whether to enable the idle timeout
}

interface UseIdleTimeoutReturn {
  isIdle: boolean;
  isWarning: boolean;
  remainingTime: number; // Remaining time in seconds
  resetTimer: () => void;
}

const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
  'click',
  'wheel',
];

export const useIdleTimeout = ({
  timeout,
  warningTime = 60000, // Default 1 minute warning
  onIdle,
  onActive,
  onWarning,
  enabled = true,
}: UseIdleTimeoutOptions): UseIdleTimeoutReturn => {
  const [isIdle, setIsIdle] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(Math.floor(timeout / 1000));
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const startCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    
    const startTime = Date.now();
    const endTime = startTime + warningTime;
    
    countdownRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setRemainingTime(remaining);
      
      if (remaining <= 0) {
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
      }
    }, 1000);
  }, [warningTime]);

  const resetTimer = useCallback(() => {
    if (!enabled) return;
    
    lastActivityRef.current = Date.now();
    clearAllTimers();
    
    // Reset states
    if (isIdle) {
      setIsIdle(false);
      onActive?.();
    }
    if (isWarning) {
      setIsWarning(false);
    }
    setRemainingTime(Math.floor(timeout / 1000));
    
    // Start warning timeout (fires before idle timeout)
    const warningDelay = timeout - warningTime;
    if (warningDelay > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        setIsWarning(true);
        setRemainingTime(Math.floor(warningTime / 1000));
        startCountdown();
        onWarning?.(Math.floor(warningTime / 1000));
      }, warningDelay);
    }
    
    // Start idle timeout
    timeoutRef.current = setTimeout(() => {
      setIsIdle(true);
      setIsWarning(false);
      clearAllTimers();
      onIdle();
    }, timeout);
  }, [enabled, timeout, warningTime, isIdle, isWarning, onIdle, onActive, onWarning, clearAllTimers, startCountdown]);

  // Handle activity events
  useEffect(() => {
    if (!enabled) return;

    const handleActivity = () => {
      // Debounce activity detection
      const now = Date.now();
      if (now - lastActivityRef.current < 1000) return; // Ignore events within 1 second
      
      resetTimer();
    };

    // Add event listeners
    ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Start the timer initially
    resetTimer();

    // Cleanup
    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      clearAllTimers();
    };
  }, [enabled, resetTimer, clearAllTimers]);

  // Store last activity in localStorage for cross-tab sync
  useEffect(() => {
    if (!enabled) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lastActivity') {
        const storedTime = parseInt(e.newValue || '0', 10);
        if (storedTime > lastActivityRef.current) {
          lastActivityRef.current = storedTime;
          resetTimer();
        }
      }
    };

    // Update localStorage on activity
    const updateStorage = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, updateStorage, { passive: true });
    });

    window.addEventListener('storage', handleStorageChange);

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        document.removeEventListener(event, updateStorage);
      });
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [enabled, resetTimer]);

  return {
    isIdle,
    isWarning,
    remainingTime,
    resetTimer,
  };
};

export default useIdleTimeout;
