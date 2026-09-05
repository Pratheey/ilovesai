import { isPlaceholder } from './locations';

// The site's front door. A newcomer reaches the org through one of two channels:
// a loud WhatsApp button to the main coordinator, or a quiet email fallback.
// There is NO backend on this path — these two values are the whole integration,
// so a future handoff is a one-line swap here, not a code hunt.
//
// Neither value is a secret (both end up in a public href), so they live in the
// repo as plain constants, not env vars.

// Digits only, in international format, no '+' / spaces / dashes — that's the
// shape wa.me expects (e.g. '919876543210'). Swap in the coordinator's number.
export const whatsappNumber = '[PLACEHOLDER: main coordinator WhatsApp number, e.g. 919876543210]';

// Pre-filled greeting so the coordinator immediately knows where the person came
// from. Kept generic on purpose.
export const whatsappGreeting =
  "Hi, I found you through the I Love Sai website and I'd like to get involved.";

// The org's own inbox — the safety-net channel for people who don't use WhatsApp.
export const orgEmail = 'usa@ilovesai.com';

// How long a newcomer should expect to wait for a human reply. This is a promise
// made on the org's behalf, so it must be a real, comfortably achievable window
// set by the coordinator — never a guess. Phrase it to slot into "We usually
// reply …", e.g. 'within two or three days'. While it's a placeholder the page
// falls back to a warm line that promises nothing (see ResponseAssurance.astro).
export const responseTimeframe = 'within 2–3 days';

/** Click-to-chat link to the coordinator with the greeting pre-filled. */
export function whatsappHref(): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappGreeting)}`;
}

/** mailto: link to the org inbox. */
export function mailtoHref(): string {
  return `mailto:${orgEmail}`;
}

export { isPlaceholder };
