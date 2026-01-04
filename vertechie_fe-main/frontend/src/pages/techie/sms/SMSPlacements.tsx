/**
 * SMSPlacements - Placements Management
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import SMSLayout from './SMSLayout';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
  warning: '#FF9500',
};

const placementStats = [
  { label: 'Placement Rate', value: '94%', icon: <TrendingUpIcon />, color: colors.success },
  { label: 'Companies', value: '150+', icon: <BusinessIcon />, color: colors.primary },
  { label: 'Avg Package', value: '$85K', icon: <AttachMoneyIcon />, color: colors.warning },
  { label: 'Offers Made', value: '1,234', icon: <WorkIcon />, color: colors.primary },
];

const mockPlacements = [
  { id: 1, name: 'John Doe', program: 'Computer Science', company: 'Google', package: '$150,000', batch: '2024' },
  { id: 2, name: 'Jane Smith', program: 'Data Science', company: 'Microsoft', package: '$140,000', batch: '2024' },
  { id: 3, name: 'Mike Johnson', program: 'AI & ML', company: 'Amazon', package: '$135,000', batch: '2024' },
  { id: 4, name: 'Sarah Williams', program: 'Cybersecurity', company: 'Meta', package: '$145,000', batch: '2024' },
  { id: 5, name: 'Alex Brown', program: 'Software Engineering', company: 'Apple', package: '$155,000', batch: '2024' },
];

const topRecruiters = [
  { name: 'Google', hires: 45, logo: 'G' },
  { name: 'Microsoft', hires: 38, logo: 'M' },
  { name: 'Amazon', hires: 35, logo: 'A' },
  { name: 'Meta', hires: 28, logo: 'M' },
  { name: 'Apple', hires: 25, logo: 'A' },
];

const SMSPlacements: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>Placements</Typography>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Export Report
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {placementStats.map((stat, idx) => (
            <Grid item xs={6} md={3} key={idx}>
              <Card sx={{ 
                p: 2, 
                textAlign: 'center',
                bgcolor: alpha(stat.color, 0.05),
                border: `1px solid ${alpha(stat.color, 0.2)}`,
              }}>
                <Avatar sx={{ bgcolor: alpha(stat.color, 0.1), color: stat.color, mx: 'auto', mb: 1 }}>
                  {stat.icon}
                </Avatar>
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
          {/* Recent Placements */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Recent Placements
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Search placements..."
                  size="small"
                  sx={{ mb: 2 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell>Program</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Package</TableCell>
                        <TableCell>Batch</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockPlacements.map((placement) => (
                        <TableRow key={placement.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 28, height: 28, bgcolor: colors.primary }}>
                                {placement.name[0]}
                              </Avatar>
                              {placement.name}
                            </Box>
                          </TableCell>
                          <TableCell>{placement.program}</TableCell>
                          <TableCell>
                            <Chip label={placement.company} size="small" />
                          </TableCell>
                          <TableCell>
                            <Typography color={colors.success} fontWeight={600}>
                              {placement.package}
                            </Typography>
                          </TableCell>
                          <TableCell>{placement.batch}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Recruiters */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Top Recruiters
                </Typography>
                {topRecruiters.map((recruiter, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: colors.primary }}>
                          {recruiter.logo}
                        </Avatar>
                        <Typography variant="body2" fontWeight={500}>
                          {recruiter.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {recruiter.hires} hires
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(recruiter.hires / 50) * 100} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        bgcolor: alpha(colors.primary, 0.1),
                        '& .MuiLinearProgress-bar': { bgcolor: colors.primary },
                      }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </SMSLayout>
  );
};

export default SMSPlacements;

