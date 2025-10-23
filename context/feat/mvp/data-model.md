## Data Model Overview (MVP)

Entities
- users (auth.users)
- profiles(user_id, display_name)
- intake_sessions(id, user_id, mode, story_text, completed)
- intake_answers(id, session_id, question_id, choice, intensity)
- reflections(id, user_id, base_intake_text, wimts_option_id, translation_mode, chosen_translation_key, translation_text, recipient_id)
- contacts(id, user_id, name, role, relationship_type)
- contact_sliders(contact_id, directness, formality, warmth, support, humor, teasing)
- insights(id, user_id, type, title, snippet, tags[])
- admin_configs(config_id, status, payload, author_user_id)
- admin_audit_log(id, actor_user_id, action, config_id, details)
- shortlinks(code, target_url, utm, created_by)

Relations
- profiles 1:1 users
- intake_answers many:1 intake_sessions
- reflections many:1 users
- contacts many:1 users
- contact_sliders 1:1 contacts
- insights many:1 users
- admin_audit_log many:1 users


