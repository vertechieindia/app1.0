/**
 * Job Portal Service
 * API calls and data management for the job portal
 */

import { getApiUrl, API_ENDPOINTS } from '../config/api';
import {
  Job,
  JobFormData,
  Application,
  ApplicationStatus,
  CodingAnswer,
} from '../types/jobPortal';
import { emailNotificationService } from './emailNotificationService';

// Storage keys
const JOBS_STORAGE_KEY = 'vertechie_jobs';
const APPLICATIONS_STORAGE_KEY = 'vertechie_applications';
const INTERESTS_STORAGE_KEY = 'vertechie_interests';

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

// ==================== JOB API ====================

export const jobService = {
  // Get all active jobs (for users)
  getAllActiveJobs: async (): Promise<Job[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    const jobs = getStoredJobs();
    return jobs.filter((job) => job.status === 'active');
  },

  // Get jobs by HR (for HR dashboard)
  getJobsByHR: async (hrUserId: string): Promise<Job[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const jobs = getStoredJobs();
    return jobs.filter((job) => job.createdBy === hrUserId);
  },

  // Get job by ID
  getJobById: async (jobId: string): Promise<Job | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const jobs = getStoredJobs();
    return jobs.find((job) => job.id === jobId) || null;
  },

  // Create a new job
  createJob: async (jobData: JobFormData, hrUserId: string): Promise<Job> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
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
  },

  // Update a job
  updateJob: async (jobId: string, jobData: Partial<JobFormData>): Promise<Job | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
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

  // Close a job
  closeJob: async (jobId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const jobs = getStoredJobs();
    const jobIndex = jobs.findIndex((job) => job.id === jobId);

    if (jobIndex === -1) return false;

    jobs[jobIndex].status = 'closed';
    jobs[jobIndex].updatedAt = new Date().toISOString();
    storeJobs(jobs);
    return true;
  },

  // Reopen a job
  reopenJob: async (jobId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const jobs = getStoredJobs();
    const jobIndex = jobs.findIndex((job) => job.id === jobId);

    if (jobIndex === -1) return false;

    jobs[jobIndex].status = 'active';
    jobs[jobIndex].updatedAt = new Date().toISOString();
    storeJobs(jobs);
    return true;
  },

  // Delete a job
  deleteJob: async (jobId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const jobs = getStoredJobs();
    const filteredJobs = jobs.filter((job) => job.id !== jobId);
    storeJobs(filteredJobs);
    return true;
  },
};

// ==================== APPLICATION API ====================

export const applicationService = {
  // Apply for a job
  applyForJob: async (
    jobId: string,
    userId: string,
    candidateName: string,
    candidateEmail: string,
    codingAnswers: CodingAnswer[]
  ): Promise<Application> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const applications = getStoredApplications();
    const jobs = getStoredJobs();

    // Check if already applied
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
      codingScore: codingAnswers.length > 0 ? Math.floor(Math.random() * 40) + 60 : undefined, // Simulated score
      codingStatus: codingAnswers.length > 0 ? 'submitted' : 'pending',
    };

    applications.push(newApplication);
    storeApplications(applications);

    // Update applicant count
    const jobIndex = jobs.findIndex((job) => job.id === jobId);
    if (jobIndex !== -1) {
      jobs[jobIndex].applicantCount = (jobs[jobIndex].applicantCount || 0) + 1;
      storeJobs(jobs);
      
      // Send email notification to HR
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

  // Get applications for a job (HR)
  getApplicationsByJob: async (jobId: string): Promise<Application[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const applications = getStoredApplications();
    const jobs = getStoredJobs();
    
    return applications
      .filter((app) => app.jobId === jobId)
      .map((app) => ({
        ...app,
        job: jobs.find((job) => job.id === app.jobId),
      }));
  },

  // Get applications by user (Techie)
  getApplicationsByUser: async (userId: string): Promise<Application[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const applications = getStoredApplications();
    const jobs = getStoredJobs();

    return applications
      .filter((app) => app.userId === userId)
      .map((app) => ({
        ...app,
        job: jobs.find((job) => job.id === app.jobId),
      }));
  },

  // Update application status (HR)
  updateApplicationStatus: async (
    applicationId: string,
    status: ApplicationStatus
  ): Promise<Application | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
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
    await new Promise((resolve) => setTimeout(resolve, 200));
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

