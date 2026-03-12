/**
 * Blogs Page - VerTechie Tech Blog Platform
 * A beautiful, feature-rich blogging platform for tech professionals
 */

import React, { useState, useEffect, useCallback } from 'react';
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
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  Highlight as HighlightIcon,
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
// RICH TEXT EDITOR (Content tab - toolbar + contenteditable)
// ============================================
interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder = 'Write your content...', minHeight = 280 }) => {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const lastValueRef = React.useRef<string>(value);
  const savedSelectionRef = React.useRef<{ anchorNode: Node; anchorOffset: number; focusNode: Node; focusOffset: number } | null>(null);

  // Sync from parent only when value is set externally (e.g. opening edit dialog)
  React.useEffect(() => {
    if (value === lastValueRef.current) return;
    lastValueRef.current = value;
    const el = editorRef.current;
    if (!el) return;
    el.innerHTML = value || '';
  }, [value]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const el = editorRef.current;
    if (!el || !el.contains(range.commonAncestorContainer)) return;
    savedSelectionRef.current = {
      anchorNode: range.startContainer,
      anchorOffset: range.startOffset,
      focusNode: range.endContainer,
      focusOffset: range.endOffset,
    };
  };

  const restoreSelection = () => {
    const saved = savedSelectionRef.current;
    const el = editorRef.current;
    if (!saved || !el) return false;
    try {
      const sel = window.getSelection();
      if (!sel) return false;
      const range = document.createRange();
      range.setStart(saved.anchorNode, saved.anchorOffset);
      range.setEnd(saved.focusNode, saved.focusOffset);
      sel.removeAllRanges();
      sel.addRange(range);
      return true;
    } catch {
      return false;
    }
  };

  const handleInput = () => {
    const el = editorRef.current;
    if (el) {
      const html = el.innerHTML || '';
      lastValueRef.current = html;
      onChange(html);
    }
  };

  // Use mousedown + preventDefault so the editor keeps focus and selection when clicking toolbar
  const runCommand = (e: React.MouseEvent, command: string, value?: string) => {
    e.preventDefault();
    e.stopPropagation();
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    // If selection was lost (e.g. click on toolbar), restore it
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !el.contains(sel.anchorNode)) {
      restoreSelection();
    }
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand(command, false, value ?? undefined);
    handleInput();
  };

  const runHighlight = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    if (!window.getSelection()?.rangeCount) restoreSelection();
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand('backColor', false, '#fff59d');
    handleInput();
  };

  const runForeColor = (e: React.MouseEvent, color: string) => {
    e.preventDefault();
    e.stopPropagation();
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    if (!window.getSelection()?.rangeCount) restoreSelection();
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand('foreColor', false, color);
    handleInput();
  };

  const runFontSize = (e: React.MouseEvent, increase: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    if (!window.getSelection()?.rangeCount) restoreSelection();
    document.execCommand(increase ? 'increaseFontSize' : 'decreaseFontSize', false);
    handleInput();
  };

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper' }}>
      <Box
        sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 0.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#f8fafc' }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <Button size="small" variant="text" onMouseDown={(e) => runCommand(e, 'bold')} sx={{ minWidth: 36 }} title="Bold"><FormatBoldIcon fontSize="small" /></Button>
        <Button size="small" variant="text" onMouseDown={(e) => runCommand(e, 'italic')} sx={{ minWidth: 36 }} title="Italic"><FormatItalicIcon fontSize="small" /></Button>
        <Button size="small" variant="text" onMouseDown={(e) => runCommand(e, 'underline')} sx={{ minWidth: 36 }} title="Underline"><FormatUnderlinedIcon fontSize="small" /></Button>
        <Button size="small" variant="text" onMouseDown={runHighlight} sx={{ minWidth: 36 }} title="Highlight"><HighlightIcon fontSize="small" /></Button>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Button size="small" variant="text" onMouseDown={(e) => runFontSize(e, false)} sx={{ minWidth: 36 }} title="Decrease text size">A-</Button>
        <Button size="small" variant="text" onMouseDown={(e) => runFontSize(e, true)} sx={{ minWidth: 36 }} title="Increase text size">A+</Button>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Button size="small" variant="text" onMouseDown={(e) => runCommand(e, 'foreColor', '#000000')} sx={{ minWidth: 36 }} title="Black">A</Button>
        <Button size="small" variant="text" onMouseDown={(e) => runForeColor(e, '#b91c1c')} sx={{ minWidth: 36, color: '#b91c1c' }} title="Red">A</Button>
        <Button size="small" variant="text" onMouseDown={(e) => runForeColor(e, '#0d47a1')} sx={{ minWidth: 36, color: '#0d47a1' }} title="Blue">A</Button>
        <Button size="small" variant="text" onMouseDown={(e) => runForeColor(e, '#15803d')} sx={{ minWidth: 36, color: '#15803d' }} title="Green">A</Button>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Button size="small" variant="text" onMouseDown={(e) => runCommand(e, 'insertUnorderedList')} sx={{ minWidth: 36 }} title="Bullet list"><FormatListBulletedIcon fontSize="small" /></Button>
        <Button size="small" variant="text" onMouseDown={(e) => runCommand(e, 'insertOrderedList')} sx={{ minWidth: 36 }} title="Numbered list"><FormatListNumberedIcon fontSize="small" /></Button>
      </Box>
      <Box
        component="div"
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        data-placeholder={placeholder}
        sx={{
          minHeight,
          p: 2,
          outline: 'none',
          '&:empty::before': { content: 'attr(data-placeholder)', color: 'text.disabled' },
          '& h1': { fontSize: '1.75rem', fontWeight: 700, mb: 1 },
          '& h2': { fontSize: '1.35rem', fontWeight: 600, mb: 1 },
          '& h3': { fontSize: '1.15rem', fontWeight: 600, mb: 0.5 },
          '& ul, & ol': { pl: 3, my: 0.5 },
          '& a': { color: 'primary.main', textDecoration: 'underline' },
        }}
      />
    </Box>
  );
};

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
  categoryId?: string;
}

const parseApiDate = (value: string): Date => {
  const hasTimezone = /[zZ]|[+\-]\d{2}:?\d{2}$/.test(value);
  const normalized = hasTimezone ? value : `${value}Z`;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? new Date(value) : parsed;
};

const normalizeCategoryKey = (value?: string): string => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return '';
  if (raw === 'technology') return 'tech';
  if (raw === 'ai & ml' || raw === 'aiml' || raw === 'ai-ml') return 'ai';
  if (raw === 'startups') return 'startup';
  if (raw.includes('career')) return 'career';
  if (raw.includes('learn')) return 'learning';
  if (raw.includes('community')) return 'community';
  return raw.replace(/[^a-z0-9]/g, '');
};

const FALLBACK_BLOG_CATEGORIES = [
  { id: '', name: 'Technology', slug: 'tech' },
  { id: '', name: 'AI & ML', slug: 'ai' },
  { id: '', name: 'Career Growth', slug: 'career' },
  { id: '', name: 'Learning', slug: 'learning' },
  { id: '', name: 'Startups', slug: 'startup' },
  { id: '', name: 'Community', slug: 'community' },
];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CATEGORY_TAG_PREFIX = 'vt_category:';

const getCategoryFromTags = (rawTags: any[]): string => {
  if (!Array.isArray(rawTags)) return '';
  for (const tag of rawTags) {
    if (typeof tag !== 'string') continue;
    const trimmed = tag.trim().toLowerCase();
    if (trimmed.startsWith(CATEGORY_TAG_PREFIX)) {
      return trimmed.replace(CATEGORY_TAG_PREFIX, '').trim();
    }
  }
  return '';
};

const stripSystemTags = (rawTags: any[]): string[] => {
  if (!Array.isArray(rawTags)) return [];
  return rawTags
    .filter((t): t is string => typeof t === 'string')
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && !t.toLowerCase().startsWith(CATEGORY_TAG_PREFIX));
};

// ============================================
// COMPONENT
// ============================================
const Blogs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [writeDialogOpen, setWriteDialogOpen] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageError, setCoverImageError] = useState<string | null>(null);
  const [savedBlogs, setSavedBlogs] = useState<Set<string>>(new Set());
  const [likedBlogs, setLikedBlogs] = useState<Set<string>>(new Set());
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
  const [blogDetailOpen, setBlogDetailOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [selectedBlogDetail, setSelectedBlogDetail] = useState<BlogPost | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [blogComments, setBlogComments] = useState<Array<{
    id: string;
    authorId: string;
    content: string;
    createdAt: string;
  }>>([]);
  const [newComment, setNewComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const currentUserId = (() => {
    if (typeof window === 'undefined') return null;
    try {
      const rawUser = localStorage.getItem('userData');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        const id = parsed?.id || parsed?.user_id;
        if (id) return String(id);
      }
    } catch (err) {
      console.warn('Failed to parse userData:', err);
    }
    return localStorage.getItem(AUTHOR_ID_STORAGE_KEY) || localStorage.getItem('userId');
  })();

  // API Categories
  const [apiCategories, setApiCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [topAuthors, setTopAuthors] = useState<Author[]>([]);
  const [followedAuthorIds, setFollowedAuthorIds] = useState<Set<string>>(new Set());
  const [followLoadingAuthorId, setFollowLoadingAuthorId] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [authorsCount, setAuthorsCount] = useState(0);
  const [trendingTags, setTrendingTags] = useState<string[]>([]);
  const [myBlogStats, setMyBlogStats] = useState({
    articles_published: 0,
    total_views: 0,
    comments_received: 0,
    reactions_received: 0,
  });

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

  const fetchTopAuthors = useCallback(async () => {
    try {
      const response = await fetchWithAuth(getApiUrl('/blog/top-authors?limit=5'));
      if (!response.ok) {
        setTopAuthors([]);
        setAuthorsCount(0);
        return;
      }
      const data = await response.json();
      const items = Array.isArray(data?.items) ? data.items : [];
      setAuthorsCount(Number(data?.total_authors || items.length || 0));
      setTopAuthors(items.map((a: any) => ({
        id: String(a.id),
        name: a.name || 'Anonymous',
        avatar: a.avatar || '',
        title: a.title || '',
        isVerified: Boolean(a.is_verified),
        followers: Number(a.followers || 0),
      })));
    } catch (err) {
      console.error('Error fetching top authors:', err);
      setTopAuthors([]);
      setAuthorsCount(0);
    }
  }, []);

  const fetchFollowingAuthors = useCallback(async () => {
    try {
      const response = await fetchWithAuth(getApiUrl('/network/following'));
      if (!response.ok) {
        setFollowedAuthorIds(new Set());
        return;
      }
      const data = await response.json();
      const ids = (Array.isArray(data) ? data : [])
        .map((item: any) => String(item?.following_id || item?.user_id || ''))
        .filter(Boolean);
      setFollowedAuthorIds(new Set(ids));
    } catch (err) {
      console.error('Error fetching following authors:', err);
      setFollowedAuthorIds(new Set());
    }
  }, []);

  const fetchTrendingTags = useCallback(async () => {
    try {
      const response = await fetchWithAuth(getApiUrl('/blog/tags/trending?limit=10'));
      if (!response.ok) {
        setTrendingTags([]);
        return;
      }
      const data = await response.json();
      const list = Array.isArray(data) ? data : [];
      setTrendingTags(list.map((t: any) => t?.name).filter(Boolean));
    } catch (err) {
      console.error('Error fetching trending tags:', err);
      setTrendingTags([]);
    }
  }, []);

  const fetchMyBlogStats = useCallback(async () => {
    try {
      const response = await fetchWithAuth(getApiUrl('/blog/me/stats'));
      if (!response.ok) {
        setMyBlogStats({
          articles_published: 0,
          total_views: 0,
          comments_received: 0,
          reactions_received: 0,
        });
        return;
      }
      const data = await response.json();
      setMyBlogStats({
        articles_published: Number(data?.articles_published || 0),
        total_views: Number(data?.total_views || 0),
        comments_received: Number(data?.comments_received || 0),
        reactions_received: Number(data?.reactions_received || 0),
      });
    } catch (err) {
      console.error('Error fetching my blog stats:', err);
    }
  }, []);

  // Fetch blogs from API
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(getApiUrl('/blog/articles'));
      if (response.ok) {
        const data = await response.json();
        const mappedBlogs: BlogPost[] = data.map((article: any) => {
          const categoryId = article.category_id ? String(article.category_id) : '';
          const categoryFromApi = apiCategories.find((c) => String(c.id) === categoryId);
          const categoryFromTag = getCategoryFromTags(article.tags || []);
          const fallbackCategory = article.category_slug || article.category_name || categoryFromTag || 'tech';
          const categoryKey = categoryFromApi?.slug || normalizeCategoryKey(fallbackCategory) || 'tech';
          const readingTimeMinutes = Number(article.reading_time_minutes ?? article.read_time ?? Math.ceil((article.content?.length || 500) / 1000));
          return {
            id: article.id,
            title: article.title || 'Untitled',
            excerpt: article.excerpt || article.short_description || '',
            coverImage: article.cover_image || article.thumbnail || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
            category: categoryKey,
            categoryId: categoryId || undefined,
            author: {
              name: article.author_name || 'Anonymous',
              avatar: article.author_avatar || '',
              title: article.author_title || '',
              isVerified: article.author_verified || false,
              followers: 0,
            },
            publishedAt: article.published_at || article.created_at || new Date().toISOString(),
            readTime: Number.isFinite(readingTimeMinutes) ? readingTimeMinutes : 1,
            views: article.views_count || 0,
            likes: article.likes_count || 0,
            comments: article.comments_count || 0,
            tags: stripSystemTags(article.tags || []),
            isFeatured: article.is_featured || false,
            isTrending: article.is_trending || false,
            authorId: article.author_id,
          };
        });
        setBlogs(mappedBlogs);
      } else {
        setBlogs([]);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [apiCategories]);

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
    fetchCategories();
    fetchTopAuthors();
    fetchFollowingAuthors();
    fetchTrendingTags();
    fetchMyBlogStats();
    fetchMyBookmarks();
  }, [fetchCategories, fetchTopAuthors, fetchFollowingAuthors, fetchTrendingTags, fetchMyBlogStats, fetchMyBookmarks]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);
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

  const MAX_COVER_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_COVER_IMAGE_SIZE_BYTES) {
        setCoverImageError('Image size must be less than 5MB');
        setCoverImage(null);
        event.target.value = '';
        return;
      }
      setCoverImageError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverImageError(null);
  };

  const handleCloseDialog = () => {
    setBlogContent('');
    setBlogTitle('');
    setBlogCategory('');
    setBlogTags('');
    setCoverImage(null);
    setCoverImageError(null);
    setEditingBlogId(null);
    setWriteDialogOpen(false);
  };

  const handleOpenCreateDialog = () => {
    setBlogContent('');
    setBlogTitle('');
    setBlogCategory('');
    setBlogTags('');
    setCoverImage(null);
    setCoverImageError(null);
    setEditingBlogId(null);
    setWriteDialogOpen(true);
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
        setBlogTags(stripSystemTags(fullBlog.tags || []).join(', '));
        setBlogContent(fullBlog.content || '');
        setCoverImage(fullBlog.cover_image || blog.coverImage);
        setCoverImageError(null);
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

  const fetchComments = useCallback(async (blogId: string) => {
    try {
      setCommentsLoading(true);
      const response = await fetchWithAuth(getApiUrl(`/blog/articles/${blogId}/comments`));
      if (response.ok) {
        const data = await response.json();
        const mapped = (Array.isArray(data) ? data : []).map((c: any) => ({
          id: String(c.id),
          authorId: String(c.author_id || ''),
          content: c.content || '',
          createdAt: c.created_at || new Date().toISOString(),
        }));
        setBlogComments(mapped);
      } else {
        setBlogComments([]);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setBlogComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [apiCategories]);

  const handleOpenBlogDetails = async (blog: BlogPost) => {
    setBlogDetailOpen(true);
    setSelectedBlogId(blog.id);
    setSelectedBlogDetail(blog);
    setDetailLoading(true);
    try {
      const response = await fetchWithAuth(getApiUrl(`/blog/articles/${blog.id}`));
      if (response.ok) {
        const fullBlog = await response.json();
        const detail: BlogPost = {
          ...blog,
          title: fullBlog.title || blog.title,
          excerpt: fullBlog.excerpt || blog.excerpt,
          content: fullBlog.content || blog.content || '',
          coverImage: fullBlog.cover_image || blog.coverImage,
          category: fullBlog.category?.slug || normalizeCategoryKey(fullBlog.category_name) || getCategoryFromTags(fullBlog.tags || []) || blog.category,
          categoryId: fullBlog.category_id || blog.categoryId,
          publishedAt: fullBlog.published_at || fullBlog.created_at || blog.publishedAt,
          readTime: fullBlog.reading_time_minutes || blog.readTime,
          views: fullBlog.views_count ?? blog.views,
          likes: fullBlog.reactions_count ?? blog.likes,
          comments: fullBlog.comments_count ?? blog.comments,
          authorId: String(fullBlog.author_id || blog.authorId || ''),
          tags: stripSystemTags(
            Array.isArray(fullBlog.tags) ? fullBlog.tags.map((t: any) => (typeof t === 'string' ? t : t?.name)) : blog.tags
          ),
        };
        setSelectedBlogDetail(detail);
        setBlogs(prev => prev.map(b => (b.id === blog.id ? { ...b, views: detail.views, comments: detail.comments } : b)));
      }
      await fetchComments(blog.id);
    } catch (err) {
      console.error('Failed to fetch blog detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!selectedBlogId || !newComment.trim()) return;
    try {
      setCommentSubmitting(true);
      const response = await fetchWithAuth(getApiUrl(`/blog/articles/${selectedBlogId}/comments`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim() }),
      });
      if (response.ok) {
        setNewComment('');
        await fetchComments(selectedBlogId);
        setSelectedBlogDetail(prev => (prev ? { ...prev, comments: prev.comments + 1 } : prev));
        setBlogs(prev => prev.map(b => (b.id === selectedBlogId ? { ...b, comments: b.comments + 1 } : b)));
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setCommentSubmitting(false);
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
      let effectiveCategorySlug = '';
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (blogCategory) {
        if (uuidRegex.test(blogCategory)) {
          const matchedById = apiCategories.find((cat) => cat.id === blogCategory);
          effectiveCategorySlug = matchedById?.slug || '';
        } else {
          effectiveCategorySlug = normalizeCategoryKey(blogCategory);
        }
      }
      const categoryMarkerTag = effectiveCategorySlug ? `${CATEGORY_TAG_PREFIX}${effectiveCategorySlug}` : '';
      const finalTags = Array.from(new Set([...(tagsArray || []), ...(categoryMarkerTag ? [categoryMarkerTag] : [])]));

      // Build article data - set status to "published" so it's visible to all users
      const articleData: any = {
        title: blogTitle.trim(),
        slug: slug,
        content: blogContent.trim(),
        excerpt: blogContent.substring(0, 200).trim(),
        tags: finalTags,
        status: "published",  // Make blog visible immediately
      };

      // Only add cover_image if it exists
      if (coverImage) {
        articleData.cover_image = coverImage;
      }

      // Only add category_id if a valid API category is selected
      // Check if it's a valid UUID (from API categories)
      if (blogCategory && uuidRegex.test(blogCategory)) {
        articleData.category_id = blogCategory;
      } else if (blogCategory) {
        const matchedApiCategory = apiCategories.find((cat) => cat.slug === blogCategory);
        if (matchedApiCategory && uuidRegex.test(matchedApiCategory.id)) {
          articleData.category_id = matchedApiCategory.id;
        }
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
  const categoryOptions = (apiCategories.length > 0 ? apiCategories : FALLBACK_BLOG_CATEGORIES).map((cat) => ({
    value: apiCategories.length > 0 ? cat.id : cat.slug,
    label: cat.name,
  }));
  const chipMap = new Map<string, { id: string; name: string; icon: React.ReactElement }>();
  FALLBACK_BLOG_CATEGORIES.forEach((cat) => {
    chipMap.set(cat.slug, { id: cat.slug, name: cat.name, icon: <TagIcon fontSize="small" /> });
  });
  apiCategories.forEach((cat) => {
    if (cat.slug) {
      chipMap.set(cat.slug, { id: cat.slug, name: cat.name, icon: <TagIcon fontSize="small" /> });
    }
  });
  const categoryChips = [{ id: 'all', name: 'All Posts', icon: <StarIcon fontSize="small" /> }, ...Array.from(chipMap.values())];
  const getBlogCategoryKey = (blog: BlogPost): string => {
    if (blog.category && blog.category.trim()) return normalizeCategoryKey(blog.category);
    if (blog.categoryId) {
      const fromApi = apiCategories.find((c) => c.id === blog.categoryId);
      if (fromApi?.slug) return normalizeCategoryKey(fromApi.slug);
    }
    return '';
  };
  const getCategoryName = (blog: BlogPost): string => (
    categoryChips.find((c) => c.id === getBlogCategoryKey(blog))?.name ||
    apiCategories.find((c) => c.slug === blog.category || c.id === blog.categoryId)?.name ||
    blog.category?.replace(/[-_]/g, ' ') ||
    'General'
  );
  const filteredBlogs = blogs.filter(blog => {
    const blogCategoryKey = getBlogCategoryKey(blog);
    const selectedCategoryKey = normalizeCategoryKey(selectedCategory);
    const matchesCategory = selectedCategory === 'all' || blogCategoryKey === selectedCategoryKey;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleFollowAuthor = async (author: Author) => {
    const authorId = String(author.id || '');
    if (!authorId || followedAuthorIds.has(authorId)) return;
    try {
      setFollowLoadingAuthorId(authorId);
      const response = await fetchWithAuth(getApiUrl(`/network/follow/${authorId}`), { method: 'POST' });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        alert(errData?.detail || 'Failed to follow author.');
        return;
      }
      setFollowedAuthorIds((prev) => new Set(prev).add(authorId));
      setTopAuthors((prev) =>
        prev.map((a) => (String(a.id) === authorId ? { ...a, followers: Number(a.followers || 0) + 1 } : a))
      );
      await fetchFollowingAuthors();
      await fetchTopAuthors();
    } catch (err) {
      console.error('Follow author failed:', err);
      alert('Failed to follow author.');
    } finally {
      setFollowLoadingAuthorId(null);
    }
  };

  const handleUnfollowAuthor = async (author: Author) => {
    const authorId = String(author.id || '');
    if (!authorId || !followedAuthorIds.has(authorId)) return;
    try {
      setFollowLoadingAuthorId(authorId);
      const response = await fetchWithAuth(getApiUrl(`/network/follow/${authorId}`), { method: 'DELETE' });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        alert(errData?.detail || 'Failed to unfollow author.');
        return;
      }
      setFollowedAuthorIds((prev) => {
        const next = new Set(prev);
        next.delete(authorId);
        return next;
      });
      setTopAuthors((prev) =>
        prev.map((a) => (String(a.id) === authorId ? { ...a, followers: Math.max(0, Number(a.followers || 0) - 1) } : a))
      );
      await fetchFollowingAuthors();
      await fetchTopAuthors();
    } catch (err) {
      console.error('Unfollow author failed:', err);
      alert('Failed to unfollow author.');
    } finally {
      setFollowLoadingAuthorId(null);
    }
  };

  const handleNewsletterSubscribe = async () => {
    const email = newsletterEmail.trim().toLowerCase();
    if (!EMAIL_REGEX.test(email)) {
      alert('Enter a valid email address.');
      return;
    }
    try {
      setNewsletterSubmitting(true);
      const response = await fetchWithAuth(
        getApiUrl(`/blog/newsletter/subscribe?email=${encodeURIComponent(email)}`),
        { method: 'POST' }
      );
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        alert(errData?.detail || 'Failed to subscribe newsletter.');
        return;
      }
      setNewsletterEmail('');
      alert('Newsletter subscribed successfully.');
    } catch (err) {
      console.error('Newsletter subscribe failed:', err);
      alert('Failed to subscribe newsletter.');
    } finally {
      setNewsletterSubmitting(false);
    }
  };

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
                    label={`${authorsCount} Authors`}
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
                  onClick={handleOpenCreateDialog}
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
                  <FeaturedBlogCard onClick={() => handleOpenBlogDetails(blog)}>
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
                        label={getCategoryName(blog)}
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
                <Typography variant="caption" color="text.secondary" sx={{ width: '100%', mb: 0.5 }}>
                  Filter by category
                </Typography>
                {categoryChips.map((category) => (
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
                  <BlogCard sx={{ animationDelay: `${index * 0.1}s` }} onClick={() => handleOpenBlogDetails(blog)}>
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
                        label={getCategoryName(blog)}
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
                            {formatDistanceToNow(parseApiDate(blog.publishedAt), { addSuffix: true })}
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
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenBlogDetails(blog); }}>
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
                {topAuthors.map((author, index) => (
                  <ListItem
                    key={author.id}
                    sx={{
                      px: 0,
                      py: 1.5,
                      borderBottom: index < topAuthors.length - 1 ? `1px solid ${alpha(colors.primary, 0.1)}` : 'none',
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
                      secondary={`${author.title || 'Author'}${author.followers ? ` • ${author.followers} followers` : ''}`}
                    />
                    <Button
                      size="small"
                      variant={followedAuthorIds.has(String(author.id)) ? 'contained' : 'outlined'}
                      disabled={followLoadingAuthorId === String(author.id)}
                      onClick={() => followedAuthorIds.has(String(author.id)) ? handleUnfollowAuthor(author) : handleFollowAuthor(author)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        borderColor: colors.primary,
                        color: followedAuthorIds.has(String(author.id)) ? 'white' : colors.primary,
                        bgcolor: followedAuthorIds.has(String(author.id)) ? colors.primary : 'transparent',
                        minWidth: 'auto',
                        px: 2,
                        '&:hover': {
                          borderColor: colors.primary,
                          bgcolor: followedAuthorIds.has(String(author.id)) ? colors.primaryDark : alpha(colors.primary, 0.08),
                        },
                      }}
                    >
                      {followLoadingAuthorId === String(author.id)
                        ? '...'
                        : followedAuthorIds.has(String(author.id))
                          ? 'Unfollow'
                          : 'Follow'}
                    </Button>
                  </ListItem>
                ))}
                {topAuthors.length === 0 && (
                  <Typography variant="body2" color="text.secondary">No author data available.</Typography>
                )}
              </List>
            </SidebarCard>

            {/* Popular Tags */}
            <SidebarCard>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.text }}>
                🏷️ Popular Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {trendingTags.map((tag) => (
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
                {trendingTags.length === 0 && (
                  <Typography variant="body2" color="text.secondary">No tag data available.</Typography>
                )}
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
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
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
                onClick={handleNewsletterSubscribe}
                disabled={newsletterSubmitting || !newsletterEmail.trim()}
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
                {newsletterSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </SidebarCard>

            {/* Blog Stats */}
            <SidebarCard>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.text }}>
                📊 Your Blog Stats
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(colors.primary, 0.05), borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: colors.primary }}>
                      {myBlogStats.articles_published}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Articles Published
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(colors.success, 0.1), borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: colors.success }}>
                      {formatNumber(myBlogStats.total_views)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Views
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(colors.warning, 0.1), borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: colors.warning }}>
                      {formatNumber(myBlogStats.comments_received)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Comments Received
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(colors.error, 0.1), borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: colors.error }}>
                      {formatNumber(myBlogStats.reactions_received)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Reactions Received
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
                  border: `2px solid ${coverImageError ? colors.error : alpha(colors.primary, 0.2)}`,
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
                  border: `2px dashed ${coverImageError ? colors.error : alpha(colors.primary, 0.3)}`,
                  borderRadius: 3,
                  bgcolor: coverImageError ? alpha(colors.error, 0.04) : alpha(colors.primary, 0.03),
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: coverImageError ? colors.error : colors.primary,
                    bgcolor: coverImageError ? alpha(colors.error, 0.08) : alpha(colors.primary, 0.08),
                  },
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <CloudUploadIcon sx={{ fontSize: 48, color: coverImageError ? colors.error : colors.primary, mb: 1, opacity: 0.7 }} />
                <Typography variant="body2" sx={{ color: coverImageError ? colors.error : colors.primary, fontWeight: 500 }}>
                  Click to upload cover image
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PNG, JPG, GIF up to 5MB
                </Typography>
              </Box>
            )}
            {coverImageError && (
              <Typography variant="caption" sx={{ color: colors.error, mt: 0.5, display: 'block' }}>
                {coverImageError}
              </Typography>
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
              {categoryOptions.map((cat) => (
                <MenuItem key={`${cat.value}-${cat.label}`} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
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

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: colors.text }}>
            Content
          </Typography>
          <RichTextEditor
            value={blogContent}
            onChange={setBlogContent}
            placeholder="Write your blog content here... Use toolbar for bold, highlight, underline, italic, text size, text color, and lists."
            minHeight={280}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Use toolbar formatting: bold, italic, underline, highlight, text size increase/decrease, text color, bullet and numbered lists.
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

      {/* Blog Details Dialog */}
      <Dialog
        open={blogDetailOpen}
        onClose={() => setBlogDetailOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {selectedBlogDetail?.title || 'Blog Details'}
        </DialogTitle>
        <DialogContent dividers>
          {detailLoading ? (
            <Typography color="text.secondary">Loading blog details...</Typography>
          ) : (
            <>
              {selectedBlogDetail?.coverImage && (
                <Box
                  component="img"
                  src={selectedBlogDetail.coverImage}
                  alt={selectedBlogDetail.title}
                  sx={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 2, mb: 2 }}
                />
              )}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip size="small" label={selectedBlogDetail?.category || 'General'} />
                <Chip size="small" icon={<TimeIcon fontSize="small" />} label={`${selectedBlogDetail?.readTime || 1} min read`} />
              </Box>
              <Box
                sx={{
                  lineHeight: 1.8,
                  mb: 3,
                  '& p': { my: 1 },
                  '& ul, & ol': { pl: 3, my: 1 },
                  '& a': { color: colors.primary, textDecoration: 'underline' },
                }}
                dangerouslySetInnerHTML={{
                  __html: selectedBlogDetail?.content || selectedBlogDetail?.excerpt || '<p>No content available.</p>',
                }}
              />

              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Comments ({blogComments.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleSubmitComment}
                  disabled={commentSubmitting || !newComment.trim()}
                  sx={{ textTransform: 'none' }}
                >
                  {commentSubmitting ? 'Posting...' : 'Post'}
                </Button>
              </Box>
              {commentsLoading ? (
                <Typography color="text.secondary">Loading comments...</Typography>
              ) : blogComments.length === 0 ? (
                <Typography color="text.secondary">No comments yet.</Typography>
              ) : (
                <List sx={{ p: 0 }}>
                  {blogComments.map((comment) => (
                    <ListItem key={comment.id} sx={{ px: 0, alignItems: 'flex-start' }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primary }}>
                          {(comment.authorId || 'U')[0]?.toUpperCase() || 'U'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {String(comment.authorId) === String(currentUserId) ? 'You' : 'User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </Typography>
                          </Box>
                        }
                        secondary={comment.content}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlogDetailOpen(false)}>Close</Button>
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


