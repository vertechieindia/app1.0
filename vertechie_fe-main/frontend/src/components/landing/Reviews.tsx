import React, { useState, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid as MuiGrid, 
  Rating, 
  Avatar, 
  Card, 
  Chip, 
  Button, 
  useTheme,
  IconButton,
  MobileStepper,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

// Note: Since we can't import the actual SwipeableViews module due to dependency issues,
// we'll implement a simpler version with CSS transitions

const ReviewsSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
  padding: theme.spacing(10, 0),
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
    opacity: 0.2,
    pointerEvents: 'none',
  }
}));

const ReviewCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'white',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  height: '100%',
  minHeight: 350,
  transition: 'transform 0.3s, box-shadow 0.3s',
  position: 'relative',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)'
  }
}));

const QuoteIcon = styled(FormatQuoteIcon)(({ theme }) => ({
  position: 'absolute',
  top: 20,
  right: 20,
  color: 'rgba(25, 118, 210, 0.1)',
  fontSize: 40,
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: -12,
  left: 20,
  fontWeight: 600,
}));

const StatsCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'white',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  padding: theme.spacing(2, 0, 4),
}));

const SliderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  marginBottom: theme.spacing(4),
  transition: 'transform 0.5s cubic-bezier(0.15, 0.3, 0.25, 1)',
}));

const SlideItem = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  width: '100%',
  maxWidth: 500,
  padding: theme.spacing(0, 2),
  margin: '0 auto',
  [theme.breakpoints.up('md')]: {
    maxWidth: 600,
  },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
  backgroundColor: 'white',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: 'white',
  },
  transition: 'all 0.3s ease',
}));

const PaginationDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active'
})<{ active?: boolean }>(({ theme, active }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  margin: '0 4px',
  backgroundColor: active ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.2)',
  },
}));

// Sample review data
const userReviews = [
  {
    id: 1,
    name: "David Chen",
    role: "Senior Software Engineer",
    company: "TechGlobal Inc.",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    testimonial: "VerTechie's platform has been instrumental in my career growth. The AI job matching is incredibly accurate, and I found my dream role within two weeks of signing up!",
    date: "June 12, 2023",
    category: "professional",
    verified: true
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "HR Director",
    company: "Innovate Solutions",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    testimonial: "As a hiring manager, I've never had such a seamless recruitment experience. The quality of candidates we get through VerTechie is exceptional, saving us time and resources.",
    date: "August 3, 2023",
    category: "company",
    verified: true
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Data Scientist",
    company: "Analytics Pro",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 4,
    testimonial: "The professional development courses are top-notch. I gained valuable ML skills that immediately translated to a 25% salary increase. Highly recommend!",
    date: "July 19, 2023",
    category: "professional",
    verified: true
  },
  {
    id: 4,
    name: "Emma Wilson",
    role: "CTO",
    company: "StartUp Nexus",
    avatar: "https://i.pravatar.cc/150?img=9",
    rating: 5,
    testimonial: "Our tech team hiring challenges disappeared when we partnered with VerTechie. Their technical assessment tools and verified talent pool are game-changers for growing companies.",
    date: "September 5, 2023",
    category: "company",
    verified: true
  },
  {
    id: 5,
    name: "James Taylor",
    role: "Frontend Developer",
    company: "WebCreative",
    avatar: "https://i.pravatar.cc/150?img=15",
    rating: 4,
    testimonial: "The networking features connected me with mentors who helped me transition into UI/UX design. The community is supportive and the resources are unmatched.",
    date: "October 10, 2023",
    category: "professional",
    verified: true
  },
  {
    id: 6,
    name: "Rebecca Martinez",
    role: "Talent Acquisition Lead",
    company: "EnterpriseNow",
    avatar: "https://i.pravatar.cc/150?img=25",
    rating: 5,
    testimonial: "We've reduced our hiring costs by 40% while improving candidate quality. The platform's analytics help us understand our talent pipeline in ways we never could before.",
    date: "November 15, 2023",
    category: "company",
    verified: true
  }
];

// Platform statistics
const statistics = [
  { value: "4.8", label: "Average Rating", icon: <StarIcon color="primary" sx={{ fontSize: 40 }} /> },
  { value: "98%", label: "Satisfaction Rate", icon: <VerifiedUserIcon color="success" sx={{ fontSize: 40 }} /> },
  { value: "10K+", label: "Active Professionals", icon: <SchoolIcon color="secondary" sx={{ fontSize: 40 }} /> },
  { value: "2.5K+", label: "Partner Companies", icon: <BusinessIcon color="primary" sx={{ fontSize: 40 }} /> }
];

const Reviews = () => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const maxSteps = userReviews.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => 
      prevActiveStep === maxSteps - 1 ? 0 : prevActiveStep + 1
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => 
      prevActiveStep === 0 ? maxSteps - 1 : prevActiveStep - 1
    );
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <ReviewsSection>
      <Container 
        maxWidth={false}
        sx={{ 
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, md: 6, lg: 8 } 
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Success Stories
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ maxWidth: 700, mx: 'auto', color: 'text.secondary' }}
          >
            See what professionals and companies are saying about their experience with VerTechie
          </Typography>
        </Box>

        {/* Platform Statistics */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 3,
            mb: 8
          }}
        >
          {statistics.map((stat, index) => (
            <StatsCard key={index}>
              <Box sx={{ mb: 2 }}>
                {stat.icon}
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {stat.label}
              </Typography>
            </StatsCard>
          ))}
        </Box>

        {/* Reviews Carousel */}
        <CarouselContainer>
          {/* Navigation Buttons */}
          {!isMobile && (
            <>
              <NavigationButton 
                sx={{ left: { xs: -5, md: -20 } }} 
                onClick={handleBack}
                aria-label="previous review"
              >
                <NavigateBeforeIcon />
              </NavigationButton>
              <NavigationButton 
                sx={{ right: { xs: -5, md: -20 } }} 
                onClick={handleNext}
                aria-label="next review"
              >
                <NavigateNextIcon />
              </NavigationButton>
            </>
          )}

          {/* Slider */}
          <SliderWrapper 
            ref={sliderRef}
            sx={{ transform: `translateX(-${activeStep * 100}%)` }}
          >
            {userReviews.map((review) => (
              <SlideItem key={review.id}>
                <ReviewCard>
                  <CategoryChip 
                    label={review.category === 'professional' ? 'Professional' : 'Company'} 
                    color={review.category === 'professional' ? 'primary' : 'secondary'}
                    icon={review.category === 'professional' ? <SchoolIcon /> : <BusinessIcon />}
                  />
                  <QuoteIcon />
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      src={review.avatar} 
                      sx={{ 
                        width: 64, 
                        height: 64, 
                        mr: 2,
                        border: '3px solid white',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                          {review.name}
                        </Typography>
                        {review.verified && (
                          <VerifiedUserIcon 
                            sx={{ 
                              fontSize: 18, 
                              ml: 1, 
                              color: theme.palette.success.main 
                            }} 
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {review.role} at {review.company}
                      </Typography>
                      <Rating 
                        value={review.rating} 
                        readOnly 
                        size="small" 
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body1" paragraph sx={{ mb: 3, fontStyle: 'italic' }}>
                    "{review.testimonial}"
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right' }}>
                    Posted on {review.date}
                  </Typography>
                </ReviewCard>
              </SlideItem>
            ))}
          </SliderWrapper>

          {/* Dots Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            {userReviews.map((_, index) => (
              <PaginationDot 
                key={index} 
                active={index === activeStep}
                onClick={() => handleStepChange(index)}
              />
            ))}
          </Box>

          {/* Mobile Stepper */}
          {isMobile && (
            <MobileStepper
              variant="dots"
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              sx={{
                maxWidth: 400,
                flexGrow: 1,
                mx: 'auto',
                mt: 2,
                background: 'transparent',
              }}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNext}
                >
                  Next
                  {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </Button>
              }
              backButton={
                <Button 
                  size="small" 
                  onClick={handleBack} 
                >
                  {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  Back
                </Button>
              }
            />
          )}
        </CarouselContainer>

        {/* Call to Action */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: 8, 
            p: { xs: 4, md: 5 }, 
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
              opacity: 0.1,
              pointerEvents: 'none',
            }
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, position: 'relative' }}>
            Join our community of success
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 800, mx: 'auto', position: 'relative' }}>
            Whether you're looking to advance your career or build your dream team, 
            our platform connects talent and opportunity like never before.
          </Typography>
          <Box sx={{ position: 'relative' }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              sx={{ 
                mx: 1,
                px: 4, 
                py: 1.2, 
                borderRadius: '50px',
                fontWeight: 600,
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
                bgcolor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.18)',
                }
              }}
            >
              Create Free Account
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                mx: 1,
                px: 4, 
                py: 1.1, 
                borderRadius: '50px',
                fontWeight: 600,
                borderColor: 'white',
                color: 'white',
                borderWidth: 2,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: 2,
                }
              }}
            >
              Read More Success Stories
            </Button>
          </Box>
        </Box>
      </Container>
    </ReviewsSection>
  );
};

export default Reviews; 