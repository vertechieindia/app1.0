import React, { useState, useEffect, ElementType } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar, 
  Divider, 
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useScrollTrigger,
  Slide,
  Fade,
  alpha,
  ButtonProps,
  ListItemProps
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import ArticleIcon from '@mui/icons-material/Article';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { Link as RouterLink, useLocation, LinkProps } from 'react-router-dom';

// Define interfaces for component props
interface NavLinkProps extends ButtonProps {
  active?: boolean;
  to?: string;
  component?: React.ElementType;
}

interface DrawerListItemProps extends ListItemProps {
  active?: boolean;
  to?: string;
  component?: React.ElementType;
  button?: boolean;
}

interface NavBarProps {
  isAuthenticated?: boolean;
  user?: {
    name: string;
    avatar?: string;
    unreadNotifications?: number;
  };
  onLogout?: () => void;
}

// Hide on scroll
function HideOnScroll(props: { children: React.ReactElement }) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
  color: theme.palette.text.primary,
  position: 'sticky',
  transition: 'all 0.3s ease',
}));

const LogoContainer = styled(RouterLink)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
}));

const Logo = styled('img')(({ theme }) => ({
  height: 40,
  marginRight: theme.spacing(1),
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  background: 'linear-gradient(90deg, #0077B5 0%, #5AC8FA 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '-0.5px',
}));

const NavLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const NavLink = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<NavLinkProps>(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  marginLeft: theme.spacing(0.5),
  marginRight: theme.spacing(0.5),
  padding: theme.spacing(1, 1.5),
  textTransform: 'none',
  fontWeight: active ? 600 : 500,
  fontSize: '0.9rem',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 8,
  '&::after': active
    ? {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '20%',
        width: '60%',
        height: 3,
        borderRadius: 1.5,
        backgroundColor: theme.palette.primary.main,
      }
    : {},
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

const AuthButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const SignUpButton = styled(Button)<NavLinkProps>(({ theme }) => ({
  marginLeft: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  background: 'linear-gradient(90deg, #0077B5 0%, #5AC8FA 100%)',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(90deg, #006199 0%, #4BB8EA 100%)',
    boxShadow: '0 4px 12px rgba(0, 119, 181, 0.2)',
    transform: 'translateY(-1px)',
  },
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#FF3B30',
    color: 'white',
    fontWeight: 600,
    boxShadow: '0 0 0 2px #fff',
  },
}));

const ProfileButton = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: 600,
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
  color: theme.palette.text.primary,
}));

const UserMenuItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
}));

const UserMenuAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  marginRight: theme.spacing(1.5),
  border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
  },
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  background: alpha(theme.palette.primary.main, 0.05),
}));

const DrawerLogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  background: 'linear-gradient(90deg, #0077B5 0%, #5AC8FA 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  flex: 1,
}));

const DrawerList = styled(List)(({ theme }) => ({
  padding: theme.spacing(2, 0),
}));

const DrawerListItem = styled(ListItem)<DrawerListItemProps>(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  ...(active && {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.16),
    },
  }),
}));

const NavBar: React.FC<NavBarProps> = ({ 
  isAuthenticated = false, 
  user = { name: '', avatar: '', unreadNotifications: 0 },
  onLogout 
}) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Check if current path matches route
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Profile menu handlers
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };
  
  // Mobile menu handlers
  const handleMobileMenuOpen = () => {
    setIsMobileMenuOpen(true);
  };
  
  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };
  
  // Logout handler
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    handleProfileMenuClose();
    handleMobileMenuClose();
  };
  
  // Links data
  const menuItems = [
    { title: 'Home', path: '/', icon: <HomeIcon /> },
    { title: 'Courses', path: '/courses', icon: <SchoolIcon /> },
    { title: 'Networking', path: '/networking', icon: <GroupIcon /> },
    { title: 'Companies', path: '/companies', icon: <BusinessIcon /> },
    { title: 'Contact', path: '/contact', icon: <ContactMailIcon /> },
  ];

  return (
    <>
      <HideOnScroll>
        <StyledAppBar elevation={isScrolled ? 4 : 0}>
          <Container maxWidth="lg">
            <Toolbar sx={{ padding: { xs: 1, sm: 2 } }}>
              {/* Logo */}
              <LogoContainer to="/">
                <Logo src="/images/logo/vertechie-logo.svg" alt="VerTechie" />
                <LogoText variant="h6">VerTechie</LogoText>
              </LogoContainer>
              
              {/* Navigation Links */}
              <NavLinks>
                {menuItems.map((item) => (
                  <NavLink 
                    key={item.path} 
                    component={RouterLink} 
                    to={item.path}
                    active={isActive(item.path)}
                  >
                    {item.title}
                  </NavLink>
                ))}
              </NavLinks>
              
              <Box sx={{ flexGrow: 1 }} />
              
              {/* Auth Buttons or User Profile */}
              {isAuthenticated ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Notifications */}
                  <IconButton color="inherit" sx={{ mr: 1 }}>
                    <NotificationBadge badgeContent={user.unreadNotifications} max={9}>
                      <NotificationsIcon />
                    </NotificationBadge>
                  </IconButton>
                  
                  {/* Profile Menu */}
                  <ProfileButton>
                    <Box onClick={handleProfileMenuOpen} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <ProfileAvatar src={user.avatar}>
                        {!user.avatar && user.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
                      </ProfileAvatar>
                    </Box>
                  </ProfileButton>
                  
                  {/* Profile Menu */}
                  <Menu
                    anchorEl={profileMenuAnchor}
                    open={Boolean(profileMenuAnchor)}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        borderRadius: 2,
                        minWidth: 220,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <UserMenuItem>
                      <UserMenuAvatar src={user.avatar}>
                        {!user.avatar && user.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
                      </UserMenuAvatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {user.name || 'User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          View Profile
                        </Typography>
                      </Box>
                    </UserMenuItem>
                    <Divider />
                    <MenuItem component={RouterLink} to="/profile" onClick={handleProfileMenuClose}>
                      <ListItemIcon>
                        <AccountCircleIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="My Profile" />
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/my-courses" onClick={handleProfileMenuClose}>
                      <ListItemIcon>
                        <ImportContactsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="My Courses" />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <AuthButtons>
                  <NavLink component={RouterLink} to="/login">
                    Login
                  </NavLink>
                  <SignUpButton 
                    variant="contained" 
                    component={RouterLink} 
                    to="/signup"
                  >
                    Sign Up
                  </SignUpButton>
                </AuthButtons>
              )}
              
              {/* Mobile Menu Button */}
              <MobileMenuButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </MobileMenuButton>
            </Toolbar>
          </Container>
        </StyledAppBar>
      </HideOnScroll>
      
      {/* Mobile Drawer */}
      <MobileDrawer
        anchor="right"
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <DrawerHeader>
          <DrawerLogoText variant="h6">VerTechie</DrawerLogoText>
          <IconButton onClick={handleMobileMenuClose}>
            <MenuIcon />
          </IconButton>
        </DrawerHeader>
        
        {isAuthenticated && (
          <>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <UserMenuAvatar src={user.avatar}>
                  {!user.avatar && user.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
                </UserMenuAvatar>
                <Box sx={{ ml: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {user.name || 'User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View Profile
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
          </>
        )}
        
        <DrawerList>
          {menuItems.map((item) => (
            <DrawerListItem
              key={item.path}
              component={RouterLink}
              to={item.path}
              active={isActive(item.path)}
              onClick={handleMobileMenuClose}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </DrawerListItem>
          ))}
          
          <Divider sx={{ my: 2 }} />
          
          {!isAuthenticated ? (
            <>
              <DrawerListItem
                component={RouterLink}
                to="/login"
                onClick={handleMobileMenuClose}
              >
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </DrawerListItem>
              <DrawerListItem
                component={RouterLink}
                to="/signup"
                onClick={handleMobileMenuClose}
              >
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Sign Up" />
              </DrawerListItem>
            </>
          ) : (
            <>
              <DrawerListItem
                component={RouterLink}
                to="/profile"
                onClick={handleMobileMenuClose}
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </DrawerListItem>
              <DrawerListItem
                component={RouterLink}
                to="/my-courses"
                onClick={handleMobileMenuClose}
              >
                <ListItemIcon>
                  <ImportContactsIcon />
                </ListItemIcon>
                <ListItemText primary="My Courses" />
              </DrawerListItem>
              <DrawerListItem
                onClick={handleLogout}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </DrawerListItem>
            </>
          )}
        </DrawerList>
      </MobileDrawer>
    </>
  );
};

export default NavBar; 