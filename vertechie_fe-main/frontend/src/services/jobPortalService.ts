/**
 * Job Portal Service
 * API calls and data management for the job portal
 * Now with Backend API Integration
 */

import { API_ENDPOINTS, API_BASE_URL } from '../config/api';
import { getAccessToken } from './apiClient';
import {
  Job,
  JobFormData,
  Application,
  ApplicationStatus,
  CodingAnswer,
} from '../types/jobPortal';

// API Helper - Get auth token
const getAuthToken = (): string | null => {
  return (
    getAccessToken() ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('token')
  );
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

  // Prevent double slashes when joining API_BASE_URL and endpoint
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const response = await fetch(url, {
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

const parseApiError = async (response: Response, fallback: string): Promise<string> => {
  const errorData = await response.json().catch(() => ({} as any));
  return errorData?.detail || fallback;
};

// ==================== JOB API (Backend + Fallback) ====================

export const jobService = {
  // Get all active jobs (for users)
  getAllActiveJobs: async (): Promise<Job[]> => {
    const response = await apiRequest(API_ENDPOINTS.JOBS.LIST);
    if (!response.ok) {
      throw new Error(await parseApiError(response, 'Failed to load jobs'));
    }
    const data = await response.json();
    return data.map(mapBackendJobToFrontend);
  },

  // Get jobs by HR (for HR dashboard)
  getJobsByHR: async (hrUserId: string): Promise<Job[]> => {
    const response = await apiRequest(`${API_ENDPOINTS.JOBS.LIST}?posted_by=${hrUserId}`);
    if (!response.ok) {
      throw new Error(await parseApiError(response, 'Failed to load recruiter jobs'));
    }
    const data = await response.json();
    return data.map(mapBackendJobToFrontend);
  },

  // Get job by ID
  getJobById: async (jobId: string): Promise<Job | null> => {
    const response = await apiRequest(API_ENDPOINTS.JOBS.GET(jobId));
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(await parseApiError(response, 'Failed to load job details'));
    }
    const data = await response.json();
    return mapBackendJobToFrontend(data);
  },

   // Get saved (bookmarked) job IDs from backend - GET /jobs/saved
  getSavedJobs: async (): Promise<Job[]> => {
    const response = await apiRequest(API_ENDPOINTS.JOBS.SAVED_LIST);
    if (!response.ok) {
      throw new Error(await parseApiError(response, 'Failed to load saved jobs'));
    }
    const data = await response.json();
    return Array.isArray(data) ? data.map(mapBackendJobToFrontend) : [];
  },

  // Save (bookmark) a job - POST /jobs/saved with body { job_id }
  saveJob: async (jobId: string): Promise<void> => {
    const response = await apiRequest(API_ENDPOINTS.JOBS.SAVED_LIST, {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to save job');
    }
  },

  // Unsave (remove bookmark) - DELETE /jobs/saved/{job_id}
  unsaveJob: async (jobId: string): Promise<void> => {
    const response = await apiRequest(API_ENDPOINTS.JOBS.SAVED_DELETE(jobId), { method: 'DELETE' });
    if (!response.ok && response.status !== 204) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to unsave job');
    }
  },

  // Create a new job
  createJob: async (jobData: JobFormData, hrUserId: string): Promise<Job> => {
    void hrUserId;
    const backendData = mapFrontendJobToBackend(jobData);
    const response = await apiRequest(API_ENDPOINTS.JOBS.CREATE, {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
    if (!response.ok) {
      throw new Error(await parseApiError(response, 'Failed to create job'));
    }
    const data = await response.json();
    return mapBackendJobToFrontend(data);
  },

  // Update a job
  updateJob: async (jobId: string, jobData: Partial<JobFormData>): Promise<Job | null> => {
    const backendData = mapFrontendJobToBackend(jobData as JobFormData);
    const response = await apiRequest(API_ENDPOINTS.JOBS.UPDATE(jobId), {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(await parseApiError(response, 'Failed to update job'));
    }
    const data = await response.json();
    return mapBackendJobToFrontend(data);
  },

  // Close a job
  closeJob: async (jobId: string): Promise<boolean> => {
    const response = await apiRequest(API_ENDPOINTS.JOBS.UPDATE(jobId), {
      method: 'PUT',
      body: JSON.stringify({ status: 'closed' }),
    });
    if (response.status === 404) return false;
    if (!response.ok) {
      throw new Error(await parseApiError(response, 'Failed to close job'));
    }
    return true;
  },

  // Reopen a job
  reopenJob: async (jobId: string): Promise<boolean> => {
    const response = await apiRequest(`${API_ENDPOINTS.JOBS.LIST}/${jobId}/publish`, {
      method: 'POST',
    });
    if (response.status === 404) return false;
    if (!response.ok) {
      throw new Error(await parseApiError(response, 'Failed to reopen job'));
    }
    return true;
  },

  // Delete a job
  deleteJob: async (jobId: string): Promise<boolean> => {
    const response = await apiRequest(API_ENDPOINTS.JOBS.DELETE(jobId), {
      method: 'DELETE',
    });
    if (response.status === 404) return false;
    if (!response.ok && response.status !== 204) {
      throw new Error(await parseApiError(response, 'Failed to delete job'));
    }
    return true;
  },
};

// Helper: Map backend job format to frontend format
const normalizeBackendTimestamp = (value: unknown): string => {
  if (!value || typeof value !== 'string') return '';

  let ts = value.trim();
  if (!ts) return ts;

  // Backend sometimes sends spaces instead of 'T' (e.g. 2026-02-24 10:15:00)
  if (!ts.includes('T') && ts.includes(' ')) {
    ts = ts.replace(' ', 'T');
  }

  // Backend sends UTC naive timestamps.
  // Treat those explicitly as UTC to avoid local-time drift in UI "x hours ago".
  const hasTimezone = /([zZ]|[+\-]\d{2}:?\d{2})$/.test(ts);
  if (!hasTimezone) return `${ts}Z`;
  
  return ts;
};

const mapBackendJobToFrontend = (backendJob: any): Job => {
  return {
    id: backendJob.id,
    title: backendJob.title,
    companyName: backendJob.company_name || backendJob.companyName,
    description: backendJob.description || '',
    requiredSkills: backendJob.skills_required || backendJob.required_skills || backendJob.requiredSkills || [],
    experienceLevel: backendJob.experience_level || backendJob.experienceLevel || 'entry',
    location: backendJob.location || '',
    jobType: (backendJob.job_type || backendJob.jobType || 'full-time').replace('_', '-'),
    codingQuestions: backendJob.coding_questions || backendJob.codingQuestions || [],
    screeningQuestions: backendJob.screening_questions || backendJob.screeningQuestions || [],
    collect_applicant_location: Boolean(backendJob.collect_applicant_location ?? backendJob.collectApplicantLocation ?? false),
    status: backendJob.status === 'published' ? 'active' : (backendJob.status || 'active'),
    createdBy: backendJob.posted_by_id || backendJob.createdBy,
    createdAt: normalizeBackendTimestamp(backendJob.created_at || backendJob.createdAt),
    updatedAt: normalizeBackendTimestamp(backendJob.updated_at || backendJob.updatedAt),
    applicantCount: backendJob.applications_count || backendJob.applicantCount || 0,
    rating: typeof backendJob.rating === 'number'
      ? backendJob.rating
      : (typeof backendJob.company_rating === 'number' ? backendJob.company_rating : undefined),
    salary_min: backendJob.salary_min,
    salary_max: backendJob.salary_max,
    is_remote: backendJob.is_remote,
    views_count: backendJob.views_count || 0,
  };
};

// Helper: Map frontend job format to backend format
const mapFrontendJobToBackend = (frontendJob: JobFormData): any => {
  const explicitScreeningQuestions = frontendJob.screeningQuestions;
  const parseTypeFromDescription = (description?: string): 'text' | 'yesno' | 'multiple' | 'number' => {
    const raw = String(description || '').toLowerCase();
    const match = raw.match(/type:\s*([a-z_]+)/);
    const type = (match?.[1] || '').replace('_', '');
    if (type === 'yesno') return 'yesno';
    if (type === 'multiple' || type === 'multiplechoice' || type === 'mcq') return 'multiple';
    if (type === 'number' || type === 'numeric') return 'number';
    return 'text';
  };

  const parseOptionsFromDescription = (description?: string): string[] => {
    const raw = String(description || '');
    const match = raw.match(/Options:\s*([^|]+)/i);
    if (!match?.[1]) return [];
    return match[1]
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const parseRequiredFromDescription = (description?: string): boolean => {
    const raw = String(description || '').toLowerCase();
    if (raw.includes('(required)')) return true;
    if (raw.includes('(optional)') || raw.includes('(not required)')) return false;
    return true;
  };

  const fallbackScreeningQuestions = (frontendJob.codingQuestions || []).map((q, index) => ({
    id: q.id || String(index + 1),
    question: q.question,
    type: parseTypeFromDescription(q.description),
    required: parseRequiredFromDescription(q.description),
    options: parseOptionsFromDescription(q.description),
  }));

  const screeningQuestions = Array.isArray(explicitScreeningQuestions) && explicitScreeningQuestions.length > 0
    ? explicitScreeningQuestions
    : fallbackScreeningQuestions;

  return {
    title: frontendJob.title,
    company_name: frontendJob.companyName || 'Company',
    description: frontendJob.description || 'Job Description',
    short_description: frontendJob.description?.substring(0, 200) || null,
    skills_required: frontendJob.requiredSkills || [],
    experience_level: frontendJob.experienceLevel || 'mid',
    location: frontendJob.location || 'Remote',
    job_type: (frontendJob.jobType || 'full_time').replace('-', '_'),
    is_remote: frontendJob.location?.toLowerCase().includes('remote') || false,
    salary_min: frontendJob.salaryMin || null,
    salary_max: frontendJob.salaryMax || null,
    collect_applicant_location: Boolean(frontendJob.collect_applicant_location ?? frontendJob.collectApplicantLocation),
    hiring_countries: frontendJob.hiringCountries ?? [],
    work_authorizations: frontendJob.workAuthorizations ?? [],
    open_for_sponsorship: frontendJob.openForSponsorship ?? undefined,
    // Keep a single source of truth to avoid duplicate questions on user side.
    coding_questions: [],
    screening_questions: screeningQuestions,
    status: 'published',
  };
};

// ==================== APPLICATION API ====================

export const applicationService = {
  // Apply for a job - Uses Backend API
  applyForJob: async (
    jobId: string,
    userId: string,
    candidateName: string,
    candidateEmail: string,
    codingAnswers: CodingAnswer[],
    applicantLocation?: { lat: number; lng: number } | null
  ): Promise<Application> => {
    void userId;
    void candidateName;
    void candidateEmail;
    const answersDict: Record<string, string> = {};
    codingAnswers.forEach((answer) => {
      answersDict[answer.questionId] = answer.code || '';
    });

    const response = await apiRequest(API_ENDPOINTS.JOBS.APPLY(jobId), {
      method: 'POST',
      body: JSON.stringify({
        cover_letter: '',
        resume_url: '',
        answers: answersDict,
        applicant_location_lat: applicantLocation?.lat ?? null,
        applicant_location_lng: applicantLocation?.lng ?? null,
      }),
    });
    if (!response.ok) {
      throw new Error(await parseApiError(response, 'Failed to submit application'));
    }
    const data = await response.json();
    return mapBackendApplicationToFrontend(data);
  },

  // Get applications for a job (HR) - Uses Backend API
  getApplicationsByJob: async (jobId: string): Promise<Application[]> => {
    const response = await apiRequest(API_ENDPOINTS.JOBS.APPLICATIONS(jobId));
    if (!response.ok) {
      throw new Error(await parseApiError(response, 'Failed to load applications'));
    }
    const data = await response.json();
    return data.map(mapBackendApplicationToFrontend);
  },

  // Get applications by user (Techie) - Uses Backend API
  getApplicationsByUser: async (userId: string): Promise<Application[]> => {
    void userId;
    const response = await apiRequest(API_ENDPOINTS.JOBS.MY_APPLICATIONS);
    if (!response.ok) {
      throw new Error(await parseApiError(response, 'Failed to load my applications'));
    }
    const data = await response.json();
    return data.map(mapBackendApplicationToFrontend);
  },

  // Update application status (HR) - Uses Backend API
  updateApplicationStatus: async (
    applicationId: string,
    status: ApplicationStatus
  ): Promise<Application | null> => {
    const response = await apiRequest(`/jobs/applications/${applicationId}/status?new_status=${encodeURIComponent(status)}`, {
      method: 'PUT',
    });
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(await parseApiError(response, 'Failed to update application status'));
    }
    const data = await response.json();
    // Some endpoints return only {"message": "..."} after status update.
    if (!data || typeof data !== 'object' || !('id' in data)) return null;
    return mapBackendApplicationToFrontend(data);
  },

  // Check if user has applied for a job
  hasUserApplied: async (jobId: string, userId: string): Promise<boolean> => {
    void userId;
    const response = await apiRequest(API_ENDPOINTS.JOBS.MY_APPLICATIONS);
    if (!response.ok) return false;
    const apps = await response.json();
    return Array.isArray(apps) && apps.some((app: any) => String(app.job_id || app.jobId) === String(jobId));
  },

  // Get application by ID
  getApplicationById: async (applicationId: string): Promise<Application | null> => {
    const response = await apiRequest(API_ENDPOINTS.JOBS.MY_APPLICATIONS);
    if (!response.ok) return null;
    const data = await response.json();
    const found = Array.isArray(data) ? data.find((app: any) => String(app.id) === String(applicationId)) : null;
    return found ? mapBackendApplicationToFrontend(found) : null;
  },
};

// Helper: Map backend application format to frontend format
const mapBackendApplicationToFrontend = (backendApp: any): Application => {
  // Extract applicant details from nested applicant object (new format)
  const applicant = backendApp.applicant || {};
  const applicantName = applicant.first_name 
    ? `${applicant.first_name} ${applicant.last_name || ''}`.trim()
    : backendApp.applicant_name || backendApp.candidateName || 'Applicant';
  const applicantEmail = applicant.email || backendApp.applicant_email || backendApp.candidateEmail || '';
  
  return {
    id: backendApp.id,
    jobId: backendApp.job_id || backendApp.jobId,
    userId: backendApp.applicant_id || backendApp.user_id || backendApp.userId,
    candidateName: applicantName,
    candidateEmail: applicantEmail,
    appliedAt: normalizeBackendTimestamp(
      backendApp.submitted_at || backendApp.appliedAt || backendApp.created_at
    ),
    status: backendApp.status || 'applied',
    codingAnswers: backendApp.answers || [],
    codingScore: backendApp.match_score || backendApp.rating,
    codingStatus: backendApp.coding_status || 'pending',
    job: backendApp.job ? mapBackendJobToFrontend(backendApp.job) : undefined,
    // Skill matching fields from backend
    match_score: backendApp.match_score,
    matched_skills: backendApp.matched_skills || [],
    missing_skills: backendApp.missing_skills || [],
    // Include additional applicant details for display
    applicantDetails: applicant.id ? {
      id: applicant.id,
      firstName: applicant.first_name,
      lastName: applicant.last_name,
      email: applicant.email,
      phone: applicant.phone || applicant.mobile_number,
      title: applicant.title || applicant.headline,
      skills: applicant.skills || [],
      experienceYears: applicant.experience_years,
      location: applicant.location || applicant.address,
      avatarUrl: applicant.avatar_url,
    } : undefined,
  };
};

// ==================== HR USER HELPER ====================

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
  if (!userDataString) {
    return null;
  }

  try {
    const userData = JSON.parse(userDataString);
    if (!userData?.id || !userData?.email) {
      return null;
    }
    return {
      id: userData.id.toString(),
      name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email || 'User',
      email: userData.email,
    };
  } catch {
    return null;
  }
};

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
    void jobId;
    void userId;
    void userName;
    void userEmail;
    void message;
    throw new Error('Job interest API is not implemented on backend yet');
  },
  
  // Get interests by user
  getInterestsByUser: async (userId: string): Promise<JobInterest[]> => {
    void userId;
    return [];
  },
  
  // Get interests for a job (for HR)
  getInterestsByJob: async (jobId: string): Promise<JobInterest[]> => {
    void jobId;
    return [];
  },
  
  // Get all interests for HR's jobs
  getInterestsForHR: async (hrUserId: string): Promise<JobInterest[]> => {
    void hrUserId;
    return [];
  },
  
  // Check if user has expressed interest
  hasExpressedInterest: async (jobId: string, userId: string): Promise<boolean> => {
    void jobId;
    void userId;
    return false;
  },
  
  // Update interest status (for HR)
  updateInterestStatus: async (
    interestId: string,
    status: 'pending' | 'viewed' | 'contacted'
  ): Promise<boolean> => {
    void interestId;
    void status;
    return false;
  },
};

// ==================== USER/CANDIDATE SERVICE ====================

export interface Candidate {
  id: string; // Application ID when from job applications, User ID otherwise
  applicationId?: string; // Explicit job application ID (for scheduling interviews)
  userId?: string; // User ID (for profile navigation)
  name: string;
  email: string;
  phone?: string;
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
      throw new Error(await parseApiError(response, 'Failed to load users'));
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to load users');
    }
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
    const response = await apiRequest(API_ENDPOINTS.JOBS.APPLICATIONS(jobId));
    if (!response.ok) {
      throw new Error(await parseApiError(response, 'Failed to load job candidates'));
    }
    const applications = await response.json();
    if (!applications || applications.length === 0) return [];
    return applications.map((app: any) => ({
      id: app.id,
      applicationId: app.id,
      userId: app.applicant_id,
      name: app.applicant?.first_name
        ? `${app.applicant.first_name} ${app.applicant.last_name || ''}`.trim()
        : app.applicant_name || 'Applicant',
      email: app.applicant?.email || app.applicant_email || '',
      phone: app.applicant?.phone || app.applicant?.mobile_number || '',
      avatar: app.applicant?.avatar_url || undefined,
      title: app.applicant?.title || app.applicant?.headline || '',
      experience: app.applicant?.total_experience || '',
      skills: app.applicant?.skills || [],
      matchScore: app.match_score ?? 0,
      status: mapApplicationStatus(app.status),
      appliedAt: app.submitted_at || app.created_at,
      location: app.applicant?.location || '',
      education: app.applicant?.education || '',
      currentCompany: app.applicant?.current_company || '',
    }));
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
    matchScore: user.match_score || 0, // Use actual match score from backend
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
