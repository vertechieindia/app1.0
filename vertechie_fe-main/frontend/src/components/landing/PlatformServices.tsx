import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Tabs, 
  Tab, 
  Chip, 
  Divider, 
  useTheme, 
  Grid as MuiGrid,
  Collapse,
  Zoom,
  Fade,
  IconButton,
  Tooltip,
  Badge,
  useMediaQuery,
  Paper,
  MobileStepper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CodeIcon from '@mui/icons-material/Code';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ForumIcon from '@mui/icons-material/Forum';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import TouchAppIcon from '@mui/icons-material/TouchApp';

const ServicesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
  width: '100vw',
  marginLeft: 'calc(-50vw + 50%)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
    opacity: 0.3,
    pointerEvents: 'none',
  }
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(3),
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  overflow: 'hidden',
  border: 'none',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
  },
}));

const CardHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 3, 2),
  display: 'flex',
  alignItems: 'center',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  position: 'relative',
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: '14px',
  marginRight: theme.spacing(2),
  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.2) 0%, rgba(25, 118, 210, 0.05) 100%)',
  color: theme.palette.primary.main,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)',
    boxShadow: '0 5px 15px rgba(25, 118, 210, 0.2)',
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1.1rem',
  textTransform: 'none',
  padding: theme.spacing(1.5, 3),
  color: theme.palette.text.secondary,
  transition: 'all 0.3s ease',
  minWidth: 140,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  }
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  fontWeight: 500,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '&.MuiChip-colorPrimary': {
    background: 'rgba(25, 118, 210, 0.08)',
    color: theme.palette.primary.main,
  },
  '&.MuiChip-colorSecondary': {
    background: 'rgba(156, 39, 176, 0.08)',
    color: theme.palette.secondary.main,
  },
  '&.MuiChip-colorSuccess': {
    background: 'rgba(76, 175, 80, 0.08)',
    color: theme.palette.success.main,
  },
}));

const ExpandButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: -18,
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'white',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  zIndex: 10,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
  }
}));

const NewBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    background: 'linear-gradient(45deg, #ff6b6b 30%, #ff8e8e 90%)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
}));

const FeatureList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& > div': {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  '& svg': {
    color: theme.palette.success.main,
    marginRight: theme.spacing(1),
    fontSize: '1.2rem',
  }
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  padding: theme.spacing(2, 0),
}));

const SlideContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  marginBottom: theme.spacing(4),
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  width: 50,
  height: 50,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  transition: 'all 0.3s ease',
}));

const PaginationDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active'
})<{ active?: boolean }>(({ theme, active }) => ({
  width: active ? 20 : 8,
  height: 8,
  borderRadius: 8,
  margin: '0 4px',
  backgroundColor: active ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
}));

const SlideWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 360,
  margin: '0 auto',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450,
  },
}));

const EnhancedSliderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  position: 'relative',
  transition: 'transform 0.5s cubic-bezier(0.15, 0.3, 0.25, 1)',
  [theme.breakpoints.down('sm')]: {
    transition: 'transform 0.3s ease',
  },
}));

const SlideItem = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  width: '100%',
  height: '100%',
  padding: theme.spacing(0),
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'center',
}));

const TouchHint = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 15,
  right: 15,
  zIndex: 5,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  background: 'rgba(0, 0, 0, 0.05)',
  color: theme.palette.text.secondary,
  fontSize: 12,
  opacity: 0.8,
  transition: 'opacity 0.3s ease',
  '& svg': {
    fontSize: 16,
    marginRight: theme.spacing(0.5),
  },
}));

const FullscreenBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
  zIndex: -1,
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`platform-tabpanel-${index}`}
      aria-labelledby={`platform-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 4 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const professionalServices = [
  {
    icon: <WorkIcon fontSize="large" />,
    title: "AI-Powered Job Matching",
    description: "Our advanced algorithm analyzes your skills, experience, and career preferences to connect you with perfect-fit opportunities from our vast network of hiring companies.",
    skills: ["Resume Analysis", "Skill Mapping", "Smart Alerts"],
    features: [
      "70% higher match accuracy compared to traditional job boards",
      "Personalized opportunity recommendations based on career goals",
      "Real-time alerts for new matching positions"
    ],
    color: "primary",
    isNew: false,
    popularity: 98
  },
  {
    icon: <SchoolIcon fontSize="large" />,
    title: "Professional Development",
    description: "Access industry-certified courses, live workshops, and bootcamps tailored to your career path and curated by top experts to keep your skills cutting-edge.",
    skills: ["Personalized Learning", "Skill Certifications", "Mentor Connection"],
    features: [
      "Over 1,000 courses from leading industry experts",
      "Personalized learning paths based on career goals",
      "Earn recognized certifications to boost your profile"
    ],
    color: "secondary",
    isNew: true,
    popularity: 92
  },
  {
    icon: <PeopleIcon fontSize="large" />,
    title: "Career Networking",
    description: "Build meaningful professional connections with industry leaders, mentors and peers to expand your opportunities through our intelligent networking platform.",
    skills: ["Industry Groups", "Virtual Events", "Mentor Matching"],
    features: [
      "Connect with professionals in your industry or desired field",
      "AI-powered mentor matching based on career goals", 
      "Exclusive industry events and networking opportunities"
    ],
    color: "success",
    isNew: false,
    popularity: 87
  },
  {
    icon: <TrendingUpIcon fontSize="large" />,
    title: "Career Growth Analytics",
    description: "Track your professional growth with personalized analytics and insights. Compare your progress with industry benchmarks and identify high-demand skills.",
    skills: ["Skill Gap Analysis", "Growth Tracking", "Market Trends"],
    features: [
      "Visual dashboard showing your skills compared to industry benchmarks",
      "Personalized recommendations for skill development",
      "Track your progress and growth over time with detailed metrics"
    ],
    color: "primary",
    isNew: true,
    popularity: 85
  },
  {
    icon: <ForumIcon fontSize="large" />,
    title: "Career Community",
    description: "Join specialized communities in your field to share knowledge, ask questions, and participate in discussions with peers who understand your professional journey.",
    skills: ["Expert Advice", "Peer Discussions", "Industry News"],
    features: [
      "Access to moderated forums with industry experts",
      "Private messaging with community members",
      "Weekly digests of trending topics and valuable insights"
    ],
    color: "secondary",
    isNew: false,
    popularity: 82
  },
  {
    icon: <VerifiedUserIcon fontSize="large" />,
    title: "Verified Professional Profile",
    description: "Showcase your verified skills, experience, and achievements on our trusted platform to stand out to potential employers and project clients.",
    skills: ["Skill Verification", "Portfolio Builder", "Trust Score"],
    features: [
      "Verification badges that increase visibility to employers", 
      "Interactive portfolio to showcase your work and achievements",
      "Trust score based on verified credentials and peer recommendations"
    ],
    color: "success",
    isNew: false,
    popularity: 94
  }
];

const companyServices = [
  {
    icon: <SearchIcon fontSize="large" />,
    title: "Talent Discovery",
    description: "Access our pool of pre-vetted professionals using advanced filters to find candidates with the exact skills, experience, and cultural fit your organization needs.",
    skills: ["AI-Matching", "Team Compatibility", "Skill Verification"],
    features: [
      "Advanced search filters to find the perfect candidate match", 
      "Pre-verified skills and experience to streamline hiring",
      "Cultural fit assessment for better team integration"
    ],
    color: "primary",
    isNew: false,
    popularity: 96
  },
  {
    icon: <AssessmentIcon fontSize="large" />,
    title: "Comprehensive Assessment",
    description: "Evaluate potential hires with our customizable technical and soft skill assessments, reducing hiring time and ensuring candidate qualification.",
    skills: ["Custom Assessments", "Benchmarking", "Video Interviews"],
    features: [
      "Customizable assessment templates for different roles",
      "Automated scoring and comparative benchmarking",
      "Integrated video interview platform with AI insights"
    ],
    color: "secondary",
    isNew: true,
    popularity: 90
  },
  {
    icon: <CorporateFareIcon fontSize="large" />,
    title: "Workforce Development",
    description: "Upskill your existing team with customized training programs that address specific skill gaps and align with your organization's strategic objectives.",
    skills: ["Learning Paths", "Progress Tracking", "Team Analytics"],
    features: [
      "Custom learning paths aligned with business objectives",
      "Real-time progress tracking and skill development analytics",
      "Team performance insights and improvement recommendations"
    ],
    color: "success",
    isNew: false,
    popularity: 89
  },
  {
    icon: <EventNoteIcon fontSize="large" />,
    title: "Recruitment Events",
    description: "Host virtual or hybrid career events, tech talks, and networking sessions to connect with qualified candidates and build your employer brand.",
    skills: ["Event Management", "Candidate Tracking", "Follow-up Tools"],
    features: [
      "All-in-one platform for planning and hosting recruitment events",
      "Automated candidate tracking and engagement metrics",
      "Smart follow-up tools to nurture promising connections"
    ],
    color: "primary",
    isNew: true,
    popularity: 83
  },
  {
    icon: <CodeIcon fontSize="large" />,
    title: "Technical Team Building",
    description: "Build specialized technical teams with our curated talent pools in software development, data science, cybersecurity, and other high-demand areas.",
    skills: ["Tech Vetting", "Team Compatibility", "Project Matching"],
    features: [
      "Access to pre-vetted technical talent with verified skills",
      "Team composition analysis for optimal skill distribution",
      "Project-based matching for specialized technical needs"
    ],
    color: "secondary",
    isNew: false,
    popularity: 87
  },
  {
    icon: <AccountBalanceIcon fontSize="large" />,
    title: "Enterprise Solutions",
    description: "Custom recruitment and talent management solutions for large organizations, including ATS integration, employer branding, and retention strategies.",
    skills: ["White-labeling", "API Access", "Dedicated Support"],
    features: [
      "Custom branding and integration with existing HR systems",
      "Advanced API access for seamless workflow integration",
      "Dedicated account manager and premium support"
    ],
    color: "success",
    isNew: false,
    popularity: 94
  }
];

const PlatformServices = () => {
  const [tabValue, setTabValue] = useState(0);
  const [expandedCards, setExpandedCards] = useState<{[key: number]: boolean}>({});
  const [savedServices, setSavedServices] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [showTouchHint, setShowTouchHint] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const currentServices = tabValue === 0 ? professionalServices : companyServices;
  const maxSteps = currentServices.length;

  useEffect(() => {
    if (showTouchHint && isMobile) {
      const timer = setTimeout(() => {
        setShowTouchHint(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showTouchHint, isMobile]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setActiveStep(0);
    setExpandedCards({});
  };

  const handleNext = () => {
    if (activeStep < maxSteps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setActiveStep(0);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    } else {
      setActiveStep(maxSteps - 1);
    }
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const toggleExpand = (index: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleSaved = (index: number) => {
    if (savedServices.includes(index)) {
      setSavedServices(savedServices.filter(i => i !== index));
    } else {
      setSavedServices([...savedServices, index]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    if ('touches' in e) {
      setStartX(e.touches[0].clientX);
    } else {
      setStartX(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = startX - currentX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handleBack();
      }
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <ServicesSection>
      <FullscreenBackground />
      <Container 
        maxWidth={false}
        disableGutters
        sx={{ 
          width: '100%', 
          maxWidth: '100%',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Typography
          variant="h2"
          component="h2"
          align="center"
          gutterBottom
          sx={{ 
            fontWeight: 700, 
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }
          }}
        >
          Platform Services
        </Typography>
        <Typography 
          variant="h6"
          align="center"
          sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          color="text.secondary"
        >
          Comprehensive solutions connecting professionals and companies through our innovative platform
        </Typography>

        {/* Tabs */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            mb: 2
          }}>
            <Box sx={{
              borderRadius: '50px',
              padding: 0.5,
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
            }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-indicator': {
                    height: '100%',
                    borderRadius: '50px',
                    background: 'white',
                    zIndex: 0,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  },
                  '& .MuiTab-root': {
                    zIndex: 1,
                    borderRadius: '50px',
                  }
                }}
              >
                <StyledTab label="For Professionals" />
                <StyledTab label="For Companies" />
              </Tabs>
            </Box>
          </Box>

          {/* Service Filters */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: 1,
            mb: 3,
            mt: 3
          }}>
            <Chip 
              label="All Services" 
              color="primary" 
              variant="filled" 
              sx={{ fontWeight: 600 }}
            />
            <Chip 
              label="Most Popular" 
              variant="outlined" 
              icon={<TrendingUpIcon />}
            />
            <Chip 
              label="New Features" 
              variant="outlined" 
              icon={<NewReleasesIcon />}
            />
            {tabValue === 0 && (
              <Chip 
                label="Career Growth" 
                variant="outlined" 
                icon={<SchoolIcon />}
              />
            )}
            {tabValue === 1 && (
              <Chip 
                label="Recruitment" 
                variant="outlined" 
                icon={<SearchIcon />}
              />
            )}
            <Chip 
              label="Saved" 
              variant="outlined" 
              icon={<BookmarkIcon />}
              sx={{ display: savedServices.length ? 'flex' : 'none' }}
            />
          </Box>
          
          {/* Carousel */}
          <CarouselContainer>
            {/* Navigation Buttons */}
            {!isMobile && (
              <>
                <NavigationButton 
                  sx={{ 
                    left: { xs: 10, md: 30 }
                  }} 
                  onClick={handleBack}
                  aria-label="previous service"
                >
                  <NavigateBeforeIcon fontSize="large" />
                </NavigationButton>
                <NavigationButton 
                  sx={{ 
                    right: { xs: 10, md: 30 }
                  }} 
                  onClick={handleNext}
                  aria-label="next service"
                >
                  <NavigateNextIcon fontSize="large" />
                </NavigationButton>
              </>
            )}

            {/* Enhanced Slider with touch gestures */}
            <Box
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleTouchStart}
              onMouseMove={handleTouchMove}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
              sx={{ 
                overflow: 'hidden',
                position: 'relative',
                width: '100%',
                touchAction: 'pan-y',
              }}
            >
              <EnhancedSliderWrapper 
                ref={sliderRef}
                sx={{ 
                  transform: `translateX(-${activeStep * 100}%)`,
                  minHeight: { xs: '550px', md: '650px' }
                }}
              >
                {currentServices.map((service, index) => (
                  <SlideItem key={index} sx={{ minHeight: '500px' }}>
                    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                      <Box sx={{ 
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: { xs: 2, md: 4 }
                      }}>
                        {showTouchHint && isMobile && activeStep === 0 && (
                          <TouchHint>
                            <TouchAppIcon /> Swipe to navigate
                          </TouchHint>
                        )}
                        <ServiceCard 
                          elevation={0}
                          sx={{
                            opacity: activeStep === index ? 1 : 0.5,
                            transform: activeStep === index ? 'scale(1)' : 'scale(0.95)',
                            transition: 'all 0.3s ease',
                            maxWidth: { xs: '90vw', sm: '85vw', md: '80vw', lg: '75vw' }
                          }}
                        >
                          <CardHeader>
                            {service.isNew && (
                              <Chip 
                                label="NEW" 
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: 10,
                                  right: 10,
                                  background: 'linear-gradient(45deg, #ff6b6b 30%, #ff8e8e 90%)',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  boxShadow: '0 2px 10px rgba(255, 107, 107, 0.4)',
                                }}
                              />
                            )}
                            <IconBox>
                              {service.icon}
                            </IconBox>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                                {service.title}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Box
                                  sx={{
                                    width: 50,
                                    height: 4,
                                    borderRadius: 2,
                                    bgcolor: theme.palette.primary.main,
                                    mr: 1,
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {service.popularity}% {tabValue === 0 ? 'match rate' : 'success rate'}
                                </Typography>
                              </Box>
                            </Box>
                            <Tooltip title={savedServices.includes(index) ? "Remove from saved" : "Save for later"}>
                              <IconButton 
                                size="small" 
                                onClick={() => toggleSaved(index)}
                                sx={{ ml: 1 }}
                              >
                                {savedServices.includes(index) ? 
                                  <BookmarkIcon color="primary" /> : 
                                  <BookmarkBorderIcon />
                                }
                              </IconButton>
                            </Tooltip>
                          </CardHeader>
                          <CardContent sx={{ flexGrow: 1, p: 3, pt: 2 }}>
                            <Typography variant="body1" color="text.secondary" paragraph>
                              {service.description}
                            </Typography>
                            <Box sx={{ mt: 'auto', pt: 2 }}>
                              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Key Features:
                              </Typography>
                              <Box>
                                {service.skills.map((skill, i) => (
                                  <StyledChip 
                                    key={i} 
                                    label={skill} 
                                    size="small" 
                                    color={service.color as "primary" | "secondary" | "success"} 
                                  />
                                ))}
                              </Box>
                            </Box>

                            <Collapse in={expandedCards[index]} timeout="auto" unmountOnExit>
                              <Divider sx={{ my: 2 }} />
                              <FeatureList>
                                {service.features.map((feature, i) => (
                                  <Box key={i}>
                                    <CheckCircleOutlineIcon fontSize="small" />
                                    <Typography variant="body2">{feature}</Typography>
                                  </Box>
                                ))}
                              </FeatureList>
                            </Collapse>
                          </CardContent>
                          <Box sx={{ position: 'relative', height: 10 }}>
                            <ExpandButton 
                              size="small" 
                              onClick={() => toggleExpand(index)}
                              aria-expanded={expandedCards[index]}
                              aria-label="show more"
                            >
                              <ExpandMoreIcon 
                                sx={{ 
                                  transform: expandedCards[index] ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.3s'
                                }} 
                              />
                            </ExpandButton>
                          </Box>
                        </ServiceCard>
                      </Box>
                    </Zoom>
                  </SlideItem>
                ))}
              </EnhancedSliderWrapper>
            </Box>

            {/* Dots Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              {currentServices.map((_, index) => (
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
                    disabled={activeStep === maxSteps - 1}
                  >
                    Next
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                  </Button>
                }
                backButton={
                  <Button 
                    size="small" 
                    onClick={handleBack} 
                    disabled={activeStep === 0}
                  >
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                    Back
                  </Button>
                }
              />
            )}
          </CarouselContainer>

          {/* Call to Action Button */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="h6" gutterBottom>
              {tabValue === 0 ? 'Ready to advance your career?' : 'Looking to build your dream team?'}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              sx={{ 
                px: 4, 
                py: 1.2, 
                borderRadius: '50px',
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(-3px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              {tabValue === 0 ? 'Create Professional Profile' : 'Register Company'}
            </Button>
          </Box>
        </Box>

        {/* Call to action */}
        <Fade in={true} timeout={1000}>
          <Box 
            sx={{ 
              textAlign: 'center', 
              mt: 8, 
              p: { xs: 4, md: 6 }, 
              borderRadius: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              color: 'white',
              boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(10px)',
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
                borderRadius: 4,
              }
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, position: 'relative' }}>
              Ready to transform your professional journey?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, maxWidth: 800, mx: 'auto', position: 'relative' }}>
              Join thousands of professionals and organizations already leveraging our platform to connect, 
              grow, and thrive in today's competitive landscape.
            </Typography>
            <Box sx={{ position: 'relative', '& > button': { mx: 1, mb: isMobile ? 2 : 0 } }}>
              <Button 
                variant="outlined" 
                color="inherit"
                size="large"
                sx={{ 
                  borderColor: 'white', 
                  borderWidth: 2, 
                  borderRadius: '50px',
                  px: 3, 
                  py: 1,
                  '&:hover': { 
                    borderColor: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Explore Features
              </Button>
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  bgcolor: 'white', 
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  borderRadius: '50px',
                  px: 3, 
                  py: 1,
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Sign Up Now
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>
    </ServicesSection>
  );
};

export default PlatformServices; 