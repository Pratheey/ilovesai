export type Region = 'India' | 'UK' | 'USA';

export interface Location {
  region: Region;
  city: string;
  label: string;
  contactName?: string;
  /** Postal address, one line per array entry, rendered as an <address> block. */
  address?: string[];
  email?: string;
  /** Display form, spaced for readability; telHref() normalises it for tel: links. */
  phone?: string;
  lat?: number;
  lng?: number;
  mapEmbed?: string;
}

export const locations: Location[] = [
  {
    region: 'India',
    city: 'Shirdi',
    label: 'India',
    address: [
      'I Love Sai',
      'E-102, Sai Silver Oak Green View',
      'Laxmibhai Shinde Complex',
      'Pimpalwadi Road, Shirdi',
    ],
    email: 'india@ilovesai.com',
    phone: '+91 735 050 4000',
  },
  {
    region: 'UK',
    city: 'Harrow, London',
    label: 'UK',
    address: ['I Love Sai', '42 Orchard Grove', 'Harrow', 'London HA3 9QS', 'United Kingdom'],
    email: 'uk@ilovesai.com',
    phone: '+44 785 382 4006',
  },
  {
    region: 'USA',
    city: 'Livingston, New Jersey',
    label: 'USA',
    address: ['I Love Sai', '16 Highland Drive', 'Livingston', 'New Jersey'],
    email: 'usa@ilovesai.com',
    phone: '+1 646 685 4575',
  },
];

export function getLocation(region: Region): Location | undefined {
  return locations.find((location) => location.region === region);
}

/** tel: URIs must not carry spaces — strip everything but digits and a leading '+'. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

// True for fields still carrying this project's standard bracketed
// placeholder text rather than real, ready-to-publish data.
export function isPlaceholder(value: string | undefined): boolean {
  return !value || value.startsWith('[PLACEHOLDER');
}
