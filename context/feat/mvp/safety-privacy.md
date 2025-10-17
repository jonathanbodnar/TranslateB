## Safety & Privacy (MVP)

### Never-Do Rules
- No manipulation, coercion, abuse, or diagnosis.
- Respect consent, boundaries, culture; avoid shaming.

### PII Scrub (intake)
- Redact names, emails, phones, exact addresses, org names by default.
- Replace with neutral tokens (e.g., `@person1`, `@company1`).

### Moderation
- Intake and share text pass toxicity checks; on fail: block and show gentle reword prompt.
- Rate limits per user/day for AI calls and shares.

### Data Handling
- Separate PII from analytics; store only user_id in analytic events.
- Right-to-delete: purge reflections → embeddings → derived snapshots.

### Sharing Privacy
- Privacy flags: `share_display_name: full|type_only|anonymous`, `share_show_type: bool`, `allow_public_wall: bool`.
- If flags disallow, anonymize before rendering or skip post.

### Security Checklist
- Supabase RLS on user-owned tables.
- Sign server-to-model calls; validate auth on BFF.
- Secrets in env; no keys in client bundles.

