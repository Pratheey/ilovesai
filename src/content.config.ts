import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const about = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/about' }),
  schema: z.object({
    title: z.string(),
    essence: z.string(),
  }),
});

export const collections = { about };
