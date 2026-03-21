/**
 * Route-level code splitting: each lazy() becomes its own chunk (loaded on navigation).
 */
import { lazy } from 'react';
import { Box, CircularProgress } from '@mui/material';

export const RouteFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      p: 3,
    }}
  >
    <CircularProgress />
  </Box>
);

// ——— Public & marketing ———
export const Home = lazy(() => import('../pages/Home'));
export const About = lazy(() => import('../pages/About'));
export const HR = lazy(() => import('../pages/HR'));
export const Networking = lazy(() => import('../pages/Networking'));
export const NetworkFeed = lazy(() => import('../pages/network/NetworkFeed'));
export const MyNetwork = lazy(() => import('../pages/network/MyNetwork'));
export const NetworkGroups = lazy(() => import('../pages/network/NetworkGroups'));
export const NetworkEvents = lazy(() => import('../pages/network/NetworkEvents'));
export const Combinator = lazy(() => import('../pages/network/Combinator'));
export const Companies = lazy(() => import('../pages/Companies'));
export const Contact = lazy(() => import('../pages/Contact'));
export const Services = lazy(() => import('../pages/Services'));
export const ServiceDetail = lazy(() => import('../pages/ServiceDetail'));
export const Login = lazy(() => import('../pages/Login'));
export const Signup = lazy(() => import('../pages/Signup'));
export const TechieSignup = lazy(() => import('../components/auth/TechieSignup'));
export const SignupSuccess = lazy(() => import('../pages/SignupSuccess'));
export const Verification = lazy(() => import('../pages/Verification'));
export const PostJob = lazy(() => import('../pages/companies/PostJob'));
export const TalentSearch = lazy(() => import('../pages/companies/TalentSearch'));
export const Advertise = lazy(() => import('../pages/companies/Advertise'));
export const Enterprise = lazy(() => import('../pages/companies/Enterprise'));
export const ContactSales = lazy(() => import('../pages/companies/ContactSales'));
export const Pricing = lazy(() => import('../pages/Pricing'));
export const Support = lazy(() => import('../pages/Support'));
export const Accessibility = lazy(() => import('../pages/Accessibility'));
export const CookiePolicy = lazy(() => import('../pages/CookiePolicy'));
export const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
export const TermsOfService = lazy(() => import('../pages/TermsOfService'));
export const Terms = lazy(() => import('../components/pages/Terms'));
export const Privacy = lazy(() => import('../components/pages/Privacy'));
export const Cookies = lazy(() => import('../components/pages/Cookies'));
export const StatusProcessing = lazy(() => import('../pages/StatusProcessing'));
export const StatusAccepted = lazy(() => import('../pages/StatusAccepted'));
export const StatusRejected = lazy(() => import('../pages/StatusRejected'));
export const ResetPassword = lazy(() => import('../pages/ResetPassword'));
export const CompleteProfile = lazy(() => import('../pages/CompleteProfile'));
export const GitHubCallback = lazy(() => import('../pages/GitHubCallback'));
export const GitLabCallback = lazy(() => import('../pages/GitLabCallback'));
export const CalendarCallback = lazy(() => import('../pages/CalendarCallback'));

// ——— Admin / heavy ———
export const SuperAdmin = lazy(() => import('../pages/SuperAdmin'));
export const SuperAdminChat = lazy(() => import('../pages/superadmin/SuperAdminChat'));
export const BDMAdminDashboard = lazy(() => import('../pages/BDMAdminDashboard'));
export const Admin = lazy(() => import('../pages/Admin'));

export const TechieAdminDashboard = lazy(() =>
  import('../pages/RoleAdminDashboard').then((m) => ({ default: m.TechieAdminDashboard }))
);
export const HMAdminDashboard = lazy(() =>
  import('../pages/RoleAdminDashboard').then((m) => ({ default: m.HMAdminDashboard }))
);
export const CompanyAdminDashboard = lazy(() =>
  import('../pages/RoleAdminDashboard').then((m) => ({ default: m.CompanyAdminDashboard }))
);
export const SchoolAdminDashboard = lazy(() =>
  import('../pages/RoleAdminDashboard').then((m) => ({ default: m.SchoolAdminDashboard }))
);
export const MultiRoleAdminDashboard = lazy(() =>
  import('../pages/RoleAdminDashboard').then((m) => ({ default: m.MultiRoleAdminDashboard }))
);

export const CourseManagement = lazy(() => import('../pages/admin/CourseManagement'));
export const LearnAdmin = lazy(() => import('../pages/admin/LearnAdmin'));

// ——— HR ———
export const HRDashboard = lazy(() => import('../pages/hr/HRDashboard'));
export const CreateJobPost = lazy(() => import('../pages/hr/CreateJobPost'));
export const ViewApplicants = lazy(() => import('../pages/hr/ViewApplicants'));

// ——— Jobs (user) ———
export const JobListings = lazy(() => import('../pages/user/JobListings'));
export const JobDetails = lazy(() => import('../pages/user/JobDetails'));
export const JobApply = lazy(() => import('../pages/user/JobApply'));
export const MyApplications = lazy(() => import('../pages/user/MyApplications'));

// ——— Techie platform ———
export const TechieDashboard = lazy(() => import('../pages/techie/TechieDashboard'));
export const CodingProblems = lazy(() => import('../pages/techie/CodingProblems'));
export const ProblemDetail = lazy(() => import('../pages/techie/ProblemDetail'));
export const ProblemsPage = lazy(() => import('../pages/techie/ProblemsPage'));
export const IDEPage = lazy(() => import('../pages/techie/IDEPage'));
export const Chat = lazy(() => import('../pages/techie/Chat'));
export const SchedulingPage = lazy(() => import('../pages/techie/SchedulingPage'));
export const CalendarView = lazy(() => import('../pages/techie/CalendarView'));
export const ProfilePage = lazy(() => import('../pages/techie/ProfilePage'));
export const Learn = lazy(() => import('../pages/techie/Learn'));
export const Blogs = lazy(() => import('../pages/techie/Blogs'));
export const SearchResults = lazy(() => import('../pages/techie/SearchResults'));
export const Notifications = lazy(() => import('../pages/techie/Notifications'));
export const CourseDetail = lazy(() => import('../pages/techie/CourseDetail'));
export const TutorialPage = lazy(() => import('../pages/techie/TutorialPage'));
export const QuizPage = lazy(() => import('../pages/techie/QuizPage'));
export const VideoRoom = lazy(() => import('../pages/techie/VideoRoom'));
export const MeetingLobby = lazy(() => import('../pages/techie/MeetingLobby'));
export const ScheduleInterview = lazy(() => import('../pages/techie/ScheduleInterview'));
export const MyInterviews = lazy(() => import('../pages/techie/MyInterviews'));
export const ProfileCompletion = lazy(() => import('../pages/techie/ProfileCompletion'));

// ——— ATS ———
export const PipelinePage = lazy(() => import('../pages/techie/ats/PipelinePage'));
export const JobPostingsPage = lazy(() => import('../pages/techie/ats/JobPostingsPage'));
export const AllCandidatesPage = lazy(() => import('../pages/techie/ats/AllCandidatesPage'));
export const CandidateProfilePage = lazy(() => import('../pages/techie/ats/CandidateProfilePage'));
export const InterviewsPage = lazy(() => import('../pages/techie/ats/InterviewsPage'));
export const ATSSchedulingPage = lazy(() => import('../pages/techie/ats/SchedulingPage'));
export const ATSCalendarPage = lazy(() => import('../pages/techie/ats/CalendarPage'));
export const AnalyticsPage = lazy(() => import('../pages/techie/ats/AnalyticsPage'));

// ——— SMS ———
export const SMSPosts = lazy(() => import('../pages/techie/sms/SMSPosts'));
export const SMSAlumni = lazy(() => import('../pages/techie/sms/SMSAlumni'));
export const SMSPrograms = lazy(() => import('../pages/techie/sms/SMSPrograms'));
export const SMSPlacements = lazy(() => import('../pages/techie/sms/SMSPlacements'));
export const SMSPageAdmins = lazy(() => import('../pages/techie/sms/SMSPageAdmins'));
export const SMSAnalytics = lazy(() => import('../pages/techie/sms/SMSAnalytics'));
export const SMSSettings = lazy(() => import('../pages/techie/sms/SMSSettings'));

// ——— CMS ———
export const CMSPosts = lazy(() => import('../pages/techie/cms/CMSPosts'));
export const CMSEmployees = lazy(() => import('../pages/techie/cms/CMSEmployees'));
export const CMSAdmins = lazy(() => import('../pages/techie/cms/CMSPageAdmins'));
export const CMSJobs = lazy(() => import('../pages/techie/cms/CMSJobs'));
export const CMSAnalytics = lazy(() => import('../pages/techie/cms/CMSAnalytics'));
export const CMSSettings = lazy(() => import('../pages/techie/cms/CMSSettings'));
export const CMSMedia = lazy(() => import('../pages/techie/cms/CMSMedia'));
export const CMSSnippets = lazy(() => import('../pages/techie/cms/CMSSnippets'));

// ——— Public ———
export const PublicSchedulingPage = lazy(() => import('../pages/public/PublicSchedulingPage'));
