/**
 * Combinator Service
 * Handles startup ideas and founder matching with FastAPI backend
 */

import { api } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Types
export interface StartupIdea {
  id: string;
  founder_id: string;
  founder_name?: string;
  title: string;
  description: string;
  problem: string;
  target_market?: string;
  stage: string;
  commitment: string;
  funding_status?: string;
  roles_needed: string[];
  skills_needed: string[];
  team_size: number;
  founder_roles: string[];
  founder_skills: string[];
  views_count: number;
  connections_count: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateIdeaData {
  title: string;
  description: string;
  problem: string;
  target_market?: string;
  stage?: string;
  commitment?: string;
  funding_status?: string;
  roles_needed?: string[];
  skills_needed?: string[];
  team_size?: number;
  founder_roles?: string[];
  founder_skills?: string[];
  founder_commitment?: string;
  founder_funding?: string;
}

export interface IdeaListParams {
  skip?: number;
  limit?: number;
  stage?: string;
}

// Combinator service
export const combinatorService = {
  /**
   * List startup ideas
   */
  getIdeas: async (params?: IdeaListParams): Promise<StartupIdea[]> => {
    return api.get<StartupIdea[]>(API_ENDPOINTS.COMMUNITY.COMBINATOR_IDEAS, { params });
  },

  /**
   * Submit a startup idea
   */
  submitIdea: async (data: CreateIdeaData): Promise<StartupIdea> => {
    return api.post<StartupIdea>(API_ENDPOINTS.COMMUNITY.SUBMIT_IDEA, data);
  },

  /**
   * Connect with a founder
   */
  connectFounder: async (ideaId: string): Promise<{ message: string }> => {
    return api.post(API_ENDPOINTS.COMMUNITY.CONNECT_FOUNDER(ideaId));
  },
};

export default combinatorService;
