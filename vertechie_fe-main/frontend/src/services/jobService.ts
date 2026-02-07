/**
 * Job Service
 * Handles job operations with FastAPI backend
 */

import { api, PaginatedResponse } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Types
export interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string | null;
  responsibilities: string | null;
  benefits: string | null;
  company_name: string;
  company_logo: string | null;
  location: string | null;
  is_remote: boolean;
  remote_type: string | null;
  job_type: string;
  experience_level: string;
  department: string | null;
  required_skills: string[];
  preferred_skills: string[];
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  show_salary: boolean;
  status: string;
  is_featured: boolean;
  views_count: number;
  applications_count: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobListItem {
  id: string;
  title: string;
  slug: string;
  company_name: string;
  company_logo: string | null;
  location: string | null;
  is_remote: boolean;
  job_type: string;
  experience_level: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  show_salary: boolean;
  is_featured: boolean;
  applications_count: number;
  created_at: string;
}

export interface CreateJobData {
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  company_name: string;
  company_logo?: string;
  location?: string;
  is_remote?: boolean;
  remote_type?: string;
  job_type?: string;
  experience_level?: string;
  department?: string;
  required_skills?: string[];
  preferred_skills?: string[];
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  show_salary?: boolean;
  application_email?: string;
  application_url?: string;
  easy_apply?: boolean;
  expires_at?: string;
}

export interface UpdateJobData extends Partial<CreateJobData> {
  status?: string;
  is_featured?: boolean;
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  status: string;
  cover_letter: string | null;
  resume_url: string | null;
  recruiter_notes: string | null;
  rating: number | null;
  interview_scheduled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplyJobData {
  cover_letter?: string;
  resume_url?: string;
  answers?: Record<string, string>;
  source?: string;
}

export interface JobListParams {
  skip?: number;
  limit?: number;
  search?: string;
  job_type?: string;
  experience_level?: string;
  is_remote?: boolean;
  location?: string;
}

// Job service
export const jobService = {
  /**
   * List jobs with filters
   */
  listJobs: async (params?: JobListParams): Promise<JobListItem[]> => {
    return api.get<JobListItem[]>(API_ENDPOINTS.JOBS.LIST, { params });
  },

  /**
   * Get job by ID
   */
  getJob: async (jobId: string): Promise<Job> => {
    return api.get<Job>(API_ENDPOINTS.JOBS.GET(jobId));
  },

  /**
   * Create a new job posting
   */
  createJob: async (data: CreateJobData): Promise<Job> => {
    return api.post<Job>(API_ENDPOINTS.JOBS.CREATE, data);
  },

  /**
   * Update a job posting
   */
  updateJob: async (jobId: string, data: UpdateJobData): Promise<Job> => {
    return api.put<Job>(API_ENDPOINTS.JOBS.UPDATE(jobId), data);
  },

  /**
   * Delete a job posting
   */
  deleteJob: async (jobId: string): Promise<void> => {
    return api.delete(API_ENDPOINTS.JOBS.DELETE(jobId));
  },

  /**
   * Apply to a job
   */
  applyToJob: async (jobId: string, data: ApplyJobData): Promise<JobApplication> => {
    return api.post<JobApplication>(API_ENDPOINTS.JOBS.APPLY(jobId), data);
  },

  /**
   * Get applications for a job (for job poster)
   */
  getJobApplications: async (jobId: string, params?: { skip?: number; limit?: number }): Promise<JobApplication[]> => {
    return api.get<JobApplication[]>(API_ENDPOINTS.JOBS.APPLICATIONS(jobId), { params });
  },

  /**
   * Get list of saved (bookmarked) jobs
   */
  getSavedJobs: async (): Promise<JobListItem[]> => {
    return api.get<JobListItem[]>(API_ENDPOINTS.JOBS.SAVED_LIST);
  },

  /**
   * Save/bookmark a job - backend expects POST /jobs/saved with body { job_id }
   */
  saveJob: async (jobId: string): Promise<{ message: string }> => {
    return api.post(API_ENDPOINTS.JOBS.SAVED_LIST, { job_id: jobId });
  },

  /**
   * Unsave/remove bookmark - backend expects DELETE /jobs/saved/{job_id}
   */
  unsaveJob: async (jobId: string): Promise<void> => {
    return api.delete(API_ENDPOINTS.JOBS.SAVED_DELETE(jobId));
  },
};

export default jobService;

