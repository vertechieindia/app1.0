/**
 * WebSocket client for real-time chat messaging
 */

import { getApiUrl } from '../config/api';

export type WebSocketMessageType = 
  | 'connected'
  | 'new_message'
  | 'message_edited'
  | 'message_deleted'
  | 'typing'
  | 'pong'
  | 'error';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  conversation_id?: string;
  message?: any;
  message_id?: string;
  user_id?: string;
  user_name?: string;
  is_typing?: boolean;
  for_everyone?: boolean;
  error?: string;
}

export type MessageHandler = (message: WebSocketMessage) => void;
export type ErrorHandler = (error: Event) => void;
export type ConnectionHandler = () => void;

export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private conversationId: string | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isIntentionallyClosed = false;

  private onMessageHandlers: MessageHandler[] = [];
  private onErrorHandlers: ErrorHandler[] = [];
  private onConnectHandlers: ConnectionHandler[] = [];
  private onDisconnectHandlers: ConnectionHandler[] = [];

  /**
   * Connect to a conversation's WebSocket
   */
  connect(conversationId: string, token: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.conversationId === conversationId) {
      // Already connected to this conversation
      return;
    }

    // Close existing connection if different conversation
    if (this.ws && this.conversationId !== conversationId) {
      this.disconnect();
    }

    this.conversationId = conversationId;
    this.token = token;
    this.isIntentionallyClosed = false;

    // Get WebSocket URL (convert http/https to ws/wss)
    // getApiUrl returns something like http://localhost:8000/api/v1
    // We need ws://localhost:8000/ws/chat/{id}
    const apiUrl = getApiUrl('');
    const baseUrl = apiUrl.replace('/api/v1', '').replace(/^http/, 'ws');
    const wsEndpoint = `${baseUrl}/ws/chat/${conversationId}?token=${encodeURIComponent(token)}`;

    try {
      this.ws = new WebSocket(wsEndpoint);

      this.ws.onopen = () => {
        console.log(`WebSocket connected to conversation ${conversationId}`);
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.startHeartbeat();
        this.onConnectHandlers.forEach(handler => handler());
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          // Handle pong (heartbeat response)
          if (message.type === 'pong') {
            return;
          }

          // Call all message handlers
          this.onMessageHandlers.forEach(handler => handler(message));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onErrorHandlers.forEach(handler => handler(error));
      };

      this.ws.onclose = () => {
        console.log(`WebSocket disconnected from conversation ${conversationId}`);
        this.stopHeartbeat();
        this.onDisconnectHandlers.forEach(handler => handler());

        // Attempt to reconnect if not intentionally closed
        if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.onErrorHandlers.forEach(handler => handler(error as Event));
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    this.isIntentionallyClosed = true;
    this.stopHeartbeat();
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.conversationId = null;
    this.token = null;
  }

  /**
   * Send a message via WebSocket
   */
  send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }

  /**
   * Send typing indicator
   */
  sendTypingStart(): void {
    this.send({
      type: 'typing_start',
      conversation_id: this.conversationId
    });
  }

  /**
   * Send typing stop indicator
   */
  sendTypingStop(): void {
    this.send({
      type: 'typing_stop',
      conversation_id: this.conversationId
    });
  }

  /**
   * Register message handler
   */
  onMessage(handler: MessageHandler): () => void {
    this.onMessageHandlers.push(handler);
    // Return unsubscribe function
    return () => {
      const index = this.onMessageHandlers.indexOf(handler);
      if (index > -1) {
        this.onMessageHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Register error handler
   */
  onError(handler: ErrorHandler): () => void {
    this.onErrorHandlers.push(handler);
    return () => {
      const index = this.onErrorHandlers.indexOf(handler);
      if (index > -1) {
        this.onErrorHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Register connect handler
   */
  onConnect(handler: ConnectionHandler): () => void {
    this.onConnectHandlers.push(handler);
    return () => {
      const index = this.onConnectHandlers.indexOf(handler);
      if (index > -1) {
        this.onConnectHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Register disconnect handler
   */
  onDisconnect(handler: ConnectionHandler): () => void {
    this.onDisconnectHandlers.push(handler);
    return () => {
      const index = this.onDisconnectHandlers.indexOf(handler);
      if (index > -1) {
        this.onDisconnectHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get current conversation ID
   */
  getConversationId(): string | null {
    return this.conversationId;
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' });
      }
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      return; // Already scheduled
    }

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000); // Exponential backoff, max 30s

    console.log(`Scheduling WebSocket reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.conversationId && this.token && !this.isIntentionallyClosed) {
        this.connect(this.conversationId, this.token);
      }
    }, delay);
  }
}

// Export singleton instance
export const chatWebSocket = new ChatWebSocket();
