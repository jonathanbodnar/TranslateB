import { REACT_APP_ANALYTICS_ENABLED, NODE_ENV } from './env';

export const analyticsConfig = {
  enabled: REACT_APP_ANALYTICS_ENABLED,
  batchSize: 10,
  flushInterval: 5000,
  debug: NODE_ENV === 'development'
};
