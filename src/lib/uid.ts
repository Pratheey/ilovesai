// Astro's `---` frontmatter runs once per component render, not once per module,
// so a counter declared there resets on every render and hands every instance the
// same number. Module scope is the only place a counter actually persists across
// renders in a build pass.
//
// Deterministic on purpose: crypto.randomUUID() also works, but it makes every
// build emit different HTML for every page containing the component, which busts
// caches and stops builds being reproducible.
let counter = 0;

/** A per-render-pass unique id, e.g. nextUid('diya') -> "diya-1", "diya-2", … */
export function nextUid(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}
