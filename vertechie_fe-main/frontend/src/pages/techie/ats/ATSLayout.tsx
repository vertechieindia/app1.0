/**
 * ATSLayout - Shared Layout for ATS Pages
 * Provides consistent header, navigation, and stats across all ATS pages
 * Enhanced with job posting, screening questions, and applicant matching
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jobService, getHRUserInfo } from '../../../services/jobPortalService';
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
  Badge,
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
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const NavItem = styled(Box)<{ active?: boolean }>(({ active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 20px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: active ? 600 : 500,
  color: active ? '#0d47a1' : '#666',
  backgroundColor: active ? alpha('#0d47a1', 0.08) : 'transparent',
  borderBottom: active ? '3px solid #0d47a1' : '3px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha('#0d47a1', 0.05),
    color: '#0d47a1',
  },
}));

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
  const location = useLocation();
  
  // Dialog state
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [dialogTab, setDialogTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
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
  
  // Skills state
  const [skills, setSkills] = useState<string[]>(['JavaScript', 'React', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');
  
  // Screening Questions state
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([
    { id: '1', question: 'How many years of experience do you have in this field?', type: 'number', required: true },
    { id: '2', question: 'Are you authorized to work in the location specified?', type: 'yesno', required: true, idealAnswer: 'yes' },
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionType, setQuestionType] = useState<'text' | 'yesno' | 'multiple' | 'number'>('text');
  const [questionRequired, setQuestionRequired] = useState(true);
  const [questionOptions, setQuestionOptions] = useState<string[]>(['']);

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

  const [isPosting, setIsPosting] = useState(false);

  const handlePostJob = async () => {
    if (!newJob.title || !newJob.department) {
      setSnackbar({ open: true, message: 'Please fill in Job Title and Department', severity: 'error' });
      return;
    }
    
    if (!newJob.description) {
      setSnackbar({ open: true, message: 'Please fill in Job Description', severity: 'error' });
      return;
    }

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
      };

      // Save job using job service
      await jobService.createJob(jobFormData, userId);

      setSnackbar({ open: true, message: 'Job posted successfully! Applicants will answer screening questions.', severity: 'success' });
      setOpenJobDialog(false);
      
      // Reset form
      setNewJob({ title: '', department: '', location: '', type: '', experience: '', salaryMin: '', salaryMax: '', description: '', responsibilities: '', requirements: '' });
      setSkills(['JavaScript', 'React', 'Node.js']);
      setQuestions([
        { id: '1', question: 'How many years of experience do you have in this field?', type: 'number', required: true },
        { id: '2', question: 'Are you authorized to work in the location specified?', type: 'yesno', required: true, idealAnswer: 'yes' },
      ]);
      setDialogTab(0);

      // Trigger a refresh by reloading the page or navigating
      window.location.reload();
    } catch (error: any) {
      console.error('Error posting job:', error);
      setSnackbar({ open: true, message: error.message || 'Failed to post job. Please try again.', severity: 'error' });
    } finally {
      setIsPosting(false);
    }
  };

  const navItems = [
    { path: '/techie/ats/pipeline', label: 'Pipeline', icon: <ViewKanbanIcon /> },
    { path: '/techie/ats/jobpostings', label: 'Job Postings', icon: <WorkIcon /> },
    { path: '/techie/ats/allcandidates', label: 'All Candidates', icon: <PeopleIcon /> },
    { path: '/techie/ats/interviews', label: 'Interviews', icon: <EventIcon /> },
    { path: '/techie/ats/scheduling', label: 'Scheduling', icon: <ScheduleIcon /> },
    { path: '/techie/ats/calendar', label: 'Calendar', icon: <CalendarMonthIcon /> },
    { path: '/techie/ats/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
  ];

  const stats = [
    { value: 5, label: 'Active Jobs', color: '#0d47a1' },
    { value: 247, label: 'Candidates', color: '#34C759' },
    { value: 42, label: 'New This Week', color: '#5856D6', badge: '+42' },
    { value: 12, label: 'Interviews', color: '#FF9500' },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />}>Sync Data</Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            sx={{ bgcolor: '#0d47a1' }}
            onClick={() => setOpenJobDialog(true)}
          >
            Post New Job
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={6} md={3} key={idx}>
            <StatCard>
              <Badge badgeContent={stat.badge} color="success" sx={{ width: '100%' }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="h3" fontWeight={700} color={stat.color}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                </Box>
              </Badge>
            </StatCard>
          </Grid>
        ))}
      </Grid>

      {/* Secondary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <StatCard>
            <Typography variant="h4" fontWeight={700} color="#34C759">3</Typography>
            <Typography variant="body2" color="text.secondary">Offers Extended</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={4}>
          <StatCard>
            <Typography variant="h4" fontWeight={700} color="#FF9500">18d</Typography>
            <Typography variant="body2" color="text.secondary">Avg Time to Hire</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={4}>
          <StatCard>
            <Typography variant="h4" fontWeight={700} color="#5856D6">12.4%</Typography>
            <Typography variant="body2" color="text.secondary">Conversion Rate</Typography>
          </StatCard>
        </Grid>
      </Grid>

      {/* Navigation */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', overflowX: 'auto', p: 1 }}>
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              active={isActive(item.path)}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <Typography variant="body2" fontWeight="inherit">{item.label}</Typography>
            </NavItem>
          ))}
        </Box>
      </Paper>

      {/* Page Content */}
      <Paper sx={{ p: 3, borderRadius: 2, minHeight: 400 }}>
        {children}
      </Paper>

      {/* Enhanced Post New Job Dialog */}
      <Dialog open={openJobDialog} onClose={() => setOpenJobDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee', pb: 0 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Post New Job</Typography>
          <Tabs value={dialogTab} onChange={(_, v) => setDialogTab(v)} sx={{ minHeight: 40 }}>
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
                  label="Minimum Salary"
                  value={newJob.salaryMin}
                  onChange={(e) => setNewJob({ ...newJob, salaryMin: e.target.value })}
                  placeholder="e.g., 80000"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Salary"
                  value={newJob.salaryMax}
                  onChange={(e) => setNewJob({ ...newJob, salaryMax: e.target.value })}
                  placeholder="e.g., 120000"
                  type="number"
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
            <Button onClick={() => setOpenJobDialog(false)}>Cancel</Button>
            {dialogTab < 2 ? (
              <Button variant="contained" onClick={() => setDialogTab(dialogTab + 1)} sx={{ bgcolor: '#0d47a1' }}>
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
