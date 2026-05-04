import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  Autocomplete,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { StepComponentProps } from '../../types';
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../../../../config/api';
import {
  isValidDateRange,
  isValidEducationScore,
  isValidEmail,
  EducationScoreType,
} from '../../../../utils/validation';
import { formatDateToMMDDYYYY } from '../../utils/formatters';

interface EducationFormData {
  institution: string;
  levelOfEducation: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  scoreType: EducationScoreType;
  scoreValue: string;
  gpa?: string;
}

interface SchoolInviteFormData {
  institutionName: string;
  email: string;
  address: string;
  phone: string;
}

/** School from API (list_schools) for autocomplete */
interface SchoolOption {
  id: string;
  name: string;
}
/** Special option to invite an institution not on the platform */
interface InviteSchoolOption {
  __invite: true;
  name: string;
}
type InstitutionOption = SchoolOption | InviteSchoolOption;
function isInviteOption(opt: InstitutionOption): opt is InviteSchoolOption {
  return (opt as InviteSchoolOption).__invite === true;
}

const EducationForm: React.FC<StepComponentProps> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
  location,
  goToStep,
}) => {
  const todayIso = new Date().toISOString().split('T')[0];
  const toISODate = (value: string): string | null => {
    if (!value) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [mm, dd, yyyy] = value.split('/');
      return `${yyyy}-${mm}-${dd}`;
    }
    return null;
  };

  const [showEducationForm, setShowEducationForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newEducation, setNewEducation] = useState<EducationFormData>({
    institution: '',
    levelOfEducation: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    scoreType: 'CGPA',
    scoreValue: '',
    gpa: '',
  });

  // Institution autocomplete: search registered schools, or "Invite this school"
  const [institutionOptions, setInstitutionOptions] = useState<SchoolOption[]>([]);
  const [institutionLoading, setInstitutionLoading] = useState(false);
  const [institutionInputValue, setInstitutionInputValue] = useState('');
  const institutionSearchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showSchoolInvite, setShowSchoolInvite] = useState(false);
  const [schoolInviteSending, setSchoolInviteSending] = useState(false);
  const [schoolInvite, setSchoolInvite] = useState<SchoolInviteFormData>({
    institutionName: '',
    email: '',
    address: '',
    phone: '',
  });
  const [schoolInviteErrors, setSchoolInviteErrors] = useState<Record<string, string>>({});

  const education = formData.education || [];

  const handleAddEducation = useCallback(() => {
    setEditingIndex(null);
    setInstitutionInputValue('');
    setShowEducationForm(true);
  }, []);

  const handleEditEducation = useCallback((index: number) => {
    const edu = education[index];
    setEditingIndex(index);
    const inst = edu.institution || '';
    setNewEducation({
      institution: inst,
      levelOfEducation: edu.levelOfEducation || '',
      fieldOfStudy: edu.fieldOfStudy || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      scoreType: edu.scoreType || 'CGPA',
      scoreValue: edu.scoreValue || edu.gpa || '',
      gpa: edu.gpa || edu.scoreValue || '',
    });
    setInstitutionInputValue(inst);
    setShowEducationForm(true);
  }, [education]);

  const handleRemoveEducation = useCallback((index: number) => {
    const updatedEducation = education.filter((_: any, i: number) => i !== index);
    updateFormData({ education: updatedEducation });
  }, [education, updateFormData]);

  // Debounced fetch of schools for institution autocomplete
  useEffect(() => {
    const query = (institutionInputValue || '').trim();
    if (query.length < 2) {
      setInstitutionOptions([]);
      return;
    }
    if (institutionSearchDebounceRef.current) {
      clearTimeout(institutionSearchDebounceRef.current);
    }
    institutionSearchDebounceRef.current = setTimeout(async () => {
      setInstitutionLoading(true);
      try {
        const url = `${getApiUrl(API_ENDPOINTS.SCHOOLS)}?search=${encodeURIComponent(query)}&limit=10`;
        const token = localStorage.getItem('authToken') || (formData as any)?.access_token;
        const res = await axios.get<SchoolOption[]>(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const list = Array.isArray(res.data) ? res.data : [];
        setInstitutionOptions(list.map((s: { id: string; name: string }) => ({ id: s.id, name: s.name })));
      } catch {
        setInstitutionOptions([]);
      } finally {
        setInstitutionLoading(false);
      }
    }, 300);
    return () => {
      if (institutionSearchDebounceRef.current) {
        clearTimeout(institutionSearchDebounceRef.current);
        institutionSearchDebounceRef.current = null;
      }
    };
  }, [institutionInputValue, formData]);

  const handleEducationFormClose = useCallback(() => {
    setShowEducationForm(false);
    setIsSaving(false);
    setEditingIndex(null);
    setInstitutionInputValue('');
    if (setErrors) {
      setErrors({});
    }
    setNewEducation({
      institution: '',
      levelOfEducation: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      scoreType: 'CGPA',
      scoreValue: '',
      gpa: '',
    });
  }, [setErrors]);

  const handleSchoolInviteClose = useCallback(() => {
    setShowSchoolInvite(false);
    setSchoolInviteSending(false);
    setSchoolInviteErrors({});
  }, []);

  const handleSchoolInviteSend = useCallback(async () => {
    const name = schoolInvite.institutionName.trim();
    const email = schoolInvite.email.trim();
    const address = schoolInvite.address.trim();
    const phone = schoolInvite.phone.trim();
    const phoneDigits = phone.replace(/\D/g, '');
    const nextErrors: Record<string, string> = {};

    if (!name) nextErrors.institutionName = 'School name is required';
    else if (name.length < 2) nextErrors.institutionName = 'School name must be at least 2 characters';
    if (!email) nextErrors.email = 'School email is required';
    else if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address';
    if (!address) nextErrors.address = 'School address is required';
    else if (address.length < 5) nextErrors.address = 'Address must be at least 5 characters';
    if (!phone) nextErrors.phone = 'School phone is required';
    else if (phoneDigits.length !== 10) nextErrors.phone = 'Enter a valid 10-digit phone number';

    setSchoolInviteErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSchoolInviteSending(true);
    try {
      const token = localStorage.getItem('authToken') || (formData as any)?.access_token;
      await axios.post(
        getApiUrl(API_ENDPOINTS.SCHOOL_INVITE_REQUEST),
        {
          institution_name: name,
          email,
          address,
          phone: phoneDigits,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      setNewEducation((prev) => ({ ...prev, institution: name }));
      setInstitutionInputValue(name);
      handleSchoolInviteClose();
    } catch (e) {
      console.error('Institution invite request failed:', e);
      setSchoolInviteErrors((prev) => ({
        ...prev,
        submit: 'Failed to send school invite. Please try again.',
      }));
    } finally {
      setSchoolInviteSending(false);
    }
  }, [schoolInvite, formData, handleSchoolInviteClose]);

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

    const startIso = toISODate(newEducation.startDate);
    const endIso = toISODate(newEducation.endDate);
    if (startIso && startIso > todayIso) {
      validationErrors.startDate = 'Start Date cannot be in the future';
    }
    if (endIso && endIso > todayIso) {
      validationErrors.endDate = 'End Date cannot be in the future';
    }

    // Validate date range
    if (newEducation.startDate && newEducation.endDate) {
      if (!isValidDateRange(newEducation.startDate, newEducation.endDate)) {
        validationErrors.endDate = 'End Date must be after or equal to Start Date';
      }
    }

    // Validate score type/value
    if (!newEducation.scoreType) {
      validationErrors.scoreType = 'Score Type is required';
    }

    if (!newEducation.scoreValue || !newEducation.scoreValue.trim()) {
      validationErrors.scoreValue = 'Score Value is required';
    } else if (!isValidEducationScore(newEducation.scoreType, newEducation.scoreValue.trim())) {
      if (newEducation.scoreType === 'CGPA') {
        validationErrors.scoreValue = 'Enter a valid CGPA between 0 and 10';
      } else if (newEducation.scoreType === 'Percentage') {
        validationErrors.scoreValue = 'Enter a valid Percentage between 0 and 100';
      } else {
        validationErrors.scoreValue = 'Enter a valid Grade (e.g., A+, A, B1, O)';
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
        grade: (newEducation.scoreValue || '').trim() || null,
        score_type: newEducation.scoreType.toLowerCase(),
        score_value: (newEducation.scoreValue || '').trim() || null,
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
        const updateUrl = `${apiUrl}/${educationId}`;
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
        scoreType: newEducation.scoreType,
        scoreValue: newEducation.scoreValue,
        gpa: newEducation.scoreValue,
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

  const handleLevelChange = useCallback((e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setNewEducation((prev) => ({ ...prev, levelOfEducation: value }));
  }, []);

  const handleScoreTypeChange = useCallback((e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    const scoreType = value as EducationScoreType;
    setNewEducation((prev) => ({ ...prev, scoreType, scoreValue: '' }));
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
                    {(edu.scoreValue || edu.gpa) && (
                      <Typography variant="body2" sx={{ color: '#666', ml: 2 }}>
                        • {edu.scoreType || 'Score'}: {edu.scoreValue || edu.gpa}
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
        <DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} md={6}>
                <Autocomplete<InstitutionOption, boolean, boolean, boolean>
                  freeSolo
                  fullWidth
                  loading={institutionLoading}
                  inputValue={institutionInputValue}
                  onInputChange={(_, value) => {
                    setInstitutionInputValue(value || '');
                    setNewEducation((prev) => ({ ...prev, institution: value || '' }));
                  }}
                  value={institutionOptions.find((s) => s.name === newEducation.institution) ?? (newEducation.institution || null)}
                  onChange={(_, newValue) => {
                    if (typeof newValue === 'string') {
                      setNewEducation((prev) => ({ ...prev, institution: newValue }));
                      return;
                    }
                    if (!newValue || Array.isArray(newValue)) {
                      setNewEducation((prev) => ({ ...prev, institution: '' }));
                      return;
                    }
                    const opt = newValue as InstitutionOption;
                    if (isInviteOption(opt)) {
                      const name = opt.name.trim();
                      if (!name) return;
                      setSchoolInvite((prev) => ({
                        ...prev,
                        institutionName: name,
                      }));
                      setSchoolInviteErrors({});
                      setShowSchoolInvite(true);
                      return;
                    }
                    setNewEducation((prev) => ({ ...prev, institution: opt.name }));
                    setInstitutionInputValue(opt.name);
                  }}
                  options={(() => {
                    const trimmed = institutionInputValue.trim();
                    const hasExactMatch = institutionOptions.some(
                      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
                    );
                    const options: InstitutionOption[] = [...institutionOptions];
                    if (trimmed.length >= 2 && !hasExactMatch) {
                      options.push({ __invite: true, name: trimmed });
                    }
                    return options;
                  })()}
                  getOptionLabel={(opt: InstitutionOption | string) => (typeof opt === 'string' ? opt : opt.name)}
                  renderOption={(props, opt: InstitutionOption) => {
                    if (isInviteOption(opt)) {
                      return (
                        <li {...props} key="__invite">
                          <AddIcon sx={{ mr: 1, fontSize: 20 }} />
                          Invite this school to the platform — &quot;{opt.name}&quot;
                        </li>
                      );
                    }
                    return (
                      <li {...props} key={opt.id}>
                        {opt.name}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Institution Name *"
                      error={!!errors.institution}
                      helperText={errors.institution}
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!errors.levelOfEducation}>
                  <InputLabel id="signup-education-level-label">Level of Education *</InputLabel>
                  <Select
                    labelId="signup-education-level-label"
                    id="signup-education-level"
                    value={newEducation.levelOfEducation}
                    onChange={handleLevelChange}
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
                <FormControl fullWidth required error={!!errors.scoreType}>
                  <InputLabel id="signup-education-score-type-label">Score Type *</InputLabel>
                  <Select
                    labelId="signup-education-score-type-label"
                    id="signup-education-score-type"
                    value={newEducation.scoreType}
                    onChange={handleScoreTypeChange}
                    label="Score Type *"
                  >
                    <MenuItem value="CGPA">CGPA</MenuItem>
                    <MenuItem value="Percentage">Percentage</MenuItem>
                    <MenuItem value="Grade">Grade</MenuItem>
                  </Select>
                  {errors.scoreType && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {errors.scoreType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={newEducation.scoreType === 'Grade' ? 'Grade *' : `${newEducation.scoreType} *`}
                  name="scoreValue"
                  value={newEducation.scoreValue}
                  onChange={handleTextFieldChange}
                  error={!!errors.scoreValue}
                  helperText={
                    errors.scoreValue ||
                    (newEducation.scoreType === 'CGPA'
                      ? 'Enter CGPA between 0 and 10'
                      : newEducation.scoreType === 'Percentage'
                        ? 'Enter Percentage between 0 and 100'
                        : 'Enter Grade (e.g., A+, A, B1, O)')
                  }
                  inputProps={
                    newEducation.scoreType === 'Grade'
                      ? { maxLength: 5 }
                      : { inputMode: 'decimal' }
                  }
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
                  inputProps={location !== 'US' ? { max: todayIso } : undefined}
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

                              tempInput.max = todayIso;

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
                  inputProps={location !== 'US' ? { max: todayIso } : undefined}
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

                              tempInput.max = todayIso;

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

      <Dialog
        open={showSchoolInvite}
        onClose={handleSchoolInviteClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Invite Your School to VerTechie
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>
            Your school is not registered with us. Enter school details and we will send an invite email.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="School Name *"
                value={schoolInvite.institutionName}
                onChange={(e) => {
                  setSchoolInvite((prev) => ({ ...prev, institutionName: e.target.value }));
                  if (schoolInviteErrors.institutionName) {
                    setSchoolInviteErrors((prev) => ({ ...prev, institutionName: '' }));
                  }
                }}
                error={!!schoolInviteErrors.institutionName}
                helperText={schoolInviteErrors.institutionName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="School Address *"
                multiline
                rows={2}
                value={schoolInvite.address}
                onChange={(e) => {
                  setSchoolInvite((prev) => ({ ...prev, address: e.target.value }));
                  if (schoolInviteErrors.address) {
                    setSchoolInviteErrors((prev) => ({ ...prev, address: '' }));
                  }
                }}
                error={!!schoolInviteErrors.address}
                helperText={schoolInviteErrors.address}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="School Email *"
                type="email"
                placeholder="school@example.com"
                value={schoolInvite.email}
                onChange={(e) => {
                  setSchoolInvite((prev) => ({ ...prev, email: e.target.value }));
                  if (schoolInviteErrors.email) {
                    setSchoolInviteErrors((prev) => ({ ...prev, email: '' }));
                  }
                }}
                error={!!schoolInviteErrors.email}
                helperText={schoolInviteErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="School Phone *"
                placeholder="9876543210"
                value={schoolInvite.phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setSchoolInvite((prev) => ({ ...prev, phone: digits }));
                  if (schoolInviteErrors.phone) {
                    setSchoolInviteErrors((prev) => ({ ...prev, phone: '' }));
                  }
                }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
                error={!!schoolInviteErrors.phone}
                helperText={schoolInviteErrors.phone}
              />
            </Grid>
          </Grid>
          {schoolInviteErrors.submit && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {schoolInviteErrors.submit}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleSchoolInviteClose}>
            Skip - Proceed Without Inviting
          </Button>
          <Button
            variant="contained"
            onClick={handleSchoolInviteSend}
            disabled={schoolInviteSending}
          >
            {schoolInviteSending ? 'Sending...' : 'Send Invite'}
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
