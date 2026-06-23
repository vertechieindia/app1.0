import React from 'react';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';

export interface SmsNavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

/** SMS section tabs — shown in AppHeader when under `/techie/sms`. */
export const SMS_NAV_ITEMS: SmsNavItem[] = [
  { path: '/techie/sms/posts', label: 'Posts', icon: <PostAddIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/sms/alumni', label: 'Alumni Verification', icon: <PeopleIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/sms/programs', label: 'Programs', icon: <MenuBookIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/sms/placements', label: 'Placements', icon: <EmojiEventsIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/sms/admins', label: 'Page Admins', icon: <GroupAddIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/sms/analytics', label: 'Analytics', icon: <AnalyticsIcon sx={{ fontSize: 20 }} /> },
  { path: '/techie/sms/settings', label: 'Settings', icon: <SettingsIcon sx={{ fontSize: 20 }} /> },
];

export function isSmsNavItemActive(pathname: string, itemPath: string): boolean {
  if (itemPath === '/techie/sms/posts') {
    return pathname === '/techie/sms' || pathname === '/techie/sms/posts' || pathname.startsWith('/techie/sms/posts/');
  }
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}
