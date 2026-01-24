/**
 * API Configuration for FastAPI Backend
 * Centralized base URL and API endpoints
 */

// Environment-based API URL
const getBaseUrl = (): string => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Development default
  if (import.meta.env.DEV) {
    return 'http://localhost:8000/api/v1';
  }
  
  // Production
  return 'https://api.vertechie.com/api/v1';
};

// Base URL for the FastAPI backend
export const API_BASE_URL = getBaseUrl();

// Legacy Django endpoint (for gradual migration)
const getLegacyBaseUrl = (): string => {
  // Check for environment variable first
  if (import.meta.env.VITE_LEGACY_API_URL) {
    return import.meta.env.VITE_LEGACY_API_URL;
  }
  
  // Development default - same host but without /v1
  if (import.meta.env.DEV) {
    return 'http://localhost:8000/api/';
  }
  
  // Production
  return 'https://api.vertechie.com/api/';
};

export const LEGACY_API_URL = getLegacyBaseUrl();

// API Endpoints - Updated for FastAPI
export const API_ENDPOINTS = {
  // ============================================
  // AUTHENTICATION (/auth)
  // ============================================
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    TOKEN: '/auth/token',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  
  // Token endpoint (for getting auth token after registration)
  TOKEN: '/auth/token',

  // Admin user creation endpoint
  CREATE_ADMIN: '/auth/admin/users',
  
  // Company invites
  COMPANY_INVITES: '/companies/invites',

  // Shorthand aliases for backwards compatibility
  REGISTER: '/auth/register',
  COMPANY: '/companies',
  COMPANY_SIGNUP: '/companies/signup',
  SCHOOL_SIGNUP: '/schools/signup',
  
  // Additional top-level endpoints used across the app
  GROUPS: '/groups/',
  PERMISSIONS: '/permissions/',
  BLOCKED_PROFILES: '/blocked-profiles/',
  PENDING_APPROVALS: '/pending-approvals/',
  EDUCATION: '/users/me/educations',
  EXPERIENCES: '/experiences/',
  FORGOT_PASSWORD: '/auth/forgot-password',
  FRONTEND_LOGS: '/logs/frontend/',
  
  // Legacy endpoint shortcuts (also accessible via LEGACY.*)
  SEND_EMAIL_OTP: 'v_auth/auth/send-email-otp/',
  VERIFY_EMAIL_OTP: 'v_auth/auth/verify-email-otp/',
  MOBILE_VERIFICATION: 'v_auth/auth/mobile-verification/',
  EXTRACT_ID_DETAILS: 'v_auth/auth/extract-details/',
  ID_VERIFICATION: 'v_auth/auth/id-verification/',
  CHECK_LIVENESS: 'v_auth/auth/check_liveness/',

  // ============================================
  // USERS (/users)
  // ============================================
  USERS: {
    toString: () => '/users/',
    valueOf: () => '/users/',
    LIST: '/users/',
    GET: (id: string) => `/users/${id}/`,
    UPDATE_ME: '/users/me/',
    PROFILE: (id: string) => `/users/${id}/profile/`,
    UPDATE_PROFILE: '/users/me/profile/',
  } as unknown as string & {
    LIST: string;
    GET: (id: string) => string;
    UPDATE_ME: string;
    PROFILE: (id: string) => string;
    UPDATE_PROFILE: string;
  },

  // ============================================
  // JOBS (/jobs)
  // ============================================
  JOBS: {
    LIST: '/jobs/',
    CREATE: '/jobs/',
    GET: (id: string) => `/jobs/${id}/`,
    UPDATE: (id: string) => `/jobs/${id}/`,
    DELETE: (id: string) => `/jobs/${id}/`,
    APPLY: (id: string) => `/jobs/${id}/apply/`,
    APPLICATIONS: (id: string) => `/jobs/${id}/applications/`,
    SAVE: (id: string) => `/jobs/${id}/save/`,
    UNSAVE: (id: string) => `/jobs/${id}/save/`,
    MY_APPLICATIONS: '/jobs/my/applications/',
    SAVED: '/jobs/my/saved/',
  },

  // ============================================
  // COURSES (/courses)
  // ============================================
  COURSES: {
    LIST: '/courses',
    CATEGORIES: '/courses/categories',
    CREATE: '/courses',
    GET: (id: string) => `/courses/${id}`,
    UPDATE: (id: string) => `/courses/${id}`,
    DELETE: (id: string) => `/courses/${id}`,
    CURRICULUM: (id: string) => `/courses/${id}/curriculum`,
    ENROLL: (id: string) => `/courses/${id}/enroll`,
    MY_ENROLLMENTS: '/courses/my/enrollments',
    LESSON: (id: string) => `/courses/lessons/${id}`,
    COMPLETE_LESSON: (id: string) => `/courses/lessons/${id}/complete`,
  },

  // ============================================
  // CALENDAR (/calendar)
  // ============================================
  CALENDAR: {
    MEETING_TYPES: '/calendar/meeting-types',
    CREATE_MEETING_TYPE: '/calendar/meeting-types',
    SCHEDULING_LINKS: '/calendar/scheduling-links',
    CREATE_SCHEDULING_LINK: '/calendar/scheduling-links',
    BOOKINGS: '/calendar/bookings',
    CONFIRM_BOOKING: (id: string) => `/calendar/bookings/${id}/confirm`,
    CANCEL_BOOKING: (id: string) => `/calendar/bookings/${id}/cancel`,
    PUBLIC_SCHEDULE: (token: string) => `/calendar/public/${token}`,
    BOOK_PUBLIC: (token: string) => `/calendar/public/${token}/book`,
  },

  // ============================================
  // CHAT (/chat)
  // ============================================
  CHAT: {
    CONVERSATIONS: '/chat/conversations',
    CREATE_CONVERSATION: '/chat/conversations',
    MESSAGES: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
    SEND_MESSAGE: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
    REACT: (messageId: string) => `/chat/messages/${messageId}/react`,
  },

  // ============================================
  // NETWORK (/network)
  // ============================================
  NETWORK: {
    CONNECTIONS: '/network/connections',
    REQUESTS: '/network/requests',
    SEND_REQUEST: '/network/requests',
    ACCEPT_REQUEST: (id: string) => `/network/requests/${id}/accept`,
    DECLINE_REQUEST: (id: string) => `/network/requests/${id}/decline`,
    REMOVE_CONNECTION: (id: string) => `/network/connections/${id}`,
  },

  // ============================================
  // COMMUNITY (/community)
  // ============================================
  COMMUNITY: {
    GROUPS: '/community/groups',
    CREATE_GROUP: '/community/groups',
    JOIN_GROUP: (id: string) => `/community/groups/${id}/join`,
    POSTS: '/community/posts',
    CREATE_POST: '/community/posts',
    LIKE_POST: (id: string) => `/community/posts/${id}/like`,
    COMMENTS: (postId: string) => `/community/posts/${postId}/comments`,
    ADD_COMMENT: (postId: string) => `/community/posts/${postId}/comments`,
  },

  // ============================================
  // UNIFIED NETWORK (/unified-network)
  // ============================================
  UNIFIED_NETWORK: {
    FEED: '/unified-network/feed',
    STATS: '/unified-network/stats',
    TRENDING: '/unified-network/trending',
    SUGGESTIONS_PEOPLE: '/unified-network/suggestions/people',
    SUGGESTIONS_GROUPS: '/unified-network/suggestions/groups',
  },

  // ============================================
  // HIRING/ATS (/hiring)
  // ============================================
  HIRING: {
    PIPELINE_CANDIDATES: '/hiring/pipeline/candidates',
    MOVE_CANDIDATE: (id: string) => `/hiring/candidates/${id}/move`,
    UPDATE_APPLICATION_STAGE: (id: string) => `/hiring/applications/${id}/stage`,
  },

  // ============================================
  // LEGACY ENDPOINTS (Django - for gradual migration)
  // ============================================
  LEGACY: {
    CHECK_LIVENESS: 'v_auth/auth/check_liveness/',
    EXTRACT_ID_DETAILS: 'v_auth/auth/extract-details/',
    ID_VERIFICATION: 'v_auth/auth/id-verification/',
    SEND_EMAIL_OTP: 'v_auth/auth/send-email-otp/',
    VERIFY_EMAIL_OTP: 'v_auth/auth/verify-email-otp/',
    MOBILE_VERIFICATION: 'v_auth/auth/mobile-verification/',
  },
} as const;

/**
 * Get full URL for a FastAPI endpoint
 * @param endpoint - The endpoint path
 * @returns Full URL string
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * Get full URL for a legacy Django endpoint
 * @param endpoint - The endpoint path
 * @returns Full URL string
 */
export const getLegacyApiUrl = (endpoint: string): string => {
  return `${LEGACY_API_URL}${endpoint}`;
};
