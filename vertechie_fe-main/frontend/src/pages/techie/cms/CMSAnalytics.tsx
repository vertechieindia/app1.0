/**
 * CMSAnalytics - Company Analytics Dashboard
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
import WorkIcon from '@mui/icons-material/Work';
import CMSLayout from './CMSLayout';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
  warning: '#FF9500',
  info: '#5AC8FA',
};

const overviewStats = [
  { label: 'Page Views', value: '45,230', change: '+15.2%', icon: <VisibilityIcon />, color: colors.primary },
  { label: 'Total Followers', value: '12,450', change: '+6.8%', icon: <PeopleIcon />, color: colors.success },
  { label: 'Engagement Rate', value: '5.2%', change: '+0.8%', icon: <ThumbUpIcon />, color: colors.warning },
  { label: 'Job Applications', value: '262', change: '+22.5%', icon: <WorkIcon />, color: colors.info },
];

const topJobs = [
  { title: 'Senior Software Engineer', views: 4500, applications: 45 },
  { title: 'Product Manager', views: 3200, applications: 32 },
  { title: 'Data Scientist', views: 2800, applications: 56 },
  { title: 'UX Designer', views: 2100, applications: 28 },
];

const trafficSources = [
  { label: 'Direct Search', percentage: 40 },
  { label: 'LinkedIn', percentage: 25 },
  { label: 'Job Boards', percentage: 20 },
  { label: 'Referrals', percentage: 15 },
];

const CMSAnalytics: React.FC = () => {
  return (
    <CMSLayout>
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
          {/* Top Performing Jobs */}
          <Grid item xs={12} lg={7}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Top Performing Job Posts
                </Typography>
                {topJobs.map((job, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      py: 2, 
                      borderBottom: idx < topJobs.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography fontWeight={500}>{job.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.views.toLocaleString()} views • {job.applications} applications
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(job.applications / 60) * 100} 
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
                      <Typography variant="body2" color={colors.success} fontWeight={600}>
                        {((job.applications / job.views) * 100).toFixed(1)}% CTR
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Traffic Sources */}
          <Grid item xs={12} lg={5}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Traffic Sources
                </Typography>
                {trafficSources.map((item, idx) => (
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

                {/* Hiring Summary */}
                <Box sx={{ mt: 4, p: 2, bgcolor: alpha(colors.success, 0.1), borderRadius: 2 }}>
                  <Typography variant="subtitle2" color={colors.success} gutterBottom>
                    📈 Hiring Performance
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color={colors.success}>
                    8 hires this month
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average time to hire: 21 days
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </CMSLayout>
  );
};

export default CMSAnalytics;

