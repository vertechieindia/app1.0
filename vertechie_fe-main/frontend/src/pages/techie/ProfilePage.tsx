/**
 * ProfilePage - Unique Tech-Focused User Profile
 * Modern bento-grid design with glassmorphism effects
 * Distinctly different from traditional social platforms
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  IconButton,
  Chip,
  Card,
  CardContent,
  Divider,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Tooltip,
  Badge,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import CodeIcon from '@mui/icons-material/Code';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TerminalIcon from '@mui/icons-material/Terminal';
import DataObjectIcon from '@mui/icons-material/DataObject';
import BoltIcon from '@mui/icons-material/Bolt';
import DiamondIcon from '@mui/icons-material/Diamond';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VerifiedIcon from '@mui/icons-material/Verified';
import AddIcon from '@mui/icons-material/Add';

// Shared Components
import ContributionHeatmap from '../../components/ContributionHeatmap';

// Tech Logos Library
import { getTechByName, ALL_TECH_LOGOS, TechLogo } from '../../constants/techLogos';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// Styled Components
const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 70%)
    `,
    pointerEvents: 'none',
  },
});

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  borderRadius: 24,
  border: '1px solid rgba(255, 255, 255, 0.08)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    border: '1px solid rgba(255, 255, 255, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

const ProfileAvatar = styled(Avatar)({
  width: 140,
  height: 140,
  border: '4px solid rgba(99, 102, 241, 0.5)',
  boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)',
  animation: `${glow} 3s ease-in-out infinite`,
  fontSize: '3rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
});

const StatCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    transform: 'scale(1.02)',
  },
}));

const SkillBadge = styled(Box)<{ level: number }>(({ level }) => {
  const colors = [
    ['#10b981', '#059669'], // Beginner - Green
    ['#3b82f6', '#2563eb'], // Intermediate - Blue
    ['#8b5cf6', '#7c3aed'], // Advanced - Purple
    ['#f59e0b', '#d97706'], // Expert - Gold
    ['#ef4444', '#dc2626'], // Master - Red
  ];
  const [start, end] = colors[Math.min(level, 4)];
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 12,
    background: `linear-gradient(135deg, ${alpha(start, 0.2)}, ${alpha(end, 0.1)})`,
    border: `1px solid ${alpha(start, 0.3)}`,
    color: start,
    fontSize: '0.85rem',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    cursor: 'default',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${alpha(start, 0.3)}`,
    },
  };
});


const TechStackIcon = styled(Box)({
  width: 48,
  height: 48,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  fontSize: 24,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(99, 102, 241, 0.2)',
    border: '1px solid rgba(99, 102, 241, 0.4)',
    transform: 'translateY(-4px)',
  },
});

const GradientText = styled(Typography)({
  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
});

const ExperienceCard = styled(Box)({
  padding: 20,
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  position: 'relative',
  marginLeft: 24,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: -24,
    top: 0,
    bottom: 0,
    width: 2,
    background: 'linear-gradient(180deg, #6366f1, #a855f7)',
    borderRadius: 1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: -29,
    top: 24,
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: '#6366f1',
    border: '3px solid #1a1a2e',
  },
});

// Main Component
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editExperienceOpen, setEditExperienceOpen] = useState(false);
  const [editEducationOpen, setEditEducationOpen] = useState(false);
  const [editSkillsOpen, setEditSkillsOpen] = useState(false);
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  
  // Mock user data
  const [user] = useState({
    id: 'usr_12345',
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    title: 'Full Stack Architect',
    tagline: 'Building the future, one commit at a time 🚀',
    location: 'San Francisco, CA',
    email: 'john@example.com',
    isVerified: true,
    level: 42,
    xp: 12450,
    rank: 'Diamond',
    joinedDate: 'Jan 2020',
    website: 'https://johndoe.dev',
    github: 'johndoe',
  });

  const stats = [
    { label: 'Problems', value: 256, icon: '🧩', color: '#10b981' },
    { label: 'Commits', value: '2.1K', icon: '📦', color: '#3b82f6' },
    { label: 'Streak', value: 42, icon: '🔥', color: '#f59e0b' },
    { label: 'Rank', value: '#127', icon: '🏆', color: '#a855f7' },
  ];

  const skills = [
    { name: 'React', level: 4, logo: getTechByName('React')?.logo },
    { name: 'TypeScript', level: 4, logo: getTechByName('TypeScript')?.logo },
    { name: 'Node.js', level: 3, logo: getTechByName('Node.js')?.logo },
    { name: 'Python', level: 3, logo: getTechByName('Python')?.logo },
    { name: 'AWS', level: 3, logo: getTechByName('AWS')?.logo },
    { name: 'Docker', level: 2, logo: getTechByName('Docker')?.logo },
    { name: 'GraphQL', level: 2, logo: getTechByName('GraphQL')?.logo },
    { name: 'Rust', level: 1, logo: getTechByName('Rust')?.logo },
  ];

  const experience = [
    {
      title: 'Senior Full Stack Developer',
      company: 'TechCorp',
      period: '2021 - Present',
      tech: ['React', 'Node.js', 'AWS', 'PostgreSQL'],
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      period: '2018 - 2021',
      tech: ['Vue.js', 'Python', 'Django', 'Docker'],
    },
  ];

  const education = [
    {
      degree: 'Master of Science in Computer Science',
      institution: 'Stanford University',
      period: '2016 - 2018',
      gpa: '3.9/4.0',
    },
    {
      degree: 'Bachelor of Science in Software Engineering',
      institution: 'MIT',
      period: '2012 - 2016',
      gpa: '3.8/4.0',
    },
  ];

  const projects = [
    {
      name: 'CloudSync Pro',
      description: 'A real-time cloud synchronization platform with end-to-end encryption for enterprise teams.',
      tech: ['React', 'Node.js', 'AWS', 'WebSocket'],
      stars: 1247,
      forks: 234,
      link: 'https://github.com/johndoe/cloudsync-pro',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop',
    },
    {
      name: 'AI Code Assistant',
      description: 'An intelligent coding assistant powered by machine learning for code completion and review.',
      tech: ['Python', 'TensorFlow', 'FastAPI', 'Docker'],
      stars: 892,
      forks: 156,
      link: 'https://github.com/johndoe/ai-code-assistant',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop',
    },
    {
      name: 'DevMetrics Dashboard',
      description: 'Analytics dashboard for tracking developer productivity and code quality metrics.',
      tech: ['Vue.js', 'GraphQL', 'PostgreSQL', 'D3.js'],
      stars: 567,
      forks: 89,
      link: 'https://github.com/johndoe/devmetrics',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
    },
  ];

  // User's selected tech stack - using the centralized tech logos library
  const techStack = [
    getTechByName('React'),
    getTechByName('TypeScript'),
    getTechByName('Node.js'),
    getTechByName('Python'),
    getTechByName('AWS'),
    getTechByName('Docker'),
    getTechByName('PostgreSQL'),
    getTechByName('MongoDB'),
    getTechByName('GraphQL'),
    getTechByName('Redis'),
  ].filter(Boolean) as TechLogo[];

  useEffect(() => {
    setIsOwnProfile(!userId || userId === 'me' || userId === user.id);
  }, [userId, user.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`vertechie.com/u/${user.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelTitle = (level: number) => {
    if (level >= 50) return 'Legendary';
    if (level >= 40) return 'Diamond';
    if (level >= 30) return 'Platinum';
    if (level >= 20) return 'Gold';
    if (level >= 10) return 'Silver';
    return 'Bronze';
  };

  return (
    <PageContainer>
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Floating Decorative Elements */}
        <Box sx={{ 
          position: 'absolute', 
          top: 100, 
          right: 50, 
          width: 200, 
          height: 200, 
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          animation: `${float} 6s ease-in-out infinite`,
          pointerEvents: 'none',
        }} />

        {/* Profile Header */}
        <GlassCard sx={{ p: 4, mb: 3 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Avatar & Basic Info */}
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid #1a1a2e',
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'white',
                    }}>
                      {user.level}
                    </Box>
                  }
                >
                  <ProfileAvatar>
                    {user.firstName[0]}{user.lastName[0]}
                  </ProfileAvatar>
                </Badge>
                
                <Box sx={{ flex: 1, minWidth: 280 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <GradientText variant="h3">
                      {user.firstName} {user.lastName}
                    </GradientText>
                    {user.isVerified && (
                      <VerifiedIcon sx={{ color: '#6366f1', fontSize: 28 }} />
                    )}
                    <Chip 
                      label={getLevelTitle(user.level)}
                      size="small"
                      sx={{ 
                        ml: 1,
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        color: 'white',
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, fontWeight: 500 }}>
                    {user.title}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2 }}>
                    {user.tagline}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.5)' }}>
                      <LocationOnIcon sx={{ fontSize: 18 }} />
                      <Typography variant="body2">{user.location}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.5)' }}>
                      <RocketLaunchIcon sx={{ fontSize: 18 }} />
                      <Typography variant="body2">Joined {user.joinedDate}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
            
            {/* Actions */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                {/* Profile Link */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  p: 1.5,
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                    vertechie.com/u/{user.username}
                  </Typography>
                  <IconButton size="small" onClick={handleCopyLink} sx={{ color: copied ? '#10b981' : 'rgba(255,255,255,0.5)' }}>
                    {copied ? <VerifiedIcon /> : <ContentCopyIcon />}
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {user.github && (
                    <IconButton 
                      onClick={() => window.open(`https://github.com/${user.github}`, '_blank')}
                      sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
                    >
                      <GitHubIcon />
                    </IconButton>
                  )}
                  {user.website && (
                    <IconButton 
                      onClick={() => window.open(user.website, '_blank')}
                      sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
                    >
                      <LanguageIcon />
                    </IconButton>
                  )}
                  {isOwnProfile && (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setEditDialogOpen(true)}
                      sx={{ 
                        borderColor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        '&:hover': { borderColor: '#6366f1', bgcolor: 'rgba(99,102,241,0.1)' },
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
          
          {/* XP Progress */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                Level {user.level} → Level {user.level + 1}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600 }}>
                {user.xp.toLocaleString()} XP
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={65} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.05)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
                  borderRadius: 4,
                },
              }}
            />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5, display: 'block' }}>
              550 XP to next level
            </Typography>
          </Box>
        </GlassCard>

        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((stat, idx) => (
            <Grid item xs={6} sm={3} key={idx}>
              <GlassCard sx={{ p: 0 }}>
                <StatCard>
                  <Typography variant="h4" sx={{ mb: 0.5 }}>{stat.icon}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    {stat.label}
                  </Typography>
                </StatCard>
              </GlassCard>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            {/* Contribution Heatmap */}
            <GlassCard sx={{ mb: 3, '& > *': { background: 'transparent !important' } }}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TerminalIcon sx={{ color: '#6366f1' }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    Activity
                  </Typography>
                </Box>
                <ContributionHeatmap showControls={true} compact={false} />
              </Box>
            </GlassCard>

            {/* Skills */}
            <GlassCard sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DataObjectIcon sx={{ color: '#6366f1' }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    Skills & Expertise
                  </Typography>
                </Box>
                {isOwnProfile && (
                  <IconButton size="small" onClick={() => setEditSkillsOpen(true)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {skills.map((skill) => (
                  <SkillBadge key={skill.name} level={skill.level}>
                    <img 
                      src={skill.logo} 
                      alt={skill.name} 
                      style={{ width: 18, height: 18, objectFit: 'contain' }} 
                    />
                    {skill.name}
                  </SkillBadge>
                ))}
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 2, display: 'block' }}>
                Skill levels: 🟢 Beginner → 🔵 Intermediate → 🟣 Advanced → 🟡 Expert → 🔴 Master
              </Typography>
            </GlassCard>

            {/* Experience */}
            <GlassCard sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkIcon sx={{ color: '#6366f1' }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    Experience
                  </Typography>
                </Box>
                {isOwnProfile && (
                  <IconButton size="small" onClick={() => setEditExperienceOpen(true)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {experience.map((exp, idx) => (
                  <ExperienceCard key={idx}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                      {exp.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                      {exp.company} • {exp.period}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {exp.tech.map((t) => (
                        <Chip 
                          key={t} 
                          label={t} 
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(99, 102, 241, 0.1)', 
                            color: '#a5b4fc',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                          }}
                        />
                      ))}
                    </Box>
                  </ExperienceCard>
                ))}
              </Box>
            </GlassCard>

            {/* Education */}
            <GlassCard sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon sx={{ color: '#10b981' }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    Education
                  </Typography>
                </Box>
                {isOwnProfile && (
                  <IconButton size="small" onClick={() => setEditEducationOpen(true)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {education.map((edu, idx) => (
                  <ExperienceCard key={idx}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <SchoolIcon sx={{ color: '#10b981' }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 0.5, fontSize: '1rem' }}>
                          {edu.degree}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5 }}>
                          {edu.institution}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            {edu.period}
                          </Typography>
                          <Chip 
                            label={`GPA: ${edu.gpa}`}
                            size="small"
                            sx={{ 
                              height: 20,
                              bgcolor: 'rgba(16, 185, 129, 0.1)', 
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.2)',
                              fontSize: '0.7rem',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </ExperienceCard>
                ))}
              </Box>
            </GlassCard>

            {/* Projects */}
            <GlassCard sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RocketLaunchIcon sx={{ color: '#f59e0b' }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    Featured Projects
                  </Typography>
                </Box>
                {isOwnProfile && (
                  <Button 
                    size="small" 
                    onClick={() => setAddProjectOpen(true)} 
                    sx={{ color: '#f59e0b', textTransform: 'none' }}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                )}
              </Box>
              <Grid container spacing={2}>
                {projects.map((project, idx) => (
                  <Grid item xs={12} key={idx}>
                    <Box 
                      sx={{ 
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                      onClick={() => window.open(project.link, '_blank')}
                    >
                      {/* Project Image */}
                      <Box 
                        sx={{ 
                          height: 120, 
                          background: `url(${project.image}) center/cover`,
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                          },
                        }}
                      />
                      
                      {/* Project Info */}
                      <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                            {project.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography variant="caption" sx={{ color: '#f59e0b' }}>⭐</Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                {project.stars.toLocaleString()}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography variant="caption" sx={{ color: '#6366f1' }}>🔱</Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                {project.forks}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1.5, fontSize: '0.8rem', lineHeight: 1.5 }}>
                          {project.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {project.tech.map((t) => (
                            <Chip 
                              key={t} 
                              label={t} 
                              size="small"
                              sx={{ 
                                height: 22,
                                bgcolor: 'rgba(99, 102, 241, 0.1)', 
                                color: '#a5b4fc',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                fontSize: '0.7rem',
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </GlassCard>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={4}>
            {/* Tech Stack */}
            <GlassCard sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BoltIcon sx={{ color: '#f59e0b' }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  Tech Stack
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {techStack.map((tech, idx) => (
                  <Tooltip key={idx} title={tech.name} arrow>
                    <TechStackIcon>
                      <img 
                        src={tech.logo} 
                        alt={tech.name} 
                        style={{ width: 28, height: 28, objectFit: 'contain' }} 
                      />
                    </TechStackIcon>
                  </Tooltip>
                ))}
              </Box>
            </GlassCard>

            {/* Coding Stats */}
            <GlassCard sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <CodeIcon sx={{ color: '#10b981' }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  Problem Solving
                </Typography>
              </Box>
              
              {[
                { label: 'Easy', solved: 120, total: 150, color: '#10b981' },
                { label: 'Medium', solved: 95, total: 200, color: '#f59e0b' },
                { label: 'Hard', solved: 41, total: 100, color: '#ef4444' },
              ].map((diff) => (
                <Box key={diff.label} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {diff.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: diff.color, fontWeight: 600 }}>
                      {diff.solved}/{diff.total}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(diff.solved / diff.total) * 100}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '& .MuiLinearProgress-bar': { bgcolor: diff.color, borderRadius: 4 },
                    }}
                  />
                </Box>
              ))}
              
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.05)' }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#6366f1' }}>256</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Total</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#f59e0b' }}>42</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Streak</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981' }}>A+</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Grade</Typography>
                </Box>
              </Box>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Profile Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { bgcolor: '#1a1a2e', backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ color: 'white' }}>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="First Name" 
                defaultValue={user.firstName}
                sx={{ 
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Last Name" 
                defaultValue={user.lastName}
                sx={{ 
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Title" 
                defaultValue={user.title}
                sx={{ 
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Tagline" 
                defaultValue={user.tagline}
                sx={{ 
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Location" 
                defaultValue={user.location}
                sx={{ 
                  '& .MuiOutlinedInput-root': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setEditDialogOpen(false)}
            sx={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Experience Dialog */}
      <Dialog 
        open={editExperienceOpen} 
        onClose={() => setEditExperienceOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { bgcolor: '#1a1a2e', backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ color: 'white' }}>Edit Experience</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {experience.map((exp, idx) => (
              <Box key={idx} sx={{ mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Job Title" 
                      defaultValue={exp.title}
                      sx={{ '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Company" 
                      defaultValue={exp.company}
                      sx={{ '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Period" 
                      defaultValue={exp.period}
                      sx={{ '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Technologies (comma separated)" 
                      defaultValue={exp.tech.join(', ')}
                      sx={{ '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} sx={{ color: '#6366f1' }}>Add Experience</Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditExperienceOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>Cancel</Button>
          <Button variant="contained" onClick={() => { setEditExperienceOpen(false); setSnackbar({ open: true, message: 'Experience updated!' }); }} sx={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Education Dialog */}
      <Dialog 
        open={editEducationOpen} 
        onClose={() => setEditEducationOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { bgcolor: '#1a1a2e', backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ color: 'white' }}>Edit Education</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {education.map((edu, idx) => (
              <Box key={idx} sx={{ mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Degree" 
                      defaultValue={edu.degree}
                      sx={{ '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Institution" 
                      defaultValue={edu.institution}
                      sx={{ '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField 
                      fullWidth 
                      label="Period" 
                      defaultValue={edu.period}
                      sx={{ '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField 
                      fullWidth 
                      label="GPA" 
                      defaultValue={edu.gpa}
                      sx={{ '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} sx={{ color: '#10b981' }}>Add Education</Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditEducationOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>Cancel</Button>
          <Button variant="contained" onClick={() => { setEditEducationOpen(false); setSnackbar({ open: true, message: 'Education updated!' }); }} sx={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Skills Dialog */}
      <Dialog 
        open={editSkillsOpen} 
        onClose={() => setEditSkillsOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { bgcolor: '#1a1a2e', backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ color: 'white' }}>Edit Skills</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2 }}>
            Manage your skills and proficiency levels
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {skills.map((skill) => (
              <Chip 
                key={skill.name} 
                label={skill.name} 
                onDelete={() => {}}
                sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', '& .MuiChip-deleteIcon': { color: 'rgba(255,255,255,0.5)' } }}
              />
            ))}
          </Box>
          <TextField 
            fullWidth 
            label="Add new skill" 
            placeholder="Type skill name and press Enter"
            sx={{ '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditSkillsOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>Cancel</Button>
          <Button variant="contained" onClick={() => { setEditSkillsOpen(false); setSnackbar({ open: true, message: 'Skills updated!' }); }} sx={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add Project Dialog */}
      <Dialog 
        open={addProjectOpen} 
        onClose={() => setAddProjectOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { bgcolor: '#1a1a2e', backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ color: 'white' }}>Add Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Project Name" 
                placeholder="My Awesome Project"
                sx={{ '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Description" 
                multiline
                rows={3}
                placeholder="Brief description of your project"
                sx={{ '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="GitHub/Project URL" 
                placeholder="https://github.com/username/project"
                sx={{ '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Technologies Used (comma separated)" 
                placeholder="React, Node.js, PostgreSQL"
                sx={{ '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" fullWidth sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.2)', py: 2 }}>
                Upload Project Image
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddProjectOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>Cancel</Button>
          <Button variant="contained" onClick={() => { setAddProjectOpen(false); setSnackbar({ open: true, message: 'Project added!' }); }} sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>Add Project</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ProfilePage;
