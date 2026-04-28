# D3 Practice Tasks — Project Reference

## What this project is

A multi-page interactive web application for teaching D3.js basics in a single ~90-minute exercise session. Built for the course **Grundlagen der Informationsvisualisierung** at the University of Bamberg (instructor: Madhav Poddar, co-instructor: Leah Mühlöder, supervised by Prof. Dr. Fabian Beck). Deployed via GitHub Pages.

Students learn by modifying, predicting, fixing, and writing D3 code snippets directly in the browser.

---

## Learner profile

Students have attended two prior exercise sessions (slides in `prev_sessions/`):

**E01 — Web Technologies:** HTML structure, SVG shapes (circle, rect, ellipse, line, polyline, polygon, path), SVG coordinate system, SVG transformations (scale/translate/rotate, `<g>`), CSS (element/class/id selectors, pseudo-classes), JS DOM (`getElementById`, `setAttribute`, `addEventListener`), browser dev tools inspection.

**E02 — D3.js intro:** `d3.select` / `d3.selectAll`, `.attr()` with values and arrow functions `d => d`, data binding pattern (`.data().enter().append()`), `scaleLinear` with domain/range, `(d, i) =>` index pattern, basic bar chart.

**Assumed gaps (do not assume 100% retention):**
- Arrow functions and `(d, i) =>` may be shaky
- The enter/update/exit lifecycle is likely not fully internalized
- Only `scaleLinear` has been seen — no other scale types
- No axes, no external data loading, no path generators, no `<text>` elements

**Target outcome:** Students capable of building a static custom visualization (not interactive, not animated).

---

## Curriculum

One session, ~90 minutes. Navigation is **linear with a skip option**. Progress stored in localStorage.

**One page = one theme.** Pages can contain **multiple tasks** when the theme decomposes naturally (e.g. bar orientation has two related tasks; the smiley capstone has four). Single-focus tasks beat cramming several conceptual changes into one editor.

**Tasks come in two types:**
- **`type: 'code'`** (default) — student edits code in CodeMirror; hint→solution diff modal flow.
- **`type: 'mcq'`** — multiple-choice question (typically a "predict the output" prompt). Code is shown read-only alongside the options. The "Reveal answer" button picks the answer **and** runs the code in the preview, so the reveal is also a visual demonstration.

The full list — 14 pages, 24 tasks:

| # | Page slug | Title | Tasks | Notes |
|---|---|---|---|---|
| 0 | `/` | Landing page | — | Lists pages, shows per-page status |
| 1 | `/drawing-order` | Drawing order | 3 | (a) MCQ predict for `[90, 30, 60]`; (b) reorder to make all visible; (c) repeat for `[30, 60, 90]` |
| 2 | `/bar-orientation` | Bar orientation | 2 | (a) bottom-up; (b) horizontal |
| 3 | `/enter-vs-join` | enter vs join | 1 | One-line replacement |
| 4 | `/style-vs-attr` | .style() vs .attr() | 1 | One-word change |
| 5 | `/data-as-objects` | Data as objects | 1 | `d` → `d.runtime` |
| 6 | `/loading-data` | Loading external data | 1 | `d3.csv().then(...)` + `+d.runtime` |
| 7 | `/two-scales` | Scales for two dimensions | 3 | (a) add y-scale; (b) `d3.extent`; (c) `.nice()` |
| 8 | `/scaleband` | scaleBand | 1 | Replace `scaleLinear` for categories |
| 9 | `/axes` | Axes | 2 | (a) bottom + left axis; (b) axis label + dev tools task |
| 10 | `/color-by-category` | Color by genre | 1 | `scaleOrdinal` + `schemeTableau10` |
| 11 | `/group-per-datum` | Group per data point | 1 | Refactor to `<g>` with translate |
| 12 | `/smiley` | The smiley | 4 | (a) face; (b) eyes; (c) mouth; (d) encode rating |
| 13 | `/line-chart` | Line chart | 1 | Standalone — `d3.line()` path |
| 14 | `/bonus` | Bonus — size encoding | 1 | Encode box office in glyph size |

---

## Dataset

**12 well-known movies** — used as the primary dataset throughout (soft constraint; individual exercises may use simpler inline data when needed for clarity).

```js
const movies = [
  { title: "The Grand Budapest Hotel", genre: "Comedy",    runtime: 99,  imdb: 8.1, boxOffice: 175  },
  { title: "Get Out",                  genre: "Horror",    runtime: 104, imdb: 7.7, boxOffice: 255  },
  { title: "Coco",                     genre: "Animation", runtime: 105, imdb: 8.4, boxOffice: 807  },
  { title: "Mad Max: Fury Road",       genre: "Action",    runtime: 120, imdb: 8.1, boxOffice: 375  },
  { title: "La La Land",               genre: "Drama",     runtime: 128, imdb: 8.0, boxOffice: 446  },
  { title: "Knives Out",               genre: "Mystery",   runtime: 130, imdb: 7.9, boxOffice: 311  },
  { title: "Parasite",                 genre: "Thriller",  runtime: 132, imdb: 8.5, boxOffice: 258  },
  { title: "Everything Everywhere All at Once", genre: "Sci-Fi", runtime: 139, imdb: 7.8, boxOffice: 72 },
  { title: "Inception",                genre: "Sci-Fi",    runtime: 148, imdb: 8.8, boxOffice: 836  },
  { title: "The Dark Knight",          genre: "Action",    runtime: 152, imdb: 9.0, boxOffice: 1005 },
  { title: "Interstellar",             genre: "Sci-Fi",    runtime: 169, imdb: 8.6, boxOffice: 773  },
  { title: "Oppenheimer",              genre: "Drama",     runtime: 180, imdb: 8.3, boxOffice: 952  },
];
```

**Eventual scatterplot mapping:**
- X axis: runtime (minutes) — `scaleLinear`
- Y axis: IMDb rating — `scaleLinear`
- Color: genre — `scaleOrdinal` + `d3.schemeTableau10`
- Glyph expression: IMDb rating → smiley face (higher rating = happier expression)
- Bonus: box office → glyph size

---

## Exercise design rules

### Interaction types (use a mix per exercise)
- **Predict output (MCQ)** — radio options; "Reveal answer" runs the code so the reveal is also a visual demonstration. Use `type: 'mcq'`.
- **Fix the bug** — code has one or more deliberate errors; student finds and corrects them
- **Fill in the blanks** — code has gaps (tokens) student must complete; surrounding code is locked
- **Constrained edit** — student changes specific values (numbers, strings, attribute names); locked regions prevent structural changes
- **Guided free edit** — student writes a section with scaffolding/comments; rest is locked
- **Open / creative** — minimal constraints; student builds something from a brief

### Feedback model
1. **Hint** — on-demand, revealed on button click; one hint per task max
2. **Compare with solution** — only available after the hint has been shown; opens a **side-by-side diff modal** (original starter on the left, solution on the right, lines that differ highlighted red/green via the `diff` package). The student can close the modal and keep their attempt, or click "Apply solution to my editor" to copy the solution into the editor.

### Correctness checking (case by case — no single strategy)
- DOM assertion: check that specific SVG elements/attributes exist with expected values
- Expected value check: compare computed output against known correct answer
- Visual self-check: student judges their own output (used for creative exercises); no automated check

### Code editor behaviour
- **Run ▶** — manually execute the student's current code
- **Autorun** toggle — re-execute on every keystroke (off by default)
- **Reset** — restore the task's starter code
- **Download .html ⬇** — exports the current editor state as a self-contained HTML file (D3 v7 imported as ESM from jsdelivr's `+esm` endpoint, body markup and any per-task `extraCSS` bundled in, `<base>` tag pointing at the originating app so relative URLs like `data/movies.csv` keep resolving)
- **Locked regions** — line ranges the student cannot edit, enforced by CodeMirror 6's `EditorState.changeFilter`. Locked lines are visually styled with a faint lavender background. Used heavily in single-change tasks so only the line(s) being edited are interactive; whole-code refactors leave the editor open.

### What is out of scope (do not add)
- Transitions / `.transition().duration()` — project scope is **static** visualizations only
- Mouse event handling (`.on("mouseover")` etc.) — same reason
- Tooltips — same reason
- Responsiveness / mobile — desktop only
- Accessibility — deferred
- Backend / user accounts — localStorage only

---

## Tech stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | SvelteKit (Svelte 5, legacy syntax) | Reactive state for run/autorun/progress; component reuse |
| Routing | Single dynamic `[slug]/+page.svelte` route | Adding a new exercise = new config file + register in `index.js` |
| Rendering mode | `prerender = true; ssr = false` (SPA) | Prerenders one HTML shell per slug; all content runs client-side. Avoids fighting SSR for components that need `window` (CodeMirror, iframe, localStorage) |
| Deployment | `adapter-static` → GitHub Pages | Static output, no server needed |
| D3 version | v7 | Inside iframe via `<script src="https://d3js.org/d3.v7.min.js">` (matches E02 slides). Standalone HTML export uses ESM from `https://cdn.jsdelivr.net/npm/d3@7/+esm` |
| Code editor | CodeMirror 6 | Read-only ranges via `changeFilter`; syntax highlighting via `defaultHighlightStyle`; Svelte-compatible |
| Diff view | `diff` npm package — `diffLines()` for line-level comparison | Powers the side-by-side solution comparison modal |
| Markdown | `marked` npm package | Renders `preTask` / `postTask` / per-task `description` markdown |
| D3 execution | Sandboxed `<iframe sandbox="allow-scripts" srcdoc=…>` | Each Run rebuilds a full mini HTML page; `<base>` tag injected so `d3.csv("data/...")` resolves to the parent app's origin |
| Progress | `localStorage` only — strictly per-browser, no login | No backend; GitHub Pages compatible |
| Session portability | Export / Import / Clear session as JSON file | Lets students carry progress between machines without a backend |
| Styling | Geometric vibe (clean shapes, geometric sans typography) without hindering content | Engaging, informal — not academic |
| Language | English (UI + exercise text); German switch deferred — keep strings in config files | German not blocking v1 |
| TypeScript? | No — plain JS throughout | Simpler mental model for instructor-editable config files |

---

## Architecture

### Instructor-editable content model
Each page is defined in a **plain `.js` config file** in `src/exercises/` — instructors edit only these files, no Svelte knowledge required.

```js
// src/exercises/data-as-objects.js
export default {
  id: 'data-as-objects',                // also the URL slug
  title: 'Data as objects',
  preTask:  `Markdown — context shown above all tasks on this page.`,
  postTask: `Markdown — recap shown below all tasks.`,
  tasks: [                              // 1+ tasks per page
    // ---- CODE TASK (default; type omitted) ----
    {
      id: 'fix-bug',                    // unique within the page
      title: 'Fix the bug',             // optional; rendered as task header
      description: `Markdown — shown above this task's editor.`,
      starterCode: `...`,
      lockedRanges: [                   // 1-based, inclusive line ranges
        { from: 1, to: 17 },
        { from: 19, to: 20 }
      ],
      hint: 'One-sentence hint shown after Show hint is clicked.',
      solution: `...`,                  // shown in the side-by-side diff modal
      autorun: false,                   // optional, default false
      iframe: {
        width: 500,                     // optional, default 600
        height: 240,                    // optional, default 400
        html: '<svg id="chart" .../>',  // optional body markup; default is a 600x400 svg
        extraCSS: ''                    // optional CSS for the iframe body
      },
      check: (iframeDoc) => {           // optional DOM assertion
        const rects = iframeDoc.querySelectorAll('#chart rect');
        return rects.length === 6 && rects[0].getAttribute('width') === '99';
      }
    },
    // ---- MCQ TASK ----
    {
      id: 'predict-count',
      type: 'mcq',
      title: 'How many will be visible?',
      description: `Markdown — the question itself. Shown above the options.`,
      options: [
        { value: '1', label: 'Just 1' },
        { value: '2', label: '2 circles' },
        { value: '3', label: 'All 3' }
      ],
      correctAnswer: '2',               // matches the value of the right option
      explanation: `Markdown — shown after Reveal answer is clicked.`,
      starterCode: `...`,               // shown read-only; runs in preview on Reveal
      iframe: { /* same as code task */ }
    }
  ]
};
```

Pages with a single task still wrap it in `tasks: [...]` for uniformity — but the registry's `normalize()` shim will also accept the legacy single-task shape (with `starterCode` etc. at the top level) and auto-wrap it.

Adding a new page: create the config file, import it in `src/exercises/index.js`, append to the array. The dynamic `[slug]` route picks it up automatically.

### Directory structure
```
d3-practice-tasks/
├── src/
│   ├── routes/
│   │   ├── +page.svelte                 # Landing page
│   │   ├── +layout.svelte               # App shell (topbar + session menu)
│   │   ├── +layout.js                   # prerender=true, ssr=false
│   │   └── [slug]/
│   │       ├── +page.svelte             # Renders ExerciseShell for any exercise
│   │       └── +page.js                 # entries() — feeds slugs to the prerenderer
│   ├── exercises/
│   │   ├── index.js                     # Registry: imports + normalize() + findExercise()
│   │   ├── drawing-order.js             # One config file per page (instructor-editable)
│   │   ├── bar-orientation.js
│   │   ├── enter-vs-join.js
│   │   ├── style-vs-attr.js
│   │   ├── data-as-objects.js
│   │   ├── loading-data.js
│   │   ├── two-scales.js
│   │   ├── scaleband.js
│   │   ├── axes.js
│   │   ├── color-by-category.js
│   │   ├── group-per-datum.js
│   │   ├── smiley.js
│   │   ├── line-chart.js
│   │   └── bonus.js
│   ├── lib/
│   │   ├── ExerciseShell.svelte         # Renders preTask, list of task blocks (dispatched by type), postTask, prev/next nav
│   │   ├── CodeTaskBlock.svelte         # Code task: editor + preview + hint/solution + download
│   │   ├── McqTaskBlock.svelte          # MCQ task: options + read-only code + preview; Reveal runs the code
│   │   ├── CodeEditor.svelte            # CodeMirror 6 wrapper with locked-range and readOnly support
│   │   ├── Preview.svelte               # Sandboxed iframe wrapper (imperative srcdoc updates)
│   │   ├── SolutionDiff.svelte          # Side-by-side comparison modal (uses `diff` library)
│   │   ├── SessionMenu.svelte           # Header dropdown — export/import/clear session JSON
│   │   ├── buildStandalone.js           # Produces the downloadable standalone HTML
│   │   └── progress.js                  # localStorage read/write helpers (per-task storage)
│   ├── app.html                         # Document shell
│   └── app.css                          # Design tokens + global styles
├── static/
│   ├── favicon.svg
│   └── data/
│       ├── movies.json                  # Dataset (used by exercises 6+)
│       └── movies.csv
├── prev_sessions/                       # E01 + E02 reference PDFs (not served)
├── CLAUDE.md                            # This file
├── svelte.config.js                     # adapter-static + paths.base TODO
├── vite.config.js
└── package.json
```

### iframe execution model
When the student clicks Run, `Preview.svelte` sets the iframe's `srcdoc` to:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <base href="{window.location.origin}{base}/">
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; margin: 16px; color: #1f2540; }
    svg { background: #ffffff; }
    /* + per-task extraCSS injected here if provided */
  </style>
</head>
<body>
  {bodyHtml}                    <!-- e.g. <svg id="chart" width="600" height="400"></svg> -->
  <script>
    window.addEventListener('error', (e) => parent.postMessage({__d3p:true, type:'error', message:e.message, line:e.lineno}, '*'));
    window.addEventListener('unhandledrejection', (e) => parent.postMessage({__d3p:true, type:'error', message:'Unhandled promise rejection: '+(e.reason?.message ?? e.reason)}, '*'));
    try {
      {studentCode}
    } catch (err) {
      parent.postMessage({__d3p:true, type:'error', message:err.message, line:err.lineNumber}, '*');
    }
  </script>
</body>
</html>
```

- The iframe uses `sandbox="allow-scripts"` (origin is `null`). The injected `<base>` tag points at the originating app so `d3.csv("data/movies.csv")` resolves to the parent's hosted file.
- Runtime errors are caught and forwarded to the parent via `postMessage`. The parent renders them in a red-bordered, non-blocking panel below the preview.
- Default iframe size is 600×400; per-task `iframe.width` / `iframe.height` overrides apply.
- **`srcdoc` is set imperatively only.** Each task's Preview keeps `srcdoc` *unbound* in the template; `Preview.run(latestCode)` writes it on initial mount and on every Run / autorun. (Earlier the binding was reactive — that raced with imperative writes on revisit and left the iframe blank.)
- For autorun, `TaskBlock` calls `preview.run(code)` synchronously after each keystroke — passing `code` explicitly avoids any prop-propagation lag.

### Standalone HTML export
Every TaskBlock has a **Download .html ⬇** button that produces a self-contained, runnable HTML file. The exported file:

- Imports D3 v7 as a true ES module from `https://cdn.jsdelivr.net/npm/d3@7/+esm`, then attaches it to `window.d3` so existing `d3.select(...)`-style code keeps working
- Bundles the body markup and any per-task `extraCSS`
- Carries a `<base>` tag pointing at `${window.location.origin}${base}/` (so relative URLs like `data/movies.csv` keep resolving when opened from disk)
- Escapes `</script>` sequences inside the user code so they can't accidentally close the host script tag
- Filename is `<exerciseId>__<taskId>.html`

Implementation: `src/lib/buildStandalone.js`.

### Page layout (per-page)
A page is a vertical stack: the **preTask** markdown panel, then one or more **TaskBlock**s (each with its own description + editor + preview), then the **postTask** markdown panel, then prev/next navigation.

```
┌──────────────────────────────────────────────────────────────┐
│  Topbar  (logo + Session ▾ menu)                              │
├──────────────────────────────────────────────────────────────┤
│  Page header: "Page X of N"  +  page title                    │
│                                  [← Previous] [Next →]        │
├──────────────────────────────────────────────────────────────┤
│  preTask panel (markdown)                                     │
├──────────────────────────────────────────────────────────────┤
│  ┌─ TaskBlock ────────────────────────────────────────────┐  │
│  │ Task 1 · {title}                                        │  │
│  │ {description markdown}                                  │  │
│  │ ┌──────────────────────────┬──────────────────────────┐ │  │
│  │ │ Editor toolbar:          │ Preview                  │ │  │
│  │ │ Run ▶  [Autorun] Reset   │ (iframe)                 │ │  │
│  │ │ Download .html ⬇         │                          │ │  │
│  │ │   (right side):          │ Runtime error panel      │ │  │
│  │ │   Show hint              │   (only if error)        │ │  │
│  │ │   Compare with solution  │                          │ │  │
│  │ │ — — — — — — — — — — —    │                          │ │  │
│  │ │ CodeMirror 6 editor      │                          │ │  │
│  │ └──────────────────────────┴──────────────────────────┘ │  │
│  │ Hint banner (only after "Show hint")                    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─ TaskBlock (Task 2 if multi-task page) ──────────────...   │
│  └─────────────────────────────────────────────────────...   │
│                                                                │
├──────────────────────────────────────────────────────────────┤
│  postTask panel (markdown)                                    │
├──────────────────────────────────────────────────────────────┤
│  [← Previous] [Next →]                                        │
└──────────────────────────────────────────────────────────────┘
```

**Compare with solution** opens a full-screen modal: original starter on the left, solution on the right, lines that differ highlighted (red strikethrough for removed, green for added). Below: an "Apply solution to my editor" button if the student wants to copy it in.

### Session export / import / clear
A small menu in the header offers three actions:

- **Export session** — serializes all `localStorage` keys for this app into a single JSON file, triggers download (e.g. `d3-session-2026-04-27.json`)
- **Import session** — file picker; reads JSON, validates schema (version field), writes to `localStorage`, reloads
- **Clear session** — confirmation dialog, then wipes all app `localStorage` keys

**Schema (`STORAGE_KEY = "d3-practice-tasks::v1"`):**
```json
{
  "version": 1,
  "savedAt": "2026-04-27T14:30:00Z",
  "lastVisited": "drawing-order",
  "exercises": {
    "drawing-order": {
      "completed": true,
      "tasks": {
        "predict-90-30-60":  { "selectedAnswer": "2", "revealed": true },
        "reorder-90-30-60":  { "hintRevealed": false, "solutionRevealed": false, "code": "..." },
        "predict-30-60-90":  { "hintRevealed": true,  "solutionRevealed": false, "code": "..." }
      }
    },
    "bar-orientation": {
      "completed": false,
      "tasks": {
        "bottom-up":  { "hintRevealed": true, "solutionRevealed": false, "code": "..." },
        "horizontal": { "hintRevealed": false, "solutionRevealed": false, "code": null }
      }
    }
  }
}
```

Two-level structure (page → task). Page-level `completed` is set when the student clicks Next.

Per-task fields differ by task type:
- **Code tasks** store `hintRevealed`, `solutionRevealed`, `code`.
- **MCQ tasks** store `selectedAnswer` (the value the student picked) and `revealed` (whether they clicked Reveal answer).

`progress.js` doesn't enforce a per-type schema — it just merges whatever patch you pass into the per-task slot. Both shapes coexist in the same `tasks` object.

### Progress / completion model
- **Self-paced**: page-level "completed" is marked when the student clicks Next — no enforcement
- Students can revisit any page and pick up where they left off (per-task code persists per keystroke, debounced 250 ms)
- TaskBlock initializes its `code` from localStorage **at component-init time** (not in `onMount`), so revisits don't flash the starter code before the saved version appears

---

## Design / tone

- **Geometric, engaging, informal** — clean shapes (squares, circles, triangles) used sparingly as decorative elements; geometric sans-serif typography (Inter, Manrope, or DM Sans); restrained palette (1 primary + 1 accent + neutrals); decorative elements must never compete with the editor/preview content
- Student-facing language should be conversational, not academic
- Desktop only — no mobile layout needed
- Some pages intentionally expose raw HTML/SVG for students to inspect in browser dev tools (exercise 9 specifically asks students to use the inspector)

---

## Key decisions log

| Decision | Choice | Reason |
|---|---|---|
| All visualizations are static | Yes | Scope boundary; no transitions or interactions |
| Progress model | Linear + skip option | Enforces learning path; faster students can jump ahead |
| Hint/solution flow | Hint first, then solution | Scaffolded help; avoids students jumping straight to answer |
| Dataset | Movies (12 films) | Recognizable, culturally diverse, naturally maps to the smiley glyph theme |
| Data loading exercise | Included | Students must learn to load from files, not just hardcoded arrays |
| `d3.line()` | Included as standalone | Basic path generator concept; does not violate static scope |
| `scaleBand` | Included | Essential once categories appear on an axis |
| Transitions / events | Excluded | Out of scope (static only) |
| Accessibility | Deferred | Not a priority for this version |
| Mobile | Not supported | Desktop only |
| Language | English first, German switch deferred | German not blocking v1 |
| Completion enforcement | None — pure self-pacing via Next | Trust the student |
| Session portability | Export / Import / Clear as JSON | No backend, but progress is portable across machines |
| Page model | One page = one theme; pages can hold multiple tasks | Smaller per-task scope; thematically related questions grouped on one page rather than splintered into separate routes |
| Routing | Single dynamic `[slug]` route | Adding a page = config file + register in index.js; no per-page route file to maintain |
| Solution reveal | Side-by-side diff modal (original vs solution) with optional "Apply" | Lets students compare without immediately replacing their attempt |
| Standalone export | "Download .html ⬇" per task; D3 imported as ESM | Students can take their work outside the app and run it independently |
| iframe srcdoc updates | Imperative only (no reactive binding) | Prevents races between reactive re-renders and explicit run() calls; fixes blank-preview-on-revisit bug |
| Task types | Code (editable) and MCQ (predict-the-output) | Pages can mix both; MCQ "Reveal answer" runs the code, so the reveal is also a visual demonstration |
