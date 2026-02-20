/**
 * NetworkLayout - Shared layout for Network pages
 * 
 * Provides consistent layout with:
 * - Left sidebar (profile, stats, suggestions)
 * - Main content area
 * - Right sidebar (trending, events)
 * - Navigation tabs
 * 
 * Stats (Connections, Followers, Following) are loaded from /unified-network/stats.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../services/apiClient';
import { API_ENDPOINTS } from '../../config/api';
import {
  Box, Container, Grid, Typography, Card, CardContent, Avatar, Button, IconButton,
  Tabs, Tab, Paper, List, ListItem, ListItemText, Badge, Divider, Chip,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Snackbar, Alert,
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
// STATS SHAPE
// ============================================
interface NetworkStatsState {
  connections: number;
  followers: number;
  following: number;
  pending_requests: number;
  group_memberships: number;
  profile_views: number;
}

// ============================================
// COMPONENT
// ============================================
interface NetworkLayoutProps {
  children: React.ReactNode;
}

const NetworkLayout: React.FC<NetworkLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState<NetworkStatsState>({
    connections: 0,
    followers: 0,
    following: 0,
    pending_requests: 0,
    group_memberships: 0,
    profile_views: 0,
  });
  const [userName, setUserName] = useState<string>('User');
  const [userRole, setUserRole] = useState<string>('');
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [sidebarError, setSidebarError] = useState<string | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmails, setInviteEmails] = useState('');
  const [inviteMessage, setInviteMessage] = useState(
    "Hey! I've been using VerTechie to connect with like-minded professionals and grow my network. I think you'd love it too! Join me on VerTechie."
  );
  const [isSendingInvites, setIsSendingInvites] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'info' });

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.get(API_ENDPOINTS.UNIFIED_NETWORK.STATS) as any;
      setSidebarError(null);
      setStats({
        connections: data.connections_count ?? 0,
        followers: data.followers_count ?? 0,
        following: data.following_count ?? 0,
        pending_requests: data.pending_requests_count ?? 0,
        group_memberships: data.group_memberships ?? 0,
        profile_views: data.profile_views ?? 0,
      });
    } catch (err) {
      console.error('NetworkLayout: error fetching stats', err);
      setSidebarError('Some network stats could not be loaded.');
    }
  }, []);

  const [sidebarEvents, setSidebarEvents] = useState<NetworkEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const fetchSidebarEvents = useCallback(async () => {
    try {
      setLoadingEvents(true);
      const data = await api.get(`${API_ENDPOINTS.COMMUNITY.EVENTS}?limit=3`) as any[];
      setSidebarError(null);

      const mapped = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.start_date ? new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
        time: event.start_date ? new Date(event.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : 'TBD',
        attendees_count: event.attendees_count || 0,
        host: { id: event.host_id, name: event.host_name || 'Host' },
        type: event.event_type as any,
        is_registered: event.is_registered || false
      }));

      setSidebarEvents(mapped);
    } catch (err) {
      console.error('NetworkLayout: error fetching events', err);
      setSidebarError('Some sidebar data could not be loaded.');
      setSidebarEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  const fetchSuggestions = useCallback(async () => {
    try {
      setLoadingSuggestions(true);
      const data = await api.get<any[]>(`${API_ENDPOINTS.UNIFIED_NETWORK.SUGGESTIONS_PEOPLE}?limit=3`);
      setSidebarError(null);
      const mapped: User[] = (Array.isArray(data) ? data : []).map((item: any) => ({
        id: item.id,
        name: item.name || 'User',
        avatar: item.avatar_url || '',
        title: item.title || '',
        company: item.company || '',
        mutual_connections: item.mutual_connections || 0,
        is_verified: !!item.is_verified,
        skills: item.skills || [],
      }));
      setSuggestions(mapped);
    } catch (err) {
      console.error('NetworkLayout: error fetching suggestions', err);
      setSidebarError('Some sidebar data could not be loaded.');
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  // Load current user's display name and a simple role label
  useEffect(() => {
    const raw = localStorage.getItem('userData');
    if (!raw) return;

    try {
      const user = JSON.parse(raw);

      const first = user.first_name || '';
      const last = user.last_name || '';
      const displayName =
        `${first} ${last}`.trim() || user.username || user.email || 'User';
      setUserName(displayName);

      const adminRoles: string[] = user.admin_roles || [];
      let roleLabel = '';
      if (user.is_superuser || adminRoles.includes('superadmin')) {
        roleLabel = 'Super Admin at VerTechie';
      } else if (adminRoles.includes('school_admin')) {
        roleLabel = 'School Admin at VerTechie';
      } else if (adminRoles.includes('company_admin')) {
        roleLabel = 'Company Admin at VerTechie';
      } else if (adminRoles.includes('techie_admin')) {
        roleLabel = 'Techie Admin at VerTechie';
      } else if (adminRoles.includes('hm_admin')) {
        roleLabel = 'HM Admin at VerTechie';
      } else {
        roleLabel = 'Member at VerTechie';
      }
      setUserRole(roleLabel);
    } catch (e) {
      console.error('NetworkLayout: failed to parse userData', e);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchSidebarEvents();
    fetchSuggestions();
  }, [fetchStats, fetchSidebarEvents, fetchSuggestions]);

  // Determine active tab based on current route
  const activeTab = tabRoutes.findIndex(route => location.pathname.startsWith(route.path));
  const currentTab = activeTab >= 0 ? activeTab : 0;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    navigate(tabRoutes[newValue].path);
  };

  const handleConnect = (userId: string) => {
    console.log('Connecting with user:', userId);
  };

  const handleSendInvites = async () => {
    const emails = inviteEmails
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email && email.includes('@'));

    if (emails.length === 0) {
      setSnackbar({ open: true, message: 'Please enter valid email addresses', severity: 'error' });
      return;
    }

    try {
      setIsSendingInvites(true);
      const response = await api.post<{
        total_requested: number;
        total_sent: number;
        failed_emails?: string[];
        message?: string;
      }>(API_ENDPOINTS.NETWORK.SEND_INVITES, {
        emails,
        message: inviteMessage,
      });

      const failed = response.failed_emails?.length || 0;
      const successMessage = failed > 0
        ? `Invites sent to ${response.total_sent}. Failed: ${failed}`
        : (response.message || `Invitations sent to ${response.total_sent} people!`);

      setSnackbar({ open: true, message: successMessage, severity: failed > 0 ? 'warning' : 'success' });
      setInviteDialogOpen(false);
      setInviteEmails('');
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Failed to send invites', severity: 'error' });
    } finally {
      setIsSendingInvites(false);
    }
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
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}> {userName}</Typography>
                <Typography variant="body2" color="text.secondary">{userRole}</Typography>

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
                  onClick={() => navigate('/techie/profile')}
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

                {loadingSuggestions && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={20} />
                  </Box>
                )}

                {!loadingSuggestions && suggestions.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No suggestions available
                  </Typography>
                )}

                {!loadingSuggestions && suggestions.slice(0, 3).map(user => (
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
                {sidebarError && (
                  <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                    {sidebarError}
                  </Typography>
                )}
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

                {loadingEvents ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : sidebarEvents.length > 0 ? (
                  sidebarEvents.map(event => (
                    <Box key={event.id} sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{event.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{event.date} • {event.time}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                    No upcoming events
                  </Typography>
                )}

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
                VerTechie © 2026
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Invite Friends to VerTechie</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter one or more email addresses (comma separated)
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={2}
            label="Email addresses"
            placeholder="john@example.com, jane@example.com"
            value={inviteEmails}
            onChange={(e) => setInviteEmails(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Message"
            value={inviteMessage}
            onChange={(e) => setInviteMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSendInvites} disabled={!inviteEmails.trim() || isSendingInvites}>
            {isSendingInvites ? 'Sending...' : 'Send Invite'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default NetworkLayout;

