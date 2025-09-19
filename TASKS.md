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

* [ ] Dropdown for Age Group (e.g. 7–10, 11–13, 14–17)
* [ ] Difficulty level (radio or select)
* [ ] Category multi-select (filtered by age group)
* [ ] "Start Practice" button (rename to something fun, e.g. **“Buzz Me In!”**)
* [ ] Link to **Random Practice (Gemini)** page

### 🧠 Logic

* [ ] Load categories from `data/categories.json`
* [ ] Filter category options based on selected age group
* [ ] Validate selections (age group is mandatory)
* [ ] Store selected criteria in localStorage or pass via query string

---

## 🐝 PHASE 3: Practice Page (`practice.html`)

### 🎨 UI Elements

* [ ] Word # counter (e.g. 1 of 10)
* [ ] Button: “🔊 Hear Word” – triggers Web Speech API
* [ ] Text field for user to enter spelling
* [ ] “Submit Spelling” button (disabled until input)
* [ ] Meaning + part of speech (shown **after** submission)
* [ ] Disable navigation/skipping until word is attempted

### 🧠 Logic

* [ ] Load words matching criteria from `/data/words/{category_slug}.json`
* [ ] Combine from multiple categories if more than one selected
* [ ] Randomly pick 10 words matching difficulty
* [ ] Use Web Speech API to speak the word
* [ ] Prevent skipping
* [ ] Validate spelling input, compare, and store results in memory
* [ ] Once all 10 are complete, store session summary to localStorage
* [ ] Redirect to `results.html` with session info

---

## 🧾 PHASE 4: Results Page (`results.html`)

### 🎨 UI Elements

* [ ] Show criteria used: Age Group, Difficulty, Categories
* [ ] Table: List of 10 words, user spelling, correct spelling, result (✔ / ❌)
* [ ] Score summary (e.g. 7/10 correct)
* [ ] Section: **Your Past Sessions**

  * [ ] Table or visual chart (use Tailwind + simple inline chart lib if needed)

### 🧠 Logic

* [ ] Load current session results from localStorage
* [ ] Append new result to historical data
* [ ] Aggregate past session stats (total sessions, avg. score, top categories, etc.)

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

* [ ] Use localStorage to persist:

  * Selected criteria
  * Current session answers
  * Historical results
* [ ] Create helper functions:

  * `loadWordsByCategory()`
  * `getRandomWordsFromSelection()`
  * `storeResultToLocalStorage()`
  * `getHistoricalStats()`

---

## 🎨 PHASE 7: Design & Styling (across all pages)

* [ ] Apply consistent background and playful theme
* [ ] Use Tailwind to:

  * Make it responsive
  * Add color (pastel / primary colors)
  * Add hover/focus styles to inputs and buttons
* [ ] Consider using:

  * Icons (audio, checkmark, cross, etc.)
  * Progress bar or visual for current question
* [ ] Ensure accessibility for younger users

---

## 📦 PHASE 8: Extras (Optional)

* [ ] Add "Try Again" or "Redo Session" button on Results page
* [ ] Add "See Meaning" after submission toggle
* [ ] Add sound effects (correct/wrong buzz)
* [ ] Easter eggs or motivational messages ("You're a spelling superstar! 🌟")

---
