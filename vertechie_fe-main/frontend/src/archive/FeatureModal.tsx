import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Fade } from '@mui/material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(2),
    maxWidth: '600px',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  '& .MuiTypography-root': {
    fontSize: '1.75rem',
    fontWeight: 700,
    background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
}));

interface FeatureModalProps {
  open: boolean;
  onClose: () => void;
  feature: 'freeEducation' | 'projectBased' | 'verifiedTutors' | 'communityLearning';
}

const featureContent = {
  freeEducation: {
    title: 'Free Education',
    description: 'All VerTechie courses are completely free — forever.',
    subtitle: 'We believe access to high-quality education should not be behind a paywall.',
    points: [
      'No ads',
      'No upsells',
      'No hidden charges'
    ],
    footer: 'Learn without interruption.'
  },
  projectBased: {
    title: 'Project-Based Learning',
    description: 'Theory is not enough.',
    subtitle: 'Learn by building real-world projects. Every course includes:',
    points: [
      'Interactive coding environments',
      'End-to-end project building',
      'Hands-on assignments'
    ],
    footer: 'Your code. Your output. Your proof of skills.'
  },
  verifiedTutors: {
    title: 'Verified Tutors',
    description: 'Every tutor on VerTechie is manually verified.',
    subtitle: '',
    points: [
      'No fake profiles',
      'No low-quality course dumps',
      'Only professionals, educators, and subject-matter experts'
    ],
    footer: 'Every course is reviewed before going live.'
  },
  communityLearning: {
    title: 'Community Learning',
    description: 'Learn with peers, not alone.',
    subtitle: '',
    points: [
      'Ask questions',
      'Join topic-based groups',
      'Get feedback from real humans',
      'Share your learning journey'
    ],
    footer: 'Build your network as you build your skills.'
  }
};

const FeatureModal: React.FC<FeatureModalProps> = ({ open, onClose, feature }) => {
  const content = featureContent[feature];

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 500 }}
      maxWidth="md"
      fullWidth
    >
      <StyledDialogTitle>
        <Typography variant="h4">
          {content.title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'grey.500',
          }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {content.description}
          </Typography>
          {content.subtitle && (
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {content.subtitle}
            </Typography>
          )}
        </Box>

        <List>
          {content.points.map((point, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={point}
                primaryTypographyProps={{
                  variant: 'body1',
                  fontWeight: 500
                }}
              />
            </ListItem>
          ))}
        </List>

        <Typography 
          variant="body1" 
          color="primary"
          sx={{ 
            mt: 3, 
            fontWeight: 500,
            fontStyle: 'italic'
          }}
        >
          {content.footer}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose}
          variant="contained"
          size="large"
          sx={{
            borderRadius: '50px',
            px: 4,
          }}
        >
          Got it
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default FeatureModal; 