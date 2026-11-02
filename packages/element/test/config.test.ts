// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { ATTRIBUTES, buildConfig, configFromAttributes, mergeConfig } from '../src/config.js';

describe('element configuration', () => {
  it('maps attributes to config', () => {
    const el = document.createElement('eureka-browser');
    el.setAttribute('api', '/components/eureka/');
    el.setAttribute('source', '1');
    el.setAttribute('path', 'assets/img');
    el.setAttribute('mode', 'grid');
    el.setAttribute('tree-open', '');
    el.setAttribute('no-uploads', '');
    el.setAttribute('no-choose-multiple', '');
    const c = configFromAttributes(el);
    expect(c).toMatchObject({ endpoints: { api: '/components/eureka/' }, mediaSource: 1, currentDirectory: 'assets/img', mode: 'grid', treeHidden: false, allowUploads: false, allowChooseMultiple: false });
  });
  it('merges json child, attributes and property in that order with nested groups', () => {
    const el = document.createElement('eureka-browser');
    el.innerHTML = '<script type="application/json" data-eureka-config>{"mode":"list","headers":{"X-A":"1"},"callbacks":{}}</script>';
    el.setAttribute('mode', 'thumb');
    const choose = () => {};
    const c = buildConfig(el, { headers: { 'X-B': '2' }, callbacks: { choose } });
    expect(c.mode).toBe('thumb');
    expect(c.headers).toEqual({ 'X-A': '1', 'X-B': '2' });
    expect(c.callbacks.choose).toBe(choose);
    expect(c.allowChoose).toBe(true); // defaults survive
  });
  it('mergeConfig lets a later part replace scalars and merge groups', () => {
    expect(mergeConfig({ mode: 'table', sort: { by: 'filename', dir: 'ascending' } }, { mode: 'grid', sort: { dir: 'descending' } })).toEqual({ mode: 'grid', sort: { by: 'filename', dir: 'descending' } });
  });
});

describe('attribute names', () => {
  it('never shadow a DOM property, so frameworks that prefer properties (React 19, Vue) keep writing attributes', () => {
    const el = document.createElement('eureka-browser');
    // `lang` is the one deliberate exception: HTMLElement.lang reflects the attribute, so setting the property is equivalent.
    const shadowed = [...ATTRIBUTES].filter((name) => name !== 'lang' && name in el);
    expect(shadowed).toEqual([]);
  });
});
