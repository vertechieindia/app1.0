/**
 * PublicSchedulingPage - Public Booking Page for Scheduling
 * 
 * This page is accessible via unique scheduling links like:
 * - /schedule/johndoe (user's main scheduling page)
 * - /book/abc123 (unique link with constraints from backend)
 * 
 * Features:
 * - Fetches constraints from backend API
 * - Enforces date range, time range, and day restrictions
 * - Validates max bookings and buffer times
 * - Shows only available slots based on constraints
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  TextField,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideocamIcon from '@mui/icons-material/Videocam';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import PublicIcon from '@mui/icons-material/Public';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import BlockIcon from '@mui/icons-material/Block';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { getApiUrl } from '../../config/api';

// Types
interface LinkConstraints {
  duration_minutes: number;
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  available_days: number[];
  buffer_before: number;
  buffer_after: number;
  max_bookings: number | null;
  max_bookings_per_day: number | null;
  remaining_bookings: number | null;
  requires_approval: boolean;
  expires_at: string | null;
}

interface AvailableDate {
  date: string;
  slots_count: number;
}

interface LinkData {
  link: {
    token: string;
    is_valid: boolean;
    meeting_type_id?: string | null;
  };
  host: {
    name: string;
    title: string;
    company: string;
    timezone: string;
    avatar: string | null;
  };
  meeting: {
    name: string;
    duration_minutes: number;
  };
  constraints: LinkConstraints;
  available_dates: AvailableDate[];
  branding: {
    show_branding: boolean;
    primary_color: string;
  };
}

// Styled Components
const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f8faff 0%, #e8f0fe 100%)',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const CalendarGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 4,
}));

const DayCell = styled(Box)<{ available?: boolean; selected?: boolean; isToday?: boolean }>(
  ({ available, selected, isToday }) => ({
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    cursor: available ? 'pointer' : 'default',
    fontWeight: isToday ? 700 : 500,
    fontSize: '0.9rem',
    backgroundColor: selected
      ? '#0d47a1'
      : isToday
      ? alpha('#5AC8FA', 0.2)
      : available
      ? alpha('#0d47a1', 0.05)
      : 'transparent',
    color: selected ? '#fff' : available ? '#0d47a1' : '#bbb',
    transition: 'all 0.2s ease',
    '&:hover': available && !selected
      ? {
          backgroundColor: alpha('#0d47a1', 0.15),
        }
      : {},
  })
);

const TimeSlot = styled(Button)<{ selected?: boolean }>(({ selected }) => ({
  justifyContent: 'center',
  borderColor: selected ? '#0d47a1' : 'rgba(13, 71, 161, 0.2)',
  backgroundColor: selected ? '#0d47a1' : '#fff',
  color: selected ? '#fff' : '#0d47a1',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: selected ? '#0d47a1' : alpha('#0d47a1', 0.1),
    borderColor: '#0d47a1',
  },
}));

const ErrorCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  borderRadius: theme.spacing(2),
  maxWidth: 500,
  margin: '0 auto',
}));

const PublicSchedulingPage: React.FC = () => {
  const { linkId } = useParams<{ linkId?: string; username?: string }>();
  
  // Use linkId from route params (for /book/:linkId) 
  const token = linkId;
  
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingDetails, setConfirmedBookingDetails] = useState<{ video_link?: string | null; start_time?: string; end_time?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  // Calendar helpers
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fetch link data on mount
  useEffect(() => {
    fetchLinkData();
  }, [token]);

  const fetchLinkData = async () => {
    if (!token) {
      setError({ code: 'NO_TOKEN', message: 'Invalid scheduling link' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl(`/calendar/scheduling-links/${token}`));
      
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 410) {
          setError({ 
            code: data.code || 'LINK_EXPIRED', 
            message: data.error || 'This scheduling link has expired' 
          });
        } else {
          setError({ 
            code: 'FETCH_ERROR', 
            message: data.error || 'Failed to load scheduling page' 
          });
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      const maxBookings = typeof data.max_bookings === 'number' ? data.max_bookings : null;
      const bookingsCount = typeof data.bookings_count === 'number' ? data.bookings_count : 0;

      const mapped: LinkData = {
        link: {
          token: data.token || token,
          is_valid: Boolean(data.is_active ?? true),
          meeting_type_id: data.meeting_type_id || null,
        },
        host: {
          name: 'Hiring Team',
          title: '',
          company: '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          avatar: null,
        },
        meeting: {
          name: data.name || 'Interview Meeting',
          duration_minutes: data.duration_minutes || 30,
        },
        constraints: {
          duration_minutes: data.duration_minutes || 30,
          start_date: data.start_date || null,
          end_date: data.end_date || null,
          start_time: data.start_time || null,
          end_time: data.end_time || null,
          available_days: Array.isArray(data.available_days) ? data.available_days : [],
          buffer_before: 0,
          buffer_after: 0,
          max_bookings: maxBookings,
          max_bookings_per_day: null,
          remaining_bookings: maxBookings !== null ? Math.max(maxBookings - bookingsCount, 0) : null,
          requires_approval: Boolean(data.requires_approval),
          expires_at: null,
        },
        available_dates: [],
        branding: {
          show_branding: true,
          primary_color: '#0d47a1',
        },
      };

      setLinkData(mapped);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load public scheduling link:', err);
      setError({ code: 'FETCH_ERROR', message: 'Failed to load scheduling page' });
      setLoading(false);
    }
  };

  // Fetch available slots for a specific date
  const fetchSlotsForDate = async (date: Date) => {
    if (!token || !linkData) return;

    setLoadingSlots(true);
    const slots = calculateSlotsFromConstraints(date);
    setAvailableSlots(slots);
    setLoadingSlots(false);
  };

  // Mock blocked events (simulating synced calendar events and existing bookings)
  // In production, this would come from the API
  const getMockBlockedEvents = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // Sample blocked events matching what's shown in the calendar
    const blockedEvents: { [key: string]: { time: string; duration: number; title: string; source: string }[] } = {
      '2025-12-28': [
        { time: '09:00', duration: 30, title: 'Team Standup', source: 'google' },
        { time: '10:00', duration: 60, title: 'Interview - Sarah J.', source: 'vertechie' },
        { time: '14:00', duration: 60, title: 'Product Review', source: 'microsoft' },
      ],
      '2025-12-29': [
        { time: '11:00', duration: 45, title: 'Interview - Mike C.', source: 'vertechie' },
      ],
      '2025-12-30': [
        { time: '10:00', duration: 90, title: 'Sprint Planning', source: 'google' },
        { time: '15:00', duration: 30, title: 'HR Sync', source: 'microsoft' },
      ],
      '2025-12-31': [
        { time: '14:00', duration: 60, title: 'Technical Interview', source: 'vertechie' },
        { time: '16:00', duration: 60, title: 'Year-end Review', source: 'google' },
      ],
    };
    
    return blockedEvents[dateStr] || [];
  };

  // Check if a time slot conflicts with blocked events
  const isTimeBlocked = (date: Date, timeStr: string, duration: number): boolean => {
    const blockedEvents = getMockBlockedEvents(date);
    
    // Parse the slot time
    const [slotTime, period] = timeStr.split(' ');
    let [slotHour, slotMin] = slotTime.split(':').map(Number);
    if (period === 'PM' && slotHour !== 12) slotHour += 12;
    if (period === 'AM' && slotHour === 12) slotHour = 0;
    
    const slotStart = slotHour * 60 + slotMin;
    const slotEnd = slotStart + duration;
    
    // Check against each blocked event
    for (const event of blockedEvents) {
      const [eventHour, eventMin] = event.time.split(':').map(Number);
      const eventStart = eventHour * 60 + eventMin;
      const eventEnd = eventStart + event.duration;
      
      // Check for overlap
      if (slotStart < eventEnd && slotEnd > eventStart) {
        return true;
      }
    }
    
    return false;
  };

  // Calculate available slots based on constraints (fallback with conflict checking)
  const calculateSlotsFromConstraints = (date: Date): string[] => {
    if (!linkData) return [];

    const { constraints } = linkData;
    const slots: string[] = [];

    const startTime = constraints.start_time || '09:00';
    const endTime = constraints.end_time || '17:00';
    const duration = constraints.duration_minutes;

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (true) {
      const endSlotHour = currentHour + Math.floor((currentMin + duration) / 60);
      const endSlotMin = (currentMin + duration) % 60;

      // Check if slot would exceed end time
      if (endSlotHour > endHour || (endSlotHour === endHour && endSlotMin > endMin)) {
        break;
      }

      const formattedTime = formatTimeSlot(currentHour, currentMin);
      
      // Check if this slot is blocked by existing events
      if (!isTimeBlocked(date, formattedTime, duration)) {
        slots.push(formattedTime);
      }

      // Move to next slot (30 min intervals)
      currentMin += 30;
      if (currentMin >= 60) {
        currentHour += 1;
        currentMin = 0;
      }

      // Safety check
      if (slots.length > 50) break;
    }

    return slots;
  };

  const formatTimeSlot = (hour: number, min: number): string => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${min.toString().padStart(2, '0')} ${ampm}`;
  };

  // Parse YYYY-MM-DD (or ISO with time) as local midnight so range comparison includes the whole day
  const parseLocalDate = (dateStr: string): Date => {
    const dateOnly = typeof dateStr === 'string' && dateStr.includes('T') ? dateStr.slice(0, 10) : dateStr;
    const parts = dateOnly.split('-').map((p) => parseInt(p, 10));
    const y = parts[0];
    const m = (parts[1] || 1) - 1;
    const d = parts[2] || 1;
    if (Number.isNaN(y) || Number.isNaN(m + 1) || Number.isNaN(d)) return new Date(0);
    return new Date(y, m, d);
  };

  // Check if a date is available based on constraints
  const isDateAvailable = (date: Date): boolean => {
    if (!linkData) return false;

    const { constraints } = linkData;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Check if date is in the past (before today)
    if (dateMidnight.getTime() < today.getTime()) return false;

    // Allow today if it's within the availability window (no longer exclude today)

    // Check date range constraints using date-only so 3/10–3/17 includes both 10 and 17
    if (constraints.start_date) {
      const startDate = parseLocalDate(constraints.start_date);
      if (dateMidnight.getTime() < startDate.getTime()) return false;
    }

    if (constraints.end_date) {
      const endDate = parseLocalDate(constraints.end_date);
      if (dateMidnight.getTime() > endDate.getTime()) return false;
    }

    // Check expires_at
    if (constraints.expires_at) {
      const expiresAt = new Date(constraints.expires_at);
      if (dateMidnight > expiresAt) return false;
    }

    // Check available days (0=Sun, 1=Mon, etc.) — compare as numbers in case API returns strings
    if (constraints.available_days && constraints.available_days.length > 0) {
      const dayOfWeek = (date.getDay() + 6) % 7;
      const allowed = constraints.available_days.map((d: number | string) => Number(d));
      if (!allowed.includes(dayOfWeek)) return false;
    }

    // Check if there are remaining bookings
    if (constraints.remaining_bookings !== null && constraints.remaining_bookings <= 0) {
      return false;
    }

    return true;
  };

  // Generate calendar days
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = new Date();

    const days: { date: number; available: boolean; isToday: boolean; dateObj: Date }[] = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push({ date: 0, available: false, isToday: false, dateObj: new Date() });
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      const isToday = dateObj.toDateString() === today.toDateString();
      const available = isDateAvailable(dateObj);
      
      days.push({
        date: i,
        available,
        isToday,
        dateObj,
      });
    }

    return days;
  };

  const handleDateSelect = (day: { date: number; available: boolean; dateObj: Date }) => {
    if (day.available && day.date > 0) {
      setSelectedDate(day.dateObj);
      setSelectedTime(null);
      fetchSlotsForDate(day.dateObj);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime || !token) return;
    if (!linkData?.link?.meeting_type_id) {
      alert('Booking is not available for this link.');
      return;
    }

    setSubmitting(true);

    // Parse time to 24-hour format
    const [timePart, ampm] = selectedTime.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    const time24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    const localStart = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hours,
      minutes,
      0,
      0
    );

    const bookingData = {
      meeting_type_id: linkData.link.meeting_type_id,
      invitee_name: formData.name,
      invitee_email: formData.email,
      invitee_phone: formData.phone || undefined,
      invitee_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      start_time: localStart.toISOString(),
      answers: {},
      invitee_notes: formData.notes || undefined,
    };

    try {
      const response = await fetch(getApiUrl('/calendar/bookings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to create booking');
        setSubmitting(false);
        return;
      }

      const created = await response.json();
      setConfirmedBookingDetails({
        video_link: created.video_link ?? null,
        start_time: created.start_time,
        end_time: created.end_time,
      });
      setShowBookingForm(false);
      setBookingConfirmed(true);
    } catch (err) {
      alert('Booking failed. Please try again later.');
    }

    setSubmitting(false);
  };

  // Loading state
  if (loading) {
    return (
      <PageWrapper>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
            <CircularProgress size={48} sx={{ color: '#0d47a1', mb: 3 }} />
            <Typography variant="h6" color="text.secondary">Loading scheduling page...</Typography>
          </Box>
        </Container>
      </PageWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <PageWrapper>
        <Container maxWidth="md">
          <ErrorCard elevation={2}>
            {error.code === 'LINK_EXPIRED' ? (
              <>
                <ScheduleIcon sx={{ fontSize: 80, color: '#FF9500', mb: 2 }} />
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Link Expired</Typography>
              </>
            ) : error.code === 'LINK_INACTIVE' ? (
              <>
                <BlockIcon sx={{ fontSize: 80, color: '#FF3B30', mb: 2 }} />
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Link Inactive</Typography>
              </>
            ) : (
              <>
                <ErrorOutlineIcon sx={{ fontSize: 80, color: '#FF3B30', mb: 2 }} />
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Oops!</Typography>
              </>
            )}
            <Typography color="text.secondary" sx={{ mb: 3 }}>{error.message}</Typography>
            <Button variant="contained" sx={{ bgcolor: '#0d47a1' }} onClick={() => window.location.href = '/'}>
              Go to Homepage
            </Button>
          </ErrorCard>
        </Container>
      </PageWrapper>
    );
  }

  if (!linkData) return null;

  const { host, meeting, constraints, branding } = linkData;

  return (
    <PageWrapper>
      <Container maxWidth="lg">
        {/* Logo/Brand */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              bgcolor: branding.primary_color, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Typography sx={{ color: '#fff', fontWeight: 700 }}>V</Typography>
            </Box>
            <Typography variant="h5" fontWeight={700} color={branding.primary_color}>VerTechie</Typography>
          </Box>
        </Box>

        {bookingConfirmed ? (
          // Confirmation Screen
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, maxWidth: 500, mx: 'auto' }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: '#34C759', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              {constraints.requires_approval ? 'Booking Requested!' : 'You\'re Booked!'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {constraints.requires_approval 
                ? 'Your booking request has been sent. You\'ll receive a confirmation email once approved.'
                : 'A confirmation email has been sent to your inbox with the meeting link. On the scheduled date, use the link below or in the email to join.'}
            </Typography>
            <Paper sx={{ p: 3, bgcolor: alpha(branding.primary_color, 0.03), mb: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>{meeting.name}</Typography>
              <Typography variant="body1">
                {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </Typography>
              <Typography variant="body1" color={branding.primary_color} fontWeight={600}>
                {selectedTime}
              </Typography>
              <Chip 
                icon={<AccessTimeIcon />} 
                label={`${meeting.duration_minutes} minutes`} 
                size="small" 
                sx={{ mt: 1 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                with {host.name}
              </Typography>
              {confirmedBookingDetails?.video_link && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Join meeting (on the scheduled date)</Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    href={confirmedBookingDetails.video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ bgcolor: branding.primary_color }}
                  >
                    Join meeting link
                  </Button>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                    Save this link — you and {host.name} will use it to connect at the booked time.
                  </Typography>
                </Box>
              )}
            </Paper>
            <Button variant="outlined" sx={{ borderColor: branding.primary_color, color: branding.primary_color }} onClick={() => window.location.reload()}>
              Schedule Another Meeting
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {/* Left Column - Profile */}
            <Grid item xs={12} md={4}>
              <ProfileCard elevation={0}>
                <Avatar 
                  src={host.avatar || undefined}
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: branding.primary_color, fontSize: 32 }}
                >
                  {host.name.charAt(0)}
                </Avatar>
                <Typography variant="h5" fontWeight={700}>{host.name}</Typography>
                {host.title && <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{host.title}</Typography>}
                {host.company && <Typography variant="body2" color={branding.primary_color} fontWeight={500}>{host.company}</Typography>}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 2 }}>
                  <PublicIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">{host.timezone}</Typography>
                </Box>
              </ProfileCard>

              {/* Meeting Info */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>{meeting.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AccessTimeIcon sx={{ fontSize: 20, color: branding.primary_color }} />
                  <Typography variant="body2">{meeting.duration_minutes} minutes</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <VideocamIcon sx={{ fontSize: 20, color: branding.primary_color }} />
                  <Typography variant="body2">Video Conference</Typography>
                </Box>
                
                {/* Show constraints info */}
                {(constraints.start_date || constraints.end_date) && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Available {constraints.start_date ? `from ${new Date(constraints.start_date).toLocaleDateString()}` : ''} 
                    {constraints.end_date ? ` until ${new Date(constraints.end_date).toLocaleDateString()}` : ''}
                  </Alert>
                )}

                {constraints.remaining_bookings !== null && constraints.remaining_bookings <= 5 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Only {constraints.remaining_bookings} slot{constraints.remaining_bookings !== 1 ? 's' : ''} remaining!
                  </Alert>
                )}
              </Paper>
            </Grid>

            {/* Right Column - Calendar & Time Slots */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 3 }} elevation={0}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>Select a Date & Time</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meeting.name} • {meeting.duration_minutes} minutes
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {/* Calendar */}
                  <Grid item xs={12} md={7}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <IconButton onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                        <ChevronLeftIcon />
                      </IconButton>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </Typography>
                      <IconButton onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                        <ChevronRightIcon />
                      </IconButton>
                    </Box>

                    {/* Day Headers */}
                    <CalendarGrid sx={{ mb: 1 }}>
                      {dayNames.map((day) => (
                        <Typography key={day} variant="caption" sx={{ textAlign: 'center', fontWeight: 600, color: 'text.secondary' }}>
                          {day}
                        </Typography>
                      ))}
                    </CalendarGrid>

                    {/* Calendar Days */}
                    <CalendarGrid>
                      {getCalendarDays().map((day, idx) => (
                        <DayCell
                          key={idx}
                          available={day.available}
                          isToday={day.isToday}
                          selected={selectedDate?.toDateString() === day.dateObj.toDateString()}
                          onClick={() => handleDateSelect(day)}
                        >
                          {day.date > 0 ? day.date : ''}
                        </DayCell>
                      ))}
                    </CalendarGrid>
                  </Grid>

                  {/* Time Slots */}
                  <Grid item xs={12} md={5}>
                    {selectedDate ? (
                      <>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </Typography>
                        
                        {loadingSlots ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Skeleton key={i} variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                            ))}
                          </Box>
                        ) : availableSlots.length > 0 ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 350, overflowY: 'auto' }}>
                            {availableSlots.map((time) => (
                              <TimeSlot
                                key={time}
                                variant="outlined"
                                selected={selectedTime === time}
                                onClick={() => setSelectedTime(time)}
                                fullWidth
                              >
                                {time}
                              </TimeSlot>
                            ))}
                          </Box>
                        ) : (
                          <Alert severity="warning">
                            No available time slots for this date. Please select another date.
                          </Alert>
                        )}
                        
                        {selectedTime && (
                          <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2, bgcolor: branding.primary_color, py: 1.5 }}
                            onClick={() => setShowBookingForm(true)}
                          >
                            Confirm {selectedTime}
                          </Button>
                        )}
                      </>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                        <EventIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                        <Typography color="text.secondary">Select a date to see available times</Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Booking Form Dialog */}
        <Dialog open={showBookingForm} onClose={() => !submitting && setShowBookingForm(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>Complete Your Booking</Typography>
          </DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 3 }}>
              {meeting.name} on {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
            </Alert>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Your Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                InputProps={{ startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
              />
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
              />
              <TextField
                fullWidth
                label="Phone Number (Optional)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <TextField
                fullWidth
                label="Additional Notes (Optional)"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Please share anything that will help prepare for our meeting."
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setShowBookingForm(false)} disabled={submitting}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleConfirmBooking}
              disabled={!formData.name || !formData.email || submitting}
              sx={{ bgcolor: branding.primary_color }}
            >
              {submitting ? <CircularProgress size={24} /> : 'Confirm Booking'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      {/* Footer */}
      {branding.show_branding && (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="body2" color="text.secondary">
            Powered by <Box component="span" sx={{ color: branding.primary_color, fontWeight: 600 }}>VerTechie</Box>
          </Typography>
        </Box>
      )}
    </PageWrapper>
  );
};

export default PublicSchedulingPage;
