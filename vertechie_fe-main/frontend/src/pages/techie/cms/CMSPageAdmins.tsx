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
  Grid,
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
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const me = await api.get<any>(API_ENDPOINTS.AUTH.ME);
      let myCompany = null;
      if (me?.id) {
        const result = await api.get<any>(API_ENDPOINTS.COMPANY, { params: { user_id: me.id } });
        if (Array.isArray(result) && result.length > 0) myCompany = result[0];
        else if (result?.id) myCompany = result;
      }

      if (!myCompany) {
        try {
          myCompany = await api.get<any>(API_ENDPOINTS.CMS.MY_COMPANY);
        } catch (e) { }
      }

      if (myCompany?.id) {
        setCompanyId(myCompany.id);
        const adminsData = await api.get<any>(API_ENDPOINTS.CMS.ADMINS(myCompany.id));
        setAdmins(adminsData || []);
      }
    } catch (err: any) {
      setAdmins(DUMMY_ADMINS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim() || !companyId) return;
    try {
      setLoading(true);
      await api.post(API_ENDPOINTS.CMS.ADD_ADMIN(companyId), {
        email: newAdminEmail,
        role: selectedRole,
      });
      setOpenDialog(false);
      setNewAdminEmail('');
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add admin');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (!companyId || !confirm('Remove this admin?')) return;
    try {
      await api.delete(API_ENDPOINTS.CMS.REMOVE_ADMIN(companyId, adminId));
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to remove admin');
    }
  };

  return (
    <CMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>Page Admins</Typography>
            <Typography variant="body2" color="text.secondary">Who can manage this company profile.</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: colors.primary, borderRadius: 2, px: 3 }}
            onClick={() => setOpenDialog(true)}
          >
            Add Admin
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError(null)}>
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
                {admins.filter(a => a.role === 'owner').length}
              </Typography>
              <Typography variant="body2" fontWeight={500} color="text.secondary">Owners</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 2.5, bgcolor: alpha(colors.warning, 0.04), borderRadius: 3, boxShadow: 'none' }}>
              <Typography variant="h4" fontWeight={800} color={colors.warning}>
                {admins.filter(a => a.role === 'admin').length}
              </Typography>
              <Typography variant="body2" fontWeight={500} color="text.secondary">Editors</Typography>
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
                          {admin.user_name?.[0] || 'A'}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>{admin.user_name || 'Admin User'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{admin.user_email || '-'}</Typography></TableCell>
                    <TableCell>
                      <Chip
                        label={admin.role}
                        size="small"
                        sx={{
                          bgcolor: alpha(colors.primary, 0.08),
                          color: colors.primary,
                          fontWeight: 700,
                          textTransform: 'capitalize',
                          borderRadius: 1.5
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {admin.can_manage_jobs && <Chip label="Jobs" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />}
                        {admin.can_manage_team && <Chip label="Team" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />}
                        {admin.can_manage_admins && <Chip label="Admins" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />}
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
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>Add Page Admin</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Provide the email of the user you want to add as an admin. They must have a VerTechie account.
            </Typography>
            <TextField
              fullWidth
              label="User Email"
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="e.g. admin@vertechie.com"
              required
            />
            <FormControl fullWidth>
              <InputLabel>Administrative Role</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                label="Administrative Role"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="owner">Owner (Full Access)</MenuItem>
                <MenuItem value="admin">Admin (Manage Jobs & Team)</MenuItem>
                <MenuItem value="hr">HR (Manage Team & Verifications)</MenuItem>
                <MenuItem value="recruiter">Recruiter (Post Jobs only)</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
            <Button
              variant="contained"
              sx={{ bgcolor: colors.primary, borderRadius: 2, px: 4 }}
              onClick={handleAddAdmin}
              disabled={!newAdminEmail.trim() || loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Add Admin'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </CMSLayout>
  );
};

export default CMSPageAdmins;

