// Cloudflare Web Analytics — privacy-friendly, cookieless, no personal data.
//
// To enable: in the Cloudflare dashboard, add this site under Web Analytics and
// copy the token from the JS snippet it gives you (it looks like a long hex
// string). Paste it below. That's the only step — the beacon and the matching
// CSP allowances below switch on automatically once the token is non-empty, and
// stay off (with the CSP untouched) while it's blank.
//
// The token is NOT a secret — it's meant to live in the public page — so it's a
// plain constant here, not an env var.
export const CLOUDFLARE_WEB_ANALYTICS_TOKEN = '';

// Origins the beacon needs: the script host and the endpoint it reports to.
export const CLOUDFLARE_ANALYTICS_SCRIPT_ORIGIN = 'https://static.cloudflareinsights.com';
export const CLOUDFLARE_ANALYTICS_CONNECT_ORIGIN = 'https://cloudflareinsights.com';
