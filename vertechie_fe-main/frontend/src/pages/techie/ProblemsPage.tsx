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

// Styled Components for Achievements
const StreakCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
  color: 'white',
  borderRadius: 16,
  animation: `${pulse} 2s ease-in-out infinite`,
}));

import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../config/api';
import ContributionHeatmap from '../../components/ContributionHeatmap';

// Types
interface Problem {
  id: string;
  problem_number: number;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  categories: string[];
  acceptance_rate: number;
  submission_count: number;
  is_solved: boolean;
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


// Streak Component
const StreakSection: React.FC = () => {
  const currentStreak = 12;
  const longestStreak = 21;
  const todaySolved = 3;

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* Current Streak */}
      <Grid item xs={12} md={3}>
        <StreakCard>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <StreakIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {currentStreak}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Day Streak 🔥
            </Typography>
          </CardContent>
        </StreakCard>
      </Grid>

      {/* Longest Streak */}
      <Grid item xs={12} md={3}>
        <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <TrophyIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {longestStreak}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Best Streak
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Today's Progress */}
      <Grid item xs={12} md={3}>
        <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <BoltIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {todaySolved}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Solved Today
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Weekly Activity */}
      <Grid item xs={12} md={3}>
        <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <CalendarIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              24
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              This Week
            </Typography>
          </CardContent>
        </Card>
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
  
  const progressItems = [
    { label: 'Easy', solved: stats.solved_easy || 15, total: stats.easy || 100, color: '#10b981' },
    { label: 'Medium', solved: stats.solved_medium || 22, total: stats.medium || 200, color: '#f59e0b' },
    { label: 'Hard', solved: stats.solved_hard || 8, total: stats.hard || 100, color: '#ef4444' },
    { label: 'Total Solved', solved: (stats.solved_easy || 15) + (stats.solved_medium || 22) + (stats.solved_hard || 8), total: stats.total || 400, color: '#6366f1' },
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
                value={(item.solved / item.total) * 100}
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
  const [stats, setStats] = useState<ProblemStats>({ total: 400, easy: 100, medium: 200, hard: 100, solved_easy: 15, solved_medium: 22, solved_hard: 8 });
  
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
  
  // Fetch problems
  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      // Build query params
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (difficulty !== 'all') params.append('difficulty', difficulty);
      if (category !== 'all') params.append('category', category);
      params.append('page', String(page + 1));
      params.append('page_size', String(rowsPerPage));
      
      const response = await fetch(getApiUrl(`/practice/problems/?${params.toString()}`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch problems');
      }
      
      const data = await response.json();
      setProblems(data.results || data);
      setTotalCount(data.count || data.length);
    } catch (err: any) {
      console.error('Error fetching problems:', err);
      
      // Generate mock problems for development
      const mockProblems: Problem[] = [];
      const titles = [
        'Two Sum', 'Add Two Numbers', 'Longest Substring Without Repeating Characters',
        'Median of Two Sorted Arrays', 'Longest Palindromic Substring', 'Zigzag Conversion',
        'Reverse Integer', 'String to Integer (atoi)', 'Palindrome Number', 'Regular Expression Matching',
        'Container With Most Water', '3Sum', '3Sum Closest', 'Letter Combinations of a Phone Number',
        '4Sum', 'Remove Nth Node From End of List', 'Valid Parentheses', 'Merge Two Sorted Lists',
        'Generate Parentheses', 'Merge k Sorted Lists', 'Swap Nodes in Pairs', 'Reverse Nodes in k-Group',
        'Remove Duplicates from Sorted Array', 'Remove Element', 'Find the Index of the First Occurrence',
        'Divide Two Integers', 'Substring with Concatenation of All Words', 'Next Permutation',
        'Longest Valid Parentheses', 'Search in Rotated Sorted Array', 'Find First and Last Position',
        'Search Insert Position', 'Valid Sudoku', 'Sudoku Solver', 'Count and Say', 'Combination Sum',
        'Combination Sum II', 'First Missing Positive', 'Trapping Rain Water', 'Multiply Strings',
        'Wildcard Matching', 'Jump Game II', 'Permutations', 'Permutations II', 'Rotate Image',
        'Group Anagrams', "Pow(x, n)", 'N-Queens', 'N-Queens II', 'Maximum Subarray',
      ];
      
      for (let i = 0; i < 50; i++) {
        const diff = i < 20 ? 'easy' : i < 40 ? 'medium' : 'hard';
        mockProblems.push({
          id: String(i + 1),
          problem_number: i + 1,
          title: titles[i % titles.length],
          slug: titles[i % titles.length].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          difficulty: diff,
          categories: ['Array', 'Hash Table'].slice(0, Math.floor(Math.random() * 2) + 1),
          acceptance_rate: 30 + Math.random() * 40,
          submission_count: Math.floor(Math.random() * 1000000),
          is_solved: Math.random() > 0.7,
        });
      }
      
      // Apply filters
      let filtered = mockProblems;
      if (search) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
      }
      if (difficulty !== 'all') {
        filtered = filtered.filter(p => p.difficulty === difficulty);
      }
      if (statusFilter === 'solved') {
        filtered = filtered.filter(p => p.is_solved);
      } else if (statusFilter === 'unsolved') {
        filtered = filtered.filter(p => !p.is_solved);
      }
      
      setProblems(filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
      setTotalCount(filtered.length);
    } finally {
      setLoading(false);
    }
  }, [search, difficulty, category, statusFilter, page, rowsPerPage]);
  
  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);
  
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
        <StreakSection />

        {/* Contribution Heatmap */}
        <ContributionHeatmap />

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
                    {problems.map((problem) => (
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
                            {problem.categories.slice(0, 2).map((cat) => (
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

