/**
 * AllCandidatesPage - View and Manage All Candidates
 */

import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, Chip, IconButton, TextField, Button, Rating, Checkbox, Menu, MenuItem,
  InputAdornment, FormControl, InputLabel, Select, Pagination,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmailIcon from '@mui/icons-material/Email';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DownloadIcon from '@mui/icons-material/Download';
import ATSLayout from './ATSLayout';

const candidates = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', role: 'Senior React Developer', stage: 'Screening', rating: 4, source: 'LinkedIn', applied: 'Dec 26, 2024', status: 'active' },
  { id: 2, name: 'Mike Chen', email: 'mike@email.com', role: 'Senior React Developer', stage: 'Interview', rating: 5, source: 'Referral', applied: 'Dec 25, 2024', status: 'active' },
  { id: 3, name: 'Emily Davis', email: 'emily@email.com', role: 'UX Designer', stage: 'New', rating: 3, source: 'Indeed', applied: 'Dec 24, 2024', status: 'active' },
  { id: 4, name: 'Alex Rivera', email: 'alex@email.com', role: 'Product Manager', stage: 'Offer', rating: 5, source: 'LinkedIn', applied: 'Dec 20, 2024', status: 'active' },
  { id: 5, name: 'Jordan Lee', email: 'jordan@email.com', role: 'DevOps Engineer', stage: 'Interview', rating: 4, source: 'Direct', applied: 'Dec 18, 2024', status: 'active' },
  { id: 6, name: 'Taylor Smith', email: 'taylor@email.com', role: 'Senior React Developer', stage: 'Rejected', rating: 2, source: 'Indeed', applied: 'Dec 15, 2024', status: 'rejected' },
  { id: 7, name: 'Morgan Williams', email: 'morgan@email.com', role: 'UX Designer', stage: 'Hired', rating: 5, source: 'Referral', applied: 'Dec 10, 2024', status: 'hired' },
];

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
  const [selected, setSelected] = useState<number[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(candidates.map((c) => c.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <ATSLayout>
      {/* Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search candidates..."
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            sx={{ width: 300 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Stage</InputLabel>
            <Select label="Stage" defaultValue="">
              <MenuItem value="">All Stages</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="screening">Screening</MenuItem>
              <MenuItem value="interview">Interview</MenuItem>
              <MenuItem value="offer">Offer</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Job</InputLabel>
            <Select label="Job" defaultValue="">
              <MenuItem value="">All Jobs</MenuItem>
              <MenuItem value="react">Senior React Developer</MenuItem>
              <MenuItem value="pm">Product Manager</MenuItem>
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
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha('#0d47a1', 0.03) }}>
              <TableCell padding="checkbox">
                <Checkbox checked={selected.length === candidates.length} onChange={handleSelectAll} />
              </TableCell>
              <TableCell><strong>Candidate</strong></TableCell>
              <TableCell><strong>Applied For</strong></TableCell>
              <TableCell><strong>Stage</strong></TableCell>
              <TableCell><strong>Rating</strong></TableCell>
              <TableCell><strong>Source</strong></TableCell>
              <TableCell><strong>Applied</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate) => {
              const stageColor = getStageColor(candidate.stage);
              return (
                <TableRow key={candidate.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(candidate.id)} onChange={() => handleSelect(candidate.id)} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: alpha('#0d47a1', 0.1), color: '#0d47a1' }}>
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
                    <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={10} color="primary" />
      </Box>

      {/* Action Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => setMenuAnchor(null)}>View Profile</MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>Send Email</MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>Schedule Interview</MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>Move to Next Stage</MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)} sx={{ color: 'error.main' }}>Reject</MenuItem>
      </Menu>
    </ATSLayout>
  );
};

export default AllCandidatesPage;


