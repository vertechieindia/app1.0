/**
 * Register / unregister FCM token for chat web push (after Notification permission + SW).
 */

import { getToken, isSupported, onMessage, type Messaging } from 'firebase/messaging';
import { api, getAccessToken } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { getFirebaseMessaging } from '../config/firebase';

const SESSION_SENT_KEY = 'vertechie_fcm_token_sent';

function getVapidKey(): string | null {
  const k = import.meta.env.VITE_FCM_VAPID_KEY as string | undefined;
  return k && k.trim() ? k.trim() : null;
}

/**
 * Request permission (if needed), register SW, get FCM token, POST to API.
 * Idempotent per session for the same token string.
 */
export async function syncChatFcmToken(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!getAccessToken()) return;

  const vapidKey = getVapidKey();
  if (!vapidKey) {
    return;
  }

  if (!(await isSupported())) {
    return;
  }

  if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
  if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
    return;
  }

  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
    scope: '/',
  });

  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });
  console.log('FCM token:', token);
  if (!token) return;

  const prevSent = sessionStorage.getItem(SESSION_SENT_KEY);
  if (prevSent === token) {
    return;
  }

  await api.post(API_ENDPOINTS.CHAT.FCM_REGISTER, { token });
  sessionStorage.setItem(SESSION_SENT_KEY, token);
}

/**
 * Remove token from backend (call before clearing auth). Best-effort.
 */
export async function unregisterStoredFcmToken(): Promise<void> {
  const token = sessionStorage.getItem(SESSION_SENT_KEY);
  sessionStorage.removeItem(SESSION_SENT_KEY);
  if (!token || !getAccessToken()) return;
  try {
    await api.delete(API_ENDPOINTS.CHAT.FCM_REGISTER, { data: { token } });
  } catch {
    // ignore
  }
}

/**
 * Foreground FCM: optional badge refresh (WebSocket usually handles live chat).
 */
export function subscribeForegroundChatMessages(messaging: Messaging, onPayload: () => void): () => void {
  return onMessage(messaging, () => {
    onPayload();
  });
}
