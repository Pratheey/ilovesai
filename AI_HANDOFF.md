# AI_HANDOFF.md — I LOVE SAI

> Condensed, LLM-optimized context for continuing development without seeing the repo.
> For exhaustive detail see `PROJECT_CONTEXT.md`. For the live work-tracker + decision
> log see `PENDING.md`. Generated 2026-06-29; **updated 2026-06-29** after a product
> /scoping session.

> ⚠️ **READ THIS FIRST — direction changes decided 2026-06-29 (NOT yet in code):**
> A scoping session changed three things. They are **agreed but unimplemented**; the
> working tree still reflects the *old* state described in the body below. Items below
> tagged **[DECIDED — not built]** are the target, not the current reality. Full detail
> in `PENDING.md` §B.
> 1. **The site is a front door, nothing more.** The org runs on WhatsApp + Excel and a
>    website can't improve that. Scope = turn a stranger into someone who *gets involved*
>    or *donates*. Cut anything else.
> 2. **"Get involved" loses its backend.** The contact form / Astro Action / Resend are
>    to be **removed** and replaced by a loud **WhatsApp button** (`wa.me/<main guy>`) +
>    a quiet **`mailto:` org-email button**. This dissolves bugs #2 and #3, Turnstile on
>    that route, the `RESEND_API_KEY`, and the email-deliverability problem entirely.
> 3. **Donations are PayPal, not Donorbox.** (The Donorbox framing below was
>    aspirational/incorrect.) Live PayPal flow is **tested working**. New donate page =
>    tiered 4-option layout, outbound link only, never embedded.

## 1. What this is
A static-first **Astro 7** website for **I LOVE SAI** — a global devotional +
charitable movement centred on **Shirdi Sai Baba** — replacing an old WordPress site.
Hosted on **Cloudflare Pages**, ships near-zero JS. Audience: global, multi-age,
multilingual, often non-technical devotees. Tone: **reverent, calm, welcoming,
uncluttered, never flashy.** Clarity + accessibility > cleverness.

**Goals:** explain the mission/Sai Baba/Shirdi to newcomers; showcase projects;
let visitors get involved, register, and donate; eventually go multilingual.
**Scoping clarification (2026-06-29):** the site is the org's *front door* only — it does
**not** replicate the WhatsApp/Excel ops the org already runs on. Job = stranger →
involved or donated.

## 2. Status in one paragraph
**Structurally complete, content-incomplete.** Every page, route, layout, component,
form, and security surface exists; the project **type-checks cleanly** (`astro check`:
0 errors/0 warnings, 41 files) and **builds** (22 prerendered pages + 2 SSR routes).
What's missing is **content and credentials**, not engineering: nearly all copy is
`[PLACEHOLDER: …]`, all photos are placeholder boxes, and all external keys/URLs are
unset. ⚠️ **Critical caveat:** almost the entire site exists **only as uncommitted
working-tree changes** — the last git commit is just the homepage. Committing is the
single most urgent task. **Note:** the 2026-06-29 decisions (header) will *reduce* the
form/email/SSR surface once implemented — see `PENDING.md`.

## 3. Tech stack (don't swap these)
- **Astro 7** (core; SSG-first, islands). No React/Vue/Svelte.
- **Tailwind v4, CSS-first** via `@tailwindcss/vite`. Tokens in `src/styles/global.css`
  under `@theme`. **No `tailwind.config.js`.** **Never** reintroduce `@astrojs/tailwind`.
- **@astrojs/cloudflare** adapter (SSR + `cloudflare:workers` env). **@astrojs/mdx**,
  **@astrojs/sitemap**.
- **Self-hosted fonts** via `@fontsource`: **Marcellus** (display) + **Mukta** (body,
  Devanagari-capable). No Google Fonts request.
- **Zod** (via `astro/zod`) for validation.
- **Donations: PayPal** (hosted outbound link; verified working). *Donorbox is NOT used*
  — earlier drafts named it aspirationally.
- **Cloudflare Turnstile** (CAPTCHA) — **[DECIDED — removal pending]**: only needed if a
  form survives the get-involved/contact rework; if forms are fully removed, drop
  Turnstile + its two secrets.
- **Resend** (email) — **[DECIDED — to be removed]**: the no-backend WhatsApp+`mailto:`
  rework eliminates transactional email. Remove the dep + `RESEND_API_KEY`.
- **Sanity** is the *intended* CMS but is **not built yet** (and may stay deferred
  indefinitely — see `PENDING.md` §E/§I).
- TypeScript strict, ESLint flat config (+jsx-a11y), Prettier (+tailwind class sort),
  Node ≥22.12. Deps use caret ranges; the lockfile is the real pin.

## 4. Architecture
- **SSG by default.** Currently only `/get-involved` and `/contact` are SSR
  (`export const prerender = false`) — they read query params + runtime env and process
  form POSTs. **[DECIDED — not built]:** once those two become button-only (WhatsApp +
  `mailto:`), they should drop back to **SSG** and shed their per-route security
  machinery.
- **Forms = Astro Actions** (`src/actions/index.ts`: `getInvolved`, `contact`).
  **[DECIDED — `contact` to be removed]**; reassess `getInvolved` (the real intake is the
  org's downstream WhatsApp form — the site only hands the newcomer to the main guy).
- **Interactivity is CSS-first.** Two vanilla scripts: mobile-menu toggle (`SiteHeader`)
  + events filter (`events/index.astro`). No hydration framework. (Buttons added by the
  rework are plain `<a>` links — no new JS.)
- **Secrets** read via `cloudflare:workers`' `env` (server-only), never Vite
  `import.meta.env`. Local: `.dev.vars`; prod: Cloudflare config. Current names:
  `RESEND_API_KEY`, `EMAIL_FROM`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_SITE_KEY` — **all
  four are candidates for removal** under the rework (no email; Turnstile only if a form
  remains).

```
src/
  styles/global.css     ← Tailwind import + @theme tokens + base layer (READ FIRST)
  lib/*.ts              ← typed data fixtures + helpers (locations, projects, events,
                          gallery, donate, email[→removing], + NEW: contact/social)
  content/about/*.mdx   ← long-form About content (MDX collection)
  content.config.ts     ← about collection schema (Zod)
  actions/index.ts      ← form handlers — contact action slated for removal
  middleware.ts         ← security headers for SSR routes
  env.d.ts              ← merges secrets into Cloudflare.Env (prune as secrets drop)
  layouts/              ← BaseLayout (shell) + ArticleLayout (about) + ProjectLayout
  components/           ← Logo, SiteHeader, SiteFooter, Hero, Carousel, ProjectCard,
                          CTACard, EventCard, UpcomingEvents, PullQuote, Timeline,
                          PlaceholderImage
  pages/                ← file-based routes
public/                 ← favicons, logos, _headers, _redirects
```

## 5. Routes
SSG: `/`, `/about`, `/about/[slug]` (movement/sai-baba/shirdi), `/projects`,
`/projects/[slug]` (4 projects), `/events`, `/events/[slug]` (incl. past), `/locations`,
`/locations/[region]` (india/uk/usa, lowercased slugs), `/404`.
SSR: `/get-involved`, `/contact` — **[DECIDED — to become SSG]** post-rework.
Dynamic routes use `getStaticPaths()` over the `lib/*` arrays / about collection.
`public/_redirects` has 15 × 301 from old WordPress URLs.

## 6. Data layer (the pattern)
Each dataset = exported `interface`/`type` + exported array + helper(s). Pages import
these and shape data in frontmatter; **pages don't inline data** (the homepage is the
one exception — it hardcodes placeholder cards and should be migrated to use
`lib/projects.ts`). Key files:
- `lib/locations.ts` — `Region = 'India'|'UK'|'USA'`, `locations[]`, `getLocation()`,
  `isPlaceholder()`. Contact fields are all `[PLACEHOLDER]`.
- `lib/projects.ts` — 4 **real** projects (Aao Sai, Carpentersville/USA, Walk for Sai,
  Babanchi Shirdi/India). Real copy; placeholder images. Aao Sai has a 3-step stepper.
- `lib/events.ts` — 6 **sample** events with dates relative to `Date.now()`;
  `getUpcomingEvents()`.
- `lib/gallery.ts` — placeholder per-region photos; `getGalleryImages()`.
- `lib/donate.ts` — currently a `DONATE_URL` placeholder constant. **[DECIDED — not
  built]:** grows into an **array of giving options** (label, blurb, suggested amount,
  link) for the tiered PayPal donate page; all point at the one verified PayPal link for
  now (per-option dedicated PayPal buttons are a later upgrade).
- `lib/email.ts` — `sendNotificationEmail()` (Resend). **[DECIDED — to be removed]**.
- **NEW [DECIDED — not built]:** `lib/` entries for the **main guy's WhatsApp number +
  org email** (front-door buttons) and the **social links array** (footer). One value
  each, so a future handoff is a one-line edit.
Projects/events/gallery reference a location by its `Region` **key** (not embedded) —
that's how region pages filter/group.

## 7. Design system (build "on system")
Tokens in `global.css`. **Palette = the materials of Shirdi worship:** sandal /
sandal-deep (surfaces), **marigold** (primary accent), **ember** (hover/active),
**kumkum / kumkum-deep** (headings/footer/depth), **brass / brass-text** (detail/dividers),
**ink / ink-soft** (text, **never pure black**), cream (panels). Fluid type scale
(`text-display`…`text-eyebrow`). Signature = `.dhuni-glow` (ember radial behind heroes)
+ marigold hairline dividers. Modest radii, warm-tinted shadows.
**Banned (reads as AI-generated):** purple/indigo/blue gradients, glassmorphism, neon,
emoji in headings/UI, centered big-number heroes, `01/02/03` markers without a real
sequence, shadcn defaults, lorem ipsum, pure-black, uniform 8px radii.
**Donate page note:** reverent + calm, ties giving to real `lib/projects.ts` projects,
**no urgency/guilt mechanics**. Tiered (newcomer-legible options first), not flat boxes.

## 8. Accessibility floor (Must-fix, every change)
One `<h1>`/page; logical heading order (use `headingLevel` props on `ProjectCard`/
`EventCard` to avoid skips); WCAG AA contrast (use tokens — **ember fails AA as a
resting link on cream**, so `.prose` links are kumkum); visible focus ring
(`:focus-visible` ember); meaningful `alt` (or `alt=""` only when a labelled link names
the image); ≥44×44px tap targets; ≥16px body; honor `prefers-reduced-motion` (a global
rule disables all animation under it).
**New buttons/links:** external links get `rel="noopener noreferrer"`; **icon-only**
social links need real `aria-label`s.

## 9. Security model (non-negotiable)
- **No secrets in repo.** Read via `cloudflare:workers` `env`, server-only.
- **Donations: PayPal hosted outbound link only** — card data NEVER touches the site
  (PCI SAQ-A). Keep it a plain `<a href>`. **Never** embed PayPal's JS SDK / smart
  buttons (on-page fields) — that forces a CSP change and breaks SAQ-A. The principle is
  "**redirect, don't embed**" (it predates and outlives the Donorbox/PayPal choice).
  Donate links carry a `token=` — treat as semi-sensitive; don't post publicly.
- **Forms (in order):** honeypot (`_gotcha`, off-screen) → Turnstile server
  `siteverify` → Zod validation → **fail closed in production** if no Turnstile secret
  (dev/preview warn + skip) → **HTML-escape every interpolated user field** before email.
  `verifyTurnstile()` is the single shared security-critical copy — don't fork it.
  **[DECIDED — largely moot]:** with the contact form removed and no transactional email,
  most of this chain falls away. Whatever survives keeps these rules; pin survivors with
  tests.
- **CSP** = per-page `<meta>` via Astro `security.csp` (it hashes Astro's own inlined
  scripts/styles; a header `'self'` CSP breaks the site). Turnstile's origin is added
  narrowly, per form page, only when a site key exists, via `Astro.csp?.insert*()` —
  **prunable** once forms/Turnstile go.
- **Security headers** mirrored in `public/_headers` (static) **and** `src/middleware.ts`
  (SSR) — keep in sync: `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`,
  `Referrer-Policy`, `Permissions-Policy`, COOP, CORP, HSTS (no `preload` yet).

## 10. Content rules
Use real, migrated copy. **Never invent** scripture, biography, the Eleven Assurances
wording, Satcharitra citations, charitable-status text, or history — unknown copy stays
`[PLACEHOLDER: …]` (never lorem ipsum). Keep copy out of component logic (i18n-ready);
Astro i18n `/[lang]/` is planned; Mukta already covers Devanagari.
**Donate-specific:** the **memorial-tree** and **chapter-sponsorship** options name a
concrete deliverable — do **not** present them unless the owner confirms those programs
are *still running*. A mislabeled "plant a tree in their name" with no tree = a trust
failure. Suggested amounts are **guidance, not promises**; copy must not hard-claim a
currency (PayPal localizes per viewer).

## 11. Known bugs / gotchas (fix, don't reintroduce)
1. **Donate URL:** set the real verified **PayPal** link in `lib/donate.ts` (it's
   currently a placeholder). Live PayPal flow itself is confirmed working.
2. ~~Forms 500 in prod once Resend is keyed~~ — **DISSOLVED** by removing the contact
   form/Resend (no action layer to crash). N/A after rework.
3. ~~Resend `reply_to` snake-case~~ — **DISSOLVED** (no Resend call). N/A after rework.
4. **Homepage cards are dead placeholders** (no `href`, hardcoded) — migrate to
   `lib/projects.ts` and make them link. Serve/Organise homepage CTAs go to `#`. **Still
   open.**
5. **No OG/Twitter/canonical meta** in `BaseLayout`; **no `robots.txt`**. **Still open**
   — high priority for a newcomer-reach site.
6. Rate limiting on SSR endpoints is deferred to a Cloudflare dashboard rule — **may
   become moot** if `/get-involved` + `/contact` go SSG and no SSR endpoints remain.
   Reassess after the SSR→SSG pass.
7. Don't add fenced code blocks to About MDX without revisiting the Shiki/CSP warning.

## 12. Components (quick map)
`BaseLayout` → `SiteHeader`(+`Logo`, native `<dialog>` mobile menu) + `<main>` +
`SiteFooter`(+`Logo`, **+ social icon links [to add]**). `ArticleLayout`/`ProjectLayout`
extend `BaseLayout`. `Hero`→`Carousel`→`PlaceholderImage`. Cards: `ProjectCard`
(workhorse — projects, about, locations; optional `description`/`location`/`headingLevel`;
renders `<a>` if `href`), `CTACard` (optional `external`), `EventCard` (exports
`eventTypeLabels`; `data-type`/`data-location` drive the filter). `UpcomingEvents`,
`PullQuote`, `Timeline`, `PlaceholderImage` (universal image stand-in). All props-in/
HTML-out; only `SiteHeader` + events page ship a script.

## 13. Workflow & commands
```
npm install            # Node >= 22.12
npm run dev            # HMR (may not spawn in some sandboxes → use check/build/preview)
npm run check          # astro check (currently 0/0)
npm run lint           # eslint
npm run build          # → ./dist (currently passes)
npm run preview        # preview the build
npm run generate-types # wrangler types (only if wrangler.jsonc changes)
```
**Required gate before "done": `check` + `lint` + `build`.** Local secrets go in
`.dev.vars` (gitignored), not `.env`. Deploy via Cloudflare Pages Git integration
(`dist/` output; `_headers`/`_redirects` consumed natively). **No CI workflow exists**
(`.github/` has only `dependabot.yml`) — adding a minimal one is on the list.
**Review gates:** `design-reviewer` subagent after any UI; `security-reviewer` after
anything touching forms/env/auth/headers/donations/third-party scripts. Re-verify their
claims yourself (they've been wrong on specifics before).

## 14. Settled decisions (don't relitigate)
No map on Locations/Contact (3 fixed regions). No "related projects" grid on project
pages. Query params (not hashes) for any form preselect. Events filter is JS. CSP on
`security.csp`, not headers. `Header/Footer.astro` replaced by `SiteHeader/SiteFooter`.
Sanity deferred; data layer structured for a contained future swap.
**Added 2026-06-29:** site = front door only (not an ops tool); get-involved = WhatsApp
button + org `mailto:`, no backend; donations = PayPal outbound link (not Donorbox),
tiered 4-option page; social links = footer icon buttons from `lib/`.

## 15. Highest-priority next steps
1. **Commit the working tree** (ugly single WIP commit *now*; tasteful split later).
2. **Implement the get-involved rework** (WhatsApp + `mailto:` buttons; remove contact
   action + Resend; add contact/social data to `lib/`).
3. **Implement the tiered PayPal donate page**; set the real verified donate link.
4. Add **social links** to the footer (audit URLs first).
5. **Bug #4** (homepage cards → `lib/projects.ts`, wire links) + **OG/social meta +
   `robots.txt`**.
6. **SSR→SSG cleanup** on the two ex-form routes; prune dead Turnstile/CSP/middleware
   and unused secrets.
7. Fill real content/copy (no invented devotional text), real photography
   (`astro:assets` `<Image>`), remaining icons + OG image.
8. Add minimal CI (`check`+`lint`+`build`).
**Immediate owner move:** show the product to users for a feedback round *before*
drawing a launch line (also informs the Sanity/content-structure decision).
Later/roadmap: i18n (`/[lang]/`), Sanity CMS (or never), events calendar, newsletter,
HSTS preload, analytics, tests.

## 16. Open questions for the owner
Real PayPal donate link (+ confirm currency presentation in dashboard)? Real org email
+ main guy's WhatsApp number (for front-door buttons)? Audited social URLs? Are the
**tree** and **translation** programs still running (gates those donate options)?
Source of verified devotional/historical copy (Eleven Assurances, biography, Shirdi)?
Charitable registration name/number? Real per-region contacts? Photo sourcing/rights?
Is Sanity ever worth building, and on what timeline? Which i18n languages first?
**Resolved this session:** email routing (none — WhatsApp + `mailto:`), processor
(PayPal), DNS/deliverability (dissolved), submitter-confirmation email (none).

---
*Read `PENDING.md` for the live work-tracker, then `CLAUDE.md` and
`docs/site-blueprint.md` for decision rationale.*