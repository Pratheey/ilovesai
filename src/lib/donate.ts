// Hosted checkout (Donorbox) — card data never touches this site. Every Donate
// link across the site points here. Not a secret (it's meant to be clicked in
// a plain <a href>), so this is a constant, not an env var.
//
// This must stay a plain redirect to Donorbox's fully-hosted page, not their
// embeddable iframe/JS-widget alternative — the embed would need `donorbox.org`
// added to script-src/frame-src in public/_headers. Switching to it later means
// revisiting that CSP, not just this file.
export const DONATE_URL = '[PLACEHOLDER: real Donorbox hosted donation page URL]';
