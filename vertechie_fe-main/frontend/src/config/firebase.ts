/**
 * Firebase Configuration
 * Phone Authentication Setup
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';

// Firebase configuration
// TODO: Replace with your actual Firebase config values from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCE8zOLVvn5syHCk2QawIwS1hzvpySDXPw",
  authDomain: "vertechie-29a4f.firebaseapp.com",
  projectId: "vertechie-29a4f",
  storageBucket: "vertechie-29a4f.firebasestorage.app",
  messagingSenderId: "73948032610",
  appId: "1:73948032610:web:ca6782b0bfbf1e97cfeb3b",
  measurementId: "G-D8CBPPXS4J"
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Recaptcha Verifier instance (will be created when needed)
let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Initialize Recaptcha Verifier for phone authentication
 * @param containerId - The ID of the container element for reCAPTCHA (optional, will create if not exists)
 * @returns RecaptchaVerifier instance
 */
export const initializeRecaptcha = (containerId: string = 'recaptcha-container'): RecaptchaVerifier => {
  // Clear existing verifier if any
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (e) {
      // Ignore errors when clearing
    }
    recaptchaVerifier = null;
  }

  // Remove any existing container from DOM to avoid "already rendered" error
  const existingContainer = document.getElementById(containerId);
  if (existingContainer && existingContainer.parentNode) {
    existingContainer.parentNode.removeChild(existingContainer);
  }

  // Create a fresh container with unique ID to avoid conflicts
  const uniqueId = `${containerId}-${Date.now()}`;
  const container = document.createElement('div');
  container.id = uniqueId;
  container.style.display = 'none';
  document.body.appendChild(container);

  // Create RecaptchaVerifier with the fresh container
  recaptchaVerifier = new RecaptchaVerifier(auth, container, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
      console.log('reCAPTCHA verified');
    },
    'expired-callback': () => {
      // reCAPTCHA expired
      console.error('reCAPTCHA expired');
    },
  });

  return recaptchaVerifier;
};

/**
 * Clear Recaptcha Verifier
 */
export const clearRecaptcha = (): void => {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
};

/**
 * Get current Recaptcha Verifier instance
 */
export const getRecaptchaVerifier = (): RecaptchaVerifier | null => {
  return recaptchaVerifier;
};

export default app;

