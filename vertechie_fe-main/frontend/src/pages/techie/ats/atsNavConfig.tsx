import React from 'react';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export interface AtsNavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

/** ATS section tabs — shown in AppHeader when under `/techie/ats`. */
export const ATS_NAV_ITEMS: AtsNavItem[] = [
  { path: '/techie/ats/pipeline', label: 'Pipeline', icon: <ViewKanbanIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/ats/jobpostings', label: 'Job Postings', icon: <WorkIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/ats/allcandidates', label: 'All Candidates', icon: <PeopleIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/ats/interviews', label: 'Interviews', icon: <EventIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/ats/scheduling', label: 'Scheduling', icon: <ScheduleIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/ats/calendar', label: 'Calendar', icon: <CalendarMonthIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/ats/analytics', label: 'Analytics', icon: <AnalyticsIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/ats/hired', label: 'Hired', icon: <CheckCircleIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/ats/rejected', label: 'Rejected', icon: <CancelIcon sx={{ fontSize: 20 }} /> },
];

export function isAtsNavItemActive(pathname: string, itemPath: string): boolean {
  if (itemPath === '/techie/ats/pipeline') {
    if (pathname === '/techie/ats' || pathname === '/techie/ats/pipeline') return true;
    if (pathname.startsWith('/techie/ats/candidate/')) return true;
    return false;
  }
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}
