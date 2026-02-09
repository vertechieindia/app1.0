/**
 * SMSPrograms - Programs Management
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
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import SMSLayout from './SMSLayout';
import { api } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api';

const colors = {
  primary: '#0d47a1',
  primaryDark: '#1a237e',
  success: '#34C759',
};

const SMSPrograms: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [programs, setPrograms] = useState<any[]>([]);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProgram, setEditingProgram] = useState<any | null>(null);

  const [formValues, setFormValues] = useState({
    name: '',
    program_type: 'bachelors',
    duration_months: '',
    description: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const mySchool = await api.get<any>(API_ENDPOINTS.SMS.MY_SCHOOL);
        if (mySchool?.id) {
          setSchoolId(mySchool.id);
          const data = await api.get<any[]>(API_ENDPOINTS.SMS.PROGRAMS(mySchool.id));
          setPrograms(Array.isArray(data) ? data : []);
        } else {
          setPrograms([]);
        }
      } catch (err: any) {
        console.error('Error loading school programs:', err);
        setError(err?.response?.data?.detail || 'Failed to load programs.');
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setFormValues({
      name: '',
      program_type: 'bachelors',
      duration_months: '',
      description: '',
    });
    setEditingProgram(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleOpenEdit = (program: any) => {
    setEditingProgram(program);
    setFormValues({
      name: program.name || '',
      program_type: program.program_type || 'bachelors',
      duration_months: program.duration_months ? String(program.duration_months) : '',
      description: program.description || '',
    });
    setOpenDialog(true);
  };

  const handleSaveProgram = async () => {
    if (!schoolId) {
      setError('No school found. Please ensure you are an admin of a school.');
      return;
    }
    if (!formValues.name.trim()) {
      setError('Program name is required.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload: any = {
        name: formValues.name.trim(),
        program_type: formValues.program_type,
      };
      if (formValues.description.trim()) {
        payload.description = formValues.description.trim();
      }
      if (formValues.duration_months) {
        const months = Number(formValues.duration_months);
        if (!Number.isNaN(months) && months > 0) {
          payload.duration_months = months;
        }
      }

      let saved: any;
      if (editingProgram?.id) {
        saved = await api.put<any>(
          API_ENDPOINTS.SMS.UPDATE_PROGRAM(schoolId, editingProgram.id),
          payload,
        );
        setPrograms((prev) =>
          prev.map((p) => (p.id === editingProgram.id ? saved : p)),
        );
      } else {
        saved = await api.post<any>(
          API_ENDPOINTS.SMS.ADD_PROGRAM(schoolId),
          payload,
        );
        setPrograms((prev) => [saved, ...prev]);
      }

      setOpenDialog(false);
      resetForm();
    } catch (err: any) {
      console.error('Failed to save program', err);
      setError(err?.response?.data?.detail || err?.message || 'Failed to save program.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProgram = async (program: any) => {
    if (!schoolId || !program?.id) return;
    const confirmed = window.confirm(`Delete program "${program.name}"?`);
    if (!confirmed) return;

    try {
      await api.delete(API_ENDPOINTS.SMS.DELETE_PROGRAM(schoolId, program.id));
      setPrograms((prev) => prev.filter((p) => p.id !== program.id));
    } catch (err: any) {
      console.error('Failed to delete program', err);
      setError(err?.response?.data?.detail || err?.message || 'Failed to delete program.');
    }
  };

  const filteredPrograms = programs.filter(
    (p) => p.name?.toLowerCase().includes(searchQuery.toLowerCase()),
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredPrograms.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography color="text.secondary">No programs yet. Add your first program!</Typography>
          </Box>
        ) : (
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
                        <IconButton size="small" onClick={() => handleOpenEdit(program)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: 'error.main' }}
                          onClick={() => handleDeleteProgram(program)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {program.name}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      {program.program_type && (
                        <Chip
                          label={String(program.program_type).charAt(0).toUpperCase() + String(program.program_type).slice(1)}
                          size="small"
                          sx={{ bgcolor: alpha(colors.primary, 0.1), color: colors.primary }}
                        />
                      )}
                      <Chip
                        label={program.is_active === false ? 'Inactive' : 'Active'}
                        size="small"
                        sx={{ bgcolor: alpha(colors.success, 0.1), color: colors.success }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {program.duration_months
                            ? `${program.duration_months} months`
                            : 'Duration not set'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PeopleIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {program.enrolled_count ?? 0} students
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add / Edit Program Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingProgram ? 'Edit Program' : 'Add New Program'}</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Program Name"
                value={formValues.name}
                onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Program Type (bachelors, masters, phd, diploma, certificate, bootcamp)"
                value={formValues.program_type}
                onChange={(e) => setFormValues((prev) => ({ ...prev, program_type: e.target.value }))}
                helperText="Use values like bachelors, masters, phd, diploma, certificate, bootcamp"
              />
              <TextField
                fullWidth
                label="Duration (months)"
                type="number"
                value={formValues.duration_months}
                onChange={(e) => setFormValues((prev) => ({ ...prev, duration_months: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formValues.description}
                onChange={(e) => setFormValues((prev) => ({ ...prev, description: e.target.value }))}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              sx={{ bgcolor: colors.primary }}
              onClick={handleSaveProgram}
              disabled={saving}
            >
              {saving ? 'Saving...' : editingProgram ? 'Save Changes' : 'Add Program'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </SMSLayout>
  );
};

export default SMSPrograms;

