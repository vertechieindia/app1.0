/**
 * CalendarPage - Advanced Calendar with Premium Features
 * Surpassing Google & Microsoft Calendar functionality
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, IconButton, Chip, FormControl, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText, 
  ListItemSecondaryAction, Checkbox, Tooltip, TextField, InputLabel, Alert, Avatar, 
  Badge, Drawer, Tabs, Tab, Switch, Slider, Collapse, Fade, Zoom, Grow, InputAdornment,
  ToggleButton, ToggleButtonGroup, Divider, LinearProgress, AvatarGroup, SpeedDial, SpeedDialAction,
} from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import FilterListIcon from '@mui/icons-material/FilterList';
import SyncIcon from '@mui/icons-material/Sync';
import AddIcon from '@mui/icons-material/Add';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RepeatIcon from '@mui/icons-material/Repeat';
import PeopleIcon from '@mui/icons-material/People';
import VideocamIcon from '@mui/icons-material/Videocam';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LabelIcon from '@mui/icons-material/Label';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import WorkIcon from '@mui/icons-material/Work';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import FlightIcon from '@mui/icons-material/Flight';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SchoolIcon from '@mui/icons-material/School';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ATSLayout from './ATSLayout';

// Animations
const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const slideInAnimation = keyframes`
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const currentTimeAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

// Event categories with colors and icons
const EVENT_CATEGORIES = {
  meeting: { color: '#0d47a1', bg: '#E3F2FD', icon: <PeopleIcon />, label: 'Meeting' },
  interview: { color: '#1565C0', bg: '#BBDEFB', icon: <WorkIcon />, label: 'Interview' },
  personal: { color: '#7B1FA2', bg: '#F3E5F5', icon: <EventIcon />, label: 'Personal' },
  travel: { color: '#00838F', bg: '#E0F7FA', icon: <FlightIcon />, label: 'Travel' },
  health: { color: '#C62828', bg: '#FFEBEE', icon: <LocalHospitalIcon />, label: 'Health' },
  learning: { color: '#F57C00', bg: '#FFF3E0', icon: <SchoolIcon />, label: 'Learning' },
  celebration: { color: '#AD1457', bg: '#FCE4EC', icon: <CelebrationIcon />, label: 'Celebration' },
  focus: { color: '#2E7D32', bg: '#E8F5E9', icon: <FitnessCenterIcon />, label: 'Focus Time' },
  break: { color: '#5D4037', bg: '#EFEBE9', icon: <FreeBreakfastIcon />, label: 'Break' },
  external: { color: '#455A64', bg: '#ECEFF1', icon: <GoogleIcon />, label: 'External' },
};

// Styled Components
const CalendarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 280px)',
  minHeight: 600,
  background: '#fff',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: 280,
  borderRight: '1px solid rgba(13, 71, 161, 0.1)',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  background: 'linear-gradient(180deg, #fafbfc 0%, #fff 100%)',
}));

const MainCalendar = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 24px',
  borderBottom: '1px solid rgba(13, 71, 161, 0.08)',
  background: '#fff',
}));

const MiniCalendar = styled(Box)(({ theme }) => ({
  background: '#fff',
  borderRadius: 12,
  padding: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
}));

const MiniCalendarGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 2,
}));

const MiniDayCell = styled(Box)<{ isToday?: boolean; isSelected?: boolean; hasEvents?: boolean; isCurrentMonth?: boolean }>(
  ({ isToday, isSelected, hasEvents, isCurrentMonth }) => ({
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    fontSize: '0.75rem',
    cursor: 'pointer',
    position: 'relative',
    fontWeight: isToday || isSelected ? 600 : 400,
    color: isSelected ? '#fff' : isToday ? '#0d47a1' : isCurrentMonth ? '#333' : '#bbb',
    background: isSelected ? '#0d47a1' : isToday ? alpha('#0d47a1', 0.1) : 'transparent',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: isSelected ? '#0d47a1' : alpha('#0d47a1', 0.15),
    },
    '&::after': hasEvents && !isSelected ? {
      content: '""',
      position: 'absolute',
      bottom: 2,
      width: 4,
      height: 4,
      borderRadius: '50%',
      background: '#0d47a1',
    } : {},
  })
);

const WeekGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '60px repeat(7, 1fr)',
  flex: 1,
  overflow: 'auto',
  position: 'relative',
}));

const TimeColumn = styled(Box)(() => ({
  position: 'sticky',
  left: 0,
  background: '#fff',
  zIndex: 10,
  borderRight: '1px solid rgba(13, 71, 161, 0.08)',
}));

const DayColumn = styled(Box)<{ isToday?: boolean }>(({ isToday }) => ({
  borderRight: '1px solid rgba(13, 71, 161, 0.05)',
  position: 'relative',
  background: isToday ? alpha('#0d47a1', 0.02) : 'transparent',
  '&:last-child': { borderRight: 'none' },
}));

const TimeSlot = styled(Box)<{ isNow?: boolean }>(({ isNow }) => ({
  height: 60,
  borderBottom: '1px solid rgba(13, 71, 161, 0.05)',
  position: 'relative',
  cursor: 'pointer',
  transition: 'background 0.15s ease',
  '&:hover': {
    background: alpha('#0d47a1', 0.04),
  },
}));

const TimeLabel = styled(Typography)(() => ({
  fontSize: '0.7rem',
  color: '#888',
  padding: '4px 8px',
  textAlign: 'right',
  height: 60,
  borderBottom: '1px solid rgba(13, 71, 161, 0.05)',
}));

const CurrentTimeLine = styled(Box)(() => ({
  position: 'absolute',
  left: 0,
  right: 0,
  height: 2,
  background: '#E53935',
  zIndex: 20,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: -5,
    top: -4,
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#E53935',
    animation: `${currentTimeAnimation} 2s ease-in-out infinite`,
  },
}));

const EventBlock = styled(Box)<{ category: string; duration: number }>(({ category, duration }) => {
  const cat = EVENT_CATEGORIES[category as keyof typeof EVENT_CATEGORIES] || EVENT_CATEGORIES.meeting;
  return {
    position: 'absolute',
    left: 4,
    right: 4,
    minHeight: Math.max(duration, 20),
    background: `linear-gradient(135deg, ${cat.bg} 0%, ${alpha(cat.color, 0.15)} 100%)`,
    borderLeft: `3px solid ${cat.color}`,
    borderRadius: '0 6px 6px 0',
    padding: '4px 8px',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    zIndex: 5,
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 15,
    },
  };
});

const AgendaItem = styled(Box)<{ category: string }>(({ category }) => {
  const cat = EVENT_CATEGORIES[category as keyof typeof EVENT_CATEGORIES] || EVENT_CATEGORIES.meeting;
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 12,
    background: cat.bg,
    borderLeft: `4px solid ${cat.color}`,
    marginBottom: 8,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateX(4px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
  };
});

const QuickActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  textTransform: 'none',
  padding: '6px 16px',
  fontSize: '0.85rem',
  fontWeight: 500,
}));

const ViewToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: 'none',
  borderRadius: '8px !important',
  padding: '6px 12px',
  '&.Mui-selected': {
    background: alpha('#0d47a1', 0.1),
    color: '#0d47a1',
  },
}));

const UpcomingEventCard = styled(Box)(({ theme }) => ({
  padding: 12,
  borderRadius: 10,
  background: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  marginBottom: 8,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: '1px solid rgba(13, 71, 161, 0.08)',
  '&:hover': {
    borderColor: '#0d47a1',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
}));

// Types
interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  endTime?: string;
  duration: number;
  type: string;
  category: string;
  description?: string;
  location?: string;
  attendees?: { name: string; avatar?: string; status: 'accepted' | 'pending' | 'declined' }[];
  isRecurring?: boolean;
  recurrenceRule?: string;
  reminder?: number;
  videoLink?: string;
  attachments?: { name: string; url: string }[];
  color?: string;
  isAllDay?: boolean;
  priority?: 'low' | 'medium' | 'high';
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

// Sample events with enhanced data
const initialEvents: CalendarEvent[] = [
  { 
    id: 1, 
    title: 'Technical Interview - Sarah Johnson', 
    date: '2025-12-28', 
    time: '10:00', 
    endTime: '11:00',
    duration: 60, 
    type: 'vertechie', 
    category: 'interview',
    location: 'VerTechie Video',
    videoLink: '/techie/lobby/vt-interview-001?type=interview&title=Technical%20Interview%20-%20Frontend%20Dev',
    attendees: [
      { name: 'Sarah Johnson', status: 'accepted' },
      { name: 'John Doe', status: 'accepted' },
    ],
    reminder: 15,
    priority: 'high',
  },
  { 
    id: 2, 
    title: 'Daily Standup', 
    date: '2025-12-28', 
    time: '09:00', 
    duration: 30, 
    type: 'google', 
    category: 'meeting',
    isRecurring: true,
    recurrenceRule: 'FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR',
    videoLink: '/techie/lobby/vt-standup-daily?type=meeting&title=Daily%20Standup',
    attendees: [
      { name: 'Team Alpha', status: 'accepted' },
    ],
  },
  { 
    id: 3, 
    title: 'Product Review', 
    date: '2025-12-28', 
    time: '14:00', 
    duration: 60, 
    type: 'microsoft', 
    category: 'meeting',
    location: 'Conference Room A',
    attendees: [
      { name: 'Product Team', status: 'accepted' },
      { name: 'Engineering', status: 'pending' },
    ],
  },
  { 
    id: 4, 
    title: 'Lunch Break', 
    date: '2025-12-28', 
    time: '12:00', 
    duration: 60, 
    type: 'vertechie', 
    category: 'break',
  },
  { 
    id: 5, 
    title: 'Focus Time - Coding', 
    date: '2025-12-28', 
    time: '15:30', 
    duration: 90, 
    type: 'vertechie', 
    category: 'focus',
    description: 'Deep work session - no meetings',
  },
  { 
    id: 6, 
    title: 'Interview - Mike Chen', 
    date: '2025-12-29', 
    time: '11:00', 
    duration: 45, 
    type: 'vertechie', 
    category: 'interview',
    priority: 'high',
  },
  { 
    id: 7, 
    title: 'Sprint Planning', 
    date: '2025-12-30', 
    time: '10:00', 
    duration: 120, 
    type: 'google', 
    category: 'meeting',
    isRecurring: true,
    attendees: [
      { name: 'Scrum Team', status: 'accepted' },
    ],
  },
  { 
    id: 8, 
    title: 'HR Sync', 
    date: '2025-12-30', 
    time: '15:00', 
    duration: 30, 
    type: 'microsoft', 
    category: 'meeting',
  },
  { 
    id: 9, 
    title: 'Final Interview - Alex Kim', 
    date: '2025-12-31', 
    time: '14:00', 
    duration: 60, 
    type: 'vertechie', 
    category: 'interview',
    priority: 'high',
  },
  { 
    id: 10, 
    title: 'Year-end Review', 
    date: '2025-12-31', 
    time: '16:00', 
    duration: 60, 
    type: 'google', 
    category: 'meeting',
  },
  { 
    id: 11, 
    title: 'New Year Celebration', 
    date: '2025-12-31', 
    time: '18:00', 
    duration: 120, 
    type: 'vertechie', 
    category: 'celebration',
    location: 'Office Rooftop',
  },
];

// Weather data (mock)
const weatherData: { [key: string]: { temp: number; condition: 'sunny' | 'cloudy' | 'cold' } } = {
  '2025-12-28': { temp: 72, condition: 'sunny' },
  '2025-12-29': { temp: 68, condition: 'cloudy' },
  '2025-12-30': { temp: 65, condition: 'cloudy' },
  '2025-12-31': { temp: 58, condition: 'cold' },
};

const CalendarPage: React.FC = () => {
  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'agenda' | 'schedule'>('week');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<string[]>(Object.keys(EVENT_CATEGORIES));
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [workingHours, setWorkingHours] = useState({ start: 9, end: 18 });
  const [showWeekends, setShowWeekends] = useState(true);
  const [is24Hour, setIs24Hour] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '09:00',
    duration: 30,
    category: 'meeting',
    location: '',
    description: '',
    isRecurring: false,
    reminder: 15,
    videoLink: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Computed values
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  // Get week days for current view
  const getWeekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }, [currentDate]);

  // Get mini calendar days
  const getMiniCalendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = new Date();

    const days: { date: Date; isCurrentMonth: boolean; isToday: boolean }[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  }, [currentDate]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilters.includes(event.category);
      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, categoryFilters]);

  // Get events for a specific date
  const getEventsForDate = useCallback((date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return filteredEvents.filter(e => e.date === dateStr);
  }, [filteredEvents]);

  // Get upcoming events
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return filteredEvents
      .filter(e => e.date >= todayStr)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      })
      .slice(0, 5);
  }, [filteredEvents]);

  // Navigation
  const navigate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setDate(newDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Event handlers
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsCreating(false);
    setShowEventDialog(true);
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setNewEvent({
      ...newEvent,
      date: dateStr,
      time: `${String(hour).padStart(2, '0')}:00`,
    });
    setSelectedEvent(null);
    setIsCreating(true);
    setShowEventDialog(true);
  };

  // Generate VerTechie video link
  const generateVideoLink = () => {
    const roomId = `vt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const meetingType = newEvent.category === 'interview' ? 'interview' : 'meeting';
    return `${window.location.origin}/techie/lobby/${roomId}?type=${meetingType}&title=${encodeURIComponent(newEvent.title || 'Meeting')}`;
  };

  const handleCreateEvent = () => {
    // Auto-generate video link for meetings and interviews if not already set
    let videoLink = newEvent.videoLink;
    if (!videoLink && ['meeting', 'interview'].includes(newEvent.category)) {
      videoLink = generateVideoLink();
    }
    
    const event: CalendarEvent = {
      id: Date.now(),
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      duration: newEvent.duration,
      type: 'vertechie',
      category: newEvent.category,
      location: newEvent.location,
      description: newEvent.description,
      isRecurring: newEvent.isRecurring,
      reminder: newEvent.reminder,
      videoLink: videoLink,
      priority: newEvent.priority,
    };
    setEvents([...events, event]);
    setShowEventDialog(false);
    setNewEvent({
      title: '',
      date: '',
      time: '09:00',
      duration: 30,
      category: 'meeting',
      location: '',
      description: '',
      isRecurring: false,
      reminder: 15,
      videoLink: '',
      priority: 'medium',
    });
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(e => e.id !== eventId));
    setShowEventDialog(false);
    setSelectedEvent(null);
  };

  // Format time
  const formatTime = (time: string) => {
    if (is24Hour) return time;
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  // Get current time position
  const getCurrentTimePosition = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return (hours * 60 + minutes) * (60 / 60); // 60px per hour
  };

  // Render header text
  const getHeaderText = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } else if (viewMode === 'week') {
      const weekStart = getWeekDays[0];
      const weekEnd = getWeekDays[6];
      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
      }
      return `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()} - ${monthNames[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
    }
    return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  // Render weather icon
  const WeatherIcon = ({ condition }: { condition: string }) => {
    switch (condition) {
      case 'sunny': return <WbSunnyIcon sx={{ fontSize: 16, color: '#FFA000' }} />;
      case 'cloudy': return <CloudIcon sx={{ fontSize: 16, color: '#78909C' }} />;
      case 'cold': return <AcUnitIcon sx={{ fontSize: 16, color: '#29B6F6' }} />;
      default: return null;
    }
  };

  return (
    <ATSLayout>
      {/* Top Actions Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" fontWeight={700} color="primary">
            Calendar
          </Typography>
          <Chip 
            label={`${filteredEvents.length} events`} 
            size="small" 
            sx={{ bgcolor: alpha('#0d47a1', 0.1), color: '#0d47a1' }} 
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Keyboard shortcuts">
            <IconButton size="small"><KeyboardIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Print calendar">
            <IconButton size="small"><PrintIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Share calendar">
            <IconButton size="small"><ShareIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton size="small" onClick={() => setShowSettings(true)}><SettingsIcon /></IconButton>
          </Tooltip>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => { setIsCreating(true); setSelectedEvent(null); setShowEventDialog(true); }}
            sx={{ bgcolor: '#0d47a1', borderRadius: 20 }}
          >
            New Event
          </Button>
        </Box>
      </Box>

      <CalendarContainer>
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar>
            {/* Mini Calendar */}
            <MiniCalendar>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Typography>
                <Box>
                  <IconButton size="small" onClick={() => navigate(-1)}><ChevronLeftIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => navigate(1)}><ChevronRightIcon fontSize="small" /></IconButton>
                </Box>
              </Box>
              <MiniCalendarGrid>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <Typography key={i} variant="caption" sx={{ textAlign: 'center', color: '#888', fontSize: '0.65rem' }}>
                    {d}
                  </Typography>
                ))}
                {getMiniCalendarDays.map((day, idx) => {
                  const dateEvents = getEventsForDate(day.date);
                  return (
                    <MiniDayCell
                      key={idx}
                      isToday={day.isToday}
                      isSelected={day.date.toDateString() === selectedDate.toDateString()}
                      hasEvents={dateEvents.length > 0}
                      isCurrentMonth={day.isCurrentMonth}
                      onClick={() => {
                        setSelectedDate(day.date);
                        setCurrentDate(day.date);
                      }}
                    >
                      {day.date.getDate()}
                    </MiniDayCell>
                  );
                })}
              </MiniCalendarGrid>
            </MiniCalendar>

            {/* Search */}
            <TextField
              placeholder="Search events..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#888', mr: 1, fontSize: 20 }} />,
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': { borderRadius: 20, bgcolor: '#fff' }
              }}
            />

            {/* Categories */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Categories
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {Object.entries(EVENT_CATEGORIES).map(([key, cat]) => (
                  <Box 
                    key={key}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      p: 0.5, 
                      borderRadius: 1,
                      cursor: 'pointer',
                      opacity: categoryFilters.includes(key) ? 1 : 0.5,
                      '&:hover': { bgcolor: alpha(cat.color, 0.05) },
                    }}
                    onClick={() => {
                      if (categoryFilters.includes(key)) {
                        setCategoryFilters(categoryFilters.filter(c => c !== key));
                      } else {
                        setCategoryFilters([...categoryFilters, key]);
                      }
                    }}
                  >
                    <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: cat.color }} />
                    <Typography variant="caption">{cat.label}</Typography>
                    <Typography variant="caption" sx={{ ml: 'auto', color: '#888' }}>
                      {events.filter(e => e.category === key).length}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Upcoming Events */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Upcoming
              </Typography>
              {upcomingEvents.map(event => {
                const cat = EVENT_CATEGORIES[event.category as keyof typeof EVENT_CATEGORIES] || EVENT_CATEGORIES.meeting;
                return (
                  <UpcomingEventCard key={event.id} onClick={() => handleEventClick(event)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: cat.color }} />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {event.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(event.time)} • {event.duration} min
                    </Typography>
                  </UpcomingEventCard>
                );
              })}
            </Box>
          </Sidebar>
        )}

        {/* Main Calendar Area */}
        <MainCalendar>
          {/* Calendar Header */}
          <CalendarHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => setShowSidebar(!showSidebar)} size="small">
                {showSidebar ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
              <IconButton onClick={() => navigate(-1)}><ChevronLeftIcon /></IconButton>
              <Typography variant="h6" fontWeight={600} sx={{ minWidth: 280, textAlign: 'center' }}>
                {getHeaderText()}
              </Typography>
              <IconButton onClick={() => navigate(1)}><ChevronRightIcon /></IconButton>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={goToToday}
                sx={{ borderRadius: 20, textTransform: 'none' }}
              >
                Today
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, v) => v && setViewMode(v)}
                size="small"
              >
                <ViewToggleButton value="day">
                  <Tooltip title="Day"><ViewDayIcon fontSize="small" /></Tooltip>
                </ViewToggleButton>
                <ViewToggleButton value="week">
                  <Tooltip title="Week"><ViewWeekIcon fontSize="small" /></Tooltip>
                </ViewToggleButton>
                <ViewToggleButton value="month">
                  <Tooltip title="Month"><CalendarViewMonthIcon fontSize="small" /></Tooltip>
                </ViewToggleButton>
                <ViewToggleButton value="agenda">
                  <Tooltip title="Agenda"><ViewAgendaIcon fontSize="small" /></Tooltip>
                </ViewToggleButton>
                <ViewToggleButton value="schedule">
                  <Tooltip title="Schedule"><ScheduleIcon fontSize="small" /></Tooltip>
                </ViewToggleButton>
              </ToggleButtonGroup>

              <IconButton onClick={() => setShowFilters(true)} size="small">
                <Badge badgeContent={Object.keys(EVENT_CATEGORIES).length - categoryFilters.length} color="primary">
                  <FilterListIcon />
                </Badge>
              </IconButton>
            </Box>
          </CalendarHeader>

          {/* Week View */}
          {viewMode === 'week' && (
            <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Day Headers */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid rgba(13, 71, 161, 0.1)' }}>
                <Box sx={{ p: 1 }} />
                {getWeekDays.map((day, idx) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  const weather = weatherData[`${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`];
                  const dayEvents = getEventsForDate(day);
                  return (
                    <Box 
                      key={idx} 
                      sx={{ 
                        p: 1.5, 
                        textAlign: 'center',
                        bgcolor: isToday ? alpha('#0d47a1', 0.05) : 'transparent',
                        borderLeft: '1px solid rgba(13, 71, 161, 0.05)',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        {dayNames[day.getDay()]}
                        {weather && <WeatherIcon condition={weather.condition} />}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        fontWeight={isToday ? 700 : 500} 
                        sx={{ 
                          color: isToday ? '#0d47a1' : 'text.primary',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: isToday ? alpha('#0d47a1', 0.1) : 'transparent',
                        }}
                      >
                        {day.getDate()}
                      </Typography>
                      {dayEvents.length > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>

              {/* Time Grid */}
              <WeekGrid>
                {/* Time Labels */}
                <TimeColumn>
                  {timeSlots.map(hour => (
                    <TimeLabel key={hour}>
                      {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                    </TimeLabel>
                  ))}
                </TimeColumn>

                {/* Day Columns */}
                {getWeekDays.map((day, dayIdx) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  const dayEvents = getEventsForDate(day);

                  return (
                    <DayColumn key={dayIdx} isToday={isToday}>
                      {/* Current Time Line */}
                      {isToday && (
                        <CurrentTimeLine sx={{ top: getCurrentTimePosition() }} />
                      )}

                      {/* Time Slots */}
                      {timeSlots.map(hour => (
                        <TimeSlot 
                          key={hour}
                          onClick={() => handleTimeSlotClick(day, hour)}
                        />
                      ))}

                      {/* Events */}
                      {dayEvents.map(event => {
                        const [hours, minutes] = event.time.split(':').map(Number);
                        const top = hours * 60 + minutes;
                        const height = event.duration;
                        return (
                          <EventBlock
                            key={event.id}
                            category={event.category}
                            duration={height}
                            sx={{ top }}
                            onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {event.isRecurring && <RepeatIcon sx={{ fontSize: 12 }} />}
                              {event.priority === 'high' && <PriorityHighIcon sx={{ fontSize: 12, color: '#E53935' }} />}
                              <Typography variant="caption" fontWeight={600} noWrap>
                                {event.title}
                              </Typography>
                            </Box>
                            {height >= 40 && (
                              <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.65rem' }} noWrap>
                                {formatTime(event.time)} • {event.location || event.duration + ' min'}
                              </Typography>
                            )}
                            {height >= 60 && event.attendees && (
                              <AvatarGroup max={3} sx={{ mt: 0.5, '& .MuiAvatar-root': { width: 20, height: 20, fontSize: '0.6rem' } }}>
                                {event.attendees.map((a, i) => (
                                  <Avatar key={i} sx={{ bgcolor: '#0d47a1' }}>{a.name[0]}</Avatar>
                                ))}
                              </AvatarGroup>
                            )}
                          </EventBlock>
                        );
                      })}
                    </DayColumn>
                  );
                })}
              </WeekGrid>
            </Box>
          )}

          {/* Agenda View */}
          {viewMode === 'agenda' && (
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date(currentDate);
                date.setDate(currentDate.getDate() + i);
                const dayEvents = getEventsForDate(date);
                if (dayEvents.length === 0) return null;

                return (
                  <Box key={i} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#0d47a1' }}>
                      {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </Typography>
                    {dayEvents.map(event => {
                      const cat = EVENT_CATEGORIES[event.category as keyof typeof EVENT_CATEGORIES] || EVENT_CATEGORIES.meeting;
                      return (
                        <AgendaItem key={event.id} category={event.category} onClick={() => handleEventClick(event)}>
                          <Box sx={{ color: cat.color }}>{cat.icon}</Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight={500}>{event.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(event.time)} - {event.duration} min
                              {event.location && ` • ${event.location}`}
                            </Typography>
                          </Box>
                          {event.videoLink && (
                            <Tooltip title="Join VerTechie Video Call">
                              <IconButton 
                                size="small" 
                                sx={{ color: '#0d47a1' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = event.videoLink!;
                                }}
                              >
                                <VideocamIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {event.attendees && (
                            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.75rem' } }}>
                              {event.attendees.map((a, i) => (
                                <Tooltip key={i} title={`${a.name} (${a.status})`}>
                                  <Avatar sx={{ bgcolor: a.status === 'accepted' ? '#4CAF50' : a.status === 'pending' ? '#FFA000' : '#E53935' }}>
                                    {a.name[0]}
                                  </Avatar>
                                </Tooltip>
                              ))}
                            </AvatarGroup>
                          )}
                        </AgendaItem>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          )}

          {/* Schedule View (Timeline) */}
          {viewMode === 'schedule' && (
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Your Schedule Today
              </Typography>
              <Box sx={{ position: 'relative', pl: 4 }}>
                <Box sx={{ position: 'absolute', left: 12, top: 0, bottom: 0, width: 2, bgcolor: alpha('#0d47a1', 0.2), borderRadius: 1 }} />
                {getEventsForDate(selectedDate).sort((a, b) => a.time.localeCompare(b.time)).map((event, idx) => {
                  const cat = EVENT_CATEGORIES[event.category as keyof typeof EVENT_CATEGORIES] || EVENT_CATEGORIES.meeting;
                  return (
                    <Box key={event.id} sx={{ display: 'flex', gap: 2, mb: 3, position: 'relative' }}>
                      <Box sx={{ 
                        position: 'absolute', 
                        left: -28, 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        bgcolor: cat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 12,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      }}>
                        {idx + 1}
                      </Box>
                      <Paper 
                        sx={{ 
                          flex: 1, 
                          p: 2, 
                          borderRadius: 2,
                          borderLeft: `4px solid ${cat.color}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': { boxShadow: 4 },
                        }}
                        onClick={() => handleEventClick(event)}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <Box>
                            <Typography variant="body1" fontWeight={600}>{event.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatTime(event.time)} - {event.duration} min
                            </Typography>
                          </Box>
                          <Chip label={cat.label} size="small" sx={{ bgcolor: cat.bg, color: cat.color }} />
                        </Box>
                        {event.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">{event.location}</Typography>
                          </Box>
                        )}
                      </Paper>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Day View */}
          {viewMode === 'day' && (
            <Box sx={{ flex: 1, overflow: 'auto', display: 'flex' }}>
              <TimeColumn>
                {timeSlots.map(hour => (
                  <TimeLabel key={hour}>
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </TimeLabel>
                ))}
              </TimeColumn>
              <DayColumn isToday={currentDate.toDateString() === new Date().toDateString()} sx={{ flex: 1 }}>
                {currentDate.toDateString() === new Date().toDateString() && (
                  <CurrentTimeLine sx={{ top: getCurrentTimePosition() }} />
                )}
                {timeSlots.map(hour => (
                  <TimeSlot key={hour} onClick={() => handleTimeSlotClick(currentDate, hour)} />
                ))}
                {getEventsForDate(currentDate).map(event => {
                  const [hours, minutes] = event.time.split(':').map(Number);
                  const top = hours * 60 + minutes;
                  return (
                    <EventBlock
                      key={event.id}
                      category={event.category}
                      duration={event.duration}
                      sx={{ top, right: 20 }}
                      onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                    >
                      <Typography variant="body2" fontWeight={600}>{event.title}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {formatTime(event.time)} • {event.duration} min
                      </Typography>
                      {event.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption">{event.location}</Typography>
                        </Box>
                      )}
                    </EventBlock>
                  );
                })}
              </DayColumn>
            </Box>
          )}

          {/* Month View */}
          {viewMode === 'month' && (
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                {dayNames.map(day => (
                  <Typography key={day} variant="caption" fontWeight={600} sx={{ textAlign: 'center', p: 1, color: '#666' }}>
                    {day}
                  </Typography>
                ))}
                {getMiniCalendarDays.map((day, idx) => {
                  const dayEvents = getEventsForDate(day.date);
                  const isToday = day.isToday;
                  return (
                    <Paper
                      key={idx}
                      elevation={0}
                      sx={{
                        minHeight: 100,
                        p: 1,
                        bgcolor: isToday ? alpha('#0d47a1', 0.05) : day.isCurrentMonth ? '#fff' : '#fafafa',
                        border: '1px solid',
                        borderColor: isToday ? '#0d47a1' : 'rgba(0,0,0,0.05)',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': { boxShadow: 2 },
                      }}
                      onClick={() => {
                        setSelectedDate(day.date);
                        setViewMode('day');
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        fontWeight={isToday ? 700 : 400}
                        sx={{ color: day.isCurrentMonth ? (isToday ? '#0d47a1' : 'text.primary') : '#bbb' }}
                      >
                        {day.date.getDate()}
                      </Typography>
                      {dayEvents.slice(0, 3).map(event => {
                        const cat = EVENT_CATEGORIES[event.category as keyof typeof EVENT_CATEGORIES] || EVENT_CATEGORIES.meeting;
                        return (
                          <Box
                            key={event.id}
                            sx={{
                              fontSize: '0.65rem',
                              p: 0.5,
                              borderRadius: 1,
                              bgcolor: cat.bg,
                              color: cat.color,
                              mb: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                          >
                            {event.title}
                          </Box>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <Typography variant="caption" color="text.secondary">
                          +{dayEvents.length - 3} more
                        </Typography>
                      )}
                    </Paper>
                  );
                })}
              </Box>
            </Box>
          )}
        </MainCalendar>
      </CalendarContainer>

      {/* Event Dialog */}
      <Dialog open={showEventDialog} onClose={() => setShowEventDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            {isCreating ? 'Create Event' : selectedEvent?.title}
          </Typography>
          <IconButton onClick={() => setShowEventDialog(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {isCreating ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                fullWidth
                required
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Duration</InputLabel>
                  <Select
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value as number })}
                    label="Duration"
                  >
                    <MenuItem value={15}>15 min</MenuItem>
                    <MenuItem value={30}>30 min</MenuItem>
                    <MenuItem value={45}>45 min</MenuItem>
                    <MenuItem value={60}>1 hour</MenuItem>
                    <MenuItem value={90}>1.5 hours</MenuItem>
                    <MenuItem value={120}>2 hours</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    label="Category"
                  >
                    {Object.entries(EVENT_CATEGORIES).map(([key, cat]) => (
                      <MenuItem key={key} value={key}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: cat.color }} />
                          {cat.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <TextField
                label="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <LocationOnIcon sx={{ color: '#888', mr: 1 }} />,
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TextField
                  label="Video Link"
                  value={newEvent.videoLink}
                  onChange={(e) => setNewEvent({ ...newEvent, videoLink: e.target.value })}
                  fullWidth
                  placeholder="Auto-generated for meetings/interviews"
                  InputProps={{
                    startAdornment: <VideocamIcon sx={{ color: '#888', mr: 1 }} />,
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setNewEvent({ ...newEvent, videoLink: generateVideoLink() })}
                  sx={{ 
                    bgcolor: '#0d47a1', 
                    minWidth: 120, 
                    height: 56,
                    whiteSpace: 'nowrap',
                  }}
                  startIcon={<VideocamIcon />}
                >
                  Generate
                </Button>
              </Box>
              <TextField
                label="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Reminder</InputLabel>
                  <Select
                    value={newEvent.reminder}
                    onChange={(e) => setNewEvent({ ...newEvent, reminder: e.target.value as number })}
                    label="Reminder"
                    size="small"
                  >
                    <MenuItem value={0}>None</MenuItem>
                    <MenuItem value={5}>5 min</MenuItem>
                    <MenuItem value={15}>15 min</MenuItem>
                    <MenuItem value={30}>30 min</MenuItem>
                    <MenuItem value={60}>1 hour</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    label="Priority"
                    size="small"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Switch
                    checked={newEvent.isRecurring}
                    onChange={(e) => setNewEvent({ ...newEvent, isRecurring: e.target.checked })}
                    size="small"
                  />
                  <Typography variant="body2">Recurring</Typography>
                </Box>
              </Box>
            </Box>
          ) : selectedEvent && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {EVENT_CATEGORIES[selectedEvent.category as keyof typeof EVENT_CATEGORIES]?.icon}
                <Chip 
                  label={EVENT_CATEGORIES[selectedEvent.category as keyof typeof EVENT_CATEGORIES]?.label || 'Event'} 
                  size="small"
                  sx={{ 
                    bgcolor: EVENT_CATEGORIES[selectedEvent.category as keyof typeof EVENT_CATEGORIES]?.bg,
                    color: EVENT_CATEGORIES[selectedEvent.category as keyof typeof EVENT_CATEGORIES]?.color,
                  }}
                />
                {selectedEvent.isRecurring && <Chip icon={<RepeatIcon />} label="Recurring" size="small" variant="outlined" />}
                {selectedEvent.priority === 'high' && <Chip icon={<PriorityHighIcon />} label="High Priority" size="small" color="error" />}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccessTimeIcon color="action" />
                <Box>
                  <Typography variant="body1">
                    {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatTime(selectedEvent.time)} • {selectedEvent.duration} min
                  </Typography>
                </Box>
              </Box>
              {selectedEvent.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOnIcon color="action" />
                  <Typography variant="body1">{selectedEvent.location}</Typography>
                </Box>
              )}
              {selectedEvent.videoLink && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <VideocamIcon sx={{ color: '#0d47a1' }} />
                  <Button 
                    href={selectedEvent.videoLink} 
                    variant="contained"
                    startIcon={<VideocamIcon />}
                    sx={{ 
                      bgcolor: '#0d47a1',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      '&:hover': { bgcolor: '#1565c0' },
                    }}
                  >
                    Join VerTechie Meeting
                  </Button>
                </Box>
              )}
              {selectedEvent.description && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <DescriptionIcon color="action" sx={{ mt: 0.5 }} />
                  <Typography variant="body1">{selectedEvent.description}</Typography>
                </Box>
              )}
              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PeopleIcon color="action" />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedEvent.attendees.map((a, i) => (
                      <Chip
                        key={i}
                        avatar={<Avatar sx={{ bgcolor: a.status === 'accepted' ? '#4CAF50' : a.status === 'pending' ? '#FFA000' : '#E53935' }}>{a.name[0]}</Avatar>}
                        label={a.name}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.1)', justifyContent: 'space-between' }}>
          {!isCreating && selectedEvent && (
            <Button color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteEvent(selectedEvent.id)}>
              Delete
            </Button>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={() => setShowEventDialog(false)}>Cancel</Button>
            {isCreating && (
              <Button variant="contained" onClick={handleCreateEvent} disabled={!newEvent.title || !newEvent.date}>
                Create Event
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Calendar Settings</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText primary="24-hour time format" secondary="Display times in 24-hour format" />
              <Switch checked={is24Hour} onChange={(e) => setIs24Hour(e.target.checked)} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Show weekends" secondary="Display Saturday and Sunday" />
              <Switch checked={showWeekends} onChange={(e) => setShowWeekends(e.target.checked)} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Working hours" secondary={`${workingHours.start}:00 - ${workingHours.end}:00`} />
            </ListItem>
            <ListItem>
              <Slider
                value={[workingHours.start, workingHours.end]}
                onChange={(e, v) => {
                  const [start, end] = v as number[];
                  setWorkingHours({ start, end });
                }}
                min={0}
                max={24}
                valueLabelDisplay="auto"
                sx={{ width: '100%' }}
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </ATSLayout>
  );
};

export default CalendarPage;
