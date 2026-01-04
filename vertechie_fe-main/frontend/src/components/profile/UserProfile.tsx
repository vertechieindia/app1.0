import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Avatar, 
  Button, 
  Tabs, 
  Tab, 
  Divider, 
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  Badge,
  IconButton,
  Card,
  CardContent,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import LanguageIcon from '@mui/icons-material/Language';
import VerifiedIcon from '@mui/icons-material/Verified';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import GroupIcon from '@mui/icons-material/Group';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BarChartIcon from '@mui/icons-material/BarChart';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// Interfaces
interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    title: string;
    bio: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    verified: boolean;
    joinDate: string;
    background?: string;
  };
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
  logo: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description?: string;
  logo: string;
}

interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  endorsements: number;
}

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiration?: string;
  credentialId: string;
  credentialUrl?: string;
  logo: string;
}

interface Course {
  id: string;
  title: string;
  progress: number; // 0-100
  thumbnail: string;
  instructor: string;
  lastAccessed: string;
}

interface Connection {
  id: string;
  name: string;
  title: string;
  avatar: string;
  mutualConnections: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Sample data (normally would come from props/API)
const educationData: Education[] = [
  {
    id: '1',
    institution: 'Stanford University',
    degree: 'Master of Science',
    field: 'Computer Science',
    startDate: '2018-09',
    endDate: '2020-06',
    description: 'Specialized in Artificial Intelligence and Machine Learning',
    logo: '/images/stanford.png',
  },
  {
    id: '2',
    institution: 'University of California, Berkeley',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startDate: '2014-09',
    endDate: '2018-05',
    logo: '/images/berkeley.png',
  },
];

const experienceData: Experience[] = [
  {
    id: '1',
    company: 'Google',
    position: 'Senior Software Engineer',
    startDate: '2021-01',
    endDate: null,
    description: 'Working on large-scale distributed systems and cloud infrastructure',
    logo: '/images/google.png',
  },
  {
    id: '2',
    company: 'Meta',
    position: 'Software Engineer',
    startDate: '2020-07',
    endDate: '2020-12',
    description: 'Developed full-stack applications using React and GraphQL',
    logo: '/images/meta.png',
  },
];

const skillsData: Skill[] = [
  { id: '1', name: 'React', level: 95, endorsements: 42 },
  { id: '2', name: 'TypeScript', level: 90, endorsements: 38 },
  { id: '3', name: 'Node.js', level: 85, endorsements: 31 },
  { id: '4', name: 'GraphQL', level: 80, endorsements: 25 },
  { id: '5', name: 'AWS', level: 75, endorsements: 22 },
  { id: '6', name: 'Python', level: 82, endorsements: 29 },
];

const certificatesData: Certificate[] = [
  {
    id: '1',
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    issueDate: '2022-03-15',
    expiration: '2025-03-15',
    credentialId: 'AWS-123456',
    credentialUrl: 'https://aws.amazon.com/certification/verify',
    logo: '/images/aws.png',
  },
  {
    id: '2',
    name: 'Professional Cloud Architect',
    issuer: 'Google Cloud',
    issueDate: '2021-11-10',
    expiration: '2024-11-10',
    credentialId: 'GCP-789012',
    credentialUrl: 'https://cloud.google.com/certification/cloud-architect',
    logo: '/images/gcp.png',
  },
];

const coursesData: Course[] = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    progress: 75,
    thumbnail: '/images/react-course.jpg',
    instructor: 'Dr. Jane Smith',
    lastAccessed: '2023-05-15',
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    progress: 50,
    thumbnail: '/images/ml-course.jpg',
    instructor: 'Prof. John Doe',
    lastAccessed: '2023-05-10',
  },
];

const connectionsData: Connection[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    title: 'Product Manager at Apple',
    avatar: '/images/alex.jpg',
    mutualConnections: 12,
  },
  {
    id: '2',
    name: 'Sophia Lee',
    title: 'Senior Developer at Microsoft',
    avatar: '/images/sophia.jpg',
    mutualConnections: 8,
  },
];

// Styled Components
const ProfileContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

const ProfileHeader = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: 0,
  overflow: 'hidden',
  borderRadius: 24,
  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.08)',
  marginBottom: theme.spacing(4),
  background: theme.palette.background.paper,
}));

const CoverPhoto = styled(Box)<{ backgroundImage?: string }>(({ theme, backgroundImage }) => ({
  height: 200,
  width: '100%',
  background: backgroundImage 
    ? `url(${backgroundImage}) no-repeat center center / cover`
    : `linear-gradient(120deg, ${alpha('#0077B5', 0.7)}, ${alpha('#5AC8FA', 0.7)})`,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: backgroundImage 
      ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)'
      : 'none',
    zIndex: 1,
  },
}));

const ProfileInfo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: -theme.spacing(7),
  position: 'relative',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
  marginTop: -theme.spacing(10),
  position: 'relative',
  zIndex: 2,
}));

const VerifiedBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 8,
  right: 8,
  zIndex: 3,
  background: '#34C759',
  borderRadius: '50%',
  padding: theme.spacing(0.5),
  border: `2px solid ${theme.palette.background.paper}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    color: 'white',
    fontSize: 18,
  },
}));

const ProfileTabs = styled(Tabs)(({ theme }) => ({
  marginTop: theme.spacing(4),
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: 3,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    minWidth: 100,
  },
}));

const ProfileTabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0),
}));

const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  overflow: 'visible',
  marginBottom: theme.spacing(3),
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -4,
    left: 0,
    width: 40,
    height: 3,
    borderRadius: 3,
    background: theme.palette.primary.main,
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: 10,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: alpha(theme.palette.primary.main, 0.1),
  marginRight: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

const Logo = styled('img')(({ theme }) => ({
  width: '70%',
  height: '70%',
  objectFit: 'contain',
}));

const ExperienceItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

const ExperienceContent = styled(Box)(({ theme }) => ({
  flex: 1,
}));

const ExpPosition = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
}));

const ExpCompany = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

const ExpDuration = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  '& svg': {
    fontSize: 16,
    marginRight: theme.spacing(0.5),
  },
}));

const SkillItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
}));

const SkillHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(0.5),
}));

const SkillName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
}));

const SkillEndorsement = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const SkillProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.7)} 100%)`,
  },
}));

const CertificateItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

const ContactLink = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
}));

const SocialLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

const BioText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
  lineHeight: 1.7,
}));

const CourseCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
}));

const CourseImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 140,
  objectFit: 'cover',
}));

const CourseProgressWrapper = styled(Box)(({ theme }) => ({
  padding: `0 ${theme.spacing(2)}`,
  marginTop: theme.spacing(-1.5),
  marginBottom: theme.spacing(1.5),
  position: 'relative',
  zIndex: 1,
}));

const CourseProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    background: `linear-gradient(90deg, #34C759 0%, #5AC8FA 100%)`,
  },
}));

const CourseContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  paddingTop: theme.spacing(1),
}));

const CourseTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '2.5em',
}));

// Add BoxGrid components
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

// After BoxGridItem definition, add ConnectionsGrid, ConnectionCard, and ConnectionAvatar

const ConnectionsGrid = styled(BoxGrid)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const ConnectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
}));

const ConnectionAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  marginRight: theme.spacing(2),
  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
}));

// TabPanel component
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <ProfileTabPanel>{children}</ProfileTabPanel>}
    </div>
  );
};

// User Profile Component
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Format date function
  const formatDate = (dateString: string, endDateString: string | null = null) => {
    const startDate = new Date(dateString);
    const startFormatted = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (!endDateString) {
      return `${startFormatted} - Present`;
    }
    
    const endDate = new Date(endDateString);
    const endFormatted = endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    return `${startFormatted} - ${endFormatted}`;
  };

  return (
    <ProfileContainer maxWidth="lg">
      <ProfileHeader>
        <CoverPhoto backgroundImage={user.background} />
        <ProfileInfo>
          <BoxGrid>
            <BoxGridItem xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Box sx={{ position: 'relative' }}>
                  <ProfileAvatar src={user.avatar} alt={user.name} />
                  {user.verified && (
                    <VerifiedBadge>
                      <VerifiedIcon />
                    </VerifiedBadge>
                  )}
                </Box>
                <Box sx={{ ml: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" fontWeight={700} sx={{ mr: 1 }}>
                      {user.name}
                    </Typography>
                    {user.verified && (
                      <Chip 
                        icon={<VerifiedIcon sx={{ color: '#34C759 !important' }} />} 
                        label="Verified Professional" 
                        size="small"
                        sx={{ 
                          bgcolor: alpha('#34C759', 0.1), 
                          color: '#34C759',
                          fontWeight: 600,
                          '& .MuiChip-icon': {
                            color: '#34C759',
                          }
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="h6" color="text.secondary" sx={{ mt: 0.5 }}>
                    {user.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'text.secondary' }}>
                    <LocationOnIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    <Typography variant="body2">{user.location}</Typography>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 16, my: 'auto' }} />
                    <CalendarTodayIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    <Typography variant="body2">Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Typography>
                  </Box>
                </Box>
              </Box>
              
              <BioText variant="body1" color="text.secondary">
                {user.bio}
              </BioText>
            </BoxGridItem>
            
            <BoxGridItem xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, mt: { xs: 3, md: 0 } }}>
              <ContactLink 
                variant="contained" 
                startIcon={<MailOutlineIcon />}
                sx={{ 
                  mb: 2, 
                  width: { xs: '100%', sm: 'auto' },
                  background: 'linear-gradient(90deg, #0077B5 0%, #5AC8FA 100%)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #006199 0%, #4BB8EA 100%)',
                  }
                }}
              >
                Connect
              </ContactLink>
              
              <ContactLink 
                variant="outlined" 
                startIcon={<EmailIcon />}
                sx={{ 
                  mb: 2,
                  width: { xs: '100%', sm: 'auto' } 
                }}
              >
                Message
              </ContactLink>
              
              <SocialLinks>
                {user.linkedin && (
                  <SocialButton aria-label="LinkedIn profile" size="large">
                    <LinkedInIcon color="primary" />
                  </SocialButton>
                )}
                {user.github && (
                  <SocialButton aria-label="GitHub profile" size="large">
                    <GitHubIcon color="primary" />
                  </SocialButton>
                )}
                {user.website && (
                  <SocialButton aria-label="Personal website" size="large">
                    <LanguageIcon color="primary" />
                  </SocialButton>
                )}
              </SocialLinks>
            </BoxGridItem>
          </BoxGrid>
          
          <ProfileTabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Experience" icon={<WorkIcon />} iconPosition="start" />
            <Tab label="Education" icon={<SchoolIcon />} iconPosition="start" />
            <Tab label="Skills" icon={<BarChartIcon />} iconPosition="start" />
            <Tab label="Certificates" icon={<VerifiedIcon />} iconPosition="start" />
            <Tab label="Courses" icon={<ImportContactsIcon />} iconPosition="start" />
            <Tab label="Connections" icon={<GroupIcon />} iconPosition="start" />
          </ProfileTabs>
        </ProfileInfo>
      </ProfileHeader>
      
      <TabPanel value={tabValue} index={0}>
        <SectionCard>
          <CardContent>
            <SectionHeader>
              <SectionTitle variant="h5">Work Experience</SectionTitle>
              <IconButton size="small" sx={{ borderRadius: 2, bgcolor: alpha('#0077B5', 0.1) }}>
                <EditIcon color="primary" fontSize="small" />
              </IconButton>
            </SectionHeader>
            
            {experienceData.map((exp) => (
              <ExperienceItem key={exp.id}>
                <LogoContainer>
                  <Logo src={exp.logo} alt={exp.company} />
                </LogoContainer>
                <ExperienceContent>
                  <ExpPosition variant="h6">{exp.position}</ExpPosition>
                  <ExpCompany variant="subtitle1">{exp.company}</ExpCompany>
                  <ExpDuration variant="body2">
                    <CalendarTodayIcon />
                    {formatDate(exp.startDate, exp.endDate)}
                  </ExpDuration>
                  {exp.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {exp.description}
                    </Typography>
                  )}
                </ExperienceContent>
              </ExperienceItem>
            ))}
          </CardContent>
        </SectionCard>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <SectionCard>
          <CardContent>
            <SectionHeader>
              <SectionTitle variant="h5">Education</SectionTitle>
              <IconButton size="small" sx={{ borderRadius: 2, bgcolor: alpha('#0077B5', 0.1) }}>
                <EditIcon color="primary" fontSize="small" />
              </IconButton>
            </SectionHeader>
            
            {educationData.map((edu) => (
              <ExperienceItem key={edu.id}>
                <LogoContainer>
                  <Logo src={edu.logo} alt={edu.institution} />
                </LogoContainer>
                <ExperienceContent>
                  <ExpPosition variant="h6">{edu.degree} in {edu.field}</ExpPosition>
                  <ExpCompany variant="subtitle1">{edu.institution}</ExpCompany>
                  <ExpDuration variant="body2">
                    <CalendarTodayIcon />
                    {formatDate(edu.startDate, edu.endDate)}
                  </ExpDuration>
                  {edu.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {edu.description}
                    </Typography>
                  )}
                </ExperienceContent>
              </ExperienceItem>
            ))}
          </CardContent>
        </SectionCard>
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <SectionCard>
          <CardContent>
            <SectionHeader>
              <SectionTitle variant="h5">Skills</SectionTitle>
              <IconButton size="small" sx={{ borderRadius: 2, bgcolor: alpha('#0077B5', 0.1) }}>
                <EditIcon color="primary" fontSize="small" />
              </IconButton>
            </SectionHeader>
            
            <BoxGrid>
              {skillsData.map((skill) => (
                <BoxGridItem xs={12} md={6} key={skill.id}>
                  <SkillItem>
                    <SkillHeader>
                      <SkillName variant="subtitle1">{skill.name}</SkillName>
                      <SkillEndorsement variant="body2">
                        {skill.endorsements} endorsements
                      </SkillEndorsement>
                    </SkillHeader>
                    <SkillProgress variant="determinate" value={skill.level} />
                  </SkillItem>
                </BoxGridItem>
              ))}
            </BoxGrid>
          </CardContent>
        </SectionCard>
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <SectionCard>
          <CardContent>
            <SectionHeader>
              <SectionTitle variant="h5">Certificates</SectionTitle>
              <IconButton size="small" sx={{ borderRadius: 2, bgcolor: alpha('#0077B5', 0.1) }}>
                <EditIcon color="primary" fontSize="small" />
              </IconButton>
            </SectionHeader>
            
            {certificatesData.map((cert) => (
              <CertificateItem key={cert.id}>
                <LogoContainer>
                  <Logo src={cert.logo} alt={cert.issuer} />
                </LogoContainer>
                <ExperienceContent>
                  <ExpPosition variant="h6">{cert.name}</ExpPosition>
                  <ExpCompany variant="subtitle1">{cert.issuer}</ExpCompany>
                  <ExpDuration variant="body2">
                    <CalendarTodayIcon />
                    Issued {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {cert.expiration && ` · Expires ${new Date(cert.expiration).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                  </ExpDuration>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Credential ID: {cert.credentialId}
                    {cert.credentialUrl && (
                      <Button 
                        variant="text" 
                        size="small" 
                        sx={{ ml: 1, textTransform: 'none', fontWeight: 600 }}
                        href={cert.credentialUrl}
                        target="_blank"
                      >
                        Verify
                      </Button>
                    )}
                  </Typography>
                </ExperienceContent>
              </CertificateItem>
            ))}
          </CardContent>
        </SectionCard>
      </TabPanel>
      
      <TabPanel value={tabValue} index={4}>
        <SectionCard>
          <CardContent>
            <SectionHeader>
              <SectionTitle variant="h5">My Courses</SectionTitle>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                View All
              </Button>
            </SectionHeader>
            
            <BoxGrid>
              {coursesData.map((course) => (
                <BoxGridItem xs={12} sm={6} key={course.id}>
                  <CourseCard>
                    <CourseImage src={course.thumbnail} alt={course.title} />
                    <CourseProgressWrapper>
                      <CourseProgress variant="determinate" value={course.progress} />
                    </CourseProgressWrapper>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} noWrap>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Instructor: {course.instructor}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Last accessed: {course.lastAccessed}
                        </Typography>
                        <Button size="small" sx={{ minWidth: 0, p: 0.5 }}>
                          <PlayArrowIcon fontSize="small" />
                        </Button>
                      </Box>
                    </Box>
                  </CourseCard>
                </BoxGridItem>
              ))}
            </BoxGrid>
          </CardContent>
        </SectionCard>
      </TabPanel>
      
      <TabPanel value={tabValue} index={5}>
        <SectionCard>
          <CardContent>
            <SectionHeader>
              <SectionTitle variant="h5">Connections</SectionTitle>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                View All
              </Button>
            </SectionHeader>
            
            <ConnectionsGrid>
              {connectionsData.map((connection) => (
                <BoxGridItem xs={12} sm={6} key={connection.id}>
                  <ConnectionCard>
                    <ConnectionAvatar src={connection.avatar} alt={connection.name} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {connection.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {connection.title}
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ mt: 0.5, fontWeight: 500 }}>
                        {connection.mutualConnections} mutual connections
                      </Typography>
                    </Box>
                  </ConnectionCard>
                </BoxGridItem>
              ))}
            </ConnectionsGrid>
          </CardContent>
        </SectionCard>
      </TabPanel>
    </ProfileContainer>
  );
};

export default UserProfile; 