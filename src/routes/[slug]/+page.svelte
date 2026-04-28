<script>
  import { page } from '$app/stores';
  import ExerciseShell from '$lib/ExerciseShell.svelte';
  import { findExercise } from '../../exercises/index.js';
  import { base } from '$app/paths';

  $: result = findExercise($page.params.slug);
</script>

{#if result}
  <ExerciseShell
    exercise={result.exercise}
    prev={result.prev}
    next={result.next}
    index={result.index}
    total={result.total}
  />
{:else}
  <div class="missing">
    <h1>Exercise not found</h1>
    <p>No exercise with id "{$page.params.slug}".</p>
    <a href="{base}/">← Back to overview</a>
  </div>
{/if}

<style>
  .missing { padding: var(--s-7) var(--s-6); max-width: 600px; margin: 0 auto; }
</style>
