/**
 * MyNetwork - Connections and network management page
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Button, Grid,
  TextField, InputAdornment, Badge, Snackbar, Alert, CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Search, PersonAdd, Verified } from '@mui/icons-material';
import NetworkLayout from '../../components/network/NetworkLayout';
import { getApiUrl, API_ENDPOINTS } from '../../config/api';
import { fetchWithAuth } from '../../utils/apiInterceptor';
import { api } from '../../services/apiClient';

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

const ConnectionCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 4px 12px rgba(25, 118, 210, 0.15)`,
  },
}));

// ============================================
// INTERFACES
// ============================================
interface User {
  id: string;
  request_id?: string;
  name: string;
  avatar?: string;
  title?: string;
  company?: string;
  mutual_connections?: number;
  is_verified?: boolean;
  skills?: string[];
}

interface Connection extends User {
  connected_at: string;
  status: 'connected' | 'pending' | 'following';
}

interface NetworkStats {
  connections_count?: number;
  followers_count?: number;
  following_count?: number;
  pending_requests_count?: number;
  group_memberships?: number;
  profile_views?: number;
}

// ============================================
// COMPONENT
// ============================================
const MyNetwork: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    connections: 0,
    followers: 0,
    following: 0,
    pending_requests: 0,
    group_memberships: 0,
    profile_views: 0,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch network stats from API
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await api.get(API_ENDPOINTS.UNIFIED_NETWORK.STATS) as NetworkStats;
      setStats({
        connections: statsData.connections_count || 0,
        followers: statsData.followers_count || 0,
        following: statsData.following_count || 0,
        pending_requests: statsData.pending_requests_count || 0,
        group_memberships: statsData.group_memberships || 0,
        profile_views: statsData.profile_views || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const getUserMap = useCallback(async (userIds: string[]) => {
    const unique = Array.from(new Set(userIds.filter(Boolean)));
    const entries = await Promise.all(
      unique.map(async (id) => {
        try {
          const response = await fetchWithAuth(getApiUrl(API_ENDPOINTS.USERS.GET(id)));
          if (!response.ok) return [id, null] as const;
          const user = await response.json();
          return [id, user] as const;
        } catch {
          return [id, null] as const;
        }
      })
    );
    return new Map(entries);
  }, []);

  // Fetch connections from API
  const fetchConnections = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const meRes = await fetchWithAuth(getApiUrl('/users/me'));
      if (!meRes.ok) throw new Error('Unable to load current user');
      const me = await meRes.json();

      const response = await fetchWithAuth(getApiUrl('/network/connections'));
      if (!response.ok) throw new Error('Unable to load connections');
      const data = await response.json();

      const otherUserIds: string[] = (Array.isArray(data) ? data : []).map((conn: any) =>
        conn.user_id === me.id ? conn.connected_user_id : conn.user_id
      );
      const userMap = await getUserMap(otherUserIds);

      const mappedConnections: Connection[] = (Array.isArray(data) ? data : []).map((conn: any) => {
        const otherId = conn.user_id === me.id ? conn.connected_user_id : conn.user_id;
        const other = userMap.get(otherId);
        return {
          id: otherId,
          name: other ? `${other.first_name || ''} ${other.last_name || ''}`.trim() || other.email || 'User' : 'User',
          avatar: '',
          title: other?.headline || '',
          company: other?.current_company || '',
          mutual_connections: 0,
          is_verified: !!other?.is_verified,
          connected_at: conn.connected_at || new Date().toISOString(),
          status: 'connected',
          skills: [],
        };
      });
      setConnections(mappedConnections);
    } catch (err) {
      console.error('Error fetching connections:', err);
      setLoadError('Failed to load network data');
      setConnections([]);
      setPendingRequests([]);
      setLoading(false);
      return;
    }
    
    // Fetch pending requests
    try {
      const reqResponse = await fetchWithAuth(getApiUrl('/network/requests/received'));
      if (!reqResponse.ok) throw new Error('Unable to load pending requests');
      const reqData = await reqResponse.json();

      const senderIds: string[] = (Array.isArray(reqData) ? reqData : []).map((req: any) => req.sender_id);
      const userMap = await getUserMap(senderIds);

      const mappedRequests: User[] = (Array.isArray(reqData) ? reqData : []).map((req: any) => {
        const sender = userMap.get(req.sender_id);
        return {
          id: req.sender_id,
          request_id: req.id,
          name: sender ? `${sender.first_name || ''} ${sender.last_name || ''}`.trim() || sender.email || 'User' : 'User',
          avatar: '',
          title: sender?.headline || '',
          company: sender?.current_company || '',
          mutual_connections: 0,
          is_verified: !!sender?.is_verified,
        };
      });
      setPendingRequests(mappedRequests);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setPendingRequests([]);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
    fetchConnections();
  }, [fetchStats, fetchConnections]);

  // Accept connection request
  const handleAcceptRequest = async (requestId: string) => {
    const user = pendingRequests.find(u => u.request_id === requestId);
    if (user) {
      try {
        const response = await fetchWithAuth(getApiUrl(`/network/requests/${requestId}/respond`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'accept' }),
        });
        
        if (response.ok) {
          setPendingRequests(prev => prev.filter(u => u.request_id !== requestId));
          const newConnection: Connection = {
            ...user,
            connected_at: new Date().toISOString(),
            status: 'connected',
          };
          setConnections(prev => [newConnection, ...prev]);
          setSnackbar({ open: true, message: `Connected with ${user.name}!`, severity: 'success' });
        } else {
          setSnackbar({ open: true, message: 'Failed to accept request', severity: 'error' });
        }
      } catch (err) {
        console.error('Error accepting request:', err);
        setSnackbar({ open: true, message: 'Failed to accept request', severity: 'error' });
      }
    }
  };

  // Decline connection request
  const handleDeclineRequest = async (requestId: string) => {
    try {
      const response = await fetchWithAuth(getApiUrl(`/network/requests/${requestId}/respond`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'decline' }),
      });
      if (response.ok) {
        setPendingRequests(prev => prev.filter(u => u.request_id !== requestId));
        setSnackbar({ open: true, message: 'Request declined', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to decline request', severity: 'error' });
      }
    } catch (err) {
      console.error('Error declining request:', err);
      setSnackbar({ open: true, message: 'Failed to decline request', severity: 'error' });
    }
  };

  // Filter connections based on search
  const filteredConnections = connections.filter(conn =>
    conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <NetworkLayout>
      {loadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}
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
              <Box key={user.request_id || user.id} sx={{ display: 'flex', alignItems: 'center', py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                  {user.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {user.name}
                    {user.is_verified && <Verified sx={{ fontSize: 16, color: 'primary.main' }} />}
                  </Typography>
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
                    onClick={() => user.request_id && handleAcceptRequest(user.request_id)}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ borderRadius: 2 }}
                    onClick={() => user.request_id && handleDeclineRequest(user.request_id)}
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

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          <Grid container spacing={2}>
            {!loading && filteredConnections.map(conn => (
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

          {filteredConnections.length === 0 && searchQuery && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No connections found matching "{searchQuery}"
              </Typography>
            </Box>
          )}

          {!loading && !searchQuery && filteredConnections.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No connections found
              </Typography>
            </Box>
          )}
        </CardContent>
      </StyledCard>

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

export default MyNetwork;

