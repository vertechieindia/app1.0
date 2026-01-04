/**
 * Course Detail Page
 * Displays course information, curriculum, and allows enrollment
 */

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, IconButton, Chip, Grid, Avatar,
  LinearProgress, Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemIcon, ListItemText, Divider, Tab, Tabs,
  Rating, Card, CardContent, Tooltip, CircularProgress, Alert,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QuizIcon from '@mui/icons-material/Quiz';
import CodeIcon from '@mui/icons-material/Code';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LanguageIcon from '@mui/icons-material/Language';
import UpdateIcon from '@mui/icons-material/Update';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';

// Styled Components
const PageContainer = styled(Box)({
  minHeight: '100%',
  backgroundColor: '#f5f7fa',
});

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #0d47a1 100%)',
  padding: '40px',
  color: '#fff',
  position: 'relative',
}));

const CourseImage = styled(Box)({
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  '& img': {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
});

const ProgressBar = styled(LinearProgress)({
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.2)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
  },
});

const LessonItem = styled(ListItem)<{ completed?: boolean; locked?: boolean }>(({ completed, locked }) => ({
  borderRadius: 8,
  marginBottom: 4,
  backgroundColor: completed ? alpha('#4CAF50', 0.05) : 'transparent',
  opacity: locked ? 0.6 : 1,
  cursor: locked ? 'not-allowed' : 'pointer',
  '&:hover': {
    backgroundColor: locked ? 'transparent' : alpha('#0d47a1', 0.05),
  },
}));

// Mock course data
const mockCourse = {
  id: '1',
  title: 'Python for Data Science & Machine Learning',
  subtitle: 'Learn Python from scratch and build ML models with real-world projects',
  description: `Master Python programming and dive into the exciting world of Data Science and Machine Learning. This comprehensive course takes you from absolute beginner to building sophisticated ML models.

You'll learn:
- Python fundamentals and advanced concepts
- NumPy for numerical computing
- Pandas for data manipulation
- Matplotlib & Seaborn for visualization
- Scikit-learn for machine learning
- Real-world projects and case studies`,
  thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
  instructor: {
    name: 'Dr. Sarah Chen',
    avatar: 'S',
    title: 'Senior Data Scientist at Google',
    bio: '10+ years of experience in ML/AI',
    courses: 12,
    students: 150000,
    rating: 4.9,
  },
  duration: '24 hours',
  lessons: 156,
  quizzes: 24,
  projects: 8,
  enrolled: 45230,
  rating: 4.9,
  reviews: 12450,
  difficulty: 'Beginner',
  language: 'English',
  lastUpdated: 'December 2024',
  isFree: false,
  price: 99.99,
  discountPrice: 19.99,
  isCertified: true,
  skills: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'Machine Learning', 'Data Analysis'],
  requirements: [
    'No prior programming experience needed',
    'Basic math skills (high school level)',
    'Computer with internet access',
  ],
  whatYouWillLearn: [
    'Master Python programming from scratch',
    'Work with NumPy arrays and Pandas DataFrames',
    'Create beautiful data visualizations',
    'Build and deploy machine learning models',
    'Handle real-world data science projects',
    'Prepare for data science interviews',
  ],
};

const mockModules = [
  {
    id: '1',
    title: 'Getting Started with Python',
    lessons: [
      { id: '1-1', title: 'Welcome to the Course', type: 'video', duration: '5:30', completed: true, free: true },
      { id: '1-2', title: 'Installing Python & Setup', type: 'video', duration: '12:45', completed: true, free: true },
      { id: '1-3', title: 'Your First Python Program', type: 'video', duration: '15:20', completed: true, free: false },
      { id: '1-4', title: 'Variables and Data Types', type: 'video', duration: '18:00', completed: false, free: false },
      { id: '1-5', title: 'Module Quiz', type: 'quiz', duration: '10 questions', completed: false, free: false },
    ],
  },
  {
    id: '2',
    title: 'Python Fundamentals',
    lessons: [
      { id: '2-1', title: 'Control Flow: If/Else', type: 'video', duration: '20:15', completed: false, free: false },
      { id: '2-2', title: 'Loops: For and While', type: 'video', duration: '22:30', completed: false, free: false },
      { id: '2-3', title: 'Functions in Python', type: 'video', duration: '25:00', completed: false, free: false },
      { id: '2-4', title: 'Practice: Build a Calculator', type: 'project', duration: '45 min', completed: false, free: false },
    ],
  },
  {
    id: '3',
    title: 'Data Structures',
    lessons: [
      { id: '3-1', title: 'Lists and Tuples', type: 'video', duration: '18:45', completed: false, free: false },
      { id: '3-2', title: 'Dictionaries and Sets', type: 'video', duration: '20:00', completed: false, free: false },
      { id: '3-3', title: 'List Comprehensions', type: 'video', duration: '15:30', completed: false, free: false },
      { id: '3-4', title: 'Module Quiz', type: 'quiz', duration: '15 questions', completed: false, free: false },
    ],
  },
  {
    id: '4',
    title: 'NumPy for Numerical Computing',
    lessons: [
      { id: '4-1', title: 'Introduction to NumPy', type: 'video', duration: '12:00', completed: false, free: false },
      { id: '4-2', title: 'Creating Arrays', type: 'video', duration: '18:30', completed: false, free: false },
      { id: '4-3', title: 'Array Operations', type: 'video', duration: '22:15', completed: false, free: false },
      { id: '4-4', title: 'Practice: Matrix Operations', type: 'project', duration: '30 min', completed: false, free: false },
    ],
  },
];

const getLessonIcon = (type: string) => {
  switch (type) {
    case 'video': return <PlayCircleOutlineIcon />;
    case 'quiz': return <QuizIcon />;
    case 'project': return <CodeIcon />;
    case 'article': return <ArticleIcon />;
    default: return <MenuBookIcon />;
  }
};

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string | false>('1');
  const [progress, setProgress] = useState(18); // Mock progress

  const course = mockCourse;
  const modules = mockModules;

  const handleEnroll = () => {
    setIsEnrolled(true);
    // In real app: call courseService.enrollInCourse(courseId)
  };

  const handleStartLesson = (lessonId: string, locked: boolean) => {
    if (locked && !isEnrolled) {
      handleEnroll();
      return;
    }
    navigate(`/techie/learn/${courseId}/lesson/${lessonId}`);
  };

  const completedLessons = modules.flatMap(m => m.lessons).filter(l => l.completed).length;
  const totalLessons = modules.flatMap(m => m.lessons).length;

  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          <IconButton 
            onClick={() => navigate('/techie/learn')} 
            sx={{ color: '#fff', mb: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={course.difficulty} size="small" sx={{ bgcolor: '#4CAF50', color: '#fff' }} />
                {course.isCertified && (
                  <Chip 
                    icon={<WorkspacePremiumIcon sx={{ color: '#FFD700 !important' }} />} 
                    label="Certificate" 
                    size="small" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} 
                  />
                )}
              </Box>

              <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
                {course.title}
              </Typography>

              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, fontWeight: 400 }}>
                {course.subtitle}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StarIcon sx={{ color: '#FFB400' }} />
                  <Typography fontWeight={600}>{course.rating}</Typography>
                  <Typography sx={{ opacity: 0.8 }}>({course.reviews.toLocaleString()} reviews)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PeopleIcon sx={{ fontSize: 20 }} />
                  <Typography>{course.enrolled.toLocaleString()} students</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: '#fff', color: '#0d47a1' }}>
                  {course.instructor.avatar}
                </Avatar>
                <Box>
                  <Typography fontWeight={600}>{course.instructor.name}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>{course.instructor.title}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip icon={<AccessTimeIcon />} label={course.duration} sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }} />
                <Chip icon={<MenuBookIcon />} label={`${course.lessons} lessons`} sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }} />
                <Chip icon={<LanguageIcon />} label={course.language} sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }} />
                <Chip icon={<UpdateIcon />} label={`Updated ${course.lastUpdated}`} sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }} />
              </Box>

              {isEnrolled && (
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Your Progress</Typography>
                    <Typography variant="body2" fontWeight={600}>{progress}% ({completedLessons}/{totalLessons} lessons)</Typography>
                  </Box>
                  <ProgressBar variant="determinate" value={progress} />
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <CourseImage sx={{ mb: 3 }}>
                  <img src={course.thumbnail} alt={course.title} />
                </CourseImage>

                {!course.isFree && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Typography variant="h4" fontWeight={700} color="primary">
                        ${course.discountPrice}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                      >
                        ${course.price}
                      </Typography>
                      <Chip label="80% OFF" size="small" color="error" />
                    </Box>
                  </Box>
                )}

                {isEnrolled ? (
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => handleStartLesson('1-4', false)}
                    sx={{ mb: 2, py: 1.5, borderRadius: 2, bgcolor: '#0d47a1' }}
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleEnroll}
                    sx={{ mb: 2, py: 1.5, borderRadius: 2, bgcolor: '#0d47a1' }}
                  >
                    {course.isFree ? 'Enroll for Free' : 'Enroll Now'}
                  </Button>
                )}

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    {isBookmarked ? 'Saved' : 'Save'}
                  </Button>
                  <Button fullWidth variant="outlined" startIcon={<ShareIcon />}>
                    Share
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  This course includes:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><PlayCircleOutlineIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={`${course.duration} of video content`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><MenuBookIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={`${course.lessons} lessons`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><QuizIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={`${course.quizzes} quizzes`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CodeIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={`${course.projects} projects`} />
                  </ListItem>
                  {course.isCertified && (
                    <ListItem>
                      <ListItemIcon><WorkspacePremiumIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Certificate of completion" />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </HeroSection>

      {/* Course Content */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, v) => setActiveTab(v)}
                sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
              >
                <Tab label="Overview" />
                <Tab label="Curriculum" />
                <Tab label="Reviews" />
                <Tab label="Instructor" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {activeTab === 0 && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      What you'll learn
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                      {course.whatYouWillLearn.map((item, idx) => (
                        <Grid item xs={12} sm={6} key={idx}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 20, mt: 0.3 }} />
                            <Typography variant="body2">{item}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Description
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ whiteSpace: 'pre-line', mb: 4 }}
                    >
                      {course.description}
                    </Typography>

                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Skills you'll gain
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
                      {course.skills.map(skill => (
                        <Chip key={skill} label={skill} variant="outlined" />
                      ))}
                    </Box>

                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Requirements
                    </Typography>
                    <List dense>
                      {course.requirements.map((req, idx) => (
                        <ListItem key={idx}>
                          <ListItemIcon><CheckCircleIcon color="primary" sx={{ fontSize: 18 }} /></ListItemIcon>
                          <ListItemText primary={req} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight={600}>
                        Course Content
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {modules.length} modules • {totalLessons} lessons
                      </Typography>
                    </Box>

                    {modules.map((module, idx) => (
                      <Accordion 
                        key={module.id}
                        expanded={expandedModule === module.id}
                        onChange={() => setExpandedModule(expandedModule === module.id ? false : module.id)}
                        sx={{ mb: 1, borderRadius: 2, '&:before': { display: 'none' } }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight={600}>
                              Module {idx + 1}: {module.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {module.lessons.length} lessons • {module.lessons.filter(l => l.completed).length} completed
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                          <List dense>
                            {module.lessons.map((lesson) => {
                              const locked = !isEnrolled && !lesson.free;
                              return (
                                <LessonItem 
                                  key={lesson.id}
                                  completed={lesson.completed}
                                  locked={locked}
                                  onClick={() => handleStartLesson(lesson.id, locked)}
                                >
                                  <ListItemIcon sx={{ minWidth: 40 }}>
                                    {lesson.completed ? (
                                      <CheckCircleIcon color="success" />
                                    ) : locked ? (
                                      <LockIcon color="disabled" />
                                    ) : (
                                      getLessonIcon(lesson.type)
                                    )}
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={lesson.title}
                                    secondary={lesson.duration}
                                  />
                                  {lesson.free && !isEnrolled && (
                                    <Chip label="Preview" size="small" color="primary" variant="outlined" />
                                  )}
                                </LessonItem>
                              );
                            })}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                )}

                {activeTab === 2 && (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" fontWeight={700} color="primary">
                          {course.rating}
                        </Typography>
                        <Rating value={course.rating} precision={0.1} readOnly />
                        <Typography variant="body2" color="text.secondary">
                          {course.reviews.toLocaleString()} reviews
                        </Typography>
                      </Box>
                    </Box>
                    <Typography color="text.secondary">
                      Reviews coming from the API will be displayed here...
                    </Typography>
                  </Box>
                )}

                {activeTab === 3 && (
                  <Box>
                    <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                      <Avatar sx={{ width: 100, height: 100, bgcolor: '#0d47a1', fontSize: '2.5rem' }}>
                        {course.instructor.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight={600}>
                          {course.instructor.name}
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                          {course.instructor.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                          <Box>
                            <Typography variant="h6" fontWeight={600}>{course.instructor.courses}</Typography>
                            <Typography variant="caption" color="text.secondary">Courses</Typography>
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight={600}>{(course.instructor.students / 1000).toFixed(0)}K</Typography>
                            <Typography variant="caption" color="text.secondary">Students</Typography>
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight={600}>{course.instructor.rating}</Typography>
                            <Typography variant="caption" color="text.secondary">Rating</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {course.instructor.bio}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            {/* More courses by instructor */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                More from this instructor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Coming soon...
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default CourseDetail;

