export interface BlogFilterCategory {
  id: string;
  name: string;
}

export const DEFAULT_BLOG_FILTER_CATEGORIES: BlogFilterCategory[] = [
  { id: 'all', name: 'All Posts' },
  { id: 'tech', name: 'Technology' },
  { id: 'ai', name: 'AI & ML' },
  { id: 'career', name: 'Career Growth' },
  { id: 'learning', name: 'Learning' },
  { id: 'startup', name: 'Startups' },
  { id: 'community', name: 'Community' },
];

export const DEFAULT_BLOG_SEARCH = {
  searchQuery: '',
  selectedCategory: 'all',
};
