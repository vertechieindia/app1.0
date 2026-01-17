import React, { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  IconButton,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Snackbar,
  Slider,
  Paper,
  Tooltip,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  PersonAdd,
  Close,
  Visibility,
  VisibilityOff,
  Engineering,
  SupervisorAccount,
  Business,
  School,
  Add,
  Delete,
  Edit,
  Work,
  SchoolOutlined,
  CheckCircle,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { getApiUrl, API_ENDPOINTS } from '../../config/api';
import AddressAutocomplete from '../ui/AddressAutocomplete';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedAvatar = styled(Avatar)({
  transition: 'all 0.3s ease',
});

const AnimatedButton = styled(Button)({
  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
  borderRadius: '12px',
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5)',
  },
  '&:disabled': {
    background: '#e2e8f0',
    boxShadow: 'none',
  },
});

// Country configuration
const COUNTRY_CONFIG = {
  USA: {
    label: 'USA',
    idLabel: 'SSN (Last 4 digits)',
    idPlaceholder: 'Last 4 digits of SSN',
    idMaxLength: 4,
    dateFormat: 'MM/DD/YYYY',
  },
  India: {
    label: 'India',
    idLabel: 'PAN Card Number',
    idPlaceholder: 'Enter PAN number',
    idMaxLength: 10,
    dateFormat: 'DD/MM/YYYY',
  },
  UK: {
    label: 'United Kingdom',
    idLabel: 'National Insurance Number (NINO)',
    idPlaceholder: 'e.g., QQ 12 34 56 C',
    idMaxLength: 13,
    dateFormat: 'DD/MM/YYYY',
  },
  Canada: {
    label: 'Canada',
    idLabel: 'Social Insurance Number (SIN)',
    idPlaceholder: 'XXX-XXX-XXX',
    idMaxLength: 11,
    dateFormat: 'YYYY-MM-DD',
  },
  Germany: {
    label: 'Germany',
    idLabel: 'Sozialversicherungsnummer',
    idPlaceholder: '12 digit number',
    idMaxLength: 12,
    dateFormat: 'DD.MM.YYYY',
  },
  Switzerland: {
    label: 'Switzerland',
    idLabel: 'AHV-Nummer',
    idPlaceholder: '756.XXXX.XXXX.XX',
    idMaxLength: 16,
    dateFormat: 'DD.MM.YYYY',
  },
  China: {
    label: 'China',
    idLabel: 'Resident Identity Card Number',
    idPlaceholder: '18 digit ID number',
    idMaxLength: 18,
    dateFormat: 'YYYY-MM-DD',
  },
};

// Work authorization options by country
const WORK_AUTH_OPTIONS: Record<string, string[]> = {
  USA: [
    'US Citizen', 
    'Green Card', 
    'GC EAD',
    'H1B', 
    'H4 EAD', 
    'L1', 
    'L2 EAD',
    'J1', 
    'J2 EAD',
    'O1',
    'E1',
    'E2',
    'E3',
    'TN',
    'OPT EAD', 
    'STEM OPT EAD', 
    'CPT',
    'F1',
    'EB-1/2/3 Pending',
    'Asylum EAD',
    'Other'
  ],
  India: ['Indian Citizen', 'OCI', 'PIO', 'Work Permit', 'Other'],
  UK: ['British Citizen', 'Settled Status', 'Pre-Settled Status', 'Tier 2 Visa', 'Skilled Worker Visa', 'Graduate Visa', 'Other'],
  Canada: ['Canadian Citizen', 'Permanent Resident', 'Work Permit', 'PGWP', 'LMIA', 'Other'],
  Germany: ['German Citizen', 'EU Citizen', 'Blue Card', 'Work Visa', 'Job Seeker Visa', 'Other'],
  Switzerland: ['Swiss Citizen', 'C Permit', 'B Permit', 'L Permit', 'G Permit', 'Other'],
  China: ['Chinese Citizen', 'Permanent Resident', 'Work Visa (Z Visa)', 'Other'],
};

// Education levels
const EDUCATION_LEVELS = [
  { value: 'PHD', label: 'PhD' },
  { value: 'MASTERS', label: 'Masters' },
  { value: 'BACHELORS', label: 'Bachelors' },
  { value: 'DIPLOMA', label: 'Diploma' },
  { value: 'INTERMEDIATE', label: '+12 (Intermediate)' },
  { value: 'HIGHSCHOOL', label: 'High School' },
];

// Role configuration
const ROLE_CONFIG = [
  { value: 'techie', label: 'Tech Professional', icon: <Engineering />, color: '#3b82f6', bg: '#dbeafe' },
  { value: 'hr', label: 'Hiring Manager', icon: <SupervisorAccount />, color: '#8b5cf6', bg: '#f3e8ff' },
  { value: 'company', label: 'Company', icon: <Business />, color: '#10b981', bg: '#dcfce7' },
  { value: 'school', label: 'Educational Institution', icon: <School />, color: '#f59e0b', bg: '#fef3c7' },
];

interface Skill {
  name: string;
  experience: string;
  rating: number;
}

interface Experience {
  id: string;
  client_name: string;
  company_website: string;
  work_location: string;
  job_title: string;
  from_date: string;
  to_date: string;
  skills: Skill[];
  job_description: string;
  manager_name: string;
  manager_email: string;
  manager_phone: string;
  manager_linkedin: string;
}

interface CompanyInvite {
  company_name: string;
  address: string;
  emails: string[];
  phone_numbers: string[];
  website: string;
  contact_person_name: string;
  contact_person_role: string;
}

interface ProjectTeamMember {
  name: string;
  email: string;
  role: string;
}

interface Project {
  id: string;
  project_summary: string;
  tech_stack: string[];
  team_size: number;
  team_members: ProjectTeamMember[];
  git_url: string;
}

interface Education {
  id: string;
  institution_name: string;
  level_of_education: string;
  field_of_study: string;
  from_date: string;
  to_date: string;
  gpa_score: string;
  projects: Project[];
}

interface AdminCreateUserWizardProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const AdminCreateUserWizard: React.FC<AdminCreateUserWizardProps> = ({
  open,
  onClose,
  onSuccess,
  onError,
}) => {
  // Step management
  const [activeStep, setActiveStep] = useState(0);
  
  // Role selection
  const [selectedRole, setSelectedRole] = useState<'techie' | 'hr' | 'company' | 'school'>('techie');
  
  // Form data
  const [formData, setFormData] = useState({
    // Basic info
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    dob: '',
    country: 'USA',
    gov_id: '',
    mobile_number: '',
    address: '',
    // Techie specific
    work_authorization: '',
    profile: '',
    // HR specific
    company_name: '',
    company_email: '',
    company_website: '',
    // Company specific
    ein: '',
    cin: '',
    account_number: '',
    reg_state: '',
    started_date: '',
    about: '',
    // School specific
    school_name: '',
    est_year: '',
  });
  
  // Experience and Education
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });
  
  // Company search and invite state
  const [companySearchResults, setCompanySearchResults] = useState<Array<{id: string, name: string}>>([]);
  const [showCompanyInviteForm, setShowCompanyInviteForm] = useState(false);
  const [companyInvite, setCompanyInvite] = useState<CompanyInvite>({
    company_name: '',
    address: '',
    emails: [''],
    phone_numbers: [''],
    website: '',
    contact_person_name: '',
    contact_person_role: '',
  });
  
  // School search and invite state
  const [schoolSearchResults, setSchoolSearchResults] = useState<Array<{id: string, name: string}>>([]);
  const [showSchoolInviteForm, setShowSchoolInviteForm] = useState(false);
  const [schoolInvite, setSchoolInvite] = useState({
    school_name: '',
    address: '',
    emails: [''],
    phone_numbers: [''],
    website: '',
    contact_person_name: '',
    contact_person_role: '',
  });
  
  // Skills dialog state
  const [showSkillDialog, setShowSkillDialog] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill>({ name: '', experience: '', rating: 5 });
  
  // Job description warning state
  const [showJobDescriptionWarning, setShowJobDescriptionWarning] = useState(false);
  const [jobDescriptionAcknowledged, setJobDescriptionAcknowledged] = useState(false);

  // Get steps based on role
  const getSteps = () => {
    const baseSteps = ['Select Role', 'Basic Information'];
    
    if (selectedRole === 'techie') {
      return [...baseSteps, 'Work Experience', 'Education', 'Review & Create'];
    } else if (selectedRole === 'hr') {
      return [...baseSteps, 'Company Details', 'Review & Create'];
    } else if (selectedRole === 'company') {
      return [...baseSteps, 'Company Details', 'Review & Create'];
    } else if (selectedRole === 'school') {
      return [...baseSteps, 'Institution Details', 'Review & Create'];
    }
    
    return [...baseSteps, 'Review & Create'];
  };

  const steps = getSteps();

  // Reset form
  const resetForm = () => {
    setActiveStep(0);
    setSelectedRole('techie');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      dob: '',
      country: 'USA',
      gov_id: '',
      mobile_number: '',
      address: '',
      work_authorization: '',
      profile: '',
      company_name: '',
      company_email: '',
      company_website: '',
      ein: '',
      cin: '',
      account_number: '',
      reg_state: '',
      started_date: '',
      about: '',
      school_name: '',
      est_year: '',
    });
    setExperiences([]);
    setEducations([]);
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Add experience
  const handleAddExperience = () => {
    setCurrentExperience({
      id: Date.now().toString(),
      client_name: '',
      company_website: '',
      work_location: '',
      job_title: '',
      from_date: '',
      to_date: '',
      skills: [],
      job_description: '',
      manager_name: '',
      manager_email: '',
      manager_phone: '',
      manager_linkedin: '',
    });
    setJobDescriptionAcknowledged(false);
    setCurrentSkill({ name: '', experience: '', rating: 5 });
    setShowExperienceForm(true);
  };

  const handleSaveExperience = () => {
    if (currentExperience) {
      const exists = experiences.find(e => e.id === currentExperience.id);
      if (exists) {
        setExperiences(experiences.map(e => e.id === currentExperience.id ? currentExperience : e));
      } else {
        setExperiences([...experiences, currentExperience]);
      }
      setShowExperienceForm(false);
      setCurrentExperience(null);
    }
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(experiences.filter(e => e.id !== id));
  };

  // Edit experience
  const handleEditExperience = (exp: Experience) => {
    setCurrentExperience({ ...exp });
    setJobDescriptionAcknowledged(true); // Already acknowledged for edit
    setShowExperienceForm(true);
  };

  // Project state for education
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [currentTeamMember, setCurrentTeamMember] = useState<ProjectTeamMember>({ name: '', email: '', role: '' });
  const [techStackInput, setTechStackInput] = useState('');

  // Add education
  const handleAddEducation = () => {
    setCurrentEducation({
      id: Date.now().toString(),
      institution_name: '',
      level_of_education: 'BACHELORS',
      field_of_study: '',
      from_date: '',
      to_date: '',
      gpa_score: '',
      projects: [],
    });
    setShowEducationForm(true);
  };

  // Add project to current education
  const handleAddProject = () => {
    setCurrentProject({
      id: Date.now().toString(),
      project_summary: '',
      tech_stack: [],
      team_size: 1,
      team_members: [],
      git_url: '',
    });
    setShowProjectForm(true);
  };

  // Save project to current education
  const handleSaveProject = () => {
    if (!currentProject) return;
    
    // Validate project fields
    if (!currentProject.project_summary) {
      onError('Project summary is required');
      return;
    }
    if (currentProject.tech_stack.length === 0) {
      onError('At least one technology in tech stack is required');
      return;
    }
    if (!currentProject.team_size || currentProject.team_size < 1) {
      onError('Team size is required');
      return;
    }
    if (currentProject.team_members.length === 0) {
      onError('At least one team member to invite is required');
      return;
    }
    if (!currentProject.git_url) {
      onError('Git URL is required');
      return;
    }
    
    if (currentEducation) {
      const existingProject = currentEducation.projects.find(p => p.id === currentProject.id);
      if (existingProject) {
        setCurrentEducation({
          ...currentEducation,
          projects: currentEducation.projects.map(p => p.id === currentProject.id ? currentProject : p)
        });
      } else {
        setCurrentEducation({
          ...currentEducation,
          projects: [...currentEducation.projects, currentProject]
        });
      }
    }
    setShowProjectForm(false);
    setCurrentProject(null);
  };

  // Delete project from current education
  const handleDeleteProject = (projectId: string) => {
    if (currentEducation) {
      setCurrentEducation({
        ...currentEducation,
        projects: currentEducation.projects.filter(p => p.id !== projectId)
      });
    }
  };

  // Edit project
  const handleEditProject = (project: Project) => {
    setCurrentProject({ ...project });
    setShowProjectForm(true);
  };

  // Add tech to stack
  const handleAddTech = () => {
    if (techStackInput.trim() && currentProject) {
      setCurrentProject({
        ...currentProject,
        tech_stack: [...currentProject.tech_stack, techStackInput.trim()]
      });
      setTechStackInput('');
    }
  };

  // Remove tech from stack
  const handleRemoveTech = (index: number) => {
    if (currentProject) {
      setCurrentProject({
        ...currentProject,
        tech_stack: currentProject.tech_stack.filter((_, i) => i !== index)
      });
    }
  };

  // Add team member
  const handleAddTeamMember = () => {
    if (currentTeamMember.name && currentTeamMember.email && currentTeamMember.role && currentProject) {
      setCurrentProject({
        ...currentProject,
        team_members: [...currentProject.team_members, { ...currentTeamMember }]
      });
      setCurrentTeamMember({ name: '', email: '', role: '' });
    } else {
      onError('Please fill all team member fields (Name, Email, Role)');
    }
  };

  // Remove team member
  const handleRemoveTeamMember = (index: number) => {
    if (currentProject) {
      setCurrentProject({
        ...currentProject,
        team_members: currentProject.team_members.filter((_, i) => i !== index)
      });
    }
  };

  const handleSaveEducation = () => {
    if (currentEducation) {
      // Validate all required fields
      if (!currentEducation.institution_name) {
        onError('Institution name is required');
        return;
      }
      if (!currentEducation.level_of_education) {
        onError('Level of education is required');
        return;
      }
      if (!currentEducation.field_of_study) {
        onError('Field of study is required');
        return;
      }
      if (!currentEducation.from_date) {
        onError('From date is required');
        return;
      }
      if (!currentEducation.to_date) {
        onError('To date is required');
        return;
      }
      if (!currentEducation.gpa_score) {
        onError('GPA/Score is required');
        return;
      }
      if (!currentEducation.projects || currentEducation.projects.length === 0) {
        onError('At least one project is required');
        return;
      }
      
      const exists = educations.find(e => e.id === currentEducation.id);
      if (exists) {
        setEducations(educations.map(e => e.id === currentEducation.id ? currentEducation : e));
      } else {
        setEducations([...educations, currentEducation]);
      }
      setShowEducationForm(false);
      setCurrentEducation(null);
    }
  };

  const handleDeleteEducation = (id: string) => {
    setEducations(educations.filter(e => e.id !== id));
  };

  // Edit education
  const handleEditEducation = (edu: Education) => {
    setCurrentEducation({ ...edu, projects: edu.projects || [] });
    setShowEducationForm(true);
  };

  // Validate current step
  const validateStep = (): string | null => {
    if (activeStep === 1) {
      // Basic information validation - ALL FIELDS MANDATORY
      if (!formData.email) return 'Email is required';
      if (!formData.email.includes('@')) return 'Please enter a valid email address';
      if (!formData.mobile_number) return 'Mobile number is required';
      if (!formData.first_name) return 'First name is required';
      if (!formData.last_name) return 'Last name is required';
      if (!formData.dob) return 'Date of birth is required';
      if (!formData.gov_id) return `${getGovIdLabel()} is required`;
      if (!formData.address) return 'Address is required';
      if (!formData.password) return 'Password is required';
      if (formData.password.length < 8) return 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
      
      // Role-specific validation
      if (selectedRole === 'techie') {
        if (!formData.work_authorization) return 'Work authorization is required';
        if (!formData.profile) return 'Profile summary is required';
      }
    }
    return null;
  };

  // Helper function to get government ID label based on country
  const getGovIdLabel = () => {
    const labels: Record<string, string> = {
      'usa': 'SSN (Last 4 digits)',
      'india': 'PAN (Last 4 characters)',
      'uk': 'National Insurance Number (Last 4)',
      'canada': 'SIN (Last 4 digits)',
      'germany': 'Sozialversicherungsnummer (Last 4)',
      'switzerland': 'AHV-Nummer (Last 4)',
      'china': 'Resident ID (Last 4)',
    };
    return labels[formData.country.toLowerCase()] || 'Government ID (Last 4)';
  };

  // Handle next step
  const handleNext = () => {
    const error = validateStep();
    if (error) {
      onError(error);
      return;
    }
    setActiveStep(prev => prev + 1);
  };

  // Handle back
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Submit form
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('authToken');
      
      // Build request body
      // The backend determines is_staff based on role:
      // - role="admin" → is_staff=true
      // - role="techie/hr/company/school" → is_staff=false
      const requestBody: Record<string, any> = {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name || undefined,
        dob: formData.dob || undefined,
        country: formData.country,
        gov_id: formData.gov_id || undefined,
        mobile_number: formData.mobile_number || undefined,
        address: formData.address || undefined,
        role: selectedRole, // This determines user type: techie, hr, company, school
      };

      // Add role-specific fields
      if (selectedRole === 'techie') {
        requestBody.work_authorization = formData.work_authorization || undefined;
        requestBody.profile = formData.profile || undefined;
        
        // Add experiences
        if (experiences.length > 0) {
          requestBody.experiences = experiences.map(exp => ({
            client_name: exp.client_name,
            company_website: exp.company_website,
            work_location: exp.work_location,
            job_title: exp.job_title,
            from_date: exp.from_date,
            to_date: exp.to_date,
            skills: exp.skills,
            job_description: exp.job_description,
            manager_name: exp.manager_name,
            manager_email: exp.manager_email,
            manager_phone: exp.manager_phone,
            manager_linkedin: exp.manager_linkedin,
          }));
        }
        
        // Add educations
        if (educations.length > 0) {
          requestBody.educations = educations.map(edu => ({
            institution_name: edu.institution_name,
            level_of_education: edu.level_of_education,
            field_of_study: edu.field_of_study,
            from_date: edu.from_date,
            to_date: edu.to_date,
            gpa_score: edu.gpa_score,
          }));
        }
      } else if (selectedRole === 'hr') {
        requestBody.company_name = formData.company_name || undefined;
        requestBody.company_email = formData.company_email || formData.email;
        requestBody.company_website = formData.company_website || undefined;
      } else if (selectedRole === 'company') {
        requestBody.company_name = formData.company_name || undefined;
        requestBody.company_website = formData.company_website || undefined;
        requestBody.ein = formData.ein || undefined;
        requestBody.cin = formData.cin || undefined;
        requestBody.account_number = formData.account_number || undefined;
        requestBody.reg_state = formData.reg_state || undefined;
        requestBody.started_date = formData.started_date || undefined;
        requestBody.about = formData.about || undefined;
      } else if (selectedRole === 'school') {
        requestBody.school_name = formData.school_name || undefined;
        requestBody.est_year = formData.est_year || undefined;
        requestBody.started_date = formData.started_date || undefined;
        requestBody.about = formData.about || undefined;
      }

      // Use CREATE_ADMIN endpoint for all user types
      // This endpoint handles all roles correctly and doesn't require email verification
      // - role="admin" → creates staff user with is_staff=true
      // - role="techie/hr/company/school" → creates user with is_staff=false
      const response = await fetch(getApiUrl(API_ENDPOINTS.CREATE_ADMIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        handleClose();
        onSuccess();
      } else {
        const data = await response.json();
        onError(data.error || data.detail || 'Failed to create user');
      }
    } catch (error) {
      onError('Error creating user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Country config
  const countryConfig = COUNTRY_CONFIG[formData.country as keyof typeof COUNTRY_CONFIG] || COUNTRY_CONFIG.USA;
  const workAuthOptions = WORK_AUTH_OPTIONS[formData.country] || WORK_AUTH_OPTIONS.USA;

  // Render step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        // Role Selection
        return (
          <Box sx={{ animation: `${fadeIn} 0.3s ease-out` }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#475569' }}>
              Select Account Type
            </Typography>
            <Grid container spacing={2}>
              {ROLE_CONFIG.map((role) => (
                <Grid item xs={6} sm={3} key={role.value}>
                  <Box
                    onClick={() => setSelectedRole(role.value as typeof selectedRole)}
                    sx={{
                      p: 2.5,
                      borderRadius: '16px',
                      border: selectedRole === role.value ? `2px solid ${role.color}` : '2px solid #e2e8f0',
                      background: selectedRole === role.value ? role.bg : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: role.color,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Avatar sx={{ 
                      bgcolor: selectedRole === role.value ? role.color : '#f1f5f9', 
                      color: selectedRole === role.value ? '#ffffff' : '#64748b',
                      mx: 'auto', 
                      mb: 1.5,
                      width: 48,
                      height: 48,
                      transition: 'all 0.2s ease',
                    }}>
                      {role.icon}
                    </Avatar>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600, 
                      color: selectedRole === role.value ? role.color : '#475569',
                    }}>
                      {role.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        // Basic Information
        return (
          <Box sx={{ animation: `${fadeIn} 0.3s ease-out` }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#475569' }}>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Mobile Number"
                  value={formData.mobile_number}
                  onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  value={formData.middle_name}
                  onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Country *</InputLabel>
                  <Select
                    value={formData.country}
                    label="Country *"
                    onChange={(e) => setFormData({ ...formData, country: e.target.value, gov_id: '', work_authorization: '' })}
                    sx={{ borderRadius: '12px' }}
                  >
                    {Object.entries(COUNTRY_CONFIG).map(([key, config]) => (
                      <MenuItem key={key} value={key}>{config.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Date of Birth"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  helperText={`Format: ${countryConfig.dateFormat}`}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label={countryConfig.idLabel}
                  placeholder={countryConfig.idPlaceholder}
                  value={formData.gov_id}
                  onChange={(e) => setFormData({ ...formData, gov_id: e.target.value.slice(0, countryConfig.idMaxLength) })}
                  inputProps={{ maxLength: countryConfig.idMaxLength }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  helperText={`Country-specific ID for ${countryConfig.label} (Required)`}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <AddressAutocomplete
                  value={formData.address}
                  onChange={(address) => setFormData({ ...formData, address })}
                  label="Address *"
                  placeholder="Start typing your address..."
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
                  helperText={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
                />
              </Grid>
              
              {/* Techie-specific: Work Authorization */}
              {selectedRole === 'techie' && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1, color: '#475569' }}>
                      Work Authorization
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Work Authorization *</InputLabel>
                      <Select
                        value={formData.work_authorization}
                        label="Work Authorization *"
                        onChange={(e) => setFormData({ ...formData, work_authorization: e.target.value })}
                        sx={{ borderRadius: '12px' }}
                      >
                        <MenuItem value="">Select...</MenuItem>
                        {workAuthOptions.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Profile Summary"
                      multiline
                      rows={3}
                      value={formData.profile}
                      onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                      onPaste={(e) => e.preventDefault()}
                      onDrop={(e) => e.preventDefault()}
                      onDragOver={(e) => e.preventDefault()}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      helperText="Please type your profile summary manually (copy-paste disabled) - Required"
                      inputProps={{
                        autoComplete: 'off',
                        'data-gramm': 'false',
                        'data-gramm_editor': 'false',
                        'data-enable-grammarly': 'false',
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        );

      case 2:
        // Role-specific step
        if (selectedRole === 'techie') {
          // Work Experience
          return (
            <Box sx={{ animation: `${fadeIn} 0.3s ease-out` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569' }}>
                  Work Experience
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={handleAddExperience}
                  sx={{ borderRadius: '12px' }}
                >
                  Add Experience
                </Button>
              </Box>
              
              {experiences.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: '12px' }}>
                  No work experience added yet. Click "Add Experience" to add your work history.
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {experiences.map((exp) => (
                    <Card key={exp.id} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                              {exp.job_title || 'Job Title'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                              {exp.client_name || 'Company'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {exp.work_location && `${exp.work_location} • `}
                              {exp.from_date} - {exp.to_date || 'Present'}
                            </Typography>
                            {exp.skills && exp.skills.length > 0 && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                {exp.skills.slice(0, 5).map((skill, idx) => (
                                  <Chip 
                                    key={idx} 
                                    label={typeof skill === 'string' ? skill : skill.name} 
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
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton 
                              onClick={() => handleEditExperience(exp)}
                              sx={{ color: '#3b82f6' }}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDeleteExperience(exp.id)}
                              sx={{ color: '#dc2626' }}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              {/* Experience Form Dialog */}
              <Dialog open={showExperienceForm} onClose={() => setShowExperienceForm(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                  {currentExperience && experiences.find(e => e.id === currentExperience.id) ? 'Edit Work Experience' : 'Add Work Experience'}
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {/* Company Name with Search */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company Name *"
                        value={currentExperience?.client_name || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCurrentExperience(prev => prev ? {...prev, client_name: value} : null);
                          // TODO: Search registered companies
                          if (value.length >= 2) {
                            // Simulated search - replace with actual API call
                            setCompanySearchResults([]);
                          }
                        }}
                        helperText={
                          companySearchResults.length === 0 && (currentExperience?.client_name?.length || 0) >= 2 ? (
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span>Company not found.</span>
                              <Button 
                                size="small" 
                                onClick={() => {
                                  setCompanyInvite(prev => ({...prev, company_name: currentExperience?.client_name || ''}));
                                  setShowCompanyInviteForm(true);
                                }}
                                sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                              >
                                Invite your company
                              </Button>
                            </Box>
                          ) : ''
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Work Location *"
                        placeholder="City, State, Country"
                        value={currentExperience?.work_location || ''}
                        onChange={(e) => setCurrentExperience(prev => prev ? {...prev, work_location: e.target.value} : null)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company Website"
                        placeholder="https://company.com"
                        value={currentExperience?.company_website || ''}
                        onChange={(e) => setCurrentExperience(prev => prev ? {...prev, company_website: e.target.value} : null)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Job Title *"
                        value={currentExperience?.job_title || ''}
                        onChange={(e) => setCurrentExperience(prev => prev ? {...prev, job_title: e.target.value} : null)}
                        helperText="⚠️ Job title cannot be changed after account creation"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="From Date *"
                        type="date"
                        value={currentExperience?.from_date || ''}
                        onChange={(e) => setCurrentExperience(prev => prev ? {...prev, from_date: e.target.value} : null)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="To Date"
                        type="date"
                        value={currentExperience?.to_date || ''}
                        onChange={(e) => setCurrentExperience(prev => prev ? {...prev, to_date: e.target.value} : null)}
                        InputLabelProps={{ shrink: true }}
                        helperText="Leave empty if current"
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
                          startIcon={<Add />}
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
                      {currentExperience?.skills && currentExperience.skills.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                          {currentExperience.skills.map((skill, idx) => (
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
                                    setCurrentExperience(prev => prev ? {
                                      ...prev,
                                      skills: prev.skills.filter((_, i) => i !== idx)
                                    } : null);
                                  }}
                                  sx={{ color: '#ef4444' }}
                                >
                                  <Close fontSize="small" />
                                </IconButton>
                              </Box>
                            </Paper>
                          ))}
                        </Box>
                      )}
                    </Grid>
                    
                    {/* Job Description with Warning */}
                    <Grid item xs={12}>
                      <Box
                        onClick={() => {
                          if (!jobDescriptionAcknowledged) {
                            setShowJobDescriptionWarning(true);
                          }
                        }}
                        sx={{ cursor: !jobDescriptionAcknowledged ? 'pointer' : 'default' }}
                      >
                        <TextField
                          fullWidth
                          label="Job Description *"
                          multiline
                          rows={4}
                          value={currentExperience?.job_description || ''}
                          onChange={(e) => {
                            if (jobDescriptionAcknowledged) {
                              setCurrentExperience(prev => prev ? {...prev, job_description: e.target.value} : null);
                            }
                          }}
                          onPaste={(e) => e.preventDefault()}
                          onDrop={(e) => e.preventDefault()}
                          onDragOver={(e) => e.preventDefault()}
                          placeholder={jobDescriptionAcknowledged ? "Describe your exact roles and responsibilities..." : "Click here to acknowledge terms and start typing..."}
                          helperText="Copy-paste disabled. Type manually. Can only be updated once every 30 days."
                          inputProps={{
                            autoComplete: 'off',
                            'data-gramm': 'false',
                            readOnly: !jobDescriptionAcknowledged,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: !jobDescriptionAcknowledged ? '#f1f5f9' : 'white',
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    
                    {/* Manager Reference Section */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                        Manager/Client Reference (Required)
                      </Typography>
                      <Alert severity="warning" sx={{ mb: 2, fontSize: '0.8rem' }}>
                        Official company email is mandatory. Failing to provide official email will restrict platform access.
                      </Alert>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Manager Name *"
                        value={currentExperience?.manager_name || ''}
                        onChange={(e) => setCurrentExperience(prev => prev ? {...prev, manager_name: e.target.value} : null)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Manager Official Email *"
                        type="email"
                        placeholder="manager@company.com"
                        value={currentExperience?.manager_email || ''}
                        onChange={(e) => setCurrentExperience(prev => prev ? {...prev, manager_email: e.target.value} : null)}
                        helperText="Must be official company email (not personal)"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Manager Phone"
                        value={currentExperience?.manager_phone || ''}
                        onChange={(e) => setCurrentExperience(prev => prev ? {...prev, manager_phone: e.target.value} : null)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Manager LinkedIn"
                        placeholder="https://linkedin.com/in/..."
                        value={currentExperience?.manager_linkedin || ''}
                        onChange={(e) => setCurrentExperience(prev => prev ? {...prev, manager_linkedin: e.target.value} : null)}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={() => {
                    setShowExperienceForm(false);
                    setJobDescriptionAcknowledged(false);
                  }}>Cancel</Button>
                  <Button 
                    variant="contained" 
                    onClick={handleSaveExperience}
                    disabled={!currentExperience?.client_name || !currentExperience?.job_title || !currentExperience?.manager_email}
                  >
                    Save Experience
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Job Description Warning Dialog */}
              <Dialog open={showJobDescriptionWarning} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, color: '#dc2626' }}>
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
                      setJobDescriptionAcknowledged(true);
                      setShowJobDescriptionWarning(false);
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
                      if (currentSkill.name.trim() && currentSkill.experience.trim() && currentExperience) {
                        setCurrentExperience(prev => prev ? {
                          ...prev,
                          skills: [...(prev.skills || []), {
                            name: currentSkill.name.trim(),
                            experience: currentSkill.experience.trim(),
                            rating: currentSkill.rating
                          }]
                        } : null);
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
              <Dialog open={showCompanyInviteForm} onClose={() => setShowCompanyInviteForm(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                  Invite Your Company to VerTechie
                </DialogTitle>
                <DialogContent>
                  <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>
                    Your company is not registered with us. You can invite them to create an account, 
                    or proceed without inviting.
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Company Full Name *"
                        value={companyInvite.company_name}
                        onChange={(e) => setCompanyInvite(prev => ({...prev, company_name: e.target.value}))}
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
                        value={companyInvite.contact_person_name}
                        onChange={(e) => setCompanyInvite(prev => ({...prev, contact_person_name: e.target.value}))}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Contact Person Role"
                        placeholder="e.g., HR Manager"
                        value={companyInvite.contact_person_role}
                        onChange={(e) => setCompanyInvite(prev => ({...prev, contact_person_role: e.target.value}))}
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
                      {companyInvite.phone_numbers.map((phone, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="+1 (555) 123-4567"
                            value={phone}
                            onChange={(e) => {
                              const newPhones = [...companyInvite.phone_numbers];
                              newPhones[idx] = e.target.value;
                              setCompanyInvite(prev => ({...prev, phone_numbers: newPhones}));
                            }}
                          />
                          {companyInvite.phone_numbers.length > 1 && (
                            <Button 
                              size="small" 
                              color="error"
                              onClick={() => {
                                setCompanyInvite(prev => ({
                                  ...prev, 
                                  phone_numbers: prev.phone_numbers.filter((_, i) => i !== idx)
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
                        onClick={() => setCompanyInvite(prev => ({...prev, phone_numbers: [...prev.phone_numbers, '']}))}
                      >
                        + Add Another Phone
                      </Button>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={() => setShowCompanyInviteForm(false)}>
                    Skip - Proceed Without Inviting
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={async () => {
                      // Validate required fields
                      const filteredEmails = companyInvite.emails.filter(e => e.trim());
                      if (filteredEmails.length === 0) {
                        setSnackbar({ open: true, message: 'At least one email is required', severity: 'error' });
                        return;
                      }
                      
                      setIsSubmitting(true);
                      try {
                        const token = localStorage.getItem('authToken');
                        const response = await fetch(getApiUrl(API_ENDPOINTS.COMPANY_INVITES), {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                          },
                          body: JSON.stringify({
                            company_name: companyInvite.company_name,
                            address: companyInvite.address,
                            emails: filteredEmails,
                            phone_numbers: companyInvite.phone_numbers.filter(p => p.trim()),
                            website: companyInvite.website,
                            contact_person_name: companyInvite.contact_person_name,
                            contact_person_role: companyInvite.contact_person_role,
                          }),
                        });
                        if (response.ok) {
                          setSnackbar({ 
                            open: true, 
                            message: `Invitation sent to ${companyInvite.contact_person_name} at ${companyInvite.company_name}! Our BDM team will follow up.`, 
                            severity: 'success' 
                          });
                          setShowCompanyInviteForm(false);
                          // Reset form
                          setCompanyInvite({
                            company_name: '',
                            address: '',
                            emails: [''],
                            phone_numbers: [''],
                            website: '',
                            contact_person_name: '',
                            contact_person_role: '',
                          });
                          // Update the experience with the company name
                          if (currentExperience) {
                            setCurrentExperience({
                              ...currentExperience,
                              client_name: companyInvite.company_name,
                            });
                          }
                        } else {
                          const errorData = await response.json();
                          setSnackbar({ 
                            open: true, 
                            message: errorData.error || errorData.emails?.[0] || 'Failed to send invitation. Please try again.', 
                            severity: 'error' 
                          });
                        }
                      } catch (error) {
                        console.error('Error sending company invite:', error);
                        setSnackbar({ open: true, message: 'Network error. Please check your connection.', severity: 'error' });
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    disabled={!companyInvite.company_name || !companyInvite.contact_person_name || isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Invite'}
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          );
        } else if (selectedRole === 'hr') {
          // HR Company Details
          return (
            <Box sx={{ animation: `${fadeIn} 0.3s ease-out` }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#475569' }}>
                Hiring Manager - Company Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Email"
                    type="email"
                    value={formData.company_email}
                    onChange={(e) => setFormData({ ...formData, company_email: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Website"
                    value={formData.company_website}
                    onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
              </Grid>
            </Box>
          );
        } else if (selectedRole === 'company') {
          // Company Details
          return (
            <Box sx={{ animation: `${fadeIn} 0.3s ease-out` }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#475569' }}>
                Company Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Website"
                    value={formData.company_website}
                    onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="EIN (US)"
                    value={formData.ein}
                    onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="CIN (India)"
                    value={formData.cin}
                    onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Account Number"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Registration State"
                    value={formData.reg_state}
                    onChange={(e) => setFormData({ ...formData, reg_state: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Started Date"
                    type="date"
                    value={formData.started_date}
                    onChange={(e) => setFormData({ ...formData, started_date: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="About"
                    multiline
                    rows={3}
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
              </Grid>
            </Box>
          );
        } else {
          // School Details
          return (
            <Box sx={{ animation: `${fadeIn} 0.3s ease-out` }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#475569' }}>
                Educational Institution Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Institution Name"
                    value={formData.school_name}
                    onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Established Year"
                    type="date"
                    value={formData.est_year}
                    onChange={(e) => setFormData({ ...formData, est_year: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Started Date"
                    type="date"
                    value={formData.started_date}
                    onChange={(e) => setFormData({ ...formData, started_date: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="About"
                    multiline
                    rows={3}
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
              </Grid>
            </Box>
          );
        }
        return null;

      case 3:
        // Education step for techie, Review for others
        if (selectedRole === 'techie') {
          return (
            <Box sx={{ animation: `${fadeIn} 0.3s ease-out` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569' }}>
                  Education Details
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={handleAddEducation}
                  sx={{ borderRadius: '12px' }}
                >
                  Add Education
                </Button>
              </Box>
              
              {educations.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: '12px' }}>
                  No education added yet. Click "Add Education" to add your educational background.
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {educations.map((edu) => (
                    <Card key={edu.id} sx={{ borderRadius: '12px' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {edu.institution_name || 'Institution'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {EDUCATION_LEVELS.find(l => l.value === edu.level_of_education)?.label || edu.level_of_education} in {edu.field_of_study}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {edu.from_date} - {edu.to_date}
                            </Typography>
                            {edu.projects && edu.projects.length > 0 && (
                              <Chip 
                                label={`${edu.projects.length} Project${edu.projects.length > 1 ? 's' : ''}`} 
                                size="small" 
                                sx={{ ml: 1, bgcolor: '#dbeafe', color: '#1d4ed8' }}
                              />
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton 
                              onClick={() => handleEditEducation(edu)}
                              sx={{ color: '#3b82f6' }}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDeleteEducation(edu.id)}
                              sx={{ color: '#dc2626' }}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              {/* Education Form Dialog */}
              <Dialog open={showEducationForm} onClose={() => setShowEducationForm(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                  {currentEducation && educations.find(e => e.id === currentEducation.id) ? 'Edit Education' : 'Add Education'}
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Institution Name"
                        value={currentEducation?.institution_name || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCurrentEducation(prev => prev ? {...prev, institution_name: value} : null);
                          // TODO: Search registered schools
                          if (value.length >= 2) {
                            // Simulated search - replace with actual API call
                            setSchoolSearchResults([]);
                          }
                        }}
                        helperText={
                          schoolSearchResults.length === 0 && (currentEducation?.institution_name?.length || 0) >= 2 ? (
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span>Institution not found.</span>
                              <Button 
                                size="small" 
                                onClick={() => {
                                  setSchoolInvite(prev => ({...prev, school_name: currentEducation?.institution_name || ''}));
                                  setShowSchoolInviteForm(true);
                                }}
                                sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                              >
                                Invite your institution
                              </Button>
                            </Box>
                          ) : ''
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Level of Education *</InputLabel>
                        <Select
                          value={currentEducation?.level_of_education || 'BACHELORS'}
                          label="Level of Education *"
                          onChange={(e) => setCurrentEducation(prev => prev ? {...prev, level_of_education: e.target.value} : null)}
                        >
                          {EDUCATION_LEVELS.map((level) => (
                            <MenuItem key={level.value} value={level.value}>{level.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Field of Study"
                        value={currentEducation?.field_of_study || ''}
                        onChange={(e) => setCurrentEducation(prev => prev ? {...prev, field_of_study: e.target.value} : null)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        required
                        label="From Date"
                        type="date"
                        value={currentEducation?.from_date || ''}
                        onChange={(e) => setCurrentEducation(prev => prev ? {...prev, from_date: e.target.value} : null)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        required
                        label="To Date"
                        type="date"
                        value={currentEducation?.to_date || ''}
                        onChange={(e) => setCurrentEducation(prev => prev ? {...prev, to_date: e.target.value} : null)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        required
                        label="GPA/Score"
                        value={currentEducation?.gpa_score || ''}
                        onChange={(e) => setCurrentEducation(prev => prev ? {...prev, gpa_score: e.target.value} : null)}
                      />
                    </Grid>

                    {/* Projects Section */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e3a5f' }}>
                          Projects During Education *
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={handleAddProject}
                          size="small"
                        >
                          Add Project
                        </Button>
                      </Box>

                      {/* Projects List */}
                      {currentEducation?.projects && currentEducation.projects.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                          {currentEducation.projects.map((project, idx) => (
                            <Card key={project.id} variant="outlined" sx={{ p: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    Project {idx + 1}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                    {project.project_summary.substring(0, 100)}...
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                    {project.tech_stack.slice(0, 4).map((tech, i) => (
                                      <Chip key={i} label={tech} size="small" sx={{ fontSize: '0.7rem' }} />
                                    ))}
                                    {project.tech_stack.length > 4 && (
                                      <Chip label={`+${project.tech_stack.length - 4}`} size="small" />
                                    )}
                                  </Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Team: {project.team_size} | Invites: {project.team_members.length}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  <IconButton size="small" onClick={() => handleEditProject(project)} sx={{ color: '#2563eb' }}>
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small" onClick={() => handleDeleteProject(project.id)} sx={{ color: '#dc2626' }}>
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Card>
                          ))}
                        </Box>
                      )}

                      {(!currentEducation?.projects || currentEducation.projects.length === 0) && (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                          No projects added yet. Click "Add Project" to add your projects during education.
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowEducationForm(false)}>Cancel</Button>
                  <Button variant="contained" onClick={handleSaveEducation}>Save</Button>
                </DialogActions>

                {/* Project Form Dialog */}
                <Dialog open={showProjectForm} onClose={() => setShowProjectForm(false)} maxWidth="md" fullWidth>
                  <DialogTitle>
                    {currentProject && currentEducation?.projects.find(p => p.id === currentProject.id) ? 'Edit Project' : 'Add Project'}
                  </DialogTitle>
                  <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {/* Project Summary */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          required
                          multiline
                          rows={3}
                          label="Project Summary"
                          placeholder="Describe your project, its goals, and your contributions..."
                          value={currentProject?.project_summary || ''}
                          onChange={(e) => setCurrentProject(prev => prev ? {...prev, project_summary: e.target.value} : null)}
                          onPaste={(e) => e.preventDefault()}
                          onDrop={(e) => e.preventDefault()}
                          helperText="Copy-paste disabled. Type manually."
                          inputProps={{ autoComplete: 'off' }}
                        />
                      </Grid>

                      {/* Tech Stack */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Tech Stack Used *
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <TextField
                            size="small"
                            label="Add Technology"
                            value={techStackInput}
                            onChange={(e) => setTechStackInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                            sx={{ flex: 1 }}
                          />
                          <Button variant="outlined" onClick={handleAddTech}>Add</Button>
                        </Box>
                        {currentProject?.tech_stack && currentProject.tech_stack.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {currentProject.tech_stack.map((tech, idx) => (
                              <Chip
                                key={idx}
                                label={tech}
                                onDelete={() => handleRemoveTech(idx)}
                                size="small"
                                sx={{ bgcolor: '#e0e7ff', color: '#4338ca' }}
                              />
                            ))}
                          </Box>
                        )}
                      </Grid>

                      {/* Team Size */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          type="number"
                          label="Team Size"
                          value={currentProject?.team_size || 1}
                          onChange={(e) => setCurrentProject(prev => prev ? {...prev, team_size: parseInt(e.target.value) || 1} : null)}
                          inputProps={{ min: 1 }}
                        />
                      </Grid>

                      {/* Git URL */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          label="Git URL"
                          placeholder="https://github.com/username/project"
                          value={currentProject?.git_url || ''}
                          onChange={(e) => setCurrentProject(prev => prev ? {...prev, git_url: e.target.value} : null)}
                        />
                      </Grid>

                      {/* Team Members to Invite */}
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Invite Team Members to Application *
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                          Add team members who worked on this project. They will receive an invitation to join our platform.
                        </Typography>
                        
                        <Grid container spacing={1} sx={{ mb: 1 }}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Name"
                              value={currentTeamMember.name}
                              onChange={(e) => setCurrentTeamMember(prev => ({...prev, name: e.target.value}))}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Email"
                              type="email"
                              value={currentTeamMember.email}
                              onChange={(e) => setCurrentTeamMember(prev => ({...prev, email: e.target.value}))}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Role"
                              placeholder="Developer, Designer..."
                              value={currentTeamMember.role}
                              onChange={(e) => setCurrentTeamMember(prev => ({...prev, role: e.target.value}))}
                            />
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <Button 
                              variant="contained" 
                              onClick={handleAddTeamMember}
                              sx={{ height: '100%', minWidth: '40px' }}
                            >
                              <Add />
                            </Button>
                          </Grid>
                        </Grid>

                        {/* Team Members List */}
                        {currentProject?.team_members && currentProject.team_members.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            {currentProject.team_members.map((member, idx) => (
                              <Box 
                                key={idx} 
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'space-between',
                                  p: 1,
                                  mb: 0.5,
                                  bgcolor: '#f8fafc',
                                  borderRadius: 1,
                                  border: '1px solid #e2e8f0'
                                }}
                              >
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {member.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {member.email} • {member.role}
                                  </Typography>
                                </Box>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleRemoveTeamMember(idx)}
                                  sx={{ color: '#dc2626' }}
                                >
                                  <Close fontSize="small" />
                                </IconButton>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setShowProjectForm(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveProject}>Save Project</Button>
                  </DialogActions>
                </Dialog>
              </Dialog>

              {/* School Invite Dialog */}
              <Dialog open={showSchoolInviteForm} onClose={() => setShowSchoolInviteForm(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                  Invite Your Institution to VerTechie
                </DialogTitle>
                <DialogContent>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Help us connect with your educational institution. Fill in the details below and we'll reach out to them.
                  </Alert>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Institution Name *"
                        value={schoolInvite.school_name}
                        onChange={(e) => setSchoolInvite({...schoolInvite, school_name: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Institution Address"
                        value={schoolInvite.address}
                        onChange={(e) => setSchoolInvite({...schoolInvite, address: e.target.value})}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Institution Website"
                        value={schoolInvite.website}
                        onChange={(e) => setSchoolInvite({...schoolInvite, website: e.target.value})}
                        placeholder="https://university.edu"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Email Addresses</Typography>
                      {schoolInvite.emails.map((email, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="admin@university.edu"
                            value={email}
                            onChange={(e) => {
                              const newEmails = [...schoolInvite.emails];
                              newEmails[idx] = e.target.value;
                              setSchoolInvite({...schoolInvite, emails: newEmails});
                            }}
                          />
                          {schoolInvite.emails.length > 1 && (
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                setSchoolInvite({
                                  ...schoolInvite, 
                                  emails: schoolInvite.emails.filter((_, i) => i !== idx)
                                });
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      ))}
                      <Button
                        size="small"
                        startIcon={<Add />}
                        onClick={() => setSchoolInvite({...schoolInvite, emails: [...schoolInvite.emails, '']})}
                      >
                        Add Email
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Phone Numbers</Typography>
                      {schoolInvite.phone_numbers.map((phone, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="+1 (555) 123-4567"
                            value={phone}
                            onChange={(e) => {
                              const newPhones = [...schoolInvite.phone_numbers];
                              newPhones[idx] = e.target.value;
                              setSchoolInvite({...schoolInvite, phone_numbers: newPhones});
                            }}
                          />
                          {schoolInvite.phone_numbers.length > 1 && (
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                setSchoolInvite({
                                  ...schoolInvite, 
                                  phone_numbers: schoolInvite.phone_numbers.filter((_, i) => i !== idx)
                                });
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      ))}
                      <Button
                        size="small"
                        startIcon={<Add />}
                        onClick={() => setSchoolInvite({...schoolInvite, phone_numbers: [...schoolInvite.phone_numbers, '']})}
                      >
                        Add Phone
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Contact Person Name"
                        value={schoolInvite.contact_person_name}
                        onChange={(e) => setSchoolInvite({...schoolInvite, contact_person_name: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Contact Person Role"
                        value={schoolInvite.contact_person_role}
                        onChange={(e) => setSchoolInvite({...schoolInvite, contact_person_role: e.target.value})}
                        placeholder="e.g., Registrar, Admin"
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={() => setShowSchoolInviteForm(false)}>Cancel</Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      // Continue without inviting
                      setShowSchoolInviteForm(false);
                    }}
                  >
                    Continue Without Invite
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={async () => {
                      // TODO: Send invite to backend
                      try {
                        const token = localStorage.getItem('authToken');
                        // Reuse company invites endpoint or create school invites endpoint
                        setSnackbar({ open: true, message: 'Institution invite sent successfully!', severity: 'success' });
                        setShowSchoolInviteForm(false);
                      } catch (error) {
                        setSnackbar({ open: true, message: 'Failed to send invite', severity: 'error' });
                      }
                    }}
                    disabled={!schoolInvite.school_name || schoolInvite.emails.filter(e => e).length === 0}
                  >
                    Send Invite
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          );
        } else {
          // For non-techie roles, case 3 is the review step
          return renderReviewStep();
        }

      case 4:
      default:
        return renderReviewStep();
    }
  };

  // Helper function for the Review & Create step
  const renderReviewStep = () => {
    const roleLabel = ROLE_CONFIG.find(r => r.value === selectedRole)?.label || selectedRole;
    return (
          <Box sx={{ animation: `${fadeIn} 0.3s ease-out` }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#475569' }}>
              Review & Create Account
            </Typography>
            
            {/* Basic Information Section */}
            <Card sx={{ borderRadius: '16px', mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: ROLE_CONFIG.find(r => r.value === selectedRole)?.color }}>
                      {ROLE_CONFIG.find(r => r.value === selectedRole)?.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {formData.first_name} {formData.last_name}
                      </Typography>
                      <Chip label={roleLabel} size="small" sx={{ mt: 0.5 }} />
                    </Box>
                  </Box>
                  <Tooltip title="Edit Basic Information">
                    <IconButton 
                      onClick={() => setActiveStep(1)} 
                      sx={{ color: '#3b82f6' }}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body2">{formData.email}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Country</Typography>
                    <Typography variant="body2">{COUNTRY_CONFIG[formData.country as keyof typeof COUNTRY_CONFIG]?.label}</Typography>
                  </Grid>
                  {formData.mobile_number && (
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Mobile</Typography>
                      <Typography variant="body2">{formData.mobile_number}</Typography>
                    </Grid>
                  )}
                  {formData.dob && (
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                      <Typography variant="body2">{formData.dob}</Typography>
                    </Grid>
                  )}
                  {formData.address && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Address</Typography>
                      <Typography variant="body2">{formData.address}</Typography>
                    </Grid>
                  )}
                  {selectedRole === 'techie' && formData.work_authorization && (
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Work Authorization</Typography>
                      <Typography variant="body2">{formData.work_authorization}</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Work Experience Section */}
            {selectedRole === 'techie' && experiences.length > 0 && (
              <Card sx={{ borderRadius: '16px', mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Work fontSize="small" color="primary" />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Work Experience ({experiences.length})
                      </Typography>
                    </Box>
                    <Tooltip title="Edit Work Experience">
                      <IconButton 
                        onClick={() => setActiveStep(2)} 
                        sx={{ color: '#3b82f6' }}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {experiences.map((exp, idx) => (
                    <Box key={exp.id} sx={{ py: 1, borderBottom: idx < experiences.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{exp.job_title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {exp.client_name} • {exp.from_date} - {exp.to_date || 'Present'}
                      </Typography>
                      {exp.skills && exp.skills.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {exp.skills.slice(0, 3).map((skill, i) => (
                            <Chip 
                              key={i} 
                              label={typeof skill === 'string' ? skill : skill.name} 
                              size="small" 
                              sx={{ fontSize: '0.65rem', height: '20px' }} 
                            />
                          ))}
                          {exp.skills.length > 3 && (
                            <Chip label={`+${exp.skills.length - 3}`} size="small" sx={{ fontSize: '0.65rem', height: '20px' }} />
                          )}
                        </Box>
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Education Section */}
            {selectedRole === 'techie' && educations.length > 0 && (
              <Card sx={{ borderRadius: '16px', mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolOutlined fontSize="small" color="primary" />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Education ({educations.length})
                      </Typography>
                    </Box>
                    <Tooltip title="Edit Education">
                      <IconButton 
                        onClick={() => setActiveStep(3)} 
                        sx={{ color: '#3b82f6' }}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {educations.map((edu, idx) => (
                    <Box key={edu.id} sx={{ py: 1, borderBottom: idx < educations.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{edu.institution_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {EDUCATION_LEVELS.find(l => l.value === edu.level_of_education)?.label} in {edu.field_of_study}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {edu.from_date} - {edu.to_date} • GPA: {edu.gpa_score}
                      </Typography>
                      {edu.projects && edu.projects.length > 0 && (
                        <Chip 
                          label={`${edu.projects.length} Project${edu.projects.length > 1 ? 's' : ''}`} 
                          size="small" 
                          sx={{ mt: 0.5, fontSize: '0.65rem', height: '20px', bgcolor: '#dbeafe', color: '#1d4ed8' }} 
                        />
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Profile Summary for Techie */}
            {selectedRole === 'techie' && formData.profile && (
              <Card sx={{ borderRadius: '16px', mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Profile Summary
                    </Typography>
                    <Tooltip title="Edit Profile Summary">
                      <IconButton 
                        onClick={() => setActiveStep(1)} 
                        sx={{ color: '#3b82f6' }}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                    {formData.profile.length > 200 ? `${formData.profile.substring(0, 200)}...` : formData.profile}
                  </Typography>
                </CardContent>
              </Card>
            )}

            <Alert 
              severity="info" 
              icon={<CheckCircle />}
              sx={{ borderRadius: '12px' }}
            >
              This account will be created as verified with email and mobile verification bypassed.
            </Alert>
          </Box>
        );
  };

  const isLastStep = activeStep === steps.length - 1;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ 
        sx: { 
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxHeight: '90vh',
        } 
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AnimatedAvatar sx={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
            }}>
              <PersonAdd sx={{ color: '#ffffff' }} />
            </AnimatedAvatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                Create User Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Step {activeStep + 1} of {steps.length}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Box sx={{ px: 3, pt: 2, background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <DialogContent sx={{ pt: 3 }}>
        {renderStepContent()}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 2, borderTop: '1px solid rgba(226, 232, 240, 0.8)' }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            borderRadius: '12px',
            px: 3,
            color: '#64748b',
          }}
        >
          Cancel
        </Button>
        
        <Box sx={{ flex: 1 }} />
        
        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{ borderRadius: '12px', mr: 1 }}
          >
            Back
          </Button>
        )}
        
        {isLastStep ? (
          <AnimatedButton 
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{ color: '#ffffff' }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create User'}
          </AnimatedButton>
        ) : (
          <AnimatedButton
            onClick={handleNext}
            endIcon={<ArrowForward />}
            sx={{ color: '#ffffff' }}
          >
            Next
          </AnimatedButton>
        )}
      </DialogActions>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AdminCreateUserWizard;

