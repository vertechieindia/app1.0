import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { RoleCard } from './SignupStyles';
import { PublicUserRole, PUBLIC_ROLES } from '../../types/auth';

interface RoleSelectionProps {
  selectedRole: PublicUserRole | null;
  onRoleSelect: (role: PublicUserRole) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({
  selectedRole,
  onRoleSelect,
}) => {
  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Grid container spacing={3} justifyContent="center">
        {PUBLIC_ROLES.map((role) => (
          <Grid item xs={12} sm={6} key={role.id}>
            <RoleCard
              className={selectedRole === role.id ? 'selected' : ''}
              onClick={() => onRoleSelect(role.id as PublicUserRole)}
            >
              <Typography variant="h6" gutterBottom>
                {role.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {role.description}
              </Typography>
            </RoleCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RoleSelection; 