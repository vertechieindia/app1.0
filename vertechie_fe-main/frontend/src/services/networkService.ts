/**
 * Network Service
 * Handles connection operations with FastAPI backend
 */

import { api } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Types
export interface Connection {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    headline: string | null;
    avatar_url: string | null;
  };
  connected_at: string;
}

export interface ConnectionRequest {
  id: string;
  user: {
    id: string;
    name: string;
    headline: string | null;
    avatar_url: string | null;
  };
  message: string | null;
  created_at: string;
}

export interface SendRequestData {
  user_id: string;
  message?: string;
}

export interface ConnectionListParams {
  skip?: number;
  limit?: number;
}

// Network service
export const networkService = {
  /**
   * List user's connections
   */
  getConnections: async (params?: ConnectionListParams): Promise<Connection[]> => {
    return api.get<Connection[]>(API_ENDPOINTS.NETWORK.CONNECTIONS, { params });
  },

  /**
   * List connection requests
   */
  getRequests: async (type: 'received' | 'sent' = 'received'): Promise<ConnectionRequest[]> => {
    return api.get<ConnectionRequest[]>(API_ENDPOINTS.NETWORK.REQUESTS, { params: { type } });
  },

  /**
   * Send a connection request
   */
  sendRequest: async (data: SendRequestData): Promise<{ message: string }> => {
    return api.post(API_ENDPOINTS.NETWORK.SEND_REQUEST, data);
  },

  /**
   * Accept a connection request
   */
  acceptRequest: async (requestId: string): Promise<{ message: string }> => {
    return api.post(API_ENDPOINTS.NETWORK.ACCEPT_REQUEST(requestId));
  },

  /**
   * Decline a connection request
   */
  declineRequest: async (requestId: string): Promise<{ message: string }> => {
    return api.post(API_ENDPOINTS.NETWORK.DECLINE_REQUEST(requestId));
  },

  /**
   * Remove a connection
   */
  removeConnection: async (connectionId: string): Promise<{ message: string }> => {
    return api.delete(API_ENDPOINTS.NETWORK.REMOVE_CONNECTION(connectionId));
  },
};

export default networkService;

