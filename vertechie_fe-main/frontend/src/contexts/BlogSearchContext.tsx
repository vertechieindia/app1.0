import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  BlogFilterCategory,
  DEFAULT_BLOG_FILTER_CATEGORIES,
  DEFAULT_BLOG_SEARCH,
} from '../pages/techie/blogSearchUtils';

interface BlogSearchContextValue {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  filterCategories: BlogFilterCategory[];
  setFilterCategories: (categories: BlogFilterCategory[]) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const BlogSearchContext = createContext<BlogSearchContextValue | undefined>(undefined);

export const BlogSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState(DEFAULT_BLOG_SEARCH.searchQuery);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_BLOG_SEARCH.selectedCategory);
  const [filterCategories, setFilterCategories] = useState<BlogFilterCategory[]>(DEFAULT_BLOG_FILTER_CATEGORIES);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
  }, []);

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      filterCategories,
      setFilterCategories,
      clearFilters,
      hasActiveFilters: Boolean(searchQuery.trim()) || selectedCategory !== 'all',
    }),
    [searchQuery, selectedCategory, filterCategories, clearFilters]
  );

  return <BlogSearchContext.Provider value={value}>{children}</BlogSearchContext.Provider>;
};

export function useBlogSearch(): BlogSearchContextValue {
  const ctx = useContext(BlogSearchContext);
  if (!ctx) {
    throw new Error('useBlogSearch must be used within BlogSearchProvider');
  }
  return ctx;
}
