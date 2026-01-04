import React from 'react';
import { Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { WarningBox } from './SignupStyles';

const WarningSection: React.FC = () => {
  return (
    <WarningBox>
      <Typography
        variant="h6"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'warning.dark',
          mb: 2,
        }}
      >
        <WarningIcon /> Important Notice
      </Typography>

      <Typography variant="body1" paragraph>
        Providing fake or misleading information is strictly prohibited.
      </Typography>

      <Typography variant="body2" paragraph>
        All your submitted information—including education, experience, skills, and
        visa status—will be verified thoroughly using manual checks, automated
        validation, third-party APIs, and government or institutional databases.
      </Typography>

      <Typography variant="body2" sx={{ mb: 1 }}>
        Any false or misleading information or misuse of this platform will lead
        to:
      </Typography>

      <ul>
        <li>
          <Typography variant="body2">
            Permanent ban of your profile
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Lifetime blacklisting shared across our partner organizations
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Legal penalties ranging from $100,000 to $1,000,000 depending on
            severity
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            Your profile will permanently appear in the public Blocklisted
            Candidates Database, accessible by companies globally
          </Typography>
        </li>
      </ul>

      <Typography
        variant="body1"
        sx={{
          mt: 2,
          fontWeight: 500,
          textAlign: 'center',
          color: 'warning.dark',
        }}
      >
        Honesty matters. Be genuine. Be the change.
      </Typography>
    </WarningBox>
  );
};

export default WarningSection; 