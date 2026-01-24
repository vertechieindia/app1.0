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

// ============================================
// MOCK DATA
// ============================================
const mockConnections: Connection[] = [
  { id: '1', name: 'Sarah Chen', title: 'Senior Software Engineer', company: 'Google', mutual_connections: 15, is_verified: true, connected_at: '2024-01-15', status: 'connected', skills: ['React', 'TypeScript', 'Node.js'] },
  { id: '2', name: 'Michael Brown', title: 'Product Manager', company: 'Microsoft', mutual_connections: 8, is_verified: true, connected_at: '2024-02-20', status: 'connected', skills: ['Agile', 'Product Strategy'] },
  { id: '3', name: 'Emily Zhang', title: 'Data Scientist', company: 'Meta', mutual_connections: 12, is_verified: false, connected_at: '2024-03-10', status: 'connected', skills: ['Python', 'ML', 'TensorFlow'] },
  { id: '4', name: 'David Kim', title: 'DevOps Engineer', company: 'AWS', mutual_connections: 18, is_verified: true, connected_at: '2024-01-05', status: 'connected', skills: ['AWS', 'Kubernetes', 'Docker'] },
  { id: '5', name: 'Lisa Wang', title: 'Frontend Developer', company: 'Stripe', mutual_connections: 6, is_verified: false, connected_at: '2024-02-15', status: 'connected', skills: ['React', 'Vue', 'CSS'] },
  { id: '6', name: 'James Wilson', title: 'CTO', company: 'StartupXYZ', mutual_connections: 22, is_verified: true, connected_at: '2024-01-25', status: 'connected', skills: ['Leadership', 'Architecture'] },
];

const mockPendingRequests: User[] = [
  { id: '101', name: 'Alex Thompson', title: 'Senior UX Designer', company: 'Apple', mutual_connections: 5, is_verified: false },
  { id: '102', name: 'Maria Garcia', title: 'Engineering Manager', company: 'Netflix', mutual_connections: 8, is_verified: true },
  { id: '103', name: 'John Davis', title: 'Backend Developer', company: 'Uber', mutual_connections: 3, is_verified: false },
];

const mockStats = {
  connections: 127,
  followers: 342,
  following: 89,
  pending_requests: 5,
  group_memberships: 12,
  profile_views: 1250,
};

// ============================================
// COMPONENT
// ============================================
const MyNetwork: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(mockStats);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);

  // Fetch network stats from API
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await api.get(API_ENDPOINTS.UNIFIED_NETWORK.STATS);
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
      // Keep mockStats as fallback
    }
  }, []);

  // Fetch connections from API
  const fetchConnections = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(getApiUrl('/network/connections'));
      if (response.ok) {
        const data = await response.json();
        const mappedConnections: Connection[] = data.map((conn: any) => ({
          id: conn.id || conn.user?.id,
          name: conn.user?.name || `${conn.user?.first_name || ''} ${conn.user?.last_name || ''}`.trim() || 'User',
          avatar: conn.user?.avatar_url || '',
          title: conn.user?.headline || '',
          company: conn.user?.current_company || '',
          mutual_connections: 0,
          is_verified: false,
          connected_at: conn.connected_at || new Date().toISOString(),
          status: 'connected' as const,
          skills: [],
        }));
        setConnections(mappedConnections.length > 0 ? mappedConnections : mockConnections);
      } else {
        setConnections(mockConnections);
      }
    } catch (err) {
      console.error('Error fetching connections:', err);
      setConnections(mockConnections);
    }
    
    // Fetch pending requests
    try {
      const reqResponse = await fetchWithAuth(getApiUrl('/network/requests'));
      if (reqResponse.ok) {
        const reqData = await reqResponse.json();
        const mappedRequests: User[] = reqData.map((req: any) => ({
          id: req.id || req.user?.id,
          name: req.user?.name || `${req.user?.first_name || ''} ${req.user?.last_name || ''}`.trim() || 'User',
          avatar: req.user?.avatar_url || '',
          title: req.user?.headline || '',
          company: '',
          mutual_connections: 0,
          is_verified: false,
        }));
        setPendingRequests(mappedRequests.length > 0 ? mappedRequests : mockPendingRequests);
      } else {
        setPendingRequests(mockPendingRequests);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
      setPendingRequests(mockPendingRequests);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
    fetchConnections();
  }, [fetchStats, fetchConnections]);

  // Accept connection request
  const handleAcceptRequest = async (userId: string) => {
    const user = pendingRequests.find(u => u.id === userId);
    if (user) {
      try {
        // Call API to accept request
        const response = await fetchWithAuth(getApiUrl(`/network/requests/${userId}/accept`), {
          method: 'POST',
        });
        
        if (response.ok) {
          setPendingRequests(prev => prev.filter(u => u.id !== userId));
          const newConnection: Connection = {
            ...user,
            connected_at: new Date().toISOString(),
            status: 'connected',
          };
          setConnections(prev => [newConnection, ...prev]);
          setSnackbar({ open: true, message: `Connected with ${user.name}!`, severity: 'success' });
        } else {
          // Fallback for demo - still update UI
          setPendingRequests(prev => prev.filter(u => u.id !== userId));
          const newConnection: Connection = {
            ...user,
            connected_at: new Date().toISOString(),
            status: 'connected',
          };
          setConnections(prev => [newConnection, ...prev]);
          setSnackbar({ open: true, message: `Connected with ${user.name}!`, severity: 'success' });
        }
      } catch (err) {
        console.error('Error accepting request:', err);
        // Still update UI for demo
        setPendingRequests(prev => prev.filter(u => u.id !== userId));
        const newConnection: Connection = {
          ...user,
          connected_at: new Date().toISOString(),
          status: 'connected',
        };
        setConnections(prev => [newConnection, ...prev]);
        setSnackbar({ open: true, message: `Connected with ${user.name}!`, severity: 'success' });
      }
    }
  };

  // Decline connection request
  const handleDeclineRequest = async (userId: string) => {
    setPendingRequests(prev => prev.filter(u => u.id !== userId));
    setSnackbar({ open: true, message: 'Request declined', severity: 'success' });
  };

  // Filter connections based on search
  const filteredConnections = connections.filter(conn =>
    conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <NetworkLayout>
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
            {filteredConnections.map(conn => (
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

