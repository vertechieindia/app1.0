import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';

// Button variants for our application with high-contrast colors
const StyledButton = styled(Button)<ButtonProps>(({ theme, variant = 'contained', color = 'primary' }) => ({
  fontWeight: 600,
  borderRadius: 8,
  textTransform: 'none',
  padding: '10px 24px',
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  
  // Primary contained button (blue background, white text)
  ...(variant === 'contained' && color === 'primary' && {
    backgroundColor: '#0077B5',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#0066A2',
    },
  }),
  
  // Secondary contained button (black background, white text)
  ...(variant === 'contained' && color === 'secondary' && {
    backgroundColor: '#202020',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#303030',
    },
  }),
  
  // Contained "success" button (dark silver background, black text)
  ...(variant === 'contained' && color === 'success' && {
    backgroundColor: '#C0C0C0',
    color: '#000000',
    '&:hover': {
      backgroundColor: '#D0D0D0',
    },
  }),
  
  // Contained "info" button (white background, black text)
  ...(variant === 'contained' && color === 'info' && {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    border: '1px solid #E0E0E0',
    '&:hover': {
      backgroundColor: '#F8F8F8',
    },
  }),
  
  // Outlined buttons (transparent with border, maintain good text contrast)
  ...(variant === 'outlined' && {
    backgroundColor: 'transparent',
    borderWidth: '2px',
    '&:hover': {
      borderWidth: '2px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    
    // Primary outlined (blue border and text)
    ...(color === 'primary' && {
      borderColor: '#0077B5',
      color: '#0077B5',
      '&:hover': {
        borderColor: '#0088CC',
        color: '#0088CC',
      },
    }),
    
    // Secondary outlined (silver border, white text)
    ...(color === 'secondary' && {
      borderColor: '#C0C0C0',
      color: '#FFFFFF',
      '&:hover': {
        borderColor: '#D0D0D0',
      },
    }),
  }),
  
  // Text buttons (maintain good contrast)
  ...(variant === 'text' && {
    padding: '6px 8px',
    
    // Primary text (blue text)
    ...(color === 'primary' && {
      color: '#0077B5',
      '&:hover': {
        backgroundColor: 'rgba(0, 119, 181, 0.08)',
      },
    }),
    
    // Secondary text (white text)
    ...(color === 'secondary' && {
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },
    }),
  }),
  
  // Disabled state
  '&.Mui-disabled': {
    opacity: 0.6,
    color: variant === 'contained' ? '#FFFFFF' : undefined,
  },
}));

export default StyledButton; 