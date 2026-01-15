/**
 * AllCandidatesPage - View and Manage All Candidates
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, Chip, IconButton, TextField, Button, Rating, Checkbox, Menu, MenuItem,
  InputAdornment, FormControl, InputLabel, Select, Pagination, CircularProgress, Snackbar, Alert,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmailIcon from '@mui/icons-material/Email';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DownloadIcon from '@mui/icons-material/Download';
import ATSLayout from './ATSLayout';
import { userService } from '../../../services/jobPortalService';

interface Candidate {
  id: string | number;
  name: string;
  email: string;
  role: string;
  stage: string;
  rating: number;
  source: string;
  applied: string;
  status: string;
  avatar?: string;
  skills?: string[];
}

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'New': return { bg: alpha('#0d47a1', 0.1), text: '#0d47a1' };
    case 'Screening': return { bg: alpha('#FF9500', 0.1), text: '#FF9500' };
    case 'Interview': return { bg: alpha('#5856D6', 0.1), text: '#5856D6' };
    case 'Offer': return { bg: alpha('#34C759', 0.1), text: '#34C759' };
    case 'Hired': return { bg: alpha('#00C853', 0.1), text: '#00C853' };
    case 'Rejected': return { bg: alpha('#FF3B30', 0.1), text: '#FF3B30' };
    default: return { bg: alpha('#8E8E93', 0.1), text: '#8E8E93' };
  }
};

const AllCandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false, message: '', severity: 'info'
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch candidates from API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers(searchQuery, 100);
        
        // Map API data to display format
        const mappedCandidates: Candidate[] = data.map((user: any) => ({
          id: user.id,
          name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown',
          email: user.email || '',
          role: user.title || user.headline || user.current_position || 'Techie',
          stage: user.stage || 'New',
          rating: user.rating || Math.floor(Math.random() * 3) + 3, // 3-5 rating
          source: user.source || 'VerTechie',
          applied: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric' 
          }) : 'Recently',
          status: user.status || 'active',
          avatar: user.avatar || user.avatar_url,
          skills: user.skills || [],
        }));
        
        setCandidates(mappedCandidates);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setSnackbar({ open: true, message: 'Failed to load candidates', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [searchQuery]);

  // Filter candidates
  const filteredCandidates = candidates.filter(c => {
    const matchesStage = !stageFilter || c.stage.toLowerCase() === stageFilter.toLowerCase();
    return matchesStage;
  });

  // Paginate
  const paginatedCandidates = filteredCandidates.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(paginatedCandidates.map((c) => c.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: string | number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  return (
    <ATSLayout>
      {/* Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            sx={{ width: 300 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Stage</InputLabel>
            <Select 
              label="Stage" 
              value={stageFilter}
              onChange={(e) => { setStageFilter(e.target.value); setPage(1); }}
            >
              <MenuItem value="">All Stages</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="screening">Screening</MenuItem>
              <MenuItem value="interview">Interview</MenuItem>
              <MenuItem value="offer">Offer</MenuItem>
              <MenuItem value="hired">Hired</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<FilterListIcon />}>More Filters</Button>
          <Button variant="outlined" startIcon={<DownloadIcon />}>Export</Button>
        </Box>
      </Box>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, p: 1.5, bgcolor: alpha('#0d47a1', 0.05), borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={500}>{selected.length} selected</Typography>
          <Button size="small" startIcon={<EmailIcon />}>Send Email</Button>
          <Button size="small" startIcon={<ScheduleIcon />}>Schedule Interview</Button>
          <Button size="small" color="error">Reject</Button>
        </Box>
      )}

      {/* Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : paginatedCandidates.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">No candidates found</Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? 'Try adjusting your search criteria' : 'Candidates will appear here when they register'}
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha('#0d47a1', 0.03) }}>
                <TableCell padding="checkbox">
                  <Checkbox 
                    checked={selected.length === paginatedCandidates.length && paginatedCandidates.length > 0} 
                    onChange={handleSelectAll} 
                  />
                </TableCell>
                <TableCell><strong>Candidate</strong></TableCell>
                <TableCell><strong>Role/Title</strong></TableCell>
                <TableCell><strong>Stage</strong></TableCell>
                <TableCell><strong>Rating</strong></TableCell>
                <TableCell><strong>Source</strong></TableCell>
                <TableCell><strong>Joined</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCandidates.map((candidate) => {
                const stageColor = getStageColor(candidate.stage);
                return (
                  <TableRow key={candidate.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selected.includes(candidate.id)} onChange={() => handleSelect(candidate.id)} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar 
                          src={candidate.avatar} 
                          sx={{ bgcolor: alpha('#0d47a1', 0.1), color: '#0d47a1' }}
                        >
                          {candidate.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{candidate.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{candidate.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{candidate.role}</TableCell>
                    <TableCell>
                      <Chip label={candidate.stage} size="small" sx={{ bgcolor: stageColor.bg, color: stageColor.text, fontWeight: 500 }} />
                    </TableCell>
                    <TableCell><Rating value={candidate.rating} size="small" readOnly /></TableCell>
                    <TableCell>{candidate.source}</TableCell>
                    <TableCell>{candidate.applied}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => { setMenuAnchor(e.currentTarget); setSelectedCandidate(candidate); }}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {((page - 1) * itemsPerPage) + 1} - {Math.min(page * itemsPerPage, filteredCandidates.length)} of {filteredCandidates.length} candidates
          </Typography>
          <Pagination 
            count={totalPages} 
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary" 
          />
        </Box>
      )}

      {/* Action Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => { setMenuAnchor(null); setSelectedCandidate(null); }}>
        <MenuItem onClick={() => { 
          setMenuAnchor(null); 
          if (selectedCandidate) {
            navigate(`/techie/ats/candidate/${selectedCandidate.id}`);
          }
        }}>View Profile</MenuItem>
        <MenuItem onClick={() => { 
          setMenuAnchor(null); 
          if (selectedCandidate?.email) {
            window.location.href = `mailto:${selectedCandidate.email}`;
          }
        }}>Send Email</MenuItem>
        <MenuItem onClick={() => { setMenuAnchor(null); setSnackbar({ open: true, message: 'Schedule interview feature coming soon', severity: 'info' }); }}>Schedule Interview</MenuItem>
        <MenuItem onClick={() => { setMenuAnchor(null); setSnackbar({ open: true, message: 'Stage update feature coming soon', severity: 'info' }); }}>Move to Next Stage</MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)} sx={{ color: 'error.main' }}>Reject</MenuItem>
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ATSLayout>
  );
};

export default AllCandidatesPage;


