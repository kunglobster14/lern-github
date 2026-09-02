# Project status — My English Coach

## Ready
- Mobile-first V2 UI
- Vocabulary learning + Thai pronunciation hints
- Quiz + XP + weak-word review
- Speech synthesis (English voice)
- Microphone speech recognition where browser supports it
- AI Coach UI with coffee, travel, work, and daily-life scenarios
- Offline/local fallback coach
- PWA manifest + app icon + service worker
- Vercel AI Gateway serverless endpoint in `api/ai.js`
- Vercel AI SDK dependency configured
- Neon V2 schema prepared for 5–10 learners
- User accounts, sessions, progress, spaced review, quiz history, study sessions, and AI conversation tables are defined

## Current temporary behavior
Learner progress is stored in browser `localStorage` until the Neon write connector issue is resolved.

## External connector blockers
- Neon connector exposes camelCase parameters to ChatGPT but the backend currently expects snake_case, so schema execution is blocked before SQL reaches PostgreSQL.
- Vercel deploy connector returns a deployment ID, but the deployment/project is not visible to the read API afterward. The existing Vercel account connection itself is healthy.

## Next implementation steps
1. Create/confirm a real hosting project on Vercel through the web integration.
2. Verify `/api/ai` with Vercel AI Gateway OIDC.
3. Apply `database/schema.sql` to Neon.
4. Add secure username/password login API and sessions.
5. Replace localStorage progress with Neon-backed progress.
6. Seed beginner lessons, vocabulary, sentence patterns, and quizzes.
7. Test with 5–10 learner accounts on mobile.
