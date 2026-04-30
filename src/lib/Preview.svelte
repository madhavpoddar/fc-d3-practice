<script module>
  // Shared across all Preview instances — guarantees unique run IDs so an
  // error postMessage from one iframe never matches another instance's runId.
  let nextRunId = 0;
</script>

<script>
  import { onMount, onDestroy } from 'svelte';
  import { base } from '$app/paths';

  /** Student JS code to run inside the iframe. */
  export let code = '';
  /** Optional HTML body to include before the script tag (e.g. pre-existing SVG). */
  export let bodyHtml = '<svg id="chart" width="600" height="400"></svg>';
  /** Optional per-exercise extra CSS for the iframe body. */
  export let extraCss = '';
  /** Iframe display size — content can be larger; iframe scrolls. */
  export let width = 600;
  export let height = 400;

  /** @type {HTMLIFrameElement} */ let iframe;
  /** @type {{message: string, line?: number}|null} */ let runtimeError = null;
  let currentRunId = 0;

  function buildSrcdoc(userCode, runId) {
    const safeCode = userCode ?? '';
    const baseHref = typeof window !== 'undefined'
      ? `${window.location.origin}${base}/`
      : '/';
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<base href="${baseHref}">
<script src="https://d3js.org/d3.v7.min.js"><\/script>
<style>
  body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; margin: 16px; color: #1f2540; }
  svg { background: #ffffff; }
  ${extraCss}
<\/style>
<\/head>
<body>
${bodyHtml}
<script>
var __runId = ${runId};
window.addEventListener('error', function(e) {
  parent.postMessage({ __d3p: true, runId: __runId, type: 'error', message: e.message, line: e.lineno }, '*');
});
window.addEventListener('unhandledrejection', function(e) {
  parent.postMessage({ __d3p: true, runId: __runId, type: 'error', message: 'Unhandled promise rejection: ' + (e.reason && e.reason.message || e.reason) }, '*');
});
try {
${safeCode}
} catch (err) {
  parent.postMessage({ __d3p: true, runId: __runId, type: 'error', message: err.message, line: err.lineNumber }, '*');
}
<\/script>
<\/body>
<\/html>`;
  }

  function handleMessage(event) {
    if (!event?.data || event.data.__d3p !== true) return;
    if (event.data.runId !== currentRunId) return;
    if (event.data.type === 'error') {
      runtimeError = { message: event.data.message, line: event.data.line };
    }
  }

  onMount(() => {
    window.addEventListener('message', handleMessage);
    // Initial render — set srcdoc imperatively. We deliberately do NOT bind
    // srcdoc reactively to `code`, because that races with the imperative
    // run() call from the parent's onMount: setting srcdoc on an iframe
    // restarts its document, and two writes in the same microtask can leave
    // the iframe blank.
    run(code);
  });
  onDestroy(() => {
    window.removeEventListener('message', handleMessage);
  });

  /** Public method: re-render iframe with current code.
   *  Pass `latestCode` explicitly to avoid any prop-propagation lag from the parent. */
  export function run(latestCode) {
    runtimeError = null;
    currentRunId = ++nextRunId;
    const useCode = latestCode != null ? latestCode : code;
    if (iframe) iframe.srcdoc = buildSrcdoc(useCode, currentRunId);
  }
</script>

<div class="preview">
  <iframe
    bind:this={iframe}
    title="Preview"
    sandbox="allow-scripts"
  ></iframe>
  {#if runtimeError}
    <div class="error">
      <strong>Runtime error{runtimeError.line ? ` (line ${runtimeError.line})` : ''}:</strong>
      {runtimeError.message}
    </div>
  {/if}
</div>

<style>
  .preview {
    display: flex;
    flex-direction: column;
    gap: var(--s-2);
    flex: 1;
    overflow: auto;
  }
  iframe {
    flex: 1;
    width: 100%;
    border: 1px solid var(--c-line);
    border-radius: var(--radius);
    background: white;
    max-width: 100%;
  }
  .error {
    background: #fff1ee;
    border: 1px solid var(--c-bad);
    color: var(--c-bad);
    border-radius: var(--radius);
    padding: var(--s-3) var(--s-4);
    font-size: 13.5px;
    font-family: var(--font-mono);
  }
</style>
