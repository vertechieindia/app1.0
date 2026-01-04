/**
 * User Service
 * Handles user profile operations with FastAPI backend
 */

import { api } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { User, UserProfile } from './authService';

// Types
export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string;
}

export interface UpdateProfileData {
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  cover_url?: string;
  skills?: string[];
  experience_years?: number;
  current_position?: string;
  current_company?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  portfolio_url?: string;
  open_to_work?: boolean;
  preferred_job_types?: string[];
  preferred_locations?: string[];
}

export interface UserListParams {
  skip?: number;
  limit?: number;
  search?: string;
}

// User service
export const userService = {
  /**
   * List users with optional search
   */
  listUsers: async (params?: UserListParams): Promise<User[]> => {
    return api.get<User[]>(API_ENDPOINTS.USERS.LIST, { params });
  },

  /**
   * Get user by ID
   */
  getUser: async (userId: string): Promise<User> => {
    return api.get<User>(API_ENDPOINTS.USERS.GET(userId));
  },

  /**
   * Update current user
   */
  updateMe: async (data: UpdateUserData): Promise<User> => {
    return api.put<User>(API_ENDPOINTS.USERS.UPDATE_ME, data);
  },

  /**
   * Get user profile
   */
  getProfile: async (userId: string): Promise<UserProfile> => {
    return api.get<UserProfile>(API_ENDPOINTS.USERS.PROFILE(userId));
  },

  /**
   * Update current user's profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    return api.put<UserProfile>(API_ENDPOINTS.USERS.UPDATE_PROFILE, data);
  },
};

export default userService;

