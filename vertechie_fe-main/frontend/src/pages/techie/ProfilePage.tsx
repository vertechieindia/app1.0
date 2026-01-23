/**
 * ProfilePage - Unique Tech-Focused User Profile
 * Modern bento-grid design with glassmorphism effects
 * Distinctly different from traditional social platforms
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../../config/api';
import { fetchWithAuth, handleUnauthorized } from '../../utils/apiInterceptor';
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
  InputAdornment,
  SelectChangeEvent,
  Checkbox,
  FormControlLabel,
  Slider,
  CircularProgress,
  Link,
} from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import axios from 'axios';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
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
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkIcon from '@mui/icons-material/Link';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';

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

// Styled Components - Light Theme
const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
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
      radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.04) 0%, transparent 70%)
    `,
    pointerEvents: 'none',
  },
});

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: 24,
  border: '1px solid rgba(0, 0, 0, 0.06)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
  '&:hover': {
    border: '1px solid rgba(99, 102, 241, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
}));

const ProfileAvatar = styled(Avatar)({
  width: 140,
  height: 140,
  border: '4px solid rgba(99, 102, 241, 0.5)',
  boxShadow: '0 0 40px rgba(99, 102, 241, 0.25)',
  animation: `${glow} 3s ease-in-out infinite`,
  fontSize: '3rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
});

const StatCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.8)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(99, 102, 241, 0.08)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
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
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  fontSize: 24,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  '&:hover': {
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
  },
});

const GradientText = styled(Typography)({
  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c026d3 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
});

const ExperienceCard = styled(Box)({
  padding: 20,
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  position: 'relative',
  marginLeft: 24,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
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
    border: '3px solid #f8fafc',
  },
});

// Interface definitions for API data
interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  username?: string;
  vertechie_id?: string;
  phone?: string;
  mobile_number?: string;
  dob?: string;
  country?: string;
  address?: string;
  is_active: boolean;
  is_verified: boolean;
  is_superuser: boolean;
  created_at: string;
}

interface UserProfileData {
  id: string;
  user_id: string;
  bio?: string;
  headline?: string;
  location?: string;
  website?: string;
  github_url?: string;
  gitlab_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  skills?: string[];
  profile_photo?: string;
  current_company?: string;
  current_position?: string;
}

interface ExperienceData {
  id: string;
  user_id: string;
  title: string;
  company?: string;
  company_name?: string; // Backend returns company_name
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  skills?: string[];
}

interface EducationData {
  id: string;
  user_id: string;
  institution: string;
  school_name?: string; // Backend returns school_name
  degree: string;
  field_of_study?: string;
  start_year: number;
  end_year?: number;
  gpa?: string;
  grade?: string;
  description?: string;
}

// Company data for HR users
interface CompanyData {
  id: string;
  name: string;
  website?: string;
  email?: string;
  description?: string;
  industry?: string;
  headquarters?: string;
  logo_url?: string;
  company_size?: string;
  founded_year?: number;
  school_name?: string;
}

// Skill with rating interface
interface SkillWithRating {
  name: string;
  experience: string;
  rating: number;
}

// Extended Experience Form Data (matching signup flow)
interface ExperienceFormData {
  company: string;
  companyName: string;
  clientName: string;
  website: string;
  workLocation: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  skills: SkillWithRating[];
  description: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  managerLinkedIn: string;
}

// Company Invite Data
interface CompanyInviteData {
  companyName: string;
  address: string;
  emails: string[];
  phoneNumbers: string[];
  website: string;
  contactPersonName: string;
  contactPersonRole: string;
}

// Validation utilities
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

const isValidLinkedInUrl = (url: string): boolean => {
  return url.toLowerCase().includes('linkedin.com/in/');
};

const isValidDateRange = (start: string, end: string): boolean => {
  return new Date(start) <= new Date(end);
};

const isValidGPA = (gpa: string): boolean => {
  const numGpa = parseFloat(gpa);
  if (isNaN(numGpa)) return false;
  // Accept GPA on 0-4 scale or 0-10 scale
  return numGpa >= 0 && numGpa <= 10;
};

// Main Component
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editExperienceOpen, setEditExperienceOpen] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [editEducationOpen, setEditEducationOpen] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [editSkillsOpen, setEditSkillsOpen] = useState(false);
  const [editableSkills, setEditableSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    url: '',
    technologies: '',
    image: '',
  });
  const [projects, setProjects] = useState<Array<{
    id: string;
    name: string;
    description: string;
    link: string;
    technologies: string[];
    image: string;
  }>>([]);
  const [copied, setCopied] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [loading, setLoading] = useState(true);
  
  // Experience Warning and Form Dialogs
  const [showExperienceWarning, setShowExperienceWarning] = useState(false);
  const [isSavingExperience, setIsSavingExperience] = useState(false);
  const [experienceErrors, setExperienceErrors] = useState<Record<string, string>>({});
  
  // Skills dialog state
  const [showSkillDialog, setShowSkillDialog] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<SkillWithRating>({ name: '', experience: '', rating: 5 });
  
  // Job description warning state
  const [showJobDescWarning, setShowJobDescWarning] = useState(false);
  const [jobDescAcknowledged, setJobDescAcknowledged] = useState(false);
  
  // Company invite state
  const [showCompanyInvite, setShowCompanyInvite] = useState(false);
  const [companyInvite, setCompanyInvite] = useState<CompanyInviteData>({
    companyName: '',
    address: '',
    emails: [''],
    phoneNumbers: [''],
    website: '',
    contactPersonName: '',
    contactPersonRole: '',
  });
  const [companySearchResults] = useState<Array<{id: string, name: string}>>([]);
  
  // New Experience Form State (Extended)
  const [newExperience, setNewExperience] = useState<ExperienceFormData>({
    company: '',
    companyName: '',
    clientName: '',
    website: '',
    workLocation: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    skills: [],
    description: '',
    managerName: '',
    managerEmail: '',
    managerPhone: '',
    managerLinkedIn: '',
  });
  
  // Education form states
  const [isSavingEducation, setIsSavingEducation] = useState(false);
  const [educationErrors, setEducationErrors] = useState<Record<string, string>>({});
  
  // New Education Form State (matching signup flow)
  const [newEducation, setNewEducation] = useState({
    institution: '',
    levelOfEducation: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    gpa: '',
  });
  
  // Real user data from API
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [educations, setEducations] = useState<EducationData[]>([]);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);

  // Fetch user data from API
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch fresh user data from API first
      try {
        const userUrl = getApiUrl('/users/me');
        const userRes = await fetchWithAuth(userUrl);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser({
            id: userData.id,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            middle_name: userData.middle_name,
            username: userData.username,
            vertechie_id: userData.vertechie_id,
            phone: userData.phone,
            mobile_number: userData.mobile_number,
            dob: userData.dob,
            country: userData.country,
            address: userData.address,
            is_active: userData.is_active,
            is_verified: userData.is_verified,
            is_superuser: userData.is_superuser,
            created_at: userData.created_at || userData.date_joined,
          });
          // Update localStorage with fresh data
          const stored = localStorage.getItem('userData');
          if (stored) {
            const merged = { ...JSON.parse(stored), ...userData };
            localStorage.setItem('userData', JSON.stringify(merged));
          }
        }
      } catch (err: any) {
        // Fallback to localStorage if API fails
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          setUser({
            id: parsedUser.id,
            email: parsedUser.email,
            first_name: parsedUser.first_name,
            last_name: parsedUser.last_name,
            middle_name: parsedUser.middle_name,
            username: parsedUser.username,
            vertechie_id: parsedUser.vertechie_id,
            phone: parsedUser.phone,
            mobile_number: parsedUser.mobile_number,
            dob: parsedUser.dob,
            country: parsedUser.country,
            address: parsedUser.address,
            is_active: parsedUser.is_active,
            is_verified: parsedUser.is_verified,
            is_superuser: parsedUser.is_superuser,
            created_at: parsedUser.created_at || parsedUser.date_joined,
          });
        }
        if (err.message?.includes('Session expired')) return;
        console.warn('Could not fetch user from API, using localStorage:', err);
      }

      // Fetch profile data - uses interceptor for 401 handling
      try {
        const profileUrl = getApiUrl('/users/me/profile');
        const profileRes = await fetchWithAuth(profileUrl);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }
      } catch (err: any) {
        if (err.message?.includes('Session expired')) return; // Already redirecting
        console.warn('Could not fetch profile:', err);
      }

      // Fetch experiences - uses interceptor for 401 handling
      try {
        const expUrl = getApiUrl('/users/me/experiences');
        const expRes = await fetchWithAuth(expUrl);
        if (expRes.ok) {
          const expData = await expRes.json();
          // Map backend field names to frontend field names
          const mappedExperiences = expData.map((exp: any) => ({
            ...exp,
            company: exp.company_name || exp.company || '',
          }));
          setExperiences(mappedExperiences);
        }
      } catch (err: any) {
        if (err.message?.includes('Session expired')) return; // Already redirecting
        console.warn('Could not fetch experiences:', err);
      }

      // Fetch educations - uses interceptor for 401 handling
      try {
        const eduUrl = getApiUrl('/users/me/educations');
        const eduRes = await fetchWithAuth(eduUrl);
        if (eduRes.ok) {
          const eduData = await eduRes.json();
          // Map backend field names to frontend field names
          const mappedEducations = eduData.map((edu: any) => ({
            ...edu,
            institution: edu.school_name || edu.institution || '',
            gpa: edu.grade || edu.gpa || '',
          }));
          setEducations(mappedEducations);
        }
      } catch (err: any) {
        if (err.message?.includes('Session expired')) return; // Already redirecting
        console.warn('Could not fetch educations:', err);
      }

      // Fetch company details for HR users
      try {
        const companyUrl = getApiUrl('/users/me/company');
        const companyRes = await fetchWithAuth(companyUrl);
        if (companyRes.ok) {
          const compData = await companyRes.json();
          if (compData) {
            setCompanyData(compData);
          }
        }
      } catch (err: any) {
        if (err.message?.includes('Session expired')) return;
        console.warn('Could not fetch company:', err);
      }

    } catch (error: any) {
      if (error.message?.includes('Session expired')) return; // Already redirecting
      console.error('Error fetching user data:', error);
      setSnackbar({ open: true, message: 'Failed to load profile data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    setIsOwnProfile(!userId || userId === 'me' || userId === user?.id);
  }, [userId, user?.id]);

  // Check if user is a Hiring Manager
  const storedData = localStorage.getItem('userData');
  const parsedStored = storedData ? JSON.parse(storedData) : {};
  const userRoles = parsedStored.roles || parsedStored.groups || [];
  const isHiringManager = userRoles.some((r: any) => 
    r.role_type === 'hiring_manager' || 
    r.role_type === 'HIRING_MANAGER' ||
    r.name?.toLowerCase() === 'hiring_manager' || 
    r.name?.toLowerCase() === 'hr'
  ) || !!companyData;

  // Derived data for display
  const displayUser = {
    id: user?.id || '',
    username: user?.username || user?.email?.split('@')[0] || 'user',
    vertechieId: user?.vertechie_id || '',
    firstName: user?.first_name || 'User',
    lastName: user?.last_name || '',
    title: profile?.headline || profile?.current_position || (isHiringManager ? 'Hiring Manager' : 'Tech Professional'),
    tagline: profile?.bio || (isHiringManager 
      ? `${profile?.current_company ? `@ ${profile.current_company}` : 'Finding great talent'} 💼`
      : 'Building amazing things with code 🚀'),
    location: profile?.location || user?.country || 'Location not set',
    email: user?.email || '',
    isVerified: user?.is_verified || false,
    level: 1, // TODO: Calculate from activity
    xp: 0, // TODO: Calculate from activity
    rank: 'Bronze',
    joinedDate: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently',
    website: profile?.website || '',
    github: profile?.github_url?.replace('https://github.com/', '') || '',
    currentCompany: profile?.current_company || '',
    currentPosition: profile?.current_position || '',
    isHiringManager,
  };

  const stats = [
    { label: 'Problems', value: 0, icon: '🧩', color: '#10b981' },
    { label: 'Commits', value: '0', icon: '📦', color: '#3b82f6' },
    { label: 'Streak', value: 0, icon: '🔥', color: '#f59e0b' },
    { label: 'Rank', value: '-', icon: '🏆', color: '#a855f7' },
  ];

  // Parse skills from profile
  const skills = (profile?.skills || []).map((skillName, idx) => ({
    name: skillName,
    level: Math.min(4, Math.floor(idx / 2) + 1), // Assign levels based on order
    logo: getTechByName(skillName)?.logo,
  }));

  // Format experience data - handle both backend field names (company_name) and frontend field names (company)
  const experience = experiences.map(exp => ({
    id: exp.id,
    title: exp.title,
    company: exp.company || exp.company_name || '',
    period: `${new Date(exp.start_date).getFullYear()} - ${exp.is_current ? 'Present' : (exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present')}`,
    tech: exp.skills || [],
    description: exp.description,
  }));

  // Format education data - handle both backend field names (school_name/grade) and frontend field names (institution/gpa)
  const education = educations.map(edu => ({
    id: edu.id,
    degree: `${edu.degree}${edu.field_of_study ? ` in ${edu.field_of_study}` : ''}`,
    institution: edu.institution || edu.school_name || '',
    period: `${edu.start_year} - ${edu.end_year || 'Present'}`,
    gpa: edu.gpa || edu.grade || '',
  }));

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('userProjects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.warn('Could not parse saved projects');
      }
    }
  }, []);

  // User's tech stack from skills
  const techStack = (profile?.skills || [])
    .map(skill => getTechByName(skill))
    .filter(Boolean) as TechLogo[];

  const handleCopyLink = () => {
    const profileUrl = displayUser.vertechieId 
      ? `vertechie.com/${displayUser.vertechieId}` 
      : `vertechie.com/u/${displayUser.username}`;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle add experience click - show warning first
  const handleAddExperienceClick = useCallback(() => {
    setShowExperienceWarning(true);
  }, []);

  // Handle warning accept - proceed to form
  const handleWarningAccept = useCallback(() => {
    setShowExperienceWarning(false);
    setEditExperienceOpen(true);
  }, []);

  // Reset experience form
  const resetExperienceForm = useCallback(() => {
    setNewExperience({
      company: '',
      companyName: '',
      clientName: '',
      website: '',
      workLocation: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      skills: [],
      description: '',
      managerName: '',
      managerEmail: '',
      managerPhone: '',
      managerLinkedIn: '',
    });
    setExperienceErrors({});
    setJobDescAcknowledged(false);
    setIsSavingExperience(false);
  }, []);

  // Handle experience form close
  const handleExperienceFormClose = useCallback(() => {
    setEditExperienceOpen(false);
    setEditingExperienceId(null);
    resetExperienceForm();
  }, [resetExperienceForm]);

  // Handle current toggle
  const handleCurrentToggle = useCallback((checked: boolean) => {
    setNewExperience((prev) => ({
      ...prev,
      current: checked,
      endDate: checked ? '' : prev.endDate,
    }));
    // Clear endDate error when current working is enabled
    if (checked && experienceErrors.endDate) {
      const newErrors = { ...experienceErrors };
      delete newErrors.endDate;
      setExperienceErrors(newErrors);
    }
  }, [experienceErrors]);

  // Save new experience
  const handleSaveExperience = async () => {
    // Clear previous errors
    const validationErrors: Record<string, string> = {};

    // Validate required fields
    if (!newExperience.clientName || !newExperience.clientName.trim()) {
      validationErrors.clientName = 'Name is required';
    } else if (newExperience.clientName.trim().length < 2) {
      validationErrors.clientName = 'Name must be at least 2 characters';
    }

    if (!newExperience.companyName || !newExperience.companyName.trim()) {
      validationErrors.companyName = 'Company Name is required';
    } else if (newExperience.companyName.trim().length < 2) {
      validationErrors.companyName = 'Company Name must be at least 2 characters';
    }

    // Validate website URL
    if (!newExperience.website || !newExperience.website.trim()) {
      validationErrors.website = 'Website is required';
    } else if (!isValidUrl(newExperience.website.trim())) {
      validationErrors.website = 'Please enter a valid website URL (e.g., https://www.example.com)';
    }

    // Validate job title
    if (!newExperience.position || !newExperience.position.trim()) {
      validationErrors.position = 'Job Title is required';
    } else if (newExperience.position.trim().length < 2) {
      validationErrors.position = 'Job Title must be at least 2 characters';
    }

    // Validate dates
    if (!newExperience.startDate) {
      validationErrors.startDate = 'Start Date is required';
    }

    // Only validate endDate if NOT currently working
    if (!newExperience.current) {
      if (!newExperience.endDate || !newExperience.endDate.trim()) {
        validationErrors.endDate = 'End Date is required when not currently working';
      } else if (newExperience.startDate) {
        if (!isValidDateRange(newExperience.startDate, newExperience.endDate)) {
          validationErrors.endDate = 'End Date must be after or equal to Start Date';
        }
      }
    }

    // Validate job description
    if (!newExperience.description || !newExperience.description.trim()) {
      validationErrors.description = 'Job Description is required';
    } else if (newExperience.description.trim().length < 20) {
      validationErrors.description = 'Job Description must be at least 20 characters';
    }

    // Validate manager name (required)
    if (!newExperience.managerName || !newExperience.managerName.trim()) {
      validationErrors.managerName = 'Manager Name is required';
    } else if (newExperience.managerName.trim().length < 2) {
      validationErrors.managerName = 'Manager Name must be at least 2 characters';
    }

    // Validate manager email (required)
    if (!newExperience.managerEmail || !newExperience.managerEmail.trim()) {
      validationErrors.managerEmail = 'Manager Email is required';
    } else if (!isValidEmail(newExperience.managerEmail.trim())) {
      validationErrors.managerEmail = 'Please enter a valid email address';
    }

    // Validate manager phone (required)
    if (!newExperience.managerPhone || !newExperience.managerPhone.trim()) {
      validationErrors.managerPhone = 'Manager Phone Number is required';
    } else {
      const phoneDigits = newExperience.managerPhone.trim().replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        validationErrors.managerPhone = 'Phone number must be exactly 10 digits';
      } else if (!isValidPhone(newExperience.managerPhone.trim())) {
        validationErrors.managerPhone = 'Please enter a valid phone number';
      }
    }

    // Validate manager LinkedIn (required)
    if (!newExperience.managerLinkedIn || !newExperience.managerLinkedIn.trim()) {
      validationErrors.managerLinkedIn = 'Manager LinkedIn URL is required';
    } else if (!isValidLinkedInUrl(newExperience.managerLinkedIn.trim())) {
      validationErrors.managerLinkedIn = 'Please enter a valid LinkedIn URL (e.g., https://www.linkedin.com/in/username)';
    }

    // If there are validation errors, display them
    if (Object.keys(validationErrors).length > 0) {
      setExperienceErrors(validationErrors);
      setIsSavingExperience(false);
      return;
    }

    setIsSavingExperience(true);
    setExperienceErrors({});

    try {
      const isEditing = !!editingExperienceId;
      const url = isEditing 
        ? getApiUrl(`/users/me/experiences/${editingExperienceId}`)
        : getApiUrl('/users/me/experiences');
      
      // Ensure start_date is a valid date string in YYYY-MM-DD format
      let formattedStartDate = newExperience.startDate;
      if (!formattedStartDate || formattedStartDate.trim() === '') {
        formattedStartDate = new Date().toISOString().split('T')[0];
      } else if (!formattedStartDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Try to parse and format the date
        const parsedDate = new Date(formattedStartDate);
        if (!isNaN(parsedDate.getTime())) {
          formattedStartDate = parsedDate.toISOString().split('T')[0];
        } else {
          formattedStartDate = new Date().toISOString().split('T')[0];
        }
      }

      // Format end_date properly
      let formattedEndDate = null;
      if (!newExperience.current && newExperience.endDate && newExperience.endDate.trim() !== '') {
        if (newExperience.endDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          formattedEndDate = newExperience.endDate;
        } else {
          const parsedDate = new Date(newExperience.endDate);
          if (!isNaN(parsedDate.getTime())) {
            formattedEndDate = parsedDate.toISOString().split('T')[0];
          }
        }
      }

      // Skills should be an array of strings (skill names only), not objects
      const skillNames = (newExperience.skills || []).map((s: any) => 
        typeof s === 'string' ? s : (s.name || s)
      );

      const response = await fetchWithAuth(url, {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify({
          title: newExperience.position.trim(),
          company_name: newExperience.companyName.trim(),
          location: newExperience.workLocation?.trim() || null,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          is_current: newExperience.current || false,
          description: newExperience.description?.trim() || null,
          skills: skillNames,
        }),
      });
      
      if (response.ok) {
        setSnackbar({ open: true, message: isEditing ? 'Experience updated successfully!' : 'Experience added successfully!', severity: 'success' });
        setEditingExperienceId(null);
        handleExperienceFormClose();
        fetchUserData(); // Refresh data
      } else {
        const error = await response.json();
        setExperienceErrors({ submit: error.detail || `Failed to ${isEditing ? 'update' : 'add'} experience` });
      }
    } catch (err: any) {
      if (err.message?.includes('Session expired')) return; // Already redirecting
      console.error('Error saving experience:', err);
      setExperienceErrors({ submit: 'Failed to save experience. Please try again.' });
    } finally {
      setIsSavingExperience(false);
    }
  };

  // Send company invite
  const handleSendCompanyInvite = async () => {
    try {
      const response = await fetchWithAuth(getApiUrl('/company-invites'), {
        method: 'POST',
        body: JSON.stringify({
          company_name: companyInvite.companyName,
          address: companyInvite.address,
          emails: companyInvite.emails.filter(e => e.trim()),
          phone_numbers: companyInvite.phoneNumbers.filter(p => p.trim()),
          website: companyInvite.website,
          contact_person_name: companyInvite.contactPersonName,
          contact_person_role: companyInvite.contactPersonRole,
        }),
      });
      if (response.ok) {
        setShowCompanyInvite(false);
        setSnackbar({ open: true, message: 'Company invite sent successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to send company invite', severity: 'error' });
      }
    } catch (error: any) {
      if (error.message?.includes('Session expired')) return; // Already redirecting
      console.error('Error sending company invite:', error);
      setSnackbar({ open: true, message: 'Failed to send company invite', severity: 'error' });
    }
  };

  // Reset education form
  const resetEducationForm = useCallback(() => {
    setNewEducation({
      institution: '',
      levelOfEducation: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: '',
    });
    setEducationErrors({});
    setIsSavingEducation(false);
  }, []);

  // Handle education form close
  const handleEducationFormClose = useCallback(() => {
    setEditEducationOpen(false);
    setEditingEducationId(null);
    resetEducationForm();
  }, [resetEducationForm]);

  // Save new education
  const handleSaveEducation = async () => {
    // Clear previous errors
    const validationErrors: Record<string, string> = {};

    // Validate required fields
    if (!newEducation.institution || !newEducation.institution.trim()) {
      validationErrors.institution = 'Institution Name is required';
    } else if (newEducation.institution.trim().length < 2) {
      validationErrors.institution = 'Institution Name must be at least 2 characters';
    }

    if (!newEducation.levelOfEducation || !newEducation.levelOfEducation.trim()) {
      validationErrors.levelOfEducation = 'Level of Education is required';
    }

    if (!newEducation.fieldOfStudy || !newEducation.fieldOfStudy.trim()) {
      validationErrors.fieldOfStudy = 'Field of Study is required';
    } else if (newEducation.fieldOfStudy.trim().length < 2) {
      validationErrors.fieldOfStudy = 'Field of Study must be at least 2 characters';
    }

    // Validate dates
    if (!newEducation.startDate) {
      validationErrors.startDate = 'Start Date is required';
    }

    if (!newEducation.endDate) {
      validationErrors.endDate = 'End Date is required';
    }

    // Validate date range
    if (newEducation.startDate && newEducation.endDate) {
      if (!isValidDateRange(newEducation.startDate, newEducation.endDate)) {
        validationErrors.endDate = 'End Date must be after or equal to Start Date';
      }
    }

    // Validate GPA (if provided)
    if (newEducation.gpa && newEducation.gpa.trim()) {
      if (!isValidGPA(newEducation.gpa.trim())) {
        validationErrors.gpa = 'Please enter a valid GPA (0-4 or 0-10 scale)';
      }
    }

    // If there are validation errors, display them
    if (Object.keys(validationErrors).length > 0) {
      setEducationErrors(validationErrors);
      setIsSavingEducation(false);
      return;
    }

    setIsSavingEducation(true);
    setEducationErrors({});
    
    try {
      const isEditing = !!editingEducationId;
      const url = isEditing 
        ? getApiUrl(`/users/me/educations/${editingEducationId}`)
        : getApiUrl('/users/me/educations');
      
      // Parse start_year safely - ensure it's a valid integer or null
      let startYear: number | null = null;
      if (newEducation.startDate && newEducation.startDate.trim() !== '') {
        const parsedDate = new Date(newEducation.startDate);
        if (!isNaN(parsedDate.getTime())) {
          startYear = parsedDate.getFullYear();
        } else {
          // Try to extract year directly if date parsing fails
          const yearMatch = newEducation.startDate.match(/\d{4}/);
          if (yearMatch) {
            startYear = parseInt(yearMatch[0], 10);
          }
        }
      }
      // Default to current year if no valid start year
      if (startYear === null || isNaN(startYear)) {
        startYear = new Date().getFullYear();
      }

      // Parse end_year safely - ensure it's a valid integer or null
      let endYear: number | null = null;
      if (newEducation.endDate && newEducation.endDate.trim() !== '') {
        const parsedDate = new Date(newEducation.endDate);
        if (!isNaN(parsedDate.getTime())) {
          endYear = parsedDate.getFullYear();
        } else {
          // Try to extract year directly if date parsing fails
          const yearMatch = newEducation.endDate.match(/\d{4}/);
          if (yearMatch) {
            endYear = parseInt(yearMatch[0], 10);
          }
        }
      }

      const response = await fetchWithAuth(url, {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify({
          school_name: newEducation.institution.trim(),
          degree: newEducation.levelOfEducation.trim() || null,
          field_of_study: newEducation.fieldOfStudy.trim() || null,
          start_year: startYear,
          end_year: endYear,
          grade: newEducation.gpa.trim() || null,
          description: null,
        }),
      });
      
      if (response.ok) {
        setSnackbar({ open: true, message: isEditing ? 'Education updated successfully!' : 'Education added successfully!', severity: 'success' });
        setEditingEducationId(null);
        handleEducationFormClose();
        fetchUserData(); // Refresh data
      } else {
        const error = await response.json();
        setEducationErrors({ submit: error.detail || `Failed to ${isEditing ? 'update' : 'add'} education` });
      }
    } catch (err: any) {
      if (err.message?.includes('Session expired')) return; // Already redirecting
      console.error('Error saving education:', err);
      setEducationErrors({ submit: 'Failed to save education. Please try again.' });
    } finally {
      setIsSavingEducation(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <PageContainer>
        <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              borderRadius: '50%',
              border: '3px solid rgba(99, 102, 241, 0.3)',
              borderTopColor: '#6366f1',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }} />
            <Typography variant="h6" sx={{ color: 'rgba(0,0,0,0.7)' }}>
              Loading profile...
            </Typography>
          </Box>
        </Container>
      </PageContainer>
    );
  }

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
                      color: '#1e293b',
                    }}>
                      {displayUser.level}
                    </Box>
                  }
                >
                  <ProfileAvatar>
                    {displayUser.firstName[0]}{displayUser.lastName?.[0] || ''}
                  </ProfileAvatar>
                </Badge>
                
                <Box sx={{ flex: 1, minWidth: 280 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <GradientText variant="h3">
                      {displayUser.firstName} {displayUser.lastName}
                    </GradientText>
                    {displayUser.isVerified && (
                      <VerifiedIcon sx={{ color: '#6366f1', fontSize: 28 }} />
                    )}
                    <Chip 
                      label={getLevelTitle(displayUser.level)}
                      size="small"
                      sx={{ 
                        ml: 1,
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        color: '#1e293b',
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  
                  <Typography variant="h6" sx={{ color: 'rgba(0,0,0,0.7)', mb: 1, fontWeight: 500 }}>
                    {displayUser.title}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.5)', mb: 2 }}>
                    {displayUser.tagline}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(0,0,0,0.5)' }}>
                      <LocationOnIcon sx={{ fontSize: 18 }} />
                      <Typography variant="body2">{displayUser.location}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(0,0,0,0.5)' }}>
                      <RocketLaunchIcon sx={{ fontSize: 18 }} />
                      <Typography variant="body2">Joined {displayUser.joinedDate}</Typography>
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
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                }}>
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)', fontFamily: 'monospace' }}>
                    {displayUser.vertechieId 
                      ? `vertechie.com/${displayUser.vertechieId}` 
                      : `vertechie.com/u/${displayUser.username}`}
                  </Typography>
                  <IconButton size="small" onClick={handleCopyLink} sx={{ color: copied ? '#10b981' : 'rgba(255,255,255,0.5)' }}>
                    {copied ? <VerifiedIcon /> : <ContentCopyIcon />}
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {displayUser.github && (
                    <IconButton 
                      onClick={() => window.open(`https://github.com/${displayUser.github}`, '_blank')}
                      sx={{ color: 'rgba(0,0,0,0.7)', '&:hover': { color: '#1e293b' } }}
                    >
                      <GitHubIcon />
                    </IconButton>
                  )}
                  {displayUser.website && (
                    <IconButton 
                      onClick={() => window.open(displayUser.website, '_blank')}
                      sx={{ color: 'rgba(0,0,0,0.7)', '&:hover': { color: '#1e293b' } }}
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
                        color: '#1e293b',
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
              <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)' }}>
                Level {displayUser.level} → Level {displayUser.level + 1}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600 }}>
                {displayUser.xp.toLocaleString()} XP
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={65} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: 'rgba(0,0,0,0.06)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
                  borderRadius: 4,
                },
              }}
            />
            <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.4)', mt: 0.5, display: 'block' }}>
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
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)' }}>
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
                  <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 700 }}>
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
                  <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 700 }}>
                    Skills & Expertise
                  </Typography>
                </Box>
                {isOwnProfile && (
                  <IconButton 
                    size="small" 
                    onClick={() => {
                      setEditableSkills(profile?.skills || []);
                      setEditSkillsOpen(true);
                    }} 
                    sx={{ color: 'rgba(0,0,0,0.5)' }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              {skills.length > 0 ? (
                <>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {skills.map((skill) => (
                      <SkillBadge key={skill.name} level={skill.level}>
                        {skill.logo && (
                          <img 
                            src={skill.logo} 
                            alt={skill.name} 
                            style={{ width: 18, height: 18, objectFit: 'contain' }} 
                          />
                        )}
                        {skill.name}
                      </SkillBadge>
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.4)', mt: 2, display: 'block' }}>
                    Skill levels: 🟢 Beginner → 🔵 Intermediate → 🟣 Advanced → 🟡 Expert → 🔴 Master
                  </Typography>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <DataObjectIcon sx={{ fontSize: 48, color: 'rgba(0,0,0,0.2)', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.4)' }}>
                    No skills added yet
                  </Typography>
                  {isOwnProfile && (
                    <Button 
                      size="small" 
                      onClick={() => {
                        setEditableSkills([]);
                        setEditSkillsOpen(true);
                      }}
                      sx={{ mt: 1, color: '#6366f1', textTransform: 'none' }}
                    >
                      Add your skills
                    </Button>
                  )}
                </Box>
              )}
            </GlassCard>

            {/* Company Details - For HR/Hiring Manager users */}
            {(isHiringManager || companyData) && (
              <GlassCard sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <BusinessIcon sx={{ color: '#6366f1' }} />
                  <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 700 }}>
                    Company Details
                  </Typography>
                </Box>
                
                {companyData ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Company Name */}
                    <Box sx={{ 
                      p: 2.5, 
                      bgcolor: 'rgba(99, 102, 241, 0.05)', 
                      borderRadius: 2,
                      border: '1px solid rgba(99, 102, 241, 0.1)'
                    }}>
                      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Company Name
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
                        {companyData.name}
                      </Typography>
                    </Box>

                    {/* Company Website */}
                    {companyData.website && (
                      <Box sx={{ 
                        p: 2.5, 
                        bgcolor: 'rgba(99, 102, 241, 0.05)', 
                        borderRadius: 2,
                        border: '1px solid rgba(99, 102, 241, 0.1)'
                      }}>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Website
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LanguageOutlinedIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                          <Link 
                            href={companyData.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            sx={{ color: '#6366f1', fontWeight: 500, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                          >
                            {companyData.website}
                          </Link>
                        </Box>
                      </Box>
                    )}

                    {/* Company Email */}
                    {companyData.email && (
                      <Box sx={{ 
                        p: 2.5, 
                        bgcolor: 'rgba(99, 102, 241, 0.05)', 
                        borderRadius: 2,
                        border: '1px solid rgba(99, 102, 241, 0.1)'
                      }}>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Company Email
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailOutlinedIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                          <Typography sx={{ color: '#1e293b', fontWeight: 500 }}>
                            {companyData.email}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Industry */}
                    {companyData.industry && (
                      <Box sx={{ 
                        p: 2.5, 
                        bgcolor: 'rgba(99, 102, 241, 0.05)', 
                        borderRadius: 2,
                        border: '1px solid rgba(99, 102, 241, 0.1)'
                      }}>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Industry
                        </Typography>
                        <Typography sx={{ color: '#1e293b', fontWeight: 500 }}>
                          {companyData.industry}
                        </Typography>
                      </Box>
                    )}

                    {/* Headquarters */}
                    {companyData.headquarters && (
                      <Box sx={{ 
                        p: 2.5, 
                        bgcolor: 'rgba(99, 102, 241, 0.05)', 
                        borderRadius: 2,
                        border: '1px solid rgba(99, 102, 241, 0.1)'
                      }}>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Headquarters
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                          <Typography sx={{ color: '#1e293b', fontWeight: 500 }}>
                            {companyData.headquarters}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Company Size & Founded Year in a row */}
                    {(companyData.company_size || companyData.founded_year) && (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {companyData.company_size && (
                          <Box sx={{ 
                            flex: 1,
                            p: 2.5, 
                            bgcolor: 'rgba(99, 102, 241, 0.05)', 
                            borderRadius: 2,
                            border: '1px solid rgba(99, 102, 241, 0.1)'
                          }}>
                            <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Company Size
                            </Typography>
                            <Typography sx={{ color: '#1e293b', fontWeight: 500 }}>
                              {companyData.company_size}
                            </Typography>
                          </Box>
                        )}
                        {companyData.founded_year && (
                          <Box sx={{ 
                            flex: 1,
                            p: 2.5, 
                            bgcolor: 'rgba(99, 102, 241, 0.05)', 
                            borderRadius: 2,
                            border: '1px solid rgba(99, 102, 241, 0.1)'
                          }}>
                            <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Founded
                            </Typography>
                            <Typography sx={{ color: '#1e293b', fontWeight: 500 }}>
                              {companyData.founded_year}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}

                    {/* Description */}
                    {companyData.description && (
                      <Box sx={{ 
                        p: 2.5, 
                        bgcolor: 'rgba(99, 102, 241, 0.05)', 
                        borderRadius: 2,
                        border: '1px solid rgba(99, 102, 241, 0.1)'
                      }}>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          About
                        </Typography>
                        <Typography sx={{ color: '#1e293b', lineHeight: 1.6 }}>
                          {companyData.description}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4, color: '#64748b' }}>
                    <BusinessIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
                    <Typography color="text.secondary">
                      No company details added yet.
                    </Typography>
                  </Box>
                )}
              </GlassCard>
            )}

            {/* Experience - Hide for HR users who only have company details */}
            {!isHiringManager && (
            <GlassCard sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkIcon sx={{ color: '#6366f1' }} />
                  <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 700 }}>
                    Experience
                  </Typography>
                </Box>
                {isOwnProfile && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddExperienceClick}
                    sx={{
                      bgcolor: '#6366f1',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': { bgcolor: '#4f46e5' },
                    }}
                  >
                    Add Experience
                  </Button>
                )}
              </Box>
              {experience.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {experience.map((exp, idx) => (
                    <ExperienceCard key={exp.id || idx} sx={{ position: 'relative' }}>
                      {/* Edit/Delete buttons */}
                      {isOwnProfile && (
                        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                // Find the original experience data
                                const originalExp = experiences.find(e => e.id === exp.id);
                                if (originalExp) {
                                  setEditingExperienceId(exp.id);
                                  setNewExperience({
                                    company: originalExp.company || '',
                                    companyName: originalExp.company || '',
                                    clientName: originalExp.title || '',
                                    website: '',
                                    workLocation: originalExp.location || '',
                                    position: originalExp.title || '',
                                    startDate: originalExp.start_date || '',
                                    endDate: originalExp.end_date || '',
                                    current: originalExp.is_current || false,
                                    skills: (originalExp.skills || []).map((s: string) => ({ name: s, experience: '', rating: 5 })),
                                    description: originalExp.description || '',
                                    managerName: '',
                                    managerEmail: '',
                                    managerPhone: '',
                                    managerLinkedIn: '',
                                  });
                                  setShowExperienceWarning(false);
                                  setEditExperienceOpen(true);
                                }
                              }}
                              sx={{ color: 'rgba(0,0,0,0.4)', '&:hover': { color: '#6366f1', bgcolor: 'rgba(99,102,241,0.1)' } }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this experience?')) {
                                  try {
                                    const response = await fetchWithAuth(getApiUrl(`/users/me/experiences/${exp.id}`), {
                                      method: 'DELETE',
                                    });
                                    if (response.ok) {
                                      setSnackbar({ open: true, message: 'Experience deleted successfully', severity: 'success' });
                                      fetchUserData(); // Refresh data
                                    } else {
                                      setSnackbar({ open: true, message: 'Failed to delete experience', severity: 'error' });
                                    }
                                  } catch (err: any) {
                                    if (err.message?.includes('Session expired')) return;
                                    setSnackbar({ open: true, message: 'Failed to delete experience', severity: 'error' });
                                  }
                                }
                              }}
                              sx={{ color: 'rgba(0,0,0,0.4)', '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.1)' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                      <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, mb: 0.5, pr: isOwnProfile ? 5 : 0 }}>
                        {exp.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 1 }}>
                        {exp.company} • {exp.period}
                      </Typography>
                      {exp.description && (
                        <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)', mb: 1, fontSize: '0.85rem' }}>
                          {exp.description}
                        </Typography>
                      )}
                      {exp.tech && exp.tech.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {exp.tech.map((t) => (
                            <Chip 
                              key={t} 
                              label={t} 
                              size="small"
                              sx={{ 
                                bgcolor: 'rgba(99, 102, 241, 0.1)', 
                                color: '#4f46e5',
                                border: '1px solid rgba(99, 102, 241, 0.25)',
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </ExperienceCard>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.4)' }}>
                    No work experience added yet. {isOwnProfile && 'Click the edit icon to add your experience.'}
                  </Typography>
                </Box>
              )}
            </GlassCard>
            )}

            {/* Education - Hide for HR users who only have company details */}
            {!isHiringManager && (
            <GlassCard sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon sx={{ color: '#10b981' }} />
                  <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 700 }}>
                    Education
                  </Typography>
                </Box>
                {isOwnProfile && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setEditEducationOpen(true)}
                    sx={{
                      bgcolor: '#10b981',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': { bgcolor: '#059669' },
                    }}
                  >
                    Add Education
                  </Button>
                )}
              </Box>
              {education.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {education.map((edu, idx) => (
                    <ExperienceCard key={edu.id || idx} sx={{ position: 'relative' }}>
                      {/* Edit/Delete buttons */}
                      {isOwnProfile && (
                        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                // Find the original education data
                                const originalEdu = educations.find(e => e.id === edu.id);
                                if (originalEdu) {
                                  setEditingEducationId(edu.id);
                                  setNewEducation({
                                    institution: originalEdu.school_name || originalEdu.institution || '',
                                    levelOfEducation: originalEdu.degree || '',
                                    fieldOfStudy: originalEdu.field_of_study || '',
                                    startDate: originalEdu.start_year ? `${originalEdu.start_year}-01-01` : '',
                                    endDate: originalEdu.end_year ? `${originalEdu.end_year}-01-01` : '',
                                    gpa: originalEdu.grade || originalEdu.gpa || '',
                                  });
                                  setEditEducationOpen(true);
                                }
                              }}
                              sx={{ color: 'rgba(0,0,0,0.4)', '&:hover': { color: '#10b981', bgcolor: 'rgba(16,185,129,0.1)' } }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this education?')) {
                                  try {
                                    const response = await fetchWithAuth(getApiUrl(`/users/me/educations/${edu.id}`), {
                                      method: 'DELETE',
                                    });
                                    if (response.ok) {
                                      setSnackbar({ open: true, message: 'Education deleted successfully', severity: 'success' });
                                      fetchUserData(); // Refresh data
                                    } else {
                                      setSnackbar({ open: true, message: 'Failed to delete education', severity: 'error' });
                                    }
                                  } catch (err: any) {
                                    if (err.message?.includes('Session expired')) return;
                                    setSnackbar({ open: true, message: 'Failed to delete education', severity: 'error' });
                                  }
                                }
                              }}
                              sx={{ color: 'rgba(0,0,0,0.4)', '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.1)' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
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
                        <Box sx={{ flex: 1, pr: isOwnProfile ? 4 : 0 }}>
                          <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, mb: 0.5, fontSize: '1rem' }}>
                            {edu.degree}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 0.5 }}>
                            {edu.institution}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.4)' }}>
                              {edu.period}
                            </Typography>
                            {edu.gpa && (
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
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </ExperienceCard>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.4)' }}>
                    No education added yet. {isOwnProfile && 'Click the edit icon to add your education.'}
                  </Typography>
                </Box>
              )}
            </GlassCard>
            )}

            {/* Projects */}
            <GlassCard sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RocketLaunchIcon sx={{ color: '#f59e0b' }} />
                  <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 700 }}>
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
              {projects.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <RocketLaunchIcon sx={{ fontSize: 48, color: 'rgba(0,0,0,0.2)', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)' }}>
                    No projects added yet
                  </Typography>
                  {isOwnProfile && (
                    <Button 
                      size="small" 
                      onClick={() => setAddProjectOpen(true)}
                      sx={{ mt: 1, color: '#f59e0b', textTransform: 'none' }}
                    >
                      Add your first project
                    </Button>
                  )}
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {projects.map((project) => (
                    <Grid item xs={12} key={project.id}>
                      <Box 
                        sx={{ 
                          borderRadius: 3,
                          overflow: 'hidden',
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(0, 0, 0, 0.06)',
                          transition: 'all 0.3s ease',
                          cursor: project.link ? 'pointer' : 'default',
                          '&:hover': {
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                        onClick={() => project.link && window.open(project.link, '_blank')}
                      >
                        {/* Project Header with gradient */}
                        <Box 
                          sx={{ 
                            height: 80, 
                            background: project.image 
                              ? `url(${project.image}) center/cover`
                              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {!project.image && (
                            <RocketLaunchIcon sx={{ fontSize: 32, color: 'rgba(255,255,255,0.5)' }} />
                          )}
                        </Box>
                        
                        {/* Project Info */}
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ color: '#1e293b', fontWeight: 600 }}>
                              {project.name}
                            </Typography>
                            {isOwnProfile && (
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updatedProjects = projects.filter(p => p.id !== project.id);
                                  setProjects(updatedProjects);
                                  localStorage.setItem('userProjects', JSON.stringify(updatedProjects));
                                  setSnackbar({ open: true, message: 'Project removed', severity: 'success' });
                                }}
                                sx={{ color: 'rgba(0,0,0,0.4)', '&:hover': { color: '#ef4444' } }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                          
                          {project.description && (
                            <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)', mb: 1.5, fontSize: '0.8rem', lineHeight: 1.5 }}>
                              {project.description}
                            </Typography>
                          )}
                          
                          {project.technologies.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {project.technologies.map((t) => (
                                <Chip 
                                  key={t} 
                                  label={t} 
                                  size="small"
                                  sx={{ 
                                    height: 22,
                                    bgcolor: 'rgba(99, 102, 241, 0.1)', 
                                    color: '#6366f1',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    fontSize: '0.7rem',
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                          
                          {project.link && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                              <LinkIcon sx={{ fontSize: 14, color: 'rgba(0,0,0,0.4)' }} />
                              <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)' }}>
                                {project.link.replace(/^https?:\/\//, '').substring(0, 30)}...
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </GlassCard>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={4}>
            {/* Tech Stack */}
            <GlassCard sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BoltIcon sx={{ color: '#f59e0b' }} />
                <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 700 }}>
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
                <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 700 }}>
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
                    <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.7)' }}>
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
                      bgcolor: 'rgba(0,0,0,0.06)',
                      '& .MuiLinearProgress-bar': { bgcolor: diff.color, borderRadius: 4 },
                    }}
                  />
                </Box>
              ))}
              
              <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.08)' }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#6366f1' }}>256</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)' }}>Total</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#f59e0b' }}>42</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)' }}>Streak</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981' }}>A+</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)' }}>Grade</Typography>
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
        PaperProps={{ sx: { bgcolor: '#ffffff', backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ color: '#1e293b' }}>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="First Name" 
                defaultValue={displayUser.firstName}
                disabled
                helperText="Cannot be changed"
                sx={{ 
                  '& .MuiOutlinedInput-root': { color: 'rgba(0,0,0,0.5)' },
                  '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.4)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                  '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Last Name" 
                defaultValue={displayUser.lastName}
                disabled
                helperText="Cannot be changed"
                sx={{ 
                  '& .MuiOutlinedInput-root': { color: 'rgba(0,0,0,0.5)' },
                  '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.4)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                  '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Title" 
                defaultValue={displayUser.title}
                sx={{ 
                  '& .MuiOutlinedInput-root': { color: '#1e293b' },
                  '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.5)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.15)' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Tagline" 
                defaultValue={displayUser.tagline}
                sx={{ 
                  '& .MuiOutlinedInput-root': { color: '#1e293b' },
                  '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.5)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.15)' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="GitHub Profile URL"
                placeholder="https://github.com/yourusername"
                defaultValue={profile?.github_url || ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GitHubIcon sx={{ color: 'rgba(0,0,0,0.5)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { color: '#1e293b' },
                  '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.5)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.15)' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="GitLab Profile URL"
                placeholder="https://gitlab.com/yourusername"
                defaultValue={profile?.gitlab_url || ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="img" src="https://about.gitlab.com/images/press/logo/svg/gitlab-icon-rgb.svg" sx={{ width: 24, height: 24, opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { color: '#1e293b' },
                  '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.5)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.15)' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Personal Website"
                placeholder="https://yourwebsite.com"
                defaultValue={profile?.website || ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LanguageIcon sx={{ color: 'rgba(0,0,0,0.5)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { color: '#1e293b' },
                  '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.5)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.15)' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Country" 
                defaultValue={displayUser.location}
                disabled
                helperText="Cannot be changed"
                sx={{ 
                  '& .MuiOutlinedInput-root': { color: 'rgba(0,0,0,0.5)' },
                  '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.4)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                  '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: 'rgba(0,0,0,0.7)' }}>
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

      {/* Experience Warning Modal */}
      <Dialog
        open={showExperienceWarning}
        onClose={() => setShowExperienceWarning(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#ffffff', backgroundImage: 'none', borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f', fontSize: '1.5rem' }}>
          ⚠️ Important Warning - Read Before Proceeding
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="error">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Resume Upload Not Allowed
              </Typography>
              <Typography variant="caption">
                You will NOT be able to upload any resume later. The job description you provide will serve as your professional profile.
              </Typography>
            </Alert>

            <Alert severity="warning">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Limited Updates & Permanent Job Title
              </Typography>
              <Typography variant="caption">
                • Job description can only be updated once every 30 days<br/>
                • Job title CANNOT be changed after account creation
              </Typography>
            </Alert>

            <Alert severity="info">
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                100% Accuracy Required
              </Typography>
              <Typography variant="body2">
                Provide 100% accurate roles and responsibilities that you EXACTLY performed. 
                Mention only genuine technical skills and tools that you actually used.
              </Typography>
            </Alert>

            <Alert severity="error" sx={{ bgcolor: '#fef2f2' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#991b1b' }}>
                Verification & Legal Consequences
              </Typography>
              <Typography variant="body2" sx={{ color: '#7f1d1d' }}>
                We will verify your information directly with company official authorities.
                Any misrepresentation will result in:
                <br/>• Permanent blocking from the platform
                <br/>• Your photo, name, and reason for blocking will be visible to ALL our partnered clients and vendors
                <br/>• Legal actions will be taken against you
              </Typography>
            </Alert>

            <Divider />

            <Alert severity="warning" sx={{ bgcolor: '#fffbeb' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#92400e' }}>
                Official Manager Email Mandatory
              </Typography>
              <Typography variant="caption" sx={{ color: '#78350f' }}>
                Failing to provide official email of the client reference will NOT allow you to access our platform.
                Personal emails (Gmail, Yahoo, etc.) will not be accepted.
              </Typography>
            </Alert>

            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#64748b', mt: 1, fontWeight: 500 }}>
              By clicking "Agree and Accept", you confirm that all information you provide is 100% accurate and verifiable.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setShowExperienceWarning(false)}
            sx={{ minWidth: 120 }}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleWarningAccept}
            sx={{ minWidth: 120 }}
          >
            Agree and Accept
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Experience Dialog (Full Form) */}
      <Dialog 
        open={editExperienceOpen} 
        onClose={handleExperienceFormClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { bgcolor: '#ffffff', backgroundImage: 'none', borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.6rem', textAlign: 'center', borderBottom: '1px solid #eee', pb: 1, color: '#6366f1', letterSpacing: 0.5 }}>
          {editingExperienceId ? 'Edit Work Experience' : 'Add Work Experience'}
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ pt: 1 }}>
            {/* Existing Experiences */}
            {experience.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(0,0,0,0.5)', mb: 2, fontWeight: 600 }}>
                  Your Experiences ({experience.length})
                </Typography>
                {experience.map((exp, idx) => (
                  <Box key={exp.id || idx} sx={{ mb: 2, p: 2, bgcolor: 'rgba(99, 102, 241, 0.04)', borderRadius: 2, border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                    <Typography variant="subtitle1" sx={{ color: '#1e293b', fontWeight: 600 }}>{exp.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>{exp.company} • {exp.period}</Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 3 }} />
              </Box>
            )}

            {/* Add New Experience Form */}
            <Typography variant="subtitle2" sx={{ color: '#6366f1', mb: 2, fontWeight: 600 }}>
              Add New Experience
            </Typography>

            <Grid container spacing={3}>
              {/* Name */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Name *"
                  value={newExperience.clientName}
                  onChange={(e) => setNewExperience({ ...newExperience, clientName: e.target.value })}
                  error={!!experienceErrors.clientName}
                  helperText={experienceErrors.clientName}
                  required
                />
              </Grid>

              {/* Company Name with Invite */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Company Name *"
                  value={newExperience.companyName}
                  onChange={(e) => setNewExperience({ ...newExperience, companyName: e.target.value })}
                  error={!!experienceErrors.companyName}
                  helperText={
                    experienceErrors.companyName || (
                      companySearchResults.length === 0 && newExperience.companyName.length >= 2 ? (
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <span>Company not found.</span>
                          <Button 
                            size="small" 
                            onClick={() => {
                              setCompanyInvite(prev => ({...prev, companyName: newExperience.companyName}));
                              setShowCompanyInvite(true);
                            }}
                            sx={{ textTransform: 'none', p: 0, minWidth: 'auto', fontSize: '0.75rem' }}
                          >
                            Invite company
                          </Button>
                        </Box>
                      ) : ''
                    )
                  }
                  required
                />
              </Grid>

              {/* Work Location */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Work Location *"
                  placeholder="City, State, Country"
                  value={newExperience.workLocation}
                  onChange={(e) => setNewExperience({ ...newExperience, workLocation: e.target.value })}
                  error={!!experienceErrors.workLocation}
                  helperText={experienceErrors.workLocation}
                  required
                />
              </Grid>

              {/* Website */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Website of the Company *"
                  type="url"
                  placeholder="https://www.example.com"
                  value={newExperience.website}
                  onChange={(e) => setNewExperience({ ...newExperience, website: e.target.value })}
                  error={!!experienceErrors.website}
                  helperText={experienceErrors.website}
                  required
                />
              </Grid>

              {/* Job Title */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Job Title *"
                  value={newExperience.position}
                  onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                  error={!!experienceErrors.position}
                  helperText={experienceErrors.position || "⚠️ Cannot be changed after account creation"}
                  required
                />
              </Grid>

              {/* From Date */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="From Date *"
                  type="date"
                  value={newExperience.startDate}
                  onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  error={!!experienceErrors.startDate}
                  helperText={experienceErrors.startDate}
                  required
                />
              </Grid>

              {/* To Date */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={newExperience.current ? 'To Date (Present)' : 'To Date *'}
                  type="date"
                  value={newExperience.endDate}
                  onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  disabled={newExperience.current}
                  error={!!experienceErrors.endDate}
                  helperText={experienceErrors.endDate}
                  required={!newExperience.current}
                />
              </Grid>

              {/* Currently Working */}
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newExperience.current}
                      onChange={(e) => handleCurrentToggle(e.target.checked)}
                    />
                  }
                  label="Currently Working Here"
                />
              </Grid>

              {/* Skills Section */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Skills *
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setCurrentSkill({ name: '', experience: '', rating: 5 });
                      setShowSkillDialog(true);
                    }}
                    sx={{ textTransform: 'none' }}
                  >
                    Add Skill
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Add each skill with your experience and self-rating
                </Typography>
                {newExperience.skills.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                    {newExperience.skills.map((skill, idx) => (
                      <Paper
                        key={idx}
                        elevation={0}
                        sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                {skill.name}
                              </Typography>
                              <Chip 
                                label={`${skill.rating}/10`} 
                                size="small" 
                                sx={{ 
                                  bgcolor: skill.rating >= 8 ? '#dcfce7' : skill.rating >= 5 ? '#fef3c7' : '#fee2e2',
                                  color: skill.rating >= 8 ? '#166534' : skill.rating >= 5 ? '#92400e' : '#991b1b',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                              {skill.experience}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setNewExperience({
                                ...newExperience,
                                skills: newExperience.skills.filter((_, i) => i !== idx)
                              });
                            }}
                            sx={{ color: '#ef4444' }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Grid>

              {/* Job Description */}
              <Grid item xs={12}>
                <Box
                  onClick={() => {
                    if (!jobDescAcknowledged) {
                      setShowJobDescWarning(true);
                    }
                  }}
                  sx={{ cursor: !jobDescAcknowledged ? 'pointer' : 'default' }}
                >
                  <TextField
                    fullWidth
                    label="Job Description *"
                    multiline
                    rows={4}
                    value={newExperience.description}
                    onChange={(e) => {
                      if (jobDescAcknowledged) {
                        setNewExperience({ ...newExperience, description: e.target.value });
                      }
                    }}
                    onPaste={(e) => e.preventDefault()}
                    onDrop={(e) => e.preventDefault()}
                    onDragOver={(e) => e.preventDefault()}
                    placeholder={jobDescAcknowledged ? "Describe your exact roles and responsibilities..." : "Click here to acknowledge terms and start typing..."}
                    error={!!experienceErrors.description}
                    helperText={experienceErrors.description || "Copy-paste disabled. Type manually. Can only be updated once every 30 days."}
                    required
                    inputProps={{
                      readOnly: !jobDescAcknowledged,
                      autoComplete: 'off',
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: !jobDescAcknowledged ? '#f1f5f9' : 'white',
                      }
                    }}
                  />
                </Box>
              </Grid>

              {/* Manager Info Header */}
              <Grid item xs={12}>
                <Box sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#6366f1', mt: 2, mb: 1, borderBottom: '1px dashed #ccc', pb: 0.5 }}>
                  Manager / Supervisor Details
                </Box>
              </Grid>

              {/* Manager Name */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Manager Name*"
                  value={newExperience.managerName}
                  onChange={(e) => {
                    setNewExperience({ ...newExperience, managerName: e.target.value });
                    if (experienceErrors.managerName) {
                      const newErrors = { ...experienceErrors };
                      delete newErrors.managerName;
                      setExperienceErrors(newErrors);
                    }
                  }}
                  error={!!experienceErrors.managerName}
                  helperText={experienceErrors.managerName}
                  required
                />
              </Grid>

              {/* Manager Email */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Manager Domain Email*"
                  type="email"
                  placeholder="manager@company.com"
                  value={newExperience.managerEmail}
                  onChange={(e) => {
                    setNewExperience({ ...newExperience, managerEmail: e.target.value });
                    if (experienceErrors.managerEmail) {
                      const newErrors = { ...experienceErrors };
                      delete newErrors.managerEmail;
                      setExperienceErrors(newErrors);
                    }
                  }}
                  error={!!experienceErrors.managerEmail}
                  helperText={experienceErrors.managerEmail}
                  required
                />
              </Grid>

              {/* Manager Phone */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Manager Phone Number*"
                  type="tel"
                  value={newExperience.managerPhone}
                  onChange={(e) => {
                    const inputValue = e.target.value.replace(/\D/g, '');
                    if (inputValue.length <= 10) {
                      setNewExperience({ ...newExperience, managerPhone: inputValue });
                      if (experienceErrors.managerPhone) {
                        const newErrors = { ...experienceErrors };
                        delete newErrors.managerPhone;
                        setExperienceErrors(newErrors);
                      }
                    }
                  }}
                  inputProps={{ maxLength: 10, pattern: '[0-9]{10}' }}
                  error={!!experienceErrors.managerPhone}
                  helperText={experienceErrors.managerPhone || "Fake entries are flagged. Enter exactly 10 digits."}
                  required
                />
              </Grid>

              {/* Manager LinkedIn */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Manager LinkedIn URL*"
                  type="url"
                  placeholder="https://www.linkedin.com/in/example"
                  value={newExperience.managerLinkedIn}
                  onChange={(e) => {
                    setNewExperience({ ...newExperience, managerLinkedIn: e.target.value });
                    if (experienceErrors.managerLinkedIn) {
                      const newErrors = { ...experienceErrors };
                      delete newErrors.managerLinkedIn;
                      setExperienceErrors(newErrors);
                    }
                  }}
                  error={!!experienceErrors.managerLinkedIn}
                  helperText={experienceErrors.managerLinkedIn || "It should be a legitimate LinkedIn profile."}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        {/* Error Alert */}
        {experienceErrors.submit && (
          <Alert severity="error" sx={{ mx: 3, mb: 2 }}>
            {experienceErrors.submit}
          </Alert>
        )}

        {/* Footer Buttons */}
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2, borderTop: '1px solid #eee' }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleExperienceFormClose}
            sx={{ px: 4, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveExperience}
            disabled={isSavingExperience}
            startIcon={isSavingExperience ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ px: 4, borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 2 }}
          >
            {isSavingExperience ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Job Description Warning Dialog */}
      <Dialog open={showJobDescWarning} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#ffffff', backgroundImage: 'none', borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f', fontSize: '1.3rem' }}>
          ⚠️ Important Notice - Please Read Carefully
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="error">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Resume Upload Not Allowed</Typography>
              <Typography variant="caption">You cannot upload any resume later. This job description will serve as your professional profile.</Typography>
            </Alert>
            
            <Alert severity="warning">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Limited Updates</Typography>
              <Typography variant="caption">• Job description can only be updated once every 30 days<br/>• Job title CANNOT be changed after account creation</Typography>
            </Alert>
            
            <Alert severity="info">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Accuracy Required</Typography>
              <Typography variant="caption">Provide 100% accurate roles and responsibilities that you EXACTLY performed. Mention only genuine technical skills and tools.</Typography>
            </Alert>
            
            <Alert severity="error" sx={{ bgcolor: '#fef2f2' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#991b1b' }}>Verification & Consequences</Typography>
              <Typography variant="caption" sx={{ color: '#7f1d1d' }}>We will verify your information directly with company official authorities. Any misrepresentation is considered a crime and will result in:<br/>• Permanent blocking from the platform<br/>• Your profile and reason for blocking will be visible to all our customers</Typography>
            </Alert>
            
            <Divider />
            
            <Alert severity="warning" sx={{ bgcolor: '#fffbeb' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#92400e' }}>Official Email Required</Typography>
              <Typography variant="caption" sx={{ color: '#78350f' }}>Failing to provide official email of the client reference will not allow you to access our platform.</Typography>
            </Alert>
            
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#64748b', mt: 1 }}>
              This job description will act as your resume for anyone viewing your profile. Fill in exactly what you did - nothing more, nothing less.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              setJobDescAcknowledged(true);
              setShowJobDescWarning(false);
            }}
          >
            I Understand & Agree
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Skill Dialog */}
      <Dialog open={showSkillDialog} onClose={() => setShowSkillDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#ffffff', backgroundImage: 'none', borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Skill Details</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>
            Provide details about your skill, what exactly you did with it, and rate yourself.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skill Name *"
                placeholder="e.g., React, Python, AWS, SQL"
                value={currentSkill.name}
                onChange={(e) => setCurrentSkill(prev => ({...prev, name: e.target.value}))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="What exactly did you do with this skill? *"
                multiline
                rows={4}
                placeholder="Describe specific projects, tasks, and responsibilities where you used this skill..."
                value={currentSkill.experience}
                onChange={(e) => setCurrentSkill(prev => ({...prev, experience: e.target.value}))}
                onPaste={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                helperText="Copy-paste disabled. Type manually. Be specific about what you did."
                inputProps={{ autoComplete: 'off' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Rate yourself (1-10) *</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
                <Typography variant="body2" color="text.secondary">1</Typography>
                <Slider
                  value={currentSkill.rating}
                  onChange={(_, value) => setCurrentSkill(prev => ({...prev, rating: value as number}))}
                  min={1}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="on"
                  sx={{
                    '& .MuiSlider-valueLabel': {
                      bgcolor: currentSkill.rating >= 8 ? '#16a34a' : currentSkill.rating >= 5 ? '#eab308' : '#dc2626',
                    }
                  }}
                />
                <Typography variant="body2" color="text.secondary">10</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">Beginner</Typography>
                <Typography variant="caption" color="text.secondary">Intermediate</Typography>
                <Typography variant="caption" color="text.secondary">Expert</Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowSkillDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              if (currentSkill.name.trim() && currentSkill.experience.trim()) {
                setNewExperience(prev => ({
                  ...prev,
                  skills: [...prev.skills, {
                    name: currentSkill.name.trim(),
                    experience: currentSkill.experience.trim(),
                    rating: currentSkill.rating
                  }]
                }));
                setCurrentSkill({ name: '', experience: '', rating: 5 });
                setShowSkillDialog(false);
              }
            }}
            disabled={!currentSkill.name.trim() || !currentSkill.experience.trim()}
          >
            Add Skill
          </Button>
        </DialogActions>
      </Dialog>

      {/* Company Invite Dialog */}
      <Dialog open={showCompanyInvite} onClose={() => setShowCompanyInvite(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#ffffff', backgroundImage: 'none', borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Invite Your Company to VerTechie</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>
            Your company is not registered with us. You can invite them to create an account, or proceed without inviting by clicking "Skip".
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Full Name *"
                value={companyInvite.companyName}
                onChange={(e) => setCompanyInvite(prev => ({...prev, companyName: e.target.value}))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Address *"
                multiline
                rows={2}
                value={companyInvite.address}
                onChange={(e) => setCompanyInvite(prev => ({...prev, address: e.target.value}))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Website"
                placeholder="https://company.com"
                value={companyInvite.website}
                onChange={(e) => setCompanyInvite(prev => ({...prev, website: e.target.value}))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Person Name *"
                value={companyInvite.contactPersonName}
                onChange={(e) => setCompanyInvite(prev => ({...prev, contactPersonName: e.target.value}))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Person Role"
                placeholder="e.g., HR Manager"
                value={companyInvite.contactPersonRole}
                onChange={(e) => setCompanyInvite(prev => ({...prev, contactPersonRole: e.target.value}))}
              />
            </Grid>
            
            {/* Email Fields */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Company Email(s)</Typography>
              {companyInvite.emails.map((email, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="company@example.com"
                    value={email}
                    onChange={(e) => {
                      const newEmails = [...companyInvite.emails];
                      newEmails[idx] = e.target.value;
                      setCompanyInvite(prev => ({...prev, emails: newEmails}));
                    }}
                  />
                  {companyInvite.emails.length > 1 && (
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => {
                        setCompanyInvite(prev => ({
                          ...prev, 
                          emails: prev.emails.filter((_, i) => i !== idx)
                        }));
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
              <Button 
                size="small" 
                onClick={() => setCompanyInvite(prev => ({...prev, emails: [...prev.emails, '']}))}
              >
                + Add Another Email
              </Button>
            </Grid>
            
            {/* Phone Fields */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Company Phone(s)</Typography>
              {companyInvite.phoneNumbers.map((phone, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => {
                      const newPhones = [...companyInvite.phoneNumbers];
                      newPhones[idx] = e.target.value;
                      setCompanyInvite(prev => ({...prev, phoneNumbers: newPhones}));
                    }}
                  />
                  {companyInvite.phoneNumbers.length > 1 && (
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => {
                        setCompanyInvite(prev => ({
                          ...prev, 
                          phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== idx)
                        }));
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
              <Button 
                size="small" 
                onClick={() => setCompanyInvite(prev => ({...prev, phoneNumbers: [...prev.phoneNumbers, '']}))}
              >
                + Add Another Phone
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowCompanyInvite(false)}>Skip - Proceed Without Inviting</Button>
          <Button 
            variant="contained" 
            onClick={handleSendCompanyInvite}
            disabled={!companyInvite.companyName || !companyInvite.contactPersonName}
          >
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Education Dialog */}
      <Dialog 
        open={editEducationOpen} 
        onClose={handleEducationFormClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { bgcolor: '#ffffff', backgroundImage: 'none', borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.6rem', textAlign: 'center', borderBottom: '1px solid #eee', pb: 1, color: '#10b981', letterSpacing: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <SchoolIcon sx={{ color: '#10b981' }} />
            {editingEducationId ? 'Edit Education' : 'Add Education'}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ pt: 1 }}>
            {/* Existing Education */}
            {education.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(0,0,0,0.5)', mb: 2, fontWeight: 600 }}>
                  Your Education ({education.length})
                </Typography>
                {education.map((edu, idx) => (
                  <Box key={edu.id || idx} sx={{ mb: 2, p: 2, bgcolor: 'rgba(16, 185, 129, 0.04)', borderRadius: 2, border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                    <Typography variant="subtitle1" sx={{ color: '#1e293b', fontWeight: 600 }}>{edu.degree}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>{edu.institution} • {edu.period}</Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 3 }} />
              </Box>
            )}
            
            {/* Add New Education Form */}
            <Typography variant="subtitle2" sx={{ color: '#10b981', mb: 2, fontWeight: 600 }}>
              Add New Education
            </Typography>
            <Grid container spacing={3}>
              {/* Institution Name */}
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Institution Name *"
                  placeholder="e.g. Stanford University"
                  value={newEducation.institution}
                  onChange={(e) => {
                    setNewEducation({ ...newEducation, institution: e.target.value });
                    if (educationErrors.institution) {
                      const newErrors = { ...educationErrors };
                      delete newErrors.institution;
                      setEducationErrors(newErrors);
                    }
                  }}
                  error={!!educationErrors.institution}
                  helperText={educationErrors.institution}
                  required
                />
              </Grid>
              
              {/* Level of Education */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!educationErrors.levelOfEducation}>
                  <InputLabel>Level of Education *</InputLabel>
                  <Select
                    value={newEducation.levelOfEducation}
                    onChange={(e: SelectChangeEvent<string>) => {
                      setNewEducation({ ...newEducation, levelOfEducation: e.target.value });
                      if (educationErrors.levelOfEducation) {
                        const newErrors = { ...educationErrors };
                        delete newErrors.levelOfEducation;
                        setEducationErrors(newErrors);
                      }
                    }}
                    label="Level of Education *"
                  >
                    <MenuItem value="PhD">PhD</MenuItem>
                    <MenuItem value="Masters">Masters</MenuItem>
                    <MenuItem value="Bachelors">Bachelors</MenuItem>
                    <MenuItem value="Diploma">Diploma</MenuItem>
                    <MenuItem value="+12">+12</MenuItem>
                    <MenuItem value="High School">High School</MenuItem>
                  </Select>
                  {educationErrors.levelOfEducation && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {educationErrors.levelOfEducation}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              
              {/* Field of Study */}
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Field of Study *"
                  placeholder="e.g. Computer Science"
                  value={newEducation.fieldOfStudy}
                  onChange={(e) => {
                    setNewEducation({ ...newEducation, fieldOfStudy: e.target.value });
                    if (educationErrors.fieldOfStudy) {
                      const newErrors = { ...educationErrors };
                      delete newErrors.fieldOfStudy;
                      setEducationErrors(newErrors);
                    }
                  }}
                  error={!!educationErrors.fieldOfStudy}
                  helperText={educationErrors.fieldOfStudy}
                  required
                />
              </Grid>
              
              {/* GPA */}
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="GPA/Score"
                  placeholder="e.g. 3.8 or 8.5"
                  value={newEducation.gpa}
                  onChange={(e) => {
                    setNewEducation({ ...newEducation, gpa: e.target.value });
                    if (educationErrors.gpa) {
                      const newErrors = { ...educationErrors };
                      delete newErrors.gpa;
                      setEducationErrors(newErrors);
                    }
                  }}
                  error={!!educationErrors.gpa}
                  helperText={educationErrors.gpa || "Enter GPA (0-4 or 0-10 scale)"}
                />
              </Grid>
              
              {/* From Date */}
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="From Date *"
                  type="date"
                  value={newEducation.startDate}
                  onChange={(e) => {
                    setNewEducation({ ...newEducation, startDate: e.target.value });
                    if (educationErrors.startDate) {
                      const newErrors = { ...educationErrors };
                      delete newErrors.startDate;
                      setEducationErrors(newErrors);
                    }
                  }}
                  InputLabelProps={{ shrink: true }}
                  error={!!educationErrors.startDate}
                  helperText={educationErrors.startDate}
                  required
                />
              </Grid>
              
              {/* To Date */}
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="To Date * (or expected)"
                  type="date"
                  value={newEducation.endDate}
                  onChange={(e) => {
                    setNewEducation({ ...newEducation, endDate: e.target.value });
                    if (educationErrors.endDate) {
                      const newErrors = { ...educationErrors };
                      delete newErrors.endDate;
                      setEducationErrors(newErrors);
                    }
                  }}
                  InputLabelProps={{ shrink: true }}
                  error={!!educationErrors.endDate}
                  helperText={educationErrors.endDate || "Future dates allowed for expected graduation"}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        {/* Error Alert */}
        {educationErrors.submit && (
          <Alert severity="error" sx={{ mx: 3, mb: 2 }}>
            {educationErrors.submit}
          </Alert>
        )}

        {/* Footer Buttons */}
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2, borderTop: '1px solid #eee' }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleEducationFormClose}
            sx={{ px: 4, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveEducation}
            disabled={isSavingEducation}
            startIcon={isSavingEducation ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ background: 'linear-gradient(135deg, #10b981, #059669)', px: 4, borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 2 }}
          >
            {isSavingEducation ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Skills Dialog */}
      <Dialog 
        open={editSkillsOpen} 
        onClose={() => {
          setEditSkillsOpen(false);
          setNewSkillInput('');
        }} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { bgcolor: '#ffffff', backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ color: '#1e293b' }}>Edit Skills</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)', mb: 2 }}>
            Add your technical skills (e.g., React, Python, Node.js)
          </Typography>
          
          {/* Current skills */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3, minHeight: 40 }}>
            {editableSkills.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.3)', fontStyle: 'italic' }}>
                No skills added yet. Add your first skill below.
              </Typography>
            ) : (
              editableSkills.map((skill) => (
                <Chip 
                  key={skill} 
                  label={skill} 
                  onDelete={() => {
                    setEditableSkills(editableSkills.filter(s => s !== skill));
                  }}
                  sx={{ 
                    bgcolor: 'rgba(99, 102, 241, 0.15)', 
                    color: '#4f46e5', 
                    '& .MuiChip-deleteIcon': { color: 'rgba(0,0,0,0.5)', '&:hover': { color: '#ef4444' } } 
                  }}
                />
              ))
            )}
          </Box>
          
          {/* Add new skill input */}
          <TextField 
            fullWidth 
            label="Add new skill" 
            placeholder="Type skill name and press Enter"
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newSkillInput.trim()) {
                e.preventDefault();
                const skillToAdd = newSkillInput.trim();
                if (!editableSkills.includes(skillToAdd)) {
                  setEditableSkills([...editableSkills, skillToAdd]);
                }
                setNewSkillInput('');
              }
            }}
            InputProps={{
              endAdornment: newSkillInput.trim() && (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={() => {
                      const skillToAdd = newSkillInput.trim();
                      if (skillToAdd && !editableSkills.includes(skillToAdd)) {
                        setEditableSkills([...editableSkills, skillToAdd]);
                      }
                      setNewSkillInput('');
                    }}
                    sx={{ color: '#6366f1', textTransform: 'none' }}
                  >
                    Add
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': { color: '#1e293b' }, 
              '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.5)' }, 
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.15)' } 
            }}
          />
          <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.4)', mt: 1, display: 'block' }}>
            Press Enter or click Add to add a skill
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => {
              setEditSkillsOpen(false);
              setNewSkillInput('');
            }} 
            sx={{ color: 'rgba(0,0,0,0.7)' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={async () => { 
              try {
                // Save skills to backend
                const response = await fetchWithAuth(getApiUrl('/users/me/profile'), {
                  method: 'PUT',
                  body: JSON.stringify({ skills: editableSkills }),
                });
                
                if (response.ok) {
                  const updatedProfile = await response.json();
                  setProfile(updatedProfile);
                  setEditSkillsOpen(false);
                  setNewSkillInput('');
                  setSnackbar({ open: true, message: 'Skills updated successfully!', severity: 'success' });
                } else {
                  setSnackbar({ open: true, message: 'Failed to update skills', severity: 'error' });
                }
              } catch (err: any) {
                if (err.message?.includes('Session expired')) return;
                console.error('Error saving skills:', err);
                setSnackbar({ open: true, message: 'Failed to update skills', severity: 'error' });
              }
            }} 
            sx={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
          >
            Save Skills
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Project Dialog */}
      <Dialog 
        open={addProjectOpen} 
        onClose={() => {
          setAddProjectOpen(false);
          setNewProject({ name: '', description: '', url: '', technologies: '', image: '' });
        }} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { bgcolor: '#ffffff', backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ color: '#1e293b' }}>Add Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Project Name" 
                placeholder="My Awesome Project"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { color: '#1e293b' }, '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.15)' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Description" 
                multiline
                rows={3}
                placeholder="Brief description of your project"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { color: '#1e293b' }, '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.15)' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="GitHub/Project URL" 
                placeholder="https://github.com/username/project"
                type="url"
                value={newProject.url}
                onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { color: '#1e293b' }, '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.15)' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Technologies Used (comma separated)" 
                placeholder="React, Node.js, PostgreSQL"
                value={newProject.technologies}
                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { color: '#1e293b' }, '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.15)' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="project-image-upload"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Check file size (max 2MB)
                    if (file.size > 2 * 1024 * 1024) {
                      setSnackbar({ open: true, message: 'Image must be less than 2MB', severity: 'error' });
                      return;
                    }
                    // Convert to base64
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setNewProject({ ...newProject, image: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label htmlFor="project-image-upload" style={{ width: '100%' }}>
                {newProject.image ? (
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={newProject.image}
                      alt="Project preview"
                      sx={{
                        width: '100%',
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: 2,
                        border: '2px solid rgba(0,0,0,0.1)',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        setNewProject({ ...newProject, image: '' });
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: '#fff',
                        '&:hover': { bgcolor: 'rgba(239,68,68,0.8)' },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        textAlign: 'center', 
                        mt: 1, 
                        color: 'rgba(0,0,0,0.5)' 
                      }}
                    >
                      Click to change image
                    </Typography>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    sx={{ 
                      color: 'rgba(0,0,0,0.5)', 
                      borderColor: 'rgba(0,0,0,0.15)', 
                      borderStyle: 'dashed',
                      py: 3,
                      '&:hover': {
                        borderColor: '#f59e0b',
                        bgcolor: 'rgba(245,158,11,0.05)',
                      },
                    }}
                  >
                    Upload Project Image
                  </Button>
                )}
              </label>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => {
            setAddProjectOpen(false);
            setNewProject({ name: '', description: '', url: '', technologies: '', image: '' });
          }} sx={{ color: 'rgba(0,0,0,0.7)' }}>Cancel</Button>
          <Button 
            variant="contained" 
            disabled={!newProject.name.trim()}
            onClick={() => { 
              // Create new project object
              const projectToAdd = {
                id: Date.now().toString(),
                name: newProject.name.trim(),
                description: newProject.description.trim(),
                link: newProject.url.trim(),
                technologies: newProject.technologies.split(',').map(t => t.trim()).filter(Boolean),
                image: newProject.image, // Include the uploaded image
              };
              
              // Add to projects list
              const updatedProjects = [...projects, projectToAdd];
              setProjects(updatedProjects);
              
              // Save to localStorage for persistence
              localStorage.setItem('userProjects', JSON.stringify(updatedProjects));
              
              setAddProjectOpen(false); 
              setNewProject({ name: '', description: '', url: '', technologies: '', image: '' });
              setSnackbar({ open: true, message: 'Project added successfully!', severity: 'success' }); 
            }} 
            sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            Add Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ProfilePage;
