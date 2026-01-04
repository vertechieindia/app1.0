import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  useTheme 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DevicesIcon from '@mui/icons-material/Devices';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import ApiIcon from '@mui/icons-material/Api';
import EventIcon from '@mui/icons-material/Event';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Link as RouterLink } from 'react-router-dom';

// Styled components with light theme colors matching home page
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: '#FFFFFF',
  color: theme.palette.text.primary,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: 80,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  }
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(6),
  maxWidth: 800,
}));

const ServiceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(25, 118, 210, 0.1)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(25, 118, 210, 0.15)',
    border: '1px solid rgba(25, 118, 210, 0.2)',
  }
}));

const ServiceIcon = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(25, 118, 210, 0.1)',
  color: theme.palette.primary.main,
  width: 65,
  height: 65,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: 32,
  }
}));

const ServiceTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const ServiceDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  flexGrow: 1,
  color: theme.palette.text.secondary,
}));

const FeatureList = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const FeatureItem = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
  '&::before': {
    content: '""',
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    marginRight: theme.spacing(1.5),
  }
}));

const LearnMoreButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#FFFFFF',
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  borderRadius: 8,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  }
}));

const services = [
  {
    id: 1,
    icon: <CodeIcon />,
    title: 'Custom Software Development',
    description: 'We build custom software solutions tailored to your specific business needs.',
    features: [
      'Web Applications',
      'Mobile Applications',
      'API Development',
      'Software Integrations'
    ]
  },
  {
    id: 2,
    icon: <StorageIcon />,
    title: 'Database Management',
    description: 'Optimize your database performance and ensure data security with our expert services.',
    features: [
      'Database Design',
      'Performance Optimization',
      'Data Migration',
      'Database Security'
    ]
  },
  {
    id: 3,
    icon: <CloudIcon />,
    title: 'Cloud Solutions',
    description: 'Leverage the power of cloud computing to enhance your business operations.',
    features: [
      'Cloud Migration',
      'AWS/Azure/GCP Services',
      'Serverless Architecture',
      'Cloud Security'
    ]
  },
  {
    id: 4,
    icon: <SecurityIcon />,
    title: 'Cybersecurity',
    description: 'Protect your digital assets with our comprehensive cybersecurity services.',
    features: [
      'Security Auditing',
      'Penetration Testing',
      'Compliance Solutions',
      'Security Training'
    ]
  },
  {
    id: 5,
    icon: <AnalyticsIcon />,
    title: 'Data Analytics',
    description: 'Transform your data into actionable insights with our analytics solutions.',
    features: [
      'Business Intelligence',
      'Data Visualization',
      'Predictive Analytics',
      'Big Data Solutions'
    ]
  },
  {
    id: 6,
    icon: <DevicesIcon />,
    title: 'IT Infrastructure',
    description: 'Build a robust and scalable IT infrastructure to support your business growth.',
    features: [
      'Network Design',
      'System Integration',
      'Hardware Solutions',
      'IT Support'
    ]
  },
  {
    id: 7,
    icon: <VerifiedUserIcon />,
    title: 'Profile Verification',
    description: 'Turn your LinkedIn profile from "probably real" to "absolutely verified"',
    features: [
      'Identity Verification That Actually Works',
      'Background Checks That Impress Employers',
      'Education Verification That Builds Trust',
      'Skills Certification That Opens Doors'
    ]
  },
  {
    id: 8,
    icon: <AssessmentIcon />,
    title: 'Skill Assessment',
    description: 'Prove your skills are as sharp as your resume says they are',
    features: [
      'Technical Tests That Challenge You',
      'Coding Challenges That Show Your Genius',
      'Problem-Solving That Proves Your Worth',
      'Competency Evaluation That Gets You Hired'
    ]
  },
  {
    id: 9,
    icon: <BusinessCenterIcon />,
    title: 'Job Matching',
    description: 'Stop applying to jobs that don\'t want you—find the ones that do',
    features: [
      'AI Matching That Actually Works',
      'Recommendations That Make Sense',
      'Career Analysis That Guides You',
      'Interview Prep That Gets You Hired'
    ]
  },
  {
    id: 10,
    icon: <PeopleIcon />,
    title: 'Talent Acquisition',
    description: 'Find the perfect candidate without the usual hiring headaches',
    features: [
      'Screening That Saves You Time',
      'Validation That Builds Confidence',
      'Culture Fit That Actually Fits',
      'Support That Gets Results'
    ]
  }
];

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f9ff 0%, #e3f2fd 100%)',
  padding: theme.spacing(10, 0),
  marginBottom: theme.spacing(8),
  borderRadius: 12,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 8px 30px rgba(25, 118, 210, 0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(circle at 30% 50%, rgba(25, 118, 210, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 70% 20%, rgba(25, 118, 210, 0.05) 0%, transparent 50%)`,
    zIndex: 1,
  }
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  '& span': {
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }
}));

const HeroSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(4),
  maxWidth: 800,
  margin: '0 auto',
}));

const ConsultButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#FFFFFF',
  fontWeight: 600,
  padding: theme.spacing(1.5, 4),
  borderRadius: 40,
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: '0 5px 15px rgba(25, 118, 210, 0.3)',
  }
}));

// BoxGrid: Simple grid-like layout using Box
const BoxGrid: React.FC<{
  children: React.ReactNode;
  spacing?: number;
}> = ({ children, spacing = 4 }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      margin: -spacing / 2,
      width: `calc(100% + ${spacing}px)`,
    }}>
      {children}
    </Box>
  );
};

// BoxGridItem: Column in the grid
const BoxGridItem: React.FC<{
  children: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}> = ({ children, xs = 12, sm, md, lg }) => {
  return (
    <Box sx={{ 
      padding: 2,
      width: {
        xs: `${(xs / 12) * 100}%`,
        ...(sm && { sm: `${(sm / 12) * 100}%` }),
        ...(md && { md: `${(md / 12) * 100}%` }),
        ...(lg && { lg: `${(lg / 12) * 100}%` }),
      },
      boxSizing: 'border-box',
    }}>
      {children}
    </Box>
  );
};

const CtaBanner = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f9ff 0%, #e3f2fd 100%)',
  padding: theme.spacing(8, 0),
  borderRadius: 12,
  position: 'relative',
  overflow: 'hidden',
  textAlign: 'center',
  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.1)',
  marginBottom: theme.spacing(10),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(25, 118, 210, 0.08) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, rgba(25, 118, 210, 0.08) 0%, transparent 50%)`,
    zIndex: 1,
  }
}));

const CtaTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(2.5),
  color: theme.palette.text.primary,
  position: 'relative',
  zIndex: 2,
}));

const CtaDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(4),
  maxWidth: 600,
  margin: '0 auto',
  position: 'relative',
  zIndex: 2,
}));

const ButtonsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  justifyContent: 'center',
  position: 'relative',
  zIndex: 2,
  flexWrap: 'wrap',
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#FFFFFF',
  fontWeight: 700,
  padding: theme.spacing(1.5, 4),
  borderRadius: 40,
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: '0 5px 15px rgba(25, 118, 210, 0.3)',
  }
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  fontWeight: 600,
  padding: theme.spacing(1.5, 4),
  borderRadius: 40,
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
  }
}));

const Services: React.FC = () => {
  const theme = useTheme();

  // Group services by category
  const itServices = services.slice(0, 6);
  const professionalServices = services.slice(6, 10);
  const businessServices = services.slice(10, 12);
  const educationalServices = services.slice(12, 14);

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <HeroSection>
          <HeroContent>
            <HeroTitle variant="h2">
              Our Premium <span>IT Services</span>
            </HeroTitle>
            <HeroSubtitle variant="h5">
              Leverage our expertise in technology to transform your business operations, 
              enhance productivity, and drive innovation.
            </HeroSubtitle>
            <ConsultButton 
              variant="contained" 
              href="/contact"
            >
              Get Free Consultation
            </ConsultButton>
          </HeroContent>
        </HeroSection>

        {/* IT Services Section */}
        <Box sx={{ mb: 10 }}>
          <SectionTitle variant="h3">
            IT Professional Services
          </SectionTitle>
          <SectionSubtitle variant="h6">
            We deliver comprehensive IT solutions to help businesses streamline operations, 
            enhance security, and drive digital transformation.
          </SectionSubtitle>
          
          <BoxGrid spacing={4}>
            {itServices.map((service) => (
              <BoxGridItem xs={12} md={6} lg={4} key={service.id}>
                <ServiceCard elevation={0}>
                  <ServiceIcon>
                    {service.icon}
                  </ServiceIcon>
                  <ServiceTitle variant="h5">
                    {service.title}
                  </ServiceTitle>
                  <ServiceDescription variant="body1">
                    {service.description}
                  </ServiceDescription>
                  <FeatureList>
                    {service.features.map((feature, index) => (
                      <FeatureItem variant="body2" key={index}>
                        {feature}
                      </FeatureItem>
                    ))}
                  </FeatureList>
                  <LearnMoreButton 
                    variant="contained" 
                    href={`/services/${service.id}`}
                  >
                    Learn More
                  </LearnMoreButton>
                </ServiceCard>
              </BoxGridItem>
            ))}
          </BoxGrid>
        </Box>

        {/* Professional Services Section */}
        <Box sx={{ mb: 10 }}>
          <SectionTitle variant="h3">
            Professional Verification
          </SectionTitle>
          <SectionSubtitle variant="h6">
            Stop being just another resume in the pile. Become the verified professional that employers actually want to hire.
          </SectionSubtitle>
          
          <BoxGrid spacing={4}>
            {professionalServices.map((service) => (
              <BoxGridItem xs={12} md={6} lg={4} key={service.id}>
                <ServiceCard elevation={0}>
                  <ServiceIcon>
                    {service.icon}
                  </ServiceIcon>
                  <ServiceTitle variant="h5">
                    {service.title}
                  </ServiceTitle>
                  <ServiceDescription variant="body1">
                    {service.description}
                  </ServiceDescription>
                  <FeatureList>
                    {service.features.map((feature, index) => (
                      <FeatureItem variant="body2" key={index}>
                        {feature}
                      </FeatureItem>
                    ))}
                  </FeatureList>
                  <LearnMoreButton 
                    variant="contained" 
                    href={`/services/${service.id}`}
                  >
                    Learn More
                  </LearnMoreButton>
                </ServiceCard>
              </BoxGridItem>
            ))}
          </BoxGrid>
        </Box>

        {/* Business Services Section */}
        <Box sx={{ mb: 10 }}>
          <SectionTitle variant="h3">
            Business Solutions
          </SectionTitle>
          <SectionSubtitle variant="h6">
            Find verified talent and streamline your technical hiring process with our business services.
          </SectionSubtitle>
          
          <BoxGrid spacing={4}>
            {businessServices.map((service) => (
              <BoxGridItem xs={12} md={6} key={service.id}>
                <ServiceCard elevation={0}>
                  <ServiceIcon>
                    {service.icon}
                  </ServiceIcon>
                  <ServiceTitle variant="h5">
                    {service.title}
                  </ServiceTitle>
                  <ServiceDescription variant="body1">
                    {service.description}
                  </ServiceDescription>
                  <FeatureList>
                    {service.features.map((feature, index) => (
                      <FeatureItem variant="body2" key={index}>
                        {feature}
                      </FeatureItem>
                    ))}
                  </FeatureList>
                  <LearnMoreButton 
                    variant="contained" 
                    href={`/services/${service.id}`}
                  >
                    Learn More
                  </LearnMoreButton>
                </ServiceCard>
              </BoxGridItem>
            ))}
          </BoxGrid>
        </Box>

        {/* Educational Services Section */}
        <Box sx={{ mb: 12 }}>
          <SectionTitle variant="h3">
            Education & Networking
          </SectionTitle>
          <SectionSubtitle variant="h6">
            Resources and opportunities to help you thrive in the tech industry.
          </SectionSubtitle>
          
          <BoxGrid spacing={4}>
            {educationalServices.map((service) => (
              <BoxGridItem xs={12} md={6} key={service.id}>
                <ServiceCard elevation={0}>
                  <ServiceIcon>
                    {service.icon}
                  </ServiceIcon>
                  <ServiceTitle variant="h5">
                    {service.title}
                  </ServiceTitle>
                  <ServiceDescription variant="body1">
                    {service.description}
                  </ServiceDescription>
                  <FeatureList>
                    {service.features.map((feature, index) => (
                      <FeatureItem variant="body2" key={index}>
                        {feature}
                      </FeatureItem>
                    ))}
                  </FeatureList>
                  <LearnMoreButton 
                    variant="contained" 
                    href={`/services/${service.id}`}
                  >
                    Learn More
                  </LearnMoreButton>
                </ServiceCard>
              </BoxGridItem>
            ))}
          </BoxGrid>
        </Box>

        {/* Call to Action Banner */}
        <CtaBanner>
          <Container>
            <CtaTitle variant="h3">
              Ready to Get Started?
            </CtaTitle>
            <CtaDescription variant="h6">
              Join VerTechie today and connect with verified IT professionals or find genuine talent for your business.
            </CtaDescription>
            <ButtonsWrapper>
              <PrimaryButton 
                variant="contained"
                href="/register"
              >
                Join as Professional
              </PrimaryButton>
              <SecondaryButton
                variant="outlined"
                href="/companies"
              >
                Register Company
              </SecondaryButton>
            </ButtonsWrapper>
          </Container>
        </CtaBanner>
      </Container>
    </PageContainer>
  );
};

export default Services; 