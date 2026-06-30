import type { Region } from './locations';

export interface GalleryImage {
  region: Region;
  image?: ImageMetadata | string;
  imageAlt: string;
}

// Sample/fixture data only — a real slot for someone else to drop photos into,
// same as every other content array in this project. No real photos exist yet.
export const galleryImages: GalleryImage[] = [
  { region: 'India', imageAlt: '[PLACEHOLDER: photo from India]' },
  { region: 'India', imageAlt: '[PLACEHOLDER: photo from India]' },
  { region: 'UK', imageAlt: '[PLACEHOLDER: photo from UK]' },
  { region: 'UK', imageAlt: '[PLACEHOLDER: photo from UK]' },
  { region: 'USA', imageAlt: '[PLACEHOLDER: photo from USA]' },
  { region: 'USA', imageAlt: '[PLACEHOLDER: photo from USA]' },
];

export function getGalleryImages(region: Region): GalleryImage[] {
  return galleryImages.filter((image) => image.region === region);
}
