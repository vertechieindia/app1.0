import React from 'react';
import ForumIcon from '@mui/icons-material/Forum';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export interface HomeNavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

/** Home section tabs — shown in AppHeader when under `/techie/home`. */
export const HOME_NAV_ITEMS: HomeNavItem[] = [
  { path: '/techie/home/feed', label: 'Feed', icon: <ForumIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/home/network', label: 'My Network', icon: <PeopleIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/home/groups', label: 'Groups', icon: <GroupsIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/home/events', label: 'Events', icon: <EventIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/home/combinator', label: 'Combinator', icon: <TrendingUpIcon sx={{ fontSize: 20 }} /> },
];

export function isHomeNavItemActive(pathname: string, itemPath: string): boolean {
  if (itemPath === '/techie/home/feed') {
    return pathname === '/techie/home' || pathname === '/techie/home/feed' || pathname.startsWith('/techie/home/feed/');
  }
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}
