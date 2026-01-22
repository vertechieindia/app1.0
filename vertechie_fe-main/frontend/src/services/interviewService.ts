/**
 * Interview Scheduling Service
 * Handles interview scheduling, notifications, and Techie's "My Interviews" functionality
 */

import { API_BASE_URL } from '../config/api';

// Types
export interface InterviewCreate {
  application_id: string;
  interview_type: 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral' | 'panel';
  scheduled_at: string; // ISO date string
  duration_minutes: number;
  location?: string;
  meeting_link?: string;
  interviewers?: string[]; // Array of user IDs
  notes?: string;
}

export interface Interview {
  id: string;
  interview_type: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  scheduled_at: string;
  duration_minutes: number;
  meeting_link?: string;
  location?: string;
  notes?: string;
  job_title?: string;
  company_name?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

// Helper to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Base API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
};

// ============= Interview Scheduling =============

export const interviewService = {
  /**
   * Schedule a new interview
   * This is called by HMs when they click "Schedule Interview" from the ATS
   */
  scheduleInterview: async (interviewData: InterviewCreate): Promise<Interview> => {
    return apiRequest('/hiring/interviews', {
      method: 'POST',
      body: JSON.stringify(interviewData),
    });
  },

  /**
   * Get interviews for the current user (as interviewer/HM)
   */
  getMyInterviewsAsInterviewer: async (upcoming: boolean = true): Promise<Interview[]> => {
    return apiRequest(`/hiring/interviews?upcoming=${upcoming}`);
  },

  /**
   * Get interviews for the current user (as candidate/Techie)
   * This is the main endpoint for Techies to see their scheduled interviews
   */
  getMyInterviewsAsCandidate: async (upcoming: boolean = true): Promise<Interview[]> => {
    return apiRequest(`/hiring/my-interviews?upcoming=${upcoming}`);
  },

  /**
   * Get count of upcoming interviews for a Techie
   */
  getInterviewCount: async (): Promise<{ upcoming: number; total: number }> => {
    return apiRequest('/hiring/my-interviews/count');
  },

  /**
   * Update interview status
   */
  updateInterviewStatus: async (
    interviewId: string,
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  ): Promise<{ status: string }> => {
    return apiRequest(`/hiring/interviews/${interviewId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Get a single interview by ID
   */
  getInterviewById: async (interviewId: string): Promise<Interview> => {
    return apiRequest(`/hiring/interviews/${interviewId}`);
  },
};

// ============= Notifications =============

export const notificationService = {
  /**
   * Get all notifications for the current user
   */
  getNotifications: async (unreadOnly: boolean = false, limit: number = 20): Promise<Notification[]> => {
    return apiRequest(`/hiring/notifications?unread_only=${unreadOnly}&limit=${limit}`);
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<{ unread_count: number }> => {
    return apiRequest('/hiring/notifications/unread-count');
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (notificationId: string): Promise<{ status: string }> => {
    return apiRequest(`/hiring/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{ status: string }> => {
    return apiRequest('/hiring/notifications/mark-all-read', {
      method: 'PUT',
    });
  },
};

// ============= Helper Functions =============

/**
 * Format interview type for display
 */
export const formatInterviewType = (type: string): string => {
  const typeMap: Record<string, string> = {
    phone: '📱 Phone Screening',
    video: '📹 Video Interview',
    onsite: '🏢 Onsite Interview',
    technical: '💻 Technical Interview',
    behavioral: '🎯 Behavioral Interview',
    panel: '👥 Panel Interview',
  };
  return typeMap[type] || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Format interview status for display
 */
export const formatInterviewStatus = (status: string): { label: string; color: string } => {
  const statusMap: Record<string, { label: string; color: string }> = {
    scheduled: { label: 'Scheduled', color: '#2196F3' },
    confirmed: { label: 'Confirmed', color: '#4CAF50' },
    in_progress: { label: 'In Progress', color: '#FF9800' },
    completed: { label: 'Completed', color: '#4CAF50' },
    cancelled: { label: 'Cancelled', color: '#f44336' },
    no_show: { label: 'No Show', color: '#9E9E9E' },
  };
  return statusMap[status] || { label: status, color: '#9E9E9E' };
};

/**
 * Format date for interview display
 */
export const formatInterviewDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time for interview display
 */
export const formatInterviewTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default {
  interviewService,
  notificationService,
  formatInterviewType,
  formatInterviewStatus,
  formatInterviewDate,
  formatInterviewTime,
};
