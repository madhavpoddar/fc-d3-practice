# D3 Practice Tasks — Project Reference

A multi-page interactive web app for teaching D3.js basics in a single ~90-minute session. Built for **Grundlagen der Informationsvisualisierung** at the University of Bamberg (instructor: Madhav Poddar, supervised by Prof. Dr. Fabian Beck). Deployed via GitHub Pages.

---

## Learner profile

**Prior sessions:** E01 (HTML/SVG/CSS/JS DOM) and E02 (d3.select, .attr(), `.data().enter().append()`, scaleLinear, basic bar chart).

**Assumed gaps:** arrow functions may be shaky; only `scaleLinear` seen; no axes, no external data loading, no path generators.

**Target outcome:** students capable of building a static custom visualization.

**Constraint:** always use `.data().enter().append()` — that is what students learned. Never use `.join()`.

---

## Curriculum

9 pages, ~90 minutes, linear navigation with skip option.

| # | Slug | Title | Tasks |
|---|---|---|---|
| 0 | `/` | Landing page | — |
| 1 | `/drawing-order` | Bull's Eye | 3 — MCQ predict; reorder; repeat |
| 2 | `/bar-orientation` | Raising the Bar | 2 — bottom-up; horizontal |
| 3 | `/scaling-it-up` | Scaling it up | 3 — add y-scale; d3.extent; scaleBand |
| 4 | `/axes` | Striving for Axe-llency | 3 — add axes; .nice(); axis label |
| 5 | `/color-by-category` | Color by Category | 1 — scaleOrdinal + schemeTableau10 |
| 6 | `/group-per-datum` | Group / Translate / Transform | 1 — refactor to `<g>` with translate |
| 7 | `/load-and-behold` | Load and Behold | 3 — fix `d` bug; load CSV; MCQ read console |
| 8 | `/smiley` | The Smiley | 4 — face; eyes; mouth; encode rating |
| 9 | `/bonus` | Bonus: encode box office | 1 — open-ended, sizeScale |

Pages 1–4 use the margin convention. Pages 5–9 use direct SVG coordinates (`range([30, 570])` etc.) — no margin object.

**Off-curriculum files on disk** (do not delete): `line-chart.js`, `two-scales.js`, `data-as-objects.js`, `loading-data.js`, `scaleband.js`, plus `.bak.js` backups.

---

## Dataset

12 movies, used throughout. Field names: `title`, `genre`, `runtime`, `rating`, `boxOffice`.

```js
{ title: "The Grand Budapest Hotel", genre: "Comedy",    runtime: 99,  rating: 8.1, boxOffice: 175  }
{ title: "Get Out",                  genre: "Horror",    runtime: 104, rating: 7.7, boxOffice: 255  }
{ title: "Coco",                     genre: "Animation", runtime: 105, rating: 8.4, boxOffice: 807  }
{ title: "Mad Max: Fury Road",       genre: "Action",    runtime: 120, rating: 8.1, boxOffice: 375  }
{ title: "La La Land",               genre: "Drama",     runtime: 128, rating: 8.0, boxOffice: 446  }
{ title: "Knives Out",               genre: "Mystery",   runtime: 130, rating: 7.9, boxOffice: 311  }
{ title: "Parasite",                 genre: "Thriller",  runtime: 132, rating: 8.5, boxOffice: 258  }
{ title: "Everything Everywhere All at Once", genre: "Sci-Fi", runtime: 139, rating: 7.8, boxOffice: 72 }
{ title: "Inception",                genre: "Sci-Fi",    runtime: 148, rating: 8.8, boxOffice: 836  }
{ title: "The Dark Knight",          genre: "Action",    runtime: 152, rating: 9.0, boxOffice: 1005 }
{ title: "Interstellar",             genre: "Sci-Fi",    runtime: 169, rating: 8.6, boxOffice: 773  }
{ title: "Oppenheimer",              genre: "Drama",     runtime: 180, rating: 8.3, boxOffice: 952  }
```

Scatterplot mapping: x = runtime, y = rating, color = genre, glyph expression = rating, bonus = box office → size.

---

## Exercise config schema

Each page is a plain `.js` file in `src/exercises/`. Add a page: create the file, import it in `index.js`, append to the array.

```js
export default {
  id: 'my-exercise',       // URL slug
  title: 'My Exercise',
  preTask:  `Markdown shown above all tasks.`,
  postTask: `Markdown shown below all tasks.`,
  tasks: [
    // CODE TASK (default type)
    {
      id: 'task-1',
      title: 'Fix the bug',
      description: `Markdown shown above the editor.`,
      starterCode: `...`,
      lockedRanges: [{ from: 1, to: 10 }],  // 1-based, inclusive line numbers
      hint: 'One-sentence hint.',
      solution: `...`,           // or array of strings for multiple solutions
      iframe: {
        width: 600, height: 400,            // optional, defaults shown
        html: '<svg id="chart" .../>',      // optional body markup
        extraCSS: ''                        // optional CSS
      },
      check: (doc) => doc.querySelector('#chart rect') !== null  // optional
    },
    // MCQ TASK
    {
      id: 'task-2',
      type: 'mcq',
      title: 'Predict the output',
      description: `The question.`,
      options: [{ value: 'a', label: '1' }, { value: 'b', label: '2' }],
      correctAnswer: 'b',
      explanation: `Markdown shown after reveal.`,
      starterCode: `...`,        // shown read-only; runs in preview on Submit
      previewImmediately: false, // set true to show preview before Submit
      iframe: { /* same */ }
    }
  ]
};
```

`lockedRanges` lock lines visually (lavender background) and block edits. Always leave at least one unlocked line as an edit zone between two locked ranges. Line numbers are 1-based.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | SvelteKit (Svelte 5, legacy syntax), `prerender=true, ssr=false` |
| Deployment | `adapter-static` → GitHub Pages |
| D3 | v7 via `<script src="https://d3js.org/d3.v7.min.js">` in iframe; ESM from jsdelivr in standalone exports |
| Code editor | CodeMirror 6 — locked ranges via `changeFilter`, ligatures disabled |
| Markdown | `marked` |
| Progress | `localStorage` only — export/import/clear as JSON |
| Styling | Manrope (sans) + JetBrains Mono (code); navy primary, coral/mustard accents |

---

## Directory structure

```
src/
  routes/
    +page.svelte          # Landing page
    +layout.svelte        # Topbar + session menu
    +layout.js            # prerender + ssr config
    [slug]/
      +page.svelte        # Exercise renderer (ExerciseShell)
      +page.js            # entries() for prerenderer
  exercises/
    index.js              # Registry — imports, normalize(), findExercise()
    drawing-order.js
    bar-orientation.js
    scaling-it-up.js
    axes.js
    color-by-category.js
    group-per-datum.js
    load-and-behold.js
    smiley.js
    bonus.js
  lib/
    ExerciseShell.svelte  # preTask + task blocks + postTask + nav
    CodeTaskBlock.svelte  # editor + autorun + hint + submit/solution + download
    McqTaskBlock.svelte   # options + read-only code + preview on submit
    CodeEditor.svelte     # CodeMirror 6 wrapper (locked ranges, readOnly)
    Preview.svelte        # Sandboxed iframe; run-ID nonce prevents stale errors
    SessionMenu.svelte    # Export / Import / Clear (click-outside to close)
    buildStandalone.js    # Produces downloadable standalone HTML
    progress.js           # localStorage helpers
static/data/
  movies.csv
  movies.json
```

---

## Key behaviours

**Code task flow:** code auto-runs 400 ms after each keystroke. Reset ↺ restores starter code and hides the solution. "Show hint" reveals a hint banner. "Submit" reveals the sample solution (read-only editor + live preview); Submit is disabled after use and re-enabled by Reset.

**MCQ flow:** options + read-only code shown; preview hidden until Submit. Submit locks options and shows correct/wrong feedback + explanation + preview.

**iframe:** `sandbox="allow-scripts"`, `srcdoc` set imperatively. Each `run()` call increments a run-ID embedded in the iframe script; `postMessage` errors from stale runs are discarded. `<base>` tag makes `d3.csv("data/movies.csv")` resolve against the app origin.

**Standalone export:** self-contained HTML with D3 v7 as ESM, `window.d3` shim, and a `<base>` tag. Filename: `<exerciseId>__<taskId>.html`.

**Out of scope:** transitions, mouse events, tooltips, mobile, accessibility, backend.
