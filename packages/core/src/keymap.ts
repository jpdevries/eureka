// Keyboard bindings (05). Data comes from spec/data/keymap.json via data/keymap.ts.
import keymapData from './data/keymap.js';

export type KeyScope = 'instance' | 'row';
export interface Binding { id: string; action: string; scope: KeyScope; keys: readonly string[]; args?: readonly string[] | string; when?: string }

export interface KeyEventLike { key: string; code?: string; ctrlKey: boolean; altKey: boolean; shiftKey: boolean; metaKey: boolean }
export interface MatchContext { inRow: boolean; inTextField: boolean; isMac?: boolean }
export interface KeyMatch { binding: Binding; keyIndex: number; arg?: string }

const MOD_ALIASES: Record<string, string> = { ctrl: 'Control', control: 'Control', alt: 'Alt', option: 'Alt', shift: 'Shift', meta: 'Meta', cmd: 'Meta', command: 'Meta', mod: 'Mod' };

/** Parse "Control+Alt+2", "Alt+ArrowUp", "Alt+ " (space), "F2", "/". */
export function parseChord(chord: string): { key: string; ctrl: boolean; alt: boolean; shift: boolean; meta: boolean; mod: boolean } {
  const parts = chord === '+' ? ['+'] : chord.split('+');
  // a trailing empty part means the key is "+" itself ("Shift++")
  if (parts.length > 1 && parts[parts.length - 1] === '') { parts.pop(); parts[parts.length - 1] = '+'; }
  const key = parts.pop() ?? '';
  const mods = new Set(parts.map((p) => MOD_ALIASES[p.toLowerCase()] ?? p));
  return { key, ctrl: mods.has('Control'), alt: mods.has('Alt'), shift: mods.has('Shift'), meta: mods.has('Meta'), mod: mods.has('Mod') };
}

function keyEquals(eventKey: string, chordKey: string, code?: string): boolean {
  if (eventKey === chordKey) return true;
  if (chordKey === ' ' && (eventKey === 'Spacebar' || code === 'Space')) return true;
  if (eventKey.length === 1 && chordKey.length === 1) {
    if (eventKey.toLowerCase() === chordKey.toLowerCase()) return true;
    // Alt+letter on macOS yields a symbol ("ƒ"); fall back to the physical key code
    if (code && /^(Key|Digit)/.test(code)) { const base = code.replace(/^Key|^Digit/, ''); return base.toLowerCase() === chordKey.toLowerCase(); }
  }
  return false;
}

export function matchesChord(ev: KeyEventLike, chord: string, isMac = false): boolean {
  const c = parseChord(chord);
  const wantCtrl = c.ctrl || (c.mod && !isMac), wantMeta = c.meta || (c.mod && isMac);
  if (ev.ctrlKey !== wantCtrl || ev.altKey !== c.alt || ev.metaKey !== wantMeta) return false;
  // Shift is significant only when the chord names it or the key is a letter/digit/function key
  if (c.shift !== ev.shiftKey && (c.shift || c.key.length > 1 || /[a-z0-9]/i.test(c.key))) return false;
  return keyEquals(ev.key, c.key, ev.code);
}

export interface Keymap {
  bindings: readonly Binding[];
  /** Find the binding a key event activates in the given context, or null. */
  match(ev: KeyEventLike, ctx: MatchContext): KeyMatch | null;
  /** Human-readable chords for the help overlay (KEY-A5). */
  describe(): Array<{ id: string; action: string; scope: KeyScope; chords: string[] }>;
}

export interface KeymapOptions {
  /** Host overrides keyed by action id: replaces that action's keys (KEY-A1). */
  overrides?: Record<string, string[]>;
  /** Use the v2 bindings instead (informative data, for the baseline or macOS-only hosts). */
  legacy?: boolean;
}

export function createKeymap({ overrides = {}, legacy = false }: KeymapOptions = {}, data: { bindings: readonly { id: string; action: string; scope: string; keys: readonly string[]; v2: readonly string[]; args?: unknown; when?: string }[] } = keymapData): Keymap {
  const bindings: Binding[] = data.bindings.map((b) => ({
    id: b.id, action: b.action, scope: b.scope as KeyScope,
    keys: overrides[b.action] ?? (legacy ? b.v2.map(fromMousetrap).filter(Boolean) : b.keys),
    ...(b.args !== undefined ? { args: b.args as readonly string[] | string } : {}), ...(b.when ? { when: b.when } : {})
  }));
  return {
    bindings,
    match(ev, ctx) {
      for (const b of bindings) {
        if (b.scope === 'row' && !ctx.inRow) continue;
        for (let i = 0; i < b.keys.length; i++) {
          const chord = b.keys[i]!;
          if (!matchesChord(ev, chord, ctx.isMac)) continue;
          // KEY-A3: inside text fields only Escape and explicit focusFilter chords fire
          if (ctx.inTextField && !(ev.key === 'Escape' || (b.action === 'focusFilter' && parseChord(chord).key.length > 1))) continue;
          if (ctx.inTextField && b.action === 'focusFilter' && chord === '/') continue;
          return { binding: b, keyIndex: i, ...(Array.isArray(b.args) ? { arg: b.args[i] } : b.action === 'setSource' ? { arg: parseChord(chord).key } : {}) };
        }
      }
      return null;
    },
    describe: () => bindings.filter((b) => b.keys.length).map((b) => ({ id: b.id, action: b.action, scope: b.scope, chords: [...b.keys] }))
  };
}

/** Convert a v2 Mousetrap combo ("ctrl+alt+1", "alt+up") to a chord. */
export function fromMousetrap(combo: string): string {
  const map: Record<string, string> = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', space: ' ', enter: 'Enter', backspace: 'Backspace', esc: 'Escape', del: 'Delete' };
  return combo.split('+').map((k) => MOD_ALIASES[k.toLowerCase()] ?? map[k.toLowerCase()] ?? (k.length === 1 ? k : k)).join('+');
}

export const defaultKeymap: Keymap = createKeymap();
