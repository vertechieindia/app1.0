/**
 * API Interceptor with automatic 401 handling
 * Redirects to login when token expires
 */

import { getApiUrl } from '../config/api';

/**
 * Fetch wrapper that automatically handles 401 Unauthorized responses
 * by clearing localStorage and redirecting to login
 */
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('authToken');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  // If 401 Unauthorized, token is expired or invalid
  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Session expired. Please login again.');
  }

  return response;
};

/**
 * Handle unauthorized response - clear storage and redirect to login
 */
export const handleUnauthorized = (): void => {
  // Clear all auth-related data
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userData');

  // Store flag to show message on login page
  localStorage.setItem('sessionExpired', 'true');

  // Redirect to login page
  window.location.href = '/login';
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

/**
 * Get auth headers for API calls
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Axios-style interceptor for handling 401 globally
 * Can be used with axios if needed
 */
export const setupAxiosInterceptor = (axios: any): void => {
  axios.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      if (error.response?.status === 401) {
        handleUnauthorized();
      }
      return Promise.reject(error);
    }
  );
};
