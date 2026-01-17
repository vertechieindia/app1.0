/**
 * CalendarView - Full Calendar with Booked & Synced Events
 * 
 * Features:
 * - Month/Week/Day views
 * - Events from VerTechie bookings
 * - Synced events from Google Calendar
 * - Synced events from Microsoft Outlook/Teams
 * - Event creation, editing, and deletion
 * - Drag and drop rescheduling
 * - Color-coded event sources
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Badge,
  ToggleButton,
  ToggleButtonGroup,
  Menu,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import AddIcon from '@mui/icons-material/Add';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VideocamIcon from '@mui/icons-material/Videocam';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import EventIcon from '@mui/icons-material/Event';
import LinkIcon from '@mui/icons-material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Styled Components
const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const CalendarGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 1,
  border: '1px solid rgba(13, 71, 161, 0.1)',
  borderRadius: 12,
  overflow: 'hidden',
}));

const DayHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  textAlign: 'center',
  backgroundColor: alpha('#0d47a1', 0.05),
  fontWeight: 600,
  color: '#0d47a1',
  borderBottom: '1px solid rgba(13, 71, 161, 0.1)',
}));

const DayCell = styled(Box)<{ isToday?: boolean; isCurrentMonth?: boolean; isSelected?: boolean }>(
  ({ theme, isToday, isCurrentMonth, isSelected }) => ({
    minHeight: 120,
    padding: theme.spacing(0.5),
    backgroundColor: isSelected
      ? alpha('#0d47a1', 0.08)
      : isToday
      ? alpha('#5AC8FA', 0.1)
      : isCurrentMonth
      ? '#fff'
      : alpha('#f5f5f5', 0.5),
    borderRight: '1px solid rgba(13, 71, 161, 0.05)',
    borderBottom: '1px solid rgba(13, 71, 161, 0.05)',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: isSelected ? alpha('#0d47a1', 0.12) : alpha('#0d47a1', 0.03),
    },
    '&:nth-of-type(7n)': {
      borderRight: 'none',
    },
  })
);

const DayNumber = styled(Typography)<{ isToday?: boolean }>(({ theme, isToday }) => ({
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  fontWeight: isToday ? 700 : 500,
  fontSize: '0.875rem',
  color: isToday ? '#fff' : 'inherit',
  backgroundColor: isToday ? '#0d47a1' : 'transparent',
  marginBottom: theme.spacing(0.5),
}));

const EventChip = styled(Box)<{ color: string; source: string }>(({ color, source }) => ({
  padding: '2px 6px',
  borderRadius: 4,
  fontSize: '0.7rem',
  fontWeight: 500,
  marginBottom: 2,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  backgroundColor: alpha(color, 0.15),
  color: color,
  borderLeft: `3px solid ${color}`,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  '&:hover': {
    backgroundColor: alpha(color, 0.25),
  },
}));

const WeekViewGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '60px repeat(7, 1fr)',
  border: '1px solid rgba(13, 71, 161, 0.1)',
  borderRadius: 12,
  overflow: 'hidden',
}));

const TimeSlotCell = styled(Box)(({ theme }) => ({
  minHeight: 48,
  borderRight: '1px solid rgba(13, 71, 161, 0.05)',
  borderBottom: '1px solid rgba(13, 71, 161, 0.05)',
  position: 'relative',
}));

const TimeLabel = styled(Box)(({ theme }) => ({
  padding: '4px 8px',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  textAlign: 'right',
  borderBottom: '1px solid rgba(13, 71, 161, 0.05)',
}));

const SourceBadge = styled(Box)<{ source: string }>(({ source }) => {
  const colors: Record<string, string> = {
    vertechie: '#0d47a1',
    google: '#4285F4',
    microsoft: '#00a4ef',
  };
  return {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: colors[source] || '#888',
    flexShrink: 0,
  };
});

// Types
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color: string;
  source: 'vertechie' | 'google' | 'microsoft';
  type: 'booking' | 'meeting' | 'event' | 'busy';
  location?: string;
  attendees?: string[];
  meetingLink?: string;
  description?: string;
}

type ViewMode = 'month' | 'week' | 'day' | 'agenda';

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [showSources, setShowSources] = useState({
    vertechie: true,
    google: true,
    microsoft: true,
  });

  // Mock events data
  const events: CalendarEvent[] = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    return [
      // VerTechie Bookings
      {
        id: '1',
        title: '30 Min Meeting - Sarah Chen',
        start: new Date(year, month, today.getDate() + 1, 10, 0),
        end: new Date(year, month, today.getDate() + 1, 10, 30),
        color: '#0d47a1',
        source: 'vertechie' as const,
        type: 'booking' as const,
        location: 'Zoom',
        attendees: ['Sarah Chen'],
        meetingLink: 'https://zoom.us/j/123456789',
      },
      {
        id: '2',
        title: 'Technical Interview - Mike Johnson',
        start: new Date(year, month, today.getDate() + 2, 14, 0),
        end: new Date(year, month, today.getDate() + 2, 15, 0),
        color: '#FF9500',
        source: 'vertechie' as const,
        type: 'booking' as const,
        location: 'Zoom',
        attendees: ['Mike Johnson', 'Tech Lead'],
        meetingLink: 'https://zoom.us/j/987654321',
      },
      {
        id: '3',
        title: '60 Min Consultation',
        start: new Date(year, month, today.getDate() + 3, 11, 0),
        end: new Date(year, month, today.getDate() + 3, 12, 0),
        color: '#5856D6',
        source: 'vertechie' as const,
        type: 'booking' as const,
        location: 'Google Meet',
        attendees: ['Alex Rivera'],
      },
      // Google Calendar Events
      {
        id: '4',
        title: 'Team Standup',
        start: new Date(year, month, today.getDate(), 9, 0),
        end: new Date(year, month, today.getDate(), 9, 30),
        color: '#4285F4',
        source: 'google' as const,
        type: 'meeting' as const,
        location: 'Google Meet',
        attendees: ['Team'],
      },
      {
        id: '5',
        title: 'Product Review',
        start: new Date(year, month, today.getDate() + 1, 14, 0),
        end: new Date(year, month, today.getDate() + 1, 15, 0),
        color: '#4285F4',
        source: 'google' as const,
        type: 'meeting' as const,
        location: 'Conference Room A',
      },
      {
        id: '6',
        title: 'Quarterly Planning',
        start: new Date(year, month, today.getDate() + 4, 10, 0),
        end: new Date(year, month, today.getDate() + 4, 12, 0),
        color: '#4285F4',
        source: 'google' as const,
        type: 'event' as const,
        description: 'Q1 2025 Planning Session',
      },
      // Microsoft Calendar Events
      {
        id: '7',
        title: 'Client Call - Acme Corp',
        start: new Date(year, month, today.getDate(), 15, 0),
        end: new Date(year, month, today.getDate(), 16, 0),
        color: '#00a4ef',
        source: 'microsoft' as const,
        type: 'meeting' as const,
        location: 'Microsoft Teams',
        meetingLink: 'https://teams.microsoft.com/l/meetup-join/...',
      },
      {
        id: '8',
        title: 'Sprint Retrospective',
        start: new Date(year, month, today.getDate() + 5, 15, 0),
        end: new Date(year, month, today.getDate() + 5, 16, 0),
        color: '#00a4ef',
        source: 'microsoft' as const,
        type: 'meeting' as const,
        location: 'Teams',
      },
      {
        id: '9',
        title: 'Blocked - Focus Time',
        start: new Date(year, month, today.getDate() + 2, 9, 0),
        end: new Date(year, month, today.getDate() + 2, 12, 0),
        color: '#8E8E93',
        source: 'microsoft' as const,
        type: 'busy' as const,
      },
      {
        id: '10',
        title: 'All Hands Meeting',
        start: new Date(year, month, today.getDate() + 7, 11, 0),
        end: new Date(year, month, today.getDate() + 7, 12, 0),
        color: '#00a4ef',
        source: 'microsoft' as const,
        type: 'event' as const,
        allDay: false,
      },
    ];
  }, []);

  // Filter events based on source visibility
  const filteredEvents = useMemo(() => {
    return events.filter((event) => showSources[event.source]);
  }, [events, showSources]);

  // Calendar navigation
  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Get calendar days for month view
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Previous month days
    const prevMonth = new Date(year, month, 0);
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Get source icon
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'vertechie':
        return '🔵';
      case 'google':
        return '🔴';
      case 'microsoft':
        return '🔷';
      default:
        return '📅';
    }
  };

  // Handle event click
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  // Handle day click
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    if (viewMode === 'month') {
      setCurrentDate(date);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get week days for week view
  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Get hours for day/week view
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <CalendarHeader>
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
          <Typography variant="h4" fontWeight={700} color="#1a237e">
            Calendar
          </Typography>
          <Chip
            icon={<SyncIcon />}
            label="Synced 2 min ago"
            size="small"
            sx={{ bgcolor: alpha('#34C759', 0.1), color: '#34C759' }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
          >
            Sync Now
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: '#0d47a1' }}
            onClick={() => setShowCreateDialog(true)}
          >
            New Event
          </Button>
        </Box>
      </CalendarHeader>

      {/* Calendar Sources Legend */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#0d47a1' }} />
          <Typography variant="body2">VerTechie Bookings</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4285F4' }} />
          <Typography variant="body2">Google Calendar</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#00a4ef' }} />
          <Typography variant="body2">Microsoft Outlook</Typography>
        </Box>
      </Box>

      {/* Navigation & View Toggle */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigateMonth(-1)}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h5" fontWeight={600} sx={{ minWidth: 200, textAlign: 'center' }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Typography>
            <IconButton onClick={() => navigateMonth(1)}>
              <ChevronRightIcon />
            </IconButton>
            <Button variant="outlined" startIcon={<TodayIcon />} onClick={goToToday}>
              Today
            </Button>
          </Box>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="month">
              <Tooltip title="Month View">
                <CalendarViewMonthIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="week">
              <Tooltip title="Week View">
                <ViewWeekIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="day">
              <Tooltip title="Day View">
                <ViewDayIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="agenda">
              <Tooltip title="Agenda View">
                <ViewAgendaIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {/* Month View */}
      {viewMode === 'month' && (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <CalendarGrid>
            {/* Day Headers */}
            {dayNames.map((day) => (
              <DayHeader key={day}>{day}</DayHeader>
            ))}

            {/* Calendar Days */}
            {getCalendarDays().map(({ date, isCurrentMonth }, index) => {
              const dayEvents = getEventsForDate(date);
              const isTodayDate = isToday(date);
              const isSelectedDate = selectedDate ? (
                date.getFullYear() === selectedDate.getFullYear() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getDate() === selectedDate.getDate()
              ) : undefined;

              return (
                <DayCell
                  key={index}
                  isToday={isTodayDate}
                  isCurrentMonth={isCurrentMonth}
                  isSelected={isSelectedDate}
                  onClick={() => handleDayClick(date)}
                >
                  <DayNumber isToday={isTodayDate}>
                    {date.getDate()}
                  </DayNumber>
                  <Box sx={{ overflow: 'hidden' }}>
                    {dayEvents.slice(0, 3).map((event) => (
                      <EventChip
                        key={event.id}
                        color={event.color}
                        source={event.source}
                        onClick={(e) => handleEventClick(event, e)}
                      >
                        <SourceBadge source={event.source} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {formatTime(event.start)} {event.title}
                        </span>
                      </EventChip>
                    ))}
                    {dayEvents.length > 3 && (
                      <Typography
                        variant="caption"
                        sx={{ color: '#0d47a1', fontWeight: 600, pl: 0.5, cursor: 'pointer' }}
                      >
                        +{dayEvents.length - 3} more
                      </Typography>
                    )}
                  </Box>
                </DayCell>
              );
            })}
          </CalendarGrid>
        </Paper>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden', maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
          <WeekViewGrid>
            {/* Header Row */}
            <Box sx={{ bgcolor: alpha('#0d47a1', 0.05), borderBottom: '1px solid rgba(13, 71, 161, 0.1)' }} />
            {getWeekDays().map((day) => (
              <Box
                key={day.toISOString()}
                sx={{
                  p: 1.5,
                  textAlign: 'center',
                  bgcolor: isToday(day) ? alpha('#5AC8FA', 0.1) : alpha('#0d47a1', 0.05),
                  borderBottom: '1px solid rgba(13, 71, 161, 0.1)',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {dayNames[day.getDay()]}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={isToday(day) ? 700 : 500}
                  sx={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    mx: 'auto',
                    bgcolor: isToday(day) ? '#0d47a1' : 'transparent',
                    color: isToday(day) ? '#fff' : 'inherit',
                  }}
                >
                  {day.getDate()}
                </Typography>
              </Box>
            ))}

            {/* Time Rows */}
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                <TimeLabel>
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </TimeLabel>
                {getWeekDays().map((day) => {
                  const dayEvents = getEventsForDate(day).filter(
                    (e) => new Date(e.start).getHours() === hour
                  );
                  return (
                    <TimeSlotCell key={`${day.toISOString()}-${hour}`}>
                      {dayEvents.map((event) => (
                        <EventChip
                          key={event.id}
                          color={event.color}
                          source={event.source}
                          onClick={(e) => handleEventClick(event, e)}
                          sx={{ m: 0.5, fontSize: '0.65rem' }}
                        >
                          <SourceBadge source={event.source} />
                          {event.title}
                        </EventChip>
                      ))}
                    </TimeSlotCell>
                  );
                })}
              </React.Fragment>
            ))}
          </WeekViewGrid>
        </Paper>
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden', maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
          <Box sx={{ p: 2, bgcolor: alpha('#0d47a1', 0.05), borderBottom: '1px solid rgba(13, 71, 161, 0.1)' }}>
            <Typography variant="h6" fontWeight={600}>
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </Typography>
          </Box>
          <Grid container>
            {hours.map((hour) => {
              const hourEvents = getEventsForDate(currentDate).filter(
                (e) => new Date(e.start).getHours() === hour
              );
              return (
                <React.Fragment key={hour}>
                  <Grid item xs={1}>
                    <TimeLabel sx={{ height: 60, display: 'flex', alignItems: 'flex-start', pt: 0.5 }}>
                      {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                    </TimeLabel>
                  </Grid>
                  <Grid item xs={11}>
                    <Box sx={{ minHeight: 60, borderBottom: '1px solid rgba(13, 71, 161, 0.05)', p: 0.5 }}>
                      {hourEvents.map((event) => (
                        <Card
                          key={event.id}
                          sx={{
                            mb: 0.5,
                            bgcolor: alpha(event.color, 0.1),
                            borderLeft: `4px solid ${event.color}`,
                            cursor: 'pointer',
                          }}
                          onClick={(e) => handleEventClick(event, e as any)}
                        >
                          <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <SourceBadge source={event.source} />
                              <Typography variant="body2" fontWeight={600}>{event.title}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(event.start)} - {formatTime(event.end)}
                              {event.location && ` • ${event.location}`}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Grid>
                </React.Fragment>
              );
            })}
          </Grid>
        </Paper>
      )}

      {/* Agenda View */}
      {viewMode === 'agenda' && (
        <Paper sx={{ borderRadius: 3, p: 2 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Upcoming Events
          </Typography>
          <List>
            {filteredEvents
              .filter((e) => new Date(e.start) >= new Date())
              .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
              .slice(0, 15)
              .map((event, idx) => (
                <React.Fragment key={event.id}>
                  <ListItem
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: alpha('#0d47a1', 0.03) } }}
                    onClick={(e) => handleEventClick(event, e as any)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: alpha(event.color, 0.2) }}>
                        <EventIcon sx={{ color: event.color }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography fontWeight={600}>{event.title}</Typography>
                          <SourceBadge source={event.source} />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(event.start).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </Typography>
                          <Typography variant="body2" color={event.color} fontWeight={600}>
                            {formatTime(event.start)} - {formatTime(event.end)}
                          </Typography>
                          {event.location && (
                            <Typography variant="body2" color="text.secondary">
                              📍 {event.location}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <Chip
                      label={event.source === 'vertechie' ? 'VerTechie' : event.source === 'google' ? 'Google' : 'Microsoft'}
                      size="small"
                      sx={{ bgcolor: alpha(event.color, 0.1), color: event.color }}
                    />
                  </ListItem>
                  {idx < filteredEvents.length - 1 && <Divider />}
                </React.Fragment>
              ))}
          </List>
        </Paper>
      )}

      {/* Event Detail Dialog */}
      <Dialog open={showEventDialog} onClose={() => setShowEventDialog(false)} maxWidth="sm" fullWidth>
        {selectedEvent && (
          <>
            <DialogTitle sx={{ borderLeft: `4px solid ${selectedEvent.color}`, ml: -3, pl: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SourceBadge source={selectedEvent.source} />
                <Typography variant="h6" fontWeight={600}>{selectedEvent.title}</Typography>
              </Box>
              <IconButton
                onClick={() => setShowEventDialog(false)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccessTimeIcon color="action" />
                  <Box>
                    <Typography variant="body1">
                      {new Date(selectedEvent.start).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                    </Typography>
                  </Box>
                </Box>

                {selectedEvent.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocationOnIcon color="action" />
                    <Typography>{selectedEvent.location}</Typography>
                  </Box>
                )}

                {selectedEvent.meetingLink && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <VideocamIcon color="action" />
                    <Button
                      variant="contained"
                      startIcon={<LinkIcon />}
                      size="small"
                      sx={{ bgcolor: selectedEvent.color }}
                      onClick={() => window.open(selectedEvent.meetingLink, '_blank')}
                    >
                      Join Meeting
                    </Button>
                  </Box>
                )}

                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <GroupIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Attendees
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedEvent.attendees.map((attendee, i) => (
                          <Chip key={i} label={attendee} size="small" avatar={<Avatar>{attendee.charAt(0)}</Avatar>} />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                )}

                {selectedEvent.description && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Description
                    </Typography>
                    <Typography variant="body1">{selectedEvent.description}</Typography>
                  </Box>
                )}

                <Alert severity="info" sx={{ mt: 1 }}>
                  Source: {selectedEvent.source === 'vertechie' ? 'VerTechie Booking' : selectedEvent.source === 'google' ? 'Google Calendar' : 'Microsoft Outlook'}
                </Alert>
              </Box>
            </DialogContent>
            <DialogActions>
              {selectedEvent.source === 'vertechie' && (
                <>
                  <Button startIcon={<EditIcon />}>Reschedule</Button>
                  <Button startIcon={<DeleteIcon />} color="error">Cancel</Button>
                </>
              )}
              <Button onClick={() => setShowEventDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth label="Event Title" placeholder="Add title" />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="Start Date" type="date" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Start Time" type="time" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="End Date" type="date" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="End Time" type="time" InputLabelProps={{ shrink: true }} />
              </Grid>
            </Grid>
            <FormControl fullWidth>
              <InputLabel>Calendar</InputLabel>
              <Select defaultValue="vertechie" label="Calendar">
                <MenuItem value="vertechie">VerTechie Calendar</MenuItem>
                <MenuItem value="google">Google Calendar</MenuItem>
                <MenuItem value="microsoft">Microsoft Outlook</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth label="Location" placeholder="Add location or video link" />
            <TextField fullWidth label="Description" multiline rows={3} placeholder="Add description" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#0d47a1' }}>Create Event</Button>
        </DialogActions>
      </Dialog>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Show Calendars</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={showSources.vertechie}
                onChange={(e) => setShowSources({ ...showSources, vertechie: e.target.checked })}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#0d47a1' }} />
                VerTechie Bookings
              </Box>
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={showSources.google}
                onChange={(e) => setShowSources({ ...showSources, google: e.target.checked })}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4285F4' }} />
                Google Calendar
              </Box>
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={showSources.microsoft}
                onChange={(e) => setShowSources({ ...showSources, microsoft: e.target.checked })}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#00a4ef' }} />
                Microsoft Outlook
              </Box>
            }
          />
        </Box>
      </Menu>
    </Container>
  );
};

export default CalendarView;

