/**
 * ContributionHeatmap - GitHub-style Contribution Heatmap
 *
 * GitHub and GitLab both use OAuth for authentication.
 * Only activity from connected accounts is displayed.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Chip,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { api } from '../services/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { styled, alpha } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GitHubIcon from '@mui/icons-material/GitHub';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinkOffIcon from '@mui/icons-material/LinkOff';

// GitLab Icon Component
const GitLabIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>
  </svg>
);

// Theme colors
const colors = {
  primary: '#0d47a1',
  success: '#34C759',
  warning: '#FF9500',
};

const HeatmapContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  marginBottom: theme.spacing(2),
}));

interface ContributionHeatmapProps {
  compact?: boolean;
  showControls?: boolean;
  title?: string;
  /** Called when user connects/disconnects - parent can refresh profile */
  onConnectionChange?: () => void;
}

interface ConnectionStatus {
  github: { connected: boolean; username: string | null; connected_at: string | null };
  gitlab: { connected: boolean; username: string | null; connected_at: string | null };
}

const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ 
  compact = false, 
  showControls = true,
  title = 'Contribution Activity',
  onConnectionChange,
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    github: { connected: false, username: null, connected_at: null },
    gitlab: { connected: false, username: null, connected_at: null },
  });

  const [githubConnecting, setGithubConnecting] = useState(false);
  const [gitlabConnecting, setGitlabConnecting] = useState(false);

  // Disconnect confirmation dialog
  const [disconnectDialog, setDisconnectDialog] = useState<{ open: boolean; service: 'github' | 'gitlab' | null }>({
    open: false,
    service: null,
  });
  const [disconnecting, setDisconnecting] = useState(false);
  
  // Contributions data
  const [realContributions, setRealContributions] = useState<{ date: string; count: number; level: number }[] | null>(null);
  const [loadingContributions, setLoadingContributions] = useState(false);
  const [hasRealData, setHasRealData] = useState(false);
  const [contributionError, setContributionError] = useState<string | null>(null);

  // Fetch connection status
  const fetchConnectionStatus = useCallback(async () => {
    try {
      const status = await api.get<ConnectionStatus>(API_ENDPOINTS.GITHUB_GITLAB.STATUS);
      setConnectionStatus(status);
    } catch {
      // Not logged in or error - leave as disconnected
    }
  }, []);

  // Check connection status on mount
  useEffect(() => {
    fetchConnectionStatus();
  }, [fetchConnectionStatus]);

  // Fetch contributions when we have connected accounts
  useEffect(() => {
    if (!connectionStatus.github.connected && !connectionStatus.gitlab.connected) {
      setRealContributions(null);
      setHasRealData(false);
      setContributionError(null);
      return;
    }
    
    let cancelled = false;
    setLoadingContributions(true);
    setContributionError(null);
    
    api
      .get<{ 
        year: number; 
        contributions: { date: string; count: number; level: number }[]; 
        total: number;
        errors?: { github?: string; gitlab?: string };
      }>(`${API_ENDPOINTS.GITHUB_GITLAB.CONTRIBUTIONS}?year=${selectedYear}`)
      .then((data) => {
        if (cancelled) return;
        if (data?.contributions?.length) {
          setRealContributions(data.contributions);
          setHasRealData(true);
          
          // Check for errors
          if (data.errors?.github || data.errors?.gitlab) {
            const errors = [];
            if (data.errors.github) errors.push(`GitHub: ${data.errors.github}`);
            if (data.errors.gitlab) errors.push(`GitLab: ${data.errors.gitlab}`);
            setContributionError(errors.join('. '));
          }
        } else {
          setRealContributions(null);
          setHasRealData(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setRealContributions(null);
          setHasRealData(false);
          setContributionError(err.message || 'Failed to fetch contributions');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingContributions(false);
      });
    
    return () => { cancelled = true; };
  }, [selectedYear, connectionStatus.github.connected, connectionStatus.gitlab.connected]);

  // Generate sample data when not connected
  const generateYearData = useCallback((year: number) => {
    const data: { date: Date; count: number; level: number; type: string }[] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    const seedRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    let dayIndex = 0;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      const seed = year * 1000 + dayIndex;
      const random = seedRandom(seed);
      
      let count = 0;
      let type = 'practice';
      
      if (random > 0.65) count = 0;
      else if (random > 0.45) { count = Math.floor(seedRandom(seed + 1) * 3) + 1; type = 'practice'; }
      else if (random > 0.25) { count = Math.floor(seedRandom(seed + 2) * 5) + 2; type = 'commits'; }
      else if (random > 0.1) { count = Math.floor(seedRandom(seed + 3) * 8) + 4; type = 'mixed'; }
      else { count = Math.floor(seedRandom(seed + 4) * 12) + 6; type = 'project'; }
      
      let level = 0;
      if (count > 0) level = 1;
      if (count >= 3) level = 2;
      if (count >= 6) level = 3;
      if (count >= 9) level = 4;
      
      data.push({ date, count, level, type });
      dayIndex++;
    }
    return data;
  }, []);

  // Use real data when available
  const yearData = hasRealData && realContributions && realContributions.length > 0
    ? realContributions.map((c) => ({
        date: new Date(c.date),
        count: c.count,
        level: c.level,
        type: 'commits' as string,
      }))
    : generateYearData(selectedYear);
  
  // Get level color (GitHub's exact colors)
  const getLevelColor = (level: number) => {
    const levelColors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
    return levelColors[level] || levelColors[0];
  };
  
  // Group by weeks
  const getWeeks = () => {
    const weeks: { date: Date; count: number; level: number; type: string }[][] = [];
    let currentWeek: { date: Date; count: number; level: number; type: string }[] = [];
    
    const firstDay = yearData[0]?.date.getDay() || 0;
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push({ date: new Date(0), count: -1, level: -1, type: '' });
    }
    
    yearData.forEach((day) => {
      if (day.date.getDay() === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    if (currentWeek.length > 0) weeks.push(currentWeek);
    
    return weeks;
  };
  
  const weeks = getWeeks();
  
  // Stats
  const totalContributions = yearData.reduce((sum, d) => sum + Math.max(0, d.count), 0);
  const activeDays = yearData.filter(d => d.count > 0).length;
  const bestDay = yearData.reduce((max, d) => d.count > max.count ? d : max, yearData[0]);
  
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    for (let i = yearData.length - 1; i >= 0; i--) {
      if (yearData[i].date > today) continue;
      if (yearData[i].count > 0) streak++;
      else break;
    }
    return streak;
  };
  const currentStreak = calculateStreak();

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const getMonthPositions = () => {
    const positions: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstValidDay = week.find(d => d.count >= 0);
      if (firstValidDay) {
        const month = firstValidDay.date.getMonth();
        if (month !== lastMonth) {
          positions.push({ month: months[month], weekIndex });
          lastMonth = month;
        }
      }
    });
    
    return positions;
  };
  
  const monthPositions = getMonthPositions();

  // ============================================
  // GITHUB OAUTH FLOW
  // ============================================
  
  const handleConnectGitHub = async () => {
    setGithubConnecting(true);
    try {
      // Get OAuth URL from backend
      const response = await api.get<{ auth_url: string; state: string }>(API_ENDPOINTS.GITHUB_GITLAB.GITHUB_AUTH);
      
      // Store state in sessionStorage for callback verification
      sessionStorage.setItem('github_oauth_state', response.state);
      
      // Redirect to GitHub for authorization
      window.location.href = response.auth_url;
    } catch (err) {
      setGithubConnecting(false);
      console.error('Failed to start GitHub OAuth:', err);
    }
  };

  // ============================================
  // GITLAB OAUTH FLOW
  // ============================================

  const handleConnectGitLab = async () => {
    setGitlabConnecting(true);
    try {
      const response = await api.get<{ auth_url: string; state: string }>(API_ENDPOINTS.GITHUB_GITLAB.GITLAB_AUTH);
      sessionStorage.setItem('gitlab_oauth_state', response.state);
      window.location.href = response.auth_url;
    } catch (err) {
      setGitlabConnecting(false);
      console.error('Failed to start GitLab OAuth:', err);
    }
  };

  // ============================================
  // DISCONNECT
  // ============================================
  
  const handleDisconnect = async () => {
    if (!disconnectDialog.service) return;
    setDisconnecting(true);
    try {
      if (disconnectDialog.service === 'github') {
        await api.delete(API_ENDPOINTS.GITHUB_GITLAB.GITHUB_DISCONNECT);
      } else {
        await api.delete(API_ENDPOINTS.GITHUB_GITLAB.GITLAB_DISCONNECT);
      }
      await fetchConnectionStatus();
      onConnectionChange?.();
      setDisconnectDialog({ open: false, service: null });
    } catch (err) {
      console.error('Disconnect failed:', err);
    } finally {
      setDisconnecting(false);
    }
  };

  const cellSize = compact ? 10 : 14;
  const gap = compact ? 2 : 3;

  return (
    <HeatmapContainer elevation={0} sx={{ border: '1px solid #eee' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {hasRealData 
              ? `${totalContributions.toLocaleString()} contributions in ${selectedYear}`
              : 'Connect GitHub or GitLab to see your real activity'}
          </Typography>
        </Box>
        
        {showControls && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* GitHub Button */}
            {connectionStatus.github.connected ? (
              <Tooltip title={`Connected as ${connectionStatus.github.username}. Click to disconnect.`}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  endIcon={<LinkOffIcon sx={{ fontSize: 14, ml: -0.5 }} />}
                  onClick={() => setDisconnectDialog({ open: true, service: 'github' })}
                  sx={{
                    bgcolor: '#238636',
                    '&:hover': { bgcolor: '#d32f2f' },
                  }}
                >
                  {connectionStatus.github.username}
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Connect with GitHub OAuth">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={githubConnecting ? <CircularProgress size={16} /> : <GitHubIcon />}
                  onClick={handleConnectGitHub}
                  disabled={githubConnecting}
                  sx={{
                    borderColor: '#333',
                    color: '#333',
                    '&:hover': { bgcolor: alpha('#333', 0.05) },
                  }}
                >
                  {githubConnecting ? 'Connecting...' : 'GitHub'}
                </Button>
              </Tooltip>
            )}
            
            {/* GitLab Button */}
            {connectionStatus.gitlab.connected ? (
              <Tooltip title={`Connected as ${connectionStatus.gitlab.username}. Click to disconnect.`}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  endIcon={<LinkOffIcon sx={{ fontSize: 14, ml: -0.5 }} />}
                  onClick={() => setDisconnectDialog({ open: true, service: 'gitlab' })}
                  sx={{
                    bgcolor: '#fc6d26',
                    '&:hover': { bgcolor: '#d32f2f' },
                  }}
                >
                  {connectionStatus.gitlab.username}
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Connect with GitLab OAuth">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={gitlabConnecting ? <CircularProgress size={16} /> : <GitLabIcon />}
                  onClick={handleConnectGitLab}
                  disabled={gitlabConnecting}
                  sx={{
                    borderColor: '#fc6d26',
                    color: '#fc6d26',
                    '&:hover': { bgcolor: alpha('#fc6d26', 0.05) },
                  }}
                >
                  {gitlabConnecting ? 'Connecting...' : 'GitLab'}
                </Button>
              </Tooltip>
            )}
            
            {/* Year Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
              <IconButton 
                size="small" 
                onClick={() => setSelectedYear(y => y - 1)}
                disabled={selectedYear <= 2020}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="body2" fontWeight={600} sx={{ minWidth: 50, textAlign: 'center' }}>
                {selectedYear}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => setSelectedYear(y => y + 1)}
                disabled={selectedYear >= currentYear}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
      
      {/* Error Alert */}
      {contributionError && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setContributionError(null)}>
          {contributionError}
        </Alert>
      )}
      
      {/* Loading state */}
      {loadingContributions && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} sx={{ color: colors.primary }} />
        </Box>
      )}

      {/* Heatmap Grid */}
      {!loadingContributions && (
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box sx={{ display: 'inline-flex', flexDirection: 'column', minWidth: 'fit-content' }}>
          {/* Month Labels Row */}
          <Box sx={{ display: 'flex', mb: 0.5, ml: compact ? '24px' : '32px' }}>
            {weeks.map((week, weekIndex) => {
              const monthLabel = monthPositions.find(p => p.weekIndex === weekIndex);
              return (
                <Box 
                  key={weekIndex} 
                  sx={{ 
                    width: cellSize + gap, 
                    flexShrink: 0,
                    fontSize: compact ? '9px' : '11px',
                    color: 'text.secondary',
                  }}
                >
                  {monthLabel?.month || ''}
                </Box>
              );
            })}
          </Box>
          
          <Box sx={{ display: 'flex' }}>
            {/* Day Labels */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, mr: 0.5, pt: '2px' }}>
              {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
                <Typography 
                  key={i} 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    height: cellSize, 
                    lineHeight: `${cellSize}px`,
                    fontSize: compact ? '8px' : '10px',
                    width: compact ? 20 : 28,
                    textAlign: 'right',
                    pr: 0.5,
                  }}
                >
                  {day}
                </Typography>
              ))}
            </Box>
            
            {/* Cells */}
            <Box sx={{ display: 'flex', gap: `${gap}px` }}>
            {weeks.map((week, weekIndex) => (
              <Box key={weekIndex} sx={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
                {week.map((day, dayIndex) => (
                  day.count >= 0 ? (
                    <Tooltip
                      key={dayIndex}
                      title={
                        <Box>
                          <Typography variant="caption" fontWeight={600}>
                            {day.count} contribution{day.count !== 1 ? 's' : ''}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                          </Typography>
                        </Box>
                      }
                      arrow
                    >
                      <Box
                        sx={{
                          width: cellSize,
                          height: cellSize,
                          borderRadius: '3px',
                          bgcolor: getLevelColor(day.level),
                          cursor: 'pointer',
                          transition: 'all 0.1s ease',
                          border: '1px solid rgba(0,0,0,0.06)',
                          '&:hover': {
                            transform: 'scale(1.2)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          },
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Box key={dayIndex} sx={{ width: cellSize, height: cellSize }} />
                  )
                ))}
              </Box>
            ))}
          </Box>
        </Box>
        </Box>
      </Box>
      )}

      {/* Legend and Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 2 }}>
        {/* Source indicators */}
        {!compact && hasRealData && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {connectionStatus.github.connected && (
              <Chip size="small" icon={<GitHubIcon sx={{ fontSize: 14 }} />} label="GitHub" sx={{ bgcolor: alpha('#333', 0.1) }} />
            )}
            {connectionStatus.gitlab.connected && (
              <Chip size="small" icon={<Box component="span" sx={{ display: 'flex' }}><GitLabIcon /></Box>} label="GitLab" sx={{ bgcolor: alpha('#fc6d26', 0.1) }} />
            )}
          </Box>
        )}
        
        {/* Color Legend */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>Less</Typography>
          {[0, 1, 2, 3, 4].map((level) => (
            <Box
              key={level}
              sx={{
                width: compact ? 10 : 12,
                height: compact ? 10 : 12,
                borderRadius: '2px',
                bgcolor: getLevelColor(level),
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            />
          ))}
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>More</Typography>
        </Box>
      </Box>
      
      {/* Stats Row */}
      {!compact && hasRealData && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: alpha(colors.success, 0.05), borderRadius: 2 }}>
              <Typography variant="h5" fontWeight={700} color={colors.success}>
                {totalContributions.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">Total</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: alpha(colors.primary, 0.05), borderRadius: 2 }}>
              <Typography variant="h5" fontWeight={700} color={colors.primary}>
                {activeDays}
              </Typography>
              <Typography variant="caption" color="text.secondary">Active Days</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: alpha(colors.warning, 0.05), borderRadius: 2 }}>
              <Typography variant="h5" fontWeight={700} color={colors.warning}>
                {currentStreak}
              </Typography>
              <Typography variant="caption" color="text.secondary">Current Streak</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: alpha('#8b5cf6', 0.05), borderRadius: 2 }}>
              <Typography variant="h5" fontWeight={700} color="#8b5cf6">
                {bestDay?.count || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">Best Day</Typography>
            </Box>
          </Grid>
        </Grid>
      )}
      
      {/* Disconnect Confirmation Dialog */}
      <Dialog open={disconnectDialog.open} onClose={() => !disconnecting && setDisconnectDialog({ open: false, service: null })}>
        <DialogTitle>
          Disconnect {disconnectDialog.service === 'github' ? 'GitHub' : 'GitLab'}?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Your {disconnectDialog.service === 'github' ? 'GitHub' : 'GitLab'} account will be disconnected and contributions from this account will no longer appear on your profile.
            You can reconnect {disconnectDialog.service === 'github' ? 'with the same or a different GitHub account' : 'anytime'}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDisconnectDialog({ open: false, service: null })} disabled={disconnecting}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDisconnect}
            disabled={disconnecting}
          >
            {disconnecting ? 'Disconnecting...' : 'Disconnect'}
          </Button>
        </DialogActions>
      </Dialog>
    </HeatmapContainer>
  );
};

export default ContributionHeatmap;
