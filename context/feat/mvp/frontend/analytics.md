## Analytics Wiring (MVP)

Tracker helper
```ts
type Event = { name: string; payload?: Record<string, any> };
export function track(name: string, payload?: Record<string, any>) {
  // attach user_id, session_id, ts
  const body = { name, ts: new Date().toISOString(), ...payload };
  // send to PostHog/Mixpanel or your BFF
}
```

Map to taxonomy
- landing.viewed, cta.clicked
- auth.started, auth.completed, guest.continued
- intake_submitted, card_answered, result_rendered
- wimts_option_viewed, wimts_option_selected
- translation_tab_viewed, copy.clicked
- reflection.saved, share.requested, share.completed, shortlink.created, shortlink.clicked
- profile.viewed, insight.liked, weekly.summary_ready
- contact.created, contact.updated, signal.logged, contact.translation_generated, relational.node_selected, relational.layout_applied
- admin.config.updated, admin.config.publish_failed, admin.moderation.decision

Testing
- Provide a console logger in dev; snapshot test payload shapes.


