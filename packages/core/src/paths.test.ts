import { describe, it, expect } from 'vitest';
import { normalizePath, joinPath, parentPath, basename, extname, isWithin, cssSafe, encodePathForURL, combineSourcePath, splitSourcePath } from './paths.js';

describe('paths', () => {
  it('normalises', () => {
    expect(normalizePath('')).toBe('/');
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('//assets//img/')).toBe('assets/img');
    expect(normalizePath('/assets')).toBe('assets');
  });
  it('joins and splits', () => {
    expect(joinPath('/', 'assets')).toBe('assets');
    expect(joinPath('assets', 'img')).toBe('assets/img');
    expect(parentPath('assets/img')).toBe('assets');
    expect(parentPath('assets')).toBe('/');
    expect(parentPath('/')).toBe('/');
    expect(basename('assets/img/a.jpg')).toBe('a.jpg');
    expect(extname('a.JPG?dim=240')).toBe('.jpg');
    expect(extname('.htaccess')).toBe('');
    expect(isWithin('assets', 'assets/img/x.png')).toBe(true);
    expect(isWithin('assets', 'assetsx')).toBe(false);
  });
  it('cssSafe matches the v2 algorithm', () => {
    expect(cssSafe('Wide Banner (final).jpg')).toBe('wide-banner-__0028final__0029__002ejpg');
    expect(cssSafe('schildpad.jpg')).toBe('schildpad__002ejpg');
  });
  it('encodes URLs per segment', () => {
    expect(encodePathForURL('assets/img/Wide Banner (final).jpg')).toBe('assets/img/Wide%20Banner%20(final).jpg');
    expect(encodePathForURL('/')).toBe('');
  });
  it('round-trips the no-JS combined value', () => {
    expect(combineSourcePath(0, '/assets/img/')).toBe('0||assets/img');
    expect(splitSourcePath('0||assets/img')).toEqual({ sourceId: '0', path: 'assets/img' });
    expect(splitSourcePath('cloud||/')).toEqual({ sourceId: 'cloud', path: '/' });
    expect(splitSourcePath('1||a||b')).toEqual({ sourceId: '1', path: 'a||b' });
  });
});
