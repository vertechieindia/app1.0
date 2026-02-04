/**
 * CMSSettings - Company Page Settings
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BusinessIcon from '@mui/icons-material/Business';
import CMSLayout from './CMSLayout';
import { api } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
};

const CMSSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState({
    name: '',
    tagline: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    industry: '',
    size: '',
    description: '',
    allowEmployeeVerification: true,
    showJobPostings: true,
    enableMessaging: true,
    showContactInfo: true,
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Fetch company data for the logged-in HR/company admin
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Backend provides current user's company at /users/me/company
        const myCompany = await api.get<any>(API_ENDPOINTS.CMS.MY_COMPANY);

        if (!myCompany || !myCompany.id) {
          setError('Company not found. Please create or join a company first.');
          return;
        }

        setCompanyId(myCompany.id);

        // Company size is already a human readable string in this response
        const companySize = myCompany.company_size || '';

        setSettings((prev) => ({
          ...prev,
          name: myCompany.name || prev.name,
          tagline: myCompany.tagline || prev.tagline,
          website: myCompany.website || prev.website,
          email: myCompany.email || prev.email,
          phone: myCompany.phone || prev.phone,
          address: myCompany.headquarters || prev.address,
          industry: myCompany.industry || prev.industry,
          size: companySize || prev.size,
          description: myCompany.description || prev.description,
        }));

        setLogoUrl(myCompany.logo_url || null);
      } catch (err: any) {
        console.error('Failed to fetch company data:', err);
        setError(err?.response?.data?.detail || 'Failed to load company data');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [field]: event.target.value });
  };

  const handleToggle = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [field]: event.target.checked });
  };

  const handleSave = async () => {
    if (!companyId) {
      setError('Company ID not found');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Parse company size back to number if needed
      let employeesCount: number | undefined = undefined;
      if (settings.size) {
        const sizeMatch = settings.size.match(/(\d+)-(\d+)/);
        if (sizeMatch) {
          employeesCount = parseInt(sizeMatch[2]);
        } else if (settings.size.includes('1000+')) {
          employeesCount = 1000;
        }
      }

      const updatePayload: any = {
        name: settings.name.trim(),
        tagline: settings.tagline.trim() || undefined,
        website: settings.website.trim() || undefined,
        email: settings.email.trim() || undefined,
        phone: settings.phone.trim() || undefined,
        headquarters: settings.address.trim() || undefined,
        industry: settings.industry.trim() || undefined,
        description: settings.description.trim() || undefined,
      };

      if (employeesCount !== undefined) {
        updatePayload.employees_count = employeesCount;
      }

      // Remove undefined values
      Object.keys(updatePayload).forEach(key => {
        if (updatePayload[key] === undefined || updatePayload[key] === '') {
          delete updatePayload[key];
        }
      });

      console.log('Updating company:', companyId, 'with payload:', updatePayload);

      // Use CMS namespace for update endpoint
      await api.put(API_ENDPOINTS.CMS.UPDATE_COMPANY(companyId), updatePayload);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to update company:', err);
      const errorDetail = err?.response?.data?.detail || err?.response?.data?.message || err?.message;
      setError(errorDetail || 'Failed to save company details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <CMSLayout>
      <Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Page Settings
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSuccess(false)}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Company settings saved successfully.
          </Alert>
        </Snackbar>

        <Grid container spacing={3}>
          {/* Profile Settings */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Company Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Logo Upload */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                  <Avatar
                    src={logoUrl || undefined}
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: alpha(colors.primary, 0.1),
                    }}
                  >
                    {!logoUrl && <BusinessIcon sx={{ fontSize: 50, color: colors.primary }} />}
                  </Avatar>
                  <Box>
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCameraIcon />}
                      sx={{ mb: 1 }}
                      disabled
                    >
                      Change Logo
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      Recommended: 400x400px, PNG or JPG (Coming soon)
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      value={settings.name}
                      onChange={handleChange('name')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Tagline"
                      value={settings.tagline}
                      onChange={handleChange('tagline')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Industry"
                      value={settings.industry}
                      onChange={handleChange('industry')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company Size"
                      value={settings.size}
                      onChange={handleChange('size')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Website"
                      value={settings.website}
                      onChange={handleChange('website')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Careers Email"
                      value={settings.email}
                      onChange={handleChange('email')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={settings.phone}
                      onChange={handleChange('phone')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Headquarters"
                      value={settings.address}
                      onChange={handleChange('address')}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  About
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Company Description"
                  placeholder="Tell visitors about your company..."
                  value={settings.description}
                  onChange={handleChange('description')}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Privacy & Features */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Features
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.allowEmployeeVerification}
                        onChange={handleToggle('allowEmployeeVerification')}
                        color="primary"
                      />
                    }
                    label="Allow Employee Verification"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showJobPostings}
                        onChange={handleToggle('showJobPostings')}
                        color="primary"
                      />
                    }
                    label="Show Job Postings"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableMessaging}
                        onChange={handleToggle('enableMessaging')}
                        color="primary"
                      />
                    }
                    label="Enable Messaging"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showContactInfo}
                        onChange={handleToggle('showContactInfo')}
                        color="primary"
                      />
                    }
                    label="Show Contact Info"
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card sx={{ border: '1px solid', borderColor: 'error.light' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} color="error" gutterBottom>
                  Danger Zone
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Deleting your company page will remove all data associated with it. This action cannot be undone.
                </Typography>
                <Button variant="outlined" color="error" fullWidth>
                  Delete Page
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            size="large"
            onClick={handleSave}
            disabled={saving || !companyId || !settings.name.trim()}
            sx={{ bgcolor: colors.primary }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </CMSLayout>
  );
};

export default CMSSettings;

