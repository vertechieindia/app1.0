/**
 * LinkedIn-style Connect / Accept / Ignore / Pending / Message actions.
 */

import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import type { ConnectionButtonState, UserRelationship } from '../../utils/networkConnectionUi';

export interface ConnectionActionButtonsProps {
  userId: string;
  relationship?: UserRelationship;
  loading?: boolean;
  size?: 'small' | 'medium';
  onConnect: (userId: string) => void;
  onAccept: (requestId: string, userId: string) => void;
  onDecline: (requestId: string, userId: string) => void;
  onMessage?: (userId: string) => void;
  showMessageWhenConnected?: boolean;
}

const ConnectionActionButtons: React.FC<ConnectionActionButtonsProps> = ({
  userId,
  relationship,
  loading = false,
  size = 'small',
  onConnect,
  onAccept,
  onDecline,
  onMessage,
  showMessageWhenConnected = true,
}) => {
  const state: ConnectionButtonState = loading ? 'loading' : relationship?.state ?? 'connect';
  const requestId = relationship?.requestId;
  const btnSx = { borderRadius: 2, textTransform: 'none' as const, fontWeight: 600 };

  if (state === 'loading') {
    return (
      <Button size={size} variant="contained" disabled sx={{ ...btnSx, minWidth: 108 }}>
        <CircularProgress size={14} color="inherit" />
      </Button>
    );
  }

  if (state === 'pending_received' && requestId) {
    return (
      <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
        <Button
          size={size}
          variant="contained"
          sx={btnSx}
          onClick={() => onAccept(requestId, userId)}
        >
          Accept
        </Button>
        <Button
          size={size}
          variant="outlined"
          sx={btnSx}
          onClick={() => onDecline(requestId, userId)}
        >
          Ignore
        </Button>
      </Box>
    );
  }

  if (state === 'connected') {
    if (showMessageWhenConnected && onMessage) {
      return (
        <Button size={size} variant="outlined" color="success" sx={btnSx} onClick={() => onMessage(userId)}>
          Message
        </Button>
      );
    }
    return (
      <Button size={size} variant="outlined" color="success" disabled sx={{ ...btnSx, minWidth: 108 }}>
        Connected
      </Button>
    );
  }

  if (state === 'pending_sent') {
    return (
      <Button size={size} variant="outlined" disabled sx={{ ...btnSx, minWidth: 108 }}>
        Pending
      </Button>
    );
  }

  return (
    <Button
      size={size}
      variant="contained"
      sx={{ ...btnSx, minWidth: 108 }}
      startIcon={<PersonAdd />}
      onClick={() => onConnect(userId)}
    >
      Connect
    </Button>
  );
};

export default ConnectionActionButtons;
