/**
 * API Client Service
 * Centralized HTTP client for FastAPI backend communication
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '../config/api';

// Token storage keys
// Support both old and new token keys for compatibility
const ACCESS_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const LEGACY_ACCESS_TOKEN_KEY = 'vertechie_access_token';
const LEGACY_REFRESH_TOKEN_KEY = 'vertechie_refresh_token';

// Types
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  /** OAuth2 password / refresh responses may omit this */
  expires_in?: number;
}

export interface ApiError {
  error: string;
  detail?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds - increased for slow database operations
});

// Request interceptor - Add auth token; for FormData, drop Content-Type so browser sets multipart/form-data with boundary
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Background/polling requests: do not redirect to login on 401 so header/nav polling doesn't kick user out
const isBackgroundPollingRequest = (url?: string) =>
  !!url && (url.includes('unread-count') || url.includes('notifications/unread-count'));

/** Full path for matching (handles relative `url` + `baseURL`, or absolute `url`). */
function getRequestPath(config: AxiosRequestConfig | undefined): string {
  if (!config?.url) return '';
  if (/^https?:\/\//i.test(config.url)) return config.url;
  const base = (config.baseURL ?? '').replace(/\/+$/, '');
  const path = config.url.startsWith('/') ? config.url : `/${config.url}`;
  return base ? `${base}${path}` : path;
}

/**
 * 401 on these routes means wrong credentials / invalid registration payload / bad reset token —
 * not an expired access token. Do not run refresh flow or redirect to login (that hides errors and can corrupt tokens).
 */
function isPublicAuthFailure401(config: AxiosRequestConfig | undefined): boolean {
  const path = getRequestPath(config);
  return /\/auth\/(login|register|token|forgot-password|reset-password)(?:\?|$)/i.test(path);
}

function rejectWithParsedApiError(error: AxiosError<ApiError>): Promise<never> {
  const data = error.response?.data as { detail?: unknown; error?: string } | undefined;
  let errorMessage = error.message || 'An error occurred';
  if (data) {
    if (typeof data.detail === 'string') {
      errorMessage = data.detail;
    } else if (Array.isArray(data.detail) && data.detail[0] && typeof data.detail[0] === 'object') {
      const first = data.detail[0] as { msg?: string };
      if (first.msg) errorMessage = first.msg;
    } else if (typeof data.error === 'string') {
      errorMessage = data.error;
    }
  }
  const err = new Error(errorMessage) as Error & { status?: number };
  err.status = error.response?.status;
  return Promise.reject(err);
}

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (!originalRequest) {
      return rejectWithParsedApiError(error);
    }

    // Handle 401 - Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isPublicAuthFailure401(originalRequest)) {
        return rejectWithParsedApiError(error);
      }
      originalRequest._retry = true;

      // Check if this is a job creation/update request - handle differently
      const isJobRequest = originalRequest.url?.includes('/jobs');
      const isPolling = isBackgroundPollingRequest(originalRequest.url);
      
      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const response = await axios.post<AuthTokens>(
            `${API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const { access_token, refresh_token } = response.data;
          setTokens(access_token, refresh_token);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return apiClient(originalRequest);
        } else {
          // No refresh token available
          clearTokens();
          
          if (isJobRequest) {
            return Promise.reject(new Error('Session expired. Please refresh the page and try again.'));
          }
          if (isPolling) {
            return Promise.reject(new Error('Authentication required'));
          }
          
          window.location.href = '/login';
          return Promise.reject(new Error('Authentication required'));
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens
        clearTokens();
        
        if (isJobRequest) {
          return Promise.reject(new Error('Session expired. Please refresh the page and try again.'));
        }
        if (isPolling) {
          return Promise.reject(refreshError);
        }
        
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return rejectWithParsedApiError(error);
  }
);

// Token management
export const getAccessToken = (): string | null => {
  // Check new key first, then legacy key for compatibility
  return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(LEGACY_ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  // Check new key first, then legacy key for compatibility
  return localStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem(LEGACY_REFRESH_TOKEN_KEY);
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  // Store in both new and legacy keys for compatibility
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(LEGACY_ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(LEGACY_REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// API methods
export const api = {
  /**
   * GET request
   */
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.get(url, config);
    return response.data;
  },

  /**
   * POST request
   */
  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.post(url, data, config);
    return response.data;
  },

  /**
   * PUT request
   */
  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.put(url, data, config);
    return response.data;
  },

  /**
   * PATCH request
   */
  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.patch(url, data, config);
    return response.data;
  },

  /**
   * DELETE request
   */
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.delete(url, config);
    return response.data;
  },

  /**
   * Upload file
   */
  upload: async <T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);

    const response: AxiosResponse<T> = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  },
};

export default apiClient;

