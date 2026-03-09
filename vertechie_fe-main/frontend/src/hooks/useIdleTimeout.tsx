/**
 * Idle Timeout Hook
 * Tracks user activity and triggers logout after specified idle time.
 * On tab focus/visibility change, recalculates elapsed time from last activity
 * so warning and logout work correctly when the tab was in the background (timers are throttled).
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
  const hasInitializedTimerRef = useRef(false);

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

  const startCountdown = useCallback((durationMs?: number) => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    const duration = durationMs ?? warningTime;
    const startTime = Date.now();
    const endTime = startTime + duration;

    countdownRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setRemainingTime(remaining);

      if (remaining <= 0) {
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
        clearAllTimers();
        onIdle();
      }
    }, 1000);
  }, [warningTime, clearAllTimers, onIdle]);

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

  // On tab focus/visibility: recalculate elapsed from lastActivityRef and either logout,
  // show warning with correct countdown, or reschedule timers (browser throttling can delay timers in background).
  const checkElapsedOnVisibility = useCallback(() => {
    if (!enabled || typeof document === 'undefined' || document.visibilityState !== 'visible') return;
    const now = Date.now();
    const elapsed = now - lastActivityRef.current;
    const fullPeriod = timeout + warningTime;

    if (elapsed >= fullPeriod) {
      clearAllTimers();
      setIsWarning(false);
      setIsIdle(true);
      onIdle();
      return;
    }

    if (elapsed >= timeout) {
      clearAllTimers();
      const remainingMs = fullPeriod - elapsed;
      const remainingSec = Math.max(0, Math.floor(remainingMs / 1000));
      setIsWarning(true);
      setRemainingTime(remainingSec);
      onWarning?.(remainingSec);
      startCountdown(remainingMs);
      return;
    }

    // elapsed < timeout: reschedule timers without resetting lastActivityRef
    clearAllTimers();
    const delayUntilIdle = timeout - elapsed;
    const delayUntilWarning = delayUntilIdle - warningTime;

    if (delayUntilWarning > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        setIsWarning(true);
        setRemainingTime(Math.floor(warningTime / 1000));
        startCountdown();
        onWarning?.(Math.floor(warningTime / 1000));
      }, delayUntilWarning);
      timeoutRef.current = setTimeout(() => {
        setIsIdle(true);
        setIsWarning(false);
        clearAllTimers();
        onIdle();
      }, delayUntilIdle);
    } else if (delayUntilIdle > 0) {
      // Already past when warning should have shown; show warning now with remaining time until logout
      const remainingMs = delayUntilIdle;
      const remainingSec = Math.max(0, Math.floor(remainingMs / 1000));
      setIsWarning(true);
      setRemainingTime(remainingSec);
      onWarning?.(remainingSec);
      startCountdown(remainingMs); // countdown will call onIdle when it hits 0
    }
  }, [enabled, timeout, warningTime, clearAllTimers, startCountdown, onIdle, onWarning]);

  // When disabled, allow re-initialization when enabled again (e.g. after re-login)
  useEffect(() => {
    if (!enabled) hasInitializedTimerRef.current = false;
  }, [enabled]);

  // On tab focus/visibility change: recalculate elapsed inactivity and handle overdue warning/logout
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;
    const onVisible = () => checkElapsedOnVisibility();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [enabled, checkElapsedOnVisibility]);

  // Handle activity events. Only call resetTimer() on first run when enabled, so that when the
  // warning appears (isWarning -> true), this effect re-running does NOT reset the timer
  // and clear the 1-minute countdown — otherwise the session would never log out.
  useEffect(() => {
    if (!enabled) return;

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivityRef.current < 1000) return;
      resetTimer();
    };

    ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    if (!hasInitializedTimerRef.current) {
      hasInitializedTimerRef.current = true;
      resetTimer();
    }

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
