import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Rating,
  Avatar,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery,
  SelectChangeEvent,
  Paper,
  Alert
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import QuizIcon from '@mui/icons-material/Quiz';
import CodeIcon from '@mui/icons-material/Code';
import TimelineIcon from '@mui/icons-material/Timeline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockIcon from '@mui/icons-material/Lock';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { resolveAssetPath, resolveImagePath } from '../utils/assetResolver';
import SecurityIcon from '@mui/icons-material/Security';
import DataObjectIcon from '@mui/icons-material/DataObject';
import CloudIcon from '@mui/icons-material/Cloud';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import FeatureModal from '../components/courses/FeatureModal';
import type { Theme } from '@mui/material/styles';
import type { GridProps } from '@mui/material/Grid';
import { Grid as MuiGrid } from '@mui/material';
import { ElementType } from 'react';
import type { SxProps } from '@mui/system';

// Animation keyframes
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

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 119, 181, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(0, 119, 181, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 119, 181, 0); }
`;

// Styled components
const PageSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  position: 'relative',
  overflow: 'hidden',
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976D2 0%, #21CBF3 100%)',
  padding: theme.spacing(15, 0),
  color: 'white',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
    opacity: 0.5,
  }
}));

const PatternBackground = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 2px, transparent 2px)',
  backgroundSize: '30px 30px',
  zIndex: 0,
  opacity: 0.5,
});

const CircleDecoration = styled(Box)({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.05)',
  zIndex: 0,
});

interface AnimatedBoxProps {
  delay?: number;
  children: React.ReactNode;
}

const AnimatedBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'delay',
})<AnimatedBoxProps>(({ delay = 0 }) => ({
  animation: `${fadeIn} 1s ease forwards ${delay}s`,
  opacity: 0,
  position: 'relative',
  zIndex: 1,
}));

const FloatingImage = styled(Box)({
  animation: `${float} 6s ease-in-out infinite`,
  position: 'relative',
  zIndex: 1,
});

const CourseCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
  },
}));

const CategoryChip = styled(Chip)({
  borderRadius: '50px',
  fontWeight: 600,
  fontSize: '0.75rem',
});

const CourseInfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  marginRight: theme.spacing(2),
  '& svg': {
    fontSize: '1rem',
    marginRight: theme.spacing(0.5),
  },
  '& span': {
    fontSize: '0.875rem',
  },
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '50px',
    backgroundColor: 'white',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.15)',
    }
  }
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    color: '#0077B5',
    fontSize: 40,
    marginRight: theme.spacing(2),
  }
}));

const PulsatingIconBox = styled(Box)({
  width: 60,
  height: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 119, 181, 0.1)',
  marginRight: 16,
  animation: `${pulse} 2s infinite`,
});

// BoxGrid components
const BoxGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: theme.spacing(-1.5),
  width: 'calc(100% + 24px)'
}));

interface BoxGridItemProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

const BoxGridItem = styled(Box, {
  shouldForwardProp: (prop) => !['xs', 'sm', 'md', 'lg'].includes(prop as string),
})<BoxGridItemProps>(({ xs = 12, sm, md, lg, theme }) => {
  const getWidth = (cols: number) => `${(cols / 12) * 100}%`;
  
  return {
    padding: theme.spacing(1.5),
    boxSizing: 'border-box',
    width: '100%',
    
    [theme.breakpoints.up('xs')]: {
      width: getWidth(xs),
    },
    ...(sm && {
      [theme.breakpoints.up('sm')]: {
        width: getWidth(sm),
      },
    }),
    ...(md && {
      [theme.breakpoints.up('md')]: {
        width: getWidth(md),
      },
    }),
    ...(lg && {
      [theme.breakpoints.up('lg')]: {
        width: getWidth(lg),
      },
    }),
  };
});

// Course data
const courses = [
  {
    id: 1,
    title: 'React Basics',
    instructor: 'John Doe',
    description: '10 video lessons, 5 projects, 3 quizzes. Build a portfolio app.',
    category: 'Web Development',
    image: '/images/courses/react.svg',
    rating: 4.9,
    reviews: 1200,
    students: 2500,
    hours: 10,
    price: 'Free',
    level: 'Beginner',
  },
  {
    id: 2,
    title: 'Cybersecurity 101',
    instructor: 'Lisa Chen',
    description: '12 video lessons, 4 challenges, 2 quizzes.',
    category: 'Security',
    image: '/images/courses/security.svg',
    rating: 4.8,
    reviews: 900,
    students: 1800,
    hours: 12,
    price: '$49',
    level: 'Beginner',
  },
  {
    id: 3,
    title: 'Data Engineering',
    instructor: 'Mark Lee',
    description: '15 video lessons, 6 projects, 3 quizzes.',
    category: 'Data',
    image: '/images/courses/data.svg',
    rating: 4.7,
    reviews: 600,
    students: 1200,
    hours: 15,
    price: '$79',
    level: 'Intermediate',
  },
  {
    id: 4,
    title: 'Advanced JavaScript',
    instructor: 'Sarah Johnson',
    description: '8 video lessons, 10 challenges, 2 quizzes.',
    category: 'Web Development',
    image: '/images/courses/javascript.svg',
    rating: 4.9,
    reviews: 1500,
    students: 3000,
    hours: 8,
    price: '$29',
    level: 'Advanced',
  },
  {
    id: 5,
    title: 'Cloud Migration',
    instructor: 'David Kim',
    description: '10 video lessons, 4 case studies, 2 quizzes.',
    category: 'Cloud',
    image: '/images/courses/cloud.svg',
    rating: 4.6,
    reviews: 400,
    students: 800,
    hours: 10,
    price: '$59',
    level: 'Intermediate',
  },
  {
    id: 6,
    title: 'Python for Beginners',
    instructor: 'Priya Sharma',
    description: '6 video lessons, 3 projects, 2 quizzes.',
    category: 'Programming',
    image: '/images/courses/python.svg',
    rating: 4.8,
    reviews: 700,
    students: 1500,
    hours: 6,
    price: 'Free',
    level: 'Beginner',
  },
];

// Learning features
const learningFeatures = [
  {
    icon: <VideoLibraryIcon />,
    title: 'Expert-Led Videos',
    description: 'Learn from industry professionals with practical insights and examples.',
  },
  {
    icon: <QuizIcon />,
    title: 'Interactive Quizzes',
    description: 'Test your knowledge throughout the course to reinforce learning.',
  },
  {
    icon: <CodeIcon />,
    title: 'Coding Challenges',
    description: 'Solve real-world problems with LeetCode-style coding exercises.',
  },
  {
    icon: <TimelineIcon />,
    title: 'Progress Tracking',
    description: 'Monitor your learning with git-like progress bars and completion metrics.',
  },
  {
    icon: <VerifiedUserIcon />,
    title: 'Verified Certificates',
    description: 'Earn industry-recognized certificates to showcase your skills.',
  },
];

// Creator steps
const creatorSteps = [
  {
    title: 'Submit Proposal',
    description: 'Share your expertise and course outline for review.',
  },
  {
    title: 'Verification',
    description: 'Get verified as an expert in your field.',
  },
  {
    title: 'Build Course',
    description: 'Create engaging videos, quizzes, and challenges.',
  },
  {
    title: 'Publish & Engage',
    description: 'Launch your course and interact with learners.',
  },
];

// CourseSpecialization interface
interface CourseSpecialization {
  id: string;
  title: string;
  description: string;
  image: string;
  courses: number;
  skills: string[];
}

// Sample course specializations data
const courseSpecializations: CourseSpecialization[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Master modern web development with courses on frontend, backend, and full-stack technologies.',
    image: '/images/courses/web-development.svg',
    courses: 24,
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'API Development']
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Learn to protect digital systems and networks from cyber threats with industry-standard practices.',
    image: '/images/courses/security.svg',
    courses: 18,
    skills: ['Network Security', 'Penetration Testing', 'Secure Coding', 'Threat Analysis']
  },
  {
    id: 'data-science',
    title: 'Data Science & Analytics',
    description: 'Gain expertise in data analysis, machine learning, and AI to extract valuable insights from data.',
    image: '/images/courses/data.svg',
    courses: 15,
    skills: ['Python', 'SQL', 'Machine Learning', 'Data Visualization', 'Statistical Analysis']
  },
  {
    id: 'cloud-computing',
    title: 'Cloud Computing',
    description: 'Build and deploy scalable applications on major cloud platforms with best practices.',
    image: '/images/courses/cloud.svg',
    courses: 12,
    skills: ['AWS', 'Azure', 'GCP', 'Cloud Architecture', 'Containerization']
  },
  {
    id: 'mobile-development',
    title: 'Mobile Development',
    description: 'Create cross-platform and native mobile applications for iOS and Android platforms.',
    image: '/images/courses/mobile.svg',
    courses: 10,
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile UX/UI']
  },
  {
    id: 'devops',
    title: 'DevOps & SRE',
    description: 'Learn to streamline software delivery with continuous integration and deployment.',
    image: '/images/courses/devops.svg',
    courses: 9,
    skills: ['CI/CD', 'Infrastructure as Code', 'Kubernetes', 'Docker', 'Monitoring']
  }
];

// Reusable components
const CategoryCard = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[2],
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

// Data
const categories = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Learn to build modern web applications',
  },
  {
    id: 'mobile-development',
    title: 'Mobile Development',
    description: 'Create cross-platform mobile apps',
  },
  {
    id: 'data-science',
    title: 'Data Science',
    description: 'Master data analysis and machine learning',
  },
  {
    id: 'cloud-computing',
    title: 'Cloud Computing',
    description: 'Learn cloud platforms and services',
  },
];

const featuredCourses = [
  {
    title: 'Full Stack Web Development',
    description: 'Learn to build modern web applications from frontend to backend.',
    image: '/images/courses/web-dev.jpg',
    level: 'Beginner',
    duration: '12 weeks',
    price: '$199',
  },
  {
    title: 'Mobile App Development',
    description: 'Create cross-platform mobile apps with React Native.',
    image: '/images/courses/mobile-dev.jpg',
    level: 'Intermediate',
    duration: '8 weeks',
    price: '$149',
  },
  {
    title: 'Cloud Computing Fundamentals',
    description: 'Master the basics of cloud platforms and services.',
    image: '/images/courses/cloud.jpg',
    level: 'Beginner',
    duration: '6 weeks',
    price: '$99',
  },
];

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

type FeatureId = 'freeEducation' | 'projectBased' | 'verifiedTutors' | 'communityLearning';

interface Feature {
  id: FeatureId;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    id: 'freeEducation',
    title: 'Free Education',
    description: 'Access to quality tech education without barriers',
    icon: <SchoolIcon sx={{ fontSize: 40 }} />
  },
  {
    id: 'projectBased',
    title: 'Project-Based Learning',
    description: 'Learn by building real projects. Get hands-on experience with practical applications.',
    icon: <CodeIcon sx={{ fontSize: 40 }} />
  },
  {
    id: 'verifiedTutors',
    title: 'Verified Tutors',
    description: 'Learn from industry experts and verified professionals who know their craft.',
    icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />
  },
  {
    id: 'communityLearning',
    title: 'Community Learning',
    description: 'Join a community of learners. Share knowledge and grow together.',
    icon: <GroupIcon sx={{ fontSize: 40 }} />
  },
];

const Courses = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState<FeatureId | null>(null);

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(45deg, #fff 30%, #e0e0e0 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Learn. Build. Level Up with VerTechie Courses
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4,
                opacity: 0.9,
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              Whether you're a beginner, job seeker, or seasoned developer — VerTechie Courses are built to get you hired, promoted, or startup-ready.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/signup')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              Explore Courses
            </Button>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg">
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: 2,
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Learn Real Skills
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          sx={{ mb: 8 }}
        >
          Master the latest technologies with our comprehensive courses
        </Typography>

        <BoxGrid sx={{ mb: 8 }}>
          {features.map((feature) => (
            <BoxGridItem
              key={feature.id}
              xs={12}
              sm={6}
              md={3}
              sx={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <FeatureCard 
                onClick={() => setSelectedFeature(feature.id)}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  flex: 1
                }}
              >
                {feature.icon}
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </BoxGridItem>
          ))}
        </BoxGrid>

        <Box 
          sx={{ 
            py: 8,
            textAlign: 'center',
            bgcolor: 'background.default',
            borderRadius: 2,
            px: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to start your learning journey?
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Join VerTechie and unlock real, verified learning built for the real world.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
            >
              Sign Up Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/signup?role=tutor')}
              sx={{
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              }}
            >
              Become a Tutor
            </Button>
          </Box>
        </Box>
      </Container>

      <FeatureModal
        open={selectedFeature !== null}
        onClose={() => setSelectedFeature(null)}
        feature={selectedFeature || 'freeEducation'}
      />
    </Box>
  );
};

export default Courses; 