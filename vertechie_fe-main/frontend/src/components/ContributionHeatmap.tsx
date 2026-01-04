/**
 * ContributionHeatmap - Shared GitHub-style Contribution Heatmap
 * Used in Practice page and Profile page
 * Shows coding activity, commits, and project work throughout the year
 */

import React, { useState } from 'react';
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
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GitHubIcon from '@mui/icons-material/GitHub';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
}

const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ 
  compact = false, 
  showControls = true,
  title = 'Contribution Activity',
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [connectedServices, setConnectedServices] = useState<{ github: boolean; gitlab: boolean }>({
    github: false,
    gitlab: false,
  });
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<'github' | 'gitlab' | null>(null);

  // Generate contribution data for a specific year
  const generateYearData = (year: number) => {
    const data: { date: Date; count: number; level: number; type: string }[] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Use a seeded random to get consistent data
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
  };

  const yearData = generateYearData(selectedYear);
  
  // Get level color
  const getLevelColor = (level: number) => {
    const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
    return colors[level] || colors[0];
  };
  
  // Group by weeks
  const getWeeks = () => {
    const weeks: { date: Date; count: number; level: number; type: string }[][] = [];
    let currentWeek: { date: Date; count: number; level: number; type: string }[] = [];
    
    // Add padding for first week
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
  
  // Calculate stats
  const totalContributions = yearData.reduce((sum, d) => sum + Math.max(0, d.count), 0);
  const activeDays = yearData.filter(d => d.count > 0).length;
  const bestDay = yearData.reduce((max, d) => d.count > max.count ? d : max, yearData[0]);
  
  // Calculate current streak
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

  // Month labels
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

  const handleConnectService = (service: 'github' | 'gitlab') => {
    setSelectedService(service);
    setConnectDialogOpen(true);
  };

  const confirmConnect = () => {
    if (selectedService) {
      setConnectedServices(prev => ({ ...prev, [selectedService]: true }));
    }
    setConnectDialogOpen(false);
    setSelectedService(null);
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
            {totalContributions.toLocaleString()} contributions in {selectedYear}
          </Typography>
        </Box>
        
        {showControls && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Git Integration Buttons */}
            <Tooltip title={connectedServices.github ? 'GitHub Connected' : 'Connect GitHub'}>
              <Button
                size="small"
                variant={connectedServices.github ? 'contained' : 'outlined'}
                startIcon={connectedServices.github ? <CheckCircleIcon /> : <GitHubIcon />}
                onClick={() => !connectedServices.github && handleConnectService('github')}
                sx={{
                  bgcolor: connectedServices.github ? '#238636' : 'transparent',
                  borderColor: '#333',
                  color: connectedServices.github ? 'white' : '#333',
                  '&:hover': { bgcolor: connectedServices.github ? '#2ea043' : alpha('#333', 0.05) },
                }}
              >
                {connectedServices.github ? 'Connected' : 'GitHub'}
              </Button>
            </Tooltip>
            
            <Tooltip title={connectedServices.gitlab ? 'GitLab Connected' : 'Connect GitLab'}>
              <Button
                size="small"
                variant={connectedServices.gitlab ? 'contained' : 'outlined'}
                startIcon={connectedServices.gitlab ? <CheckCircleIcon /> : <GitLabIcon />}
                onClick={() => !connectedServices.gitlab && handleConnectService('gitlab')}
                sx={{
                  bgcolor: connectedServices.gitlab ? '#fc6d26' : 'transparent',
                  borderColor: '#fc6d26',
                  color: connectedServices.gitlab ? 'white' : '#fc6d26',
                  '&:hover': { bgcolor: connectedServices.gitlab ? '#e24329' : alpha('#fc6d26', 0.05) },
                }}
              >
                {connectedServices.gitlab ? 'Connected' : 'GitLab'}
              </Button>
            </Tooltip>
            
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
      
      {/* Heatmap Grid */}
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
                          {day.count > 0 && (
                            <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
                              Type: {day.type}
                            </Typography>
                          )}
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
      
      {/* Legend and Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 2 }}>
        {/* Activity Types */}
        {!compact && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip size="small" label="Practice" sx={{ bgcolor: alpha('#40c463', 0.2), color: '#216e39' }} />
            <Chip size="small" label="Commits" sx={{ bgcolor: alpha(colors.primary, 0.2), color: colors.primary }} />
            <Chip size="small" label="Projects" sx={{ bgcolor: alpha('#8b5cf6', 0.2), color: '#8b5cf6' }} />
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
      {!compact && (
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
      
      {/* Connect Dialog */}
      <Dialog open={connectDialogOpen} onClose={() => setConnectDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          Connect {selectedService === 'github' ? 'GitHub' : 'GitLab'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Authorize VerTechie to access your {selectedService === 'github' ? 'GitHub' : 'GitLab'} contributions. 
            Your commits and activity will be synced to your heatmap.
          </Typography>
          <TextField
            fullWidth
            label={`${selectedService === 'github' ? 'GitHub' : 'GitLab'} Username`}
            placeholder="Enter your username"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConnectDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={confirmConnect}
            sx={{ 
              bgcolor: selectedService === 'github' ? '#238636' : '#fc6d26',
              '&:hover': { bgcolor: selectedService === 'github' ? '#2ea043' : '#e24329' },
            }}
          >
            Authorize
          </Button>
        </DialogActions>
      </Dialog>
    </HeatmapContainer>
  );
};

export default ContributionHeatmap;

