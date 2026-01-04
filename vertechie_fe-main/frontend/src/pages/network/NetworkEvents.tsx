/**
 * NetworkEvents - Events discovery and management page
 */

import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Snackbar, Alert,
  useTheme, alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add } from '@mui/icons-material';
import NetworkLayout from '../../components/network/NetworkLayout';

// ============================================
// STYLED COMPONENTS
// ============================================
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    transform: 'translateY(-2px)',
  },
}));

// ============================================
// INTERFACES
// ============================================
interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface NetworkEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  attendees_count: number;
  host: User;
  cover_image?: string;
  type: 'webinar' | 'workshop' | 'meetup' | 'conference';
  is_registered: boolean;
}

// ============================================
// MOCK DATA
// ============================================
const mockEvents: NetworkEvent[] = [
  { id: '1', title: 'Tech Leaders Summit 2024', description: 'Join top tech leaders for insights on the future of technology. Network with industry experts and learn about emerging trends.', date: 'Jan 25, 2024', time: '10:00 AM PST', attendees_count: 1250, host: { id: '1', name: 'VerTechie Events', avatar: '' }, type: 'conference', is_registered: true },
  { id: '2', title: 'React Best Practices Workshop', description: 'Hands-on workshop on React optimization and patterns. Learn from experienced developers and improve your skills.', date: 'Jan 28, 2024', time: '2:00 PM PST', attendees_count: 450, host: { id: '2', name: 'React Community', avatar: '' }, type: 'workshop', is_registered: false },
  { id: '3', title: 'AI/ML Networking Meetup', description: 'Virtual networking for AI/ML professionals. Connect with peers, share experiences, and explore collaboration opportunities.', date: 'Feb 1, 2024', time: '6:00 PM PST', attendees_count: 280, host: { id: '3', name: 'AI Enthusiasts', avatar: '' }, type: 'meetup', is_registered: false },
  { id: '4', title: 'Cloud Architecture Deep Dive', description: 'Learn advanced cloud architecture patterns from AWS certified architects. Hands-on labs included.', date: 'Feb 5, 2024', time: '11:00 AM PST', attendees_count: 380, host: { id: '4', name: 'Cloud Pros', avatar: '' }, type: 'webinar', is_registered: false },
  { id: '5', title: 'Startup Pitch Night', description: 'Watch innovative startups pitch their ideas to investors. Great networking opportunity for founders and investors alike.', date: 'Feb 10, 2024', time: '7:00 PM PST', attendees_count: 620, host: { id: '5', name: 'Startup Network', avatar: '' }, type: 'meetup', is_registered: true },
];

// ============================================
// COMPONENT
// ============================================
const NetworkEvents: React.FC = () => {
  const theme = useTheme();
  const [events, setEvents] = useState<NetworkEvent[]>(mockEvents);
  const [createEventDialogOpen, setCreateEventDialogOpen] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'webinar' as 'webinar' | 'workshop' | 'meetup' | 'conference',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  // Register for event
  const handleRegisterEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, is_registered: !e.is_registered, attendees_count: e.is_registered ? e.attendees_count - 1 : e.attendees_count + 1 }
        : e
    ));
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSnackbar({ 
        open: true, 
        message: event.is_registered ? 'Unregistered from event' : 'Registered for event!', 
        severity: 'success' 
      });
    }
  };

  // Create event
  const handleCreateEvent = () => {
    if (newEventData.title.trim() && newEventData.description.trim() && newEventData.date && newEventData.time) {
      const newEvent: NetworkEvent = {
        id: `new-${Date.now()}`,
        title: newEventData.title,
        description: newEventData.description,
        date: newEventData.date,
        time: newEventData.time,
        type: newEventData.type,
        attendees_count: 1,
        host: { id: 'me', name: 'Admin A' },
        is_registered: true,
      };
      setEvents(prev => [newEvent, ...prev]);
      setSnackbar({ open: true, message: `Event "${newEventData.title}" created successfully!`, severity: 'success' });
      setCreateEventDialogOpen(false);
      setNewEventData({ title: '', description: '', date: '', time: '', type: 'webinar' });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conference': return 'primary';
      case 'workshop': return 'secondary';
      case 'webinar': return 'info';
      case 'meetup': return 'success';
      default: return 'default';
    }
  };

  return (
    <NetworkLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Upcoming Events</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          sx={{ borderRadius: 2 }}
          onClick={() => setCreateEventDialogOpen(true)}
        >
          Create Event
        </Button>
      </Box>

      {/* Events List */}
      {events.map(event => (
        <StyledCard key={event.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ 
                width: 80, 
                textAlign: 'center', 
                p: 2, 
                bgcolor: alpha('#1976d2', 0.1),
                borderRadius: 2,
                flexShrink: 0,
              }}>
                <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                  {event.date.split(' ')[0]}
                </Typography>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                  {event.date.split(' ')[1]?.replace(',', '') || ''}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Chip 
                    label={event.type.toUpperCase()} 
                    size="small" 
                    color={getTypeColor(event.type) as any}
                  />
                  {event.is_registered && <Chip label="Registered" size="small" color="success" />}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>{event.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {event.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {event.time} • {event.attendees_count} attendees • Hosted by {event.host.name}
                </Typography>
              </Box>
              <Button 
                variant={event.is_registered ? 'outlined' : 'contained'}
                sx={{ alignSelf: 'center', borderRadius: 2, minWidth: 120 }}
                onClick={() => handleRegisterEvent(event.id)}
              >
                {event.is_registered ? 'Registered' : 'Register'}
              </Button>
            </Box>
          </CardContent>
        </StyledCard>
      ))}

      {events.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No upcoming events
          </Typography>
        </Box>
      )}

      {/* Create Event Dialog */}
      <Dialog 
        open={createEventDialogOpen} 
        onClose={() => setCreateEventDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Create a New Event</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Event Title"
            value={newEventData.title}
            onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={newEventData.description}
            onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={newEventData.date}
              onChange={(e) => setNewEventData({ ...newEventData, date: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Time"
              type="time"
              value={newEventData.time}
              onChange={(e) => setNewEventData({ ...newEventData, time: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
          <FormControl fullWidth margin="normal">
            <InputLabel>Event Type</InputLabel>
            <Select
              value={newEventData.type}
              label="Event Type"
              onChange={(e) => setNewEventData({ ...newEventData, type: e.target.value as any })}
            >
              <MenuItem value="webinar">Webinar</MenuItem>
              <MenuItem value="workshop">Workshop</MenuItem>
              <MenuItem value="meetup">Meetup</MenuItem>
              <MenuItem value="conference">Conference</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateEventDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateEvent}
            disabled={!newEventData.title.trim() || !newEventData.description.trim() || !newEventData.date || !newEventData.time}
            sx={{ borderRadius: 2 }}
          >
            Create Event
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </NetworkLayout>
  );
};

export default NetworkEvents;

