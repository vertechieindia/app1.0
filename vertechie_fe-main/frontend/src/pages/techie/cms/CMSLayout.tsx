/**
 * CMSLayout - Company Management System Layout
 * Provides consistent header, navigation, and stats for company pages
 */

import React, { useState, useEffect } from 'react';
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
  ImageList,
  ImageListItem,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { api } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { DUMMY_COMPANY, DUMMY_STATS } from './CMSDummyData';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import WorkIcon from '@mui/icons-material/Work';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ImageIcon from '@mui/icons-material/Image';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CodeIcon from '@mui/icons-material/Code';

// Pre-made banner templates (20 options)
const BANNER_TEMPLATES = [
  { id: 1, name: 'Tech Blue', gradient: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)' },
  { id: 2, name: 'Ocean Wave', gradient: 'linear-gradient(135deg, #006064 0%, #00838f 50%, #00acc1 100%)' },
  { id: 3, name: 'Purple Dream', gradient: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 50%, #8e24aa 100%)' },
  { id: 4, name: 'Sunset', gradient: 'linear-gradient(135deg, #e65100 0%, #f57c00 50%, #ff9800 100%)' },
  { id: 5, name: 'Forest', gradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)' },
  { id: 6, name: 'Midnight', gradient: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)' },
  { id: 7, name: 'Rose Gold', gradient: 'linear-gradient(135deg, #880e4f 0%, #ad1457 50%, #c2185b 100%)' },
  { id: 8, name: 'Steel', gradient: 'linear-gradient(135deg, #37474f 0%, #455a64 50%, #546e7a 100%)' },
  { id: 9, name: 'Aurora', gradient: 'linear-gradient(135deg, #00695c 0%, #00897b 50%, #26a69a 100%)' },
  { id: 10, name: 'Coral', gradient: 'linear-gradient(135deg, #bf360c 0%, #d84315 50%, #e64a19 100%)' },
  { id: 11, name: 'Royal Blue', gradient: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 50%, #42a5f5 100%)' },
  { id: 12, name: 'Emerald', gradient: 'linear-gradient(135deg, #004d40 0%, #00695c 50%, #00897b 100%)' },
  { id: 13, name: 'Amethyst', gradient: 'linear-gradient(135deg, #311b92 0%, #4527a0 50%, #5e35b1 100%)' },
  { id: 14, name: 'Amber', gradient: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 50%, #ffa000 100%)' },
  { id: 15, name: 'Jade', gradient: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 50%, #4caf50 100%)' },
  { id: 16, name: 'Navy', gradient: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)' },
  { id: 17, name: 'Magenta', gradient: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 50%, #ab47bc 100%)' },
  { id: 18, name: 'Charcoal', gradient: 'linear-gradient(135deg, #212121 0%, #424242 50%, #616161 100%)' },
  { id: 19, name: 'Sky', gradient: 'linear-gradient(135deg, #0288d1 0%, #03a9f4 50%, #29b6f6 100%)' },
  { id: 20, name: 'Wine', gradient: 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 50%, #9c27b0 100%)' },
];

const colors = {
  primary: '#0d47a1',
  primaryDark: '#1a237e',
  primaryLight: '#5AC8FA',
  accent: '#34C759',
  background: '#f5f7fa',
};

const NavItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
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
  // Background will be overridden with current banner via sx
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
  color: 'white',
  marginBottom: 24,
}));

interface CMSLayoutProps {
  children: React.ReactNode;
}

const CMSLayout: React.FC<CMSLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Company data state
  const [company, setCompany] = useState<any>(null);
  const [companyStats, setCompanyStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editTab, setEditTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    tagline: '',
    industry: '',
    size: '',
    location: '',
    website: '',
    description: '',
  });
  const [logo, setLogo] = useState<string | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<number>(1);
  const [customBanner, setCustomBanner] = useState<string | null>(null);
  const [useCustomBanner, setUseCustomBanner] = useState(false);

  // Fetch company data
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        let myCompany = null;

        // Try getting user first to find their company
        try {
          const me = await api.get<any>(API_ENDPOINTS.AUTH.ME);
          if (me?.id) {
            // Try fetching companies associated with user
            // We expect a list or a single object depending on backend
            // Using logic from fix document: query companies by user_id
            const result = await api.get(API_ENDPOINTS.COMPANY, { params: { user_id: me.id } });

            if (Array.isArray(result) && result.length > 0) {
              myCompany = result[0];
            } else if (result && (result as any).id) {
              myCompany = result;
            }
          }
        } catch (e) {
          console.warn('Failed to resolve company via user lookup:', e);
        }

        // Fallback to direct legacy endpoint if above failed
        if (!myCompany) {
          try {
            myCompany = await api.get(API_ENDPOINTS.CMS.MY_COMPANY);
          } catch (e) {
            // Ignore, we handled it
          }
        }

        if (myCompany) {
          setCompany(myCompany);
          setCompanyInfo({
            name: myCompany.name || '',
            tagline: myCompany.tagline || '',
            industry: myCompany.industry || '',
            size: myCompany.company_size || '',
            location: myCompany.headquarters || '',
            website: myCompany.website || '',
            description: myCompany.description || '',
          });
          setLogo(myCompany.logo_url || null);

          // Restore banner selection from backend cover_image_url if present
          if (myCompany.cover_image_url) {
            const cover: string = myCompany.cover_image_url;
            if (cover.startsWith('gradient:')) {
              const id = parseInt(cover.split(':')[1], 10);
              if (!Number.isNaN(id)) {
                setSelectedBanner(id);
                setUseCustomBanner(false);
                setCustomBanner(null);
              }
            } else {
              // Treat as image URL
              setCustomBanner(cover);
              setUseCustomBanner(true);
            }
          }

          // Fetch stats
          try {
            const stats = await api.get(API_ENDPOINTS.CMS.STATS(myCompany.id));
            setCompanyStats(stats);
          } catch (e) {
            console.error('Failed to fetch stats:', e);
          }
        }
      } catch (err) {
        console.error('Failed to fetch company:', err);
        // Fallback to dummy data
        setCompany(DUMMY_COMPANY);
        setCompanyInfo({
          name: DUMMY_COMPANY.name,
          tagline: DUMMY_COMPANY.tagline,
          industry: DUMMY_COMPANY.industry,
          size: DUMMY_COMPANY.company_size,
          location: DUMMY_COMPANY.headquarters,
          website: DUMMY_COMPANY.website,
          description: DUMMY_COMPANY.description,
        });
        setCompanyStats(DUMMY_STATS);
      } finally {
        setCompany((prev: any) => {
          if (!prev) {
            setCompanyInfo({
              name: DUMMY_COMPANY.name,
              tagline: DUMMY_COMPANY.tagline,
              industry: DUMMY_COMPANY.industry,
              size: DUMMY_COMPANY.company_size,
              location: DUMMY_COMPANY.headquarters,
              website: DUMMY_COMPANY.website,
              description: DUMMY_COMPANY.description,
            });
            setCompanyStats(DUMMY_STATS);
            return DUMMY_COMPANY;
          }
          return prev;
        });
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Upload logo to backend and store returned URL
      const uploadRes = await api.upload<{ url: string }>(API_ENDPOINTS.CMS.UPLOAD, file);
      if (!uploadRes?.url) {
        throw new Error('Upload response missing URL');
      }
      setLogo(uploadRes.url);
    } catch (e) {
      console.error('Failed to upload logo', e);
      setSnackbar({ open: true, message: 'Failed to upload logo', severity: 'error' });
    }
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Upload banner image and use it as custom banner
      const uploadRes = await api.upload<{ url: string }>(API_ENDPOINTS.CMS.UPLOAD, file);
      if (!uploadRes?.url) {
        throw new Error('Upload response missing URL');
      }
      setCustomBanner(uploadRes.url);
      setUseCustomBanner(true);
    } catch (e) {
      console.error('Failed to upload banner', e);
      setSnackbar({ open: true, message: 'Failed to upload banner image', severity: 'error' });
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
    { path: '/techie/cms/posts', label: 'Posts', icon: <PostAddIcon /> },
    { path: '/techie/cms/employees', label: 'Employee Verification', icon: <PeopleIcon /> },
    { path: '/techie/cms/admins', label: 'Page Admins', icon: <GroupAddIcon /> },
    { path: '/techie/cms/jobs', label: 'Jobs', icon: <WorkIcon /> },
    { path: '/techie/cms/media', label: 'Media Library', icon: <ImageIcon /> },
    { path: '/techie/cms/snippets', label: 'Code Snippets', icon: <CodeIcon /> },
    { path: '/techie/cms/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { path: '/techie/cms/settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const stats = companyStats ? [
    { value: companyStats.followers?.toLocaleString() || '0', label: 'Followers', color: colors.primary },
    { value: companyStats.team_members?.toLocaleString() || '0', label: 'Team Members', color: colors.accent },
    { value: companyStats.active_jobs?.toLocaleString() || '0', label: 'Open Jobs', color: colors.primaryDark },
    { value: companyStats.page_views?.toLocaleString() || '0', label: 'Page Views', color: colors.accent },
  ] : [
    { value: '0', label: 'Followers', color: colors.primary },
    { value: '0', label: 'Team Members', color: colors.accent },
    { value: '0', label: 'Open Jobs', color: colors.primaryDark },
    { value: '0', label: 'Page Views', color: colors.accent },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleSaveEdit = async () => {
    if (!company) return;
    try {
      const updatePayload: any = {
        name: companyInfo.name,
        tagline: companyInfo.tagline,
        industry: companyInfo.industry,
        description: companyInfo.description,
        website: companyInfo.website,
        headquarters: companyInfo.location || undefined,
      };

      // Persist logo URL if we have one
      if (logo) {
        updatePayload.logo_url = logo;
      }

      // Persist banner selection as either gradient id or custom image URL
      if (useCustomBanner && customBanner) {
        updatePayload.cover_image_url = customBanner;
      } else if (selectedBanner) {
        updatePayload.cover_image_url = `gradient:${selectedBanner}`;
      }

      await api.put(API_ENDPOINTS.CMS.UPDATE_COMPANY(company.id), updatePayload);
      setEditOpen(false);
      setSnackbar({ open: true, message: 'Company page updated successfully!', severity: 'success' });
      // Refresh company data
      const updated = await api.get<any>(API_ENDPOINTS.CMS.MY_COMPANY);
      if (updated) {
        setCompany(updated);
        setCompanyInfo({
          name: updated.name || '',
          tagline: updated.tagline || '',
          industry: updated.industry || '',
          size: updated.company_size || '',
          location: updated.headquarters || '',
          website: updated.website || '',
          description: updated.description || '',
        });
        setLogo(updated.logo_url || null);
        if (updated.cover_image_url) {
          const cover: string = updated.cover_image_url;
          if (cover.startsWith('gradient:')) {
            const id = parseInt(cover.split(':')[1], 10);
            if (!Number.isNaN(id)) {
              setSelectedBanner(id);
              setUseCustomBanner(false);
              setCustomBanner(null);
            }
          } else {
            setCustomBanner(cover);
            setUseCustomBanner(true);
          }
        }
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update company page', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!company) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="warning">
          You are not a company admin. Please create or join a company first.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100%',
      background: colors.background,
    }}>
      <Container maxWidth="xl">
        {/* Profile Header */}
        <ProfileCard
          elevation={0}
          sx={{
            background: getCurrentBanner(),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Avatar
                src={logo || undefined}
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'white',
                  border: '4px solid rgba(255,255,255,0.3)',
                }}
              >
                {!logo && <BusinessIcon sx={{ fontSize: 50, color: colors.primary }} />}
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h4" fontWeight={700}>{company.name || 'Company Name'}</Typography>
                  {company.is_verified && <VerifiedIcon sx={{ color: colors.primaryLight }} />}
                </Box>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 1.5 }}>
                  {company.tagline || company.description || 'Company tagline'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {company.industry && (
                    <Chip
                      label={company.industry}
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  )}
                  {company.company_size && (
                    <Chip
                      label={company.company_size}
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  )}
                  {company.headquarters && (
                    <Chip
                      icon={<LocationOnIcon sx={{ color: 'white !important' }} />}
                      label={company.headquarters}
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  )}
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
          Edit Company Page
        </DialogTitle>
        <Tabs
          value={editTab}
          onChange={(_, v) => setEditTab(v)}
          sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Company Info" icon={<BusinessIcon />} iconPosition="start" />
          <Tab label="Logo" icon={<PhotoCameraIcon />} iconPosition="start" />
          <Tab label="Banner" icon={<ImageIcon />} iconPosition="start" />
        </Tabs>
        <DialogContent sx={{ minHeight: 400 }}>
          {/* Tab 0: Company Info */}
          {editTab === 0 && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Company Name"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Tagline"
                value={companyInfo.tagline}
                onChange={(e) => setCompanyInfo({ ...companyInfo, tagline: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Industry"
                    value={companyInfo.industry}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, industry: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Company Size"
                    value={companyInfo.size}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, size: e.target.value })}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                label="Location"
                value={companyInfo.location}
                onChange={(e) => setCompanyInfo({ ...companyInfo, location: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Website"
                value={companyInfo.website}
                onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={companyInfo.description}
                onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
              />
            </Box>
          )}

          {/* Tab 1: Logo Upload */}
          {editTab === 1 && (
            <Box sx={{ pt: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Company Logo</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload your company logo. Recommended size: 200x200 pixels.
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
                  {!logo && <BusinessIcon sx={{ fontSize: 60, color: colors.primary }} />}
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
                Select from our pre-made banners or upload your own custom image.
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
                  {companyInfo.name}
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

export default CMSLayout;

