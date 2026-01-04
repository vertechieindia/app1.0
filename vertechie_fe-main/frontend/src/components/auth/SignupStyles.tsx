import { styled } from '@mui/material/styles';
import { Box, Paper, Typography, Container } from '@mui/material';
import { alpha } from '@mui/material/styles';

export const SignupContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    marginTop: theme.spacing(8),
  },
}));

export const SignupPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
  },
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
}));

export const WarningBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.warning.light,
  border: `2px solid ${theme.palette.warning.main}`,
  borderRadius: theme.shape.borderRadius,
  '& ul': {
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(3),
  },
  '& li': {
    marginBottom: theme.spacing(1),
  },
}));

export const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const StepTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

export const OTPSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'flex-start',
  marginTop: theme.spacing(1),
}));

export const TermsBox = styled(Box)(({ theme }) => ({
  maxHeight: '200px',
  overflowY: 'auto',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.grey[100],
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[400],
    borderRadius: '4px',
  },
}));

export const RoleCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    borderColor: theme.palette.primary.main,
    '& .MuiTypography-h6': {
      color: theme.palette.primary.main,
    },
  },
  '&.selected': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    '& .MuiTypography-h6': {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
    '& .MuiTypography-body2': {
      color: theme.palette.text.primary,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      backgroundColor: theme.palette.primary.main,
    },
  },
  '& .MuiTypography-h6': {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    transition: 'color 0.2s ease',
  },
  '& .MuiTypography-body2': {
    color: theme.palette.text.secondary,
    transition: 'color 0.2s ease',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
    transition: 'transform 0.2s ease',
  },
  '&:hover .MuiSvgIcon-root': {
    transform: 'scale(1.1)',
  },
})); 