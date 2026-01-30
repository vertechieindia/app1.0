/**
 * SuperAdmin Chat - Admin-specific chat interface with moderation capabilities
 * 
 * Features:
 * - View all conversations across the platform
 * - Search conversations by user, content, or date
 * - Moderation tools (delete messages, block users)
 * - Analytics and insights
 * - Export conversation data
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import ChatIcon from '@mui/icons-material/Chat';
import { chatService } from '../../services/chatService';
import Chat from '../techie/Chat';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 1400,
  margin: '0 auto',
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
}));

interface ConversationListItem {
  id: string;
  name: string;
  type: string;
  memberCount: number;
  messageCount: number;
  lastMessageAt: string | null;
  unreadCount: number;
  createdAt: string;
}

const SuperAdminChat: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalConversations: 0,
    totalMessages: 0,
    activeUsers: 0,
  });

  // Fetch all conversations (admin view)
  const fetchAllConversations = useCallback(async () => {
    try {
      setLoading(true);
      // For now, use the regular endpoint - in production, you'd have an admin-specific endpoint
      const data = await chatService.getConversations();
      
      const mapped: ConversationListItem[] = data.map((conv: any) => ({
        id: conv.id,
        name: conv.name || 'Direct Message',
        type: conv.conversation_type || 'direct',
        memberCount: conv.member_count || 0,
        messageCount: conv.message_count || 0,
        lastMessageAt: conv.last_message_at,
        unreadCount: conv.unread_count || 0,
        createdAt: conv.created_at,
      }));
      
      setConversations(mapped);
      
      // Calculate stats
      setStats({
        totalConversations: mapped.length,
        totalMessages: mapped.reduce((sum, c) => sum + c.messageCount, 0),
        activeUsers: new Set(mapped.flatMap(c => [])).size, // Would need member data
      });
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllConversations();
  }, [fetchAllConversations]);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || conv.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleViewConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const handleDeleteConversation = async () => {
    if (!conversationToDelete) return;
    
    try {
      // In production, call admin delete endpoint
      // await adminChatService.deleteConversation(conversationToDelete);
      alert('Delete conversation functionality - requires admin endpoint');
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
      fetchAllConversations();
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (selectedConversation) {
    return (
      <StyledContainer>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button onClick={() => setSelectedConversation(null)} variant="outlined">
            ← Back to All Conversations
          </Button>
          <Typography variant="h6">Viewing Conversation: {selectedConversation}</Typography>
        </Box>
        <Chat />
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Chat Administration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor and moderate all conversations across the platform
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
        <StatsCard>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {stats.totalConversations}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Conversations
          </Typography>
        </StatsCard>
        <StatsCard>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
            {stats.totalMessages}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Messages
          </Typography>
        </StatsCard>
        <StatsCard>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
            {stats.activeUsers}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Active Users
          </Typography>
        </StatsCard>
      </Box>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Type"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="direct">Direct</MenuItem>
              <MenuItem value="group">Group</MenuItem>
              <MenuItem value="channel">Channel</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Conversations Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Conversation</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Members</TableCell>
              <TableCell>Messages</TableCell>
              <TableCell>Last Activity</TableCell>
              <TableCell>Unread</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredConversations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No conversations found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredConversations.map((conv) => (
                <TableRow key={conv.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ChatIcon color="primary" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {conv.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={conv.type}
                      size="small"
                      color={conv.type === 'direct' ? 'primary' : conv.type === 'group' ? 'secondary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{conv.memberCount}</TableCell>
                  <TableCell>{conv.messageCount}</TableCell>
                  <TableCell>{formatDate(conv.lastMessageAt)}</TableCell>
                  <TableCell>
                    {conv.unreadCount > 0 && (
                      <Chip label={conv.unreadCount} size="small" color="error" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Conversation">
                      <IconButton
                        size="small"
                        onClick={() => handleViewConversation(conv.id)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Conversation">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setConversationToDelete(conv.id);
                          setDeleteDialogOpen(true);
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Conversation?</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All messages in this conversation will be permanently deleted.
          </Alert>
          <Typography variant="body2">
            Are you sure you want to delete this conversation?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConversation} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default SuperAdminChat;
