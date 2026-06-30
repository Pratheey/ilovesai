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
  // a <meta> CSP tag — see public/_headers and src/middleware.ts for the other
  // security headers, which still apply via HTTP headers as before. The only
  // real loss versus a header-based CSP is `frame-ancestors` (meta tags can't
  // carry it) — X-Frame-Options: SAMEORIGIN in the headers covers that gap.
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
