/**
 * Calendar Service
 * Handles scheduling operations with FastAPI backend
 */

import { api } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Types
export interface MeetingType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  duration_minutes: number;
  location_type: string;
  color: string;
  is_active: boolean;
}

export interface SchedulingLink {
  id: string;
  token: string;
  title: string | null;
  duration_minutes: number;
  start_date: string | null;
  end_date: string | null;
  max_bookings: number | null;
  current_bookings: number;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  invitee_name: string;
  invitee_email: string;
  start_time: string;
  end_time: string;
  status: string;
  meeting_link: string | null;
  notes: string | null;
  created_at: string;
}

export interface PublicScheduleInfo {
  host: {
    name: string;
    email: string;
  };
  title: string | null;
  duration_minutes: number;
  available_days: number[];
  constraints: {
    start_date: string | null;
    end_date: string | null;
    start_time: string | null;
    end_time: string | null;
    max_bookings: number | null;
    remaining_bookings: number | null;
  };
}

export interface CreateMeetingTypeData {
  name: string;
  slug?: string;
  description?: string;
  duration_minutes?: number;
  location_type?: string;
  color?: string;
}

export interface CreateSchedulingLinkData {
  title?: string;
  duration_minutes?: number;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  available_days?: number[];
  buffer_before?: number;
  buffer_after?: number;
  max_bookings?: number;
  requires_approval?: boolean;
}

export interface BookMeetingData {
  name: string;
  email: string;
  start_time: string;
  timezone?: string;
  notes?: string;
}

export interface BookingListParams {
  status?: string;
  from_date?: string;
  to_date?: string;
}

// Calendar service
export const calendarService = {
  /**
   * List user's meeting types
   */
  getMeetingTypes: async (): Promise<MeetingType[]> => {
    return api.get<MeetingType[]>(API_ENDPOINTS.CALENDAR.MEETING_TYPES);
  },

  /**
   * Create a new meeting type
   */
  createMeetingType: async (data: CreateMeetingTypeData): Promise<{ id: string; message: string }> => {
    return api.post(API_ENDPOINTS.CALENDAR.CREATE_MEETING_TYPE, data);
  },

  /**
   * List user's scheduling links
   */
  getSchedulingLinks: async (): Promise<SchedulingLink[]> => {
    return api.get<SchedulingLink[]>(API_ENDPOINTS.CALENDAR.SCHEDULING_LINKS);
  },

  /**
   * Create a new scheduling link
   */
  createSchedulingLink: async (data: CreateSchedulingLinkData): Promise<{ token: string; message: string }> => {
    return api.post(API_ENDPOINTS.CALENDAR.CREATE_SCHEDULING_LINK, data);
  },

  /**
   * List user's bookings
   */
  getBookings: async (params?: BookingListParams): Promise<Booking[]> => {
    return api.get<Booking[]>(API_ENDPOINTS.CALENDAR.BOOKINGS, { params });
  },

  /**
   * Confirm a booking
   */
  confirmBooking: async (bookingId: string): Promise<{ message: string }> => {
    return api.post(API_ENDPOINTS.CALENDAR.CONFIRM_BOOKING(bookingId));
  },

  /**
   * Cancel a booking
   */
  cancelBooking: async (bookingId: string, reason?: string): Promise<{ message: string }> => {
    return api.post(API_ENDPOINTS.CALENDAR.CANCEL_BOOKING(bookingId), { reason });
  },

  /**
   * Get public scheduling page info
   */
  getPublicSchedule: async (token: string): Promise<PublicScheduleInfo> => {
    return api.get<PublicScheduleInfo>(API_ENDPOINTS.CALENDAR.PUBLIC_SCHEDULE(token));
  },

  /**
   * Book a meeting via public link
   */
  bookMeeting: async (token: string, data: BookMeetingData): Promise<{ booking_id: string; status: string; message: string }> => {
    return api.post(API_ENDPOINTS.CALENDAR.BOOK_PUBLIC(token), data);
  },
};

export default calendarService;

