/**
 * EXAMPLE: How to integrate the new modular signup architecture
 * 
 * This shows how to refactor the main Signup.tsx to use the new structure.
 * Copy this pattern and adapt it to your existing Signup.tsx file.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import TechieSignupFlow from './flows/TechieSignupFlow';
import { SignupType, SignupLocation } from './types';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';

/**
 * Example refactored Signup component
 * 
 * This replaces the monolithic Signup.tsx with a modular approach:
 * 1. Role selection (existing)
 * 2. Location selection (for Techie only)
 * 3. Flow rendering (new modular flows)
 */
const SignupExample: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<SignupType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SignupLocation | null>(null);

  // Role selection options
  const roleOptions = [
    {
      id: 'techie' as SignupType,
      title: 'Tech Professional',
      description: 'Join as a verified tech professional',
      icon: <PersonIcon sx={{ fontSize: 60 }} />,
      color: '#1976d2',
    },
    {
      id: 'hr' as SignupType,
      title: 'Hiring Manager',
      description: 'Access verified tech talent',
      icon: <WorkIcon sx={{ fontSize: 60 }} />,
      color: '#2e7d32',
    },
    {
      id: 'company' as SignupType,
      title: 'Company',
      description: 'Join our network of companies',
      icon: <BusinessIcon sx={{ fontSize: 60 }} />,
      color: '#d32f2f',
    },
    {
      id: 'school' as SignupType,
      title: 'Educational Institution',
      description: 'Partner with us',
      icon: <SchoolIcon sx={{ fontSize: 60 }} />,
      color: '#ed6c02',
    },
  ];

  // Handle signup completion
  const handleSignupComplete = async (data: any) => {
    try {
      // TODO: Submit to API
      console.log('Signup data:', data);
      
      // Navigate to success page
      navigate('/signup-success');
    } catch (error: any) {
      console.error('Signup error:', error);
      // Error handling will be done in the flow component
      throw error;
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    setSelectedRole(null);
    setSelectedLocation(null);
  };

  // Step 1: Role Selection
  if (!selectedRole) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            Join VerTechie
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Choose your role to begin the registration process
          </Typography>

          <Grid container spacing={3}>
            {roleOptions.map((option) => (
              <Grid item xs={12} sm={6} md={3} key={option.id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    border: selectedRole === option.id ? `3px solid ${option.color}` : '2px solid transparent',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                      border: `3px solid ${option.color}`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setSelectedRole(option.id)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ color: option.color, mb: 2 }}>{option.icon}</Box>
                    <Typography variant="h6" gutterBottom>
                      {option.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  // Step 2: Location Selection (for Techie only)
  if (selectedRole === 'techie' && !selectedLocation) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom>
            Select Your Location
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  p: 4,
                  cursor: 'pointer',
                  border: selectedLocation === 'US' ? '3px solid #1976d2' : '2px solid #e0e0e0',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
                onClick={() => setSelectedLocation('US')}
              >
                <Typography variant="h2" sx={{ color: '#1976d2', textAlign: 'center', mb: 2 }}>
                  US
                </Typography>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                  United States
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  p: 4,
                  cursor: 'pointer',
                  border: selectedLocation === 'IN' ? '3px solid #138808' : '2px solid #e0e0e0',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
                onClick={() => setSelectedLocation('IN')}
              >
                <Typography variant="h2" sx={{ color: '#138808', textAlign: 'center', mb: 2 }}>
                  IN
                </Typography>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                  India
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="outlined" onClick={() => setSelectedRole(null)}>
              Back to Role Selection
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  // Step 3: Render Appropriate Flow
  return (
    <>
      {selectedRole === 'techie' && selectedLocation && (
        <TechieSignupFlow
          location={selectedLocation}
          onComplete={handleSignupComplete}
          onCancel={handleCancel}
        />
      )}

      {/* Add other signup types as you create them */}
      {/* 
      {selectedRole === 'hr' && (
        <HRSignupFlow
          location={selectedLocation || 'US'} // Default or handle selection
          onComplete={handleSignupComplete}
          onCancel={handleCancel}
        />
      )}
      */}
    </>
  );
};

export default SignupExample;

