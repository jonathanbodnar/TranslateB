## Admin Panel (MVP)

### Scope
- Edit and publish product tunables safely (no code deploy): intake flow, translator modes, share options, UI knobs.
- Versioned config with audit trail and instant hot‑reload in engines.
- Basic moderation for public wall (if enabled) and share templates visibility.

### Roles & Access
- Roles: `admin`, `editor` (stored via Supabase Auth metadata or table).
- Access:
  - `admin`: read/write config, publish, view audit, toggle public wall.
  - `editor`: propose draft changes, cannot publish.
- Route protection: `/admin/*` requires session with role; server verifies on each call.

### Navigation
- Config (current / draft)
- Versions (history + diff)
- Moderation (optional if wall enabled)
- System (env/health, read‑only)

### Data Model
Admin config is a single JSON document (see `admin-config.json`). Engines subscribe to the latest published config id.

Versioned record shape
```json
{
  "config_id": "cfg_mvp_1",
  "status": "published",               
  "author_user_id": "u_123",
  "created_at": "2025-10-09T13:30:00Z",
  "payload": { /* matches admin-config.json */ },
  "notes": "Initial MVP defaults"
}
```

### UI Pages & Components
1) Config Editor
- Light JSON editor (textarea or simple code editor) with Zod schema validation and inline error list (MVP).
- Tabs: Intake, Translator, Share, Cognitive/Fear, UI.
- Actions: Save Draft, Validate, Publish.
- Preview: live examples (e.g., intake question weights preview).

2) Versions
- List with `config_id`, status, author, date.
- Diff view (side‑by‑side) of `payload` between versions.
- Restore as Draft.

3) Moderation (if `share.public_wall_enabled=true`)
- Queue: pending/flagged insights.
- Actions: Approve, Reject (with reason), Block terms.

4) System
- Read‑only env summary (safe subset), feature flags.

### API Contracts (BFF)
- GET `/api/admin/config` → latest published + current draft (if any)
- PUT `/api/admin/config` → upsert draft; validates schema; returns draft id
- POST `/api/admin/config/publish` → promote draft to published; emits `admin.config.updated`
- GET `/api/admin/versions` → list recent configs (paged)
- GET `/api/admin/versions/{config_id}` → single config + metadata
- POST `/api/admin/moderation/decision` → { item_id, decision, reason? } (if wall enabled)

Auth
- All endpoints require server‑side role check; deny if role missing.

### Validation & Safety
- JSON Schema validation on save/publish (fail fast with errors path).
- Guardrails: 
  - Intake `min_cards<=max_cards`.
  - Translator mode is `"4"|"8"`.
  - Heat map gradient is ascending array in (0..1).
- Publish requires at least 1 passing validation + optional dry‑run preview.

### Events
- `admin.config.updated { config_id }` (already in taxonomy)
- `admin.config.publish_failed { draft_id, errors[] }`
- `admin.moderation.decision { item_id, decision }`

### Frontend Structure
```text
frontend/src/features/admin/
  pages/
    AdminDashboard.tsx
    ConfigEditor.tsx
    Versions.tsx
    Moderation.tsx
  api/
    adminClient.ts  // GET/PUT config, publish, list versions, moderation
  components/
    JsonEditor.tsx  // light editor + Zod validation (MVP)
    DiffView.tsx
    VersionList.tsx
```

### Acceptance Criteria
- Can load current published config and render editor with schema validation.
- Can save a draft and see it in Versions.
- Publishing a valid draft updates engines within 5s and emits event.
- Unauthorized users cannot access `/admin` routes or APIs.
- (If wall enabled) Moderators can approve/reject items, and decisions persist.

### Minimal OpenAPI Additions (to extend `openapi.yaml` later)
```yaml
  /api/admin/config:
    get: { summary: Get latest config }
    put: { summary: Save draft config }
  /api/admin/config/publish:
    post: { summary: Publish current draft }
  /api/admin/versions:
    get: { summary: List versions }
  /api/admin/versions/{config_id}:
    get: { summary: Get version by id }
  /api/admin/moderation/decision:
    post: { summary: Approve/Reject a wall item }
```

### Security / RLS (backend note)
- Store configs in `admin_configs { config_id, status, payload jsonb, author_user_id }` with RLS restricting read/write by role.
- Audit table `admin_audit_log` for writes and publishes.


