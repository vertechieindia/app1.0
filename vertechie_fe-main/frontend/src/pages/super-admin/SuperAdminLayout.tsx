import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  SupervisorAccount,
  Security,
  Groups,
  Dashboard,
  Menu as MenuIcon,
} from '@mui/icons-material';

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

const AnimatedDotsContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 0,
  pointerEvents: 'none',
  background: `linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)`,
});

const DotGrid = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: `radial-gradient(circle at center, rgba(0, 0, 0, 0.12) 1.5px, transparent 1.5px)`,
  backgroundSize: '28px 28px',
  animation: `${pulse} 4s ease-in-out infinite`,
});

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Dashboard', path: '/super-admin', icon: <Dashboard />, exact: true },
  { label: 'Admin Workspace', path: '/super-admin/admins', icon: <SupervisorAccount /> },
  { label: 'Access Roles', path: '/super-admin/roles', icon: <Security /> },
  { label: 'User Directory', path: '/super-admin/users', icon: <Groups /> },
];

const SuperAdminLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
          Super Admin
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          System Management
        </Typography>
      </Box>
      
      <List sx={{ flex: 1, py: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ px: 1.5, mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: '12px',
                py: 1.5,
                backgroundColor: isActive(item) ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                borderLeft: isActive(item) ? '3px solid #6366f1' : '3px solid transparent',
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40, 
                color: isActive(item) ? '#6366f1' : '#64748b',
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive(item) ? 600 : 500,
                  color: isActive(item) ? '#6366f1' : '#475569',
                  fontSize: '0.9rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Animated Background */}
      <AnimatedDotsContainer>
        <DotGrid />
      </AnimatedDotsContainer>

      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar 
          position="fixed" 
          sx={{ 
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, color: '#6366f1' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Super Admin
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': { 
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.98)',
                backdropFilter: 'blur(20px)',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': { 
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
                border: 'none',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                boxShadow: '4px 0 20px rgba(0,0,0,0.05)',
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          pt: isMobile ? 8 : 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default SuperAdminLayout;


