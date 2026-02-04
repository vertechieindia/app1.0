/**
 * CMSEmployees - Team Members Management
 */

import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Tooltip,
  Grid,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CMSLayout from './CMSLayout';
import { api } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { DUMMY_EMPLOYEES } from './CMSDummyData';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
  warning: '#FF9500',
};

const CMSEmployees: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [members, setMembers] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      // Try getting user first to find their company
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
        const membersData = await api.get<any>(API_ENDPOINTS.CMS.TEAM_MEMBERS(myCompany.id));
        setMembers(membersData || []);

        // Fetch verification requests
        try {
          const requestsData = await api.get<any>(API_ENDPOINTS.CMS.UNVERIFIED_EMPLOYEES(myCompany.id));
          setPendingRequests(requestsData || []);
        } catch (e) {
          console.error("Failed to fetch verification requests", e);
        }
      }
    } catch (err: any) {
      setMembers(DUMMY_EMPLOYEES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMember = async () => {
    if (!newMemberEmail.trim() || !companyId) return;
    try {
      // Use dedicated invite endpoint so backend can handle email-based invites
      await api.post(API_ENDPOINTS.CMS.INVITE_TEAM_MEMBER(companyId), {
        email: newMemberEmail,
        role: 'member',
      });
      setOpenDialog(false);
      setNewMemberEmail('');
      fetchData();
    } catch (err: any) {
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message;
      setError(detail || 'Failed to send invite');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!companyId || !confirm('Remove this member?')) return;
    try {
      await api.delete(API_ENDPOINTS.CMS.DELETE_TEAM_MEMBER(companyId, memberId));
      fetchData();
    } catch (err: any) {
      setError('Failed to delete member');
    }
  };

  const handleVerifyExperience = async (experienceId: string) => {
    if (!companyId) return;
    try {
      await api.post(API_ENDPOINTS.CMS.VERIFY_EMPLOYEE(companyId, experienceId));
      fetchData();
    } catch (err: any) {
      setError('Failed to verify employee');
    }
  };

  const filteredMembers = members.filter(
    (member) => member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>Employee & Team Management</Typography>
            <Typography variant="body2" color="text.secondary">Manage your team members and verify employee work history.</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            sx={{ bgcolor: colors.primary, borderRadius: 2 }}
            onClick={() => setOpenDialog(true)}
          >
            Add Team Member
          </Button>
        </Box>

        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`Team Members (${members.length})`} />
          <Tab label={`Verification Requests (${pendingRequests.length})`} />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {tabIndex === 0 && (
          <>
            <TextField
              fullWidth
              placeholder="Search members..."
              size="small"
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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

            <TableContainer component={Card} sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)' }}>
              <Table>
                <TableHead sx={{ bgcolor: alpha(colors.primary, 0.02) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Member</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6} align="center"><CircularProgress size={24} /></TableCell></TableRow>
                  ) : filteredMembers.length === 0 ? (
                    <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>No members found.</TableCell></TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar src={member.avatar} sx={{ width: 32, height: 32, bgcolor: colors.primary }}>
                              {member.name?.[0]}
                            </Avatar>
                            <Typography variant="body2" fontWeight={500}>{member.name || 'Unknown'}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell><Typography variant="body2">{member.email}</Typography></TableCell>
                        <TableCell>
                          <Chip label={member.role} size="small" variant="outlined" sx={{ borderRadius: 1 }} />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={member.status}
                            size="small"
                            sx={{
                              borderRadius: 1,
                              bgcolor: member.status === 'active' ? alpha(colors.success, 0.1) : alpha(colors.warning, 0.1),
                              color: member.status === 'active' ? colors.success : colors.warning,
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                        </TableCell>
                        <TableCell><Typography variant="body2" color="text.secondary">{new Date(member.joined_at).toLocaleDateString()}</Typography></TableCell>
                        <TableCell align="right">
                          <Tooltip title="Remove Member">
                            <IconButton size="small" color="error" onClick={() => handleDeleteMember(member.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {tabIndex === 1 && (
          <Box>
            {pendingRequests.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'white', borderRadius: 4, border: '1px dashed #ccc' }}>
                <CheckCircleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary">All set! No pending verification requests.</Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {pendingRequests.map((req) => (
                  <Grid item xs={12} key={req.experience_id}>
                    <Card sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 3, border: `1px solid ${alpha(colors.primary, 0.1)}` }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: alpha(colors.primary, 0.1), color: colors.primary }}>
                          {req.full_name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700}>{req.full_name}</Typography>
                          <Typography variant="body2" color="text.secondary">{req.title} • {req.employment_type}</Typography>
                          <Typography variant="caption" color="text.disabled">
                            {req.start_date} - {req.is_current ? 'Present' : req.end_date}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleVerifyExperience(req.experience_id)}
                          sx={{ borderRadius: 2 }}
                        >
                          Verify
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<CancelIcon />}
                          sx={{ borderRadius: 2 }}
                        >
                          Reject
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: 700 }}>Add Team Member</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Invite a new member to your company page by their email address.
            </Typography>
            <TextField
              fullWidth
              autoFocus
              label="Email Address"
              type="email"
              placeholder="e.g. employee@company.com"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddMember} disabled={!newMemberEmail.trim()} sx={{ bgcolor: colors.primary, borderRadius: 2, px: 3 }}>
              Send Invite
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </CMSLayout>
  );
};

export default CMSEmployees;

