// A small keyed DOM morph: updates `from` in place so it matches `to`, reusing
// nodes wherever it can. Elements with an id are matched by id regardless of
// position (so a row keeps its node when the listing is re-sorted, and the
// focused element stays focused); everything else is matched by position and
// tag. Form control state is reconciled from the rendered attributes; a
// `<dialog>`'s `open` state is left to the element.

export interface MorphOptions {
  /** Markup for a keep-placeholder (`data-eureka-keep`) whose node is missing, by id; the placeholder is replaced with it. */
  resolveKeep?: (id: string) => string | undefined;
}

export function morphChildren(from: ParentNode & Node, to: ParentNode & Node, options: MorphOptions = {}): void {
  const fromById = new Map<string, Element>();
  for (let c = from.firstChild; c; c = c.nextSibling) if (c.nodeType === 1 && (c as Element).id) fromById.set((c as Element).id, c as Element);
  const toIds = new Set<string>();
  for (let c = to.firstChild; c; c = c.nextSibling) if (c.nodeType === 1 && (c as Element).id) toIds.add((c as Element).id);

  let fromNode: ChildNode | null = from.firstChild;
  let toNode: ChildNode | null = to.firstChild;
  while (toNode) {
    const nextTo: ChildNode | null = toNode.nextSibling;
    // drop keyed nodes that no longer exist
    while (fromNode && fromNode.nodeType === 1 && (fromNode as Element).id && !toIds.has((fromNode as Element).id)) {
      const gone: ChildNode = fromNode; fromNode = fromNode.nextSibling; from.removeChild(gone);
    }
    const toId = toNode.nodeType === 1 ? (toNode as Element).id : '';
    let match: ChildNode | null = null;
    if (toId) match = fromById.get(toId) ?? null;
    else if (fromNode && !(fromNode.nodeType === 1 && (fromNode as Element).id) && sameKind(fromNode, toNode)) match = fromNode;
    const keep = toNode.nodeType === 1 && (toNode as Element).hasAttribute('data-eureka-keep');
    if (match) {
      if (match !== fromNode) from.insertBefore(match, fromNode);
      if (!keep) morphNode(match, toNode, options); // a keep-placeholder means "unchanged": leave the node alone
      fromNode = match.nextSibling;
    } else if (keep) {
      const markup = options.resolveKeep?.(toId);
      const replacement = markup ? fragmentFrom(markup, from.ownerDocument ?? document).firstElementChild : null;
      from.insertBefore(replacement ?? toNode, fromNode);
    } else {
      from.insertBefore(toNode, fromNode); // adopt the new node (moves it out of `to`)
    }
    toNode = nextTo;
  }
  while (fromNode) { const n: ChildNode | null = fromNode.nextSibling; from.removeChild(fromNode); fromNode = n; }
}

function sameKind(a: Node, b: Node): boolean {
  return a.nodeType === b.nodeType && (a.nodeType !== 1 || (a as Element).tagName === (b as Element).tagName);
}

export function morphNode(from: ChildNode, to: ChildNode, options: MorphOptions = {}): void {
  if (from.nodeType !== 1) { if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue; return; }
  const f = from as Element, t = to as Element;
  if (f.tagName !== t.tagName) { f.replaceWith(t); return; }
  morphAttributes(f, t);
  syncControl(f, t);
  if (t.tagName !== 'TEXTAREA') morphChildren(f, t, options);
}

const KEEP: Record<string, Set<string>> = { DIALOG: new Set(['open']) };

function morphAttributes(from: Element, to: Element): void {
  const keep = KEEP[from.tagName];
  for (const a of Array.from(to.attributes)) if (from.getAttribute(a.name) !== a.value) from.setAttribute(a.name, a.value);
  for (const a of Array.from(from.attributes)) if (!to.hasAttribute(a.name) && !keep?.has(a.name)) from.removeAttribute(a.name);
}

function syncControl(from: Element, to: Element): void {
  switch (from.tagName) {
    case 'INPUT': {
      const f = from as HTMLInputElement, t = to as HTMLInputElement;
      if (f.type === 'checkbox' || f.type === 'radio') { if (f.checked !== t.hasAttribute('checked')) f.checked = t.hasAttribute('checked'); }
      else if (f.type !== 'file') { const v = t.getAttribute('value') ?? ''; if (f.value !== v) f.value = v; }
      break;
    }
    case 'TEXTAREA': { const f = from as HTMLTextAreaElement, v = to.textContent ?? ''; if (f.value !== v) f.value = v; if (f.defaultValue !== v) f.defaultValue = v; break; }
    case 'OPTION': { const f = from as HTMLOptionElement, sel = to.hasAttribute('selected'); if (f.selected !== sel) f.selected = sel; break; }
    case 'DETAILS': { const f = from as HTMLDetailsElement, open = to.hasAttribute('open'); if (f.open !== open) f.open = open; break; }
  }
}

/** Parse markup into a detached fragment. */
export function fragmentFrom(markup: string, doc: Document = document): DocumentFragment {
  const tpl = doc.createElement('template');
  tpl.innerHTML = markup;
  return tpl.content;
}
