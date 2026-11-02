import { describe, it, expect } from 'vitest';
import { formatMessage, createTranslator, resolveLocale, catalogCandidates, englishCatalog } from './i18n.js';

describe('i18n', () => {
  it('formats arguments, plurals, selects and numbers', () => {
    const o = { locale: 'en-US' };
    expect(formatMessage('Hello {name}', { name: 'JP' }, o)).toBe('Hello JP');
    expect(formatMessage('{n, plural, =0 {No items} one {# item} other {# items}}', { n: 0 }, o)).toBe('No items');
    expect(formatMessage('{n, plural, =0 {No items} one {# item} other {# items}}', { n: 1 }, o)).toBe('1 item');
    expect(formatMessage('{n, plural, =0 {No items} one {# item} other {# items}}', { n: 1234 }, o)).toBe('1,234 items');
    expect(formatMessage('{kind, select, danger {Error} other {Note}}: {msg}', { kind: 'danger', msg: 'x' }, o)).toBe('Error: x');
    expect(formatMessage('Nested {n, plural, one {{name} has # file} other {{name} has # files}}', { n: 2, name: 'dir' }, o)).toBe('Nested dir has 2 files');
    expect(formatMessage("literal '{brace}", {}, o)).toBe('literal {brace}');
    expect(formatMessage('{d, date, long}', { d: Date.UTC(2017, 3, 2) }, { locale: 'en-US', timeZone: 'UTC' })).toBe('April 2, 2017');
  });
  it('falls back per message and never returns garbage', () => {
    const t = createTranslator('nl', { choose: 'Kies' });
    expect(t('choose')).toBe('Kies');
    expect(t('cancel')).toBe('Cancel');
    expect(t('does.not.exist')).toBe('does.not.exist');
    expect(t('listing.count', { n: 3 })).toBe('3 items');
    expect(englishCatalog['rename.item']).toBe('Rename Item {item}');
  });
  it('resolves locales and catalog candidates', () => {
    expect(resolveLocale(undefined, 'en', ['nl-NL'])).toBe('en');
    expect(resolveLocale(undefined, '', ['pt-br'])).toBe('pt-BR');
    expect(resolveLocale('!!bad', undefined, ['de'])).toBe('de');
    expect(resolveLocale()).toBe('en');
    expect(catalogCandidates('pt-BR')).toEqual(['pt-BR', 'pt']);
    expect(catalogCandidates('nl')).toEqual(['nl']);
  });
});
