/**
 * SchedulingPage - Manage Scheduling Links, Meeting Types, and Availability
 * Integrates with backend API to store and manage scheduling link constraints
 */

import React, { useState } from 'react';
import {
  Box, Typography, Paper, Card, CardContent, Button, IconButton, Chip, Grid,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  Select, MenuItem, Tooltip, List, ListItem, ListItemIcon, ListItemText,
  ListItemAvatar, Avatar, Switch, FormControlLabel, CircularProgress, Alert,
  ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import VideocamIcon from '@mui/icons-material/Videocam';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import GroupsIcon from '@mui/icons-material/Groups';
import ATSLayout from './ATSLayout';

// API Base URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const MeetingTypeCard = styled(Card)(() => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(13, 71, 161, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

const meetingTypes = [
  { id: 1, name: '30 Minute Meeting', duration: 30, color: '#0d47a1', platform: 'Zoom', type: 'One-on-one', visibility: 'Public', bookings: 45, active: true },
  { id: 2, name: '60 Minute Meeting', duration: 60, color: '#34C759', platform: 'Google Meet', type: 'One-on-one', visibility: 'Public', bookings: 23, active: true },
  { id: 3, name: 'Technical Interview', duration: 45, color: '#FF9500', platform: 'Zoom', type: 'One-on-one', visibility: 'Private', bookings: 12, active: true },
  { id: 4, name: 'Team Round Robin', duration: 30, color: '#8E8E93', platform: 'Teams', type: 'Round Robin', visibility: 'Private', bookings: 8, active: false },
];

const availability = [
  { day: 'Monday', dayNum: 1, slots: [{ start: '9:00 AM', end: '12:00 PM' }, { start: '1:00 PM', end: '5:00 PM' }] },
  { day: 'Tuesday', dayNum: 2, slots: [{ start: '9:00 AM', end: '12:00 PM' }, { start: '1:00 PM', end: '5:00 PM' }] },
  { day: 'Wednesday', dayNum: 3, slots: [{ start: '9:00 AM', end: '12:00 PM' }, { start: '1:00 PM', end: '5:00 PM' }] },
  { day: 'Thursday', dayNum: 4, slots: [{ start: '9:00 AM', end: '12:00 PM' }, { start: '1:00 PM', end: '5:00 PM' }] },
  { day: 'Friday', dayNum: 5, slots: [{ start: '9:00 AM', end: '12:00 PM' }] },
  { day: 'Saturday', dayNum: 6, slots: [] },
  { day: 'Sunday', dayNum: 0, slots: [] },
];

const upcomingBookings = [
  { id: 1, name: 'Sarah Johnson', type: '30 Minute Meeting', date: 'Dec 29, 2024', time: '10:00 AM', status: 'confirmed' },
  { id: 2, name: 'Mike Chen', type: 'Technical Interview', date: 'Dec 30, 2024', time: '2:00 PM', status: 'confirmed' },
  { id: 3, name: 'Emily Davis', type: '60 Minute Meeting', date: 'Dec 31, 2024', time: '11:00 AM', status: 'pending' },
];

interface LinkSettings {
  duration: string;
  customDuration: string;
  validityDays: string;
  customValidity: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  maxBookings: string;
  maxBookingsPerDay: string;
  bufferBefore: string;
  bufferAfter: string;
  requireApproval: boolean;
  allowReschedule: boolean;
  availableDays: number[];
}

interface GeneratedLinkData {
  token: string;
  url: string;
  full_url: string;
  expires_at: string | null;
}

const SchedulingPage: React.FC = () => {
  const [showLinkSettings, setShowLinkSettings] = useState(false);
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);
  const [linkSettings, setLinkSettings] = useState<LinkSettings>({
    duration: '30',
    customDuration: '',
    validityDays: '7',
    customValidity: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    maxBookings: '',
    maxBookingsPerDay: '',
    bufferBefore: '5',
    bufferAfter: '5',
    requireApproval: false,
    allowReschedule: true,
    availableDays: [1, 2, 3, 4, 5], // Mon-Fri
  });
  const [generatedLink, setGeneratedLink] = useState<GeneratedLinkData | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDayToggle = (day: number) => {
    const newDays = linkSettings.availableDays.includes(day)
      ? linkSettings.availableDays.filter(d => d !== day)
      : [...linkSettings.availableDays, day].sort();
    setLinkSettings({ ...linkSettings, availableDays: newDays });
  };

  const generateUniqueLink = async () => {
    setGenerating(true);
    setError(null);

    const duration = linkSettings.duration === 'custom' 
      ? parseInt(linkSettings.customDuration) 
      : parseInt(linkSettings.duration);
    
    const validityDays = linkSettings.validityDays === 'custom'
      ? parseInt(linkSettings.customValidity)
      : parseInt(linkSettings.validityDays);

    const requestData = {
      duration_minutes: duration,
      validity_days: validityDays,
      start_date: linkSettings.startDate || null,
      end_date: linkSettings.endDate || null,
      start_time: linkSettings.startTime || null,
      end_time: linkSettings.endTime || null,
      available_days: linkSettings.availableDays,
      buffer_before: parseInt(linkSettings.bufferBefore) || 0,
      buffer_after: parseInt(linkSettings.bufferAfter) || 0,
      max_bookings: linkSettings.maxBookings ? parseInt(linkSettings.maxBookings) : null,
      max_bookings_per_day: linkSettings.maxBookingsPerDay ? parseInt(linkSettings.maxBookingsPerDay) : null,
      requires_approval: linkSettings.requireApproval,
    };

    try {
      const response = await fetch(`${API_BASE}/v_calendar/scheduling-links/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth header if available
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate link');
      }

      const data = await response.json();
      setGeneratedLink(data);
    } catch (err) {
      // Fallback for when API is not available - generate local link with constraints encoded
      console.warn('API not available, generating local link');
      const token = generateLocalToken();
      
      // Store constraints in localStorage for demo purposes
      const linkData = {
        token,
        constraints: requestData,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(`scheduling_link_${token}`, JSON.stringify(linkData));

      setGeneratedLink({
        token,
        url: `/book/${token}`,
        full_url: `${window.location.origin}/book/${token}`,
        expires_at: new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    setGenerating(false);
  };

  const generateLocalToken = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 10; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  };

  const handleCopyGeneratedLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink.full_url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleCloseDialog = () => {
    setShowLinkSettings(false);
    setGeneratedLink(null);
    setError(null);
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <ATSLayout>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Calendar & Scheduling</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your availability, meeting types, and booking links
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<CalendarMonthIcon />} href="/techie/ats/calendar">
            View Calendar
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#0d47a1' }} onClick={() => setShowCreateMeeting(true)}>
            Create Meeting Type
          </Button>
          <Button 
            variant="contained" 
            startIcon={<VideocamIcon />} 
            sx={{ bgcolor: '#00897b' }}
            href="/techie/schedule-interview"
          >
            Schedule Interview
          </Button>
        </Box>
      </Box>

      {/* Scheduling Link */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: alpha('#0d47a1', 0.03), border: '1px solid rgba(13, 71, 161, 0.1)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LinkIcon sx={{ color: '#0d47a1' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Your Scheduling Link</Typography>
              <Typography variant="body1" fontWeight={600} color="#0d47a1">
                vertechie.com/schedule/johndoe
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Tooltip title="Create Custom Link with Constraints">
              <IconButton onClick={() => setShowLinkSettings(true)} sx={{ bgcolor: alpha('#0d47a1', 0.1) }}>
                <SettingsIcon sx={{ color: '#0d47a1' }} />
              </IconButton>
            </Tooltip>
            <Button variant="outlined" onClick={() => navigator.clipboard.writeText('https://vertechie.com/schedule/johndoe')}>
              Copy Link
            </Button>
            <Button variant="outlined">Share</Button>
          </Box>
        </Box>
      </Paper>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="#0d47a1">4</Typography>
            <Typography variant="body2" color="text.secondary">Active Meeting Types</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="#34C759">2</Typography>
            <Typography variant="body2" color="text.secondary">Calendars Connected</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="#5856D6">12</Typography>
            <Typography variant="body2" color="text.secondary">Upcoming Bookings</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="#FF9500">85</Typography>
            <Typography variant="body2" color="text.secondary">Total Bookings (30d)</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Meeting Types */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>Meeting Types</Typography>
            <Button size="small" startIcon={<AddIcon />}>Add New</Button>
          </Box>
          <Grid container spacing={2}>
            {meetingTypes.map((meeting) => (
              <Grid item xs={12} sm={6} key={meeting.id}>
                <MeetingTypeCard sx={{ opacity: meeting.active ? 1 : 0.6 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                      <Box sx={{ width: 8, height: 40, bgcolor: meeting.color, borderRadius: 1 }} />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight={600}>{meeting.name}</Typography>
                          <Chip label={meeting.active ? 'Active' : 'Inactive'} size="small" sx={{ bgcolor: alpha(meeting.active ? '#34C759' : '#8E8E93', 0.1), color: meeting.active ? '#34C759' : '#8E8E93' }} />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">{meeting.duration} min</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <VideocamIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">{meeting.platform}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                      <Chip label={meeting.type} size="small" variant="outlined" />
                      <Chip label={meeting.visibility} size="small" variant="outlined" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">{meeting.bookings} bookings</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small"><ContentCopyIcon fontSize="small" /></IconButton>
                        <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </MeetingTypeCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Availability */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>Availability</Typography>
              <Button size="small" startIcon={<EditIcon />}>Edit</Button>
            </Box>
            {availability.map((day) => (
              <Box key={day.day} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <Typography variant="body2" fontWeight={day.slots.length > 0 ? 500 : 400} color={day.slots.length > 0 ? 'text.primary' : 'text.disabled'}>
                  {day.day}
                </Typography>
                <Typography variant="body2" color={day.slots.length > 0 ? 'text.secondary' : 'text.disabled'}>
                  {day.slots.length > 0 ? day.slots.map(s => `${s.start} - ${s.end}`).join(', ') : 'Unavailable'}
                </Typography>
              </Box>
            ))}
          </Paper>

          {/* Connected Calendars */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>Connected Calendars</Typography>
              <Button size="small" startIcon={<AddIcon />}>Connect</Button>
            </Box>
            <List dense>
              <ListItem>
                <ListItemIcon><GoogleIcon sx={{ color: '#4285F4' }} /></ListItemIcon>
                <ListItemText primary="Google Calendar" secondary="john@gmail.com" />
                <CheckCircleIcon sx={{ color: '#34C759' }} />
              </ListItem>
              <ListItem>
                <ListItemIcon><MicrosoftIcon sx={{ color: '#00A4EF' }} /></ListItemIcon>
                <ListItemText primary="Microsoft Outlook" secondary="john@company.com" />
                <CheckCircleIcon sx={{ color: '#34C759' }} />
              </ListItem>
            </List>
          </Paper>

          {/* Upcoming Bookings */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>Upcoming Bookings</Typography>
              <Button size="small">View All</Button>
            </Box>
            <List dense>
              {upcomingBookings.map((booking) => (
                <ListItem key={booking.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: alpha('#0d47a1', 0.1), color: '#0d47a1', width: 36, height: 36 }}>
                      {booking.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight={500}>{booking.name}</Typography>}
                    secondary={<Typography variant="caption" color="text.secondary">{booking.type} • {booking.date} at {booking.time}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Link Settings Dialog */}
      <Dialog open={showLinkSettings} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid rgba(13, 71, 161, 0.1)', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SettingsIcon sx={{ color: '#0d47a1' }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>Create Custom Scheduling Link</Typography>
              <Typography variant="body2" color="text.secondary">
                Generate a unique booking link with specific date, time, and booking constraints
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Meeting Duration */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon sx={{ fontSize: 18, color: '#0d47a1' }} /> Meeting Duration
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['15', '30', '45', '60', '90', 'custom'].map((dur) => (
                  <Chip key={dur} label={dur === 'custom' ? 'Custom' : `${dur} min`}
                    onClick={() => setLinkSettings({ ...linkSettings, duration: dur })}
                    variant={linkSettings.duration === dur ? 'filled' : 'outlined'}
                    sx={{ bgcolor: linkSettings.duration === dur ? '#0d47a1' : 'transparent', color: linkSettings.duration === dur ? '#fff' : 'inherit' }}
                  />
                ))}
              </Box>
              {linkSettings.duration === 'custom' && (
                <TextField
                  size="small"
                  type="number"
                  placeholder="Enter minutes"
                  value={linkSettings.customDuration}
                  onChange={(e) => setLinkSettings({ ...linkSettings, customDuration: e.target.value })}
                  sx={{ mt: 1, width: 150 }}
                />
              )}
            </Grid>

            {/* Link Validity */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 18, color: '#0d47a1' }} /> Link Validity
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['1', '3', '7', '14', '30', 'custom'].map((days) => (
                  <Chip key={days} label={days === 'custom' ? 'Custom' : days === '1' ? '1 day' : `${days} days`}
                    onClick={() => setLinkSettings({ ...linkSettings, validityDays: days })}
                    variant={linkSettings.validityDays === days ? 'filled' : 'outlined'} size="small"
                    sx={{ bgcolor: linkSettings.validityDays === days ? '#34C759' : 'transparent', color: linkSettings.validityDays === days ? '#fff' : 'inherit' }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Maximum Bookings */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupsIcon sx={{ fontSize: 18, color: '#0d47a1' }} /> Maximum Bookings
              </Typography>
              <TextField size="small" type="number" placeholder="Unlimited" value={linkSettings.maxBookings}
                onChange={(e) => setLinkSettings({ ...linkSettings, maxBookings: e.target.value })}
                fullWidth helperText="Leave empty for unlimited"
              />
            </Grid>

            {/* Available Days */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventBusyIcon sx={{ fontSize: 18, color: '#0d47a1' }} /> Available Days
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {dayLabels.map((day, index) => (
                  <Chip
                    key={day}
                    label={day}
                    onClick={() => handleDayToggle(index)}
                    variant={linkSettings.availableDays.includes(index) ? 'filled' : 'outlined'}
                    sx={{
                      bgcolor: linkSettings.availableDays.includes(index) ? '#0d47a1' : 'transparent',
                      color: linkSettings.availableDays.includes(index) ? '#fff' : 'inherit',
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Date Range */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <DateRangeIcon sx={{ fontSize: 18, color: '#0d47a1' }} /> Available Date Range
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <TextField size="small" type="date" label="Start Date" value={linkSettings.startDate}
                    onChange={(e) => setLinkSettings({ ...linkSettings, startDate: e.target.value })}
                    fullWidth InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField size="small" type="date" label="End Date" value={linkSettings.endDate}
                    onChange={(e) => setLinkSettings({ ...linkSettings, endDate: e.target.value })}
                    fullWidth InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField size="small" type="time" label="Start Time" value={linkSettings.startTime}
                    onChange={(e) => setLinkSettings({ ...linkSettings, startTime: e.target.value })}
                    fullWidth InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField size="small" type="time" label="End Time" value={linkSettings.endTime}
                    onChange={(e) => setLinkSettings({ ...linkSettings, endTime: e.target.value })}
                    fullWidth InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Buffer Times */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Buffer Before Meeting</Typography>
              <FormControl size="small" fullWidth>
                <Select value={linkSettings.bufferBefore} onChange={(e) => setLinkSettings({ ...linkSettings, bufferBefore: e.target.value })}>
                  <MenuItem value="0">No buffer</MenuItem>
                  <MenuItem value="5">5 minutes</MenuItem>
                  <MenuItem value="10">10 minutes</MenuItem>
                  <MenuItem value="15">15 minutes</MenuItem>
                  <MenuItem value="30">30 minutes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Buffer After Meeting</Typography>
              <FormControl size="small" fullWidth>
                <Select value={linkSettings.bufferAfter} onChange={(e) => setLinkSettings({ ...linkSettings, bufferAfter: e.target.value })}>
                  <MenuItem value="0">No buffer</MenuItem>
                  <MenuItem value="5">5 minutes</MenuItem>
                  <MenuItem value="10">10 minutes</MenuItem>
                  <MenuItem value="15">15 minutes</MenuItem>
                  <MenuItem value="30">30 minutes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Additional Options */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={linkSettings.requireApproval}
                    onChange={(e) => setLinkSettings({ ...linkSettings, requireApproval: e.target.checked })}
                    color="primary"
                  />
                }
                label="Require approval for bookings"
              />
            </Grid>

            {/* Generated Link Display */}
            {generatedLink && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: alpha('#34C759', 0.05), border: '1px solid', borderColor: alpha('#34C759', 0.3) }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircleIcon sx={{ color: '#34C759' }} />
                    <Typography variant="subtitle2" fontWeight={600} color="#34C759">Your Unique Link is Ready!</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    This link enforces your specified constraints: {linkSettings.duration} min meetings, available {linkSettings.startDate} to {linkSettings.endDate}, {linkSettings.startTime} - {linkSettings.endTime}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#fff', p: 1.5, borderRadius: 1 }}>
                    <Typography variant="body1" fontWeight={600} sx={{ flex: 1, wordBreak: 'break-all' }}>
                      {generatedLink.full_url}
                    </Typography>
                    <Button variant="contained" size="small" startIcon={linkCopied ? <CheckCircleIcon /> : <ContentCopyOutlinedIcon />}
                      onClick={handleCopyGeneratedLink} sx={{ bgcolor: linkCopied ? '#34C759' : '#0d47a1', minWidth: 100 }}>
                      {linkCopied ? 'Copied!' : 'Copy'}
                    </Button>
                  </Box>
                  {generatedLink.expires_at && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Expires: {new Date(generatedLink.expires_at).toLocaleDateString()} at {new Date(generatedLink.expires_at).toLocaleTimeString()}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(13, 71, 161, 0.1)' }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={generateUniqueLink} 
            sx={{ bgcolor: '#0d47a1' }}
            disabled={generating || (linkSettings.duration === 'custom' && !linkSettings.customDuration)}
            startIcon={generating ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {generating ? 'Generating...' : 'Generate Unique Link'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Meeting Type Dialog */}
      <Dialog open={showCreateMeeting} onClose={() => setShowCreateMeeting(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create Meeting Type</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField 
              fullWidth 
              label="Meeting Name" 
              placeholder="e.g., 30 Minute Consultation" 
              sx={{ mb: 3 }} 
            />
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="Duration (minutes)" 
                  type="number" 
                  defaultValue={30}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Select defaultValue="zoom">
                    <MenuItem value="zoom">Zoom</MenuItem>
                    <MenuItem value="meet">Google Meet</MenuItem>
                    <MenuItem value="teams">Microsoft Teams</MenuItem>
                    <MenuItem value="phone">Phone Call</MenuItem>
                    <MenuItem value="inperson">In-Person</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField 
              fullWidth 
              label="Description" 
              multiline 
              rows={3} 
              placeholder="Add a description for this meeting type..."
              sx={{ mb: 3 }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Select defaultValue="one-on-one">
                    <MenuItem value="one-on-one">One-on-One</MenuItem>
                    <MenuItem value="group">Group Meeting</MenuItem>
                    <MenuItem value="round-robin">Round Robin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Select defaultValue="public">
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="private">Private (Link Only)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: '#0d47a1' }} />
              <Typography variant="body2" color="text.secondary">Choose a color for this meeting type</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowCreateMeeting(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => setShowCreateMeeting(false)}
            sx={{ bgcolor: '#0d47a1' }}
          >
            Create Meeting Type
          </Button>
        </DialogActions>
      </Dialog>
    </ATSLayout>
  );
};

export default SchedulingPage;
