# @eureka/react

A typed React 19 wrapper over the [`<eureka-browser>`](../element) custom
element. It is thin on purpose (decision 1 of the plan): the element does
the work, React gets props, handler callbacks and a hook.

```tsx
import { useRef } from 'react';
import { EurekaBrowser, useEurekaState, type EurekaBrowserElement } from '@eureka/react';

function Picker({ onPick }: { onPick: (url: string) => void }) {
  const ref = useRef<EurekaBrowserElement>(null);
  const where = useEurekaState(ref, (s) => s.listing.path);
  return (
    <>
      <p>Browsing {where ?? '…'}</p>
      <EurekaBrowser ref={ref} api="/media-api/" assets="/assets/" noChooseMultiple
        onChoose={([item]) => onPick(item.absoluteURL)} />
    </>
  );
}
```

Load the stylesheet (`@eureka/css/eureka.css`) on the page and wrap the
component in an element with `class="eureka-root"` that gives it a height.

## `<EurekaBrowser>`

- **Attribute props**, camelCased from the element's attributes: `api`,
  `assets`, `lang`, `source`, `path`, `mode`, `storagePrefix`, `uid`,
  `basePath`, `worker`, `i18n`, `learnMore`, and the switches `treeOpen`,
  `noStorage`, `noUploads`, `noDnd`, `noRename`, `noDelete`, `noDownload`,
  `noCrop`, `noMasonry`, `noFullscreen`, `noWelcome`, `noChoose`,
  `noChooseMultiple`, `confirmDelete`, `alwaysWelcome`. Changing one
  restarts the instance (the element re-reads its configuration).
- **`config`**: the `PartialConfig` of `@eureka/core` for anything else
  (headers, intervals, handlers, keymap overrides). It is set as a
  property. Memoize it; a new object restarts the instance.
- **Handlers** for the element's events (spec 07 STATE-50): `onChoose(items,
  event)`, `onClose(event)`, `onNavigate({ source, path }, event)`,
  `onError({ message, cause }, event)`, `onStateChange(state, event)`. The
  latest handler is always the one called; re-rendering with a new arrow
  function does not re-bind.
- **`markup`**: a server-rendered Level 0 form (the string
  `renderLevel0()` of `@eureka/html` returns) to enhance, rendered through
  `dangerouslySetInnerHTML` so it hydrates. Keep it referentially stable:
  React resets the element's children when the string changes. Without it,
  `children` show until the element starts; with neither, the element
  fetches everything itself.
- **`ref`** gives the element, with its methods (STATE-52) `navigate(source,
  path)`, `setView(mode)`, `refresh()`, `choose()`, and the `state`,
  `store`, `engineMode` getters.
- **`define`** (default `true`) imports `@eureka/element` and registers the
  tag the first time a component mounts. Pass `false` when the page loads
  `eureka-browser.js` itself. `tag` selects another registered name.
- `id`, `className`, `style`, `hidden` pass through.

Only attributes go through JSX. React 19 writes a prop as a property when
the element already has one of that name, which is why `config` and the
listeners are applied from a ref and why the element's attribute names
never shadow DOM properties (`storage-prefix`, not `prefix`).

## `useEurekaState(ref, selector?)`

Reads the browser's state with `useSyncExternalStore`, subscribing to
`eureka-statechange`. Returns `undefined` until the element has started,
then the selected value, re-rendering only when it changes (`Object.is`).
Without a selector, the whole `State`.

## Server rendering

`@eureka/react` imports nothing DOM-bound at module level; the element is
imported dynamically in an effect. Render the Level 0 form on the server
with `@eureka/html` and pass it as `markup`:

```tsx
const markup = renderLevel0({ sources, source, path, entries, tree, lang: 'en', basePath: '/media-api/' });
<EurekaBrowser api="/media-api/" assets="/assets/" markup={markup} />
```

The HTML works before hydration and before the element bundle arrives
(spec 03). The worker bundle is found next to the element module
(`eureka-worker.js`); when a bundler relocates it, pass `worker="/path/to/eureka-worker.js"`.

## Files

- `src/EurekaBrowser.tsx` the component and `attributesFromProps`
- `src/useEurekaState.ts` the hook
- `src/define.ts` on-demand registration, SSR-safe
- `src/types.ts` props; `src/jsx.ts` lets `<eureka-browser>` be written raw in JSX
- `test/` component, hook and an integration test that runs the real element
  under happy-dom with a mocked `fetch`
