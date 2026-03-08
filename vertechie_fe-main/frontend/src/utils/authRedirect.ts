/**
 * Centralized redirect path for authenticated users based on role and verification status.
 * Used by Login, Home, and StatusProcessing to keep redirect logic consistent.
 */

export interface UserDataForRedirect {
  is_superuser?: boolean;
  is_staff?: boolean;
  is_active?: boolean;
  is_verified?: boolean;
  verification_status?: string;
  admin_roles?: string[];
  groups?: Array<{ name?: string }>;
  role?: string;
  user_type?: string;
}

/**
 * Returns true if the user is considered verified (approved by admin).
 * Backend may set is_verified and/or verification_status to APPROVED.
 */
export function isUserVerified(user: UserDataForRedirect): boolean {
  if (user.is_verified === true) return true;
  const status = (user.verification_status || '').toLowerCase();
  return status === 'approved';
}

/**
 * Returns the path the user should be redirected to, or null if no redirect (e.g. stay on login).
 */
export function getRedirectPathForUser(user: UserDataForRedirect): string | null {
  const adminRoles = user.admin_roles || [];
  const roleAdminTypes = ['techie_admin', 'hm_admin', 'company_admin', 'school_admin'];
  const hasMultipleRoleAdmins = roleAdminTypes.filter((r) => adminRoles.includes(r)).length > 1;
  const isHR = user.groups?.some(
    (g: { name?: string }) =>
      g.name?.toLowerCase() === 'hr' || g.name?.toLowerCase() === 'hiring_manager'
  );
  const verified = isUserVerified(user);

  if (user.is_superuser || adminRoles.includes('superadmin')) {
    return '/super-admin';
  }
  if (hasMultipleRoleAdmins) {
    return '/vertechie/role-admin';
  }
  if (adminRoles.includes('hm_admin')) {
    return '/vertechie/hmadmin';
  }
  if (adminRoles.includes('company_admin')) {
    return '/vertechie/companyadmin';
  }
  if (adminRoles.includes('school_admin')) {
    return '/vertechie/schooladmin';
  }
  if (adminRoles.includes('techie_admin')) {
    return '/vertechie/techieadmin';
  }
  if (adminRoles.includes('bdm_admin')) {
    return '/vertechie/bdmadmin';
  }
  if (adminRoles.includes('learnadmin') || adminRoles.includes('learn_admin')) {
    return '/vertechie/learnadmin';
  }
  if (user.is_staff) {
    return '/admin';
  }
  if (
    user.verification_status === 'rejected' ||
    user.verification_status === 'REJECTED' ||
    (user.verification_status || '').toLowerCase() === 'rejected'
  ) {
    return '/status/rejected';
  }
  if (!user.is_active && !verified) {
    return '/status/rejected';
  }
  if (user.is_active && !verified) {
    return '/status/processing';
  }
  if (verified) {
    const profileCompletionShown = localStorage.getItem('profileCompletionShown');
    if (!profileCompletionShown) {
      return '/techie/profile-completion';
    }
    return '/techie/home/feed';
  }
  return '/status/processing';
}
