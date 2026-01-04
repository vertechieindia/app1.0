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
} from '@mui/icons-material';

// ============= TYPE DEFINITIONS =============
interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
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
  
  // Projects list
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'My Portfolio',
      type: 'website',
      template: 'landing',
      description: 'Personal portfolio website',
      createdAt: new Date('2024-01-15'),
      lastModified: new Date('2024-01-20'),
      files: PROJECT_TEMPLATES.website.landing.files('My Portfolio'),
    },
    {
      id: '2',
      name: 'Task Manager',
      type: 'webapp',
      template: 'react',
      description: 'React task management app',
      createdAt: new Date('2024-01-10'),
      lastModified: new Date('2024-01-18'),
      files: PROJECT_TEMPLATES.website.landing.files('Task Manager'),
    },
  ]);
  
  // Current project state
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [unsavedFiles, setUnsavedFiles] = useState<Set<string>>(new Set());
  
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gitDialogOpen, setGitDialogOpen] = useState(false);
  const [repoName, setRepoName] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'info' });

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
  const [showMinimap, setShowMinimap] = useState(true);
  const [gitChanges, setGitChanges] = useState<string[]>([]);
  const [multipleTerminals, setMultipleTerminals] = useState<{ id: number; output: string[]; name: string }[]>([
    { id: 1, output: ['$ VerTechie IDE Terminal v2.0', '$ Type "help" for available commands', ''], name: 'bash' }
  ]);
  const [activeTerminalId, setActiveTerminalId] = useState(1);
  const [zenMode, setZenMode] = useState(false);

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

  // Handle code change
  const handleCodeChange = (newContent: string) => {
    if (!activeFileId) return;
    
    const updateContent = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === activeFileId) {
          return { ...node, content: newContent };
        }
        if (node.children) {
          return { ...node, children: updateContent(node.children) };
        }
        return node;
      });
    };
    
    setFiles(updateContent(files));
    setUnsavedFiles(prev => new Set(prev).add(activeFileId));
    setOpenFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: newContent } : f));
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

  // Handle save
  const handleSave = () => {
    if (activeFileId) {
      setUnsavedFiles(prev => {
        const next = new Set(prev);
        next.delete(activeFileId);
        return next;
      });
      setSnackbar({ open: true, message: 'File saved successfully!', severity: 'success' });
    }
  };

  // Handle terminal commands
  const handleTerminalCommand = (cmd: string) => {
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
      setTerminalOutput(prev => [...prev, '🚀 Starting development server...', '']);
      setTimeout(() => {
        setTerminalOutput(prev => [...prev,
          '',
          '  VITE v5.0.0  ready in 234 ms',
          '',
          '  ➜  Local:   http://localhost:5173/',
          '  ➜  Network: http://192.168.1.100:5173/',
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

  // Handle project creation
  const handleCreateProject = () => {
    if (!newProjectName) return;
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      type: newProjectType,
      template: 'landing',
      description: newProjectDesc,
      createdAt: new Date(),
      lastModified: new Date(),
      files: PROJECT_TEMPLATES.website.landing.files(newProjectName),
    };
    
    setProjects([...projects, newProject]);
    setCreateDialogOpen(false);
    setNewProjectName('');
    setNewProjectDesc('');
    
    // Open the project
    openProject(newProject);
  };

  // Open project
  const openProject = (project: Project) => {
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
  };

  // Handle download
  const handleDownload = () => {
    const collectFiles = (nodes: FileNode[], path = ''): { path: string; content: string }[] => {
      let result: { path: string; content: string }[] = [];
      for (const node of nodes) {
        const fullPath = path ? `${path}/${node.name}` : node.name;
        if (node.type === 'file') {
          result.push({ path: fullPath, content: node.content || '' });
        } else if (node.children) {
          result = [...result, ...collectFiles(node.children, fullPath)];
        }
      }
      return result;
    };
    
    const allFiles = collectFiles(files);
    setSnackbar({ open: true, message: `Downloading ${currentProject?.name || 'project'}.zip with ${allFiles.length} files`, severity: 'success' });
  };

  // Handle git push
  const handleGitPush = () => {
    setGitDialogOpen(false);
    setIsRunning(true);
    setTerminalOutput(prev => [...prev, `$ git push origin main`, '']);
    setTimeout(() => {
      setTerminalOutput(prev => [...prev,
        'Enumerating objects: 42, done.',
        'Counting objects: 100% (42/42), done.',
        'Writing objects: 100% (42/42), 12.43 KiB | 6.21 MiB/s, done.',
        `To github.com:user/${repoName || currentProject?.name || 'project'}.git`,
        '   abc1234..def5678  main -> main',
        '',
        '✅ Successfully pushed to GitHub!',
        '',
      ]);
      setIsRunning(false);
    }, 2000);
  };

  // Generate preview HTML
  const generatePreview = () => {
    const htmlFile = findFile(files, 'src/index.html');
    const cssFile = findFile(files, 'src/styles.css');
    const jsFile = findFile(files, 'src/app.js');
    
    if (!htmlFile?.content) return '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;font-family:sans-serif;">Select an HTML file to preview</div>';
    
    let html = htmlFile.content;
    if (cssFile?.content) {
      html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>${cssFile.content}</style>`);
    }
    if (jsFile?.content) {
      html = html.replace('<script src="app.js"></script>', `<script>${jsFile.content}</script>`);
    }
    
    return html;
  };

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

          {/* Projects Grid */}
          <Grid container spacing={3}>
            {projects.map(project => (
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
  return (
    <Box sx={{ 
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
            <IconButton size="small" onClick={() => setView('projects')} sx={{ width: 12, height: 12, bgcolor: '#ff5f56', '&:hover': { bgcolor: '#ff5f56' } }} />
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27ca40' }} />
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, ml: 2 }}>
            📁 {currentProject?.name || 'Project'} - VerTechie IDE
          </Typography>
        </Box>
        
        {/* Menu Bar */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {['File', 'Edit', 'View', 'Go', 'Run', 'Terminal', 'Help'].map(item => (
            <Button key={item} size="small" sx={{ 
              color: theme === 'vs-dark' ? '#ccc' : '#333', 
              fontSize: '12px', 
              textTransform: 'none',
              minWidth: 'auto',
              px: 1,
              '&:hover': { bgcolor: theme === 'vs-dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
            }}>
              {item}
            </Button>
          ))}
        </Box>

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
            <IconButton size="small" sx={{ color: '#f14c4c' }}>
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
            <IconButton sx={{ color: '#888', '&:hover': { color: 'white' } }}>
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
                  <IconButton size="small" sx={{ color: '#888' }}>
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
              <Box sx={{ p: 2, textAlign: 'center', color: '#888' }}>
                <SourceControlIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2" sx={{ mb: 2 }}>Source Control</Typography>
                <Button variant="contained" size="small" onClick={() => setGitDialogOpen(true)} startIcon={<GitHubIcon />}
                  sx={{ bgcolor: '#238636', '&:hover': { bgcolor: '#2ea043' } }}>
                  Push to GitHub
                </Button>
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
          
          {/* Editor / Preview Split */}
          <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Code Editor(s) - Supports Split View */}
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex' }}>
              {/* Primary Editor */}
              {activeFile ? (
                <Box sx={{ flex: 1, display: 'flex', bgcolor: theme === 'vs-dark' ? '#1e1e1e' : '#ffffff', position: 'relative' }}>
                  {/* Line Numbers */}
                  <Box sx={{ 
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
                    overflowY: 'hidden',
                  }}>
                    {(activeFile.content || '').split('\n').map((_, i) => (
                      <Box key={i} sx={{ 
                        '&:hover': { bgcolor: theme === 'vs-dark' ? '#2a2d2e' : '#f0f0f0' },
                        cursor: 'pointer',
                      }}>{i + 1}</Box>
                    ))}
                  </Box>
                  {/* Editor */}
                  <Box sx={{ flex: 1, position: 'relative' }}>
                    <Box
                      component="textarea"
                      value={activeFile.content || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleCodeChange(e.target.value)}
                      spellCheck={false}
                      sx={{
                        width: showMinimap ? 'calc(100% - 80px)' : '100%',
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
                        '&::selection': { bgcolor: theme === 'vs-dark' ? '#264f78' : '#add6ff' },
                      }}
                    />
                    {/* Minimap */}
                    {showMinimap && (
                      <Box sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        width: 80,
                        height: '100%',
                        bgcolor: theme === 'vs-dark' ? 'rgba(30,30,30,0.8)' : 'rgba(245,245,245,0.8)',
                        borderLeft: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}`,
                        overflow: 'hidden',
                        cursor: 'pointer',
                      }}>
                        <Box sx={{ 
                          transform: 'scale(0.1)', 
                          transformOrigin: 'top left',
                          whiteSpace: 'pre',
                          fontFamily: 'monospace',
                          fontSize: `${fontSize * 10}px`,
                          color: theme === 'vs-dark' ? '#666' : '#888',
                          lineHeight: 1.2,
                        }}>
                          {activeFile.content}
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
                  <Box sx={{ width: 4, bgcolor: theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0', cursor: 'col-resize' }} />
                  <Box sx={{ flex: 1, display: 'flex', bgcolor: theme === 'vs-dark' ? '#1e1e1e' : '#ffffff' }}>
                    <Box sx={{ 
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
            
            {/* Live Preview */}
            <Box sx={{ width: '40%', borderLeft: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}`, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 0.5, display: 'flex', alignItems: 'center', gap: 1, bgcolor: theme === 'vs-dark' ? '#252526' : '#f3f3f3', borderBottom: `1px solid ${theme === 'vs-dark' ? '#3c3c3c' : '#e0e0e0'}` }}>
                <Typography variant="caption" sx={{ color: '#888', display: 'flex', alignItems: 'center', gap: 0.5 }}>🌐 Preview</Typography>
                <Box sx={{ flex: 1, bgcolor: theme === 'vs-dark' ? '#3c3c3c' : '#fff', borderRadius: 1, px: 1, py: 0.25 }}>
                  <Typography variant="caption" sx={{ color: '#888', fontSize: '11px' }}>localhost:5173</Typography>
                </Box>
                <Tooltip title="Refresh">
                  <IconButton size="small" sx={{ color: '#888' }}>
                    <RefreshIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ flex: 1, bgcolor: '#fff' }}>
                <iframe srcDoc={generatePreview()} title="Preview" style={{ width: '100%', height: '100%', border: 'none' }} sandbox="allow-scripts" />
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
              <SourceControlIcon sx={{ fontSize: 14 }} /><span>main</span>
            </Box>
          </Tooltip>
          <Tooltip title="Sync Changes">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
              <RefreshIcon sx={{ fontSize: 14 }} /><span>0 ↓ 0 ↑</span>
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
                <Box sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                  Ln {(activeFile.content || '').split('\n').length}, Col 1
                </Box>
              </Tooltip>
              <Tooltip title="Indentation">
                <Box sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                  Spaces: {tabSize}
                </Box>
              </Tooltip>
              <span>UTF-8</span>
              <Tooltip title="Select Language Mode">
                <Box sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
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

      {/* New File Dialog */}
      <Dialog open={newFileDialogOpen} onClose={() => setNewFileDialogOpen(false)}>
        <DialogTitle>Create New File</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth label="File Name" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} placeholder="example.js" sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFileDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            if (newFileName) {
              const ext = newFileName.split('.').pop() || '';
              const langMap: Record<string, string> = { js: 'javascript', ts: 'typescript', jsx: 'javascript', tsx: 'typescript', html: 'html', css: 'css', json: 'json', md: 'markdown', py: 'python' };
              const newFile: FileNode = { id: newFileName, name: newFileName, type: 'file', language: langMap[ext] || 'text', content: '' };
              setFiles([...files, newFile]);
              handleFileSelect(newFile);
              setNewFileDialogOpen(false);
              setNewFileName('');
            }
          }}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Git Push Dialog */}
      <Dialog open={gitDialogOpen} onClose={() => setGitDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><GitHubIcon /> Push to GitHub</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Repository Name" value={repoName} onChange={(e) => setRepoName(e.target.value)} placeholder={currentProject?.name} sx={{ mt: 2, mb: 2 }} />
          <FormControl fullWidth>
            <InputLabel>Visibility</InputLabel>
            <Select value="public" label="Visibility">
              <MenuItem value="public">🌍 Public</MenuItem>
              <MenuItem value="private">🔒 Private</MenuItem>
            </Select>
          </FormControl>
          <Alert severity="info" sx={{ mt: 2 }}>This will create a new repository and push all project files.</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGitDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleGitPush} sx={{ bgcolor: '#238636' }}>Create & Push</Button>
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
        <MenuItem onClick={() => setContextMenu(null)}><ListItemIcon><NewFolderIcon fontSize="small" /></ListItemIcon>New Folder</MenuItem>
        <Divider />
        <MenuItem onClick={() => setContextMenu(null)}><ListItemIcon><CopyIcon fontSize="small" /></ListItemIcon>Copy</MenuItem>
        <MenuItem onClick={() => setContextMenu(null)}><ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>Rename</MenuItem>
        <MenuItem onClick={() => setContextMenu(null)}><ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>Delete</MenuItem>
      </Menu>

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
