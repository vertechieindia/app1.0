/**
 * SchedulingPage - Manage Scheduling Links, Meeting Types, and Availability
 * Integrates with backend API to store and manage scheduling link constraints
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Card, CardContent, Button, IconButton, Chip, Grid,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  Select, MenuItem, Tooltip, List, ListItem, ListItemIcon, ListItemText,
  ListItemAvatar, Avatar, Switch, FormControlLabel, CircularProgress, Alert,
  ToggleButton, ToggleButtonGroup, Snackbar, Divider,
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
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ATSLayout from './ATSLayout';
import ScheduleInterviewModal, { ScheduleInterviewContext } from '../../../components/ats/ScheduleInterviewModal';
import { calendarService, type MeetingType, type SchedulingLink, type Booking } from '../../../services/calendarService';
import { interviewService } from '../../../services/interviewService';

const MeetingTypeCard = styled(Card)(() => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(13, 71, 161, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

const WEEK_DAYS = [
  { label: 'Monday', num: 1 },
  { label: 'Tuesday', num: 2 },
  { label: 'Wednesday', num: 3 },
  { label: 'Thursday', num: 4 },
  { label: 'Friday', num: 5 },
  { label: 'Saturday', num: 6 },
  { label: 'Sunday', num: 0 },
];

interface LinkSettings {
  meetingTypeId: string;
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

interface BookingItem {
  id: string;
  name: string;
  type: string;
  date: string;
  time: string;
  meetingTypeId: string;
  email?: string;
  notes?: string;
  status?: string;
  endTime?: string;
  video_link?: string | null;
}

function ATSInterviewCard({
  item,
  formatTime,
  formatType,
  onReschedule,
  onCancel,
  onViewProfile,
}: {
  item: { id: string; candidate_name: string; job_title?: string; scheduled_at: string; duration_minutes: number; interview_type: string; interviewers: string[]; candidate_id?: string };
  formatTime: (s: string) => string;
  formatType: (s: string) => string;
  onReschedule: () => void;
  onCancel: () => void;
  onViewProfile: () => void;
}) {
  return (
    <ListItem
      sx={{
        border: '1px solid',
        borderColor: alpha('#0d47a1', 0.15),
        borderRadius: 2,
        mb: 1,
        bgcolor: 'background.paper',
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: alpha('#00897b', 0.15), color: '#00897b' }}>{item.candidate_name.charAt(0)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant="subtitle2" fontWeight={600}>{item.candidate_name}</Typography>}
        secondary={
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="caption" display="block" color="text.secondary">{item.job_title || '—'}</Typography>
            <Typography variant="caption" display="block">{formatType(item.interview_type)} • {formatTime(item.scheduled_at)} ({item.duration_minutes} min)</Typography>
            {item.interviewers?.length > 0 && (
              <Typography variant="caption" color="text.secondary">Interviewers: {item.interviewers.length}</Typography>
            )}
          </Box>
        }
      />
      <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
        <Tooltip title="Reschedule">
          <IconButton size="small" onClick={onReschedule} sx={{ color: '#0d47a1' }}><ScheduleIcon fontSize="small" /></IconButton>
        </Tooltip>
        <Tooltip title="Cancel interview">
          <IconButton size="small" onClick={onCancel} color="error"><DeleteIcon fontSize="small" /></IconButton>
        </Tooltip>
        <Tooltip title="View candidate profile">
          <IconButton size="small" onClick={onViewProfile} disabled={!item.candidate_id}><PersonIcon fontSize="small" /></IconButton>
        </Tooltip>
      </Box>
    </ListItem>
  );
}

const SchedulingPage: React.FC = () => {
  const [showLinkSettings, setShowLinkSettings] = useState(false);
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);
  const [linkSettings, setLinkSettings] = useState<LinkSettings>({
    meetingTypeId: '',
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
  const [realBookings, setRealBookings] = useState<BookingItem[]>([]);
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
  const [schedulingLinks, setSchedulingLinks] = useState<SchedulingLink[]>([]);
  const [totalBookings30d, setTotalBookings30d] = useState(0);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleModalContext, setScheduleModalContext] = useState<ScheduleInterviewContext | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [deleteMeetingTypeConfirm, setDeleteMeetingTypeConfirm] = useState<MeetingType | null>(null);
  const [editingMeetingType, setEditingMeetingType] = useState<MeetingType | null>(null);
  const [meetingTypeForm, setMeetingTypeForm] = useState({
    name: '',
    duration_minutes: 30,
    location_type: 'video',
    description: '',
    is_public: true,
    color: '#0d47a1',
  });
  const [creatingMeetingType, setCreatingMeetingType] = useState(false);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<BookingItem | null>(null);
  const navigate = useNavigate();

  // ATS interviews (scheduled via ATS – show on this page)
  interface ATSInterviewItem {
    id: string;
    application_id: string;
    candidate_id?: string;
    candidate_name: string;
    job_title?: string;
    scheduled_at: string;
    duration_minutes: number;
    interview_type: string;
    interviewers: string[];
    status: string;
  }
  const [atsInterviewsToday, setAtsInterviewsToday] = useState<ATSInterviewItem[]>([]);
  const [atsInterviewsUpcoming, setAtsInterviewsUpcoming] = useState<ATSInterviewItem[]>([]);
  const [atsInterviewsLoading, setAtsInterviewsLoading] = useState(false);
  const [cancelConfirmInterview, setCancelConfirmInterview] = useState<ATSInterviewItem | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const activeSchedulingLink = schedulingLinks.find((link) => link.is_active) || schedulingLinks[0] || null;
  const publicLink = activeSchedulingLink
    ? `${window.location.origin}/book/${activeSchedulingLink.token}`
    : '';

  const getMeetingTypeNameById = (meetingTypeId: string, source: MeetingType[] = meetingTypes) => {
    const found = source.find((mt) => String(mt.id) === String(meetingTypeId));
    return found?.name || meetingTypeId;
  };

  const getMeetingTypeBookingsCount = (meetingTypeId: string) =>
    realBookings.filter((booking) => booking.meetingTypeId === String(meetingTypeId)).length;

  const formatAvailabilityLine = (dayNum: number) => {
    if (!activeSchedulingLink || !activeSchedulingLink.available_days?.includes(dayNum)) {
      return 'Unavailable';
    }
    const start = activeSchedulingLink.start_time || '00:00';
    const end = activeSchedulingLink.end_time || '23:59';
    return `${start} - ${end}`;
  };

  // Fetch real scheduling data
  useEffect(() => {
    fetchSchedulingData();
  }, []);

  // Fetch ATS interviews for Today / Upcoming
  useEffect(() => {
    const fetchAtsInterviews = async () => {
      setAtsInterviewsLoading(true);
      try {
        const list = await interviewService.getMyInterviewsAsInterviewer(true) as any[];
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);
        const today: ATSInterviewItem[] = [];
        const upcoming: ATSInterviewItem[] = [];
        (list || []).forEach((i: any) => {
          let s = String(i.scheduled_at || '').trim();
          if (!s.includes('Z') && !s.includes('+') && !/[-+]\d{2}:?\d{2}$/.test(s)) {
            s = s.replace(' ', 'T');
            if (!s.endsWith('Z')) s += 'Z';
          }
          const d = new Date(s);
          if (Number.isNaN(d.getTime())) return;
          const item: ATSInterviewItem = {
            id: i.id,
            application_id: i.application_id,
            candidate_id: i.candidate_id,
            candidate_name: i.candidate_name || 'Candidate',
            job_title: i.job_title,
            scheduled_at: i.scheduled_at,
            duration_minutes: i.duration_minutes ?? 60,
            interview_type: i.interview_type || 'technical',
            interviewers: Array.isArray(i.interviewers) ? i.interviewers : [],
            status: i.status || 'scheduled',
          };
          if (d >= todayStart && d < todayEnd) {
            today.push(item);
          } else if (d >= now) {
            upcoming.push(item);
          }
        });
        today.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
        upcoming.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
        setAtsInterviewsToday(today);
        setAtsInterviewsUpcoming(upcoming);
      } catch {
        setAtsInterviewsToday([]);
        setAtsInterviewsUpcoming([]);
      } finally {
        setAtsInterviewsLoading(false);
      }
    };
    fetchAtsInterviews();
  }, [scheduleModalOpen]); // refetch when modal closes (after schedule/reschedule)

  const formatInterviewTime = (scheduledAt: string) => {
    let s = String(scheduledAt || '').trim();
    if (!s.includes('Z') && !s.includes('+')) { s = s.replace(' ', 'T'); if (!s.endsWith('Z')) s += 'Z'; }
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? '--' : d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatInterviewType = (type: string) => (type || 'technical').replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const handleRescheduleClick = (item: ATSInterviewItem) => {
    setScheduleModalContext({
      applicationId: item.application_id,
      candidateId: item.candidate_id,
      candidateName: item.candidate_name,
      jobTitle: item.job_title,
    });
    setScheduleModalOpen(true);
  };

  const handleCancelInterview = async () => {
    if (!cancelConfirmInterview) return;
    setCancellingId(cancelConfirmInterview.id);
    try {
      await interviewService.cancelInterview(cancelConfirmInterview.id);
      setSnackbar({ open: true, message: 'Interview cancelled.', severity: 'success' });
      setCancelConfirmInterview(null);
      setAtsInterviewsToday((prev) => prev.filter((i) => i.id !== cancelConfirmInterview.id));
      setAtsInterviewsUpcoming((prev) => prev.filter((i) => i.id !== cancelConfirmInterview.id));
    } catch (e: any) {
      setSnackbar({ open: true, message: e.message || 'Failed to cancel interview', severity: 'error' });
    } finally {
      setCancellingId(null);
    }
  };

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
    
    const requestData: Parameters<typeof calendarService.createSchedulingLink>[0] = {
      duration_minutes: duration,
      start_date: linkSettings.startDate || undefined,
      end_date: linkSettings.endDate || undefined,
      start_time: linkSettings.startTime || undefined,
      end_time: linkSettings.endTime || undefined,
      available_days: linkSettings.availableDays,
      buffer_before: parseInt(linkSettings.bufferBefore) || 0,
      buffer_after: parseInt(linkSettings.bufferAfter) || 0,
      max_bookings: linkSettings.maxBookings ? parseInt(linkSettings.maxBookings) : undefined,
      requires_approval: linkSettings.requireApproval,
      meeting_type_id: linkSettings.meetingTypeId || undefined,
    };

    try {
      if (editingLinkId) {
        await calendarService.updateSchedulingLink(editingLinkId, requestData);
        setSnackbar({ open: true, message: 'Link updated', severity: 'success' });
        setEditingLinkId(null);
        setShowLinkSettings(false);
        setGeneratedLink(null);
        fetchSchedulingData();
      } else {
        const data = await calendarService.createSchedulingLink(requestData);
        const token = (data as any)?.token;
        if (!token) {
          throw new Error('Failed to generate link token');
        }
        const fullUrl = `${window.location.origin}/book/${token}`;
        setGeneratedLink({
          token,
          url: `/book/${token}`,
          full_url: fullUrl,
          expires_at: null,
        });
        const latestLinks = await calendarService.getSchedulingLinks();
        setSchedulingLinks(Array.isArray(latestLinks) ? latestLinks : []);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save link';
      setError(message);
    }

    setGenerating(false);
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
    setEditingLinkId(null);
  };

  const openEditLinkSettings = (link: SchedulingLink) => {
    const startTime = link.start_time ? (typeof link.start_time === 'string' ? link.start_time.slice(0, 5) : '09:00') : '09:00';
    const endTime = link.end_time ? (typeof link.end_time === 'string' ? link.end_time.slice(0, 5) : '17:00') : '17:00';
    setLinkSettings((prev) => ({
      ...prev,
      meetingTypeId: (link as any).meeting_type_id ? String((link as any).meeting_type_id) : '',
      duration: String(link.duration_minutes || 30),
      customDuration: '',
      startDate: link.start_date ? String(link.start_date).slice(0, 10) : new Date().toISOString().split('T')[0],
      endDate: link.end_date ? String(link.end_date).slice(0, 10) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime,
      endTime,
      maxBookings: link.max_bookings != null ? String(link.max_bookings) : '',
      requireApproval: !!(link as any).requires_approval,
      availableDays: Array.isArray(link.available_days) ? link.available_days : [1, 2, 3, 4, 5],
    }));
    setEditingLinkId(link.id);
    setShowLinkSettings(true);
  };

  const openEditMeetingType = (meeting: MeetingType) => {
    setEditingMeetingType(meeting);
    setMeetingTypeForm({
      name: meeting.name,
      duration_minutes: meeting.duration_minutes ?? 30,
      location_type: meeting.location_type || 'video',
      description: (meeting as any).description ?? '',
      is_public: meeting.is_public !== false,
      color: meeting.color || '#0d47a1',
    });
    setShowCreateMeeting(true);
  };

  const fetchSchedulingData = async () => {
    try {
      const [types, links, upcoming, allBookings] = await Promise.all([
        calendarService.getMeetingTypes(),
        calendarService.getSchedulingLinks(),
        calendarService.getBookings({ upcoming_only: true }),
        calendarService.getBookings(),
      ]);
      setMeetingTypes(Array.isArray(types) ? types : []);
      setSchedulingLinks(Array.isArray(links) ? links : []);

      const bookingItems = (upcoming || []).map((booking: Booking) => {
        // Backend returns start_time as UTC (often without Z); treat as UTC so local time displays correctly
        const rawStart = booking.start_time;
        const utcStart = typeof rawStart === 'string' && !/Z|[+-]\d{2}:?\d{2}$/.test(rawStart) ? `${rawStart.replace(' ', 'T')}Z` : rawStart;
        const scheduledAt = new Date(utcStart);
        const rawEnd = booking.end_time;
        const utcEnd = typeof rawEnd === 'string' && !/Z|[+-]\d{2}:?\d{2}$/.test(rawEnd) ? `${rawEnd.replace(' ', 'T')}Z` : rawEnd;
        const endAt = new Date(utcEnd);
        return {
          id: String(booking.id),
          name: booking.invitee_name || booking.invitee_email,
          type: getMeetingTypeNameById(String(booking.meeting_type_id), Array.isArray(types) ? types : []),
          date: scheduledAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: scheduledAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          meetingTypeId: String(booking.meeting_type_id),
          email: booking.invitee_email,
          notes: (booking as any).invitee_notes ?? (booking as any).notes ?? undefined,
          status: booking.status,
          endTime: endAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          video_link: (booking as any).video_link ?? null,
        };
      });
      setRealBookings(bookingItems);

      const now = new Date();
      const last30 = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      const count30 = (allBookings || []).filter((booking: Booking) => {
        const createdAt = new Date(booking.created_at);
        return !Number.isNaN(createdAt.getTime()) && createdAt >= last30 && createdAt <= now;
      }).length;
      setTotalBookings30d(count30);
    } catch (err) {
      console.warn('Could not fetch scheduling data:', err);
    }
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
            onClick={() => { setScheduleModalContext(null); setScheduleModalOpen(true); }}
          >
            Schedule Interview
          </Button>
        </Box>
      </Box>

      {/* ATS Interviews – Today & Upcoming */}
      {/* <Paper sx={{ p: 2, mb: 3, bgcolor: alpha('#00897b', 0.04), border: '1px solid rgba(0, 137, 123, 0.2)' }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#00897b' }}>
          Interview Schedule (ATS)
        </Typography>
        {atsInterviewsLoading ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <CircularProgress size={28} sx={{ color: '#00897b' }} />
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                Today&apos;s Interviews ({atsInterviewsToday.length})
              </Typography>
              {atsInterviewsToday.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No interviews scheduled for today.</Typography>
              ) : (
                <List dense disablePadding>
                  {atsInterviewsToday.map((item) => (
                    <ATSInterviewCard
                      key={item.id}
                      item={item}
                      formatTime={formatInterviewTime}
                      formatType={formatInterviewType}
                      onReschedule={() => handleRescheduleClick(item)}
                      onCancel={() => setCancelConfirmInterview(item)}
                      onViewProfile={() => item.candidate_id && navigate(`/techie/ats/candidate/${item.candidate_id}`)}
                    />
                  ))}
                </List>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                Upcoming Interviews ({atsInterviewsUpcoming.length})
              </Typography>
              {atsInterviewsUpcoming.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No upcoming interviews.</Typography>
              ) : (
                <List dense disablePadding>
                  {atsInterviewsUpcoming.map((item) => (
                    <ATSInterviewCard
                      key={item.id}
                      item={item}
                      formatTime={formatInterviewTime}
                      formatType={formatInterviewType}
                      onReschedule={() => handleRescheduleClick(item)}
                      onCancel={() => setCancelConfirmInterview(item)}
                      onViewProfile={() => item.candidate_id && navigate(`/techie/ats/candidate/${item.candidate_id}`)}
                    />
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
        )}
      </Paper> */}

      {/* Scheduling Link */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: alpha('#0d47a1', 0.03), border: '1px solid rgba(13, 71, 161, 0.1)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LinkIcon sx={{ color: '#0d47a1' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Your Scheduling Link</Typography>
              <Typography variant="body1" fontWeight={600} color="#0d47a1">
                {publicLink || 'No scheduling link created'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Tooltip title="Create Custom Link with Constraints">
              <IconButton onClick={() => setShowLinkSettings(true)} sx={{ bgcolor: alpha('#0d47a1', 0.1) }}>
                <SettingsIcon sx={{ color: '#0d47a1' }} />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              disabled={!publicLink}
              onClick={() => publicLink && navigator.clipboard.writeText(publicLink)}
            >
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
            <Typography variant="h4" fontWeight={700} color="#0d47a1">
              {meetingTypes.filter((m) => m.is_active).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Active Meeting Types</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="#34C759">--</Typography>
            <Typography variant="body2" color="text.secondary">Calendars Connected</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="#5856D6">{realBookings.length}</Typography>
            <Typography variant="body2" color="text.secondary">Upcoming Bookings</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="#FF9500">{totalBookings30d}</Typography>
            <Typography variant="body2" color="text.secondary">Total Bookings (30d)</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Meeting Types */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>Meeting Types</Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={() => setShowCreateMeeting(true)}>Add New</Button>
          </Box>
          <Grid container spacing={2}>
            {meetingTypes.map((meeting) => (
              <Grid item xs={12} sm={6} key={meeting.id}>
                <MeetingTypeCard sx={{ opacity: meeting.is_active ? 1 : 0.6 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                      <Box sx={{ width: 8, height: 40, bgcolor: meeting.color || '#0d47a1', borderRadius: 1 }} />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight={600}>{meeting.name}</Typography>
                          <Chip
                            label={meeting.is_active ? 'Active' : 'Inactive'}
                            size="small"
                            sx={{
                              bgcolor: alpha(meeting.is_active ? '#34C759' : '#8E8E93', 0.1),
                              color: meeting.is_active ? '#34C759' : '#8E8E93',
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">{meeting.duration_minutes} min</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <VideocamIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">{meeting.location_type}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                      <Chip label={meeting.is_public ? 'Public' : 'Private'} size="small" variant="outlined" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {getMeetingTypeBookingsCount(String(meeting.id))} bookings
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Copy booking link">
                          <IconButton size="small" onClick={() => { if (publicLink) { navigator.clipboard.writeText(publicLink); setSnackbar({ open: true, message: 'Link copied', severity: 'success' }); } else { setSnackbar({ open: true, message: 'Create a scheduling link first', severity: 'info' }); } }}><ContentCopyIcon fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEditMeetingType(meeting)}><EditIcon fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => setDeleteMeetingTypeConfirm(meeting)}><DeleteIcon fontSize="small" /></IconButton>
                        </Tooltip>
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
              <Button size="small" startIcon={<EditIcon />} disabled={!activeSchedulingLink} onClick={() => activeSchedulingLink && openEditLinkSettings(activeSchedulingLink)}>Edit</Button>
            </Box>
            {WEEK_DAYS.map((day) => {
              const line = formatAvailabilityLine(day.num);
              const available = line !== 'Unavailable';
              return (
                <Box key={day.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <Typography variant="body2" fontWeight={available ? 500 : 400} color={available ? 'text.primary' : 'text.disabled'}>
                    {day.label}
                  </Typography>
                  <Typography variant="body2" color={available ? 'text.secondary' : 'text.disabled'}>
                    {line}
                  </Typography>
                </Box>
              );
            })}
            {!activeSchedulingLink && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Create a scheduling link to define availability.
              </Typography>
            )}
          </Paper>

          {/* Connected Calendars */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>Connected Calendars</Typography>
              <Button size="small" startIcon={<AddIcon />} disabled>Connect</Button>
            </Box>
            <List dense>
              <ListItem>
                <ListItemIcon><EventBusyIcon color="disabled" /></ListItemIcon>
                <ListItemText primary="No connected calendars" secondary="Calendar connections are not configured yet." />
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
              {realBookings.length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No upcoming bookings</Typography>
                </Box>
              ) : null}
              {realBookings.map((booking) => (
                <ListItem
                  key={booking.id}
                  sx={{ px: 0, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: alpha('#0d47a1', 0.04) } }}
                  onClick={() => { setSelectedBookingDetail(booking); setBookingDetailsOpen(true); }}
                >
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
              <Typography variant="h6" fontWeight={600}>{editingLinkId ? 'Edit availability & time' : 'Create Custom Scheduling Link'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {editingLinkId ? 'Update date, time, and booking constraints' : 'Generate a unique booking link with specific date, time, and booking constraints'}
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
            {/* Meeting Type (so bookings work when candidate uses link) */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ fontSize: 18, color: '#0d47a1' }} /> Meeting type
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={linkSettings.meetingTypeId}
                  onChange={(e) => setLinkSettings((s) => ({ ...s, meetingTypeId: e.target.value }))}
                  displayEmpty
                >
                  <MenuItem value="">Select meeting type (required for booking)</MenuItem>
                  {meetingTypes.map((mt) => (
                    <MenuItem key={mt.id} value={mt.id}>{mt.name} ({mt.duration_minutes} min)</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

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
            {generating ? (editingLinkId ? 'Saving...' : 'Generating...') : (editingLinkId ? 'Save changes' : 'Generate Unique Link')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create / Edit Meeting Type Dialog */}
      <Dialog
        open={showCreateMeeting}
        onClose={() => { setShowCreateMeeting(false); setEditingMeetingType(null); setMeetingTypeForm({ name: '', duration_minutes: 30, location_type: 'video', description: '', is_public: true, color: '#0d47a1' }); }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>{editingMeetingType ? 'Edit Meeting Type' : 'Create Meeting Type'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Meeting Name"
              placeholder="e.g., 30 Minute Consultation"
              value={meetingTypeForm.name}
              onChange={(e) => setMeetingTypeForm((f) => ({ ...f, name: e.target.value }))}
              sx={{ mb: 3 }}
            />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  value={meetingTypeForm.duration_minutes}
                  onChange={(e) => setMeetingTypeForm((f) => ({ ...f, duration_minutes: parseInt(e.target.value, 10) || 30 }))}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Select
                    value={meetingTypeForm.location_type}
                    onChange={(e) => setMeetingTypeForm((f) => ({ ...f, location_type: e.target.value }))}
                  >
                    <MenuItem value="video">Video</MenuItem>
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
              value={meetingTypeForm.description}
              onChange={(e) => setMeetingTypeForm((f) => ({ ...f, description: e.target.value }))}
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={meetingTypeForm.is_public}
                    onChange={(e) => setMeetingTypeForm((f) => ({ ...f, is_public: e.target.checked }))}
                  />
                }
                label="Public (bookable via link)"
              />
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: meetingTypeForm.color }} />
              <Typography variant="body2" color="text.secondary">Color</Typography>
              <TextField
                size="small"
                type="color"
                value={meetingTypeForm.color}
                onChange={(e) => setMeetingTypeForm((f) => ({ ...f, color: e.target.value }))}
                sx={{ width: 60, height: 36, p: 0 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => { setShowCreateMeeting(false); setEditingMeetingType(null); }}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!meetingTypeForm.name.trim() || creatingMeetingType}
            sx={{ bgcolor: '#0d47a1' }}
            onClick={async () => {
              setCreatingMeetingType(true);
              try {
                if (editingMeetingType) {
                  await calendarService.updateMeetingType(editingMeetingType.id, {
                    name: meetingTypeForm.name,
                    duration_minutes: meetingTypeForm.duration_minutes,
                    location_type: meetingTypeForm.location_type,
                    description: meetingTypeForm.description || undefined,
                    is_public: meetingTypeForm.is_public,
                    color: meetingTypeForm.color,
                  });
                  setSnackbar({ open: true, message: 'Meeting type updated', severity: 'success' });
                } else {
                  await calendarService.createMeetingType({
                    name: meetingTypeForm.name,
                    duration_minutes: meetingTypeForm.duration_minutes,
                    location_type: meetingTypeForm.location_type,
                    description: meetingTypeForm.description || undefined,
                    color: meetingTypeForm.color,
                  });
                  setSnackbar({ open: true, message: 'Meeting type created', severity: 'success' });
                }
                setShowCreateMeeting(false);
                setEditingMeetingType(null);
                setMeetingTypeForm({ name: '', duration_minutes: 30, location_type: 'video', description: '', is_public: true, color: '#0d47a1' });
                fetchSchedulingData();
              } catch (err) {
                setSnackbar({ open: true, message: err instanceof Error ? err.message : 'Failed to save', severity: 'error' });
              } finally {
                setCreatingMeetingType(false);
              }
            }}
          >
            {creatingMeetingType ? (editingMeetingType ? 'Saving...' : 'Creating...') : (editingMeetingType ? 'Save changes' : 'Create Meeting Type')}
          </Button>
        </DialogActions>
      </Dialog>

      <ScheduleInterviewModal
        open={scheduleModalOpen}
        onClose={() => { setScheduleModalOpen(false); setScheduleModalContext(null); }}
        onSuccess={() => setSnackbar({ open: true, message: 'Interview scheduled successfully!', severity: 'success' })}
        onError={(msg) => setSnackbar({ open: true, message: msg, severity: 'error' })}
        context={scheduleModalContext}
        allowSelectApplication={!scheduleModalContext}
      />

      {/* Booking details popup */}
      <Dialog open={bookingDetailsOpen} onClose={() => { setBookingDetailsOpen(false); setSelectedBookingDetail(null); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon sx={{ color: '#0d47a1' }} />
            <Typography variant="h6" fontWeight={600}>Booking details</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedBookingDetail && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha('#0d47a1', 0.15), color: '#0d47a1', width: 48, height: 48 }}>
                  {selectedBookingDetail.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>{selectedBookingDetail.name}</Typography>
                  {selectedBookingDetail.email && (
                    <Typography variant="body2" color="text.secondary">{selectedBookingDetail.email}</Typography>
                  )}
                </Box>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" color="text.secondary">Meeting type</Typography>
                <Typography variant="body2" fontWeight={500}>{selectedBookingDetail.type}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Date & time</Typography>
                <Typography variant="body2" fontWeight={500}>
                  {selectedBookingDetail.date} at {selectedBookingDetail.time}
                  {selectedBookingDetail.endTime && ` – ${selectedBookingDetail.endTime}`}
                </Typography>
              </Box>
              {selectedBookingDetail.status && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Typography variant="body2" fontWeight={500} sx={{ textTransform: 'capitalize' }}>{selectedBookingDetail.status}</Typography>
                </Box>
              )}
              {selectedBookingDetail.notes && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Notes</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{selectedBookingDetail.notes}</Typography>
                </Box>
              )}
              {selectedBookingDetail.video_link && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Meeting link (use this to connect with the candidate on the booked date)</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    href={selectedBookingDetail.video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 0.5 }}
                  >
                    Join meeting
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <Button onClick={() => { setBookingDetailsOpen(false); setSelectedBookingDetail(null); }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete meeting type confirmation */}
      <Dialog open={Boolean(deleteMeetingTypeConfirm)} onClose={() => setDeleteMeetingTypeConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete meeting type?</DialogTitle>
        <DialogContent>
          {deleteMeetingTypeConfirm && (
            <Typography variant="body2" color="text.secondary">
              Delete &quot;{deleteMeetingTypeConfirm.name}&quot;? This cannot be undone.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteMeetingTypeConfirm(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              if (!deleteMeetingTypeConfirm) return;
              try {
                await calendarService.deleteMeetingType(deleteMeetingTypeConfirm.id);
                setSnackbar({ open: true, message: 'Meeting type deleted', severity: 'success' });
                setDeleteMeetingTypeConfirm(null);
                fetchSchedulingData();
              } catch (err) {
                setSnackbar({ open: true, message: err instanceof Error ? err.message : 'Failed to delete', severity: 'error' });
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel interview confirmation */}
      <Dialog open={Boolean(cancelConfirmInterview)} onClose={() => setCancelConfirmInterview(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Cancel interview?</DialogTitle>
        <DialogContent>
          {cancelConfirmInterview && (
            <Typography variant="body2" color="text.secondary">
              Cancel the interview with <strong>{cancelConfirmInterview.candidate_name}</strong> ({formatInterviewTime(cancelConfirmInterview.scheduled_at)})? The candidate will be notified.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelConfirmInterview(null)}>Keep</Button>
          <Button variant="contained" color="error" onClick={handleCancelInterview} disabled={Boolean(cancellingId)}>
            {cancellingId ? <CircularProgress size={20} /> : 'Cancel interview'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ATSLayout>
  );
};

export default SchedulingPage;
