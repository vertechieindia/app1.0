/**
 * BottomNav - Fixed Bottom Navigation Bar (Like LinkedIn's header but at bottom)
 * 
 * Always visible after login for ALL users from ANY country
 * Navigation: HOME, JOBS, PRACTICE, NETWORK, COMMUNITY, LEARN, CHAT, BLOGS, NOTIFICATIONS, PROFILE
 * 
 * Additional role-specific items:
 * - Hiring Manager: ATS (Applicant Tracking System)
 * - School Account: SMS (School Management System)
 * - Company Account: CMS (Company Management System)
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  BottomNavigation as MuiBottomNav,
  BottomNavigationAction,
  Paper,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
// GroupsIcon removed - Network is now Home
import SchoolIcon from '@mui/icons-material/School';
import ChatIcon from '@mui/icons-material/Chat';
import ArticleIcon from '@mui/icons-material/Article';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HelpIcon from '@mui/icons-material/Help';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

// Styled Components - Using Hero Section Colors
const StyledBottomNav = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar + 1,
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)', // Hero gradient
  borderTop: '1px solid rgba(90, 200, 250, 0.2)',
  boxShadow: '0 -4px 20px rgba(13, 71, 161, 0.25)',
  paddingBottom: 'env(safe-area-inset-bottom)',
}));

const NavContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  maxWidth: 1400,
  margin: '0 auto',
  padding: '8px 16px',
  [theme.breakpoints.down('md')]: {
    padding: '4px 8px',
  },
}));

// Hero accent color: #5AC8FA (cyan)
const NavItem = styled(Box)<{ active?: boolean }>(({ theme, active }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 12px',
  borderRadius: 12,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  minWidth: 64,
  color: active ? '#5AC8FA' : 'rgba(255, 255, 255, 0.8)',
  backgroundColor: active ? alpha('#5AC8FA', 0.15) : 'transparent',
  '&:hover': {
    backgroundColor: alpha('#5AC8FA', 0.15),
    color: '#5AC8FA',
  },
  [theme.breakpoints.down('md')]: {
    padding: '6px 8px',
    minWidth: 48,
  },
}));

const NavIcon = styled(Box)({
  fontSize: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const NavLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.65rem',
  fontWeight: 500,
  marginTop: 2,
  textAlign: 'center',
  lineHeight: 1.2,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.55rem',
  },
}));

// Types
interface NavItemConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const BottomNav: React.FC = () => {
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [userRole, setUserRole] = useState<string>('techie');
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [notifications, setNotifications] = useState(0);
  const [messages, setMessages] = useState(2);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch unread notification count from backend
  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/hiring/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.unread_count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
    }
  };

  useEffect(() => {
    loadUserData();
    fetchNotificationCount();
    
    // Refresh notification count every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const loadUserData = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
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
          user.role_type === roleType ||
          userRoles.some((r: any) => r.role_type === roleType || r.name?.toLowerCase() === roleType.toLowerCase()) ||
          userGroups.some((g: any) => g.name === roleType || g.name?.toLowerCase() === roleType.toLowerCase());
        
        // Check if user is a hiring manager (regular HR, not admin)
        const isHiringManager = hasRole('hiring_manager') || hasRole('hr');
        
        const hasAdminRole = (adminRole: string) =>
          adminRoles.includes(adminRole);
        
        // Check for admin roles first (HM Admin, Techie Admin, etc.)
        if (user.is_superuser || hasAdminRole('superadmin')) {
          setUserRole('super_admin');
        } else if (hasAdminRole('hm_admin')) {
          setUserRole('hm_admin');
        } else if (hasAdminRole('techie_admin')) {
          setUserRole('techie_admin');
        } else if (hasAdminRole('company_admin')) {
          setUserRole('company_admin');
        } else if (hasAdminRole('school_admin')) {
          setUserRole('school_admin');
        } else if (user.is_staff || adminRoles.length > 0) {
          setUserRole('admin');
        } else if (isHiringManager) {
          setUserRole('hiring_manager');
        } else if (user.has_school || user.school_id) {
          setUserRole('school');
        } else if (user.has_company || user.company_id) {
          setUserRole('company');
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
    if (path === '/home' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  // Check if user is any type of admin
  const isAnyAdmin = ['super_admin', 'hm_admin', 'techie_admin', 'company_admin', 'school_admin', 'admin'].includes(userRole);
  
  // Core navigation items - same for all users (admins and non-admins)
  const coreNavItems: NavItemConfig[] = [
    { key: 'home', label: 'Home', icon: <HomeIcon />, path: '/techie/home/feed' },
    { key: 'jobs', label: 'Jobs', icon: <WorkIcon />, path: '/techie/jobs' },
    { key: 'practice', label: 'Practice', icon: <CodeIcon />, path: '/techie/practice' },
  ];

  // Secondary nav items - available for all users
  const secondaryNavItems: NavItemConfig[] = [
    { key: 'learn', label: 'Learn', icon: <SchoolIcon />, path: '/techie/learn' },
    { key: 'chat', label: 'Chat', icon: <ChatIcon />, path: '/techie/chat', badge: messages },
    { key: 'blogs', label: 'Blogs', icon: <ArticleIcon />, path: '/techie/blogs' },
  ];

  // Get role-specific items - All user-side pages under /techie/
  const getRoleSpecificItems = (): NavItemConfig[] => {
    const items: NavItemConfig[] = [];
    
    // ATS for Hiring Managers and Admins (user-side job posting management)
    if (userRole === 'hiring_manager' || userRole === 'hm_admin' || isAnyAdmin) {
      items.push({ 
        key: 'ats', 
        label: 'ATS', 
        icon: <TrackChangesIcon />, 
        path: '/techie/ats' 
      });
    }
    
    // SMS for School Page Owners and Admins (user-side school page management)
    if (userRole === 'school' || userRole === 'school_admin' || isAnyAdmin) {
      items.push({ 
        key: 'sms', 
        label: 'SMS', 
        icon: <BusinessIcon />, 
        path: '/techie/sms' 
      });
    }
    
    // CMS for Company Page Owners and Admins (user-side company page management)
    if (userRole === 'company' || userRole === 'company_admin' || isAnyAdmin) {
      items.push({ 
        key: 'cms', 
        label: 'CMS', 
        icon: <DashboardIcon />, 
        path: '/techie/cms' 
      });
    }
    
    // Admin link - Routes to appropriate admin panel based on role
    if (userRole === 'super_admin') {
      items.push({ 
        key: 'admin', 
        label: 'Admin', 
        icon: <AdminPanelSettingsIcon />, 
        path: '/super-admin' 
      });
    } else if (userRole === 'hm_admin') {
      items.push({ 
        key: 'admin', 
        label: 'Admin', 
        icon: <AdminPanelSettingsIcon />, 
        path: '/vertechie/hmadmin' 
      });
    } else if (userRole === 'techie_admin') {
      items.push({ 
        key: 'admin', 
        label: 'Admin', 
        icon: <AdminPanelSettingsIcon />, 
        path: '/vertechie/techieadmin' 
      });
    } else if (userRole === 'company_admin') {
      items.push({ 
        key: 'admin', 
        label: 'Admin', 
        icon: <AdminPanelSettingsIcon />, 
        path: '/vertechie/companyadmin' 
      });
    } else if (userRole === 'school_admin') {
      items.push({ 
        key: 'admin', 
        label: 'Admin', 
        icon: <AdminPanelSettingsIcon />, 
        path: '/vertechie/schooladmin' 
      });
    } else if (userRole === 'admin') {
      items.push({ 
        key: 'admin', 
        label: 'Admin', 
        icon: <AdminPanelSettingsIcon />, 
        path: '/vertechie/admin' 
      });
    }
    
    return items;
  };

  // Determine which items to show based on screen size
  const getVisibleItems = () => {
    const roleItems = getRoleSpecificItems();
    
    if (isMobile) {
      // On mobile, show: Home, Jobs, Practice, Chat, Profile + More
      return coreNavItems.slice(0, 3);
    } else if (isTablet) {
      // On tablet, show: Home, Jobs, Practice, Network (includes Community), Chat, Notifications, Profile + More
      return [...coreNavItems];
    } else {
      // On desktop, show all core items
      return [...coreNavItems, ...secondaryNavItems, ...roleItems];
    }
  };

  const getMoreItems = () => {
    const roleItems = getRoleSpecificItems();
    const allItems = [...coreNavItems, ...secondaryNavItems, ...roleItems];
    const visibleItems = getVisibleItems();
    const visibleKeys = new Set(visibleItems.map(item => item.key));
    return allItems.filter(item => !visibleKeys.has(item.key));
  };

  const visibleItems = getVisibleItems();
  const moreItems = getMoreItems();

  return (
    <StyledBottomNav elevation={0}>
      <NavContainer>
        {/* Main Navigation Items */}
        {visibleItems.map((item) => (
          <NavItem
            key={item.key}
            active={isActive(item.path)}
            onClick={() => navigate(item.path)}
          >
            <NavIcon>
              {item.badge ? (
                <Badge badgeContent={item.badge} color="error" max={99}>
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </NavIcon>
            <NavLabel>{item.label}</NavLabel>
          </NavItem>
        ))}
        
        {/* Chat (always visible) */}
        {isMobile && (
          <NavItem
            active={isActive(userRole === 'hiring_manager' ? '/hr/chat' : '/techie/chat')}
            onClick={() => navigate(userRole === 'hiring_manager' ? '/hr/chat' : '/techie/chat')}
          >
            <NavIcon>
              <Badge badgeContent={messages} color="error" max={99}>
                <ChatIcon />
              </Badge>
            </NavIcon>
            <NavLabel>Chat</NavLabel>
          </NavItem>
        )}
        
        {/* Alerts/Notifications */}
        <NavItem
          active={isActive(userRole === 'hiring_manager' ? '/hr/alerts' : '/techie/alerts')}
          onClick={() => navigate(userRole === 'hiring_manager' ? '/hr/alerts' : '/techie/alerts')}
        >
          <NavIcon>
            <Badge badgeContent={notifications} color="error" max={99}>
              <NotificationsIcon />
            </Badge>
          </NavIcon>
          <NavLabel>Alerts</NavLabel>
        </NavItem>
        
        {/* More Menu (for hidden items) */}
        {moreItems.length > 0 && (
          <>
            <NavItem
              onClick={(e) => setMoreAnchor(e.currentTarget as HTMLElement)}
            >
              <NavIcon>
                <MoreHorizIcon />
              </NavIcon>
              <NavLabel>More</NavLabel>
            </NavItem>
            
            <Menu
              anchorEl={moreAnchor}
              open={Boolean(moreAnchor)}
              onClose={() => setMoreAnchor(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              PaperProps={{
                sx: {
                  background: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)', // Hero gradient
                  color: 'white',
                  border: '1px solid rgba(90, 200, 250, 0.2)',
                  boxShadow: '0 8px 32px rgba(13, 71, 161, 0.3)',
                  minWidth: 180,
                  mb: 1,
                },
              }}
            >
              {moreItems.map((item) => (
                <MenuItem
                  key={item.key}
                  onClick={() => {
                    navigate(item.path);
                    setMoreAnchor(null);
                  }}
                  sx={{
                    py: 1.5,
                    '&:hover': { bgcolor: alpha('#5AC8FA', 0.15) },
                  }}
                >
                  <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {item.badge ? (
                      <Badge badgeContent={item.badge} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
        
        {/* Profile */}
        <NavItem
          active={isActive(userRole === 'hiring_manager' ? '/hr/profile' : '/techie/profile')}
          onClick={(e) => setProfileAnchor(e.currentTarget as HTMLElement)}
        >
          <NavIcon>
            <Avatar
              src={userAvatar}
              sx={{ 
                width: 28, 
                height: 28, 
                bgcolor: '#0d47a1',
                border: '2px solid rgba(90, 200, 250, 0.5)',
                fontSize: '0.8rem',
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </NavIcon>
          <NavLabel>Profile</NavLabel>
        </NavItem>
        
        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={() => setProfileAnchor(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          PaperProps={{
            sx: {
              background: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)', // Hero gradient
              color: 'white',
              border: '1px solid rgba(90, 200, 250, 0.2)',
              boxShadow: '0 8px 32px rgba(13, 71, 161, 0.3)',
              minWidth: 220,
              mb: 1,
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {userName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              {userRole.replace('_', ' ').toUpperCase()}
            </Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          
          <MenuItem
            onClick={() => {
              navigate(userRole === 'hiring_manager' ? '/hr/profile' : '/techie/profile');
              setProfileAnchor(null);
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)' }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="View Profile" />
          </MenuItem>
          
          <MenuItem
            onClick={() => {
              navigate(userRole === 'hiring_manager' ? '/hr/saved' : '/techie/saved');
              setProfileAnchor(null);
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)' }}>
              <BookmarkIcon />
            </ListItemIcon>
            <ListItemText primary="Saved Items" />
          </MenuItem>
          
          {/* My Applications - for Techies */}
          {userRole !== 'hiring_manager' && (
            <MenuItem
              onClick={() => {
                navigate('/my-applications');
                setProfileAnchor(null);
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)' }}>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary="My Applications" />
            </MenuItem>
          )}
          
          {/* My Interviews - for Techies */}
          {userRole !== 'hiring_manager' && (
            <MenuItem
              onClick={() => {
                navigate('/techie/my-interviews');
                setProfileAnchor(null);
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon sx={{ color: '#5AC8FA' }}>
                <EventAvailableIcon />
              </ListItemIcon>
              <ListItemText 
                primary="My Interviews" 
                secondary={notifications > 0 ? `${notifications} upcoming` : undefined}
                secondaryTypographyProps={{ sx: { color: '#5AC8FA', fontSize: '0.75rem' } }}
              />
            </MenuItem>
          )}
          
          <MenuItem
            onClick={() => {
              navigate(userRole === 'hiring_manager' ? '/hr/settings' : '/techie/settings');
              setProfileAnchor(null);
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)' }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </MenuItem>
          
          {/* Create School/Company Account Option */}
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          
          {(userRole === 'techie' || userRole === 'hiring_manager') && (
            <>
              <MenuItem
                onClick={() => {
                  navigate('/techie/create-company');
                  setProfileAnchor(null);
                }}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon sx={{ color: '#5AC8FA' }}>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Create Company Page" />
              </MenuItem>
              
              <MenuItem
                onClick={() => {
                  navigate('/techie/create-school');
                  setProfileAnchor(null);
                }}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon sx={{ color: '#5AC8FA' }}>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary="Create School Page" />
              </MenuItem>
              
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            </>
          )}
          
          <MenuItem
            onClick={() => {
              navigate(userRole === 'hiring_manager' ? '/hr/help' : '/techie/help');
              setProfileAnchor(null);
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)' }}>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Help Center" />
          </MenuItem>
          
          <MenuItem
            onClick={handleLogout}
            sx={{ py: 1.5, color: '#ff6b6b' }}
          >
            <ListItemIcon sx={{ color: '#ff6b6b' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </MenuItem>
        </Menu>
      </NavContainer>
    </StyledBottomNav>
  );
};

export default BottomNav;

