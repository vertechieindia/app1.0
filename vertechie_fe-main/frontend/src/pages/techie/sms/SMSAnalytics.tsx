/**
 * SMSAnalytics - School Analytics Dashboard
 */

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Avatar,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share';
import SMSLayout from './SMSLayout';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
  warning: '#FF9500',
  info: '#5AC8FA',
};

const overviewStats = [
  { label: 'Page Views', value: '45,230', change: '+12.5%', icon: <VisibilityIcon />, color: colors.primary },
  { label: 'Total Followers', value: '28,450', change: '+8.3%', icon: <PeopleIcon />, color: colors.success },
  { label: 'Engagement Rate', value: '4.8%', change: '+0.6%', icon: <ThumbUpIcon />, color: colors.warning },
  { label: 'Shares', value: '1,234', change: '+15.2%', icon: <ShareIcon />, color: colors.info },
];

const topPosts = [
  { title: 'AI Research Center Announcement', views: 5600, engagement: 89 },
  { title: '2024 Graduation Ceremony', views: 4200, engagement: 76 },
  { title: 'New Partnership with Tech Giants', views: 3800, engagement: 72 },
  { title: 'Campus Expansion Plans', views: 3100, engagement: 65 },
];

const audienceData = [
  { label: 'Students', percentage: 45 },
  { label: 'Alumni', percentage: 30 },
  { label: 'Recruiters', percentage: 15 },
  { label: 'Parents', percentage: 10 },
];

const SMSAnalytics: React.FC = () => {
  return (
    <SMSLayout>
      <Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Analytics Overview
        </Typography>

        {/* Overview Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {overviewStats.map((stat, idx) => (
            <Grid item xs={6} md={3} key={idx}>
              <Card sx={{ 
                p: 2,
                bgcolor: alpha(stat.color, 0.05),
                border: `1px solid ${alpha(stat.color, 0.2)}`,
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Avatar sx={{ bgcolor: alpha(stat.color, 0.1), color: stat.color }}>
                    {stat.icon}
                  </Avatar>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: colors.success, 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {stat.change}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700} color={stat.color}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Top Performing Posts */}
          <Grid item xs={12} lg={7}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Top Performing Posts
                </Typography>
                {topPosts.map((post, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      py: 2, 
                      borderBottom: idx < topPosts.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography fontWeight={500}>{post.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {post.views.toLocaleString()} views
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={post.engagement} 
                        sx={{ 
                          flex: 1,
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: alpha(colors.primary, 0.1),
                          '& .MuiLinearProgress-bar': { 
                            bgcolor: colors.primary,
                            borderRadius: 4,
                          },
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {post.engagement}% engagement
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Audience Breakdown */}
          <Grid item xs={12} lg={5}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Audience Breakdown
                </Typography>
                {audienceData.map((item, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={item.percentage} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        bgcolor: alpha(colors.primary, 0.1),
                        '& .MuiLinearProgress-bar': { 
                          bgcolor: colors.primary,
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>
                ))}

                {/* Growth Summary */}
                <Box sx={{ mt: 4, p: 2, bgcolor: alpha(colors.success, 0.1), borderRadius: 2 }}>
                  <Typography variant="subtitle2" color={colors.success} gutterBottom>
                    📈 Monthly Growth
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color={colors.success}>
                    +2,340 new followers
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    8.2% increase from last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </SMSLayout>
  );
};

export default SMSAnalytics;

