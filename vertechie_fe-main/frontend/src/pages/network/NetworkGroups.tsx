/**
 * NetworkGroups - Groups discovery and management page
 */

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Snackbar, Alert,
  alpha, CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Groups, Lock, Add, Refresh, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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
  created_by_id?: string;
  can_edit?: boolean;
  can_delete?: boolean;
  membership_role?: string | null;
}

const NAME_REGEX = /^[A-Za-z][A-Za-z0-9 &'().,-]{2,79}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const hasLetters = (value: string) => /[A-Za-z]/.test(value);
const normalizeSpaces = (value: string) => value.replace(/\s+/g, ' ').trim();

// ============================================
// COMPONENT
// ============================================
const NetworkGroups: React.FC = () => {
  const navigate = useNavigate();
  const currentUserId = (() => {
    try {
      return String(JSON.parse(localStorage.getItem('userData') || '{}')?.id || '');
    } catch {
      return '';
    }
  })();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [editGroupDialogOpen, setEditGroupDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    privacy: 'public',
    category: 'technology',
    inviteMembers: '',
  });
  const [editGroupData, setEditGroupData] = useState({
    name: '',
    description: '',
    privacy: 'public',
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
        category: bg.category || 'technology',
        is_joined: !!bg.is_joined,
        is_private: (bg.group_type || 'public') === 'private',
        is_featured: !!(bg as any).is_featured,
        created_by_id: bg.created_by_id,
        can_edit: !!bg.can_edit,
        can_delete: !!bg.can_delete,
        membership_role: bg.membership_role ?? null,
      }));
      
      setGroups(mappedGroups);
    } catch (err: any) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups.');
      setGroups([]);
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
    try {
      await communityService.leaveGroup(groupId);
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, is_joined: false, member_count: Math.max(0, g.member_count - 1) } : g));
      setSnackbar({ open: true, message: 'Left group', severity: 'success' });
    } catch (err) {
      console.error('Error leaving group:', err);
      setSnackbar({ open: true, message: 'Failed to leave group. Please try again.', severity: 'error' });
    }
  };

  // Create group
  const handleCreateGroup = async () => {
    const name = normalizeSpaces(newGroupData.name);
    const description = normalizeSpaces(newGroupData.description);
    const inviteRaw = normalizeSpaces(newGroupData.inviteMembers);
    const inviteEmails = inviteRaw ? inviteRaw.split(',').map((e) => e.trim()).filter(Boolean) : [];

    if (!name || !description) {
      setSnackbar({ open: true, message: 'Group name and description are required.', severity: 'error' });
      return;
    }
    if (!NAME_REGEX.test(name)) {
      setSnackbar({ open: true, message: 'Group name should start with letter and avoid unwanted characters.', severity: 'error' });
      return;
    }
    if (!hasLetters(description) || description.length < 10) {
      setSnackbar({ open: true, message: 'Description must be meaningful and at least 10 characters.', severity: 'error' });
      return;
    }
    if (inviteEmails.some((email) => !EMAIL_REGEX.test(email))) {
      setSnackbar({ open: true, message: 'One or more invite emails are invalid.', severity: 'error' });
      return;
    }
    
    try {
      await communityService.createGroup({
        name,
        description,
        group_type: newGroupData.privacy === 'private' ? 'private' : 'public',
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

  const handleOpenEditGroup = (group: Group) => {
    setEditingGroup(group);
    setEditGroupData({
      name: group.name,
      description: group.description || '',
      privacy: group.is_private ? 'private' : 'public',
    });
    setEditGroupDialogOpen(true);
  };

  const handleUpdateGroup = async () => {
    if (!editingGroup) return;
    const name = normalizeSpaces(editGroupData.name);
    const description = normalizeSpaces(editGroupData.description);
    if (!name || !description) {
      setSnackbar({ open: true, message: 'Group name and description are required.', severity: 'error' });
      return;
    }
    if (!NAME_REGEX.test(name)) {
      setSnackbar({ open: true, message: 'Group name should start with letter and avoid unwanted characters.', severity: 'error' });
      return;
    }
    if (!hasLetters(description) || description.length < 10) {
      setSnackbar({ open: true, message: 'Description must be meaningful and at least 10 characters.', severity: 'error' });
      return;
    }

    try {
      await communityService.updateGroup(editingGroup.id, {
        name,
        description,
        group_type: editGroupData.privacy === 'private' ? 'private' : 'public',
      });
      await fetchGroups();
      setSnackbar({ open: true, message: 'Group updated successfully!', severity: 'success' });
      setEditGroupDialogOpen(false);
      setEditingGroup(null);
    } catch (err) {
      console.error('Error updating group:', err);
      setSnackbar({ open: true, message: 'Failed to update group. Please try again.', severity: 'error' });
    }
  };

  const handleDeleteGroup = async (group: Group) => {
    const ok = window.confirm(`Delete "${group.name}"? This cannot be undone.`);
    if (!ok) return;

    try {
      await communityService.deleteGroup(group.id);
      setGroups(prev => prev.filter(g => g.id !== group.id));
      setSnackbar({ open: true, message: 'Group deleted successfully!', severity: 'success' });
    } catch (err) {
      console.error('Error deleting group:', err);
      setSnackbar({ open: true, message: 'Failed to delete group. Please try again.', severity: 'error' });
    }
  };

  const handleOpenGroupChat = async (group: Group) => {
    try {
      if (!group.is_joined) {
        setSnackbar({ open: true, message: 'Join this group first to start chatting.', severity: 'error' });
        return;
      }

      const chat = await communityService.getOrCreateGroupChatConversation(group.id);
      navigate('/techie/chat', {
        state: {
          startGroupChat: {
            conversationId: chat.conversation_id,
            groupId: group.id,
            groupName: group.name,
          },
        },
      });
    } catch (err) {
      console.error('Error opening group chat:', err);
      setSnackbar({ open: true, message: 'Failed to open group chat. Please try again.', severity: 'error' });
    }
  };

  // Filter groups by category
  const filteredGroups = selectedCategory === 'All' 
    ? groups 
    : groups.filter(g => (g.category || '').toLowerCase() === selectedCategory.toLowerCase());

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
            <GroupCard
              onClick={() => handleOpenGroupChat(group)}
              sx={{ cursor: group.is_joined ? 'pointer' : 'default' }}
            >
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
                  {group.can_edit && (
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditGroup(group);
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  {group.can_delete && (
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(group);
                      }}
                    >
                      Delete
                    </Button>
                  )}
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
                  {group.membership_role === 'owner' || group.created_by_id === currentUserId ? (
                    <Chip label="Owner" size="small" color="primary" variant="outlined" />
                  ) : (
                    <Button 
                      variant={group.is_joined ? 'outlined' : 'contained'}
                      size="small"
                      sx={{ borderRadius: 2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (group.is_joined) handleLeaveGroup(group.id);
                        else handleJoinGroup(group.id);
                      }}
                    >
                      {group.is_joined ? 'Joined' : 'Join'}
                    </Button>
                  )}
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

      {/* Edit Group Dialog */}
      <Dialog
        open={editGroupDialogOpen}
        onClose={() => setEditGroupDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Edit Group</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Group Name"
            value={editGroupData.name}
            onChange={(e) => setEditGroupData({ ...editGroupData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={editGroupData.description}
            onChange={(e) => setEditGroupData({ ...editGroupData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Privacy</InputLabel>
            <Select
              value={editGroupData.privacy}
              label="Privacy"
              onChange={(e) => setEditGroupData({ ...editGroupData, privacy: e.target.value })}
            >
              <MenuItem value="public">Public - Anyone can join</MenuItem>
              <MenuItem value="private">Private - Requires approval</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditGroupDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdateGroup}
            disabled={!editGroupData.name.trim() || !editGroupData.description.trim()}
            sx={{ borderRadius: 2 }}
          >
            Save Changes
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
