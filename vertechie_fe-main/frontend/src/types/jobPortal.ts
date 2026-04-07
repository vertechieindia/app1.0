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
  required?: boolean;
  timeLimitMinutes?: number;
  allowedLanguages?: string[];
  sampleInput?: string;
  sampleOutput?: string;
  starterCode?: string;
  /** Optional SQLite DDL for SQL coding tasks (assessment auto-eval). */
  sqlSchema?: string;
  requireFullScreen?: boolean;
  preventTabSwitch?: boolean;
  blockCopyPaste?: boolean;
  autoSubmitOnTimeout?: boolean;
  trackSuspiciousActivity?: boolean;
  maxTabSwitches?: number;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
}

/** POST /jobs/:id/coding-assessment/run — preview execution during assessment */
export interface CodingAssessmentRunResult {
  executionAvailable: boolean;
  message?: string;
  status?: string;
  stdout?: string;
  stderr?: string;
  runtimeMs?: number | null;
  passed?: number | null;
  total?: number | null;
  tests?: Array<{ passed: boolean; input: string; expected: string; actual: string }>;
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
  rating?: number;
  // Additional fields
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  views_count?: number;
  screeningQuestions?: ScreeningQuestion[];
  responsibilities?: string;
  is_remote?: boolean;
  collect_applicant_location?: boolean;
}

export interface ScreeningQuestion {
  id: string;
  question: string;
  type?: 'text' | 'yesno' | 'multiple' | 'number' | 'code' | 'verbal' | 'video';
  required?: boolean;
  options?: string[];
  expectedOutput?: string;
  /** Max recording length for video screening questions (seconds). */
  maxVideoSeconds?: number;
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
  screeningQuestions?: ScreeningQuestion[];
  // Salary fields
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  // Status field
  status?: 'active' | 'closed' | 'draft';
  collect_applicant_location?: boolean;
  collectApplicantLocation?: boolean;
  // Hiring restrictions (passed to backend as hiring_countries, work_authorizations, open_for_sponsorship)
  hiringCountries?: string[];
  workAuthorizations?: string[];
  openForSponsorship?: boolean;
}

// Application Types
export type ApplicationStatus = 'applied' | 'submitted' | 'under_review' | 'shortlisted' | 'interview' | 'offered' | 'onboarding' | 'rejected' | 'hired' | 'withdrawn';

export interface CodingAnswer {
  questionId: string;
  question?: string;
  code: string;
  language: string;
  submittedAt: string;
}

/** One row from `answers.coding_evaluation.questions` (server auto-eval). */
export interface CodingQuestionEvaluation {
  questionId?: string;
  status?: string;
  passed?: number;
  total?: number;
  note?: string;
  language?: string;
}

export interface CodingEvaluationPayload {
  questions?: CodingQuestionEvaluation[];
  evaluated_at?: string;
}

export function getCodingEvalForQuestionId(
  ev: CodingEvaluationPayload | undefined,
  questionId: string
): CodingQuestionEvaluation | undefined {
  const rows = ev?.questions;
  if (!Array.isArray(rows) || !rows.length) return undefined;
  return rows.find((r) => String(r?.questionId ?? '') === String(questionId));
}

/** Short label for recruiters: pass count or reason (no screening data). */
export function formatCodingTestPassSummary(row: CodingQuestionEvaluation | undefined): string {
  if (!row) return '—';
  const p = row.passed;
  const t = row.total;
  if (typeof p === 'number' && typeof t === 'number' && t > 0) {
    return `${p}/${t} passed`;
  }
  const st = String(row.status || '').toUpperCase();
  if (st === 'NO_TESTS') return 'No test cases';
  if (st === 'JUDGE_NOT_CONFIGURED') return 'Auto-eval not configured';
  if (st === 'UNSUPPORTED_FOR_AUTO_EVAL') return 'Language not auto-evaluated';
  if (st === 'ACCEPTED' && typeof p === 'number' && typeof t === 'number' && t === 0) return 'No test cases';
  if (row.note) return row.note;
  return row.status ? String(row.status) : '—';
}

/** Proctoring / integrity payload stored with application answers (job coding assessment). */
export interface AssessmentIntegritySummary {
  tabSwitchCount?: number;
  fullscreenExitCount?: number;
  pasteAttempts?: number;
  copyAttempts?: number;
  rightClickAttempts?: number;
  suspiciousScore?: number;
  autoSubmitted?: boolean;
  completedAt?: string;
  warnings?: string[];
  startedAt?: string;
  totalTimeLimitMinutes?: number;
  timeRemainingSeconds?: number | null;
  /** Tab / integrity events from the screening step (before coding), if any. */
  screening_session?: Record<string, unknown>;
}

/** One screening answer as stored on the application (see `screening_answers` in API). */
export interface ScreeningAnswerDetail {
  questionId: string;
  question?: string;
  code: string;
  language?: string;
  submittedAt?: string;
}

export interface ApplicantDetails {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  title?: string;
  skills: string[];
  experienceYears?: number;
  location?: string;
  avatarUrl?: string;
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
  /** Reserved for automated coding-test score when backend evaluates submissions (not skill match). */
  codingScore?: number;
  codingStatus: 'pending' | 'submitted' | 'evaluated';
  /** Skill vs job required skills (from backend match_score). */
  skillMatchPercent?: number;
  /** Parsed from answers.integrity when present. */
  assessmentIntegrity?: AssessmentIntegritySummary;
  /** Parsed from answers.screening_answers when present. */
  screeningAnswersDetail?: ScreeningAnswerDetail[];
  /** Parsed from answers.screening_integrity (screening step monitoring). */
  screeningIntegrityStage?: Record<string, unknown>;
  /** Automated coding test results per question (`coding_evaluation` from API). */
  codingEvaluation?: CodingEvaluationPayload;
  // Full applicant profile details from backend
  applicantDetails?: ApplicantDetails;
  // Skill matching fields
  match_score?: number;  // Percentage 0-100
  matched_skills?: string[];  // Skills that matched
  missing_skills?: string[];  // Required skills applicant lacks
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
  dateRange?: string;
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
  submitted: 'Submitted',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  interview: 'Interview',
  offered: 'Offered',
  onboarding: 'Onboarding',
  rejected: 'Rejected',
  hired: 'Hired',
  withdrawn: 'Withdrawn',
};

// Difficulty Labels
export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};
