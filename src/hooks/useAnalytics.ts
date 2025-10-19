import { useCallback } from 'react';
import { useAuthGate } from '../features/auth/context/AuthGateContext';
import { useLocation } from 'react-router-dom';
import { APP_VERSION } from '../config/env';
import { trackEvent } from '../features/analytics/api/analyticsClient';
import { AnalyticsEventName } from '../config/analyticsEvents';
import { analyticsConfig } from '../config/analytics';

interface AnalyticsPayload {
  [key: string]: any;
}

export const useAnalytics = () => {
  const { user, isUserLoggedIn } = useAuthGate();
  const location = useLocation();

  const track = useCallback(async (event: AnalyticsEventName, payload?: AnalyticsPayload) => {
    // Skip tracking if analytics is disabled
    if (!analyticsConfig.enabled) {
      if (analyticsConfig.debug) {
        console.log('Analytics disabled, skipping event:', event, payload);
      }
      return;
    }

    try {
      const analyticsEvent = {
        event,
        ts: new Date().toISOString(),
        user_id: isUserLoggedIn ? user?.id : undefined,
        session_id: localStorage.getItem('tb_session_id') || undefined,
        page_id: location.pathname,
        app_version: APP_VERSION, // Using centralized config
        payload
      };
      
      // Using analytics client
      await trackEvent(analyticsEvent);

      if (analyticsConfig.debug) {
        console.info('Analytics event tracked:', event, payload);
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }, [user, isUserLoggedIn, location.pathname]);

  return { track };
};
