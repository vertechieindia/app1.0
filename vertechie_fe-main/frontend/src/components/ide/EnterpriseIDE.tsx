/**
 * Enterprise IDE Component
 * 
 * Full-featured, VS Code-like IDE with:
 * - Multi-file editing with tabs
 * - File explorer
 * - Terminal integration
 * - Real-time collaboration
 * - Mobile preview
 * - Debugging tools
 * - Git integration
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Badge,
  Chip,
  Button,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  FolderOpen as ExplorerIcon,
  Search as SearchIcon,
  AccountTree as GitIcon,
  BugReport as DebugIcon,
  Extension as ExtensionsIcon,
  Person as CollabIcon,
  PhoneAndroid as MobileIcon,
  Terminal as TerminalIcon,
  Close as CloseIcon,
  MoreVert as MoreIcon,
  Add as AddIcon,
  SaveAlt as SaveIcon,
  PlayArrow as RunIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  DragIndicator as DragIcon,
  ChevronLeft as CollapseIcon,
  ChevronRight as ExpandIcon,
  InsertDriveFile as FileIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import { ideService } from '../../services/IDEService';
import CollaborationPanel from './CollaborationPanel';
import MobilePreview from './MobilePreview';
import DebugPanel from './DebugPanel';

// Types
interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
  isNew?: boolean;
}

interface OpenTab {
  fileId: string;
  fileName: string;
  filePath: string;
  isDirty: boolean;
}

interface EnterpriseIDEProps {
  projectId?: string;
  projectName?: string;
  initialFiles?: ProjectFile[];
  onSave?: (file: ProjectFile) => Promise<void>;
  onRun?: (code: string, language: string) => Promise<any>;
}

// Activity bar icons
const ACTIVITIES = [
  { id: 'explorer', icon: <ExplorerIcon />, label: 'Explorer' },
  { id: 'search', icon: <SearchIcon />, label: 'Search' },
  { id: 'git', icon: <GitIcon />, label: 'Source Control' },
  { id: 'debug', icon: <DebugIcon />, label: 'Run and Debug' },
  { id: 'extensions', icon: <ExtensionsIcon />, label: 'Extensions' },
];

const BOTTOM_ACTIVITIES = [
  { id: 'collab', icon: <CollabIcon />, label: 'Collaboration' },
  { id: 'mobile', icon: <MobileIcon />, label: 'Mobile Preview' },
];

// Language mapping
const LANGUAGE_MAP: Record<string, string> = {
  'py': 'python',
  'js': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'jsx': 'javascript',
  'java': 'java',
  'cpp': 'cpp',
  'c': 'c',
  'cs': 'csharp',
  'go': 'go',
  'rs': 'rust',
  'rb': 'ruby',
  'php': 'php',
  'kt': 'kotlin',
  'swift': 'swift',
  'sql': 'sql',
  'html': 'html',
  'css': 'css',
  'json': 'json',
  'md': 'markdown',
  'yaml': 'yaml',
  'yml': 'yaml',
  'xml': 'xml',
  'sh': 'shell',
  'bash': 'shell',
};

const EnterpriseIDE: React.FC<EnterpriseIDEProps> = ({
  projectId,
  projectName = 'Untitled Project',
  initialFiles = [],
  onSave,
  onRun,
}) => {
  const theme = useTheme();
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  
  // State
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles);
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);
  
  const [activeActivity, setActiveActivity] = useState<string>('explorer');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [rightPanelContent, setRightPanelContent] = useState<'collab' | 'mobile' | null>(null);
  
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  
  // Get language from file extension
  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return LANGUAGE_MAP[ext] || 'plaintext';
  };
  
  // Open file in new tab
  const openFile = useCallback((file: ProjectFile) => {
    const existingTab = openTabs.find(t => t.fileId === file.id);
    if (!existingTab) {
      setOpenTabs(prev => [...prev, {
        fileId: file.id,
        fileName: file.name,
        filePath: file.path,
        isDirty: file.isDirty,
      }]);
    }
    setActiveTab(file.id);
    setActiveFile(file);
  }, [openTabs]);
  
  // Close tab
  const closeTab = useCallback((fileId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    const tabIndex = openTabs.findIndex(t => t.fileId === fileId);
    const newTabs = openTabs.filter(t => t.fileId !== fileId);
    setOpenTabs(newTabs);
    
    if (activeTab === fileId) {
      if (newTabs.length > 0) {
        const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
        const newActiveTab = newTabs[newActiveIndex];
        setActiveTab(newActiveTab.fileId);
        const file = files.find(f => f.id === newActiveTab.fileId);
        setActiveFile(file || null);
      } else {
        setActiveTab(null);
        setActiveFile(null);
      }
    }
  }, [openTabs, activeTab, files]);
  
  // Handle code change
  const handleCodeChange = useCallback((value: string | undefined) => {
    if (!activeFile || value === undefined) return;
    
    setFiles(prev => prev.map(f => 
      f.id === activeFile.id 
        ? { ...f, content: value, isDirty: true }
        : f
    ));
    
    setOpenTabs(prev => prev.map(t =>
      t.fileId === activeFile.id
        ? { ...t, isDirty: true }
        : t
    ));
    
    setActiveFile(prev => prev ? { ...prev, content: value, isDirty: true } : null);
  }, [activeFile]);
  
  // Save file
  const handleSave = useCallback(async () => {
    if (!activeFile || !onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(activeFile);
      
      setFiles(prev => prev.map(f =>
        f.id === activeFile.id ? { ...f, isDirty: false } : f
      ));
      
      setOpenTabs(prev => prev.map(t =>
        t.fileId === activeFile.id ? { ...t, isDirty: false } : t
      ));
      
      setActiveFile(prev => prev ? { ...prev, isDirty: false } : null);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [activeFile, onSave]);
  
  // Run code
  const handleRun = useCallback(async () => {
    if (!activeFile || !onRun) return;
    
    setIsRunning(true);
    setTerminalOpen(true);
    setTerminalOutput(prev => [...prev, `> Running ${activeFile.name}...`]);
    
    try {
      const result = await onRun(activeFile.content, activeFile.language);
      
      if (result.error) {
        setTerminalOutput(prev => [...prev, `Error: ${result.error}`]);
      } else {
        setTerminalOutput(prev => [...prev, result.output || 'Execution completed.']);
      }
    } catch (error: any) {
      setTerminalOutput(prev => [...prev, `Error: ${error.message}`]);
    } finally {
      setIsRunning(false);
    }
  }, [activeFile, onRun]);
  
  // Editor mount handler
  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Configure editor
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      bracketPairColorization: { enabled: true },
      formatOnPaste: true,
      formatOnType: true,
    });
    
    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRun();
    });
  };
  
  // Toggle activity panel
  const handleActivityClick = (activityId: string) => {
    if (activityId === 'collab' || activityId === 'mobile') {
      setRightPanelContent(activityId as 'collab' | 'mobile');
      setRightPanelOpen(true);
    } else {
      if (activeActivity === activityId && sidebarOpen) {
        setSidebarOpen(false);
      } else {
        setActiveActivity(activityId);
        setSidebarOpen(true);
      }
    }
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  // File tree component
  const FileTree = () => (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" sx={{ px: 1, py: 0.5, fontWeight: 600 }}>
        {projectName.toUpperCase()}
      </Typography>
      {files.map(file => (
        <Box
          key={file.id}
          onClick={() => openFile(file)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            cursor: 'pointer',
            bgcolor: activeFile?.id === file.id ? 'action.selected' : 'transparent',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <FileIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" noWrap>{file.name}</Typography>
          {file.isDirty && (
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main', ml: 'auto' }} />
          )}
        </Box>
      ))}
    </Box>
  );
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: '#1e1e1e',
        color: '#d4d4d4',
        overflow: 'hidden',
      }}
    >
      {/* Title Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 32,
          px: 2,
          bgcolor: '#323233',
          borderBottom: '1px solid #252526',
        }}
      >
        <CodeIcon sx={{ fontSize: 18, mr: 1, color: '#0d87e8' }} />
        <Typography variant="caption" sx={{ fontWeight: 500 }}>
          VerTechie IDE - {projectName}
        </Typography>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Tooltip title="Save (Ctrl+S)">
          <IconButton size="small" onClick={handleSave} disabled={!activeFile?.isDirty || isSaving}>
            {isSaving ? <CircularProgress size={14} /> : <SaveIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Run (Ctrl+Enter)">
          <IconButton size="small" onClick={handleRun} disabled={!activeFile || isRunning}>
            {isRunning ? <CircularProgress size={14} /> : <RunIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          <IconButton size="small" onClick={toggleFullscreen}>
            {isFullscreen ? <FullscreenExitIcon sx={{ fontSize: 16 }} /> : <FullscreenIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Main Content */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Activity Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: 48,
            bgcolor: '#333333',
            borderRight: '1px solid #252526',
          }}
        >
          {ACTIVITIES.map(activity => (
            <Tooltip key={activity.id} title={activity.label} placement="right">
              <IconButton
                onClick={() => handleActivityClick(activity.id)}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 0,
                  color: activeActivity === activity.id && sidebarOpen ? '#fff' : '#858585',
                  borderLeft: activeActivity === activity.id && sidebarOpen ? '2px solid #0d87e8' : '2px solid transparent',
                  '&:hover': { color: '#fff' },
                }}
              >
                {activity.icon}
              </IconButton>
            </Tooltip>
          ))}
          
          <Box sx={{ flexGrow: 1 }} />
          
          {BOTTOM_ACTIVITIES.map(activity => (
            <Tooltip key={activity.id} title={activity.label} placement="right">
              <IconButton
                onClick={() => handleActivityClick(activity.id)}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 0,
                  color: '#858585',
                  '&:hover': { color: '#fff' },
                }}
              >
                {activity.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
        
        {/* Sidebar */}
        {sidebarOpen && (
          <Box
            sx={{
              width: sidebarWidth,
              bgcolor: '#252526',
              borderRight: '1px solid #252526',
              overflow: 'auto',
            }}
          >
            {activeActivity === 'explorer' && <FileTree />}
            {activeActivity === 'search' && (
              <Box sx={{ p: 2 }}>
                <Typography variant="caption">Search functionality</Typography>
              </Box>
            )}
            {activeActivity === 'git' && (
              <Box sx={{ p: 2 }}>
                <Typography variant="caption">Source Control</Typography>
              </Box>
            )}
            {activeActivity === 'debug' && (
              <DebugPanel
                projectId={projectId}
                activeFileId={activeFile?.id}
                onBreakpointClick={(fileId, line) => {
                  const file = files.find(f => f.id === fileId);
                  if (file) openFile(file);
                }}
              />
            )}
            {activeActivity === 'extensions' && (
              <Box sx={{ p: 2 }}>
                <Typography variant="caption">Extensions</Typography>
              </Box>
            )}
          </Box>
        )}
        
        {/* Editor Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tabs */}
          {openTabs.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                bgcolor: '#252526',
                borderBottom: '1px solid #252526',
                overflow: 'auto',
              }}
            >
              {openTabs.map(tab => (
                <Box
                  key={tab.fileId}
                  onClick={() => {
                    setActiveTab(tab.fileId);
                    const file = files.find(f => f.id === tab.fileId);
                    setActiveFile(file || null);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 2,
                    py: 0.75,
                    cursor: 'pointer',
                    bgcolor: activeTab === tab.fileId ? '#1e1e1e' : '#2d2d2d',
                    borderRight: '1px solid #252526',
                    '&:hover': { bgcolor: activeTab === tab.fileId ? '#1e1e1e' : '#323233' },
                  }}
                >
                  <FileIcon sx={{ fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontStyle: tab.isDirty ? 'italic' : 'normal' }}>
                    {tab.fileName}
                    {tab.isDirty && '*'}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => closeTab(tab.fileId, e)}
                    sx={{ p: 0.25, ml: 0.5 }}
                  >
                    <CloseIcon sx={{ fontSize: 12 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          
          {/* Editor */}
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            {activeFile ? (
              <Editor
                height="100%"
                language={activeFile.language || getLanguage(activeFile.name)}
                value={activeFile.content}
                onChange={handleCodeChange}
                onMount={handleEditorMount}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#858585',
                }}
              >
                <CodeIcon sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h6">VerTechie Enterprise IDE</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Open a file from the explorer to start editing
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="caption">
                    Ctrl+S to save • Ctrl+Enter to run
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
          
          {/* Terminal */}
          {terminalOpen && (
            <Box
              sx={{
                height: 200,
                bgcolor: '#1e1e1e',
                borderTop: '1px solid #252526',
                overflow: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: '#252526' }}>
                <TerminalIcon sx={{ fontSize: 14, mr: 1 }} />
                <Typography variant="caption">Terminal</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton size="small" onClick={() => setTerminalOpen(false)}>
                  <CloseIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Box>
              <Box sx={{ p: 1, fontFamily: 'monospace', fontSize: 12 }}>
                {terminalOutput.map((line, i) => (
                  <Box key={i} sx={{ whiteSpace: 'pre-wrap' }}>{line}</Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
        
        {/* Right Panel */}
        {rightPanelOpen && (
          <Box
            sx={{
              width: 300,
              bgcolor: '#252526',
              borderLeft: '1px solid #252526',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: '#323233' }}>
              <Typography variant="caption" sx={{ flexGrow: 1 }}>
                {rightPanelContent === 'collab' ? 'Collaboration' : 'Mobile Preview'}
              </Typography>
              <IconButton size="small" onClick={() => setRightPanelOpen(false)}>
                <CloseIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Box>
            {rightPanelContent === 'collab' && (
              <CollaborationPanel projectId={projectId || ''} currentFileId={activeFile?.id} />
            )}
            {rightPanelContent === 'mobile' && (
              <MobilePreview projectId={projectId} />
            )}
          </Box>
        )}
      </Box>
      
      {/* Status Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 22,
          px: 1,
          bgcolor: '#007acc',
          color: '#fff',
          fontSize: 12,
        }}
      >
        <Typography variant="caption">
          {activeFile ? `${activeFile.language || getLanguage(activeFile.name)} • ${activeFile.path}` : 'No file open'}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="caption">
          UTF-8 • LF
        </Typography>
      </Box>
    </Box>
  );
};

export default EnterpriseIDE;
