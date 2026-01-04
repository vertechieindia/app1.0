/**
 * Admin Course Management Page
 * 
 * Allows Super Admin and Learn Admin to create, edit, and manage courses
 */

import React, { useState, useEffect } from 'react';
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
  Divider,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Tooltip,
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
} from '@mui/icons-material';
import { useApi, useMutation } from '../../hooks/useApi';

// Types
interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  is_published: boolean;
  is_featured: boolean;
  is_free: boolean;
  total_lessons: number;
  enrollment_count: number;
  created_at: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  is_free_preview: boolean;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  lesson_type: string;
  estimated_minutes: number;
  is_free_preview: boolean;
  order: number;
  content_markdown?: string;
  initial_code?: string;
  solution_code?: string;
  language?: string;
}

interface CourseDetails extends Course {
  modules: Module[];
  category_id?: string;
  price?: number;
  estimated_hours?: number;
  thumbnail?: string;
  tags?: string[];
}

// API calls
const API_BASE = '/api/v1/courses';

const CourseManagement: React.FC = () => {
  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Dialogs
  const [courseDialog, setCourseDialog] = useState(false);
  const [moduleDialog, setModuleDialog] = useState(false);
  const [lessonDialog, setLessonDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ type: string; id: string; name: string } | null>(null);
  
  // Selected items
  const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  // Form states
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    short_description: '',
    difficulty: 'beginner',
    is_free: true,
    price: 0,
    estimated_hours: 0,
    tags: '',
  });
  
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    order: 0,
    is_free_preview: false,
  });
  
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    lesson_type: 'article',
    estimated_minutes: 10,
    is_free_preview: false,
    content_markdown: '',
    initial_code: '',
    solution_code: '',
    language: 'html',
  });
  
  // View mode
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (err) {
      setError('Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single course details
  const fetchCourseDetails = async (courseId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedCourse(data);
        setViewMode('edit');
      } else {
        setError('Failed to fetch course details');
      }
    } catch (err) {
      setError('Error fetching course details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // API helper
  const apiCall = async (url: string, method: string, body?: object) => {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'API call failed');
    }
    
    return response.json();
  };

  // Course CRUD
  const handleCreateCourse = async () => {
    try {
      const result = await apiCall(`${API_BASE}/admin/courses`, 'POST', {
        ...courseForm,
        tags: courseForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      setSuccess('Course created successfully!');
      setCourseDialog(false);
      setCourseForm({
        title: '',
        description: '',
        short_description: '',
        difficulty: 'beginner',
        is_free: true,
        price: 0,
        estimated_hours: 0,
        tags: '',
      });
      fetchCourses();
      // Open the new course for editing
      fetchCourseDetails(result.id);
    } catch (err: any) {
      setError(err.message || 'Failed to create course');
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;
    try {
      await apiCall(`${API_BASE}/admin/courses/${selectedCourse.id}`, 'PUT', courseForm);
      setSuccess('Course updated successfully!');
      fetchCourseDetails(selectedCourse.id);
    } catch (err: any) {
      setError(err.message || 'Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await apiCall(`${API_BASE}/admin/courses/${courseId}`, 'DELETE');
      setSuccess('Course deleted successfully!');
      setDeleteDialog(null);
      setViewMode('list');
      setSelectedCourse(null);
      fetchCourses();
    } catch (err: any) {
      setError(err.message || 'Failed to delete course');
    }
  };

  const handlePublishCourse = async (courseId: string, publish: boolean) => {
    try {
      await apiCall(`${API_BASE}/admin/courses/${courseId}`, 'PUT', {
        is_published: publish,
      });
      setSuccess(publish ? 'Course published!' : 'Course unpublished');
      fetchCourses();
      if (selectedCourse) {
        fetchCourseDetails(courseId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update course');
    }
  };

  // Module CRUD
  const handleCreateModule = async () => {
    if (!selectedCourse) return;
    try {
      await apiCall(`${API_BASE}/admin/courses/${selectedCourse.id}/modules`, 'POST', moduleForm);
      setSuccess('Module created successfully!');
      setModuleDialog(false);
      setModuleForm({ title: '', description: '', order: 0, is_free_preview: false });
      fetchCourseDetails(selectedCourse.id);
    } catch (err: any) {
      setError(err.message || 'Failed to create module');
    }
  };

  const handleUpdateModule = async () => {
    if (!selectedModule) return;
    try {
      await apiCall(`${API_BASE}/admin/modules/${selectedModule.id}`, 'PUT', moduleForm);
      setSuccess('Module updated successfully!');
      setModuleDialog(false);
      if (selectedCourse) {
        fetchCourseDetails(selectedCourse.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update module');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      await apiCall(`${API_BASE}/admin/modules/${moduleId}`, 'DELETE');
      setSuccess('Module deleted successfully!');
      setDeleteDialog(null);
      if (selectedCourse) {
        fetchCourseDetails(selectedCourse.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete module');
    }
  };

  // Lesson CRUD
  const handleCreateLesson = async () => {
    if (!selectedModule) return;
    try {
      await apiCall(`${API_BASE}/admin/modules/${selectedModule.id}/lessons`, 'POST', lessonForm);
      setSuccess('Lesson created successfully!');
      setLessonDialog(false);
      setLessonForm({
        title: '',
        description: '',
        lesson_type: 'article',
        estimated_minutes: 10,
        is_free_preview: false,
        content_markdown: '',
        initial_code: '',
        solution_code: '',
        language: 'html',
      });
      if (selectedCourse) {
        fetchCourseDetails(selectedCourse.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create lesson');
    }
  };

  const handleUpdateLesson = async () => {
    if (!selectedLesson) return;
    try {
      await apiCall(`${API_BASE}/admin/lessons/${selectedLesson.id}`, 'PUT', lessonForm);
      setSuccess('Lesson updated successfully!');
      setLessonDialog(false);
      if (selectedCourse) {
        fetchCourseDetails(selectedCourse.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update lesson');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await apiCall(`${API_BASE}/admin/lessons/${lessonId}`, 'DELETE');
      setSuccess('Lesson deleted successfully!');
      setDeleteDialog(null);
      if (selectedCourse) {
        fetchCourseDetails(selectedCourse.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete lesson');
    }
  };

  // Open dialogs with edit data
  const openEditModule = (module: Module) => {
    setSelectedModule(module);
    setModuleForm({
      title: module.title,
      description: module.description || '',
      order: module.order,
      is_free_preview: module.is_free_preview,
    });
    setModuleDialog(true);
  };

  const openEditLesson = (lesson: Lesson, module: Module) => {
    setSelectedModule(module);
    setSelectedLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description || '',
      lesson_type: lesson.lesson_type,
      estimated_minutes: lesson.estimated_minutes,
      is_free_preview: lesson.is_free_preview,
      content_markdown: lesson.content_markdown || '',
      initial_code: lesson.initial_code || '',
      solution_code: lesson.solution_code || '',
      language: lesson.language || 'html',
    });
    setLessonDialog(true);
  };

  const openAddLesson = (module: Module) => {
    setSelectedModule(module);
    setSelectedLesson(null);
    setLessonForm({
      title: '',
      description: '',
      lesson_type: 'article',
      estimated_minutes: 10,
      is_free_preview: false,
      content_markdown: '',
      initial_code: '',
      solution_code: '',
      language: 'html',
    });
    setLessonDialog(true);
  };

  // Render lesson type icon
  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayIcon fontSize="small" />;
      case 'interactive': return <CodeIcon fontSize="small" />;
      case 'quiz': return <QuizIcon fontSize="small" />;
      default: return <ArticleIcon fontSize="small" />;
    }
  };

  // Render Course List View
  const renderCourseList = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon /> Course Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCourseDialog(true)}
          sx={{ bgcolor: '#0d47a1' }}
        >
          Create Course
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell><strong>Course Title</strong></TableCell>
                <TableCell><strong>Difficulty</strong></TableCell>
                <TableCell><strong>Lessons</strong></TableCell>
                <TableCell><strong>Enrollments</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No courses yet. Create your first course!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id} hover>
                    <TableCell>
                      <Box>
                        <Typography fontWeight="500">{course.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {course.slug}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={course.difficulty}
                        size="small"
                        color={
                          course.difficulty === 'beginner' ? 'success' :
                          course.difficulty === 'intermediate' ? 'warning' :
                          course.difficulty === 'advanced' ? 'error' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>{course.total_lessons}</TableCell>
                    <TableCell>{course.enrollment_count}</TableCell>
                    <TableCell>
                      <Chip
                        label={course.is_published ? 'Published' : 'Draft'}
                        size="small"
                        color={course.is_published ? 'success' : 'default'}
                        variant={course.is_published ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Course">
                        <IconButton onClick={() => fetchCourseDetails(course.id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={course.is_published ? 'Unpublish' : 'Publish'}>
                        <IconButton 
                          onClick={() => handlePublishCourse(course.id, !course.is_published)}
                          color={course.is_published ? 'success' : 'default'}
                        >
                          {course.is_published ? <PublishIcon /> : <UnpublishedIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Course">
                        <IconButton 
                          color="error"
                          onClick={() => setDeleteDialog({ type: 'course', id: course.id, name: course.title })}
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
      )}
    </Box>
  );

  // Render Course Edit View
  const renderCourseEdit = () => {
    if (!selectedCourse) return null;

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Button onClick={() => { setViewMode('list'); setSelectedCourse(null); }} sx={{ mb: 1 }}>
              ← Back to Courses
            </Button>
            <Typography variant="h4">{selectedCourse.title}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color={selectedCourse.is_published ? 'warning' : 'success'}
              startIcon={selectedCourse.is_published ? <UnpublishedIcon /> : <PublishIcon />}
              onClick={() => handlePublishCourse(selectedCourse.id, !selectedCourse.is_published)}
            >
              {selectedCourse.is_published ? 'Unpublish' : 'Publish'}
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialog({ type: 'course', id: selectedCourse.id, name: selectedCourse.title })}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Course Info Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Course Info</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography><strong>Slug:</strong> {selectedCourse.slug}</Typography>
                  <Typography><strong>Difficulty:</strong> {selectedCourse.difficulty}</Typography>
                  <Typography><strong>Lessons:</strong> {selectedCourse.total_lessons}</Typography>
                  <Typography><strong>Hours:</strong> {selectedCourse.estimated_hours || 0}h</Typography>
                  <Typography><strong>Price:</strong> {selectedCourse.is_free ? 'Free' : `$${selectedCourse.price}`}</Typography>
                  <Chip
                    label={selectedCourse.is_published ? 'Published' : 'Draft'}
                    color={selectedCourse.is_published ? 'success' : 'default'}
                    sx={{ alignSelf: 'flex-start', mt: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Modules & Lessons */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  <BookIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Modules & Lessons
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setSelectedModule(null);
                    setModuleForm({ title: '', description: '', order: 0, is_free_preview: false });
                    setModuleDialog(true);
                  }}
                >
                  Add Module
                </Button>
              </Box>

              {selectedCourse.modules.length === 0 ? (
                <Alert severity="info">
                  No modules yet. Add a module to start creating lessons.
                </Alert>
              ) : (
                selectedCourse.modules.map((module, index) => (
                  <Accordion key={module.id} defaultExpanded={index === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 2 }}>
                        <DragIcon sx={{ color: 'text.secondary' }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight="500">
                            Module {module.order}: {module.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {module.lessons.length} lessons
                            {module.is_free_preview && ' • Free Preview'}
                          </Typography>
                        </Box>
                        <IconButton 
                          size="small" 
                          onClick={(e) => { e.stopPropagation(); openEditModule(module); }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setDeleteDialog({ type: 'module', id: module.id, name: module.title });
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {module.lessons.length === 0 ? (
                          <ListItem>
                            <ListItemText 
                              primary="No lessons yet" 
                              secondary="Add lessons to this module"
                            />
                          </ListItem>
                        ) : (
                          module.lessons.map((lesson) => (
                            <ListItem key={lesson.id} divider>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                                {getLessonTypeIcon(lesson.lesson_type)}
                              </Box>
                              <ListItemText
                                primary={lesson.title}
                                secondary={`${lesson.estimated_minutes} min • ${lesson.lesson_type}${lesson.is_free_preview ? ' • Free' : ''}`}
                              />
                              <ListItemSecondaryAction>
                                <IconButton 
                                  size="small"
                                  onClick={() => openEditLesson(lesson, module)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => setDeleteDialog({ type: 'lesson', id: lesson.id, name: lesson.title })}
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
                        onClick={() => openAddLesson(module)}
                        sx={{ mt: 1 }}
                      >
                        Add Lesson to this Module
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
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Success/Error Messages */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      {/* Main Content */}
      {viewMode === 'list' ? renderCourseList() : renderCourseEdit()}

      {/* Create/Edit Course Dialog */}
      <Dialog open={courseDialog} onClose={() => setCourseDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Course</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Title"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                value={courseForm.short_description}
                onChange={(e) => setCourseForm({ ...courseForm, short_description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={courseForm.difficulty}
                  label="Difficulty"
                  onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                  <MenuItem value="expert">Expert</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Estimated Hours"
                type="number"
                value={courseForm.estimated_hours}
                onChange={(e) => setCourseForm({ ...courseForm, estimated_hours: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={courseForm.is_free}
                    onChange={(e) => setCourseForm({ ...courseForm, is_free: e.target.checked })}
                  />
                }
                label="Free Course"
              />
            </Grid>
            <Grid item xs={6}>
              {!courseForm.is_free && (
                <TextField
                  fullWidth
                  label="Price ($)"
                  type="number"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: parseFloat(e.target.value) || 0 })}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma separated)"
                value={courseForm.tags}
                onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value })}
                placeholder="python, programming, beginner"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCourseDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateCourse}
            disabled={!courseForm.title || !courseForm.description}
          >
            Create Course
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Module Dialog */}
      <Dialog open={moduleDialog} onClose={() => setModuleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedModule ? 'Edit Module' : 'Create Module'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Module Title"
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={moduleForm.description}
                onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Order"
                type="number"
                value={moduleForm.order}
                onChange={(e) => setModuleForm({ ...moduleForm, order: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={moduleForm.is_free_preview}
                    onChange={(e) => setModuleForm({ ...moduleForm, is_free_preview: e.target.checked })}
                  />
                }
                label="Free Preview"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModuleDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={selectedModule ? handleUpdateModule : handleCreateModule}
            disabled={!moduleForm.title}
          >
            {selectedModule ? 'Update' : 'Create'} Module
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Lesson Dialog */}
      <Dialog open={lessonDialog} onClose={() => setLessonDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{selectedLesson ? 'Edit Lesson' : 'Create Lesson'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lesson Title"
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6} md={3}>
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
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Duration (min)"
                type="number"
                value={lessonForm.estimated_minutes}
                onChange={(e) => setLessonForm({ ...lessonForm, estimated_minutes: parseInt(e.target.value) || 10 })}
              />
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
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Lesson Content (Markdown)</Typography>
              <TextField
                fullWidth
                value={lessonForm.content_markdown}
                onChange={(e) => setLessonForm({ ...lessonForm, content_markdown: e.target.value })}
                multiline
                rows={10}
                placeholder={`# Lesson Title

Write your lesson content here using Markdown.

## Section 1

Your content...

\`\`\`python
# Code example
print("Hello World")
\`\`\`
`}
                sx={{ fontFamily: 'monospace' }}
              />
            </Grid>
            {(lessonForm.lesson_type === 'interactive' || lessonForm.lesson_type === 'article') && (
              <>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Code Language</InputLabel>
                    <Select
                      value={lessonForm.language}
                      label="Code Language"
                      onChange={(e) => setLessonForm({ ...lessonForm, language: e.target.value })}
                    >
                      <MenuItem value="html">HTML</MenuItem>
                      <MenuItem value="css">CSS</MenuItem>
                      <MenuItem value="javascript">JavaScript</MenuItem>
                      <MenuItem value="typescript">TypeScript</MenuItem>
                      <MenuItem value="python">Python</MenuItem>
                      <MenuItem value="java">Java</MenuItem>
                      <MenuItem value="csharp">C#</MenuItem>
                      <MenuItem value="sql">SQL</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
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
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Try It Yourself Code</Typography>
                  <TextField
                    fullWidth
                    value={lessonForm.initial_code}
                    onChange={(e) => setLessonForm({ ...lessonForm, initial_code: e.target.value })}
                    multiline
                    rows={6}
                    placeholder="Enter the starter code for 'Try It Yourself' section"
                    sx={{ fontFamily: 'monospace' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Solution Code (Optional)</Typography>
                  <TextField
                    fullWidth
                    value={lessonForm.solution_code}
                    onChange={(e) => setLessonForm({ ...lessonForm, solution_code: e.target.value })}
                    multiline
                    rows={6}
                    placeholder="Enter the solution code"
                    sx={{ fontFamily: 'monospace' }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLessonDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={selectedLesson ? handleUpdateLesson : handleCreateLesson}
            disabled={!lessonForm.title}
          >
            {selectedLesson ? 'Update' : 'Create'} Lesson
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the {deleteDialog?.type} "{deleteDialog?.name}"?
            {deleteDialog?.type === 'course' && ' This will also delete all modules and lessons.'}
            {deleteDialog?.type === 'module' && ' This will also delete all lessons in this module.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={() => {
              if (deleteDialog?.type === 'course') handleDeleteCourse(deleteDialog.id);
              else if (deleteDialog?.type === 'module') handleDeleteModule(deleteDialog.id);
              else if (deleteDialog?.type === 'lesson') handleDeleteLesson(deleteDialog.id);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseManagement;

