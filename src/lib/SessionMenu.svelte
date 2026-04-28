<script>
  import { exportSession, importSession, clearSession } from './progress.js';

  let open = false;
  /** @type {HTMLInputElement} */ let fileInput;
  let importStatus = '';

  function toggle() { open = !open; }
  function close() { open = false; }

  async function onImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await importSession(file);
      importStatus = 'Session imported. Reloading…';
      setTimeout(() => location.reload(), 500);
    } catch (err) {
      importStatus = `Import failed: ${err.message}`;
    } finally {
      event.target.value = '';
    }
  }

  function onClear() {
    if (confirm('Clear all local progress? This cannot be undone (export first if you want a backup).')) {
      clearSession();
      location.reload();
    }
  }
</script>

<div class="wrap" on:mouseleave={close} role="presentation">
  <button class="ghost" on:click={toggle} aria-haspopup="menu" aria-expanded={open}>
    Session ▾
  </button>
  {#if open}
    <div class="menu" role="menu">
      <button on:click={() => { exportSession(); close(); }}>Export session…</button>
      <button on:click={() => fileInput.click()}>Import session…</button>
      <button on:click={onClear}>Clear session</button>
      {#if importStatus}<div class="status">{importStatus}</div>{/if}
    </div>
  {/if}
  <input
    bind:this={fileInput}
    type="file"
    accept="application/json,.json"
    on:change={onImport}
    style="display:none"
  />
</div>

<style>
  .wrap { position: relative; display: inline-block; }
  .menu {
    position: absolute;
    right: 0;
    top: calc(100% + 4px);
    background: var(--c-surface);
    border: 1px solid var(--c-line);
    border-radius: var(--radius);
    box-shadow: var(--shadow-2);
    min-width: 200px;
    padding: 6px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .menu button {
    text-align: left;
    border: none;
    background: transparent;
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    width: 100%;
  }
  .menu button:hover { background: var(--c-surface-2); }
  .status {
    font-size: 12px;
    color: var(--c-ink-soft);
    padding: 6px 10px;
  }
</style>
