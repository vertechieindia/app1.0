/**
 * MyNetwork - Connections and network management page
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { useLocation, useNavigate } from 'react-router-dom';

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
  location?: string;
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
  const location = useLocation();
  const navigate = useNavigate();
  const pendingSectionRef = useRef<HTMLDivElement | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  // Find people to connect (search + filters)
  const [findName, setFindName] = useState('');
  const [findCountry, setFindCountry] = useState('');
  const [findLocation, setFindLocation] = useState('');
  const [findCompany, setFindCompany] = useState('');
  const [findJobTitle, setFindJobTitle] = useState('');
  const [findResults, setFindResults] = useState<User[]>([]);
  const [findLoading, setFindLoading] = useState(false);
  const [findSearched, setFindSearched] = useState(false);
  const [hasMoreFindPeople, setHasMoreFindPeople] = useState(true);
  const [loadingMoreFindPeople, setLoadingMoreFindPeople] = useState(false);
  const [sendingRequestId, setSendingRequestId] = useState<string | null>(null);
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

  const FIND_PEOPLE_PAGE_SIZE = 8;

  // Fetch people to connect (search/filter or initial like-minded)
  const fetchFindPeople = useCallback(async (opts?: { append?: boolean }) => {
    const append = opts?.append ?? false;
    if (append) {
      setLoadingMoreFindPeople(true);
    } else {
      setFindLoading(true);
    }
    try {
      const params: Record<string, string | number> = {
        limit: FIND_PEOPLE_PAGE_SIZE,
        offset: append ? findResults.length : 0,
      };
      if (findName.trim()) params.name = findName.trim();
      if (findCountry.trim()) params.country = findCountry.trim();
      if (findLocation.trim()) params.location = findLocation.trim();
      if (findCompany.trim()) params.company = findCompany.trim();
      if (findJobTitle.trim()) params.job_title = findJobTitle.trim();
      const data = await api.get<any[]>(API_ENDPOINTS.UNIFIED_NETWORK.SUGGESTIONS_PEOPLE, { params });
      const list = Array.isArray(data) ? data : [];
      setHasMoreFindPeople(list.length >= FIND_PEOPLE_PAGE_SIZE);
      const mapped: User[] = list.map((item: any) => ({
        id: item.id,
        name: item.name || 'User',
        avatar: item.avatar_url || '',
        title: item.title || '',
        company: item.company || '',
        location: item.location || '',
        mutual_connections: item.mutual_connections ?? 0,
        is_verified: !!item.is_verified,
        skills: item.skills || [],
      }));
      if (append) {
        setFindResults(prev => {
          const seen = new Set(prev.map(p => p.id));
          const added = mapped.filter(p => !seen.has(p.id));
          return [...prev, ...added];
        });
      } else {
        setFindResults(mapped);
      }
      setFindSearched(true);
    } catch (err) {
      console.error('Error fetching find people:', err);
      if (!append) setFindResults([]);
      setSnackbar({ open: true, message: 'Failed to load people', severity: 'error' });
    } finally {
      if (append) {
        setLoadingMoreFindPeople(false);
      } else {
        setFindLoading(false);
      }
    }
  }, [findName, findCountry, findLocation, findCompany, findJobTitle, findResults.length]);

  // Load initial like-minded people on mount
  useEffect(() => {
    fetchFindPeople();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount with current (empty) filters

  useEffect(() => {
    fetchStats();
    fetchConnections();
  }, [fetchStats, fetchConnections]);

  useEffect(() => {
    if (location.hash === '#pending-requests' && pendingSectionRef.current) {
      pendingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash, pendingRequests.length]);

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
          setStats(prev => ({
            ...prev,
            connections: prev.connections + 1,
            pending_requests: Math.max(0, prev.pending_requests - 1),
          }));
          fetchStats();
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
        setStats(prev => ({
          ...prev,
          pending_requests: Math.max(0, prev.pending_requests - 1),
        }));
        fetchStats();
        setSnackbar({ open: true, message: 'Request declined', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to decline request', severity: 'error' });
      }
    } catch (err) {
      console.error('Error declining request:', err);
      setSnackbar({ open: true, message: 'Failed to decline request', severity: 'error' });
    }
  };

  const handleConnectFromFind = (userId: string) => {
    setSendingRequestId(userId);
    api.post(API_ENDPOINTS.NETWORK.SEND_REQUEST, {
      receiver_id: userId,
      message: "Hi! I'd like to connect with you on VerTechie.",
    })
      .then(() => {
        setFindResults(prev => prev.filter(p => p.id !== userId));
        setSnackbar({ open: true, message: 'Connection request sent', severity: 'success' });
        fetchStats();
      })
      .catch((error: any) => {
        setSnackbar({ open: true, message: error?.message || 'Failed to send connection request', severity: 'error' });
      })
      .finally(() => setSendingRequestId(null));
  };

  // Filter connections based on search
  const filteredConnections = connections.filter(conn =>
    conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessageClick = (conn: Connection) => {
    navigate('/techie/chat', {
      state: {
        startChatUser: {
          id: conn.id,
          name: conn.name,
        },
      },
    });
  };

  return (
    <NetworkLayout>
      {loadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}

      {/* Connections List — show first (your connections count + search + list) */}
      <StyledCard sx={{ mb: 3 }}>
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
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 2 }}
                    onClick={() => handleMessageClick(conn)}
                  >
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

      {/* Find people to connect — filters + connect cards (show after Connections) */}
      <StyledCard sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Search />
            Find people to connect
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Search by name and filter by country, location, company, or job title.
          </Typography>

          {/* One row of filters */}
          <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                size="small"
                fullWidth
                label="Name"
                placeholder="First or last name"
                value={findName}
                onChange={(e) => setFindName(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                size="small"
                fullWidth
                label="Country"
                placeholder="e.g. USA, India"
                value={findCountry}
                onChange={(e) => setFindCountry(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                size="small"
                fullWidth
                label="Location"
                placeholder="City or region"
                value={findLocation}
                onChange={(e) => setFindLocation(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                size="small"
                fullWidth
                label="Company"
                placeholder="Company name"
                value={findCompany}
                onChange={(e) => setFindCompany(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                size="small"
                fullWidth
                label="Job title"
                placeholder="e.g. Engineer, PM"
                value={findJobTitle}
                onChange={(e) => setFindJobTitle(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={() => fetchFindPeople()}
                disabled={findLoading}
                startIcon={findLoading ? <CircularProgress size={18} color="inherit" /> : <Search />}
                sx={{ borderRadius: 2 }}
              >
                {findLoading ? 'Searching...' : 'Search'}
              </Button>
            </Grid>
          </Grid>

          {findLoading && findResults.length === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={32} />
            </Box>
          )}

          {!findLoading && findResults.length > 0 && (
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              {findSearched ? 'People you can connect with' : 'Like-minded people'}
            </Typography>
          )}
          {/* 2 profiles per row */}
          {!findLoading && findResults.length > 0 && (
            <Grid container spacing={2}>
              {findResults.map((person) => (
                <Grid item xs={12} sm={6} key={person.id}>
                  <ConnectionCard>
                    <Avatar
                      src={person.avatar && person.avatar.trim() ? person.avatar : undefined}
                      sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}
                    >
                      {(!person.avatar || !person.avatar.trim()) ? person.name.charAt(0) : null}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {person.name}
                        {person.is_verified && <Verified sx={{ fontSize: 14, color: 'primary.main' }} />}
                      </Typography>
                      {person.title && (
                        <Typography variant="body2" color="text.secondary" noWrap>{person.title}</Typography>
                      )}
                      {person.company && (
                        <Typography variant="caption" color="text.secondary" display="block">{person.company}</Typography>
                      )}
                      {person.location && (
                        <Typography variant="caption" color="text.secondary" display="block">{person.location}</Typography>
                      )}
                      {person.mutual_connections != null && person.mutual_connections > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          {person.mutual_connections} mutual connection{person.mutual_connections !== 1 ? 's' : ''}
                        </Typography>
                      )}
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 2 }}
                      disabled={sendingRequestId === person.id}
                      onClick={() => handleConnectFromFind(person.id)}
                      startIcon={sendingRequestId === person.id ? <CircularProgress size={14} color="inherit" /> : <PersonAdd />}
                    >
                      {sendingRequestId === person.id ? 'Sending...' : 'Connect'}
                    </Button>
                  </ConnectionCard>
                </Grid>
              ))}
            </Grid>
          )}

          {/* See more button */}
          {!findLoading && findResults.length > 0 && hasMoreFindPeople && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => fetchFindPeople({ append: true })}
                disabled={loadingMoreFindPeople}
                startIcon={loadingMoreFindPeople ? <CircularProgress size={18} color="inherit" /> : null}
                sx={{ borderRadius: 2 }}
              >
                {loadingMoreFindPeople ? 'Loading...' : 'See more'}
              </Button>
            </Box>
          )}

          {!findLoading && findSearched && findResults.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body2" color="text.secondary">
                No people found matching your search. Try different filters.
              </Typography>
            </Box>
          )}
        </CardContent>
      </StyledCard>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <StyledCard sx={{ mb: 3 }} id="pending-requests" ref={pendingSectionRef}>
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

