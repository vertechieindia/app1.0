/**
 * NetworkGroups - Groups discovery and management page
 */

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Snackbar, Alert,
  useTheme, alpha, CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Groups, Lock, Add, Refresh } from '@mui/icons-material';
import NetworkLayout from '../../components/network/NetworkLayout';
import { communityService, Group as BackendGroup } from '../../services/communityService';

// ============================================
// STYLED COMPONENTS
// ============================================
const GroupCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
  },
}));

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

// ============================================
// MOCK DATA
// ============================================
const mockGroups: Group[] = [
  { id: '1', name: 'React Developers Community', description: 'A community for React developers to share knowledge and best practices.', member_count: 15420, post_count: 892, category: 'Technology', is_joined: true, is_private: false, is_featured: true },
  { id: '2', name: 'AI & Machine Learning', description: 'Discuss the latest in AI, ML, and data science.', member_count: 28350, post_count: 1456, category: 'Technology', is_joined: true, is_private: false, is_featured: true },
  { id: '3', name: 'Startup Founders Network', description: 'Connect with other startup founders and entrepreneurs.', member_count: 8920, post_count: 567, category: 'Business', is_joined: false, is_private: true },
  { id: '4', name: 'Cloud Computing Pros', description: 'AWS, Azure, GCP - discuss cloud technologies.', member_count: 12680, post_count: 789, category: 'Technology', is_joined: false, is_private: false },
  { id: '5', name: 'Women in Tech', description: 'Supporting and empowering women in technology.', member_count: 21500, post_count: 1234, category: 'Community', is_joined: true, is_private: false, is_featured: true },
  { id: '6', name: 'Career Growth Hub', description: 'Share tips and advice for career advancement.', member_count: 18750, post_count: 945, category: 'Career', is_joined: false, is_private: false },
];

// ============================================
// COMPONENT
// ============================================
const NetworkGroups: React.FC = () => {
  const theme = useTheme();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    privacy: 'public',
    category: 'technology',
    inviteMembers: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const categories = ['All', 'Technology', 'Business', 'Community', 'Career'];

  // Fetch groups from API
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const backendGroups = await communityService.getGroups({ limit: 50 });
      
      // Map backend Group to frontend Group interface
      const mappedGroups: Group[] = backendGroups.map((bg: BackendGroup) => ({
        id: bg.id,
        name: bg.name,
        description: bg.description || '',
        cover_image: bg.cover_url || undefined,
        icon: bg.avatar_url || undefined,
        member_count: bg.member_count || 0,
        post_count: bg.post_count || 0,
        category: bg.category || 'Technology',
        is_joined: false, // TODO: Check if user is member
        is_private: false, // TODO: Check group_type from backend
        is_featured: false, // TODO: Get from backend if available
      }));
      
      setGroups(mappedGroups.length > 0 ? mappedGroups : mockGroups);
    } catch (err: any) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups. Showing sample groups.');
      setGroups(mockGroups);
    } finally {
      setLoading(false);
    }
  };

  // Join group
  const handleJoinGroup = async (groupId: string) => {
    try {
      await communityService.joinGroup(groupId);
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, is_joined: true, member_count: g.member_count + 1 } : g));
      setSnackbar({ open: true, message: 'Joined group successfully!', severity: 'success' });
    } catch (err) {
      console.error('Error joining group:', err);
      setSnackbar({ open: true, message: 'Failed to join group. Please try again.', severity: 'error' });
    }
  };

  // Leave group
  const handleLeaveGroup = async (groupId: string) => {
    // TODO: Add leave group API endpoint
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, is_joined: false, member_count: g.member_count - 1 } : g));
    setSnackbar({ open: true, message: 'Left group', severity: 'success' });
  };

  // Create group
  const handleCreateGroup = async () => {
    if (!newGroupData.name.trim() || !newGroupData.description.trim()) return;
    
    try {
      const result = await communityService.createGroup({
        name: newGroupData.name,
        description: newGroupData.description,
        type: newGroupData.privacy === 'private' ? 'private' : 'public',
        category: newGroupData.category,
      });
      
      // Refresh groups list
      await fetchGroups();
      
      setSnackbar({ open: true, message: `Group "${newGroupData.name}" created successfully!`, severity: 'success' });
      setCreateGroupDialogOpen(false);
      setNewGroupData({ name: '', description: '', privacy: 'public', category: 'technology', inviteMembers: '' });
    } catch (err) {
      console.error('Error creating group:', err);
      setSnackbar({ open: true, message: 'Failed to create group. Please try again.', severity: 'error' });
    }
  };

  // Filter groups by category
  const filteredGroups = selectedCategory === 'All' 
    ? groups 
    : groups.filter(g => g.category === selectedCategory);

  return (
    <NetworkLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Discover Groups</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<Refresh />}
            onClick={fetchGroups}
            disabled={loading}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            sx={{ borderRadius: 2 }}
            onClick={() => setCreateGroupDialogOpen(true)}
          >
            Create Group
          </Button>
        </Box>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <SuggestionChip 
            key={cat}
            label={cat} 
            color={selectedCategory === cat ? 'primary' : 'default'}
            variant={selectedCategory === cat ? 'filled' : 'outlined'}
            onClick={() => setSelectedCategory(cat)}
          />
        ))}
      </Box>

      {/* Groups Grid */}
      {!loading && filteredGroups.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No groups found in this category
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {filteredGroups.map(group => (
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
                    onClick={() => group.is_joined ? handleLeaveGroup(group.id) : handleJoinGroup(group.id)}
                  >
                    {group.is_joined ? 'Joined' : 'Join'}
                  </Button>
                </Box>
              </CardContent>
            </GroupCard>
          </Grid>
        ))}
      </Grid>

      {/* Create Group Dialog */}
      <Dialog 
        open={createGroupDialogOpen} 
        onClose={() => setCreateGroupDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Create a New Group</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Group Name"
            value={newGroupData.name}
            onChange={(e) => setNewGroupData({ ...newGroupData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={newGroupData.description}
            onChange={(e) => setNewGroupData({ ...newGroupData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Privacy</InputLabel>
            <Select
              value={newGroupData.privacy}
              label="Privacy"
              onChange={(e) => setNewGroupData({ ...newGroupData, privacy: e.target.value })}
            >
              <MenuItem value="public">Public - Anyone can join</MenuItem>
              <MenuItem value="private">Private - Requires approval</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={newGroupData.category}
              label="Category"
              onChange={(e) => setNewGroupData({ ...newGroupData, category: e.target.value })}
            >
              <MenuItem value="technology">Technology</MenuItem>
              <MenuItem value="business">Business</MenuItem>
              <MenuItem value="community">Community</MenuItem>
              <MenuItem value="career">Career</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Invite Members (email addresses, comma-separated)"
            value={newGroupData.inviteMembers}
            onChange={(e) => setNewGroupData({ ...newGroupData, inviteMembers: e.target.value })}
            margin="normal"
            placeholder="email1@example.com, email2@example.com"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateGroupDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateGroup}
            disabled={!newGroupData.name.trim() || !newGroupData.description.trim()}
            sx={{ borderRadius: 2 }}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>

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

export default NetworkGroups;

