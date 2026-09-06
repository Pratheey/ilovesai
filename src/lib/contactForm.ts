import { locations } from './locations';

// Shared by the form and the endpoint that receives it. One definition, so the
// server can re-check a submission against exactly the list the page rendered
// from — a <select> tells you nothing about what was actually posted.
export const REQUEST_TYPES = [
  { value: 'general', label: 'General inquiry' },
  { value: 'aao-sai', label: 'Request Aao Sai' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'other', label: 'Other' },
] as const;

export type RequestTypeValue = (typeof REQUEST_TYPES)[number]['value'];

export const DEFAULT_REQUEST_TYPE: RequestTypeValue = 'general';

/** Chosen when someone doesn't know which region they belong to — most newcomers. */
export const UNSURE_REGION = 'unsure';

export const REGION_VALUES: string[] = [
  ...locations.map((location) => location.region),
  UNSURE_REGION,
];

/**
 * A URL fragment that names a request type preselects it — /contact#aao-sai from
 * the Aao Sai project page, /contact#volunteer from Walk for Sai. The fragment
 * is the value itself, so linking somewhere new needs no mapping table; an
 * unknown fragment (or a plain #form) just leaves the default in place.
 */
export function requestTypeFromHash(hash: string): RequestTypeValue | undefined {
  const value = hash.replace(/^#/, '');
  return REQUEST_TYPES.find((type) => type.value === value)?.value;
}
