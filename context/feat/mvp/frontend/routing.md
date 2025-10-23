## Routing & Guards

Routes
- `/` → Landing/Intro Translate (input-first)
- `/intake` → Quick Quiz (5–6 cards)
- `/translate` → WIMTS chooser + Translation tabs
- `/profile` → My Inner Mirror (snapshots + insights)
- `/relational` → Relationship Web (constellation + list)
- `/admin` → Admin Dashboard (role guard)
- `/share/wall` → Public wall (if enabled)
- `/pair` → Pair reflection entry

Guards
- Save/share/invite are gated: if not authenticated → show register dialog and redirect to auth; resume action post-auth.
- Admin routes require `role in ('admin','editor')` from session.

Navigation
- Use React Router with loader/actions kept minimal; TanStack Query handles data.


