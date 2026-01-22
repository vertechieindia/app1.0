/**
 * JobPostingsPage - Manage Job Listings
 * Enhanced with Create, Filter, Edit, and View Applicants functionality
 * Integrated with Backend API
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService, applicationService, userService, getHRUserInfo, Candidate } from '../../../services/jobPortalService';
import { Job, Application } from '../../../types/jobPortal';
import {
  Box, Typography, Card, CardContent, Chip, IconButton, TextField, Button,
  Grid, InputAdornment, Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Menu, Checkbox, FormControlLabel,
  FormGroup, Divider, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, LinearProgress, Snackbar, Alert, Tabs, Tab, Switch, Tooltip, List,
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
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
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
  description?: string;
  responsibilities?: string;
  skills?: string[];
  screeningQuestions?: Array<{ id: string; question: string; type?: string; options?: string[] }>;
  salaryMin?: number;  // Raw salary value for edit form
  salaryMax?: number;  // Raw salary value for edit form
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
  const [jobs, setJobs] = useState<DisplayJob[]>([]);
  const [applicants, setApplicants] = useState<DisplayApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
        const displayJobs: DisplayJob[] = apiJobs.map((job) => ({
          id: job.id,
          title: job.title,
          department: job.requiredSkills?.length > 0 ? 'Engineering' : 'General',
          location: job.location || 'Remote',
          type: job.jobType === 'full-time' ? 'Full-time' : job.jobType || 'Full-time',
          // Show real salary in Indian Rupees (₹) format
          salary: job.salary_min && job.salary_max 
            ? `₹${(job.salary_min / 100000).toFixed(1)}L - ₹${(job.salary_max / 100000).toFixed(1)}L` 
            : job.salary_min 
              ? `From ₹${(job.salary_min / 100000).toFixed(1)}L`
              : job.salary_max
                ? `Up to ₹${(job.salary_max / 100000).toFixed(1)}L`
                : 'Not specified',
          applicants: job.applicantCount || 0,
          newApplicants: 0, // Will be calculated when viewing applicants
          views: job.views_count || 0, // Real count, no dummy random values
          status: job.status || 'active',
          posted: formatTimeAgo(job.createdAt),
          // Store additional job data for edit dialog
          description: job.description,
          experienceLevel: job.experienceLevel,
          requiredSkills: job.requiredSkills,
          screeningQuestions: job.screeningQuestions,
          responsibilities: job.responsibilities,
          // Store raw salary values for edit form
          salaryMin: job.salary_min,
          salaryMax: job.salary_max,
        }));
        
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
  const [newJob, setNewJob] = useState({
    title: '', department: '', location: '', type: '', experience: '', 
    salaryMin: '', salaryMax: '', description: '', responsibilities: '',
  });
  
  // Skills state for create dialog
  const [skills, setSkills] = useState<string[]>(['JavaScript', 'React', 'Node.js']);
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

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
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
    active: true, draft: true, engineering: true, product: true, design: true, remote: true, onsite: true,
  });
  
  // Edit Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
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
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });
  
  // More Menu
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);
  const [moreJobId, setMoreJobId] = useState<string | null>(null);

  // Create Job - Uses Backend API
  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.department) {
      setSnackbar({ open: true, message: 'Please fill in Job Title and Department', severity: 'error' });
      setCreateTab(0);
      return;
    }
    
    if (!newJob.description) {
      setSnackbar({ open: true, message: 'Please fill in Job Description', severity: 'error' });
      setCreateTab(0);
      return;
    }

    setIsPosting(true);
    
    try {
      const hrUser = getHRUserInfo();
      const userId = hrUser?.id || localStorage.getItem('userId') || 'ats-user';
      const companyName = hrUser?.companyName || localStorage.getItem('current_company') || 'Company';
      
      // Map experience level to expected format
      const experienceLevelMap: Record<string, 'entry' | 'mid' | 'senior' | 'lead'> = {
        'entry': 'entry',
        'mid': 'mid',
        'senior': 'senior',
        'lead': 'lead',
        'executive': 'lead',
      };

      // Map job type to expected format
      const jobTypeMap: Record<string, 'full-time' | 'internship' | 'part-time' | 'contract'> = {
        'fulltime': 'full-time',
        'parttime': 'part-time',
        'contract': 'contract',
        'internship': 'internship',
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
        // Include salary values if provided
        salaryMin: newJob.salaryMin ? parseInt(newJob.salaryMin) : undefined,
        salaryMax: newJob.salaryMax ? parseInt(newJob.salaryMax) : undefined,
      }, userId);
      
      // Format salary display in Indian Rupees (₹) - show real values or "Not specified"
      const salaryDisplay = newJob.salaryMin && newJob.salaryMax 
        ? `₹${(parseInt(newJob.salaryMin) / 100000).toFixed(1)}L - ₹${(parseInt(newJob.salaryMax) / 100000).toFixed(1)}L`
        : newJob.salaryMin 
          ? `From ₹${(parseInt(newJob.salaryMin) / 100000).toFixed(1)}L`
          : newJob.salaryMax
            ? `Up to ₹${(parseInt(newJob.salaryMax) / 100000).toFixed(1)}L`
            : 'Not specified';

      // Map department for display
      const departmentDisplay = newJob.department.charAt(0).toUpperCase() + newJob.department.slice(1);
      
      // Add to local state
      const displayJob: DisplayJob = {
        id: createdJob.id,
        title: createdJob.title,
        department: departmentDisplay,
        location: createdJob.location || 'Remote',
        type: newJob.type === 'fulltime' ? 'Full-time' : 
              newJob.type === 'parttime' ? 'Part-time' :
              newJob.type === 'contract' ? 'Contract' :
              newJob.type === 'internship' ? 'Internship' : 'Full-time',
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
      setSkills(['JavaScript', 'React', 'Node.js']);
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
      // Map job type
      const jobTypeMap: Record<string, 'full-time' | 'part-time' | 'contract' | 'internship'> = {
        'Full-time': 'full-time',
        'Part-time': 'part-time',
        'Contract': 'contract',
        'Internship': 'internship',
      };
      
      // Map experience level
      const expMap: Record<string, 'entry' | 'mid' | 'senior' | 'lead'> = {
        'Entry Level': 'entry',
        'Mid Level': 'mid',
        'Senior Level': 'senior',
        'Lead/Principal': 'lead',
      };
      
      // Update via API
      await jobService.updateJob(editingJob.id, {
        title: editingJob.title,
        description: editingJob.description || '',
        location: editingJob.location,
        jobType: jobTypeMap[editingJob.type] || 'full-time',
        companyName: getHRUserInfo()?.companyName || 'Company',
        requiredSkills: editSkills,
        experienceLevel: expMap[editingJob.experience] || 'mid',
        codingQuestions: editQuestions.map(q => ({
          id: q.id,
          question: q.question,
          description: q.question,
          difficulty: 'medium' as const,
          expectedOutput: q.type === 'yesno' ? 'Yes/No' : q.type === 'multiple' ? q.options?.join(',') || '' : '',
        })),
      } as any);
      
      // Update local state with full job data
      const updatedJob = {
        ...editingJob,
        skills: editSkills,
        screeningQuestions: editQuestions,
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

  const openEditDialog = (job: DisplayJob) => {
    setEditingJob({ 
      ...job,
      experience: (job as any).experience || 'Mid Level',
      description: (job as any).description || '',
      responsibilities: (job as any).responsibilities || '',
    } as any);
    setEditSkills((job as any).skills || []);
    setEditQuestions(((job as any).screeningQuestions || []).map((q: any) => ({
      ...q,
      type: q.type || 'text',
      required: q.required !== undefined ? q.required : true,
    })));
    setEditTab(0);
    setEditNewSkill('');
    setEditNewQuestion('');
    setEditQuestionType('text');
    setEditQuestionRequired(true);
    setEditQuestionOptions(['']);
    setEditDialogOpen(true);
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
    switch (status) {
      case 'new': return '#0d47a1';
      case 'reviewed': return '#FF9500';
      case 'interviewed': return '#5856D6';
      case 'rejected': return '#FF3B30';
      case 'hired': return '#34C759';
      default: return '#8E8E93';
    }
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

  const filteredApplicants = applicants.filter(a => {
    if (applicantTab === 0) return true;
    if (applicantTab === 1) return a.status === 'new';
    if (applicantTab === 2) return a.status === 'reviewed';
    if (applicantTab === 3) return a.status === 'interviewed';
    return true;
  }).sort((a, b) => b.matchScore - a.matchScore);

  const filteredJobs = jobs.filter(job => {
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (!filters.active && job.status === 'active') return false;
    if (!filters.draft && job.status === 'draft') return false;
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
                        label={job.status === 'active' ? 'ACTIVE' : 'DRAFT'}
                        size="small"
                        sx={{
                          bgcolor: job.status === 'active' ? alpha('#34C759', 0.1) : alpha('#8E8E93', 0.1),
                          color: job.status === 'active' ? '#34C759' : '#8E8E93',
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
        </FormGroup>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, mt: 1 }}>Department</Typography>
        <FormGroup>
          <FormControlLabel 
            control={<Checkbox checked={filters.engineering} onChange={(e) => setFilters({ ...filters, engineering: e.target.checked })} />} 
            label="Engineering" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.product} onChange={(e) => setFilters({ ...filters, product: e.target.checked })} />} 
            label="Product" 
          />
          <FormControlLabel 
            control={<Checkbox checked={filters.design} onChange={(e) => setFilters({ ...filters, design: e.target.checked })} />} 
            label="Design" 
          />
        </FormGroup>
        <Divider sx={{ my: 1 }} />
        <Button fullWidth variant="outlined" size="small" onClick={() => setFilterAnchor(null)}>
          Apply Filters
        </Button>
      </Menu>

      {/* Create Job Dialog - Enhanced with Tabs */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee', pb: 0 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Post New Job</Typography>
          <Tabs value={createTab} onChange={(_, v) => setCreateTab(v)} sx={{ minHeight: 40 }}>
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
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="e.g., Senior Software Engineer"
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel shrink>Department</InputLabel>
                  <Select
                    value={newJob.department}
                    label="Department"
                    onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
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
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  placeholder="e.g., New York, NY or Remote"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel shrink>Employment Type</InputLabel>
                  <Select
                    value={newJob.type}
                    label="Employment Type"
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Select Type</MenuItem>
                    <MenuItem value="fulltime">Full-time</MenuItem>
                    <MenuItem value="parttime">Part-time</MenuItem>
                    <MenuItem value="contract">Contract</MenuItem>
                    <MenuItem value="internship">Internship</MenuItem>
                    <MenuItem value="freelance">Freelance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel shrink>Experience Level</InputLabel>
                  <Select
                    value={newJob.experience}
                    label="Experience Level"
                    onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Select Level</MenuItem>
                    <MenuItem value="entry">Entry Level (0-2 years)</MenuItem>
                    <MenuItem value="mid">Mid Level (2-5 years)</MenuItem>
                    <MenuItem value="senior">Senior Level (5-8 years)</MenuItem>
                    <MenuItem value="lead">Lead/Principal (8+ years)</MenuItem>
                    <MenuItem value="executive">Executive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Salary (Annual)"
                  value={newJob.salaryMin}
                  onChange={(e) => setNewJob({ ...newJob, salaryMin: e.target.value })}
                  placeholder="e.g., 600000"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  helperText="Enter annual salary in INR"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Salary (Annual)"
                  value={newJob.salaryMax}
                  onChange={(e) => setNewJob({ ...newJob, salaryMax: e.target.value })}
                  placeholder="e.g., 1200000"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  helperText="Enter annual salary in INR"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Job Description"
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Describe the role and what the candidate will be doing..."
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Key Responsibilities"
                  value={newJob.responsibilities}
                  onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value })}
                  placeholder="List the main responsibilities (one per line)..."
                  InputLabelProps={{ shrink: true }}
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
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a skill and press Enter or click Add..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
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
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            {createTab < 2 ? (
              <Button variant="contained" onClick={() => setCreateTab(createTab + 1)} sx={{ bgcolor: '#0d47a1' }}>
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
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee' }}>
          Edit Job
        </DialogTitle>
        
        {/* Tabs */}
        <Tabs 
          value={editTab} 
          onChange={(_, v) => setEditTab(v)} 
          sx={{ px: 3, borderBottom: '1px solid #eee' }}
        >
          <Tab label="Job Details" />
          <Tab label="Required Skills" />
          <Tab label="Screening Questions" />
        </Tabs>
        
        <DialogContent sx={{ pt: 3, minHeight: 400 }}>
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
                      onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel shrink>Department</InputLabel>
                      <Select
                        value={editingJob.department}
                        label="Department"
                        onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                      >
                        <MenuItem value="Engineering">Engineering</MenuItem>
                        <MenuItem value="Product">Product</MenuItem>
                        <MenuItem value="Design">Design</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                        <MenuItem value="Sales">Sales</MenuItem>
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="Finance">Finance</MenuItem>
                        <MenuItem value="Operations">Operations</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={editingJob.location}
                      onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                      placeholder="e.g., Remote, New York, NY"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel shrink>Employment Type</InputLabel>
                      <Select
                        value={editingJob.type}
                        label="Employment Type"
                        onChange={(e) => setEditingJob({ ...editingJob, type: e.target.value })}
                      >
                        <MenuItem value="Full-time">Full-time</MenuItem>
                        <MenuItem value="Part-time">Part-time</MenuItem>
                        <MenuItem value="Contract">Contract</MenuItem>
                        <MenuItem value="Internship">Internship</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel shrink>Experience Level</InputLabel>
                      <Select
                        value={editingJob.experience || 'Mid Level'}
                        label="Experience Level"
                        onChange={(e) => setEditingJob({ ...editingJob, experience: e.target.value })}
                      >
                        <MenuItem value="Entry Level">Entry Level</MenuItem>
                        <MenuItem value="Mid Level">Mid Level</MenuItem>
                        <MenuItem value="Senior Level">Senior Level</MenuItem>
                        <MenuItem value="Lead/Principal">Lead/Principal</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Min Salary (Annual)"
                      value={editingJob.salaryMin || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, salaryMin: e.target.value })}
                      placeholder="e.g., 600000"
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Max Salary (Annual)"
                      value={editingJob.salaryMax || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, salaryMax: e.target.value })}
                      placeholder="e.g., 1200000"
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Job Description"
                      value={editingJob.description || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                      multiline
                      rows={4}
                      placeholder="Describe the role, responsibilities, and what you're looking for..."
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Key Responsibilities"
                      value={editingJob.responsibilities || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, responsibilities: e.target.value })}
                      multiline
                      rows={3}
                      placeholder="List key responsibilities (one per line)"
                      InputLabelProps={{ shrink: true }}
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
                          sx={{ bgcolor: '#e3f2fd', color: '#0d47a1' }}
                        />
                      ))
                    )}
                  </Box>
                  
                  {/* Add skill input */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Add a skill"
                      value={editNewSkill}
                      onChange={(e) => setEditNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddEditSkill()}
                      placeholder="e.g., React, Python, AWS..."
                      InputLabelProps={{ shrink: true }}
                    />
                    <Button 
                      variant="contained" 
                      onClick={handleAddEditSkill}
                      disabled={!editNewSkill.trim()}
                      sx={{ bgcolor: '#0d47a1' }}
                    >
                      Add
                    </Button>
                  </Box>
                  
                  {/* Suggested skills */}
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    Suggested Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'GraphQL', 'REST API', 'Git', 'Agile', 'CI/CD'].map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        variant="outlined"
                        onClick={() => !editSkills.includes(skill) && setEditSkills([...editSkills, skill])}
                        sx={{ 
                          cursor: 'pointer',
                          opacity: editSkills.includes(skill) ? 0.5 : 1,
                          '&:hover': { bgcolor: '#e3f2fd' }
                        }}
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
            <Button onClick={() => { setEditDialogOpen(false); setEditTab(0); }}>Cancel</Button>
            {editTab < 2 ? (
              <Button variant="contained" onClick={() => setEditTab(editTab + 1)} sx={{ bgcolor: '#0d47a1' }}>
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
            <Typography variant="h6" fontWeight={700}>
              Applicants for {selectedJob?.title}
            </Typography>
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
            <Tab label={`New (${applicants.filter(a => a.status === 'new').length})`} />
            <Tab label={`Reviewed (${applicants.filter(a => a.status === 'reviewed').length})`} />
            <Tab label={`Interviewed (${applicants.filter(a => a.status === 'interviewed').length})`} />
          </Tabs>
          
          {applicants.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No applicants yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                No one has applied to this job yet. Browse existing candidates in the system to find potential matches.
              </Typography>
              <Button 
                variant="contained" 
                onClick={loadAllCandidates}
                sx={{ bgcolor: '#0d47a1' }}
              >
                Browse All Candidates
              </Button>
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
                        label={applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
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
                        <Tooltip title="Schedule Interview">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#5856D6' }}
                            onClick={() => {
                              // Navigate to schedule interview page with candidate and job info
                              // applicant.id = application ID, applicant.applicantId = user ID
                              const candidateId = applicant.applicantId || applicant.id;
                              const applicationId = applicant.id; // This is the JobApplication ID
                              const params = new URLSearchParams({
                                applicationId: applicationId,
                                candidateId: candidateId,
                                candidateName: applicant.name,
                                candidateEmail: applicant.email || '',
                                jobId: selectedJob?.id || '',
                                jobTitle: selectedJob?.title || '',
                              });
                              navigate(`/techie/schedule-interview?${params.toString()}`);
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
