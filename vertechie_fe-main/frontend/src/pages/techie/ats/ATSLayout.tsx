/**
 * ATSLayout - Shared Layout for ATS Pages
 * Provides consistent page header and stats; section tabs live in AppHeader (see atsNavConfig).
 * Enhanced with job posting, screening questions, and applicant matching
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService, jobService, getHRUserInfo } from '../../../services/jobPortalService';
import { interviewService } from '../../../services/interviewService';
import { JobFormData, CodingQuestion } from '../../../types/jobPortal';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  IconButton,
  Grid,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Switch,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fetchJobTitleSuggestions } from '../../../utils/jobTitleSuggestions';
import { fetchSkillSuggestions, SUGGESTED_SKILL_CHIPS } from '../../../utils/skillSuggestions';

const StatCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  border: '1px solid rgba(13, 71, 161, 0.1)',
  boxShadow: 'none',
}));

interface ScreeningQuestion {
  id: string;
  question: string;
  type: 'text' | 'yesno' | 'multiple' | 'number';
  required: boolean;
  options?: string[];
  idealAnswer?: string;
}

interface ATSLayoutProps {
  children: React.ReactNode;
}

const ATSLayout: React.FC<ATSLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  // Dialog state
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [dialogTab, setDialogTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [atsStats, setAtsStats] = useState({
    activeJobs: 0,
    candidates: 0,
    newThisWeek: 0,
    interviews: 0,
    offersExtended: 0,
  });
  
  // Job form state
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    type: '',
    experience: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    responsibilities: '',
    requirements: '',
  });
  const [jobFieldErrors, setJobFieldErrors] = useState<Record<string, string>>({});
  const [atsJobTitleOptions, setAtsJobTitleOptions] = useState<string[]>([]);
  const atsJobTitleDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Skills state
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [skillsError, setSkillsError] = useState('');
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const skillSearchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Screening Questions state
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([
    { id: '1', question: 'How many years of experience do you have in this field?', type: 'number', required: true },
    { id: '2', question: 'Are you authorized to work in the location specified?', type: 'yesno', required: true, idealAnswer: 'yes' },
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionType, setQuestionType] = useState<'text' | 'yesno' | 'multiple' | 'number'>('text');
  const [questionRequired, setQuestionRequired] = useState(true);
  const [questionOptions, setQuestionOptions] = useState<string[]>(['']);

  const handleJobFieldChange = (field: keyof typeof newJob, value: string) => {
    setNewJob((prev) => ({ ...prev, [field]: value }));
    if (jobFieldErrors[field]) {
      setJobFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const onAtsJobTitleInputChange = (_: unknown, newInputValue: string) => {
    handleJobFieldChange('title', newInputValue);
    if (atsJobTitleDebounceRef.current) clearTimeout(atsJobTitleDebounceRef.current);
    atsJobTitleDebounceRef.current = setTimeout(async () => {
      if (!newInputValue || newInputValue.trim().length < 2) {
        setAtsJobTitleOptions([]);
        return;
      }
      setAtsJobTitleOptions(await fetchJobTitleSuggestions(newInputValue));
    }, 300);
  };

  const onSkillInputChange = (_: unknown, newInputValue: string) => {
    setNewSkill(newInputValue);
    if (skillsError) setSkillsError('');
    if (skillSearchDebounceRef.current) clearTimeout(skillSearchDebounceRef.current);
    skillSearchDebounceRef.current = setTimeout(async () => {
      if (!newInputValue || newInputValue.trim().length < 1) {
        setSkillOptions([]);
        return;
      }
      setSkillOptions(await fetchSkillSuggestions(newInputValue));
    }, 300);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
      setSkillsError('');
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

  const [isPosting, setIsPosting] = useState(false);

  const loadAtsStats = async () => {
    try {
      const hrUser = getHRUserInfo();
      const hrId = hrUser?.id || localStorage.getItem('userId') || '';
      if (!hrId) {
        setAtsStats({
          activeJobs: 0,
          candidates: 0,
          newThisWeek: 0,
          interviews: 0,
          offersExtended: 0,
        });
        return;
      }

      const jobs = await jobService.getJobsByHR(hrId);
      const activeJobs = (jobs || []).filter((job) => String(job.status).toLowerCase() === 'active').length;

      const appsByJob = await Promise.allSettled(
        (jobs || []).map((job) => applicationService.getApplicationsByJob(job.id))
      );

      let candidates = 0;
      let newThisWeek = 0;
      let bgcAdminCount = 0;
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

      appsByJob.forEach((result) => {
        if (result.status !== 'fulfilled' || !Array.isArray(result.value)) return;
        candidates += result.value.length;
        result.value.forEach((app) => {
          const ts = new Date(app.appliedAt || '').getTime();
          if (Number.isFinite(ts) && ts >= weekAgo) {
            newThisWeek += 1;
          }
          const status = String(app.status || '').toLowerCase();
          if (status === 'offered' || status === 'offer') {
            bgcAdminCount += 1;
          }
        });
      });

      if (candidates === 0) {
        candidates = (jobs || []).reduce((sum, job) => sum + Number(job.applicantCount || 0), 0);
      }

      let interviews = 0;
      try {
        const interviewList = await interviewService.getMyInterviewsAsInterviewer(false);
        interviews = Array.isArray(interviewList) ? interviewList.length : 0;
      } catch {
        interviews = 0;
      }

      setAtsStats({
        activeJobs,
        candidates,
        newThisWeek,
        interviews,
        offersExtended: bgcAdminCount,
      });
    } catch (err) {
      console.error('Failed to load ATS stats:', err);
      setAtsStats({
        activeJobs: 0,
        candidates: 0,
        newThisWeek: 0,
        interviews: 0,
        offersExtended: 0,
      });
    }
  };

  useEffect(() => {
    loadAtsStats();
  }, []);

  const validateJobDetailsStep = (): boolean => {
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

    const errors: Record<string, string> = {};
    for (const field of requiredFields) {
      const value = (newJob[field.key] || '').toString().trim();
      if (!value) {
        errors[field.key] = `${field.label} is required`;
      }
    }

    const minSalaryRaw = newJob.salaryMin.toString().trim();
    const maxSalaryRaw = newJob.salaryMax.toString().trim();
    if (minSalaryRaw && maxSalaryRaw) {
      const minSalary = Number(minSalaryRaw);
      const maxSalary = Number(maxSalaryRaw);
      if (!Number.isFinite(minSalary) || !Number.isFinite(maxSalary) || minSalary <= 0 || maxSalary <= 0) {
        errors.salaryMin = 'Enter valid salary';
        errors.salaryMax = 'Enter valid salary';
      } else if (minSalary > maxSalary) {
        errors.salaryMin = 'Min salary must be <= max salary';
        errors.salaryMax = 'Max salary must be >= min salary';
      }
    }

    setJobFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSnackbar({ open: true, message: Object.values(errors)[0], severity: 'error' });
      setDialogTab(0);
      return false;
    }

    return true;
  };

  const validateSkillsStep = (): boolean => {
    if (skills.length < 2) {
      setSkillsError('Please add at least 2 required skills');
      setSnackbar({ open: true, message: 'Please add at least 2 required skills', severity: 'error' });
      setDialogTab(1);
      return false;
    }
    setSkillsError('');
    return true;
  };

  const handleDialogTabChange = (_: React.SyntheticEvent, nextTab: number) => {
    if (nextTab <= dialogTab) {
      setDialogTab(nextTab);
      return;
    }
    if (dialogTab === 0 && !validateJobDetailsStep()) return;
    if (dialogTab === 1 && !validateSkillsStep()) return;
    setDialogTab(nextTab);
  };

  const handleNextTab = () => {
    if (dialogTab === 0 && !validateJobDetailsStep()) return;
    if (dialogTab === 1 && !validateSkillsStep()) return;
    setDialogTab((prev) => Math.min(prev + 1, 2));
  };

  const handlePostJob = async () => {
    if (!validateJobDetailsStep()) return;
    if (!validateSkillsStep()) return;

    setIsPosting(true);

    try {
      // Get HR user info from localStorage
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

      // Convert screening questions to coding questions format (for compatibility)
      const codingQuestions: CodingQuestion[] = questions.map((q, index) => ({
        id: q.id,
        question: q.question,
        description: `Type: ${q.type}${q.options ? ` | Options: ${q.options.join(', ')}` : ''}${q.required ? ' (Required)' : ''}`,
        difficulty: 'easy' as const,
      }));

      // Create job form data
      const jobFormData: JobFormData = {
        title: newJob.title,
        companyName: companyName,
        description: `${newJob.description}\n\nResponsibilities:\n${newJob.responsibilities}\n\nRequirements:\n${newJob.requirements}`,
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
      };

      // Save job using job service
      await jobService.createJob(jobFormData, userId);

      setSnackbar({ open: true, message: 'Job posted successfully! Applicants will answer screening questions.', severity: 'success' });
      setOpenJobDialog(false);
      setJobFieldErrors({});
      setSkillsError('');
      
      // Reset form
      setNewJob({ title: '', department: '', location: '', type: '', experience: '', salaryMin: '', salaryMax: '', description: '', responsibilities: '', requirements: '' });
      setAtsJobTitleOptions([]);
      setSkills(['JavaScript', 'React', 'Node.js']);
      setQuestions([
        { id: '1', question: 'How many years of experience do you have in this field?', type: 'number', required: true },
        { id: '2', question: 'Are you authorized to work in the location specified?', type: 'yesno', required: true, idealAnswer: 'yes' },
      ]);
      setDialogTab(0);

      // Refresh ATS metrics after successful job creation
      loadAtsStats();
    } catch (error: any) {
      console.error('Error posting job:', error);
      setSnackbar({ open: true, message: error.message || 'Failed to post job. Please try again.', severity: 'error' });
    } finally {
      setIsPosting(false);
    }
  };

  const stats = [
    { value: atsStats.activeJobs, label: 'Active Jobs', color: '#0d47a1' },
    { value: atsStats.candidates, label: 'Candidates', color: '#34C759' },
    { value: atsStats.newThisWeek, label: 'New This Week', color: '#5856D6' },
    { value: atsStats.interviews, label: 'Interviews', color: '#FF9500' },
    { value: atsStats.offersExtended, label: 'BGC Admin', color: '#5E35B1' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => navigate('/techie/home')}
            sx={{ bgcolor: alpha('#0d47a1', 0.1), '&:hover': { bgcolor: alpha('#0d47a1', 0.2) } }}
          >
            <ArrowBackIcon sx={{ color: '#0d47a1' }} />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={700} color="#1a237e">
              Applicant Tracking System
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your job postings and track candidates through the hiring pipeline
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#0d47a1', textTransform: 'none', fontWeight: 600 }}
          onClick={() => navigate('/techie/ats/jobpostings?openCreate=1')}
        >
          Create New Job Post
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} columns={{ xs: 5, sm: 10, md: 10 }} sx={{ mb: 3 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={2} sm={2} md={2} key={idx}>
            <StatCard>
              <Box sx={{ width: '100%' }}>
                <Typography variant="h3" fontWeight={700} color={stat.color}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              </Box>
            </StatCard>
          </Grid>
        ))}
      </Grid>

      {/* Secondary Stats */}
      {/* <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <StatCard>
            <Typography variant="h4" fontWeight={700} color="#34C759">{atsStats.offersExtended}</Typography>
            <Typography variant="body2" color="text.secondary">Offers Extended</Typography>
          </StatCard>
        </Grid>
      </Grid> */}

      {/* Page Content */}
      <Paper sx={{ p: 3, borderRadius: 2, minHeight: 400 }}>
        {children}
      </Paper>

      {/* Enhanced Post New Job Dialog */}
      <Dialog
        open={openJobDialog}
        onClose={() => {
          setOpenJobDialog(false);
          setJobFieldErrors({});
          setSkillsError('');
          setAtsJobTitleOptions([]);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee', pb: 0 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Post New Job</Typography>
          <Tabs value={dialogTab} onChange={handleDialogTabChange} sx={{ minHeight: 40 }}>
            <Tab label="Job Details" sx={{ minHeight: 40, textTransform: 'none' }} />
            <Tab label="Required Skills" sx={{ minHeight: 40, textTransform: 'none' }} />
            <Tab label="Screening Questions" sx={{ minHeight: 40, textTransform: 'none' }} />
          </Tabs>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, minHeight: 400 }}>
          {/* Tab 1: Job Details */}
          {dialogTab === 0 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Autocomplete
                  freeSolo
                  options={atsJobTitleOptions}
                  value={newJob.title}
                  onChange={(_, newValue) => handleJobFieldChange('title', (newValue as string) || '')}
                  onInputChange={onAtsJobTitleInputChange}
                  filterOptions={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Job Title"
                      placeholder="e.g., Senior Software Engineer"
                      required
                      variant="outlined"
                      error={Boolean(jobFieldErrors.title)}
                      helperText={jobFieldErrors.title || ' '}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={Boolean(jobFieldErrors.department)}>
                  <InputLabel shrink>Department</InputLabel>
                  <Select
                    value={newJob.department}
                    label="Department"
                    onChange={(e) => handleJobFieldChange('department', e.target.value)}
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
                  onChange={(e) => handleJobFieldChange('location', e.target.value)}
                  placeholder="e.g., New York, NY or Remote"
                  error={Boolean(jobFieldErrors.location)}
                  helperText={jobFieldErrors.location || ' '}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={Boolean(jobFieldErrors.type)}>
                  <InputLabel shrink>Employment Type</InputLabel>
                  <Select
                    value={newJob.type}
                    label="Employment Type"
                    onChange={(e) => handleJobFieldChange('type', e.target.value)}
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
                <FormControl fullWidth error={Boolean(jobFieldErrors.experience)}>
                  <InputLabel shrink>Experience Level</InputLabel>
                  <Select
                    value={newJob.experience}
                    label="Experience Level"
                    onChange={(e) => handleJobFieldChange('experience', e.target.value)}
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
                  label="Minimum Salary"
                  value={newJob.salaryMin}
                  onChange={(e) => handleJobFieldChange('salaryMin', e.target.value)}
                  placeholder="e.g., 80000"
                  type="number"
                  error={Boolean(jobFieldErrors.salaryMin)}
                  helperText={jobFieldErrors.salaryMin || ' '}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Salary"
                  value={newJob.salaryMax}
                  onChange={(e) => handleJobFieldChange('salaryMax', e.target.value)}
                  placeholder="e.g., 120000"
                  type="number"
                  error={Boolean(jobFieldErrors.salaryMax)}
                  helperText={jobFieldErrors.salaryMax || ' '}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Job Description"
                  value={newJob.description}
                  onChange={(e) => handleJobFieldChange('description', e.target.value)}
                  placeholder="Describe the role and what the candidate will be doing..."
                  error={Boolean(jobFieldErrors.description)}
                  helperText={jobFieldErrors.description || ' '}
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
                  onChange={(e) => handleJobFieldChange('responsibilities', e.target.value)}
                  placeholder="List the main responsibilities (one per line)..."
                  error={Boolean(jobFieldErrors.responsibilities)}
                  helperText={jobFieldErrors.responsibilities || ' '}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          )}

          {/* Tab 2: Required Skills */}
          {dialogTab === 1 && (
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
                  fullWidth
                  size="small"
                  options={skillOptions.filter((s) => !skills.includes(s))}
                  value={newSkill || null}
                  onChange={(_, newValue) => {
                    if (newValue) setNewSkill(newValue);
                  }}
                  onInputChange={onSkillInputChange}
                  filterOptions={(options) => options}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type a skill and press Enter or click Add..."
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                      error={Boolean(skillsError)}
                      helperText={skillsError || ' '}
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
          {dialogTab === 2 && (
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
            {dialogTab > 0 && (
              <Button onClick={() => setDialogTab(dialogTab - 1)}>
                Previous
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={() => {
                setOpenJobDialog(false);
                setJobFieldErrors({});
                setSkillsError('');
              }}
            >
              Cancel
            </Button>
            {dialogTab < 2 ? (
              <Button variant="contained" onClick={handleNextTab} sx={{ bgcolor: '#0d47a1' }}>
                Next
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={handlePostJob} 
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
    </Container>
  );
};

export default ATSLayout;
