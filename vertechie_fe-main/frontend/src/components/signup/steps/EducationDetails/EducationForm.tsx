import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import { StepComponentProps } from '../../types';
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../../../../config/api';
import { isValidDateRange, isValidGPA } from '../../../../utils/validation';
import { formatDateToMMDDYYYY } from '../../utils/formatters';

interface EducationFormData {
  institution: string;
  levelOfEducation: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

const EducationForm: React.FC<StepComponentProps> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
  location,
  goToStep,
}) => {
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newEducation, setNewEducation] = useState<EducationFormData>({
    institution: '',
    levelOfEducation: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    gpa: '',
  });

  const education = formData.education || [];

  const handleAddEducation = useCallback(() => {
    setEditingIndex(null);
    setShowEducationForm(true);
  }, []);

  const handleEditEducation = useCallback((index: number) => {
    const edu = education[index];
    setEditingIndex(index);
    setNewEducation({
      institution: edu.institution || '',
      levelOfEducation: edu.levelOfEducation || '',
      fieldOfStudy: edu.fieldOfStudy || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      gpa: edu.gpa || '',
    });
    setShowEducationForm(true);
  }, [education]);

  const handleRemoveEducation = useCallback((index: number) => {
    const updatedEducation = education.filter((_: any, i: number) => i !== index);
    updateFormData({ education: updatedEducation });
  }, [education, updateFormData]);

  const handleEducationFormClose = useCallback(() => {
    setShowEducationForm(false);
    setIsSaving(false);
    setEditingIndex(null);
    if (setErrors) {
      setErrors({});
    }
    setNewEducation({
      institution: '',
      levelOfEducation: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: '',
    });
  }, [setErrors]);

  const handleAddEducationSubmit = useCallback(async () => {
    // Clear previous errors
    const validationErrors: Record<string, string> = {};

    // Validate required fields
    if (!newEducation.institution || !newEducation.institution.trim()) {
      validationErrors.institution = 'Institution Name is required';
    } else if (newEducation.institution.trim().length < 2) {
      validationErrors.institution = 'Institution Name must be at least 2 characters';
    }

    if (!newEducation.levelOfEducation || !newEducation.levelOfEducation.trim()) {
      validationErrors.levelOfEducation = 'Level of Education is required';
    }

    if (!newEducation.fieldOfStudy || !newEducation.fieldOfStudy.trim()) {
      validationErrors.fieldOfStudy = 'Field of Study is required';
    } else if (newEducation.fieldOfStudy.trim().length < 2) {
      validationErrors.fieldOfStudy = 'Field of Study must be at least 2 characters';
    }

    // Validate dates
    if (!newEducation.startDate) {
      validationErrors.startDate = 'Start Date is required';
    }

    if (!newEducation.endDate) {
      validationErrors.endDate = 'End Date is required';
    }

    // Validate date range
    if (newEducation.startDate && newEducation.endDate) {
      if (!isValidDateRange(newEducation.startDate, newEducation.endDate)) {
        validationErrors.endDate = 'End Date must be after or equal to Start Date';
      }
    }

    // Validate GPA (if provided)
    if (newEducation.gpa && newEducation.gpa.trim()) {
      if (!isValidGPA(newEducation.gpa.trim())) {
        validationErrors.gpa = 'Please enter a valid GPA (0-4 or 0-10 scale)';
      }
    }

    // If there are validation errors, display them
    if (Object.keys(validationErrors).length > 0) {
      if (setErrors) {
        setErrors(validationErrors);
      } else {
        alert(Object.values(validationErrors).join('\n'));
      }
      setIsSaving(false);
      return;
    }

    setIsSaving(true);
    if (setErrors) {
      setErrors({});
    }

    // Get auth token - check multiple sources in order of priority (declare outside try block)
    const token =
      localStorage.getItem('authToken') ||
      (formData as any)?.access_token ||
      (formData as any)?.token ||
      (formData as any)?.tokenResponse?.access ||           // Token API returns token in 'access' field
      (formData as any)?.tokenResponse?.access_token ||
      (formData as any)?.tokenResponse?.accessToken ||
      (formData as any)?.tokenResponse?.token ||
      (formData as any)?.tokenResponse?.data?.access ||
      (formData as any)?.tokenResponse?.data?.access_token ||
      (formData as any)?.tokenResponse?.data?.token;

    try {
      // Parse start_year safely - ensure it's a valid integer or null
      let startYear: number | null = null;
      if (newEducation.startDate && newEducation.startDate.trim() !== '') {
        // First try to parse as YYYY-MM-DD format
        if (newEducation.startDate.includes('-')) {
          const yearPart = parseInt(newEducation.startDate.split('-')[0], 10);
          if (!isNaN(yearPart) && yearPart > 1900 && yearPart < 2100) {
            startYear = yearPart;
          }
        }
        // Fallback: try to parse as a date
        if (startYear === null) {
          const parsedDate = new Date(newEducation.startDate);
          if (!isNaN(parsedDate.getTime())) {
            startYear = parsedDate.getFullYear();
          }
        }
      }
      // Default to current year if no valid start year
      if (startYear === null) {
        startYear = new Date().getFullYear();
      }

      // Parse end_year safely - ensure it's a valid integer or null
      let endYear: number | null = null;
      if (newEducation.endDate && newEducation.endDate.trim() !== '') {
        // First try to parse as YYYY-MM-DD format
        if (newEducation.endDate.includes('-')) {
          const yearPart = parseInt(newEducation.endDate.split('-')[0], 10);
          if (!isNaN(yearPart) && yearPart > 1900 && yearPart < 2100) {
            endYear = yearPart;
          }
        }
        // Fallback: try to parse as a date
        if (endYear === null) {
          const parsedDate = new Date(newEducation.endDate);
          if (!isNaN(parsedDate.getTime())) {
            endYear = parsedDate.getFullYear();
          }
        }
      }

      // Prepare payload according to API format (trim all string values)
      const payload = {
        school_name: newEducation.institution.trim(),
        degree: newEducation.levelOfEducation.trim().toUpperCase() || null,
        field_of_study: newEducation.fieldOfStudy.trim() || null,
        start_year: startYear,
        end_year: endYear,
        grade: (newEducation.gpa || '').trim() || null,
      };

      console.log('Posting education details to API:', payload);

      console.log('Token check for education API:');
      console.log('  - localStorage:', localStorage.getItem('authToken') ? 'Available' : 'Not available');
      console.log('  - formData.access_token:', (formData as any)?.access_token ? 'Available' : 'Not available');
      console.log('  - formData.token:', (formData as any)?.token ? 'Available' : 'Not available');
      console.log('  - formData.tokenResponse:', (formData as any)?.tokenResponse ? 'Available' : 'Not available');
      console.log('  - Final token:', token ? `Found (${token.substring(0, 20)}...)` : 'No token');

      const apiUrl = getApiUrl(API_ENDPOINTS.EDUCATION);
      console.log('API URL:', apiUrl);

      // Prepare headers with authentication
      const headers: any = {
        'Content-Type': 'application/json',
      };

      // Add Authorization header if token is available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Authorization header added with Bearer token');
      } else {
        console.warn('No token available for education API call');
      }

      console.log('Request details:', {
        url: apiUrl,
        hasToken: !!token,
        tokenLength: token?.length || 0,
        headers: Object.keys(headers),
        isEdit: editingIndex !== null,
        educationId: editingIndex !== null ? education[editingIndex]?.id : null,
      });

      // Use PATCH for editing, POST for new entries
      let response;
      if (editingIndex !== null && education[editingIndex]?.id) {
        // Update existing education using PATCH
        const educationId = education[editingIndex].id;
        const updateUrl = `${apiUrl}${educationId}/`;
        console.log('Patching education details:', updateUrl);
        response = await axios.patch(updateUrl, payload, { headers });
        console.log('Education details updated successfully:', response.data);
      } else {
        // Create new education using POST
        console.log('Posting new education details:', apiUrl);
        response = await axios.post(apiUrl, payload, { headers });
        console.log('Education details posted successfully:', response.data);
      }

      // Log response status for debugging
      if (response.status !== 200 && response.status !== 201) {
        console.warn('Unexpected status code:', response.status);
      }

      // Add or update education to formData after successful API call
      const savedEducation = {
        institution: newEducation.institution,
        levelOfEducation: newEducation.levelOfEducation,
        fieldOfStudy: newEducation.fieldOfStudy,
        startDate: newEducation.startDate,
        endDate: newEducation.endDate,
        gpa: newEducation.gpa,
        // Store API response ID if available
        id: response.data?.id || response.data?.education_id || education[editingIndex || 0]?.id,
      };

      if (editingIndex !== null) {
        // Update existing education
        const updatedEducation = [...education];
        updatedEducation[editingIndex] = savedEducation;
        updateFormData({ education: updatedEducation });
      } else {
        // Add new education
        updateFormData({
          education: [
            ...education,
            savedEducation,
          ],
        });
      }

      // Reset form and close modal
      handleEducationFormClose();
    } catch (error: any) {
      console.error('Error posting education details:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });

      // Check if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error('Authentication error detected!');
        console.error('Current token:', token ? `${token.substring(0, 20)}...` : 'None');
        console.error('Token sources:', {
          localStorage: localStorage.getItem('authToken') ? 'Available' : 'Not available',
          formData_access_token: (formData as any)?.access_token ? 'Available' : 'Not available',
          formData_token: (formData as any)?.token ? 'Available' : 'Not available',
          formData_tokenResponse: (formData as any)?.tokenResponse ? 'Available' : 'Not available',
        });
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.message ||
        'Failed to save education details. Please try again.';

      if (setErrors) {
        setErrors({ submit: errorMessage });
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  }, [newEducation, education, updateFormData, handleEducationFormClose, formData, setErrors, editingIndex]);

  const handleTextFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEducation((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setNewEducation((prev) => ({ ...prev, levelOfEducation: value }));
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 4,
            mt: -2,
            color: '#333',
            fontSize: { xs: '1.3rem', md: '1.5rem' },
          }}
        >
          Education Details
        </Typography>
        <Button
          variant="contained"
          startIcon={<Box component="span" sx={{ fontSize: '1.2rem', fontWeight: 700 }}>+</Box>}
          onClick={handleAddEducation}
          sx={{
            bgcolor: '#1976d2',
            color: 'white',
            textTransform: 'none',
            px: 3,
            py: 1,
            mb: 4,
            mt: -2,
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#1565c0',
            },
          }}
        >
          Add Education
        </Button>
      </Box>

      {/* Empty State or Education List */}
      {education.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            mt: -6,
            p: 8,
            textAlign: 'center',
            border: '2px dashed #e0e0e0',
            borderRadius: 2,
            bgcolor: '#fafafa',
          }}
        >
          <SchoolIcon
            sx={{
              fontSize: 80,
              color: '#9e9e9e',
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: '#424242',
            }}
          >
            No Education Added
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#757575',
            }}
          >
            Add your education details to help employers understand your background
          </Typography>
        </Paper>
      ) : (
        <Box>
          {education.map((edu: any, index: number) => (
            <Paper key={index} sx={{ p: 3, mb: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1976d2' }}>
                    {edu.institution || 'Institution Name'}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, color: '#333', fontWeight: 600 }}>
                    {edu.levelOfEducation || 'Level of Education'}
                  </Typography>
                  {edu.fieldOfStudy && (
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      {edu.fieldOfStudy}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Start Date'} - {' '}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'End Date'}
                    </Typography>
                    {edu.gpa && (
                      <Typography variant="body2" sx={{ color: '#666', ml: 2 }}>
                        • GPA: {edu.gpa}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditEducation(index)}
                    sx={{ textTransform: 'none' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveEducation(index)}
                    sx={{ textTransform: 'none' }}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Add Education Modal */}
      <Dialog
        open={showEducationForm}
        onClose={handleEducationFormClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: '1.6rem',
            textAlign: 'center',
            borderBottom: '1px solid #eee',
            pb: 1,
            color: 'primary.main',
            letterSpacing: 0.5,
          }}
        >
          {editingIndex !== null ? 'Edit Education' : 'Add Education'}
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Institution Name *"
                  name="institution"
                  value={newEducation.institution}
                  onChange={handleTextFieldChange}
                  error={!!errors.institution}
                  helperText={errors.institution}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!errors.levelOfEducation}>
                  <InputLabel>Level of Education *</InputLabel>
                  <Select
                    value={newEducation.levelOfEducation}
                    onChange={handleSelectChange}
                    label="Level of Education *"
                  >
                    <MenuItem value="PhD">PhD</MenuItem>
                    <MenuItem value="Masters">Masters</MenuItem>
                    <MenuItem value="Bachelors">Bachelors</MenuItem>
                    <MenuItem value="Diploma">Diploma</MenuItem>
                    <MenuItem value="+12">+12</MenuItem>
                    <MenuItem value="High School">High School</MenuItem>
                  </Select>
                  {errors.levelOfEducation && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {errors.levelOfEducation}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Field of Study *"
                  name="fieldOfStudy"
                  value={newEducation.fieldOfStudy}
                  onChange={handleTextFieldChange}
                  error={!!errors.fieldOfStudy}
                  helperText={errors.fieldOfStudy}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="GPA/Score"
                  name="gpa"
                  value={newEducation.gpa}
                  onChange={handleTextFieldChange}
                  error={!!errors.gpa}
                  helperText={errors.gpa || "Enter GPA (0-4 or 0-10 scale)"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="From Date *"
                  type={location === 'US' ? 'text' : 'date'}
                  placeholder={location === 'US' ? 'MM/DD/YYYY' : ''}
                  name="startDate"
                  value={
                    location === 'US' && newEducation.startDate
                      ? formatDateToMMDDYYYY(newEducation.startDate)
                      : newEducation.startDate
                  }
                  onChange={(e) => {
                    if (location === 'US') {
                      // Allow input in MM/DD/YYYY format
                      let inputValue = e.target.value.replace(/\D/g, '');
                      if (inputValue.length <= 8) {
                        // Format as MM/DD/YYYY while typing
                        let formattedValue = inputValue;
                        if (inputValue.length > 2) {
                          formattedValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
                        }
                        if (inputValue.length > 4) {
                          formattedValue =
                            inputValue.slice(0, 2) +
                            '/' +
                            inputValue.slice(2, 4) +
                            '/' +
                            inputValue.slice(4);
                        }
                        // Convert to YYYY-MM-DD when complete (8 digits)
                        if (inputValue.length === 8) {
                          const month = inputValue.slice(0, 2);
                          const day = inputValue.slice(2, 4);
                          const year = inputValue.slice(4, 8);
                          const dateValue = `${year}-${month}-${day}`;
                          setNewEducation({ ...newEducation, startDate: dateValue });
                        } else {
                          // Store partial input temporarily
                          setNewEducation({ ...newEducation, startDate: formattedValue });
                        }
                      }
                    } else {
                      handleTextFieldChange(e as React.ChangeEvent<HTMLInputElement>);
                    }
                  }}
                  onBlur={(e) => {
                    if (location === 'US') {
                      const currentValue = e.target.value;
                      if (currentValue && currentValue.length === 10 && currentValue.includes('/')) {
                        const [month, day, year] = currentValue.split('/');
                        if (month && day && year && month.length === 2 && day.length === 2 && year.length === 4) {
                          const dateValue = `${year}-${month}-${day}`;
                          setNewEducation({ ...newEducation, startDate: dateValue });
                        }
                      }
                    }
                  }}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  required
                  InputProps={{
                    endAdornment: location === 'US' ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Find the TextField input element
                            const buttonElement = e.currentTarget;
                            const textFieldElement = buttonElement.closest('.MuiTextField-root') as HTMLElement;
                            const inputElement = textFieldElement?.querySelector('input') as HTMLInputElement;

                            if (inputElement) {
                              // Get the position of the input field
                              const rect = inputElement.getBoundingClientRect();

                              // Create a temporary date input
                              const tempInput = document.createElement('input');
                              tempInput.type = 'date';
                              tempInput.style.position = 'fixed';
                              tempInput.style.left = `${rect.left}px`;
                              tempInput.style.top = `${rect.bottom + 5}px`;
                              tempInput.style.width = `${rect.width}px`;
                              tempInput.style.opacity = '0';
                              tempInput.style.pointerEvents = 'none';

                              // Set current value if exists
                              if (newEducation.startDate) {
                                if (newEducation.startDate.includes('-')) {
                                  tempInput.value = newEducation.startDate;
                                } else if (newEducation.startDate.includes('/')) {
                                  const [month, day, year] = newEducation.startDate.split('/');
                                  tempInput.value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                }
                              }

                              // Allow future dates for education (no max restriction)

                              // Handle date selection
                              const handleDateChange = (event: any) => {
                                const selectedDate = event.target.value;
                                if (selectedDate) {
                                  setNewEducation({ ...newEducation, startDate: selectedDate });
                                }
                                // Clean up
                                setTimeout(() => {
                                  tempInput.removeEventListener('change', handleDateChange);
                                  if (tempInput.parentNode) {
                                    tempInput.parentNode.removeChild(tempInput);
                                  }
                                }, 100);
                              };

                              tempInput.addEventListener('change', handleDateChange);
                              document.body.appendChild(tempInput);

                              // Trigger date picker
                              setTimeout(() => {
                                tempInput.focus();
                                if (tempInput.showPicker && typeof tempInput.showPicker === 'function') {
                                  try {
                                    (tempInput.showPicker as () => Promise<void>)().catch(() => {
                                      tempInput.click();
                                    });
                                  } catch {
                                    tempInput.click();
                                  }
                                } else {
                                  tempInput.click();
                                }
                              }, 10);
                            }
                          }}
                          edge="end"
                          sx={{ color: 'action.active' }}
                        >
                          <CalendarTodayIcon />
                        </IconButton>
                      </InputAdornment>
                    ) : undefined,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="To Date *"
                  type={location === 'US' ? 'text' : 'date'}
                  placeholder={location === 'US' ? 'MM/DD/YYYY' : ''}
                  name="endDate"
                  value={
                    location === 'US' && newEducation.endDate
                      ? formatDateToMMDDYYYY(newEducation.endDate)
                      : newEducation.endDate
                  }
                  onChange={(e) => {
                    if (location === 'US') {
                      // Allow input in MM/DD/YYYY format
                      let inputValue = e.target.value.replace(/\D/g, '');
                      if (inputValue.length <= 8) {
                        // Format as MM/DD/YYYY while typing
                        let formattedValue = inputValue;
                        if (inputValue.length > 2) {
                          formattedValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
                        }
                        if (inputValue.length > 4) {
                          formattedValue =
                            inputValue.slice(0, 2) +
                            '/' +
                            inputValue.slice(2, 4) +
                            '/' +
                            inputValue.slice(4);
                        }
                        // Convert to YYYY-MM-DD when complete (8 digits)
                        if (inputValue.length === 8) {
                          const month = inputValue.slice(0, 2);
                          const day = inputValue.slice(2, 4);
                          const year = inputValue.slice(4, 8);
                          const dateValue = `${year}-${month}-${day}`;
                          setNewEducation({ ...newEducation, endDate: dateValue });
                        } else {
                          // Store partial input temporarily
                          setNewEducation({ ...newEducation, endDate: formattedValue });
                        }
                      }
                    } else {
                      handleTextFieldChange(e as React.ChangeEvent<HTMLInputElement>);
                    }
                  }}
                  onBlur={(e) => {
                    if (location === 'US') {
                      const currentValue = e.target.value;
                      if (currentValue && currentValue.length === 10 && currentValue.includes('/')) {
                        const [month, day, year] = currentValue.split('/');
                        if (month && day && year && month.length === 2 && day.length === 2 && year.length === 4) {
                          const dateValue = `${year}-${month}-${day}`;
                          setNewEducation({ ...newEducation, endDate: dateValue });
                        }
                      }
                    }
                  }}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  required
                  InputProps={{
                    endAdornment: location === 'US' ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Find the TextField input element
                            const buttonElement = e.currentTarget;
                            const textFieldElement = buttonElement.closest('.MuiTextField-root') as HTMLElement;
                            const inputElement = textFieldElement?.querySelector('input') as HTMLInputElement;

                            if (inputElement) {
                              // Get the position of the input field
                              const rect = inputElement.getBoundingClientRect();

                              // Create a temporary date input
                              const tempInput = document.createElement('input');
                              tempInput.type = 'date';
                              tempInput.style.position = 'fixed';
                              tempInput.style.left = `${rect.left}px`;
                              tempInput.style.top = `${rect.bottom + 5}px`;
                              tempInput.style.width = `${rect.width}px`;
                              tempInput.style.opacity = '0';
                              tempInput.style.pointerEvents = 'none';

                              // Set current value if exists
                              if (newEducation.endDate) {
                                if (newEducation.endDate.includes('-')) {
                                  tempInput.value = newEducation.endDate;
                                } else if (newEducation.endDate.includes('/')) {
                                  const [month, day, year] = newEducation.endDate.split('/');
                                  tempInput.value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                }
                              }

                              // Set min date to start date if exists
                              if (newEducation.startDate) {
                                if (newEducation.startDate.includes('-')) {
                                  tempInput.min = newEducation.startDate;
                                } else if (newEducation.startDate.includes('/')) {
                                  const [month, day, year] = newEducation.startDate.split('/');
                                  tempInput.min = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                }
                              }

                              // Allow future dates for education (no max restriction)

                              // Handle date selection
                              const handleDateChange = (event: any) => {
                                const selectedDate = event.target.value;
                                if (selectedDate) {
                                  setNewEducation({ ...newEducation, endDate: selectedDate });
                                }
                                // Clean up
                                setTimeout(() => {
                                  tempInput.removeEventListener('change', handleDateChange);
                                  if (tempInput.parentNode) {
                                    tempInput.parentNode.removeChild(tempInput);
                                  }
                                }, 100);
                              };

                              tempInput.addEventListener('change', handleDateChange);
                              document.body.appendChild(tempInput);

                              // Trigger date picker
                              setTimeout(() => {
                                tempInput.focus();
                                if (tempInput.showPicker && typeof tempInput.showPicker === 'function') {
                                  try {
                                    (tempInput.showPicker as () => Promise<void>)().catch(() => {
                                      tempInput.click();
                                    });
                                  } catch {
                                    tempInput.click();
                                  }
                                } else {
                                  tempInput.click();
                                }
                              }, 10);
                            }
                          }}
                          edge="end"
                          sx={{ color: 'action.active' }}
                        >
                          <CalendarTodayIcon />
                        </IconButton>
                      </InputAdornment>
                    ) : undefined,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2, borderTop: '1px solid #eee' }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleEducationFormClose}
            sx={{
              px: 4,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddEducationSubmit}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              px: 4,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 2,
            }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {errors.submit && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.submit}
        </Alert>
      )}
    </Box>
  );
};

export default EducationForm;
