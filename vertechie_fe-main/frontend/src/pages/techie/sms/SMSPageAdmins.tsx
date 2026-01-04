/**
 * SMSPageAdmins - Page Admins Management
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
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
import SMSLayout from './SMSLayout';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
  warning: '#FF9500',
};

const mockAdmins = [
  { id: 1, name: 'Dr. Robert Wilson', email: 'r.wilson@techuniversity.edu', role: 'Super Admin', status: 'active', addedDate: '2023-01-15' },
  { id: 2, name: 'Prof. Lisa Anderson', email: 'l.anderson@techuniversity.edu', role: 'Content Manager', status: 'active', addedDate: '2023-03-20' },
  { id: 3, name: 'Mr. James Taylor', email: 'j.taylor@techuniversity.edu', role: 'Placement Officer', status: 'active', addedDate: '2023-06-10' },
  { id: 4, name: 'Ms. Emily Brown', email: 'e.brown@techuniversity.edu', role: 'Alumni Coordinator', status: 'active', addedDate: '2023-09-05' },
];

const SMSPageAdmins: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  return (
    <SMSLayout>
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

        {/* Admin Roles */}
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
                  <MenuItem value="placement_officer">Placement Officer</MenuItem>
                  <MenuItem value="alumni_coordinator">Alumni Coordinator</MenuItem>
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
    </SMSLayout>
  );
};

export default SMSPageAdmins;

