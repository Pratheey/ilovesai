import type { APIContext } from 'astro';
// Astro 6 removed Astro.locals.runtime.env; this is how the adapter exposes
// Cloudflare secrets now. Locally they come from .dev.vars, in production from
// the Pages environment — never from a file in this repo.
import { env } from 'cloudflare:workers';
import { REQUEST_TYPES, REGION_VALUES, type RequestTypeValue } from '../../lib/contactForm';

// The site's only on-demand route. Everything else is prerendered.
export const prerender = false;

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_URL = 'https://api.resend.com/emails';

const LIMITS = { name: 100, email: 254, message: 2000 } as const;

// A legitimate submission is a few KB: the fields above plus a Turnstile token
// and multipart boundaries. Workers will happily buffer a 100 MB body, so this
// is checked before the body is read at all — LIMITS only applies after parsing,
// which is far too late to be a defence.
const MAX_BODY_BYTES = 32_768;
const ACCEPTED_CONTENT_TYPES = /^(multipart\/form-data|application\/x-www-form-urlencoded)/i;

// Same exclusion set on both sides of the @. The local part alone was strict
// while the domain admitted < > , ; " and \ — harmless in practice, since \s
// keeps CR/LF out and everything reaching Resend goes through JSON.stringify,
// but there's no reason for the two halves to disagree.
const EMAIL_PATTERN = /^[^\s@<>()[\],;:\\"]+@[^\s@.<>()[\],;:\\"]+(\.[^\s@.<>()[\],;:\\"]+)+$/;

/**
 * Best-effort flood guard, per worker isolate. It is genuinely weak — isolates
 * are ephemeral and Cloudflare runs many of them — so it stops a naive loop
 * against one isolate and nothing more. The durable limit belongs in a
 * Cloudflare rate-limiting rule in front of this route; that's tracked in
 * PENDING.md and should be in place before this endpoint goes live.
 */
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000, maxKeys: 5000 };
const recentByIp = new Map<string, number[]>();

/**
 * One machine routinely owns an entire IPv6 /64, so keying on the full address
 * would let a single host present billions of distinct "clients".
 */
function rateKey(ip: string): string {
  if (!ip) return 'unknown';
  if (!ip.includes(':')) return ip;
  return `${ip.split(':').slice(0, 4).join(':')}::/64`;
}

function evictStale(now: number): void {
  // Never clear() the whole map: wiping every counter is itself a reset
  // primitive — anyone able to present enough distinct keys to trip the cap
  // would erase their own record along with everyone else's.
  for (const [key, hits] of recentByIp) {
    const newest = hits[hits.length - 1];
    if (newest === undefined || now - newest >= RATE_LIMIT.windowMs) recentByIp.delete(key);
  }
  // Still oversized once expired entries are gone: drop the oldest quarter
  // rather than everything, so live counters mostly survive.
  if (recentByIp.size > RATE_LIMIT.maxKeys) {
    for (const key of [...recentByIp.keys()].slice(0, Math.ceil(recentByIp.size / 4))) {
      recentByIp.delete(key);
    }
  }
}

function rateLimited(ip: string): boolean {
  const key = rateKey(ip);
  const now = Date.now();
  const hits = (recentByIp.get(key) ?? []).filter((at) => now - at < RATE_LIMIT.windowMs);

  if (hits.length >= RATE_LIMIT.max) {
    // Deliberately not recording this attempt: appending while already over the
    // limit lets a sustained caller grow one array for the whole window.
    recentByIp.set(key, hits);
    return true;
  }

  hits.push(now);
  recentByIp.set(key, hits);
  if (recentByIp.size > RATE_LIMIT.maxKeys) evictStale(now);
  return false;
}

interface TurnstileResult {
  success?: boolean;
  hostname?: string;
  'error-codes'?: string[];
}

async function verifyTurnstile(
  token: string,
  secret: string,
  ip: string,
  expectedHost: string,
): Promise<boolean> {
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body });
    if (!response.ok) return false;
    const result = (await response.json()) as TurnstileResult;

    if (result.success !== true) {
      // Logged because a wrong or rotated secret returns invalid-input-secret
      // and fails every genuine visitor, while looking exactly like ordinary
      // bot traffic from the outside.
      console.error(
        '[contact] Turnstile rejected a token:',
        result['error-codes']?.join(',') ?? '',
      );
      return false;
    }

    // A token solved against this sitekey on another host — a *.pages.dev
    // preview deployment, typically — must not be replayable against the live
    // site. Skipped locally, where the host isn't the one Turnstile sees.
    if (expectedHost && result.hostname && result.hostname !== expectedHost) {
      console.error('[contact] Turnstile hostname mismatch:', result.hostname);
      return false;
    }

    return true;
  } catch {
    // A verification service we can't reach is not a pass.
    return false;
  }
}

function field(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

/** Newlines in a labelled value let a sender forge extra lines in the email. */
function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ');
}

// _headers only covers static assets, so a worker response has to carry its own.
const RESPONSE_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
} as const;

/**
 * A browser without JS posts this form normally, so it must land on a page, not
 * on raw JSON. The fragment is what /contact styles with :target to show the
 * outcome — no query string to parse and no JS required.
 */
function redirectTo(fragment: string): Response {
  return new Response(null, {
    status: 303,
    headers: { ...RESPONSE_HEADERS, Location: `/contact#${fragment}`, 'Cache-Control': 'no-store' },
  });
}

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...RESPONSE_HEADERS,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export async function POST(context: APIContext): Promise<Response> {
  const { request } = context;
  // The script sets this; its absence means a plain browser form post.
  const wantsJson = request.headers.get('X-Requested-With') === 'fetch';
  const fail = (status: number, message: string, fragment = 'send-failed') =>
    wantsJson ? json(status, { ok: false, message }) : redirectTo(fragment);
  const succeed = () => (wantsJson ? json(200, { ok: true }) : redirectTo('sent'));

  const ip = request.headers.get('CF-Connecting-IP') ?? '';

  // Cheap header checks first, so an oversized or wrong-typed body is refused
  // before this route spends anything parsing it.
  if (!ACCEPTED_CONTENT_TYPES.test(request.headers.get('Content-Type') ?? '')) {
    return fail(415, 'We could not read that submission. Please try again.');
  }
  const declaredLength = Number(request.headers.get('Content-Length') ?? Number.NaN);
  if (!Number.isFinite(declaredLength) || declaredLength > MAX_BODY_BYTES) {
    return fail(413, 'That message is too long. Please shorten it and try again.');
  }

  if (rateLimited(ip)) {
    return fail(429, 'Too many messages from this connection. Please try again a little later.');
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return fail(400, 'We could not read that submission. Please try again.');
  }

  // A filled honeypot is a bot. Report success: telling it what tripped the
  // filter only helps it try again.
  if (field(data, 'website') !== '') return succeed();

  const name = field(data, 'name');
  const email = field(data, 'email');
  const region = field(data, 'region');
  const requestType = field(data, 'requestType');
  const message = field(data, 'message');

  // Never trust the client's <select>: both of these are re-checked against the
  // same lists the page rendered from.
  const validRequestType = REQUEST_TYPES.some((type) => type.value === requestType);
  const validRegion = REGION_VALUES.includes(region);

  if (
    !name ||
    name.length > LIMITS.name ||
    !email ||
    email.length > LIMITS.email ||
    !EMAIL_PATTERN.test(email) ||
    !message ||
    message.length > LIMITS.message ||
    !validRequestType ||
    !validRegion
  ) {
    return fail(400, 'Please check the form and try again.');
  }

  if (!env.TURNSTILE_SECRET_KEY) {
    // Fail closed. An unconfigured deployment must not become an open relay to
    // the org's inbox.
    console.error('[contact] TURNSTILE_SECRET_KEY is not set; refusing the submission.');
    return fail(503, 'The form is unavailable right now. Please use WhatsApp or email instead.');
  }

  const host = new URL(request.url).hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost');
  const token = field(data, 'cf-turnstile-response');
  if (
    !token ||
    !(await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip, isLocal ? '' : host))
  ) {
    return fail(400, 'We could not verify that you are human. Please try again.');
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL || !env.CONTACT_TO_EMAIL) {
    console.error('[contact] Mail delivery is not configured; the message was not sent.');
    return fail(503, 'The form is unavailable right now. Please use WhatsApp or email instead.');
  }

  const typeLabel =
    REQUEST_TYPES.find((type) => type.value === (requestType as RequestTypeValue))?.label ??
    requestType;

  try {
    const response = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        // Only the validated enum reaches the subject. Everything the sender
        // typed stays in the body, where it can't forge a header.
        subject: `Website enquiry — ${typeLabel}`,
        reply_to: email,
        // The name is flattened and the message fenced: otherwise a name
        // containing a newline can print a second, plausible "Email:" line and
        // the person reading it can't tell which address the form captured.
        text: [
          `Request type: ${typeLabel}`,
          `Region: ${region}`,
          `Name: ${singleLine(name)}`,
          `Email: ${email}`,
          '',
          '--- message ---',
          message,
          '--- end of message ---',
        ].join('\n'),
      }),
    });

    if (!response.ok) {
      // The provider's response can carry account and key detail; it goes to the
      // log, never to the visitor.
      console.error('[contact] Mail provider rejected the send:', response.status);
      return fail(502, 'We could not send that just now. Please use WhatsApp or email instead.');
    }
  } catch {
    return fail(502, 'We could not send that just now. Please use WhatsApp or email instead.');
  }

  return succeed();
}

// Anything that isn't a POST — someone opening the URL directly, say — belongs
// back on the page rather than looking at an error.
export function GET(): Response {
  return new Response(null, {
    status: 303,
    headers: { ...RESPONSE_HEADERS, Location: '/contact' },
  });
}
