## Directory Structure

```text
frontend/src/
  routes/
    Landing/
      index.tsx
    Intake/
      index.tsx
    Translator/
      index.tsx
    Profile/
      index.tsx
    Relational/
      index.tsx
    Admin/
      index.tsx
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
      components/ Compass.tsx, FearBars.tsx, InsightsFeed.tsx
      api/ profileClient.ts
    contacts/
      components/ Constellation.tsx, ContactDrawer.tsx
      api/ contactsClient.ts
    admin/
      pages/ AdminDashboard.tsx, ConfigEditor.tsx, Versions.tsx, Moderation.tsx
      api/ adminClient.ts
      components/ JsonEditor.tsx, DiffView.tsx, VersionList.tsx
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
    types.ts (DTOs aligning with OpenAPI)
  state/
    userSession.ts (Zustand; gating flags, recipient)
  analytics/
    tracker.ts (event emitters per taxonomy)
```


