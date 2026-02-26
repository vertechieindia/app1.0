import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Alert,
  Button,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { StepComponentProps } from '../../types';
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../../../../config/api';
import { getPrimaryColor, getLightColor } from '../../utils/colors';

const SchoolDetailsForm: React.FC<StepComponentProps> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
  role,
  location,
}) => {
  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [address, setAddress] = useState('');
  const [about, setAbout] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Get location from props or formData
  const currentLocation = location || formData.country || (formData.location as string) || 'US';
  const isIndia = currentLocation === 'IN' || (currentLocation as string).toUpperCase() === 'INDIA' || (currentLocation as string).toLowerCase() === 'india';

  // Load school details from formData
  const schoolDetails = formData.schoolDetails !== null && formData.schoolDetails !== undefined
    ? formData.schoolDetails
    : (formData.schoolName && formData.schoolName.trim())
      ? {
          schoolName: formData.schoolName,
          establishedYear: formData.establishedYear || '',
          address: formData.address || '',
          about: formData.about || '',
          id: formData.schoolId || formData.school_id,
        }
      : null;

  // Fetch school details from API if not in formData - only once
  useEffect(() => {
    const fetchSchoolDetails = async () => {
      // Don't fetch if schoolDetails was explicitly set to null AND all fields are empty (user removed it)
      if (schoolDetails === null && !formData.schoolName && !formData.schoolId && !formData.school_id) {
        const userId = formData.userId || formData.user_id;
        if (!userId) {
          // No user ID yet, skip fetching
          if (formData.schoolDetails === undefined) {
            updateFormData({
              schoolDetails: null,
            });
          }
          return;
        }

        try {
          const token = 
            localStorage.getItem('authToken') ||
            formData.token ||
            formData.access_token ||
            formData.access ||
            (formData.tokenResponse as any)?.access ||
            (formData.tokenResponse as any)?.access_token ||
            (formData.tokenResponse as any)?.token;

          const apiUrl = getApiUrl(API_ENDPOINTS.SCHOOL_SIGNUP);
          const response = await axios.get(`${apiUrl}?user=${userId}`, {
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          });

          if (response.data && (response.data.length > 0 || response.data.id)) {
            const data = Array.isArray(response.data) ? response.data[0] : response.data;
            // Handle both est_year (India) and established_year (US)
            // Extract year from date string (YYYY-MM-DD) or use as-is if it's just a year
            let yearValue = data.est_year || data.established_year || data.establishedYear || '';
            if (yearValue && typeof yearValue === 'string' && yearValue.includes('-')) {
              // If it's a date string like "2021-01-01", extract the year
              yearValue = yearValue.split('-')[0];
            }
            updateFormData({
              schoolDetails: {
                schoolName: data.school_name || data.schoolName || '',
                establishedYear: yearValue,
                address: data.address || '',
                about: data.about || '',
                id: data.id,
              },
              schoolName: data.school_name || data.schoolName || '',
              establishedYear: yearValue,
              address: data.address || '',
              about: data.about || '',
              schoolId: data.id,
              school_id: data.id,
            });
          } else {
            // No school details found, set to null
            if (formData.schoolDetails === undefined) {
              updateFormData({
                schoolDetails: null,
              });
            }
          }
        } catch (error: any) {
          console.error('Error fetching school details:', error);
          // If 404 or no data, set to null
          if (formData.schoolDetails === undefined) {
            updateFormData({
              schoolDetails: null,
            });
          }
        }
      }
    };

    fetchSchoolDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.userId, formData.user_id]);

  // Initialize form when school details exist
  useEffect(() => {
    if (schoolDetails && !showSchoolForm) {
      setSchoolName(schoolDetails.schoolName || schoolDetails.school_name || '');
      // Handle both est_year (India) and established_year (US)
      // Extract year from date string (YYYY-MM-DD) or use as-is if it's just a year
      let yearValue = schoolDetails.establishedYear || schoolDetails.est_year || schoolDetails.established_year || '';
      if (yearValue && typeof yearValue === 'string' && yearValue.includes('-')) {
        // If it's a date string like "2021-01-01", extract the year
        yearValue = yearValue.split('-')[0];
      }
      setEstablishedYear(yearValue);
      setAddress(schoolDetails.address || '');
      setAbout(schoolDetails.about || '');
    }
  }, [schoolDetails, showSchoolForm]);

  // Get colors based on signup type and location
  const signupType = (role as 'techie' | 'hr' | 'company' | 'school') || 'school';
  const locationForColors = (currentLocation as 'US' | 'IN') || 'US';
  const primaryColor = getPrimaryColor(signupType, locationForColors);
  const lightColor = getLightColor(signupType, locationForColors);
  const borderColor = primaryColor;

  const handleAddSchool = useCallback(() => {
    setIsEditing(false);
    setSchoolName('');
    setEstablishedYear('');
    setAddress('');
    setAbout('');
    setShowSchoolForm(true);
  }, []);

  const handleEditSchool = useCallback(() => {
    if (schoolDetails) {
      setIsEditing(true);
      setSchoolName(schoolDetails.schoolName || schoolDetails.school_name || '');
      // Handle both est_year (India) and established_year (US)
      // Extract year from date string (YYYY-MM-DD) or use as-is if it's just a year
      let yearValue = schoolDetails.establishedYear || schoolDetails.est_year || schoolDetails.established_year || '';
      if (yearValue && typeof yearValue === 'string' && yearValue.includes('-')) {
        // If it's a date string like "2021-01-01", extract the year
        yearValue = yearValue.split('-')[0];
      }
      setEstablishedYear(yearValue);
      setAddress(schoolDetails.address || '');
      setAbout(schoolDetails.about || '');
      setShowSchoolForm(true);
    }
  }, [schoolDetails]);

  const handleRemoveSchool = useCallback(async () => {
    const schoolId = formData.schoolId || formData.school_id || schoolDetails?.id;
    
    // Clear local form state
    setSchoolName('');
    setEstablishedYear('');
    setAddress('');
    setAbout('');
    
    if (!schoolId) {
      // Just remove from formData if no ID
      const clearData: any = {
        schoolName: '',
        establishedYear: '',
        address: '',
        about: '',
        schoolDetails: null,
        schoolId: null,
        school_id: null,
      };
      updateFormData(clearData);
      return;
    }

    // Delete from API
    try {
      const token = 
        localStorage.getItem('authToken') ||
        formData.token ||
        formData.access_token ||
        formData.access ||
        (formData.tokenResponse as any)?.access ||
        (formData.tokenResponse as any)?.access_token ||
        (formData.tokenResponse as any)?.token;

      const apiUrl = getApiUrl(API_ENDPOINTS.SCHOOL_SIGNUP);
      await axios.delete(`${apiUrl}${schoolId}/`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      // Remove from formData
      const clearData: any = {
        schoolName: '',
        establishedYear: '',
        address: '',
        about: '',
        schoolDetails: null,
        schoolId: null,
        school_id: null,
      };
      updateFormData(clearData);
    } catch (error: any) {
      console.error('Error deleting school details:', error);
      // Still remove from formData even if API call fails
      const clearData: any = {
        schoolName: '',
        establishedYear: '',
        address: '',
        about: '',
        schoolDetails: null,
        schoolId: null,
        school_id: null,
      };
      updateFormData(clearData);
    }
  }, [formData, schoolDetails, updateFormData]);

  const handleSchoolFormClose = useCallback(() => {
    setShowSchoolForm(false);
    setIsEditing(false);
    setIsSaving(false);
    if (setErrors) {
      setErrors({});
    }
  }, [setErrors]);

  const handleChange = useCallback((field: string, value: string) => {
    if (field === 'schoolName') {
      setSchoolName(value);
    } else if (field === 'establishedYear') {
      setEstablishedYear(value);
    } else if (field === 'address') {
      setAddress(value);
    } else if (field === 'about') {
      setAbout(value);
    }

    // Clear error when user starts typing
    if (errors[field] && setErrors) {
      setErrors({ ...errors, [field]: '' });
    }
  }, [errors, setErrors]);

  const handleSave = useCallback(async () => {
    const validationErrors: Record<string, string> = {};

    // Validate School Name
    if (!schoolName || !schoolName.trim()) {
      validationErrors.schoolName = 'School Name is required';
    } else if (schoolName.trim().length < 2) {
      validationErrors.schoolName = 'School Name must be at least 2 characters';
    } else if (schoolName.trim().length > 200) {
      validationErrors.schoolName = 'School Name must not exceed 200 characters';
    }

    // Validate Established Year
    if (!establishedYear || !establishedYear.trim()) {
      validationErrors.establishedYear = 'Established Year is required';
    } else {
      const yearValue = establishedYear.trim();
      const year = parseInt(yearValue, 10);
      const currentYear = new Date().getFullYear();
      
      if (isNaN(year)) {
        validationErrors.establishedYear = 'Established Year must be a valid number';
      } else if (year < 1800) {
        validationErrors.establishedYear = 'Established Year must be at least 1800';
      } else if (year > currentYear) {
        validationErrors.establishedYear = `Established Year cannot be greater than ${currentYear}`;
      } else if (yearValue.length !== 4) {
        validationErrors.establishedYear = 'Established Year must be 4 digits (YYYY)';
      }
    }

    // Validate Address
    if (!address || !address.trim()) {
      validationErrors.address = 'Address is required';
    } else {
      const addressValue = address.trim();
      if (addressValue.length < 10) {
        validationErrors.address = 'Address must be at least 10 characters';
      } else if (addressValue.length > 500) {
        validationErrors.address = 'Address must not exceed 500 characters';
      }
    }

    // Validate About
    if (!about || !about.trim()) {
      validationErrors.about = 'About School is required';
    } else if (about.trim().length < 10) {
      validationErrors.about = 'About School must be at least 10 characters';
    } else if (about.trim().length > 500) {
      validationErrors.about = 'About School must not exceed 500 characters';
    }

    // If there are validation errors, display them
    if (Object.keys(validationErrors).length > 0) {
      if (setErrors) {
        setErrors(validationErrors);
      }
      return;
    }

    // Start saving
    setIsSaving(true);
    if (setErrors) {
      setErrors({});
    }

    try {
      // Get authentication token from localStorage or formData
      const token = 
        localStorage.getItem('authToken') ||
        formData.token ||
        formData.access_token ||
        formData.access ||
        (formData.tokenResponse as any)?.access ||
        (formData.tokenResponse as any)?.access_token ||
        (formData.tokenResponse as any)?.token;

      console.log('Saving school details to API...');
      console.log('Token source:', token ? 'Found' : 'Not found');

      // Get user ID from formData (stored from token response)
      const userId = 
        formData.userId ||
        formData.user_id ||
        (formData.tokenResponse as any)?.user_data?.id ||
        (formData.tokenResponse as any)?.user_id ||
        (formData.tokenResponse as any)?.user?.id ||
        null;

      console.log('User ID source:', userId ? `Found (${userId})` : 'Not found');

      if (!userId) {
        const errorMsg = 'User ID not found. Please complete registration first.';
        console.error(errorMsg);
        if (setErrors) {
          setErrors({ submit: errorMsg });
        }
        setIsSaving(false);
        return;
      }

      // Prepare API payload
      const payload: any = {
        user: userId, // User ID is required
        school_name: schoolName.trim(),
        address: address.trim(),
        about: about.trim(),
      };

      // Convert year to date format (YYYY-MM-DD) - e.g., 2021 -> "2021-01-01"
      const yearValue = parseInt(establishedYear.trim(), 10);
      const yearDateString = `${yearValue}-01-01`;

      // Use est_year for India, established_year for US
      if (isIndia) {
        payload.est_year = yearDateString;
      } else {
        payload.established_year = yearDateString;
      }

      console.log('School details payload:', payload);

      // Check if school details already exist (for editing)
      const schoolId = formData.schoolId || formData.school_id || null;
      const isEdit = !!schoolId;

      console.log('School operation:', isEdit ? 'PATCH (Update)' : 'POST (Create)');
      console.log('School ID:', schoolId || 'Not found (will create new)');

      // Call school API
      const apiUrl = getApiUrl(API_ENDPOINTS.SCHOOL_SIGNUP);
      let response;
      
      if (isEdit && schoolId) {
        // Update existing school details using PATCH
        const updateUrl = `${apiUrl}${schoolId}/`;
        console.log('Patching school details:', updateUrl);
        response = await axios.patch(updateUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        console.log('School details updated successfully:', response.status, response.data);
      } else {
        // Create new school details using POST
        console.log('Posting new school details:', apiUrl);
        response = await axios.post(apiUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        console.log('School details saved successfully:', response.status, response.data);
      }

      // Store school ID if returned from API (for future edits)
      const returnedSchoolId = response.data?.id || response.data?.school_id || schoolId;
      
      // Save data to formData
      const savedSchoolDetails: any = {
        schoolName: schoolName.trim(),
        establishedYear: establishedYear.trim(),
        address: address.trim(),
        about: about.trim(),
        id: returnedSchoolId || schoolId,
      };

      const updateData: any = {
        schoolName: schoolName.trim(),
        establishedYear: establishedYear.trim(),
        address: address.trim(),
        about: about.trim(),
        schoolDetails: savedSchoolDetails,
        schoolId: returnedSchoolId || schoolId,
        school_id: returnedSchoolId || schoolId,
      };

      updateFormData(updateData);

      // Clear errors on success and close form
      if (setErrors) {
        setErrors({});
      }
      
      // Close form after successful save
      handleSchoolFormClose();
    } catch (error: any) {
      console.error('Error saving school details:', error);
      const errorMessage = 
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to save school details. Please try again.';
      
      if (setErrors) {
        setErrors({ submit: errorMessage });
      }
    } finally {
      setIsSaving(false);
    }
  }, [schoolName, establishedYear, address, about, setErrors, updateFormData, formData, handleSchoolFormClose]);

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
          School Details
        </Typography>
        {!schoolDetails && (
          <Button
            variant="contained"
            startIcon={<Box component="span" sx={{ fontSize: '1.2rem', fontWeight: 700 }}>+</Box>}
            onClick={handleAddSchool}
            sx={{
              bgcolor: primaryColor,
              color: 'white',
              textTransform: 'none',
              px: 3,
              py: 1,
              mb: 4,
              mt: -2,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: isIndia ? '#6a1b9a' : '#7b1fa2',
              },
            }}
          >
            Add School
          </Button>
        )}
      </Box>

      {/* Empty State or School Details List */}
      {!schoolDetails ? (
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
            No School Details Added
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#757575',
            }}
          >
            Add your school details to complete your profile
          </Typography>
        </Paper>
      ) : (
        <Box>
          <Paper sx={{ p: 3, mb: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: primaryColor }}>
                  {schoolDetails.schoolName || schoolDetails.school_name || 'School Name'}
                </Typography>
                {schoolDetails.establishedYear && (
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                    Established Year: {schoolDetails.establishedYear || schoolDetails.established_year}
                  </Typography>
                )}
                {schoolDetails.address && (
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                    Address: {schoolDetails.address}
                  </Typography>
                )}
                {schoolDetails.about && (
                  <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                    {schoolDetails.about}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={handleEditSchool}
                  sx={{ textTransform: 'none' }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={handleRemoveSchool}
                  sx={{ textTransform: 'none' }}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {/* School Details Form Modal */}
      <Dialog
        open={showSchoolForm}
        onClose={handleSchoolFormClose}
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
          {isEditing ? 'Edit School Details' : 'Add School Details'}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {isIndia ? (
              // India layout: Row 1 - School Name & Established Year side by side
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="School Name *"
                    value={schoolName}
                    onChange={(e) => handleChange('schoolName', e.target.value)}
                    error={!!errors.schoolName}
                    helperText={errors.schoolName}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Established Year *"
                    type="text"
                    value={establishedYear}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, ''); // Only digits
                      if (value.length > 4) {
                        value = value.substring(0, 4);
                      }
                      handleChange('establishedYear', value);
                    }}
                    placeholder="YYYY"
                    error={!!errors.establishedYear}
                    helperText={errors.establishedYear || 'Format: YYYY (e.g., 2020)'}
                    required
                  />
                </Grid>

                {/* Row 2 - Address full width */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address *"
                    multiline
                    rows={3}
                    value={address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    error={!!errors.address}
                    helperText={errors.address || 'School registered address'}
                    required
                  />
                </Grid>

                {/* Row 3 - About full width */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="About School *"
                    multiline
                    rows={4}
                    value={about}
                    onChange={(e) => handleChange('about', e.target.value)}
                    error={!!errors.about}
                    helperText={errors.about || 'Brief description of the school'}
                    required
                  />
                </Grid>
              </>
            ) : (
              // US layout: Keep current structure
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="School Name *"
                    value={schoolName}
                    onChange={(e) => handleChange('schoolName', e.target.value)}
                    error={!!errors.schoolName}
                    helperText={errors.schoolName}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Established Year *"
                    type="text"
                    value={establishedYear}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, ''); // Only digits
                      if (value.length > 4) {
                        value = value.substring(0, 4);
                      }
                      handleChange('establishedYear', value);
                    }}
                    placeholder="YYYY"
                    error={!!errors.establishedYear}
                    helperText={errors.establishedYear || 'Format: YYYY (e.g., 2020)'}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address *"
                    multiline
                    rows={3}
                    value={address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    error={!!errors.address}
                    helperText={errors.address || 'School registered address'}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="About School *"
                    multiline
                    rows={4}
                    value={about}
                    onChange={(e) => handleChange('about', e.target.value)}
                    error={!!errors.about}
                    helperText={errors.about || 'Brief description of the school'}
                    required
                  />
                </Grid>
              </>
            )}
          </Grid>

          {errors.submit && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.submit}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2, borderTop: '1px solid #eee' }}>
          <Button
            onClick={handleSchoolFormClose}
            disabled={isSaving}
            sx={{
              px: 4,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isSaving}
            sx={{
              px: 4,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: primaryColor,
              '&:hover': {
                backgroundColor: isIndia ? '#6a1b9a' : '#7b1fa2',
              },
            }}
          >
            {isSaving ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Saving...
              </>
            ) : (
              isEditing ? 'Update' : 'Save'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SchoolDetailsForm;

