# Project status — My English Coach

## Ready
- Mobile-first V3 UI
- Vocabulary learning + Thai pronunciation hints
- Quiz + XP + weak-word review
- Speech synthesis (English voice)
- Microphone speech recognition where browser supports it
- AI Coach UI with coffee, travel, work, and daily-life scenarios
- AI backend uses Groq Free Plan only; no paid-provider fallback
- Current Groq model order: `qwen/qwen3.6-27b` → `openai/gpt-oss-20b` → Local Coach
- Offline/local fallback coach when the Groq Free Plan is unavailable or rate-limited
- FREE MODE status badge (online free-plan AI vs Local Coach)
- Multiple learner profiles on the same device
- Export/import JSON backup for all local learner profiles
- PWA install controls, manifest, app icon, and service worker
- Offline caching of app shell and local-first assets
- Groq serverless endpoint in `api/ai.js`
- Neon V2 schema prepared for 5–10 learners
- User accounts, sessions, progress, spaced review, quiz history, study sessions, and AI conversation tables are defined
- Vercel Hobby project `my-english-coach-free` created through the web UI
- GitHub → Vercel auto-deploy tested end-to-end
- Production domain confirmed
- `GROQ_API_KEY` added as a Production Secret in Vercel; this commit intentionally triggers a fresh production deployment so the new secret is available at runtime

## Current zero-cost behavior
Learner progress is stored locally in the browser/device. Each device can hold multiple learner profiles and export a backup file. This keeps the app usable at $0 even before the shared database is connected.

## Zero-cost policy
- Hosting: Vercel Hobby only
- AI: Groq Free Plan only; if the free-plan quota is unavailable, fall back to Local Coach
- Speech: browser/device speech APIs
- Storage: avoid cloud file storage unless required
- No auto top-up and no paid fallback paths

## External connector blockers
- Neon connector exposes camelCase parameters to ChatGPT while its backend currently expects snake_case. Even `describe_project` is rejected before reaching Neon, so schema execution remains blocked by the connector layer.
- Vercel project exists and deployments succeed, but the Vercel read connector has been inconsistent for the new project. GitHub deployment status remains a reliable verification path.
- GitHub Pages automatic deployment is disabled because the linked GitHub integration cannot enable Pages for the repository.

## Next implementation steps
1. Verify AI Coach after the production redeploy that includes `GROQ_API_KEY`.
2. Apply `database/schema.sql` to Neon as soon as the connector parameter bug is resolved.
3. Add secure login/sessions only after the shared database path is working.
4. Replace local progress with Neon sync while keeping local/offline fallback.
5. Expand beginner lessons, vocabulary, sentence patterns, and quizzes.
6. Test with 5–10 learner profiles/devices and keep all paths within free quotas.
