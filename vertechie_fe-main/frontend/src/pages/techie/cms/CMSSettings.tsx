/**
 * CMSSettings - Company Page Settings
 */

import React, { useState } from 'react';
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
import { alpha } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BusinessIcon from '@mui/icons-material/Business';
import CMSLayout from './CMSLayout';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
};

const CMSSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    name: 'TechCorp Solutions',
    tagline: 'Innovating the Future of Technology',
    website: 'https://techcorp.com',
    email: 'careers@techcorp.com',
    phone: '+1 (555) 987-6543',
    address: '123 Tech Street, San Francisco, CA 94105',
    industry: 'Information Technology',
    size: '501-1000 employees',
    allowEmployeeVerification: true,
    showJobPostings: true,
    enableMessaging: true,
    showContactInfo: true,
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [field]: event.target.value });
  };

  const handleToggle = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [field]: event.target.checked });
  };

  return (
    <CMSLayout>
      <Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Page Settings
        </Typography>

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
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: alpha(colors.primary, 0.1),
                    }}
                  >
                    <BusinessIcon sx={{ fontSize: 50, color: colors.primary }} />
                  </Avatar>
                  <Box>
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCameraIcon />}
                      sx={{ mb: 1 }}
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
                  defaultValue="TechCorp Solutions is a leading technology company focused on innovation and digital transformation. We help businesses leverage cutting-edge technology to drive growth and efficiency. With a team of 800+ talented professionals, we serve clients across the globe."
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
            startIcon={<SaveIcon />}
            size="large"
            sx={{ bgcolor: colors.primary }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </CMSLayout>
  );
};

export default CMSSettings;

