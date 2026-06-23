import React from 'react';
import { Box, IconButton, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HistoryIcon from '@mui/icons-material/History';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useMyInterviews, type MyInterviewsTab } from '../../contexts/MyInterviewsContext';

const TABS: { id: MyInterviewsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'upcoming', label: 'Upcoming', icon: <EventAvailableIcon sx={{ fontSize: 18 }} /> },
  { id: 'past', label: 'Past', icon: <HistoryIcon sx={{ fontSize: 18 }} /> },
];

const MyInterviewsHeaderShell: React.FC = () => {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('md'));
  const { activeTab, setActiveTab, stats, refresh } = useMyInterviews();

  const getCount = (tab: MyInterviewsTab) => (tab === 'upcoming' ? stats.upcoming : stats.past);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '1 1 0%',
        minWidth: 0,
        mx: { xs: 0.5, sm: 1.5, md: 2 },
        py: 0.5,
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': { height: 4 },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255,255,255,0.2)',
          borderRadius: 2,
        },
      }}
    >
      <Box
        component="nav"
        aria-label="Interview sections"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 1.5, sm: 2.5, md: 4 },
          flexWrap: 'nowrap',
        }}
      >
        {!isCompact && (
          <Box sx={{ flexShrink: 0, textAlign: 'center' }}>
            <Typography
              variant="subtitle1"
              sx={{ color: 'white', fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap' }}
            >
              My Interviews
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }}>
              {stats.upcoming} upcoming • {stats.total} total
            </Typography>
          </Box>
        )}

        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <Box
              key={tab.id}
              component="button"
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-label={`${tab.label} (${getCount(tab.id)})`}
              sx={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: { xs: 0.4, sm: 0.65 },
                px: { xs: 0.75, sm: 1.25 },
                py: 0.5,
                border: 'none',
                cursor: 'pointer',
                bgcolor: 'transparent',
                color: active ? '#5AC8FA' : 'rgba(255,255,255,0.9)',
                borderBottom: active ? '2px solid #5AC8FA' : '2px solid transparent',
                fontWeight: active ? 600 : 500,
                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                whiteSpace: 'nowrap',
                borderRadius: 1,
                '&:hover': {
                  color: '#5AC8FA',
                  bgcolor: alpha('#fff', 0.08),
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>{tab.icon}</Box>
              <Typography component="span" variant="body2" sx={{ fontWeight: 'inherit', fontSize: 'inherit' }}>
                {tab.label} ({getCount(tab.id)})
              </Typography>
            </Box>
          );
        })}

        <Tooltip title="Refresh interviews">
          <IconButton
            onClick={refresh}
            size="small"
            sx={{
              flexShrink: 0,
              color: 'rgba(255,255,255,0.9)',
              bgcolor: alpha('#fff', 0.1),
              '&:hover': { bgcolor: alpha('#fff', 0.18) },
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default MyInterviewsHeaderShell;
