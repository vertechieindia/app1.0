import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Button, 
  Divider, 
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
  List,
  ListItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
// Custom X icon component for the rebranded Twitter/X platform
const XIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Styled components
const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  position: 'relative',
  overflow: 'hidden',
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  borderTop: `1px solid ${theme.palette.grey[200]}`,
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.9rem',
  marginBottom: theme.spacing(1),
  position: 'relative',
  display: 'inline-block',
  color: theme.palette.primary.main,
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: -4,
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.palette.primary.main,
  },
}));

const FooterLink = styled(RouterLink)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  fontWeight: 500,
  display: 'block',
  marginBottom: theme.spacing(0.5),
  transition: 'all 0.2s ease',
  fontSize: '0.8rem',
  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'translateX(3px)',
  },
}));

const BottomLink = styled(RouterLink)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '0.85rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'translateX(3px)',
  },
}));


const SocialLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const SocialIconLink = styled('a')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: '8px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-3px) scale(1.05)',
  },
  '&:nth-of-type(1)': { // LinkedIn
    backgroundColor: '#0077B5',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#005885',
      boxShadow: '0 8px 25px rgba(0, 119, 181, 0.4)',
    },
    '& svg': {
      fontSize: '18px',
    },
  },
  '&:nth-of-type(2)': { // Twitter/X
    backgroundColor: '#000000',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#333333',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
    },
    '& svg': {
      fontSize: '18px',
    },
  },
  '&:nth-of-type(3)': { // Facebook
    backgroundColor: '#1877F2',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#166fe5',
      boxShadow: '0 8px 25px rgba(24, 119, 242, 0.4)',
    },
    '& svg': {
      fontSize: '18px',
    },
  },
  '&:nth-of-type(4)': { // Instagram
    background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    color: '#ffffff',
    '&:hover': {
      background: 'linear-gradient(45deg, #e8852a 0%,#d55a2f 25%,#d01e35 50%,#b91d5a 75%,#a5157a 100%)',
      boxShadow: '0 8px 25px rgba(188, 24, 136, 0.4)',
    },
    '& svg': {
      fontSize: '18px',
    },
  },
  '&:nth-of-type(5)': { // YouTube
    backgroundColor: '#FF0000',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#cc0000',
      boxShadow: '0 8px 25px rgba(255, 0, 0, 0.4)',
    },
    '& svg': {
      fontSize: '18px',
    },
  },
}));

const BottomBar = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(1.5, 0),
  position: 'relative',
  borderTop: `1px solid ${theme.palette.grey[200]}`,
}));

const TopButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(3),
  bottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: '#ffffff',
  borderRadius: 8,
  padding: theme.spacing(0.8),
  boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-3px)',
    boxShadow: `0 6px 15px ${theme.palette.primary.main}50`,
  },
  [theme.breakpoints.down('sm')]: {
    bottom: theme.spacing(1),
    right: theme.spacing(1),
  },
}));

const LogoImage = styled('img')(({ theme }) => ({
  height: '32px',
  width: '32px',
  marginRight: theme.spacing(0.5),
  [theme.breakpoints.down('sm')]: {
    height: '28px',
    width: '28px',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.3rem',
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginLeft: theme.spacing(1),
}));

const LogoIcon = styled('div')(({ theme }) => ({
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  borderRadius: '8px',
  marginRight: theme.spacing(1),
  color: theme.palette.common.white,
  fontSize: '20px',
  fontWeight: 'bold',
  [theme.breakpoints.down('sm')]: {
    width: '32px',
    height: '32px',
    fontSize: '16px',
  },
}));

// Layout containers for responsive design
const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '50%',
  },
  [theme.breakpoints.up('md')]: {
    width: '20%',
  },
  padding: theme.spacing(0, 2),
}));

const AboutSection = styled(Section)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: '25%',
  },
}));

const SubscribeSection = styled(Section)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: '25%',
  },
}));

const BottomSection = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: '65%',
  },
  padding: theme.spacing(0, 2),
}));

const CopyrightSection = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: '35%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  padding: theme.spacing(0, 2),
}));

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  
  const currentYear = 2018;
  
  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        <Grid container spacing={1.5}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LogoImage src="/images/logo/vertechie-logo.svg" alt="VerTechie Logo" />
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '1.1rem' }}>
                VerTechie
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1, fontSize: '0.8rem' }}>
              Built on Trust. Driven by Technology.
            </Typography>
            <SocialLinks>
              <SocialIconLink
                href="https://www.linkedin.com/company/vertechie/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </SocialIconLink>
              <SocialIconLink
                href="https://x.com/VerTechie"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
              >
                <XIcon />
              </SocialIconLink>
              <SocialIconLink
                href="https://www.facebook.com/share/1EudbQPPEp/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </SocialIconLink>
              <SocialIconLink
                href="https://www.instagram.com/vertechie?igsh=MTFoeW80cTVubGtjdA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </SocialIconLink>
              <SocialIconLink
                href="https://youtube.com/@vertechie?si=rrH8NwbjiPR6uDr7"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <YouTubeIcon />
              </SocialIconLink>
            </SocialLinks>
          </Grid>
          
          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterTitle variant="h6">Quick Links</FooterTitle>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/networking">Networking</FooterLink>
            <FooterLink to="/companies">Companies</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
          </Grid>
          
          {/* For Members */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterTitle variant="h6">For Members</FooterTitle>
            <FooterLink to="/login">Login</FooterLink>
            <FooterLink to="/signup">Sign Up</FooterLink>
            <FooterLink to="/pricing">Pricing</FooterLink>
            <FooterLink to="/support">Support</FooterLink>
          </Grid>
          
          {/* For Companies */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterTitle variant="h6">For Companies</FooterTitle>
            <FooterLink to="/companies/post-job">Post a Job</FooterLink>
            <FooterLink to="/companies/talent-search">Talent Search</FooterLink>
            <FooterLink to="/companies/advertise">Advertise</FooterLink>
            <FooterLink to="/companies/enterprise">Enterprise</FooterLink>
            <FooterLink to="/companies/contact">Contact Sales</FooterLink>
          </Grid>
        </Grid>
        
        <Divider sx={{ mb: 0.5, opacity: 0.3, backgroundColor: theme.palette.grey[300] }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <BottomLink to="/terms">Terms</BottomLink>
            <BottomLink to="/privacy">Privacy</BottomLink>
            <BottomLink to="/cookies">Cookies</BottomLink>
            <BottomLink to="/accessibility">Accessibility</BottomLink>
          </Box>
          
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
            © {currentYear} VerTechie. All rights reserved.
          </Typography>
        </Box>
      </Container>
      
      <TopButton onClick={scrollToTop} aria-label="scroll to top">
        <KeyboardArrowUpIcon />
      </TopButton>
    </FooterWrapper>
  );
};

export default Footer; 