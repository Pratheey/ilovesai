export type DayKey = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

/**
 * One continuous stretch the temple is open, as "HH:MM" 24-hour times. A day
 * with a midday close is two blocks; a day that runs straight through is one.
 */
export interface HourBlock {
  open: string;
  close: string;
}

export interface Arathi {
  /** Display name, e.g. "Kakad Arathi". */
  name: string;
  /**
   * 24-hour clock time as "HH:MM" (e.g. "08:30"). Stored in 24-hour form so it's
   * unambiguous to edit and sorts naturally; formatted to a 12-hour string for
   * display via formatArathiTime().
   */
  time: string;
  /**
   * Days this arathi moves. Only needed for the exceptions — Shej Arathi runs
   * half an hour later on Thursdays because the temple stays open into the
   * evening. Everything else runs at the same time every day.
   */
  overrides?: Partial<Record<DayKey, string>>;
}

export interface Temple {
  /** Stable slug — used to build the tab/panel element ids. Keep it unique. */
  id: string;
  /** Display name, e.g. "Shirdi Sai Temple". */
  name: string;
  /**
   * City + country, shown under the temple name. Keep it — with temples across
   * India / UK / USA in different timezones, the city is what tells a visitor
   * whose clock the times are on.
   */
  location?: string;
  /**
   * IANA timezone. This is what makes the schedule self-maintaining: "today" and
   * "up next" are resolved in the *temple's* zone, so a devotee in London sees
   * New Jersey's real day and its real next arathi, and DST is handled for free.
   * A one-line swap if a temple moves or a new one is added.
   */
  timezone: string;
  /** Opening hours for every day of the week. */
  hours: Record<DayKey, HourBlock[]>;
  /** The daily arathi schedule, in order through the day. */
  arathis: Arathi[];
}

// Weekdays with a midday close — the temple's most common shape.
const MIDDAY_CLOSE: HourBlock[] = [
  { open: '08:30', close: '13:00' },
  { open: '17:30', close: '20:00' },
];
// Thursday — Baba's day. Open straight through, and late.
const THURSDAY: HourBlock[] = [{ open: '08:30', close: '21:30' }];
// Weekends — open straight through, ordinary evening close.
const WEEKEND: HourBlock[] = [{ open: '08:30', close: '20:00' }];

// The Arathi section reads this list. Each temple becomes a tab (tabs only
// appear when there's more than one); each temple's `hours` and `arathis` drive
// the panel. Nothing here is dated and nothing needs a daily edit — the
// component resolves the current day and the next arathi from `timezone` at view
// time. Kept as a plain typed array (same pattern as lib/events.ts,
// lib/projects.ts) so it can later move to a CMS like Sanity without touching
// the component.
export const temples: Temple[] = [
  {
    id: 'primary',
    name: '[PLACEHOLDER: temple name]',
    location: '[PLACEHOLDER: city, country]',
    timezone: 'America/New_York',
    hours: {
      mon: MIDDAY_CLOSE,
      tue: MIDDAY_CLOSE,
      wed: MIDDAY_CLOSE,
      thu: THURSDAY,
      fri: MIDDAY_CLOSE,
      sat: WEEKEND,
      sun: WEEKEND,
    },
    arathis: [
      { name: 'Kakad Arathi', time: '08:30' },
      { name: 'Shiva Abhishekam', time: '10:00' },
      { name: 'Baba Abhishekam', time: '11:30' },
      { name: 'Madhyan Arathi', time: '12:30' },
      { name: 'Dhoop Arathi', time: '17:30' },
      { name: 'Shej Arathi', time: '19:30', overrides: { thu: '20:00' } },
    ],
  },
  {
    id: 'temple-2',
    name: '[PLACEHOLDER: 2nd temple]',
    location: '[PLACEHOLDER: city, country]',
    timezone: 'Asia/Kolkata',
    hours: {
      mon: MIDDAY_CLOSE,
      tue: MIDDAY_CLOSE,
      wed: MIDDAY_CLOSE,
      thu: THURSDAY,
      fri: MIDDAY_CLOSE,
      sat: WEEKEND,
      sun: WEEKEND,
    },
    arathis: [
      { name: 'Kakad Arathi', time: '06:00' },
      { name: 'Madhyan Arathi', time: '12:00' },
      { name: 'Dhoop Arathi', time: '19:00' },
      { name: 'Shej Arathi', time: '22:00' },
    ],
  },
];

/** Monday-first — the order a week is read in. */
export const DAY_KEYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const DAY_LABELS: Record<DayKey, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

/** "Thursday" for 'thu'. */
export function dayLabel(day: DayKey): string {
  return DAY_LABELS[day];
}

// Hardcoded 'en' for now — switch to the page's locale once i18n routing exists,
// matching the approach in UpcomingEvents.astro. Formatted in UTC against a fixed
// reference date on purpose: "HH:MM" here is a wall-clock label, and building it
// off `new Date()` + setHours yields a nonexistent instant on a spring-forward
// morning, which is a real trap the day an early arathi lands in the skipped hour.
const timeFormatter = new Intl.DateTimeFormat('en', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'UTC',
});

/** Format a stored "HH:MM" 24-hour time as a 12-hour display string ("8:30 AM"). */
export function formatArathiTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  return timeFormatter.format(new Date(Date.UTC(2001, 0, 1, hours, minutes)));
}

/** Minutes since midnight for a stored "HH:MM" time. */
export function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Intl gives us the weekday *in the target timezone*, which is the whole point:
// deriving it from the visitor's own clock would show the wrong day for hours at
// a time to anyone on a different continent. Formatters are memoised because
// constructing one is the expensive part and these run on every page load.
const weekdayFormatters = new Map<string, Intl.DateTimeFormat>();

function weekdayFormatter(timezone: string): Intl.DateTimeFormat {
  let formatter = weekdayFormatters.get(timezone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'short' });
    weekdayFormatters.set(timezone, formatter);
  }
  return formatter;
}

/** Which day it currently is in the given timezone. */
export function dayKeyIn(timezone: string, now: Date = new Date()): DayKey {
  return weekdayFormatter(timezone).format(now).toLowerCase() as DayKey;
}

const clockFormatters = new Map<string, Intl.DateTimeFormat>();

function clockFormatter(timezone: string): Intl.DateTimeFormat {
  let formatter = clockFormatters.get(timezone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    clockFormatters.set(timezone, formatter);
  }
  return formatter;
}

/** Minutes since midnight in the given timezone. */
export function minutesNowIn(timezone: string, now: Date = new Date()): number {
  const parts = clockFormatter(timezone).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');
  // Some ICU builds render midnight as "24" under hour12:false — normalise it.
  return (hour % 24) * 60 + minute;
}
