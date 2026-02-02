/**
 * CMSPageAdmins - Company Page Admins Management
 */

import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CMSLayout from './CMSLayout';
import { api } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { DUMMY_ADMINS } from './CMSDummyData';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
  warning: '#FF9500',
};

const CMSPageAdmins: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newAdminUserId, setNewAdminUserId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try getting user first to find their company
        const me = await api.get<any>(API_ENDPOINTS.AUTH.ME);
        let myCompany = null;
        if (me?.id) {
          const result = await api.get<any>(API_ENDPOINTS.COMPANY, { params: { user_id: me.id } });
          if (Array.isArray(result) && result.length > 0) myCompany = result[0];
          else if (result?.id) myCompany = result;
        }

        // Fallback
        if (!myCompany) {
          try {
            myCompany = await api.get(API_ENDPOINTS.CMS.MY_COMPANY);
          } catch (e) { }
        }

        if (myCompany?.id) {
          setCompanyId(myCompany.id);
          const adminsData = await api.get(API_ENDPOINTS.CMS.ADMINS(myCompany.id));
          setAdmins(adminsData || []);
        }
      } catch (err: any) {
        // Fallback
        setAdmins(DUMMY_ADMINS);
      } finally {
        setAdmins(prev => {
          if (prev.length === 0) return DUMMY_ADMINS;
          return prev;
        });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddAdmin = async () => {
    if (!newAdminUserId.trim() || !companyId) return;
    try {
      const added = await api.post(API_ENDPOINTS.CMS.ADD_ADMIN(companyId), {
        user_id: newAdminUserId,
        role: selectedRole,
      });
      setAdmins([...admins, added]);
      setOpenDialog(false);
      setNewAdminUserId('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add admin');
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (!companyId || !confirm('Remove this admin?')) return;
    try {
      await api.delete(API_ENDPOINTS.CMS.REMOVE_ADMIN(companyId, adminId));
      setAdmins(admins.filter(a => a.id !== adminId));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to remove admin');
    }
  };

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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Admin Stats */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Card sx={{ flex: 1, p: 2, bgcolor: alpha(colors.primary, 0.05) }}>
            <Typography variant="h4" fontWeight={700} color={colors.primary}>{admins.length}</Typography>
            <Typography variant="body2" color="text.secondary">Total Admins</Typography>
          </Card>
          <Card sx={{ flex: 1, p: 2, bgcolor: alpha(colors.success, 0.05) }}>
            <Typography variant="h4" fontWeight={700} color={colors.success}>
              {admins.filter(a => a.role === 'owner').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Owners</Typography>
          </Card>
          <Card sx={{ flex: 1, p: 2, bgcolor: alpha(colors.warning, 0.05) }}>
            <Typography variant="h4" fontWeight={700} color={colors.warning}>
              {admins.filter(a => a.role === 'admin').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Admins</Typography>
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
                  <TableCell>Permissions</TableCell>
                  <TableCell>Added Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No admins found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: colors.primary }}>
                            {admin.user_name?.[0] || 'A'}
                          </Avatar>
                          <Typography fontWeight={500}>{admin.user_name || 'Unknown'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{admin.user_email || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={admin.role}
                          size="small"
                          sx={{ bgcolor: alpha(colors.primary, 0.1), color: colors.primary }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {admin.can_manage_jobs && <Chip label="Jobs" size="small" />}
                          {admin.can_manage_team && <Chip label="Team" size="small" />}
                          {admin.can_manage_admins && <Chip label="Admins" size="small" />}
                        </Box>
                      </TableCell>
                      <TableCell>{new Date(admin.added_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveAdmin(admin.id)}
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
        </Card>

        {/* Add Admin Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Admin</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="User ID (UUID)"
              value={newAdminUserId}
              onChange={(e) => setNewAdminUserId(e.target.value)}
              sx={{ mb: 2, mt: 2 }}
              placeholder="Enter user UUID"
              required
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="owner">Owner</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="hr">HR</MenuItem>
                <MenuItem value="recruiter">Recruiter</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              sx={{ bgcolor: colors.primary }}
              onClick={handleAddAdmin}
              disabled={!newAdminUserId.trim()}
            >
              Add Admin
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </CMSLayout>
  );
};

export default CMSPageAdmins;

