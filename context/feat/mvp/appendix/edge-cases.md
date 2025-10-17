## Edge Cases & Error Handling (MVP)

Input
- Empty input → disable CTA; show helper text.
- Too long (>1200 chars) → soft cap with note.
- Non-English → MVP assumes English; show tip to rephrase in English.

AI failures
- WIMTS/Translate error → show apology banner + Retry button.
- Low-quality output → user can edit input and retry (no thumbs‑down in MVP).

Abort/Skip
- Abandon quiz → keep session draft for 24h; resume by session_id.
- No selection → user can go back to input to retry.

Contacts
- Duplicate name → allow but warn; suggest adding role tag.
- Invite unjoined → nudge later (no blocking).

Rate limits
- Intake sessions/day capped by `RATE_LIMIT_MAX_SESSIONS_PER_DAY`. Show friendly limit message.

Moderation
- Toxic input blocked with gentle prompt; allow editing and resubmit.


