// Where the side-loaded filter parser plugs in (10 PERF-29). Until a compiler is registered, `filterEntries` keeps the
// substring match it always had, and a query with qualifiers is read as plain text; the element loads the chunk on
// focus of the filter input, or at start when the filter already holds a qualifier, and registers what it exports here
// (the chunk is built separately, so it cannot reach this module instance itself).
import type { DisplayRecord, Entry } from './types.js';
import type { FilterContext } from './filter-examples.js';

export interface CompiledFilter { structured: boolean; test: (e: Entry, record?: DisplayRecord) => boolean }
export type FilterCompiler = (text: string, ctx?: FilterContext) => CompiledFilter;

let compiler: FilterCompiler | null = null;
let version = 0;
export function setFilterCompiler(fn: FilterCompiler | null): void { compiler = fn; version++; }
export function getFilterCompiler(): FilterCompiler | null { return compiler; }
/** Changes whenever the compiler does; selectors fold it into their cache keys. */
export function filterCompilerVersion(): number { return version; }
/** Does the text look like it carries a qualifier? Cheap, used to decide whether the chunk is worth loading now. */
export const looksStructured = (text: string): boolean => /(^|\s)-?[a-z]+:\S/i.test(text);
