/**
 * NetworkEvents - Events discovery and management page
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Snackbar, Alert,
  alpha, CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, Refresh, Edit, Delete } from '@mui/icons-material';
import NetworkLayout from '../../components/network/NetworkLayout';
import { eventService, Event as BackendEvent } from '../../services/eventService';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    transform: 'translateY(-2px)',
  },
}));

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
  startDateTime: string;
  timezone: string;
  attendees_count: number;
  host: User;
  cover_image?: string;
  meeting_link?: string;
  type: 'webinar' | 'workshop' | 'meetup' | 'conference';
  is_registered: boolean;
  is_host: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_join_now: boolean;
}

interface EventFormState {
  title: string;
  description: string;
  date: string;
  time: string;
  timezone: string;
  meeting_link: string;
  type: 'webinar' | 'workshop' | 'meetup' | 'conference';
}

const DEFAULT_FORM: EventFormState = {
  title: '',
  description: '',
  date: '',
  time: '',
  timezone: 'Asia/Kolkata',
  meeting_link: '',
  type: 'webinar',
};

const EVENT_TITLE_REGEX = /^[A-Za-z][A-Za-z0-9 &'().,:-]{2,99}$/;
const normalizeSpaces = (value: string) => value.replace(/\s+/g, ' ').trim();
const hasLetters = (value: string) => /[A-Za-z]/.test(value);

const isValidHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const NetworkEvents: React.FC = () => {
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createEventDialogOpen, setCreateEventDialogOpen] = useState(false);
  const [editEventDialogOpen, setEditEventDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const [newEventData, setNewEventData] = useState<EventFormState>(DEFAULT_FORM);
  const [editEventData, setEditEventData] = useState<EventFormState>(DEFAULT_FORM);
  const [selectedEvent, setSelectedEvent] = useState<NetworkEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<NetworkEvent | null>(null);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const mapBackendEvent = (event: BackendEvent): NetworkEvent => {
    let dateStr = 'TBD';
    let timeStr = 'TBD';
    let canJoinNow = !!event.can_join_now;
    let normalizedStart = event.start_date;

    if (event.start_date) {
      const start = new Date(event.start_date);
      if (!isNaN(start.getTime())) {
        dateStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        timeStr = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        if (!event.can_join_now) {
          canJoinNow = !!event.meeting_link && start <= new Date() && (event.attendees_count || 0) >= 2 && !!(event.is_registered || event.is_host);
        }
      }
    }

    return {
      id: event.id,
      title: event.title,
      description: event.description || '',
      date: dateStr,
      time: timeStr,
      startDateTime: normalizedStart,
      timezone: event.timezone || 'UTC',
      attendees_count: event.attendees_count || 0,
      host: {
        id: event.host_id,
        name: event.host_name || 'Unknown',
      },
      cover_image: event.cover_image,
      meeting_link: event.meeting_link,
      type: event.event_type as NetworkEvent['type'],
      is_registered: !!event.is_registered,
      is_host: !!event.is_host,
      can_edit: !!event.can_edit,
      can_delete: !!event.can_delete,
      can_join_now: canJoinNow,
    };
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const backendEvents = await eventService.getEvents({ limit: 50 });
      setEvents(backendEvents.map(mapBackendEvent));
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to load events.';
      setError(errorMessage);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const parseLocalDateTimeToIso = (date: string, time: string): string | null => {
    const dt = new Date(`${date}T${time}:00`);
    if (isNaN(dt.getTime())) return null;
    return dt.toISOString();
  };

  const normalizeEventForm = (data: EventFormState): EventFormState => ({
    ...data,
    title: normalizeSpaces(data.title),
    description: normalizeSpaces(data.description),
    meeting_link: normalizeSpaces(data.meeting_link),
  });

  const getFormValidationError = (data: EventFormState): string | null => {
    if (!data.title || !data.description || !data.date || !data.time) {
      return 'Please fill required fields.';
    }
    if (!EVENT_TITLE_REGEX.test(data.title)) {
      return 'Event title should start with a letter and avoid unwanted characters.';
    }
    if (!hasLetters(data.description) || data.description.length < 10) {
      return 'Description must be meaningful and at least 10 characters.';
    }
    if (data.meeting_link && !isValidHttpUrl(data.meeting_link)) {
      return 'Meeting link must be a valid http/https URL.';
    }
    return null;
  };

  const formValid = (data: EventFormState) => {
    const normalized = normalizeEventForm(data);
    return !getFormValidationError(normalized);
  };

  const handleRegisterEvent = async (eventObj: NetworkEvent) => {
    if (eventObj.is_host) return;
    try {
      await eventService.registerEvent(eventObj.id);
      setSnackbar({
        open: true,
        message: eventObj.is_registered ? 'Unregistered from event' : 'Registered for event!',
        severity: 'success',
      });
      await fetchEvents();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.detail || 'Failed to register for event. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleJoinEvent = (eventObj: NetworkEvent) => {
    if (!eventObj.meeting_link) {
      setSnackbar({ open: true, message: 'Meeting link not available.', severity: 'error' });
      return;
    }
    window.open(eventObj.meeting_link, '_blank', 'noopener,noreferrer');
  };

  const handleCreateEvent = async () => {
    const normalized = normalizeEventForm(newEventData);
    const validationError = getFormValidationError(normalized);
    if (validationError) {
      setSnackbar({ open: true, message: validationError, severity: 'error' });
      return;
    }
    const startIso = parseLocalDateTimeToIso(normalized.date, normalized.time);
    if (!startIso) {
      setSnackbar({ open: true, message: 'Invalid date/time.', severity: 'error' });
      return;
    }
    try {
      await eventService.createEvent({
        title: normalized.title,
        description: normalized.description,
        start_date: startIso,
        timezone: normalized.timezone,
        event_type: normalized.type,
        is_virtual: true,
        meeting_link: normalized.meeting_link || undefined,
      });
      setCreateEventDialogOpen(false);
      setNewEventData(DEFAULT_FORM);
      setSnackbar({ open: true, message: 'Event created successfully!', severity: 'success' });
      await fetchEvents();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.detail || 'Failed to create event.',
        severity: 'error',
      });
    }
  };

  const handleOpenEdit = (eventObj: NetworkEvent) => {
    const dt = new Date(eventObj.startDateTime);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    const hh = String(dt.getHours()).padStart(2, '0');
    const min = String(dt.getMinutes()).padStart(2, '0');

    setEditingEvent(eventObj);
    setEditEventData({
      title: eventObj.title,
      description: eventObj.description,
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hh}:${min}`,
      timezone: eventObj.timezone || 'Asia/Kolkata',
      meeting_link: eventObj.meeting_link || '',
      type: eventObj.type,
    });
    setEditEventDialogOpen(true);
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;
    const normalized = normalizeEventForm(editEventData);
    const validationError = getFormValidationError(normalized);
    if (validationError) {
      setSnackbar({ open: true, message: validationError, severity: 'error' });
      return;
    }
    const startIso = parseLocalDateTimeToIso(normalized.date, normalized.time);
    if (!startIso) {
      setSnackbar({ open: true, message: 'Invalid date/time.', severity: 'error' });
      return;
    }
    try {
      await eventService.updateEvent(editingEvent.id, {
        title: normalized.title,
        description: normalized.description,
        start_date: startIso,
        timezone: normalized.timezone,
        event_type: normalized.type,
        meeting_link: normalized.meeting_link || undefined,
        is_virtual: true,
      });
      setEditEventDialogOpen(false);
      setEditingEvent(null);
      setSnackbar({ open: true, message: 'Event updated successfully!', severity: 'success' });
      await fetchEvents();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.detail || 'Failed to update event.',
        severity: 'error',
      });
    }
  };

  const handleDeleteEvent = async (eventObj: NetworkEvent) => {
    const ok = window.confirm(`Delete event "${eventObj.title}"?`);
    if (!ok) return;
    try {
      await eventService.deleteEvent(eventObj.id);
      setSnackbar({ open: true, message: 'Event deleted successfully!', severity: 'success' });
      setEvents((prev) => prev.filter((e) => e.id !== eventObj.id));
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.detail || 'Failed to delete event.',
        severity: 'error',
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conference':
        return 'primary';
      case 'workshop':
        return 'secondary';
      case 'webinar':
        return 'info';
      case 'meetup':
        return 'success';
      default:
        return 'default';
    }
  };

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()),
    [events]
  );

  return (
    <NetworkLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Upcoming Events</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchEvents} disabled={loading} sx={{ borderRadius: 2 }}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 2 }} onClick={() => setCreateEventDialogOpen(true)}>
            Create Event
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && sortedEvents.map((event) => (
        <StyledCard
          key={event.id}
          sx={{ mb: 2, cursor: 'pointer' }}
          onClick={() => {
            setSelectedEvent(event);
            setDetailsDialogOpen(true);
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ width: 90, textAlign: 'center', p: 2, bgcolor: alpha('#1976d2', 0.1), borderRadius: 2, flexShrink: 0 }}>
                <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                  {event.date}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                  <Chip label={event.type.toUpperCase()} size="small" color={getTypeColor(event.type) as any} />
                  {event.is_registered && <Chip label="Registered" size="small" color="success" />}
                  {event.is_host && <Chip label="Host" size="small" color="primary" variant="outlined" />}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>{event.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {event.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {event.time} | {event.timezone} | {event.attendees_count} attendees | Hosted by {event.host.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignSelf: 'center' }}>
                {event.can_edit && (
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(event);
                    }}
                  >
                    Edit
                  </Button>
                )}
                {event.can_delete && (
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event);
                    }}
                  >
                    Delete
                  </Button>
                )}
                {!event.is_host && (
                  <Button
                    variant={event.is_registered ? 'outlined' : 'contained'}
                    sx={{ borderRadius: 2, minWidth: 120 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRegisterEvent(event);
                    }}
                  >
                    {event.is_registered ? 'Registered' : 'Register'}
                  </Button>
                )}
                {event.can_join_now && (
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ borderRadius: 2, minWidth: 120 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinEvent(event);
                    }}
                  >
                    Join
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </StyledCard>
      ))}

      {!loading && events.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No upcoming events. Be the first to create one!
          </Typography>
        </Box>
      )}

      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>{selectedEvent?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>{selectedEvent?.description}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Date: {selectedEvent?.date}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Time: {selectedEvent?.time} ({selectedEvent?.timezone})
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Attendees: {selectedEvent?.attendees_count}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Host: {selectedEvent?.host.name}
          </Typography>
          {selectedEvent?.meeting_link && (
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
              Meeting link: {selectedEvent.meeting_link}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          {selectedEvent?.can_join_now && (
            <Button variant="contained" color="success" onClick={() => selectedEvent && handleJoinEvent(selectedEvent)}>
              Join
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={createEventDialogOpen} onClose={() => setCreateEventDialogOpen(false)} maxWidth="sm" fullWidth>
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
              helperText="Event start time"
              required
            />
          </Box>
          <FormControl fullWidth margin="normal">
            <InputLabel>Timezone</InputLabel>
            <Select
              value={newEventData.timezone}
              label="Timezone"
              onChange={(e) => setNewEventData({ ...newEventData, timezone: e.target.value })}
            >
              <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
              <MenuItem value="UTC">UTC</MenuItem>
              <MenuItem value="America/New_York">America/New_York (ET)</MenuItem>
              <MenuItem value="America/Los_Angeles">America/Los_Angeles (PT)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Meeting Link"
            value={newEventData.meeting_link}
            onChange={(e) => setNewEventData({ ...newEventData, meeting_link: e.target.value })}
            margin="normal"
            placeholder="https://meet.google.com/..."
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Event Type</InputLabel>
            <Select
              value={newEventData.type}
              label="Event Type"
              onChange={(e) => setNewEventData({ ...newEventData, type: e.target.value as EventFormState['type'] })}
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
          <Button variant="contained" onClick={handleCreateEvent} disabled={!formValid(newEventData)} sx={{ borderRadius: 2 }}>
            Create Event
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editEventDialogOpen} onClose={() => setEditEventDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Edit Event</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Event Title"
            value={editEventData.title}
            onChange={(e) => setEditEventData({ ...editEventData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={editEventData.description}
            onChange={(e) => setEditEventData({ ...editEventData, description: e.target.value })}
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
              value={editEventData.date}
              onChange={(e) => setEditEventData({ ...editEventData, date: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Time"
              type="time"
              value={editEventData.time}
              onChange={(e) => setEditEventData({ ...editEventData, time: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
          <FormControl fullWidth margin="normal">
            <InputLabel>Timezone</InputLabel>
            <Select
              value={editEventData.timezone}
              label="Timezone"
              onChange={(e) => setEditEventData({ ...editEventData, timezone: e.target.value })}
            >
              <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
              <MenuItem value="UTC">UTC</MenuItem>
              <MenuItem value="America/New_York">America/New_York (ET)</MenuItem>
              <MenuItem value="America/Los_Angeles">America/Los_Angeles (PT)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Meeting Link"
            value={editEventData.meeting_link}
            onChange={(e) => setEditEventData({ ...editEventData, meeting_link: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Event Type</InputLabel>
            <Select
              value={editEventData.type}
              label="Event Type"
              onChange={(e) => setEditEventData({ ...editEventData, type: e.target.value as EventFormState['type'] })}
            >
              <MenuItem value="webinar">Webinar</MenuItem>
              <MenuItem value="workshop">Workshop</MenuItem>
              <MenuItem value="meetup">Meetup</MenuItem>
              <MenuItem value="conference">Conference</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditEventDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateEvent} disabled={!formValid(editEventData)} sx={{ borderRadius: 2 }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

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
