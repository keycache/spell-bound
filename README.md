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


Local Run
-----------
- Open a terminal and build the `tailwind.css` file with `npm run dev` from the project's root folder
- Tailwind build expected (check `package.json` scripts if present). If not building, existing `styles/tailwind.css` can be served directly.
- Open another terminal to run the server from project's root folder using `npx http-server -p 5173 .` Open `http://127.0.0.1:5173/index.html`

Roadmap
-------
- Implement Gemini mode (dynamic word generation / enrichment).
- Add redo session and inline per-word meaning reveal toggle.
- Improve category selection UX (multi-select clarity, maybe tag UI).
- Add automated tests (Jest + jsdom) for selection and stats.
- Add service worker for offline caching.
