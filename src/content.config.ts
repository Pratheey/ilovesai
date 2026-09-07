import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const about = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/about' }),
  schema: z.object({
    title: z.string(),
    essence: z.string(),
    // The hero photo for this page's ImageBand/SacredFrame treatment (see
    // ArticleLayout.astro). Until a real photo lands, `heroPhoto` is the shot
    // description PhotoNeeded shows in its place — so bringing the real photo
    // in later is a frontmatter change, not a code change.
    heroPhoto: z.string().optional(),
    heroPhotoAlt: z.string().optional(),
  }),
});

export const collections = { about };
