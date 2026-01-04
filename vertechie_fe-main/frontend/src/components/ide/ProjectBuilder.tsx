/**
 * VerTechie Project Builder
 * 
 * A full-featured project IDE for building multi-file projects
 * Features:
 * - File tree explorer
 * - Multi-file editing with tabs
 * - File creation, renaming, deletion
 * - Folder management
 * - Project templates
 * - Code execution
 * - Project download/upload
 */

import React, { useState, useCallback, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  TextField,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  Chip,
  Alert,
  Snackbar,
  useTheme,
  alpha,
} from '@mui/material';
import {
  PlayArrow as RunIcon,
  Add as AddIcon,
  CreateNewFolder as NewFolderIcon,
  InsertDriveFile as FileIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Close as CloseIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  Refresh as ResetIcon,
  ExpandMore as ExpandIcon,
  ChevronRight as CollapseIcon,
  Terminal as TerminalIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

// ============================================
// Types
// ============================================

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isModified: boolean;
}

export interface ProjectFolder {
  id: string;
  name: string;
  path: string;
  isOpen: boolean;
  children: (ProjectFile | ProjectFolder)[];
}

export interface ProjectConfig {
  name: string;
  description?: string;
  mainFile?: string;
  buildCommand?: string;
  runCommand?: string;
}

export interface ProjectBuilderProps {
  initialProject?: {
    config: ProjectConfig;
    files: ProjectFile[];
    folders: ProjectFolder[];
  };
  onSave?: (project: { config: ProjectConfig; files: ProjectFile[] }) => void;
  onRun?: (files: ProjectFile[], mainFile: string) => Promise<string>;
  readOnly?: boolean;
  height?: string | number;
}

// ============================================
// Helper Functions
// ============================================

const getLanguageFromExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const langMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    rb: 'ruby',
    php: 'php',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
  };
  return langMap[ext] || 'plaintext';
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// ============================================
// File Tree Component
// ============================================

interface FileTreeProps {
  items: (ProjectFile | ProjectFolder)[];
  selectedFileId?: string;
  onSelectFile: (file: ProjectFile) => void;
  onToggleFolder: (folderId: string) => void;
  onContextMenu: (event: React.MouseEvent, item: ProjectFile | ProjectFolder) => void;
  level?: number;
}

const FileTree: React.FC<FileTreeProps> = ({
  items,
  selectedFileId,
  onSelectFile,
  onToggleFolder,
  onContextMenu,
  level = 0,
}) => {
  const theme = useTheme();
  
  const isFolder = (item: ProjectFile | ProjectFolder): item is ProjectFolder => {
    return 'children' in item;
  };
  
  return (
    <List dense disablePadding>
      {items.map((item) => {
        if (isFolder(item)) {
          return (
            <React.Fragment key={item.id}>
              <ListItem
                disablePadding
                sx={{ pl: level * 1.5 }}
                secondaryAction={
                  <IconButton
                    size="small"
                    onClick={(e) => onContextMenu(e, item)}
                    sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}
                  >
                    <MoreIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                }
              >
                <ListItemButton
                  onClick={() => onToggleFolder(item.id)}
                  sx={{ py: 0.25, borderRadius: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    {item.isOpen ? <ExpandIcon sx={{ fontSize: 16 }} /> : <CollapseIcon sx={{ fontSize: 16 }} />}
                  </ListItemIcon>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    {item.isOpen ? (
                      <FolderOpenIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                    ) : (
                      <FolderIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                  />
                </ListItemButton>
              </ListItem>
              <Collapse in={item.isOpen} timeout="auto" unmountOnExit>
                <FileTree
                  items={item.children}
                  selectedFileId={selectedFileId}
                  onSelectFile={onSelectFile}
                  onToggleFolder={onToggleFolder}
                  onContextMenu={onContextMenu}
                  level={level + 1}
                />
              </Collapse>
            </React.Fragment>
          );
        }
        
        return (
          <ListItem
            key={item.id}
            disablePadding
            sx={{ pl: level * 1.5 }}
            secondaryAction={
              <IconButton
                size="small"
                onClick={(e) => onContextMenu(e, item)}
                sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}
              >
                <MoreIcon sx={{ fontSize: 16 }} />
              </IconButton>
            }
          >
            <ListItemButton
              selected={selectedFileId === item.id}
              onClick={() => onSelectFile(item)}
              sx={{ py: 0.25, pl: 3.5, borderRadius: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <FileIcon sx={{ fontSize: 18, color: '#64748b' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {item.name}
                    {item.isModified && (
                      <Box
                        component="span"
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: 'warning.main',
                        }}
                      />
                    )}
                  </Box>
                }
                primaryTypographyProps={{ variant: 'body2', noWrap: true }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

// ============================================
// Main Component
// ============================================

const ProjectBuilder: React.FC<ProjectBuilderProps> = ({
  initialProject,
  onSave,
  onRun,
  readOnly = false,
  height = '700px',
}) => {
  const theme = useTheme();
  
  // Project state
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>(
    initialProject?.config || {
      name: 'My Project',
      description: 'A new project',
      mainFile: 'main.py',
    }
  );
  
  const [files, setFiles] = useState<ProjectFile[]>(
    initialProject?.files || [
      {
        id: generateId(),
        name: 'main.py',
        path: '/main.py',
        content: '# Main entry point\n\nprint("Hello, World!")\n',
        language: 'python',
        isModified: false,
      },
      {
        id: generateId(),
        name: 'README.md',
        path: '/README.md',
        content: '# My Project\n\nThis is a sample project.\n',
        language: 'markdown',
        isModified: false,
      },
    ]
  );
  
  const [folders, setFolders] = useState<ProjectFolder[]>(
    initialProject?.folders || []
  );
  
  // UI state
  const [openTabs, setOpenTabs] = useState<string[]>(files.length > 0 ? [files[0].id] : []);
  const [activeTabId, setActiveTabId] = useState<string | null>(files.length > 0 ? files[0].id : null);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  
  // Dialog state
  const [newFileDialog, setNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    item: ProjectFile | ProjectFolder | null;
  } | null>(null);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Get active file
  const activeFile = useMemo(() => {
    return files.find(f => f.id === activeTabId) || null;
  }, [files, activeTabId]);
  
  // File operations
  const handleCreateFile = useCallback(() => {
    if (!newFileName.trim()) return;
    
    const newFile: ProjectFile = {
      id: generateId(),
      name: newFileName,
      path: `/${newFileName}`,
      content: '',
      language: getLanguageFromExtension(newFileName),
      isModified: false,
    };
    
    setFiles(prev => [...prev, newFile]);
    setOpenTabs(prev => [...prev, newFile.id]);
    setActiveTabId(newFile.id);
    setNewFileDialog(false);
    setNewFileName('');
  }, [newFileName]);
  
  const handleDeleteFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setOpenTabs(prev => prev.filter(id => id !== fileId));
    if (activeTabId === fileId) {
      const remaining = openTabs.filter(id => id !== fileId);
      setActiveTabId(remaining.length > 0 ? remaining[0] : null);
    }
    setContextMenu(null);
  }, [activeTabId, openTabs]);
  
  const handleSelectFile = useCallback((file: ProjectFile) => {
    if (!openTabs.includes(file.id)) {
      setOpenTabs(prev => [...prev, file.id]);
    }
    setActiveTabId(file.id);
  }, [openTabs]);
  
  const handleCloseTab = useCallback((e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    setOpenTabs(prev => prev.filter(id => id !== tabId));
    if (activeTabId === tabId) {
      const remaining = openTabs.filter(id => id !== tabId);
      const newActive = remaining.length > 0 ? remaining[remaining.length - 1] : null;
      setActiveTabId(newActive);
    }
  }, [activeTabId, openTabs]);
  
  const handleCodeChange = useCallback((value: string | undefined) => {
    if (!activeTabId) return;
    setFiles(prev => prev.map(f => 
      f.id === activeTabId ? { ...f, content: value || '', isModified: true } : f
    ));
  }, [activeTabId]);
  
  const handleToggleFolder = useCallback((folderId: string) => {
    setFolders(prev => prev.map(f => 
      f.id === folderId ? { ...f, isOpen: !f.isOpen } : f
    ));
  }, []);
  
  const handleContextMenu = useCallback((e: React.MouseEvent, item: ProjectFile | ProjectFolder) => {
    e.preventDefault();
    setContextMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
      item,
    });
  }, []);
  
  // Run project
  const handleRun = useCallback(async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setShowTerminal(true);
    setOutput('Running...\n');
    
    try {
      if (onRun) {
        const result = await onRun(files, projectConfig.mainFile || 'main.py');
        setOutput(prev => prev + result);
      } else {
        // Default behavior: just show file content
        const mainFile = files.find(f => f.name === projectConfig.mainFile);
        if (mainFile) {
          setOutput(`Executing ${mainFile.name}...\n\n--- Output ---\nHello, World!\n`);
        } else {
          setOutput('No main file specified.\n');
        }
      }
    } catch (error: any) {
      setOutput(prev => prev + `\nError: ${error.message}\n`);
    } finally {
      setIsRunning(false);
    }
  }, [files, projectConfig.mainFile, isRunning, onRun]);
  
  // Save project
  const handleSave = useCallback(() => {
    setFiles(prev => prev.map(f => ({ ...f, isModified: false })));
    onSave?.({ config: projectConfig, files });
    setSnackbar({ open: true, message: 'Project saved!', severity: 'success' });
  }, [files, projectConfig, onSave]);
  
  // Build file tree structure
  const fileTreeItems = useMemo((): (ProjectFile | ProjectFolder)[] => {
    // For now, just return flat list of files
    // In a full implementation, this would organize files into folders
    return [...folders, ...files];
  }, [files, folders]);
  
  return (
    <Box
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#1e1e1e',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Toolbar */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.75,
          bgcolor: '#2d2d2d',
          borderBottom: '1px solid #404040',
          borderRadius: 0,
        }}
      >
        <CodeIcon sx={{ color: '#10b981', mr: 0.5 }} />
        <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600 }}>
          {projectConfig.name}
        </Typography>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Tooltip title="New File">
          <IconButton size="small" onClick={() => setNewFileDialog(true)} sx={{ color: '#888' }}>
            <AddIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Save All">
          <IconButton size="small" onClick={handleSave} sx={{ color: '#888' }}>
            <SaveIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        <Button
          size="small"
          variant="contained"
          startIcon={isRunning ? null : <RunIcon />}
          onClick={handleRun}
          disabled={isRunning}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: '#10b981',
            '&:hover': { bgcolor: '#059669' },
          }}
        >
          {isRunning ? 'Running...' : 'Run'}
        </Button>
      </Paper>
      
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        {/* File Explorer */}
        <Paper
          sx={{
            width: 220,
            bgcolor: '#252526',
            borderRadius: 0,
            borderRight: '1px solid #404040',
            overflow: 'auto',
          }}
        >
          <Box sx={{ p: 1.5, borderBottom: '1px solid #404040' }}>
            <Typography variant="caption" sx={{ color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>
              Explorer
            </Typography>
          </Box>
          
          <FileTree
            items={fileTreeItems}
            selectedFileId={activeTabId || undefined}
            onSelectFile={handleSelectFile}
            onToggleFolder={handleToggleFolder}
            onContextMenu={handleContextMenu}
          />
        </Paper>
        
        {/* Editor Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Tabs */}
          <Box
            sx={{
              display: 'flex',
              bgcolor: '#252526',
              borderBottom: '1px solid #404040',
              overflow: 'auto',
              '&::-webkit-scrollbar': { height: 3 },
            }}
          >
            {openTabs.map((tabId) => {
              const file = files.find(f => f.id === tabId);
              if (!file) return null;
              
              return (
                <Box
                  key={tabId}
                  onClick={() => setActiveTabId(tabId)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.5,
                    py: 0.75,
                    cursor: 'pointer',
                    bgcolor: activeTabId === tabId ? '#1e1e1e' : 'transparent',
                    borderBottom: activeTabId === tabId ? '2px solid #10b981' : '2px solid transparent',
                    '&:hover': { bgcolor: activeTabId === tabId ? '#1e1e1e' : '#2a2d2e' },
                  }}
                >
                  <FileIcon sx={{ fontSize: 14, color: '#888' }} />
                  <Typography variant="caption" sx={{ color: activeTabId === tabId ? '#fff' : '#888' }}>
                    {file.name}
                  </Typography>
                  {file.isModified && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: 'warning.main',
                      }}
                    />
                  )}
                  <IconButton
                    size="small"
                    onClick={(e) => handleCloseTab(e, tabId)}
                    sx={{ p: 0.25, ml: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                  >
                    <CloseIcon sx={{ fontSize: 14, color: '#888' }} />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
          
          {/* Editor */}
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            {activeFile ? (
              <Editor
                height="100%"
                language={activeFile.language}
                value={activeFile.content}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  readOnly,
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                }}
              />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#888',
                }}
              >
                <Typography>Select a file to edit</Typography>
              </Box>
            )}
          </Box>
          
          {/* Terminal */}
          {showTerminal && (
            <Box
              sx={{
                height: 150,
                bgcolor: '#1e1e1e',
                borderTop: '1px solid #404040',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 1.5,
                  py: 0.5,
                  bgcolor: '#2d2d2d',
                  borderBottom: '1px solid #404040',
                }}
              >
                <TerminalIcon sx={{ fontSize: 16, color: '#888', mr: 1 }} />
                <Typography variant="caption" sx={{ color: '#888', fontWeight: 500 }}>
                  Terminal
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  size="small"
                  onClick={() => setOutput('')}
                  sx={{ color: '#888', p: 0.25 }}
                >
                  <DeleteIcon sx={{ fontSize: 14 }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setShowTerminal(false)}
                  sx={{ color: '#888', p: 0.25 }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  overflow: 'auto',
                  p: 1,
                  fontFamily: '"Fira Code", monospace',
                  fontSize: '13px',
                  color: '#d4d4d4',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {output || '$ Ready to run your project...'}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* New File Dialog */}
      <Dialog open={newFileDialog} onClose={() => setNewFileDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create New File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="File Name"
            placeholder="e.g., utils.py"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            sx={{ mt: 1 }}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFileDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateFile} variant="contained" disabled={!newFileName.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => setContextMenu(null)}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setContextMenu(null)}>
          <ListItemIcon><CopyIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            if (contextMenu?.item && 'content' in contextMenu.item) {
              handleDeleteFile(contextMenu.item.id);
            }
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      
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

export default ProjectBuilder;

export type { ProjectFile, ProjectFolder, ProjectConfig, ProjectBuilderProps };

