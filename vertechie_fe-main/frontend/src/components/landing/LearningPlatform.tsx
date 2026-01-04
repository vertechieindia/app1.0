import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, CardMedia, Button, Chip, Rating, LinearProgress, Tab, Tabs, useTheme, useMediaQuery, Avatar, Badge } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import CloudIcon from '@mui/icons-material/Cloud';
import JavascriptIcon from '@mui/icons-material/Javascript';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Keyframe animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const LearningSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  background: 'linear-gradient(135deg, #f0f8ff 0%, #f5f5f5 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/grid-pattern.svg")',
    opacity: 0.05,
    pointerEvents: 'none',
  }
}));

const CourseCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s ease-in-out',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    '& .course-image': {
      transform: 'scale(1.05)',
    },
    '& .enroll-button': {
      backgroundColor: theme.palette.primary.dark,
      transform: 'translateY(-3px)',
    }
  },
}));

const CourseImage = styled(CardMedia)(({ theme }) => ({
  height: 180,
  transition: 'transform 0.5s ease-in-out',
  position: 'relative',
}));

const CourseImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
  display: 'flex',
  alignItems: 'flex-end',
  padding: theme.spacing(2),
  zIndex: 1,
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  zIndex: 2,
  fontWeight: 600,
  backdropFilter: 'blur(4px)',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
}));

const EnrollButton = styled(Button)(({ theme }) => ({
  marginTop: 'auto',
  borderRadius: '50px',
  padding: theme.spacing(1, 3),
  transition: 'all 0.3s ease',
  fontWeight: 600,
  boxShadow: '0 4px 15px rgba(26, 35, 126, 0.2)',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: '3px',
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    padding: theme.spacing(1.5, 3),
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiTabs-scrollButtons': {
    '&.Mui-disabled': {
      opacity: 0.3,
    },
  },
}));

interface AnimatedBoxProps {
  delay?: number;
  children: React.ReactNode;
}

// Create the AnimatedBox component with proper typing
const AnimatedBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'delay',
})<AnimatedBoxProps>(({ delay = 0 }) => ({
  animation: `${fadeIn} 1s ease forwards ${delay}s`,
  opacity: 0,
  willChange: 'opacity, transform'
}));

const ProgressWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(1),
  '& .MuiLinearProgress-root': {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
  }
}));

const InstructorBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(1),
  '& .MuiAvatar-root': {
    width: 24,
    height: 24,
    marginRight: theme.spacing(1),
    border: `2px solid ${theme.palette.primary.light}`,
  }
}));

const FeaturePaper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: 'white',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
    '& .icon-wrapper': {
      transform: 'scale(1.1) rotate(10deg)',
    }
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  color: 'white',
  transition: 'transform 0.3s ease',
}));

const courses = [
  {
    id: 1,
    title: 'React Basics',
    description: 'Master React with expert-led videos, hands-on projects, and quizzes. Perfect for beginners looking to build modern web apps.',
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
    fallbackImage: '/images/course-fallback-1.jpg',
    category: 'Web Development',
    level: 'Beginner',
    instructor: {
      name: 'David Chen',
      avatar: 'https://i.pravatar.cc/150?img=11',
      fallbackAvatar: '/avatars/instructor-1.jpg',
      verified: true
    },
    rating: 4.8,
    students: 1250,
    hours: 12,
    progress: 0,
    icon: <CodeIcon />
  },
  {
    id: 2,
    title: 'Cybersecurity 101',
    description: 'Learn the fundamentals of cybersecurity with practical challenges and real-world scenarios. Protect systems like a pro.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
    fallbackImage: '/images/course-fallback-2.jpg',
    category: 'Security',
    level: 'Intermediate',
    instructor: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=5',
      fallbackAvatar: '/avatars/instructor-2.jpg',
      verified: true
    },
    rating: 4.9,
    students: 980,
    hours: 15,
    progress: 35,
    icon: <SecurityIcon />
  },
  {
    id: 3,
    title: 'Data Engineering',
    description: 'Build scalable data pipelines with expert guidance. Includes videos, docs, and hands-on projects for real-world application.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    fallbackImage: '/images/course-fallback-3.jpg',
    category: 'Data Science',
    level: 'Advanced',
    instructor: {
      name: 'Michael Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=12',
      fallbackAvatar: '/avatars/instructor-3.jpg',
      verified: true
    },
    rating: 4.7,
    students: 750,
    hours: 20,
    progress: 75,
    icon: <IntegrationInstructionsIcon />
  },
  {
    id: 4,
    title: 'Advanced JavaScript',
    description: 'Deep dive into JavaScript with coding challenges similar to LeetCode. Master advanced concepts with practical examples.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    fallbackImage: '/images/course-fallback-4.jpg',
    category: 'Web Development',
    level: 'Advanced',
    instructor: {
      name: 'Emma Wilson',
      avatar: 'https://i.pravatar.cc/150?img=9',
      fallbackAvatar: '/avatars/instructor-4.jpg',
      verified: true
    },
    rating: 4.6,
    students: 1100,
    hours: 18,
    progress: 50,
    icon: <JavascriptIcon />
  },
  {
    id: 5,
    title: 'Cloud Migration',
    description: 'Learn to migrate applications to the cloud seamlessly. Includes case studies, quizzes, and expert tips for success.',
    image: 'https://images.unsplash.com/photo-1508345228704-935cc84bf5e2',
    fallbackImage: '/images/course-fallback-5.jpg',
    category: 'Cloud Computing',
    level: 'Intermediate',
    instructor: {
      name: 'James Taylor',
      avatar: 'https://i.pravatar.cc/150?img=15',
      fallbackAvatar: '/avatars/instructor-5.jpg',
      verified: false
    },
    rating: 4.5,
    students: 820,
    hours: 14,
    progress: 20,
    icon: <CloudIcon />
  },
  {
    id: 6,
    title: 'Python for Beginners',
    description: 'Start your coding journey with Python. Learn the basics through interactive lessons and real-world projects.',
    image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0',
    fallbackImage: '/images/course-fallback-6.jpg',
    category: 'Programming',
    level: 'Beginner',
    instructor: {
      name: 'Rebecca Martinez',
      avatar: 'https://i.pravatar.cc/150?img=25',
      fallbackAvatar: '/avatars/instructor-6.jpg',
      verified: true
    },
    rating: 4.9,
    students: 1500,
    hours: 10,
    progress: 0,
    icon: <IntegrationInstructionsIcon />
  }
];

const features = [
  {
    title: 'Expert-Led Videos',
    description: 'Learn from industry professionals with years of experience in their respective fields.',
    icon: <PlayArrowIcon fontSize="large" />
  },
  {
    title: 'Interactive Coding Challenges',
    description: 'Practice your skills with real-world challenges and get immediate feedback.',
    icon: <CodeIcon fontSize="large" />
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed Git-like progress tracking.',
    icon: <SignalCellularAltIcon fontSize="large" />
  },
  {
    title: 'Verified Certificates',
    description: 'Earn certificates recognized by top companies in the industry.',
    icon: <VerifiedIcon fontSize="large" />
  }
];

const LearningPlatform = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [tab, setTab] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [avatarErrors, setAvatarErrors] = useState<Record<number, boolean>>({});

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  
  const handleImageError = (courseId: number) => {
    setImageErrors(prev => ({
      ...prev,
      [courseId]: true
    }));
  };

  const handleAvatarError = (courseId: number) => {
    setAvatarErrors(prev => ({
      ...prev,
      [courseId]: true
    }));
  };
  
  const filteredCourses = tab === 0 
    ? courses 
    : tab === 1 
      ? courses.filter(course => course.level === 'Beginner')
      : tab === 2 
        ? courses.filter(course => course.level === 'Intermediate')
        : courses.filter(course => course.level === 'Advanced');
  
  return (
    <LearningSection>
      <Container
        maxWidth={false}
        sx={{
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, md: 6, lg: 8 },
          overflowX: 'hidden'
        }}
      >
        <AnimatedBox delay={0.1}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Upskill with VerTechie's Learning Platform
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 4,
                maxWidth: 800,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.6
              }}
            >
              Our learning platform offers courses created by industry experts, covering everything from coding to cybersecurity. 
              Learn through videos, documents, quizzes, and coding challenges, with progress tracking like Git.
            </Typography>

            {/* Feature grid */}
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 3,
                mb: 6,
                mt: 6
              }}
            >
              {features.map((feature, index) => (
                <AnimatedBox key={index} delay={0.3 + (index * 0.1)}>
                  <FeaturePaper>
                    <IconWrapper className="icon-wrapper">
                      {feature.icon}
                    </IconWrapper>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </FeaturePaper>
                </AnimatedBox>
              ))}
            </Box>
          </Box>
        </AnimatedBox>

        {/* Course tabs */}
        <AnimatedBox delay={0.4}>
          <StyledTabs
            value={tab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="Course difficulty tabs"
            centered={!isMobile}
            sx={{ mb: 4 }}
          >
            <Tab label="All Courses" aria-label="All courses tab" />
            <Tab label="Beginner" aria-label="Beginner courses tab" />
            <Tab label="Intermediate" aria-label="Intermediate courses tab" />
            <Tab label="Advanced" aria-label="Advanced courses tab" />
          </StyledTabs>
        </AnimatedBox>

        {/* Course grid */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              lg: 'repeat(3, 1fr)' 
            },
            gap: 4
          }}
        >
          {filteredCourses.map((course, index) => (
            <AnimatedBox key={course.id} delay={0.5 + (index * 0.1)}>
              <CourseCard>
                <CourseImage
                  className="course-image"
                  image={imageErrors[course.id] ? course.fallbackImage : course.image}
                  title={course.title}
                  onError={() => handleImageError(course.id)}
                >
                  <CategoryChip 
                    icon={course.icon} 
                    label={course.category} 
                    size="small" 
                    color="primary"
                  />
                  <CourseImageOverlay>
                    <Typography variant="subtitle1" color="white" fontWeight={600}>
                      {course.level} • {course.hours} hours
                    </Typography>
                  </CourseImageOverlay>
                </CourseImage>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {course.description}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={course.rating} precision={0.5} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({course.rating})
                    </Typography>
                  </Box>
                  
                  <InstructorBadge>
                    <Avatar 
                      src={avatarErrors[course.id] ? course.instructor.fallbackAvatar : course.instructor.avatar} 
                      alt={course.instructor.name}
                      imgProps={{
                        loading: 'lazy',
                        onError: () => handleAvatarError(course.id)
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {course.instructor.name}
                      {course.instructor.verified && (
                        <VerifiedIcon sx={{ fontSize: 14, ml: 0.5, color: 'primary.main' }} />
                      )}
                    </Typography>
                  </InstructorBadge>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <SchoolIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {course.students.toLocaleString()} students
                    </Typography>
                    <AccessTimeIcon sx={{ fontSize: 16, ml: 2, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {course.hours} hours
                    </Typography>
                  </Box>
                  
                  {course.progress > 0 && (
                    <ProgressWrapper>
                      <LinearProgress 
                        variant="determinate" 
                        value={course.progress} 
                        color="primary"
                        sx={{ flexGrow: 1, mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {course.progress}%
                      </Typography>
                    </ProgressWrapper>
                  )}
                  
                  <EnrollButton 
                    variant="contained" 
                    color="primary"
                    className="enroll-button"
                    aria-label={course.progress > 0 ? `Continue ${course.title} course` : `Enroll in ${course.title} course`}
                    sx={{ mt: 2 }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    {course.progress > 0 ? 'Continue' : 'Enroll Now'}
                  </EnrollButton>
                </CardContent>
              </CourseCard>
            </AnimatedBox>
          ))}
        </Box>

        {/* Call to action */}
        <AnimatedBox delay={0.9}>
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 8,
              p: { xs: 3, md: 6 },
              borderRadius: theme.shape.borderRadius * 2,
              background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
              color: 'white',
              gap: 4
            }}
          >
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Ready to advance your career?
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Join thousands of professionals who are upgrading their skills with VerTechie.
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                borderRadius: '50px',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Browse All Courses
            </Button>
          </Box>
        </AnimatedBox>
      </Container>
    </LearningSection>
  );
};

export default LearningPlatform; 