// eureka-filter.js: the filter query parser as its own chunk (10 PERF-29). It only exports; the element registers the
// compiler in its own copy of the registry, because a separately built chunk cannot share module state with the element.
export { compileFilter } from '@mrktps/eureka-core';
