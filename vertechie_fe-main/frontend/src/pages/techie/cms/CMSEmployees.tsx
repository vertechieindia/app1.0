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
import CMSLayout from './CMSLayout';
import { api } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { DUMMY_EMPLOYEES } from './CMSDummyData';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

const CMSEmployees: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', title: '', bio: '', linkedin_url: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try getting user first to find their company
        const me = await api.get<any>(API_ENDPOINTS.AUTH.ME);
        let myCompany = null;
        if (me?.id) {
          const result = await api.get(API_ENDPOINTS.COMPANY, { params: { user_id: me.id } });
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
          const members = await api.get(API_ENDPOINTS.CMS.TEAM_MEMBERS(myCompany.id));
          setTeamMembers(members || []);
        }
      } catch (err: any) {
        // Fallback
        setTeamMembers(DUMMY_EMPLOYEES);
      } finally {
        setTeamMembers(prev => {
          if (prev.length === 0) return DUMMY_EMPLOYEES;
          return prev;
        });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddMember = async () => {
    if (!newMember.name.trim() || !companyId) return;
    try {
      const added = await api.post(API_ENDPOINTS.CMS.ADD_TEAM_MEMBER(companyId), newMember);
      setTeamMembers([...teamMembers, added]);
      setAddDialogOpen(false);
      setNewMember({ name: '', title: '', bio: '', linkedin_url: '' });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add team member');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!companyId || !confirm('Delete this team member?')) return;
    try {
      await api.delete(API_ENDPOINTS.CMS.DELETE_TEAM_MEMBER(companyId, memberId));
      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete team member');
    }
  };

  const filteredMembers = teamMembers.filter(
    (m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.title && m.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <CMSLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>Team Members</Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: colors.primary }}
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
          >
            Add Team Member
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Card sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: alpha(colors.success, 0.1) }}>
            <Typography variant="h4" fontWeight={700} color={colors.success}>{teamMembers.length}</Typography>
            <Typography variant="body2" color="text.secondary">Total Team Members</Typography>
          </Card>
          <Card sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: alpha(colors.primary, 0.1) }}>
            <Typography variant="h4" fontWeight={700} color={colors.primary}>
              {teamMembers.filter(m => m.is_leadership).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Leadership</Typography>
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

        {/* Team Members Table */}
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
                  <TableCell>Title</TableCell>
                  <TableCell>Bio</TableCell>
                  <TableCell>LinkedIn</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No team members yet. Add your first team member!</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={member.photo_url || undefined}
                            sx={{ bgcolor: colors.primary, width: 32, height: 32 }}
                          >
                            {member.name[0]}
                          </Avatar>
                          <Typography fontWeight={500}>{member.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{member.title || '-'}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {member.bio || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {member.linkedin_url ? (
                          <Button size="small" href={member.linkedin_url} target="_blank">View</Button>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {member.is_leadership && (
                          <Chip label="Leadership" size="small" sx={{ bgcolor: alpha(colors.primary, 0.1), color: colors.primary }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Add Team Member Dialog */}
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              sx={{ mb: 2, mt: 1 }}
              required
            />
            <TextField
              fullWidth
              label="Title"
              value={newMember.title}
              onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Bio"
              value={newMember.bio}
              onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="LinkedIn URL"
              value={newMember.linkedin_url}
              onChange={(e) => setNewMember({ ...newMember, linkedin_url: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAddMember}
              disabled={!newMember.name.trim()}
              sx={{ bgcolor: colors.primary }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </CMSLayout>
  );
};

export default CMSEmployees;

