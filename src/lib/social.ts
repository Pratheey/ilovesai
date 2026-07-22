// Social accounts linked from the footer. Same data-layer pattern as the rest of
// lib/: one array, so a dead or renamed handle is a one-line edit.
//
// IMPORTANT: audit each URL before pasting it in. Old sites accumulate dead,
// abandoned, or hijacked handles, and a footer of 404s reads worse than no links.
// The footer only renders entries whose url is real (see isPlaceholder gating in
// SiteFooter.astro), so leaving a placeholder here simply hides that icon.

export type SocialPlatform = 'facebook' | 'instagram' | 'youtube' | 'reddit' | 'x';

export interface SocialLink {
  platform: SocialPlatform;
  /** Used in the accessible name, e.g. "I LOVE SAI on Facebook". */
  label: string;
  url: string;
}

export const socialLinks: SocialLink[] = [
  { platform: 'facebook', label: 'Facebook', url: '[PLACEHOLDER: Facebook URL]' },
  { platform: 'instagram', label: 'Instagram', url: '[PLACEHOLDER: Instagram URL]' },
  { platform: 'youtube', label: 'YouTube', url: '[PLACEHOLDER: YouTube URL]' },
  { platform: 'reddit', label: 'Reddit', url: '[PLACEHOLDER: Reddit URL]' },
  { platform: 'x', label: 'X', url: '[PLACEHOLDER: X (Twitter) URL]' },
];
