export interface SpecialEvent {
  /**
   * The switch the org actually flips. False and the homepage section does not
   * render at all — no empty band, no "nothing scheduled" apology.
   */
  active: boolean;
  title: string;
  /** Start of the event. */
  date: Date;
  /** Only for something that runs across several days (a festival). */
  endDate?: Date;
  description: string;
  image?: ImageMetadata | string;
  imageAlt?: string;
  /** Optional — omit both and the section renders without a button. */
  ctaHref?: string;
  ctaLabel?: string;
}

const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

// The one special event the homepage promotes, sitting directly under the hero.
// Sample/fixture content with `active: false`, so nothing shows until someone
// fills it in and flips the flag — same convention as lib/events.ts.
//
// One event, not an array: this is the "what's happening right now" slot, and a
// list of several would just be /events again in a louder typeface.
export const specialEvent: SpecialEvent = {
  active: false,
  title: '[PLACEHOLDER: special event title]',
  date: daysFromNow(14),
  description: '[PLACEHOLDER: two or three sentences on what the event is and who it is for.]',
  imageAlt: '[PLACEHOLDER: photo or flyer for the event]',
  ctaHref: '/events',
  ctaLabel: 'Event details',
};

/**
 * The event to promote, or undefined when there is nothing to show.
 *
 * Expires on its own once the last day has passed, so a flag someone forgets to
 * turn off stops advertising a festival that already happened. Note this is
 * evaluated when the site is built, not when it is viewed — the homepage is
 * prerendered — so the expiry lands on the next deploy rather than at midnight.
 * That's the right trade here: the section's content is static anyway, so
 * anything that changes it involves a deploy.
 */
export function getActiveSpecialEvent(): SpecialEvent | undefined {
  if (!specialEvent.active) return undefined;

  // Runs through the whole of its final day, not until its start time.
  const lastDay = specialEvent.endDate ?? specialEvent.date;
  const endOfLastDay = new Date(lastDay);
  endOfLastDay.setHours(23, 59, 59, 999);

  return endOfLastDay >= new Date() ? specialEvent : undefined;
}
