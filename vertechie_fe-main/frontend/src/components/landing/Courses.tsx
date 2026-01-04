import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, CardMedia, Chip, Rating } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';
import VerifiedIcon from '@mui/icons-material/Verified';

// Animations
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

// Styled components
const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  background: 'linear-gradient(135deg, #f0f7ff 0%, #e1f5fe 100%)',
  position: 'relative',
  overflow: 'hidden',
}));

const PatternBackground = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: 'radial-gradient(rgba(25, 118, 210, 0.1) 2px, transparent 2px)',
  backgroundSize: '30px 30px',
  zIndex: 0,
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
  '& svg': {
    fontSize: '1rem',
    marginRight: theme.spacing(0.5),
  },
  '& span': {
    fontSize: '0.875rem',
  },
}));

// GridContainer and GridItem components to replace MUI Grid
const GridContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  margin: '-16px', // To counteract the padding of GridItem
});

interface GridItemProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  children: React.ReactNode;
}

const GridItem = styled(Box, {
  shouldForwardProp: (prop) => !['xs', 'sm', 'md', 'lg'].includes(prop as string),
})<GridItemProps>(({ sm, md, lg, theme }) => {
  const getWidth = (cols: number) => `${(cols / 12) * 100}%`;
  
  return {
    padding: '16px',
    flexGrow: 0,
    maxWidth: '100%',
    flexBasis: '100%',
    width: '100%',
    
    [theme.breakpoints.up('sm')]: {
      ...(sm && {
        maxWidth: getWidth(sm),
        flexBasis: getWidth(sm),
      }),
    },
    [theme.breakpoints.up('md')]: {
      ...(md && {
        maxWidth: getWidth(md),
        flexBasis: getWidth(md),
      }),
    },
    [theme.breakpoints.up('lg')]: {
      ...(lg && {
        maxWidth: getWidth(lg),
        flexBasis: getWidth(lg),
      }),
    },
  };
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
  zIndex: 2,
}));

const FloatingGraphic = styled(Box)({
  animation: `${float} 6s ease-in-out infinite`,
  position: 'relative',
  zIndex: 2,
});

// Featured courses data
const featuredCourses = [
  {
    id: 1,
    title: "Full Stack Web Development Bootcamp",
    description: "Build modern web applications with React, Node.js, and MongoDB in this comprehensive bootcamp.",
    image: "/images/wave-pattern.svg",
    category: "Web Development",
    level: "Intermediate",
    duration: "12 weeks",
    rating: 4.8,
    reviews: 328,
    verified: true
  },
  {
    id: 2,
    title: "Cloud Security Fundamentals",
    description: "Learn to secure cloud infrastructure and applications on AWS, Azure, and Google Cloud Platform.",
    image: "/images/blob-pattern.svg",
    category: "Cybersecurity",
    level: "Beginner",
    duration: "8 weeks",
    rating: 4.7,
    reviews: 215,
    verified: true
  },
  {
    id: 3,
    title: "Data Science & Machine Learning",
    description: "Master data analysis, visualization, and machine learning algorithms with Python and TensorFlow.",
    image: "/images/circuit-pattern.svg",
    category: "Data Science",
    level: "Advanced",
    duration: "16 weeks",
    rating: 4.9,
    reviews: 412,
    verified: true
  }
];

const Courses = () => {
  return (
    <SectionContainer>
      <PatternBackground />
      
      <Container>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          mb: 8
        }}>
          <AnimatedBox delay={0.1} sx={{ flex: { md: 1 }, mb: { xs: 5, md: 0 } }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: '#0A1929',
                maxWidth: { md: '90%' }
              }}
            >
              Level Up Your Tech Skills with Verified Courses
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary',
                mb: 4,
                maxWidth: { md: '80%' },
                fontWeight: 400,
              }}
            >
              Access expert-led courses designed for tech professionals at every career stage
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                px: 4, 
                py: 1.5, 
                borderRadius: '50px',
                fontWeight: 600,
                boxShadow: '0 8px 20px rgba(25, 118, 210, 0.2)',
                '&:hover': {
                  boxShadow: '0 12px 25px rgba(25, 118, 210, 0.3)',
                }
              }}
              aria-label="Explore all courses"
            >
              Explore All Courses
            </Button>
          </AnimatedBox>
          
          <AnimatedBox delay={0.3} sx={{ flex: { md: 1 }, display: { xs: 'none', md: 'block' }, textAlign: 'center' }}>
            <FloatingGraphic>
              <Box 
                component="img"
                src="/images/course-illustration.svg"
                alt=""
                sx={{ 
                  width: '100%',
                  maxWidth: '400px',
                }}
              />
            </FloatingGraphic>
          </AnimatedBox>
        </Box>
        
        <GridContainer>
          {featuredCourses.map((course, index) => (
            <GridItem key={course.id} xs={12} md={4}>
              <AnimatedBox delay={0.2 + (index * 0.1)}>
                <CourseCard elevation={2}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={course.image}
                    alt={course.title}
                  />
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <CategoryChip 
                        label={course.category} 
                        size="small"
                        color="primary"
                        sx={{ 
                          bgcolor: 'rgba(25, 118, 210, 0.1)',
                          color: 'primary.main',
                        }}
                      />
                      {course.verified && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <VerifiedIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="caption" fontWeight={600}>
                            Verified
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 1.5,
                        lineHeight: 1.3,
                        height: '3.9em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {course.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        height: '4.5em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {course.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <CourseInfoItem>
                        <BarChartIcon />
                        <span>{course.level}</span>
                      </CourseInfoItem>
                      <CourseInfoItem>
                        <AccessTimeIcon />
                        <span>{course.duration}</span>
                      </CourseInfoItem>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={course.rating} precision={0.1} size="small" readOnly sx={{ mr: 1 }} />
                        <Typography variant="body2" fontWeight={500}>
                          {course.rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                          ({course.reviews})
                        </Typography>
                      </Box>
                      <Button 
                        color="primary" 
                        size="small" 
                        sx={{ fontWeight: 600 }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </CourseCard>
              </AnimatedBox>
            </GridItem>
          ))}
        </GridContainer>
      </Container>
    </SectionContainer>
  );
};

export default Courses; 