/**
 * Shared connection-request UI helpers (home sidebar, My Network, etc.)
 */

import { api } from '../services/apiClient';
import { API_ENDPOINTS } from '../config/api';

export type ConnectionButtonState = 'connect' | 'loading' | 'pending' | 'connected';

interface ConnectionRow {
  user_id: string;
  connected_user_id: string;
}

interface RequestRow {
  sender_id: string;
  receiver_id: string;
}

/** Load which user IDs are already connected or have a pending request (either direction). */
export async function fetchUserRelationshipStates(meId: string): Promise<Record<string, 'pending' | 'connected'>> {
  const [conns, sent, recv] = await Promise.all([
    api.get<ConnectionRow[]>(API_ENDPOINTS.NETWORK.CONNECTIONS),
    api.get<RequestRow[]>(`${API_ENDPOINTS.NETWORK.REQUESTS}/sent`),
    api.get<RequestRow[]>(`${API_ENDPOINTS.NETWORK.REQUESTS}/received`),
  ]);

  const next: Record<string, 'pending' | 'connected'> = {};
  const me = String(meId);

  for (const c of Array.isArray(conns) ? conns : []) {
    const other = String(c.user_id) === me ? String(c.connected_user_id) : String(c.user_id);
    next[other] = 'connected';
  }
  for (const r of Array.isArray(sent) ? sent : []) {
    const id = String(r.receiver_id);
    if (next[id] !== 'connected') next[id] = 'pending';
  }
  for (const r of Array.isArray(recv) ? recv : []) {
    const id = String(r.sender_id);
    if (next[id] !== 'connected') next[id] = 'pending';
  }
  return next;
}

export function getConnectionErrorKind(err: unknown): 'already_pending' | 'already_connected' | 'other' {
  const status = typeof err === 'object' && err !== null && 'status' in err ? (err as { status?: number }).status : undefined;
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  if (msg.includes('already connected')) {
    return 'already_connected';
  }
  if (status === 400 || status === 409) {
    if (msg.includes('already pending') || msg.includes('request already pending')) {
      return 'already_pending';
    }
  }
  if (msg.includes('already pending') || msg.includes('request already pending')) {
    return 'already_pending';
  }
  return 'other';
}
