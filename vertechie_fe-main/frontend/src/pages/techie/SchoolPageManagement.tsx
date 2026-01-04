/**
 * SchoolPageManagement (SMS) - User-side School Page Management
 * 
 * For users who create/own a school page to manage it
 * Similar to managing a LinkedIn School Page, Facebook Page, etc.
 * 
 * Features:
 * - School profile management (logo, cover, description)
 * - Post updates/announcements
 * - Manage alumni/students
 * - View analytics (page views, followers)
 * - Verify alumni/students
 * - Program listings
 * - Placement statistics
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  IconButton,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PostAddIcon from '@mui/icons-material/PostAdd';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Styled Components
const PageHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(4),
}));

const CoverImage = styled(Box)(({ theme }) => ({
  height: 200,
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  borderRadius: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 70% 30%, rgba(90, 200, 250, 0.3) 0%, transparent 60%)',
  },
}));

const SchoolLogo = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: '4px solid white',
  boxShadow: theme.shadows[4],
  position: 'absolute',
  bottom: -40,
  left: 32,
  backgroundColor: '#0d47a1',
}));

const StatCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, rgba(13, 71, 161, 0.05) 0%, rgba(90, 200, 250, 0.1) 100%)',
  border: '1px solid rgba(13, 71, 161, 0.1)',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: '1px solid rgba(13, 71, 161, 0.1)',
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    color: '#0d47a1',
  },
  '& .Mui-selected': {
    color: '#0d47a1',
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#0d47a1',
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const SchoolPageManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Mock school data
  const schoolData = {
    name: 'Tech University',
    tagline: 'Excellence in Technology Education',
    type: 'University',
    location: 'Boston, MA',
    website: 'www.techuniversity.edu',
    followers: 28450,
    alumni: 15420,
    currentStudents: 8340,
    programs: 45,
    pageViews: 89230,
    placementRate: 94,
  };

  // Mock alumni verification requests
  const verificationRequests = [
    { id: 1, name: 'Emily Rodriguez', email: 'emily.r@gmail.com', program: 'Computer Science', graduationYear: 2023, status: 'pending', date: '2025-12-27' },
    { id: 2, name: 'James Wilson', email: 'james.w@gmail.com', program: 'Data Science', graduationYear: 2022, status: 'pending', date: '2025-12-26' },
    { id: 3, name: 'Lisa Chen', email: 'lisa.c@gmail.com', program: 'Software Engineering', graduationYear: 2021, status: 'approved', date: '2025-12-25' },
  ];

  // Mock programs
  const programs = [
    { id: 1, name: 'Computer Science', level: "Bachelor's", duration: '4 years', students: 1240, placementRate: 96 },
    { id: 2, name: 'Data Science', level: "Master's", duration: '2 years', students: 680, placementRate: 98 },
    { id: 3, name: 'Software Engineering', level: "Bachelor's", duration: '4 years', students: 890, placementRate: 95 },
    { id: 4, name: 'Artificial Intelligence', level: "Master's", duration: '2 years', students: 420, placementRate: 99 },
  ];

  // Mock placement stats
  const placementStats = [
    { company: 'Google', hires: 45, avgSalary: '$165,000' },
    { company: 'Microsoft', hires: 38, avgSalary: '$155,000' },
    { company: 'Amazon', hires: 52, avgSalary: '$145,000' },
    { company: 'Meta', hires: 28, avgSalary: '$170,000' },
    { company: 'Apple', hires: 22, avgSalary: '$175,000' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Back Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton 
          onClick={() => window.history.back()}
          sx={{ 
            bgcolor: alpha('#0d47a1', 0.1), 
            '&:hover': { bgcolor: alpha('#0d47a1', 0.2) } 
          }}
        >
          <ArrowBackIcon sx={{ color: '#0d47a1' }} />
        </IconButton>
        <Typography variant="h4" fontWeight={700} color="#1a237e">
          School Page Management
        </Typography>
      </Box>
      
      {/* Page Header with Cover & Logo */}
      <PageHeader>
        <CoverImage>
          <IconButton
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'rgba(255,255,255,0.9)',
              '&:hover': { bgcolor: 'white' },
            }}
          >
            <CameraAltIcon />
          </IconButton>
        </CoverImage>
        <SchoolLogo>
          <SchoolIcon sx={{ fontSize: 48 }} />
        </SchoolLogo>
      </PageHeader>

      {/* School Info */}
      <Box sx={{ pl: 20, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="h4" fontWeight={700} color="#1a237e">
              {schoolData.name}
            </Typography>
            <VerifiedIcon sx={{ color: '#5AC8FA' }} />
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            {schoolData.tagline}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label={schoolData.type} size="small" sx={{ bgcolor: alpha('#0d47a1', 0.1), color: '#0d47a1' }} />
            <Chip icon={<LocationOnIcon />} label={schoolData.location} size="small" variant="outlined" />
          </Box>
        </Box>
        <Button variant="contained" startIcon={<EditIcon />} sx={{ bgcolor: '#0d47a1' }}>
          Edit Page
        </Button>
      </Box>

      {/* Stats Row */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatCard>
            <Typography variant="h4" fontWeight={700} color="#0d47a1">{schoolData.followers.toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary">Followers</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard>
            <Typography variant="h4" fontWeight={700} color="#0d47a1">{schoolData.alumni.toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary">Verified Alumni</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard>
            <Typography variant="h4" fontWeight={700} color="#0d47a1">{schoolData.programs}</Typography>
            <Typography variant="body2" color="text.secondary">Programs</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard>
            <Typography variant="h4" fontWeight={700} color="#34C759">{schoolData.placementRate}%</Typography>
            <Typography variant="body2" color="text.secondary">Placement Rate</Typography>
          </StatCard>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <StyledTabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto">
          <Tab icon={<PostAddIcon />} iconPosition="start" label="Posts" />
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Alumni Verification" />
          <Tab icon={<MenuBookIcon />} iconPosition="start" label="Programs" />
          <Tab icon={<EmojiEventsIcon />} iconPosition="start" label="Placements" />
          <Tab icon={<GroupAddIcon />} iconPosition="start" label="Page Admins" />
          <Tab icon={<AnalyticsIcon />} iconPosition="start" label="Analytics" />
          <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" />
        </StyledTabs>

        {/* Posts Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>School Updates</Typography>
              <Button variant="contained" startIcon={<PostAddIcon />} sx={{ bgcolor: '#0d47a1' }}>
                Create Post
              </Button>
            </Box>
            
            {/* Post Creator */}
            <Paper sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Share an update with your followers..."
                variant="outlined"
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                <Button variant="outlined">Add Photo</Button>
                <Button variant="contained" sx={{ bgcolor: '#0d47a1' }}>Post</Button>
              </Box>
            </Paper>

            {/* Sample Post */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#0d47a1' }}><SchoolIcon /></Avatar>
                    <Box>
                      <Typography fontWeight={600}>{schoolData.name}</Typography>
                      <Typography variant="caption" color="text.secondary">1 week ago</Typography>
                    </Box>
                  </Box>
                  <IconButton><EditIcon /></IconButton>
                </Box>
                <Typography sx={{ mb: 2 }}>
                  🎓 Congratulations to our Class of 2025! 98% placement rate with top companies including Google, Microsoft, and Amazon. We're proud of all our graduates!
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ThumbUpIcon fontSize="small" color="action" />
                    <Typography variant="body2">2,456 Likes</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <VisibilityIcon fontSize="small" color="action" />
                    <Typography variant="body2">12,890 Views</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ShareIcon fontSize="small" color="action" />
                    <Typography variant="body2">234 Shares</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        {/* Alumni Verification Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Alumni & Student Verification Requests
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Review and verify alumni and students who claim to have studied at your institution. Verified members get a badge on their profile.
            </Typography>

            <List>
              {verificationRequests.map((request) => (
                <React.Fragment key={request.id}>
                  <ListItem sx={{ bgcolor: request.status === 'pending' ? alpha('#FF9500', 0.05) : 'transparent', borderRadius: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: request.status === 'approved' ? '#34C759' : '#FF9500' }}>
                        {request.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography fontWeight={600}>{request.name}</Typography>
                          {request.status === 'approved' && <VerifiedIcon sx={{ color: '#34C759', fontSize: 18 }} />}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2">{request.program} • Class of {request.graduationYear}</Typography>
                          <Typography variant="caption" color="text.secondary">{request.email} • {request.date}</Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      {request.status === 'pending' ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button variant="contained" size="small" color="success" startIcon={<CheckCircleIcon />}>
                            Approve
                          </Button>
                          <Button variant="outlined" size="small" color="error" startIcon={<CancelIcon />}>
                            Reject
                          </Button>
                        </Box>
                      ) : (
                        <Chip label="Verified" color="success" size="small" icon={<VerifiedIcon />} />
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Box>
        </TabPanel>

        {/* Programs Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>Academic Programs</Typography>
              <Button variant="contained" startIcon={<MenuBookIcon />} sx={{ bgcolor: '#0d47a1' }}>
                Add Program
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead sx={{ bgcolor: alpha('#0d47a1', 0.05) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Program Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Level</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Students</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Placement Rate</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {programs.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell>{program.name}</TableCell>
                      <TableCell>{program.level}</TableCell>
                      <TableCell>{program.duration}</TableCell>
                      <TableCell>{program.students.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip label={`${program.placementRate}%`} size="small" color="success" />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small"><EditIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Placements Tab */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Placement Statistics</Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: alpha('#34C759', 0.1), border: '1px solid', borderColor: alpha('#34C759', 0.3) }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={700} color="#34C759">{schoolData.placementRate}%</Typography>
                    <Typography variant="body1" color="text.secondary">Overall Placement Rate</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: alpha('#0d47a1', 0.1), border: '1px solid', borderColor: alpha('#0d47a1', 0.3) }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={700} color="#0d47a1">$142K</Typography>
                    <Typography variant="body1" color="text.secondary">Average Starting Salary</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: alpha('#FF9500', 0.1), border: '1px solid', borderColor: alpha('#FF9500', 0.3) }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={700} color="#FF9500">185</Typography>
                    <Typography variant="body1" color="text.secondary">Hiring Partners</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Top Hiring Companies</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead sx={{ bgcolor: alpha('#0d47a1', 0.05) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Hires This Year</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Avg. Salary</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {placementStats.map((stat, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#0d47a1', fontSize: 14 }}>
                            {stat.company.charAt(0)}
                          </Avatar>
                          {stat.company}
                        </Box>
                      </TableCell>
                      <TableCell>{stat.hires}</TableCell>
                      <TableCell>{stat.avgSalary}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Page Admins Tab */}
        <TabPanel value={activeTab} index={4}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>Page Administrators</Typography>
              <Button variant="contained" startIcon={<PersonAddIcon />} sx={{ bgcolor: '#0d47a1' }}>
                Add Admin
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Manage who can post and edit your school page.
            </Typography>
          </Box>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={activeTab} index={5}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Page Analytics</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha('#0d47a1', 0.1) }}>
                        <VisibilityIcon sx={{ color: '#0d47a1' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight={700}>{schoolData.pageViews.toLocaleString()}</Typography>
                        <Typography variant="body2" color="text.secondary">Page Views</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon sx={{ color: '#34C759', fontSize: 18 }} />
                      <Typography variant="body2" color="#34C759">+18% this month</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha('#0d47a1', 0.1) }}>
                        <PeopleIcon sx={{ color: '#0d47a1' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight={700}>{schoolData.followers.toLocaleString()}</Typography>
                        <Typography variant="body2" color="text.secondary">Followers</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon sx={{ color: '#34C759', fontSize: 18 }} />
                      <Typography variant="body2" color="#34C759">+520 this month</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha('#0d47a1', 0.1) }}>
                        <VerifiedIcon sx={{ color: '#0d47a1' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight={700}>{schoolData.alumni.toLocaleString()}</Typography>
                        <Typography variant="body2" color="text.secondary">Verified Alumni</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon sx={{ color: '#34C759', fontSize: 18 }} />
                      <Typography variant="body2" color="#34C759">+145 this month</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={activeTab} index={6}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Page Settings</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Basic Information</Typography>
                <TextField fullWidth label="School Name" defaultValue={schoolData.name} sx={{ mb: 2 }} />
                <TextField fullWidth label="Tagline" defaultValue={schoolData.tagline} sx={{ mb: 2 }} />
                <TextField fullWidth label="Website" defaultValue={schoolData.website} sx={{ mb: 2 }} />
                <Button variant="contained" sx={{ bgcolor: '#0d47a1' }}>Save Changes</Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Visibility Settings</Typography>
                <FormControlLabel control={<Switch defaultChecked />} label="Show school in search results" />
                <FormControlLabel control={<Switch defaultChecked />} label="Allow alumni to post" />
                <FormControlLabel control={<Switch />} label="Require approval for alumni posts" />
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default SchoolPageManagement;

