# Project status — My English Coach

## Ready
- Mobile-first V3 UI
- Vocabulary learning + Thai pronunciation hints
- Quiz + XP + weak-word review
- Speech synthesis (English voice)
- Microphone speech recognition where browser supports it
- AI Coach UI with coffee, travel, work, and daily-life scenarios
- AI backend locked to `poolside/laguna-s-2.1-free` only; no paid fallback
- Offline/local fallback coach when online AI is unavailable
- FREE MODE status badge (online free AI vs Local Coach)
- Multiple learner profiles on the same device
- Export/import JSON backup for all local learner profiles
- PWA install controls, manifest, app icon, and service worker
- Offline caching of V3 app shell and local-first assets
- Vercel AI Gateway serverless endpoint in `api/ai.js`
- Vercel AI SDK dependency configured
- Neon V2 schema prepared for 5–10 learners
- User accounts, sessions, progress, spaced review, quiz history, study sessions, and AI conversation tables are defined
- Vercel Hobby project `my-english-coach-free` created through the web UI
- GitHub → Vercel deployment status confirmed successful

## Current zero-cost behavior
Learner progress is stored locally in the browser/device. Each device can hold multiple learner profiles and export a backup file. This keeps the app usable at $0 even before the shared database is connected.

## Zero-cost policy
- Hosting: Vercel Hobby only
- AI: models explicitly priced at $0 only
- If free AI is unavailable: fall back to Local Coach instead of a paid model
- Speech: browser/device speech APIs
- Storage: avoid cloud file storage for V1/V3 unless required
- No auto top-up and no paid fallback paths

## External connector blockers
- Neon connector exposes camelCase parameters to ChatGPT while its backend currently expects snake_case, so even read/write database calls are rejected before SQL reaches PostgreSQL.
- Vercel project exists and deployment succeeds, but the Vercel read connector still does not list the new project immediately. GitHub deployment status is currently the reliable verification path.
- GitHub Pages automatic deployment is disabled because the linked GitHub integration cannot enable Pages for the repository. The workflow remains available for manual use after Pages is enabled.

## Next implementation steps
1. Verify the public app URL and `/api/ai` free-model behavior on desktop and mobile.
2. Apply `database/schema.sql` to Neon as soon as the connector parameter bug is resolved.
3. Add secure login/sessions only after the shared database path is working.
4. Replace local progress with Neon sync while keeping local/offline fallback.
5. Expand beginner lessons, vocabulary, sentence patterns, and quizzes.
6. Test with 5–10 learner profiles/devices and keep all paths within free quotas.
