/**
 * Job Application Page
 * Allows users to apply for jobs by answering screening questions
 * Profile is automatically matched based on experience, skills, and roles
 * No resume upload - uses profile data for matching
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Chip,
  Alert,
  LinearProgress,
  Divider,
  Avatar,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import { applicationService, jobService } from '../../services/jobPortalService';
import VideoScreeningRecorder from '../../components/screening/VideoScreeningRecorder';
import { getApiUrl } from '../../config/api';
import { ABOVE_BOTTOM_NAV_OFFSET_PX } from '../../constants/layout';
import { fetchWithAuth } from '../../utils/apiInterceptor';
import { stopAllDocumentMediaStreams } from '../../utils/stopMediaCapture';

// Theme Colors
const colors = {
  primary: '#0d47a1',
  primaryDark: '#1a237e',
  primaryLight: '#5AC8FA',
  secondary: '#0077B5',
  accent: '#5AC8FA',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const PageContainer = styled(Box)({
  minHeight: '100%',
  background: `linear-gradient(160deg, #e8eef7 0%, #f0f4fa 30%, #f5f7fa 60%, #fafbfd 100%)`,
});

const HeaderCard = styled(Paper)({
  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 50%, ${colors.primaryDark} 100%)`,
  borderRadius: 24,
  padding: '32px',
  color: 'white',
  marginBottom: '24px',
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeInUp} 0.6s ease-out`,
  boxShadow: `0 20px 60px ${colors.primary}40`,
});

const ContentCard = styled(Card)({
  borderRadius: 20,
  boxShadow: `0 10px 40px ${colors.primary}10`,
  border: `1px solid ${alpha(colors.accent, 0.3)}`,
  animation: `${fadeInUp} 0.6s ease-out`,
});

const QuestionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  marginBottom: theme.spacing(2),
  border: `2px solid transparent`,
  transition: 'all 0.3s ease',
  '&:focus-within': {
    borderColor: colors.primary,
    boxShadow: `0 0 0 4px ${alpha(colors.primary, 0.1)}`,
  },
}));

const MatchScoreCard = styled(Paper)({
  padding: '24px',
  borderRadius: 20,
  background: `linear-gradient(135deg, ${alpha(colors.success, 0.1)} 0%, ${alpha(colors.primary, 0.05)} 100%)`,
  border: `1px solid ${alpha(colors.success, 0.3)}`,
  textAlign: 'center',
});

const SkillChip = styled(Chip)<{ matched?: boolean }>(({ matched }) => ({
  margin: '4px',
  fontWeight: 600,
  background: matched ? alpha(colors.success, 0.15) : alpha(colors.accent, 0.1),
  color: matched ? colors.success : colors.primary,
  border: `1px solid ${matched ? alpha(colors.success, 0.3) : alpha(colors.accent, 0.3)}`,
}));

const SubmitButton = styled(Button)({
  borderRadius: 14,
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1.1rem',
  padding: '16px 48px',
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
  color: 'white',
  boxShadow: `0 10px 30px ${colors.primary}50`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondary} 100%)`,
    transform: 'translateY(-2px)',
    boxShadow: `0 15px 40px ${colors.primary}60`,
  },
  '&.Mui-disabled': {
    background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
    color: 'rgba(255, 255, 255, 0.7)',
    boxShadow: 'none',
  },
});

// Types
interface ScreeningQuestion {
  id: string;
  question: string;
  type: 'text' | 'yesno' | 'multiple' | 'number' | 'verbal' | 'video';
  required: boolean;
  options?: string[];
  maxVideoSeconds?: number;
}

interface UserProfile {
  name: string;
  title: string;
  location: string;
  yearsExperience: number;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    responsibilities: string[];
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  requiredSkills: string[];
  experienceLevel: string;
  collectApplicantLocation: boolean;
  hasCodingQuestions: boolean;
  codingQuestionCount: number;
}

const getScreeningAnswersStorageKey = (jobId: string) => `job-application-screening:${jobId}`;

const JobApply: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionErrors, setQuestionErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [locationConsent, setLocationConsent] = useState(false);
  const [locationError, setLocationError] = useState('');
  
  // Job data from API
  const [job, setJob] = useState<Job>({
    id: jobId || '',
    title: '',
    company: '',
    location: '',
    requiredSkills: [],
    experienceLevel: '',
    collectApplicantLocation: false,
    hasCodingQuestions: false,
    codingQuestionCount: 0,
  });
  
  // User profile from localStorage
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    title: '',
    location: '',
    yearsExperience: 0,
    skills: [],
    experience: [],
    education: [],
  });
  
  // Default screening questions (can be overridden by job-specific questions)
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([]);

  const parseQuestionRequired = (value: unknown): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
      if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
    }
    // Keep default as required when source doesn't provide a value.
    return true;
  };

  const parseQuestionType = (value: unknown): ScreeningQuestion['type'] => {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'yesno' || normalized === 'yes_no' || normalized === 'boolean') return 'yesno';
    if (normalized === 'multiple' || normalized === 'multiple_choice' || normalized === 'mcq') return 'multiple';
    if (normalized === 'number' || normalized === 'numeric') return 'number';
    if (normalized === 'verbal') return 'verbal';
    if (normalized === 'video' || normalized === 'video_response') return 'video';
    return 'text';
  };

  const parseQuestionTypeFromDescription = (description?: string): ScreeningQuestion['type'] => {
    const raw = String(description || '').toLowerCase();
    const match = raw.match(/type:\s*([a-z_]+)/);
    return parseQuestionType(match?.[1] || '');
  };

  const parseQuestionRequiredFromDescription = (description?: string): boolean => {
    const raw = String(description || '').toLowerCase();
    if (raw.includes('(optional)') || raw.includes('(not required)')) return false;
    if (raw.includes('(required)')) return true;
    return true;
  };

  const parseQuestionOptionsFromDescription = (description?: string): string[] => {
    const raw = String(description || '');
    const match = raw.match(/options:\s*([^|]+)/i);
    if (!match?.[1]) return [];
    return match[1]
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const normalizeSkill = (value: string): string =>
    value.toLowerCase().replace(/\s+/g, ' ').trim();

  const getRequiredSkills = (): string[] =>
    Array.from(new Set((job.requiredSkills || []).map(normalizeSkill).filter(Boolean)));

  const getUserSkills = (): string[] =>
    Array.from(new Set((userProfile.skills || []).map(normalizeSkill).filter(Boolean)));

  const getMatchedRequiredSkills = (): string[] => {
    const required = getRequiredSkills();
    const user = getUserSkills();
    return required.filter((req) => user.some((skill) => skill === req || skill.includes(req) || req.includes(skill)));
  };

  const getTargetYearsForRole = (): number => {
    const level = String(job.experienceLevel || '').toLowerCase();
    if (level.includes('entry')) return 2;
    if (level.includes('mid')) return 5;
    if (level.includes('senior')) return 8;
    if (level.includes('lead') || level.includes('principal')) return 12;
    return 5;
  };

  // Calculate match score
  const calculateMatchScore = () => {
    const requiredSkills = getRequiredSkills();
    const matched = getMatchedRequiredSkills();
    const targetYears = getTargetYearsForRole();
    const experienceYears = Math.max(0, Number(userProfile.yearsExperience) || 0);
    const experienceMatch = Math.min(100, (experienceYears / targetYears) * 100);

    if (requiredSkills.length === 0) {
      return Math.round(experienceMatch);
    }

    const skillMatch = (matched.length / requiredSkills.length) * 100;
    return Math.round((skillMatch * 0.75) + (experienceMatch * 0.25));
  };
  
  const matchScore = calculateMatchScore();
  const matchedSkills = getMatchedRequiredSkills();

  const validateQuestionAnswer = (question: ScreeningQuestion, rawValue: string): string => {
    const value = (rawValue || '').trim();

    if (question.required && !value) return 'This question is required';
    if (!value) return '';

    if (question.type === 'text' || question.type === 'verbal') {
      if (/^\d+([.,]\d+)?$/.test(value)) {
        return 'Numbers-only answers are not allowed for this question';
      }
      if (!/[A-Za-z]/.test(value)) {
        return 'Please include letters in your answer';
      }
      return '';
    }

    if (question.type === 'number') {
      if (!/^-?\d+(\.\d+)?$/.test(value)) return 'Please enter a valid number';
      return '';
    }

    if (question.type === 'yesno') {
      if (value !== 'yes' && value !== 'no') return 'Please choose Yes or No';
      return '';
    }

    if (question.type === 'video') {
      if (!value.trim()) return question.required ? 'Video answer is required' : '';
      if (!value.startsWith('/uploads/') && !value.startsWith('http')) {
        return 'Please record and upload your video';
      }
      return '';
    }

    if (question.type === 'multiple') {
      const options = question.options || [];
      if (options.length > 0 && !options.includes(value)) return 'Please select a valid option';
      return '';
    }

    return '';
  };

  const reverseGeocodeApplicantLocation = async (
    lat: number,
    lng: number
  ): Promise<Record<string, unknown> | null> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=12&addressdetails=1`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );
      if (!res.ok) return null;
      const data = await res.json();
      const address = data?.address || {};
      return {
        city: address.city || address.town || address.village || address.hamlet || '',
        region: address.state || address.county || '',
        country: address.country || '',
        postcode: address.postcode || '',
        display_name: data?.display_name || '',
        source: 'reverse_geocode',
      };
    } catch {
      return null;
    }
  };

  const requestApplicantLocation = async (): Promise<{ lat: number; lng: number; context?: Record<string, unknown> } | null> => {
    if (!job.collectApplicantLocation) return null;
    if (!locationConsent) return null;
    if (!navigator.geolocation) {
      return null;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const context = await reverseGeocodeApplicantLocation(lat, lng);
          resolve({
            lat,
            lng,
            context: context || undefined,
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            reject(new Error('You chose to share location, but browser location permission is blocked. Please enable location access or uncheck the consent box and continue.'));
            return;
          }
          reject(new Error('Unable to capture your current location. Please try again.'));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load job from API/localStorage
        if (jobId) {
          const jobData = await jobService.getJobById(jobId);
          if (jobData) {
            setJob({
              id: jobData.id,
              title: jobData.title,
              company: jobData.companyName || '',
              location: jobData.location || '',
              requiredSkills: jobData.requiredSkills || [],
              experienceLevel: jobData.experienceLevel || '',
              collectApplicantLocation: Boolean(jobData.collect_applicant_location),
              hasCodingQuestions: Array.isArray(jobData.codingQuestions) && jobData.codingQuestions.length > 0,
              codingQuestionCount: Array.isArray(jobData.codingQuestions) ? jobData.codingQuestions.length : 0,
            });
            // Single source of truth: use screening questions only.
            const rawScreeningQuestions = jobData.screeningQuestions ?? (jobData as any).screening_questions ?? [];
            let screeningQuestions = Array.isArray(rawScreeningQuestions) ? rawScreeningQuestions : [];
            if (!Array.isArray(rawScreeningQuestions) && typeof rawScreeningQuestions === 'string') {
              try {
                const parsed = JSON.parse(rawScreeningQuestions);
                screeningQuestions = Array.isArray(parsed) ? parsed : [];
              } catch {
                screeningQuestions = [];
              }
            }

            const fallbackQuestions = Array.isArray(jobData.codingQuestions)
              ? jobData.codingQuestions.map((q: any, idx: number) => ({
                  id: String(q.id || idx + 1),
                  question: String(q.question || '').trim(),
                  type: parseQuestionTypeFromDescription(q.description),
                  required: parseQuestionRequiredFromDescription(q.description),
                  options: parseQuestionOptionsFromDescription(q.description),
                })).filter((q) => q.question.length > 0)
              : [];

            const resolvedQuestions = screeningQuestions.length > 0 ? screeningQuestions : fallbackQuestions;

            if (resolvedQuestions.length > 0) {
              setQuestions(resolvedQuestions
                .map((q: any, idx: number) => {
                  const questionText = String(q.question || '').trim();
                  return {
                    id: String(q.id || idx + 1),
                    question: questionText,
                    type: parseQuestionType(q.type),
                    required: parseQuestionRequired(q.required),
                    options: Array.isArray(q.options) ? q.options : [],
                    maxVideoSeconds:
                      typeof q.maxVideoSeconds === 'number'
                        ? q.maxVideoSeconds
                        : typeof q.max_video_seconds === 'number'
                          ? q.max_video_seconds
                          : 120,
                  };
                })
                .filter((q) => q.question.length > 0)
              );
            } else {
              // If no screening questions are configured, show nothing.
              setQuestions([]);
            }
          }
        }

        // Load user profile from backend API
        const hasAuthToken = !!localStorage.getItem('authToken');
        if (hasAuthToken) {
          try {
            // Fetch user profile from backend (shared auth/url pattern)
            const profileRes = await fetchWithAuth(getApiUrl('/users/me/profile'));
            
            let userSkills: string[] = [];
            let userExperiences: any[] = [];
            let userEducations: any[] = [];
            let userName = '';
            let userTitle = '';
            let userLocation = '';
            let yearsExp = 0;
            
            if (profileRes.ok) {
              const profile = await profileRes.json();
              userSkills = profile.skills || [];
              userTitle = profile.title || profile.headline || '';
              userLocation = profile.location || profile.address || '';
            }
            
            // Fetch experiences
            try {
              const expRes = await fetchWithAuth(getApiUrl('/users/me/experiences'));
              if (expRes.ok) {
                userExperiences = await expRes.json();
                // Calculate years of experience from experiences
                if (userExperiences.length > 0) {
                  const now = new Date().getFullYear();
                  let totalYears = 0;
                  userExperiences.forEach((exp: any) => {
                    const startYear = exp.start_date ? new Date(exp.start_date).getFullYear() : now;
                    const endYear = exp.is_current ? now : (exp.end_date ? new Date(exp.end_date).getFullYear() : now);
                    totalYears += Math.max(0, endYear - startYear);
                    
                    // Also aggregate skills from experiences
                    if (exp.skills && Array.isArray(exp.skills)) {
                      exp.skills.forEach((skill: string) => {
                        if (skill && !userSkills.includes(skill)) {
                          userSkills.push(skill);
                        }
                      });
                    }
                  });
                  yearsExp = totalYears;
                }
              }
            } catch (e) { console.warn('Could not fetch experiences'); }
            
            // Fetch educations
            try {
              const eduRes = await fetchWithAuth(getApiUrl('/users/me/educations'));
              if (eduRes.ok) {
                userEducations = await eduRes.json();
              }
            } catch (e) { console.warn('Could not fetch educations'); }
            
            // Also get basic user info from localStorage
            const userStr = localStorage.getItem('userData');
            if (userStr) {
              const user = JSON.parse(userStr);
              userName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || '';
              if (!userTitle) userTitle = user.title || user.headline || '';
              if (!userLocation) userLocation = user.location || user.address || '';
              if (userSkills.length === 0) userSkills = user.skills || [];
            }
            
            setUserProfile({
              name: userName,
              title: userTitle,
              location: userLocation,
              yearsExperience: yearsExp,
              skills: userSkills,
              experience: userExperiences.map((exp: any) => ({
                title: exp.title || exp.position || '',
                company: exp.company_name || exp.company || '',
                duration: exp.is_current ? 'Present' : (exp.end_date || 'N/A'),
                responsibilities: [],
              })),
              education: userEducations.map((edu: any) => ({
                degree: edu.degree || '',
                school: edu.school_name || edu.institution || '',
                year: String(edu.end_year || edu.graduation_year || ''),
              })),
            });
          } catch (error) {
            console.warn('Error fetching profile from API, using localStorage:', error);
            // Fallback to localStorage
            const userStr = localStorage.getItem('userData');
            if (userStr) {
              const user = JSON.parse(userStr);
              setUserProfile({
                name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || '',
                title: user.title || user.headline || '',
                location: user.location || user.address || '',
                yearsExperience: Number(user.yearsExperience) || 0,
                skills: user.skills || [],
                experience: user.experience || [],
                education: user.education || [],
              });
            }
          }
        } else {
          // No token, fallback to localStorage
          const userStr = localStorage.getItem('userData');
          if (userStr) {
            const user = JSON.parse(userStr);
            setUserProfile({
              name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || '',
              title: user.title || user.headline || '',
              location: user.location || user.address || '',
              yearsExperience: Number(user.yearsExperience) || 0,
              skills: user.skills || [],
              experience: user.experience || [],
              education: user.education || [],
            });
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [jobId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;
    const err = validateQuestionAnswer(question, value);
    setQuestionErrors((prev) => {
      if (!err && !prev[questionId]) return prev;
      const updated = { ...prev };
      if (err) updated[questionId] = err;
      else delete updated[questionId];
      return updated;
    });
  };

  const isQuestionAnswered = (question: ScreeningQuestion) => {
    if (!question.required) return true;
    const v = answers[question.id]?.trim() || '';
    if (question.type === 'video') return v.length > 0;
    return !!v;
  };

  const allRequiredAnswered = questions.filter((q) => q.required).every((q) => isQuestionAnswered(q));

  const handleSubmit = async () => {
    const validationErrors: Record<string, string> = {};
    for (const question of questions) {
      const err = validateQuestionAnswer(question, answers[question.id] || '');
      if (err) validationErrors[question.id] = err;
    }
    if (Object.keys(validationErrors).length > 0) {
      setQuestionErrors(validationErrors);
      setSnackbar({ open: true, message: Object.values(validationErrors)[0], severity: 'error' });
      return;
    }
    
    setSubmitting(true);
    setLocationError('');
    
    try {
      // Get user info from localStorage (using 'userData' key set by login)
      const userStr = localStorage.getItem('userData');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user) {
        setSnackbar({ open: true, message: 'Please login to apply', severity: 'error' });
        setSubmitting(false);
        return;
      }

      const applicantLocation = await requestApplicantLocation();

      const screeningAnswers = questions.map(q => ({
        questionId: q.id,
        question: q.question,
        code: answers[q.id] || '',
        language: q.type,
        submittedAt: new Date().toISOString(),
      }));

      if (job.hasCodingQuestions) {
        const payload = {
          screeningAnswers,
          applicantLocation,
          savedAt: new Date().toISOString(),
        };
        sessionStorage.setItem(getScreeningAnswersStorageKey(job.id), JSON.stringify(payload));
        setSubmitting(false);
        stopAllDocumentMediaStreams();
        navigate(`/techie/jobs/${job.id}/coding-test`);
        return;
      }

      // Submit application to database via API
      await applicationService.applyForJob(
        job.id,
        user.id || user.user_id,
        user.name || `${user.first_name} ${user.last_name}`,
        user.email,
        screeningAnswers,
        applicantLocation,
        {
          screening_answers: screeningAnswers,
        }
      );

      setSubmitting(false);
      stopAllDocumentMediaStreams();
      setSubmitted(true);
      setSnackbar({ open: true, message: 'Application submitted successfully!', severity: 'success' });
    } catch (error: any) {
      setSubmitting(false);
      if (job.collectApplicantLocation && /location/i.test(String(error?.message || ''))) {
        setLocationError(error.message || 'Failed to capture your location.');
      }
      setSnackbar({ 
        open: true, 
        message: error.message || 'Failed to submit application', 
        severity: 'error' 
      });
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress sx={{ color: colors.primary }} />
          </Box>
        </Container>
      </PageContainer>
    );
  }

  if (submitted) {
    return (
      <PageContainer>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <ContentCard sx={{ textAlign: 'center', p: 6 }}>
            <Box sx={{ 
              width: 100, 
              height: 100, 
              borderRadius: '50%', 
              bgcolor: alpha(colors.success, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              animation: `${pulse} 2s ease-in-out infinite`,
            }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: colors.success }} />
            </Box>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2, color: colors.primaryDark }}>
              Application Submitted!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been submitted successfully. 
              The hiring manager will review your profile and responses.
            </Typography>
            <Box sx={{ 
              p: 3, 
              borderRadius: 3, 
              bgcolor: alpha(colors.primary, 0.05), 
              border: `1px solid ${alpha(colors.primary, 0.1)}`,
              mb: 4,
              maxWidth: 400,
              mx: 'auto',
            }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Your Profile Match Score
              </Typography>
              <Typography variant="h2" fontWeight={800} sx={{ color: matchScore >= 70 ? colors.success : matchScore >= 50 ? colors.warning : colors.error }}>
                {matchScore}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Based on skills, experience, and qualifications
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/techie/jobs')}
                sx={{ borderRadius: 3, px: 4 }}
              >
                Browse More Jobs
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/techie/my-applications')}
                sx={{ borderRadius: 3, px: 4, bgcolor: colors.primary }}
              >
                View My Applications
              </Button>
            </Box>
          </ContentCard>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container
        maxWidth={false}
        sx={{
          pt: 3,
          pb: `calc(${ABOVE_BOTTOM_NAV_OFFSET_PX}px + 24px + env(safe-area-inset-bottom, 0px))`,
          px: { xs: 2, sm: 2.5, lg: 3 },
          maxWidth: '1440px',
        }}
      >
        {/* Header */}
        <HeaderCard elevation={0}>
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', lg: 'center' },
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Button
              onClick={() => navigate(-1)}
              sx={{
                minWidth: 'auto',
                p: 0.5,
                color: 'white',
                borderRadius: 999,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <ArrowBackIcon />
            </Button>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                Apply for {job.title || 'Job'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon sx={{ fontSize: 20 }} />
                  <Typography>{job.company || 'Company not available'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 20 }} />
                  <Typography>{job.location || 'Location not available'}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </HeaderCard>

        <Grid container spacing={{ xs: 2, lg: 1 }}>
          {/* Main Content - Questions */}
          <Grid item xs={12} lg={8.5} order={{ xs: 2, lg: 2 }}>
            <ContentCard>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  {questions.length > 0 ? "Screening Questions" : job.hasCodingQuestions ? "Start Coding Assessment" : "Submit Application"}
                </Typography>
                

                {questions.map((question, index) => (
                  <QuestionCard key={question.id} elevation={0}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {index + 1}. {question.question}
                      </Typography>
                      <Chip
                        label={question.required ? 'Required' : 'Optional'}
                        size="small"
                        color={question.required ? 'error' : 'default'}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>

                    {(question.type === 'text' || question.type === 'verbal') && (
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder={
                          question.type === 'verbal'
                            ? 'Type your verbal answer here...'
                            : 'Type your answer here...'
                        }
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        variant="outlined"
                        error={Boolean(questionErrors[question.id])}
                        helperText={questionErrors[question.id] || ' '}
                      />
                    )}

                    {question.type === 'video' && (
                      <Box data-allow-paste="true">
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          Max length {question.maxVideoSeconds ?? 120}s · allow camera & microphone when prompted.
                        </Typography>
                        <VideoScreeningRecorder
                          maxSeconds={Math.min(600, Math.max(15, question.maxVideoSeconds ?? 120))}
                          value={answers[question.id] || ''}
                          onChange={(url) => handleAnswerChange(question.id, url)}
                        />
                        {questionErrors[question.id] && (
                          <Typography variant="caption" sx={{ color: colors.error, mt: 1, display: 'block' }}>
                            {questionErrors[question.id]}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {question.type === 'number' && (
                      <TextField
                        type="number"
                        placeholder="Enter a number"
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        variant="outlined"
                        sx={{ width: 200 }}
                        error={Boolean(questionErrors[question.id])}
                        helperText={questionErrors[question.id] || ' '}
                      />
                    )}

                    {question.type === 'yesno' && (
                      <RadioGroup
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        row
                      >
                        <FormControlLabel 
                          value="yes" 
                          control={<Radio />} 
                          label="Yes" 
                          sx={{ 
                            mr: 4,
                            '& .Mui-checked': { color: colors.primary },
                          }}
                        />
                        <FormControlLabel 
                          value="no" 
                          control={<Radio />} 
                          label="No"
                          sx={{
                            '& .Mui-checked': { color: colors.primary },
                          }}
                        />
                      </RadioGroup>
                    )}

                    {question.type === 'multiple' && question.options && (
                      <RadioGroup
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      >
                        {question.options.map((option) => (
                          <FormControlLabel 
                            key={option} 
                            value={option} 
                            control={<Radio />} 
                            label={option}
                            sx={{
                              '& .Mui-checked': { color: colors.primary },
                            }}
                          />
                        ))}
                      </RadioGroup>
                    )}
                    {(question.type === 'yesno' || question.type === 'multiple') && questionErrors[question.id] && (
                      <Typography variant="caption" sx={{ color: colors.error, mt: 1, display: 'block' }}>
                        {questionErrors[question.id]}
                      </Typography>
                    )}
                  </QuestionCard>
                ))}

                <Divider sx={{ my: 4 }} />

                <Box sx={{ display: 'flex', justifyContent: questions.length > 0 ? 'space-between' : 'flex-end', alignItems: 'center' }}>
                  {questions.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {questions.filter((q) => q.required && isQuestionAnswered(q)).length} of{' '}
                      {questions.filter((q) => q.required).length} required questions answered
                    </Typography>
                  )}
                  <SubmitButton
                    onClick={handleSubmit}
                    disabled={!allRequiredAnswered || submitting}
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  >
                    {submitting ? 'Submitting...' : job.hasCodingQuestions ? 'Continue to Coding Assessment' : 'Submit Application'}
                  </SubmitButton>
                </Box>
              </CardContent>
            </ContentCard>
          </Grid>

          {/* Sidebar - Profile Summary & Match Score */}
          <Grid item xs={12} lg={3.5} order={{ xs: 1, lg: 1 }}>
            {/* Match Score */}
            <MatchScoreCard sx={{ mb: 3 }}>
              <Typography variant="overline" color="text.secondary">
                Profile Match Score
              </Typography>
              <Typography variant="h1" fontWeight={800} sx={{ 
                color: matchScore >= 70 ? colors.success : matchScore >= 50 ? colors.warning : colors.error,
                my: 1,
              }}>
                {matchScore}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={matchScore} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4, 
                  mb: 2,
                  bgcolor: alpha(colors.primary, 0.1),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: matchScore >= 70 ? colors.success : matchScore >= 50 ? colors.warning : colors.error,
                    borderRadius: 4,
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {matchScore >= 70 
                  ? 'Excellent match! You meet most requirements.'
                  : matchScore >= 50
                  ? 'Good match. Consider highlighting relevant experience.'
                  : 'You may want to develop more skills for this role.'
                }
              </Typography>
            </MatchScoreCard>

            {/* Skills Match */}
            <ContentCard sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Skills Match
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {matchedSkills.length} of {job.requiredSkills.length} required skills matched
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {job.requiredSkills.map((skill) => {
                    const isMatched = userProfile.skills.some(s => s.toLowerCase() === skill.toLowerCase());
                    return (
                      <SkillChip 
                        key={skill} 
                        label={skill} 
                        matched={isMatched}
                        icon={isMatched ? <CheckCircleIcon /> : undefined}
                        size="small"
                      />
                    );
                  })}
                </Box>
              </CardContent>
            </ContentCard>

            {job.collectApplicantLocation && (
              <ContentCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 1.5 }}>
                    <LocationOnIcon sx={{ color: colors.primary, mt: 0.2 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Share your current location
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This job requires your consent to capture your current location when you submit the application.
                      </Typography>
                    </Box>
                  </Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={locationConsent}
                        onChange={(e) => {
                          setLocationConsent(e.target.checked);
                          if (e.target.checked) setLocationError('');
                        }}
                        sx={{ '&.Mui-checked': { color: colors.primary } }}
                      />
                    }
                    label="I agree to share my current location for this application."
                  />
                  {locationError && (
                    <Typography variant="caption" sx={{ color: colors.error, display: 'block', mt: 1 }}>
                      {locationError}
                    </Typography>
                  )}
                </CardContent>
              </ContentCard>
            )}

          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default JobApply;
