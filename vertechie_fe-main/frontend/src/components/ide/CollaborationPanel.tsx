/**
 * Collaboration Panel Component
 * 
 * Shows connected collaborators, their cursors, and chat.
 * Uses WebSocket for real-time updates.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  AvatarGroup,
  Badge,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Chip,
  Divider,
  Collapse,
  InputAdornment,
} from '@mui/material';
import {
  Send as SendIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Person as PersonIcon,
  Chat as ChatIcon,
  Circle as OnlineIcon,
} from '@mui/icons-material';

// Types
interface Collaborator {
  id: string;
  email: string;
  name: string;
  color: string;
  cursor?: { line: number; column: number };
  selection?: { startLine: number; startCol: number; endLine: number; endCol: number };
  fileId?: string;
}

interface ChatMessage {
  id?: string;
  userId: string;
  userName: string;
  content: string;
  fileId?: string;
  lineNumber?: number;
  timestamp: string;
}

interface CollaborationPanelProps {
  projectId: string;
  currentFileId?: string;
  onCursorUpdate?: (userId: string, position: { line: number; column: number }) => void;
  onSelectionUpdate?: (userId: string, selection: any) => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  projectId,
  currentFileId,
  onCursorUpdate,
  onSelectionUpdate,
}) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(true);
  
  const wsRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Connect to WebSocket
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/collab/${projectId}/?token=${token}`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    
    ws.onopen = () => {
      console.log('Collaboration WebSocket connected');
      setIsConnected(true);
    };
    
    ws.onclose = () => {
      console.log('Collaboration WebSocket disconnected');
      setIsConnected(false);
    };
    
    ws.onerror = (error) => {
      console.error('Collaboration WebSocket error:', error);
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleMessage(message);
    };
    
    return () => {
      ws.close();
    };
  }, [projectId]);
  
  // Handle incoming WebSocket messages
  const handleMessage = useCallback((message: { type: string; data: any }) => {
    switch (message.type) {
      case 'session_state':
        setCollaborators(message.data.users || []);
        break;
      
      case 'user_join':
        setCollaborators(prev => [...prev, {
          id: message.data.user_id,
          email: message.data.user_email,
          name: message.data.user_name,
          color: message.data.color,
        }]);
        break;
      
      case 'user_leave':
        setCollaborators(prev => prev.filter(c => c.id !== message.data.user_id));
        break;
      
      case 'cursor':
        setCollaborators(prev => prev.map(c => 
          c.id === message.data.user_id
            ? { ...c, cursor: message.data.position, fileId: message.data.file_id }
            : c
        ));
        if (onCursorUpdate) {
          onCursorUpdate(message.data.user_id, message.data.position);
        }
        break;
      
      case 'selection':
        setCollaborators(prev => prev.map(c => 
          c.id === message.data.user_id
            ? { ...c, selection: message.data.selection, fileId: message.data.file_id }
            : c
        ));
        if (onSelectionUpdate) {
          onSelectionUpdate(message.data.user_id, message.data.selection);
        }
        break;
      
      case 'chat':
        setMessages(prev => [...prev, {
          userId: message.data.user_id,
          userName: message.data.user_name,
          content: message.data.content,
          fileId: message.data.file_id,
          lineNumber: message.data.line_number,
          timestamp: message.data.timestamp,
        }]);
        break;
      
      default:
        break;
    }
  }, [onCursorUpdate, onSelectionUpdate]);
  
  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Send cursor position
  const sendCursor = useCallback((position: { line: number; column: number }) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'cursor',
        data: {
          file_id: currentFileId,
          position,
        },
      }));
    }
  }, [currentFileId]);
  
  // Send chat message
  const sendMessage = () => {
    if (!newMessage.trim() || !wsRef.current) return;
    
    wsRef.current.send(JSON.stringify({
      type: 'chat',
      data: {
        content: newMessage,
        file_id: currentFileId,
      },
    }));
    
    setNewMessage('');
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Connection Status */}
      <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <OnlineIcon
              sx={{
                fontSize: 10,
                color: isConnected ? 'success.main' : 'error.main',
              }}
            />
          }
        >
          <PersonIcon />
        </Badge>
        <Typography variant="body2">
          {collaborators.length} {collaborators.length === 1 ? 'person' : 'people'} editing
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Collaborators */}
      <Box sx={{ px: 2, py: 1 }}>
        <AvatarGroup max={6} sx={{ justifyContent: 'flex-start' }}>
          {collaborators.map((collab) => (
            <Tooltip key={collab.id} title={collab.name}>
              <Avatar
                sx={{
                  bgcolor: collab.color,
                  width: 32,
                  height: 32,
                  fontSize: 12,
                  border: `2px solid ${collab.color}`,
                }}
              >
                {getInitials(collab.name)}
              </Avatar>
            </Tooltip>
          ))}
        </AvatarGroup>
      </Box>
      
      <Divider />
      
      {/* Chat Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          cursor: 'pointer',
        }}
        onClick={() => setChatExpanded(!chatExpanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChatIcon fontSize="small" />
          <Typography variant="subtitle2">Chat</Typography>
          {messages.length > 0 && (
            <Chip size="small" label={messages.length} sx={{ height: 18 }} />
          )}
        </Box>
        {chatExpanded ? <CollapseIcon /> : <ExpandIcon />}
      </Box>
      
      <Collapse in={chatExpanded} sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Messages */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', px: 1 }}>
            <List dense>
              {messages.map((msg, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemAvatar sx={{ minWidth: 36 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 10 }}>
                      {getInitials(msg.userName)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                        <Typography variant="caption" fontWeight={600}>
                          {msg.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        {msg.content}
                        {msg.lineNumber && (
                          <Chip
                            size="small"
                            label={`Line ${msg.lineNumber}`}
                            sx={{ ml: 1, height: 16, fontSize: 10 }}
                          />
                        )}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
              <div ref={chatEndRef} />
            </List>
          </Box>
          
          {/* Message Input */}
          <Box sx={{ p: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={!isConnected}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={sendMessage}
                      disabled={!isConnected || !newMessage.trim()}
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default CollaborationPanel;

