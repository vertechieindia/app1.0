/**
 * API Client Service
 * Centralized HTTP client for FastAPI backend communication
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '../config/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'vertechie_access_token';
const REFRESH_TOKEN_KEY = 'vertechie_refresh_token';

// Types
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
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
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

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
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// Token management
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
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

