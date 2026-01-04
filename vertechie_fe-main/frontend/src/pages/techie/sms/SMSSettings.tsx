/**
 * SMSSettings - School Page Settings
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
import SchoolIcon from '@mui/icons-material/School';
import SMSLayout from './SMSLayout';

const colors = {
  primary: '#0d47a1',
  success: '#34C759',
};

const SMSSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    name: 'Tech University',
    tagline: 'Excellence in Technology Education',
    website: 'https://techuniversity.edu',
    email: 'admissions@techuniversity.edu',
    phone: '+1 (555) 123-4567',
    address: '123 University Ave, Boston, MA 02115',
    allowAlumniVerification: true,
    showPlacementData: true,
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
    <SMSLayout>
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
                  Profile Information
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
                    <SchoolIcon sx={{ fontSize: 50, color: colors.primary }} />
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
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </SMSLayout>
  );
};

export default SMSSettings;

