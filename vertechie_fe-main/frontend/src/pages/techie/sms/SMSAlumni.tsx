/**
 * SMSAlumni - Alumni Verification Management
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import SMSLayout from './SMSLayout';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

const mockAlumni = [
  { id: 1, name: 'John Smith', email: 'john.smith@email.com', batch: '2020', program: 'Computer Science', status: 'verified', verifiedDate: '2024-01-15' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', batch: '2019', program: 'Data Science', status: 'pending', verifiedDate: null },
  { id: 3, name: 'Mike Chen', email: 'mike.chen@email.com', batch: '2021', program: 'Software Engineering', status: 'verified', verifiedDate: '2024-01-10' },
  { id: 4, name: 'Emily Davis', email: 'emily.d@email.com', batch: '2018', program: 'Cybersecurity', status: 'rejected', verifiedDate: null },
  { id: 5, name: 'Alex Thompson', email: 'alex.t@email.com', batch: '2022', program: 'AI & ML', status: 'pending', verifiedDate: null },
];

const SMSAlumni: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return colors.success;
      case 'pending': return colors.warning;
      case 'rejected': return colors.error;
      default: return 'grey';
    }
  };

  const filteredAlumni = mockAlumni.filter(
    (a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>Alumni Verification</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Export
            </Button>
            <Button variant="contained" sx={{ bgcolor: colors.primary }}>
              Invite Alumni
            </Button>
          </Box>
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Card sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: alpha(colors.success, 0.1) }}>
            <Typography variant="h4" fontWeight={700} color={colors.success}>15,420</Typography>
            <Typography variant="body2" color="text.secondary">Verified Alumni</Typography>
          </Card>
          <Card sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: alpha(colors.warning, 0.1) }}>
            <Typography variant="h4" fontWeight={700} color={colors.warning}>234</Typography>
            <Typography variant="body2" color="text.secondary">Pending Requests</Typography>
          </Card>
          <Card sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: alpha(colors.error, 0.1) }}>
            <Typography variant="h4" fontWeight={700} color={colors.error}>45</Typography>
            <Typography variant="body2" color="text.secondary">Rejected</Typography>
          </Card>
        </Box>

        {/* Search & Filter */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search alumni..."
            size="small"
            sx={{ flex: 1 }}
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
          <Button variant="outlined" startIcon={<FilterListIcon />}>
            Filter
          </Button>
        </Box>

        {/* Alumni Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Batch</TableCell>
                <TableCell>Program</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAlumni.map((alumni) => (
                <TableRow key={alumni.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: colors.primary, width: 32, height: 32 }}>
                        {alumni.name[0]}
                      </Avatar>
                      <Typography fontWeight={500}>{alumni.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{alumni.email}</TableCell>
                  <TableCell>{alumni.batch}</TableCell>
                  <TableCell>{alumni.program}</TableCell>
                  <TableCell>
                    <Chip
                      label={alumni.status.charAt(0).toUpperCase() + alumni.status.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(alumni.status), 0.1),
                        color: getStatusColor(alumni.status),
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {alumni.status === 'pending' ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" sx={{ color: colors.success }}>
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton size="small" sx={{ color: colors.error }}>
                          <CancelIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </SMSLayout>
  );
};

export default SMSAlumni;

