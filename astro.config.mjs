// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://ilovesai.com',
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), sitemap()],
  adapter: cloudflare(),

  // Astro inlines its own per-page <script>/<style> output (hoisted scripts,
  // scoped component styles) rather than always externalizing it, so a plain
  // `script-src/style-src 'self'` CSP blocks Astro's own markup. This computes
  // per-build hashes for that inlined output automatically and renders it into
  // a <meta> CSP tag — see public/_headers for the other security headers, which
  // apply via HTTP headers. `frame-ancestors` can't ride in a <meta> tag, so
  // public/_headers carries it as a complementary CSP header (plus X-Frame-
  // Options: SAMEORIGIN as the legacy fallback).
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
});
