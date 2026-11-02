// The React page of the demo: <EurekaBrowser> with a side panel that reads the
// browser's state through useEurekaState and drives it through the element's
// methods. Bundled by build.mjs into public/assets/js/react-demo.js.
import { StrictMode, useCallback, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { FileEntry, ViewMode } from '@eureka/core';
import { EurekaBrowser, useEurekaState, type EurekaBrowserElement } from '@eureka/react';

const MODES: ViewMode[] = ['table', 'thumb', 'grid', 'list', 'masonry'];

function App() {
  const ref = useRef<EurekaBrowserElement>(null);
  const [chosen, setChosen] = useState<FileEntry[]>([]);
  const [uploads, setUploads] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const log = useCallback((line: string) => setEvents((xs) => [line, ...xs].slice(0, 8)), []);

  const location = useEurekaState(ref, (s) => `${s.sources.all.find((x) => String(x.id) === String(s.listing.source))?.name ?? '…'}: ${s.listing.path}`);
  const status = useEurekaState(ref, (s) => s.listing.status);
  const count = useEurekaState(ref, (s) => s.listing.entries.filter((e) => e.filename).length);
  const mode = useEurekaState(ref, (s) => s.view.mode);
  const focused = useEurekaState(ref, (s) => (s.selection.focused ? s.listing.records[s.selection.focused] : undefined));
  const checked = useEurekaState(ref, (s) => s.selection.checked.length);
  const engine = ref.current?.engineMode;

  const config = useMemo(() => ({ headers: { 'X-Demo': 'react' } }), []);

  return (
    <div className="demo-app">
      <div className="eureka-root">
        <EurekaBrowser
          ref={ref}
          api="/browser/"
          assets="/assets/"
          storagePrefix="eureka_react__"
          noUploads={!uploads}
          confirmDelete={confirmDelete}
          config={config}
          onChoose={(items) => { setChosen(items); log(`choose ${items.length} item${items.length === 1 ? '' : 's'}`); }}
          onNavigate={(d) => log(`navigate ${d.source}:${d.path}`)}
          onError={(d) => log(`error ${d.message}`)}
          onClose={() => log('close')}
        />
      </div>
      <aside className="demo-side" aria-label="Host application">
        <h2>Host state (useEurekaState)</h2>
        <dl>
          <dt>Location</dt><dd>{location ?? 'starting…'}</dd>
          <dt>Status</dt><dd>{status ?? '—'}</dd>
          <dt>Files</dt><dd>{count ?? '—'}</dd>
          <dt>Focused</dt><dd>{focused ? `${focused.path.split('/').pop()} ${focused.dimensionsText || focused.sizeText}` : 'none'}</dd>
          <dt>Checked</dt><dd>{checked ?? 0}</dd>
          <dt>Engine</dt><dd>{engine ?? '—'}</dd>
        </dl>
        <fieldset>
          <legend>View (setView)</legend>
          {MODES.map((m) => <button key={m} type="button" aria-pressed={mode === m} onClick={() => ref.current?.setView(m)}>{m}</button>)}
        </fieldset>
        <fieldset>
          <legend>Props (restart the instance)</legend>
          <label><input type="checkbox" checked={uploads} onChange={(e) => setUploads(e.target.checked)} /> uploads</label>
          <label><input type="checkbox" checked={confirmDelete} onChange={(e) => setConfirmDelete(e.target.checked)} /> confirm delete</label>
        </fieldset>
        <fieldset>
          <legend>Methods</legend>
          <button type="button" onClick={() => void ref.current?.navigate(0, 'photos/redwoods')}>Go to redwoods</button>{' '}
          <button type="button" onClick={() => void ref.current?.refresh()}>Refresh</button>{' '}
          <button type="button" onClick={() => ref.current?.choose()}>Choose</button>
        </fieldset>
        <h2>Chosen (onChoose)</h2>
        {chosen.length === 0 ? <p>Nothing yet. Focus an item and press Enter, or check several and use the Choose bar.</p> : (
          <ul className="demo-chosen">
            {chosen.map((i) => <li key={i.path}>{i.dimensions ? <img src={i.absolutePreviewURL ?? i.absoluteURL} alt="" width={i.dimensions[0]} height={i.dimensions[1]} /> : null}{i.filename}</li>)}
          </ul>
        )}
        <h2>Events</h2>
        <ol reversed>{events.map((e, i) => <li key={`${i}-${e}`}>{e}</li>)}</ol>
      </aside>
    </div>
  );
}

createRoot(document.getElementById('app')!).render(<StrictMode><App /></StrictMode>);
