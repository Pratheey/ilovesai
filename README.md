# I Love Sai

A rebuild of [ilovesai.com](https://ilovesai.com) — the website of I LOVE SAI, a
global devotional and charitable movement centred on Shri Shirdi Sai Baba.

Read **[CLAUDE.md](./CLAUDE.md)** first — it's the source of truth for how this
project is built (stack, design system, security rules, working conventions).
**[docs/site-blueprint.md](./docs/site-blueprint.md)** is the page-by-page plan
and build log: what's built, what's still a `[PLACEHOLDER]`, and why.

## Stack

Astro 7 (static-first — every route is prerendered) · Tailwind CSS v4 (CSS-first
config, tokens in `src/styles/global.css`) · Cloudflare Pages hosting. The site
is the org's **front door**: `/get-involved` and `/contact` are plain WhatsApp +
email links (no backend, no forms), and donations go to an **outbound hosted
PayPal** page — card data never touches this site (PCI SAQ-A).

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

No server environment variables are currently required — the site is fully
static (WhatsApp/email links + an outbound PayPal donate link). If a server-side
integration returns later, document its variables in `.env.example`, keep real
values in `.dev.vars` (gitignored) for local dev, and set them as Cloudflare
Pages environment variables/secrets in production — never committed.
