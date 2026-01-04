import { Box, Container, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShieldIcon from '@mui/icons-material/Shield';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';

const SecuritySection = styled(Box)(({ theme }) => ({
  background: '#000B22',
  color: 'white',
  padding: theme.spacing(10, 0),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
    pointerEvents: 'none',
  }
}));

const ServiceBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderLeft: '3px solid #1976d2',
  transition: 'transform 0.3s, background 0.3s',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    background: 'rgba(255, 255, 255, 0.08)',
  }
}));

const securityServices = [
  {
    icon: <ShieldIcon sx={{ fontSize: 40 }} />,
    title: 'Security Assessment',
    description: 'Comprehensive evaluation of your security posture to identify vulnerabilities and threats.'
  },
  {
    icon: <SearchIcon sx={{ fontSize: 40 }} />,
    title: 'Penetration Testing',
    description: 'Simulated cyber attacks to identify and exploit security weaknesses before malicious actors do.'
  },
  {
    icon: <LockIcon sx={{ fontSize: 40 }} />,
    title: 'Data Protection',
    description: 'Advanced encryption and access control systems to keep your sensitive data secure.'
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
    title: 'Compliance Solutions',
    description: 'Expert guidance to ensure your systems meet industry regulations and compliance requirements.'
  },
  {
    icon: <SyncProblemIcon sx={{ fontSize: 40 }} />,
    title: 'Incident Response',
    description: 'Rapid detection and resolution of security incidents to minimize impact and recovery time.'
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    title: 'Security Training',
    description: 'Employee education programs to create a security-aware culture within your organization.'
  }
];

const Cybersecurity = () => {
  return (
    <SecuritySection>
      <Container 
        maxWidth={false}
        sx={{ 
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, md: 6, lg: 8 } 
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 8
        }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Cybersecurity Solutions
          </Typography>
          <Typography 
            variant="h6" 
            align="center"
            sx={{ mb: 4, maxWidth: 800, opacity: 0.9 }}
          >
            In an increasingly digital world, your security is our top priority. Our comprehensive 
            cybersecurity solutions protect your valuable assets from evolving threats.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              px: 4,
              py: 1.5
            }}
          >
            Get a Security Assessment
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
          {securityServices.map((service, index) => (
            <Box 
              key={index}
              sx={{ 
                width: { xs: '100%', sm: '50%', lg: '33.333%' },
                px: 2,
                mb: 4
              }}
            >
              <ServiceBox>
                <Box sx={{ color: '#1976d2', mb: 2 }}>
                  {service.icon}
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {service.title}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  {service.description}
                </Typography>
              </ServiceBox>
            </Box>
          ))}
        </Box>
        
        <Box 
          sx={{ 
            mt: 6, 
            p: 4, 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: 2,
            background: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          <Typography variant="h5" gutterBottom>
            Proactive Security. 24/7 Monitoring. Expert Response.
          </Typography>
          <Typography variant="body1" paragraph sx={{ opacity: 0.8 }}>
            Our security operations center provides continuous monitoring of your systems, 
            detecting and responding to threats in real-time before they can compromise your data.
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            With a team of certified security professionals and cutting-edge threat intelligence, 
            we ensure your organization stays protected against the most sophisticated cyber threats.
          </Typography>
        </Box>
      </Container>
    </SecuritySection>
  );
};

export default Cybersecurity; 