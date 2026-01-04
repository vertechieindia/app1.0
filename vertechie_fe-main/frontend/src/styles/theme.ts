import { createTheme, alpha } from '@mui/material/styles';

// Extend the palette types
declare module '@mui/material/styles' {
  interface TypeBackground {
    gradient: string;
    alt: string;
    dark: string;
    darkGradient: string;
  }
  interface Palette {
    hero: {
      primary: string;
      secondary: string;
      accent: string;
      light: string;
      gradient: string;
      darkGradient: string;
    };
  }
  interface PaletteOptions {
    hero?: {
      primary: string;
      secondary: string;
      accent: string;
      light: string;
      gradient: string;
      darkGradient: string;
    };
  }
}

// VerTechie Hero-inspired color palette
// Based on Hero section: Deep blues, navy, and cyan accents
const colors = {
  primary: {
    main: '#0d47a1', // Hero primary blue
    light: '#5AC8FA', // Hero accent cyan
    dark: '#1a237e', // Hero deep indigo
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#0077B5', // LinkedIn blue / VerTechie brand
    light: '#42A5F5',
    dark: '#003366', // Hero dark navy
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#34C759',
    light: '#4CD964',
    dark: '#28BD4C',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#FF3B30',
    light: '#FF453A',
    dark: '#D70015',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FF9500',
    light: '#FFCC00',
    dark: '#FF8000',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#5AC8FA', // Hero cyan accent
    light: '#90CAF9',
    dark: '#0077B5',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
    alt: '#F5F7FA',
    dark: '#001F3F',
    darkGradient: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)',
  },
  text: {
    primary: '#1a237e', // Deep indigo for primary text
    secondary: '#0d47a1', // Hero blue for secondary
    disabled: '#9CA3AF',
  },
  // Hero section specific colors
  hero: {
    primary: '#0d47a1', // Main hero blue
    secondary: '#1a237e', // Deep indigo
    accent: '#5AC8FA', // Cyan accent
    light: '#90CAF9', // Light blue
    gradient: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
    darkGradient: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)',
  },
};

// Fixed shadows array length to match MUI's expected 25 shadows
const shadows = [
  'none',
  '0px 1px 3px rgba(0, 0, 0, 0.08)',
  '0px 2px 4px rgba(0, 0, 0, 0.08)',
  '0px 4px 8px rgba(0, 0, 0, 0.08)',
  '0px 6px 12px rgba(0, 0, 0, 0.08)',
  '0px 8px 16px rgba(0, 0, 0, 0.08)',
  '0px 12px 24px rgba(0, 0, 0, 0.08)',
  '0px 16px 32px rgba(0, 0, 0, 0.08)',
  '0px 20px 40px rgba(0, 0, 0, 0.08)',
  '0px 24px 48px rgba(0, 0, 0, 0.08)',
  '0px 28px 56px rgba(0, 0, 0, 0.08)',
  '0px 32px 64px rgba(0, 0, 0, 0.08)',
  '0px 36px 72px rgba(0, 0, 0, 0.08)',
  '0px 40px 80px rgba(0, 0, 0, 0.08)',
  '0px 44px 88px rgba(0, 0, 0, 0.08)',
  '0px 48px 96px rgba(0, 0, 0, 0.08)',
  '0px 52px 104px rgba(0, 0, 0, 0.08)',
  '0px 56px 112px rgba(0, 0, 0, 0.08)',
  '0px 60px 120px rgba(0, 0, 0, 0.08)',
  '0px 64px 128px rgba(0, 0, 0, 0.08)',
  '0px 68px 136px rgba(0, 0, 0, 0.08)',
  '0px 72px 144px rgba(0, 0, 0, 0.08)',
  '0px 76px 152px rgba(0, 0, 0, 0.08)',
  '0px 80px 160px rgba(0, 0, 0, 0.08)',
  '0px 84px 168px rgba(0, 0, 0, 0.08)', // Added 25th shadow
];

// VerTechie Hero-inspired theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    grey: colors.grey,
    background: colors.background as any,
    text: colors.text,
    hero: colors.hero,
  },
  typography: {
    fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1.125rem',
      letterSpacing: '0',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      letterSpacing: '0.1px',
      lineHeight: 1.57,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.4px',
      lineHeight: 1.75,
      textTransform: 'none',
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      letterSpacing: '0.4px',
      lineHeight: 1.66,
    },
    overline: {
      fontWeight: 600,
      fontSize: '0.75rem',
      letterSpacing: '1px',
      lineHeight: 2.66,
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: shadows as unknown as any,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          '&.MuiPaper-elevation1': {
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.05)',
          },
        },
        outlined: {
          borderColor: colors.grey[200],
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 2px 12px rgba(13, 71, 161, 0.15)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 500,
          '&.MuiChip-colorPrimary': {
            background: alpha(colors.primary.main, 0.1),
            color: colors.primary.main,
          },
          '&.MuiChip-colorSecondary': {
            background: alpha(colors.secondary.main, 0.1),
            color: colors.secondary.main,
          },
          '&.MuiChip-colorSuccess': {
            background: alpha(colors.success.main, 0.1),
            color: colors.success.main,
          },
          '&.MuiChip-colorError': {
            background: alpha(colors.error.main, 0.1),
            color: colors.error.main,
          },
          '&.MuiChip-colorWarning': {
            background: alpha(colors.warning.main, 0.1),
            color: colors.warning.main,
          },
          '&.MuiChip-colorInfo': {
            background: alpha(colors.info.main, 0.1),
            color: colors.info.main,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: `2px solid ${colors.grey[100]}`,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.grey[200],
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(colors.grey[900], 0.6),
          backdropFilter: 'blur(5px)',
        },
      },
    },
  },
});

export default theme; 