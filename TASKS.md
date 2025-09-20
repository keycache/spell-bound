Name of the App is `Spell Bound`

---

## ✅ PHASE 1: Project Setup

### 🔧 1. Boilerplate

* [x] Initialize basic HTML/CSS/JS structure
* [x] Configure Tailwind CSS
* [x] Add favicon(favicon.ico) & playful background image(bg.webp) available in assets folder
* [x] Set consistent layout template (header, background, colors)

### 🗂 2. Folder Structure

Create folders for:

```
/data             -> category & words JSON files
/assets           -> background image, audio icons, etc.
/scripts          -> JS logic for each page
/styles           -> Custom Tailwind config or extra CSS if needed
/pages            -> HTML files (home.html, practice.html, results.html, random.html)
```

Status: [x] Created `/scripts`, `/styles`, `/pages` (data & assets already present)

---

## 🏡 PHASE 2: Home Page (`home.html`)

### 🎨 UI Elements

* [x] Dropdown for Age Group (dynamic from `data/categories.json`)
* [x] Difficulty select (values easy/medium/hard, capitalized on render)
* [x] Category multi-select filtered by selected age group
* [x] "Buzz Me In!" start button
* [x] Link to Random Practice page

### 🧠 Logic

* [x] Load categories from `data/categories.json`
* [x] Filter category options based on selected age group
* [x] Validate selections (age group mandatory)
* [x] Store selected criteria to localStorage

---

## 🐝 PHASE 3: Practice Page (`practice.html`)

### 🎨 UI Elements

* [x] Word # counter (e.g. 1 of 10)
* [x] Button: “🔊 Hear Word” – triggers Web Speech API
* [x] Text field for user to enter spelling
* [x] “Submit Spelling” button (disabled until input)
* [x] Meaning + part of speech (shown **after** submission)
* [x] Disable navigation/skipping until word is attempted
* [x] Added post-submission buttons: Reveal Meaning, 🔊 Meaning, 🔊 Part of Speech (enhancement)

### 🧠 Logic

* [x] Load words matching criteria from `/data/words/{category_slug}.json`
* [x] Combine from multiple categories if more than one selected
* [x] Randomly pick 10 words matching difficulty (fallback to all if insufficient)
* [x] Use Web Speech API to speak the word
* [x] Prevent skipping (next disabled until answer submitted)
* [x] Validate spelling input, compare, and store results in memory
* [x] Once all 10 are complete, store session summary to localStorage
* [x] Redirect to `results.html` with session info

---

## 🧾 PHASE 4: Results Page (`results.html`)

### 🎨 UI Elements

* [x] Show criteria used: Age Group, Difficulty, Categories
* [x] Table: List of 10 words, user spelling, correct spelling, result (✔ / ❌)
* [x] Score summary (e.g. 7/10 correct)
* [x] Section: **Your Past Sessions**

  * [x] Table or visual chart (table implemented; no chart library yet)

### 🧠 Logic

* [x] Load current session results from localStorage
* [x] Append new result to historical data (done in practice phase; consumed here)
* [x] Aggregate past session stats (total sessions, avg. score, top categories, etc.)

---

## 🎲 PHASE 5: Random Practice Page (`random.html`)

### 🎨 UI Elements

* [ ] Input: Gemini API Key
* [ ] Textarea: User instruction (e.g. “Give me 10 tricky words with silent letters for ages 11-13”)
* [ ] Button: “Get Random Words & Start Practice”

### 🧠 Logic

* [ ] On submit, call Gemini API using `fetch`
* [ ] Expect response in same structure as your word JSON
* [ ] Save 10 words to localStorage
* [ ] Redirect to `practice.html` (in Gemini mode)
* [ ] On practice page, detect Gemini mode and skip category filtering

---

## 💾 PHASE 6: Data Management

* [x] Use localStorage to persist:

  * Selected criteria
  * Current session answers
  * Historical results
* [x] Create helper functions:

  * `loadWordsByCategory()` (implemented in `data.js`)
  * `getRandomWordsFromSelection()` (implemented in `data.js`)
  * `storeResultToLocalStorage()` (implemented in `data.js`)
  * `getHistoricalStats()` (implemented in `data.js` and consumed in `results.js`)

---

## 🎨 PHASE 7: Design & Styling (across all pages)

* [x] Apply consistent background and playful theme (gradient header, bg image overlay)
* [x] Use Tailwind to:

  * Make it responsive (flex/grid adjustments, button stacking)
  * Add color (refined high-contrast primary gradient, secondary & outline variants)
  * Add hover/focus styles to inputs and buttons (custom :focus-visible ring)
* [x] Consider using:

  * Icons (audio present)
  * Progress bar or visual for current question (intentionally removed; counter only)
* [x] Ensure accessibility for younger users (aria-live feedback, labels, contrast, sr-only utilities)

---

## 📦 PHASE 8: Extras (Optional)

* [ ] Add "Try Again" or "Redo Session" button on Results page
* [x] Add "See Meaning" after submission toggle (implemented as Reveal Meaning button)
* [ ] Add sound effects (correct/wrong buzz)
* [ ] Easter eggs or motivational messages ("You're a spelling superstar! 🌟")

## PHASE 9: Mobile Custom Keyboard for Practice Page
* [x] Detect mobile screen width and conditionally show the custom keyboard
* [x] Prevent input field from triggering the native keyboard

  * Implemented using `readonly` + `tabindex="-1"` when keyboard active
* [x] Build on-screen QWERTY keyboard (rows: Q–P, A–L, Z–M)
* [x] Add buttons for:

  * Toggle case (A ↔ a) via a⇅ button with aria-pressed state
  * Backspace (←)
  * Clear (✖)
* [x] Bind keyboard buttons to update the input field (dispatches synthetic input events)
* [x] Ensure correct integration with existing input validation and submit flow (input listener reused)
* [x] Add basic accessibility labels for keys (ARIA labels + role=group for container)
* Notes: Keyboard hidden above sm breakpoint (>=640px) via CSS & resize listener; case toggle updates button text; controls styled with custom classes.

## PHASE 10: Reusable HTML Components (Header & Footer)
* [x] Create standalone HTML partials for shared components

  * `/components/header.html`
  * `/components/footer.html`
* [x] Build lightweight JS loader to fetch and inject components

  * `loadComponent(selector, url)` using `fetch` API (simplified to data-include attribute loop)
  * Called on `DOMContentLoaded` in `scripts/include.js`
* [x] Add wrapper containers in HTML pages

  * `<div data-include="/components/header.html"></div>` and `<div data-include="/components/footer.html"></div>`
* [x] Reference JS loader in all pages (added just above module scripts)
* [x] Update all pages to remove duplicated header/footer code
* [x] Ensure compatibility with Tailwind classes inside components
* [x] Test with local server to bypass CORS (`http-server`)
* Notes: Components load client-side; not visible in `view-source`, slight delay may occur. Fit for simple static reuse; consider build-time include later if SEO-critical.


---
