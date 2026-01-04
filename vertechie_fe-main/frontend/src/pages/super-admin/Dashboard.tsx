import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  AdminPanelSettings,
  CheckCircle,
  People,
  PendingActions,
  Security,
  TrendingUp,
  TrendingDown,
  CalendarMonth,
  School,
  Work,
  Chat,
  Assessment,
  AutoAwesome,
} from '@mui/icons-material';
import { getApiUrl, API_ENDPOINTS } from '../../config/api';

const slideInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StatCard = styled(Card)<{ delay?: number }>(({ theme, delay = 0 }) => ({
  padding: theme.spacing(2.5),
  borderRadius: '20px',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  animation: `${slideInUp} 0.6s ease-out forwards`,
  animationDelay: `${delay}ms`,
  opacity: 0,
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
  },
}));

interface Stats {
  totalAdmins: number;
  activeAdmins: number;
  totalUsers: number;
  pendingUsers: number;
  totalRoles: number;
}

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalAdmins: 0,
    activeAdmins: 0,
    totalUsers: 0,
    pendingUsers: 0,
    totalRoles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Fetch users
      const usersResponse = await fetch(getApiUrl(API_ENDPOINTS.USERS), {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      // Fetch groups/roles
      const groupsResponse = await fetch(getApiUrl(API_ENDPOINTS.GROUPS), {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        const users = usersData.results || usersData || [];
        
        const admins = users.filter((u: any) => u.is_staff || u.is_superuser);
        const activeAdmins = admins.filter((u: any) => u.is_active);
        const pending = users.filter((u: any) => !u.is_verified);
        
        setStats(prev => ({
          ...prev,
          totalAdmins: admins.length,
          activeAdmins: activeAdmins.length,
          totalUsers: users.length,
          pendingUsers: pending.length,
        }));
      }

      if (groupsResponse.ok) {
        const groupsData = await groupsResponse.json();
        const groups = groupsData.results || groupsData || [];
        setStats(prev => ({
          ...prev,
          totalRoles: groups.length,
        }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Total Admins', 
      value: stats.totalAdmins, 
      icon: <AdminPanelSettings />, 
      color: '#6366f1',
      path: '/super-admin/admins',
    },
    { 
      label: 'Active Admins', 
      value: stats.activeAdmins, 
      icon: <CheckCircle />, 
      color: '#10b981',
      path: '/super-admin/admins',
    },
    { 
      label: 'Total Users', 
      value: stats.totalUsers, 
      icon: <People />, 
      color: '#0ea5e9',
      path: '/super-admin/users',
    },
    { 
      label: 'Pending', 
      value: stats.pendingUsers, 
      icon: <PendingActions />, 
      color: '#f59e0b',
      path: '/super-admin/users',
    },
    { 
      label: 'Roles', 
      value: stats.totalRoles, 
      icon: <Security />, 
      color: '#ef4444',
      path: '/super-admin/roles',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Welcome to the Super Admin Dashboard. Manage your system from here.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {statCards.map((stat, index) => (
          <Grid item xs={6} sm={4} md={2.4} key={stat.label}>
            <StatCard delay={index * 100} onClick={() => navigate(stat.path)}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: `${stat.color}15`, 
                    color: stat.color,
                    width: 48,
                    height: 48,
                  }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>
        ))}
      </Grid>

      {/* Analytics Overview */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assessment /> Platform Analytics
        </Typography>
        <Grid container spacing={3}>
          {/* Growth Chart Card */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, borderRadius: '16px', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>User Growth</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#10b981' }}>
                  <TrendingUp fontSize="small" />
                  <Typography variant="body2" fontWeight={600}>+24% this month</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, height: 180, alignItems: 'flex-end' }}>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, idx) => (
                  <Box key={month} sx={{ flex: 1, textAlign: 'center' }}>
                    <Box 
                      sx={{ 
                        height: [40, 60, 55, 80, 95, 110, 130][idx],
                        bgcolor: idx === 6 ? '#0d47a1' : '#e3f2fd',
                        borderRadius: '8px 8px 0 0',
                        transition: 'all 0.3s',
                        '&:hover': { bgcolor: '#0d47a1', opacity: 0.8 }
                      }} 
                    />
                    <Typography variant="caption" color="text.secondary">{month}</Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>

          {/* Activity Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: '16px', height: '100%' }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Today's Activity</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#f0f9ff', borderRadius: 2 }}>
                  <Avatar sx={{ bgcolor: '#0ea5e9', width: 40, height: 40 }}>
                    <People fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>156</Typography>
                    <Typography variant="caption" color="text.secondary">New Signups</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2 }}>
                  <Avatar sx={{ bgcolor: '#10b981', width: 40, height: 40 }}>
                    <School fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>2,340</Typography>
                    <Typography variant="caption" color="text.secondary">Lessons Completed</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#fef3c7', borderRadius: 2 }}>
                  <Avatar sx={{ bgcolor: '#f59e0b', width: 40, height: 40 }}>
                    <Work fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>45</Typography>
                    <Typography variant="caption" color="text.secondary">Job Applications</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#fce7f3', borderRadius: 2 }}>
                  <Avatar sx={{ bgcolor: '#ec4899', width: 40, height: 40 }}>
                    <Chat fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>1,892</Typography>
                    <Typography variant="caption" color="text.secondary">Messages Sent</Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                p: 3, 
                borderRadius: '16px', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
              }}
              onClick={() => navigate('/super-admin/admins')}
            >
              <AdminPanelSettings sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Manage Admins
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Create, edit, or deactivate admin accounts
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                p: 3, 
                borderRadius: '16px', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                color: 'white',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
              }}
              onClick={() => navigate('/super-admin/roles')}
            >
              <Security sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Configure Roles
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Set up roles and permissions for users
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                p: 3, 
                borderRadius: '16px', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                color: 'white',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
              }}
              onClick={() => navigate('/super-admin/users')}
            >
              <People sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                User Directory
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                View and manage all registered users
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                p: 3, 
                borderRadius: '16px', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                color: 'white',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
              }}
              onClick={() => navigate('/super-admin/learn-admin')}
            >
              <School sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Learn Admin
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Manage courses and learning content
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Recent Activity Feed */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesome /> Recent Activity
        </Typography>
        <Card sx={{ borderRadius: '16px', p: 3 }}>
          {[
            { action: 'New admin account created', user: 'John Doe', time: '2 minutes ago', color: '#6366f1' },
            { action: 'User verification approved', user: 'Sarah Chen', time: '15 minutes ago', color: '#10b981' },
            { action: 'New course published', user: 'Learn Admin', time: '1 hour ago', color: '#f59e0b' },
            { action: 'System backup completed', user: 'System', time: '2 hours ago', color: '#0ea5e9' },
            { action: 'New job posting created', user: 'HR Admin', time: '3 hours ago', color: '#ec4899' },
          ].map((activity, idx) => (
            <Box 
              key={idx} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                py: 2,
                borderBottom: idx < 4 ? '1px solid #f1f5f9' : 'none',
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: activity.color }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500}>{activity.action}</Typography>
                <Typography variant="caption" color="text.secondary">by {activity.user}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">{activity.time}</Typography>
            </Box>
          ))}
        </Card>
      </Box>
    </Container>
  );
};

export default SuperAdminDashboard;


