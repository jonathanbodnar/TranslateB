## Setup & Deploy (MVP)

1) Supabase
- Create project → enable `uuid-ossp`.
- Run `backend/schema.sql`, then `backend/rls.sql` in SQL editor.
- (Optional) Insert roles in `user_roles` for admin.

2) Backend
- Deploy Edge Functions/BFF with envs from `env.md` (server section).

3) Frontend
- Copy `.env` with `VITE_API_BASE_URL`.
- `npm i` then `npm run dev`.

4) Admin
- Seed `admin-config.json` as `published` (via API or DB) or save draft and publish in the panel once available.

5) Smoke tests
- Flow: input → quick quiz → WIMTS → translate → register gate → save → profile → relational.


