<script>
  import { base } from '$app/paths';
  import { exercises } from '../exercises/index.js';
  import { afterNavigate } from '$app/navigation';
  import { readState } from '$lib/progress.js';

  let progress = readState();
  afterNavigate(() => { progress = readState(); });

  function taskDots(ex) {
    const exP = progress.exercises[ex.id];
    return ex.tasks.map(task => {
      const t = exP?.tasks?.[task.id];
      if (!t) return 'todo';
      if (task.type === 'mcq') return t.revealed ? 'done' : (t.selectedAnswer ? 'started' : 'todo');
      if (exP?.completed || t.submitted || t.everSubmitted) return 'done';
      if (t.code != null || t.hintRevealed) return 'started';
      return 'todo';
    });
  }
</script>

<section class="landing">
  <div class="hero">
    <h1>D3 Practice Tasks</h1>
    <p class="lede">
      A short, hands-on introduction to D3.js. You will edit, fix, and predict the output of small code snippets — practising core concepts like data binding, scales, and loading external data. About <strong>90 minutes</strong>.
    </p>
    <p class="lede">
      Your progress is saved in this browser. You can export it as a JSON file from the <em>Session</em> menu and load it on another computer.
    </p>
  </div>

  <ol class="list">
    {#each exercises as ex, i}
      <li>
        <a class="row" href="{base}/{ex.id}">
          <span class="num">{String(i + 1).padStart(2, '0')}</span>
          <span class="title">{ex.title}</span>
          <span class="task-dots">
            {#each taskDots(ex) as s}
              <span class="dot {s}"></span>
            {/each}
          </span>
        </a>
      </li>
    {/each}
  </ol>

  <div class="footnote">
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <rect x="1"  y="7"   width="4" height="10" rx="1"/>
      <rect x="5"  y="9.5" width="2" height="5"  rx="0.5"/>
      <rect x="7"  y="11"  width="10" height="2"/>
      <rect x="17" y="9.5" width="2" height="5"  rx="0.5"/>
      <rect x="19" y="7"   width="4" height="10" rx="1"/>
    </svg>
    <div class="footnote-lines">
      <span>Grundlagen der Informationsvisualisierung &middot; University of Bamberg</span>
      <span>Summer Semester 2026 &middot; Madhav Poddar, Leah Mühlöder, Prof. Dr. Fabian Beck</span>
    </div>
  </div>
</section>

<style>
  .landing {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--s-7) var(--s-5);
  }
  .hero { margin-bottom: var(--s-7); }
  .hero h1 { font-size: 40px; margin-bottom: var(--s-3); }
  .lede { font-size: 17px; color: var(--c-ink-soft); }
  /* Exercise list */
  .list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .row {
    display: grid;
    grid-template-columns: 48px 1fr auto;
    gap: var(--s-4);
    align-items: center;
    padding: var(--s-4);
    border: 1px solid var(--c-line);
    border-radius: var(--radius);
    background: var(--c-surface);
    text-decoration: none;
    color: var(--c-ink);
    transition: border-color 0.15s, transform 0.06s;
  }
  .row:hover { border-color: var(--c-primary); transform: translateX(2px); }
  .num {
    font-family: var(--font-mono);
    color: var(--c-ink-mute);
    font-size: 14px;
  }
  .title { font-weight: 500; }

  /* Per-task dot strip */
  .task-dots {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    border: 1.5px solid var(--c-line);
    background: var(--c-surface-2);
    transition: background 0.2s, border-color 0.2s;
  }
  .dot.started { background: var(--c-accent-2); border-color: var(--c-accent-2); }
  .dot.done    { background: var(--c-good);     border-color: var(--c-good); }

  .footnote {
    margin-top: var(--s-7);
    display: flex;
    align-items: center;
    gap: var(--s-3);
    color: var(--c-ink-mute);
    font-size: 13px;
  }
  .footnote svg { flex-shrink: 0; }
  .footnote-lines { display: flex; flex-direction: column; gap: 2px; }
</style>
