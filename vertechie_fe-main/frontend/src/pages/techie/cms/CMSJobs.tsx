/**
 * CMSJobs - Company Jobs Management
 */

import React, { useState } from 'react';
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
import CMSLayout from './CMSLayout';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
  warning: '#FF9500',
};

const mockJobs = [
  { id: 1, title: 'Senior Software Engineer', department: 'Engineering', location: 'San Francisco, CA', type: 'Full-time', applicants: 45, status: 'active', posted: '3 days ago' },
  { id: 2, title: 'Product Manager', department: 'Product', location: 'Remote', type: 'Full-time', applicants: 32, status: 'active', posted: '1 week ago' },
  { id: 3, title: 'UX Designer', department: 'Design', location: 'New York, NY', type: 'Full-time', applicants: 28, status: 'active', posted: '2 weeks ago' },
  { id: 4, title: 'Data Scientist', department: 'Data', location: 'San Francisco, CA', type: 'Full-time', applicants: 56, status: 'active', posted: '1 day ago' },
  { id: 5, title: 'Marketing Intern', department: 'Marketing', location: 'Remote', type: 'Internship', applicants: 78, status: 'active', posted: '5 days ago' },
  { id: 6, title: 'DevOps Engineer', department: 'Engineering', location: 'San Francisco, CA', type: 'Full-time', applicants: 23, status: 'paused', posted: '3 weeks ago' },
];

const CMSJobs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const filteredJobs = mockJobs.filter(
    (job) => job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             job.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>Job Postings</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            sx={{ bgcolor: colors.primary }}
            onClick={() => setOpenDialog(true)}
          >
            Post New Job
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Card sx={{ p: 2, textAlign: 'center', bgcolor: alpha(colors.primary, 0.05) }}>
              <Typography variant="h4" fontWeight={700} color={colors.primary}>24</Typography>
              <Typography variant="body2" color="text.secondary">Active Jobs</Typography>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ p: 2, textAlign: 'center', bgcolor: alpha(colors.success, 0.05) }}>
              <Typography variant="h4" fontWeight={700} color={colors.success}>262</Typography>
              <Typography variant="body2" color="text.secondary">Total Applicants</Typography>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ p: 2, textAlign: 'center', bgcolor: alpha(colors.warning, 0.05) }}>
              <Typography variant="h4" fontWeight={700} color={colors.warning}>12</Typography>
              <Typography variant="body2" color="text.secondary">Interviews Scheduled</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search jobs..."
          size="small"
          sx={{ mb: 3 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Jobs Grid */}
        <Grid container spacing={2}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} md={6} key={job.id}>
              <Card sx={{ 
                height: '100%',
                border: `1px solid ${alpha(colors.primary, 0.1)}`,
                '&:hover': {
                  boxShadow: `0 8px 24px ${alpha(colors.primary, 0.15)}`,
                },
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar sx={{ bgcolor: alpha(colors.primary, 0.1), color: colors.primary }}>
                      <WorkIcon />
                    </Avatar>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'error.main' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {job.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label={job.department} 
                      size="small" 
                      sx={{ bgcolor: alpha(colors.primary, 0.1), color: colors.primary }} 
                    />
                    <Chip 
                      label={job.type} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={job.status} 
                      size="small" 
                      sx={{ 
                        bgcolor: job.status === 'active' 
                          ? alpha(colors.success, 0.1) 
                          : alpha(colors.warning, 0.1),
                        color: job.status === 'active' ? colors.success : colors.warning,
                      }} 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PeopleIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {job.applicants} applicants
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Posted {job.posted}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Add Job Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Post New Job</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ pt: 2 }}>
              <Grid item xs={12}>
                <TextField fullWidth label="Job Title" />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select label="Department" defaultValue="">
                    <MenuItem value="engineering">Engineering</MenuItem>
                    <MenuItem value="product">Product</MenuItem>
                    <MenuItem value="design">Design</MenuItem>
                    <MenuItem value="marketing">Marketing</MenuItem>
                    <MenuItem value="data">Data</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Job Type</InputLabel>
                  <Select label="Job Type" defaultValue="">
                    <MenuItem value="fulltime">Full-time</MenuItem>
                    <MenuItem value="parttime">Part-time</MenuItem>
                    <MenuItem value="contract">Contract</MenuItem>
                    <MenuItem value="internship">Internship</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Location" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" multiline rows={4} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" sx={{ bgcolor: colors.primary }}>
              Post Job
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </CMSLayout>
  );
};

export default CMSJobs;

