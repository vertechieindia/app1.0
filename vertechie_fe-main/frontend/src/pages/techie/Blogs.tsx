/**
 * Blogs Page - VerTechie Tech Blog Platform
 * A beautiful, feature-rich blogging platform for tech professionals
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../config/api';
import { fetchWithAuth } from '../../utils/apiInterceptor';
import {
  Box, Container, Typography, Button, Card, CardContent, CardMedia,
  Grid, Chip, TextField, InputAdornment, Avatar, IconButton,
  Paper, Tabs, Tab, Badge, Divider, List, ListItem, ListItemAvatar,
  ListItemText, Skeleton, Dialog, DialogTitle, DialogContent,
  DialogActions, alpha, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  LocalOffer as TagIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  CalendarToday as CalendarIcon,
  Code as CodeIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
  Groups as GroupsIcon,
  Verified as VerifiedIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  Close as CloseIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Facebook as FacebookIcon,
  WhatsApp as WhatsAppIcon,
  Link as LinkIcon,
  ContentCopy as CopyIcon,
  LocalFireDepartment as FireIcon,
  AutoAwesome as SparkleIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

// ============================================
// THEME COLORS - VerTechie Blue Palette
// ============================================
const colors = {
  primary: '#0d47a1',
  primaryDark: '#1a237e',
  primaryLight: '#5AC8FA',
  secondary: '#0077B5',
  accent: '#5AC8FA',
  background: '#f5f7fa',
  surface: '#ffffff',
  text: '#1a237e',
  textLight: '#4B5563',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

const AUTHOR_ID_STORAGE_KEY = 'v_user_id';

// ============================================
// ANIMATIONS
// ============================================
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100%',
  background: `linear-gradient(160deg, #e8eef7 0%, #f0f4fa 30%, #f5f7fa 60%, #fafbfd 100%)`,
}));

const HeroSection = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 50%, ${colors.accent} 100%)`,
  borderRadius: 24,
  padding: theme.spacing(6),
  color: 'white',
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeInUp} 0.6s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -80,
    right: -80,
    width: 300,
    height: 300,
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -60,
    left: '20%',
    width: 200,
    height: 200,
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
  },
}));

const BlogCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${alpha(colors.primary, 0.1)}`,
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  animation: `${fadeInUp} 0.6s ease-out`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px ${alpha(colors.primary, 0.15)}`,
    borderColor: colors.primary,
    '& .blog-image': {
      transform: 'scale(1.05)',
    },
  },
}));

const FeaturedBlogCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  overflow: 'hidden',
  position: 'relative',
  height: 400,
  cursor: 'pointer',
  transition: 'all 0.4s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 25px 50px ${alpha(colors.primary, 0.2)}`,
    '& .featured-overlay': {
      background: `linear-gradient(180deg, transparent 20%, ${alpha(colors.primaryDark, 0.95)} 100%)`,
    },
  },
}));

const CategoryChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  borderRadius: 20,
  fontWeight: 600,
  padding: '4px 8px',
  transition: 'all 0.2s ease',
  background: selected ? colors.primary : alpha(colors.primary, 0.1),
  color: selected ? 'white' : colors.primary,
  border: `1px solid ${selected ? colors.primary : alpha(colors.primary, 0.2)}`,
  '&:hover': {
    background: selected ? colors.primaryDark : alpha(colors.primary, 0.15),
    borderColor: colors.primary,
  },
}));

const SidebarCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  border: `1px solid ${alpha(colors.primary, 0.1)}`,
  boxShadow: `0 4px 20px ${alpha(colors.primary, 0.05)}`,
}));

const WriteButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '12px 32px',
  fontWeight: 700,
  fontSize: '1rem',
  textTransform: 'none',
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
  color: 'white',
  boxShadow: `0 8px 24px ${alpha(colors.primary, 0.35)}`,
  '&:hover': {
    background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`,
    boxShadow: `0 12px 32px ${alpha(colors.primary, 0.45)}`,
    transform: 'translateY(-2px)',
  },
}));

// ============================================
// INTERFACES
// ============================================
interface Author {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  isVerified: boolean;
  followers: number;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  coverImage: string;
  author: Author;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  isBookmarked: boolean;
  isLiked: boolean;
  isFeatured: boolean;
  authorId?: string;
}

// ============================================
// MOCK DATA
// ============================================
const categories = [
  { id: 'all', name: 'All Posts', icon: <StarIcon fontSize="small" /> },
  { id: 'tech', name: 'Technology', icon: <CodeIcon fontSize="small" /> },
  { id: 'career', name: 'Career', icon: <WorkIcon fontSize="small" /> },
  { id: 'learning', name: 'Learning', icon: <SchoolIcon fontSize="small" /> },
  { id: 'ai', name: 'AI & ML', icon: <PsychologyIcon fontSize="small" /> },
  { id: 'startup', name: 'Startups', icon: <LightbulbIcon fontSize="small" /> },
  { id: 'community', name: 'Community', icon: <GroupsIcon fontSize="small" /> },
];

const mockAuthors: Author[] = [
  { id: '1', name: 'Sarah Chen', avatar: '', title: 'Senior Engineer at Google', isVerified: true, followers: 12500 },
  { id: '2', name: 'Michael Brown', avatar: '', title: 'Product Manager at Microsoft', isVerified: true, followers: 8900 },
  { id: '3', name: 'Emily Rodriguez', avatar: '', title: 'Tech Lead at Meta', isVerified: true, followers: 15200 },
  { id: '4', name: 'David Kim', avatar: '', title: 'AI Researcher at OpenAI', isVerified: true, followers: 22000 },
  { id: '5', name: 'Jessica Liu', avatar: '', title: 'CTO at StartupXYZ', isVerified: false, followers: 6700 },
];

const mockBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI in Software Development: A Comprehensive Guide',
    excerpt: 'Explore how artificial intelligence is revolutionizing the way we write code, debug applications, and design software architecture. From AI pair programming to automated testing...',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    author: mockAuthors[3],
    category: 'ai',
    tags: ['AI', 'Machine Learning', 'Software Development', 'Future Tech'],
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    readTime: 12,
    views: 15420,
    likes: 892,
    comments: 156,
    isBookmarked: false,
    isLiked: false,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'From Junior to Senior: 10 Lessons That Changed My Career',
    excerpt: 'After 8 years in tech, here are the most valuable lessons I learned on my journey from a junior developer to a senior engineer at a FAANG company...',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    author: mockAuthors[0],
    category: 'career',
    tags: ['Career Growth', 'Senior Engineer', 'Mentorship', 'Tech Career'],
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    readTime: 8,
    views: 28900,
    likes: 2100,
    comments: 342,
    isBookmarked: true,
    isLiked: true,
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Building Scalable Microservices with Kubernetes and Go',
    excerpt: 'A deep dive into designing and deploying microservices architecture using Kubernetes orchestration and Go programming language...',
    coverImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
    author: mockAuthors[2],
    category: 'tech',
    tags: ['Kubernetes', 'Go', 'Microservices', 'DevOps'],
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 15,
    views: 8750,
    likes: 645,
    comments: 89,
    isBookmarked: false,
    isLiked: false,
    isFeatured: false,
  },
  {
    id: '4',
    title: 'How I Built a $10M ARR SaaS Product in 18 Months',
    excerpt: 'The complete story of building, launching, and scaling a B2B SaaS product from zero to $10 million in annual recurring revenue...',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    author: mockAuthors[4],
    category: 'startup',
    tags: ['SaaS', 'Entrepreneurship', 'Startup', 'Growth'],
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 18,
    views: 45200,
    likes: 3400,
    comments: 567,
    isBookmarked: false,
    isLiked: false,
    isFeatured: true,
  },
  {
    id: '5',
    title: 'Mastering System Design Interviews: Complete Preparation Guide',
    excerpt: 'Everything you need to know to ace your system design interviews at top tech companies. From fundamentals to advanced concepts...',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    author: mockAuthors[1],
    category: 'learning',
    tags: ['System Design', 'Interviews', 'Tech Prep', 'Career'],
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 25,
    views: 67800,
    likes: 4200,
    comments: 890,
    isBookmarked: true,
    isLiked: false,
    isFeatured: false,
  },
  {
    id: '6',
    title: 'React 19: What\'s New and How to Migrate Your Projects',
    excerpt: 'A comprehensive overview of React 19 features including Server Components, Actions, and the new compiler. Plus a step-by-step migration guide...',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    author: mockAuthors[0],
    category: 'tech',
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 10,
    views: 32100,
    likes: 1890,
    comments: 234,
    isBookmarked: false,
    isLiked: true,
    isFeatured: false,
  },
];

const popularTags = ['JavaScript', 'React', 'Python', 'AI', 'Career', 'System Design', 'Kubernetes', 'AWS', 'Startup', 'Leadership'];

// ============================================
// COMPONENT
// ============================================
const Blogs: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [writeDialogOpen, setWriteDialogOpen] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [savedBlogs, setSavedBlogs] = useState<Set<string>>(new Set());
  const [likedBlogs, setLikedBlogs] = useState<Set<string>>(new Set(['1', '3']));
  const [shareMenuAnchor, setShareMenuAnchor] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  // Blog form fields
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogTags, setBlogTags] = useState('');
  const [blogContent, setBlogContent] = useState('');

  // Edit/Delete states
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem(AUTHOR_ID_STORAGE_KEY) : null;

  // API Categories
  const [apiCategories, setApiCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetchWithAuth(getApiUrl('/blog/categories'));
      if (response.ok) {
        const data = await response.json();
        setApiCategories(data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  // Fetch blogs from API
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(getApiUrl('/blog/articles'));
      if (response.ok) {
        const data = await response.json();
        const mappedBlogs: BlogPost[] = data.map((article: any) => ({
          id: article.id,
          title: article.title || 'Untitled',
          excerpt: article.excerpt || article.short_description || '',
          coverImage: article.cover_image || article.thumbnail || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
          category: article.category_name || 'Technology',
          author: {
            name: article.author_name || 'Anonymous',
            avatar: article.author_avatar || '',
            isVerified: article.author_verified || false,
          },
          publishedAt: article.published_at || article.created_at || new Date().toISOString(),
          readTime: article.read_time || `${Math.ceil((article.content?.length || 500) / 1000)} min read`,
          views: article.views_count || 0,
          likes: article.likes_count || 0,
          comments: article.comments_count || 0,
          tags: article.tags || [],
          isFeatured: article.is_featured || false,
          isTrending: article.is_trending || false,
          authorId: article.author_id,
        }));
        setBlogs(mappedBlogs.length > 0 ? mappedBlogs : mockBlogs);
      } else {
        // Fallback to mock data
        setBlogs(mockBlogs);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setBlogs(mockBlogs);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch my bookmarks so saved state is correct and API is used on load
  const fetchMyBookmarks = useCallback(async () => {
    try {
      const response = await fetchWithAuth(getApiUrl('/blog/bookmarks'));
      if (response.ok) {
        const data = await response.json();
        const ids = Array.isArray(data) ? data.map((a: { id?: string }) => a.id).filter(Boolean) : [];
        setSavedBlogs(new Set(ids.map(String)));
      }
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchMyBookmarks();
  }, [fetchBlogs, fetchCategories, fetchMyBookmarks]);
  const [selectedBlogForShare, setSelectedBlogForShare] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Toggle save/bookmark — call API then update local state
  const handleToggleSave = async (blogId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const id = String(blogId);
    const isSaved = savedBlogs.has(id);
    try {
      const url = getApiUrl(`/blog/articles/${id}/bookmark`);
      const response = await fetchWithAuth(url, {
        method: isSaved ? 'DELETE' : 'POST',
      });
      if (response.ok) {
        setSavedBlogs(prev => {
          const next = new Set(prev);
          if (isSaved) next.delete(id);
          else next.add(id);
          return next;
        });
      }
    } catch (err) {
      console.error('Toggle bookmark failed:', err);
    }
  };

  // Toggle like (react) — call API then update local state and count
  const handleToggleLike = async (blogId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = likedBlogs.has(blogId);
    try {
      const base = getApiUrl(`/blog/articles/${blogId}/react`);
      const response = await fetchWithAuth(
        isLiked ? base : `${base}?reaction_type=like`,
        { method: isLiked ? 'DELETE' : 'POST' }
      );
      if (response.ok) {
        setLikedBlogs(prev => {
          const next = new Set(prev);
          if (isLiked) next.delete(blogId);
          else next.add(blogId);
          return next;
        });
        setBlogs(prev => prev.map(blog =>
          blog.id === blogId
            ? { ...blog, likes: Math.max(0, blog.likes + (isLiked ? -1 : 1)) }
            : blog
        ));
      }
    } catch (err) {
      console.error('Toggle like failed:', err);
    }
  };

  // Share functionality
  const handleShareClick = (blogId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBlogForShare(blogId);
    setShareMenuAnchor(e.currentTarget as HTMLElement);
  };

  const handleShare = (platform: string) => {
    const blog = blogs.find(b => b.id === selectedBlogForShare);
    if (!blog) return;

    const url = `https://vertechie.com/blogs/${blog.id}`;
    const text = `Check out "${blog.title}" on VerTechie`;

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        setShareMenuAnchor(null);
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShareMenuAnchor(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
  };

  const handleCloseDialog = () => {
    setBlogContent('');
    setEditingBlogId(null);
  };

  const handleEditClick = async (blog: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Fetch full details to get content for editing
      const response = await fetchWithAuth(getApiUrl(`/blog/articles/${blog.id}`));
      if (response.ok) {
        const fullBlog = await response.json();
        setEditingBlogId(blog.id);
        setBlogTitle(fullBlog.title || blog.title);
        setBlogCategory(fullBlog.category_id || '');
        setBlogTags(Array.isArray(fullBlog.tags) ? fullBlog.tags.join(', ') : '');
        setBlogContent(fullBlog.content || '');
        setCoverImage(fullBlog.cover_image || blog.coverImage);
        setWriteDialogOpen(true);
      } else {
        console.error('Failed to fetch blog details');
        alert('Could not load blog content for editing.');
      }
    } catch (err) {
      console.error('Fetch blog details failed:', err);
    }
  };

  const handleDeleteClick = (blogId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBlogToDelete(blogId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    try {
      const response = await fetchWithAuth(getApiUrl(`/blog/articles/${blogToDelete}`), {
        method: 'DELETE',
      });
      if (response.ok) {
        setBlogs(prev => prev.filter(b => b.id !== blogToDelete));
        setDeleteConfirmOpen(false);
        setBlogToDelete(null);
      }
    } catch (err) {
      console.error('Delete blog failed:', err);
    }
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Publish blog to API
  const handlePublishBlog = async () => {
    if (!blogTitle.trim() || !blogContent.trim()) {
      return;
    }

    try {
      setPublishing(true);
      const slug = generateSlug(blogTitle);
      const tagsArray = blogTags.split(',').map(tag => tag.trim()).filter(Boolean);

      // Build article data - set status to "published" so it's visible to all users
      const articleData: any = {
        title: blogTitle.trim(),
        slug: slug,
        content: blogContent.trim(),
        excerpt: blogContent.substring(0, 200).trim(),
        tags: tagsArray,
        status: "published",  // Make blog visible immediately
      };

      // Only add cover_image if it exists
      if (coverImage) {
        articleData.cover_image = coverImage;
      }

      // Only add category_id if a valid API category is selected
      // Check if it's a valid UUID (from API categories)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (blogCategory && uuidRegex.test(blogCategory)) {
        articleData.category_id = blogCategory;
      }

      const response = await fetchWithAuth(
        editingBlogId
          ? getApiUrl(`/blog/articles/${editingBlogId}`)
          : getApiUrl('/blog/articles'),
        {
          method: editingBlogId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData),
        }
      );

      if (response.ok) {
        handleCloseDialog();
        setWriteDialogOpen(false);
        fetchBlogs();
      } else {
        const error = await response.json().catch(() => ({}));
        console.error('Error publishing blog:', error);
        alert('Failed to publish blog. Please try again.');
      }
    } catch (err) {
      console.error('Error publishing blog:', err);
      alert('Failed to publish blog. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  const featuredBlogs = blogs.filter(blog => blog.isFeatured);
  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleLike = (blogId: string) => {
    setBlogs(prev => prev.map(blog =>
      blog.id === blogId
        ? { ...blog, isLiked: !blog.isLiked, likes: blog.isLiked ? blog.likes - 1 : blog.likes + 1 }
        : blog
    ));
  };

  const handleBookmark = (blogId: string) => {
    setBlogs(prev => prev.map(blog =>
      blog.id === blogId
        ? { ...blog, isBookmarked: !blog.isBookmarked }
        : blog
    ));
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <PageContainer>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <HeroSection elevation={0}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                  VerTechie Blog
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, maxWidth: 600, fontWeight: 400 }}>
                  Discover insights from top tech professionals. Learn, grow, and stay ahead with expert articles on technology, career, and innovation.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<EditIcon sx={{ color: 'inherit !important' }} />}
                    label={`${blogs.length} Articles`}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                  />
                  <Chip
                    icon={<PersonIcon sx={{ color: 'inherit !important' }} />}
                    label={`${mockAuthors.length} Authors`}
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                  />
                  <Chip
                    icon={<TrendingUpIcon sx={{ color: 'inherit !important' }} />}
                    label="Updated Daily"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <WriteButton
                  startIcon={<AddIcon />}
                  onClick={() => setWriteDialogOpen(true)}
                >
                  Write a Blog
                </WriteButton>
              </Grid>
            </Grid>
          </Box>
        </HeroSection>

        {/* Featured Blogs Carousel */}
        {featuredBlogs.length > 0 && (
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: colors.text }}>
              🔥 Featured Stories
            </Typography>
            <Grid container spacing={3}>
              {featuredBlogs.slice(0, 3).map((blog, index) => (
                <Grid item xs={12} md={index === 0 ? 6 : 3} key={blog.id}>
                  <FeaturedBlogCard>
                    <CardMedia
                      component="img"
                      image={blog.coverImage}
                      alt={blog.title}
                      sx={{ height: '100%', objectFit: 'cover' }}
                    />
                    <Box
                      className="featured-overlay"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        top: 0,
                        background: `linear-gradient(180deg, transparent 30%, ${alpha(colors.primaryDark, 0.9)} 100%)`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        p: 3,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Chip
                        label={categories.find(c => c.id === blog.category)?.name}
                        size="small"
                        sx={{
                          bgcolor: colors.accent,
                          color: colors.primaryDark,
                          fontWeight: 600,
                          width: 'fit-content',
                          mb: 2,
                        }}
                      />
                      <Typography
                        variant={index === 0 ? 'h5' : 'h6'}
                        sx={{ color: 'white', fontWeight: 700, mb: 1 }}
                      >
                        {blog.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'rgba(255,255,255,0.8)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Avatar src={blog.author.avatar} sx={{ width: 24, height: 24 }}>
                            {blog.author.name[0]}
                          </Avatar>
                          <Typography variant="body2">{blog.author.name}</Typography>
                        </Box>
                        <Typography variant="body2">•</Typography>
                        <Typography variant="body2">{blog.readTime} min read</Typography>
                      </Box>
                    </Box>
                  </FeaturedBlogCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            {/* Search & Categories */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 4, border: `1px solid ${alpha(colors.primary, 0.1)}` }}>
              <TextField
                fullWidth
                placeholder="Search articles, topics, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'grey.50' },
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {categories.map((category) => (
                  <CategoryChip
                    key={category.id}
                    icon={category.icon}
                    label={category.name}
                    selected={selectedCategory === category.id}
                    onClick={() => setSelectedCategory(category.id)}
                  />
                ))}
              </Box>
            </Paper>

            {/* Blog List */}
            <Grid container spacing={3}>
              {filteredBlogs.map((blog, index) => (
                <Grid item xs={12} sm={6} key={blog.id}>
                  <BlogCard sx={{ animationDelay: `${index * 0.1}s` }}>
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        className="blog-image"
                        component="img"
                        height="180"
                        image={blog.coverImage}
                        alt={blog.title}
                        sx={{ transition: 'transform 0.3s ease' }}
                      />
                      <Chip
                        label={categories.find(c => c.id === blog.category)?.name}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          bgcolor: 'rgba(255,255,255,0.95)',
                          color: colors.primary,
                          fontWeight: 600,
                        }}
                      />
                      <IconButton
                        type="button"
                        aria-label={savedBlogs.has(blog.id) ? 'Remove from saved' : 'Save blog'}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          '&:hover': { bgcolor: 'white' },
                        }}
                        onClick={(e) => { e.stopPropagation(); handleToggleSave(blog.id, e); }}
                      >
                        {savedBlogs.has(blog.id) ? (
                          <BookmarkIcon sx={{ color: colors.primary }} />
                        ) : (
                          <BookmarkBorderIcon sx={{ color: colors.textLight }} />
                        )}
                      </IconButton>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Author Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Avatar src={blog.author.avatar} sx={{ width: 32, height: 32 }}>
                          {blog.author.name[0]}
                        </Avatar>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text }}>
                              {blog.author.name}
                            </Typography>
                            {blog.author.isVerified && (
                              <VerifiedIcon sx={{ fontSize: 14, color: colors.primary }} />
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(blog.publishedAt), { addSuffix: true })}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Title & Excerpt */}
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: colors.text, lineHeight: 1.3 }}>
                        {blog.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          flexGrow: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {blog.excerpt}
                      </Typography>

                      {/* Tags */}
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                        {blog.tags.slice(0, 3).map((tag, i) => (
                          <Chip
                            key={i}
                            label={tag}
                            size="small"
                            sx={{
                              bgcolor: alpha(colors.primary, 0.08),
                              color: colors.primary,
                              fontWeight: 500,
                              fontSize: '0.7rem',
                            }}
                          />
                        ))}
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {/* Stats */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <TimeIcon fontSize="small" />
                            <Typography variant="caption">{blog.readTime} min</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <ViewIcon fontSize="small" />
                            <Typography variant="caption">{formatNumber(blog.views)}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                          {/* Like Button */}
                          <IconButton
                            size="small"
                            onClick={(e) => handleToggleLike(blog.id, e)}
                            sx={{
                              transition: 'transform 0.2s',
                              '&:hover': { transform: 'scale(1.2)' }
                            }}
                          >
                            {likedBlogs.has(blog.id) ? (
                              <FavoriteIcon fontSize="small" sx={{ color: colors.error }} />
                            ) : (
                              <FavoriteBorderIcon fontSize="small" />
                            )}
                          </IconButton>
                          <Typography variant="caption" sx={{ minWidth: 20 }}>
                            {formatNumber(blog.likes)}
                          </Typography>

                          {/* Comment Button */}
                          <IconButton size="small">
                            <CommentIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="caption" sx={{ minWidth: 20 }}>
                            {formatNumber(blog.comments)}
                          </Typography>

                          {/* Share Button */}
                          <IconButton
                            size="small"
                            onClick={(e) => handleShareClick(blog.id, e)}
                            sx={{
                              transition: 'transform 0.2s',
                              '&:hover': { transform: 'scale(1.2)', color: colors.primary }
                            }}
                          >
                            <ShareIcon fontSize="small" />
                          </IconButton>

                          {/* Bookmark Button */}
                          <IconButton
                            type="button"
                            size="small"
                            aria-label={savedBlogs.has(blog.id) ? 'Remove from saved' : 'Save blog'}
                            onClick={(e) => handleToggleSave(blog.id, e)}
                            sx={{
                              transition: 'transform 0.2s',
                              '&:hover': { transform: 'scale(1.2)' }
                            }}
                          >
                            {savedBlogs.has(blog.id) ? (
                              <BookmarkIcon fontSize="small" sx={{ color: colors.primary }} />
                            ) : (
                              <BookmarkBorderIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Edit/Delete Actions for Author */}
                      {String(blog.authorId) === String(currentUserId) && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={(e) => handleEditClick(blog, e)}
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<CloseIcon />}
                            onClick={(e) => handleDeleteClick(blog.id, e)}
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </BlogCard>
                </Grid>
              ))}
            </Grid>

            {filteredBlogs.length === 0 && (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No articles found
                </Typography>
                <Typography color="text.secondary">
                  Try adjusting your search or category filter
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Top Authors */}
            <SidebarCard>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.text }}>
                ✨ Top Authors
              </Typography>
              <List sx={{ p: 0 }}>
                {mockAuthors.slice(0, 5).map((author, index) => (
                  <ListItem
                    key={author.id}
                    sx={{
                      px: 0,
                      py: 1.5,
                      borderBottom: index < 4 ? `1px solid ${alpha(colors.primary, 0.1)}` : 'none',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={author.avatar} sx={{ bgcolor: colors.primary }}>
                        {author.name[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {author.name}
                          </Typography>
                          {author.isVerified && (
                            <VerifiedIcon sx={{ fontSize: 14, color: colors.primary }} />
                          )}
                        </Box>
                      }
                      secondary={author.title}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        borderColor: colors.primary,
                        color: colors.primary,
                        minWidth: 'auto',
                        px: 2,
                      }}
                    >
                      Follow
                    </Button>
                  </ListItem>
                ))}
              </List>
            </SidebarCard>

            {/* Popular Tags */}
            <SidebarCard>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.text }}>
                🏷️ Popular Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {popularTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    clickable
                    sx={{
                      bgcolor: alpha(colors.primary, 0.08),
                      color: colors.primary,
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: colors.primary,
                        color: 'white',
                      },
                    }}
                  />
                ))}
              </Box>
            </SidebarCard>

            {/* Newsletter */}
            <SidebarCard sx={{ background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)` }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                📬 Newsletter
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                Get the latest tech articles delivered to your inbox every week.
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your email"
                size="small"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: 'white',
                  color: colors.primary,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  },
                }}
              >
                Subscribe
              </Button>
            </SidebarCard>

            {/* Reading Stats */}
            <SidebarCard>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.text }}>
                📊 Your Reading Stats
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(colors.primary, 0.05), borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: colors.primary }}>
                      12
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Articles Read
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(colors.success, 0.1), borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: colors.success }}>
                      2.5h
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Time Spent
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(colors.warning, 0.1), borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: colors.warning }}>
                      5
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Bookmarked
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(colors.error, 0.1), borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: colors.error }}>
                      24
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Likes Given
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </SidebarCard>
          </Grid>
        </Grid>
      </Container>

      {/* Write Blog Dialog */}
      <Dialog
        open={writeDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          ✍️ Write a New Blog Post
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Share your knowledge and insights with the VerTechie community.
          </Typography>

          {/* Cover Image Upload */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: colors.text }}>
              📷 Cover Image
            </Typography>
            {coverImage ? (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 200,
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: `2px solid ${alpha(colors.primary, 0.2)}`,
                }}
              >
                <img
                  src={coverImage}
                  alt="Cover preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <IconButton
                  onClick={handleRemoveImage}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <Box
                component="label"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: 160,
                  border: `2px dashed ${alpha(colors.primary, 0.3)}`,
                  borderRadius: 3,
                  bgcolor: alpha(colors.primary, 0.03),
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: colors.primary,
                    bgcolor: alpha(colors.primary, 0.08),
                  },
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <CloudUploadIcon sx={{ fontSize: 48, color: colors.primary, mb: 1, opacity: 0.7 }} />
                <Typography variant="body2" sx={{ color: colors.primary, fontWeight: 500 }}>
                  Click to upload cover image
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PNG, JPG, GIF up to 5MB
                </Typography>
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            label="Title"
            placeholder="Enter a catchy title for your blog..."
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            sx={{ mb: 3 }}
          />
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Category (Optional)</InputLabel>
            <Select
              label="Category (Optional)"
              value={blogCategory}
              onChange={(e) => setBlogCategory(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">
                <em>No category</em>
              </MenuItem>
              {apiCategories.length > 0 ? (
                // Use API categories if available
                apiCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))
              ) : (
                // Show mock categories for UI (won't be sent to API)
                categories.filter(c => c.id !== 'all').map((cat) => (
                  <MenuItem key={cat.id} value="" disabled>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {cat.icon}
                      {cat.name} (Create in admin)
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* Tags Input */}
          <TextField
            fullWidth
            label="Tags"
            placeholder="Add tags separated by commas (e.g., React, JavaScript, Tutorial)"
            value={blogTags}
            onChange={(e) => setBlogTags(e.target.value)}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Content"
            placeholder="Write your blog content here... (Supports Markdown)"
            multiline
            rows={8}
            value={blogContent}
            onChange={(e) => setBlogContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography variant="caption" color="text.secondary">
            💡 Tip: Use Markdown formatting for better readability. Add code blocks, links, and images.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} disabled={publishing}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePublishBlog}
            disabled={publishing || !blogTitle.trim() || !blogContent.trim()}
            sx={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {publishing ? 'Publishing...' : 'Publish Blog'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Menu Popover */}
      <Dialog
        open={Boolean(shareMenuAnchor)}
        onClose={() => setShareMenuAnchor(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <ShareIcon sx={{ color: colors.primary }} />
            <Typography variant="h6" fontWeight={700}>Share this article</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, py: 2 }}>
            <IconButton
              onClick={() => handleShare('twitter')}
              sx={{
                bgcolor: '#1DA1F2',
                color: 'white',
                '&:hover': { bgcolor: '#0d8ed9', transform: 'scale(1.1)' },
                transition: 'all 0.2s',
              }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              onClick={() => handleShare('linkedin')}
              sx={{
                bgcolor: '#0077B5',
                color: 'white',
                '&:hover': { bgcolor: '#006097', transform: 'scale(1.1)' },
                transition: 'all 0.2s',
              }}
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              onClick={() => handleShare('facebook')}
              sx={{
                bgcolor: '#1877F2',
                color: 'white',
                '&:hover': { bgcolor: '#0d65d9', transform: 'scale(1.1)' },
                transition: 'all 0.2s',
              }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              onClick={() => handleShare('whatsapp')}
              sx={{
                bgcolor: '#25D366',
                color: 'white',
                '&:hover': { bgcolor: '#1eb851', transform: 'scale(1.1)' },
                transition: 'all 0.2s',
              }}
            >
              <WhatsAppIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Button
            fullWidth
            variant="outlined"
            startIcon={copySuccess ? <SparkleIcon /> : <CopyIcon />}
            onClick={() => handleShare('copy')}
            sx={{
              borderRadius: 2,
              py: 1.5,
              borderColor: copySuccess ? colors.success : colors.primary,
              color: copySuccess ? colors.success : colors.primary,
            }}
          >
            {copySuccess ? 'Link Copied!' : 'Copy Link'}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this blog post? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Blogs;

