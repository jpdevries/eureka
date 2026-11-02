import { describe, expect, it } from 'vitest';
import { isTextLike, languageFor, looksBinary, renderTextThumbnail, tokenizeLine } from './text.js';

describe('text thumbnails', () => {
  it('knows text-like files and their languages', () => {
    expect(isTextLike('notes.txt')).toBe(true); expect(isTextLike('app.ts')).toBe(true); expect(isTextLike('photo.jpg')).toBe(false); expect(isTextLike('a.svg')).toBe(false);
    expect(languageFor('x.mjs')).toBe('js'); expect(languageFor('README.md')).toBe('md'); expect(languageFor('weird.bin')).toBe('txt');
    expect(looksBinary(new Uint8Array([104, 105, 0, 1]))).toBe(true); expect(looksBinary(new TextEncoder().encode('plain text'))).toBe(false);
  });
  it('tokenizes with comments spanning lines, strings, numbers and keywords', () => {
    const state = { block: '' as '' | '*/' | '-->' };
    expect(tokenizeLine('const n = 42; // answer', 'js', state)).toEqual([
      { cls: 'keyword', text: 'const' }, { cls: 'plain', text: ' n ' }, { cls: 'punct', text: '=' }, { cls: 'plain', text: ' ' }, { cls: 'number', text: '42' }, { cls: 'punct', text: ';' }, { cls: 'plain', text: ' ' }, { cls: 'comment', text: '// answer' }
    ]);
    expect(tokenizeLine('a /* open', 'js', state).at(-1)).toEqual({ cls: 'comment', text: '/* open' });
    expect(state.block).toBe('*/');
    expect(tokenizeLine('still */ "s"', 'js', state)).toEqual([{ cls: 'comment', text: 'still */' }, { cls: 'plain', text: ' ' }, { cls: 'string', text: '"s"' }]);
    expect(tokenizeLine('{ "name": "eureka", "n": 3 }', 'json')).toEqual(expect.arrayContaining([{ cls: 'property', text: '"name"' }, { cls: 'string', text: '"eureka"' }, { cls: 'number', text: '3' }]));
    expect(tokenizeLine('# Title', 'md')[0]).toEqual({ cls: 'heading', text: '# Title' });
    expect(tokenizeLine('<a href="x">', 'html')).toEqual(expect.arrayContaining([{ cls: 'tag', text: '<a' }, { cls: 'attr', text: 'href' }, { cls: 'string', text: '"x"' }]));
    expect(tokenizeLine('.eureka { color: red; }', 'css')).toEqual(expect.arrayContaining([{ cls: 'tag', text: '.eureka' }, { cls: 'property', text: 'color' }]));
  });
  it('renders an SVG with a title, escaped text, capped lines and columns, and themed classes', () => {
    const text = Array.from({ length: 40 }, (_, i) => `line ${i} <b> & "q" ${'x'.repeat(200)}`).join('\n');
    const svg = renderTextThumbnail(text, { filename: 'a<b>.txt', lines: 10, cols: 40 });
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="400"')).toBe(true);
    expect(svg).toContain('<title>Preview of a&lt;b&gt;.txt</title>');
    expect(svg.match(/<text /g)).toHaveLength(10);
    expect(svg).toContain('&lt;b&gt; &amp; &quot;q&quot;');
    expect(svg).toContain('…</text>');
    expect(svg).not.toMatch(/x{41}/);
    expect(svg).toContain('@media (prefers-color-scheme: dark)');
    expect(svg).toContain('@media (forced-colors: active)');
    expect(renderTextThumbnail('', { filename: 'e.txt' })).toContain('(empty)');
    expect(renderTextThumbnail('// c\nconst a = 1;', { filename: 'a.js' })).toContain('<tspan class="keyword">const</tspan>');
  });
});
