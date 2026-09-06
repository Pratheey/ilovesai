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
  //
  // Turnstile is the one third party the site loads. It needs its script, the
  // iframe it renders the challenge in, and the calls that iframe makes back.
  // Nothing else is allowed in, and `scriptDirective.resources` replaces Astro's
  // default script-src sources outright — hence 'self' being listed explicitly —
  // while leaving the per-build hashes for Astro's own inlined scripts intact.
  security: {
    // Explicit rather than relying on the default: this block now exists, and a
    // future edit here shouldn't be able to look complete while silently
    // dropping the cross-site POST check that guards /api/contact.
    checkOrigin: true,
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        'frame-src https://challenges.cloudflare.com',
        "connect-src 'self' https://challenges.cloudflare.com",
      ],
      scriptDirective: {
        resources: ["'self'", 'https://challenges.cloudflare.com'],
      },
    },
  },
});
