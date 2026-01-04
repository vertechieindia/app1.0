/**
 * Quiz Page - Interactive Quiz System
 * Features: Multiple question types, timer, progress tracking, results
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Button, Radio, RadioGroup, FormControlLabel,
  Checkbox, FormGroup, TextField, LinearProgress, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Tooltip,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerIcon from '@mui/icons-material/Timer';
import QuizIcon from '@mui/icons-material/Quiz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ReplayIcon from '@mui/icons-material/Replay';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import { getTutorialBySlug } from '../../data/curriculum';

// Types
interface Question {
  id: string;
  type: 'single' | 'multiple' | 'text' | 'code';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  code?: string;
}

interface QuizResult {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  points: number;
}

// Styled Components
const PageContainer = styled(Box)({
  minHeight: '100%',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  padding: '20px',
});

const QuizContainer = styled(Paper)({
  maxWidth: 800,
  margin: '0 auto',
  borderRadius: 20,
  overflow: 'hidden',
  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
});

const QuizHeader = styled(Box)<{ color: string }>(({ color }) => ({
  backgroundColor: color,
  color: '#fff',
  padding: '24px 32px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const QuestionCard = styled(Box)({
  padding: '32px',
});

const OptionButton = styled(Paper)<{ selected?: boolean; correct?: boolean; wrong?: boolean; color: string }>(
  ({ selected, correct, wrong, color }) => ({
    padding: '16px 20px',
    marginBottom: 12,
    cursor: 'pointer',
    borderRadius: 12,
    border: '2px solid',
    borderColor: correct ? '#4CAF50' : wrong ? '#F44336' : selected ? color : '#e0e0e0',
    backgroundColor: correct ? alpha('#4CAF50', 0.1) : wrong ? alpha('#F44336', 0.1) : selected ? alpha(color, 0.05) : '#fff',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    '&:hover': {
      borderColor: color,
      backgroundColor: alpha(color, 0.03),
    },
  })
);

const TimerBadge = styled(Box)<{ warning?: boolean }>(({ warning }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 16px',
  borderRadius: 20,
  backgroundColor: warning ? alpha('#F44336', 0.2) : 'rgba(255,255,255,0.2)',
  color: warning ? '#F44336' : '#fff',
  fontWeight: 600,
}));

const ProgressBar = styled(LinearProgress)<{ barColor?: string }>(({ barColor }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.3)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    backgroundColor: barColor || '#fff',
  },
}));

const ResultCard = styled(Box)<{ color: string }>(({ color }) => ({
  textAlign: 'center',
  padding: '60px 40px',
  background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
  color: '#fff',
}));

const ScoreCircle = styled(Box)<{ score: number }>(({ score }) => ({
  width: 160,
  height: 160,
  borderRadius: '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
  backgroundColor: 'rgba(255,255,255,0.2)',
  border: `6px solid ${score >= 70 ? '#4CAF50' : score >= 50 ? '#FF9800' : '#F44336'}`,
}));

// Sample quiz data
const getQuizData = (tutorialSlug: string, lessonSlug: string): Question[] => {
  const quizzes: Record<string, Record<string, Question[]>> = {
    html: {
      intro: [
        {
          id: 'q1',
          type: 'single',
          question: 'What does HTML stand for?',
          options: [
            'Hyper Text Markup Language',
            'Home Tool Markup Language',
            'Hyperlinks and Text Markup Language',
            'Hyper Tool Multi Language',
          ],
          correctAnswer: 'Hyper Text Markup Language',
          explanation: 'HTML stands for Hyper Text Markup Language. It is the standard markup language for creating Web pages.',
          points: 10,
        },
        {
          id: 'q2',
          type: 'single',
          question: 'Which HTML element defines the document\'s title?',
          options: ['<meta>', '<head>', '<title>', '<body>'],
          correctAnswer: '<title>',
          explanation: 'The <title> element defines the title of the document, shown in the browser\'s title bar or page tab.',
          points: 10,
        },
        {
          id: 'q3',
          type: 'multiple',
          question: 'Which of the following are valid HTML heading tags? (Select all that apply)',
          options: ['<h1>', '<h7>', '<header>', '<heading>', '<h6>'],
          correctAnswer: ['<h1>', '<h6>'],
          explanation: 'HTML has 6 levels of headings: <h1> through <h6>. <header> is a semantic element, not a heading tag.',
          points: 15,
        },
        {
          id: 'q4',
          type: 'single',
          question: 'What is the correct HTML element for inserting a line break?',
          options: ['<break>', '<br>', '<lb>', '<newline>'],
          correctAnswer: '<br>',
          explanation: 'The <br> element is used to insert a line break in HTML. It is an empty element (no closing tag).',
          points: 10,
        },
        {
          id: 'q5',
          type: 'text',
          question: 'What attribute is used to provide an alternate text for an image?',
          correctAnswer: 'alt',
          explanation: 'The alt attribute provides alternative text for an image if it cannot be displayed.',
          points: 15,
        },
      ],
      elements: [
        {
          id: 'q1',
          type: 'single',
          question: 'Which HTML element defines a paragraph?',
          options: ['<p>', '<para>', '<paragraph>', '<text>'],
          correctAnswer: '<p>',
          explanation: 'The <p> element defines a paragraph in HTML.',
          points: 10,
        },
        {
          id: 'q2',
          type: 'single',
          question: 'What is an empty HTML element?',
          options: [
            'An element with no content',
            'An element with no attributes',
            'An element that is invisible',
            'An element with no styling',
          ],
          correctAnswer: 'An element with no content',
          explanation: 'Empty elements are elements that have no content, like <br>, <img>, and <hr>.',
          points: 10,
        },
      ],
    },
    css: {
      intro: [
        {
          id: 'q1',
          type: 'single',
          question: 'What does CSS stand for?',
          options: [
            'Cascading Style Sheets',
            'Creative Style System',
            'Computer Style Sheets',
            'Colorful Style Sheets',
          ],
          correctAnswer: 'Cascading Style Sheets',
          explanation: 'CSS stands for Cascading Style Sheets.',
          points: 10,
        },
        {
          id: 'q2',
          type: 'single',
          question: 'Which property is used to change the background color?',
          options: ['color', 'background-color', 'bgcolor', 'background'],
          correctAnswer: 'background-color',
          explanation: 'The background-color property sets the background color of an element.',
          points: 10,
        },
      ],
    },
    javascript: {
      intro: [
        {
          id: 'q1',
          type: 'single',
          question: 'Inside which HTML element do we put the JavaScript?',
          options: ['<javascript>', '<js>', '<script>', '<scripting>'],
          correctAnswer: '<script>',
          explanation: 'The <script> tag is used to define client-side JavaScript.',
          points: 10,
        },
        {
          id: 'q2',
          type: 'single',
          question: 'How do you write "Hello World" in an alert box?',
          options: [
            'alert("Hello World")',
            'msg("Hello World")',
            'msgBox("Hello World")',
            'alertBox("Hello World")',
          ],
          correctAnswer: 'alert("Hello World")',
          explanation: 'The alert() method displays an alert box with a specified message.',
          points: 10,
        },
      ],
    },
  };

  return quizzes[tutorialSlug]?.[lessonSlug] || quizzes[tutorialSlug]?.intro || [];
};

const QuizPage: React.FC = () => {
  const { tutorialSlug, lessonSlug } = useParams<{ tutorialSlug: string; lessonSlug?: string }>();
  const navigate = useNavigate();

  const tutorial = getTutorialBySlug(tutorialSlug || '');
  const questions = getQuizData(tutorialSlug || '', lessonSlug || 'intro');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [results, setResults] = useState<QuizResult[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 1 minute per question
  const [textAnswer, setTextAnswer] = useState('');

  // Timer
  useEffect(() => {
    if (quizComplete) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    const question = questions[currentQuestion];

    if (question.type === 'multiple') {
      const currentAnswers = Array.isArray(selectedAnswer) ? selectedAnswer : [];
      if (currentAnswers.includes(answer)) {
        setSelectedAnswer(currentAnswers.filter(a => a !== answer));
      } else {
        setSelectedAnswer([...currentAnswers, answer]);
      }
    } else {
      setSelectedAnswer(answer);
    }
  };

  const checkAnswer = (): boolean => {
    const question = questions[currentQuestion];
    const answer = question.type === 'text' ? textAnswer.toLowerCase().trim() : selectedAnswer;

    if (question.type === 'multiple') {
      const correctSet = new Set(question.correctAnswer as string[]);
      const answerSet = new Set(answer as string[]);
      return correctSet.size === answerSet.size && [...correctSet].every(x => answerSet.has(x));
    } else if (question.type === 'text') {
      return (question.correctAnswer as string).toLowerCase() === answer;
    } else {
      return question.correctAnswer === answer;
    }
  };

  const handleSubmitAnswer = () => {
    const question = questions[currentQuestion];
    const isCorrect = checkAnswer();
    const answer = question.type === 'text' ? textAnswer : selectedAnswer;

    setResults([
      ...results,
      {
        questionId: question.id,
        userAnswer: answer,
        isCorrect,
        points: isCorrect ? question.points : 0,
      },
    ]);

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setTextAnswer('');
      setShowExplanation(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = useCallback(() => {
    setQuizComplete(true);
  }, []);

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setTextAnswer('');
    setResults([]);
    setShowExplanation(false);
    setQuizComplete(false);
    setTimeLeft(questions.length * 60);
  };

  const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
  const maxPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const scorePercentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

  if (!tutorial || questions.length === 0) {
    return (
      <PageContainer>
        <QuizContainer>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <QuizIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
            <Typography variant="h5" fontWeight={600}>No quiz available</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              This lesson doesn't have a quiz yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Box>
        </QuizContainer>
      </PageContainer>
    );
  }

  // Quiz Results
  if (quizComplete) {
    return (
      <PageContainer>
        <QuizContainer>
          <ResultCard color={tutorial.color}>
            <ScoreCircle score={scorePercentage}>
              <Typography variant="h2" fontWeight={800}>{scorePercentage}%</Typography>
              <Typography variant="body2">Score</Typography>
            </ScoreCircle>

            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              {scorePercentage >= 80 ? '🎉 Excellent!' : scorePercentage >= 60 ? '👍 Good Job!' : '💪 Keep Practicing!'}
            </Typography>

            <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
              You scored {totalPoints} out of {maxPoints} points
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700}>{results.filter(r => r.isCorrect).length}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Correct</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700}>{results.filter(r => !r.isCorrect).length}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Wrong</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700}>{questions.length}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Total</Typography>
              </Box>
            </Box>

            {scorePercentage >= 80 && (
              <Box sx={{ mb: 3 }}>
                <Chip
                  icon={<EmojiEventsIcon />}
                  label="Quiz Master Badge Earned!"
                  sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: tutorial.color, fontWeight: 600 }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<ReplayIcon />}
                onClick={handleRetry}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
              >
                Retry Quiz
              </Button>
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => navigate(`/techie/learn/tutorial/${tutorialSlug}`)}
                sx={{ bgcolor: '#fff', color: tutorial.color, '&:hover': { bgcolor: '#f5f5f5' } }}
              >
                Back to Tutorial
              </Button>
            </Box>
          </ResultCard>

          {/* Review Section */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Review Your Answers
            </Typography>
            {questions.map((question, idx) => {
              const result = results[idx];
              if (!result) return null;

              return (
                <Paper
                  key={question.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: result.isCorrect ? '#4CAF50' : '#F44336',
                    bgcolor: result.isCorrect ? alpha('#4CAF50', 0.03) : alpha('#F44336', 0.03),
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    {result.isCorrect ? (
                      <CheckCircleIcon sx={{ color: '#4CAF50' }} />
                    ) : (
                      <CancelIcon sx={{ color: '#F44336' }} />
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Q{idx + 1}: {question.question}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Your answer: {Array.isArray(result.userAnswer) ? result.userAnswer.join(', ') : result.userAnswer}
                      </Typography>
                      {!result.isCorrect && (
                        <Typography variant="body2" sx={{ color: '#4CAF50', mt: 0.5 }}>
                          Correct answer: {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      label={`${result.points}/${question.points} pts`}
                      size="small"
                      color={result.isCorrect ? 'success' : 'error'}
                    />
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </QuizContainer>
      </PageContainer>
    );
  }

  const question = questions[currentQuestion];

  return (
    <PageContainer>
      <QuizContainer>
        {/* Header */}
        <QuizHeader color={tutorial.color}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {tutorial.icon} {tutorial.shortTitle} Quiz
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Question {currentQuestion + 1} of {questions.length}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <TimerBadge warning={timeLeft < 60}>
              <TimerIcon />
              {formatTime(timeLeft)}
            </TimerBadge>
            <Chip
              label={`${question.points} pts`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }}
            />
          </Box>
        </QuizHeader>

        {/* Progress */}
        <ProgressBar
          variant="determinate"
          value={((currentQuestion + 1) / questions.length) * 100}
        />

        {/* Question */}
        <QuestionCard>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            {question.question}
          </Typography>

          {/* Answer Options */}
          {question.type === 'single' && question.options?.map((option, idx) => (
            <OptionButton
              key={idx}
              selected={selectedAnswer === option}
              correct={showExplanation && option === question.correctAnswer}
              wrong={showExplanation && selectedAnswer === option && option !== question.correctAnswer}
              color={tutorial.color}
              onClick={() => !showExplanation && handleAnswerSelect(option)}
              elevation={0}
            >
              <Radio
                checked={selectedAnswer === option}
                disabled={showExplanation}
                sx={{ '&.Mui-checked': { color: tutorial.color } }}
              />
              <Typography>{option}</Typography>
              {showExplanation && option === question.correctAnswer && (
                <CheckCircleIcon sx={{ ml: 'auto', color: '#4CAF50' }} />
              )}
            </OptionButton>
          ))}

          {question.type === 'multiple' && question.options?.map((option, idx) => (
            <OptionButton
              key={idx}
              selected={(selectedAnswer as string[])?.includes(option)}
              correct={showExplanation && (question.correctAnswer as string[]).includes(option)}
              wrong={showExplanation && (selectedAnswer as string[])?.includes(option) && !(question.correctAnswer as string[]).includes(option)}
              color={tutorial.color}
              onClick={() => !showExplanation && handleAnswerSelect(option)}
              elevation={0}
            >
              <Checkbox
                checked={(selectedAnswer as string[])?.includes(option)}
                disabled={showExplanation}
                sx={{ '&.Mui-checked': { color: tutorial.color } }}
              />
              <Typography>{option}</Typography>
            </OptionButton>
          ))}

          {question.type === 'text' && (
            <TextField
              fullWidth
              placeholder="Type your answer here..."
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={showExplanation}
              sx={{ mt: 2 }}
            />
          )}

          {/* Explanation */}
          {showExplanation && (
            <Paper
              sx={{
                p: 2,
                mt: 3,
                borderRadius: 2,
                bgcolor: alpha(tutorial.color, 0.05),
                border: `1px solid ${alpha(tutorial.color, 0.2)}`,
              }}
            >
              <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                💡 Explanation
              </Typography>
              <Typography variant="body2">{question.explanation}</Typography>
            </Paper>
          )}

          {/* Actions */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Exit Quiz
            </Button>

            {!showExplanation ? (
              <Button
                variant="contained"
                onClick={handleSubmitAnswer}
                disabled={
                  (question.type === 'text' && !textAnswer.trim()) ||
                  (question.type !== 'text' && (!selectedAnswer || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)))
                }
                sx={{ bgcolor: tutorial.color, '&:hover': { bgcolor: alpha(tutorial.color, 0.9) } }}
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNextQuestion}
                sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#43A047' } }}
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
              </Button>
            )}
          </Box>
        </QuestionCard>
      </QuizContainer>
    </PageContainer>
  );
};

export default QuizPage;

