<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { EditorView, keymap, lineNumbers, highlightActiveLine, Decoration } from '@codemirror/view';
  import { EditorState, RangeSetBuilder, StateEffect, StateField } from '@codemirror/state';
  import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
  import { javascript } from '@codemirror/lang-javascript';
  import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, indentOnInput } from '@codemirror/language';
  import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';

  /** @type {string} */ export let value = '';
  /** @type {Array<{from: number, to: number}>} */ export let lockedRanges = []; // 1-based line numbers, inclusive
  export let readOnly = false;

  const dispatch = createEventDispatcher();

  /** @type {HTMLDivElement} */ let container;
  /** @type {EditorView} */    let view;
  let lastDispatchedValue = value;

  // Signal a full code reset so locked char ranges are recomputed from scratch.
  const resetLockedEffect = StateEffect.define();

  // Compute initial character offsets from the (static) line-based locked range specs.
  function computeCharRanges(doc) {
    return lockedRanges
      .filter(r => r.from >= 1 && r.to >= r.from)
      .map(r => ({
        from: doc.line(Math.min(r.from, doc.lines)).from,
        to:   doc.line(Math.min(r.to,   doc.lines)).to
      }));
  }

  // StateField that tracks locked char ranges dynamically.
  // On normal edits: mapPos forwards through each change so locked content
  // stays anchored to the correct characters even as lines shift.
  // On resetLockedEffect: recompute from static line specs against the new doc.
  const lockedCharField = StateField.define({
    create(state) { return computeCharRanges(state.doc); },
    update(ranges, tr) {
      if (tr.effects.some(e => e.is(resetLockedEffect))) {
        return computeCharRanges(tr.state.doc);
      }
      if (!tr.docChanged) return ranges;
      return ranges.map(r => ({
        from: tr.changes.mapPos(r.from, -1),
        to:   tr.changes.mapPos(r.to,    1)
      }));
    }
  });

  function buildDecos(charRanges, doc) {
    const builder = new RangeSetBuilder();
    for (const { from, to } of charRanges) {
      const fromLine = doc.lineAt(from).number;
      const toLine   = doc.lineAt(to).number;
      for (let l = fromLine; l <= toLine; l++) {
        const lp = doc.line(l).from;
        builder.add(lp, lp, Decoration.line({ class: 'cm-locked-line' }));
      }
    }
    return builder.finish();
  }

  const lockedDecoField = StateField.define({
    create(state) {
      return buildDecos(state.field(lockedCharField), state.doc);
    },
    update(deco, tr) {
      if (!tr.docChanged && !tr.effects.some(e => e.is(resetLockedEffect))) {
        return deco.map(tr.changes);
      }
      return buildDecos(tr.state.field(lockedCharField), tr.state.doc);
    },
    provide: f => EditorView.decorations.from(f)
  });

  // Reject any change that touches a locked character range.
  const lockedFilter = EditorState.changeFilter.of((tr) => {
    if (readOnly) return false;
    const charRanges = tr.startState.field(lockedCharField);
    if (charRanges.length === 0) return true;
    let allow = true;
    tr.changes.iterChanges((fromA, toA) => {
      if (!allow) return;
      for (const r of charRanges) {
        if (fromA <= r.to && toA >= r.from) { allow = false; return; }
      }
    });
    return allow;
  });

  onMount(() => {
    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        history(),
        highlightActiveLine(),
        bracketMatching(),
        indentOnInput(),
        closeBrackets(),
        syntaxHighlighting(defaultHighlightStyle),
        javascript(),
        keymap.of([...defaultKeymap, ...historyKeymap, ...closeBracketsKeymap, indentWithTab]),
        EditorView.editable.of(!readOnly),
        lockedCharField,
        lockedFilter,
        lockedDecoField,
        EditorView.updateListener.of((u) => {
          if (u.docChanged) {
            const newValue = u.state.doc.toString();
            lastDispatchedValue = newValue;
            dispatch('change', { value: newValue });
          }
        }),
        EditorView.theme({
          '&': { height: '100%', fontSize: '13.5px' },
          '.cm-scroller': { fontFamily: 'var(--font-mono)', fontFeatureSettings: '"liga" 0, "calt" 0' },
          '.cm-content': { padding: '12px 0' },
          '.cm-locked-line': { backgroundColor: 'var(--c-locked)' },
          '.cm-gutters': { backgroundColor: 'var(--c-surface-2)', border: 'none', color: 'var(--c-ink-mute)' },
          '.cm-activeLine': { backgroundColor: 'rgba(43,58,85,0.04)' },
          '.cm-activeLineGutter': { backgroundColor: 'transparent' }
        })
      ]
    });

    view = new EditorView({ state, parent: container });
  });

  onDestroy(() => view?.destroy());

  // Sync editor when value changes externally (reset, solution reveal).
  // Dispatch resetLockedEffect so locked char ranges are recomputed for the new doc.
  $: if (view && value !== lastDispatchedValue) {
    const cur = view.state.doc.toString();
    if (cur !== value) {
      view.dispatch({
        changes: { from: 0, to: cur.length, insert: value },
        effects: [resetLockedEffect.of(null)]
      });
      lastDispatchedValue = value;
    }
  }

  export function getValue() {
    return view ? view.state.doc.toString() : value;
  }
</script>

<div class="editor" class:read-only={readOnly} bind:this={container}></div>

<style>
  .editor {
    height: 100%;
    width: 100%;
    background: var(--c-surface);
    border: 1px solid var(--c-line);
    border-radius: var(--radius);
    overflow: hidden;
  }
  :global(.cm-editor) { height: 100%; }
  :global(.cm-editor.cm-focused) {
    outline: 2px solid var(--c-primary);
    outline-offset: -2px;
  }
  .read-only :global(.cm-editor.cm-focused) { outline: none; }
  .read-only :global(.cm-content) { cursor: default; }
</style>
