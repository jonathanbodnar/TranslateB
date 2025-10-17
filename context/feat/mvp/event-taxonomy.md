## Event Taxonomy (MVP)

### Conventions
- All events include: `ts` (ISO), `user_id` (nullable for guest), `session_id` (nullable), `page_id`, `app_version`.
- Payload fields listed per event below are in addition.

### Landing / Intro
- landing.viewed { referrer? }
- cta.clicked { target }

### Auth
- auth.started { provider }
- auth.completed { provider, success: boolean, user_id }
- guest.continued {}

### Intake
- intake_submitted { session_id, mode }
- card_answered { session_id, question_id, choice, intensity }
- result_rendered { session_id }

### WIMTS & Translator
- wimts_option_viewed { session_id, option_id }
- wimts_option_selected { session_id, option_id }
- translation_tab_viewed { session_id, tab }

### Save / Share
- reflection.saved { reflection_id }
- copy.clicked { section }
- share.requested { kind: 'insight'|'reflection', id }
- share.completed { kind, id, template_id }
- shortlink.created { code, target }
- shortlink.clicked { code, utm }

### Profile / Insights
- profile.viewed { profile_user_id }
- insight.liked { insight_id }
- weekly.summary_ready { week_start }

### Relational Web
- contact.created { contact_id, type }
- contact.updated { contact_id, changes }
- signal.logged { contact_id, kind }
- contact.translation_generated { contact_id, mode, key }
- relational.node_selected { node_id, relationship_id }
- relational.layout_applied { layout }

### Admin
- admin.config.updated { config_id }

