import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
} from '@mui/material';
import {
  Person,
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
      route: '/signup?role=techie',
      color: '#1976d2',
    },
    {
      id: 'hiring-manager',
      title: 'Hiring Manager',
      description: 'Access verified tech talent and streamline your hiring process',
      icon: <Work sx={{ fontSize: 60, color: 'success.main' }} />,
      route: '/signup?role=hiring_manager',
      color: '#2e7d32',
    },
  ];

  const handleOptionSelect = (route: string) => {
    navigate(route);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 }, px: { xs: 1.5, sm: 2 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4, md: 6 },
          textAlign: 'center',
          maxWidth: { xs: '100%', sm: 600, md: 760 },
          mx: 'auto',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 2 }}>
          Join VerTechie
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Choose Tech Professional or Hiring Manager. Company and school pages are requested from Business after you sign in.
        </Typography>

        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          justifyContent="center"
          sx={{ maxWidth: 720, mx: 'auto' }}
        >
          {signupOptions.map((option) => (
            <Grid
              item
              xs={12}
              sm={10}
              md={6}
              key={option.id}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Card
                sx={{
                  height: '100%',
                  width: '100%',
                  maxWidth: { xs: '100%', sm: 420, md: 340 },
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
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default SignupSelection;
