/**
 * Screening workflow API client
 */
import { getApiUrl } from '../config/api';
import { fetchWithAuth } from '../utils/apiInterceptor';

export type CompanyStaffRole = 'recruiter' | 'screener' | 'tech_screener';

export interface CompanyScreeningStaffMember {
  id: string;
  user_id: string;
  email: string;
  name?: string;
  staff_role: CompanyStaffRole;
  is_active: boolean;
}

export interface ScreeningStaffAssignment {
  company_id: string;
  company_name: string;
  staff_role: CompanyStaffRole;
}

export type SourcingPath = 'with_req_team' | 'direct_screener';

export interface ScreeningCriteria {
  checks?: string[];
  location_notes?: string;
  visa_notes?: string;
  tech_mandatory?: string[];
  tech_optional?: string[];
}

export interface SourcingRequest {
  id: string;
  job_id?: string | null;
  job_title?: string;
  title: string;
  jd_text?: string;
  jd_file_url?: string;
  path: SourcingPath;
  status: string;
  screening_criteria?: ScreeningCriteria;
  notes?: string;
  headcount?: number;
  task_counts?: Record<string, number>;
  created_at?: string;
  submitted_to_hm_at?: string;
}

export interface ScreeningTask {
  id: string;
  sourcing_request_id?: string | null;
  job_id?: string | null;
  application_id?: string | null;
  status: string;
  task_type?: string;
  candidate_name?: string;
  candidate_email?: string;
  candidate_phone?: string;
  candidate_resume_url?: string;
  candidate_source?: string;
  candidate_linkedin_url?: string;
  job_title?: string;
  jd_text?: string;
  screening_criteria?: ScreeningCriteria;
  claimed_by_id?: string | null;
  claimed_by_name?: string;
  claimed_at?: string;
  screener_comments?: string;
  rejection_reason?: string;
  rejection_notes?: string;
  checks_completed?: Record<string, boolean>;
  detailed_results?: Record<string, unknown>;
  candidate_profile_data?: Record<string, unknown>;
  completed_at?: string;
  created_at?: string;
}

export interface ScreeningInviteProgress {
  id: string;
  candidate_email: string;
  status: string;
  job_title?: string;
  invite_sent_at?: string;
  signup_started_at?: string;
  signup_submitted_at?: string;
  reviewed_at?: string;
  screening_status?: string;
  detailed_results?: Record<string, unknown>;
  sourcing_request_id?: string;
}

export interface HmEmailSignature {
  sender_name?: string | null;
  sender_title?: string | null;
  sender_phone?: string | null;
  signature_html?: string | null;
}

async function parseError(res: Response): Promise<string> {
  try {
    const j = await res.json();
    const d = j.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x: { msg?: string }) => x.msg || JSON.stringify(x)).join(', ');
    return `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

export const screeningService = {
  async getStats() {
    const res = await fetchWithAuth(getApiUrl('/screening/stats'));
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async listSourcingRequests(status?: string) {
    const q = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetchWithAuth(getApiUrl(`/screening/sourcing-requests${q}`));
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ items: SourcingRequest[]; total: number }>;
  },

  async createSourcingRequest(data: {
    title: string;
    job_id?: string;
    jd_text?: string;
    screening_criteria?: ScreeningCriteria;
    notes?: string;
    headcount?: number;
  }) {
    const res = await fetchWithAuth(getApiUrl('/screening/sourcing-requests'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<SourcingRequest>;
  },

  async sendToScreener(sourcingRequestId: string) {
    const res = await fetchWithAuth(
      getApiUrl(`/screening/sourcing-requests/${sourcingRequestId}/send-to-screener`),
      { method: 'POST' }
    );
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async submitToHm(sourcingRequestId: string) {
    const res = await fetchWithAuth(
      getApiUrl(`/screening/sourcing-requests/${sourcingRequestId}/submit-to-hm`),
      { method: 'POST' }
    );
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async updateSourcingRequest(id: string, data: { status?: string; notes?: string; screening_criteria?: ScreeningCriteria }) {
    const res = await fetchWithAuth(getApiUrl(`/screening/sourcing-requests/${id}`), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async getTask(taskId: string) {
    const res = await fetchWithAuth(getApiUrl(`/screening/tasks/${taskId}`));
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<ScreeningTask>;
  },

  async listTasks(params?: { pool?: string; sourcing_request_id?: string; job_id?: string }) {
    const sp = new URLSearchParams();
    if (params?.pool) sp.set('pool', params.pool);
    if (params?.sourcing_request_id) sp.set('sourcing_request_id', params.sourcing_request_id);
    if (params?.job_id) sp.set('job_id', params.job_id);
    const q = sp.toString() ? `?${sp.toString()}` : '';
    const res = await fetchWithAuth(getApiUrl(`/screening/tasks${q}`));
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ items: ScreeningTask[]; total: number }>;
  },

  async getTasksGroupedByJob(pool: 'pending' | 'selected' | 'rejected') {
    const res = await fetchWithAuth(getApiUrl(`/screening/tasks/grouped-by-job?pool=${pool}`));
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{
      pool: string;
      groups: Array<{
        job_id?: string;
        sourcing_request_id?: string;
        job_title: string;
        screening_criteria?: ScreeningCriteria;
        jd_text?: string;
        task_count: number;
        tasks: ScreeningTask[];
      }>;
    }>;
  },

  async createTask(data: {
    sourcing_request_id?: string;
    job_id?: string;
    application_id?: string;
    candidate_name?: string;
    candidate_email?: string;
    candidate_phone?: string;
    candidate_resume_url?: string;
    candidate_source?: string;
    candidate_linkedin_url?: string;
    send_to_screener?: boolean;
  }) {
    const res = await fetchWithAuth(getApiUrl('/screening/tasks'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<ScreeningTask>;
  },

  async claimTask(taskId: string) {
    const res = await fetchWithAuth(getApiUrl(`/screening/tasks/${taskId}/claim`), { method: 'POST' });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<ScreeningTask>;
  },

  async releaseTask(taskId: string) {
    const res = await fetchWithAuth(getApiUrl(`/screening/tasks/${taskId}/release`), { method: 'POST' });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<ScreeningTask>;
  },

  async completeTask(
    taskId: string,
    data: {
      outcome: 'selected' | 'rejected';
      screener_comments?: string;
      rejection_reason?: string;
      rejection_notes?: string;
      checks_completed?: Record<string, boolean>;
      detailed_results?: Record<string, unknown>;
    }
  ) {
    const res = await fetchWithAuth(getApiUrl(`/screening/tasks/${taskId}/complete`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<ScreeningTask>;
  },

  async createSourceOnlyRequirement(data: {
    title: string;
    jd_text: string;
    company_id?: string;
    screening_criteria?: ScreeningCriteria;
    notes?: string;
    headcount?: number;
    job_snapshot?: Record<string, unknown>;
  }) {
    const res = await fetchWithAuth(getApiUrl('/screening/sourcing-requests/source-only'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<SourcingRequest>;
  },

  async screenTechies(data: {
    title: string;
    jd_text?: string;
    company_id?: string;
    emails: string[];
    screening_criteria?: ScreeningCriteria;
    email_subject?: string;
    email_body?: string;
    enterprise_verification?: boolean;
  }) {
    const res = await fetchWithAuth(getApiUrl('/screening/screen-techies'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{
      sourcing_request_id: string;
      emails_requested: number;
      emails_sent: number;
      invites: ScreeningInviteProgress[];
    }>;
  },

  async listInvites(sourcingRequestId?: string) {
    const q = sourcingRequestId ? `?sourcing_request_id=${encodeURIComponent(sourcingRequestId)}` : '';
    const res = await fetchWithAuth(getApiUrl(`/screening/invites${q}`));
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ items: ScreeningInviteProgress[]; total: number }>;
  },

  async listHmSourcingResults() {
    const res = await fetchWithAuth(getApiUrl('/screening/hm/sourcing-results'));
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{
      requests: SourcingRequest[];
      tasks: ScreeningTask[];
      total_tasks: number;
    }>;
  },

  async getPublicInvite(token: string) {
    const res = await fetch(getApiUrl(`/screening/invites/public/${encodeURIComponent(token)}`));
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{
      candidate_email: string;
      job_title?: string;
      company_id?: string;
      signup_url: string;
    }>;
  },

  async getEmailSignature() {
    const res = await fetchWithAuth(getApiUrl('/screening/hm/email-signature'));
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<HmEmailSignature>;
  },

  async updateEmailSignature(data: HmEmailSignature) {
    const res = await fetchWithAuth(getApiUrl('/screening/hm/email-signature'), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async listEnterpriseTasks(pool: 'pending' | 'selected' | 'rejected' = 'pending') {
    const res = await fetchWithAuth(getApiUrl(`/screening/enterprise/tasks?pool=${pool}`));
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ items: ScreeningTask[]; total: number }>;
  },

  async inviteCompanyHms(companyId: string, emails: string[]) {
    const res = await fetchWithAuth(getApiUrl(`/screening/companies/${companyId}/hm-invites`), {
      method: 'POST',
      body: JSON.stringify({ emails }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ invited: number; emails_sent: number; items: Array<{ email: string; token: string }> }>;
  },

  async listCompanyScreeningStaff(companyId: string) {
    const res = await fetchWithAuth(getApiUrl(`/screening/companies/${companyId}/staff`));
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ items: CompanyScreeningStaffMember[]; total: number }>;
  },

  async assignCompanyScreeningStaff(companyId: string, email: string, staffRole: CompanyStaffRole) {
    const res = await fetchWithAuth(getApiUrl(`/screening/companies/${companyId}/staff`), {
      method: 'POST',
      body: JSON.stringify({ email, staff_role: staffRole }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async removeCompanyScreeningStaff(companyId: string, staffId: string) {
    const res = await fetchWithAuth(getApiUrl(`/screening/companies/${companyId}/staff/${staffId}`), {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  async getMyScreeningStaffRoles() {
    const res = await fetchWithAuth(getApiUrl('/screening/me/staff-roles'));
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ items: ScreeningStaffAssignment[] }>;
  },
};

export default screeningService;
