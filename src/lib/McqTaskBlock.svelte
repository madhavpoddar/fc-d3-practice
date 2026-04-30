<script>
  import { createEventDispatcher } from 'svelte';
  import { marked } from 'marked';
  import { base } from '$app/paths';
  import { browser } from '$app/environment';
  import CodeEditor from './CodeEditor.svelte';
  import Preview from './Preview.svelte';
  import { getTaskProgress, updateTaskProgress } from './progress.js';
  import { downloadStandaloneHtml } from './buildStandalone.js';

  /** @type {string} */ export let exerciseId;
  export let task;
  /** @type {number} */ export let index = 0;
  /** @type {boolean} */ export let locked = false;

  const dispatch = createEventDispatcher();

  const savedAtInit = browser
    ? getTaskProgress(exerciseId, task.id)
    : { selectedAnswer: null, revealed: false };
  let selectedAnswer = savedAtInit.selectedAnswer ?? null;
  let revealed = !!savedAtInit.revealed;

  function pickAnswer(value) {
    if (revealed) return;
    selectedAnswer = value;
    updateTaskProgress(exerciseId, task.id, { selectedAnswer: value });
  }

  function handleSubmit() {
    if (!selectedAnswer) return;
    revealed = true;
    updateTaskProgress(exerciseId, task.id, { revealed: true });
    dispatch('submit');
  }

  function downloadHtml() {
    const baseHref = `${window.location.origin}${base}/`;
    downloadStandaloneHtml(
      {
        title: `${exerciseId} · ${task.title || 'task'}`,
        code: task.starterCode,
        bodyHtml: iframeBody,
        extraCss: iframeCss,
        baseHref
      },
      `${exerciseId}__${task.id}.html`
    );
  }

  $: iframeWidth  = task.iframe?.width  ?? 600;
  $: iframeHeight = task.iframe?.height ?? 400;
  $: iframeBody   = task.iframe?.html   ?? '<svg id="chart" width="600" height="400"></svg>';
  $: iframeCss    = task.iframe?.extraCSS ?? '';
  $: descriptionHtml = task.description ? marked.parse(task.description) : '';
  $: explanationHtml = task.explanation ? marked.parse(task.explanation) : '';
  $: correctOption = task.options?.find((o) => o.value === task.correctAnswer);
  $: isCorrect = revealed && selectedAnswer === task.correctAnswer;
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

    <div class="options">
      {#each task.options as opt (opt.value)}
        {@const isThis = selectedAnswer === opt.value}
        {@const isAnswer = revealed && opt.value === task.correctAnswer}
        {@const isWrongPick = revealed && isThis && opt.value !== task.correctAnswer}
        <label
          class="option"
          class:selected={isThis && !revealed}
          class:correct={isAnswer}
          class:wrong={isWrongPick}
        >
          <input
            type="radio"
            name="mcq-{task.id}"
            value={opt.value}
            checked={isThis}
            on:change={() => pickAnswer(opt.value)}
            disabled={revealed}
          />
          <span class="opt-label">{opt.label}</span>
          {#if isAnswer}<span class="badge">correct</span>{/if}
          {#if isWrongPick}<span class="badge bad">your pick</span>{/if}
        </label>
      {/each}
    </div>

    <div class="workspace" class:single-pane={task.hidePreview}>
      <div class="pane code-pane">
        <div class="editor-host">
          <CodeEditor
            value={task.starterCode}
            readOnly={true}
            lockedRanges={[]}
          />
        </div>
      </div>
      {#if !task.hidePreview}
      <div class="pane preview-pane">
        {#if revealed || task.previewImmediately}
          <div class="iframe-wrap">
            <Preview
              code={task.starterCode}
              bodyHtml={iframeBody}
              extraCss={iframeCss}
              width={iframeWidth}
              height={iframeHeight}
            />
            <button class="dl-btn" on:click={downloadHtml} title="Download as standalone HTML"><svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="2" x2="8" y2="10"/><polyline points="5,7 8,10 11,7"/><line x1="3" y1="13" x2="13" y2="13"/></svg></button>
          </div>
        {:else}
          <div class="preview-placeholder">Submit to see the output</div>
        {/if}
      </div>
      {/if}
    </div>

    <div class="task-actions">
      <button
        class="submit-btn"
        on:click={handleSubmit}
        disabled={selectedAnswer == null || revealed}
      >Submit</button>
    </div>

    {#if revealed}
      <div class="feedback" class:good={isCorrect}>
        {#if isCorrect}
          <strong>Correct.</strong>
        {:else}
          <strong>Not quite — the answer is "{correctOption?.label}".</strong>
        {/if}
        {#if explanationHtml}<div class="prose explanation">{@html explanationHtml}</div>{/if}
        {#if task.explanationImage}
          <img src="{base}/{task.explanationImage}" alt="Explanation screenshot" class="explanation-img" />
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
    display: flex; flex-direction: column;
    gap: var(--s-4);
  }
  .task-title { display: flex; align-items: baseline; gap: var(--s-3); margin: 0; flex-wrap: wrap; }
  .task-num {
    font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;
    color: var(--c-ink-mute); padding: 2px 8px;
    border-radius: 4px; background: var(--c-surface-2);
    white-space: nowrap;
  }
  .task-desc { font-size: 14.5px; }

  .options {
    display: flex;
    flex-direction: column;
    gap: var(--s-2);
    max-width: 720px;
  }
  .option {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    padding: var(--s-3) var(--s-4);
    border: 1.5px solid var(--c-line);
    border-radius: var(--radius);
    background: var(--c-surface);
    cursor: pointer;
    transition: border-color 0.12s, background 0.12s;
  }
  .option:hover:not(:has(input:disabled)) { border-color: var(--c-primary); }
  .option.selected { border-color: var(--c-primary); background: rgba(43,58,85,0.04); }
  .option.correct { border-color: var(--c-good); background: #e7f6ec; }
  .option.wrong { border-color: var(--c-bad); background: #fdecea; }
  .option input { accent-color: var(--c-primary); margin: 0; }
  .opt-label { flex: 1; }
  .badge {
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em;
    background: var(--c-good); color: white;
    padding: 2px 8px; border-radius: 4px;
  }
  .badge.bad { background: var(--c-bad); }

  .workspace {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--s-4);
    min-height: 320px;
  }
  .workspace.single-pane { grid-template-columns: 1fr; max-width: 720px; }
  .pane { display: flex; flex-direction: column; gap: var(--s-2); min-width: 0; }
  .editor-host { flex: 1; min-height: 280px; }

  .preview-pane {
    display: flex;
    flex-direction: column;
  }
  .preview-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 180px;
    border: 1px dashed var(--c-line);
    border-radius: var(--radius);
    color: var(--c-ink-mute);
    font-size: 14px;
    background: var(--c-surface-2);
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
    transition: filter 0.12s;
  }
  .submit-btn:hover:not(:disabled) { filter: brightness(0.92); }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: none; }

  .feedback {
    padding: var(--s-3) var(--s-4);
    border-radius: var(--radius);
    background: #fdecea; border: 1px solid var(--c-bad); color: var(--c-bad);
  }
  .feedback.good { background: #e7f6ec; border-color: var(--c-good); color: #1e6c34; }
  .feedback strong { display: inline-block; }
  .feedback .explanation { margin-top: var(--s-2); color: var(--c-ink); }
  .explanation-img {
    display: block;
    margin-top: var(--s-3);
    max-width: 100%;
    border-radius: var(--radius);
    border: 1px solid var(--c-line);
  }

  @media (max-width: 1024px) {
    .workspace { grid-template-columns: 1fr; }
  }
</style>
