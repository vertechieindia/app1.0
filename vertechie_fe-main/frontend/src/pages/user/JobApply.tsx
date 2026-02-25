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
import { getApiUrl } from '../../config/api';
import { fetchWithAuth } from '../../utils/apiInterceptor';

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
  type: 'text' | 'yesno' | 'multiple' | 'number';
  required: boolean;
  options?: string[];
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
}

const JobApply: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Job data from API
  const [job, setJob] = useState<Job>({
    id: jobId || '1',
    title: '',
    company: '',
    location: '',
    requiredSkills: [],
    experienceLevel: '',
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
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([
    { id: '1', question: 'How many years of experience do you have with React?', type: 'number', required: true },
    { id: '2', question: 'Are you authorized to work in India?', type: 'yesno', required: true },
    { id: '3', question: 'Are you comfortable working in a remote environment?', type: 'yesno', required: true },
    { id: '4', question: 'What is your expected salary range?', type: 'text', required: false },
    { id: '5', question: 'Why are you interested in this role?', type: 'text', required: true },
    { id: '6', question: 'What is your notice period?', type: 'multiple', required: true, options: ['Immediately', '2 weeks', '1 month', 'More than 1 month'] },
  ]);

  // Calculate match score
  const calculateMatchScore = () => {
    // Handle case when no required skills (avoid divide by zero)
    if (!job.requiredSkills || job.requiredSkills.length === 0) {
      // If no required skills specified, base score on experience only
      const experienceMatch = Math.min(100, (userProfile.yearsExperience / 5) * 100);
      return Math.round(experienceMatch);
    }
    
    // Handle case when user has no skills
    if (!userProfile.skills || userProfile.skills.length === 0) {
      const experienceMatch = Math.min(100, (userProfile.yearsExperience / 5) * 100);
      return Math.round(experienceMatch * 0.4);
    }
    
    const matchedSkills = userProfile.skills.filter(skill => 
      job.requiredSkills.some(req => 
        req.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(req.toLowerCase())
      )
    );
    const skillMatch = (matchedSkills.length / job.requiredSkills.length) * 100;
    
    // Experience match (assuming 5 years is ideal)
    const experienceMatch = Math.min(100, (userProfile.yearsExperience / 5) * 100);
    
    // Overall score
    return Math.round((skillMatch * 0.6) + (experienceMatch * 0.4));
  };
  
  const matchScore = calculateMatchScore();
  const matchedSkills = userProfile.skills.filter(skill => 
    job.requiredSkills.some(req => 
      req.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(req.toLowerCase())
    )
  );

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
              company: jobData.companyName || 'Company',
              location: jobData.location || 'Remote',
              requiredSkills: jobData.requiredSkills || [],
              experienceLevel: jobData.experienceLevel || 'Mid-Level',
            });
            // Prefer screening questions; fallback to coding questions for backward compatibility
            const jobQuestions = (jobData.screeningQuestions && jobData.screeningQuestions.length > 0)
              ? jobData.screeningQuestions
              : (jobData.codingQuestions || []).map((q: any, idx: number) => ({
                  id: q.id || String(idx + 1),
                  question: q.question,
                  type: 'text',
                  required: true,
                  options: [],
                }));

            if (jobQuestions.length > 0) {
              setQuestions(jobQuestions.map((q: any, idx: number) => ({
                id: String(idx + 1),
                question: q.question,
                type: q.type || 'text',
                required: q.required !== false,
                options: q.options,
              })));
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
              userName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User';
              if (!userTitle) userTitle = user.title || user.headline || 'Professional';
              if (!userLocation) userLocation = user.location || user.address || 'India';
              if (userSkills.length === 0) userSkills = user.skills || [];
            }
            
            setUserProfile({
              name: userName,
              title: userTitle,
              location: userLocation,
              yearsExperience: yearsExp || 3,
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
                name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
                title: user.title || user.headline || 'Professional',
                location: user.location || user.address || 'India',
                yearsExperience: user.yearsExperience || 3,
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
              name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
              title: user.title || user.headline || 'Professional',
              location: user.location || user.address || 'India',
              yearsExperience: user.yearsExperience || 3,
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
  };

  const isQuestionAnswered = (question: ScreeningQuestion) => {
    return question.required ? !!answers[question.id]?.trim() : true;
  };

  const allRequiredAnswered = questions.filter(q => q.required).every(q => !!answers[q.id]?.trim());

  const handleSubmit = async () => {
    if (!allRequiredAnswered) {
      setSnackbar({ open: true, message: 'Please answer all required questions', severity: 'error' });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Get user info from localStorage (using 'userData' key set by login)
      const userStr = localStorage.getItem('userData');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user) {
        setSnackbar({ open: true, message: 'Please login to apply', severity: 'error' });
        setSubmitting(false);
        return;
      }

      // Prepare screening answers for API
      const screeningAnswers = questions.map(q => ({
        questionId: q.id,
        code: answers[q.id] || '',
        language: 'text',
        submittedAt: new Date().toISOString(),
      }));

      // Submit application to database via API
      await applicationService.applyForJob(
        job.id,
        user.id || user.user_id,
        user.name || `${user.first_name} ${user.last_name}`,
        user.email,
        screeningAnswers
      );
      
      setSubmitting(false);
      setSubmitted(true);
      setSnackbar({ open: true, message: 'Application submitted successfully!', severity: 'success' });
    } catch (error: any) {
      setSubmitting(false);
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
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header */}
        <HeaderCard elevation={0}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Back
            </Button>
          </Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Apply for {job.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BusinessIcon sx={{ fontSize: 20 }} />
              <Typography>{job.company}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon sx={{ fontSize: 20 }} />
              <Typography>{job.location}</Typography>
            </Box>
          </Box>
        </HeaderCard>

        <Grid container spacing={3}>
          {/* Main Content - Questions */}
          <Grid item xs={12} lg={8}>
            <ContentCard>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  Screening Questions
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Please answer the following questions. Your profile information will be automatically shared with the hiring manager.
                </Typography>

                {questions.map((question, index) => (
                  <QuestionCard key={question.id} elevation={0}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {index + 1}. {question.question}
                      </Typography>
                      {question.required && (
                        <Chip label="Required" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                      )}
                    </Box>

                    {question.type === 'text' && (
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Type your answer here..."
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        variant="outlined"
                      />
                    )}

                    {question.type === 'number' && (
                      <TextField
                        type="number"
                        placeholder="Enter a number"
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        variant="outlined"
                        sx={{ width: 200 }}
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
                  </QuestionCard>
                ))}

                <Divider sx={{ my: 4 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {questions.filter(q => q.required && answers[q.id]?.trim()).length} of {questions.filter(q => q.required).length} required questions answered
                  </Typography>
                  <SubmitButton
                    onClick={handleSubmit}
                    disabled={!allRequiredAnswered || submitting}
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </SubmitButton>
                </Box>
              </CardContent>
            </ContentCard>
          </Grid>

          {/* Sidebar - Profile Summary & Match Score */}
          <Grid item xs={12} lg={4}>
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

            {/* Profile Summary */}
            <ContentCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: colors.primary }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {userProfile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userProfile.title}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkIcon fontSize="small" color="primary" />
                  Experience ({userProfile.yearsExperience} years)
                </Typography>
                {userProfile.experience.map((exp, idx) => (
                  <Box key={idx} sx={{ mb: 2, pl: 3 }}>
                    <Typography variant="body2" fontWeight={600}>{exp.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{exp.company} • {exp.duration}</Typography>
                  </Box>
                ))}

                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon fontSize="small" color="primary" />
                  Education
                </Typography>
                {userProfile.education.map((edu, idx) => (
                  <Box key={idx} sx={{ mb: 1, pl: 3 }}>
                    <Typography variant="body2" fontWeight={600}>{edu.degree}</Typography>
                    <Typography variant="caption" color="text.secondary">{edu.school} • {edu.year}</Typography>
                  </Box>
                ))}

                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CodeIcon fontSize="small" color="primary" />
                  Your Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pl: 3 }}>
                  {userProfile.skills.map((skill) => (
                    <Chip key={skill} label={skill} size="small" sx={{ fontSize: '0.75rem' }} />
                  ))}
                </Box>

                <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                  <Typography variant="caption">
                    This information will be shared with the hiring manager when you submit.
                  </Typography>
                </Alert>
              </CardContent>
            </ContentCard>
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

