// Social accounts linked from the footer. Same data-layer pattern as the rest of
// lib/: one array, so a dead or renamed handle is a one-line edit.
//
// IMPORTANT: audit each URL before pasting it in. Old sites accumulate dead,
// abandoned, or hijacked handles, and a footer of 404s reads worse than no links.
// The footer only renders entries whose url is real (see isPlaceholder gating in
// SiteFooter.astro), so leaving a placeholder here simply hides that icon.
//
// Adding an account later: append an entry below. Icon artwork for instagram,
// youtube and reddit already exists in SiteFooter.astro, so those three are a
// one-line addition; a genuinely new platform needs a path added there too.

export type SocialPlatform = 'facebook' | 'x' | 'pinterest' | 'instagram' | 'youtube' | 'reddit';

export interface SocialLink {
  platform: SocialPlatform;
  /** Used in the accessible name, e.g. "I LOVE SAI on Facebook". */
  label: string;
  url: string;
}

// Order is deliberate: most-active account first.
export const socialLinks: SocialLink[] = [
  { platform: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/ilovesaiglobal' },
  { platform: 'x', label: 'X', url: 'https://x.com/ILoveSaiGlobal' },
  {
    platform: 'pinterest',
    label: 'Pinterest',
    url: 'https://www.pinterest.com/ilovesai/i-love-sai/',
  },
];
