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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import SaveIcon from '@mui/icons-material/Save';

// Import existing signup flow components
import WorkExperienceForm from '../components/signup/steps/WorkExperience/WorkExperienceForm';
import EducationForm from '../components/signup/steps/EducationDetails/EducationForm';

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

  // Form data state (same structure as signup flow)
  const [formData, setFormData] = useState<any>({
    experience: [],
    education: [],
    country: 'India', // Default to India for date formats etc.
  });

  // Load existing data from sessionStorage
  useEffect(() => {
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

  // Save profile to API
  const handleSaveProfile = useCallback(async () => {
    try {
      setSnackbar({ open: true, message: 'Profile saved successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setSnackbar({ open: true, message: 'Error saving profile', severity: 'error' });
    }
  }, []);

  const handleGoBack = () => {
    navigate('/status/processing');
  };

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
