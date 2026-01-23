/**
 * Learn Page - W3Schools & Codecademy Style Learning Platform
 * Enterprise-level curriculum with interactive tutorials
 */

import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, Button, IconButton, Chip, Grid, Card, CardContent,
  TextField, InputAdornment, Avatar, LinearProgress, Tooltip, List, ListItem,
  ListItemIcon, ListItemText, Collapse, Divider, Badge,
} from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CodeIcon from '@mui/icons-material/Code';
import WebIcon from '@mui/icons-material/Web';
import StorageIcon from '@mui/icons-material/Storage';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TerminalIcon from '@mui/icons-material/Terminal';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QuizIcon from '@mui/icons-material/Quiz';
import VerifiedIcon from '@mui/icons-material/Verified';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArticleIcon from '@mui/icons-material/Article';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { categories, allTutorials, Tutorial } from '../../data/curriculum';

// Animations
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(13, 71, 161, 0.2); }
  50% { box-shadow: 0 0 40px rgba(13, 71, 161, 0.4); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled Components
const PageContainer = styled(Box)({
  minHeight: '100%',
  background: '#f8fafc',
});

const HeroSection = styled(Box)({
  background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
  padding: '50px 40px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 80% 20%, rgba(90, 200, 250, 0.2) 0%, transparent 40%)',
    pointerEvents: 'none',
  },
});

const StreakBadge = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 16px',
  borderRadius: 25,
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.9rem',
  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
});

const TutorialCard = styled(Card)<{ tutorialColor: string }>(({ tutorialColor }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: `2px solid transparent`,
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: `0 12px 30px ${alpha(tutorialColor, 0.25)}`,
    borderColor: tutorialColor,
  },
}));

const TutorialIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})<{ bgColor: string }>(({ bgColor }) => ({
  width: 60,
  height: 60,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 28,
  backgroundColor: bgColor,
  marginBottom: 12,
}));

const CategorySection = styled(Box)<{ color: string }>(({ color }) => ({
  marginBottom: 40,
  '& .category-header': {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    '& .category-icon': {
      width: 48,
      height: 48,
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24,
      backgroundColor: alpha(color, 0.1),
    },
  },
}));

const ProgressBar = styled(LinearProgress)({
  height: 6,
  borderRadius: 3,
  backgroundColor: alpha('#0d47a1', 0.1),
  '& .MuiLinearProgress-bar': {
    borderRadius: 3,
    background: 'linear-gradient(90deg, #0d47a1, #5AC8FA)',
  },
});

const QuickStartCard = styled(Paper)<{ color: string }>(({ color }) => ({
  padding: 20,
  borderRadius: 16,
  cursor: 'pointer',
  border: '2px solid transparent',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  '&:hover': {
    borderColor: color,
    transform: 'translateX(8px)',
    boxShadow: `0 8px 25px ${alpha(color, 0.2)}`,
  },
}));

const LeaderboardItem = styled(Box)<{ rank: number }>(({ rank }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: 12,
  borderRadius: 12,
  background: rank === 1 ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' :
              rank === 2 ? 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)' :
              rank === 3 ? 'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)' :
              '#fff',
  color: rank <= 3 ? '#fff' : 'inherit',
  border: rank > 3 ? '1px solid rgba(0,0,0,0.08)' : 'none',
}));

const SidebarItem = styled(ListItem)<{ active?: boolean; color?: string }>(({ active, color }) => ({
  borderRadius: 8,
  marginBottom: 4,
  cursor: 'pointer',
  backgroundColor: active ? alpha(color || '#0d47a1', 0.1) : 'transparent',
  borderLeft: active ? `3px solid ${color || '#0d47a1'}` : '3px solid transparent',
  '&:hover': {
    backgroundColor: alpha(color || '#0d47a1', 0.05),
  },
}));

// Leaderboard data
const leaderboard = [
  { rank: 1, name: 'Alex Thompson', points: 15420, avatar: 'A', streak: 45 },
  { rank: 2, name: 'Maria Garcia', points: 14850, avatar: 'M', streak: 38 },
  { rank: 3, name: 'John Smith', points: 13200, avatar: 'J', streak: 30 },
  { rank: 4, name: 'Sarah Lee', points: 12100, avatar: 'S', streak: 25 },
  { rank: 5, name: 'David Kim', points: 11500, avatar: 'D', streak: 22 },
];

const Learn: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['web', 'programming']);

  const handleTutorialClick = (tutorialSlug: string) => {
    navigate(`/techie/learn/tutorial/${tutorialSlug}`);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // User stats (mock)
  const userStats = {
    lessonsCompleted: 156,
    quizzesPassed: 42,
    certificates: 3,
    streak: 12,
    karmaPoints: 4250,
    rank: 'Rising Star',
    totalHours: 48,
  };

  // Filter tutorials by search
  const filteredTutorials = useMemo(() => {
    if (!searchQuery) return allTutorials;
    const query = searchQuery.toLowerCase();
    return allTutorials.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Quick start tutorials
  const quickStartTutorials = [
    { ...allTutorials.find(t => t.slug === 'html')!, progress: 0 },
    { ...allTutorials.find(t => t.slug === 'css')!, progress: 0 },
    { ...allTutorials.find(t => t.slug === 'javascript')!, progress: 0 },
    { ...allTutorials.find(t => t.slug === 'python')!, progress: 0 },
  ].filter(t => t);

  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <Box sx={{ maxWidth: 1400, mx: 'auto', position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ mb: 2 }}>
                <StreakBadge>
                  <LocalFireDepartmentIcon sx={{ fontSize: 20 }} />
                  {userStats.streak} Day Streak!
                </StreakBadge>
              </Box>
              
              <Typography variant="h3" fontWeight={800} color="white" sx={{ mb: 2 }}>
                Learn to Code for Free
              </Typography>
              
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, fontWeight: 400 }}>
                Interactive tutorials with step-by-step lessons. Try it yourself editors. 
                Quizzes & certifications. 100% free.
              </Typography>

              {/* Search Bar */}
              <TextField
                placeholder="Search tutorials... (e.g., HTML, Python, React)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                sx={{
                  maxWidth: 500,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.95)',
                    '&:hover': { bgcolor: '#fff' },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Quick Stats */}
              <Box sx={{ display: 'flex', gap: 4, mt: 4, flexWrap: 'wrap' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="white">{userStats.lessonsCompleted}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Lessons</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="white">{userStats.quizzesPassed}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Quizzes</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="white">{userStats.certificates}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Certificates</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="white">{userStats.totalHours}h</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Learning</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Quick Start */}
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.98)' }}>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AutoAwesomeIcon color="primary" /> Where to Start?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Not sure where to begin? Start with the basics!
                </Typography>

                {quickStartTutorials.map((tutorial) => (
                  <QuickStartCard
                    key={tutorial.slug}
                    color={tutorial.color}
                    onClick={() => handleTutorialClick(tutorial.slug)}
                    elevation={0}
                    sx={{ mb: 1.5 }}
                  >
                    <Box sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 10,
                      bgcolor: tutorial.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                    }}>
                      {tutorial.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>{tutorial.shortTitle}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {tutorial.totalLessons} lessons • {tutorial.totalHours}h
                      </Typography>
                    </Box>
                    <ArrowForwardIcon sx={{ color: tutorial.color }} />
                  </QuickStartCard>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </HeroSection>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 4 }}>
        <Grid container spacing={4}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, borderRadius: 3, position: 'sticky', top: 20 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ px: 2, mb: 2 }}>
                📚 All Tutorials
              </Typography>
              
              <List dense disablePadding>
                {categories.map(category => (
                  <Box key={category.id}>
                    <SidebarItem
                      onClick={() => toggleCategory(category.id)}
                      sx={{ justifyContent: 'space-between' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography fontSize={18}>{category.icon}</Typography>
                        <ListItemText
                          primary={category.name}
                          primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                        />
                      </Box>
                      {expandedCategories.includes(category.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </SidebarItem>

                    <Collapse in={expandedCategories.includes(category.id)}>
                      <List dense disablePadding sx={{ pl: 2 }}>
                        {category.tutorials.map(tutorial => (
                          <SidebarItem
                            key={tutorial.slug}
                            color={tutorial.color}
                            onClick={() => handleTutorialClick(tutorial.slug)}
                          >
                            <Typography fontSize={14} sx={{ mr: 1 }}>{tutorial.icon}</Typography>
                            <ListItemText
                              primary={tutorial.shortTitle}
                              primaryTypographyProps={{ fontSize: '0.85rem' }}
                            />
                            {tutorial.isFree && (
                              <Chip label="FREE" size="small" sx={{ height: 18, fontSize: 10, bgcolor: '#4CAF50', color: '#fff' }} />
                            )}
                          </SidebarItem>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              {/* Certifications Link */}
              <List dense disablePadding>
                <SidebarItem onClick={() => navigate('/techie/certifications')}>
                  <WorkspacePremiumIcon sx={{ color: '#FFD700', mr: 1 }} />
                  <ListItemText primary="Certifications" primaryTypographyProps={{ fontWeight: 600 }} />
                </SidebarItem>
                <SidebarItem onClick={() => navigate('/techie/exercises')}>
                  <QuizIcon sx={{ color: '#4CAF50', mr: 1 }} />
                  <ListItemText primary="Exercises" primaryTypographyProps={{ fontWeight: 600 }} />
                </SidebarItem>
              </List>
            </Paper>
          </Grid>

          {/* Main Tutorial Grid */}
          <Grid item xs={12} md={6}>
            {/* Categories and Tutorials */}
            {categories.map(category => (
              <CategorySection key={category.id} color={category.color}>
                <Box className="category-header">
                  <Box className="category-icon">{category.icon}</Box>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>{category.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{category.description}</Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  {category.tutorials
                    .filter(t => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(tutorial => (
                      <Grid item xs={12} sm={6} key={tutorial.slug}>
                        <TutorialCard
                          tutorialColor={tutorial.color}
                          onClick={() => handleTutorialClick(tutorial.slug)}
                          elevation={1}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <TutorialIcon bgColor={tutorial.bgColor}>
                                {tutorial.icon}
                              </TutorialIcon>
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <Typography variant="h6" fontWeight={700} sx={{ color: tutorial.color }}>
                                    {tutorial.shortTitle}
                                  </Typography>
                                  {tutorial.isCertified && (
                                    <Tooltip title="Certificate available">
                                      <VerifiedIcon sx={{ fontSize: 18, color: '#FFD700' }} />
                                    </Tooltip>
                                  )}
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, minHeight: 40 }}>
                                  {tutorial.description}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1.5 }}>
                                  <Chip
                                    icon={<MenuBookIcon />}
                                    label={`${tutorial.totalLessons} lessons`}
                                    size="small"
                                    variant="outlined"
                                  />
                                  <Chip
                                    icon={<AccessTimeIcon />}
                                    label={`${tutorial.totalHours}h`}
                                    size="small"
                                    variant="outlined"
                                  />
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <StarIcon sx={{ fontSize: 16, color: '#FFB400' }} />
                                    <Typography variant="body2" fontWeight={600}>{tutorial.rating}</Typography>
                                  </Box>
                                  <Typography variant="caption" color="text.secondary">
                                    • {(tutorial.learners / 1000000).toFixed(1)}M learners
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>

                            <Button
                              fullWidth
                              variant="contained"
                              sx={{
                                mt: 2,
                                borderRadius: 2,
                                bgcolor: tutorial.color,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { bgcolor: alpha(tutorial.color, 0.9) },
                              }}
                              endIcon={<ArrowForwardIcon />}
                            >
                              Start Learning
                            </Button>
                          </CardContent>
                        </TutorialCard>
                      </Grid>
                    ))}
                </Grid>
              </CategorySection>
            ))}
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} md={3}>
            {/* Leaderboard */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LeaderboardIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>Top Learners</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {leaderboard.map(user => (
                  <LeaderboardItem key={user.rank} rank={user.rank}>
                    <Typography variant="body2" fontWeight={700} sx={{ minWidth: 24 }}>
                      #{user.rank}
                    </Typography>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: user.rank <= 3 ? 'rgba(0,0,0,0.2)' : '#0d47a1',
                        fontSize: '0.875rem',
                      }}
                    >
                      {user.avatar}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {user.points.toLocaleString()} XP
                      </Typography>
                    </Box>
                    <Tooltip title="Streak">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocalFireDepartmentIcon sx={{ fontSize: 14 }} />
                        <Typography variant="caption" fontWeight={600}>{user.streak}</Typography>
                      </Box>
                    </Tooltip>
                  </LeaderboardItem>
                ))}
              </Box>

              <Button fullWidth variant="text" sx={{ mt: 2, textTransform: 'none' }}>
                View Full Leaderboard
              </Button>
            </Paper>

            {/* Achievements */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <MilitaryTechIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>Your Badges</Typography>
              </Box>

              <Grid container spacing={1}>
                {[
                  { icon: '🔥', name: '7-Day Streak', earned: true },
                  { icon: '📚', name: 'First Lesson', earned: true },
                  { icon: '✅', name: 'Quiz Master', earned: true },
                  { icon: '🚀', name: 'Fast Learner', earned: true },
                  { icon: '🏆', name: 'Certified', earned: false },
                  { icon: '⭐', name: 'Top 10%', earned: false },
                ].map((badge, idx) => (
                  <Grid item xs={4} key={idx}>
                    <Tooltip title={badge.name}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          textAlign: 'center',
                          borderRadius: 2,
                          bgcolor: badge.earned ? alpha('#0d47a1', 0.1) : alpha('#000', 0.03),
                          opacity: badge.earned ? 1 : 0.5,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: alpha('#0d47a1', 0.15) }
                        }}
                      >
                        <Typography variant="h5">{badge.icon}</Typography>
                      </Paper>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Pro Tips */}
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: alpha('#0d47a1', 0.03) }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                💡 Learning Tips
              </Typography>
              <List dense disablePadding>
                {[
                  'Complete exercises after each lesson',
                  'Take quizzes to test your knowledge',
                  'Use the "Try it Yourself" editor',
                  'Build projects to practice skills',
                  'Join the community for help',
                ].map((tip, idx) => (
                  <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color: '#4CAF50' }} />
                    </ListItemIcon>
                    <ListItemText primary={tip} primaryTypographyProps={{ fontSize: '0.85rem' }} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Learn;
