/**
 * ProfileCompletion - Complete Profile After Signup Approval
 * Shows progress and allows adding skills after first login
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Alert,
  Snackbar,
  Avatar,
  IconButton,
  Divider,
} from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import { getApiUrl } from '../../config/api';

// Theme Colors
const colors = {
  primary: '#0d47a1',
  primaryDark: '#1a237e',
  primaryLight: '#5AC8FA',
  secondary: '#0077B5',
  accent: '#5AC8FA',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: `linear-gradient(160deg, #e8eef7 0%, #f0f4fa 30%, #f5f7fa 60%, #fafbfd 100%)`,
  paddingTop: 40,
  paddingBottom: 40,
});

const WelcomeCard = styled(Paper)({
  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 50%, ${colors.primaryDark} 100%)`,
  borderRadius: 24,
  padding: '40px',
  color: 'white',
  marginBottom: '32px',
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeInUp} 0.6s ease-out`,
  boxShadow: `0 20px 60px ${colors.primary}40`,
});

const ProgressCard = styled(Paper)({
  borderRadius: 20,
  padding: '32px',
  marginBottom: '24px',
  animation: `${fadeInUp} 0.6s ease-out`,
  boxShadow: `0 10px 40px ${colors.primary}10`,
});

const StepItem = styled(Box)<{ completed?: boolean; active?: boolean }>(({ completed, active }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '16px 20px',
  marginBottom: '12px',
  borderRadius: 12,
  cursor: active ? 'pointer' : 'default',
  transition: 'all 0.3s ease',
  background: completed ? alpha(colors.success, 0.08) : active ? alpha(colors.primary, 0.08) : '#f5f5f5',
  border: `2px solid ${completed ? colors.success : active ? colors.primary : 'transparent'}`,
  '&:hover': active ? {
    transform: 'translateX(8px)',
    boxShadow: `0 4px 20px ${colors.primary}20`,
  } : {},
}));

const SkillChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  margin: 4,
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  background: selected ? colors.primary : alpha(colors.primary, 0.08),
  color: selected ? 'white' : colors.primary,
  '&:hover': {
    background: selected ? colors.primaryDark : alpha(colors.primary, 0.15),
    transform: 'scale(1.05)',
  },
}));

// Predefined Skills by Category
const SKILL_CATEGORIES = {
  'Frontend': ['React', 'Angular', 'Vue.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Next.js', 'Redux', 'Svelte'],
  'Backend': ['Python', 'Node.js', 'Java', 'Go', 'Rust', 'C#', '.NET', 'Ruby', 'PHP', 'Django', 'FastAPI', 'Express.js', 'Spring Boot'],
  'Database': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Oracle', 'SQL Server', 'DynamoDB', 'Cassandra'],
  'DevOps': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins', 'GitLab CI', 'Terraform', 'Ansible', 'Linux'],
  'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Xamarin'],
  'Data & AI': ['Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Data Science', 'NLP', 'Computer Vision', 'LLMs'],
  'Tools': ['Git', 'VS Code', 'Jira', 'Figma', 'Postman', 'Slack', 'Notion'],
};

const ALL_SKILLS = Object.values(SKILL_CATEGORIES).flat();

const ProfileCompletion: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showSkillsDialog, setShowSkillsDialog] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Calculate completion progress
  const calculateProgress = useCallback(() => {
    let completed = 0;
    let total = 5;

    // Personal Info (from registration)
    if (userData?.first_name && userData?.last_name) completed++;
    
    // Work Experience
    if (experiences.length > 0) completed++;
    
    // Education
    if (educations.length > 0) completed++;
    
    // Skills (minimum 3)
    if (selectedSkills.length >= 3) completed++;
    
    // Profile Photo
    if (profileData?.avatar_url) completed++;

    return { completed, total, percentage: Math.round((completed / total) * 100) };
  }, [userData, experiences, educations, selectedSkills, profileData]);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        // Fetch user data
        const userRes = await fetch(getApiUrl('/users/me/'), { headers });
        if (userRes.ok) {
          const user = await userRes.json();
          setUserData(user);
        }

        // Fetch profile
        const profileRes = await fetch(getApiUrl('/users/me/profile'), { headers });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setProfileData(profile);
          setSelectedSkills(profile.skills || []);
        }

        // Fetch experiences
        const expRes = await fetch(getApiUrl('/users/me/experiences'), { headers });
        if (expRes.ok) {
          const exps = await expRes.json();
          setExperiences(exps);
        }

        // Fetch educations
        const eduRes = await fetch(getApiUrl('/users/me/educations'), { headers });
        if (eduRes.ok) {
          const edus = await eduRes.json();
          setEducations(edus);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Toggle skill selection
  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  // Add custom skill
  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  // Save skills to backend
  const handleSaveSkills = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl('/users/me/profile'), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skills: selectedSkills }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Skills saved successfully!', severity: 'success' });
        setShowSkillsDialog(false);
        
        // Mark profile completion as done
        localStorage.setItem('profileCompletionShown', 'true');
      } else {
        throw new Error('Failed to save skills');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save skills', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Continue to dashboard
  const handleContinue = () => {
    localStorage.setItem('profileCompletionShown', 'true');
    navigate('/techie/home/feed');
  };

  // Complete Later
  const handleCompleteLater = () => {
    localStorage.setItem('profileCompletionShown', 'true');
    navigate('/techie/home/feed');
  };

  const progress = calculateProgress();

  if (loading) {
    return (
      <PageContainer>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography>Loading...</Typography>
          </Box>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="md">
        {/* Welcome Card */}
        <WelcomeCard elevation={0}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            🎉 Welcome to VerTechie, {userData?.first_name}!
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Complete your profile to get better job matches and stand out to recruiters.
          </Typography>
        </WelcomeCard>

        {/* Progress Card */}
        <ProgressCard elevation={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>Profile Completion</Typography>
            <Typography variant="h5" fontWeight={700} color="primary">{progress.percentage}%</Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={progress.percentage} 
            sx={{ 
              height: 12, 
              borderRadius: 6,
              backgroundColor: alpha(colors.primary, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 6,
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
              }
            }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {progress.completed} of {progress.total} steps completed
          </Typography>
        </ProgressCard>

        {/* Steps */}
        <ProgressCard elevation={0}>
          <Typography variant="h6" fontWeight={600} gutterBottom>Complete These Steps</Typography>
          
          <StepItem completed={!!userData?.first_name}>
            {userData?.first_name ? (
              <CheckCircleIcon sx={{ color: colors.success, mr: 2 }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ color: '#ccc', mr: 2 }} />
            )}
            <PersonIcon sx={{ color: colors.primary, mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600}>Personal Information</Typography>
              <Typography variant="body2" color="text.secondary">Name, email, phone</Typography>
            </Box>
            <CheckCircleIcon sx={{ color: colors.success }} />
          </StepItem>

          <StepItem completed={experiences.length > 0}>
            {experiences.length > 0 ? (
              <CheckCircleIcon sx={{ color: colors.success, mr: 2 }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ color: '#ccc', mr: 2 }} />
            )}
            <WorkIcon sx={{ color: colors.primary, mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600}>Work Experience</Typography>
              <Typography variant="body2" color="text.secondary">
                {experiences.length > 0 ? `${experiences.length} experience(s) added` : 'Add your work history'}
              </Typography>
            </Box>
            {experiences.length > 0 ? (
              <CheckCircleIcon sx={{ color: colors.success }} />
            ) : (
              <Button size="small" onClick={() => navigate('/techie/profile')}>Add</Button>
            )}
          </StepItem>

          <StepItem completed={educations.length > 0}>
            {educations.length > 0 ? (
              <CheckCircleIcon sx={{ color: colors.success, mr: 2 }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ color: '#ccc', mr: 2 }} />
            )}
            <SchoolIcon sx={{ color: colors.primary, mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600}>Education</Typography>
              <Typography variant="body2" color="text.secondary">
                {educations.length > 0 ? `${educations.length} education(s) added` : 'Add your education'}
              </Typography>
            </Box>
            {educations.length > 0 ? (
              <CheckCircleIcon sx={{ color: colors.success }} />
            ) : (
              <Button size="small" onClick={() => navigate('/techie/profile')}>Add</Button>
            )}
          </StepItem>

          <StepItem 
            completed={selectedSkills.length >= 3} 
            active={selectedSkills.length < 3}
            onClick={() => setShowSkillsDialog(true)}
          >
            {selectedSkills.length >= 3 ? (
              <CheckCircleIcon sx={{ color: colors.success, mr: 2 }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ color: colors.warning, mr: 2 }} />
            )}
            <CodeIcon sx={{ color: colors.primary, mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600}>Skills</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedSkills.length > 0 
                  ? `${selectedSkills.length} skill(s) added${selectedSkills.length < 3 ? ' - Add at least 3' : ''}`
                  : 'Add at least 3 skills'}
              </Typography>
            </Box>
            <Button 
              size="small" 
              variant={selectedSkills.length < 3 ? 'contained' : 'outlined'}
              sx={{ animation: selectedSkills.length < 3 ? `${pulse} 2s infinite` : 'none' }}
            >
              {selectedSkills.length >= 3 ? 'Edit' : 'Add Skills'}
            </Button>
          </StepItem>

          <StepItem completed={!!profileData?.avatar_url}>
            {profileData?.avatar_url ? (
              <CheckCircleIcon sx={{ color: colors.success, mr: 2 }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ color: '#ccc', mr: 2 }} />
            )}
            <PhotoCameraIcon sx={{ color: colors.primary, mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600}>Profile Photo</Typography>
              <Typography variant="body2" color="text.secondary">Add a professional photo</Typography>
            </Box>
            {profileData?.avatar_url ? (
              <Avatar src={profileData.avatar_url} sx={{ width: 40, height: 40 }} />
            ) : (
              <Button size="small" onClick={() => navigate('/techie/profile')}>Add</Button>
            )}
          </StepItem>
        </ProgressCard>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            size="large"
            onClick={handleCompleteLater}
            sx={{ borderRadius: 3, px: 4 }}
          >
            Complete Later
          </Button>
          <Button 
            variant="contained" 
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={handleContinue}
            sx={{ 
              borderRadius: 3, 
              px: 4,
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
            }}
          >
            Continue to Dashboard
          </Button>
        </Box>

        {/* Skills Dialog */}
        <Dialog 
          open={showSkillsDialog} 
          onClose={() => setShowSkillsDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>Select Your Skills</Typography>
            <IconButton onClick={() => setShowSkillsDialog(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 3 }}>
              Select at least 3 skills to help recruiters find you for matching jobs.
            </Alert>

            {/* Custom skill input */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Type a custom skill..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
                size="small"
              />
              <Button variant="outlined" onClick={handleAddCustomSkill}>Add</Button>
            </Box>

            {/* Selected skills */}
            {selectedSkills.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Selected ({selectedSkills.length}):
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedSkills.map(skill => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={() => handleSkillToggle(skill)}
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Skills by category */}
            {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
              <Box key={category} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: colors.primary }}>
                  {category}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {skills.map(skill => (
                    <SkillChip
                      key={skill}
                      label={skill}
                      selected={selectedSkills.includes(skill)}
                      onClick={() => handleSkillToggle(skill)}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setShowSkillsDialog(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleSaveSkills}
              disabled={saving || selectedSkills.length < 3}
            >
              {saving ? 'Saving...' : `Save Skills (${selectedSkills.length})`}
            </Button>
          </DialogActions>
        </Dialog>

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
      </Container>
    </PageContainer>
  );
};

export default ProfileCompletion;
