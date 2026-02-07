/**
 * SMSAlumni - Alumni Verification Management (list, verify, invite)
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
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SMSLayout from './SMSLayout';
import { api } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

const SMSAlumni: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const mySchool = await api.get<any>(API_ENDPOINTS.SMS.MY_SCHOOL);
        if (mySchool?.id) {
          setSchoolId(mySchool.id);
          const data = await api.get<any[]>(API_ENDPOINTS.SMS.MEMBERS(mySchool.id));
          setMembers(Array.isArray(data) ? data : []);
        } else {
          setMembers([]);
        }
      } catch (err: any) {
        console.error('Error loading alumni/members:', err);
        setError(err?.response?.data?.detail || 'Failed to load members.');
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVerify = async (memberId: string) => {
    if (!schoolId) return;
    setVerifyingId(memberId);
    setError(null);
    try {
      await api.put(API_ENDPOINTS.SMS.VERIFY_MEMBER(schoolId, memberId));
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, is_verified: true } : m))
      );
      setSnackbar({ open: true, message: 'Member verified successfully.', severity: 'success' });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.detail || 'Failed to verify member.',
        severity: 'error',
      });
    } finally {
      setVerifyingId(null);
    }
  };

  const handleInviteSubmit = async () => {
    if (!inviteEmail.trim() || !schoolId) return;
    setInviting(true);
    setError(null);
    try {
      await api.post(API_ENDPOINTS.SMS.INVITE_MEMBER(schoolId), {
        email: inviteEmail.trim(),
        member_type: 'alumni',
      });
      setSnackbar({
        open: true,
        message: `Invite sent to ${inviteEmail}. They will appear in the list once they register.`,
        severity: 'success',
      });
      setInviteOpen(false);
      setInviteEmail('');
      // Refresh members list
      const data = await api.get<any[]>(API_ENDPOINTS.SMS.MEMBERS(schoolId));
      setMembers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const detail = err?.response?.data?.detail || err?.message || 'Failed to send invite.';
      setSnackbar({ open: true, message: detail, severity: 'error' });
      setError(detail);
    } finally {
      setInviting(false);
    }
  };

  const getStatusColor = (isVerified: boolean) => (isVerified ? colors.success : colors.warning);

  const filteredMembers = members.filter(
    (m) =>
      (m.name && m.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const verifiedCount = members.filter((m) => m.is_verified).length;
  const pendingCount = members.filter((m) => !m.is_verified).length;

  return (
    <SMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Alumni Verification
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Export
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: colors.primary }}
              startIcon={<PersonAddIcon />}
              onClick={() => setInviteOpen(true)}
            >
              Invite Alumni
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Card sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: alpha(colors.success, 0.1) }}>
            <Typography variant="h4" fontWeight={700} color={colors.success}>
              {verifiedCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Verified
            </Typography>
          </Card>
          <Card sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: alpha(colors.warning, 0.1) }}>
            <Typography variant="h4" fontWeight={700} color={colors.warning}>
              {pendingCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </Card>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search by name or email..."
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Batch / Year</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: colors.primary, width: 32, height: 32 }}>
                          {(member.name || member.email || '?')[0]}
                        </Avatar>
                        <Typography fontWeight={500}>{member.name || member.email || '—'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.graduation_year || member.student_id || '—'}</TableCell>
                    <TableCell>{member.member_type || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={member.status === 'invited' ? 'Invited' : (member.is_verified ? 'Verified' : 'Pending')}
                        size="small"
                        sx={{
                          bgcolor: alpha(member.status === 'invited' ? colors.primary : (member.is_verified ? colors.success : colors.warning), 0.1),
                          color: member.status === 'invited' ? colors.primary : (member.is_verified ? colors.success : colors.warning),
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {member.status === 'invited' ? (
                        <IconButton size="small" disabled title="Invite Sent">
                          <PersonAddIcon />
                        </IconButton>
                      ) : !member.is_verified ? (
                        <IconButton
                          size="small"
                          sx={{ color: colors.success }}
                          onClick={() => handleVerify(member.id)}
                          disabled={verifyingId === member.id}
                        >
                          {verifyingId === member.id ? (
                            <CircularProgress size={20} />
                          ) : (
                            <CheckCircleIcon />
                          )}
                        </IconButton>
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
        )}

        {!loading && filteredMembers.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">No members found. Invite alumni to get started.</Typography>
          </Box>
        )}

        <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Invite Alumni</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Email address"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="alumni@example.com"
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleInviteSubmit} disabled={inviting || !inviteEmail.trim()} sx={{ bgcolor: colors.primary }}>
              {inviting ? 'Sending...' : 'Send Invite'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </SMSLayout>
  );
};

export default SMSAlumni;
