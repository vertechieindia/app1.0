export type PublicUserRole = 
  | 'techie'
  | 'hiring_manager'
  | 'company'
  | 'school';

export type UserRole = PublicUserRole | 'admin' | 'it_services_requester';

export interface RoleDescription {
  id: UserRole;
  title: string;
  description: string;
}

export const PUBLIC_ROLES: RoleDescription[] = [
  {
    id: 'techie',
    title: 'Techie',
    description: 'Seeking tech opportunities'
  },
  {
    id: 'hiring_manager',
    title: 'Hiring Manager',
    description: 'Employer or recruiter'
  },
  {
    id: 'company',
    title: 'Company',
    description: 'Corporate profile for verified hiring'
  },
  {
    id: 'school',
    title: 'School',
    description: 'Educational institutions for alumni verification'
  }
];

// Keep admin role separate for internal use
export const ADMIN_ROLE: RoleDescription = {
  id: 'admin',
  title: 'VerTechie Admin',
  description: 'Internal use only'
};

// Keep IT Services Requester role separate for future use
export const IT_SERVICES_ROLE: RoleDescription = {
  id: 'it_services_requester',
  title: 'IT Services Requester',
  description: 'Organizations seeking IT solutions'
};

export interface SignupFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  termsAccepted: boolean;
  emailOTP: string;
  phoneOTP: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  data: {
    user: User | null;
    session: Session | null;
  } | null;
  error: AuthError | null;
}

export interface SignUpCredentials {
  email: string;
  password: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
} 