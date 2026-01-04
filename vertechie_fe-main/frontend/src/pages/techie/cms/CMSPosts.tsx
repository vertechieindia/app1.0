/**
 * CMSPosts - Company Posts Management
 */

import React, { useState } from 'react';
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
} from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ImageIcon from '@mui/icons-material/Image';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BusinessIcon from '@mui/icons-material/Business';
import CMSLayout from './CMSLayout';

const colors = {
  primary: '#0d47a1',
};

const mockPosts = [
  {
    id: 1,
    content: 'We are excited to announce our expansion into the European market! This marks a significant milestone in our global growth strategy. 🌍',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    likes: 456,
    comments: 78,
    shares: 23,
    date: '3 hours ago',
  },
  {
    id: 2,
    content: 'Join us at TechCon 2024! Our team will be presenting our latest innovations in AI and cloud computing. See you there! 🚀',
    likes: 789,
    comments: 134,
    shares: 56,
    date: '1 day ago',
  },
  {
    id: 3,
    content: "We're hiring! Looking for talented engineers to join our growing team. Check out our open positions on the Jobs tab.",
    likes: 234,
    comments: 45,
    shares: 12,
    date: '2 days ago',
  },
];

const CMSPosts: React.FC = () => {
  const [postContent, setPostContent] = useState('');

  return (
    <CMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>Company Updates</Typography>
          <Button variant="contained" startIcon={<PostAddIcon />} sx={{ bgcolor: colors.primary }}>
            Create Post
          </Button>
        </Box>

        {/* Post Creator */}
        <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
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
                  <Button variant="contained" sx={{ bgcolor: colors.primary }}>
                    Post
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Posts List */}
        {mockPosts.map((post) => (
          <Card key={post.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar sx={{ bgcolor: colors.primary }}>
                    <BusinessIcon />
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600}>TechCorp Solutions</Typography>
                    <Typography variant="caption" color="text.secondary">{post.date}</Typography>
                  </Box>
                </Box>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              
              <Typography sx={{ mb: 2 }}>{post.content}</Typography>
              
              {post.image && (
                <Box
                  component="img"
                  src={post.image}
                  alt="Post"
                  sx={{ width: '100%', borderRadius: 2, mb: 2, maxHeight: 400, objectFit: 'cover' }}
                />
              )}
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button startIcon={<ThumbUpIcon />} sx={{ color: 'text.secondary' }}>
                  {post.likes} Likes
                </Button>
                <Button startIcon={<CommentIcon />} sx={{ color: 'text.secondary' }}>
                  {post.comments} Comments
                </Button>
                <Button startIcon={<ShareIcon />} sx={{ color: 'text.secondary' }}>
                  {post.shares} Shares
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </CMSLayout>
  );
};

export default CMSPosts;

