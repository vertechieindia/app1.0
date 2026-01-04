import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  padding: theme.spacing(4, 0),
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  background: 'linear-gradient(135deg, #0077B5 0%, #00BFFF 100%)',
  color: 'white',
  borderRadius: theme.shape.borderRadius * 2,
}));

const JobCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
}));

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salaryRange: string;
  status: 'active' | 'draft' | 'closed';
  createdAt: string;
  updatedAt: string;
}

const HR: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State management
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Join our engineering team to build and scale our verification platform.',
      requirements: [
        '5+ years of experience in software development',
        'Strong expertise in React, Node.js, and TypeScript',
        'Experience with cloud platforms (AWS/Azure/GCP)',
        'Excellent problem-solving skills'
      ],
      salaryRange: '$80,000 - $120,000',
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead product development and strategy for our verification platform.',
      requirements: [
        '3+ years of product management experience',
        'Strong analytical and strategic thinking',
        'Experience with agile methodologies',
        'Excellent communication skills'
      ],
      salaryRange: '$70,000 - $100,000',
      status: 'draft',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20'
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Form state
  const [formData, setFormData] = useState<Partial<JobPosting>>({
    title: '',
    department: '',
    location: '',
    type: '',
    description: '',
    requirements: [],
    salaryRange: '',
    status: 'draft'
  });

  const [newRequirement, setNewRequirement] = useState('');

  const handleOpenDialog = (job?: JobPosting) => {
    if (job) {
      setEditingJob(job);
      setFormData(job);
    } else {
      setEditingJob(null);
      setFormData({
        title: '',
        department: '',
        location: '',
        type: '',
        description: '',
        requirements: [],
        salaryRange: '',
        status: 'draft'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingJob(null);
    setFormData({
      title: '',
      department: '',
      location: '',
      type: '',
      description: '',
      requirements: [],
      salaryRange: '',
      status: 'draft'
    });
    setNewRequirement('');
  };

  const handleInputChange = (field: keyof JobPosting, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...(prev.requirements || []), newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSaveJob = () => {
    if (!formData.title || !formData.department || !formData.location || !formData.type) {
      setSnackbar({ open: true, message: 'Please fill in all required fields', severity: 'error' });
      return;
    }

    const now = new Date().toISOString().split('T')[0];
    
    if (editingJob) {
      // Update existing job
      setJobPostings(prev => prev.map(job => 
        job.id === editingJob.id 
          ? { ...formData as JobPosting, id: editingJob.id, updatedAt: now }
          : job
      ));
      setSnackbar({ open: true, message: 'Job posting updated successfully', severity: 'success' });
    } else {
      // Create new job
      const newJob: JobPosting = {
        ...formData as JobPosting,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      };
      setJobPostings(prev => [...prev, newJob]);
      setSnackbar({ open: true, message: 'Job posting created successfully', severity: 'success' });
    }
    
    handleCloseDialog();
  };

  const handleDeleteJob = (jobId: string) => {
    setJobPostings(prev => prev.filter(job => job.id !== jobId));
    setSnackbar({ open: true, message: 'Job posting deleted successfully', severity: 'success' });
  };

  const handleToggleStatus = (jobId: string) => {
    setJobPostings(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status: job.status === 'active' ? 'closed' : 'active',
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : job
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'closed': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'draft': return 'Draft';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  return (
    <PageContainer>
      <Container maxWidth="lg">
        {/* Header */}
        <HeaderCard>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                  HR Job Management
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Manage job postings and recruitment process
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                bgcolor: 'white',
                color: '#0077B5',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
              }}
            >
              Create New Job Posting
            </Button>
          </CardContent>
        </HeaderCard>

        {/* Job Postings List */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#0077B5' }}>
            Current Job Postings ({jobPostings.length})
          </Typography>
          
          {jobPostings.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No job postings yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first job posting to get started
              </Typography>
            </Card>
          ) : (
            jobPostings.map((job) => (
              <JobCard key={job.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {job.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          icon={<LocationOnIcon />} 
                          label={job.location} 
                          size="small" 
                          variant="outlined" 
                        />
                        <Chip 
                          icon={<ScheduleIcon />} 
                          label={job.type} 
                          size="small" 
                          variant="outlined" 
                        />
                        <Chip 
                          label={job.department} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <StatusChip 
                        label={getStatusLabel(job.status)} 
                        color={getStatusColor(job.status) as any}
                        size="small"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={job.status === 'active'}
                            onChange={() => handleToggleStatus(job.id)}
                            size="small"
                          />
                        }
                        label="Active"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {job.description}
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Salary Range: {job.salaryRange}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary">
                    Created: {job.createdAt} | Updated: {job.updatedAt}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                  <IconButton 
                    onClick={() => handleOpenDialog(job)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeleteJob(job.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </JobCard>
            ))
          )}
        </Box>

        {/* Create/Edit Job Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ bgcolor: '#0077B5', color: 'white' }}>
            {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formData.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    label="Department"
                  >
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="Product">Product</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Sales">Sales</MenuItem>
                    <MenuItem value="HR">Human Resources</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                    <MenuItem value="Operations">Operations</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Job Type</InputLabel>
                  <Select
                    value={formData.type || ''}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    label="Job Type"
                  >
                    <MenuItem value="Full-time">Full-time</MenuItem>
                    <MenuItem value="Part-time">Part-time</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                    <MenuItem value="Internship">Internship</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Description"
                  multiline
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Salary Range"
                  value={formData.salaryRange || ''}
                  onChange={(e) => handleInputChange('salaryRange', e.target.value)}
                  placeholder="e.g., $50,000 - $80,000"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Requirements
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add Requirement"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleAddRequirement}
                    disabled={!newRequirement.trim()}
                  >
                    Add
                  </Button>
                </Box>
                
                {formData.requirements && formData.requirements.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.requirements.map((req, index) => (
                      <Chip
                        key={index}
                        label={req}
                        onDelete={() => handleRemoveRequirement(index)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status || 'draft'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={handleCloseDialog} 
              startIcon={<CancelIcon />}
              color="inherit"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveJob} 
              startIcon={<SaveIcon />}
              variant="contained"
              color="primary"
            >
              {editingJob ? 'Update' : 'Create'} Job
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </PageContainer>
  );
};

export default HR;

