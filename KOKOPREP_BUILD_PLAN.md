# KokoPrep — Master Build Plan for Claude Code

> **Hand this document to Claude in VS Code at the start of each session.**
> Work through phases in order. Do not skip ahead. Each phase ends with a named checkpoint — test on your phone before proceeding.

---

## Project Overview

A SvelteKit quiz app for a 10-year-old revising for the Nigerian Common Entrance Examination (JSS1 entry). Single-page, mobile-first, deployed to Cloudflare Pages. Personal use only.

**Primary colour:** `#ff0094`  
**Viewport:** Constrained to 480px max-width on desktop. Mobile-first throughout.  
**Framework:** SvelteKit with `@sveltejs/adapter-static`  
**Styling:** Tailwind CSS  
**Persistence:** Browser `localStorage` only — no backend, no auth  
**Character:** "Koko" — placeholder SVG/emoji for now, replaced later by owner

---

## Folder Structure (final target)

```
kokoprep/
├── src/
│   ├── lib/
│   │   ├── data/
│   │   │   └── questions.json          ← seed question bank (provided)
│   │   ├── stores/
│   │   │   └── quiz.js                 ← all app state (Svelte stores)
│   │   ├── utils/
│   │   │   └── quiz.js                 ← helpers: shuffle, filter, score
│   │   └── components/
│   │       ├── KokoAvatar.svelte       ← placeholder character
│   │       ├── ProgressBar.svelte      ← icon-row progress tracker
│   │       ├── QuestionCard.svelte     ← question + options
│   │       ├── ExplanationPane.svelte  ← Brain Gym feedback panel
│   │       ├── Timer.svelte            ← Beat the Clock countdown
│   │       └── ResultsAccordion.svelte ← Beat the Clock end review
│   ├── routes/
│   │   └── +page.svelte               ← single route, screen managed by store
│   └── app.css                        ← global styles + CSS vars
├── static/
│   └── favicon.png
├── questions.json                      ← ALSO place here for easy updates
├── svelte.config.js
├── tailwind.config.js
└── package.json
```

---

## Category System

| Category key | Display name | Colour |
|---|---|---|
| `mathematics` | Mathematics | `#2563eb` (blue) |
| `english` | English Language | `#7c3aed` (purple) |
| `science` | Basic Science & Technology | `#0d9488` (teal) |
| `social` | Social Studies & Civics | `#ea580c` (orange) |
| `crs` | Christian Religious Studies | `#d97706` (amber) |
| `agriculture` | Agricultural & Computer Studies | `#16a34a` (green) |
| `mix` | Mix It Up! | gradient `#ff0094 → #7c3aed` |

---

## Question JSON Schema

Every question in `questions.json` must match this shape exactly:

```json
{
  "id": "math_001",
  "category": "mathematics",
  "question": "The Roman numerals CCCXCVI represent the number:",
  "options": ["394", "396", "314", "315"],
  "correctIndex": 1,
  "explanation": "CCC = 300, XC = 90, VI = 6. Total = 396.",
  "extraKokoFact": "Roman numerals have no symbol for zero!"
}
```

- `id`: unique string, format `subject_NNN`
- `category`: one of the keys in the category table above
- `options`: always 4 strings (A–D)
- `correctIndex`: zero-based index into options array (0=A, 1=B, 2=C, 3=D)
- `explanation`: always present, shown in Brain Gym mode
- `extraKokoFact`: string or `null`. If non-null, shown as a "Koko Knowledge" bonus card in Brain Gym

---

## App State Model

All state lives in `src/lib/stores/quiz.js` as Svelte writable stores.

```js
// Session config (set on Dashboard)
mode: 'braingym' | 'beattheclock'
category: 'mathematics' | 'english' | 'science' | 'social' | 'crs' | 'agriculture' | 'mix'
questionCount: 5 | 10                     // Brain Gym only
timerMinutes: 5 | 10 | 15                 // Beat the Clock only

// Active test
screen: 'dashboard' | 'test' | 'results'
questions: Question[]                      // shuffled slice for this session
currentIndex: number
answers: (number | null)[]                // user's selected option index per question
startTime: Date
timeRemaining: number                      // seconds, Beat the Clock only
timerActive: boolean

// Persistence (read/write localStorage)
testHistory: HistoryEntry[]
missedQuestionIds: string[]
```

**localStorage keys:** `koko_history`, `koko_missed`

---

## Screen Specifications

### Screen 1: Dashboard

**Layout (top to bottom):**
1. App title "KokoPrep" in primary pink, large, bold, centred. Koko avatar placeholder below it.
2. **Mode toggle** — two large buttons side by side: "🧠 Brain Gym" and "⏱ Beat the Clock". Selected state uses category colour fill; unselected is outlined.
3. **Category selector** — 6 subject tiles in a 2×3 grid, plus a full-width "Mix It Up 🎲" tile below. Each tile shows subject name and uses the category colour. Tapping selects it (bold border + slight scale).
4. **Mode options** (appears below category grid, conditional):
   - Brain Gym: toggle row labelled "Questions:" with two pill buttons — "5" and "10"
   - Beat the Clock: toggle row labelled "Time:" with three pill buttons — "5 min", "10 min", "15 min"
5. **GO button** — full width, primary pink `#ff0094`, white text, bold, large. Disabled (grey) until both mode and category are selected.
6. **Past Achievements** section — card below GO button with title "🏆 Past Kocos". Lists last 10 test history entries from localStorage. Each entry shows: date, subject, mode, score (e.g. "8/10" or "72%"), and a small "↩ Try Again" button. If localStorage is empty, show encouraging placeholder text.

---

### Screen 2: Active Test Room

**Header bar:**
- Left: Category name with a small colour dot
- Centre: "Question X of Y" (Brain Gym) or nothing (Beat the Clock shows question number in card)
- Right (Beat the Clock only): Timer display `MM:SS` — normal colour until under 60 seconds, then red and bold

**Progress tracker (below header):**
- A horizontal row of small Koko avatar icons (one per question in session)
- States: neutral (grey silhouette), correct (green tint), incorrect (red tint)
- In Beat the Clock mode, state updates only after user taps Next — not immediately on answer selection
- Cap at 10 icons maximum. If session has more than 10 questions, use a numeric progress bar instead (`[=====>    ] 6/15`)

**Question card (main area):**
- Question number badge top-left of card
- Question text, readable size (min 16px), comfortable line height
- 4 option buttons stacked vertically, labelled A/B/C/D
- Options are white cards with coloured left border in category colour
- On selection:
  - **Brain Gym:** immediately colour selected option green (correct) or red (incorrect). Lock all options. Show explanation pane below. Show "Next Question →" button.
  - **Beat the Clock:** highlight selected option in category colour. Show "Next →" button. No correct/incorrect revealed yet.

**Explanation pane (Brain Gym only, appears after answering):**
- Background: light tint of category colour
- Shows full explanation text
- If `extraKokoFact` is non-null, show a second "⭐ Koko Knows!" card in primary pink below the explanation
- "Next Question →" button at bottom. On last question, button says "See Results 🎉"

**Beat the Clock timer logic:**
- Timer counts down from selected minutes × 60 in seconds
- `setInterval` every 1000ms, stored in the store, cleared on unmount
- When timer hits 0: immediately save current question as unanswered (null) and navigate to Screen 3
- Question order is randomised per session

---

### Screen 3: Results

**Score display:**
- Large Koko avatar (placeholder)
- Celebratory message based on score percentage:
  - ≥ 90%: "🎉 Amazing! You're a Koko Champion!"
  - ≥ 70%: "🌟 Great work! Keep it up!"
  - ≥ 50%: "👍 Good effort! Review the ones you missed."
  - < 50%: "💪 Don't give up! Try again!"
- Score shown as fraction (e.g. `8 / 10`) in large text, and as percentage below
- Category and mode shown as small badge labels

**Performance review:**
- **Brain Gym:** simple list — correct questions shown with a green tick, incorrect with a red cross and the correct answer shown. No accordion needed.
- **Beat the Clock:** full accordion list of all questions in the session. Each item header shows question number, short question preview, and green/red status indicator. Expanding shows:
  - The full question text
  - User's selected answer (highlighted red if wrong)
  - The correct answer (highlighted green)
  - Full explanation text

**Missed questions update:**
After results are calculated, update `missedQuestionIds` in localStorage:
- Add IDs of questions answered incorrectly in this session
- Remove IDs of questions answered correctly in this session (if they were previously missed)
- Cap the missed list at 50 IDs

**Save to history:**
Save a `HistoryEntry` to `koko_history` in localStorage:
```js
{
  date: new Date().toISOString(),
  category: 'mathematics',
  mode: 'braingym',
  score: 8,
  total: 10,
  percentage: 80
}
```
Cap history at 50 entries.

**Action buttons:**
- "🔁 New Koko" — resets all session state, returns to Dashboard
- "📚 Review Missed Questions" — if `missedQuestionIds` has entries, starts a Brain Gym session immediately using only those questions (up to 10). Category badge shows "Missed Questions" in primary pink.

---

## Question Selection Logic (`src/lib/utils/quiz.js`)

```js
function getSessionQuestions(allQuestions, category, mode, count, missedIds) {
  // 1. Filter by category (or all if 'mix')
  let pool = category === 'mix' 
    ? allQuestions 
    : allQuestions.filter(q => q.category === category)
  
  // 2. Inject missed questions: if any missed IDs exist in the pool,
  //    ensure at least 20% of session questions are missed ones (minimum 1)
  const missed = pool.filter(q => missedIds.includes(q.id))
  const notMissed = pool.filter(q => !missedIds.includes(q.id))
  
  // 3. Shuffle both arrays
  shuffle(missed)
  shuffle(notMissed)
  
  // 4. For Brain Gym: take `count` questions
  //    For Beat the Clock: take up to 40 questions (timer will end the session)
  const target = mode === 'braingym' ? count : 40
  const missedSlots = Math.max(1, Math.floor(target * 0.2))
  const missedToUse = missed.slice(0, Math.min(missedSlots, missed.length))
  const freshToUse = notMissed.slice(0, target - missedToUse.length)
  
  return shuffle([...missedToUse, ...freshToUse])
}

function shuffle(arr) {
  // Fisher-Yates shuffle — mutates and returns arr
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
```

Also shuffle the `options` array on load? **No** — do not shuffle options. The `correctIndex` is fixed. Shuffling options would break the index. Keep options in the order stored in JSON.

---

## Visual Design Tokens

Define these in `app.css` as CSS custom properties:

```css
:root {
  --color-primary: #ff0094;
  --color-primary-light: #ff66c4;
  --color-bg: #fafafa;
  --color-card: #ffffff;
  --color-text: #1a1a2e;
  --color-muted: #6b7280;
  --color-correct: #16a34a;
  --color-incorrect: #dc2626;
  --radius-card: 16px;
  --radius-btn: 12px;
  --shadow-card: 0 4px 20px rgba(0,0,0,0.08);
  --max-width: 480px;
  --font-main: 'Nunito', sans-serif;
}
```

Load Nunito from Google Fonts (kid-friendly, round letterforms).

The category colour is applied dynamically. In the Svelte store, expose a `categoryColor` derived store that returns the hex value for the active category. Apply it via inline style or a CSS variable override on the root quiz container:

```svelte
<div style="--cat-color: {$categoryColor}" class="quiz-container">
```

---

## Tailwind Configuration

```js
// tailwind.config.js
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff0094',
        'primary-light': '#ff66c4',
        correct: '#16a34a',
        incorrect: '#dc2626',
      },
      fontFamily: {
        main: ['Nunito', 'sans-serif'],
      },
      maxWidth: {
        app: '480px',
      }
    },
  },
}
```

---

## SvelteKit Configuration

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',  // SPA mode
    }),
  },
}
```

---

## Phase-by-Phase Build Instructions

---

### PHASE 0 — Project Setup
**Do this manually before opening Claude Code.**

```bash
cd /Users/danmason/Documents/CODE/kokoprep
npm create svelte@latest . 
# Choose: Skeleton project, Yes to TypeScript? NO, Add Tailwind? YES (or add manually)
npm install
npm install -D @sveltejs/adapter-static
```

Place `questions.json` (the provided seed bank file) in two locations:
- `src/lib/data/questions.json`
- `questions.json` (project root, for easy manual editing)

**CHECKPOINT 0:** `npm run dev` opens in browser with the default SvelteKit skeleton page. No errors in terminal.

---

### PHASE 1 — App Shell & Global Styles
**Hand to Claude Code with this instruction:**

> "Set up the KokoPrep app shell. Replace the default SvelteKit skeleton with a clean single-route app. Tasks:
> 1. Configure `svelte.config.js` for `adapter-static` with `fallback: 'index.html'`
> 2. Set up `app.css` with the CSS custom properties listed in the build plan (design tokens section)
> 3. Load Nunito font from Google Fonts in `app.html`
> 4. Create `src/routes/+page.svelte` that renders a centred container div with `max-width: 480px`, pink background header bar showing 'KokoPrep' in white, and a `<main>` content area with light grey background
> 5. The layout must work at 375px wide (iPhone SE) with no horizontal scroll
> Refer to the design tokens in the build plan for all colours."

**CHECKPOINT 1:** On your phone (or browser at 375px), see a pink header with "KokoPrep" and clean white content area. No layout breaks.

---

### PHASE 2 — Data Layer & Stores
**Hand to Claude Code with this instruction:**

> "Create the data layer for KokoPrep. Tasks:
> 1. Create `src/lib/stores/quiz.js` implementing all stores described in the App State Model section of the build plan. Use Svelte's `writable` stores. Export a `resetSession()` function that clears all session state.
> 2. Create `src/lib/utils/quiz.js` implementing the `getSessionQuestions()` and `shuffle()` functions exactly as specified in the Question Selection Logic section.
> 3. Create `src/lib/utils/storage.js` with two functions: `loadFromStorage()` which reads `koko_history` and `koko_missed` from localStorage (returning empty arrays if not found), and `saveToStorage(history, missed)` which writes them back. Wrap all localStorage calls in try/catch.
> 4. Import questions from `src/lib/data/questions.json` and expose them via a `questions` store.
> Do not build any UI yet. Write a simple console.log test at the bottom of quiz.js that runs getSessionQuestions with category='mathematics', count=5, and logs the result."

**CHECKPOINT 2:** Open browser console. See 5 mathematics questions logged with no errors.

---

### PHASE 3 — Dashboard Screen
**Hand to Claude Code with this instruction:**

> "Build Screen 1: the Dashboard for KokoPrep. This is the only screen visible on first load. Build it inside `src/routes/+page.svelte`, shown when the store's `screen` value is 'dashboard'. Tasks:
>
> 1. **Header:** App name 'KokoPrep' centred, primary pink, bold, large. Below it a Koko placeholder — use a large emoji 🐨 for now (will be replaced with custom SVG later).
>
> 2. **Mode toggle:** Two full-width buttons side by side: '🧠 Brain Gym' and '⏱ Beat the Clock'. Selected button fills with primary pink and white text. Unselected has white background with pink border.
>
> 3. **Category grid:** 2-column grid of 6 subject tiles using the colours in the Category System table from the build plan. Each tile has subject name in white, bold. Below the grid, a full-width 'Mix It Up 🎲' tile with a pink-to-purple gradient. Tapping a tile selects it (shows a thick white border outline on the tile).
>
> 4. **Options row (conditional):**
>    - If Brain Gym selected: show 'Questions:' label with pill buttons '5' and '10'
>    - If Beat the Clock selected: show 'Time:' label with pill buttons '5 min', '10 min', '15 min'
>    - This row animates in with a simple fade when the mode changes
>
> 5. **GO button:** Full width, primary pink, white text, large, bold, rounded. Disabled (grey, not clickable) unless both a mode AND a category are selected. On click, call `startSession()` which calls `getSessionQuestions()` with the selected options, sets the questions store, and sets `screen` to 'test'.
>
> 6. **Past Achievements:** Below GO button. Title '🏆 Past Kocos'. Read from `koko_history` in localStorage. Show last 5 entries as cards (date, subject, score, mode). Each card has a small '↩ Try Again' button that pre-fills the dashboard with the same mode and category and calls startSession immediately. If no history, show 'No Kocos yet — press GO to start your first one! 🚀'.
>
> All spacing should be comfortable for a child's fingers (min touch target 44px tall)."

**CHECKPOINT 3:** Full dashboard works on mobile. Mode toggle switches. Category tiles select. Options row changes correctly. GO button enables/disables. Past Achievements shows placeholder text (localStorage is empty).

---

### PHASE 4 — Question Card & Brain Gym Mode
**Hand to Claude Code with this instruction:**

> "Build the Active Test Room (Screen 2) for Brain Gym mode. Shown when `screen === 'test'`. Tasks:
>
> 1. **Header:** Left side shows category name with a colour dot in the category colour. Right side shows 'Q X of Y'. Use the `--cat-color` CSS variable (set on the container) for the dot colour.
>
> 2. **Progress bar:** Row of small emoji icons 🐨 (one per question). Before answering: grey/muted. Correct: green tint background behind icon. Incorrect: red tint. Maximum 10 icons — if session has more, use a text progress bar `Q 6 of 15` and a filled progress bar div instead.
>
> 3. **Question card:** White card, `border-radius: 16px`, shadow. Top-left badge shows 'Q1', 'Q2' etc. Question text in dark colour, readable size. Below it, 4 option buttons stacked (A, B, C, D). Each option button is a white card with a left border in `--cat-color`, option letter badge on left, option text on right.
>
> 4. **Brain Gym answer interaction:**
>    - On clicking an option: record the answer. If correct, turn that button green. If incorrect, turn it red AND reveal the correct answer in green.
>    - Lock all buttons immediately (no other option can be clicked)
>    - Animate the explanation pane sliding in below the question card
>    - Explanation pane has light tinted background (5% opacity of `--cat-color`), explanation text, and if `extraKokoFact` is non-null a '⭐ Koko Knows!' section in primary pink
>    - Show 'Next Question →' button. On last question, show 'See Results 🎉' instead
>
> 5. **Next logic:** On clicking Next, increment `currentIndex`. If last question, set `screen` to 'results'.
>
> 6. **Missed questions update (local to session):** Track which question IDs were answered incorrectly during the session — you will pass these to the storage utility in Phase 6."

**CHECKPOINT 4:** Complete a 5-question Brain Gym maths quiz on your phone. Questions display. Tapping correct answer shows green. Tapping wrong answer shows red + correct. Explanation appears. Next button advances. Reaches results screen (which can be empty/placeholder for now).

---

### PHASE 5 — Beat the Clock Mode
**Hand to Claude Code with this instruction:**

> "Add Beat the Clock mode to the Active Test Room. This extends Phase 4's Screen 2. Tasks:
>
> 1. **Timer component (`src/lib/components/Timer.svelte`):**
>    - Displays `MM:SS` format in the header right area (replacing the Q X of Y counter)
>    - Counts down from `timerMinutes × 60`
>    - Under 60 seconds: text turns red, bold, slight pulse animation (CSS keyframe, nothing heavy)
>    - At 0: stops, marks current unanswered question as `null` in answers array, then sets `screen` to 'results'
>    - Uses `onMount` / `onDestroy` to manage `setInterval` cleanly — clear on unmount to avoid memory leaks
>
> 2. **Beat the Clock answer interaction (different from Brain Gym):**
>    - On clicking an option: highlight that option in `--cat-color` (no green/red reveal)
>    - Show 'Next →' button immediately
>    - No explanation pane shown
>    - On Next: record answer, advance to next question. If all 40 (max pool) questions are answered, set `screen` to 'results'
>
> 3. **No progress icon states during Beat the Clock:** The progress icons remain neutral during the test. Their state is only calculated and shown on the Results screen.
>
> 4. **Mode distinction:** The store already knows the mode. Use `{#if $mode === 'braingym'}` / `{:else}` in the Question Card component to switch behaviour."

**CHECKPOINT 5:** Complete a 5-minute Beat the Clock quiz. Timer counts down. Selecting an option and tapping Next advances quickly with no explanation. Timer expiring automatically ends the session. Test interruption at ~3 minutes — results screen loads.

---

### PHASE 6 — Results Screen
**Hand to Claude Code with this instruction:**

> "Build Screen 3: Results. Shown when `screen === 'results'`. Tasks:
>
> 1. **Score calculation:** Count how many questions in the `answers` array match the correct index of the corresponding question. Calculate percentage.
>
> 2. **Celebratory header:**
>    - Large Koko emoji placeholder 🐨 centred
>    - Celebratory message based on percentage (see thresholds in build plan)
>    - Score as large fraction text e.g. '8 / 10'
>    - Percentage below in smaller text
>    - Category and mode badges (coloured pills)
>
> 3. **Brain Gym review:** A simple list of all questions. Each row: question preview text (truncated to 60 chars), green tick or red cross, and if incorrect show the correct answer text in green below.
>
> 4. **Beat the Clock accordion review:** Use a `<details>`/`<summary>` HTML element for each question (native accordion, no JS needed). Summary shows: Q number, first 50 chars of question, green/red indicator. Expanded content shows full question, user's answer highlighted red (if wrong) or green (if right), correct answer in green, full explanation text.
>
> 5. **Missed questions update:** On mount of this screen, call the storage utility:
>    - Read current `missedQuestionIds` from localStorage
>    - Add IDs of questions answered incorrectly
>    - Remove IDs of questions answered correctly (they are now known)
>    - Cap at 50, save back
>    - Save new history entry (see HistoryEntry schema in build plan)
>
> 6. **Action buttons:**
>    - '🔁 New Koko' — calls `resetSession()` store function, sets `screen` to 'dashboard'
>    - '📚 Review Missed Questions' — only show if `missedQuestionIds` has entries. On click: filter questions to missed IDs only, shuffle, take up to 10, set mode to 'braingym', set screen to 'test', set category label to 'Missed Questions'. This is a special session — skip category selection."

**CHECKPOINT 6:** Full app loop works. Complete a quiz → see results → score correct → missed questions saved → New Koko returns to dashboard → Past Achievements shows the completed test → Try Again works.

---

### PHASE 7 — Polish & Error Handling
**Hand to Claude Code with this instruction:**

> "Final polish pass for KokoPrep. Tasks:
>
> 1. **Screen transitions:** Add a simple CSS fade (opacity 0 → 1, 200ms) when switching between screens. Use Svelte's `transition:fade` directive.
>
> 2. **Edge cases:**
>    - What if a category has fewer questions than requested? Show all available questions rather than failing. Log a warning to console.
>    - What if localStorage is unavailable (private browsing)? Catch the error silently — the app still works, just without persistence. Show no error to the user.
>    - What if `missedQuestionIds` contains IDs that no longer exist in the question bank (e.g. after a JSON update)? Filter them out silently.
>
> 3. **Accessibility basics:**
>    - All interactive elements have visible focus rings (use `focus-visible` CSS)
>    - Option buttons use `role='button'` and `aria-pressed`
>    - Timer announces remaining time to screen readers at 2-minute and 1-minute marks using an `aria-live` region
>
> 4. **Viewport lock:** In `app.css`, add:
>    ```css
>    body {
>      max-width: 480px;
>      margin: 0 auto;
>      min-height: 100vh;
>      background: #f0f0f0; /* grey surround on desktop */
>    }
>    ```
>    The app content has white/coloured background. The grey surround only shows on screens wider than 480px.
>
> 5. **Build test:** Run `npm run build`. Fix any adapter-static warnings (usually about dynamic routes — there should be none). Confirm the `build/` folder contains `index.html`."

**CHECKPOINT 7:** `npm run build` completes with no errors. Test the built version with `npx serve build` — full app works, no console errors, no broken styles.

---

### PHASE 8 — GitHub & Cloudflare Deployment
**Do this manually (not Claude Code).**

```bash
# In /Users/danmason/Documents/CODE/kokoprep
git init
git add .
git commit -m "KokoPrep v1 - initial build"
```

1. Create a new **private** GitHub repository called `kokoprep`
2. Push: `git remote add origin <your-repo-url> && git push -u origin main`
3. Go to [Cloudflare Pages](https://pages.cloudflare.com)
4. Connect GitHub, select `kokoprep` repo
5. Build settings:
   - Framework: SvelteKit
   - Build command: `npm run build`
   - Output directory: `build`
6. Deploy

**CHECKPOINT 8:** Live URL works on your actual phone over mobile data. Full quiz loop completes. localStorage persists between sessions on mobile Safari/Chrome.

---

## Question Bank Expansion Guide

### Current seed bank (provided as `questions.json`)
- **Mathematics:** 25 questions
- **English Language:** 15 questions  
- **Basic Science & Technology:** 15 questions
- **Social Studies & Civics:** 15 questions
- **Christian Religious Studies:** 10 questions
- **Agricultural Science:** 8 questions
- **Total: 88 questions**

### Target bank (by end of month)
- Mathematics: 60
- English: 50
- Science: 40
- Social Studies: 40
- CRS: 30
- Agriculture: 30
- **Total: ~250 questions**

### How to expand (do this in Claude.ai chat, not Claude Code)

Prompt to use in a new Claude conversation:

> "I am building a Nigerian Common Entrance exam revision app. I need you to generate 20 more questions in the category [CATEGORY NAME] following this exact JSON schema: [paste schema]. Base the questions on the Babcock University Schools JSS1 style — multiple choice, 4 options, one correct answer. Include a clear explanation for each. All questions must be factually accurate. Do not repeat these questions which I already have: [paste existing IDs]. Return only valid JSON — an array of question objects, no other text."

### Important rules when expanding
1. **Always verify maths calculations manually** before adding to the bank
2. **English comprehension passages** must be original short paragraphs (4-6 sentences) followed by 4-5 questions about that passage. Group them with a `passageId` field.
3. **CRS questions** should cover: Days of Creation, key miracles, parables, the Ten Commandments, key figures (Moses, David, Daniel, Paul, Mary), fruit of the Spirit, the Lord's Prayer, the Beatitudes
4. **Social Studies** should include: Nigerian symbols (flag, coat of arms, anthem, pledge), independence history, types of family, agents of socialisation, natural resources, civic values
5. **ID format** must be unique: `math_026`, `eng_016`, `science_016`, `social_016`, `crs_011`, `agric_009`

### Adding questions to the project
1. Edit `src/lib/data/questions.json` in VS Code
2. Paste new questions into the array (valid JSON — check with `Cmd+Shift+P → Format Document`)
3. Save and `npm run dev` to confirm no parse errors
4. Commit: `git add . && git commit -m "Add 20 maths questions" && git push`
5. Cloudflare Pages will automatically redeploy

---

## Known Limitations & V2 Ideas

- No image/diagram questions (some Common Entrance questions use diagrams — skip for now)
- No audio (phonetics questions are text-only in this version)
- No user accounts — all data is per-device
- Koko character is a placeholder — replace SVG files in `static/` when ready
- Consider adding: streak tracker, subject-by-subject weak area analysis, parent view

---

## Colour Reference

| Purpose | Value |
|---|---|
| Primary pink | `#ff0094` |
| Primary pink light | `#ff66c4` |
| Mathematics | `#2563eb` |
| English | `#7c3aed` |
| Science | `#0d9488` |
| Social Studies | `#ea580c` |
| CRS | `#d97706` |
| Agriculture | `#16a34a` |
| Correct | `#16a34a` |
| Incorrect | `#dc2626` |
| Background | `#fafafa` |
| Card | `#ffffff` |
| Text | `#1a1a2e` |
| Muted text | `#6b7280` |
