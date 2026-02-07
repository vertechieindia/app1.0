/**
 * Problems Page - Browse and Search All Coding Problems
 * Features:
 * - Real-time search
 * - Filter by difficulty, category, status
 * - Pagination
 * - Top problems view
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as SolvedIcon,
  RadioButtonUnchecked as UnsolvedIcon,
  Shuffle as RandomIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingIcon,
  LocalFireDepartment as StreakIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  Bolt as BoltIcon,
  Timer as TimerIcon,
  CalendarMonth as CalendarIcon,
  Leaderboard as LeaderboardIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(255, 165, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 165, 0, 0.8); }
`;

// Styled Card used for compact, professional-looking streak tiles
const StreakCard = styled(Card)(({ theme }) => ({
  borderRadius: 10,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 8px 20px rgba(15,23,42,0.9)'
      : '0 6px 16px rgba(15,23,42,0.12)',
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #1f2933 0%, #0b1120 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: `1px solid ${
    theme.palette.mode === 'dark'
      ? 'rgba(148, 163, 184, 0.35)'
      : 'rgba(148, 163, 184, 0.25)'
  }`,
}));

import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../config/api';
// import ContributionHeatmap from '../../components/ContributionHeatmap';

// Types
interface Problem {
  id: string;
  problem_number: number;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];            // from backend ProblemListResponse
  categories?: string[];      // optional, not required
  acceptance_rate: number;
  submission_count?: number;  // optional (list API doesn’t send this)
  is_solved?: boolean; 
}

interface ProblemStats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  solved_easy: number;
  solved_medium: number;
  solved_hard: number;
}

interface StreakStats {
  current_streak: number;
  max_streak: number;
  today_solved: number;
  week_solved: number;
}

// Streak Component – uses real data from /practice/streaks/
const StreakSection: React.FC<{ stats: StreakStats }> = ({ stats }) => {
  const currentStreak = stats.current_streak ?? 0;
  const longestStreak = stats.max_streak ?? 0;
  const todaySolved = stats.today_solved ?? 0;
  const weekSolved = stats.week_solved ?? 0;

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* Current Streak */}
      <Grid item xs={12} sm={6} md={3}>
        <StreakCard>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(248,113,113,0.14)',
              }}
            >
              <StreakIcon sx={{ fontSize: 20, color: '#f97316' }} />
            </Box>
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 0.6, opacity: 0.8 }}>
                Day streak
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                {currentStreak} days
              </Typography>
            </Box>
          </CardContent>
        </StreakCard>
      </Grid>

      {/* Longest Streak */}
      <Grid item xs={12} sm={6} md={3}>
        <StreakCard>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(96,165,250,0.16)',
              }}
            >
              <TrophyIcon sx={{ fontSize: 20, color: '#6366f1' }} />
            </Box>
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 0.6, opacity: 0.8 }}>
                Best streak
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                {longestStreak} days
              </Typography>
            </Box>
          </CardContent>
        </StreakCard>
      </Grid>

      {/* Today's Progress */}
      <Grid item xs={12} sm={6} md={3}>
        <StreakCard>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(52,211,153,0.12)',
              }}
            >
              <BoltIcon sx={{ fontSize: 20, color: '#22c55e' }} />
            </Box>
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 0.6, opacity: 0.8 }}>
                Solved today
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                {todaySolved} problems
              </Typography>
            </Box>
          </CardContent>
        </StreakCard>
      </Grid>

      {/* Weekly Activity */}
      <Grid item xs={12} sm={6} md={3}>
        <StreakCard>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(56,189,248,0.12)',
              }}
            >
              <CalendarIcon sx={{ fontSize: 20, color: '#0ea5e9' }} />
            </Box>
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 0.6, opacity: 0.8 }}>
                This week
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                {weekSolved} problems
              </Typography>
            </Box>
          </CardContent>
        </StreakCard>
      </Grid>
    </Grid>
  );
};


// ContributionHeatmap is now imported from shared components (see import at top)

// IDE Link Card Component
const IDELinkCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Paper
      onClick={() => navigate('/techie/ide')}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        cursor: 'pointer',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)',
          borderColor: '#6366f1',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box sx={{
          width: 80,
          height: 80,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
        }}>
          🖥️
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
            VerTechie IDE
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8', mb: 1.5 }}>
            Build real projects with our VS Code-like IDE. Create websites, web apps, mobile apps & extensions.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="🌐 Websites" size="small" sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }} />
            <Chip label="💻 Web Apps" size="small" sx={{ bgcolor: 'rgba(6, 182, 212, 0.2)', color: '#67e8f9' }} />
            <Chip label="📱 Mobile" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }} />
            <Chip label="🧩 Extensions" size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d' }} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' },
            }}
          >
            Open IDE →
          </Button>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Code Editor • Terminal • Live Preview
          </Typography>
        </Box>
      </Box>
      
      {/* Feature highlights */}
      <Box sx={{ display: 'flex', gap: 4, mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {[
          { icon: '📝', label: 'Monaco Editor', desc: 'VS Code-like editing' },
          { icon: '⌨️', label: 'Terminal', desc: 'npm, git commands' },
          { icon: '👁️', label: 'Live Preview', desc: 'Real-time updates' },
          { icon: '📤', label: 'Git Push', desc: 'GitHub / GitLab' },
        ].map((feature, i) => (
          <Box key={i} sx={{ flex: 1, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '1.5rem', mb: 0.5 }}>{feature.icon}</Typography>
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>{feature.label}</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>{feature.desc}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

// ProjectBuilder has been moved to dedicated IDEPage.tsx
// This is now just a link card to navigate to the IDE

// Progress Card Component
const ProgressCard: React.FC<{ stats: ProblemStats }> = ({ stats }) => {
  const theme = useTheme();
  
  const totalSolved = (stats.solved_easy || 0) + (stats.solved_medium || 0) + (stats.solved_hard || 0);
  const progressItems = [
    { label: 'Easy', solved: stats.solved_easy || 0, total: Math.max(stats.easy || 1, stats.solved_easy || 0), color: '#10b981' },
    { label: 'Medium', solved: stats.solved_medium || 0, total: Math.max(stats.medium || 1, stats.solved_medium || 0), color: '#f59e0b' },
    { label: 'Hard', solved: stats.solved_hard || 0, total: Math.max(stats.hard || 1, stats.solved_hard || 0), color: '#ef4444' },
    { label: 'Total Solved', solved: totalSolved, total: Math.max(stats.total || 1, totalSolved), color: '#6366f1' },
  ];
  
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {progressItems.map((item) => (
        <Grid item xs={6} md={3} key={item.label}>
          <Card
            sx={{
              borderRadius: 2,
              border: `1px solid ${alpha(item.color, 0.3)}`,
              background: alpha(item.color, 0.05),
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h5" sx={{ color: item.color, fontWeight: 700 }}>
                {item.solved}/{item.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={item.total > 0 ? (item.solved / item.total) * 100 : 0}
                sx={{
                  mt: 1,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha(item.color, 0.2),
                  '& .MuiLinearProgress-bar': { bgcolor: item.color },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// Main Component
const ProblemsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ProblemStats>({ total: 0, easy: 0, medium: 0, hard: 0, solved_easy: 0, solved_medium: 0, solved_hard: 0 });
  const [streakStats, setStreakStats] = useState<StreakStats>({ current_streak: 0, max_streak: 0, today_solved: 0, week_solved: 0 });
  
  // Fetch progress (real solved counts) from /practice/progress
  const fetchProgress = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      const res = await fetch(getApiUrl('/practice/progress'), {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setStats(prev => ({
        ...prev,
        solved_easy: data.easy_solved ?? 0,
        solved_medium: data.medium_solved ?? 0,
        solved_hard: data.hard_solved ?? 0,
        total: Math.max(prev.total, (data.total_solved ?? 0)),
      }));
    } catch {
      // ignore
    }
  }, []);

  // Fetch streak stats from /practice/streaks/
  const fetchStreaks = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      const res = await fetch(getApiUrl('/practice/streaks/'), {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setStreakStats({
        current_streak: data.current_streak ?? 0,
        max_streak: data.max_streak ?? 0,
        today_solved: data.today_solved ?? 0,
        week_solved: data.week_solved ?? 0,
      });
    } catch {
      // ignore
    }
  }, []);
  
  // Filters
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [category, setCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  
  // Categories
  const categories = [
    'Array', 'String', 'Hash Table', 'Linked List', 'Stack', 'Queue',
    'Tree', 'Binary Search', 'Dynamic Programming', 'Greedy', 'Graph',
    'Two Pointers', 'Sliding Window', 'Backtracking', 'Math', 'Bit Manipulation',
    'SQL', 'Design',
  ];
  
  // Fetch problems from FastAPI /practice/problems
  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      // Build query params to match FastAPI signature (skip / limit)
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (difficulty !== 'all') params.append('difficulty', difficulty);
      if (category !== 'all') params.append('category', category);
      const skip = page * rowsPerPage;
      params.append('skip', String(skip));
      params.append('limit', String(rowsPerPage));
      
      const response = await fetch(getApiUrl(`/practice/problems?${params.toString()}`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const msg = `Failed to fetch problems (${response.status})`;
        setError(msg);
        throw new Error(msg);
      }
      
      const data: Problem[] = await response.json();
      setProblems(data);
      setTotalCount(data.length);
      setError(null);
      fetchProgress();
      fetchStreaks();
    } catch (err: any) {
      console.error('Error fetching problems:', err);
      // Keep any previous data on error and show a friendly message
      if (!error) {
        setError('Unable to load problems from server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [search, difficulty, category, page, rowsPerPage, error, fetchProgress, fetchStreaks]);
  
  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);
  
  useEffect(() => {
    fetchProgress();
    fetchStreaks();
  }, [fetchProgress, fetchStreaks]);
  
  // Handle random problem
  const handleRandomProblem = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams();
      if (difficulty !== 'all') params.append('difficulty', difficulty);
      
      const response = await fetch(getApiUrl(`/practice/problems/random/?${params.toString()}`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const problem = await response.json();
        navigate(`/techie/problems/${problem.slug}`);
      } else {
        // Pick random from current list
        const random = problems[Math.floor(Math.random() * problems.length)];
        if (random) {
          navigate(`/techie/problems/${random.slug}`);
        }
      }
    } catch (err) {
      const random = problems[Math.floor(Math.random() * problems.length)];
      if (random) {
        navigate(`/techie/problems/${random.slug}`);
      }
    }
  };
  
  // Difficulty color
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Coding Problems
          </Typography>
          <Typography color="text.secondary">
            Practice coding challenges to ace your interviews
          </Typography>
        </Box>
        
        {/* Streak & Daily Progress */}
        <StreakSection stats={streakStats} />

        {/* IDE Link Card */}
        <IDELinkCard />

        {/* Progress Stats */}
        <ProgressCard stats={stats} />
        
        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={difficulty}
                  label="Difficulty"
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat.toLowerCase().replace(' ', '-')}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="solved">Solved</MenuItem>
                  <MenuItem value="unsolved">Unsolved</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<RandomIcon />}
                onClick={handleRandomProblem}
                sx={{
                  bgcolor: '#6366f1',
                  '&:hover': { bgcolor: '#4f46e5' },
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Pick Random
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Problems Table */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      <TableCell width={60}>Status</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell width={100}>Difficulty</TableCell>
                      <TableCell width={120}>Acceptance</TableCell>
                      <TableCell width={150}>Categories</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(statusFilter === 'solved'
                      ? problems.filter((p) => p.is_solved)
                      : statusFilter === 'unsolved'
                        ? problems.filter((p) => !p.is_solved)
                        : problems
                    ).map((problem) => (
                      <TableRow
                        key={problem.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/techie/problems/${problem.slug}`)}
                      >
                        <TableCell>
                          {problem.is_solved ? (
                            <SolvedIcon sx={{ color: '#10b981' }} />
                          ) : (
                            <UnsolvedIcon sx={{ color: 'text.disabled' }} />
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {problem.problem_number}. {problem.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={problem.difficulty}
                            size="small"
                            sx={{
                              bgcolor: alpha(getDifficultyColor(problem.difficulty), 0.15),
                              color: getDifficultyColor(problem.difficulty),
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {problem.acceptance_rate.toFixed(1)}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
  {(problem.categories ?? problem.tags ?? []).slice(0, 2).map((cat) => (
    <Chip
      key={cat}
      label={cat}
      size="small"
      variant="outlined"
      sx={{ fontSize: '0.7rem' }}
    />
  ))}
</Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[25, 50, 100]}
              />
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ProblemsPage;

