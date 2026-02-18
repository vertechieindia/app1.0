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

    // Image Upload State
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Comments State
    const [commentsState, setCommentsState] = useState<{ [key: string]: any[] }>({});
    const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
    const [newCommentText, setNewCommentText] = useState<{ [key: string]: string }>({});
    const [loadingComments, setLoadingComments] = useState<{ [key: string]: boolean }>({});

    const postInputRef = useRef<HTMLDivElement>(null);

    const scrollToPostInput = () => {
        postInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            const textField = postInputRef.current?.querySelector('textarea');
            textField?.focus();
        }, 500);
    };

    // Fetch Logic (Keep existing robust logic)
    useEffect(() => {
        const fetchData = async () => {
            try {
                let myCompany = null;
                try {
                    const me = await api.get<any>(API_ENDPOINTS.AUTH.ME);
                    if (me?.id) {
                        const result = await api.get<any>(API_ENDPOINTS.COMPANY, { params: { user_id: me.id } });
                        if (Array.isArray(result) && result.length > 0) myCompany = result[0];
                        else if (result?.id) myCompany = result;
                    }
                } catch (e) { console.warn("Company lookup failed:", e); }

                if (!myCompany) {
                    try { myCompany = await api.get<any>(API_ENDPOINTS.CMS.MY_COMPANY); } catch (e) { }
                }

                if (myCompany?.id) {
                    setCompanyId(myCompany.id);
                    const postsData = await api.get<any[]>(API_ENDPOINTS.CMS.POSTS(myCompany.id));
                    setPosts(Array.isArray(postsData) ? postsData : []);
                } else {
                    setPosts([]);
                }

            } catch (err: any) {
                console.error('Error loading posts:', err);
                setError(err?.response?.data?.detail || 'Failed to load posts.');
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- Handlers ---

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
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
        // Debug logging
        console.log('handlePost called with:', {
            contentLength: postContent.trim().length,
            hasImage: !!selectedImage,
            companyId: companyId
        });

        if (!companyId) {
            console.error("No company ID found. Cannot create post.");
            setError("No company found. Please ensure you are an admin of a company.");
            return;
        }

        if (!postContent.trim() && !selectedImage) {
            console.warn("Empty post content and no image.");
            setError("Please add some content or an image to your post.");
            return;
        }

        setPosting(true);
        setError(null);

        try {
            let mediaUrls: string[] = [];

            // Upload image first if selected
            if (selectedImage) {
                try {
                    const uploadRes = await api.upload<{ url: string }>(API_ENDPOINTS.CMS.UPLOAD, selectedImage);
                    if (uploadRes?.url) {
                        mediaUrls.push(uploadRes.url);
                    } else {
                        throw new Error("Upload response missing URL");
                    }
                } catch (uploadErr: any) {
                    console.error("Image upload failed", uploadErr);
                    const errorMsg = uploadErr?.response?.data?.detail || uploadErr?.message || "Failed to upload image";
                    throw new Error(errorMsg);
                }
            }

            // Backend expects: { content: string, media: string[] }
            // Ensure content is always a string (even if empty when media exists)
            const newPost = await api.post<any>(API_ENDPOINTS.CMS.CREATE_POST(companyId), {
                content: postContent.trim() || (mediaUrls.length > 0 ? "" : ""), // Always send string
                media: mediaUrls.length > 0 ? mediaUrls : undefined // Only include if we have media
            });

            setPosts((prev) => [newPost, ...prev]);
            setPostContent('');
            handleRemoveImage();

        } catch (err: any) {
            console.error('Error creating post:', err);
            const errorDetail = err?.response?.data?.detail || err?.response?.data?.message || err?.message;
            setError(errorDetail || 'Failed to create post. Please check your connection and try again.');
        } finally {
            setPosting(false);
        }
    };

    const handleLike = async (postId: string) => {
        try {
            await api.post(API_ENDPOINTS.CMS.LIKE_POST(postId));
            setPosts(currentPosts =>
                currentPosts.map(p => {
                    if (p.id === postId) {
                        // Optimistic update
                        // Note: Real backend would return updated count or we track 'isLiked' state
                        // For now, toggle: if we knew user liked it, we'd decrement. 
                        // Assuming simple increment for demo feel if we lack 'is_liked' field in response
                        return { ...p, likes_count: (p.likes_count || 0) + 1 };
                    }
                    return p;
                })
            );
        } catch (err) {
            console.error("Failed to like post", err);
        }
    };

    const toggleComments = async (postId: string) => {
        const isExpanded = expandedComments[postId];
        setExpandedComments(prev => ({ ...prev, [postId]: !isExpanded }));

        if (!isExpanded && !commentsState[postId]) {
            // Fetch comments if opening and not loaded yet
            setLoadingComments(prev => ({ ...prev, [postId]: true }));
            try {
                const comments = await api.get<any[]>(API_ENDPOINTS.CMS.GET_COMMENTS(postId));
                setCommentsState(prev => ({ ...prev, [postId]: comments }));
            } catch (err) {
                console.error("Failed to load comments", err);
            } finally {
                setLoadingComments(prev => ({ ...prev, [postId]: false }));
            }
        }
    };

    const handleAddComment = async (postId: string) => {
        const text = newCommentText[postId];
        if (!text?.trim()) return;

        try {
            const newComment = await api.post(API_ENDPOINTS.CMS.ADD_COMMENT(postId), { content: text });
            setCommentsState(prev => ({
                ...prev,
                [postId]: [newComment, ...(prev[postId] || [])]
            }));
            setNewCommentText(prev => ({ ...prev, [postId]: '' }));

            // Update comment count on post
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p));

        } catch (err) {
            console.error("Failed to add comment", err);
        }
    };

    const handleShare = (postId: string) => {
        // Mock share
        const url = `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(url);
        // In a real app, show a toast here. For now, we'll assume it worked.
        alert("Link copied to clipboard!");
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

                                {/* Image Preview */}
                                {previewUrl && (
                                    <Box sx={{ mt: 2, position: 'relative', width: 'fit-content' }}>
                                        <Box
                                            component="img"
                                            src={previewUrl}
                                            sx={{ maxHeight: 200, borderRadius: 2, display: 'block' }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={handleRemoveImage}
                                            sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                                        >
                                            X
                                        </IconButton>
                                    </Box>
                                )}

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
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
                                    </Box>
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
                                {/* Header */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: colors.primary }}>
                                            <BusinessIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography fontWeight={600}>{post.author?.name || 'VerTechie Company'}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {post.created_at ? formatDate(post.created_at) : 'Recently'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <IconButton size="small">
                                        <MoreVertIcon />
                                    </IconButton>
                                </Box>

                                {/* Content */}
                                <Typography sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>{post.content}</Typography>

                                {/* Media */}
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

                                {/* Actions */}
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

                                {/* Comments Section */}
                                {expandedComments[post.id] && (
                                    <Box sx={{ mt: 2, bgcolor: '#f9fafb', p: 2, borderRadius: 2 }}>
                                        {/* New Comment Input */}
                                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                            <Avatar sx={{ width: 32, height: 32 }} />
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Write a comment..."
                                                value={newCommentText[post.id] || ''}
                                                onChange={(e) => setNewCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                onKeyPress={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                                            />
                                        </Box>

                                        {/* List */}
                                        {loadingComments[post.id] ? (
                                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>Loading comments...</Typography>
                                        ) : (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                {commentsState[post.id]?.length > 0 ? (
                                                    commentsState[post.id].map((comment: any) => (
                                                        <Box key={comment.id} sx={{ display: 'flex', gap: 1.5 }}>
                                                            <Avatar src={comment.author?.avatar} alt={comment.author?.name} sx={{ width: 32, height: 32 }} />
                                                            <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: 2, flex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                                                        {comment.author?.name || 'User'}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {formatDate(comment.created_at)}
                                                                    </Typography>
                                                                </Box>
                                                                <Typography variant="body2" sx={{ fontSize: '0.9rem', mt: 0.5 }}>{comment.content}</Typography>
                                                            </Box>
                                                        </Box>
                                                    ))
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary" align="center">No comments yet. Be the first!</Typography>
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
        </CMSLayout>
    );
};

export default CMSPosts;

