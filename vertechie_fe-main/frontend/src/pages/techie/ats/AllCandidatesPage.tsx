import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import ATSLayout from './ATSLayout';
import { getApiUrl } from '../../../config/api';

interface CandidateRow {
  applicationId: string;
  candidateId: string;
  jobId: string;
  name: string;
  email: string;
  role: string;
  stage: string;
  source?: string;
  applied: string;
  status: string;
  avatar?: string;
}

const STAGES = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'] as const;
type StageType = typeof STAGES[number];

const statusToStage = (status?: string): StageType => {
  const s = (status || '').toLowerCase();
  if (s === 'under_review' || s === 'shortlisted') return 'screening';
  if (s === 'interview') return 'interview';
  if (s === 'offered') return 'offer';
  if (s === 'hired') return 'hired';
  if (s === 'rejected') return 'rejected';
  return 'new';
};

const stageLabel = (stage: string) => stage.charAt(0).toUpperCase() + stage.slice(1);

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'new':
      return { bg: alpha('#0d47a1', 0.1), text: '#0d47a1' };
    case 'screening':
      return { bg: alpha('#FF9500', 0.1), text: '#FF9500' };
    case 'interview':
      return { bg: alpha('#5856D6', 0.1), text: '#5856D6' };
    case 'offer':
      return { bg: alpha('#34C759', 0.1), text: '#34C759' };
    case 'hired':
      return { bg: alpha('#00C853', 0.1), text: '#00C853' };
    case 'rejected':
      return { bg: alpha('#FF3B30', 0.1), text: '#FF3B30' };
    default:
      return { bg: alpha('#8E8E93', 0.1), text: '#8E8E93' };
  }
};

const toCsvCell = (value: unknown) => {
  const text = String(value ?? '');
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
};

const AllCandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRow | null>(null);
  const [moreFiltersAnchor, setMoreFiltersAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [bulkStage, setBulkStage] = useState<StageType>('screening');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const token = localStorage.getItem('authToken');

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchCandidates = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(getApiUrl('/hiring/pipeline/candidates'), { headers });
      if (!res.ok) throw new Error('pipeline-candidates-failed');
      const data = await res.json();
      const rows: CandidateRow[] = (Array.isArray(data) ? data : []).map((item: any) => {
        const stage = STAGES.includes(item.stage) ? item.stage : statusToStage(item.status);
        return {
          applicationId: String(item.application_id || item.id || ''),
          candidateId: String(item.user_id || ''),
          jobId: String(item.job_id || ''),
          name: item.name || item.email?.split('@')?.[0] || 'Candidate',
          email: item.email || '',
          role: item.job_title || item.role || '',
          stage,
          source: item.source || '',
          applied: item.time || '',
          status: item.status || stage,
          avatar: item.avatar || undefined,
        };
      }).filter((r) => r.applicationId && r.candidateId);

      setCandidates(rows);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setSnackbar({ open: true, message: 'Failed to load candidates', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
    const intervalId = window.setInterval(fetchCandidates, 20000);
    const onFocus = () => fetchCandidates();
    window.addEventListener('focus', onFocus);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const filteredCandidates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return candidates.filter((c) => {
      const matchesStage = !stageFilter || c.stage === stageFilter;
      const matchesRole = !roleFilter || c.role === roleFilter;
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q);
      return matchesStage && matchesRole && matchesQuery;
    });
  }, [candidates, searchQuery, stageFilter, roleFilter]);

  const roleOptions = useMemo(
    () => Array.from(new Set(candidates.map((c) => c.role).filter(Boolean))).sort(),
    [candidates]
  );

  const paginatedCandidates = filteredCandidates.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(paginatedCandidates.map((c) => c.applicationId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (applicationId: string) => {
    setSelectedIds((prev) =>
      prev.includes(applicationId) ? prev.filter((id) => id !== applicationId) : [...prev, applicationId]
    );
  };

  const runBulkStageUpdate = async () => {
    if (!selectedIds.length) return;
    try {
      const res = await fetch(getApiUrl('/hiring/applications/bulk-stage'), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          application_ids: selectedIds,
          stage: bulkStage,
        }),
      });
      if (!res.ok) throw new Error('bulk-stage-failed');
      const data = await res.json();
      setSnackbar({ open: true, message: `Updated ${data.count || 0} candidates to ${stageLabel(bulkStage)}`, severity: 'success' });
      setSelectedIds([]);
      await fetchCandidates();
    } catch {
      setSnackbar({ open: true, message: 'Bulk stage update failed', severity: 'error' });
    }
  };

  const runBulkDelete = async () => {
    if (!selectedIds.length) return;
    const confirmDelete = window.confirm(`Delete ${selectedIds.length} application(s)? This cannot be undone.`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(getApiUrl('/hiring/applications/bulk-delete'), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          application_ids: selectedIds,
        }),
      });
      if (!res.ok) throw new Error('bulk-delete-failed');
      const data = await res.json();
      setSnackbar({ open: true, message: `Deleted ${data.count || 0} application(s)`, severity: 'success' });
      setSelectedIds([]);
      await fetchCandidates();
    } catch {
      setSnackbar({ open: true, message: 'Bulk delete failed', severity: 'error' });
    }
  };

  const handleExport = () => {
    const rowsToExport = selectedIds.length
      ? filteredCandidates.filter((c) => selectedIds.includes(c.applicationId))
      : filteredCandidates;

    if (!rowsToExport.length) {
      setSnackbar({ open: true, message: 'No candidates to export', severity: 'info' });
      return;
    }

    const header = ['Candidate Name', 'Email', 'Role/Title', 'Stage', 'Source', 'Applied', 'Status'];
    const csvLines = [
      header.map(toCsvCell).join(','),
      ...rowsToExport.map((candidate) =>
        [
          candidate.name,
          candidate.email,
          candidate.role,
          stageLabel(candidate.stage),
          candidate.source || 'N/A',
          candidate.applied || 'N/A',
          candidate.status,
        ].map(toCsvCell).join(',')
      ),
    ];

    const csvContent = csvLines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const datePart = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `ats-candidates-${datePart}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSnackbar({
      open: true,
      message: `Exported ${rowsToExport.length} candidate(s)`,
      severity: 'success',
    });
  };

  return (
    <ATSLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            sx={{ width: 300 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Stage</InputLabel>
            <Select
              label="Stage"
              value={stageFilter}
              onChange={(e) => {
                setStageFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">All Stages</MenuItem>
              {STAGES.map((stage) => (
                <MenuItem key={stage} value={stage}>{stageLabel(stage)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={(e) => setMoreFiltersAnchor(e.currentTarget)}
          >
            More Filters
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
            Export
          </Button>
        </Box>
      </Box>

      {selectedIds.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, p: 1.5, bgcolor: alpha('#0d47a1', 0.05), borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={500}>{selectedIds.length} selected</Typography>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Move To</InputLabel>
            <Select
              label="Move To"
              value={bulkStage}
              onChange={(e) => setBulkStage(e.target.value as StageType)}
            >
              {STAGES.map((stage) => (
                <MenuItem key={stage} value={stage}>{stageLabel(stage)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button size="small" variant="contained" onClick={runBulkStageUpdate}>
            Update Stage
          </Button>
          <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={runBulkDelete}>
            Delete
          </Button>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : paginatedCandidates.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">No candidates found</Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha('#0d47a1', 0.03) }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.length === paginatedCandidates.length && paginatedCandidates.length > 0}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell><strong>Candidate</strong></TableCell>
                <TableCell><strong>Role/Title</strong></TableCell>
                <TableCell><strong>Stage</strong></TableCell>
                <TableCell><strong>Source</strong></TableCell>
                <TableCell><strong>Applied</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCandidates.map((candidate) => {
                const stageColor = getStageColor(candidate.stage);
                return (
                  <TableRow key={candidate.applicationId} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(candidate.applicationId)}
                        onChange={() => handleSelect(candidate.applicationId)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={candidate.avatar} sx={{ bgcolor: alpha('#0d47a1', 0.1), color: '#0d47a1' }}>
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
                      <Chip label={stageLabel(candidate.stage)} size="small" sx={{ bgcolor: stageColor.bg, color: stageColor.text, fontWeight: 500 }} />
                    </TableCell>
                    <TableCell>{candidate.source || 'N/A'}</TableCell>
                    <TableCell>{candidate.applied || 'N/A'}</TableCell>
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

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {((page - 1) * itemsPerPage) + 1} - {Math.min(page * itemsPerPage, filteredCandidates.length)} of {filteredCandidates.length} candidates
          </Typography>
          <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
        </Box>
      )}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => { setMenuAnchor(null); setSelectedCandidate(null); }}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            if (selectedCandidate) navigate(`/techie/ats/candidate/${selectedCandidate.candidateId}`);
          }}
        >
          View Profile
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={moreFiltersAnchor}
        open={Boolean(moreFiltersAnchor)}
        onClose={() => setMoreFiltersAnchor(null)}
      >
        <Box sx={{ p: 2, width: 280 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">All Roles</MenuItem>
              {roleOptions.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              size="small"
              onClick={() => {
                setRoleFilter('');
                setStageFilter('');
                setSearchQuery('');
                setPage(1);
                setMoreFiltersAnchor(null);
              }}
            >
              Clear
            </Button>
            <Button size="small" variant="contained" onClick={() => setMoreFiltersAnchor(null)}>
              Apply
            </Button>
          </Box>
        </Box>
      </Menu>

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
