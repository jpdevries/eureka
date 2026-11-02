import { describe, it, expect } from 'vitest';
import { createKeymap, matchesChord, parseChord, fromMousetrap } from './keymap.js';

const ev = (key: string, mods: Partial<{ ctrl: boolean; alt: boolean; shift: boolean; meta: boolean }> = {}, code?: string) => ({ key, code, ctrlKey: !!mods.ctrl, altKey: !!mods.alt, shiftKey: !!mods.shift, metaKey: !!mods.meta });

describe('keymap', () => {
  it('parses chords', () => {
    expect(parseChord('Control+Alt+2')).toMatchObject({ key: '2', ctrl: true, alt: true });
    expect(parseChord('Alt+ ')).toMatchObject({ key: ' ', alt: true });
    expect(parseChord('/')).toMatchObject({ key: '/', ctrl: false });
    expect(fromMousetrap('ctrl+alt+1')).toBe('Control+Alt+1');
    expect(fromMousetrap('alt+up')).toBe('Alt+ArrowUp');
  });
  it('matches keys case-insensitively and via physical code for Alt+letter on macOS', () => {
    expect(matchesChord(ev('N', { alt: true }), 'Alt+N')).toBe(true);
    expect(matchesChord(ev('˜', { alt: true }, 'KeyN'), 'Alt+N')).toBe(true);
    expect(matchesChord(ev('n'), 'Alt+N')).toBe(false);
    expect(matchesChord(ev('F2'), 'F2')).toBe(true);
    expect(matchesChord(ev('F2', { shift: true }), 'F2')).toBe(false);
    expect(matchesChord(ev('/', { shift: true }), '/')).toBe(true); // '/' may need shift on some layouts
  });
  it('resolves actions with scope, args and text-field rules', () => {
    const km = createKeymap();
    expect(km.match(ev('ArrowDown', { alt: true }), { inRow: false, inTextField: false })?.binding.action).toBe('sortDescending');
    expect(km.match(ev('2', { ctrl: true, alt: true }), { inRow: false, inTextField: false })).toMatchObject({ binding: { action: 'setView' }, arg: 'thumb' });
    expect(km.match(ev('3', { alt: true }), { inRow: false, inTextField: false })).toMatchObject({ binding: { action: 'setSource' }, arg: '3' });
    expect(km.match(ev('Delete'), { inRow: true, inTextField: false })?.binding.action).toBe('deleteItem');
    expect(km.match(ev('Delete'), { inRow: false, inTextField: false })).toBeNull();
    expect(km.match(ev('n', { alt: true }), { inRow: false, inTextField: true })).toBeNull();
    expect(km.match(ev('/'), { inRow: false, inTextField: true })).toBeNull();
    expect(km.match(ev('/'), { inRow: false, inTextField: false })?.binding.action).toBe('focusFilter');
    expect(km.match(ev('Escape'), { inRow: false, inTextField: true })?.binding.action).toBe('deselectAll');
  });
  it('applies host overrides and legacy bindings', () => {
    const km = createKeymap({ overrides: { focusFilter: ['Control+K'] } });
    expect(km.match(ev('k', { ctrl: true }), { inRow: false, inTextField: false })?.binding.action).toBe('focusFilter');
    expect(km.match(ev('/'), { inRow: false, inTextField: false })).toBeNull();
    const legacy = createKeymap({ legacy: true });
    expect(legacy.match(ev('f', { ctrl: true }), { inRow: false, inTextField: false })?.binding.action).toBe('focusFilter');
    expect(legacy.describe().find((d) => d.action === 'nextRow')).toBeUndefined();
  });
});
