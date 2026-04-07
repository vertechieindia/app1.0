/**
 * Coding Test Page
 * Display coding questions for users to complete during job application
 * Theme: Vine (#00bf8f → #001510)
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Skeleton,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  alpha,
  keyframes,
  Stack,
  Tooltip,
  IconButton,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
  Send as SendIcon,
  Warning as WarningIcon,
  Celebration as CelebrationIcon,
  ShieldOutlined as ShieldOutlinedIcon,
  LockOutlined as LockOutlinedIcon,
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
  Tab as TabIcon,
  ContentPaste as ContentPasteIcon,
  InfoOutlined as InfoOutlinedIcon,
  PlayArrow as PlayArrowIcon,
  Science as ScienceIcon,
  RestartAlt as RestartAltIcon,
  Save as SaveIcon,
  MenuBook as MenuBookIcon,
  LightbulbOutlined as LightbulbOutlinedIcon,
} from '@mui/icons-material';
import { Job, CodingQuestion, CodingAnswer, DIFFICULTY_LABELS, CodingAssessmentRunResult } from '../../types/jobPortal';
import { jobService, applicationService, getUserInfo } from '../../services/jobPortalService';
import { ABOVE_BOTTOM_NAV_OFFSET_PX } from '../../constants/layout';
import AssessmentCodeEditor from '../../components/assessment/AssessmentCodeEditor';

const getScreeningAnswersStorageKey = (jobId: string) => `job-application-screening:${jobId}`;
const getCodingDraftStorageKey = (jobId: string) => `job-application-coding-draft:${jobId}`;

// Theme Colors - Vine Palette (Dark Version)
// Theme Colors - VerTechie Blue Palette (Matching App Theme)
const colors = {
  primary: '#0d47a1',
  primaryDark: '#1a237e',
  primaryLight: '#5AC8FA',
  secondary: '#0077B5',
  secondaryLight: '#42A5F5',
  headerDark: '#1a237e',
  headerMid: '#0d47a1',
  accent: '#5AC8FA',
  accentDark: '#0077B5',
  background: '#f5f7fa',
  surface: '#ffffff',
  text: '#1a237e',
  textLight: '#4B5563',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

/** Active assessment view — same pale canvas as job details (#F8FAFC family) */
const assessmentUi = {
  pageBg: '#f8fafc',
  progressFill: '#34d399',
  progressTrack: 'rgba(148, 163, 184, 0.22)',
  stripBorder: 'rgba(148, 163, 184, 0.45)',
  stripBg: '#ffffff',
  problemAccent: 'rgba(59, 130, 246, 0.55)',
  editorChrome: '#f8fafc',
};

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100%',
  background: `linear-gradient(160deg, #e8eef7 0%, #f0f4fa 30%, #f5f7fa 60%, #fafbfd 100%)`,
}));

const QuestionCard = styled(Card)(({ theme }) => ({
  background: colors.surface,
  borderRadius: 24,
  boxShadow: `0 10px 40px ${colors.primary}10`,
  border: `1px solid ${colors.accent}40`,
  animation: `${fadeInUp} 0.6s ease-out`,
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: 14,
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1rem',
  padding: '14px 36px',
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
  color: '#ffffff',
  boxShadow: `0 8px 24px ${colors.primary}50`,
  transition: 'all 0.3s ease',
  '& .MuiButton-startIcon, & .MuiButton-endIcon': {
    color: 'inherit',
  },
  '&:hover': {
    background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondary} 100%)`,
    color: '#ffffff',
    boxShadow: `0 12px 32px ${colors.primary}60`,
    transform: 'translateY(-2px)',
  },
  '&.Mui-disabled': {
    background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
    boxShadow: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const DifficultyChip = styled(Chip)<{ difficulty: string }>(({ difficulty }) => ({
  fontWeight: 700,
  borderRadius: 10,
  ...(difficulty === 'easy' && {
    background: alpha(colors.success, 0.15),
    color: colors.primaryDark,
    border: `1px solid ${alpha(colors.success, 0.3)}`,
  }),
  ...(difficulty === 'medium' && {
    background: alpha(colors.warning, 0.15),
    color: '#d39e00',
    border: `1px solid ${alpha(colors.warning, 0.3)}`,
  }),
  ...(difficulty === 'hard' && {
    background: alpha(colors.error, 0.15),
    color: colors.error,
    border: `1px solid ${alpha(colors.error, 0.3)}`,
  }),
}));

const PROGRAMMING_LANGUAGES = [
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

const mapAllowedLanguageToValue = (language?: string): string => {
  const normalized = String(language || '').trim().toLowerCase();
  const match = PROGRAMMING_LANGUAGES.find((item) =>
    item.value === normalized || item.label.toLowerCase() === normalized
  );
  return match?.value || 'javascript';
};

const languageAllowedForQuestion = (question: CodingQuestion | undefined, lang: (typeof PROGRAMMING_LANGUAGES)[0]): boolean => {
  if (!question?.allowedLanguages?.length) return true;
  return question.allowedLanguages.some((allowed) => {
    const a = String(allowed).trim().toLowerCase();
    return a === lang.value || a === lang.label.toLowerCase();
  });
};

interface AssessmentIntegrityState {
  tabSwitchCount: number;
  fullscreenExitCount: number;
  pasteAttempts: number;
  copyAttempts: number;
  rightClickAttempts: number;
  warnings: string[];
  startedAt?: string;
}

const dispatchAssessmentImmersiveMode = (enabled: boolean) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('vt-assessment-immersive-mode', { detail: enabled }));
};

const currentQuestionAllowsPaste = (question?: CodingQuestion | null): boolean =>
  Boolean(question && question.blockCopyPaste === false);

const formatCountdown = (seconds: number | null): string => {
  if (seconds == null) return '--:--';
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const CodingTest: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { code: string; language: string }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [screeningAnswers, setScreeningAnswers] = useState<CodingAnswer[]>([]);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number | null>(null);
  const [integrity, setIntegrity] = useState<AssessmentIntegrityState>({
    tabSwitchCount: 0,
    fullscreenExitCount: 0,
    pasteAttempts: 0,
    copyAttempts: 0,
    rightClickAttempts: 0,
    warnings: [],
  });
  const [integrityBanner, setIntegrityBanner] = useState('');
  const [assessmentLocked, setAssessmentLocked] = useState(false);
  const [lockReason, setLockReason] = useState('');
  const timerExpiredRef = useRef(false);
  const screeningIntegrityRef = useRef<Record<string, unknown> | null>(null);

  const [runOutput, setRunOutput] = useState<CodingAssessmentRunResult | null>(null);
  const [runLoading, setRunLoading] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [draftSavedOpen, setDraftSavedOpen] = useState(false);
  const [integritySnackbarOpen, setIntegritySnackbarOpen] = useState(false);

  const showIntegrityNotice = useCallback((message: string) => {
    setIntegrityBanner(message);
    setIntegritySnackbarOpen(true);
  }, []);

  const clearIntegrityNotice = useCallback(() => {
    setIntegrityBanner('');
    setIntegritySnackbarOpen(false);
  }, []);

  useEffect(() => {
    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  const totalTimeLimitMinutes = useMemo(() => {
    if (!job?.codingQuestions?.length) return 0;
    return job.codingQuestions.reduce((sum, question) => sum + Math.max(5, Number(question.timeLimitMinutes) || 30), 0);
  }, [job]);

  const anyFullscreenRequired = useMemo(
    () => Boolean(job?.codingQuestions?.some((question) => question.requireFullScreen !== false)),
    [job]
  );

  const allowPasteForCurrentQuestion = currentQuestionAllowsPaste(job?.codingQuestions?.[activeStep]);
  const maxAllowedTabSwitches = useMemo(
    () => Math.max(...(job?.codingQuestions?.map((question) => question.maxTabSwitches ?? 2) || [2])),
    [job]
  );
  const warningTabSwitchCount = maxAllowedTabSwitches + 1;
  const lockTabSwitchCount = maxAllowedTabSwitches + 2;

  const loadJob = async () => {
    if (!jobId) return;

    try {
      setLoading(true);
      const jobData = await jobService.getJobById(jobId);
      if (!jobData) {
        setError('Job not found');
        return;
      }

      // Check if user already applied
      const user = getUserInfo();
      if (user) {
        const hasApplied = await applicationService.hasUserApplied(jobId, user.id);
        if (hasApplied) {
          navigate(`/techie/jobs/${jobId}`, { replace: true });
          return;
        }
      }

      setJob(jobData);

      const screeningStateRaw = sessionStorage.getItem(getScreeningAnswersStorageKey(jobId));
      let screeningState: any = null;
      if (screeningStateRaw) {
        try {
          screeningState = JSON.parse(screeningStateRaw);
        } catch {
          screeningState = null;
        }
      }
      const screeningFromState = Array.isArray(screeningState?.screeningAnswers) ? screeningState.screeningAnswers : [];
      const hasScreeningQuestions = Array.isArray(jobData.screeningQuestions) && jobData.screeningQuestions.length > 0;

      if (hasScreeningQuestions && screeningFromState.length === 0) {
        navigate(`/techie/jobs/${jobId}/apply`, { replace: true });
        return;
      }

      setScreeningAnswers(screeningFromState);
      screeningIntegrityRef.current =
        screeningState?.screening_integrity && typeof screeningState.screening_integrity === 'object'
          ? (screeningState.screening_integrity as Record<string, unknown>)
          : null;

      // Initialize answers for all questions
      const initialAnswers: Record<string, { code: string; language: string }> = {};
      jobData.codingQuestions.forEach((q) => {
        const defaultLanguage = mapAllowedLanguageToValue(q.allowedLanguages?.[0]);
        initialAnswers[q.id] = { code: q.starterCode || '', language: defaultLanguage };
      });
      const draftRaw = sessionStorage.getItem(getCodingDraftStorageKey(jobId));
      if (draftRaw) {
        try {
          const draft = JSON.parse(draftRaw);
          if (draft?.answers && typeof draft.answers === 'object') {
            setAnswers({ ...initialAnswers, ...draft.answers });
          } else {
            setAnswers(initialAnswers);
          }
          if (typeof draft?.activeStep === 'number') {
            setActiveStep(Math.max(0, Math.min(jobData.codingQuestions.length - 1, draft.activeStep)));
          }
          if (draft?.integrity && typeof draft.integrity === 'object') {
            setIntegrity((prev) => ({ ...prev, ...draft.integrity }));
          }
          if (draft?.assessmentLocked) {
            setAssessmentLocked(true);
          }
          if (typeof draft?.lockReason === 'string') {
            setLockReason(draft.lockReason);
          }
          if (typeof draft?.timeRemainingSeconds === 'number') {
            setTimeRemainingSeconds(draft.timeRemainingSeconds);
          }
          if (draft?.assessmentStarted) {
            setAssessmentStarted(true);
          }
        } catch {
          setAnswers(initialAnswers);
        }
      } else {
        setAnswers(initialAnswers);
      }
    } catch (err) {
      setError('Failed to load job details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!job || assessmentStarted || timeRemainingSeconds != null) return;
    if (totalTimeLimitMinutes > 0) {
      setTimeRemainingSeconds(totalTimeLimitMinutes * 60);
    }
  }, [job, assessmentStarted, timeRemainingSeconds, totalTimeLimitMinutes]);

  const persistCodingDraftToStorage = useCallback(() => {
    if (!jobId || !job) return;
    if (!assessmentStarted && !assessmentLocked) return;
    try {
      sessionStorage.setItem(
        getCodingDraftStorageKey(jobId),
        JSON.stringify({
          assessmentStarted,
          assessmentLocked,
          lockReason,
          answers,
          activeStep,
          timeRemainingSeconds,
          integrity,
        })
      );
    } catch {
      // ignore storage quota / private mode
    }
  }, [
    jobId,
    job,
    assessmentStarted,
    assessmentLocked,
    lockReason,
    answers,
    activeStep,
    timeRemainingSeconds,
    integrity,
  ]);

  useEffect(() => {
    persistCodingDraftToStorage();
  }, [persistCodingDraftToStorage]);

  useEffect(() => {
    const immersiveModeEnabled = assessmentStarted && !successDialogOpen;
    dispatchAssessmentImmersiveMode(immersiveModeEnabled);

    return () => {
      dispatchAssessmentImmersiveMode(false);
    };
  }, [assessmentStarted, successDialogOpen]);

  /** Keep step in range when job / question count changes (avoids crash + blank screen). */
  useEffect(() => {
    if (!job?.codingQuestions?.length) return;
    const max = job.codingQuestions.length - 1;
    setActiveStep((s) => Math.max(0, Math.min(max, s)));
  }, [job?.id, job?.codingQuestions?.length]);

  useEffect(() => {
    if (!assessmentStarted || timeRemainingSeconds == null || timerExpiredRef.current) return;
    if (timeRemainingSeconds <= 0) {
      timerExpiredRef.current = true;
      showIntegrityNotice('Time is up. Your assessment is being submitted automatically.');
      void handleSubmit(true);
      return;
    }
    const timer = window.setTimeout(() => {
      setTimeRemainingSeconds((prev) => (prev == null ? prev : prev - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [assessmentStarted, timeRemainingSeconds, showIntegrityNotice]);

  useEffect(() => {
    if (!assessmentStarted || !job || assessmentLocked) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'hidden') return;
      setIntegrity((prev) => {
        const nextTabSwitchCount = prev.tabSwitchCount + 1;
        let nextWarnings = prev.warnings.includes('Tab switch detected')
          ? prev.warnings
          : [...prev.warnings, 'Tab switch detected'];

        if (nextTabSwitchCount >= lockTabSwitchCount) {
          const blockingMessage = `You switched tabs more than ${maxAllowedTabSwitches} times. This assessment has been locked.`;
          queueMicrotask(() => {
            setAssessmentLocked(true);
            setLockReason(blockingMessage);
            showIntegrityNotice(blockingMessage);
            void exitFullscreenIfNeeded();
          });
        } else if (nextTabSwitchCount === warningTabSwitchCount) {
          const msg = `Final warning: you have switched tabs ${nextTabSwitchCount} times. One more switch will lock this assessment.`;
          queueMicrotask(() => showIntegrityNotice(msg));
          nextWarnings = nextWarnings.includes(msg) ? nextWarnings : [...nextWarnings, msg];
        } else {
          queueMicrotask(() =>
            showIntegrityNotice(
              `Tab switch detected (${nextTabSwitchCount}/${maxAllowedTabSwitches}). Stay on this assessment to continue.`
            )
          );
        }

        return {
          ...prev,
          tabSwitchCount: nextTabSwitchCount,
          warnings: nextWarnings,
        };
      });
    };

    const handleFullscreenChange = () => {
      if (!anyFullscreenRequired || document.fullscreenElement) return;
      const msg = 'Full screen mode was exited during the assessment.';
      setIntegrity((prev) => ({
        ...prev,
        fullscreenExitCount: prev.fullscreenExitCount + 1,
        warnings: prev.warnings.includes('Full screen exited') ? prev.warnings : [...prev.warnings, 'Full screen exited'],
      }));
      queueMicrotask(() => showIntegrityNotice(msg));
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [
    assessmentStarted,
    anyFullscreenRequired,
    assessmentLocked,
    job,
    lockTabSwitchCount,
    maxAllowedTabSwitches,
    showIntegrityNotice,
    warningTabSwitchCount,
  ]);

  const handleCodeChange = (questionId: string, code: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], code },
    }));
  };

  const handleLanguageChange = (questionId: string, language: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], language },
    }));
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleStartAssessment = async () => {
    if (anyFullscreenRequired && document.fullscreenElement == null && document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        showIntegrityNotice(
          'Full screen could not be enabled automatically. You can still continue, but exits will be tracked.'
        );
      }
    }
    setAssessmentStarted(true);
    setIntegrity((prev) => ({
      ...prev,
      startedAt: prev.startedAt || new Date().toISOString(),
    }));
  };

  const exitFullscreenIfNeeded = async () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch {
        // ignore exit failures
      }
    }
  };

  const handleSubmit = async (autoTriggered = false) => {
    if (!job) return;

    const user = getUserInfo();
    if (!user) {
      setError('Please login to submit your application');
      return;
    }

    try {
      setSubmitting(true);
      setConfirmDialogOpen(false);

      const codingAnswers: CodingAnswer[] = job.codingQuestions.map((q) => ({
        questionId: q.id,
        question: q.question,
        code: answers[q.id]?.code || '',
        language: answers[q.id]?.language || 'javascript',
        submittedAt: new Date().toISOString(),
      }));

      const combinedAnswers = [...screeningAnswers, ...codingAnswers];
      const suspiciousScore = (
        integrity.tabSwitchCount * 15 +
        integrity.fullscreenExitCount * 20 +
        integrity.pasteAttempts * 20 +
        integrity.copyAttempts * 10 +
        integrity.rightClickAttempts * 5
      );

      await applicationService.applyForJob(
        job.id,
        user.id,
        user.name,
        user.email,
        combinedAnswers,
        undefined,
        {
          screening_answers: screeningAnswers,
          coding_answers: codingAnswers,
          integrity: {
            ...integrity,
            suspiciousScore,
            autoSubmitted: autoTriggered,
            completedAt: new Date().toISOString(),
            totalTimeLimitMinutes,
            timeRemainingSeconds,
            screening_session: screeningIntegrityRef.current ?? undefined,
          },
        }
      );

      sessionStorage.removeItem(getScreeningAnswersStorageKey(job.id));
      sessionStorage.removeItem(getCodingDraftStorageKey(job.id));
      await exitFullscreenIfNeeded();
      setAssessmentStarted(false);
      setAssessmentLocked(false);
      setSuccessDialogOpen(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const getProgress = () => {
    if (!job) return 0;
    const answeredCount = Object.values(answers).filter((a) => a.code.trim()).length;
    return (answeredCount / job.codingQuestions.length) * 100;
  };

  const isCurrentQuestionAnswered = () => {
    if (!job || !job.codingQuestions[activeStep]) return false;
    const questionId = job.codingQuestions[activeStep].id;
    return answers[questionId]?.code.trim().length > 0;
  };

  const canSubmit = () => {
    if (!job) return false;
    return job.codingQuestions.every((q) => answers[q.id]?.code.trim());
  };

  const registerRestrictedAction = (type: 'pasteAttempts' | 'copyAttempts' | 'rightClickAttempts', message: string) => {
    setIntegrity((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
      warnings: prev.warnings.includes(message) ? prev.warnings : [...prev.warnings, message],
    }));
    showIntegrityNotice(message);
  };

  useEffect(() => {
    setRunOutput(null);
    setRunLoading(false);
  }, [activeStep]);

  const handleRunPreview = async () => {
    if (!job || !jobId || assessmentLocked || !assessmentStarted) return;
    const q = job.codingQuestions[activeStep];
    if (!q) return;
    setRunLoading(true);
    setRunOutput(null);
    try {
      const res = await jobService.runCodingAssessmentPreview(jobId, {
        questionId: q.id,
        code: answers[q.id]?.code || '',
        language: answers[q.id]?.language || 'javascript',
        mode: 'run',
      });
      setRunOutput(res);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Request failed';
      setRunOutput({
        executionAvailable: false,
        message: msg,
        status: 'ERROR',
        stdout: '',
        stderr: '',
      });
    } finally {
      setRunLoading(false);
    }
  };

  const handleTestPreview = async () => {
    if (!job || !jobId || assessmentLocked || !assessmentStarted) return;
    const q = job.codingQuestions[activeStep];
    if (!q) return;
    setRunLoading(true);
    setRunOutput(null);
    try {
      const res = await jobService.runCodingAssessmentPreview(jobId, {
        questionId: q.id,
        code: answers[q.id]?.code || '',
        language: answers[q.id]?.language || 'javascript',
        mode: 'test',
      });
      setRunOutput(res);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Request failed';
      setRunOutput({
        executionAvailable: false,
        message: msg,
        status: 'ERROR',
        stdout: '',
        stderr: '',
      });
    } finally {
      setRunLoading(false);
    }
  };

  const applyStarterReset = () => {
    if (!job) return;
    const q = job.codingQuestions[activeStep];
    if (!q) return;
    const starter = q.starterCode ?? '';
    setAnswers((prev) => ({
      ...prev,
      [q.id]: { ...prev[q.id], code: starter },
    }));
    persistCodingDraftToStorage();
    setResetConfirmOpen(false);
    setRunOutput(null);
  };

  const handleSaveDraftClick = () => {
    persistCodingDraftToStorage();
    setDraftSavedOpen(true);
  };

  if (loading) {
    return (
      <PageContainer>
        <Container
          maxWidth="lg"
          sx={{
            pb: `calc(${ABOVE_BOTTOM_NAV_OFFSET_PX}px + env(safe-area-inset-bottom, 0px))`,
          }}
        >
          <Skeleton
            variant="rounded"
            height={150}
            sx={{ mb: 4, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.1)' }}
          />
          <Skeleton
            variant="rounded"
            height={600}
            sx={{ borderRadius: 5, bgcolor: 'rgba(255,255,255,0.1)' }}
          />
        </Container>
      </PageContainer>
    );
  }

  if (!job) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error || 'Job not found'}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/techie/jobs')}
            sx={{ mt: 2, color: 'white' }}
          >
            Back to Jobs
          </Button>
        </Container>
      </PageContainer>
    );
  }

  // If no coding questions, apply directly
  if (!(job.codingQuestions?.length)) {
    const handleDirectApply = async () => {
      const user = getUserInfo();
      if (!user) {
        setError('Please login to apply');
        return;
      }

      try {
        setSubmitting(true);
        await applicationService.applyForJob(job.id, user.id, user.name, user.email, screeningAnswers, undefined, {
          screening_answers: screeningAnswers,
          screening_integrity: screeningIntegrityRef.current
            ? { ...screeningIntegrityRef.current, stage: 'screening_only' }
            : { stage: 'screening_only' },
        });
        sessionStorage.removeItem(getScreeningAnswersStorageKey(job.id));
        setSuccessDialogOpen(true);
      } catch (err: any) {
        setError(err.message || 'Failed to submit application');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <PageContainer>
        <Container maxWidth="md">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/techie/jobs/${job.id}`)}
            sx={{ color: 'white', mb: 3 }}
          >
            Back to Job Details
          </Button>

          <QuestionCard>
            <CardContent sx={{ p: 5, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha('#667eea', 0.1),
                  margin: '0 auto 24px',
                }}
              >
                <SendIcon sx={{ fontSize: 48, color: '#667eea' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Apply for {job.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                at {job.companyName}
              </Typography>
              <Alert severity="info" sx={{ mb: 4, borderRadius: 2, textAlign: 'left' }}>
                This position doesn't require a coding assessment. Click below to submit your application directly.
              </Alert>
              <SubmitButton
                onClick={handleDirectApply}
                disabled={submitting}
                startIcon={submitting ? null : <SendIcon />}
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </SubmitButton>
            </CardContent>
          </QuestionCard>

          {/* Success Dialog */}
          <Dialog
            open={successDialogOpen}
            PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
          >
            <DialogContent sx={{ textAlign: 'center', py: 4 }}>
              <CelebrationIcon sx={{ fontSize: 80, color: '#00d4aa', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Application Submitted!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your application has been successfully submitted. The hiring team will review it and get back to you.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/techie/my-applications')}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                }}
              >
                View My Applications
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </PageContainer>
    );
  }

  const codingQuestionsList = job.codingQuestions ?? [];
  const step = Math.max(0, Math.min(codingQuestionsList.length - 1, activeStep));
  const currentQuestion = codingQuestionsList[step];

  const lockedView = assessmentStarted && assessmentLocked;

  return (
    <PageContainer
      sx={{
        background: lockedView
          ? '#ffffff'
          : assessmentStarted
          ? assessmentUi.pageBg
          : undefined,
        ...(assessmentStarted && !lockedView
          ? {
              flex: 1,
              minHeight: 0,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }
          : {}),
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: lockedView ? '960px' : '1680px',
          px: lockedView ? { xs: 2, sm: 2.5 } : { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
          pb: assessmentStarted
            ? '12px'
            : `calc(${ABOVE_BOTTOM_NAV_OFFSET_PX}px + env(safe-area-inset-bottom, 0px))`,
          pt: lockedView ? { xs: 6, md: 8 } : assessmentStarted ? { xs: 3, md: 4 } : undefined,
          ...(assessmentStarted && !lockedView
            ? {
                flex: 1,
                minHeight: 0,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }
            : {}),
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {assessmentStarted && !assessmentLocked && (
          <Paper
            elevation={0}
            sx={{
              mb: 2.5,
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${assessmentUi.stripBorder}`,
              bgcolor: assessmentUi.stripBg,
              backdropFilter: 'blur(12px)',
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{ px: { xs: 1.75, sm: 2.25 }, py: 1.25 }}
            >
              <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ flex: 1, minWidth: 0 }}>
                <InfoOutlinedIcon sx={{ fontSize: 20, color: 'primary.main', mt: 0.15, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.55, fontSize: '0.8125rem' }}>
                  Proctored session: switching tabs, leaving fullscreen, and some editor actions may be logged for
                  review.{' '}
                  <Box component="span" sx={{ opacity: 0.85 }}>
                    Focus on your solution — progress saves automatically.
                  </Box>
                </Typography>
              </Stack>
              {integrityBanner ? (
                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="flex-start"
                  sx={{
                    flexShrink: 0,
                    maxWidth: { sm: 420 },
                    px: 1.25,
                    py: 1,
                    borderRadius: 1.5,
                    bgcolor: 'rgba(251, 191, 36, 0.1)',
                    border: '1px solid rgba(251, 191, 36, 0.28)',
                  }}
                >
                  <WarningIcon sx={{ fontSize: 18, color: '#fbbf24', flexShrink: 0, mt: 0.1 }} />
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.primary', lineHeight: 1.45, flex: 1, fontWeight: 500, fontSize: '0.75rem' }}
                  >
                    {integrityBanner}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={clearIntegrityNotice}
                    sx={{ color: 'text.secondary', p: 0.25, mt: -0.25 }}
                    aria-label="Dismiss notice"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ) : null}
            </Stack>
          </Paper>
        )}

        {!assessmentStarted && (
          <QuestionCard
            sx={{
              mb: 4,
              borderRadius: 5,
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(13, 71, 161, 0.12)',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Box
                sx={{
                  p: { xs: 2.5, md: 3.5 },
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${alpha(colors.primary, 0.08)} 0%, ${alpha(colors.accent, 0.14)} 100%)`,
                  border: `1px solid ${alpha(colors.primary, 0.12)}`,
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                  <Button
                    onClick={() => navigate(`/techie/jobs/${job.id}`)}
                    sx={{
                      minWidth: 'auto',
                      width: 42,
                      height: 42,
                      p: 0,
                      borderRadius: 999,
                      color: colors.primaryDark,
                      bgcolor: alpha(colors.primary, 0.08),
                      border: `1px solid ${alpha(colors.primary, 0.12)}`,
                      '&:hover': { bgcolor: alpha(colors.primary, 0.14) },
                    }}
                    aria-label="Back to job details"
                  >
                    <ArrowBackIcon />
                  </Button>
                  <Chip
                    label="Coding Assessment"
                    sx={{
                      fontWeight: 700,
                      color: colors.primaryDark,
                      bgcolor: alpha(colors.surface, 0.72),
                      border: `1px solid ${alpha(colors.primary, 0.12)}`,
                    }}
                  />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: colors.primaryDark,
                    mb: 1.25,
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    maxWidth: 920,
                  }}
                >
                  Everything you need, before you begin
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: colors.textLight,
                    maxWidth: 920,
                    lineHeight: 1.7,
                    mb: 2.5,
                  }}
                >
                  This assessment is timed, auto-saved, and recruiter-configured per question. Take a quick look
                  through the details below, then start when you are ready to stay focused until submission.
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
                    gap: 1.5,
                  }}
                >
                  {[
                    {
                      icon: <TimeIcon sx={{ color: colors.primaryDark }} />,
                      label: 'Time Limit',
                      value: `${totalTimeLimitMinutes} min`,
                    },
                    {
                      icon: <CodeIcon sx={{ color: colors.primaryDark }} />,
                      label: 'Questions',
                      value: String(job.codingQuestions.length),
                    },
                    {
                      icon: <ShieldOutlinedIcon sx={{ color: colors.primaryDark }} />,
                      label: 'Monitoring',
                      value: anyFullscreenRequired ? 'Full screen on' : 'Integrity checks on',
                    },
                    
                  ].map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        p: 1.75,
                        borderRadius: 3,
                        bgcolor: alpha(colors.surface, 0.82),
                        border: `1px solid ${alpha(colors.primary, 0.1)}`,
                        boxShadow: '0 10px 24px rgba(13,71,161,0.08)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {item.icon}
                        <Typography variant="caption" sx={{ color: colors.textLight, fontWeight: 700, letterSpacing: 0.4 }}>
                          {item.label}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: colors.primaryDark }}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Grid container spacing={2.5}>
                <Grid item xs={12} md={7}>
                  <Box
                    sx={{
                      height: '100%',
                      p: { xs: 2.25, md: 2.75 },
                      borderRadius: 4,
                      bgcolor: alpha(colors.surface, 0.92),
                      border: `1px solid ${alpha(colors.primary, 0.1)}`,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 800, color: colors.primaryDark, mb: 2 }}>
                      What to expect
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 1.5 }}>
                      {[
                        {
                          icon: <CodeIcon sx={{ color: colors.primary }} />,
                          title: 'Question-by-question language rules',
                          description: 'Each coding question may allow different languages chosen by the recruiter.',
                        },
                        {
                          icon: <FullscreenIcon sx={{ color: colors.warning }} />,
                          title: 'Stay inside the assessment',
                          description: 'Tab switches, full-screen exits, and suspicious actions may be tracked for review.',
                        },
                        {
                          icon: <LockOutlinedIcon sx={{ color: colors.success }} />,
                          title: 'Your work is protected',
                          description: 'Progress is auto-saved in this browser while you continue the assessment.',
                        },
                      ].map((item) => (
                        <Box
                          key={item.title}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: 3,
                            bgcolor: alpha(colors.primary, 0.03),
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2.5,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: alpha(colors.surface, 0.95),
                              border: `1px solid ${alpha(colors.primary, 0.08)}`,
                              flexShrink: 0,
                            }}
                          >
                            {item.icon}
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 700, color: colors.primaryDark, mb: 0.4 }}>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.textLight, lineHeight: 1.65 }}>
                              {item.description}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Box
                    sx={{
                      height: '100%',
                      p: { xs: 2.25, md: 2.75 },
                      borderRadius: 4,
                      color: colors.primaryDark,
                      background: `linear-gradient(180deg, ${alpha(colors.primary, 0.05)} 0%, ${alpha(colors.accent, 0.1)} 100%)`,
                      border: `1px solid ${alpha(colors.primary, 0.12)}`,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                      Ready checklist
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 1.25, mb: 2.25 }}>
                      {[
                        `Timer starts at ${formatCountdown(totalTimeLimitMinutes * 60)}`,
                        'Use a stable internet connection and stay on this screen',
                        'Read each question before choosing your language',
                        'Submit when all answers are complete',
                      ].map((item) => (
                        <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <CheckCircleIcon sx={{ color: colors.success, fontSize: 20, mt: '2px' }} />
                          <Typography variant="body2" sx={{ color: colors.textLight, lineHeight: 1.65 }}>
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={`Timer ${formatCountdown(totalTimeLimitMinutes * 60)}`}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 700, bgcolor: alpha(colors.surface, 0.7) }}
                      />
                      {anyFullscreenRequired && (
                        <Chip
                          label="Full screen monitored"
                          color="warning"
                          variant="outlined"
                          sx={{ fontWeight: 700, bgcolor: alpha(colors.surface, 0.7) }}
                        />
                      )}
                      <Chip
                        label="Auto-save enabled"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 700, bgcolor: alpha(colors.surface, 0.7) }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 3,
                  display: 'flex',
                  flexDirection: { xs: 'column-reverse', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'stretch', sm: 'center' },
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(`/techie/jobs/${job.id}/apply`)}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.25,
                    textTransform: 'none',
                    fontWeight: 700,
                    borderColor: alpha(colors.primary, 0.3),
                  }}
                >
                  Back to Screening
                </Button>
                <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <Typography variant="caption" sx={{ display: 'block', color: colors.textLight, mb: 0.75 }}>
                    Start only when you are ready to stay focused until you submit.
                  </Typography>
                  <SubmitButton onClick={handleStartAssessment} startIcon={<CodeIcon />}>
                    Start Assessment
                  </SubmitButton>
                </Box>
              </Box>
            </CardContent>
          </QuestionCard>
        )}

        {assessmentStarted && assessmentLocked && (
          <Box
            sx={{
              minHeight: 'calc(100dvh - 140px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                maxWidth: 760,
                width: '100%',
                p: { xs: 4, md: 6 },
                borderRadius: 6,
                textAlign: 'center',
                color: 'white',
                background: 'linear-gradient(180deg, rgba(8,18,40,0.96) 0%, rgba(18,37,78,0.96) 100%)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 32px 120px rgba(0,0,0,0.35)',
              }}
            >
              <Box
                sx={{
                  width: 84,
                  height: 84,
                  borderRadius: '24px',
                  mx: 'auto',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(255,152,0,0.2) 0%, rgba(255,59,48,0.24) 100%)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 42, color: '#ffd166' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                Assessment Locked
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.88, maxWidth: 560, mx: 'auto', mb: 3, lineHeight: 1.8 }}>
                {lockReason || `Neenga ${maxAllowedTabSwitches} times ku mela tab switch pannitinga. Inime intha assessment workspace open aagadhu.`}
              </Typography>
              <Alert
                severity="warning"
                sx={{
                  mb: 3,
                  borderRadius: 3,
                  textAlign: 'left',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  color: 'white',
                  '& .MuiAlert-icon': { color: '#ffd166' },
                }}
              >
                Tab switches recorded: {integrity.tabSwitchCount}. Please contact the recruiter if you need a reassessment.
              </Alert>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/techie/jobs/${job.id}`)}
                  sx={{ borderRadius: 3, px: 3, color: 'white', borderColor: 'rgba(255,255,255,0.24)' }}
                >
                  Back to Job Details
                </Button>
                <SubmitButton onClick={() => navigate('/techie/jobs')}>
                  Browse Other Jobs
                </SubmitButton>
              </Box>
            </Paper>
          </Box>
        )}

        {assessmentStarted && !assessmentLocked && (
        <Box
          sx={{
            width: '100%',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              flexShrink: 0,
              borderRadius: 3,
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 42%, ${colors.primaryDark} 100%)`,
              border: '1px solid rgba(255, 255, 255, 0.22)',
              boxShadow: '0 16px 44px rgba(13, 71, 161, 0.28)',
            }}
          >
            <Stack spacing={1.25} sx={{ p: { xs: 1.5, md: 2 } }}>
              <Stack
                direction="row"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="space-between"
                columnGap={2}
                rowGap={1.5}
              >
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  gap={1}
                  alignItems="center"
                  sx={{ flex: '2 1 200px', minWidth: 0 }}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.25,
                      py: 0.85,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.14)',
                      border: '1px solid rgba(255, 255, 255, 0.32)',
                      minWidth: 0,
                    }}
                  >
                    <TimeIcon sx={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', flexShrink: 0 }} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', lineHeight: 1.2, color: 'rgba(255,255,255,0.82)' }}>
                        Time left
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 800,
                          fontVariantNumeric: 'tabular-nums',
                          color:
                            timeRemainingSeconds != null && timeRemainingSeconds < 300 ? '#fecaca' : '#ffffff',
                        }}
                      >
                        {formatCountdown(timeRemainingSeconds)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.25,
                      py: 0.85,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.14)',
                      border: '1px solid rgba(255, 255, 255, 0.32)',
                    }}
                  >
                    <TabIcon sx={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', flexShrink: 0 }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', lineHeight: 1.2, color: 'rgba(255,255,255,0.82)' }}>
                        Tab switches
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: '#ffffff' }}>
                        {integrity.tabSwitchCount}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.25,
                      py: 0.85,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.14)',
                      border: '1px solid rgba(255, 255, 255, 0.32)',
                    }}
                  >
                    <FullscreenIcon sx={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', flexShrink: 0 }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', lineHeight: 1.2, color: 'rgba(255,255,255,0.82)' }}>
                        Fullscreen
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: '#ffffff' }}>
                        {integrity.fullscreenExitCount}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.25,
                      py: 0.85,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.14)',
                      border: '1px solid rgba(255, 255, 255, 0.32)',
                    }}
                  >
                    <ContentPasteIcon sx={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', flexShrink: 0 }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', lineHeight: 1.2, color: 'rgba(255,255,255,0.82)' }}>
                        Paste
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: '#ffffff' }}>
                        {integrity.pasteAttempts}
                      </Typography>
                    </Box>
                  </Box>
                  <Tooltip title="These counts may be shared with the recruiter. Stay in this window to keep them low.">
                    <InfoOutlinedIcon sx={{ fontSize: 22, color: 'rgba(255,255,255,0.65)', cursor: 'help', alignSelf: 'center' }} />
                  </Tooltip>
                </Stack>
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  gap={0.75}
                  alignItems="center"
                  sx={{ flex: '1 1 180px', minWidth: 0, justifyContent: { xs: 'flex-start', sm: 'center' } }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 800, mr: 0.25, color: 'rgba(255,255,255,0.9)' }}>
                    Questions
                  </Typography>
                  {job.codingQuestions.map((q, index) => (
                    <Button
                      key={q.id}
                      size="small"
                      onClick={() => setActiveStep(index)}
                      sx={{
                        minWidth: 0,
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 10,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        bgcolor: activeStep === index ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.12)',
                        color: '#ffffff',
                        border: activeStep === index ? '1px solid rgba(255,255,255,0.55)' : '1px solid rgba(255,255,255,0.22)',
                      }}
                    >
                      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                        <Box
                          component="span"
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: answers[q.id]?.code.trim()
                              ? assessmentUi.progressFill
                              : activeStep === index
                              ? 'rgba(147, 197, 253, 0.95)'
                              : 'rgba(255,255,255,0.35)',
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                          }}
                        >
                          {answers[q.id]?.code.trim() ? '✓' : index + 1}
                        </Box>
                        Q{index + 1}
                      </Box>
                    </Button>
                  ))}
                </Stack>
                <Box sx={{ flexShrink: 0, ml: { md: 'auto' } }}>
                  <Button
                    variant="contained"
                    size="medium"
                    disabled={!canSubmit() || submitting}
                    onClick={() => setConfirmDialogOpen(true)}
                    startIcon={<SendIcon />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 800,
                      px: 2.5,
                      py: 1,
                      borderRadius: 2,
                      bgcolor: '#ffffff',
                      color: colors.primaryDark,
                      boxShadow: '0 4px 18px rgba(0,0,0,0.22)',
                      '&:hover': { bgcolor: '#f1f5f9', color: colors.primaryDark },
                      '&.Mui-disabled': {
                        bgcolor: 'rgba(255,255,255,0.45)',
                        color: 'rgba(26,35,126,0.5)',
                      },
                    }}
                  >
                    {job.codingQuestions.length === 1 ? 'Submit' : 'Submit all'}
                  </Button>
                </Box>
              </Stack>
              <Box sx={{ pt: 0.25 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, alignItems: 'baseline' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, letterSpacing: 0.3 }}>
                    Overall progress
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: '#ffffff' }}>
                    {Math.round(getProgress())}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={getProgress()}
                  sx={{
                    height: 6,
                    borderRadius: 99,
                    bgcolor: 'rgba(255, 255, 255, 0.22)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 99,
                      bgcolor: assessmentUi.progressFill,
                    },
                  }}
                />
              </Box>
            </Stack>
          </Paper>

          <Box
            sx={{
              flex: '1 1 0%',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              gap: 0,
            }}
          >
            <Box
              sx={{
                flex: '1 1 0%',
                minHeight: 0,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                overflow: 'hidden',
                alignItems: 'stretch',
              }}
            >
            {/* Left: problem statement + examples */}
            <Box sx={{ flex: '1 1 0%', minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 2,
                  flex: 1,
                  minHeight: 0,
                  overflow: 'auto',
                  border: '1px solid rgba(148, 163, 184, 0.22)',
                  bgcolor: 'rgba(255,255,255,0.96)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 100%)',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      flexShrink: 0,
                      boxShadow: '0 8px 20px rgba(29, 78, 216, 0.25)',
                    }}
                  >
                    {activeStep + 1}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.3 }}>
                      {currentQuestion.question}
                    </Typography>
                    <DifficultyChip
                      label={DIFFICULTY_LABELS[currentQuestion.difficulty]}
                      difficulty={currentQuestion.difficulty}
                      size="small"
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(241, 245, 249, 0.9)',
                    border: '1px solid rgba(203, 213, 225, 0.85)',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                    <MenuBookIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                    <Typography
                      variant="overline"
                      sx={{ fontWeight: 800, letterSpacing: 1.2, color: 'primary.main' }}
                    >
                      Problem statement
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.75, color: 'text.primary', whiteSpace: 'pre-line', fontSize: '0.9375rem' }}
                  >
                    {currentQuestion.description}
                  </Typography>
                </Box>

                {(currentQuestion.sampleInput || currentQuestion.sampleOutput || currentQuestion.expectedOutput) && (
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                      <LightbulbOutlinedIcon sx={{ fontSize: 20, color: 'warning.main' }} />
                      <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 1, color: 'text.secondary' }}>
                        Examples
                      </Typography>
                    </Stack>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        borderColor: 'rgba(203, 213, 225, 0.95)',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1.5 }}>
                        Example 1
                      </Typography>
                      {currentQuestion.sampleInput != null && currentQuestion.sampleInput !== '' && (
                        <Typography variant="body2" sx={{ mb: 1.5, fontFamily: 'ui-monospace, monospace', whiteSpace: 'pre-wrap' }}>
                          <strong>Input:</strong> {currentQuestion.sampleInput}
                        </Typography>
                      )}
                      {currentQuestion.sampleOutput != null && currentQuestion.sampleOutput !== '' && (
                        <Typography variant="body2" sx={{ mb: currentQuestion.expectedOutput ? 1.5 : 0, fontFamily: 'ui-monospace, monospace', whiteSpace: 'pre-wrap' }}>
                          <strong>Output:</strong> {currentQuestion.sampleOutput}
                        </Typography>
                      )}
                      {currentQuestion.expectedOutput != null && currentQuestion.expectedOutput !== '' && (
                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                          {currentQuestion.expectedOutput}
                        </Typography>
                      )}
                    </Paper>
                  </Box>
                )}
              </Paper>
            </Box>

            {/* Right: IDE + output */}
            <Box sx={{ flex: '1 1 0%', minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  minHeight: 0,
                  border: '1px solid rgba(203, 213, 225, 0.95)',
                  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
                  bgcolor: '#ffffff',
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  justifyContent="space-between"
                  sx={{
                    px: { xs: 1.5, sm: 2 },
                    py: 1.25,
                    bgcolor: assessmentUi.editorChrome,
                    borderBottom: '1px solid rgba(203, 213, 225, 0.95)',
                    gap: 1,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                    <CodeIcon sx={{ fontSize: 22, color: colors.primaryDark }} />
                    <Typography sx={{ fontWeight: 800, color: colors.primaryDark, fontSize: '1rem' }}>
                      Solution
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    spacing={1}
                    alignItems="center"
                    justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
                    sx={{ flex: 1 }}
                  >
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                      <InputLabel id="coding-lang-label" sx={{ color: colors.textLight }}>
                        Language
                      </InputLabel>
                      <Select
                        labelId="coding-lang-label"
                        value={answers[currentQuestion.id]?.language || 'javascript'}
                        onChange={(e) => handleLanguageChange(currentQuestion.id, e.target.value)}
                        label="Language"
                        sx={{
                          borderRadius: 1.5,
                          bgcolor: '#ffffff',
                          color: colors.primaryDark,
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.55)' },
                        }}
                      >
                        {PROGRAMMING_LANGUAGES.filter((lang) => languageAllowedForQuestion(currentQuestion, lang)).map((lang) => (
                          <MenuItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Tooltip title={!assessmentStarted || assessmentLocked ? 'Available after you start the assessment' : 'Run with sample input'}>
                      <span>
                        <Button
                          size="small"
                          variant="outlined"
                          color="inherit"
                          startIcon={<PlayArrowIcon sx={{ fontSize: 18 }} />}
                          disabled={!assessmentStarted || assessmentLocked || runLoading || submitting}
                          onClick={() => void handleRunPreview()}
                          sx={{
                            color: colors.primaryDark,
                            borderColor: 'rgba(148, 163, 184, 0.6)',
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          Run
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title={!assessmentStarted || assessmentLocked ? 'Available after you start' : 'Run all test cases'}>
                      <span>
                        <Button
                          size="small"
                          variant="outlined"
                          color="inherit"
                          startIcon={<ScienceIcon sx={{ fontSize: 18 }} />}
                          disabled={!assessmentStarted || assessmentLocked || runLoading || submitting}
                          onClick={() => void handleTestPreview()}
                          sx={{
                            color: colors.primaryDark,
                            borderColor: 'rgba(148, 163, 184, 0.6)',
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          Test
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title="Restore starter code">
                      <span>
                        <Button
                          size="small"
                          variant="outlined"
                          color="inherit"
                          startIcon={<RestartAltIcon sx={{ fontSize: 18 }} />}
                          disabled={!assessmentStarted || assessmentLocked || submitting}
                          onClick={() => setResetConfirmOpen(true)}
                          sx={{
                            color: colors.primaryDark,
                            borderColor: 'rgba(148, 163, 184, 0.6)',
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          Reset
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title="Save draft to browser">
                      <span>
                        <Button
                          size="small"
                          variant="outlined"
                          color="inherit"
                          startIcon={<SaveIcon sx={{ fontSize: 18 }} />}
                          disabled={!assessmentStarted || assessmentLocked || submitting}
                          onClick={handleSaveDraftClick}
                          sx={{
                            color: colors.primaryDark,
                            borderColor: 'rgba(148, 163, 184, 0.6)',
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          Save
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>
                </Stack>
                <Box
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#ffffff',
                  }}
                >
                  {/* Top: code editor */}
                  <Box
                    sx={{
                      flex: '1 1 0%',
                      minHeight: 160,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      borderBottom: '3px solid #e2e8f0',
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{
                        px: 1.5,
                        py: 0.75,
                        bgcolor: '#f8fafc',
                        borderBottom: '1px solid rgba(203, 213, 225, 0.95)',
                        flexShrink: 0,
                      }}
                    >
                      <CodeIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                      <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1.1, color: 'primary.dark' }}>
                        CODE
                      </Typography>
                    </Stack>
                    <Box
                      sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                      onCopy={(e) => {
                        if (allowPasteForCurrentQuestion) return;
                        e.preventDefault();
                        registerRestrictedAction('copyAttempts', 'Copy is blocked during this assessment.');
                      }}
                      onCut={(e) => {
                        if (allowPasteForCurrentQuestion) return;
                        e.preventDefault();
                        registerRestrictedAction('copyAttempts', 'Cut is blocked during this assessment.');
                      }}
                      onContextMenu={(e) => {
                        if (allowPasteForCurrentQuestion) return;
                        e.preventDefault();
                        registerRestrictedAction('rightClickAttempts', 'Right click is blocked during this assessment.');
                      }}
                    >
                      <AssessmentCodeEditor
                        value={answers[currentQuestion.id]?.code || ''}
                        onChange={(v) => handleCodeChange(currentQuestion.id, v)}
                        language={answers[currentQuestion.id]?.language || 'javascript'}
                        height={assessmentStarted && !assessmentLocked ? '100%' : 320}
                        allowPaste={allowPasteForCurrentQuestion}
                        onPasteBlocked={() =>
                          registerRestrictedAction('pasteAttempts', 'Paste is blocked for this coding question.')
                        }
                        theme="light"
                        embeddedUnderToolbar
                      />
                    </Box>
                  </Box>

                  {/* Bottom: Run / Test output */}
                  <Box
                    sx={{
                      flex: '1 1 0%',
                      minHeight: 112,
                      maxHeight: { xs: '46vh', md: '44vh' },
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      bgcolor: '#f1f5f9',
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.25}
                      sx={{
                        px: 1.5,
                        py: 1,
                        bgcolor: '#e2e8f0',
                        borderBottom: '1px solid rgba(203, 213, 225, 0.95)',
                        flexShrink: 0,
                      }}
                    >
                      <ScienceIcon sx={{ fontSize: 22, color: 'primary.main' }} />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: colors.primaryDark, lineHeight: 1.25 }}>
                          Run &amp; test results
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.textLight, display: 'block' }}>
                          Output from Run or Test appears below
                        </Typography>
                      </Box>
                    </Stack>
                    <Box
                      sx={{
                        flex: 1,
                        minHeight: 0,
                        overflow: 'auto',
                        px: 1.5,
                        py: 1.1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.9,
                      }}
                    >
                      {runLoading && (
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 0.5 }}>
                          <CircularProgress size={18} sx={{ color: colors.primary }} />
                          <Typography variant="body2" sx={{ color: colors.textLight }}>
                            Running…
                          </Typography>
                        </Stack>
                      )}
                      {!runLoading && runOutput && (
                        <Stack spacing={1}>
                          {runOutput.message?.trim() ? (
                            <Alert
                              severity={runOutput.executionAvailable ? 'info' : 'warning'}
                              sx={{ py: 0.25, fontSize: '0.8125rem' }}
                            >
                              {runOutput.message}
                            </Alert>
                          ) : null}
                          {(runOutput.status === 'JUDGE_NOT_CONFIGURED' ||
                            runOutput.status === 'JUDGE_UNAVAILABLE') && (
                            <Typography
                              variant="caption"
                              sx={{ color: colors.textLight, display: 'block', lineHeight: 1.5 }}
                            >
                              {runOutput.status === 'JUDGE_NOT_CONFIGURED'
                                ? 'Run/Test needs the judge service. From the API project run: python backup_folder/judge_service.py (port 8001). In production set JUDGE_SERVICE_URL on the API. Also uncomment your code if the editor is only comments.'
                                : 'Could not reach the judge (port 8001). Start it or fix JUDGE_SERVICE_URL. Uncomment your code if lines are commented out.'}
                            </Typography>
                          )}
                          <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
                            {runOutput.status && (
                              <Chip
                                size="small"
                                label={`Status: ${runOutput.status}`}
                                sx={{ bgcolor: 'rgba(219, 234, 254, 0.9)', color: colors.primaryDark }}
                              />
                            )}
                            {runOutput.runtimeMs != null && (
                              <Typography variant="caption" sx={{ color: colors.textLight }}>
                                {runOutput.runtimeMs} ms
                              </Typography>
                            )}
                            {runOutput.passed != null && runOutput.total != null && (
                              <Typography variant="caption" sx={{ color: colors.textLight, fontWeight: 600 }}>
                                Tests passed: {runOutput.passed} / {runOutput.total}
                              </Typography>
                            )}
                          </Stack>
                          {Boolean(runOutput.stdout?.trim()) && (
                            <Box>
                              <Typography variant="caption" sx={{ color: colors.textLight }}>
                                stdout
                              </Typography>
                              <Typography
                                component="pre"
                                variant="body2"
                                sx={{
                                  m: 0,
                                  mt: 0.25,
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: '#ffffff',
                                  color: '#0f172a',
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                  fontFamily: 'ui-monospace, monospace',
                                  fontSize: '0.75rem',
                                  border: '1px solid rgba(203, 213, 225, 0.95)',
                                }}
                              >
                                {runOutput.stdout}
                              </Typography>
                            </Box>
                          )}
                          {Boolean(runOutput.stderr?.trim()) && (
                            <Box>
                              <Typography variant="caption" sx={{ color: colors.error }}>
                                stderr
                              </Typography>
                              <Typography
                                component="pre"
                                variant="body2"
                                sx={{
                                  m: 0,
                                  mt: 0.25,
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: 'rgba(254, 242, 242, 0.95)',
                                  color: '#b91c1c',
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                  fontFamily: 'ui-monospace, monospace',
                                  fontSize: '0.75rem',
                                  border: '1px solid rgba(252, 165, 165, 0.55)',
                                }}
                              >
                                {runOutput.stderr}
                              </Typography>
                            </Box>
                          )}
                          {runOutput.tests && runOutput.tests.length > 0 && (
                            <Box sx={{ pt: 0.5 }}>
                              <Typography variant="caption" sx={{ color: colors.textLight, fontWeight: 600 }}>
                                Test cases
                              </Typography>
                              {runOutput.tests.map((t, i) => (
                                <Stack
                                  key={i}
                                  direction="row"
                                  spacing={1}
                                  alignItems="flex-start"
                                  sx={{
                                    mt: 0.75,
                                    py: 0.75,
                                    px: 0.75,
                                    borderRadius: 1,
                                    border: '1px solid rgba(203, 213, 225, 0.95)',
                                    bgcolor: '#ffffff',
                                  }}
                                >
                                  <Chip
                                    size="small"
                                    label={t.passed ? 'Pass' : 'Fail'}
                                    color={t.passed ? 'success' : 'error'}
                                    variant="outlined"
                                    sx={{ height: 22, fontSize: '0.7rem' }}
                                  />
                                  <Typography variant="caption" sx={{ color: '#334155', flex: 1, whiteSpace: 'pre-wrap' }}>
                                    {t.input ? `in: ${t.input} → ` : ''}
                                    expected: {t.expected || '—'} | got: {t.actual || '—'}
                                  </Typography>
                                </Stack>
                              ))}
                            </Box>
                          )}
                        </Stack>
                      )}
                      {!runLoading && !runOutput && assessmentStarted && !assessmentLocked && (
                        <Typography variant="body2" sx={{ color: colors.textLight, fontStyle: 'italic' }}>
                          Use Run or Test to see output here.
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
                  {!allowPasteForCurrentQuestion && (
                    <Typography variant="caption" color="text.secondary" sx={{ px: 2, pb: 1.25, display: 'block' }}>
                      Copy, cut, paste, and right-click are disabled for this question.
                    </Typography>
                  )}
                </Paper>
            </Box>
            </Box>

              <Box sx={{ flexShrink: 0, width: '100%', mt: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Previous
                  </Button>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {activeStep < job.codingQuestions.length - 1 ? (
                      <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleNext}
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                        }}
                      >
                        Next question
                      </Button>
                    ) : (
                      <SubmitButton
                        disabled={!canSubmit() || submitting}
                        onClick={() => setConfirmDialogOpen(true)}
                        startIcon={<SendIcon />}
                      >
                        Submit application
                      </SubmitButton>
                    )}
                  </Box>
                </Box>
              </Box>
          </Box>
          </Box>
        )}

        {/* Confirm Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WarningIcon color="warning" />
              Submit Application?
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to submit your application? Please make sure you have:
            </Typography>
            <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
              <li>Answered all {job.codingQuestions.length} coding questions</li>
              <li>Reviewed your code for errors</li>
              <li>Selected the correct programming language for each answer</li>
              <li>Stayed within the assessment integrity rules shown for this job</li>
            </Box>
            <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
              You cannot edit your answers after submission.
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setConfirmDialogOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              Review Answers
            </Button>
            <SubmitButton onClick={() => { void handleSubmit(); }} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Confirm & Submit'}
            </SubmitButton>
          </DialogActions>
        </Dialog>

        <Dialog
          open={resetConfirmOpen}
          onClose={() => setResetConfirmOpen(false)}
          PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Restore starter code?</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              This replaces the editor with the original starter code for this question (or clears it if there is no
              starter). Your previous text is only recoverable if you have not left the page and your browser still has
              the auto-saved draft.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setResetConfirmOpen(false)} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={applyStarterReset} sx={{ textTransform: 'none', fontWeight: 700 }}>
              Restore
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Dialog */}
        <Dialog
          open={successDialogOpen}
          PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
        >
          <DialogContent sx={{ textAlign: 'center', py: 4 }}>
            <CelebrationIcon sx={{ fontSize: 80, color: '#00d4aa', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Application Submitted!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              Your coding assessment and application have been successfully submitted.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The hiring team will review your submission and get back to you soon.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/techie/jobs')}
              sx={{ borderRadius: 3, px: 3 }}
            >
              Browse More Jobs
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/techie/my-applications')}
              sx={{
                borderRadius: 3,
                px: 4,
                background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
              }}
            >
              View My Applications
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={draftSavedOpen}
          autoHideDuration={3200}
          onClose={() => setDraftSavedOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setDraftSavedOpen(false)} severity="success" sx={{ width: '100%' }} variant="filled">
            Draft saved
          </Alert>
        </Snackbar>

        <Snackbar
          open={integritySnackbarOpen && Boolean(integrityBanner)}
          autoHideDuration={9000}
          onClose={() => setIntegritySnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ mt: { xs: 7, sm: 2 } }}
        >
          <Alert
            severity="warning"
            variant="filled"
            onClose={() => setIntegritySnackbarOpen(false)}
            sx={{ maxWidth: 560, width: '100%', alignItems: 'flex-start' }}
          >
            {integrityBanner}
          </Alert>
        </Snackbar>
      </Container>
    </PageContainer>
  );
};

export default CodingTest;
