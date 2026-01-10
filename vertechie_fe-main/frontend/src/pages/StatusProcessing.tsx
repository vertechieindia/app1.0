import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Button, Divider, Chip, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const StatusContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
}));

const StatusPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  textAlign: 'center',
}));

// Profile section card
const ProfileSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  background: 'rgba(25, 118, 210, 0.05)',
  border: '1px solid rgba(25, 118, 210, 0.1)',
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(25, 118, 210, 0.1)',
    border: '1px solid rgba(25, 118, 210, 0.2)',
    transform: 'translateX(4px)',
  },
}));

const StatusProcessing = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [profileCompletion, setProfileCompletion] = useState({
    hasExperience: false,
    hasSkills: false,
    hasEducation: false,
  });

  useEffect(() => {
    // Load user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        
        // Check profile completion status
        // This would ideally come from an API, but for now we check localStorage
        const formData = sessionStorage.getItem('signupFormData');
        if (formData) {
          const parsed = JSON.parse(formData);
          setProfileCompletion({
            hasExperience: parsed.experience && parsed.experience.length > 0,
            hasSkills: parsed.skills && parsed.skills.length > 0,
            hasEducation: parsed.education && parsed.education.length > 0,
          });
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear all auth tokens and user data
    localStorage.removeItem('vertechie_access_token');
    localStorage.removeItem('vertechie_refresh_token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    // Navigate to home/login
    navigate('/');
  };

  const handleCompleteProfile = (section: 'experience' | 'skills' | 'education') => {
    navigate(`/complete-profile?section=${section}`);
  };

  const completedCount = [
    profileCompletion.hasExperience,
    profileCompletion.hasSkills,
    profileCompletion.hasEducation,
  ].filter(Boolean).length;

  const completionPercentage = Math.round((completedCount / 3) * 100);

  return (
    <StatusContainer maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <StatusPaper elevation={3}>
          <HourglassEmptyIcon
            sx={{
              fontSize: 64,
              color: 'warning.main',
              mb: 3,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 1,
                },
                '50%': {
                  opacity: 0.5,
                },
              },
            }}
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 3, fontWeight: 700 }}
          >
            Your Account is Being Processed
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Your account is currently under review. Our team is verifying your information and will get back to you shortly.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This process typically takes 1-2 business days. We appreciate your patience as we ensure the quality and authenticity of our platform.
          </Typography>

          {/* Profile Completion Section */}
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'left' }}>
            Complete Your Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
            While you wait, you can complete your profile to help us understand your skills better.
          </Typography>
          
          {/* Progress Bar */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Profile Completion
              </Typography>
              <Typography variant="body2" color="primary" fontWeight={600}>
                {completionPercentage}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={completionPercentage} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                },
              }}
            />
          </Box>

          {/* Experience Section */}
          <ProfileSection onClick={() => handleCompleteProfile('experience')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WorkIcon sx={{ color: 'primary.main' }} />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Work Experience
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add your professional experience
                </Typography>
              </Box>
            </Box>
            {profileCompletion.hasExperience ? (
              <Chip 
                icon={<CheckCircleIcon />} 
                label="Added" 
                color="success" 
                size="small" 
                variant="outlined"
              />
            ) : (
              <Chip 
                icon={<PendingIcon />} 
                label="Add Now" 
                color="primary" 
                size="small" 
                variant="outlined"
              />
            )}
          </ProfileSection>

          {/* Education Section */}
          <ProfileSection onClick={() => handleCompleteProfile('education')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SchoolIcon sx={{ color: 'primary.main' }} />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Education
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add your educational background
                </Typography>
              </Box>
            </Box>
            {profileCompletion.hasEducation ? (
              <Chip 
                icon={<CheckCircleIcon />} 
                label="Added" 
                color="success" 
                size="small" 
                variant="outlined"
              />
            ) : (
              <Chip 
                icon={<PendingIcon />} 
                label="Add Now" 
                color="primary" 
                size="small" 
                variant="outlined"
              />
            )}
          </ProfileSection>

          <Divider sx={{ my: 3 }} />

          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              borderRadius: '50px',
              px: 4,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            Logout
          </Button>
        </StatusPaper>
      </Box>
    </StatusContainer>
  );
};

export default StatusProcessing;

