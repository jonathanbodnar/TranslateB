## Backend Directory Structure (Edge Functions / BFF)

```text
backend/
  api/
    intake/
      start.ts            // POST /api/intake/session.start
      questions.ts        // GET  /api/intake/questions
      answer.ts           // POST /api/intake/answer
      complete.ts         // POST /api/intake/complete
    wimts/
      generate.ts         // POST /api/wimts/generate
      select.ts           // POST /api/wimts/select
    translate/
      generate.ts         // POST /api/translate/generate
    reflections/
      create.ts           // POST /api/reflections
    profile/
      get.ts              // GET  /api/profile/:userId
    contacts/
      create.ts           // POST /api/contacts
      list.ts             // GET  /api/contacts
      get.ts              // GET  /api/contacts/:id
      sliders.ts          // POST /api/contacts/:id/sliders
    insights/
      like.ts             // POST /api/insights/like
      weekly.ts           // GET  /api/insights/weekly
    share/
      card.ts             // POST /api/share/card
      shortlink.ts        // POST /api/shortlink
      wall.ts             // GET  /api/public/wall
    pair/
      invite.ts           // POST /api/pair/invite
      complete.ts         // POST /api/pair/complete
    admin/
      config.get.ts       // GET  /api/admin/config
      config.put.ts       // PUT  /api/admin/config
      config.publish.ts   // POST /api/admin/config/publish
      versions.list.ts    // GET  /api/admin/versions
      versions.get.ts     // GET  /api/admin/versions/{config_id}
      moderation.decision.ts // POST /api/admin/moderation/decision
  lib/
    db.ts                 // Supabase client (service key in server env)
    auth.ts               // Auth/session helpers + role checks
    ai.ts                 // WIMTS/Translator orchestrations + safety filters
    validate.ts           // Zod schemas for request validation
    analytics.ts          // emit events per taxonomy
  schemas/
    intake.ts wimts.ts translate.ts profile.ts reflections.ts contacts.ts insights.ts share.ts pair.ts admin.ts
```

Notes
- All handlers validate input with Zod, enforce auth via `auth.ts`, and return shapes matching OpenAPI.
- Use streaming responses where appropriate; otherwise JSON.


