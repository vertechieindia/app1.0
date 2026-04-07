/**
 * CandidateProfilePage - View Candidate Profile from ATS
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Typography, Paper, Avatar, Chip, Button, Grid, Card, CardContent,
  IconButton, Divider, CircularProgress, Snackbar, Alert, Tab, Tabs,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl,
  InputLabel, Select, MenuItem, Stack,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import LinkIcon from '@mui/icons-material/Link';
import DownloadIcon from '@mui/icons-material/Download';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CodeIcon from '@mui/icons-material/Code';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ATSLayout from './ATSLayout';
import ScheduleInterviewModal from '../../../components/ats/ScheduleInterviewModal';
import { interviewService } from '../../../services/interviewService';
import { resolveUploadsPublicUrl } from '../../../services/jobPortalService';
import { getApiUrl, API_ENDPOINTS } from '../../../config/api';
import {
  type CodingEvaluationPayload,
  formatCodingTestPassSummary,
  getCodingEvalForQuestionId,
} from '../../../types/jobPortal';

const ProfileHeader = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3, 3, 3.5),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
  background: theme.palette.background.paper,
  borderRadius: 16,
  marginBottom: theme.spacing(2.5),
  border: `1px solid ${alpha('#0d47a1', 0.08)}`,
  boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 45%, #38bdf8 100%)`,
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 14,
  border: `1px solid ${alpha('#0d47a1', 0.06)}`,
  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    boxShadow: '0 8px 28px rgba(15, 23, 42, 0.08)',
    borderColor: alpha('#0d47a1', 0.1),
  },
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 600,
  fontSize: '0.8125rem',
  backgroundColor: alpha('#0d47a1', 0.09),
  color: '#0d47a1',
  border: `1px solid ${alpha('#0d47a1', 0.12)}`,
}));

const MissingSkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 600,
  fontSize: '0.8125rem',
  backgroundColor: alpha('#c2410c', 0.06),
  color: '#9a3412',
  border: `1px solid ${alpha('#ea580c', 0.25)}`,
}));

interface CandidateData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  mobile_number?: string;
  location?: string;
  avatar_url?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  experience?: any[];
  education?: any[];
  certifications?: any[];
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  resume_url?: string;
  created_at?: string;
  profile?: {
    headline?: string;
    bio?: string;
    skills?: string[];
    current_company?: string;
    current_position?: string;
    location?: string;
    experience_years?: number;
  };
}

interface PipelineSnapshot {
  matchScore?: number | null;
  stage?: string;
  time?: string;
  jobId?: string;
  jobTitle?: string;
  role?: string;
  applicationId?: string;
}

interface ApplicationDetails {
  status?: string;
  submittedAt?: string;
  matchScore?: number | null;
  matchedSkills: string[];
  missingSkills: string[];
  answersCount: number;
  jobTitle?: string;
  screeningAnswers: Array<{
    questionId: string;
    question: string;
    answer: string;
    type: string;
    submittedAt?: string;
  }>;
  codingAnswers: Array<{
    questionId: string;
    question: string;
    code: string;
    language: string;
    submittedAt?: string;
  }>;
  integrity: {
    tabSwitchCount?: number;
    fullscreenExitCount?: number;
    pasteAttempts?: number;
    copyAttempts?: number;
    rightClickAttempts?: number;
    suspiciousScore?: number;
    autoSubmitted?: boolean;
    startedAt?: string;
    completedAt?: string;
    totalTimeLimitMinutes?: number;
    timeRemainingSeconds?: number | null;
    warnings?: string[];
  } | null;
  /** Coding auto-eval only; screening untouched. */
  codingEvaluation?: CodingEvaluationPayload | null;
  applicantLocation: {
    lat?: number | null;
    lng?: number | null;
    ipSnapshot?: Record<string, unknown> | null;
    consentAt?: string;
  } | null;
}

const normalizeSkills = (...values: unknown[]): string[] => {
  const set = new Set<string>();
  values.forEach((value) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((skill) => {
        const normalized = String(skill || '').trim();
        if (normalized) set.add(normalized);
      });
      return;
    }
    if (typeof value === 'string') {
      value.split(',').forEach((skill) => {
        const normalized = skill.trim();
        if (normalized) set.add(normalized);
      });
    }
  });
  return Array.from(set);
};

const mapPipelineCandidateToSnapshot = (item: any): PipelineSnapshot => ({
  matchScore: typeof item?.matchScore === 'number'
    ? item.matchScore
    : (typeof item?.match_score === 'number' ? item.match_score : null),
  stage: item?.stage,
  time: item?.time,
  jobId: item?.jobId || item?.job_id,
  jobTitle: item?.jobTitle || item?.job_title,
  role: item?.role,
  applicationId: item?.applicationId || item?.application_id,
});

const selectBestPipelineSnapshot = (
  pipelineData: any[],
  candidateId: string,
  preferred?: PipelineSnapshot | null
): PipelineSnapshot | null => {
  if (!Array.isArray(pipelineData)) return null;

  const matches = pipelineData.filter((item: any) => String(item.user_id) === String(candidateId));
  if (matches.length === 0) return null;

  if (preferred?.applicationId) {
    const exactApplication = matches.find((item: any) => String(item.application_id || item.id || '') === String(preferred.applicationId));
    if (exactApplication) return mapPipelineCandidateToSnapshot(exactApplication);
  }

  if (preferred?.jobId) {
    const exactJob = matches.find((item: any) => String(item.job_id || '') === String(preferred.jobId));
    if (exactJob) return mapPipelineCandidateToSnapshot(exactJob);
  }

  return mapPipelineCandidateToSnapshot(matches[0]);
};

const mergePipelineSnapshot = (
  liveSnapshot: PipelineSnapshot,
  preferred?: PipelineSnapshot | null
): PipelineSnapshot => ({
  ...liveSnapshot,
  applicationId: preferred?.applicationId || liveSnapshot.applicationId,
  jobId: preferred?.jobId || liveSnapshot.jobId,
  jobTitle: preferred?.jobTitle || liveSnapshot.jobTitle,
  role: preferred?.role || liveSnapshot.role,
  time: preferred?.time || liveSnapshot.time,
});

const formatAssessmentQuestionType = (value?: string): string => {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'yesno') return 'Yes / No';
  if (normalized === 'multiple') return 'Multiple Choice';
  if (normalized === 'number') return 'Number';
  if (normalized === 'verbal') return 'Verbal';
  if (normalized === 'text') return 'Text';
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'Text';
};

const normalizeJobScreeningQuestions = (value: unknown) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const normalizeScreeningAnswers = (
  value: unknown,
  jobScreeningQuestions: Array<Record<string, unknown>> = []
) => {
  if (!Array.isArray(value)) return [];
  const questionLookup = new Map<string, string>();

  jobScreeningQuestions.forEach((item: Record<string, unknown>, index: number) => {
    const questionId = String(item?.id || item?.questionId || item?.question_id || index + 1);
    const questionText = String(item?.question || item?.question_text || item?.title || '').trim();
    if (questionId && questionText) {
      questionLookup.set(questionId, questionText);
    }
  });

  return value.map((item: any, index: number) => ({
    questionId: String(item?.questionId || item?.question_id || index + 1),
    question: String(
      item?.question ||
      item?.question_text ||
      item?.prompt ||
      item?.text ||
      questionLookup.get(String(item?.questionId || item?.question_id || index + 1)) ||
      item?.title ||
      `Question ${index + 1}`
    ),
    answer: String(item?.answer ?? item?.response ?? item?.code ?? ''),
    type: String(item?.type || item?.language || 'text'),
    submittedAt: item?.submittedAt || item?.submitted_at,
  }));
};

const normalizeCodingAnswers = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value.map((item: any, index: number) => ({
    questionId: String(item?.questionId || item?.question_id || index + 1),
    question: String(item?.question || item?.title || `Coding Question ${index + 1}`),
    code: String(item?.code ?? ''),
    language: String(item?.language || 'javascript'),
    submittedAt: item?.submittedAt || item?.submitted_at,
  }));
};

const isVideoScreeningAnswer = (answer: { type?: string; answer?: string }) => {
  const type = String(answer?.type || '').toLowerCase();
  const value = String(answer?.answer || '').trim().toLowerCase();
  return (
    type === 'video' ||
    value.endsWith('.webm') ||
    value.endsWith('.mp4') ||
    value.endsWith('.mov') ||
    value.includes('/uploads/job_screening/')
  );
};

const CandidateProfilePage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const routePipelineSnapshot = ((routeLocation.state as any)?.pipelineCandidate || null) as PipelineSnapshot | null;
  const [candidate, setCandidate] = useState<CandidateData | null>(null);
  const [pipelineSnapshot, setPipelineSnapshot] = useState<PipelineSnapshot | null>(
    routePipelineSnapshot
  );
  const [applicationDetails, setApplicationDetails] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false, message: '', severity: 'info'
  });
  
  // Schedule Interview (unified modal) - applicationId set when opening
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [scheduledInterviewApplicationIds, setScheduledInterviewApplicationIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        
        // Fetch user data
        const userResponse = await fetch(getApiUrl(API_ENDPOINTS.USERS.GET(candidateId!)), { headers });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          
          // Fetch profile data
          let profileData = null;
          try {
            const profileResponse = await fetch(getApiUrl(API_ENDPOINTS.USERS.PROFILE(candidateId!)), { headers });
            if (profileResponse.ok) {
              profileData = await profileResponse.json();
            }
          } catch (e) {
            console.warn('Could not fetch profile:', e);
          }
          
          // Fetch experiences
          let experiencesData: any[] = [];
          try {
            const expResponse = await fetch(getApiUrl(`/users/${candidateId}/experiences/`), { headers });
            if (expResponse.ok) {
              experiencesData = await expResponse.json();
            }
          } catch (e) {
            console.warn('Could not fetch experiences:', e);
          }
          
          // Fetch educations
          let educationsData: any[] = [];
          try {
            const eduResponse = await fetch(getApiUrl(`/users/${candidateId}/educations/`), { headers });
            if (eduResponse.ok) {
              educationsData = await eduResponse.json();
            }
          } catch (e) {
            console.warn('Could not fetch educations:', e);
          }
          
          // Combine all data
          const aggregatedSkills = normalizeSkills(
            profileData?.skills,
            userData.skills,
            userData.profile?.skills,
            experiencesData.flatMap((exp: any) => exp?.skills || [])
          );
          setCandidate({
            ...userData,
            profile: profileData || userData.profile,
            experience: experiencesData,
            education: educationsData,
            skills: aggregatedSkills,
            headline: profileData?.headline || userData.headline,
            bio: profileData?.bio || userData.bio,
            location: profileData?.location || userData.location,
          });

          // Fetch live pipeline snapshot (match score/stage/time) for this candidate
          try {
            const pipelineRes = await fetch(getApiUrl(API_ENDPOINTS.HIRING.PIPELINE_CANDIDATES), { headers });
            if (pipelineRes.ok) {
              const pipelineData = await pipelineRes.json();
              const fromPipeline = selectBestPipelineSnapshot(pipelineData, candidateId!, routePipelineSnapshot);
              if (fromPipeline) {
                setPipelineSnapshot(mergePipelineSnapshot(fromPipeline, routePipelineSnapshot));
              }
            }
          } catch (e) {
            console.warn('Could not fetch pipeline snapshot:', e);
          }
        } else {
          setSnackbar({ open: true, message: 'Failed to load candidate profile', severity: 'error' });
        }
      } catch (error) {
        console.error('Error fetching candidate:', error);
        setSnackbar({ open: true, message: 'Error loading candidate profile', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidate();
    }
  }, [candidateId, routePipelineSnapshot]);

  // Fetch HM's interviews to show Reschedule vs Schedule Interview
  useEffect(() => {
    let cancelled = false;
    interviewService.getMyInterviewsAsInterviewer(true)
      .then((interviews: any[]) => {
        if (cancelled) return;
        const ids = new Set((interviews || []).map((i: any) => String(i.application_id)).filter(Boolean));
        setScheduledInterviewApplicationIds(ids);
      })
      .catch(() => { if (!cancelled) setScheduledInterviewApplicationIds(new Set()); });
    return () => { cancelled = true; };
  }, [candidateId, scheduleDialogOpen]);

  const handleScheduleInterview = async () => {
    // First, fetch the application for this candidate
    if (!candidateId) return;
    
    try {
      if (applicationId) {
        setScheduleDialogOpen(true);
        return;
      }

      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : null;

      if (pipelineSnapshot?.jobId) {
        const jobAppsRes = await fetch(getApiUrl(`/jobs/${pipelineSnapshot.jobId}/applications`), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (jobAppsRes.ok) {
          const jobApps = await jobAppsRes.json();
          const exactApp = Array.isArray(jobApps)
            ? jobApps.find((a: any) =>
                (pipelineSnapshot.applicationId && String(a.id) === String(pipelineSnapshot.applicationId)) ||
                String(a.applicant_id) === String(candidateId) ||
                String(a.applicant?.id) === String(candidateId)
              )
            : null;
          if (exactApp?.id) {
            setApplicationId(exactApp.id);
            setScheduleDialogOpen(true);
            return;
          }
        }
      }
      
      // Get all jobs by this HM and find applications from this candidate
      const jobsRes = await fetch(getApiUrl('/jobs/'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const allJobs = jobsRes.ok ? await jobsRes.json() : [];
      const hmJobs = allJobs.filter((j: any) => j.posted_by_id === user?.id);
      
      // Find application from this candidate
      for (const job of hmJobs) {
        const appRes = await fetch(getApiUrl(`/jobs/${job.id}/applications`), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (appRes.ok) {
          const apps = await appRes.json();
          const candidateApp = apps.find((a: any) => a.applicant_id === candidateId || a.applicant?.id === candidateId);
          if (candidateApp) {
            setApplicationId(candidateApp.id);
            setScheduleDialogOpen(true);
            return;
          }
        }
      }
      
      setSnackbar({ open: true, message: 'No application found for this candidate', severity: 'error' });
    } catch (error) {
      console.error('Error finding application:', error);
      setSnackbar({ open: true, message: 'Failed to load application', severity: 'error' });
    }
  };

  const refetchPipelineSnapshot = async () => {
    if (!candidateId) return;
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
      const pipelineRes = await fetch(getApiUrl(API_ENDPOINTS.HIRING.PIPELINE_CANDIDATES), { headers });
      if (pipelineRes.ok) {
        const pipelineData = await pipelineRes.json();
        const fromPipeline = selectBestPipelineSnapshot(pipelineData, candidateId, routePipelineSnapshot || pipelineSnapshot);
        if (fromPipeline) {
          setPipelineSnapshot(mergePipelineSnapshot(fromPipeline, routePipelineSnapshot || pipelineSnapshot));
        }
      }
    } catch (e) {
      console.warn('Refetch pipeline snapshot:', e);
    }
  };

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      if (!candidateId || !pipelineSnapshot?.jobId) return;
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
        const res = await fetch(getApiUrl(`/jobs/${pipelineSnapshot.jobId}/applications`), { headers });
        if (!res.ok) return;
        const apps = await res.json();
        if (!Array.isArray(apps)) return;
        const app = apps.find((a: any) =>
          (pipelineSnapshot.applicationId && String(a.id) === String(pipelineSnapshot.applicationId)) ||
          String(a.applicant_id) === String(candidateId) ||
          String(a.applicant?.id) === String(candidateId)
        );
        if (!app) return;

        const answersPayload = app.answers && typeof app.answers === 'object' ? app.answers : {};
        let jobScreeningQuestions: Array<Record<string, unknown>> = [];
        try {
          const jobRes = await fetch(getApiUrl(`/jobs/${pipelineSnapshot.jobId}`), { headers });
          if (jobRes.ok) {
            const jobData = await jobRes.json();
            jobScreeningQuestions = normalizeJobScreeningQuestions(
              jobData?.screeningQuestions ?? jobData?.screening_questions
            );
          }
        } catch (jobError) {
          console.warn('Could not fetch job screening questions:', jobError);
        }
        const structuredResponses =
          answersPayload && typeof (answersPayload as any).responses === 'object' && !Array.isArray((answersPayload as any).responses)
            ? (answersPayload as any).responses
            : null;
        const screeningAnswers = normalizeScreeningAnswers(
          (answersPayload as any).screening_answers,
          jobScreeningQuestions
        );
        const codingAnswers = normalizeCodingAnswers((answersPayload as any).coding_answers);
        const integrity =
          (answersPayload as any).integrity && typeof (answersPayload as any).integrity === 'object'
            ? (answersPayload as any).integrity
            : null;
        const codingEvaluationRaw =
          (answersPayload as any).coding_evaluation && typeof (answersPayload as any).coding_evaluation === 'object'
            ? (answersPayload as any).coding_evaluation
            : app.coding_evaluation && typeof app.coding_evaluation === 'object'
              ? app.coding_evaluation
              : null;
        const plainAnswersCount = structuredResponses
          ? Object.keys(structuredResponses).length
          : (answersPayload && typeof answersPayload === 'object'
              ? Object.keys(answersPayload).filter((key) => !['screening_answers', 'coding_answers', 'integrity', 'responses'].includes(key)).length
              : 0);

        setApplicationId(app.id || null);
        setApplicationDetails({
          status: app.status,
          submittedAt: app.submitted_at || app.created_at,
          matchScore: typeof app.match_score === 'number' ? app.match_score : pipelineSnapshot.matchScore ?? null,
          matchedSkills: Array.isArray(app.matched_skills) ? app.matched_skills : [],
          missingSkills: Array.isArray(app.missing_skills) ? app.missing_skills : [],
          answersCount: screeningAnswers.length + codingAnswers.length + plainAnswersCount,
          jobTitle: app.job?.title || pipelineSnapshot.jobTitle,
          screeningAnswers,
          codingAnswers,
          integrity,
          codingEvaluation: codingEvaluationRaw,
          applicantLocation: {
            lat: app.applicant_location_lat,
            lng: app.applicant_location_lng,
            ipSnapshot: app.applicant_location_ip_snapshot,
            consentAt: app.applicant_location_consent_at,
          },
        });
      } catch (e) {
        console.warn('Could not fetch application details:', e);
      }
    };

    fetchApplicationDetails();
  }, [candidateId, pipelineSnapshot?.applicationId, pipelineSnapshot?.jobId, pipelineSnapshot?.jobTitle, pipelineSnapshot?.matchScore]);

  const handleSendEmail = () => {
    if (candidate?.email) {
      window.location.href = `mailto:${candidate.email}`;
    }
  };

  const handleDownloadResume = () => {
    if (candidate?.resume_url) {
      window.open(candidate.resume_url, '_blank');
    } else {
      setSnackbar({ open: true, message: 'No resume available', severity: 'info' });
    }
  };

  if (loading) {
    return (
      <ATSLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </ATSLayout>
    );
  }

  if (!candidate) {
    return (
      <ATSLayout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary">Candidate not found</Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/techie/ats/allcandidates')}
            sx={{ mt: 2 }}
          >
            Back to Candidates
          </Button>
        </Box>
      </ATSLayout>
    );
  }

  const fullName = `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim() || candidate.email?.split('@')?.[0] || 'Unknown';
  const skills = normalizeSkills(candidate.skills, candidate.profile?.skills);
  const headline = candidate.headline || candidate.profile?.headline || candidate.profile?.current_position || 'Techie';
  const candidateLocation = candidate.location || candidate.profile?.location || '';
  const bio = candidate.bio || candidate.profile?.bio || '';
  const locationSnapshot = applicationDetails?.applicantLocation?.ipSnapshot;
  const locationSummary = locationSnapshot && typeof locationSnapshot === 'object'
    ? [
        locationSnapshot.city,
        locationSnapshot.region,
        locationSnapshot.country,
      ].filter(Boolean).join(', ') || String(locationSnapshot.display_name || '').trim()
    : '';

  return (
    <ATSLayout>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/techie/ats/allcandidates')}
        sx={{
          mb: 2,
          textTransform: 'none',
          fontWeight: 600,
          color: 'text.secondary',
          '&:hover': { bgcolor: alpha('#0d47a1', 0.06) },
        }}
      >
        Back to All Candidates
      </Button>

      <ProfileHeader elevation={0}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid item>
            <Avatar
              src={candidate.avatar_url}
              sx={{
                width: { xs: 88, md: 108 },
                height: { xs: 88, md: 108 },
                fontSize: { xs: 36, md: 44 },
                fontWeight: 700,
                bgcolor: alpha('#0d47a1', 0.12),
                color: '#0d47a1',
                border: '3px solid',
                borderColor: 'background.paper',
                boxShadow: '0 8px 24px rgba(13, 71, 161, 0.15)',
              }}
            >
              {fullName.charAt(0).toUpperCase()}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Stack spacing={1.25}>
              <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5, color: 'primary.dark' }}>
                  {fullName}
                </Typography>
                <CheckCircleIcon sx={{ color: '#16a34a', fontSize: 26 }} aria-hidden />
              </Stack>
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                {headline}
              </Typography>
              {(pipelineSnapshot?.jobTitle || applicationDetails?.jobTitle) && (
                <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                  <Chip
                    size="small"
                    icon={<WorkOutlineIcon sx={{ fontSize: '18px !important' }} />}
                    label={applicationDetails?.jobTitle || pipelineSnapshot?.jobTitle}
                    sx={{
                      fontWeight: 700,
                      bgcolor: alpha('#0d47a1', 0.09),
                      color: 'primary.dark',
                      border: `1px solid ${alpha('#0d47a1', 0.15)}`,
                    }}
                  />
                  {pipelineSnapshot?.stage && (
                    <Chip size="small" variant="outlined" label={pipelineSnapshot.stage} sx={{ fontWeight: 600 }} />
                  )}
                </Stack>
              )}
              <Stack direction="row" flexWrap="wrap" gap={2} useFlexGap sx={{ pt: 0.5 }}>
                {candidateLocation && (
                  <Stack direction="row" alignItems="center" gap={0.75}>
                    <LocationOnIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                    <Typography variant="body2" color="text.secondary">
                      {candidateLocation}
                    </Typography>
                  </Stack>
                )}
                <Stack direction="row" alignItems="center" gap={0.75}>
                  <EmailIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                    {candidate.email}
                  </Typography>
                </Stack>
                {(candidate.phone || candidate.mobile_number) && (
                  <Stack direction="row" alignItems="center" gap={0.75}>
                    <PhoneIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                    <Typography variant="body2" color="text.secondary">
                      {candidate.phone || candidate.mobile_number}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              <Stack direction="row" gap={0.5}>
                {candidate.github_url && (
                  <IconButton
                    size="small"
                    onClick={() => window.open(candidate.github_url, '_blank')}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                    aria-label="GitHub"
                  >
                    <GitHubIcon fontSize="small" />
                  </IconButton>
                )}
                {candidate.linkedin_url && (
                  <IconButton
                    size="small"
                    onClick={() => window.open(candidate.linkedin_url, '_blank')}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon sx={{ color: '#0077B5' }} fontSize="small" />
                  </IconButton>
                )}
                {candidate.portfolio_url && (
                  <IconButton
                    size="small"
                    onClick={() => window.open(candidate.portfolio_url, '_blank')}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                    aria-label="Portfolio"
                  >
                    <LinkIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md="auto">
            <Stack spacing={1} sx={{ width: { xs: '100%', md: 220 } }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<ScheduleIcon />}
                onClick={handleScheduleInterview}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: '0 8px 20px rgba(13, 71, 161, 0.28)',
                }}
              >
                {pipelineSnapshot?.applicationId && scheduledInterviewApplicationIds.has(String(pipelineSnapshot.applicationId))
                  ? 'Reschedule'
                  : 'Schedule Interview'}
              </Button>
              {typeof (applicationDetails?.matchScore ?? pipelineSnapshot?.matchScore) === 'number' && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha('#0d47a1', 0.04),
                    border: `1px solid ${alpha('#0d47a1', 0.1)}`,
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      Match score
                    </Typography>
                    <Chip
                      size="small"
                      icon={<TrendingUpIcon sx={{ fontSize: '16px !important' }} />}
                      label={`${applicationDetails?.matchScore ?? pipelineSnapshot?.matchScore}%`}
                      sx={{ fontWeight: 800 }}
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Grid>
        </Grid>
      </ProfileHeader>

      <Paper
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: { xs: 0.5, sm: 1 },
            minHeight: 52,
            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9375rem',
              minHeight: 52,
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Application Details" />
          <Tab label="Integrity & Location" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Quick Stats */}
          <Grid item xs={12} md={5}>
            <InfoCard>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 1, color: 'primary.main', display: 'block' }}>
                  Profile snapshot
                </Typography>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: 'primary.dark' }}>
                  Quick stats
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Experience</Typography>
                    <Typography fontWeight={600}>
                      {candidate.profile?.experience_years || 0}+ years
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Skills</Typography>
                    <Typography fontWeight={600}>{skills.length} skills</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Match Score</Typography>
                    <Typography fontWeight={600}>
                      {typeof applicationDetails?.matchScore === 'number'
                        ? `${applicationDetails.matchScore}%`
                        : (typeof pipelineSnapshot?.matchScore === 'number' ? `${pipelineSnapshot.matchScore}%` : 'N/A')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Pipeline Stage</Typography>
                    <Typography fontWeight={600}>
                      {pipelineSnapshot?.stage || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Applied</Typography>
                    <Typography fontWeight={600}>
                      {pipelineSnapshot?.time || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Application Status</Typography>
                    <Typography fontWeight={600}>
                      {applicationDetails?.status || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Profile Updated</Typography>
                    <Typography fontWeight={600}>
                      {candidate.created_at ? new Date(candidate.created_at).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Status</Typography>
                    <Chip label="Active" size="small" color="success" />
                  </Box>
                </Box>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Skills Preview */}
          <Grid item xs={12} md={7}>
            <InfoCard>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha('#0d47a1', 0.08),
                      color: 'primary.main',
                    }}
                  >
                    <CodeIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 0.8, color: 'text.secondary', lineHeight: 1.2 }}>
                      Skills
                    </Typography>
                    <Typography variant="h6" fontWeight={800} sx={{ color: 'primary.dark' }}>
                      Top skills
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {skills.length > 0 ? (
                    skills.slice(0, 10).map((skill: string, index: number) => (
                      <SkillChip key={index} label={skill} />
                    ))
                  ) : (
                    <Typography color="text.secondary">No skills listed</Typography>
                  )}
                  {skills.length > 10 && (
                    <Chip
                      label={`+${skills.length - 10} more`}
                      variant="outlined"
                      size="small"
                      onClick={() => setActiveTab(1)}
                    />
                  )}
                </Box>
              </CardContent>
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: 'primary.dark' }}>
                  Experience
                </Typography>
                {candidate.experience && candidate.experience.length > 0 ? (
                  candidate.experience.map((exp: any, index: number) => (
                    <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < candidate.experience!.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                      <Typography variant="subtitle1" fontWeight={600}>{exp.title}</Typography>
                      <Typography variant="body2" color="primary">{exp.company_name || exp.company}</Typography>
                      {exp.location && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {exp.location} {exp.is_remote && '(Remote)'}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {exp.start_date ? new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                        {' - '}
                        {exp.is_current ? 'Present' : (exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present')}
                      </Typography>
                      {exp.description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>{exp.description}</Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <WorkIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography color="text.secondary">No experience listed</Typography>
                  </Box>
                )}
              </CardContent>
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: 'primary.dark' }}>
                  Education
                </Typography>
                {candidate.education && candidate.education.length > 0 ? (
                  candidate.education.map((edu: any, index: number) => (
                    <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < candidate.education!.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {edu.degree}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}
                      </Typography>
                      <Typography variant="body2" color="primary">{edu.school_name || edu.institution}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {edu.start_year || ''} - {edu.end_year || 'Present'}
                      </Typography>
                      {edu.grade && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          Grade: {edu.grade}
                        </Typography>
                      )}
                      {edu.description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>{edu.description}</Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <SchoolIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography color="text.secondary">No education listed</Typography>
                  </Box>
                )}
              </CardContent>
            </InfoCard>
          </Grid>

        </Grid>
      )}

      

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InfoCard>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ mb: 2.5 }}>
                  <Box>
                    <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 1.2, color: 'primary.main' }}>
                      Application
                    </Typography>
                    <Typography variant="h5" fontWeight={800} sx={{ color: 'primary.dark', letterSpacing: -0.3 }}>
                      Details
                    </Typography>
                  </Box>
                  {applicationDetails?.status && (
                    <Chip label={applicationDetails.status} color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
                  )}
                </Stack>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: alpha('#0d47a1', 0.03),
                    border: `1px solid ${alpha('#0d47a1', 0.08)}`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                    Role applied for
                  </Typography>
                  <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5, color: 'text.primary' }}>
                    {applicationDetails?.jobTitle || pipelineSnapshot?.jobTitle || '—'}
                  </Typography>
                </Paper>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        height: '100%',
                        borderRadius: 2,
                        border: `1px solid ${alpha('#0d47a1', 0.1)}`,
                        bgcolor: alpha('#16a34a', 0.04),
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.5, color: '#166534' }}>
                        Matched skills ({applicationDetails?.matchedSkills.length ?? 0})
                      </Typography>
                      {applicationDetails?.matchedSkills && applicationDetails.matchedSkills.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                          {applicationDetails.matchedSkills.map((skill, idx) => (
                            <SkillChip key={`m-${idx}`} label={skill} size="small" />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          No overlapping skills with this job yet.
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        height: '100%',
                        borderRadius: 2,
                        border: `1px solid ${alpha('#ea580c', 0.2)}`,
                        bgcolor: alpha('#ea580c', 0.03),
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.5, color: '#9a3412' }}>
                        Gaps vs job ({applicationDetails?.missingSkills.length ?? 0})
                      </Typography>
                      {applicationDetails?.missingSkills && applicationDetails.missingSkills.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                          {applicationDetails.missingSkills.map((skill, idx) => (
                            <MissingSkillChip key={`ms-${idx}`} label={skill} size="small" />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          No skill gaps flagged for this posting.
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: 'primary.dark' }}>
                  Screening answers
                </Typography>
                {applicationDetails?.screeningAnswers && applicationDetails.screeningAnswers.length > 0 ? (
                  applicationDetails.screeningAnswers.map((answer, index) => (
                    <Box key={`${answer.questionId}-${index}`} sx={{ mb: 2.5, pb: 2.5, borderBottom: index < applicationDetails.screeningAnswers.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary">
                        Screening Question {index + 1}
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 0.5 }}>
                        {answer.question}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 1 }}>
                        <Chip label={formatAssessmentQuestionType(answer.type)} size="small" color="primary" variant="outlined" />
                        {answer.submittedAt && (
                          <Chip label={`Answered ${new Date(answer.submittedAt).toLocaleString()}`} size="small" variant="outlined" />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">Answer</Typography>
                      {isVideoScreeningAnswer(answer) && answer.answer ? (
                        <Box sx={{ mt: 1 }}>
                          <Box
                            component="video"
                            src={resolveUploadsPublicUrl(answer.answer)}
                            controls
                            preload="metadata"
                            sx={{
                              width: '100%',
                              maxWidth: 420,
                              borderRadius: 2,
                              bgcolor: '#000',
                              border: `1px solid ${alpha('#0d47a1', 0.12)}`,
                            }}
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                          {answer.answer || 'No answer submitted'}
                        </Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography color="text.secondary">No screening answers available.</Typography>
                )}
              </CardContent>
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: 'primary.dark' }}>
                  Coding submission
                </Typography>
                {applicationDetails?.codingAnswers && applicationDetails.codingAnswers.length > 0 ? (
                  applicationDetails.codingAnswers.map((answer, index) => {
                    const evalRow = getCodingEvalForQuestionId(
                      applicationDetails.codingEvaluation ?? undefined,
                      answer.questionId
                    );
                    const passLabel = formatCodingTestPassSummary(evalRow);
                    return (
                    <Box key={`${answer.questionId}-${index}`} sx={{ mb: 2.5, pb: 2.5, borderBottom: index < applicationDetails.codingAnswers.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.4 }}>
                        Question
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 0.25, mb: 1.25, color: 'primary.dark' }}>
                        {answer.question || 'Coding question'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 1, alignItems: 'center' }}>
                        <Chip label={`Language: ${answer.language}`} size="small" color="secondary" variant="outlined" sx={{ fontWeight: 600 }} />
                        <Chip label={`Tests: ${passLabel}`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                        {answer.submittedAt && (
                          <Chip label={`Submitted ${new Date(answer.submittedAt).toLocaleString()}`} size="small" variant="outlined" />
                        )}
                      </Box>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: alpha('#0d47a1', 0.03), overflowX: 'auto' }}>
                        <Typography
                          component="pre"
                          variant="body2"
                          sx={{ m: 0, fontFamily: '"Fira Code", Consolas, monospace', whiteSpace: 'pre-wrap', color: 'text.secondary' }}
                        >
                          {answer.code || '// No code submitted'}
                        </Typography>
                      </Paper>
                    </Box>
                    );
                  })
                ) : (
                  <Typography color="text.secondary">No coding submission available.</Typography>
                )}
              </CardContent>
            </InfoCard>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: 'primary.dark' }}>
                  Assessment integrity
                </Typography>
                {applicationDetails?.integrity ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Tab Switches</Typography>
                      <Typography fontWeight={600}>{applicationDetails.integrity.tabSwitchCount ?? 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Fullscreen Exits</Typography>
                      <Typography fontWeight={600}>{applicationDetails.integrity.fullscreenExitCount ?? 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Paste Attempts</Typography>
                      <Typography fontWeight={600}>{applicationDetails.integrity.pasteAttempts ?? 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Copy Attempts</Typography>
                      <Typography fontWeight={600}>{applicationDetails.integrity.copyAttempts ?? 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Right Click Attempts</Typography>
                      <Typography fontWeight={600}>{applicationDetails.integrity.rightClickAttempts ?? 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography color="text.secondary">Submission Mode</Typography>
                      <Chip
                        label={applicationDetails.integrity.autoSubmitted ? 'Auto Submitted' : 'Manual Submit'}
                        size="small"
                        color={applicationDetails.integrity.autoSubmitted ? 'warning' : 'success'}
                        variant="outlined"
                      />
                    </Box>
                    {applicationDetails.integrity.startedAt && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                        <Typography color="text.secondary">Started At</Typography>
                        <Typography fontWeight={500}>{new Date(applicationDetails.integrity.startedAt).toLocaleString()}</Typography>
                      </Box>
                    )}
                    {applicationDetails.integrity.completedAt && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                        <Typography color="text.secondary">Completed At</Typography>
                        <Typography fontWeight={500}>{new Date(applicationDetails.integrity.completedAt).toLocaleString()}</Typography>
                      </Box>
                    )}
                    {applicationDetails.integrity.warnings && applicationDetails.integrity.warnings.length > 0 && (
                      <Box sx={{ pt: 1 }}>
                        <Typography variant="caption" color="text.secondary">Warnings</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.75 }}>
                          {applicationDetails.integrity.warnings.map((warning, index) => (
                            <Chip key={`${warning}-${index}`} label={warning} size="small" color="warning" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Typography color="text.secondary">No integrity events recorded.</Typography>
                )}
              </CardContent>
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: 'primary.dark' }}>
                  Location at apply
                </Typography>
                {applicationDetails?.applicantLocation ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography color="text.secondary">Coordinates</Typography>
                      <Typography fontWeight={600}>
                        {applicationDetails.applicantLocation.lat != null && applicationDetails.applicantLocation.lng != null
                          ? `${applicationDetails.applicantLocation.lat.toFixed(5)}, ${applicationDetails.applicantLocation.lng.toFixed(5)}`
                          : 'Not captured'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography color="text.secondary">Approximate Area</Typography>
                      <Typography fontWeight={500}>{locationSummary || 'Not available'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography color="text.secondary">Consent Time</Typography>
                      <Typography fontWeight={500}>
                        {applicationDetails.applicantLocation.consentAt
                          ? new Date(applicationDetails.applicantLocation.consentAt).toLocaleString()
                          : 'Not recorded'}
                      </Typography>
                    </Box>
                    {locationSnapshot && typeof locationSnapshot === 'object' && (
                      <Box sx={{ pt: 1 }}>
                        <Typography variant="caption" color="text.secondary">IP Snapshot</Typography>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mt: 0.75, bgcolor: alpha('#0d47a1', 0.02) }}>
                          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {JSON.stringify(locationSnapshot, null, 2)}
                          </Typography>
                        </Paper>
                      </Box>
                    )}
                    {applicationDetails.applicantLocation.lat != null && applicationDetails.applicantLocation.lng != null && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => window.open(`https://www.google.com/maps?q=${applicationDetails.applicantLocation?.lat},${applicationDetails.applicantLocation?.lng}`, '_blank')}
                        sx={{ alignSelf: 'flex-start', mt: 1 }}
                      >
                        Open In Maps
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Typography color="text.secondary">Location capture was not available for this application.</Typography>
                )}
              </CardContent>
            </InfoCard>
          </Grid>
        </Grid>
      )}

      <ScheduleInterviewModal
        open={scheduleDialogOpen}
        onClose={() => setScheduleDialogOpen(false)}
        onSuccess={() => {
          setSnackbar({ open: true, message: 'Interview scheduled successfully!', severity: 'success' });
          refetchPipelineSnapshot();
        }}
        onError={(msg) => setSnackbar({ open: true, message: msg, severity: 'error' })}
        context={applicationId && candidate ? {
          applicationId,
          candidateId: candidateId!,
          candidateName: [candidate.first_name, candidate.last_name].filter(Boolean).join(' ') || candidate.email?.split('@')?.[0] || 'Candidate',
          candidateEmail: candidate.email,
        } : null}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ATSLayout>
  );
};

export default CandidateProfilePage;
