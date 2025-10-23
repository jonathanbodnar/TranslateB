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
  ADMIN: {
    DASHBOARD_VIEWED: 'admin.dashboard.viewed',
    CONFIG_EDITOR_OPENED: 'admin.config.editor_opened',
    CONFIG_UPDATED: 'admin.config.updated',
    CONFIG_VALIDATION_FAILED: 'admin.config.validation_failed',
    QUIZ_MANAGER_OPENED: 'admin.quiz.manager_opened',
    QUESTION_CREATED: 'admin.quiz.question_created',
    QUESTION_UPDATED: 'admin.quiz.question_updated',
    QUESTION_DELETED: 'admin.quiz.question_deleted',
    QUESTION_TOGGLED: 'admin.quiz.question_toggled',
  }
} as const;

// Type that includes both flat and nested event names
type FlatEvents = typeof ANALYTICS_EVENTS[Exclude<keyof typeof ANALYTICS_EVENTS, 'ADMIN'>];
type AdminEvents = typeof ANALYTICS_EVENTS['ADMIN'][keyof typeof ANALYTICS_EVENTS['ADMIN']];
export type AnalyticsEventName = FlatEvents | AdminEvents;
