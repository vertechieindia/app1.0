import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { SelectChangeEvent } from '@mui/material';

const SignupPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: '0 auto',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
}));

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

const TutorSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    expertise: '',
    experience: '',
    bio: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // TODO: Implement tutor signup logic
    navigate('/tutor-dashboard');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h1"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}
        >
          Become a VerTechie Tutor
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            color: 'text.secondary',
            mb: 4,
            fontSize: '1.1rem',
          }}
        >
          Share your expertise and help others learn
        </Typography>

        <SignupPaper>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <BoxGrid>
              <BoxGridItem xs={12}>
                <TextField
                  required
                  fullWidth
                  name="fullName"
                  label="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </BoxGridItem>
              <BoxGridItem xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </BoxGridItem>
              <BoxGridItem xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </BoxGridItem>
              <BoxGridItem xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </BoxGridItem>
              <BoxGridItem xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Area of Expertise</InputLabel>
                  <Select
                    value={formData.expertise}
                    name="expertise"
                    label="Area of Expertise"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="web-development">Web Development</MenuItem>
                    <MenuItem value="mobile-development">Mobile Development</MenuItem>
                    <MenuItem value="data-science">Data Science</MenuItem>
                    <MenuItem value="cloud-computing">Cloud Computing</MenuItem>
                  </Select>
                </FormControl>
              </BoxGridItem>
              <BoxGridItem xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Years of Experience"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleInputChange}
                />
              </BoxGridItem>
              <BoxGridItem xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Professional Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              </BoxGridItem>
              <BoxGridItem xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Create Tutor Account
                </Button>
              </BoxGridItem>
            </BoxGrid>
          </form>
        </SignupPaper>
      </Box>
    </Container>
  );
};

export default TutorSignup; 