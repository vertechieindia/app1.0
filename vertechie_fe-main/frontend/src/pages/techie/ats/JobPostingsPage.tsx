/**
 * JobPostingsPage - Manage Job Listings
 * Enhanced with Create, Filter, Edit, and View Applicants functionality
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Chip, IconButton, TextField, Button,
  Grid, InputAdornment, Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Menu, Checkbox, FormControlLabel,
  FormGroup, Divider, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, LinearProgress, Snackbar, Alert, Tabs, Tab, Switch, Tooltip,
} from '@mui/material';
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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

const initialJobs = [
  { id: 1, title: 'Senior React Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', salary: '$150K - $180K', applicants: 48, newApplicants: 8, views: 1250, status: 'active', posted: '2 weeks ago' },
  { id: 2, title: 'Product Manager', department: 'Product', location: 'San Francisco, CA', type: 'Full-time', salary: '$140K - $170K', applicants: 35, newApplicants: 5, views: 890, status: 'active', posted: '1 week ago' },
  { id: 3, title: 'UX Designer', department: 'Design', location: 'New York, NY', type: 'Full-time', salary: '$120K - $150K', applicants: 28, newApplicants: 3, views: 720, status: 'active', posted: '3 days ago' },
  { id: 4, title: 'DevOps Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', salary: '$130K - $160K', applicants: 22, newApplicants: 4, views: 560, status: 'draft', posted: 'Draft' },
];

const mockApplicants = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 (555) 123-4567', title: 'Senior Developer', experience: '8 years', matchScore: 95, status: 'new', appliedDate: '2 hours ago', skills: ['React', 'TypeScript', 'Node.js', 'AWS'] },
  { id: 2, name: 'Michael Chen', email: 'm.chen@email.com', phone: '+1 (555) 234-5678', title: 'Full Stack Developer', experience: '6 years', matchScore: 88, status: 'reviewed', appliedDate: '1 day ago', skills: ['React', 'Python', 'PostgreSQL'] },
  { id: 3, name: 'Emily Davis', email: 'emily.d@email.com', phone: '+1 (555) 345-6789', title: 'Frontend Engineer', experience: '5 years', matchScore: 82, status: 'interviewed', appliedDate: '2 days ago', skills: ['React', 'Vue', 'CSS'] },
  { id: 4, name: 'James Wilson', email: 'j.wilson@email.com', phone: '+1 (555) 456-7890', title: 'Software Engineer', experience: '4 years', matchScore: 75, status: 'new', appliedDate: '3 days ago', skills: ['JavaScript', 'React', 'MongoDB'] },
  { id: 5, name: 'Lisa Anderson', email: 'l.anderson@email.com', phone: '+1 (555) 567-8901', title: 'React Developer', experience: '3 years', matchScore: 68, status: 'rejected', appliedDate: '5 days ago', skills: ['React', 'Redux'] },
];

const JobPostingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(initialJobs);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create Job Dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createTab, setCreateTab] = useState(0);
  const [newJob, setNewJob] = useState({
    title: '', department: '', location: '', type: '', salary: '', description: '',
  });
  
  // Filter Menu
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState({
    active: true, draft: true, engineering: true, product: true, design: true, remote: true, onsite: true,
  });
  
  // Edit Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  
  // Applicants Dialog
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicantTab, setApplicantTab] = useState(0);
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // More Menu
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);
  const [moreJobId, setMoreJobId] = useState<number | null>(null);

  const handleCreateJob = () => {
    if (!newJob.title || !newJob.department) {
      setSnackbar({ open: true, message: 'Please fill in Job Title and Department', severity: 'error' });
      return;
    }
    const job = {
      id: jobs.length + 1,
      ...newJob,
      applicants: 0,
      newApplicants: 0,
      views: 0,
      status: 'active',
      posted: 'Just now',
    };
    setJobs([job, ...jobs]);
    setCreateDialogOpen(false);
    setNewJob({ title: '', department: '', location: '', type: '', salary: '', description: '' });
    setCreateTab(0);
    setSnackbar({ open: true, message: 'Job posted successfully!', severity: 'success' });
  };

  const handleEditJob = () => {
    if (!editingJob) return;
    setJobs(jobs.map(j => j.id === editingJob.id ? editingJob : j));
    setEditDialogOpen(false);
    setEditingJob(null);
    setSnackbar({ open: true, message: 'Job updated successfully!', severity: 'success' });
  };

  const handleDeleteJob = (jobId: number) => {
    setJobs(jobs.filter(j => j.id !== jobId));
    setMoreAnchor(null);
    setMoreJobId(null);
    setSnackbar({ open: true, message: 'Job deleted', severity: 'success' });
  };

  const openEditDialog = (job: any) => {
    setEditingJob({ ...job });
    setEditDialogOpen(true);
  };

  const openApplicantsDialog = (job: any) => {
    setSelectedJob(job);
    setApplicantsDialogOpen(true);
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

  const filteredApplicants = mockApplicants.filter(a => {
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
        <MenuItem onClick={() => { openEditDialog(jobs.find(j => j.id === moreJobId)); setMoreAnchor(null); }}>
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

      {/* Create Job Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee' }}>
          Create New Job
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={newJob.department}
                  label="Department"
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                >
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Product">Product</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                placeholder="e.g., Remote or San Francisco, CA"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Employment Type</InputLabel>
                <Select
                  value={newJob.type}
                  label="Employment Type"
                  onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                >
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Salary Range"
                value={newJob.salary}
                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                placeholder="e.g., $100K - $150K"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Job Description"
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                placeholder="Describe the role, responsibilities, and requirements..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateJob} sx={{ bgcolor: '#0d47a1' }}>
            Create Job
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee' }}>
          Edit Job
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {editingJob && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
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
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={editingJob.location}
                  onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Employment Type</InputLabel>
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
                <TextField
                  fullWidth
                  label="Salary Range"
                  value={editingJob.salary}
                  onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
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
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditJob} sx={{ bgcolor: '#0d47a1' }}>
            Save Changes
          </Button>
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
              {mockApplicants.length} total applicants • Sorted by profile match score
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
            <Tab label={`All (${mockApplicants.length})`} />
            <Tab label={`New (${mockApplicants.filter(a => a.status === 'new').length})`} />
            <Tab label={`Reviewed (${mockApplicants.filter(a => a.status === 'reviewed').length})`} />
            <Tab label={`Interviewed (${mockApplicants.filter(a => a.status === 'interviewed').length})`} />
          </Tabs>
          
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
                          <IconButton size="small" sx={{ color: '#0d47a1' }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Schedule Interview">
                          <IconButton size="small" sx={{ color: '#5856D6' }}>
                            <ScheduleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Email">
                          <IconButton size="small" sx={{ color: '#34C759' }}>
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
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            Showing {filteredApplicants.length} applicants sorted by relevance
          </Typography>
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
