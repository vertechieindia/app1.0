/**
 * AuthenticatedLayout - Wrapper for all authenticated pages
 * 
 * IMPORTANT: This layout handles ALL spacing for fixed header (64px) and bottom nav (80px).
 * Individual pages should NOT add their own top/bottom padding for header/footer.
 * 
 * Includes:
 * - AppHeader with role-based navigation (fixed, 64px height)
 * - Main content area with proper padding
 * - Space for BottomNav (fixed, 80px height)
 */

import React from 'react';
import { Box, Container } from '@mui/material';
import { Outlet, Navigate } from 'react-router-dom';
import AppHeader from './AppHeader';

// Constants for fixed element heights - use these across the app
export const HEADER_HEIGHT = 64;
export const BOTTOM_NAV_HEIGHT = 80;
export const CONTENT_TOP_PADDING = HEADER_HEIGHT + 16; // 80px
export const CONTENT_BOTTOM_PADDING = BOTTOM_NAV_HEIGHT + 16; // 96px

interface AuthenticatedLayoutProps {
  children?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  noPadding?: boolean;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  maxWidth = 'xl',
  noPadding = false,
}) => {
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#f5f7fa',
      }}
    >
      {/* Header - Fixed at top, 64px height */}
      <AppHeader />
      
      {/* Main Content Area */}
      {/* paddingTop: accounts for fixed header (64px) + extra spacing (16px) = 80px */}
      {/* paddingBottom: accounts for fixed bottom nav (80px) + extra spacing (16px) = 96px */}
      <Box
        component="main"
        sx={{
          flex: 1,
          pt: `${CONTENT_TOP_PADDING}px`,
          pb: `${CONTENT_BOTTOM_PADDING}px`,
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        {maxWidth ? (
          <Container maxWidth={maxWidth} sx={{ px: noPadding ? 0 : { xs: 2, sm: 3 } }}>
            {children || <Outlet />}
          </Container>
        ) : (
          children || <Outlet />
        )}
      </Box>
    </Box>
  );
};

export default AuthenticatedLayout;


