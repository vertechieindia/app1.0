import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 8,
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            textAlign: 'center',
            mb: 6,
            color: 'primary.main',
          }}
        >
          Pricing Plans
        </Typography>

        {/* Free Plan for Techies, Companies, and Schools */}
        <Card
          sx={{
            mb: 6,
            border: '2px solid',
            borderColor: 'primary.main',
            bgcolor: 'background.paper',
          }}
        >
          <CardContent>
            <Typography variant="h4" component="h2" gutterBottom>
              For Techies, Companies, and Schools
            </Typography>
            <Typography variant="h3" component="div" gutterBottom color="primary">
              100% Free!
            </Typography>
            <Typography variant="body1" paragraph>
              Unlimited access to create profiles and view content.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
              onClick={() => navigate('/signup')}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>

        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{
            textAlign: 'center',
            mb: 4,
            color: 'primary.main',
          }}
        >
          Hiring Managers
        </Typography>

        <Grid container spacing={4}>
          {/* Basic Plan */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h4" component="h3" gutterBottom>
                  Basic
                </Typography>
                <Typography variant="h3" component="div" gutterBottom>
                  Free
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <Typography>30 profiles per day</Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <Typography>5 user accounts per company</Typography>
                  </ListItem>
                </List>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 'auto' }}
                >
                  Select Plan
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Pro Plan */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '2px solid',
                borderColor: 'primary.main',
                bgcolor: 'background.paper',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h4" component="h3" gutterBottom>
                  Pro
                </Typography>
                <Typography variant="h3" component="div" gutterBottom>
                  $50
                  <Typography component="span" variant="h6" color="text.secondary">
                    /month per manager
                  </Typography>
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <Typography>100 profiles per month per manager</Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <Typography>10 hiring manager accounts per company</Typography>
                  </ListItem>
                </List>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 'auto' }}
                >
                  Select Plan
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Business Edition */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h4" component="h3" gutterBottom>
                  Business Edition
                </Typography>
                <Typography variant="h3" component="div" gutterBottom>
                  Custom
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <Typography>Unlimited profile access</Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <Typography>Unlimited hiring manager accounts</Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <Typography>Priority Support</Typography>
                  </ListItem>
                </List>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 'auto' }}
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Pricing; 