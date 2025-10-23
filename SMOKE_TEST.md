# MVP Smoke Test

1. Landing
- Open app; verify background waves render
- Check analytics network call to /api/analytics (optional)

2. Input-first
- Click Get Started, enter message, submit
- Confirm navigates to /quiz with session_id in URL

3. Quiz
- Swipe through all cards; answers post to /api/intake/answer
- On completion, result rendered and navigable to WIMTS

4. WIMTS
- Options load from /api/wimts/generate
- Select option; navigates to /translate with base text

5. Translate
- Translations load from /api/translate/generate (4 tabs)
- Switch tabs; text updates; analytics events sent
- Click Save:
  - If logged-in: POST /api/reflections returns reflection_id
  - If guest: RegistrationGate appears

6. Auth (optional)
- Trigger Google/Apple; confirm session created in Supabase
- Retry Save succeeds

7. Profile
- Visit /profile; confirm profile fetches by your Supabase userId

8. Relational Web
- Visit /relationships; constellation renders; node tap opens details

9. Admin (requires role)
- Visit /admin; config versions load; publish button permitted for admin/editor

10. Rate Limiting
- Rapidly hit session.start or generate; confirm 429 after threshold

11. Errors
- Disable network; verify friendly error states and no crashes

