/**
 * SMSPosts - School Posts Management (create, edit, likes, comments, share)
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ImageIcon from '@mui/icons-material/Image';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import CloseIcon from '@mui/icons-material/Close';
import SMSLayout from './SMSLayout';
import { api } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api';

const colors = {
  primary: '#0d47a1',
};

const SMSPosts: React.FC = () => {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [commentsState, setCommentsState] = useState<{ [key: string]: any[] }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [newCommentText, setNewCommentText] = useState<{ [key: string]: string }>({});
  const [loadingComments, setLoadingComments] = useState<{ [key: string]: boolean }>({});

  const [editDialog, setEditDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editContent, setEditContent] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const postInputRef = useRef<HTMLDivElement>(null);

  const scrollToPostInput = () => {
    postInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const textField = postInputRef.current?.querySelector('textarea');
      textField?.focus();
    }, 500);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let mySchool = null;
        try {
          mySchool = await api.get<any>(API_ENDPOINTS.SMS.MY_SCHOOL);
        } catch (e) {
          console.warn('SMS school lookup failed:', e);
        }
        if (mySchool?.id) {
          setSchoolId(mySchool.id);
          setSchoolName(mySchool.name || '');
          const postsData = await api.get<any[]>(API_ENDPOINTS.SMS.POSTS(mySchool.id));
          setPosts(Array.isArray(postsData) ? postsData : []);
        } else {
          setPosts([]);
        }
      } catch (err: any) {
        console.error('Error loading school posts:', err);
        setError(err?.response?.data?.detail || 'Failed to load posts.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePost = async () => {
    if (!schoolId) {
      setError('No school found. Please ensure you are an admin of a school.');
      return;
    }
    if (!postContent.trim() && !selectedImage) {
      setError('Please add some content or an image to your post.');
      return;
    }
    setPosting(true);
    setError(null);
    try {
      let mediaUrls: string[] = [];
      if (selectedImage) {
        try {
          const uploadRes = await api.upload<{ url: string }>(API_ENDPOINTS.CMS.UPLOAD, selectedImage);
          if (uploadRes?.url) mediaUrls.push(uploadRes.url);
          else throw new Error('Upload response missing URL');
        } catch (uploadErr: any) {
          const msg = uploadErr?.response?.data?.detail || uploadErr?.message || 'Failed to upload image';
          throw new Error(msg);
        }
      }
      const newPost = await api.post<any>(API_ENDPOINTS.SMS.CREATE_POST(schoolId), {
        content: postContent.trim() || '',
        media: mediaUrls.length > 0 ? mediaUrls : undefined,
      });
      setPosts((prev) => [newPost, ...prev]);
      setPostContent('');
      handleRemoveImage();
    } catch (err: any) {
      const detail = err?.response?.data?.detail || err?.message;
      setError(detail || 'Failed to create post.');
    } finally {
      setPosting(false);
    }
  };

  const handleEditClick = (post: any) => {
    setEditingPost(post);
    setEditContent(post.content || '');
    setEditDialog(true);
  };

  const handleEditSave = async () => {
    if (!editingPost?.id || !editContent.trim()) return;
    setSavingEdit(true);
    setError(null);
    try {
      const updated = await api.put<any>(API_ENDPOINTS.CMS.UPDATE_POST(editingPost.id), {
        content: editContent.trim(),
      });
      setPosts((prev) =>
        prev.map((p) => (p.id === editingPost.id ? { ...p, ...updated, content: updated.content } : p))
      );
      setEditDialog(false);
      setEditingPost(null);
      setEditContent('');
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to update post.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await api.post(API_ENDPOINTS.CMS.LIKE_POST(postId));
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p))
      );
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  const toggleComments = async (postId: string) => {
    const isExpanded = expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: !isExpanded }));
    if (!isExpanded && !commentsState[postId]) {
      setLoadingComments((prev) => ({ ...prev, [postId]: true }));
      try {
        const comments = await api.get<any[]>(API_ENDPOINTS.CMS.GET_COMMENTS(postId));
        setCommentsState((prev) => ({ ...prev, [postId]: comments }));
      } catch (err) {
        console.error('Failed to load comments', err);
      } finally {
        setLoadingComments((prev) => ({ ...prev, [postId]: false }));
      }
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = newCommentText[postId];
    if (!text?.trim()) return;
    try {
      const newComment = await api.post(API_ENDPOINTS.CMS.ADD_COMMENT(postId), { content: text });
      setCommentsState((prev) => ({
        ...prev,
        [postId]: [newComment, ...(prev[postId] || [])],
      }));
      setNewCommentText((prev) => ({ ...prev, [postId]: '' }));
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p))
      );
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const handleShare = (postId: string) => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url).then(() => {
      // Could use a snackbar instead
      alert('Link copied to clipboard!');
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (Number.isNaN(diffMs)) return 'Just now';
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <SMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            School Updates
          </Typography>
          <Button
            variant="contained"
            startIcon={<PostAddIcon />}
            sx={{ bgcolor: colors.primary }}
            onClick={scrollToPostInput}
          >
            Create Post
          </Button>
        </Box>

        <Card ref={postInputRef} sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar sx={{ bgcolor: colors.primary }}>
                <SchoolIcon />
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
                {previewUrl && (
                  <Box sx={{ mt: 2, position: 'relative', width: 'fit-content' }}>
                    <Box component="img" src={previewUrl} sx={{ maxHeight: 200, borderRadius: 2, display: 'block' }} />
                    <IconButton
                      size="small"
                      onClick={handleRemoveImage}
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ImageIcon />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Add Photo
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: colors.primary }}
                    onClick={handlePost}
                    disabled={posting || (!postContent.trim() && !selectedImage)}
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
                      <SchoolIcon />
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>{schoolName || 'School'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {post.created_at ? formatDate(post.created_at) : 'Recently'}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton size="small" onClick={() => handleEditClick(post)} title="Edit post">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>{post.content}</Typography>

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
                  <Button
                    startIcon={<ThumbUpIcon />}
                    sx={{ color: 'text.secondary' }}
                    onClick={() => handleLike(post.id)}
                  >
                    {post.likes_count || 0} Likes
                  </Button>
                  <Button
                    startIcon={<CommentIcon />}
                    sx={{ color: 'text.secondary' }}
                    onClick={() => toggleComments(post.id)}
                  >
                    {post.comments_count || 0} Comments
                  </Button>
                  <Button
                    startIcon={<ShareIcon />}
                    sx={{ color: 'text.secondary' }}
                    onClick={() => handleShare(post.id)}
                  >
                    Share
                  </Button>
                </Box>

                {expandedComments[post.id] && (
                  <Box sx={{ mt: 2, bgcolor: '#f9fafb', p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Avatar sx={{ width: 32, height: 32 }} />
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Write a comment..."
                        value={newCommentText[post.id] || ''}
                        onChange={(e) =>
                          setNewCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                      />
                    </Box>
                    {loadingComments[post.id] ? (
                      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
                        Loading comments...
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {commentsState[post.id]?.length > 0 ? (
                          commentsState[post.id].map((comment: any) => (
                            <Box key={comment.id} sx={{ display: 'flex', gap: 1.5 }}>
                              <Avatar sx={{ width: 32, height: 32 }} />
                              <Box
                                sx={{
                                  bgcolor: 'white',
                                  p: 1.5,
                                  borderRadius: 2,
                                  flex: 1,
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                }}
                              >
                                <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.85rem' }}>
                                  {comment.author?.name || 'User'}
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.9rem', mt: 0.5 }}>
                                  {comment.content}
                                </Typography>
                              </Box>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="caption" color="text.secondary" align="center">
                            No comments yet. Be the first!
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        )}

        <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleEditSave} disabled={savingEdit || !editContent.trim()} sx={{ bgcolor: colors.primary }}>
              {savingEdit ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </SMSLayout>
  );
};

export default SMSPosts;
