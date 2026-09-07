import type { Region } from './locations';

export interface SevaImage {
  image?: ImageMetadata | string;
  imageAlt: string;
}

export interface SevaEntry {
  /** Stable slug — used as the element key and the entry anchor. Keep it unique. */
  slug: string;
  title: string;
  /** When it happened. Every entry here is in the past — this is a record. */
  date: Date;
  location: Region;
  description: string;
  /** Photos from the day, if any. Omitted entirely when there are none. */
  images?: SevaImage[];
}

// ---------------------------------------------------------------------------
// What belongs here, and what doesn't
//
// This is the archive of one-off acts of seva — a food distribution, a cleaning
// drive, a planting day, a community gathering. Completed work that belongs to a
// *named project* (Walk for Sai, Babanchi Shirdi, Carpentersville) lives on that
// project's page in lib/projects.ts instead. Keeping the boundary means /seva
// stays a record of the things nothing else on the site would otherwise capture,
// rather than a second, competing telling of the projects.
//
// Sample/fixture data only — real records are [PLACEHOLDER] until someone
// supplies them, same convention as lib/events.ts. Dates are fixed rather than
// relative because a record of the past doesn't move.
// ---------------------------------------------------------------------------
export const sevaEntries: SevaEntry[] = [
  {
    slug: 'placeholder-food-2026',
    title: '[PLACEHOLDER: food distribution title]',
    date: new Date('2026-07-12'),
    location: 'USA',
    description: '[PLACEHOLDER: two or three sentences on what was done and who it reached.]',
    images: [
      { imageAlt: '[PLACEHOLDER: photo from the distribution]' },
      { imageAlt: '[PLACEHOLDER: second photo from the distribution]' },
      { imageAlt: '[PLACEHOLDER: third photo from the distribution]' },
    ],
  },
  {
    slug: 'placeholder-cleaning-2026',
    title: '[PLACEHOLDER: street cleaning drive title]',
    date: new Date('2026-03-08'),
    location: 'India',
    description: '[PLACEHOLDER: two or three sentences on what was done and who it reached.]',
    images: [
      { imageAlt: '[PLACEHOLDER: photo from the cleaning drive]' },
      { imageAlt: '[PLACEHOLDER: second photo from the cleaning drive]' },
    ],
  },
  {
    slug: 'placeholder-community-2025',
    title: '[PLACEHOLDER: community event title]',
    date: new Date('2025-11-22'),
    location: 'UK',
    description: '[PLACEHOLDER: two or three sentences on what was done and who it reached.]',
    images: [{ imageAlt: '[PLACEHOLDER: photo from the community event]' }],
  },
  {
    slug: 'placeholder-planting-2025',
    title: '[PLACEHOLDER: tree planting title]',
    date: new Date('2025-06-05'),
    location: 'India',
    description: '[PLACEHOLDER: two or three sentences on what was done and who it reached.]',
    images: [
      { imageAlt: '[PLACEHOLDER: photo from the planting day]' },
      { imageAlt: '[PLACEHOLDER: second photo from the planting day]' },
      { imageAlt: '[PLACEHOLDER: third photo from the planting day]' },
    ],
  },
  {
    slug: 'placeholder-spiritual-2024',
    title: '[PLACEHOLDER: devotional gathering title]',
    date: new Date('2024-10-19'),
    location: 'USA',
    description: '[PLACEHOLDER: two or three sentences on what was done and who it reached.]',
    images: [{ imageAlt: '[PLACEHOLDER: photo from the devotional gathering]' }],
  },
  {
    slug: 'placeholder-food-2024',
    title: '[PLACEHOLDER: winter food drive title]',
    date: new Date('2024-01-27'),
    location: 'UK',
    description: '[PLACEHOLDER: two or three sentences on what was done and who it reached.]',
    images: [
      { imageAlt: '[PLACEHOLDER: photo from the winter food drive]' },
      { imageAlt: '[PLACEHOLDER: second photo from the winter food drive]' },
    ],
  },
];

/**
 * Entries grouped by calendar year, newest year first and newest entry first
 * within each year — the order an archive is read in.
 */
export function sevaByYear(): { year: number; entries: SevaEntry[] }[] {
  const groups = new Map<number, SevaEntry[]>();

  for (const entry of [...sevaEntries].sort((a, b) => b.date.getTime() - a.date.getTime())) {
    // getUTCFullYear, not getFullYear: these dates are UTC midnight, so a
    // 1 January entry would group under the previous year west of Greenwich.
    const year = entry.date.getUTCFullYear();
    const group = groups.get(year);
    if (group) group.push(entry);
    else groups.set(year, [entry]);
  }

  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, entries]) => ({ year, entries }));
}
