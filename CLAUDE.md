# CLAUDE.md — I Love Sai

> This file is read at the start of every Claude Code session. It is the source of
> truth for how this project is built. If a request conflicts with the rules here,
> stop and raise the conflict instead of guessing.

## What this is

A modern rebuild of ilovesai.com — the website of I LOVE SAI, a global devotional
and charitable movement centred on Shri Shirdi Sai Baba. The site exists to:

- explain the mission, Sai Baba, and Shirdi to newcomers,
- showcase ongoing projects and charitable activities,
- let visitors get involved, register, and donate,
- eventually serve a global, multilingual audience.

**Audience:** devotees and well-wishers worldwide, spanning a wide age range and
many first languages. Many are not highly technical. Clarity, warmth, readability,
and accessibility matter more than cleverness.

**Tone of the product:** reverent, calm, welcoming, uncluttered. Never flashy.

## Tech stack

- **Astro 6** — static-first, ships near-zero JS. This is the whole site.
- **Tailwind CSS v4** — via the `@tailwindcss/vite` plugin. Tokens live in
  `src/styles/global.css` under `@theme` (CSS-first config; there is NO
  `tailwind.config.js`). Do not reintroduce `@astrojs/tailwind` — it is deprecated.
- **Sanity** — headless CMS. Non-technical members edit content here (e.g. adding
  images to the homepage carousel). Schemas live in `sanity/schemaTypes/`.
- **Hosting:** Cloudflare Pages, with Cloudflare in front for WAF / DDoS / bot
  protection.
- **Forms:** Cloudflare Turnstile + a serverless function for validation. No
  credentials in client code, ever.
- **Donations:** hosted checkout only (Donorbox / Stripe Checkout / PayPal). Card
  data NEVER touches this site. PCI scope stays SAQ-A.
- **Fonts:** self-hosted via `@fontsource` (privacy + tighter CSP). No external
  Google Fonts request.

## Repo layout

    /CLAUDE.md                     ← this file
    /astro.config.mjs              ← Tailwind Vite plugin + integrations
    /src
      /styles/global.css          ← Tailwind import + design tokens (@theme)
      /layouts                     ← page shells (BaseLayout.astro etc.)
      /components                  ← reusable UI (Carousel, ProjectCard, Nav…)
      /pages                       ← routes; i18n under /[lang]/ when added
      /lib                         ← Sanity client, helpers
    /sanity/schemaTypes            ← CMS content models
    /.claude/agents                ← review subagents (security, design)

## Commands

    npm run dev        # local dev server with HMR
    npm run build      # production build
    npm run preview    # preview the production build
    npm run check      # astro check (type + template diagnostics)
    npm run lint       # eslint
    npm run format     # prettier

Run `check`, `lint`, and `build` before declaring any task done.

## Design system

The full token set is defined in `src/styles/global.css`. Read it before building
any UI. Summary of the intent so you build *on system*:

- **Palette is grounded in Shirdi worship, not generic "devotional warmth":**
  `sandal` (sandalwood-paste base), `marigold` (garland saffron — primary accent),
  `ember` (the glow of Baba's perpetual *dhuni* fire — deeper accent / hover),
  `kumkum` (deep maroon — headings, footer, depth), `brass` (temple-brass — fine
  dividers and details), `ink` (warm near-black text, never pure `#000`).
- **Type:** `Marcellus` for display headings (inscriptional, temple-stone calm);
  `Mukta` for body — deliberately chosen because it ships with **Devanagari**, so
  future Hindi/Marathi translations are first-class, not bolted on. Two faces only.
- **Signature element:** a soft *dhuni* ember glow behind the hero, and a fine
  marigold-petal line used as a section divider — at low opacity, never busy.
- **Motion:** restrained. A gentle page-load settle and quiet hover states. Always
  respect `prefers-reduced-motion`.

### Things that would make this look AI-generated — do NOT do them

- Purple/indigo/blue gradients, glassmorphism, neon accents.
- Emoji in headings or UI labels.
- Centered-everything hero with a big number + small label.
- `01 / 02 / 03` numbered markers unless the content is a real ordered sequence.
- Generic shadcn defaults dropped in unchanged.
- Lorem ipsum. Use the real, migrated copy.
- Pure-black text, pure-black shadows, or 8px-radius-on-everything sameness.

## Accessibility floor (non-negotiable, every component)

- Semantic HTML; one `<h1>` per page; logical heading order.
- WCAG AA contrast minimum.
- Visible keyboard focus (use the `brass`/`ember` focus ring defined in tokens).
- All images require meaningful `alt` text (enforced in the Sanity schema too).
- Generous tap targets (min 44×44px). Body text ≥ 16px.
- `prefers-reduced-motion` respected for every animation.

## Internationalisation

English ships first, but build with i18n in mind: keep copy out of component logic,
use Astro's i18n routing under `/[lang]/`, and never hard-code text that a
translator will later need. The body typeface already supports Devanagari.

## Security rules (non-negotiable)

- No secrets in the repo. Use `.env` (gitignored) and host env config.
- Donations: hosted checkout only. Never collect card numbers on this site.
- Forms: server-side validation + Turnstile + a honeypot field + rate limiting.
- Set a strict Content-Security-Policy and the standard security headers
  (`HSTS`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
- Pin dependencies; keep `npm audit` clean; Renovate/Dependabot enabled.
- The `security-reviewer` subagent reviews every diff that touches forms, env,
  auth, headers, or third-party scripts.

## How to work (this is what keeps it from looking vibecoded)

1. **Plan first.** For anything non-trivial, use plan mode (`/plan` or Shift+Tab).
   Propose the approach and the files you'd touch. Wait for approval before editing.
2. **Small, reviewed steps.** One logical change per commit. Keep diffs reviewable.
3. **Stay in scope.** Do not refactor or touch files you weren't asked to touch.
   If you spot something worth changing, mention it — don't silently do it.
4. **No silent assumptions.** If a requirement is ambiguous, ask. State any
   assumption you do make, inline, so it can be corrected.
5. **Don't over-engineer.** Prefer the simplest thing that satisfies the brief.
   50 lines should not become 500. No speculative abstractions.
6. **Verify your work.** Run `check`/`lint`/`build`. Where possible, screenshot the
   result and compare against the design intent before saying it's done.
7. **Use the subagents.** `design-reviewer` after building UI; `security-reviewer`
   after anything touching the security surface above.
