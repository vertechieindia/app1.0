/**
 * AnalyticsPage - ATS Analytics and Insights
 */

import React, { useState } from 'react';
import {
  Box, Typography, Paper, Card, CardContent, Grid, FormControl, Select, MenuItem,
  Button, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ATSLayout from './ATSLayout';

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
}));

const pipelineMetrics = [
  { stage: 'New Applicants', count: 156, percentage: 100, change: 12 },
  { stage: 'Screening', count: 98, percentage: 63, change: 5 },
  { stage: 'Interview', count: 45, percentage: 29, change: -3 },
  { stage: 'Offer', count: 12, percentage: 8, change: 2 },
  { stage: 'Hired', count: 8, percentage: 5, change: 1 },
];

const sourceMetrics = [
  { source: 'LinkedIn', applicants: 87, hires: 4, conversionRate: 4.6 },
  { source: 'Indeed', applicants: 45, hires: 2, conversionRate: 4.4 },
  { source: 'Referrals', applicants: 23, hires: 3, conversionRate: 13.0 },
  { source: 'Direct', applicants: 18, hires: 1, conversionRate: 5.6 },
  { source: 'Glassdoor', applicants: 12, hires: 0, conversionRate: 0 },
];

const jobPerformance = [
  { title: 'Senior React Developer', applicants: 48, interviews: 12, offers: 2, status: 'active' },
  { title: 'Product Manager', applicants: 35, interviews: 8, offers: 1, status: 'active' },
  { title: 'UX Designer', applicants: 28, interviews: 6, offers: 1, status: 'active' },
  { title: 'DevOps Engineer', applicants: 22, interviews: 5, offers: 0, status: 'active' },
];

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <ATSLayout>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>Hiring Analytics</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} startAdornment={<CalendarTodayIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />}>
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
              <MenuItem value="1y">Last year</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<DownloadIcon />}>Export Report</Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <StatCard>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>Total Applicants</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" fontWeight={700} color="#0d47a1">247</Typography>
                <Chip icon={<TrendingUpIcon />} label="+12%" size="small" sx={{ bgcolor: alpha('#34C759', 0.1), color: '#34C759' }} />
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>Interviews Conducted</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" fontWeight={700} color="#5856D6">45</Typography>
                <Chip icon={<TrendingUpIcon />} label="+8%" size="small" sx={{ bgcolor: alpha('#34C759', 0.1), color: '#34C759' }} />
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>Offers Made</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" fontWeight={700} color="#34C759">12</Typography>
                <Chip icon={<TrendingDownIcon />} label="-3%" size="small" sx={{ bgcolor: alpha('#FF3B30', 0.1), color: '#FF3B30' }} />
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>Avg. Time to Hire</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" fontWeight={700} color="#FF9500">18d</Typography>
                <Chip icon={<TrendingUpIcon />} label="-2d" size="small" sx={{ bgcolor: alpha('#34C759', 0.1), color: '#34C759' }} />
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Pipeline Funnel */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Pipeline Funnel</Typography>
            {pipelineMetrics.map((metric) => (
              <Box key={metric.stage} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={500}>{metric.stage}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={600}>{metric.count}</Typography>
                    <Chip
                      label={`${metric.change > 0 ? '+' : ''}${metric.change}%`}
                      size="small"
                      sx={{
                        bgcolor: alpha(metric.change >= 0 ? '#34C759' : '#FF3B30', 0.1),
                        color: metric.change >= 0 ? '#34C759' : '#FF3B30',
                        fontSize: '0.65rem',
                        height: 20,
                      }}
                    />
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={metric.percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha('#0d47a1', 0.1),
                    '& .MuiLinearProgress-bar': { bgcolor: '#0d47a1', borderRadius: 4 },
                  }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Source Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Source Performance</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Source</strong></TableCell>
                    <TableCell align="right"><strong>Applicants</strong></TableCell>
                    <TableCell align="right"><strong>Hires</strong></TableCell>
                    <TableCell align="right"><strong>Conv. Rate</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sourceMetrics.map((source) => (
                    <TableRow key={source.source}>
                      <TableCell>{source.source}</TableCell>
                      <TableCell align="right">{source.applicants}</TableCell>
                      <TableCell align="right">{source.hires}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${source.conversionRate}%`}
                          size="small"
                          sx={{
                            bgcolor: alpha(source.conversionRate >= 5 ? '#34C759' : '#FF9500', 0.1),
                            color: source.conversionRate >= 5 ? '#34C759' : '#FF9500',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Job Performance */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Job Posting Performance</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha('#0d47a1', 0.03) }}>
                    <TableCell><strong>Job Title</strong></TableCell>
                    <TableCell align="center"><strong>Applicants</strong></TableCell>
                    <TableCell align="center"><strong>Interviews</strong></TableCell>
                    <TableCell align="center"><strong>Offers</strong></TableCell>
                    <TableCell align="center"><strong>Conversion</strong></TableCell>
                    <TableCell align="center"><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobPerformance.map((job) => (
                    <TableRow key={job.title} hover>
                      <TableCell><Typography fontWeight={500}>{job.title}</Typography></TableCell>
                      <TableCell align="center">{job.applicants}</TableCell>
                      <TableCell align="center">{job.interviews}</TableCell>
                      <TableCell align="center">{job.offers}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <LinearProgress
                            variant="determinate"
                            value={(job.interviews / job.applicants) * 100}
                            sx={{ width: 60, mr: 1, height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="caption">{((job.interviews / job.applicants) * 100).toFixed(0)}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label="Active" size="small" sx={{ bgcolor: alpha('#34C759', 0.1), color: '#34C759' }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </ATSLayout>
  );
};

export default AnalyticsPage;


