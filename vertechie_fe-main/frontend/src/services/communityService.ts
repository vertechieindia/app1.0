/**
 * Community Service
 * Handles groups and posts operations with FastAPI backend
 */

import { api } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Types
export interface Group {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  member_count: number;
  post_count: number;
  category: string | null;
}

export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
  };
  content: string;
  media_urls: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_pinned: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
  };
  content: string;
  likes_count: number;
  replies_count: number;
  created_at: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  avatar_url?: string;
  cover_url?: string;
  type?: 'public' | 'private' | 'secret';
  category?: string;
  tags?: string[];
}

export interface CreatePostData {
  content: string;
  content_html?: string;
  group_id?: string;
  media_urls?: string[];
  visibility?: 'public' | 'connections' | 'private';
  link_url?: string;
}

export interface CreateCommentData {
  content: string;
  parent_id?: string;
}

export interface GroupListParams {
  skip?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export interface PostListParams {
  skip?: number;
  limit?: number;
  group_id?: string;
}

// Community service
export const communityService = {
  /**
   * List groups
   */
  getGroups: async (params?: GroupListParams): Promise<Group[]> => {
    return api.get<Group[]>(API_ENDPOINTS.COMMUNITY.GROUPS, { params });
  },

  /**
   * Create a new group
   */
  createGroup: async (data: CreateGroupData): Promise<{ id: string; slug: string }> => {
    return api.post(API_ENDPOINTS.COMMUNITY.CREATE_GROUP, data);
  },

  /**
   * Join a group
   */
  joinGroup: async (groupId: string): Promise<{ message: string }> => {
    return api.post(API_ENDPOINTS.COMMUNITY.JOIN_GROUP(groupId));
  },

  /**
   * List posts (feed)
   */
  getPosts: async (params?: PostListParams): Promise<Post[]> => {
    return api.get<Post[]>(API_ENDPOINTS.COMMUNITY.POSTS, { params });
  },

  /**
   * Create a new post
   */
  createPost: async (data: CreatePostData): Promise<{ id: string }> => {
    return api.post(API_ENDPOINTS.COMMUNITY.CREATE_POST, data);
  },

  /**
   * Like/unlike a post
   */
  likePost: async (postId: string): Promise<{ likes_count: number }> => {
    return api.post(API_ENDPOINTS.COMMUNITY.LIKE_POST(postId));
  },

  /**
   * Get comments on a post
   */
  getComments: async (postId: string, params?: { skip?: number; limit?: number }): Promise<Comment[]> => {
    return api.get<Comment[]>(API_ENDPOINTS.COMMUNITY.COMMENTS(postId), { params });
  },

  /**
   * Add a comment to a post
   */
  addComment: async (postId: string, data: CreateCommentData): Promise<{ id: string }> => {
    return api.post(API_ENDPOINTS.COMMUNITY.ADD_COMMENT(postId), data);
  },
};

export default communityService;

