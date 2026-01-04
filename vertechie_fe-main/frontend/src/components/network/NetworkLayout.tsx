/**
 * NetworkLayout - Shared layout for Network pages
 * 
 * Provides consistent layout with:
 * - Left sidebar (profile, stats, suggestions)
 * - Main content area
 * - Right sidebar (trending, events)
 * - Navigation tabs
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Container, Grid, Typography, Card, CardContent, Avatar, Button, IconButton,
  Tabs, Tab, Paper, List, ListItem, ListItemText, Badge, Divider, Chip,
  useTheme, alpha,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  People, PersonAdd, Groups, Forum, Event, TrendingUp, Send, Verified,
  GroupAdd,
} from '@mui/icons-material';

// ============================================
// ANIMATIONS
// ============================================
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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

// ============================================
// INTERFACES
// ============================================
export interface User {
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

export interface NetworkEvent {
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

const mockSuggestions: User[] = [
  { id: '4', name: 'David Kim', title: 'DevOps Engineer', company: 'AWS', mutual_connections: 18, is_verified: true },
  { id: '5', name: 'Lisa Wang', title: 'Frontend Developer', company: 'Stripe', mutual_connections: 6, is_verified: false },
  { id: '6', name: 'James Wilson', title: 'CTO', company: 'StartupXYZ', mutual_connections: 22, is_verified: true },
];

const mockEvents: NetworkEvent[] = [
  { id: '1', title: 'Tech Leaders Summit 2024', description: 'Join top tech leaders for insights on the future of technology.', date: 'Jan 25, 2024', time: '10:00 AM PST', attendees_count: 1250, host: { id: '1', name: 'VerTechie Events', avatar: '' }, type: 'conference', is_registered: true },
  { id: '2', title: 'React Best Practices Workshop', description: 'Hands-on workshop on React optimization and patterns.', date: 'Jan 28, 2024', time: '2:00 PM PST', attendees_count: 450, host: { id: '2', name: 'React Community', avatar: '' }, type: 'workshop', is_registered: false },
];

// ============================================
// TAB ROUTES
// ============================================
const tabRoutes = [
  { path: '/techie/home/feed', label: 'Feed', icon: <Forum /> },
  { path: '/techie/home/network', label: 'My Network', icon: <People /> },
  { path: '/techie/home/groups', label: 'Groups', icon: <Groups /> },
  { path: '/techie/home/events', label: 'Events', icon: <Event /> },
  { path: '/techie/home/combinator', label: 'Combinator', icon: <TrendingUp /> },
];

// ============================================
// COMPONENT
// ============================================
interface NetworkLayoutProps {
  children: React.ReactNode;
}

const NetworkLayout: React.FC<NetworkLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const stats = mockStats;
  const suggestions = mockSuggestions;
  const events = mockEvents;

  // Determine active tab based on current route
  const activeTab = tabRoutes.findIndex(route => location.pathname.startsWith(route.path));
  const currentTab = activeTab >= 0 ? activeTab : 0;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    navigate(tabRoutes[newValue].path);
  };

  const handleConnect = (userId: string) => {
    console.log('Connecting with user:', userId);
  };

  return (
    <PageContainer>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* ========== LEFT SIDEBAR ========== */}
          <Grid item xs={12} md={3}>
            {/* Profile Card */}
            <StyledCard sx={{ mb: 3, overflow: 'hidden' }}>
              <Box sx={{ 
                height: 80, 
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              }} />
              <CardContent sx={{ textAlign: 'center', mt: -5 }}>
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

            {/* Suggestions */}
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

            {/* Invite Friends */}
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
                  onClick={() => navigate('/techie/home/groups')}
                >
                  Create a New Group
                </Button>
                <Button 
                  variant="text" 
                  fullWidth 
                  startIcon={<Event />}
                  sx={{ justifyContent: 'flex-start', mb: 1, borderRadius: 2 }}
                  onClick={() => navigate('/techie/home/events')}
                >
                  Host a Networking Event
                </Button>
                <Button 
                  variant="text" 
                  fullWidth 
                  startIcon={<TrendingUp />}
                  sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
                  onClick={() => navigate('/techie/home/combinator')}
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
                value={currentTab} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': { py: 2, fontWeight: 600 },
                  '& .Mui-selected': { color: 'primary.main' },
                }}
              >
                {tabRoutes.map((tab, index) => (
                  <Tab key={index} icon={tab.icon} label={tab.label} iconPosition="start" />
                ))}
              </Tabs>
            </Paper>

            {/* Page Content */}
            {children}
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
                
                <Button size="small" fullWidth sx={{ mt: 1 }} onClick={() => navigate('/techie/home/events')}>
                  View All Events
                </Button>
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
    </PageContainer>
  );
};

export default NetworkLayout;

