import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Button, Card, CardContent, useTheme, useMediaQuery, Avatar, Chip, Tabs, Tab } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import CloudIcon from '@mui/icons-material/Cloud';
import StorageIcon from '@mui/icons-material/Storage';
import BusinessIcon from '@mui/icons-material/Business';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SchoolIcon from '@mui/icons-material/School';
import BiotechIcon from '@mui/icons-material/Biotech';
import InsightsIcon from '@mui/icons-material/Insights';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import EngineeringIcon from '@mui/icons-material/Engineering';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HandshakeIcon from '@mui/icons-material/Handshake';

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

const shine = keyframes`
  0% {
    background-position: -100px;
  }
  40%, 100% {
    background-position: 320px;
  }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const ServicesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e8eaf6 100%)',
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

const ServiceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  background: 'white',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.12)',
    '& .service-icon': {
      transform: 'scale(1.1) rotate(5deg)',
    },
    '& .service-overlay': {
      opacity: 1,
    }
  },
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
    '&:hover': {
      transform: 'none',
    }
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 70,
  height: 70,
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  color: 'white',
  transition: 'transform 0.3s ease',
  boxShadow: '0 10px 20px rgba(26, 35, 126, 0.2)',
  position: 'relative',
  zIndex: 1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
    transform: 'skewX(-25deg)',
    animation: `${shine} 2s infinite`,
  }
}));

const CardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to bottom, rgba(255,255,255,0) 60%, rgba(26, 35, 126, 0.05) 100%)',
  pointerEvents: 'none',
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const FeatureList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(1),
  '& svg': {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1),
    marginTop: 4,
    fontSize: 18,
  }
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

const StatisticBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'white', 
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  animation: `${float} 6s ease-in-out infinite`,
  animationDelay: '0.2s',
}));

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  height: '100%',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: 30,
    width: 20,
    height: 20,
    background: 'white',
    transform: 'rotate(45deg)',
    boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.05)',
    zIndex: -1,
  }
}));

// Services data
const services = [
  {
    id: 1,
    title: 'Software Development',
    description: 'Custom software solutions designed and built by verified senior developers using modern technologies and best practices.',
    icon: <CodeIcon fontSize="large" />,
    category: 'development',
    features: [
      'Full-stack web application development',
      'Mobile app development for iOS & Android',
      'API design and implementation',
      'Legacy system modernization',
      'DevOps and CI/CD pipeline setup'
    ],
    technologies: ['React', 'Node.js', 'Python', 'Java', 'AWS']
  },
  {
    id: 2,
    title: 'Cybersecurity Services',
    description: 'Comprehensive security solutions to protect your digital assets, identify vulnerabilities, and strengthen your security posture.',
    icon: <SecurityIcon fontSize="large" />,
    category: 'security',
    features: [
      'Penetration testing & vulnerability assessment',
      'Security architecture design',
      'Incident response planning',
      'Compliance (GDPR, HIPAA, ISO 27001)',
      'Security awareness training'
    ],
    technologies: ['OWASP', 'Kali Linux', 'Metasploit', 'Nessus', 'Wireshark']
  },
  {
    id: 3,
    title: 'Cloud & DevOps',
    description: 'Accelerate your digital transformation with our cloud and DevOps services designed for reliability, scalability, and security.',
    icon: <CloudIcon fontSize="large" />,
    category: 'cloud',
    features: [
      'Cloud migration & strategy',
      'Infrastructure as Code (IaC)',
      'CI/CD pipeline implementation',
      'Kubernetes orchestration',
      'Performance optimization'
    ],
    technologies: ['AWS', 'Azure', 'GCP', 'Terraform', 'Docker', 'Kubernetes']
  },
  {
    id: 4,
    title: 'Data Engineering',
    description: 'Transform your raw data into valuable insights with our end-to-end data engineering and analytics solutions.',
    icon: <StorageIcon fontSize="large" />,
    category: 'data',
    features: [
      'Data pipeline development',
      'ETL process implementation',
      'Data warehouse architecture',
      'Real-time analytics solutions',
      'Big data implementation'
    ],
    technologies: ['Hadoop', 'Spark', 'Kafka', 'Snowflake', 'Databricks']
  },
  {
    id: 5,
    title: 'Consulting Services',
    description: 'Strategic guidance from industry experts to help you make informed decisions and future-proof your technology investments.',
    icon: <BusinessIcon fontSize="large" />,
    category: 'consulting',
    features: [
      'Digital transformation strategy',
      'Technology roadmap planning',
      'IT system assessment',
      'Vendor selection assistance',
      'Process optimization'
    ],
    technologies: ['Agile', 'ITIL', 'Six Sigma', 'TOGAF', 'CMMI']
  },
  {
    id: 6,
    title: 'IT Staff Augmentation',
    description: 'Quickly scale your team with pre-vetted, highly-skilled IT professionals who integrate seamlessly with your existing workforce.',
    icon: <SupervisorAccountIcon fontSize="large" />,
    category: 'staffing',
    features: [
      'Verified senior developers',
      'Specialized skill sets',
      'Flexible engagement models',
      'Quick onboarding process',
      'Cultural fit assessment'
    ],
    technologies: ['Full-stack', 'DevOps', 'QA Automation', 'Data Science', 'UI/UX']
  },
  {
    id: 7,
    title: 'Technical Training',
    description: 'Upskill your technical teams with specialized training programs delivered by industry professionals with hands-on experience.',
    icon: <SchoolIcon fontSize="large" />,
    category: 'training',
    features: [
      'Custom training curricula',
      'Hands-on workshops',
      'One-on-one mentoring',
      'Certification preparation',
      'Team coding challenges'
    ],
    technologies: ['React', 'Node.js', 'Python', 'AWS', 'Kubernetes', 'Security']
  },
  {
    id: 8,
    title: 'QA & Testing',
    description: 'Ensure your software meets the highest quality standards with our comprehensive QA and testing services.',
    icon: <BiotechIcon fontSize="large" />,
    category: 'qa',
    features: [
      'Automated testing implementation',
      'Performance & load testing',
      'Security testing',
      'Mobile application testing',
      'QA process optimization'
    ],
    technologies: ['Selenium', 'Cypress', 'JMeter', 'Postman', 'TestRail']
  },
  {
    id: 9,
    title: 'AI & Machine Learning',
    description: 'Harness the power of artificial intelligence and machine learning to solve complex business problems and drive innovation.',
    icon: <InsightsIcon fontSize="large" />,
    category: 'ai',
    features: [
      'AI solution development',
      'Machine learning model training',
      'Natural language processing',
      'Computer vision applications',
      'AI strategy consulting'
    ],
    technologies: ['TensorFlow', 'PyTorch', 'scikit-learn', 'NLTK', 'OpenCV']
  }
];

const statistics = [
  { 
    value: '150+', 
    label: 'Successful Projects',
    icon: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 40 }} />
  },
  { 
    value: '98%', 
    label: 'Client Satisfaction',
    icon: <HandshakeIcon sx={{ color: 'primary.main', fontSize: 40 }} />
  },
  { 
    value: '20+', 
    label: 'Years Combined Experience',
    icon: <HourglassTopIcon sx={{ color: 'secondary.main', fontSize: 40 }} />
  },
  { 
    value: '100%', 
    label: 'Verified Professionals',
    icon: <EngineeringIcon sx={{ color: 'info.main', fontSize: 40 }} />
  }
];

const testimonials = [
  {
    quote: "VerTechie's software development team delivered our project ahead of schedule with exceptional code quality. Their senior developers brought insights that improved our architecture significantly.",
    author: "Michael Chen",
    position: "CTO, FinTech Innovations",
    company: "FinTech Innovations",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    quote: "The cybersecurity audit performed by VerTechie identified critical vulnerabilities that our previous assessments missed. Their remediation plan was clear, practical, and effectively implemented.",
    author: "Sarah Johnson",
    position: "CISO, HealthGuard Systems",
    company: "HealthGuard Systems",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  {
    quote: "Our cloud migration seemed impossible until VerTechie stepped in. Their experts not only moved our infrastructure to AWS but optimized it for cost and performance beyond our expectations.",
    author: "James Wilson",
    position: "VP of Engineering, RetailConnect",
    company: "RetailConnect",
    avatar: "https://i.pravatar.cc/150?img=12"
  }
];

const Services = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredServices = categoryFilter === 'all' 
    ? services 
    : services.filter(service => service.category === categoryFilter);

  const handleCategoryChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCategoryFilter(newValue);
  };

  return (
    <ServicesSection id="services">
      <Container
        maxWidth={false}
        sx={{
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, md: 6, lg: 8 },
          overflowX: 'hidden'
        }}
      >
        {/* Header */}
        <AnimatedBox delay={0.1}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
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
              Our Services
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
              VerTechie provides end-to-end technology services delivered by verified experts.
              From software development to cybersecurity, we offer specialized solutions tailored to your unique challenges.
            </Typography>
          </Box>
        </AnimatedBox>

        {/* Statistics */}
        <AnimatedBox delay={0.2}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3, 
              mb: 8 
            }}
          >
            {statistics.map((stat, index) => (
              <Box 
                key={index}
                sx={{ 
                  width: { xs: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } 
                }}
              >
                <StatisticBox style={{ animationDelay: `${index * 0.2}s` }}>
                  {stat.icon}
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700, 
                      mt: 2,
                      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </StatisticBox>
              </Box>
            ))}
          </Box>
        </AnimatedBox>

        {/* Category filter tabs */}
        <AnimatedBox delay={0.3}>
          <StyledTabs
            value={categoryFilter}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="Service category tabs"
            sx={{ mb: 4 }}
          >
            <Tab label="All Services" value="all" />
            <Tab label="Development" value="development" />
            <Tab label="Security" value="security" />
            <Tab label="Cloud" value="cloud" />
            <Tab label="Data" value="data" />
            <Tab label="Consulting" value="consulting" />
            <Tab label="Staffing" value="staffing" />
            <Tab label="Training" value="training" />
            <Tab label="QA" value="qa" />
            <Tab label="AI" value="ai" />
          </StyledTabs>
        </AnimatedBox>

        {/* Services grid */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              lg: 'repeat(3, 1fr)' 
            },
            gap: 4,
            mb: 8
          }}
        >
          {filteredServices.map((service, index) => (
            <AnimatedBox key={service.id} delay={0.4 + (index * 0.1)}>
              <ServiceCard>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 3 }}>
                  <IconWrapper className="service-icon">
                    {service.icon}
                  </IconWrapper>
                  
                  <Typography variant="h5" gutterBottom component="h3" sx={{ fontWeight: 600 }}>
                    {service.title}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {service.description}
                  </Typography>
                  
                  <FeatureList>
                    {service.features.map((feature, idx) => (
                      <FeatureItem key={idx}>
                        <CheckCircleIcon />
                        <Typography variant="body2">
                          {feature}
                        </Typography>
                      </FeatureItem>
                    ))}
                  </FeatureList>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 'auto', pt: 2 }}>
                    {service.technologies.map((tech, idx) => (
                      <Chip 
                        key={idx} 
                        label={tech} 
                        size="small" 
                        sx={{ 
                          mr: 0.5, 
                          mb: 0.5, 
                          backgroundColor: 'rgba(26, 35, 126, 0.08)',
                          '&:hover': {
                            backgroundColor: 'rgba(26, 35, 126, 0.12)'
                          }
                        }} 
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardOverlay className="service-overlay" />
              </ServiceCard>
            </AnimatedBox>
          ))}
        </Box>

        {/* Testimonials */}
        <AnimatedBox delay={0.6}>
          <Typography
            variant="h4"
            gutterBottom
            component="h3"
            sx={{ 
              fontWeight: 700, 
              mb: 4,
              textAlign: 'center',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            }}
          >
            Client Testimonials
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 4, 
              mb: 8 
            }}
          >
            {testimonials.map((testimonial, index) => (
              <Box 
                key={index}
                sx={{ 
                  width: { xs: '100%', md: 'calc(33.333% - 22px)' } 
                }}
              >
                <AnimatedBox delay={0.7 + (index * 0.1)}>
                  <TestimonialCard>
                    <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                      "{testimonial.quote}"
                    </Typography>
                  </TestimonialCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, ml: 4 }}>
                    <Avatar 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        mr: 2,
                        border: '2px solid white',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {testimonial.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.position}, {testimonial.company}
                      </Typography>
                    </Box>
                  </Box>
                </AnimatedBox>
              </Box>
            ))}
          </Box>
        </AnimatedBox>

        {/* Call to Action */}
        <AnimatedBox delay={0.8}>
          <Box
            sx={{
              padding: { xs: 3, md: 6 },
              borderRadius: theme.shape.borderRadius * 2,
              background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
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
                background: 'url("/circuit-pattern.svg")',
                opacity: 0.1,
                pointerEvents: 'none',
              }
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Ready to get started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 800, mx: 'auto' }}>
              Book a free consultation with our experts to discuss your project needs
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
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
              Schedule Consultation
            </Button>
          </Box>
        </AnimatedBox>
      </Container>
    </ServicesSection>
  );
};

export default Services; 