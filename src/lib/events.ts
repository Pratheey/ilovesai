import type { Region } from './locations';

export type EventType = 'aarti' | 'satsang' | 'festival' | 'aao-sai' | 'charity';

export interface Event {
  title: string;
  slug: string;
  start: Date;
  end?: Date;
  location: Region;
  type: EventType;
  summary: string;
  body?: string[];
  image?: ImageMetadata | string;
  imageAlt?: string;
  registrationUrl?: string;
}

const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

// Sample/fixture data only — real event details are [PLACEHOLDER] until there's a
// real schedule to migrate. Dates are relative to "now" so the upcoming-events
// filter has real past/future entries to demonstrate against at any point in time.
export const events: Event[] = [
  {
    title: '[PLACEHOLDER: past event title]',
    slug: 'sample-past-event',
    start: daysFromNow(-10),
    location: 'USA',
    type: 'aarti',
    summary: '[PLACEHOLDER: one-line summary]',
  },
  {
    title: '[PLACEHOLDER: event title]',
    slug: 'sample-event-1',
    start: daysFromNow(3),
    location: 'India',
    type: 'aarti',
    summary: '[PLACEHOLDER: one-line summary]',
  },
  {
    title: '[PLACEHOLDER: event title]',
    slug: 'sample-event-2',
    start: daysFromNow(10),
    location: 'UK',
    type: 'satsang',
    summary: '[PLACEHOLDER: one-line summary]',
  },
  {
    title: '[PLACEHOLDER: event title]',
    slug: 'sample-event-3',
    start: daysFromNow(20),
    location: 'USA',
    type: 'aao-sai',
    summary: '[PLACEHOLDER: one-line summary]',
  },
  {
    title: '[PLACEHOLDER: event title]',
    slug: 'sample-event-4',
    start: daysFromNow(35),
    location: 'India',
    type: 'festival',
    summary: '[PLACEHOLDER: one-line summary]',
  },
  {
    title: '[PLACEHOLDER: event title]',
    slug: 'sample-event-5',
    start: daysFromNow(50),
    location: 'UK',
    type: 'charity',
    summary: '[PLACEHOLDER: one-line summary]',
  },
];

export function getUpcomingEvents(count = 5): Event[] {
  const now = new Date();
  return events
    .filter((event) => event.start >= now)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, count);
}
