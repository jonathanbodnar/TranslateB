## Project Overview

TranslateB is a "living mirror" for communication. It helps users articulate what they really meant to say (WIMTS), generates recipient‑adaptive translations, maps relational dynamics, and surfaces cognitive/emotional patterns that shape how messages land. The system learns from feedback to improve clarity, connection, and growth over time.

### Core Value
- Turn misfires into connection by translating intent into audience‑sensitive language.
- Reflect users’ processing fingerprints and fear patterns to reduce distortion.
- Create shareable, resonant insights that organically drive adoption.


## MVP Scope (Initial Release)

1) Auth + Onboarding
- Email/password + OAuth (Google, Apple) via Supabase Auth
- 5–6 card mini‑quiz seeds cognitive fingerprint and top fears

2) Core Compose Loop
- Input context → AI generates a 3‑card WIMTS set (distinct perspectives)
- Translator generates options:
  - General 8 tabs: Direct, Gentle, Professional, Casual, Emotional, Logical, Supportive, Challenging
  - Relational 3 versions (when recipient selected): Harmony, Growth, Truth
- Save/copy/share; thumbs‑up for learning

3) Profile ("My Inner Mirror")
- Cognitive Data Processing Map: dominant vs shadow streams + short summaries
- Fear/Wound snapshot: top 3 with percentages
- Living Insights feed: tagged insights from reflections and selections

4) Admin Config (Basic)
- Tunables for thresholds, clustering similarity, bar display limits, and animation speed

5) Data Persistence
- Users, reflections, WIMTS cards, translations, insights, simple recipients
- Row‑level security policies for private data

6) Safety & Guardrails
- “Never do” rules enforced server‑side (no manipulation/diagnosis; consent‑aware; PII scrub)

Optional (MVP+)
- Shareable Insight Cards (static images) with shortlinks to a landing/mini‑quiz


## Roadmap (Future Iterations)

v1.1 — Relationship Depth
- Relational Web: constellation canvas + list view
- Contact Profile with sliders: Directness/Cushioning, Formality/Closeness, Warmth, Support Mode, Humor, Teasing/Edginess; plus advanced detail sliders
- Signals Chat: guided/free‑form modes to add ongoing context cues
- Results Accordion post‑intake with presets and guardrails

v2 — Learning + Virality
- Body‑state awareness and deeper “Living Mirror” layers (temporal depth, shadow integration)
- Year‑in‑Reflection reel, public wall (opt‑in), referral gems, pair reflection challenge
- Admin dashboards for AI tuning, templates, presets, and moderation


## Tech Stack

Frontend
- React (SPA) with React Router for routing
- TailwindCSS or Radix UI for accessible, fast UI
- React Query for server state; lightweight app state via Context/Zustand

Backend
- Supabase: Postgres (with RLS), Auth (email/OAuth), Storage, Realtime
- Supabase Edge Functions (Deno) for server‑side AI orchestration and signed calls

AI Layer
- LLMs (OpenAI/Anthropic) for WIMTS + Translator
- Embeddings + pgvector in Postgres for insight clustering and script→reframe detection
- Prompt library, privacy scrub, safety filters, and response validators

Infra & DevEx
- Deploy: Railway (static hosting for React build or small Node server) + managed Supabase
- Observability: Sentry/Logtail; Analytics: PostHog/Mixpanel
- Feature flags: simple env/flag file initially


## AI Integrations (Contracts & Guardrails)

WIMTS (What I Really Meant to Say)
- Inputs: original message, minimal context, user fingerprint, recent signals
- Output: 3 distinct cards; validation/affirmation intro; safety‑checked

Translator
- Inputs: message, recipient sliders/presets, relationship context, goal
- Output: 8‑tab general or 3‑version relational set; consent‑aware tone

Insights & Learning
- Thumbs‑up/selection events feed learning loop (ranking templates/tones)
- Embedding clustering tags insights; surfaces Mirror Moments and scripts→reframes

Safety
- PII scrub, toxicity/abuse filters, “never do” rules, privacy flags


## Features & Data Model (MVP)

Entities (Supabase)
- users (auth‑managed), profiles, recipients
- reflection_events, wimts_cards, translation_options, selected_translations
- insight_items, admin_configs, share_assets (optional)
- embeddings tables (pgvector) for insight clustering

Key Flows
- Onboarding: auth → mini‑quiz → seed profile snapshots
- Compose: context → WIMTS (3) → choose → Translator → choose → save/share → feedback
- Profile: fetch aggregated cognitive/fear/insight snapshots

Access & Security
- RLS per user; shortlinks read‑only for shared assets


## Non‑Functional Requirements

SEO
- Pre-rendered marketing pages (static build) and route-level dynamic <meta>
- OG images via a lightweight Railway endpoint or pre-generated assets
- Focus on fast LCP/CLS with optimized static delivery

OAuth
- Google, Apple; email magic link fallback (Supabase Auth)

Accessibility
- Semantic HTML, keyboard nav, sufficient contrast, screen reader labels

Privacy & Compliance
- Clear consent on storing reflections; right‑to‑delete; separate PII where feasible

Analytics
- Event taxonomy: reflection.created, wimts.generated, translation.selected, insight.liked, share.exported

Performance
- Edge Functions for AI calls; streaming where helpful; request tracing


## Project Maps (Flows)

Onboarding (Mini‑Quiz)
- Auth → 5–6 cards → compute fingerprint + fear snapshot → profile seeded

Core Compose (WIMTS → Translator)
- Input context → WIMTS (3 cards) → pick one → Translator (8 tabs or 3 relational) → select → copy/share/save → thumbs‑up

Profile Aggregation
- Reflections + feedback → engines compute snapshots → single JSON for profile page

Relationship Graph (Future)
- Add contacts → sliders/presets → signals → translator consumption → per‑contact insights

Growth Loop (Optional MVP+)
- Generate share card → shortlink → landing with mini‑quiz CTA → attribution


## Milestones (Indicative)

Week 1
- Auth, DB schema with RLS, admin_config
- Intake mini‑quiz; seed profile snapshots

Week 3
- WIMTS generation + guardrails; storage and retrieval; insights basics
- Translator (8‑tab) + selections; copy/share; minimal profile visuals

Week 4
- Polishing, RLS hardening, analytics, SEO pages, accessibility
- Share assets, simple moderation hooks, soft launch




## Flow

                ┌──────────────────────────┐
                │        Landing Page       │
                │  "Start My Mirror" CTA    │
                └────────────┬─────────────┘
                             │
                             ▼
                ┌──────────────────────────┐
                │   Authentication Screen   │
                │  • Sign in (Google/Apple) │
                │  • Continue as Guest      │
                └────────────┬─────────────┘
                             │
                             ▼
                ┌──────────────────────────┐
                │   Onboarding Mini-Quiz    │
                │  • 5–6 swipe cards        │
                │  • Capture fears, patterns│
                │  → Creates “Fingerprint”  │
                └────────────┬─────────────┘
                             │
                             ▼
             ┌──────────────────────────────────┐
             │      Core Reflection Loop         │
             │        (“What I Meant to Say”)    │
             │----------------------------------│
             │  User inputs:                    │
             │   • Raw message or context       │
             │   • (Optional) Recipient type    │
             │----------------------------------│
             │  AI returns:                     │
             │   • 3 reflection cards (WIMTS)   │
             │   • Emotions + needs summary     │
             └────────────┬────────────────────┘
                          │
            Selects one reflection (card) ▼
             ┌──────────────────────────────────┐
             │           Translator              │
             │----------------------------------│
             │  Inputs:                          │
             │   • Selected WIMTS card           │
             │   • Recipient type or profile     │
             │----------------------------------│
             │  Output options:                  │
             │   • 8 General tones (Direct, Gentle, etc.)│
             │   • 3 Relational modes (Harmony, Growth, Truth)│
             │----------------------------------│
             │  Actions: Copy / Save / Share / Feedback 👍👎 │
             └────────────┬────────────────────┘
                          │
                          ▼
             ┌──────────────────────────────────┐
             │          Save Reflection          │
             │----------------------------------│
             │  Store:                          │
             │   • WIMTS card selected          │
             │   • Translator version chosen    │
             │   • Feedback score               │
             │   • (Optional) Recipient link    │
             └────────────┬────────────────────┘
                          │
                          ▼
             ┌──────────────────────────────────┐
             │       “My Inner Mirror” Profile   │
             │----------------------------------│
             │  Displays:                        │
             │   • Processing map (thinking vs feeling)│
             │   • Top fears/wounds              │
             │   • Recent reflections & insights │
             │   • Simple like/acknowledge feed  │
             └────────────┬────────────────────┘
                          │
                          ▼
             ┌──────────────────────────────────┐
             │         Optional Sharing          │
             │----------------------------------│
             │  • Generate shareable insight card│
             │  • Create shortlink → landing page│
             │  • CTA for new users to join      │
             └──────────────────────────────────┘



