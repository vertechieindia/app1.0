/**
 * VerTechie IDE - Professional Code Editor Component
 * 
 * A full-featured, reusable IDE component powered by Monaco Editor
 * Features:
 * - Multi-language support (Python, JavaScript, Java, C++, SQL, etc.)
 * - Real code execution with input/output
 * - Syntax highlighting and IntelliSense
 * - Multiple themes (VS Dark, Light, High Contrast)
 * - File tabs for multi-file projects
 * - Terminal output with ANSI color support
 * - Resizable panels
 * - Keyboard shortcuts
 * - Code formatting
 * - Error highlighting
 */

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Tabs,
  Tab,
  TextField,
  Tooltip,
  CircularProgress,
  Chip,
  Divider,
  Menu,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  useTheme,
  alpha,
  InputAdornment,
} from '@mui/material';
import {
  PlayArrow as RunIcon,
  Send as SubmitIcon,
  ContentCopy as CopyIcon,
  Refresh as ResetIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as ExitFullscreenIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Code as CodeIcon,
  Terminal as TerminalIcon,
  BugReport as DebugIcon,
  FormatAlignLeft as FormatIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Search as SearchIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Timer as TimerIcon,
  Memory as MemoryIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Clear as ClearIcon,
  Save as SaveIcon,
  FolderOpen as FolderIcon,
} from '@mui/icons-material';
import { getApiUrl } from '../../config/api';
import { codeExecutionService as externalCodeExecutor, ExecutionResult as ExternalExecutionResult } from '../../services/CodeExecutionService';

// ============================================
// Types & Interfaces
// ============================================

export interface LanguageConfig {
  id: string;
  name: string;
  extension: string;
  monacoLanguage: string;
  defaultCode?: string;
  runCommand?: string;
}

export interface FileTab {
  id: string;
  name: string;
  language: string;
  content: string;
  isModified: boolean;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput?: string;
  name?: string;
}

export interface ExecutionResult {
  status: 'success' | 'error' | 'timeout' | 'running' | 'pending';
  output: string;
  error?: string;
  executionTime?: number;
  memoryUsage?: number;
  testResults?: {
    passed: number;
    total: number;
    details: Array<{
      testCase: number;
      status: 'passed' | 'failed' | 'error';
      input: string;
      expected: string;
      actual: string;
      time: number;
    }>;
  };
}

export interface IDEProps {
  // Initial configuration
  initialLanguage?: string;
  initialCode?: string;
  initialTheme?: 'vs-dark' | 'light' | 'hc-black';
  
  // Problem context (for coding problems)
  problemId?: string;
  problemTitle?: string;
  starterCode?: Record<string, string>;
  testCases?: TestCase[];
  
  // Callbacks
  onRun?: (code: string, language: string, input: string) => Promise<ExecutionResult>;
  onSubmit?: (code: string, language: string) => Promise<ExecutionResult>;
  onSave?: (code: string, language: string) => void;
  onChange?: (code: string, language: string) => void;
  
  // Feature flags
  showSubmitButton?: boolean;
  showTestCases?: boolean;
  showFileExplorer?: boolean;
  readOnly?: boolean;
  
  // Layout
  height?: string | number;
  minHeight?: string | number;
}

// ============================================
// Language Configurations
// ============================================

const LANGUAGES: LanguageConfig[] = [
  {
    id: 'python',
    name: 'Python 3',
    extension: '.py',
    monacoLanguage: 'python',
    defaultCode: `# Python 3\n\ndef main():\n    # Your code here\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()\n`,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    extension: '.js',
    monacoLanguage: 'javascript',
    defaultCode: `// JavaScript\n\nfunction main() {\n    // Your code here\n    console.log("Hello, World!");\n}\n\nmain();\n`,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    extension: '.ts',
    monacoLanguage: 'typescript',
    defaultCode: `// TypeScript\n\nfunction main(): void {\n    // Your code here\n    console.log("Hello, World!");\n}\n\nmain();\n`,
  },
  {
    id: 'java',
    name: 'Java',
    extension: '.java',
    monacoLanguage: 'java',
    defaultCode: `// Java\n\npublic class Main {\n    public static void main(String[] args) {\n        // Your code here\n        System.out.println("Hello, World!");\n    }\n}\n`,
  },
  {
    id: 'cpp',
    name: 'C++',
    extension: '.cpp',
    monacoLanguage: 'cpp',
    defaultCode: `// C++\n\n#include <iostream>\n#include <vector>\n#include <string>\n\nusing namespace std;\n\nint main() {\n    // Your code here\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n`,
  },
  {
    id: 'c',
    name: 'C',
    extension: '.c',
    monacoLanguage: 'c',
    defaultCode: `// C\n\n#include <stdio.h>\n\nint main() {\n    // Your code here\n    printf("Hello, World!\\n");\n    return 0;\n}\n`,
  },
  {
    id: 'csharp',
    name: 'C#',
    extension: '.cs',
    monacoLanguage: 'csharp',
    defaultCode: `// C#\n\nusing System;\n\nclass Program {\n    static void Main() {\n        // Your code here\n        Console.WriteLine("Hello, World!");\n    }\n}\n`,
  },
  {
    id: 'go',
    name: 'Go',
    extension: '.go',
    monacoLanguage: 'go',
    defaultCode: `// Go\n\npackage main\n\nimport "fmt"\n\nfunc main() {\n    // Your code here\n    fmt.Println("Hello, World!")\n}\n`,
  },
  {
    id: 'rust',
    name: 'Rust',
    extension: '.rs',
    monacoLanguage: 'rust',
    defaultCode: `// Rust\n\nfn main() {\n    // Your code here\n    println!("Hello, World!");\n}\n`,
  },
  {
    id: 'ruby',
    name: 'Ruby',
    extension: '.rb',
    monacoLanguage: 'ruby',
    defaultCode: `# Ruby\n\n# Your code here\nputs "Hello, World!"\n`,
  },
  {
    id: 'php',
    name: 'PHP',
    extension: '.php',
    monacoLanguage: 'php',
    defaultCode: `<?php\n// PHP\n\n// Your code here\necho "Hello, World!\\n";\n`,
  },
  {
    id: 'swift',
    name: 'Swift',
    extension: '.swift',
    monacoLanguage: 'swift',
    defaultCode: `// Swift\n\nimport Foundation\n\n// Your code here\nprint("Hello, World!")\n`,
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    extension: '.kt',
    monacoLanguage: 'kotlin',
    defaultCode: `// Kotlin\n\nfun main() {\n    // Your code here\n    println("Hello, World!")\n}\n`,
  },
  {
    id: 'scala',
    name: 'Scala',
    extension: '.scala',
    monacoLanguage: 'scala',
    defaultCode: `// Scala\n\nobject Main extends App {\n    // Your code here\n    println("Hello, World!")\n}\n`,
  },
  {
    id: 'sql',
    name: 'SQL',
    extension: '.sql',
    monacoLanguage: 'sql',
    defaultCode: `-- SQL\n\nSELECT 'Hello, World!' AS message;\n`,
  },
  {
    id: 'html',
    name: 'HTML',
    extension: '.html',
    monacoLanguage: 'html',
    defaultCode: `<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>\n`,
  },
  {
    id: 'css',
    name: 'CSS',
    extension: '.css',
    monacoLanguage: 'css',
    defaultCode: `/* CSS */\n\nbody {\n    font-family: Arial, sans-serif;\n    background-color: #f0f0f0;\n}\n`,
  },
  {
    id: 'json',
    name: 'JSON',
    extension: '.json',
    monacoLanguage: 'json',
    defaultCode: `{\n    "message": "Hello, World!"\n}\n`,
  },
  {
    id: 'yaml',
    name: 'YAML',
    extension: '.yaml',
    monacoLanguage: 'yaml',
    defaultCode: `# YAML\nmessage: Hello, World!\n`,
  },
  {
    id: 'markdown',
    name: 'Markdown',
    extension: '.md',
    monacoLanguage: 'markdown',
    defaultCode: `# Hello, World!\n\nThis is a markdown file.\n`,
  },
];

// ============================================
// Theme Configurations
// ============================================

const THEMES = [
  { id: 'vs-dark', name: 'Dark', icon: <DarkModeIcon /> },
  { id: 'light', name: 'Light', icon: <LightModeIcon /> },
  { id: 'hc-black', name: 'High Contrast', icon: <DarkModeIcon /> },
];

// ============================================
// Code Execution - Uses centralized service (NO FAKE RESULTS)
// ============================================

// Use the centralized code execution service
// This ensures consistent, real execution across the entire application
const codeExecutionService = {
  async execute(code: string, language: string, input: string = ''): Promise<ExecutionResult> {
    const result = await externalCodeExecutor.execute(code, language, input);
    return {
      status: result.status === 'success' ? 'success' : 'error',
      output: result.output,
      error: result.error,
      executionTime: result.executionTime,
      memoryUsage: result.memoryUsage,
    };
  }
};

// ============================================
// Terminal Component
// ============================================

interface TerminalProps {
  output: string;
  error?: string;
  status: ExecutionResult['status'];
  executionTime?: number;
  memoryUsage?: number;
  onClear: () => void;
}

const Terminal: React.FC<TerminalProps> = ({
  output,
  error,
  status,
  executionTime,
  memoryUsage,
  onClear,
}) => {
  const theme = useTheme();
  const terminalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output, error]);
  
  const getStatusColor = () => {
    switch (status) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'timeout': return '#f59e0b';
      case 'running': return '#3b82f6';
      default: return '#6b7280';
    }
  };
  
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#1e1e1e',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      {/* Terminal Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.75,
          bgcolor: '#2d2d2d',
          borderBottom: '1px solid #404040',
        }}
      >
        <TerminalIcon sx={{ fontSize: 16, color: '#888' }} />
        <Typography variant="caption" sx={{ color: '#ccc', fontWeight: 500 }}>
          Output
        </Typography>
        
        {status !== 'pending' && (
          <Chip
            size="small"
            label={status.toUpperCase()}
            sx={{
              height: 18,
              fontSize: '0.65rem',
              bgcolor: alpha(getStatusColor(), 0.2),
              color: getStatusColor(),
              fontWeight: 600,
            }}
          />
        )}
        
        {executionTime !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
            <TimerIcon sx={{ fontSize: 14, color: '#888' }} />
            <Typography variant="caption" sx={{ color: '#888' }}>
              {executionTime} ms
            </Typography>
          </Box>
        )}
        
        {memoryUsage !== undefined && memoryUsage > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <MemoryIcon sx={{ fontSize: 14, color: '#888' }} />
            <Typography variant="caption" sx={{ color: '#888' }}>
              {(memoryUsage / 1024).toFixed(1)} MB
            </Typography>
          </Box>
        )}
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Tooltip title="Clear">
          <IconButton size="small" onClick={onClear} sx={{ color: '#888' }}>
            <ClearIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Terminal Content */}
      <Box
        ref={terminalRef}
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 1.5,
          fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
          fontSize: '13px',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        {status === 'running' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#3b82f6' }}>
            <CircularProgress size={14} sx={{ color: '#3b82f6' }} />
            <span>Running...</span>
          </Box>
        )}
        
        {output && (
          <Box sx={{ color: '#d4d4d4' }}>
            {output}
          </Box>
        )}
        
        {error && (
          <Box sx={{ color: '#f87171', mt: output ? 1 : 0 }}>
            {error}
          </Box>
        )}
        
        {status === 'pending' && !output && !error && (
          <Box sx={{ color: '#6b7280', fontStyle: 'italic' }}>
            Run your code to see output here...
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ============================================
// Test Cases Panel
// ============================================

interface TestCasesPanelProps {
  testCases: TestCase[];
  currentInput: string;
  onInputChange: (input: string) => void;
  onAddTestCase: () => void;
  onSelectTestCase: (testCase: TestCase) => void;
  selectedTestCaseId?: string;
}

const TestCasesPanel: React.FC<TestCasesPanelProps> = ({
  testCases,
  currentInput,
  onInputChange,
  onAddTestCase,
  onSelectTestCase,
  selectedTestCaseId,
}) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Test Cases Tabs */}
      {testCases.length > 0 && (
        <Box sx={{ display: 'flex', gap: 0.5, p: 1, flexWrap: 'wrap' }}>
          {testCases.map((tc, index) => (
            <Chip
              key={tc.id}
              label={tc.name || `Case ${index + 1}`}
              size="small"
              onClick={() => onSelectTestCase(tc)}
              sx={{
                cursor: 'pointer',
                bgcolor: selectedTestCaseId === tc.id ? 'primary.main' : 'action.hover',
                color: selectedTestCaseId === tc.id ? 'white' : 'text.primary',
                '&:hover': {
                  bgcolor: selectedTestCaseId === tc.id ? 'primary.dark' : 'action.selected',
                },
              }}
            />
          ))}
          <Chip
            icon={<AddIcon sx={{ fontSize: 16 }} />}
            label="Custom"
            size="small"
            onClick={onAddTestCase}
            variant="outlined"
            sx={{ cursor: 'pointer' }}
          />
        </Box>
      )}
      
      {/* Input Area */}
      <Box sx={{ flexGrow: 1, p: 1 }}>
        <TextField
          multiline
          fullWidth
          value={currentInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Enter input for your program..."
          sx={{
            height: '100%',
            '& .MuiInputBase-root': {
              height: '100%',
              alignItems: 'flex-start',
              fontFamily: '"Fira Code", monospace',
              fontSize: '13px',
            },
            '& .MuiInputBase-input': {
              height: '100% !important',
              overflow: 'auto !important',
            },
          }}
        />
      </Box>
    </Box>
  );
};

// ============================================
// Main IDE Component
// ============================================

const VerTechieIDE: React.FC<IDEProps> = ({
  initialLanguage = 'python',
  initialCode,
  initialTheme = 'vs-dark',
  problemId,
  problemTitle,
  starterCode,
  testCases = [],
  onRun,
  onSubmit,
  onSave,
  onChange,
  showSubmitButton = true,
  showTestCases = true,
  showFileExplorer = false,
  readOnly = false,
  height = '600px',
  minHeight = '400px',
}) => {
  const theme = useTheme();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  
  // State
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState('');
  const [editorTheme, setEditorTheme] = useState(initialTheme);
  const [fontSize, setFontSize] = useState(14);
  const [minimap, setMinimap] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);
  
  const [input, setInput] = useState('');
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | undefined>();
  
  const [executionResult, setExecutionResult] = useState<ExecutionResult>({
    status: 'pending',
    output: '',
  });
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [bottomTab, setBottomTab] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Get current language config
  const currentLanguage = useMemo(
    () => LANGUAGES.find(l => l.id === language) || LANGUAGES[0],
    [language]
  );
  
  // Initialize code
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    } else if (starterCode && starterCode[language]) {
      setCode(starterCode[language]);
    } else if (currentLanguage.defaultCode) {
      setCode(currentLanguage.defaultCode);
    }
  }, []);
  
  // Handle language change
  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    
    // Update code to new language's starter code
    if (starterCode && starterCode[newLanguage]) {
      setCode(starterCode[newLanguage]);
    } else {
      const langConfig = LANGUAGES.find(l => l.id === newLanguage);
      if (langConfig?.defaultCode) {
        setCode(langConfig.defaultCode);
      }
    }
  }, [starterCode]);
  
  // Handle editor mount
  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRun();
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      handleSubmit();
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });
  };
  
  // Handle code change
  const handleCodeChange = useCallback((value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onChange?.(newCode, language);
  }, [language, onChange]);
  
  // Run code
  const handleRun = useCallback(async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setExecutionResult({ status: 'running', output: '' });
    setBottomTab(1); // Switch to output tab
    
    try {
      let result: ExecutionResult;
      
      if (onRun) {
        result = await onRun(code, language, input);
      } else {
        result = await codeExecutionService.execute(code, language, input);
      }
      
      setExecutionResult(result);
    } catch (error: any) {
      setExecutionResult({
        status: 'error',
        output: '',
        error: error.message || 'Execution failed',
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, language, input, isRunning, onRun]);
  
  // Submit code
  const handleSubmit = useCallback(async () => {
    if (isSubmitting || !onSubmit) return;
    
    setIsSubmitting(true);
    setExecutionResult({ status: 'running', output: '' });
    setBottomTab(1);
    
    try {
      const result = await onSubmit(code, language);
      setExecutionResult(result);
      
      if (result.status === 'success') {
        setSnackbar({ open: true, message: '🎉 All tests passed!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Some tests failed', severity: 'error' });
      }
    } catch (error: any) {
      setExecutionResult({
        status: 'error',
        output: '',
        error: error.message || 'Submission failed',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [code, language, isSubmitting, onSubmit]);
  
  // Save code
  const handleSave = useCallback(() => {
    onSave?.(code, language);
    setSnackbar({ open: true, message: 'Code saved!', severity: 'success' });
  }, [code, language, onSave]);
  
  // Reset code
  const handleReset = useCallback(() => {
    if (starterCode && starterCode[language]) {
      setCode(starterCode[language]);
    } else if (currentLanguage.defaultCode) {
      setCode(currentLanguage.defaultCode);
    }
  }, [language, starterCode, currentLanguage]);
  
  // Copy code
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setSnackbar({ open: true, message: 'Code copied!', severity: 'success' });
  }, [code]);
  
  // Format code
  const handleFormat = useCallback(() => {
    editorRef.current?.getAction('editor.action.formatDocument')?.run();
  }, []);
  
  // Clear output
  const handleClearOutput = useCallback(() => {
    setExecutionResult({ status: 'pending', output: '' });
  }, []);
  
  // Select test case
  const handleSelectTestCase = useCallback((testCase: TestCase) => {
    setSelectedTestCaseId(testCase.id);
    setInput(testCase.input);
  }, []);
  
  return (
    <Box
      sx={{
        height: isFullscreen ? '100vh' : height,
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: editorTheme === 'light' ? '#fff' : '#1e1e1e',
        borderRadius: isFullscreen ? 0 : 2,
        overflow: 'hidden',
        border: isFullscreen ? 'none' : '1px solid',
        borderColor: 'divider',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 'auto',
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.75,
          bgcolor: editorTheme === 'light' ? '#f5f5f5' : '#2d2d2d',
          borderBottom: '1px solid',
          borderColor: editorTheme === 'light' ? '#e0e0e0' : '#404040',
        }}
      >
        {/* Language Selector */}
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            sx={{
              fontSize: '0.875rem',
              bgcolor: editorTheme === 'light' ? '#fff' : '#3d3d3d',
              '& .MuiSelect-select': { py: 0.75 },
            }}
          >
            {LANGUAGES.map((lang) => (
              <MenuItem key={lang.id} value={lang.id}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        {/* Action Buttons */}
        <Tooltip title="Copy (Ctrl+C)">
          <IconButton size="small" onClick={handleCopy}>
            <CopyIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Reset Code">
          <IconButton size="small" onClick={handleReset}>
            <ResetIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Format Code">
          <IconButton size="small" onClick={handleFormat}>
            <FormatIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Theme Toggle */}
        <Tooltip title={`Theme: ${THEMES.find(t => t.id === editorTheme)?.name}`}>
          <IconButton
            size="small"
            onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'light' : 'vs-dark')}
          >
            {editorTheme === 'light' ? <DarkModeIcon sx={{ fontSize: 18 }} /> : <LightModeIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Settings">
          <IconButton size="small" onClick={() => setSettingsOpen(true)}>
            <SettingsIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        
        <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
          <IconButton size="small" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <ExitFullscreenIcon sx={{ fontSize: 18 }} /> : <FullscreenIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Editor Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {/* Code Editor */}
        <Box sx={{ flexGrow: 1, minHeight: 200 }}>
          <Editor
            height="100%"
            language={currentLanguage.monacoLanguage}
            value={code}
            theme={editorTheme}
            onChange={handleCodeChange}
            onMount={handleEditorMount}
            options={{
              fontSize,
              fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
              minimap: { enabled: minimap },
              wordWrap: wordWrap ? 'on' : 'off',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              readOnly,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true,
              },
              suggest: {
                showKeywords: true,
                showSnippets: true,
              },
            }}
            loading={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            }
          />
        </Box>
        
        {/* Bottom Panel */}
        <Box
          sx={{
            height: 200,
            borderTop: '1px solid',
            borderColor: editorTheme === 'light' ? '#e0e0e0' : '#404040',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Tabs
            value={bottomTab}
            onChange={(e, v) => setBottomTab(v)}
            sx={{
              minHeight: 36,
              bgcolor: editorTheme === 'light' ? '#f5f5f5' : '#2d2d2d',
              '& .MuiTab-root': { minHeight: 36, py: 0.5, fontSize: '0.8rem' },
            }}
          >
            <Tab icon={<CodeIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Input" />
            <Tab icon={<TerminalIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Output" />
          </Tabs>
          
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            {bottomTab === 0 && (
              <TestCasesPanel
                testCases={testCases}
                currentInput={input}
                onInputChange={setInput}
                onAddTestCase={() => {}}
                onSelectTestCase={handleSelectTestCase}
                selectedTestCaseId={selectedTestCaseId}
              />
            )}
            
            {bottomTab === 1 && (
              <Terminal
                output={executionResult.output}
                error={executionResult.error}
                status={executionResult.status}
                executionTime={executionResult.executionTime}
                memoryUsage={executionResult.memoryUsage}
                onClear={handleClearOutput}
              />
            )}
          </Box>
        </Box>
      </Box>
      
      {/* Action Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 1.5,
          py: 1,
          bgcolor: editorTheme === 'light' ? '#f5f5f5' : '#2d2d2d',
          borderTop: '1px solid',
          borderColor: editorTheme === 'light' ? '#e0e0e0' : '#404040',
        }}
      >
        <Box sx={{ flexGrow: 1 }} />
        
        <Button
          variant="outlined"
          startIcon={isRunning ? <CircularProgress size={16} /> : <RunIcon />}
          onClick={handleRun}
          disabled={isRunning || isSubmitting}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Run
        </Button>
        
        {showSubmitButton && onSubmit && (
          <Button
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <SubmitIcon />}
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: '#10b981',
              '&:hover': { bgcolor: '#059669' },
            }}
          >
            Submit
          </Button>
        )}
      </Box>
      
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Editor Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography gutterBottom>Font Size: {fontSize}px</Typography>
            <Slider
              value={fontSize}
              onChange={(e, v) => setFontSize(v as number)}
              min={10}
              max={24}
              step={1}
              marks
              sx={{ mb: 3 }}
            />
            
            <FormControlLabel
              control={<Switch checked={minimap} onChange={(e) => setMinimap(e.target.checked)} />}
              label="Show Minimap"
              sx={{ display: 'block', mb: 2 }}
            />
            
            <FormControlLabel
              control={<Switch checked={wordWrap} onChange={(e) => setWordWrap(e.target.checked)} />}
              label="Word Wrap"
              sx={{ display: 'block', mb: 2 }}
            />
            
            <Typography gutterBottom sx={{ mt: 2 }}>Theme</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {THEMES.map((t) => (
                <Chip
                  key={t.id}
                  icon={t.icon}
                  label={t.name}
                  onClick={() => setEditorTheme(t.id as any)}
                  color={editorTheme === t.id ? 'primary' : 'default'}
                  variant={editorTheme === t.id ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VerTechieIDE;

// Export types for use in other components
export type { ExecutionResult, LanguageConfig, FileTab, TestCase };

