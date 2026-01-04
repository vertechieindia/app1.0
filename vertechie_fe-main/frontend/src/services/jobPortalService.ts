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

// Storage keys
const JOBS_STORAGE_KEY = 'vertechie_jobs';
const APPLICATIONS_STORAGE_KEY = 'vertechie_applications';

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

export const getHRUserInfo = (): { id: string; name: string; companyName: string } | null => {
  const userDataString = localStorage.getItem('userData');
  
  // TEMPORARY: Return demo HR user if no user is logged in (for testing)
  if (!userDataString) {
    return {
      id: 'demo-hr',
      name: 'Demo HR Manager',
      companyName: 'Vertechie Inc.',
    };
  }

  try {
    const userData = JSON.parse(userDataString);
    return {
      id: userData.id?.toString() || 'demo-hr',
      name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email || 'HR Manager',
      companyName: userData.company_name || 'Vertechie Inc.',
    };
  } catch {
    // TEMPORARY: Return demo user on error
    return {
      id: 'demo-hr',
      name: 'Demo HR Manager',
      companyName: 'Vertechie Inc.',
    };
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

// Initialize with sample data if empty
export const initializeSampleData = (): void => {
  const jobs = getStoredJobs();
  if (jobs.length === 0) {
    const sampleJobs: Job[] = [
      {
        id: 'sample-1',
        title: 'Senior React Developer',
        companyName: 'TechCorp Solutions',
        description: 'We are looking for an experienced React developer to join our frontend team. You will be working on cutting-edge web applications using React, TypeScript, and modern frontend technologies.',
        requiredSkills: ['React', 'TypeScript', 'Redux', 'REST APIs', 'CSS/SASS'],
        experienceLevel: 'senior',
        location: 'Remote',
        jobType: 'full-time',
        codingQuestions: [
          {
            id: 'q1',
            question: 'Implement a debounce function',
            description: 'Write a debounce function that delays invoking the provided function until at least ms milliseconds have passed since the last time it was invoked.',
            difficulty: 'medium',
          },
          {
            id: 'q2',
            question: 'Build a custom React hook for API calls',
            description: 'Create a custom React hook called useApi that handles loading states, errors, and data fetching.',
            difficulty: 'medium',
          },
        ],
        status: 'active',
        createdBy: 'hr-1',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        applicantCount: 12,
      },
      {
        id: 'sample-2',
        title: 'Full Stack Developer Intern',
        companyName: 'StartupXYZ',
        description: 'Join our fast-growing startup as a Full Stack Developer Intern. Great opportunity to learn and grow with hands-on experience in modern web development.',
        requiredSkills: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'Git'],
        experienceLevel: 'entry',
        location: 'New York, NY',
        jobType: 'internship',
        codingQuestions: [
          {
            id: 'q3',
            question: 'Reverse a string',
            description: 'Write a function that reverses a string without using the built-in reverse method.',
            difficulty: 'easy',
          },
        ],
        status: 'active',
        createdBy: 'hr-2',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        applicantCount: 28,
      },
      {
        id: 'sample-3',
        title: 'Python Backend Engineer',
        companyName: 'DataDriven Inc.',
        description: 'We need a skilled Python developer to help build and maintain our data processing pipelines and API services.',
        requiredSkills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'],
        experienceLevel: 'mid',
        location: 'San Francisco, CA',
        jobType: 'full-time',
        codingQuestions: [],
        status: 'active',
        createdBy: 'hr-1',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        applicantCount: 8,
      },
    ];
    storeJobs(sampleJobs);
  }
};

// Call initialization
initializeSampleData();

