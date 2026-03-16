/**
 * Calendar sync with Google and Microsoft: connect, status, sync now.
 */
import { api } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface CalendarConnectionDto {
  id: string;
  provider: string;
  calendar_id?: string;
  calendar_name?: string;
  is_active: boolean;
  sync_enabled: boolean;
  last_synced_at?: string;
  sync_status?: string;
  last_sync_error?: string;
}

export interface SyncStatusResponse {
  connections: CalendarConnectionDto[];
  last_sync_at?: string;
  sync_in_progress: boolean;
}

export const calendarSyncService = {
  async getConnectGoogleUrl(): Promise<{ auth_url: string; state: string }> {
    return api.get(API_ENDPOINTS.CALENDAR_SYNC.CONNECT_GOOGLE);
  },

  async getConnectMicrosoftUrl(): Promise<{ auth_url: string; state: string }> {
    return api.get(API_ENDPOINTS.CALENDAR_SYNC.CONNECT_MICROSOFT);
  },

  async postCallbackGoogle(code: string, state: string): Promise<{ message: string; connection_id: string }> {
    return api.post(API_ENDPOINTS.CALENDAR_SYNC.CALLBACK_GOOGLE, { code, state });
  },

  async postCallbackMicrosoft(code: string, state: string): Promise<{ message: string; connection_id: string }> {
    return api.post(API_ENDPOINTS.CALENDAR_SYNC.CALLBACK_MICROSOFT, { code, state });
  },

  async getConnections(): Promise<CalendarConnectionDto[]> {
    return api.get(API_ENDPOINTS.CALENDAR_SYNC.CONNECTIONS);
  },

  async getSyncStatus(): Promise<SyncStatusResponse> {
    return api.get(API_ENDPOINTS.CALENDAR_SYNC.SYNC_STATUS);
  },

  async syncNow(): Promise<{ message: string }> {
    return api.post(API_ENDPOINTS.CALENDAR_SYNC.SYNC_NOW);
  },

  async disconnect(connectionId: string): Promise<void> {
    return api.delete(API_ENDPOINTS.CALENDAR_SYNC.DISCONNECT(connectionId));
  },
};
