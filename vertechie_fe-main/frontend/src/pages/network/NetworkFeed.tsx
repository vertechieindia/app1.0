/**
 * NetworkFeed - Feed page for posts and updates
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Button, IconButton,
  TextField, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  Badge, Tooltip, Snackbar, Alert, useTheme, alpha, CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  MoreVert, Favorite, FavoriteBorder, Comment, Share, Bookmark,
  BookmarkBorder, Public, Add, Verified, Image as ImageIcon,
  EmojiEmotions, Poll, Videocam, Article, Close,
  ThumbUp, ThumbUpOutlined, Celebration, Lightbulb, 
  SentimentVerySatisfied, Whatshot, LocalFireDepartment,
  Refresh,
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
}

// Reaction types for the hover picker
const reactionTypes = [
  { type: 'like', icon: '👍', label: 'Like', color: '#0d47a1' },
  { type: 'love', icon: '❤️', label: 'Love', color: '#e91e63' },
  { type: 'celebrate', icon: '🎉', label: 'Celebrate', color: '#ff9800' },
  { type: 'insightful', icon: '💡', label: 'Insightful', color: '#ffc107' },
  { type: 'funny', icon: '😄', label: 'Funny', color: '#4caf50' },
];

// Trending hashtags
const trendingHashtags = [
  '#TechCareers', '#ReactJS', '#AITools', '#RemoteWork', '#StartupLife',
  '#CloudComputing', '#MachineLearning', '#WebDev', '#ProductManagement',
];

// ============================================
// MOCK DATA
// ============================================
const mockPosts: Post[] = [
  { 
    id: '1', 
    author: { id: '1', name: 'Sarah Chen', title: 'Senior Software Engineer at Google', is_verified: true }, 
    content: '🚀 Excited to share that I just completed the Google Cloud Architecture certification! The journey of learning never stops. If you\'re considering cloud certifications, I highly recommend starting with the fundamentals. Happy to answer any questions!',
    likes_count: 142,
    comments_count: 23,
    shares_count: 8,
    is_liked: false,
    is_saved: false,
    created_at: '2 hours ago',
    reactions: { like: 89, love: 32, celebrate: 15, insightful: 4, funny: 2 },
    hashtags: ['#CloudComputing', '#GoogleCloud', '#Learning'],
  },
  { 
    id: '2', 
    author: { id: '2', name: 'Michael Brown', title: 'Product Manager at Microsoft', is_verified: true }, 
    content: 'Just published a new article on "The Future of AI in Product Development". Key takeaways:\n\n1. AI is augmenting, not replacing product managers\n2. Data-driven decisions are becoming the norm\n3. User empathy remains irreplaceable\n\nCheck out the full article in the comments!',
    likes_count: 89,
    comments_count: 15,
    shares_count: 12,
    is_liked: true,
    is_saved: true,
    created_at: '5 hours ago',
    group: { id: '1', name: 'Product Managers Community' },
    reactions: { like: 45, love: 12, celebrate: 8, insightful: 22, funny: 2 },
    hashtags: ['#AITools', '#ProductManagement', '#FutureTech'],
  },
  { 
    id: '3', 
    author: { id: '3', name: 'Emily Zhang', title: 'Data Scientist at Meta', is_verified: false }, 
    content: 'Pro tip for fellow data scientists: When working with large datasets, always profile your data first! 📊\n\nI saved 3 hours of debugging today just by running a quick data quality check before training my model. Sometimes the basics are the most powerful tools.',
    likes_count: 256,
    comments_count: 42,
    shares_count: 35,
    is_liked: false,
    is_saved: false,
    created_at: '1 day ago',
    reactions: { like: 156, love: 45, celebrate: 23, insightful: 28, funny: 4 },
    hashtags: ['#DataScience', '#MachineLearning', '#ProTip'],
  },
];

const commonEmojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '💡', '✨', '🚀', '💪', '👏', '🙌', '💯', '⭐', '🎯', '📈'];

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
  const [selectedReactions, setSelectedReactions] = useState<Record<string, string>>({});
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Fetch feed from API
  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
        is_saved: item.is_saved || false,
        created_at: item.created_at 
          ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true })
          : 'Just now',
        group: item.group_id && item.group_name 
          ? { id: item.group_id, name: item.group_name }
          : undefined,
        reactions: undefined, // Backend doesn't provide detailed reactions yet
        hashtags: undefined, // Extract from content if needed
      }));
      
      setPosts(mappedPosts.length > 0 ? mappedPosts : mockPosts);
    } catch (err: any) {
      console.error('Error fetching feed:', err);
      setError('Failed to load feed. Showing sample posts.');
      // Fallback to mock data if API fails
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  // Handle reaction selection
  const handleReaction = (postId: string, reactionType: string) => {
    setSelectedReactions(prev => ({
      ...prev,
      [postId]: prev[postId] === reactionType ? '' : reactionType,
    }));
    setReactionPickerPostId(null);
    setPosts(prev => prev.map(p => 
      p.id === postId
        ? { ...p, is_liked: true, likes_count: p.likes_count + (selectedReactions[postId] ? 0 : 1) }
        : p
    ));
  };

  // Like post
  const handleLikePost = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    // Optimistic update
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, is_liked: !p.is_liked, likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1 }
        : p
    ));
    
    try {
      // Call API to like/unlike
      await communityService.likePost(postId);
    } catch (err) {
      console.error('Error liking post:', err);
      // Revert on error
      setPosts(prev => prev.map(p => 
        p.id === postId ? post : p
      ));
      setSnackbar({ open: true, message: 'Failed to like post', severity: 'error' });
    }
  };

  // Save post
  const handleSavePost = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, is_saved: !p.is_saved } : p
    ));
    setSnackbar({ open: true, message: 'Post saved!', severity: 'success' });
  };

  // Create post
  const handleCreatePost = async () => {
    if (!postContent.trim()) return;
    
    try {
      // Call API to create post
      const result = await communityService.createPost({
        content: postContent,
        visibility: 'public',
        ...(articleLink && { link_url: articleLink }),
      });
      
      // Refresh feed to get the new post
      await fetchFeed();
      
      setPostContent('');
      setAttachedImages([]);
      setAttachedVideo(null);
      setArticleLink('');
      setPollOptions(['', '']);
      setShowPollCreator(false);
      setShowArticleInput(false);
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
        <PostCard key={post.id}>
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
              <IconButton size="small"><MoreVert /></IconButton>
            </Box>

            {/* Post Content */}
            <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
              {post.content}
            </Typography>

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
              {/* Reaction Picker */}
              {reactionPickerPostId === post.id && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: '100%', 
                    left: 0,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    p: 1,
                    display: 'flex',
                    gap: 0.5,
                    zIndex: 100,
                    mb: 1,
                  }}
                >
                  {reactionTypes.map((reaction) => (
                    <Tooltip key={reaction.type} title={reaction.label}>
                      <IconButton
                        onClick={() => handleReaction(post.id, reaction.type)}
                        sx={{
                          fontSize: 28,
                          transition: 'transform 0.2s',
                          '&:hover': { 
                            transform: 'scale(1.3)',
                            bgcolor: alpha(reaction.color, 0.1),
                          },
                          ...(selectedReactions[post.id] === reaction.type && {
                            bgcolor: alpha(reaction.color, 0.2),
                          }),
                        }}
                      >
                        {reaction.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>
              )}
              
              <Button 
                color={post.is_liked || selectedReactions[post.id] ? 'primary' : 'inherit'} 
                startIcon={
                  selectedReactions[post.id] 
                    ? <span style={{ fontSize: 20 }}>{reactionTypes.find(r => r.type === selectedReactions[post.id])?.icon || '👍'}</span>
                    : post.is_liked ? <Favorite /> : <FavoriteBorder />
                }
                onClick={() => handleLikePost(post.id)}
                onMouseEnter={() => setReactionPickerPostId(post.id)}
                onMouseLeave={() => setTimeout(() => setReactionPickerPostId(null), 300)}
              >
                {selectedReactions[post.id] 
                  ? reactionTypes.find(r => r.type === selectedReactions[post.id])?.label 
                  : 'Like'}
              </Button>
              <Button color="inherit" startIcon={<Comment />}>Comment</Button>
              <Button color="inherit" startIcon={<Share />}>Share</Button>
              <IconButton onClick={() => handleSavePost(post.id)}>
                {post.is_saved ? <Bookmark color="primary" /> : <BookmarkBorder />}
              </IconButton>
            </Box>
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
        </Box>
      </StyledCard>

      {/* Create Post Dialog */}
      <Dialog 
        open={createPostOpen} 
        onClose={() => setCreatePostOpen(false)}
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
          <Button onClick={() => setCreatePostOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreatePost}
            disabled={!postContent.trim()}
            sx={{ borderRadius: 2 }}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>

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

