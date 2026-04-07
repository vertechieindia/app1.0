/**
 * Centralized redirect path for authenticated users based on role and verification status.
 * Used by Login, Home, and StatusProcessing to keep redirect logic consistent.
 *
 * Product flow (high level):
 * 1) Techie signup → pending until Techie Admin approves (`/vertechie/techieadmin`).
 * 2) HR signup → pending until HM Admin approves (`/vertechie/hmadmin`).
 * 3) Creating a *company page* (CMS) after that is separate: Business → `/techie/create-company`
 *    submits `invite_flow: registration` → BDM queue under VerTechie Admin → User Management (`/vertechie/admin?bdm=1`). CMS unlocks only after BDM provisions the company.
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
  /** Login/API hint: techie | hr | company | school */
  user_type?: string;
  /** True when user is linked to a provisioned company (CompanyAdmin / BDM-approved). */
  has_company?: boolean;
  company_id?: string | null;
}

function hasCompanyLink(user: UserDataForRedirect): boolean {
  if (user.has_company === true) return true;
  const cid = user.company_id;
  return typeof cid === 'string' && cid.length > 0;
}

/** Match role from groups or primary `role` / `user_type` (used when /users/me omits groups). */
function hasAccountRole(user: UserDataForRedirect, names: string[]): boolean {
  const want = names.map((n) => n.toLowerCase());
  if (user.groups?.some((g) => want.includes((g.name || '').toLowerCase()))) {
    return true;
  }
  const r = (user.role || '').toLowerCase();
  if (want.includes(r)) return true;
  const ut = (user.user_type || '').toLowerCase();
  if (ut === 'hr' && want.includes('hiring_manager')) return true;
  if (ut === 'company' && want.includes('company_admin')) return true;
  if (ut === 'school' && want.includes('school_admin')) return true;
  return false;
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
    return '/vertechie/admin?bdm=1';
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
    // School page owners → SMS (not techie onboarding)
    if (hasAccountRole(user, ['school_admin'])) {
      return '/techie/sms';
    }
    // HR (hiring manager): ATS and HR features after signup/approval; CMS only after BDM approves a company page
    if (hasAccountRole(user, ['hiring_manager'])) {
      if (!hasCompanyLink(user)) {
        return '/hr/dashboard';
      }
      return '/techie/cms';
    }
    // Company account owner (e.g. techie Business flow): create company via BDM before CMS
    if (hasAccountRole(user, ['company_admin'])) {
      if (!hasCompanyLink(user)) {
        return '/techie/create-company';
      }
      return '/techie/cms';
    }
    // Tech professionals → existing onboarding + feed
    const profileCompletionShown = localStorage.getItem('profileCompletionShown');
    if (!profileCompletionShown) {
      return '/techie/profile-completion';
    }
    return '/techie/home/feed';
  }
  return '/status/processing';
}
