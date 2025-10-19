// Centralized event constants to avoid magic strings
export const ANALYTICS_EVENTS = {
  // Landing & Intro
  LANDING_VIEWED: 'landing.viewed',
  CTA_CLICKED: 'cta.clicked',
  
  // Auth
  AUTH_STARTED: 'auth.started',
  AUTH_COMPLETED: 'auth.completed',
  GUEST_CONTINUED: 'guest.continued',
  
  // Intake
  INTAKE_SUBMITTED: 'intake_submitted',
  CARD_ANSWERED: 'card_answered',
  RESULT_RENDERED: 'result_rendered',
  
  // WIMTS & Translator
  WIMTS_SESSION_STARTED: 'wimts.session_started',
  WIMTS_OPTION_VIEWED: 'wimts_option_viewed',
  WIMTS_OPTION_SELECTED: 'wimts_option_selected',
  TRANSLATION_TAB_VIEWED: 'translation_tab_viewed',
  
  // Save / Share
  REFLECTION_SAVED: 'reflection.saved',
  COPY_CLICKED: 'copy.clicked',
  SHARE_REQUESTED: 'share.requested',
  SHARE_COMPLETED: 'share.completed',
  SHORTLINK_CREATED: 'shortlink.created',
  SHORTLINK_CLICKED: 'shortlink.clicked',
  
  // Profile / Insights
  PROFILE_VIEWED: 'profile.viewed',
  INSIGHT_LIKED: 'insight.liked',
  WEEKLY_SUMMARY_READY: 'weekly.summary_ready',
  
  // Relational Web
  CONTACT_CREATED: 'contact.created',
  CONTACT_UPDATED: 'contact.updated',
  SIGNAL_LOGGED: 'signal.logged',
  CONTACT_TRANSLATION_GENERATED: 'contact.translation_generated',
  RELATIONAL_NODE_SELECTED: 'relational.node_selected',
  RELATIONAL_LAYOUT_APPLIED: 'relational.layout_applied',
  
  // Admin
  ADMIN_CONFIG_UPDATED: 'admin.config.updated'
} as const;

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];
