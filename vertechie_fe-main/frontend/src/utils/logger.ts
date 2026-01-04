/**
 * Application Logger
 * Stores logs in localStorage AND sends to backend
 * 
 * Usage:
 *   import Logger from '../utils/logger';
 *   Logger.error('Something failed', { details });
 *   Logger.warn('Warning message');
 *   Logger.info('Info message');
 * 
 * View logs in browser console (F12):
 *   Logger.show()        - Display all logs
 *   Logger.showErrors()  - Display only errors
 *   Logger.download()    - Download as .txt file
 *   Logger.clear()       - Clear all logs
 */

import { getApiUrl, API_ENDPOINTS } from '../config/api';

// Log entry structure
interface LogEntry {
  id: number;
  time: string;
  type: 'error' | 'warn' | 'info';
  message: string;
  page: string;
  component?: string;
  details?: unknown;
  synced?: boolean;
}

// Storage configuration
const CONFIG = {
  STORAGE_KEY: 'vertechie_logs',
  MAX_LOGS: 100,
  SYNC_INTERVAL: 30000,  // Sync every 30 seconds
};

// Logger object
const Logger = {
  // ========== LOGGING METHODS ==========

  /**
   * Log an error
   * @param message - Error description
   * @param details - Additional data (API response, error object, etc.)
   * @param component - Component name where error occurred
   */
  error(message: string, details?: unknown, component?: string): void {
    this._save('error', message, details, component);
    console.error(`🔴 [ERROR]${component ? ` [${component}]` : ''} ${message}`, details || '');
  },

  /**
   * Log a warning
   */
  warn(message: string, details?: unknown, component?: string): void {
    this._save('warn', message, details, component);
    console.warn(`🟡 [WARN]${component ? ` [${component}]` : ''} ${message}`, details || '');
  },

  /**
   * Log info
   */
  info(message: string, details?: unknown, component?: string): void {
    this._save('info', message, details, component);
    console.log(`🔵 [INFO]${component ? ` [${component}]` : ''} ${message}`, details || '');
  },

  /**
   * Log API errors specifically
   */
  apiError(endpoint: string, status: number, response: unknown, component?: string): void {
    this.error(`API Failed: ${endpoint} (${status})`, { status, response }, component);
  },

  // ========== INTERNAL METHODS ==========

  _save(type: LogEntry['type'], message: string, details?: unknown, component?: string): void {
    try {
      const logs = this.getLogs();
      
      const newLog: LogEntry = {
        id: Date.now(),
        time: new Date().toISOString(),
        type,
        message,
        page: window.location.pathname,
        component,
        details: this._sanitize(details),
        synced: false,
      };

      logs.push(newLog);

      // Keep only last MAX_LOGS
      while (logs.length > CONFIG.MAX_LOGS) {
        logs.shift();
      }

      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(logs));
      
      // Send to backend (non-blocking)
      this._sendToBackend([newLog]);
    } catch {
      // Storage full or unavailable - fail silently
    }
  },

  _sanitize(details: unknown): unknown {
    try {
      return JSON.parse(JSON.stringify(details, (key, value) => {
        // Truncate large strings (like base64 images)
        if (typeof value === 'string' && value.length > 500) {
          return `[Truncated: ${value.length} chars]`;
        }
        return value;
      }));
    } catch {
      return { error: 'Could not serialize' };
    }
  },

  // ========== BACKEND SYNC METHODS ==========

  async _sendToBackend(logs: LogEntry[]): Promise<void> {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.FRONTEND_LOGS), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          logs: logs.map(log => ({
            type: log.type,
            message: log.message,
            page: log.page,
            component: log.component,
            details: log.details,
            timestamp: log.time,
            client_id: log.id,
          }))
        }),
      });

      if (response.ok) {
        this._markSynced(logs.map(l => l.id));
      }
    } catch {
      // Network error - will sync later
    }
  },

  _markSynced(ids: number[]): void {
    try {
      const logs = this.getLogs();
      logs.forEach(log => {
        if (ids.includes(log.id)) {
          log.synced = true;
        }
      });
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(logs));
    } catch {
      // Ignore
    }
  },

  /**
   * Sync all unsynced logs to backend
   */
  async syncToBackend(): Promise<void> {
    const unsynced = this.getLogs().filter(log => !log.synced);
    if (unsynced.length > 0) {
      console.log(`📤 Syncing ${unsynced.length} logs to backend...`);
      await this._sendToBackend(unsynced);
    }
  },

  // ========== RETRIEVAL METHODS ==========

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /**
   * Get only error logs
   */
  getErrors(): LogEntry[] {
    return this.getLogs().filter(log => log.type === 'error');
  },

  /**
   * Get logs count by type
   */
  getStats(): { total: number; errors: number; warnings: number; info: number; unsynced: number } {
    const logs = this.getLogs();
    return {
      total: logs.length,
      errors: logs.filter(l => l.type === 'error').length,
      warnings: logs.filter(l => l.type === 'warn').length,
      info: logs.filter(l => l.type === 'info').length,
      unsynced: logs.filter(l => !l.synced).length,
    };
  },

  // ========== VIEW METHODS (for browser console) ==========

  /**
   * Show all logs in console as table
   */
  show(): void {
    const logs = this.getLogs();
    if (logs.length === 0) {
      console.log('📋 No logs found');
      return;
    }
    console.log(`📋 Showing ${logs.length} logs:`);
    console.table(logs.map(({ time, type, message, page, component, synced }) => ({
      time: new Date(time).toLocaleString('en-IN'),
      type,
      message,
      page,
      component,
      synced: synced ? '✓' : '✗'
    })));
  },

  /**
   * Show only errors in console
   */
  showErrors(): void {
    const errors = this.getErrors();
    if (errors.length === 0) {
      console.log('✅ No errors found');
      return;
    }
    console.log(`🔴 Showing ${errors.length} errors:`);
    console.table(errors.map(({ time, message, page, component, details }) => ({
      time: new Date(time).toLocaleString('en-IN'),
      message,
      page,
      component,
      details: JSON.stringify(details)?.substring(0, 50)
    })));
  },

  /**
   * Show detailed view of a specific log by ID
   */
  showDetail(id: number): void {
    const log = this.getLogs().find(l => l.id === id);
    if (log) {
      console.log('📋 Log Detail:');
      console.log(log);
    } else {
      console.log('❌ Log not found');
    }
  },

  // ========== EXPORT METHODS ==========

  /**
   * Download logs as text file
   */
  download(): void {
    const logs = this.getLogs();
    if (logs.length === 0) {
      console.log('📋 No logs to download');
      return;
    }

    const text = logs.map(log => 
`[${new Date(log.time).toLocaleString('en-IN')}] [${log.type.toUpperCase()}] ${log.page}${log.component ? ` (${log.component})` : ''} [${log.synced ? 'Synced' : 'Not Synced'}]
${log.message}
${log.details ? JSON.stringify(log.details, null, 2) : ''}
${'─'.repeat(50)}`
    ).join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vertechie-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    console.log('✅ Logs downloaded!');
  },

  /**
   * Download only errors
   */
  downloadErrors(): void {
    const errors = this.getErrors();
    if (errors.length === 0) {
      console.log('✅ No errors to download');
      return;
    }

    const text = errors.map(log => 
`[${new Date(log.time).toLocaleString('en-IN')}] ${log.page}${log.component ? ` (${log.component})` : ''}
ERROR: ${log.message}
${log.details ? JSON.stringify(log.details, null, 2) : ''}
${'─'.repeat(50)}`
    ).join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vertechie-errors-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    console.log('✅ Errors downloaded!');
  },

  // ========== UTILITY METHODS ==========

  /**
   * Clear all logs
   */
  clear(): void {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    console.log('🗑️ All logs cleared!');
  },
};

// Initialize on page load
if (typeof window !== 'undefined') {
  // Sync unsynced logs on page load (after 3 seconds)
  setTimeout(() => Logger.syncToBackend(), 3000);
  
  // Periodic sync every 30 seconds
  setInterval(() => Logger.syncToBackend(), CONFIG.SYNC_INTERVAL);
  
  // Sync before page close using sendBeacon
  window.addEventListener('beforeunload', () => {
    const unsynced = Logger.getLogs().filter(l => !l.synced);
    if (unsynced.length > 0 && navigator.sendBeacon) {
      const payload = JSON.stringify({ 
        logs: unsynced.map(log => ({
          type: log.type,
          message: log.message,
          page: log.page,
          component: log.component,
          details: log.details,
          timestamp: log.time,
          client_id: log.id,
        }))
      });
      navigator.sendBeacon(getApiUrl(API_ENDPOINTS.FRONTEND_LOGS), payload);
    }
  });

  // Make Logger available globally in browser console
  (window as unknown as { Logger: typeof Logger }).Logger = Logger;
}

export default Logger;
