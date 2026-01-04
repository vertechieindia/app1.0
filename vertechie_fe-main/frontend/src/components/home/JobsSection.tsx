import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const SectionWrapper = styled(Box)(({ theme }) => ({
  backgroundImage: 'url("/images/backgrounds/grid-background.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  padding: theme.spacing(4, 0),
  backgroundColor: '#0066A2', // Darker blue background
  position: 'relative',
  overflow: 'hidden',
}));

const BackgroundOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundSize: '30px 30px',
  backgroundImage: `
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
  `,
  zIndex: 1,
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
}));

// High-visibility button
const ActionButton = styled(Button)(({ theme }) => ({
  padding: '15px 40px',
  fontSize: '1.1rem',
  borderRadius: 40,
  backgroundColor: '#FFFFFF',
  color: '#000000',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    backgroundColor: '#F0F0F0',
    transform: 'translateY(-2px)',
    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const JobsSection: React.FC = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/signup');
  };

  return (
    <SectionWrapper>
      <BackgroundOverlay />
      <Container maxWidth="lg">
        <ContentWrapper>
          <ActionButton 
            variant="contained" 
            color="primary"
            onClick={handleExploreClick}
          >
            Explore Open Roles
          </ActionButton>
        </ContentWrapper>
      </Container>
    </SectionWrapper>
  );
};

export default JobsSection; 