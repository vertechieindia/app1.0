/**
 * CMSPageAdmins - Company Page Admins Management
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CMSLayout from './CMSLayout';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
  warning: '#FF9500',
};

const mockAdmins = [
  { id: 1, name: 'John Smith', email: 'j.smith@techcorp.com', role: 'Super Admin', status: 'active', addedDate: '2022-01-10' },
  { id: 2, name: 'Sarah Johnson', email: 's.johnson@techcorp.com', role: 'Content Manager', status: 'active', addedDate: '2022-06-15' },
  { id: 3, name: 'Michael Chen', email: 'm.chen@techcorp.com', role: 'HR Manager', status: 'active', addedDate: '2023-02-20' },
  { id: 4, name: 'Emily Davis', email: 'e.davis@techcorp.com', role: 'Recruiter', status: 'active', addedDate: '2023-08-10' },
];

const CMSPageAdmins: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  return (
    <CMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>Page Admins</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            sx={{ bgcolor: colors.primary }}
            onClick={() => setOpenDialog(true)}
          >
            Add Admin
          </Button>
        </Box>

        {/* Admin Stats */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Card sx={{ flex: 1, p: 2, bgcolor: alpha(colors.primary, 0.05) }}>
            <Typography variant="h4" fontWeight={700} color={colors.primary}>4</Typography>
            <Typography variant="body2" color="text.secondary">Total Admins</Typography>
          </Card>
          <Card sx={{ flex: 1, p: 2, bgcolor: alpha(colors.success, 0.05) }}>
            <Typography variant="h4" fontWeight={700} color={colors.success}>1</Typography>
            <Typography variant="body2" color="text.secondary">Super Admins</Typography>
          </Card>
          <Card sx={{ flex: 1, p: 2, bgcolor: alpha(colors.warning, 0.05) }}>
            <Typography variant="h4" fontWeight={700} color={colors.warning}>3</Typography>
            <Typography variant="body2" color="text.secondary">Managers</Typography>
          </Card>
        </Box>

        {/* Admins Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Added Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockAdmins.map((admin) => (
                  <TableRow key={admin.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: colors.primary }}>
                          {admin.name[0]}
                        </Avatar>
                        <Typography fontWeight={500}>{admin.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={admin.role} 
                        size="small"
                        sx={{ 
                          bgcolor: admin.role === 'Super Admin' 
                            ? alpha(colors.primary, 0.1) 
                            : alpha(colors.warning, 0.1),
                          color: admin.role === 'Super Admin' ? colors.primary : colors.warning,
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={admin.status} 
                        size="small"
                        sx={{ bgcolor: alpha(colors.success, 0.1), color: colors.success }}
                      />
                    </TableCell>
                    <TableCell>{admin.addedDate}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'error.main' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Add Admin Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Admin</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField fullWidth label="Name" />
              <TextField fullWidth label="Email" type="email" />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedRole}
                  label="Role"
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <MenuItem value="super_admin">Super Admin</MenuItem>
                  <MenuItem value="content_manager">Content Manager</MenuItem>
                  <MenuItem value="hr_manager">HR Manager</MenuItem>
                  <MenuItem value="recruiter">Recruiter</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" sx={{ bgcolor: colors.primary }}>
              Add Admin
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </CMSLayout>
  );
};

export default CMSPageAdmins;

