// Shortcut hints on controls (02 HTML-96, 06 A11Y-55): a <kbd> with the first chord of the
// action's binding, hidden from assistive technology (the name stays the verb), plus
// aria-keyshortcuts with every chord. Nothing at Level 0, where there are no shortcuts.
import { defaultKeymap, parseChord } from '@mrktps/eureka-core';
import { html, raw, type Raw } from '../html.js';
import type { Ctx } from '../model.js';

const SHORT: Record<string, string> = { ' ': 'Space', Enter: 'Enter', Escape: 'Esc', Backspace: '⌫', Delete: 'Del', Home: 'Home', End: 'End', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→' };
const ARIA_KEY: Record<string, string> = { ' ': 'Space' };

function chordsFor(ctx: Ctx, action: string): readonly string[] {
  if (ctx.level === 0) return [];
  return (ctx.keymap ?? defaultKeymap).describe().find((b) => b.action === action)?.chords ?? [];
}

/** Compact label for a chord: "⌥⇧U" on a Mac, "Alt+Shift+U" elsewhere. */
export function shortLabel(chord: string, mac: boolean): string {
  const c = parseChord(chord);
  const key = SHORT[c.key] ?? (c.key.length === 1 ? c.key.toUpperCase() : c.key);
  if (mac) return `${c.ctrl ? '⌃' : ''}${c.alt ? '⌥' : ''}${c.shift ? '⇧' : ''}${c.meta ? '⌘' : ''}${key}`;
  return [c.ctrl && 'Ctrl', c.alt && 'Alt', c.shift && 'Shift', c.meta && 'Meta', key].filter(Boolean).join('+');
}

/** The <kbd> hint for `action`, or nothing when the action has no binding (or at Level 0). */
export function kbdHint(ctx: Ctx, action: string): Raw {
  const [first] = chordsFor(ctx, action);
  if (!first) return html``;
  return html`<kbd class="eureka__kbd" aria-hidden="true">${shortLabel(first, ctx.platform === 'mac')}</kbd>`;
}

/** ` aria-keyshortcuts="…"` for `action`, or an empty string. */
export function keyshortcuts(ctx: Ctx, action: string): Raw {
  const chords = chordsFor(ctx, action);
  if (!chords.length) return raw('');
  const value = chords.map((ch) => ch.split('+').map((part, i, all) => (i === all.length - 1 && part === '' ? '+' : ARIA_KEY[part] ?? part)).join('+')).join(' ');
  return raw(` aria-keyshortcuts="${value.replace(/"/g, '&quot;')}"`);
}
