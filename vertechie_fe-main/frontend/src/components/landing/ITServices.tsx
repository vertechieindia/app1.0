import React, { useState } from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Tabs, Tab, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import CloudIcon from '@mui/icons-material/Cloud';
import DataObjectIcon from '@mui/icons-material/DataObject';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BuildIcon from '@mui/icons-material/Build';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

const ServicesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  background: '#f8f9fa',
  width: '100%',
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const StyledTab = styled(Tab)({
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`platform-tabpanel-${index}`}
      aria-labelledby={`platform-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const professionalServices = [
  {
    icon: <WorkIcon fontSize="large" />,
    title: "Job Matching",
    description: "Find positions that align with your skills, experience, and career goals through our AI-powered matching system."
  },
  {
    icon: <SchoolIcon fontSize="large" />,
    title: "Professional Development",
    description: "Access industry-leading courses and certifications to enhance your skills and stay competitive in your field."
  },
  {
    icon: <PeopleIcon fontSize="large" />,
    title: "Networking",
    description: "Connect with industry peers, mentors, and potential employers to expand your professional opportunities."
  }
];

const companyServices = [
  {
    icon: <SearchIcon fontSize="large" />,
    title: "Talent Acquisition",
    description: "Source qualified candidates with verified skills that match your specific requirements and company culture."
  },
  {
    icon: <AssessmentIcon fontSize="large" />,
    title: "Candidate Assessment",
    description: "Evaluate potential hires through our comprehensive assessment tools and skills verification system."
  },
  {
    icon: <CorporateFareIcon fontSize="large" />,
    title: "Corporate Training",
    description: "Provide customized training programs to upskill your workforce and address specific organizational needs."
  }
];

// GridContainer and GridItem components
const GridContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: theme.spacing(-2),
  width: `calc(100% + ${theme.spacing(4)})`,
}));

interface GridItemProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  children: React.ReactNode;
}

const GridItem = styled(Box, {
  shouldForwardProp: (prop) => !['xs', 'sm', 'md', 'lg'].includes(prop as string),
})<GridItemProps>(({ xs = 12, sm, md, lg, theme }) => {
  const getWidth = (cols: number) => `${(cols / 12) * 100}%`;
  
  return {
    padding: theme.spacing(2),
    flexGrow: 0,
    maxWidth: '100%',
    flexBasis: '100%',
    width: '100%',
    
    [theme.breakpoints.up('sm')]: {
      ...(sm && {
        maxWidth: getWidth(sm),
        flexBasis: getWidth(sm),
      }),
    },
    [theme.breakpoints.up('md')]: {
      ...(md && {
        maxWidth: getWidth(md),
        flexBasis: getWidth(md),
      }),
    },
    [theme.breakpoints.up('lg')]: {
      ...(lg && {
        maxWidth: getWidth(lg),
        flexBasis: getWidth(lg),
      }),
    },
  };
});

const PlatformServices = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ServicesSection>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 1 }}
        >
          Platform Services
        </Typography>
        <Typography 
          variant="h6"
          align="center"
          sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          color="text.secondary"
        >
          Comprehensive solutions connecting professionals and companies
        </Typography>

        {/* Tabs */}
        <Box sx={{ width: '100%', mb: 6 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth" 
              centered
            >
              <StyledTab label="For Professionals" />
              <StyledTab label="For Companies" />
            </Tabs>
          </Box>
          
          {/* Professionals Tab Panel */}
          <TabPanel value={tabValue} index={0}>
            <GridContainer>
              {professionalServices.map((service, index) => (
                <GridItem xs={12} md={4} key={index}>
                  <ServiceCard>
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                      <IconBox>
                        {service.icon}
                      </IconBox>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {service.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {service.description}
                      </Typography>
                    </CardContent>
                  </ServiceCard>
                </GridItem>
              ))}
            </GridContainer>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                sx={{ px: 4, py: 1 }}
              >
                Create Professional Profile
              </Button>
            </Box>
          </TabPanel>
          
          {/* Companies Tab Panel */}
          <TabPanel value={tabValue} index={1}>
            <GridContainer>
              {companyServices.map((service, index) => (
                <GridItem xs={12} md={4} key={index}>
                  <ServiceCard>
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                      <IconBox>
                        {service.icon}
                      </IconBox>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {service.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {service.description}
                      </Typography>
                    </CardContent>
                  </ServiceCard>
                </GridItem>
              ))}
            </GridContainer>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                sx={{ px: 4, py: 1 }}
              >
                Register Company
              </Button>
            </Box>
          </TabPanel>
        </Box>

        {/* Call to action */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: 6, 
            p: 5, 
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'white'
          }}
        >
          <Typography variant="h4" gutterBottom>
            Ready to transform your professional journey?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
            Join our platform to connect with opportunities, enhance your skills, and advance your career.
          </Typography>
          <Button 
            variant="outlined" 
            color="inherit"
            size="large"
            sx={{ mr: 2, borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Sign Up
          </Button>
          <Button 
            variant="contained" 
            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
            size="large"
          >
            Learn More
          </Button>
        </Box>
      </Container>
    </ServicesSection>
  );
};

export default PlatformServices; 