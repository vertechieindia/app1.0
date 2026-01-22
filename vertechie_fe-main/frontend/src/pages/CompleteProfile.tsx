/**
 * CompleteProfile - Page for users to complete their profile
 * Uses the same workflow and forms as the signup flow
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

// Import existing signup flow components
import WorkExperienceForm from '../components/signup/steps/WorkExperience/WorkExperienceForm';
import EducationForm from '../components/signup/steps/EducationDetails/EducationForm';
import { getApiUrl } from '../config/api';

// Styled Components
const PageContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
}));

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSection = searchParams.get('section') || 'experience';

  const [tabValue, setTabValue] = useState(initialSection === 'education' ? 1 : 0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Form data state (same structure as signup flow)
  const [formData, setFormData] = useState<any>({
    experience: [],
    education: [],
    country: 'India', // Default to India for date formats etc.
  });

  // Fetch existing data from backend AND merge with sessionStorage
  useEffect(() => {
    const fetchExistingData = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.warn('No auth token available, loading from sessionStorage only');
        loadFromSessionStorage();
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      try {
        // Fetch experiences and educations from backend in parallel
        const [experiencesRes, educationsRes] = await Promise.all([
          axios.get(getApiUrl('/users/me/experiences'), { headers }).catch(err => {
            console.warn('Error fetching experiences:', err);
            return { data: [] };
          }),
          axios.get(getApiUrl('/users/me/educations'), { headers }).catch(err => {
            console.warn('Error fetching educations:', err);
            return { data: [] };
          }),
        ]);

        // Transform backend data to frontend format
        const backendExperiences = (experiencesRes.data || []).map((exp: any) => ({
          id: exp.id,
          clientName: exp.client_name || '',
          companyName: exp.company_name || '',
          workLocation: exp.work_location || '',
          website: exp.website || '',
          workEmail: exp.work_email || '',
          roleTitle: exp.role_title || '',
          startDate: exp.start_date || '',
          endDate: exp.end_date || '',
          isCurrentlyWorking: exp.is_currently_working || false,
          responsibilities: exp.responsibilities || '',
          skills: exp.skills || [],
        }));

        const backendEducations = (educationsRes.data || []).map((edu: any) => ({
          id: edu.id,
          institution: edu.school_name || '',
          levelOfEducation: edu.degree || '',
          fieldOfStudy: edu.field_of_study || '',
          startDate: edu.start_year ? `${edu.start_year}-01-01` : '',
          endDate: edu.end_year ? `${edu.end_year}-01-01` : '',
          gpa: edu.grade || '',
        }));

        // Load from sessionStorage for any additional data
        let sessionExperiences: any[] = [];
        let sessionEducations: any[] = [];
        let country = 'India';

        const storedData = sessionStorage.getItem('signupFormData');
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData);
            sessionExperiences = parsed.experience || [];
            sessionEducations = parsed.education || [];
            country = parsed.country || 'India';
          } catch (error) {
            console.error('Error parsing sessionStorage:', error);
          }
        }

        // Also check userData for country
        const userData = localStorage.getItem('userData');
        if (userData) {
          try {
            const parsed = JSON.parse(userData);
            if (parsed.country) {
              country = parsed.country;
            }
          } catch (error) {
            console.error('Error parsing userData:', error);
          }
        }

        // Merge: Backend data takes priority, add any session-only items (with temp ids)
        const mergedExperiences = [...backendExperiences];
        sessionExperiences.forEach((sessExp: any) => {
          // Only add if it doesn't already exist (by id or if it's a temp item)
          const existsInBackend = backendExperiences.some((beExp: any) => 
            beExp.id === sessExp.id || 
            (beExp.companyName === sessExp.companyName && beExp.roleTitle === sessExp.roleTitle)
          );
          if (!existsInBackend && String(sessExp.id).startsWith('temp-')) {
            mergedExperiences.push(sessExp);
          }
        });

        const mergedEducations = [...backendEducations];
        sessionEducations.forEach((sessEdu: any) => {
          const existsInBackend = backendEducations.some((beEdu: any) =>
            beEdu.id === sessEdu.id ||
            (beEdu.institution === sessEdu.institution && beEdu.levelOfEducation === sessEdu.levelOfEducation)
          );
          if (!existsInBackend && String(sessEdu.id).startsWith('temp-')) {
            mergedEducations.push(sessEdu);
          }
        });

        setFormData({
          experience: mergedExperiences,
          education: mergedEducations,
          country: country,
        });

        // Update sessionStorage with merged data
        sessionStorage.setItem('signupFormData', JSON.stringify({
          experience: mergedExperiences,
          education: mergedEducations,
          country: country,
        }));

      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Fall back to sessionStorage
        loadFromSessionStorage();
      } finally {
        setLoading(false);
      }
    };

    const loadFromSessionStorage = () => {
      const storedData = sessionStorage.getItem('signupFormData');
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          setFormData((prev: any) => ({
            ...prev,
            experience: parsed.experience || [],
            education: parsed.education || [],
            country: parsed.country || 'India',
          }));
        } catch (error) {
          console.error('Error loading stored data:', error);
        }
      }

      // Also check userData for country
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          if (parsed.country) {
            setFormData((prev: any) => ({
              ...prev,
              country: parsed.country,
            }));
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };

    fetchExistingData();
  }, []);

  // Update form data function (matches signup flow interface)
  const updateFormData = useCallback((updates: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev, ...updates };
      
      // Save to sessionStorage
      try {
        const storedData = sessionStorage.getItem('signupFormData');
        const parsed = storedData ? JSON.parse(storedData) : {};
        const merged = { ...parsed, ...newData };
        sessionStorage.setItem('signupFormData', JSON.stringify(merged));
      } catch (error) {
        console.error('Error saving to sessionStorage:', error);
      }
      
      return newData;
    });
  }, []);

  // Refresh data from backend
  const refreshData = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const [experiencesRes, educationsRes] = await Promise.all([
        axios.get(getApiUrl('/users/me/experiences'), { headers }).catch(() => ({ data: [] })),
        axios.get(getApiUrl('/users/me/educations'), { headers }).catch(() => ({ data: [] })),
      ]);

      const experiences = (experiencesRes.data || []).map((exp: any) => ({
        id: exp.id,
        clientName: exp.client_name || '',
        companyName: exp.company_name || '',
        workLocation: exp.work_location || '',
        website: exp.website || '',
        workEmail: exp.work_email || '',
        roleTitle: exp.role_title || '',
        startDate: exp.start_date || '',
        endDate: exp.end_date || '',
        isCurrentlyWorking: exp.is_currently_working || false,
        responsibilities: exp.responsibilities || '',
        skills: exp.skills || [],
      }));

      const educations = (educationsRes.data || []).map((edu: any) => ({
        id: edu.id,
        institution: edu.school_name || '',
        levelOfEducation: edu.degree || '',
        fieldOfStudy: edu.field_of_study || '',
        startDate: edu.start_year ? `${edu.start_year}-01-01` : '',
        endDate: edu.end_year ? `${edu.end_year}-01-01` : '',
        gpa: edu.grade || '',
      }));

      setFormData((prev: any) => ({
        ...prev,
        experience: experiences,
        education: educations,
      }));

      setSnackbar({ open: true, message: 'Data refreshed!', severity: 'success' });
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, []);

  // Save profile - refresh from backend to confirm saves
  const handleSaveProfile = useCallback(async () => {
    try {
      await refreshData();
      setSnackbar({ open: true, message: 'Profile saved successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setSnackbar({ open: true, message: 'Error saving profile', severity: 'error' });
    }
  }, [refreshData]);

  const handleGoBack = () => {
    navigate('/status/processing');
  };

  // Show loading state
  if (loading) {
    return (
      <PageContainer maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  // Determine location for form formatting
  const location = formData.country === 'US' ? 'US' : 'IN';

  return (
    <PageContainer maxWidth="lg">
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={handleGoBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight={700}>
          Complete Your Profile
        </Typography>
      </Box>

      <StyledPaper>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab 
            icon={<WorkIcon />} 
            label="Work Experience" 
            iconPosition="start"
          />
          <Tab 
            icon={<SchoolIcon />} 
            label="Education" 
            iconPosition="start"
          />
        </Tabs>

        {/* Work Experience Tab - Using existing signup component */}
        <TabPanel value={tabValue} index={0}>
          <WorkExperienceForm
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            setErrors={setErrors}
            location={location as any}
            goToStep={() => {}}
            onNext={() => {}}
            onBack={() => {}}
          />
        </TabPanel>

        {/* Education Tab - Using existing signup component */}
        <TabPanel value={tabValue} index={1}>
          <EducationForm
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            setErrors={setErrors}
            location={location as any}
            goToStep={() => {}}
            onNext={() => {}}
            onBack={() => {}}
          />
        </TabPanel>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
          <Button variant="outlined" onClick={handleGoBack}>
            Back to Status
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveProfile}
          >
            Save Profile
          </Button>
        </Box>
      </StyledPaper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default CompleteProfile;
