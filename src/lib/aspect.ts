// aspect.ts — maps the "w:h" aspect prop strings used across the devotional
// image components to literal Tailwind classes.
//
// Astro's native CSP feature (astro.config.mjs) hashes inline <style> tags and
// <script> tags, but NOT inline style="" attributes — a browser enforcing the
// resulting style-src policy blocks any element with a style attribute
// outright ("Applying inline style violates the following Content Security
// Policy directive..."). PhotoNeeded.astro and ImageBand.astro were both
// setting `aspect-ratio` via style={...}, which meant the ratio silently never
// applied in production and every affected page logged a CSP violation.
//
// The fix is to express aspect ratio as a class instead, but Tailwind's JIT
// scanner only picks up classes it can see as literal strings in source — an
// interpolated `aspect-[${aspect}]` is invisible to it and gets purged. This
// map exists so every class the components might apply is written out in
// full, here, where the scanner can find it.
export const ASPECT_CLASS: Record<string, string> = {
  '21:9': 'aspect-[21/9]',
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '3:2': 'aspect-[3/2]',
  '3:4': 'aspect-[3/4]',
  '1:1': 'aspect-square',
};
