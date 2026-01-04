/**
 * Services Index
 * Export all service modules for easy importing
 */

// API Client
export { api, isAuthenticated, getAccessToken, setTokens, clearTokens } from './apiClient';
export type { AuthTokens, ApiError, PaginatedResponse } from './apiClient';

// Auth Service
export { authService } from './authService';
export type { LoginCredentials, RegisterData, User, UserProfile } from './authService';

// User Service
export { userService } from './userService';
export type { UpdateUserData, UpdateProfileData, UserListParams } from './userService';

// Job Service
export { jobService } from './jobService';
export type { 
  Job, JobListItem, CreateJobData, UpdateJobData, 
  JobApplication, ApplyJobData, JobListParams 
} from './jobService';

// Course Service
export { courseService } from './courseService';
export type { 
  Course, CourseListItem, CourseCategory, Module, Lesson, 
  LessonListItem, Enrollment, CreateCourseData, CourseListParams 
} from './courseService';

// Calendar Service
export { calendarService } from './calendarService';
export type { 
  MeetingType, SchedulingLink, Booking, PublicScheduleInfo,
  CreateMeetingTypeData, CreateSchedulingLinkData, BookMeetingData, BookingListParams 
} from './calendarService';

// Chat Service
export { chatService } from './chatService';
export type { 
  Conversation, Message, CreateConversationData, 
  SendMessageData, MessageListParams 
} from './chatService';

// Network Service
export { networkService } from './networkService';
export type { 
  Connection, ConnectionRequest, SendRequestData, ConnectionListParams 
} from './networkService';

// Community Service
export { communityService } from './communityService';
export type { 
  Group, Post, Comment, CreateGroupData, 
  CreatePostData, CreateCommentData, GroupListParams, PostListParams 
} from './communityService';

// Legacy Services (for gradual migration)
export { default as CodeExecutionService } from './CodeExecutionService';
export { default as IDEService } from './IDEService';
