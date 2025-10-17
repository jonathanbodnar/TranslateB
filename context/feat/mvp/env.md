## Environment Variables (MVP)

Frontend (.env)
- VITE_API_BASE_URL=https://api.translateb.example

Backend (Railway / Edge Functions)
- SUPABASE_URL=
- SUPABASE_ANON_KEY=
- SUPABASE_SERVICE_ROLE_KEY=
- OPENAI_API_KEY=
- EMBEDDINGS_PROVIDER=(Which embeddings provider to use for insights clustering.)
- SHARE_OG_LOCKUP_URL= (logo to render on share card)
- SHORTLINK_BASE=https://mirror.app/r (Base for generating short links used by share system.)
- RATE_LIMIT_MAX_SESSIONS_PER_DAY=100
- CFG_VERSION=cfg_mvp_1

Notes
- Do not expose service role keys to the client.
- Use per‑env secrets in Railway/Supabase; keep frontend `.env` limited to public keys.

