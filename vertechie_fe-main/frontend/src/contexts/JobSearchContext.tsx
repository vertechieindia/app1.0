import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { JobFilters } from '../types/jobPortal';
import { DEFAULT_JOB_FILTERS, hasActiveJobFilters } from '../pages/user/jobSearchUtils';

interface JobSearchContextValue {
  filters: Required<JobFilters>;
  updateFilter: (field: keyof JobFilters, value: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const JobSearchContext = createContext<JobSearchContextValue | undefined>(undefined);

export const JobSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<Required<JobFilters>>(DEFAULT_JOB_FILTERS);

  const updateFilter = useCallback((field: keyof JobFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_JOB_FILTERS);
  }, []);

  const value = useMemo(
    () => ({
      filters,
      updateFilter,
      clearFilters,
      hasActiveFilters: hasActiveJobFilters(filters),
    }),
    [filters, updateFilter, clearFilters]
  );

  return <JobSearchContext.Provider value={value}>{children}</JobSearchContext.Provider>;
};

export function useJobSearch(): JobSearchContextValue {
  const ctx = useContext(JobSearchContext);
  if (!ctx) {
    throw new Error('useJobSearch must be used within JobSearchProvider');
  }
  return ctx;
}
