import { useState, useEffect } from 'react';
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
  ListItemText,
  useTheme,
  useMediaQuery,
  Link,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import resolveAssetPath from '../../utils/assetResolver';

const LogoImage = styled('img')(({ theme }) => ({
  height: '45px',
  width: '45px',
  marginRight: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    height: '35px',
    width: '35px',
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<'HR' | 'Techie' | 'Admin' | 'Super Admin' | ''>('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check authentication status on mount and route changes
  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  const checkAuthStatus = () => {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (authToken && userData) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(userData);
        // Get user name
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim() || user.username || user.email || 'User';
        setUserName(fullName);
        
        // Detect user role
        if (user.is_superuser) {
          setUserRole('Super Admin');
        } else if (user.is_staff) {
          setUserRole('Admin');
        } else if (user.groups?.some((g: any) => 
          g.name?.toLowerCase() === 'hr' || g.name?.toLowerCase() === 'hiring_manager'
        )) {
          setUserRole('HR');
        } else {
          setUserRole('Techie');
        }
      } catch {
        setUserName('User');
        setUserRole('');
      }
    } else {
      setIsLoggedIn(false);
      setUserName('');
      setUserRole('');
    }
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };
  
  const handleLogout = () => {
    // Clear all auth data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    
    setIsLoggedIn(false);
    setUserName('');
    handleProfileMenuClose();
    
    // Redirect to login page
    navigate('/');
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Networking', path: '/networking' },
    { label: 'Companies', path: '/companies' },
    { label: 'Contact', path: '/contact' },
  ];

  const drawer = (
    <List>
      {/* Only show menu items when NOT logged in */}
      {!isLoggedIn && menuItems.map((item) => (
        <ListItem
          key={item.label}
          component={RouterLink}
          to={item.path}
          onClick={handleDrawerToggle}
        >
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
      {!isLoggedIn && <Divider sx={{ my: 2 }} />}
      
      {isLoggedIn ? (
        <>
          <ListItem sx={{ py: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: userRole === 'HR' ? '#be5869' : userRole === 'Techie' ? '#00a67d' : '#0077B5',
                mr: 2,
                fontWeight: 700,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
            <ListItemText 
              primary={userName}
              secondary={userRole}
              primaryTypographyProps={{ fontWeight: 600 }}
              secondaryTypographyProps={{ 
                sx: { 
                  color: userRole === 'HR' ? '#be5869' : userRole === 'Techie' ? '#00a67d' : '#0077B5',
                  fontWeight: 500 
                } 
              }}
            />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem 
            onClick={() => {
              handleDrawerToggle();
              handleLogout();
            }}
            sx={{ 
              cursor: 'pointer',
              color: '#dc2626',
              '&:hover': { backgroundColor: 'rgba(220, 38, 38, 0.08)' }
            }}
          >
            <LogoutIcon sx={{ mr: 2 }} />
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem onClick={handleDrawerToggle} component={RouterLink} to="/login">
            <ListItemText primary="Log In" />
          </ListItem>
          <ListItem onClick={handleDrawerToggle} component={RouterLink} to="/signup">
            <ListItemText primary="Sign Up" />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <StyledAppBar>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Link component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <LogoImage src="/images/logo/vertechie-logo.svg" alt="VerTechie Logo" />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.5rem',
                color: '#0077B5',
              }}
            >
              VerTechie
            </Typography>
          </Link>
        </Box>

        {isMobile ? (
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <>
            {/* Only show navigation menu when NOT logged in */}
            {!isLoggedIn && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      color: 'text.primary',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}
          </>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isLoggedIn ? (
            <>
              {/* User Avatar and Name */}
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: userRole === 'HR' ? '#be5869' : userRole === 'Techie' ? '#00a67d' : '#0077B5',
                    width: 40,
                    height: 40,
                    mr: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#0f3460',
                      lineHeight: 1.2,
                    }}
                  >
                    {userName}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 500,
                      color: userRole === 'HR' ? '#be5869' : userRole === 'Techie' ? '#00a67d' : '#0077B5',
                    }}
                  >
                    {userRole}
                  </Typography>
                </Box>
              </Box>
              
              {/* Logout Button */}
              <Button
                variant="contained"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  fontWeight: 600,
                  color: '#000000',
                  bgcolor: '#fff',
                  borderRadius: '20px',
                  px: 2,
                  py: 1,
                  transition: 'all 0.2s',
                  border: '2px solid rgba(229, 39, 39, 0.8)',
                  '&:hover': {
                    color: '#fff',
                    bgcolor: '#b91c1c',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 10px rgba(220, 38, 38, 0.3)'
                  }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/login"
                sx={{
                  mr: 2,
                  fontWeight: 500,
                  borderRadius: '20px',
                  borderColor: '#0077B5',
                  color: '#0077B5',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 119, 181, 0.08)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 119, 181, 0.1)'
                  }
                }}
              >
                Log In
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/signup"
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  bgcolor: '#0077B5',
                  borderRadius: '20px',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#005885',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 10px rgba(0, 119, 181, 0.3)'
                  }
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: { width: 250 }
        }}
      >
        {drawer}
      </Drawer>
    </StyledAppBar>
  );
};

export default Navbar; 