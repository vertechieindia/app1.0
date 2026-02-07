/**
 * SMSPageAdmins - School Page Admins Management
 */

import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SMSLayout from './SMSLayout';
import { api } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
  warning: '#FF9500',
};

const SMSPageAdmins: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [admins, setAdmins] = useState<any[]>([]);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const mySchool = await api.get<any>(API_ENDPOINTS.SMS.MY_SCHOOL);
      if (mySchool?.id) {
        setSchoolId(mySchool.id);
        const adminsData = await api.get<any[]>(
          API_ENDPOINTS.SMS.ADMINS(mySchool.id),
        );
        setAdmins(adminsData || []);
      } else {
        setAdmins([]);
      }
    } catch (err: any) {
      console.error('Failed to load school admins', err);
      setError(err?.response?.data?.detail || 'Failed to load admins.');
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim() || !schoolId) return;
    try {
      setLoading(true);
      setError(null);
      await api.post(API_ENDPOINTS.SMS.ADD_ADMIN(schoolId), {
        email: newAdminEmail,
        role: selectedRole,
      });
      setOpenDialog(false);
      setNewAdminEmail('');
      await fetchData();
    } catch (err: any) {
      console.error('Failed to add school admin', err);
      setError(err?.response?.data?.detail || 'Failed to add admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (!schoolId || !window.confirm('Remove this admin?')) return;
    try {
      setError(null);
      await api.delete(API_ENDPOINTS.SMS.REMOVE_ADMIN(schoolId, adminId));
      await fetchData();
    } catch (err: any) {
      console.error('Failed to remove school admin', err);
      setError(err?.response?.data?.detail || 'Failed to remove admin.');
    }
  };

  const ownersCount = admins.filter((a) => a.role === 'owner').length;
  const adminsCount = admins.filter((a) => a.role === 'admin').length;

  return (
    <SMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>Page Admins</Typography>
            <Typography variant="body2" color="text.secondary">
              Who can manage this school page and SMS modules.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            sx={{ bgcolor: colors.primary }}
            onClick={() => setOpenDialog(true)}
          >
            Add Admin
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Admin Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 2.5, bgcolor: alpha(colors.primary, 0.04), borderRadius: 3, boxShadow: 'none' }}>
              <Typography variant="h4" fontWeight={800} color={colors.primary}>{admins.length}</Typography>
              <Typography variant="body2" fontWeight={500} color="text.secondary">Total Admins</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 2.5, bgcolor: alpha(colors.success, 0.04), borderRadius: 3, boxShadow: 'none' }}>
              <Typography variant="h4" fontWeight={800} color={colors.success}>
                {ownersCount}
              </Typography>
              <Typography variant="body2" fontWeight={500} color="text.secondary">Owners</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 2.5, bgcolor: alpha(colors.warning, 0.04), borderRadius: 3, boxShadow: 'none' }}>
              <Typography variant="h4" fontWeight={800} color={colors.warning}>
                {adminsCount}
              </Typography>
              <Typography variant="body2" fontWeight={500} color="text.secondary">Admins</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Admins Table */}
        <TableContainer component={Card} sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: 'none' }}>
          <Table>
            <TableHead sx={{ bgcolor: alpha(colors.primary, 0.02) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Permissions</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Added Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={30} sx={{ color: colors.primary }} />
                  </TableCell>
                </TableRow>
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No admins found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: colors.primary, width: 36, height: 36, fontWeight: 700, fontSize: '0.9rem' }}>
                          {admin.user_name?.[0] || admin.user_email?.[0] || 'A'}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          {admin.user_name || 'Admin User'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {admin.user_email || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={admin.role}
                        size="small"
                        sx={{
                          bgcolor: alpha(colors.primary, 0.08),
                          color: colors.primary,
                          fontWeight: 700,
                          textTransform: 'capitalize',
                          borderRadius: 1.5,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {admin.can_manage_students && (
                          <Chip label="Students" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                        )}
                        {admin.can_manage_programs && (
                          <Chip label="Programs" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                        )}
                        {admin.can_manage_placements && (
                          <Chip label="Placements" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                        )}
                        {admin.can_manage_admins && (
                          <Chip label="Admins" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {admin.added_at ? new Date(admin.added_at).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveAdmin(admin.id)}
                        sx={{ bgcolor: alpha('#f44336', 0.05), '&:hover': { bgcolor: alpha('#f44336', 0.1) } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Admin Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Page Admin</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Enter the email of a registered VerTechie user to add them as an admin.
              </Typography>
              <TextField
                fullWidth
                label="User Email"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedRole}
                  label="Role"
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <MenuItem value="owner">Owner</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="placement_head">Placement Head</MenuItem>
                  <MenuItem value="alumni_coordinator">Alumni Coordinator</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              sx={{ bgcolor: colors.primary }}
              onClick={handleAddAdmin}
              disabled={loading || !newAdminEmail.trim()}
            >
              Add Admin
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </SMSLayout>
  );
};

export default SMSPageAdmins;

