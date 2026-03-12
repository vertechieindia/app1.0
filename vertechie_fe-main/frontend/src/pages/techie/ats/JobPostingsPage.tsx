/**
 * JobPostingsPage - Manage Job Listings
 * Enhanced with Create, Filter, Edit, and View Applicants functionality
 * Integrated with Backend API
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jobService, applicationService, userService, getHRUserInfo, Candidate } from '../../../services/jobPortalService';
import { Job, Application } from '../../../types/jobPortal';
import {
  Box, Typography, Card, CardContent, Chip, IconButton, TextField, Button,
  Grid, InputAdornment, Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Menu, Checkbox, FormControlLabel,
  FormGroup, Divider, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, LinearProgress, CircularProgress, Snackbar, Alert, Tabs, Tab, Switch, Tooltip, List, Autocomplete, FormHelperText,
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
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ATSLayout from './ATSLayout';
import ScheduleInterviewModal, { ScheduleInterviewContext } from '../../../components/ats/ScheduleInterviewModal';
import { interviewService } from '../../../services/interviewService';
import { API_ENDPOINTS, getApiUrl } from '../../../config/api';
import { fetchWithAuth } from '../../../utils/apiInterceptor';

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
  experience?: string;
  experienceLevel?: string;
  description?: string;
  responsibilities?: string;
  skills?: string[];
  requiredSkills?: string[];
  screeningQuestions?: Array<{ id: string; question: string; type?: string; required?: boolean; options?: string[] }>;
  salaryMin?: number;
  salaryMax?: number;
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
): { id: string; question: string; type: 'text' | 'yesno' | 'multiple' | 'number'; required: boolean; options?: string[] }[] {
  const list = Array.isArray(raw) ? raw : [];
  return list.map((q: any, idx: number) => ({
    id: q.id || `q-${idx}-${Date.now()}`,
    question: (q.question ?? q.question_text ?? q.title ?? '').toString().trim(),
    type: (q.type === 'yesno' || q.type === 'multiple' || q.type === 'number' ? q.type : 'text') as 'text' | 'yesno' | 'multiple' | 'number',
    required: parseRequired(q.required),
    options: Array.isArray(q.options) ? q.options : [],
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
  skills: string[];
  location?: string;
  avatarUrl?: string;
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
            salary: job.salary_min && job.salary_max
              ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
              : job.salary_min
                ? `From $${job.salary_min.toLocaleString()}`
                : job.salary_max
                  ? `Up to $${job.salary_max.toLocaleString()}`
                  : 'Not specified',
            applicants: job.applicantCount || 0,
            newApplicants: 0,
            views: job.views_count || 0,
            status: job.status || 'active',
            posted: formatTimeAgo(job.createdAt),
            description: desc || job.description,
            responsibilities: resp || (job as any).responsibilities || '',
            experience: job.experienceLevel,
            experienceLevel: job.experienceLevel,
            skills: job.requiredSkills || [],
            requiredSkills: job.requiredSkills || [],
            screeningQuestions: (job as any).screening_questions ?? job.screeningQuestions ?? [],
            salaryMin: job.salary_min,
            salaryMax: job.salary_max,
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
      setCreateDialogOpen(true);
      const next = new URLSearchParams(searchParams);
      next.delete('openCreate');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const [newJob, setNewJob] = useState({
    title: '', department: '', location: '', type: '', experience: '', 
    salaryMin: '', salaryMax: '', description: '', responsibilities: '',
  });
  const [newJobErrors, setNewJobErrors] = useState<Record<string, boolean>>({});
  const [skillsFieldError, setSkillsFieldError] = useState(false);
  
  // Predefined Skills for suggestions
  const ALL_SKILLS = [
    'React', 'Angular', 'Vue.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Next.js', 'Redux', 'Svelte',
    'Python', 'Node.js', 'Java', 'Go', 'Rust', 'C#', '.NET', 'Ruby', 'PHP', 'Django', 'FastAPI', 'Express.js', 'Spring Boot',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Oracle', 'SQL Server', 'DynamoDB', 'Cassandra',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins', 'GitLab CI', 'Terraform', 'Ansible', 'Linux',
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Xamarin',
    'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Data Science', 'NLP', 'Computer Vision', 'LLMs',
    'Git', 'VS Code', 'Jira', 'Figma', 'Postman', 'Slack', 'Notion'
  ].sort();
  
  // Available locations for suggestions
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

  // Location Search Handler
  const handleLocationSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setLocationSuggestions([]);
      return;
    }
    try {
      const q = encodeURIComponent(query.trim());
      const countries = ['IN', 'US'];
      const responses = await Promise.all(
        countries.map(async (country) => {
          const url = `${getApiUrl(API_ENDPOINTS.PLACES_AUTOCOMPLETE)}?q=${q}&country=${country}&limit=10`;
          const response = await fetchWithAuth(url);
          if (!response.ok) return [];
          const data = await response.json();
          return Array.isArray(data) ? data.map((place: any) => place.display_name).filter(Boolean) : [];
        })
      );
      const suggestions = Array.from(new Set(responses.flat())).slice(0, 20);
      setLocationSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setLocationSuggestions([]);
    }
  };
  
  // Skills state for create dialog (no default selection; HR chooses required skills)
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  
  // Screening Questions state for create dialog
  interface ScreeningQuestion {
    id: string;
    question: string;
    type: 'text' | 'yesno' | 'multiple' | 'number';
    required: boolean;
    options?: string[];
  }
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([
    { id: '1', question: 'How many years of experience do you have in this field?', type: 'number', required: true },
    { id: '2', question: 'Are you authorized to work in the location specified?', type: 'yesno', required: true },
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionType, setQuestionType] = useState<'text' | 'yesno' | 'multiple' | 'number'>('text');
  const [questionRequired, setQuestionRequired] = useState(true);
  const [questionOptions, setQuestionOptions] = useState<string[]>(['']);
  const [isPosting, setIsPosting] = useState(false);

  const validateCreateJobDetailsStep = (): boolean => {
    const requiredFields: Array<{ key: keyof typeof newJob; label: string }> = [
      { key: 'title', label: 'Job Title' },
      { key: 'department', label: 'Department' },
      { key: 'location', label: 'Location' },
      { key: 'type', label: 'Employment Type' },
      { key: 'experience', label: 'Experience Level' },
      { key: 'salaryMin', label: 'Minimum Salary' },
      { key: 'salaryMax', label: 'Maximum Salary' },
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
    setCreateTab((prev) => Math.min(prev + 1, 2));
  };

  const validateEditJobDetailsStep = (): boolean => {
    if (!editingJob) return false;
    const requiredFields: Array<{ key: string; label: string }> = [
      { key: 'title', label: 'Job Title' },
      { key: 'department', label: 'Department' },
      { key: 'location', label: 'Location' },
      { key: 'type', label: 'Employment Type' },
      { key: 'experience', label: 'Experience Level' },
      { key: 'salaryMin', label: 'Minimum Salary' },
      { key: 'salaryMax', label: 'Maximum Salary' },
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
    setEditTab((prev) => Math.min(prev + 1, 2));
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
        id: Date.now().toString(),
        question: newQuestion.trim(),
        type: questionType,
        required: questionRequired,
        options: questionType === 'multiple' ? questionOptions.filter(o => o.trim()) : undefined,
      };
      setQuestions([...questions, question]);
      setNewQuestion('');
      setQuestionType('text');
      setQuestionRequired(true);
      setQuestionOptions(['']);
    }
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
  
  // Filter Menu
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState({
    active: true, draft: true, closed: true, fulltime: true, parttime: true, contract: true, internship: true,
  });
  
  // Edit Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [editDialogLoading, setEditDialogLoading] = useState(false);
  const [editJobErrors, setEditJobErrors] = useState<Record<string, boolean>>({});
  const [editSkillsFieldError, setEditSkillsFieldError] = useState(false);
  const [editTab, setEditTab] = useState(0);
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [editNewSkill, setEditNewSkill] = useState('');
  const [editQuestions, setEditQuestions] = useState<{ id: string; question: string; type: 'text' | 'yesno' | 'multiple' | 'number'; required: boolean; options?: string[] }[]>([]);
  const [editNewQuestion, setEditNewQuestion] = useState('');
  const [editQuestionType, setEditQuestionType] = useState<'text' | 'yesno' | 'multiple' | 'number'>('text');
  const [editQuestionRequired, setEditQuestionRequired] = useState(true);
  const [editQuestionOptions, setEditQuestionOptions] = useState<string[]>(['']);
  
  // Applicants Dialog
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicantTab, setApplicantTab] = useState(0);
  // Schedule Interview (unified modal from View Applicants)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleModalContext, setScheduleModalContext] = useState<ScheduleInterviewContext | null>(null);
  const [scheduledInterviewApplicationIds, setScheduledInterviewApplicationIds] = useState<Set<string>>(new Set());

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

      // Convert screening questions to coding questions format
      const codingQuestions = questions.map((q) => ({
        id: q.id,
        question: q.question,
        description: `Type: ${q.type}${q.options ? ` | Options: ${q.options.join(', ')}` : ''}${q.required ? ' (Required)' : ''}`,
        difficulty: 'easy' as const,
      }));
      
      // Create job via API - include salary fields
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
        })),
        // Include salary values if provided
        salaryMin: newJob.salaryMin ? parseInt(newJob.salaryMin) : undefined,
        salaryMax: newJob.salaryMax ? parseInt(newJob.salaryMax) : undefined,
      }, userId);
      
      // Format salary display
      const salaryDisplay = newJob.salaryMin && newJob.salaryMax 
        ? `$${parseInt(newJob.salaryMin).toLocaleString()} - $${parseInt(newJob.salaryMax).toLocaleString()}`
        : newJob.salaryMin 
          ? `From $${parseInt(newJob.salaryMin).toLocaleString()}`
          : newJob.salaryMax
            ? `Up to $${parseInt(newJob.salaryMax).toLocaleString()}`
            : 'Not specified';

      // Map department for display
      const departmentDisplay = newJob.department.charAt(0).toUpperCase() + newJob.department.slice(1);
      
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
        applicants: 0,
        newApplicants: 0,
        views: 0,
        status: 'active',
        posted: 'Just now',
      };
      
      setJobs([displayJob, ...jobs]);
      setCreateDialogOpen(false);
      
      // Reset form
      setNewJob({ title: '', department: '', location: '', type: '', experience: '', salaryMin: '', salaryMax: '', description: '', responsibilities: '' });
      setNewJobErrors({});
      setSkills([]);
      setSkillsFieldError(false);
      setQuestions([
        { id: '1', question: 'How many years of experience do you have in this field?', type: 'number', required: true },
        { id: '2', question: 'Are you authorized to work in the location specified?', type: 'yesno', required: true },
      ]);
      setCreateTab(0);
      
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
      await jobService.updateJob(editingJob.id, {
        title: editingJob.title,
        description: editingJob.description || '',
        location: editingJob.location,
        jobType: jobTypeMap[editingJob.type as string] || 'full-time',
        companyName: getHRUserInfo()?.companyName || 'Company',
        requiredSkills: editSkills,
        experienceLevel: expMap[editingJob.experience as string] || 'mid',
        codingQuestions: editQuestions.map(q => ({
          id: q.id,
          question: q.question,
          description: q.question,
          difficulty: 'medium' as const,
          expectedOutput: q.type === 'yesno' ? 'Yes/No' : q.type === 'multiple' ? q.options?.join(',') || '' : '',
        })),
        screeningQuestions: editQuestions.map((q) => ({
          id: q.id,
          question: q.question,
          type: q.type,
          required: q.required,
          options: q.options || [],
        })),
        salaryMin: editingJob.salaryMin ? parseInt(editingJob.salaryMin) : undefined,
        salaryMax: editingJob.salaryMax ? parseInt(editingJob.salaryMax) : undefined,
      } as any);
      
      const salaryDisplay = editingJob.salaryMin && editingJob.salaryMax 
        ? `$${parseInt(editingJob.salaryMin).toLocaleString()} - $${parseInt(editingJob.salaryMax).toLocaleString()}`
        : editingJob.salaryMin 
          ? `From $${parseInt(editingJob.salaryMin).toLocaleString()}`
          : editingJob.salaryMax
            ? `Up to $${parseInt(editingJob.salaryMax).toLocaleString()}`
            : 'Not specified';

      // Update local state with full job data
      const updatedJob = {
        ...editingJob,
        skills: editSkills,
        screeningQuestions: editQuestions,
        salary: salaryDisplay,
      };
      setJobs(jobs.map(j => j.id === editingJob.id ? updatedJob : j));
      setEditDialogOpen(false);
      setEditingJob(null);
      setEditTab(0);
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
    setEditingJob({
      ...fullJob,
      type: formType,
      experience: formExp,
      description: j.description ?? '',
      responsibilities: j.responsibilities ?? '',
      department: j.department || fullJob.department || 'Company',
      salaryMin: j.salaryMin ?? fullJob.salaryMin,
      salaryMax: j.salaryMax ?? fullJob.salaryMax,
    } as any);
    setEditSkills(Array.isArray(skills) ? [...skills] : []);
    setEditQuestions(screeningQuestions);
  };

  const openEditDialog = async (job: DisplayJob) => {
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
    setEditingJob({
      ...listJob,
      type: formType,
      experience: formExp,
      description: desc ?? '',
      responsibilities: resp ?? '',
      department: listJob.department || 'Company',
      salaryMin: listJob.salaryMin ?? listJob.salary_min,
      salaryMax: listJob.salaryMax ?? listJob.salary_max,
    } as any);
    setEditSkills(Array.isArray(listSkills) ? [...listSkills] : []);
    setEditQuestions(listQuestions);
    setEditTab(0);
    setEditNewSkill('');
    setEditNewQuestion('');
    setEditQuestionType('text');
    setEditQuestionRequired(true);
    setEditQuestionOptions(['']);
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
          salaryMin: fetched.salary_min ?? job.salaryMin,
          salaryMax: fetched.salary_max ?? job.salaryMax,
          status: fetched.status || job.status,
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
      const newQ = {
        id: Date.now().toString(),
        question: editNewQuestion.trim(),
        type: editQuestionType,
        required: editQuestionRequired,
        ...(editQuestionType === 'multiple' ? { options: editQuestionOptions.filter(o => o.trim()) } : {}),
      };
      setEditQuestions([...editQuestions, newQ]);
      setEditNewQuestion('');
      setEditQuestionType('text');
      setEditQuestionRequired(true);
      setEditQuestionOptions(['']);
    }
  };
  
  const handleRemoveEditQuestion = (id: string) => {
    setEditQuestions(editQuestions.filter((q) => q.id !== id));
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
    
    try {
      // First try to get candidates from the userService (API + localStorage)
      const candidates = await userService.getCandidatesForJob(job.id);
      
      if (candidates.length > 0) {
        const displayApps: DisplayApplicant[] = candidates.map((candidate) => ({
          id: candidate.applicationId || candidate.id, // APPLICATION ID for interview scheduling
          applicantId: candidate.userId || candidate.id, // User ID for profile navigation
          name: candidate.name || 'Applicant',
          email: candidate.email || '',
          phone: '',
          title: candidate.title || 'Candidate',
          experience: candidate.experience || 'Not specified',
          matchScore: candidate.matchScore ?? 0,  // Use actual match score from backend
          status: candidate.status || 'new',
          appliedDate: candidate.appliedAt ? formatTimeAgo(candidate.appliedAt) : 'Recently',
          skills: candidate.skills || [],
          location: candidate.location || '',
          avatarUrl: candidate.avatar || '',
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
          experience: details?.experienceYears ? `${details.experienceYears}+ years` : 'Not specified',
          matchScore: app.codingScore || app.match_score || 0,
          status: app.status === 'applied' || (app.status as string) === 'submitted' ? 'new' : app.status,
          appliedDate: formatTimeAgo(app.appliedAt),
          skills: details?.skills || [],
          location: details?.location || '',
          avatarUrl: details?.avatarUrl || '',
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

  const filteredApplicants = applicants.filter(a => {
    if (applicantTab === 0) return true;
    if (applicantTab === 1) return isNew(a.status);
    if (applicantTab === 2) return isReviewed(a.status);
    if (applicantTab === 3) return isInterviewed(a.status);
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
    
    // job type filters
    const type = job.type.toLowerCase().replace('-', '');
    if (!filters.fulltime && type.includes('fulltime')) return false;
    if (!filters.parttime && type.includes('parttime')) return false;
    if (!filters.contract && type.includes('contract')) return false;
    if (!filters.internship && type.includes('internship')) return false;

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
            onClick={() => setCreateDialogOpen(true)}
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
        PaperProps={{ sx: { width: 250, p: 2 } }}
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
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, mt: 1 }}>Job Type</Typography>
        <FormGroup>
          <FormControlLabel 
            control={<Checkbox checked={filters.fulltime} onChange={(e) => setFilters({ ...filters, fulltime: e.target.checked })} />} 
            label="Full-time" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.parttime} onChange={(e) => setFilters({ ...filters, parttime: e.target.checked })} />} 
            label="Part-time" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.contract} onChange={(e) => setFilters({ ...filters, contract: e.target.checked })} />} 
            label="Contract" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.internship} onChange={(e) => setFilters({ ...filters, internship: e.target.checked })} />} 
            label="Internship" 
          />
        </FormGroup>
        <Divider sx={{ my: 1 }} />
        <Button fullWidth variant="outlined" size="small" onClick={() => setFilterAnchor(null)}>
          Apply Filters
        </Button>
      </Menu>

      {/* Create Job Dialog - Enhanced with Tabs */}
      <Dialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setNewJobErrors({});
          setSkillsFieldError(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee', pb: 0 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Post New Job</Typography>
          <Tabs value={createTab} onChange={handleCreateTabChange} sx={{ minHeight: 40 }}>
            <Tab label="Job Details" sx={{ minHeight: 40, textTransform: 'none' }} />
            <Tab label="Required Skills" sx={{ minHeight: 40, textTransform: 'none' }} />
            <Tab label="Screening Questions" sx={{ minHeight: 40, textTransform: 'none' }} />
          </Tabs>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, minHeight: 400 }}>
          {/* Tab 1: Job Details */}
          {createTab === 0 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={newJob.title}
                  onChange={(e) => { setNewJob({ ...newJob, title: e.target.value }); setNewJobErrors({ ...newJobErrors, title: false }); }}
                  placeholder="e.g., Senior Software Engineer"
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  error={!!newJobErrors.title}
                  helperText={newJobErrors.title ? "Job Title is required" : ""}
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Salary (Annual)"
                  value={newJob.salaryMin}
                  onChange={(e) => { setNewJob({ ...newJob, salaryMin: e.target.value }); setNewJobErrors({ ...newJobErrors, salaryMin: false, salaryMax: false }); }}
                  placeholder="e.g., 600000"
                  type="number"
                  required
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  helperText={newJobErrors.salaryMin ? "Valid minimum salary is required" : "Enter annual salary in INR"}
                  error={!!newJobErrors.salaryMin}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Salary (Annual)"
                  value={newJob.salaryMax}
                  onChange={(e) => { setNewJob({ ...newJob, salaryMax: e.target.value }); setNewJobErrors({ ...newJobErrors, salaryMin: false, salaryMax: false }); }}
                  placeholder="e.g., 1200000"
                  type="number"
                  required
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  helperText={newJobErrors.salaryMax ? "Valid maximum salary is required" : "Enter annual salary in INR"}
                  error={!!newJobErrors.salaryMax}
                />
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
                  freeSolo={false}
                  options={ALL_SKILLS.filter(s => !skills.includes(s))}
                  value={newSkill || null}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setNewSkill(newValue);
                      if (skillsFieldError) setSkillsFieldError(false);
                    }
                  }}
                  onInputChange={(_, newInputValue) => {
                    setNewSkill(newInputValue);
                  }}
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
                  {['Python', 'Java', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'GraphQL', 'REST API', 'CI/CD', 'Git']
                    .filter(s => !skills.includes(s))
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
                Add questions that applicants must answer when applying. No resume upload - candidates will be matched based on their profile and answers.
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
                          {q.required && (
                            <Chip label="Required" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Type: {q.type === 'yesno' ? 'Yes/No' : q.type === 'multiple' ? 'Multiple Choice' : q.type === 'number' ? 'Number' : 'Text'}
                          {q.options && ` • Options: ${q.options.join(', ')}`}
                        </Typography>
                      </Box>
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
                  Add New Question
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
                        <MenuItem value="text">Text (Open Answer)</MenuItem>
                        <MenuItem value="yesno">Yes / No</MenuItem>
                        <MenuItem value="number">Number</MenuItem>
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
                      Add Question
                    </Button>
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
              onClick={() => {
                setCreateDialogOpen(false);
                setNewJobErrors({});
                setSkillsFieldError(false);
              }}
            >
              Cancel
            </Button>
            {createTab < 2 ? (
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

      {/* Edit Job Dialog - Same structure as Create Job */}
      <Dialog open={editDialogOpen} onClose={() => { if (!editDialogLoading) setEditDialogOpen(false); }} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee' }}>
          Edit Job
        </DialogTitle>
        
        {/* Tabs */}
        <Tabs 
          value={editTab} 
          onChange={handleEditTabChange} 
          sx={{ px: 3, borderBottom: '1px solid #eee' }}
        >
          <Tab label="Job Details" />
          <Tab label="Required Skills" />
          <Tab label="Screening Questions" />
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
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      value={editingJob.title}
                      onChange={(e) => { setEditingJob({ ...editingJob, title: e.target.value }); setEditJobErrors({ ...editJobErrors, title: false }); }}
                      required
                      InputLabelProps={{ shrink: true }}
                      error={!!editJobErrors.title}
                      helperText={editJobErrors.title ? "Job Title is required" : ""}
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
                      >
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
                      >
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
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Min Salary (Annual)"
                      value={editingJob.salaryMin != null && editingJob.salaryMin !== '' ? String(editingJob.salaryMin) : ''}
                      onChange={(e) => { setEditingJob({ ...editingJob, salaryMin: e.target.value }); setEditJobErrors({ ...editJobErrors, salaryMin: false }); }}
                      placeholder="e.g., 60000"
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                      error={!!editJobErrors.salaryMin}
                      helperText={editJobErrors.salaryMin ? "Min salary is required and must be valid" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Max Salary (Annual)"
                      value={editingJob.salaryMax != null && editingJob.salaryMax !== '' ? String(editingJob.salaryMax) : ''}
                      onChange={(e) => { setEditingJob({ ...editingJob, salaryMax: e.target.value }); setEditJobErrors({ ...editJobErrors, salaryMax: false }); }}
                      placeholder="e.g., 120000"
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                      error={!!editJobErrors.salaryMax}
                      helperText={editJobErrors.salaryMax ? "Max salary is required and must be valid" : ""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Job Description"
                      value={editingJob.description || ''}
                      onChange={(e) => { setEditingJob({ ...editingJob, description: e.target.value }); setEditJobErrors({ ...editJobErrors, description: false }); }}
                      multiline
                      rows={4}
                      placeholder="Describe the role, responsibilities, and what you're looking for..."
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
                      placeholder="List key responsibilities (one per line)"
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
                      freeSolo={false}
                      options={ALL_SKILLS.filter(s => !editSkills.includes(s))}
                      value={editNewSkill || null}
                      onChange={(_, newValue) => {
                        if (newValue) {
                          setEditNewSkill(newValue);
                          if (editSkillsFieldError) setEditSkillsFieldError(false);
                        }
                      }}
                      onInputChange={(_, newInputValue) => {
                        setEditNewSkill(newInputValue);
                      }}
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
                    {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'GraphQL', 'REST API', 'Git', 'Agile', 'CI/CD']
                      .filter((skill) => !editSkills.includes(skill))
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
                    Add questions that applicants must answer when applying.
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
                              {q.required && (
                                <Chip label="Required" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Type: {q.type === 'yesno' ? 'Yes/No' : q.type === 'multiple' ? 'Multiple Choice' : q.type === 'number' ? 'Number' : 'Text'}
                              {q.options && ` • Options: ${q.options.join(', ')}`}
                            </Typography>
                          </Box>
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
                      Add New Question
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
                            <MenuItem value="text">Text (Open Answer)</MenuItem>
                            <MenuItem value="yesno">Yes / No</MenuItem>
                            <MenuItem value="number">Number</MenuItem>
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
                          Add Question
                        </Button>
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
            <Button onClick={() => { setEditDialogOpen(false); setEditJobErrors({}); setEditSkillsFieldError(false); setEditTab(0); }}>Cancel</Button>
            {editTab < 2 ? (
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
                  <TableCell sx={{ fontWeight: 600 }}>Skills</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Match Score</TableCell>
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
                    <TableCell>
                      <Typography variant="body2">{applicant.experience}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {applicant.skills.slice(0, 3).map((skill) => (
                          <Chip key={skill} label={skill} size="small" sx={{ fontSize: '0.7rem' }} />
                        ))}
                        {applicant.skills.length > 3 && (
                          <Chip label={`+${applicant.skills.length - 3}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <MatchBadge score={applicant.matchScore}>
                        {applicant.matchScore}%
                      </MatchBadge>
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
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="View Profile">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#0d47a1' }}
                            onClick={() => {
                              // Navigate to candidate profile page
                              const candidateId = applicant.applicantId || applicant.id;
                              navigate(`/techie/ats/candidate/${candidateId}`);
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={scheduledInterviewApplicationIds.has(String(applicant.id)) ? 'Reschedule' : 'Schedule Interview'}>
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
                            }}
                          >
                            <EmailIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
