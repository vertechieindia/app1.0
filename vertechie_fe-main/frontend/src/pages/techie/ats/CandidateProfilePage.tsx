/**
 * CandidateProfilePage - View Candidate Profile from ATS
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Avatar, Chip, Button, Grid, Card, CardContent,
  IconButton, Divider, CircularProgress, Rating, Snackbar, Alert, Tab, Tabs,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import LinkIcon from '@mui/icons-material/Link';
import DownloadIcon from '@mui/icons-material/Download';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import CodeIcon from '@mui/icons-material/Code';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ATSLayout from './ATSLayout';
import { getApiUrl, API_ENDPOINTS } from '../../../config/api';

const ProfileHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: `linear-gradient(135deg, ${alpha('#0d47a1', 0.05)} 0%, ${alpha('#1976d2', 0.08)} 100%)`,
  borderRadius: 16,
  marginBottom: theme.spacing(3),
}));

const InfoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 12,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  backgroundColor: alpha('#0d47a1', 0.08),
  color: '#0d47a1',
}));

interface CandidateData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  mobile_number?: string;
  location?: string;
  avatar_url?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  experience?: any[];
  education?: any[];
  certifications?: any[];
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  resume_url?: string;
  created_at?: string;
  profile?: {
    headline?: string;
    bio?: string;
    skills?: string[];
    current_company?: string;
    current_position?: string;
    location?: string;
    experience_years?: number;
  };
}

const CandidateProfilePage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<CandidateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false, message: '', severity: 'info'
  });

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        
        // Fetch user data
        const userResponse = await fetch(getApiUrl(API_ENDPOINTS.USERS.GET(candidateId!)), { headers });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          
          // Fetch profile data
          let profileData = null;
          try {
            const profileResponse = await fetch(getApiUrl(API_ENDPOINTS.USERS.PROFILE(candidateId!)), { headers });
            if (profileResponse.ok) {
              profileData = await profileResponse.json();
            }
          } catch (e) {
            console.warn('Could not fetch profile:', e);
          }
          
          // Fetch experiences
          let experiencesData: any[] = [];
          try {
            const expResponse = await fetch(getApiUrl(`/users/${candidateId}/experiences/`), { headers });
            if (expResponse.ok) {
              experiencesData = await expResponse.json();
            }
          } catch (e) {
            console.warn('Could not fetch experiences:', e);
          }
          
          // Fetch educations
          let educationsData: any[] = [];
          try {
            const eduResponse = await fetch(getApiUrl(`/users/${candidateId}/educations/`), { headers });
            if (eduResponse.ok) {
              educationsData = await eduResponse.json();
            }
          } catch (e) {
            console.warn('Could not fetch educations:', e);
          }
          
          // Combine all data
          setCandidate({
            ...userData,
            profile: profileData || userData.profile,
            experience: experiencesData,
            education: educationsData,
            skills: profileData?.skills || userData.skills || [],
            headline: profileData?.headline || userData.headline,
            bio: profileData?.bio || userData.bio,
            location: profileData?.location || userData.location,
          });
        } else {
          setSnackbar({ open: true, message: 'Failed to load candidate profile', severity: 'error' });
        }
      } catch (error) {
        console.error('Error fetching candidate:', error);
        setSnackbar({ open: true, message: 'Error loading candidate profile', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidate();
    }
  }, [candidateId]);

  const handleScheduleInterview = () => {
    setSnackbar({ open: true, message: 'Interview scheduling coming soon!', severity: 'info' });
  };

  const handleSendEmail = () => {
    if (candidate?.email) {
      window.location.href = `mailto:${candidate.email}`;
    }
  };

  const handleDownloadResume = () => {
    if (candidate?.resume_url) {
      window.open(candidate.resume_url, '_blank');
    } else {
      setSnackbar({ open: true, message: 'No resume available', severity: 'info' });
    }
  };

  if (loading) {
    return (
      <ATSLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </ATSLayout>
    );
  }

  if (!candidate) {
    return (
      <ATSLayout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary">Candidate not found</Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/techie/ats/allcandidates')}
            sx={{ mt: 2 }}
          >
            Back to Candidates
          </Button>
        </Box>
      </ATSLayout>
    );
  }

  const fullName = `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim() || 'Unknown';
  const skills = candidate.skills || candidate.profile?.skills || [];
  const headline = candidate.headline || candidate.profile?.headline || candidate.profile?.current_position || 'Techie';
  const location = candidate.location || candidate.profile?.location || '';
  const bio = candidate.bio || candidate.profile?.bio || '';

  return (
    <ATSLayout>
      {/* Back Button */}
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/techie/ats/allcandidates')}
        sx={{ mb: 2 }}
      >
        Back to All Candidates
      </Button>

      {/* Profile Header */}
      <ProfileHeader elevation={0}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={candidate.avatar_url}
              sx={{ 
                width: 120, 
                height: 120, 
                fontSize: 48,
                bgcolor: alpha('#0d47a1', 0.1),
                color: '#0d47a1',
                border: '4px solid white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              {fullName.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h4" fontWeight={700}>{fullName}</Typography>
              <CheckCircleIcon sx={{ color: '#34C759', fontSize: 24 }} />
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              {headline}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              {location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">{location}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">{candidate.email}</Typography>
              </Box>
              {(candidate.phone || candidate.mobile_number) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PhoneIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {candidate.phone || candidate.mobile_number}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {candidate.github_url && (
                <IconButton size="small" onClick={() => window.open(candidate.github_url, '_blank')}>
                  <GitHubIcon />
                </IconButton>
              )}
              {candidate.linkedin_url && (
                <IconButton size="small" onClick={() => window.open(candidate.linkedin_url, '_blank')}>
                  <LinkedInIcon sx={{ color: '#0077B5' }} />
                </IconButton>
              )}
              {candidate.portfolio_url && (
                <IconButton size="small" onClick={() => window.open(candidate.portfolio_url, '_blank')}>
                  <LinkIcon />
                </IconButton>
              )}
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button 
                variant="contained" 
                startIcon={<ScheduleIcon />}
                onClick={handleScheduleInterview}
                sx={{ borderRadius: 2 }}
              >
                Schedule Interview
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<EmailIcon />}
                onClick={handleSendEmail}
                sx={{ borderRadius: 2 }}
              >
                Send Email
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />}
                onClick={handleDownloadResume}
                sx={{ borderRadius: 2 }}
              >
                Download Resume
              </Button>
            </Box>
          </Grid>
        </Grid>
      </ProfileHeader>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, v) => setActiveTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" />
          <Tab label="Skills" />
          <Tab label="Experience" />
          <Tab label="Education" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* About */}
          <Grid item xs={12} md={8}>
            <InfoCard>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>About</Typography>
                <Typography variant="body1" color="text.secondary">
                  {bio || 'No bio available'}
                </Typography>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} md={4}>
            <InfoCard>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>Quick Stats</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Experience</Typography>
                    <Typography fontWeight={600}>
                      {candidate.profile?.experience_years || 0}+ years
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Skills</Typography>
                    <Typography fontWeight={600}>{skills.length} skills</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Rating</Typography>
                    <Rating value={4} size="small" readOnly />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Status</Typography>
                    <Chip label="Active" size="small" color="success" />
                  </Box>
                </Box>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Skills Preview */}
          <Grid item xs={12}>
            <InfoCard>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <CodeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Top Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {skills.length > 0 ? (
                    skills.slice(0, 10).map((skill: string, index: number) => (
                      <SkillChip key={index} label={skill} />
                    ))
                  ) : (
                    <Typography color="text.secondary">No skills listed</Typography>
                  )}
                  {skills.length > 10 && (
                    <Chip 
                      label={`+${skills.length - 10} more`} 
                      variant="outlined" 
                      size="small"
                      onClick={() => setActiveTab(1)}
                    />
                  )}
                </Box>
              </CardContent>
            </InfoCard>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <InfoCard>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>All Skills</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {skills.length > 0 ? (
                skills.map((skill: string, index: number) => (
                  <SkillChip key={index} label={skill} />
                ))
              ) : (
                <Typography color="text.secondary">No skills listed</Typography>
              )}
            </Box>
          </CardContent>
        </InfoCard>
      )}

      {activeTab === 2 && (
        <InfoCard>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Experience
            </Typography>
            {candidate.experience && candidate.experience.length > 0 ? (
              candidate.experience.map((exp: any, index: number) => (
                <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < candidate.experience!.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                  <Typography variant="subtitle1" fontWeight={600}>{exp.title}</Typography>
                  <Typography variant="body2" color="primary">{exp.company_name || exp.company}</Typography>
                  {exp.location && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {exp.location} {exp.is_remote && '(Remote)'}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {exp.start_date ? new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} 
                    {' - '} 
                    {exp.is_current ? 'Present' : (exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present')}
                  </Typography>
                  {exp.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>{exp.description}</Typography>
                  )}
                </Box>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <WorkIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary">No experience listed</Typography>
              </Box>
            )}
          </CardContent>
        </InfoCard>
      )}

      {activeTab === 3 && (
        <InfoCard>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Education
            </Typography>
            {candidate.education && candidate.education.length > 0 ? (
              candidate.education.map((edu: any, index: number) => (
                <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < candidate.education!.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {edu.degree}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}
                  </Typography>
                  <Typography variant="body2" color="primary">{edu.school_name || edu.institution}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {edu.start_year || ''} - {edu.end_year || 'Present'}
                  </Typography>
                  {edu.grade && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      Grade: {edu.grade}
                    </Typography>
                  )}
                  {edu.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>{edu.description}</Typography>
                  )}
                </Box>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <SchoolIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary">No education listed</Typography>
              </Box>
            )}
          </CardContent>
        </InfoCard>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ATSLayout>
  );
};

export default CandidateProfilePage;
