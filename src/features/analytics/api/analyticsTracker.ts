import { trackEvent } from './analyticsClient';
import { APP_VERSION } from '../../../config/env';
import { analyticsConfig } from '../../../config/analytics';
import { AnalyticsEventName } from '../../../config/analyticsEvents';

interface AnalyticsPayload {
  [key: string]: any;
}

// Standalone analytics tracking function that doesn't depend on React context
export const trackAnalyticsEvent = async (
  event: AnalyticsEventName, 
  payload?: AnalyticsPayload,
  user_id?: string,
  page_id?: string
) => {
  // Skip tracking if analytics is disabled
  if (!analyticsConfig.enabled) {
    if (analyticsConfig.debug) {
      console.info('Analytics disabled, skipping event:', event, payload);
    }
    return;
  }

  try {
    const analyticsEvent = {
      event,
      ts: new Date().toISOString(),
      user_id,
      session_id: localStorage.getItem('tb_session_id') || undefined,
      page_id: page_id || window.location.pathname,
      app_version: APP_VERSION,
      payload
    };
    
    await trackEvent(analyticsEvent);

    if (analyticsConfig.debug) {
      console.info('Analytics event tracked:', event, payload);
    }
  } catch (error) {
    console.error('Analytics tracking failed:', error);
  }
};
