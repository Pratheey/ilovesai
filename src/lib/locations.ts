export type Region = 'India' | 'UK' | 'USA';

export interface Location {
  region: Region;
  city: string;
  label: string;
  contactName?: string;
  email?: string;
  phone?: string;
  lat?: number;
  lng?: number;
  mapEmbed?: string;
}

export const locations: Location[] = [
  {
    region: 'India',
    city: '[PLACEHOLDER: India city]',
    label: 'India',
    contactName: '[PLACEHOLDER: India contact name]',
    email: '[PLACEHOLDER: India contact email]',
  },
  {
    region: 'UK',
    city: '[PLACEHOLDER: UK city]',
    label: 'UK',
    contactName: '[PLACEHOLDER: UK contact name]',
    email: '[PLACEHOLDER: UK contact email]',
  },
  {
    region: 'USA',
    city: '[PLACEHOLDER: USA city]',
    label: 'USA',
    contactName: '[PLACEHOLDER: USA contact name]',
    email: '[PLACEHOLDER: USA contact email]',
  },
];

export function getLocation(region: Region): Location | undefined {
  return locations.find((location) => location.region === region);
}

// True for fields still carrying this project's standard bracketed
// placeholder text rather than real, ready-to-publish data.
export function isPlaceholder(value: string | undefined): boolean {
  return !value || value.startsWith('[PLACEHOLDER');
}
