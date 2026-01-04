/**
 * Debug Panel Component
 * 
 * Full-featured debugging interface with:
 * - Breakpoints management
 * - Call stack navigation
 * - Variable inspection
 * - Watch expressions
 * - Step controls
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  TextField,
  Chip,
  Divider,
  Collapse,
  Checkbox,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow as ContinueIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  SkipNext as StepOverIcon,
  ArrowDownward as StepInIcon,
  ArrowUpward as StepOutIcon,
  Refresh as RestartIcon,
  RadioButtonChecked as BreakpointIcon,
  RadioButtonUnchecked as BreakpointDisabledIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Code as CodeIcon,
  Visibility as WatchIcon,
  BugReport as DebugIcon,
  LayersClear as StackIcon,
  DataObject as VariablesIcon,
  Terminal as ConsoleIcon,
} from '@mui/icons-material';
import { ideService } from '../../services/IDEService';

// Types
interface Breakpoint {
  id: string;
  fileId: string;
  fileName: string;
  line: number;
  condition?: string;
  isEnabled: boolean;
  isVerified: boolean;
}

interface StackFrame {
  id: number;
  name: string;
  file: string;
  line: number;
  column: number;
  isCurrent: boolean;
}

interface Variable {
  name: string;
  value: string;
  type: string;
  childrenRef: number;
  isExpandable: boolean;
  children?: Variable[];
}

interface WatchExpression {
  id: string;
  expression: string;
  value?: string;
  type?: string;
  isError?: boolean;
  error?: string;
}

interface DebugPanelProps {
  projectId?: string;
  activeFileId?: string;
  onBreakpointClick?: (fileId: string, line: number) => void;
  onGoToLine?: (fileId: string, line: number) => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  projectId,
  activeFileId,
  onBreakpointClick,
  onGoToLine,
}) => {
  // State
  const [isDebugging, setIsDebugging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([]);
  const [stackFrames, setStackFrames] = useState<StackFrame[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [watchExpressions, setWatchExpressions] = useState<WatchExpression[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  
  const [newWatch, setNewWatch] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    breakpoints: true,
    callStack: true,
    variables: true,
    watch: true,
    console: false,
  });
  
  // Toggle section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  
  // Start debugging
  const handleStart = async () => {
    if (!projectId || !activeFileId) return;
    
    setLoading(true);
    try {
      // In real implementation, call the debug API
      // const result = await ideService.startDebugSession(projectId, activeFileId);
      // setSessionId(result.id);
      setIsDebugging(true);
      setIsPaused(true);
      
      // Mock data for demonstration
      setStackFrames([
        { id: 0, name: 'main', file: 'main.py', line: 10, column: 1, isCurrent: true },
        { id: 1, name: 'calculate', file: 'utils.py', line: 25, column: 5, isCurrent: false },
      ]);
      
      setVariables([
        { name: 'x', value: '42', type: 'int', childrenRef: 0, isExpandable: false },
        { name: 'name', value: '"John"', type: 'str', childrenRef: 0, isExpandable: false },
        { name: 'data', value: '{...}', type: 'dict', childrenRef: 1, isExpandable: true },
      ]);
      
    } catch (error) {
      console.error('Failed to start debugging:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Stop debugging
  const handleStop = async () => {
    if (sessionId) {
      // await ideService.terminateDebugSession(sessionId);
    }
    setIsDebugging(false);
    setIsPaused(false);
    setSessionId(null);
    setStackFrames([]);
    setVariables([]);
  };
  
  // Continue execution
  const handleContinue = async () => {
    if (!sessionId) return;
    // await ideService.debugContinue(sessionId);
    setIsPaused(false);
  };
  
  // Pause execution
  const handlePause = async () => {
    if (!sessionId) return;
    // await ideService.debugPause(sessionId);
    setIsPaused(true);
  };
  
  // Step over
  const handleStepOver = async () => {
    if (!sessionId) return;
    // await ideService.debugStepOver(sessionId);
  };
  
  // Step into
  const handleStepInto = async () => {
    if (!sessionId) return;
    // await ideService.debugStepIn(sessionId);
  };
  
  // Step out
  const handleStepOut = async () => {
    if (!sessionId) return;
    // await ideService.debugStepOut(sessionId);
  };
  
  // Toggle breakpoint
  const toggleBreakpoint = (bp: Breakpoint) => {
    setBreakpoints(prev => prev.map(b => 
      b.id === bp.id ? { ...b, isEnabled: !b.isEnabled } : b
    ));
  };
  
  // Delete breakpoint
  const deleteBreakpoint = (bp: Breakpoint) => {
    setBreakpoints(prev => prev.filter(b => b.id !== bp.id));
  };
  
  // Add watch expression
  const addWatchExpression = () => {
    if (!newWatch.trim()) return;
    
    setWatchExpressions(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        expression: newWatch,
        value: 'undefined',
        type: 'undefined',
      },
    ]);
    setNewWatch('');
  };
  
  // Delete watch expression
  const deleteWatch = (id: string) => {
    setWatchExpressions(prev => prev.filter(w => w.id !== id));
  };
  
  // Expand variable
  const expandVariable = (variable: Variable) => {
    // In real implementation, fetch children from debugger
    if (variable.isExpandable && !variable.children) {
      // Simulate fetching children
      variable.children = [
        { name: 'key1', value: '"value1"', type: 'str', childrenRef: 0, isExpandable: false },
        { name: 'key2', value: '123', type: 'int', childrenRef: 0, isExpandable: false },
      ];
      setVariables([...variables]);
    }
  };
  
  // Render variable tree
  const renderVariable = (variable: Variable, depth: number = 0) => (
    <Box key={variable.name} sx={{ pl: depth * 2 }}>
      <ListItem dense>
        {variable.isExpandable && (
          <IconButton size="small" onClick={() => expandVariable(variable)}>
            {variable.children ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
        )}
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="body2" fontFamily="monospace" color="primary">
                {variable.name}
              </Typography>
              <Typography variant="body2" fontFamily="monospace">
                = {variable.value}
              </Typography>
            </Box>
          }
          secondary={
            <Typography variant="caption" color="text.secondary">
              {variable.type}
            </Typography>
          }
        />
      </ListItem>
      {variable.children?.map(child => renderVariable(child, depth + 1))}
    </Box>
  );
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Debug Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          p: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        {!isDebugging ? (
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={loading ? <CircularProgress size={14} /> : <DebugIcon />}
            onClick={handleStart}
            disabled={loading || !projectId}
          >
            Debug
          </Button>
        ) : (
          <>
            {isPaused ? (
              <Tooltip title="Continue (F5)">
                <IconButton size="small" color="success" onClick={handleContinue}>
                  <ContinueIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Pause (F6)">
                <IconButton size="small" color="warning" onClick={handlePause}>
                  <PauseIcon />
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title="Step Over (F10)">
              <IconButton size="small" onClick={handleStepOver} disabled={!isPaused}>
                <StepOverIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Step Into (F11)">
              <IconButton size="small" onClick={handleStepInto} disabled={!isPaused}>
                <StepInIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Step Out (Shift+F11)">
              <IconButton size="small" onClick={handleStepOut} disabled={!isPaused}>
                <StepOutIcon />
              </IconButton>
            </Tooltip>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            
            <Tooltip title="Restart">
              <IconButton size="small" onClick={handleStart}>
                <RestartIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Stop">
              <IconButton size="small" color="error" onClick={handleStop}>
                <StopIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
        
        <Box sx={{ flexGrow: 1 }} />
        
        {isDebugging && (
          <Chip
            size="small"
            color={isPaused ? 'warning' : 'success'}
            label={isPaused ? 'Paused' : 'Running'}
          />
        )}
      </Box>
      
      {/* Debug Panels */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {/* Breakpoints Section */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              py: 0.5,
              bgcolor: 'action.hover',
              cursor: 'pointer',
            }}
            onClick={() => toggleSection('breakpoints')}
          >
            <BreakpointIcon sx={{ fontSize: 16, mr: 1 }} />
            <Typography variant="caption" fontWeight={600} sx={{ flexGrow: 1 }}>
              BREAKPOINTS ({breakpoints.length})
            </Typography>
            {expandedSections.breakpoints ? <CollapseIcon /> : <ExpandIcon />}
          </Box>
          
          <Collapse in={expandedSections.breakpoints}>
            <List dense>
              {breakpoints.length === 0 ? (
                <ListItem>
                  <Typography variant="caption" color="text.secondary">
                    No breakpoints set
                  </Typography>
                </ListItem>
              ) : (
                breakpoints.map(bp => (
                  <ListItem key={bp.id}>
                    <Checkbox
                      size="small"
                      checked={bp.isEnabled}
                      onChange={() => toggleBreakpoint(bp)}
                    />
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          fontFamily="monospace"
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                          onClick={() => onBreakpointClick?.(bp.fileId, bp.line)}
                        >
                          {bp.fileName}:{bp.line}
                        </Typography>
                      }
                      secondary={bp.condition && `if ${bp.condition}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton size="small" onClick={() => deleteBreakpoint(bp)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              )}
            </List>
          </Collapse>
        </Box>
        
        <Divider />
        
        {/* Call Stack Section */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              py: 0.5,
              bgcolor: 'action.hover',
              cursor: 'pointer',
            }}
            onClick={() => toggleSection('callStack')}
          >
            <StackIcon sx={{ fontSize: 16, mr: 1 }} />
            <Typography variant="caption" fontWeight={600} sx={{ flexGrow: 1 }}>
              CALL STACK
            </Typography>
            {expandedSections.callStack ? <CollapseIcon /> : <ExpandIcon />}
          </Box>
          
          <Collapse in={expandedSections.callStack}>
            <List dense>
              {stackFrames.map(frame => (
                <ListItemButton
                  key={frame.id}
                  selected={frame.isCurrent}
                  onClick={() => onGoToLine?.(frame.file, frame.line)}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CodeIcon fontSize="small" color={frame.isCurrent ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={frame.name}
                    secondary={`${frame.file}:${frame.line}`}
                    primaryTypographyProps={{ variant: 'body2', fontFamily: 'monospace' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </Box>
        
        <Divider />
        
        {/* Variables Section */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              py: 0.5,
              bgcolor: 'action.hover',
              cursor: 'pointer',
            }}
            onClick={() => toggleSection('variables')}
          >
            <VariablesIcon sx={{ fontSize: 16, mr: 1 }} />
            <Typography variant="caption" fontWeight={600} sx={{ flexGrow: 1 }}>
              VARIABLES
            </Typography>
            {expandedSections.variables ? <CollapseIcon /> : <ExpandIcon />}
          </Box>
          
          <Collapse in={expandedSections.variables}>
            <List dense>
              {variables.map(variable => renderVariable(variable))}
            </List>
          </Collapse>
        </Box>
        
        <Divider />
        
        {/* Watch Expressions Section */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              py: 0.5,
              bgcolor: 'action.hover',
              cursor: 'pointer',
            }}
            onClick={() => toggleSection('watch')}
          >
            <WatchIcon sx={{ fontSize: 16, mr: 1 }} />
            <Typography variant="caption" fontWeight={600} sx={{ flexGrow: 1 }}>
              WATCH
            </Typography>
            {expandedSections.watch ? <CollapseIcon /> : <ExpandIcon />}
          </Box>
          
          <Collapse in={expandedSections.watch}>
            <Box sx={{ p: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Add expression..."
                value={newWatch}
                onChange={(e) => setNewWatch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addWatchExpression()}
                InputProps={{
                  endAdornment: (
                    <IconButton size="small" onClick={addWatchExpression}>
                      <AddIcon />
                    </IconButton>
                  ),
                  sx: { fontFamily: 'monospace', fontSize: 12 },
                }}
              />
            </Box>
            <List dense>
              {watchExpressions.map(watch => (
                <ListItem key={watch.id}>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        fontFamily="monospace"
                        color={watch.isError ? 'error' : 'inherit'}
                      >
                        {watch.expression} = {watch.value}
                      </Typography>
                    }
                    secondary={watch.isError ? watch.error : watch.type}
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small" onClick={() => deleteWatch(watch.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
        
        <Divider />
        
        {/* Debug Console Section */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              py: 0.5,
              bgcolor: 'action.hover',
              cursor: 'pointer',
            }}
            onClick={() => toggleSection('console')}
          >
            <ConsoleIcon sx={{ fontSize: 16, mr: 1 }} />
            <Typography variant="caption" fontWeight={600} sx={{ flexGrow: 1 }}>
              DEBUG CONSOLE
            </Typography>
            {expandedSections.console ? <CollapseIcon /> : <ExpandIcon />}
          </Box>
          
          <Collapse in={expandedSections.console}>
            <Box
              sx={{
                p: 1,
                maxHeight: 200,
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: 12,
                bgcolor: '#1e1e1e',
                color: '#d4d4d4',
              }}
            >
              {consoleOutput.length === 0 ? (
                <Typography variant="caption" color="text.secondary">
                  Debug console output will appear here...
                </Typography>
              ) : (
                consoleOutput.map((line, i) => (
                  <Box key={i}>{line}</Box>
                ))
              )}
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
};

export default DebugPanel;

