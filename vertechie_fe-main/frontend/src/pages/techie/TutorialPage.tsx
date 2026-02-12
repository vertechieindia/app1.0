/**
 * Tutorial Page - W3Schools Style Interactive Learning
 * Features: Sidebar navigation, lesson content, Try It Yourself editor, quizzes
 */

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, IconButton, Chip, Grid, List, ListItemText, Collapse, Drawer, useMediaQuery, useTheme,
  Tooltip, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Radio, RadioGroup, FormControlLabel, FormControl,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QuizIcon from '@mui/icons-material/Quiz';
import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import { getTutorialBySlug, Tutorial, Chapter, Lesson } from '../../data/curriculum';


import { PageContainer, Sidebar, SidebarToggle, MainContent, LessonContent, ChapterItem, LessonItem, CodeEditor, TryItEditor, EditorHeader, ResultFrame, NavigationBar, ProgressBar } from './TutorialPage.styles';
import { getLessonContent } from './lessons/getLessonContent';

const TutorialPage: React.FC = () => {
  const { tutorialSlug, lessonSlug } = useParams<{ tutorialSlug: string; lessonSlug?: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    // Load completed lessons from localStorage on mount
    try {
      const saved = localStorage.getItem(`completedLessons_${tutorialSlug}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [editorCode, setEditorCode] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Certificate state
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(() => {
    try {
      const certs = JSON.parse(localStorage.getItem('userCertificates') || '[]');
      return certs.some((c: any) => c.tutorialSlug === tutorialSlug);
    } catch {
      return false;
    }
  });
  
  // Quiz state
  const [showQuizDialog, setShowQuizDialog] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const tutorial = getTutorialBySlug(tutorialSlug || '');

  // Save completed lessons to localStorage whenever they change
  useEffect(() => {
    if (tutorialSlug && completedLessons.length > 0) {
      localStorage.setItem(`completedLessons_${tutorialSlug}`, JSON.stringify(completedLessons));
    }
  }, [completedLessons, tutorialSlug]);

  // Tutorials that run in browser (iframe); others show code + "run in your environment"
  const isBrowserRunnableTutorial = ['html', 'css', 'javascript', 'react', 'angular', 'typescript'].includes(tutorialSlug || '');

  // Quiz questions bank for each tutorial (topic-related)
  const quizQuestionsBank: Record<string, any[]> = {
    html: [
      { q: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], answer: 'Hyper Text Markup Language' },
      { q: 'Which tag is used for the largest heading?', options: ['<h6>', '<heading>', '<h1>', '<head>'], answer: '<h1>' },
      { q: 'Which element is used for a paragraph?', options: ['<p>', '<para>', '<paragraph>', '<text>'], answer: '<p>' },
      { q: 'What is the correct HTML element for inserting a line break?', options: ['<break>', '<lb>', '<br>', '<newline>'], answer: '<br>' },
      { q: 'Which attribute is used to provide a unique identifier?', options: ['class', 'name', 'id', 'key'], answer: 'id' },
      { q: 'Which tag creates a hyperlink?', options: ['<link>', '<a>', '<href>', '<url>'], answer: '<a>' },
      { q: 'Which tag is used for an unordered list?', options: ['<ol>', '<list>', '<ul>', '<li>'], answer: '<ul>' },
      { q: 'What is the correct way to add a comment in HTML?', options: ['// comment', '/* comment */', '<!-- comment -->', '# comment'], answer: '<!-- comment -->' },
    ],
    css: [
      { q: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'], answer: 'Cascading Style Sheets' },
      { q: 'Which property changes the text color?', options: ['text-color', 'font-color', 'color', 'foreground'], answer: 'color' },
      { q: 'Which property is used to change the background color?', options: ['bgcolor', 'background-color', 'color-background', 'back-color'], answer: 'background-color' },
      { q: 'How do you select an element with id "demo"?', options: ['.demo', '#demo', 'demo', '*demo'], answer: '#demo' },
      { q: 'How do you select elements with class "test"?', options: ['#test', '.test', 'test', '*test'], answer: '.test' },
      { q: 'Which property controls the text size?', options: ['font-style', 'text-size', 'font-size', 'text-style'], answer: 'font-size' },
    ],
    javascript: [
      { q: 'Which keyword declares a variable?', options: ['var', 'let', 'const', 'All of the above'], answer: 'All of the above' },
      { q: 'Which method prints to the console?', options: ['print()', 'log()', 'console.log()', 'write()'], answer: 'console.log()' },
      { q: 'How do you create a function?', options: ['function myFunc()', 'create myFunc()', 'def myFunc()', 'func myFunc()'], answer: 'function myFunc()' },
      { q: 'Which operator is used for strict equality?', options: ['==', '===', '=', '!='], answer: '===' },
      { q: 'Which method adds an element to the end of an array?', options: ['push()', 'add()', 'append()', 'insert()'], answer: 'push()' },
      { q: 'What is the correct way to write an IF statement?', options: ['if i = 5', 'if (i == 5)', 'if i == 5 then', 'if i = 5 then'], answer: 'if (i == 5)' },
    ],
    python: [
      { q: 'How do you print "Hello" in Python?', options: ['echo("Hello")', 'print("Hello")', 'console.log("Hello")', 'printf("Hello")'], answer: 'print("Hello")' },
      { q: 'Which keyword is used to define a function?', options: ['function', 'func', 'def', 'define'], answer: 'def' },
      { q: 'How do you create a comment in Python?', options: ['// comment', '/* comment */', '# comment', '<!-- comment -->'], answer: '# comment' },
      { q: 'Which is the correct way to create a list?', options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = <1, 2, 3>'], answer: 'list = [1, 2, 3]' },
    ],
    react: [
      { q: 'What is used to create a React component?', options: ['function or class', 'module', 'package', 'library'], answer: 'function or class' },
      { q: 'Which hook is used for state management?', options: ['useEffect', 'useState', 'useContext', 'useReducer'], answer: 'useState' },
      { q: 'What is JSX?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'], answer: 'JavaScript XML' },
      { q: 'Which method renders a React component?', options: ['ReactDOM.render()', 'React.render()', 'render()', 'component.render()'], answer: 'ReactDOM.render()' },
    ],
    sql: [
      { q: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'Stored Query List'], answer: 'Structured Query Language' },
      { q: 'Which clause is used to filter rows?', options: ['SELECT', 'FROM', 'WHERE', 'ORDER BY'], answer: 'WHERE' },
      { q: 'Which statement is used to add new rows?', options: ['ADD', 'INSERT INTO', 'CREATE', 'UPDATE'], answer: 'INSERT INTO' },
      { q: 'Which JOIN returns only matching rows from both tables?', options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], answer: 'INNER JOIN' },
      { q: 'Which keyword selects all columns?', options: ['*', 'ALL', 'EVERY', '#'], answer: '*' },
      { q: 'Which statement removes rows from a table?', options: ['REMOVE', 'DROP', 'DELETE FROM', 'CLEAR'], answer: 'DELETE FROM' },
      { q: 'What is used to update existing rows?', options: ['UPDATE...SET', 'MODIFY', 'CHANGE', 'ALTER'], answer: 'UPDATE...SET' },
      { q: 'Which JOIN returns all rows from the left table?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'], answer: 'LEFT JOIN' },
    ],
    nodejs: [
      { q: 'What is Node.js?', options: ['A JavaScript runtime', 'A programming language', 'A database', 'A browser'], answer: 'A JavaScript runtime' },
      { q: 'Which command installs a package locally?', options: ['npm add', 'npm install', 'node install', 'npm get'], answer: 'npm install' },
      { q: 'Which built-in module is used for file system operations?', options: ['file', 'fs', 'path', 'io'], answer: 'fs' },
      { q: 'Which method creates an HTTP server in Node?', options: ['http.server()', 'http.createServer()', 'createServer()', 'new Server()'], answer: 'http.createServer()' },
      { q: 'What is Express?', options: ['A database', 'A web framework for Node', 'A browser', 'A language'], answer: 'A web framework for Node' },
      { q: 'Which function loads a module in Node (CommonJS)?', options: ['import', 'load', 'require()', 'include'], answer: 'require()' },
      { q: 'What does NPM stand for?', options: ['Node Package Manager', 'New Project Manager', 'Node Program Module', 'Network Package Manager'], answer: 'Node Package Manager' },
      { q: 'Which Express method handles GET requests?', options: ['app.get()', 'app.getRequest()', 'app.fetch()', 'app.read()'], answer: 'app.get()' },
    ],
    git: [
      { q: 'What is Git?', options: ['A programming language', 'A version control system', 'An editor', 'A browser'], answer: 'A version control system' },
      { q: 'Which command stages files for commit?', options: ['git stage', 'git add', 'git commit', 'git save'], answer: 'git add' },
      { q: 'Which command saves a snapshot with a message?', options: ['git save', 'git add', 'git commit', 'git snapshot'], answer: 'git commit' },
      { q: 'Which command sends commits to a remote?', options: ['git send', 'git upload', 'git push', 'git deploy'], answer: 'git push' },
      { q: 'Which command gets latest changes from remote?', options: ['git fetch', 'git get', 'git pull', 'git sync'], answer: 'git pull' },
      { q: 'Which command creates a new branch?', options: ['git new branch', 'git branch', 'git checkout -b', 'git create branch'], answer: 'git checkout -b' },
      { q: 'Which command merges a branch into current branch?', options: ['git merge', 'git combine', 'git join', 'git integrate'], answer: 'git merge' },
      { q: 'What does git clone do?', options: ['Deletes a repo', 'Copies a repo from remote', 'Creates a new branch', 'Merges two repos'], answer: 'Copies a repo from remote' },
    ],
    'machine-learning': [
      { q: 'What is Machine Learning?', options: ['Programming with rules only', 'Systems that learn from data', 'A type of database', 'A programming language'], answer: 'Systems that learn from data' },
      { q: 'Which type of ML uses labeled data?', options: ['Unsupervised', 'Supervised', 'Reinforcement', 'Semi-supervised'], answer: 'Supervised' },
      { q: 'What does regression predict?', options: ['Categories', 'Continuous values', 'Labels', 'Clusters'], answer: 'Continuous values' },
      { q: 'What does classification predict?', options: ['Numbers', 'Categories/classes', 'Probabilities only', 'Clusters'], answer: 'Categories/classes' },
      { q: 'Which algorithm groups similar data without labels?', options: ['Regression', 'Classification', 'Clustering', 'Decision tree'], answer: 'Clustering' },
      { q: 'What is K-Means?', options: ['A classification algorithm', 'A clustering algorithm', 'A regression model', 'A neural network'], answer: 'A clustering algorithm' },
      { q: 'Which library is commonly used for ML in Python?', options: ['React', 'jQuery', 'scikit-learn', 'Express'], answer: 'scikit-learn' },
      { q: 'What is a decision tree?', options: ['A database', 'A model that splits data by feature conditions', 'A type of neural network', 'A clustering method'], answer: 'A model that splits data by feature conditions' },
    ],
  };

  // Generate random quiz questions for current tutorial
  const generateQuizQuestions = () => {
    const bank = quizQuestionsBank[tutorialSlug || ''] || quizQuestionsBank['html'];
    const shuffled = [...bank].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(5, shuffled.length)); // 5 random questions
  };

  // Start quiz
  const handleStartQuiz = () => {
    setQuizQuestions(generateQuizQuestions());
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizCompleted(false);
    setShowQuizDialog(true);
  };

  // Submit quiz answer
  const handleSubmitAnswer = () => {
    if (selectedAnswer === quizQuestions[currentQuizIndex].answer) {
      setQuizScore(quizScore + 1);
    }
    
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  // Generate certificate
  const generateCertificate = () => {
    if (certificateGenerated) return;
    
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const certificate = {
      id: `cert_${tutorialSlug}_${Date.now()}`,
      tutorialSlug: tutorialSlug,
      tutorialTitle: tutorial?.title || 'Tutorial',
      userName: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email || 'Student',
      completedAt: new Date().toISOString(),
      totalLessons: totalLessons,
    };
    
    // Save to localStorage
    const existingCerts = JSON.parse(localStorage.getItem('userCertificates') || '[]');
    if (!existingCerts.some((c: any) => c.tutorialSlug === tutorialSlug)) {
      existingCerts.push(certificate);
      localStorage.setItem('userCertificates', JSON.stringify(existingCerts));
      setCertificateGenerated(true);
      setShowCertificateDialog(true);
    }
  };

  // Check if all lessons completed and generate certificate
  const totalLessons = tutorial?.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0) || 0;
  const currentLessonSlug = lessonSlug || tutorial?.chapters[0]?.lessons[0]?.slug || 'home';

  // Get current lesson
  const getCurrentLesson = (): { chapter: Chapter; lesson: Lesson; index: number } | null => {
    if (!tutorial) return null;
    
    let index = 0;
    for (const chapter of tutorial.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.slug === currentLessonSlug) {
          return { chapter, lesson, index };
        }
        index++;
      }
    }
    return null;
  };

  const currentLessonData = getCurrentLesson();
  const lessonContent = getLessonContent(tutorialSlug || '', currentLessonSlug);

  // Initialize editor code and reset result when lesson changes
  useEffect(() => {
    if (lessonContent.tryItCode) {
      setEditorCode(lessonContent.tryItCode);
    } else {
      setEditorCode('');
    }
    setShowResult(false); // Reset result view for new lesson
  }, [currentLessonSlug, lessonContent.tryItCode]);

  // Expand chapter containing current lesson
  useEffect(() => {
    if (currentLessonData) {
      setExpandedChapters(prev =>
        prev.includes(currentLessonData.chapter.id)
          ? prev
          : [...prev, currentLessonData.chapter.id]
      );
    }
  }, [currentLessonData?.chapter.id]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const navigateToLesson = (lessonSlug: string) => {
    navigate(`/techie/learn/tutorial/${tutorialSlug}/${lessonSlug}`);
    setDrawerOpen(false);
  };

  const getNextLesson = (): Lesson | null => {
    if (!tutorial || !currentLessonData) return null;
    
    let foundCurrent = false;
    for (const chapter of tutorial.chapters) {
      for (const lesson of chapter.lessons) {
        if (foundCurrent) return lesson;
        if (lesson.slug === currentLessonSlug) foundCurrent = true;
      }
    }
    return null;
  };

  const getPrevLesson = (): Lesson | null => {
    if (!tutorial || !currentLessonData) return null;
    
    let prevLesson: Lesson | null = null;
    for (const chapter of tutorial.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.slug === currentLessonSlug) return prevLesson;
        prevLesson = lesson;
      }
    }
    return null;
  };

  const nextLesson = getNextLesson();
  const prevLesson = getPrevLesson();

  // Calculate progress
  const progress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;

  const handleRunCode = () => {
    setShowResult(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorCode);
  };

  const handleResetCode = () => {
    setEditorCode(lessonContent.tryItCode);
  };

  const markComplete = () => {
    let newCompletedLessons = completedLessons;
    if (!completedLessons.includes(currentLessonSlug)) {
      newCompletedLessons = [...completedLessons, currentLessonSlug];
      setCompletedLessons(newCompletedLessons);
    }
    
    // Check if all lessons are now completed
    if (newCompletedLessons.length >= totalLessons && !certificateGenerated) {
      // All lessons completed! Generate certificate
      generateCertificate();
    } else if (nextLesson) {
      navigateToLesson(nextLesson.slug);
    }
  };

  if (!tutorial) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4">Tutorial not found</Typography>
        <Button onClick={() => navigate('/techie/learn')} sx={{ mt: 2 }}>
          Back to Learn
        </Button>
      </Box>
    );
  }

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Sidebar content
  const sidebarContent = (
    <Sidebar tutorialColor={tutorial.color} collapsed={!sidebarVisible}>
      <Box className="sidebar-header">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={() => navigate('/techie/learn')} sx={{ color: '#fff' }}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>
            {tutorial.icon} {tutorial.shortTitle}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          {tutorial.totalLessons} Lessons • {tutorial.totalHours}h
        </Typography>
        <ProgressBar value={progress} variant="determinate" barColor="#fff" sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.3)' }} />
      </Box>

      <List dense disablePadding className="sidebar-list" sx={{ py: 1 }}>
        {tutorial.chapters.map(chapter => (
          <Box key={chapter.id}>
            <ChapterItem
              onClick={() => toggleChapter(chapter.id)}
              sx={{ py: 1.5, px: 2 }}
            >
              <ListItemText
                primary={chapter.title}
                primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                secondary={`${chapter.lessons.length} lessons`}
                secondaryTypographyProps={{ fontSize: '0.75rem' }}
              />
              {expandedChapters.includes(chapter.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ChapterItem>

            <Collapse in={expandedChapters.includes(chapter.id)}>
              <List dense disablePadding>
                {chapter.lessons.map(lesson => (
                  <LessonItem
                    key={lesson.id}
                    active={lesson.slug === currentLessonSlug}
                    completed={completedLessons.includes(lesson.slug)}
                    color={tutorial.color}
                    onClick={() => navigateToLesson(lesson.slug)}
                  >
                    {completedLessons.includes(lesson.slug) ? (
                      <CheckCircleIcon sx={{ fontSize: 18, color: '#4CAF50', mr: 1 }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: '#ccc', mr: 1 }} />
                    )}
                    <ListItemText
                      primary={lesson.title}
                      primaryTypographyProps={{ fontSize: '0.85rem' }}
                    />
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {lesson.hasTryIt && (
                        <Tooltip title="Try it Yourself">
                          <CodeIcon sx={{ fontSize: 14, color: tutorial.color }} />
                        </Tooltip>
                      )}
                      {lesson.hasQuiz && (
                        <Tooltip title="Quiz">
                          <QuizIcon sx={{ fontSize: 14, color: '#FF9800' }} />
                        </Tooltip>
                      )}
                    </Box>
                  </LessonItem>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>
    </Sidebar>
  );

  // Render markdown-like content
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <CodeEditor key={`code-${idx}`} darkMode={darkMode} sx={{ mb: 3 }}>
              {codeContent.trim()}
            </CodeEditor>
          );
          codeContent = '';
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
        }
      } else if (inCodeBlock) {
        codeContent += line + '\n';
      } else if (line.startsWith('# ')) {
        elements.push(
          <Typography key={idx} variant="h4" fontWeight={700} sx={{ mb: 2, mt: 3 }}>
            {line.replace('# ', '')}
          </Typography>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <Typography key={idx} variant="h5" fontWeight={600} sx={{ mb: 2, mt: 3 }}>
            {line.replace('## ', '')}
          </Typography>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <Typography key={idx} variant="body1" sx={{ ml: 2, mb: 1, display: 'flex', alignItems: 'flex-start' }}>
            <Box component="span" sx={{ mr: 1, color: tutorial.color }}>•</Box>
            <span dangerouslySetInnerHTML={{ __html: line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code style="background:#f0f0f0;padding:2px 6px;border-radius:4px;font-family:monospace;">$1</code>') }} />
          </Typography>
        );
      } else if (line.trim()) {
        elements.push(
          <Typography key={idx} variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code style="background:#f0f0f0;padding:2px 6px;border-radius:4px;font-family:monospace;">$1</code>') }} />
          </Typography>
        );
      }
    });

    return elements;
  };

  return (
    <PageContainer>
      {/* Mobile menu button */}
      {isMobile && (
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1100, bgcolor: '#fff', boxShadow: 2 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Desktop Sidebar Toggle Button */}
      {!isMobile && (
        <Tooltip title={sidebarVisible ? "Hide Sidebar" : "Show Sidebar"} placement="right">
          <SidebarToggle
            onClick={toggleSidebar}
            tutorialColor={tutorial.color}
            sidebarVisible={sidebarVisible}
          >
            {sidebarVisible ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </SidebarToggle>
        </Tooltip>
      )}

      {/* Sidebar - Desktop */}
      {!isMobile && sidebarContent}

      {/* Sidebar - Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 280 } }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content */}
      <MainContent sidebarVisible={sidebarVisible}>
        {/* Lesson Content */}
        <LessonContent>
          {/* Breadcrumb */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Chip
              label={tutorial.shortTitle}
              size="small"
              sx={{ bgcolor: tutorial.bgColor, color: tutorial.color, fontWeight: 600 }}
            />
            <Typography color="text.secondary">/</Typography>
            <Typography variant="body2" color="text.secondary">
              {currentLessonData?.chapter.title}
            </Typography>
          </Box>

          {/* Lesson Title */}
          <Typography variant="h3" fontWeight={800} sx={{ mb: 4, color: tutorial.color }}>
            {lessonContent.title}
          </Typography>

          {/* Content */}
          {renderContent(lessonContent.content)}

          {/* Try It Yourself Editor - Side by Side Layout */}
          {lessonContent.tryItCode && (
            <Box sx={{ mt: 5, mb: 4 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CodeIcon sx={{ color: tutorial.color }} />
                Try it Yourself
              </Typography>

              <Grid container spacing={2}>
                {/* Left Side - Code Editor */}
                <Grid item xs={12} md={6}>
                  <TryItEditor darkMode={darkMode} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <EditorHeader color={tutorial.color}>
                      <Typography fontWeight={600}>Code Editor</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Copy Code">
                          <IconButton size="small" onClick={handleCopyCode} sx={{ color: '#fff' }}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reset Code">
                          <IconButton size="small" onClick={handleResetCode} sx={{ color: '#fff' }}>
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
                          <IconButton size="small" onClick={() => setDarkMode(!darkMode)} sx={{ color: '#fff' }}>
                            {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </EditorHeader>

                    <TextField
                      multiline
                      fullWidth
                      value={editorCode}
                      onChange={(e) => setEditorCode(e.target.value)}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          fontFamily: '"Fira Code", monospace',
                          fontSize: 14,
                          p: 2,
                          bgcolor: darkMode ? '#1e1e1e' : '#fafafa',
                          color: darkMode ? '#d4d4d4' : '#333',
                          minHeight: 300,
                          flex: 1,
                        },
                      }}
                    />

                    <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: darkMode ? '#252525' : '#f5f5f5' }}>
                      <Button
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        onClick={handleRunCode}
                        sx={{
                          bgcolor: '#4CAF50',
                          '&:hover': { bgcolor: '#43A047' },
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Run Code
                      </Button>
                    </Box>
                  </TryItEditor>
                </Grid>

                {/* Right Side - Result Preview */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      height: '100%',
                      minHeight: 400,
                      border: '2px solid #e0e0e0',
                      borderRadius: 2,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 1.5,
                        bgcolor: '#f8f9fa',
                        borderBottom: '1px solid #e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f57' }} />
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#febc2e' }} />
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#28c840' }} />
                      </Box>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ ml: 1, color: '#666' }}>
                        Result Preview
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        bgcolor: '#fff',
                        p: 2,
                        overflow: 'auto',
                      }}
                    >
                      {showResult ? (
                        isBrowserRunnableTutorial ? (
                          <iframe
                            srcDoc={editorCode}
                            title="Result Preview"
                            sandbox="allow-scripts allow-same-origin"
                            style={{
                              width: '100%',
                              height: '100%',
                              minHeight: 350,
                              border: 'none',
                              backgroundColor: '#fff',
                            }}
                          />
                        ) : (
                          <Box sx={{ height: '100%' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {tutorialSlug === 'sql' && 'Run this SQL in your database client (MySQL, PostgreSQL, etc.).'}
                              {tutorialSlug === 'nodejs' && 'Run in terminal: node script.js (save code to a .js file first).'}
                              {tutorialSlug === 'git' && 'Run these commands in your terminal (Git Bash, PowerShell, or OS terminal).'}
                              {tutorialSlug === 'python' && 'Run in Python (terminal or Jupyter): save as .py file and run python script.py.'}
                              {tutorialSlug === 'machine-learning' && 'Run in Python (e.g. Jupyter or terminal): pip install scikit-learn, then run the code.'}
                            </Typography>
                            <Box
                              component="pre"
                              sx={{
                                fontFamily: '"Fira Code", monospace',
                                fontSize: 13,
                                p: 2,
                                bgcolor: '#1e1e1e',
                                color: '#d4d4d4',
                                borderRadius: 1,
                                overflow: 'auto',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all',
                                m: 0,
                              }}
                            >
                              {editorCode}
                            </Box>
                          </Box>
                        )
                      ) : (
                        <Box
                          sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                          }}
                        >
                          <Typography variant="body2">
                            {isBrowserRunnableTutorial
                              ? 'Click "Run Code" to see the result'
                              : 'Click "Run Code" to see your code and run instructions'}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Quiz Section Placeholder */}
          {currentLessonData?.lesson.hasQuiz && (
            <Paper sx={{ p: 3, mt: 4, borderRadius: 3, bgcolor: alpha('#FF9800', 0.05), border: '1px solid #FF9800' }}>
              <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <QuizIcon sx={{ color: '#FF9800' }} />
                Test Yourself
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                Take a quiz to test your understanding of this lesson.
              </Typography>
              <Button
                variant="contained"
                onClick={handleStartQuiz}
                sx={{ bgcolor: '#FF9800', '&:hover': { bgcolor: '#F57C00' }, textTransform: 'none' }}
              >
                Start Quiz
              </Button>
            </Paper>
          )}
        </LessonContent>

        {/* Navigation Bar */}
        <NavigationBar color={tutorial.color}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            disabled={!prevLesson}
            onClick={() => prevLesson && navigateToLesson(prevLesson.slug)}
            sx={{ textTransform: 'none' }}
          >
            {prevLesson?.title || 'Previous'}
          </Button>

          <Button
            variant="contained"
            endIcon={<CheckCircleIcon />}
            onClick={markComplete}
            sx={{
              bgcolor: '#4CAF50',
              '&:hover': { bgcolor: '#43A047' },
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Complete & Continue
          </Button>

          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            disabled={!nextLesson}
            onClick={() => nextLesson && navigateToLesson(nextLesson.slug)}
            sx={{ textTransform: 'none' }}
          >
            {nextLesson?.title || 'Next'}
          </Button>
        </NavigationBar>
      </MainContent>

      {/* Certificate Dialog */}
      <Dialog open={showCertificateDialog} onClose={() => setShowCertificateDialog(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 5 }}>
          <Box sx={{ 
            width: 100, height: 100, borderRadius: '50%', 
            bgcolor: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            mx: 'auto', mb: 3 
          }}>
            <EmojiEventsIcon sx={{ fontSize: 50, color: '#fff' }} />
          </Box>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: '#1a237e' }}>
            🎉 Congratulations!
          </Typography>
          <Typography variant="h6" gutterBottom>
            You have completed all lessons in
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ color: tutorial?.color, mb: 2 }}>
            {tutorial?.icon} {tutorial?.title}
          </Typography>
          <Box sx={{ 
            border: '3px solid #FFD700', 
            borderRadius: 3, 
            p: 3, 
            bgcolor: alpha('#FFD700', 0.05),
            mt: 3 
          }}>
            <WorkspacePremiumIcon sx={{ fontSize: 40, color: '#FFD700', mb: 1 }} />
            <Typography variant="h6" fontWeight={600}>
              Certificate of Completion
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This certificate is now available in your profile!
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            variant="contained" 
            onClick={() => {
              setShowCertificateDialog(false);
              navigate('/techie/profile');
            }}
            sx={{ bgcolor: '#4CAF50', px: 4 }}
          >
            View in Profile
          </Button>
          <Button onClick={() => setShowCertificateDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={showQuizDialog} onClose={() => setShowQuizDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: tutorial?.color, color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
          <QuizIcon />
          {quizCompleted ? 'Quiz Results' : `Question ${currentQuizIndex + 1} of ${quizQuestions.length}`}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {quizCompleted ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h2" fontWeight={700} sx={{ color: quizScore >= quizQuestions.length / 2 ? '#4CAF50' : '#f44336' }}>
                {quizScore}/{quizQuestions.length}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                {quizScore >= quizQuestions.length / 2 ? '🎉 Great job!' : '📚 Keep practicing!'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                You answered {quizScore} out of {quizQuestions.length} questions correctly.
              </Typography>
            </Box>
          ) : quizQuestions.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                {quizQuestions[currentQuizIndex]?.q}
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedAnswer || ''}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                >
                  {quizQuestions[currentQuizIndex]?.options.map((option: string, idx: number) => (
                    <FormControlLabel
                      key={idx}
                      value={option}
                      control={<Radio sx={{ color: tutorial?.color, '&.Mui-checked': { color: tutorial?.color } }} />}
                      label={option}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        mb: 1,
                        mx: 0,
                        p: 1,
                        '&:hover': { bgcolor: alpha(tutorial?.color || '#0d47a1', 0.05) },
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {quizCompleted ? (
            <>
              <Button onClick={() => {
                setQuizCompleted(false);
                setCurrentQuizIndex(0);
                setQuizQuestions(generateQuizQuestions());
                setSelectedAnswer(null);
                setQuizScore(0);
              }}>
                Try Again
              </Button>
              <Button variant="contained" onClick={() => setShowQuizDialog(false)} sx={{ bgcolor: tutorial?.color }}>
                Done
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setShowQuizDialog(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                sx={{ bgcolor: tutorial?.color }}
              >
                {currentQuizIndex < quizQuestions.length - 1 ? 'Next' : 'Finish'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default TutorialPage;

