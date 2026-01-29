import React from 'react';
import { Navigate } from 'react-router-dom';

type UserRole = 'superadmin' | 'admin' | 'user' | 'hr' | 'techie';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

interface UserData {
  id: number;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  is_verified: boolean;
  email: string;
  first_name?: string;
  last_name?: string;
  groups?: Array<{ id: number; name: string }>;
  user_type?: string;
  admin_roles?: string[];
  roles?: Array<{ id: number; name: string; role_type?: string }>;
}

/**
 * Check if user has a specific role/group
 */
const hasRole = (userData: UserData, role: string): boolean => {
  // Check groups array
  if (userData.groups && userData.groups.length > 0) {
    return userData.groups.some(
      (group) => group.name.toLowerCase() === role.toLowerCase()
    );
  }
  // Check user_type field as fallback
  if (userData.user_type) {
    return userData.user_type.toLowerCase() === role.toLowerCase();
  }
  return false;
};

/**
 * ProtectedRoute component
 * Protects routes based on authentication and user role
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  // Check if user is authenticated
  const authToken = localStorage.getItem('authToken');
  const userDataString = localStorage.getItem('userData');

  // Not logged in - redirect to login
  if (!authToken || !userDataString) {
    return <Navigate to="/login" replace />;
  }

  // Parse user data
  let userData: UserData;
  try {
    userData = JSON.parse(userDataString);
  } catch {
    // Invalid user data - clear and redirect to login
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole) {
    switch (requiredRole) {
      case 'superadmin':
        // Only superusers can access superadmin routes
        if (!userData.is_superuser) {
          return <Navigate to="/" replace />;
        }
        break;
      
      case 'admin':
        // Staff members (admins), superusers, or users with admin_roles can access admin routes
        const adminRoles = userData.admin_roles || [];
        const hasAdminRole = adminRoles.length > 0;
        const hasAdminGroup = userData.groups?.some((g: any) => 
          g.name?.toLowerCase().includes('admin') || 
          g.name?.toLowerCase().includes('staff')
        );
        
        if (!userData.is_staff && !userData.is_superuser && !hasAdminRole && !hasAdminGroup) {
          return <Navigate to="/" replace />;
        }
        break;
      
      case 'hr':
        // Users with HR role or hiring_manager role can access HR routes
        // Also allow staff/superusers as they typically have all access
        if (!hasRole(userData, 'hr') && !hasRole(userData, 'hiring_manager') && 
            !userData.is_staff && !userData.is_superuser) {
          return <Navigate to="/" replace />;
        }
        break;
      
      case 'techie':
        // Users with techie/user role can access techie routes
        // For now, allow any authenticated user who is not strictly HR-only
        // This is flexible - any logged in user can browse jobs
        break;
      
      case 'user':
        // Any authenticated user can access
        // Already authenticated at this point
        break;
    }
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;

