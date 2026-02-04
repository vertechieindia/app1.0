/**
 * SMSSettings - School Page Settings
 */

import React, { useState, useEffect, useRef } from 'react';
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
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { alpha } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SchoolIcon from '@mui/icons-material/School';
import SMSLayout from './SMSLayout';
import { api } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import Alert from '@mui/material/Alert';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
};

const SMSSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    name: '',
    tagline: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    allowAlumniVerification: true,
    showPlacementData: true,
    enableMessaging: true,
    showContactInfo: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load existing school details so settings page shows real data
  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setLoading(true);
        setError(null);
        const school = await api.get<any>(API_ENDPOINTS.SMS.MY_SCHOOL);
        if (school) {
          if (school.id) setSchoolId(school.id);
          if (school.logo_url) setLogoUrl(school.logo_url);
          const addressParts = [
            school.city || '',
            school.state || '',
            school.country || '',
          ].filter(Boolean);

          setSettings((prev) => ({
            ...prev,
            name: school.name || prev.name,
            tagline: school.tagline || prev.tagline,
            website: school.website || prev.website,
            email: school.email || prev.email,
            phone: school.phone || prev.phone,
            address:
              addressParts.length > 0
                ? addressParts.join(', ')
                : prev.address,
          }));
        }
      } catch (err: any) {
        console.error('Failed to load school settings', err);
        setError(
          err?.response?.data?.detail ||
            'Failed to load school details for settings.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, []);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [field]: event.target.value });
  };

  const handleToggle = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [field]: event.target.checked });
  };

  const handleLogoSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !schoolId) return;

    try {
      setSaving(true);
      setError(null);

      // Re‑use community upload endpoint for images
      const uploadRes = await api.upload<{ url: string }>(
        API_ENDPOINTS.CMS.UPLOAD,
        file,
      );
      if (!uploadRes?.url) {
        throw new Error('Upload response missing URL');
      }

      await api.put(API_ENDPOINTS.SMS.UPDATE_SCHOOL(schoolId), {
        logo_url: uploadRes.url,
      });
      setLogoUrl(uploadRes.url);
    } catch (err: any) {
      console.error('Failed to update school logo', err);
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          'Failed to change logo. Please try again.',
      );
    } finally {
      setSaving(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    if (!schoolId) return;
    try {
      setSaving(true);
      setError(null);

      // Map simple page settings back to school fields
      const payload: any = {
        name: settings.name?.trim() || undefined,
        tagline: settings.tagline?.trim() || undefined,
        website: settings.website?.trim() || undefined,
        email: settings.email?.trim() || undefined,
        phone: settings.phone?.trim() || undefined,
      };

      // Best-effort parsing of combined address into city/state/country
      if (settings.address) {
        const parts = settings.address.split(',').map((p) => p.trim()).filter(Boolean);
        if (parts.length === 1) {
          payload.city = parts[0];
        } else if (parts.length === 2) {
          payload.city = parts[0];
          payload.country = parts[1];
        } else if (parts.length >= 3) {
          payload.city = parts[0];
          payload.state = parts[1];
          payload.country = parts[parts.length - 1];
        }
      }

      await api.put(API_ENDPOINTS.SMS.UPDATE_SCHOOL(schoolId), payload);
      setSuccess(true);
    } catch (err: any) {
      console.error('Failed to save school settings', err);
      setError(
        err?.response?.data?.detail ||
          'Failed to save school settings. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SMSLayout>
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
            School settings saved successfully.
          </Alert>
        </Snackbar>

        <Grid container spacing={3}>
          {/* Profile Settings */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Profile Information
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
                    {!logoUrl && (
                      <SchoolIcon sx={{ fontSize: 50, color: colors.primary }} />
                    )}
                  </Avatar>
                  <Box>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleLogoSelected}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCameraIcon />}
                      sx={{ mb: 1 }}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={saving || !schoolId}
                    >
                      Change Logo
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      Recommended: 400x400px, PNG or JPG
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Institution Name"
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
                      label="Website"
                      value={settings.website}
                      onChange={handleChange('website')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
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
                      label="Address"
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
                  label="Description"
                  placeholder="Tell visitors about your institution..."
                  defaultValue="Tech University is a leading institution in technology education, offering cutting-edge programs in Computer Science, Data Science, AI, and more. With a 94% placement rate and partnerships with top tech companies, we prepare students for successful careers in technology."
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
                        checked={settings.allowAlumniVerification}
                        onChange={handleToggle('allowAlumniVerification')}
                        color="primary"
                      />
                    }
                    label="Allow Alumni Verification"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showPlacementData}
                        onChange={handleToggle('showPlacementData')}
                        color="primary"
                      />
                    }
                    label="Show Placement Data"
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
                  Deleting your page will remove all data associated with it. This action cannot be undone.
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
            startIcon={<SaveIcon />}
            size="large"
            sx={{ bgcolor: colors.primary }}
            onClick={handleSave}
            disabled={saving || !schoolId}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </SMSLayout>
  );
};

export default SMSSettings;

