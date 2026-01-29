/**
 * AppHeader - Role-based Navigation Header
 * 
 * Shows different navigation options based on user role:
 * - Tech Professional: Jobs, Practice, Network (includes Community), Learn, Blog
 * - Hiring Manager: Jobs, Talent, Assessments, Analytics
 * - School Admin: Students, Programs, Placements, Analytics
 * - Company Admin: Jobs, Branding, Team, Analytics
 * - Super Admin: All sections + Admin Panel
 */

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Divider,
  useTheme,
  useMediaQuery,
  Chip,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import PeopleIcon from '@mui/icons-material/People';
// GroupsIcon removed - Network is now part of Home
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import CampaignIcon from '@mui/icons-material/Campaign';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

// Styled Components - Using Hero Section Colors
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)', // Hero gradient
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(13, 71, 161, 0.25)',
  borderBottom: '1px solid rgba(90, 200, 250, 0.2)',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar + 10,
}));

const LogoImage = styled('img')({
  height: 40,
  width: 40,
  marginRight: 8,
});

// Hero accent color: #5AC8FA (cyan) and #90CAF9 (light blue)
const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean; component?: React.ElementType; to?: string }>(({ theme, active }) => ({
  color: active ? '#5AC8FA' : 'rgba(255, 255, 255, 0.9)',
  fontWeight: active ? 600 : 500,
  fontSize: '0.9rem',
  padding: '8px 16px',
  borderRadius: 8,
  textTransform: 'none',
  position: 'relative',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha('#5AC8FA', 0.15),
    color: '#5AC8FA',
  },
  ...(active && {
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60%',
      height: 3,
      background: 'linear-gradient(90deg, #5AC8FA 0%, #90CAF9 100%)',
      borderRadius: '3px 3px 0 0',
    },
  }),
}));

const ProfileChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha('#5AC8FA', 0.15),
  color: '#5AC8FA',
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  '& .MuiChip-label': {
    padding: '0 8px',
  },
}));

// Types
type UserRole = 'techie' | 'hiring_manager' | 'school_admin' | 'company_admin' | 'admin' | 'super_admin' | 'techie_admin' | 'hm_admin' | 'multi_admin';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  isExternal?: boolean;
}

interface RoleNavConfig {
  [key: string]: NavItem[];
}

// Navigation configuration by role
// User-side pages are under /techie/
// Admin pages are under /vertechie/
// Note: Home (/techie/home) is now the unified Network + Community experience
const roleNavConfig: RoleNavConfig = {
  techie: [
    { label: 'Dashboard', path: '/techie/dashboard', icon: <DashboardIcon /> },
    { label: 'Jobs', path: '/techie/jobs', icon: <WorkIcon /> },
    { label: 'Practice', path: '/techie/practice', icon: <CodeIcon /> },
    { label: 'Learn', path: '/techie/learn', icon: <SchoolIcon /> },
  ],
  hiring_manager: [
    { label: 'Home', path: '/techie/home/feed', icon: <HomeIcon /> },
  ],
  school_admin: [
    { label: 'Dashboard', path: '/techie/dashboard', icon: <DashboardIcon /> },
    { label: 'SMS', path: '/techie/sms', icon: <BusinessIcon /> },
    { label: 'Jobs', path: '/techie/jobs', icon: <WorkIcon /> },
    { label: 'Learn', path: '/techie/learn', icon: <SchoolIcon /> },
  ],
  company_admin: [
    { label: 'Dashboard', path: '/techie/dashboard', icon: <DashboardIcon /> },
    { label: 'CMS', path: '/techie/cms', icon: <BusinessIcon /> },
    { label: 'Jobs', path: '/techie/jobs', icon: <WorkIcon /> },
    { label: 'Learn', path: '/techie/learn', icon: <SchoolIcon /> },
  ],
  techie_admin: [
    { label: 'Home', path: '/techie/home/feed', icon: <HomeIcon /> },
    { label: 'Practice', path: '/techie/practice', icon: <CodeIcon /> },
    { label: 'Learn', path: '/techie/learn', icon: <SchoolIcon /> },
    { label: 'Chat', path: '/techie/chat', icon: <MessageIcon /> },
    { label: 'Blog', path: '/techie/blogs', icon: <ArticleIcon /> },
    { label: 'Admin', path: '/vertechie/techieadmin', icon: <AdminPanelSettingsIcon /> },
    { label: 'Alerts', path: '/techie/alerts', icon: <NotificationsIcon /> },
  ],
  multi_admin: [
    { label: 'Home', path: '/techie/home/feed', icon: <HomeIcon /> },
    { label: 'Practice', path: '/techie/practice', icon: <CodeIcon /> },
    { label: 'Learn', path: '/techie/learn', icon: <SchoolIcon /> },
    { label: 'Chat', path: '/techie/chat', icon: <MessageIcon /> },
    { label: 'Blog', path: '/techie/blogs', icon: <ArticleIcon /> },
    { label: 'Admin', path: '/vertechie/role-admin', icon: <AdminPanelSettingsIcon /> },
    { label: 'Alerts', path: '/techie/alerts', icon: <NotificationsIcon /> },
  ],
  admin: [
    { label: 'Dashboard', path: '/vertechie/admin', icon: <DashboardIcon /> },
    { label: 'Users', path: '/vertechie/admin/users', icon: <PeopleIcon /> },
    { label: 'Companies', path: '/vertechie/admin/companies', icon: <BusinessIcon /> },
    { label: 'Schools', path: '/vertechie/admin/schools', icon: <SchoolIcon /> },
    { label: 'Reports', path: '/vertechie/admin/reports', icon: <AnalyticsIcon /> },
  ],
  super_admin: [
    { label: 'LinkedIn', path: 'https://www.linkedin.com/company/vertechie', icon: <LinkedInIcon />, isExternal: true },
    { label: 'X', path: 'https://x.com/vertechie', icon: <XIcon />, isExternal: true },
    { label: 'Facebook', path: 'https://www.facebook.com/profile.php?id=61575500422397', icon: <FacebookIcon />, isExternal: true },
    { label: 'WhatsApp', path: 'https://whatsapp.com/channel/0029VbBWIuL4o7qOEoR2OC1w', icon: <WhatsAppIcon />, isExternal: true },
    { label: 'Instagram', path: 'https://www.instagram.com/vertechie', icon: <InstagramIcon />, isExternal: true },
    { label: 'YouTube', path: 'https://www.youtube.com/@vertechie', icon: <YouTubeIcon />, isExternal: true },
  ],
};

const roleLabels: { [key: string]: string } = {
  techie: 'Tech Professional',
  techie_admin: 'Techie Admin',
  hiring_manager: 'Hiring Manager',
  hm_admin: 'HM Admin',
  multi_admin: 'Admin',
  school_admin: 'School Admin',
  company_admin: 'Company Admin',
  admin: 'Admin',
  super_admin: 'Super Admin',
};

const AppHeader: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [userRole, setUserRole] = useState<UserRole>('techie');
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadUserData();
  }, [location.pathname]);

  const loadUserData = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        
        // Set user name
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        setUserName(`${firstName} ${lastName}`.trim() || user.email || 'User');
        setUserAvatar(user.profile_image || '');
        
        // Determine role - check user.role, user.roles array, user.groups array, and admin_roles
        const userRoles = user.roles || [];
        const userGroups = user.groups || [];
        const adminRoles = user.admin_roles || [];
        const hasRole = (roleType: string) => 
          user.role === roleType || 
          userRoles.some((r: any) => r.role_type === roleType || r.name?.toLowerCase() === roleType) ||
          userGroups.some((g: any) => g.name === roleType || g.name?.toLowerCase() === roleType);
        
        const roleAdminTypes = ['techie_admin', 'hm_admin', 'company_admin', 'school_admin'];
        const countRoleAdmins = roleAdminTypes.filter((r) => adminRoles.includes(r)).length;
        if (user.is_superuser || adminRoles.includes('superadmin')) {
          setUserRole('super_admin');
        } else if (countRoleAdmins > 1) {
          setUserRole('multi_admin');
        } else if (adminRoles.includes('techie_admin')) {
          setUserRole('techie_admin');
        } else if (adminRoles.includes('hm_admin')) {
          setUserRole('hm_admin');
        } else if (adminRoles.includes('company_admin') || hasRole('company_admin') || user.company_id) {
          setUserRole('company_admin');
        } else if (adminRoles.includes('school_admin') || hasRole('school_admin') || user.school_id) {
          setUserRole('school_admin');
        } else if (user.is_staff || adminRoles.length > 0) {
          setUserRole('admin');
        } else if (hasRole('hiring_manager')) {
          setUserRole('hiring_manager');
        } else {
          setUserRole('techie');
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setProfileAnchor(null);
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = roleNavConfig[userRole] || roleNavConfig.techie;

  const renderDesktopNav = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 3 }}>
      {navItems.map((item) => (
        item.isExternal ? (
          <Tooltip key={item.path} title={item.label} arrow>
            <IconButton
              component="a"
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.2s ease',
                padding: '10px',
                '&:hover': {
                  color: '#5AC8FA',
                  backgroundColor: alpha('#5AC8FA', 0.15),
                  transform: 'scale(1.1)',
                },
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ) : (
          <NavButton
            key={item.path}
            component={RouterLink}
            to={item.path}
            active={isActive(item.path)}
            startIcon={!isMobile ? item.icon : undefined}
          >
            {item.label}
            {item.badge && item.badge > 0 && (
              <Badge
                badgeContent={item.badge}
                color="error"
                sx={{ ml: 1 }}
              />
            )}
          </NavButton>
        )
      ))}
    </Box>
  );

  const renderMobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileOpen}
      onClose={() => setMobileOpen(false)}
      PaperProps={{
        sx: {
          width: 280,
          background: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)', // Hero gradient
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LogoImage src="/images/logo/vertechie-logo.svg" alt="VerTechie" />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#5AC8FA' }}>
            VerTechie
          </Typography>
        </Box>
        <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      
      {/* User Info */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={userAvatar} sx={{ width: 48, height: 48, bgcolor: '#0d47a1' }}>
          {userName.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {userName}
          </Typography>
          <ProfileChip label={roleLabels[userRole]} size="small" />
        </Box>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      
      {/* Navigation Items */}
      <List sx={{ px: 1, flex: 1 }}>
        {navItems.map((item) => (
          item.isExternal ? (
            <ListItem
              key={item.path}
              component="a"
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: 'rgba(255,255,255,0.8)',
                '&:hover': {
                  bgcolor: alpha('#5AC8FA', 0.15),
                  color: '#5AC8FA',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ) : (
            <ListItem
              key={item.path}
              component={RouterLink}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: isActive(item.path) ? '#5AC8FA' : 'rgba(255,255,255,0.8)',
                bgcolor: isActive(item.path) ? alpha('#5AC8FA', 0.15) : 'transparent',
                '&:hover': {
                  bgcolor: alpha('#5AC8FA', 0.15),
                  color: '#5AC8FA',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
              {item.badge && item.badge > 0 && (
                <Badge badgeContent={item.badge} color="error" />
              )}
            </ListItem>
          )
        ))}
      </List>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      
      {/* Bottom Actions */}
      <List sx={{ px: 1 }}>
        <ListItem
          component={RouterLink}
          to="/settings"
          onClick={() => setMobileOpen(false)}
          sx={{ borderRadius: 2, color: 'rgba(255,255,255,0.8)' }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem
          onClick={handleLogout}
          sx={{ 
            borderRadius: 2, 
            color: '#ff6b6b',
            cursor: 'pointer',
            '&:hover': { bgcolor: alpha('#ff6b6b', 0.1) },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );

  return (
    <StyledAppBar position="sticky">
      <Toolbar sx={{ minHeight: { xs: 64, md: 70 } }}>
        {/* Mobile Menu Button */}
        {isTablet && (
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 1, color: 'white' }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        {/* Logo */}
        <Box
          component={RouterLink}
          to="/"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            mr: 3,
          }}
        >
          <LogoImage src="/images/logo/vertechie-logo.svg" alt="VerTechie" />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.4rem',
              background: 'linear-gradient(90deg, #FFFFFF 0%, #5AC8FA 100%)', // Hero text gradient
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            VerTechie
          </Typography>
        </Box>
        
        {/* Desktop Navigation */}
        {!isTablet && renderDesktopNav()}
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Inline Search Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {/* Expanding Search Input */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                width: searchOpen ? { xs: 200, sm: 280, md: 320 } : 0,
                opacity: searchOpen ? 1 : 0,
                mr: searchOpen ? 1 : 0,
              }}
            >
              <TextField
                autoFocus={searchOpen}
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/techie/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchOpen(false);
                    setSearchQuery('');
                  }
                  if (e.key === 'Escape') {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }
                }}
                onBlur={() => {
                  if (!searchQuery.trim()) {
                    setSearchOpen(false);
                  }
                }}
                InputProps={{
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchQuery('')}
                        sx={{ color: 'rgba(255,255,255,0.6)', p: 0.5 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    color: 'white',
                    height: 36,
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(90, 200, 250, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#5AC8FA',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255,255,255,0.5)',
                    opacity: 1,
                  },
                }}
              />
            </Box>
            
            {/* Search Icon Button */}
            <Tooltip title={searchOpen ? "Close" : "Search"}>
              <IconButton 
                onClick={() => {
                  if (searchOpen && searchQuery.trim()) {
                    navigate(`/techie/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchQuery('');
                  }
                  setSearchOpen(!searchOpen);
                }}
                sx={{ color: 'rgba(255,255,255,0.8)' }}
              >
                {searchOpen ? <CloseIcon /> : <SearchIcon />}
              </IconButton>
            </Tooltip>
          </Box>
          
          {/* Profile Menu */}
          <Box
            onClick={(e) => setProfileAnchor(e.currentTarget)}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              cursor: 'pointer',
              ml: 1,
              p: 0.5,
              borderRadius: 2,
              '&:hover': { bgcolor: alpha('#fff', 0.1) },
            }}
          >
            <Avatar 
              src={userAvatar} 
              sx={{ width: 36, height: 36, bgcolor: '#0d47a1', border: '2px solid rgba(90, 200, 250, 0.5)' }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
            {!isMobile && (
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, lineHeight: 1.2 }}>
                  {userName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  {roleLabels[userRole]}
                </Typography>
              </Box>
            )}
            <KeyboardArrowDownIcon sx={{ color: 'rgba(255,255,255,0.6)' }} />
          </Box>
          
          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={() => setProfileAnchor(null)}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                background: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)', // Hero gradient
                color: 'white',
                border: '1px solid rgba(90, 200, 250, 0.2)',
                boxShadow: '0 8px 32px rgba(13, 71, 161, 0.3)',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {userName}
              </Typography>
              <ProfileChip label={roleLabels[userRole]} size="small" sx={{ mt: 0.5 }} />
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <MenuItem 
              component={RouterLink} 
              to="/profile"
              onClick={() => setProfileAnchor(null)}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)' }}>
                <PersonIcon />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem 
              component={RouterLink} 
              to="/saved"
              onClick={() => setProfileAnchor(null)}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)' }}>
                <BookmarkIcon />
              </ListItemIcon>
              Saved Items
            </MenuItem>
            <MenuItem 
              component={RouterLink} 
              to="/settings"
              onClick={() => setProfileAnchor(null)}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)' }}>
                <SettingsIcon />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <MenuItem 
              onClick={handleLogout}
              sx={{ py: 1.5, color: '#ff6b6b' }}
            >
              <ListItemIcon sx={{ color: '#ff6b6b' }}>
                <LogoutIcon />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
      
      {/* Mobile Drawer */}
      {renderMobileDrawer()}
    </StyledAppBar>
  );
};

export default AppHeader;

