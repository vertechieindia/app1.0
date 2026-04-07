import { api } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api';

/**
 * Company for CMS: the row linked to the current user as CompanyAdmin.
 * Do not use GET /companies/ with user_id — that list endpoint ignores user_id
 * and returns an arbitrary page of all companies.
 */
export async function fetchMyCompanyForCMS(): Promise<any | null> {
  try {
    const mine = await api.get<any>(API_ENDPOINTS.CMS.MY_COMPANY);
    if (mine != null) return mine;
  } catch {
    // 401 or network
  }

  try {
    // /users/me includes company_id (CompanyAdmin); /auth/me does not.
    const me = await api.get<any>(API_ENDPOINTS.USERS.UPDATE_ME);
    if (me?.company_id) {
      const full = await api.get<any>(API_ENDPOINTS.CMS.COMPANY(me.company_id));
      if (full != null) return full;
    }
  } catch {
    // ignore
  }

  return null;
}
