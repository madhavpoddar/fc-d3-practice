<script>
  import '../app.css';
  import { base } from '$app/paths';
  import SessionMenu from '$lib/SessionMenu.svelte';
</script>

<div class="app">
  <header class="topbar">
    <a class="brand" href="{base}/">
      <span class="logo" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="28" height="28">
          <rect width="32" height="32" rx="6" fill="#2b3a55"/>
          <circle cx="10" cy="22" r="3" fill="#f5b754"/>
          <circle cx="16" cy="14" r="3" fill="#e36588"/>
          <circle cx="22" cy="18" r="3" fill="#7fc7af"/>
        </svg>
      </span>
      <span class="brand-text">D3 Practice Tasks</span>
    </a>
    <div class="actions">
      <SessionMenu />
    </div>
  </header>

  <main>
    <slot />
  </main>
</div>

<style>
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--s-3) var(--s-6);
    border-bottom: 1px solid var(--c-line);
    background: var(--c-surface);
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    text-decoration: none;
    color: var(--c-ink);
    font-weight: 600;
  }
  .brand:hover { color: var(--c-primary); }
  .logo { display: inline-flex; }
  main { flex: 1; }
</style>
