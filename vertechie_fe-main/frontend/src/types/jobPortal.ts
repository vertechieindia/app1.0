/**
 * Job Portal Types
 * Types for job postings, applications, coding questions, and related entities
 */

// Coding Question Types
export interface CodingQuestion {
  id: string;
  question: string;
  description: string;
  testCases?: TestCase[];
  difficulty: 'easy' | 'medium' | 'hard';
  expectedOutput?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
}

// Job Types
export interface Job {
  id: string;
  title: string;
  companyName: string;
  description: string;
  requiredSkills: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  location: string;
  jobType: 'full-time' | 'internship' | 'part-time' | 'contract';
  codingQuestions: CodingQuestion[];
  status: 'active' | 'closed' | 'draft';
  createdBy: string; // HR user ID
  createdAt: string;
  updatedAt: string;
  applicantCount: number;
  // Additional fields
  salary_min?: number;
  salary_max?: number;
  views_count?: number;
  screeningQuestions?: ScreeningQuestion[];
  responsibilities?: string;
  is_remote?: boolean;
}

export interface ScreeningQuestion {
  id: string;
  question: string;
  expectedOutput?: string;
}

export interface JobFormData {
  title: string;
  companyName: string;
  description: string;
  requiredSkills: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  location: string;
  jobType: 'full-time' | 'internship' | 'part-time' | 'contract';
  codingQuestions: CodingQuestion[];
}

// Application Types
export type ApplicationStatus = 'applied' | 'shortlisted' | 'rejected' | 'hired';

export interface CodingAnswer {
  questionId: string;
  code: string;
  language: string;
  submittedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  job?: Job;
  userId: string;
  candidateName: string;
  candidateEmail: string;
  appliedAt: string;
  status: ApplicationStatus;
  codingAnswers: CodingAnswer[];
  codingScore?: number;
  codingStatus: 'pending' | 'submitted' | 'evaluated';
}

// HR Dashboard Types
export interface HRUser {
  id: string;
  name: string;
  email: string;
  companyName: string;
}

// Filter Types
export interface JobFilters {
  search?: string;
  jobType?: string;
  experienceLevel?: string;
  location?: string;
}

export interface ApplicantFilters {
  status?: ApplicationStatus;
  search?: string;
}

// Experience Level Labels
export const EXPERIENCE_LEVELS: Record<string, string> = {
  entry: 'Entry Level (0-2 years)',
  mid: 'Mid Level (2-5 years)',
  senior: 'Senior Level (5-8 years)',
  lead: 'Lead/Principal (8+ years)',
};

// Job Type Labels
export const JOB_TYPES: Record<string, string> = {
  'full-time': 'Full-time',
  'internship': 'Internship',
  'part-time': 'Part-time',
  'contract': 'Contract',
};

// Application Status Labels
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
  hired: 'Hired',
};

// Difficulty Labels
export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};


