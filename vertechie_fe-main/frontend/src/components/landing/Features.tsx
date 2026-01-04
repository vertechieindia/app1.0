import React from 'react';
import { Box, Container, Typography, Paper, Chip, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PublicIcon from '@mui/icons-material/Public';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import LockIcon from '@mui/icons-material/Lock';

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

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
    '&:hover': {
      transform: 'none',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
      '& .icon-wrapper': {
        transform: 'none',
      }
    },
  },
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    '& .icon-wrapper': {
      transform: 'scale(1.1) rotate(10deg)',
    }
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 70,
  height: 70,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  color: 'white',
  boxShadow: '0 10px 20px rgba(26, 35, 126, 0.3)',
  transition: 'transform 0.3s ease-in-out',
  zIndex: 1,
  transform: 'translateZ(0)', // Force GPU acceleration
}));

const FeatureBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '50%',
  height: '100%',
  background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.03) 0%, rgba(13, 71, 161, 0.03) 100%)',
  zIndex: 0,
  clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 0% 100%)',
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

const FeatureChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  background: 'rgba(26, 35, 126, 0.1)',
  color: theme.palette.primary.main,
  fontWeight: 500,
  '&:hover': {
    background: 'rgba(26, 35, 126, 0.15)',
  },
}));

const FeaturePoint = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(1),
  '& svg': {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1),
    marginTop: 3,
  },
}));

const features = [
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
    title: 'Strict Verification Process',
    description: 'Every professional undergoes a multi-stage verification process, including work history checks, visa status validation, and dynamic skill assessments.',
    points: [
      'Identity verification through secure channels',
      'Work history validation with previous employers',
      'Educational background verification',
      'Credential and certification checks'
    ],
    keywords: ['Secure', 'Trusted', 'Multi-stage']
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
    title: '100% Skill Evaluations',
    description: 'Our one-on-one skill assessments test technical and soft skills in real-time, ensuring only well-qualified professionals join our platform.',
    points: [
      'Technical assessments through live coding challenges',
      'Domain knowledge testing by industry experts',
      'Soft skills evaluation through interviews',
      'Problem-solving capabilities assessment'
    ],
    keywords: ['Real-time', 'Comprehensive', 'Expert-led']
  },
  {
    icon: <WorkIcon sx={{ fontSize: 40 }} />,
    title: 'Direct Connections',
    description: 'No middlemen. VerTechie connects verified professionals directly with authorized clients, eliminating irrelevant applications and fake profiles.',
    points: [
      'Direct communication channels with clients',
      'Automatic matching based on verified skills',
      'Transparent hiring process',
      'No hidden recruitment fees'
    ],
    keywords: ['Transparent', 'Efficient', 'No middlemen']
  },
  {
    icon: <BusinessIcon sx={{ fontSize: 40 }} />,
    title: 'Verified Companies & Schools',
    description: 'Companies and schools must pass our strict validation process to gain visibility. Admins approve their associated professionals, ensuring authenticity.',
    points: [
      'Business registration verification',
      'Company admin authorization process',
      'Employee verification system',
      'Authentic institutional representation'
    ],
    keywords: ['Validated', 'Authentic', 'Admin-approved']
  },
  {
    icon: <GroupWorkIcon sx={{ fontSize: 40 }} />,
    title: 'Trusted Community',
    description: 'Join a community of IT professionals, companies, and learners who value quality and authenticity. VerTechie is trusted by thousands for hiring and upskilling.',
    points: [
      'Peer endorsements and recommendations',
      'Community-driven quality standards',
      'Collaborative learning opportunities',
      'Professional networking events'
    ],
    keywords: ['Supportive', 'Growing', 'Quality-focused']
  },
  {
    icon: <PublicIcon sx={{ fontSize: 40 }} />,
    title: 'Global Reach',
    description: 'With users from over 50 countries, VerTechie connects you to a global network of verified talent and opportunities. Expand your career or business with confidence.',
    points: [
      'International talent pool access',
      'Cross-border opportunity discovery',
      'Global market insights',
      'Remote working facilitation'
    ],
    keywords: ['Worldwide', 'Diverse', 'International']
  },
];

const Features = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      py: 10, 
      bgcolor: 'background.paper', 
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(248,249,250,1) 100%)',
        zIndex: 0,
      }
    }}>
      <Container 
        maxWidth={false} 
        sx={{ 
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, md: 6, lg: 8 },
          position: 'relative',
          zIndex: 1
        }}
      >
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
              How VerTechie Transforms IT Hiring
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 4, 
                maxWidth: 800, 
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.25rem' },
                lineHeight: 1.6
              }}
            >
              VerTechie's comprehensive platform bridges the gap between professionals and companies,
              ensuring quality, trust, and authenticity at every step of the hiring process.
            </Typography>
            
            {/* Feature highlights */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 3 }}>
              <Chip 
                icon={<VerifiedUserIcon />} 
                label="100% Verified Profiles" 
                color="primary" 
                aria-label="100% Verified Profiles feature"
                sx={{ 
                  px: 2, 
                  py: 2.5, 
                  borderRadius: '50px', 
                  fontWeight: 600,
                  animation: `${pulse} 2s infinite ease-in-out`,
                  animationDelay: '0.5s'
                }} 
              />
              <Chip 
                icon={<AssessmentIcon />} 
                label="Skill-based Matching" 
                color="primary" 
                variant="outlined"
                aria-label="Skill-based Matching feature" 
                sx={{ 
                  px: 2, 
                  py: 2.5, 
                  borderRadius: '50px',
                  fontWeight: 600 
                }} 
              />
              <Chip 
                icon={<LockIcon />} 
                label="Trusted Ecosystem" 
                color="primary" 
                variant="outlined"
                aria-label="Trusted Ecosystem feature" 
                sx={{ 
                  px: 2, 
                  py: 2.5, 
                  borderRadius: '50px',
                  fontWeight: 600 
                }} 
              />
            </Box>
          </Box>
        </AnimatedBox>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            lg: 'repeat(3, 1fr)' 
          },
          gap: 4
        }}>
          {features.map((feature, index) => (
            <AnimatedBox key={index} delay={0.2 + (index * 0.1)}>
              <FeatureCard elevation={0}>
                <FeatureBackground />
                <IconWrapper className="icon-wrapper">{feature.icon}</IconWrapper>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1, position: 'relative', zIndex: 1 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
                  {feature.description}
                </Typography>
                
                {/* Feature points */}
                <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
                  {feature.points.map((point, idx) => (
                    <FeaturePoint key={idx}>
                      <CheckCircleOutlineIcon fontSize="small" />
                      <Typography variant="body2">{point}</Typography>
                    </FeaturePoint>
                  ))}
                </Box>
                
                {/* Keywords */}
                <Box sx={{ mt: 'auto', display: 'flex', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                  {feature.keywords.map((keyword, idx) => (
                    <FeatureChip key={idx} label={keyword} size="small" />
                  ))}
                </Box>
              </FeatureCard>
            </AnimatedBox>
          ))}
        </Box>

        {/* Call to action */}
        <AnimatedBox delay={0.8}>
          <Box 
            sx={{ 
              textAlign: 'center', 
              mt: 8, 
              position: 'relative',
              zIndex: 1,
              px: { xs: 2, md: 10 },
              py: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.05) 0%, rgba(13, 71, 161, 0.05) 100%)',
              border: '1px solid rgba(26, 35, 126, 0.1)'
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Ready to experience the difference?
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
              Join VerTechie today and connect with verified professionals, trusted companies, and genuine opportunities.
            </Typography>
          </Box>
        </AnimatedBox>
      </Container>
    </Box>
  );
};

export default Features; 