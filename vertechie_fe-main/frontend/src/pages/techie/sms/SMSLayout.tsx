/**
 * SMSLayout - School Management System Layout
 * Provides consistent header, navigation, and stats for school pages
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  IconButton,
  Grid,
  Card,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ImageIcon from '@mui/icons-material/Image';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// Pre-made banner templates (20 options)
const BANNER_TEMPLATES = [
  { id: 1, name: 'Academic Blue', gradient: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)' },
  { id: 2, name: 'Campus Green', gradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)' },
  { id: 3, name: 'Library Brown', gradient: 'linear-gradient(135deg, #3e2723 0%, #5d4037 50%, #795548 100%)' },
  { id: 4, name: 'Innovation Orange', gradient: 'linear-gradient(135deg, #e65100 0%, #f57c00 50%, #ff9800 100%)' },
  { id: 5, name: 'Wisdom Purple', gradient: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 50%, #8e24aa 100%)' },
  { id: 6, name: 'Excellence Gold', gradient: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 50%, #ffa000 100%)' },
  { id: 7, name: 'Research Teal', gradient: 'linear-gradient(135deg, #006064 0%, #00838f 50%, #00acc1 100%)' },
  { id: 8, name: 'Classic Navy', gradient: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)' },
  { id: 9, name: 'Nature Forest', gradient: 'linear-gradient(135deg, #004d40 0%, #00695c 50%, #00897b 100%)' },
  { id: 10, name: 'Modern Slate', gradient: 'linear-gradient(135deg, #37474f 0%, #455a64 50%, #546e7a 100%)' },
  { id: 11, name: 'Royal Crimson', gradient: 'linear-gradient(135deg, #880e4f 0%, #ad1457 50%, #c2185b 100%)' },
  { id: 12, name: 'Sky Blue', gradient: 'linear-gradient(135deg, #0288d1 0%, #03a9f4 50%, #29b6f6 100%)' },
  { id: 13, name: 'Earthy Sienna', gradient: 'linear-gradient(135deg, #bf360c 0%, #d84315 50%, #e64a19 100%)' },
  { id: 14, name: 'Deep Indigo', gradient: 'linear-gradient(135deg, #311b92 0%, #4527a0 50%, #5e35b1 100%)' },
  { id: 15, name: 'Fresh Mint', gradient: 'linear-gradient(135deg, #00695c 0%, #00897b 50%, #26a69a 100%)' },
  { id: 16, name: 'Sunset Rose', gradient: 'linear-gradient(135deg, #c62828 0%, #d32f2f 50%, #e53935 100%)' },
  { id: 17, name: 'Ocean Deep', gradient: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 50%, #42a5f5 100%)' },
  { id: 18, name: 'Charcoal', gradient: 'linear-gradient(135deg, #212121 0%, #424242 50%, #616161 100%)' },
  { id: 19, name: 'Lavender', gradient: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 50%, #ab47bc 100%)' },
  { id: 20, name: 'Emerald', gradient: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 50%, #4caf50 100%)' },
];

const colors = {
  primary: '#0d47a1',
  primaryDark: '#1a237e',
  primaryLight: '#5AC8FA',
  accent: '#34C759',
  background: '#f5f7fa',
};

const NavItem = styled(Box)<{ active?: boolean }>(({ active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 20px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: active ? 600 : 500,
  color: active ? colors.primary : '#666',
  backgroundColor: active ? alpha(colors.primary, 0.08) : 'transparent',
  borderBottom: active ? `3px solid ${colors.primary}` : '3px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(colors.primary, 0.05),
    color: colors.primary,
  },
}));

const StatCard = styled(Card)(() => ({
  padding: 16,
  textAlign: 'center',
  border: `1px solid ${alpha(colors.primary, 0.1)}`,
  boxShadow: 'none',
  borderRadius: 12,
  background: alpha(colors.primary, 0.03),
}));

const ProfileCard = styled(Paper)(() => ({
  padding: 24,
  borderRadius: 16,
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
  color: 'white',
  marginBottom: 24,
}));

interface SMSLayoutProps {
  children: React.ReactNode;
}

const SMSLayout: React.FC<SMSLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editTab, setEditTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [schoolInfo, setSchoolInfo] = useState({
    name: 'Tech University',
    tagline: 'Excellence in Technology Education',
    type: 'University',
    location: 'Boston, MA',
    website: 'https://techuniversity.edu',
    description: 'A leading institution for technology education with world-class facilities and faculty.',
  });
  const [logo, setLogo] = useState<string | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<number>(1);
  const [customBanner, setCustomBanner] = useState<string | null>(null);
  const [useCustomBanner, setUseCustomBanner] = useState(false);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomBanner(reader.result as string);
        setUseCustomBanner(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectBanner = (bannerId: number) => {
    setSelectedBanner(bannerId);
    setUseCustomBanner(false);
  };

  const getCurrentBanner = () => {
    if (useCustomBanner && customBanner) {
      return `url(${customBanner})`;
    }
    return BANNER_TEMPLATES.find(b => b.id === selectedBanner)?.gradient || BANNER_TEMPLATES[0].gradient;
  };

  const navItems = [
    { path: '/techie/sms/posts', label: 'Posts', icon: <PostAddIcon /> },
    { path: '/techie/sms/alumni', label: 'Alumni Verification', icon: <PeopleIcon /> },
    { path: '/techie/sms/programs', label: 'Programs', icon: <MenuBookIcon /> },
    { path: '/techie/sms/placements', label: 'Placements', icon: <EmojiEventsIcon /> },
    { path: '/techie/sms/admins', label: 'Page Admins', icon: <GroupAddIcon /> },
    { path: '/techie/sms/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { path: '/techie/sms/settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const stats = [
    { value: '28,450', label: 'Followers', color: colors.primary },
    { value: '15,420', label: 'Verified Alumni', color: colors.accent },
    { value: '45', label: 'Programs', color: colors.primaryDark },
    { value: '94%', label: 'Placement Rate', color: colors.accent },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  
  const handleSaveEdit = () => {
    setEditOpen(false);
    setSnackbar({ open: true, message: 'School page updated successfully!', severity: 'success' });
  };

  return (
    <Box sx={{ 
      minHeight: '100%', 
      background: colors.background,
    }}>
      <Container maxWidth="xl">
        {/* Profile Header */}
        <ProfileCard elevation={0}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'white',
                  border: '4px solid rgba(255,255,255,0.3)',
                }}
              >
                <SchoolIcon sx={{ fontSize: 50, color: colors.primary }} />
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h4" fontWeight={700}>Tech University</Typography>
                  <VerifiedIcon sx={{ color: colors.primaryLight }} />
                </Box>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 1.5 }}>
                  Excellence in Technology Education
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label="University" 
                    size="small" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                  />
                  <Chip 
                    icon={<LocationOnIcon sx={{ color: 'white !important' }} />}
                    label="Boston, MA" 
                    size="small" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                  />
                </Box>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditOpen(true)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              }}
            >
              Edit Page
            </Button>
          </Box>
        </ProfileCard>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((stat, idx) => (
            <Grid item xs={6} md={3} key={idx}>
              <StatCard>
                <Typography variant="h4" fontWeight={700} color={stat.color}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              </StatCard>
            </Grid>
          ))}
        </Grid>

        {/* Navigation */}
        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', overflowX: 'auto', p: 1 }}>
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                active={isActive(item.path)}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <Typography variant="body2" fontWeight="inherit">{item.label}</Typography>
              </NavItem>
            ))}
          </Box>
        </Paper>

        {/* Page Content */}
        <Paper sx={{ p: 3, borderRadius: 2, minHeight: 400 }}>
          {children}
        </Paper>
      </Container>
      
      {/* Edit Page Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, pb: 0 }}>
          <EditIcon color="primary" />
          Edit School Page
        </DialogTitle>
        <Tabs 
          value={editTab} 
          onChange={(_, v) => setEditTab(v)} 
          sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="School Info" icon={<SchoolIcon />} iconPosition="start" />
          <Tab label="Logo" icon={<PhotoCameraIcon />} iconPosition="start" />
          <Tab label="Banner" icon={<ImageIcon />} iconPosition="start" />
        </Tabs>
        <DialogContent sx={{ minHeight: 400 }}>
          {/* Tab 0: School Info */}
          {editTab === 0 && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="School Name"
                value={schoolInfo.name}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Tagline"
                value={schoolInfo.tagline}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, tagline: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Type"
                    value={schoolInfo.type}
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, type: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={schoolInfo.location}
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, location: e.target.value })}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                label="Website"
                value={schoolInfo.website}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, website: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={schoolInfo.description}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, description: e.target.value })}
              />
            </Box>
          )}

          {/* Tab 1: Logo Upload */}
          {editTab === 1 && (
            <Box sx={{ pt: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>School Logo</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload your school logo or crest. Recommended size: 200x200 pixels.
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: 3 
              }}>
                <Avatar
                  src={logo || undefined}
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    bgcolor: alpha(colors.primary, 0.1),
                    border: `3px dashed ${colors.primary}`,
                  }}
                >
                  {!logo && <SchoolIcon sx={{ fontSize: 60, color: colors.primary }} />}
                </Avatar>
                
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{ bgcolor: colors.primary }}
                >
                  Upload Logo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </Button>
                
                {logo && (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => setLogo(null)}
                    size="small"
                  >
                    Remove Logo
                  </Button>
                )}
              </Box>
            </Box>
          )}

          {/* Tab 2: Banner Selection */}
          {editTab === 2 && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>Choose a Banner</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select from our pre-made academic banners or upload your own custom image.
              </Typography>
              
              {/* Current Banner Preview */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Preview</Typography>
                <Box sx={{ 
                  height: 120, 
                  borderRadius: 2,
                  background: getCurrentBanner(),
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}>
                  {schoolInfo.name}
                </Box>
              </Box>

              {/* Custom Upload Option */}
              <Box sx={{ mb: 3, p: 2, bgcolor: alpha(colors.primary, 0.05), borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Custom Banner
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ borderColor: colors.primary, color: colors.primary }}
                  >
                    Upload Custom Banner
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleBannerUpload}
                    />
                  </Button>
                  {customBanner && (
                    <>
                      <Chip 
                        label="Custom banner uploaded" 
                        color="success" 
                        size="small"
                        icon={<CheckCircleIcon />}
                      />
                      <Button 
                        size="small" 
                        color="error"
                        onClick={() => { setCustomBanner(null); setUseCustomBanner(false); }}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </Box>
              </Box>

              {/* Pre-made Banners Grid */}
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Pre-made Banners (20 options)
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: 1.5,
                maxHeight: 300,
                overflowY: 'auto',
                p: 1,
              }}>
                {BANNER_TEMPLATES.map((banner) => (
                  <Tooltip key={banner.id} title={banner.name} arrow>
                    <Box
                      onClick={() => handleSelectBanner(banner.id)}
                      sx={{
                        height: 60,
                        borderRadius: 1,
                        background: banner.gradient,
                        cursor: 'pointer',
                        border: selectedBanner === banner.id && !useCustomBanner 
                          ? '3px solid #fff' 
                          : '3px solid transparent',
                        boxShadow: selectedBanner === banner.id && !useCustomBanner 
                          ? `0 0 0 2px ${colors.primary}` 
                          : 'none',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        },
                      }}
                    >
                      {selectedBanner === banner.id && !useCustomBanner && (
                        <CheckCircleIcon sx={{ color: 'white', fontSize: 24 }} />
                      )}
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit} sx={{ bgcolor: colors.primary }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SMSLayout;

