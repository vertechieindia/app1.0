/**
 * CompanyPageManagement (CMS) - User-side Company Page Management
 * 
 * For users who create/own a company page to manage it
 * Similar to managing a LinkedIn Company Page, Facebook Page, etc.
 * 
 * Features:
 * - Company profile management (logo, cover, description)
 * - Post updates/announcements
 * - Manage team members/employees
 * - View analytics (page views, followers)
 * - Verify employees
 * - Job postings
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
  Badge,
  LinearProgress,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import BusinessIcon from '@mui/icons-material/Business';
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
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
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
    background: 'radial-gradient(circle at 30% 50%, rgba(90, 200, 250, 0.3) 0%, transparent 60%)',
  },
}));

const CompanyLogo = styled(Avatar)(({ theme }) => ({
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

const CompanyPageManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openJobDialog, setOpenJobDialog] = useState(false);

  // Mock company data
  const companyData = {
    name: 'TechCorp Solutions',
    tagline: 'Innovating the Future of Technology',
    industry: 'Information Technology',
    size: '501-1000 employees',
    location: 'San Francisco, CA',
    website: 'www.techcorpsolutions.com',
    followers: 12450,
    employees: 847,
    openJobs: 24,
    pageViews: 45230,
    profileViews: 8920,
    postEngagement: 3240,
  };

  // Mock employee verification requests
  const verificationRequests = [
    { id: 1, name: 'John Doe', email: 'john.doe@techcorp.com', role: 'Software Engineer', status: 'pending', date: '2025-12-27' },
    { id: 2, name: 'Sarah Smith', email: 'sarah.s@techcorp.com', role: 'Product Manager', status: 'pending', date: '2025-12-26' },
    { id: 3, name: 'Mike Chen', email: 'mike.c@techcorp.com', role: 'UX Designer', status: 'approved', date: '2025-12-25' },
  ];

  // Mock team members with admin access
  const teamMembers = [
    { id: 1, name: 'Alice Johnson', role: 'Page Admin', avatar: '', canPost: true, canManage: true },
    { id: 2, name: 'Bob Williams', role: 'Content Editor', avatar: '', canPost: true, canManage: false },
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
          Company Page Management
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
        <CompanyLogo>
          <BusinessIcon sx={{ fontSize: 48 }} />
        </CompanyLogo>
      </PageHeader>

      {/* Company Info */}
      <Box sx={{ pl: 20, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="h4" fontWeight={700} color="#1a237e">
              {companyData.name}
            </Typography>
            <VerifiedIcon sx={{ color: '#5AC8FA' }} />
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            {companyData.tagline}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label={companyData.industry} size="small" sx={{ bgcolor: alpha('#0d47a1', 0.1), color: '#0d47a1' }} />
            <Chip label={companyData.size} size="small" variant="outlined" />
            <Chip label={companyData.location} size="small" variant="outlined" />
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
            <Typography variant="h4" fontWeight={700} color="#0d47a1">{companyData.followers.toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary">Followers</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard>
            <Typography variant="h4" fontWeight={700} color="#0d47a1">{companyData.employees}</Typography>
            <Typography variant="body2" color="text.secondary">Verified Employees</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard>
            <Typography variant="h4" fontWeight={700} color="#0d47a1">{companyData.openJobs}</Typography>
            <Typography variant="body2" color="text.secondary">Open Jobs</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard>
            <Typography variant="h4" fontWeight={700} color="#0d47a1">{companyData.pageViews.toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary">Page Views</Typography>
          </StatCard>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <StyledTabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab icon={<PostAddIcon />} iconPosition="start" label="Posts" />
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Employee Verification" />
          <Tab icon={<GroupAddIcon />} iconPosition="start" label="Page Admins" />
          <Tab icon={<WorkIcon />} iconPosition="start" label="Jobs" />
          <Tab icon={<AnalyticsIcon />} iconPosition="start" label="Analytics" />
          <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" />
        </StyledTabs>

        {/* Posts Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>Company Updates</Typography>
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
                    <Avatar sx={{ bgcolor: '#0d47a1' }}><BusinessIcon /></Avatar>
                    <Box>
                      <Typography fontWeight={600}>{companyData.name}</Typography>
                      <Typography variant="caption" color="text.secondary">2 days ago</Typography>
                    </Box>
                  </Box>
                  <IconButton><EditIcon /></IconButton>
                </Box>
                <Typography sx={{ mb: 2 }}>
                  We're excited to announce our new AI-powered platform! 🚀 Join us as we revolutionize the tech industry.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ThumbUpIcon fontSize="small" color="action" />
                    <Typography variant="body2">1,234 Likes</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <VisibilityIcon fontSize="small" color="action" />
                    <Typography variant="body2">5,678 Views</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ShareIcon fontSize="small" color="action" />
                    <Typography variant="body2">89 Shares</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        {/* Employee Verification Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Employee Verification Requests
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Review and verify employees who claim to work at your company. Verified employees get a badge on their profile.
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
                          <Typography variant="body2">{request.role}</Typography>
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

        {/* Page Admins Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>Page Administrators</Typography>
              <Button variant="contained" startIcon={<PersonAddIcon />} sx={{ bgcolor: '#0d47a1' }}>
                Add Admin
              </Button>
            </Box>

            <List>
              {teamMembers.map((member) => (
                <React.Fragment key={member.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#0d47a1' }}>{member.name.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={member.name}
                      secondary={member.role}
                    />
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <FormControlLabel
                        control={<Switch checked={member.canPost} size="small" />}
                        label="Can Post"
                      />
                      <FormControlLabel
                        control={<Switch checked={member.canManage} size="small" />}
                        label="Full Access"
                      />
                      <IconButton color="error" size="small">
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Box>
        </TabPanel>

        {/* Jobs Tab */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>Job Postings</Typography>
              <Button 
                variant="contained" 
                startIcon={<WorkIcon />} 
                sx={{ bgcolor: '#0d47a1' }}
                onClick={() => setOpenJobDialog(true)}
              >
                Post New Job
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              You have {companyData.openJobs} active job postings. Manage your job listings here.
            </Typography>
            
            {/* Post New Job Dialog */}
            <Dialog open={openJobDialog} onClose={() => setOpenJobDialog(false)} maxWidth="md" fullWidth>
              <DialogTitle sx={{ fontWeight: 700 }}>Post New Job</DialogTitle>
              <DialogContent sx={{ pt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Job Title *" placeholder="e.g., Senior Software Engineer" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Department" placeholder="e.g., Engineering" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Location" placeholder="e.g., Remote" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={4} label="Job Description" />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenJobDialog(false)}>Cancel</Button>
                <Button variant="contained" onClick={() => setOpenJobDialog(false)} sx={{ bgcolor: '#0d47a1' }}>
                  Post Job
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={activeTab} index={4}>
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
                        <Typography variant="h5" fontWeight={700}>{companyData.pageViews.toLocaleString()}</Typography>
                        <Typography variant="body2" color="text.secondary">Page Views</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon sx={{ color: '#34C759', fontSize: 18 }} />
                      <Typography variant="body2" color="#34C759">+12% this week</Typography>
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
                        <Typography variant="h5" fontWeight={700}>{companyData.followers.toLocaleString()}</Typography>
                        <Typography variant="body2" color="text.secondary">Followers</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon sx={{ color: '#34C759', fontSize: 18 }} />
                      <Typography variant="body2" color="#34C759">+245 this month</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha('#0d47a1', 0.1) }}>
                        <ThumbUpIcon sx={{ color: '#0d47a1' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight={700}>{companyData.postEngagement.toLocaleString()}</Typography>
                        <Typography variant="body2" color="text.secondary">Engagements</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon sx={{ color: '#34C759', fontSize: 18 }} />
                      <Typography variant="body2" color="#34C759">+8% this week</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={activeTab} index={5}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Page Settings</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Basic Information</Typography>
                <TextField fullWidth label="Company Name" defaultValue={companyData.name} sx={{ mb: 2 }} />
                <TextField fullWidth label="Tagline" defaultValue={companyData.tagline} sx={{ mb: 2 }} />
                <TextField fullWidth label="Website" defaultValue={companyData.website} sx={{ mb: 2 }} />
                <Button variant="contained" sx={{ bgcolor: '#0d47a1' }}>Save Changes</Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Visibility Settings</Typography>
                <FormControlLabel control={<Switch defaultChecked />} label="Show company in search results" />
                <FormControlLabel control={<Switch defaultChecked />} label="Allow employees to post" />
                <FormControlLabel control={<Switch />} label="Require approval for employee posts" />
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default CompanyPageManagement;

