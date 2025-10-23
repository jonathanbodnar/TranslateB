# 🪞 PROFILE PAGE: "My Inner Mirror" — Design Description (EFNJ Example)

## 1️⃣ Cognitive Data Processing Map

### Purpose (for AI/system logic)
Visualizes how the brain prioritizes, interprets, and communicates information — showing what "streams" feel natural, and which are filtered or mistrusted. This is the user's processing fingerprint.

### User-facing display text
"See how your brain filters and prioritizes information from the world around you. This shows what types of input feel the most natural and what you might find harder to trust at first."

### Visual Element
**Primary Visual: Spinning Compass (Four Axes)**
- Each axis represents a major cognitive orientation (Intuition, Sensation, Thinking, Feeling).
- The EFNJ user's orb rotates dynamically toward Extraverted Feeling and Intuitive Perception, glowing brighter there — representing comfort and priority.
- The Thinking and Sensation quadrants glow more dimly, showing less-trusted streams.
- The orb shifts subtly as user behavior and reflections change — a living, adaptive fingerprint.

**Alternative Option: Soundwave Mirror**
- Each cognitive channel visualized as a sound frequency band.
- The more dominant or "trusted" the function, the stronger and steadier its wave pulse.

### Data Display (Underneath the Visual)

| Category | Example Output for EFNJ User |
|----------|------------------------------|
| Dominant Stream(s) | "You process data through emotional resonance and patterns. You prioritize how things feel and what they mean over raw data." |
| Shadow Stream(s) | "You may distrust detached logic or strict structure until emotional clarity is achieved." |
| Processing Tendencies | "You seek consensus and meaning before action. You read between lines and often act on intuition before facts are fully clear." |
| Cognitive Blind Spots | "You may overlook inconsistencies or facts when focused on keeping harmony." |
| Trigger Probability Index | "Triggers tend to occur when your intuition is dismissed or emotional intent is misunderstood." |

**Switch View: Communication Lens**
Toggling this reorients the compass axes to show how you express vs. how you interpret. Example for EFNJ: outward empathy is strong, but factual brevity from others can feel cold or rejecting.

## 2️⃣ Fear / Wound Mapping Layer

### Purpose (for AI/system logic)
Displays emotional distortions that color perception and decision-making, mapping which fears activate most often and in what balance.

### User-facing display text
"See which emotional patterns influence how you experience the world. This map shows which fears tend to activate most and how close they are to your core self."

### Visual Element Options

**Primary Option 1: 3D Fear Cube**
- **Axes:** X: Unworthiness ↔ Value Y: Unlovability ↔ Love Z: Powerlessness ↔ Agency Depth: Unsafety ↔ Trust
- Inner cube glows softly (core desires). Outer cube pulses where fear activation is strongest.
- EFNJ example: cube pulses toward "Unworthiness" and "Unsafety," showing emotional overextension and fear of rejection.

**Primary Option 2: Orbit System**
- Core Self at center; fears orbit as planets.
- Distance from center = activation frequency.
- EFNJ orbit example: "Unworthiness" and "Unlovability" orbit closest, "Powerlessness" more distant.

**Mandatory Secondary Visual: Heat Map Overlay**
- Always displayed alongside cube or orbit.
- Shows live "emotional temperature" for each fear (based on user data from reflections and "What I Meant to Say" results).
- Not redundant: Cube/Orbit shows relational balance; Heat Map shows recency and intensity.

### Fears Breakdown (Dynamic Bars)
Only top three visible by default; full expansion reveals all.

| Fear Category | % Activation (EFNJ Example) |
|---------------|----------------------------|
| Fear of Unworthiness | 46% |
| Fear of Not Being Lovable | 31% |
| Fear of Powerlessness | 15% |
| Fear of Unsafety | 8% |

Bars subtly animate with live percentage updates over time. Small glowing pulse = currently active or triggered.

## 3️⃣ Living Insights Feed

### Purpose (for AI/system logic)
Displays evolving patterns of self-awareness — insights, realizations, or emotional shifts that arise as the user interacts with mirror reflections. This becomes a visual record of growth.

### User-facing display text
"Your insights grow here. Each moment you recognize a pattern or reframe a reaction becomes part of your story of awareness and change."

### Visual Element
**Feed Stream (Color- or Symbol-Coded)** Clean vertical scrolling layout. Each entry tagged by insight type with a symbol or color stripe:

| Symbol | Theme | Example Insight |
|--------|-------|----------------|
| 💬 | Communication Clarity | "You often say yes when your tone says maybe — your mirror noticed this pattern three times this week." |
| 🔥 | Emotional Trigger Insight | "Your fear of rejection showed up when feedback felt personal." |
| 🌱 | Growth / Integration | "You paused before reacting — this is your 5th moment of re-centering under stress." |
| 💡 | Core Realization | "What you feared was criticism was actually care — you're learning to reinterpret belonging." |

**Additions:**
- **Mirror Moment Counter:** small badge showing the number of conscious recognition moments logged (e.g., "14 mirror moments so far").
- **Inner Dialogue Replay (Text Log):** expands to show top 3 recurring mental scripts and their AI-generated reframes (e.g., "They don't care" → "They might not understand yet.").

## 4️⃣ Possible Future Metrics (For Later Development)
These are powerful but can be added in later UI iterations.

| Metric | Description | Example Output |
|--------|-------------|----------------|
| Conscious vs. Shadow Function Balance | Tracks ratio of conscious vs. shadow cognitive function activity. | "Conscious 68% / Shadow 32% this week." |
| Integration Score | Measures harmony between dominant and inferior cognitive functions, based on linguistic and emotional data alignment. | "Integration at 74% — improving consistency between thoughts and feelings." |

## 🔍 Info ("i") Section Descriptions (User-Facing Text)

### Cognitive Data Processing Map
This is how your brain probably filters reality. Everyone receives constant sensory, emotional, and logical data from our lives. We cannot handle it all simultaneously, so we prioritize and trust different types over others. Understanding your comfort zones helps you see where misunderstanding or miscommunication is most likely to occur — the birth point of many emotional "misfires."

### Fear / Wound Mapping
To help you visualize the fears that hijack your communication. Each fear arises when core desires (like love, safety, worth, or power) feel threatened.

### Inner Dialogue Replay
"This shows your repeating thought loops and how they change as you heal."

---

Got it — the below now reflects your locked-in "Info ('i') section wording" and expands into a full AI + UI Build Specification Document for the Profile Page: "My Inner Mirror."

It's structured so a dev team (AI/UX/UI/data) can hand off this one document to begin building:
- Interface layout and visuals
- Function + engine logic
- Data structure + linking
- Admin field definitions for tuning and testing

# 🪞 PROFILE PAGE: "My Inner Mirror" — Build Specification Document (EFNJ Example)

## 🔷 1️⃣ Cognitive Data Processing Map

### 🧭 Purpose (System Logic)
Visualizes how the user's brain prioritizes, interprets, and communicates data. Generates a live profile of comfort zones, blind spots, and probable triggers.

### 🖥️ UI Requirements
- **Primary Visual: Spinning Compass (Four Axes)**
  - Axes: Intuition, Sensation, Thinking, Feeling
  - Center orb glows brighter and rotates toward the dominant data streams.
  - Dimmed quadrants = less-trusted data channels.
  - Subtle, fluid animation when user inputs change (e.g., after reflections, insights, or scenario entries).
  - **Secondary Visual (Option): Soundwave Mirror (four bands, one per axis).**

**Below Visual:** Structured data card list:

| Field Label | Description / Output Example |
|-------------|----------------------------|
| Dominant Stream(s) | Text summary from cognitive weighting: "You process data through emotional resonance and patterns…" |
| Shadow Stream(s) | Text summary for least-trusted inputs. |
| Processing Tendencies | Descriptive synthesis (AI-generated). |
| Cognitive Blind Spots | Summary of where misunderstanding likely occurs. |
| Trigger Probability Index | % likelihood of reactive response, derived from pattern correlation between fear activations and shadow functions. |
| Switch View: Communication Lens | Toggle animation that rotates axes labels from perception to expression mode. Displays different quadrant highlights and descriptive overlay text. |

### ⚙️ Functional Logic / AI Engine

**Input Data Sources:**
- Cognitive function weights (from intake or test engine).
- Historical communication event data (e.g., "What I Meant to Say" selections).
- Correlations between fear activation + cognitive mismatch.

**Core Calculations:**
- Weighted averages of dominant vs. shadow streams → determines compass bias (orb position).
- Trigger Probability Index = Frequency(shadow response under emotional activation) / Total reflections.
- Communication Lens = compares outgoing vs. incoming confidence scores per axis.

**Outputs:**
- Real-time visual positioning of orb.
- Updated descriptive summaries using templated language + dynamic inserts.
- Pushes "trigger events" to Insights Feed when thresholds exceed admin-set values.

### 🔍 User-Facing Info Text
"This is how your brain probably filters reality. Everyone receives constant sensory, emotional, and logical data from our lives. We cannot handle it all simultaneously, so we prioritize and trust different types over others. Understanding your comfort zones helps you see where misunderstanding or miscommunication is most likely to occur — the birth point of many emotional 'misfires.'"

## 🔷 2️⃣ Fear / Wound Mapping

### 💡 Purpose (System Logic)
Visualizes the emotional fears that most distort communication and perception. Converts qualitative emotional data into measurable activation patterns.

### 🖥️ UI Requirements
- **Primary Visual (Designer Choice):**
  - 3D Fear Cube (4 axes: Unworthiness, Unlovability, Powerlessness, Unsafety)
  - Inner cube = core desires (Value, Love, Agency, Trust)
  - Outer cube = active fears, intensity visualized by pulsing glow.
  - OR Orbit System: fears as orbiting planets whose proximity = activation frequency.
- **Mandatory Secondary Visual: Heat Map Overlay**
  - Displays most recent emotional temperature by color gradient (cool = resolved, warm = active).
  - Updates continuously with user reflection data.

**Below Visual:** Dynamic bar list (Top 3 visible, expandable for full list):

| Fear | % Activation Example (EFNJ) |
|------|----------------------------|
| Unworthiness | 46% |
| Unlovability | 31% |
| Powerlessness | 15% |
| Unsafety | 8% |

### ⚙️ Functional Logic / AI Engine

**Input Data Sources:**
- Fear tagging from "What I Meant to Say" engine.
- Text sentiment + emotion classification (pattern-matched to fear categories).
- Time-weighted decay (recent activations count higher).

**Core Calculations:**
- Each fear = (activation count * recency weight) / total reflections.
- Normalize to 100% scale.
- Update orbit/cube coordinates accordingly.
- Heat map overlay intensity = recent activity percentile.

**Outputs:**
- Animated visuals reflecting balance between fears.
- Real-time update to Insights Feed when new peak activity detected.

### 🔍 User-Facing Info Text
"To help you visualize the fears that hijack your communication. Each fear arises when core desires (like love, safety, worth, or power) feel threatened."

## 🔷 3️⃣ Living Insights Feed

### 💡 Purpose (System Logic)
Aggregates insights from AI analysis and user self-acknowledgements into a scrollable, color-coded feed. Acts as the "storyline of self-awareness."

### 🖥️ UI Requirements
- **Feed Layout:**
  - Vertical scroll.
  - Each insight = card with icon, title, and snippet.
  - Color-coded or symbol-coded by type (💬 Communication, 🔥 Trigger, 🌱 Growth, 💡 Core Realization).
  - Filter bar for category or time.

**Additional Modules within Feed:**
- **Mirror Moment Counter**
  - Small badge displaying cumulative number of recognized "mirror moments."
  - Auto-updates when user thumbs-up or acknowledges an insight.
- **Inner Dialogue Replay (Text Log)**
  - Expanding section showing top 3 repeating mental scripts.
  - Includes AI reframed versions underneath.
  - Example:
    - "They don't care." → "They might not understand yet."
    - "I always mess up." → "I'm still learning — that's progress."

### ⚙️ Functional Logic / AI Engine

**Input Data Sources:**
- User "thumbs-up" on reflections.
- AI tagging of insight type (based on NLP theme clustering).
- Frequency of repeated language or emotion markers.

**Core Calculations:**
- Theme Clustering via semantic similarity → determines symbol/color.
- Insight Trend Detection → tracks repetition thresholds.
- Mirror Moment Counter increments when a new self-recognition is logged.
- Inner Dialogue Replay generated by comparing recent reflection transcripts to recurring phrase clusters.

**Outputs:**
- Feed entries with live data.
- Dynamic tag generation for insight themes.
- Integration with Notifications for "New Insight Added" pings.

### 🔍 User-Facing Info Text
**Living Insights Feed**
"Your insights grow here. Each moment you recognize a pattern or reframe a reaction becomes part of your story of awareness and change."

**Inner Dialogue Replay**
"This shows your repeating thought loops and how they change as you heal."

## 🔷 4️⃣ Admin Configuration & Data Linking

### ⚙️ Admin Fields (Adjustable Parameters)

| Category | Field | Description / Use |
|----------|-------|------------------|
| Cognitive Engine | axis_weights_[N/S/T/F] | Base cognitive weighting for each function. |
| | shadow_factor | Strength of shadow influence on visible behavior. |
| | trigger_threshold | % threshold that defines when a trigger event pushes to Insights Feed. |
| | blindspot_decay_rate | Controls how quickly past blind spots fade with new data. |
| Fear Engine | fear_weight_[unworthiness/unlovability/powerlessness/unsafety] | Adjustable weighting per fear category. |
| | recency_decay | Time-based weighting decay for old activations. |
| | heat_map_gradient | Defines color thresholds (cool–neutral–hot). |
| Insights Engine | cluster_similarity_threshold | Controls how closely themes must match to group as same insight. |
| | mirror_moment_increment_trigger | Sets what action increments mirror counter (thumbs-up, AI match, or manual mark). |
| | dialogue_replay_sample_window | Number of reflections analyzed for recurring thought loop detection. |
| UI / Visual Settings | animation_speed_factor | Global multiplier for animation transitions. |
| | bar_display_limit | Default number of fears shown before "expand." |
| | theme_palette | Admin-selectable color scheme (light/dark mode variants). |

### 🔗 Data Linking / Mapping

| Source Engine | Target UI Element | Link Method |
|---------------|------------------|-------------|
| Cognitive Engine | Compass visual + data cards | JSON payload (dominant_axis, shadow_axis, trigger_index) |
| Fear Engine | Cube/Orbit + Heat Map + Fear Bars | Normalized data array (per-fear %) |
| Insights Engine | Feed Stream + Mirror Counter + Inner Dialogue Replay | Structured insight object (type, timestamp, summary, tags, pattern_id) |
| Reflection Engine ("What I Meant to Say") | All above | Acts as root input — sends emotional + cognitive metadata to each sub-engine. |

### ✅ Summary of System Flow
- User reflection → emotion + cognition tagged
- Cognitive Engine updates processing weights
- Fear Engine recalculates activations → updates visuals
- Insights Engine extracts patterns → updates feed + counters
- Admin dashboard allows real-time formula adjustments for testing and fine-tuning

Awesome — here's a clear, builder-ready Architecture & Data Flow Map for the Profile page engines, plus minimal schemas and example payloads so front- and back-end can meet cleanly.

## System Architecture Overview
```
[Client (App)]
   |  (1) user reflection / thumbs-up / scenario inputs
   v
[Gateway / BFF (API)]
   |---> Validation & Auth
   |---> Event Router (Kafka/SNS/SQS/etc.)
   v
[Event Bus: reflection.created, insight.liked, cron.tick, admin.config.updated]
   |            |                 |
   |            |                 |
   |            |                 +--> [Insights Engine]
   |            +--------------------> [Fear Engine]
   +----------------------------------> [Cognitive Engine]
                        |
                        +--> [Profile Aggregate Store] <---+
                                ^                           |
                                |                           |
                                +-------- [Admin Config] ---+
```

Front end queries a single Profile Aggregation API, which composes live outputs from engines + cached aggregates for snappy UI.

## High-Level Data Flow (Step-by-Step)
- **User Action → Event**
  - Actions: submits "What I Meant to Say," selects fears/meanings, gives a 👍 insight, edits text, etc.
  - Emitted events:
    - reflection.created
    - insight.liked
    - dialogue.note (optional manual note)
    - admin.config.updated (from admin panel)
    - cron.tick (hourly/daily, for decay & recompute)
- **Engines Consume & Update**
  - **Cognitive Engine**
    - Updates function weights, Trigger Probability Index, communication lens deltas.
  - **Fear Engine**
    - Recomputes per-fear activation with recency decay; refreshes heat map & top-3 bar list; updates cube/orbit coordinates.
  - **Insights Engine**
    - Clusters themes, generates "Insight cards," increments Mirror Moment Counter, updates Inner Dialogue Replay.
  - **Profile Aggregate Store**
    - Writes compact, denormalized snapshots per user:
      - cognitive_snapshot, fear_snapshot, insights_snapshot, metadata
      - Optimized for the profile page read.
- **Profile API → UI**
  - Client hits /profile/:userId → returns a single JSON with everything the profile page needs.

## Service Boundaries
- **Cognitive Engine**
  - Inputs: reflections (tags, sentiments, function hints), admin config
  - Outputs: dominant_streams, shadow_streams, processing_tendencies, blind_spots, trigger_probability_index, communication_lens
- **Fear Engine**
  - Inputs: per-reflection fear tags, timestamps; admin decay params
  - Outputs: normalized % per fear, heat map matrix, cube/orbit coordinates, top-3 fears
- **Insights Engine**
  - Inputs: reflections, user likes/acknowledgements, semantic embeddings
  - Outputs: feed items, theme clusters/tags, mirror moment count, inner dialogue replay (scripts + reframes)
- **Admin Config**
  - Stores tunables and formulas; versioned & audit-logged
  - Pushes config to engines on admin.config.updated

## Minimal Domain Schemas

### 1) Event: reflection.created
```json
{
  "event": "reflection.created",
  "ts": "2025-10-09T13:25:00Z",
  "user_id": "u_123",
  "payload": {
    "text": "I said yes but felt ignored.",
    "selected_meanings": ["I wanted to feel considered", "I needed clarity"],
    "selected_fears": ["unworthiness", "unsafety"],
    "context_tags": ["work", "feedback"],
    "sentiment": {"valence": -0.2, "arousal": 0.6},
    "beebe_hints": {"F":0.8,"N":0.7,"T":0.3,"S":0.2}, 
    "acknowledged": true
  }
}
```

### 2) Event: insight.liked
```json
{
  "event": "insight.liked",
  "ts": "2025-10-09T13:27:00Z",
  "user_id": "u_123",
  "payload": { "insight_id": "ins_987" }
}
```

### 3) Admin Config (versioned)
```json
{
  "config_id": "cfg_2025_10_09_01",
  "cognitive": {
    "axis_weights": {"N":1.0,"S":1.0,"T":1.0,"F":1.0},
    "shadow_factor": 0.35,
    "trigger_threshold": 0.22,
    "blindspot_decay_rate": 0.92
  },
  "fear": {
    "weights": {
      "unworthiness": 1.0,
      "unlovability": 1.0,
      "powerlessness": 1.0,
      "unsafety": 1.0
    },
    "recency_decay": {"half_life_days": 14},
    "heat_map_gradient": [0.15, 0.35, 0.6, 0.8]
  },
  "insights": {
    "cluster_similarity_threshold": 0.78,
    "mirror_moment_increment_trigger": "thumbs_up_or_ai_detected",
    "dialogue_replay_sample_window": 60
  },
  "ui": {
    "animation_speed_factor": 1.0,
    "bar_display_limit": 3,
    "theme_palette": "indigo_glass"
  }
}
```

## Engine Computation Notes

### Cognitive Engine
**Inputs**
- Beebe-aligned function hints (N/S/T/F) per reflection (explicit or inferred)
- Sentiment/emotion labels
- Fear activations (to compute cross-talk)
- Admin config

**Core Metrics**
- Dominant Streams: rolling weighted mean of (N, S, T, F)
- Shadow Streams: inverse weighting given recent conflict contexts
- Trigger Probability Index: TPI = shadow_conflicts_with_fear / total_reflections_window
  where shadow_conflicts_with_fear := count(reflection where dominant!=used and fear_active && arousal>threshold)
- Communication Lens:
  - incoming_confidence[axis] vs outgoing_confidence[axis] (derived from language formality, hedging, sentiment)
  - Lens delta drives the compass toggle view

**Output Snapshot**
```json
{
  "dominant_streams": ["Feeling","Intuition"],
  "shadow_streams": ["Thinking","Sensation"],
  "processing_tendencies": ["Seeks consensus before action","Reads between the lines"],
  "blind_spots": ["Overlooks hard data during harmony-keeping"],
  "trigger_probability_index": 0.29,
  "communication_lens": {
    "incoming": {"N":0.72,"S":0.28,"T":0.31,"F":0.81},
    "outgoing": {"N":0.65,"S":0.22,"T":0.25,"F":0.88}
  }
}
```

### Fear Engine
**Inputs**
- selected_fears per reflection
- Timestamps for recency decay
- Admin weights, recency_decay

**Computation**
Per fear: score_f = Σ (weight_f * recency_weight(ts_i))
normalized_percent = score_f / Σ(score_all)

- Heat map intensity = percentile of recent 7–14 day window
- Cube/Orbit coordinates mapped via normalized vector of [unworthiness, unlovability, powerlessness, unsafety]

**Output Snapshot**
```json
{
  "fears": [
    {"key":"unworthiness","pct":0.46},
    {"key":"unlovability","pct":0.31},
    {"key":"powerlessness","pct":0.15},
    {"key":"unsafety","pct":0.08}
  ],
  "heat_map": [[0.1,0.2,0.4,0.6],[0.2,0.25,0.5,0.7]], 
  "geometry": {
    "cube": {"x":0.46,"y":0.31,"z":0.15,"d":0.08},
    "orbit": [
      {"key":"unworthiness","radius":0.22},
      {"key":"unlovability","radius":0.28},
      {"key":"powerlessness","radius":0.55},
      {"key":"unsafety","radius":0.61}
    ]
  },
  "top3": ["unworthiness","unlovability","powerlessness"]
}
```

### Insights Engine
**Inputs**
- Reflections (text + tags)
- Insight likes (thumbs-up)
- Embeddings (for clustering)
- Admin thresholds

**Pipeline**
- Theme Clustering (semantic similarity ≥ cluster_similarity_threshold)
- Type Tagging → 💬 Communication, 🔥 Trigger, 🌱 Growth, 💡 Realization
- Mirror Moment Counter increments on like/AI-detected significant pattern
- Inner Dialogue Replay: top recurring n-grams/sequences → generate reframes using safe templates

**Output Snapshot**
```json
{
  "feed": [
    {
      "insight_id": "ins_987",
      "type": "trigger",
      "icon": "🔥",
      "title": "Rejection pattern surfaced",
      "snippet": "Feedback felt personal 3× this week.",
      "ts": "2025-10-09T13:28:00Z",
      "tags": ["work","feedback","unworthiness"]
    }
  ],
  "mirror_moments": 14,
  "inner_dialogue_replay": [
    {"script":"They don't care","reframe":"They might not understand yet"},
    {"script":"I always mess up","reframe":"I'm still learning — that's progress"},
    {"script":"If I say no, they'll leave","reframe":"Clear boundaries build real trust"}
  ]
}
```

## Profile Aggregation API
**GET /profile/:userId**
- Returns the stitched snapshot for the UI

**Response**
```json
{
  "user_id": "u_123",
  "cognitive_snapshot": { ...as above... },
  "fear_snapshot": { ...as above... },
  "insights_snapshot": { ...as above... },
  "metadata": {
    "generated_at": "2025-10-09T13:30:00Z",
    "config_version": "cfg_2025_10_09_01"
  }
}
```

## Front-End Component Contracts
- **Compass/Soundwave**
  - Props: incoming, outgoing, dominant_streams, shadow_streams, tpi
- **Fear Cube / Orbit**
  - Props: geometry, fears, heat_map, top3
- **Fear Bars**
  - Props: fears, limit=3
- **Insights Feed**
  - Props: feed, mirror_moments, inner_dialogue_replay

All visuals must gracefully degrade to list/text view for accessibility.

## Admin Console (Fields & Binding)
**Editable Fields (from your latest spec):**
- Cognitive: axis_weights_*, shadow_factor, trigger_threshold, blindspot_decay_rate
- Fear: fear_weight_*, recency_decay.half_life_days, heat_map_gradient[]
- Insights: cluster_similarity_threshold, mirror_moment_increment_trigger, dialogue_replay_sample_window
- UI: animation_speed_factor, bar_display_limit, theme_palette

**Binding Rules**
- On save, emit admin.config.updated with diff + full config.
- Engines hot-reload config (idempotent).
- Profile Aggregate Store stamps config_version into snapshots.

## Caching & Performance Notes
- Cold start: fetch last N reflections (e.g., 60) to recompute snapshots.
- Warm path: engines compute incrementally on each event; aggregate writes to KV store (e.g., Redis/KeyDB) for millisecond reads.
- Rebuild job: nightly cron to re-normalize with current decay parameters.

## Security & Privacy
- PII separated from analytical documents (user_id only in analytics stores).
- Right-to-delete workflow: purge reflections → purge embeddings → regenerate snapshots.
- Versioned admin configs with audit trail.

## User-Facing "i" Text 
**Cognitive Data Processing Map** This is how your brain probably filters reality. Everyone receives constant sensory, emotional, and logical data from our lives. We cannot handle it all simultaneously, so we prioritize and trust different types over others. Understanding your comfort zones helps you see where misunderstanding or miscommunication is most likely to occur — the birth point of many emotional "misfires."

**Fear / Wound Mapping** To help you visualize the fears that hijack your communication. Each fear arises when core desires (like love, safety, worth, or power) feel threatened.

**Inner Dialogue Replay** "This shows your repeating thought loops and how they change as you heal."

## 🪩 5️⃣ Shareable Insight Cards (Viral Sharing Layer)

### 💡 Purpose (System Logic)
Enable users to share meaningful "Oh Shit!" or insight moments as visually beautiful, anonymized cards. Each card pairs their AI-generated reflection or pattern insight with an aesthetic background and subtle branding, designed for instant export to stories, reels, or posts. Goal: create an emotional "me too" resonance moment that invites others to click, explore, or take the quiz.

### 🖥️ UI / UX Description
**Placement:**
- Accessible from the Living Insights Feed (each insight tile has a small "share" icon).
- Also accessible from the Profile Header → 'Share Your Mirror' button, which opens a carousel of auto-generated cards.

**Interaction Flow:**
- Tap "Share."
- Opens card preview carousel (horizontal scroll).
- Swipe through several template styles:
  - Minimal quote on gradient
  - Glow reflection overlay (AI summary + insight tag)
  - Split design: your realization vs. your old thought loop
  - Mood pulse style: animated gradient mirroring emotional tone
- Tap "Download" or "Share to…" → built-in share sheet (Instagram, Threads, TikTok, X, LinkedIn, etc.)
- Optional: toggle to include or hide username / type tag (e.g., "EFNJ Pattern: Harmony Overload")
- Each card auto-embeds short link: mirror.app/yourinsight?id=####

**Example Output Texts:**
- "The moment I realized I was saying yes just to stay safe."
- "Growth feels quiet when you stop chasing validation."
- "I don't need to earn being loved."
- "It wasn't rejection — it was just feedback I hadn't learned to trust yet."

**Optional visual metadata:**
- Icon or color accent for insight type (💬, 🔥, 🌱, 💡).
- Small logo watermark bottom-right ("My Inner Mirror").
- AI color-picks palette based on emotional tone from reflection (e.g., blue-green = calm integration, amber-red = fear insight, lavender-violet = realization).

### ⚙️ Functional / Engine Logic
**Inputs:**
- insight_id, type, snippet, theme_color, emotion_tone, user_preference_sharehandle
- Admin-set templates in JSON (fonts, gradient hex values, layout positions)

**Processing:**
- AI template engine populates card using selected insight and style.
- Applies theme color from emotion tone.
- Generates exportable PNG + MP4 (animated option).
- Saves card record to shared_cards table for analytics.

**Outputs:**
- Social-ready file(s).
- Trackable short URL for referral attribution.

**Admin Fields (add to existing config):**

| Category | Field | Description |
|----------|-------|-------------|
| Share Engine | card_templates[] | JSON array of layout definitions. |
| | brand_watermark_url | S3 path for logo overlay. |
| | share_link_base | Base URL for referral redirect. |
| | emotion_color_map | Mapping tone → gradient. |
| | max_share_previews | Number of styles to pre-render per insight. |

### 🔍 User-Facing Info Text 

**🔥 Emotional + Shareable**
- "Share your 'oh shit, that's me' moments."
- "Turn your aha-moment into a truth someone else feels too."
- "That realization? Someone else needs to see it."
- "Your insight could be someone's mirror."
- "Post the truth that hit you — it'll hit others too."

**💫 Reflective + Beautiful**
- "Make your realizations art — and let others see themselves in it."
- "Your moment of truth can wake up someone else's."
- "Share the beauty in what you just realized."
- "From realization to resonance — let your truth ripple."

**⚡ Snappy + Social-Friendly**
- "Your aha-moment deserves a share."
- "Post your truth — someone needs it."
- "One insight. One card. Infinite resonance."
- "Turn your light-bulb moment into a viral spark."

## 6️⃣ Viral Growth Design Layer (Optional / Expansion)

### 🧩 Purpose
Engineer organic virality through emotional resonance + social proof, not gimmicks. When users see friends sharing profound, self-revealing insights, they instinctively want to "see theirs."

### 🌱 Core Viral Mechanisms

| Mechanism | Description |
|-----------|-------------|
| Emotional Hook | Mirror Link Shares | Every shared card links to a dynamic preview page (mirror.app/insight?id=...) that invites the viewer: "See what your mirror might say about you." |
| Curiosity & identification | Pair Reflection Challenge | Users can invite a friend/partner to take a joint "What We Meant to Say" session. Generates a dual insight card comparing patterns. |
| Relational depth + playful vulnerability | Streak Stories | Weekly "Mirror Moments" summary auto-renders as story-style highlight (shareable as reel). |
| Visible growth proof | Public Insight Feed (optional toggle) | Anonymous global wall of insights ("Someone in your region just realized…"). Share-to-discover behavior loops. |
| Collective belonging | Type Identity Badges | Users can share lightweight "I'm an EFNJ — harmony first, meaning second" banners or dynamic emoji tags on socials. |
| Tribe signaling | Micro-Interaction Hooks | When a shared link is viewed, the landing page instantly invites to "See what your brain filters first" → mini-quiz → instant mirror preview (no login friction). |
| Instant engagement | AI-generated 'Year in Reflection' Reel | Auto-summarizes the user's top 5 insights + quotes with music — perfect for end-of-year sharing. |
| Narrative & nostalgia | Referral Gem / Secret Unlocks | Each new user who signs up through a shared card gives both users a "Mirror Gem" (unlocking premium templates or deeper insight analytics). |
| Reciprocity & reward | | |

### ⚙️ Implementation Notes
- Each shared asset must embed a unique short link for referral attribution (/r/:code).
- Maintain privacy: user can toggle whether name/type is visible.
- Share flow should never require export — can use web-rendered open graph previews for one-click posting.
- Analytics: track share count, view-to-signup ratio, referral chain depth.

### 💬 Tone & Brand Principles for Sharing
- Keep every share visually calm, luminous, reflective — not loud.
- The emotion of the share should feel "I learned something human today" not "Look at me."
- Always invite reflection: each post should subtly call others to self-explore.

Absolutely. Here's a drop-in addendum you can paste under Section 6 in your spec. It gives the AI precise directions + data contracts to program/create each viral option.

## 🔧 6.A — AI Implementation Directions for Viral Growth (Creation & Orchestration)
**Goal:** enable the AI to autonomously generate shareable assets, links, invites, reels, badges, and landing pages for all items in §6 — while honoring user privacy settings and providing clean hooks for growth analytics.

### 🔩 Global Contracts & Guardrails
**Events the AI must listen for**
- insight.created, insight.liked
- reflection.created, reflection.weekly_summary.ready
- share.requested (UI share tap)
- invite.sent, invite.accepted
- referral.attributed
- admin.config.updated

**Required services the AI must call**
- Short-link service: POST /shortlink {target_url, utm} → {code, url}
- Template renderer: POST /render/card|reel {template_id, payload} → {asset_urls[]}
- OG preview generator: POST /og/preview {title, subtitle, image} → {og_url}
- Notifications: POST /notify {user_id, channel, message, deeplink}
- Email/SMS (optional): POST /invite {to, from_user_id, deeplink}

**Privacy flags to respect**
- share_display_name: "full" | "type_only" | "anonymous"
- share_show_type: true/false
- share_allow_public_wall: true/false
- allow_referral_attribution: true/false

If a requested share conflicts with any flag, the AI must downgrade content (e.g., remove name, show type only, or anonymize entirely) and proceed.

**Admin config (new keys)**
```json
{
  "share": {
    "card_templates": ["minimal_quote_v1","split_then_now_v1","glow_pulse_v1"],
    "reel_templates": ["weekly_streak_v1","year_in_reflection_v1"],
    "og_brand_lockup": "s3://brand/lockup.png",
    "emotion_color_map": {"calm":"#9cc9ff","#...":"#..."},
    "max_share_previews": 6,
    "public_wall_moderation": {"enabled": true, "blocklist":["..."]}
  },
  "virality": {
    "referral_reward_type": "gem",
    "referral_thresholds": [1,3,5,10],
    "pair_challenge_timeout_hours": 72,
    "landing_quiz_variant_ratio": {"mini_quiz": 0.7, "full_onboarding": 0.3}
  }
}
```

### 6.1 Mirror Link Shares (per-insight share cards)
**AI trigger**
- On share.requested for an insight_id OR on insight.liked (if auto_suggest_share=true in user prefs).

**AI steps**
- Fetch payload: insight text/snippet, type, emotion tone, time, user privacy flags, optional type tag (e.g., EFNJ).
- Pick 3–6 templates: from share.card_templates, weighted by emotion tone → color map.
- Compose copy:
  - Headline: 3–7 words (present-tense, first-person).
  - Subhead: 8–16 words, reflective.
  - CTA footer (for OG only): "See yours →"
- Render assets: call /render/card per template with {headline, subhead, icon, gradient, watermark, privacy_display}.
- Create short link: /shortlink with target=/landing/insight?id=ins_###&ref=u_### and utm (source=profile_share, medium=social, campaign=insight_card).
- Return to UI: list of preview assets + share sheet metadata.

**Template payload (example)**
```json
{
  "template_id": "split_then_now_v1",
  "payload": {
    "icon": "🔥",
    "headline_now": "It wasn't rejection.",
    "headline_then": "I feared being unseen.",
    "subhead": "Feedback felt personal until I learned to trust my worth.",
    "accent_color": "#F5A28B",
    "watermark_url": "s3://brand/lockup.png",
    "privacy_display": {"name": null, "type": "EFNJ"},
    "deeplink": "https://mirror.app/r/abc123"
  }
}
```

### 6.2 Pair Reflection Challenge (duo invite & dual card)
**AI trigger**
- User taps "Invite to Pair Reflection" OR accepts an incoming invite.

**AI steps**
- Generate invite code + deep link /pair/start?code=XYZ.
- Send invite via Notifications/Email/SMS with soft copy ("Want to try a 5-minute mirror with me?").
- When both complete mini-session:
  - AI generates dual insight comparison (2–3 lines each) + shared theme tag.
  - Render dual card (split design) and optional coupled reel (15–20s).
  - Short link with ref attribution for both users.

**Dual card template payload**
```json
{
  "template_id": "pair_split_v1",
  "payload": {
    "left": {"label":"Me","type":"EFNJ","line":"I seek harmony first."},
    "right": {"label":"You","type":"ITSP","line":"I seek clarity first."},
    "theme":"We both avoid direct asks.",
    "cta":"Try your pair mirror →",
    "deeplink":"https://mirror.app/r/ab12cd"
  }
}
```

### 6.3 Streak Stories (weekly share)
**AI trigger**
- reflection.weekly_summary.ready (cron) OR user taps Share Weekly.

**AI steps**
- Compute Mirror Moments count, top 1–2 themes, most-shared insight.
- Compose 3–5 story frames (PNG) or a 12–15s reel:
  - Frame 1: Count ("14 mirror moments")
  - Frame 2: Top theme ("Reframing rejection")
  - Frame 3: Favorite insight (quote)
  - Frame 4: CTA frame with short link
- Render & return asset set + share sheet.

### 6.4 Public Insight Feed (anonymous global wall)
**AI trigger**
- On insight.liked if share_allow_public_wall=true and passes moderation.

**AI steps**
- Sanitize/anonymize: strip personal names/identifiers using NER.
- Score for display (novelty, clarity, resonance).
- If approved, post to public_wall with og_preview and short link.
- Provide "re-share to your story" action from the wall.

### 6.5 Type Identity Badges (lightweight share)
**AI trigger**
- User taps Share Type Badge in profile header.

**AI steps**
- Compose 2 badge lines:
  - Line 1: "EFNJ"
  - Line 2: a tiny, accurate vibe line (7–10 words): "Harmony first. Meaning always. Data after context."
- Render PNG in 1:1, 4:5, and 9:16.
- Short link to mini-quiz landing (see 6.6).

### 6.6 Landing Page → Preview Quiz Redirect
**Purpose**
When anyone opens a shared card, badge, or reel, send them seamlessly to the existing public landing page that already hosts the intake Quiz. The AI's role is routing and attribution only — not generating new quiz content.

**AI Trigger**
- A non-logged-in visitor opens any shared asset (shortlink click event).

**AI Steps**
- Resolve shortlink
- Look up referral metadata (origin user ID, campaign, template ID).
- Append these parameters to the destination URL.
- Redirect visitor
- Construct redirect: https://mirror.app/landing?ref={user_id}&src={campaign}&utm_source=social&utm_medium={asset_type}
- All visitors land on the existing marketing/quiz page (no new page creation).
- Pre-populate dynamic preview
- If available, include quick-view query params for smoother personalization: &preview_type={EFNJ}&emotion_tone={calm|fear|growth}
- The landing page reads these values to render the right intro palette and tone.
- Track engagement
- Fire link.clicked, landing.viewed, quiz.started, and signup.completed events with the same referral ID so the system can measure share→signup conversion.
- Hand off to normal onboarding flow
- Once the visitor completes the built-in quiz, normal user creation continues; referral credit awarded through referral.attributed.

**Admin Fields**

| Field | Description |
|-------|-------------|
| landing_quiz_url | Canonical URL of the existing preview quiz landing page. |
| referral_param_keys | Array of UTM/metadata params to append (ref, src, asset_type). |
| allow_preview_type_prefill | Boolean; controls whether the landing page may auto-select quiz theme/type. |
| default_preview_palette | Fallback color theme if no tone param present. |

**Implementation Notes**
- No new quiz logic lives in the share system; all content handled by the existing landing-page app.
- Caching: shortlink service should redirect in <100 ms for smooth user experience.
- A/B tests on the landing page itself (copy, CTA wording, etc.) remain independent from share flow.
- Privacy: no personally identifying info included in query params—only hashed referral ID.

### 6.7 Year-in-Reflection Reel (EOY share)
**AI trigger**
- December cron or user taps Make My Year Reel.

**AI steps**
- Summarize: top 5 insights, 3 growth moments, 1 reframe.
- Render 20–30s reel with soft music.
- Export MP4 + story cutdowns, plus OG preview.

### 6.8 Referral Gems / Secret Unlocks
**AI trigger**
- referral.attributed when a visitor signs up from a short link.

**AI steps**
- Increment both users' Gem count.
- When hitting thresholds (1,3,5,10): unlock
  - premium card templates,
  - deeper analytics, or
  - pair-session booster.
- Notify both users with celebratory copy + deep link to new unlock.

## 📊 Analytics & Attribution (all options)
The AI must attach UTM & meta to every link/event:
- utm_source=social
- utm_medium=share_card|reel|badge|pair
- utm_campaign=insight_v1|weekly_v1|year_v1|type_badge_v1
- utm_content=template_id
- ref=u_123

Tracked metrics per asset: impressions, clicks, signups, referrals, re-shares, chain depth.

## 🧠 Copy Generation Directives (for All Shares)
- Voice: reflective, humane, present-tense, zero blame.
- Length: Headline ≤ 7 words; Subhead ≤ 18 words.
- Safety: remove names/identifiers; no medical/diagnostic claims; no shame language.
- CTA: always soft ("See yours →", "Try your mirror →").
- Localization: respect user locale; render LTR/RTL accordingly.

**Prompt Skeleton the AI should use internally:**
```
SYSTEM: You are a reflective, safe copy engine for a psychology-forward app.
INPUT: {insight|weekly|pair|badge payload}
TASKS:
1) Draft headline (≤7 words), subhead (≤18).
2) Pick icon {💬|🔥|🌱|💡} from type.
3) Select palette from emotion_color_map.
4) Produce privacy-compliant text (no PII, no diagnosis).
OUTPUT: {headline, subhead, icon, palette, cta}
```

## 🧱 Moderation & Abuse Prevention
- Run all share text through PII scrub + toxicity filters.
- Enforce a blocklist from public_wall_moderation.blocklist.
- If flagged, show user a gentle reword suggestion before rendering.

## 🧪 QA Hooks
- Sandbox mode: render shares with a "SANDBOX" watermark.
- Snapshot test: ensure template render doesn't overflow text boxes.
- A/B bucket: template selection logged to experiment framework.
