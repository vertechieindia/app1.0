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
import { getStatusLabel, getErrorMessage } from '../../services/CodeExecutionService';

// Default starter code when API doesn't return any (e.g. Two Sum)
const DEFAULT_STARTER_CODE: Record<string, Record<string, string>> = {
  'two-sum': {
    python: `# Two Sum - read input and print indices
import re
import ast

def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        comp = target - n
        if comp in seen:
            return [seen[comp], i]
        seen[n] = i
    return []

# Parse input like "nums = [2,7,11,15], target = 9"
s = input().strip()
nums_match = re.search(r'\\[[^\\]]+\\]', s)
target_match = re.search(r'target\\s*=\\s*(-?\\d+)', s, re.I)
nums = ast.literal_eval(nums_match.group(0)) if nums_match else []
target = int(target_match.group(1)) if target_match else 0

result = two_sum(nums, target)
print(result)`,
  },
};

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

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatSolutionContent = (raw: string): string => {
  const escaped = escapeHtml(raw || '');
  return escaped
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code style="color:#fff">$2</code></pre>')
    .replace(/\n/g, '<br />');
};

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
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loadingSolutions, setLoadingSolutions] = useState(false);

  // Fetch problem
  const fetchProblem = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(getApiUrl(`/practice/problems/slug/${slug}`), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Problem not found');
      }

      const data = await response.json();
      // Ensure problem has required fields
      if (!data.id) {
        console.error('Problem data missing id field:', data);
        setError('Invalid problem data received from server');
        return;
      }
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

  // Fetch submissions when submissions tab is selected
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (leftTabValue !== 2 || !problem?.id) return;

      setLoadingSubmissions(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(
          getApiUrl(`/practice/submissions?problem_id=${problem.id}`),
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSubmissions(data);
        }
      } catch (err) {
        console.error('Error fetching submissions:', err);
      } finally {
        setLoadingSubmissions(false);
      }
    };

    fetchSubmissions();
  }, [leftTabValue, problem?.id]);

  // Fetch solutions when solutions tab is selected
  useEffect(() => {
    const fetchSolutions = async () => {
      if (leftTabValue !== 1 || !problem?.id) return;

      setLoadingSolutions(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(
          getApiUrl(`/practice/problems/${problem.id}/solutions`),
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSolutions(data);
        }
      } catch (err) {
        console.error('Error fetching solutions:', err);
      } finally {
        setLoadingSolutions(false);
      }
    };

    fetchSolutions();
  }, [leftTabValue, problem?.id]);

  // Convert test cases to IDE format (safe for real API data without sample_test_cases)
  const ideTestCases: IDETestCase[] =
    (problem?.sample_test_cases ?? []).map((tc, idx) => ({
      id: tc.id,
      name: `Case ${idx + 1}`,
      input: tc.input_data,
      expectedOutput: tc.expected_output,
    }));

  // Handle code execution (Run) - Uses backend API
  const handleRun = async (code: string, language: string, input: string): Promise<ExecutionResult> => {
    if (!problem || !problem.id) {
      return { status: 'error', output: '', error: 'No problem loaded' };
    }

    // Import the real execution service
    const { codeExecutionService } = await import('../../services/CodeExecutionService');

    // Use backend API for problem execution (pass problem.id as UUID, not slug)
    const result = await codeExecutionService.executeForProblem(
      code,
      language,
      problem.id,  // Use problem.id (UUID) instead of problem.slug
      'run'
    );
    return result as ExecutionResult;
  };

  // Handle code submission - Submit to backend API and poll for results
  const handleSubmit = async (code: string, language: string): Promise<ExecutionResult> => {
    if (!problem) {
      return { status: 'error', output: '', error: 'No problem loaded' };
    }

    try {
      const token = localStorage.getItem('authToken');

      // Submit code to backend
      const submitResponse = await fetch(
        getApiUrl('/practice/submit'),
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            problem_id: problem.id,
            language: language,
            code: code,
            is_submission: true,
          }),
        }
      );

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json().catch(() => ({}));
        return {
          status: 'error',
          output: '',
          error: errorData.detail || 'Submission failed',
        };
      }

      const submission = await submitResponse.json();

      // Poll for submission status updates
      const pollSubmission = async (submissionId: string): Promise<ExecutionResult> => {
        const maxAttempts = 60; // Poll for up to 60 seconds
        const pollInterval = 1000; // Poll every 1 second

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          await new Promise(resolve => setTimeout(resolve, pollInterval));

          try {
            const statusResponse = await fetch(
              getApiUrl(`/practice/submissions/${submissionId}`),
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (statusResponse.ok) {
              const updatedSubmission = await statusResponse.json();

              // Check if status is final (not pending or running)
              if (
                updatedSubmission.status !== 'pending' &&
                updatedSubmission.status !== 'running'
              ) {
                // Refresh submissions list
                if (leftTabValue === 2) {
                  const submissionsResponse = await fetch(
                    getApiUrl(`/practice/submissions?problem_id=${problem.id}`),
                    {
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                    }
                  );
                  if (submissionsResponse.ok) {
                    const submissionsData = await submissionsResponse.json();
                    setSubmissions(submissionsData);
                  }
                }

                // Map submission status to execution result
                const statusMap: Record<string, 'success' | 'error' | 'compile_error' | 'time_limit'> = {
                  'accepted': 'success',
                  'wrong_answer': 'error',
                  'runtime_error': 'error',
                  'time_limit': 'time_limit',
                  'compile_error': 'compile_error',
                  'internal_error': 'error',
                };

                const mappedStatus = statusMap[updatedSubmission.status] || 'error';
                const result: ExecutionResult = {
                  status: mappedStatus as ExecutionResult['status'],
                  output: updatedSubmission.status === 'accepted'
                    ? `All ${updatedSubmission.test_cases_passed}/${updatedSubmission.test_cases_total} test cases passed!`
                    : '',
                  error: updatedSubmission.status !== 'accepted'
                    ? getErrorMessage(updatedSubmission)
                    : undefined,
                  statusLabel: getStatusLabel(
                    updatedSubmission.status,
                    updatedSubmission.test_cases_passed,
                    updatedSubmission.test_cases_total
                  ),
                  executionTime: updatedSubmission.runtime_ms,
                  memoryUsage: updatedSubmission.memory_kb,
                };

                // Show result notification and mark problem as solved in UI
                if (result.status === 'success') {
                  setSnackbar({ open: true, message: '🎉 Accepted! Great job!', severity: 'success' });
                  setProblem((prev) => (prev ? { ...prev, is_solved: true } : prev));
                } else if (updatedSubmission.status === 'compile_error') {
                  setSnackbar({ open: true, message: `Compile Error: ${updatedSubmission.error_message}`, severity: 'error' });
                } else if (updatedSubmission.status === 'runtime_error') {
                  setSnackbar({ open: true, message: `Runtime Error`, severity: 'error' });
                } else if (updatedSubmission.status === 'time_limit') {
                  setSnackbar({ open: true, message: 'Time Limit Exceeded', severity: 'error' });
                } else {
                  setSnackbar({
                    open: true,
                    message: `Wrong Answer: ${updatedSubmission.test_cases_passed}/${updatedSubmission.test_cases_total} test cases passed`,
                    severity: 'error'
                  });
                }

                return result;
              }
            }
          } catch (pollError) {
            console.error('Error polling submission status:', pollError);
          }
        }

        // Timeout - return pending status
        return {
          status: 'error',
          output: '',
          error: 'Submission is taking longer than expected. Please check the submissions tab for updates.',
        };
      };

      // Start polling
      return await pollSubmission(submission.id);

    } catch (error: any) {
      return {
        status: 'error',
        output: '',
        error: error.message || 'Submission failed',
      };
    }
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
            <Typography variant="body2">{(problem.likes || 0).toLocaleString()}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small">
              <DislikeIcon />
            </IconButton>
            <Typography variant="body2">{(problem.dislikes || 0).toLocaleString()}</Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Typography variant="body2" color="text.secondary">
            Acceptance: <strong>{(problem.acceptance_rate || 0).toFixed(1)}%</strong>
          </Typography>
        </Box>
      </Paper>

      {/* Main Content */}
      <Grid container sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {/* Left Panel - Problem Description (dark panel: white text to match IDE) */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            height: '100%',
            overflow: 'auto',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: '#1e1e1e',
            color: '#ffffff',
          }}
        >
          <Box sx={{ p: 0 }}>
            <Tabs
              value={leftTabValue}
              onChange={(e, v) => setLeftTabValue(v)}
              sx={{
                borderBottom: 1,
                borderColor: 'rgba(255,255,255,0.12)',
                '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' },
                '& .Mui-selected': { color: '#fff' },
                '& .MuiTabs-indicator': { backgroundColor: '#5AC8FA' },
              }}
            >
              <Tab label="Description" />
              <Tab label="Solutions" />
              <Tab label="Submissions" />
            </Tabs>

            <TabPanel value={leftTabValue} index={0}>
              {/* Description */}
              <Box sx={{ mb: 3, color: '#ffffff' }}>
                <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7, color: '#ffffff' }}>
                  {problem.description}
                </Typography>
              </Box>

              {/* Examples */}
              {(problem.examples || []).map((example, idx) => (
                <Paper
                  key={idx}
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: 'rgba(255,255,255,0.06)',
                    borderRadius: 2,
                    color: '#ffffff',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#ffffff' }}>
                    Example {idx + 1}:
                  </Typography>
                  <Box sx={{ fontFamily: '"Fira Code", monospace', fontSize: '0.875rem', color: '#ffffff' }}>
                    <Typography variant="body2" sx={{ mb: 0.5, color: '#ffffff' }}><strong>Input:</strong> {example.input}</Typography>
                    <Typography variant="body2" sx={{ mb: 0.5, color: '#ffffff' }}><strong>Output:</strong> {example.output}</Typography>
                    {example.explanation && (
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}><strong>Explanation:</strong> {example.explanation}</Typography>
                    )}
                  </Box>
                </Paper>
              ))}

              {/* Constraints */}
              <Box sx={{ mb: 3, color: '#ffffff' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#ffffff' }}>
                  Constraints:
                </Typography>
                <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap', fontFamily: '"Fira Code", monospace', bgcolor: 'rgba(255,255,255,0.08)', p: 1.5, borderRadius: 1, color: '#ffffff' }}>
                  {problem.constraints}
                </Typography>
              </Box>

              {/* Hints */}
              {(problem.hints || []).length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Button
                    startIcon={<HintIcon />}
                    endIcon={showHints ? <CollapseIcon /> : <ExpandIcon />}
                    onClick={() => setShowHints(!showHints)}
                    sx={{ textTransform: 'none', mb: 1, color: '#ffffff' }}
                  >
                    Hints ({(problem.hints || []).length})
                  </Button>
                  <Collapse in={showHints}>
                    <List dense>
                      {(problem.hints || []).map((hint, idx) => (
                        <ListItem key={idx}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <HintIcon fontSize="small" sx={{ color: '#FF9500' }} />
                          </ListItemIcon>
                          <ListItemText primary={hint} primaryTypographyProps={{ sx: { color: '#ffffff' } }} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </Box>
              )}

              {/* Tags & Companies */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#ffffff' }}>
                  Topics:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {(problem.categories || []).map((cat) => (
                    <Chip key={cat.slug} label={cat.name} size="small" variant="outlined" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }} />
                  ))}
                </Box>
              </Box>

              {(problem.companies || []).length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#ffffff' }}>
                    Companies:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {(problem.companies || []).map((company) => (
                      <Chip key={company} label={company} size="small" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }} />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Stats */}
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'rgba(255,255,255,0.12)' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {(problem.submission_count || 0).toLocaleString()} submissions
                </Typography>
              </Box>
            </TabPanel>

            <TabPanel value={leftTabValue} index={1}>
              {loadingSolutions ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress sx={{ color: '#fff' }} />
                </Box>
              ) : solutions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }} gutterBottom>
                    No solutions available yet.
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Be the first to share your solution!
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ p: 2 }}>
                  {solutions.map((solution) => (
                    <Paper
                      key={solution.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: solution.is_official ? '2px solid' : '1px solid',
                        borderColor: solution.is_official ? '#5AC8FA' : 'rgba(255,255,255,0.2)',
                        bgcolor: 'rgba(255,255,255,0.06)',
                        color: '#ffffff',
                      }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
                            {solution.title}
                            {solution.is_official && (
                              <Chip
                                label="Official"
                                size="small"
                                sx={{ ml: 1, bgcolor: '#5AC8FA', color: '#1e1e1e' }}
                              />
                            )}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            by {solution.author_name || 'Unknown'}
                            {solution.language && ` • ${solution.language}`}
                            {' • '}
                            {new Date(solution.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LikeIcon fontSize="small" color="action" />
                            <Typography variant="caption">{solution.upvotes || 0}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <DislikeIcon fontSize="small" color="action" />
                            <Typography variant="caption">{solution.downvotes || 0}</Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box
                        sx={{
                          '& pre': {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            p: 1,
                            borderRadius: 1,
                            overflow: 'auto',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                          },
                          '& code': {
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{ color: '#ffffff' }}
                          dangerouslySetInnerHTML={{
                            __html: formatSolutionContent(solution.content),
                          }}
                        />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </TabPanel>

            <TabPanel value={leftTabValue} index={2}>
              {loadingSubmissions ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress sx={{ color: '#fff' }} />
                </Box>
              ) : submissions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    No submissions yet. Submit your solution to see it here.
                  </Typography>
                </Box>
              ) : (
                <List>
                  {submissions.map((submission) => (
                    <ListItem
                      key={submission.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'rgba(255,255,255,0.2)',
                        borderRadius: 2,
                        mb: 1,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        bgcolor: 'rgba(255,255,255,0.06)',
                        color: '#ffffff',
                      }}
                    >
                      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Chip
                            label={submission.language}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={submission.status}
                            size="small"
                            color={
                              submission.status === 'accepted' ? 'success' :
                                submission.status === 'wrong_answer' ? 'error' :
                                  submission.status === 'runtime_error' ? 'warning' :
                                    'default'
                            }
                          />
                          {submission.runtime_ms && (
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {submission.runtime_ms}ms
                            </Typography>
                          )}
                          {submission.memory_kb && (
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {submission.memory_kb}KB
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {new Date(submission.submitted_at).toLocaleString()}
                        </Typography>
                      </Box>
                      {submission.test_cases_total > 0 && (
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          Test Cases: {submission.test_cases_passed}/{submission.test_cases_total} passed
                        </Typography>
                      )}
                      {submission.error_message && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(255,59,48,0.2)', borderRadius: 1, width: '100%' }}>
                          <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#f87171' }}>
                            {submission.error_message}
                          </Typography>
                        </Box>
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </TabPanel>
          </Box>
        </Grid>

        {/* Right Panel - Code Editor */}
        <Grid item xs={12} md={7} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <VerTechieIDE
            problemId={problem.id}
            problemTitle={problem.title}
            initialLanguage={problem.supported_languages?.[0] || 'python'}
            starterCode={
              problem.starter_code && Object.keys(problem.starter_code).length > 0
                ? problem.starter_code
                : DEFAULT_STARTER_CODE[problem.slug] || problem.starter_code
            }
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
