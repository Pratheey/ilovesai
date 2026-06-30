# I Love Sai

A rebuild of [ilovesai.com](https://ilovesai.com) — the website of I LOVE SAI, a
global devotional and charitable movement centred on Shri Shirdi Sai Baba.

Read **[CLAUDE.md](./CLAUDE.md)** first — it's the source of truth for how this
project is built (stack, design system, security rules, working conventions).
**[docs/site-blueprint.md](./docs/site-blueprint.md)** is the page-by-page plan
and build log: what's built, what's still a `[PLACEHOLDER]`, and why.

## Stack

Astro 7 (static-first) · Tailwind CSS v4 (CSS-first config, tokens in
`src/styles/global.css`) · Astro Actions + the Cloudflare adapter for the two
form pages (`/get-involved`, `/contact`) · Cloudflare Pages hosting · Cloudflare
Turnstile + Resend for form notifications · a hosted checkout (Donorbox) for
donations — card data never touches this site.

## Commands

| Command               | Action                                       |
| :--------------------- | :-------------------------------------------- |
| `npm install`          | Install dependencies                          |
| `npm run dev`           | Local dev server with HMR                     |
| `npm run build`         | Production build to `./dist/`                 |
| `npm run preview`       | Preview the production build locally          |
| `npm run check`         | Type + template diagnostics (`astro check`)   |
| `npm run lint`          | ESLint                                        |
| `npm run format`        | Prettier                                      |

Run `check`, `lint`, and `build` before considering any change done.

## Environment

Secrets (`RESEND_API_KEY`, `EMAIL_FROM`, `TURNSTILE_SECRET_KEY`,
`TURNSTILE_SITE_KEY`) are read at runtime via `cloudflare:workers`, not Vite's
`.env`. Locally they go in `.dev.vars` (gitignored); see `.env.example` for the
names. In production they're set as Cloudflare Pages environment
variables/secrets — never committed.
