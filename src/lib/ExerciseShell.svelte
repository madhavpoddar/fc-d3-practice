<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { browser } from '$app/environment';
  import { marked } from 'marked';
  import CodeTaskBlock from './CodeTaskBlock.svelte';
  import McqTaskBlock from './McqTaskBlock.svelte';
  import { getTaskProgress, markExerciseCompleted, setLastVisited } from './progress.js';

  /** Normalized exercise: { id, title, preTask, postTask, tasks: [...] } */
  export let exercise;
  /** @type {{id: string, title: string}|null} */ export let prev = null;
  /** @type {{id: string, title: string}|null} */ export let next = null;
  /** @type {number} */ export let index = 0;
  /** @type {number} */ export let total = 0;

  // Index up to which tasks are unlocked (exclusive upper bound).
  // unlockedUpTo = 0 means only task[0] is unlocked.
  // unlockedUpTo = 1 means tasks[0] and tasks[1] are unlocked. Etc.
  let unlockedUpTo = 0;

  onMount(() => {
    setLastVisited(exercise.id);
    if (browser) {
      for (let i = 0; i < exercise.tasks.length; i++) {
        const task = exercise.tasks[i];
        const p = getTaskProgress(exercise.id, task.id);
        const wasSubmitted = task.type === 'mcq' ? !!p.revealed : !!p.submitted;
        if (wasSubmitted) {
          unlockedUpTo = i + 1;
        } else {
          break;
        }
      }
    }
  });

  function onTaskSubmit(taskIndex) {
    if (taskIndex + 1 > unlockedUpTo) {
      unlockedUpTo = taskIndex + 1;
    }
  }

  function markCompleteAndGoNext() {
    markExerciseCompleted(exercise.id, true);
    if (next) goto(`${base}/${next.id}`);
    else goto(`${base}/`);
  }
  function goPrev() { if (prev) goto(`${base}/${prev.id}`); }

  $: preTaskHtml  = exercise.preTask  ? marked.parse(exercise.preTask)  : '';
  $: postTaskHtml = exercise.postTask ? marked.parse(exercise.postTask) : '';
</script>

<article class="exercise">
  <header class="ex-header">
    <div class="meta">
      <span class="step">Page {index + 1} of {total}</span>
      <h1>{exercise.title}</h1>
    </div>
    <nav class="nav">
      <button class="ghost" on:click={goPrev} disabled={!prev} title={prev?.title ?? ''}>← Previous</button>
      <button class="primary" on:click={markCompleteAndGoNext}>{next ? 'Next →' : 'Finish'}</button>
    </nav>
  </header>

  {#if preTaskHtml}
    <section class="panel prose">{@html preTaskHtml}</section>
  {/if}

  {#each exercise.tasks as task, i (task.id)}
    {#if task.type === 'mcq'}
      <McqTaskBlock
        exerciseId={exercise.id}
        {task}
        index={i}
        locked={i > unlockedUpTo}
        on:submit={() => onTaskSubmit(i)}
      />
    {:else}
      <CodeTaskBlock
        exerciseId={exercise.id}
        {task}
        index={i}
        locked={i > unlockedUpTo}
        on:submit={() => onTaskSubmit(i)}
      />
    {/if}
  {/each}

  {#if postTaskHtml}
    <section class="panel prose">{@html postTaskHtml}</section>
  {/if}

  <div class="bottom-nav">
    <button class="ghost" on:click={goPrev} disabled={!prev}>← Previous</button>
    <button class="primary" on:click={markCompleteAndGoNext}>{next ? 'Next →' : 'Finish'}</button>
  </div>
</article>

<style>
  .exercise {
    display: flex; flex-direction: column;
    gap: var(--s-5);
    padding: var(--s-5) var(--s-6);
    max-width: 1400px;
    margin: 0 auto;
  }
  .ex-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: var(--s-5);
  }
  .meta .step {
    font-size: 13px; color: var(--c-ink-mute);
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .meta h1 { margin-top: 4px; }
  .nav, .bottom-nav { display: flex; gap: var(--s-2); }
  .bottom-nav { justify-content: flex-end; padding-top: var(--s-3); border-top: 1px solid var(--c-line); }
  .panel {
    background: var(--c-surface);
    border: 1px solid var(--c-line);
    border-radius: var(--radius-lg);
    padding: var(--s-5);
  }
</style>
