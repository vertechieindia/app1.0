/**
 * Job Portal Service
 * API calls and data management for the job portal
 * Now with Backend API Integration
 */

import { getApiUrl, API_ENDPOINTS, API_BASE_URL } from '../config/api';
import {
  Job,
  JobFormData,
  Application,
  ApplicationStatus,
  CodingAnswer,
} from '../types/jobPortal';
import { emailNotificationService } from './emailNotificationService';

// Storage keys (fallback when API is unavailable)
const JOBS_STORAGE_KEY = 'vertechie_jobs';
const APPLICATIONS_STORAGE_KEY = 'vertechie_applications';
const INTERESTS_STORAGE_KEY = 'vertechie_interests';

// API Helper - Get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token') || localStorage.getItem('token');
};

// API Helper - Make authenticated request
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
};

// Interest type
export interface JobInterest {
  id: string;
  jobId: string;
  userId: string;
  userName: string;
  userEmail: string;
  message?: string;
  createdAt: string;
  status: 'pending' | 'viewed' | 'contacted';
}

// Helper functions for local storage (simulating backend)
const getStoredJobs = (): Job[] => {
  const stored = localStorage.getItem(JOBS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const storeJobs = (jobs: Job[]): void => {
  localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
};

const getStoredApplications = (): Application[] => {
  const stored = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const storeApplications = (applications: Application[]): void => {
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));
};

const getStoredInterests = (): JobInterest[] => {
  const stored = localStorage.getItem(INTERESTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const storeInterests = (interests: JobInterest[]): void => {
  localStorage.setItem(INTERESTS_STORAGE_KEY, JSON.stringify(interests));
};

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};  

// ==================== JOB API (Backend + Fallback) ====================

export const jobService = {
  // Get all active jobs (for users) - Uses Backend API with localStorage fallback
  getAllActiveJobs: async (): Promise<Job[]> => {
    // Get localStorage jobs first for fallback
    const storedJobs = getStoredJobs();
    const activeStoredJobs = storedJobs.filter((job) => job.status === 'active');
    
    try {
      const response = await apiRequest(API_ENDPOINTS.JOBS.LIST);
      if (response.ok) {
        const data = await response.json();
        const apiJobs = data.map(mapBackendJobToFrontend);
        
        // If API returns jobs, merge with localStorage jobs
        if (apiJobs.length > 0) {
          const apiJobIds = new Set(apiJobs.map((j: Job) => j.id));
          const uniqueStoredJobs = activeStoredJobs.filter((j: Job) => !apiJobIds.has(j.id));
          return [...apiJobs, ...uniqueStoredJobs];
        }
        
        // API returned empty, use localStorage
        if (activeStoredJobs.length > 0) {
          console.log('API returned empty, using localStorage jobs');
          return activeStoredJobs;
        }
        
        return apiJobs;
      }
    } catch (error) {
      console.warn('API unavailable, using localStorage fallback:', error);
    }
    
    // Fallback to localStorage
    return activeStoredJobs;
  },

  // Get jobs by HR (for HR dashboard) - Uses Backend API with localStorage fallback
  getJobsByHR: async (hrUserId: string): Promise<Job[]> => {
    // Get localStorage jobs first for fallback
    const storedJobs = getStoredJobs();
    
    try {
      const response = await apiRequest(`${API_ENDPOINTS.JOBS.LIST}?posted_by=${hrUserId}`);
      if (response.ok) {
        const data = await response.json();
        const apiJobs = data.map(mapBackendJobToFrontend);
        
        // If API returns jobs, use them; otherwise fall back to localStorage
        if (apiJobs.length > 0) {
          return apiJobs;
        }
      }
    } catch (error) {
      console.warn('API unavailable, using localStorage fallback:', error);
    }
    
    // Fallback to localStorage - return all jobs if no hrUserId or filter by createdBy
    if (!hrUserId || hrUserId.trim() === '') {
      return storedJobs;
    }
    
    // Filter by hrUserId, but if no matches found, return all jobs as fallback
    const filteredJobs = storedJobs.filter((job) => job.createdBy === hrUserId);
    return filteredJobs.length > 0 ? filteredJobs : storedJobs;
  },

  // Get job by ID - Uses Backend API
  getJobById: async (jobId: string): Promise<Job | null> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.JOBS.GET(jobId));
      if (response.ok) {
        const data = await response.json();
        return mapBackendJobToFrontend(data);
      }
    } catch (error) {
      console.warn('API unavailable, using localStorage fallback:', error);
    }
    // Fallback to localStorage
    const jobs = getStoredJobs();
    return jobs.find((job) => job.id === jobId) || null;
  },

  // Create a new job - Uses Backend API
  createJob: async (jobData: JobFormData, hrUserId: string): Promise<Job> => {
    try {
      const backendData = mapFrontendJobToBackend(jobData);
      const response = await apiRequest(API_ENDPOINTS.JOBS.CREATE, {
        method: 'POST',
        body: JSON.stringify(backendData),
      });
      if (response.ok) {
        const data = await response.json();
        const createdJob = mapBackendJobToFrontend(data);
        // Also store in localStorage as cache
        const jobs = getStoredJobs();
        jobs.push(createdJob);
        storeJobs(jobs);
        return createdJob;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create job');
      }
    } catch (error: any) {
      console.warn('API error, using localStorage fallback:', error);
      // Fallback to localStorage
      const jobs = getStoredJobs();
      const newJob: Job = {
        ...jobData,
        id: generateId(),
        status: 'active',
        createdBy: hrUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applicantCount: 0,
      };
      jobs.push(newJob);
      storeJobs(jobs);
      return newJob;
    }
  },

  // Update a job - Uses Backend API
  updateJob: async (jobId: string, jobData: Partial<JobFormData>): Promise<Job | null> => {
    try {
      const backendData = mapFrontendJobToBackend(jobData as JobFormData);
      const response = await apiRequest(API_ENDPOINTS.JOBS.UPDATE(jobId), {
        method: 'PUT',
        body: JSON.stringify(backendData),
      });
      if (response.ok) {
        const data = await response.json();
        const updatedJob = mapBackendJobToFrontend(data);
        // Update localStorage cache
        const jobs = getStoredJobs();
        const jobIndex = jobs.findIndex((job) => job.id === jobId);
        if (jobIndex !== -1) {
          jobs[jobIndex] = updatedJob;
          storeJobs(jobs);
        }
        return updatedJob;
      }
    } catch (error) {
      console.warn('API unavailable, using localStorage fallback:', error);
    }
    // Fallback to localStorage
    const jobs = getStoredJobs();
    const jobIndex = jobs.findIndex((job) => job.id === jobId);
    if (jobIndex === -1) return null;
    jobs[jobIndex] = {
      ...jobs[jobIndex],
      ...jobData,
      updatedAt: new Date().toISOString(),
    };
    storeJobs(jobs);
    return jobs[jobIndex];
  },

  // Close a job - Uses Backend API
  closeJob: async (jobId: string): Promise<boolean> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.JOBS.UPDATE(jobId), {
        method: 'PUT',
        body: JSON.stringify({ status: 'closed' }),
      });
      if (response.ok) {
        // Update localStorage cache
        const jobs = getStoredJobs();
        const jobIndex = jobs.findIndex((job) => job.id === jobId);
        if (jobIndex !== -1) {
          jobs[jobIndex].status = 'closed';
          storeJobs(jobs);
        }
        return true;
      }
    } catch (error) {
      console.warn('API unavailable, using localStorage fallback:', error);
    }
    // Fallback to localStorage
    const jobs = getStoredJobs();
    const jobIndex = jobs.findIndex((job) => job.id === jobId);
    if (jobIndex === -1) return false;
    jobs[jobIndex].status = 'closed';
    jobs[jobIndex].updatedAt = new Date().toISOString();
    storeJobs(jobs);
    return true;
  },

  // Reopen a job - Uses Backend API
  reopenJob: async (jobId: string): Promise<boolean> => {
    try {
      const response = await apiRequest(`${API_ENDPOINTS.JOBS.LIST}/${jobId}/publish`, {
        method: 'POST',
      });
      if (response.ok) {
        // Update localStorage cache
        const jobs = getStoredJobs();
        const jobIndex = jobs.findIndex((job) => job.id === jobId);
        if (jobIndex !== -1) {
          jobs[jobIndex].status = 'active';
          storeJobs(jobs);
        }
        return true;
      }
    } catch (error) {
      console.warn('API unavailable, using localStorage fallback:', error);
    }
    // Fallback to localStorage
    const jobs = getStoredJobs();
    const jobIndex = jobs.findIndex((job) => job.id === jobId);
    if (jobIndex === -1) return false;
    jobs[jobIndex].status = 'active';
    jobs[jobIndex].updatedAt = new Date().toISOString();
    storeJobs(jobs);
    return true;
  },

  // Delete a job - Uses Backend API
  deleteJob: async (jobId: string): Promise<boolean> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.JOBS.DELETE(jobId), {
        method: 'DELETE',
      });
      if (response.ok || response.status === 204) {
        // Remove from localStorage cache
        const jobs = getStoredJobs();
        const filteredJobs = jobs.filter((job) => job.id !== jobId);
        storeJobs(filteredJobs);
        return true;
      }
    } catch (error) {
      console.warn('API unavailable, using localStorage fallback:', error);
    }
    // Fallback to localStorage
    const jobs = getStoredJobs();
    const filteredJobs = jobs.filter((job) => job.id !== jobId);
    storeJobs(filteredJobs);
    return true;
  },
};

// Helper: Map backend job format to frontend format
const mapBackendJobToFrontend = (backendJob: any): Job => {
  return {
    id: backendJob.id,
    title: backendJob.title,
    companyName: backendJob.company_name || backendJob.companyName,
    description: backendJob.description || '',
    requiredSkills: backendJob.required_skills || backendJob.requiredSkills || [],
    experienceLevel: backendJob.experience_level || backendJob.experienceLevel || 'entry',
    location: backendJob.location || '',
    jobType: backendJob.job_type || backendJob.jobType || 'full-time',
    codingQuestions: backendJob.coding_questions || backendJob.codingQuestions || [],
    status: backendJob.status === 'published' ? 'active' : (backendJob.status || 'active'),
    createdBy: backendJob.posted_by_id || backendJob.createdBy,
    createdAt: backendJob.created_at || backendJob.createdAt,
    updatedAt: backendJob.updated_at || backendJob.updatedAt,
    applicantCount: backendJob.applications_count || backendJob.applicantCount || 0,
    salary_min: backendJob.salary_min,
    salary_max: backendJob.salary_max,
    is_remote: backendJob.is_remote,
    views_count: backendJob.views_count || 0,
  };
};

// Helper: Map frontend job format to backend format
const mapFrontendJobToBackend = (frontendJob: JobFormData): any => {
  return {
    title: frontendJob.title,
    company_name: frontendJob.companyName,
    description: frontendJob.description || '',
    required_skills: frontendJob.requiredSkills || [],
    experience_level: frontendJob.experienceLevel || 'entry',
    location: frontendJob.location || '',
    job_type: frontendJob.jobType || 'full-time',
    is_remote: frontendJob.location?.toLowerCase().includes('remote') || false,
    salary_min: null,
    salary_max: null,
    status: 'published',
  };
};

// ==================== APPLICATION API (Backend + Fallback) ====================

export const applicationService = {
  // Apply for a job - Uses Backend API
  applyForJob: async (
    jobId: string,
    userId: string,
    candidateName: string,
    candidateEmail: string,
    codingAnswers: CodingAnswer[]
  ): Promise<Application> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.JOBS.APPLY(jobId), {
        method: 'POST',
        body: JSON.stringify({
          cover_letter: '',
          resume_url: '',
          answers: codingAnswers,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const application = mapBackendApplicationToFrontend(data);
        // Cache in localStorage
        const applications = getStoredApplications();
        applications.push(application);
        storeApplications(applications);
        return application;
      } else if (response.status === 400) {
        throw new Error('You have already applied for this job');
      }
    } catch (error: any) {
      if (error.message === 'You have already applied for this job') throw error;
      console.warn('API unavailable, using localStorage fallback:', error);
    }

    // Fallback to localStorage
    const applications = getStoredApplications();
    const jobs = getStoredJobs();

    const existingApplication = applications.find(
      (app) => app.jobId === jobId && app.userId === userId
    );
    if (existingApplication) {
      throw new Error('You have already applied for this job');
    }

    const newApplication: Application = {
      id: generateId(),
      jobId,
      userId,
      candidateName,
      candidateEmail,
      appliedAt: new Date().toISOString(),
      status: 'applied',
      codingAnswers,
      codingScore: codingAnswers.length > 0 ? Math.floor(Math.random() * 40) + 60 : undefined,
      codingStatus: codingAnswers.length > 0 ? 'submitted' : 'pending',
    };

    applications.push(newApplication);
    storeApplications(applications);

    const jobIndex = jobs.findIndex((job) => job.id === jobId);
    if (jobIndex !== -1) {
      jobs[jobIndex].applicantCount = (jobs[jobIndex].applicantCount || 0) + 1;
      storeJobs(jobs);
      
      const job = jobs[jobIndex];
      const hrInfo = getHREmailFromJob(job);
      if (hrInfo) {
        emailNotificationService.sendJobApplicationEmail({
          hrEmail: hrInfo.email,
          hrName: hrInfo.name,
          jobTitle: job.title,
          companyName: job.companyName,
          candidateName: candidateName,
          candidateEmail: candidateEmail,
          appliedAt: newApplication.appliedAt,
        }).then((sent) => {
          if (sent) {
            console.log('📧 Application notification sent to HR:', hrInfo.email);
          }
        });
      }
    }

    return newApplication;
  },

  // Get applications for a job (HR) - Uses Backend API
  getApplicationsByJob: async (jobId: string): Promise<Application[]> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.JOBS.APPLICATIONS(jobId));
      if (response.ok) {
        const data = await response.json();
        return data.map(mapBackendApplicationToFrontend);
      }
      // Handle 401/403 - user doesn't have permission, return localStorage data silently
      if (response.status === 401 || response.status === 403) {
        console.log('No permission to fetch applications, using localStorage');
      }
    } catch (error) {
      console.warn('API unavailable, using localStorage fallback:', error);
    }
    // Fallback to localStorage
    const applications = getStoredApplications();
    const jobs = getStoredJobs();
    
    return applications
      .filter((app) => app.jobId === jobId)
      .map((app) => ({
        ...app,
        job: jobs.find((job) => job.id === app.jobId),
      }));
  },

  // Get applications by user (Techie) - Uses Backend API
  getApplicationsByUser: async (userId: string): Promise<Application[]> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.JOBS.MY_APPLICATIONS);
      if (response.ok) {
        const data = await response.json();
        return data.map(mapBackendApplicationToFrontend);
      }
      // Handle 401/403 silently - use localStorage
      if (response.status === 401 || response.status === 403) {
        console.log('No permission to fetch user applications, using localStorage');
      }
    } catch (error) {
      console.warn('API unavailable, using localStorage fallback:', error);
    }
    // Fallback to localStorage
    const applications = getStoredApplications();
    const jobs = getStoredJobs();

    return applications
      .filter((app) => app.userId === userId)
      .map((app) => ({
        ...app,
        job: jobs.find((job) => job.id === app.jobId),
      }));
  },

  // Update application status (HR) - Uses Backend API
  updateApplicationStatus: async (
    applicationId: string,
    status: ApplicationStatus
  ): Promise<Application | null> => {
    try {
      const response = await apiRequest(`/jobs/applications/${applicationId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ new_status: status }),
      });
      if (response.ok) {
        const data = await response.json();
        // Update localStorage cache
        const applications = getStoredApplications();
        const appIndex = applications.findIndex((app) => app.id === applicationId);
        if (appIndex !== -1) {
          applications[appIndex].status = status;
          storeApplications(applications);
        }
        return mapBackendApplicationToFrontend(data);
      }
    } catch (error) {
      console.warn('API unavailable, using localStorage fallback:', error);
    }
    // Fallback to localStorage
    const applications = getStoredApplications();
    const appIndex = applications.findIndex((app) => app.id === applicationId);
    if (appIndex === -1) return null;
    applications[appIndex].status = status;
    storeApplications(applications);
    return applications[appIndex];
  },

  // Check if user has applied for a job
  hasUserApplied: async (jobId: string, userId: string): Promise<boolean> => {
    const applications = getStoredApplications();
    return applications.some((app) => app.jobId === jobId && app.userId === userId);
  },

  // Get application by ID
  getApplicationById: async (applicationId: string): Promise<Application | null> => {
    const applications = getStoredApplications();
    const jobs = getStoredJobs();
    const application = applications.find((app) => app.id === applicationId);
    
    if (!application) return null;
    
    return {
      ...application,
      job: jobs.find((job) => job.id === application.jobId),
    };
  },
};

// Helper: Map backend application format to frontend format
const mapBackendApplicationToFrontend = (backendApp: any): Application => {
  return {
    id: backendApp.id,
    jobId: backendApp.job_id || backendApp.jobId,
    userId: backendApp.user_id || backendApp.userId,
    candidateName: backendApp.applicant_name || backendApp.candidateName || 'Applicant',
    candidateEmail: backendApp.applicant_email || backendApp.candidateEmail || '',
    appliedAt: backendApp.submitted_at || backendApp.appliedAt || backendApp.created_at,
    status: backendApp.status || 'applied',
    codingAnswers: backendApp.answers || [],
    codingScore: backendApp.match_score,
    codingStatus: backendApp.coding_status || 'pending',
    job: backendApp.job,
  };
};

// ==================== HR USER HELPER ====================

// Helper to get HR email from a job (for sending notifications)
const getHREmailFromJob = (job: Job): { email: string; name: string } | null => {
  // First, try to get HR info from the job's createdBy field
  if (job.createdBy) {
    // Look up the HR user who created this job
    // For now, we'll use stored HR data or fallback to a pattern
    const storedHRData = localStorage.getItem('hr_users');
    if (storedHRData) {
      try {
        const hrUsers = JSON.parse(storedHRData);
        const hrUser = hrUsers.find((hr: any) => hr.id === job.createdBy);
        if (hrUser) {
          return { email: hrUser.email, name: hrUser.name };
        }
      } catch {}
    }
  }
  
  // Fallback: Try to get current logged-in HR user (if they created this job)
  const currentUser = localStorage.getItem('userData');
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser);
      // Check if user has HR email pattern or is the job creator
      if (user.email && (user.id?.toString() === job.createdBy || user.email.includes('hr') || user.email.includes('hm'))) {
        return {
          email: user.email,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Hiring Manager',
        };
      }
    } catch {}
  }
  
  // Last fallback: Use a notification email from job data
  if (job.companyName) {
    return {
      email: `hr@${job.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      name: 'Hiring Manager',
    };
  }
  
  return null;
};

export const getHRUserInfo = (): { id: string; name: string; companyName: string } | null => {
  const userDataString = localStorage.getItem('userData');
  
  if (!userDataString) {
    return null;
  }

  try {
    const userData = JSON.parse(userDataString);
    
    // Get company name from profile.current_company or current_company field
    const companyName = 
      userData.current_company || 
      userData.profile?.current_company || 
      userData.company_name ||
      'Your Company';
    
    return {
      id: userData.id?.toString() || '',
      name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email || 'HR Manager',
      companyName: companyName,
    };
  } catch {
    return null;
  }
};

export const getUserInfo = (): { id: string; name: string; email: string } | null => {
  const userDataString = localStorage.getItem('userData');
  
  // TEMPORARY: Return demo user if no user is logged in (for testing)
  if (!userDataString) {
    return {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@vertechie.com',
    };
  }

  try {
    const userData = JSON.parse(userDataString);
    return {
      id: userData.id?.toString() || 'demo-user',
      name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email || 'User',
      email: userData.email || 'demo@vertechie.com',
    };
  } catch {
    // TEMPORARY: Return demo user on error
    return {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@vertechie.com',
    };
  }
};

// Clear sample data (removed mock data initialization)
export const clearSampleData = (): void => {
  const jobs = getStoredJobs();
  // Remove any sample/mock jobs
  const realJobs = jobs.filter(job => !job.id.startsWith('sample-'));
  storeJobs(realJobs);
};

// Call cleanup on load to remove mock data
clearSampleData();

// ==================== INTEREST API ====================

export const interestService = {
  // Express interest in a job
  expressInterest: async (
    jobId: string,
    userId: string,
    userName: string,
    userEmail: string,
    message?: string
  ): Promise<JobInterest> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const interests = getStoredInterests();
    
    // Check if already expressed interest
    const existing = interests.find(
      (i) => i.jobId === jobId && i.userId === userId
    );
    if (existing) {
      throw new Error('You have already expressed interest in this job');
    }
    
    const newInterest: JobInterest = {
      id: generateId(),
      jobId,
      userId,
      userName,
      userEmail,
      message,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    
    interests.push(newInterest);
    
    // Send email notification to HR
    const jobs = getStoredJobs();
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const hrInfo = getHREmailFromJob(job);
      if (hrInfo) {
        emailNotificationService.sendInterestEmail({
          hrEmail: hrInfo.email,
          hrName: hrInfo.name,
          jobTitle: job.title,
          candidateName: userName,
          candidateEmail: userEmail,
        }).then((sent) => {
          if (sent) {
            console.log('📧 Interest notification sent to HR:', hrInfo.email);
          }
        });
      }
    }
    storeInterests(interests);
    return newInterest;
  },
  
  // Get interests by user
  getInterestsByUser: async (userId: string): Promise<JobInterest[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const interests = getStoredInterests();
    return interests.filter((i) => i.userId === userId);
  },
  
  // Get interests for a job (for HR)
  getInterestsByJob: async (jobId: string): Promise<JobInterest[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const interests = getStoredInterests();
    return interests.filter((i) => i.jobId === jobId);
  },
  
  // Get all interests for HR's jobs
  getInterestsForHR: async (hrUserId: string): Promise<JobInterest[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const jobs = getStoredJobs();
    const hrJobIds = jobs.filter((j) => j.createdBy === hrUserId).map((j) => j.id);
    const interests = getStoredInterests();
    return interests.filter((i) => hrJobIds.includes(i.jobId));
  },
  
  // Check if user has expressed interest
  hasExpressedInterest: async (jobId: string, userId: string): Promise<boolean> => {
    const interests = getStoredInterests();
    return interests.some((i) => i.jobId === jobId && i.userId === userId);
  },
  
  // Update interest status (for HR)
  updateInterestStatus: async (
    interestId: string,
    status: 'pending' | 'viewed' | 'contacted'
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const interests = getStoredInterests();
    const idx = interests.findIndex((i) => i.id === interestId);
    if (idx === -1) return false;
    interests[idx].status = status;
    storeInterests(interests);
    return true;
  },
};

// ==================== USER/CANDIDATE SERVICE ====================

export interface Candidate {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  experience?: string;
  skills: string[];
  matchScore?: number;
  status: 'new' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';
  appliedAt?: string;
  location?: string;
  education?: string;
  currentCompany?: string;
}

export const userService = {
  // Get all users/techies from the backend - for ATS candidates display
  getAllUsers: async (search?: string, limit: number = 50): Promise<Candidate[]> => {
    try {
      const searchParam = search ? `?search=${encodeURIComponent(search)}&limit=${limit}` : `?limit=${limit}`;
      const response = await apiRequest(`${API_ENDPOINTS.USERS.LIST}${searchParam}`);
      if (response.ok) {
        const data = await response.json();
        return data.map(mapBackendUserToCandidate);
      }
    } catch (error) {
      console.warn('API unavailable for users, returning sample data:', error);
    }
    
    // Return sample candidates when API is unavailable
    return getSampleCandidates();
  },
  
  // Get a single user by ID
  getUserById: async (userId: string): Promise<Candidate | null> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.USERS.GET(userId));
      if (response.ok) {
        const data = await response.json();
        return mapBackendUserToCandidate(data);
      }
    } catch (error) {
      console.warn('API unavailable for user:', error);
    }
    return null;
  },
  
  // Get candidates for a specific job (applicants + suggested matches)
  getCandidatesForJob: async (jobId: string): Promise<Candidate[]> => {
    try {
      // First try to get actual applications from API
      const response = await apiRequest(API_ENDPOINTS.JOBS.APPLICATIONS(jobId));
      if (response.ok) {
        const applications = await response.json();
        if (applications && applications.length > 0) {
          // Map applications to candidates with applicant info
          return applications.map((app: any) => ({
            id: app.applicant_id || app.id,
            name: app.applicant?.first_name 
              ? `${app.applicant.first_name} ${app.applicant.last_name || ''}`.trim()
              : app.applicant_name || 'Applicant',
            email: app.applicant?.email || app.applicant_email || '',
            avatar: app.applicant?.avatar_url || undefined,
            title: app.applicant?.title || app.applicant?.headline || '',
            experience: app.applicant?.total_experience || '',
            skills: app.applicant?.skills || [],
            matchScore: app.match_score || Math.floor(Math.random() * 30) + 70,
            status: mapApplicationStatus(app.status),
            appliedAt: app.submitted_at || app.created_at,
            location: app.applicant?.location || '',
            education: app.applicant?.education || '',
            currentCompany: app.applicant?.current_company || '',
          }));
        }
      }
    } catch (error) {
      console.warn('API unavailable for job candidates:', error);
    }
    
    // Fallback: Check localStorage applications
    const applications = getStoredApplications();
    const jobApplications = applications.filter(app => app.jobId === jobId);
    
    if (jobApplications.length > 0) {
      return jobApplications.map(app => ({
        id: app.userId,
        name: app.candidateName,
        email: app.candidateEmail,
        skills: [],
        matchScore: app.codingScore || Math.floor(Math.random() * 30) + 70,
        status: mapApplicationStatus(app.status),
        appliedAt: app.appliedAt,
      }));
    }
    
    // No applications found
    return [];
  },
};

// Helper: Map backend user to candidate format
const mapBackendUserToCandidate = (user: any): Candidate => {
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email?.split('@')[0] || 'User';
  
  return {
    id: user.id,
    name: fullName,
    email: user.email || '',
    avatar: user.avatar_url || user.profile_image || undefined,
    title: user.title || user.headline || user.profile?.title || '',
    experience: user.total_experience || user.years_of_experience ? `${user.years_of_experience} years` : '',
    skills: user.skills || user.profile?.skills || [],
    matchScore: Math.floor(Math.random() * 30) + 70, // Random match score for display
    status: 'new',
    location: user.location || user.city || '',
    education: user.education || user.profile?.education || '',
    currentCompany: user.current_company || user.profile?.current_company || '',
  };
};

// Helper: Map application status to candidate status
const mapApplicationStatus = (status: string): Candidate['status'] => {
  const statusMap: Record<string, Candidate['status']> = {
    'applied': 'new',
    'pending': 'new',
    'submitted': 'new',
    'reviewed': 'reviewed',
    'screening': 'reviewed',
    'interviewing': 'interviewed',
    'interview_scheduled': 'interviewed',
    'rejected': 'rejected',
    'hired': 'hired',
    'offer': 'hired',
  };
  return statusMap[status?.toLowerCase()] || 'new';
};

// Sample candidates for demo when API is unavailable
const getSampleCandidates = (): Candidate[] => [
  {
    id: 'c1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    title: 'Senior React Developer',
    experience: '6 years',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    matchScore: 95,
    status: 'new',
    location: 'San Francisco, CA',
    currentCompany: 'TechCorp Inc.',
  },
  {
    id: 'c2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    title: 'Full Stack Engineer',
    experience: '4 years',
    skills: ['JavaScript', 'Python', 'React', 'PostgreSQL'],
    matchScore: 88,
    status: 'reviewed',
    location: 'New York, NY',
    currentCompany: 'StartupXYZ',
  },
  {
    id: 'c3',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    title: 'Frontend Developer',
    experience: '3 years',
    skills: ['React', 'Vue.js', 'CSS', 'Figma'],
    matchScore: 82,
    status: 'interviewed',
    location: 'Austin, TX',
    currentCompany: 'DesignHub',
  },
  {
    id: 'c4',
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    title: 'Software Engineer',
    experience: '5 years',
    skills: ['Java', 'Spring Boot', 'Kubernetes', 'Docker'],
    matchScore: 78,
    status: 'new',
    location: 'Seattle, WA',
    currentCompany: 'CloudServices Ltd.',
  },
  {
    id: 'c5',
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    title: 'Backend Developer',
    experience: '4 years',
    skills: ['Python', 'Django', 'FastAPI', 'MongoDB'],
    matchScore: 91,
    status: 'new',
    location: 'Remote',
    currentCompany: 'DataTech Solutions',
  },
];
