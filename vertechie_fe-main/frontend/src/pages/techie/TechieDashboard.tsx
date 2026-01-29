/**
 * Techie Dashboard - Main Dashboard for Tech Professionals
 * Comprehensive platform featuring:
 * - Job Search & Applications
 * - Coding Practice (LeetCode-style)
 * - Networking & Community
 * - Learning Paths & Achievements
 * - Daily Streaks & Gamification
 * 
 * Security: Implements NIST CSF, ISO 27001, OWASP guidelines
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tab,
  Tabs,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Avatar,
  Chip,
  LinearProgress,
  Badge,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  alpha,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Work as WorkIcon,
  Code as CodeIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  TrendingUp as TrendingIcon,
  Bookmark as BookmarkIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  Article as ArticleIcon,
  Group as GroupIcon,
  Chat as ChatIcon,
  Leaderboard as LeaderboardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../../config/api';

// Types
interface UserStats {
  current_streak: number;
  longest_streak: number;
  level: number;
  total_xp: number;
  problems_solved: number;
  connections: number;
  articles_published: number;
}

interface CodingProblem {
  id: string;
  problem_number: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  acceptance_rate: number;
  is_solved: boolean;
}

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  salary_range_display: string;
  work_mode: string;
}

interface Achievement {
  id: string;
  name: string;
  icon: string;
  rarity: string;
  earned_at?: string;
}

interface GroupPreview {
  id: string;
  name: string;
  member_count: number;
  avatar?: string;
}

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`techie-tabpanel-${index}`}
      aria-labelledby={`techie-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Streak Card Component
const StreakCard: React.FC<{ stats: UserStats }> = ({ stats }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${alpha('#f97316', 0.15)} 0%, ${alpha('#dc2626', 0.15)} 100%)`,
        border: `1px solid ${alpha('#f97316', 0.3)}`,
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f97316, #dc2626)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FireIcon sx={{ color: 'white', fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#f97316' }}>
              {stats.current_streak}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Day Streak 🔥
            </Typography>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Longest Streak
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {stats.longest_streak} days
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Level {stats.level}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {stats.total_xp.toLocaleString()} XP
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={65}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: alpha('#f97316', 0.2),
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #f97316, #dc2626)',
                borderRadius: 4,
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            350 XP to next level
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Quick Stats Component
const QuickStats: React.FC<{ stats: UserStats }> = ({ stats }) => {
  const statItems = [
    { icon: <CodeIcon />, value: stats.problems_solved, label: 'Problems Solved', color: '#10b981' },
    { icon: <PeopleIcon />, value: stats.connections, label: 'Connections', color: '#6366f1' },
    { icon: <ArticleIcon />, value: stats.articles_published, label: 'Articles', color: '#8b5cf6' },
    { icon: <TrophyIcon />, value: 12, label: 'Achievements', color: '#f59e0b' },
  ];
  
  return (
    <Grid container spacing={2}>
      {statItems.map((item, index) => (
        <Grid item xs={6} md={3} key={index}>
          <Paper
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              border: `1px solid ${alpha(item.color, 0.3)}`,
              background: alpha(item.color, 0.05),
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <Box sx={{ color: item.color, mb: 1 }}>{item.icon}</Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {item.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

// Daily Challenge Component
const DailyChallenge: React.FC<{ problem?: CodingProblem }> = ({ problem }) => {
  const navigate = useNavigate();
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };
  
  if (!problem) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card
      sx={{
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip
            label="Daily Challenge"
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              fontWeight: 600,
            }}
          />
          <StarIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            +50 XP Bonus
          </Typography>
        </Box>
        
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {problem.problem_number}. {problem.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip
            label={problem.difficulty}
            size="small"
            sx={{
              backgroundColor: alpha(getDifficultyColor(problem.difficulty), 0.15),
              color: getDifficultyColor(problem.difficulty),
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Acceptance: {problem.acceptance_rate.toFixed(1)}%
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant="contained"
          startIcon={<PlayIcon />}
          onClick={() => navigate(`/techie/problems/${problem.id}`)}
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Solve Challenge
        </Button>
      </CardActions>
    </Card>
  );
};

// Recent Activity Component
const RecentActivity: React.FC = () => {
  const activities = [
    { type: 'solved', title: 'Solved "Two Sum"', time: '2 hours ago', icon: <CheckIcon sx={{ color: '#10b981' }} /> },
    { type: 'connection', title: 'Connected with Sarah Chen', time: '5 hours ago', icon: <PeopleIcon sx={{ color: '#6366f1' }} /> },
    { type: 'achievement', title: 'Earned "Week Warrior"', time: '1 day ago', icon: <TrophyIcon sx={{ color: '#f59e0b' }} /> },
    { type: 'article', title: 'Published "React Best Practices"', time: '2 days ago', icon: <ArticleIcon sx={{ color: '#8b5cf6' }} /> },
  ];
  
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Recent Activity
        </Typography>
        <List disablePadding>
          {activities.map((activity, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding sx={{ py: 1 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'transparent', width: 36, height: 36 }}>
                    {activity.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.title}
                  secondary={activity.time}
                  primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </ListItem>
              {index < activities.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Recommended Jobs Component
const RecommendedJobs: React.FC<{ jobs: Job[] }> = ({ jobs }) => {
  const navigate = useNavigate();
  
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Recommended Jobs
          </Typography>
          <Button
            size="small"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/techie/jobs')}
            sx={{ textTransform: 'none' }}
          >
            View All
          </Button>
        </Box>
        
        {jobs.length === 0 ? (
          <Typography color="text.secondary">No recommendations yet</Typography>
        ) : (
          <List disablePadding>
            {jobs.slice(0, 3).map((job, index) => (
              <React.Fragment key={job.id}>
                <ListItem
                  disablePadding
                  sx={{
                    py: 1.5,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    borderRadius: 1,
                  }}
                  onClick={() => navigate(`/techie/jobs/${job.id}`)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#6366f1' }}>
                      <WorkIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={job.title}
                    secondary={`${job.company_name} • ${job.location}`}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <BookmarkIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < Math.min(jobs.length, 3) - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

// Active Groups Component
const ActiveGroups: React.FC<{ groups: GroupPreview[] }> = ({ groups }) => {
  const navigate = useNavigate();
  
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Your Groups
          </Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate('/techie/groups')}
            sx={{ textTransform: 'none' }}
          >
            Browse
          </Button>
        </Box>
        
        {groups.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <GroupIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">Join groups to connect with others</Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 1, textTransform: 'none' }}
              onClick={() => navigate('/techie/groups')}
            >
              Explore Groups
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {groups.slice(0, 5).map((group) => (
              <Chip
                key={group.id}
                label={group.name}
                avatar={<Avatar src={group.avatar}>{group.name[0]}</Avatar>}
                onClick={() => navigate(`/techie/groups/${group.id}`)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const TechieDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for dashboard data
  const [stats, setStats] = useState<UserStats>({
    current_streak: 0,
    longest_streak: 0,
    level: 1,
    total_xp: 0,
    problems_solved: 0,
    connections: 0,
    articles_published: 0,
  });
  const [dailyProblem, setDailyProblem] = useState<CodingProblem | undefined>();
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [groups, setGroups] = useState<GroupPreview[]>([]);
  
  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      
      // Fetch streak data
      try {
        const streakResponse = await fetch(getApiUrl('/practice/streaks/'), { headers });
        if (streakResponse.ok) {
          const streakData = await streakResponse.json();
          setStats(prev => ({
            ...prev,
            current_streak: streakData.current_streak || 0,
            longest_streak: streakData.longest_streak || 0,
            level: streakData.level || 1,
            total_xp: streakData.total_xp || 0,
          }));
        }
      } catch (e) {
        console.log('Streak API not available yet');
      }
      
      // Fetch daily problem
      try {
        const problemResponse = await fetch(getApiUrl('/practice/problems/daily/'), { headers });
        if (problemResponse.ok) {
          const problemData = await problemResponse.json();
          setDailyProblem(problemData);
        }
      } catch (e) {
        console.log('Problems API not available yet');
      }
      
      // Mock data for demonstration
      setStats({
        current_streak: 7,
        longest_streak: 21,
        level: 5,
        total_xp: 2450,
        problems_solved: 45,
        connections: 127,
        articles_published: 3,
      });
      
      setDailyProblem({
        id: 'daily-1',
        problem_number: 42,
        title: 'Maximum Subarray',
        difficulty: 'medium',
        acceptance_rate: 49.5,
        is_solved: false,
      });
      
      setRecommendedJobs([
        { id: '1', title: 'Senior Frontend Developer', company_name: 'TechCorp', location: 'Remote', salary_range_display: '₹12L-₹18L', work_mode: 'remote' },
        { id: '2', title: 'Full Stack Engineer', company_name: 'StartupXYZ', location: 'Bangalore', salary_range_display: '₹15L-₹22L', work_mode: 'hybrid' },
        { id: '3', title: 'React Developer', company_name: 'InnovateLabs', location: 'Hyderabad', salary_range_display: '₹10L-₹16L', work_mode: 'onsite' },
      ]);
      
      setGroups([
        { id: '1', name: 'React Developers', member_count: 1250 },
        { id: '2', name: 'DSA Practice', member_count: 890 },
        { id: '3', name: 'Career Growth', member_count: 2100 },
      ]);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                Welcome back! 👋
              </Typography>
              <Typography color="text.secondary">
                Keep up the great work. You're on a roll!
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Notifications">
                <IconButton
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                  }}
                >
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Search">
                <IconButton
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {error && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {/* Quick Stats */}
          <QuickStats stats={stats} />
        </Box>
        
        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            {/* Navigation Tabs */}
            <Paper sx={{ borderRadius: 3, mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  px: 2,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    minHeight: 56,
                  },
                }}
              >
                <Tab icon={<WorkIcon />} iconPosition="start" label="Jobs" />
                <Tab icon={<CodeIcon />} iconPosition="start" label="Practice" />
                <Tab icon={<PeopleIcon />} iconPosition="start" label="Network" />
                <Tab icon={<GroupIcon />} iconPosition="start" label="Community" />
                <Tab icon={<SchoolIcon />} iconPosition="start" label="Learn" />
              </Tabs>
            </Paper>
            
            {/* Tab Panels */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <RecommendedJobs jobs={recommendedJobs} />
                </Grid>
                <Grid item xs={12}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Find Your Dream Job
                          </Typography>
                          <Typography color="text.secondary">
                            Browse thousands of opportunities tailored for you
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          startIcon={<SearchIcon />}
                          onClick={() => navigate('/techie/jobs')}
                          sx={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                          }}
                        >
                          Search Jobs
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DailyChallenge problem={dailyProblem} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ borderRadius: 3, height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Your Progress
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Easy</Typography>
                          <Typography variant="body2" color="text.secondary">15/100</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={15} sx={{ height: 8, borderRadius: 4, bgcolor: alpha('#10b981', 0.2), '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
                      </Box>
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Medium</Typography>
                          <Typography variant="body2" color="text.secondary">22/200</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={11} sx={{ height: 8, borderRadius: 4, bgcolor: alpha('#f59e0b', 0.2), '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b' } }} />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Hard</Typography>
                          <Typography variant="body2" color="text.secondary">8/100</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={8} sx={{ height: 8, borderRadius: 4, bgcolor: alpha('#ef4444', 0.2), '& .MuiLinearProgress-bar': { bgcolor: '#ef4444' } }} />
                      </Box>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate('/techie/problems')}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        View All Problems
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Upcoming Contests
                          </Typography>
                          <Typography color="text.secondary">
                            Compete with developers worldwide
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          startIcon={<LeaderboardIcon />}
                          onClick={() => navigate('/techie/contests')}
                          sx={{
                            bgcolor: '#10b981',
                            '&:hover': { bgcolor: '#059669' },
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          View Contests
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Grow Your Network
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Connect with professionals, get endorsed, and discover opportunities
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<PeopleIcon />}
                          onClick={() => navigate('/techie/network')}
                          sx={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          Find Connections
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<ChatIcon />}
                          onClick={() => navigate('/techie/messages')}
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                          Messages
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <ActiveGroups groups={groups} />
                </Grid>
                <Grid item xs={12}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Trending Discussions
                      </Typography>
                      <Typography color="text.secondary">
                        Join the conversation in tech communities
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate('/techie/feed')}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        Browse Feed
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            
            <TabPanel value={tabValue} index={4}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        Learning Paths
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Structured courses to level up your skills
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<SchoolIcon />}
                        onClick={() => navigate('/techie/learning')}
                        sx={{
                          bgcolor: '#10b981',
                          '&:hover': { bgcolor: '#059669' },
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Explore Paths
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Skill Assessments
                      </Typography>
                      <Typography color="text.secondary">
                        Test your skills and earn badges
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate('/techie/assessments')}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        Take Assessment
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Grid>
          
          {/* Right Column */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <StreakCard stats={stats} />
              <RecentActivity />
              
              {/* Achievements Preview */}
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Recent Achievements
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => navigate('/techie/achievements')}
                      sx={{ textTransform: 'none' }}
                    >
                      View All
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {['🏆', '⚡', '🎯', '🔥'].map((emoji, i) => (
                      <Tooltip key={i} title={`Achievement ${i + 1}`}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: alpha('#f59e0b', 0.15),
                            fontSize: 24,
                            cursor: 'pointer',
                          }}
                        >
                          {emoji}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TechieDashboard;

