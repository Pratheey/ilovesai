export interface TeamMember {
  name: string;
  role: string;
  /** Optional photo; falls back to a placeholder until a real one is supplied. */
  image?: ImageMetadata | string;
  imageAlt?: string;
}

// The core team shown on /about/team. Only people listed here appear, so it stays
// opt-in — no one is published without being added deliberately. Same data-layer
// pattern as the rest of lib/ (one typed array), so it can move to a CMS later
// without touching the page. Keep this to the core team, not a full directory.
export const team: TeamMember[] = [
  { name: '[PLACEHOLDER: name]', role: '[PLACEHOLDER: role]' },
  { name: '[PLACEHOLDER: name]', role: '[PLACEHOLDER: role]' },
  { name: '[PLACEHOLDER: name]', role: '[PLACEHOLDER: role]' },
  { name: '[PLACEHOLDER: name]', role: '[PLACEHOLDER: role]' },
];
