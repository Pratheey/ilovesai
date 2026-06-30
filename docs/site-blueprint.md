I LOVE SAI — Site Blueprint


A page-by-page plan for the rebuild. Drop this in docs/ and feed Claude Code
ONE page at a time (always in plan mode first). It assumes the stack and design
system in CLAUDE.md and src/styles/global.css. Never invent devotional/doctrinal
text — wherever real wording is needed it's marked [PLACEHOLDER].




Site map

/                     Home
/about                About hub  → /about/movement, /about/sai-baba, /about/shirdi
/projects             Projects index → /projects/[slug]  (Aao Sai, etc.)
/events               Events (upcoming list + cards)  → /events/[slug]
/get-involved         Ways to participate + the form
/locations            Where we are  → /locations/[region]  (india / uk / usa)
/contact              Contact + per-location details
Donate                External hosted checkout (button, not a page)

Header nav: About · Projects · Events · Get Involved · Contact.
Header quick-actions (echoing dallashanuman): Donate · Request Aao Sai · Events.


Shared systems (build these first; every page reuses them)

1. Logo component  (src/components/Logo.astro)

Goal: one component, used in header + footer, that switches variant by background.
Prep two source files as SVG (scalable, crisp, themeable, tiny):
src/assets/logo-color.svg (for light surfaces) and src/assets/logo-white.svg
(for the dark kumkum footer). If only a PNG exists, recreate it as SVG or use a
high-res transparent PNG at 2× the display size.

---
// src/components/Logo.astro
interface Props { variant?: 'color' | 'white'; class?: string }
const { variant = 'color', class: cls } = Astro.props;
---
<a href="/" class:list={['logo', cls]} aria-label="I Love Sai — home">
  {variant === 'white'
    ? <img src="/logos/logo-white.svg"  alt="" width="160" height="48" />
    : <img src="/logos/logo-color.svg"  alt="" width="160" height="48" />}
</a>

(alt="" because the link's aria-label already names it — avoids double
announcement.) Header uses <Logo />, footer uses <Logo variant="white" />.

Also derived from the logo, placed in public/ and referenced in BaseLayout <head>:


favicon.svg + favicon.ico
apple-touch-icon.png (180×180)
a maskable icon for PWA/Android
an Open Graph share image (og-default.png, ~1200×630) with the logo, so links
shared on WhatsApp/Facebook preview nicely.


2. Header  (src/components/SiteHeader.astro)

Sticky, accessible. Left: <Logo />. Center/right: nav. Far right: quick-actions
(Donate = marigold button → hosted checkout; Request Aao Sai → /get-involved#aao-sai;
Events → /events). Mobile: hamburger → full-screen menu, focus-trapped, Esc closes.

3. Footer  (src/components/SiteFooter.astro)

Kumkum background, white logo. Contents (the dallashanuman trust pattern):
mission one-liner · real contact email (FIX the someone@example.com placeholder) ·
locations quick links · current social links (drop the dead Google+; X not Twitter) ·
newsletter signup · charitable/registration status + ID [PLACEHOLDER] · auto-year
copyright. Brass hairline divider above it.

4. Location model (the "split by location" answer — see strategy note in chat)

Sanity location document: { region: 'India'|'UK'|'USA', city, label, contactName, email, phone, lat, lng, mapEmbed? }. Projects, events, and gallery images each
reference a location. This lets one site filter/group by place instead of cloning
the site per country.

5. Events model + Upcoming widget

Sanity event document: { title, slug, start (datetime), end?, location (ref), type: 'aarti'|'satsang'|'festival'|'aao-sai'|'charity', summary, body, image, registrationUrl? }.


UpcomingEvents.astro: queries the next 3–5 events with start >= now, sorted
ascending; renders date, time, title, location. Used on Home and /events top.
Each event → card → /events/[slug] detail page.


6. Project template  (src/layouts/ProjectLayout.astro + ProjectCard)

A reusable layout every project page uses (see Aao Sai mapping below).


Pages

Home  (/)

Use the agreed plan: hero ("Sabka Malik Ek", .dhuni-glow, one primary CTA) →
UpcomingEvents (3–5) → Latest projects grid → Ways to participate (Donate / Serve /
Organise) → quiet devotional line [PLACEHOLDER] → where-we-are cue (India · UK · USA)
→ donate trust band. Real photos throughout; scannable; mobile-first.

About hub  (/about)

A landing that routes to three substantial pages via three cards. Each sub-page uses
an "article" layout: prose styling (Tailwind typography), a table of contents on long
pages, pull-quotes for teachings, generous imagery, balanced headings. Modernizes the
three thin 2016 pages into one cohesive, readable experience.


/about/movement — who I Love Sai is: mission, vision, the "one God for all"
message, how it began, where it's active (pull from locations), values, charitable
status. [PLACEHOLDER for history specifics.]
/about/sai-baba — life, teachings (Shraddha & Saburi = faith & patience), the
Eleven Assurances [PLACEHOLDER — exact wording], significance. A vertical timeline
is a good, on-system device here (a real sequence). Respectful imagery.
/about/shirdi — the place: Dwarkamai, the perpetual dhuni, Samadhi Mandir,
and practical pilgrimage notes. Map + gallery.


Projects index  (/projects)

Intro line + responsive grid of ProjectCards (image, name, one-line essence,
location tag). Filter by location optional. Cards → /projects/[slug].

Project page template  (/projects/[slug]) — mapped to Aao Sai

The Aao Sai copy you provided maps cleanly onto a reusable structure. Every project
reuses these section slots; unused ones are simply omitted.


Hero — project name + one-line essence + image.
Aao Sai essence: welcoming Sai (in photo form) into your home, a free event run by
the I Love Sai team with prayers and aarti as done in Shirdi.
Origin / meaning (optional quote block) —
Aao Sai: the Satcharitra moment where Mhalsapati greets the young fakir "Ya Sai"
(Welcome, Sai), the name that stuck. Attribute: Shri Sai Satcharitra, Ch. 5, V. 29.
What it is — short intro paragraph. Aao Sai: a free event; Baba in photo form
plus two clay lamps are brought from Shirdi and remain with your family.
How it works — a 3-step sequence (numbered markers ARE appropriate here
because it's a genuine sequence):

Before — you request it and pick a date; plan it with the team; they create
digital invites; nothing is published publicly and no one is invited without
your consent (privacy/compliance).
During — team brings all pooja materials; prayers for your welfare; bhajans,
a Satcharita chapter reading, and aarti; a short intro to I Love Sai; host
provides simple food; team helps tidy up afterward.
After — follow-up for feedback; with consent, photos/videos may be shared
online (never your address or personal details); occasional voluntary-help
requests; old clothes may be collected for the needy.



Good to know — concise reassurance list: completely free of charge; privacy
and consent respected; what's provided vs. what the host provides.
CTA band — "Request Aao Sai" → /get-involved with the Aao Sai interest
preselected. Closing devotional line: "Know Sai, Know Life."
Related projects — cards for the others.


Other projects (Carpentersville, Walk for Sai, Babanchi Shirdi) reuse the same slots
with their own [PLACEHOLDER] content and a location tag.

Get Involved  (/get-involved)

Top: three parallel paths — Donate (→ hosted checkout), Serve (volunteer),
Organise / Host (Aao Sai + local activities). Below: one accessible form.
Form fields: name, email, region (from locations), interests (checkboxes: volunteer,
host Aao Sai, donate, general), message. Cloudflare Turnstile + honeypot +
server-side validation via a serverless function (security-reviewer gate applies).
Deep-linkable: /get-involved#aao-sai preselects the Host interest.

Events  (/events)

UpcomingEvents (next 3–5 with times) at the top, then the full list as cards
grouped by month, filterable by location and type. Cards → /events/[slug]. A full
month-grid calendar view is a "later" enhancement — the upcoming-list + cards covers
real need first and is easier to keep current.

Locations  (/locations)  +  region pages  (/locations/[region])

Overview: a map with markers + a card per region (India · UK · USA). Each region page
reuses Projects/Events/Gallery components filtered to that location, plus the local
contact. This is how the site "splits by location" without becoming three sites.

Contact  (/contact)

Per-region contact cards (from the location model): local contact name, email, phone,
map. Plus a simple contact form (can reuse the Get Involved form component). Real
contact details — not the old placeholder.


Build order (one commit each, plan-mode first, then the review gate)


Shared systems: Logo + favicons/OG, Header, Footer, Location & Event schemas.
Home.
Projects index + Project template (prove it with Aao Sai).
About hub + three sub-pages.
Events + UpcomingEvents widget + event detail.
Locations + region pages.
Get Involved + form (security-reviewer gate).
Contact.
Donate wiring (hosted checkout) (security-reviewer gate).
Hardening + accessibility pass; launch with redirects from old WP URLs.


Design-reviewer after every UI step; security-reviewer on forms, donations,
headers, env.