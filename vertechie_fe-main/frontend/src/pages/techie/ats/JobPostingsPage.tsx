/**
 * JobPostingsPage - Manage Job Listings
 * Enhanced with Create, Filter, Edit, and View Applicants functionality
 * Integrated with Backend API
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jobService, applicationService, userService, getHRUserInfo, Candidate } from '../../../services/jobPortalService';
import { Job, Application, type TestCase, type CodingQuestion } from '../../../types/jobPortal';
import { buildAssessmentTemplatePack } from '../../../data/assessmentQuestionTemplate';
import {
  Box, Typography, Card, CardContent, Chip, IconButton, TextField, Button,
  Grid, InputAdornment, Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Menu, Checkbox, FormControlLabel,
  FormGroup, Divider, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, LinearProgress, CircularProgress, Snackbar, Alert, Tabs, Tab, Switch, Tooltip, List, ListItemButton, ListItemText, Autocomplete, FormHelperText, Collapse,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import LinkIcon from '@mui/icons-material/Link';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CancelIcon from '@mui/icons-material/Cancel';
import ATSLayout from './ATSLayout';
import ScheduleInterviewModal, { ScheduleInterviewContext } from '../../../components/ats/ScheduleInterviewModal';
import { interviewService } from '../../../services/interviewService';
import { calendarService } from '../../../services/calendarService';
import {
  API_ENDPOINTS,
  getApiUrl,
  LOCATION_AUTOCOMPLETE_COUNTRY_CODES,
  LOCATION_AUTOCOMPLETE_PER_COUNTRY_LIMIT,
  LOCATION_AUTOCOMPLETE_MERGED_MAX,
} from '../../../config/api';
import { fetchWithAuth } from '../../../utils/apiInterceptor';
import { fetchJobTitleSuggestions } from '../../../utils/jobTitleSuggestions';
import { fetchSkillSuggestions, SUGGESTED_SKILL_CHIPS } from '../../../utils/skillSuggestions';

const JobCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(13, 71, 161, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

const ApplicantRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: alpha('#0d47a1', 0.02),
  },
}));

const MatchBadge = styled(Box)<{ score: number }>(({ score }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px 12px',
  borderRadius: 12,
  fontWeight: 700,
  fontSize: '0.875rem',
  backgroundColor: score >= 80 ? alpha('#34C759', 0.15) : score >= 60 ? alpha('#FF9500', 0.15) : alpha('#FF3B30', 0.15),
  color: score >= 80 ? '#34C759' : score >= 60 ? '#FF9500' : '#FF3B30',
}));

// Helper to format time ago
const formatTimeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  
  const weeks = Math.floor(diffDays / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  
  const months = Math.floor(diffDays / 30);
  return `${months} month${months === 1 ? '' : 's'} ago`;
};

const formatApplicantExperience = (value: unknown): string => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value > 0 ? `${value}+ years` : 'Not specified';
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || 'Not specified';
  }
  return 'Not specified';
};

const formatLocationAtApply = (applicant: DisplayApplicant): string => {
  if (applicant.applicantLocationLat != null && applicant.applicantLocationLng != null) {
    return `${applicant.applicantLocationLat.toFixed(5)}, ${applicant.applicantLocationLng.toFixed(5)}`;
  }

  const snapshot = applicant.applicantLocationIpSnapshot;
  if (snapshot && typeof snapshot === 'object') {
    const city = 'city' in snapshot ? String((snapshot as any).city || '').trim() : '';
    const region = 'region' in snapshot ? String((snapshot as any).region || '').trim() : '';
    const country = 'country' in snapshot ? String((snapshot as any).country || '').trim() : '';
    const locationText = [city, region, country].filter(Boolean).join(', ');
    if (locationText) return locationText;
  }

  return 'Not specified';
};

// Display job interface
interface DisplayJob {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  applicants: number;
  newApplicants: number;
  views: number;
  status: string;
  posted: string;
  postedAt?: string;
  experience?: string;
  experienceLevel?: string;
  description?: string;
  responsibilities?: string;
  skills?: string[];
  requiredSkills?: string[];
  screeningQuestions?: Array<{ id: string; question: string; type?: string; required?: boolean; options?: string[] }>;
  codingQuestions?: CodingAssessmentQuestion[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  hiringCountries?: string[];
  workAuthorizations?: string[];
  openForSponsorship?: boolean | null;
  collectApplicantLocation?: boolean;
}

type ScreeningQuestionType = 'text' | 'yesno' | 'multiple' | 'number' | 'verbal' | 'video';

interface ScreeningQuestion {
  id: string;
  question: string;
  type: ScreeningQuestionType;
  required: boolean;
  options?: string[];
  maxVideoSeconds?: number;
}

interface CodingAssessmentQuestion {
  id: string;
  question: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  required: boolean;
  timeLimitMinutes: number;
  allowedLanguages: string[];
  sampleInput?: string;
  sampleOutput?: string;
  expectedOutput?: string;
  starterCode?: string;
  /** Hidden test cases for auto-eval (stdin/stdout), when present on the job payload. */
  testCases?: TestCase[];
  requireFullScreen: boolean;
  preventTabSwitch: boolean;
  blockCopyPaste: boolean;
  autoSubmitOnTimeout: boolean;
  trackSuspiciousActivity: boolean;
  maxTabSwitches: number;
}

const CODING_LANGUAGE_OPTIONS = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go'];

const createEmptyCodingQuestion = (): CodingAssessmentQuestion => ({
  id: `code-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  question: '',
  description: '',
  difficulty: 'medium',
  required: true,
  timeLimitMinutes: 30,
  allowedLanguages: ['JavaScript', 'Python'],
  sampleInput: '',
  sampleOutput: '',
  expectedOutput: '',
  starterCode: '',
  requireFullScreen: true,
  preventTabSwitch: true,
  blockCopyPaste: true,
  autoSubmitOnTimeout: true,
  trackSuspiciousActivity: true,
  maxTabSwitches: 2,
});

const TEMPLATE_LANGUAGE_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  cplusplus: 'C++',
  go: 'Go',
};

function templatePackToAtsCodingQuestions(pack: CodingQuestion[]): CodingAssessmentQuestion[] {
  return pack.map((q) => {
    const base = createEmptyCodingQuestion();
    const langs = (q.allowedLanguages || []).map((lang) =>
      TEMPLATE_LANGUAGE_LABELS[String(lang || '').trim().toLowerCase()]
    ).filter((lang): lang is string => Boolean(lang));
    const allowedLanguages = langs.length > 0 ? Array.from(new Set(langs)) : base.allowedLanguages;
    const rawCases = Array.isArray(q.testCases) ? q.testCases : [];
    const testCases: TestCase[] = rawCases.map((t, j) => ({
      id: t.id || `tc-${q.id}-${j}`,
      input: String(t.input ?? ''),
      expectedOutput: String(t.expectedOutput ?? ''),
    }));
    return {
      ...base,
      id: q.id,
      question: q.question ?? '',
      description: q.description ?? '',
      difficulty: q.difficulty ?? 'medium',
      required: q.required !== false,
      timeLimitMinutes: q.timeLimitMinutes ?? 30,
      allowedLanguages,
      sampleInput: q.sampleInput ?? '',
      sampleOutput: q.sampleOutput ?? '',
      expectedOutput: q.expectedOutput ?? '',
      starterCode: q.starterCode ?? '',
      testCases: testCases.length > 0 ? testCases : undefined,
      requireFullScreen: q.requireFullScreen !== false,
      blockCopyPaste: q.blockCopyPaste !== false,
      maxTabSwitches: typeof q.maxTabSwitches === 'number' ? q.maxTabSwitches : 2,
    };
  });
}

/** Split combined description (from create flow) into description and responsibilities. */
function parseDescriptionAndResponsibilities(combined: string | undefined): { description: string; responsibilities: string } {
  if (!combined || !combined.trim()) return { description: '', responsibilities: '' };
  const sep = '\n\nResponsibilities:\n';
  const i = combined.indexOf(sep);
  if (i === -1) return { description: combined.trim(), responsibilities: '' };
  return {
    description: combined.slice(0, i).trim(),
    responsibilities: combined.slice(i + sep.length).trim(),
  };
}

/** Normalize screening questions from API (handles snake_case and various question keys). */
function normalizeScreeningQuestions(
  raw: unknown,
  parseRequired: (v: unknown) => boolean
): ScreeningQuestion[] {
  const list = Array.isArray(raw) ? raw : [];
  return list.map((q: any, idx: number) => ({
    id: q.id || `q-${idx}-${Date.now()}`,
    question: (q.question ?? q.question_text ?? q.title ?? '').toString().trim(),
    type: (q.type === 'yesno' || q.type === 'multiple' || q.type === 'number' || q.type === 'verbal' || q.type === 'video'
      ? q.type
      : 'text') as ScreeningQuestionType,
    required: parseRequired(q.required),
    options: Array.isArray(q.options) ? q.options : [],
    maxVideoSeconds:
      typeof q.maxVideoSeconds === 'number'
        ? q.maxVideoSeconds
        : typeof q.max_video_seconds === 'number'
          ? q.max_video_seconds
          : 120,
  }));
}

function normalizeCodingQuestions(raw: unknown): CodingAssessmentQuestion[] {
  const list = Array.isArray(raw) ? raw : [];
  return list.map((q: any, idx: number) => ({
    ...createEmptyCodingQuestion(),
    id: q.id || `code-${idx}-${Date.now()}`,
    question: (q.question ?? q.title ?? '').toString().trim(),
    description: (q.description ?? q.prompt ?? '').toString(),
    difficulty: q.difficulty === 'easy' || q.difficulty === 'hard' ? q.difficulty : 'medium',
    required: typeof q.required === 'boolean' ? q.required : true,
    timeLimitMinutes: Number.isFinite(Number(q.timeLimitMinutes ?? q.time_limit_minutes))
      ? Math.max(5, Number(q.timeLimitMinutes ?? q.time_limit_minutes))
      : 30,
    allowedLanguages: Array.isArray(q.allowedLanguages ?? q.allowed_languages) && (q.allowedLanguages ?? q.allowed_languages).length > 0
      ? (q.allowedLanguages ?? q.allowed_languages)
      : ['JavaScript', 'Python'],
    sampleInput: (q.sampleInput ?? q.sample_input ?? '').toString(),
    sampleOutput: (q.sampleOutput ?? q.sample_output ?? '').toString(),
    expectedOutput: (q.expectedOutput ?? q.expected_output ?? '').toString(),
    starterCode: (q.starterCode ?? q.starter_code ?? '').toString(),
    testCases: (() => {
      const rawTc = q.testCases ?? q.test_cases;
      if (!Array.isArray(rawTc) || rawTc.length === 0) return undefined;
      return rawTc.map((t: any, j: number) => ({
        id: String(t.id || `tc-${idx}-${j}`),
        input: String(t.input ?? ''),
        expectedOutput: String(t.expectedOutput ?? t.expected_output ?? ''),
      }));
    })(),
    requireFullScreen: Boolean(q.requireFullScreen ?? q.require_full_screen ?? true),
    preventTabSwitch: Boolean(q.preventTabSwitch ?? q.prevent_tab_switch ?? true),
    blockCopyPaste: Boolean(q.blockCopyPaste ?? q.block_copy_paste ?? true),
    autoSubmitOnTimeout: Boolean(q.autoSubmitOnTimeout ?? q.auto_submit_on_timeout ?? true),
    trackSuspiciousActivity: Boolean(q.trackSuspiciousActivity ?? q.track_suspicious_activity ?? true),
    maxTabSwitches: Number.isFinite(Number(q.maxTabSwitches ?? q.max_tab_switches))
      ? Math.max(0, Number(q.maxTabSwitches ?? q.max_tab_switches))
      : 2,
  }));
}

// Display applicant interface
interface DisplayApplicant {
  id: string;
  applicantId?: string; // User ID for navigation
  name: string;
  email: string;
  phone: string;
  title: string;
  experience: string;
  matchScore: number;
  status: string;
  appliedDate: string;
  location?: string;
  avatarUrl?: string;
  /** Applicant location at apply time (read-only; when job had collect applicant location) */
  applicantLocationLat?: number | null;
  applicantLocationLng?: number | null;
  applicantLocationIpSnapshot?: Record<string, unknown> | null;
}

const JobPostingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<DisplayJob[]>([]);
  const [applicants, setApplicants] = useState<DisplayApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const parseQuestionRequired = (value: unknown): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
      if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
    }
    return true;
  };

  // Fetch jobs from API on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const hrUser = getHRUserInfo();
        const userId = hrUser?.id || localStorage.getItem('userId') || '';
        
        // Fetch jobs by this HR user
        const apiJobs = await jobService.getJobsByHR(userId);
        
        // Transform to display format WITHOUT fetching applications for each job
        // Applications will be fetched only when "View Applicants" dialog is opened
        const displayJobs: DisplayJob[] = apiJobs.map((job) => {
          const { description: desc, responsibilities: resp } = parseDescriptionAndResponsibilities(job.description);
          return {
            id: job.id,
            title: job.title,
            department: job.companyName || 'Company',
            location: job.location || 'Remote',
            type: job.jobType === 'full-time' ? 'Full-time' : job.jobType || 'Full-time',
            salary: formatSalaryDisplay(job.salary_min, job.salary_max, job.salary_currency),
            applicants: job.applicantCount || 0,
            newApplicants: 0,
            views: job.views_count || 0,
            status: job.status || 'active',
            posted: formatTimeAgo(job.createdAt),
            postedAt: job.createdAt,
            description: desc || job.description,
            responsibilities: resp || (job as any).responsibilities || '',
            experience: job.experienceLevel,
            experienceLevel: job.experienceLevel,
            skills: job.requiredSkills || [],
            requiredSkills: job.requiredSkills || [],
            screeningQuestions: (job as any).screening_questions ?? job.screeningQuestions ?? [],
            codingQuestions: (job as any).coding_questions ?? job.codingQuestions ?? [],
            salaryMin: job.salary_min,
            salaryMax: job.salary_max,
            salaryCurrency: job.salary_currency,
            hiringCountries: (job as any).hiringCountries ?? [],
            workAuthorizations: (job as any).workAuthorizations ?? [],
            openForSponsorship: (job as any).openForSponsorship ?? null,
            collectApplicantLocation: (job as any).collectApplicantLocation ?? false,
          };
        });
        
        setJobs(displayJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  // Create Job Dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createTab, setCreateTab] = useState(0);

  // Open Create Job dialog when navigating from ATS "Create New Job Post" button
  useEffect(() => {
    if (searchParams.get('openCreate') === '1') {
      openCreateDialog();
      const next = new URLSearchParams(searchParams);
      next.delete('openCreate');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const [newJob, setNewJob] = useState({
    title: '', department: '', location: '', type: '', experience: '',
    salaryMin: '', salaryMax: '', salaryCurrency: 'USD', description: '', responsibilities: '',
  });
  const [createSalaryCurrencyTouched, setCreateSalaryCurrencyTouched] = useState(false);
  const [hiringCountries, setHiringCountries] = useState<string[]>([]);
  const [hiringCountriesSelectOpen, setHiringCountriesSelectOpen] = useState(false);
  const [workAuthorizations, setWorkAuthorizations] = useState<string[]>([]);
  const [workAuthorizationsSelectOpen, setWorkAuthorizationsSelectOpen] = useState(false);
  const [openForSponsorship, setOpenForSponsorship] = useState<boolean | null>(null);
  const [collectApplicantLocation, setCollectApplicantLocation] = useState(false);
  const [newJobErrors, setNewJobErrors] = useState<Record<string, boolean>>({});
  const [skillsFieldError, setSkillsFieldError] = useState(false);
  
  // Predefined Skills for suggestions
  // Predefined hiring countries (match backend codes)
const HIRING_COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'IN', label: 'India' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
];
// Work authorization options when USA is selected (match user profile options)
const USA_WORK_AUTH_OPTIONS = [
  'US Citizen', 'Green Card', 'GC EAD', 'H1B', 'H4 EAD', 'L1', 'L2 EAD', 'J1', 'J2 EAD',
  'O1', 'E1', 'E2', 'E3', 'TN', 'OPT EAD', 'STEM OPT EAD', 'CPT', 'F1', 'EB-1/2/3 Pending', 'Asylum EAD', 'Other',
];

const COUNTRY_CURRENCY_BY_CODE: Record<string, string> = {
  US: 'USD',
  IN: 'INR',
  GB: 'GBP',
  CA: 'CAD',
};

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'INR', label: 'INR (Rs)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (CA$)' },
];

const CURRENCY_SYMBOL_BY_CODE: Record<string, string> = {
  USD: '$',
  INR: 'Rs',
  GBP: 'GBP',
  CAD: 'CA$',
};

const getSalaryCurrencyForCountries = (countries: string[] = []): string => {
  const primaryCountry = countries.find((code) => COUNTRY_CURRENCY_BY_CODE[code]);
  return primaryCountry ? COUNTRY_CURRENCY_BY_CODE[primaryCountry] : 'USD';
};

const getSuggestedSalaryCurrencies = (countries: string[] = []): string[] => {
  const seen = new Set<string>();
  const suggestions: string[] = [];
  countries.forEach((code) => {
    const currency = COUNTRY_CURRENCY_BY_CODE[code];
    if (currency && !seen.has(currency)) {
      seen.add(currency);
      suggestions.push(currency);
    }
  });
  return suggestions;
};

const getCurrencySymbol = (currencyCode?: string): string => {
  const normalizedCode = (currencyCode || 'USD').toUpperCase();
  return CURRENCY_SYMBOL_BY_CODE[normalizedCode] || normalizedCode;
};

const formatSalaryDisplay = (
  salaryMin?: number | null,
  salaryMax?: number | null,
  currencyCode?: string
): string => {
  const symbol = getCurrencySymbol(currencyCode);
  if (salaryMin && salaryMax) return `${symbol}${salaryMin.toLocaleString()} - ${symbol}${salaryMax.toLocaleString()}`;
  if (salaryMin) return `From ${symbol}${salaryMin.toLocaleString()}`;
  if (salaryMax) return `Up to ${symbol}${salaryMax.toLocaleString()}`;
  return 'Not specified';
};

const outlinedSelectLabelSx = {
  backgroundColor: '#fff',
  px: 0.5,
};

  // Available locations for suggestions
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [createJobTitleOptions, setCreateJobTitleOptions] = useState<string[]>([]);
  const [editJobTitleOptions, setEditJobTitleOptions] = useState<string[]>([]);
  const createJobTitleDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editJobTitleDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [createSkillOptions, setCreateSkillOptions] = useState<string[]>([]);
  const createSkillDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Location Search Handler
  const handleLocationSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setLocationSuggestions([]);
      return;
    }
    try {
      const q = encodeURIComponent(query.trim());
      const lim = LOCATION_AUTOCOMPLETE_PER_COUNTRY_LIMIT;
      const responses = await Promise.all(
        LOCATION_AUTOCOMPLETE_COUNTRY_CODES.map(async (country) => {
          const url = `${getApiUrl(API_ENDPOINTS.PLACES_AUTOCOMPLETE)}?q=${q}&country=${country}&limit=${lim}`;
          const response = await fetchWithAuth(url);
          if (!response.ok) return [];
          const data = await response.json();
          return Array.isArray(data) ? data.map((place: any) => place.display_name).filter(Boolean) : [];
        })
      );
      const suggestions = Array.from(new Set(responses.flat())).slice(0, LOCATION_AUTOCOMPLETE_MERGED_MAX);
      setLocationSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setLocationSuggestions([]);
    }
  };

  const onCreateJobTitleInputChange = (_: unknown, newInputValue: string) => {
    setNewJob((prev) => ({ ...prev, title: newInputValue }));
    setNewJobErrors((prev) => ({ ...prev, title: false }));
    if (createJobTitleDebounceRef.current) clearTimeout(createJobTitleDebounceRef.current);
    createJobTitleDebounceRef.current = setTimeout(async () => {
      if (!newInputValue || newInputValue.trim().length < 2) {
        setCreateJobTitleOptions([]);
        return;
      }
      setCreateJobTitleOptions(await fetchJobTitleSuggestions(newInputValue));
    }, 300);
  };

  // Skills state for create dialog (no default selection; HR chooses required skills)
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const onCreateSkillInputChange = (_: unknown, newInputValue: string) => {
    setNewSkill(newInputValue);
    if (skillsFieldError) setSkillsFieldError(false);
    if (createSkillDebounceRef.current) clearTimeout(createSkillDebounceRef.current);
    createSkillDebounceRef.current = setTimeout(async () => {
      if (!newInputValue || newInputValue.trim().length < 1) {
        setCreateSkillOptions([]);
        return;
      }
      setCreateSkillOptions(await fetchSkillSuggestions(newInputValue));
    }, 300);
  };
  
  // Screening Questions state for create dialog
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionType, setQuestionType] = useState<ScreeningQuestionType>('text');
  const [questionRequired, setQuestionRequired] = useState(true);
  const [questionOptions, setQuestionOptions] = useState<string[]>(['']);
  const [videoMaxSeconds, setVideoMaxSeconds] = useState(120);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [codingQuestions, setCodingQuestions] = useState<CodingAssessmentQuestion[]>([]);
  const [editingCodingQuestionId, setEditingCodingQuestionId] = useState<string | null>(null);
  const [codingDraft, setCodingDraft] = useState<CodingAssessmentQuestion>(createEmptyCodingQuestion());
  const [createCodingTemplateDialogOpen, setCreateCodingTemplateDialogOpen] = useState(false);
  const templatePackList = useMemo(() => buildAssessmentTemplatePack(), []);
  const templatePackAts = useMemo(
    () => templatePackToAtsCodingQuestions(templatePackList),
    [templatePackList]
  );

  const resetCreateJobForm = () => {
    setNewJob({ title: '', department: '', location: '', type: '', experience: '', salaryMin: '', salaryMax: '', salaryCurrency: 'USD', description: '', responsibilities: '' });
    setCreateSalaryCurrencyTouched(false);
    setHiringCountries([]);
    setHiringCountriesSelectOpen(false);
    setWorkAuthorizations([]);
    setWorkAuthorizationsSelectOpen(false);
    setOpenForSponsorship(null);
    setCollectApplicantLocation(false);
    setNewJobErrors({});
    setSkills([]);
    setNewSkill('');
    setSkillsFieldError(false);
    setQuestions([]);
    setNewQuestion('');
    setQuestionType('text');
    setQuestionRequired(true);
    setQuestionOptions(['']);
    setEditingQuestionId(null);
    setCodingQuestions([]);
    setEditingCodingQuestionId(null);
    setCodingDraft(createEmptyCodingQuestion());
    setCreateCodingTemplateDialogOpen(false);
    setCreateTab(0);
    setLocationSuggestions([]);
    setCreateJobTitleOptions([]);
    setCreateSkillOptions([]);
  };

  const openCreateDialog = () => {
    resetCreateJobForm();
    setCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setCreateDialogOpen(false);
    resetCreateJobForm();
  };
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (!createSalaryCurrencyTouched) {
      if (hiringCountries.length === 1) {
        setNewJob((prev) => ({
          ...prev,
          salaryCurrency: getSalaryCurrencyForCountries(hiringCountries),
        }));
      }
    }
  }, [hiringCountries, createSalaryCurrencyTouched]);

  const validateCreateJobDetailsStep = (): boolean => {
    const requiredFields: Array<{ key: keyof typeof newJob; label: string }> = [
      { key: 'title', label: 'Job Title' },
      { key: 'department', label: 'Department' },
      { key: 'location', label: 'Location' },
      { key: 'type', label: 'Employment Type' },
      { key: 'experience', label: 'Experience Level' },
      { key: 'description', label: 'Job Description' },
      { key: 'responsibilities', label: 'Key Responsibilities' },
    ];

    const errors: Record<string, boolean> = {};
    let hasError = false;

    for (const field of requiredFields) {
      const value = (newJob[field.key] || '').toString().trim();
      if (!value) {
        errors[field.key] = true;
        hasError = true;
      }
    }

    if (hiringCountries.length === 0) {
      errors['hiringCountries'] = true;
      hasError = true;
    }

    if (openForSponsorship === null) {
      errors['openForSponsorship'] = true;
      hasError = true;
    }

    const minSalary = Number(newJob.salaryMin);
    const maxSalary = Number(newJob.salaryMax);
    if (newJob.salaryMin && (!Number.isFinite(minSalary) || minSalary <= 0)) {
       errors['salaryMin'] = true;
       hasError = true;
    }
    if (newJob.salaryMax && (!Number.isFinite(maxSalary) || maxSalary <= 0)) {
       errors['salaryMax'] = true;
       hasError = true;
    }
    if (!hasError && newJob.salaryMin && newJob.salaryMax && minSalary > maxSalary) {
      errors['salaryMin'] = true;
      errors['salaryMax'] = true;
      setSnackbar({ open: true, message: 'Minimum salary cannot be greater than maximum salary', severity: 'error' });
      hasError = true;
    }

    setNewJobErrors(errors);

    if (hasError) {
      const missingCount = Object.keys(errors).length;
      if (missingCount > 0 && !errors['salaryMin'] && !errors['salaryMax']) {
        setSnackbar({ open: true, message: 'Please fill in all required fields', severity: 'error' });
      } else if (missingCount > 0) {
        setSnackbar({ open: true, message: 'Please check the highlighted fields', severity: 'error' });
      }
      setCreateTab(0);
      return false;
    }

    return true;
  };

  const validateCreateSkillsStep = (): boolean => {
    if (skills.length < 2) {
      setSkillsFieldError(true);
      setSnackbar({ open: true, message: 'Please add at least 2 required skills', severity: 'error' });
      setCreateTab(1);
      return false;
    }
    setSkillsFieldError(false);
    return true;
  };

  const handleCreateTabChange = (_: React.SyntheticEvent, nextTab: number) => {
    if (nextTab <= createTab) {
      setCreateTab(nextTab);
      return;
    }
    if (createTab === 0 && !validateCreateJobDetailsStep()) return;
    if (createTab === 1 && !validateCreateSkillsStep()) return;
    setCreateTab(nextTab);
  };

  const handleCreateNextTab = () => {
    if (createTab === 0 && !validateCreateJobDetailsStep()) return;
    if (createTab === 1 && !validateCreateSkillsStep()) return;
    setCreateTab((prev) => Math.min(prev + 1, 3));
  };

  const validateEditJobDetailsStep = (): boolean => {
    if (!editingJob) return false;
    const requiredFields: Array<{ key: string; label: string }> = [
      { key: 'title', label: 'Job Title' },
      { key: 'department', label: 'Department' },
      { key: 'location', label: 'Location' },
      { key: 'type', label: 'Employment Type' },
      { key: 'experience', label: 'Experience Level' },
      { key: 'description', label: 'Job Description' },
      { key: 'responsibilities', label: 'Key Responsibilities' },
    ];

    const errors: Record<string, boolean> = {};
    let hasError = false;

    for (const field of requiredFields) {
      const value = (editingJob[field.key] || '').toString().trim();
      if (!value) {
        errors[field.key] = true;
        hasError = true;
      }
    }

    const minSalary = Number(editingJob.salaryMin);
    const maxSalary = Number(editingJob.salaryMax);
    if (editingJob.salaryMin && (!Number.isFinite(minSalary) || minSalary <= 0)) {
       errors['salaryMin'] = true;
       hasError = true;
    }
    if (editingJob.salaryMax && (!Number.isFinite(maxSalary) || maxSalary <= 0)) {
       errors['salaryMax'] = true;
       hasError = true;
    }
    if (!hasError && editingJob.salaryMin && editingJob.salaryMax && minSalary > maxSalary) {
      errors['salaryMin'] = true;
      errors['salaryMax'] = true;
      setSnackbar({ open: true, message: 'Minimum salary cannot be greater than maximum salary', severity: 'error' });
      hasError = true;
    }

    setEditJobErrors(errors);

    if (hasError) {
      const missingCount = Object.keys(errors).length;
      if (missingCount > 0 && !errors['salaryMin'] && !errors['salaryMax']) {
        setSnackbar({ open: true, message: 'Please fill in all required fields', severity: 'error' });
      } else if (missingCount > 0) {
        setSnackbar({ open: true, message: 'Please check the highlighted fields', severity: 'error' });
      }
      setEditTab(0);
      return false;
    }

    return true;
  };

  const validateEditSkillsStep = (): boolean => {
    if (editSkills.length < 2) {
      setEditSkillsFieldError(true);
      setSnackbar({ open: true, message: 'Please add at least 2 required skills', severity: 'error' });
      setEditTab(1);
      return false;
    }
    setEditSkillsFieldError(false);
    return true;
  };

  const handleEditTabChange = (_: React.SyntheticEvent, nextTab: number) => {
    if (nextTab <= editTab) {
      setEditTab(nextTab);
      return;
    }
    if (editTab === 0 && !validateEditJobDetailsStep()) return;
    if (editTab === 1 && !validateEditSkillsStep()) return;
    setEditTab(nextTab);
  };

  const handleEditNextTab = () => {
    if (editTab === 0 && !validateEditJobDetailsStep()) return;
    if (editTab === 1 && !validateEditSkillsStep()) return;
    setEditTab((prev) => Math.min(prev + 1, 3));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
      setSkillsFieldError(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      const question: ScreeningQuestion = {
        id: editingQuestionId ?? Date.now().toString(),
        question: newQuestion.trim(),
        type: questionType,
        required: questionRequired,
        options: questionType === 'multiple' ? questionOptions.filter(o => o.trim()) : undefined,
        maxVideoSeconds: questionType === 'video' ? Math.min(600, Math.max(15, videoMaxSeconds)) : undefined,
      };
      setQuestions(
        editingQuestionId
          ? questions.map((q) => (q.id === editingQuestionId ? question : q))
          : [...questions, question]
      );
      setNewQuestion('');
      setQuestionType('text');
      setQuestionRequired(true);
      setQuestionOptions(['']);
      setVideoMaxSeconds(120);
      setEditingQuestionId(null);
    }
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    if (editingQuestionId === id) {
      setNewQuestion('');
      setQuestionType('text');
      setQuestionRequired(true);
      setQuestionOptions(['']);
      setEditingQuestionId(null);
    }
  };

  const handleEditQuestion = (question: ScreeningQuestion) => {
    setEditingQuestionId(question.id);
    setNewQuestion(question.question);
    setQuestionType(question.type);
    setQuestionRequired(question.required);
    setQuestionOptions(question.type === 'multiple' && question.options && question.options.length > 0 ? question.options : ['']);
    setVideoMaxSeconds(question.maxVideoSeconds ?? 120);
  };

  const resetQuestionForm = () => {
    setNewQuestion('');
    setQuestionType('text');
    setQuestionRequired(true);
    setQuestionOptions(['']);
    setVideoMaxSeconds(120);
    setEditingQuestionId(null);
  };

  const getScreeningQuestionTypeLabel = (type: ScreeningQuestion['type']) => {
    if (type === 'yesno') return 'Yes / No';
    if (type === 'multiple') return 'Multiple Choice';
    if (type === 'number') return 'Number';
    if (type === 'verbal') return 'Verbal';
    if (type === 'video') return 'Video';
    return 'Normal';
  };

  const handleSaveCodingQuestion = () => {
    if (!codingDraft.question.trim() || !codingDraft.description.trim()) return;
    const normalizedQuestion = {
      ...codingDraft,
      question: codingDraft.question.trim(),
      description: codingDraft.description.trim(),
      allowedLanguages: codingDraft.allowedLanguages.length > 0 ? codingDraft.allowedLanguages : ['JavaScript', 'Python'],
      timeLimitMinutes: Math.max(5, Number(codingDraft.timeLimitMinutes) || 30),
      maxTabSwitches: Math.max(0, Number(codingDraft.maxTabSwitches) || 0),
    };
    setCodingQuestions((prev) => (
      editingCodingQuestionId
        ? prev.map((item) => (item.id === editingCodingQuestionId ? normalizedQuestion : item))
        : [...prev, normalizedQuestion]
    ));
    setEditingCodingQuestionId(null);
    setCodingDraft(createEmptyCodingQuestion());
  };

  const handleEditCodingQuestion = (question: CodingAssessmentQuestion) => {
    setEditingCodingQuestionId(question.id);
    setCodingDraft({ ...question });
  };

  const handleRemoveCodingQuestion = (id: string) => {
    setCodingQuestions((prev) => prev.filter((item) => item.id !== id));
    if (editingCodingQuestionId === id) {
      setEditingCodingQuestionId(null);
      setCodingDraft(createEmptyCodingQuestion());
    }
  };

  const resetCodingQuestionForm = () => {
    setEditingCodingQuestionId(null);
    setCodingDraft(createEmptyCodingQuestion());
  };

  const pickTemplatePackForCreate = (index: number) => {
    const q = templatePackAts[index];
    const fresh = createEmptyCodingQuestion();
    setCodingDraft({ ...q, id: fresh.id });
    setEditingCodingQuestionId(null);
    setCreateCodingTemplateDialogOpen(false);
  };

  const pickTemplatePackForEdit = (index: number) => {
    const q = templatePackAts[index];
    const fresh = createEmptyCodingQuestion();
    setEditCodingDraft({ ...q, id: fresh.id });
    setEditEditingCodingQuestionId(null);
    setEditCodingTemplateDialogOpen(false);
  };

  const addAllTemplatePackToCreate = () => {
    setCodingQuestions((prev) => [
      ...prev,
      ...templatePackAts.map((q, i) => ({
        ...q,
        id: `code-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      })),
    ]);
    setSnackbar({
      open: true,
      message: 'Added 6 coding questions from the template pack (3 test cases each).',
      severity: 'success',
    });
    setCreateCodingTemplateDialogOpen(false);
  };

  const addAllTemplatePackToEdit = () => {
    setEditCodingQuestions((prev) => [
      ...prev,
      ...templatePackAts.map((q, i) => ({
        ...q,
        id: `code-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      })),
    ]);
    setSnackbar({
      open: true,
      message: 'Added 6 coding questions from the template pack (3 test cases each).',
      severity: 'success',
    });
    setEditCodingTemplateDialogOpen(false);
  };

  const updateCodingDraftTestCase = (tcIdx: number, field: 'input' | 'expectedOutput', value: string) => {
    setCodingDraft((d) => {
      const list = [...(d.testCases || [])];
      if (!list[tcIdx]) return d;
      list[tcIdx] = { ...list[tcIdx], [field]: value };
      return { ...d, testCases: list };
    });
  };

  const updateEditCodingDraftTestCase = (tcIdx: number, field: 'input' | 'expectedOutput', value: string) => {
    setEditCodingDraft((d) => {
      const list = [...(d.testCases || [])];
      if (!list[tcIdx]) return d;
      list[tcIdx] = { ...list[tcIdx], [field]: value };
      return { ...d, testCases: list };
    });
  };

  // Filter Menu
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState({
    active: true, draft: true, closed: true,
    fulltime: true, parttime: true, w2contract: true, corp2corp: true, unpaidInternship: true, paidInternship: true, freelance: true,
    collegeFresh: true, exp0to2: true, exp2to5: true, exp5to8: true, exp8to10: true, exp10to12: true, exp12leadership: true,
    dateRange: 'all',
  });
  
  // Edit Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [editDialogLoading, setEditDialogLoading] = useState(false);
  const [editHiringCountriesSelectOpen, setEditHiringCountriesSelectOpen] = useState(false);
  const [editWorkAuthorizationsSelectOpen, setEditWorkAuthorizationsSelectOpen] = useState(false);
  const [editJobErrors, setEditJobErrors] = useState<Record<string, boolean>>({});
  const [editSkillsFieldError, setEditSkillsFieldError] = useState(false);
  const [editSalaryCurrencyTouched, setEditSalaryCurrencyTouched] = useState(false);
  const [editTab, setEditTab] = useState(0);
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [editNewSkill, setEditNewSkill] = useState('');
  const [editSkillOptions, setEditSkillOptions] = useState<string[]>([]);
  const editSkillDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [editQuestions, setEditQuestions] = useState<ScreeningQuestion[]>([]);
  const [editNewQuestion, setEditNewQuestion] = useState('');
  const [editQuestionType, setEditQuestionType] = useState<ScreeningQuestionType>('text');
  const [editQuestionRequired, setEditQuestionRequired] = useState(true);
  const [editQuestionOptions, setEditQuestionOptions] = useState<string[]>(['']);
  const [editVideoMaxSeconds, setEditVideoMaxSeconds] = useState(120);
  const [editEditingQuestionId, setEditEditingQuestionId] = useState<string | null>(null);
  const [editCodingQuestions, setEditCodingQuestions] = useState<CodingAssessmentQuestion[]>([]);
  const [editEditingCodingQuestionId, setEditEditingCodingQuestionId] = useState<string | null>(null);
  const [editCodingDraft, setEditCodingDraft] = useState<CodingAssessmentQuestion>(createEmptyCodingQuestion());
  const [editCodingTemplateDialogOpen, setEditCodingTemplateDialogOpen] = useState(false);

  const onEditJobTitleInputChange = (_: unknown, newInputValue: string) => {
    setEditingJob((prev: any) => (prev ? { ...prev, title: newInputValue } : prev));
    setEditJobErrors((prev) => ({ ...prev, title: false }));
    if (editJobTitleDebounceRef.current) clearTimeout(editJobTitleDebounceRef.current);
    editJobTitleDebounceRef.current = setTimeout(async () => {
      if (!newInputValue || newInputValue.trim().length < 2) {
        setEditJobTitleOptions([]);
        return;
      }
      setEditJobTitleOptions(await fetchJobTitleSuggestions(newInputValue));
    }, 300);
  };

  const onEditSkillInputChange = (_: unknown, newInputValue: string) => {
    setEditNewSkill(newInputValue);
    if (editSkillsFieldError) setEditSkillsFieldError(false);
    if (editSkillDebounceRef.current) clearTimeout(editSkillDebounceRef.current);
    editSkillDebounceRef.current = setTimeout(async () => {
      if (!newInputValue || newInputValue.trim().length < 1) {
        setEditSkillOptions([]);
        return;
      }
      setEditSkillOptions(await fetchSkillSuggestions(newInputValue));
    }, 300);
  };

  // Applicants Dialog
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicantTab, setApplicantTab] = useState(0);
  // Schedule Interview (unified modal from View Applicants)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleModalContext, setScheduleModalContext] = useState<ScheduleInterviewContext | null>(null);
  const [scheduledInterviewApplicationIds, setScheduledInterviewApplicationIds] = useState<Set<string>>(new Set());
  const [hrCalendarLink, setHrCalendarLink] = useState<string | null>(null);
  const [activeApplicantMenu, setActiveApplicantMenu] = useState<DisplayApplicant | null>(null);

  useEffect(() => {
    if (!editingJob || editSalaryCurrencyTouched) return;
    if ((editingJob.hiringCountries ?? []).length === 1) {
      setEditingJob((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          salaryCurrency: getSalaryCurrencyForCountries(prev.hiringCountries ?? []),
        };
      });
    }
  }, [editingJob?.hiringCountries, editSalaryCurrencyTouched]);

  // Load which applications already have a scheduled interview (for Reschedule vs Schedule Interview)
  const loadScheduledInterviewApplicationIds = useCallback(async () => {
    try {
      const interviews = await interviewService.getMyInterviewsAsInterviewer(true);
      const ids = new Set((interviews || []).map((i: any) => String(i.application_id)).filter(Boolean));
      setScheduledInterviewApplicationIds(ids);
    } catch {
      setScheduledInterviewApplicationIds(new Set());
    }
  }, []);
  useEffect(() => {
    if (applicantsDialogOpen) loadScheduledInterviewApplicationIds();
  }, [applicantsDialogOpen, loadScheduledInterviewApplicationIds]);

  const openApplicantActionsMenu = (_event: React.MouseEvent<HTMLElement>, applicant: DisplayApplicant) => {
    setActiveApplicantMenu((current) => (
      current?.id === applicant.id ? null : applicant
    ));
  };

  const closeApplicantActionsMenu = () => {
    setActiveApplicantMenu(null);
  };

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });
  
  // More Menu
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);
  const [moreJobId, setMoreJobId] = useState<string | null>(null);

  // Create Job - Uses Backend API
  const handleCreateJob = async () => {
    if (!validateCreateJobDetailsStep()) return;
    if (!validateCreateSkillsStep()) return;

    setIsPosting(true);
    
    try {
      const hrUser = getHRUserInfo();
      const userId = hrUser?.id || localStorage.getItem('userId') || 'ats-user';
      const companyName = hrUser?.companyName || localStorage.getItem('current_company') || 'Company';
      
      // Map experience level to expected format (API: entry | mid | senior | lead)
      const experienceLevelMap: Record<string, 'entry' | 'mid' | 'senior' | 'lead'> = {
        'college_fresh': 'entry',
        '0_2': 'entry',
        '2_5': 'mid',
        '5_8': 'senior',
        '8_10': 'senior',
        '10_12': 'lead',
        '12_leadership': 'lead',
      };

      // Map job type to expected format (API: full-time | part-time | contract | internship)
      const jobTypeMap: Record<string, 'full-time' | 'internship' | 'part-time' | 'contract'> = {
        'fulltime': 'full-time',
        'parttime': 'part-time',
        'w2contract': 'contract',
        'corp2corp': 'contract',
        'unpaid_internship': 'internship',
        'paid_internship': 'internship',
        'freelance': 'contract',
      };

      // Create job via API - include salary (optional), hiring countries, work auth, sponsorship
      const salaryCurrency = newJob.salaryCurrency || getSalaryCurrencyForCountries(hiringCountries);
      const createdJob = await jobService.createJob({
        title: newJob.title,
        companyName: companyName,
        description: `${newJob.description}\n\nResponsibilities:\n${newJob.responsibilities}`,
        requiredSkills: skills,
        experienceLevel: experienceLevelMap[newJob.experience] || 'mid',
        location: newJob.location || 'Remote',
        jobType: jobTypeMap[newJob.type] || 'full-time',
        codingQuestions: codingQuestions,
        screeningQuestions: questions.map((q) => ({
          id: q.id,
          question: q.question,
          type: q.type,
          required: q.required,
          options: q.options || [],
          ...(q.type === 'video' && q.maxVideoSeconds ? { maxVideoSeconds: q.maxVideoSeconds } : {}),
        })),
        salaryMin: newJob.salaryMin ? parseInt(newJob.salaryMin) : undefined,
        salaryMax: newJob.salaryMax ? parseInt(newJob.salaryMax) : undefined,
        salaryCurrency,
        hiringCountries: hiringCountries.length ? hiringCountries : [],
        workAuthorizations: hiringCountries.includes('US') ? workAuthorizations : [],
        openForSponsorship: openForSponsorship ?? undefined,
        collectApplicantLocation,
      }, userId);
      
      // Format salary display
      const salaryDisplay = formatSalaryDisplay(
        newJob.salaryMin ? parseInt(newJob.salaryMin) : undefined,
        newJob.salaryMax ? parseInt(newJob.salaryMax) : undefined,
        salaryCurrency
      );

      // Map department for display
      const departmentDisplay = newJob.department.charAt(0).toUpperCase() + newJob.department.slice(1);
      const createExperienceLevel =
        newJob.experience === 'college_fresh' || newJob.experience === '0_2'
          ? 'entry'
          : newJob.experience === '2_5'
            ? 'mid'
            : newJob.experience === '5_8' || newJob.experience === '8_10'
              ? 'senior'
              : 'lead';
      
      // Add to local state
      const displayJob: DisplayJob = {
        id: createdJob.id,
        title: createdJob.title,
        department: departmentDisplay,
        location: createdJob.location || 'Remote',
        type: newJob.type === 'fulltime' ? 'Full-Time' :
              newJob.type === 'parttime' ? 'Part-Time' :
              newJob.type === 'w2contract' ? 'W2 - Contract' :
              newJob.type === 'corp2corp' ? 'Corp-to-Corp' :
              newJob.type === 'unpaid_internship' ? 'Unpaid Internship' :
              newJob.type === 'paid_internship' ? 'Paid Internship' :
              newJob.type === 'freelance' ? 'Freelance' : 'Full-Time',
        salary: salaryDisplay,
        salaryCurrency,
        applicants: 0,
        newApplicants: 0,
        views: 0,
        status: 'active',
        posted: 'Just now',
        postedAt: new Date().toISOString(),
        experience: newJob.experience,
        experienceLevel: createExperienceLevel,
        codingQuestions,
        screeningQuestions: questions,
      };
      
      setJobs([displayJob, ...jobs]);
      closeCreateDialog();
      
      setSnackbar({ open: true, message: 'Job posted successfully! Applicants will answer screening questions.', severity: 'success' });
    } catch (error: any) {
      console.error('Error creating job:', error);
      setSnackbar({ open: true, message: error.message || 'Failed to create job', severity: 'error' });
    } finally {
      setIsPosting(false);
    }
  };

  // Edit Job - Uses Backend API
  const handleEditJob = async () => {
    if (!editingJob) return;
    
    try {
      // Map job type (form value -> API)
      const jobTypeMap: Record<string, 'full-time' | 'part-time' | 'contract' | 'internship'> = {
        'fulltime': 'full-time',
        'parttime': 'part-time',
        'w2contract': 'contract',
        'corp2corp': 'contract',
        'unpaid_internship': 'internship',
        'paid_internship': 'internship',
        'freelance': 'contract',
      };
      // Map experience level (form value -> API)
      const expMap: Record<string, 'entry' | 'mid' | 'senior' | 'lead'> = {
        'college_fresh': 'entry',
        '0_2': 'entry',
        '2_5': 'mid',
        '5_8': 'senior',
        '8_10': 'senior',
        '10_12': 'lead',
        '12_leadership': 'lead',
      };
      
      // Update via API
      const salaryCurrency = editingJob.salaryCurrency || getSalaryCurrencyForCountries(editingJob.hiringCountries ?? []);
      await jobService.updateJob(editingJob.id, {
        title: editingJob.title,
        description: editingJob.description || '',
        location: editingJob.location,
        jobType: jobTypeMap[editingJob.type as string] || 'full-time',
        companyName: getHRUserInfo()?.companyName || 'Company',
        requiredSkills: editSkills,
        experienceLevel: expMap[editingJob.experience as string] || 'mid',
        codingQuestions: editCodingQuestions,
        screeningQuestions: editQuestions.map((q) => ({
          id: q.id,
          question: q.question,
          type: q.type,
          required: q.required,
          options: q.options || [],
          ...(q.type === 'video' && q.maxVideoSeconds ? { maxVideoSeconds: q.maxVideoSeconds } : {}),
        })),
        salaryMin: editingJob.salaryMin ? parseInt(editingJob.salaryMin) : undefined,
        salaryMax: editingJob.salaryMax ? parseInt(editingJob.salaryMax) : undefined,
        salaryCurrency,
        hiringCountries: editingJob.hiringCountries ?? [],
        workAuthorizations: editingJob.workAuthorizations ?? [],
        openForSponsorship: editingJob.openForSponsorship ?? undefined,
        collectApplicantLocation: editingJob.collectApplicantLocation ?? false,
      } as any);
      
      const salaryDisplay = formatSalaryDisplay(
        editingJob.salaryMin ? parseInt(editingJob.salaryMin) : undefined,
        editingJob.salaryMax ? parseInt(editingJob.salaryMax) : undefined,
        salaryCurrency
      );

      // Update local state with full job data
      const updatedJob = {
        ...editingJob,
        skills: editSkills,
        screeningQuestions: editQuestions,
        codingQuestions: editCodingQuestions,
        salary: salaryDisplay,
        salaryCurrency,
      };
      setJobs(jobs.map(j => j.id === editingJob.id ? updatedJob : j));
      setEditDialogOpen(false);
      setEditingJob(null);
      setEditTab(0);
      setEditCodingTemplateDialogOpen(false);
      setEditEditingQuestionId(null);
      setEditJobTitleOptions([]);
      setSnackbar({ open: true, message: 'Job updated successfully!', severity: 'success' });
    } catch (error: any) {
      console.error('Error updating job:', error);
      setSnackbar({ open: true, message: error.message || 'Failed to update job', severity: 'error' });
    }
  };

  // Delete Job - Uses Backend API
  const handleDeleteJob = async (jobId: string) => {
    try {
      await jobService.deleteJob(jobId);
      setJobs(jobs.filter(j => j.id !== jobId));
      setMoreAnchor(null);
      setMoreJobId(null);
      setSnackbar({ open: true, message: 'Job deleted', severity: 'success' });
    } catch (error: any) {
      console.error('Error deleting job:', error);
      setSnackbar({ open: true, message: error.message || 'Failed to delete job', severity: 'error' });
    }
  };

  const handleCloseJob = async (jobId: string) => {
    try {
      await jobService.closeJob(jobId);
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'closed' } : j));
      setMoreAnchor(null);
      setMoreJobId(null);
      setSnackbar({ open: true, message: 'Job closed successfully', severity: 'success' });
    } catch (error: any) {
      console.error('Error closing job:', error);
      setSnackbar({ open: true, message: error.message || 'Failed to close job', severity: 'error' });
    }
  };

  const handleReopenJob = async (jobId: string) => {
    try {
      await jobService.reopenJob(jobId);
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'active' } : j));
      setMoreAnchor(null);
      setMoreJobId(null);
      setSnackbar({ open: true, message: 'Job reopened successfully', severity: 'success' });
    } catch (error: any) {
      console.error('Error reopening job:', error);
      setSnackbar({ open: true, message: error.message || 'Failed to reopen job', severity: 'error' });
    }
  };

  const typeToForm: Record<string, string> = {
    'full-time': 'fulltime', fulltime: 'fulltime',
    'part-time': 'parttime', parttime: 'parttime',
    'w2-contract': 'w2contract', w2contract: 'w2contract',
    'corp-to-corp': 'corp2corp', corp2corp: 'corp2corp',
    unpaidinternship: 'unpaid_internship', unpaid_internship: 'unpaid_internship',
    paidinternship: 'paid_internship', paid_internship: 'paid_internship',
    freelance: 'freelance', contract: 'w2contract', internship: 'paid_internship',
  };
  const expToForm: Record<string, string> = {
    entry: '0_2', mid: '2_5', senior: '5_8', lead: '12_leadership',
    college_fresh: 'college_fresh', '0_2': '0_2', '2_5': '2_5', '5_8': '5_8',
    '8_10': '8_10', '10_12': '10_12', '12_leadership': '12_leadership',
  };
  const applyFormState = (fullJob: DisplayJob) => {
    setEditSalaryCurrencyTouched(false);
    const j = fullJob as any;
    const rawType = (j.type || '').toString().toLowerCase().replace(/\s+/g, '');
    const rawExp = (j.experience || j.experienceLevel || '').toString().toLowerCase();
    const formType = typeToForm[rawType] || 'fulltime';
    const formExp = expToForm[rawExp] || (rawExp.includes('entry') || rawExp.includes('0-2') ? '0_2' : rawExp.includes('mid') || rawExp.includes('2-5') ? '2_5' : rawExp.includes('senior') || rawExp.includes('5-8') ? '5_8' : rawExp.includes('lead') || rawExp.includes('8+') ? '12_leadership' : '2_5');
    const skills = j.requiredSkills || j.skills || [];
    let screeningQuestionsRaw: unknown = j.screeningQuestions ?? j.screening_questions ?? [];
    if (typeof screeningQuestionsRaw === 'string') {
      try { screeningQuestionsRaw = JSON.parse(screeningQuestionsRaw); } catch { screeningQuestionsRaw = []; }
    }
    if (!Array.isArray(screeningQuestionsRaw)) screeningQuestionsRaw = [];
    const screeningQuestions = normalizeScreeningQuestions(screeningQuestionsRaw, parseQuestionRequired);
    let codingQuestionsRaw: unknown = j.codingQuestions ?? j.coding_questions ?? [];
    if (typeof codingQuestionsRaw === 'string') {
      try { codingQuestionsRaw = JSON.parse(codingQuestionsRaw); } catch { codingQuestionsRaw = []; }
    }
    if (!Array.isArray(codingQuestionsRaw)) codingQuestionsRaw = [];
    const normalizedCodingQuestions = normalizeCodingQuestions(codingQuestionsRaw);
    setEditingJob({
      ...fullJob,
      type: formType,
      experience: formExp,
      description: j.description ?? '',
      responsibilities: j.responsibilities ?? '',
      department: j.department || fullJob.department || 'Company',
      salaryMin: j.salaryMin ?? fullJob.salaryMin,
      salaryMax: j.salaryMax ?? fullJob.salaryMax,
      salaryCurrency: j.salaryCurrency ?? fullJob.salaryCurrency ?? getSalaryCurrencyForCountries(j.hiringCountries ?? []),
      hiringCountries: j.hiringCountries ?? [],
      workAuthorizations: j.workAuthorizations ?? [],
      openForSponsorship: j.openForSponsorship ?? null,
      collectApplicantLocation: j.collectApplicantLocation ?? false,
    } as any);
    setEditSkills(Array.isArray(skills) ? [...skills] : []);
    setEditQuestions(screeningQuestions);
    setEditCodingQuestions(normalizedCodingQuestions);
  };

  const openEditDialog = async (job: DisplayJob) => {
    setEditSalaryCurrencyTouched(false);
    const { description: desc, responsibilities: resp } = parseDescriptionAndResponsibilities(job.description ?? '');
    const listJob = { ...job, description: desc, responsibilities: resp } as any;
    const rawType = (listJob.type || '').toString().toLowerCase().replace(/\s+/g, '');
    const rawExp = (listJob.experience || listJob.experienceLevel || '').toString().toLowerCase();
    const formType = typeToForm[rawType] || 'fulltime';
    const formExp = expToForm[rawExp] || '2_5';
    const listSkills = listJob.requiredSkills || listJob.skills || [];
    let listQuestionsRaw: unknown = (listJob as any).screening_questions ?? listJob.screeningQuestions ?? [];
    if (typeof listQuestionsRaw === 'string') {
      try { listQuestionsRaw = JSON.parse(listQuestionsRaw); } catch { listQuestionsRaw = []; }
    }
    if (!Array.isArray(listQuestionsRaw)) listQuestionsRaw = [];
    const listQuestions = normalizeScreeningQuestions(listQuestionsRaw, parseQuestionRequired);
    let listCodingQuestionsRaw: unknown = (listJob as any).coding_questions ?? listJob.codingQuestions ?? [];
    if (typeof listCodingQuestionsRaw === 'string') {
      try { listCodingQuestionsRaw = JSON.parse(listCodingQuestionsRaw); } catch { listCodingQuestionsRaw = []; }
    }
    if (!Array.isArray(listCodingQuestionsRaw)) listCodingQuestionsRaw = [];
    const listCodingQuestions = normalizeCodingQuestions(listCodingQuestionsRaw);
    setEditingJob({
      ...listJob,
      type: formType,
      experience: formExp,
      description: desc ?? '',
      responsibilities: resp ?? '',
      department: listJob.department || 'Company',
      salaryMin: listJob.salaryMin ?? listJob.salary_min,
      salaryMax: listJob.salaryMax ?? listJob.salary_max,
      salaryCurrency: listJob.salaryCurrency ?? listJob.salary_currency ?? getSalaryCurrencyForCountries(listJob.hiringCountries ?? []),
    } as any);
    setEditSkills(Array.isArray(listSkills) ? [...listSkills] : []);
    setEditQuestions(listQuestions);
    setEditCodingQuestions(listCodingQuestions);
    setEditTab(0);
    setEditNewSkill('');
    setEditSkillOptions([]);
    setEditNewQuestion('');
    setEditQuestionType('text');
    setEditQuestionRequired(true);
    setEditQuestionOptions(['']);
    setEditEditingQuestionId(null);
    setEditEditingCodingQuestionId(null);
    setEditCodingDraft(createEmptyCodingQuestion());
    setEditCodingTemplateDialogOpen(false);
    setEditDialogOpen(true);
    setEditDialogLoading(true);
    try {
      const fetched = await jobService.getJobById(job.id);
      if (fetched) {
        const { description: d, responsibilities: r } = parseDescriptionAndResponsibilities(fetched.description ?? '');
        const fullJob: DisplayJob = {
          ...job,
          title: fetched.title,
          department: fetched.companyName || job.department || 'Company',
          location: fetched.location || job.location || 'Remote',
          type: fetched.jobType || job.type,
          experience: fetched.experienceLevel,
          experienceLevel: fetched.experienceLevel,
          description: d,
          responsibilities: r,
          skills: fetched.requiredSkills || [],
           requiredSkills: fetched.requiredSkills || [],
           screeningQuestions: (fetched as any).screening_questions ?? fetched.screeningQuestions ?? [],
           codingQuestions: (fetched as any).coding_questions ?? fetched.codingQuestions ?? [],
           salaryMin: fetched.salary_min ?? job.salaryMin,
          salaryMax: fetched.salary_max ?? job.salaryMax,
          salaryCurrency: fetched.salary_currency ?? job.salaryCurrency ?? getSalaryCurrencyForCountries((fetched as any).hiringCountries ?? job.hiringCountries ?? []),
          status: fetched.status || job.status,
          hiringCountries: (fetched as any).hiringCountries ?? job.hiringCountries ?? [],
          workAuthorizations: (fetched as any).workAuthorizations ?? job.workAuthorizations ?? [],
          openForSponsorship: (fetched as any).openForSponsorship ?? job.openForSponsorship ?? null,
          collectApplicantLocation: (fetched as any).collectApplicantLocation ?? job.collectApplicantLocation ?? false,
        } as DisplayJob;
        applyFormState(fullJob);
      }
    } catch (err) {
      console.error('Error loading full job for edit:', err);
      setSnackbar({ open: true, message: 'Showing cached data. Some details may be outdated.', severity: 'warning' });
    } finally {
      setEditDialogLoading(false);
    }
  };
  
  // Edit dialog skill handlers
  const handleAddEditSkill = () => {
    if (editNewSkill.trim() && !editSkills.includes(editNewSkill.trim())) {
      setEditSkills([...editSkills, editNewSkill.trim()]);
      setEditNewSkill('');
    }
  };
  
  const handleRemoveEditSkill = (skill: string) => {
    setEditSkills(editSkills.filter((s) => s !== skill));
  };
  
  // Edit dialog question handlers
  const handleAddEditQuestion = () => {
    if (editNewQuestion.trim()) {
      const newQ: ScreeningQuestion = {
        id: editEditingQuestionId ?? Date.now().toString(),
        question: editNewQuestion.trim(),
        type: editQuestionType,
        required: editQuestionRequired,
        ...(editQuestionType === 'multiple' ? { options: editQuestionOptions.filter(o => o.trim()) } : {}),
        maxVideoSeconds:
          editQuestionType === 'video' ? Math.min(600, Math.max(15, editVideoMaxSeconds)) : undefined,
      };
      setEditQuestions(
        editEditingQuestionId
          ? editQuestions.map((q) => (q.id === editEditingQuestionId ? newQ : q))
          : [...editQuestions, newQ]
      );
      setEditNewQuestion('');
      setEditQuestionType('text');
      setEditQuestionRequired(true);
      setEditQuestionOptions(['']);
      setEditVideoMaxSeconds(120);
      setEditEditingQuestionId(null);
    }
  };
  
  const handleRemoveEditQuestion = (id: string) => {
    setEditQuestions(editQuestions.filter((q) => q.id !== id));
    if (editEditingQuestionId === id) {
      setEditNewQuestion('');
      setEditQuestionType('text');
      setEditQuestionRequired(true);
      setEditQuestionOptions(['']);
      setEditVideoMaxSeconds(120);
      setEditEditingQuestionId(null);
    }
  };

  const handleStartEditQuestion = (question: ScreeningQuestion) => {
    setEditEditingQuestionId(question.id);
    setEditNewQuestion(question.question);
    setEditQuestionType(question.type);
    setEditQuestionRequired(question.required);
    setEditQuestionOptions(question.type === 'multiple' && question.options && question.options.length > 0 ? question.options : ['']);
    setEditVideoMaxSeconds(question.maxVideoSeconds ?? 120);
  };

  const resetEditQuestionForm = () => {
    setEditNewQuestion('');
    setEditQuestionType('text');
    setEditQuestionRequired(true);
    setEditQuestionOptions(['']);
    setEditVideoMaxSeconds(120);
    setEditEditingQuestionId(null);
  };

  const handleSaveEditCodingQuestion = () => {
    if (!editCodingDraft.question.trim() || !editCodingDraft.description.trim()) return;
    const normalizedQuestion = {
      ...editCodingDraft,
      question: editCodingDraft.question.trim(),
      description: editCodingDraft.description.trim(),
      allowedLanguages: editCodingDraft.allowedLanguages.length > 0 ? editCodingDraft.allowedLanguages : ['JavaScript', 'Python'],
      timeLimitMinutes: Math.max(5, Number(editCodingDraft.timeLimitMinutes) || 30),
      maxTabSwitches: Math.max(0, Number(editCodingDraft.maxTabSwitches) || 0),
    };
    setEditCodingQuestions((prev) => (
      editEditingCodingQuestionId
        ? prev.map((item) => (item.id === editEditingCodingQuestionId ? normalizedQuestion : item))
        : [...prev, normalizedQuestion]
    ));
    setEditEditingCodingQuestionId(null);
    setEditCodingDraft(createEmptyCodingQuestion());
  };

  const handleStartEditCodingQuestion = (question: CodingAssessmentQuestion) => {
    setEditEditingCodingQuestionId(question.id);
    setEditCodingDraft({ ...question });
  };

  const handleRemoveEditCodingQuestion = (id: string) => {
    setEditCodingQuestions((prev) => prev.filter((item) => item.id !== id));
    if (editEditingCodingQuestionId === id) {
      setEditEditingCodingQuestionId(null);
      setEditCodingDraft(createEmptyCodingQuestion());
    }
  };

  const resetEditCodingQuestionForm = () => {
    setEditEditingCodingQuestionId(null);
    setEditCodingDraft(createEmptyCodingQuestion());
  };

  // When Edit dialog is on Screening Questions tab and editQuestions is empty but job has questions, sync from editingJob so they become visible and editable
  useEffect(() => {
    if (!editDialogOpen || editTab !== 2 || !editingJob || editQuestions.length > 0) return;
    const raw = (editingJob as any).screening_questions ?? editingJob.screeningQuestions;
    if (!raw || (Array.isArray(raw) && raw.length === 0)) return;
    const arr = typeof raw === 'string' ? (() => { try { return JSON.parse(raw); } catch { return []; } })() : (Array.isArray(raw) ? raw : []);
    if (arr.length > 0) {
      setEditQuestions(normalizeScreeningQuestions(arr, parseQuestionRequired));
    }
  }, [editDialogOpen, editTab, editingJob, editQuestions.length]);

  // Open applicants dialog and fetch applicants from API
  const openApplicantsDialog = async (job: DisplayJob) => {
    setSelectedJob(job);
    setApplicantsDialogOpen(true);
    setHrCalendarLink(null);
    
    try {
      const [candidates, links] = await Promise.all([
        userService.getCandidatesForJob(job.id),
        calendarService.getSchedulingLinks().catch(() => [] as any[]),
      ]);
      const linkUrl = Array.isArray(links) && links.length > 0 && (links[0] as any).token
        ? `${window.location.origin}/book/${(links[0] as any).token}`
        : null;
      setHrCalendarLink(linkUrl);

      if (candidates.length > 0) {
        const displayApps: DisplayApplicant[] = candidates.map((candidate) => ({
          id: candidate.applicationId || candidate.id, // APPLICATION ID for interview scheduling
          applicantId: candidate.userId || candidate.id, // User ID for profile navigation
          name: candidate.name || 'Applicant',
          email: candidate.email || '',
          phone: candidate.phone || '',
          title: candidate.title || 'Candidate',
          experience: formatApplicantExperience(candidate.experience),
          matchScore: candidate.matchScore ?? 0,  // Use actual match score from backend
          status: candidate.status || 'new',
          appliedDate: candidate.appliedAt ? formatTimeAgo(candidate.appliedAt) : 'Recently',
          location: candidate.location || '',
          avatarUrl: candidate.avatar || '',
          applicantLocationLat: (candidate as any).applicantLocationLat ?? null,
          applicantLocationLng: (candidate as any).applicantLocationLng ?? null,
          applicantLocationIpSnapshot: (candidate as any).applicantLocationIpSnapshot ?? null,
        }));
        setApplicants(displayApps);
        return;
      }
      
      // Fallback to applicationService - now includes applicant details from backend
      const apps = await applicationService.getApplicationsByJob(job.id);
      const displayApps: DisplayApplicant[] = apps.map((app) => {
        // Use applicantDetails if available from backend
        const details = app.applicantDetails;
        return {
          id: app.id,
          applicantId: details?.id || app.userId, // Store applicant ID for navigation
          name: app.candidateName || 'Applicant',
          email: app.candidateEmail || details?.email || '',
          phone: details?.phone || '',
          title: details?.title || 'Candidate',
          experience: formatApplicantExperience(details?.experienceYears),
          matchScore: app.skillMatchPercent ?? app.match_score ?? app.codingScore ?? 0,
          status: app.status === 'applied' || (app.status as string) === 'submitted' ? 'new' : app.status,
          appliedDate: formatTimeAgo(app.appliedAt),
          location: details?.location || '',
          avatarUrl: details?.avatarUrl || '',
          applicantLocationLat: (app as any).applicantLocationLat ?? null,
          applicantLocationLng: (app as any).applicantLocationLng ?? null,
          applicantLocationIpSnapshot: (app as any).applicantLocationIpSnapshot ?? null,
        };
      });
      setApplicants(displayApps);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setApplicants([]);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (['new', 'applied', 'submitted'].includes(s)) return '#0d47a1';
    if (['reviewed', 'under_review', 'shortlisted'].includes(s)) return '#FF9500';
    if (['interviewed', 'interview'].includes(s)) return '#5856D6';
    if (['rejected'].includes(s)) return '#FF3B30';
    if (['hired', 'offered'].includes(s)) return '#34C759';
    return '#8E8E93';
  };
  
  // Browse all candidates from backend API
  const loadAllCandidates = async () => {
    try {
      const candidates = await userService.getAllUsers();
      const displayApps: DisplayApplicant[] = candidates.map((candidate) => ({
        id: candidate.id,
        name: candidate.name || 'Candidate',
        email: candidate.email || '',
        phone: '',
        title: candidate.title || 'Software Professional',
        experience: candidate.experience || 'Not specified',
        matchScore: candidate.matchScore || 0,
        status: candidate.status || 'new',
        appliedDate: 'Available',
        skills: candidate.skills || [],
      }));
      setApplicants(displayApps);
      setSnackbar({ open: true, message: `Loaded ${displayApps.length} candidates from database`, severity: 'success' });
    } catch (error) {
      console.error('Error loading candidates:', error);
      setSnackbar({ open: true, message: 'Failed to load candidates', severity: 'error' });
    }
  };

  const isNew = (status: string) => ['new', 'applied', 'submitted'].includes(status?.toLowerCase());
  const isReviewed = (status: string) => ['reviewed', 'under_review', 'shortlisted'].includes(status?.toLowerCase());
  const isInterviewed = (status: string) => ['interviewed', 'interview', 'offered', 'hired'].includes(status?.toLowerCase());
  const isRejected = (status: string) => status?.toLowerCase() === 'rejected';

  // Update applicant stage (Proceed = shortlisted for screening, Reject = rejected) and optionally notify
  const updateApplicantStage = async (
    applicationId: string,
    newStatus: 'shortlisted' | 'rejected',
    applicant: DisplayApplicant
  ) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      setApplicants(prev => prev.map(a => a.id === applicationId ? { ...a, status: newStatus } : a));
      if (newStatus === 'rejected') {
        try {
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          const hrName = [userData.first_name, userData.last_name].filter(Boolean).join(' ').trim() || 'HR Team';
          await fetchWithAuth(getApiUrl('/notifications/stage-change/'), {
            method: 'POST',
            body: JSON.stringify({
              candidate_email: applicant.email,
              candidate_name: applicant.name,
              old_stage: applicant.status?.replace('_', ' ') || 'Application',
              new_stage: 'Rejected',
              hr_name: hrName,
              job_title: selectedJob?.title || 'Position',
            }),
          });
        } catch (_) { /* notification best-effort */ }
      }
      setSnackbar({
        open: true,
        message: newStatus === 'shortlisted' ? `${applicant.name} moved to Shortlisted for Screening` : `${applicant.name} has been rejected`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      setSnackbar({ open: true, message: 'Failed to update status. Please try again.', severity: 'error' });
    }
  };

  const filteredApplicants = applicants.filter(a => {
    if (applicantTab === 0) return true;
    if (applicantTab === 1) return isNew(a.status);
    if (applicantTab === 2) return isReviewed(a.status);
    if (applicantTab === 3) return isInterviewed(a.status);
    if (applicantTab === 4) return isRejected(a.status);
    return true;
  }).sort((a, b) => b.matchScore - a.matchScore);

  const filteredJobs = jobs.filter(job => {
    // text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const titleMatch = job.title.toLowerCase().includes(term);
      const locMatch = job.location.toLowerCase().includes(term);
      const companyMatch = job.department.toLowerCase().includes(term);
      if (!titleMatch && !locMatch && !companyMatch) return false;
    }

    // status filters
    if (!filters.active && job.status === 'active') return false;
    if (!filters.draft && job.status === 'draft') return false;
    if (!filters.closed && job.status === 'closed') return false;
    
    // job type filters (normalize all variants)
    const rawType = (job.type || '').toString().toLowerCase();
    const compactType = rawType.replace(/[^a-z0-9]/g, '');
    const normalizedType =
      compactType.includes('fulltime')
        ? 'fulltime'
        : compactType.includes('parttime')
          ? 'parttime'
          : compactType.includes('w2') || (compactType.includes('contract') && !compactType.includes('corp'))
            ? 'w2contract'
            : compactType.includes('corp2corp') || compactType.includes('corptocorp')
              ? 'corp2corp'
              : compactType.includes('unpaid') && compactType.includes('intern')
                ? 'unpaidInternship'
                : compactType.includes('paid') && compactType.includes('intern')
                  ? 'paidInternship'
                  : compactType.includes('freelance')
                    ? 'freelance'
                    : '';
    if (normalizedType === 'fulltime' && !filters.fulltime) return false;
    if (normalizedType === 'parttime' && !filters.parttime) return false;
    if (normalizedType === 'w2contract' && !filters.w2contract) return false;
    if (normalizedType === 'corp2corp' && !filters.corp2corp) return false;
    if (normalizedType === 'unpaidInternship' && !filters.unpaidInternship) return false;
    if (normalizedType === 'paidInternship' && !filters.paidInternship) return false;
    if (normalizedType === 'freelance' && !filters.freelance) return false;

    // experience level filters (screenshot categories)
    const rawExperience = (job.experience || job.experienceLevel || '').toString().toLowerCase();
    const expCompact = rawExperience.replace(/[^a-z0-9_]/g, '');
    const normalizedExperience =
      expCompact.includes('college') || expCompact.includes('fresh')
        ? 'collegeFresh'
        : expCompact === '0_2' || expCompact.includes('02') || expCompact === 'entry'
          ? 'exp0to2'
          : expCompact === '2_5' || expCompact.includes('25') || expCompact === 'mid'
            ? 'exp2to5'
            : expCompact === '5_8' || expCompact.includes('58') || expCompact === 'senior'
              ? 'exp5to8'
              : expCompact === '8_10' || expCompact.includes('810')
                ? 'exp8to10'
                : expCompact === '10_12' || expCompact.includes('1012')
                  ? 'exp10to12'
                  : expCompact === '12_leadership' || expCompact.includes('12lead') || expCompact === 'lead'
                    ? 'exp12leadership'
                    : '';
    if (normalizedExperience === 'collegeFresh' && !filters.collegeFresh) return false;
    if (normalizedExperience === 'exp0to2' && !filters.exp0to2) return false;
    if (normalizedExperience === 'exp2to5' && !filters.exp2to5) return false;
    if (normalizedExperience === 'exp5to8' && !filters.exp5to8) return false;
    if (normalizedExperience === 'exp8to10' && !filters.exp8to10) return false;
    if (normalizedExperience === 'exp10to12' && !filters.exp10to12) return false;
    if (normalizedExperience === 'exp12leadership' && !filters.exp12leadership) return false;

    // posted date filter
    if (filters.dateRange !== 'all') {
      const dayWindow = filters.dateRange === 'last7' ? 7 : filters.dateRange === 'last30' ? 30 : 90;
      const postedTs = job.postedAt ? new Date(job.postedAt).getTime() : NaN;
      if (!Number.isFinite(postedTs)) return false;
      const ageInDays = (Date.now() - postedTs) / (1000 * 60 * 60 * 24);
      if (ageInDays > dayWindow) return false;
    }

    return true;
  });

  return (
    <ATSLayout>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            sx={{ width: 300 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />}
            onClick={(e) => setFilterAnchor(e.currentTarget)}
          >
            Filter
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            sx={{ bgcolor: '#0d47a1' }}
            onClick={openCreateDialog}
          >
            Create Job
          </Button>
        </Box>
      </Box>

      {/* Job Cards */}
      <Grid container spacing={3}>
        {filteredJobs.map((job) => (
          <Grid item xs={12} md={6} key={job.id}>
            <JobCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="h6" fontWeight={600}>{job.title}</Typography>
                      <Chip
                        label={job.status === 'active' ? 'ACTIVE' : job.status === 'closed' ? 'CLOSED' : 'DRAFT'}
                        size="small"
                        sx={{
                          bgcolor: job.status === 'active' ? alpha('#34C759', 0.1) : job.status === 'closed' ? alpha('#FF3B30', 0.1) : alpha('#8E8E93', 0.1),
                          color: job.status === 'active' ? '#34C759' : job.status === 'closed' ? '#FF3B30' : '#8E8E93',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">{job.department}</Typography>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={(e) => { setMoreAnchor(e.currentTarget); setMoreJobId(job.id); }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">{job.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">{job.type}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AttachMoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">{job.salary}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon sx={{ fontSize: 18, color: '#0d47a1' }} />
                    <Typography variant="body2">
                      <strong>{job.applicants}</strong> applicants
                    </Typography>
                    {job.newApplicants > 0 && (
                      <Chip label={`+${job.newApplicants} new`} size="small" color="success" sx={{ fontSize: '0.65rem' }} />
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">{job.views} views</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Posted {job.posted}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      size="small" 
                      variant="contained" 
                      sx={{ bgcolor: '#0d47a1' }}
                      onClick={() => openApplicantsDialog(job)}
                    >
                      View Applicants
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => openEditDialog(job)}
                    >
                      Edit
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </JobCard>
          </Grid>
        ))}
      </Grid>

      {/* More Menu */}
      <Menu
        anchorEl={moreAnchor}
        open={Boolean(moreAnchor)}
        onClose={() => { setMoreAnchor(null); setMoreJobId(null); }}
      >
        <MenuItem onClick={() => { const job = jobs.find(j => j.id === moreJobId); if (job) openEditDialog(job); setMoreAnchor(null); }}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} /> Edit Job
        </MenuItem>
        {jobs.find(j => j.id === moreJobId)?.status !== 'closed' && (
          <MenuItem onClick={() => moreJobId && handleCloseJob(moreJobId)} sx={{ color: '#FF9500' }}>
            <CloseIcon sx={{ mr: 1, fontSize: 18 }} /> Close Job
          </MenuItem>
        )}
        {jobs.find(j => j.id === moreJobId)?.status === 'closed' && (
          <MenuItem onClick={() => moreJobId && handleReopenJob(moreJobId)} sx={{ color: '#34C759' }}>
            <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} /> Reopen Job
          </MenuItem>
        )}
        <MenuItem onClick={() => moreJobId && handleDeleteJob(moreJobId)} sx={{ color: '#FF3B30' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} /> Delete Job
        </MenuItem>
      </Menu>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
        PaperProps={{ sx: { width: 280, p: 2 } }}
      >
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Status</Typography>
        <FormGroup>
          <FormControlLabel 
            control={<Checkbox checked={filters.active} onChange={(e) => setFilters({ ...filters, active: e.target.checked })} />} 
            label="Active" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.draft} onChange={(e) => setFilters({ ...filters, draft: e.target.checked })} />} 
            label="Draft" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.closed} onChange={(e) => setFilters({ ...filters, closed: e.target.checked })} />} 
            label="Closed" 
          />
        </FormGroup>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, mt: 1 }}>Employment Type</Typography>
        <FormGroup>
          <FormControlLabel 
            control={<Checkbox checked={filters.fulltime} onChange={(e) => setFilters({ ...filters, fulltime: e.target.checked })} />} 
            label="Full-Time" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.parttime} onChange={(e) => setFilters({ ...filters, parttime: e.target.checked })} />} 
            label="Part-Time" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.w2contract} onChange={(e) => setFilters({ ...filters, w2contract: e.target.checked })} />} 
            label="W2 - Contract" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.corp2corp} onChange={(e) => setFilters({ ...filters, corp2corp: e.target.checked })} />} 
            label="Corp-to-Corp" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.unpaidInternship} onChange={(e) => setFilters({ ...filters, unpaidInternship: e.target.checked })} />} 
            label="Unpaid Internship" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.paidInternship} onChange={(e) => setFilters({ ...filters, paidInternship: e.target.checked })} />} 
            label="Paid Internship" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.freelance} onChange={(e) => setFilters({ ...filters, freelance: e.target.checked })} />} 
            label="Freelance" 
          />
        </FormGroup>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, mt: 1 }}>Experience Level</Typography>
        <FormGroup>
          <FormControlLabel 
            control={<Checkbox checked={filters.collegeFresh} onChange={(e) => setFilters({ ...filters, collegeFresh: e.target.checked })} />} 
            label="College fresh grads" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.exp0to2} onChange={(e) => setFilters({ ...filters, exp0to2: e.target.checked })} />} 
            label="0 to 2+ years" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.exp2to5} onChange={(e) => setFilters({ ...filters, exp2to5: e.target.checked })} />} 
            label="2 to 5+ years" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.exp5to8} onChange={(e) => setFilters({ ...filters, exp5to8: e.target.checked })} />} 
            label="5 to 8 years" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.exp8to10} onChange={(e) => setFilters({ ...filters, exp8to10: e.target.checked })} />} 
            label="8 to 10 years" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.exp10to12} onChange={(e) => setFilters({ ...filters, exp10to12: e.target.checked })} />} 
            label="10 to 12+" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.exp12leadership} onChange={(e) => setFilters({ ...filters, exp12leadership: e.target.checked })} />} 
            label="12 to leadership" 
          />
        </FormGroup>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, mt: 1 }}>Posted Date</Typography>
        <FormControl fullWidth size="small">
          <Select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="last7">Last 7 Days</MenuItem>
            <MenuItem value="last30">Last 30 Days</MenuItem>
            <MenuItem value="last90">Last 90 Days</MenuItem>
          </Select>
        </FormControl>
        <Divider sx={{ my: 1 }} />
        <Button fullWidth variant="outlined" size="small" onClick={() => setFilterAnchor(null)}>
          Apply Filters
        </Button>
      </Menu>

      {/* Create Job Dialog - Enhanced with Tabs */}
      <Dialog
        open={createDialogOpen}
        onClose={closeCreateDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee', pb: 0 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Post New Job</Typography>
          <Tabs value={createTab} onChange={handleCreateTabChange} sx={{ minHeight: 40 }}>
            <Tab label="Job Details" sx={{ minHeight: 40, textTransform: 'none' }} />
            <Tab label="Required Skills" sx={{ minHeight: 40, textTransform: 'none' }} />
            <Tab label="Screening Questions" sx={{ minHeight: 40, textTransform: 'none' }} />
            <Tab label="Coding Questions" sx={{ minHeight: 40, textTransform: 'none' }} />
          </Tabs>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, minHeight: 400 }}>
          {/* Tab 1: Job Details */}
          {createTab === 0 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!newJobErrors.hiringCountries}>
                  <InputLabel shrink sx={outlinedSelectLabelSx}>Hiring countries</InputLabel>
                  <Select
                    multiple
                    value={hiringCountries}
                    label="Hiring countries"
                    open={hiringCountriesSelectOpen}
                    onOpen={() => setHiringCountriesSelectOpen(true)}
                    onClose={() => setHiringCountriesSelectOpen(false)}
                    onChange={(e) => {
                      const v = e.target.value;
                      setHiringCountries(typeof v === 'string' ? v.split(',') : v);
                      setNewJobErrors({ ...newJobErrors, hiringCountries: false });
                      setHiringCountriesSelectOpen(false);
                    }}
                    renderValue={(selected) => selected.map((code) => HIRING_COUNTRIES.find((c) => c.value === code)?.label || code).join(', ')}
                  >
                    {HIRING_COUNTRIES.map((c) => (
                      <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Job will be visible only to techies from the selected countries.</FormHelperText>
                  {newJobErrors.hiringCountries && <FormHelperText error>Select at least one country</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                  <Autocomplete
                    freeSolo
                    options={createJobTitleOptions}
                    value={newJob.title}
                    onChange={(_, newValue) => {
                      setNewJob({ ...newJob, title: newValue || '' });
                      setNewJobErrors({ ...newJobErrors, title: false });
                    }}
                    onInputChange={onCreateJobTitleInputChange}
                    filterOptions={(options) => options}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Job Title"
                        placeholder="e.g., Senior Software Engineer"
                        required
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        error={!!newJobErrors.title}
                        helperText={newJobErrors.title ? "Job Title is required" : ""}
                      />
                    )}
                    slotProps={{
                      paper: {
                        sx: {
                          maxHeight: 240,
                        },
                      },
                    }}
                  />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!newJobErrors.department}>
                  <InputLabel shrink>Department</InputLabel>
                  <Select
                    value={newJob.department}
                    label="Department"
                    onChange={(e) => { setNewJob({ ...newJob, department: e.target.value }); setNewJobErrors({ ...newJobErrors, department: false }); }}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Select Department</MenuItem>
                    <MenuItem value="engineering">Engineering</MenuItem>
                    <MenuItem value="design">Design</MenuItem>
                    <MenuItem value="marketing">Marketing</MenuItem>
                    <MenuItem value="sales">Sales</MenuItem>
                    <MenuItem value="hr">Human Resources</MenuItem>
                    <MenuItem value="finance">Finance</MenuItem>
                    <MenuItem value="operations">Operations</MenuItem>
                    <MenuItem value="product">Product</MenuItem>
                    <MenuItem value="data">Data Science</MenuItem>
                  </Select>
                  {newJobErrors.department && <FormHelperText>Department is required</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  freeSolo
                  options={locationSuggestions}
                  value={newJob.location}
                  onChange={(_, newValue) => { 
                    setNewJob({ ...newJob, location: newValue || '' }); 
                    setNewJobErrors({ ...newJobErrors, location: false }); 
                  }}
                  onInputChange={(_, newInputValue) => { 
                    setNewJob({ ...newJob, location: newInputValue }); 
                    setNewJobErrors({ ...newJobErrors, location: false }); 
                    if (newInputValue && newInputValue.length >= 2) {
                      handleLocationSearch(newInputValue);
                    } else {
                      setLocationSuggestions([]);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Location"
                      placeholder="e.g., New York, NY or Remote"
                      InputLabelProps={{ shrink: true }}
                      error={!!newJobErrors.location}
                      helperText={newJobErrors.location ? "Location is required" : ""}
                      required
                      variant="outlined"
                    />
                  )}
                  slotProps={{
                    paper: {
                      sx: {
                        maxHeight: 200,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!newJobErrors.type}>
                  <InputLabel shrink>Employment Type</InputLabel>
                  <Select
                    value={newJob.type}
                    label="Employment Type"
                    onChange={(e) => { setNewJob({ ...newJob, type: e.target.value }); setNewJobErrors({ ...newJobErrors, type: false }); }}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Select Type</MenuItem>
                    <MenuItem value="fulltime">Full-Time</MenuItem>
                    <MenuItem value="parttime">Part-Time</MenuItem>
                    <MenuItem value="w2contract">W2 - Contract</MenuItem>
                    <MenuItem value="corp2corp">Corp-to-Corp</MenuItem>
                    <MenuItem value="unpaid_internship">Unpaid Internship</MenuItem>
                    <MenuItem value="paid_internship">Paid Internship</MenuItem>
                    <MenuItem value="freelance">Freelance</MenuItem>
                  </Select>
                  {newJobErrors.type && <FormHelperText>Employment Type is required</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!newJobErrors.experience}>
                  <InputLabel shrink>Experience Level</InputLabel>
                  <Select
                    value={newJob.experience}
                    label="Experience Level"
                    onChange={(e) => { setNewJob({ ...newJob, experience: e.target.value }); setNewJobErrors({ ...newJobErrors, experience: false }); }}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Select Level</MenuItem>
                    <MenuItem value="college_fresh">College fresh grads</MenuItem>
                    <MenuItem value="0_2">0 to 2+ years</MenuItem>
                    <MenuItem value="2_5">2 to 5+ years</MenuItem>
                    <MenuItem value="5_8">5 to 8 years</MenuItem>
                    <MenuItem value="8_10">8 to 10 years</MenuItem>
                    <MenuItem value="10_12">10 to 12+</MenuItem>
                    <MenuItem value="12_leadership">12 to leadership</MenuItem>
                  </Select>
                  {newJobErrors.experience && <FormHelperText>Experience Level is required</FormHelperText>}
                </FormControl>
              </Grid>
              {hiringCountries.includes('US') && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel shrink sx={outlinedSelectLabelSx}>What work authorizations are accepted for this role?</InputLabel>
                    <Select
                      multiple
                      value={workAuthorizations}
                      label="What work authorizations are accepted for this role?"
                      open={workAuthorizationsSelectOpen}
                      onOpen={() => setWorkAuthorizationsSelectOpen(true)}
                      onClose={() => setWorkAuthorizationsSelectOpen(false)}
                      onChange={(e) => {
                        const v = e.target.value;
                        setWorkAuthorizations(typeof v === 'string' ? v.split(',') : v);
                        setWorkAuthorizationsSelectOpen(false);
                      }}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {USA_WORK_AUTH_OPTIONS.map((opt) => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Job will be visible only to users whose work authorization matches.</FormHelperText>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!newJobErrors.openForSponsorship}>
                  <InputLabel shrink sx={outlinedSelectLabelSx}>Is this role open for sponsorship?</InputLabel>
                  <Select
                    value={openForSponsorship === null ? '' : openForSponsorship ? 'yes' : 'no'}
                    label="Is this role open for sponsorship?"
                    onChange={(e) => {
                      const v = e.target.value;
                      setOpenForSponsorship(v === 'yes' ? true : v === 'no' ? false : null);
                      setNewJobErrors({ ...newJobErrors, openForSponsorship: false });
                    }}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Select</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                  {newJobErrors.openForSponsorship && <FormHelperText error>Please select Yes or No</FormHelperText>}
                </FormControl>
              </Grid>
              {hiringCountries.length > 1 && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel shrink sx={outlinedSelectLabelSx}>Salary currency</InputLabel>
                    <Select
                      value={newJob.salaryCurrency || 'USD'}
                      label="Salary currency"
                      onChange={(e) => {
                        setNewJob({ ...newJob, salaryCurrency: e.target.value });
                        setCreateSalaryCurrencyTouched(true);
                      }}
                    >
                      {CURRENCY_OPTIONS.map((currency) => (
                        <MenuItem key={currency.value} value={currency.value}>{currency.label}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {`Suggestions: ${getSuggestedSalaryCurrencies(hiringCountries).join(', ') || 'USD'}. HR can choose one.`}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Salary (Annual) - optional"
                  value={newJob.salaryMin}
                  onChange={(e) => { setNewJob({ ...newJob, salaryMin: e.target.value }); setNewJobErrors({ ...newJobErrors, salaryMin: false, salaryMax: false }); }}
                  placeholder="e.g., 600000"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <InputAdornment position="start">{getCurrencySymbol(newJob.salaryCurrency)}</InputAdornment> }}
                  helperText={newJobErrors.salaryMin ? "Valid minimum salary" : ""}
                  error={!!newJobErrors.salaryMin}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Salary (Annual) - optional"
                  value={newJob.salaryMax}
                  onChange={(e) => { setNewJob({ ...newJob, salaryMax: e.target.value }); setNewJobErrors({ ...newJobErrors, salaryMin: false, salaryMax: false }); }}
                  placeholder="e.g., 1200000"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <InputAdornment position="start">{getCurrencySymbol(newJob.salaryCurrency)}</InputAdornment> }}
                  helperText={newJobErrors.salaryMax ? "Valid maximum salary" : ""}
                  error={!!newJobErrors.salaryMax}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, px: 2, py: 1.5, minHeight: 112 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={collectApplicantLocation}
                        onChange={(e) => setCollectApplicantLocation(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Collect applicant location"
                  />
                  <FormHelperText sx={{ display: 'block', mt: 0.5 }}>
                    Location is captured only at submission and shown to you as read-only.
                  </FormHelperText>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Job Description"
                  value={newJob.description}
                  onChange={(e) => { setNewJob({ ...newJob, description: e.target.value }); setNewJobErrors({ ...newJobErrors, description: false }); }}
                  placeholder="Describe the role and what the candidate will be doing..."
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ inputProps: { 'data-allow-paste': 'true' } as any }}
                  required
                  error={!!newJobErrors.description}
                  helperText={newJobErrors.description ? "Job Description is required" : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Key Responsibilities"
                  value={newJob.responsibilities}
                  onChange={(e) => { setNewJob({ ...newJob, responsibilities: e.target.value }); setNewJobErrors({ ...newJobErrors, responsibilities: false }); }}
                  placeholder="List the main responsibilities (one per line)..."
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ inputProps: { 'data-allow-paste': 'true' } as any }}
                  required
                  error={!!newJobErrors.responsibilities}
                  helperText={newJobErrors.responsibilities ? "Key Responsibilities are required" : ""}
                />
              </Grid>
            </Grid>
          )}

          {/* Tab 2: Required Skills */}
          {createTab === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Required Skills
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add skills that candidates should have. These will be matched against applicant profiles.
              </Typography>
              
              {/* Add new skill */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Autocomplete
                  freeSolo
                  options={createSkillOptions.filter((s) => !skills.includes(s))}
                  value={newSkill || null}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setNewSkill(newValue);
                      if (skillsFieldError) setSkillsFieldError(false);
                    }
                  }}
                  onInputChange={onCreateSkillInputChange}
                  filterOptions={(options) => options}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select a skill to add..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault(); // Prevent form submission
                          handleAddSkill();
                        }
                      }}
                      error={skillsFieldError}
                      helperText={skillsFieldError ? 'At least 2 skills are required' : ''}
                    />
                  )}
                />
                <Button variant="contained" onClick={handleAddSkill} sx={{ bgcolor: '#0d47a1', whiteSpace: 'nowrap' }}>
                  Add Skill
                </Button>
              </Box>

              {/* Skills list */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill)}
                    sx={{ 
                      bgcolor: alpha('#0d47a1', 0.1), 
                      color: '#0d47a1',
                      '& .MuiChip-deleteIcon': { color: '#0d47a1' },
                    }}
                  />
                ))}
              </Box>

              {skills.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  No skills added yet. Add skills to help match candidates.
                </Typography>
              )}

              {/* Suggested skills */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Suggested Skills (click to add)
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {SUGGESTED_SKILL_CHIPS.filter((s) => !skills.includes(s))
                    .map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        variant="outlined"
                        onClick={() => setSkills([...skills, skill])}
                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: alpha('#0d47a1', 0.05) } }}
                      />
                    ))}
                </Box>
              </Box>
            </Box>
          )}

          {/* Tab 3: Screening Questions */}
          {createTab === 2 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                Screening Questions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add only the questions you want for pre-screening. Keep these short and recruiter-friendly so candidates can finish them quickly.
              </Typography>

              {/* Existing questions */}
              <List sx={{ mb: 3 }}>
                {questions.map((q, index) => (
                  <Paper key={q.id} sx={{ mb: 1, p: 2, bgcolor: alpha('#0d47a1', 0.02) }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <DragIndicatorIcon sx={{ color: '#888', mt: 0.5, cursor: 'grab' }} />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body1" fontWeight={500}>
                            {index + 1}. {q.question}
                          </Typography>
                          <Chip label={q.required ? 'Required' : 'Optional'} size="small" color={q.required ? 'error' : 'default'} sx={{ height: 20, fontSize: '0.7rem' }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Type: {getScreeningQuestionTypeLabel(q.type)}
                          {q.options && ` • Options: ${q.options.join(', ')}`}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={() => handleEditQuestion(q)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleRemoveQuestion(q.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </List>

              {/* Add new question */}
              <Paper sx={{ p: 2, border: '2px dashed #ddd' }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  {editingQuestionId ? 'Edit Question' : 'Add New Question'}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Question"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="e.g., What is your experience with React?"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel shrink>Answer Type</InputLabel>
                      <Select
                        value={questionType}
                        label="Answer Type"
                        onChange={(e) => setQuestionType(e.target.value as any)}
                      >
                          <MenuItem value="text">Normal Question</MenuItem>
                          <MenuItem value="video">Verbal Question</MenuItem>
                          <MenuItem value="multiple">Multiple Choice</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={questionRequired}
                          onChange={(e) => setQuestionRequired(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Required question"
                    />
                  </Grid>
                  {questionType === 'video' && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Max video length (seconds)"
                        value={videoMaxSeconds}
                        onChange={(e) => setVideoMaxSeconds(Math.min(600, Math.max(15, parseInt(e.target.value, 10) || 120)))}
                        inputProps={{ min: 15, max: 600 }}
                        InputLabelProps={{ shrink: true }}
                        helperText="Recording stops automatically at this limit (15–600s)."
                      />
                    </Grid>
                  )}
                  {questionType === 'multiple' && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Options (one per field)
                      </Typography>
                      {questionOptions.map((opt, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...questionOptions];
                              newOpts[idx] = e.target.value;
                              setQuestionOptions(newOpts);
                            }}
                          />
                          {questionOptions.length > 1 && (
                            <IconButton size="small" onClick={() => setQuestionOptions(questionOptions.filter((_, i) => i !== idx))}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      ))}
                      <Button size="small" onClick={() => setQuestionOptions([...questionOptions, ''])}>
                        + Add Option
                      </Button>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={handleAddQuestion}
                        disabled={!newQuestion.trim()}
                        sx={{ bgcolor: '#0d47a1' }}
                      >
                        {editingQuestionId ? 'Update Question' : 'Add Question'}
                      </Button>
                      {editingQuestionId && (
                        <Button onClick={resetQuestionForm} sx={{ ml: 1 }}>
                          Cancel Edit
                        </Button>
                      )}
                  </Grid>
                </Grid>
              </Paper>

              {/* Info box */}
              <Paper sx={{ p: 2, mt: 3, bgcolor: alpha('#0d47a1', 0.05), border: '1px solid', borderColor: alpha('#0d47a1', 0.2) }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <HelpOutlineIcon sx={{ color: '#0d47a1', mt: 0.25 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} color="#0d47a1">
                      How Applicant Matching Works
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      When candidates apply, they will answer these questions. Their profile (experience, skills, roles, responsibilities) 
                      will be automatically matched against job requirements. Applicants are ranked by relevance score based on:
                    </Typography>
                    <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
                      <li>Skills match percentage</li>
                      <li>Years of relevant experience</li>
                      <li>Role and responsibility alignment</li>
                      <li>Screening question answers</li>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}
          {createTab === 3 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                Coding Assessment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add coding questions only if this role needs a technical assessment. Each question can carry time, language, and integrity settings for a more SaaS-style candidate experience.
              </Typography>

              <List sx={{ mb: 3 }}>
                {codingQuestions.map((q, index) => (
                  <Paper key={q.id} sx={{ mb: 1.5, p: 2, bgcolor: alpha('#0d47a1', 0.02) }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <DragIndicatorIcon sx={{ color: '#888', mt: 0.5, cursor: 'grab' }} />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                          <Typography variant="body1" fontWeight={500}>
                            {index + 1}. {q.question}
                          </Typography>
                          <Chip label={q.required ? 'Required' : 'Optional'} size="small" color={q.required ? 'error' : 'default'} sx={{ height: 20, fontSize: '0.7rem' }} />
                          <Chip label={q.difficulty.toUpperCase()} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                          <Chip label={`${q.timeLimitMinutes} min`} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Languages: {q.allowedLanguages.join(', ')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          Guardrails: {[
                            q.requireFullScreen ? 'Full screen' : null,
                            q.preventTabSwitch ? `Tab limit ${q.maxTabSwitches}` : null,
                            q.blockCopyPaste ? 'Paste blocked' : null,
                            q.autoSubmitOnTimeout ? 'Auto submit' : null,
                            q.trackSuspiciousActivity ? 'Suspicious activity tracking' : null,
                          ].filter(Boolean).join(' • ')}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={() => handleEditCodingQuestion(q)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleRemoveCodingQuestion(q.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </List>

              <Paper sx={{ p: 2, border: '2px dashed #ddd' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {editingCodingQuestionId ? 'Edit Coding Question' : 'Add Coding Question'}
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => setCreateCodingTemplateDialogOpen(true)}
                    sx={{ bgcolor: '#0d47a1', textTransform: 'none' }}
                  >
                    Import questions
                  </Button>
                </Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  {editingCodingQuestionId ? 'Edit Question Details' : 'Question Details'}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Question Title"
                      value={codingDraft.question}
                      onChange={(e) => setCodingDraft({ ...codingDraft, question: e.target.value })}
                      placeholder="e.g., Print Hello World"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Problem Statement"
                      value={codingDraft.description}
                      onChange={(e) => setCodingDraft({ ...codingDraft, description: e.target.value })}
                      placeholder="Explain the task, input/output expectation, and evaluation notes."
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ inputProps: { 'data-allow-paste': 'true' } as any }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel shrink>Difficulty</InputLabel>
                      <Select
                        value={codingDraft.difficulty}
                        label="Difficulty"
                        onChange={(e) => setCodingDraft({ ...codingDraft, difficulty: e.target.value as CodingAssessmentQuestion['difficulty'] })}
                      >
                        <MenuItem value="easy">Easy</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="hard">Hard</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Time Limit (minutes)"
                      value={codingDraft.timeLimitMinutes}
                      onChange={(e) => setCodingDraft({ ...codingDraft, timeLimitMinutes: Number(e.target.value) })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={<Switch checked={codingDraft.required} onChange={(e) => setCodingDraft({ ...codingDraft, required: e.target.checked })} color="primary" />}
                      label="Required question"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={CODING_LANGUAGE_OPTIONS}
                      value={codingDraft.allowedLanguages}
                      onChange={(_, value) => setCodingDraft({ ...codingDraft, allowedLanguages: value })}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Allowed Languages"
                          placeholder="Choose languages"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Sample Input"
                      value={codingDraft.sampleInput}
                      onChange={(e) => setCodingDraft({ ...codingDraft, sampleInput: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Sample Output"
                      value={codingDraft.sampleOutput}
                      onChange={(e) => setCodingDraft({ ...codingDraft, sampleOutput: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Expected Output / Test Hint"
                      value={codingDraft.expectedOutput}
                      onChange={(e) => setCodingDraft({ ...codingDraft, expectedOutput: e.target.value })}
                      placeholder="Optional hint for evaluation or visible test guidance"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Starter Code"
                      value={codingDraft.starterCode}
                      onChange={(e) => setCodingDraft({ ...codingDraft, starterCode: e.target.value })}
                      placeholder="Optional starter template candidates will begin with"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Hidden test cases (auto-judge)
                    </Typography>
                    <Collapse in={Boolean((codingDraft.testCases || []).length)}>
                      <Grid container spacing={1}>
                        {(codingDraft.testCases || []).map((tc, tcIdx) => (
                          <React.Fragment key={tc.id || `tc-${tcIdx}`}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                size="small"
                                multiline
                                minRows={2}
                                label={`Test ${tcIdx + 1} — Input`}
                                value={tc.input}
                                onChange={(e) => updateCodingDraftTestCase(tcIdx, 'input', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                size="small"
                                multiline
                                minRows={2}
                                label={`Test ${tcIdx + 1} — Expected output`}
                                value={tc.expectedOutput}
                                onChange={(e) => updateCodingDraftTestCase(tcIdx, 'expectedOutput', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Grid>
                          </React.Fragment>
                        ))}
                      </Grid>
                    </Collapse>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Assessment Integrity
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={<Switch checked={codingDraft.requireFullScreen} onChange={(e) => setCodingDraft({ ...codingDraft, requireFullScreen: e.target.checked })} color="primary" />}
                      label="Require full screen"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={<Switch checked={codingDraft.preventTabSwitch} onChange={(e) => setCodingDraft({ ...codingDraft, preventTabSwitch: e.target.checked })} color="primary" />}
                      label="Track tab switching"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={<Switch checked={codingDraft.blockCopyPaste} onChange={(e) => setCodingDraft({ ...codingDraft, blockCopyPaste: e.target.checked })} color="primary" />}
                      label="Block copy / paste"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={<Switch checked={codingDraft.autoSubmitOnTimeout} onChange={(e) => setCodingDraft({ ...codingDraft, autoSubmitOnTimeout: e.target.checked })} color="primary" />}
                      label="Auto-submit on timeout"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={<Switch checked={codingDraft.trackSuspiciousActivity} onChange={(e) => setCodingDraft({ ...codingDraft, trackSuspiciousActivity: e.target.checked })} color="primary" />}
                      label="Track suspicious activity"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Allowed Tab Switches"
                      value={codingDraft.maxTabSwitches}
                      onChange={(e) => setCodingDraft({ ...codingDraft, maxTabSwitches: Number(e.target.value) })}
                      InputLabelProps={{ shrink: true }}
                      disabled={!codingDraft.preventTabSwitch}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleSaveCodingQuestion}
                      disabled={!codingDraft.question.trim() || !codingDraft.description.trim()}
                      sx={{ bgcolor: '#0d47a1' }}
                    >
                      {editingCodingQuestionId ? 'Update Coding Question' : 'Add Coding Question'}
                    </Button>
                    {editingCodingQuestionId && (
                      <Button onClick={resetCodingQuestionForm} sx={{ ml: 1 }}>
                        Cancel Edit
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ p: 2, mt: 3, bgcolor: alpha('#0d47a1', 0.05), border: '1px solid', borderColor: alpha('#0d47a1', 0.2) }}>
                <Typography variant="subtitle2" fontWeight={600} color="#0d47a1">
                  Candidate Experience Preview
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Candidates will first finish screening questions. If coding questions exist, the application can continue into a timed assessment experience with language restrictions, anti-paste rules, tab-switch monitoring, and suspicious activity logging for recruiter review.
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee', justifyContent: 'space-between' }}>
          <Box>
            {createTab > 0 && (
              <Button onClick={() => setCreateTab(createTab - 1)}>
                Previous
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={closeCreateDialog}
            >
              Cancel
            </Button>
            {createTab < 3 ? (
              <Button variant="contained" onClick={handleCreateNextTab} sx={{ bgcolor: '#0d47a1' }}>
                Next
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={handleCreateJob} 
                sx={{ bgcolor: '#0d47a1' }} 
                startIcon={<CheckCircleIcon />}
                disabled={isPosting}
              >
                {isPosting ? 'Posting...' : 'Post Job'}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog
        open={createCodingTemplateDialogOpen}
        onClose={() => setCreateCodingTemplateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee' }}>
          Import Coding Questions
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          <List dense disablePadding>
            {templatePackList.map((q, index) => (
              <ListItemButton
                key={`create-template-${q.id}`}
                onClick={() => pickTemplatePackForCreate(index)}
                sx={{ borderRadius: 1.5, mb: 0.75, border: '1px solid #e0e0e0' }}
              >
                <ListItemText
                  primaryTypographyProps={{ fontWeight: 600 }}
                  primary={`${index + 1}. ${q.question}`}
                  secondary={`${q.difficulty} - ${(q.testCases || []).length} test cases`}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCreateCodingTemplateDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Job Dialog - Same structure as Create Job */}
      <Dialog open={editDialogOpen} onClose={() => { if (!editDialogLoading) { setEditDialogOpen(false); setEditJobTitleOptions([]); resetEditQuestionForm(); resetEditCodingQuestionForm(); } }} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee', pb: 0 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Edit Job</Typography>
        </DialogTitle>
        
        {/* Tabs */}
        <Tabs 
          value={editTab} 
          onChange={handleEditTabChange} 
          sx={{ minHeight: 40, px: 3, borderBottom: '1px solid #eee' }}
        >
          <Tab label="Job Details" sx={{ minHeight: 40, textTransform: 'none' }} />
          <Tab label="Required Skills" sx={{ minHeight: 40, textTransform: 'none' }} />
          <Tab label="Screening Questions" sx={{ minHeight: 40, textTransform: 'none' }} />
          <Tab label="Coding Questions" sx={{ minHeight: 40, textTransform: 'none' }} />
        </Tabs>
        
        <DialogContent sx={{ pt: 3, minHeight: 400, position: 'relative' }}>
          {editDialogLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255,255,255,0.85)',
                zIndex: 10,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {editingJob && (
            <>
              {/* Tab 0: Job Details */}
              {editTab === 0 && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel shrink sx={outlinedSelectLabelSx}>Hiring countries</InputLabel>
                      <Select
                        multiple
                        value={editingJob.hiringCountries ?? []}
                        label="Hiring countries"
                        open={editHiringCountriesSelectOpen}
                        onOpen={() => setEditHiringCountriesSelectOpen(true)}
                        onClose={() => setEditHiringCountriesSelectOpen(false)}
                        onChange={(e) => {
                          const v = e.target.value;
                          setEditingJob({ ...editingJob, hiringCountries: typeof v === 'string' ? v.split(',') : v });
                          setEditHiringCountriesSelectOpen(false);
                        }}
                        renderValue={(selected) => (selected as string[]).map((code) => HIRING_COUNTRIES.find((c) => c.value === code)?.label || code).join(', ')}
                      >
                        {HIRING_COUNTRIES.map((c) => (
                          <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                        ))}
                        </Select>
                        <FormHelperText>Job will be visible only to techies from the selected countries.</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                    <Autocomplete
                      freeSolo
                      options={editJobTitleOptions}
                      value={editingJob.title || ''}
                      onChange={(_, newValue) => {
                        setEditingJob({ ...editingJob, title: newValue || '' });
                        setEditJobErrors({ ...editJobErrors, title: false });
                      }}
                      onInputChange={onEditJobTitleInputChange}
                      filterOptions={(options) => options}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          label="Job Title"
                          placeholder="e.g., Senior Software Engineer"
                          required
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          error={!!editJobErrors.title}
                          helperText={editJobErrors.title ? "Job Title is required" : ""}
                        />
                      )}
                      slotProps={{
                        paper: {
                          sx: {
                            maxHeight: 240,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required error={!!editJobErrors.department}>
                      <InputLabel shrink>Department</InputLabel>
                      <Select
                        value={editingJob.department || ''}
                        label="Department"
                        onChange={(e) => { setEditingJob({ ...editingJob, department: e.target.value }); setEditJobErrors({ ...editJobErrors, department: false }); }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>Select Department</MenuItem>
                        <MenuItem value="engineering">Engineering</MenuItem>
                        <MenuItem value="design">Design</MenuItem>
                        <MenuItem value="marketing">Marketing</MenuItem>
                        <MenuItem value="sales">Sales</MenuItem>
                        <MenuItem value="hr">Human Resources</MenuItem>
                        <MenuItem value="finance">Finance</MenuItem>
                        <MenuItem value="operations">Operations</MenuItem>
                        <MenuItem value="product">Product</MenuItem>
                        <MenuItem value="data">Data Science</MenuItem>
                        {editingJob.department && !['engineering', 'design', 'marketing', 'sales', 'hr', 'finance', 'operations', 'product', 'data'].includes(String(editingJob.department).toLowerCase()) && (
                          <MenuItem value={editingJob.department}>{editingJob.department}</MenuItem>
                        )}
                      </Select>
                      {editJobErrors.department && <FormHelperText>Department is required</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      freeSolo
                      options={locationSuggestions}
                      value={editingJob.location}
                      onChange={(_, newValue) => { 
                        setEditingJob({ ...editingJob, location: newValue || '' }); 
                        setEditJobErrors({ ...editJobErrors, location: false }); 
                      }}
                      onInputChange={(_, newInputValue) => { 
                        setEditingJob({ ...editingJob, location: newInputValue }); 
                        setEditJobErrors({ ...editJobErrors, location: false }); 
                        if (newInputValue && newInputValue.length >= 2) {
                          handleLocationSearch(newInputValue);
                        } else {
                          setLocationSuggestions([]);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Location"
                          placeholder="e.g., New York, NY or Remote"
                          InputLabelProps={{ shrink: true }}
                          error={!!editJobErrors.location}
                          helperText={editJobErrors.location ? "Location is required" : ""}
                          required
                          variant="outlined"
                        />
                      )}
                      slotProps={{
                        paper: {
                          sx: {
                            maxHeight: 200,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required error={!!editJobErrors.type}>
                      <InputLabel shrink>Employment Type</InputLabel>
                      <Select
                        value={editingJob.type}
                        label="Employment Type"
                        onChange={(e) => { setEditingJob({ ...editingJob, type: e.target.value }); setEditJobErrors({ ...editJobErrors, type: false }); }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>Select Type</MenuItem>
                        <MenuItem value="fulltime">Full-Time</MenuItem>
                        <MenuItem value="parttime">Part-Time</MenuItem>
                        <MenuItem value="w2contract">W2 - Contract</MenuItem>
                        <MenuItem value="corp2corp">Corp-to-Corp</MenuItem>
                        <MenuItem value="unpaid_internship">Unpaid Internship</MenuItem>
                        <MenuItem value="paid_internship">Paid Internship</MenuItem>
                        <MenuItem value="freelance">Freelance</MenuItem>
                      </Select>
                      {editJobErrors.type && <FormHelperText>Employment Type is required</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required error={!!editJobErrors.experience}>
                      <InputLabel shrink>Experience Level</InputLabel>
                      <Select
                        value={editingJob.experience || ''}
                        label="Experience Level"
                        onChange={(e) => { setEditingJob({ ...editingJob, experience: e.target.value }); setEditJobErrors({ ...editJobErrors, experience: false }); }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>Select Level</MenuItem>
                        <MenuItem value="college_fresh">College fresh grads</MenuItem>
                        <MenuItem value="0_2">0 to 2+ years</MenuItem>
                        <MenuItem value="2_5">2 to 5+ years</MenuItem>
                        <MenuItem value="5_8">5 to 8 years</MenuItem>
                        <MenuItem value="8_10">8 to 10 years</MenuItem>
                        <MenuItem value="10_12">10 to 12+</MenuItem>
                        <MenuItem value="12_leadership">12 to leadership</MenuItem>
                      </Select>
                      {editJobErrors.experience && <FormHelperText>Experience Level is required</FormHelperText>}
                    </FormControl>
                  </Grid>
                  {(editingJob.hiringCountries ?? []).includes('US') && (
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel shrink sx={outlinedSelectLabelSx}>What work authorizations are accepted for this role?</InputLabel>
                        <Select
                          multiple
                          value={editingJob.workAuthorizations ?? []}
                          label="What work authorizations are accepted for this role?"
                          open={editWorkAuthorizationsSelectOpen}
                          onOpen={() => setEditWorkAuthorizationsSelectOpen(true)}
                          onClose={() => setEditWorkAuthorizationsSelectOpen(false)}
                          onChange={(e) => {
                            const v = e.target.value;
                            setEditingJob({ ...editingJob, workAuthorizations: typeof v === 'string' ? v.split(',') : v });
                            setEditWorkAuthorizationsSelectOpen(false);
                          }}
                          renderValue={(selected) => (selected as string[]).join(', ')}
                      >
                        {USA_WORK_AUTH_OPTIONS.map((opt) => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>Job will be visible only to users whose work authorization matches.</FormHelperText>
                    </FormControl>
                  </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel shrink sx={outlinedSelectLabelSx}>Is this role open for sponsorship?</InputLabel>
                      <Select
                        value={editingJob.openForSponsorship === null || editingJob.openForSponsorship === undefined ? '' : editingJob.openForSponsorship ? 'yes' : 'no'}
                        label="Is this role open for sponsorship?"
                        onChange={(e) => {
                          const v = e.target.value;
                          setEditingJob({ ...editingJob, openForSponsorship: v === 'yes' ? true : v === 'no' ? false : null });
                        }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>Select</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                      {editJobErrors.openForSponsorship && <FormHelperText error>Please select Yes or No</FormHelperText>}
                    </FormControl>
                  </Grid>
                  {(editingJob.hiringCountries ?? []).length > 1 && (
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel shrink sx={outlinedSelectLabelSx}>Salary currency</InputLabel>
                        <Select
                          value={editingJob.salaryCurrency || 'USD'}
                          label="Salary currency"
                          onChange={(e) => {
                            setEditingJob({ ...editingJob, salaryCurrency: e.target.value });
                            setEditSalaryCurrencyTouched(true);
                          }}
                        >
                          {CURRENCY_OPTIONS.map((currency) => (
                            <MenuItem key={currency.value} value={currency.value}>{currency.label}</MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {`Suggestions: ${getSuggestedSalaryCurrencies(editingJob.hiringCountries ?? []).join(', ') || 'USD'}. HR can choose one.`}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Minimum Salary (Annual) - optional"
                      value={editingJob.salaryMin != null && editingJob.salaryMin !== '' ? String(editingJob.salaryMin) : ''}
                      onChange={(e) => { setEditingJob({ ...editingJob, salaryMin: e.target.value }); setEditJobErrors({ ...editJobErrors, salaryMin: false, salaryMax: false }); }}
                      placeholder="e.g., 600000"
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <InputAdornment position="start">{getCurrencySymbol(editingJob.salaryCurrency)}</InputAdornment> }}
                      error={!!editJobErrors.salaryMin}
                      helperText={editJobErrors.salaryMin ? "Valid minimum salary" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Maximum Salary (Annual) - optional"
                      value={editingJob.salaryMax != null && editingJob.salaryMax !== '' ? String(editingJob.salaryMax) : ''}
                      onChange={(e) => { setEditingJob({ ...editingJob, salaryMax: e.target.value }); setEditJobErrors({ ...editJobErrors, salaryMin: false, salaryMax: false }); }}
                      placeholder="e.g., 1200000"
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <InputAdornment position="start">{getCurrencySymbol(editingJob.salaryCurrency)}</InputAdornment> }}
                      error={!!editJobErrors.salaryMax}
                      helperText={editJobErrors.salaryMax ? "Valid maximum salary" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, px: 2, py: 1.5, minHeight: 112 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!!editingJob.collectApplicantLocation}
                            onChange={(e) => setEditingJob({ ...editingJob, collectApplicantLocation: e.target.checked })}
                            color="primary"
                          />
                        }
                        label="Collect applicant location"
                      />
                      <FormHelperText sx={{ display: 'block', mt: 0.5 }}>
                        Location is captured only at submission and shown to you as read-only.
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Job Description"
                      value={editingJob.description || ''}
                      onChange={(e) => { setEditingJob({ ...editingJob, description: e.target.value }); setEditJobErrors({ ...editJobErrors, description: false }); }}
                      multiline
                      rows={3}
                      placeholder="Describe the role and what the candidate will be doing..."
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ inputProps: { 'data-allow-paste': 'true' } as any }}
                      required
                      error={!!editJobErrors.description}
                      helperText={editJobErrors.description ? "Job Description is required" : ""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Key Responsibilities"
                      value={editingJob.responsibilities || ''}
                      onChange={(e) => { setEditingJob({ ...editingJob, responsibilities: e.target.value }); setEditJobErrors({ ...editJobErrors, responsibilities: false }); }}
                      multiline
                      rows={3}
                      placeholder="List the main responsibilities (one per line)..."
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ inputProps: { 'data-allow-paste': 'true' } as any }}
                      required
                      error={!!editJobErrors.responsibilities}
                      helperText={editJobErrors.responsibilities ? "Key Responsibilities are required" : ""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editingJob.status === 'active'}
                          onChange={(e) => setEditingJob({ ...editingJob, status: e.target.checked ? 'active' : 'draft' })}
                        />
                      }
                      label={editingJob.status === 'active' ? 'Job is Active' : 'Job is Draft'}
                    />
                  </Grid>
                </Grid>
              )}
              
              {/* Tab 1: Required Skills */}
              {editTab === 1 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add the skills required for this position. These will be used to match candidates.
                  </Typography>

                  {/* Add skill input */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <Autocomplete
                      freeSolo
                      options={editSkillOptions.filter((s) => !editSkills.includes(s))}
                      value={editNewSkill || null}
                      onChange={(_, newValue) => {
                        if (newValue) {
                          setEditNewSkill(newValue);
                          if (editSkillsFieldError) setEditSkillsFieldError(false);
                        }
                      }}
                      onInputChange={onEditSkillInputChange}
                      filterOptions={(options) => options}
                      fullWidth
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Select a skill to add..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault(); // Prevent form submission
                              handleAddEditSkill();
                            }
                          }}
                          error={editSkillsFieldError}
                          helperText={editSkillsFieldError ? 'At least 2 skills are required' : ''}
                        />
                      )}
                    />
                    <Button 
                      variant="contained" 
                      onClick={handleAddEditSkill}
                      sx={{ bgcolor: '#0d47a1', whiteSpace: 'nowrap' }}
                    >
                      Add Skill
                    </Button>
                  </Box>
                  
                  {/* Current skills */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2, minHeight: 60 }}>
                    {editSkills.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">No skills added yet</Typography>
                    ) : (
                      editSkills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          onDelete={() => handleRemoveEditSkill(skill)}
                          sx={{ 
                            bgcolor: alpha('#0d47a1', 0.1), 
                            color: '#0d47a1',
                            '& .MuiChip-deleteIcon': { color: '#0d47a1' },
                          }}
                        />
                      ))
                    )}
                  </Box>
                  
                  {/* Suggested skills */}
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    Suggested Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {SUGGESTED_SKILL_CHIPS.filter((skill) => !editSkills.includes(skill))
                      .map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        variant="outlined"
                        onClick={() => setEditSkills([...editSkills, skill])}
                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: alpha('#0d47a1', 0.05) } }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {/* Tab 2: Screening Questions */}
              {editTab === 2 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add only the questions you want. Applicants will see these exact questions while applying, including whether each one is required or optional.
                  </Typography>
                  
                  {/* Existing questions */}
                  <List sx={{ mb: 3 }}>
                    {editQuestions.map((q, index) => (
                      <Paper key={q.id} sx={{ mb: 1, p: 2, bgcolor: alpha('#0d47a1', 0.02) }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <DragIndicatorIcon sx={{ color: '#888', mt: 0.5, cursor: 'grab' }} />
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="body1" fontWeight={500}>
                                {index + 1}. {q.question}
                              </Typography>
                              <Chip label={q.required ? 'Required' : 'Optional'} size="small" color={q.required ? 'error' : 'default'} sx={{ height: 20, fontSize: '0.7rem' }} />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Type: {getScreeningQuestionTypeLabel(q.type)}
                              {q.options && ` • Options: ${q.options.join(', ')}`}
                            </Typography>
                          </Box>
                          <IconButton size="small" onClick={() => handleStartEditQuestion(q)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleRemoveEditQuestion(q.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </List>
                  
                  {/* Add new question */}
                  <Paper sx={{ p: 2, border: '2px dashed #ddd' }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                      {editEditingQuestionId ? 'Edit Question' : 'Add New Question'}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Question"
                          value={editNewQuestion}
                          onChange={(e) => setEditNewQuestion(e.target.value)}
                          placeholder="e.g., What is your experience with React?"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel shrink>Answer Type</InputLabel>
                          <Select
                            value={editQuestionType}
                            label="Answer Type"
                            onChange={(e) => setEditQuestionType(e.target.value as any)}
                          >
                            <MenuItem value="text">Normal Question</MenuItem>
                            <MenuItem value="video">Verbal Question</MenuItem>
                            <MenuItem value="multiple">Multiple Choice</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={editQuestionRequired}
                              onChange={(e) => setEditQuestionRequired(e.target.checked)}
                              color="primary"
                            />
                          }
                          label="Required question"
                        />
                      </Grid>
                      {editQuestionType === 'video' && (
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Max video length (seconds)"
                            value={editVideoMaxSeconds}
                            onChange={(e) =>
                              setEditVideoMaxSeconds(Math.min(600, Math.max(15, parseInt(e.target.value, 10) || 120)))
                            }
                            inputProps={{ min: 15, max: 600 }}
                            InputLabelProps={{ shrink: true }}
                            helperText="15–600 seconds"
                          />
                        </Grid>
                      )}
                      {editQuestionType === 'multiple' && (
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            Options (one per field)
                          </Typography>
                          {editQuestionOptions.map((opt, idx) => (
                            <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                              <TextField
                                size="small"
                                fullWidth
                                placeholder={`Option ${idx + 1}`}
                                value={opt}
                                onChange={(e) => {
                                  const newOpts = [...editQuestionOptions];
                                  newOpts[idx] = e.target.value;
                                  setEditQuestionOptions(newOpts);
                                }}
                              />
                              {editQuestionOptions.length > 1 && (
                                <IconButton size="small" onClick={() => setEditQuestionOptions(editQuestionOptions.filter((_, i) => i !== idx))}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          ))}
                          <Button size="small" onClick={() => setEditQuestionOptions([...editQuestionOptions, ''])}>
                            + Add Option
                          </Button>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          onClick={handleAddEditQuestion}
                          disabled={!editNewQuestion.trim()}
                          sx={{ bgcolor: '#0d47a1' }}
                        >
                          {editEditingQuestionId ? 'Update Question' : 'Add Question'}
                        </Button>
                        {editEditingQuestionId && (
                          <Button onClick={resetEditQuestionForm} sx={{ ml: 1 }}>
                            Cancel Edit
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              )}
              {editTab === 3 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Keep coding questions optional. When enabled, these settings shape the candidate assessment flow and the integrity signals recruiters will later review.
                  </Typography>

                  <List sx={{ mb: 3 }}>
                    {editCodingQuestions.map((q, index) => (
                      <Paper key={q.id} sx={{ mb: 1.5, p: 2, bgcolor: alpha('#0d47a1', 0.02) }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <DragIndicatorIcon sx={{ color: '#888', mt: 0.5, cursor: 'grab' }} />
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                              <Typography variant="body1" fontWeight={500}>
                                {index + 1}. {q.question}
                              </Typography>
                              <Chip label={q.required ? 'Required' : 'Optional'} size="small" color={q.required ? 'error' : 'default'} sx={{ height: 20, fontSize: '0.7rem' }} />
                              <Chip label={q.difficulty.toUpperCase()} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                              <Chip label={`${q.timeLimitMinutes} min`} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Languages: {q.allowedLanguages.join(', ')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              Guardrails: {[
                                q.requireFullScreen ? 'Full screen' : null,
                                q.preventTabSwitch ? `Tab limit ${q.maxTabSwitches}` : null,
                                q.blockCopyPaste ? 'Paste blocked' : null,
                                q.autoSubmitOnTimeout ? 'Auto submit' : null,
                                q.trackSuspiciousActivity ? 'Suspicious activity tracking' : null,
                              ].filter(Boolean).join(' • ')}
                            </Typography>
                          </Box>
                          <IconButton size="small" onClick={() => handleStartEditCodingQuestion(q)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleRemoveEditCodingQuestion(q.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </List>

                  <Paper sx={{ p: 2, border: '2px dashed #ddd' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {editEditingCodingQuestionId ? 'Edit Coding Question' : 'Add Coding Question'}
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => setEditCodingTemplateDialogOpen(true)}
                        sx={{ bgcolor: '#0d47a1', textTransform: 'none' }}
                      >
                        Import questions
                      </Button>
                    </Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                      {editEditingCodingQuestionId ? 'Edit Question Details' : 'Question Details'}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Question Title"
                          value={editCodingDraft.question}
                          onChange={(e) => setEditCodingDraft({ ...editCodingDraft, question: e.target.value })}
                          placeholder="e.g., Print Hello World"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Problem Statement"
                          value={editCodingDraft.description}
                          onChange={(e) => setEditCodingDraft({ ...editCodingDraft, description: e.target.value })}
                          placeholder="Explain the task, input/output expectation, and evaluation notes."
                          InputLabelProps={{ shrink: true }}
                          InputProps={{ inputProps: { 'data-allow-paste': 'true' } as any }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                          <InputLabel shrink>Difficulty</InputLabel>
                          <Select
                            value={editCodingDraft.difficulty}
                            label="Difficulty"
                            onChange={(e) => setEditCodingDraft({ ...editCodingDraft, difficulty: e.target.value as CodingAssessmentQuestion['difficulty'] })}
                          >
                            <MenuItem value="easy">Easy</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="hard">Hard</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Time Limit (minutes)"
                          value={editCodingDraft.timeLimitMinutes}
                          onChange={(e) => setEditCodingDraft({ ...editCodingDraft, timeLimitMinutes: Number(e.target.value) })}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={<Switch checked={editCodingDraft.required} onChange={(e) => setEditCodingDraft({ ...editCodingDraft, required: e.target.checked })} color="primary" />}
                          label="Required question"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Autocomplete
                          multiple
                          options={CODING_LANGUAGE_OPTIONS}
                          value={editCodingDraft.allowedLanguages}
                          onChange={(_, value) => setEditCodingDraft({ ...editCodingDraft, allowedLanguages: value })}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Allowed Languages"
                              placeholder="Choose languages"
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Sample Input"
                          value={editCodingDraft.sampleInput}
                          onChange={(e) => setEditCodingDraft({ ...editCodingDraft, sampleInput: e.target.value })}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Sample Output"
                          value={editCodingDraft.sampleOutput}
                          onChange={(e) => setEditCodingDraft({ ...editCodingDraft, sampleOutput: e.target.value })}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Expected Output / Test Hint"
                          value={editCodingDraft.expectedOutput}
                          onChange={(e) => setEditCodingDraft({ ...editCodingDraft, expectedOutput: e.target.value })}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Starter Code"
                          value={editCodingDraft.starterCode}
                          onChange={(e) => setEditCodingDraft({ ...editCodingDraft, starterCode: e.target.value })}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                          Hidden test cases (auto-judge)
                        </Typography>
                        <Collapse in={Boolean((editCodingDraft.testCases || []).length)}>
                          <Grid container spacing={1}>
                            {(editCodingDraft.testCases || []).map((tc, tcIdx) => (
                              <React.Fragment key={tc.id || `edit-tc-${tcIdx}`}>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    multiline
                                    minRows={2}
                                    label={`Test ${tcIdx + 1} — Input`}
                                    value={tc.input}
                                    onChange={(e) => updateEditCodingDraftTestCase(tcIdx, 'input', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    multiline
                                    minRows={2}
                                    label={`Test ${tcIdx + 1} — Expected output`}
                                    value={tc.expectedOutput}
                                    onChange={(e) => updateEditCodingDraftTestCase(tcIdx, 'expectedOutput', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>
                              </React.Fragment>
                            ))}
                          </Grid>
                        </Collapse>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Assessment Integrity
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={<Switch checked={editCodingDraft.requireFullScreen} onChange={(e) => setEditCodingDraft({ ...editCodingDraft, requireFullScreen: e.target.checked })} color="primary" />}
                          label="Require full screen"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={<Switch checked={editCodingDraft.preventTabSwitch} onChange={(e) => setEditCodingDraft({ ...editCodingDraft, preventTabSwitch: e.target.checked })} color="primary" />}
                          label="Track tab switching"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={<Switch checked={editCodingDraft.blockCopyPaste} onChange={(e) => setEditCodingDraft({ ...editCodingDraft, blockCopyPaste: e.target.checked })} color="primary" />}
                          label="Block copy / paste"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={<Switch checked={editCodingDraft.autoSubmitOnTimeout} onChange={(e) => setEditCodingDraft({ ...editCodingDraft, autoSubmitOnTimeout: e.target.checked })} color="primary" />}
                          label="Auto-submit on timeout"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={<Switch checked={editCodingDraft.trackSuspiciousActivity} onChange={(e) => setEditCodingDraft({ ...editCodingDraft, trackSuspiciousActivity: e.target.checked })} color="primary" />}
                          label="Track suspicious activity"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Allowed Tab Switches"
                          value={editCodingDraft.maxTabSwitches}
                          onChange={(e) => setEditCodingDraft({ ...editCodingDraft, maxTabSwitches: Number(e.target.value) })}
                          InputLabelProps={{ shrink: true }}
                          disabled={!editCodingDraft.preventTabSwitch}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          onClick={handleSaveEditCodingQuestion}
                          disabled={!editCodingDraft.question.trim() || !editCodingDraft.description.trim()}
                          sx={{ bgcolor: '#0d47a1' }}
                        >
                          {editEditingCodingQuestionId ? 'Update Coding Question' : 'Add Coding Question'}
                        </Button>
                        {editEditingCodingQuestionId && (
                          <Button onClick={resetEditCodingQuestionForm} sx={{ ml: 1 }}>
                            Cancel Edit
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee', justifyContent: 'space-between' }}>
          <Box>
            {editTab > 0 && (
              <Button onClick={() => setEditTab(editTab - 1)}>
                Previous
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={() => { setEditDialogOpen(false); setEditJobTitleOptions([]); setEditJobErrors({}); setEditSkillsFieldError(false); setEditTab(0); resetEditQuestionForm(); resetEditCodingQuestionForm(); }}>Cancel</Button>
            {editTab < 3 ? (
              <Button variant="contained" onClick={handleEditNextTab} sx={{ bgcolor: '#0d47a1' }}>
                Next
              </Button>
            ) : (
              <Button variant="contained" onClick={handleEditJob} sx={{ bgcolor: '#0d47a1' }}>
                Save Changes
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editCodingTemplateDialogOpen}
        onClose={() => setEditCodingTemplateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee' }}>
          Import Coding Questions
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          <List dense disablePadding>
            {templatePackList.map((q, index) => (
              <ListItemButton
                key={`edit-template-${q.id}`}
                onClick={() => pickTemplatePackForEdit(index)}
                sx={{ borderRadius: 1.5, mb: 0.75, border: '1px solid #e0e0e0' }}
              >
                <ListItemText
                  primaryTypographyProps={{ fontWeight: 600 }}
                  primary={`${index + 1}. ${q.question}`}
                  secondary={`${q.difficulty} - ${(q.testCases || []).length} test cases`}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditCodingTemplateDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* View Applicants Dialog */}
      <Dialog open={applicantsDialogOpen} onClose={() => setApplicantsDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                Applicants for {selectedJob?.title}
              </Typography>
              {selectedJob?.status === 'closed' && (
                <Chip 
                  label="JOB CLOSED" 
                  size="small" 
                  color="error" 
                  sx={{ fontWeight: 'bold' }} 
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {applicants.length} total applicants • Sorted by profile match score
            </Typography>
          </Box>
          <IconButton onClick={() => setApplicantsDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Tabs 
            value={applicantTab} 
            onChange={(_, v) => setApplicantTab(v)} 
            sx={{ borderBottom: '1px solid #eee', px: 2 }}
          >
            <Tab label={`All (${applicants.length})`} />
            <Tab label={`New (${applicants.filter(a => isNew(a.status)).length})`} />
            <Tab label={`Reviewed (${applicants.filter(a => isReviewed(a.status)).length})`} />
            <Tab label={`Interviewed (${applicants.filter(a => isInterviewed(a.status)).length})`} />
            <Tab label={`Rejected (${applicants.filter(a => isRejected(a.status)).length})`} />
          </Tabs>
          
          {applicants.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No applicants yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                No one has applied to this job yet. Browse existing candidates in the system to find potential matches.
              </Typography>
              {/* <Button 
                variant="contained" 
                onClick={loadAllCandidates}
                sx={{ bgcolor: '#0d47a1' }}
              >
                Browse All Candidates
              </Button> */}
            </Box>
          ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha('#0d47a1', 0.02) }}>
                  <TableCell sx={{ fontWeight: 600 }}>Candidate</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Experience</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Match Score</TableCell>
                  {selectedJob?.collectApplicantLocation && (
                    <TableCell sx={{ fontWeight: 600 }}>Location at apply</TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplicants.map((applicant) => (
                  <ApplicantRow key={applicant.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: alpha('#0d47a1', 0.1), color: '#0d47a1' }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>{applicant.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{applicant.title}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Applied {applicant.appliedDate}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ display: selectedJob?.collectApplicantLocation ? 'table-cell' : 'none' }}>
                      <Typography variant="body2">{applicant.experience}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <MatchBadge score={applicant.matchScore}>
                        {applicant.matchScore}%
                      </MatchBadge>
                    </TableCell>
                    <TableCell>
                      {applicant.applicantLocationLat != null && applicant.applicantLocationLng != null ? (
                        <Tooltip
                          title={
                            <Box component="span">
                              <div>Coordinates: {applicant.applicantLocationLat?.toFixed(5)}, {applicant.applicantLocationLng?.toFixed(5)}</div>
                              {applicant.applicantLocationIpSnapshot && (
                                <div>IP snapshot: {typeof applicant.applicantLocationIpSnapshot === 'object' && applicant.applicantLocationIpSnapshot !== null && 'ip' in applicant.applicantLocationIpSnapshot
                                  ? String((applicant.applicantLocationIpSnapshot as any).ip)
                                  : '—'} (at apply time, read-only)
                                </div>
                              )}
                            </Box>
                          }
                        >
                          <Chip size="small" label={formatLocationAtApply(applicant)} color="primary" variant="outlined" sx={{ fontWeight: 600, maxWidth: 220 }} />
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" color="text.secondary">—</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={applicant.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        size="small"
                        sx={{
                          bgcolor: alpha(getStatusColor(applicant.status), 0.1),
                          color: getStatusColor(applicant.status),
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', overflow: 'visible' }}>
                        {isNew(applicant.status) && (
                          <Tooltip title="Proceed to Shortlisted for Screening">
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              startIcon={<ThumbUpIcon />}
                              onClick={() => updateApplicantStage(applicant.id, 'shortlisted', applicant)}
                              sx={{ minWidth: 0, px: 1 }}
                            >
                              Proceed
                            </Button>
                          </Tooltip>
                        )}
                        {!isRejected(applicant.status) && applicant.status?.toLowerCase() !== 'hired' && (
                          <Tooltip title="Reject applicant">
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => {
                                if (window.confirm(`Reject ${applicant.name}? They will be moved to Rejected and notified by email.`)) {
                                  updateApplicantStage(applicant.id, 'rejected', applicant);
                                }
                              }}
                              sx={{ minWidth: 0, px: 1 }}
                            >
                              Reject
                            </Button>
                          </Tooltip>
                        )}
                        <Tooltip title="View Profile">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#0d47a1' }}
                            onClick={() => {
                              const candidateId = applicant.applicantId || applicant.id;
                              navigate(`/techie/ats/candidate/${candidateId}`, {
                                state: {
                                  pipelineCandidate: {
                                    matchScore: applicant.matchScore,
                                    stage: applicant.status,
                                    time: applicant.appliedDate,
                                    jobId: selectedJob?.id || '',
                                    jobTitle: selectedJob?.title || '',
                                    role: selectedJob?.title || applicant.title || '',
                                    applicationId: applicant.id,
                                  },
                                },
                              });
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More actions">
                          <IconButton
                            size="small"
                            sx={{ color: '#0d47a1' }}
                            onClick={(event) => {
                              event.stopPropagation();
                              openApplicantActionsMenu(event, applicant);
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {activeApplicantMenu?.id === applicant.id && (
                          <Paper
                            elevation={8}
                            sx={{
                              position: 'absolute',
                              top: 'calc(100% + 8px)',
                              right: 0,
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 0.5,
                              p: 0.75,
                              zIndex: 20,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              overflow: 'visible',
                              bgcolor: '#fff',
                            }}
                          >
                            <Tooltip title={scheduledInterviewApplicationIds.has(String(applicant.id)) ? 'Reschedule Interview' : 'Schedule Interview'}>
                              <IconButton
                                size="small"
                                sx={{ color: '#5856D6' }}
                                onClick={() => {
                                  setScheduleModalContext({
                                    applicationId: applicant.id,
                                    candidateId: applicant.applicantId || applicant.id,
                                    candidateName: applicant.name,
                                    candidateEmail: applicant.email || '',
                                    jobId: selectedJob?.id || '',
                                    jobTitle: selectedJob?.title || '',
                                  });
                                  setScheduleModalOpen(true);
                                  closeApplicantActionsMenu();
                                }}
                              >
                                <ScheduleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Email">
                              <IconButton
                                size="small"
                                sx={{ color: '#34C759' }}
                                onClick={() => {
                                  if (applicant.email) {
                                    window.open(`mailto:${applicant.email}?subject=Regarding Your Application for ${selectedJob?.title || 'Position'}`, '_blank');
                                  } else {
                                    setSnackbar({ open: true, message: 'No email available for this candidate', severity: 'warning' });
                                  }
                                  closeApplicantActionsMenu();
                                }}
                              >
                                <EmailIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Text (SMS)">
                              <IconButton
                                size="small"
                                sx={{ color: '#0d47a1' }}
                                onClick={() => {
                                  const phone = (applicant.phone || '').trim().replace(/\D/g, '');
                                  if (phone) {
                                    window.open(`sms:${phone}`, '_blank');
                                  } else {
                                    setSnackbar({ open: true, message: 'No phone number available for this candidate', severity: 'warning' });
                                  }
                                  closeApplicantActionsMenu();
                                }}
                              >
                                <SmsIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Share VTCalendar link">
                              <IconButton
                                size="small"
                                sx={{ color: '#00897b' }}
                                onClick={async () => {
                                  if (hrCalendarLink) {
                                    try {
                                      await navigator.clipboard.writeText(hrCalendarLink);
                                      setSnackbar({ open: true, message: 'Calendar link copied to clipboard. Send it to the candidate so they can book a slot.', severity: 'success' });
                                    } catch {
                                      setSnackbar({ open: true, message: 'Could not copy to clipboard', severity: 'error' });
                                    }
                                  } else {
                                    setSnackbar({ open: true, message: 'Set up your vtCalendar booking link in Calendar & Scheduling first.', severity: 'info' });
                                  }
                                  closeApplicantActionsMenu();
                                }}
                              >
                                <LinkIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Paper>
                        )}
                      </Box>
                    </TableCell>
                  </ApplicantRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            {applicants.length > 0 ? `Showing ${filteredApplicants.length} applicants sorted by relevance` : 'Browse candidates to find potential matches'}
          </Typography>
          {applicants.length > 0 && selectedJob && (
            <Button onClick={() => openApplicantsDialog(selectedJob)} sx={{ mr: 1 }}>
              Refresh Applicants
            </Button>
          )}
          <Button onClick={() => setApplicantsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <ScheduleInterviewModal
        open={scheduleModalOpen}
        onClose={() => { setScheduleModalOpen(false); setScheduleModalContext(null); }}
        onSuccess={() => {
          setSnackbar({ open: true, message: 'Interview scheduled successfully!', severity: 'success' });
          loadScheduledInterviewApplicationIds(); // so this row shows "Reschedule" next time
        }}
        onError={(msg) => setSnackbar({ open: true, message: msg, severity: 'error' })}
        context={scheduleModalContext}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ATSLayout>
  );
};

export default JobPostingsPage;
