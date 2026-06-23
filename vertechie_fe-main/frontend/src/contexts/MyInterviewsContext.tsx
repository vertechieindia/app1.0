import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export type MyInterviewsTab = 'upcoming' | 'past';

interface MyInterviewsStats {
  upcoming: number;
  past: number;
  total: number;
}

interface MyInterviewsContextValue {
  activeTab: MyInterviewsTab;
  setActiveTab: (tab: MyInterviewsTab) => void;
  stats: MyInterviewsStats;
  setStats: (stats: MyInterviewsStats) => void;
  refresh: () => void;
  registerRefresh: (fn: () => void) => void;
}

const defaultStats: MyInterviewsStats = { upcoming: 0, past: 0, total: 0 };

const MyInterviewsContext = createContext<MyInterviewsContextValue | undefined>(undefined);

export const MyInterviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<MyInterviewsTab>('upcoming');
  const [stats, setStats] = useState<MyInterviewsStats>(defaultStats);
  const refreshRef = useRef<() => void>(() => {});

  const registerRefresh = useCallback((fn: () => void) => {
    refreshRef.current = fn;
  }, []);

  const refresh = useCallback(() => {
    refreshRef.current();
  }, []);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      stats,
      setStats,
      refresh,
      registerRefresh,
    }),
    [activeTab, stats, refresh, registerRefresh]
  );

  return <MyInterviewsContext.Provider value={value}>{children}</MyInterviewsContext.Provider>;
};

export function useMyInterviews(): MyInterviewsContextValue {
  const ctx = useContext(MyInterviewsContext);
  if (!ctx) {
    throw new Error('useMyInterviews must be used within MyInterviewsProvider');
  }
  return ctx;
}
