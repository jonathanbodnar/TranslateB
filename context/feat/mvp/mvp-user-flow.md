## MVP User Flow, APIs, Schemas, and Code Structure

### Purpose
End-to-end user journey, starting at Landing → Auth/Guest → Intake mini-quiz → WIMTS chooser → Translator (4/8) → Save/Share → Profile → Relational Web. Includes API contracts, response schemas, events, and a proposed frontend/backend structure that aligns with existing docs.

---

## 1) High-Level User Journey

1. Landing / Intro Translate
   - Single input field: "What I’m trying to say" (paste/type)
   - CTA: "Make this land"
   - Events: landing.viewed, cta.clicked

2. Auth / Guest Path
   - Guest: proceeds directly to Intro/Intake Translate or full Intake mini-quiz (configurable)
   - Auth: Supabase Auth (Google/Apple/email)
   - Events: auth.started, auth.completed, guest.continued

3. Quick Quiz (5–6 cards)
   - After input, run a short adaptive quiz (same engine, fewer cards)
   - Events: intake_submitted, card_answered, result_rendered

4. Swipe & Choose (WIMTS + Translation)
   - Show WIMTS/translation cards the user can swipe through and choose the best match
   - Default = 4 listeners; Advanced toggle = 8
   - Events: wimts_option_viewed, wimts_option_selected, translation_tab_viewed

5. Register Gate to Save & Go Deeper
   - To save the chosen translation, take the deeper quiz, and invite contacts, user must register (Google/Apple/Email)
   - After signup: allow save/share/invite; unlock deeper quiz path
   - Events: auth.started, auth.completed, reflection.saved, copy.clicked, share.requested, share.completed, shortlink.created

6. Profile ("My Inner Mirror")
   - Cognitive Map, Fear Map, Living Insights feed
   - Events: profile.viewed, insight.liked

7. Relational Web (Relationship Depth, MVP)
   - Contact list/constellation, per-contact sliders and presets, mini-quiz/signals, translator with recipient
   - Events: contact.created, contact.updated, signal.logged, contact.translation_generated

8. Learning & Virality (MVP)
   - Learning: Insights feed, mirror moments, weekly summary
   - Virality: Shareable insight/reflection cards with shortlinks, public wall (optional toggle), referral attribution, pair reflection challenge
   - Events: insight.created, insight.liked, weekly.summary_ready, share.requested, share.completed, shortlink.created, shortlink.clicked, referral.attributed, public_wall.viewed, pair.invite_sent, pair.completed

---

## 2) Detailed Step-by-Step Flow with Calls

### Step 1: Intro Translate (Input First)
- UI: Single field "What I’m trying to say" (paste/type). CTA: "Make this land".
- On submit → create/continue a quick-quiz session seeded with the input.

Analytics
- landing.viewed
- cta.clicked { target: "start_my_mirror" }

### Step 2: Auth (optional)
- Path A: Continue as guest (anonymous profile created lazily when first write occurs)
- Path B: Sign in/up with Supabase Auth

Calls
- Supabase Auth (client SDK): signInWithOAuth('google'|'apple') | signInWithPassword | signUp

Responses
- auth_session: { user_id, access_token, expires_at }

Analytics
- auth.started { provider }
- auth.completed { provider, user_id }
- guest.continued

### Step 2: Start Quick Quiz Session
POST /api/intake/session.start
- Input: { story_text, mode: "quick" }
- Output: { session_id, next: "cards" }

Analytics
- intake_submitted { session_id }

### Step 3: Quick Quiz — Cards (5–6)
GET /api/intake/questions?session_id=…
- Output: { questions: Question[] }

POST /api/intake/answer
- Input: { session_id, question_id, choice: 'left'|'right'|'neither', intensity: 0|1|2 }
- Output: { ok: true, next_question_id? }

POST /api/intake/complete
- Input: { session_id }
- Output: ProfileSeed

ProfileSeed
```json
{
  "profile": {
    "lead": "Horizon",
    "next": "Forge",
    "mode": "Inward-led",
    "frictions_top": ["Subtext","Rulebook"],
    "fears": {"powerlessness":0.28,"incompetence":0.22,"betrayal":0.18}
  }
}
```

Analytics
- card_answered { session_id, question_id, choice, intensity }
- result_rendered { session_id }

### Step 4: WIMTS (3 options)
POST /api/wimts/generate
- Input: { session_id, intake_text, profile }
- Output: { what_i_meant_variants: WIMTSVariant[] }

WIMTSVariant
```json
{
  "option_id": "A",
  "title": "Option A",
  "body": "…",
  "tags": ["human-first"]
}
```

POST /api/wimts/select
- Input: { session_id, option_id }
- Output: { chosen_option_id: "A" }

Analytics
- wimts_option_viewed { option_id }
- wimts_option_selected { option_id }

### Step 5: Translator (4 default | 8 advanced)
POST /api/translate/generate
- Input: { base_text, mode: "4"|"8", persona_hints?, frictions_top? }
- Output (mode="4"):
```json
{
  "mode":"4",
  "translations": {
    "Thinker":"…",
    "Feeler":"…",
    "Sensor":"…",
    "Intuition":"…"
  }
}
```

- Output (mode="8") has keys: Te, Ti, Fe, Fi, Se, Si, Ni, Ne.

Analytics
- translation_tab_viewed { tab: "Thinker"|"Feeler"|… }

### Step 6: Save / Copy / Share (after registration)
POST /api/reflections
- Input: {
  base_intake_text,
  wimts_option_id,
  translation_mode: "4"|"8",
  chosen_translation_key: "Thinker"|"Te"|…,
  translation_text,
  recipient_id?
}
- Output: { reflection_id }

POST /api/share/card
- Input: { reflection_id | insight_id, privacy_flags, template_id? }
- Output: { assets: [ { type:"png"|"mp4", url } ], short_url, template_id }

POST /api/shortlink
- Input: { target_url, utm }
- Output: { code, url }

Analytics
- reflection.saved { reflection_id }
- copy.clicked { section: "wimts"|"translation" }
- share.requested / share.completed

### Step 7: Profile Snapshot
GET /api/profile/:userId
- Output (aggregate snapshot):
```json
{
  "user_id":"u_123",
  "cognitive_snapshot": { "dominant_streams":["Feeling","Intuition"], "shadow_streams":["Thinking","Sensation"], "processing_tendencies":["…"], "blind_spots":["…"], "trigger_probability_index":0.29, "communication_lens": {"incoming":{"N":0.72,"S":0.28,"T":0.31,"F":0.81}, "outgoing":{"N":0.65,"S":0.22,"T":0.25,"F":0.88} } },
  "fear_snapshot": { "fears":[{"key":"unworthiness","pct":0.46},{"key":"unlovability","pct":0.31},{"key":"powerlessness","pct":0.15},{"key":"unsafety","pct":0.08}], "heat_map": [[0.1,0.2],[0.2,0.5]], "geometry": {"cube":{"x":0.46,"y":0.31,"z":0.15,"d":0.08} }, "top3":["unworthiness","unlovability","powerlessness"] },
  "insights_snapshot": { "feed":[{"insight_id":"ins_987","type":"trigger","icon":"🔥","title":"Rejection pattern surfaced","snippet":"…","ts":"2025-10-09T13:28:00Z","tags":["work","feedback","unworthiness"]}], "mirror_moments":14, "inner_dialogue_replay":[{"script":"They don't care","reframe":"They might not understand yet"}] },
  "metadata": { "generated_at":"2025-10-09T13:30:00Z", "config_version":"cfg_2025_10_09_01" }
}
```

Analytics
- profile.viewed
- insight.liked { insight_id }

### Step 8: Relational Web (v1.1)
Contacts
- POST /api/contacts { name, role, tags? } → { contact_id }
- GET /api/contacts → ContactSummary[]
- GET /api/contacts/:id → ContactDetail (sliders, insights)
- POST /api/contacts/:id/sliders { directness, formality, … } → { ok: true }

Signals / Chat (optional MVP cut)
- POST /api/signals { contact_id, kind, text } → { signal_id }

Translator with recipient
- POST /api/translate/generate { base_text, recipient_id } → adapts tone with sliders/presets

### Step 9: Learning & Virality
Insights & Weekly Summary
- POST /api/insights/like { insight_id } → { ok: true }
- GET  /api/insights/weekly → { summary, top_themes, mirror_moments }

Share System
- POST /api/share/card { reflection_id | insight_id, privacy_flags, template_id? } → { assets[], short_url }
- POST /api/shortlink { target_url, utm } → { code, url }
- GET  /api/public/wall → PublicInsight[] (if enabled and anonymized)

Pair Reflection
- POST /api/pair/invite { to_contact, channel } → { invite_id, deeplink }
- POST /api/pair/complete { invite_id } → { pair_summary, dual_card }

---

## 3) Event & Analytics Taxonomy (minimal)
- landing.viewed, cta.clicked
- auth.started, auth.completed, guest.continued
- intake_submitted, card_answered, result_rendered
- wimts_option_viewed, wimts_option_selected
- translation_tab_viewed, copy.clicked
- reflection.saved, share.requested, share.completed
- profile.viewed, insight.liked
- contact.created, contact.updated, signal.logged

Payload includes user_id, session_id, ts, and event-specific fields.

---

## 4) API Surface (Gateway/BFF) Summary

Public (auth optional)
- POST /api/intake/session.start
- GET  /api/intake/questions
- POST /api/intake/answer
- POST /api/intake/complete
- POST /api/wimts/generate
- POST /api/wimts/select
- POST /api/translate/generate
- POST /api/reflections
- GET  /api/profile/:userId
- POST /api/share/card
- POST /api/shortlink
- GET  /api/public/wall
- POST /api/insights/like
- GET  /api/insights/weekly

Relational (v1.1)
- POST /api/contacts
- GET  /api/contacts
- GET  /api/contacts/:id
- POST /api/contacts/:id/sliders
- POST /api/signals
- POST /api/pair/invite
- POST /api/pair/complete

Admin (secured)
- GET/PUT /api/admin/config

Security
- Supabase RLS enforces per-user access; shortlink assets read-only public.

---

## 5) Minimal Schemas

Question
```json
{ "id":"Q1", "headline":"Which pressure felt bigger?", "left": {"label":"Put on the spot now"}, "right": {"label":"Too many moving parts"}, "helper_text":"…" }
```

ProfileSeed.profile
```json
{ "lead":"Horizon","next":"Forge","mode":"Inward-led","frictions_top":["Subtext","Rulebook"],"fears":{"powerlessness":0.28,"incompetence":0.22,"betrayal":0.18} }
```

Reflection (write)
```json
{ "reflection_id":"r_123", "user_id":"u_123", "wimts_option_id":"A", "translation_mode":"4", "chosen_translation_key":"Thinker", "recipient_id":null }
```

ContactDetail.sliders
```json
{ "directness":60,"formality":20,"warmth":90,"support":80,"humor":70,"teasing":50 }
```

---

## 6) Frontend Directory Structure (proposal)

```text
frontend/
  src/
    routes/
      Landing/
      Intake/
      Translator/
      Profile/
      Relational/
    features/
      intake/
        components/ Card.tsx, LiveFeedback.tsx
        api/ intakeClient.ts
        state/ intakeStore.ts
      wimts/
        components/ WIMTSCarousel.tsx
        api/ wimtsClient.ts
      translator/
        components/ TranslationTabs.tsx
        api/ translatorClient.ts
      profile/
        components/ Compass.tsx, FearCube.tsx, InsightsFeed.tsx
        api/ profileClient.ts
      contacts/
        components/ Constellation.tsx, ContactDrawer.tsx
        api/ contactsClient.ts
      share/
        components/ ShareCardPreview.tsx, PublicWall.tsx
        api/ shareClient.ts
      pair/
        components/ PairInvite.tsx, PairSummary.tsx
        api/ pairClient.ts
      insights/
        components/ WeeklySummary.tsx
        api/ insightsClient.ts
    api/
      http.ts (fetch wrapper with auth)
      types.ts (shared DTOs)
    state/
      userSession.ts
    analytics/
      tracker.ts (event emit helpers)
```

Routing
- React Router: /, /intake, /translate, /profile, /relational, /share/wall, /pair

State
- Lightweight: Zustand/Context for UI; React Query for server state.

Accessibility
- All interactive cards and tabs support keyboard and SR labels.

---

## 7) Backend Structure (proposal)

Edge Functions (Supabase) or small Node BFF with signed calls to AI services.

```text
backend/
  api/
    intake/
      start.ts
      questions.ts
      answer.ts
      complete.ts
    wimts/
      generate.ts
      select.ts
    translate/
      generate.ts
    reflections/
      create.ts
    profile/
      get.ts
    share/
      card.create.ts
      shortlink.create.ts
      wall.list.ts
    insights/
      like.create.ts
      weekly.get.ts
    contacts/
      create.ts
      list.ts
      get.ts
      sliders.ts
    signals/
      create.ts
    pair/
      invite.create.ts
      complete.create.ts
    admin/
      config.get.ts
      config.put.ts
  lib/
    db.ts (Supabase client)
    ai.ts (LLM/prompt orchestrations)
    auth.ts (session validation)
    validators.ts (zod schemas)
  schemas/
    intake.ts, wimts.ts, translate.ts, profile.ts, contacts.ts, share.ts, insights.ts, pair.ts
```

Notes
- Stream LLM responses when helpful; enforce safety/PII scrub before persist.
- RLS: reflections, contacts, signals scoped by user_id.

---

## 8) Page Variants (parameters)

Intro/Intake Translate (input-first, public snackable)
```json
{
  "translation_mode":"4",
  "show_advanced_toggle":false,
  "show_validation_intro":false,
  "show_wimts_chooser":false,
  "gating":"off",
  "quiz_mode":"quick"
}
```

Core Intake (full, gated translations 50%)
```json
{
  "translation_mode":"4",
  "show_advanced_toggle":true,
  "show_validation_intro":true,
  "show_wimts_chooser":true,
  "gating":"on",
  "virality": {"enable_share": true, "enable_public_wall": false },
  "relationship_depth": {"enable_recipient": true, "enable_sliders": true },
  "quiz_mode":"full"
}
```

---

## 9) Guardrails & Safety (minimum)
- Never produce manipulative/abusive content; respect consent/boundaries.
- PII scrub on intake; toxicity filter on outputs; rate limits per user/day.
- Ethics: no diagnosis; culturally sensitive; privacy-first sharing.

---

## 10) Open Items to Confirm
- Finalize mapping: keep 4 listeners + advanced 8; deprecate legacy tone list or map it.
- Confirm gating rules per route.
- Approve event taxonomy keys and payload shapes.
- Seed admin-config defaults consistent with current spec.



## 11) Relationship Web — Cytoscape Integration (MVP)

Goal: Replace the radial mock in `RelationshipWeb` with an interactive, scalable constellation using Cytoscape.js.

### A) Dependencies
- UI: `react-cytoscapejs`, `cytoscape`
- Layouts: `cytoscape-fcose` (or `cytoscape-cose-bilkent`)
- UX add‑ons (optional for MVP): `cytoscape-edgehandles` (create links), `cytoscape-popper` + `@popperjs/core` (tooltips), `cytoscape-context-menus`

Install
```bash
npm i cytoscape react-cytoscapejs cytoscape-fcose @popperjs/core
# optional
npm i cytoscape-edgehandles cytoscape-popper cytoscape-context-menus
```

### B) Data mapping
From `Relationship[]` (see `src/types/index.ts`) to Cytoscape `elements`:
```ts
type CyNode = { data: { id: string; label: string; type: string; closeness: number } };
type CyEdge = { data: { id: string; source: string; target: string; kind: string } };

function toElements(youId: string, relationships: Relationship[]) {
  const nodes: CyNode[] = [
    { data: { id: youId, label: 'You', type: 'self', closeness: 10 } }
  ];
  const edges: CyEdge[] = [];

  for (const r of relationships) {
    nodes.push({
      data: {
        id: `rel_${r.id}`,
        label: r.name,
        type: r.relationshipType,
        closeness: r.emotionalCloseness
      }
    });
    edges.push({
      data: {
        id: `e_you_${r.id}`,
        source: youId,
        target: `rel_${r.id}`,
        kind: 'you'
      }
    });
  }

  return [...nodes, ...edges];
}
```

### C) Stylesheet (size/color by closeness, type‑based icons/colors)
```ts
const stylesheet: cytoscape.Stylesheet[] = [
  {
    selector: 'node',
    style: {
      'background-color': '#88aaff',
      'label': 'data(label)',
      'color': '#fff',
      'font-size': 10,
      'text-valign': 'center',
      'text-halign': 'center',
      'width': 'mapData(closeness, 1, 10, 24, 56)',
      'height': 'mapData(closeness, 1, 10, 24, 56)',
      'border-width': 2,
      'border-color': 'rgba(255,255,255,0.35)'
    }
  },
  {
    selector: 'node[type = "Partner"], node[type = "Spouse"]',
    style: { 'background-color': '#f472b6' }
  },
  {
    selector: 'node[type = "Friend"]',
    style: { 'background-color': '#818cf8' }
  },
  {
    selector: 'node[type = "Boss"], node[type = "Manager"], node[type = "Colleague"]',
    style: { 'background-color': '#38bdf8' }
  },
  {
    selector: 'node[type = "Family"]',
    style: { 'background-color': '#34d399' }
  },
  {
    selector: 'node[type = "self"]',
    style: { 'background-color': '#ffffff', 'color': '#111827' }
  },
  {
    selector: 'edge',
    style: {
      'width': 1.5,
      'line-color': 'rgba(255,255,255,0.28)',
      'curve-style': 'straight'
    }
  }
];
```

### D) Minimal React component
```tsx
import React, { useMemo, useRef, useEffect } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';

cytoscape.use(fcose);

type Props = {
  relationships: Relationship[];
  onSelect?: (rel: Relationship) => void;
};

export function Constellation({ relationships, onSelect }: Props) {
  const youId = 'you';
  const elements = useMemo(() => toElements(youId, relationships), [relationships]);
  const cyRef = useRef<cytoscape.Core | null>(null);

  const layout = { name: 'fcose', animate: false, nodeSeparation: 75 } as const;

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.off('tap');
    cy.on('tap', 'node', (e) => {
      const id = e.target.id();
      if (id.startsWith('rel_') && onSelect) {
        const rel = relationships.find(r => `rel_${r.id}` === id);
        if (rel) onSelect(rel);
      }
    });
  }, [relationships, onSelect]);

  return (
    <CytoscapeComponent
      cy={(cy) => (cyRef.current = cy)}
      elements={elements}
      layout={layout}
      stylesheet={stylesheet}
      style={{ width: '100%', height: '320px' }}
      wheelSensitivity={0.2}
    />
  );
}
```

### E) Wire into `RelationshipWeb`
1. Create `features/contacts/components/Constellation.tsx` and paste the component (and helpers) there.
2. Import it in `src/components/RelationshipWeb.tsx` and replace the radial SVG block with:
```tsx
<Constellation
  relationships={relationships}
  onSelect={(rel) => setSelectedRelationship(rel)}
/>
```
3. Keep your existing detail modal and list; they work unchanged.

### F) Layout options
- `fcose` (recommended): stable force‑directed.
- `concentric`: concentric rings by `closeness` (set `minNodeSpacing`, `levelWidth` etc.).

Example concentric
```ts
const layout = {
  name: 'concentric',
  animate: false,
  concentric: (n: any) => n.data('closeness'),
  levelWidth: () => 1,
  minNodeSpacing: 40
} as const;
```

### G) Analytics (add to taxonomy)
- `relational.node_selected` { node_id, relationship_id }
- `relational.layout_applied` { layout: 'fcose'|'concentric' }

### H) Performance notes
- Disable animation for large graphs; use Canvas default.
- Limit relayouts; call `cy.layout(opts).run()` only on data changes.
- Cap devicePixelRatio for mobile to reduce overdraw.

---

## 12) MVP UI Libraries & Theming

We will keep the current look and feel in the frontend (existing Tailwind gradients, glass cards, spacing, motion timing) and only add the minimum libraries needed to implement the documented flow.

Keep (already in code)
- React, Tailwind CSS
- Framer Motion (page/element transitions and basic drag/swipe)
- Lucide icons

Add (minimal set)
- Data fetching: `@tanstack/react-query`
- Carousel (WIMTS A/B/C): `embla-carousel-react`
- Forms/validation (register gate, admin): `react-hook-form` + `zod`
- Relationship Web: `cytoscape`, `react-cytoscapejs`, `cytoscape-fcose`
- Profile bars: `recharts`
- Share (if enabled): `html-to-image`

Install
```bash
npm i @tanstack/react-query embla-carousel-react react-hook-form zod cytoscape react-cytoscapejs cytoscape-fcose recharts html-to-image
```

Defer (post‑MVP)
- 3D visuals (react-three-fiber)
- Cytoscape extensions (edgehandles, popper, context menus)
- Monaco editor; use textarea + Zod validation first in Admin

Theming constraints
- Do not introduce a new component library; stick to current Tailwind theme and glass/gradient styles.
- Reuse existing utility classes for spacing, radius, and colors; match motion durations used elsewhere.

