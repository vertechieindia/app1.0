/**
 * SMSPosts - School Posts Management
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
  Chip,
  Divider,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ImageIcon from '@mui/icons-material/Image';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SchoolIcon from '@mui/icons-material/School';
import SMSLayout from './SMSLayout';

const colors = {
  primary: '#0d47a1',
  primaryDark: '#1a237e',
};

const mockPosts = [
  {
    id: 1,
    content: 'We are thrilled to announce our new AI Research Center! This state-of-the-art facility will provide students with hands-on experience in artificial intelligence and machine learning.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    likes: 234,
    comments: 45,
    shares: 12,
    date: '2 hours ago',
  },
  {
    id: 2,
    content: 'Congratulations to our Computer Science graduates! 95% placement rate this year with top tech companies including Google, Microsoft, and Amazon.',
    likes: 567,
    comments: 89,
    shares: 34,
    date: '1 day ago',
  },
  {
    id: 3,
    content: 'Registration for Fall 2024 semester is now open! Early bird discounts available until March 31st.',
    likes: 123,
    comments: 23,
    shares: 8,
    date: '3 days ago',
  },
];

const SMSPosts: React.FC = () => {
  const [postContent, setPostContent] = useState('');

  return (
    <SMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>School Updates</Typography>
          <Button variant="contained" startIcon={<PostAddIcon />} sx={{ bgcolor: colors.primary }}>
            Create Post
          </Button>
        </Box>

        {/* Post Creator */}
        <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
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
                    <SchoolIcon />
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600}>Tech University</Typography>
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
    </SMSLayout>
  );
};

export default SMSPosts;

