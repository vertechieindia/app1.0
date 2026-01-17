/**
 * Learn Admin - Complete Course Management System
 * 
 * Hierarchy: Category → Tutorial → Section → Lesson → Content Blocks
 * 
 * Screens:
 * - Categories
 * - Tutorials (Courses)
 * - Section Builder
 * - Lesson Builder
 * - Content Builder
 * - Media Library
 * - Code Snippets
 * - Publishing & Preview
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  Divider,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Tooltip,
  Drawer,
  Breadcrumbs,
  Link,
  Fab,
  Menu,
  AppBar,
  Toolbar,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  DragIndicator as DragIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Article as ArticleIcon,
  PlayCircle as PlayIcon,
  Code as CodeIcon,
  Quiz as QuizIcon,
  Save as SaveIcon,
  Publish as PublishIcon,
  Unpublished as UnpublishedIcon,
  Category as CategoryIcon,
  Folder as FolderIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  FormatListBulleted as ListIcon,
  TextFields as TextIcon,
  Title as TitleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Lightbulb as TipIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  ContentCopy as CopyIcon,
  NavigateNext as NextIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Preview as PreviewIcon,
  TableChart as TableIcon,
  Link as LinkIcon,
  HorizontalRule as DividerIcon,
} from '@mui/icons-material';

// API Base
// Use standalone Learn Admin server on port 8001
const API_BASE = 'http://localhost:8001/api/v1/admin/learn';

// Types
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  display_order: number;
  is_visible: boolean;
  is_featured: boolean;
  course_count: number;
}

interface Tutorial {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  category_id: string;
  category_name?: string;
  difficulty: string;
  status: string;
  is_free: boolean;
  is_featured: boolean;
  estimated_hours: number;
  total_sections: number;
  total_lessons: number;
  enrollment_count: number;
  thumbnail: string;
  tags: string[];
}

interface Section {
  id: string;
  title: string;
  description: string;
  display_order: number;
  is_visible: boolean;
  is_free_preview: boolean;
  estimated_minutes: number;
  total_lessons: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  lesson_type: string;
  estimated_minutes: number;
  display_order: number;
  is_visible: boolean;
  is_free_preview: boolean;
  has_quiz: boolean;
  has_exercise: boolean;
  has_try_it: boolean;
  status: string;
}

interface ContentBlock {
  id: string;
  block_type: string;
  display_order: number;
  content: any;
  is_visible: boolean;
}

// Block type options
const BLOCK_TYPES = [
  { value: 'header', label: 'Header', icon: <TitleIcon /> },
  { value: 'text', label: 'Text', icon: <TextIcon /> },
  { value: 'markdown', label: 'Markdown', icon: <ArticleIcon /> },
  { value: 'code', label: 'Code Block', icon: <CodeIcon /> },
  { value: 'try_it', label: 'Try It Yourself', icon: <PlayIcon /> },
  { value: 'image', label: 'Image', icon: <ImageIcon /> },
  { value: 'video', label: 'Video', icon: <VideoIcon /> },
  { value: 'note', label: 'Note', icon: <InfoIcon /> },
  { value: 'warning', label: 'Warning', icon: <WarningIcon /> },
  { value: 'tip', label: 'Tip', icon: <TipIcon /> },
  { value: 'list', label: 'List', icon: <ListIcon /> },
  { value: 'table', label: 'Table', icon: <TableIcon /> },
  { value: 'divider', label: 'Divider', icon: <DividerIcon /> },
  { value: 'quiz', label: 'Quiz', icon: <QuizIcon /> },
];

const LearnAdmin: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState<{label: string, onClick?: () => void}[]>([
    { label: 'Learn Admin' }
  ]);
  
  // Data State
  const [categories, setCategories] = useState<Category[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [selectedTutorial, setSelectedTutorial] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Dialogs
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [tutorialDialog, setTutorialDialog] = useState(false);
  const [sectionDialog, setSectionDialog] = useState(false);
  const [lessonDialog, setLessonDialog] = useState(false);
  const [blockDialog, setBlockDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<any>(null);
  
  // Edit mode flags
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  
  // Forms
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: '📚',
    color: '#0d47a1',
  });
  
  const [tutorialForm, setTutorialForm] = useState({
    title: '',
    category_id: '',
    description: '',
    short_description: '',
    difficulty: 'beginner',
    estimated_hours: 0,
    is_free: true,
    tags: '',
  });
  
  const [sectionForm, setSectionForm] = useState({
    title: '',
    description: '',
    is_free_preview: false,
    estimated_minutes: 0,
  });
  
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    lesson_type: 'article',
    estimated_minutes: 10,
    is_free_preview: false,
    has_quiz: false,
    has_exercise: false,
    has_try_it: true,
  });
  
  const [blockForm, setBlockForm] = useState({
    block_type: 'text',
    content: {},
  });

  // API Helper - standalone server doesn't require auth
  const apiCall = useCallback(async (url: string, method: string = 'GET', body?: object) => {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'API call failed');
    }
    
    return response.json();
  }, []);

  // Load Categories
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiCall(`${API_BASE}/categories?include_hidden=true`);
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Load Tutorials
  const loadTutorials = useCallback(async (categoryId?: string) => {
    try {
      setLoading(true);
      const url = categoryId 
        ? `${API_BASE}/tutorials?category_id=${categoryId}` 
        : `${API_BASE}/tutorials`;
      const data = await apiCall(url);
      setTutorials(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Load Tutorial Details
  const loadTutorialDetails = useCallback(async (tutorialId: string) => {
    try {
      setLoading(true);
      const data = await apiCall(`${API_BASE}/tutorials/${tutorialId}`);
      setSelectedTutorial(data);
      setBreadcrumbs([
        { label: 'Learn Admin', onClick: () => { setSelectedTutorial(null); setActiveTab(1); } },
        { label: data.title }
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Load Lesson Details
  const loadLessonDetails = useCallback(async (lessonId: string) => {
    try {
      setLoading(true);
      const data = await apiCall(`${API_BASE}/lessons/${lessonId}`);
      setSelectedLesson(data);
      setBreadcrumbs([
        { label: 'Learn Admin', onClick: () => { setSelectedTutorial(null); setSelectedLesson(null); setActiveTab(1); } },
        { label: selectedTutorial?.title || 'Tutorial', onClick: () => { setSelectedLesson(null); } },
        { label: data.title }
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiCall, selectedTutorial]);

  // Initial Load
  useEffect(() => {
    loadCategories();
    loadTutorials();
  }, [loadCategories, loadTutorials]);

  // CRUD Operations - Categories
  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await apiCall(`${API_BASE}/categories/${editingCategory.id}`, 'PUT', categoryForm);
        setSuccess('Category updated successfully');
      } else {
        await apiCall(`${API_BASE}/categories`, 'POST', categoryForm);
        setSuccess('Category created successfully');
      }
      setCategoryDialog(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', icon: '📚', color: '#0d47a1' });
      loadCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // CRUD Operations - Tutorials
  const handleSaveTutorial = async () => {
    try {
      const payload = {
        ...tutorialForm,
        tags: tutorialForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      
      const result = await apiCall(`${API_BASE}/tutorials`, 'POST', payload);
      setSuccess('Tutorial created successfully');
      setTutorialDialog(false);
      setTutorialForm({
        title: '',
        category_id: '',
        description: '',
        short_description: '',
        difficulty: 'beginner',
        estimated_hours: 0,
        is_free: true,
        tags: '',
      });
      loadTutorials();
      // Open the new tutorial for section editing
      loadTutorialDetails(result.id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // CRUD Operations - Sections
  const handleSaveSection = async () => {
    try {
      if (!selectedTutorial) return;
      
      if (editingSection) {
        await apiCall(`${API_BASE}/sections/${editingSection.id}`, 'PUT', sectionForm);
        setSuccess('Section updated successfully');
      } else {
        await apiCall(`${API_BASE}/tutorials/${selectedTutorial.id}/sections`, 'POST', sectionForm);
        setSuccess('Section created successfully');
      }
      setSectionDialog(false);
      setEditingSection(null);
      setSectionForm({ title: '', description: '', is_free_preview: false, estimated_minutes: 0 });
      loadTutorialDetails(selectedTutorial.id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // CRUD Operations - Lessons
  const handleSaveLesson = async () => {
    try {
      if (!selectedSectionId) return;
      
      if (editingLesson) {
        await apiCall(`${API_BASE}/lessons/${editingLesson.id}`, 'PUT', lessonForm);
        setSuccess('Lesson updated successfully');
      } else {
        await apiCall(`${API_BASE}/sections/${selectedSectionId}/lessons`, 'POST', lessonForm);
        setSuccess('Lesson created successfully');
      }
      setLessonDialog(false);
      setEditingLesson(null);
      setLessonForm({
        title: '',
        description: '',
        lesson_type: 'article',
        estimated_minutes: 10,
        is_free_preview: false,
        has_quiz: false,
        has_exercise: false,
        has_try_it: true,
      });
      if (selectedTutorial) {
        loadTutorialDetails(selectedTutorial.id);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // CRUD Operations - Content Blocks
  const handleSaveBlock = async () => {
    try {
      if (!selectedLesson) return;
      
      if (editingBlock) {
        await apiCall(`${API_BASE}/blocks/${editingBlock.id}`, 'PUT', blockForm);
        setSuccess('Block updated successfully');
      } else {
        await apiCall(`${API_BASE}/lessons/${selectedLesson.id}/blocks`, 'POST', blockForm);
        setSuccess('Block created successfully');
      }
      setBlockDialog(false);
      setEditingBlock(null);
      setBlockForm({ block_type: 'text', content: {} });
      loadLessonDetails(selectedLesson.id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete Operations
  const handleDelete = async () => {
    try {
      const { type, id } = deleteDialog;
      let endpoint = '';
      
      switch (type) {
        case 'category':
          endpoint = `${API_BASE}/categories/${id}`;
          break;
        case 'tutorial':
          endpoint = `${API_BASE}/tutorials/${id}`;
          break;
        case 'section':
          endpoint = `${API_BASE}/sections/${id}`;
          break;
        case 'lesson':
          endpoint = `${API_BASE}/lessons/${id}`;
          break;
        case 'block':
          endpoint = `${API_BASE}/blocks/${id}`;
          break;
      }
      
      await apiCall(endpoint, 'DELETE');
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
      setDeleteDialog(null);
      
      // Refresh appropriate data
      if (type === 'category') loadCategories();
      else if (type === 'tutorial') { loadTutorials(); setSelectedTutorial(null); }
      else if (type === 'section' && selectedTutorial) loadTutorialDetails(selectedTutorial.id);
      else if (type === 'lesson' && selectedTutorial) loadTutorialDetails(selectedTutorial.id);
      else if (type === 'block' && selectedLesson) loadLessonDetails(selectedLesson.id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Publish/Unpublish Tutorial
  const handlePublish = async (tutorialId: string, publish: boolean) => {
    try {
      await apiCall(`${API_BASE}/tutorials/${tutorialId}/${publish ? 'publish' : 'unpublish'}`, 'POST');
      setSuccess(publish ? 'Tutorial published!' : 'Tutorial unpublished');
      loadTutorials();
      if (selectedTutorial?.id === tutorialId) {
        loadTutorialDetails(tutorialId);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Get block type icon
  const getBlockIcon = (type: string) => {
    const blockType = BLOCK_TYPES.find(b => b.value === type);
    return blockType?.icon || <ArticleIcon />;
  };

  // Render Categories Tab
  const renderCategoriesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          <CategoryIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Tutorial Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingCategory(null);
            setCategoryForm({ name: '', description: '', icon: '📚', color: '#0d47a1' });
            setCategoryDialog(true);
          }}
        >
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell width={50}><strong>Order</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Courses</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id} hover>
                <TableCell>
                  <DragIcon sx={{ color: 'text.secondary', cursor: 'grab' }} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: cat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 20,
                      }}
                    >
                      {cat.icon || '📚'}
                    </Box>
                    <Box>
                      <Typography fontWeight="500">{cat.name}</Typography>
                      <Typography variant="caption" color="text.secondary">/{cat.slug}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{cat.course_count} courses</TableCell>
                <TableCell>
                  <Chip
                    label={cat.is_visible ? 'Visible' : 'Hidden'}
                    size="small"
                    color={cat.is_visible ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => {
                        setEditingCategory(cat);
                        setCategoryForm({
                          name: cat.name,
                          description: cat.description || '',
                          icon: cat.icon || '📚',
                          color: cat.color,
                        });
                        setCategoryDialog(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => setDeleteDialog({ type: 'category', id: cat.id, name: cat.name })}
                      disabled={cat.course_count > 0}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Render Tutorials Tab
  const renderTutorialsTab = () => {
    if (selectedLesson) {
      return renderContentBuilder();
    }
    
    if (selectedTutorial) {
      return renderSectionBuilder();
    }
    
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            <BookIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Tutorials / Courses
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setTutorialDialog(true)}
          >
            Create Tutorial
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell><strong>Tutorial</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Sections</strong></TableCell>
                <TableCell><strong>Lessons</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tutorials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No tutorials yet. Create your first tutorial!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tutorials.map((tut) => (
                  <TableRow key={tut.id} hover>
                    <TableCell>
                      <Box>
                        <Typography fontWeight="500">{tut.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tut.short_description?.substring(0, 60) || tut.slug}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {categories.find(c => c.id === tut.category_id)?.name || '-'}
                    </TableCell>
                    <TableCell>{tut.total_sections}</TableCell>
                    <TableCell>{tut.total_lessons}</TableCell>
                    <TableCell>
                      <Chip
                        label={tut.status}
                        size="small"
                        color={tut.status === 'published' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Sections & Lessons">
                        <IconButton onClick={() => loadTutorialDetails(tut.id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={tut.status === 'published' ? 'Unpublish' : 'Publish'}>
                        <IconButton
                          color={tut.status === 'published' ? 'success' : 'default'}
                          onClick={() => handlePublish(tut.id, tut.status !== 'published')}
                        >
                          {tut.status === 'published' ? <PublishIcon /> : <UnpublishedIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => setDeleteDialog({ type: 'tutorial', id: tut.id, name: tut.title })}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // Render Section Builder
  const renderSectionBuilder = () => (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => { setSelectedTutorial(null); setBreadcrumbs([{ label: 'Learn Admin' }]); }}>
          <BackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5">{selectedTutorial.title}</Typography>
          <Chip
            label={selectedTutorial.status}
            size="small"
            color={selectedTutorial.status === 'published' ? 'success' : 'default'}
            sx={{ mt: 0.5 }}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingSection(null);
            setSectionForm({ title: '', description: '', is_free_preview: false, estimated_minutes: 0 });
            setSectionDialog(true);
          }}
        >
          Add Section
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Tutorial Info</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography><strong>Category:</strong> {selectedTutorial.category_name}</Typography>
              <Typography><strong>Difficulty:</strong> {selectedTutorial.difficulty}</Typography>
              <Typography><strong>Sections:</strong> {selectedTutorial.total_sections}</Typography>
              <Typography><strong>Lessons:</strong> {selectedTutorial.total_lessons}</Typography>
              <Typography><strong>Duration:</strong> {selectedTutorial.estimated_hours}h</Typography>
              <Typography><strong>Enrollments:</strong> {selectedTutorial.enrollment_count}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sections & Lessons
            </Typography>

            {selectedTutorial.sections?.length === 0 ? (
              <Alert severity="info">No sections yet. Add a section to start creating lessons.</Alert>
            ) : (
              selectedTutorial.sections?.map((section: Section, idx: number) => (
                <Accordion key={section.id} defaultExpanded={idx === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 2 }}>
                      <DragIcon sx={{ color: 'text.secondary', cursor: 'grab' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight="500">
                          Section {section.display_order}: {section.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {section.total_lessons} lessons
                          {section.is_free_preview && ' • Free Preview'}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSection(section);
                          setSectionForm({
                            title: section.title,
                            description: section.description || '',
                            is_free_preview: section.is_free_preview,
                            estimated_minutes: section.estimated_minutes,
                          });
                          setSectionDialog(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteDialog({ type: 'section', id: section.id, name: section.title });
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {section.lessons?.length === 0 ? (
                        <ListItem>
                          <ListItemText primary="No lessons yet" secondary="Add lessons to this section" />
                        </ListItem>
                      ) : (
                        section.lessons?.map((lesson: Lesson) => (
                          <ListItem key={lesson.id} divider button onClick={() => loadLessonDetails(lesson.id)}>
                            <ListItemIcon>
                              {lesson.lesson_type === 'video' ? <PlayIcon /> :
                               lesson.lesson_type === 'quiz' ? <QuizIcon /> :
                               lesson.lesson_type === 'interactive' ? <CodeIcon /> :
                               <ArticleIcon />}
                            </ListItemIcon>
                            <ListItemText
                              primary={lesson.title}
                              secondary={`${lesson.estimated_minutes} min • ${lesson.lesson_type}${lesson.is_free_preview ? ' • Free' : ''}`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingLesson(lesson);
                                  setSelectedSectionId(section.id);
                                  setLessonForm({
                                    title: lesson.title,
                                    description: lesson.description || '',
                                    lesson_type: lesson.lesson_type,
                                    estimated_minutes: lesson.estimated_minutes,
                                    is_free_preview: lesson.is_free_preview,
                                    has_quiz: lesson.has_quiz,
                                    has_exercise: lesson.has_exercise,
                                    has_try_it: lesson.has_try_it,
                                  });
                                  setLessonDialog(true);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteDialog({ type: 'lesson', id: lesson.id, name: lesson.title });
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))
                      )}
                    </List>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setSelectedSectionId(section.id);
                        setEditingLesson(null);
                        setLessonForm({
                          title: '',
                          description: '',
                          lesson_type: 'article',
                          estimated_minutes: 10,
                          is_free_preview: false,
                          has_quiz: false,
                          has_exercise: false,
                          has_try_it: true,
                        });
                        setLessonDialog(true);
                      }}
                      sx={{ mt: 1 }}
                    >
                      Add Lesson
                    </Button>
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  // Render Content Builder
  const renderContentBuilder = () => (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => { setSelectedLesson(null); }}>
          <BackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5">{selectedLesson.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedLesson.lesson_type} • {selectedLesson.estimated_minutes} min
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<PreviewIcon />}
          sx={{ mr: 1 }}
        >
          Preview
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingBlock(null);
            setBlockForm({ block_type: 'text', content: {} });
            setBlockDialog(true);
          }}
        >
          Add Block
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, minHeight: 400 }}>
            <Typography variant="h6" gutterBottom>Content Blocks</Typography>
            <Divider sx={{ mb: 2 }} />

            {selectedLesson.content_blocks?.length === 0 ? (
              <Alert severity="info">
                No content blocks yet. Add blocks to build your lesson content.
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {selectedLesson.content_blocks?.map((block: ContentBlock) => (
                  <Paper
                    key={block.id}
                    variant="outlined"
                    sx={{ p: 2, '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <DragIcon sx={{ color: 'text.secondary', cursor: 'grab', mt: 0.5 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getBlockIcon(block.block_type)}
                        <Chip label={block.block_type} size="small" />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        {block.block_type === 'header' && (
                          <Typography variant={`h${block.content?.level || 2}` as any}>
                            {block.content?.text || 'Header Text'}
                          </Typography>
                        )}
                        {block.block_type === 'text' && (
                          <Typography>{block.content?.text || 'Text content...'}</Typography>
                        )}
                        {block.block_type === 'code' && (
                          <Box sx={{ bgcolor: '#1e1e1e', color: '#d4d4d4', p: 1, borderRadius: 1, fontFamily: 'monospace', fontSize: 12 }}>
                            {(block.content?.code || 'code...').substring(0, 100)}...
                          </Box>
                        )}
                        {block.block_type === 'try_it' && (
                          <Alert severity="info" icon={<PlayIcon />}>
                            Try It Yourself: {block.content?.language || 'html'}
                          </Alert>
                        )}
                        {['note', 'warning', 'tip'].includes(block.block_type) && (
                          <Alert severity={block.block_type === 'warning' ? 'warning' : block.block_type === 'tip' ? 'success' : 'info'}>
                            {block.content?.text || `${block.block_type} content...`}
                          </Alert>
                        )}
                        {block.block_type === 'image' && (
                          <Box sx={{ bgcolor: '#f5f5f5', p: 2, textAlign: 'center', borderRadius: 1 }}>
                            <ImageIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                            <Typography variant="caption" display="block">
                              {block.content?.url || 'Image placeholder'}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingBlock(block);
                            setBlockForm({
                              block_type: block.block_type,
                              content: block.content || {},
                            });
                            setBlockDialog(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ type: 'block', id: block.id, name: block.block_type })}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Add Block</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {BLOCK_TYPES.map((bt) => (
                  <Button
                    key={bt.value}
                    variant="outlined"
                    startIcon={bt.icon}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                    onClick={() => {
                      setEditingBlock(null);
                      setBlockForm({ block_type: bt.value, content: {} });
                      setBlockDialog(true);
                    }}
                  >
                    {bt.label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Snackbars */}
      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess(null)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      {/* Header with Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs separator={<NextIcon fontSize="small" />}>
          {breadcrumbs.map((bc, idx) => (
            bc.onClick ? (
              <Link key={idx} color="inherit" href="#" onClick={(e) => { e.preventDefault(); bc.onClick?.(); }} sx={{ cursor: 'pointer' }}>
                {bc.label}
              </Link>
            ) : (
              <Typography key={idx} color="text.primary">{bc.label}</Typography>
            )
          ))}
        </Breadcrumbs>
      </Box>

      {/* Main Tabs - Only show when not in detail views */}
      {!selectedTutorial && !selectedLesson && (
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab icon={<CategoryIcon />} label="Categories" />
          <Tab icon={<BookIcon />} label="Tutorials" />
          <Tab icon={<ImageIcon />} label="Media Library" />
          <Tab icon={<CodeIcon />} label="Code Snippets" />
        </Tabs>
      )}

      {/* Tab Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {activeTab === 0 && !selectedTutorial && renderCategoriesTab()}
          {activeTab === 1 && renderTutorialsTab()}
          {activeTab === 2 && !selectedTutorial && (
            <Alert severity="info">Media Library - Coming Soon</Alert>
          )}
          {activeTab === 3 && !selectedTutorial && (
            <Alert severity="info">Code Snippets Library - Coming Soon</Alert>
          )}
        </>
      )}

      {/* Category Dialog */}
      <Dialog open={categoryDialog} onClose={() => setCategoryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category Name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Icon (emoji)"
                value={categoryForm.icon}
                onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Color"
                type="color"
                value={categoryForm.color}
                onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCategory} disabled={!categoryForm.name}>
            {editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tutorial Dialog */}
      <Dialog open={tutorialDialog} onClose={() => setTutorialDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Tutorial</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tutorial Title"
                value={tutorialForm.title}
                onChange={(e) => setTutorialForm({ ...tutorialForm, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={tutorialForm.category_id}
                  label="Category"
                  onChange={(e) => setTutorialForm({ ...tutorialForm, category_id: e.target.value })}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={tutorialForm.difficulty}
                  label="Difficulty"
                  onChange={(e) => setTutorialForm({ ...tutorialForm, difficulty: e.target.value })}
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                  <MenuItem value="expert">Expert</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                value={tutorialForm.short_description}
                onChange={(e) => setTutorialForm({ ...tutorialForm, short_description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Description"
                value={tutorialForm.description}
                onChange={(e) => setTutorialForm({ ...tutorialForm, description: e.target.value })}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Estimated Hours"
                type="number"
                value={tutorialForm.estimated_hours}
                onChange={(e) => setTutorialForm({ ...tutorialForm, estimated_hours: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={tutorialForm.is_free}
                    onChange={(e) => setTutorialForm({ ...tutorialForm, is_free: e.target.checked })}
                  />
                }
                label="Free Tutorial"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma separated)"
                value={tutorialForm.tags}
                onChange={(e) => setTutorialForm({ ...tutorialForm, tags: e.target.value })}
                placeholder="html, web, beginner"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTutorialDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveTutorial}
            disabled={!tutorialForm.title || !tutorialForm.category_id || !tutorialForm.description}
          >
            Create Tutorial
          </Button>
        </DialogActions>
      </Dialog>

      {/* Section Dialog */}
      <Dialog open={sectionDialog} onClose={() => setSectionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSection ? 'Edit Section' : 'Create Section'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Section Title"
                value={sectionForm.title}
                onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={sectionForm.description}
                onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Estimated Minutes"
                type="number"
                value={sectionForm.estimated_minutes}
                onChange={(e) => setSectionForm({ ...sectionForm, estimated_minutes: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={sectionForm.is_free_preview}
                    onChange={(e) => setSectionForm({ ...sectionForm, is_free_preview: e.target.checked })}
                  />
                }
                label="Free Preview"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSectionDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSection} disabled={!sectionForm.title}>
            {editingSection ? 'Update' : 'Create'} Section
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={lessonDialog} onClose={() => setLessonDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingLesson ? 'Edit Lesson' : 'Create Lesson'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Lesson Title"
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={lessonForm.lesson_type}
                  label="Type"
                  onChange={(e) => setLessonForm({ ...lessonForm, lesson_type: e.target.value })}
                >
                  <MenuItem value="article">Article</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="interactive">Interactive/Code</MenuItem>
                  <MenuItem value="quiz">Quiz</MenuItem>
                  <MenuItem value="project">Project</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={lessonForm.description}
                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Duration (min)"
                type="number"
                value={lessonForm.estimated_minutes}
                onChange={(e) => setLessonForm({ ...lessonForm, estimated_minutes: parseInt(e.target.value) || 10 })}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={lessonForm.is_free_preview}
                    onChange={(e) => setLessonForm({ ...lessonForm, is_free_preview: e.target.checked })}
                  />
                }
                label="Free Preview"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={lessonForm.has_try_it}
                    onChange={(e) => setLessonForm({ ...lessonForm, has_try_it: e.target.checked })}
                  />
                }
                label="Has Try It"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={lessonForm.has_quiz}
                    onChange={(e) => setLessonForm({ ...lessonForm, has_quiz: e.target.checked })}
                  />
                }
                label="Has Quiz"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLessonDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveLesson} disabled={!lessonForm.title}>
            {editingLesson ? 'Update' : 'Create'} Lesson
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block Dialog */}
      <Dialog open={blockDialog} onClose={() => setBlockDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{editingBlock ? 'Edit Block' : 'Add Content Block'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Block Type</InputLabel>
                <Select
                  value={blockForm.block_type}
                  label="Block Type"
                  onChange={(e) => setBlockForm({ ...blockForm, block_type: e.target.value, content: {} })}
                >
                  {BLOCK_TYPES.map((bt) => (
                    <MenuItem key={bt.value} value={bt.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {bt.icon}
                        {bt.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              
              {/* Dynamic content fields based on block type */}
              {blockForm.block_type === 'header' && (
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel>Level</InputLabel>
                      <Select
                        value={blockForm.content?.level || 2}
                        label="Level"
                        onChange={(e) => setBlockForm({
                          ...blockForm,
                          content: { ...blockForm.content, level: Number(e.target.value) }
                        })}
                      >
                        <MenuItem value={1}>H1 - Main Heading</MenuItem>
                        <MenuItem value={2}>H2 - Section Heading</MenuItem>
                        <MenuItem value={3}>H3 - Sub Heading</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      fullWidth
                      label="Header Text"
                      value={blockForm.content?.text || ''}
                      onChange={(e) => setBlockForm({
                        ...blockForm,
                        content: { ...blockForm.content, text: e.target.value }
                      })}
                    />
                  </Grid>
                </Grid>
              )}

              {(blockForm.block_type === 'text' || blockForm.block_type === 'markdown') && (
                <TextField
                  fullWidth
                  label={blockForm.block_type === 'markdown' ? 'Markdown Content' : 'Text Content'}
                  value={blockForm.content?.text || ''}
                  onChange={(e) => setBlockForm({
                    ...blockForm,
                    content: { ...blockForm.content, text: e.target.value }
                  })}
                  multiline
                  rows={10}
                  placeholder={blockForm.block_type === 'markdown' ? '# Write your markdown here...' : 'Enter your text content...'}
                  sx={{ fontFamily: blockForm.block_type === 'markdown' ? 'monospace' : 'inherit' }}
                />
              )}

              {blockForm.block_type === 'code' && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={blockForm.content?.language || 'javascript'}
                        label="Language"
                        onChange={(e) => setBlockForm({
                          ...blockForm,
                          content: { ...blockForm.content, language: e.target.value }
                        })}
                      >
                        <MenuItem value="html">HTML</MenuItem>
                        <MenuItem value="css">CSS</MenuItem>
                        <MenuItem value="javascript">JavaScript</MenuItem>
                        <MenuItem value="typescript">TypeScript</MenuItem>
                        <MenuItem value="python">Python</MenuItem>
                        <MenuItem value="java">Java</MenuItem>
                        <MenuItem value="sql">SQL</MenuItem>
                        <MenuItem value="bash">Bash</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Code"
                      value={blockForm.content?.code || ''}
                      onChange={(e) => setBlockForm({
                        ...blockForm,
                        content: { ...blockForm.content, code: e.target.value }
                      })}
                      multiline
                      rows={10}
                      sx={{ fontFamily: 'monospace' }}
                    />
                  </Grid>
                </Grid>
              )}

              {blockForm.block_type === 'try_it' && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={blockForm.content?.language || 'html'}
                        label="Language"
                        onChange={(e) => setBlockForm({
                          ...blockForm,
                          content: { ...blockForm.content, language: e.target.value }
                        })}
                      >
                        <MenuItem value="html">HTML</MenuItem>
                        <MenuItem value="css">CSS</MenuItem>
                        <MenuItem value="javascript">JavaScript</MenuItem>
                        <MenuItem value="python">Python</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Result Type</InputLabel>
                      <Select
                        value={blockForm.content?.result_type || 'html_preview'}
                        label="Result Type"
                        onChange={(e) => setBlockForm({
                          ...blockForm,
                          content: { ...blockForm.content, result_type: e.target.value }
                        })}
                      >
                        <MenuItem value="html_preview">HTML Preview</MenuItem>
                        <MenuItem value="console">Console Output</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Default Code"
                      value={blockForm.content?.default_code || ''}
                      onChange={(e) => setBlockForm({
                        ...blockForm,
                        content: { ...blockForm.content, default_code: e.target.value }
                      })}
                      multiline
                      rows={8}
                      sx={{ fontFamily: 'monospace' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Solution Code (optional)"
                      value={blockForm.content?.solution_code || ''}
                      onChange={(e) => setBlockForm({
                        ...blockForm,
                        content: { ...blockForm.content, solution_code: e.target.value }
                      })}
                      multiline
                      rows={6}
                      sx={{ fontFamily: 'monospace' }}
                    />
                  </Grid>
                </Grid>
              )}

              {(blockForm.block_type === 'note' || blockForm.block_type === 'warning' || blockForm.block_type === 'tip') && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title (optional)"
                      value={blockForm.content?.title || ''}
                      onChange={(e) => setBlockForm({
                        ...blockForm,
                        content: { ...blockForm.content, title: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Content"
                      value={blockForm.content?.text || ''}
                      onChange={(e) => setBlockForm({
                        ...blockForm,
                        content: { ...blockForm.content, text: e.target.value }
                      })}
                      multiline
                      rows={4}
                    />
                  </Grid>
                </Grid>
              )}

              {blockForm.block_type === 'image' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Image URL"
                      value={blockForm.content?.url || ''}
                      onChange={(e) => setBlockForm({
                        ...blockForm,
                        content: { ...blockForm.content, url: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Alt Text"
                      value={blockForm.content?.alt || ''}
                      onChange={(e) => setBlockForm({
                        ...blockForm,
                        content: { ...blockForm.content, alt: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Caption"
                      value={blockForm.content?.caption || ''}
                      onChange={(e) => setBlockForm({
                        ...blockForm,
                        content: { ...blockForm.content, caption: e.target.value }
                      })}
                    />
                  </Grid>
                </Grid>
              )}

              {blockForm.block_type === 'video' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Video URL (YouTube, Vimeo, etc.)"
                      value={blockForm.content?.url || ''}
                      onChange={(e) => setBlockForm({
                        ...blockForm,
                        content: { ...blockForm.content, url: e.target.value }
                      })}
                    />
                  </Grid>
                </Grid>
              )}

              {blockForm.block_type === 'list' && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>List Type</InputLabel>
                      <Select
                        value={blockForm.content?.type || 'unordered'}
                        label="List Type"
                        onChange={(e) => setBlockForm({
                          ...blockForm,
                          content: { ...blockForm.content, type: e.target.value }
                        })}
                      >
                        <MenuItem value="ordered">Ordered (1, 2, 3)</MenuItem>
                        <MenuItem value="unordered">Unordered (bullets)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="List Items (one per line)"
                      value={(blockForm.content?.items || []).join('\n')}
                      onChange={(e) => setBlockForm({
                        ...blockForm,
                        content: { ...blockForm.content, items: e.target.value.split('\n') }
                      })}
                      multiline
                      rows={6}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveBlock}>
            {editingBlock ? 'Update' : 'Add'} Block
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteDialog?.type} "{deleteDialog?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LearnAdmin;

