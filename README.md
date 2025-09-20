Spell Bound
===========

Overview
--------
Browser-based spelling practice tool. Static site. No backend. Uses Web Speech API for pronunciation.

Implemented Features
--------------------
- Criteria selection (age group, difficulty, categories) with validation.
- Auto category fallback when none selected (age-scoped expansion).
- Random word sampling with difficulty filter and fallback pool.
- Quiz flow: speak word, user input, correctness feedback.
- Submit button doubles as Next / See Results.
- Accessible feedback (aria-live, status text, focus management).
- LocalStorage persistence: criteria, current session, history.
- Results view with aggregate stats (sessions, accuracy, top categories).
- Mobile custom on-screen keyboard (viewport breakpoint, readonly native suppression).
- Speech synthesis for word, meaning, part of speech.
- Defensive category reconstruction in practice if legacy criteria empty.
- Tailwind-based component styling.

Pending / Not Implemented Yet
-----------------------------
- Gemini (AI) mode integration (Phase 5).
- Optional enhancements: redo session action, sound effects, motivational messages.
- Cleanup removal of deprecated hidden next button element (minor DOM artifact).

Tech Stack
----------
- HTML5, Vanilla ES Modules.
- Tailwind CSS (configured via `tailwind.config.js`).
- Web Speech API (speechSynthesis).
- LocalStorage for state.

Data
----
- `data/categories.json`: category objects `{ category, category_slug, age_group, description }`.
- `data/words/*.json`: arrays of word objects `{ word, meaning?, part_of_speech?, level }`.
- Normalization fills defaults and unifies property names.

Key Scripts
-----------
- `scripts/common.js`: storage keys, JSON helpers, constants (`QUIZ_WORD_COUNT`).
- `scripts/data.js`: loading, normalization, shuffling, selection, stats, session store.
- `scripts/home.js`: criteria UI, age validation, auto category fallback.
- `scripts/practice.js`: quiz control flow, speech, submission logic, mobile keyboard, defensive fallback.
- `scripts/results.js`: history render and stats.

State Persistence
-----------------
- `CRITERIA`: latest chosen criteria object.
- `CURRENT_SESSION`: last completed session with attempts.
- `HISTORY`: array of session summaries.

Build / Run
-----------
- Static hosting compatible (GitHub Pages, Netlify, etc.).
- Tailwind build expected (check `package.json` scripts if present). If not building, existing `styles/tailwind.css` can be served directly.
- Open `index.html` (redirect) or `pages/home.html` directly.

Selection Logic
---------------
- Filter by difficulty unless difficulty == any.
- Fallback to full pool if filtered set smaller than quiz count.
- Shuffle then slice to `QUIZ_WORD_COUNT`.

Accessibility
-------------
- aria-live regions for feedback.
- Proper button roles and labels.
- Readonly input with custom keyboard on small screens prevents unwanted mobile keyboard overlap.

Roadmap
-------
- Implement Gemini mode (dynamic word generation / enrichment).
- Add redo session and inline per-word meaning reveal toggle.
- Improve category selection UX (multi-select clarity, maybe tag UI).
- Add automated tests (Jest + jsdom) for selection and stats.
- Add service worker for offline caching.
