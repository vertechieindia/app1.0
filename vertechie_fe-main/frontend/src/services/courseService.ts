/**
 * Course Service
 * Handles learning platform operations with FastAPI backend
 */

import { api } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Types
export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string;
  short_description: string | null;
  category_id: string | null;
  category_name: string | null;
  tags: string[];
  difficulty: string;
  course_type: string;
  thumbnail: string | null;
  cover_image: string | null;
  intro_video: string | null;
  instructor_id: string | null;
  instructor_name: string | null;
  is_free: boolean;
  price: number;
  discount_price: number | null;
  estimated_hours: number;
  total_lessons: number;
  total_quizzes: number;
  total_projects: number;
  is_published: boolean;
  is_featured: boolean;
  allow_certificate: boolean;
  language: string;
  skills_required: string[];
  skills_gained: string[];
  enrollment_count: number;
  completion_count: number;
  average_rating: number;
  total_reviews: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseListItem {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  thumbnail: string | null;
  difficulty: string;
  course_type: string;
  is_free: boolean;
  price: number;
  estimated_hours: number;
  total_lessons: number;
  enrollment_count: number;
  average_rating: number;
  total_reviews: number;
  is_featured: boolean;
  instructor_name: string | null;
  created_at: string;
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  is_free_preview: boolean;
  lessons: LessonListItem[];
}

export interface LessonListItem {
  id: string;
  title: string;
  lesson_type: string;
  order: number;
  estimated_minutes: number;
  is_free_preview: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  lesson_type: string;
  content_html: string | null;
  content_markdown: string | null;
  estimated_minutes: number;
  video_url: string | null;
  video_duration_seconds: number;
  initial_code: string | null;
  language: string | null;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  course_title: string | null;
  course_thumbnail: string | null;
  status: string;
  progress_percentage: number;
  completed_lessons: number;
  completed_quizzes: number;
  is_paid: boolean;
  enrolled_at: string;
  started_at: string | null;
  completed_at: string | null;
  last_accessed_at: string | null;
  certificate_issued: boolean;
}

export interface CreateCourseData {
  title: string;
  description: string;
  subtitle?: string;
  short_description?: string;
  category_id?: string;
  tags?: string[];
  difficulty?: string;
  course_type?: string;
  thumbnail?: string;
  cover_image?: string;
  intro_video?: string;
  is_free?: boolean;
  price?: number;
  estimated_hours?: number;
  language?: string;
  skills_required?: string[];
  skills_gained?: string[];
  meta_title?: string;
  meta_description?: string;
}

export interface CourseListParams {
  skip?: number;
  limit?: number;
  search?: string;
  category?: string;
  difficulty?: string;
  is_free?: boolean;
  is_featured?: boolean;
}

// Course service
export const courseService = {
  /**
   * List courses with filters
   */
  listCourses: async (params?: CourseListParams): Promise<CourseListItem[]> => {
    return api.get<CourseListItem[]>(API_ENDPOINTS.COURSES.LIST, { params });
  },

  /**
   * Get course categories
   */
  getCategories: async (): Promise<CourseCategory[]> => {
    return api.get<CourseCategory[]>(API_ENDPOINTS.COURSES.CATEGORIES);
  },

  /**
   * Get course by ID
   */
  getCourse: async (courseId: string): Promise<Course> => {
    return api.get<Course>(API_ENDPOINTS.COURSES.GET(courseId));
  },

  /**
   * Get course curriculum (modules and lessons)
   */
  getCurriculum: async (courseId: string): Promise<Module[]> => {
    return api.get<Module[]>(API_ENDPOINTS.COURSES.CURRICULUM(courseId));
  },

  /**
   * Create a new course
   */
  createCourse: async (data: CreateCourseData): Promise<Course> => {
    return api.post<Course>(API_ENDPOINTS.COURSES.CREATE, data);
  },

  /**
   * Enroll in a course
   */
  enrollInCourse: async (courseId: string): Promise<{ message: string; enrollment_id: string }> => {
    return api.post(API_ENDPOINTS.COURSES.ENROLL(courseId));
  },

  /**
   * Get user's enrollments
   */
  getMyEnrollments: async (status?: string): Promise<Enrollment[]> => {
    return api.get<Enrollment[]>(API_ENDPOINTS.COURSES.MY_ENROLLMENTS, { params: { status } });
  },

  /**
   * Get lesson content
   */
  getLesson: async (lessonId: string): Promise<Lesson> => {
    return api.get<Lesson>(API_ENDPOINTS.COURSES.LESSON(lessonId));
  },

  /**
   * Mark lesson as completed
   */
  completeLesson: async (lessonId: string): Promise<{ message: string; course_progress: number }> => {
    return api.post(API_ENDPOINTS.COURSES.COMPLETE_LESSON(lessonId));
  },
};

export default courseService;

