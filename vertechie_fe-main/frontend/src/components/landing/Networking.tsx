import React, { useState } from 'react';
import { Box, Container, Typography, Avatar, Button, Chip, Paper, Divider, useTheme, useMediaQuery } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import GroupIcon from '@mui/icons-material/Group';
import ForumIcon from '@mui/icons-material/Forum';
import EventIcon from '@mui/icons-material/Event';
import HandshakeIcon from '@mui/icons-material/Handshake';
import VerifiedIcon from '@mui/icons-material/Verified';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import MessageIcon from '@mui/icons-material/Message';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const NetworkingSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e8edf2 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/network-pattern.svg")',
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

const ProfileCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    '& .profile-connect-btn': {
      backgroundColor: theme.palette.primary.dark,
    }
  },
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  position: 'relative',
}));

const ProfileContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 3, 3),
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
}));

const ProfileBanner = styled(Box)(({ theme }) => ({
  height: 80,
  width: '100%',
  background: 'linear-gradient(90deg, #1a237e 0%, #0d47a1 100%)',
  position: 'absolute',
  top: 0,
  left: 0,
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: '4px solid white',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
  marginTop: 30,
  marginBottom: theme.spacing(2),
  position: 'relative',
  zIndex: 1,
}));

const VerifiedBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 5,
  right: 0,
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  borderRadius: '50%',
  padding: theme.spacing(0.5),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  zIndex: 2,
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  backgroundColor: 'rgba(25, 118, 210, 0.08)',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.15)',
  }
}));

const ConnectionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: '50px',
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(26, 35, 126, 0.2)',
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  color: 'white',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1) rotate(10deg)',
  }
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
  }
}));

const MetaInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
  '& svg': {
    marginRight: theme.spacing(1),
    fontSize: '1rem',
  }
}));

const professionals = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Senior Frontend Developer',
    company: 'TechSolutions Inc.',
    location: 'San Francisco, CA',
    avatar: 'https://i.pravatar.cc/300?img=11',
    fallbackAvatar: '/avatars/default-1.jpg',
    verified: true,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    bio: 'Frontend specialist with 8+ years of experience building scalable applications. Passionate about UI/UX and performance optimization.',
  },
  {
    id: 2,
    name: 'Sophia Williams',
    role: 'DevOps Engineer',
    company: 'CloudNative Systems',
    location: 'Seattle, WA',
    avatar: 'https://i.pravatar.cc/300?img=5',
    fallbackAvatar: '/avatars/default-2.jpg',
    verified: true,
    skills: ['Kubernetes', 'AWS', 'Docker', 'CI/CD', 'Terraform'],
    bio: 'DevOps engineer specializing in cloud infrastructure and automation. Experienced in building resilient, scalable systems.',
  },
  {
    id: 3,
    name: 'Marcus Chen',
    role: 'Security Architect',
    company: 'CyberShield',
    location: 'Austin, TX',
    avatar: 'https://i.pravatar.cc/300?img=12',
    fallbackAvatar: '/avatars/default-3.jpg',
    verified: true,
    skills: ['Cybersecurity', 'Penetration Testing', 'Risk Assessment', 'SIEM'],
    bio: 'Security architect focused on protecting critical infrastructure. Certified ethical hacker with a background in threat intelligence.',
  },
];

const networkingFeatures = [
  {
    id: 1,
    title: 'Professional Communities',
    description: 'Join specialized tech communities based on your skills and interests. Engage in discussions, share knowledge, and stay updated.',
    icon: <GroupIcon fontSize="large" />,
  },
  {
    id: 2,
    title: 'Direct Messaging',
    description: 'Connect with professionals through our secure messaging platform. Build relationships with peers, mentors, and potential collaborators.',
    icon: <ForumIcon fontSize="large" />,
  },
  {
    id: 3,
    title: 'Virtual Events',
    description: 'Participate in webinars, workshops, and networking events. Learn from industry leaders and expand your professional network.',
    icon: <EventIcon fontSize="large" />,
  },
  {
    id: 4,
    title: 'Collaboration Opportunities',
    description: 'Find collaborators for projects, mentorship opportunities, and job referrals from within your extended network of professionals.',
    icon: <HandshakeIcon fontSize="large" />,
  },
];

const Networking = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for avatar loading errors
  const [avatarErrors, setAvatarErrors] = useState<Record<number, boolean>>({});
  
  const handleAvatarError = (professionalId: number) => {
    setAvatarErrors(prev => ({
      ...prev,
      [professionalId]: true
    }));
  };

  return (
    <NetworkingSection>
      <Container
        maxWidth={false}
        sx={{
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, md: 6, lg: 8 }
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
              Connect with Tech Professionals
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
              Build meaningful professional relationships with verified tech professionals. 
              Expand your network, exchange knowledge, and discover new opportunities.
            </Typography>
          </Box>
        </AnimatedBox>

        {/* Professional profiles */}
        <AnimatedBox delay={0.3}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 4,
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Verified Professionals
          </Typography>

          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 4,
              mb: 8
            }}
          >
            {professionals.map((professional, index) => (
              <AnimatedBox key={professional.id} delay={0.4 + (index * 0.1)}>
                <ProfileCard>
                  <ProfileHeader>
                    <ProfileBanner />
                    <LargeAvatar 
                      src={avatarErrors[professional.id] ? professional.fallbackAvatar : professional.avatar} 
                      alt={professional.name}
                      imgProps={{
                        loading: 'lazy',
                        onError: () => handleAvatarError(professional.id)
                      }}
                    >
                      {professional.verified && (
                        <VerifiedBadge>
                          <VerifiedIcon fontSize="small" />
                        </VerifiedBadge>
                      )}
                    </LargeAvatar>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
                      {professional.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {professional.role}
                    </Typography>
                  </ProfileHeader>

                  <ProfileContent>
                    <MetaInfo>
                      <BusinessIcon fontSize="small" />
                      <Typography variant="body2">{professional.company}</Typography>
                    </MetaInfo>
                    <MetaInfo>
                      <LocationOnIcon fontSize="small" />
                      <Typography variant="body2">{professional.location}</Typography>
                    </MetaInfo>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
                      {professional.bio}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', my: 2 }}>
                      {professional.skills.map((skill, idx) => (
                        <SkillChip key={idx} label={skill} size="small" />
                      ))}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                      <ConnectionButton
                        variant="contained"
                        color="primary"
                        startIcon={<PersonAddIcon />}
                        fullWidth
                        className="profile-connect-btn"
                        aria-label={`Connect with ${professional.name}`}
                      >
                        Connect
                      </ConnectionButton>
                      <ConnectionButton
                        variant="outlined"
                        color="primary"
                        startIcon={<MessageIcon />}
                        fullWidth
                        aria-label={`Message ${professional.name}`}
                      >
                        Message
                      </ConnectionButton>
                    </Box>
                  </ProfileContent>
                </ProfileCard>
              </AnimatedBox>
            ))}
          </Box>
        </AnimatedBox>

        {/* Networking features */}
        <AnimatedBox delay={0.6}>
          <Divider sx={{ mb: 8 }} />
          
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 4,
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Networking Features
          </Typography>

          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 4,
              mb: 8
            }}
          >
            {networkingFeatures.map((feature, index) => (
              <AnimatedBox key={feature.id} delay={0.7 + (index * 0.1)}>
                <FeatureCard>
                  <FeatureIcon>
                    {feature.icon}
                  </FeatureIcon>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </AnimatedBox>
            ))}
          </Box>
        </AnimatedBox>

        {/* Call to action */}
        <AnimatedBox delay={0.9}>
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              p: { xs: 3, md: 6 },
              borderRadius: theme.shape.borderRadius * 2,
              background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
              color: 'white',
              gap: 4
            }}
          >
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Ready to expand your network?
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Join thousands of tech professionals and companies on VerTechie.
              </Typography>
            </Box>
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
              Join Network
            </Button>
          </Box>
        </AnimatedBox>
      </Container>
    </NetworkingSection>
  );
};

export default Networking; 