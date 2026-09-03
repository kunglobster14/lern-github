# My English Coach — Project Status

Current production recovery target: V31.

V31 replaces the previous layered Game Lab modal/event patches with a single Game Lab implementation using native HTML `<dialog>` and replaces layered AI routing patches with one authoritative AI core. The goals are: reliable modal close/touch behavior on mobile, no background touch-through while a game is open, reliable AI navigation and send flow, and a larger non-repetitive game set.

Do not re-enable the old `game-lab.js`, `game-lab-plus.js`, `game-flow.js`, `ai-route-core.js`, `mission-action-fix.js`, `ai-resilience.js`, `ui-safety.js`, `ui-smoke.js`, or `app-v27-stability.js` from `index.html` without a deliberate regression review.

The app remains $0-first and uses Groq free only for online AI, with Local Coach fallback.

Deployment retry: latest main including the account-sync performance hotfix.
Deployment retry: v53 210-day curriculum and level-aware learning system.
Deployment retry: v53 second retry requested by user.
Deployment retry: v54 continuous games and Sentence Coach flow.
Deployment retry: v54 user-requested retry after build-rate-limit.
Deployment retry: v55 full-screen Sentence Coach + interactive lesson experience + v56 expanded Oxford game pools.
Deployment retry: v55 + v56 user-requested retry after build-rate-limit (second attempt).
Deployment retry: v55 + v56 user-requested retry after build-rate-limit (third attempt).
Deployment retry: v59 + v60 curriculum variety, coherent Mini Response, and Oxford sentence-game pool fixes.
Deployment retry: v61 separate learner login/profile isolation.
