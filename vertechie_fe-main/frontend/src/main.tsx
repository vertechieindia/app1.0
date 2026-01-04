import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Logger from './utils/logger'

// Global error handler - catches unhandled JavaScript errors
window.onerror = (message, source, lineno, colno, error) => {
  Logger.error(
    `Unhandled Error: ${message}`,
    { source, lineno, colno, stack: error?.stack },
    'GlobalErrorHandler'
  );
  return false;
};

// Global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  Logger.error(
    'Unhandled Promise Rejection',
    { reason: String(event.reason), stack: event.reason?.stack },
    'GlobalErrorHandler'
  );
});

// ========== DISABLE COPY-PASTE GLOBALLY ==========
// Prevents AI-generated content dumps - users must type manually

// Show toast notification when paste is blocked
const showPasteBlockedNotification = () => {
  // Remove any existing notification
  const existingNotification = document.getElementById('paste-blocked-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'paste-blocked-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #e53935 0%, #c62828 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      animation: slideUp 0.3s ease-out;
      max-width: 90vw;
    ">
      <span style="font-size: 20px;">🚫</span>
      <div>
        <div style="font-weight: 600; margin-bottom: 2px;">Paste Disabled</div>
        <div style="opacity: 0.9; font-size: 12px;">Please type your content manually. No AI dumps allowed.</div>
      </div>
    </div>
  `;

  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};

// Prevent paste on all input elements
document.addEventListener('paste', (e: ClipboardEvent) => {
  const target = e.target as HTMLElement;
  const tagName = target.tagName.toLowerCase();
  
  // Check if it's an input, textarea, or contenteditable element
  if (
    tagName === 'input' ||
    tagName === 'textarea' ||
    target.isContentEditable ||
    target.closest('[contenteditable="true"]')
  ) {
    e.preventDefault();
    e.stopPropagation();
    showPasteBlockedNotification();
    Logger.warn('Paste attempt blocked', { target: tagName }, 'SecurityPolicy');
    return false;
  }
}, true);

// Prevent drop (drag and drop text)
document.addEventListener('drop', (e: DragEvent) => {
  const target = e.target as HTMLElement;
  const tagName = target.tagName.toLowerCase();
  
  if (
    tagName === 'input' ||
    tagName === 'textarea' ||
    target.isContentEditable ||
    target.closest('[contenteditable="true"]')
  ) {
    e.preventDefault();
    e.stopPropagation();
    showPasteBlockedNotification();
    return false;
  }
}, true);

// Prevent dragover to allow drop prevention
document.addEventListener('dragover', (e: DragEvent) => {
  const target = e.target as HTMLElement;
  const tagName = target.tagName.toLowerCase();
  
  if (
    tagName === 'input' ||
    tagName === 'textarea' ||
    target.isContentEditable
  ) {
    e.preventDefault();
  }
}, true);

// Block keyboard shortcuts for paste (Ctrl+V, Cmd+V, Ctrl+Shift+V, Cmd+Shift+V)
document.addEventListener('keydown', (e: KeyboardEvent) => {
  const target = e.target as HTMLElement;
  const tagName = target.tagName.toLowerCase();
  
  // Check if it's an input field
  const isInputField = 
    tagName === 'input' ||
    tagName === 'textarea' ||
    target.isContentEditable ||
    target.closest('[contenteditable="true"]');
  
  if (isInputField) {
    // Block Ctrl+V / Cmd+V (paste)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      e.stopPropagation();
      showPasteBlockedNotification();
      return false;
    }
    
    // Block Ctrl+Shift+V / Cmd+Shift+V (paste without formatting)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      e.stopPropagation();
      showPasteBlockedNotification();
      return false;
    }
  }
}, true);

// Disable context menu paste option by blocking right-click on input fields
document.addEventListener('contextmenu', (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const tagName = target.tagName.toLowerCase();
  
  if (
    tagName === 'input' ||
    tagName === 'textarea' ||
    target.isContentEditable ||
    target.closest('[contenteditable="true"]')
  ) {
    e.preventDefault();
    showPasteBlockedNotification();
    return false;
  }
}, true);

// ========== END COPY-PASTE PREVENTION ==========

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
