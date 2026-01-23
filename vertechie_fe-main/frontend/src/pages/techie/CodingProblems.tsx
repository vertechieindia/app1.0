/**
 * Coding Problems Page - LeetCode-style problem listing
 * Features: Filtering, search, difficulty levels, progress tracking
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  LinearProgress,
  useTheme,
  alpha,
  Skeleton,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Shuffle as RandomIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  TrendingUp as TrendingIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getApiUrl } from '../../config/api';

interface Problem {
  id: string;
  problem_number: number;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  acceptance_rate: number;
  categories: string[];
  tags: string[];
  is_solved: boolean;
  is_premium: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  problem_count: number;
}

const CodingProblems: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [problems, setProblems] = useState<Problem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [difficulty, setDifficulty] = useState<string>(searchParams.get('difficulty') || 'all');
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'all');
  const [status, setStatus] = useState<string>(searchParams.get('status') || 'all');
  
  // Stats
  const [stats, setStats] = useState({
    total: 400,
    easy: 100,
    medium: 200,
    hard: 100,
    solved: 45,
    easySolved: 15,
    mediumSolved: 22,
    hardSolved: 8,
  });
  
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };
  
  // Fetch problems
  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams({
        page: String(page + 1),
        page_size: String(rowsPerPage),
      });
      
      if (search) params.append('search', search);
      if (difficulty !== 'all') params.append('difficulty', difficulty);
      if (category !== 'all') params.append('categories', category);
      
      const response = await fetch(
        getApiUrl(`/practice/problems/?${params}`),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setProblems(data.results || data);
        setTotalCount(data.count || data.length);
      } else {
        // Mock data for demonstration
        setProblems([
          { id: '1', problem_number: 1, title: 'Two Sum', slug: 'two-sum', difficulty: 'easy', acceptance_rate: 49.1, categories: ['Array', 'Hash Table'], tags: ['amazon', 'google'], is_solved: true, is_premium: false },
          { id: '2', problem_number: 2, title: 'Add Two Numbers', slug: 'add-two-numbers', difficulty: 'medium', acceptance_rate: 40.2, categories: ['Linked List', 'Math'], tags: ['microsoft'], is_solved: false, is_premium: false },
          { id: '3', problem_number: 3, title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring', difficulty: 'medium', acceptance_rate: 33.8, categories: ['String', 'Sliding Window'], tags: ['amazon'], is_solved: true, is_premium: false },
          { id: '4', problem_number: 4, title: 'Median of Two Sorted Arrays', slug: 'median-two-sorted', difficulty: 'hard', acceptance_rate: 35.9, categories: ['Array', 'Binary Search'], tags: ['google'], is_solved: false, is_premium: false },
          { id: '5', problem_number: 5, title: 'Longest Palindromic Substring', slug: 'longest-palindrome', difficulty: 'medium', acceptance_rate: 32.4, categories: ['String', 'DP'], tags: [], is_solved: false, is_premium: false },
          { id: '6', problem_number: 6, title: 'Zigzag Conversion', slug: 'zigzag-conversion', difficulty: 'medium', acceptance_rate: 44.1, categories: ['String'], tags: [], is_solved: false, is_premium: false },
          { id: '7', problem_number: 7, title: 'Reverse Integer', slug: 'reverse-integer', difficulty: 'medium', acceptance_rate: 27.5, categories: ['Math'], tags: [], is_solved: true, is_premium: false },
          { id: '8', problem_number: 8, title: 'String to Integer (atoi)', slug: 'string-to-integer', difficulty: 'medium', acceptance_rate: 16.6, categories: ['String'], tags: [], is_solved: false, is_premium: false },
          { id: '9', problem_number: 9, title: 'Palindrome Number', slug: 'palindrome-number', difficulty: 'easy', acceptance_rate: 53.4, categories: ['Math'], tags: [], is_solved: true, is_premium: false },
          { id: '10', problem_number: 10, title: 'Regular Expression Matching', slug: 'regex-matching', difficulty: 'hard', acceptance_rate: 27.7, categories: ['String', 'DP'], tags: ['google', 'facebook'], is_solved: false, is_premium: true },
        ]);
        setTotalCount(400);
      }
    } catch (err) {
      console.error('Error fetching problems:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, difficulty, category]);
  
  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        getApiUrl('/practice/categories/'),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data.results || data);
      } else {
        // Mock categories
        setCategories([
          { id: 1, name: 'Array', slug: 'array', problem_count: 150 },
          { id: 2, name: 'String', slug: 'string', problem_count: 100 },
          { id: 3, name: 'Hash Table', slug: 'hash-table', problem_count: 80 },
          { id: 4, name: 'Dynamic Programming', slug: 'dp', problem_count: 120 },
          { id: 5, name: 'Math', slug: 'math', problem_count: 60 },
          { id: 6, name: 'Tree', slug: 'tree', problem_count: 90 },
          { id: 7, name: 'Binary Search', slug: 'binary-search', problem_count: 70 },
          { id: 8, name: 'Graph', slug: 'graph', problem_count: 85 },
        ]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);
  
  useEffect(() => {
    fetchProblems();
    fetchCategories();
  }, [fetchProblems, fetchCategories]);
  
  // Random problem
  const handleRandomProblem = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams();
      if (difficulty !== 'all') params.append('difficulty', difficulty);
      
      const response = await fetch(
        getApiUrl(`/practice/problems/random/?${params}`),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const problem = await response.json();
        navigate(`/techie/problems/${problem.slug}`);
      } else {
        // Pick random from current list
        if (problems.length > 0) {
          const randomIndex = Math.floor(Math.random() * problems.length);
          navigate(`/techie/problems/${problems[randomIndex].slug}`);
        }
      }
    } catch (err) {
      console.error('Error getting random problem:', err);
    }
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
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Coding Problems
          </Typography>
          <Typography color="text.secondary">
            Practice coding challenges to ace your interviews
          </Typography>
        </Box>
        
        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 2, border: `1px solid ${alpha('#10b981', 0.3)}`, bgcolor: alpha('#10b981', 0.05) }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981' }}>
                  {stats.easySolved}/{stats.easy}
                </Typography>
                <Typography variant="body2" color="text.secondary">Easy</Typography>
                <LinearProgress
                  variant="determinate"
                  value={(stats.easySolved / stats.easy) * 100}
                  sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: alpha('#10b981', 0.2), '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 2, border: `1px solid ${alpha('#f59e0b', 0.3)}`, bgcolor: alpha('#f59e0b', 0.05) }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                  {stats.mediumSolved}/{stats.medium}
                </Typography>
                <Typography variant="body2" color="text.secondary">Medium</Typography>
                <LinearProgress
                  variant="determinate"
                  value={(stats.mediumSolved / stats.medium) * 100}
                  sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: alpha('#f59e0b', 0.2), '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b' } }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 2, border: `1px solid ${alpha('#ef4444', 0.3)}`, bgcolor: alpha('#ef4444', 0.05) }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#ef4444' }}>
                  {stats.hardSolved}/{stats.hard}
                </Typography>
                <Typography variant="body2" color="text.secondary">Hard</Typography>
                <LinearProgress
                  variant="determinate"
                  value={(stats.hardSolved / stats.hard) * 100}
                  sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: alpha('#ef4444', 0.2), '& .MuiLinearProgress-bar': { bgcolor: '#ef4444' } }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ borderRadius: 2, border: `1px solid ${alpha('#6366f1', 0.3)}`, bgcolor: alpha('#6366f1', 0.05) }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#6366f1' }}>
                  {stats.solved}/{stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">Total Solved</Typography>
                <LinearProgress
                  variant="determinate"
                  value={(stats.solved / stats.total) * 100}
                  sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: alpha('#6366f1', 0.2), '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' } }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
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
                size="small"
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
                    <MenuItem key={cat.id} value={cat.slug}>
                      {cat.name} ({cat.problem_count})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="solved">Solved</MenuItem>
                  <MenuItem value="unsolved">Unsolved</MenuItem>
                  <MenuItem value="attempted">Attempted</MenuItem>
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
                  bgcolor: '#10b981',
                  '&:hover': { bgcolor: '#059669' },
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
            <Box sx={{ p: 3 }}>
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} height={60} sx={{ mb: 1 }} />
              ))}
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha('#6366f1', 0.05) }}>
                      <TableCell width={50}>Status</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell width={100}>Difficulty</TableCell>
                      <TableCell width={120}>Acceptance</TableCell>
                      <TableCell width={150}>Categories</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {problems
                      .filter((p) => status === 'all' || (status === 'solved' && p.is_solved) || (status === 'unsolved' && !p.is_solved))
                      .map((problem) => (
                        <TableRow
                          key={problem.id}
                          hover
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { bgcolor: alpha('#6366f1', 0.05) },
                          }}
                          onClick={() => navigate(`/techie/problems/${problem.slug}`)}
                        >
                          <TableCell>
                            {problem.is_solved ? (
                              <CheckIcon sx={{ color: '#10b981' }} />
                            ) : (
                              <UncheckedIcon sx={{ color: 'text.disabled' }} />
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {problem.problem_number}. {problem.title}
                              </Typography>
                              {problem.is_premium && (
                                <Tooltip title="Premium">
                                  <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                                </Tooltip>
                              )}
                            </Box>
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
                              {problem.categories.slice(0, 2).map((cat, i) => (
                                <Chip
                                  key={i}
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
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CodingProblems;

