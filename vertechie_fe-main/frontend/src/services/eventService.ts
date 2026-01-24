/**
 * Event Service
 * Handles events operations with FastAPI backend
 */

import { api } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Types
export interface Event {
  id: string;
  title: string;
  description?: string;
  host_id: string;
  host_name?: string;
  start_date: string;
  end_date?: string;
  timezone: string;
  event_type: 'webinar' | 'workshop' | 'meetup' | 'conference';
  location?: string;
  is_virtual: boolean;
  meeting_link?: string;
  cover_image?: string;
  is_public: boolean;
  max_attendees?: number;
  attendees_count: number;
  views_count: number;
  is_registered: boolean;
  created_at: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  start_date: string;  // ISO format
  end_date?: string;
  timezone?: string;
  event_type?: 'webinar' | 'workshop' | 'meetup' | 'conference';
  location?: string;
  is_virtual?: boolean;
  meeting_link?: string;
  cover_image?: string;
  is_public?: boolean;
  requires_approval?: boolean;
  max_attendees?: number;
}

export interface EventListParams {
  skip?: number;
  limit?: number;
  event_type?: string;
}

// Event service
export const eventService = {
  /**
   * List events
   */
  getEvents: async (params?: EventListParams): Promise<Event[]> => {
    return api.get<Event[]>(API_ENDPOINTS.COMMUNITY.EVENTS, { params });
  },

  /**
   * Create a new event
   */
  createEvent: async (data: CreateEventData): Promise<Event> => {
    return api.post<Event>(API_ENDPOINTS.COMMUNITY.CREATE_EVENT, data);
  },

  /**
   * Register/unregister for an event
   */
  registerEvent: async (eventId: string): Promise<{ message: string }> => {
    return api.post(API_ENDPOINTS.COMMUNITY.REGISTER_EVENT(eventId));
  },
};

export default eventService;
