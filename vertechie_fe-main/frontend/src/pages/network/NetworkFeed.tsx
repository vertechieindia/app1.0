/**
 * NetworkFeed - Feed page for posts and updates
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Button, IconButton,
  TextField, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  Badge, Tooltip, Snackbar, Alert, useTheme, alpha, CircularProgress,
  Menu, MenuItem, ListItemIcon, ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  MoreVert, Favorite, FavoriteBorder, Comment, Share, Bookmark,
  BookmarkBorder, Public, Add, Verified, Image as ImageIcon,
  EmojiEmotions, Poll, Videocam, Article, Close,
  ThumbUp, ThumbUpOutlined, Celebration, Lightbulb, 
  SentimentVerySatisfied, Whatshot, LocalFireDepartment,
  Refresh, ContentCopy, Repeat,
  ContentPaste,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import NetworkLayout from '../../components/network/NetworkLayout';
import { api } from '../../services/apiClient';
import { API_ENDPOINTS } from '../../config/api';
import { communityService } from '../../services/communityService';

// ============================================
// STYLED COMPONENTS
// ============================================
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    transform: 'translateY(-2px)',
  },
}));

const PostCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  marginBottom: theme.spacing(2),
  overflow: 'visible',
}));

// ============================================
// INTERFACES
// ============================================
interface User {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
  company?: string;
  is_verified?: boolean;
}

interface Reactions {
  like: number;
  love: number;
  celebrate: number;
  insightful: number;
  funny: number;
}

interface Post {
  id: string;
  author: User;
  content: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked: boolean;
  is_saved: boolean;
  created_at: string;
  group?: { id: string; name: string };
  reactions?: Reactions;
  hashtags?: string[];
  post_type?: string;  // text, poll, link, image, video, article
  /** Media items: [{ url, type?, thumbnail? }]. Rendered as images in the feed. */
  media?: { url: string; type?: string; thumbnail?: string }[];
  poll_data?: {
    question?: string;
    options?: string[];
    vote_counts?: Record<number, number>;  // {0: 5, 1: 3} means option 0 has 5 votes, option 1 has 3 votes
    total_votes?: number;
    user_vote?: number;  // Index of option user voted for
    end_date?: string;
    is_closed?: boolean;
  };
  link_url?: string;
}

interface SavedFeedPostItem {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
}

// Reaction types for the hover picker
const reactionTypes = [
  { type: 'like', icon: '👍', label: 'Like', color: '#0d47a1' },
  { type: 'love', icon: '❤️', label: 'Love', color: '#e91e63' },
  { type: 'celebrate', icon: '🎉', label: 'Celebrate', color: '#ff9800' },
  { type: 'insightful', icon: '💡', label: 'Insightful', color: '#ffc107' },
  { type: 'funny', icon: '😄', label: 'Funny', color: '#4caf50' },
];

// ============================================
// MOCK DATA
// ============================================
// Mock posts removed - using real data only

const commonEmojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '💡', '✨', '🚀', '💪', '👏', '🙌', '💯', '⭐', '🎯', '📈'];

const parseApiDate = (value: string): Date => {
  // Backend may return naive UTC timestamps (without trailing Z).
  const hasTimezone = /[zZ]|[+\-]\d{2}:?\d{2}$/.test(value);
  const normalized = hasTimezone ? value : `${value}Z`;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? new Date(value) : parsed;
};

const isVideoMedia = (media: { url: string; type?: string; thumbnail?: string }) => {
  const type = String(media.type || '').toLowerCase();
  if (type.startsWith('video')) return true;
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(media.url);
};

const parsePollEndDate = (value?: string): Date | null => {
  if (!value || typeof value !== 'string') return null;
  const text = value.trim();
  if (!text) return null;
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(text);
  const normalized = dateOnly ? `${text}T23:59:59Z` : text;
  const parsed = parseApiDate(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getCurrentUserId = (): string => {
  try {
    const raw = localStorage.getItem('userData');
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return String(parsed?.id || parsed?.user_id || '');
  } catch {
    return '';
  }
};

const getSavedPostsStorageKey = (userId: string) => `vt_saved_feed_posts_${userId || 'anonymous'}`;
const MAX_POST_LENGTH = 3000;
const MAX_COMMENT_LENGTH = 500;
const normalizeSpaces = (value: string) => value.replace(/\s+/g, ' ').trim();
const hasLetters = (value: string) => /[A-Za-z]/.test(value);
const isValidHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// ============================================
// COMPONENT
// ============================================
const NetworkFeed: React.FC = () => {
  const theme = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [attachedImages, setAttachedImages] = useState<File[]>([]);
  const [attachedVideo, setAttachedVideo] = useState<File | null>(null);
  const [showArticleInput, setShowArticleInput] = useState(false);
  const [articleLink, setArticleLink] = useState('');
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [reactionPickerPostId, setReactionPickerPostId] = useState<string | null>(null);
  const [reactionPickerAnchor, setReactionPickerAnchor] = useState<null | HTMLElement>(null);
  const [selectedReactions, setSelectedReactions] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [postComments, setPostComments] = useState<Record<string, any[]>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
  const [shareAnchor, setShareAnchor] = useState<null | HTMLElement>(null);
  const [sharePostId, setSharePostId] = useState<string | null>(null);
  const [postMenuAnchor, setPostMenuAnchor] = useState<null | HTMLElement>(null);
  const [postMenuPostId, setPostMenuPostId] = useState<string | null>(null);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [trendingHashtags, setTrendingHashtags] = useState<string[]>([]);
  const currentUserId = getCurrentUserId();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const resetCreatePostForm = () => {
    setPostContent('');
    setAttachedImages([]);
    setAttachedVideo(null);
    setArticleLink('');
    setPollOptions(['', '']);
    setShowPollCreator(false);
    setShowArticleInput(false);
    setShowEmojiPicker(false);
  };

  const getUniquePollOptions = (options: string[]) => {
    const uniqueMap = new Map<string, string>();
    options
      .map((opt) => normalizeSpaces(opt))
      .filter(Boolean)
      .forEach((opt) => {
        if (!uniqueMap.has(opt.toLowerCase())) uniqueMap.set(opt.toLowerCase(), opt);
      });
    return Array.from(uniqueMap.values());
  };

  const validateComment = (value: string) => {
    const normalized = normalizeSpaces(value);
    if (!normalized) return 'Comment cannot be empty.';
    if (!hasLetters(normalized)) return 'Comment should contain meaningful text.';
    if (normalized.length > MAX_COMMENT_LENGTH) return `Comment should be under ${MAX_COMMENT_LENGTH} characters.`;
    return null;
  };

  const getCreatePostValidationError = () => {
    const normalizedContent = normalizeSpaces(postContent);
    const normalizedArticle = normalizeSpaces(articleLink);
    const uniquePollOptions = getUniquePollOptions(pollOptions);
    const hasPoll = showPollCreator && uniquePollOptions.length >= 2;
    const hasContent = !!normalizedContent;
    const hasImages = attachedImages.length > 0;
    const hasVideo = !!attachedVideo;
    const hasArticle = !!normalizedArticle;

    if (!hasContent && !hasPoll && !hasImages && !hasVideo && !hasArticle) {
      return 'Please add content, image/video, article link, or a poll with at least 2 options';
    }
    if (hasContent && normalizedContent.length > MAX_POST_LENGTH) {
      return `Post content should be under ${MAX_POST_LENGTH} characters.`;
    }
    if (hasContent && !hasLetters(normalizedContent) && !hasImages && !hasVideo && !hasArticle && !hasPoll) {
      return 'Post content should contain meaningful text.';
    }
    if (hasArticle && !isValidHttpUrl(normalizedArticle)) {
      return 'Article link must be a valid http/https URL.';
    }
    if (showPollCreator) {
      if (uniquePollOptions.length < 2) return 'Poll needs at least 2 unique options.';
      if (uniquePollOptions.some((opt) => opt.length < 2 || !hasLetters(opt))) {
        return 'Poll options must be meaningful text.';
      }
    }
    return null;
  };

  const canCreatePost = !getCreatePostValidationError();

  // Fetch feed from API
  useEffect(() => {
    fetchFeed();
    fetchTrendingHashtags();
  }, []);

  const fetchTrendingHashtags = async () => {
    try {
      const response = await api.get<Array<{ tag?: string }>>(API_ENDPOINTS.UNIFIED_NETWORK.TRENDING, {
        params: { limit: 12 },
      });
      const tags = (Array.isArray(response) ? response : [])
        .map((item) => String(item?.tag || '').trim())
        .filter(Boolean);
      setTrendingHashtags(tags);
    } catch (err) {
      console.error('Failed to load trending hashtags:', err);
      setTrendingHashtags([]);
    }
  };

  useEffect(() => {
    const loadRelationshipState = async () => {
      try {
        const [following, connections] = await Promise.all([
          api.get<any[]>('/network/following'),
          api.get<any[]>('/network/connections'),
        ]);
        const nextFollowing = new Set((Array.isArray(following) ? following : []).map((f: any) => String(f.following_id)));
        const nextConnected = new Set<string>();
        (Array.isArray(connections) ? connections : []).forEach((c: any) => {
          const a = String(c.user_id || '');
          const b = String(c.connected_user_id || '');
          if (a && a !== currentUserId) nextConnected.add(a);
          if (b && b !== currentUserId) nextConnected.add(b);
        });
        setFollowingIds(nextFollowing);
        setConnectedIds(nextConnected);
      } catch (err) {
        console.error('Failed to load follow/connection state:', err);
      }
    };
    loadRelationshipState();
  }, [currentUserId]);

  // Scroll to post when opening a shared link (e.g. /techie/home/feed#post-{id})
  useEffect(() => {
    if (loading || posts.length === 0) return;
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const m = /^#post-(.+)$/.exec(hash);
    if (m) {
      const el = document.getElementById(`post-${m[1]}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loading, posts]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      const savedKey = getSavedPostsStorageKey(currentUserId);
      const savedRecords: SavedFeedPostItem[] = JSON.parse(localStorage.getItem(savedKey) || '[]');
      const savedIds = new Set(savedRecords.map((p) => String(p.id)));
      
      // Fetch from unified-network/feed endpoint
      const feedItems = await api.get<any[]>(API_ENDPOINTS.UNIFIED_NETWORK.FEED, {
        params: { limit: 20 }
      });
      
      // Map FeedItem to Post interface
      const mappedPosts: Post[] = feedItems.map((item) => ({
        id: item.id,
        author: {
          id: item.author_id,
          name: item.author_name,
          avatar: item.author_avatar || undefined,
          title: item.author_title || undefined,
          is_verified: item.author_verified || false,
        },
        content: item.content || '',
        likes_count: item.likes_count || 0,
        comments_count: item.comments_count || 0,
        shares_count: item.shares_count || 0,
        is_liked: item.is_liked || false,
        is_saved: savedIds.has(String(item.id)) || item.is_saved || false,
        created_at: item.created_at
          ? `posted ${formatDistanceToNow(parseApiDate(item.created_at), { addSuffix: true })}`
          : 'posted just now',
        group: item.group_id && item.group_name 
          ? { id: item.group_id, name: item.group_name }
          : undefined,
        reactions: undefined, // Backend doesn't provide detailed reactions yet
        hashtags: undefined, // Extract from content if needed
        post_type: item.post_type || item.type || 'text',
        poll_data: item.poll_data ? {
          ...item.poll_data,
          vote_counts: item.poll_data.vote_counts || {},
          total_votes: item.poll_data.total_votes || 0,
          user_vote: item.poll_data.user_vote !== undefined ? item.poll_data.user_vote : undefined,
        } : undefined,
        link_url: item.link_url || undefined,
        media: item.media || [],
      }));
      
      // Only use real data, don't fallback to mock
      if (mappedPosts.length > 0) {
        setPosts(mappedPosts);
      } else {
        setPosts([]);
        setError('No posts found. Be the first to post!');
      }
    } catch (err: any) {
      console.error('Error fetching feed:', err);
      setError('Failed to load feed. Please try again.');
      // Don't show mock data - show empty state instead
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle reaction selection
  const handleReaction = async (postId: string, reactionType: string) => {
    const targetPost = posts.find((p) => p.id === postId);
    if (!targetPost) return;

    const previousReaction = selectedReactions[postId] || '';
    const nextReaction = previousReaction === reactionType ? '' : reactionType;
    const hadReaction = !!previousReaction || !!targetPost.is_liked;
    const willHaveReaction = !!nextReaction;
    const shouldBeLikedOnServer = nextReaction === 'like';
    const shouldToggleLikeApi = shouldBeLikedOnServer !== !!targetPost.is_liked;

    setSelectedReactions(prev => ({
      ...prev,
      [postId]: nextReaction,
    }));
    setReactionPickerPostId(null);
    setReactionPickerAnchor(null);
    setPosts(prev => prev.map(p => 
      p.id === postId
        ? {
            ...p,
            is_liked: shouldBeLikedOnServer,
            likes_count: !hadReaction && willHaveReaction
              ? p.likes_count + 1
              : hadReaction && !willHaveReaction
                ? Math.max(0, p.likes_count - 1)
                : p.likes_count,
          }
        : p
    ));

    if (shouldToggleLikeApi) {
      try {
        await communityService.likePost(postId);
      } catch (err) {
        console.error('Error syncing like state:', err);
      }
    }
  };

  const openReactionPicker = (postId: string, anchorEl: HTMLElement) => {
    setReactionPickerPostId(postId);
    setReactionPickerAnchor(anchorEl);
  };

  const closeReactionPicker = () => {
    setReactionPickerPostId(null);
    setReactionPickerAnchor(null);
  };

  // Save post
  const handleSavePost = (postId: string) => {
    const target = posts.find((p) => p.id === postId);
    if (!target) return;
    const savedKey = getSavedPostsStorageKey(currentUserId);
    const existing: SavedFeedPostItem[] = JSON.parse(localStorage.getItem(savedKey) || '[]');
    const isSaved = existing.some((p) => String(p.id) === String(postId));
    const next = isSaved
      ? existing.filter((p) => String(p.id) !== String(postId))
      : [{
          id: postId,
          content: target.content || '',
          author_name: target.author?.name || 'User',
          created_at: new Date().toISOString(),
        }, ...existing];
    localStorage.setItem(savedKey, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('vt_saved_posts_updated'));
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, is_saved: !isSaved } : p
    ));
    setSnackbar({ open: true, message: isSaved ? 'Post removed from saved' : 'Post saved!', severity: 'success' });
  };

  // Copy link to post (works in private/incognito; only people with the link can view)
  const handleCopyPostLink = (postId: string) => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/techie/home/feed#post-${postId}`
      : `https://vertechie.com/techie/home/feed#post-${postId}`;
    navigator.clipboard.writeText(url);
    setShareAnchor(null);
    setSharePostId(null);
    setSnackbar({ open: true, message: 'Link copied.', severity: 'success' });
  };

  const openPostMenu = (postId: string, anchorEl: HTMLElement) => {
    setPostMenuPostId(postId);
    setPostMenuAnchor(anchorEl);
  };

  const closePostMenu = () => {
    setPostMenuPostId(null);
    setPostMenuAnchor(null);
  };

  const handleFollowFromPost = async () => {
    if (!postMenuPostId) return;
    const post = posts.find((p) => p.id === postMenuPostId);
    const targetUserId = String(post?.author?.id || '');
    if (!targetUserId || targetUserId === currentUserId) return;
    try {
      await api.post(`/network/follow/${targetUserId}`);
      setFollowingIds((prev) => new Set(prev).add(targetUserId));
      setSnackbar({ open: true, message: 'Followed successfully', severity: 'success' });
      closePostMenu();
    } catch (err: any) {
      const msg = err?.message || 'Failed to follow user';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  const handleConnectFromPost = async () => {
    if (!postMenuPostId) return;
    const post = posts.find((p) => p.id === postMenuPostId);
    const targetUserId = String(post?.author?.id || '');
    if (!targetUserId || targetUserId === currentUserId) return;
    try {
      await api.post(`/unified-network/quick-connect/${targetUserId}`);
      setConnectedIds((prev) => new Set(prev).add(targetUserId));
      setSnackbar({ open: true, message: 'Connection request sent', severity: 'success' });
      closePostMenu();
    } catch (err: any) {
      const msg = err?.message || 'Failed to send connection request';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  // Toggle comments
  const handleToggleComments = async (postId: string) => {
    const isExpanded = expandedComments[postId];
    setExpandedComments(prev => ({ ...prev, [postId]: !isExpanded }));
    
    // Load comments if expanding
    if (!isExpanded && !postComments[postId]) {
      await loadComments(postId);
    }
  };

  // Load comments for a post
  const loadComments = async (postId: string) => {
    try {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));
      const comments = await communityService.getComments(postId);
      setPostComments(prev => ({ ...prev, [postId]: comments }));
    } catch (err) {
      console.error('Error loading comments:', err);
      setSnackbar({ open: true, message: 'Failed to load comments', severity: 'error' });
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Vote on poll
  const handleVotePoll = async (postId: string, optionIndex: number, optionText: string) => {
    const previousVote = posts.find((p) => p.id === postId)?.poll_data?.user_vote;
    try {
      // Call the vote endpoint with option_index as query parameter
      const response: any = await api.post(
        `/community/posts/${postId}/vote?option_index=${optionIndex}`,
        {}
      );
      
      // Optimistically update the UI
      setPosts(prev => prev.map(p => {
        if (p.id === postId && p.poll_data) {
          const updatedPollData = { ...p.poll_data };
          updatedPollData.user_vote = optionIndex;
          // Update vote counts if returned
          if (response && response.vote_counts) {
            updatedPollData.vote_counts = response.vote_counts;
            updatedPollData.total_votes = response.total_votes || 0;
          }
          return { ...p, poll_data: updatedPollData };
        }
        return p;
      }));
      
      // Refresh feed to get updated vote counts from server
      await fetchFeed();
      
      const voteMessage = previousVote === undefined || previousVote === null
        ? `You voted for: ${optionText}`
        : previousVote === optionIndex
          ? `Vote unchanged: ${optionText}`
          : `Vote changed to: ${optionText}`;
      setSnackbar({ 
        open: true, 
        message: voteMessage, 
        severity: 'success' 
      });
    } catch (err: any) {
      console.error('Error voting:', err);
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to vote. Please try again.';
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: 'error' 
      });
    }
  };

  const handleRepost = async (postId: string) => {
    try {
      await communityService.repostPost(postId);
      await fetchFeed();
      setSnackbar({ open: true, message: 'Post reposted to your feed.', severity: 'success' });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to repost. Please try again.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  // Add comment
  const handleAddComment = async (postId: string) => {
    const commentText = normalizeSpaces(commentTexts[postId] || '');
    const commentError = validateComment(commentText);
    if (commentError) {
      setSnackbar({ open: true, message: commentError, severity: 'error' });
      return;
    }

    try {
      await communityService.addComment(postId, { content: commentText });
      
      // Clear comment input
      setCommentTexts(prev => {
        const { [postId]: _, ...rest } = prev;
        return rest;
      });
      
      // Reload comments
      await loadComments(postId);
      
      // Update post comment count
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p
      ));
      
      setSnackbar({ open: true, message: 'Comment added!', severity: 'success' });
    } catch (err) {
      console.error('Error adding comment:', err);
      setSnackbar({ open: true, message: 'Failed to add comment', severity: 'error' });
    }
  };

  // Create post
  const handleCreatePost = async () => {
    const validationError = getCreatePostValidationError();
    if (validationError) {
      setSnackbar({ open: true, message: validationError, severity: 'error' });
      return;
    }

    const normalizedContent = normalizeSpaces(postContent);
    const normalizedArticle = normalizeSpaces(articleLink);
    const uniquePollOptions = getUniquePollOptions(pollOptions);
    const hasPoll = showPollCreator && uniquePollOptions.length >= 2;
    const hasContent = !!normalizedContent;
    const hasImages = attachedImages.length > 0;
    const hasVideo = !!attachedVideo;
    const hasArticle = !!normalizedArticle;

    try {
      // Upload media first if any
      let mediaUrls: string[] = [];
      let videoUrl = '';
      if (attachedImages.length > 0) {
        try {
          mediaUrls = await Promise.all(
            attachedImages.map(async (file) => {
              const { url } = await communityService.uploadPostImage(file);
              return url;
            })
          );
        } catch (upErr) {
          console.error('Error uploading images:', upErr);
          setSnackbar({ open: true, message: 'Failed to upload images. Please try again.', severity: 'error' });
          return;
        }
      }
      if (attachedVideo) {
        try {
          const { url } = await communityService.uploadPostVideo(attachedVideo);
          videoUrl = url;
        } catch (upErr) {
          console.error('Error uploading video:', upErr);
          setSnackbar({ open: true, message: 'Failed to upload video. Please try again.', severity: 'error' });
          return;
        }
      }

      // Prepare post data
      const postData: Record<string, unknown> = {
        visibility: 'public',
      };
      if (hasContent) postData.content = normalizedContent;
      if (mediaUrls.length > 0) {
        postData.media = mediaUrls.map((url) => ({ url, type: 'image' }));
        if (!postData.post_type) postData.post_type = 'image';
      }
      if (videoUrl) {
        const existingMedia = Array.isArray(postData.media) ? postData.media as Array<{ url: string; type?: string }> : [];
        postData.media = [...existingMedia, { url: videoUrl, type: 'video' }];
        if (!postData.post_type) postData.post_type = 'video';
      }
      if (hasPoll) {
        postData.post_type = 'poll';
        postData.poll_data = {
          question: normalizedContent || 'What do you think?',
          options: uniquePollOptions,
        };
      } else if (hasArticle) {
        postData.post_type = 'link';
        postData.link_url = normalizedArticle;
      }

      // Call API to create post
      await communityService.createPost(postData as any);
      
      // Refresh feed to get the new post
      await fetchFeed();
      await fetchTrendingHashtags();
      
      resetCreatePostForm();
      setCreatePostOpen(false);
      setSnackbar({ open: true, message: 'Post created successfully!', severity: 'success' });
    } catch (err) {
      console.error('Error creating post:', err);
      setSnackbar({ open: true, message: 'Failed to create post. Please try again.', severity: 'error' });
    }
  };

  // Image handling
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 4 - attachedImages.length);
      setAttachedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Video handling
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedVideo(file);
      setAttachedImages([]);
    }
  };

  const handlePasteArticleLink = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && /^https?:\/\//i.test(text.trim())) {
        setShowArticleInput(true);
        setArticleLink(text.trim());
        setSnackbar({ open: true, message: 'Article link pasted', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Clipboard does not contain a valid URL', severity: 'error' });
      }
    } catch {
      setSnackbar({ open: true, message: 'Clipboard access denied. Paste manually.', severity: 'error' });
    }
  };

  // Poll handling
  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions(prev => [...prev, '']);
    }
  };

  const removePollOption = (index: number) => {
    setPollOptions(prev => prev.filter((_, i) => i !== index));
  };

  const updatePollOption = (index: number, value: string) => {
    setPollOptions(prev => prev.map((opt, i) => i === index ? value : opt));
  };

  // Emoji handling
  const addEmoji = (emoji: string) => {
    setPostContent(prev => prev + emoji);
  };

  return (
    <NetworkLayout>
      {/* Header with Refresh */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Feed
        </Typography>
        <Button
          startIcon={<Refresh />}
          onClick={fetchFeed}
          disabled={loading}
          size="small"
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {/* Create Post Card */}
      <StyledCard sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
            <TextField
              fullWidth
              placeholder="Share your thoughts, articles, or achievements..."
              variant="outlined"
              onClick={() => setCreatePostOpen(true)}
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 10,
                  backgroundColor: alpha(theme.palette.grey[500], 0.08),
                } 
              }}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button startIcon={<ImageIcon />} color="inherit" onClick={() => setCreatePostOpen(true)}>Photo</Button>
            <Button startIcon={<Videocam />} color="inherit" onClick={() => setCreatePostOpen(true)}>Video</Button>
            <Button startIcon={<Article />} color="inherit" onClick={() => setCreatePostOpen(true)}>Article</Button>
            <Button startIcon={<Poll />} color="inherit" onClick={() => setCreatePostOpen(true)}>Poll</Button>
          </Box>
        </CardContent>
      </StyledCard>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Posts */}
      {!loading && posts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No posts yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect with others or join groups to see posts in your feed
          </Typography>
        </Box>
      )}

      {posts.map(post => (
        <PostCard key={post.id} id={`post-${post.id}`}>
          <CardContent>
            {/* Post Header */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                {post.author.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {post.author.name}
                  {post.author.is_verified && <Verified sx={{ fontSize: 16, color: 'primary.main' }} />}
                </Typography>
                <Typography variant="caption" color="text.secondary">{post.author.title}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {post.created_at}
                  {post.group && <span> • in <b>{post.group.name}</b></span>}
                </Typography>
              </Box>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); openPostMenu(post.id, e.currentTarget); }}>
                <MoreVert />
              </IconButton>
            </Box>

            {/* Post Content */}
            {post.post_type !== 'poll' && (
              <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                {post.content}
              </Typography>
            )}

            {/* Post Images */}
            {post.media && post.media.length > 0 && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: post.media.length === 1 ? '1fr' : '1fr 1fr',
                  gap: 1,
                  mb: 2,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                {post.media.map((m, idx) => (
                  isVideoMedia(m) ? (
                    <Box
                      key={idx}
                      component="video"
                      src={m.url}
                      controls
                      preload="metadata"
                      sx={{
                        width: '100%',
                        maxHeight: 420,
                        objectFit: 'cover',
                        bgcolor: 'black',
                      }}
                    />
                  ) : (
                    <Box
                      key={idx}
                      component="img"
                      src={m.url}
                      alt=""
                      sx={{
                        width: '100%',
                        maxHeight: 400,
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      loading="lazy"
                      onClick={() => window.open(m.url, '_blank')}
                    />
                  )
                ))}
              </Box>
            )}

            {/* Poll Display */}
            {post.post_type === 'poll' && post.poll_data && (
              <Box sx={{ mb: 2 }}>
                {post.poll_data.question && (
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {post.poll_data.question}
                  </Typography>
                )}
                {post.content && (
                  <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                    {post.content}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {post.poll_data.options && post.poll_data.options.map((option: string, index: number) => {
                    const voteCount = post.poll_data?.vote_counts?.[index] || 0;
                    const totalVotes = post.poll_data?.total_votes || 0;
                    const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                    const userVote = post.poll_data?.user_vote;
                    const pollEndDate = parsePollEndDate(post.poll_data?.end_date);
                    const isClosedByDate = pollEndDate ? pollEndDate.getTime() <= Date.now() : false;
                    const isPollClosed = Boolean(post.poll_data?.is_closed) || isClosedByDate;
                    const isUserVote = userVote === index;
                    const isDisabled = isPollClosed;
                    
                    return (
                      <Button
                        key={index}
                        variant={isUserVote ? "contained" : "outlined"}
                        fullWidth
                        disabled={isDisabled}
                        sx={{
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          py: 1.5,
                          position: 'relative',
                          borderColor: isUserVote ? 'primary.main' : 'divider',
                          bgcolor: isUserVote ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: isUserVote 
                              ? alpha(theme.palette.primary.main, 0.15) 
                              : alpha(theme.palette.primary.main, 0.05),
                          },
                          '&:disabled': {
                            borderColor: 'divider',
                            opacity: 0.7,
                          },
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isDisabled) {
                            handleVotePoll(post.id, index, option);
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', position: 'relative', zIndex: 1 }}>
                          <Poll sx={{ color: isUserVote ? 'primary.main' : 'text.secondary', fontSize: 20 }} />
                          <Typography variant="body2" sx={{ flex: 1, textAlign: 'left', fontWeight: isUserVote ? 600 : 400 }}>
                            {option}
                          </Typography>
                          {totalVotes > 0 && (
                            <Typography variant="caption" sx={{ color: isUserVote ? 'primary.main' : 'text.secondary', fontWeight: 600 }}>
                              {voteCount} ({percentage}%)
                            </Typography>
                          )}
                        </Box>
                        {/* Progress bar */}
                        {totalVotes > 0 && (
                          <Box
                            sx={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: `${percentage}%`,
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                              borderRadius: 1,
                              zIndex: 0,
                            }}
                          />
                        )}
                      </Button>
                    );
                  })}
                </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {(() => {
                    const pollEndDate = parsePollEndDate(post.poll_data?.end_date);
                    const isClosedByDate = pollEndDate ? pollEndDate.getTime() <= Date.now() : false;
                    const isPollClosed = Boolean(post.poll_data?.is_closed) || isClosedByDate;
                    const votesText = post.poll_data?.total_votes
                      ? `${post.poll_data.total_votes} ${post.poll_data.total_votes === 1 ? 'vote' : 'votes'}`
                      : 'No votes yet';
                    if (isPollClosed) return `${votesText} • Poll closed`;
                    return `${votesText} • You can change your vote until poll closes`;
                  })()}
                </Typography>
              </Box>
            )}

            {/* Link Preview */}
            {post.post_type === 'link' && post.link_url && (
              <Box sx={{ mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {post.content || 'Shared a link'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    component="a"
                    href={post.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      color: 'primary.main', 
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {post.link_url}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Post Stats */}
            {/* Reaction Summary */}
            {post.reactions && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ display: 'flex' }}>
                  {post.reactions.like > 0 && <Box sx={{ mr: -0.5, zIndex: 5 }}>👍</Box>}
                  {post.reactions.love > 0 && <Box sx={{ mr: -0.5, zIndex: 4 }}>❤️</Box>}
                  {post.reactions.celebrate > 0 && <Box sx={{ mr: -0.5, zIndex: 3 }}>🎉</Box>}
                  {post.reactions.insightful > 0 && <Box sx={{ mr: -0.5, zIndex: 2 }}>💡</Box>}
                  {post.reactions.funny > 0 && <Box sx={{ zIndex: 1 }}>😄</Box>}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {post.likes_count} reactions
                </Typography>
              </Box>
            )}

            {/* Hashtags */}
            {post.hashtags && post.hashtags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {post.hashtags.map((tag, idx) => (
                  <Typography 
                    key={idx} 
                    variant="caption" 
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 600, 
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {tag}
                  </Typography>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary">
                {post.likes_count} likes • {post.comments_count} comments • {post.shares_count} shares
              </Typography>
            </Box>

            {/* Post Actions with Reaction Picker */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 1, position: 'relative' }}>
              <Button 
                color={post.is_liked || selectedReactions[post.id] ? 'primary' : 'inherit'} 
                startIcon={
                  selectedReactions[post.id] 
                    ? <span style={{ fontSize: 20 }}>{reactionTypes.find(r => r.type === selectedReactions[post.id])?.icon || '👍'}</span>
                    : post.is_liked ? <Favorite /> : <FavoriteBorder />
                }
                onClick={(e) => openReactionPicker(post.id, e.currentTarget)}
              >
                {selectedReactions[post.id] 
                  ? reactionTypes.find(r => r.type === selectedReactions[post.id])?.label 
                  : 'Like'}
              </Button>
              <Button 
                color="inherit" 
                startIcon={<Comment />}
                onClick={() => handleToggleComments(post.id)}
              >
                Comment
              </Button>
              <Button
                color="inherit"
                startIcon={<Share />}
                onClick={(e) => { setShareAnchor(e.currentTarget); setSharePostId(post.id); }}
              >
                Share
              </Button>
              <Button
                color="inherit"
                startIcon={<Repeat />}
                onClick={() => handleRepost(post.id)}
              >
                Repost
              </Button>
              <IconButton onClick={() => handleSavePost(post.id)}>
                {post.is_saved ? <Bookmark color="primary" /> : <BookmarkBorder />}
              </IconButton>
            </Box>

            {/* Comments Section */}
            {expandedComments[post.id] && (
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                {/* Comment Input */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>A</Avatar>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Write a comment..."
                    value={commentTexts[post.id] || ''}
                    onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(post.id);
                      }
                    }}
                    multiline
                    maxRows={3}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleAddComment(post.id)}
                    disabled={!!validateComment(commentTexts[post.id] || '')}
                  >
                    Post
                  </Button>
                </Box>

                {/* Comments List */}
                {loadingComments[post.id] ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : postComments[post.id] && postComments[post.id].length > 0 ? (
                  <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {postComments[post.id].map((comment: any) => {
                      // Handle different comment response formats
                      const authorName = comment.author?.name || 
                                        (comment.author_id ? 'User' : 'Unknown');
                      const commentContent = comment.content || '';
                      const commentDate = comment.created_at || comment.createdAt;
                      
                      return (
                        <Box key={comment.id} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            {authorName.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {authorName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {commentDate 
                                  ? formatDistanceToNow(parseApiDate(commentDate), { addSuffix: true })
                                  : 'just now'}
                              </Typography>
                            </Box>
                            <Typography variant="body2">{commentContent}</Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No comments yet. Be the first to comment!
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </PostCard>
      ))}

      {/* Trending Hashtags Section */}
      <StyledCard sx={{ mt: 2, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <LocalFireDepartment sx={{ color: '#FF6B6B' }} />
          <Typography variant="subtitle2" fontWeight={700}>Trending Hashtags</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {trendingHashtags.map((tag, idx) => (
            <Box
              key={idx}
              sx={{
                px: 2,
                py: 0.5,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                borderRadius: 2,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              {tag}
            </Box>
          ))}
          {trendingHashtags.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No trending hashtags yet.
            </Typography>
          )}
        </Box>
      </StyledCard>

      {/* Create Post Dialog */}
      <Dialog 
        open={createPostOpen} 
        onClose={() => {
          setCreatePostOpen(false);
          resetCreatePostForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Create a Post</DialogTitle>
        <DialogContent>
          {/* Hidden file inputs */}
          <input
            type="file"
            ref={imageInputRef}
            hidden
            accept="image/*"
            multiple
            onChange={handleImageSelect}
          />
          <input
            type="file"
            ref={videoInputRef}
            hidden
            accept="video/*"
            onChange={handleVideoSelect}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Admin A</Typography>
              <Button size="small" startIcon={<Public />}>Anyone</Button>
            </Box>
          </Box>
          
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            placeholder="What do you want to talk about?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
            }}
          />
          
          {/* Attached Images Preview */}
          {attachedImages.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {attachedImages.map((file, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={URL.createObjectURL(file)}
                    sx={{ width: 80, height: 80, borderRadius: 1, objectFit: 'cover' }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeImage(index)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      bgcolor: 'error.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'error.dark' },
                      width: 20,
                      height: 20,
                    }}
                  >
                    <Close sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}
              {attachedImages.length < 4 && (
                <Box
                  onClick={() => imageInputRef.current?.click()}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 1,
                    border: '2px dashed',
                    borderColor: 'grey.400',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main' }
                  }}
                >
                  <Add sx={{ color: 'grey.500' }} />
                </Box>
              )}
            </Box>
          )}
          
          {/* Attached Video Preview */}
          {attachedVideo && (
            <Box sx={{ mt: 2, position: 'relative' }}>
              <Box
                component="video"
                src={URL.createObjectURL(attachedVideo)}
                sx={{ width: '100%', maxHeight: 200, borderRadius: 1, bgcolor: 'black' }}
                controls
              />
              <IconButton
                size="small"
                onClick={() => setAttachedVideo(null)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'error.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'error.dark' },
                }}
              >
                <Close />
              </IconButton>
            </Box>
          )}
          
          {/* Article Link Input */}
          {showArticleInput && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <Button size="small" startIcon={<ContentPaste />} onClick={handlePasteArticleLink}>
                  Paste
                </Button>
              </Box>
              <TextField
                fullWidth
                size="small"
                placeholder="Paste article URL..."
                value={articleLink}
                onChange={(e) => setArticleLink(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton size="small" onClick={() => { setShowArticleInput(false); setArticleLink(''); }}>
                      <Close />
                    </IconButton>
                  )
                }}
              />
            </Box>
          )}
          
          {/* Poll Creator */}
          {showPollCreator && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                📊 Create a Poll
              </Typography>
              {pollOptions.map((option, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                  />
                  {pollOptions.length > 2 && (
                    <IconButton size="small" onClick={() => removePollOption(index)}>
                      <Close />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {pollOptions.length < 4 && (
                  <Button size="small" startIcon={<Add />} onClick={addPollOption}>
                    Add Option
                  </Button>
                )}
                <Button size="small" color="error" onClick={() => { setShowPollCreator(false); setPollOptions(['', '']); }}>
                  Remove Poll
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Quick Emojis
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {commonEmojis.map((emoji, index) => (
                  <Button
                    key={index}
                    variant="text"
                    onClick={() => addEmoji(emoji)}
                    sx={{ minWidth: 40, fontSize: '1.5rem', p: 0.5 }}
                  >
                    {emoji}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
          
          {/* Attachment Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Tooltip title="Add Images (max 4)">
              <IconButton 
                onClick={() => imageInputRef.current?.click()}
                disabled={!!attachedVideo}
                color={attachedImages.length > 0 ? 'primary' : 'default'}
              >
                <Badge badgeContent={attachedImages.length} color="primary" invisible={attachedImages.length === 0}>
                  <ImageIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Video">
              <IconButton 
                onClick={() => videoInputRef.current?.click()}
                disabled={attachedImages.length > 0}
                color={attachedVideo ? 'primary' : 'default'}
              >
                <Videocam />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Article Link">
              <IconButton 
                onClick={() => setShowArticleInput(!showArticleInput)}
                color={showArticleInput ? 'primary' : 'default'}
              >
                <Article />
              </IconButton>
            </Tooltip>
            <Tooltip title="Create Poll">
              <IconButton 
                onClick={() => setShowPollCreator(!showPollCreator)}
                color={showPollCreator ? 'primary' : 'default'}
              >
                <Poll />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Emoji">
              <IconButton 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                color={showEmojiPicker ? 'primary' : 'default'}
              >
                <EmojiEmotions />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCreatePostOpen(false);
              resetCreatePostForm();
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreatePost}
            disabled={!canCreatePost}
            sx={{ borderRadius: 2 }}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share menu – copy link to post (works in private/incognito) */}
      <Menu
        anchorEl={reactionPickerAnchor}
        open={Boolean(reactionPickerAnchor) && Boolean(reactionPickerPostId)}
        onClose={closeReactionPicker}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {reactionTypes.map((reaction) => (
          <MenuItem
            key={reaction.type}
            onClick={() => reactionPickerPostId && handleReaction(reactionPickerPostId, reaction.type)}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              <span style={{ fontSize: 20 }}>{reaction.icon}</span>
            </ListItemIcon>
            <ListItemText primary={reaction.label} />
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={shareAnchor}
        open={Boolean(shareAnchor)}
        onClose={() => { setShareAnchor(null); setSharePostId(null); }}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem
          onClick={() => sharePostId && handleCopyPostLink(sharePostId)}
        >
          <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
          <ListItemText primary="Copy link to post"  />
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={postMenuAnchor}
        open={Boolean(postMenuAnchor) && Boolean(postMenuPostId)}
        onClose={closePostMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={handleFollowFromPost}
          disabled={!postMenuPostId || (() => {
            const p = posts.find((x) => x.id === postMenuPostId);
            const id = String(p?.author?.id || '');
            return !id || id === currentUserId || followingIds.has(id);
          })()}
        >
          <ListItemText
            primary="Follow"
            secondary={(() => {
              const p = posts.find((x) => x.id === postMenuPostId);
              const id = String(p?.author?.id || '');
              if (!id || id === currentUserId) return 'This is your post';
              if (followingIds.has(id)) return 'Already following';
              return 'Follow this user';
            })()}
          />
        </MenuItem>
        <MenuItem
          onClick={handleConnectFromPost}
          disabled={!postMenuPostId || (() => {
            const p = posts.find((x) => x.id === postMenuPostId);
            const id = String(p?.author?.id || '');
            return !id || id === currentUserId || connectedIds.has(id);
          })()}
        >
          <ListItemText
            primary="Connect"
            secondary={(() => {
              const p = posts.find((x) => x.id === postMenuPostId);
              const id = String(p?.author?.id || '');
              if (!id || id === currentUserId) return 'This is your post';
              if (connectedIds.has(id)) return 'Already connected';
              return 'Send connection request';
            })()}
          />
        </MenuItem>
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </NetworkLayout>
  );
};

export default NetworkFeed;

