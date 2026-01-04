import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import {
  Person,
  Business,
  School,
  Work,
} from '@mui/icons-material';

const SignupSelection: React.FC = () => {
  const navigate = useNavigate();

  const signupOptions = [
    {
      id: 'techie',
      title: 'Tech Professional',
      description: 'Join as a verified tech professional to showcase your skills and connect with top companies',
      icon: <Person sx={{ fontSize: 60, color: 'primary.main' }} />,
      route: '/signup/techie',
      color: '#1976d2',
    },
    {
      id: 'hiring-manager',
      title: 'Hiring Manager',
      description: 'Access verified tech talent and streamline your hiring process',
      icon: <Work sx={{ fontSize: 60, color: 'success.main' }} />,
      route: '/signup/hiring-manager',
      color: '#2e7d32',
    },
    {
      id: 'school',
      title: 'Educational Institution',
      description: 'Partner with us to provide opportunities for your students and alumni',
      icon: <School sx={{ fontSize: 60, color: 'warning.main' }} />,
      route: '/signup/school',
      color: '#ed6c02',
    },
    {
      id: 'company',
      title: 'Company',
      description: 'Join our network of companies looking for verified tech talent',
      icon: <Business sx={{ fontSize: 60, color: 'error.main' }} />,
      route: '/signup/company',
      color: '#d32f2f',
    },
  ];

  const handleOptionSelect = (route: string) => {
    navigate(route);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 2 }}>
          Join VerTechie
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Choose your account type to get started
        </Typography>

        <Grid container spacing={4}>
          {signupOptions.map((option) => (
            <Grid item xs={12} sm={6} md={3} key={option.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                  cursor: 'pointer',
                }}
                onClick={() => handleOptionSelect(option.route)}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {option.icon}
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {option.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: option.color,
                      '&:hover': {
                        backgroundColor: option.color,
                        opacity: 0.9,
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionSelect(option.route);
                    }}
                  >
                    Get Started
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Button
              variant="text"
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Sign In
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupSelection;

