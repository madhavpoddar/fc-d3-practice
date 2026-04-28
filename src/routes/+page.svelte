<script>
  import { base } from '$app/paths';
  import { exercises } from '../exercises/index.js';
  import { onMount } from 'svelte';
  import { readState } from '$lib/progress.js';

  let progress = { exercises: {}, lastVisited: null };
  onMount(() => { progress = readState(); });

  function statusFor(id) {
    const p = progress.exercises[id];
    if (p?.completed) return 'done';
    const tasks = p?.tasks ?? {};
    if (Object.values(tasks).some((t) => t?.code != null || t?.hintRevealed)) return 'started';
    return 'todo';
  }

  function taskCount(ex) {
    return ex.tasks?.length ?? 1;
  }
</script>

<section class="landing">
  <div class="hero">
    <h1>D3 Practice Tasks</h1>
    <p class="lede">
      A short, hands-on tour of D3.js. You will edit, fix, and predict the output of small code snippets — and build up to a custom data visualization. About <strong>90 minutes</strong>.
    </p>
    <p class="lede">
      Your progress is saved in this browser. You can export it as a JSON file from the <em>Session</em> menu and load it on another computer.
    </p>
  </div>

  <h2>Exercises</h2>
  <ol class="list">
    {#each exercises as ex, i}
      {@const status = statusFor(ex.id)}
      <li>
        <a class="row {status}" href="{base}/{ex.id}">
          <span class="num">{String(i + 1).padStart(2, '0')}</span>
          <span class="title">{ex.title}</span>
          <span class="tasks">{taskCount(ex) > 1 ? `${taskCount(ex)} tasks` : ''}</span>
          <span class="status">{status === 'done' ? '✓ Done' : status === 'started' ? 'In progress' : ''}</span>
        </a>
      </li>
    {/each}
  </ol>

  <p class="footnote">Built for <em>Grundlagen der Informationsvisualisierung</em>, University of Bamberg.</p>
</section>

<style>
  .landing {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--s-7) var(--s-5);
  }
  .hero { margin-bottom: var(--s-7); }
  .hero h1 { font-size: 40px; margin-bottom: var(--s-3); }
  .lede { font-size: 17px; color: var(--c-ink-soft); max-width: 60ch; }
  h2 { margin-top: var(--s-6); margin-bottom: var(--s-3); }
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
    grid-template-columns: 48px 1fr auto auto;
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
  .tasks {
    font-size: 12px;
    color: var(--c-ink-mute);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .row:hover { border-color: var(--c-primary); transform: translateX(2px); }
  .num {
    font-family: var(--font-mono);
    color: var(--c-ink-mute);
    font-size: 14px;
  }
  .title { font-weight: 500; }
  .status { font-size: 13px; color: var(--c-ink-soft); }
  .row.done .num { color: var(--c-good); }
  .footnote {
    margin-top: var(--s-7);
    color: var(--c-ink-mute);
    font-size: 13px;
  }
</style>
