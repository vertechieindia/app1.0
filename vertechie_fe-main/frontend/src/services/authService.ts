/**
 * Authentication Service
 * Handles user authentication with FastAPI backend
 */

import { api, setTokens, clearTokens, AuthTokens } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  full_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  skills: string[];
  experience_years: number;
  current_position: string | null;
  current_company: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  portfolio_url: string | null;
  open_to_work: boolean;
  connections_count: number;
  followers_count: number;
  karma_points: number;
}

// Auth service
export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<User> => {
    return api.post<User>(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    // FastAPI OAuth2 expects form data
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const tokens = await api.post<AuthTokens>(API_ENDPOINTS.AUTH.LOGIN, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Store tokens
    setTokens(tokens.access_token, tokens.refresh_token);
    return tokens;
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>(API_ENDPOINTS.AUTH.ME);
  },

  /**
   * Logout user
   */
  logout: (): void => {
    clearTokens();
    window.location.href = '/login';
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const tokens = await api.post<AuthTokens>(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    });
    setTokens(tokens.access_token, tokens.refresh_token);
    return tokens;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    return api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
  },
};

export default authService;

