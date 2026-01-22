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
  FormControlLabel,
  Checkbox,
  Paper,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
  Slider,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { StepComponentProps } from '../../types';
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../../../../config/api';
import { isValidEmail, isValidUrl, isValidPhone, isValidLinkedInUrl, isValidDateRange } from '../../../../utils/validation';
import { formatDateToMMDDYYYY } from '../../utils/formatters';

interface Skill {
  name: string;
  experience: string;
  rating: number;
}

interface ExperienceFormData {
  company: string;
  companyName: string;
  clientName: string;
  website: string;
  workLocation: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  skills: Skill[];
  description: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  managerLinkedIn: string;
}

interface CompanyInviteData {
  companyName: string;
  address: string;
  emails: string[];
  phoneNumbers: string[];
  website: string;
  contactPersonName: string;
  contactPersonRole: string;
}

const WorkExperienceForm: React.FC<StepComponentProps> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
  location,
  goToStep,
}) => {
  const [showExperienceWarning, setShowExperienceWarning] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newExperience, setNewExperience] = useState<ExperienceFormData>({
    company: '',
    companyName: '',
    clientName: '',
    website: '',
    workLocation: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    skills: [],
    description: '',
    managerName: '',
    managerEmail: '',
    managerPhone: '',
    managerLinkedIn: '',
  });
  
  // Skills dialog state
  const [showSkillDialog, setShowSkillDialog] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill>({ name: '', experience: '', rating: 5 });
  const [skillInput, setSkillInput] = useState('');
  
  // Job description warning state
  const [showJobDescWarning, setShowJobDescWarning] = useState(false);
  const [jobDescAcknowledged, setJobDescAcknowledged] = useState(false);
  
  // Company invite state
  const [showCompanyInvite, setShowCompanyInvite] = useState(false);
  const [companyInvite, setCompanyInvite] = useState<CompanyInviteData>({
    companyName: '',
    address: '',
    emails: [''],
    phoneNumbers: [''],
    website: '',
    contactPersonName: '',
    contactPersonRole: '',
  });
  const [companySearchResults] = useState<Array<{id: string, name: string}>>([]);

  const experiences = formData.experience || [];

  const handleAddExperience = useCallback(() => {
    setEditingIndex(null);
    setShowExperienceWarning(true);
  }, []);

  const handleEditExperience = useCallback((index: number) => {
    const exp = experiences[index];
    setEditingIndex(index);
    setNewExperience({
      company: exp.company || exp.companyName || '',
      companyName: exp.companyName || exp.company || '',
      clientName: exp.clientName || '',
      website: exp.website || '',
      workLocation: exp.workLocation || '',
      position: exp.position || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.current || false,
      skills: exp.skills || [],
      description: exp.description || '',
      managerName: exp.managerName || '',
      managerEmail: exp.managerEmail || '',
      managerPhone: exp.managerPhone || '',
      managerLinkedIn: exp.managerLinkedIn || '',
    });
    setJobDescAcknowledged(true); // For edit, already acknowledged
    setShowExperienceForm(true);
  }, [experiences]);

  const handleRemoveExperience = useCallback((index: number) => {
    const updatedExperiences = experiences.filter((_: any, i: number) => i !== index);
    updateFormData({ experience: updatedExperiences });
  }, [experiences, updateFormData]);

  const handleWarningAccept = useCallback(() => {
    setShowExperienceWarning(false);
    setShowExperienceForm(true);
  }, []);

  const handleEditWarningAccept = useCallback(() => {
    // For edit, skip warning and go directly to form
    setShowExperienceForm(true);
  }, []);

  const handleExperienceFormClose = useCallback(() => {
    setShowExperienceForm(false);
    setIsSaving(false);
    setEditingIndex(null);
    setJobDescAcknowledged(false);
    setSkillInput('');
    if (setErrors) {
      setErrors({});
    }
    setNewExperience({
      company: '',
      companyName: '',
      clientName: '',
      website: '',
      workLocation: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      skills: [],
      description: '',
      managerName: '',
      managerEmail: '',
      managerPhone: '',
      managerLinkedIn: '',
    });
  }, [setErrors]);

  const handleAddExperienceSubmit = useCallback(async () => {
    // Clear previous errors
    const validationErrors: Record<string, string> = {};

    // Validate required fields
    if (!newExperience.clientName || !newExperience.clientName.trim()) {
      validationErrors.clientName = 'Name is required';
    } else if (newExperience.clientName.trim().length < 2) {
      validationErrors.clientName = 'Name must be at least 2 characters';
    }

    if (!newExperience.companyName || !newExperience.companyName.trim()) {
      validationErrors.companyName = 'Company Name is required';
    } else if (newExperience.companyName.trim().length < 2) {
      validationErrors.companyName = 'Company Name must be at least 2 characters';
    }

    // Validate website URL
    if (!newExperience.website || !newExperience.website.trim()) {
      validationErrors.website = 'Website is required';
    } else if (!isValidUrl(newExperience.website.trim())) {
      validationErrors.website = 'Please enter a valid website URL (e.g., https://www.example.com)';
    }

    // Validate job title
    if (!newExperience.position || !newExperience.position.trim()) {
      validationErrors.position = 'Job Title is required';
    } else if (newExperience.position.trim().length < 2) {
      validationErrors.position = 'Job Title must be at least 2 characters';
    }

    // Validate dates
    if (!newExperience.startDate) {
      validationErrors.startDate = 'Start Date is required';
    }

    // Only validate endDate if NOT currently working
    if (!newExperience.current) {
      if (!newExperience.endDate || !newExperience.endDate.trim()) {
        validationErrors.endDate = 'End Date is required when not currently working';
      } else if (newExperience.startDate) {
        // Validate date range only if both dates exist and not currently working
        if (!isValidDateRange(newExperience.startDate, newExperience.endDate)) {
          validationErrors.endDate = 'End Date must be after or equal to Start Date';
        }
      }
    }

    // Validate job description
    if (!newExperience.description || !newExperience.description.trim()) {
      validationErrors.description = 'Job Description is required';
    } else if (newExperience.description.trim().length < 20) {
      validationErrors.description = 'Job Description must be at least 20 characters';
    }

    // Validate manager name (required)
    if (!newExperience.managerName || !newExperience.managerName.trim()) {
      validationErrors.managerName = 'Manager Name is required';
    } else if (newExperience.managerName.trim().length < 2) {
      validationErrors.managerName = 'Manager Name must be at least 2 characters';
    }

    // Validate manager email (required)
    if (!newExperience.managerEmail || !newExperience.managerEmail.trim()) {
      validationErrors.managerEmail = 'Manager Email is required';
    } else if (!isValidEmail(newExperience.managerEmail.trim())) {
      validationErrors.managerEmail = 'Please enter a valid email address';
    }

    // Validate manager phone (required)
    if (!newExperience.managerPhone || !newExperience.managerPhone.trim()) {
      validationErrors.managerPhone = 'Manager Phone Number is required';
    } else {
      const phoneDigits = newExperience.managerPhone.trim().replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        validationErrors.managerPhone = 'Phone number must be exactly 10 digits';
      } else if (!isValidPhone(newExperience.managerPhone.trim())) {
        validationErrors.managerPhone = 'Please enter a valid phone number';
      }
    }

    // Validate manager LinkedIn (required)
    if (!newExperience.managerLinkedIn || !newExperience.managerLinkedIn.trim()) {
      validationErrors.managerLinkedIn = 'Manager LinkedIn URL is required';
    } else if (!isValidLinkedInUrl(newExperience.managerLinkedIn.trim())) {
      validationErrors.managerLinkedIn = 'Please enter a valid LinkedIn URL (e.g., https://www.linkedin.com/in/username)';
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
      // Prepare API payload for backend
      const apiPayload = {
        title: newExperience.position.trim(),
        company_name: newExperience.companyName.trim(),
        location: newExperience.workLocation.trim(),
        start_date: newExperience.startDate,
        end_date: newExperience.current ? null : (newExperience.endDate || null),
        is_current: newExperience.current,
        description: newExperience.description.trim(),
        skills: newExperience.skills || [],
        is_remote: newExperience.workLocation.toLowerCase().includes('remote'),
      };

      let savedId = editingIndex !== null ? experiences[editingIndex]?.id : `temp-${Date.now()}`;

      // If we have a token, save to backend API
      if (token) {
        console.log('Saving work experience to backend API');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const existingId = editingIndex !== null ? experiences[editingIndex]?.id : null;
        const isExistingBackendRecord = existingId && !String(existingId).startsWith('temp-');

        if (isExistingBackendRecord) {
          // Update existing experience via PATCH
          const updateUrl = getApiUrl(`/users/me/experiences/${existingId}`);
          console.log('Updating experience:', updateUrl);
          const response = await axios.patch(updateUrl, apiPayload, { headers });
          console.log('Experience updated successfully:', response.data);
          savedId = response.data.id || existingId;
        } else {
          // Create new experience via POST
          const createUrl = getApiUrl('/users/me/experiences');
          console.log('Creating new experience:', createUrl);
          const response = await axios.post(createUrl, apiPayload, { headers });
          console.log('Experience created successfully:', response.data);
          savedId = response.data.id;
        }
      } else {
        console.log('No token available, storing experience locally for later sync');
      }

      // Create the experience object to store locally (for UI display)
      const savedExperience = {
          id: savedId,
          company: newExperience.companyName,
          companyName: newExperience.companyName,
          clientName: newExperience.clientName,
          website: newExperience.website,
          workLocation: newExperience.workLocation,
          position: newExperience.position,
          startDate: newExperience.startDate,
          endDate: newExperience.current ? '' : newExperience.endDate,
          current: newExperience.current,
          skills: newExperience.skills,
          description: newExperience.description,
          managerName: newExperience.managerName,
          managerEmail: newExperience.managerEmail,
          managerPhone: newExperience.managerPhone,
          managerLinkedIn: newExperience.managerLinkedIn,
          // Store the payload format for reference
          client_name: newExperience.clientName.trim(),
          company_website: newExperience.website.trim(),
          work_location: newExperience.workLocation.trim(),
          job_title: newExperience.position.trim(),
          from_date: newExperience.startDate,
          to_date: newExperience.current ? '' : (newExperience.endDate || ''),
          job_description: newExperience.description.trim(),
      };

      if (editingIndex !== null) {
        // Update existing experience
        const updatedExperiences = [...experiences];
        updatedExperiences[editingIndex] = savedExperience;
        updateFormData({ experience: updatedExperiences });
      } else {
        // Add new experience
        updateFormData({
          experience: [
            ...experiences,
            savedExperience,
        ],
      });
      }

    // Reset form and close modal
    handleExperienceFormClose();
    } catch (error: any) {
      console.error('Error posting work experience:', error);
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
        'Failed to save work experience. Please try again.';
      
      if (setErrors) {
        setErrors({ submit: errorMessage });
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  }, [newExperience, experiences, updateFormData, handleExperienceFormClose, formData, setErrors, editingIndex]);

  const handleCurrentToggle = useCallback((checked: boolean) => {
    setNewExperience((prev) => ({
      ...prev,
      current: checked,
      endDate: checked ? '' : prev.endDate,
    }));
    // Clear endDate error when current working is enabled
    if (checked && setErrors && errors.endDate) {
      const newErrors = { ...errors };
      delete newErrors.endDate;
      setErrors(newErrors);
    }
  }, [setErrors, errors]);

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
          Work Experience
        </Typography>
        <Button
          variant="contained"
          startIcon={<Box component="span" sx={{ fontSize: '1.2rem', fontWeight: 700 }}>+</Box>}
          onClick={handleAddExperience}
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
          Add Experience
        </Button>
      </Box>

      {/* Empty State or Experience List */}
      {experiences.length === 0 ? (
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
          <WorkIcon
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
            No Work Experience Added
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#757575',
            }}
          >
            Add your work experience to help employers understand your background
          </Typography>
        </Paper>
      ) : (
        <Box>
          {experiences.map((exp: any, index: number) => (
            <Paper key={index} sx={{ p: 3, mb: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#1976d2' }}>
                    {exp.position || 'Job Title'}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 0.5, color: '#333', fontWeight: 600 }}>
                    {exp.companyName || exp.company || 'Company Name'}
                  </Typography>
                  {exp.workLocation && (
                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                      📍 {exp.workLocation}
                    </Typography>
                  )}
                  {exp.website && (
                    <Link href={exp.website} target="_blank" rel="noopener noreferrer" sx={{ color: '#1976d2', textDecoration: 'none' }}>
                      <Typography variant="body2" sx={{ color: '#1976d2', mb: 1 }}>
                        {exp.website}
                      </Typography>
                    </Link>
                  )}
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Start Date'} - {' '}
                    </Typography>
                    {exp.current ? (
                      <Typography variant="body2" sx={{ color: '#138808', fontWeight: 600 }}>
                        Currently Working
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'End Date'}
                      </Typography>
                    )}
                  </Box>
                  {exp.skills && exp.skills.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
                      {exp.skills.slice(0, 5).map((skill: Skill | string, idx: number) => (
                        <Chip 
                          key={idx} 
                          label={typeof skill === 'string' ? skill : `${skill.name} (${skill.rating}/10)`} 
                          size="small" 
                          sx={{ bgcolor: '#e0e7ff', color: '#4338ca', fontSize: '0.7rem' }}
                        />
                      ))}
                      {exp.skills.length > 5 && (
                        <Chip 
                          label={`+${exp.skills.length - 5} more`} 
                          size="small" 
                          sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditExperience(index)}
                    sx={{ textTransform: 'none' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveExperience(index)}
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

      {/* Experience Warning Modal */}
      <Dialog
        open={showExperienceWarning}
        onClose={() => setShowExperienceWarning(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f', fontSize: '1.5rem' }}>
          ⚠️ Important Warning - Read Before Proceeding
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="error">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Resume Upload Not Allowed
              </Typography>
              <Typography variant="caption">
                You will NOT be able to upload any resume later. The job description you provide will serve as your professional profile.
              </Typography>
            </Alert>

            <Alert severity="warning">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Limited Updates & Permanent Job Title
              </Typography>
              <Typography variant="caption">
                • Job description can only be updated once every 30 days<br/>
                • Job title CANNOT be changed after account creation
              </Typography>
            </Alert>

            <Alert severity="info">
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                100% Accuracy Required
              </Typography>
              <Typography variant="body2">
                Provide 100% accurate roles and responsibilities that you EXACTLY performed. 
                Mention only genuine technical skills and tools that you actually used.
              </Typography>
            </Alert>

            <Alert severity="error" sx={{ bgcolor: '#fef2f2' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#991b1b' }}>
                Verification & Legal Consequences
              </Typography>
              <Typography variant="body2" sx={{ color: '#7f1d1d' }}>
                We will verify your information directly with company official authorities.
                Any misrepresentation will result in:
                <br/>• Permanent blocking from the platform
                <br/>• Your photo, name, and reason for blocking will be visible to ALL our partnered clients and vendors
                <br/>• Legal actions will be taken against you
              </Typography>
            </Alert>

            <Divider />

            <Alert severity="warning" sx={{ bgcolor: '#fffbeb' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#92400e' }}>
                Official Manager Email Mandatory
              </Typography>
              <Typography variant="caption" sx={{ color: '#78350f' }}>
                Failing to provide official email of the client reference will NOT allow you to access our platform.
                Personal emails (Gmail, Yahoo, etc.) will not be accepted.
              </Typography>
            </Alert>

            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#64748b', mt: 1, fontWeight: 500 }}>
              By clicking "Agree and Accept", you confirm that all information you provide is 100% accurate and verifiable.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setShowExperienceWarning(false)}
            sx={{ minWidth: 120 }}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleWarningAccept}
            sx={{ minWidth: 120 }}
          >
            Agree and Accept
          </Button>
        </DialogActions>
      </Dialog>

      {/* Experience Form Modal */}
      <Dialog
        open={showExperienceForm}
        onClose={handleExperienceFormClose}
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
          {editingIndex !== null ? 'Edit Work Experience' : 'Add Work Experience'}
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ pt: 1 }}>
            {/* --- Top Section --- */}
            <Grid container spacing={3}>
              {/* Column 1 */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Name *"
                  value={newExperience.clientName}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, clientName: e.target.value })
                  }
                  error={!!errors.clientName}
                  helperText={errors.clientName}
                  required
                />
              </Grid>

              {/* Column 2 - Company Name with Invite */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Company Name *"
                  value={newExperience.companyName}
                  onChange={(e) => {
                    setNewExperience({ ...newExperience, companyName: e.target.value });
                  }}
                  error={!!errors.companyName}
                  helperText={
                    errors.companyName || (
                      companySearchResults.length === 0 && newExperience.companyName.length >= 2 ? (
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <span>Company not found.</span>
                          <Button 
                            size="small" 
                            onClick={() => {
                              setCompanyInvite(prev => ({...prev, companyName: newExperience.companyName}));
                              setShowCompanyInvite(true);
                            }}
                            sx={{ textTransform: 'none', p: 0, minWidth: 'auto', fontSize: '0.75rem' }}
                          >
                            Invite company
                          </Button>
                        </Box>
                      ) : ''
                    )
                  }
                  required
                />
              </Grid>

              {/* Work Location */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Work Location *"
                  placeholder="City, State, Country"
                  value={newExperience.workLocation}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, workLocation: e.target.value })
                  }
                  error={!!errors.workLocation}
                  helperText={errors.workLocation}
                  required
                />
              </Grid>

              {/* Column 3 */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Website of the Company *"
                  type="url"
                  placeholder="https://www.example.com"
                  value={newExperience.website}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, website: e.target.value })
                  }
                  error={!!errors.website}
                  helperText={errors.website}
                  required
                />
              </Grid>

              {/* Column 4 - Job Title with Warning */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Job Title *"
                  value={newExperience.position}
                  onChange={(e) =>
                    setNewExperience({ ...newExperience, position: e.target.value })
                  }
                  error={!!errors.position}
                  helperText={errors.position || "⚠️ Cannot be changed after account creation"}
                  required
                />
              </Grid>

              {/* --- Dates Row --- */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="From Date *"
                  type={location === 'US' ? 'text' : 'date'}
                  placeholder={location === 'US' ? 'MM/DD/YYYY' : ''}
                  value={
                    location === 'US' && newExperience.startDate
                      ? formatDateToMMDDYYYY(newExperience.startDate)
                      : newExperience.startDate
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
                          setNewExperience({ ...newExperience, startDate: dateValue });
                        } else {
                          // Store partial input temporarily
                          setNewExperience({ ...newExperience, startDate: formattedValue });
                        }
                      }
                    } else {
                      setNewExperience({ ...newExperience, startDate: e.target.value });
                    }
                  }}
                  onBlur={(e) => {
                    if (location === 'US') {
                      const currentValue = e.target.value;
                      if (currentValue && currentValue.length === 10 && currentValue.includes('/')) {
                        const [month, day, year] = currentValue.split('/');
                        if (month && day && year && month.length === 2 && day.length === 2 && year.length === 4) {
                          const dateValue = `${year}-${month}-${day}`;
                          setNewExperience({ ...newExperience, startDate: dateValue });
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
                              if (newExperience.startDate) {
                                if (newExperience.startDate.includes('-')) {
                                  tempInput.value = newExperience.startDate;
                                } else if (newExperience.startDate.includes('/')) {
                                  const [month, day, year] = newExperience.startDate.split('/');
                                  tempInput.value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                }
                              }
                              
                              tempInput.max = new Date().toISOString().split('T')[0];
                              
                              // Handle date selection
                              const handleDateChange = (event: any) => {
                                const selectedDate = event.target.value;
                                if (selectedDate) {
                                  setNewExperience({ ...newExperience, startDate: selectedDate });
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

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={newExperience.current ? 'To Date (Present)' : 'To Date *'}
                  type={location === 'US' ? 'text' : 'date'}
                  placeholder={location === 'US' ? 'MM/DD/YYYY' : ''}
                  value={
                    location === 'US' && newExperience.endDate
                      ? formatDateToMMDDYYYY(newExperience.endDate)
                      : newExperience.endDate
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
                          setNewExperience({ ...newExperience, endDate: dateValue });
                        } else {
                          // Store partial input temporarily
                          setNewExperience({ ...newExperience, endDate: formattedValue });
                        }
                      }
                    } else {
                      setNewExperience({ ...newExperience, endDate: e.target.value });
                    }
                  }}
                  onBlur={(e) => {
                    if (location === 'US') {
                      const currentValue = e.target.value;
                      if (currentValue && currentValue.length === 10 && currentValue.includes('/')) {
                        const [month, day, year] = currentValue.split('/');
                        if (month && day && year && month.length === 2 && day.length === 2 && year.length === 4) {
                          const dateValue = `${year}-${month}-${day}`;
                          setNewExperience({ ...newExperience, endDate: dateValue });
                        }
                      }
                    }
                  }}
                  InputLabelProps={{ shrink: true }}
                  disabled={newExperience.current}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  required={!newExperience.current}
                  InputProps={{
                    endAdornment: location === 'US' ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!newExperience.current) {
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
                                if (newExperience.endDate) {
                                  if (newExperience.endDate.includes('-')) {
                                    tempInput.value = newExperience.endDate;
                                  } else if (newExperience.endDate.includes('/')) {
                                    const [month, day, year] = newExperience.endDate.split('/');
                                    tempInput.value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                  }
                                }
                                
                                tempInput.max = new Date().toISOString().split('T')[0];
                                
                                // Set min date to start date
                                if (newExperience.startDate) {
                                  if (newExperience.startDate.includes('-')) {
                                    tempInput.min = newExperience.startDate;
                                  } else if (newExperience.startDate.includes('/')) {
                                    const [month, day, year] = newExperience.startDate.split('/');
                                    tempInput.min = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                  }
                                }
                                
                                // Handle date selection
                                const handleDateChange = (event: any) => {
                                  const selectedDate = event.target.value;
                                  if (selectedDate) {
                                    setNewExperience({ ...newExperience, endDate: selectedDate });
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
                            }
                          }}
                          edge="end"
                          disabled={newExperience.current}
                          sx={{ color: 'action.active' }}
                        >
                          <CalendarTodayIcon />
                        </IconButton>
                      </InputAdornment>
                    ) : undefined,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newExperience.current}
                      onChange={(e) => handleCurrentToggle(e.target.checked)}
                    />
                  }
                  label="Currently Working Here"
                />
              </Grid>

              {/* Skills Section */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Skills *
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setCurrentSkill({ name: '', experience: '', rating: 5 });
                      setShowSkillDialog(true);
                    }}
                    sx={{ textTransform: 'none' }}
                  >
                    Add Skill
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Add each skill with your experience and self-rating
                </Typography>
                {newExperience.skills.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                    {newExperience.skills.map((skill, idx) => (
                      <Paper
                        key={idx}
                        elevation={0}
                        sx={{ 
                          p: 2, 
                          bgcolor: '#f8fafc', 
                          border: '1px solid #e2e8f0',
                          borderRadius: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                {skill.name}
                              </Typography>
                              <Chip 
                                label={`${skill.rating}/10`} 
                                size="small" 
                                sx={{ 
                                  bgcolor: skill.rating >= 8 ? '#dcfce7' : skill.rating >= 5 ? '#fef3c7' : '#fee2e2',
                                  color: skill.rating >= 8 ? '#166534' : skill.rating >= 5 ? '#92400e' : '#991b1b',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                              {skill.experience}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setNewExperience({
                                ...newExperience,
                                skills: newExperience.skills.filter((_, i) => i !== idx)
                              });
                            }}
                            sx={{ color: '#ef4444' }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Grid>

              {/* --- Description (Full Width) with Copy-Paste Disabled --- */}
              <Grid item xs={12}>
                <Box
                  onClick={() => {
                    if (!jobDescAcknowledged) {
                      setShowJobDescWarning(true);
                    }
                  }}
                  sx={{ cursor: !jobDescAcknowledged ? 'pointer' : 'default' }}
                >
                  <TextField
                    fullWidth
                    label="Job Description *"
                    multiline
                    rows={4}
                    value={newExperience.description}
                    onChange={(e) => {
                      if (jobDescAcknowledged) {
                        setNewExperience({ ...newExperience, description: e.target.value });
                      }
                    }}
                    onPaste={(e) => e.preventDefault()}
                    onDrop={(e) => e.preventDefault()}
                    onDragOver={(e) => e.preventDefault()}
                    placeholder={jobDescAcknowledged ? "Describe your exact roles and responsibilities..." : "Click here to acknowledge terms and start typing..."}
                    error={!!errors.description}
                    helperText={errors.description || "Copy-paste disabled. Type manually. Can only be updated once every 30 days."}
                    required
                    inputProps={{
                      readOnly: !jobDescAcknowledged,
                      autoComplete: 'off',
                      'data-gramm': 'false',
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: !jobDescAcknowledged ? '#f1f5f9' : 'white',
                      }
                    }}
                  />
                </Box>
              </Grid>

              {/* --- Manager Info Header --- */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: 'primary.main',
                    mt: 2,
                    mb: 1,
                    borderBottom: '1px dashed #ccc',
                    pb: 0.5,
                  }}
                >
                  Manager / Supervisor Details
                </Box>
              </Grid>

              {/* --- Manager Info (3 Columns) --- */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Manager Name*"
                  value={newExperience.managerName}
                  onChange={(e) => {
                    setNewExperience({ ...newExperience, managerName: e.target.value });
                    // Clear error when user starts typing
                    if (errors.managerName && setErrors) {
                      const newErrors = { ...errors };
                      delete newErrors.managerName;
                      setErrors(newErrors);
                    }
                  }}
                  error={!!errors.managerName}
                  helperText={errors.managerName}
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Manager Domain Email*"
                  type="email"
                  placeholder="manager@company.com"
                  value={newExperience.managerEmail}
                  onChange={(e) => {
                    setNewExperience({ ...newExperience, managerEmail: e.target.value });
                    // Clear error when user starts typing
                    if (errors.managerEmail && setErrors) {
                      const newErrors = { ...errors };
                      delete newErrors.managerEmail;
                      setErrors(newErrors);
                    }
                  }}
                  error={!!errors.managerEmail}
                  helperText={errors.managerEmail}
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Manager Phone Number*"
                  type="tel"
                  value={newExperience.managerPhone}
                  onChange={(e) => {
                    // Only allow digits and limit to 10 digits
                    const inputValue = e.target.value.replace(/\D/g, '');
                    if (inputValue.length <= 10) {
                      setNewExperience({ ...newExperience, managerPhone: inputValue });
                      // Clear error when user starts typing
                      if (errors.managerPhone && setErrors) {
                        const newErrors = { ...errors };
                        delete newErrors.managerPhone;
                        setErrors(newErrors);
                      }
                    }
                  }}
                  inputProps={{
                    maxLength: 10,
                    pattern: '[0-9]{10}',
                  }}
                  error={!!errors.managerPhone}
                  helperText={errors.managerPhone || "Fake entries are flagged. Enter exactly 10 digits."}
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Manager LinkedIn URL*"
                  type="url"
                  placeholder="https://www.linkedin.com/in/example"
                  value={newExperience.managerLinkedIn}
                  onChange={(e) => {
                    setNewExperience({ ...newExperience, managerLinkedIn: e.target.value });
                    // Clear error when user starts typing
                    if (errors.managerLinkedIn && setErrors) {
                      const newErrors = { ...errors };
                      delete newErrors.managerLinkedIn;
                      setErrors(newErrors);
                    }
                  }}
                  required
                  error={!!errors.managerLinkedIn}
                  helperText={errors.managerLinkedIn || "It should be a legitimate LinkedIn profile."}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        {/* --- Footer Buttons --- */}
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2, borderTop: '1px solid #eee' }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleExperienceFormClose}
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
            onClick={handleAddExperienceSubmit}
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

      {/* Job Description Warning Dialog */}
      <Dialog open={showJobDescWarning} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f', fontSize: '1.3rem' }}>
          ⚠️ Important Notice - Please Read Carefully
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="error">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Resume Upload Not Allowed
              </Typography>
              <Typography variant="caption">
                You cannot upload any resume later. This job description will serve as your professional profile.
              </Typography>
            </Alert>
            
            <Alert severity="warning">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Limited Updates
              </Typography>
              <Typography variant="caption">
                • Job description can only be updated once every 30 days<br/>
                • Job title CANNOT be changed after account creation
              </Typography>
            </Alert>
            
            <Alert severity="info">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Accuracy Required
              </Typography>
              <Typography variant="caption">
                Provide 100% accurate roles and responsibilities that you EXACTLY performed. 
                Mention only genuine technical skills and tools.
              </Typography>
            </Alert>
            
            <Alert severity="error" sx={{ bgcolor: '#fef2f2' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#991b1b' }}>
                Verification & Consequences
              </Typography>
              <Typography variant="caption" sx={{ color: '#7f1d1d' }}>
                We will verify your information directly with company official authorities. 
                Any misrepresentation is considered a crime and will result in:
                <br/>• Permanent blocking from the platform
                <br/>• Your profile and reason for blocking will be visible to all our customers
              </Typography>
            </Alert>
            
            <Divider />
            
            <Alert severity="warning" sx={{ bgcolor: '#fffbeb' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#92400e' }}>
                Official Email Required
              </Typography>
              <Typography variant="caption" sx={{ color: '#78350f' }}>
                Failing to provide official email of the client reference will not allow you to access our platform.
              </Typography>
            </Alert>
            
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#64748b', mt: 1 }}>
              This job description will act as your resume for anyone viewing your profile. 
              Fill in exactly what you did - nothing more, nothing less.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              setJobDescAcknowledged(true);
              setShowJobDescWarning(false);
            }}
          >
            I Understand & Agree
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Skill Dialog */}
      <Dialog open={showSkillDialog} onClose={() => setShowSkillDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Add Skill Details
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>
            Provide details about your skill, what exactly you did with it, and rate yourself.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skill Name *"
                placeholder="e.g., React, Python, AWS, SQL"
                value={currentSkill.name}
                onChange={(e) => setCurrentSkill(prev => ({...prev, name: e.target.value}))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="What exactly did you do with this skill? *"
                multiline
                rows={4}
                placeholder="Describe specific projects, tasks, and responsibilities where you used this skill..."
                value={currentSkill.experience}
                onChange={(e) => setCurrentSkill(prev => ({...prev, experience: e.target.value}))}
                onPaste={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                helperText="Copy-paste disabled. Type manually. Be specific about what you did."
                inputProps={{
                  autoComplete: 'off',
                  'data-gramm': 'false',
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Rate yourself (1-10) *
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
                <Typography variant="body2" color="text.secondary">1</Typography>
                <Slider
                  value={currentSkill.rating}
                  onChange={(_, value) => setCurrentSkill(prev => ({...prev, rating: value as number}))}
                  min={1}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="on"
                  sx={{
                    '& .MuiSlider-valueLabel': {
                      bgcolor: currentSkill.rating >= 8 ? '#16a34a' : currentSkill.rating >= 5 ? '#eab308' : '#dc2626',
                    }
                  }}
                />
                <Typography variant="body2" color="text.secondary">10</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">Beginner</Typography>
                <Typography variant="caption" color="text.secondary">Intermediate</Typography>
                <Typography variant="caption" color="text.secondary">Expert</Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowSkillDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              if (currentSkill.name.trim() && currentSkill.experience.trim()) {
                setNewExperience(prev => ({
                  ...prev,
                  skills: [...prev.skills, {
                    name: currentSkill.name.trim(),
                    experience: currentSkill.experience.trim(),
                    rating: currentSkill.rating
                  }]
                }));
                setCurrentSkill({ name: '', experience: '', rating: 5 });
                setShowSkillDialog(false);
              }
            }}
            disabled={!currentSkill.name.trim() || !currentSkill.experience.trim()}
          >
            Add Skill
          </Button>
        </DialogActions>
      </Dialog>

      {/* Company Invite Dialog */}
      <Dialog open={showCompanyInvite} onClose={() => setShowCompanyInvite(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Invite Your Company to VerTechie
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>
            Your company is not registered with us. You can invite them to create an account, 
            or proceed without inviting by clicking "Skip".
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Full Name *"
                value={companyInvite.companyName}
                onChange={(e) => setCompanyInvite(prev => ({...prev, companyName: e.target.value}))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Address *"
                multiline
                rows={2}
                value={companyInvite.address}
                onChange={(e) => setCompanyInvite(prev => ({...prev, address: e.target.value}))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Website"
                placeholder="https://company.com"
                value={companyInvite.website}
                onChange={(e) => setCompanyInvite(prev => ({...prev, website: e.target.value}))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Person Name *"
                value={companyInvite.contactPersonName}
                onChange={(e) => setCompanyInvite(prev => ({...prev, contactPersonName: e.target.value}))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Person Role"
                placeholder="e.g., HR Manager"
                value={companyInvite.contactPersonRole}
                onChange={(e) => setCompanyInvite(prev => ({...prev, contactPersonRole: e.target.value}))}
              />
            </Grid>
            
            {/* Email Fields */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Company Email(s)</Typography>
              {companyInvite.emails.map((email, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="company@example.com"
                    value={email}
                    onChange={(e) => {
                      const newEmails = [...companyInvite.emails];
                      newEmails[idx] = e.target.value;
                      setCompanyInvite(prev => ({...prev, emails: newEmails}));
                    }}
                  />
                  {companyInvite.emails.length > 1 && (
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => {
                        setCompanyInvite(prev => ({
                          ...prev, 
                          emails: prev.emails.filter((_, i) => i !== idx)
                        }));
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
              <Button 
                size="small" 
                onClick={() => setCompanyInvite(prev => ({...prev, emails: [...prev.emails, '']}))}
              >
                + Add Another Email
              </Button>
            </Grid>
            
            {/* Phone Fields */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Company Phone(s)</Typography>
              {companyInvite.phoneNumbers.map((phone, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => {
                      const newPhones = [...companyInvite.phoneNumbers];
                      newPhones[idx] = e.target.value;
                      setCompanyInvite(prev => ({...prev, phoneNumbers: newPhones}));
                    }}
                  />
                  {companyInvite.phoneNumbers.length > 1 && (
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => {
                        setCompanyInvite(prev => ({
                          ...prev, 
                          phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== idx)
                        }));
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
              <Button 
                size="small" 
                onClick={() => setCompanyInvite(prev => ({...prev, phoneNumbers: [...prev.phoneNumbers, '']}))}
              >
                + Add Another Phone
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowCompanyInvite(false)}>
            Skip - Proceed Without Inviting
          </Button>
          <Button 
            variant="contained" 
            onClick={async () => {
              try {
                const token = localStorage.getItem('authToken') || (formData as any)?.access_token;
                const response = await axios.post(
                  getApiUrl(API_ENDPOINTS.COMPANY_INVITES),
                  {
                    company_name: companyInvite.companyName,
                    address: companyInvite.address,
                    emails: companyInvite.emails.filter(e => e.trim()),
                    phone_numbers: companyInvite.phoneNumbers.filter(p => p.trim()),
                    website: companyInvite.website,
                    contact_person_name: companyInvite.contactPersonName,
                    contact_person_role: companyInvite.contactPersonRole,
                  },
                  {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                  }
                );
                console.log('Company invite sent:', response.data);
                setShowCompanyInvite(false);
                // Optionally show success message
              } catch (error) {
                console.error('Error sending company invite:', error);
              }
            }}
            disabled={!companyInvite.companyName || !companyInvite.contactPersonName}
          >
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default WorkExperienceForm;
