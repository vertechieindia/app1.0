/**
 * Problem Detail Page - Comprehensive Coding Problem Interface
 * Features:
 * - Full-featured Monaco Code Editor (VerTechieIDE)
 * - Multi-language support (Python, JavaScript, Java, C++, etc.)
 * - Run & Submit functionality with real execution
 * - Test case visualization
 * - Real-time execution results
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert,
  Tooltip,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Snackbar,
} from '@mui/material';
import {
  Lightbulb as HintIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkOutlineIcon,
  Share as ShareIcon,
  ThumbUp as LikeIcon,
  ThumbDown as DislikeIcon,
  NavigateBefore as BackIcon,
  CheckCircle as SuccessIcon,
  Cancel as ErrorIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../config/api';
import { VerTechieIDE, ExecutionResult, TestCase as IDETestCase } from '../../components/ide';

// Types
interface TestCase {
  id: string;
  input_data: string;
  expected_output: string;
  explanation?: string;
  is_sample: boolean;
}

interface Problem {
  id: string;
  problem_number: number;
  title: string;
  slug: string;
  description: string;
  constraints: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  hints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  categories: Array<{ name: string; slug: string }>;
  tags: string[];
  starter_code: Record<string, string>;
  supported_languages: string[];
  time_limit_ms: number;
  memory_limit_mb: number;
  acceptance_rate: number;
  submission_count: number;
  likes: number;
  dislikes: number;
  companies: string[];
  sample_test_cases: TestCase[];
  is_solved: boolean;
}

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

// Difficulty Badge
const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const colors: Record<string, string> = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444',
  };
  
  return (
    <Chip
      label={difficulty}
      size="small"
      sx={{
        backgroundColor: alpha(colors[difficulty] || '#6b7280', 0.15),
        color: colors[difficulty] || '#6b7280',
        fontWeight: 600,
        textTransform: 'capitalize',
      }}
    />
  );
};

// Main Component
const ProblemDetail: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  
  // State
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [leftTabValue, setLeftTabValue] = useState(0);
  
  const [showHints, setShowHints] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Fetch problem
  const fetchProblem = useCallback(async () => {
    if (!slug) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(`v_techie/problems/${slug}/`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Problem not found');
      }
      
      const data = await response.json();
      setProblem(data);
    } catch (err: any) {
      console.error('Error fetching problem:', err);
      setError(err.message || 'Failed to load problem');
      
      // Mock data for development
      setProblem({
        id: '1',
        problem_number: 1,
        title: 'Two Sum',
        slug: 'two-sum',
        description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
        constraints: `- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
          { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: '' },
          { input: 'nums = [3,3], target = 6', output: '[0,1]', explanation: '' },
        ],
        hints: [
          'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.',
          'Try to use a hash map to store the numbers you have seen so far.',
          'What if we check if target - current_number exists in the hash map?',
        ],
        difficulty: 'easy',
        categories: [{ name: 'Array', slug: 'array' }, { name: 'Hash Table', slug: 'hash-table' }],
        tags: ['array', 'hash-table'],
        starter_code: {
          python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here
        hash_map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in hash_map:
                return [hash_map[complement], i]
            hash_map[num] = i
        return []`,
          javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`,
          java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
          cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`,
          go: `func twoSum(nums []int, target int) []int {
    m := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if j, ok := m[complement]; ok {
            return []int{j, i}
        }
        m[num] = i
    }
    return nil
}`,
          rust: `impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        use std::collections::HashMap;
        let mut map = HashMap::new();
        for (i, &num) in nums.iter().enumerate() {
            let complement = target - num;
            if let Some(&j) = map.get(&complement) {
                return vec![j as i32, i as i32];
            }
            map.insert(num, i);
        }
        vec![]
    }
}`,
        },
        supported_languages: ['python', 'javascript', 'java', 'cpp', 'go', 'rust', 'typescript', 'c', 'csharp', 'kotlin', 'swift'],
        time_limit_ms: 2000,
        memory_limit_mb: 256,
        acceptance_rate: 49.1,
        submission_count: 15234567,
        likes: 45678,
        dislikes: 1234,
        companies: ['Google', 'Amazon', 'Facebook', 'Microsoft', 'Apple'],
        sample_test_cases: [
          { id: '1', input_data: '[2,7,11,15]\n9', expected_output: '[0,1]', is_sample: true },
          { id: '2', input_data: '[3,2,4]\n6', expected_output: '[1,2]', is_sample: true },
          { id: '3', input_data: '[3,3]\n6', expected_output: '[0,1]', is_sample: true },
        ],
        is_solved: false,
      });
    } finally {
      setLoading(false);
    }
  }, [slug]);
  
  useEffect(() => {
    fetchProblem();
  }, [fetchProblem]);
  
  // Convert test cases to IDE format
  const ideTestCases: IDETestCase[] = problem?.sample_test_cases.map((tc, idx) => ({
    id: tc.id,
    name: `Case ${idx + 1}`,
    input: tc.input_data,
    expectedOutput: tc.expected_output,
  })) || [];
  
  // Handle code execution (Run) - Uses Judge service for REAL EXECUTION
  const handleRun = async (code: string, language: string, input: string): Promise<ExecutionResult> => {
    if (!problem) {
      return { status: 'error', output: '', error: 'No problem loaded' };
    }
    
    // Import the real execution service
    const { codeExecutionService } = await import('../../services/CodeExecutionService');
    
    // Use the Judge service for problem execution
    return await codeExecutionService.executeForProblem(
      code,
      language,
      problem.slug,
      'run'
    );
  };
  
  // Handle code submission - Uses Judge service for REAL EXECUTION
  const handleSubmit = async (code: string, language: string): Promise<ExecutionResult> => {
    if (!problem) {
      return { status: 'error', output: '', error: 'No problem loaded' };
    }
    
    // Import the real execution service
    const { codeExecutionService } = await import('../../services/CodeExecutionService');
    
    // Use the Judge service for submission
    const result = await codeExecutionService.executeForProblem(
      code,
      language,
      problem.slug,
      'submit'
    );
    
    // Show result notification
    if (result.status === 'success') {
      setSnackbar({ open: true, message: '🎉 Accepted! Great job!', severity: 'success' });
    } else if (result.status === 'compile_error') {
      setSnackbar({ open: true, message: `Compile Error: ${result.error}`, severity: 'error' });
    } else if (result.status === 'runtime_error') {
      setSnackbar({ open: true, message: `Runtime Error`, severity: 'error' });
    } else if (result.status === 'time_limit') {
      setSnackbar({ open: true, message: 'Time Limit Exceeded', severity: 'error' });
    } else if (result.testResults) {
      setSnackbar({ 
        open: true, 
        message: `Wrong Answer: ${result.testResults.passed}/${result.testResults.total} test cases passed`, 
        severity: 'error' 
      });
    } else {
      setSnackbar({ open: true, message: result.error || 'Submission failed', severity: 'error' });
    }
    
    return result;
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!problem) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Problem not found</Alert>
        <Button onClick={() => navigate('/techie/problems')} sx={{ mt: 2 }}>
          Back to Problems
        </Button>
      </Container>
    );
  }
  
  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ px: 2, py: 1, borderRadius: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/techie/problems')} size="small">
          <BackIcon />
        </IconButton>
        
        <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 0 }}>
          {problem.problem_number}. {problem.title}
        </Typography>
        
        <DifficultyBadge difficulty={problem.difficulty} />
        
        {problem.is_solved && (
          <Chip
            icon={<SuccessIcon />}
            label="Solved"
            size="small"
            color="success"
            variant="outlined"
          />
        )}
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}>
            <IconButton onClick={() => setIsBookmarked(!isBookmarked)} size="small">
              {isBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkOutlineIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Share">
            <IconButton size="small">
              <ShareIcon />
            </IconButton>
          </Tooltip>
          
          <Divider orientation="vertical" flexItem />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small">
              <LikeIcon />
            </IconButton>
            <Typography variant="body2">{problem.likes.toLocaleString()}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small">
              <DislikeIcon />
            </IconButton>
            <Typography variant="body2">{problem.dislikes.toLocaleString()}</Typography>
          </Box>
          
          <Divider orientation="vertical" flexItem />
          
          <Typography variant="body2" color="text.secondary">
            Acceptance: <strong>{problem.acceptance_rate.toFixed(1)}%</strong>
          </Typography>
        </Box>
      </Paper>
      
      {/* Main Content */}
      <Grid container sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {/* Left Panel - Problem Description */}
        <Grid item xs={12} md={5} sx={{ height: '100%', overflow: 'auto', borderRight: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ p: 0 }}>
            <Tabs value={leftTabValue} onChange={(e, v) => setLeftTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Description" />
              <Tab label="Solutions" />
              <Tab label="Submissions" />
            </Tabs>
            
            <TabPanel value={leftTabValue} index={0}>
              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7 }}>
                  {problem.description}
                </Typography>
              </Box>
              
              {/* Examples */}
              {problem.examples.map((example, idx) => (
                <Paper key={idx} sx={{ p: 2, mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Example {idx + 1}:
                  </Typography>
                  <Box sx={{ fontFamily: '"Fira Code", monospace', fontSize: '0.875rem' }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Input:</strong> {example.input}</Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Output:</strong> {example.output}</Typography>
                    {example.explanation && (
                      <Typography variant="body2" color="text.secondary"><strong>Explanation:</strong> {example.explanation}</Typography>
                    )}
                  </Box>
                </Paper>
              ))}
              
              {/* Constraints */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Constraints:
                </Typography>
                <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap', fontFamily: '"Fira Code", monospace', bgcolor: alpha(theme.palette.grey[500], 0.1), p: 1.5, borderRadius: 1 }}>
                  {problem.constraints}
                </Typography>
              </Box>
              
              {/* Hints */}
              {problem.hints.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Button
                    startIcon={<HintIcon />}
                    endIcon={showHints ? <CollapseIcon /> : <ExpandIcon />}
                    onClick={() => setShowHints(!showHints)}
                    sx={{ textTransform: 'none', mb: 1 }}
                  >
                    Hints ({problem.hints.length})
                  </Button>
                  <Collapse in={showHints}>
                    <List dense>
                      {problem.hints.map((hint, idx) => (
                        <ListItem key={idx}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <HintIcon fontSize="small" color="warning" />
                          </ListItemIcon>
                          <ListItemText primary={hint} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </Box>
              )}
              
              {/* Tags & Companies */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Topics:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {problem.categories.map((cat) => (
                    <Chip key={cat.slug} label={cat.name} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
              
              {problem.companies.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Companies:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {problem.companies.map((company) => (
                      <Chip key={company} label={company} size="small" />
                    ))}
                  </Box>
                </Box>
              )}
              
              {/* Stats */}
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary">
                  {problem.submission_count.toLocaleString()} submissions
                </Typography>
              </Box>
            </TabPanel>
            
            <TabPanel value={leftTabValue} index={1}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary" gutterBottom>
                  Solutions will be shown here after you solve the problem.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Or you can view community solutions after 10 attempts.
                </Typography>
              </Box>
            </TabPanel>
            
            <TabPanel value={leftTabValue} index={2}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  Your submissions history will appear here.
                </Typography>
              </Box>
            </TabPanel>
          </Box>
        </Grid>
        
        {/* Right Panel - Code Editor */}
        <Grid item xs={12} md={7} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <VerTechieIDE
            problemId={problem.id}
            problemTitle={problem.title}
            initialLanguage="python"
            starterCode={problem.starter_code}
            testCases={ideTestCases}
            onRun={handleRun}
            onSubmit={handleSubmit}
            showSubmitButton={true}
            showTestCases={true}
            height="100%"
          />
        </Grid>
      </Grid>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProblemDetail;
