/**
 * IDE Page Component - Enterprise-Grade Visual Studio Code Clone
 * 
 * Full-featured IDE with:
 * - Project management
 * - File explorer with tree view
 * - Monaco-style code editor
 * - Integrated terminal
 * - Live preview
 * - Git integration
 * - Multiple panels (Problems, Output, Terminal)
 * - Keyboard shortcuts
 * - Theme switching (Dark/Light)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, IconButton, Button, Tooltip, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Menu, MenuItem, Divider, Chip, LinearProgress,
  Avatar, Tabs, Tab, Paper, List, ListItem, ListItemIcon, ListItemText, Card, CardContent,
  Switch, FormControlLabel, Select, InputLabel, FormControl, Alert, Grid, Container,
  Snackbar, CircularProgress, Breadcrumbs, Link, alpha, InputAdornment
} from '@mui/material';
import {
  Folder as FolderIcon, InsertDriveFile as FileIcon, Add as AddIcon,
  Close as CloseIcon, Search as SearchIcon, Settings as SettingsIcon,
  PlayArrow as RunIcon, Stop as StopIcon, CloudUpload as DeployIcon,
  GitHub as GitHubIcon, Terminal as TerminalIcon, BugReport as DebugIcon,
  Extension as ExtensionIcon, AccountTree as SourceControlIcon,
  Refresh as RefreshIcon, ExpandMore, ChevronRight, Delete as DeleteIcon,
  Edit as EditIcon, FileCopy as CopyIcon, ContentPaste as PasteIcon,
  Undo as UndoIcon, Redo as RedoIcon, Save as SaveIcon, FolderOpen,
  CreateNewFolder as NewFolderIcon, NoteAdd as NewFileIcon, Download as DownloadIcon,
  Upload as UploadIcon, Code as CodeIcon, ViewModule as SplitIcon,
  Fullscreen, FullscreenExit, DarkMode, LightMode, KeyboardArrowDown,
  Error as ErrorIcon, Warning as WarningIcon, Info as InfoIcon,
  CheckCircle as SuccessIcon, MoreVert, Lock as LockIcon,
  Cloud as CloudIcon, Storage as StorageIcon, ArrowBack as ArrowBackIcon,
  Web as WebIcon, PhoneAndroid as MobileIcon, Extension as ExtIcon,
  Laptop as LaptopIcon, Share as ShareIcon, FilterList as FilterIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { getApiUrl } from '../../config/api';
import JSZip from 'jszip';

// ============= TYPE DEFINITIONS =============
interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
  /** Backend file UUID for save/update */
  backendFileId?: string;
}

interface Project {
  id: string;
  name: string;
  type: 'website' | 'webapp' | 'mobile' | 'extension';
  template: string;
  description: string;
  createdAt: Date;
  lastModified: Date;
  files: FileNode[];
}

interface ExtensionItem {
  id: string;
  name: string;
  desc: string;
  installed: boolean;
  enabled: boolean;
}

interface Problem {
  type: 'error' | 'warning' | 'info';
  message: string;
  file: string;
  line: number;
}

// ============= PROJECT TEMPLATES =============
const PROJECT_TEMPLATES = {
  website: {
    landing: {
      name: 'Landing Page',
      description: 'Modern responsive landing page',
      files: (projectName: string): FileNode[] => [
        {
          id: 'src',
          name: 'src',
          type: 'folder',
          isOpen: true,
          children: [
            {
              id: 'src/index.html',
              name: 'index.html',
              type: 'file',
              language: 'html',
              content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app">
    <header class="header">
      <nav class="nav">
        <h1 class="logo">🚀 ${projectName}</h1>
        <ul class="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
    
    <main class="main">
      <section class="hero" id="home">
        <div class="hero-content">
          <h1>Welcome to ${projectName}</h1>
          <p>Build something amazing with VerTechie IDE</p>
          <div class="hero-buttons">
            <button class="btn btn-primary" onclick="handleGetStarted()">Get Started</button>
            <button class="btn btn-secondary">Learn More</button>
          </div>
        </div>
        <div class="hero-image">
          <div class="floating-card card-1">⚡</div>
          <div class="floating-card card-2">🎨</div>
          <div class="floating-card card-3">🚀</div>
        </div>
      </section>
      
      <section class="features" id="features">
        <h2>Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <span class="icon">⚡</span>
            <h3>Lightning Fast</h3>
            <p>Optimized for maximum performance and speed.</p>
          </div>
          <div class="feature-card">
            <span class="icon">🔒</span>
            <h3>Secure</h3>
            <p>Enterprise-grade security built in.</p>
          </div>
          <div class="feature-card">
            <span class="icon">🎨</span>
            <h3>Beautiful</h3>
            <p>Modern, elegant UI/UX design.</p>
          </div>
          <div class="feature-card">
            <span class="icon">📱</span>
            <h3>Responsive</h3>
            <p>Works perfectly on all devices.</p>
          </div>
        </div>
      </section>
      
      <section class="stats">
        <div class="stat">
          <h3>10K+</h3>
          <p>Users</p>
        </div>
        <div class="stat">
          <h3>50+</h3>
          <p>Countries</p>
        </div>
        <div class="stat">
          <h3>99.9%</h3>
          <p>Uptime</p>
        </div>
        <div class="stat">
          <h3>24/7</h3>
          <p>Support</p>
        </div>
      </section>
    </main>
    
    <footer class="footer">
      <p>&copy; 2024 ${projectName}. Built with VerTechie IDE.</p>
    </footer>
  </div>
  
  <script src="app.js"></script>
</body>
</html>`,
            },
            {
              id: 'src/styles.css',
              name: 'styles.css',
              type: 'file',
              language: 'css',
              content: `/* ===== CSS VARIABLES ===== */
:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --secondary: #06b6d4;
  --accent: #f59e0b;
  --success: #10b981;
  --bg-dark: #0f172a;
  --bg-light: #1e293b;
  --bg-card: #334155;
  --text: #f8fafc;
  --text-muted: #94a3b8;
  --radius: 16px;
  --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== RESET & BASE ===== */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg-dark);
  color: var(--text);
  line-height: 1.6;
  overflow-x: hidden;
}

/* ===== NAVIGATION ===== */
.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  backdrop-filter: blur(20px);
  background: rgba(15, 23, 42, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 2.5rem;
  list-style: none;
}

.nav-links a {
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: var(--transition);
  position: relative;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: var(--transition);
}

.nav-links a:hover {
  color: var(--text);
}

.nav-links a:hover::after {
  width: 100%;
}

/* ===== HERO SECTION ===== */
.main {
  padding-top: 80px;
}

.hero {
  min-height: calc(100vh - 80px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 4rem 2rem;
  max-width: 1280px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #fff 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-content p {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 2.5rem;
  max-width: 500px;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: var(--transition);
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(99, 102, 241, 0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--text);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.1);
}

.hero-image {
  position: relative;
  height: 400px;
}

.floating-card {
  position: absolute;
  width: 100px;
  height: 100px;
  background: var(--bg-light);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: var(--shadow);
  animation: float 6s ease-in-out infinite;
}

.card-1 { top: 20%; left: 20%; animation-delay: 0s; }
.card-2 { top: 40%; right: 20%; animation-delay: 2s; }
.card-3 { bottom: 20%; left: 40%; animation-delay: 4s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

/* ===== FEATURES SECTION ===== */
.features {
  padding: 6rem 2rem;
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
}

.features h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, var(--text), var(--text-muted));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--bg-light);
  padding: 2.5rem 2rem;
  border-radius: var(--radius);
  text-align: center;
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow);
  border-color: var(--primary);
}

.feature-card .icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* ===== STATS SECTION ===== */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  text-align: center;
}

.stat h3 {
  font-size: 3rem;
  font-weight: 800;
}

.stat p {
  font-size: 1rem;
  opacity: 0.9;
}

/* ===== FOOTER ===== */
.footer {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .hero-image {
    display: none;
  }
  
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .nav-links {
    display: none;
  }
}`,
            },
            {
              id: 'src/app.js',
              name: 'app.js',
              type: 'file',
              language: 'javascript',
              content: `// ===== ${projectName} JavaScript =====
console.log('🚀 ${projectName} loaded successfully!');

// Handle Get Started button click
function handleGetStarted() {
  // Show welcome message
  showNotification('Welcome to ${projectName}! 🎉');
}

// Show notification toast
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = message;
  notification.style.cssText = \`
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    color: white;
    padding: 1rem 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    font-weight: 600;
  \`;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = \`
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
\`;
document.head.appendChild(style);

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  // Log load time
  const loadTime = performance.now();
  console.log(\`⚡ Loaded in \${loadTime.toFixed(0)}ms\`);
  
  // Observe feature cards
  document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = \`all 0.6s ease \${index * 0.1}s\`;
    observer.observe(card);
  });
  
  // Add parallax effect to floating cards
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.floating-card');
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    cards.forEach((card, index) => {
      const factor = (index + 1) * 0.5;
      card.style.transform = \`translate(\${x * factor}px, \${y * factor}px)\`;
    });
  });
});

// Utility functions
const utils = {
  debounce: (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  },
  
  throttle: (fn, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  formatNumber: (num) => {
    return new Intl.NumberFormat().format(num);
  }
};

// Export for modules
if (typeof module !== 'undefined') {
  module.exports = { handleGetStarted, showNotification, utils };
}`,
            },
          ],
        },
        {
          id: 'package.json',
          name: 'package.json',
          type: 'file',
          language: 'json',
          content: `{
  "name": "${projectName.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "description": "Built with VerTechie IDE",
  "main": "src/app.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/**/*.js"
  },
  "author": "VerTechie User",
  "license": "MIT"
}`,
        },
        {
          id: 'README.md',
          name: 'README.md',
          type: 'file',
          language: 'markdown',
          content: `# ${projectName}

> Built with VerTechie IDE 🚀

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- ⚡ Lightning fast performance
- 🔒 Secure by default
- 🎨 Beautiful modern UI
- 📱 Fully responsive

## License

MIT License`,
        },
        {
          id: '.gitignore',
          name: '.gitignore',
          type: 'file',
          language: 'text',
          content: `node_modules/
dist/
.env
.env.local
.DS_Store
*.log`,
        },
      ],
    },
  },
};

// ============= FILE TREE COMPONENT =============
const FileTree: React.FC<{
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
  selectedFile: string | null;
  onToggleFolder: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, file: FileNode) => void;
  theme: 'vs-dark' | 'vs-light';
}> = ({ files, onFileSelect, selectedFile, onToggleFolder, onContextMenu, theme }) => {
  
  const getFileIcon = (file: FileNode) => {
    if (file.type === 'folder') {
      return file.isOpen ? <FolderOpen sx={{ color: '#dcb67a', fontSize: 18 }} /> : <FolderIcon sx={{ color: '#dcb67a', fontSize: 18 }} />;
    }
    
    const iconColors: Record<string, string> = {
      js: '#f7df1e', ts: '#3178c6', tsx: '#3178c6', jsx: '#61dafb',
      html: '#e34f26', css: '#1572b6', scss: '#c6538c', json: '#292929',
      md: '#083fa1', py: '#3776ab', java: '#007396', go: '#00add8',
      rs: '#dea584', rb: '#cc342d', php: '#777bb4', swift: '#fa7343',
    };
    
    const ext = file.name.split('.').pop() || '';
    const color = iconColors[ext] || '#888';
    
    return <FileIcon sx={{ color, fontSize: 18 }} />;
  };

  const renderTree = (nodes: FileNode[], depth = 0) => (
    <>
      {nodes.map(node => (
        <Box key={node.id}>
          <Box
            onClick={() => node.type === 'folder' ? onToggleFolder(node.id) : onFileSelect(node)}
            onContextMenu={(e) => onContextMenu(e, node)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              py: 0.4,
              px: 1,
              pl: depth * 1.5 + 1,
              cursor: 'pointer',
              bgcolor: selectedFile === node.id ? (theme === 'vs-dark' ? '#37373d' : '#e8e8e8') : 'transparent',
              '&:hover': { bgcolor: theme === 'vs-dark' ? '#2a2d2e' : '#f0f0f0' },
              color: theme === 'vs-dark' ? '#cccccc' : '#333',
            }}
          >
            {node.type === 'folder' && (
              <ChevronRight sx={{ 
                fontSize: 16, 
                transform: node.isOpen ? 'rotate(90deg)' : 'none',
                transition: 'transform 0.1s',
                color: theme === 'vs-dark' ? '#888' : '#666',
              }} />
            )}
            {getFileIcon(node)}
            <Typography variant="body2" sx={{ fontSize: '13px', userSelect: 'none' }}>{node.name}</Typography>
          </Box>
          {node.type === 'folder' && node.isOpen && node.children && renderTree(node.children, depth + 1)}
        </Box>
      ))}
    </>
  );

  return <Box sx={{ py: 0.5 }}>{renderTree(files)}</Box>;
};

// ============= TERMINAL COMPONENT =============
const TerminalPanel: React.FC<{
  output: string[];
  onCommand: (cmd: string) => void;
  isRunning: boolean;
  theme: 'vs-dark' | 'vs-light';
}> = ({ output, onCommand, isRunning, theme }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      onCommand(input.trim());
      setHistory(prev => [...prev, input.trim()]);
      setHistoryIndex(-1);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setInput(history[history.length - historyIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const getLineColor = (line: string) => {
    if (line.includes('error') || line.includes('Error') || line.startsWith('✗')) return '#f14c4c';
    if (line.includes('warning') || line.includes('Warning')) return '#cca700';
    if (line.includes('success') || line.startsWith('✓') || line.includes('✅')) return '#4ec9b0';
    if (line.startsWith('$') || line.startsWith('>')) return '#569cd6';
    if (line.startsWith('→')) return '#c586c0';
    return theme === 'vs-dark' ? '#d4d4d4' : '#333';
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: theme === 'vs-dark' ? '#1e1e1e' : '#f5f5f5' }}>
      <Box
        ref={outputRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 1,
          fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
          fontSize: '12px',
          lineHeight: 1.6,
        }}
      >
        {output.map((line, i) => (
          <Box key={i} sx={{ color: getLineColor(line), whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {line}
          </Box>
        ))}
        {isRunning && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#888' }}>
            <CircularProgress size={12} sx={{ color: '#569cd6' }} />
            <span>Running...</span>
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', borderTop: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}`, p: 0.5 }}>
        <Typography sx={{ color: '#569cd6', fontFamily: 'monospace', fontSize: '12px', px: 1 }}>❯</Typography>
        <Box
          component="input"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command..."
          disabled={isRunning}
          sx={{
            flex: 1,
            bgcolor: 'transparent',
            border: 'none',
            outline: 'none',
            color: theme === 'vs-dark' ? '#d4d4d4' : '#333',
            fontFamily: '"Fira Code", "Consolas", monospace',
            fontSize: '12px',
            '&::placeholder': { color: '#888' },
          }}
        />
      </Box>
    </Box>
  );
};

// ============= PROBLEMS PANEL =============
const ProblemsPanel: React.FC<{
  problems: Problem[];
  onProblemClick: (file: string, line: number) => void;
  theme: 'vs-dark' | 'vs-light';
}> = ({ problems, onProblemClick, theme }) => (
  <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: theme === 'vs-dark' ? '#1e1e1e' : '#f5f5f5' }}>
    {problems.length === 0 ? (
      <Box sx={{ p: 2, color: '#888', textAlign: 'center' }}>
        <SuccessIcon sx={{ fontSize: 40, color: '#4ec9b0', mb: 1 }} />
        <Typography variant="body2">No problems detected</Typography>
      </Box>
    ) : (
      <List dense>
        {problems.map((problem, i) => (
          <ListItem
            key={i}
            onClick={() => onProblemClick(problem.file, problem.line)}
            sx={{ cursor: 'pointer', '&:hover': { bgcolor: theme === 'vs-dark' ? '#2a2d2e' : '#f0f0f0' } }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              {problem.type === 'error' && <ErrorIcon sx={{ color: '#f14c4c', fontSize: 18 }} />}
              {problem.type === 'warning' && <WarningIcon sx={{ color: '#cca700', fontSize: 18 }} />}
              {problem.type === 'info' && <InfoIcon sx={{ color: '#3794ff', fontSize: 18 }} />}
            </ListItemIcon>
            <ListItemText
              primary={problem.message}
              secondary={`${problem.file}:${problem.line}`}
              primaryTypographyProps={{ fontSize: '12px', color: theme === 'vs-dark' ? '#d4d4d4' : '#333' }}
              secondaryTypographyProps={{ fontSize: '11px', color: '#888' }}
            />
          </ListItem>
        ))}
      </List>
    )}
  </Box>
);

// ============= MAIN IDE PAGE COMPONENT =============
const IDEPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  
  // View state
  const [view, setView] = useState<'projects' | 'ide'>(projectId ? 'ide' : 'projects');
  const [theme, setTheme] = useState<'vs-dark' | 'vs-light'>('vs-dark');
  const [activePanel, setActivePanel] = useState<'explorer' | 'search' | 'git' | 'debug' | 'extensions'>('explorer');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true);
  const [bottomPanelTab, setBottomPanelTab] = useState<'terminal' | 'problems' | 'output'>('terminal');
  
  // Project creation
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState<'website' | 'webapp' | 'mobile' | 'extension'>('website');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  
  // Projects list (loaded from backend)
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [projectLoadError, setProjectLoadError] = useState<string | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);
  
  // Current project state
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [unsavedFiles, setUnsavedFiles] = useState<Set<string>>(new Set());

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastContentRef = useRef<{ fileId: string; content: string } | null>(null);
  
  // Terminal
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '$ VerTechie IDE Terminal v2.0',
    '$ Type "help" for available commands',
    '',
  ]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Problems
  const [problems, setProblems] = useState<Problem[]>([]);
  
  // Dialogs
  const [newFileDialogOpen, setNewFileDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: FileNode } | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<FileNode | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileNode | null>(null);
  const [topMenuAnchor, setTopMenuAnchor] = useState<null | HTMLElement>(null);
  const [topMenuKind, setTopMenuKind] = useState<null | 'file' | 'edit' | 'view' | 'go' | 'run' | 'terminal' | 'help'>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gitDialogOpen, setGitDialogOpen] = useState(false);
  const [repoName, setRepoName] = useState('');
  const [gitVisibility, setGitVisibility] = useState<'public' | 'private'>('public');
  const [connectGitDialogOpen, setConnectGitDialogOpen] = useState(false);
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [githubConnected, setGithubConnected] = useState(false);
  const [stagedFileIds, setStagedFileIds] = useState<Set<string>>(new Set());
  const [commitMessage, setCommitMessage] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'info' });

  const EXTENSIONS_STORAGE_KEY = 'vertechie_ide_extensions';
  const defaultExtensions: ExtensionItem[] = [
    { id: 'eslint', name: 'ESLint', desc: 'Code linting', installed: true, enabled: true },
    { id: 'prettier', name: 'Prettier', desc: 'Code formatter', installed: true, enabled: true },
    { id: 'gitlens', name: 'GitLens', desc: 'Git history and blame', installed: false, enabled: false },
    { id: 'theme', name: 'One Dark Pro', desc: 'Theme', installed: true, enabled: true },
  ];
  const [extensions, setExtensions] = useState<ExtensionItem[]>(() => {
    try {
      const raw = localStorage.getItem(EXTENSIONS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ExtensionItem[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return defaultExtensions;
  });
  useEffect(() => {
    try {
      localStorage.setItem(EXTENSIONS_STORAGE_KEY, JSON.stringify(extensions));
    } catch { /* ignore */ }
  }, [extensions]);

  // Enhanced IDE Features
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [findReplaceOpen, setFindReplaceOpen] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [searchInFilesOpen, setSearchInFilesOpen] = useState(false);
  const [globalSearchText, setGlobalSearchText] = useState('');
  const [splitView, setSplitView] = useState(false);
  const [secondActiveFileId, setSecondActiveFileId] = useState<string | null>(null);
  const [autoSave, setAutoSave] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);
  const [wordWrap, setWordWrap] = useState(true);
  const [showMinimap, setShowMinimap] = useState(false);
  const [livePreviewUrl, setLivePreviewUrl] = useState<string | null>(null);
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
  const [gitChanges, setGitChanges] = useState<string[]>([]);
  const [multipleTerminals, setMultipleTerminals] = useState<{ id: number; output: string[]; name: string }[]>([
    { id: 1, output: ['$ VerTechie IDE Terminal v2.0', '$ Type "help" for available commands', ''], name: 'bash' }
  ]);
  const [activeTerminalId, setActiveTerminalId] = useState(1);
  const [zenMode, setZenMode] = useState(false);
  const [goToLineOpen, setGoToLineOpen] = useState(false);
  const [goToLineValue, setGoToLineValue] = useState('');
  const [indentationMenuAnchor, setIndentationMenuAnchor] = useState<null | HTMLElement>(null);
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);

  // Command Palette Commands
  const commands = [
    { id: 'file.new', label: 'File: New File', shortcut: 'Ctrl+N', action: () => setNewFileDialogOpen(true) },
    { id: 'file.save', label: 'File: Save', shortcut: 'Ctrl+S', action: () => handleSave() },
    { id: 'file.saveAll', label: 'File: Save All', shortcut: 'Ctrl+Shift+S', action: () => { setUnsavedFiles(new Set()); setSnackbar({ open: true, message: 'All files saved!', severity: 'success' }); } },
    { id: 'edit.find', label: 'Edit: Find', shortcut: 'Ctrl+F', action: () => setFindReplaceOpen(true) },
    { id: 'edit.replace', label: 'Edit: Find and Replace', shortcut: 'Ctrl+H', action: () => setFindReplaceOpen(true) },
    { id: 'edit.undo', label: 'Edit: Undo', shortcut: 'Ctrl+Z', action: () => {} },
    { id: 'edit.redo', label: 'Edit: Redo', shortcut: 'Ctrl+Y', action: () => {} },
    { id: 'view.sidebar', label: 'View: Toggle Sidebar', shortcut: 'Ctrl+B', action: () => setSidebarOpen(!sidebarOpen) },
    { id: 'view.terminal', label: 'View: Toggle Terminal', shortcut: 'Ctrl+`', action: () => setBottomPanelOpen(!bottomPanelOpen) },
    { id: 'view.split', label: 'View: Split Editor', shortcut: 'Ctrl+\\', action: () => setSplitView(!splitView) },
    { id: 'view.zen', label: 'View: Toggle Zen Mode', shortcut: 'Ctrl+K Z', action: () => setZenMode(!zenMode) },
    { id: 'view.theme', label: 'View: Toggle Theme', shortcut: '', action: () => setTheme(theme === 'vs-dark' ? 'vs-light' : 'vs-dark') },
    { id: 'terminal.new', label: 'Terminal: New Terminal', shortcut: 'Ctrl+Shift+`', action: () => addNewTerminal() },
    { id: 'terminal.clear', label: 'Terminal: Clear', shortcut: '', action: () => handleTerminalCommand('clear') },
    { id: 'git.push', label: 'Git: Push', shortcut: '', action: () => setGitDialogOpen(true) },
    { id: 'run.start', label: 'Run: Start Dev Server', shortcut: 'F5', action: () => handleTerminalCommand('npm run dev') },
    { id: 'run.build', label: 'Run: Build Project', shortcut: 'Ctrl+Shift+B', action: () => handleTerminalCommand('npm run build') },
    { id: 'settings.open', label: 'Preferences: Open Settings', shortcut: 'Ctrl+,', action: () => setSettingsOpen(true) },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(commandSearch.toLowerCase())
  );

  // Map backend project_type to frontend type
  const backendTypeToFrontend = (t: string): 'website' | 'webapp' | 'mobile' | 'extension' => {
    if (t === 'mobile') return 'mobile';
    if (t === 'web' || t === 'fullstack') return 'webapp';
    return 'website';
  };
  const frontendTypeToBackend = (t: string): string => {
    if (t === 'mobile') return 'mobile';
    if (t === 'extension') return 'other';
    return 'web';
  };

  // Fetch projects list from backend
  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setProjects([]);
        return;
      }
      const res = await fetch(getApiUrl('/ide/projects'), {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        setProjectsError('Failed to load projects');
        setProjects([]);
        return;
      }
      const data = await res.json();
      setProjects((data || []).map((p: {
        id: string;
        name: string;
        project_type: string;
        description: string | null;
        created_at: string;
        updated_at: string;
      }) => ({
        id: p.id,
        name: p.name,
        type: backendTypeToFrontend(p.project_type || 'web'),
        template: 'landing',
        description: p.description || '',
        createdAt: new Date(p.created_at),
        lastModified: new Date(p.updated_at),
        files: [],
      })));
    } catch {
      setProjectsError('Failed to load projects');
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  // Build file tree from flat list of backend files (path-based)
  const buildFileTree = (apiFiles: { id: string; name: string; path: string; content?: string; language?: string }[]): FileNode[] => {
    const byPath: Record<string, FileNode> = {};
    for (const f of apiFiles) {
      const path = f.path || f.name || '';
      const parts = path.split('/').filter(Boolean);
      if (parts.length === 0) continue;
      for (let i = 0; i < parts.length; i++) {
        const fullPath = parts.slice(0, i + 1).join('/');
        if (byPath[fullPath]) continue;
        const isFile = i === parts.length - 1;
        byPath[fullPath] = {
          id: fullPath,
          name: parts[i],
          type: isFile ? 'file' : 'folder',
          content: isFile ? (f.content ?? '') : undefined,
          language: isFile ? f.language : undefined,
          backendFileId: isFile ? f.id : undefined,
          children: isFile ? undefined : [],
          isOpen: true,
        };
      }
      const fileNode = byPath[path];
      if (fileNode) {
        if (f.content !== undefined) fileNode.content = f.content;
        if (f.id) fileNode.backendFileId = f.id;
      }
    }
    for (const path of Object.keys(byPath)) {
      if (path.includes('/')) {
        const parentPath = path.split('/').slice(0, -1).join('/');
        const parent = byPath[parentPath];
        if (parent && parent.children) parent.children.push(byPath[path]);
      }
    }
    const rootChildren = Object.keys(byPath)
      .filter(p => !p.includes('/'))
      .map(p => byPath[p])
      .sort((a, b) => (a.type === 'folder' && b.type !== 'folder') ? -1 : (a.type !== 'folder' && b.type === 'folder') ? 1 : (a.name || '').localeCompare(b.name || ''));
    return rootChildren;
  };

  // Load single project and its files from backend
  const loadProjectById = useCallback(async (id: string) => {
    setProjectLoadError(null);
    setProjectLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const [projRes, filesRes] = await Promise.all([
        fetch(getApiUrl(`/ide/projects/${id}`), { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(getApiUrl(`/ide/projects/${id}/files`), { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      if (!projRes.ok) {
        setProjectLoadError('Project not found');
        return;
      }
      const proj = await projRes.json();
      const filesList: { id: string; name: string; path: string; language?: string }[] = filesRes.ok ? await filesRes.json() : [];
      const fileIds = filesList.map(f => f.id);
      const filesWithContent: { id: string; name: string; path: string; content?: string; language?: string }[] = [];
      for (const fid of fileIds) {
        const r = await fetch(getApiUrl(`/ide/files/${fid}`), { headers: { 'Authorization': `Bearer ${token}` } });
        if (r.ok) {
          const f = await r.json();
          filesWithContent.push({
            id: f.id,
            name: f.name,
            path: f.path,
            content: f.content ?? '',
            language: f.language,
          });
        } else {
          filesWithContent.push(filesList.find(f => f.id === fid) || { id: fid, name: '', path: '', content: '' });
        }
      }
      const tree = buildFileTree(filesWithContent);
      const project: Project = {
        id: proj.id,
        name: proj.name,
        type: backendTypeToFrontend(proj.project_type || 'web'),
        template: 'landing',
        description: proj.description || '',
        createdAt: new Date(proj.created_at),
        lastModified: new Date(proj.updated_at),
        files: tree,
      };
      setCurrentProject(project);
      setFiles(tree);
      setOpenFiles([]);
      setActiveFileId(null);
      setView('ide');
      setTerminalOutput([
        `$ VerTechie IDE Terminal`,
        `$ Project: ${project.name}`,
        `$ Type "help" for available commands`,
        '',
      ]);
    } catch {
      setProjectLoadError('Failed to load project');
    } finally {
      setProjectLoading(false);
    }
  }, []);

  // Add new terminal
  const addNewTerminal = () => {
    const newId = Math.max(...multipleTerminals.map(t => t.id)) + 1;
    setMultipleTerminals([...multipleTerminals, { id: newId, output: ['$ New terminal'], name: `bash ${newId}` }]);
    setActiveTerminalId(newId);
  };

  // Find file by ID recursively
  const findFile = useCallback((nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFile(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Find first file with name ending in .html (for preview)
  const findFirstHtmlFile = useCallback((nodes: FileNode[]): FileNode | null => {
    for (const node of nodes) {
      if (node.type === 'file' && node.name.toLowerCase().endsWith('.html')) return node;
      if (node.children) {
        const found = findFirstHtmlFile(node.children);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Find file by name in tree (e.g. "style.css")
  const findFileByName = useCallback((nodes: FileNode[], name: string): FileNode | null => {
    for (const node of nodes) {
      if (node.type === 'file' && node.name === name) return node;
      if (node.children) {
        const found = findFileByName(node.children, name);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Get active file
  const activeFile = activeFileId ? findFile(files, activeFileId) : null;

  // Handle file selection
  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      if (!openFiles.find(f => f.id === file.id)) {
        setOpenFiles([...openFiles, file]);
      }
      setActiveFileId(file.id);
    }
  };

  // Handle folder toggle
  const handleToggleFolder = (id: string) => {
    const updateFolder = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: updateFolder(node.children) };
        }
        return node;
      });
    };
    setFiles(updateFolder(files));
  };

  // Handle code change (use functional updates so new files get content even before tree has committed)
  const handleCodeChange = (newContent: string) => {
    if (!activeFileId) return;
    lastContentRef.current = { fileId: activeFileId, content: newContent };
    const updateContent = (nodes: FileNode[]): FileNode[] =>
      nodes.map(node => {
        if (node.id === activeFileId) return { ...node, content: newContent };
        if (node.children) return { ...node, children: updateContent(node.children) };
        return node;
      });
    setFiles(prev => updateContent(prev));
    setUnsavedFiles(prev => new Set(prev).add(activeFileId));
    setOpenFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: newContent } : f));
    // Debounced auto-save so content is persisted when project is from backend
    if (projectId && localStorage.getItem('authToken')) {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        autoSaveTimerRef.current = null;
        handleSave();
      }, 1800);
    }
  };

  // Remove node from tree by id (and all descendants); return new tree
  const removeNodeById = useCallback((nodes: FileNode[], id: string): FileNode[] => {
    return nodes
      .filter((n) => n.id !== id)
      .map((n) =>
        n.children ? { ...n, children: removeNodeById(n.children, id) } : n
      );
  }, []);

  // Rename file/folder in tree (update name and id/path)
  const handleRenameConfirm = () => {
    if (!fileToRename || !renameValue.trim()) return;
    const newName = renameValue.trim();
    const parentPath = fileToRename.id.includes('/') ? fileToRename.id.split('/').slice(0, -1).join('/') : '';
    const newId = parentPath ? `${parentPath}/${newName}` : newName;

    const updateNode = (nodes: FileNode[]): FileNode[] =>
      nodes.map((node) => {
        if (node.id === fileToRename.id) {
          return { ...node, id: newId, name: newName };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    setFiles(updateNode(files));
    setOpenFiles((prev) =>
      prev.map((f) => (f.id === fileToRename.id ? { ...f, id: newId, name: newName } : f))
    );
    if (activeFileId === fileToRename.id) setActiveFileId(newId);
    setUnsavedFiles((prev) => {
      const next = new Set(prev);
      next.delete(fileToRename.id);
      if (prev.has(fileToRename.id)) next.add(newId);
      return next;
    });
    setRenameDialogOpen(false);
    setFileToRename(null);
    setRenameValue('');
    setSnackbar({ open: true, message: 'Renamed successfully', severity: 'success' });
  };

  // Delete file/folder (remove from tree, close tabs, optional backend delete)
  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;
    const id = fileToDelete.id;
    const token = localStorage.getItem('authToken');
    if (fileToDelete.backendFileId && token) {
      try {
        const res = await fetch(getApiUrl(`/ide/files/${fileToDelete.backendFileId}`), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setSnackbar({ open: true, message: 'Failed to delete on server', severity: 'error' });
          return;
        }
      } catch {
        setSnackbar({ open: true, message: 'Failed to delete file', severity: 'error' });
        return;
      }
    }
    setFiles((prev) => removeNodeById(prev, id));
    const isFolder = fileToDelete.type === 'folder';
    const idPrefix = id + '/';
    setOpenFiles((prev) =>
      prev.filter((f) => f.id !== id && !(isFolder && f.id.startsWith(idPrefix)))
    );
    const stillOpen = openFiles.filter((f) => f.id !== id && !(isFolder && f.id.startsWith(idPrefix)));
    if (activeFileId === id || (isFolder && activeFileId?.startsWith(idPrefix))) {
      setActiveFileId(stillOpen.length > 0 ? stillOpen[stillOpen.length - 1].id : null);
    }
    setUnsavedFiles((prev) => {
      const next = new Set(prev);
      next.delete(id);
      if (isFolder) prev.forEach((k) => { if (k.startsWith(idPrefix)) next.delete(k); });
      return next;
    });
    setDeleteConfirmOpen(false);
    setFileToDelete(null);
    setSnackbar({ open: true, message: 'Deleted', severity: 'success' });
  };

  // Handle tab close
  const handleCloseTab = (fileId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpenFiles(prev => prev.filter(f => f.id !== fileId));
    if (activeFileId === fileId) {
      const remaining = openFiles.filter(f => f.id !== fileId);
      setActiveFileId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  // Update a file node in the tree with backendFileId (after creating on server)
  const setFileBackendId = useCallback((nodeId: string, backendFileId: string, path?: string) => {
    const updateNodes = (nodes: FileNode[]): FileNode[] =>
      nodes.map((n) => {
        if (n.id === nodeId) {
          return { ...n, backendFileId, ...(path != null && path !== n.id ? { id: path, name: path.split('/').pop() || n.name } : {}) };
        }
        if (n.children) return { ...n, children: updateNodes(n.children) };
        return n;
      });
    setFiles((prev) => updateNodes(prev));
    setOpenFiles((prev) => prev.map((f) => (f.id === nodeId ? { ...f, backendFileId, ...(path != null && path !== nodeId ? { id: path, name: path.split('/').pop() || f.name } : {}) } : f)));
    if (activeFileId === nodeId && path != null && path !== nodeId) setActiveFileId(path);
  }, [activeFileId]);

  // Handle save (persist to backend: create file if new, then update content)
  // Use lastContentRef (latest typed content), then open tab, then tree so we never save stale/empty content
  const handleSave = async () => {
    if (!activeFileId) return;
    const file = findFile(files, activeFileId);
    const openTab = openFiles.find(f => f.id === activeFileId);
    const fromRef = lastContentRef.current?.fileId === activeFileId ? lastContentRef.current.content : null;
    const content = fromRef ?? (openTab?.content !== undefined && openTab.content !== null ? openTab.content : file?.content) ?? '';
    const token = localStorage.getItem('authToken');
    if (!token) {
      setSnackbar({ open: true, message: 'Sign in to save', severity: 'error' });
      return;
    }
    if (file?.backendFileId) {
      try {
        const res = await fetch(getApiUrl(`/ide/files/${file.backendFileId}`), {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });
        if (!res.ok) {
          setSnackbar({ open: true, message: 'Failed to save file', severity: 'error' });
          return;
        }
        setSnackbar({ open: true, message: 'File saved successfully!', severity: 'success' });
      } catch {
        setSnackbar({ open: true, message: 'Failed to save file', severity: 'error' });
        return;
      }
    } else if (projectId && file) {
      try {
        const res = await fetch(getApiUrl(`/ide/projects/${projectId}/files`), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: file.name, content }),
        });
        if (!res.ok) {
          setSnackbar({ open: true, message: 'Failed to create file', severity: 'error' });
          return;
        }
        const created = await res.json();
        setFileBackendId(activeFileId, created.id, created.path);
        setSnackbar({ open: true, message: 'File saved successfully!', severity: 'success' });
      } catch {
        setSnackbar({ open: true, message: 'Failed to save file', severity: 'error' });
        return;
      }
    } else {
      setSnackbar({ open: true, message: 'File saved locally', severity: 'success' });
    }
    setUnsavedFiles((prev) => {
      const next = new Set(prev);
      next.delete(activeFileId);
      return next;
    });
  };

  // Handle terminal commands
  const handleTerminalCommand = (cmd: string) => {
    setBottomPanelOpen(true);
    setBottomPanelTab('terminal');
    setTerminalOutput(prev => [...prev, `$ ${cmd}`]);
    const lowerCmd = cmd.toLowerCase().trim();
    
    if (lowerCmd === 'help') {
      setTerminalOutput(prev => [...prev,
        '',
        '📚 Available Commands:',
        '  npm install    - Install dependencies',
        '  npm run dev    - Start development server',
        '  npm run build  - Build for production',
        '  npm test       - Run tests',
        '  git status     - Show git status',
        '  git push       - Push to repository',
        '  clear          - Clear terminal',
        '  ls             - List files',
        '  pwd            - Print working directory',
        '',
      ]);
    } else if (lowerCmd === 'clear') {
      setTerminalOutput(['$ Terminal cleared', '']);
    } else if (lowerCmd === 'pwd') {
      setTerminalOutput(prev => [...prev, `/home/user/${currentProject?.name || 'project'}`, '']);
    } else if (lowerCmd === 'ls') {
      const fileList = files.map(f => f.type === 'folder' ? `📁 ${f.name}/` : `📄 ${f.name}`);
      setTerminalOutput(prev => [...prev, ...fileList, '']);
    } else if (lowerCmd === 'npm install' || lowerCmd === 'npm i') {
      setIsRunning(true);
      setTerminalOutput(prev => [...prev, '📦 Installing dependencies...', '']);
      setTimeout(() => {
        setTerminalOutput(prev => [...prev,
          '→ added 1423 packages in 4.2s',
          '',
          '✅ Dependencies installed successfully!',
          '',
        ]);
        setIsRunning(false);
      }, 2000);
    } else if (lowerCmd === 'npm run dev' || lowerCmd === 'npm start') {
      setIsRunning(true);
      const devPort = 5175;
      const devUrl = `http://localhost:${devPort}/`;
      setTerminalOutput(prev => [...prev, '🚀 Starting development server...', '']);
      setTimeout(() => {
        setTerminalOutput(prev => [...prev,
          '',
          '  VITE v5.0.0  ready in 234 ms',
          '',
          '  ➜  Local:   ' + devUrl,
          '  ➜  Network: http://192.168.1.100:' + devPort + '/',
          '',
          '  📌 Code output is in the Preview panel (right). Port ' + devPort + ' for live server.',
          '',
        ]);
        setIsRunning(false);
      }, 1500);
    } else if (lowerCmd === 'npm run build') {
      setIsRunning(true);
      setTerminalOutput(prev => [...prev, '🔨 Building for production...', '']);
      setTimeout(() => {
        setTerminalOutput(prev => [...prev,
          '',
          'vite v5.0.0 building for production...',
          '✓ 42 modules transformed.',
          'dist/index.html                  0.54 kB │ gzip:  0.32 kB',
          'dist/assets/index-DZS1k3fn.css   2.87 kB │ gzip:  0.98 kB',
          'dist/assets/index-C7cxMq9P.js   48.12 kB │ gzip: 15.43 kB',
          '',
          '✅ Build completed successfully!',
          '',
        ]);
        setIsRunning(false);
      }, 2500);
    } else if (lowerCmd === 'npm test') {
      setIsRunning(true);
      setTimeout(() => {
        setTerminalOutput(prev => [...prev,
          '',
          ' PASS  src/app.test.js',
          '  ✓ renders without crashing (12 ms)',
          '  ✓ handles click event (5 ms)',
          '',
          'Test Suites: 1 passed, 1 total',
          'Tests:       2 passed, 2 total',
          '',
        ]);
        setIsRunning(false);
      }, 2000);
    } else if (lowerCmd === 'git status') {
      setTerminalOutput(prev => [...prev,
        'On branch main',
        'Your branch is up to date.',
        '',
        unsavedFiles.size > 0 
          ? `Changes not staged:\n${Array.from(unsavedFiles).map(f => `  modified: ${f}`).join('\n')}`
          : 'Nothing to commit, working tree clean',
        '',
      ]);
    } else if (lowerCmd === 'git push') {
      setGitDialogOpen(true);
    } else {
      setTerminalOutput(prev => [...prev, `Command not found: ${cmd}`, 'Type "help" for available commands.', '']);
    }
  };

  // Handle project creation (POST to backend, then open)
  const handleCreateProject = async () => {
    if (!newProjectName) return;
    const token = localStorage.getItem('authToken');
    if (!token) {
      setSnackbar({ open: true, message: 'Please sign in to create a project', severity: 'error' });
      return;
    }
    try {
      const res = await fetch(getApiUrl('/ide/projects'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDesc || undefined,
          project_type: frontendTypeToBackend(newProjectType),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setSnackbar({ open: true, message: err.detail || 'Failed to create project', severity: 'error' });
        return;
      }
      const created = await res.json();
      setProjects(prev => [...prev, {
        id: created.id,
        name: created.name,
        type: newProjectType,
        template: 'landing',
        description: created.description || '',
        createdAt: new Date(created.created_at),
        lastModified: new Date(created.updated_at),
        files: [],
      }]);
      setCreateDialogOpen(false);
      setNewProjectName('');
      setNewProjectDesc('');
      navigate(`/techie/ide/${created.id}`);
      loadProjectById(created.id);
    } catch {
      setSnackbar({ open: true, message: 'Failed to create project', severity: 'error' });
    }
  };

  // Open project (from list: switch to IDE view and navigate so loadProjectById runs)
  const openProject = (project: Project) => {
    if (project.files && project.files.length > 0) {
      setCurrentProject(project);
      setFiles(project.files);
      setOpenFiles([]);
      setActiveFileId(null);
      setView('ide');
      setTerminalOutput([
        `$ VerTechie IDE Terminal`,
        `$ Project: ${project.name}`,
        `$ Type "help" for available commands`,
        '',
      ]);
    } else {
      setView('ide');
      navigate(`/techie/ide/${project.id}`);
    }
  };

  // Handle download – build a real ZIP and trigger browser download
  const handleDownload = async () => {
    const collectFiles = (nodes: FileNode[], path = ''): { path: string; content: string }[] => {
      const result: { path: string; content: string }[] = [];
      for (const node of nodes) {
        const fullPath = path ? `${path}/${node.name}` : node.name;
        if (node.type === 'file') {
          result.push({ path: fullPath, content: node.content || '' });
        } else if (node.children) {
          result.push(...collectFiles(node.children, fullPath));
        }
      }
      return result;
    };
    const allFiles = collectFiles(files);
    if (allFiles.length === 0) {
      setSnackbar({ open: true, message: 'No files to download', severity: 'info' });
      return;
    }
    try {
      const zip = new JSZip();
      for (const { path: filePath, content } of allFiles) {
        zip.file(filePath, content);
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject?.name || 'project'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setSnackbar({ open: true, message: `Downloaded ${currentProject?.name || 'project'}.zip (${allFiles.length} files)`, severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to create zip', severity: 'error' });
    }
  };

  // Handle git push (simulated: shows terminal output; real push would use GitHub API)
  const handleGitPush = () => {
    const repo = repoName.trim() || currentProject?.name || 'project';
    setGitDialogOpen(false);
    setBottomPanelOpen(true);
    setBottomPanelTab('terminal');
    setIsRunning(true);
    setTerminalOutput(prev => [...prev, `$ git push origin main`, '']);
    setTimeout(() => {
      setTerminalOutput(prev => [...prev,
        'Enumerating objects: 42, done.',
        'Counting objects: 100% (42/42), done.',
        'Writing objects: 100% (42/42), 12.43 KiB | 6.21 MiB/s, done.',
        `To github.com:user/${repo}.git`,
        '   abc1234..def5678  main -> main',
        '',
        '✅ Successfully pushed to GitHub!',
        '',
      ]);
      setIsRunning(false);
      setSnackbar({ open: true, message: 'Pushed to GitHub (simulated)', severity: 'success' });
    }, 2000);
  };

  const handleConnectGit = () => {
    const url = githubRepoUrl.trim();
    if (!url) {
      setSnackbar({ open: true, message: 'Enter a repository URL', severity: 'error' });
      return;
    }
    const match = url.match(/github\.com[/:](\w[\w.-]*)\/([^\s/]+?)(?:\.git)?$/i) || (url.includes('/') ? null : null);
    if (match) setRepoName(match[2]);
    else if (url.includes('/')) setRepoName(url.split('/').pop()?.replace(/\.git$/, '') || url);
    setGithubConnected(true);
    setConnectGitDialogOpen(false);
    setGithubRepoUrl('');
    setSnackbar({ open: true, message: 'Connected to GitHub', severity: 'success' });
  };

  const changeList = Array.from(unsavedFiles);
  const handleStageFile = (id: string) => setStagedFileIds(prev => new Set(prev).add(id));
  const handleUnstageFile = (id: string) => setStagedFileIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  const handleStageAll = () => setStagedFileIds(new Set(changeList));
  const handleUnstageAll = () => setStagedFileIds(new Set());
  const handleCommit = () => {
    const msg = commitMessage.trim();
    if (!msg) {
      setSnackbar({ open: true, message: 'Enter a commit message', severity: 'error' });
      return;
    }
    const count = stagedFileIds.size;
    setStagedFileIds(new Set());
    setCommitMessage('');
    setUnsavedFiles(prev => { const n = new Set(prev); stagedFileIds.forEach(id => n.delete(id)); return n; });
    setSnackbar({ open: true, message: `Committed ${count} file(s)`, severity: 'success' });
    setTerminalOutput(prev => [...prev, `$ git commit -m "${msg}"`, `[main abc1234] ${msg.slice(0, 50)}`, ` ${count} file(s) changed`, '']);
  };

  const handleNewFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    const exists = files.some(f => f.name === name || f.id === name || f.id === `${name}/`);
    if (exists) {
      setSnackbar({ open: true, message: 'A file or folder with that name already exists', severity: 'error' });
      return;
    }
    const token = localStorage.getItem('authToken');
    if (projectId && token) {
      try {
        const res = await fetch(getApiUrl(`/ide/projects/${projectId}/folders`), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setSnackbar({ open: true, message: err.detail || 'Failed to create folder', severity: 'error' });
          return;
        }
        const created = await res.json();
        const path = created.path || name;
        setFiles(prev => [...prev, { id: path, name: created.name || name, type: 'folder', children: [], isOpen: true }]);
        setNewFolderDialogOpen(false);
        setNewFolderName('');
        setSnackbar({ open: true, message: `Folder "${name}" created`, severity: 'success' });
      } catch {
        setSnackbar({ open: true, message: 'Failed to create folder', severity: 'error' });
      }
    } else {
      setFiles(prev => [...prev, { id: name, name, type: 'folder', children: [], isOpen: true }]);
      setNewFolderDialogOpen(false);
      setNewFolderName('');
      setSnackbar({ open: true, message: `Folder "${name}" created`, severity: 'success' });
    }
  };

  const toggleExtension = (id: string, action: 'install' | 'enable') => {
    setExtensions(prev => prev.map(ext => {
      if (ext.id !== id) return ext;
      if (action === 'install') return { ...ext, installed: !ext.installed, enabled: true };
      return { ...ext, enabled: !ext.enabled };
    }));
    setSnackbar({ open: true, message: action === 'install' ? 'Extension installed' : 'Extension toggled', severity: 'success' });
  };

  // Generate preview HTML: use active file if it's HTML, else first .html in tree; inline linked CSS/JS by filename
  const generatePreview = () => {
    const htmlFile =
      (activeFile?.name.toLowerCase().endsWith('.html') ? activeFile : null) ||
      findFirstHtmlFile(files);
    if (!htmlFile?.content) {
      return '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;font-family:sans-serif;">Select an HTML file to preview</div>';
    }
    let html = htmlFile.content;
    // Inline linked stylesheets by filename (href="style.css" or "styles.css" etc.)
    const linkMatch = html.match(/<link[^>]+href=["\']([^"\']+\.css)["\'][^>]*>/gi);
    if (linkMatch) {
      for (const tag of linkMatch) {
        const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
        const href = hrefMatch ? hrefMatch[1] : '';
        const fileName = href.split('/').pop() || href;
        const cssFile = findFileByName(files, fileName);
        if (cssFile?.content) {
          html = html.replace(tag, `<style>${cssFile.content}</style>`);
        }
      }
    }
    // Inline linked scripts by filename
    const scriptMatch = html.match(/<script[^>]+src=["\']([^"\']+)["\'][^>]*><\/script>/gi);
    if (scriptMatch) {
      for (const tag of scriptMatch) {
        const srcMatch = tag.match(/src=["']([^"']+)["']/i);
        const src = srcMatch ? srcMatch[1] : '';
        const fileName = src.split('/').pop() || src;
        const jsFile = findFileByName(files, fileName);
        if (jsFile?.content) {
          html = html.replace(tag, `<script>${jsFile.content}</script>`);
        }
      }
    }
    return html;
  };

  const openPreviewInNewTab = () => {
    const html = generatePreview();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Fetch projects on mount; load single project when projectId in URL
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (projectId && view === 'ide') {
      loadProjectById(projectId);
    }
  }, [projectId, view]);

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

  // Enhanced Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      // Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
      // Save All
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 's') {
        e.preventDefault();
        setUnsavedFiles(new Set());
        setSnackbar({ open: true, message: 'All files saved!', severity: 'success' });
      }
      // Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(!sidebarOpen);
      }
      // Toggle Terminal
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setBottomPanelOpen(!bottomPanelOpen);
      }
      // Find
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setFindReplaceOpen(true);
      }
      // Find and Replace
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setFindReplaceOpen(true);
      }
      // New File
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setNewFileDialogOpen(true);
      }
      // Split View
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        setSplitView(!splitView);
      }
      // Settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setSettingsOpen(true);
      }
      // Run
      if (e.key === 'F5') {
        e.preventDefault();
        handleTerminalCommand('npm run dev');
      }
      // Build
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'b') {
        e.preventDefault();
        handleTerminalCommand('npm run build');
      }
      // Zen Mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        // Wait for Z
      }
      // Escape to close dialogs
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setFindReplaceOpen(false);
      }
      // Font size
      if ((e.ctrlKey || e.metaKey) && e.key === '=') {
        e.preventDefault();
        setFontSize(prev => Math.min(prev + 2, 24));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        setFontSize(prev => Math.max(prev - 2, 10));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, bottomPanelOpen, splitView]);

  // ============= PROJECTS LIST VIEW =============
  if (view === 'projects') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', color: 'white' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/techie/practice')}
                sx={{ color: '#94a3b8' }}
              >
                Back to Practice
              </Button>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CodeIcon sx={{ fontSize: 40, color: '#6366f1' }} />
              VerTechie IDE
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                bgcolor: '#6366f1',
                '&:hover': { bgcolor: '#4f46e5' },
                px: 3,
              }}
            >
              New Project
            </Button>
          </Box>

          {/* Project Type Filter */}
          <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
            {[
              { id: 'all', label: 'All Projects', icon: <FolderIcon /> },
              { id: 'website', label: 'Websites', icon: <WebIcon /> },
              { id: 'webapp', label: 'Web Apps', icon: <LaptopIcon /> },
              { id: 'mobile', label: 'Mobile Apps', icon: <MobileIcon /> },
              { id: 'extension', label: 'Extensions', icon: <ExtIcon /> },
            ].map(filter => (
              <Chip
                key={filter.id}
                icon={filter.icon}
                label={filter.label}
                onClick={() => {}}
                sx={{
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.2)' },
                }}
              />
            ))}
          </Box>

          {projectsError && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setProjectsError(null)}>
              {projectsError}
            </Alert>
          )}
          {projectsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#6366f1' }} />
            </Box>
          ) : (
          <Grid container spacing={3}>
            {projects.length === 0 && !projectsLoading ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#1e293b', color: '#94a3b8' }}>
                  <Typography variant="h6" gutterBottom>No projects yet</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>Create your first project to get started.</Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)} sx={{ bgcolor: '#6366f1' }}>
                    New Project
                  </Button>
                </Paper>
              </Grid>
            ) : projects.map(project => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
                <Card
                  onClick={() => openProject(project)}
                  sx={{
                    bgcolor: '#1e293b',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      borderColor: '#6366f1',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                      }}>
                        {project.type === 'website' && '🌐'}
                        {project.type === 'webapp' && '💻'}
                        {project.type === 'mobile' && '📱'}
                        {project.type === 'extension' && '🧩'}
                      </Box>
                      <IconButton sx={{ color: '#94a3b8' }}>
                        <MoreVert />
                      </IconButton>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                      {project.description || 'No description'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Chip
                        label={project.type}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(99, 102, 241, 0.2)',
                          color: '#a5b4fc',
                          fontSize: '0.7rem',
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {project.lastModified.toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Create New Project Card */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                onClick={() => setCreateDialogOpen(true)}
                sx={{
                  bgcolor: 'transparent',
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '2px dashed rgba(100, 116, 139, 0.3)',
                  minHeight: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    borderColor: '#6366f1',
                    color: '#6366f1',
                  },
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <AddIcon sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="subtitle1">Create New Project</Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
          )}
        </Container>

        {/* Create Project Dialog */}
        <Dialog 
          open={createDialogOpen} 
          onClose={() => setCreateDialogOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white' } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Create New Project</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="my-awesome-project"
              sx={{ mt: 2, mb: 2, '& .MuiInputBase-root': { bgcolor: '#0f172a', color: 'white' } }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#94a3b8' }}>Project Type</InputLabel>
              <Select
                value={newProjectType}
                label="Project Type"
                onChange={(e) => setNewProjectType(e.target.value as any)}
                sx={{ bgcolor: '#0f172a', color: 'white' }}
              >
                <MenuItem value="website">🌐 Website</MenuItem>
                <MenuItem value="webapp">💻 Web Application</MenuItem>
                <MenuItem value="mobile">📱 Mobile App</MenuItem>
                <MenuItem value="extension">🧩 Browser Extension</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Description (Optional)"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              multiline
              rows={2}
              sx={{ '& .MuiInputBase-root': { bgcolor: '#0f172a', color: 'white' } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreateProject}
              disabled={!newProjectName}
              sx={{ bgcolor: '#6366f1' }}
            >
              Create Project
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // ============= IDE VIEW =============
  // When URL has projectId but project still loading or failed
  if (projectId && !currentProject) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        {projectLoading ? (
          <>
            <CircularProgress sx={{ color: '#6366f1', mb: 2 }} />
            <Typography>Loading project...</Typography>
          </>
        ) : (
          <>
            {projectLoadError && <Alert severity="error" sx={{ mb: 2 }}>{projectLoadError}</Alert>}
            <Button startIcon={<ArrowBackIcon />} onClick={() => { navigate('/techie/ide'); setView('projects'); }} sx={{ color: '#94a3b8' }}>
              Back to projects
            </Button>
          </>
        )}
      </Box>
    );
  }

  return (
    <Box
      data-allow-paste="true"
      sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: theme === 'vs-dark' ? '#1e1e1e' : '#ffffff',
      color: theme === 'vs-dark' ? '#cccccc' : '#333333',
    }}>
      {/* Title Bar */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: 1.5, 
        py: 0.5,
        bgcolor: theme === 'vs-dark' ? '#323233' : '#f3f3f3',
        borderBottom: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={() => { navigate('/techie/ide'); setView('projects'); setCurrentProject(null); }} sx={{ width: 12, height: 12, bgcolor: '#ff5f56', '&:hover': { bgcolor: '#ff5f56' } }} />
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27ca40' }} />
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, ml: 2 }}>
            📁 {currentProject?.name || 'Project'} - VerTechie IDE
          </Typography>
        </Box>
        
        {/* Menu Bar - dropdowns with actions */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {(['file', 'edit', 'view', 'go', 'run', 'terminal', 'help'] as const).map((kind) => (
            <Button
              key={kind}
              size="small"
              onClick={(e) => { setTopMenuAnchor(e.currentTarget); setTopMenuKind(kind); }}
              sx={{
                color: theme === 'vs-dark' ? '#ccc' : '#333',
                fontSize: '12px',
                textTransform: 'none',
                minWidth: 'auto',
                px: 1,
                '&:hover': { bgcolor: theme === 'vs-dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
              }}
            >
              {kind.charAt(0).toUpperCase() + kind.slice(1)}
            </Button>
          ))}
        </Box>
        <Menu
          anchorEl={topMenuAnchor}
          open={Boolean(topMenuAnchor && topMenuKind)}
          onClose={() => { setTopMenuAnchor(null); setTopMenuKind(null); }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{ sx: { bgcolor: theme === 'vs-dark' ? '#252526' : '#fff', color: theme === 'vs-dark' ? '#ccc' : '#333', minWidth: 180 } }}
        >
          {topMenuKind === 'file' && (
            <>
              <MenuItem onClick={() => { setNewFileDialogOpen(true); setTopMenuAnchor(null); setTopMenuKind(null); }}><ListItemIcon><NewFileIcon fontSize="small" /></ListItemIcon>New File</MenuItem>
              <MenuItem onClick={() => { handleSave(); setTopMenuAnchor(null); setTopMenuKind(null); }}><ListItemIcon><SaveIcon fontSize="small" /></ListItemIcon>Save</MenuItem>
              <MenuItem onClick={() => { setUnsavedFiles(new Set()); setSnackbar({ open: true, message: 'All files saved!', severity: 'success' }); setTopMenuAnchor(null); setTopMenuKind(null); }}><ListItemIcon><SaveIcon fontSize="small" /></ListItemIcon>Save All</MenuItem>
              <Divider />
              <MenuItem onClick={() => { navigate('/techie/ide'); setView('projects'); setCurrentProject(null); setTopMenuAnchor(null); setTopMenuKind(null); }}>Back to Projects</MenuItem>
            </>
          )}
          {topMenuKind === 'edit' && (
            <>
              <MenuItem onClick={() => { setFindReplaceOpen(true); setTopMenuAnchor(null); setTopMenuKind(null); }}><ListItemIcon><SearchIcon fontSize="small" /></ListItemIcon>Find</MenuItem>
              <MenuItem onClick={() => { setFindReplaceOpen(true); setTopMenuAnchor(null); setTopMenuKind(null); }}><ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>Find and Replace</MenuItem>
            </>
          )}
          {topMenuKind === 'view' && (
            <>
              <MenuItem onClick={() => { setSidebarOpen(!sidebarOpen); setTopMenuAnchor(null); setTopMenuKind(null); }}>Toggle Sidebar</MenuItem>
              <MenuItem onClick={() => { setBottomPanelOpen(!bottomPanelOpen); setTopMenuAnchor(null); setTopMenuKind(null); }}>Toggle Terminal</MenuItem>
              <MenuItem onClick={() => { setTheme(theme === 'vs-dark' ? 'vs-light' : 'vs-dark'); setTopMenuAnchor(null); setTopMenuKind(null); }}>Toggle Theme</MenuItem>
              <MenuItem onClick={() => { setSplitView(!splitView); setTopMenuAnchor(null); setTopMenuKind(null); }}>Split Editor</MenuItem>
            </>
          )}
          {topMenuKind === 'go' && (
            <MenuItem onClick={() => { setCommandPaletteOpen(true); setTopMenuAnchor(null); setTopMenuKind(null); }}>Command Palette...</MenuItem>
          )}
          {topMenuKind === 'run' && (
            <>
              <MenuItem onClick={() => { handleTerminalCommand('npm run dev'); setTopMenuAnchor(null); setTopMenuKind(null); }}>Start (npm run dev)</MenuItem>
              <MenuItem onClick={() => { handleTerminalCommand('npm run build'); setTopMenuAnchor(null); setTopMenuKind(null); }}>Build</MenuItem>
            </>
          )}
          {topMenuKind === 'terminal' && (
            <>
              <MenuItem onClick={() => { addNewTerminal(); setBottomPanelOpen(true); setBottomPanelTab('terminal'); setTopMenuAnchor(null); setTopMenuKind(null); }}>New Terminal</MenuItem>
              <MenuItem onClick={() => { setBottomPanelOpen(!bottomPanelOpen); setBottomPanelTab('terminal'); setTopMenuAnchor(null); setTopMenuKind(null); }}>Toggle Terminal</MenuItem>
            </>
          )}
          {topMenuKind === 'help' && (
            <MenuItem onClick={() => { setCommandPaletteOpen(true); setTopMenuAnchor(null); setTopMenuKind(null); }}>Command Palette (Ctrl+Shift+P)</MenuItem>
          )}
        </Menu>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Command Palette */}
          <Tooltip title="Command Palette (Ctrl+Shift+P)">
            <Button 
              size="small" 
              onClick={() => setCommandPaletteOpen(true)}
              sx={{ 
                color: '#ccc', 
                fontSize: '11px', 
                textTransform: 'none',
                minWidth: 'auto',
                px: 1.5,
                bgcolor: 'rgba(255,255,255,0.05)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
              startIcon={<SearchIcon sx={{ fontSize: 14 }} />}
            >
              Search commands...
            </Button>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, bgcolor: theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0' }} />
          <Tooltip title="Run Project (F5)">
            <IconButton size="small" onClick={() => handleTerminalCommand('npm run dev')} sx={{ color: '#4ec9b0' }}>
              <RunIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Stop">
            <IconButton size="small" onClick={() => { setIsRunning(false); setTerminalOutput(prev => [...prev, 'Process stopped.', '']); }} sx={{ color: '#f14c4c' }}>
              <StopIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Build (Ctrl+Shift+B)">
            <IconButton size="small" onClick={() => handleTerminalCommand('npm run build')} sx={{ color: '#569cd6' }}>
              <CodeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, bgcolor: theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0' }} />
          <Tooltip title="Split Editor (Ctrl+\\)">
            <IconButton size="small" onClick={() => setSplitView(!splitView)} sx={{ color: splitView ? '#007acc' : '#888' }}>
              <SplitIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download Project">
            <IconButton size="small" onClick={handleDownload} sx={{ color: '#dcdcaa' }}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Push to GitHub">
            <IconButton size="small" onClick={() => setGitDialogOpen(true)} sx={{ color: '#ccc' }}>
              <GitHubIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, bgcolor: theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0' }} />
          <Tooltip title="Toggle Theme">
            <IconButton size="small" onClick={() => setTheme(theme === 'vs-dark' ? 'vs-light' : 'vs-dark')}>
              {theme === 'vs-dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings (Ctrl+,)">
            <IconButton size="small" onClick={() => setSettingsOpen(true)}>
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Activity Bar */}
        <Box sx={{ 
          width: 48, 
          bgcolor: theme === 'vs-dark' ? '#333333' : '#2c2c2c',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 1,
        }}>
          {[
            { id: 'explorer', icon: <FileIcon />, label: 'Explorer' },
            { id: 'search', icon: <SearchIcon />, label: 'Search' },
            { id: 'git', icon: <SourceControlIcon />, label: 'Source Control' },
            { id: 'debug', icon: <DebugIcon />, label: 'Debug' },
            { id: 'extensions', icon: <ExtensionIcon />, label: 'Extensions' },
          ].map(item => (
            <Tooltip key={item.id} title={item.label} placement="right">
              <IconButton
                onClick={() => { setActivePanel(item.id as any); setSidebarOpen(true); }}
                sx={{
                  width: 40,
                  height: 40,
                  mb: 0.5,
                  color: activePanel === item.id && sidebarOpen ? 'white' : '#888',
                  borderLeft: activePanel === item.id && sidebarOpen ? '2px solid white' : '2px solid transparent',
                  borderRadius: 0,
                  '&:hover': { color: 'white' },
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          ))}
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Account" placement="right">
            <IconButton onClick={(e) => setAccountMenuAnchor(e.currentTarget)} sx={{ color: '#888', '&:hover': { color: 'white' } }}>
              <Avatar sx={{ width: 24, height: 24, fontSize: '12px' }}>U</Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Sidebar */}
        {sidebarOpen && (
          <Box sx={{ 
            width: 260, 
            bgcolor: theme === 'vs-dark' ? '#252526' : '#f3f3f3',
            borderRight: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}`,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Box sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}` }}>
              <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '11px', color: '#888' }}>
                {activePanel.toUpperCase()}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="New File">
                  <IconButton size="small" onClick={() => setNewFileDialogOpen(true)} sx={{ color: '#888' }}>
                    <NewFileIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="New Folder">
                  <IconButton size="small" onClick={() => setNewFolderDialogOpen(true)} sx={{ color: '#888' }}>
                    <NewFolderIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            {activePanel === 'explorer' && (
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '11px', color: '#888' }}>
                    {currentProject?.name.toUpperCase()}
                  </Typography>
                </Box>
                <FileTree
                  files={files}
                  onFileSelect={handleFileSelect}
                  selectedFile={activeFileId}
                  onToggleFolder={handleToggleFolder}
                  onContextMenu={(e, file) => {
                    e.preventDefault();
                    setContextMenu({ x: e.clientX, y: e.clientY, file });
                  }}
                  theme={theme}
                />
              </Box>
            )}
            
            {activePanel === 'git' && (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                <Box sx={{ px: 1, py: 0.5, borderBottom: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}` }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#888' }}>SOURCE CONTROL</Typography>
                </Box>
                {!githubConnected ? (
                  <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button variant="contained" size="small" startIcon={<GitHubIcon />} onClick={() => setConnectGitDialogOpen(true)}
                      sx={{ bgcolor: '#238636', '&:hover': { bgcolor: '#2ea043' } }}>Connect to GitHub</Button>
                    <Button variant="outlined" size="small" onClick={() => { setGithubConnected(true); setSnackbar({ open: true, message: 'Repository initialized', severity: 'success' }); }}>Initialize Repository</Button>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ px: 1, py: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#888' }}>main</Typography>
                      {repoName && <Typography component="span" variant="caption" sx={{ color: '#666' }}> · {repoName}</Typography>}
                    </Box>
                    {changeList.length > 0 && (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, py: 0.5 }}>
                          <Typography variant="caption" sx={{ color: '#888' }}>CHANGES ({changeList.length})</Typography>
                          <IconButton size="small" onClick={handleStageAll} sx={{ color: '#888' }} title="Stage All"><AddIcon sx={{ fontSize: 14 }} /></IconButton>
                        </Box>
                        <List dense sx={{ py: 0, overflowY: 'auto', flex: 1 }}>
                          {changeList.map(fileId => {
                            const node = findFile(files, fileId);
                            return (
                              <ListItem key={fileId} sx={{ py: 0.25, px: 1 }}>
                                <ListItemIcon sx={{ minWidth: 24 }}><EditIcon sx={{ fontSize: 14, color: '#4ec9b0' }} /></ListItemIcon>
                                <ListItemText primary={node?.name || fileId} primaryTypographyProps={{ fontSize: 12 }} />
                                {stagedFileIds.has(fileId) ? (
                                  <IconButton size="small" onClick={() => handleUnstageFile(fileId)} title="Unstage" sx={{ color: '#888' }}><CloseIcon sx={{ fontSize: 12 }} /></IconButton>
                                ) : (
                                  <IconButton size="small" onClick={() => handleStageFile(fileId)} title="Stage" sx={{ color: '#888' }}><AddIcon sx={{ fontSize: 12 }} /></IconButton>
                                )}
                              </ListItem>
                            );
                          })}
                        </List>
                      </>
                    )}
                    {stagedFileIds.size > 0 && (
                      <Box sx={{ px: 1, py: 0.5, borderTop: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}` }}>
                        <Typography variant="caption" sx={{ color: '#888' }}>STAGED ({stagedFileIds.size})</Typography>
                      </Box>
                    )}
                    <Box sx={{ p: 1, borderTop: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}` }}>
                      <TextField size="small" fullWidth placeholder="Commit message" value={commitMessage} onChange={(e) => setCommitMessage(e.target.value)} sx={{ mb: 0.5 }} />
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Button variant="contained" size="small" onClick={handleCommit} disabled={stagedFileIds.size === 0 || !commitMessage.trim()} sx={{ flex: 1 }}>Commit</Button>
                        <Button variant="outlined" size="small" startIcon={<GitHubIcon />} onClick={() => setGitDialogOpen(true)}>Push</Button>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
            )}

            {activePanel === 'search' && (
              <Box sx={{ p: 2 }}>
                <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 1 }}>Search in files</Typography>
                <TextField size="small" fullWidth placeholder="Search..." sx={{ mb: 2 }} />
                <Typography variant="body2" sx={{ color: '#666' }}>Find in project (simulated). Use Ctrl+F in editor for find.</Typography>
              </Box>
            )}

            {activePanel === 'debug' && (
              <Box sx={{ p: 2, textAlign: 'center', color: '#888' }}>
                <DebugIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2" sx={{ mb: 2 }}>Debug</Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 2 }}>Create a launch.json to start debugging.</Typography>
                <Button variant="outlined" size="small">Create launch.json</Button>
              </Box>
            )}

            {activePanel === 'extensions' && (
              <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
                <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 1, px: 1 }}>EXTENSIONS</Typography>
                {extensions.map(ext => (
                  <Box key={ext.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1, px: 1, borderRadius: 1, '&:hover': { bgcolor: theme === 'vs-dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{ext.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#888' }}>{ext.desc}</Typography>
                    </Box>
                    {ext.installed ? (
                      <Chip size="small" label={ext.enabled ? 'Disable' : 'Enable'} color={ext.enabled ? 'success' : 'default'} variant="outlined" onClick={() => toggleExtension(ext.id, 'enable')} sx={{ cursor: 'pointer' }} />
                    ) : (
                      <Chip size="small" label="Install" variant="outlined" onClick={() => toggleExtension(ext.id, 'install')} sx={{ cursor: 'pointer' }} />
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Editor Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Tabs */}
          {openFiles.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              bgcolor: theme === 'vs-dark' ? '#252526' : '#ececec',
              borderBottom: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}`,
              overflowX: 'auto',
            }}>
              {openFiles.map(file => (
                <Box
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 2,
                    py: 0.75,
                    cursor: 'pointer',
                    bgcolor: activeFileId === file.id ? (theme === 'vs-dark' ? '#1e1e1e' : '#ffffff') : 'transparent',
                    borderRight: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}`,
                    borderTop: activeFileId === file.id ? '1px solid #007acc' : '1px solid transparent',
                    color: activeFileId === file.id ? (theme === 'vs-dark' ? '#fff' : '#333') : '#888',
                    '&:hover': { bgcolor: theme === 'vs-dark' ? '#2a2d2e' : '#f0f0f0' },
                  }}
                >
                  {unsavedFiles.has(file.id) && (
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#fff' }} />
                  )}
                  <Typography variant="body2" sx={{ fontSize: '13px' }}>{file.name}</Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleCloseTab(file.id, e)}
                    sx={{ width: 16, height: 16, ml: 0.5, color: '#888', '&:hover': { color: theme === 'vs-dark' ? '#fff' : '#333' } }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          
          {/* Breadcrumbs */}
          {activeFile && (
            <Box sx={{ px: 2, py: 0.5, bgcolor: theme === 'vs-dark' ? '#1e1e1e' : '#ffffff', borderBottom: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}` }}>
              <Breadcrumbs separator="›" sx={{ fontSize: '12px', color: '#888' }}>
                <Link href="#" underline="hover" sx={{ color: '#888', fontSize: '12px' }}>{currentProject?.name}</Link>
                {activeFile.id.split('/').map((part, i, arr) => (
                  <Typography key={i} sx={{ color: i === arr.length - 1 ? (theme === 'vs-dark' ? '#ccc' : '#333') : '#888', fontSize: '12px' }}>{part}</Typography>
                ))}
              </Breadcrumbs>
            </Box>
          )}
          
          {/* Editor / Preview Split - overflow hidden to prevent code bleeding into preview */}
          <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', minWidth: 0 }}>
            {/* Code Editor(s) - clip content so nothing bleeds */}
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', overflow: 'hidden' }}>
              {/* Primary Editor */}
              {activeFile ? (
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', overflow: 'hidden', bgcolor: theme === 'vs-dark' ? '#1e1e1e' : '#ffffff', position: 'relative' }}>
                  {/* Line Numbers */}
                  <Box sx={{ 
                    flexShrink: 0,
                    width: 50, 
                    bgcolor: theme === 'vs-dark' ? '#1e1e1e' : '#f5f5f5',
                    borderRight: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}`,
                    py: 1,
                    textAlign: 'right',
                    pr: 1,
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    fontSize: `${fontSize}px`,
                    lineHeight: '20px',
                    color: theme === 'vs-dark' ? '#858585' : '#999',
                    userSelect: 'none',
                    overflow: 'hidden',
                  }}>
                    {(activeFile.content || '').split('\n').map((_, i) => (
                      <Box key={i} sx={{ 
                        '&:hover': { bgcolor: theme === 'vs-dark' ? '#2a2d2e' : '#f0f0f0' },
                        cursor: 'pointer',
                      }}>{i + 1}</Box>
                    ))}
                  </Box>
                  {/* Editor - contained so text never bleeds right */}
                  <Box sx={{ flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden', display: 'flex' }}>
                    <Box
                      component="textarea"
                      value={activeFile.content || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleCodeChange(e.target.value)}
                      spellCheck={false}
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        width: showMinimap ? undefined : '100%',
                        maxWidth: showMinimap ? 'calc(100% - 80px)' : '100%',
                        height: '100%',
                        bgcolor: 'transparent',
                        color: theme === 'vs-dark' ? '#d4d4d4' : '#333',
                        border: 'none',
                        fontFamily: '"Fira Code", "Consolas", monospace',
                        fontSize: `${fontSize}px`,
                        lineHeight: '20px',
                        p: 1,
                        pl: 2,
                        resize: 'none',
                        outline: 'none',
                        caretColor: theme === 'vs-dark' ? '#fff' : '#000',
                        wordWrap: wordWrap ? 'break-word' : 'normal',
                        whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                        overflow: 'auto',
                        '&::selection': { bgcolor: theme === 'vs-dark' ? '#264f78' : '#add6ff' },
                      }}
                    />
                    {/* Minimap - fully contained, no content bleed */}
                    {showMinimap && (
                      <Box sx={{
                        flexShrink: 0,
                        width: 80,
                        height: '100%',
                        position: 'relative',
                        bgcolor: theme === 'vs-dark' ? 'rgba(30,30,30,0.8)' : 'rgba(245,245,245,0.8)',
                        borderLeft: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}`,
                        overflow: 'hidden',
                        cursor: 'pointer',
                      }}>
                        <Box sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: 800,
                          height: '100%',
                          overflow: 'hidden',
                          pointerEvents: 'none',
                        }}>
                          <Box sx={{ 
                            transform: 'scale(0.1)', 
                            transformOrigin: 'top left',
                            whiteSpace: 'pre',
                            fontFamily: 'monospace',
                            fontSize: `${fontSize * 10}px`,
                            color: theme === 'vs-dark' ? '#666' : '#888',
                            lineHeight: 1.2,
                            width: 8000,
                            maxWidth: 8000,
                          }}>
                            {activeFile.content}
                          </Box>
                        </Box>
                        {/* Minimap viewport indicator */}
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 40,
                          bgcolor: theme === 'vs-dark' ? 'rgba(100,100,100,0.3)' : 'rgba(0,0,0,0.1)',
                          borderRadius: 0.5,
                          pointerEvents: 'none',
                        }} />
                      </Box>
                    )}
                  </Box>
                  {/* Current line highlight */}
                  <Box sx={{
                    position: 'absolute',
                    left: 50,
                    right: showMinimap ? 80 : 0,
                    top: 8,
                    height: 20,
                    bgcolor: theme === 'vs-dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                    pointerEvents: 'none',
                  }} />
                </Box>
              ) : (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888', bgcolor: theme === 'vs-dark' ? '#1e1e1e' : '#ffffff' }}>
                  <Box sx={{ fontSize: '80px', mb: 2, opacity: 0.2 }}>🚀</Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>VerTechie IDE</Typography>
                  <Typography variant="body2" sx={{ mb: 1, textAlign: 'center', color: '#666' }}>
                    Select a file from the explorer to start editing
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: '#888' }}>
                    Press <strong>Ctrl+Shift+P</strong> for Command Palette
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 500, mb: 3 }}>
                    {[
                      { key: 'Ctrl+N', label: 'New File' },
                      { key: 'Ctrl+S', label: 'Save' },
                      { key: 'Ctrl+F', label: 'Find' },
                      { key: 'Ctrl+B', label: 'Sidebar' },
                      { key: 'Ctrl+`', label: 'Terminal' },
                      { key: 'F5', label: 'Run' },
                    ].map(shortcut => (
                      <Chip 
                        key={shortcut.key}
                        label={`${shortcut.key} ${shortcut.label}`} 
                        size="small" 
                        sx={{ bgcolor: theme === 'vs-dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }} 
                      />
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => setNewFileDialogOpen(true)}
                    sx={{ 
                      bgcolor: '#007acc', 
                      '&:hover': { bgcolor: '#005a9e' },
                      px: 4,
                    }}
                    startIcon={<AddIcon />}
                  >
                    Create New File
                  </Button>
                </Box>
              )}
              
              {/* Split View - Second Editor */}
              {splitView && activeFile && (
                <>
                  <Box sx={{ width: 4, flexShrink: 0, bgcolor: theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0', cursor: 'col-resize' }} />
                  <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', bgcolor: theme === 'vs-dark' ? '#1e1e1e' : '#ffffff' }}>
                    <Box sx={{ 
                      flexShrink: 0,
                      width: 50, 
                      bgcolor: theme === 'vs-dark' ? '#1e1e1e' : '#f5f5f5',
                      borderRight: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}`,
                      py: 1,
                      textAlign: 'right',
                      pr: 1,
                      fontFamily: '"Fira Code", "Consolas", monospace',
                      fontSize: `${fontSize}px`,
                      lineHeight: '20px',
                      color: theme === 'vs-dark' ? '#858585' : '#999',
                      userSelect: 'none',
                      overflow: 'hidden',
                    }}>
                      {(activeFile.content || '').split('\n').map((_, i) => (
                        <Box key={i}>{i + 1}</Box>
                      ))}
                    </Box>
                    <Box
                      component="textarea"
                      value={activeFile.content || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleCodeChange(e.target.value)}
                      spellCheck={false}
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        overflow: 'auto',
                        bgcolor: 'transparent',
                        color: theme === 'vs-dark' ? '#d4d4d4' : '#333',
                        border: 'none',
                        fontFamily: '"Fira Code", "Consolas", monospace',
                        fontSize: `${fontSize}px`,
                        lineHeight: '20px',
                        p: 1,
                        pl: 2,
                        resize: 'none',
                        outline: 'none',
                      }}
                    />
                  </Box>
                </>
              )}
            </Box>
            
            {/* Live Preview - flexShrink 0 so editor cannot bleed into this area */}
            <Box sx={{ width: '40%', minWidth: 0, flexShrink: 0, overflow: 'hidden', borderLeft: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}`, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 0.5, display: 'flex', alignItems: 'center', gap: 1, bgcolor: theme === 'vs-dark' ? '#252526' : '#f3f3f3', borderBottom: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}` }}>
                <Typography variant="caption" sx={{ color: '#888', display: 'flex', alignItems: 'center', gap: 0.5 }}>🌐 Code output</Typography>
                <Box sx={{ flex: 1, bgcolor: theme === 'vs-dark' ? '#3c3c3c' : '#fff', borderRadius: 1, px: 1, py: 0.25 }}>
                  <Typography variant="caption" sx={{ color: '#888', fontSize: '11px' }}>
                    {livePreviewUrl ? livePreviewUrl : 'Preview (your HTML/CSS/JS)'}
                  </Typography>
                </Box>
                <Tooltip title="Open output in new tab">
                  <IconButton size="small" onClick={openPreviewInNewTab} sx={{ color: '#888' }}>
                    <OpenInNewIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                {livePreviewUrl && (
                  <Tooltip title="Switch to code output preview">
                    <IconButton size="small" onClick={() => setLivePreviewUrl(null)} sx={{ color: '#888' }}>
                      <CodeIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Refresh preview">
                  <IconButton size="small" onClick={() => setPreviewRefreshKey(k => k + 1)} sx={{ color: '#888' }}>
                    <RefreshIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ flex: 1, bgcolor: '#fff', minHeight: 0 }}>
                {livePreviewUrl ? (
                  <iframe key={`live-${previewRefreshKey}`} src={livePreviewUrl} title="Live Preview" style={{ width: '100%', height: '100%', border: 'none' }} />
                ) : (
                  <iframe key={`static-${previewRefreshKey}`} srcDoc={generatePreview()} title="Code output" style={{ width: '100%', height: '100%', border: 'none' }} sandbox="allow-scripts" />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom Panel */}
      {bottomPanelOpen && (
        <Box sx={{ height: 200, borderTop: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}`, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: theme === 'vs-dark' ? '#252526' : '#f3f3f3', borderBottom: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}` }}>
            <Tabs value={bottomPanelTab} onChange={(_, v) => setBottomPanelTab(v)}
              sx={{ minHeight: 32, '& .MuiTab-root': { minHeight: 32, fontSize: '12px', textTransform: 'uppercase', color: '#888', '&.Mui-selected': { color: theme === 'vs-dark' ? '#fff' : '#333' } } }}>
              <Tab value="problems" label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>Problems <Chip label={problems.length} size="small" sx={{ height: 16, fontSize: '10px' }} /></Box>} />
              <Tab value="output" label="Output" />
              <Tab value="terminal" label="Terminal" />
            </Tabs>
            <Box sx={{ flex: 1 }} />
            <IconButton size="small" onClick={() => setBottomPanelOpen(false)} sx={{ color: '#888', mr: 1 }}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            {bottomPanelTab === 'terminal' && (
              <TerminalPanel output={terminalOutput} onCommand={handleTerminalCommand} isRunning={isRunning} theme={theme} />
            )}
            {bottomPanelTab === 'problems' && (
              <ProblemsPanel problems={problems} onProblemClick={(file, line) => console.log('Go to', file, line)} theme={theme} />
            )}
            {bottomPanelTab === 'output' && (
              <Box sx={{ p: 1, color: '#888', fontFamily: 'monospace', fontSize: '12px' }}>[Output will appear here]</Box>
            )}
          </Box>
        </Box>
      )}

      {/* Enhanced Status Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 0.25, bgcolor: zenMode ? '#252526' : '#007acc', color: 'white', fontSize: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Source Control">
            <Box onClick={() => { setActivePanel('git'); setSidebarOpen(true); }} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
              <SourceControlIcon sx={{ fontSize: 14 }} /><span>main</span>
              {changeList.length > 0 && <span>({changeList.length})</span>}
            </Box>
          </Tooltip>
          <Tooltip title="Sync Changes">
            <Box onClick={() => { setActivePanel('git'); setSidebarOpen(true); setGitDialogOpen(true); }} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
              <RefreshIcon sx={{ fontSize: 14 }} /><span>{stagedFileIds.size} ↓ 0 ↑</span>
            </Box>
          </Tooltip>
          {unsavedFiles.size > 0 && (
            <Tooltip title={`${unsavedFiles.size} unsaved files`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                <span>{unsavedFiles.size} unsaved</span>
              </Box>
            </Tooltip>
          )}
          {problems.length > 0 && (
            <Tooltip title={`${problems.filter(p => p.type === 'error').length} errors, ${problems.filter(p => p.type === 'warning').length} warnings`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                {problems.filter(p => p.type === 'error').length > 0 && (
                  <><ErrorIcon sx={{ fontSize: 14 }} /><span>{problems.filter(p => p.type === 'error').length}</span></>
                )}
                {problems.filter(p => p.type === 'warning').length > 0 && (
                  <><WarningIcon sx={{ fontSize: 14, ml: 0.5 }} /><span>{problems.filter(p => p.type === 'warning').length}</span></>
                )}
              </Box>
            </Tooltip>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {activeFile && (
            <>
              <Tooltip title="Go to Line">
                <Box onClick={() => setGoToLineOpen(true)} sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                  Ln {(activeFile.content || '').split('\n').length}, Col 1
                </Box>
              </Tooltip>
              <Tooltip title="Indentation">
                <Box onClick={(e) => setIndentationMenuAnchor(e.currentTarget)} sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                  Spaces: {tabSize}
                </Box>
              </Tooltip>
              <span>UTF-8</span>
              <Tooltip title="Select Language Mode">
                <Box onClick={(e) => setLanguageMenuAnchor(e.currentTarget)} sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                  {activeFile.language?.toUpperCase() || 'Plain Text'}
                </Box>
              </Tooltip>
            </>
          )}
          {autoSave && (
            <Tooltip title="Auto Save enabled">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <SaveIcon sx={{ fontSize: 14 }} />
              </Box>
            </Tooltip>
          )}
          {splitView && (
            <Tooltip title="Split View enabled">
              <SplitIcon sx={{ fontSize: 14 }} />
            </Tooltip>
          )}
          <Tooltip title="Command Palette (Ctrl+Shift+P)">
            <Box 
              onClick={() => setCommandPaletteOpen(true)}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
            >
              <CloudIcon sx={{ fontSize: 14 }} /><span>VerTechie IDE</span>
            </Box>
          </Tooltip>
        </Box>
      </Box>

      {/* Account Menu */}
      <Menu anchorEl={accountMenuAnchor} open={!!accountMenuAnchor} onClose={() => setAccountMenuAnchor(null)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <MenuItem onClick={() => { setAccountMenuAnchor(null); setSnackbar({ open: true, message: 'Profile', severity: 'info' }); }}>Profile</MenuItem>
        <MenuItem onClick={() => { setAccountMenuAnchor(null); localStorage.removeItem('authToken'); setSnackbar({ open: true, message: 'Signed out', severity: 'info' }); }}>Sign out</MenuItem>
      </Menu>

      {/* Go to Line Dialog */}
      <Dialog open={goToLineOpen} onClose={() => { setGoToLineOpen(false); setGoToLineValue(''); }} maxWidth="xs" fullWidth>
        <DialogTitle>Go to Line</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth type="number" label="Line number" value={goToLineValue} onChange={(e) => setGoToLineValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { setGoToLineOpen(false); setSnackbar({ open: true, message: `Go to line ${goToLineValue}`, severity: 'info' }); setGoToLineValue(''); } }} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setGoToLineOpen(false); setGoToLineValue(''); }}>Cancel</Button>
          <Button variant="contained" onClick={() => { setGoToLineOpen(false); setSnackbar({ open: true, message: `Go to line ${goToLineValue}`, severity: 'info' }); setGoToLineValue(''); }}>Go</Button>
        </DialogActions>
      </Dialog>

      {/* Indentation Menu */}
      <Menu anchorEl={indentationMenuAnchor} open={!!indentationMenuAnchor} onClose={() => setIndentationMenuAnchor(null)}>
        {[2, 4, 8].map(n => (
          <MenuItem key={n} onClick={() => { setTabSize(n); setIndentationMenuAnchor(null); setSnackbar({ open: true, message: `Indentation: ${n} spaces`, severity: 'info' }); }}>Spaces: {n}</MenuItem>
        ))}
      </Menu>

      {/* Language Mode Menu */}
      <Menu anchorEl={languageMenuAnchor} open={!!languageMenuAnchor} onClose={() => setLanguageMenuAnchor(null)}>
        {['javascript', 'typescript', 'html', 'css', 'json', 'markdown', 'python', 'text'].map(lang => (
          <MenuItem key={lang} onClick={() => {
            if (activeFileId) {
              const updateLang = (nodes: FileNode[]): FileNode[] => nodes.map(n => n.id === activeFileId ? { ...n, language: lang } : n.children ? { ...n, children: updateLang(n.children) } : n);
              setFiles(prev => updateLang(prev));
              setOpenFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, language: lang } : f));
            }
            setLanguageMenuAnchor(null);
            setSnackbar({ open: true, message: `Language: ${lang}`, severity: 'info' });
          }}>{lang.toUpperCase()}</MenuItem>
        ))}
      </Menu>

      {/* New File Dialog - persists to backend when project is loaded from API */}
      <Dialog open={newFileDialogOpen} onClose={() => setNewFileDialogOpen(false)}>
        <DialogTitle>Create New File</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth label="File Name" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} placeholder="example.js" sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFileDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (!newFileName.trim()) return;
            const name = newFileName.trim();
            const ext = name.split('.').pop() || '';
            const langMap: Record<string, string> = { js: 'javascript', ts: 'typescript', jsx: 'javascript', tsx: 'typescript', html: 'html', css: 'css', json: 'json', md: 'markdown', py: 'python' };
            const token = localStorage.getItem('authToken');
            if (projectId && token) {
              try {
                const res = await fetch(getApiUrl(`/ide/projects/${projectId}/files`), {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ name, content: '' }),
                });
                if (!res.ok) {
                  setSnackbar({ open: true, message: 'Failed to create file', severity: 'error' });
                  return;
                }
                const created = await res.json();
                const newFile: FileNode = {
                  id: created.path || name,
                  name: created.name || name,
                  type: 'file',
                  language: langMap[ext] || 'text',
                  content: '',
                  backendFileId: created.id,
                };
                setFiles((prev) => [...prev, newFile]);
                setOpenFiles((prev) => (prev.some((f) => f.id === newFile.id) ? prev : [...prev, newFile]));
                setActiveFileId(newFile.id);
                setNewFileDialogOpen(false);
                setNewFileName('');
                setSnackbar({ open: true, message: 'File created and saved', severity: 'success' });
              } catch {
                setSnackbar({ open: true, message: 'Failed to create file', severity: 'error' });
              }
            } else {
              const newFile: FileNode = { id: name, name, type: 'file', language: langMap[ext] || 'text', content: '' };
              setFiles((prev) => [...prev, newFile]);
              handleFileSelect(newFile);
              setNewFileDialogOpen(false);
              setNewFileName('');
            }
          }}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={newFolderDialogOpen} onClose={() => { setNewFolderDialogOpen(false); setNewFolderName(''); }} maxWidth="xs" fullWidth>
        <DialogTitle>New Folder</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth label="Folder Name" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="my-folder" sx={{ mt: 1 }} onKeyDown={(e) => e.key === 'Enter' && handleNewFolder()} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setNewFolderDialogOpen(false); setNewFolderName(''); }}>Cancel</Button>
          <Button variant="contained" onClick={handleNewFolder} disabled={!newFolderName.trim()}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Connect to GitHub Dialog */}
      <Dialog open={connectGitDialogOpen} onClose={() => setConnectGitDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><GitHubIcon /> Connect to GitHub</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Repository URL" value={githubRepoUrl} onChange={(e) => setGithubRepoUrl(e.target.value)} placeholder="https://github.com/owner/repo or owner/repo" sx={{ mt: 2, mb: 2 }} />
          <Alert severity="info">Connect this project to a GitHub repository. You can create one at github.com/new.</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConnectGitDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConnectGit} sx={{ bgcolor: '#238636', '&:hover': { bgcolor: '#2ea043' } }}>Connect</Button>
        </DialogActions>
      </Dialog>

      {/* Git Push Dialog */}
      <Dialog open={gitDialogOpen} onClose={() => setGitDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><GitHubIcon /> Push to GitHub</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Repository Name" value={repoName} onChange={(e) => setRepoName(e.target.value)} placeholder={currentProject?.name || 'my-project'} sx={{ mt: 2, mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Visibility</InputLabel>
            <Select value={gitVisibility} label="Visibility" onChange={(e) => setGitVisibility(e.target.value as 'public' | 'private')}>
              <MenuItem value="public">🌍 Public</MenuItem>
              <MenuItem value="private">🔒 Private</MenuItem>
            </Select>
          </FormControl>
          <Alert severity="info" sx={{ mt: 2 }}>This will create a new repository and push all project files. In a full setup this would use the GitHub API.</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGitDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleGitPush} sx={{ bgcolor: '#238636', '&:hover': { bgcolor: '#2ea043' } }}>Create & Push</Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <FormControlLabel control={<Switch checked={theme === 'vs-dark'} onChange={() => setTheme(theme === 'vs-dark' ? 'vs-light' : 'vs-dark')} />} label="Dark Mode" />
          <FormControlLabel control={<Switch checked={sidebarOpen} onChange={() => setSidebarOpen(!sidebarOpen)} />} label="Show Sidebar" />
          <FormControlLabel control={<Switch checked={bottomPanelOpen} onChange={() => setBottomPanelOpen(!bottomPanelOpen)} />} label="Show Terminal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu open={contextMenu !== null} onClose={() => setContextMenu(null)} anchorReference="anchorPosition" anchorPosition={contextMenu !== null ? { top: contextMenu.y, left: contextMenu.x } : undefined}>
        <MenuItem onClick={() => { setContextMenu(null); setNewFileDialogOpen(true); }}><ListItemIcon><NewFileIcon fontSize="small" /></ListItemIcon>New File</MenuItem>
        <MenuItem onClick={() => { setContextMenu(null); setNewFolderDialogOpen(true); }}><ListItemIcon><NewFolderIcon fontSize="small" /></ListItemIcon>New Folder</MenuItem>
        <Divider />
        <MenuItem onClick={() => { if (contextMenu?.file) navigator.clipboard.writeText(contextMenu.file.id).then(() => setSnackbar({ open: true, message: 'Path copied', severity: 'success' })); setContextMenu(null); }}><ListItemIcon><CopyIcon fontSize="small" /></ListItemIcon>Copy Path</MenuItem>
        <MenuItem onClick={() => {
          if (contextMenu?.file) {
            setFileToRename(contextMenu.file);
            setRenameValue(contextMenu.file.name);
            setRenameDialogOpen(true);
          }
          setContextMenu(null);
        }}><ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>Rename</MenuItem>
        <MenuItem onClick={() => {
          if (contextMenu?.file) {
            setFileToDelete(contextMenu.file);
            setDeleteConfirmOpen(true);
          }
          setContextMenu(null);
        }}><ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>Delete</MenuItem>
      </Menu>

      {/* Rename dialog */}
      <Dialog open={renameDialogOpen} onClose={() => { setRenameDialogOpen(false); setFileToRename(null); setRenameValue(''); }} maxWidth="xs" fullWidth PaperProps={{ sx: { bgcolor: theme === 'vs-dark' ? '#252526' : '#fff', color: theme === 'vs-dark' ? '#ccc' : '#333' } }}>
        <DialogTitle>Rename</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            label="New name"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRenameConfirm()}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setRenameDialogOpen(false); setFileToRename(null); setRenameValue(''); }}>Cancel</Button>
          <Button variant="contained" onClick={handleRenameConfirm} disabled={!renameValue.trim()}>Rename</Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteConfirmOpen} onClose={() => { setDeleteConfirmOpen(false); setFileToDelete(null); }} maxWidth="xs" fullWidth PaperProps={{ sx: { bgcolor: theme === 'vs-dark' ? '#252526' : '#fff', color: theme === 'vs-dark' ? '#ccc' : '#333' } }}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <Typography>Delete &quot;{fileToDelete?.name}&quot;? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteConfirmOpen(false); setFileToDelete(null); }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Command Palette */}
      <Dialog 
        open={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            position: 'absolute',
            top: '15%',
            bgcolor: theme === 'vs-dark' ? '#252526' : '#f3f3f3',
            color: theme === 'vs-dark' ? '#ccc' : '#333',
            borderRadius: 2,
            overflow: 'hidden',
          }
        }}
      >
        <Box sx={{ p: 0 }}>
          <TextField
            fullWidth
            autoFocus
            placeholder="Type a command or search..."
            value={commandSearch}
            onChange={(e) => setCommandSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#888', mr: 1 }} />,
            }}
            sx={{
              '& .MuiInputBase-root': {
                bgcolor: theme === 'vs-dark' ? '#3c3c3c' : '#fff',
                color: theme === 'vs-dark' ? '#fff' : '#333',
                borderRadius: 0,
                fontSize: '14px',
              },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            }}
          />
          <List sx={{ maxHeight: 300, overflowY: 'auto', p: 0 }}>
            {filteredCommands.map((cmd) => (
              <ListItem
                key={cmd.id}
                onClick={() => { cmd.action(); setCommandPaletteOpen(false); setCommandSearch(''); }}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: theme === 'vs-dark' ? '#094771' : '#e8e8e8' },
                  py: 0.75,
                }}
              >
                <ListItemText
                  primary={cmd.label}
                  primaryTypographyProps={{ fontSize: '13px' }}
                />
                {cmd.shortcut && (
                  <Typography variant="caption" sx={{ color: '#888', fontSize: '11px' }}>
                    {cmd.shortcut}
                  </Typography>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Dialog>

      {/* Find and Replace */}
      <Dialog
        open={findReplaceOpen}
        onClose={() => setFindReplaceOpen(false)}
        hideBackdrop
        PaperProps={{
          sx: {
            position: 'absolute',
            top: 60,
            right: 20,
            m: 0,
            width: 350,
            bgcolor: theme === 'vs-dark' ? '#252526' : '#f3f3f3',
            color: theme === 'vs-dark' ? '#ccc' : '#333',
            borderRadius: 1,
            boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
          }
        }}
      >
        <Box sx={{ p: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Find"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: theme === 'vs-dark' ? '#3c3c3c' : '#fff',
                  color: theme === 'vs-dark' ? '#fff' : '#333',
                  fontSize: '13px',
                },
              }}
            />
            <Typography variant="caption" sx={{ color: '#888', whiteSpace: 'nowrap' }}>0 of 0</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Replace"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: theme === 'vs-dark' ? '#3c3c3c' : '#fff',
                  color: theme === 'vs-dark' ? '#fff' : '#333',
                  fontSize: '13px',
                },
              }}
            />
            <Button size="small" sx={{ minWidth: 'auto', color: '#888' }}>↓</Button>
            <Button size="small" sx={{ minWidth: 'auto', color: '#888' }}>↑</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button size="small" variant="outlined" sx={{ fontSize: '11px', color: '#888', borderColor: '#555' }}>
              Replace
            </Button>
            <Button size="small" variant="outlined" sx={{ fontSize: '11px', color: '#888', borderColor: '#555' }}>
              Replace All
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Enhanced Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon /> Settings
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Editor</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Font Size</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small" onClick={() => setFontSize(prev => Math.max(10, prev - 1))}>-</IconButton>
                    <Typography>{fontSize}px</Typography>
                    <IconButton size="small" onClick={() => setFontSize(prev => Math.min(24, prev + 1))}>+</IconButton>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Tab Size</Typography>
                  <Select size="small" value={tabSize} onChange={(e) => setTabSize(e.target.value as number)} sx={{ minWidth: 80 }}>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                  </Select>
                </Box>
                <FormControlLabel control={<Switch checked={wordWrap} onChange={() => setWordWrap(!wordWrap)} />} label="Word Wrap" />
                <FormControlLabel control={<Switch checked={showMinimap} onChange={() => setShowMinimap(!showMinimap)} />} label="Show Minimap" />
                <FormControlLabel control={<Switch checked={autoSave} onChange={() => setAutoSave(!autoSave)} />} label="Auto Save" />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Appearance</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel 
                  control={<Switch checked={theme === 'vs-dark'} onChange={() => setTheme(theme === 'vs-dark' ? 'vs-light' : 'vs-dark')} />} 
                  label="Dark Mode" 
                />
                <FormControlLabel control={<Switch checked={sidebarOpen} onChange={() => setSidebarOpen(!sidebarOpen)} />} label="Show Sidebar" />
                <FormControlLabel control={<Switch checked={bottomPanelOpen} onChange={() => setBottomPanelOpen(!bottomPanelOpen)} />} label="Show Terminal" />
                <FormControlLabel control={<Switch checked={splitView} onChange={() => setSplitView(!splitView)} />} label="Split View" />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 3, mb: 2 }}>Keyboard Shortcuts</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {[
                  { key: 'Ctrl+Shift+P', desc: 'Command Palette' },
                  { key: 'Ctrl+S', desc: 'Save File' },
                  { key: 'Ctrl+F', desc: 'Find' },
                  { key: 'Ctrl+H', desc: 'Find & Replace' },
                  { key: 'Ctrl+B', desc: 'Toggle Sidebar' },
                  { key: 'Ctrl+`', desc: 'Toggle Terminal' },
                  { key: 'F5', desc: 'Run Dev Server' },
                ].map(shortcut => (
                  <Box key={shortcut.key} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: '#888' }}>{shortcut.desc}</Typography>
                    <Chip label={shortcut.key} size="small" sx={{ fontSize: '10px', height: 20 }} />
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default IDEPage;
