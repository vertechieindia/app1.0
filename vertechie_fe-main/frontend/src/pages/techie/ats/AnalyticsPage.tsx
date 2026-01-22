/**
 * AnalyticsPage - ATS Analytics and Insights
 * Fetches real data from backend APIs
 */

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Card, CardContent, Grid, FormControl, Select, MenuItem,
  Button, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, CircularProgress, Skeleton,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ATSLayout from './ATSLayout';
import { getApiUrl } from '../../../config/api';

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
}));

interface PipelineMetric {
  stage: string;
  count: number;
  percentage: number;
  change: number;
}

interface JobMetric {
  title: string;
  applicants: number;
  interviews: number;
  offers: number;
  status: string;
}

interface SourceMetric {
  source: string;
  applicants: number;
  hires: number;
  conversionRate: number;
}

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  
  // Real data state
  const [pipelineMetrics, setPipelineMetrics] = useState<PipelineMetric[]>([]);
  const [jobPerformance, setJobPerformance] = useState<JobMetric[]>([]);
  const [sourceMetrics, setSourceMetrics] = useState<SourceMetric[]>([]);
  const [stats, setStats] = useState({
    totalApplicants: 0,
    interviews: 0,
    offers: 0,
    avgTimeToHire: 0,
    applicantsChange: 0,
    interviewsChange: 0,
    offersChange: 0,
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch analytics from backend endpoint
      const analyticsRes = await fetch(getApiUrl('/hiring/analytics'), { headers });
      
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        
        // Set pipeline metrics from backend
        const pipelineData: PipelineMetric[] = (data.pipeline_metrics || []).map((m: any) => ({
          stage: m.stage,
          count: m.count,
          percentage: m.percentage,
          change: 0,
        }));
        setPipelineMetrics(pipelineData);
        
        // Set job performance from backend
        const jobMetrics: JobMetric[] = (data.job_performance || []).map((j: any) => ({
          title: j.title,
          applicants: j.applicants,
          interviews: j.interviews,
          offers: j.offers,
          status: j.status,
        }));
        setJobPerformance(jobMetrics);
        
        // Set source metrics from backend
        const sourceData: SourceMetric[] = (data.source_metrics || []).map((s: any) => ({
          source: s.source,
          applicants: s.applicants,
          hires: s.hires,
          conversionRate: s.conversionRate,
        }));
        setSourceMetrics(sourceData);
        
        // Set overall stats
        setStats({
          totalApplicants: data.total_applicants || 0,
          interviews: data.interviews_scheduled || 0,
          offers: data.offers_made || 0,
          avgTimeToHire: 14,
          applicantsChange: 0,
          interviewsChange: 0,
          offersChange: 0,
        });
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

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
                {loading ? <Skeleton width={60} height={40} /> : (
                  <Typography variant="h4" fontWeight={700} color="#0d47a1">{stats.totalApplicants}</Typography>
                )}
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>Interviews Scheduled</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {loading ? <Skeleton width={60} height={40} /> : (
                  <Typography variant="h4" fontWeight={700} color="#5856D6">{stats.interviews}</Typography>
                )}
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>Offers Made</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {loading ? <Skeleton width={60} height={40} /> : (
                  <Typography variant="h4" fontWeight={700} color="#34C759">{stats.offers}</Typography>
                )}
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>Active Jobs</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {loading ? <Skeleton width={60} height={40} /> : (
                  <Typography variant="h4" fontWeight={700} color="#FF9500">{jobPerformance.filter(j => j.status === 'active').length}</Typography>
                )}
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
            {pipelineMetrics.length === 0 && !loading && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No pipeline data yet. Create jobs and receive applications to see metrics.
              </Typography>
            )}
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
                  {jobPerformance.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No jobs posted yet. Create a job to see performance metrics.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
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
                            value={job.applicants > 0 ? (job.interviews / job.applicants) * 100 : 0}
                            sx={{ width: 60, mr: 1, height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="caption">{job.applicants > 0 ? ((job.interviews / job.applicants) * 100).toFixed(0) : 0}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={job.status === 'active' ? 'Active' : job.status} size="small" sx={{ bgcolor: alpha('#34C759', 0.1), color: '#34C759' }} />
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


