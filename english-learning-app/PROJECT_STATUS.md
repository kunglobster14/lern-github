# My English Coach — Project Status

Current production recovery target: V31.

V31 replaces the previous layered Game Lab modal/event patches with a single Game Lab implementation using native HTML `<dialog>` and replaces layered AI routing patches with one authoritative AI core. The goals are: reliable modal close/touch behavior on mobile, no background touch-through while a game is open, reliable AI navigation and send flow, and a larger non-repetitive game set.

Do not re-enable the old `game-lab.js`, `game-lab-plus.js`, `game-flow.js`, `ai-route-core.js`, `mission-action-fix.js`, `ai-resilience.js`, `ui-safety.js`, `ui-smoke.js`, or `app-v27-stability.js` from `index.html` without a deliberate regression review.

The app remains $0-first and uses Groq free only for online AI, with Local Coach fallback.
