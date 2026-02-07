/**
 * API Configuration for FastAPI Backend
 * Centralized base URL and API endpoints
 */

// Environment-based API URL
const getBaseUrl = (): string => {
  // In local development, always talk to the Vite proxy at /api/v1
  // so we don't depend on VITE_API_URL being set correctly.
  if (import.meta.env.DEV) {
    return '/api/v1';
  }

  // In non-dev environments, prefer explicit VITE_API_URL
  const rawEnv = import.meta.env.VITE_API_URL as string | undefined;
  if (rawEnv) {
    const base = rawEnv.replace(/\/+$/, ''); // trim trailing slashes

    // If it already includes /api/v1 anywhere, trust it as-is
    if (base.includes('/api/v1')) {
      return base;
    }

    // If it ends with /api, upgrade to /api/v1
    if (/\/api$/i.test(base)) {
      return `${base}/v1`;
    }

    // Otherwise, append /api/v1 so FastAPI routes like /auth, /users, /companies work
    return `${base}/api/v1`;
  }

  // Production default (API host)
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
  COMPANY: '/companies/',
  COMPANY_SIGNUP: '/companies/signup',
  SCHOOL_SIGNUP: '/schools/signup',

  // ============================================
  // CMS (Company Management System)
  // ============================================
  CMS: {
    MY_COMPANY: '/users/me/company',
    COMPANY: (id: string) => `/companies/${id}`,
    UPDATE_COMPANY: (id: string) => `/companies/${id}`,
    TEAM_MEMBERS: (id: string) => `/companies/${id}/team-members`,
    ADD_TEAM_MEMBER: (id: string) => `/companies/${id}/team-members`,
    INVITE_TEAM_MEMBER: (id: string) => `/companies/${id}/team-members/invite`,
    DELETE_TEAM_MEMBER: (id: string, memberId: string) => `/companies/${id}/team-members/${memberId}`,
    JOBS: (id: string) => `/companies/${id}/jobs`, // Added from instruction
    ADMINS: (id: string) => `/companies/${id}/admins`,
    ADD_ADMIN: (id: string) => `/companies/${id}/admins`,
    REMOVE_ADMIN: (id: string, adminId: string) => `/companies/${id}/admins/${adminId}`,
    UNVERIFIED_EMPLOYEES: (id: string) => `/companies/${id}/unverified-employees`,
    VERIFY_EMPLOYEE: (cid: string, eid: string) => `/companies/${cid}/verify-experience/${eid}`,
    POSTS: (id: string) => `/companies/${id}/posts/`,
    CREATE_POST: (id: string) => `/companies/${id}/posts/`,
    LIKE_POST: (id: string) => `/community/posts/${id}/like`,
    GET_COMMENTS: (id: string) => `/community/posts/${id}/comments`,
    ADD_COMMENT: (id: string) => `/community/posts/${id}/comments`,
    UPDATE_POST: (id: string) => `/community/posts/${id}`,
    UPLOAD: '/community/upload/',
    STATS: (id: string) => `/companies/${id}/stats`,
  },

  // ============================================
  // SMS (School Management System)
  // ============================================
  SMS: {
    MY_SCHOOL: '/users/me/school',
    POSTS: (id: string) => `/schools/${id}/posts/`,
    CREATE_POST: (id: string) => `/schools/${id}/posts/`,
    MEMBERS: (id: string) => `/schools/${id}/members`,
    INVITE_MEMBER: (id: string) => `/schools/${id}/members/invite`,
    VERIFY_MEMBER: (schoolId: string, memberId: string) => `/schools/${schoolId}/members/${memberId}/verify`,
    PROGRAMS: (schoolId: string) => `/schools/${schoolId}/programs`,
    ADD_PROGRAM: (schoolId: string) => `/schools/${schoolId}/programs`,
    UPDATE_PROGRAM: (schoolId: string, programId: string) => `/schools/${schoolId}/programs/${programId}`,
    DELETE_PROGRAM: (schoolId: string, programId: string) => `/schools/${schoolId}/programs/${programId}`,
    ADMINS: (schoolId: string) => `/schools/${schoolId}/admins`,
    ADD_ADMIN: (schoolId: string) => `/schools/${schoolId}/admins`,
    REMOVE_ADMIN: (schoolId: string, adminId: string) => `/schools/${schoolId}/admins/${adminId}`,
    UPDATE_SCHOOL: (schoolId: string) => `/schools/${schoolId}`,
  },

  // Additional top-level endpoints used across the app
  GROUPS: '/groups/',
  PERMISSIONS: '/permissions/',
  BLOCKED_PROFILES: '/blocked-profiles/',
  PENDING_APPROVALS: '/pending-approvals/',
  ADMINS: '/admins/',
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
    GET: (id: string) => `/jobs/${id}`,
    UPDATE: (id: string) => `/jobs/${id}`,
    DELETE: (id: string) => `/jobs/${id}`,
    APPLY: (id: string) => `/jobs/${id}/apply`,
    APPLICATIONS: (id: string) => `/jobs/${id}/applications/`,
    /** POST /jobs/saved with body { job_id }; GET /jobs/saved returns list of saved jobs */
    SAVED_LIST: '/jobs/saved',
    SAVED_DELETE: (jobId: string) => `/jobs/saved/${jobId}`,
    MY_APPLICATIONS: '/jobs/my/applications/',
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
    // Backend expects unread-count under conversations path
    UNREAD_COUNT: '/chat/conversations/unread-count',
    MARK_READ: (conversationId: string) => `/chat/conversations/${conversationId}/mark-read`,
  },

  // ============================================
  // GITHUB / GITLAB (activity / contributions)
  // ============================================
  GITHUB_GITLAB: {
    CONTRIBUTIONS: '/github-gitlab/contributions',
    STATUS: '/github-gitlab/status',
    // GitHub OAuth
    GITHUB_AUTH: '/github-gitlab/github/auth',
    GITHUB_CALLBACK: '/github-gitlab/github/callback',
    GITHUB_DISCONNECT: '/github-gitlab/github/disconnect',
    GITHUB_STATUS: '/github-gitlab/github/status',
    // GitLab OAuth (same as GitHub)
    GITLAB_AUTH: '/github-gitlab/gitlab/auth',
    GITLAB_CALLBACK: '/github-gitlab/gitlab/callback',
    GITLAB_DISCONNECT: '/github-gitlab/gitlab/disconnect',
    GITLAB_STATUS: '/github-gitlab/gitlab/status',
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
    UPLOAD: '/community/upload',
    POSTS: '/community/posts',
    CREATE_POST: '/community/posts',
    LIKE_POST: (id: string) => `/community/posts/${id}/like`,
    COMMENTS: (postId: string) => `/community/posts/${postId}/comments`,
    ADD_COMMENT: (postId: string) => `/community/posts/${postId}/comments`,
    EVENTS: '/community/events',
    CREATE_EVENT: '/community/events',
    REGISTER_EVENT: (id: string) => `/community/events/${id}/register`,
    COMBINATOR_IDEAS: '/community/combinator/ideas',
    SUBMIT_IDEA: '/community/combinator/ideas',
    CONNECT_FOUNDER: (id: string) => `/community/combinator/ideas/${id}/connect`,
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
