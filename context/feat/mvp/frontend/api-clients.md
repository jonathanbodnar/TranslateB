## API Clients (per feature)

Each client wraps fetch with Query hooks and aligns with OpenAPI.

Intake
```ts
export function useStartSession() { /* POST /api/intake/session.start */ }
export function useQuestions(sessionId: string) { /* GET /api/intake/questions */ }
export function useAnswer() { /* POST /api/intake/answer */ }
export function useComplete() { /* POST /api/intake/complete */ }
```

WIMTS
```ts
export function useWimtsGenerate() { /* POST /api/wimts/generate */ }
export function useWimtsSelect() { /* POST /api/wimts/select */ }
```

Translator
```ts
export function useTranslateGenerate() { /* POST /api/translate/generate */ }
```

Reflections
```ts
export function useCreateReflection() { /* POST /api/reflections */ }
```

Profile
```ts
export function useProfile(userId: string) { /* GET /api/profile/:userId */ }
```

Contacts
```ts
export function useCreateContact() { /* POST /api/contacts */ }
export function useContacts() { /* GET /api/contacts */ }
export function useContact(id: string) { /* GET /api/contacts/:id */ }
export function useUpdateSliders() { /* POST /api/contacts/:id/sliders */ }
```

Insights & Share
```ts
export function useLikeInsight() { /* POST /api/insights/like */ }
export function useWeeklySummary() { /* GET /api/insights/weekly */ }
export function useShareCard() { /* POST /api/share/card */ }
export function useShortlink() { /* POST /api/shortlink */ }
export function usePublicWall() { /* GET /api/public/wall */ }
```

Admin
```ts
export function useAdminConfig() { /* GET /api/admin/config */ }
export function useSaveAdminConfig() { /* PUT /api/admin/config */ }
export function usePublishAdminConfig() { /* POST /api/admin/config/publish */ }
export function useAdminVersions() { /* GET /api/admin/versions */ }
export function useAdminVersion(id: string) { /* GET /api/admin/versions/{config_id} */ }
export function useModerationDecision() { /* POST /api/admin/moderation/decision */ }
```


