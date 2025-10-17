## State Strategy

Server state
- Use TanStack Query for all API calls defined in OpenAPI; one client per feature in `features/*/api`.
- Keys: `['intake','session',id]`, `['wimts',sessionId]`, `['translate',{mode,base}]`, `['profile',userId]`, `['contacts']`, `['insights','weekly']`.

App/UI state
- Use a small Zustand store: auth gating flags, current recipient, UI toggles (advanced 8 on/off), admin draft value.

Optimistic flows
- On `wimts.select`, update a local `chosenOptionId`; translations query invalidates.
- On contact sliders update, optimistic patch the local contact cache and refetch in background.


