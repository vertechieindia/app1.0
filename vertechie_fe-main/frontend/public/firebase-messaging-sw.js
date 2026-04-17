/* eslint-disable no-undef */
/**
 * Firebase Messaging service worker (background notifications).
 * Must stay in /public so it is served at site root.
 * Version pins should match the `firebase` package in package.json.
 */
importScripts('https://www.gstatic.com/firebasejs/12.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.5.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCE8zOLVvn5syHCk2QawIwS1hzvpySDXPw',
  authDomain: 'vertechie-29a4f.firebaseapp.com',
  projectId: 'vertechie-29a4f',
  storageBucket: 'vertechie-29a4f.firebasestorage.app',
  messagingSenderId: '73948032610',
  appId: '1:73948032610:web:ca6782b0bfbf1e97cfeb3b',
  measurementId: 'G-D8CBPPXS4J',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || 'VerTechie';
  const body = payload.notification?.body || payload.data?.body || '';
  const link =
    payload.fcmOptions?.link ||
    payload.data?.link ||
    (payload.data?.conversation_id
      ? `${self.location.origin}/techie/chat?conversationId=${payload.data.conversation_id}`
      : `${self.location.origin}/techie/chat`);

  return self.registration.showNotification(title, {
    body: body || undefined,
    icon: '/favicon.ico',
    data: { ...(payload.data || {}), link },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const link = data.link || self.location.origin + '/techie/chat';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.focus();
        }
      }
      return self.clients.openWindow(link);
    }),
  );
});
