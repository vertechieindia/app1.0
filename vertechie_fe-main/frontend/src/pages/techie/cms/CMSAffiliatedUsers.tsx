/**
 * CMS — users affiliated with this company (admins, profile link, experience link).
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CMSLayout from './CMSLayout';
import { fetchMyCompanyForCMS } from './cmsCompanyFetch';
import { api } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api';

const colors = {
  primary: '#0d47a1',
};

export type AffiliatedUserRow = {
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  association_sources: string[];
};

const SOURCE_LABEL: Record<string, string> = {
  company_admin: 'Company admin',
  profile: 'Profile',
  experience: 'Work experience',
};

const CMSAffiliatedUsers: React.FC = () => {
  const [rows, setRows] = useState<AffiliatedUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const my = await fetchMyCompanyForCMS();
        if (!my?.id) {
          setRows([]);
          return;
        }
        const data = await api.get<AffiliatedUserRow[]>(
          API_ENDPOINTS.CMS.AFFILIATED_USERS(my.id),
        );
        setRows(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.response?.data?.detail || e?.message || 'Failed to load affiliated users');
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <CMSLayout>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <PersonSearchIcon sx={{ color: colors.primary }} />
          <Typography variant="h6" fontWeight={700}>
            Affiliated users
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          People linked as company admins, profile company, or work experience (by company record or the same
          company name you had on file before the page existed).
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Association</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="body2" color="text.secondary">
                          No affiliated users found yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((r) => (
                      <TableRow key={r.user_id}>
                        <TableCell>
                          {[r.first_name, r.last_name].filter(Boolean).join(' ') || '—'}
                        </TableCell>
                        <TableCell>{r.email || '—'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(r.association_sources || []).map((s) => (
                              <Chip
                                key={s}
                                size="small"
                                label={SOURCE_LABEL[s] || s}
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </Box>
    </CMSLayout>
  );
};

export default CMSAffiliatedUsers;
