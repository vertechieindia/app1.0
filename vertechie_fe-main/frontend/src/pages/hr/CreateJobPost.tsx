/**
 * Create Job Post
 * Form for HR to create job posts with coding questions
 * Theme: Poncho (#403a3e → #be5869)
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Collapse,
  Autocomplete,
  alpha,
  keyframes,
  FormControlLabel,
  Switch,
  Tooltip,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Code as CodeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  WorkOutline as WorkOutlineIcon,
  Tune as TuneIcon,
  AddCircleOutline as AddCaseIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import {
  JobFormData,
  CodingQuestion,
  TestCase,
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  DIFFICULTY_LABELS,
} from '../../types/jobPortal';
import { jobService, getHRUserInfo } from '../../services/jobPortalService';
import {
  API_ENDPOINTS,
  getApiUrl,
  LOCATION_AUTOCOMPLETE_COUNTRY_CODES,
  LOCATION_AUTOCOMPLETE_PER_COUNTRY_LIMIT,
  LOCATION_AUTOCOMPLETE_MERGED_MAX,
} from '../../config/api';
import { fetchWithAuth } from '../../utils/apiInterceptor';
import { fetchJobTitleSuggestions } from '../../utils/jobTitleSuggestions';
import { fetchSkillSuggestions } from '../../utils/skillSuggestions';
import { buildAssessmentTemplatePack } from '../../data/assessmentQuestionTemplate';

// Theme Colors - Poncho Palette
const colors = {
  primary: '#be5869',
  primaryDark: '#a04857',
  primaryLight: '#d4899b',
  secondary: '#403a3e',
  secondaryLight: '#5a5358',
  accent: '#e8b4bc',
  background: '#fafafa',
  surface: '#ffffff',
  text: '#403a3e',
  textLight: '#6b6369',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
};

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(160deg, #fdf6f7 0%, #f9f0f1 30%, #f5eaec 60%, #f0e4e6 100%)`,
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  position: 'relative',
}));

const FormCard = styled(Card)(({ theme }) => ({
  background: colors.surface,
  borderRadius: 24,
  boxShadow: `0 25px 60px ${colors.primary}15`,
  border: `1px solid ${colors.accent}40`,
  animation: `${fadeInUp} 0.6s ease-out`,
  overflow: 'hidden',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
  padding: theme.spacing(5),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    animation: `${float} 6s ease-in-out infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -40,
    left: '20%',
    width: 120,
    height: 120,
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
  },
}));

const CodingQuestionCard = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.accent}15 0%, ${colors.primaryLight}10 100%)`,
  border: `1px solid ${colors.accent}60`,
  borderRadius: 16,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background: `linear-gradient(180deg, ${colors.primary}, ${colors.accent})`,
    borderRadius: '4px 0 0 4px',
  },
  '&:hover': {
    borderColor: colors.primary,
    boxShadow: `0 8px 30px ${colors.primary}15`,
    transform: 'translateX(4px)',
  },
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  borderRadius: 10,
  fontWeight: 600,
  margin: theme.spacing(0.5),
  background: `linear-gradient(135deg, ${colors.accent}50 0%, ${colors.primaryLight}30 100%)`,
  color: colors.secondary,
  border: `1px solid ${colors.accent}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: colors.primary,
    color: 'white',
    transform: 'scale(1.05)',
  },
  '& .MuiChip-deleteIcon': {
    color: colors.primary,
    '&:hover': {
      color: colors.error,
    },
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
  color: 'white',
  borderRadius: 14,
  padding: '14px 40px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: `0 8px 30px ${colors.primary}50`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondary} 100%)`,
    boxShadow: `0 12px 40px ${colors.primary}60`,
    transform: 'translateY(-2px)',
  },
  '&:disabled': {
    background: colors.accent,
    boxShadow: 'none',
    color: colors.textLight,
  },
}));

const AddQuestionButton = styled(Button)(({ theme }) => ({
  borderStyle: 'dashed',
  borderWidth: 2,
  borderRadius: 16,
  padding: theme.spacing(2.5),
  color: colors.primary,
  borderColor: colors.accent,
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: colors.primary,
    background: `${colors.accent}30`,
    transform: 'translateY(-2px)',
  },
}));

const BackButton = styled(Button)(({ theme }) => ({
  color: colors.secondary,
  fontWeight: 600,
  borderRadius: 12,
  padding: '10px 20px',
  background: colors.surface,
  border: `2px solid ${colors.accent}`,
  boxShadow: `0 4px 15px ${colors.primary}10`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: colors.primary,
    borderColor: colors.primary,
    color: 'white',
    transform: 'translateX(-4px)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary,
        borderWidth: 2,
      },
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: colors.primary,
  },
}));

/** Languages shown to candidates in the coding assessment (values align with CodingTest page). */
const CODING_LANGUAGE_OPTIONS: { value: string; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
];

const normalizeCodingQuestion = (raw: Partial<CodingQuestion> & { id: string }): CodingQuestion => ({
  id: raw.id,
  question: raw.question ?? '',
  description: raw.description ?? '',
  difficulty: raw.difficulty ?? 'medium',
  starterCode: raw.starterCode ?? '',
  allowedLanguages:
    Array.isArray(raw.allowedLanguages) && raw.allowedLanguages.length > 0
      ? raw.allowedLanguages.map((x) => String(x).trim().toLowerCase())
      : ['javascript', 'python', 'java'],
  timeLimitMinutes: raw.timeLimitMinutes ?? 30,
  sampleInput: raw.sampleInput ?? '',
  sampleOutput: raw.sampleOutput ?? '',
  expectedOutput: raw.expectedOutput ?? '',
  testCases: Array.isArray(raw.testCases) ? raw.testCases : [],
  requireFullScreen: raw.requireFullScreen !== false,
  blockCopyPaste: raw.blockCopyPaste !== false,
  maxTabSwitches: typeof raw.maxTabSwitches === 'number' ? raw.maxTabSwitches : 2,
  sqlSchema: raw.sqlSchema ?? (raw as { sql_schema?: string }).sql_schema ?? '',
});

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: 12,
  '&:hover': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.primary,
    },
  },
  '&.Mui-focused': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.primary,
      borderWidth: 2,
    },
  },
}));

const CreateJobPost: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const isEditing = Boolean(jobId);

  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);
  const [codingAdvOpen, setCodingAdvOpen] = useState<Record<string, boolean>>({});
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState<string[]>([]);
  const jobTitleSearchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const skillSearchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const templatePackList = useMemo(() => buildAssessmentTemplatePack(), []);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);
  const [templateStaging, setTemplateStaging] = useState<CodingQuestion | null>(null);

  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    companyName: getHRUserInfo()?.companyName || '',
    description: '',
    requiredSkills: [],
    experienceLevel: 'mid',
    location: '',
    jobType: 'full-time',
    codingQuestions: [],
  });

  useEffect(() => {
    if (isEditing && jobId) {
      fetchJob(jobId);
    }
  }, [jobId]);

  const handleLocationSearch = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const q = encodeURIComponent(query.trim());
      const token = localStorage.getItem('authToken');
      const lim = LOCATION_AUTOCOMPLETE_PER_COUNTRY_LIMIT;

      const results = await Promise.all(
        LOCATION_AUTOCOMPLETE_COUNTRY_CODES.map(async (country) => {
          const url = `${getApiUrl(API_ENDPOINTS.PLACES_AUTOCOMPLETE)}?q=${q}&country=${country}&limit=${lim}`;
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
          
          if (!response.ok) return [];
          const data = await response.json();
          return Array.isArray(data) ? data.map((place: any) => place.display_name).filter(Boolean) : [];
        })
      );

      const merged = Array.from(new Set(results.flat())).slice(0, LOCATION_AUTOCOMPLETE_MERGED_MAX);
      setLocationSuggestions(merged);
    } catch (err) {
      console.error('Failed to fetch location suggestions:', err);
      setLocationSuggestions([]);
    }
  };

  const fetchJob = async (id: string) => {
    try {
      setFetchingJob(true);
      const job = await jobService.getJobById(id);
      if (job) {
        setFormData({
          title: job.title,
          companyName: job.companyName,
          description: job.description,
          requiredSkills: job.requiredSkills,
          experienceLevel: job.experienceLevel,
          location: job.location,
          jobType: job.jobType,
          codingQuestions: (job.codingQuestions || []).map((q) =>
            normalizeCodingQuestion({ ...q, id: q.id || `q-${Date.now()}` })
          ),
        });
      }
    } catch (err) {
      setError('Failed to load job details');
    } finally {
      setFetchingJob(false);
    }
  };

  const handleInputChange = (field: keyof JobFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onJobTitleInputChange = (_: unknown, newInputValue: string) => {
    handleInputChange('title', newInputValue);
    if (jobTitleSearchDebounceRef.current) clearTimeout(jobTitleSearchDebounceRef.current);
    jobTitleSearchDebounceRef.current = setTimeout(async () => {
      if (!newInputValue || newInputValue.trim().length < 2) {
        setJobTitleSuggestions([]);
        return;
      }
      const opts = await fetchJobTitleSuggestions(newInputValue);
      setJobTitleSuggestions(opts);
    }, 300);
  };

  const onSkillInputChange = (_: unknown, newInputValue: string) => {
    setSkillInput(newInputValue);
    if (skillSearchDebounceRef.current) clearTimeout(skillSearchDebounceRef.current);
    skillSearchDebounceRef.current = setTimeout(async () => {
      if (!newInputValue || newInputValue.trim().length < 1) {
        setSkillSuggestions([]);
        return;
      }
      const opts = await fetchSkillSuggestions(newInputValue);
      setSkillSuggestions(opts);
    }, 300);
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleAddCodingQuestion = () => {
    const newQuestion = normalizeCodingQuestion({
      id: `q-${Date.now()}`,
      question: '',
      description: '',
      difficulty: 'medium',
    });
    setFormData((prev) => ({
      ...prev,
      codingQuestions: [...prev.codingQuestions, newQuestion],
    }));
    setExpandedQuestion(formData.codingQuestions.length);
  };

  const toggleCodingAdv = (questionId: string) => {
    setCodingAdvOpen((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const toggleAllowedLanguage = (qIndex: number, langValue: string) => {
    setFormData((prev) => {
      const q = prev.codingQuestions[qIndex];
      const cur = [...(q.allowedLanguages || [])];
      const idx = cur.findIndex((l) => l.toLowerCase() === langValue.toLowerCase());
      if (idx >= 0) {
        cur.splice(idx, 1);
      } else {
        cur.push(langValue);
      }
      if (cur.length === 0) {
        cur.push(langValue);
      }
      return {
        ...prev,
        codingQuestions: prev.codingQuestions.map((cq, i) =>
          i === qIndex ? { ...cq, allowedLanguages: cur } : cq
        ),
      };
    });
  };

  const addTestCase = (qIndex: number) => {
    const tc: TestCase = {
      id: `tc-${Date.now()}`,
      input: '',
      expectedOutput: '',
    };
    setFormData((prev) => ({
      ...prev,
      codingQuestions: prev.codingQuestions.map((cq, i) =>
        i === qIndex ? { ...cq, testCases: [...(cq.testCases || []), tc] } : cq
      ),
    }));
  };

  const updateTestCase = (qIndex: number, tcIndex: number, field: keyof TestCase, value: string) => {
    setFormData((prev) => ({
      ...prev,
      codingQuestions: prev.codingQuestions.map((cq, i) => {
        if (i !== qIndex) return cq;
        const list = [...(cq.testCases || [])];
        if (!list[tcIndex]) return cq;
        list[tcIndex] = { ...list[tcIndex], [field]: value };
        return { ...cq, testCases: list };
      }),
    }));
  };

  const removeTestCase = (qIndex: number, tcIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      codingQuestions: prev.codingQuestions.map((cq, i) => {
        if (i !== qIndex) return cq;
        const list = (cq.testCases || []).filter((_, j) => j !== tcIndex);
        return { ...cq, testCases: list };
      }),
    }));
  };

  const selectTemplatePackItem = (index: number) => {
    const src = templatePackList[index];
    setSelectedTemplateIndex(index);
    setTemplateStaging(
      normalizeCodingQuestion({
        ...src,
        id: `staging-${Date.now()}`,
        testCases: (src.testCases || []).map((tc, j) => ({
          id: tc.id || `tc-stg-${j}`,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
        })),
      })
    );
  };

  const updateTemplateStaging = (field: keyof CodingQuestion, value: unknown) => {
    setTemplateStaging((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const toggleTemplateStagingLanguage = (langValue: string) => {
    setTemplateStaging((prev) => {
      if (!prev) return prev;
      const cur = [...(prev.allowedLanguages || [])];
      const idx = cur.findIndex((l) => l.toLowerCase() === langValue.toLowerCase());
      if (idx >= 0) cur.splice(idx, 1);
      else cur.push(langValue);
      if (cur.length === 0) cur.push(langValue);
      return { ...prev, allowedLanguages: cur };
    });
  };

  const updateTemplateStagingTestCase = (tcIndex: number, field: keyof TestCase, value: string) => {
    setTemplateStaging((prev) => {
      if (!prev) return prev;
      const list = [...(prev.testCases || [])];
      if (!list[tcIndex]) return prev;
      list[tcIndex] = { ...list[tcIndex], [field]: value };
      return { ...prev, testCases: list };
    });
  };

  const addTemplateStagingToJob = () => {
    if (!templateStaging) return;
    const toAdd = normalizeCodingQuestion({
      ...templateStaging,
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    });
    setFormData((prev) => {
      const next = [...prev.codingQuestions, toAdd];
      const newIdx = next.length - 1;
      queueMicrotask(() => setExpandedQuestion(newIdx));
      return { ...prev, codingQuestions: next };
    });
  };

  const addAllTemplatePackToJob = () => {
    setFormData((prev) => {
      const additions = templatePackList.map((q, i) =>
        normalizeCodingQuestion({
          ...q,
          id: `q-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
        })
      );
      const next = [...prev.codingQuestions, ...additions];
      const firstNew = prev.codingQuestions.length;
      queueMicrotask(() => setExpandedQuestion(firstNew));
      return { ...prev, codingQuestions: next };
    });
  };

  const handleUpdateCodingQuestion = (index: number, field: keyof CodingQuestion, value: any) => {
    setFormData((prev) => ({
      ...prev,
      codingQuestions: prev.codingQuestions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const handleRemoveCodingQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      codingQuestions: prev.codingQuestions.filter((_, i) => i !== index),
    }));
    if (expandedQuestion === index) {
      setExpandedQuestion(null);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Job title is required');
      return false;
    }
    if (!formData.companyName.trim()) {
      setError('Company name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Job description is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    if (formData.requiredSkills.length === 0) {
      setError('At least one skill is required');
      return false;
    }

    // Validate coding questions
    for (let i = 0; i < formData.codingQuestions.length; i++) {
      const q = formData.codingQuestions[i];
      if (!q.question.trim()) {
        setError(`Coding question ${i + 1}: Question title is required`);
        return false;
      }
      if (!q.description.trim()) {
        setError(`Coding question ${i + 1}: Description is required`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    setError(null);

    if (!validateForm()) return;

    try {
      setLoading(true);
      const hrUser = getHRUserInfo();

      if (isEditing && jobId) {
        await jobService.updateJob(jobId, formData);
      } else {
        await jobService.createJob(formData, hrUser?.id || 'hr-user');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/hr/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingJob) {
    return (
      <PageContainer>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: colors.primary }} />
          </Box>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Layout with arrow on left - Centered */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 2 }}>
          {/* Back Arrow - Left side */}
          <IconButton
            onClick={() => navigate('/hr/dashboard')}
            sx={{
              mt: 1,
              width: 48,
              height: 48,
              background: colors.surface,
              border: `2px solid ${colors.accent}`,
              color: colors.secondary,
              boxShadow: `0 4px 15px ${colors.primary}15`,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: colors.primary,
                borderColor: colors.primary,
                color: 'white',
                transform: 'translateX(-4px)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          {/* Form Card - Right side */}
          <Box sx={{ width: '100%', maxWidth: 800 }}>
            <FormCard>
          {/* Header */}
          <HeaderSection>
            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WorkOutlineIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.5px' }}>
                  {isEditing ? 'Edit Job Post' : 'Create Job Post'}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {isEditing
                    ? 'Update your job posting details'
                    : 'Fill in the details to create a new job posting'}
                </Typography>
              </Box>
            </Box>
          </HeaderSection>

          <CardContent sx={{ p: 4 }}>
            {/* Alerts */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  border: `1px solid ${alpha(colors.error, 0.3)}`,
                }} 
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  border: `1px solid ${alpha(colors.success, 0.3)}`,
                }}
              >
                Job {isEditing ? 'updated' : 'created'} successfully! Redirecting...
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Job Title */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  freeSolo
                  options={jobTitleSuggestions}
                  value={formData.title}
                  onChange={(_, newValue) => handleInputChange('title', (newValue as string) || '')}
                  onInputChange={onJobTitleInputChange}
                  filterOptions={(options) => options}
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      fullWidth
                      label="Job Title"
                      required
                      placeholder="e.g., Senior React Developer"
                    />
                  )}
                  slotProps={{
                    paper: {
                      sx: {
                        maxHeight: 240,
                      },
                    },
                  }}
                />
              </Grid>

              {/* Company Name */}
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Company Name"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  required
                  placeholder="e.g., TechCorp Inc."
                />
              </Grid>

              {/* Location */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  freeSolo
                  options={locationSuggestions}
                  value={formData.location || ''}
                  onChange={(_, newValue) => handleInputChange('location', (newValue as string) || '')}
                  onInputChange={(_, newInputValue) => {
                    handleInputChange('location', newInputValue);
                    if (newInputValue && newInputValue.trim().length >= 2) {
                      handleLocationSearch(newInputValue);
                    } else {
                      setLocationSuggestions([]);
                    }
                  }}
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      fullWidth
                      label="Location"
                      required
                      placeholder="City or town (India, USA, UK, Canada)..."
                    />
                  )}
                />
              </Grid>

              {/* Job Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ '&.Mui-focused': { color: colors.primary } }}>Job Type</InputLabel>
                  <StyledSelect
                    value={formData.jobType}
                    onChange={(e) => handleInputChange('jobType', e.target.value)}
                    label="Job Type"
                  >
                    {Object.entries(JOB_TYPES).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              </Grid>

              {/* Experience Level */}
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ '&.Mui-focused': { color: colors.primary } }}>Experience Level</InputLabel>
                  <StyledSelect
                    value={formData.experienceLevel}
                    onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                    label="Experience Level"
                  >
                    {Object.entries(EXPERIENCE_LEVELS).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              </Grid>

              {/* Job Description */}
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Job Description"
                  multiline
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                />
              </Grid>

              {/* Required Skills */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: colors.secondary }}>
                  Required Skills
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                  <Autocomplete
                    freeSolo
                    options={skillSuggestions.filter((s) => !formData.requiredSkills.includes(s))}
                    value={skillInput || null}
                    onChange={(_, newValue) => {
                      if (newValue) {
                        setSkillInput(newValue);
                      }
                    }}
                    onInputChange={onSkillInputChange}
                    filterOptions={(options) => options}
                    fullWidth
                    renderInput={(params) => (
                      <StyledTextField
                        {...params}
                        size="small"
                        label="Add a skill"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        placeholder="Select or type a skill..."
                      />
                    )}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddSkill}
                    disabled={!skillInput.trim()}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                      boxShadow: `0 4px 15px ${colors.primary}40`,
                      '&:hover': {
                        boxShadow: `0 6px 20px ${colors.primary}50`,
                      },
                      '&:disabled': {
                        background: colors.accent,
                      },
                    }}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {formData.requiredSkills.map((skill, index) => (
                    <SkillChip
                      key={index}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
                    />
                  ))}
                </Box>
                {formData.requiredSkills.length === 0 && (
                  <Typography variant="caption" sx={{ color: colors.textLight, mt: 1, display: 'block' }}>
                    Add at least one required skill
                  </Typography>
                )}
              </Grid>

              {/* Coding Questions Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 3, borderColor: colors.accent }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 6px 20px ${colors.primary}30`,
                    }}
                  >
                    <CodeIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.secondary }}>
                      Coding Questions
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textLight }}>
                      Add coding challenges for candidates to complete during their application
                    </Typography>
                  </Box>
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    mb: 3,
                    borderRadius: 3,
                    border: `1px solid ${colors.accent}`,
                    bgcolor: alpha(colors.primary, 0.04),
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <AutoAwesomeIcon sx={{ color: colors.primary }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.secondary }}>
                          VerTechie template pack
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.textLight }}>
                          6 questions (2 easy, 2 medium, 2 hard) — each with 3 test cases. Click one to fill the form below, then add to the job.
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={addAllTemplatePackToJob}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                      }}
                    >
                      Add all 6 to job
                    </Button>
                  </Box>
                  <List dense disablePadding sx={{ mb: templateStaging ? 2 : 0 }}>
                    {templatePackList.map((q, index) => (
                      <ListItemButton
                        key={q.id}
                        selected={selectedTemplateIndex === index}
                        onClick={() => selectTemplatePackItem(index)}
                        sx={{
                          borderRadius: 2,
                          mb: 0.5,
                          border: `1px solid ${alpha(colors.accent, 0.6)}`,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography component="span" fontWeight={600}>
                                {index + 1}. {q.question}
                              </Typography>
                              <Chip size="small" label={DIFFICULTY_LABELS[q.difficulty]} sx={{ height: 22 }} />
                            </Box>
                          }
                          secondary={`${(q.testCases || []).length} test cases`}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItemButton>
                    ))}
                  </List>

                  <Collapse in={Boolean(templateStaging)}>
                    {templateStaging && (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: `1px dashed ${colors.primary}50`,
                          bgcolor: alpha(colors.surface, 0.9),
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: colors.secondary }}>
                          Review & edit — then add to job
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <StyledTextField
                              fullWidth
                              label="Question title"
                              value={templateStaging.question}
                              onChange={(e) => updateTemplateStaging('question', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                              <InputLabel>Difficulty</InputLabel>
                              <StyledSelect
                                value={templateStaging.difficulty}
                                label="Difficulty"
                                onChange={(e) =>
                                  updateTemplateStaging('difficulty', e.target.value as CodingQuestion['difficulty'])
                                }
                              >
                                <MenuItem value="easy">Easy</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="hard">Hard</MenuItem>
                              </StyledSelect>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <StyledTextField
                              fullWidth
                              label="Description"
                              multiline
                              rows={3}
                              value={templateStaging.description}
                              onChange={(e) => updateTemplateStaging('description', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <StyledTextField
                              fullWidth
                              label="Starter code"
                              multiline
                              minRows={4}
                              value={templateStaging.starterCode || ''}
                              onChange={(e) => updateTemplateStaging('starterCode', e.target.value)}
                              InputProps={{
                                sx: { fontFamily: '"Fira Code", Consolas, monospace', fontSize: '0.875rem' },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: colors.textLight, display: 'block', mb: 1 }}>
                              Allowed languages
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {CODING_LANGUAGE_OPTIONS.map((opt) => {
                                const selected = (templateStaging.allowedLanguages || []).some(
                                  (l) => l.toLowerCase() === opt.value
                                );
                                return (
                                  <Chip
                                    key={opt.value}
                                    label={opt.label}
                                    onClick={() => toggleTemplateStagingLanguage(opt.value)}
                                    color={selected ? 'primary' : 'default'}
                                    variant={selected ? 'filled' : 'outlined'}
                                    sx={{ fontWeight: 600 }}
                                  />
                                );
                              })}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <StyledTextField
                              fullWidth
                              type="number"
                              label="Time limit (minutes)"
                              value={templateStaging.timeLimitMinutes ?? 30}
                              onChange={(e) =>
                                updateTemplateStaging(
                                  'timeLimitMinutes',
                                  Math.max(5, parseInt(e.target.value, 10) || 30)
                                )
                              }
                              inputProps={{ min: 5, max: 240 }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <StyledTextField
                              fullWidth
                              label="Sample input (shown to candidate)"
                              multiline
                              minRows={2}
                              value={templateStaging.sampleInput || ''}
                              onChange={(e) => updateTemplateStaging('sampleInput', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <StyledTextField
                              fullWidth
                              label="Sample output (shown to candidate)"
                              multiline
                              minRows={2}
                              value={templateStaging.sampleOutput || ''}
                              onChange={(e) => updateTemplateStaging('sampleOutput', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: colors.textLight, display: 'block', mb: 1 }}>
                              Hidden test cases (auto-judge)
                            </Typography>
                            {(templateStaging.testCases || []).map((tc, tcIdx) => (
                              <Grid container spacing={1} key={tc.id || tcIdx} sx={{ mb: 1, alignItems: 'flex-start' }}>
                                <Grid item xs={12} md={5}>
                                  <StyledTextField
                                    fullWidth
                                    size="small"
                                    label={`Test ${tcIdx + 1} — Input`}
                                    multiline
                                    minRows={2}
                                    value={tc.input}
                                    onChange={(e) => updateTemplateStagingTestCase(tcIdx, 'input', e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={12} md={5}>
                                  <StyledTextField
                                    fullWidth
                                    size="small"
                                    label={`Test ${tcIdx + 1} — Expected output`}
                                    multiline
                                    minRows={2}
                                    value={tc.expectedOutput}
                                    onChange={(e) =>
                                      updateTemplateStagingTestCase(tcIdx, 'expectedOutput', e.target.value)
                                    }
                                  />
                                </Grid>
                              </Grid>
                            ))}
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              variant="contained"
                              onClick={addTemplateStagingToJob}
                              sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                              }}
                            >
                              Add this question to job
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    )}
                  </Collapse>
                </Paper>

                {/* Coding Questions List */}
                {formData.codingQuestions.map((question, index) => (
                  <CodingQuestionCard key={question.id} elevation={0}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            boxShadow: `0 4px 12px ${colors.primary}30`,
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.secondary }}>
                          {question.question || `Question ${index + 1}`}
                        </Typography>
                        <Chip
                          label={DIFFICULTY_LABELS[question.difficulty]}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            borderRadius: 2,
                            bgcolor:
                              question.difficulty === 'easy'
                                ? alpha(colors.success, 0.15)
                                : question.difficulty === 'medium'
                                ? alpha(colors.warning, 0.15)
                                : alpha(colors.error, 0.15),
                            color:
                              question.difficulty === 'easy'
                                ? colors.success
                                : question.difficulty === 'medium'
                                ? colors.warning
                                : colors.error,
                            border: `1px solid ${
                              question.difficulty === 'easy'
                                ? alpha(colors.success, 0.3)
                                : question.difficulty === 'medium'
                                ? alpha(colors.warning, 0.3)
                                : alpha(colors.error, 0.3)
                            }`,
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCodingQuestion(index);
                          }}
                          sx={{
                            color: colors.error,
                            '&:hover': {
                              background: alpha(colors.error, 0.1),
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: colors.secondary }}>
                          {expandedQuestion === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                    </Box>

                    <Collapse in={expandedQuestion === index}>
                      <Box sx={{ mt: 3, pl: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={8}>
                            <StyledTextField
                              fullWidth
                              label="Question Title"
                              value={question.question}
                              onChange={(e) =>
                                handleUpdateCodingQuestion(index, 'question', e.target.value)
                              }
                              placeholder="e.g., Implement a debounce function"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                              <InputLabel sx={{ '&.Mui-focused': { color: colors.primary } }}>Difficulty</InputLabel>
                              <StyledSelect
                                value={question.difficulty}
                                onChange={(e) =>
                                  handleUpdateCodingQuestion(index, 'difficulty', e.target.value)
                                }
                                label="Difficulty"
                              >
                                <MenuItem value="easy">Easy</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="hard">Hard</MenuItem>
                              </StyledSelect>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <StyledTextField
                              fullWidth
                              label="Description"
                              multiline
                              rows={4}
                              value={question.description}
                              onChange={(e) =>
                                handleUpdateCodingQuestion(index, 'description', e.target.value)
                              }
                              placeholder="Provide detailed instructions, examples, and expected behavior..."
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <Button
                              type="button"
                              startIcon={<TuneIcon />}
                              onClick={() => toggleCodingAdv(question.id)}
                              sx={{
                                mt: 0.5,
                                textTransform: 'none',
                                fontWeight: 700,
                                color: colors.primary,
                                borderRadius: 2,
                              }}
                            >
                              {codingAdvOpen[question.id] ? 'Hide' : 'Starter code, languages & proctoring'}
                            </Button>
                          </Grid>

                          <Grid item xs={12}>
                            <Collapse in={Boolean(codingAdvOpen[question.id])}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2.5,
                                  borderRadius: 3,
                                  border: `1px solid ${colors.accent}60`,
                                  bgcolor: alpha(colors.primary, 0.03),
                                }}
                              >
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: colors.secondary }}>
                                  Candidate IDE & assessment rules
                                </Typography>
                                <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                    <StyledTextField
                                      fullWidth
                                      label="Starter code (optional)"
                                      multiline
                                      minRows={6}
                                      value={question.starterCode || ''}
                                      onChange={(e) =>
                                        handleUpdateCodingQuestion(index, 'starterCode', e.target.value)
                                      }
                                      placeholder="// Candidates see this when they open the question"
                                      InputProps={{
                                        sx: { fontFamily: '"Fira Code", Consolas, monospace', fontSize: '0.875rem' },
                                      }}
                                    />
                                  </Grid>

                                  <Grid item xs={12}>
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: colors.textLight, display: 'block', mb: 1 }}>
                                      Allowed languages
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                      {CODING_LANGUAGE_OPTIONS.map((opt) => {
                                        const selected = (question.allowedLanguages || []).some(
                                          (l) => l.toLowerCase() === opt.value
                                        );
                                        return (
                                          <Chip
                                            key={opt.value}
                                            label={opt.label}
                                            onClick={() => toggleAllowedLanguage(index, opt.value)}
                                            color={selected ? 'primary' : 'default'}
                                            variant={selected ? 'filled' : 'outlined'}
                                            sx={{
                                              fontWeight: 600,
                                              borderColor: colors.accent,
                                              ...(selected && {
                                                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                                                color: '#fff',
                                              }),
                                            }}
                                          />
                                        );
                                      })}
                                    </Box>
                                  </Grid>

                                  {(question.allowedLanguages || []).some((l) => l.toLowerCase() === 'sql') && (
                                    <Grid item xs={12}>
                                      <StyledTextField
                                        fullWidth
                                        label="SQLite schema (DDL) for SQL auto-evaluation"
                                        multiline
                                        minRows={4}
                                        value={question.sqlSchema || ''}
                                        onChange={(e) =>
                                          handleUpdateCodingQuestion(index, 'sqlSchema', e.target.value)
                                        }
                                        placeholder={
                                          'CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary REAL);'
                                        }
                                        InputProps={{
                                          sx: {
                                            fontFamily: '"Fira Code", Consolas, monospace',
                                            fontSize: '0.875rem',
                                          },
                                        }}
                                      />
                                    </Grid>
                                  )}

                                  <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                      fullWidth
                                      type="number"
                                      label="Time limit (minutes per question)"
                                      value={question.timeLimitMinutes ?? 30}
                                      onChange={(e) =>
                                        handleUpdateCodingQuestion(
                                          index,
                                          'timeLimitMinutes',
                                          Math.max(5, parseInt(e.target.value, 10) || 30)
                                        )
                                      }
                                      inputProps={{ min: 5, max: 240 }}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                      fullWidth
                                      type="number"
                                      label="Max tab switches before lock"
                                      value={question.maxTabSwitches ?? 2}
                                      onChange={(e) =>
                                        handleUpdateCodingQuestion(
                                          index,
                                          'maxTabSwitches',
                                          Math.max(0, parseInt(e.target.value, 10) || 0)
                                        )
                                      }
                                      inputProps={{ min: 0, max: 20 }}
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                      fullWidth
                                      label="Sample input (shown to candidate)"
                                      multiline
                                      minRows={2}
                                      value={question.sampleInput || ''}
                                      onChange={(e) =>
                                        handleUpdateCodingQuestion(index, 'sampleInput', e.target.value)
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                      fullWidth
                                      label="Sample output (shown to candidate)"
                                      multiline
                                      minRows={2}
                                      value={question.sampleOutput || ''}
                                      onChange={(e) =>
                                        handleUpdateCodingQuestion(index, 'sampleOutput', e.target.value)
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <StyledTextField
                                      fullWidth
                                      label="Expected result / hint (optional)"
                                      multiline
                                      minRows={2}
                                      value={question.expectedOutput || ''}
                                      onChange={(e) =>
                                        handleUpdateCodingQuestion(index, 'expectedOutput', e.target.value)
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                                      <Typography variant="caption" sx={{ fontWeight: 600, color: colors.textLight }}>
                                        Reference test cases (for your rubric; auto-judge can use later)
                                      </Typography>
                                      <Button
                                        size="small"
                                        startIcon={<AddCaseIcon />}
                                        onClick={() => addTestCase(index)}
                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                      >
                                        Add case
                                      </Button>
                                    </Box>
                                    {(question.testCases || []).map((tc, tcIdx) => (
                                      <Grid container spacing={1} key={tc.id} sx={{ mt: 0.5, mb: 1, alignItems: 'flex-start' }}>
                                        <Grid item xs={12} md={5}>
                                          <StyledTextField
                                            fullWidth
                                            size="small"
                                            label="Input"
                                            multiline
                                            minRows={2}
                                            value={tc.input}
                                            onChange={(e) => updateTestCase(index, tcIdx, 'input', e.target.value)}
                                          />
                                        </Grid>
                                        <Grid item xs={12} md={5}>
                                          <StyledTextField
                                            fullWidth
                                            size="small"
                                            label="Expected output"
                                            multiline
                                            minRows={2}
                                            value={tc.expectedOutput}
                                            onChange={(e) =>
                                              updateTestCase(index, tcIdx, 'expectedOutput', e.target.value)
                                            }
                                          />
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                          <Tooltip title="Remove test case">
                                            <IconButton
                                              color="error"
                                              size="small"
                                              onClick={() => removeTestCase(index, tcIdx)}
                                              sx={{ mt: 1 }}
                                            >
                                              <DeleteIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        </Grid>
                                      </Grid>
                                    ))}
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={question.requireFullScreen !== false}
                                          onChange={(e) =>
                                            handleUpdateCodingQuestion(index, 'requireFullScreen', e.target.checked)
                                          }
                                          color="primary"
                                        />
                                      }
                                      label="Require fullscreen to start"
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={question.blockCopyPaste !== false}
                                          onChange={(e) =>
                                            handleUpdateCodingQuestion(index, 'blockCopyPaste', e.target.checked)
                                          }
                                          color="primary"
                                        />
                                      }
                                      label="Block copy / paste in editor"
                                    />
                                  </Grid>
                                </Grid>
                              </Paper>
                            </Collapse>
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </CodingQuestionCard>
                ))}

                {/* Add Question Button */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, flexWrap: 'wrap' }}>
                  <AddQuestionButton
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddCodingQuestion}
                  >
                    Add Coding Question
                  </AddQuestionButton>
                </Box>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3, pt: 3, borderTop: `1px solid ${colors.accent}` }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/hr/dashboard')}
                    sx={{ 
                      borderRadius: 3, 
                      px: 4,
                      fontWeight: 600,
                      borderColor: colors.accent,
                      color: colors.secondary,
                      '&:hover': {
                        borderColor: colors.primary,
                        background: `${colors.accent}30`,
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <SubmitButton
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : isEditing ? 'Update Job' : 'Create Job'}
                  </SubmitButton>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
            </FormCard>
          </Box>
        </Box>
      </Container>

    </PageContainer>
  );
};

export default CreateJobPost;


