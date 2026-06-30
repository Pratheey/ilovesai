import { defineMiddleware } from 'astro:middleware';

// public/_headers only applies to statically-served Cloudflare Pages assets —
// it does NOT apply to the two non-prerendered routes (get-involved, contact)
// that run through a Pages Function instead. This sets the same header set
// there. Keep this in sync with public/_headers if either changes.
// CSP is intentionally NOT set here — see public/_headers for why (Astro's
// native security.csp feature owns it instead, as a per-page <meta> tag).
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
};

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(name, value);
  }
  return response;
});
