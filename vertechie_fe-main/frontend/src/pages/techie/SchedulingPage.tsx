/**
 * SchedulingPage - Calendly-like Scheduling System for ATS
 * 
 * Features:
 * - Calendar integrations (Google, Microsoft, Zoom)
 * - Availability management
 * - Meeting types configuration
 * - Booking management
 * - Scheduling links
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
  Switch,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Tooltip,
  LinearProgress,
  Alert,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';

// Icons
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideocamIcon from '@mui/icons-material/Videocam';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventIcon from '@mui/icons-material/Event';
import SyncIcon from '@mui/icons-material/Sync';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShareIcon from '@mui/icons-material/Share';
import ScheduleIcon from '@mui/icons-material/Schedule';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Styled Components
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: '1px solid rgba(13, 71, 161, 0.1)',
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: '#0d47a1',
    minHeight: 56,
  },
  '& .Mui-selected': {
    color: '#0d47a1',
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#0d47a1',
    height: 3,
  },
}));

const CalendarCard = styled(Card)<{ connected?: boolean }>(({ theme, connected }) => ({
  border: connected ? '2px solid #34C759' : '1px solid rgba(13, 71, 161, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(13, 71, 161, 0.1)',
  },
}));

const MeetingTypeCard = styled(Card)<{ color?: string }>(({ theme, color }) => ({
  border: `2px solid ${color || '#0d47a1'}`,
  borderRadius: 12,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 24px ${alpha(color || '#0d47a1', 0.2)}`,
  },
}));

const TimeSlot = styled(Box)<{ active?: boolean }>(({ theme, active }) => ({
  padding: '8px 16px',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: active ? '#0d47a1' : alpha('#0d47a1', 0.05),
  color: active ? '#fff' : '#0d47a1',
  border: `1px solid ${active ? '#0d47a1' : alpha('#0d47a1', 0.2)}`,
  '&:hover': {
    backgroundColor: active ? '#0d47a1' : alpha('#0d47a1', 0.1),
  },
}));

const DayToggle = styled(ToggleButton)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '50% !important',
  '&.Mui-selected': {
    backgroundColor: '#0d47a1',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#0d47a1',
    },
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

const SchedulingPage: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [selectedDays, setSelectedDays] = useState(['1', '2', '3', '4', '5']); // Mon-Fri

  // Mock calendar connections
  const calendarConnections = [
    { id: '1', provider: 'google', name: 'Google Calendar', email: 'user@gmail.com', connected: true, synced: '5 min ago' },
    { id: '2', provider: 'microsoft', name: 'Microsoft Outlook', email: 'user@outlook.com', connected: true, synced: '10 min ago' },
    { id: '3', provider: 'zoom', name: 'Zoom', email: 'user@company.com', connected: false, synced: null },
  ];

  // Mock meeting types
  const meetingTypes = [
    {
      id: '1',
      name: '30 Minute Meeting',
      slug: '30min',
      duration: 30,
      color: '#0d47a1',
      kind: 'one_on_one',
      location: 'zoom',
      isActive: true,
      isPublic: true,
      bookings: 45,
    },
    {
      id: '2',
      name: '60 Minute Meeting',
      slug: '60min',
      duration: 60,
      color: '#5856D6',
      kind: 'one_on_one',
      location: 'google_meet',
      isActive: true,
      isPublic: true,
      bookings: 23,
    },
    {
      id: '3',
      name: 'Technical Interview',
      slug: 'tech-interview',
      duration: 45,
      color: '#FF9500',
      kind: 'one_on_one',
      location: 'zoom',
      isActive: true,
      isPublic: false,
      bookings: 12,
    },
    {
      id: '4',
      name: 'Team Round Robin',
      slug: 'team-round-robin',
      duration: 30,
      color: '#34C759',
      kind: 'round_robin',
      location: 'teams',
      isActive: false,
      isPublic: false,
      bookings: 8,
    },
  ];

  // Mock upcoming bookings
  const upcomingBookings = [
    { id: '1', title: '30 Minute Meeting with Sarah Chen', date: 'Tomorrow', time: '10:00 AM', invitee: 'Sarah Chen', email: 'sarah@example.com', location: 'Zoom' },
    { id: '2', title: 'Technical Interview with Mike Johnson', date: 'Dec 30', time: '2:00 PM', invitee: 'Mike Johnson', email: 'mike@example.com', location: 'Zoom' },
    { id: '3', title: '60 Minute Meeting with Alex Rivera', date: 'Jan 2', time: '11:30 AM', invitee: 'Alex Rivera', email: 'alex@example.com', location: 'Google Meet' },
  ];

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`https://vertechie.com/schedule/johndoe/${slug}`);
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return '🔵';
      case 'microsoft':
        return '🟦';
      case 'zoom':
        return '🔷';
      default:
        return '📅';
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'zoom':
      case 'google_meet':
      case 'teams':
        return <VideocamIcon sx={{ fontSize: 16 }} />;
      case 'phone':
        return <PhoneIcon sx={{ fontSize: 16 }} />;
      case 'in_person':
        return <LocationOnIcon sx={{ fontSize: 16 }} />;
      default:
        return <LinkIcon sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => window.history.back()}
            sx={{ 
              bgcolor: alpha('#0d47a1', 0.1), 
              '&:hover': { bgcolor: alpha('#0d47a1', 0.2) } 
            }}
          >
            <ArrowBackIcon sx={{ color: '#0d47a1' }} />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={700} color="#1a237e" sx={{ mb: 0.5 }}>
              Scheduling
            </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your calendar, availability, and meeting types
          </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<CalendarMonthIcon />}
            onClick={() => window.location.href = '/techie/calendar'}
          >
            View Calendar
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<OpenInNewIcon />}
            onClick={() => window.open('/schedule/johndoe', '_blank')}
          >
            View Public Page
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            sx={{ bgcolor: '#0d47a1' }}
            onClick={() => setShowCreateMeeting(true)}
          >
            Create Meeting Type
          </Button>
        </Box>
      </Box>

      {/* Public Scheduling Link */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, rgba(13, 71, 161, 0.05) 0%, rgba(90, 200, 250, 0.1) 100%)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
              Your Scheduling Link
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinkIcon sx={{ color: '#0d47a1', fontSize: 20 }} />
              <Typography variant="body1" color="#0d47a1" fontWeight={500}>
                vertechie.com/schedule/johndoe
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Copy Link">
              <IconButton onClick={() => navigator.clipboard.writeText('https://vertechie.com/schedule/johndoe')}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton onClick={() => setShowShareLink(true)}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Button variant="outlined" startIcon={<EditIcon />} size="small">
              Customize
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <StyledTabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab icon={<EventIcon />} iconPosition="start" label="Meeting Types" />
          <Tab icon={<ScheduleIcon />} iconPosition="start" label="Availability" />
          <Tab icon={<CalendarMonthIcon />} iconPosition="start" label="Calendar Connections" />
          <Tab icon={<AccessTimeIcon />} iconPosition="start" label="Upcoming Bookings" />
          <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" />
        </StyledTabs>

        {/* Meeting Types Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ px: 3 }}>
            <Grid container spacing={3}>
              {meetingTypes.map((meeting) => (
                <Grid item xs={12} sm={6} md={4} key={meeting.id}>
                  <MeetingTypeCard color={meeting.color}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: meeting.color }} />
                          <Typography variant="h6" fontWeight={600}>{meeting.name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {meeting.isActive ? (
                            <Chip label="Active" size="small" sx={{ bgcolor: alpha('#34C759', 0.1), color: '#34C759' }} />
                          ) : (
                            <Chip label="Inactive" size="small" sx={{ bgcolor: alpha('#8E8E93', 0.1), color: '#8E8E93' }} />
                          )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">{meeting.duration} min</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {getLocationIcon(meeting.location)}
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {meeting.location.replace('_', ' ')}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {meeting.kind === 'one_on_one' ? (
                            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          ) : (
                            <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          )}
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {meeting.kind.replace('_', ' ')}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {meeting.isPublic ? (
                            <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          ) : (
                            <VisibilityOffIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {meeting.isPublic ? 'Public' : 'Private'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                            {meeting.bookings} bookings
                          </Typography>
                        </Box>
                        <Box>
                          <Tooltip title="Copy Link">
                            <IconButton size="small" onClick={() => handleCopyLink(meeting.slug)}>
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </MeetingTypeCard>
                </Grid>
              ))}
              
              {/* Add New Card */}
              <Grid item xs={12} sm={6} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    minHeight: 200,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '2px dashed rgba(13, 71, 161, 0.3)',
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#0d47a1',
                      bgcolor: alpha('#0d47a1', 0.02),
                    }
                  }}
                  onClick={() => setShowCreateMeeting(true)}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <AddIcon sx={{ fontSize: 48, color: '#0d47a1', mb: 1 }} />
                    <Typography color="#0d47a1" fontWeight={600}>Create Meeting Type</Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Availability Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ px: 3 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Working Hours</Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    Select available days
                  </Typography>
                  <ToggleButtonGroup
                    value={selectedDays}
                    onChange={(_, newDays) => setSelectedDays(newDays)}
                    sx={{ gap: 1 }}
                  >
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                      <DayToggle key={index} value={String(index)}>
                        {day}
                      </DayToggle>
                    ))}
                  </ToggleButtonGroup>
                </Box>
                
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => (
                  <Box key={day} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, py: 1 }}>
                    <FormControlLabel
                      control={<Checkbox checked={selectedDays.includes(String(idx + 1))} />}
                      label={<Typography sx={{ width: 100 }}>{day}</Typography>}
                    />
                    <TextField
                      size="small"
                      type="time"
                      defaultValue="09:00"
                      sx={{ width: 130 }}
                    />
                    <Typography>to</Typography>
                    <TextField
                      size="small"
                      type="time"
                      defaultValue="17:00"
                      sx={{ width: 130 }}
                    />
                    <IconButton size="small" color="primary">
                      <AddIcon />
                    </IconButton>
                  </Box>
                ))}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Timezone & Preferences</Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Timezone</InputLabel>
                  <Select defaultValue="America/New_York" label="Timezone">
                    <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                    <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                    <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                    <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                    <MenuItem value="UTC">UTC</MenuItem>
                  </Select>
                </FormControl>
                
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  Buffer times
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Before meeting"
                      type="number"
                      defaultValue={0}
                      InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="After meeting"
                      type="number"
                      defaultValue={15}
                      InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }}
                    />
                  </Grid>
                </Grid>
                
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  Scheduling limits
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Minimum notice"
                      type="number"
                      defaultValue={24}
                      InputProps={{ endAdornment: <InputAdornment position="end">hours</InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Max days ahead"
                      type="number"
                      defaultValue={60}
                      InputProps={{ endAdornment: <InputAdornment position="end">days</InputAdornment> }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" sx={{ bgcolor: '#0d47a1' }}>
                Save Availability
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Calendar Connections Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ px: 3 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Connect your calendars to automatically check for conflicts and add new bookings to your calendar.
            </Alert>
            
            <Grid container spacing={3}>
              {calendarConnections.map((calendar) => (
                <Grid item xs={12} md={4} key={calendar.id}>
                  <CalendarCard connected={calendar.connected}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography variant="h4">{getProviderIcon(calendar.provider)}</Typography>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>{calendar.name}</Typography>
                          {calendar.connected && (
                            <Typography variant="body2" color="text.secondary">{calendar.email}</Typography>
                          )}
                        </Box>
                      </Box>
                      
                      {calendar.connected ? (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <CheckCircleIcon sx={{ color: '#34C759', fontSize: 18 }} />
                            <Typography variant="body2" color="#34C759">Connected</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                              Synced {calendar.synced}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="outlined" size="small" startIcon={<SyncIcon />} fullWidth>
                              Sync Now
                            </Button>
                            <Button variant="outlined" size="small" color="error">
                              Disconnect
                            </Button>
                          </Box>
                        </>
                      ) : (
                        <Button variant="contained" fullWidth sx={{ bgcolor: '#0d47a1' }}>
                          Connect
                        </Button>
                      )}
                    </CardContent>
                  </CalendarCard>
                </Grid>
              ))}
            </Grid>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Video Conferencing</Typography>
            <Grid container spacing={3}>
              {[
                { name: 'Zoom', icon: '🔷', connected: true },
                { name: 'Google Meet', icon: '🟢', connected: true },
                { name: 'Microsoft Teams', icon: '🟣', connected: false },
              ].map((service) => (
                <Grid item xs={12} md={4} key={service.name}>
                  <Card sx={{ border: service.connected ? '2px solid #34C759' : '1px solid rgba(0,0,0,0.1)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h5">{service.icon}</Typography>
                          <Typography fontWeight={600}>{service.name}</Typography>
                        </Box>
                        {service.connected ? (
                          <Chip label="Connected" size="small" sx={{ bgcolor: alpha('#34C759', 0.1), color: '#34C759' }} />
                        ) : (
                          <Button size="small" variant="outlined">Connect</Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>

        {/* Upcoming Bookings Tab */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ px: 3 }}>
            <List>
              {upcomingBookings.map((booking, idx) => (
                <React.Fragment key={booking.id}>
                  <ListItem sx={{ py: 2, px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#0d47a1' }}>{booking.invitee.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography fontWeight={600}>{booking.title}</Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {booking.date} at {booking.time}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">•</Typography>
                          <Typography variant="body2" color="text.secondary">{booking.email}</Typography>
                          <Typography variant="body2" color="text.secondary">•</Typography>
                          <Typography variant="body2" color="#0d47a1">{booking.location}</Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                        Reschedule
                      </Button>
                      <Button variant="outlined" size="small" color="error">
                        Cancel
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {idx < upcomingBookings.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={activeTab} index={4}>
          <Box sx={{ px: 3 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Branding</Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Primary Color</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {['#0d47a1', '#5856D6', '#34C759', '#FF9500', '#FF2D55', '#5AC8FA'].map((color) => (
                      <Box
                        key={color}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: color,
                          cursor: 'pointer',
                          border: '3px solid transparent',
                          '&:hover': { borderColor: alpha(color, 0.5) },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Show VerTechie branding on scheduling page"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Notifications</Typography>
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Email confirmation to invitee"
                  sx={{ display: 'block', mb: 1 }}
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Email notification to me"
                  sx={{ display: 'block', mb: 1 }}
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Send reminder 24 hours before"
                  sx={{ display: 'block', mb: 1 }}
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Send reminder 1 hour before"
                  sx={{ display: 'block', mb: 1 }}
                />
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>

      {/* Create Meeting Type Dialog */}
      <Dialog open={showCreateMeeting} onClose={() => setShowCreateMeeting(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Meeting Type</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField fullWidth label="Meeting Name" placeholder="e.g., 30 Minute Meeting" sx={{ mb: 3 }} />
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TextField fullWidth label="Duration" type="number" defaultValue={30} InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }} />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Meeting Type</InputLabel>
                  <Select defaultValue="one_on_one" label="Meeting Type">
                    <MenuItem value="one_on_one">One-on-One</MenuItem>
                    <MenuItem value="group">Group</MenuItem>
                    <MenuItem value="round_robin">Round Robin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Location</InputLabel>
              <Select defaultValue="zoom" label="Location">
                <MenuItem value="zoom">Zoom</MenuItem>
                <MenuItem value="google_meet">Google Meet</MenuItem>
                <MenuItem value="teams">Microsoft Teams</MenuItem>
                <MenuItem value="phone">Phone Call</MenuItem>
                <MenuItem value="in_person">In Person</MenuItem>
              </Select>
            </FormControl>
            
            <TextField fullWidth label="Description" multiline rows={3} placeholder="Brief description of this meeting type" sx={{ mb: 3 }} />
            
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Color</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['#0d47a1', '#5856D6', '#34C759', '#FF9500', '#FF2D55', '#5AC8FA'].map((color) => (
                <Box
                  key={color}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: color,
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateMeeting(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#0d47a1' }}>Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SchedulingPage;

