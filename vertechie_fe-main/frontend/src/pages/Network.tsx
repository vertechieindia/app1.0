/**
 * Network Page - Unified Network & Community Experience
 * 
 * Features:
 * - My Network: Connections, Followers, Following
 * - Groups/Communities: Join, Create, Participate
 * - Feed: Posts from connections and groups
 * - People Suggestions: Who to connect with
 * - Events: Virtual networking events
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Grid, Typography, Card, CardContent, Avatar, Button, IconButton,
  Tabs, Tab, TextField, InputAdornment, Chip, Badge, Divider, Paper, List, ListItem,
  ListItemAvatar, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle,
  DialogContent, DialogActions, Menu, MenuItem, Skeleton, Alert, Snackbar,
  LinearProgress, Tooltip, useTheme, alpha, CircularProgress, Fab,
  FormControl, InputLabel, Select,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search, People, PersonAdd, Groups, Forum, Event, TrendingUp, MoreVert,
  Check, Close, Send, Favorite, FavoriteBorder, Comment, Share, Bookmark,
  BookmarkBorder, ExpandMore, ExpandLess, Public, Lock, Add, Notifications,
  Verified, WorkOutline, LocationOn, School, Code, Image as ImageIcon,
  EmojiEmotions, GifBox, Poll, Videocam, Article, Celebration, Handshake,
  GroupAdd, FilterList, Sort, ViewModule, ViewList, Refresh, OpenInNew,
  Lightbulb, RocketLaunch,
} from '@mui/icons-material';

// ============================================
// ANIMATIONS
// ============================================
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100%',
  backgroundColor: '#f5f7fa',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    transform: 'translateY(-2px)',
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  textAlign: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const ConnectionCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: 'all 0.3s ease',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const GroupCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
  },
}));

const PostCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  marginBottom: theme.spacing(2),
  overflow: 'visible',
}));

const TabPanel = styled(Box)({});

const SuggestionChip = styled(Chip)(({ theme }) => ({
  borderRadius: 20,
  fontWeight: 500,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
  },
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
  location?: string;
  mutual_connections?: number;
  is_verified?: boolean;
  skills?: string[];
}

interface Connection extends User {
  connected_at: string;
  status: 'connected' | 'pending' | 'following';
}

interface Group {
  id: string;
  name: string;
  description: string;
  cover_image?: string;
  icon?: string;
  member_count: number;
  post_count: number;
  category: string;
  is_joined: boolean;
  is_private: boolean;
  is_featured?: boolean;
}

interface Post {
  id: string;
  author: User;
  content: string;
  media?: { type: 'image' | 'video' | 'article'; url: string }[];
  images?: string[];
  video?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked: boolean;
  is_saved: boolean;
  created_at: string;
  group?: { id: string; name: string };
}

interface NetworkEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  attendees_count: number;
  host: User;
  cover_image?: string;
  type: 'webinar' | 'workshop' | 'meetup' | 'conference';
  is_registered: boolean;
}

// ============================================
// MOCK DATA
// ============================================
const mockStats = {
  connections: 127,
  followers: 342,
  following: 89,
  pending_requests: 5,
  group_memberships: 12,
  profile_views: 1250,
};

const mockConnections: Connection[] = [
  { id: '1', name: 'Sarah Chen', title: 'Senior Software Engineer', company: 'Google', avatar: '', mutual_connections: 15, is_verified: true, connected_at: '2024-01-15', status: 'connected', skills: ['React', 'TypeScript', 'Node.js'] },
  { id: '2', name: 'Michael Brown', title: 'Product Manager', company: 'Microsoft', avatar: '', mutual_connections: 8, is_verified: true, connected_at: '2024-02-20', status: 'connected', skills: ['Agile', 'Product Strategy'] },
  { id: '3', name: 'Emily Zhang', title: 'Data Scientist', company: 'Meta', avatar: '', mutual_connections: 12, is_verified: false, connected_at: '2024-03-10', status: 'connected', skills: ['Python', 'ML', 'TensorFlow'] },
  { id: '4', name: 'David Wilson', title: 'DevOps Engineer', company: 'AWS', avatar: '', mutual_connections: 6, is_verified: true, connected_at: '2024-03-25', status: 'connected', skills: ['Kubernetes', 'Docker', 'CI/CD'] },
];

const mockPendingRequests: User[] = [
  { id: '5', name: 'Alex Johnson', title: 'Frontend Developer', company: 'Stripe', avatar: '', mutual_connections: 4 },
  { id: '6', name: 'Lisa Park', title: 'UX Designer', company: 'Figma', avatar: '', mutual_connections: 7 },
  { id: '7', name: 'James Lee', title: 'Backend Developer', company: 'Uber', avatar: '', mutual_connections: 3 },
];

const mockSuggestions: User[] = [
  { id: '8', name: 'Anna Williams', title: 'Engineering Manager', company: 'Apple', avatar: '', mutual_connections: 22, is_verified: true, skills: ['Leadership', 'iOS'] },
  { id: '9', name: 'Robert Martinez', title: 'Cloud Architect', company: 'Azure', avatar: '', mutual_connections: 11, skills: ['Azure', 'AWS'] },
  { id: '10', name: 'Jennifer Liu', title: 'AI Researcher', company: 'OpenAI', avatar: '', mutual_connections: 9, is_verified: true, skills: ['AI', 'ML', 'Python'] },
  { id: '11', name: 'Chris Taylor', title: 'Startup Founder', company: 'TechStartup', avatar: '', mutual_connections: 18, skills: ['Entrepreneurship'] },
];

const mockGroups: Group[] = [
  { id: '1', name: 'React Developers Community', description: 'A community for React developers to share knowledge and best practices.', member_count: 15420, post_count: 892, category: 'Technology', is_joined: true, is_private: false, is_featured: true },
  { id: '2', name: 'AI & Machine Learning', description: 'Discuss the latest in AI, ML, and data science.', member_count: 28350, post_count: 1456, category: 'Technology', is_joined: true, is_private: false, is_featured: true },
  { id: '3', name: 'Startup Founders Network', description: 'Connect with other startup founders and entrepreneurs.', member_count: 8920, post_count: 567, category: 'Business', is_joined: false, is_private: true },
  { id: '4', name: 'Cloud Computing Pros', description: 'AWS, Azure, GCP - discuss cloud technologies.', member_count: 12680, post_count: 789, category: 'Technology', is_joined: false, is_private: false },
  { id: '5', name: 'Women in Tech', description: 'Supporting and empowering women in technology.', member_count: 21500, post_count: 1234, category: 'Community', is_joined: true, is_private: false, is_featured: true },
  { id: '6', name: 'DevOps & SRE', description: 'Site reliability engineering and DevOps practices.', member_count: 9870, post_count: 456, category: 'Technology', is_joined: false, is_private: false },
];

const mockPosts: Post[] = [
  {
    id: '1',
    author: { id: '1', name: 'Sarah Chen', title: 'Senior Software Engineer at Google', avatar: '', is_verified: true },
    content: '🚀 Just published my article on "Building Scalable React Applications with TypeScript"! Check it out and let me know your thoughts. #React #TypeScript #WebDevelopment',
    likes_count: 234,
    comments_count: 45,
    shares_count: 28,
    is_liked: true,
    is_saved: false,
    created_at: '2 hours ago',
    media: [{ type: 'article', url: '' }],
  },
  {
    id: '2',
    author: { id: '2', name: 'Michael Brown', title: 'Product Manager at Microsoft', avatar: '' },
    content: 'Excited to share that our team just shipped a major feature! 🎉 Teamwork makes the dream work. Grateful for such an amazing team.',
    likes_count: 156,
    comments_count: 32,
    shares_count: 12,
    is_liked: false,
    is_saved: true,
    created_at: '5 hours ago',
    group: { id: '1', name: 'Product Managers Network' },
  },
  {
    id: '3',
    author: { id: '3', name: 'Emily Zhang', title: 'Data Scientist at Meta', avatar: '', is_verified: true },
    content: '📊 New research paper: "Improving LLM Performance with Advanced Prompting Techniques"\n\nKey findings:\n• 40% improvement in task completion\n• Reduced hallucination by 60%\n• Works across multiple model sizes\n\n#AI #MachineLearning #Research',
    likes_count: 567,
    comments_count: 89,
    shares_count: 145,
    is_liked: false,
    is_saved: false,
    created_at: '1 day ago',
  },
];

const mockEvents: NetworkEvent[] = [
  { id: '1', title: 'Tech Leaders Summit 2024', description: 'Join top tech leaders for insights on the future of technology.', date: 'Jan 25, 2024', time: '10:00 AM PST', attendees_count: 1250, host: { id: '1', name: 'VerTechie Events', avatar: '' }, type: 'conference', is_registered: true },
  { id: '2', title: 'React Best Practices Workshop', description: 'Hands-on workshop on React optimization and patterns.', date: 'Jan 28, 2024', time: '2:00 PM PST', attendees_count: 450, host: { id: '2', name: 'React Community', avatar: '' }, type: 'workshop', is_registered: false },
  { id: '3', title: 'AI/ML Networking Meetup', description: 'Virtual networking for AI/ML professionals.', date: 'Feb 1, 2024', time: '6:00 PM PST', attendees_count: 280, host: { id: '3', name: 'AI Enthusiasts', avatar: '' }, type: 'meetup', is_registered: false },
];

// ============================================
// MAIN COMPONENT
// ============================================
const Network: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const [pendingRequests, setPendingRequests] = useState<User[]>(mockPendingRequests);
  const [suggestions, setSuggestions] = useState<User[]>(mockSuggestions);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [events, setEvents] = useState<NetworkEvent[]>(mockEvents);
  const [stats, setStats] = useState(mockStats);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });
  
  // Invite & Group Dialogs
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmails, setInviteEmails] = useState('');
  const [inviteMessage, setInviteMessage] = useState('Hey! I\'ve been using VerTechie to connect with like-minded professionals and grow my network. I think you\'d love it too! Join me on VerTechie.');
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  
  // Submit Idea Dialog
  const [submitIdeaDialogOpen, setSubmitIdeaDialogOpen] = useState(false);
  const [ideaData, setIdeaData] = useState({
    title: '',
    description: '',
    problemSolving: '',
    targetMarket: '',
    stage: 'idea',
    rolesNeeded: [] as string[],
    skillsHave: '',
    fundingStatus: 'bootstrapped',
    commitment: 'full-time',
  });
  const [ideaSubmitting, setIdeaSubmitting] = useState(false);
  
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    privacy: 'public',
    category: 'technology',
    inviteMembers: '',
  });
  
  // Attachment states
  const [attachedImages, setAttachedImages] = useState<File[]>([]);
  const [attachedVideo, setAttachedVideo] = useState<File | null>(null);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [articleLink, setArticleLink] = useState('');
  const [showArticleInput, setShowArticleInput] = useState(false);
  
  // File input refs
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);
  
  // Common emojis for quick picker
  const commonEmojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '💯', '✨', '🚀', '💪', '👏', '🙌', '💡', '🎯', '✅', '⭐'];
  
  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 4 - attachedImages.length); // Max 4 images
      setAttachedImages(prev => [...prev, ...newImages]);
      setSnackbar({ open: true, message: `${newImages.length} image(s) attached!`, severity: 'success' });
    }
  };
  
  // Handle video selection
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedVideo(file);
      setAttachedImages([]); // Clear images when video is added
      setSnackbar({ open: true, message: 'Video attached!', severity: 'success' });
    }
  };
  
  // Remove attached image
  const removeImage = (index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Add poll option
  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions(prev => [...prev, '']);
    }
  };
  
  // Update poll option
  const updatePollOption = (index: number, value: string) => {
    setPollOptions(prev => prev.map((opt, i) => i === index ? value : opt));
  };
  
  // Remove poll option
  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  // Add emoji to post content
  const addEmoji = (emoji: string) => {
    setPostContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };
  
  // Reset all attachments
  const resetAttachments = () => {
    setAttachedImages([]);
    setAttachedVideo(null);
    setShowPollCreator(false);
    setPollOptions(['', '']);
    setArticleLink('');
    setShowArticleInput(false);
    setShowEmojiPicker(false);
  };

  // Accept connection request
  const handleAcceptRequest = (userId: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== userId));
    setStats(prev => ({ ...prev, pending_requests: prev.pending_requests - 1, connections: prev.connections + 1 }));
    setSnackbar({ open: true, message: 'Connection request accepted!', severity: 'success' });
  };

  // Decline connection request
  const handleDeclineRequest = (userId: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== userId));
    setStats(prev => ({ ...prev, pending_requests: prev.pending_requests - 1 }));
  };

  // Connect with suggestion
  const handleConnect = (userId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== userId));
    setSnackbar({ open: true, message: 'Connection request sent!', severity: 'success' });
  };

  // Join group
  const handleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, is_joined: true, member_count: g.member_count + 1 } : g));
    setSnackbar({ open: true, message: 'Joined group successfully!', severity: 'success' });
  };

  // Like post
  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, is_liked: !p.is_liked, likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1 }
        : p
    ));
  };

  // Save post
  const handleSavePost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_saved: !p.is_saved } : p));
  };

  // Register for event
  const handleRegisterEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, is_registered: !e.is_registered, attendees_count: e.is_registered ? e.attendees_count - 1 : e.attendees_count + 1 }
        : e
    ));
    setSnackbar({ open: true, message: 'Registered for event!', severity: 'success' });
  };

  // Create post
  const handleCreatePost = () => {
    const content = postContent.trim();
    const hasPoll = showPollCreator && pollOptions.filter(o => o.trim()).length >= 2;
    const hasAttachments = attachedImages.length > 0 || attachedVideo || articleLink || hasPoll;
    
    if (!content && !hasAttachments) {
      setSnackbar({ open: true, message: 'Please enter some content or add an attachment.', severity: 'warning' });
      return;
    }
    
    // Build post content with attachments info
    let finalContent = content;
    if (articleLink) {
      finalContent += `\n\n🔗 ${articleLink}`;
    }
    if (hasPoll) {
      const validOptions = pollOptions.filter(o => o.trim());
      finalContent += `\n\n📊 Poll:\n${validOptions.map((o, i) => `• ${o}`).join('\n')}`;
    }
    
    const newPost: Post = {
      id: Date.now().toString(),
      author: { id: 'me', name: 'Admin A', title: 'Super Admin at VerTechie', avatar: '' },
      content: finalContent,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      is_liked: false,
      is_saved: false,
      created_at: 'Just now',
      // In a real app, these would be URLs after upload
      images: attachedImages.map(f => URL.createObjectURL(f)),
      video: attachedVideo ? URL.createObjectURL(attachedVideo) : undefined,
    };
    setPosts(prev => [newPost, ...prev]);
    setPostContent('');
    resetAttachments();
    setCreatePostOpen(false);
    
    const attachmentMsg = attachedImages.length > 0 ? ` with ${attachedImages.length} image(s)` : 
                          attachedVideo ? ' with video' : 
                          articleLink ? ' with article' :
                          hasPoll ? ' with poll' : '';
    setSnackbar({ open: true, message: `Post published${attachmentMsg}!`, severity: 'success' });
  };

  // Send invitations to join VerTechie
  const handleSendInvites = () => {
    const emails = inviteEmails.split(',').map(e => e.trim()).filter(e => e && e.includes('@'));
    if (emails.length === 0) {
      setSnackbar({ open: true, message: 'Please enter valid email addresses', severity: 'error' });
      return;
    }
    // Mock API call - in real app, this would send invitations
    console.log('Sending invites to:', emails, 'with message:', inviteMessage);
    setSnackbar({ open: true, message: `Invitations sent to ${emails.length} people!`, severity: 'success' });
    setInviteDialogOpen(false);
    setInviteEmails('');
  };

  // Create a new group
  const handleCreateGroup = () => {
    if (!newGroupData.name.trim()) {
      setSnackbar({ open: true, message: 'Please enter a group name', severity: 'error' });
      return;
    }
    // Mock group creation - in real app, this would call API
    const newGroup: NetworkGroup = {
      id: Date.now().toString(),
      name: newGroupData.name,
      description: newGroupData.description,
      members_count: 1,
      cover_image: '',
      is_member: true,
      category: newGroupData.category,
      privacy: newGroupData.privacy as 'public' | 'private',
    };
    setGroups(prev => [newGroup, ...prev]);
    setSnackbar({ open: true, message: `Group "${newGroupData.name}" created successfully!`, severity: 'success' });
    setCreateGroupDialogOpen(false);
    setNewGroupData({ name: '', description: '', privacy: 'public', category: 'technology', inviteMembers: '' });
    
    // If there are members to invite
    if (newGroupData.inviteMembers.trim()) {
      const inviteCount = newGroupData.inviteMembers.split(',').filter(e => e.trim()).length;
      setTimeout(() => {
        setSnackbar({ open: true, message: `${inviteCount} invitation(s) sent to join the group!`, severity: 'info' });
      }, 1500);
    }
  };

  // Submit startup idea
  const handleSubmitIdea = () => {
    if (!ideaData.title.trim()) {
      setSnackbar({ open: true, message: 'Please enter your startup idea title', severity: 'error' });
      return;
    }
    if (!ideaData.description.trim()) {
      setSnackbar({ open: true, message: 'Please describe your startup idea', severity: 'error' });
      return;
    }
    if (ideaData.rolesNeeded.length === 0) {
      setSnackbar({ open: true, message: 'Please select at least one role you need', severity: 'error' });
      return;
    }

    setIdeaSubmitting(true);
    
    // Mock API call - in real app, this would submit to backend
    setTimeout(() => {
      setIdeaSubmitting(false);
      setSnackbar({ 
        open: true, 
        message: '🎉 Your startup idea has been submitted! We\'ll match you with potential co-founders soon.', 
        severity: 'success' 
      });
      setSubmitIdeaDialogOpen(false);
      setIdeaData({
        title: '',
        description: '',
        problemSolving: '',
        targetMarket: '',
        stage: 'idea',
        rolesNeeded: [],
        skillsHave: '',
        fundingStatus: 'bootstrapped',
        commitment: 'full-time',
      });
    }, 1500);
  };

  // Toggle role selection
  const handleRoleToggle = (role: string) => {
    setIdeaData(prev => ({
      ...prev,
      rolesNeeded: prev.rolesNeeded.includes(role)
        ? prev.rolesNeeded.filter(r => r !== role)
        : [...prev.rolesNeeded, role]
    }));
  };

  return (
    <PageContainer>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* ========== LEFT SIDEBAR ========== */}
          <Grid item xs={12} md={3}>
            {/* Profile Card */}
            <StyledCard sx={{ mb: 3 }}>
              <Box sx={{ 
                background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)', 
                height: 80,
                borderRadius: '16px 16px 0 0',
              }} />
              <CardContent sx={{ pt: 0, textAlign: 'center', mt: -5 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    border: '4px solid white', 
                    mx: 'auto',
                    bgcolor: '#1976d2',
                    fontSize: 32,
                    fontWeight: 700,
                  }}
                >
                  A
                </Avatar>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>Admin A</Typography>
                <Typography variant="body2" color="text.secondary">Super Admin at VerTechie</Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>{stats.connections}</Typography>
                    <Typography variant="caption" color="text.secondary">Connections</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>{stats.followers}</Typography>
                    <Typography variant="caption" color="text.secondary">Followers</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>{stats.following}</Typography>
                    <Typography variant="caption" color="text.secondary">Following</Typography>
                  </Grid>
                </Grid>
                
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mt: 2, borderRadius: 2 }}
                  startIcon={<People />}
                >
                  View Profile
                </Button>
              </CardContent>
            </StyledCard>

            {/* Quick Stats */}
            <StyledCard sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
                  QUICK STATS
                </Typography>
                <List dense disablePadding>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText primary="Profile Views" secondary="This week" />
                    <Typography variant="h6" color="primary">{stats.profile_views}</Typography>
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText primary="Group Memberships" />
                    <Typography variant="h6" color="primary">{stats.group_memberships}</Typography>
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText primary="Pending Requests" />
                    <Badge badgeContent={stats.pending_requests} color="error">
                      <PersonAdd color="action" />
                    </Badge>
                  </ListItem>
                </List>
              </CardContent>
            </StyledCard>

            {/* Suggestions - Like-Minded Profiles */}
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    🎯 LIKE-MINDED PROFILES
                  </Typography>
                  <Button size="small">See All</Button>
                </Box>
                
                {suggestions.slice(0, 3).map(user => (
                  <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 1.5 }}>
                      {user.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {user.name}
                        {user.is_verified && <Verified sx={{ fontSize: 14, color: 'primary.main' }} />}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>{user.title}</Typography>
                    </Box>
                    <IconButton size="small" color="primary" onClick={() => handleConnect(user.id)}>
                      <PersonAdd fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </CardContent>
            </StyledCard>

            {/* Invite Friends to VerTechie */}
            <StyledCard sx={{ mt: 2 }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                    📧 GROW YOUR NETWORK
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Invite colleagues & friends to join VerTechie
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<Send />}
                    sx={{ borderRadius: 2, mb: 1 }}
                    onClick={() => setInviteDialogOpen(true)}
                  >
                    Invite to VerTechie
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    Earn rewards for each friend who joins!
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>

            {/* Quick Actions */}
            <StyledCard sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 2 }}>
                  ⚡ QUICK ACTIONS
                </Typography>
                <Button 
                  variant="text" 
                  fullWidth 
                  startIcon={<GroupAdd />}
                  sx={{ justifyContent: 'flex-start', mb: 1, borderRadius: 2 }}
                  onClick={() => setCreateGroupDialogOpen(true)}
                >
                  Create a New Group
                </Button>
                <Button 
                  variant="text" 
                  fullWidth 
                  startIcon={<Event />}
                  sx={{ justifyContent: 'flex-start', mb: 1, borderRadius: 2 }}
                >
                  Host a Networking Event
                </Button>
                <Button 
                  variant="text" 
                  fullWidth 
                  startIcon={<TrendingUp />}
                  sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
                  onClick={() => setActiveTab(4)}
                >
                  Join Combinator
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* ========== MAIN CONTENT ========== */}
          <Grid item xs={12} md={6}>
            {/* Tabs */}
            <Paper sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
              <Tabs 
                value={activeTab} 
                onChange={(_, v) => setActiveTab(v)}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': { py: 2, fontWeight: 600 },
                  '& .Mui-selected': { color: 'primary.main' },
                }}
              >
                <Tab icon={<Forum />} label="Feed" iconPosition="start" />
                <Tab icon={<People />} label="My Network" iconPosition="start" />
                <Tab icon={<Groups />} label="Groups" iconPosition="start" />
                <Tab icon={<Event />} label="Events" iconPosition="start" />
                <Tab icon={<TrendingUp />} label="Combinator" iconPosition="start" />
              </Tabs>
            </Paper>

            {/* Tab: Feed */}
            {activeTab === 0 && (
              <>
                {/* Create Post */}
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
                      <Button startIcon={<ImageIcon />} color="inherit">Photo</Button>
                      <Button startIcon={<Videocam />} color="inherit">Video</Button>
                      <Button startIcon={<Article />} color="inherit">Article</Button>
                      <Button startIcon={<Poll />} color="inherit">Poll</Button>
                    </Box>
                  </CardContent>
                </StyledCard>

                {/* Posts */}
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.secondary">
                          {post.likes_count} likes • {post.comments_count} comments • {post.shares_count} shares
                        </Typography>
                      </Box>

                      {/* Post Actions */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 1 }}>
                        <Button 
                          color={post.is_liked ? 'primary' : 'inherit'} 
                          startIcon={post.is_liked ? <Favorite /> : <FavoriteBorder />}
                          onClick={() => handleLikePost(post.id)}
                        >
                          Like
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
              </>
            )}

            {/* Tab: My Network */}
            {activeTab === 1 && (
              <>
                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                  <StyledCard sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Badge badgeContent={pendingRequests.length} color="error">
                          <PersonAdd />
                        </Badge>
                        Pending Invitations
                      </Typography>
                      
                      {pendingRequests.map(user => (
                        <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                            {user.name.charAt(0)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{user.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{user.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.mutual_connections} mutual connections
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                              variant="contained" 
                              size="small" 
                              sx={{ borderRadius: 2 }}
                              onClick={() => handleAcceptRequest(user.id)}
                            >
                              Accept
                            </Button>
                            <Button 
                              variant="outlined" 
                              size="small" 
                              sx={{ borderRadius: 2 }}
                              onClick={() => handleDeclineRequest(user.id)}
                            >
                              Ignore
                            </Button>
                          </Box>
                        </Box>
                      ))}
                    </CardContent>
                  </StyledCard>
                )}

                {/* Connections List */}
                <StyledCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {stats.connections} Connections
                      </Typography>
                      <TextField
                        size="small"
                        placeholder="Search connections..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                        }}
                        sx={{ width: 250, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                      />
                    </Box>

                    <Grid container spacing={2}>
                      {connections.map(conn => (
                        <Grid item xs={12} sm={6} key={conn.id}>
                          <ConnectionCard>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                              {conn.name.charAt(0)}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {conn.name}
                                {conn.is_verified && <Verified sx={{ fontSize: 14, color: 'primary.main' }} />}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>{conn.title}</Typography>
                              <Typography variant="caption" color="text.secondary">{conn.company}</Typography>
                            </Box>
                            <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                              Message
                            </Button>
                          </ConnectionCard>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </StyledCard>
              </>
            )}

            {/* Tab: Groups */}
            {activeTab === 2 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Discover Groups</Typography>
                  <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 2 }}>
                    Create Group
                  </Button>
                </Box>

                {/* Filter Chips */}
                <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                  <SuggestionChip label="All" color="primary" variant="filled" />
                  <SuggestionChip label="Technology" variant="outlined" />
                  <SuggestionChip label="Business" variant="outlined" />
                  <SuggestionChip label="Community" variant="outlined" />
                  <SuggestionChip label="Career" variant="outlined" />
                </Box>

                <Grid container spacing={3}>
                  {groups.map(group => (
                    <Grid item xs={12} sm={6} key={group.id}>
                      <GroupCard>
                        <Box sx={{ 
                          height: 100, 
                          background: `linear-gradient(135deg, ${alpha('#1976d2', 0.8)} 0%, ${alpha('#7c3aed', 0.8)} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Groups sx={{ fontSize: 48, color: 'white' }} />
                        </Box>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                              {group.name}
                            </Typography>
                            {group.is_private && <Lock fontSize="small" color="action" />}
                            {group.is_featured && <Chip label="Featured" size="small" color="primary" />}
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                            {group.description.substring(0, 80)}...
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              {group.member_count.toLocaleString()} members • {group.post_count} posts
                            </Typography>
                            <Button 
                              variant={group.is_joined ? 'outlined' : 'contained'}
                              size="small"
                              sx={{ borderRadius: 2 }}
                              onClick={() => !group.is_joined && handleJoinGroup(group.id)}
                            >
                              {group.is_joined ? 'Joined' : 'Join'}
                            </Button>
                          </Box>
                        </CardContent>
                      </GroupCard>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {/* Tab: Events */}
            {activeTab === 3 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Upcoming Events</Typography>
                  <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 2 }}>
                    Create Event
                  </Button>
                </Box>

                {events.map(event => (
                  <StyledCard key={event.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 3 }}>
                        <Box sx={{ 
                          width: 80, 
                          textAlign: 'center', 
                          p: 2, 
                          bgcolor: alpha('#1976d2', 0.1),
                          borderRadius: 2,
                        }}>
                          <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                            {event.date.split(' ')[0]}
                          </Typography>
                          <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                            {event.date.split(' ')[1].replace(',', '')}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Chip 
                              label={event.type.toUpperCase()} 
                              size="small" 
                              color={event.type === 'conference' ? 'primary' : event.type === 'workshop' ? 'secondary' : 'default'}
                            />
                            {event.is_registered && <Chip label="Registered" size="small" color="success" />}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>{event.title}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {event.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {event.time} • {event.attendees_count} attendees
                          </Typography>
                        </Box>
                        <Button 
                          variant={event.is_registered ? 'outlined' : 'contained'}
                          sx={{ alignSelf: 'center', borderRadius: 2 }}
                          onClick={() => handleRegisterEvent(event.id)}
                        >
                          {event.is_registered ? 'Registered' : 'Register'}
                        </Button>
                      </Box>
                    </CardContent>
                  </StyledCard>
                ))}
              </>
            )}

            {/* Tab: Combinator - Founder Matching Platform */}
            {activeTab === 4 && (
              <>
                {/* Hero Section */}
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                  borderRadius: 4,
                  p: 4,
                  mb: 4,
                  color: 'white',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <Box sx={{ 
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    background: 'radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%)',
                    borderRadius: '50%',
                  }} />
                  <Box sx={{ 
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 150,
                    height: 150,
                    background: 'radial-gradient(circle, rgba(76,175,80,0.3) 0%, transparent 70%)',
                    borderRadius: '50%',
                  }} />
                  
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, position: 'relative' }}>
                    🚀 VerTechie Combinator
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 400, mb: 3, opacity: 0.9, position: 'relative' }}>
                    We help founders make something people want
                  </Typography>
                  <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', opacity: 0.8, position: 'relative' }}>
                    Find your perfect co-founder, build your dream team, and launch your startup with the support of our thriving community.
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={() => setSubmitIdeaDialogOpen(true)}
                    sx={{ 
                      mt: 3,
                      px: 5,
                      py: 1.5,
                      borderRadius: 3,
                      background: 'linear-gradient(45deg, #ff6b35 30%, #f7931e 90%)',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #e55a2b 30%, #d6811a 90%)',
                      }
                    }}
                  >
                    Submit Your Idea
                  </Button>
                </Box>

                {/* Value Propositions */}
                <StyledCard sx={{ mb: 4 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center', color: 'primary.main' }}>
                      Why VerTechie Combinator?
                    </Typography>
                    <Grid container spacing={3}>
                      {[
                        { icon: '👥', title: 'Support at Every Stage', desc: 'We help founders at their earliest stages regardless of their age or experience.' },
                        { icon: '📈', title: 'Improved Success Rates', desc: 'We dramatically improve the success rate of our startups through mentorship and resources.' },
                        { icon: '💰', title: 'Fundraising Advantage', desc: 'We give startups a huge fundraising advantage with our network of investors.' },
                        { icon: '🦄', title: 'Unicorn Track Record', desc: 'Our companies have a track record of becoming billion dollar companies.' },
                      ].map((item, idx) => (
                        <Grid item xs={12} sm={6} key={idx}>
                          <Box sx={{ 
                            p: 3, 
                            borderRadius: 3, 
                            bgcolor: alpha('#1976d2', 0.05),
                            height: '100%',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: alpha('#1976d2', 0.1),
                              transform: 'translateY(-4px)',
                            }
                          }}>
                            <Typography variant="h3" sx={{ mb: 1 }}>{item.icon}</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{item.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </StyledCard>

                {/* How It Works */}
                <StyledCard sx={{ mb: 4 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
                      How Does It Work?
                    </Typography>
                    <Grid container spacing={4}>
                      {[
                        { 
                          step: 1, 
                          icon: '💡', 
                          title: 'Share Your Idea', 
                          desc: 'Describe your startup concept, target market, problem you\'re solving, and your vision for the future.',
                          color: '#4caf50'
                        },
                        { 
                          step: 2, 
                          icon: '🎯', 
                          title: 'Define Your Needs', 
                          desc: 'Tell us what roles you need - CTO, Marketing Lead, Designer - and the skills that would complement yours.',
                          color: '#2196f3'
                        },
                        { 
                          step: 3, 
                          icon: '🤝', 
                          title: 'Connect With Matches', 
                          desc: 'Our AI matches you with co-founders who share your vision. Review profiles and send connection requests.',
                          color: '#ff9800'
                        },
                        { 
                          step: 4, 
                          icon: '🚀', 
                          title: 'Start Building', 
                          desc: 'Schedule discovery calls, align on goals, and start building your dream startup together!',
                          color: '#e91e63'
                        },
                      ].map((item, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                          <Box sx={{ textAlign: 'center', position: 'relative' }}>
                            <Box sx={{ 
                              width: 80,
                              height: 80,
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}40 100%)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mx: 'auto',
                              mb: 2,
                              border: `3px solid ${item.color}`,
                              position: 'relative',
                            }}>
                              <Typography variant="h3">{item.icon}</Typography>
                              <Box sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                bgcolor: item.color,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                              }}>
                                {item.step}
                              </Box>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{item.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </StyledCard>

                {/* Featured Founders Looking for Co-Founders */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>🔥 Featured Founders</Typography>
                  <Button variant="outlined" sx={{ borderRadius: 2 }}>View All</Button>
                </Box>

                <Grid container spacing={2}>
                  {[
                    { 
                      name: 'Alex Chen', 
                      title: 'Technical Founder', 
                      skills: ['Full-Stack', 'AI/ML', 'System Design'],
                      looking: 'Business Co-Founder',
                      idea: 'AI-powered healthcare diagnostics platform',
                      avatar: 'A',
                      raised: '$50K Pre-seed',
                    },
                    { 
                      name: 'Sarah Johnson', 
                      title: 'Business Founder', 
                      skills: ['Sales', 'Marketing', 'Fundraising'],
                      looking: 'Technical Co-Founder',
                      idea: 'Sustainable fashion marketplace',
                      avatar: 'S',
                      raised: 'Bootstrapped',
                    },
                    { 
                      name: 'Marcus Williams', 
                      title: 'Product Founder', 
                      skills: ['Product', 'UX Design', 'Growth'],
                      looking: 'Engineering Co-Founder',
                      idea: 'Remote team collaboration tool',
                      avatar: 'M',
                      raised: '$100K Angel',
                    },
                    { 
                      name: 'Priya Patel', 
                      title: 'Technical Founder', 
                      skills: ['Backend', 'DevOps', 'Blockchain'],
                      looking: 'Marketing Co-Founder',
                      idea: 'Decentralized identity verification',
                      avatar: 'P',
                      raised: '$200K Pre-seed',
                    },
                  ].map((founder, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <StyledCard sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Avatar sx={{ 
                              width: 60, 
                              height: 60, 
                              bgcolor: ['#4caf50', '#2196f3', '#ff9800', '#e91e63'][idx],
                              fontSize: '1.5rem',
                              fontWeight: 600,
                            }}>
                              {founder.avatar}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>{founder.name}</Typography>
                                <Verified sx={{ fontSize: 18, color: 'primary.main' }} />
                              </Box>
                              <Typography variant="body2" color="text.secondary">{founder.title}</Typography>
                              <Chip label={founder.raised} size="small" sx={{ mt: 0.5 }} color="success" variant="outlined" />
                            </Box>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>IDEA</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{founder.idea}</Typography>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>SKILLS</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                              {founder.skills.map(skill => (
                                <Chip key={skill} label={skill} size="small" variant="outlined" />
                              ))}
                            </Box>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>LOOKING FOR</Typography>
                            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>{founder.looking}</Typography>
                          </Box>
                          
                          <Button 
                            variant="contained" 
                            fullWidth 
                            startIcon={<Handshake />}
                            sx={{ borderRadius: 2, mt: 1 }}
                          >
                            Connect
                          </Button>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  ))}
                </Grid>

                {/* Create Your Founder Profile CTA */}
                <Box sx={{ 
                  mt: 4,
                  p: 4,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  textAlign: 'center',
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    Have a Startup Idea? Let's Make It Happen!
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                    Submit your idea and let our AI match you with the perfect co-founder to bring your vision to life.
                  </Typography>
                  <Button 
                    variant="contained"
                    size="large"
                    onClick={() => setSubmitIdeaDialogOpen(true)}
                    sx={{ 
                      bgcolor: 'white',
                      color: '#667eea',
                      fontWeight: 600,
                      px: 4,
                      borderRadius: 3,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                      }
                    }}
                  >
                    Submit Your Startup Idea
                  </Button>
                </Box>

                {/* Success Stories */}
                <StyledCard sx={{ mt: 4 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
                      🌟 Success Stories
                    </Typography>
                    <Grid container spacing={3}>
                      {[
                        { 
                          company: 'TechFlow AI', 
                          founders: 'David & Emma',
                          story: 'Met through Combinator, raised $2M seed, now serving 500+ enterprise clients.',
                          valuation: '$15M',
                        },
                        { 
                          company: 'GreenCart', 
                          founders: 'James & Aisha',
                          story: 'Connected as technical and business co-founders, acquired by major retailer.',
                          valuation: 'Acquired',
                        },
                        { 
                          company: 'CodeMentor Pro', 
                          founders: 'Ryan & Sofia',
                          story: 'Built a coding education platform, 100K+ students, profitable in 18 months.',
                          valuation: '$8M',
                        },
                      ].map((story, idx) => (
                        <Grid item xs={12} md={4} key={idx}>
                          <Box sx={{ 
                            p: 3, 
                            borderRadius: 3, 
                            bgcolor: alpha('#4caf50', 0.05),
                            border: `1px solid ${alpha('#4caf50', 0.2)}`,
                            height: '100%',
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <Celebration sx={{ color: '#4caf50' }} />
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>{story.company}</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                              "{story.story}"
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                by {story.founders}
                              </Typography>
                              <Chip label={story.valuation} size="small" color="success" />
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </StyledCard>
              </>
            )}
          </Grid>

          {/* ========== RIGHT SIDEBAR ========== */}
          <Grid item xs={12} md={3}>
            {/* Trending Topics */}
            <StyledCard sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp fontSize="small" />
                  TRENDING IN YOUR NETWORK
                </Typography>
                
                {['#TechCareers', '#ReactJS', '#AITools', '#RemoteWork', '#StartupLife'].map((tag, i) => (
                  <Box key={tag} sx={{ py: 1.5, borderBottom: i < 4 ? '1px solid' : 'none', borderColor: 'divider' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>{tag}</Typography>
                    <Typography variant="caption" color="text.secondary">{(500 - i * 80).toLocaleString()} posts</Typography>
                  </Box>
                ))}
              </CardContent>
            </StyledCard>

            {/* Upcoming Events */}
            <StyledCard sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Event fontSize="small" />
                  UPCOMING EVENTS
                </Typography>
                
                {events.slice(0, 2).map(event => (
                  <Box key={event.id} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{event.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{event.date} • {event.time}</Typography>
                  </Box>
                ))}
                
                <Button size="small" fullWidth sx={{ mt: 1 }}>View All Events</Button>
              </CardContent>
            </StyledCard>

            {/* Footer Links */}
            <Box sx={{ px: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 2 }}>
                About • Help • Privacy • Terms • Advertising • Jobs • Cookie Policy
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                VerTechie © 2024
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

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
            onInput={(e: React.FormEvent<HTMLDivElement>) => {
              const target = e.target as HTMLTextAreaElement;
              setPostContent(target.value);
            }}
            inputProps={{ 
              'aria-label': 'Post content',
              id: 'post-content-input'
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
              '& .MuiInputBase-input': { cursor: 'text' }
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
                color={showArticleInput || articleLink ? 'primary' : 'default'}
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
          <Button onClick={() => { setCreatePostOpen(false); resetAttachments(); setPostContent(''); }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreatePost}
            disabled={!postContent.trim() && attachedImages.length === 0 && !attachedVideo && !articleLink && !showPollCreator}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========== INVITE FRIENDS DIALOG ========== */}
      <Dialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Send color="primary" />
          Invite Friends to VerTechie
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              🎁 Earn Rewards!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Get 50 VerCoins for each friend who joins and completes their profile!
            </Typography>
          </Box>
          
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Email Addresses
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Enter email addresses separated by commas&#10;e.g., john@email.com, jane@email.com"
            value={inviteEmails}
            onChange={(e) => setInviteEmails(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Personal Message (Optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={inviteMessage}
            onChange={(e) => setInviteMessage(e.target.value)}
          />
          
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              📱 Or share via link
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value="https://vertechie.com/join?ref=admin-a"
                InputProps={{ readOnly: true }}
              />
              <Button variant="contained" size="small">Copy</Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSendInvites}
            startIcon={<Send />}
            disabled={!inviteEmails.trim()}
          >
            Send Invitations
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========== CREATE GROUP DIALOG ========== */}
      <Dialog
        open={createGroupDialogOpen}
        onClose={() => setCreateGroupDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupAdd color="primary" />
          Create a New Group
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Build a community around shared interests, skills, or goals.
          </Typography>
          
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Group Name *
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g., React Developers India"
            value={newGroupData.name}
            onChange={(e) => setNewGroupData(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="What is this group about?"
            value={newGroupData.description}
            onChange={(e) => setNewGroupData(prev => ({ ...prev, description: e.target.value }))}
            sx={{ mb: 2 }}
          />
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Privacy
              </Typography>
              <TextField
                select
                fullWidth
                value={newGroupData.privacy}
                onChange={(e) => setNewGroupData(prev => ({ ...prev, privacy: e.target.value }))}
              >
                <MenuItem value="public">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Public fontSize="small" /> Public
                  </Box>
                </MenuItem>
                <MenuItem value="private">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Lock fontSize="small" /> Private
                  </Box>
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Category
              </Typography>
              <TextField
                select
                fullWidth
                value={newGroupData.category}
                onChange={(e) => setNewGroupData(prev => ({ ...prev, category: e.target.value }))}
              >
                <MenuItem value="technology">Technology</MenuItem>
                <MenuItem value="career">Career</MenuItem>
                <MenuItem value="startup">Startup</MenuItem>
                <MenuItem value="learning">Learning</MenuItem>
                <MenuItem value="networking">Networking</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              👥 Invite Members (Optional)
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Enter email addresses to invite people to join your group
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="john@email.com, jane@email.com"
              value={newGroupData.inviteMembers}
              onChange={(e) => setNewGroupData(prev => ({ ...prev, inviteMembers: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateGroupDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateGroup}
            startIcon={<Add />}
            disabled={!newGroupData.name.trim()}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========== SUBMIT IDEA DIALOG ========== */}
      <Dialog
        open={submitIdeaDialogOpen}
        onClose={() => setSubmitIdeaDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}>
          <Lightbulb />
          Submit Your Startup Idea
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Share your startup vision and we'll match you with the perfect co-founder to bring it to life.
          </Typography>
          
          {/* Basic Info */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
            💡 Your Idea
          </Typography>
          
          <TextField
            fullWidth
            label="Startup Name / Title"
            placeholder="e.g., AI-Powered Learning Platform"
            value={ideaData.title}
            onChange={(e) => setIdeaData(prev => ({ ...prev, title: e.target.value }))}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Describe Your Idea"
            placeholder="What is your startup about? What makes it unique?"
            value={ideaData.description}
            onChange={(e) => setIdeaData(prev => ({ ...prev, description: e.target.value }))}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Problem You're Solving"
            placeholder="What problem does your startup solve? Who has this problem?"
            value={ideaData.problemSolving}
            onChange={(e) => setIdeaData(prev => ({ ...prev, problemSolving: e.target.value }))}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Target Market"
            placeholder="e.g., Students, SMBs, Enterprise companies, Healthcare providers"
            value={ideaData.targetMarket}
            onChange={(e) => setIdeaData(prev => ({ ...prev, targetMarket: e.target.value }))}
            sx={{ mb: 3 }}
          />
          
          <Divider sx={{ my: 2 }} />
          
          {/* Stage & Commitment */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
            📊 Current Stage
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Startup Stage</InputLabel>
                <Select
                  value={ideaData.stage}
                  label="Startup Stage"
                  onChange={(e) => setIdeaData(prev => ({ ...prev, stage: e.target.value }))}
                >
                  <MenuItem value="idea">💭 Just an Idea</MenuItem>
                  <MenuItem value="validation">🔍 Validating the Concept</MenuItem>
                  <MenuItem value="mvp">🛠️ Building MVP</MenuItem>
                  <MenuItem value="launched">🚀 Already Launched</MenuItem>
                  <MenuItem value="revenue">💰 Generating Revenue</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Your Commitment</InputLabel>
                <Select
                  value={ideaData.commitment}
                  label="Your Commitment"
                  onChange={(e) => setIdeaData(prev => ({ ...prev, commitment: e.target.value }))}
                >
                  <MenuItem value="full-time">⏰ Full-time</MenuItem>
                  <MenuItem value="part-time">🕐 Part-time (20+ hrs/week)</MenuItem>
                  <MenuItem value="side-project">🌙 Side Project (10-20 hrs/week)</MenuItem>
                  <MenuItem value="exploring">🔎 Just Exploring</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Funding Status</InputLabel>
            <Select
              value={ideaData.fundingStatus}
              label="Funding Status"
              onChange={(e) => setIdeaData(prev => ({ ...prev, fundingStatus: e.target.value }))}
            >
              <MenuItem value="bootstrapped">🏠 Bootstrapped / Self-funded</MenuItem>
              <MenuItem value="seeking-preSeed">🌱 Seeking Pre-Seed</MenuItem>
              <MenuItem value="seeking-seed">💰 Seeking Seed Round</MenuItem>
              <MenuItem value="funded">✅ Already Funded</MenuItem>
              <MenuItem value="not-sure">🤔 Not Sure Yet</MenuItem>
            </Select>
          </FormControl>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Roles Needed */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
            🎯 Roles You Need (Select all that apply)
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {[
              { label: 'Technical Co-Founder / CTO', value: 'cto' },
              { label: 'Full-Stack Developer', value: 'fullstack' },
              { label: 'Backend Engineer', value: 'backend' },
              { label: 'Frontend Developer', value: 'frontend' },
              { label: 'Mobile Developer', value: 'mobile' },
              { label: 'AI/ML Engineer', value: 'ai-ml' },
              { label: 'DevOps Engineer', value: 'devops' },
              { label: 'UI/UX Designer', value: 'designer' },
              { label: 'Product Manager', value: 'product' },
              { label: 'Marketing Lead', value: 'marketing' },
              { label: 'Sales / BD', value: 'sales' },
              { label: 'Finance / CFO', value: 'finance' },
              { label: 'Operations', value: 'operations' },
              { label: 'Data Scientist', value: 'data-science' },
              { label: 'Growth Hacker', value: 'growth' },
            ].map((role) => (
              <Chip
                key={role.value}
                label={role.label}
                onClick={() => handleRoleToggle(role.value)}
                color={ideaData.rolesNeeded.includes(role.value) ? 'primary' : 'default'}
                variant={ideaData.rolesNeeded.includes(role.value) ? 'filled' : 'outlined'}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
              />
            ))}
          </Box>
          
          <TextField
            fullWidth
            label="Your Skills & Experience"
            placeholder="What skills and experience do you bring to the table?"
            value={ideaData.skillsHave}
            onChange={(e) => setIdeaData(prev => ({ ...prev, skillsHave: e.target.value }))}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setSubmitIdeaDialogOpen(false)}
            disabled={ideaSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitIdea}
            disabled={ideaSubmitting || !ideaData.title.trim() || !ideaData.description.trim() || ideaData.rolesNeeded.length === 0}
            startIcon={ideaSubmitting ? <CircularProgress size={20} color="inherit" /> : <RocketLaunch />}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd6 30%, #6a4190 90%)',
              }
            }}
          >
            {ideaSubmitting ? 'Submitting...' : 'Submit & Find Co-Founders'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        message={snackbar.message}
      />
    </PageContainer>
  );
};

export default Network;

