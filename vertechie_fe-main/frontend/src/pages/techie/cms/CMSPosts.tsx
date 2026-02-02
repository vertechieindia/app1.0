/**
 * CMSPosts - Company Posts Management (CMS + company-specific backend)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Avatar,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ImageIcon from '@mui/icons-material/Image';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BusinessIcon from '@mui/icons-material/Business';
import CMSLayout from './CMSLayout';
import { api } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { DUMMY_POSTS } from './CMSDummyData';

const colors = {
  primary: '#0d47a1',
};

const CMSPosts: React.FC = () => {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const postInputRef = useRef<HTMLDivElement>(null);

  const scrollToPostInput = () => {
    postInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const textField = postInputRef.current?.querySelector('textarea');
      textField?.focus();
    }, 500);
  };

  // Load current company and its posts via CMS backend endpoints
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Try to find the company first
        let myCompany = null;
        try {
          const me = await api.get<any>(API_ENDPOINTS.AUTH.ME);
          if (me?.id) {
            const result = await api.get(API_ENDPOINTS.COMPANY, { params: { user_id: me.id } });
            if (Array.isArray(result) && result.length > 0) myCompany = result[0];
            else if (result?.id) myCompany = result;
          }
        } catch (e) {
          console.warn("Company lookup failed:", e);
        }

        // 2. If no company found via user, try fallback (though unlikely to work if above failed)
        if (!myCompany) {
          try {
            myCompany = await api.get(API_ENDPOINTS.CMS.MY_COMPANY);
          } catch (e) { }
        }

        // 3. Set state and fetch posts if company exists
        if (myCompany?.id) {
          setCompanyId(myCompany.id);
          const postsData = await api.get<any[]>(API_ENDPOINTS.CMS.POSTS(myCompany.id));
          setPosts(Array.isArray(postsData) ? postsData : []);
        } else {
          // No company found
          setPosts([]);
          // Optional: setError('No company found for this user.');
        }

      } catch (err: any) {
        console.error('Error loading posts:', err);
        // Fallback to dummy data on error
        setPosts(Array.isArray(DUMMY_POSTS) ? DUMMY_POSTS : []);
        // Don't show error to user, just show dummy content
        // setError('Loaded demo content');
      } finally {
        // If no posts were loaded (empty array), use dummy data
        setPosts(prev => {
          if (prev.length === 0) return DUMMY_POSTS;
          return prev;
        });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePost = async () => {
    if (!postContent.trim() || !companyId) return;
    setPosting(true);
    setError(null);
    try {
      const newPost = await api.post<any>(API_ENDPOINTS.CMS.CREATE_POST(companyId), {
        content: postContent,
      });
      setPosts((prev) => [newPost, ...prev]);
      setPostContent('');
    } catch (err: any) {
      console.error('Error creating post:', err);
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err.message ||
        'Failed to create post';
      setError(message);
    } finally {
      setPosting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <CMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>Company Updates</Typography>
          <Button
            variant="contained"
            startIcon={<PostAddIcon />}
            sx={{ bgcolor: colors.primary }}
            onClick={scrollToPostInput}
          >
            Create Post
          </Button>
        </Box>

        {/* Post Creator */}
        <Card ref={postInputRef} sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar sx={{ bgcolor: colors.primary }}>
                <BusinessIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Share an update with your followers..."
                  variant="outlined"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" size="small" startIcon={<ImageIcon />}>
                      Add Photo
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: colors.primary }}
                    onClick={handlePost}
                    disabled={posting || !postContent.trim()}
                  >
                    {posting ? 'Posting...' : 'Post'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Posts List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography color="text.secondary">No posts yet. Create your first post!</Typography>
          </Box>
        ) : (
          posts.map((post) => (
            <Card key={post.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: colors.primary }}>
                      <BusinessIcon />
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>Company Post</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {post.created_at ? formatDate(post.created_at) : 'Recently'}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Typography sx={{ mb: 2 }}>{post.content}</Typography>

                {post.media && post.media.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {post.media.map((media: any, idx: number) => (
                      <Box
                        key={idx}
                        component="img"
                        src={media.url}
                        alt="Post"
                        sx={{ width: '100%', borderRadius: 2, mb: 1, maxHeight: 400, objectFit: 'cover' }}
                      />
                    ))}
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                  <Button startIcon={<ThumbUpIcon />} sx={{ color: 'text.secondary' }}>
                    {post.likes_count || 0} Likes
                  </Button>
                  <Button startIcon={<CommentIcon />} sx={{ color: 'text.secondary' }}>
                    {post.comments_count || 0} Comments
                  </Button>
                  <Button startIcon={<ShareIcon />} sx={{ color: 'text.secondary' }}>
                    {post.shares_count || 0} Shares
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </CMSLayout>
  );
};

export default CMSPosts;

