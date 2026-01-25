/**
 * Styled components for TutorialPage
 */
import { Box, IconButton, ListItem, LinearProgress } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

export const PageContainer = styled(Box)({
  display: 'flex',
  minHeight: '100%',
  backgroundColor: '#f8fafc',
});

export const Sidebar = styled(Box)<{ tutorialColor: string; collapsed?: boolean }>(({ tutorialColor, collapsed }) => ({
  width: collapsed ? 0 : 280,
  minWidth: collapsed ? 0 : 280,
  backgroundColor: '#fff',
  borderRight: collapsed ? 'none' : '1px solid #e2e8f0',
  position: 'fixed',
  left: 0,
  top: 64,
  bottom: 80,
  overflowX: 'hidden',
  overflowY: 'auto',
  transition: 'all 0.3s ease',
  opacity: collapsed ? 0 : 1,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 10,
  '& .sidebar-header': {
    padding: 16,
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: tutorialColor,
    color: '#fff',
    flexShrink: 0,
  },
  '& .sidebar-list': {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#fff',
  },
}));

export const SidebarToggle = styled(IconButton)<{ tutorialColor?: string; sidebarVisible?: boolean }>(({ tutorialColor, sidebarVisible = true }) => ({
  position: 'fixed',
  left: sidebarVisible ? 264 : 8,
  top: 72,
  zIndex: 1200,
  backgroundColor: tutorialColor || '#0d47a1',
  color: '#fff',
  width: 32,
  height: 32,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  transition: 'left 0.3s ease',
  '&:hover': {
    backgroundColor: tutorialColor || '#0d47a1',
    opacity: 0.9,
  },
}));

export const MainContent = styled(Box)<{ sidebarVisible?: boolean }>(({ sidebarVisible = true }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  marginLeft: sidebarVisible ? 280 : 0,
  transition: 'margin-left 0.3s ease',
}));

export const LessonContent = styled(Box)({
  flex: 1,
  padding: '24px 40px',
  width: '100%',
});

export const ChapterItem = styled(ListItem)<{ active?: boolean }>(({ active }) => ({
  cursor: 'pointer',
  backgroundColor: active ? alpha('#0d47a1', 0.05) : 'transparent',
  '&:hover': {
    backgroundColor: alpha('#0d47a1', 0.03),
  },
}));

export const LessonItem = styled(ListItem)<{ active?: boolean; completed?: boolean; color?: string }>(
  ({ active, completed, color }) => ({
    paddingLeft: 32,
    cursor: 'pointer',
    backgroundColor: active ? alpha(color || '#0d47a1', 0.1) : 'transparent',
    borderLeft: active ? `3px solid ${color || '#0d47a1'}` : '3px solid transparent',
    '&:hover': {
      backgroundColor: alpha(color || '#0d47a1', 0.05),
    },
  })
);

export const CodeEditor = styled(Box)<{ darkMode?: boolean }>(({ darkMode }) => ({
  fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
  fontSize: 14,
  lineHeight: 1.6,
  padding: 20,
  borderRadius: 8,
  backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5',
  color: darkMode ? '#d4d4d4' : '#333',
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  border: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
}));

export const TryItEditor = styled(Box)<{ darkMode?: boolean }>(({ darkMode }) => ({
  backgroundColor: darkMode ? '#1e1e1e' : '#fff',
  borderRadius: 12,
  overflow: 'hidden',
  border: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

export const EditorHeader = styled(Box)<{ color?: string }>(({ color }) => ({
  backgroundColor: color || '#0d47a1',
  color: '#fff',
  padding: '10px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const ResultFrame = styled(Box)({
  backgroundColor: '#fff',
  minHeight: 200,
  padding: 20,
  borderTop: '1px solid #e0e0e0',
});

export const NavigationBar = styled(Box)<{ color?: string }>(({ color }) => ({
  position: 'sticky',
  bottom: 0,
  backgroundColor: '#fff',
  borderTop: '1px solid #e2e8f0',
  padding: '12px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 10,
}));

export const ProgressBar = styled(LinearProgress)<{ barColor?: string }>(({ barColor }) => ({
  height: 4,
  backgroundColor: alpha(barColor || '#0d47a1', 0.1),
  '& .MuiLinearProgress-bar': {
    backgroundColor: barColor || '#0d47a1',
  },
}));
