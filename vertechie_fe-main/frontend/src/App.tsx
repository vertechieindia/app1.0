import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppHeader from './components/layout/AppHeader';
import BottomNav from './components/layout/BottomNav';
import Home from './pages/Home';
import About from './pages/About';
import HR from './pages/HR';
import SuperAdmin from './pages/SuperAdmin';
import { TechieAdminDashboard, HMAdminDashboard, CompanyAdminDashboard, SchoolAdminDashboard } from './pages/RoleAdminDashboard';
import BDMAdminDashboard from './pages/BDMAdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Networking from './pages/Networking';
import Network from './pages/Network';
import NetworkFeed from './pages/network/NetworkFeed';
import MyNetwork from './pages/network/MyNetwork';
import NetworkGroups from './pages/network/NetworkGroups';
import NetworkEvents from './pages/network/NetworkEvents';
import Combinator from './pages/network/Combinator';
import Companies from './pages/Companies';
import Contact from './pages/Contact';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TechieSignup from './components/auth/TechieSignup';
import SignupSuccess from './pages/SignupSuccess';
import Verification from './pages/Verification';
import PostJob from './pages/companies/PostJob';
import TalentSearch from './pages/companies/TalentSearch';
import Advertise from './pages/companies/Advertise';
import Enterprise from './pages/companies/Enterprise';
import ContactSales from './pages/companies/ContactSales';
import Pricing from './pages/Pricing';
import Support from './pages/Support';
import Accessibility from './pages/Accessibility';
import CookiePolicy from './pages/CookiePolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import theme from './styles/theme';
import ScrollToTop from './components/layout/ScrollToTop';
import './index.css';
import Terms from './components/pages/Terms';
import Privacy from './components/pages/Privacy';
import Cookies from './components/pages/Cookies';
import StatusProcessing from './pages/StatusProcessing';
import StatusAccepted from './pages/StatusAccepted';
import StatusRejected from './pages/StatusRejected';
import ResetPassword from './pages/ResetPassword';
import CompleteProfile from './pages/CompleteProfile';
import Admin from './pages/Admin';
import IdleTimeoutProvider from './components/auth/IdleTimeoutProvider';

// HR Pages
import HRDashboard from './pages/hr/HRDashboard';
import CreateJobPost from './pages/hr/CreateJobPost';
import ViewApplicants from './pages/hr/ViewApplicants';

// Admin Pages
import CourseManagement from './pages/admin/CourseManagement';
import LearnAdmin from './pages/admin/LearnAdmin';

// User/Techie Pages
import JobListings from './pages/user/JobListings';
import JobDetails from './pages/user/JobDetails';
import CodingTest from './pages/user/CodingTest';
import JobApply from './pages/user/JobApply';
import MyApplications from './pages/user/MyApplications';

// Techie Platform Pages (Phase 1-4)
import { TechieDashboard, CodingProblems, ProblemDetail, ProblemsPage, IDEPage, Chat, CompanyPageManagement, SchoolPageManagement, ATSPage, SchedulingPage, CalendarView } from './pages/techie';
import ProfilePage from './pages/techie/ProfilePage';
import Learn from './pages/techie/Learn';
import Blogs from './pages/techie/Blogs';
import SearchResults from './pages/techie/SearchResults';
import Notifications from './pages/techie/Notifications';
import CourseDetail from './pages/techie/CourseDetail';
import TutorialPage from './pages/techie/TutorialPage';
import QuizPage from './pages/techie/QuizPage';
import VideoRoom from './pages/techie/VideoRoom';
import MeetingLobby from './pages/techie/MeetingLobby';
import ScheduleInterview from './pages/techie/ScheduleInterview';

// ATS Pages (Separate Routes)
import {
  PipelinePage,
  JobPostingsPage,
  AllCandidatesPage,
  CandidateProfilePage,
  InterviewsPage,
  SchedulingPage as ATSSchedulingPage,
  CalendarPage as ATSCalendarPage,
  AnalyticsPage,
} from './pages/techie/ats';

// Interview Lobby (VerTechie Meet)
import InterviewLobby from './pages/techie/lobby/InterviewLobby';

// SMS (School Management System) Pages
import {
  SMSPosts,
  SMSAlumni,
  SMSPrograms,
  SMSPlacements,
  SMSPageAdmins,
  SMSAnalytics,
  SMSSettings,
} from './pages/techie/sms';

// CMS (Company Management System) Pages
import {
  CMSPosts,
  CMSEmployees,
  CMSPageAdmins as CMSAdmins,
  CMSJobs,
  CMSAnalytics,
  CMSSettings,
} from './pages/techie/cms';

// Public Pages
import PublicSchedulingPage from './pages/public/PublicSchedulingPage';

/**
 * PublicLayout - For unauthenticated pages (Home, About, Login, etc.)
 */
const PublicLayout: React.FC = () => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    minHeight: '100vh', 
    width: '100%', 
    maxWidth: '100vw',
    overflowX: 'hidden',
    background: theme.palette.background.gradient,
  }}>
    <Navbar />
    <Box component="main" sx={{ 
      flexGrow: 1, 
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden'
    }}>
      <Outlet />
    </Box>
    <Footer />
  </Box>
);

/**
 * AuthenticatedLayout - For logged-in users with role-based navigation
 * Includes: AppHeader (top, fixed 64px) + BottomNav (fixed bottom 80px)
 * 
 * IMPORTANT: This layout handles ALL spacing for the fixed header and bottom nav.
 * Child pages should NOT add their own top/bottom padding for these elements.
 */
const HEADER_HEIGHT = 64;
const BOTTOM_NAV_HEIGHT = 80;

const AuthenticatedLayout: React.FC = () => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    minHeight: '100vh', 
    width: '100%', 
    maxWidth: '100vw',
    overflowX: 'hidden',
    background: 'linear-gradient(180deg, #f0f4f8 0%, #e8eef5 100%)',
    bgcolor: '#f0f4f8',
  }}>
    <AppHeader />
    <Box component="main" sx={{ 
      flexGrow: 1, 
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      pt: `${HEADER_HEIGHT + 16}px`, // 80px - Account for fixed header (64px) + spacing (16px)
      pb: `${BOTTOM_NAV_HEIGHT + 16}px`, // 96px - Account for fixed bottom nav (80px) + spacing (16px)
    }}>
      <Outlet />
    </Box>
    <BottomNav />
  </Box>
);

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <IdleTimeoutProvider>
        <ScrollToTop />
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/hr" element={<HR />} />
            <Route path="/networking" element={<Networking />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/techie-signup" element={<TechieSignup />} />
            <Route path="/signup-success" element={<SignupSuccess />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Status Routes */}
            <Route path="/status/processing" element={<StatusProcessing />} />
            <Route path="/status/accepted" element={<StatusAccepted />} />
            <Route path="/status/rejected" element={<StatusRejected />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Profile Completion Route */}
            <Route path="/complete-profile" element={<CompleteProfile />} />
            
            {/* Company Info Routes */}
            <Route path="/companies/post-job" element={<PostJob />} />
            <Route path="/companies/talent-search" element={<TalentSearch />} />
            <Route path="/companies/advertise" element={<Advertise />} />
            <Route path="/companies/enterprise" element={<Enterprise />} />
            <Route path="/companies/contact-sales" element={<ContactSales />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Public Jobs */}
            <Route path="/jobs" element={<JobListings />} />
            <Route path="/jobs/:jobId" element={<JobDetails />} />
            
            {/* Legal & Support */}
            <Route path="/support" element={<Support />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            
            {/* Redirect /admin to /super-admin */}
            <Route path="/admin" element={<Navigate to="/super-admin" replace />} />
          </Route>
          
          {/* ========== AUTHENTICATED ROUTES ========== */}
          <Route element={<AuthenticatedLayout />}>
            
            {/* ========== ADMIN ROUTES (Under /vertechie/) ========== */}
            
            {/* Super Admin - Full Platform Control */}
            <Route path="/vertechie/super-admin" element={
              <ProtectedRoute requiredRole="superadmin">
                <SuperAdmin />
              </ProtectedRoute>
            } />
            <Route path="/vertechie/super-admin/*" element={
              <ProtectedRoute requiredRole="superadmin">
                <SuperAdmin />
              </ProtectedRoute>
            } />
            
            {/* Company Admin - Manages Company Registrations & Approvals */}
            <Route path="/vertechie/companyadmin" element={
              <ProtectedRoute requiredRole="admin">
                <CompanyAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/vertechie/companyadmin/*" element={
              <ProtectedRoute requiredRole="admin">
                <CompanyAdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* School Admin - Manages School Registrations & Approvals */}
            <Route path="/vertechie/schooladmin" element={
              <ProtectedRoute requiredRole="admin">
                <SchoolAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/vertechie/schooladmin/*" element={
              <ProtectedRoute requiredRole="admin">
                <SchoolAdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Techie Admin - Manages Tech Professional Registrations & Approvals */}
            <Route path="/vertechie/techieadmin" element={
              <ProtectedRoute requiredRole="admin">
                <TechieAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/vertechie/techieadmin/*" element={
              <ProtectedRoute requiredRole="admin">
                <TechieAdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Hiring Manager Admin - Manages HM Registrations & Approvals */}
            <Route path="/vertechie/hiringmanageradmin" element={
              <ProtectedRoute requiredRole="admin">
                <HMAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/vertechie/hiringmanageradmin/*" element={
              <ProtectedRoute requiredRole="admin">
                <HMAdminDashboard />
              </ProtectedRoute>
            } />
            {/* Short alias for HM Admin */}
            <Route path="/vertechie/hmadmin" element={
              <ProtectedRoute requiredRole="admin">
                <HMAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/vertechie/hmadmin/*" element={
              <ProtectedRoute requiredRole="admin">
                <HMAdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* BDM Admin */}
            <Route path="/vertechie/bdmadmin" element={
              <ProtectedRoute requiredRole="admin">
                <BDMAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/vertechie/bdmadmin/*" element={
              <ProtectedRoute requiredRole="admin">
                <BDMAdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Multi-Role Admin - For admins with multiple roles */}
            <Route path="/vertechie/admin" element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/vertechie/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            } />
            
            {/* Learn Admin - Complete Course Management System */}
            <Route path="/vertechie/learn-admin" element={
              <ProtectedRoute requiredRole="admin">
                <LearnAdmin />
              </ProtectedRoute>
            } />
            <Route path="/vertechie/learn-admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <LearnAdmin />
              </ProtectedRoute>
            } />
            <Route path="/vertechie/courses" element={
              <ProtectedRoute requiredRole="admin">
                <LearnAdmin />
              </ProtectedRoute>
            } />
            <Route path="/vertechie/course-management" element={
              <ProtectedRoute requiredRole="admin">
                <LearnAdmin />
              </ProtectedRoute>
            } />
            
            {/* Legacy Course Management (Simple Version) */}
            <Route path="/vertechie/course-simple" element={
              <ProtectedRoute requiredRole="admin">
                <CourseManagement />
              </ProtectedRoute>
            } />
            
            {/* Legacy routes - redirect to new structure */}
            <Route path="/super-admin" element={
              <ProtectedRoute requiredRole="superadmin">
                <SuperAdmin />
              </ProtectedRoute>
            } />
            <Route path="/super-admin/*" element={
              <ProtectedRoute requiredRole="superadmin">
                <SuperAdmin />
              </ProtectedRoute>
            } />
            
            {/* HR Routes */}
            <Route path="/hr/dashboard" element={<HRDashboard />} />
            <Route path="/hr/feed" element={<Navigate to="/techie/home/feed" replace />} />
            <Route path="/hr/jobs" element={<HRDashboard />} />
            <Route path="/hr/candidates" element={<HRDashboard />} />
            <Route path="/hr/interviews" element={<HRDashboard />} />
            <Route path="/hr/analytics" element={<HRDashboard />} />
            <Route path="/hr/chat" element={<Chat />} />
            <Route path="/hr/alerts" element={<Notifications />} />
            <Route path="/hr/profile" element={<ProfilePage />} />
            <Route path="/hr/saved" element={<HRDashboard />} />
            <Route path="/hr/settings" element={<HRDashboard />} />
            <Route path="/hr/help" element={<HRDashboard />} />
            <Route path="/hr/create-job" element={<CreateJobPost />} />
            <Route path="/hr/job/:jobId/edit" element={<CreateJobPost />} />
            <Route path="/hr/job/:jobId/applicants" element={<ViewApplicants />} />
            
            {/* Hiring Manager Routes */}
            <Route path="/hm/dashboard" element={<HRDashboard />} />
            <Route path="/hm/jobs" element={<HRDashboard />} />
            <Route path="/hm/candidates" element={<HRDashboard />} />
            <Route path="/hm/assessments" element={<HRDashboard />} />
            <Route path="/hm/interviews" element={<HRDashboard />} />
            <Route path="/hm/analytics" element={<HRDashboard />} />
            
            {/* User Applications */}
            <Route path="/jobs/:jobId/apply" element={
              <ProtectedRoute requiredRole="user">
                <JobApply />
              </ProtectedRoute>
            } />
            <Route path="/my-applications" element={
              <ProtectedRoute requiredRole="user">
                <MyApplications />
              </ProtectedRoute>
            } />
            
            {/* ========== TECHIE PLATFORM ROUTES ========== */}
            <Route path="/techie" element={
              <Navigate to="/techie/home/feed" replace />
            } />
            <Route path="/techie/dashboard" element={
              <ProtectedRoute requiredRole="user">
                <TechieDashboard />
              </ProtectedRoute>
            } />
            
            {/* Jobs Section */}
            <Route path="/techie/jobs" element={
              <ProtectedRoute requiredRole="user">
                <JobListings />
              </ProtectedRoute>
            } />
            <Route path="/techie/jobs/:jobId" element={
              <ProtectedRoute requiredRole="user">
                <JobDetails />
              </ProtectedRoute>
            } />
            <Route path="/techie/jobs/:jobId/apply" element={
              <ProtectedRoute requiredRole="user">
                <JobApply />
              </ProtectedRoute>
            } />
            <Route path="/techie/my-applications" element={
              <ProtectedRoute requiredRole="user">
                <MyApplications />
              </ProtectedRoute>
            } />
            
            {/* Practice Section */}
            <Route path="/techie/practice" element={
              <ProtectedRoute requiredRole="user">
                <ProblemsPage />
              </ProtectedRoute>
            } />
            <Route path="/techie/problems" element={
              <ProtectedRoute requiredRole="user">
                <ProblemsPage />
              </ProtectedRoute>
            } />
            <Route path="/techie/problems/:slug" element={
              <ProtectedRoute requiredRole="user">
                <ProblemDetail />
              </ProtectedRoute>
            } />
            <Route path="/techie/coding-problems" element={
              <ProtectedRoute requiredRole="user">
                <CodingProblems />
              </ProtectedRoute>
            } />
            <Route path="/techie/contests" element={
              <ProtectedRoute requiredRole="user">
                <TechieDashboard />
              </ProtectedRoute>
            } />
            
            {/* Network is now the Home page - redirects handled below */}
            <Route path="/techie/network" element={
              <Navigate to="/techie/home" replace />
            } />
            <Route path="/techie/network/*" element={
              <Navigate to="/techie/home" replace />
            } />
            
            {/* Community Section - Redirects to Network pages */}
            <Route path="/techie/community" element={
              <Navigate to="/techie/home/feed" replace />
            } />
            <Route path="/techie/groups" element={
              <Navigate to="/techie/home/groups" replace />
            } />
            <Route path="/techie/feed" element={
              <Navigate to="/techie/home/feed" replace />
            } />
            
            {/* Learn Section */}
            <Route path="/techie/learn" element={
              <ProtectedRoute requiredRole="user">
                <Learn />
              </ProtectedRoute>
            } />
            <Route path="/techie/learn/tutorial/:tutorialSlug" element={
              <ProtectedRoute requiredRole="user">
                <TutorialPage />
              </ProtectedRoute>
            } />
            <Route path="/techie/learn/tutorial/:tutorialSlug/:lessonSlug" element={
              <ProtectedRoute requiredRole="user">
                <TutorialPage />
              </ProtectedRoute>
            } />
            <Route path="/techie/learn/quiz/:tutorialSlug/:lessonSlug" element={
              <ProtectedRoute requiredRole="user">
                <QuizPage />
              </ProtectedRoute>
            } />
            <Route path="/techie/learn/quiz/:tutorialSlug" element={
              <ProtectedRoute requiredRole="user">
                <QuizPage />
              </ProtectedRoute>
            } />
            <Route path="/techie/learn/:courseId" element={
              <ProtectedRoute requiredRole="user">
                <CourseDetail />
              </ProtectedRoute>
            } />
            <Route path="/techie/learn/:courseId/lesson/:lessonId" element={
              <ProtectedRoute requiredRole="user">
                <CourseDetail />
              </ProtectedRoute>
            } />
            <Route path="/techie/learning" element={
              <ProtectedRoute requiredRole="user">
                <Learn />
              </ProtectedRoute>
            } />
            
            {/* Other Techie Pages */}
            <Route path="/techie/achievements" element={
              <ProtectedRoute requiredRole="user">
                <TechieDashboard />
              </ProtectedRoute>
            } />
            <Route path="/techie/messages" element={
              <ProtectedRoute requiredRole="user">
                <TechieDashboard />
              </ProtectedRoute>
            } />
            <Route path="/techie/assessments" element={
              <ProtectedRoute requiredRole="user">
                <TechieDashboard />
              </ProtectedRoute>
            } />
            
            {/* Chat Section */}
            <Route path="/techie/chat" element={
              <ProtectedRoute requiredRole="user">
                <Chat />
              </ProtectedRoute>
            } />
            
            {/* Home - Network Hub with separate pages for each section */}
            <Route path="/techie/home" element={
              <Navigate to="/techie/home/feed" replace />
            } />
            <Route path="/techie/home/feed" element={
              <ProtectedRoute requiredRole="user">
                <NetworkFeed />
              </ProtectedRoute>
            } />
            <Route path="/techie/home/network" element={
              <ProtectedRoute requiredRole="user">
                <MyNetwork />
              </ProtectedRoute>
            } />
            <Route path="/techie/home/groups" element={
              <ProtectedRoute requiredRole="user">
                <NetworkGroups />
              </ProtectedRoute>
            } />
            <Route path="/techie/home/events" element={
              <ProtectedRoute requiredRole="user">
                <NetworkEvents />
              </ProtectedRoute>
            } />
            <Route path="/techie/home/combinator" element={
              <ProtectedRoute requiredRole="user">
                <Combinator />
              </ProtectedRoute>
            } />
            
            {/* Create Company/School Pages (for Tech Professionals & Hiring Managers) */}
            <Route path="/techie/create-company" element={
              <ProtectedRoute requiredRole="user">
                <TechieDashboard />
              </ProtectedRoute>
            } />
            <Route path="/techie/create-school" element={
              <ProtectedRoute requiredRole="user">
                <TechieDashboard />
              </ProtectedRoute>
            } />
            
            {/* User Settings & Saved */}
            <Route path="/techie/settings" element={
              <ProtectedRoute requiredRole="user">
                <TechieDashboard />
              </ProtectedRoute>
            } />
            <Route path="/techie/saved" element={
              <ProtectedRoute requiredRole="user">
                <TechieDashboard />
              </ProtectedRoute>
            } />
            <Route path="/techie/help" element={
              <ProtectedRoute requiredRole="user">
                <TechieDashboard />
              </ProtectedRoute>
            } />
            
            {/* ========== USER-SIDE MANAGEMENT PAGES ========== */}
            
            {/* ATS - Applicant Tracking System (Separate Pages for Better Usability) */}
            <Route path="/techie/ats" element={
              <ProtectedRoute requiredRole="user">
                <PipelinePage />
              </ProtectedRoute>
            } />
            <Route path="/techie/ats/pipeline" element={
              <ProtectedRoute requiredRole="user">
                <PipelinePage />
              </ProtectedRoute>
            } />
            <Route path="/techie/ats/jobpostings" element={
              <ProtectedRoute requiredRole="user">
                <JobPostingsPage />
              </ProtectedRoute>
            } />
            <Route path="/techie/ats/allcandidates" element={
              <ProtectedRoute requiredRole="user">
                <AllCandidatesPage />
              </ProtectedRoute>
            } />
            <Route path="/techie/ats/candidate/:candidateId" element={
              <ProtectedRoute requiredRole="user">
                <CandidateProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/techie/ats/interviews" element={
              <ProtectedRoute requiredRole="user">
                <InterviewsPage />
              </ProtectedRoute>
            } />
            <Route path="/techie/ats/scheduling" element={
              <ProtectedRoute requiredRole="user">
                <ATSSchedulingPage />
              </ProtectedRoute>
            } />
            <Route path="/techie/ats/calendar" element={
              <ProtectedRoute requiredRole="user">
                <ATSCalendarPage />
              </ProtectedRoute>
            } />
            <Route path="/techie/ats/analytics" element={
              <ProtectedRoute requiredRole="user">
                <AnalyticsPage />
              </ProtectedRoute>
            } />

            {/* Video Conferencing Routes */}
            <Route path="/techie/lobby/interview-:meetingId" element={
              <ProtectedRoute requiredRole="user">
                <InterviewLobby />
              </ProtectedRoute>
            } />
            <Route path="/techie/lobby/:roomId" element={
              <ProtectedRoute requiredRole="user">
                <MeetingLobby />
              </ProtectedRoute>
            } />
            <Route path="/techie/meet/:roomId" element={
              <ProtectedRoute requiredRole="user">
                <VideoRoom />
              </ProtectedRoute>
            } />
            <Route path="/techie/schedule-interview" element={
              <ProtectedRoute requiredRole="user">
                <ScheduleInterview />
              </ProtectedRoute>
            } />
            
            {/* Scheduling - Calendar & Scheduling (Calendly-like) */}
            <Route path="/techie/scheduling" element={
              <ProtectedRoute requiredRole="user">
                <SchedulingPage />
              </ProtectedRoute>
            } />
            <Route path="/techie/scheduling/*" element={
              <ProtectedRoute requiredRole="user">
                <SchedulingPage />
              </ProtectedRoute>
            } />
            
            {/* Calendar View - Full Calendar with Events */}
            <Route path="/techie/calendar" element={
              <ProtectedRoute requiredRole="user">
                <CalendarView />
              </ProtectedRoute>
            } />
            <Route path="/techie/calendar/*" element={
              <ProtectedRoute requiredRole="user">
                <CalendarView />
              </ProtectedRoute>
            } />
            
            {/* SMS - School Page Management (for School Page Owners - like LinkedIn page management) */}
            {/* SMS - School Management System (Separate Pages) */}
            <Route path="/techie/sms" element={<Navigate to="/techie/sms/posts" replace />} />
            <Route path="/techie/sms/posts" element={
              <ProtectedRoute requiredRole="user">
                <SMSPosts />
              </ProtectedRoute>
            } />
            <Route path="/techie/sms/alumni" element={
              <ProtectedRoute requiredRole="user">
                <SMSAlumni />
              </ProtectedRoute>
            } />
            <Route path="/techie/sms/programs" element={
              <ProtectedRoute requiredRole="user">
                <SMSPrograms />
              </ProtectedRoute>
            } />
            <Route path="/techie/sms/placements" element={
              <ProtectedRoute requiredRole="user">
                <SMSPlacements />
              </ProtectedRoute>
            } />
            <Route path="/techie/sms/admins" element={
              <ProtectedRoute requiredRole="user">
                <SMSPageAdmins />
              </ProtectedRoute>
            } />
            <Route path="/techie/sms/analytics" element={
              <ProtectedRoute requiredRole="user">
                <SMSAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/techie/sms/settings" element={
              <ProtectedRoute requiredRole="user">
                <SMSSettings />
              </ProtectedRoute>
            } />
            
            {/* CMS - Company Management System (Separate Pages) */}
            <Route path="/techie/cms" element={<Navigate to="/techie/cms/posts" replace />} />
            <Route path="/techie/cms/posts" element={
              <ProtectedRoute requiredRole="user">
                <CMSPosts />
              </ProtectedRoute>
            } />
            <Route path="/techie/cms/employees" element={
              <ProtectedRoute requiredRole="user">
                <CMSEmployees />
              </ProtectedRoute>
            } />
            <Route path="/techie/cms/admins" element={
              <ProtectedRoute requiredRole="user">
                <CMSAdmins />
              </ProtectedRoute>
            } />
            <Route path="/techie/cms/jobs" element={
              <ProtectedRoute requiredRole="user">
                <CMSJobs />
              </ProtectedRoute>
            } />
            <Route path="/techie/cms/analytics" element={
              <ProtectedRoute requiredRole="user">
                <CMSAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/techie/cms/settings" element={
              <ProtectedRoute requiredRole="user">
                <CMSSettings />
              </ProtectedRoute>
            } />
            
            {/* Enterprise IDE Routes */}
            <Route path="/techie/ide" element={
              <ProtectedRoute requiredRole="user">
                <IDEPage />
              </ProtectedRoute>
            } />
            <Route path="/techie/ide/:projectId" element={
              <ProtectedRoute requiredRole="user">
                <IDEPage />
              </ProtectedRoute>
            } />
            
            {/* Blog (authenticated view) */}
            <Route path="/techie/blogs" element={
              <ProtectedRoute requiredRole="user">
                <Blogs />
              </ProtectedRoute>
            } />
            
            {/* Search Results */}
            <Route path="/techie/search" element={
              <ProtectedRoute requiredRole="user">
                <SearchResults />
              </ProtectedRoute>
            } />
            
            {/* Alerts/Notifications */}
            <Route path="/techie/alerts" element={
              <ProtectedRoute requiredRole="user">
                <Notifications />
              </ProtectedRoute>
            } />
            
            {/* User Profile & Settings */}
            <Route path="/techie/profile" element={
              <ProtectedRoute requiredRole="user">
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/techie/profile/:userId" element={
              <ProtectedRoute requiredRole="user">
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute requiredRole="user">
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/profile/:userId" element={
              <ProtectedRoute requiredRole="user">
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requiredRole="user">
                <TechieDashboard />
              </ProtectedRoute>
            } />
            <Route path="/saved" element={
              <ProtectedRoute requiredRole="user">
                <TechieDashboard />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Public Scheduling Pages - No Authentication Required */}
          <Route path="/schedule/:username" element={<PublicSchedulingPage />} />
          <Route path="/book/:linkId" element={<PublicSchedulingPage />} />
        </Routes>
        </IdleTimeoutProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
