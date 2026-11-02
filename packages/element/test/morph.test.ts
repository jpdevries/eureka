// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { fragmentFrom, morphChildren } from '../src/morph.js';

const host = (markup: string) => { const d = document.createElement('div'); d.innerHTML = markup; return d; };
const apply = (d: HTMLElement, markup: string) => morphChildren(d, fragmentFrom(markup));

describe('morphChildren', () => {
  it('updates text and attributes in place', () => {
    const d = host('<p class="a" title="x">hello</p>');
    const p = d.firstElementChild!;
    apply(d, '<p class="b">bye</p>');
    expect(d.firstElementChild).toBe(p);
    expect(p.className).toBe('b');
    expect(p.hasAttribute('title')).toBe(false);
    expect(p.textContent).toBe('bye');
  });
  it('keeps keyed elements across a reorder', () => {
    const d = host('<table><tbody><tr id="a"><td>a</td></tr><tr id="b"><td>b</td></tr><tr id="c"><td>c</td></tr></tbody></table>');
    const [a, b, c] = Array.from(d.querySelectorAll('tr'));
    apply(d, '<table><tbody><tr id="c"><td>c</td></tr><tr id="a"><td>a!</td></tr></tbody></table>');
    const rows = Array.from(d.querySelectorAll('tr'));
    expect(rows).toEqual([c, a]);
    expect(b!.isConnected).toBe(false);
    expect(a!.textContent).toBe('a!');
  });
  it('replaces an element when the tag changes and adopts new siblings', () => {
    const d = host('<form class="eureka"></form><script type="application/json" id="p_state">{}</script>');
    apply(d, '<div class="eureka"><span>x</span></div>');
    expect(d.children.length).toBe(1);
    expect(d.firstElementChild!.tagName).toBe('DIV');
    expect(d.querySelector('script')).toBeNull();
  });
  it('reconciles form control state from the rendered attributes', () => {
    const d = host('<input id="f" type="search" value="a"><input id="c" type="checkbox"><select id="s"><option value="1">1</option><option value="2" selected>2</option></select><details id="d"></details>');
    const f = d.querySelector<HTMLInputElement>('#f')!, c = d.querySelector<HTMLInputElement>('#c')!, s = d.querySelector<HTMLSelectElement>('#s')!, det = d.querySelector<HTMLDetailsElement>('#d')!;
    f.value = 'typed'; // what the user typed, not yet in state
    apply(d, '<input id="f" type="search" value="typed"><input id="c" type="checkbox" checked><select id="s"><option value="1" selected>1</option><option value="2">2</option></select><details id="d" open></details>');
    expect(f.value).toBe('typed');
    expect(c.checked).toBe(true);
    expect(s.value).toBe('1');
    expect(det.open).toBe(true);
  });
  it('leaves a dialog\'s open state alone (the element drives showModal)', () => {
    const d = host('<dialog id="m" open><p>x</p></dialog>');
    apply(d, '<dialog id="m"><p>y</p></dialog>');
    expect(d.querySelector('dialog')!.hasAttribute('open')).toBe(true);
    expect(d.querySelector('dialog p')!.textContent).toBe('y');
  });
});

describe('keep placeholders (PERF-11)', () => {
  it('leaves a kept row untouched and resolves a missing one from the memo', () => {
    const d = host('<table><tbody><tr id="a"><td>a</td></tr><tr id="b"><td>b</td></tr></tbody></table>');
    const a = d.querySelector('#a')!;
    a.setAttribute('data-touched', '1'); // would be removed by a real morph of this row
    morphChildren(d, fragmentFrom('<table><tbody><tr id="a" data-eureka-keep></tr><tr id="c" data-eureka-keep></tr><tr id="b"><td>b!</td></tr></tbody></table>'), { resolveKeep: (id) => (id === 'c' ? '<tr id="c"><td>c</td></tr>' : undefined) });
    const rows = Array.from(d.querySelectorAll('tr'));
    expect(rows.map((r) => r.id)).toEqual(['a', 'c', 'b']);
    expect(rows[0]).toBe(a);
    expect(a.getAttribute('data-touched')).toBe('1');
    expect(rows[1]!.textContent).toBe('c');
    expect(rows[2]!.textContent).toBe('b!');
  });
});
