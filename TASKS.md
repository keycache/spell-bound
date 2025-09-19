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

* [ ] Apply consistent background and playful theme
* [ ] Use Tailwind to:

  * Make it responsive
  * Add color (pastel / primary colors)
  * Add hover/focus styles to inputs and buttons
* [ ] Consider using:

  * Icons (audio, checkmark, cross, etc.)
  * Progress bar or visual for current question (Removed intentionally after iteration – using simple counter only)
* [ ] Ensure accessibility for younger users

---

## 📦 PHASE 8: Extras (Optional)

* [ ] Add "Try Again" or "Redo Session" button on Results page
* [x] Add "See Meaning" after submission toggle (implemented as Reveal Meaning button)
* [ ] Add sound effects (correct/wrong buzz)
* [ ] Easter eggs or motivational messages ("You're a spelling superstar! 🌟")

---
