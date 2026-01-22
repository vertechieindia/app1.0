import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Button, Divider, Chip, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

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
  const [userRole, setUserRole] = useState<string>('techie');
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
        
        // Determine user role from various possible fields
        const role = parsedData.role || parsedData.user_type || parsedData.role_type || 'techie';
        const groups = parsedData.groups || [];
        const isHRFromGroups = groups.some((g: any) => 
          g.name?.toLowerCase() === 'hr' || g.name?.toLowerCase() === 'hiring_manager'
        );
        
        // Set user role
        if (role.toLowerCase() === 'hr' || role.toLowerCase() === 'hiring_manager' || isHRFromGroups) {
          setUserRole('hr');
        } else if (role.toLowerCase() === 'company' || role.toLowerCase() === 'company_admin') {
          setUserRole('company');
        } else if (role.toLowerCase() === 'school' || role.toLowerCase() === 'school_admin') {
          setUserRole('school');
        } else {
          setUserRole('techie');
        }
        
        // Check profile completion status (only relevant for techies)
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

          {/* Role-Based Content Section */}
          <Divider sx={{ my: 3 }} />
          
          {userRole === 'hr' ? (
            /* HR / Hiring Manager Content */
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'left' }}>
                Hiring Manager Application Status
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'left' }}>
                Your Hiring Manager application is currently under review. Our HR Admin team will verify your company details and credentials.
              </Typography>
              
              {/* Status Info Cards */}
              <ProfileSection sx={{ cursor: 'default', '&:hover': { transform: 'none' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <BusinessIcon sx={{ color: 'info.main' }} />
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Company Verification
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your company details are being verified
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  icon={<PendingIcon />} 
                  label="Pending" 
                  color="warning" 
                  size="small" 
                  variant="outlined"
                />
              </ProfileSection>

              <ProfileSection sx={{ cursor: 'default', '&:hover': { transform: 'none' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <VerifiedUserIcon sx={{ color: 'info.main' }} />
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      HR Credentials
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your hiring manager credentials are being reviewed
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  icon={<PendingIcon />} 
                  label="Pending" 
                  color="warning" 
                  size="small" 
                  variant="outlined"
                />
              </ProfileSection>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(25, 118, 210, 0.08)', borderRadius: 2, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <EmailIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={600}>
                    What's Next?
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  You will receive an email notification once your application is approved. After approval, you can:
                </Typography>
                <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Post job listings for your company
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Review and manage candidate applications
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Access the Applicant Tracking System (ATS)
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : userRole === 'company' ? (
            /* Company Admin Content */
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'left' }}>
                Company Registration Status
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'left' }}>
                Your company registration is being verified. We'll review your company details and get back to you shortly.
              </Typography>
              
              <ProfileSection sx={{ cursor: 'default', '&:hover': { transform: 'none' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <BusinessIcon sx={{ color: 'info.main' }} />
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Company Verification
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your company is being verified
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  icon={<PendingIcon />} 
                  label="Pending" 
                  color="warning" 
                  size="small" 
                  variant="outlined"
                />
              </ProfileSection>
            </Box>
          ) : userRole === 'school' ? (
            /* School Admin Content */
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'left' }}>
                School Registration Status
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'left' }}>
                Your school registration is being verified. We'll review your institution details and get back to you shortly.
              </Typography>
              
              <ProfileSection sx={{ cursor: 'default', '&:hover': { transform: 'none' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SchoolIcon sx={{ color: 'info.main' }} />
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Institution Verification
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your institution is being verified
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  icon={<PendingIcon />} 
                  label="Pending" 
                  color="warning" 
                  size="small" 
                  variant="outlined"
                />
              </ProfileSection>
            </Box>
          ) : (
            /* Techie Content - Original Education & Experience */
            <Box>
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
            </Box>
          )}

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

