/**
 * Notifications - Enhanced Notifications/Alerts Page
 * 
 * Features:
 * - Categorized notifications (All, Jobs, Network, Learn, System)
 * - Mark as read/unread
 * - Notification preferences
 * - Time-based grouping (Today, This Week, Earlier)
 * - Quick actions
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/interviewService';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Button,
  Tabs,
  Tab,
  Badge,
  Chip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Notifications as NotificationsIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  MoreVert,
  Check,
  CheckCircle,
  Delete,
  Circle,
  AccessTime,
  Bookmark,
  BookmarkBorder,
  FilterList,
  DoneAll,
  NotificationsOff,
  Email,
  Campaign,
  EmojiEvents,
  ThumbUp,
  Comment,
  PersonAdd,
  BusinessCenter,
  Assignment,
  Star,
  TrendingUp,
  Celebration,
} from '@mui/icons-material';

// ============================================
// STYLED COMPONENTS
// ============================================
const PageContainer = styled(Box)({
  minHeight: '100%',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
});

const HeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  borderRadius: 20,
  color: 'white',
  marginBottom: theme.spacing(3),
  overflow: 'visible',
}));

const NotificationCard = styled(Card)<{ unread?: boolean }>(({ theme, unread }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(1.5),
  border: unread ? '2px solid #0d47a1' : '1px solid rgba(0,0,0,0.08)',
  background: unread ? alpha('#0d47a1', 0.02) : 'white',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transform: 'translateX(4px)',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  minHeight: 48,
  '&.Mui-selected': {
    color: '#0d47a1',
  },
}));

const CategoryChip = styled(Chip)<{ category: string }>(({ category }) => {
  const colors: Record<string, { bg: string; color: string }> = {
    job: { bg: alpha('#2196f3', 0.1), color: '#1565c0' },
    network: { bg: alpha('#4caf50', 0.1), color: '#2e7d32' },
    learn: { bg: alpha('#ff9800', 0.1), color: '#e65100' },
    system: { bg: alpha('#9c27b0', 0.1), color: '#7b1fa2' },
    achievement: { bg: alpha('#ffc107', 0.1), color: '#f57c00' },
  };
  const style = colors[category] || colors.system;
  return {
    backgroundColor: style.bg,
    color: style.color,
    fontWeight: 600,
    fontSize: '0.7rem',
  };
});

// ============================================
// TYPES
// ============================================
interface Notification {
  id: string;
  type: 'job' | 'network' | 'learn' | 'system' | 'achievement';
  title: string;
  message: string;
  time: string;
  timeGroup: 'today' | 'week' | 'earlier';
  read: boolean;
  saved: boolean;
  icon: React.ReactNode;
  actionUrl?: string;
  actionLabel?: string;
  sender?: {
    name: string;
    avatar?: string;
  };
}

// ============================================
// MOCK DATA
// ============================================
const mockNotifications: Notification[] = [
  // Today
  {
    id: '1',
    type: 'job',
    title: 'New Job Match!',
    message: 'Senior React Developer at TechCorp matches your profile. 95% match score!',
    time: '10 minutes ago',
    timeGroup: 'today',
    read: false,
    saved: false,
    icon: <WorkIcon sx={{ color: '#1565c0' }} />,
    actionLabel: 'View Job',
    actionUrl: '/techie/jobs/1',
  },
  {
    id: '2',
    type: 'network',
    title: 'Connection Request',
    message: 'Sarah Chen wants to connect with you',
    time: '1 hour ago',
    timeGroup: 'today',
    read: false,
    saved: false,
    icon: <PersonAdd sx={{ color: '#2e7d32' }} />,
    sender: { name: 'Sarah Chen' },
    actionLabel: 'Accept',
  },
  {
    id: '3',
    type: 'learn',
    title: 'Course Completed!',
    message: 'Congratulations! You\'ve completed "Advanced React Patterns" course.',
    time: '2 hours ago',
    timeGroup: 'today',
    read: false,
    saved: true,
    icon: <EmojiEvents sx={{ color: '#f57c00' }} />,
    actionLabel: 'Get Certificate',
  },
  {
    id: '4',
    type: 'network',
    title: 'Post Reaction',
    message: 'Michael Brown and 23 others liked your post about cloud architecture.',
    time: '3 hours ago',
    timeGroup: 'today',
    read: true,
    saved: false,
    icon: <ThumbUp sx={{ color: '#1976d2' }} />,
    sender: { name: 'Michael Brown' },
  },
  {
    id: '5',
    type: 'achievement',
    title: 'New Badge Earned!',
    message: 'You earned the "Problem Solver" badge for completing 50 coding challenges.',
    time: '5 hours ago',
    timeGroup: 'today',
    read: true,
    saved: false,
    icon: <Star sx={{ color: '#ffc107' }} />,
  },
  // This Week
  {
    id: '6',
    type: 'job',
    title: 'Application Update',
    message: 'Your application for Full Stack Engineer at StartupXYZ has been viewed.',
    time: '2 days ago',
    timeGroup: 'week',
    read: true,
    saved: false,
    icon: <Assignment sx={{ color: '#1565c0' }} />,
    actionLabel: 'View Status',
  },
  {
    id: '7',
    type: 'network',
    title: 'New Comment',
    message: 'Emily Davis commented on your article "The Future of AI in Development".',
    time: '3 days ago',
    timeGroup: 'week',
    read: true,
    saved: false,
    icon: <Comment sx={{ color: '#2e7d32' }} />,
    sender: { name: 'Emily Davis' },
  },
  {
    id: '8',
    type: 'learn',
    title: 'New Course Available',
    message: 'A new course "TypeScript Masterclass" is now available in your learning path.',
    time: '4 days ago',
    timeGroup: 'week',
    read: true,
    saved: true,
    icon: <SchoolIcon sx={{ color: '#e65100' }} />,
    actionLabel: 'Start Learning',
  },
  {
    id: '9',
    type: 'system',
    title: 'Profile Strength',
    message: 'Your profile is 85% complete. Add skills to increase visibility.',
    time: '5 days ago',
    timeGroup: 'week',
    read: true,
    saved: false,
    icon: <TrendingUp sx={{ color: '#7b1fa2' }} />,
    actionLabel: 'Complete Profile',
  },
  // Earlier
  {
    id: '10',
    type: 'job',
    title: 'Interview Reminder',
    message: 'Reminder: You have an interview with DesignStudio tomorrow at 2:00 PM.',
    time: '1 week ago',
    timeGroup: 'earlier',
    read: true,
    saved: true,
    icon: <BusinessCenter sx={{ color: '#1565c0' }} />,
  },
  {
    id: '11',
    type: 'achievement',
    title: 'Weekly Streak!',
    message: 'Amazing! You maintained a 7-day learning streak.',
    time: '1 week ago',
    timeGroup: 'earlier',
    read: true,
    saved: false,
    icon: <Celebration sx={{ color: '#f57c00' }} />,
  },
  {
    id: '12',
    type: 'network',
    title: 'Group Invitation',
    message: 'You\'ve been invited to join "React Developers Community" group.',
    time: '2 weeks ago',
    timeGroup: 'earlier',
    read: true,
    saved: false,
    icon: <PeopleIcon sx={{ color: '#2e7d32' }} />,
    actionLabel: 'Join Group',
  },
];

// ============================================
// COMPONENT
// ============================================
const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  // Notification settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    jobAlerts: true,
    networkUpdates: true,
    learningReminders: true,
    marketingEmails: false,
  });

  // Fetch real notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const apiNotifications = await notificationService.getNotifications(false, 50);
        
        if (apiNotifications && apiNotifications.length > 0) {
          // Map backend notifications to frontend format
          const mappedNotifications: Notification[] = apiNotifications.map((n: any) => {
            // Determine notification type and icon based on notification_type
            let type: 'job' | 'network' | 'learn' | 'system' | 'achievement' = 'system';
            let icon: React.ReactNode = <NotificationsIcon />;
            
            if (n.notification_type?.includes('interview') || n.notification_type?.includes('job')) {
              type = 'job';
              icon = <WorkIcon />;
            } else if (n.notification_type?.includes('network') || n.notification_type?.includes('connection')) {
              type = 'network';
              icon = <PeopleIcon />;
            } else if (n.notification_type?.includes('learn') || n.notification_type?.includes('course')) {
              type = 'learn';
              icon = <SchoolIcon />;
            }
            
            // Determine time group
            const createdAt = new Date(n.created_at);
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
            let timeGroup: 'today' | 'week' | 'earlier' = 'earlier';
            if (diffDays === 0) timeGroup = 'today';
            else if (diffDays < 7) timeGroup = 'week';
            
            // Format time display
            let timeDisplay: string;
            const diffHours = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));
            if (diffHours < 1) timeDisplay = 'Just now';
            else if (diffHours < 24) timeDisplay = `${diffHours} hours ago`;
            else if (diffDays < 7) timeDisplay = `${diffDays} days ago`;
            else timeDisplay = createdAt.toLocaleDateString();
            
            return {
              id: n.id,
              type,
              title: n.title,
              message: n.message,
              time: timeDisplay,
              timeGroup,
              read: n.is_read,
              saved: false,
              icon,
              actionUrl: n.link,
              actionLabel: n.link ? 'View Details' : undefined,
            };
          });
          
          // Merge with mock notifications (real ones first)
          setNotifications([...mappedNotifications, ...mockNotifications.slice(0, 3)]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Keep mock notifications as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Filter notifications based on tab
  const filterNotifications = () => {
    let filtered = notifications;
    switch (activeTab) {
      case 1: filtered = notifications.filter(n => n.type === 'job'); break;
      case 2: filtered = notifications.filter(n => n.type === 'network'); break;
      case 3: filtered = notifications.filter(n => n.type === 'learn'); break;
      case 4: filtered = notifications.filter(n => n.type === 'system' || n.type === 'achievement'); break;
      default: filtered = notifications;
    }
    return filtered;
  };

  const filteredNotifications = filterNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  const jobCount = notifications.filter(n => n.type === 'job' && !n.read).length;
  const networkCount = notifications.filter(n => n.type === 'network' && !n.read).length;
  const learnCount = notifications.filter(n => n.type === 'learn' && !n.read).length;

  // Group notifications by time
  const groupedNotifications = {
    today: filteredNotifications.filter(n => n.timeGroup === 'today'),
    week: filteredNotifications.filter(n => n.timeGroup === 'week'),
    earlier: filteredNotifications.filter(n => n.timeGroup === 'earlier'),
  };

  // Actions
  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    // Also update in backend
    try {
      await notificationService.markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    // Also update in backend
    try {
      await notificationService.markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const toggleSaved = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, saved: !n.saved } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setMenuAnchor(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedNotification(id);
  };

  const renderNotificationGroup = (title: string, items: Notification[]) => {
    if (items.length === 0) return null;
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1.5, px: 1 }}>
          {title}
        </Typography>
        {items.map((notification) => (
          <NotificationCard
            key={notification.id}
            unread={!notification.read}
            onClick={() => markAsRead(notification.id)}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {/* Icon/Avatar */}
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: notification.sender ? '#0d47a1' : alpha('#0d47a1', 0.1),
                  }}
                >
                  {notification.sender ? notification.sender.name.charAt(0) : notification.icon}
                </Avatar>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {notification.title}
                    </Typography>
                    <CategoryChip
                      category={notification.type}
                      label={notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      size="small"
                    />
                    {!notification.read && (
                      <Circle sx={{ fontSize: 8, color: '#0d47a1' }} />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {notification.message}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime sx={{ fontSize: 14 }} />
                      {notification.time}
                    </Typography>
                    {notification.actionLabel && (
                      <Button
                        size="small"
                        variant="text"
                        sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#0d47a1' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                          // Navigate to the action URL or My Interviews for interview notifications
                          if (notification.actionUrl) {
                            navigate(notification.actionUrl);
                          } else if (notification.type === 'job' && notification.title.toLowerCase().includes('interview')) {
                            navigate('/techie/my-interviews');
                          }
                        }}
                      >
                        {notification.actionLabel}
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Tooltip title={notification.saved ? 'Unsave' : 'Save'}>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); toggleSaved(notification.id); }}
                    >
                      {notification.saved ? <Bookmark sx={{ color: '#0d47a1' }} /> : <BookmarkBorder />}
                    </IconButton>
                  </Tooltip>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, notification.id)}>
                    <MoreVert />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </NotificationCard>
        ))}
      </Box>
    );
  };

  return (
    <PageContainer>
      <Container maxWidth="lg">
        {/* Header */}
        <HeaderCard>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <NotificationsIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Notifications
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'You\'re all caught up!'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<DoneAll />}
                  onClick={markAllAsRead}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Mark All Read
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                  onClick={() => setSettingsOpen(true)}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Settings
                </Button>
              </Box>
            </Box>
          </CardContent>
        </HeaderCard>

        {/* Tabs */}
        <Card sx={{ borderRadius: 3, mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#0d47a1', height: 3 },
            }}
          >
            <StyledTab
              icon={<Badge badgeContent={unreadCount} color="error"><NotificationsIcon /></Badge>}
              iconPosition="start"
              label="All"
            />
            <StyledTab
              icon={<Badge badgeContent={jobCount} color="error"><WorkIcon /></Badge>}
              iconPosition="start"
              label="Jobs"
            />
            <StyledTab
              icon={<Badge badgeContent={networkCount} color="error"><PeopleIcon /></Badge>}
              iconPosition="start"
              label="Network"
            />
            <StyledTab
              icon={<Badge badgeContent={learnCount} color="error"><SchoolIcon /></Badge>}
              iconPosition="start"
              label="Learning"
            />
            <StyledTab
              icon={<Campaign />}
              iconPosition="start"
              label="System"
            />
          </Tabs>
        </Card>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card sx={{ borderRadius: 3, p: 6, textAlign: 'center' }}>
            <NotificationsOff sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No notifications in this category
            </Typography>
            <Typography variant="body2" color="text.disabled">
              We'll notify you when something new happens
            </Typography>
          </Card>
        ) : (
          <>
            {renderNotificationGroup('Today', groupedNotifications.today)}
            {renderNotificationGroup('This Week', groupedNotifications.week)}
            {renderNotificationGroup('Earlier', groupedNotifications.earlier)}
          </>
        )}

        {/* Context Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => { markAsRead(selectedNotification!); setMenuAnchor(null); }}>
            <ListItemIcon><Check fontSize="small" /></ListItemIcon>
            Mark as read
          </MenuItem>
          <MenuItem onClick={() => { toggleSaved(selectedNotification!); setMenuAnchor(null); }}>
            <ListItemIcon><Bookmark fontSize="small" /></ListItemIcon>
            Save notification
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => deleteNotification(selectedNotification!)} sx={{ color: 'error.main' }}>
            <ListItemIcon><Delete fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
            Delete
          </MenuItem>
        </Menu>

        {/* Settings Dialog */}
        <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon />
              Notification Settings
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
              GENERAL
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1">Email Notifications</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Receive notifications via email
                  </Typography>
                </Box>
              }
              sx={{ display: 'flex', mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.pushNotifications}
                  onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1">Push Notifications</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Receive push notifications in browser
                  </Typography>
                </Box>
              }
              sx={{ display: 'flex', mb: 3 }}
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
              CATEGORIES
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.jobAlerts}
                  onChange={(e) => setSettings({ ...settings, jobAlerts: e.target.checked })}
                  color="primary"
                />
              }
              label="Job Alerts & Application Updates"
              sx={{ display: 'flex', mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.networkUpdates}
                  onChange={(e) => setSettings({ ...settings, networkUpdates: e.target.checked })}
                  color="primary"
                />
              }
              label="Network Updates (connections, likes, comments)"
              sx={{ display: 'flex', mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.learningReminders}
                  onChange={(e) => setSettings({ ...settings, learningReminders: e.target.checked })}
                  color="primary"
                />
              }
              label="Learning Reminders & Course Updates"
              sx={{ display: 'flex', mb: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.marketingEmails}
                  onChange={(e) => setSettings({ ...settings, marketingEmails: e.target.checked })}
                  color="primary"
                />
              }
              label="Marketing & Promotional Emails"
              sx={{ display: 'flex' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => setSettingsOpen(false)} sx={{ bgcolor: '#0d47a1' }}>
              Save Settings
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </PageContainer>
  );
};

export default Notifications;

