/**
 * Coding Test Page
 * Display coding questions for users to complete during job application
 * Theme: Vine (#00bf8f → #001510)
 */

import React, { useState, useEffect } from 'react';
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
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
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
  IconButton,
  Tooltip,
  keyframes,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
  Send as SendIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Celebration as CelebrationIcon,
} from '@mui/icons-material';
import { Job, CodingQuestion, CodingAnswer, DIFFICULTY_LABELS } from '../../types/jobPortal';
import { jobService, applicationService, getUserInfo } from '../../services/jobPortalService';

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

const HeaderCard = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 50%, ${colors.primaryLight} 100%)`,
  borderRadius: 24,
  padding: theme.spacing(4),
  color: 'white',
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeInUp} 0.6s ease-out`,
  boxShadow: `0 20px 60px ${colors.primary}40`,
}));

const QuestionCard = styled(Card)(({ theme }) => ({
  background: colors.surface,
  borderRadius: 24,
  boxShadow: `0 10px 40px ${colors.primary}10`,
  border: `1px solid ${colors.accent}40`,
  animation: `${fadeInUp} 0.6s ease-out`,
}));

const CodeEditor = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    fontFamily: '"Fira Code", Monaco, Consolas, monospace',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    backgroundColor: colors.secondary,
    color: colors.accent,
    borderRadius: 16,
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: alpha(colors.primary, 0.3),
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.primary,
      borderWidth: 2,
    },
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(2),
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: 14,
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1rem',
  padding: '14px 36px',
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
  boxShadow: `0 8px 24px ${colors.primary}50`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondary} 100%)`,
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
];

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

  useEffect(() => {
    if (jobId) {
      loadJob();
    }
  }, [jobId]);

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

      // Initialize answers for all questions
      const initialAnswers: Record<string, { code: string; language: string }> = {};
      jobData.codingQuestions.forEach((q) => {
        initialAnswers[q.id] = { code: '', language: 'javascript' };
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError('Failed to load job details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async () => {
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
        code: answers[q.id]?.code || '',
        language: answers[q.id]?.language || 'javascript',
        submittedAt: new Date().toISOString(),
      }));

      await applicationService.applyForJob(
        job.id,
        user.id,
        user.name,
        user.email,
        codingAnswers
      );

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

  if (loading) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
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
  if (job.codingQuestions.length === 0) {
    const handleDirectApply = async () => {
      const user = getUserInfo();
      if (!user) {
        setError('Please login to apply');
        return;
      }

      try {
        setSubmitting(true);
        await applicationService.applyForJob(job.id, user.id, user.name, user.email, []);
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

  const currentQuestion = job.codingQuestions[activeStep];

  return (
    <PageContainer>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/techie/jobs/${job.id}`)}
          sx={{
            color: 'white',
            mb: 3,
            '&:hover': { background: 'rgba(255, 255, 255, 0.1)' },
          }}
        >
          Back to Job Details
        </Button>

        {/* Header */}
        <HeaderCard elevation={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Coding Assessment
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {job.title} at {job.companyName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                icon={<CodeIcon sx={{ color: 'inherit !important' }} />}
                label={`${job.codingQuestions.length} Question${job.codingQuestions.length > 1 ? 's' : ''}`}
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white', fontWeight: 600 }}
              />
            </Box>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Progress
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {Math.round(getProgress())}% Complete
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={getProgress()}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  bgcolor: '#00d4aa',
                },
              }}
            />
          </Box>
        </HeaderCard>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Question Navigation */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ borderRadius: 4, p: 2, bgcolor: 'rgba(255, 255, 255, 0.98)' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, px: 1 }}>
                Questions
              </Typography>
              {job.codingQuestions.map((q, index) => (
                <Button
                  key={q.id}
                  fullWidth
                  onClick={() => setActiveStep(index)}
                  sx={{
                    justifyContent: 'flex-start',
                    py: 1.5,
                    px: 2,
                    mb: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    bgcolor: activeStep === index ? alpha('#667eea', 0.1) : 'transparent',
                    color: activeStep === index ? '#667eea' : 'text.primary',
                    border: activeStep === index ? `2px solid ${alpha('#667eea', 0.3)}` : '2px solid transparent',
                    '&:hover': {
                      bgcolor: alpha('#667eea', 0.05),
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: answers[q.id]?.code.trim()
                          ? '#00d4aa'
                          : activeStep === index
                          ? '#667eea'
                          : 'grey.300',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                      }}
                    >
                      {answers[q.id]?.code.trim() ? '✓' : index + 1}
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'left' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Q{index + 1}
                      </Typography>
                    </Box>
                  </Box>
                </Button>
              ))}

              <Divider sx={{ my: 2 }} />

              <SubmitButton
                fullWidth
                disabled={!canSubmit() || submitting}
                onClick={() => setConfirmDialogOpen(true)}
                startIcon={<SendIcon />}
              >
                Submit All
              </SubmitButton>
            </Paper>
          </Grid>

          {/* Question Content */}
          <Grid item xs={12} md={9}>
            <QuestionCard>
              <CardContent sx={{ p: 4 }}>
                {/* Question Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                      }}
                    >
                      {activeStep + 1}
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {currentQuestion.question}
                      </Typography>
                      <DifficultyChip
                        label={DIFFICULTY_LABELS[currentQuestion.difficulty]}
                        difficulty={currentQuestion.difficulty}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Question Description */}
                <Paper
                  sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                    bgcolor: alpha('#667eea', 0.04),
                    border: `1px solid ${alpha('#667eea', 0.1)}`,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, color: 'text.secondary', whiteSpace: 'pre-line' }}
                  >
                    {currentQuestion.description}
                  </Typography>
                </Paper>

                {/* Code Editor */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Your Solution
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={answers[currentQuestion.id]?.language || 'javascript'}
                        onChange={(e) => handleLanguageChange(currentQuestion.id, e.target.value)}
                        label="Language"
                        sx={{ borderRadius: 2 }}
                      >
                        {PROGRAMMING_LANGUAGES.map((lang) => (
                          <MenuItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <CodeEditor
                    fullWidth
                    multiline
                    rows={15}
                    placeholder={`// Write your ${answers[currentQuestion.id]?.language || 'javascript'} code here...`}
                    value={answers[currentQuestion.id]?.code || ''}
                    onChange={(e) => handleCodeChange(currentQuestion.id, e.target.value)}
                  />
                </Box>

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
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
                        Next Question
                      </Button>
                    ) : (
                      <SubmitButton
                        disabled={!canSubmit() || submitting}
                        onClick={() => setConfirmDialogOpen(true)}
                        startIcon={<SendIcon />}
                      >
                        Submit Application
                      </SubmitButton>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </QuestionCard>
          </Grid>
        </Grid>

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
            <SubmitButton onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Confirm & Submit'}
            </SubmitButton>
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
      </Container>
    </PageContainer>
  );
};

export default CodingTest;


