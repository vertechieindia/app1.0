/**
 * Help Center & Customer Support API service
 */

import { api } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export type TicketStatus = 'open' | 'in_progress' | 'waiting_for_user' | 'resolved' | 'closed';
export type TicketType = 'support' | 'feedback' | 'suggestion' | 'complaint';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface FAQCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  faq_count: number;
}

export interface FAQItem {
  id: string;
  category_id: string;
  category_name?: string;
  question: string;
  answer: string;
  keywords?: string;
  helpful_count: number;
  not_helpful_count: number;
  view_count: number;
  user_feedback?: boolean | null;
}

export interface TicketMessage {
  id: string;
  body: string;
  is_internal: boolean;
  is_staff_reply: boolean;
  author_id?: string;
  author_name?: string;
  created_at: string;
}

export interface TicketListItem {
  id: string;
  ticket_number: string;
  subject: string;
  ticket_type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  category?: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  assigned_to_id?: string;
  assigned_to_name?: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface TicketDetail extends TicketListItem {
  description: string;
  resolved_at?: string;
  closed_at?: string;
  messages: TicketMessage[];
}

export interface SupportDashboardStats {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  waiting_for_user_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  unassigned_tickets: number;
  feedback_tickets: number;
  complaint_tickets: number;
}

export interface CreateTicketPayload {
  subject: string;
  description: string;
  ticket_type: TicketType;
  priority?: TicketPriority;
  category?: string;
}

const E = API_ENDPOINTS.SUPPORT;

export const supportService = {
  listCategories: () => api.get<FAQCategory[]>(E.FAQ_CATEGORIES),
  listFaqs: (params?: { q?: string; category_id?: string }) =>
    api.get<FAQItem[]>(E.FAQS, { params }),
  getFaq: (id: string) => api.get<FAQItem>(E.FAQ_DETAIL(id)),
  submitFaqFeedback: (id: string, is_helpful: boolean) =>
    api.post(E.FAQ_FEEDBACK(id), { is_helpful }),

  listMyTickets: (params?: { status?: TicketStatus; type?: TicketType; q?: string }) =>
    api.get<TicketListItem[]>(E.MY_TICKETS, { params }),
  getMyTicket: (id: string) => api.get<TicketDetail>(E.MY_TICKET(id)),
  createTicket: (payload: CreateTicketPayload) =>
    api.post<TicketDetail>(E.CREATE_TICKET, payload),
  replyToTicket: (id: string, body: string) =>
    api.post<TicketMessage>(E.MY_TICKET_REPLY(id), { body }),

  // Staff dashboard
  getDashboardStats: () => api.get<SupportDashboardStats>(E.ADMIN_STATS),
  listAllTickets: (params?: Record<string, string | boolean | undefined>) =>
    api.get<TicketListItem[]>(E.ADMIN_TICKETS, { params }),
  getTicket: (id: string) => api.get<TicketDetail>(E.ADMIN_TICKET(id)),
  updateTicket: (id: string, payload: Record<string, unknown>) =>
    api.patch<TicketDetail>(E.ADMIN_TICKET(id), payload),
  staffReply: (id: string, body: string, is_internal = false) =>
    api.post<TicketMessage>(E.ADMIN_TICKET_REPLY(id), { body, is_internal }),

  adminListFaqs: (params?: { q?: string; category_id?: string }) =>
    api.get<FAQItem[]>(E.ADMIN_FAQS, { params }),
  createFaq: (payload: Record<string, unknown>) => api.post<FAQItem>(E.ADMIN_FAQS, payload),
  updateFaq: (id: string, payload: Record<string, unknown>) =>
    api.put<FAQItem>(E.ADMIN_FAQ_DETAIL(id), payload),
  deleteFaq: (id: string) => api.delete(E.ADMIN_FAQ_DETAIL(id)),
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  waiting_for_user: 'Waiting for User',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const TICKET_TYPE_LABELS: Record<TicketType, string> = {
  support: 'Support Request',
  feedback: 'Feedback',
  suggestion: 'Product Suggestion',
  complaint: 'Complaint',
};

export const TICKET_STATUS_COLORS: Record<TicketStatus, 'default' | 'primary' | 'warning' | 'info' | 'success' | 'error'> = {
  open: 'primary',
  in_progress: 'warning',
  waiting_for_user: 'info',
  resolved: 'success',
  closed: 'default',
};

/** Whether current user can access Customer Support dashboard */
export function isSupportStaffUser(): boolean {
  try {
    const raw = localStorage.getItem('userData');
    if (!raw) return false;
    const u = JSON.parse(raw);
    if (u.is_superuser) return true;
    const roles: string[] = (u.admin_roles || []).map((r: string) => String(r).toLowerCase());
    if (roles.includes('support_admin')) return true;
    const groups = (u.groups || []).map((g: { name?: string }) => (g.name || '').toLowerCase());
    if (groups.some((g: string) => g.includes('support'))) return true;
    const accessRoles = (u.roles || []).map((r: { name?: string }) => (r.name || '').toLowerCase());
    if (accessRoles.some((n: string) => n.includes('support'))) return true;
    return false;
  } catch {
    return false;
  }
}
