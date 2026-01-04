/**
 * SMSPrograms - Programs Management
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
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import SMSLayout from './SMSLayout';

const colors = {
  primary: '#0d47a1',
  primaryDark: '#1a237e',
  success: '#34C759',
};

const mockPrograms = [
  { id: 1, name: 'Computer Science', degree: 'B.Tech', duration: '4 years', students: 1200, status: 'active' },
  { id: 2, name: 'Data Science', degree: 'M.Tech', duration: '2 years', students: 450, status: 'active' },
  { id: 3, name: 'Artificial Intelligence', degree: 'M.Tech', duration: '2 years', students: 380, status: 'active' },
  { id: 4, name: 'Cybersecurity', degree: 'B.Tech', duration: '4 years', students: 650, status: 'active' },
  { id: 5, name: 'Software Engineering', degree: 'B.Tech', duration: '4 years', students: 890, status: 'active' },
  { id: 6, name: 'Cloud Computing', degree: 'Certificate', duration: '6 months', students: 230, status: 'active' },
];

const SMSPrograms: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const filteredPrograms = mockPrograms.filter(
    (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>Programs</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            sx={{ bgcolor: colors.primary }}
            onClick={() => setOpenDialog(true)}
          >
            Add Program
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search programs..."
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

        {/* Programs Grid */}
        <Grid container spacing={3}>
          {filteredPrograms.map((program) => (
            <Grid item xs={12} md={6} lg={4} key={program.id}>
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
                      <SchoolIcon />
                    </Avatar>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'error.main' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {program.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      label={program.degree} 
                      size="small" 
                      sx={{ bgcolor: alpha(colors.primary, 0.1), color: colors.primary }} 
                    />
                    <Chip 
                      label={program.status} 
                      size="small" 
                      sx={{ bgcolor: alpha(colors.success, 0.1), color: colors.success }} 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {program.duration}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PeopleIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {program.students} students
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Add Program Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Program</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField fullWidth label="Program Name" />
              <TextField fullWidth label="Degree Type" />
              <TextField fullWidth label="Duration" />
              <TextField fullWidth label="Description" multiline rows={3} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" sx={{ bgcolor: colors.primary }}>
              Add Program
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </SMSLayout>
  );
};

export default SMSPrograms;

