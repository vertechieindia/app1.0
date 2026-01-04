import { Components, Theme } from '@mui/material/styles';

// Button component overrides to ensure text visibility
export const buttonOverrides: Components<Omit<Theme, 'components'>> = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
      },
      // Primary contained buttons
      containedPrimary: {
        backgroundColor: '#0077B5',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#0066A2',
        },
      },
      // Secondary contained buttons
      containedSecondary: {
        backgroundColor: '#202020',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#303030',
        },
      },
      // Success contained buttons (silver with black text)
      containedSuccess: {
        backgroundColor: '#C0C0C0',
        color: '#000000',
        '&:hover': {
          backgroundColor: '#D0D0D0',
        },
      },
      // Info contained buttons (white with black text)
      containedInfo: {
        backgroundColor: '#FFFFFF',
        color: '#000000',
        '&:hover': {
          backgroundColor: '#F8F8F8',
        },
      },
      // Outlined buttons
      outlined: {
        borderWidth: '1px',
        '&:hover': {
          borderWidth: '1px',
        },
      },
      // Outlined primary
      outlinedPrimary: {
        borderColor: '#0077B5',
        color: '#0077B5',
      },
      // Outlined secondary
      outlinedSecondary: {
        borderColor: '#C0C0C0',
        color: '#FFFFFF',
      },
      // Text buttons
      text: {
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
      },
      // Text primary
      textPrimary: {
        color: '#0077B5',
      },
      // Text secondary
      textSecondary: {
        color: '#FFFFFF',
      },
    },
    defaultProps: {
      disableElevation: true,
    },
  },
}; 