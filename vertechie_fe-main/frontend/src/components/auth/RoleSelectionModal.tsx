import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { PUBLIC_ROLES, PublicUserRole } from '../../types/auth';

const RoleButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

interface RoleSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onRoleSelect: (role: PublicUserRole) => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  open,
  onClose,
  onRoleSelect,
}) => {
  const theme = useTheme();

  const getRoleIcon = (roleId: PublicUserRole) => {
    switch (roleId) {
      case 'techie':
        return <PersonIcon fontSize="large" />;
      case 'hiring_manager':
        return <WorkIcon fontSize="large" />;
      case 'company':
        return <BusinessIcon fontSize="large" />;
      case 'school':
        return <SchoolIcon fontSize="large" />;
      default:
        return <PersonIcon fontSize="large" />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
          Who are you signing up as?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 4, textAlign: 'center' }}>
          Select your role to begin the verification process
        </DialogContentText>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {PUBLIC_ROLES.map((role) => (
            <RoleButton
              key={role.id}
              variant="outlined"
              onClick={() => onRoleSelect(role.id as PublicUserRole)}
              sx={{
                borderColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                  borderColor: theme.palette.primary.dark,
                },
              }}
            >
              {getRoleIcon(role.id as PublicUserRole)}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {role.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {role.description}
              </Typography>
            </RoleButton>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelectionModal; 