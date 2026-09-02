# Project status — My English Coach

## Ready
- Mobile-first V3 UI
- Vocabulary learning + Thai pronunciation hints
- Quiz + XP + weak-word review
- Speech synthesis (English voice)
- Microphone speech recognition where browser supports it
- AI Coach UI with coffee, travel, work, and daily-life scenarios
- AI backend uses `inclusionai/ling-3.0-flash-free` first, then `poolside/laguna-s-2.1-free`; no paid fallback
- Offline/local fallback coach when all free online AI models are unavailable
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
- GitHub → Vercel auto-deploy tested end-to-end: a new commit reached pending and then success automatically
- Production deployment URL supplied and confirmed by the project owner

## Current zero-cost behavior
Learner progress is stored locally in the browser/device. Each device can hold multiple learner profiles and export a backup file. This keeps the app usable at $0 even before the shared database is connected.

## Zero-cost policy
- Hosting: Vercel Hobby only
- AI: models explicitly priced at $0 only
- Free remote model order: Ling 3.0 Flash Free → Laguna S 2.1 Free → Local Coach
- If free AI is unavailable: fall back to Local Coach instead of a paid model
- Speech: browser/device speech APIs
- Storage: avoid cloud file storage unless required
- No auto top-up and no paid fallback paths

## External connector blockers
- Neon connector exposes camelCase parameters to ChatGPT while its backend currently expects snake_case. Even `describe_project` is rejected before reaching Neon, so schema execution remains blocked by the connector layer.
- Vercel project exists and deployments succeed, but the Vercel read connector still does not list the new project consistently. GitHub deployment status is currently the reliable verification path.
- The execution environment used by ChatGPT could not resolve the newly created `vercel.app` hostname directly, so browser-level HTTP verification must be done from the user's browser until connector/DNS visibility catches up.
- GitHub Pages automatic deployment is disabled because the linked GitHub integration cannot enable Pages for the repository. The workflow remains available for manual use after Pages is enabled.

## Next implementation steps
1. Verify AI Coach behavior once from the public site in the user's browser; runtime errors can then be fixed from logs/source.
2. Apply `database/schema.sql` to Neon as soon as the connector parameter bug is resolved.
3. Add secure login/sessions only after the shared database path is working.
4. Replace local progress with Neon sync while keeping local/offline fallback.
5. Expand beginner lessons, vocabulary, sentence patterns, and quizzes.
6. Test with 5–10 learner profiles/devices and keep all paths within free quotas.
