<script>
  import { createEventDispatcher } from 'svelte';
  import { diffLines } from 'diff';

  /** @type {string} */ export let original = '';
  /** @type {string} */ export let solution = '';
  export let open = false;

  const dispatch = createEventDispatcher();

  function close() { dispatch('close'); }
  function apply() { dispatch('apply'); }

  // diffLines returns an array of { value, added, removed, count } chunks.
  // Build two parallel arrays of { lines: string[], status: 'unchanged'|'added'|'removed' }.
  $: originalLines = renderSide(diffLines(original, solution), 'left');
  $: solutionLines = renderSide(diffLines(original, solution), 'right');

  function renderSide(diff, side) {
    const out = [];
    for (const part of diff) {
      const lines = part.value.replace(/\n$/, '').split('\n');
      const status = part.added ? 'added' : part.removed ? 'removed' : 'unchanged';
      // Left side shows unchanged + removed; right side shows unchanged + added.
      if (side === 'left' && part.added) continue;
      if (side === 'right' && part.removed) continue;
      for (const line of lines) {
        out.push({ line, status });
      }
    }
    return out;
  }
</script>

{#if open}
  <div class="overlay" on:click={close} role="presentation">
    <div class="modal" on:click|stopPropagation role="dialog" aria-label="Solution comparison">
      <header>
        <h2>Compare with starter code</h2>
        <button class="ghost" on:click={close} aria-label="Close">×</button>
      </header>

      <div class="cols">
        <section class="col">
          <div class="col-label">Original starter</div>
          <pre>
{#each originalLines as l, i}<span class="line {l.status}"><span class="ln">{i + 1}</span><span class="code">{l.line || ' '}</span></span>{/each}
          </pre>
        </section>
        <section class="col">
          <div class="col-label">Solution</div>
          <pre>
{#each solutionLines as l, i}<span class="line {l.status}"><span class="ln">{i + 1}</span><span class="code">{l.line || ' '}</span></span>{/each}
          </pre>
        </section>
      </div>

      <footer>
        <button class="ghost" on:click={close}>Close</button>
        <button class="primary" on:click={apply}>Apply solution to my editor</button>
      </footer>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed; inset: 0;
    background: rgba(31, 37, 64, 0.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
    padding: var(--s-5);
  }
  .modal {
    background: var(--c-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-2);
    width: min(1200px, 95vw);
    max-height: 90vh;
    display: flex; flex-direction: column;
  }
  header {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--s-4) var(--s-5);
    border-bottom: 1px solid var(--c-line);
  }
  header h2 { font-size: 18px; }
  header button { font-size: 24px; line-height: 1; padding: 0 8px; }

  .cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--c-line);
    overflow: auto;
    flex: 1;
  }
  .col {
    background: var(--c-surface);
    display: flex; flex-direction: column;
    min-width: 0;
  }
  .col-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--c-ink-mute);
    padding: var(--s-3) var(--s-4);
    background: var(--c-surface-2);
    border-bottom: 1px solid var(--c-line);
  }
  pre {
    margin: 0;
    padding: var(--s-3) 0;
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.55;
    overflow: auto;
    flex: 1;
  }
  .line {
    display: grid;
    grid-template-columns: 40px 1fr;
    align-items: baseline;
  }
  .ln {
    color: var(--c-ink-mute);
    text-align: right;
    padding-right: var(--s-2);
    user-select: none;
  }
  .code {
    white-space: pre;
    padding-right: var(--s-3);
  }
  .line.added    { background: #e7f6ec; }
  .line.added    .code { color: #1e6c34; }
  .line.removed  { background: #fdecea; }
  .line.removed  .code { color: #a02622; text-decoration: line-through; text-decoration-color: rgba(160,38,34,0.4); }

  footer {
    display: flex; justify-content: flex-end; gap: var(--s-2);
    padding: var(--s-3) var(--s-5);
    border-top: 1px solid var(--c-line);
  }
</style>
