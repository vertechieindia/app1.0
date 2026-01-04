/**
 * Chat Service
 * Handles messaging operations with FastAPI backend
 */

import { api } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Types
export interface Conversation {
  id: string;
  type: string;
  name: string | null;
  avatar_url: string | null;
  member_count: number;
  last_message_at: string | null;
  last_message_preview: string | null;
  unread_count: number;
}

export interface Message {
  id: string;
  sender_id: string;
  type: string;
  content: string | null;
  media_url: string | null;
  reactions: Record<string, string[]>;
  is_edited: boolean;
  created_at: string;
}

export interface CreateConversationData {
  type?: 'direct' | 'group' | 'channel';
  member_ids: string[];
  name?: string;
  description?: string;
}

export interface SendMessageData {
  type?: 'text' | 'image' | 'file' | 'gif' | 'poll';
  content?: string;
  media_url?: string;
  poll_data?: {
    question: string;
    options: string[];
    allow_multiple?: boolean;
  };
  reply_to_id?: string;
}

export interface MessageListParams {
  skip?: number;
  limit?: number;
}

// Chat service
export const chatService = {
  /**
   * List user's conversations
   */
  getConversations: async (): Promise<Conversation[]> => {
    return api.get<Conversation[]>(API_ENDPOINTS.CHAT.CONVERSATIONS);
  },

  /**
   * Create a new conversation
   */
  createConversation: async (data: CreateConversationData): Promise<{ id: string; message: string }> => {
    return api.post(API_ENDPOINTS.CHAT.CREATE_CONVERSATION, data);
  },

  /**
   * Get messages in a conversation
   */
  getMessages: async (conversationId: string, params?: MessageListParams): Promise<Message[]> => {
    return api.get<Message[]>(API_ENDPOINTS.CHAT.MESSAGES(conversationId), { params });
  },

  /**
   * Send a message
   */
  sendMessage: async (conversationId: string, data: SendMessageData): Promise<{ id: string; created_at: string }> => {
    return api.post(API_ENDPOINTS.CHAT.SEND_MESSAGE(conversationId), data);
  },

  /**
   * React to a message
   */
  reactToMessage: async (messageId: string, reaction: string): Promise<{ reactions: Record<string, string[]> }> => {
    return api.post(API_ENDPOINTS.CHAT.REACT(messageId), null, { params: { reaction } });
  },
};

export default chatService;

