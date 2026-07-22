import type { Region } from './locations';

export interface Arathi {
  /** Display name, e.g. "Kakad Arathi". */
  name: string;
  /**
   * 24-hour clock time as "HH:MM" (e.g. "05:15"). Stored in 24-hour form so it's
   * unambiguous to edit and sorts naturally; formatted to a 12-hour string for
   * display via formatArathiTime().
   */
  time: string;
  /** Optional short label shown above the name, e.g. "Dawn". */
  note?: string;
}

export interface Temple {
  /** Stable slug — used to build the tab/panel element ids. Keep it unique. */
  id: string;
  /** Display name, e.g. "Shirdi Sai Temple, Chicago". */
  name: string;
  /** Optional region tag, shown only when set (see ArathiSchedule.astro). */
  location?: Region;
  /** This temple's daily arathi schedule, in order through the day. */
  arathis: Arathi[];
}

// The homepage Arathi section reads this list. Each temple becomes a tab (tabs
// only appear when there's more than one); each temple's `arathis` become the
// timings grid. Edit / add / remove temples or arathis here and the section
// adapts — no component changes needed. Kept as a plain typed array (same pattern
// as lib/events.ts, lib/projects.ts) so it can later move to a CMS like Sanity
// without touching the component.
export const temples: Temple[] = [
  {
    id: 'primary',
    name: '[PLACEHOLDER: primary temple name & city]',
    arathis: [
      { name: 'Kakad Arathi', time: '05:15', note: 'Dawn' },
      { name: 'Madhyan Arathi', time: '12:00', note: 'Noon' },
      { name: 'Dhoop Arathi', time: '18:30', note: 'Evening' },
      { name: 'Shej Arathi', time: '21:30', note: 'Night' },
    ],
  },
  {
    id: 'temple-2',
    name: '[PLACEHOLDER: second temple name & city]',
    arathis: [
      { name: 'Kakad Arathi', time: '06:00', note: 'Dawn' },
      { name: 'Madhyan Arathi', time: '12:00', note: 'Noon' },
      { name: 'Dhoop Arathi', time: '19:00', note: 'Evening' },
      { name: 'Shej Arathi', time: '22:00', note: 'Night' },
    ],
  },
];

// Hardcoded 'en' for now — switch to the page's locale once i18n routing exists,
// matching the approach in UpcomingEvents.astro.
const timeFormatter = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' });

/** Format a stored "HH:MM" 24-hour time as a 12-hour display string ("5:15 AM"). */
export function formatArathiTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return timeFormatter.format(date);
}
