<script>
  import { onMount, onDestroy, tick, createEventDispatcher } from 'svelte';
  import { marked } from 'marked';
  import { base } from '$app/paths';
  import { browser } from '$app/environment';
  import CodeEditor from './CodeEditor.svelte';
  import Preview from './Preview.svelte';
  import { getTaskProgress, updateTaskProgress } from './progress.js';
  import { downloadStandaloneHtml } from './buildStandalone.js';

  /** @type {string} */ export let exerciseId;
  /** @type {{ id: string, title?: string, description?: string, starterCode: string, lockedRanges?: any[], hint?: string, solution?: string|string[], autorun?: boolean, iframe?: any, check?: Function }} */
  export let task;
  /** @type {number} */ export let index = 0;
  /** @type {boolean} */ export let locked = false;

  const dispatch = createEventDispatcher();

  const savedAtInit = browser ? getTaskProgress(exerciseId, task.id) : { code: null, hintRevealed: false, submitted: false };
  let code = savedAtInit.code != null ? savedAtInit.code : task.starterCode;
  let hintRevealed = !!savedAtInit.hintRevealed;
  let submitted = !!savedAtInit.submitted;

  let editor;
  let preview;
  let autorunTimer = null;
  let saveTimer = null;

  onMount(async () => {
    await tick();
    runPreview();
  });

  onDestroy(() => {
    clearTimeout(autorunTimer);
    clearTimeout(saveTimer);
  });

  function onCodeChange(e) {
    code = e.detail.value;
    clearTimeout(autorunTimer);
    autorunTimer = setTimeout(runPreview, 400);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      updateTaskProgress(exerciseId, task.id, { code });
    }, 250);
  }

  function runPreview() { preview?.run(code); }

  function reset() {
    code = task.starterCode;
    submitted = false;
    updateTaskProgress(exerciseId, task.id, { code: null, submitted: false });
    runPreview();
  }

  function showHint() {
    hintRevealed = true;
    updateTaskProgress(exerciseId, task.id, { hintRevealed: true });
  }

  function handleSubmit() {
    submitted = true;
    // everSubmitted is never cleared by Reset — it guards task unlocking in ExerciseShell.
    updateTaskProgress(exerciseId, task.id, { submitted: true, everSubmitted: true });
    dispatch('submit');
  }

  function downloadHtml() {
    const baseHref = `${window.location.origin}${base}/`;
    downloadStandaloneHtml(
      { title: `${exerciseId} · ${task.title || 'task'}`, code, bodyHtml: iframeBody, extraCss: iframeCss, baseHref },
      `${exerciseId}__${task.id}.html`
    );
  }

  function downloadSolutionHtml(sol, si) {
    const baseHref = `${window.location.origin}${base}/`;
    const suffix = solutions.length > 1 ? `_solution_${si + 1}` : '_solution';
    downloadStandaloneHtml(
      { title: `${exerciseId} · ${task.title || 'task'} · solution`, code: sol, bodyHtml: iframeBody, extraCss: iframeCss, baseHref },
      `${exerciseId}__${task.id}${suffix}.html`
    );
  }

  $: iframeWidth  = task.iframe?.width  ?? 600;
  $: iframeHeight = task.iframe?.height ?? 400;
  $: iframeBody   = task.iframe?.html   ?? '<svg id="chart" width="600" height="400"></svg>';
  $: iframeCss    = task.iframe?.extraCSS ?? '';
  $: descriptionHtml = task.description ? marked.parse(task.description) : '';
  $: solutionNoteHtml = task.solutionNote ? marked.parse(task.solutionNote) : '';
  $: solutions = Array.isArray(task.solution)
    ? task.solution
    : task.solution ? [task.solution] : [];
</script>

{#if locked}
  <section class="task task-locked">
    <div class="task-title">
      <span class="task-num">Task {index + 1}</span>
      <span>{task.title || ''}</span>
    </div>
  </section>
{:else}
  <section class="task">
    {#if task.title}
      <h3 class="task-title">
        <span class="task-num">Task {index + 1}</span>
        {task.title}
      </h3>
    {/if}

    {#if descriptionHtml}
      <div class="task-desc prose">{@html descriptionHtml}</div>
    {/if}

    <div class="workspace">
      <div class="pane editor-pane">
        <div class="editor-toolbar">
          <button class="ghost small" on:click={reset} title="Reset to starter code">↺ Reset</button>
        </div>
        <div class="editor-host">
          <CodeEditor
            bind:this={editor}
            value={code}
            lockedRanges={task.lockedRanges ?? []}
            on:change={onCodeChange}
          />
        </div>
      </div>

      <div class="pane preview-pane">
        <div class="iframe-wrap">
          <Preview
            bind:this={preview}
            {code}
            bodyHtml={iframeBody}
            extraCss={iframeCss}
            width={iframeWidth}
            height={iframeHeight}
          />
          <button class="dl-btn" on:click={downloadHtml} title="Download as standalone HTML"><svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="2" x2="8" y2="10"/><polyline points="5,7 8,10 11,7"/><line x1="3" y1="13" x2="13" y2="13"/></svg></button>
        </div>
      </div>
    </div>

    <div class="task-actions">
      <button class="submit-btn" on:click={handleSubmit} disabled={submitted}>Submit</button>
      {#if task.hint && !hintRevealed}
        <button class="ghost" on:click={showHint}>Show hint</button>
      {/if}
    </div>

    {#if hintRevealed && task.hint}
      <div class="hint"><strong>Hint:</strong> {task.hint}</div>
    {/if}

    {#if submitted && solutions.length > 0}
      <div class="solution-section">
        <div class="solution-header">
          <strong>Sample solution{solutions.length > 1 ? 's' : ''}</strong>
          <p class="verify-note">Check if your code/output looks similar. Note: there are often multiple valid approaches.</p>
        </div>
        {#each solutions as sol, si}
          {#if solutions.length > 1}
            <div class="sol-label">Solution {si + 1}</div>
          {/if}
          <div class="sol-block">
            <div class="sol-editor-wrap">
              <CodeEditor value={sol} readOnly={true} lockedRanges={[{ from: 1, to: 9999 }]} />
            </div>
            <div class="sol-preview-wrap">
              <div class="iframe-wrap">
                <Preview
                  code={sol}
                  bodyHtml={iframeBody}
                  extraCss={iframeCss}
                  width={iframeWidth}
                  height={iframeHeight}
                />
                <button class="dl-btn" on:click={() => downloadSolutionHtml(sol, si)} title="Download as standalone HTML"><svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="2" x2="8" y2="10"/><polyline points="5,7 8,10 11,7"/><line x1="3" y1="13" x2="13" y2="13"/></svg></button>
              </div>
            </div>
          </div>
        {/each}
        {#if solutionNoteHtml}
          <div class="solution-note prose">{@html solutionNoteHtml}</div>
        {/if}
      </div>
    {/if}
  </section>
{/if}

<style>
  .task-locked {
    background: var(--c-surface);
    border: 1px dashed var(--c-line);
    border-radius: var(--radius-lg);
    padding: var(--s-4) var(--s-5);
    opacity: 0.55;
  }
  .task-locked .task-title {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    font-size: 16px;
    font-weight: 600;
    color: var(--c-ink-soft);
    margin: 0;
  }

  .task {
    background: var(--c-surface);
    border: 1px solid var(--c-line);
    border-radius: var(--radius-lg);
    padding: var(--s-5);
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
  }
  .task-title {
    display: flex;
    align-items: baseline;
    gap: var(--s-3);
    margin: 0;
  }
  .task-num {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--c-ink-mute);
    padding: 2px 8px;
    border-radius: 4px;
    background: var(--c-surface-2);
    white-space: nowrap;
  }
  .task-desc { font-size: 14.5px; }

  .workspace {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--s-4);
    min-height: 440px;
  }
  .pane { display: flex; flex-direction: column; gap: var(--s-2); min-width: 0; }

  .editor-toolbar {
    display: flex;
    justify-content: flex-end;
  }
  .small { font-size: 13px; padding: 5px 10px; }
  .editor-host { flex: 1; min-height: 400px; }

  .preview-pane {
    display: flex;
    flex-direction: column;
  }
  .iframe-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 100%;
  }
  .dl-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.93);
    border: 1.5px solid var(--c-line);
    border-radius: var(--radius-sm);
    padding: 7px 9px;
    line-height: 0;
    cursor: pointer;
    color: var(--c-ink-soft);
    opacity: 0.85;
    transition: opacity 0.15s, border-color 0.15s, color 0.15s;
    z-index: 10;
    box-shadow: 0 1px 4px rgba(0,0,0,0.14);
  }
  .dl-btn svg { display: block; width: 18px; height: 18px; }
  .dl-btn:hover { opacity: 1; border-color: var(--c-primary); color: var(--c-primary); }

  .task-actions {
    display: flex;
    align-items: center;
    gap: var(--s-2);
  }
  .submit-btn {
    background: var(--c-good);
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: filter 0.12s, opacity 0.2s;
  }
  .submit-btn:hover:not(:disabled) { filter: brightness(0.92); }
  .submit-btn:disabled { opacity: 0.35; cursor: default; }

  .hint {
    background: #fff7e0;
    border: 1px solid var(--c-accent-2);
    border-radius: var(--radius);
    padding: var(--s-3) var(--s-4);
    font-size: 14px;
  }

  .solution-section {
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
    padding-top: var(--s-4);
    border-top: 1px solid var(--c-line);
  }
  .solution-note {
    padding: var(--s-3) var(--s-4);
    background: var(--c-surface-2);
    border-radius: var(--radius);
    font-size: 14px;
  }
  .solution-header strong { font-size: 15px; }
  .verify-note {
    margin: var(--s-1) 0 0;
    font-size: 13.5px;
    color: var(--c-ink-soft);
  }
  .sol-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--c-ink-mute);
  }
  .sol-block {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--s-4);
    min-height: 360px;
  }
  .sol-editor-wrap { min-width: 0; height: 360px; border-radius: var(--radius); overflow: hidden; }
  .sol-preview-wrap { min-width: 0; display: flex; flex-direction: column; }

  @media (max-width: 1024px) {
    .workspace, .sol-block { grid-template-columns: 1fr; }
  }
</style>
