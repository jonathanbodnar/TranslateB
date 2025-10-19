import { apiFetch } from './http';
import { AnalyticsEventName } from '../config/analyticsEvents';

export interface AnalyticsEvent {
  event: AnalyticsEventName;
  ts: string;
  user_id?: string;
  session_id?: string;
  page_id: string;
  app_version: string;
  payload?: Record<string, any>;
}

// Using existing apiFetch pattern instead of direct fetch
export async function trackEvent(event: AnalyticsEvent) {
  return apiFetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(event)
  });
}

export async function trackBatch(events: AnalyticsEvent[]) {
  return apiFetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({ events })
  });
}
