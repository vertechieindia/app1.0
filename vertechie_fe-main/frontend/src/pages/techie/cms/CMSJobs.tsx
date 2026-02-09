/**
 * CMSJobs - Company Jobs Management
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Chip,
  Avatar,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tooltip,
  Divider,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CodeIcon from '@mui/icons-material/Code';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CMSLayout from './CMSLayout';
import { api } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { DUMMY_JOBS } from './CMSDummyData';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
  warning: '#FF9500',
};

const CMSJobs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [viewingJob, setViewingJob] = useState<any>(null);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ active: 0, total: 0, applicants: 0 });
  const [skillInput, setSkillInput] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Job form state
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    job_type: 'full_time',
    location: '',
    description: '',
    salary_min: '',
    salary_max: '',
    experience_level: 'mid',
    skills_required: [] as string[],
    coding_questions: [] as any[],
    screening_questions: [] as any[],
    status: 'published'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      // Try getting user first to find their company
      const me = await api.get<any>(API_ENDPOINTS.AUTH.ME);
      let myCompany = null;
      if (me?.id) {
        const result = await api.get<any>(API_ENDPOINTS.COMPANY, { params: { user_id: me.id } });
        if (Array.isArray(result) && result.length > 0) myCompany = result[0];
        else if (result?.id) myCompany = result;
      }

      // Fallback
      if (!myCompany) {
        try {
          myCompany = await api.get<any>(API_ENDPOINTS.CMS.MY_COMPANY);
        } catch (e) { }
      }

      if (myCompany?.id) {
        setCompanyId(myCompany.id);
        setCompanyName(myCompany.name || '');
        const jobsData = await api.get<any[]>(API_ENDPOINTS.CMS.JOBS(myCompany.id));
        setJobs(jobsData || []);

        // Calculate stats
        const activeCount = jobsData?.filter((j: any) => j.status === 'published' || j.status === 'active').length || 0;
        const totalApps = jobsData?.reduce((acc: number, curr: any) => acc + (curr.applications_count || 0), 0) || 0;

        setStats({
          active: activeCount,
          total: jobsData?.length || 0,
          applicants: totalApps,
        });
      }
    } catch (err: any) {
      console.error("Failed to fetch jobs", err);
      // Fallback
      setJobs(DUMMY_JOBS);
      setStats({
        active: DUMMY_JOBS.filter((j: any) => j.status === 'active').length,
        total: DUMMY_JOBS.length,
        applicants: 452
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePostJob = async (e?: React.FormEvent) => {
    // Prevent any default form submission behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Validation - Check required fields
    if (!newJob.title.trim()) {
      setError('Job title is required');
      return;
    }

    if (!companyId) {
      setError('Company ID is missing. Please refresh the page.');
      return;
    }

    // Validate title length (backend max is 200)
    if (newJob.title.trim().length > 200) {
      setError('Job title must be 200 characters or less');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Validate enum values to match backend expectations
      const validJobTypes = ['full_time', 'part_time', 'contract', 'internship', 'freelance', 'temporary'];
      const validExperienceLevels = ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'];
      const validStatuses = ['draft', 'published', 'paused', 'closed', 'archived'];

      const jobType = validJobTypes.includes(newJob.job_type) ? newJob.job_type : 'full_time';
      const experienceLevel = validExperienceLevels.includes(newJob.experience_level) ? newJob.experience_level : 'mid';
      const status = validStatuses.includes(newJob.status || 'published') ? (newJob.status || 'published') : 'published';

      // Ensure description is never empty (backend requires it)
      // If empty, create a default description from title
      const description = newJob.description && newJob.description.trim()
        ? newJob.description.trim()
        : `${newJob.title.trim()}\n\nJoin our team and make an impact! We are looking for talented individuals to help us grow.`;

      // Validate salary range if both are provided
      let salaryMin: number | undefined = undefined;
      let salaryMax: number | undefined = undefined;

      if (newJob.salary_min && newJob.salary_min.trim()) {
        const minSalary = parseInt(newJob.salary_min);
        if (!isNaN(minSalary) && minSalary > 0) {
          salaryMin = minSalary;
        }
      }

      if (newJob.salary_max && newJob.salary_max.trim()) {
        const maxSalary = parseInt(newJob.salary_max);
        if (!isNaN(maxSalary) && maxSalary > 0) {
          salaryMax = maxSalary;
        }
      }

      // Validate salary range logic
      if (salaryMin && salaryMax && salaryMin > salaryMax) {
        setError('Minimum salary cannot be greater than maximum salary');
        setSaving(false);
        return;
      }

      // Build payload with all required fields
      const payload: any = {
        title: newJob.title.trim(),
        description: description, // Always non-empty string
        job_type: jobType,
        experience_level: experienceLevel,
        skills_required: Array.isArray(newJob.skills_required) ? newJob.skills_required : [],
        coding_questions: Array.isArray(newJob.coding_questions) ? newJob.coding_questions : [],
        screening_questions: Array.isArray(newJob.screening_questions) ? newJob.screening_questions : [],
        status: status,
      };

      // Add optional fields only if they have values
      if (companyId) {
        payload.company_id = companyId;
      }
      if (companyName && companyName.trim()) {
        payload.company_name = companyName.trim();
      }
      if (newJob.location && newJob.location.trim()) {
        payload.location = newJob.location.trim();
      }
      if (salaryMin !== undefined) {
        payload.salary_min = salaryMin;
      }
      if (salaryMax !== undefined) {
        payload.salary_max = salaryMax;
      }

      console.log('Creating job with payload:', JSON.stringify(payload, null, 2));
      console.log('API endpoint:', API_ENDPOINTS.JOBS.CREATE);
      console.log('Company ID:', companyId);
      console.log('Company Name:', companyName);

      // Make API call
      const createdJob = await api.post(API_ENDPOINTS.JOBS.CREATE, payload);
      console.log('Job created successfully:', createdJob);

      // Success - close dialog and reset form
      setOpenDialog(false);
      setError(null);
      setNewJob({
        title: '',
        department: '',
        job_type: 'full_time',
        location: '',
        description: '',
        salary_min: '',
        salary_max: '',
        experience_level: 'mid',
        skills_required: [],
        coding_questions: [],
        screening_questions: [],
        status: 'published'
      });

      // Refresh the jobs list
      await fetchData();
    } catch (err: any) {
      console.error('Error creating job:', err);
      console.error('Error response:', err?.response);
      console.error('Error status:', err?.response?.status);
      console.error('Error data:', err?.response?.data);
      console.error('Error message:', err?.message);

      // Handle different error types with specific messages
      if (err?.response?.status === 401) {
        setError('Your session has expired. Please refresh the page and login again.');
      } else if (err?.response?.status === 500) {
        const errorDetail = err?.response?.data?.detail || 'Server error occurred. Please try again later.';
        setError(`Server error: ${errorDetail}`);
      } else if (err?.response?.status === 422) {
        // Validation error from backend
        const errors = err?.response?.data?.detail;
        if (Array.isArray(errors)) {
          // Pydantic validation errors format
          const errorMessages = errors.map((e: any) => {
            if (typeof e === 'string') return e;
            const field = Array.isArray(e.loc) ? e.loc.slice(1).join('.') : 'field';
            return `${field}: ${e.msg || e.message || 'Invalid value'}`;
          }).join(', ');
          setError(`Validation error: ${errorMessages}`);
        } else if (typeof errors === 'string') {
          setError(`Validation error: ${errors}`);
        } else {
          setError('Invalid data. Please check all fields and try again.');
        }
      } else if (err?.response?.status === 400) {
        const errorDetail = err?.response?.data?.detail || 'Bad request. Please check your input.';
        setError(errorDetail);
      } else {
        // Generic error handling
        const errorDetail = err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          'Failed to create job. Please try again.';
        setError(errorDetail);
      }

      // Keep dialog open so user can see error and retry
    } finally {
      setSaving(false);
    }
  };

  const handleEditJob = (job: any) => {
    setEditingJob(job);
    setNewJob({
      title: job.title || '',
      department: job.department || '',
      job_type: job.job_type || 'full_time',
      location: job.location || '',
      description: job.description || '',
      salary_min: job.salary_min?.toString() || '',
      salary_max: job.salary_max?.toString() || '',
      experience_level: job.experience_level || 'mid',
      skills_required: job.skills_required || [],
      coding_questions: job.coding_questions || [],
      screening_questions: job.screening_questions || [],
      status: job.status || 'published'
    });
    setEditDialog(true);
  };

  const handleViewJob = (job: any) => {
    setViewingJob(job);
    setViewDialog(true);
  };

  const handleUpdateJob = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!editingJob || !newJob.title.trim()) {
      setError('Job title is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Build payload with only non-empty values
      const payload: any = {
        title: newJob.title.trim(),
      };

      // Always include description (required field)
      payload.description = newJob.description && newJob.description.trim()
        ? newJob.description.trim()
        : newJob.title.trim();

      // Only include fields that have values
      if (newJob.job_type) {
        payload.job_type = newJob.job_type;
      }
      if (newJob.location && newJob.location.trim()) {
        payload.location = newJob.location.trim();
      }
      if (newJob.experience_level) {
        payload.experience_level = newJob.experience_level;
      }
      if (newJob.skills_required) {
        payload.skills_required = newJob.skills_required;
      }
      if (newJob.coding_questions) {
        payload.coding_questions = newJob.coding_questions;
      }
      if (newJob.screening_questions) {
        payload.screening_questions = newJob.screening_questions;
      }
      if (newJob.status) {
        payload.status = newJob.status;
      }
      if (newJob.salary_min && newJob.salary_min.trim()) {
        const minSalary = parseInt(newJob.salary_min);
        if (!isNaN(minSalary)) {
          payload.salary_min = minSalary;
        }
      }
      if (newJob.salary_max && newJob.salary_max.trim()) {
        const maxSalary = parseInt(newJob.salary_max);
        if (!isNaN(maxSalary)) {
          payload.salary_max = maxSalary;
        }
      }

      console.log('Updating job:', editingJob.id, 'with payload:', payload);
      console.log('API endpoint:', API_ENDPOINTS.JOBS.UPDATE(editingJob.id));

      const updatedJob = await api.put(API_ENDPOINTS.JOBS.UPDATE(editingJob.id), payload);
      console.log('Job updated successfully:', updatedJob);

      // Close dialog and reset form
      setEditDialog(false);
      setEditingJob(null);
      setError(null);
      setNewJob({
        title: '',
        department: '',
        job_type: 'full_time',
        location: '',
        description: '',
        salary_min: '',
        salary_max: '',
        experience_level: 'mid',
        skills_required: [],
        coding_questions: [],
        screening_questions: [],
        status: 'published'
      });

      // Refresh the jobs list
      await fetchData();
    } catch (err: any) {
      console.error('Error updating job:', err);
      console.error('Error response:', err?.response);
      const errorDetail = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Failed to update job';
      setError(errorDetail);
      // Don't close dialog on error so user can see the error and retry
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !newJob.skills_required.includes(skillInput.trim())) {
      setNewJob({
        ...newJob,
        skills_required: [...newJob.skills_required, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setNewJob({
      ...newJob,
      skills_required: newJob.skills_required.filter(s => s !== skillToRemove)
    });
  };

  const handleAddCodingQuestion = () => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      question: '',
      description: '',
      difficulty: 'medium'
    };
    setNewJob({
      ...newJob,
      coding_questions: [...newJob.coding_questions, newQuestion]
    });
    setExpandedQuestion(newJob.coding_questions.length);
  };

  const handleUpdateCodingQuestion = (index: number, field: string, value: any) => {
    const updated = [...newJob.coding_questions];
    updated[index] = { ...updated[index], [field]: value };
    setNewJob({ ...newJob, coding_questions: updated });
  };

  const handleRemoveCodingQuestion = (index: number) => {
    const updated = newJob.coding_questions.filter((_, i) => i !== index);
    setNewJob({ ...newJob, coding_questions: updated });
    if (expandedQuestion === index) setExpandedQuestion(null);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    try {
      setError(null);
      await api.delete(API_ENDPOINTS.JOBS.DELETE(jobId));
      fetchData();
    } catch (err: any) {
      const errorDetail = err?.response?.data?.detail || err?.response?.data?.message || err?.message;
      setError(errorDetail || 'Failed to delete job');
    }
  };

  const filteredJobs = jobs.filter(
    (job) => job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.department && job.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <CMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>Job Postings</Typography>
            <Typography variant="body2" color="text.secondary">Create and manage your company's list of open positions.</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: colors.primary, px: 3, borderRadius: 2 }}
            onClick={() => setOpenDialog(true)}
          >
            Post New Job
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 'none', border: `1px solid ${alpha(colors.primary, 0.1)}`, bgcolor: alpha(colors.primary, 0.02) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(colors.primary, 0.1), color: colors.primary }}>
                  <WorkIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700} color={colors.primary}>{stats.active}</Typography>
                  <Typography variant="body2" color="text.secondary">Active Jobs</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 'none', border: `1px solid ${alpha('#34C759', 0.1)}`, bgcolor: alpha('#34C759', 0.02) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha('#34C759', 0.1), color: '#34C759' }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="#34C759">{stats.applicants}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Applicants</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 'none', border: `1px solid ${alpha('#FF9500', 0.1)}`, bgcolor: alpha('#FF9500', 0.02) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha('#FF9500', 0.1), color: '#FF9500' }}>
                  <AddIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="#FF9500">{stats.total}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Jobs</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search by job title or department..."
          size="medium"
          sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'white'
            }
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {/* Jobs Grid */}
        {loading && jobs.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredJobs.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 8, bgcolor: 'white', borderRadius: 4, border: '1px dashed #ccc' }}>
            <WorkIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No jobs found</Typography>
            <Typography variant="body2" color="text.disabled">Try adjusting your search or post a new job.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredJobs.map((job) => (
              <Grid item xs={12} lg={6} key={job.id}>
                <Card sx={{
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  border: `1px solid ${alpha(colors.primary, 0.08)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 32px ${alpha(colors.primary, 0.12)}`,
                  },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar sx={{
                          bgcolor: alpha(colors.primary, 0.1),
                          color: colors.primary,
                          width: 48,
                          height: 48
                        }}>
                          <WorkIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={700} sx={{ lineClamp: 1, overflow: 'hidden' }}>
                            {job.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {job.department || 'Internal'}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewJob(job)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Job">
                          <IconButton size="small" onClick={() => handleEditJob(job)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Job">
                          <IconButton
                            size="small"
                            sx={{ color: 'error.main' }}
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                      <Chip
                        label={job.job_type === 'full_time' ? 'Full-time' : job.job_type === 'contract' ? 'Contract' : job.job_type || 'Full-time'}
                        size="small"
                        sx={{ fontWeight: 600, borderRadius: 1 }}
                      />
                      <Chip
                        label={job.location}
                        size="small"
                        variant="outlined"
                        icon={<LocationOnIcon sx={{ fontSize: '14px !important' }} />}
                        sx={{ fontWeight: 600, borderRadius: 1 }}
                      />
                      <Chip
                        label={job.status?.toUpperCase() || 'PUBLISHED'}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          borderRadius: 1,
                          bgcolor: (job.status === 'active' || job.status === 'published')
                            ? alpha('#34C759', 0.1)
                            : alpha('#FF9500', 0.1),
                          color: (job.status === 'active' || job.status === 'published') ? '#34C759' : '#FF9500',
                          fontSize: '0.65rem'
                        }}
                      />
                    </Box>

                    <Box sx={{
                      pt: 2,
                      borderTop: '1px solid rgba(0,0,0,0.05)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PeopleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {job.applications_count || 0} Applicants
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {job.published_at ? `Posted ${new Date(job.published_at).toLocaleDateString()}` : 'Draft'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add/Edit Job Dialog */}
        <Dialog
          open={openDialog || editDialog}
          onClose={(event, reason) => {
            // Prevent closing during save operation
            if (loading || saving) return;

            // Only allow closing via backdrop if not saving
            if (reason === 'backdropClick' && (loading || saving)) {
              return;
            }

            setOpenDialog(false);
            setEditDialog(false);
            setEditingJob(null);
            setError(null);
            setNewJob({
              title: '',
              department: '',
              job_type: 'full_time',
              location: '',
              description: '',
              salary_min: '',
              salary_max: '',
              experience_level: 'mid',
              skills_required: [],
              coding_questions: [],
              screening_questions: [],
              status: 'published'
            });
          }}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4 } }}
        >
          <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
            {editDialog ? 'Edit Job Posting' : 'Post New Job Offering'}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter the details for your new job posting. Required fields are marked with *.
            </Typography>
            <Grid container spacing={3} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Job Title"
                  placeholder="e.g. Senior Full-stack Developer"
                  value={newJob.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Limit to 200 characters (backend max)
                    if (value.length <= 200) {
                      setNewJob({ ...newJob, title: value });
                    }
                  }}
                  error={newJob.title.length > 200}
                  helperText={newJob.title.length > 200 ? 'Title must be 200 characters or less' : `${newJob.title.length}/200 characters`}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Department"
                  placeholder="e.g. Engineering, Sales, Product"
                  value={newJob.department}
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Job Type</InputLabel>
                  <Select
                    label="Job Type"
                    value={newJob.job_type}
                    onChange={(e) => setNewJob({ ...newJob, job_type: e.target.value })}
                  >
                    <MenuItem value="full_time">Full-time</MenuItem>
                    <MenuItem value="part_time">Part-time</MenuItem>
                    <MenuItem value="contract">Contract</MenuItem>
                    <MenuItem value="internship">Internship</MenuItem>
                    <MenuItem value="freelance">Freelance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  placeholder="e.g. Remote, New York, NY"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    label="Experience Level"
                    value={newJob.experience_level}
                    onChange={(e) => setNewJob({ ...newJob, experience_level: e.target.value })}
                  >
                    <MenuItem value="entry">Entry Level</MenuItem>
                    <MenuItem value="junior">Junior</MenuItem>
                    <MenuItem value="mid">Mid-Senior</MenuItem>
                    <MenuItem value="senior">Senior</MenuItem>
                    <MenuItem value="lead">Lead / Principal</MenuItem>
                    <MenuItem value="executive">Executive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Min Salary"
                  placeholder="e.g. 80000"
                  value={newJob.salary_min}
                  onChange={(e) => setNewJob({ ...newJob, salary_min: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Salary"
                  placeholder="e.g. 120000"
                  value={newJob.salary_max}
                  onChange={(e) => setNewJob({ ...newJob, salary_max: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 1, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  Required Skills
                  <Tooltip title="Add skills candidates should have">
                    <HelpOutlineIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                  </Tooltip>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="e.g. React, Python, AWS"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddSkill}
                    disabled={!skillInput.trim()}
                    sx={{ borderRadius: 2 }}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {newJob.skills_required.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
                      sx={{
                        borderRadius: 1.5,
                        fontWeight: 600,
                        bgcolor: alpha(colors.primary, 0.08),
                        border: `1px solid ${alpha(colors.primary, 0.2)}`
                      }}
                    />
                  ))}
                  {newJob.skills_required.length === 0 && (
                    <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                      No skills added yet. Add at least one skill.
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Coding Assessment Questions
                    <Tooltip title="Add coding challenges for candidates">
                      <CodeIcon sx={{ fontSize: 18, color: colors.primary }} />
                    </Tooltip>
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddCodingQuestion}
                    sx={{ borderRadius: 2 }}
                  >
                    Add Question
                  </Button>
                </Box>

                {newJob.coding_questions.length === 0 ? (
                  <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 3, textAlign: 'center', bgcolor: '#fafafa' }}>
                    <Typography variant="body2" color="text.secondary">
                      No coding questions added. Candidates will not be tested on coding skills.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {newJob.coding_questions.map((q, index) => (
                      <Card key={q.id} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            bgcolor: alpha(colors.primary, 0.02),
                            cursor: 'pointer'
                          }}
                          onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: colors.primary }}>
                              {index + 1}
                            </Avatar>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {q.question || `Untitled Question ${index + 1}`}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleRemoveCodingQuestion(index); }}>
                              <DeleteIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton size="small">
                              {expandedQuestion === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </Box>
                        </Box>

                        {expandedQuestion === index && (
                          <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Question Title"
                                  value={q.question}
                                  onChange={(e) => handleUpdateCodingQuestion(index, 'question', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>Difficulty</InputLabel>
                                  <Select
                                    label="Difficulty"
                                    value={q.difficulty}
                                    onChange={(e) => handleUpdateCodingQuestion(index, 'difficulty', e.target.value)}
                                  >
                                    <MenuItem value="easy">Easy</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="hard">Hard</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={3}
                                  size="small"
                                  label="Description & Instructions"
                                  value={q.description}
                                  onChange={(e) => handleUpdateCodingQuestion(index, 'description', e.target.value)}
                                  placeholder="Provide problem details, example inputs/outputs, and requirements."
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                      </Card>
                    ))}
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <TextField
                  fullWidth
                  label="Job Description"
                  multiline
                  rows={6}
                  placeholder="Describe the role, responsibilities, and requirements... (If left empty, a default description will be created)"
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  helperText={!newJob.description.trim() ? 'A default description will be created if left empty' : ''}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setEditDialog(false);
                setEditingJob(null);
                setNewJob({
                  title: '',
                  department: '',
                  job_type: 'full_time',
                  location: '',
                  description: '',
                  salary_min: '',
                  salary_max: '',
                  experience_level: 'mid',
                  skills_required: [],
                  coding_questions: [],
                  screening_questions: [],
                  status: 'published'
                });
              }}
              sx={{ px: 3 }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (editDialog) {
                  handleUpdateJob(e);
                } else {
                  handlePostJob(e);
                }
              }}
              disabled={!newJob.title.trim() || saving}
              sx={{ bgcolor: colors.primary, px: 4, borderRadius: 2 }}
            >
              {saving ? <CircularProgress size={20} /> : editDialog ? 'Update Job' : 'Post Job'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Job Details Dialog */}
        <Dialog
          open={viewDialog}
          onClose={() => setViewDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4 } }}
        >
          {viewingJob && (
            <>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, fontWeight: 700 }}>
                {viewingJob.title}
                <IconButton onClick={() => setViewDialog(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Department</Typography>
                    <Typography variant="body1" fontWeight={600}>{viewingJob.department || 'General'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Job Type</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {viewingJob.job_type === 'full_time' ? 'Full-time' : viewingJob.job_type === 'contract' ? 'Contract' : viewingJob.job_type || 'Full-time'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Location</Typography>
                    <Typography variant="body1" fontWeight={600}>{viewingJob.location}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Experience Level</Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ textTransform: 'capitalize' }}>{viewingJob.experience_level || 'Mid Level'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Salary Range</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {viewingJob.salary_min && viewingJob.salary_max
                        ? `$${viewingJob.salary_min} - $${viewingJob.salary_max}`
                        : viewingJob.salary_min ? `From $${viewingJob.salary_min}` : 'Not Specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={viewingJob.status?.toUpperCase() || 'PUBLISHED'}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: (viewingJob.status === 'active' || viewingJob.status === 'published') ? alpha('#34C759', 0.1) : alpha('#FF9500', 0.1),
                          color: (viewingJob.status === 'active' || viewingJob.status === 'published') ? '#34C759' : '#FF9500',
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700, mt: 1 }}>Required Skills</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {viewingJob.skills_required && viewingJob.skills_required.length > 0 ? (
                        viewingJob.skills_required.map((skill: string, i: number) => (
                          <Chip key={i} label={skill} size="small" variant="outlined" />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.disabled">No skills specified</Typography>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700, mt: 1 }}>Job Description</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', bgcolor: '#f9f9f9', p: 2, borderRadius: 2 }}>
                      {viewingJob.description || 'No description provided.'}
                    </Typography>
                  </Grid>

                  {viewingJob.coding_questions && viewingJob.coding_questions.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700, mt: 1 }}>Coding Questions ({viewingJob.coding_questions.length})</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {viewingJob.coding_questions.map((q: any, i: number) => (
                          <Box key={i} sx={{ border: '1px solid #eee', p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="subtitle2" fontWeight={700}>{i + 1}. {q.question}</Typography>
                              <Chip label={q.difficulty} size="small" variant="outlined" color={q.difficulty === 'easy' ? 'success' : q.difficulty === 'hard' ? 'error' : 'warning'} sx={{ fontSize: '0.65rem', height: 20 }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary">{q.description}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button variant="outlined" onClick={() => { setViewDialog(false); handleEditJob(viewingJob); }} startIcon={<EditIcon />}>
                  Edit Job
                </Button>
                <Button variant="contained" onClick={() => setViewDialog(false)} sx={{ bgcolor: colors.primary }}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </CMSLayout>
  );
};

export default CMSJobs;
