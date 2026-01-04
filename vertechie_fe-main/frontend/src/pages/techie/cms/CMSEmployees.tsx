/**
 * CMSEmployees - Employee Verification Management
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
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
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import CMSLayout from './CMSLayout';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

const mockEmployees = [
  { id: 1, name: 'Alice Martinez', email: 'alice.m@techcorp.com', department: 'Engineering', title: 'Senior Developer', status: 'verified', joinDate: '2022-03-15' },
  { id: 2, name: 'Bob Thompson', email: 'bob.t@techcorp.com', department: 'Product', title: 'Product Manager', status: 'pending', joinDate: null },
  { id: 3, name: 'Carol White', email: 'carol.w@techcorp.com', department: 'Design', title: 'UX Designer', status: 'verified', joinDate: '2023-01-10' },
  { id: 4, name: 'David Lee', email: 'david.l@techcorp.com', department: 'Engineering', title: 'DevOps Engineer', status: 'rejected', joinDate: null },
  { id: 5, name: 'Eva Rodriguez', email: 'eva.r@techcorp.com', department: 'Marketing', title: 'Marketing Manager', status: 'pending', joinDate: null },
];

const CMSEmployees: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return colors.success;
      case 'pending': return colors.warning;
      case 'rejected': return colors.error;
      default: return 'grey';
    }
  };

  const filteredEmployees = mockEmployees.filter(
    (e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           e.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>Employee Verification</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Export
            </Button>
            <Button variant="contained" sx={{ bgcolor: colors.primary }}>
              Invite Employee
            </Button>
          </Box>
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Card sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: alpha(colors.success, 0.1) }}>
            <Typography variant="h4" fontWeight={700} color={colors.success}>847</Typography>
            <Typography variant="body2" color="text.secondary">Verified Employees</Typography>
          </Card>
          <Card sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: alpha(colors.warning, 0.1) }}>
            <Typography variant="h4" fontWeight={700} color={colors.warning}>56</Typography>
            <Typography variant="body2" color="text.secondary">Pending Requests</Typography>
          </Card>
          <Card sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: alpha(colors.error, 0.1) }}>
            <Typography variant="h4" fontWeight={700} color={colors.error}>12</Typography>
            <Typography variant="body2" color="text.secondary">Rejected</Typography>
          </Card>
        </Box>

        {/* Search & Filter */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search employees..."
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

        {/* Employees Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: colors.primary, width: 32, height: 32 }}>
                        {employee.name[0]}
                      </Avatar>
                      <Typography fontWeight={500}>{employee.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(employee.status), 0.1),
                        color: getStatusColor(employee.status),
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {employee.status === 'pending' ? (
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
    </CMSLayout>
  );
};

export default CMSEmployees;

