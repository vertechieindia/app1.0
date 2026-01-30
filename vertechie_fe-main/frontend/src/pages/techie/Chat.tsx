/**
 * Chat - Real-time Messaging Interface with Group Chat Support
 * 
 * Features:
 * - Direct Messages (DM) and Group Chats
 * - Admin controls for groups (message permissions)
 * - Polls, images, documents, links, GIFs, emojis
 * - Notification preferences
 * - Real-time messaging with status indicators
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { chatService } from '../../services/chatService';
import { chatWebSocket, WebSocketMessage } from '../../services/chatWebSocket';
import { getApiUrl } from '../../config/api';
import { fetchWithAuth } from '../../utils/apiInterceptor';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  AvatarGroup,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  LinearProgress,
  Popover,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemSecondaryAction,
  CircularProgress,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';
import PollIcon from '@mui/icons-material/Poll';
import GifIcon from '@mui/icons-material/Gif';
import LinkIcon from '@mui/icons-material/Link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// Styled Components
const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 150px)',
  backgroundColor: '#f5f7fa',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  [theme.breakpoints.down('md')]: {
    height: 'calc(100vh - 180px)',
    borderRadius: 0,
  },
}));

const ConversationList = styled(Box)(({ theme }) => ({
  width: 360,
  borderRight: '1px solid #e0e0e0',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const ChatArea = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f0f2f5',
});

const MessageContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

const MessageBubble = styled(Box)<{ isSent?: boolean }>(({ isSent }) => ({
  maxWidth: '70%',
  padding: '10px 14px',
  borderRadius: isSent ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  backgroundColor: isSent ? '#0d47a1' : 'white',
  color: isSent ? 'white' : '#1a1a1a',
  alignSelf: isSent ? 'flex-end' : 'flex-start',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  position: 'relative',
}));

const OnlineBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': { transform: 'scale(.8)', opacity: 1 },
    '100%': { transform: 'scale(2.4)', opacity: 0 },
  },
}));

const GroupAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: '#6c5ce7',
  width: 48,
  height: 48,
}));

const PollOption = styled(Box)<{ voted?: boolean; percentage: number }>(({ voted, percentage }) => ({
  position: 'relative',
  padding: '10px 14px',
  borderRadius: 8,
  border: voted ? '2px solid #0d47a1' : '1px solid #e0e0e0',
  marginBottom: 8,
  cursor: 'pointer',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: `${percentage}%`,
    backgroundColor: voted ? alpha('#0d47a1', 0.15) : alpha('#e0e0e0', 0.3),
    transition: 'width 0.3s ease',
  },
  '&:hover': {
    borderColor: '#0d47a1',
  },
}));

// Emoji Picker Data
const emojiList = ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '👏', '🎉', '🔥', '❤️', '💯', '🚀', '💻', '☕', '🙏', '✨', '💪', '🤝', '👋'];

// GIF categories
const gifCategories = ['Trending', 'Reactions', 'Celebrate', 'Thanks', 'Yes', 'No', 'Love', 'Sad'];

// Sample GIFs (using GIPHY URLs - these are real animated GIFs)
const sampleGifs = [
  { id: '1', url: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif', preview: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200w.gif' },
  { id: '2', url: 'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif', preview: 'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/200w.gif' },
  { id: '3', url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', preview: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/200w.gif' },
  { id: '4', url: 'https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif', preview: 'https://media.giphy.com/media/3oz8xIsloV7zOmt81G/200w.gif' },
  { id: '5', url: 'https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif', preview: 'https://media.giphy.com/media/l3q2K5jinAlChoCLS/200w.gif' },
  { id: '6', url: 'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif', preview: 'https://media.giphy.com/media/26u4cqiYI30juCOGY/200w.gif' },
  { id: '7', url: 'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif', preview: 'https://media.giphy.com/media/g9582DNuQppxC/200w.gif' },
  { id: '8', url: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif', preview: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/200w.gif' },
  { id: '9', url: 'https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif', preview: 'https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/200w.gif' },
];

// Types
interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName?: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  type: 'text' | 'image' | 'file' | 'poll' | 'gif' | 'link' | 'document';
  fileUrl?: string;
  fileName?: string;
  poll?: Poll;
  replyTo?: string;
  reactions?: Record<string, string[]>;
}

interface Poll {
  id: string;
  question: string;
  options: PollOptionType[];
  totalVotes: number;
  multipleChoice: boolean;
  anonymous: boolean;
  endsAt?: Date;
}

/** Parse API timestamp as UTC when no timezone (backend stores UTC; missing Z causes wrong local time). */
function parseUtcDate(isoString: string | null | undefined): Date {
  if (!isoString) return new Date();
  const s = String(isoString).trim();
  if (!s) return new Date();
  if (/Z|[+-]\d{2}:?\d{2}$/.test(s)) return new Date(s);
  return new Date(s + 'Z');
}

interface PollOptionType {
  id: string;
  text: string;
  votes: number;
  votedByMe: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  isTyping?: boolean;
  isGroup: boolean;
  members?: GroupMember[];
  groupSettings?: GroupSettings;
  notificationsMuted?: boolean;
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  isAdmin: boolean;
  isOnline: boolean;
}

interface GroupSettings {
  onlyAdminsCanMessage: boolean;
  onlyAdminsCanEditInfo: boolean;
  onlyAdminsCanAddMembers: boolean;
}

// Mock Data
const mockMembers: GroupMember[] = [
  { id: '1', name: 'You', avatar: '', isAdmin: true, isOnline: true },
  { id: '2', name: 'Sarah Johnson', avatar: '', isAdmin: true, isOnline: true },
  { id: '3', name: 'Mike Chen', avatar: '', isAdmin: false, isOnline: true },
  { id: '4', name: 'Emily Davis', avatar: '', isAdmin: false, isOnline: false },
  { id: '5', name: 'Alex Turner', avatar: '', isAdmin: false, isOnline: false },
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '',
    lastMessage: 'Thanks for the code review feedback!',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 2,
    isOnline: true,
    isGroup: false,
  },
  {
    id: 'g1',
    name: 'Tech Team',
    avatar: '',
    lastMessage: 'Mike: Sprint planning at 2 PM',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    unreadCount: 5,
    isOnline: true,
    isGroup: true,
    members: mockMembers,
    groupSettings: {
      onlyAdminsCanMessage: false,
      onlyAdminsCanEditInfo: true,
      onlyAdminsCanAddMembers: false,
    },
  },
  {
    id: 'g2',
    name: 'Frontend Developers',
    avatar: '',
    lastMessage: 'New React 19 features discussion',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 0,
    isOnline: true,
    isGroup: true,
    members: mockMembers.slice(0, 3),
    groupSettings: {
      onlyAdminsCanMessage: false,
      onlyAdminsCanEditInfo: true,
      onlyAdminsCanAddMembers: true,
    },
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: '',
    lastMessage: 'The deployment went smoothly 🚀',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    unreadCount: 0,
    isOnline: true,
    isGroup: false,
  },
  {
    id: 'g3',
    name: 'Announcements',
    avatar: '',
    lastMessage: 'Admin: Company holiday schedule',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 1,
    isOnline: true,
    isGroup: true,
    members: mockMembers,
    groupSettings: {
      onlyAdminsCanMessage: true, // Only admins can send messages
      onlyAdminsCanEditInfo: true,
      onlyAdminsCanAddMembers: true,
    },
  },
  {
    id: '3',
    name: 'Emily Davis',
    avatar: '',
    lastMessage: 'Can you share the API docs?',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    unreadCount: 1,
    isOnline: false,
    isGroup: false,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hey team! How\'s the new feature coming along?',
    senderId: 'other',
    senderName: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    status: 'read',
    type: 'text',
  },
  {
    id: '2',
    text: 'Going great! Just finished the authentication module.',
    senderId: 'me',
    timestamp: new Date(Date.now() - 55 * 60 * 1000),
    status: 'read',
    type: 'text',
  },
  {
    id: '3',
    text: '',
    senderId: 'other',
    senderName: 'Mike Chen',
    timestamp: new Date(Date.now() - 50 * 60 * 1000),
    status: 'read',
    type: 'poll',
    poll: {
      id: 'poll1',
      question: 'When should we schedule the code review?',
      options: [
        { id: 'o1', text: 'Monday 10 AM', votes: 3, votedByMe: true },
        { id: 'o2', text: 'Tuesday 2 PM', votes: 2, votedByMe: false },
        { id: 'o3', text: 'Wednesday 11 AM', votes: 1, votedByMe: false },
      ],
      totalVotes: 6,
      multipleChoice: false,
      anonymous: false,
    },
  },
  {
    id: '4',
    text: 'Sure, I\'ll do it right now. Also added some unit tests.',
    senderId: 'me',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    status: 'read',
    type: 'text',
  },
  {
    id: '5',
    text: 'Perfect! Thanks for the code review feedback! 🚀',
    senderId: 'other',
    senderName: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: 'delivered',
    type: 'text',
  },
];

const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0: All, 1: Direct, 2: Groups

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialogs
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showCreatePoll, setShowCreatePoll] = useState(false);

  // Users for new chat
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Attachment popover
  const [attachAnchor, setAttachAnchor] = useState<null | HTMLElement>(null);
  const [emojiAnchor, setEmojiAnchor] = useState<null | HTMLElement>(null);
  const [gifAnchor, setGifAnchor] = useState<null | HTMLElement>(null);

  // Create group form
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupAdminOnly, setGroupAdminOnly] = useState(false);

  // Poll form
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollMultipleChoice, setPollMultipleChoice] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // File upload states
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showGifSearch, setShowGifSearch] = useState(false);
  const [gifSearchQuery, setGifSearchQuery] = useState('');

  // WebSocket and polling states
  const [wsConnected, setWsConnected] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch users for new chat
  const fetchUsers = useCallback(async (search?: string) => {
    try {
      setLoadingUsers(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('limit', '50');

      const response = await fetchWithAuth(getApiUrl(`/users/?${params.toString()}`));
      if (response.ok) {
        const data = await response.json();
        const currentUserId = JSON.parse(localStorage.getItem('userData') || '{}').id;
        // Filter out current user
        const filteredUsers = data.filter((user: any) => user.id !== currentUserId);
        setAvailableUsers(filteredUsers);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Create new direct message conversation
  const handleCreateNewChat = async (userId: string, userName: string) => {
    try {
      const data = await chatService.createConversation({
        type: 'direct',
        member_ids: [userId],
      });

      // Ensure conversation ID is a valid UUID string
      const conversationId = typeof data.id === 'string' ? data.id : String(data.id);

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(conversationId)) {
        console.error('Invalid conversation ID format:', conversationId);
        console.error('Full response data:', data);
        setError('Invalid conversation ID received from server');
        return;
      }

      // Map backend response to local format
      const mappedConv: Conversation = {
        id: conversationId,
        name: userName,
        avatar: (data as any).avatar_url || '',
        lastMessage: (data as any).last_message_preview || '',
        timestamp: parseUtcDate((data as any).created_at),
        isGroup: (data as any).type === 'group' || (data as any).type === 'channel',
        unreadCount: (data as any).unread_count || 0,
        isOnline: false,
        members: [],
      };

      // Add to conversations list
      setConversations(prev => {
        // Check if already exists
        const exists = prev.find(c => c.id === conversationId);
        if (exists) {
          return prev.map(c => c.id === conversationId ? mappedConv : c);
        }
        return [mappedConv, ...prev];
      });

      setSelectedConversation(mappedConv);
      setShowNewChat(false);
      setUserSearchQuery('');
    } catch (err: any) {
      console.error('Error creating new chat:', err);
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to create conversation';
      setError(errorMessage);

      // Log full error for debugging
      if (err?.response) {
        console.error('API Error Response:', err.response.data);
        console.error('Status:', err.response.status);
      }
    }
  };

  // Fetch conversations from API
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rawData = await chatService.getConversations();
      // Handle both paginated and array response
      const data = Array.isArray(rawData) ? rawData : (rawData && (rawData as any).items) || [];

      const userDataStr = localStorage.getItem('userData');
      const currentUserId = userDataStr ? JSON.parse(userDataStr).id : null;

      // Map API response to local Conversation type
      const mappedConversations: Conversation[] = data.map((conv: any) => {
        // If it's a direct message and name is null, find the other member's name
        let name = conv.name;
        if (!name && (conv.type === 'direct' || !conv.is_group)) {
          // Try to find recipient from members or other_member field if available
          const otherMember = (conv.members || []).find((m: any) => m.id !== currentUserId) || conv.other_member || conv.participant;
          if (otherMember) {
            name = otherMember.name || `${otherMember.first_name || ''} ${otherMember.last_name || ''}`.trim() || otherMember.email || otherMember.username;
          }
        }

        return {
          id: conv.id,
          name: name || 'Direct Message',
          avatar: conv.avatar_url || '',
          lastMessage: conv.last_message_preview || '',
          timestamp: parseUtcDate(conv.last_message_at),
          unreadCount: conv.unread_count || 0,
          isOnline: conv.is_online || false,
          isGroup: conv.type === 'group' || conv.type === 'channel',
          members: conv.members || [],
          groupSettings: conv.type === 'group' ? {
            onlyAdminsCanMessage: false,
            onlyAdminsCanEditInfo: false,
            onlyAdminsCanAddMembers: false,
            notifications: true,
          } : undefined,
        };
      });
      setConversations(mappedConversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);


  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setLoadingMessages(true);

      // Validate UUID format before making API call
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(conversationId)) {
        console.error('Invalid conversation ID format:', conversationId);
        setError('Invalid conversation ID');
        setLoadingMessages(false);
        return;
      }

      const data = await chatService.getMessages(conversationId, { limit: 50 });
      const currentUserId = JSON.parse(localStorage.getItem('userData') || '{}').id;
      // Map API response to local Message type
      const mappedMessages: Message[] = data.map((msg: any) => ({
        id: msg.id,
        text: msg.content || '',
        senderId: msg.sender_id === currentUserId ? 'me' : 'other',
        senderName: msg.sender?.first_name || 'User',
        timestamp: parseUtcDate(msg.created_at),
        status: 'delivered',
        type: msg.message_type || 'text',
        fileUrl: msg.media_url,
        fileName: msg.media_name,
        reactions: msg.reactions || {},
        poll: msg.poll_data ? {
          id: `poll-${msg.id}`,
          question: msg.poll_data.question || '',
          options: (msg.poll_data.options || []).map((opt: string, idx: number) => ({
            id: `o${idx}`,
            text: opt,
            votes: (msg.poll_data.votes || {})[idx] || 0,
            votedByMe: false,
          })),
          totalVotes: Object.values(msg.poll_data.votes || {}).reduce((sum: number, v: any) => sum + (Array.isArray(v) ? v.length : 0), 0),
          multipleChoice: msg.poll_data.allow_multiple || false,
          anonymous: false,
        } : undefined,
      }));
      // Reverse to show oldest first
      setMessages(mappedMessages.reverse());

      // Mark conversation as read (only if conversationId is a valid UUID)
      try {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(conversationId)) {
          await chatService.markConversationRead(conversationId);
          // Update local unread count
          setConversations(prev => prev.map(c =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          ));
        }
      } catch (err) {
        console.error('Error marking conversation as read:', err);
        // Don't fail the whole operation if mark-read fails
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch users when new chat dialog opens
  useEffect(() => {
    if (showNewChat) {
      fetchUsers();
    }
  }, [showNewChat, fetchUsers]);

  // WebSocket connection and message handling
  useEffect(() => {
    if (!selectedConversation) {
      // Disconnect WebSocket if no conversation selected
      chatWebSocket.disconnect();
      setWsConnected(false);
      // Stop polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    const conversationId = selectedConversation.id;
    const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');

    if (!token) {
      console.error('No auth token available for WebSocket connection');
      return;
    }

    // Validate UUID format before connecting WebSocket
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(conversationId)) {
      console.error('Invalid conversation ID format for WebSocket:', conversationId);
      setError('Invalid conversation ID');
      return;
    }

    // Connect WebSocket
    chatWebSocket.connect(conversationId, token);

    // Set up WebSocket message handlers
    const unsubscribeMessage = chatWebSocket.onMessage((wsMessage: WebSocketMessage) => {
      if (wsMessage.conversation_id !== conversationId) {
        return; // Message for different conversation
      }

      switch (wsMessage.type) {
        case 'connected':
          setWsConnected(true);
          // Stop polling when WebSocket connects
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          break;

        case 'new_message':
          if (wsMessage.message) {
            const currentUserId = JSON.parse(localStorage.getItem('userData') || '{}').id;
            const newMessage: Message = {
              id: wsMessage.message.id,
              text: wsMessage.message.content || '',
              senderId: wsMessage.message.sender_id === currentUserId ? 'me' : 'other',
              senderName: wsMessage.message.sender_name || 'User',
              timestamp: parseUtcDate(wsMessage.message.created_at),
              status: 'delivered',
              type: wsMessage.message.message_type || 'text',
              fileUrl: wsMessage.message.media_url,
              fileName: wsMessage.message.media_name,
              reactions: wsMessage.message.reactions || {},
              poll: wsMessage.message.poll_data ? {
                id: `poll-${wsMessage.message.id}`,
                question: wsMessage.message.poll_data.question || '',
                options: (wsMessage.message.poll_data.options || []).map((opt: string, idx: number) => ({
                  id: `o${idx}`,
                  text: opt,
                  votes: (wsMessage.message.poll_data.votes || {})[idx] || 0,
                  votedByMe: false,
                })),
                totalVotes: Object.values(wsMessage.message.poll_data.votes || {}).reduce((sum: number, v: any) => sum + (Array.isArray(v) ? v.length : 0), 0),
                multipleChoice: wsMessage.message.poll_data.allow_multiple || false,
                anonymous: false,
              } : undefined,
            };
            setMessages(prev => {
              // Check if message with this ID already exists
              if (prev.find(m => m.id === wsMessage.message.id)) {
                return prev;
              }
              return [...prev, newMessage];
            });
            scrollToBottom();

            // Update conversation last message
            setConversations(prev => prev.map(c =>
              c.id === conversationId
                ? {
                  ...c,
                  lastMessage: newMessage.text,
                  timestamp: newMessage.timestamp,
                  unreadCount: (selectedConversation && selectedConversation.id === conversationId)
                    ? 0
                    : (c.unreadCount || 0) + 1
                }
                : c
            ));

            // Notify BottomNav to refresh global unread count
            window.dispatchEvent(new CustomEvent('chat-message-received'));
          }
          break;

        case 'message_edited':
          if (wsMessage.message) {
            setMessages(prev => prev.map(m =>
              m.id === wsMessage.message.id
                ? { ...m, text: wsMessage.message.content, status: 'delivered' as const }
                : m
            ));
          }
          break;

        case 'message_deleted':
          if (wsMessage.message_id) {
            setMessages(prev => prev.filter(m => m.id !== wsMessage.message_id));
          }
          break;

        case 'typing':
          // Handle typing indicators
          setConversations(prev => prev.map(c =>
            c.id === conversationId
              ? { ...c, isTyping: wsMessage.is_typing }
              : c
          ));
          break;
      }
    });

    const unsubscribeConnect = chatWebSocket.onConnect(() => {
      setWsConnected(true);
    });

    const unsubscribeDisconnect = chatWebSocket.onDisconnect(() => {
      setWsConnected(false);
      // Start polling fallback when WebSocket disconnects
      if (!pollingIntervalRef.current) {
        pollingIntervalRef.current = setInterval(() => {
          fetchMessages(conversationId);
        }, 5000); // Poll every 5 seconds
      }
    });

    const unsubscribeError = chatWebSocket.onError(() => {
      setWsConnected(false);
      // Start polling fallback on error
      if (!pollingIntervalRef.current) {
        pollingIntervalRef.current = setInterval(() => {
          fetchMessages(conversationId);
        }, 5000);
      }
    });

    // Load messages
    fetchMessages(conversationId);

    // Cleanup
    return () => {
      unsubscribeMessage();
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeError();
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [selectedConversation, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!selectedConversation) return;
    if (selectedConversation?.isGroup &&
      selectedConversation.groupSettings?.onlyAdminsCanMessage &&
      !isCurrentUserAdmin()) {
      return; // Can't send if only admins can message
    }

    const messageText = newMessage.trim();
    const tempId = Date.now().toString();

    // Optimistic update - show message immediately
    const message: Message = {
      id: tempId,
      text: messageText,
      senderId: 'me',
      timestamp: new Date(),
      status: 'sending',
      type: 'text',
    };

    setMessages([...messages, message]);
    setNewMessage('');

    try {
      // Validate conversation ID before sending
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(selectedConversation.id)) {
        console.error('Invalid conversation ID format:', selectedConversation.id);
        setMessages(prev =>
          prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m)
        );
        return;
      }

      // Send to API
      const data = await chatService.sendMessage(selectedConversation.id, {
        message_type: 'text',
        content: messageText,
      });

      // Update message with real ID and status
      // But first check if it's already been added by WebSocket
      setMessages(prev => {
        const alreadyAdded = prev.find(m => m.id === data.id);
        if (alreadyAdded) {
          // Remove the temp message if the real one is already there
          return prev.filter(m => m.id !== tempId);
        }
        // Otherwise update the temp message
        return prev.map(m => m.id === tempId ? { ...m, id: data.id, status: 'delivered' } : m);
      });

      // Update conversation last message
      setConversations(prev => prev.map(c =>
        c.id === selectedConversation.id
          ? { ...c, lastMessage: messageText, timestamp: new Date() }
          : c
      ));

      scrollToBottom();
    } catch (err) {
      console.error('Error sending message:', err);
      // Mark as failed
      setMessages(prev =>
        prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m)
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Typing indicator handlers
  const handleTypingStart = useCallback(() => {
    if (chatWebSocket.isConnected()) {
      chatWebSocket.sendTypingStart();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (chatWebSocket.isConnected()) {
        chatWebSocket.sendTypingStop();
      }
    }, 3000);
  }, []);

  const handleTypingStop = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (chatWebSocket.isConnected()) {
      chatWebSocket.sendTypingStop();
    }
  }, []);

  const handleMessageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim()) {
      handleTypingStart();
    } else {
      handleTypingStop();
    }
  };

  const isCurrentUserAdmin = () => {
    return selectedConversation?.members?.find(m => m.id === '1')?.isAdmin ?? false;
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || selectedMembers.length === 0) return;

    try {
      const data = await chatService.createConversation({
        type: 'group',
        name: newGroupName,
        member_ids: selectedMembers,
      });

      // Fetch updated conversations list
      await fetchConversations();

      setShowCreateGroup(false);
      setNewGroupName('');
      setSelectedMembers([]);
      setGroupAdminOnly(false);
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Failed to create group');
    }
  };

  const handleCreatePoll = async () => {
    if (!pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2 || !selectedConversation) return;

    const pollData = {
      question: pollQuestion,
      options: pollOptions.filter(o => o.trim()),
      allow_multiple: pollMultipleChoice,
    };

    try {
      await chatService.sendMessage(selectedConversation.id, {
        message_type: 'poll',
        content: pollQuestion,
        poll_data: pollData,
      });

      setShowCreatePoll(false);
      setPollQuestion('');
      setPollOptions(['', '']);
      setPollMultipleChoice(false);

      // Messages will be updated via WebSocket/polling
    } catch (err) {
      console.error('Error creating poll:', err);
      setError('Failed to create poll');
    }
  };

  const handleVotePoll = (pollId: string, optionId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.poll?.id === pollId) {
        const updatedOptions = m.poll.options.map(o => ({
          ...o,
          votes: o.id === optionId ? o.votes + 1 : o.votes,
          votedByMe: o.id === optionId ? true : (m.poll!.multipleChoice ? o.votedByMe : false),
        }));
        return {
          ...m,
          poll: {
            ...m.poll,
            options: updatedOptions,
            totalVotes: m.poll.totalVotes + 1,
          },
        };
      }
      return m;
    }));
  };

  const handleInsertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setEmojiAnchor(null);
  };

  // File upload handlers
  const handleImageUpload = () => {
    setAttachAnchor(null);
    imageInputRef.current?.click();
  };

  const handleDocumentUpload = () => {
    setAttachAnchor(null);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    const file = event.target.files?.[0];
    if (!file || !selectedConversation) return;

    setUploadingFile(true);

    try {
      // Upload file to backend using service
      const uploadData = await chatService.uploadFile(file);

      // Send message with file
      const messageData: any = {
        message_type: uploadData.media_type || type,
        content: type === 'image' ? `📷 ${file.name}` : `📄 ${file.name}`,
        media_url: uploadData.url,
        media_type: uploadData.type,
        media_name: uploadData.name,
      };

      await chatService.sendMessage(selectedConversation.id, messageData);

      // Messages will be updated via WebSocket/polling automatically
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file');
    } finally {
      setUploadingFile(false);
      // Reset input
      if (event.target) event.target.value = '';
    }
  };

  const handleSendLink = async () => {
    if (!linkUrl.trim() || !selectedConversation) return;

    try {
      await chatService.sendMessage(selectedConversation.id, {
        message_type: 'link',
        content: linkUrl,
      });
      setLinkUrl('');
      setShowLinkDialog(false);
    } catch (err) {
      console.error('Error sending link:', err);
      setError('Failed to send link');
    }
  };

  const handleSendGif = async (gifUrl: string) => {
    if (!selectedConversation) return;

    try {
      await chatService.sendMessage(selectedConversation.id, {
        message_type: 'gif',
        content: 'GIF Image',
        media_url: gifUrl,
      });
      setGifAnchor(null);
    } catch (err) {
      console.error('Error sending GIF:', err);
      setError('Failed to send GIF');
    }
  };

  const handleToggleNotifications = () => {
    if (selectedConversation) {
      setConversations(prev => prev.map(c =>
        c.id === selectedConversation.id
          ? { ...c, notificationsMuted: !c.notificationsMuted }
          : c
      ));
      setSelectedConversation(prev => prev ? { ...prev, notificationsMuted: !prev.notificationsMuted } : null);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (tabValue === 1) return matchesSearch && !c.isGroup;
    if (tabValue === 2) return matchesSearch && c.isGroup;
    return matchesSearch;
  });

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) setShowMobileChat(true);
  };

  // Render Poll Component
  const renderPoll = (poll: Poll) => (
    <Box sx={{ minWidth: 280 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <PollIcon sx={{ color: '#0d47a1' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Poll
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
        {poll.question}
      </Typography>
      {poll.options.map((option) => {
        const percentage = poll.totalVotes > 0
          ? Math.round((option.votes / poll.totalVotes) * 100)
          : 0;
        return (
          <PollOption
            key={option.id}
            voted={option.votedByMe}
            percentage={percentage}
            onClick={() => handleVotePoll(poll.id, option.id)}
          >
            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">{option.text}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{percentage}%</Typography>
            </Box>
          </PollOption>
        );
      })}
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {poll.totalVotes} votes
      </Typography>
    </Box>
  );

  const renderConversationList = () => (
    <ConversationList>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
            Messages
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="New Chat">
              <IconButton onClick={() => setShowNewChat(true)} sx={{ bgcolor: alpha('#0d47a1', 0.1) }}>
                <PersonAddIcon sx={{ color: '#0d47a1' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Create Group">
              <IconButton onClick={() => setShowCreateGroup(true)} sx={{ bgcolor: alpha('#0d47a1', 0.1) }}>
                <GroupAddIcon sx={{ color: '#0d47a1' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <TextField
          fullWidth
          size="small"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 3, bgcolor: '#f5f7fa', '& fieldset': { border: 'none' } },
          }}
        />

        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{ mt: 2, minHeight: 36 }}
          TabIndicatorProps={{ sx: { height: 3, borderRadius: 2 } }}
        >
          <Tab label="All" sx={{ minHeight: 36, fontSize: '0.8rem', textTransform: 'none' }} />
          <Tab label="Direct" sx={{ minHeight: 36, fontSize: '0.8rem', textTransform: 'none' }} />
          <Tab label="Groups" sx={{ minHeight: 36, fontSize: '0.8rem', textTransform: 'none' }} />
        </Tabs>
      </Box>

      {/* Conversation List */}
      <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
        {filteredConversations.map((conversation) => (
          <ListItem
            key={conversation.id}
            onClick={() => handleSelectConversation(conversation)}
            sx={{
              cursor: 'pointer',
              bgcolor: selectedConversation?.id === conversation.id ? alpha('#0d47a1', 0.1) : 'transparent',
              borderLeft: selectedConversation?.id === conversation.id ? '3px solid #0d47a1' : '3px solid transparent',
              '&:hover': { bgcolor: alpha('#0d47a1', 0.05) },
              py: 1.5,
            }}
          >
            <ListItemAvatar>
              {conversation.isGroup ? (
                <GroupAvatar>
                  <GroupIcon />
                </GroupAvatar>
              ) : conversation.isOnline ? (
                <OnlineBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                  <Avatar sx={{ bgcolor: '#0d47a1', width: 48, height: 48 }}>
                    {conversation.name.charAt(0)}
                  </Avatar>
                </OnlineBadge>
              ) : (
                <Avatar sx={{ bgcolor: '#9e9e9e', width: 48, height: 48 }}>
                  {conversation.name.charAt(0)}
                </Avatar>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: conversation.unreadCount > 0 ? 700 : 500 }}>
                      {conversation.name}
                    </Typography>
                    {conversation.isGroup && conversation.groupSettings?.onlyAdminsCanMessage && (
                      <Tooltip title="Only admins can message">
                        <LockIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      </Tooltip>
                    )}
                    {conversation.notificationsMuted && (
                      <NotificationsOffIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {formatTime(conversation.timestamp)}
                  </Typography>
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: conversation.unreadCount > 0 ? 'text.primary' : 'text.secondary',
                      fontWeight: conversation.unreadCount > 0 ? 600 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: 180,
                    }}
                  >
                    {conversation.isTyping ? (
                      <span style={{ color: '#0d47a1', fontStyle: 'italic' }}>Typing...</span>
                    ) : (
                      conversation.lastMessage
                    )}
                  </Typography>
                  {conversation.unreadCount > 0 && (
                    <Chip
                      label={conversation.unreadCount}
                      size="small"
                      sx={{ height: 20, minWidth: 20, bgcolor: '#0d47a1', color: 'white', fontWeight: 700, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </ConversationList>
  );

  const renderChatArea = () => (
    <ChatArea>
      {selectedConversation ? (
        <>
          {/* Chat Header */}
          <Box sx={{ p: 2, bgcolor: 'white', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton onClick={() => setShowMobileChat(false)}>
                <ArrowBackIcon />
              </IconButton>
            )}

            {selectedConversation.isGroup ? (
              <GroupAvatar sx={{ cursor: 'pointer' }} onClick={() => setShowGroupInfo(true)}>
                <GroupIcon />
              </GroupAvatar>
            ) : (
              <OnlineBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" invisible={!selectedConversation.isOnline}>
                <Avatar sx={{ bgcolor: '#0d47a1' }}>
                  {selectedConversation.name.charAt(0)}
                </Avatar>
              </OnlineBadge>
            )}

            <Box sx={{ flex: 1, cursor: selectedConversation.isGroup ? 'pointer' : 'default' }} onClick={() => selectedConversation.isGroup && setShowGroupInfo(true)}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {selectedConversation.name}
                </Typography>
                {selectedConversation.groupSettings?.onlyAdminsCanMessage && (
                  <Chip label="Admin Only" size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: alpha('#ff9800', 0.1), color: '#ff9800' }} />
                )}
              </Box>
              <Typography variant="caption" sx={{ color: selectedConversation.isOnline ? '#44b700' : 'text.secondary' }}>
                {selectedConversation.isGroup
                  ? `${selectedConversation.members?.length} members`
                  : selectedConversation.isOnline ? 'Online' : 'Offline'
                }
              </Typography>
            </Box>

            {!selectedConversation.isGroup && (
              <>
                <Tooltip title="Video Call">
                  <IconButton><VideocamIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Voice Call">
                  <IconButton><CallIcon /></IconButton>
                </Tooltip>
              </>
            )}

            <Tooltip title={selectedConversation.notificationsMuted ? "Unmute Notifications" : "Mute Notifications"}>
              <IconButton onClick={handleToggleNotifications}>
                {selectedConversation.notificationsMuted ? <NotificationsOffIcon /> : <NotificationsIcon />}
              </IconButton>
            </Tooltip>

            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>

            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
              {selectedConversation.isGroup ? (
                [
                  <MenuItem key="info" onClick={() => { setShowGroupInfo(true); setMenuAnchor(null); }}>
                    <InfoIcon sx={{ mr: 1 }} /> Group Info
                  </MenuItem>,
                  isCurrentUserAdmin() && (
                    <MenuItem key="settings" onClick={() => { setShowGroupSettings(true); setMenuAnchor(null); }}>
                      <SettingsIcon sx={{ mr: 1 }} /> Group Settings
                    </MenuItem>
                  ),
                  <MenuItem key="leave" onClick={() => setMenuAnchor(null)} sx={{ color: 'error.main' }}>
                    <ExitToAppIcon sx={{ mr: 1 }} /> Leave Group
                  </MenuItem>,
                ]
              ) : (
                [
                  <MenuItem key="profile" onClick={() => setMenuAnchor(null)}>
                    <InfoIcon sx={{ mr: 1 }} /> View Profile
                  </MenuItem>,
                  <MenuItem key="delete" onClick={() => setMenuAnchor(null)}>
                    <DeleteIcon sx={{ mr: 1 }} /> Delete Chat
                  </MenuItem>,
                  <MenuItem key="block" onClick={() => setMenuAnchor(null)} sx={{ color: 'error.main' }}>
                    <BlockIcon sx={{ mr: 1 }} /> Block User
                  </MenuItem>,
                ]
              )}
            </Menu>
          </Box>

          {/* Messages */}
          <MessageContainer>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.senderId === 'me' ? 'flex-end' : 'flex-start',
                }}
              >
                {selectedConversation.isGroup && message.senderId !== 'me' && message.senderName && (
                  <Typography variant="caption" sx={{ color: '#0d47a1', fontWeight: 600, mb: 0.5, ml: 1 }}>
                    {message.senderName}
                  </Typography>
                )}
                <MessageBubble isSent={message.senderId === 'me'} sx={message.type === 'gif' ? { p: 0.5, bgcolor: 'transparent', boxShadow: 'none' } : {}}>
                  {message.type === 'poll' && message.poll ? (
                    renderPoll(message.poll)
                  ) : message.type === 'gif' && message.fileUrl ? (
                    <Box sx={{ borderRadius: 2, overflow: 'hidden', maxWidth: 250 }}>
                      <img
                        src={message.fileUrl}
                        alt="GIF"
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                          borderRadius: 8,
                        }}
                      />
                    </Box>
                  ) : message.type === 'image' && message.fileUrl ? (
                    <Box sx={{ borderRadius: 2, overflow: 'hidden', maxWidth: 250 }}>
                      <img
                        src={message.fileUrl}
                        alt={message.fileName || 'Image'}
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                          borderRadius: 8,
                        }}
                      />
                      {message.fileName && (
                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                          {message.fileName}
                        </Typography>
                      )}
                    </Box>
                  ) : message.type === 'file' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InsertDriveFileIcon />
                      {message.fileUrl ? (
                        <Typography
                          variant="body2"
                          component="a"
                          href={message.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={message.fileName || undefined}
                          sx={{
                            color: message.senderId === 'me' ? 'white' : '#0d47a1',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {message.fileName || message.text || 'Download file'}
                        </Typography>
                      ) : (
                        <Typography variant="body2">{message.fileName || message.text}</Typography>
                      )}
                    </Box>
                  ) : message.type === 'link' || (message.type === 'text' && /^https?:\/\/\S+/i.test((message.text || '').replace('🔗 ', '').trim())) ? (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LinkIcon sx={{ fontSize: 16 }} />
                        <Typography
                          variant="body2"
                          component="a"
                          href={(message.text || '').replace('🔗 ', '').trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: message.senderId === 'me' ? 'white' : '#0d47a1',
                            textDecoration: 'underline',
                            wordBreak: 'break-all',
                          }}
                        >
                          {(message.text || '').replace('🔗 ', '').trim()}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body1">{message.text}</Typography>
                  )}
                </MessageBubble>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, px: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                  {message.senderId === 'me' && (
                    message.status === 'read' ? (
                      <DoneAllIcon sx={{ fontSize: 14, color: '#0d47a1' }} />
                    ) : message.status === 'delivered' ? (
                      <DoneAllIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    ) : (
                      <CheckIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    )
                  )}
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </MessageContainer>

          {/* Message Input */}
          {selectedConversation.isGroup && selectedConversation.groupSettings?.onlyAdminsCanMessage && !isCurrentUserAdmin() ? (
            <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <LockIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                Only admins can send messages in this group
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Attachment Menu */}
              <IconButton onClick={(e) => setAttachAnchor(e.currentTarget)}>
                <AddIcon />
              </IconButton>
              <Popover
                open={Boolean(attachAnchor)}
                anchorEl={attachAnchor}
                onClose={() => setAttachAnchor(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Box sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap', maxWidth: 200 }}>
                  <Tooltip title="Photo/Video">
                    <IconButton
                      onClick={handleImageUpload}
                      sx={{ bgcolor: '#4caf50', color: 'white', '&:hover': { bgcolor: '#388e3c' } }}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Document">
                    <IconButton
                      onClick={handleDocumentUpload}
                      sx={{ bgcolor: '#0d47a1', color: 'white', '&:hover': { bgcolor: '#1a237e' } }}
                    >
                      <DescriptionIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Poll">
                    <IconButton
                      onClick={() => { setShowCreatePoll(true); setAttachAnchor(null); }}
                      sx={{ bgcolor: '#ff9800', color: 'white', '&:hover': { bgcolor: '#f57c00' } }}
                    >
                      <PollIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="GIF">
                    <IconButton
                      onClick={(e) => { setGifAnchor(e.currentTarget); setAttachAnchor(null); }}
                      sx={{ bgcolor: '#9c27b0', color: 'white', '&:hover': { bgcolor: '#7b1fa2' } }}
                    >
                      <GifIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Link">
                    <IconButton
                      onClick={() => { setShowLinkDialog(true); setAttachAnchor(null); }}
                      sx={{ bgcolor: '#607d8b', color: 'white', '&:hover': { bgcolor: '#455a64' } }}
                    >
                      <LinkIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Popover>

              {/* Hidden file inputs */}
              <input
                type="file"
                ref={imageInputRef}
                hidden
                accept="image/*,video/*"
                onChange={(e) => handleFileSelected(e, 'image')}
              />
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                onChange={(e) => handleFileSelected(e, 'document')}
              />

              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={newMessage}
                onChange={handleMessageInputChange}
                onKeyPress={handleKeyPress}
                onBlur={handleTypingStop}
                multiline
                maxRows={4}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f5f7fa' } }}
              />

              {/* Emoji Picker */}
              <IconButton onClick={(e) => setEmojiAnchor(e.currentTarget)}>
                <EmojiEmotionsIcon />
              </IconButton>
              <Popover
                open={Boolean(emojiAnchor)}
                anchorEl={emojiAnchor}
                onClose={() => setEmojiAnchor(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', maxWidth: 280 }}>
                  {emojiList.map((emoji) => (
                    <IconButton key={emoji} onClick={() => handleInsertEmoji(emoji)} sx={{ fontSize: 24 }}>
                      {emoji}
                    </IconButton>
                  ))}
                </Box>
              </Popover>

              {/* GIF Picker */}
              <Popover
                open={Boolean(gifAnchor)}
                anchorEl={gifAnchor}
                onClose={() => setGifAnchor(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Box sx={{ p: 2, width: 340 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>GIFs</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search GIFs..."
                    value={gifSearchQuery}
                    onChange={(e) => setGifSearchQuery(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                    {gifCategories.map((cat) => (
                      <Chip
                        key={cat}
                        label={cat}
                        size="small"
                        onClick={() => setGifSearchQuery(cat)}
                        sx={{ cursor: 'pointer', fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                  {/* GIF grid with actual GIFs */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, maxHeight: 250, overflow: 'auto' }}>
                    {sampleGifs.map((gif) => (
                      <Box
                        key={gif.id}
                        onClick={() => handleSendGif(gif.url)}
                        sx={{
                          borderRadius: 1,
                          cursor: 'pointer',
                          overflow: 'hidden',
                          aspectRatio: '1',
                          '&:hover': { opacity: 0.8, transform: 'scale(1.02)' },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <img
                          src={gif.preview}
                          alt="GIF"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 2, textAlign: 'center' }}>
                    Powered by GIPHY
                  </Typography>
                </Box>
              </Popover>

              <IconButton
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{ bgcolor: '#0d47a1', color: 'white', '&:hover': { bgcolor: '#1a237e' }, '&:disabled': { bgcolor: '#e0e0e0', color: '#9e9e9e' } }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
          <ChatBubbleOutlineIcon sx={{ fontSize: 80, color: '#e0e0e0', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a2e', mb: 1 }}>
            Your Messages
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 300, mb: 3 }}>
            Select a conversation or start a new chat.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setShowNewChat(true)}>
              New Chat
            </Button>
            <Button variant="outlined" startIcon={<GroupAddIcon />} onClick={() => setShowCreateGroup(true)}>
              Create Group
            </Button>
          </Box>
        </Box>
      )}
    </ChatArea>
  );

  // Create Group Dialog
  const renderCreateGroupDialog = () => (
    <Dialog open={showCreateGroup} onClose={() => setShowCreateGroup(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Create New Group
        <IconButton onClick={() => setShowCreateGroup(false)}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Group Name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          sx={{ mb: 3, mt: 1 }}
        />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>Add Members</Typography>
        <List sx={{ maxHeight: 250, overflow: 'auto', bgcolor: '#f5f7fa', borderRadius: 2 }}>
          {mockMembers.slice(1).map((member) => (
            <ListItem key={member.id} button onClick={() => {
              setSelectedMembers(prev =>
                prev.includes(member.id)
                  ? prev.filter(id => id !== member.id)
                  : [...prev, member.id]
              );
            }}>
              <ListItemAvatar>
                <Avatar>{member.name.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={member.name} />
              <Checkbox checked={selectedMembers.includes(member.id)} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <FormControlLabel
          control={<Switch checked={groupAdminOnly} onChange={(e) => setGroupAdminOnly(e.target.checked)} />}
          label={
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Only Admins Can Message</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Members can only read messages, admins can send
              </Typography>
            </Box>
          }
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setShowCreateGroup(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleCreateGroup} disabled={!newGroupName.trim() || selectedMembers.length === 0}>
          Create Group
        </Button>
      </DialogActions>
    </Dialog>
  );

  // New Chat Dialog (Direct Message)
  const renderNewChatDialog = () => {
    const filteredUsers = userSearchQuery
      ? availableUsers.filter(user =>
        user.email?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(userSearchQuery.toLowerCase())
      )
      : availableUsers;

    return (
      <Dialog open={showNewChat} onClose={() => setShowNewChat(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Start New Conversation
          <IconButton onClick={() => setShowNewChat(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name or email..."
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, mt: 1 }}
          />

          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Select a user to start chatting
          </Typography>

          {loadingUsers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', p: 3 }}>
              No users found
            </Typography>
          ) : (
            <List sx={{ maxHeight: 350, overflow: 'auto', bgcolor: '#f5f7fa', borderRadius: 2 }}>
              {filteredUsers.map((user) => (
                <ListItem
                  key={user.id}
                  button
                  onClick={() => handleCreateNewChat(user.id, `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email)}
                  sx={{
                    '&:hover': { bgcolor: alpha('#0d47a1', 0.1) },
                    borderRadius: 1,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#0d47a1' }}>
                      {(user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No Name'}
                    secondary={
                      <Box>
                        <Typography variant="caption" sx={{ display: 'block' }}>{user.email}</Typography>
                        {user.user_type && (
                          <Chip
                            label={user.user_type === 'HIRING_MANAGER' ? 'Hiring Manager' : 'Techie'}
                            size="small"
                            sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                            color={user.user_type === 'HIRING_MANAGER' ? 'secondary' : 'primary'}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  // Group Info Dialog
  const renderGroupInfoDialog = () => (
    <Dialog open={showGroupInfo} onClose={() => setShowGroupInfo(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Group Info
        <IconButton onClick={() => setShowGroupInfo(false)}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <GroupAvatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}>
            <GroupIcon sx={{ fontSize: 40 }} />
          </GroupAvatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {selectedConversation?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {selectedConversation?.members?.length} members
          </Typography>
          {selectedConversation?.groupSettings?.onlyAdminsCanMessage && (
            <Chip icon={<LockIcon />} label="Only Admins Can Message" size="small" sx={{ mt: 1 }} />
          )}
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>Members</Typography>
        <List sx={{ bgcolor: '#f5f7fa', borderRadius: 2 }}>
          {selectedConversation?.members?.map((member) => (
            <ListItem key={member.id}>
              <ListItemAvatar>
                {member.isOnline ? (
                  <OnlineBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                    <Avatar>{member.name.charAt(0)}</Avatar>
                  </OnlineBadge>
                ) : (
                  <Avatar>{member.name.charAt(0)}</Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={member.name}
                secondary={member.isAdmin ? 'Admin' : 'Member'}
              />
              {member.isAdmin && (
                <Chip label="Admin" size="small" sx={{ bgcolor: alpha('#0d47a1', 0.1), color: '#0d47a1' }} />
              )}
            </ListItem>
          ))}
        </List>

        {isCurrentUserAdmin() && (
          <Button fullWidth variant="outlined" startIcon={<PersonAddIcon />} sx={{ mt: 2 }} onClick={() => { setShowGroupInfo(false); setShowAddMembers(true); }}>
            Add Members
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );

  // Group Settings Dialog
  const renderGroupSettingsDialog = () => (
    <Dialog open={showGroupSettings} onClose={() => setShowGroupSettings(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Group Settings
        <IconButton onClick={() => setShowGroupSettings(false)}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>Permissions</Typography>

        <FormControlLabel
          control={<Switch checked={selectedConversation?.groupSettings?.onlyAdminsCanMessage} />}
          label={
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Only Admins Can Send Messages</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                When enabled, only admins can send messages. Members can only read.
              </Typography>
            </Box>
          }
          sx={{ mb: 2, display: 'block' }}
        />

        <FormControlLabel
          control={<Switch checked={selectedConversation?.groupSettings?.onlyAdminsCanEditInfo} />}
          label={
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Only Admins Can Edit Group Info</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Control who can change group name, icon, and description.
              </Typography>
            </Box>
          }
          sx={{ mb: 2, display: 'block' }}
        />

        <FormControlLabel
          control={<Switch checked={selectedConversation?.groupSettings?.onlyAdminsCanAddMembers} />}
          label={
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Only Admins Can Add Members</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Control who can add new members to the group.
              </Typography>
            </Box>
          }
          sx={{ display: 'block' }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setShowGroupSettings(false)}>Cancel</Button>
        <Button variant="contained" onClick={() => setShowGroupSettings(false)}>Save Settings</Button>
      </DialogActions>
    </Dialog>
  );

  // Create Poll Dialog
  const renderCreatePollDialog = () => (
    <Dialog open={showCreatePoll} onClose={() => setShowCreatePoll(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Create Poll
        <IconButton onClick={() => setShowCreatePoll(false)}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Question"
          value={pollQuestion}
          onChange={(e) => setPollQuestion(e.target.value)}
          sx={{ mb: 3, mt: 1 }}
        />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>Options</Typography>
        {pollOptions.map((option, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                const newOptions = [...pollOptions];
                newOptions[index] = e.target.value;
                setPollOptions(newOptions);
              }}
            />
            {pollOptions.length > 2 && (
              <IconButton onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== index))}>
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        ))}

        {pollOptions.length < 6 && (
          <Button startIcon={<AddIcon />} onClick={() => setPollOptions([...pollOptions, ''])} sx={{ mt: 1 }}>
            Add Option
          </Button>
        )}

        <Divider sx={{ my: 2 }} />

        <FormControlLabel
          control={<Switch checked={pollMultipleChoice} onChange={(e) => setPollMultipleChoice(e.target.checked)} />}
          label="Allow multiple choices"
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setShowCreatePoll(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleCreatePoll} disabled={!pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2}>
          Create Poll
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Mobile View
  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        <ChatContainer>
          {!showMobileChat ? renderConversationList() : renderChatArea()}
        </ChatContainer>
        {renderCreateGroupDialog()}
        {renderNewChatDialog()}
        {renderGroupInfoDialog()}
        {renderGroupSettingsDialog()}
        {renderCreatePollDialog()}

        {/* Link Dialog */}
        <Dialog open={showLinkDialog} onClose={() => setShowLinkDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Share Link</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Paste a URL to send. Use a public link if you want it to work in private or incognito.
            </Typography>
            <TextField
              fullWidth
              label="URL"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowLinkDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSendLink} disabled={!linkUrl.trim()}>Send</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Desktop View
  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Back Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton
          onClick={() => window.history.back()}
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
          }}
        >
          <ArrowBackIcon sx={{ color: theme.palette.primary.main }} />
        </IconButton>
        <Typography variant="h4" fontWeight={700} color="#1a237e">
          Messages
        </Typography>
      </Box>
      <ChatContainer>
        {renderConversationList()}
        {renderChatArea()}
      </ChatContainer>
      {renderCreateGroupDialog()}
      {renderNewChatDialog()}
      {renderGroupInfoDialog()}
      {renderGroupSettingsDialog()}
      {renderCreatePollDialog()}

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onClose={() => setShowLinkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Share Link
          <IconButton onClick={() => setShowLinkDialog(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Paste a URL to send. Use a public link if you want it to work in private or incognito.
          </Typography>
          <TextField
            fullWidth
            label="URL"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            sx={{ mt: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowLinkDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSendLink} disabled={!linkUrl.trim()}>
            Send Link
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Progress */}
      {uploadingFile && (
        <Box sx={{ position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>Uploading...</Typography>
            <LinearProgress sx={{ width: 100 }} />
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Chat;
