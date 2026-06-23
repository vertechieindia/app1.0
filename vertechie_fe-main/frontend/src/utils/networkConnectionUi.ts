/**
 * Shared connection-request UI helpers (home sidebar, My Network, profile, etc.)
 */

import { api } from '../services/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { getApiUrl } from '../config/api';
import { fetchWithAuth } from './apiInterceptor';

export type ConnectionButtonState =
  | 'connect'
  | 'loading'
  | 'pending_sent'
  | 'pending_received'
  | 'connected';

export interface UserRelationship {
  state: ConnectionButtonState;
  /** Present when state is pending_received — used for accept/decline */
  requestId?: string;
}

interface ConnectionRow {
  user_id: string;
  connected_user_id: string;
}

interface RequestRow {
  id: string;
  sender_id: string;
  receiver_id: string;
}

/** Public profile route for any user */
export function getProfilePath(userId: string): string {
  return `/techie/profile/${userId}`;
}

/** Load per-user relationship: connect / pending sent / pending received / connected */
export async function fetchUserRelationships(
  meId: string,
): Promise<Record<string, UserRelationship>> {
  const [conns, sent, recv] = await Promise.all([
    api.get<ConnectionRow[]>(API_ENDPOINTS.NETWORK.CONNECTIONS),
    api.get<RequestRow[]>(`${API_ENDPOINTS.NETWORK.REQUESTS}/sent`),
    api.get<RequestRow[]>(`${API_ENDPOINTS.NETWORK.REQUESTS}/received`),
  ]);

  const next: Record<string, UserRelationship> = {};
  const me = String(meId);

  for (const c of Array.isArray(conns) ? conns : []) {
    const other = String(c.user_id) === me ? String(c.connected_user_id) : String(c.user_id);
    next[other] = { state: 'connected' };
  }
  for (const r of Array.isArray(sent) ? sent : []) {
    const id = String(r.receiver_id);
    if (next[id]?.state !== 'connected') {
      next[id] = { state: 'pending_sent' };
    }
  }
  for (const r of Array.isArray(recv) ? recv : []) {
    const id = String(r.sender_id);
    if (next[id]?.state !== 'connected') {
      next[id] = { state: 'pending_received', requestId: String(r.id) };
    }
  }
  return next;
}

/** @deprecated use fetchUserRelationships */
export async function fetchUserRelationshipStates(
  meId: string,
): Promise<Record<string, 'pending' | 'connected'>> {
  const rels = await fetchUserRelationships(meId);
  const out: Record<string, 'pending' | 'connected'> = {};
  for (const [id, rel] of Object.entries(rels)) {
    if (rel.state === 'connected') out[id] = 'connected';
    else if (rel.state === 'pending_sent' || rel.state === 'pending_received') out[id] = 'pending';
  }
  return out;
}

export async function respondToConnectionRequest(
  requestId: string,
  action: 'accept' | 'decline',
): Promise<boolean> {
  const response = await fetchWithAuth(getApiUrl(`/network/requests/${requestId}/respond`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  return response.ok;
}

export async function sendConnectionRequest(userId: string, message?: string): Promise<void> {
  await api.post(API_ENDPOINTS.NETWORK.SEND_REQUEST, {
    receiver_id: userId,
    message: message || "Hi! I'd like to connect with you on VerTechie.",
  });
}

export function getConnectionErrorKind(
  err: unknown,
): 'already_pending' | 'already_connected' | 'other' {
  const status =
    typeof err === 'object' && err !== null && 'status' in err
      ? (err as { status?: number }).status
      : undefined;
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

export function relationshipStateOnly(
  rel: UserRelationship | undefined,
): ConnectionButtonState {
  if (!rel) return 'connect';
  return rel.state;
}
