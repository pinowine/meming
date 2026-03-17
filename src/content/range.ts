// select range: limiting the selection to a single text node
// unused in the final code but kept for reference
// export function getSelectionRangeSafe(): Range | null {
//   const sel = window.getSelection();
//   if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;

//   const range = sel.getRangeAt(0).cloneRange();

//   if (range.startContainer !== range.endContainer) return null;
//   if (range.startContainer.nodeType !== Node.TEXT_NODE) return null;
//   if (range.toString().trim().length < 2) return null;

//   return range;
// }

// hover text detector: locate text index under the cursor using caretPositionFromPoint
// reference: https://developer.mozilla.org/en-US/docs/Web/API/Document/caretPositionFromPoint
export function getHoverWordRange(
  clientX: number,
  clientY: number,
): Range | null {
  const doc = document;
  const pos = (doc as any).caretPositionFromPoint?.(clientX, clientY);
  const node: Node | null = pos?.offsetNode ?? null;
  const offset: number = pos?.offset ?? 0;

  if (!node || node.nodeType !== Node.TEXT_NODE) return null;

  const text = node.textContent ?? "";
  if (!text.trim()) return null;

  const isWordChar = (ch: string) => /[A-Za-z0-9\u2019'-]/.test(ch);

  let s = Math.min(Math.max(offset, 0), text.length);
  let e = s;

  while (s > 0 && isWordChar(text[s - 1])) s--;
  while (e < text.length && isWordChar(text[e])) e++;

  if (e - s < 2) return null;

  const range = doc.createRange();
  range.setStart(node, s);
  range.setEnd(node, e);

  return range;
}

export function isEditableTarget(el: Element | null): boolean {
  if (!el) return false;
  const editable = el.closest?.(
    'input,textarea,[contenteditable="true"],[contenteditable=""],[role="textbox"]',
  );
  return !!editable;
}
