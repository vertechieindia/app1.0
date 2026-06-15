/**
 * Company admin: assign per-company recruiter, screener, and tech screener.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography, Alert, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import screeningService, { CompanyScreeningStaffMember, CompanyStaffRole } from '../../services/screeningService';

interface Props {
  companyId: string;
  companyName?: string;
}

const ROLE_LABELS: Record<CompanyStaffRole, string> = {
  recruiter: 'Recruiter (Requirements)',
  screener: 'Screener',
  tech_screener: 'Tech Screener',
};

const CompanyScreeningStaffPanel: React.FC<Props> = ({ companyId, companyName }) => {
  const [staff, setStaff] = useState<CompanyScreeningStaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assignOpen, setAssignOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [staffRole, setStaffRole] = useState<CompanyStaffRole>('recruiter');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await screeningService.listCompanyScreeningStaff(companyId);
      setStaff(data.items || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load screening team');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    if (companyId) load();
  }, [companyId, load]);

  const handleAssign = async () => {
    setSubmitting(true);
    setError('');
    try {
      await screeningService.assignCompanyScreeningStaff(companyId, email.trim(), staffRole);
      setEmail('');
      setAssignOpen(false);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to assign staff');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (staffId: string) => {
    if (!confirm('Remove this screening team member?')) return;
    try {
      await screeningService.removeCompanyScreeningStaff(companyId, staffId);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to remove');
    }
  };

  return (
    <Card sx={{ p: 3, mt: 3, mb: 2, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Screening Team</Typography>
          <Typography variant="body2" color="text.secondary">
            Assign company recruiters and screeners{companyName ? ` for ${companyName}` : ''}. They see only this company&apos;s sourcing and screening work.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setAssignOpen(true)}>
          Assign Member
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5}>Loading…</TableCell></TableRow>
            ) : staff.filter((s) => s.is_active).length === 0 ? (
              <TableRow><TableCell colSpan={5}>No screening team members yet.</TableCell></TableRow>
            ) : (
              staff.filter((s) => s.is_active).map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name || '—'}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>
                    <Chip size="small" label={ROLE_LABELS[s.staff_role as CompanyStaffRole] || s.staff_role} />
                  </TableCell>
                  <TableCell><Chip size="small" color="success" label="Active" /></TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error" onClick={() => handleRemove(s.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Screening Team Member</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            User must already have a VerTechie account. Enter their login email.
          </Typography>
          <TextField fullWidth label="Email" margin="dense" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select label="Role" value={staffRole} onChange={(e) => setStaffRole(e.target.value as CompanyStaffRole)}>
              <MenuItem value="recruiter">Recruiter — handles Get Help to Source requests</MenuItem>
              <MenuItem value="screener">Screener — screens candidates for this company</MenuItem>
              <MenuItem value="tech_screener">Tech Screener — enterprise verification for this company</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAssign} disabled={submitting || !email.trim()}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CompanyScreeningStaffPanel;
