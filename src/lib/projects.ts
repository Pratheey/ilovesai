import type { Region } from './locations';
import { DONATE_PATH } from './donate';

export interface ProjectStep {
  label: string;
  body: string;
}

export interface Project {
  slug: string;
  title: string;
  location?: Region;
  cardDescription: string;
  imageAlt?: string;
  essence: string;
  intro?: string[];
  quote?: { text: string; attribution: string };
  steps?: ProjectStep[];
  goodToKnowHeading?: string;
  goodToKnow?: string[];
  ctaHeading?: string;
  ctaLabel: string;
  ctaHref: string;
  /** True when ctaHref leaves the site — not set for projects whose CTA routes
   * to an internal page like /get-involved or /donate. */
  ctaExternal?: boolean;
  closingLine?: string;
}

export const projects: Project[] = [
  {
    slug: 'aao-sai',
    title: 'Aao Sai',
    cardDescription:
      "Aao Sai is a free devotional event where I Love Sai brings a photo of Sai Baba and sacred lamps to participants' homes for prayers, bhajans, and community celebration with family and friends.",
    imageAlt:
      "[PLACEHOLDER: photo of an Aao Sai home ceremony — Baba's photo, clay lamps, family gathered]",
    essence:
      "Welcoming Sai — in photo form — into your home: a free event run by the I Love Sai team, with prayers and an aarti just as it's done in Shirdi.",
    quote: {
      text: '"Ya Sai" — "Welcome, Sai" — the words Mhalsapati spoke when he first greeted the young fakir who would become known as Sai Baba, the name that stuck ever since.',
      attribution: 'Shri Sai Satcharitra, Ch. 5, V. 29',
    },
    intro: [
      'Aao Sai is completely free. A photo of Baba and two clay lamps are brought from Shirdi and remain with your family afterward.',
    ],
    steps: [
      {
        label: 'Before',
        body: 'You request a date and plan the event with the team; they create digital invites. Nothing is published publicly, and no one is invited without your consent.',
      },
      {
        label: 'During',
        body: 'The team brings all pooja materials and leads prayers for your welfare — bhajans, a chapter reading from the Satcharitra, and aarti — plus a short introduction to I Love Sai. You provide simple food; the team helps tidy up afterward.',
      },
      {
        label: 'After',
        body: 'The team follows up for feedback. With your consent, photos or videos may be shared online — never your address or other personal details. You may occasionally be invited to volunteer, and old clothes may be collected for the needy.',
      },
    ],
    goodToKnow: [
      'Completely free of charge.',
      'Your privacy and consent are respected at every step.',
      'The team provides all pooja materials; you provide simple food for guests.',
    ],
    ctaLabel: 'Request Aao Sai',
    ctaHref: '/get-involved',
    closingLine: 'Know Sai, Know Life — No Sai, No Life',
  },
  {
    slug: 'carpentersville',
    title: 'Carpentersville',
    location: 'USA',
    cardDescription:
      'Restoring a 134-year-old historic property in Carpentersville, Illinois into a charitable hub for daily congregations and food distribution.',
    imageAlt: '[PLACEHOLDER: photo of the Carpentersville property]',
    essence:
      "A 134-year-old property in Carpentersville, Illinois — built before 1918, during Baba's own lifetime — is being restored into a charitable hub.",
    intro: [
      'The property at 30 N Washington Street had stood vacant for three years before I Love Sai acquired it.',
    ],
    goodToKnowHeading: 'What Your Support Funds',
    goodToKnow: [
      'A fire sprinkler system and cosmetic repairs to meet code.',
      'A stage for Baba, in marble idol form.',
      'Daily congregations, as held in Shirdi.',
      'Weekly food, grain, and clothing donations collected for local shelters — already happening every Thursday across Cook County and Illinois.',
    ],
    ctaLabel: 'Support This Project',
    ctaHref: DONATE_PATH,
    closingLine: 'Baba Malik',
  },
  {
    slug: 'walk-for-sai',
    title: 'Walk for Sai',
    cardDescription:
      'A spiritual walking event — 5, 10, or 100 miles — held in India, UK, and USA in honour of Shirdi Sai Baba.',
    imageAlt: '[PLACEHOLDER: photo of devotees walking for Walk for Sai]',
    essence:
      'A spiritual walking pilgrimage — devotees chanting and walking 5, 10, or even 100 miles — held in India, the UK, and the USA.',
    intro: [
      "Walk for Sai draws on Maharashtra's Varkari Sampradya tradition — devotees walking on foot to Shirdi, the main route running roughly 161 miles from Mumbai — to give devotees everywhere that same experience in their own country.",
    ],
    goodToKnow: [
      'Walks of 5, 10, or 100 miles are organized in India, UK, and USA — timing varies by country.',
      'The 100-mile walk is annual and limited to trained participants; shorter walks are open to a broader audience.',
      'A modest fee covers a t-shirt and meals — some cities cover this through local sponsorship instead.',
      'Watch for the announcement in your country, then register to take part.',
    ],
    ctaLabel: 'Join a Walk',
    ctaHref: '/get-involved',
  },
  {
    slug: 'babanchi-shirdi-majhi-shirdi',
    title: 'Babanchi Shirdi, Majhi Shirdi',
    location: 'India',
    cardDescription:
      'A devotional initiative to restore Shirdi through tree planting and infrastructure improvements with a local foundation.',
    imageAlt: '[PLACEHOLDER: photo of Shirdi street restoration work]',
    essence:
      "Restoring Shirdi's streets — tree planting, clean drinking water, and public toilets — in partnership with the Green N Clean Shirdi Foundation.",
    quote: {
      text: '"It is the good fortune of Shirdi that this precious gem has associated itself with Shirdi." "Although He is carrying water on his shoulders to-day, He is not an ordinary person. Blessed is the soil of Shirdi on which He has set His foot."',
      attribution: 'Shri Sai Satcharitra, Chapter 5, Verses 38 & 39',
    },
    intro: [
      'Shirdi holds the same sacred status as pilgrimage sites like Varanasi, Tirupati, and Mecca — yet its streets often have no public toilets, no clean drinking water, little greenery, and heaps of litter.',
    ],
    goodToKnowHeading: "What We're Building",
    goodToKnow: [
      "Beautifying Shirdi's streets and planting roughly 100,000 trees.",
      'Building public drinking-water facilities and toilets.',
      'Supporting devotee-led street cleaning during visits.',
      "Preserving historic structures that remain from Baba's own time in Shirdi.",
    ],
    ctaLabel: 'Support This Initiative',
    ctaHref: DONATE_PATH,
    closingLine:
      "With folded hands, we urge you all, to please protect, preserve and promote the sanctity, cleanliness and greenness of our beloved Baba's Shirdi.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
