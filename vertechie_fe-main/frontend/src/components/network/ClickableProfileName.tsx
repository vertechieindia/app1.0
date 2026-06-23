/**
 * Clickable user name / avatar that navigates to public profile.
 */

import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { Verified } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getProfilePath } from '../../utils/networkConnectionUi';

interface ClickableProfileNameProps {
  userId: string;
  name: string;
  avatar?: string;
  title?: string;
  subtitle?: string;
  isVerified?: boolean;
  avatarSize?: number;
  showAvatar?: boolean;
}

const ClickableProfileName: React.FC<ClickableProfileNameProps> = ({
  userId,
  name,
  avatar,
  title,
  subtitle,
  isVerified,
  avatarSize = 48,
  showAvatar = true,
}) => {
  const navigate = useNavigate();
  const go = () => navigate(getProfilePath(userId));

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={go}>
      {showAvatar && (
        <Avatar
          src={avatar?.trim() ? avatar : undefined}
          sx={{ bgcolor: 'primary.main', width: avatarSize, height: avatarSize, flexShrink: 0 }}
        >
          {!avatar?.trim() ? name.charAt(0) : null}
        </Avatar>
      )}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            '&:hover': { color: 'primary.main', textDecoration: 'underline' },
          }}
        >
          {name}
          {isVerified && <Verified sx={{ fontSize: 14, color: 'primary.main' }} />}
        </Typography>
        {title && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="caption" color="text.secondary" display="block">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ClickableProfileName;
