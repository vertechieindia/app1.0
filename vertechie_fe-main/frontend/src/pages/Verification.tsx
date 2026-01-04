import { Container, Typography, Box, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const PageSection = styled('section')(({ theme }) => ({
  padding: theme.spacing(8, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(12, 0),
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  '&:first-of-type': {
    paddingTop: 0,
  },
  '&:last-of-type': {
    paddingBottom: 0,
  },
}));

const Verification = () => {
  return (
    <>
      <PageSection>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <VerifiedUserIcon 
              sx={{ 
                fontSize: 64, 
                color: 'primary.main',
                mb: 2 
              }} 
            />
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Our Verification Process
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxWidth: 800, mx: 'auto' }}
            >
              At VerTechie, we take verification seriously. Our multi-layer process ensures
              that you can trust every professional on our platform.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" component="h2">
                    Identity Verification
                  </Typography>
                </Box>
                <List>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Government ID Verification"
                      secondary="We verify official identification documents"
                    />
                  </StyledListItem>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Real-time Video Verification"
                      secondary="Optional advanced verification through video calls"
                    />
                  </StyledListItem>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Digital Footprint Analysis"
                      secondary="Cross-reference with professional networks"
                    />
                  </StyledListItem>
                </List>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AssignmentTurnedInIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" component="h2">
                    Professional Verification
                  </Typography>
                </Box>
                <List>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Education Background Check"
                      secondary="Verification of academic credentials"
                    />
                  </StyledListItem>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Employment History"
                      secondary="Confirmation of past work experience"
                    />
                  </StyledListItem>
                  <StyledListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Skills Assessment"
                      secondary="Technical evaluation and peer reviews"
                    />
                  </StyledListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </PageSection>

      <PageSection sx={{ bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{ mb: 4, fontWeight: 700 }}
          >
            Why Trust Matters
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            Our verification process is designed to create a trusted ecosystem where companies
            can confidently hire tech professionals, knowing that their credentials and
            expertise have been thoroughly validated.
          </Typography>
        </Container>
      </PageSection>
    </>
  );
};

export default Verification; 