/**
 * InterviewsPage - Manage Interview Schedules
 */

import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Chip, IconButton, Button, Grid,
  Tabs, Tab, List, ListItem, ListItemAvatar, ListItemText, Divider, AvatarGroup,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import VideocamIcon from '@mui/icons-material/Videocam';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ATSLayout from './ATSLayout';

const InterviewCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(13, 71, 161, 0.15)',
  },
}));

const interviews = {
  today: [
    { id: 1, candidate: 'Sarah Johnson', role: 'Senior React Developer', time: '10:00 AM - 11:00 AM', type: 'Technical', interviewers: ['John Doe', 'Jane Smith'], status: 'upcoming', platform: 'Zoom' },
    { id: 2, candidate: 'Mike Chen', role: 'Senior React Developer', time: '2:00 PM - 2:45 PM', type: 'HR Round', interviewers: ['HR Team'], status: 'upcoming', platform: 'Google Meet' },
  ],
  upcoming: [
    { id: 3, candidate: 'Emily Davis', role: 'UX Designer', time: 'Dec 30, 10:00 AM', type: 'Portfolio Review', interviewers: ['Design Lead'], status: 'scheduled', platform: 'Zoom' },
    { id: 4, candidate: 'Alex Rivera', role: 'Product Manager', time: 'Dec 30, 3:00 PM', type: 'Final Round', interviewers: ['CEO', 'VP Product'], status: 'scheduled', platform: 'Teams' },
    { id: 5, candidate: 'Jordan Lee', role: 'DevOps Engineer', time: 'Jan 2, 11:00 AM', type: 'Technical', interviewers: ['Engineering Lead'], status: 'scheduled', platform: 'Zoom' },
  ],
  completed: [
    { id: 6, candidate: 'Taylor Smith', role: 'UX Designer', time: 'Dec 25, 2:00 PM', type: 'Technical', result: 'passed', feedback: 'Strong design skills' },
    { id: 7, candidate: 'Chris Brown', role: 'DevOps Engineer', time: 'Dec 24, 11:00 AM', type: 'HR Round', result: 'passed', feedback: 'Good culture fit' },
    { id: 8, candidate: 'Morgan Williams', role: 'Senior React Developer', time: 'Dec 23, 3:00 PM', type: 'Technical', result: 'failed', feedback: 'Needs more experience' },
  ],
};

const InterviewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ATSLayout>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>Interview Schedule</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#0d47a1' }}>
          Schedule Interview
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label={`Today (${interviews.today.length})`} />
        <Tab label={`Upcoming (${interviews.upcoming.length})`} />
        <Tab label={`Completed (${interviews.completed.length})`} />
      </Tabs>

      {/* Today's Interviews */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {interviews.today.map((interview) => (
            <Grid item xs={12} md={6} key={interview.id}>
              <InterviewCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar sx={{ bgcolor: alpha('#0d47a1', 0.1), color: '#0d47a1', width: 48, height: 48 }}>
                        {interview.candidate.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>{interview.candidate}</Typography>
                        <Typography variant="body2" color="text.secondary">{interview.role}</Typography>
                      </Box>
                    </Box>
                    <IconButton size="small"><MoreVertIcon /></IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <Chip icon={<AccessTimeIcon />} label={interview.time} size="small" />
                    <Chip label={interview.type} size="small" variant="outlined" />
                    <Chip icon={<VideocamIcon />} label={interview.platform} size="small" sx={{ bgcolor: alpha('#34C759', 0.1), color: '#34C759' }} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {interview.interviewers.join(', ')}
                      </Typography>
                    </Box>
                    <Button size="small" variant="contained" startIcon={<VideocamIcon />} sx={{ bgcolor: '#0d47a1' }}>
                      Join Call
                    </Button>
                  </Box>
                </CardContent>
              </InterviewCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upcoming Interviews */}
      {activeTab === 1 && (
        <List>
          {interviews.upcoming.map((interview, idx) => (
            <React.Fragment key={interview.id}>
              <ListItem sx={{ bgcolor: '#fff', borderRadius: 2, mb: 1 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: alpha('#5856D6', 0.1), color: '#5856D6' }}>
                    {interview.candidate.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography fontWeight={600}>{interview.candidate}</Typography>}
                  secondary={
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Chip icon={<CalendarTodayIcon />} label={interview.time} size="small" />
                      <Chip label={interview.type} size="small" variant="outlined" />
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined">Reschedule</Button>
                  <Button size="small" variant="contained" sx={{ bgcolor: '#0d47a1' }}>Details</Button>
                </Box>
              </ListItem>
              {idx < interviews.upcoming.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Completed Interviews */}
      {activeTab === 2 && (
        <List>
          {interviews.completed.map((interview, idx) => (
            <React.Fragment key={interview.id}>
              <ListItem sx={{ bgcolor: '#fff', borderRadius: 2, mb: 1 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: alpha(interview.result === 'passed' ? '#34C759' : '#FF3B30', 0.1), color: interview.result === 'passed' ? '#34C759' : '#FF3B30' }}>
                    {interview.result === 'passed' ? <CheckCircleIcon /> : <CancelIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography fontWeight={600}>{interview.candidate}</Typography>}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">{interview.role} • {interview.type}</Typography>
                      <Typography variant="caption" color="text.secondary">{interview.time}</Typography>
                    </Box>
                  }
                />
                <Box sx={{ textAlign: 'right' }}>
                  <Chip
                    label={interview.result === 'passed' ? 'Passed' : 'Failed'}
                    size="small"
                    sx={{
                      bgcolor: alpha(interview.result === 'passed' ? '#34C759' : '#FF3B30', 0.1),
                      color: interview.result === 'passed' ? '#34C759' : '#FF3B30',
                      fontWeight: 600,
                    }}
                  />
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                    {interview.feedback}
                  </Typography>
                </Box>
              </ListItem>
              {idx < interviews.completed.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </ATSLayout>
  );
};

export default InterviewsPage;


